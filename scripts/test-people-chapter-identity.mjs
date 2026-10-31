import test from 'node:test';
import assert from 'node:assert/strict';
import { localNameKeys } from './lib/people-resolution.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { buildIdentityDossierIndex, planChapterIdentityReview } from './lib/people-identity-dossiers.mjs';
import { acceptedCatalogIdentityView, validateChapterIdentityBundle, assertReviewedIdentityCoverage,
  applyReviewedIdentityUncertainty, IDENTITY_UNCERTAINTY_NOTE, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint } from './lib/people-chapter-identity.mjs';
const inputs = Object.fromEntries(['source','extraction','editorial','dateAudit'].map((k,i)=>[k,`sha256:${String(i+1).repeat(64)}`]));
function fixture() {
  const localId='fixture:001:p001', anchorId='fixture:002:p001';
  const make=id=>({localId:id,book:'fixture',chapter:id.split(':')[1],promptVersion:7,preferredNameSuggestion:{en:'Wang Wei',zh:'王偉'},
    claims:[{id:id+':c0001',subject:id,predicate:'name',value:{kind:'personal-name',en:'Wang Wei',zh:'王偉'},certainty:'explicit',evidence:[id.split(':').slice(0,2).join(':')+':s0001']}]});
  const own=make(localId),anchor=make(anchorId),people=new Map([[localId,own],[anchorId,anchor]]),clusters=[{canonicalPersonId:'per_test',localPeople:[localId,anchorId],retiredIds:['per_old']}];
  const index=buildIdentityDossierIndex(people,clusters,localNameKeys),scope={book:'fixture',chapter:'001'},plan=planChapterIdentityReview(index,scope,inputs,{maxDossiersPerCase:8,maxKeysPerCase:16,maxPostingReadsPerKey:8}),item=plan.cases[0];
  const report={schemaVersion:1,planFingerprint:plan.fingerprint,reviewer:{agentId:'independent-reviewer',name:'Independent reviewer'},reviews:[{
    caseId:item.id,verdict:'approve',canonicalPersonId:item.canonicalPersonId,membershipReviewed:true,membershipFingerprint:item.canonicalMembership.fingerprint,
    ambiguityReviewed:true,unresolvedIdentity:true,reason:'Source identifies the named individual; independent cross-chapter equivalence remains uncertain.',
    sourceWitnesses:[localId,anchorId].map(id=>({localId:id,book:'fixture',chapter:id.split(':')[1],unitId:'s0001',quote:'王偉'}))}]};
  const bundle={schemaVersion:1,kind:'chapter-identity-review',scope,plan,report,receipt:{actualReviewerAgentId:'independent-reviewer',authorAgentIds:['actual-extractor','host-author'],planFingerprint:plan.fingerprint,reportFingerprint:peopleDigest(report)}};
  const sources=new Map([own,anchor].map(person=>['fixture:'+person.chapter,{extraction:{book:'fixture',chapter:person.chapter,run:{agentId:'actual-extractor'}},localPeople:new Map([[person.localId,person]]),packet:{units:[{id:'s0001',zh:'王偉至。'}]}}]));
  bundle.receipt.chapterChinese=chapterChineseEvidenceFingerprint(sources.get('fixture:001').packet);
  bundle.receipt.sourcePeople=[own,anchor].map(person=>({localId:person.localId,fingerprint:identitySourceEvidenceFingerprint(person,sources.get('fixture:'+person.chapter).packet)}));
  const catalog={localPersonMap:Object.fromEntries(index.localPersonMap),people:[{id:'per_test',localPeople:[localId,anchorId],retiredIds:['per_old'],curation:{notes:[]}}]};
  return {index,scope,inputs,bundle,sources,catalog,view:acceptedCatalogIdentityView(catalog),corpus:{localPeople:new Map([[localId,own]])}};
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
