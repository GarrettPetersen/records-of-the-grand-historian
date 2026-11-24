#!/usr/bin/env node
/**
 * Jinshu 081: remove orphan extraction-local p397 (era-太興 English gloss only).
 *
 * Verified no jinshu:081:p397 dependents on origin/master or staging generated
 * catalogs; chapter-local relatedHints/inbound claims empty. Preserve p238/p355/
 * p358 repairs and authenticated 元帝 locals. No merge / prior-review edits /
 * invented Chinese person in the era label.
 */
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
const ex = readJson(extractionPath);
const beforePacket = buildDateAuditPacket(book, chapter, { extraction: ex });

function snap(pid) {
  const row = ex.people.find((r) => r[0] === pid);
  return {
    names: row[1],
    nameZh: row[5]?.[0]?.[0]?.zh || null,
    zhSurfaces: ex.surfaces
      .filter((s) => s[0] === pid && s[2] === 'zh')
      .map((s) => ({ exact: s[3], units: s[4].map((u) => u[0]) })),
  };
}

const preservedBefore = {
  p238: snap('p238'),
  p355: snap('p355'),
  p358: snap('p358'),
  yuanLocals: ['p038', 'p057', 'p092', 'p314'].map((pid) => {
    const row = ex.people.find((r) => r[0] === pid);
    return {
      localId: pid,
      names: row[1],
      nameZh: row[5][0][0].zh,
      evidence: row[5][0][2],
    };
  }),
  englishApplied: ex.translationRepairs.filter((r) => r[6] === 'applied').length,
  p358Death: structuredClone(ex.claims.find((c) => c[0] === 'p358' && c[1] === 'death')?.[2]),
};

const removedPerson = structuredClone(ex.people.find((p) => p[0] === 'p397'));
if (!removedPerson) throw new Error('p397 missing');
const removedClaimRows = [];
ex.claims.forEach((c, i) => {
  if (c[0] === 'p397') {
    removedClaimRows.push({
      claimId: `claim-${i + 1}`,
      personId: c[0],
      predicate: c[1],
      value: structuredClone(c[2]),
      certainty: c[3],
      evidence: structuredClone(c[4]),
    });
  }
});

const removedFromDisp = { bucket: null, entry: null };
for (const d of ex.candidateDispositions) {
  const idx = d[2].findIndex((e) => e[0] === 'cand_c3692d3c0a7a82dc');
  if (idx >= 0) {
    removedFromDisp.bucket = `${d[0]}:${d[1]}`;
    removedFromDisp.entry = d[2][idx];
    d[2].splice(idx, 1);
  }
}
ex.candidateDispositions = ex.candidateDispositions.filter((d) => d[2].length > 0);
let reign = ex.candidateDispositions.find((d) => d[0] === 'not-person' && d[1] === 'reign-period');
if (!reign) {
  reign = ['not-person', 'reign-period', []];
  ex.candidateDispositions.push(reign);
}
const newDispEntry = [
  'cand_c3692d3c0a7a82dc',
  'English “Emperor Yuan\'s Taixing” glosses Chinese era 太興 only; no primary person mention on s0601',
];
reign[2].push(newDispEntry);

ex.people = ex.people.filter((p) => p[0] !== 'p397');
ex.claims = ex.claims.filter((c) => c[0] !== 'p397');
ex.surfaces = ex.surfaces.filter((s) => s[0] !== 'p397');

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(ex, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(ex));

const afterPacket = buildDateAuditPacket(book, chapter);
const after = readJson(extractionPath);

