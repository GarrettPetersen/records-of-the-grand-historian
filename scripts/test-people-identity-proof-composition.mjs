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
import { selectedIdentityUncertainty, acceptedIdentityUncertaintyInstruction, assertIdentityUncertaintyPreserved } from './lib/people-identity-uncertainty.mjs';

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

test('accepted uncertainty cannot become certainty from empty bounded candidates or fresh native approval',()=>{
  const old=fixture(true), fresh=fixture(false), before=old.bundle(), after=fresh.bundle();
  // Native certification alone permits certainty for an empty candidate search.
  assert.equal(validate(fresh,after).ambiguity.length,0);
  assert(after.plan.cases.every(item=>item.candidateDossiers.length===0));
  const original=JSON.stringify(after);
  assert.throws(()=>assertIdentityUncertaintyPreserved(before,after),/positive source-backed reconciliation/u);
  assert.equal(JSON.stringify(after),original,'preflight must not edit reviewer decisions');
  const instruction=acceptedIdentityUncertaintyInstruction(after.plan,before);
  assert(instruction.includes(after.plan.cases[0].id));assert(instruction.includes('regardless of the generated proposal'));
  const packet=JSON.parse(fresh.captured[0].packetBytes);packet.instructions+=instruction;
  assert.equal(compactChapterIdentityReviewPacket(packet).instructions,packet.instructions);
});
test('uncertainty preflight compares all selected assignments and preserves retained decisions',()=>{
  const f=fixture(),before=f.bundle(),after=f.bundle(),original=JSON.stringify(before);
  assert.equal(assertIdentityUncertaintyPreserved(before,after).length,2);
  assert.equal([...selectedIdentityUncertainty(after).values()].filter(row=>row.unresolvedIdentity).length,2);
  assert.equal(JSON.stringify(before),original);
  const certain=fixture(false);assert.equal(assertIdentityUncertaintyPreserved(certain.bundle(),after).length,2);
  const bad=structuredClone(after);bad.components[0].reportText+=' ';
  assert.throws(()=>assertIdentityUncertaintyPreserved(before,bad),/Changed selected uncertainty component/u);
  assert.throws(()=>assertIdentityUncertaintyPreserved(before,{...after,scope:{book:'other',chapter:'001'}}),/scope changed/u);
});

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

function singletonFixture(){
 const f=fixture(),clusters=[...f.people.keys()].map((id,i)=>({canonicalPersonId:'per_singleton_'+i,localPeople:[id],retiredIds:[]}));
 const index=buildIdentityDossierIndex(f.people,clusters,localNameKeys),plan=planChapterIdentityReview(index,f.scope,inputs,IDENTITY_REVIEW_LIMITS),captured=plan.cases.map((item,i)=>f.makeCapture(plan,item,'singleton-reviewer-'+i));
 const next=()=>{const index=buildIdentityDossierIndex(f.people,clusters,localNameKeys);return{index,plan:planChapterIdentityReview(index,f.scope,inputs,IDENTITY_REVIEW_LIMITS),view:{localPersonMap:index.localPersonMap,canonicalByKnownId:index.canonicalByKnownId}};};
 return{...f,clusters,plan,captured,next};
}
test('singleton generated claim-label churn reuses exact semantic proofs without retagging original reports',()=>{
 const f=singletonFixture(),original=f.captured.map(c=>c.component.reportText);for(const p of f.sources.get('fixture:001').localPeople.values())p.claims[0].id+='-renumbered';
 const n=f.next(),result=reconcileIdentityProofComposition(n.view,f.sources,n.plan,[f.plan],f.captured.map(c=>c.component));assert.equal(result.eligible.size,2);assert.equal(result.remainingCaseIds.length,0);
 const bundle={schemaVersion:1,kind:'chapter-identity-review-composition',scope:f.scope,plan:n.plan,sourcePlans:[f.plan],components:f.captured.map(c=>c.component),selections:result.selections};
 assert.equal(validateChapterIdentityBundle(n.view,f.sources,f.scope,bundle,inputs).retained.length,2);
 for(const[i,c]of bundle.components.entries()){assert.equal(c.reportText,original[i]);assert.equal(JSON.parse(c.reportText).planFingerprint,f.plan.fingerprint);}
});
test('singleton reuse still invalidates changed facts or occurrences and preserves a current concrete hold',()=>{
 const f=singletonFixture();f.sources.get('fixture:001').localPeople.values().next().value.claims[0].value.en='Changed identity';const n=f.next();assert.equal(reconcileIdentityProofComposition(n.view,f.sources,n.plan,[f.plan],f.captured.map(c=>c.component)).remainingCaseIds.length,1);
 const g=singletonFixture(),held=g.makeCapture(g.plan,g.plan.cases[0],'actual-hold-reviewer','hold');for(const p of g.sources.get('fixture:001').localPeople.values())p.claims[0].id+='-renumbered';const m=g.next(),r=reconcileIdentityProofComposition(m.view,g.sources,m.plan,[g.plan],[held.component]);assert.equal(r.held.length,1);assert.equal(r.eligible.size,0);
});
test('bookkeeping reuse cannot cross a protected membership or anchor change, or a nonsingleton dossier',()=>{
 const f=fixture();for(const p of f.sources.get('fixture:001').localPeople.values())p.claims[0].id+='-renumbered';const index=buildIdentityDossierIndex(f.people,f.clusters,localNameKeys),plan=planChapterIdentityReview(index,f.scope,inputs,IDENTITY_REVIEW_LIMITS);
 assert.equal(reconcileIdentityProofComposition({localPersonMap:index.localPersonMap,canonicalByKnownId:index.canonicalByKnownId},f.sources,plan,[f.plan],f.captured.map(c=>c.component)).eligible.size,0);
 const g=singletonFixture(),n=g.next();n.plan.cases[0].canonicalMembership.protectedLocalPeople.push('fixture:002:p001');const {fingerprint,...body}=n.plan;n.plan={...body,fingerprint:peopleDigest(body)};assert.equal(reconcileIdentityProofComposition(n.view,g.sources,n.plan,[g.plan],g.captured.map(c=>c.component)).remainingCaseIds.length,1);
});
test('singleton bookkeeping projection still checks full Chinese coverage and every exact occurrence',()=>{
 const f=singletonFixture();for(const p of f.sources.get('fixture:001').localPeople.values())p.claims[0].id+='-renumbered';f.sources.get('fixture:001').packet.units.push({id:'s0002',zh:'另有新名。'});const n=f.next();assert.equal(reconcileIdentityProofComposition(n.view,f.sources,n.plan,[f.plan],f.captured.map(c=>c.component)).eligible.size,0);
 const g=singletonFixture();for(const p of g.sources.get('fixture:001').localPeople.values())p.claims[0].id+='-renumbered';g.sources.get('fixture:001').localPeople.values().next().value.mentions[0].spans.zh[0].occurrence++;const m=g.next();assert.equal(reconcileIdentityProofComposition(m.view,g.sources,m.plan,[g.plan],g.captured.map(c=>c.component)).remainingCaseIds.length,1);
});

