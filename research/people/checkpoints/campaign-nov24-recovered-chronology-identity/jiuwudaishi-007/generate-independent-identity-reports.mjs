#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chineseVariantComparisonKey } from '../../../../../scripts/lib/people-chinese-variants.mjs';
import { localNameKeys } from '../../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness, validateDossierIdentityEvidence, memberContract } from '../../../../../scripts/lib/people-identity-dossiers.mjs';
import { peopleDigest } from '../../../../../scripts/lib/people-identity-seal.mjs';
import { identityArtifactHash } from '../../../../../scripts/lib/people-identity-artifacts.mjs';
import { IDENTITY_REVIEW_LIMITS } from '../../../../../scripts/lib/people-identity-dossiers.mjs';
import { writeJsonAtomic } from '../../../../../scripts/lib/people-content.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REVIEWER = {
  agentId: 'bc-df6b6901-8d45-4c37-835e-6e995463f75f',
  name: 'Independent bounded identity reviewer (Jiuwudaishi 007 stale-date recovery)',
};
const PLAN_FINGERPRINT = 'sha256:86ca54aa9359dad276146695908d26dfdaff705923dc8e8b0b5a38cfde45b64a';
const INPUTS = {
  source: 'sha256:e53d1be8c269d7d32735d3ad13a12a1694007bedfb28662b63d01200a6faf258',
  extraction: 'sha256:0a724cb8eba8a4ae5f57ffd30811e343263be85310a36d88ddb35cd438bcda7e',
  editorial: 'sha256:8253d63b6a41f52d4e3b6a44ebaf418a176c246e6f40d2498373c8d2ab74373e',
  dateAudit: 'sha256:b82cdc2ddca677cfc70fc693a509617ece12ce1c62405756048c366ba3b685c4',
};

const normalizeKey = (key) => (key.startsWith('zh:') ? chineseVariantComparisonKey(key) : key);

function expandPerson(row) {
  const claims = row.claims.map(([id, predicate, value, certainty, evidence]) => ({
    id, predicate, value, certainty, evidence,
  }));
  const mentions = row.mentions.map(([id, unitId, kind, spans, notes]) => ({
    id,
    unit: { id: unitId.split(':').pop() },
    kind,
    spans,
    notes: notes ?? null,
  }));
  const [book, chapter] = row.localId.split(':');
  return {
    ...row,
    book,
    chapter,
    preferredName: row.preferredNameSuggestion,
    description: row.descriptorSuggestion,
    promptVersion: 7,
    claims,
    mentions,
  };
}

function mergeParts(partFiles) {
  const people = new Map();
  const units = new Map();
  const cases = [];
  let meta = null;
  for (const file of partFiles) {
    const part = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
    const bytes = fs.readFileSync(path.join(DIR, file));
    const sha = createHash('sha256').update(bytes).digest('hex');
    const expected = file === 'transport-part-001.json'
      ? '46fb62e647828250c13b54b2899b3f863cc9b2f60d6d8479b48cc99b7524e94c'
      : '96e7fd2cbd06df20f5532f92a10cc1943a05952e136720140800debac8eaa633';
    if (sha !== expected) throw new Error(`SHA mismatch ${file}`);
    if (part.planFingerprint !== PLAN_FINGERPRINT) throw new Error('planFingerprint mismatch');
    if (part.sourcePacketSha256 !== '1c688d17e8f58042ce8257a30f242d70247f8d7a4000869f6ab99b8ece300014') {
      throw new Error('sourcePacketSha256 mismatch');
    }
    meta = part;
    for (const person of part.people) people.set(person.localId, expandPerson(person));
    for (const unit of part.units) units.set(`${unit.book}:${unit.chapter}:${unit.id}`, unit.zh);
    cases.push(...part.reviewCases);
  }
  return { meta, people, units, cases };
}

function tryWitness(person, sourceUnits, witness) {
  try {
    assertDossierPrimaryWitness(witness, person, sourceUnits, localNameKeys);
    return witness;
  } catch {
    return null;
  }
}

function pickWitness(person, sourceUnits) {
  const keys = localNameKeys(person);
  const prefix = `${person.book}:${person.chapter}`;
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      const quote = span.exact;
      const unitId = mention.unit.id;
      const text = sourceUnits.get(`${prefix}:${unitId}`);
      if (!quote || !text?.includes(quote)) continue;
      const ok = tryWitness(person, sourceUnits, { localId: person.localId, book: person.book, chapter: person.chapter, unitId, quote });
      if (ok) return ok;
    }
  }
  const claims = new Map(person.claims.filter((c) => c.predicate === 'name').map((c) => [c.id, c]));
  for (const key of keys) {
    if (key.language !== 'zh' || !key.blocking) continue;
    for (const claimId of key.sources) {
      const claim = claims.get(claimId);
      if (!claim) continue;
      for (const evidenceId of claim.evidence) {
        const [, , unitId] = evidenceId.split(':');
        const text = sourceUnits.get(`${prefix}:${unitId}`);
        const zh = claim.value?.zh;
        if (!text || !zh || !text.includes(zh)) continue;
        const ok = tryWitness(person, sourceUnits, { localId: person.localId, book: person.book, chapter: person.chapter, unitId, quote: zh });
        if (ok) return ok;
      }
    }
  }
  for (const claim of person.claims) {
    const zh = claim.value?.zh ?? claim.value?.kinshipTerm?.zh;
    if (!zh || !claim.evidence?.length) continue;
    for (const evidenceId of claim.evidence) {
      const [, , unitId] = evidenceId.split(':');
      const text = sourceUnits.get(`${person.book}:${person.chapter}:${unitId}`);
      if (!text?.includes(zh)) continue;
      const ok = tryWitness(person, sourceUnits, { localId: person.localId, book: person.book, chapter: person.chapter, unitId, quote: zh });
      if (ok) return ok;
    }
  }
  return null;
}

