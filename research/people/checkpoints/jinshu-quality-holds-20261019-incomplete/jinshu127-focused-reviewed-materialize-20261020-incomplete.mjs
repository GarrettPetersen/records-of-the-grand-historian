// Research-only, fingerprint-checked materialization. Never writes canonical data.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';

const dir = path.dirname(new URL(import.meta.url).pathname);
const fixture = process.env.JINSHU127_REVIEW_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw new Error('Set JINSHU127_REVIEW_FIXTURE to the exact staging-derived script fixture');
const loadModule = name => import(pathToFileURL(path.join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await loadModule('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction, validatePeopleExtraction } = await loadModule('validate-people-extraction.mjs');
const { compactPeopleExtraction } = await loadModule('lib/people-compact.mjs');
const { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } = await loadModule('lib/people-editorial-decisions.mjs');
const { applyTranslationRepairs, reconcileExtractionAfterRepairs } = await loadModule('lib/people-translation-repairs.mjs');
const sha = b => createHash('sha256').update(b).digest('hex');
const inputs = {
  source: ['jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json', 'cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264'],
  prior: ['jinshu127-p141-hint-proposal-20261020-incomplete/candidate-extraction.json', '5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8'],
  history: ['jinshu127-s0177-two-dates-reconciled-20261020-incomplete/editorial-history.json', '63ce6951e5ddefc83413787448dd900a8ac9eb282fa961392c5f34977e539a41'],
  proposal: ['jinshu127-focused-editorial-proposals-20261020-incomplete/proposed-extraction.json', '72ba1c64e3cdf3acd3a243e463702e0e1131243b84ae2cf3e471ef372488c57d'],
  review: ['jinshu127-focused-editorial-proposals-20261020-incomplete/independent-decisions-witness-review-20261019.json', '39cef4a386aa9ce1ba05845a6bf7890bbd8253cd87e81e1b16cef6ba2dc0d188'],
};
const load = ([name, expected]) => { const bytes = fs.readFileSync(path.join(dir, name)); if (sha(bytes) !== expected) throw new Error(`Changed input ${name}`); return JSON.parse(bytes); };
const { source, prior, history, proposal, review } = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, load(v)]));
const unproposed = structuredClone(proposal); const added = unproposed.translationRepairs.splice(prior.translationRepairs.length);
if (!isDeepStrictEqual(unproposed, prior) || added.length !== 12 || added.some(x => x[6] !== 'proposed')) throw new Error('Proposal differs beyond twelve repairs');
if (review.reviewer.agentId !== '/root/repair_witness_review_20' || review.decisions.length !== 12 || review.decisions.filter(d => d.decision === 'accept').length !== 10 || review.decisions.filter(d => d.decision === 'revise').length !== 2) throw new Error('Unexpected independent decisions');
const oldPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(dir, inputs.source[0]) });
const checked = validateCompactPeopleExtraction(proposal, oldPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const merged = mergeEditorialDecisionReview(history, review);
const reviewed = validateEditorialDecisions(merged, checked.normalized, oldPacket);
if (reviewed.reviewedRepairs.length !== 12 || reviewed.retractedClaimIds.size || reviewed.revisedClaims.size || reviewed.addedClaims.length) throw new Error('Unexpected reviewed changes');
const revised = structuredClone(checked.normalized);
revised.translationRepairs = revised.translationRepairs.slice(0, prior.translationRepairs.length).concat(reviewed.reviewedRepairs);
const applied = applyTranslationRepairs(source, reviewed.reviewedRepairs);
const expectedUnits = ['s0205', 's0210', 's0213', 's0255', 's0267', 's0268', 's0272', 's0275'];
if (!isDeepStrictEqual([...applied.changedUnits].sort(), expectedUnits)) throw new Error('Unexpected changed units');
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
  const a = prior[key], b = compact[key];
  changes[key] = Array.isArray(a) && Array.isArray(b) ? { beforeCount: a.length, afterCount: b.length, changedIndices: Array.from({length: Math.max(a.length,b.length)}, (_, i) => i).filter(i => !isDeepStrictEqual(a[i],b[i])).map(i => ({index:i,before:a[i]??null,after:b[i]??null})) } : {before:a,after:b};
}
const encode = v => Buffer.from(`${JSON.stringify(v, null, 2)}\n`);
const outputs = {
  'source.json': encode(applied.chapter), 'extraction.json': encode(compact), 'packet.json': encode(packet), 'editorial-history.json': encode(merged),
  'reconciliation-diagnostics.json': encode({ unresolvedSpans: reconciled.unresolvedSpans, unresolvedCandidates: reconciled.unresolvedCandidates, changes }),
};
const receipt = { status: 'research-only-incomplete-not-published', stagingScriptsRevision: '4049df22ccbe5a5c62c60ba8589607c55866e93a', inputHashes: Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,v[1]])), outputHashes: Object.fromEntries(Object.entries(outputs).map(([k,v])=>[k,sha(v)])), stats: validated.stats, independentReconciliationRequired: !!(Object.keys(changes).length || reconciled.unresolvedSpans.length || reconciled.unresolvedCandidates.length), limitations: ['No whole-chapter editorial, date or identity approval.', 'Known s0181–s0194 and s0214–s0242 defects remain unresolved.', 'Reconciliation changes require independent source review; source changes invalidate date and identity approvals.', 'No canonical data, queue or Git index was changed.'] };
outputs['receipt.json'] = encode(receipt);
const out = path.join(dir, 'jinshu127-focused-reviewed-materialized-20261020-incomplete');
fs.mkdirSync(out);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ out, receipt, changedSections: Object.keys(changes), unresolvedSpans: reconciled.unresolvedSpans.length, unresolvedCandidates: reconciled.unresolvedCandidates.length }, null, 2));
