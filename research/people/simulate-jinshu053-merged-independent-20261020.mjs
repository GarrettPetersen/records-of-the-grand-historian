// Research-only simulation. No canonical writes, queue operations, or approvals.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction,validatePeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions,mergeEditorialDecisionReview,validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const origin=`${root}/jinshu053-three-review-merged-proposed-v1-incomplete-20261020`;
const output=`${root}/jinshu053-merged-reviewed-simulation-v2-incomplete-20261020`;
const decisionPath=`${root}/jinshu053-merged-independent-decisions-lacuna-review-20261020-incomplete.json`;
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync(`${origin}/manifest.json`));
const inputs={};
for(const [name,expected] of Object.entries(manifest.outputSha256)) {
  const bytes=fs.readFileSync(`${origin}/${name}`);
  assert.equal(sha(bytes),expected,`changed ${name}`);
  inputs[name]=JSON.parse(bytes);
}
const decisionBytes=fs.readFileSync(decisionPath);
const decisions=JSON.parse(decisionBytes);
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:inputs['source.json']});
assert.equal(packet.input.chapterFingerprint,manifest.fingerprints.chapterFingerprint);
const original=validateCompactPeopleExtraction(inputs['original-extraction.json'],packet,{strictAliasDispositions:true}).normalized;
const proposed=validateCompactPeopleExtraction(inputs['proposed-extraction.json'],packet,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(inputs['editorial-history.json'],original);
validateAppliedEditorialDecisions(inputs['editorial-history.json'],proposed);
const checked=validateEditorialDecisions(decisions,proposed,packet);
assert.equal(checked.retractedClaimIds.size,0);assert.equal(checked.revisedClaims.size,0);assert.equal(checked.addedClaims.length,0);
assert.equal(checked.reviewedRepairs.length,93);
assert.deepEqual(['accept','reject','revise'].map(x=>decisions.decisions.filter(d=>d.decision===x).length),[91,5,2]);
const targets=checked.reviewedRepairs.map(r=>`${r.unit.id}:${r.field}`);
assert.equal(new Set(targets).size,targets.length);
const source=applyTranslationRepairs(inputs['source.json'],checked.reviewedRepairs).chapter;
const revisedPacket=buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const history=mergeEditorialDecisionReview(inputs['editorial-history.json'],decisions);
assert.deepEqual({schemaVersion:3,book:history.book,chapter:history.chapter,...history.reviews.at(-1)},decisions);
const prepared=structuredClone(original);
prepared.translationRepairs.push(...checked.reviewedRepairs.map(r=>({...r,status:'proposed'})));
// Match the production applier: rejected proposals leave gaps that must be
// renumbered, while the sealed review contracts remain unchanged in history.
prepared.translationRepairs=prepared.translationRepairs.map((repair,index)=>({...repair,id:`jinshu:053:r${String(index+1).padStart(4,'0')}`}));
const rec=reconcileExtractionAfterRepairs(prepared,revisedPacket,{previousPacket:packet});
validateAppliedEditorialDecisions(history,rec.extraction);
const oldIds=new Set(original.candidateDispositions.map(d=>d.candidate));
const auto=rec.extraction.candidateDispositions.filter(d=>!oldIds.has(d.candidate));
const candidateIds=[...new Set([...auto.map(d=>d.candidate),...rec.unresolvedCandidates])];
const units=chapter=>chapter.content.flatMap(b=>b.sentences??[]);
const oldUnits=units(inputs['source.json']),newUnits=units(source);
const clean=u=>{if(!u)return null;const en=u.translations?.find(t=>t.lang==='en');return{id:u.id,zh:u.zh,literal:en?.literal??null,idiomatic:en?.idiomatic??null};};
const candidates=candidateIds.map(id=>{
  const matches=revisedPacket.preflight.candidates.filter(c=>c.id===id);assert.equal(matches.length,1,id);
  const c=matches[0],i=newUnits.findIndex(u=>u.id===c.unit);assert(i>=0);assert.equal(oldUnits[i].id,c.unit);
  return {candidate:{id:c.id,unit:c.unit,language:c.language,exact:c.exact,occurrence:c.occurrence,startCodePoint:c.startCodePoint,endCodePoint:c.endCodePoint,detectors:c.detectors},revisedContext:{previous:clean(newUnits[i-1]),unit:clean(newUnits[i]),next:clean(newUnits[i+1])},originalUnit:clean(oldUnits[i]),originalUnitMentions:original.mentions.filter(m=>m.unit?.id===c.unit),decision:null,personId:null,mentionKind:null,note:null};
});
let strictValidation;
try {validatePeopleExtraction(rec.extraction,revisedPacket,{strictAliasDispositions:true});strictValidation={passes:true};}
catch(e){strictValidation={passes:false,error:String(e.message),errors:e.errors??null};}
const changes=checked.reviewedRepairs.map(r=>({id:r.id,unit:r.unit,field:r.field,before:r.before,after:r.after,decision:decisions.decisions.find(d=>d.repairId===r.id).decision}));
const reviewPacket={status:'INCOMPLETE BLANK source-local reconciliation seed; no suggested disposition is an approval',scope:{book:'jinshu',chapter:'053',originalChapterFingerprint:packet.input.chapterFingerprint,revisedChapterFingerprint:revisedPacket.input.chapterFingerprint,candidateCount:candidates.length},methodology:'Independently review every candidate and every remapped mention in its local source context; automatic candidate classifications and span mappings are untrusted. Proposed names and relationships also require explicit review. The candidate seed does not show automatic classifications.',candidates};
if(fs.existsSync(output))throw Error('Refusing to overwrite isolated output');
fs.mkdirSync(output);
const artifacts={'source.json':source,'candidate-unreviewed-reconciliation.json':rec.extraction,'editorial-history.json':history,'reviewed-changes.json':changes,'reconciliation-seed.json':reviewPacket,'reconciliation-diagnostics.json':{unresolvedCandidates:rec.unresolvedCandidates,unresolvedSpans:rec.unresolvedSpans,autoDispositions: auto,strictValidation}};
const outputHashes={};
for(const [name,obj] of Object.entries(artifacts)) {const bytes=Buffer.from(`${JSON.stringify(obj,null,2)}\n`);fs.writeFileSync(`${output}/${name}`,bytes,{flag:'wx'});outputHashes[name]=sha(bytes);}
const report={status:'INCOMPLETE isolated simulation; no publication, date approval, identity approval, or reconciliation approval',inputs:{...manifest.outputSha256,decisionSha256:sha(decisionBytes)},outputSha256:outputHashes,sourceFingerprint:packet.input.chapterFingerprint,revisedFingerprint:revisedPacket.input.chapterFingerprint,decisions:{accepted:91,rejected:5,revised:2,applied:93},remaining:{unreviewedAutoDispositions:auto.length,unresolvedCandidates:rec.unresolvedCandidates.length,unresolvedSpans:rec.unresolvedSpans.length,heldOriginalProposals:5},strictValidation,warning:'Existing mentions and automatic dispositions have NOT been independently reviewed against the revised source; rejected proposals, Chinese-source lacuna, claims, identity, date and full chapter editorial holds remain.'};
fs.writeFileSync(`${output}/manifest.json`,`${JSON.stringify(report,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({output,...report},null,2));
