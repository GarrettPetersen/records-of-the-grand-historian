import { identityArtifactHash } from './people-identity-artifacts.mjs';

export function compactChapterIdentityReviewPacket(p) {
  const sourcePacketSha256 = identityArtifactHash(Buffer.from(JSON.stringify(p, null, 2) + '\n'));
const compact={schemaVersion:1,kind:'bounded-dossier-source-review-transport',sourcePacketSha256:sourcePacketSha256,scope:p.scope,
 planFingerprint:p.plan.fingerprint,authorAgentIds:p.authorAgentIds,registryProvenance:p.registryProvenance,acceptedMembershipAuthority:p.acceptedMembershipAuthority,
 reviewCases:p.plan.cases.map(c=>({caseId:c.id,canonicalPersonId:c.canonicalPersonId,localPeople:c.localPeople,canonicalMembership:c.canonicalMembership,
  candidateDossiers:c.candidateDossiers.map(d=>d.id),retrieval:{overflow:c.retrieval.overflow,missingBlockingName:c.retrieval.missingBlockingName,
  omittedKeys:c.retrieval.queries.filter(q=>q.omitted).map(q=>({key:q.key,totalDossiers:q.totalDossiers,visited:q.postingIdsVisited}))},proposal:c.proposal})),
 fieldLegends:{claims:['id','predicate','value','certainty','evidence'],mentions:['id','unitId','kind','spans','notes'],candidateNames:['key','forms','kinds']},
 people:p.people.map(person=>({localId:person.localId,preferredNameSuggestion:person.preferredNameSuggestion,historicity:person.historicity,descriptorSuggestion:person.descriptorSuggestion,
 identityHints:person.identityHints,claims:person.claims.map(c=>[c.id,c.predicate,c.value,c.certainty,c.evidence]),
 mentions:person.mentions.map(m=>[m.id,m.unit.id,m.kind,m.spans,m.notes??null])})),
 units:p.units.map(u=>({book:u.book,chapter:u.chapter,id:u.id,zh:u.zh,en:u.en,literal:u.literal})),
 candidateDossiers:p.candidateDossiers.map(d=>({id:d.id,version:d.version,acceptedSourceMembers:d.localPeople.length,names:d.names.filter(n=>n.blocking).map(n=>[n.key,n.forms,n.kinds])})),
 candidateDisclosure:'These are bounded name-index headers, not primary-evidence proofs of equivalence or difference. Full immutable registry and posting counts/fingerprints remain sealed on host. No candidate may be merged or separated by this report. Uninspected aliases or overflow remain uncertain.',
 requiredReport:p.requiredReport,instructions:p.instructions};
  if (compact.people.reduce((sum, person) => sum + person.claims.length, 0) !== p.people.reduce((sum, person) => sum + person.claims.length, 0) || compact.people.reduce((sum, person) => sum + person.mentions.length, 0) !== p.people.reduce((sum, person) => sum + person.mentions.length, 0)) throw new Error('Source claims or mentions were lost during transport compaction');
  return compact;
}

