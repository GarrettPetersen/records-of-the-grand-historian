// Isolated research simulation: automatic reconciliation is NOT reviewed or published.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions, validateAppliedEditorialDecisions, mergeEditorialDecisionReview } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const base = `${root}/jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020`;
const dest = `${root}/jinshu053-seven-reviewed-simulation-20261019-incomplete`;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {
  'source.json': 'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c',
  'proposed-extraction.json': '3a5a61d771beee8a11b8fdbe9e0d357eeda47e30ef3ea289c11f87cc08370d27',
  'editorial-history.json': '30b09ad788522860bd04293c199a03e7f388569ec15314eb53ee2ac8de08a767',
};
function readPinned(file, expected) {
  const bytes = fs.readFileSync(file);
  assert.equal(hash(bytes), expected, file);
  return JSON.parse(bytes);
}
const source = readPinned(`${base}/source.json`, inputs['source.json']);
const extraction = readPinned(`${base}/proposed-extraction.json`, inputs['proposed-extraction.json']);
const history = readPinned(`${base}/editorial-history.json`, inputs['editorial-history.json']);
const decisions = readPinned(`${root}/jinshu053-seven-independent-decisions-20261019-incomplete.json`, 'c009fe89a8d501132b56a96895e8ad1d2e4979627eb9de2b520f4b5b23a48175');
const oldPacket = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
const old = validatePeopleExtraction(extraction, oldPacket, { strictAliasDispositions: true }).normalized;
validateEditorialDecisions(decisions, old, oldPacket);
const chosen = new Map(decisions.decisions.map(d => [d.repairId, d]));
const changes = old.translationRepairs.filter(r => r.status === 'proposed').map(r => {
  const d = chosen.get(r.id);
  assert(d && d.decision !== 'reject', `unexpected non-accepted proposal ${r.id}`);
  return { ...r, after: d.decision === 'revise' ? d.after : r.after, reason: d.reason };
});
assert.equal(changes.length, 7);
const revised = applyTranslationRepairs(source, changes).chapter;
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: revised });
const reconciled = reconcileExtractionAfterRepairs(old, packet, { previousPacket: oldPacket });
for (const change of changes) {
  const repair = reconciled.extraction.translationRepairs.find(r => r.id === change.id);
  assert(repair);
  repair.after = change.after;
  repair.reason = change.reason;
}
const merged = mergeEditorialDecisionReview(history, decisions);
const diffRows = (before, after, key) => {
  const left = new Map(before.map(item => [item[key], item]));
  const right = new Map(after.map(item => [item[key], item]));
  return [...new Set([...left.keys(), ...right.keys()])].sort().flatMap(id => {
    const a = left.get(id) ?? null; const b = right.get(id) ?? null;
    return JSON.stringify(a) === JSON.stringify(b) ? [] : [{ id, before: a, after: b }];
  });
};
const changedUnits = [...new Set(changes.map(c => c.unit.id))];
const oldCandidates = new Map(oldPacket.preflight.candidates.map(c => [c.id,c]));
const newCandidates = new Map(packet.preflight.candidates.map(c => [c.id,c]));
const dispositionChanges = diffRows(old.candidateDispositions, reconciled.extraction.candidateDispositions, 'candidate').map(row => ({ ...row, oldCandidate: oldCandidates.get(row.id) ?? null, newCandidate: newCandidates.get(row.id) ?? null }));
const candidateChanges = diffRows(oldPacket.preflight.candidates, packet.preflight.candidates, 'id');
const mentionedChanges = diffRows(old.mentions, reconciled.extraction.mentions, 'id');
const claimChanges = diffRows(old.claims, reconciled.extraction.claims, 'id');
const relatedClaims = old.claims.filter(c => c.evidence.some(e => changedUnits.includes(e.split(':').at(-1))));
const diagnostics = {
  status: 'INCOMPLETE simulation; every automatic mention and disposition change requires independent source review before any application or publication',
  inputs, reviewSha256: 'c009fe89a8d501132b56a96895e8ad1d2e4979627eb9de2b520f4b5b23a48175',
  oldFingerprint: oldPacket.input.chapterFingerprint, newFingerprint: packet.input.chapterFingerprint,
  changedFields: changes.map(({id,unit,field,before,after,reason}) => ({id,unit,field,before,after,reason})),
  unresolvedCandidates: reconciled.unresolvedCandidates.map(id => newCandidates.get(id) ?? id),
  unresolvedSpans: reconciled.unresolvedSpans,
  candidateChanges, dispositionChanges, mentionChanges: mentionedChanges, claimChanges, relatedClaims,
  note: 'All automated reconciliation, including unchanged or remapped candidate identities and dispositions, is diagnostic only. Related claims are listed for human/source review, not implicitly revised. Other chapter gates remain open.',
};
let validation;
try {
  const result = validatePeopleExtraction(reconciled.extraction, packet, { strictAliasDispositions: true });
  validateAppliedEditorialDecisions(merged, result.normalized);
  validation = { status: 'structurally-valid-only', stats: result.stats, note: 'Not source review of automatic reconciliation.' };
} catch (error) {
  validation = { status: 'not-valid', error: String(error.message) };
}
diagnostics.validation = validation;
assert(!fs.existsSync(dest), `Refusing existing destination ${dest}`);
fs.mkdirSync(dest);
const outputs = { 'source.json': revised, 'proposed-reconciled-extraction.json': reconciled.extraction, 'editorial-history.json': merged, 'review-decisions.json': decisions, 'reconciliation-diagnostics.json': diagnostics };
const hashes = {};
for (const [name, value] of Object.entries(outputs)) {
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  fs.writeFileSync(`${dest}/${name}`, bytes, { flag: 'wx' });
  hashes[name] = hash(bytes);
}
console.log(JSON.stringify({dest, hashes, changedUnits, candidateChanges: candidateChanges.length, dispositionChanges: dispositionChanges.length, mentionChanges: mentionedChanges.length, claimChanges: claimChanges.length, relatedClaims: relatedClaims.length, unresolvedCandidates: diagnostics.unresolvedCandidates.length, unresolvedSpans: diagnostics.unresolvedSpans.length, validation}, null, 2));
