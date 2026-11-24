#!/usr/bin/env node
/**
 * Jinshu 081: restore historical extractor ID grokbot-24 on chunk agentIds only.
 * Proofs: merged #5110 c96b5f… (sha256 4aefc66…) and queue 5a65e981… claims.jinshu/081.
 * Preserve unknown runIds (null). No claim/editorial/source edits.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '081';
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const editorialPath = path.join(PEOPLE_DIR, 'editorial-decisions', book, `${chapter}.json`);
const sourcePath = path.join('data', book, `${chapter}.json`);

const EXPECTED_RANGES = [
  [0, 72], [72, 137], [137, 193], [193, 244], [244, 312], [312, 387],
  [387, 426], [426, 458], [458, 498], [498, 533], [533, 584], [584, 635],
];

const beforeEx = readJson(extractionPath);
const beforePkt = buildDateAuditPacket(book, chapter, { extraction: beforeEx });
const editorialBefore = createHash('sha256').update(readFileSync(editorialPath)).digest('hex');
const sourceBefore = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');

const currentRanges = beforeEx.run.chunks.map((c) => [c.startOrder, c.endOrderExclusive]);
if (JSON.stringify(currentRanges) !== JSON.stringify(EXPECTED_RANGES)) {
  throw new Error('current ranges drifted from proven twelve-chunk plan');
}

const original = JSON.parse(
  readFileSync('/tmp/jinshu081-original-5110.json', 'utf8'),
);
const originalRanges = original.run.chunks.map((c) => [c.startOrder, c.endOrderExclusive]);
if (JSON.stringify(originalRanges) !== JSON.stringify(EXPECTED_RANGES)) {
  throw new Error('original #5110 ranges drifted');
}

const originalSha = createHash('sha256')
  .update(readFileSync('/tmp/jinshu081-original-5110.json'))
  .digest('hex');
if (originalSha !== '4aefc66fe0cb6bc014fa41a3438f58e7c95b8ce2dcf751658e8812111f047afb') {
  // /tmp copy may be pretty-printed; verify via git show bytes instead
  const { execFileSync } = await import('node:child_process');
  const raw = execFileSync('git', [
    'show',
    'c96b5fcda7ea50a179c8c092f588d6ef32447432:data/people/extractions/jinshu/081.json',
  ]);
  const rawSha = createHash('sha256').update(raw).digest('hex');
  if (rawSha !== '4aefc66fe0cb6bc014fa41a3438f58e7c95b8ce2dcf751658e8812111f047afb') {
    throw new Error(`merged #5110 extraction sha mismatch: ${rawSha}`);
  }
}

function nonProvenance(ex) {
  return {
    schemaVersion: ex.schemaVersion,
    book: ex.book,
    chapter: ex.chapter,
    input: ex.input,
    people: ex.people,
    surfaces: ex.surfaces,
    claims: ex.claims,
    translationRepairs: ex.translationRepairs,
    candidateDispositions: ex.candidateDispositions,
    coverage: ex.coverage,
    runMeta: {
      model: ex.run.model,
      promptVersion: ex.run.promptVersion,
      agentId: ex.run.agentId,
      runId: ex.run.runId,
      completedAt: ex.run.completedAt,
      chunkRanges: ex.run.chunks.map((c) => ({
        chunkId: c.chunkId,
        startOrder: c.startOrder,
        endOrderExclusive: c.endOrderExclusive,
        model: c.model,
        runId: c.runId,
        completedAt: c.completedAt,
      })),
    },
  };
}

const beforePayload = nonProvenance(beforeEx);
const afterEx = JSON.parse(JSON.stringify(beforeEx));

if (afterEx.run.agentId !== null) throw new Error('unexpected run.agentId');
if (afterEx.run.runId !== null) throw new Error('unexpected run.runId');

for (const chunk of afterEx.run.chunks) {
  if (chunk.runId !== null) throw new Error(`unexpected chunk runId on ${chunk.chunkId}`);
  if (chunk.agentId !== null && chunk.agentId !== 'grokbot-24') {
    throw new Error(`unexpected existing agentId ${chunk.agentId} on ${chunk.chunkId}`);
  }
  chunk.agentId = 'grokbot-24';
}

if (JSON.stringify(beforePayload) !== JSON.stringify(nonProvenance(afterEx))) {
  throw new Error('non-provenance payload drifted while restoring agentId');
}

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(afterEx));
const written = readJson(extractionPath);
const afterPkt = buildDateAuditPacket(book, chapter);

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(written, extPacket, { strictAliasDispositions: true });

const editorialAfter = createHash('sha256').update(readFileSync(editorialPath)).digest('hex');
const sourceAfter = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');
if (editorialBefore !== editorialAfter) throw new Error('editorial file changed');
if (sourceBefore !== sourceAfter) throw new Error('source chapter changed');
if (beforePkt.sourceHash !== afterPkt.sourceHash) throw new Error('packet sourceHash drifted');
if (written.translationRepairs.filter((r) => r[6] === 'applied').length !== 15) {
  throw new Error('English repairs drifted');
}

const rangeRows = (ranges) => ranges.map(([start, end], i) => ({
  chunkId: String(i + 1).padStart(3, '0'),
  start,
  end,
}));

const receipt = {
  schemaVersion: 1,
  kind: 'owner-extractor-provenance-restore-receipt',
  book,
  chapter,
  pullRequest: 5478,
  proofs: {
    mergedPullRequest: 5110,
    mergedCommit: 'c96b5fcda7ea50a179c8c092f588d6ef32447432',
    mergedExtractionSha256: '4aefc66fe0cb6bc014fa41a3438f58e7c95b8ce2dcf751658e8812111f047afb',
    queueCommit: '5a65e9815519160ebfd0bd56ccad042225c86014',
    queueClaimPath: 'claims["jinshu/081"]',
    queueWorker: 'grokbot-24',
    queueChapterFingerprint: 'sha256:c910cd9ab9e8ecd846ab94f8cf71fb66468afec9232c1d4f35205281bd14a33c',
  },
  ranges: {
    confirmedIdentical: true,
    current: rangeRows(currentRanges),
    originalMerged5110: rangeRows(originalRanges),
    queueGrokbotPlan: EXPECTED_RANGES.map(([start, end], i) => ({
      id: String(i + 1).padStart(3, '0'),
      start,
      end,
    })),
  },
  metadataOnlyChange: {
    field: 'run.chunks[*].agentId',
    before: null,
    after: 'grokbot-24',
    preservedUnknownRunIds: true,
    runLevelAgentIdRemainsNull: true,
    runLevelRunIdRemainsNull: true,
    chunkRunIdsRemainNull: true,
  },
  dateDependencyBeforeAfter: {
    note: 'extractionHash includes run metadata; claim/people/editorial/source bytes outside provenance are unchanged.',
    sourceHashBefore: beforePkt.sourceHash,
    sourceHashAfter: afterPkt.sourceHash,
    extractionHashBefore: beforePkt.extractionHash,
    extractionHashAfter: afterPkt.extractionHash,
    sourceFileSha256: sourceAfter,
    editorialDecisionsSha256: editorialAfter,
    claimsPeopleSurfacesCoverageUnchanged: true,
    appliedEnglishRepairs: 15,
  },
  notDone: [
    'no independent rebind',
    'no quality-gate edits',
    'no other chapter edits',
    'no merge',
    'no date-audit self-approval',
  ],
};

writeJsonAtomic('research/people/jinshu081-owner-extractor-provenance-receipt-20261124.json', receipt);
writeJsonAtomic('research/people/jinshu081-owner-date-dependency-before-after-20261124.json', {
  schemaVersion: 1,
  kind: 'date-dependency-before-after',
  book,
  chapter,
  pullRequest: 5478,
  reason: 'Metadata-only extractor ID restore changes extractionHash; sourceHash and reviewed claim evidence unchanged.',
  before: {
    extractionHash: beforePkt.extractionHash,
    sourceHash: beforePkt.sourceHash,
  },
  after: {
    extractionHash: afterPkt.extractionHash,
    sourceHash: afterPkt.sourceHash,
  },
  unchangedOutsideProvenance: {
    claims: true,
    people: true,
    surfaces: true,
    coverage: true,
    translationRepairs: true,
    editorialDecisions: true,
    sourceChapter: true,
    chunkRanges: true,
    runIdsRemainUnknownNull: true,
  },
});

console.log(JSON.stringify({
  extractionHashBefore: beforePkt.extractionHash,
  extractionHashAfter: afterPkt.extractionHash,
  sourceHashUnchanged: beforePkt.sourceHash === afterPkt.sourceHash,
  chunkAgentIds: [...new Set(written.run.chunks.map((c) => c.agentId))],
  appliedRepairs: 15,
}, null, 2));
console.log('PASS');
