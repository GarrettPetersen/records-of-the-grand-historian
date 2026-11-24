#!/usr/bin/env node
/**
 * Jinshu 123 owner round-4 chronology curation after #5463 needs-revision.
 *
 * Repairs ONLY the exact incorrect IDs from the independent consolidation:
 *   - 4 inherited point years (claim-400, 565, 566, 567)
 *   - 18 inherited westernBounds without 太元 in cited evidence
 *   - 18 AD hints without a direct era-witnessed claim
 *
 * Preserves:
 *   - 32 direct Taiyuan mappings with local era evidence
 *   - Chinese source era text on those supported rows
 *   - 99 verified undated attestations
 *   - 47 editorial repairs + 4 claim revisions (untouched)
 *   - 24 continuity merges including p120 太原王 unresolved
 *
 * Does NOT record date approval.
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import {
  dateAuditDiagnostics,
  dateAuditItems,
  buildDateAuditPacket,
} from './lib/people-date-audit.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  contentUnits,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';

const book = 'jinshu';
const chapter = '123';
const stagingPinBefore = 'c7696e3be9e79839e70bfd643a4205a008d3e07e';
const reviewPr = 5463;
const reviewCommit = '62422083a5253729237aa648dcff06611368097f';
const continuesReviewer = 'bc-985e5c79-a8bc-4040-8f8d-4f1fba0f38b2';

const outDir = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu123-owner-round4-20261123',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const consolidationPath = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu123-independent-review-r3-20261123/consolidation.json',
);

const WESTERN_KEYS = ['westernYear', 'westernInterval', 'westernBounds'];

const POINT_YEAR_IDS = ['claim-400', 'claim-565', 'claim-566', 'claim-567'];
const BOUND_IDS = [
  'claim-245',
  'claim-288',
  'claim-363',
  'claim-367',
  'claim-370',
  'claim-375',
  'claim-376',
  'claim-379',
  'claim-382',
  'claim-385',
  'claim-477',
  'claim-480',
  'claim-483',
  'claim-491',
  'claim-494',
  'claim-498',
  'claim-505',
  'claim-506',
];
const HINT_IDS = [
  'hints-p039',
  'hints-p076',
  'hints-p083',
  'hints-p084',
  'hints-p085',
  'hints-p086',
  'hints-p087',
  'hints-p088',
  'hints-p089',
  'hints-p090',
  'hints-p121',
  'hints-p124',
  'hints-p125',
  'hints-p126',
  'hints-p127',
  'hints-p128',
  'hints-p147',
  'hints-p148',
];

const POINT_EVENTS = {
  'claim-400':
    'Bao named crown prince when the Jianxing bureaucracy and ancestral temples were established (chapter witness without convertible Western year)',
  'claim-565':
    'Murong Long crossed Qing Mountain with Sheng against Tuoba Ni at Pingcheng (chapter campaign witness; not Chui death)',
  'claim-566':
    'Murong Sheng crossed Qing Mountain with Long against Tuoba Ni at Pingcheng (chapter campaign witness; not Chui death)',
  'claim-567':
    'Tuoba Ni, Duke of Chenliu, attacked at Pingcheng by Long and Sheng (chapter campaign witness; not Chui death)',
};

function cleanEvent(event, fallback) {
  const raw = typeof event === 'string' ? event : '';
  const stripped = raw
    .replace(/\s*\[External dating[^\]]*\]\.?\s*/g, '')
    .replace(/\bAD\s+\d{1,4}(?:\s*[–-]\s*\d{1,4})?\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  let base = stripped || fallback;
  if (base.length < 20) {
    base = `${base} (chapter witness without convertible Western year)`.trim();
  }
  return base.slice(0, 240);
}

function toUndatedAttestation(value, fallbackEvent) {
  return {
    undatedSourceAttestation: true,
    event: cleanEvent(value?.event, fallbackEvent),
  };
}

function evidenceIds(claim) {
  const last = claim[claim.length - 1];
  return Array.isArray(last) ? last : [];
}

function setEvidence(claim, ids) {
  claim[claim.length - 1] = [...ids];
}

function countTaiyuanLocal(compact, unitMap) {
  const { items } = dateAuditItems(compact);
  let local = 0;
  let undated = 0;
  for (const item of items) {
    if (!item.id.startsWith('claim-')) continue;
    const claim = compact.claims[item.claimIndex];
    const dated =
      claim[1] === 'attestation' ? claim[2] : claim[2]?.dateContext || null;
    if (!dated) continue;
    if (dated.undatedSourceAttestation === true) {
      undated += 1;
      continue;
    }
    const hasW = WESTERN_KEYS.some((key) => dated[key] !== undefined);
    if (!hasW) continue;
    const ids = evidenceIds(claim);
    if (ids.some((id) => /太元/.test(unitMap.get(id)?.zh || ''))) local += 1;
  }
  return { local, undated };
}

