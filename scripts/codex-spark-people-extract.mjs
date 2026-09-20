#!/usr/bin/env node

// A deliberately narrow, host-validated lane for spare Codex Spark capacity.
// Spark sees one sealed compact packet and returns JSON; it never receives a writable repo.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCompactPeopleExtractionSeed,
  buildPeopleChunkWorkerPacket,
  buildPeopleExtractionPacket,
} from './build-people-extraction-packet.mjs';
import {
  assembleCompactPeopleChunks,
  buildPeopleChunkPacket,
  normalizePeopleExtractionChunkPlan,
  peopleChunkRunRecord,
  planPeopleExtractionChunks,
  splitPeopleExtractionChunk,
} from './lib/people-extraction-chunks.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { PEOPLE_DIR, REPO_ROOT, extractionPath, normalizedChapterId, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import {
  DEFAULT_PEOPLE_QUEUE_BASE_REF, DEFAULT_PEOPLE_QUEUE_BRANCH, DEFAULT_PEOPLE_QUEUE_REMOTE,
  claimIsActive, claimRemotePeopleTargets, markRemotePeopleClaims, readRemotePeopleWorkLedger,
  validatePeopleWorkLedger,
} from './lib/people-work-queue.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const MODEL = 'gpt-5.3-codex-spark';
const WORKER_MAX_BYTES = 48 * 1024;
const INSTRUCTIONS = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-extraction-compact.txt'), 'utf8').trim();
const SCHEMA = path.join(PEOPLE_DIR, 'schema', 'compact-extraction.schema.json');
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage: npm run people:extract:spark -- --book BOOK --chapter NNN [--dry-run|--run]

Spark is a sealed, chunked extraction lane. --dry-run is the default and writes nothing.
--run claims the chapter atomically, invokes Codex with a read-only sandbox for every sealed
chunk, then host-validates and assembles the chapter. Translation repairs remain proposed
evidence; this command never edits a translation chapter or applies an editorial decision.`);
}

function args(argv) {
  const o = { book: null, chapter: null, run: false, dryRun: false, worker: `${os.hostname()}-codex-spark`, remote: process.env.PEOPLE_QUEUE_REMOTE ?? DEFAULT_PEOPLE_QUEUE_REMOTE, branch: process.env.PEOPLE_QUEUE_BRANCH ?? DEFAULT_PEOPLE_QUEUE_BRANCH, baseRef: process.env.PEOPLE_QUEUE_BASE_REF ?? DEFAULT_PEOPLE_QUEUE_BASE_REF };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]; const next = () => { const v = argv[++i]; if (!v || v.startsWith('--')) throw new Error(`${a} requires a value`); return v; };
    if (a === '--book') o.book = next(); else if (a === '--chapter') o.chapter = normalizedChapterId(next());
    else if (a === '--run') o.run = true; else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--worker-id') o.worker = next(); else if (a === '--queue-remote') o.remote = next(); else if (a === '--queue-branch') o.branch = next();
    else if (a === '--self-test') o.selfTest = true; else if (a === '--help' || a === '-h') { usage(); process.exit(0); } else throw new Error(`Unknown option: ${a}`);
  }
  if (o.selfTest) return o;
  if (!o.book || !o.chapter) throw new Error('--book and --chapter are required; Spark does not run bulk waves');
  if (o.run && o.dryRun) throw new Error('--run and --dry-run cannot be combined');
  return o;
}

function prompt(target, packet, chunk) {
  const worker = buildPeopleChunkWorkerPacket(packet, chunk);
  const seed = buildCompactPeopleExtractionSeed(buildPeopleChunkPacket(packet, chunk), MODEL);
  return `Return ONLY one JSON object conforming to the supplied compact extraction schema. Perform person extraction for owned chunk ${chunk.id} of ${target.book}/${target.chapter}. This is sealed packet-only work: do not inspect files, browse, use subagents, or run shell commands. Do not propose edits to source translations; translationRepairs are evidence proposals only. Process every owned unit and candidate, preserve the seed input and run metadata exactly, and do not emit people or claims for read-only context units. Set coverage only when true.\n\n<instructions>\n${INSTRUCTIONS}\n</instructions>\n<packet>\n${JSON.stringify(worker)}\n</packet>\n<seed>\n${JSON.stringify(seed)}\n</seed>`;
}

function rejectPath(target) { return path.join(PEOPLE_DIR, 'generated', 'rejected-spark-extractions', target.book, `${target.chapter}.json`); }

function runCodex(instructions) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), '24histories-spark-'));
  const output = path.join(temp, 'output.json');
  try {
    const result = spawnSync('codex', ['exec', '--ephemeral', '--sandbox', 'read-only', '--model', MODEL, '--output-schema', SCHEMA, '--output-last-message', output, '--color', 'never', instructions], { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    if (result.error) throw new Error(`Codex Spark failed to launch: ${result.error.message}`);
    if (result.status !== 0) throw new Error(`Codex Spark failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
    if (!fs.existsSync(output)) throw new Error('Codex Spark returned no final JSON');
    return JSON.parse(fs.readFileSync(output, 'utf8'));
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

