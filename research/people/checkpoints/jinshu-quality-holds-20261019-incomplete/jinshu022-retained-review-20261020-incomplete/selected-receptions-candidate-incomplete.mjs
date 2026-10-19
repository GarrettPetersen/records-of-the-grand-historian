import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {reconcileRetrospectiveExtraction} from '../../../../../../scripts/lib/people-reception-reconciliation.mjs';
import {buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems} from '../../../../../../scripts/lib/people-date-audit.mjs';
import {buildPeopleExtractionPacket} from '../../../../../../scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const sourceFile = 'data/jinshu/022.json';
const inputFile = `${dir}candidate-4.json`;
const previewFile = `${dir}retrospective-preview-source-context-incomplete.json`;
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, expected] of [[sourceFile,'813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38'], [inputFile,'6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419'], [previewFile,'1c64581a1f4337d4b82a6eb0aaedeb93dbc997a3e3e09f1f8aaceb224997473d']]) {
  if (sha(file) !== expected) throw new Error(`Input changed: ${file}`);
}
const input = JSON.parse(readFileSync(inputFile));
const preview = JSON.parse(readFileSync(previewFile));
const {changes} = reconcileRetrospectiveExtraction(input);
const reviewedRows = [3,9,11,13,15,17,23,25,26,27,29,31,33];
const candidate = structuredClone(input);
const selected = [];
for (const oneBased of reviewedRows) {
  const reviewed = preview.rows[oneBased - 1];
  const change = changes.find(value => value.id === reviewed.id);
  if (!change || JSON.stringify(change.before) !== JSON.stringify(reviewed.before) || JSON.stringify(change.after) !== JSON.stringify(reviewed.after)) throw new Error(`Preview mismatch at row ${oneBased}`);
  const index = Number(change.id.slice('claim-'.length)) - 1;
  if (JSON.stringify(candidate.claims[index]) !== JSON.stringify(change.before)) throw new Error(`Claim mismatch ${change.id}`);
  candidate.claims[index] = change.after;
  selected.push({row: oneBased, ...change});
}
const packet = buildDateAuditPacket('jinshu','022',{extraction:candidate});
const diagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate,buildPeopleExtractionPacket('jinshu','022'));
  validation = {status:'passed',stats:result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status:'failed',errors:error.errors};
}
const candidateFile = `${dir}selected-receptions-candidate-incomplete.json`;
const reportFile = `${dir}selected-receptions-diagnostics-incomplete.json`;
writeFileSync(candidateFile, JSON.stringify(candidate,null,2)+'\n', {flag:'wx'});
writeFileSync(reportFile, JSON.stringify({status:'incomplete; not an audit or publication approval', sourceFile, sourceSha256:sha(sourceFile), inputFile, inputSha256:sha(inputFile), candidateFile, candidateSha256:sha(candidateFile), candidateSemanticFingerprint:packet.extractionHash, selected, validation, dateDiagnostics:diagnostics},null,2)+'\n', {flag:'wx'});
console.log(JSON.stringify({candidateFile,reportFile,selected: selected.length,validation:validation.status,validationErrors:validation.errors?.length??0,dateDiagnostics:diagnostics.length}));
