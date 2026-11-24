#!/usr/bin/env node
/**
 * Jinshu 110 owner apply: strip off-chapter westernInterval on claims 94/95/96
 * per independent head review 3e2913c36c at owner tip 3f7eb2d435.
 *
 * Preserve source labels 仲尼 / 魏武 / 高祖; leave claim-670 昇平四年 conversion
 * hold; do not touch 181 hints or unrelated rows. No self-approval / merge.
 */
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '110';
const review = readJson('research/people/jinshu110-independent-owner-head-review-3f7eb2d4-20261124.json');
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (packet.extractionHash !== 'sha256:9f1573e0006d086e7f6d11b6aec72324e0179e22b2ff9d5ba134c37666339a8d') {
  throw new Error(`unexpected extractionHash ${packet.extractionHash}`);
}
if (review.ownerHeadCommit !== '3f7eb2d43500de6548019363b68d05bd00045797') {
  throw new Error(`unexpected review owner head ${review.ownerHeadCommit}`);
}

const TARGETS = {
  94: {
    sourceLabel: '仲尼',
    after: {
      sourceDate: { text: '仲尼' },
      unresolved: true,
      unresolvedReason:
        'Speech exemplar「仲尼」on s0019; chapter cite supplies no personal calendar year — do not import off-chapter Confucius lifetime BC 551–479.',
      event:
        'Recalled 仲尼 exemplar praising Tang/Wu campaigns in Chang Wei’s speech; lifetime interval is not asserted by this unit.',
    },
  },
  95: {
    sourceLabel: '魏武',
    after: {
      sourceDate: { text: '魏武' },
      unresolved: true,
      unresolvedReason:
        'Speech exemplar「魏武」on s0020; speech date is not Cao Cao’s lifetime — do not import off-chapter AD 184–220.',
      event:
        'Recalled 魏武 exemplar (raised among eunuchs, later success); lifetime interval is not asserted by this unit.',
    },
  },
  96: {
    sourceLabel: '高祖',
    after: {
      sourceDate: { text: '高祖' },
      unresolved: true,
      unresolvedReason:
        'Speech allusion「高祖」on s0021; do not import off-chapter Han Gaozu reign BC 206–195 as a chapter conversion.',
      event:
        'Recalled 高祖 merit comparison in Chang Wei’s speech; reign interval is not asserted by this unit.',
    },
  },
};

const CLAIM_670 = structuredClone(extraction.claims[669]);
const ENGLISH_BEFORE = extraction.translationRepairs.filter((row) => row[6] === 'applied').length;
const PEOPLE_BEFORE = structuredClone(extraction.people);
const HINT_SNAPSHOT = Object.fromEntries(
  ['p019', 'p020', 'p021'].map((pid) => {
    const person = extraction.people.find((p) => p[0] === pid);
    return [pid, structuredClone(person[4]?.a || [])];
  }),
);

const changes = [];
const beforeById = {};
const afterById = {};

