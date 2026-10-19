// Offline-only Jinshu 127 materializer. No queue, Git index, lock or canonical writes.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from '/tmp/jinshu032-stage-check.0agK6SPj/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '/tmp/jinshu032-stage-check.0agK6SPj/scripts/validate-people-extraction.mjs';
import { compactPeopleExtraction } from '/tmp/jinshu032-stage-check.0agK6SPj/scripts/lib/people-compact.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions, mergeEditorialDecisionReview } from '/tmp/jinshu032-stage-check.0agK6SPj/scripts/lib/people-editorial-decisions.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs } from '/tmp/jinshu032-stage-check.0agK6SPj/scripts/lib/people-translation-repairs.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const ref = '67faa20531f92381a2b192c72004a2ae043e1763';
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024 });
const sha = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const equal = (a, b, message) => { if (!isDeepStrictEqual(a, b)) throw new Error(message); };
const bytes = x => Buffer.from(`${JSON.stringify(x, null, 2)}\n`, 'utf8');

export function materialize({ source, baseline, candidate, oldHistory, mergedHistory, review }) {
  const oldPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(root, 'data/jinshu/127.json') });
  if (baseline.schemaVersion !== 2 || baseline.book !== 'jinshu' || baseline.chapter !== '127' || baseline.translationRepairs.length !== 11 || baseline.translationRepairs.some(r => r[6] !== 'applied')) throw new Error('Unexpected old extraction');
  const candidateBefore = structuredClone(candidate);
  const proposed = candidateBefore.translationRepairs.splice(11);
  equal(candidateBefore, baseline, 'Candidate modifies unrelated baseline content');
  if (proposed.length !== 2 || proposed.some(r => r[0] !== 's0232' || r[6] !== 'proposed') || proposed[0][1] !== 'literal' || proposed[1][1] !== 'idiomatic') throw new Error('Unexpected proposed repairs');
  equal(mergeEditorialDecisionReview(oldHistory, review), mergedHistory, 'Merged review does not preserve exact old history and independent review');
  const before = validateCompactPeopleExtraction(candidate, oldPacket, { strictAliasDispositions: true });
  validateAppliedEditorialDecisions(oldHistory, before.normalized);
  const reviewed = validateEditorialDecisions(mergedHistory, before.normalized, oldPacket);
  if (reviewed.reviewedRepairs.length !== 2 || reviewed.retractedClaimIds.size || reviewed.revisedClaims.size || reviewed.addedClaims.length) throw new Error('Unexpected editorial decisions or claim mutations');
  if (review.decisions.length !== 2 || review.decisions.some(d => d.decision !== 'accept')) throw new Error('Both exact proposals must be accepted');
  const repairs = structuredClone(before.normalized.translationRepairs.slice(0, 11)).concat(reviewed.reviewedRepairs);
  const reviewedExtraction = { ...structuredClone(before.normalized), translationRepairs: repairs };
  const applied = applyTranslationRepairs(source, reviewed.reviewedRepairs);
  if (applied.changedUnits.size !== 1 || !applied.changedUnits.has('s0232')) throw new Error('Unexpected changed source units');
  const expectedSource = structuredClone(source);
  const unit = expectedSource.content[reviewed.reviewedRepairs[0].unit.blockIndex].sentences[reviewed.reviewedRepairs[0].unit.itemIndex];
  if (unit.id !== 's0232' || unit.translations.length !== 1 || unit.translations[0].lang !== 'en') throw new Error('Unexpected source locator');
  for (const repair of reviewed.reviewedRepairs) {
    if (unit.translations[0][repair.field] !== repair.before) throw new Error('Stale source before text');
    unit.translations[0][repair.field] = repair.after;
  }
  equal(applied.chapter, expectedSource, 'Unrelated source change');
  const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: applied.chapter, chapterFile: path.join(root, 'data/jinshu/127.json') });
  const reconciled = reconcileExtractionAfterRepairs(reviewedExtraction, packet, { previousPacket: oldPacket });
  if (reconciled.unresolvedSpans.length || reconciled.unresolvedCandidates.length) throw new Error('Unresolved spans or candidates require independent review');
  const validated = validatePeopleExtraction(reconciled.extraction, packet, { strictAliasDispositions: true });
  const extraction = compactPeopleExtraction(validated.normalized, packet);
  // The staged compactor adds optional e: [] to old rows. Preserve original
  // bytes semantically when and only when the sole delta is that empty default.
  for (const [index, person] of extraction.people.entries()) {
    const priorHints = baseline.people[index]?.[4], hints = person[4];
    if (priorHints && !Object.hasOwn(priorHints, 'e') && Array.isArray(hints.e) && hints.e.length === 0) delete hints.e;
  }
  const final = validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: true });
  validateAppliedEditorialDecisions(mergedHistory, final.normalized);
  equal(extraction.translationRepairs.slice(0, 11), baseline.translationRepairs, 'Old repair history changed');
  const differenceCheck = structuredClone(extraction);
  differenceCheck.input = structuredClone(baseline.input);
  differenceCheck.translationRepairs = structuredClone(baseline.translationRepairs);
  const differentKeys = [...new Set([...Object.keys(differenceCheck), ...Object.keys(baseline)])].filter(k => !isDeepStrictEqual(differenceCheck[k], baseline[k]));
  if (differentKeys.length) throw new Error(`Unrelated compact extraction changed during reconciliation: ${differentKeys.join(', ')}`);
  return { source: applied.chapter, extraction, packet, stats: final.stats };
}

