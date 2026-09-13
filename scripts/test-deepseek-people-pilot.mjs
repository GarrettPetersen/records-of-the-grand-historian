import assert from 'node:assert/strict';
import test from 'node:test';
import { reserveCost, usageCost, surfaceComparison, hasRunawayIds, coversWholeChapter } from './deepseek-people-pilot.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { newToolState, compileToolDraft, executePeopleTool, runDeepSeekToolPilot } from './lib/deepseek-people-tools.mjs';
import { validateChronologyReference, loadChronologyReference, lookupChronology, chronologyCitationErrors } from './lib/people-chronology-reference.mjs';
import { historicalSourceUrl, fetchHistoricalSource, historicalSourcePassage } from './lib/people-historical-research.mjs';
import { validateSemanticReport, semanticReviewFingerprint, hasCurrentSemanticApproval, parseSemanticReport, semanticRepairFeedback, reviewEvidenceProjections, runBoundedReview, prepareIndependentReviewSources } from './lib/deepseek-people-review.mjs';
import { sha256 } from './lib/people-content.mjs';
import { chronologyChallengeDossier, chronologyChallengeFingerprint, validateChronologyChallenge, hasCurrentChronologyApproval } from './lib/deepseek-people-chronology-review.mjs';
import { editorialReviewFingerprint, validateFocusedEditorialReport, hasCurrentEditorialApproval } from './lib/deepseek-people-editorial-review.mjs';
import { deriveTimeWindow } from './lib/people-time-window.mjs';

test('peak-price reservation covers a byte-per-token prompt and capped completion', () => {
  const messages = [{ role: 'user', content: 'A bilingual source packet with punctuation.' }];
  const promptTokens = Buffer.byteLength(JSON.stringify(messages)) + 4096;
  assert.ok(reserveCost(messages, 32768) >= usageCost({ prompt_tokens: promptTokens, completion_tokens: 32768 }));
});

test('cached input is charged once, at the cached rate', () => {
  assert.equal(usageCost({ prompt_tokens: 1000000, completion_tokens: 1000000, prompt_cache_hit_tokens: 500000 }), 1.353);
});

test('missing, negative or contradictory usage cannot zero out a spending reservation', () => {
  for (const usage of [undefined, {}, { prompt_tokens: 1, completion_tokens: -1 },
    { prompt_tokens: 10, completion_tokens: 0, prompt_cache_hit_tokens: 11 }]) {
    assert.throws(() => usageCost(usage));
  }
});

test('comparison expands grouped occurrences, ignores local IDs, and excludes adjacent context', () => {
  const snapshot = { packet: { units: [{ id: 's0001' }] }, baseline: { surfaces: [
    ['p001', 'personal-name', 'en', 'Fan Ye', [['s0001', [0, 1]], ['s0002', [0]]]],
  ] } };
  const pilot = { surfaces: [['p005', 'personal-name', 'en', 'Fan Ye', [['s0001', [0]]]]] };
  const comparison = surfaceComparison(pilot, snapshot);
  assert.equal(comparison.baselineSurfaces, 2);
  assert.deepEqual(comparison.missingFromPilot.map(row => [row.unit, row.occurrence]), [['s0001', 1]]);
  assert.deepEqual(comparison.additionalInPilot, []);
});

test('runaway ID generation is distinguished from useful output hitting a token limit', () => {
  assert.equal(hasRunawayIds(Array.from({ length: 2000 }, (_, index) => `"p${index}"`).join(', ')), true);
  assert.equal(hasRunawayIds('["p001", "p002", "p003"]'), false);
});

test('each supported model reserves against its own peak rate and unknown models fail', () => {
  const messages = [{ role: 'user', content: 'source packet' }];
  assert.ok(reserveCost(messages, 65536, 'deepseek-v4-pro') > reserveCost(messages, 65536));
  assert.throws(() => reserveCost(messages, 65536, 'unpriced-model'));
});

