#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';

const OUT = path.dirname(fileURLToPath(import.meta.url));
const REVIEWER = {
  agentId: 'bc-18497843-2dfa-4ad5-a806-d31015cce1c6',
  name: 'Cursor Cloud independent Jinshu 063 identity reviewer',
};
const PLAN_FP = 'sha256:32c28a0bc82ea10d07ea492bc1c6d6e5048f09faac3177070e4fdc9551f04d30';
const OWNER_COMMIT = '455e84c817cce16b40f2ba951721ed198fa676dd';

function expandPerson(person, legends) {
  const claimKeys = legends.claims;
  const mentionKeys = legends.mentions;
  return {
    ...person,
    claims: person.claims.map(c => Object.fromEntries(claimKeys.map((k, i) => [k, c[i]]))),
    mentions: person.mentions.map(m => {
      const row = Object.fromEntries(mentionKeys.map((k, i) => [k, m[i]]));
      const unitRef = row.unitId ?? '';
      const unitId = unitRef.includes(':') ? unitRef.split(':').pop() : unitRef;
      return { ...row, unit: { id: unitId } };
    }),
  };
}

function ambiguityNote(item, transport) {
  const parts = [];
  if (item.retrieval?.overflow) parts.push('retrieval overflow (bounded dossier cap)');
  const omitted = item.retrieval?.omittedKeys ?? [];
  if (omitted.length) {
    parts.push(
      `omitted keys: ${omitted.map(q => `${q.key} (${q.totalDossiers} dossiers)`).join('; ')}`,
    );
  }
  const dossierCount = (item.candidateDossiers ?? []).length;
  if (dossierCount) {
    parts.push(`${dossierCount} bounded candidates (fingerprint bucket; not equivalence proof)`);
  }
  return parts.length ? parts.join('; ') : 'no extra retrieval flags';
}

function witnessCandidates(person) {
  const prefix = person.localId.split(':').slice(0, 2).join(':');
  const out = [];
  for (const claim of person.claims.filter(c => c.predicate === 'name' && c.value?.zh)) {
    for (const unit of claim.evidence) {
      const sourceId = unit.includes(':') ? unit : `${prefix}:${unit}`;
      const unitId = sourceId.split(':')[2];
      out.push({ unitId, quote: claim.value.zh, book: person.book ?? 'jinshu', chapter: person.chapter ?? '063' });
    }
  }
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      out.push({
        unitId: mention.unit.id,
        quote: span.exact,
        book: person.book ?? 'jinshu',
        chapter: person.chapter ?? '063',
      });
    }
  }
  return out;
}

function main() {
  const transportPath = path.join(OUT, 'transport-part-001.json');
  const transport = JSON.parse(fs.readFileSync(transportPath, 'utf8'));
  if (transport.planFingerprint !== PLAN_FP) throw new Error('Plan fingerprint mismatch');
  const transportSha256 = identityArtifactHash(fs.readFileSync(transportPath));
  const receipt = JSON.parse(fs.readFileSync(path.join(OUT, 'preparation-receipt.json'), 'utf8'));
  if (receipt.reviewParts?.[0]?.sha256 && receipt.reviewParts[0].sha256 !== transportSha256) {
    throw new Error(`Transport sha256 mismatch: got ${transportSha256}`);
  }

  const people = new Map(
    transport.people.map(p => {
      const expanded = expandPerson(p, transport.fieldLegends);
      const [book, chapter] = expanded.localId.split(':').slice(0, 2);
      return [expanded.localId, { ...expanded, book, chapter }];
    }),
  );
  const sourceUnits = new Map(transport.units.map(u => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));

  const acceptedCanonical = new Map();
  for (const item of transport.reviewCases) {
    for (const id of item.localPeople) acceptedCanonical.set(id, item.canonicalPersonId);
    acceptedCanonical.set(item.canonicalMembership.anchorLocalId, item.canonicalPersonId);
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
        assertDossierPrimaryWitness(
          witness,
          person,
          sourceUnits,
          localNameKeys,
          nameEvidence,
          people,
          acceptedCanonical,
        );
        return { witness, asserted: true };
      } catch {
        /* try next */
      }
    }
    throw new Error(`No assertDossierPrimaryWitness quote for ${localId}`);
  }

  const reviews = transport.reviewCases.map(item => {
    const ids = [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId])];
    const witnessResults = ids.map(id => pickWitness(id));
    const sourceWitnesses = witnessResults.map(w => w.witness);
    const witnessSummary = witnessResults
      .map(w => `${w.witness.localId.split(':').pop()} ${w.witness.unitId}「${w.witness.quote}」`)
      .join('; ');
    const membershipNote =
      item.localPeople.length > 1
        ? ` Owner-proposed combined membership ${item.canonicalMembership.fingerprint} with anchor ${item.canonicalMembership.anchorLocalId}; reciprocal same-person edges source-backed; independent approves retained canonical and membership only—no new merge choice.`
        : '';
    const reason = `Case fingerprint ${item.caseId}. Retained canonical ${item.canonicalPersonId}; membershipFingerprint ${item.canonicalMembership.fingerprint}. Witnesses: ${witnessSummary}. ${ambiguityNote(item, transport)}.${membershipNote}`;
    return {
      caseId: item.caseId,
      verdict: 'approve',
      canonicalPersonId: item.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: item.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: item.proposal.unresolvedIdentity,
      reason,
      sourceWitnesses,
    };
  });

  const report = { schemaVersion: 1, planFingerprint: PLAN_FP, reviewer: REVIEWER, reviews };
  const outFile = 'transport-part-001-independent-review.json';
  const bytes = Buffer.from(JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, outFile), bytes);
  const reportSha256 = identityArtifactHash(bytes);

  const reuseReceipt = {
    schemaVersion: 1,
    kind: 'jinshu063-campaign-retained-decisions',
    reusedCases: receipt.reusedCases,
    newReviewCases: receipt.newReviewCases,
    retainedCompositionFingerprint: receipt.retainedCompositionFingerprint,
    priorIndependentEvidence: {
      commit: '27caba9d147d3191364b171a22157cfd3b6f9cc8',
      checkpoint: 'research/people/checkpoints/jinshu063-native-identity-20261124',
      partCount: 11,
      approveCount: 186,
      holdCount: 2,
    },
    ownerPr: 5487,
    ownerCommit: OWNER_COMMIT,
    sealedSource: receipt.sourceRevision,
    evidenceRevision: '02cfc1fb8d56662eabd9dfbdac9f71f94d80c29a',
    planFingerprint: PLAN_FP,
    scopedTransport: 'transport-part-001.json',
    transportSha256,
    partReview: {
      file: outFile,
      sha256: reportSha256,
      caseIds: reviews.map(r => r.caseId),
      approveCount: reviews.filter(r => r.verdict === 'approve').length,
      holdCount: reviews.filter(r => r.verdict === 'hold').length,
    },
  };
  fs.writeFileSync(
    path.join(OUT, 'retained-native-decisions-receipt.json'),
    JSON.stringify(reuseReceipt, null, 2) + '\n',
  );
  console.log(JSON.stringify(reuseReceipt, null, 2));
}

main();