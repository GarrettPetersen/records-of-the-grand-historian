#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../scripts/validate-people-extraction.mjs';
import {
  dateAuditDiagnostics,
  dateAuditItems,
  buildDateAuditPacket,
} from '../../../../../scripts/lib/people-date-audit.mjs';
import {
  REPO_ROOT,
  contentUnits,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from '../../../../../scripts/lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from '../../../../../scripts/lib/people-compact.mjs';

const book = 'qingshigao';
const chapter = '435';
const outDir = path.dirname(new URL(import.meta.url).pathname);
const reportPath = path.join(
  REPO_ROOT,
  'research/people/checkpoints/campaign-nov24-first-independent-date/qingshigao-435/independent-date-report.json',
);
const extractionPath = path.join(
  REPO_ROOT,
  'data/people/extractions',
  book,
  `${chapter}.json`,
);
const sourcePath = path.join(REPO_ROOT, 'data', book, `${chapter}.json`);

const FINDING1 = new Set([
  'claim-117', 'claim-121', 'claim-124', 'claim-128', 'claim-131', 'claim-132',
  'claim-134', 'claim-136', 'claim-170', 'claim-172', 'claim-174', 'claim-177',
  'claim-182', 'claim-211', 'claim-217', 'claim-219', 'claim-221', 'claim-223',
]);
const FINDING2 = new Set([
  'claim-146', 'claim-148', 'claim-153', 'claim-198', 'claim-242', 'claim-243',
  'claim-246', 'claim-247', 'claim-252', 'claim-256', 'claim-259', 'claim-261',
  'claim-265', 'claim-276',
]);
const REPAIR_IDS = [...FINDING1, ...FINDING2];
const HINT_PERSONS = new Set(
  'p003 p006 p007 p008 p010 p011 p012 p013 p014 p015 p016 p017 p018 p019 p020 p021 p022 p023 p024 p026 p027 p028 p029 p030 p031 p032 p033 p034'.split(
    ' ',
  ),
);

const BACKDROP_UNITS = new Set(['s0018', 's0065', 's0099', 's0055', 's0156', 's0141']);

function claimIndex(id) {
  return Number(id.slice(6)) - 1;
}

function evidenceIds(claim) {
  return claim[claim.length - 1];
}

function setEvidence(claim, ids) {
  claim[claim.length - 1] = [...ids];
}

function englishForUnit(unitMap, unitId) {
  const u = unitMap.get(unitId);
  if (!u) return null;
  return (u.en || u.literal || '').trim();
}

function cleanEvent(enQuote, personName, fallback) {
  let base =
    enQuote && enQuote.length >= 20
      ? enQuote
      : `${personName}: ${fallback} (primary witness without convertible reign year on this unit)`;
  base = base.replace(/\s{2,}/g, ' ').trim();
  if (base.length < 20) {
    base = `${base} — chapter witness without calendrical label on cited unit`.slice(0, 240);
  }
  return base.slice(0, 240);
}

function personName(compact, personId) {
  const row = compact.people.find((p) => p[0] === personId);
  return row?.[1]?.[0] ?? personId;
}

const compact = readJson(extractionPath);
const source = readJson(sourcePath);
const unitMap = new Map(
  contentUnits(source).map((u) => {
    const tr = u.translations?.[0];
    const en = tr?.idiomatic || tr?.literal || u.en || u.literal;
    return [u.id, { ...u, en }];
  }),
);

const priorSerialized = serializeCompactPeopleExtraction(compact);
const priorContentSha = sha256(priorSerialized);

const repairs = [];

for (const id of REPAIR_IDS) {
  const idx = claimIndex(id);
  const claim = compact.claims[idx];
  if (claim[1] !== 'attestation') throw new Error(`${id} expected attestation, got ${claim[1]}`);
  const before = structuredClone(claim[2]);
  const beforeEvidence = [...evidenceIds(claim)];
  const primary = beforeEvidence[0];
  if (!primary) throw new Error(`${id} missing evidence`);

  const filtered = beforeEvidence.filter((u) => !BACKDROP_UNITS.has(u) || u === primary);
  const primaryOnly = [primary];
  setEvidence(claim, primaryOnly);

  const enPrimary = englishForUnit(unitMap, primary);
  const event = cleanEvent(
    enPrimary,
    personName(compact, claim[0]),
    `attestation at ${primary}`,
  );
  claim[2] = { undatedSourceAttestation: true, event };
  claim[3] = 'explicit';

  repairs.push({
    id,
    personId: claim[0],
    finding: FINDING1.has(id) ? 'backdrop-or-invented-interval' : 'primary-lacks-reign-label',
    before: {
      value: before,
      evidence: beforeEvidence,
      certainty: claim[3],
    },
    after: {
      value: claim[2],
      evidence: primaryOnly,
      certainty: 'explicit',
    },
    primaryUnit: primary,
    sourceZh: unitMap.get(primary)?.zh?.slice(0, 120) ?? null,
    sourceEn: enPrimary?.slice(0, 160) ?? null,
    removedBackdropUnits: beforeEvidence.filter((u) => BACKDROP_UNITS.has(u)),
  });
}

const personWestern = new Map();
for (const claim of compact.claims) {
  if (claim[1] !== 'attestation') continue;
  const value = claim[2];
  if (!value?.westernInterval && !value?.westernYear) continue;
  const years = [];
  if (value.westernYear?.year) years.push(value.westernYear.year);
  if (value.westernInterval) {
    years.push(value.westernInterval.start?.year, value.westernInterval.end?.year);
  }
  const label = value.sourceDate?.text || '';
  const entry = personWestern.get(claim[0]) || { years: [], labels: new Set() };
  entry.years.push(...years.filter((y) => typeof y === 'number'));
  if (label) entry.labels.add(label);
  personWestern.set(claim[0], entry);
}

const hintOps = [];
for (const person of compact.people) {
  const id = person[0];
  if (!HINT_PERSONS.has(id)) continue;
  const hintsObj = person[4] && typeof person[4] === 'object' ? person[4] : { a: [] };
  const before = [...(hintsObj.a || [])];
  const west = personWestern.get(id);
  if (!west || !west.years.length) {
    hintsObj.a = [];
    person[4] = hintsObj;
    if (before.length) hintOps.push({ person: id, before, after: [] });
    continue;
  }
  const lo = Math.min(...west.years);
  const hi = Math.max(...west.years);
  const label = [...west.labels].join('·') || 'source-witnessed reign year';
  const hint = lo === hi ? `AD ${lo} (${label})` : `AD ${lo}–${hi} (${label})`;
  hintsObj.a = [hint];
  person[4] = hintsObj;
  hintOps.push({ person: id, before, after: [...hintsObj.a] });
}

const packet = buildPeopleExtractionPacket(book, chapter);
let validation;
try {
  validation = validateCompactPeopleExtraction(compact, packet, {
    strictAliasDispositions: true,
  });
} catch (error) {
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
const candidate = JSON.parse(serialized);
const candidateBytes = Buffer.from(serialized, 'utf8');
const candidateFileSha = createHash('sha256').update(candidateBytes).digest('hex');

if (sha256(serialized) === priorContentSha) {
  throw new Error('Curation produced no extraction change');
}

const datePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const datePacketPath = path.join(outDir, 'candidate-date-packet.json');
const candidatePath = path.join(outDir, 'candidate-extraction.json');

writeTextAtomic(candidatePath, serialized);
writeJsonAtomic(datePacketPath, datePacket);

const focused = {
  schemaVersion: 1,
  kind: 'retained-staging-focused-owner-date-repair',
  scope: { book, chapter },
  ownerAgentId: 'bc-4cd01f5b-9573-4c01-ab10-2b42d4438e70',
  idempotencyKey:
    'a2e0c7183509c05ac8bb2b7e39a4502b048226057cdc16b13a5364e98a5999c2',
  phase: 'dispatch_pending',
  handoffBranch: 'cursor/nov24-first-native-date-delta-w1-38e70',
  stagingBase: '20b8d0e3cd33c64ab1c91984c5d53cc80cd09aca',
  ownerHead: '4e8de6fb5e0eb7e4d6d22a7ffb181c4a90db67c8',
  inputBlobWitness: {
    source: '50a2c6f5c339e7ed35be9f88ae06ad661ec25ab7',
    extraction: '95ba51cde6ee766e5d6a632150e35cce0784effc',
    editorial: '6a1993f93f8affacfe4b296012e9c13829528f81',
  },
  sealedInputs: {
    source: 'sha256:bea2ae31678d492df3d6bf1e1dc0ae2295f5243d4edcd67df8920e40ec13992c',
    extraction: 'sha256:8b60a0baecf2aa0b9b22a04959bdf80c32d948f903ce6e5704685e162292f107',
    editorial: 'sha256:816ba3c34b77647a829e7a81d89ff1ed7332f3175f9cc27438ccfd06fd52b603',
  },
  independentReport: {
    path: reportPath.replace(REPO_ROOT + '/', ''),
    revision: 'ab8b76b7044f9bb01a9cccb9a8acd27740f612d5',
    contentSha256:
      'sha256:7d82b2935e4e80b98bf0e5e1eccbd421ea6de2f58a16ef5ce47fd6173cda24e9',
    gitBlob: '97a8f21ba6fa7c837940ee2f2206513fb3b03e20',
    status: 'needs-revision',
    findings: 3,
    independentReviewer: 'bc-e53c6341-fd43-44a8-a663-0361e6614b47',
    preservedUnmodified: true,
  },
  preRepairPacket: {
    path: 'research/people/checkpoints/campaign-nov24-retained-staging/qingshigao-435/date-packet.json',
    packetFileSha256:
      'sha256:1e55f505b6772bfa656db66b0c3794e24913a7987e838053e218859fdc3b19bf',
    packetSourceHash: 'sha256:38ecf4166512aedbc3f89bfefa90436655fcd805e3fccf00f789053d9012145f',
    packetExtractionHash:
      'sha256:14221120d49c79cda53607c5ceb286c53df368910751d886bbf6e05c295cac32',
  },
  candidateOutputs: {
    candidateExtraction: 'research/people/checkpoints/campaign-nov24-first-native-delta/qingshigao-435/candidate-extraction.json',
    candidateExtractionBytesSha256: `sha256:${candidateFileSha}`,
    candidateDatePacket:
      'research/people/checkpoints/campaign-nov24-first-native-delta/qingshigao-435/candidate-date-packet.json',
    packetExtractionHash: datePacket.extractionHash,
    packetSourceHash: datePacket.sourceHash,
    itemCount: datePacket.items?.length ?? null,
  },
  priorExtractionContentSha256: priorContentSha.startsWith('sha256:')
    ? priorContentSha
    : `sha256:${priorContentSha}`,
  changedClaimIds: REPAIR_IDS,
  findingCoverage: {
    finding1_backdrop: [...FINDING1],
    finding2_primaryReign: [...FINDING2],
    finding3_personHints: {
      personsRecomputed: hintOps.map((h) => h.person),
      operations: hintOps,
      hold:
        'Independent reviewer re-checks person aggregates after item repairs; owner rebuilt hints only from remaining Western-dated attestations.',
    },
  },
  repairs,
  definiteTranslationRepairs: [],
  remainingHolds: {
    independentDateApproval: {
      missing: true,
      ownerSelfApproved: false,
      next: 'Independent delta review on candidate-date-packet.json vs preserved independent-date-report.json',
    },
    identityReview: 'Unchanged from retained-staging owner handoff; date delta does not merge canonical identity.',
  },
  nativeValidation: {
    validateCompactPeopleExtraction: { passed: true },
    dateAuditDiagnostics: geometry,
    commands: [
      `node ${path.relative(REPO_ROOT, import.meta.url.slice(7))}`,
      `npm run people:validate -- --book ${book} --chapter ${chapter}`,
    ],
  },
  canonicalEdits: false,
  independentApprovalIssued: false,
  notes:
    '[CF-Pages-Skip] Scoped chronology delta only; sealed data/people inputs untouched; prior full independent report preserved.',
};

writeJsonAtomic(path.join(outDir, 'focused-owner-repair.json'), focused);
console.log(
  JSON.stringify(
    {
      repairs: repairs.length,
      candidateFileSha,
      packetExtractionHash: datePacket.extractionHash,
      hintOps: hintOps.length,
    },
    null,
    2,
  ),
);