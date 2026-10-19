import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../../../scripts/lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const pins = new Map([
  ['data/jinshu/022.json', '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38'],
  [dir + 'cumulative-ritual-hymn-candidate-20261020-incomplete.json', '01d03455ea8ebadd823b7edbc63eccae5bd24150995efa4d809767a2aabdcfe3'],
  [dir + 'xuan-wen-reception-candidate-20261020-incomplete.json', '3ce2f2888c1b86a29c22d3d92ed8853e9987ff42756851de04d2cc0cc3ecb695'],
  [dir + 'two-hymns-reception-proposal-20261020-incomplete.json', 'c6384c840ff44bbcef6622aa77d52cb8a594b7c594ed016bdd5e3f2101e22ed8'],
  [dir + 'three-hymn-receptions-proposal-20261020-incomplete.json', 'e5ef0048cf632a6e3bc4715357f04b4a9ad09f30752a351f45024e57298b16bb'],
]);
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, expected] of pins) if (sha(file) !== expected) throw new Error(`Input changed: ${file}`);
const read = file => JSON.parse(readFileSync(file));
const base = read(dir + 'cumulative-ritual-hymn-candidate-20261020-incomplete.json');
const xuanWen = read(dir + 'xuan-wen-reception-candidate-20261020-incomplete.json');
const recomputed = structuredClone(base);
for (const index of [915, 916]) {
  if (recomputed.claims[index][2].kind !== 'posthumous-reference' || recomputed.claims[index][2].receptionType !== 'posthumous') throw new Error(`Unexpected Xuan–Wen claim ${index}`);
  recomputed.claims[index][2].kind = 'retrospective-reference';
  recomputed.claims[index][2].receptionType = 'retrospective';
}
if (!isDeepStrictEqual(recomputed, xuanWen)) throw new Error('Xuan–Wen candidate includes unexpected changes');
const groups = [
  read(dir + 'two-hymns-reception-proposal-20261020-incomplete.json').changes.map(c => ({ index: c.zeroBasedIndex, before: c.before, after: c.after })),
  read(dir + 'three-hymn-receptions-proposal-20261020-incomplete.json').changes,
];
const candidate = structuredClone(xuanWen);
const changes = groups.flat();
if (!isDeepStrictEqual(changes.map(c => c.index), [438, 444, 627, 637, 647])) throw new Error('Unexpected change indexes');
for (const {index, before, after} of changes) {
  if (!isDeepStrictEqual(candidate.claims[index], before)) throw new Error(`Before row mismatch: ${index}`);
  const expected = structuredClone(before);
  expected[2].receptionType = 'retrospective';
  if (expected[1] === 'event-participation') expected[2].kind = 'retrospective-reference';
  if (!isDeepStrictEqual(expected, after)) throw new Error(`Unexpected change: ${index}`);
  candidate.claims[index] = structuredClone(after);
}
const packet = buildDateAuditPacket('jinshu', '022', { extraction: candidate });
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket('jinshu', '022'));
  validation = { status: 'passed', stats: result.stats };
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = { status: 'failed', errors: error.errors };
}
const dateDiagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
const output = dir + 'seven-receptions-composed-candidate-20261020-incomplete.json';
const report = dir + 'seven-receptions-composed-diagnostics-20261020-incomplete.json';
writeFileSync(output, JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx' });
writeFileSync(report, JSON.stringify({ status: 'incomplete; no editorial, date, identity or publication approval', inputs: Object.fromEntries(pins), candidate: output, candidateSha256: sha(output), candidateSemanticFingerprint: packet.extractionHash, changes, xuanWenIndexes: [915, 916], validation, dateDiagnostics, limitations: ['The changes preserve every date and all other evidence; existing dates and claims remain unapproved.', 'Xuan–Wen AD 266, joint attribution and identities require independent scrutiny; the hymn evidence does not prove the precise lyric date.', 'P046, translation, identities, unresolved categorical labels and review-4 disagreements remain open. Schema success is not source, date or publication approval.', 'Independent complete fresh audit and all identity, editorial and publication gates remain required.'] }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, sha256: sha(output), fingerprint: packet.extractionHash, report, validation: validation.status, errors: validation.errors?.length ?? 0, dateDiagnostics: dateDiagnostics.length }));
