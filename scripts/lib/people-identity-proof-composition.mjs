import { peopleDigest } from './people-identity-seal.mjs';
import { identityArtifactHash } from './people-identity-artifacts.mjs';
import { memberContract, validateDossierIdentityEvidence, IDENTITY_REVIEW_LIMITS } from './people-identity-dossiers.mjs';
import { localNameKeys } from './people-resolution.mjs';
import { extractionAuthorAgentIds } from './people-extraction-authorship.mjs';
import { compactChapterIdentityReviewPacket, splitChapterIdentityReviewTransport, identityReviewTransportMaxBytes } from './people-identity-review-transport.mjs';
import { semanticIdentitySourceFingerprint, identityChapterChineseFingerprint } from './people-identity-semantic-source.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const same = (a, b) => peopleDigest(a) === peopleDigest(b);
const only = (value, keys) => value && same(Object.keys(value).sort(), [...keys].sort());
const sha = value => /^[a-f0-9]{64}$/u.test(value ?? '');
const fingerprint = value => /^sha256:[a-f0-9]{64}$/u.test(value ?? '');
const rowKeys = ['caseId','verdict','canonicalPersonId','membershipReviewed','membershipFingerprint','ambiguityReviewed','unresolvedIdentity','reason','sourceWitnesses'];
const dependencyIds = (item, row) => [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId, ...row.sourceWitnesses.map(w => w.localId)])];
const assignment = item => Object.fromEntries(['id','canonicalPersonId','dossierVersion','canonicalMembership','localPeople','memberVersions'].map(k => [k,item[k]]));

function assertPlan(plan) {
  const { fingerprint: digest, ...body } = plan;
  need(plan.schemaVersion === 1 && plan.kind === 'chapter-identity-dossier-review' && digest === peopleDigest(body) &&
    plan.grantsNewMerges === false && plan.publicFactsQualified === false && plan.metrics?.generatedPairs === 0 &&
    Array.isArray(plan.cases) && plan.cases.length > 0 && new Set(plan.cases.map(c => c.id)).size === plan.cases.length,
    'Changed or invalid original identity source plan');
  for (const [key, maximum] of Object.entries(IDENTITY_REVIEW_LIMITS)) need(Number.isSafeInteger(plan.limits?.[key]) &&
    plan.limits[key] > 0 && plan.limits[key] <= maximum, 'Invalid composition retrieval limit');
  for (const item of plan.cases) need(item.candidateDossiers.length <= plan.limits.maxDossiersPerCase, 'Unbounded composition candidate list');
}

