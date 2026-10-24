// Research-only: verify two independently sealed review sets against one source.
// No canonical data, queue, lock, history, extraction, or source is written.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions, mergeEditorialDecisionReview, validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs, reconcileExtractionAfterRepairs} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const seed=JSON.parse(fs.readFileSync(`${root}/jinshu053-reconciliation-review-packet-v1-incomplete-20261020/decision-seed.json`));
const load = key => {
  const entry=seed.inputs[key], bytes=fs.readFileSync(entry.path);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,`changed input ${key}`);
  return JSON.parse(bytes);
};
const source=load('source'), old=load('base'), history=load('history');
assert.deepEqual(source,load('secondSource'));
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
assert.equal(packet.input.chapterFingerprint,seed.scope.originalChapterFingerprint);
const decisions=[load('firstDecision'),load('secondDecision')];
const drafts=[load('firstDraft'),load('secondDraft')];
const oldExpanded=validateCompactPeopleExtraction(old,packet,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(history,oldExpanded);
const assessed=drafts.map((draft,i)=> {
  const normalized=validateCompactPeopleExtraction(draft,packet,{strictAliasDispositions:true}).normalized;
  validateAppliedEditorialDecisions(history,normalized);
  const assessment=validateEditorialDecisions(decisions[i],normalized,packet);
  assert.equal(assessment.retractedClaimIds.size,0);
  assert.equal(assessment.revisedClaims.size,0);
  assert.equal(assessment.addedClaims.length,0);
  return assessment;
});
const accepted=assessed.flatMap(a=>a.reviewedRepairs);
assert.deepEqual(assessed.map(a=>a.reviewedRepairs.length),[36,60]);
const targets=accepted.map(r=>`${r.unit.id}:${r.field}`);
assert.equal(new Set(targets).size,96,'overlapping decisions need separate review');
const changed=applyTranslationRepairs(source,accepted).chapter;
const revised=buildPeopleExtractionPacket('jinshu','053',{chapterData:changed});
assert.equal(revised.input.chapterFingerprint,seed.scope.revisedInMemoryChapterFingerprint);
let merged=history;
for(const decision of decisions) merged=mergeEditorialDecisionReview(merged,decision);
assert.equal(merged.reviews.length, (history.schemaVersion===4 ? history.reviews.length : 1)+2);
for(let i=0;i<2;i++) {
  const actual={schemaVersion:3,book:merged.book,chapter:merged.chapter,...merged.reviews.at(i-2)};
  assert.deepEqual(actual,decisions[i],`sealed review ${i} not preserved`);
}
// Only genuine accepted proposals become applied; rejected proposals remain
// exclusively in the immutable review records as in the normal workflow.
const candidate=structuredClone(oldExpanded);
for(const repair of accepted) candidate.translationRepairs.push({...repair,status:'proposed'});
const reconciled=reconcileExtractionAfterRepairs(candidate,revised,{previousPacket:packet});
assert.equal(reconciled.unresolvedSpans.length,0);
validateAppliedEditorialDecisions(merged,reconciled.extraction);
const oldIds=new Set(oldExpanded.candidateDispositions.map(d=>d.candidate));
const newDispositions=reconciled.extraction.candidateDispositions.filter(d=>!oldIds.has(d.candidate));
const counts=decisions.map(d=>({accepted:d.decisions.filter(x=>x.decision!=='reject').length,rejected:d.decisions.filter(x=>x.decision==='reject').length}));
console.log(JSON.stringify({status:'INCOMPLETE diagnostic; no candidate or review approval published',sourceFingerprint:packet.input.chapterFingerprint,revisedFingerprint:revised.input.chapterFingerprint,counts,storedReviewCount:merged.reviews.length,unresolvedSpans:reconciled.unresolvedSpans.length,unresolvedCandidates:reconciled.unresolvedCandidates.length,unreviewedAutoDispositions:newDispositions.length,reason:'Automatic dispositions and remapped mentions have not been applied; known wrong Sima Tong and child attribution, literal-field coverage, and fingerprint-bound identity/date/editorial gates remain.'},null,2));
