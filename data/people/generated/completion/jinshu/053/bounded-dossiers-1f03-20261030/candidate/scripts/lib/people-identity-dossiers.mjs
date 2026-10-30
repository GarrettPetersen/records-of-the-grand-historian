import { peopleDigest } from './people-identity-seal.mjs';
import { chineseVariantComparisonKey } from './people-chinese-variants.mjs';
import { identityNameKeyState } from './people-resolution.mjs';

export const IDENTITY_REVIEW_LIMITS = Object.freeze({ maxDossiersPerCase: 8, maxKeysPerCase: 16, maxPostingReadsPerKey: 8 });

const digestPattern = /^sha256:[a-f0-9]{64}$/u;
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const compare = (a, b) => a.localeCompare(b, 'en');
const hasOnlyKeys = (object, keys) => object && Object.keys(object).sort().join('\0') === [...keys].sort().join('\0');
const normalizeKey = key => key.startsWith('zh:') ? chineseVariantComparisonKey(key) : key;
const identityPredicates = new Set(['name', 'birth', 'death', 'sex', 'role', 'office',
  'native-place', 'family-relationship', 'relationship', 'kinship', 'lineage']);

function memberContract(person, keys) {
  return { localId: person.localId, promptVersion: person.promptVersion, names: keys,
    claims: person.claims.filter(claim => identityPredicates.has(claim.predicate)) };
}

