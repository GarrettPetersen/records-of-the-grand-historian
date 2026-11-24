#!/usr/bin/env node
/**
 * Jinshu 123 owner round-5: focused repair of the 23 unresolved rows from #5468.
 *
 * Groups:
 *   A. Relative event wording on non-attestation dateContext → drop unresolved
 *      dating packaging (keep claim fields + evidence; no Western invention).
 *   B. Retrospective exemplars / name-as-sourceDate attestations → supported
 *      undatedSourceAttestation with substantive event.
 *   C. Relative-phrase attestations lacking convertible era → undated.
 *   D. Keep genuine uncertainty: unnamed elder-brother inferences (220, 326)
 *      and source-form 太原王 (474).
 *
 * Preserves 33 local Taiyuan Western mappings and 47 editorial decisions.
 * Does not record date approval or downgrade certainty.
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import {
  dateAuditDiagnostics,
  dateAuditItems,
  unresolvedDateAuditItems,
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
const stagingPinBefore = 'b5962b67fc6277f56d24341fb7bf7627d9449ede';
const reviewPr = 5468;
const reviewCommit = 'fa431c67fd5cd0a3e863a30abb05d5b7c83d13ad';
const continuesReviewer = 'bc-985e5c79-a8bc-4040-8f8d-4f1fba0f38b2';

const outDir = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu123-owner-round5-20261123',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const reviewDir = path.join(REPO_ROOT, 'research/people/jinshu123-independent-review-r4-20261123');

const WESTERN_KEYS = ['westernYear', 'westernInterval', 'westernBounds'];

const KEEP_UNRESOLVED = new Set(['claim-220', 'claim-326', 'claim-474']);

const STRIP_DATE_CONTEXT = {
  'claim-22': null,
  'claim-26': null,
  'claim-42': null,
  'claim-58': null,
  'claim-103': null,
  'claim-142': null,
};

const TO_UNDATED = {
  'claim-28':
    'Retrospective name-allusion to Xi Que (郤𡙇) when Murong Jun renamed Chui after a hunting injury',
  'claim-116':
    'Retrospective Spring and Autumn exemplar: Marquis of Deng ignored counsel and was destroyed by Chu',
  'claim-129':
    'Retrospective founding exemplar Tang and Wu cited in advice to seize the moment',
  'claim-293':
    'Retrospective comparison to King Wu’s assembly at Mengjin when hosts flocked at Shimen',
  'claim-305':
    'Fu Jian’s reply claims thirty years of rule while answering Chui (chapter letter witness without convertible era year)',
  'claim-307':
    'Retrospective Bo Yi exemplar in Fu Jian’s rebuke of Chui’s change of loyalty',
  'claim-309':
    'Retrospective Liuxia Hui exemplar in Fu Jian’s rebuke of Chui’s change of loyalty',
  'claim-318':
    'Retrospective Huandou precedent cited when describing Zhai Bin’s brothers made kings',
  'claim-419':
    'Posthumous honor as Empress Wenzhao for Chui’s mother Lady Lan (occurrence without her own convertible dates)',
  'claim-426':
    'Former consort Empress Duan displaced from paired ancestral sacrifice (occurrence without her own convertible dates)',
  'claim-435':
    'Legendary sage-king Yao cited in erudite argument about consort ranking',
  'claim-437':
    'Legendary mother of Yao cited as ranking third among consorts',
  'claim-440':
    'Legendary consort Jiang Yuan cited as not outranked by Yao’s mother',
  'claim-470':
    'Named as former sovereign whose Yan governors are attacked after his fall (chapter witness without convertible dating here)',
};

function countTaiyuanLocal(compact, unitMap) {
  const { items } = dateAuditItems(compact);
  let local = 0;
  let undated = 0;
  for (const item of items) {
    if (!item.id.startsWith('claim-')) continue;
    const claim = compact.claims[item.claimIndex];
    const dated = claim[1] === 'attestation' ? claim[2] : claim[2]?.dateContext || null;
    if (!dated) continue;
    if (dated.undatedSourceAttestation === true) {
      undated += 1;
      continue;
    }
    const hasW = WESTERN_KEYS.some((key) => dated[key] !== undefined);
    if (!hasW) continue;
    const ev = claim[claim.length - 1];
    const ids = Array.isArray(ev) ? ev : [];
    if (ids.some((id) => /太元/.test(unitMap.get(id)?.zh || ''))) local += 1;
  }
  return { local, undated };
}

const compact = readJson(extractionPath);
const consolidation = readJson(path.join(reviewDir, 'consolidation.json'));
const sourceChapter = readJson(path.join(REPO_ROOT, 'data', book, `${chapter}.json`));
const unitMap = new Map(contentUnits(sourceChapter).map((u) => [u.id, u]));
const priorHash = sha256(JSON.stringify(compact));
const beforePacket = buildDateAuditPacket(book, chapter);
const beforeUnresolved = unresolvedDateAuditItems(beforePacket).map((item) => item.id);

const expected = consolidation.chronology?.researchBlockedUnresolved || [];
if (beforeUnresolved.length !== 23) {
  throw new Error(`Expected 23 unresolved items before repair, found ${beforeUnresolved.length}`);
}
if (JSON.stringify([...beforeUnresolved].sort()) !== JSON.stringify([...expected].sort())) {
  throw new Error(`Unresolved ID set drifted from #5468 consolidation: ${beforeUnresolved.join(',')}`);
}

const baseline = countTaiyuanLocal(compact, unitMap);
if (baseline.local !== 33) {
  throw new Error(`Expected 33 local Taiyuan Western rows, found ${baseline.local}`);
}
if (compact.people.length !== 103) {
  throw new Error(`Expected 103 people, found ${compact.people.length}`);
}

const { items } = dateAuditItems(compact);
const byId = new Map(items.map((item) => [item.id, item]));

const ops = {
  strippedDateContext: [],
  toUndated: [],
  keptUnresolved: [],
};

for (const id of beforeUnresolved) {
  const item = byId.get(id);
  if (!item) throw new Error(`Missing ${id}`);
  const claim = compact.claims[item.claimIndex];
  const before = structuredClone(claim);

  if (KEEP_UNRESOLVED.has(id)) {
    ops.keptUnresolved.push({
      id,
      person: claim[0],
      predicate: claim[1],
      reason: claim[2]?.unresolvedReason || claim[2]?.dateContext?.unresolvedReason || null,
      sourceDate: claim[2]?.sourceDate?.text || claim[2]?.dateContext?.sourceDate?.text || null,
    });
    continue;
  }

  if (Object.prototype.hasOwnProperty.call(STRIP_DATE_CONTEXT, id)) {
    if (!claim[2]?.dateContext?.unresolved) {
      throw new Error(`${id} expected unresolved dateContext`);
    }
    const priorDc = structuredClone(claim[2].dateContext);
    const next = { ...claim[2] };
    delete next.dateContext;
    claim[2] = next;
    ops.strippedDateContext.push({
      id,
      person: claim[0],
      predicate: claim[1],
      certainty: claim[3],
      priorDateContext: priorDc,
      evidence: claim[claim.length - 1],
      form: 'remove-unresolved-dateContext',
    });
    continue;
  }

  if (!Object.prototype.hasOwnProperty.call(TO_UNDATED, id)) {
    throw new Error(`No repair plan for ${id}`);
  }
  if (claim[1] !== 'attestation') {
    throw new Error(`${id} expected attestation for undated conversion`);
  }
  const prior = structuredClone(claim[2]);
  const event = TO_UNDATED[id];
  if (event.length < 20) throw new Error(`Event too short for ${id}`);
  claim[2] = {
    undatedSourceAttestation: true,
    event,
  };
  // Preserve certainty exactly — do not downgrade to pass checks.
  ops.toUndated.push({
    id,
    person: claim[0],
    certainty: claim[3],
    priorSourceDate: prior.sourceDate?.text ?? null,
    priorUnresolvedReason: prior.unresolvedReason ?? null,
    priorEvent: prior.event ?? null,
    afterEvent: event,
    evidence: claim[claim.length - 1],
    form: 'undatedSourceAttestation',
  });
}

// Safety: kept unresolved must still be unresolved.
for (const id of KEEP_UNRESOLVED) {
  const item = byId.get(id);
  const claim = compact.claims[item.claimIndex];
  const dated = claim[1] === 'attestation' ? claim[2] : claim[2]?.dateContext;
  if (!dated?.unresolved) throw new Error(`${id} must remain unresolved`);
}
const p120 = compact.people.find((person) => person[0] === 'p120');
if (!p120 || p120[1]?.[1] !== '太原王') {
  throw new Error('p120 太原王 preferred name must remain');
}
if (compact.people.length !== 103) {
  throw new Error('People count changed');
}

const afterCounts = countTaiyuanLocal(compact, unitMap);
if (afterCounts.local !== 33) {
  throw new Error(`Taiyuan local count changed: ${afterCounts.local}`);
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

const afterItems = dateAuditItems(compact);
const geometry = dateAuditDiagnostics(afterItems);
if (geometry.length) {
  throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
}

const serialized = serializeCompactPeopleExtraction(compact);
const nextHash = sha256(JSON.stringify(JSON.parse(serialized)));
if (nextHash === priorHash) throw new Error('Curation produced no extraction change');

fs.mkdirSync(outDir, { recursive: true });
writeTextAtomic(extractionPath, serialized);

const datePacket = buildDateAuditPacket(book, chapter);
const afterUnresolved = unresolvedDateAuditItems(datePacket).map((item) => item.id);
if (JSON.stringify([...afterUnresolved].sort()) !== JSON.stringify([...KEEP_UNRESOLVED].sort())) {
  throw new Error(`Expected only kept unresolved remains, found ${afterUnresolved.join(',')}`);
}

const receipt = {
  schemaVersion: 1,
  kind: 'jinshu123-owner-round5-unresolved-curation',
  book,
  chapter,
  basedOnReview: {
    stagingPr: 5439,
    stagingPinBefore,
    reviewPr,
    reviewCommit,
    continuesReviewer,
    consolidation: 'research/people/jinshu123-independent-review-r4-20261123/consolidation.json',
  },
  priorExtractionHash: `sha256:${priorHash}`,
  curatedExtractionHash: datePacket.extractionHash,
  curatedSourceHash: datePacket.sourceHash,
  curatedAt: new Date().toISOString(),
  before: {
    unresolved: beforeUnresolved,
    undated: baseline.undated,
    taiyuanLocal: baseline.local,
  },
  after: {
    unresolved: afterUnresolved,
    undated: afterCounts.undated,
    taiyuanLocal: afterCounts.local,
  },
  groups: {
    A_relativeEventStripDateContext: ops.strippedDateContext.map((row) => row.id),
    B_C_toUndatedAttestation: ops.toUndated.map((row) => row.id),
    D_keptUnresolvedUncertainty: ops.keptUnresolved.map((row) => row.id),
  },
  preserved: {
    people: compact.people.length,
    taiyuanLocal: 33,
    editorialRepairs: 47,
    p120TaiyuanWangUnresolved: true,
  },
  validation: {
    compactValidation: `PASS: ${validation.stats.claims} claims`,
    chronologyGeometry: geometry.length ? geometry : 'PASS',
  },
  dateApproval: 'NONE',
  publication: 'staging-only',
  masterMutation: 'NONE',
};

writeJsonAtomic(path.join(outDir, 'date-curation-receipt.json'), receipt);
writeJsonAtomic(path.join(outDir, 'grouped-corrections.json'), {
  strippedDateContext: ops.strippedDateContext,
  toUndated: ops.toUndated,
  keptUnresolved: ops.keptUnresolved,
});
writeJsonAtomic(path.join(outDir, 'date-packet.json'), datePacket);
writeJsonAtomic(path.join(outDir, 'residual-for-same-reviewer.json'), {
  schemaVersion: 1,
  kind: 'jinshu123-owner-round5-residual-for-same-reviewer',
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
  clearedFromUnresolved: [...ops.strippedDateContext, ...ops.toUndated].map((row) => row.id),
  remainingUnresolved: ops.keptUnresolved,
  note:
    'Twenty relative/exemplar/honorific rows converted to supported undated or dateContext-free occurrence claims. Three genuine uncertainties retained: unnamed elder-brother inferences and source-form 太原王.',
  dateApproval: 'NONE',
});

writeTextAtomic(
  path.join(outDir, 'README.md'),
  `# Jinshu 123 owner round 5 (post #5468)

Pinned staging #5439 @ \`${stagingPinBefore}\` with independent review #5468 @ \`${reviewCommit}\`.

## Focused unresolved repair (23 → 3)
- Relative event wording: strip unresolved \`dateContext\` packaging (\`claim-22\`, \`26\`, \`42\`, \`58\`, \`103\`, \`142\`).
- Exemplars / honorific / name-as-date attestations → \`undatedSourceAttestation\` (14 rows).
- **Kept unresolved:** \`claim-220\`, \`claim-326\` (unnamed elder-brother inferences), \`claim-474\` (太原王).

## Preserved
- 33 local Taiyuan Western mappings
- 47 editorial repairs / 4 claim revisions
- Continuity merges; p120 \`太原王\` unresolved
- Certainty values unchanged

## Not publication-approved
Same reviewer: \`${continuesReviewer}\`.
`,
);

fs.mkdirSync(path.join(outDir, 'scripts'), { recursive: true });
fs.copyFileSync(
  path.join(REPO_ROOT, 'scripts/curate-jinshu123-owner-round5-unresolved.mjs'),
  path.join(outDir, 'scripts/curate-jinshu123-owner-round5-unresolved.mjs'),
);

console.log(
  JSON.stringify(
    {
      curatedExtractionHash: datePacket.extractionHash,
      sourceHash: datePacket.sourceHash,
      beforeUnresolved: beforeUnresolved.length,
      afterUnresolved: afterUnresolved,
      groups: receipt.groups,
      undatedBeforeAfter: [baseline.undated, afterCounts.undated],
      taiyuanLocal: afterCounts.local,
      validation: receipt.validation,
      outDir,
    },
    null,
    2,
  ),
);