function assertComponent(component, sourcePlan) {
  need(only(component, ['id','schemaVersion','kind','sourcePlanFingerprint','reportText','receipt']) && component.schemaVersion === 1 &&
    component.kind === 'captured-identity-proof-component', 'Invalid captured identity component');
  const { id, ...body } = component;
  need(id === peopleDigest(body) && component.sourcePlanFingerprint === sourcePlan.fingerprint, 'Changed identity component or parent plan');
  const r = component.receipt;
  need(only(r, ['actualReviewerAgentId','runId','authorAgentIds','sourcePacketSha256','transportSha256','reportSha256','reviewedCaseIds','sourcePeople','chapterChinese','sourceEvidenceVersion']) &&
    typeof r.actualReviewerAgentId === 'string' && r.actualReviewerAgentId && typeof r.runId === 'string' && r.runId.trim() &&
    Array.isArray(r.authorAgentIds) && r.authorAgentIds.length && r.authorAgentIds.every(a => typeof a === 'string' && a) &&
    !r.authorAgentIds.includes(r.actualReviewerAgentId) && [r.sourcePacketSha256,r.transportSha256,r.reportSha256].every(sha) &&
    fingerprint(r.chapterChinese) && r.sourceEvidenceVersion === 1 && typeof component.reportText === 'string' &&
    identityArtifactHash(Buffer.from(component.reportText)) === r.reportSha256, 'Invalid original component capture provenance');
  const report = JSON.parse(component.reportText);
  need(only(report, ['schemaVersion','planFingerprint','reviewer','reviews']) && only(report.reviewer, ['agentId','name']) &&
    report.schemaVersion === 1 && report.planFingerprint === sourcePlan.fingerprint && report.reviewer.agentId === r.actualReviewerAgentId &&
    typeof report.reviewer.name === 'string' && report.reviewer.name.trim() && Array.isArray(report.reviews) && report.reviews.length &&
    Array.isArray(r.reviewedCaseIds) && new Set(r.reviewedCaseIds).size === r.reviewedCaseIds.length &&
    same(report.reviews.map(row => row.caseId).sort(), [...r.reviewedCaseIds].sort()), 'Original report lost its actual producer, plan or owned cases');
  const cases = new Map(sourcePlan.cases.map(c => [c.id,c])), required = new Set();
  for (const row of report.reviews) {
    need(only(row, rowKeys) && cases.has(row.caseId) && ['approve','hold'].includes(row.verdict) && Array.isArray(row.sourceWitnesses),
      'Invalid original identity case row');
    for (const id of dependencyIds(cases.get(row.caseId), row)) required.add(id);
  }
  need(Array.isArray(r.sourcePeople) && r.sourcePeople.length === required.size && new Set(r.sourcePeople.map(p => p.localId)).size === required.size &&
    r.sourcePeople.every(p => only(p,['localId','fingerprint']) && required.has(p.localId) && fingerprint(p.fingerprint)), 'Missing original semantic source dependencies');
  return { report, cases, dependencies: new Map(r.sourcePeople.map(p => [p.localId,p.fingerprint])) };
}

export function identityCompositionSourcePlans(bundle,currentPlan) {
  need(bundle?.schemaVersion === 1 && bundle.kind === 'chapter-identity-review-composition' && same(bundle.scope,currentPlan.scope) &&
    Array.isArray(bundle.sourcePlans), 'Wrong retained identity composition');
  const seen = new Set(), result = [];
  for (const parent of [bundle.plan,...bundle.sourcePlans]) {
    assertPlan(parent); need(!seen.has(parent.fingerprint), 'Duplicate retained source plan'); seen.add(parent.fingerprint);
    if (parent.fingerprint !== currentPlan.fingerprint) result.push(parent);
  }
  return result;
}