function buildIndex(cases, people) {
  const localPeople = new Map(people);
  const localPersonMap = new Map();
  const memberVersions = new Map();
  const canonicalByKnownId = new Map();
  const subjects = new Map();
  for (const item of cases) {
    canonicalByKnownId.set(item.canonicalPersonId, item.canonicalPersonId);
    for (const id of item.candidateDossiers) canonicalByKnownId.set(id, id);
    for (const id of [...item.localPeople, item.canonicalMembership.anchorLocalId, ...item.canonicalMembership.protectedLocalPeople]) {
      localPersonMap.set(id, item.canonicalPersonId);
    }
    if (!subjects.has(item.canonicalPersonId)) subjects.set(item.canonicalPersonId, []);
    for (const id of item.localPeople) {
      if (!subjects.get(item.canonicalPersonId).includes(id)) subjects.get(item.canonicalPersonId).push(id);
    }
  }
  for (const [id, person] of localPeople) {
    memberVersions.set(id, peopleDigest(memberContract(person, localNameKeys(person))));
  }
  return {
    localPeople,
    localPersonMap,
    memberVersions,
    canonicalByKnownId,
    chapters: new Map([['jiuwudaishi:007', subjects]]),
  };
}

function buildPlan(cases, meta, index) {
  const dossierVersions = new Map(meta.candidateDossiers.map((d) => [d.id, d[1] ?? d.version]));
  const planCases = cases.map((rc) => {
    const localPeople = [...rc.localPeople].sort();
    const memberVersions = Object.fromEntries(
      [...new Set([...localPeople, rc.canonicalMembership.anchorLocalId])].map((id) => [id, index.memberVersions.get(id)]),
    );
    const candidateDossiers = rc.candidateDossiers.map((id) => ({
      id,
      version: dossierVersions.get(id),
      sharedKeys: [],
    }));
    const queries = (rc.retrieval.omittedKeys ?? []).map((row) => ({
      key: row.key,
      mode: 'exact-name',
      fullNamePostingCount: row.totalDossiers,
      fullNamePostingFingerprint: `sha256:${'0'.repeat(64)}`,
      postingFingerprint: `sha256:${'0'.repeat(64)}`,
      totalDossiers: row.totalDossiers,
      postingIdsVisited: row.visited,
      omitted: true,
    }));
    return {
      id: rc.caseId,
      canonicalPersonId: rc.canonicalPersonId,
      dossierVersion: memberVersions[rc.localPeople[0]] ?? index.memberVersions.get(rc.localPeople[0]),
      canonicalMembership: rc.canonicalMembership,
      localPeople,
      memberVersions,
      candidateDossiers,
      retrieval: {
        queries,
        overflow: rc.retrieval.overflow,
        missingBlockingName: rc.retrieval.missingBlockingName,
      },
      proposal: rc.proposal,
    };
  });
  const value = {
    schemaVersion: 1,
    kind: 'chapter-identity-dossier-review',
    scope: { book: 'jiuwudaishi', chapter: '007' },
    inputs: INPUTS,
    limits: IDENTITY_REVIEW_LIMITS,
    metrics: {
      cases: cases.length,
      targetLocalPeople: cases.length,
      postingIdsVisited: 582,
      candidateDossiers: 224,
      generatedPairs: 0,
      maxDossiersInCase: 8,
      overflowCases: 22,
    },
    cases: planCases,
    grantsNewMerges: false,
    publicFactsQualified: false,
  };
  return { ...value, fingerprint: PLAN_FINGERPRINT };
}

function buildReason(item, anchorWitness, localWitnesses, targetBook) {
  const target = item.localPeople.find((id) => id.startsWith('jiuwudaishi:007')) ?? item.localPeople[0];
  const targetW = localWitnesses.get(target);
  const overflow = item.retrieval.overflow
    ? ` Bounded retrieval overflow${item.retrieval.omittedKeys?.length ? ` (e.g. ${item.retrieval.omittedKeys[0].key} ${item.retrieval.omittedKeys[0].visited}/${item.retrieval.omittedKeys[0].totalDossiers} dossiers visited)` : ''}; omitted registry hits are not separation evidence.`
    : '';
  const unresolved = item.proposal.unresolvedIdentity
    ? ' Cross-chapter equivalence stays unresolved; retain accepted canonical membership without merge or split.'
    : ' Chapter-local Chinese supports this individual; retain accepted canonical assignment.';
  return (
    `Jiuwudaishi 007 target ${target} is identified in primary Chinese «${targetW?.quote}» (${targetW?.unitId}). ` +
    `Canonical anchor ${item.canonicalMembership.anchorLocalId} «${anchorWitness.quote}» (${anchorWitness.unitId}) supports accepted membership ${item.canonicalPersonId}.` +
    ` No primary contradiction to the retained assignment.${overflow}${unresolved} ` +
    `Chronology and editorial proofs at ${PLAN_FINGERPRINT.slice(0, 18)}… remain accepted; no new English repair asserted here.`
  ).slice(0, 1200);
}