// Split case ownership only. Each part retains the complete target chapter and
// every claim/mention source unit of its people and canonical anchors. The full
// immutable source packet remains the common authority; no part can certify it.
export function splitChapterIdentityReviewTransport(transport, maxBytes) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1024 || !transport.reviewCases?.length) throw new Error('Invalid bounded identity review partition request');
  const byPerson = new Map(transport.people.map(p => [p.localId, p])), byUnit = new Map(transport.units.map(u => [`${u.book}:${u.chapter}:${u.id}`, u])), byDossier = new Map(transport.candidateDossiers.map(d => [d.id, d]));
  const targetUnits = transport.units.filter(u => u.book === transport.scope.book && u.chapter === transport.scope.chapter);
  const project = cases => {
    const ids = new Set(cases.flatMap(c => [...c.localPeople, c.canonicalMembership.anchorLocalId]));
    const people = [...ids].map(id => byPerson.get(id));
    if (people.some(p => !p)) throw new Error('Missing review part person or anchor');
    const evidence = new Set();
    for (const p of people) {
      const prefix = p.localId.split(':').slice(0, 2).join(':');
      for (const claim of p.claims) for (const id of claim[4]) evidence.add(id.includes(':') ? id : `${prefix}:${id}`);
      for (const mention of p.mentions) evidence.add(mention[1].includes(':') ? mention[1] : `${prefix}:${mention[1]}`);
    }
    const candidateIds = new Set(cases.flatMap(c => c.candidateDossiers));
    const unitIds = new Set(targetUnits.map(u => `${u.book}:${u.chapter}:${u.id}`));
    for (const id of evidence) unitIds.add(id);
    const units = [...unitIds].map(id => byUnit.get(id)).filter(Boolean);
    const available = new Set(units.map(u => `${u.book}:${u.chapter}:${u.id}`));
    const missing = [...evidence].filter(id => !available.has(id));
    if (missing.length) throw new Error('Missing primary evidence in review part: ' + missing.slice(0, 8).join(', '));
    const candidateDossiers = [...candidateIds].map(id => byDossier.get(id));
    if (candidateDossiers.some(d => !d)) throw new Error('Missing bounded candidate dossier');
    return { ...transport, kind: 'bounded-dossier-source-review-part', reviewCases: cases, people, units, candidateDossiers,
      partitionAuthority: 'This part owns only its listed cases. All parts must pass exact coverage and independent source validation against the common full plan before any chapter certificate.' };
  };
  const size = p => Buffer.byteLength(JSON.stringify(p) + '\n');
  const parts = [];
  const split = cases => { const part = project(cases); if (size(part) <= maxBytes) { parts.push(part); return; } if (cases.length === 1) throw new Error(`Identity case ${cases[0].caseId} exceeds the inspected transport bound; preserve its complete evidence`); const middle = Math.floor(cases.length / 2); split(cases.slice(0, middle)); split(cases.slice(middle)); };
  split(transport.reviewCases);
  const expected = transport.reviewCases.map(c => c.caseId), actual = parts.flatMap(p => p.reviewCases.map(c => c.caseId));
  if (expected.length !== new Set(expected).size || JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Review partition lost or duplicated case ownership');
  return parts;
}

export function assembleChapterIdentityReviewParts(plan, transports, reports, actualReviewerAgentIds, authorAgentIds) {
  if (!transports.length || transports.length !== reports.length || reports.length !== actualReviewerAgentIds.length) throw new Error('Missing independent identity review parts');
  const reviews = new Map(), seen = new Set();
  // A combined report names a real reviewer who independently contributed. Every
  // other actual producer remains in the immutable part receipts, validated here.
  for (let i = 0; i < reports.length; i++) {
    const t = transports[i], r = reports[i], agent = actualReviewerAgentIds[i];
    if (t.kind !== 'bounded-dossier-source-review-part' || t.sourcePacketSha256 !== transports[0].sourcePacketSha256 || Object.keys(r).sort().join(',') !== 'planFingerprint,reviewer,reviews,schemaVersion' || Object.keys(r.reviewer ?? {}).sort().join(',') !== 'agentId,name' || !agent || authorAgentIds.includes(agent) || r.schemaVersion !== 1 || r.reviewer?.agentId !== agent || !r.reviewer.name?.trim() || r.planFingerprint !== plan.fingerprint || t.planFingerprint !== plan.fingerprint) throw new Error('Stale or nonindependent identity review part');
    const expected = t.reviewCases.map(c => c.caseId), actual = r.reviews?.map(c => c.caseId);
    if (!actual || new Set(actual).size !== actual.length || JSON.stringify([...actual].sort()) !== JSON.stringify([...expected].sort())) throw new Error('Identity review part does not cover its exact owned cases');
    for (const row of r.reviews) { if (seen.has(row.caseId)) throw new Error('Duplicate identity review case'); seen.add(row.caseId); reviews.set(row.caseId, row); }
  }
  if (seen.size !== plan.cases.length || plan.cases.some(c => !seen.has(c.id))) throw new Error('Incomplete full chapter identity coverage');
  if (new Set(actualReviewerAgentIds).size !== 1) throw new Error('A chapter report must retain one actual independent reviewer; use one retained reviewer across its parts');
  return { schemaVersion: 1, planFingerprint: plan.fingerprint, reviewer: reports[0].reviewer, reviews: plan.cases.map(c => reviews.get(c.id)) };
}
