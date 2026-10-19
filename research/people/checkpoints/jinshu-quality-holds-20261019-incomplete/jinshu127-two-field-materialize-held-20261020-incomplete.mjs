// Research only: materialize two reviewed source changes and retain all reconciliation as unreviewed.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = '/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const scripts = {
  'lib/people-translation-repairs.mjs': 'ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4',
  'build-people-extraction-packet.mjs': '6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245',
  'validate-people-extraction.mjs': '33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6',
  'lib/people-editorial-decisions.mjs': '8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6',
  'lib/people-compact.mjs': '7ce4680cf54d917731b1e92126c970f03c57639bd409c66b349f8fe1179b4ffb',
};
for (const [name, expected] of Object.entries(scripts)) if (sha(fs.readFileSync(path.join(fixture, 'scripts', name))) !== expected) throw new Error(`Changed fixture script: ${name}`);
const loadModule = name => import(pathToFileURL(path.join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await loadModule('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction, validatePeopleExtraction } = await loadModule('validate-people-extraction.mjs');
const { compactPeopleExtraction } = await loadModule('lib/people-compact.mjs');
const { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } = await loadModule('lib/people-editorial-decisions.mjs');
const { applyTranslationRepairs, reconcileExtractionAfterRepairs } = await loadModule('lib/people-translation-repairs.mjs');
const pins = {
  source: ['jinshu127-four-field-materialized-20261020-incomplete/source.json', '7ee2060fe19858753d4b08bd4171a567abe85c0d84b77c9b3396d033db0dccd4'],
  prior: ['jinshu127-four-field-reconciliation-corrected-20261020-incomplete/extraction.json', '5ff93e9532bc7f546c577982a90b8931879179dadf6f29a898ea159a9ce79add'],
  history: ['jinshu127-four-field-materialized-20261020-incomplete/editorial-history.json', 'ccdfed5ce8b2f7ae0303a3854f26258f71ee6cb855efd347280d1e9adabd86a1'],
  proposal: ['jinshu127-two-field-editorial-proposal-20261020-incomplete/proposed-extraction.json', 'cca702355ae0088500e23b279ef45b40a9b96bb207fa49b6770ece4ae33ed74b'],
  sealedPacket: ['jinshu127-two-field-editorial-proposal-20261020-incomplete/packet.json', 'b36187ee819207d718e18dbb1a4b22bc0a12c95021d80f44c55711f1c22778c9'],
  dossier: ['jinshu127-two-field-editorial-proposal-20261020-incomplete/review-dossier.json', '552dcfac51ec2221fb9e2b0b5419cc7cdafa1b714582a99d5c666fec8e950dad'],
  review: ['jinshu127-two-field-independent-editorial-decisions-20261020-incomplete.json', '1c0b7cb0104e7a89c73f86d210054d703b240a72299ffa4d076051a3ef1d4a8f'],
};
const load = ([name, expected]) => { const bytes = fs.readFileSync(path.join(dir, name)); if (sha(bytes) !== expected) throw new Error(`Changed input: ${name}`); return JSON.parse(bytes); };
const { source, prior, history, proposal, sealedPacket, dossier, review } = Object.fromEntries(Object.entries(pins).map(([key, value]) => [key, load(value)]));
const restored = structuredClone(proposal);
const additions = restored.translationRepairs.splice(prior.translationRepairs.length);
if (!isDeepStrictEqual(restored, prior) || additions.length !== 2 || additions.some(row => row[6] !== 'proposed')) throw new Error('Unexpected proposed extraction changes');
if (review.reviewer.agentId !== '/root/chapter127_source' || review.decisions.length !== 2 || review.decisions.some(item => item.decision !== 'accept')) throw new Error('Unexpected reviewer or decisions');
const oldPacket = buildPeopleExtractionPacket('jinshu', '127', {chapterData: source, chapterFile: path.join(dir, pins.source[0])});
if (!isDeepStrictEqual(oldPacket, sealedPacket) || !isDeepStrictEqual(dossier.decisionSeed.proposals, review.proposals)) throw new Error('Packet or dossier mismatch');
const checked = validateCompactPeopleExtraction(proposal, oldPacket, {strictAliasDispositions: true});
validateAppliedEditorialDecisions(history, checked.normalized);
const merged = mergeEditorialDecisionReview(history, review);
const validatedReview = validateEditorialDecisions(merged, checked.normalized, oldPacket);
if (validatedReview.reviewedRepairs.length !== 2 || validatedReview.retractedClaimIds.size || validatedReview.revisedClaims.size || validatedReview.addedClaims.length) throw new Error('Unexpected review changes');
const revised = structuredClone(checked.normalized);
revised.translationRepairs = revised.translationRepairs.slice(0, prior.translationRepairs.length).concat(validatedReview.reviewedRepairs);
const applied = applyTranslationRepairs(source, validatedReview.reviewedRepairs);
if (!isDeepStrictEqual([...applied.changedUnits].sort(), ['s0214', 's0215'])) throw new Error('Unexpected changed source units');
const reconstructed = structuredClone(applied.chapter);
for (const block of reconstructed.content) for (const sentence of block.sentences ?? []) {
  const original = source.content.flatMap(item => item.sentences ?? []).find(item => item.id === sentence.id);
  if (sentence.id === 's0214' || sentence.id === 's0215') sentence.translations[0].idiomatic = original.translations[0].idiomatic;
}
if (!isDeepStrictEqual(reconstructed, source)) throw new Error('Source changed outside the two approved fields');
const packet = buildPeopleExtractionPacket('jinshu', '127', {chapterData: applied.chapter, chapterFile: path.join(dir, pins.source[0])});
const reconciled = reconcileExtractionAfterRepairs(revised, packet, {previousPacket: oldPacket});
const changes = {};
for (const key of new Set([...Object.keys(revised), ...Object.keys(reconciled.extraction)])) {
  if (key === 'input' || key === 'translationRepairs' || isDeepStrictEqual(revised[key], reconciled.extraction[key])) continue;
  const before = revised[key], after = reconciled.extraction[key];
  changes[key] = Array.isArray(before) && Array.isArray(after) ? {
    beforeCount: before.length, afterCount: after.length,
    changedIndices: Array.from({length: Math.max(before.length, after.length)}, (_, index) => index).filter(index => !isDeepStrictEqual(before[index], after[index])).map(index => ({index, before: before[index] ?? null, after: after[index] ?? null})),
  } : {before, after};
}
let compact = null, validation = null;
try {
  const normalized = validatePeopleExtraction(reconciled.extraction, packet, {strictAliasDispositions: true});
  compact = compactPeopleExtraction(normalized.normalized, packet);
  const checkedNew = validateCompactPeopleExtraction(compact, packet, {strictAliasDispositions: true});
  validateAppliedEditorialDecisions(merged, checkedNew.normalized);
  validation = {passed: true, stats: checkedNew.stats};
} catch (error) { validation = {passed: false, error: String(error.stack ?? error)}; }
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = {
  'source.json': encode(applied.chapter),
  'packet.json': encode(packet),
  'editorial-history.json': encode(merged),
  'reconciled-extraction-UNREVIEWED.json': encode(reconciled.extraction),
  'reconciliation-diagnostics.json': encode({unresolvedSpans: reconciled.unresolvedSpans, unresolvedCandidates: reconciled.unresolvedCandidates, changes, validation}),
};
if (compact) outputs['compact-extraction-UNREVIEWED.json'] = encode(compact);
const receipt = {status: 'HELD-research-only-no-reconciliation-approval', stagingScriptsRevision: '303b4e0fe883d4d305d84987b656322a91e5c3a4', fixture, scriptHashes: scripts, inputHashes: Object.fromEntries(Object.entries(pins).map(([key, value]) => [key, value[1]])), outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])), chapterFingerprint: packet.input.chapterFingerprint, changedUnits: [...applied.changedUnits].sort(), unresolvedCandidates: reconciled.unresolvedCandidates.length, unresolvedSpans: reconciled.unresolvedSpans.length, changedSections: Object.keys(changes), validation, limitations: ['Reconciliation used the known unsafe staging algorithm and is never promoted by this script.', 'Every person link, disposition, claim and other change must receive independent source review, even when validators pass.', 'Known source defects and other chapter-wide editorial, date and identity gates remain open.', 'No canonical data, queue, locks or Git state changed.']};
outputs['receipt.json'] = encode(receipt);
const out = path.join(dir, 'jinshu127-two-field-materialized-held-20261020-incomplete');
fs.mkdirSync(out);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, {flag: 'wx', mode: 0o600});
console.log(JSON.stringify({out, receipt}, null, 2));
