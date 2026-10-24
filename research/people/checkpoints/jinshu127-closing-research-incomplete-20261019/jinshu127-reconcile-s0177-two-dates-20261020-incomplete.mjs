// Research-only materialization: preserve sealed inputs and never touch canonical files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual as equal } from 'node:util';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { compactPeopleExtraction } from '../../../../scripts/lib/people-compact.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } from '../../../../scripts/lib/people-editorial-decisions.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs } from '../../../../scripts/lib/people-translation-repairs.mjs';
import { buildDateAuditPacket } from '../../../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../../../scripts/lib/people-date-workflow.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'jinshu127-s0177-two-dates-reconciled-20261020-incomplete');
const hashes = {
  source: ['jinshu127-closing-materialized-source-20261019.json', '74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c'],
  prior: ['jinshu127-closing-materialized-extraction-20261019.json', '1516f2bba52ebd08956e35da39e0387e926c8cbac9b99398c185c7cb6ebb8529'],
  history: ['jinshu127-closing-materialized-history-20261019.json', '7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190'],
  proposed: ['jinshu127-s0177-proposed-extraction-20261020-incomplete.json', 'cb1f5e1a6f7557c778a360b94a323574e9dc95bcceee4791c5c14c6e4b48c9e0'],
  decision: ['jinshu127-s0177-independent-decisions-20261020-incomplete.json', '997e9329969a3c73e37115f55f3bf7a4899f0159887ba9cd066cb5c5b44049cf'],
  dateProposal: ['jinshu127-rebased-two-chronology-20261020-incomplete/proposal.json', '60acaa5343282728c177dd2cda51592297e4ff1dd0bbcddabc4029bcbc6d198c'],
  dateCandidate: ['jinshu127-rebased-two-chronology-20261020-incomplete/candidate-extraction.json', '5d029d17d34f15f1b4678be97a31d78752a264870dfe51d15c448fef17f14c69'],
};
const sha = b => createHash('sha256').update(b).digest('hex');
const inputs = Object.fromEntries(Object.entries(hashes).map(([key, [name, expected]]) => {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (sha(bytes) !== expected) throw new Error(`Hash mismatch: ${name}`);
  return [key, JSON.parse(bytes)];
}));
const { source, prior, history, proposed, decision, dateProposal, dateCandidate } = inputs;
const base = structuredClone(proposed);
const newRepairs = base.translationRepairs.splice(prior.translationRepairs.length);
if (!equal(base, prior) || newRepairs.length !== 2 || newRepairs.some(r => r[0] !== 's0177')) throw new Error('Unexpected editorial proposal delta');
if (decision.reviewer.agentId !== '/root/jin127_0177_decision' || decision.decisions.length !== 2 || decision.decisions.some(d => d.decision !== 'revise')) throw new Error('Unexpected reviewer or decisions');
const oldPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(dir, hashes.source[0]) });
const checked = validateCompactPeopleExtraction(proposed, oldPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const merged = mergeEditorialDecisionReview(history, decision);
const review = validateEditorialDecisions(merged, checked.normalized, oldPacket);
if (review.reviewedRepairs.length !== 2 || review.retractedClaimIds.size || review.revisedClaims.size || review.addedClaims.length) throw new Error('Unexpected review output');
const edits = structuredClone(checked.normalized);
edits.translationRepairs = structuredClone(checked.normalized.translationRepairs.slice(0, prior.translationRepairs.length)).concat(review.reviewedRepairs);
const applied = applyTranslationRepairs(source, review.reviewedRepairs);
if (!equal([...applied.changedUnits], ['s0177'])) throw new Error('Unexpected changed units');
const expectedSource = structuredClone(source);
for (const repair of review.reviewedRepairs) {
  const row = expectedSource.content[repair.unit.blockIndex].sentences[repair.unit.itemIndex];
  if (row.id !== repair.unit.id || row.translations.length !== 1 || row.translations[0][repair.field] !== repair.before) throw new Error('Stale repair locator');
  row.translations[0][repair.field] = repair.after;
}
if (!equal(applied.chapter, expectedSource)) throw new Error('Unexpected source delta');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: applied.chapter, chapterFile: path.join(out, 'jinshu/127.json') });
const reconciled = reconcileExtractionAfterRepairs(edits, packet, { previousPacket: oldPacket });
const validated = validatePeopleExtraction(reconciled.extraction, packet, { strictAliasDispositions: true });
const compact = compactPeopleExtraction(validated.normalized, packet);
for (const [i, p] of compact.people.entries()) if (!Object.hasOwn(prior.people[i][4], 'e') && Array.isArray(p[4].e) && !p[4].e.length) delete p[4].e;
const editorialChecked = validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(merged, editorialChecked.normalized);
const replace = dateProposal.changes.find(c => c.kind === 'replace');
const hints = dateProposal.changes.find(c => c.kind === 'hints');
if (dateProposal.changes.length !== 2 || !replace || hints?.personId !== 'p142') throw new Error('Unexpected date edits');
const expectedDateCandidate = structuredClone(prior);
const oldIndices = expectedDateCandidate.claims.map((c, i) => equal(c, replace.before) ? i : -1).filter(i => i >= 0);
if (oldIndices.length !== 1 || !equal(expectedDateCandidate.people.find(p => p[0] === 'p142')[4].a, hints.before)) throw new Error('Original date target is not unique');
expectedDateCandidate.claims[oldIndices[0]] = structuredClone(replace.after);
expectedDateCandidate.people.find(p => p[0] === 'p142')[4].a = structuredClone(hints.after);
if (!equal(expectedDateCandidate, dateCandidate)) throw new Error('Date candidate has unexplained changes');
const indices = compact.claims.map((c, i) => equal(c, replace.before) ? i : -1).filter(i => i >= 0);
if (indices.length !== 1 || !equal(compact.people.find(p => p[0] === 'p142')[4].a, hints.before)) throw new Error('Reconciled date target is not unique');
fs.mkdirSync(out);
fs.mkdirSync(path.join(out, 'jinshu'));
const write = (name, obj) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(obj, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
write('jinshu/127.json', applied.chapter);
const datePacket = buildDateAuditPacket('jinshu', '127', { dataDir: out, extraction: compact });
const target = datePacket.items.filter(x => x.claimIndex === indices[0] && x.personId === 'p141' && equal(x.value, replace.before[2]));
if (target.length !== 1 || target[0].claimHash !== 'sha256:f16bc8d9d799d7af1abc9a04c2d6233a9f91ae401bc329cabfe064279dd43619') throw new Error('Date claim mismatch');
const replay = { sourceHash: datePacket.sourceHash, extractionHash: datePacket.extractionHash, changes: [{ ...replace, id: target[0].id }, structuredClone(hints)] };
const candidate = applyDateRepairProposal(compact, replay, datePacket);
const expected = structuredClone(compact);
expected.claims[indices[0]] = structuredClone(replace.after);
expected.people.find(p => p[0] === 'p142')[4].a = structuredClone(hints.after);
if (!equal(expected, candidate)) throw new Error('Unexpected replay changes');
const final = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(merged, final.normalized);
const newDatePacket = buildDateAuditPacket('jinshu', '127', { dataDir: out, extraction: candidate });
const sectionDelta = {};
for (const key of ['people', 'surfaces', 'claims', 'candidateDispositions', 'coverage']) if (!equal(prior[key], candidate[key])) {
  const a = prior[key], b = candidate[key];
  sectionDelta[key] = Array.isArray(a) && Array.isArray(b) ? { beforeCount: a.length, afterCount: b.length, changes: Array.from({ length: Math.max(a.length, b.length) }, (_, i) => i).filter(i => !equal(a[i], b[i])).map(i => ({ index: i, before: a[i] ?? null, after: b[i] ?? null })) } : { before: a, after: b };
}
const files = { 'editorial-extraction.json': compact, 'extraction.json': candidate, 'editorial-history.json': merged, 'pre-date-packet.json': datePacket, 'date-proposal.json': replay, 'date-packet.json': newDatePacket, 'diagnostics.json': { unresolvedSpans: reconciled.unresolvedSpans, unresolvedCandidates: reconciled.unresolvedCandidates, sectionDelta } };
for (const [name, obj] of Object.entries(files)) write(name, obj);
const result = { status: 'research-only-incomplete-not-independent-full-approval', inputSha256: Object.fromEntries(Object.entries(hashes).map(([k, v]) => [k, { path: v[0], sha256: v[1] }])), authors: { editorialDecision: decision.reviewer.agentId, chronologyRebaseReview: '/root/jin127_two_review', reconciliation: '/root/reconcile_127' }, editorialOriginalFingerprint: decision.input, preDate: { sourceHash: datePacket.sourceHash, extractionHash: datePacket.extractionHash, target: target[0].id, claimHash: target[0].claimHash }, postDate: { sourceHash: newDatePacket.sourceHash, extractionHash: newDatePacket.extractionHash }, outputSha256: Object.fromEntries(['jinshu/127.json', ...Object.keys(files)].map(name => [name, sha(fs.readFileSync(path.join(out, name)))])), stats: final.stats, limits: ['Independent review of this exact combined materialization is required.', 'No date approval is transferred to the new fingerprints; fresh independent full date audit remains required.', 'Editorial closure, identity, and publication remain unverified.', 'Only the two reviewed chronology edits are replayed; no unsupported dating was inferred.'] };
write('receipt.json', result);
console.log(JSON.stringify({ out, preDate: result.preDate, postDate: result.postDate, stats: result.stats, unresolvedSpans: reconciled.unresolvedSpans.length, unresolvedCandidates: reconciled.unresolvedCandidates.length, sections: Object.keys(sectionDelta), outputSha256: result.outputSha256 }, null, 2));
