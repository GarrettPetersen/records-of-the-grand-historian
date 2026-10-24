// Isolated simulation only. Candidate suggestions are not review decisions.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '../../../../scripts/build-people-extraction-packet.mjs';
import {validatePeopleExtraction} from '../../../../scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions, validateAppliedEditorialDecisions, mergeEditorialDecisionReview} from '../../../../scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs, reconcileExtractionAfterRepairs} from '../../../../scripts/lib/people-translation-repairs.mjs';
const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const base=`${root}/jinshu053-oath-proposals-v1-20261019-incomplete`;
const out=`${root}/jinshu053-oath-materialization-simulation-v1-20261019-incomplete`;
const sha=b=>createHash('sha256').update(b).digest('hex');
const inputs={
  'source.json':'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d',
  'proposed-extraction.json':'fb7ceeb8773fedc92979cbd95a66d370b387d99fbafb329a5aeafec9a068db9c',
  'editorial-history.json':'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7',
};
function read(file,expected){const bytes=fs.readFileSync(file);assert.equal(sha(bytes),expected,file);return JSON.parse(bytes)}
const source=read(`${base}/source.json`,inputs['source.json']);
const extraction=read(`${base}/proposed-extraction.json`,inputs['proposed-extraction.json']);
const history=read(`${base}/editorial-history.json`,inputs['editorial-history.json']);
const decisions=read(`${root}/jinshu053-oath-independent-decisions-20261019-incomplete.json`,'a8dd21bda1c3e769325cca0f0aeff6ec11c1df6eb87dc0e5c332133de679e1fe');
const oldPacket=buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const old=validatePeopleExtraction(extraction,oldPacket,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(history,old);
validateEditorialDecisions(decisions,old,oldPacket);
const decisionMap=new Map(decisions.decisions.map(d=>[d.repairId,d]));
const changes=old.translationRepairs.filter(r=>r.status==='proposed').map(r=>{
  const d=decisionMap.get(r.id);assert(d && d.decision!=='reject');
  return {...r,after:d.decision==='revise'?d.after:r.after,reason:d.reason};
});
assert.equal(changes.length,2);assert(changes.every(r=>r.unit.id==='s0053'));
const revised=applyTranslationRepairs(source,changes).chapter;
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:revised});
const auto=reconcileExtractionAfterRepairs(old,packet,{previousPacket:oldPacket});
const autoMentions=structuredClone(auto.extraction.mentions);
const next=auto.extraction;
for(const change of changes){const r=next.translationRepairs.find(x=>x.id===change.id);assert(r);r.after=change.after;r.reason=change.reason}
const oldC=new Map(oldPacket.preflight.candidates.map(c=>[c.id,c]));
const newC=new Map(packet.preflight.candidates.map(c=>[c.id,c]));
for(const [id,c] of newC) if(c.unit!=='s0053') assert.deepEqual(c,oldC.get(id),`changed outside candidate ${id}`);
next.mentions=structuredClone(old.mentions.filter(m=>m.unit.id!=='s0053'));
for(const m of next.mentions) m.candidateRefs=m.candidateRefs.filter(id=>newC.has(id));
next.candidateDispositions=structuredClone(old.candidateDispositions.filter(d=>newC.has(d.candidate)&&newC.get(d.candidate).unit!=='s0053'));
// Retain automatic changed-unit suggestions for diagnostics only, never treat as reviewed.
for(const m of autoMentions.filter(m=>m.unit.id==='s0053')) next.mentions.push(structuredClone(m));
next.mentions.forEach((m,i)=>{m.id=`jinshu:053:m${String(i+1).padStart(4,'0')}`});
for(const c of newC.values()) if(c.unit==='s0053') {
  const d=old.candidateDispositions.find(x=>x.candidate===c.id);
  if(d && !next.mentions.some(m=>m.candidateRefs.includes(c.id))) next.candidateDispositions.push(structuredClone(d));
}
assert.deepEqual(next.people,old.people);assert.deepEqual(next.claims,old.claims);
const merged=mergeEditorialDecisionReview(history,decisions);
let validation;
try {const result=validatePeopleExtraction(next,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(merged,result.normalized);validation={passed:true,stats:result.stats};}
catch(e){validation={passed:false,error:String(e.stack??e)};}
const stripId=m=>{const t=structuredClone(m);delete t.id;return JSON.stringify(t)};
const oldOutside=old.mentions.filter(m=>m.unit.id!=='s0053');
const newOutside=next.mentions.filter(m=>m.unit.id!=='s0053');
const oldSet=new Set(oldOutside.map(stripId)), newSet=new Set(newOutside.map(stripId));
const delta={
 status:'UNREVIEWED SIMULATION; changed-unit suggestions are not accepted and must be independently checked.',
 oldChangedMentions:old.mentions.filter(m=>m.unit.id==='s0053'),newChangedMentions:next.mentions.filter(m=>m.unit.id==='s0053'),
 oldChangedCandidates:[...oldC.values()].filter(c=>c.unit==='s0053'),newChangedCandidates:[...newC.values()].filter(c=>c.unit==='s0053'),
 oldChangedDispositions:old.candidateDispositions.filter(d=>oldC.get(d.candidate)?.unit==='s0053'),newChangedDispositions:next.candidateDispositions.filter(d=>newC.get(d.candidate)?.unit==='s0053'),
 outsideRemoved:oldOutside.filter(m=>!newSet.has(stripId(m))),outsideAdded:newOutside.filter(m=>!oldSet.has(stripId(m))),
 removedScannerCandidates:[...oldC.values()].filter(c=>!newC.has(c.id)),addedScannerCandidates:[...newC.values()].filter(c=>!oldC.has(c.id)),
 autoUnresolvedSpans:auto.unresolvedSpans,autoUnresolvedCandidates:auto.unresolvedCandidates,
 claimsAndPeopleUnchanged:true,validation,
};
assert(!fs.existsSync(out));fs.mkdirSync(out);
const values={'source.json':revised,'candidate-unreviewed.json':next,'editorial-history.json':merged,'review-decisions.json':decisions,'semantic-delta.json':delta};
const hashes={};for(const [name,value] of Object.entries(values)){const bytes=Buffer.from(`${JSON.stringify(value,null,2)}\n`);fs.writeFileSync(`${out}/${name}`,bytes,{flag:'wx'});hashes[name]=sha(bytes)}
console.log(JSON.stringify({out,hashes,fingerprint:packet.input.chapterFingerprint,validation,outsideRemoved:delta.outsideRemoved.length,outsideAdded:delta.outsideAdded.length,changedCandidates:delta.newChangedCandidates.length,unresolvedSpans:auto.unresolvedSpans,unresolvedCandidates:auto.unresolvedCandidates},null,2));