// Matching indexes accepted canonical people. Local records remain provenance,
// never vertices of a new complete comparison graph.
export function buildIdentityDossierIndex(localPeople, clusters, nameKeysForPerson) {
  requireValue(localPeople instanceof Map && Array.isArray(clusters) && typeof nameKeysForPerson === 'function',
    'Validated people, accepted clusters and the normal name-key reader are required');
  const dossiers = new Map(), localPersonMap = new Map(), postings = new Map(), englishUnknownPostings = new Map(), chapters = new Map(), memberVersions = new Map(), canonicalByKnownId = new Map();
  for (const cluster of clusters) {
    requireValue(typeof cluster.canonicalPersonId === 'string' && !dossiers.has(cluster.canonicalPersonId), 'Duplicate/invalid canonical dossier');
    const members = [...cluster.localPeople].sort(compare), names = new Map(), contracts = [], anchors = [];
    for (const knownId of [cluster.canonicalPersonId, ...(cluster.retiredIds ?? [])]) {
      requireValue(!canonicalByKnownId.has(knownId), 'Conflicting accepted canonical lineage');
      canonicalByKnownId.set(knownId, cluster.canonicalPersonId);
    }
    requireValue(members.length > 0 && new Set(members).size === members.length, 'Empty/duplicate canonical membership');
    for (const localId of members) {
      const person = localPeople.get(localId);
      requireValue(person && person.localId === localId && !localPersonMap.has(localId) && Array.isArray(person.claims),
        `Invalid, missing or multiply assigned source member ${localId}`);
      localPersonMap.set(localId, cluster.canonicalPersonId);
      const chapterKey = localId.split(':').slice(0, 2).join(':');
      if (!chapters.has(chapterKey)) chapters.set(chapterKey, new Map());
      const subjects = chapters.get(chapterKey);
      if (!subjects.has(cluster.canonicalPersonId)) subjects.set(cluster.canonicalPersonId, []);
      subjects.get(cluster.canonicalPersonId).push(localId);
      const keys = nameKeysForPerson(person);
      requireValue(Array.isArray(keys), 'Name-key reader did not return an array');
      const contract = memberContract(person, keys);
      contracts.push(contract); memberVersions.set(localId, peopleDigest(contract));
      const state = identityNameKeyState(keys);
      anchors.push({ localId, rank: state.chinese.size ? 2 : keys.some(key => key.language === 'zh' && key.sources.some(source => source !== 'preferred')) ? 1 : 0 });
      for (const name of keys) {
        requireValue(typeof name.key === 'string' && Array.isArray(name.kinds) && typeof name.blocking === 'boolean', 'Invalid source name key');
        const key = normalizeKey(name.key);
        if (!names.has(key)) names.set(key, { key, language: name.language, forms: new Set(), kinds: new Set(), blocking: false, claimRefs: new Set() });
        const entry = names.get(key);
        entry.forms.add(name.value);
        for (const kind of name.kinds) entry.kinds.add(kind);
        for (const source of name.sources ?? []) if (source !== 'preferred') entry.claimRefs.add(source);
        entry.blocking ||= name.blocking;
      }
    }
    const identityNames = [...names.values()].map(name => ({ ...name,
      forms: [...name.forms].sort(compare), kinds: [...name.kinds].sort(compare), claimRefs: [...name.claimRefs].sort(compare),
    })).sort((a, b) => keyPriority(a) - keyPriority(b) || compare(a.key, b.key));
    const keyState = identityNameKeyState(identityNames);
    const dossier = { id: cluster.canonicalPersonId, localPeople: members, names: identityNames,
      identityEvidence: contracts.map(({ localId, claims }) => ({ localId, claims })),
      anchorCandidates: anchors.sort((a, b) => b.rank - a.rank || compare(a.localId, b.localId)).map(anchor => anchor.localId),
      matching: { chineseIdentityKeys: [...keyState.chinese].sort(compare), englishIdentityKeys: [...keyState.english].sort(compare) },
      version: peopleDigest({ canonicalPersonId: cluster.canonicalPersonId, contracts }),
      evidenceContract: 'Version covers normalized source-backed identity claims and names; review certificates separately pin current chapter bytes and exact primary witnesses.' };
    dossiers.set(dossier.id, dossier);
    for (const name of identityNames) if (name.blocking) {
      if (!postings.has(name.key)) postings.set(name.key, []);
      postings.get(name.key).push(dossier.id);
      if (name.language === 'en') {
        if (!englishUnknownPostings.has(name.key)) englishUnknownPostings.set(name.key, []);
        if (!keyState.english.has(name.key) || keyState.chinese.size === 0) englishUnknownPostings.get(name.key).push(dossier.id);
      }
    }
  }
  requireValue(localPersonMap.size === localPeople.size, 'Canonical dossiers do not cover every validated local person');
  for (const map of [postings, englishUnknownPostings]) for (const [key, ids] of map) {
    ids.sort(compare);
    map.set(key, { ids, total: ids.length, fingerprint: peopleDigest({ key, ids }) });
  }
  return { schemaVersion: 1, dossiers, dossierVersions: new Map([...dossiers].map(([id, dossier]) => [id, dossier.version])), postings, englishUnknownPostings, localPersonMap, localPeople, chapters, memberVersions, canonicalByKnownId };
}

const keyPriority = name => name.key.startsWith('zh:') ? 0 : name.key.includes(' ') ? 1 : 2;

