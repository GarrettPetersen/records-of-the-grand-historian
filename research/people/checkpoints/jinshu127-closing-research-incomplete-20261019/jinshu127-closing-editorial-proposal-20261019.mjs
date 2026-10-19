// Isolated proposal and dossier only: never writes source, review decisions, or queue state.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const fixture = '/tmp/jinshu053-strict-5ce.NuGR9k1r';
const base = '4b9022c6fb104404f6e12c91c1e1081a93a5ae1d';
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024 }).toString('utf8').trim();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readPinned = (name, expected) => {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (sha(bytes) !== expected) throw new Error(`Unexpected input: ${name}`);
  return JSON.parse(bytes);
};
const fixtureFiles = ['scripts/build-people-extraction-packet.mjs', 'scripts/validate-people-extraction.mjs',
  'scripts/lib/people-editorial-decisions.mjs', 'scripts/build-people-editorial-review.mjs', 'scripts/lib/people-compact.mjs'];
for (const file of fixtureFiles) {
  if (git('rev-parse', `${base}:${file}`) !== git('hash-object', path.join(fixture, file))) throw new Error(`Fixture mismatch: ${file}`);
}
const source = readPinned('jinshu127-s0232-materialized-source-67faa205.json', '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39');
const prior = readPinned('jinshu127-s0173-conservative-v5-candidate-20261019.json', '44f98126487a079ee1776a9b76eb5f6ebfd04427ef731b38b3c6096b44e79a99');
const history = readPinned('jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json', '002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(root, 'data/jinshu/127.json') });
const units = Object.fromEntries(packet.units.map(unit => [unit.id, unit]));
const proposals = [
  ['s0277', 'idiomatic', 'They ran decoy coffers out each gate and hid his true burial in the hills.',
    'That night they prepared more than ten coffins and sent them out through the four gates, burying him secretly in the mountain valleys; in the end, no one knew where his body lay.',
    '棺 means coffins, not coffers; preserve the number, nocturnal setting and uncertain location. The text does not explicitly identify any particular coffin as a decoy.'],
  ['s0279', 'literal', 'He was posthumously titled Emperor Xianwu.',
    'He was given the posthumous title Emperor Xianwu, which the Jin historian regarded as illegitimate.',
    '偽諡 marks a posthumous title as illegitimate from the historiographer’s perspective; this formulation needs independent contextual and stylistic review.'],
  ['s0279', 'idiomatic', 'His temple posthumous title was Emperor Xianwu.',
    'He was given the posthumous title Emperor Xianwu, which the Jin historian regarded as illegitimate.',
    '諡 is a posthumous title, not a temple name; 偽 expresses the historiographer’s delegitimizing judgment. Independently review its appropriate English rendering.'],
];
if (units.s0277?.zh !== '乃夜為十餘棺，分出四門，潛葬山谷，竟不知其屍之所在。' || units.s0279?.zh !== '偽諡獻武皇帝。') throw new Error('Unexpected Chinese source');
for (const [unit, field, before] of proposals) {
  if ((field === 'literal' ? units[unit].literal : units[unit].en) !== before) throw new Error(`Unexpected translation ${unit}/${field}`);
  if (prior.translationRepairs.some(row => row[0] === unit && row[1] === field)) throw new Error(`Already reviewed ${unit}/${field}`);
}
const before = validateCompactPeopleExtraction(prior, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, before.normalized);
const candidate = structuredClone(prior);
candidate.translationRepairs.push(...proposals.map(row => [...row, 'high', 'proposed']));
const unchanged = structuredClone(candidate);
unchanged.translationRepairs.splice(-proposals.length);
if (!isDeepStrictEqual(unchanged, prior)) throw new Error('Unexpected unrelated change');
const checked = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '127', packet, extraction: checked.normalized }, { context: 2 });
if (dossier.items.length !== 3 || dossier.items.some(item => !['s0277', 's0279'].includes(item.proposal.unit.id))) throw new Error('Unexpected dossier scope');
const json = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
const output = {
  'jinshu127-closing-proposed-extraction-20261019.json': json(candidate),
  'jinshu127-closing-review-dossier-20261019.json': json(dossier),
  'jinshu127-closing-blank-decision-seed-20261019.json': json(dossier.decisionSeed),
};
output['jinshu127-closing-proposal-receipt-20261019.json'] = json({ schemaVersion: 1, base, status: 'proposal-only-not-approved',
  input: { source: '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39', extraction: '44f98126487a079ee1776a9b76eb5f6ebfd04427ef731b38b3c6096b44e79a99', history: '002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5' },
  output: Object.fromEntries(Object.entries(output).map(([name, bytes]) => [name, sha(bytes)])),
  checks: { priorAppliedRepairsPreserved: 13, proposedRepairs: 3, fixtureFilesMatchStaging: fixtureFiles, strictAliasDispositions: true, appliedEditorialHistoryValidator: true },
  warnings: ['Seed decisions are placeholders, not reviewer decisions.', 'Date, identity, earlier editorial provenance and publication gates remain open.', 'Checks compare selected fixture files to the staging revision, not every transitive dependency.'] });
for (const name of Object.keys(output)) if (fs.existsSync(path.join(dir, name))) throw new Error(`Refusing to overwrite ${name}`);
for (const [name, bytes] of Object.entries(output)) fs.writeFileSync(path.join(dir, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ status: 'proposal-only-not-approved', output: Object.fromEntries(Object.entries(output).map(([name, bytes]) => [name, sha(bytes)])), stats: checked.stats }, null, 2));