test('after an uncertain event uses its earliest possible year, not a ruler death or a circa endpoint', () => {
  const bc = year => ({ era: 'BC', year, precision: 'year' });
  const window = deriveTimeWindow([{ relation: 'after', start: bc(547), end: bc(490) }, { relation: 'before', start: bc(481), end: bc(481) }]);
  assert.equal(window.bounded, true);
  assert.deepEqual(window.start, bc(547));
  assert.deepEqual(window.end, bc(481));
  assert.equal(deriveTimeWindow([{ relation: 'before', start: bc(481), end: bc(481) }]).bounded, false);
  const ad = year => ({ era: 'AD', year, precision: 'year' });
  assert.equal(deriveTimeWindow([{ relation: 'during', start: bc(1), end: ad(1) }]).bounded, true);
  assert.throws(() => deriveTimeWindow([{ relation: 'during', start: ad(2), end: bc(1) }]), /reversed/);
  assert.throws(() => deriveTimeWindow([{ relation: 'during', start: bc(1), end: ad(0) }]), /positive/);
  assert.throws(() => deriveTimeWindow([{ relation: 'after', start: ad(2), end: ad(3) }, { relation: 'before', start: bc(2), end: bc(1) }]), /no overlapping/);
});

const snapshot = {
  fingerprint: 'test-packet', scope: 'shiji/058', chunk: { index: 0 },
  seed: { schemaVersion: 2, book: 'shiji', chapter: '058', input: { immutable: true }, run: { model: 'deepseek-flash' }, coverage: { allUnitsVisited: false } },
  packet: { book: 'shiji', chapter: '058', units: [] },
  worker: { units: [['s0001', 'p', '武', 'Wu', 'Wu']], candidates: [], readOnlyContext: { before: [], after: [] } },
  messages: [{ content: 'instructions<schema>schema' }],
  instructions: 'Extract source-grounded people and facts.',
};

test('tool instructions omit the obsolete one-shot no-tools and no-research wrapper', () => {
  const state = newToolState(snapshot);
  assert.equal(executePeopleTool(state, snapshot, 'read_reference', { name: 'instructions' }), snapshot.instructions);
  assert.throws(() => executePeopleTool(state, { ...snapshot, instructions: undefined }, 'read_reference', { name: 'instructions' }));
});

test('research discovery exposes primary chapter URLs without pretending they are verified', () => {
  const state = newToolState(snapshot);
  const guide = executePeopleTool(state, snapshot, 'read_reference', { name: 'research-guide' });
  assert.equal(guide.sources.length, 2);
  assert.ok(guide.sources.every(row => historicalSourceUrl(row.url)));
  assert.match(guide.guidance, /discovery links are not claim citations/);
  assert.equal(state.researchDocuments, undefined);
  const other = executePeopleTool(state, { ...snapshot, packet: { ...snapshot.packet, book: 'hanshu' } }, 'read_reference', { name: 'research-guide' });
  assert.deepEqual(other.sources, []);
});

test('whole-chapter completion requires every unique source unit and one joint packet', () => {
  const full = { totalUnits: 2, chunk: { count: 1, start: 0, end: 2 }, packet: { units: [{ id: 's0001' }, { id: 's0002' }] } };
  assert.equal(coversWholeChapter(full), true);
  assert.equal(coversWholeChapter({ ...full, totalUnits: undefined }), false);
  assert.equal(coversWholeChapter({ ...full, totalUnits: 3 }), false);
  assert.equal(coversWholeChapter({ ...full, chunk: { count: 2, start: 0, end: 2 } }), false);
  assert.equal(coversWholeChapter({ ...full, packet: { units: [{ id: 's0001' }, { id: 's0001' }] } }), false);
});

test('review feedback preserves source judgment and cannot automatically reopen a research hold', () => {
  assert.throws(() => semanticRepairFeedback({ report: { decision: 'research-blocked' } }));
  assert.throws(() => semanticRepairFeedback({ report: { decision: 'approve' } }));
  const feedback = semanticRepairFeedback({ fingerprint: 'sha256:test', report: { decision: 'revise', findings: ['source correction'] } });
  assert.match(feedback, /not authoritative facts/);
  assert.match(feedback, /report_blocker/);
  assert.match(feedback, /sha256:test/);
});
const claim = { id: 'f001', person: 'p001', kind: 'sex', value: { sex: 'male' }, certainty: 'explicit', evidence: ['s0001'] };

