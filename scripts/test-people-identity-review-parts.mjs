import test from 'node:test';
import assert from 'node:assert/strict';
import { splitChapterIdentityReviewTransport, assembleChapterIdentityReviewParts, compactChapterIdentityReviewPacket,
  identityReviewTransportPolicy, DEFAULT_IDENTITY_REVIEW_PART_BYTES, MAX_IDENTITY_REVIEW_TRANSPORT_BYTES } from './lib/people-identity-review-transport.mjs';
import { extractionAuthorAgentIds } from './lib/people-extraction-authorship.mjs';
import { createIdentityReviewBundle } from './lib/people-identity-review-record.mjs';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';
import { validatePreparedIdentityReviewArtifacts } from './prepare-people-chapter-identity.mjs';
function fixture() {
 const own='fixture:001:p001',anchor='fixture:002:p001',other='fixture:001:p002',otherAnchor='fixture:003:p001';
 const person=(localId,unit)=>({localId,claims:[['c1','name',{zh:'王偉'},'explicit',[unit]]],mentions:[['m1','s0001','personal-name',{},null]]});
 return {schemaVersion:1,kind:'bounded-dossier-source-review-transport',scope:{book:'fixture',chapter:'001'},sourcePacketSha256:'source',planFingerprint:'plan',instructions:'Review independently.',reviewCases:[{caseId:'a',localPeople:[own],canonicalMembership:{anchorLocalId:anchor},candidateDossiers:['d1']},{caseId:'b',localPeople:[other],canonicalMembership:{anchorLocalId:otherAnchor},candidateDossiers:['d2']}],people:[person(own,'fixture:001:s0001'),person(anchor,'fixture:002:s0001'),person(other,'fixture:001:s0001'),person(otherAnchor,'fixture:003:s0001')],units:[{book:'fixture',chapter:'001',id:'s0001',zh:'王偉至。',en:'x'.repeat(300)},{book:'fixture',chapter:'001',id:'s0002',zh:'未久。'},{book:'fixture',chapter:'002',id:'s0001',zh:'王偉至。',en:'x'.repeat(2000)},{book:'fixture',chapter:'003',id:'s0001',zh:'王偉至。',en:'x'.repeat(2000)}],candidateDossiers:[{id:'d1',names:['王偉']},{id:'d2',names:['王偉']}]};
}
test('bounded parts retain complete target chapter and all owned person/anchor evidence',()=>{
 const t=fixture(),parts=splitChapterIdentityReviewTransport(t,4000);assert.equal(parts.length,2);assert.deepEqual(parts.flatMap(p=>p.reviewCases.map(c=>c.caseId)),['a','b']);
 for(const p of parts){assert(Buffer.byteLength(JSON.stringify(p)+'\n')<=4000);assert.equal(p.sourcePacketSha256,t.sourcePacketSha256);assert(p.units.some(u=>u.chapter==='001'&&u.id==='s0002'));for(const person of p.people)assert.deepEqual(person,t.people.find(x=>x.localId===person.localId));}
 assert.deepEqual(parts[0].units.filter(u=>u.chapter!=='001').map(u=>u.chapter),['002']);assert.deepEqual(parts[1].candidateDossiers,[t.candidateDossiers[1]]);
});
test('unreviewable single cases, missing witnesses and duplicate case ownership fail closed',()=>{
 const t=fixture();assert.throws(()=>splitChapterIdentityReviewTransport(t,1024),/case.*exceeds/);const m=fixture();m.units=m.units.filter(u=>u.chapter!=='002');assert.throws(()=>splitChapterIdentityReviewTransport(m,4000),/Missing primary evidence/);const d=fixture();d.reviewCases[1].caseId='a';assert.throws(()=>splitChapterIdentityReviewTransport(d,4000),/lost or duplicated/);
});
const reports=parts=>parts.map(p=>({schemaVersion:1,planFingerprint:'plan',reviewer:{agentId:'reviewer',name:'Independent Reviewer'},reviews:p.reviewCases.map(c=>({caseId:c.caseId,verdict:'approve'}))}));
test('assembly requires all exact parts and actual independent producer, in linear case order',()=>{
 const parts=splitChapterIdentityReviewTransport(fixture(),4000),plan={fingerprint:'plan',cases:[{id:'a'},{id:'b'}]},r=reports(parts);const result=assembleChapterIdentityReviewParts(plan,parts,r,['reviewer','reviewer'],['extractor']);assert.deepEqual(result.reviews.map(x=>x.caseId),['a','b']);
 assert.throws(()=>assembleChapterIdentityReviewParts(plan,parts,r,['extractor','reviewer'],['extractor']),/nonindependent/);assert.throws(()=>assembleChapterIdentityReviewParts(plan,parts.slice(0,1),r.slice(0,1),['reviewer'],['extractor']),/Incomplete full/);const dup=structuredClone(r);dup[1].reviews[0].caseId='a';assert.throws(()=>assembleChapterIdentityReviewParts(plan,parts,dup,['reviewer','reviewer'],['extractor']),/exact owned/);const extra=structuredClone(r);extra[0].unexpected=true;assert.throws(()=>assembleChapterIdentityReviewParts(plan,parts,extra,['reviewer','reviewer'],['extractor']),/Stale/);
 const held=structuredClone(r);held[0].reviews[0].verdict='hold';assert.equal(assembleChapterIdentityReviewParts(plan,parts,held,['reviewer','reviewer'],['extractor']).reviews[0].verdict,'hold');
});
test('aggregate extraction authors remain actual complete chunk contributors',()=>{
 assert.deepEqual(extractionAuthorAgentIds({run:{agentId:null,chunks:[{agentId:'a'},{agentId:'b'},{agentId:'a'}]}}),['a','b']);assert.deepEqual(extractionAuthorAgentIds({run:{agentId:'top'}}),['top']);assert.throws(()=>extractionAuthorAgentIds({run:{agentId:null}}),/provenance/);assert.throws(()=>extractionAuthorAgentIds({run:{agentId:'top',chunks:[{agentId:null}]}}),/every chunk/);
});

