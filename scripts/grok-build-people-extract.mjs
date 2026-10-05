#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { buildPeopleExtractionPacket, buildPeopleChunkWorkerPacket, buildCompactPeopleExtractionSeed } from './build-people-extraction-packet.mjs';
import { planPeopleExtractionChunks, buildPeopleChunkPacket, splitPeopleExtractionChunk,
  normalizePeopleExtractionChunkPlan, assembleCompactPeopleChunks, peopleChunkRunRecord } from './lib/people-extraction-chunks.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { PEOPLE_DIR, REPO_ROOT, chapterPath, extractionPath, readJson, writeJsonAtomic, writeTextAtomic, sha256 } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { assertDurableCareerCoverage } from './lib/people-extraction-acceptance.mjs';
import { claimRemotePeopleTargets, fetchPeopleQueueBase, extractionIsCurrent,
  markRemotePeopleClaims, readRemotePeopleWorkLedger, claimIsActive } from './lib/people-work-queue.mjs';
import { runDeepSeekToolPilot, TOOL_PILOT_VERSION } from './lib/deepseek-people-tools.mjs';
import { loadChronologyReference } from './lib/people-chronology-reference.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import { grokBuildCompletion, GROK_BUILD_MODEL, readGrokBuildCredential,
  installedGrokBuildVersion } from './lib/grok-build-proxy.mjs';

const ROOT = path.join(PEOPLE_DIR, 'generated', 'grok-build-extractions');
const INSTRUCTIONS = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-extraction-compact.txt'), 'utf8');
const SCHEMA = readJson(path.join(PEOPLE_DIR, 'schema', 'compact-extraction.schema.json'));
const REFERENCED_SCHEMA = readJson(path.join(PEOPLE_DIR, 'schema', 'extraction.schema.json'));

function positive(value, flag) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(`${flag} requires a positive integer`);
  return number;
}

export function planGrokBuildChunks(packet, { maxUnits = 20, maxCandidates = 100, maxBytes = 24 * 1024 } = {}) {
  const pending = planPeopleExtractionChunks(packet, { maxUnits, maxCandidates });
  const accepted = [];
  while (pending.length) {
    const chunk = pending.shift();
    const bytes = Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)));
    if (bytes <= maxBytes) accepted.push(chunk);
    else if (chunk.end - chunk.start > 1) pending.unshift(...splitPeopleExtractionChunk(packet, chunk));
    else throw new Error(`One source unit exceeds the ${maxBytes}-byte Grok Build packet ceiling: ${packet.book}/${packet.chapter}/${chunk.id}`);
  }
  return normalizePeopleExtractionChunkPlan(packet, accepted);
}

