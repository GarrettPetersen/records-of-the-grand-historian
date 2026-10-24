import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../../../scripts/lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const pins = new Map([
  ['data/jinshu/022.json', '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38'],
  [dir + 'seven-receptions-composed-candidate-20261020-incomplete.json', '6f664654b5c0a8758dc467f5c94a41a0e042e178f4aa719c6fb79c5dc6466068'],
  [dir + 'xuan-wen-primary-and-taishang-proposal-20261020-incomplete.json', '268a3fa2ca5bc402e428c577f5fefa134111e0765568c0c68b227be2903562b4'],
  [dir + 'jingzhao-retrospective-proposal-20261020-incomplete.json', '55bac694213b4f36f6b9fb98322d274770def36387b501785e02826a929216ae'],
  [dir + 'two-ancestor-receptions-proposal-20261020-incomplete.json', 'da86cea62bc9aebe6aed0238650fb2dfccefede6283d4436580d5c585b7cf5ea'],
]);
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, expected] of pins) if (sha(file) !== expected) throw new Error(`Input changed: ${file}`);
const read = file => JSON.parse(readFileSync(file));
const candidate = read(dir + 'seven-receptions-composed-candidate-20261020-incomplete.json');
const changes = [
  ...read(dir + 'xuan-wen-primary-and-taishang-proposal-20261020-incomplete.json').changes,
  ...read(dir + 'jingzhao-retrospective-proposal-20261020-incomplete.json').changes.map(c => ({index: c.zeroBasedIndex, before: c.before, after: c.after})),
  ...read(dir + 'two-ancestor-receptions-proposal-20261020-incomplete.json').changes,
];
if (!isDeepStrictEqual(changes.map(c => c.index), [303, 304, 369, 571, 590])) throw new Error('Unexpected indexes');
for (const {index, before, after} of changes) {
  if (!isDeepStrictEqual(candidate.claims[index], before)) throw new Error(`Before row mismatch: ${index}`);
  const expected = structuredClone(before);
  if (expected[1] !== 'event-participation' || expected[2].kind !== 'posthumous-commemoration') throw new Error(`Unexpected kind: ${index}`);
  expected[2].kind = 'retrospective-reference';
  if (!isDeepStrictEqual(expected, after)) throw new Error(`Unexpected change: ${index}`);
  candidate.claims[index] = structuredClone(after);
}
const packet = buildDateAuditPacket('jinshu', '022', {extraction: candidate});
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket('jinshu', '022'));
  validation = {status: 'passed', stats: result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status: 'failed', errors: error.errors};
}
const dateDiagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
const output = dir + 'five-kinds-composed-candidate-20261020-incomplete.json';
const report = dir + 'five-kinds-composed-diagnostics-20261020-incomplete.json';
writeFileSync(output, JSON.stringify(candidate, null, 2) + '\n', {flag: 'wx'});
writeFileSync(report, JSON.stringify({status: 'incomplete; no date, identity, editorial or publication approval', inputs: Object.fromEntries(pins), candidate: output, candidateSha256: sha(output), candidateSemanticFingerprint: packet.extractionHash, changes, validation, dateDiagnostics, limitations: ['All dates, person links and evidence are retained unapproved, including the AD 266 commission versus performance distinction.', 'P051, p056 and p057 are held for unresolved person status; avoid superficial category conversion.', 'False person p046, translation issues, all original candidate holds, and review-4 disagreements remain open. This preview must not be published.', 'Independent complete fresh audit and all identity, editorial and publication gates remain required.']}, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({output, sha256: sha(output), fingerprint: packet.extractionHash, report, validation: validation.status, errors: validation.errors?.length ?? 0, dateDiagnostics: dateDiagnostics.length}));
