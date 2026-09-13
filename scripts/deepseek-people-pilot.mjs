#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, isDeepStrictEqual } from 'node:util';
import {
  buildPeopleExtractionPacket, buildPeopleChunkWorkerPacket,
  buildCompactPeopleExtractionSeed,
} from './build-people-extraction-packet.mjs';
import {
  planPeopleExtractionChunks, buildPeopleChunkPacket, splitPeopleExtractionChunk,
} from './lib/people-extraction-chunks.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { assertDurableCareerCoverage } from './lib/people-extraction-acceptance.mjs';
import { PEOPLE_DIR, REPO_ROOT, readJson, writeJsonAtomic, sha256 } from './lib/people-content.mjs';
import { runDeepSeekToolPilot, TOOL_PILOT_VERSION } from './lib/deepseek-people-tools.mjs';
import { loadChronologyReference } from './lib/people-chronology-reference.mjs';
import { runIndependentPeopleReview, semanticRepairFeedback, hasCurrentSemanticApproval, prepareIndependentReviewSources } from './lib/deepseek-people-review.mjs';
import { runChronologyChallenge, hasCurrentChronologyApproval } from './lib/deepseek-people-chronology-review.mjs';
import { runFocusedEditorialReview, hasCurrentEditorialApproval } from './lib/deepseek-people-editorial-review.mjs';
import { historicalSourceUrl } from './lib/people-historical-research.mjs';

const ROOT = path.join(PEOPLE_DIR, 'generated', 'deepseek-pilot');
const MODEL = 'deepseek-flash';
const TEMPERATURE = 1;
const MAX_OUTPUT = 32768;
// Peak, uncached prices checked 2026-09-12. Reservations deliberately overestimate.
const PRICES = {
  'deepseek-flash': { input: 0.30, cached: 0.006, output: 1.20 },
  'deepseek-v4-pro': { input: 1.32, cached: 0.044, output: 3.96 },
};
const CEILING = 10;
let stopping = false;

export function reserveCost(messages, maxOutput = MAX_OUTPUT, model = MODEL) {
  const price = PRICES[model];
  if (!price) throw new Error('Model has no approved price table');
  return ((Buffer.byteLength(JSON.stringify(messages)) + 4096) * price.input + maxOutput * price.output) / 1e6;
}

export function usageCost(usage, model = MODEL) {
  const price = PRICES[model];
  if (!price) throw new Error('Model has no approved price table');
  for (const key of ['prompt_tokens', 'completion_tokens']) {
    if (!Number.isSafeInteger(usage?.[key]) || usage[key] < 0) throw new Error('Missing or invalid API usage');
  }
  const cached = usage.prompt_cache_hit_tokens ?? 0;
  if (!Number.isSafeInteger(cached) || cached < 0 || cached > usage.prompt_tokens) throw new Error('Invalid cache usage');
  return ((usage.prompt_tokens - cached) * price.input + cached * price.cached + usage.completion_tokens * price.output) / 1e6;
}

export function hasRunawayIds(content) {
  return /(?:"p\d+"\s*,\s*){1024}/.test(content ?? '');
}

function ledgerTotal(ledger) {
  return ledger.requests.reduce((sum, request) => sum + (request.costUpperUsd ?? request.reservedUsd), 0);
}

