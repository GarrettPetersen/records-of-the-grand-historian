// Research-only materialization using the exact staging applier in a disposable fixture root.
// This script cannot authorize canonical changes, a date audit, or publication.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-materialize.') || process.env.PEOPLE_REPO_ROOT !== fixture) {
  throw Error('A dedicated /tmp fixture and matching PEOPLE_REPO_ROOT are required');
}
const sha = b => createHash('sha256').update(b).digest('hex');
function read(file, expected) {
  const bytes = readFileSync(join(root, file));
  if (sha(bytes) !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(bytes);
}
const dossierFile = 'research/people/jinshu129-rebased-editorial-dossier-20261020-incomplete.json';
const decisionsFile = 'research/people/jinshu129-rebased-editorial-independent-decisions-20261020-incomplete.json';
const dossier = read(dossierFile, '758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367');
const decisions = read(decisionsFile, '9a8ae3bffb3bd13e75e3aae86b2130f59e894e2ee142f4aa9a245eb6fb016f80');
const original = read('data/people/extractions/jinshu/129.json', '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8');
const source = read('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const history = read('data/people/editorial-decisions/jinshu/129.json', 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2');
const evidence = read('research/people/jinshu129-evidence-candidate-20261020-incomplete.json', '245bef6e19358f7e470ca1771029bf5d7403bac9c710a7403b3bc2a28c2f5549');
if (dossier.status !== 'research-only-not-approved' || evidence.status !== 'research-only-not-approved') throw Error('Unexpected research status');
if (!isDeepStrictEqual(JSON.parse(readFileSync(join(fixture, 'data/jinshu/129.json'))), source) ||
    !isDeepStrictEqual(JSON.parse(readFileSync(join(fixture, 'data/people/editorial-decisions/jinshu/129.json'))), history)) throw Error('Fixture staging source/history differ');
const reversed = structuredClone(evidence.candidate);
for (const change of evidence.changes) {
  if (change.after === null) reversed.claims.splice(change.compactIndexBefore, 0, change.before);
  else reversed.claims[change.compactIndexBefore] = change.before;
}
if (!isDeepStrictEqual(reversed, original)) throw Error('Evidence candidate is not exactly the five reviewed changes');
const candidateBefore = structuredClone(dossier.candidate);
const undoProposals = structuredClone(candidateBefore);
undoProposals.translationRepairs.splice(-2);
if (!isDeepStrictEqual(undoProposals, evidence.candidate)) throw Error('Unexpected rebased dossier delta');
const extractionFile = join(fixture, 'data/people/extractions/jinshu/129.json');
const decisionFile = join(fixture, 'review-decisions.json');
mkdirSync(join(fixture, 'data/people/extractions/jinshu'), {recursive: true});
writeFileSync(extractionFile, `${JSON.stringify(candidateBefore, null, 2)}\n`, {flag:'wx'});
writeFileSync(decisionFile, `${JSON.stringify(decisions, null, 2)}\n`, {flag:'wx'});
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await mod('validate-people-extraction.mjs');
const { mergeEditorialDecisionReview, validateAppliedEditorialDecisions, validateEditorialDecisions } = await mod('lib/people-editorial-decisions.mjs');
const { applyPeopleTranslationRepairs } = await mod('apply-people-translation-repairs.mjs');
const packetBefore = buildPeopleExtractionPacket('jinshu', '129', {chapterData: source});
const normalizedBefore = validateCompactPeopleExtraction(candidateBefore, packetBefore, {strictAliasDispositions: true}).normalized;
const reviewed = validateEditorialDecisions(decisions, normalizedBefore, packetBefore);
if (reviewed.reviewedRepairs.length !== 2 || reviewed.revisedClaims.size !== 1 || !reviewed.revisedClaims.has('jinshu:129:c0667') || reviewed.retractedClaimIds.size || reviewed.addedClaims.length) throw Error('Unexpected decision scope');
const historyAfter = mergeEditorialDecisionReview(history, decisions);
applyPeopleTranslationRepairs({book:'jinshu', chapter:'129', extraction:extractionFile, decisions:decisionFile, reconcileCurrent:false, candidateDispositions:[], candidatePeople:[]});
const sourceAfter = JSON.parse(readFileSync(join(fixture, 'data/jinshu/129.json')));
const extractionAfter = JSON.parse(readFileSync(extractionFile));
const packetAfter = buildPeopleExtractionPacket('jinshu', '129', {chapterData: sourceAfter});
const result = validateCompactPeopleExtraction(extractionAfter, packetAfter, {strictAliasDispositions: true});
validateAppliedEditorialDecisions(historyAfter, result.normalized);
const sourceReversed = structuredClone(sourceAfter);
for (const proposal of decisions.proposals) {
  const sentence = sourceReversed.content[proposal.unit.blockIndex]?.[proposal.unit.collection]?.[proposal.unit.itemIndex];
  if (sentence?.id !== proposal.unit.id) throw Error('Source locator mismatch');
  const translations = sentence.translations.filter(t => t.lang === 'en');
  if (translations.length !== 1 || translations[0][proposal.field] !== proposal.after) throw Error('Source final text mismatch');
  translations[0][proposal.field] = proposal.before;
}
if (!isDeepStrictEqual(sourceReversed, source)) throw Error('Unreviewed source change');
const expectedClaims = normalizedBefore.claims.map(claim => reviewed.revisedClaims.get(claim.id) ?? claim);
if (!isDeepStrictEqual(result.normalized.claims, expectedClaims)) throw Error('Unreviewed claim change or ID drift');
if (!isDeepStrictEqual(result.normalized.people, normalizedBefore.people)) throw Error('Unreviewed person metadata change');
if (result.normalized.translationRepairs.some(r => r.status !== 'applied')) throw Error('Proposed repair remains');
const output = {status:'research-only-not-approved', stagingImplementation:'b9128a4fd65148e0b87f3e2bc9e1fdfee4279be9',
  inputByteHashes:{source:'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800', extraction:'91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8', history:'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2', dossier:'758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367', decisions:'9a8ae3bffb3bd13e75e3aae86b2130f59e894e2ee142f4aa9a245eb6fb016f80'},
  checks:['exact prior evidence reversal','exact dossier proposal reversal','independent editorial decisions validated','production translation applier','source edits reversed exactly','all normalized claims match expected reviewed revision','person metadata unchanged','strict compact extraction validation','merged retained editorial history validation'],
  warning:'Candidate only. Needs independent exact final-candidate source/evidence review, full independent date audit, identity resolution, safe ownership and publication; all old approvals may be stale.', source:sourceAfter, extraction:extractionAfter, editorial:historyAfter, stats:result.stats};
const bytes = Buffer.from(`${JSON.stringify(output, null, 2)}\n`);
const out = join(root, 'research/people/jinshu129-final-materialized-20261020-incomplete.json');
writeFileSync(out, bytes, {flag:'wx', mode:0o600});
console.log(`Research candidate only: ${out}; sha256 ${sha(bytes)}`);