// The host passes actual captured bytes and producer metadata. Preserve the
// original report text verbatim, including its ORIGINAL plan fingerprint. The
// semantic dependency receipt is derived from the exact original source packet.
export function captureIdentityProofComponent(packetBytes, reportBytes, transportBytes, job, transportPolicy, aggregateJob = null) {
  const packet = JSON.parse(packetBytes), report = JSON.parse(reportBytes), transport = JSON.parse(transportBytes);
  need(packet.schemaVersion === 1 && packet.kind === 'source-chapter-dossier-review-packet', 'Original source packet required');
  assertPlan(packet.plan);
  need(job.schemaVersion === 1 && ['captured-independent-identity-review-part','captured-independent-identity-review'].includes(job.kind) &&
    job.phase === 'report-recorded' && same(job.scope, packet.scope) && job.sourcePacketSha256 === identityArtifactHash(packetBytes) &&
    job.reportSha256 === identityArtifactHash(reportBytes) && job.transportSha256 === identityArtifactHash(transportBytes) &&
    report.reviewer?.agentId === job.agentId && report.planFingerprint === packet.plan.fingerprint, 'Actual original capture bytes/provenance do not match');
  const compact = compactChapterIdentityReviewPacket(packet), maxBytes = identityReviewTransportMaxBytes(transportPolicy);
  need(compact.sourcePacketSha256 === job.sourcePacketSha256, 'Original packet bytes differ from their native transport reference');
  const expected = Buffer.byteLength(JSON.stringify(compact) + '\n') > maxBytes ? splitChapterIdentityReviewTransport(compact, maxBytes) : [compact];
  need(expected.some(part => identityArtifactHash(Buffer.from(JSON.stringify(part) + '\n')) === job.transportSha256), 'Original transport is not its exact sealed native partition');
  const people = new Map(packet.people.map(p => [p.localId,p])), cases = new Map(packet.plan.cases.map(c => [c.id,c]));
  need(job.kind !== 'captured-independent-identity-review-part' || aggregateJob, 'Captured part requires its exact aggregate author journal');
  need((transport.kind === 'bounded-dossier-source-review-part') === (job.kind === 'captured-independent-identity-review-part'), 'Capture kind differs from the actual native transport');
  if (aggregateJob) need(aggregateJob.schemaVersion === 1 && same(aggregateJob.scope,packet.scope) && Array.isArray(aggregateJob.authorAgentIds) &&
    aggregateJob.kind === 'captured-independent-identity-review-parts' && aggregateJob.phase === 'report-recorded' &&
    aggregateJob.sourcePacketSha256 === job.sourcePacketSha256 && Array.isArray(aggregateJob.parts) && aggregateJob.parts.some(p =>
      p.agentId === job.agentId && p.runId === job.runId && p.reportSha256 === job.reportSha256 && p.transportSha256 === job.transportSha256),
    'Aggregate journal does not contain this actual captured part');
  const authorGroups = [packet.authorAgentIds,job.authorAgentIds ?? [],aggregateJob?.authorAgentIds ?? []];
  need(authorGroups.every(group => Array.isArray(group) && group.every(id => typeof id === 'string' && id)), 'Actual packet/job/aggregate author IDs required');
  need(Array.isArray(report.reviews) && same(report.reviews.map(r => r.caseId).sort(), transport.reviewCases.map(c => c.caseId).sort()), 'Captured report does not cover its exact transport');
  const required = new Set();
  for (const row of report.reviews) {
    need(cases.has(row.caseId) && Array.isArray(row.sourceWitnesses), 'Unknown captured identity case');
    for (const id of dependencyIds(cases.get(row.caseId), row)) required.add(id);
  }
  const body = { schemaVersion: 1, kind: 'captured-identity-proof-component', sourcePlanFingerprint: packet.plan.fingerprint,
    reportText: Buffer.from(reportBytes).toString('utf8'), receipt: {
      actualReviewerAgentId: job.agentId, runId: job.runId, authorAgentIds: [...new Set(authorGroups.flat())],
      sourcePacketSha256: job.sourcePacketSha256, transportSha256: job.transportSha256, reportSha256: job.reportSha256,
      reviewedCaseIds: transport.reviewCases.map(c => c.caseId), sourceEvidenceVersion: 1,
      chapterChinese: identityChapterChineseFingerprint({ units: packet.units.filter(u => u.book === packet.scope.book && u.chapter === packet.scope.chapter) }),
      sourcePeople: [...required].sort().map(localId => {
        const person = people.get(localId); need(person, 'Missing captured primary person ' + localId);
        return { localId, fingerprint: semanticIdentitySourceFingerprint(person, { units: packet.units.filter(u => u.book === person.book && u.chapter === person.chapter) }) };
      }) } };
  const component = { id: peopleDigest(body), ...body }; assertComponent(component, packet.plan);
  return { sourcePlan: packet.plan, component };
}

