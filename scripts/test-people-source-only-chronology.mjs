import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPeopleExtractionPacket,buildPeopleExtractionSeed} from './build-people-extraction-packet.mjs';
import {buildCompactInput,deduplicateCompactMentionOccurrences} from './lib/people-compact.mjs';
import {reconcilePrivateCandidateDispositions} from './reconcile-people-alias-callbacks.mjs';
import {loadProperNounMatcher} from './lib/people-candidates.mjs';
import {validateCompactPeopleExtraction} from './validate-people-extraction.mjs';
import {combinedDatePacket} from './lib/people-combined-curation-review.mjs';
import {unresolvedDateAuditItems,dateAuditDiagnostics} from './lib/people-date-audit.mjs';
function fixture(){
 const book='test',chapter='001',source={meta:{book,chapter},content:[{sentences:[{id:'s0001',zh:'元熙中，王偉來。',translations:[{lang:'en',literal:'In Yuanxi, Wang Wei came.',idiomatic:'In Yuanxi, Wang Wei came.'}]}]}]};
 const packet=buildPeopleExtractionPacket(book,chapter,{chapterData:source,properNounMatcher:loadProperNounMatcher()});
 const raw={schemaVersion:2,book,chapter,input:buildCompactInput(packet),run:{model:'offline',promptVersion:7,agentId:'actual-owner'},people:[['p001',['Wang Wei','王偉',null],'historical','An official in the source.',{n:[],r:[],a:['During the Yuanxi era'],p:[],x:null},[[{kind:'personal-name',en:'Wang Wei',zh:'王偉'},'explicit',['s0001']]],[["official","explicit",['s0001']]]]],surfaces:[['p001','personal-name','zh','王偉',[['s0001',[0]]]],['p001','personal-name','en','Wang Wei',[['s0001',[0]]]]],claims:[['p001','attestation',{sourceDate:{text:'元熙中'},qualitative:'Activity in the Yuanxi era, exactly as stated by the source, with no Western conversion asserted.',event:'Wang Wei arrived during the Yuanxi era as stated in the source.'},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:Object.fromEntries(Object.entries(buildPeopleExtractionSeed(packet,'test').coverage).map(([k,v])=>[k,typeof v==='boolean'?true:v]))};
 raw.candidateDispositions=[['not-person','other',packet.preflight.candidates.filter(c=>c.exact==='元熙').map(c=>[c.id.split(':').at(-1),'The source explicitly uses Yuanxi as the era expression, not an individual.'])]];
 return{source,packet,raw};
}
test('exact source era remains structured and reviewable without an invented Western conversion or unresolved flag',()=>{
 const {source,packet,raw}=fixture(),before=structuredClone(raw);
 const result=validateCompactPeopleExtraction(raw,packet,{strictAliasDispositions:true});assert.equal(result.stats.people,1);assert.deepEqual(raw,before);
 assert.equal(result.normalized.claims.find(c=>c.predicate==='attestation').value.sourceDate.text,'元熙中');
 const dates=combinedDatePacket('test','001',source,raw);assert.deepEqual(unresolvedDateAuditItems(dates),[]);assert.deepEqual(dateAuditDiagnostics(dates),[]);
});
test('source-only exception rejects an unquoted era, missing substantive context, or an inferred attestation',()=>{
 for(const change of [r=>r.claims[0][2].sourceDate.text='永和中',r=>r.claims[0][2].qualitative='era',r=>r.claims[0][2].event='came',r=>r.claims[0][3]='strongly-inferred']){const {packet,raw}=fixture();change(raw);assert.throws(()=>validateCompactPeopleExtraction(raw,packet));}
});
test('an asserted Western year or another dated life claim keeps the original Western chronology gates',()=>{
 const f=fixture();f.raw.claims[0][2].westernYear={era:'AD',year:419,precision:'year'};assert.throws(()=>validateCompactPeopleExtraction(f.raw,f.packet),/Western active-date hint/);
 const g=fixture();g.raw.claims.push(['p001','birth',{sourceDate:{text:'元熙中'}},'explicit',['s0001']]);assert.throws(()=>validateCompactPeopleExtraction(g.raw,g.packet),/Western/);
});
test('unknown-source or explicit unresolved chronology cannot become source-only completion',()=>{
 const f=fixture();delete f.raw.claims[0][2].sourceDate;assert.throws(()=>validateCompactPeopleExtraction(f.raw,f.packet),/Western/);
 const g=fixture();g.raw.claims[0][2].unresolved=true;g.raw.claims[0][2].unresolvedReason='The source conversion remains an explicitly retained research hold.';
 const dates=combinedDatePacket('test','001',g.source,g.raw);assert.equal(unresolvedDateAuditItems(dates).length,1);
});
test('occurrence normalization removes exact duplicates and preserves every unique actor/kind/unit/occurrence',()=>{
 const {packet,raw}=fixture(),before=structuredClone(raw);raw.surfaces.push(structuredClone(raw.surfaces[0]));
 const normalized=deduplicateCompactMentionOccurrences(raw);assert.equal(normalized.removed.length,1);assert.deepEqual(normalized.candidate,before);assert.equal(raw.surfaces.length,3);assert.equal(normalized.approvalGranted,false);
 assert.doesNotThrow(()=>validateCompactPeopleExtraction(normalized.candidate,packet,{strictAliasDispositions:true}));
 for(const [field,value]of [[0,'p002'],[1,'title-reference'],[2,'en'],[3,'Different surface']]){const copy=structuredClone(before),extra=structuredClone(copy.surfaces[0]);extra[field]=value;copy.surfaces.push(extra);assert.equal(deduplicateCompactMentionOccurrences(copy).removed.length,0);}
 const otherOccurrence=structuredClone(before);otherOccurrence.surfaces[0][4][0][1].push(1);assert.equal(deduplicateCompactMentionOccurrences(otherOccurrence).removed.length,0);
});
test('private disposition adapter reuses native geometry and removes only obsolete, repeated or already linked rows',()=>{
 const {packet,raw}=fixture(),before=structuredClone(raw),name=packet.preflight.candidates.find(c=>c.exact==='Wang Wei').id.split(':').at(-1);
 raw.candidateDispositions.push(['not-person','other',[[name,'Stale negative disposition for an already linked name.'],['cand_0000000000000000','Obsolete scanner id.']]],structuredClone(raw.candidateDispositions[0]));
 const result=reconcilePrivateCandidateDispositions(raw,packet);assert.deepEqual(result.candidate,before);assert.equal(result.removed.length,3);assert.equal(result.approvalGranted,false);assert.equal(raw.candidateDispositions.length,3);
 assert.doesNotThrow(()=>validateCompactPeopleExtraction(result.candidate,packet,{strictAliasDispositions:true}));
});
test('contradictory uncovered dispositions remain a native failure rather than a guessed decision',()=>{
 const {packet,raw}=fixture();raw.candidateDispositions.push(['duplicate-hint','other',structuredClone(raw.candidateDispositions[0][2])]);
 const result=reconcilePrivateCandidateDispositions(raw,packet);assert.equal(result.candidate.candidateDispositions.length,2);
 assert.throws(()=>validateCompactPeopleExtraction(result.candidate,packet,{strictAliasDispositions:true}),/more than once/);
});