test('review projections put exact date citations and all repair-dependent facts beside their source', () => {
  const state = newToolState(snapshot);
  state.records.people.p001 = { preferredEnglish: 'A person' };
  state.records.claims.f001 = { ...claim, kind: 'attestation', value: { westernYear: { era: 'BC', year: 100, precision: 'year' } } };
  state.records.claims.f002 = { ...claim, id: 'f002' };
  state.records.translationRepairs.r1 = { id: 'r1', unit: 's0001', field: 'idiomatic' };
  state.records.surfaces.s1 = { person: 'p001', language: 'zh', exact: 'source', locations: [{ unit: 's0001', occurrences: [0, 1] }] };
  state.researchDocuments = { doc: { url: 'https://zh.wikisource.org/wiki/Example' } };
  state.researchCitations = { f001: { passages: [{ documentId: 'doc', quote: 'Actual evidence quotation', explanation: 'The actual explanation' }] } };
  const source = { id: 's0001', zh: 'source', en: 'idiomatic', literal: 'literal' };
  const projection = reviewEvidenceProjections({ ...snapshot, packet: { units: [source] } }, state);
  assert.equal(projection.dateEvidence.length, 1);
  assert.equal(projection.dateEvidence[0].passages[0].quote, 'Actual evidence quotation');
  assert.equal(projection.dateEvidence[0].person, 'A person');
  assert.deepEqual(projection.repairDependencies[0].dependentClaims.map(row => row.id), ['f001', 'f002']);
  assert.deepEqual(projection.repairDependencies[0].source, source);
  assert.deepEqual(projection.mentionCoverage, [{ unit: 's0001', mentions: [
    { person: 'p001', language: 'zh', exact: 'source', occurrences: [0, 1] },
  ] }]);
});

test('tool upserts retain other saved records and host-owned metadata', () => {
  const state = newToolState(snapshot);
  executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [claim, { ...claim, id: 'f002' }] });
  executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [{ ...claim, certainty: 'uncertain' }] });
  const draft = compileToolDraft(state, snapshot);
  assert.equal(draft.claims.length, 2);
  assert.equal(draft.claims[0][3], 'uncertain');
  assert.deepEqual(draft.input, snapshot.seed.input);
  assert.deepEqual(draft.run, snapshot.seed.run);
});

test('an invalid record rejects its entire small write batch without losing prior work', () => {
  const state = newToolState(snapshot);
  executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [claim] });
  const before = structuredClone(state);
  assert.throws(() => executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [
    { ...claim, id: 'f002' }, { ...claim, id: 'f003', person: 'not-a-person-id' },
  ] }));
  assert.deepEqual(state, before);
});

test('claim vocabulary errors fail at the small write batch instead of accumulating until finish', () => {
  const state = newToolState(snapshot);
  const bad = { ...claim, id: 'f002', kind: 'attestation', value: { sourceDate: { text: 'A dated event' }, westernYear: { era: 'BC', year: 100 }, note: 'invalid top-level field' } };
  assert.throws(() => executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [claim, bad] }), /precision must|unknown key/);
  assert.deepEqual(state.records.claims, {});
});

test('literal surface errors fail immediately and atomically with no invented name expansion', () => {
  const state = newToolState(snapshot);
  const source = { ...snapshot, packet: { ...snapshot.packet, units: [{ id: 's0001', zh: '常', en: 'Chang' }] } };
  const surface = { id: 's1', person: 'p001', kind: 'personal-name', language: 'zh', exact: '田常', locations: [{ unit: 's0001', occurrences: [0] }] };
  assert.throws(() => executePeopleTool(state, source, 'write_records', { section: 'surfaces', records: [surface] }), /Could not find/);
  assert.deepEqual(state.records.surfaces, {});
  executePeopleTool(state, source, 'write_records', { section: 'surfaces', records: [{ ...surface, exact: '常' }] });
  assert.equal(state.records.surfaces.s1.exact, '常');
});

test('repair writes reject stale text, no-ops, and duplicate field proposals atomically', () => {
  const state = newToolState(snapshot);
  const local = { ...snapshot, packet: { ...snapshot.packet, units: [{ id: 's0001', zh: 'source', en: 'Original English.', literal: 'Original literal.' }] } };
  const repair = { id: 'r1', unit: 's0001', field: 'idiomatic', oldText: 'Original English.', newText: 'Corrected English.', rationale: 'A source-supported meaning correction.', confidence: 'high' };
  executePeopleTool(state, local, 'write_records', { section: 'translationRepairs', records: [repair] });
  const before = structuredClone(state);
  for (const bad of [
    { ...repair, id: 'r2', oldText: 'Stale English.' },
    { ...repair, id: 'r2', newText: repair.oldText },
    { ...repair, id: 'r2' },
    { ...repair, id: 'r2', unit: 's9999' },
    { ...repair, id: 'r2', field: 'literal' },
  ]) {
    assert.throws(() => executePeopleTool(state, local, 'write_records', { section: 'translationRepairs', records: [
      { ...repair, newText: 'Another corrected English.' }, bad,
    ] }));
    assert.deepEqual(state, before);
  }
  executePeopleTool(state, local, 'write_records', { section: 'translationRepairs', records: [{ ...repair, newText: 'Another corrected English.' }] });
  assert.equal(Object.keys(state.records.translationRepairs).length, 1);
  assert.equal(state.records.translationRepairs.r1.newText, 'Another corrected English.');
});

