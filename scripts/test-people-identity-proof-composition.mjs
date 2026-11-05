import test from 'node:test';
import assert from 'node:assert/strict';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';
import { buildIdentityDossierIndex, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from './lib/people-identity-dossiers.mjs';
import { localNameKeys } from './lib/people-resolution.mjs';
import { compactChapterIdentityReviewPacket, splitChapterIdentityReviewTransport, assembleChapterIdentityReviewParts, identityReviewTransportPolicy } from './lib/people-identity-review-transport.mjs';
import { createIdentityReviewBundle } from './lib/people-identity-review-record.mjs';
import { captureIdentityProofComponent, reconcileIdentityProofComposition } from './lib/people-identity-proof-composition.mjs';
import { validateChapterIdentityBundle, assertReviewedIdentityCoverage, applyReviewedIdentityUncertainty, IDENTITY_UNCERTAINTY_NOTE } from './lib/people-chapter-identity.mjs';

const inputs = Object.fromEntries(['source','extraction','editorial','dateAudit'].map(k => [k,peopleDigest(k)]));
const bytes = object => Buffer.from(JSON.stringify(object,null,2)+'\n');
function fixture(uncertain=true) {
  const people=new Map(), sources=new Map(), clusters=[], names=[{ en:'Wang Wei',zh:'王偉' },{ en:'Li Zhong',zh:'李忠' }];
  for (const [i,name] of names.entries()) {
    const own=`fixture:001:p00${i+1}`, anchor=`fixture:00${i+2}:p001`;
    for (const id of [own,anchor]) {
      const chapter=id.split(':')[1], key='fixture:'+chapter, zh=chapter==='001' ? '王偉至。李忠至。' : name.zh+'至。', en=chapter==='001' ? 'Wang Wei and Li Zhong arrived.' : name.en+' arrived.';
      const person={ localId:id,book:'fixture',chapter,promptVersion:7,historicity:'historical',descriptorSuggestion:'Official',preferredNameSuggestion:name,
        identityHints:{activeDateHints:[]},claims:[{id:`fixture:${chapter}:c00${i+1}`,subject:id,predicate:'name',value:{kind:'personal',...name},certainty:'explicit',evidence:[key+':s0001']}],
        mentions:[{id:id+':m001',person:id,unit:{id:'s0001'},kind:'personal-name',spans:{zh:[{exact:name.zh,occurrence:0,startCodePoint:zh.indexOf(name.zh),endCodePoint:zh.indexOf(name.zh)+name.zh.length,unitTextHash:'sha256:'+identityArtifactHash(Buffer.from(zh))}],en:[{exact:name.en,occurrence:0,startCodePoint:en.indexOf(name.en),endCodePoint:en.indexOf(name.en)+name.en.length,unitTextHash:'sha256:'+identityArtifactHash(Buffer.from(en))}]},candidateRefs:['native-scanner-reference']}] };
      people.set(id,person);
      if(!sources.has(key)) sources.set(key,{ extraction:{book:'fixture',chapter,run:{agentId:'actual-extractor'}},localPeople:new Map(),packet:{units:[{id:'s0001',zh,en,literal:en,kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:0}]} });
      sources.get(key).localPeople.set(id,person);
    }
    clusters.push({canonicalPersonId:'per_'+i,localPeople:[own,anchor],retiredIds:[]});
  }
  const scope={book:'fixture',chapter:'001'}, index=buildIdentityDossierIndex(people,clusters,localNameKeys), plan=planChapterIdentityReview(index,scope,inputs,IDENTITY_REVIEW_LIMITS);
  const makeCapture=(currentPlan,item,reviewer,verdict='approve')=>{
    const packet={schemaVersion:1,kind:'source-chapter-dossier-review-packet',scope,plan:currentPlan,reviewCaseIds:[item.id],authorAgentIds:['actual-extractor'],
      people:[...people.values()],units:[...sources].flatMap(([key,s])=>s.packet.units.map(u=>({book:'fixture',chapter:key.split(':')[1],...u}))),candidateDossiers:[],requiredReport:{},instructions:'Independent authored fixture only.'};
    const report={schemaVersion:1,planFingerprint:currentPlan.fingerprint,reviewer:{agentId:reviewer,name:reviewer},reviews:[{caseId:item.id,verdict,canonicalPersonId:item.canonicalPersonId,
      membershipReviewed:true,membershipFingerprint:item.canonicalMembership.fingerprint,ambiguityReviewed:true,unresolvedIdentity:uncertain,
      reason:verdict==='approve'?'The primary Chinese identifies the person and accepted canonical anchor.':'Concrete chapter attribution requires correction before approval.',
      sourceWitnesses:[...new Set([...item.localPeople,item.canonicalMembership.anchorLocalId])].map(id=>({localId:id,book:'fixture',chapter:id.split(':')[1],unitId:'s0001',quote:people.get(id).preferredNameSuggestion.zh}))}]};
    const packetBytes=bytes(packet),reportBytes=bytes(report),transportBytes=Buffer.from(JSON.stringify(compactChapterIdentityReviewPacket(packet))+'\n');
    const job={schemaVersion:1,kind:'captured-independent-identity-review',phase:'report-recorded',scope,agentId:reviewer,runId:reviewer+'-actual-run',sourcePacketSha256:identityArtifactHash(packetBytes),reportSha256:identityArtifactHash(reportBytes),transportSha256:identityArtifactHash(transportBytes)};
    return { ...captureIdentityProofComponent(packetBytes,reportBytes,transportBytes,job,identityReviewTransportPolicy()),packetBytes,reportBytes,transportBytes,job };
  };
  const captured=plan.cases.map((item,i)=>makeCapture(plan,item,'reviewer-'+i));
  const view={localPersonMap:index.localPersonMap,canonicalByKnownId:index.canonicalByKnownId};
  const bundle=(components=captured.map(c=>c.component),currentPlan=plan,parents=[])=>{
    const result=reconcileIdentityProofComposition(view,sources,currentPlan,parents,components);
    return {schemaVersion:1,kind:'chapter-identity-review-composition',scope,plan:currentPlan,sourcePlans:parents,components,selections:result.selections};
  };
  return {people,sources,clusters,index,view,scope,plan,captured,makeCapture,bundle};
}
const validate=(f,b=f.bundle())=>validateChapterIdentityBundle(f.view,f.sources,f.scope,b,inputs);

test('actual independent components certify complete coverage without rewriting original report bytes or fingerprints',()=>{
  const f=fixture(),original=f.captured.map(c=>c.reportBytes.toString()),bundle=f.bundle(),certificate=validate(f,bundle);
  assert.equal(certificate.retained.length,2); assert.equal(certificate.reviewers.length,2);
  assertReviewedIdentityCoverage(f.sources.get('fixture:001'),f.view,[certificate]);
  for(const [i,c] of bundle.components.entries()) {assert.equal(c.reportText,original[i]);assert.equal(JSON.parse(c.reportText).planFingerprint,f.plan.fingerprint);}
  assert.equal(certificate.publicationApproval,false);assert.equal(certificate.grantsNewMerges,false);
  const catalog={people:[{id:'per_0',curation:{notes:[]}}]};applyReviewedIdentityUncertainty(catalog,[certificate]);assert.deepEqual(catalog.people[0].curation.notes,[IDENTITY_UNCERTAINTY_NOTE]);
  assert.throws(()=>assertReviewedIdentityCoverage(f.sources.get('fixture:001'),f.view,[JSON.parse(JSON.stringify(certificate))]),/current validated report/u);
});
test('partial reusable coverage stays explicit and cannot qualify a chapter',()=>{
  const f=fixture(),components=[f.captured[0].component],result=reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],components);
  assert.equal(result.eligible.size,1);assert.equal(result.remainingCaseIds.length,1);assert.throws(()=>validate(f,f.bundle(components)),/Incomplete/u);
});
test('native-validated bookkeeping changes reuse proofs while preserving exact name occurrences',()=>{
  const f=fixture();
  for(const source of f.sources.values())for(const person of source.localPeople.values())for(const m of person.mentions){m.id+='-renumbered';m.candidateRefs=['changed'];for(const spans of Object.values(m.spans))for(const s of spans){s.startCodePoint++;s.endCodePoint++;s.unitTextHash='current-validated-hash';}}
  assert.equal(validate(f).retained.length,2);
});
test('changed claims, person attributes, occurrences and full Chinese remain explicit new work',()=>{
  for(const mutate of [p=>p.claims[0].certainty='strongly-inferred',p=>p.preferredNameSuggestion={...p.preferredNameSuggestion,en:'Different'},p=>p.historicity='legendary',p=>p.mentions[0].spans.zh[0].occurrence++,p=>p.mentions[0].spans.en[0].exact+=' X']){
    const f=fixture();mutate(f.sources.get('fixture:001').localPeople.values().next().value);
    assert(reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],f.captured.map(c=>c.component)).remainingCaseIds.length>0);
  }
  const f=fixture();f.sources.get('fixture:001').packet.units.push({id:'s0002',zh:'新名至。'});assert.throws(()=>validate(f),/Incomplete/u);
});
test('tampered original bytes, wrong capture hashes and changed original plan fail loudly',()=>{
  const f=fixture(),bad=structuredClone(f.captured[0].component);bad.reportText+=' ';
  assert.throws(()=>f.bundle([bad]),/Changed identity component/u);
  const c=f.captured[0];assert.throws(()=>captureIdentityProofComponent(c.packetBytes,c.reportBytes,c.transportBytes,{...c.job,reportSha256:'0'.repeat(64)},identityReviewTransportPolicy()),/capture bytes/u);
  const b=f.bundle();b.plan.metrics.generatedPairs=1;assert.throws(()=>validate(f,b),/invalid original/u);
});
test('current extractors cannot become their own independent proof reviewers',()=>{
  const f=fixture();f.sources.get('fixture:001').extraction.run.agentId='reviewer-0';assert.throws(()=>validate(f),/extractor cannot independently/u);
});
test('journal-only and aggregate-only authors are excluded from independent component capture',()=>{
  const f=fixture(),c=f.captured[0];
  assert.throws(()=>captureIdentityProofComponent(c.packetBytes,c.reportBytes,c.transportBytes,{...c.job,authorAgentIds:[c.job.agentId]},identityReviewTransportPolicy()),/capture provenance/u);
  const aggregate={...c.job,kind:'captured-independent-identity-review-parts',authorAgentIds:[c.job.agentId],parts:[c.job]};
  assert.throws(()=>captureIdentityProofComponent(c.packetBytes,c.reportBytes,c.transportBytes,c.job,identityReviewTransportPolicy(),aggregate),/capture provenance/u);
  assert.throws(()=>captureIdentityProofComponent(c.packetBytes,c.reportBytes,c.transportBytes,c.job,identityReviewTransportPolicy(),{...aggregate,parts:[]}),/does not contain/u);
});
test('new target people, changed assignments and forged selections cannot disappear from publication coverage',()=>{
  const f=fixture();f.sources.get('fixture:001').localPeople.set('fixture:001:p999',{...f.people.values().next().value,localId:'fixture:001:p999',claims:[],mentions:[]});f.view.localPersonMap.set('fixture:001:p999','per_0');assert.throws(()=>validate(f),/coverage changed/u);
  const g=fixture();g.view.localPersonMap.set('fixture:001:p001','per_1');assert.throws(()=>validate(g),/assignment|membership/u);
  const h=fixture(),b=h.bundle();b.selections=[];assert.throws(()=>validate(h,b),/Incomplete/u);
});
test('a still-current concrete hold remains blocked rather than losing to an old approval',()=>{
  const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold');
  const components=[...f.captured.map(c=>c.component),held.component],result=reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],components);
  assert.equal(result.held.length,1);assert.equal(result.remainingCaseIds.length,1);assert.throws(()=>validate(f,f.bundle(components)),/held/u);
});
test('duplicate eligible proofs fail instead of silently choosing a producer',()=>{
  const f=fixture(),other=f.makeCapture(f.plan,f.plan.cases[0],'another-reviewer');assert.throws(()=>f.bundle([...f.captured.map(c=>c.component),other.component]),/Duplicate eligible/u);
});
test('remaining-case transport preserves the full parent plan and complete target Chinese',()=>{
  const f=fixture(),c=f.captured[0],t=JSON.parse(c.transportBytes);assert.equal(t.reviewCases.length,1);assert.equal(t.units.filter(u=>u.chapter==='001').length,1);assert.equal(t.planFingerprint,f.plan.fingerprint);
  const p=JSON.parse(c.packetBytes);p.reviewCaseIds=['unknown'];assert.throws(()=>compactChapterIdentityReviewPacket(p),/plan subset/u);
});
test('fresh captured remaining parts compose with prior approvals across different original plan fingerprints',()=>{
  const f=fixture(),retained=f.bundle([f.captured[0].component]),next=planChapterIdentityReview(f.index,f.scope,{...inputs,dateAudit:peopleDigest('new-date-envelope')},IDENTITY_REVIEW_LIMITS);
  const fresh=f.makeCapture(next,next.cases[1],'fresh-independent'),packet=JSON.parse(fresh.packetBytes);packet.retainedIdentityProof=retained;
  const packetBytes=bytes(packet),compact=compactChapterIdentityReviewPacket(packet),whole=Buffer.byteLength(JSON.stringify(compact)+'\n');
  const projected=Buffer.byteLength(JSON.stringify(splitChapterIdentityReviewTransport(compact,768*1024)[0])+'\n');
  assert(projected<whole);const policy=identityReviewTransportPolicy(Math.floor((whole+projected)/2)),transport=splitChapterIdentityReviewTransport(compact,policy.maxBytes)[0];
  const transportBytes=Buffer.from(JSON.stringify(transport)+'\n'),job={...fresh.job,kind:'captured-independent-identity-review-part',sourcePacketSha256:identityArtifactHash(packetBytes),transportSha256:identityArtifactHash(transportBytes)};
  const aggregate={...job,kind:'captured-independent-identity-review-parts',authorAgentIds:['actual-extractor'],transportPolicy:policy,parts:[job]};
  assert.throws(()=>captureIdentityProofComponent(packetBytes,fresh.reportBytes,transportBytes,job,policy),/requires its exact aggregate author journal/u);
  const component=captureIdentityProofComponent(packetBytes,fresh.reportBytes,transportBytes,job,policy,aggregate).component;
  assert.equal(createIdentityReviewBundle(packetBytes,fresh.reportBytes,aggregate,null,[{transportBytes,reportBytes:fresh.reportBytes}]).report.reviews.length,1);
  const assembled=assembleChapterIdentityReviewParts(next,[transport],[JSON.parse(fresh.reportBytes)],[job.agentId],['actual-extractor'],[next.cases[1].id]);
  assert.equal(assembled.reviews.length,1);assert.equal(assembled.planFingerprint,next.fingerprint);
  const result=f.bundle([f.captured[0].component,component],next,[f.plan]);const certificate=validate(f,result);
  assert.equal(certificate.retained.length,2);assert.equal(JSON.parse(result.components[0].reportText).planFingerprint,f.plan.fingerprint);
  assert.equal(JSON.parse(result.components[1].reportText).planFingerprint,next.fingerprint);
});
test('changed bounded candidates preserve already reviewed uncertainty but cannot invent new certainty',()=>{
  for(const uncertain of [true,false]){
    const f=fixture(uncertain),person=structuredClone(f.people.get('fixture:001:p001'));person.localId='fixture:004:p001';person.chapter='004';
    for(const c of person.claims){c.subject=person.localId;c.evidence=['fixture:004:s0001'];}
    const all=new Map(f.people);all.set(person.localId,person);const index=buildIdentityDossierIndex(all,[...f.clusters,{canonicalPersonId:'per_new',localPeople:[person.localId],retiredIds:[]}],localNameKeys);
    const current=planChapterIdentityReview(index,f.scope,inputs,IDENTITY_REVIEW_LIMITS),result=reconcileIdentityProofComposition({localPersonMap:index.localPersonMap,canonicalByKnownId:index.canonicalByKnownId},f.sources,current,[f.plan],f.captured.map(c=>c.component));
    assert.equal(result.remainingCaseIds.length,uncertain?0:1);
  }
});