function assertPreserved(pid, before) {
  const row = after.people.find((r) => r[0] === pid);
  if (!row) throw new Error(`lost ${pid}`);
  if (JSON.stringify(row[1]) !== JSON.stringify(before.names)) throw new Error(`${pid} names drifted`);
  if ((row[5]?.[0]?.[0]?.zh || null) !== before.nameZh) throw new Error(`${pid} name.zh drifted`);
  const zhSurf = after.surfaces
    .filter((s) => s[0] === pid && s[2] === 'zh')
    .map((s) => ({ exact: s[3], units: s[4].map((u) => u[0]) }));
  if (JSON.stringify(zhSurf) !== JSON.stringify(before.zhSurfaces)) {
    throw new Error(`${pid} zh surfaces drifted`);
  }
}
assertPreserved('p238', preservedBefore.p238);
assertPreserved('p355', preservedBefore.p355);
assertPreserved('p358', preservedBefore.p358);
if (after.people.some((p) => p[0] === 'p397')) throw new Error('p397 still present');
if (after.claims.some((c) => c[0] === 'p397')) throw new Error('p397 claims remain');
if (after.translationRepairs.filter((r) => r[6] === 'applied').length !== preservedBefore.englishApplied) {
  throw new Error('English drifted');
}
const death = after.claims.find((c) => c[0] === 'p358' && c[1] === 'death');
if (JSON.stringify(death[2]) !== JSON.stringify(preservedBefore.p358Death)) {
  throw new Error('p358 death drifted');
}
for (const y of preservedBefore.yuanLocals) {
  const row = after.people.find((r) => r[0] === y.localId);
  if (!row || row[5][0][0].zh !== '元帝') throw new Error(`Yuan local ${y.localId} damaged`);
}

const s0601zh = afterPacket.units.find((u) => u.id === 's0601')?.zh
  || '遜、豹、宣、胤服勤於太興之間，毛、鄧、劉、朱馳騖乎咸和之後。';

writeJsonAtomic('research/people/jinshu081-owner-p397-removal-receipt-20261124.json', {
  schemaVersion: 1,
  kind: 'owner-orphan-local-removal-receipt',
  book,
  chapter,
  pullRequest: 5478,
  baseOwnerCommit: '4c85e1d7b2c6d2af563411fba91ebe293f00bd5c',
  beforeExtractionHash: beforePacket.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  dependencySearch: {
    namespacedId: 'jinshu:081:p397',
    localChapterDependents: { relatedHints: [], inboundClaims: [], surfacesAtRemoval: 0 },
    originMaster: 'no jinshu:081:p397 hits outside this chapter extraction; other books/chapters’ local p397 IDs are unrelated',
    originStaging: 'no jinshu:081:p397 hits outside this chapter extraction',
    branchResearchOnly: [
      'research/people/checkpoints/jinshu081-native-identity-20261124/witness-author-gap-proposals.json',
      'research/people/checkpoints/jinshu081-native-identity-20261124/witness-assert-audit-readonly.json',
      'research/people/jinshu081-owner-witness-gap-receipt-20261124.json',
    ],
    dateAuditFile: null,
    holdBecauseAcceptedDependent: false,
  },
  rationale: {
    chineseOnS0601: s0601zh,
    finding: 'solely false English translator gloss of era 太興 as Emperor Yuan; zero zh surfaces; posthumous name claim cites s0601 without Chinese person token',
    productEligibility: 'would fail source-reference eligibility (cf. Jinshu 094 era-vs-person rule)',
  },
  exactRemoval: {
    personId: 'p397',
    personBefore: removedPerson,
    claimsRemoved: removedClaimRows,
    surfacesRemoved: [],
    candidateDisposition: {
      from: removedFromDisp,
      to: { bucket: 'not-person:reign-period', entry: newDispEntry },
    },
  },
  preserved: {
    p238: preservedBefore.p238,
    p355: preservedBefore.p355,
    p358: preservedBefore.p358,
    authenticatedYuanLocals: preservedBefore.yuanLocals,
    englishRepairsApplied: preservedBefore.englishApplied,
    p358DeathChronology: preservedBefore.p358Death,
  },
  identityDateImpact: {
    identity: 'removed orphan extraction-local only; no canonical write; Yuan membership remains p038/p057/p092/p314',
    date: 'removed unsupported era-gloss sex/attestation/status; no Western chronology changes to authenticated locals',
  },
  notDone: [
    'no merge',
    'no prior-review/certificate edits',
    'no invented Chinese person in 太興',
    'no canonical identity publication',
  ],
});

console.log(JSON.stringify({
  before: beforePacket.extractionHash,
  after: afterPacket.extractionHash,
  people: after.people.length,
  claims: after.claims.length,
  removedClaims: removedClaimRows.map((c) => c.claimId),
}, null, 2));
console.log('PASS');
