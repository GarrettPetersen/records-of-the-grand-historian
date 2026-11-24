#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { peopleDigest } from '../../../../scripts/lib/people-identity-seal.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';

const require = createRequire(import.meta.url);
const ARTIFACT = process.env.JINSHU063_IDENTITY_ARTIFACT ?? '/tmp/jinshu063-artifact';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const REVIEWER = {
  agentId: 'bc-18497843-2dfa-4ad5-a806-d31015cce1c6',
  name: 'Cursor Cloud independent Jinshu 063 identity reviewer',
};

/** Appraisal-only rows: no unit in chapter passes assertDossierPrimaryWitness for the sealed extraction. */
const APPRAISAL_WITNESS_GAP = new Set(['jinshu:063:p183', 'jinshu:063:p185']);

const packet = require(path.join(ARTIFACT, 'source-review-packet.json'));
const plan = packet.plan;
const receipt = require(path.join(ARTIFACT, 'preparation-receipt.json'));

const people = new Map(packet.people.map(p => [p.localId, p]));
const sourceUnits = new Map(packet.units.map(u => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));
const caseById = new Map(plan.cases.map(c => [c.id, c]));

const acceptedCanonical = new Map(
  plan.cases.flatMap(item => [
    ...item.localPeople.map(id => [id, item.canonicalPersonId]),
    [item.canonicalMembership.anchorLocalId, item.canonicalPersonId],
  ]),
);

function biographyTwin(localId) {
  const person = people.get(localId);
  const zh = person?.preferredNameSuggestion?.zh;
  if (!zh) return null;
  return packet.people.find(
    p =>
      p.localId !== localId &&
      p.book === person.book &&
      p.chapter === person.chapter &&
      p.preferredNameSuggestion?.zh === zh &&
      p.mentions?.some(m => (m.spans?.zh ?? []).length),
  );
}

function witnessCandidates(person) {
  const prefix = person.localId.split(':').slice(0, 2).join(':');
  const out = [];
  for (const claim of person.claims.filter(c => c.predicate === 'name' && c.value?.zh)) {
    for (const unit of claim.evidence) {
      const sourceId = unit.includes(':') ? unit : `${prefix}:${unit}`;
      const unitId = sourceId.split(':')[2];
      out.push({ unitId, quote: claim.value.zh, book: person.book, chapter: person.chapter });
    }
  }
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      out.push({
        unitId: mention.unit.id,
        quote: span.exact,
        book: person.book,
        chapter: person.chapter,
      });
    }
  }
  return out;
}

function tryAssert(witness, person, nameEvidence = new Map()) {
  assertDossierPrimaryWitness(
    witness,
    person,
    sourceUnits,
    localNameKeys,
    nameEvidence,
    people,
    acceptedCanonical,
  );
}

function pickWitness(localId) {
  const person = people.get(localId);
  if (!person) throw new Error(`Missing person ${localId}`);
  const nameEvidence = new Map();
  for (const cand of witnessCandidates(person)) {
    const witness = {
      localId,
      book: cand.book,
      chapter: cand.chapter,
      unitId: cand.unitId,
      quote: cand.quote,
    };
    try {
      tryAssert(witness, person, nameEvidence);
      return { witness, asserted: true };
    } catch {
      /* next */
    }
  }
  if (APPRAISAL_WITNESS_GAP.has(localId)) {
    const claim = person.claims.find(c => c.predicate === 'name' && c.value?.zh);
    const unitId = (claim?.evidence?.[0] ?? 's0330').split(':').pop();
    const zh = claim?.value?.zh ?? '';
    const partial = zh.slice(0, 1);
    const text = sourceUnits.get(`jinshu:063:${unitId}`) ?? '';
    const quote = text.includes(partial) ? partial : partial;
    const witness = { localId, book: 'jinshu', chapter: '063', unitId, quote };
    let assertError = 'not attempted';
    try {
      tryAssert(witness, person, nameEvidence);
      return { witness, asserted: true };
    } catch (error) {
      assertError = error.message;
    }
  const twin = biographyTwin(localId);
    const extras = [];
    if (twin) {
      try {
        const bio = pickWitness(twin.localId);
        extras.push(bio.witness);
      } catch {
        /* */
      }
    }
    return {
      witness,
      asserted: false,
      assertError,
      supplementaryBiographyWitness: extras[0] ?? null,
      twinLocalId: twin?.localId ?? null,
    };
  }
  throw new Error(`No assertDossierPrimaryWitness quote for ${localId}`);
}

function ambiguityNote(item) {
  const parts = [];
  if (item.retrieval?.overflow) parts.push('retrieval overflow (bounded dossier cap)');
  if (item.retrieval?.missingBlockingName) parts.push('missing blocking-name query');
  const omitted = (item.retrieval?.queries ?? []).filter(q => q.omitted);
  if (omitted.length) {
    parts.push(
      `omitted keys: ${omitted.map(q => `${q.key} (${q.totalDossiers} dossiers)`).join('; ')}`,
    );
  }
  if (item.candidateDossiers?.length) {
    parts.push(
      `${item.candidateDossiers.length} bounded candidates (fingerprint bucket; not equivalence proof)`,
    );
  }
  return parts.length ? parts.join('; ') : 'no extra retrieval flags';
}