function holdResolutionCapture(f, held, {reviewer=held.component.receipt.actualReviewerAgentId, runId='fresh-resolution-run', plan=f.plan, caseIndex=0, refs=[held.component.id], witness=null}={}) {
 const captured=f.makeCapture(plan,plan.cases[caseIndex],reviewer);
 const report=JSON.parse(captured.reportBytes); report.reviews[0].resolvesHolds=refs;
 if(witness!==null)report.reviews[0].sourceWitnesses[0].quote=witness;
 const reportBytes=bytes(report),job={...captured.job,runId,reportSha256:identityArtifactHash(reportBytes)};
 return captureIdentityProofComponent(captured.packetBytes,reportBytes,captured.transportBytes,job,identityReviewTransportPolicy()).component;
}
test('same reviewer can explicitly resolve the exact retained hold through a fresh current native capture',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold'),fresh=holdResolutionCapture(f,held);
 const original=held.component.reportText,components=[held.component,fresh,f.captured[1].component];
 const result=reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],components);
 assert.equal(result.held.length,0);assert.equal(result.remainingCaseIds.length,0);
 assert.equal(validate(f,f.bundle(components)).retained.length,2);
 assert.equal(held.component.reportText,original);assert.equal(JSON.parse(original).reviews[0].verdict,'hold');
 assert.throws(()=>validate(f,f.bundle([held.component,f.captured[1].component])),/held/);
});
test('a hold cannot be cleared by a different reviewer, the same run, or an unrelated hold reference',()=>{
 for(const opts of [{reviewer:'different-reviewer'},{runId:'hold-reviewer-actual-run'},{refs:[peopleDigest('unknown hold')]},{caseIndex:1}]) {
  const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold');
  const fresh=holdResolutionCapture(f,held,opts);
  assert.throws(()=>reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],[held.component,fresh]),/Hold resolution/);
 }
});
test('explicit resolution still passes native witness validation and closed component metadata',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold');
 assert.throws(()=>holdResolutionCapture(f,held,{refs:[]}),/component IDs/);
 assert.throws(()=>holdResolutionCapture(f,held,{refs:[held.component.id,held.component.id]}),/component IDs/);
 const fresh=holdResolutionCapture(f,held,{witness:'unrelated witness'});
 assert.throws(()=>reconcileIdentityProofComposition(f.view,f.sources,f.plan,[],[held.component,fresh]),/quote|Witness/);
});
test('hold resolution must be captured against the current plan even if old uncertain proof would be reusable',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold'),fresh=holdResolutionCapture(f,held);
 const {fingerprint,...body}=f.plan;body.inputs={...body.inputs,editorial:peopleDigest('new editorial bytes')};const next={...body,fingerprint:peopleDigest(body)};
 const result=reconcileIdentityProofComposition(f.view,f.sources,next,[f.plan],[held.component,fresh]);
 assert.deepEqual(result.remainingCaseIds,next.cases.map(c=>c.id));assert.equal(result.held.length,1);
 assert(result.invalidated.some(r=>r.componentId===fresh.id&&/current-plan/.test(r.reason)));
 assert.throws(()=>validateChapterIdentityBundle(f.view,f.sources,f.scope,{schemaVersion:1,kind:'chapter-identity-review-composition',scope:f.scope,plan:next,sourcePlans:[f.plan],components:[held.component,fresh],selections:result.selections},next.inputs),/Incomplete|held/);
});
test('compact transport discloses exact applicable hold references without dropping original composition',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold');
 const p=JSON.parse(held.packetBytes);p.retainedHolds=[{componentId:held.component.id,caseId:f.plan.cases[0].id,reason:'Concrete source attribution hold',reviewerAgentId:'hold-reviewer'}];
 const t=compactChapterIdentityReviewPacket(p);assert.deepEqual(t.retainedHolds,p.retainedHolds);
 p.reviewCaseIds=[f.plan.cases[1].id];assert.deepEqual(compactChapterIdentityReviewPacket(p).retainedHolds,[]);
});

