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
import { claimRemotePeopleTargets, markRemotePeopleClaims, listPeopleChapterTargets, extractionIsCurrent, readRemotePeopleWorkLedger, claimIsActive } from './lib/people-work-queue.mjs';
import { DEFAULT_OPENROUTER_FREE_MODEL, openRouterFreeCompletion, verifyOpenRouterFreeModel } from './lib/openrouter-free.mjs';
import { runDeepSeekToolPilot, TOOL_PILOT_VERSION } from './lib/deepseek-people-tools.mjs';
import { loadChronologyReference } from './lib/people-chronology-reference.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';

const prompt = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-extraction-compact.txt'), 'utf8');
const schema = readJson(path.join(PEOPLE_DIR, 'schema', 'compact-extraction.schema.json'));
const referencedSchema = readJson(path.join(PEOPLE_DIR, 'schema', 'extraction.schema.json'));
const ROOT = path.join(PEOPLE_DIR, 'generated', 'openrouter-extractions');

export function planOpenRouterChunks(packet, { maxUnits = 40, maxCandidates = 150, maxBytes = 48 * 1024 } = {}) {
  const pending = planPeopleExtractionChunks(packet, { maxUnits, maxCandidates });
  const ready = [];
  while (pending.length) {
    const chunk = pending.shift();
    const bytes = Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)));
    if (bytes <= maxBytes) ready.push(chunk);
    else if (chunk.end - chunk.start > 1) pending.unshift(...splitPeopleExtractionChunk(packet, chunk));
    else throw new Error(`Single-unit worker packet exceeds ${maxBytes} bytes at ${packet.book}/${packet.chapter}/${chunk.id}`);
  }
  return normalizePeopleExtractionChunkPlan(packet, ready);
}

function artifactDir(target) { return path.join(ROOT, target.book, target.chapter); }

export async function runOpenRouterExtraction(target, { key, model = DEFAULT_OPENROUTER_FREE_MODEL,
  worker, maxUnits = 40, maxBytes = 48 * 1024, maxTurns = 300, timeoutMs = 20 * 60000,
  request = openRouterFreeCompletion, matcher = loadProperNounMatcher(), chronology = loadChronologyReference() }) {
  if (!worker) throw new Error('A stable --worker ID is required');
  if (fs.existsSync(extractionPath(target.book, target.chapter))) throw new Error('An extraction already exists; this lane will not replace it');
  if (extractionIsCurrent(target, { ref: 'origin/master' })) throw new Error('Chapter is already extracted on origin/master; retained tool work remains untouched');
  const sourceHash = sha256(fs.readFileSync(chapterPath(target.book, target.chapter)));
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, { properNounMatcher: matcher });
  const chunks = planOpenRouterChunks(packet, { maxUnits, maxBytes });
  const dir = artifactDir(target);
  const planFile = path.join(dir, 'plan.json');
  const plan = { sourceHash, model, chunks: chunks.map(({ id, start, end }) => ({ id, start, end })) };
  if (fs.existsSync(planFile) && JSON.stringify(readJson(planFile)) !== JSON.stringify(plan)) throw new Error('Retained OpenRouter chunk plan differs from current source or model');
  const claim = claimRemotePeopleTargets([target], { lane: 'openrouter', worker, limit: 1, sticky: true,
    message: `Reserve OpenRouter extraction ${target.book}/${target.chapter}` }).result;
  if (claim.claimed.length !== 1) throw new Error(`${target.book}/${target.chapter} is reserved by another lane`);
  if (!fs.existsSync(planFile)) writeJsonAtomic(planFile, plan);
  const unlock = acquireProcessRunLock(path.join(dir, 'run.lock'), { label: `OpenRouter extraction ${target.book}/${target.chapter}` });
  try {
  const parts = [];
  for (const chunk of chunks) {
    const owned = buildPeopleChunkPacket(packet, chunk);
    const file = path.join(dir, `chunk-${chunk.id}.json`);
    if (fs.existsSync(file)) {
      const extraction = readJson(file);
      validateCompactPeopleExtraction(extraction, owned, { strictAliasDispositions: true });
      parts.push({ chunk, extraction });
      continue;
    }
    const workerPacket = buildPeopleChunkWorkerPacket(packet, chunk);
    const seed = buildCompactPeopleExtractionSeed(owned, model);
    const toolDir = path.join(dir, `tool-${chunk.id}`);
    const snapshot = { scope: `${target.book}/${target.chapter}`, chunk, packet: owned, worker: workerPacket,
      seed, instructions: prompt, dir: toolDir, thinking: 'enabled', temperature: 0, chronology,
      fingerprint: sha256(JSON.stringify({ protocol: TOOL_PILOT_VERSION, sourceHash, model, chunk: { id: chunk.id, start: chunk.start, end: chunk.end } })),
      messages: [{ role: 'system', content: `<schema>${JSON.stringify(schema)}</schema><referenced-schema>${JSON.stringify(referencedSchema)}</referenced-schema>` }] };
    const result = await runDeepSeekToolPilot(snapshot, { maxTurns, shouldStop: () => false, compare: () => ({}),
      request: async (turn, body) => {
        const responseFile = path.join(toolDir, `response-${turn}.json`);
        if (fs.existsSync(responseFile)) return readJson(responseFile);
        return request({ key, model, messages: body.messages, tools: body.tools, maxTokens: 8192, timeoutMs,
          onResponse: response => writeJsonAtomic(responseFile, response) });
      } });
    if (result.status !== 'validated') throw new Error(`${target.book}/${target.chapter}/${chunk.id} tool draft is ${result.status}; resume the same worker after inspecting ${toolDir}`);
    const accepted = readJson(path.join(toolDir, 'validated.json'));
    validateCompactPeopleExtraction(accepted, owned, { strictAliasDispositions: true });
    writeJsonAtomic(file, accepted);
    parts.push({ chunk, extraction: accepted });
  }
  const run = { model: `${model}-chunked`, promptVersion: parts[0].extraction.run.promptVersion,
    agentId: null, runId: null, completedAt: new Date().toISOString(),
    chunks: parts.map(({ chunk, extraction }) => peopleChunkRunRecord(chunk, extraction)) };
  const assembled = assembleCompactPeopleChunks(packet, parts, run);
  const validated = validateCompactPeopleExtraction(assembled, packet, { strictAliasDispositions: true });
  assertDurableCareerCoverage(validated.normalized, packet);
  if (sha256(fs.readFileSync(chapterPath(target.book, target.chapter))) !== sourceHash) throw new Error('Source changed during extraction; retaining chunks without publication');
  const output = extractionPath(target.book, target.chapter);
  if (fs.existsSync(output)) throw new Error('Extraction appeared while running; refusing overwrite');
  writeTextAtomic(output, serializeCompactPeopleExtraction(assembled));
  markRemotePeopleClaims([target], 'ready', { lane: 'openrouter', worker,
    note: `Validated OpenRouter free extraction; ${validated.stats.people} people, ${validated.stats.claims} claims` });
  return { target, output, stats: validated.stats };
  } finally { unlock(); }
}

