#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PLAN = 'sha256:bab94742b782991ae226bd516a959cdc67e19bb1199776a56348727d87a7ae5a';
const REVIEWER = {
  agentId: 'bc-ca56fb16-d4fd-4ced-a2fb-3640376ab1df',
  name: 'Independent Jinshu 020 identity reviewer (bc-ca56fb16)',
};
const WITNESS_PLAN = process.env.JINSHU020_WITNESS_PLAN || '/opt/cursor/artifacts/jinshu020-identity-parts005-008-witness-plan.json';

function loadPart(n) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, `transport-part-${String(n).padStart(3, '0')}.json`), 'utf8'));
}

function reasonFor(row, reviewCase) {
  if (row.verdictRecommendation === 'hold') return row.holdReason;
  const loc = row.localPeople.map((id) => id.split(':').pop()).join(', ');
  if (row.unresolvedIdentity === false) {
    return `Source cites individuating Chinese for ${loc} on owned units (e.g. ${row.witnesses[0]?.unitId}); this bounded case has no overflow dossiers in the sealed packet. Retain canonical membership without asserting broader same-name merges.`;
  }
  return `Primary Chinese on cited jinshu 020 (and anchor chapter where present) supports retained canonical assignment for ${loc}. Bounded overflow dossiers and cross-chapter homonyms remain unresolvedIdentity, not separation evidence.`;
}

function rowFromPlan(row, reviewCase) {
  const base = {
    caseId: row.caseId,
    verdict: row.verdictRecommendation === 'hold' ? 'hold' : 'approve',
    canonicalPersonId: reviewCase.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: reviewCase.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: row.verdictRecommendation === 'hold' ? true : row.unresolvedIdentity,
    reason: reasonFor(row, reviewCase),
    sourceWitnesses:
      row.verdictRecommendation === 'hold'
        ? []
        : row.witnesses.map((w) => ({
            localId: w.localId,
            book: w.book,
            chapter: w.chapter,
            unitId: w.unitId,
            quote: w.quote,
          })),
  };
  if (base.reason.length < 10) throw new Error(`Reason too short ${row.caseId}`);
  return base;
}

const witnessRows = JSON.parse(fs.readFileSync(WITNESS_PLAN, 'utf8'));
for (let part = 5; part <= 8; part++) {
  const transport = loadPart(part);
  const byCase = new Map(transport.reviewCases.map((c) => [c.caseId, c]));
  const partRows = witnessRows.filter((r) => r.part === part);
  const expected = transport.reviewCases.map((c) => c.caseId).sort();
  const actual = partRows.map((r) => r.caseId).sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error(`Part ${part} case ownership mismatch`);
  }
  const reviews = partRows.map((r) => rowFromPlan(r, byCase.get(r.caseId)));
  const out = { schemaVersion: 1, planFingerprint: PLAN, reviewer: REVIEWER, reviews };
  const file = path.join(ROOT, `independent-review-part-${String(part).padStart(3, '0')}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  const approve = reviews.filter((r) => r.verdict === 'approve').length;
  const hold = reviews.filter((r) => r.verdict === 'hold').length;
  console.log(file, 'reviews', reviews.length, 'approve', approve, 'hold', hold);
}