function multiCaseResolutionCapture(f,held) {
 const original=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer');
 const packet=JSON.parse(original.packetBytes);packet.reviewCaseIds=f.plan.cases.map(c=>c.id);
 const report=JSON.parse(original.reportBytes);report.reviews[0].resolvesHolds=[held.component.id];
 report.reviews.push(JSON.parse(f.captured[1].reportBytes).reviews[0]);
 const packetBytes=bytes(packet),reportBytes=bytes(report),transportBytes=Buffer.from(JSON.stringify(compactChapterIdentityReviewPacket(packet))+'\n');
 const job={...original.job,runId:'old-multi-case-resolution-run',sourcePacketSha256:identityArtifactHash(packetBytes),reportSha256:identityArtifactHash(reportBytes),transportSha256:identityArtifactHash(transportBytes)};
 return captureIdentityProofComponent(packetBytes,reportBytes,transportBytes,job,identityReviewTransportPolicy()).component;
}
function nextEditorialPlan(plan) { const {fingerprint,...body}=plan;body.inputs={...body.inputs,editorial:peopleDigest('actually changed editorial generation')};return{...body,fingerprint:peopleDigest(body)}; }
test('a stale hold-binding row preserves sibling proofs and original captures but cannot qualify the chapter',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold'),old=multiCaseResolutionCapture(f,held),next=nextEditorialPlan(f.plan),original=JSON.stringify([held.component,old]);
 const r=reconcileIdentityProofComposition(f.view,f.sources,next,[f.plan],[held.component,old]);
 assert.deepEqual(r.remainingCaseIds,[next.cases[0].id]);assert.equal(r.eligible.size,1);assert.equal(r.held.length,1);assert.equal(r.eligible.get(next.cases[1].id).componentId,old.id);
 assert.equal(r.invalidated.filter(x=>x.componentId===old.id).length,1);assert.equal(JSON.stringify([held.component,old]),original);
 const bundle={schemaVersion:1,kind:'chapter-identity-review-composition',scope:f.scope,plan:next,sourcePlans:[f.plan],components:[held.component,old],selections:r.selections};
 assert.throws(()=>validateChapterIdentityBundle(f.view,f.sources,f.scope,bundle,next.inputs),/Incomplete|held/);
});
test('only a fresh current-plan same-reviewer binding closes the stale hold while sibling proofs stay reused',()=>{
 const f=fixture(),held=f.makeCapture(f.plan,f.plan.cases[0],'hold-reviewer','hold'),old=multiCaseResolutionCapture(f,held),next=nextEditorialPlan(f.plan);
 const fresh=holdResolutionCapture(f,held,{plan:next,runId:'actual-new-current-binding'}),components=[held.component,old,fresh];
 const r=reconcileIdentityProofComposition(f.view,f.sources,next,[f.plan],components);assert.equal(r.remainingCaseIds.length,0);assert.equal(r.held.length,0);assert.equal(r.eligible.get(next.cases[1].id).componentId,old.id);
 const bundle={schemaVersion:1,kind:'chapter-identity-review-composition',scope:f.scope,plan:next,sourcePlans:[f.plan],components,selections:r.selections};assert.equal(validateChapterIdentityBundle(f.view,f.sources,f.scope,bundle,next.inputs).retained.length,2);
 for(const opts of [{reviewer:'unrelated-reviewer'},{runId:held.component.receipt.runId},{refs:[peopleDigest('wrong hold')]}]) {
  const bad=holdResolutionCapture(f,held,{plan:next,...opts});assert.throws(()=>reconcileIdentityProofComposition(f.view,f.sources,next,[f.plan],[held.component,old,bad]),/Hold resolution/);
 }
 const missing=f.makeCapture(next,next.cases[0],'hold-reviewer').component;const incomplete=reconcileIdentityProofComposition(f.view,f.sources,next,[f.plan],[held.component,old,missing]);assert.deepEqual(incomplete.remainingCaseIds,[next.cases[0].id]);assert.equal(incomplete.held.length,1);
});