test('the actual default accepts the exact UTF-8 boundary and holds an oversized individual case',()=>{
 assert.equal(DEFAULT_IDENTITY_REVIEW_PART_BYTES,256*1024);
 const t=fixture();t.reviewCases=t.reviewCases.slice(0,1);
 const initial=splitChapterIdentityReviewTransport(t,MAX_IDENTITY_REVIEW_TRANSPORT_BYTES)[0];
 const unit=t.units.find(u=>u.chapter==='002');unit.en+='x'.repeat(DEFAULT_IDENTITY_REVIEW_PART_BYTES-Buffer.byteLength(JSON.stringify(initial)+'\n'));
 const parts=splitChapterIdentityReviewTransport(t,DEFAULT_IDENTITY_REVIEW_PART_BYTES);
 assert.equal(parts.length,1);assert.equal(Buffer.byteLength(JSON.stringify(parts[0])+'\n'),DEFAULT_IDENTITY_REVIEW_PART_BYTES);
 unit.en+='x';assert.throws(()=>splitChapterIdentityReviewTransport(t,DEFAULT_IDENTITY_REVIEW_PART_BYTES),/case.*exceeds/);
});

test('separate independent conversations assemble exact case ownership without a shared growing context',()=>{
 const parts=splitChapterIdentityReviewTransport(fixture(),4000),r=reports(parts),plan={fingerprint:'plan',cases:[{id:'a'},{id:'b'}]};r[1].reviewer.agentId='second-reviewer';
 const combined=assembleChapterIdentityReviewParts(plan,parts,r,['reviewer','second-reviewer'],['extractor']);
 assert.equal(combined.reviewer.agentId,'reviewer');assert.deepEqual(combined.reviews.map(row=>row.caseId),['a','b']);
 r[1].reviewer.agentId='extractor';assert.throws(()=>assembleChapterIdentityReviewParts(plan,parts,r,['reviewer','extractor'],['extractor']),/nonindependent/);
});

