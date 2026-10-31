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
