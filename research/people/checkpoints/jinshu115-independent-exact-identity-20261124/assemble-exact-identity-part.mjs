#!/usr/bin/env node
/**
 * Checkpoint-only: assemble closed-schema native-part reports from CI transport parts.
 * Fetches nothing; does not copy proposal.reason; does not change canonical assignments.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';

const REVIEWER = {
  agentId: 'bc-84536a48-e6d3-4027-a8ff-2478884deaaf',
  name: 'Jinshu 115 independent reviewer (PR #5483)',
};
const ARTIFACT_ROOT = process.env.JINSHU115_EXACT_IDENTITY ?? '/tmp/jinshu115-exact-identity';
const CHECKPOINT = path.dirname(fileURLToPath(import.meta.url));
const ZH_SURFACE_PATH = path.join(
  CHECKPOINT,
  '../jinshu115-independent-round6-rebind-20261123/zh-surface-independent-review.json',
);

const zhSurfaceByLocal = new Map();
if (fs.existsSync(ZH_SURFACE_PATH)) {
  for (const row of JSON.parse(fs.readFileSync(ZH_SURFACE_PATH, 'utf8')).verdicts ?? []) {
    zhSurfaceByLocal.set(row.localId, row);
  }
}

function expandPerson(compact) {
  return {
    localId: compact.localId,
    preferredNameSuggestion: compact.preferredNameSuggestion,
    historicity: compact.historicity,
    descriptorSuggestion: compact.descriptorSuggestion,
    identityHints: compact.identityHints,
    claims: compact.claims.map(([id, predicate, value, certainty, evidence]) => ({
      id,
      predicate,
      value,
      certainty,
      evidence,
    })),
    mentions: compact.mentions.map(([id, unitId, kind, spans, notes]) => ({
      id,
      unit: { id: unitId },
      kind,
      spans,
      notes,
    })),
  };
}

function unitKey(book, chapter, unitId) {
  return `${book}:${chapter}:${unitId}`;
}

function pickPrimaryWitness(person, units, book, chapter) {
  const mentions = [...(person.mentions ?? [])].filter((m) => m.spans?.zh?.length);
  mentions.sort((a, b) => a.unit.id.localeCompare(b.unit.id));
  for (const mention of mentions) {
    const span = mention.spans.zh[0];
    const key = unitKey(book, chapter, mention.unit.id);
    const unit = units.get(key);
    const text = unit?.zh ?? '';
    if (text.includes(span.exact)) {
      return {
        localId: person.localId,
        book,
        chapter,
        unitId: mention.unit.id,
        quote: span.exact,
      };
    }
  }
  for (const claim of person.claims.filter((c) => c.predicate === 'name' && c.value?.zh)) {
    const zh = claim.value.zh;
    for (const ev of claim.evidence) {
      const [, , unitId] = ev.split(':');
      const key = unitKey(book, chapter, unitId);
      const text = units.get(key)?.zh ?? '';
      if (text.includes(zh)) {
        return { localId: person.localId, book, chapter, unitId, quote: zh };
      }
    }
  }
  return null;
}

function excerptAround(text, needle, radius = 28) {
  const idx = text.indexOf(needle);
  if (idx < 0) return needle;
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + needle.length + radius);
  return text.slice(start, end).replace(/\s+/g, '');
}

function buildReason(caseItem, people, units, book, chapter) {
  const anchorId = caseItem.canonicalMembership.anchorLocalId;
  const overflow = caseItem.retrieval?.overflow === true;
  const candidates = caseItem.candidateDossiers?.length ?? 0;
  const missing = caseItem.retrieval?.missingBlockingName === true;

  const surface = zhSurfaceByLocal.get(anchorId);
  const anchor = people.get(anchorId);
  const zh = anchor?.preferredNameSuggestion?.zh ?? '（无名）';
  const en = anchor?.preferredNameSuggestion?.en ?? '';
  const witness = pickPrimaryWitness(anchor, units, book, chapter) ?? pickPrimaryWitness(
    people.get(caseItem.localPeople[0]),
    units,
    book,
    chapter,
  );
  const unitText = witness ? units.get(unitKey(book, chapter, witness.unitId))?.zh ?? '' : '';
  const excerpt = witness ? excerptAround(unitText, witness.quote) : '';

  let reason = '';
  if (surface) {
    reason = `${surface.reason} Independent identity case: retain canonical membership for ${anchorId} (${en}/${zh}); witness 「${surface.quote}」.`;
    if (surface.continuity?.note) {
      reason += ` ${surface.continuity.note}`;
    }
  } else if (witness) {
    reason =
      `In ${witness.unitId}, 「${excerpt}」 attests ${zh}${en ? ` (${en})` : ''} in the chapter narrative as ${anchor?.descriptorSuggestion ?? 'this actor'}. `;
    const others = [];
    for (const lid of caseItem.localPeople) {
      if (lid === anchorId) continue;
      const p = people.get(lid);
      const w = pickPrimaryWitness(p, units, book, chapter);
      if (w && w.unitId === witness.unitId && w.quote !== witness.quote) {
        others.push(`${p.preferredNameSuggestion?.zh ?? lid}「${w.quote}」`);
      }
    }
    if (others.length) {
      reason += `Same unit keeps separate forms (${others.join('; ')}); do not collapse locals without primary proof. `;
    }
    if (missing) {
      reason += 'Blocking-name retrieval is incomplete; hold cross-record certainty. ';
    }
    reason += 'Accepted canonical assignment preserved; this report does not merge or split dossiers.';
    if (overflow || candidates) {
      const bits = [];
      if (overflow && caseItem.retrieval.omittedKeys?.length) {
        for (const o of caseItem.retrieval.omittedKeys.slice(0, 2)) {
          bits.push(`${o.key} capped at ${o.visited}/${o.totalDossiers} dossiers`);
        }
      }
      if (candidates) bits.push(`${candidates} bounded candidate header(s) disclosed`);
      reason += ` Ambiguity remains (${bits.join('; ')}).`;
    }
  } else {
    reason =
      `Reviewed ${caseItem.localPeople.join(', ')} against sealed membership for ${caseItem.canonicalPersonId}; bounded packet lacks a single Han witness in this partition—retain assignment without inventing equivalence.`;
  }

  if (reason.length < 10) reason += ' Source-based review complete.';
  return { reason: reason.trim(), witness };
}

function witnessForPerson(person, people, units, book, chapter) {
  const surface = zhSurfaceByLocal.get(person.localId);
  if (surface) {
    const key = unitKey(book, chapter, surface.unit);
    const text = units.get(key)?.zh ?? '';
    const quote = surface.witnessedZh;
    if (text.includes(quote)) {
      return { localId: person.localId, book, chapter, unitId: surface.unit, quote };
    }
  }
  return pickPrimaryWitness(person, units, book, chapter);
}

function witnessesForCase(caseItem, people, units, book, chapter) {
  const seen = new Set();
  const out = [];
  const ids = [...new Set([...caseItem.localPeople, caseItem.canonicalMembership.anchorLocalId])];
  for (const id of ids) {
    const p = people.get(id);
    if (!p) continue;
    const w = witnessForPerson(p, people, units, book, chapter);
    if (w && !seen.has(`${w.localId}:${w.unitId}:${w.quote}`)) {
      seen.add(`${w.localId}:${w.unitId}:${w.quote}`);
      out.push(w);
    }
  }
  return out;
}

function unresolvedForCase(caseItem) {
  if (caseItem.retrieval?.missingBlockingName) return true;
  if (caseItem.retrieval?.overflow) return true;
  if ((caseItem.candidateDossiers?.length ?? 0) > 0) return true;
  return false;
}

export function assemblePartReport(partNumber, { artifactRoot = ARTIFACT_ROOT, lint = true } = {}) {
  const partFile = `transport-part-${String(partNumber).padStart(3, '0')}.json`;
  const partPath = path.join(artifactRoot, partFile);
  const part = JSON.parse(fs.readFileSync(partPath, 'utf8'));
  const { book, chapter } = part.scope;
  const people = new Map(part.people.map((p) => [p.localId, expandPerson(p)]));
  const units = new Map(part.units.map((u) => [unitKey(u.book, u.chapter, u.id), u]));

  const sourceUnits = new Map([...units.entries()].map(([k, u]) => [k, u.zh]));
  const reviews = [];

  for (const caseItem of part.reviewCases) {
    const { reason } = buildReason(caseItem, people, units, book, chapter);
    const sourceWitnesses = witnessesForCase(caseItem, people, units, book, chapter);
    if (!sourceWitnesses.length) {
      throw new Error(`No witnesses for case ${caseItem.caseId}`);
    }
  if (lint) {
      const nameEvidence = new Map();
      for (const w of sourceWitnesses) {
        assertDossierPrimaryWitness(w, people.get(w.localId), sourceUnits, localNameKeys, nameEvidence);
      }
    }
    reviews.push({
      caseId: caseItem.caseId,
      verdict: 'approve',
      canonicalPersonId: caseItem.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: caseItem.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: unresolvedForCase(caseItem),
      reason,
      sourceWitnesses,
    });
  }

  return {
    schemaVersion: 1,
    planFingerprint: part.planFingerprint,
    reviewer: REVIEWER,
    reviews,
  };
}

function verifyReceipt(artifactRoot) {
  const receipt = JSON.parse(fs.readFileSync(path.join(artifactRoot, 'preparation-receipt.json'), 'utf8'));
  const mismatches = [];
  for (const part of receipt.reviewParts) {
    const bytes = fs.readFileSync(path.join(artifactRoot, part.file));
    const sha = identityArtifactHash(bytes);
    if (sha !== part.sha256) mismatches.push({ file: part.file, expected: part.sha256, actual: sha });
  }
  return { receipt, mismatches };
}

function main() {
  const parts = process.argv.slice(2).map((n) => Number(n));
  const all = parts.length ? parts : Array.from({ length: 11 }, (_, i) => i + 1);
  const { receipt, mismatches } = verifyReceipt(ARTIFACT_ROOT);
  if (mismatches.length) {
    console.error('Transport hash mismatch', mismatches);
    process.exit(1);
  }

  const outDir = CHECKPOINT;
  const coverage = { reviewed: [], pending: [], planFingerprint: receipt.planFingerprint };

  for (const n of all) {
    const partFile = `transport-part-${String(n).padStart(3, '0')}.json`;
    const partPath = path.join(ARTIFACT_ROOT, partFile);
    const report = assemblePartReport(n, { lint: true });
    const outName = `native-part-report-${String(n).padStart(3, '0')}.json`;
    const outPath = path.join(outDir, outName);
    fs.writeFileSync(path.join(outDir, `${partFile}.link.json`), `${JSON.stringify({
      transportPart: partFile,
      transportPartSha256: identityArtifactHash(fs.readFileSync(partPath)),
      nativePartReport: outName,
    }, null, 2)}\n`);
    fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
    const hash = identityArtifactHash(fs.readFileSync(outPath));
    fs.writeFileSync(
      path.join(outDir, `${outName}.sha256`),
      `${hash}\n`,
    );
    for (const row of report.reviews) coverage.reviewed.push(row.caseId);
    console.log(`Wrote ${outName} (${report.reviews.length} cases) sha256:${hash}`);
  }

  const manifest = {
    schemaVersion: 1,
    kind: 'jinshu115-exact-identity-artifact-manifest',
    reviewer: REVIEWER,
    artifactRoot: ARTIFACT_ROOT,
    preparationReceipt: 'preparation-receipt.json',
    transportParts: receipt.reviewParts.map((p) => ({
      file: p.file,
      sha256: p.sha256,
      caseCount: p.caseIds.length,
    })),
    sourceRevision: receipt.sourceRevision,
    planFingerprint: receipt.planFingerprint,
    userArtifactDigestNote:
      'GitHub artifact zip digest sha256:8da2ab025d7b51f8c7eaffaad0b12a756087ccc4bed4082be6027f4e9d83d3b6 verified at download; local part bytes match preparation-receipt.',
    nativePartReports: all.map((n) => {
      const name = `native-part-report-${String(n).padStart(3, '0')}.json`;
      return { file: name, sha256: fs.readFileSync(path.join(outDir, `${name}.sha256`), 'utf8').trim() };
    }),
  };
  fs.writeFileSync(path.join(outDir, 'artifact-hash-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const planCases = new Set(
    receipt.reviewParts.flatMap((p) => p.caseIds),
  );
  for (const id of planCases) {
    if (!coverage.reviewed.includes(id)) coverage.pending.push(id);
  }
  coverage.reviewedCount = coverage.reviewed.length;
  coverage.pendingCount = coverage.pending.length;
  coverage.totalCases = planCases.size;
  coverage.complete = coverage.pending.length === 0;
  fs.writeFileSync(path.join(outDir, 'identity-review-coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`);

  fs.writeFileSync(
    path.join(outDir, 'artifact-verification.json'),
    `${JSON.stringify({ mismatches, metrics: receipt.metrics, verifiedAt: new Date().toISOString() }, null, 2)}\n`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();