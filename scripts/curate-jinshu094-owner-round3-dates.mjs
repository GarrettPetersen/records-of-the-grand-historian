#!/usr/bin/env node
/**
 * Jinshu 094 owner round-3 chronology curation after #5450 needs-revision.
 *
 * Groups (from native date-report.needs-revision.json + current Chinese):
 *   A. Retain/refine Western where the chapter Chinese supplies a convertible
 *      reign-year (or 初) witness on the claim's evidence.
 *   B. Convert invented era/dynasty Western intervals to undatedSourceAttestation.
 *   C. Convert research-blocked unresolved placeholders (legendary eras,
 *      person-name/kinship/comparative labels as sourceDate) to undated.
 *   D. Rebuild activeDateHints from remaining Western chronology only.
 *
 * Does not record date approval. Staging-only.
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
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';

const book = 'jinshu';
const chapter = '094';
const reportPath = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu094-independent-review-r2-20261123/date-report.needs-revision.json',
);
const outDir = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu094-owner-round3-20261123',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);

const YEAR = (y) => ({ era: 'AD', year: y, precision: 'year' });
const INTERVAL = (y) => ({ start: YEAR(y), end: YEAR(y) });

function cleanEvent(event, fallback) {
  const raw = typeof event === 'string' ? event : '';
  const stripped = raw.replace(/\s*\[External dating[^\]]*\]\.?\s*/g, '').trim();
  const base = stripped || fallback;
  if (base.length >= 20) return base;
  return `${base} (chapter attestation without convertible Western year)`.slice(0, 200);
}

function toUndated(value, fallbackEvent) {
  return {
    undatedSourceAttestation: true,
    event: cleanEvent(value?.event, fallbackEvent),
  };
}

function setAttestationWestern(value, { sourceDateText, year, event }) {
  return {
    sourceDate: { text: sourceDateText },
    westernInterval: INTERVAL(year),
    event: cleanEvent(event || value?.event, `Event dated ${sourceDateText}`),
  };
}

const compact = readJson(extractionPath);
const report = readJson(reportPath);
const priorHash = sha256(JSON.stringify(compact));

const claimIndex = (id) => {
  if (!id.startsWith('claim-')) throw new Error(`Not a claim id: ${id}`);
  return Number(id.slice(6)) - 1;
};

const ensureEvidence = (claim, unitId) => {
  const evidence = claim[4];
  if (!evidence.includes(unitId)) evidence.push(unitId);
};

/** Group A: Chinese-witnessed precise reign years (retain / refine). */
const RETAIN = new Map([
  [
    'claim-41',
    {
      sourceDateText: '咸寧四年',
      year: 278,
      event: 'Refused the erudite appointment in Xianning 4',
      addEvidence: 's0120',
      note: 's0120 咸寧四年，詔補博士，沖稱疾不應',
    },
  ],
  [
    'claim-60',
    {
      sourceDateText: '元康八年',
      year: 298,
      event: 'Died in Yuankang 8 at age seventy-eight',
      note: 's0176 以元康八年卒，年七十八 (already on evidence)',
    },
  ],
  [
    'claim-133',
    {
      sourceDateText: '永康元年',
      year: 300,
      event: 'Sought recluses in Yongkang 1',
      note: 's0306 永康初…',
    },
  ],
  [
    'claim-134',
    {
      sourceDateText: '永康元年',
      year: 300,
      event: 'Recommended Ren Xu in Yongkang 1',
      note: 's0306 永康初…',
    },
  ],
  [
    'claim-143',
    {
      sourceDateText: '咸和二年',
      year: 327,
      event: 'Sought posthumous rank for Ren Xu in Xianhe 2',
      note: 's0318 咸和二年卒…',
    },
  ],
  [
    'claim-320',
    {
      sourceDateText: '太元二十年',
      year: 395,
      event: 'Co-signed the eastern-palace memorial in Taiyuan 20',
      note: 's0757 太元二十年…',
    },
  ],
  [
    'claim-328',
    {
      sourceDateText: '義熙二年',
      year: 406,
      event: 'Resigned the Pengze magistracy in Yixi 2',
      addEvidence: 's0807',
      note: 's0807 義熙二年，解印去縣，乃賦《歸去來》',
    },
  ],
]);

const ops = {
  retainWestern: [],
  toUndatedFromIncorrect: [],
  toUndatedFromResearchBlocked: [],
  hintsCleared: [],
  hintsRebuilt: [],
};

for (const [id, spec] of RETAIN) {
  const idx = claimIndex(id);
  const claim = compact.claims[idx];
  if (!claim || claim[1] !== 'attestation') {
    throw new Error(`Retain target ${id} missing or not attestation`);
  }
  if (spec.addEvidence) ensureEvidence(claim, spec.addEvidence);
  claim[2] = setAttestationWestern(claim[2], spec);
  // Prefer explicit-event-contextual-date when a native year is present.
  if (claim[3] === 'uncertain') claim[3] = 'explicit-event-contextual-date';
  ops.retainWestern.push({ id, person: claim[0], ...spec });
}

const retainIds = new Set(RETAIN.keys());