const compact = readJson(extractionPath);
const consolidation = readJson(consolidationPath);
const sourceChapter = readJson(path.join(REPO_ROOT, 'data', book, `${chapter}.json`));
const unitMap = new Map(contentUnits(sourceChapter).map((u) => [u.id, u]));
const priorHash = sha256(JSON.stringify(compact));
const { items } = dateAuditItems(compact);
const byId = new Map(items.map((item) => [item.id, item]));

const baseline = countTaiyuanLocal(compact, unitMap);
if (baseline.undated !== 99) {
  throw new Error(`Expected 99 undated attestations before repair, found ${baseline.undated}`);
}
if (baseline.local !== 32) {
  throw new Error(`Expected 32 local Taiyuan Western rows before repair, found ${baseline.local}`);
}
if (compact.people.length !== 103) {
  throw new Error(`Expected 103 people before repair, found ${compact.people.length}`);
}

const expectedIncorrect = consolidation.chronology?.incorrectExact;
if (!expectedIncorrect) throw new Error('consolidation.chronology.incorrectExact missing');
const expectedPoints = expectedIncorrect.inheritedPointYears || [];
const expectedBounds = expectedIncorrect.inheritedWesternBoundsWithoutEraInEvidence || [];
const expectedHints = expectedIncorrect.adHintsWithoutDirectEraWitness || [];
if (JSON.stringify(expectedPoints) !== JSON.stringify(POINT_YEAR_IDS)) {
  throw new Error('Point-year ID list drifted from consolidation');
}
if (JSON.stringify(expectedBounds) !== JSON.stringify(BOUND_IDS)) {
  throw new Error('Bound ID list drifted from consolidation');
}
if (JSON.stringify(expectedHints) !== JSON.stringify(HINT_IDS)) {
  throw new Error('Hint ID list drifted from consolidation');
}

const ops = {
  pointYearsRepaired: [],
  boundsAttachedEra: [],
  boundsToUndated: [],
  boundsDateContextStripped: [],
  hintsCleared: [],
  preservedLocalTaiyuanBefore: baseline.local,
  preservedUndatedBefore: baseline.undated,
};

for (const id of POINT_YEAR_IDS) {
  const item = byId.get(id);
  if (!item) throw new Error(`Missing ${id}`);
  const claim = compact.claims[item.claimIndex];
  if (claim[1] !== 'attestation') throw new Error(`${id} expected attestation`);
  const before = structuredClone(claim[2]);
  const fallback = POINT_EVENTS[id];
  claim[2] = toUndatedAttestation(before, fallback);
  // Force the corrected event text (death mislabels / wrong throne ownership).
  claim[2].event = fallback;
  ops.pointYearsRepaired.push({
    id,
    person: claim[0],
    priorSourceDate: before?.sourceDate?.text ?? null,
    priorWesternYear: before?.westernYear?.year ?? null,
    priorEvent: before?.event ?? null,
    afterEvent: claim[2].event,
    evidence: evidenceIds(claim),
    form: 'undatedSourceAttestation',
    unresolvedNote:
      'Cited evidence units lack a local 太元 graph; inherited Western point year removed. Chinese era packaging was not locally witnessed on these units.',
  });
}

for (const id of BOUND_IDS) {
  const item = byId.get(id);
  if (!item) throw new Error(`Missing ${id}`);
  const claim = compact.claims[item.claimIndex];

  if (id === 'claim-245') {
    // Preferred path: attach the adjacent era-bearing primary witness (s0118),
    // matching the already-supported p040 attestation claim-247 pattern.
    if (claim[1] !== 'noble-title' || !claim[2]?.dateContext) {
      throw new Error('claim-245 expected noble-title dateContext');
    }
    const before = structuredClone(claim[2].dateContext);
    const ids = evidenceIds(claim);
    if (!ids.includes('s0119')) throw new Error('claim-245 expected s0119 evidence');
    if (!ids.includes('s0118')) {
      setEvidence(claim, ['s0118', ...ids]);
    }
    claim[2] = {
      ...claim[2],
      dateContext: {
        sourceDate: before.sourceDate,
        westernBounds: before.westernBounds,
        event: 'Taiyuan 8: Zhai Bin enfeoffed Prince of Henan after Chui’s Xingyang proclamation',
      },
    };
    ops.boundsAttachedEra.push({
      id,
      person: claim[0],
      predicate: claim[1],
      priorSourceDate: before.sourceDate?.text ?? null,
      priorWesternBounds: before.westernBounds ?? null,
      evidenceAfter: evidenceIds(claim),
      form: 'attach-era-unit-s0118-retain-westernBounds',
    });
    continue;
  }

  if (claim[1] !== 'attestation') {
    throw new Error(`${id} expected attestation bound row`);
  }
  const before = structuredClone(claim[2]);
  const fallback = before?.sourceDate?.text
    ? `Chapter attestation previously packaged under ${before.sourceDate.text} without a local era witness in cited units`
    : 'Chapter attestation without convertible Western year';
  // Do not keep "inherited date context: Taiyuan…" event wording — that packaging was the defect.
  claim[2] = {
    undatedSourceAttestation: true,
    event: fallback,
  };
  ops.boundsToUndated.push({
    id,
    person: claim[0],
    priorSourceDate: before?.sourceDate?.text ?? null,
    priorWesternBounds: before?.westernBounds ?? null,
    priorEvent: before?.event ?? null,
    afterEvent: claim[2].event,
    evidence: evidenceIds(claim),
    form: 'undatedSourceAttestation',
    unresolvedNote:
      'Inherited 乙太元… westernBounds lacked 太元 in cited evidence units; Western bound and fake local era sourceDate removed rather than inventing an era link.',
  });
}