export async function runGrokBuildExtraction(target, options) {
  const { worker, maxUnits, maxCandidates, maxBytes, maxTurns, maxTotalTokens, timeoutMs,
    matcher = loadProperNounMatcher(), chronology = loadChronologyReference(),
    completion = grokBuildCompletion } = options;
  if (!/^grok-build-[a-z0-9][a-z0-9-]{0,47}$/u.test(worker)) throw new Error('Use a stable grok-build-* worker ID');
  fetchPeopleQueueBase();
  fetchPeopleQueueBase({ baseRef: 'origin/codex/people-glossary-staging-v2' });
  if (fs.existsSync(extractionPath(target.book, target.chapter)) ||
      extractionIsCurrent(target, { ref: 'origin/master' }) ||
      extractionIsCurrent(target, { ref: 'origin/codex/people-glossary-staging-v2' })) {
    throw new Error(`${target.book}/${target.chapter} already has an extraction; Grok Build will not replace it`);
  }
  const sourceHash = sha256(fs.readFileSync(chapterPath(target.book, target.chapter)));
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, { properNounMatcher: matcher });
  const chunks = planGrokBuildChunks(packet, { maxUnits, maxCandidates, maxBytes });
  if (!chunks.length) throw new Error('Grok Build requires at least one owned source unit');
  const directory = path.join(ROOT, worker, target.book, target.chapter);
  const planFile = path.join(directory, 'plan.json');
  const instructionHash = sha256(INSTRUCTIONS);
  const schemaHash = sha256(JSON.stringify([SCHEMA, REFERENCED_SCHEMA]));
  const plan = { protocol: TOOL_PILOT_VERSION, sourceHash, instructionHash, schemaHash, model: GROK_BUILD_MODEL,
    chunks: chunks.map(({ id, start, end }) => ({ id, start, end })) };
  if (fs.existsSync(planFile) && JSON.stringify(readJson(planFile)) !== JSON.stringify(plan)) {
    throw new Error('Retained Grok Build chunk plan differs from current source or ceilings');
  }
  const claimed = claimRemotePeopleTargets([{ ...target, chapterFingerprint: packet.input.chapterFingerprint }], {
    lane: 'grok-build', worker, limit: 1, sticky: true,
    note: 'Local Grok Build subscription inference; retain tool checkpoints until accepted',
    message: `Reserve Grok Build extraction ${target.book}/${target.chapter}`,
  }).result;
  if (claimed.claimed.length !== 1) throw new Error(`${target.book}/${target.chapter} is owned by another lane`);
  if (!fs.existsSync(planFile)) writeJsonAtomic(planFile, plan);
  const unlock = acquireProcessRunLock(path.join(directory, 'run.lock'), {
    label: `Grok Build extraction ${target.book}/${target.chapter}`,
  });
  try {
    const parts = [];
    let usedTokens = 0;
    for (const chunk of chunks) {
      const owned = buildPeopleChunkPacket(packet, chunk);
      const file = path.join(directory, `chunk-${chunk.id}.json`);
      if (fs.existsSync(file)) {
        const extraction = readJson(file);
        const validated = validateCompactPeopleExtraction(extraction, owned, { strictAliasDispositions: true });
        assertDurableCareerCoverage(validated.normalized, owned);
        parts.push({ chunk, extraction });
        continue;
      }
      const toolDir = path.join(directory, `tool-${chunk.id}`);
      if (usedTokens >= maxTotalTokens) throw new Error(`Grok Build invocation token ceiling reached; resume ${worker} after review`);
      const seed = buildCompactPeopleExtractionSeed(owned, 'Grok Build');
      const snapshot = { scope: `${target.book}/${target.chapter}`, chunk, packet: owned,
        worker: buildPeopleChunkWorkerPacket(packet, chunk), seed, instructions: INSTRUCTIONS,
        dir: toolDir, thinking: 'enabled', temperature: 0, chronology,
        fingerprint: sha256(JSON.stringify({ protocol: TOOL_PILOT_VERSION, sourceHash, instructionHash, schemaHash,
          model: GROK_BUILD_MODEL, chunk: { id: chunk.id, start: chunk.start, end: chunk.end } })),
        messages: [{ role: 'system', content: `<schema>${JSON.stringify(SCHEMA)}</schema><referenced-schema>${JSON.stringify(REFERENCED_SCHEMA)}</referenced-schema>` }] };
      const stateFile = path.join(toolDir, 'agent-state.json');
      const nextTurn = fs.existsSync(stateFile) ? readJson(stateFile).nextTurn : 1;
      if (!Number.isSafeInteger(nextTurn) || nextTurn < 1) throw new Error('Invalid retained Grok Build turn counter');
      const result = await runDeepSeekToolPilot(snapshot, {
        maxTurns: nextTurn + maxTurns - 1,
        shouldStop: () => usedTokens >= maxTotalTokens,
        compare: () => ({}),
        request: async (turn, body) => {
          const responseFile = path.join(toolDir, `response-${turn}.json`);
          if (fs.existsSync(responseFile)) return readJson(responseFile);
          const response = await completion({ messages: body.messages, tools: body.tools, timeoutMs,
            maxTokens: Math.min(body.max_tokens, 8192) });
          usedTokens += response.usage.total_tokens;
          writeJsonAtomic(responseFile, response);
          return response;
        },
      });
      if (result.status !== 'validated') {
        throw new Error(`${target.book}/${target.chapter}/${chunk.id} is ${result.status}; retained work is in ${toolDir}`);
      }
      const extraction = readJson(path.join(toolDir, 'validated.json'));
      const validated = validateCompactPeopleExtraction(extraction, owned, { strictAliasDispositions: true });
      assertDurableCareerCoverage(validated.normalized, owned);
      writeJsonAtomic(file, extraction);
      parts.push({ chunk, extraction });
    }
    const run = { model: 'Grok Build-chunked', promptVersion: parts[0].extraction.run.promptVersion,
      agentId: null, runId: null, completedAt: new Date().toISOString(),
      chunks: parts.map(({ chunk, extraction }) => peopleChunkRunRecord(chunk, extraction)) };
    const assembled = assembleCompactPeopleChunks(packet, parts, run);
    const validated = validateCompactPeopleExtraction(assembled, packet, { strictAliasDispositions: true });
    assertDurableCareerCoverage(validated.normalized, packet);
    if (sha256(fs.readFileSync(chapterPath(target.book, target.chapter))) !== sourceHash) {
      throw new Error('Source changed during Grok Build extraction; chunks are retained without publication');
    }
    const output = extractionPath(target.book, target.chapter);
    if (fs.existsSync(output)) throw new Error('Extraction appeared while running; refusing overwrite');
    writeTextAtomic(output, serializeCompactPeopleExtraction(assembled));
    markRemotePeopleClaims([target], 'ready', { lane: 'grok-build', worker,
      note: `Validated Grok Build extraction; ${validated.stats.people} people, ${validated.stats.claims} claims` });
    return { target, output, stats: validated.stats, usedTokens };
  } finally { unlock(); }
}

