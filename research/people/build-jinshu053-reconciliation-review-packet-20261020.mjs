// Isolated, zero-decision packet: the automatic disposition classifications are deliberately omitted.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions,validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const sha=x=>createHash('sha256').update(x).digest('hex');
const names={
  source:'jinshu053-combined-proposed-only-v1-incomplete-20261020/source.json',
  base:'jinshu053-combined-proposed-only-v1-incomplete-20261020/original-extraction.json',
  history:'jinshu053-combined-proposed-only-v1-incomplete-20261020/editorial-history.json',
  firstDraft:'jinshu053-combined-proposed-only-v1-incomplete-20261020/proposed-extraction.json',
  firstDecision:'jinshu053-combined-proposed-only-v1-incomplete-20261020/independent-editorial-decisions-release-state-20261020.json',
  secondSource:'jinshu053-ending-proposed-only-incomplete-20261020/source.json',
  secondDraft:'jinshu053-ending-proposed-only-incomplete-20261020/candidate.json',
  secondDecision:'jinshu053-ending-editorial-decisions-20261020-incomplete.json',
};
const inputs=Object.fromEntries(Object.entries(names).map(([k,p])=>[k,fs.readFileSync(`${root}/${p}`)]));
const data=Object.fromEntries(Object.entries(inputs).map(([k,b])=>[k,JSON.parse(b)]));
assert.deepEqual(data.source,data.secondSource);
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:data.source});
assert.equal(packet.input.chapterFingerprint,'sha256:437d9e2d76d520caafb8053f79304681fcece7139971add44cc572475c491007');
const reviews=[['firstDraft','firstDecision'],['secondDraft','secondDecision']].map(([draft,decision])=>{
  const normalized=validateCompactPeopleExtraction(data[draft],packet,{strictAliasDispositions:true}).normalized;
  validateAppliedEditorialDecisions(data.history,normalized);
  const checked=validateEditorialDecisions(data[decision],normalized,packet);
  assert.equal(checked.retractedClaimIds.size,0); assert.equal(checked.revisedClaims.size,0); assert.equal(checked.addedClaims.length,0);
  return checked.reviewedRepairs;
});
assert.deepEqual(reviews.map(r=>r.length),[36,60]);
const targets=reviews.flat().map(r=>`${r.unit.id}:${r.field}`);
assert.equal(new Set(targets).size,96);
const revised=applyTranslationRepairs(data.source,reviews.flat()).chapter;
const next=buildPeopleExtractionPacket('jinshu','053',{chapterData:revised});
assert.equal(next.input.chapterFingerprint,'sha256:8de9f5f9ac87e22add5c990fca67916bf19c7d9809bfe13678572d7d1ce178de');
const original=validateCompactPeopleExtraction(data.base,packet,{strictAliasDispositions:true}).normalized;
const rec=reconcileExtractionAfterRepairs(structuredClone(original),next,{previousPacket:packet});
const old=new Set(original.candidateDispositions.map(d=>d.candidate));
const generated=rec.extraction.candidateDispositions.filter(d=>!old.has(d.candidate)).map(d=>d.candidate);
assert.equal(generated.length,24); assert.equal(rec.unresolvedCandidates.length,6); assert.equal(rec.unresolvedSpans.length,0);
const ids=[...generated,...rec.unresolvedCandidates];
assert.equal(new Set(ids).size,30);
const units=chapter=>chapter.content.flatMap(b=>b.sentences??[]);
const oldUnits=units(data.source), newUnits=units(revised);
const cleanUnit=u=>{
  if(!u)return null;
  const en=u.translations?.find(t=>t.lang==='en');
  return {id:u.id,zh:u.zh,literal:en?.literal??null,idiomatic:en?.idiomatic??null};
};
const candidates=ids.map(id=>{
  const matches=next.preflight.candidates.filter(c=>c.id===id);
  assert.equal(matches.length,1,id);
  const c=matches[0], index=newUnits.findIndex(u=>u.id===c.unit);
  assert(index>=0); assert.equal(oldUnits[index].id,c.unit);
  const localMentions=original.mentions.filter(m=>m.unit?.id===c.unit);
  return {
    candidate:{id:c.id,unit:c.unit,language:c.language,exact:c.exact,occurrence:c.occurrence,startCodePoint:c.startCodePoint,endCodePoint:c.endCodePoint,detectors:c.detectors},
    revisedContext:{previous:cleanUnit(newUnits[index-1]),unit:cleanUnit(newUnits[index]),next:cleanUnit(newUnits[index+1])},
    originalUnit:cleanUnit(oldUnits[index]),
    originalUnitMentions:localMentions,
    decision:null, personId:null, mentionKind:null, note:null,
  };
});
const result={
  status:'INCOMPLETE BLANK DECISION SEED — no classification, application, approval, or publication',
  scope:{book:'jinshu',chapter:'053',originalChapterFingerprint:packet.input.chapterFingerprint,revisedInMemoryChapterFingerprint:next.input.chapterFingerprint,candidateCount:candidates.length},
  methodology:'Review every candidate independently in local context. The set combines 24 newly suggested automatic dispositions and six unresolved candidates, but intentionally omits all suggested classifications and does not mark which is which. Explicit null fields are placeholders, not decisions. Offsets and contexts refer to the in-memory source after the 96 previously reviewed accepted corrections; no source or extraction is published.',
  inputs:Object.fromEntries(Object.entries(inputs).map(([k,b])=>[k,{path:`${root}/${names[k]}`,sha256:sha(b)}])),
  candidates,
};
const out=`${root}/jinshu053-reconciliation-review-packet-v1-incomplete-20261020`;
if(fs.existsSync(out))throw Error('Refusing to overwrite existing packet directory');
fs.mkdirSync(out);
const bytes=Buffer.from(`${JSON.stringify(result,null,2)}\n`);
fs.writeFileSync(`${out}/decision-seed.json`,bytes,{flag:'wx'});
assert.equal(sha(fs.readFileSync(`${out}/decision-seed.json`)),sha(bytes));
console.log(JSON.stringify({path:`${out}/decision-seed.json`,sha256:sha(bytes),count:candidates.length,inputFingerprint:packet.input.chapterFingerprint,revisedFingerprint:next.input.chapterFingerprint,inputHashes:result.inputs},null,2));