export function planChapterIdentityReview(index, scope, inputs, limits) {
  requireValue(/^[a-z0-9_-]+$/u.test(scope?.book ?? '') && /^\d{3}$/u.test(scope?.chapter ?? ''), 'One explicit chapter is required');
  for (const key of ['source', 'extraction', 'editorial', 'dateAudit']) requireValue(digestPattern.test(inputs?.[key] ?? ''), `Missing current ${key} byte fingerprint`);
  for (const key of ['maxDossiersPerCase', 'maxKeysPerCase', 'maxPostingReadsPerKey']) {
    requireValue(Number.isSafeInteger(limits?.[key]) && limits[key] >= 1 && limits[key] <= IDENTITY_REVIEW_LIMITS[key], `Invalid hard retrieval limit ${key}`);
  }
  const subjects = index.chapters.get(`${scope.book}:${scope.chapter}`) ?? new Map();
  requireValue(subjects.size > 0, 'A zero-person chapter cannot prove the nonempty completion path');
  const cases = [], metrics = { cases: subjects.size, targetLocalPeople: 0, postingIdsVisited: 0, candidateDossiers: 0,
    generatedPairs: 0, maxDossiersInCase: 0, overflowCases: 0 };
  for (const [canonicalId, members] of [...subjects].sort(([a], [b]) => compare(a, b))) {
    const dossier = index.dossiers.get(canonicalId), keys = dossier.names.filter(name => name.blocking), englishIdentityKeys = new Set(dossier.matching.englishIdentityKeys);
    const candidates = new Map(), queries = []; let overflow = false;
    for (const [position, name] of keys.entries()) {
      const allPosting = index.postings.get(name.key);
      requireValue(allPosting, `Missing dossier index entry ${name.key}`);
      const partitioned = name.language === 'en' && dossier.matching.chineseIdentityKeys.length > 0 && englishIdentityKeys.has(name.key);
      const posting = partitioned ? index.englishUnknownPostings.get(name.key) : allPosting;
      requireValue(posting, `Missing canonical source-name partition ${name.key}`);
      const selected = position < limits.maxKeysPerCase;
      const readCount = selected ? Math.min(posting.total, limits.maxPostingReadsPerKey) : 0;
      const query = { key: name.key, mode: partitioned ? 'source-Chinese-partition' : 'exact-name',
        fullNamePostingCount: allPosting.total, fullNamePostingFingerprint: allPosting.fingerprint, postingFingerprint: posting.fingerprint, totalDossiers: posting.total,
        postingIdsVisited: readCount, omitted: !selected || posting.total > readCount };
      overflow ||= query.omitted;
      for (let offset = 0; offset < readCount; offset += 1) {
        metrics.postingIdsVisited += 1;
        const id = posting.ids[offset];
        if (id === canonicalId) continue;
        if (!candidates.has(id)) {
          if (candidates.size === limits.maxDossiersPerCase) { overflow = true; continue; }
          const version = index.dossierVersions.get(id);
          requireValue(digestPattern.test(version ?? ''), `Missing indexed dossier version ${id}`);
          candidates.set(id, { id, version, sharedKeys: [] });
        }
        candidates.get(id).sharedKeys.push(name.key);
      }
      queries.push(query);
    }
    const localPeople = members.sort(compare), candidateDossiers = [...candidates.values()], localSet = new Set(localPeople);
    const anchorLocalId = dossier.anchorCandidates.find(id => !localSet.has(id)) ?? dossier.anchorCandidates[0];
    requireValue(anchorLocalId && dossier.localPeople.includes(anchorLocalId), 'Missing accepted canonical dossier identity anchor');
    const canonicalMembership = { protectedLocalPeople: dossier.localPeople, anchorLocalId, anchorVersion: index.memberVersions.get(anchorLocalId),
      fingerprint: peopleDigest({ members: dossier.localPeople, anchorLocalId, anchorVersion: index.memberVersions.get(anchorLocalId) }) };
    cases.push({ id: peopleDigest({ scope, canonicalId, localPeople }), canonicalPersonId: canonicalId,
      dossierVersion: dossier.version, canonicalMembership, localPeople, memberVersions: Object.fromEntries(localPeople.map(id => [id, index.memberVersions.get(id)])), candidateDossiers,
      retrieval: { queries, overflow, missingBlockingName: keys.length === 0 },
      proposal: { canonicalPersonId: canonicalId, unresolvedIdentity: Boolean(overflow || candidates.size || keys.length === 0),
        reason: 'Retain the accepted canonical assignment. Cross-record equivalence requires primary evidence; bounded retrieval is not proof of a different identity.' } });
    metrics.targetLocalPeople += localPeople.length; metrics.candidateDossiers += candidateDossiers.length;
    metrics.maxDossiersInCase = Math.max(metrics.maxDossiersInCase, candidateDossiers.length);
    if (overflow) metrics.overflowCases += 1;
  }
  const value = { schemaVersion: 1, kind: 'chapter-identity-dossier-review', scope, inputs,
    limits, metrics, cases, grantsNewMerges: false, publicFactsQualified: false };
  return { ...value, fingerprint: peopleDigest(value) };
}