function planSparkChunks(packet) {
  const planned = planPeopleExtractionChunks(packet, { maxUnits: 60, maxCandidates: 150, contextUnits: 6 });
  const chunks = [...planned];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const bytes = Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)));
    if (bytes <= WORKER_MAX_BYTES) continue;
    const split = splitPeopleExtractionChunk(packet, chunk, { contextUnits: 6 });
    chunks.splice(index, 1, ...split);
    index -= 1;
  }
  return normalizePeopleExtractionChunkPlan(packet, chunks, { contextUnits: 6 });
}

function preflightModel() {
  // ChatGPT-backed Codex CLI installations can reject this model (HTTP 400).  Run this
  // before mutating the shared ledger so an unavailable model cannot strand a claim.
  const result = spawnSync('codex', ['exec', '--ephemeral', '--sandbox', 'read-only', '--model', MODEL, '--color', 'never', 'Reply with exactly: ready'], {
    cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 128 * 1024, timeout: 2 * 60 * 1000,
  });
  if (result.error) throw new Error(`Codex Spark model preflight failed: ${result.error.message}`);
  if (result.status !== 0) throw new Error(
    `Codex Spark model preflight rejected ${MODEL}; no queue claim was made: ${(result.stderr || result.stdout).trim()}`,
  );
}

function selfTest() {
  const ledger = { schemaVersion: 1, updatedAt: new Date(0).toISOString(), claims: { 'x/001': { lane: 'codex-spark', worker: 'fixture', status: 'claimed', sticky: true, updatedAt: new Date().toISOString(), expiresAt: null } } };
  validatePeopleWorkLedger(ledger);
  if (!claimIsActive(ledger.claims['x/001'])) throw new Error('Spark queue claim was not active');
  console.log('codex-spark-people-extract self-test: ok');
}

function main() {
  const o = args(process.argv.slice(2)); if (o.selfTest) return selfTest();
  const target = { book: o.book, chapter: o.chapter };
  const packet = buildPeopleExtractionPacket(o.book, o.chapter, { properNounMatcher: loadProperNounMatcher() });
  const chunks = planSparkChunks(packet);
  const maxChunkBytes = Math.max(...chunks.map((chunk) => Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)))));
  const existing = fs.existsSync(extractionPath(o.book, o.chapter));
  if (existing && o.run) {
    throw new Error(`${o.book}/${o.chapter} already has an extraction; Spark refuses replacement so reviewed history and person IDs cannot be overwritten`);
  }
  const shared = { remote: o.remote, branch: o.branch, baseRef: o.baseRef };
  const claim = readRemotePeopleWorkLedger(shared).claims[`${o.book}/${o.chapter}`];
  if (claimIsActive(claim) && (claim.lane !== 'codex-spark' || claim.worker !== o.worker)) throw new Error(`${o.book}/${o.chapter} is reserved by ${claim.lane}/${claim.worker}`);
  console.log(`[${o.book}/${o.chapter}] Spark planned ${chunks.length} sealed chunk(s), max ${(maxChunkBytes / 1024).toFixed(1)} KiB; model=${MODEL}; translation repairs are proposals only.${existing ? ' Existing extraction: dispatch is prohibited.' : ''}`);
  if (!o.run) {
    if (existing) console.log('Dry run: existing extraction would prohibit dispatch.');
    else console.log('Dry run complete. Add --run to preflight, claim, and invoke Spark.');
    return;
  }
  preflightModel();
  const reserved = claimRemotePeopleTargets([target], { ...shared, lane: 'codex-spark', worker: o.worker, limit: 1, sticky: true, note: `sealed ${MODEL} extraction` });
  if (!reserved.result.claimed.length) throw new Error('Shared queue reservation lost before Spark dispatch');
  try {
    const parts = chunks.map((chunk) => {
      const ownedPacket = buildPeopleChunkPacket(packet, chunk);
      const compact = runCodex(prompt(target, packet, chunk));
      const validated = validateCompactPeopleExtraction(compact, ownedPacket, { strictAliasDispositions: true }).normalized;
      return { chunk, extraction: validated };
    });
    const compact = assembleCompactPeopleChunks(packet, parts, {
      model: MODEL,
      promptVersion: readJson(path.join(PEOPLE_DIR, 'config.json')).promptVersion,
      agentId: null,
      runId: null,
      completedAt: new Date().toISOString(),
      chunks: parts.map(({ chunk, extraction }) => peopleChunkRunRecord(chunk, extraction)),
    });
    const validated = validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true }).normalized;
    // Host-only acceptance. This does not apply translation repairs or touch chapter source.
    writeTextAtomic(extractionPath(o.book, o.chapter), serializeCompactPeopleExtraction(validated));
    markRemotePeopleClaims([target], 'ready', { ...shared, lane: 'codex-spark', worker: o.worker });
    console.log(`[${o.book}/${o.chapter}] accepted host-validated Spark extraction; ${validated.translationRepairs.filter((r) => r.status === 'proposed').length} repair proposal(s) queued for independent review.`);
  } catch (error) {
    if (error instanceof SyntaxError) writeTextAtomic(rejectPath(target), JSON.stringify({ error: error.message }, null, 2));
    markRemotePeopleClaims([target], 'failed', { ...shared, lane: 'codex-spark', worker: o.worker, note: error.message });
    throw error;
  }
}

if (isMain) main();
