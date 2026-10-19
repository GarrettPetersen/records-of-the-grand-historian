// Diagnostic accounting only; retained spans are not source-approved.
// In particular the broad s0183 span covers a province and polity as well as
// Zhu Lingshi, and must be independently reviewed/narrowed before publication.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-patched-final.') || process.env.PEOPLE_REPO_ROOT !== fixture) throw Error('Dedicated fixture required');
const sha = b => createHash('sha256').update(b).digest('hex');
function load(file, expected) {
  const bytes = readFileSync(file);
  if (sha(bytes) !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(bytes);
}
const source = load('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const dossier = load('research/people/jinshu129-rebased-editorial-dossier-20261020-incomplete.json', '758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367');
const decisions = load('research/people/jinshu129-rebased-editorial-independent-decisions-20261020-incomplete.json', '9a8ae3bffb3bd13e75e3aae86b2130f59e894e2ee142f4aa9a245eb6fb016f80');
const history = load('data/people/editorial-decisions/jinshu/129.json', 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2');
const oldBad = load('research/people/jinshu129-final-materialized-20261020-incomplete.json', '3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26');
if (!isDeepStrictEqual(source, JSON.parse(readFileSync(join(fixture, 'data/jinshu/129.json'))))) throw Error('Fixture source differs');
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await mod('validate-people-extraction.mjs');
const { validateEditorialDecisions, mergeEditorialDecisionReview, validateAppliedEditorialDecisions } = await mod('lib/people-editorial-decisions.mjs');
const { applyPeopleTranslationRepairs } = await mod('apply-people-translation-repairs.mjs');
const { applyTranslationRepairs, reconcileExtractionAfterRepairs, assignExplicitCandidatePeople } = await mod('lib/people-translation-repairs.mjs');
const packet = buildPeopleExtractionPacket('jinshu', '129', {chapterData:source});
const normalized = validateCompactPeopleExtraction(dossier.candidate, packet, {strictAliasDispositions:true}).normalized;
const review = validateEditorialDecisions(decisions, normalized, packet);
if (review.reviewedRepairs.length !== 2 || review.revisedClaims.size !== 1 || !review.revisedClaims.has('jinshu:129:c0667') || review.retractedClaimIds.size || review.addedClaims.length) throw Error('Unexpected review effects');
const revisedSource = applyTranslationRepairs(source, review.reviewedRepairs).chapter;
if (!isDeepStrictEqual(revisedSource, oldBad.source)) throw Error('Unexpected reviewed source');
const packetAfter = buildPeopleExtractionPacket('jinshu', '129', {chapterData:revisedSource});
const reviewedExtraction = {...structuredClone(normalized), claims:normalized.claims.map(c => review.revisedClaims.get(c.id) ?? c)};
const reconciled = assignExplicitCandidatePeople(reconcileExtractionAfterRepairs(reviewedExtraction, packetAfter, {previousPacket:packet}), packetAfter, []);
const details = reconciled.unresolvedCandidates.map(id => {
  const c = packetAfter.preflight.candidates.find(item => item.id === id);
  const unit = packetAfter.units.find(item => item.id === c?.unit);
  if (!c || !unit) throw Error(`Missing unresolved context ${id}`);
  return {id, unit:c.unit, language:c.language, exact:c.exact, zh:unit.zh, en:unit.en};
});
const targets = ['jinshu:129:cand_8dc4288346d219dc','jinshu:129:cand_d162756b159cff9a'].map(id => ({
  id, mentions:reconciled.extraction.mentions.filter(m => m.candidateRefs.includes(id)).map(m => ({person:m.person, unit:m.unit.id, kind:m.kind, spans:m.spans})),
  dispositions:reconciled.extraction.candidateDispositions.filter(d => d.candidate === id),
}));
if (targets.some(t => t.dispositions.length || t.mentions.length !== 1)) throw Error(`Unexpected target candidate accounting: ${JSON.stringify(targets)}`);
const baseline = new Set(normalized.candidateDispositions.map(d => d.candidate));
const newDispositions = reconciled.extraction.candidateDispositions.filter(d => !baseline.has(d.candidate)).map(d => ({...d, candidateDetails:packetAfter.preflight.candidates.find(c => c.id === d.candidate)}));
const result = {status:'diagnostic-only-not-approved', unresolvedSpans:reconciled.unresolvedSpans, unresolvedCandidates:details, targets, newDispositions};
console.log(JSON.stringify(result, null, 2));
// Exercise the actual host applier too. Its only writes are under the fixture.
const extractionFile = join(fixture, 'data/people/extractions/jinshu/129.json');
const decisionFile = join(fixture, 'review-decisions.json');
mkdirSync(join(fixture, 'data/people/extractions/jinshu'), {recursive:true});
writeFileSync(extractionFile, `${JSON.stringify(dossier.candidate,null,2)}\n`, {flag:'wx'});
writeFileSync(decisionFile, `${JSON.stringify(decisions,null,2)}\n`, {flag:'wx'});
try {
  applyPeopleTranslationRepairs({book:'jinshu', chapter:'129', extraction:extractionFile, decisions:decisionFile, reconcileCurrent:false, candidateDispositions:[], candidatePeople:[]});
  if (details.length || reconciled.unresolvedSpans.length) throw Error('Applier succeeded despite reported unresolved work');
  const fixtureSource = JSON.parse(readFileSync(join(fixture, 'data/jinshu/129.json')));
  const fixtureExtraction = JSON.parse(readFileSync(extractionFile));
  const finalResult = validateCompactPeopleExtraction(fixtureExtraction, buildPeopleExtractionPacket('jinshu', '129', {chapterData:fixtureSource}), {strictAliasDispositions:true});
  validateAppliedEditorialDecisions(mergeEditorialDecisionReview(history, decisions), finalResult.normalized);
  console.log(`Fixture production applier: success; ${finalResult.stats.claims} claims. Still research only.`);
} catch (error) {
  if (!details.length && !reconciled.unresolvedSpans.length) throw error;
  if (!isDeepStrictEqual(JSON.parse(readFileSync(join(fixture, 'data/jinshu/129.json'))), source)) throw Error('Applier changed fixture source despite unresolved candidates');
  console.log(`Fixture production applier stopped safely: ${error.message}`);
}
