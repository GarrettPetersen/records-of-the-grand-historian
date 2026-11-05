import test from 'node:test';
import assert from 'node:assert/strict';
import { splitChapterIdentityReviewTransport, assembleChapterIdentityReviewParts } from './lib/people-identity-review-transport.mjs';
import { extractionAuthorAgentIds } from './lib/people-extraction-authorship.mjs';
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