for (const hintId of HINT_IDS) {
  const personId = hintId.replace(/^hints-/, '');
  const person = compact.people.find((row) => row[0] === personId);
  if (!person) throw new Error(`Missing person ${personId}`);
  const hintsObj = person[4] && typeof person[4] === 'object' ? person[4] : { a: [] };
  const before = [...(hintsObj.a || [])];
  hintsObj.a = [];
  person[4] = hintsObj;
  ops.hintsCleared.push({ id: hintId, person: personId, before, after: [] });
}

// Safety invariants.
const p120 = compact.people.find((person) => person[0] === 'p120');
if (!p120) throw new Error('p120 missing after curation');
if (p120[1]?.[0] !== 'Prince of Taiyuan' || p120[1]?.[1] !== '太原王') {
  throw new Error(`p120 preferred name changed unexpectedly: ${JSON.stringify(p120[1])}`);
}
const p120Attestation = compact.claims.find(
  (claim) => claim[0] === 'p120' && claim[1] === 'attestation' && claim[2]?.sourceDate?.text === '太原王',
);
if (!p120Attestation?.[2]?.unresolved) {
  throw new Error('p120 太原王 attestation must remain unresolved');
}
if (compact.people.length !== 103) {
  throw new Error(`Expected 103 people after preserving continuity merges, found ${compact.people.length}`);
}

