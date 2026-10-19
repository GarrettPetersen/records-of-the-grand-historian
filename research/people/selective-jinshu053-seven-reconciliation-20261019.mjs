// Research-only selective reconciliation: never writes canonical chapter or extraction.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions, validateAppliedEditorialDecisions, mergeEditorialDecisionReview } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const base = `${root}/jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020`;
const dest = `${root}/jinshu053-seven-selective-reconciliation-v2-20261019-incomplete`;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function read(file, hash) { const bytes = fs.readFileSync(file); assert.equal(sha(bytes), hash, file); return JSON.parse(bytes); }
const source = read(`${base}/source.json`, 'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c');
const extraction = read(`${base}/proposed-extraction.json`, '3a5a61d771beee8a11b8fdbe9e0d357eeda47e30ef3ea289c11f87cc08370d27');
const history = read(`${base}/editorial-history.json`, '30b09ad788522860bd04293c199a03e7f388569ec15314eb53ee2ac8de08a767');
const decisions = read(`${root}/jinshu053-seven-independent-reassessed-decisions-20261019-incomplete.json`, 'e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a');
const oldPacket = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
const old = validatePeopleExtraction(extraction, oldPacket, { strictAliasDispositions: true }).normalized;
validateEditorialDecisions(decisions, old, oldPacket);
const chosen = new Map(decisions.decisions.map(d => [d.repairId, d]));
const changes = old.translationRepairs.filter(r => r.status === 'proposed').map(r => {
  const d = chosen.get(r.id); assert(d && d.decision !== 'reject', r.id);
  return { ...r, after: d.decision === 'revise' ? d.after : r.after, reason: d.reason };
});
assert.equal(changes.length, 7);
const revised = applyTranslationRepairs(source, changes).chapter;
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: revised });
const auto = reconcileExtractionAfterRepairs(old, packet, { previousPacket: oldPacket });
const autoMentions = structuredClone(auto.extraction.mentions);
const next = auto.extraction;
for (const change of changes) { const r = next.translationRepairs.find(item => item.id === change.id); assert(r); r.after = change.after; r.reason = change.reason; }
const changed = new Set(changes.map(c => c.unit.id));
const oldCandidates = new Map(oldPacket.preflight.candidates.map(c => [c.id, c]));
const newCandidates = new Map(packet.preflight.candidates.map(c => [c.id, c]));
// Preserve the original review outside edited units, but only for unchanged candidates.
// A vanished scanner candidate is removed; unexpected new/reinterpreted candidates stop us.
for (const [id, c] of newCandidates) if (!changed.has(c.unit)) assert.deepEqual(c, oldCandidates.get(id), `unexpected new or changed candidate ${id}`);
next.candidateDispositions = old.candidateDispositions.filter(d => newCandidates.has(d.candidate) && !changed.has(newCandidates.get(d.candidate).unit));
next.mentions = structuredClone(old.mentions.filter(m => !changed.has(m.unit.id)));
for (const mention of next.mentions) mention.candidateRefs = mention.candidateRefs.filter(id => newCandidates.has(id));
let nextId = Math.max(...old.mentions.map(m => Number(m.id.match(/m(\d+)$/)[1]))) + 1;
for (const mention of autoMentions.filter(m => changed.has(m.unit.id))) {
  const copy = structuredClone(mention); copy.id = `jinshu:053:m${String(nextId++).padStart(4, '0')}`; next.mentions.push(copy);
}
// Schema requires contiguous mention IDs; they are not semantic identities.
next.mentions.forEach((m, index) => { m.id = `jinshu:053:m${String(index + 1).padStart(4, '0')}`; });
// Reconciliation previously mapped Wang's daughter to her father. The cited independent
// source review identifies p038 as crown princess, p003 as Xie, and Jinyong as a place.
const candidate = suffix => { const c = newCandidates.get(`jinshu:053:cand_${suffix}`); assert(c, suffix); return c; };
const span = c => {
  const unit = packet.units.find(u => u.id === c.unit); assert(unit && c.language === 'en');
  assert.equal([...unit.en].slice(c.startCodePoint, c.endCodePoint).join(''), c.exact);
  return { exact: c.exact, occurrence: c.occurrence, startCodePoint: c.startCodePoint, endCodePoint: c.endCodePoint, unitTextHash: `sha256:${sha(unit.en)}` };
};
const crown = candidate('57344e707a7ad43a');
const wrong = next.mentions.find(m => m.unit.id === 's0065' && m.person === 'jinshu:053:p037' && m.spans.en.some(s => s.exact === crown.exact));
assert(wrong); wrong.person = 'jinshu:053:p038'; wrong.kind = 'title-reference';
const xie = candidate('d3fded850e8a7d0e');
const xieMention = next.mentions.find(m => m.unit.id === 's0065' && m.person === 'jinshu:053:p003' && m.spans.zh.some(s => s.exact === '謝淑妃'));
assert(xieMention); xieMention.spans.en.push(span(xie)); xieMention.candidateRefs.push(xie.id);
const place = candidate('b4afb9a624b24196');
next.candidateDispositions.push({ candidate: place.id, disposition: 'not-person', reason: 'place', note: null });
const prince = candidate('64a2c5fedcc5df96');
const nanyang = next.mentions.find(m => m.unit.id === 's0172' && m.person === 'jinshu:053:p028' && m.spans.en.some(s => s.exact === 'Prince of Nanyang'));
assert(nanyang); nanyang.candidateRefs.push(prince.id);
// Retain old changed-unit dispositions only if candidate survived unchanged and is not
// already attached to a mention. Do not use the reconciler's newly invented dispositions.
for (const d of old.candidateDispositions) {
  const c = newCandidates.get(d.candidate); if (!c || !changed.has(c.unit)) continue;
  const prev = oldCandidates.get(d.candidate); assert(prev && prev.exact === c.exact && prev.unit === c.unit && prev.language === c.language && prev.occurrence === c.occurrence, d.candidate);
  assert(!next.mentions.some(m => m.candidateRefs.includes(d.candidate)), d.candidate);
  next.candidateDispositions.push(d);
}
const merged = mergeEditorialDecisionReview(history, decisions);
const validation = validatePeopleExtraction(next, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(merged, validation.normalized);
const withoutId = m => { const value = structuredClone(m); delete value.id; return JSON.stringify(value); };
const oldUnchanged = old.mentions.filter(m => !changed.has(m.unit.id));
const newUnchanged = next.mentions.filter(m => !changed.has(m.unit.id));
const beforeSet = new Set(oldUnchanged.map(withoutId)); const afterSet = new Set(newUnchanged.map(withoutId));
assert.deepEqual(next.claims, old.claims); assert.deepEqual(next.people, old.people);
const delta = { oldChangedMentions: old.mentions.filter(m => changed.has(m.unit.id)), newChangedMentions: next.mentions.filter(m => changed.has(m.unit.id)), oldChangedDispositions: old.candidateDispositions.filter(d => changed.has(oldCandidates.get(d.candidate)?.unit)), newChangedDispositions: next.candidateDispositions.filter(d => changed.has(newCandidates.get(d.candidate)?.unit)), outsideEditedUnitsRemoved: oldUnchanged.filter(m => !afterSet.has(withoutId(m))), outsideEditedUnitsAdded: newUnchanged.filter(m => !beforeSet.has(withoutId(m))), claimsUnchanged: true, peopleUnchanged: true, removedScannerCandidates: [...oldCandidates.values()].filter(c => !newCandidates.has(c.id)), autoUnresolvedSpans: auto.unresolvedSpans, autoUnresolvedCandidates: auto.unresolvedCandidates, changedUnits: [...changed], note: 'For independent source/semantic review; passing validation does not approve entities, claims, or publication.' };
assert(!fs.existsSync(dest), `Refusing existing destination ${dest}`); fs.mkdirSync(dest);
const outputs = { 'source.json': revised, 'extraction.json': validation.normalized, 'editorial-history.json': merged, 'review-decisions.json': decisions, 'semantic-delta.json': delta };
const hashes = {}; for (const [name, value] of Object.entries(outputs)) { const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`); fs.writeFileSync(`${dest}/${name}`, bytes, {flag:'wx'}); hashes[name] = sha(bytes); }
console.log(JSON.stringify({ dest, hashes, fingerprint: packet.input.chapterFingerprint, stats: validation.stats, changedUnits: [...changed], status: 'structurally valid research only; independent source and downstream reviews remain open' }, null, 2));