async function main() {
  const { values: o } = parseArgs({ options: { worker: { type: 'string' }, book: { type: 'string' },
    chapter: { type: 'string' }, run: { type: 'boolean' }, 'dry-run': { type: 'boolean' },
    'max-units': { type: 'string', default: '20' }, 'max-candidates': { type: 'string', default: '100' },
    'max-worker-kib': { type: 'string', default: '24' }, 'max-turns': { type: 'string', default: '20' },
    'max-total-tokens': { type: 'string', default: '50000' },
    'run-timeout-minutes': { type: 'string', default: '20' } } });
  if (!o.worker || !/^grok-build-[a-z0-9][a-z0-9-]{0,47}$/u.test(o.worker) ||
      !o.book || !/^\d{3}$/u.test(o.chapter ?? '') || (o.run && o['dry-run'])) {
    throw new Error('Use --worker grok-build-ID --book BOOK --chapter NNN [--dry-run | --run]');
  }
  const maxUnits = positive(o['max-units'], '--max-units');
  const maxCandidates = positive(o['max-candidates'], '--max-candidates');
  const maxBytes = positive(o['max-worker-kib'], '--max-worker-kib') * 1024;
  const maxTurns = positive(o['max-turns'], '--max-turns');
  const maxTotalTokens = positive(o['max-total-tokens'], '--max-total-tokens');
  const timeoutMs = positive(o['run-timeout-minutes'], '--run-timeout-minutes') * 60000;
  const target = { book: o.book, chapter: o.chapter };
  fetchPeopleQueueBase();
  fetchPeopleQueueBase({ baseRef: 'origin/codex/people-glossary-staging-v2' });
  const ledger = readRemotePeopleWorkLedger();
  const claim = ledger.claims[`${target.book}/${target.chapter}`];
  if (claimIsActive(claim) && (claim.lane !== 'grok-build' || claim.worker !== o.worker)) {
    throw new Error(`${target.book}/${target.chapter} is already reserved by ${claim.lane}/${claim.worker}`);
  }
  if (fs.existsSync(extractionPath(target.book, target.chapter)) ||
      extractionIsCurrent(target, { ref: 'origin/master' }) ||
      extractionIsCurrent(target, { ref: 'origin/codex/people-glossary-staging-v2' })) {
    throw new Error(`${target.book}/${target.chapter} already has an extraction`);
  }
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, { properNounMatcher: loadProperNounMatcher() });
  const chunks = planGrokBuildChunks(packet, { maxUnits, maxCandidates, maxBytes });
  if (!chunks.length) throw new Error('Grok Build requires at least one owned source unit');
  const summary = { target, worker: o.worker, units: packet.units.length, chunks: chunks.length,
    maxChunkBytes: Math.max(...chunks.map(chunk => Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk))))),
    maxTurns, maxTotalTokens, inferenceCalls: o.run ? 'up to maxTurns per invocation' : 0 };
  if (!o.run) { console.log(JSON.stringify(summary, null, 2)); return; }
  readGrokBuildCredential();
  installedGrokBuildVersion();
  console.log(JSON.stringify(await runGrokBuildExtraction(target, {
    worker: o.worker, maxUnits, maxCandidates, maxBytes, maxTurns, maxTotalTokens, timeoutMs,
  })));
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