test('tools reject arbitrary sections, paths, and undeclared fields', () => {
  const state = newToolState(snapshot);
  assert.throws(() => executePeopleTool(state, snapshot, 'write_records', { section: '../../.env', records: [claim] }));
  assert.throws(() => executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [{ ...claim, execute: 'anything' }] }));
  assert.throws(() => executePeopleTool(state, snapshot, 'shell', { command: 'pwd' }));
});

test('source reads record coverage and do not expose the baseline or secrets', () => {
  const state = newToolState(snapshot);
  const result = executePeopleTool(state, { ...snapshot, baseline: { private: 'baseline' } }, 'read_source', { start: 0, count: 1 });
  assert.deepEqual(state.readUnits, ['s0001']);
  assert.equal(JSON.stringify(result).includes('baseline'), false);
  assert.throws(() => executePeopleTool(state, snapshot, 'read_source', { start: 2, count: 1 }));
});

test('failed finish cannot approve unread source or an incomplete draft', () => {
  const state = newToolState(snapshot);
  const result = executePeopleTool(state, snapshot, 'finish', { auditComplete: true });
  assert.equal(result.ok, false);
  assert.equal(state.accepted, false);
  assert.ok(result.errors.some(error => error.includes('not yet read')));
});

test('an explicit research blocker pauses work without accepting or discarding saved records', () => {
  const state = newToolState(snapshot);
  executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [claim] });
  const result = executePeopleTool(state, snapshot, 'report_blocker', {
    units: ['s0001'], reason: 'The source supplies no verifiable Western year for this retrospective family reference.',
  });
  assert.equal(result.paused, true);
  assert.equal(state.accepted, false);
  assert.deepEqual(state.records.claims.f001, claim);
  assert.throws(() => executePeopleTool(state, snapshot, 'finish', { auditComplete: true }), /blocker remains open/);
  assert.throws(() => executePeopleTool(state, snapshot, 'report_blocker', { units: ['s9999'], reason: 'A sufficiently long but invalid source reference.' }));
});