async function main() {
  const { values: o } = parseArgs({ options: { book: { type: 'string' }, chapter: { type: 'string' }, all: { type: 'boolean' },
    worker: { type: 'string' }, model: { type: 'string', default: DEFAULT_OPENROUTER_FREE_MODEL },
    limit: { type: 'string', default: '1' }, 'max-units': { type: 'string', default: '40' },
    'max-turns': { type: 'string', default: '300' }, 'run-timeout-minutes': { type: 'string', default: '20' },
    'dry-run': { type: 'boolean' } } });
  if (!o.worker || (!o.all && (!o.book || !o.chapter)) || (o.all && (o.book || o.chapter))) throw new Error('Use --worker ID with --book BOOK --chapter NNN or --all');
  if (o.chapter && !/^\d{3}$/.test(o.chapter)) throw new Error('--chapter requires NNN');
  const positive = (value, label) => { const n = Number(value); if (!Number.isSafeInteger(n) || n < 1) throw new Error(`Invalid ${label}`); return n; };
  const limit = positive(o.limit, '--limit'), maxUnits = positive(o['max-units'], '--max-units');
  const maxTurns = positive(o['max-turns'], '--max-turns');
  const timeoutMs = positive(o['run-timeout-minutes'], '--run-timeout-minutes') * 60000;
  loadDotenv(REPO_ROOT);
  const key = process.env.OPENROUTER_API_KEY;
  await verifyOpenRouterFreeModel({ key, model: o.model });
  const ledger = readRemotePeopleWorkLedger();
  const targets = listPeopleChapterTargets({ book: o.book, chapter: o.chapter })
    .filter(target => !extractionIsCurrent(target) && !extractionIsCurrent(target, { ref: 'origin/master' }) && !fs.existsSync(extractionPath(target.book, target.chapter)))
    .filter(target => { const claim = ledger.claims[`${target.book}/${target.chapter}`]; return !claimIsActive(claim) || (claim.lane === 'openrouter' && claim.worker === o.worker); })
    .slice(0, limit);
  if (o['dry-run']) { console.log(JSON.stringify({ model: o.model, eligible: targets.length, targets }, null, 2)); return; }
  const matcher = loadProperNounMatcher();
  for (const target of targets) {
    try { console.log(JSON.stringify(await runOpenRouterExtraction(target, { key, model: o.model, worker: o.worker, maxUnits, maxTurns, timeoutMs, matcher }))); }
    catch (error) {
      console.error(`${target.book}/${target.chapter}: ${error.message}`);
      if (error.status === 429) break;
      process.exitCode = 1;
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) main().catch(error => { console.error(error.message); process.exitCode = 1; });