function currentEvidence(view, sourceChapters, scope) {
  const localPeople = new Map(), memberVersions = new Map(), units = new Map(), subjects = new Map(), ownKey = scope.book + ':' + scope.chapter;
  const own = sourceChapters.get(ownKey); need(own, 'Current native-validated target chapter required');
  for (const [key, source] of sourceChapters) {
    need(key === source.extraction.book + ':' + source.extraction.chapter, 'Current composition source scope mismatch');
    for (const [id, person] of source.localPeople) {
      need(id === person.localId && !localPeople.has(id), 'Duplicate or misattributed current composition person');
      localPeople.set(id,person); memberVersions.set(id, peopleDigest(memberContract(person,localNameKeys(person))));
      if (key === ownKey) {
        const canonical = view.localPersonMap.get(id); need(canonical, 'Missing current accepted canonical identity ' + id);
        if (!subjects.has(canonical)) subjects.set(canonical,[]); subjects.get(canonical).push(id);
      }
    }
    for (const unit of source.packet.units) { const id = key + ':' + unit.id; need(!units.has(id), 'Duplicate composition primary unit'); units.set(id,unit.zh); }
  }
  return { index: { ...view, localPeople, memberVersions, chapters: new Map([[ownKey,subjects]]) }, units, own, ownKey };
}

// This validator projection is private and never saved as a new model report.
// It passes an unchanged original case row through the existing native case
// gate. Original plan/report byte hashes remain in the immutable component.
function validateOneCase(evidence, plan, item, report, row, actualAuthors) {
  const body = { ...plan, cases: [item] }; delete body.fingerprint;
  const projection = { ...body, fingerprint: peopleDigest(body) };
  const scoped = { ...evidence.index, chapters: new Map([[evidence.ownKey, new Map([[item.canonicalPersonId,item.localPeople]])]]) };
  return validateDossierIdentityEvidence(scoped, projection, { ...report, planFingerprint: projection.fingerprint, reviews: [row] },
    evidence.units, report.reviewer.agentId, actualAuthors, localNameKeys);
}

// Expected source/case changes become explicit remaining work. Malformed
// captures, provenance failures and impossible native states always throw.
export function reconcileIdentityProofComposition(view, sourceChapters, plan, sourcePlans, components) {
  assertPlan(plan);
  const evidence = currentEvidence(view, sourceChapters, plan.scope), authors = extractionAuthorAgentIds(evidence.own.extraction);
  const currentCases = new Map(plan.cases.map(c => [c.id,c])), parents = new Map([[plan.fingerprint,plan]]);
  need(Array.isArray(sourcePlans) && Array.isArray(components), 'Explicit original plans/components required');
  for (const parent of sourcePlans) { assertPlan(parent); need(!parents.has(parent.fingerprint), 'Duplicate original plan'); parents.set(parent.fingerprint,parent); }
  const eligible = new Map(), invalidated = [], held = [], componentIds = new Set(), currentFingerprints = new Map();
  for (const component of components) {
    need(!componentIds.has(component.id), 'Duplicate captured identity component'); componentIds.add(component.id);
    const parent = parents.get(component.sourcePlanFingerprint); need(parent && same(parent.scope, plan.scope), 'Missing/wrong-scope original source plan');
    const original = assertComponent(component,parent), actualAuthors = [...new Set([...component.receipt.authorAgentIds,...authors])];
    need(!actualAuthors.includes(component.receipt.actualReviewerAgentId), 'Current or original extractor cannot independently review their own person');
    for (const row of original.report.reviews) {
      const before = original.cases.get(row.caseId), current = currentCases.get(row.caseId); let reason = null;
      if (!current) reason = 'Current chapter case or canonical membership changed';
      else if (!same(assignment(before),assignment(current))) reason = 'Current assigned dossier, member or anchor contract changed';
      else if (!row.unresolvedIdentity && !same(before,current)) reason = 'Previously certain candidate search changed; fresh ambiguity review required';
      else if (component.receipt.chapterChinese !== identityChapterChineseFingerprint(evidence.own.packet)) reason = 'Full target Chinese or unit coverage changed';
      if (!reason) for (const id of dependencyIds(before,row)) {
        const person = evidence.index.localPeople.get(id), source = person && sourceChapters.get(person.book + ':' + person.chapter);
        need(source, 'Missing current native-validated review dependency ' + id);
        if (!currentFingerprints.has(id)) currentFingerprints.set(id, semanticIdentitySourceFingerprint(person,source.packet));
        if (currentFingerprints.get(id) !== original.dependencies.get(id)) { reason = 'Primary context, claims or name occurrences changed: ' + id; break; }
      }
      if (reason) { invalidated.push({ componentId: component.id,caseId: row.caseId,reason }); continue; }
      if (row.verdict === 'hold') { held.push({ componentId: component.id,caseId: row.caseId,reason: row.reason }); continue; }
      need(!eligible.has(row.caseId), 'Duplicate eligible independent case proofs require explicit reconciliation');
      const proof = validateOneCase(evidence,parent,before,original.report,row,actualAuthors);
      eligible.set(row.caseId, { componentId: component.id, caseId: row.caseId, proof,
        sourceReview: { agentId: component.receipt.actualReviewerAgentId, runId: component.receipt.runId,
          reportSha256: component.receipt.reportSha256, sourcePlanFingerprint: parent.fingerprint }, candidateSearchChanged: !same(before,current) });
    }
  }
  // A still-current concrete hold cannot disappear behind another old approval.
  for (const row of held) eligible.delete(row.caseId);
  const selections = new Map();
  for (const item of plan.cases) if (eligible.has(item.id)) {
    const row = eligible.get(item.id); if (!selections.has(row.componentId)) selections.set(row.componentId,[]); selections.get(row.componentId).push(item.id);
  }
  return { eligible, selections: [...selections].map(([componentId,caseIds]) => ({ componentId,caseIds })), invalidated, held,
    remainingCaseIds: plan.cases.filter(c => !eligible.has(c.id)).map(c => c.id), evidence };
}