test('saved tool mutations and conversation resume together after a later request fails', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deepseek-tools-test-'));
  try {
    const local = { ...snapshot, dir };
    fs.writeFileSync(path.join(dir, 'evaluation.json'), JSON.stringify({ wholeChapterApproved: true }));
    await assert.rejects(runDeepSeekToolPilot(local, {
      maxTurns: 2, shouldStop: () => false, compare: () => ({}),
      request: async turn => {
        if (turn === 2) throw new Error('simulated interruption');
        return { choices: [{ finish_reason: 'tool_calls', message: { role: 'assistant', content: null, tool_calls: [
          { id: 'call_1', type: 'function', function: { name: 'write_records', arguments: JSON.stringify({ section: 'claims', records: [claim] }) } },
        ] } }] };
      },
    }), /simulated interruption/);
    assert.equal(fs.existsSync(path.join(dir, 'evaluation.json')), false);
    const saved = JSON.parse(fs.readFileSync(path.join(dir, 'agent-state.json')));
    assert.equal(saved.nextTurn, 2);
    assert.deepEqual(saved.records.claims.f001, claim);
    assert.equal(saved.messages.at(-1).tool_call_id, 'call_1');
    await assert.rejects(runDeepSeekToolPilot(local, {
      maxTurns: 2, shouldStop: () => false, compare: () => ({}),
      request: async (turn, body) => {
        assert.equal(turn, 2);
        assert.equal(body.messages.at(-1).tool_call_id, 'call_1');
        throw new Error('verified resumed turn');
      },
    }), /verified resumed turn/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('reviewed chronology loads only when its cited primary-text excerpts still match', () => {
  const reference = loadChronologyReference();
  assert.equal(lookupChronology(reference, '竇太后').matches[0].westernYear.year, 179);
  assert.equal(lookupChronology(reference, 'Emperor Wen').matches.length, 3);
  assert.equal(lookupChronology(reference, 'nonexistent reign').matches.length, 0);
  const invalid = structuredClone(reference);
  invalid.entries[0].westernYear.year = 0;
  assert.throws(() => validateChronologyReference(invalid), /year zero/);
});

test('chronology citations require lookup, exact year support, and unchanged claim content', () => {
  const reference = loadChronologyReference();
  const local = { ...snapshot, chronology: reference };
  const state = newToolState(local);
  const dated = { ...claim, kind: 'attestation', value: { sourceDate: { text: 'Wen year 2' }, westernYear: { era: 'BC', year: 178, precision: 'year' } } };
  executePeopleTool(state, local, 'write_records', { section: 'claims', records: [dated] });
  assert.equal(chronologyCitationErrors(state, reference).length, 1);
  assert.throws(() => executePeopleTool(state, local, 'cite_chronology', { citations: [{ claimId: claim.id, referenceId: 'han-wen-first-2' }] }));
  executePeopleTool(state, local, 'lookup_chronology', { query: 'Emperor Wen' });
  executePeopleTool(state, local, 'cite_chronology', { citations: [{ claimId: claim.id, referenceId: 'han-wen-first-2' }] });
  assert.equal(chronologyCitationErrors(state, reference).length, 0);
  state.records.claims.f001.value.westernYear.year = 179;
  assert.equal(chronologyCitationErrors(state, reference).length, 1);
  state.chronologyCitations.f001.recordHash = sha256(JSON.stringify(state.records.claims.f001));
  assert.match(chronologyCitationErrors(state, reference)[0], /does not support/);
});

test('research refuses local hosts, credentials, ports, and unsafe redirect destinations', async () => {
  for (const url of ['http://ctext.org/a', 'https://localhost/a', 'https://127.0.0.1/a', 'https://ctext.org.evil.example/a', 'https://user:secret@ctext.org/a', 'https://ctext.org:8080/a']) assert.throws(() => historicalSourceUrl(url));
  await assert.rejects(fetchHistoricalSource('https://ctext.org/a', async () => new Response('', { status: 302, headers: { location: 'https://127.0.0.1/private' } })), /approved public/);
});

test('targeted research reads bounded context without truncating the saved evidence', () => {
  const document = { id: 'source', content: 'a'.repeat(10000) + 'The relevant event' + 'z'.repeat(20000) };
  const before = structuredClone(document);
  const passage = historicalSourcePassage(document, 'The relevant event');
  assert.equal(passage.content.length, 4000);
  assert.equal(passage.passageStart, 9200);
  assert.equal(passage.passageEnd, 13200);
  assert.equal(passage.truncated, true);
  assert.ok(passage.content.includes('The relevant event'));
  assert.equal(historicalSourcePassage(document, '').content.length, 16000);
  assert.equal(historicalSourcePassage({ content: 'short source' }, 'short').truncated, false);
  assert.throws(() => historicalSourcePassage(document, 'missing'), /not found/);
  assert.throws(() => historicalSourcePassage(document, 'a'.repeat(2001)), /2000/);
  assert.deepEqual(document, before);
});

test('additional review sources retain pinned evidence and archives without overriding verdicts', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deepseek-review-sources-'));
  try {
    const local = { dir, packet: { book: 'shiji', chapter: '064' } };
    const fetched = [];
    const fetchSource = async url => {
      fetched.push(url);
      return { id: sha256(url), url, content: `Source evidence for ${url}` };
    };
    await prepareIndependentReviewSources(local, fetchSource);
    assert.equal(fetched.length, 2);
    const original = structuredClone(local.independentSources);
    local.additionalReviewSources = [{ label: 'Independent annotated reading', url: 'https://kanbun.info/shibu01/shiki064.html' }];
    await prepareIndependentReviewSources(local, fetchSource);
    assert.equal(fetched.length, 3);
    assert.deepEqual(local.independentSources.slice(0, 2), original);
    assert.equal(fs.readdirSync(path.join(dir, 'independent-source-archives')).length, 1);
    delete local.additionalReviewSources;
    await prepareIndependentReviewSources(local, fetchSource);
    assert.equal(local.independentSources.length, 3);
    assert.equal(fetched.length, 3);
    const pinned = fs.readFileSync(path.join(dir, 'independent-source-documents.json'), 'utf8');
    local.additionalReviewSources = [{ label: 'Unavailable', url: 'https://ctext.org/unavailable' }];
    await assert.rejects(prepareIndependentReviewSources(local, async () => { throw new Error('Unavailable source'); }), /Unavailable/);
    assert.equal(fs.readFileSync(path.join(dir, 'independent-source-documents.json'), 'utf8'), pinned);
    local.additionalReviewSources = [{ label: 'Unsafe', url: 'https://localhost/private' }];
    await assert.rejects(prepareIndependentReviewSources(local, fetchSource), /approved public/);
    assert.equal(fetched.length, 3);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a research citation requires a real saved quotation and goes stale on claim edits', () => {
  const state = newToolState(snapshot);
  executePeopleTool(state, snapshot, 'write_records', { section: 'claims', records: [{ ...claim, value: { westernYear: { era: 'BC', year: 179, precision: 'year' } } }] });
  state.researchDocuments = { doc: { content: 'A source statement places the appointment in 179 BC.', url: 'https://ctext.org/example' } };
  const args = { claimId: 'f001', documentId: 'doc', quote: 'places the appointment in 179 BC', explanation: 'This is supplementary evidence for the identified person, not a date in the local passage.' };
  assert.throws(() => executePeopleTool(state, snapshot, 'cite_research', { ...args, quote: 'An invented quotation that does not occur.' }));
  executePeopleTool(state, snapshot, 'cite_research', args);
  executePeopleTool(state, snapshot, 'cite_research', { ...args, quote: 'source statement places the appointment', explanation: 'A separate exact excerpt retained alongside the first cited passage.' });
  assert.equal(state.researchCitations.f001.passages.length, 2);
  assert.equal(chronologyCitationErrors(state, { entries: [] }).length, 0);
  state.records.claims.f001.certainty = 'uncertain';
  assert.equal(chronologyCitationErrors(state, { entries: [] }).length, 1);
});

function approvedReport() {
  return { decision: 'approve', summary: 'All provided source units and source evidence have been reviewed.', reviewedUnits: ['s0001'], reviewedPeople: [],
    checks: Object.fromEntries(['identity','mentions','family','chronology','facts','editorial'].map(key => [key, { passed: true, reasoning: 'The cited source evidence supports this reviewed category.' }])), findings: [], dateChecks: [], repairChecks: [] };
}

test('review cannot omit dated records or bury a failed endpoint without an actionable finding', () => {
  const state = newToolState(snapshot);
  state.records.claims.f001 = { ...claim, kind: 'attestation', value: { westernYear: { era: 'BC', year: 100, precision: 'circa' } } };
  assert.throws(() => validateSemanticReport(approvedReport(), snapshot, state), /dateChecks must cover/);
  const report = { ...approvedReport(), decision: 'revise', dateChecks: [{ record: 'f001', passed: false, reasoning: 'The date is unsupported by any cited passage.' }] };
  assert.throws(() => validateSemanticReport(report, snapshot, state), /actionable finding/);
  report.findings = [{ records: ['f001'], units: ['s0001'], problem: 'The date endpoint is unsupported by the evidence.', correction: 'Research the actual event and cite its supported date.' }];
  assert.doesNotThrow(() => validateSemanticReport(report, snapshot, state));
  assert.throws(() => validateSemanticReport({ ...report, dateChecks: [...report.dateChecks, ...report.dateChecks] }, snapshot, state), /exactly once/);
});

test('focused chronology withholds worker rationalizations and binds approval to the actual evidence', () => {
  const local = { ...snapshot, chronology: { entries: [] } };
  const state = newToolState(local);
  state.accepted = true;
  state.auditComplete = true;
  state.records.claims.f001 = { ...claim, kind: 'attestation', value: { westernYear: { era: 'BC', year: 100, precision: 'circa' } } };
  state.researchDocuments = { doc: { url: 'https://zh.wikisource.org/wiki/Example', title: 'Source', content: 'A source passage with its own wording.' } };
  state.researchCitations = { f001: { passages: [{ documentId: 'doc', quote: 'A source passage', explanation: 'TRUST_MY_UNSUPPORTED_JUSTIFICATION' }] } };
  const dossier = chronologyChallengeDossier(local, state);
  assert.equal(JSON.stringify(dossier).includes('TRUST_MY_UNSUPPORTED_JUSTIFICATION'), false);
  assert.equal(dossier.dates[0].passages[0].quote, 'A source passage');
  assert.equal(dossier.dates[0].dateFields[0].field, 'value.westernYear');
  const report = { decision: 'approve', summary: 'The date is supported by the source evidence.', dateChecks: [{ record: 'f001', passed: true, reasoning: 'The source supports the single stated year.' }], findings: [] };
  const review = { fingerprint: chronologyChallengeFingerprint(local, state), report };
  assert.equal(hasCurrentChronologyApproval(local, state, undefined), false);
  assert.equal(hasCurrentChronologyApproval(local, state, review), true);
  assert.throws(() => validateChronologyChallenge({ ...report, dateChecks: [] }, local, state), /each dated claim/);
  state.records.claims.f001.value.westernYear.year = 101;
  assert.equal(hasCurrentChronologyApproval(local, state, review), false);
});

test('chronology dossiers label endpoints and sort BC/AD years by time rather than magnitude', () => {
  const local = { ...snapshot, chronology: { entries: [] } };
  const state = newToolState(local);
  const year = (era, year, precision = 'year') => ({ era, year, precision });
  state.records.claims.f001 = { ...claim, kind: 'attestation', value: { westernInterval: { end: year('BC', 490), start: year('BC', 547) } } };
  state.records.claims.f002 = { ...claim, id: 'f002', kind: 'death', value: { westernYear: year('BC', 500, 'circa') } };
  state.records.claims.f003 = { ...claim, id: 'f003', kind: 'attestation', value: { westernInterval: { start: year('BC', 1), end: year('AD', 1) } } };
  const dossier = chronologyChallengeDossier(local, state);
  assert.deepEqual(dossier.calendarOrder.map(date => `${date.era} ${date.year}`), ['BC 547', 'BC 500', 'BC 490', 'BC 1', 'AD 1']);
  assert.deepEqual(dossier.dates[0].dateFields, [
    { field: 'value.westernInterval.start', date: year('BC', 547) },
    { field: 'value.westernInterval.end', date: year('BC', 490) },
  ]);
  assert.equal(dossier.dates[1].dateFields[0].date.precision, 'circa');
});

test('focused editorial review covers unproposed source units and invalidates changed translations', () => {
  const local = { ...snapshot, packet: { units: [{ id: 's0001', zh: 'source', en: 'original', literal: 'literal' }] } };
  const state = newToolState(local);
  state.accepted = true;
  state.auditComplete = true;
  const report = { decision: 'approve', summary: 'Both translations have been compared with the source.', reviewedUnits: ['s0001'], repairChecks: [], findings: [] };
  const review = { fingerprint: editorialReviewFingerprint(local, state), report };
  assert.equal(hasCurrentEditorialApproval(local, state, review), true);
  assert.throws(() => validateFocusedEditorialReport({ ...report, reviewedUnits: [] }, local, state), /every owned unit/);
  const revise = { ...report, decision: 'revise', findings: [{ records: [], units: ['s0001'], problem: 'This unrepaired source unit has a wrong translation.', correction: 'Correct both fields to express the source meaning.' }] };
  assert.doesNotThrow(() => validateFocusedEditorialReport(revise, local, state));
  state.records.translationRepairs.r1 = { id: 'r1', unit: 's0001', field: 'idiomatic', oldText: 'original', newText: 'changed' };
  assert.equal(hasCurrentEditorialApproval(local, state, review), false);
});

test('semantic approval requires full review coverage and no contradictory findings', () => {
  const state = newToolState(snapshot);
  assert.doesNotThrow(() => validateSemanticReport(approvedReport(), snapshot, state));
  assert.throws(() => validateSemanticReport({ ...approvedReport(), reviewedUnits: [] }, snapshot, state), /every owned/);
  const report = approvedReport();
  report.checks.family.passed = false;
  assert.throws(() => validateSemanticReport(report, snapshot, state), /contradicts/);
});

test('logged transport normalization recovers a single encoded argument wrapper without relaxing review validation', () => {
  const original = approvedReport();
  const parsed = parseSemanticReport(JSON.stringify({ arguments: JSON.stringify(original) }));
  assert.deepEqual(parsed.report, original);
  assert.equal(parsed.normalization, 'unwrapped-single-arguments-string');
  assert.doesNotThrow(() => validateSemanticReport(parsed.report, snapshot, newToolState(snapshot)));
  const extra = parseSemanticReport(JSON.stringify({ arguments: JSON.stringify(original), ignore: true }));
  assert.equal(extra.normalization, 'none');
  assert.throws(() => validateSemanticReport(extra.report, snapshot, newToolState(snapshot)));
  assert.throws(() => parseSemanticReport(JSON.stringify({ arguments: 'not JSON' })));
});

test('bounded review resumes truncated paid reasoning instead of starting a fresh review', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-review-'));
  const requests = [];
  try {
    const result = await runBoundedReview({ scope: 'test', dir, fingerprint: 'test-review', settings: {},
      messages: [{ role: 'user', content: 'Frozen evidence' }], schema: { type: 'object' },
      validate: report => validateSemanticReport(report, snapshot, newToolState(snapshot)),
      request: async (_fingerprint, attempt, _file, body) => {
        requests.push(structuredClone(body));
        if (attempt === 1) return { choices: [{ finish_reason: 'length', message: { role: 'assistant', content: '', reasoning_content: 'Paid reasoning is retained.' } }] };
        return { model: 'test', choices: [{ finish_reason: 'tool_calls', message: { role: 'assistant', content: null,
          tool_calls: [{ id: 'review1', function: { name: 'submit_review', arguments: JSON.stringify(approvedReport()) } }] } }] };
      } });
    assert.equal(result.report.decision, 'approve');
    assert.equal(requests.length, 2);
    assert.ok(requests[1].messages.some(message => message.reasoning_content === 'Paid reasoning is retained.'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('changed review instructions resume only unfinished same-model reasoning for identical evidence', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-review-recovery-'));
  const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value));
  const evidence = { source: 'same frozen source' };
  try {
    for (const name of ['old', 'completed', 'different-source', 'new']) fs.mkdirSync(path.join(root, name));
    for (const name of ['old', 'completed', 'new']) write(path.join(root, name, 'dossier.json'), evidence);
    write(path.join(root, 'different-source', 'dossier.json'), { source: 'another source' });
    for (const name of ['old', 'completed', 'different-source']) write(path.join(root, name, 'response-1.json'), {
      model: 'test-model', choices: [{ finish_reason: 'length', message: { role: 'assistant', content: '', reasoning_content: `${name} reasoning` } }],
    });
    write(path.join(root, 'completed', 'review.json'), { report: 'already reviewed' });
    const dir = path.join(root, 'new');
    await runBoundedReview({ scope: 'test', dir, fingerprint: 'new-rules', settings: { model: 'test-model' },
      messages: [{ role: 'system', content: 'Current instructions' }, { role: 'user', content: JSON.stringify(evidence) }], schema: { type: 'object' },
      validate: report => validateSemanticReport(report, snapshot, newToolState(snapshot)),
      request: async (_fingerprint, _attempt, _file, body) => {
        assert.ok(body.messages.some(message => message.reasoning_content === 'old reasoning'));
        assert.ok(!body.messages.some(message => ['completed reasoning', 'different-source reasoning'].includes(message.reasoning_content)));
        return { model: 'test-model', choices: [{ finish_reason: 'tool_calls', message: { role: 'assistant', content: null,
          tool_calls: [{ id: 'review1', function: { name: 'submit_review', arguments: JSON.stringify(approvedReport()) } }] } }] };
      } });
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'recovery.json'))).from, path.join(root, 'old'));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('review approvals are invalidated by a changed draft, research source, or claim binding', () => {
  const local = { ...snapshot, chronology: { entries: [], sources: [], digest: 'ref1' } };
  const state = newToolState(local);
  state.accepted = true;
  state.auditComplete = true;
  const draft = compileToolDraft(state, local);
  const review = { fingerprint: semanticReviewFingerprint(local, state, draft), report: approvedReport() };
  assert.equal(hasCurrentSemanticApproval(local, state, draft, review), true);
  assert.equal(hasCurrentSemanticApproval(local, state, { ...draft, changed: true }, review), false);
  assert.equal(hasCurrentSemanticApproval({ ...local, chronology: { ...local.chronology, digest: 'ref2' } }, state, draft, review), false);
  state.chronologyCitations = { added: {} };
  assert.equal(hasCurrentSemanticApproval(local, state, draft, review), false);
});