for (const check of report.itemChecks) {
  if (!check.id.startsWith('claim-')) continue;
  if (retainIds.has(check.id)) continue;
  if (check.verdict !== 'incorrect' && check.verdict !== 'research-blocked') continue;

  const idx = claimIndex(check.id);
  const claim = compact.claims[idx];
  if (!claim) throw new Error(`Missing ${check.id}`);
  if (claim[1] !== 'attestation') {
    throw new Error(`${check.id} expected attestation, got ${claim[1]}`);
  }

  const before = claim[2];
  const fallback =
    check.verdict === 'research-blocked'
      ? 'Chapter names this person without a convertible Western year'
      : 'Chapter attestation retained without invented Western chronology';
  claim[2] = toUndated(before, fallback);

  if (check.verdict === 'incorrect') {
    ops.toUndatedFromIncorrect.push({
      id: check.id,
      person: claim[0],
      priorSourceDate: before?.sourceDate?.text ?? null,
    });
  } else {
    ops.toUndatedFromResearchBlocked.push({
      id: check.id,
      person: claim[0],
      priorSourceDate: before?.sourceDate?.text ?? null,
      priorUnresolvedReason: before?.unresolvedReason ?? null,
    });
  }
}

// Group D: rebuild hints from remaining Western chronology.
const personWestern = new Map();
for (const [idx, claim] of compact.claims.entries()) {
  if (claim[1] !== 'attestation') continue;
  const value = claim[2];
  if (!value?.westernInterval && !value?.westernYear) continue;
  const years = [];
  if (value.westernYear?.year) years.push(value.westernYear.year);
  if (value.westernInterval) {
    years.push(value.westernInterval.start.year, value.westernInterval.end.year);
  }
  const label = value.sourceDate?.text || '';
  const entry = personWestern.get(claim[0]) || { years: [], labels: new Set() };
  entry.years.push(...years);
  if (label) entry.labels.add(label);
  personWestern.set(claim[0], entry);
}

for (const person of compact.people) {
  const id = person[0];
  const hintsObj = person[4] && typeof person[4] === 'object' ? person[4] : { a: [] };
  const before = [...(hintsObj.a || [])];
  const west = personWestern.get(id);
  if (!west) {
    hintsObj.a = [];
    person[4] = hintsObj;
    if (before.length) ops.hintsCleared.push({ person: id, before });
    continue;
  }
  const lo = Math.min(...west.years);
  const hi = Math.max(...west.years);
  const label = [...west.labels].join('·') || 'native reign year';
  const hint = lo === hi ? `AD ${lo} (${label})` : `AD ${lo}–${hi} (${label})`;
  hintsObj.a = [hint];
  person[4] = hintsObj;
  ops.hintsRebuilt.push({ person: id, before, after: hintsObj.a });
}

// Office claim on s0120 already carries the Xianning 4 witness via claim-41 evidence;
// do not invent a parallel dated office dateContext.

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
const next = JSON.parse(serialized);
const nextHash = sha256(JSON.stringify(next));
if (nextHash === priorHash) throw new Error('Curation produced no extraction change');

fs.mkdirSync(outDir, { recursive: true });
writeTextAtomic(extractionPath, serialized);

const datePacket = buildDateAuditPacket(book, chapter);
writeJsonAtomic(path.join(outDir, 'date-packet.json'), datePacket);

const receipt = {
  schemaVersion: 1,
  kind: 'jinshu094-owner-round3-date-curation',
  book,
  chapter,
  basedOnReview: {
    pr: 5450,
    stagingPin: '166a7da3935090884d7a89aaec47af256aed1985',
    dateReport: 'research/people/checkpoints/jinshu094-independent-review-r2-20261123/date-report.needs-revision.json',
    reportExtractionHash: report.extractionHash,
  },
  priorExtractionHash: `sha256:${priorHash}`,
  curatedExtractionHash: datePacket.extractionHash,
  curatedAt: new Date().toISOString(),
  groups: {
    A_retainWesternWithChineseWitness: ops.retainWestern.length,
    B_incorrectToUndated: ops.toUndatedFromIncorrect.length,
    C_researchBlockedToUndated: ops.toUndatedFromResearchBlocked.length,
    D_hintsCleared: ops.hintsCleared.length,
    D_hintsRebuilt: ops.hintsRebuilt.length,
  },
  retainWestern: ops.retainWestern,
  sampleUndatedFromIncorrect: ops.toUndatedFromIncorrect.slice(0, 12),
  researchBlockedConverted: ops.toUndatedFromResearchBlocked,
  hintsRebuilt: ops.hintsRebuilt,
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
  retainWestern: ops.retainWestern,
  toUndatedFromIncorrect: ops.toUndatedFromIncorrect,
  toUndatedFromResearchBlocked: ops.toUndatedFromResearchBlocked,
  hintsCleared: ops.hintsCleared,
  hintsRebuilt: ops.hintsRebuilt,
});

console.log(
  JSON.stringify(
    {
      curatedExtractionHash: datePacket.extractionHash,
      sourceHash: datePacket.sourceHash,
      groups: receipt.groups,
      validation: receipt.validation,
      outDir,
    },
    null,
    2,
  ),
);
