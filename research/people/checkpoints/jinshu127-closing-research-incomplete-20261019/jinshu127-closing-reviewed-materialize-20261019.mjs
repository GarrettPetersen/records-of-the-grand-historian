// Offline research artifact only; no queue, lock, source-tree, or Git-index writes.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { compactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-compact.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const fixture = '/tmp/jinshu053-strict-5ce.NuGR9k1r';
const base = '4b9022c6fb104404f6e12c91c1e1081a93a5ae1d';
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024 }).toString('utf8').trim();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {
  source: ['jinshu127-s0232-materialized-source-67faa205.json', '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39'],
  prior: ['jinshu127-s0173-conservative-v5-candidate-20261019.json', '44f98126487a079ee1776a9b76eb5f6ebfd04427ef731b38b3c6096b44e79a99'],
  history: ['jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json', '002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5'],
  proposal: ['jinshu127-closing-proposed-extraction-20261019.json', '571756eb0313bbca02e59b535d41da40471f124a7faabc46f691eb34a3f3b798'],
  review: ['jinshu127-closing-independent-decisions-20261019.json', '2ceb79ff3abeabc2d67fd7f5b79f118009b4ddcb817e267439e7feea5f775c2e'],
};
const load = ([file, hash]) => { const b = fs.readFileSync(path.join(dir, file)); if (sha(b) !== hash) throw new Error(`Input hash mismatch: ${file}`); return JSON.parse(b); };
for (const file of ['scripts/build-people-extraction-packet.mjs', 'scripts/validate-people-extraction.mjs', 'scripts/lib/people-editorial-decisions.mjs', 'scripts/lib/people-compact.mjs', 'scripts/lib/people-translation-repairs.mjs']) {
  if (git('rev-parse', `${base}:${file}`) !== git('hash-object', path.join(fixture, file))) throw new Error(`Fixture mismatch: ${file}`);
}
const { source, prior, history, proposal, review } = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, load(value)]));
const unproposed = structuredClone(proposal); const additions = unproposed.translationRepairs.splice(13);
if (!isDeepStrictEqual(unproposed, prior) || additions.length !== 3 || additions.some(x => x[6] !== 'proposed')) throw new Error('Unexpected proposal delta');
if (review.reviewer.agentId !== '/root/jinshu127_review' || review.decisions.length !== 3 || review.decisions.map(x => x.decision).join(',') !== 'accept,revise,revise') throw new Error('Unexpected review');
const oldPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(root, 'data/jinshu/127.json') });
const priorChecked = validateCompactPeopleExtraction(proposal, oldPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, priorChecked.normalized);
const merged = mergeEditorialDecisionReview(history, review);
const reviewed = validateEditorialDecisions(merged, priorChecked.normalized, oldPacket);
if (reviewed.reviewedRepairs.length !== 3 || reviewed.retractedClaimIds.size || reviewed.revisedClaims.size || reviewed.addedClaims.length) throw new Error('Unexpected reviewed claim changes');
const edits = structuredClone(priorChecked.normalized);
edits.translationRepairs = structuredClone(priorChecked.normalized.translationRepairs.slice(0, 13)).concat(reviewed.reviewedRepairs);
const applied = applyTranslationRepairs(source, reviewed.reviewedRepairs);
if (!isDeepStrictEqual([...applied.changedUnits].sort(), ['s0277', 's0279'])) throw new Error('Unexpected changed source units');
const expected = structuredClone(source);
for (const repair of reviewed.reviewedRepairs) {
  const row = expected.content[repair.unit.blockIndex].sentences[repair.unit.itemIndex];
  if (row.id !== repair.unit.id || row.translations.length !== 1 || row.translations[0][repair.field] !== repair.before) throw new Error('Stale source locator');
  row.translations[0][repair.field] = repair.after;
}
if (!isDeepStrictEqual(applied.chapter, expected)) throw new Error('Unexpected source changes');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: applied.chapter, chapterFile: path.join(root, 'data/jinshu/127.json') });
const reconciled = reconcileExtractionAfterRepairs(edits, packet, { previousPacket: oldPacket });
const validated = validatePeopleExtraction(reconciled.extraction, packet, { strictAliasDispositions: true });
const compact = compactPeopleExtraction(validated.normalized, packet);
for (const [index, person] of compact.people.entries()) {
  const old = prior.people[index]?.[4], current = person[4];
  if (old && !Object.hasOwn(old, 'e') && Array.isArray(current.e) && current.e.length === 0) delete current.e;
}
const final = validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(merged, final.normalized);
const changes = {};
for (const key of ['people', 'surfaces', 'claims', 'candidateDispositions', 'coverage']) {
  if (!isDeepStrictEqual(prior[key], compact[key])) {
    const a = prior[key], b = compact[key];
    changes[key] = Array.isArray(a) && Array.isArray(b) ? { beforeCount: a.length, afterCount: b.length,
      changedIndices: Array.from({ length: Math.max(a.length, b.length) }, (_, i) => i).filter(i => !isDeepStrictEqual(a[i], b[i])).map(i => ({ index: i, before: a[i] ?? null, after: b[i] ?? null })) } : { before: a, after: b };
  }
}
const serialized = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
const outputs = {
  'jinshu127-closing-materialized-source-20261019.json': serialized(applied.chapter),
  'jinshu127-closing-materialized-extraction-20261019.json': serialized(compact),
  'jinshu127-closing-materialized-packet-20261019.json': serialized(packet),
  'jinshu127-closing-materialized-history-20261019.json': serialized(merged),
  'jinshu127-closing-reconciliation-diagnostics-20261019.json': serialized({ unresolvedSpans: reconciled.unresolvedSpans, unresolvedCandidates: reconciled.unresolvedCandidates, changes }),
};
const hold = Object.keys(changes).length > 0 || reconciled.unresolvedSpans.length > 0 || reconciled.unresolvedCandidates.length > 0;
outputs['jinshu127-closing-materialized-receipt-20261019.json'] = serialized({ schemaVersion: 1, status: 'research-only-not-published', base, reconciliationRequiresIndependentReview: hold,
  inputHashes: Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, v[1]])), outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])), stats: final.stats,
  limitations: ['No date, identity, provenance or publication approval.', 'Do not accept any reconciled mentions or dispositions without independent semantic review.', 'Only named fixture files are compared with staging; transitive dependencies are not fully pinned.'] });
for (const name of Object.keys(outputs)) if (fs.existsSync(path.join(dir, name))) throw new Error(`Refusing to overwrite ${name}`);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(dir, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ status: 'research-only-not-published', hold, changedSections: Object.keys(changes), unresolvedSpans: reconciled.unresolvedSpans.length, unresolvedCandidates: reconciled.unresolvedCandidates.length, stats: final.stats, outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])) }, null, 2));