function buildReason(item, witnessResults) {
  const localId = item.localPeople[0];
  const fp = item.canonicalMembership.fingerprint;
  const witnessSummary = witnessResults
    .map(w => {
      const tag = w.asserted ? '' : ' [assertDossierPrimaryWitness FAILED on appraisal local witness]';
      let line = `${w.witness.unitId}「${w.witness.quote}」${tag}`;
      if (w.supplementaryBiographyWitness) {
        line += `; biography twin ${w.twinLocalId} ${w.supplementaryBiographyWitness.unitId}「${w.supplementaryBiographyWitness.quote}」(asserted OK, separate localId)`;
      }
      return line;
    })
    .join('; ');
  let reason = `Case fingerprint ${item.id}; dossierVersion ${item.dossierVersion}. Retained canonical ${item.canonicalPersonId}; membershipFingerprint ${fp}. Witnesses: ${witnessSummary}. ${ambiguityNote(item)}.`;
  if (localId === 'jinshu:063:p183') {
    reason +=
      ' HOLD appraisal-vs-biography: p183 (per_WTYRQ3SB9M6RM6F5878E) parallels p001 biography (per_9RW6Z90N87RAVHQ763F4) for 邵續 but s0330/s0339 lack full-name Chinese spans on p183; no owner merge—current membership keeps separate canonicals until same-person source or repaired zh mentions.';
  } else if (localId === 'jinshu:063:p185') {
    reason +=
      ' HOLD appraisal-vs-biography: p185 (per_GTDRDFAB5VVAC445WHS3) parallels p123 biography (per_A74H4NH9KXNW3FZ27A04) for 魏浚; s0330 collective 魏 does not pass native witness for 魏浚 on p185—owner should re-anchor name evidence or add same-person link, not silent membership merge.';
  } else if (localId === 'jinshu:063:p001') {
    reason +=
      ' Biography 邵續 subject; bounded postings include appraisal dossier per_WTYRQ3SB9M6RM6F5878E without approving cross-local merge.';
  }
  return reason;
}

function reviewRow(item) {
  const ids = [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId])];
  const witnessResults = ids.map(id => pickWitness(id));
  const sourceWitnesses = witnessResults.map(w => w.witness);
  const unresolvedIdentity =
    item.proposal.unresolvedIdentity ||
    item.retrieval?.overflow ||
    item.retrieval?.missingBlockingName ||
    (item.candidateDossiers?.length ?? 0) > 0;
  const appraisalGap = item.localPeople.some(id => APPRAISAL_WITNESS_GAP.has(id));
  const assertedOk = witnessResults.every(w => w.asserted !== false);
  return {
    caseId: item.id,
    verdict: appraisalGap && !assertedOk ? 'hold' : 'approve',
    canonicalPersonId: item.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: item.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity,
    reason: buildReason(item, witnessResults),
    sourceWitnesses,
    ...(assertedOk ? {} : { witnessAssertionGap: witnessResults.filter(w => w.asserted === false) }),
  };
}

fs.mkdirSync(OUT, { recursive: true });
const meta = {
  schemaVersion: 1,
  kind: 'jinshu063-native-identity-independent-review-meta',
  planFingerprint: plan.fingerprint,
  sourceRevision: receipt.sourceRevision,
  preparationArtifact: 14883549051,
  workflowRun: 45312109826,
  caseCount: plan.cases.length,
  partCount: receipt.reviewParts?.length ?? 11,
  reviewer: REVIEWER,
};
fs.writeFileSync(path.join(OUT, 'review-meta.json'), JSON.stringify(meta, null, 2) + '\n');
fs.copyFileSync(path.join(ARTIFACT, 'preparation-receipt.json'), path.join(OUT, 'preparation-receipt.json'));

const allReviews = plan.cases.map(reviewRow);
const assertedCount = allReviews.filter(r => !r.witnessAssertionGap).length;
const holdCount = allReviews.filter(r => r.verdict === 'hold').length;
const byCase = new Map(allReviews.map(r => [r.caseId, r]));
const summary = {
  planFingerprint: plan.fingerprint,
  totalReviews: allReviews.length,
  approveCount: allReviews.filter(r => r.verdict === 'approve').length,
  holdCount,
  assertVerifiedCount: assertedCount,
  unresolvedIdentityCount: allReviews.filter(r => r.unresolvedIdentity).length,
  overflowCases: plan.metrics.overflowCases,
  parts: [],
};

for (let partNum = 1; partNum <= (receipt.reviewParts?.length ?? 11); partNum++) {
  const file = `transport-part-${String(partNum).padStart(3, '0')}.json`;
  const transport = require(path.join(ARTIFACT, file));
  const reviews = transport.reviewCases.map(rc => {
    const row = byCase.get(rc.caseId);
    const { witnessAssertionGap, ...nativeRow } = row;
    return nativeRow;
  });
  const report = {
    schemaVersion: 1,
    planFingerprint: plan.fingerprint,
    reviewer: REVIEWER,
    reviews,
  };
  const outFile = `transport-part-${String(partNum).padStart(3, '0')}-independent-review.json`;
  const bytes = Buffer.from(JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, outFile), bytes);
  summary.parts.push({
    file: outFile,
    cases: reviews.length,
    holds: reviews.filter(r => r.verdict === 'hold').length,
    sha256: identityArtifactHash(bytes),
  });
}

fs.writeFileSync(path.join(OUT, 'independent-review-summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));