function largeCapturedFixture(maxBytes) {
 const scope={book:'fixture',chapter:'001'},cases=[],people=[],units=[{...scope,id:'s0001',zh:'王偉至。',en:'Wang Wei arrived.',literal:'Wang Wei arrived.'}];
 for(let i=0;i<9;i++){
  const localId=`fixture:001:p${i+1}`,chapter=String(i+2).padStart(3,'0'),anchor=`fixture:${chapter}:p1`;
  cases.push({id:`case-${i}`,canonicalPersonId:`person-${i}`,localPeople:[localId],canonicalMembership:{anchorLocalId:anchor},candidateDossiers:[],retrieval:{queries:[]},proposal:{}});
  for(const id of [localId,anchor]){const ch=id.split(':')[1];people.push({localId:id,book:'fixture',chapter:ch,claims:[{id:id+':c1',predicate:'name',value:{kind:'personal-name',zh:'王偉',en:'Wang Wei'},certainty:'explicit',evidence:[`fixture:${ch}:s0001`]}],mentions:[]});}
  units.push({book:'fixture',chapter,id:'s0001',zh:'王偉至。',en:'x'.repeat(150*1024),literal:'Wang Wei arrived.'});
 }
 const packet={schemaVersion:1,kind:'source-chapter-dossier-review-packet',scope,plan:{scope,fingerprint:'plan',cases},people,units,candidateDossiers:[],authorAgentIds:['extractor']};
 const packetBytes=Buffer.from(JSON.stringify(packet,null,2)+'\n'),sourceHash=identityArtifactHash(packetBytes),transports=splitChapterIdentityReviewTransport(compactChapterIdentityReviewPacket(packet),maxBytes);
 const partReports=transports.map((t,i)=>({schemaVersion:1,planFingerprint:'plan',reviewer:{agentId:`reviewer-${i}`,name:'Independent reviewer'},reviews:t.reviewCases.map(c=>({caseId:c.caseId,verdict:'approve'}))}));
 const producers=partReports.map(r=>r.reviewer.agentId),report=assembleChapterIdentityReviewParts(packet.plan,transports,partReports,producers,packet.authorAgentIds),reportBytes=Buffer.from(JSON.stringify(report));
 const artifacts=transports.map((t,i)=>({transportBytes:Buffer.from(JSON.stringify(t)+'\n'),reportBytes:Buffer.from(JSON.stringify(partReports[i]))}));
 const parts=artifacts.map((a,i)=>({schemaVersion:1,kind:'captured-independent-identity-review-part',phase:'report-recorded',agentId:producers[i],runId:`actual-run-${i}`,sourcePacketSha256:sourceHash,transportSha256:identityArtifactHash(a.transportBytes),reportSha256:identityArtifactHash(a.reportBytes)}));
 const job={schemaVersion:1,kind:'captured-independent-identity-review-parts',phase:'report-recorded',scope,agentId:producers[0],runId:parts[0].runId,sourcePacketSha256:sourceHash,reportSha256:identityArtifactHash(reportBytes),transportPolicy:identityReviewTransportPolicy(maxBytes),parts};
 return {packetBytes,reportBytes,job,artifacts,transports,packet};
}
test('native capture reproduces nine default parts, preserves all producers, and retains an explicitly pinned larger layout',()=>{
 for(const [bound,count] of [[DEFAULT_IDENTITY_REVIEW_PART_BYTES,9],[MAX_IDENTITY_REVIEW_TRANSPORT_BYTES,2]]){
  const f=largeCapturedFixture(bound),record=()=>createIdentityReviewBundle(f.packetBytes,f.reportBytes,f.job,null,f.artifacts);
  assert.equal(f.transports.length,count);const bundle=record();assert.equal(bundle.report.reviews.length,9);assert.deepEqual(bundle.receipt.reviewParts.map(p=>p.agentId),f.job.parts.map(p=>p.agentId));
  const transport=compactChapterIdentityReviewPacket(f.packet),transportBytes=Buffer.from(JSON.stringify(transport)+'\n');
  const prepared={packet:f.packet,transport,reviewParts:f.transports,receipt:{transportPolicy:f.job.transportPolicy,packetBytes:f.packetBytes.length,sourcePacketSha256:identityArtifactHash(f.packetBytes),transportBytes:transportBytes.length,transportSha256:identityArtifactHash(transportBytes),reviewParts:f.transports.map((p,i)=>({file:`transport-part-${String(i+1).padStart(3,'0')}.json`,bytes:f.artifacts[i].transportBytes.length,sha256:identityArtifactHash(f.artifacts[i].transportBytes),caseIds:p.reviewCases.map(c=>c.caseId)}))}};
  assert.deepEqual(validatePreparedIdentityReviewArtifacts(prepared).sourceBytes,f.packetBytes);
  const policy=f.job.transportPolicy;delete f.job.transportPolicy;assert.throws(record,/Explicit sealed identity transport policy/);f.job.transportPolicy=policy;
  f.job.runId='invented-run';assert.throws(record,/actual contributor/);
 }
 const f=largeCapturedFixture(MAX_IDENTITY_REVIEW_TRANSPORT_BYTES);f.job.transportPolicy=identityReviewTransportPolicy();
 assert.throws(()=>createIdentityReviewBundle(f.packetBytes,f.reportBytes,f.job,null,f.artifacts),/All captured independent review parts/);
});