function main() {
  const remote = git('ls-remote', 'origin', 'refs/heads/codex/people-glossary-staging-v2').toString('utf8').trim().split(/\s+/)[0];
  if (remote !== ref) throw new Error('Staging ref changed');
  const code = ['scripts/build-people-extraction-packet.mjs', 'scripts/validate-people-extraction.mjs', 'scripts/lib/people-editorial-decisions.mjs', 'scripts/lib/people-compact.mjs', 'scripts/lib/people-translation-repairs.mjs'];
  for (const file of code) {
    if (git('hash-object', path.join('/tmp/jinshu032-stage-check.0agK6SPj', file)).toString('utf8').trim() !== git('rev-parse', `${ref}:${file}`).toString('utf8').trim()) throw new Error(`Harness code drift: ${file}`);
  }
  const stageFiles = ['data/jinshu/127.json', 'data/people/extractions/jinshu/127.json', 'data/people/editorial-decisions/jinshu/127.json', 'data/people/date-audits/jinshu/127.json'];
  const stage = Object.fromEntries(stageFiles.map(f => [f, git('show', `${ref}:${f}`)]));
  const artifactFiles = ['jinshu127-s0232-editorial-candidate-67faa205.json', 'jinshu127-s0232-editorial-independent-decision-disk-audit-67faa205.json', 'jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json'];
  const artifacts = Object.fromEntries(artifactFiles.map(f => [f, fs.readFileSync(path.join(dir, f))]));
  const parse = b => JSON.parse(b.toString('utf8'));
  const result = materialize({ source: parse(stage[stageFiles[0]]), baseline: parse(stage[stageFiles[1]]), oldHistory: parse(stage[stageFiles[2]]), candidate: parse(artifacts[artifactFiles[0]]), review: parse(artifacts[artifactFiles[1]]), mergedHistory: parse(artifacts[artifactFiles[2]]) });
  const outputs = { 'jinshu127-s0232-materialized-source-67faa205.json': bytes(result.source), 'jinshu127-s0232-materialized-extraction-67faa205.json': bytes(result.extraction), 'jinshu127-s0232-materialized-packet-67faa205.json': bytes(result.packet) };
  const receipt = { schemaVersion: 1, status: 'artifact-only-not-published', staging: ref, inputs: Object.fromEntries([...Object.entries(stage), ...Object.entries(artifacts)].map(([file, value]) => [file, sha(value)])), outputs: Object.fromEntries(Object.entries(outputs).map(([file, value]) => [file, sha(value)])), stats: result.stats, limitations: 'Identity provenance, chronology, independent materializer review, ownership, stale downstream references, and safe publication remain unresolved.' };
  outputs['jinshu127-s0232-materialized-receipt-67faa205.json'] = bytes(receipt);
  for (const file of Object.keys(outputs)) if (fs.existsSync(path.join(dir, file))) throw new Error(`Refusing to overwrite ${file}`);
  const current = git('ls-remote', 'origin', 'refs/heads/codex/people-glossary-staging-v2').toString('utf8').trim().split(/\s+/)[0];
  if (current !== ref) throw new Error('Staging changed before artifact write');
  for (const [file, data] of Object.entries(outputs)) fs.writeFileSync(path.join(dir, file), data, { flag: 'wx', mode: 0o600 });
  console.log(JSON.stringify({ status: receipt.status, outputs: Object.fromEntries(Object.keys(outputs).map(file => [file, sha(fs.readFileSync(path.join(dir, file)))])), stats: result.stats }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
