import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { expandPeopleExtraction, compactPeopleExtraction, serializeCompactPeopleExtraction } from '../../../../../../scripts/lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';
import { buildDateAuditPacket } from '../../../../../../scripts/lib/people-date-audit.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const sourceFile = 'data/jinshu/022.json';
const inputFile = `${dir}candidate-4.json`;
const codeFile = 'scripts/remove-false-people.mjs';
const digest = value => createHash('sha256').update(value).digest('hex');
const read = file => readFileSync(file);
const source = read(sourceFile);
const input = read(inputFile);
if (digest(source) !== '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38' ||
    digest(input) !== '6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419') {
  throw new Error('Pinned source or retained candidate changed');
}
const compact = JSON.parse(input);
const originalPacket = buildDateAuditPacket('jinshu', '022', {extraction: compact});
if (originalPacket.sourceHash !== 'sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2' ||
    originalPacket.extractionHash !== 'sha256:39c756f0deff06281d9f8ae1d8e2a9e56b38b20bc17cf8771064f802357c9826') {
  throw new Error('Retained date packet fingerprints changed');
}
const packet = buildPeopleExtractionPacket('jinshu', '022');
const expanded = expandPeopleExtraction(compact, packet);

// Execute the repository's exact removal implementation without invoking its
// canonical-path CLI, and without modifying its source or the common index.
const codeBytes = read(codeFile);
let moduleText = codeBytes.toString('utf8');
const mainLine = "const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);";
if (!moduleText.includes(mainLine) || !moduleText.includes('function removePeople(extraction, targets) {')) {
  throw new Error('Removal implementation changed shape');
}
moduleText = moduleText.replace(mainLine, 'const isMain = false;');
moduleText = moduleText.replace(/from '(\.\/[^']+)'/g, (_all, relative) =>
  `from '${pathToFileURL(path.resolve('scripts', relative)).href}'`);
moduleText += '\nexport { removePeople };\n';
const { removePeople } = await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString('base64')}`);
const removed = removePeople(expanded, [{localId:'jinshu:022:p046', reason:'not-a-name'}]);
const revised = compactPeopleExtraction(removed.extraction, packet);
const serialized = serializeCompactPeopleExtraction(revised);
let validation;
try {
  const result = validateCompactPeopleExtraction(revised, packet);
  validation = {status:'passed', stats:result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status:'failed', errors:error.errors};
}
const afterPacket = buildDateAuditPacket('jinshu', '022', {extraction: revised});
const result = {kind:'incomplete-isolated-false-person-preview',
  inputs:{sourceBytesSha256:digest(source), candidateBytesSha256:digest(input), sourceHash:originalPacket.sourceHash,
    extractionHash:originalPacket.extractionHash, removalImplementationSha256:digest(codeBytes)},
  removal:removed.stats, target:'jinshu:022:p046', reason:'not-a-name',
  newDispositions:removed.extraction.candidateDispositions.slice(expanded.candidateDispositions.length),
  candidateBytesSha256:digest(serialized), resultingExtractionHash:afterPacket.extractionHash,
  scopedValidation:validation,
  limitation:'Experimental candidate only. Neither date holds nor translation have been resolved; no source, canonical extraction, resolution, queue, lock, or approval was changed.'};
writeFileSync(`${dir}p046-removal-candidate-incomplete.json`, serialized, {flag:'wx'});
writeFileSync(`${dir}p046-removal-diagnostics-incomplete.json`, JSON.stringify(result,null,2)+'\n', {flag:'wx'});
console.log(JSON.stringify({candidateBytesSha256:result.candidateBytesSha256, removal:result.removal,
  newDispositions:result.newDispositions, validationStatus:validation.status,
  errorCount:validation.errors?.length ?? 0, resultingExtractionHash:result.resultingExtractionHash}));
