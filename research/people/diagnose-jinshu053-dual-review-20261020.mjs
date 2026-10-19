import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateEditorialDecisions, validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {applyTranslationRepairs, reconcileExtractionAfterRepairs} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const read = p => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const base = 'jinshu053-combined-proposed-only-v1-incomplete-20261020';
const end = 'jinshu053-ending-proposed-only-incomplete-20261020';
const source = read(`${base}/source.json`);
assert.deepEqual(source, read(`${end}/source.json`));
const packet = buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const hist = read(`${base}/editorial-history.json`);
const inputs = [
  [read(`${base}/proposed-extraction.json`),read(`${base}/independent-editorial-decisions-release-state-20261020.json`)],
  [read(`${end}/candidate.json`),read('jinshu053-ending-editorial-decisions-20261020-incomplete.json')],
];
const reviews = inputs.map(([draft, decisions]) => {
  const valid = validateCompactPeopleExtraction(draft, packet, {strictAliasDispositions:true});
  validateAppliedEditorialDecisions(hist, valid.normalized);
  const result = validateEditorialDecisions(decisions, valid.normalized, packet);
  assert.equal(result.retractedClaimIds.size,0);
  assert.equal(result.revisedClaims.size,0);
  assert.equal(result.addedClaims.length,0);
  return result.reviewedRepairs;
});
const targetSet = new Set();
for (const repair of reviews.flat()) {
  const target = `${repair.unit.id}:${repair.field}`;
  assert(!targetSet.has(target), `overlapping accepted target ${target}`);
  targetSet.add(target);
}
const application = applyTranslationRepairs(source, reviews.flat());
const nextPacket = buildPeopleExtractionPacket('jinshu','053',{chapterData:application.chapter});
let sequentialRejected = false;
try { validateEditorialDecisions(inputs[1][1], validateCompactPeopleExtraction(inputs[1][0],packet,{strictAliasDispositions:true}).normalized, nextPacket); }
catch (error) { sequentialRejected = /chapter fingerprint/.test(error.message); }
assert(sequentialRejected, 'Expected original review to reject changed chapter fingerprint');
const baseDraft = validateCompactPeopleExtraction(read(`${base}/original-extraction.json`), packet, {strictAliasDispositions:true}).normalized;
const reconciliation = reconcileExtractionAfterRepairs(structuredClone(baseDraft), nextPacket, {previousPacket:packet});
const unresolvedDetails = nextPacket.preflight.candidates.filter(c => reconciliation.unresolvedCandidates.includes(c.id));
const changedSections = [...new Set([...Object.keys(baseDraft),...Object.keys(reconciliation.extraction)])].filter(k => JSON.stringify(baseDraft[k]) !== JSON.stringify(reconciliation.extraction[k]));
const oldIds = new Set(baseDraft.candidateDispositions.map(d => d.candidate));
const addedDispositions = reconciliation.extraction.candidateDispositions.filter(d => !oldIds.has(d.candidate)).map(d => ({...d, preflight:nextPacket.preflight.candidates.find(c=>c.id===d.candidate)}));
console.log(JSON.stringify({status:'diagnostic only; no output candidate or publication',acceptedCounts:reviews.map(x=>x.length),uniqueTargets:targetSet.size,originalFingerprint:packet.input.chapterFingerprint,revisedFingerprint:nextPacket.input.chapterFingerprint,ordinarySequentialSecondValidation:'rejected because chapter fingerprint changed',changedSections,addedDispositionCount:addedDispositions.length,addedDispositions,unresolvedSpans:reconciliation.unresolvedSpans,unresolvedCandidates:unresolvedDetails},null,2));
