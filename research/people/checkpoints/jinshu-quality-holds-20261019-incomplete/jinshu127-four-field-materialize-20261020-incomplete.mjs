// Research-only: preserve the reviewed four-field result without publishing it.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = process.env.JINSHU127_REVIEW_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw new Error('An absolute staging script fixture is required');
const loadModule = name => import(pathToFileURL(path.join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await loadModule('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction, validatePeopleExtraction } = await loadModule('validate-people-extraction.mjs');
const { compactPeopleExtraction } = await loadModule('lib/people-compact.mjs');
const { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } = await loadModule('lib/people-editorial-decisions.mjs');
const { applyTranslationRepairs, reconcileExtractionAfterRepairs } = await loadModule('lib/people-translation-repairs.mjs');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {
  source: ['jinshu127-focused-reviewed-materialized-20261020-incomplete/source.json', '6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652'],
  prior: ['jinshu127-focused-reconciliation-candidate-20261020-incomplete/extraction.json', 'cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7'],
  history: ['jinshu127-focused-reviewed-materialized-20261020-incomplete/editorial-history.json', '4e496af66185e95535f0ffbc7fb9085b13b75f41ce216f7357bb6aa7495e8102'],
  proposal: ['jinshu127-four-field-editorial-proposal-20261020-incomplete/proposed-extraction.json', 'f3c3fae28dea2a2da6ec53d1d81ac50451555741f09693fc02c1e545c19610db'],
  review: ['jinshu127-four-field-editorial-proposal-20261020-incomplete/independent-decisions-20261020-incomplete.json', '7df36bbe5d6335658025db1a1325b23673fccb7d4d1135c00bb3fc0a16205d5f'],
};
const load = ([name, expected]) => { const bytes = fs.readFileSync(path.join(dir, name)); if (sha(bytes) !== expected) throw new Error(`Changed input ${name}`); return JSON.parse(bytes); };
const { source, prior, history, proposal, review } = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, load(value)]));
const unproposed = structuredClone(proposal);
const added = unproposed.translationRepairs.splice(prior.translationRepairs.length);
if (!isDeepStrictEqual(unproposed, prior) || added.length !== 4 || added.some(repair => repair[6] !== 'proposed')) throw new Error('Unexpected proposal changes');
if (review.reviewer.agentId !== '/root/chapter127_repairs' || review.decisions.length !== 4 || review.decisions.some(decision => decision.decision !== 'accept')) throw new Error('Unexpected independent review');
const oldPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(dir, inputs.source[0]) });
const checked = validateCompactPeopleExtraction(proposal, oldPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const merged = mergeEditorialDecisionReview(history, review);
const reviewed = validateEditorialDecisions(merged, checked.normalized, oldPacket);
if (reviewed.reviewedRepairs.length !== 4 || reviewed.retractedClaimIds.size || reviewed.revisedClaims.size || reviewed.addedClaims.length) throw new Error('Unexpected reviewed changes');
const revised = structuredClone(checked.normalized);
revised.translationRepairs = revised.translationRepairs.slice(0, prior.translationRepairs.length).concat(reviewed.reviewedRepairs);
const applied = applyTranslationRepairs(source, reviewed.reviewedRepairs);
if (!isDeepStrictEqual([...applied.changedUnits].sort(), ['s0182', 's0272', 's0275'])) throw new Error('Unexpected changed units');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: applied.chapter, chapterFile: path.join(dir, inputs.source[0]) });
const reconciled = reconcileExtractionAfterRepairs(revised, packet, { previousPacket: oldPacket });
const normalized = validatePeopleExtraction(reconciled.extraction, packet, { strictAliasDispositions: true });
const compact = compactPeopleExtraction(normalized.normalized, packet);
for (const [index, person] of compact.people.entries()) {
  const old = prior.people[index]?.[4], current = person[4];
  if (old && !Object.hasOwn(old, 'e') && Array.isArray(current.e) && current.e.length === 0) delete current.e;
}
const validated = validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(merged, validated.normalized);
const changes = {};
for (const key of ['people', 'surfaces', 'claims', 'candidateDispositions', 'coverage']) if (!isDeepStrictEqual(prior[key], compact[key])) {
  const before = prior[key], after = compact[key];
  changes[key] = Array.isArray(before) && Array.isArray(after) ? { beforeCount: before.length, afterCount: after.length, changedIndices: Array.from({length: Math.max(before.length, after.length)}, (_, i) => i).filter(i => !isDeepStrictEqual(before[i], after[i])).map(i => ({index: i, before: before[i] ?? null, after: after[i] ?? null})) } : {before, after};
}
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = {
  'source.json': encode(applied.chapter), 'extraction.json': encode(compact), 'packet.json': encode(packet), 'editorial-history.json': encode(merged),
  'reconciliation-diagnostics.json': encode({ unresolvedSpans: reconciled.unresolvedSpans, unresolvedCandidates: reconciled.unresolvedCandidates, changes }),
};
const receipt = { status: 'research-only-incomplete-not-published', inputHashes: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, value[1]])), outputHashes: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, sha(value)])), stats: validated.stats, independentReconciliationRequired: true, limitations: ['No whole-chapter editorial, date or identity approval.', 'Known source and translation defects remain unresolved.', 'All reconciliation changes require independent source review; source changes invalidate date and identity approvals.', 'No canonical data, queue or Git index was changed.'] };
outputs['receipt.json'] = encode(receipt);
const out = path.join(dir, 'jinshu127-four-field-materialized-20261020-incomplete');
fs.mkdirSync(out);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({out, receipt, changedSections: Object.keys(changes), unresolvedSpans: reconciled.unresolvedSpans.length, unresolvedCandidates: reconciled.unresolvedCandidates.length}, null, 2));