const afterCounts = countTaiyuanLocal(compact, unitMap);
// claim-245 gains local era evidence → 33 local Taiyuan Western rows.
if (afterCounts.local !== 33) {
  throw new Error(`Expected 33 local Taiyuan Western rows after attaching s0118 to claim-245, found ${afterCounts.local}`);
}
// 99 prior undated + 4 point years + 17 bound attestations = 120 undated.
if (afterCounts.undated !== 120) {
  throw new Error(`Expected 120 undated attestations after repair, found ${afterCounts.undated}`);
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
if (nextHash === priorHash) throw new Error('Curation produced no extraction change');

fs.mkdirSync(outDir, { recursive: true });
writeTextAtomic(extractionPath, serialized);

const datePacket = buildDateAuditPacket(book, chapter);
writeJsonAtomic(path.join(outDir, 'date-packet.json'), datePacket);

const receipt = {
  schemaVersion: 1,
  kind: 'jinshu123-owner-round4-date-curation',
  book,
  chapter,
  basedOnReview: {
    stagingPr: 5439,
    stagingPinBefore,
    reviewPr,
    reviewCommit,
    continuesReviewer,
    consolidation: 'research/people/checkpoints/jinshu123-independent-review-r3-20261123/consolidation.json',
    reportExtractionHash: consolidation.chronology?.packetExtractionHash,
  },
  continuityPreserved: {
    peopleCount: compact.people.length,
    mergeGroups: 24,
    p120PreferredName: { en: 'Prince of Taiyuan', zh: '太原王' },
    p120AttestationUnresolved: true,
    editorialRepairsUntouched: 47,
    claimRevisionsUntouched: 4,
  },
  priorExtractionHash: `sha256:${priorHash}`,
  curatedExtractionHash: datePacket.extractionHash,
  curatedSourceHash: datePacket.sourceHash,
  curatedAt: new Date().toISOString(),
  baseline: {
    undatedSourceAttestation: baseline.undated,
    directTaiyuanWithLocalEraEvidence: baseline.local,
  },
  after: {
    undatedSourceAttestation: afterCounts.undated,
    directTaiyuanWithLocalEraEvidence: afterCounts.local,
    note: 'claim-245 gained local era evidence via s0118; 4+17 inherited rows became undated.',
  },
  repaired: {
    pointYears: ops.pointYearsRepaired.map((row) => row.id),
    boundsAttachedEra: ops.boundsAttachedEra.map((row) => row.id),
    boundsToUndated: ops.boundsToUndated.map((row) => row.id),
    hintsCleared: ops.hintsCleared.map((row) => row.id),
  },
  validation: {
    compactValidation: `PASS: ${validation.stats.claims} claims`,
    chronologyGeometry: geometry.length ? geometry : 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  dateApproval: 'NONE — return to same independent reviewer with rebuilt packet',
};

writeJsonAtomic(path.join(outDir, 'date-curation-receipt.json'), receipt);
writeJsonAtomic(path.join(outDir, 'grouped-corrections.json'), {
  pointYearsRepaired: ops.pointYearsRepaired,
  boundsAttachedEra: ops.boundsAttachedEra,
  boundsToUndated: ops.boundsToUndated,
  hintsCleared: ops.hintsCleared,
});

writeJsonAtomic(path.join(outDir, 'residual-for-same-reviewer.json'), {
  schemaVersion: 1,
  kind: 'jinshu123-owner-round4-residual-for-same-reviewer',
  book,
  chapter,
  stagingBranch: 'codex/cursor-glossary-nov24-2026-jinshu123',
  basedOn: {
    stagingPinBefore,
    stagingPr: 5439,
    reviewPr,
    reviewCommit,
    continuesReviewer,
  },
  chronologyRepairs: {
    inheritedPointYearsToUndated: POINT_YEAR_IDS,
    inheritedBoundsAttachedEra: ['claim-245'],
    inheritedBoundsToUndated: BOUND_IDS.filter((id) => id !== 'claim-245'),
    hintsCleared: HINT_IDS,
  },
  preserved: {
    directTaiyuanWithLocalEraEvidenceBefore: 32,
    directTaiyuanWithLocalEraEvidenceAfter: afterCounts.local,
    undatedBefore: 99,
    undatedAfter: afterCounts.undated,
    editorialRepairs: 47,
    continuityMergeGroups: 24,
    p120TaiyuanWangUnresolved: true,
  },
  genuineUnresolvedDocumented: [
    {
      ids: POINT_YEAR_IDS,
      reason:
        'Cited evidence lacked a local 太元 graph; Western point years removed. claim-565/566/567 were also mislabeled as Chui death on s0280 campaign text and are now undated campaign attestations.',
    },
    {
      ids: BOUND_IDS.filter((id) => id !== 'claim-245'),
      reason:
        'Inherited 乙太元… westernBounds without 太元 in cited evidence; converted to undatedSourceAttestation without inventing an era link.',
    },
    {
      ids: ['claim-245'],
      reason:
        'Repaired by attaching primary era witness s0118 (same Xingyang proclamation sequence as supported claim-247) and retaining Taiyuan 8 / AD 383 onOrAfter bounds.',
    },
  ],
  nextOwnerAsk:
    'Please re-run independent date audit on the rebuilt native packet only; do not treat this owner note as approval.',
  dateApproval: 'NONE',
});

writeTextAtomic(
  path.join(outDir, 'README.md'),
  `# Jinshu 123 owner round 4 (post #5463)

Pinned staging #5439 @ \`${stagingPinBefore}\` with independent review #5463 @ \`${reviewCommit}\`.

## Chronology only
- Removed 4 unsupported Western point years (\`claim-400\`, \`565\`, \`566\`, \`567\`); fixed s0280 death mislabels → undated campaign/crown-prince attestations.
- Attached era unit \`s0118\` to \`claim-245\` (retain Taiyuan 8 bounds).
- Converted 17 inherited westernBounds attestations → \`undatedSourceAttestation\` (no fake local era sourceDate).
- Cleared 18 AD hints lacking a direct era-witnessed claim.

## Preserved
- Prior 32 local Taiyuan Western mappings (now 33 after claim-245 repair).
- 99 prior undated attestations (now 120 after conversions).
- 47 editorial repairs / 4 claim revisions untouched.
- 24 continuity merges; p120 \`太原王\` unresolved.

## Not publication-approved
Same reviewer: \`${continuesReviewer}\`. Native packet: \`date-packet.json\`.
`,
);

// Copy script into checkpoint for provenance.
fs.mkdirSync(path.join(outDir, 'scripts'), { recursive: true });
fs.copyFileSync(
  path.join(REPO_ROOT, 'scripts/curate-jinshu123-owner-round4-dates.mjs'),
  path.join(outDir, 'scripts/curate-jinshu123-owner-round4-dates.mjs'),
);

console.log(
  JSON.stringify(
    {
      curatedExtractionHash: datePacket.extractionHash,
      sourceHash: datePacket.sourceHash,
      repaired: receipt.repaired,
      baseline: receipt.baseline,
      after: receipt.after,
      validation: receipt.validation,
      people: compact.people.length,
      outDir,
    },
    null,
    2,
  ),
);
