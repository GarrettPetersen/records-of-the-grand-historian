import test from 'node:test';
import assert from 'node:assert/strict';
import { localNameKeys } from './lib/people-resolution.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { buildIdentityDossierIndex, planChapterIdentityReview } from './lib/people-identity-dossiers.mjs';
import { acceptedCatalogIdentityView, validateChapterIdentityBundle, assertReviewedIdentityCoverage,
  applyReviewedIdentityUncertainty, IDENTITY_UNCERTAINTY_NOTE, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint } from './lib/people-chapter-identity.mjs';
const inputs = Object.fromEntries(['source','extraction','editorial','dateAudit'].map((k,i)=>[k,`sha256:${String(i+1).repeat(64)}`]));
function fixture(count=1) {
  const names=[{en:'Wang Wei',zh:'王偉'},{en:'Li Zhong',zh:'李忠'}].slice(0,count),people=new Map(),clusters=[],sources=new Map();
  const chapterText=names.map(name=>name.zh+'至。').join('');
  for(const [i,name] of names.entries()){
    const localId=`fixture:001:p00${i+1}`,anchorId=`fixture:00${i+2}:p001`;
    const make=id=>({localId:id,book:'fixture',chapter:id.split(':')[1],promptVersion:7,preferredNameSuggestion:name,
      claims:[{id:id+':c0001',subject:id,predicate:'name',value:{kind:'personal-name',...name},certainty:'explicit',evidence:[id.split(':').slice(0,2).join(':')+':s0001']}]});
    for(const person of [make(localId),make(anchorId)]){
      people.set(person.localId,person);const key='fixture:'+person.chapter;
      if(!sources.has(key))sources.set(key,{extraction:{book:'fixture',chapter:person.chapter,run:{agentId:'actual-extractor'}},localPeople:new Map(),packet:{units:[{id:'s0001',zh:person.chapter==='001'?chapterText:name.zh+'至。'}]}});
      sources.get(key).localPeople.set(person.localId,person);
    }
    clusters.push({canonicalPersonId:i===0?'per_test':'per_second',localPeople:[localId,anchorId],retiredIds:i===0?['per_old']:[]});
  }
  const index=buildIdentityDossierIndex(people,clusters,localNameKeys),scope={book:'fixture',chapter:'001'},plan=planChapterIdentityReview(index,scope,inputs,{maxDossiersPerCase:8,maxKeysPerCase:16,maxPostingReadsPerKey:8});
  const report={schemaVersion:1,planFingerprint:plan.fingerprint,reviewer:{agentId:'independent-reviewer',name:'Independent reviewer'},reviews:plan.cases.map(item=>({
    caseId:item.id,verdict:'approve',canonicalPersonId:item.canonicalPersonId,membershipReviewed:true,membershipFingerprint:item.canonicalMembership.fingerprint,
    ambiguityReviewed:true,unresolvedIdentity:true,reason:'Source identifies the named individual; independent cross-chapter equivalence remains uncertain.',
    sourceWitnesses:clusters.find(c=>c.canonicalPersonId===item.canonicalPersonId).localPeople.map(id=>({localId:id,book:'fixture',chapter:id.split(':')[1],unitId:'s0001',quote:people.get(id).preferredNameSuggestion.zh}))}))};
  const bundle={schemaVersion:1,kind:'chapter-identity-review',scope,plan,report,receipt:{actualReviewerAgentId:'independent-reviewer',authorAgentIds:['actual-extractor','host-author'],planFingerprint:plan.fingerprint,reportFingerprint:peopleDigest(report)}};
  bundle.receipt.chapterChinese=chapterChineseEvidenceFingerprint(sources.get('fixture:001').packet);
  bundle.receipt.sourcePeople=[...people.values()].map(person=>({localId:person.localId,fingerprint:identitySourceEvidenceFingerprint(person,sources.get('fixture:'+person.chapter).packet)}));
  const catalog={localPersonMap:Object.fromEntries(index.localPersonMap),people:clusters.map(c=>({id:c.canonicalPersonId,localPeople:c.localPeople,retiredIds:c.retiredIds,curation:{notes:[]}}))};
  return {index,scope,inputs,bundle,sources,catalog,view:acceptedCatalogIdentityView(catalog),corpus:{localPeople:new Map(sources.get('fixture:001').localPeople)}};
}
const validate=f=>validateChapterIdentityBundle(f.view,f.sources,f.scope,f.bundle,f.inputs);
test('independent person proof qualifies retained assignments and preserves uncertainty visibly',()=>{
 const f=fixture(),certificate=validate(f);assertReviewedIdentityCoverage(f.corpus,f.view,[certificate]);
 applyReviewedIdentityUncertainty(f.catalog,[certificate]);assert.deepEqual(f.catalog.people[0].curation.notes,[IDENTITY_UNCERTAINTY_NOTE]);
 assert.equal(certificate.grantsNewMerges,false);assert.equal(certificate.publicationApproval,false);
});
test('serialized certificates and missing proof coverage cannot confer authority',()=>{
 const f=fixture(),certificate=validate(f);assert.throws(()=>assertReviewedIdentityCoverage(f.corpus,f.view,[structuredClone(certificate)]),/current validated report/);
 assert.throws(()=>assertReviewedIdentityCoverage(f.corpus,f.view,[]),/Missing independent/);
 assert.throws(()=>assertReviewedIdentityCoverage(f.corpus,f.view,[certificate,certificate]),/Duplicate/);
});
test('changed source anchor and split accepted membership invalidate proof',()=>{
 const f=fixture();f.sources.get('fixture:002').localPeople.values().next().value.claims[0].value.zh='王忠';assert.throws(()=>validate(f),/context or person evidence/);
 const g=fixture();g.view.localPersonMap.set('fixture:002:p001','per_other');assert.throws(()=>validate(g),/membership/);
});
test('actual extractor provenance and preserved transport bytes are required',()=>{
 const f=fixture();f.bundle.receipt.authorAgentIds=['host-author'];assert.throws(()=>validate(f),/Actual extraction author/);
 const g=fixture();g.bundle.report.reviews[0].reason='An edited report must not keep its old receipt.';assert.throws(()=>validate(g),/transport receipt/);
});
test('held cases fail while unchanged identity proofs survive a new current envelope',()=>{
 const f=fixture();f.bundle.report.reviews[0].verdict='hold';f.bundle.receipt.reportFingerprint=peopleDigest(f.bundle.report);assert.throws(()=>validate(f),/held/);
 const g=fixture();g.inputs={...g.inputs,editorial:`sha256:${'f'.repeat(64)}`};const c=validate(g);assert.equal(c.unchangedSourceProofsReused,true);assert.deepEqual(c.reviewedInputs,g.bundle.plan.inputs);assert.deepEqual(c.currentInputs,g.inputs);assert.notDeepEqual(c.reviewedInputs,c.currentInputs);assertReviewedIdentityCoverage(g.corpus,g.view,[c]);
});

