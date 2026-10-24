import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../../../scripts/lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const input = dir + 'five-kinds-composed-candidate-20261020-incomplete.json';
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
if (sha(input) !== 'f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4' || sha('data/jinshu/022.json') !== '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38') throw new Error('Pinned evidence changed');
const candidate = JSON.parse(readFileSync(input));
const expected = ['p051','sex',{sex:'male'},'strongly-inferred',['s0219']];
if (!isDeepStrictEqual(candidate.claims[331], expected)) throw new Error('Unexpected claim');
candidate.claims.splice(331, 1);
const packet = buildDateAuditPacket('jinshu', '022', {extraction: candidate});
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket('jinshu', '022'));
  validation = {status:'passed', stats:result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status:'failed', errors:error.errors};
}
const diagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
const output = dir + 'taishang-sex-removal-candidate-20261020-incomplete.json';
const report = dir + 'taishang-sex-removal-diagnostics-20261020-incomplete.json';
writeFileSync(output, JSON.stringify(candidate, null, 2) + '\n', {flag:'wx'});
writeFileSync(report, JSON.stringify({status:'incomplete preview, not an approval', input, inputSha256:sha(input), candidate:output, candidateSha256:sha(output), semanticFingerprint:packet.extractionHash, removed:expected, validation, dateDiagnostics:diagnostics, limitations:['Removing the unsupported sex claim does not establish the referent as human, collective or divine; identity and invalid event kind remain held.', 'No dates, source translations, other claims, or candidate dispositions were changed. Reviewer independence and all downstream gates remain required.']}, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify({output, sha256:sha(output), fingerprint:packet.extractionHash, validation:validation.status, errors:validation.errors?.length ?? 0, dateDiagnostics:diagnostics.length}));
