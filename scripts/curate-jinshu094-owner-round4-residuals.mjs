#!/usr/bin/env node
/**
 * Jinshu 094 owner round-4: only the three #5460 grouped residuals.
 *
 * 1) 永康初: claim-133/134 + hints-p103/p104 — keep early-era label; no 元年 / AD 300.
 * 2) Fan Can (p041): attach s0148 太康六年卒 death ownership (+ 父 mention on s0147).
 * 3) Ren Xu (p100): attach s0318 咸和二年卒 death; leave Feng Huai claim-143 memorial dating.
 *
 * Preserves 49 editorial decisions and all other accepted chronology.
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import {
  buildDateAuditPacket,
  dateAuditDiagnostics,
  dateAuditItems,
} from './lib/people-date-audit.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { editorialReviews } from './lib/people-editorial-decisions.mjs';

const book = 'jinshu';
const chapter = '094';
const outDir = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu094-owner-round4-20261123',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);

const YEAR = (y) => ({ era: 'AD', year: y, precision: 'year' });
const INTERVAL = (y) => ({ start: YEAR(y), end: YEAR(y) });

const compact = readJson(extractionPath);
const priorHash = sha256(JSON.stringify(compact));
const priorClaimCount = compact.claims.length;
const priorSurfaceCount = compact.surfaces.length;

const ed = readJson(path.join(PEOPLE_DIR, 'editorial-decisions', book, `${chapter}.json`));
const reviews = editorialReviews(ed);
const decisionCount = reviews.reduce((n, review) => n + review.decisions.length, 0);
if (decisionCount !== 49) {
  throw new Error(`Expected 49 editorial decisions, found ${decisionCount}`);
}

const claim = (id) => {
  const index = Number(id.slice(6)) - 1;
  const row = compact.claims[index];
  if (!row) throw new Error(`Missing ${id}`);
  return { index, row };
};

const person = (id) => {
  const row = compact.people.find((entry) => entry[0] === id);
  if (!row) throw new Error(`Missing person ${id}`);
  return row;
};

const ops = {
  yongkangEarlyEra: [],
  fanCanDeath: null,
  renXuDeath: null,
  preservedWestern: [],
  preservedFengHuaiMemorial: null,
};

// --- Residual 1: 永康初 (not 元年 / not AD 300) ---
for (const [id, event] of [
  ['claim-133', 'Emperor Hui sought recluses in early Yongkang'],
  ['claim-134', 'Qiu Fu recommended Ren Xu in early Yongkang'],
]) {
  const { row } = claim(id);
  if (row[1] !== 'attestation') throw new Error(`${id} expected attestation`);
  const before = structuredClone(row[2]);
  row[2] = {
    sourceDate: { text: '永康初' },
    unresolved: true,
    unresolvedReason:
      's0306 reads 永康初 (early Yongkang), not 永康元年; a forced year-1 / AD 300 conversion is not source-supported.',
    event,
  };
  row[3] = 'explicit-event-contextual-date';
  ops.yongkangEarlyEra.push({ id, person: row[0], before, after: structuredClone(row[2]) });
}

for (const id of ['p103', 'p104']) {
  const row = person(id);
  const hints = row[4] && typeof row[4] === 'object' ? row[4] : { a: [] };
  hints.a = [];
  row[4] = hints;
}

// --- Residual 2: Fan Can death at s0148 太康六年卒 ---
const fanCanDeath = [
  'p041',
  'death',
  {
    age: 84,
    place: { en: 'the cart that was his bed', zh: '所寢之車' },
    dateContext: {
      sourceDate: { text: '太康六年' },
      westernInterval: INTERVAL(285),
      event: 'Died in Taikang 6 at age eighty-four after thirty-six years of silence',
    },
  },
  'explicit',
  ['s0148'],
];
compact.claims.push(fanCanDeath);
ops.fanCanDeath = {
  claimId: `claim-${compact.claims.length}`,
  person: 'p041',
  sourceDate: '太康六年',
  westernYear: 285,
  evidence: ['s0148'],
  chinese: '乙太康六年卒，時年八十四，不言三十六載，終於所寢之車。',
};

// Biography-linked mention: 父 on s0147 (Fan Qiao declining for his father's illness).
const hasFatherMention = compact.surfaces.some(
  (surface) =>
    surface[0] === 'p041' &&
    surface[1] === 'kinship-reference' &&
    surface[3] === '父' &&
    (surface[4] || []).some((occ) => occ[0] === 's0147'),
);
if (!hasFatherMention) {
  compact.surfaces.push(['p041', 'kinship-reference', 'zh', '父', [['s0147', [0]]]]);
}

const fanHints = person('p041')[4] && typeof person('p041')[4] === 'object' ? person('p041')[4] : { a: [] };
fanHints.a = ['AD 285 (太康六年)'];
person('p041')[4] = fanHints;

// Leave claim-42 undated silence untouched (explicitly not the death year).

// --- Residual 3: Ren Xu death at s0318 咸和二年卒; keep Feng Huai memorial ---
const { row: claim130 } = claim('claim-130');
if (claim130[0] !== 'p100') throw new Error('claim-130 person drift');
const before130Evidence = [...claim130[4]];
claim130[4] = claim130[4].filter((unit) => unit !== 's0318');
if (claim130[4].length === before130Evidence.length) {
  throw new Error('Expected claim-130 to previously list s0318');
}

const { row: claim143 } = claim('claim-143');
if (claim143[0] !== 'p113') throw new Error('claim-143 must remain Feng Huai');
const fengBefore = structuredClone(claim143[2]);
if (fengBefore?.sourceDate?.text !== '咸和二年' || fengBefore?.westernInterval?.start?.year !== 327) {
  throw new Error('Feng Huai memorial dating drifted before repair');
}
ops.preservedFengHuaiMemorial = {
  id: 'claim-143',
  person: 'p113',
  sourceDate: '咸和二年',
  westernYear: 327,
  event: fengBefore.event,
  evidence: [...claim143[4]],
};

const renXuDeath = [
  'p100',
  'death',
  {
    dateContext: {
      sourceDate: { text: '咸和二年' },
      westernInterval: INTERVAL(327),
      event: 'Died in Xianhe 2',
    },
  },
  'explicit',
  ['s0318'],
];
compact.claims.push(renXuDeath);
ops.renXuDeath = {
  claimId: `claim-${compact.claims.length}`,
  person: 'p100',
  sourceDate: '咸和二年',
  westernYear: 327,
  evidence: ['s0318'],
  chinese: '咸和二年卒，太守馮懷上疏謂宜贈九列值蘇峻作亂，事竟不行。',
  claim130EvidenceRemoved: ['s0318'],
  claim130EvidenceRemaining: [...claim130[4]],
};

const renHints = person('p100')[4] && typeof person('p100')[4] === 'object' ? person('p100')[4] : { a: [] };
renHints.a = ['AD 327 (咸和二年)'];
person('p100')[4] = renHints;

// Preserve other accepted Western chronology (claim-41/60/143/320/328).
for (const id of ['claim-41', 'claim-60', 'claim-143', 'claim-320', 'claim-328']) {
  const { row } = claim(id);
  ops.preservedWestern.push({
    id,
    person: row[0],
    sourceDate: row[2]?.sourceDate?.text,
    year: row[2]?.westernInterval?.start?.year,
  });
}

if (compact.people.length !== 250) {
  throw new Error(`People count changed: ${compact.people.length}`);
}
if (compact.claims.length !== priorClaimCount + 2) {
  throw new Error(`Expected exactly two added claims, got ${compact.claims.length - priorClaimCount}`);
}

const packet = buildPeopleExtractionPacket(book, chapter);
let validation;
try {
  validation = validateCompactPeopleExtraction(compact, packet, {
    strictAliasDispositions: true,
  });
} catch (error) {
  fs.mkdirSync(outDir, { recursive: true });
  writeJsonAtomic(path.join(outDir, 'validation-errors.json'), {
    message: error.message,
    errors: error.errors ?? null,
  });
  throw error;
}

const geometry = dateAuditDiagnostics(dateAuditItems(compact));
if (geometry.length) {
  throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
}

const serialized = serializeCompactPeopleExtraction(compact);
const nextHash = sha256(JSON.stringify(JSON.parse(serialized)));
if (nextHash === priorHash) throw new Error('No extraction change');

// Post-conditions on the serialized form.
const verify = JSON.parse(serialized);
const v133 = verify.claims[132][2];
const v134 = verify.claims[133][2];
if (v133.sourceDate?.text !== '永康初' || v133.westernInterval || v133.westernYear || !v133.unresolved) {
  throw new Error('claim-133 must be native 永康初 unresolved without Western year');
}
if (v134.sourceDate?.text !== '永康初' || v134.westernInterval || v134.westernYear || !v134.unresolved) {
  throw new Error('claim-134 must be native 永康初 unresolved without Western year');
}
if (v133.sourceDate?.text !== '永康初' || v134.sourceDate?.text !== '永康初') {
  throw new Error('Yongkang sourceDate must remain exactly 永康初');
}
if (/元年/.test(v133.sourceDate.text) || /元年/.test(v134.sourceDate.text)) {
  throw new Error('永康元年 must not be used as sourceDate');
}
const feng = verify.claims[142][2];
if (feng.sourceDate?.text !== '咸和二年' || feng.westernInterval?.start?.year !== 327) {
  throw new Error('Feng Huai memorial dating must remain 咸和二年 / AD 327');
}
const deaths = verify.claims.filter((row) => row[1] === 'death' && (row[0] === 'p041' || row[0] === 'p100'));
if (deaths.length < 2) throw new Error('Missing Fan Can / Ren Xu death rows');

fs.mkdirSync(outDir, { recursive: true });
writeTextAtomic(extractionPath, serialized);

const datePacket = buildDateAuditPacket(book, chapter);
writeJsonAtomic(path.join(outDir, 'date-packet.json'), datePacket);

const receipt = {
  schemaVersion: 1,
  kind: 'jinshu094-owner-round4-three-residuals',
  book,
  chapter,
  basedOnReview: {
    pr: 5460,
    reviewCommit: 'c03ffe96a1f94cb3de08c9b60b8a937b18e4ef6e',
    stagingPinReviewed: '050a320209768c02a3a60ecc8ba8aef1ac96ffb2',
    reviewerAgentId: 'bc-aa913dc1-24e5-4aaf-9dd8-6d1b0651a008',
  },
  preserved: {
    editorialDecisions: decisionCount,
    people: verify.people.length,
    otherAcceptedWestern: ops.preservedWestern,
    fengHuaiMemorial: ops.preservedFengHuaiMemorial,
  },
  residuals: {
    yongkangEarlyEra: ops.yongkangEarlyEra,
    fanCanDeath: ops.fanCanDeath,
    renXuDeath: ops.renXuDeath,
    fatherMentionAddedOnS0147: !hasFatherMention,
  },
  priorExtractionHash: `sha256:${priorHash}`,
  curatedExtractionHash: datePacket.extractionHash,
  curatedAt: new Date().toISOString(),
  validation: {
    compactValidation: `PASS: ${validation.stats.claims} claims / ${validation.stats.mentions} mentions`,
    chronologyGeometry: geometry.length ? geometry : 'PASS',
    surfacesDelta: verify.surfaces.length - priorSurfaceCount,
    claimsDelta: verify.claims.length - priorClaimCount,
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  dateApproval: 'NONE — return to same independent reviewer',
};

writeJsonAtomic(path.join(outDir, 'curation-receipt.json'), receipt);

const residual = {
  schemaVersion: 1,
  kind: 'jinshu094-owner-round4-handoff-for-same-reviewer',
  book,
  chapter,
  stagingBranch: 'codex/cursor-glossary-nov24-2026-jinshu094',
  continuesReviewer: 'bc-aa913dc1-24e5-4aaf-9dd8-6d1b0651a008',
  addressedFindingsFrom5460: [
    '永康初 retained as early-era sourceDate; AD 300 / 永康元年 removed from claim-133/134 and hints-p103/p104',
    'p041 death claim on s0148 太康六年卒 (AD 285) with 父 mention on s0147; claim-42 silence left undated',
    'p100 death claim on s0318 咸和二年卒 (AD 327); claim-143 Feng Huai memorial dating unchanged',
  ],
  datePacket: {
    path: `${outDir}/date-packet.json`,
    sourceHash: datePacket.sourceHash,
    extractionHash: datePacket.extractionHash,
  },
  remainingForSameReviewer: [
    {
      id: 'R1',
      lane: 'chronology-re-audit',
      summary: 'Fresh independent native date audit on the rebuilt packet after the three residual repairs; no owner approval recorded.',
    },
    {
      id: 'R2',
      lane: 'identity',
      summary: 'Membership seals still withheld until chronology clears.',
    },
    {
      id: 'R3',
      lane: 'publication',
      summary: 'Staging-only; not publication-ready.',
    },
  ],
};
writeJsonAtomic(path.join(outDir, 'residual-for-same-reviewer.json'), residual);

fs.writeFileSync(
  path.join(outDir, 'README.md'),
  `# Jinshu 094 owner round 4 (three #5460 residuals)

Reviewed extraction pin: \`050a320209768c02a3a60ecc8ba8aef1ac96ffb2\` (#5460 @ \`c03ffe96\`).

## Fixes
1. **永康初** on claim-133/134 — native early-era \`sourceDate\`, unresolved; no \`永康元年\` / AD 300.
2. **Fan Can** — death claim evidencing s0148 \`太康六年\` → AD 285; kinship mention \`父\` on s0147.
3. **Ren Xu** — death claim evidencing s0318 \`咸和二年\` → AD 327; Feng Huai claim-143 memorial dating preserved.

## Preserved
- 49 editorial decisions / 49 applied repairs
- Other accepted Western rows (咸寧四年, 元康八年, 咸和二年 memorial, 太元二十年, 義熙二年)
- 250 people; claim-42 undated silence

## Packet
\`${datePacket.extractionHash}\`

## No date/self-approval
`,
);

console.log(
  JSON.stringify(
    {
      curatedExtractionHash: datePacket.extractionHash,
      sourceHash: datePacket.sourceHash,
      validation: receipt.validation,
      residuals: {
        yongkang: ops.yongkangEarlyEra.map((row) => row.id),
        fanCanDeath: ops.fanCanDeath.claimId,
        renXuDeath: ops.renXuDeath.claimId,
        fengHuaiPreserved: 'claim-143',
      },
      outDir,
    },
    null,
    2,
  ),
);
