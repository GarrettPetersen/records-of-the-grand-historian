#!/usr/bin/env node
/**
 * Jinshu 123 owner round-3 chronology curation after #5455 needs-revision.
 *
 * Groups (from native date-audits + ownerActions):
 *   A. Incorrect event/relative-phrase Western years → undated (attestations)
 *      or sourceDate + unresolved on dateContext (non-attestation).
 *   B. Research-blocked genuine 太元 reign-year witnesses → retain Chinese
 *      sourceDate AND defensible Western conversion (source-supported).
 *      Other research-blocked rows without era years → sourceDate + unresolved.
 *   C. Supported rows (including p120 太原王 unresolved) left untouched.
 *   D. Rebuild active-date hints from remaining Western; clear invented AD lists.
 *
 * Does not undo the 24 continuity merges or p120 source-form attribution.
 * Does not record date approval.
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
const chapter = '123';
const reportPath = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu123-independent-review-r2-20261123/date-report.needs-revision.json',
);
const outDir = path.join(
  REPO_ROOT,
  'research/people/checkpoints/jinshu123-owner-round3-20261123',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);

const WESTERN_KEYS = ['westernYear', 'westernInterval', 'westernBounds'];

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

function stripWesternFromDateContext(dateContext, unresolvedReason) {
  const next = { ...dateContext };
  for (const key of WESTERN_KEYS) delete next[key];
  if (next.sourceDate?.text) {
    next.unresolved = true;
    next.unresolvedReason = unresolvedReason;
  } else {
    delete next.unresolved;
    delete next.unresolvedReason;
  }
  if (typeof next.event === 'string') {
    next.event = cleanEvent(next.event, 'Chapter-relative chronology without convertible Western year');
  }
  return next;
}

function toUndatedAttestation(value, fallbackEvent) {
  return {
    undatedSourceAttestation: true,
    event: cleanEvent(value?.event, fallbackEvent),
  };
}

function toSourceDateUnresolvedAttestation(value, unresolvedReason) {
  return {
    sourceDate: value.sourceDate,
    unresolved: true,
    unresolvedReason,
    event: cleanEvent(value.event, `Chapter date ${value.sourceDate?.text || 'witness'} retained without Western conversion`),
  };
}

const compact = readJson(extractionPath);
const report = readJson(reportPath);
const priorHash = sha256(JSON.stringify(compact));
const { items } = dateAuditItems(compact);
const byId = new Map(items.map((item) => [item.id, item]));

const ops = {
  incorrectAttestationToUndated: [],
  incorrectDateContextToUnresolved: [],
  researchBlockedRegnalRetained: [],
  researchBlockedToSourceUnresolved: [],
  hintsCleared: [],
  hintsKeptSupported: [],
  untouchedSupportedClaims: 0,
};

const EVENT_REASON =
  'Chinese event/relative phrase retained; invented Western year/interval/bounds removed pending convertible era evidence.';
const TAIYUAN_YEAR_RE = /太元(?:元|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|二十一)年/;

for (const check of report.itemChecks) {
  if (!check.id.startsWith('claim-')) continue;
  const item = byId.get(check.id);
  if (!item) throw new Error(`Missing item ${check.id}`);
  const claim = compact.claims[item.claimIndex];
  if (!claim) throw new Error(`Missing claim row ${check.id}`);

  if (check.verdict === 'supported') {
    ops.untouchedSupportedClaims += 1;
    continue;
  }

  if (check.verdict === 'incorrect') {
    if (claim[1] === 'attestation') {
      const before = claim[2];
      claim[2] = toUndatedAttestation(
        before,
        before?.sourceDate?.text
          ? `Chapter event witness ${before.sourceDate.text}`
          : 'Chapter attestation without convertible Western year',
      );
      ops.incorrectAttestationToUndated.push({
        id: check.id,
        person: claim[0],
        priorSourceDate: before?.sourceDate?.text ?? null,
      });
      continue;
    }
    if (!claim[2]?.dateContext) {
      throw new Error(`${check.id} incorrect non-attestation lacks dateContext`);
    }
    const before = claim[2].dateContext;
    // Death rows cannot remain as sourceDate-only without Western under prompt v7.
    // Drop invented dating and keep non-temporal death fields (statement/place/age).
    if (claim[1] === 'death') {
      const next = { ...claim[2] };
      delete next.dateContext;
      if (!next.statement) {
        next.statement = cleanEvent(
          before.event,
          before.sourceDate?.text
            ? `Chapter notes ${before.sourceDate.text} without a convertible Western year`
            : 'Chapter death notice without a convertible Western year',
        );
      }
      claim[2] = next;
      ops.incorrectDateContextToUnresolved.push({
        id: check.id,
        person: claim[0],
        predicate: 'death',
        priorSourceDate: before?.sourceDate?.text ?? null,
        form: 'statement-without-dateContext',
      });
      continue;
    }
    claim[2] = {
      ...claim[2],
      dateContext: stripWesternFromDateContext(before, EVENT_REASON),
    };
    ops.incorrectDateContextToUnresolved.push({
      id: check.id,
      person: claim[0],
      predicate: claim[1],
      priorSourceDate: before?.sourceDate?.text ?? null,
      form: 'sourceDate-unresolved',
    });
    continue;
  }

  if (check.verdict === 'research-blocked') {
    const datedValue = claim[1] === 'attestation' ? claim[2] : claim[2]?.dateContext;
    const sourceText = datedValue?.sourceDate?.text || '';

    // Genuine chapter reign-year witnesses: retain defensible Western conversion.
    if (TAIYUAN_YEAR_RE.test(sourceText) && WESTERN_KEYS.some((key) => datedValue?.[key] !== undefined)) {
      ops.researchBlockedRegnalRetained.push({
        id: check.id,
        person: claim[0],
        predicate: claim[1],
        sourceDate: sourceText,
        westernYear: datedValue.westernYear?.year ?? null,
        westernBounds: datedValue.westernBounds ?? null,
      });
      continue;
    }

    if (claim[1] === 'attestation') {
      const before = claim[2];
      if (!before?.sourceDate?.text) {
        throw new Error(`${check.id} research-blocked attestation missing sourceDate`);
      }
      // Already unresolved without Western: leave (genuine holds).
      if (before.unresolved === true && !WESTERN_KEYS.some((key) => before[key] !== undefined)) {
        ops.untouchedSupportedClaims += 1;
        continue;
      }
      claim[2] = toSourceDateUnresolvedAttestation(before, EVENT_REASON);
      ops.researchBlockedToSourceUnresolved.push({
        id: check.id,
        person: claim[0],
        predicate: 'attestation',
        sourceDate: before.sourceDate.text,
      });
      continue;
    }
    if (!claim[2]?.dateContext) {
      throw new Error(`${check.id} research-blocked non-attestation lacks dateContext`);
    }
    const before = claim[2].dateContext;
    claim[2] = {
      ...claim[2],
      dateContext: stripWesternFromDateContext(before, EVENT_REASON),
    };
    ops.researchBlockedToSourceUnresolved.push({
      id: check.id,
      person: claim[0],
      predicate: claim[1],
      sourceDate: before?.sourceDate?.text ?? null,
    });
    continue;
  }
}

// Group D: hints — clear invented AD lists; keep supported non-AD research hints.
const personHasWestern = new Set();
const personHasChronology = new Set();
for (const claim of compact.claims) {
  const values = [claim[2], claim[2]?.dateContext].filter(Boolean);
  for (const value of values) {
    if (WESTERN_KEYS.some((key) => value?.[key] !== undefined)) {
      personHasWestern.add(claim[0]);
    }
    if (
      value?.undatedSourceAttestation === true ||
      value?.unresolved === true ||
      value?.sourceDate ||
      value?.qualitative ||
      WESTERN_KEYS.some((key) => value?.[key] !== undefined)
    ) {
      personHasChronology.add(claim[0]);
    }
  }
}

const supportedHintIds = new Set(
  report.itemChecks.filter((check) => check.verdict === 'supported' && check.id.startsWith('hints-')).map((check) => check.id),
);

for (const person of compact.people) {
  const id = person[0];
  const hintsObj = person[4] && typeof person[4] === 'object' ? person[4] : { a: [] };
  const before = [...(hintsObj.a || [])];
  const hintId = `hints-${id}`;

  if (supportedHintIds.has(hintId)) {
    // Keep reviewer-supported research/legendary hints; still strip any AD lists.
    const kept = before.filter((hint) => !/\b(?:AD|BC)\s+\d{1,4}\b/u.test(hint));
    hintsObj.a = kept.length ? kept : before.filter((hint) => !/\b(?:AD|BC)\s+\d{1,4}\b/u.test(hint));
    if (!hintsObj.a.length && before.some((hint) => /research required|legendary/i.test(hint))) {
      hintsObj.a = before.filter((hint) => /research required|legendary/i.test(hint));
    }
    person[4] = hintsObj;
    ops.hintsKeptSupported.push({ person: id, before, after: hintsObj.a });
    continue;
  }

  if (personHasWestern.has(id)) {
    // Should be rare after strips; build minimal AD hint if any Western remains.
    const years = [];
    for (const claim of compact.claims) {
      if (claim[0] !== id) continue;
      for (const value of [claim[2], claim[2]?.dateContext].filter(Boolean)) {
        if (value.westernYear?.year) years.push(value.westernYear.year);
        if (value.westernInterval) {
          years.push(value.westernInterval.start.year, value.westernInterval.end.year);
        }
        if (value.westernBounds?.onOrAfter?.year) years.push(value.westernBounds.onOrAfter.year);
        if (value.westernBounds?.onOrBefore?.year) years.push(value.westernBounds.onOrBefore.year);
      }
    }
    if (years.length) {
      const lo = Math.min(...years);
      const hi = Math.max(...years);
      hintsObj.a = [lo === hi ? `AD ${lo}` : `AD ${lo}–${hi}`];
    } else {
      hintsObj.a = [];
    }
  } else {
    hintsObj.a = [];
  }
  person[4] = hintsObj;
  if (JSON.stringify(before) !== JSON.stringify(hintsObj.a)) {
    ops.hintsCleared.push({ person: id, before, after: hintsObj.a });
  }
}

// Safety: p120 must remain source-form 太原王 unresolved, not merged away.
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
  kind: 'jinshu123-owner-round3-date-curation',
  book,
  chapter,
  basedOnReview: {
    pr: 5455,
    stagingPin: '0ebd20b28e489ca9e1a52ff9097091826d8ffb73',
    reviewCommit: 'd1f9753e29ab93d0126277c94cad39c2ca0fe46b',
    dateReport: 'research/people/checkpoints/jinshu123-independent-review-r2-20261123/date-report.needs-revision.json',
    reportExtractionHash: report.extractionHash,
  },
  continuityPreserved: {
    peopleCount: compact.people.length,
    mergeGroupsFromRound2: 24,
    p120PreferredName: { en: 'Prince of Taiyuan', zh: '太原王' },
    p120AttestationUnresolved: true,
  },
  priorExtractionHash: `sha256:${priorHash}`,
  curatedExtractionHash: datePacket.extractionHash,
  curatedAt: new Date().toISOString(),
  groups: {
    A_incorrectAttestationToUndated: ops.incorrectAttestationToUndated.length,
    A_incorrectDateContextToUnresolved: ops.incorrectDateContextToUnresolved.length,
    B_researchBlockedRegnalWesternRetained: ops.researchBlockedRegnalRetained.length,
    B_researchBlockedNonEraToUnresolved: ops.researchBlockedToSourceUnresolved.length,
    C_untouchedSupportedClaims: ops.untouchedSupportedClaims,
    D_hintsClearedOrRebuilt: ops.hintsCleared.length,
    D_hintsKeptSupported: ops.hintsKeptSupported.length,
  },
  sampleIncorrectUndated: ops.incorrectAttestationToUndated.slice(0, 12),
  sampleIncorrectDateContext: ops.incorrectDateContextToUnresolved.slice(0, 12),
  researchBlockedRegnalRetained: ops.researchBlockedRegnalRetained.slice(0, 20),
  researchBlockedConverted: ops.researchBlockedToSourceUnresolved.slice(0, 20),
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
  incorrectAttestationToUndated: ops.incorrectAttestationToUndated,
  incorrectDateContextToUnresolved: ops.incorrectDateContextToUnresolved,
  researchBlockedRegnalRetained: ops.researchBlockedRegnalRetained,
  researchBlockedToSourceUnresolved: ops.researchBlockedToSourceUnresolved,
  hintsCleared: ops.hintsCleared,
  hintsKeptSupported: ops.hintsKeptSupported,
});

console.log(
  JSON.stringify(
    {
      curatedExtractionHash: datePacket.extractionHash,
      sourceHash: datePacket.sourceHash,
      groups: receipt.groups,
      validation: receipt.validation,
      people: compact.people.length,
      outDir,
    },
    null,
    2,
  ),
);