async function api(endpoint, body) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('DEEPSEEK_API_KEY is missing; run with node --env-file=.env');
  let response;
  try {
    response = await fetch(`https://api.deepseek.com/${endpoint}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });
  } catch {
    throw new Error('DeepSeek connection failed; any pending reservation remains charged to the pilot ceiling');
  }
  if (!response.ok) {
    const error = new Error(`DeepSeek HTTP ${response.status}; response suppressed`);
    error.httpStatus = response.status;
    throw error;
  }
  return response.json();
}

async function balance() {
  const result = await api('user/balance');
  const row = result.balance_infos?.find(item => item.currency === 'USD');
  const dollars = Number(row?.total_balance);
  if (!row || !Number.isFinite(dollars) || dollars < 0) throw new Error('Unexpected balance response');
  return dollars;
}

function plannedChunks(packet, maxUnits) {
  const queue = planPeopleExtractionChunks(packet, { maxUnits, maxCandidates: 150 });
  const chunks = [];
  while (queue.length) {
    const chunk = queue.shift();
    if (Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk))) <= 48 * 1024) {
      chunks.push(chunk);
    } else {
      if (chunk.end - chunk.start < 2) throw new Error('Single unit exceeds the pilot packet ceiling');
      queue.unshift(...splitPeopleExtractionChunk(packet, chunk));
    }
  }
  return chunks.map((chunk, index) => ({ ...chunk, index, count: chunks.length }));
}

function sourceHash(book, chapter) {
  return sha256(fs.readFileSync(path.join(PEOPLE_DIR, '..', book, `${chapter}.json`), 'utf8'));
}

function prepare(scope, index, matcher, thinking, model, maxUnits, agent) {
  if (!/^[a-z0-9_-]+\/\d{3}$/.test(scope)) throw new Error('Expected book/NNN scope');
  const [book, chapter] = scope.split('/');
  const baselineFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
  if (!fs.existsSync(baselineFile)) throw new Error(`${scope} has no existing extraction; this pilot only benchmarks completed work`);
  const full = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: matcher });
  const primarySourceUrl = readJson(path.join(REPO_ROOT, 'data', book, `${chapter}.json`)).meta?.url ?? null;
  const chunk = plannedChunks(full, maxUnits)[index - 1];
  if (!chunk) throw new Error(`${scope} has no chunk ${index}`);
  const packet = buildPeopleChunkPacket(full, chunk);
  const worker = buildPeopleChunkWorkerPacket(full, chunk);
  const instructions = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-extraction-compact.txt'), 'utf8');
  const schema = readJson(path.join(PEOPLE_DIR, 'schema', 'compact-extraction.schema.json'));
  const referencedSchema = readJson(path.join(PEOPLE_DIR, 'schema', 'extraction.schema.json'));
  const seed = buildCompactPeopleExtractionSeed(packet, model);
  const system = `Perform the complete person extraction and editorial audit using the supplied source packet.
Return only one complete JSON object matching the compact schema. You have no filesystem or tools.
The instructions below also serve coding agents: interpret writing the output as returning JSON, and
validation as host-side validation after your response. Do not write programs or describe actions.
Preserve the immutable seed's input, book, chapter, schemaVersion, and run metadata exactly.
Read every owned unit, all readOnlyContext, and account for every candidate. Do not use outside knowledge.
\n${instructions}\n<schema>\n${JSON.stringify(schema)}\n</schema>
<referenced-schema>\n${JSON.stringify(referencedSchema)}\n</referenced-schema>`;
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `<worker-packet>\n${JSON.stringify(worker)}\n</worker-packet>\n<immutable-seed>\n${JSON.stringify(seed)}\n</immutable-seed>` },
  ];
  const fingerprint = sha256(JSON.stringify({ messages, model, maxOutput: MAX_OUTPUT, thinking, temperature: TEMPERATURE,
    ...(agent ? { harnessVersion: TOOL_PILOT_VERSION } : {}) }));
  const dir = path.join(ROOT, book, chapter, `chunk-${index}-${fingerprint.slice(7, 19)}`);
  fs.mkdirSync(dir, { recursive: true });
  const snapshot = { scope, chunk, packet, worker, seed, messages, instructions, primarySourceUrl,
    totalUnits: full.units.length, thinking, temperature: TEMPERATURE, fingerprint,
    sourceHash: sourceHash(book, chapter), baseline: readJson(baselineFile) };
  const file = path.join(dir, 'packet.json');
  if (fs.existsSync(file)) {
    const saved = readJson(file);
    if (saved.fingerprint !== fingerprint || saved.sourceHash !== snapshot.sourceHash) throw new Error('Pilot snapshot changed');
    return { ...saved, instructions, primarySourceUrl, totalUnits: full.units.length, dir };
  }
  writeJsonAtomic(file, snapshot);
  return { ...snapshot, primarySourceUrl, totalUnits: full.units.length, dir };
}

export function coversWholeChapter(snapshot) {
  return Number.isSafeInteger(snapshot.totalUnits) && snapshot.totalUnits > 0 && snapshot.chunk.count === 1
    && snapshot.chunk.start === 0 && snapshot.chunk.end === snapshot.totalUnits
    && snapshot.packet.units.length === snapshot.totalUnits
    && new Set(snapshot.packet.units.map(unit => unit.id)).size === snapshot.totalUnits;
}

async function paidRequest(snapshot, ledger, ledgerFile, tag, responseFile, body) {
  let response;
  if (fs.existsSync(responseFile)) {
    response = readJson(responseFile);
  } else {
    if (stopping) throw new Error('Pilot paused before dispatch; saved work is resumable');
    if (ledger.requests.some(row => row.tag === tag)) throw new Error('Uncertain prior request; reservation retained. Inspect recovery before retrying.');
    const reservation = reserveCost({ messages: body.messages, tools: body.tools }, body.max_tokens, body.model);
    if (ledgerTotal(ledger) + reservation > CEILING) throw new Error('Pilot $10 ceiling reached');
    if (await balance() < reservation) throw new Error('Insufficient balance for a conservatively reserved request');
    if (stopping) throw new Error('Pilot paused before dispatch; saved work is resumable');
    if (sourceHash(snapshot.packet.book, snapshot.packet.chapter) !== snapshot.sourceHash) throw new Error('Source changed; refusing stale inference');
    ledger.requests.push({ tag, scope: snapshot.scope, maxOutput: body.max_tokens, reservedUsd: reservation,
      status: 'pending', startedAt: new Date().toISOString() });
    writeJsonAtomic(ledgerFile, ledger);
    try {
      response = await api('chat/completions', body);
    } catch (error) {
      const row = ledger.requests.find(item => item.tag === tag);
      if ([400, 401, 402, 403, 404, 422, 429].includes(error.httpStatus)) {
        row.status = 'rejected';
        row.httpStatus = error.httpStatus;
        row.costUpperUsd = 0;
        writeJsonAtomic(`${responseFile}.error.json`, { httpStatus: error.httpStatus, tag });
        writeJsonAtomic(ledgerFile, ledger);
      }
      throw error;
    }
    writeJsonAtomic(responseFile, response);
  }
  const row = ledger.requests.find(item => item.tag === tag);
  if (!row) throw new Error('Response without a matching spending reservation');
  row.usage = response.usage;
  row.costUpperUsd = usageCost(response.usage, body.model);
  row.status = 'completed';
  row.model = response.model;
  row.completedAt ??= new Date().toISOString();
  writeJsonAtomic(ledgerFile, ledger);
  return response;
}

export function surfaceComparison(compact, snapshot) {
  const owned = new Set(snapshot.packet.units.map(unit => unit.id));
  if (!Array.isArray(snapshot.baseline.surfaces)) return { available: false };
  const flatten = surfaces => surfaces.flatMap(([person, kind, language, exact, locations]) =>
    locations.filter(([unit]) => owned.has(unit)).flatMap(([unit, occurrences]) =>
      occurrences.map(occurrence => ({ person, kind, language, exact, unit, occurrence }))));
  const key = row => JSON.stringify([row.language, row.exact, row.unit, row.occurrence]);
  const baseline = flatten(snapshot.baseline.surfaces);
  const pilot = flatten(compact.surfaces);
  const found = new Set(pilot.map(key));
  const prior = new Set(baseline.map(key));
  return {
    available: true,
    note: 'Differences are review candidates, not proof of error; baseline may itself be incomplete.',
    baselineSurfaces: baseline.length,
    missingFromPilot: baseline.filter(row => !found.has(key(row))),
    additionalInPilot: pilot.filter(row => !prior.has(key(row))),
  };
}

async function runSample(snapshot, ledger, ledgerFile, maxAttempts) {
  const resultFile = path.join(snapshot.dir, 'result.json');
  if (fs.existsSync(resultFile)) {
    const saved = readJson(resultFile);
    if (saved.status === 'validated' || saved.attempts >= maxAttempts) return saved;
  }
  let messages = snapshot.messages;
  let maxOutput = MAX_OUTPUT;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const tag = `${snapshot.fingerprint}:${attempt}`;
    const responseFile = path.join(snapshot.dir, `response-${attempt}.json`);
    if (stopping) return { scope: snapshot.scope, status: 'paused' };
    console.log(`${snapshot.scope} chunk ${snapshot.chunk.index + 1} attempt ${attempt}: requesting or recovering`);
    const response = await paidRequest(snapshot, ledger, ledgerFile, tag, responseFile, {
      model: snapshot.seed.run.model, messages, thinking: { type: snapshot.thinking },
      ...(snapshot.thinking === 'enabled' ? { reasoning_effort: 'low' } : {}),
      temperature: snapshot.temperature, top_p: 1, max_tokens: maxOutput, response_format: { type: 'json_object' },
    });
    const choice = response.choices?.[0];
    const content = choice?.message?.content;
    let errors;
    if (hasRunawayIds(content)) {
      const result = { scope: snapshot.scope, status: 'runaway', attempts: attempt,
        errors: ['Response contains a runaway list of person IDs; inspect sampling before further inference.'] };
      writeJsonAtomic(resultFile, result);
      console.log(`${snapshot.scope}: runaway output; sample stopped without increasing its token allowance`);
      return result;
    }
    try {
      if (choice?.finish_reason !== 'stop' || !content) throw new Error('Response empty or truncated; full output required');
      const compact = JSON.parse(content);
      if (!isDeepStrictEqual(compact.run, snapshot.seed.run)) throw new Error('Immutable run metadata changed');
      const validated = validateCompactPeopleExtraction(compact, snapshot.packet, { strictAliasDispositions: true });
      assertDurableCareerCoverage(validated.normalized, snapshot.packet);
      writeJsonAtomic(path.join(snapshot.dir, 'validated.json'), compact);
      const result = {
        scope: snapshot.scope, status: 'validated', attempts: attempt,
        stats: validated.stats, comparison: surfaceComparison(compact, snapshot),
        semanticReview: 'pending',
      };
      writeJsonAtomic(resultFile, result);
      console.log(`${snapshot.scope}: validated after ${attempt} request(s); ${compact.people.length} people, ${compact.surfaces.length} surfaces, ${compact.claims.length} claims`);
      return result;
    } catch (error) {
      errors = error.errors ?? [error.message];
      writeJsonAtomic(path.join(snapshot.dir, `errors-${attempt}.json`), errors);
      console.log(`${snapshot.scope}: ${errors.length} validation issue(s); usage ${response.usage.total_tokens} tokens`);
    }
    writeJsonAtomic(resultFile, { scope: snapshot.scope, status: 'rejected', attempts: attempt, errors });
    if (choice?.finish_reason === 'length') {
      maxOutput = Math.min(131072, Math.max(MAX_OUTPUT, response.usage.completion_tokens * 2));
    }
    messages = [
      ...snapshot.messages,
      { role: 'assistant', content: content || '{}' },
      { role: 'user', content: `The host rejected this extraction. Correct these issues and return the complete JSON object, preserving all valid evidence and coverage.\n${JSON.stringify(errors)}` },
    ];
  }
  return readJson(resultFile);
}

async function main() {
  const { values } = parseArgs({ options: {
    scopes: { type: 'string' }, 'chunk-index': { type: 'string', default: '1' }, run: { type: 'boolean', default: false },
    thinking: { type: 'boolean', default: false },
    'max-attempts': { type: 'string', default: '3' },
    model: { type: 'string', default: MODEL },
    agent: { type: 'boolean', default: false },
    'max-units': { type: 'string' },
    'max-turns': { type: 'string', default: '40' },
    feedback: { type: 'string' },
    review: { type: 'boolean', default: false },
    'review-source': { type: 'string', multiple: true },
    'review-rounds': { type: 'string', default: '1' },
    'require-whole-chapter': { type: 'boolean', default: false },
  } });
  if (!values.scopes) throw new Error('Usage: node --env-file=.env scripts/deepseek-people-pilot.mjs --scopes book/NNN,book/NNN [--chunk-index N] [--run]');
  const index = Number(values['chunk-index']);
  if (!Number.isSafeInteger(index) || index < 1) throw new Error('Chunk index must be positive');
  const maxAttempts = Number(values['max-attempts']);
  if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) throw new Error('Attempts must be between 1 and 10');
  if (!PRICES[values.model]) throw new Error('Model must be deepseek-flash or deepseek-v4-pro');
  if (values.review && !values.agent) throw new Error('--review requires --agent');
  if (values['review-source'] && !values.review) throw new Error('--review-source requires --review');
  const additionalReviewSources = values['review-source']?.map(url => ({ label: 'Additional independently selected historical reference', url: historicalSourceUrl(url).href }));
  const reviewRounds = Number(values['review-rounds']);
  if (!Number.isSafeInteger(reviewRounds) || reviewRounds < 1 || reviewRounds > 5) throw new Error('Review rounds must be between 1 and 5');
  if (reviewRounds > 1 && !values.review) throw new Error('--review-rounds requires --review');
  if (values['require-whole-chapter'] && !values.review) throw new Error('--require-whole-chapter requires --agent --review');
  if (values.feedback && (!values.agent || !values.run || values.scopes.includes(','))) throw new Error('Feedback requires --agent --run and exactly one scope');
  const feedback = values.feedback ? fs.readFileSync(path.resolve(values.feedback), 'utf8') : null;
  if (feedback !== null && (!feedback.trim() || Buffer.byteLength(feedback) > 64 * 1024)) throw new Error('Feedback must be nonempty and at most 64 KiB');
  const maxUnits = Number(values['max-units'] ?? (values.agent ? 8 : 60));
  const maxTurns = Number(values['max-turns']);
  if (!Number.isSafeInteger(maxUnits) || maxUnits < 1 || maxUnits > 60) throw new Error('Units must be between 1 and 60');
  if (!Number.isSafeInteger(maxTurns) || maxTurns < 1 || maxTurns > 400) throw new Error('Turns must be between 1 and 400');
  fs.mkdirSync(ROOT, { recursive: true });
  const lock = path.join(ROOT, 'runner.lock');
  const fd = fs.openSync(lock, 'wx', 0o600);
  fs.writeSync(fd, String(process.pid));
  const stop = () => {
    stopping = true;
    console.log('Stopping after saving the current response; no new requests will start.');
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  try {
    const matcher = loadProperNounMatcher();
    const snapshots = [...new Set(values.scopes.split(','))].map(scope => prepare(scope, index, matcher, values.thinking ? 'enabled' : 'disabled', values.model, maxUnits, values.agent));
    for (const snapshot of snapshots) snapshot.additionalReviewSources = additionalReviewSources;
    if (values['require-whole-chapter'] && snapshots.some(snapshot => !coversWholeChapter(snapshot))) {
      throw new Error('This assignment does not cover a whole chapter. Multi-chunk chapter assembly and joint review are not implemented in the pilot; no paid requests started.');
    }
    console.log(`Prepared ${snapshots.length} frozen benchmark packet(s); production extraction and queue untouched.`);
    if (!values.run) return;
    const ledgerFile = path.join(ROOT, 'spending.json');
    const ledger = fs.existsSync(ledgerFile) ? readJson(ledgerFile) : { ceilingUsd: CEILING, startingBalanceUsd: await balance(), requests: [] };
    writeJsonAtomic(ledgerFile, ledger);
    for (const snapshot of snapshots) {
      if (stopping) break;
      if (values.agent) {
        // A failed re-review must not leave a prior approval looking current.
        const evaluationFile = path.join(snapshot.dir, 'evaluation.json');
        if (fs.existsSync(evaluationFile)) fs.unlinkSync(evaluationFile);
        snapshot.chronology = loadChronologyReference();
        writeJsonAtomic(path.join(snapshot.dir, `chronology-${snapshot.chronology.digest.slice(7, 23)}.json`), snapshot.chronology);
        let nextFeedback = feedback;
        let review;
        let chronologyReview;
        let editorialReview;
        const seenReviews = new Set();
        for (let round = 1; round <= reviewRounds; round++) {
          if (stopping) break;
          const result = await runDeepSeekToolPilot(snapshot, {
            maxTurns, feedback: nextFeedback, shouldStop: () => stopping, compare: surfaceComparison,
            request: (turn, body) => paidRequest(snapshot, ledger, ledgerFile,
              `${snapshot.fingerprint}:agent:${turn}`, path.join(snapshot.dir, `agent-response-${turn}.json`), body),
          });
          if (!values.review || stopping || result.status !== 'validated') break;
          await prepareIndependentReviewSources(snapshot);
          editorialReview = await runFocusedEditorialReview(snapshot, (fingerprint, attempt, file, body) =>
            paidRequest(snapshot, ledger, ledgerFile, `${snapshot.fingerprint}:editorial:${fingerprint}:${attempt}`, file, body));
          let effectiveReview = editorialReview;
          if (editorialReview.report.decision === 'approve' && !stopping) {
            chronologyReview = await runChronologyChallenge(snapshot, (fingerprint, attempt, file, body) =>
              paidRequest(snapshot, ledger, ledgerFile, `${snapshot.fingerprint}:chronology:${fingerprint}:${attempt}`, file, body));
            effectiveReview = chronologyReview;
            if (chronologyReview.report.decision === 'approve' && !stopping) {
              review = await runIndependentPeopleReview(snapshot, (fingerprint, attempt, file, body) =>
                paidRequest(snapshot, ledger, ledgerFile, `${snapshot.fingerprint}:review:${fingerprint}:${attempt}`, file, body));
              effectiveReview = review;
            }
          }
          if (effectiveReview.report.decision !== 'revise' || seenReviews.has(effectiveReview.fingerprint)) break;
          seenReviews.add(effectiveReview.fingerprint);
          nextFeedback = semanticRepairFeedback(effectiveReview);
        }
        const state = readJson(path.join(snapshot.dir, 'agent-state.json'));
        const draft = readJson(path.join(snapshot.dir, 'agent-draft.json'));
        const currentApproval = Boolean(review && hasCurrentSemanticApproval(snapshot, state, draft, review)
          && hasCurrentChronologyApproval(snapshot, state, chronologyReview)
          && hasCurrentEditorialApproval(snapshot, state, editorialReview));
        if (sourceHash(snapshot.packet.book, snapshot.packet.chapter) !== snapshot.sourceHash) throw new Error('Source changed during evaluation; no completion can be recorded');
        const requests = ledger.requests.filter(row => row.tag.startsWith(`${snapshot.fingerprint}:`));
        const evaluation = {
          scope: snapshot.scope, sourceHash: snapshot.sourceHash, evaluatedAt: new Date().toISOString(),
          ownedUnits: snapshot.packet.units.length, totalUnits: snapshot.totalUnits,
          wholeChapter: coversWholeChapter(snapshot), independentApproval: currentApproval,
          wholeChapterApproved: coversWholeChapter(snapshot) && currentApproval, productionAuthorized: false,
          counts: { people: draft.people.length, surfaces: draft.surfaces.length, claims: draft.claims.length, translationRepairs: draft.translationRepairs.length },
          requests: requests.length, peakCostUpperUsd: ledgerTotal({ requests }),
          phases: Object.fromEntries(['agent', 'review', 'chronology', 'editorial'].map(phase => {
            const rows = requests.filter(row => row.tag.startsWith(`${snapshot.fingerprint}:${phase}:`));
            return [phase, { requests: rows.length, peakCostUpperUsd: ledgerTotal({ requests: rows }),
              promptTokens: rows.reduce((sum, row) => sum + (row.usage?.prompt_tokens ?? 0), 0),
              completionTokens: rows.reduce((sum, row) => sum + (row.usage?.completion_tokens ?? 0), 0),
              pending: rows.filter(row => row.status === 'pending').length }];
          })),
          extractorFeedbackRounds: state.feedbackDigests?.length ?? 0,
          reviewDecision: review?.report.decision ?? 'pending',
          chronologyDecision: chronologyReview?.report.decision ?? 'pending',
          editorialDecision: editorialReview?.report.decision ?? 'pending',
        };
        writeJsonAtomic(evaluationFile, evaluation);
        console.log(`${snapshot.scope}: ${currentApproval ? 'independently approved' : 'NOT independently approved'}; ${evaluation.ownedUnits}/${evaluation.totalUnits} units; sample peak estimate $${evaluation.peakCostUpperUsd.toFixed(4)}`);
        if (values.review && !currentApproval) {
          process.exitCode = 2;
        }
      } else {
        await runSample(snapshot, ledger, ledgerFile, maxAttempts);
      }
    }
    ledger.lastBalanceUsd = await balance();
    writeJsonAtomic(ledgerFile, ledger);
    console.log(`Pilot total at peak prices: $${ledgerTotal(ledger).toFixed(4)}; account balance: $${ledger.lastBalanceUsd.toFixed(4)}`);
  } finally {
    process.removeListener('SIGINT', stop);
    process.removeListener('SIGTERM', stop);
    fs.closeSync(fd);
    fs.unlinkSync(lock);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    const secret = process.env.DEEPSEEK_API_KEY;
    console.error(secret ? String(error.message).split(secret).join('[REDACTED]') : error.message);
    process.exitCode = 1;
  });
}