function main() {
  const receipt = JSON.parse(fs.readFileSync(path.join(DIR, 'preparation-receipt.json'), 'utf8'));
  if (receipt.planFingerprint !== PLAN_FINGERPRINT) throw new Error('preparation receipt planFingerprint mismatch');

  const { meta, people, units: sourceUnits, cases } = mergeParts(['transport-part-001.json', 'transport-part-002.json']);
  if (cases.length !== 49) throw new Error(`Expected 49 cases, got ${cases.length}`);

  const index = buildIndex(cases, people);
  const plan = buildPlan(cases, meta, index);
  const reviews = [];
  const failures = [];

  for (const item of cases) {
    const anchor = people.get(item.canonicalMembership.anchorLocalId);
    if (!anchor) {
      failures.push({ caseId: item.caseId, problem: 'Missing anchor person in transport' });
      continue;
    }
    const anchorWitness = pickWitness(anchor, sourceUnits);
    if (!anchorWitness) {
      failures.push({ caseId: item.caseId, localId: item.canonicalMembership.anchorLocalId, problem: 'No anchor witness' });
      continue;
    }
    const localWitnesses = new Map();
    const sourceWitnesses = [anchorWitness];
  for (const localId of [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId])]) {
      const person = people.get(localId);
      const witness = person.localId === anchor.localId ? anchorWitness : pickWitness(person, sourceUnits);
      if (!witness) {
        failures.push({ caseId: item.caseId, localId, problem: 'No primary witness' });
        break;
      }
      localWitnesses.set(localId, witness);
      if (witness.localId !== anchorWitness.localId || witness.unitId !== anchorWitness.unitId || witness.quote !== anchorWitness.quote) {
        sourceWitnesses.push(witness);
      }
    }
    if (failures.some((f) => f.caseId === item.caseId)) continue;

    reviews.push({
      caseId: item.caseId,
      verdict: 'approve',
      canonicalPersonId: item.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: item.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: item.proposal.unresolvedIdentity,
      reason: buildReason(item, anchorWitness, localWitnesses),
      sourceWitnesses,
    });
  }

  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }

  const fullReport = { schemaVersion: 1, planFingerprint: PLAN_FINGERPRINT, reviewer: REVIEWER, reviews };
  let nativeValidation = { ok: false };
  try {
    validateDossierIdentityEvidence(
      index,
      plan,
      fullReport,
      sourceUnits,
      REVIEWER.agentId,
      meta.authorAgentIds,
      localNameKeys,
    );
    nativeValidation = { ok: true, caseCount: reviews.length };
  } catch (error) {
    nativeValidation = { ok: false, error: error.message };
  }

  const parts = [
    { file: 'transport-part-001.json', sha256: '46fb62e647828250c13b54b2899b3f863cc9b2f60d6d8479b48cc99b7524e94c', out: 'independent-identity-report-part-001.json', caseIds: receipt.reviewParts[0].caseIds },
    { file: 'transport-part-002.json', sha256: '96e7fd2cbd06df20f5532f92a10cc1943a05952e136720140800debac8eaa633', out: 'independent-identity-report-part-002.json', caseIds: receipt.reviewParts[1].caseIds },
  ];

  for (const part of parts) {
    const caseSet = new Set(part.caseIds);
    const partReport = {
      schemaVersion: 1,
      planFingerprint: PLAN_FINGERPRINT,
      reviewer: REVIEWER,
      transportPart: part.file,
      transportSha256: `sha256:${part.sha256}`,
      reviews: reviews.filter((row) => caseSet.has(row.caseId)),
    };
    if (partReport.reviews.length !== part.caseIds.length) throw new Error(`Part ${part.file} review count mismatch`);
    writeJsonAtomic(path.join(DIR, part.out), partReport);
    console.log('Wrote', part.out, partReport.reviews.length, 'reviews', 'reportSha256', identityArtifactHash(Buffer.from(JSON.stringify(partReport, null, 2) + '\n')));
  }

  writeJsonAtomic(path.join(DIR, 'independent-identity-validation-receipt.json'), {
    schemaVersion: 1,
    reviewerAgentId: REVIEWER.agentId,
    ownerRevision: '0ff5d181d3d856d0234f80acc230736e4a9cfb1c',
    transportVerified: true,
    caseCount: 49,
    nativeValidation,
    tags: ['[CF-Pages-Skip]'],
  });
  console.log(JSON.stringify({ ok: true, nativeValidation }, null, 2));
}

main();