// Isolated research packet. Does not write canonical source, extraction, or approvals.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions,validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const prefix='jinshu053-three-review-merged-proposed-v1-incomplete-20261020';
const paths={source:`${prefix}/source.json`,original:`${prefix}/original-extraction.json`,draft:`${prefix}/proposed-extraction.json`,history:`${prefix}/editorial-history.json`,decision:'jinshu053-merged-independent-decisions-lacuna-review-20261020-incomplete.json'};
const raw=Object.fromEntries(Object.entries(paths).map(([k,p])=>[k,fs.readFileSync(`${root}/${p}`)]));
const data=Object.fromEntries(Object.entries(raw).map(([k,b])=>[k,JSON.parse(b)]));
const hash=b=>createHash('sha256').update(b).digest('hex');
const oldPacket=buildPeopleExtractionPacket('jinshu','053',{chapterData:data.source});
assert.equal(oldPacket.input.chapterFingerprint,'sha256:437d9e2d76d520caafb8053f79304681fcece7139971add44cc572475c491007');
const draft=validateCompactPeopleExtraction(data.draft,oldPacket,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(data.history,draft);
const checked=validateEditorialDecisions(data.decision,draft,oldPacket);
assert.equal(checked.retractedClaimIds.size,0); assert.equal(checked.revisedClaims.size,0); assert.equal(checked.addedClaims.length,0);
const revised=applyTranslationRepairs(data.source,checked.reviewedRepairs).chapter;
const newPacket=buildPeopleExtractionPacket('jinshu','053',{chapterData:revised});
const original=validateCompactPeopleExtraction(data.original,oldPacket,{strictAliasDispositions:true}).normalized;
const reconciled=reconcileExtractionAfterRepairs(structuredClone(original),newPacket,{previousPacket:oldPacket});
const previousDispositions=new Set(original.candidateDispositions.map(d=>d.candidate));
const generated=reconciled.extraction.candidateDispositions.filter(d=>!previousDispositions.has(d.candidate)).map(d=>d.candidate);
const ids=[...new Set([...generated,...reconciled.unresolvedCandidates])];
const units=c=>c.content.flatMap(b=>b.sentences??[]);
const clean=u=>{if(!u)return null;const en=u.translations?.find(t=>t.lang==='en');return {id:u.id,zh:u.zh,literal:en?.literal??null,idiomatic:en?.idiomatic??null};};
const oldUnits=units(data.source), newUnits=units(revised);
const candidates=ids.map(id=>{const matches=newPacket.preflight.candidates.filter(c=>c.id===id);assert.equal(matches.length,1,id);const c=matches[0],i=newUnits.findIndex(u=>u.id===c.unit);assert(i>=0);assert.equal(oldUnits[i].id,c.unit);return {candidate:c,revisedContext:{previous:clean(newUnits[i-1]),unit:clean(newUnits[i]),next:clean(newUnits[i+1])},originalUnit:clean(oldUnits[i]),originalUnitMentions:original.mentions.filter(m=>m.unit?.id===c.unit),decision:null,personId:null,mentionKind:null,note:null};});
// The auto-linking engine may change mentions as well as dispositions. Retain both sets
// verbatim for a separate source-local audit; they are NOT approved by this packet.
const affectedUnits=[...new Set(checked.reviewedRepairs.map(r=>r.unit.id))];
const mentionAudit=affectedUnits.map(id=>({unit:id,context:clean(newUnits.find(u=>u.id===id)),before:original.mentions.filter(m=>m.unit?.id===id),automaticAfter:reconciled.extraction.mentions.filter(m=>m.unit?.id===id)}));
const output={status:'INCOMPLETE BLANK RESEARCH PACKET: no classification or publication',scope:{book:'jinshu',chapter:'053',originalFingerprint:oldPacket.input.chapterFingerprint,revisedFingerprint:newPacket.input.chapterFingerprint,acceptedOrRevised:checked.reviewedRepairs.length,candidateCount:candidates.length,autoDispositions:generated.length,unresolvedCandidates:reconciled.unresolvedCandidates.length,unresolvedSpans:reconciled.unresolvedSpans.length},inputs:Object.fromEntries(Object.entries(raw).map(([k,b])=>[k,{path:`${root}/${paths[k]}`,sha256:hash(b)}])),methodology:'Combines newly auto-disposed and unresolved candidates but intentionally hides their classifications. Mentions include unapproved auto suggestions. Exact final source and independent simulation must be verified before any production use.',candidates,mentionAudit,unresolvedSpans:reconciled.unresolvedSpans};
const dir=`${root}/jinshu053-reviewed98-reconciliation-packet-incomplete-20261020`;
fs.mkdirSync(dir);
const bytes=Buffer.from(`${JSON.stringify(output,null,2)}\n`);
fs.writeFileSync(`${dir}/decision-seed.json`,bytes,{flag:'wx'});
console.log(JSON.stringify({path:`${dir}/decision-seed.json`,sha256:hash(bytes),scope:output.scope},null,2));
