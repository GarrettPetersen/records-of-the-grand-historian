#!/usr/bin/env node
/**
 * Jinshu 047 owner: resolve identity witness hold for p109
 * (independent review 5ec9a048 at tip b19c24324f).
 *
 * s0257「駿既伏誅，裴楷息瓚，駿之婿也，為亂兵所害。」names Pei Zan as Yang Jun's
 * son-in-law; 「女」does not occur. Do not invent a zh daughter name or assert an
 * unproved daughter person. Rewire explicit 婿 to p108→p105; remove orphan p109
 * and false「女」witness claims. Leave date-audits/jinshu/047.json untouched.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '047';
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const raw = readFileSync(extractionPath, 'utf8');
const extraction = JSON.parse(raw);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const unit = (packet.units || []).find((u) => (u.id || u.unitId) === 's0257');
if (!unit || !/駿之婿也/.test(unit.zh || '')) {
  throw new Error('s0257 missing 駿之婿也');
}
if (/女/.test(unit.zh || '')) {
  throw new Error('s0257 unexpectedly contains 女');
}

const p109 = extraction.people.find((p) => p[0] === 'p109');
if (!p109) throw new Error('p109 missing');
const beforeSnapshot = {
  person: structuredClone(p109),
  claims: extraction.claims
    .map((c, i) => ({ claimId: `claim-${i + 1}`, row: structuredClone(c) }))
    .filter((x) => x.row[0] === 'p109' || JSON.stringify(x.row[2] || {}).includes('"p109"')),
  p105r: structuredClone(extraction.people.find((p) => p[0] === 'p105')[4].r),
  p108r: structuredClone(extraction.people.find((p) => p[0] === 'p108')[4].r),
  claim760: structuredClone(extraction.claims[759]),
  claim744: structuredClone(extraction.claims[743]),
};

const ENGLISH_BEFORE = extraction.translationRepairs.filter((r) => r[6] === 'applied').length;
const PEOPLE_COUNT_BEFORE = extraction.people.length;
const OTHER_PEOPLE = extraction.people.filter((p) => p[0] !== 'p109').map((p) => p[0]);

const final = structuredClone(extraction);

const p105 = final.people.find((p) => p[0] === 'p105');
const p108 = final.people.find((p) => p[0] === 'p108');
p105[4].r = p105[4].r.filter((id) => id !== 'p109');
p108[4].r = p108[4].r.filter((id) => id !== 'p109');
if (!p105[4].r.includes('p108')) p105[4].r.push('p108');
if (!p108[4].r.includes('p105')) p108[4].r.push('p105');

final.people = final.people.filter((p) => p[0] !== 'p109');
final.surfaces = (final.surfaces || []).filter((s) => s[0] !== 'p109');

const removedClaimIds = [];
const rewritten = [];

final.claims = final.claims.map((claim, index) => {
  const claimId = `claim-${index + 1}`;
  if (claim[0] === 'p109') {
    removedClaimIds.push(claimId);
    return null;
  }
  if (claimId === 'claim-744') {
    rewritten.push({
      claimId,
      action: 'remove-false-parent-of-daughter',
      before: structuredClone(claim),
    });
    removedClaimIds.push(claimId);
    return null;
  }
  if (claimId === 'claim-760') {
    const after = [
      'p108',
      'family-relationship',
      {
        relation: 'kin-of',
        personId: 'p105',
        kinshipTerm: { zh: '婿', en: 'son-in-law' },
        subjectRole: 'son-in-law',
        objectRole: 'father-in-law',
      },
      'explicit',
      ['s0257'],
    ];
    rewritten.push({
      claimId,
      action: 'rewire-explicit-son-in-law-to-yang-jun',
      before: structuredClone(claim),
      after: structuredClone(after),
    });
    return after;
  }
  if (JSON.stringify(claim[2] || {}).includes('"p109"')) {
    throw new Error(`${claimId} still references p109 after planned rewrites`);
  }
  return claim;
}).filter((c) => c !== null);

if (final.people.some((p) => p[0] === 'p109')) throw new Error('p109 still present');
if (JSON.stringify(final).includes('"p109"')) {
  throw new Error('residual p109 reference remains');
}
if (final.translationRepairs.filter((r) => r[6] === 'applied').length !== ENGLISH_BEFORE) {
  throw new Error('English drifted');
}
if (final.people.length !== PEOPLE_COUNT_BEFORE - 1) {
  throw new Error('unexpected people count');
}
for (const pid of OTHER_PEOPLE) {
  if (pid === 'p109') continue;
  if (!final.people.some((p) => p[0] === pid)) throw new Error(`lost person ${pid}`);
}

const claim760 = final.claims.find((c) => c[0] === 'p108' && c[1] === 'family-relationship'
  && c[2]?.kinshipTerm?.zh === '婿' && c[2]?.personId === 'p105');
if (!claim760 || claim760[3] !== 'explicit') {
  throw new Error('explicit 婿 kin-of edge missing');
}

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });

writeFileSync(extractionPath, `${JSON.stringify(final, null, 2)}\n`);

const afterPacket = buildDateAuditPacket(book, chapter);
const verify = readJson(extractionPath);
if (verify.people.some((p) => p[0] === 'p109')) throw new Error('write still has p109');
if (JSON.stringify(verify).includes('"p109"')) throw new Error('write residual p109');

const receipt = {
  schemaVersion: 1,
  kind: 'owner-identity-witness-hold-resolution',
  book,
  chapter,
  pullRequest: 5423,
  baseOwnerCommit: 'b19c24324f342737a5eaa948b51d32561e6c1a3d',
  independentReviewCommit: '5ec9a048dcd534f5260ac02f34a6644d23153ec8',
  independentHoldCaseId: 'sha256:2a42e97cf3de3563b58cb523e6ff4e77f626f1d39ee2c1d6760817473f16d5b1',
  independentHoldSummary:
    'jinshu:047:p109 — cited s0257 supports 駿之婿也 (Pei Zan), not a daughter name「女」.',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  sourceInspection: {
    unitId: 's0257',
    zh: unit.zh,
    en: unit.en,
    exactQuoteSupported: '駿之婿也',
    daughterToken女Present: false,
    inferredKinshipContract:
      'Extraction prompt entails anonymous intermediaries for some kinship paths, but identity witness requires an exact Chinese primary-name quote on the cited unit. s0257 supplies 婿 for Pei Zan only; inventing zh「女」/楊駿女 fails that contract.',
  },
  decision: {
    action: 'remove-unproved-daughter-and-rewire-explicit-son-in-law',
    rationale:
      'Exact source permits Pei Zan (p108) as Yang Jun’s (p105) son-in-law via 駿之婿也. It does not name or quote a daughter. Removing p109 stops the false「女」name-claim witness; replacing spouse-of-p109 with explicit kin-of p105 preserves the supported fact without inventing a zh name or asserting an unproved daughter.',
  },
  exactAffectedFields: {
    removedPersonId: 'p109',
    removedPersonBefore: beforeSnapshot.person,
    removedClaimIds,
    rewrittenClaims: rewritten,
    hintUpdates: {
      p105: { before: beforeSnapshot.p105r, after: verify.people.find((p) => p[0] === 'p105')[4].r },
      p108: { before: beforeSnapshot.p108r, after: verify.people.find((p) => p[0] === 'p108')[4].r },
    },
  },
  preserved: {
    otherLocalPeople: OTHER_PEOPLE.filter((id) => id !== 'p109'),
    otherLocalPeopleCount: OTHER_PEOPLE.filter((id) => id !== 'p109').length,
    acceptedIdentityCasesNotReopened: 147,
    dateAuditFileUntouched: 'data/people/date-audits/jinshu/047.json',
    approvedEnglishApplied: ENGLISH_BEFORE,
    peiZanP108SurfacesAndNames: {
      names: verify.people.find((p) => p[0] === 'p108')[1],
      nameClaims: verify.people.find((p) => p[0] === 'p108')[5],
    },
    yangJunP105Names: verify.people.find((p) => p[0] === 'p105')[1],
  },
  notDone: [
    'no invented zh daughter name',
    'no unproved daughter person retained',
    'no validator edits',
    'no date-audits/jinshu/047.json edits',
    'no reopen of 147 approved identity cases',
    'no self-approval',
    'no merge',
  ],
};

writeJsonAtomic('research/people/jinshu047-owner-p109-identity-witness-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  removedPerson: 'p109',
  removedClaimIds,
  rewritten: rewritten.map((r) => ({ claimId: r.claimId, action: r.action })),
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  people: verify.people.length,
  claims: verify.claims.length,
}, null, 2));
console.log('PASS');