for (const [idStr, spec] of Object.entries(TARGETS)) {
  const id = Number(idStr);
  const before = extraction.claims[id - 1];
  if (!before) throw new Error(`missing claim-${id}`);
  if (before[1] !== 'attestation') throw new Error(`claim-${id} not attestation`);
  const value = before[2] || {};
  if (!value.westernInterval) throw new Error(`claim-${id} missing westernInterval at tip`);
  if (!String(value.sourceDate?.text || '').includes(spec.sourceLabel)) {
    throw new Error(`claim-${id} sourceDate missing ${spec.sourceLabel}`);
  }
  const after = [before[0], before[1], structuredClone(spec.after), before[3], before[4]];
  changes.push({
    kind: 'replace',
    id: `claim-${id}`,
    before,
    after,
    reason: `Strip off-chapter westernInterval; keep source label「${spec.sourceLabel}」unresolved on cited unit only.`,
  });
  beforeById[`claim-${id}`] = {
    personId: before[0],
    value: structuredClone(before[2]),
    units: before[4],
  };
  afterById[`claim-${id}`] = {
    personId: after[0],
    value: structuredClone(after[2]),
    units: after[4],
    form: 'sourceDate-unresolved-preserving-recall-label',
    sourceLabel: spec.sourceLabel,
  };
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner claims 94/95/96 westernInterval strip',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const final = applyDateRepairProposal(extraction, proposal, packet);

if (JSON.stringify(final.claims[669]) !== JSON.stringify(CLAIM_670)) {
  throw new Error('claim-670 昇平四年 drifted');
}
if (JSON.stringify(final.people) !== JSON.stringify(PEOPLE_BEFORE)) {
  throw new Error('people/hints drifted — must not broaden to 181 hints');
}
for (const pid of Object.keys(HINT_SNAPSHOT)) {
  const person = final.people.find((p) => p[0] === pid);
  if (JSON.stringify(person[4]?.a || []) !== JSON.stringify(HINT_SNAPSHOT[pid])) {
    throw new Error(`hint drift on ${pid}`);
  }
}
const english = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (english !== ENGLISH_BEFORE || english !== 15) {
  throw new Error(`English drifted: ${english}`);
}
if (JSON.stringify(final.translationRepairs) !== JSON.stringify(extraction.translationRepairs)) {
  throw new Error('translationRepairs drifted');
}

for (let i = 0; i < extraction.claims.length; i += 1) {
  const id = i + 1;
  if (id === 94 || id === 95 || id === 96) continue;
  if (JSON.stringify(final.claims[i]) !== JSON.stringify(extraction.claims[i])) {
    throw new Error(`untouched claim-${id} changed`);
  }
}

for (const id of [94, 95, 96]) {
  const value = final.claims[id - 1][2] || {};
  if (value.westernInterval || value.westernYear || value.westernBounds) {
    throw new Error(`claim-${id} still has Western chronology`);
  }
  if (value.sourceDate?.text !== TARGETS[id].sourceLabel) {
    throw new Error(`claim-${id} lost source label`);
  }
  if (value.unresolved !== true) throw new Error(`claim-${id} not unresolved`);
}

const remainingWestern = [];
for (let i = 0; i < final.claims.length; i += 1) {
  const value = final.claims[i][2] || {};
  const dc = value.dateContext || {};
  if (value.westernYear || value.westernBounds || value.westernInterval
    || dc.westernYear || dc.westernBounds || dc.westernInterval) {
    remainingWestern.push(`claim-${i + 1}`);
  }
}
if (!remainingWestern.includes('claim-670') || remainingWestern.length !== 1) {
  throw new Error(`unexpected remaining Western set: ${remainingWestern.join(',')}`);
}

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));

const afterPacket = buildDateAuditPacket(book, chapter);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-claims-94-96-westerninterval-strip-receipt',
  book,
  chapter,
  pullRequest: 5462,
  baseOwnerCommit: '3f7eb2d43500de6548019363b68d05bd00045797',
  independentHeadReviewCommit: '3e2913c36c820a73db50550eaeedd0192099de54',
  independentHeadReview: 'research/people/jinshu110-independent-owner-head-review-3f7eb2d4-20261124.json',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  exactChangedIds: ['claim-94', 'claim-95', 'claim-96'],
  beforeById,
  afterById,
  preserved: {
    sourceLabels: ['仲尼', '魏武', '高祖'],
    claim670Shengping4ConversionHold: true,
    claim670Value: CLAIM_670[2],
    approvedEnglishApplied: english,
    peopleAndHintsUnchanged: true,
    hintRowsNotBroadened: 181,
    untouchedClaimCount: extraction.claims.length - 3,
  },
  remainingConcreteBlockers: {
    westernChronologyRows: remainingWestern,
    claim670ConversionHoldPendingNativeEvidence: true,
    noDateAuditFile: 'data/people/date-audits/jinshu/110.json not written',
  },
  notDone: [
    'no self-approval',
    'no merge',
    'no date-audits/jinshu/110.json',
    'no edits to 181 unreviewed hints',
    'no invent off-chapter Western for 仲尼/魏武/高祖',
  ],
};

writeJsonAtomic('research/people/jinshu110-owner-claims94-96-westerninterval-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  changed: ['claim-94', 'claim-95', 'claim-96'],
  remainingWestern,
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  english,
}, null, 2));
console.log('PASS');