test('a surviving name quote cannot hide changed primary narrative context',()=>{
 const f=fixture();f.sources.get('fixture:002').packet.units[0].zh='非王偉至。';assert.throws(()=>validate(f),/primary context or person evidence changed/);
});

test('a new actor in an unmentioned Chinese unit cannot reuse the old chapter proof',()=>{
 const f=fixture();f.sources.get('fixture:001').packet.units.push({id:'s0002',zh:'李忠至。'});
 assert.throws(()=>validate(f),/chapter Chinese source or unit inventory changed/);
});

test('chunked extraction identities require every actual author and preserve reviewer independence',()=>{
 const f=fixture(),own=f.sources.get('fixture:001');own.extraction.run={agentId:null,chunks:[{agentId:'chunk-author-a'},{agentId:'chunk-author-b'}]};f.bundle.receipt.authorAgentIds=['chunk-author-a','chunk-author-b','host-author'];assert.doesNotThrow(()=>validate(f));
 f.bundle.receipt.authorAgentIds=['chunk-author-a'];assert.throws(()=>validate(f),/Actual extraction author missing/);
 const g=fixture();g.sources.get('fixture:001').extraction.run={agentId:null,chunks:[{agentId:'independent-reviewer'}]};g.bundle.receipt.authorAgentIds=['independent-reviewer'];assert.throws(()=>validate(g),/independent reviewer/);
 const h=fixture();h.sources.get('fixture:001').extraction.run={agentId:null,chunks:[{agentId:null}]};assert.throws(()=>validate(h),/every chunk/);
});

test('captured part receipts bind every reviewed case and retain actual producer metadata',()=>{
 const f=fixture(),rows=f.bundle.report.reviews;f.bundle.receipt.reviewParts=[{agentId:'independent-reviewer',runId:'actual-part-run',packetSha256:'a'.repeat(64),transportSha256:'b'.repeat(64),reportSha256:'c'.repeat(64),caseIds:rows.map(r=>r.caseId),reviewsFingerprint:peopleDigest(rows)}];assert.doesNotThrow(()=>validate(f));
 f.bundle.report.reviews[0].reason+=' Changed after capture.';f.bundle.receipt.reportFingerprint=peopleDigest(f.bundle.report);assert.throws(()=>validate(f),/part reviews changed/);
 const g=fixture();g.bundle.receipt.reviewParts=[];assert.throws(()=>validate(g),/parts are missing/);
});

test('full source revalidation accepts different independent part producers and rejects an extractor in any part',()=>{
 const f=fixture(2),rows=f.bundle.report.reviews;
 f.bundle.receipt.reviewParts=rows.map((row,i)=>({agentId:i===0?'independent-reviewer':'second-independent-reviewer',runId:`actual-run-${i}`,packetSha256:'a'.repeat(64),transportSha256:'b'.repeat(64),reportSha256:'c'.repeat(64),caseIds:[row.caseId],reviewsFingerprint:peopleDigest([row])}));
 assert.equal(validate(f).retained.length,2);
 f.bundle.receipt.reviewParts[1].agentId='actual-extractor';assert.throws(()=>validate(f),/identity part provenance/);
 f.bundle.receipt.reviewParts[1].agentId='second-independent-reviewer';f.bundle.receipt.reviewParts[0].agentId='unrelated-reviewer';assert.throws(()=>validate(f),/did not contribute/);
});