// The only authority granted here is a reviewed, retained assignment. New merges
// still require the existing independently reviewed resolution application.
export function validateRetainedDossierReview(index, plan, report, sourceUnits, actualReviewerAgentId, authorAgentIds, currentInputs, nameKeysForPerson) {
  requireValue(typeof nameKeysForPerson === 'function', 'Current normal source name-key validation is required');
  const { fingerprint, ...contract } = plan;
  requireValue(peopleDigest(contract) === fingerprint, 'Dossier plan was changed after sealing');
  requireValue(peopleDigest(currentInputs) === peopleDigest(plan.inputs), 'Current chapter source/editorial/date inputs changed');
  requireValue(Array.isArray(authorAgentIds) && authorAgentIds.length > 0, 'Author provenance is required');
  requireValue(hasOnlyKeys(report, ['schemaVersion', 'planFingerprint', 'reviewer', 'reviews']) && hasOnlyKeys(report.reviewer, ['agentId', 'name']), 'Unexpected review envelope fields');
  requireValue(report?.schemaVersion === 1 && report.planFingerprint === fingerprint, 'Stale or wrong dossier review');
  requireValue(typeof actualReviewerAgentId === 'string' && actualReviewerAgentId &&
    report.reviewer?.agentId === actualReviewerAgentId && typeof report.reviewer.name === 'string' && report.reviewer.name.trim() && !authorAgentIds.includes(actualReviewerAgentId), 'Actual independent reviewer identity is required');
  requireValue(Array.isArray(report.reviews) && report.reviews.length === plan.cases.length &&
    new Set(report.reviews.map(row => row.caseId)).size === plan.cases.length, 'Missing or duplicate person review');
  const currentMembers = [...(index.chapters.get(`${plan.scope.book}:${plan.scope.chapter}`) ?? new Map()).values()].flat().sort(compare);
  const plannedMembers = plan.cases.flatMap(item => item.localPeople).sort(compare);
  requireValue(peopleDigest(currentMembers) === peopleDigest(plannedMembers), 'Chapter person coverage changed');
  const cases = new Map(plan.cases.map(item => [item.id, item])), retained = [], ambiguity = [], nameEvidence = new Map();
  for (const row of report.reviews) {
    requireValue(hasOnlyKeys(row, ['caseId', 'verdict', 'canonicalPersonId', 'membershipReviewed', 'membershipFingerprint', 'ambiguityReviewed', 'unresolvedIdentity', 'reason', 'sourceWitnesses']), 'Unexpected person review fields');
    const item = cases.get(row.caseId);
    requireValue(item && row.verdict === 'approve', 'A held or unknown person case cannot complete a chapter');
    const currentCanonical = index.localPersonMap.get(item.localPeople[0]);
    requireValue(row.canonicalPersonId === item.canonicalPersonId &&
      index.canonicalByKnownId.get(item.canonicalPersonId) === currentCanonical &&
      item.localPeople.every(id => {
        const person = index.localPeople.get(id);
        return person && index.localPersonMap.get(id) === currentCanonical && index.memberVersions.get(id) === item.memberVersions[id] &&
          peopleDigest(memberContract(person, nameKeysForPerson(person))) === item.memberVersions[id];
      }),
      'Retained assignment or source-person evidence changed; a certificate cannot authorize a merge or split');
    requireValue(row.membershipReviewed === true && row.membershipFingerprint === item.canonicalMembership.fingerprint &&
      item.canonicalMembership.protectedLocalPeople.every(id => index.localPersonMap.get(id) === currentCanonical),
      'Complete accepted canonical membership must be independently reviewed and preserved');
    const anchor = index.localPeople.get(item.canonicalMembership.anchorLocalId);
    requireValue(anchor && index.memberVersions.get(anchor.localId) === item.canonicalMembership.anchorVersion &&
      peopleDigest(memberContract(anchor, nameKeysForPerson(anchor))) === item.canonicalMembership.anchorVersion,
      'Current canonical identity anchor evidence is missing or changed');
    requireValue(typeof row.unresolvedIdentity === 'boolean' && row.ambiguityReviewed === true &&
      typeof row.reason === 'string' && row.reason.trim().length >= 10, 'An explicit, source-based identity and ambiguity review is required');
    if (item.proposal.unresolvedIdentity) requireValue(row.unresolvedIdentity, 'Candidate or overflow ambiguity cannot become unreviewed identity certainty');
    if (!row.unresolvedIdentity) requireValue(!item.retrieval.overflow && !item.retrieval.missingBlockingName,
      'A capped or missing-name search cannot establish cross-record identity certainty');
    requireValue(Array.isArray(row.sourceWitnesses) && row.sourceWitnesses.length, 'Primary Chinese witnesses are required');
    const caseMembers = new Set(item.localPeople), witnessedMembers = new Set(), witnessedCandidates = new Set();
    for (const witness of row.sourceWitnesses) {
      requireValue(hasOnlyKeys(witness, ['localId', 'book', 'chapter', 'unitId', 'quote']), 'Unexpected witness fields');
      const person = index.localPeople.get(witness.localId), sourceId = `${witness.book}:${witness.chapter}:${witness.unitId}`;
      const quote = witness.quote, text = sourceUnits.get(sourceId);
      if (person && !nameEvidence.has(witness.localId)) {
        const evidence = new Map(), claims = new Map(person.claims.filter(claim => claim.predicate === 'name').map(claim => [claim.id, claim.evidence]));
        for (const key of nameKeysForPerson(person)) if (key.language === 'zh') for (const claimId of key.sources) {
          for (const unit of claims.get(claimId) ?? []) { if (!evidence.has(unit)) evidence.set(unit, new Set()); evidence.get(unit).add(normalizeKey(key.key).slice(3)); }
        }
        nameEvidence.set(witness.localId, evidence);
      }
      requireValue(person && (caseMembers.has(witness.localId) || witness.localId === item.canonicalMembership.anchorLocalId || item.candidateDossiers.some(dossier =>
        index.localPersonMap.get(witness.localId) === index.canonicalByKnownId.get(dossier.id))), 'Witness person is outside this case');
      requireValue(typeof text === 'string' && typeof quote === 'string' && /\p{Script=Han}/u.test(quote) && text.includes(quote) &&
        [...(nameEvidence.get(witness.localId).get(sourceId) ?? [])].some(name => name && normalizeKey('zh:' + quote).slice(3).includes(name)), 'Witness does not support this person in the current primary source');
      witnessedMembers.add(witness.localId); witnessedCandidates.add(index.localPersonMap.get(witness.localId));
    }
    requireValue(witnessedMembers.has(item.canonicalMembership.anchorLocalId), 'The accepted canonical dossier requires a primary identity-anchor witness');
    requireValue(item.localPeople.every(id => witnessedMembers.has(id)), 'A chapter-local person lacks independent primary identity coverage');
    if (!row.unresolvedIdentity) requireValue(item.candidateDossiers.every(candidate => witnessedCandidates.has(index.canonicalByKnownId.get(candidate.id))),
      'Claimed certainty requires primary evidence for every bounded candidate dossier');
    retained.push({ caseId: item.id, canonicalPersonId: currentCanonical, reviewedCanonicalPersonId: item.canonicalPersonId, localPeople: item.localPeople,
      dossierVersion: item.dossierVersion, canonicalMembership: item.canonicalMembership, unresolvedIdentity: row.unresolvedIdentity, reason: row.reason, sourceWitnesses: row.sourceWitnesses });
    if (row.unresolvedIdentity) ambiguity.push({ caseId: item.id, canonicalPersonId: item.canonicalPersonId,
      candidateDossiers: item.candidateDossiers, retrieval: item.retrieval });
  }
  return { schemaVersion: 1, kind: 'reviewed-chapter-identity-dossiers', scope: plan.scope, inputs: plan.inputs,
    planFingerprint: fingerprint, reviewer: report.reviewer, reportFingerprint: peopleDigest(report), retained, ambiguity,
    grantsNewMerges: false, grantsNewSeparations: false, chronologyApproval: false, sourceEditorialApproval: false, publicationApproval: false };
}