export function validateIdentityProofComposition(view, sourceChapters, scope, bundle, inputs) {
  need(only(bundle,['schemaVersion','kind','scope','plan','sourcePlans','components','selections']) && bundle.schemaVersion === 1 &&
    bundle.kind === 'chapter-identity-review-composition' && same(scope,bundle.scope) && same(scope,bundle.plan.scope), 'Malformed identity proof composition');
  need(only(inputs,['source','extraction','editorial','dateAudit']) && Object.values(inputs).every(fingerprint), 'Current composition source fingerprints required');
  const result = reconcileIdentityProofComposition(view,sourceChapters,bundle.plan,bundle.sourcePlans,bundle.components);
  need(same(result.selections,bundle.selections) && !result.remainingCaseIds.length && !result.held.length, 'Incomplete or held current chapter identity composition');
  const actual = [...result.evidence.own.localPeople.keys()].sort(), planned = bundle.plan.cases.flatMap(c => c.localPeople).sort();
  need(same(actual,planned) && new Set(planned).size === planned.length, 'Current chapter person coverage changed');
  const retained = [], ambiguity = [], reviewers = new Map();
  for (const item of bundle.plan.cases) {
    const row = result.eligible.get(item.id), proof = row.proof.retained[0];
    retained.push({ ...proof, sourceReview: row.sourceReview }); reviewers.set(row.sourceReview.agentId,row.sourceReview);
    if (proof.unresolvedIdentity) ambiguity.push({ caseId:item.id,canonicalPersonId:item.canonicalPersonId,candidateDossiers:item.candidateDossiers,retrieval:item.retrieval });
  }
  return { schemaVersion:1,kind:'revalidated-composed-chapter-identity-dossiers',scope,inputs:bundle.plan.inputs,currentInputs:inputs,
    planFingerprint:bundle.plan.fingerprint,originalBundle:peopleDigest(bundle),retained,ambiguity,reviewers:[...reviewers.values()],
    unchangedSourceProofsReused:true,grantsNewMerges:false,grantsNewSeparations:false,chronologyApproval:false,sourceEditorialApproval:false,publicationApproval:false };
}
