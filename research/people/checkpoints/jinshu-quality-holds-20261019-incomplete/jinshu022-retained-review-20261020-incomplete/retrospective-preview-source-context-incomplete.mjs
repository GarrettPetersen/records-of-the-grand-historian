import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { reconcileRetrospectiveExtraction } from '../../../../../../scripts/lib/people-reception-reconciliation.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../../../scripts/lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const sourceFile = 'data/jinshu/022.json';
const candidateFile = `${dir}candidate-4.json`;
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
if (digest(sourceFile) !== '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38' ||
    digest(candidateFile) !== '6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419') throw new Error('Sealed input bytes have changed');
const extraction = JSON.parse(readFileSync(candidateFile, 'utf8'));
const originalPacket = buildDateAuditPacket('jinshu', '022', { extraction });
if (originalPacket.sourceHash !== 'sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2' || originalPacket.extractionHash !== 'sha256:39c756f0deff06281d9f8ae1d8e2a9e56b38b20bc17cf8771064f802357c9826') throw new Error('Semantic fingerprints changed');
const { candidate, changes } = reconcileRetrospectiveExtraction(extraction);
if (changes.length !== 41) throw new Error(`Expected 41 changed rows, found ${changes.length}`);
const source = JSON.parse(readFileSync(sourceFile, 'utf8'));
const units = source.content.flatMap(section => section.sentences ?? []);
const byId = new Map(units.map((unit, index) => [unit.id, index]));
const rows = changes.map(change => {
  const person = extraction.people.find(value => value[0] === change.before[0]);
  const contexts = change.before[4].map(id => {
    const index = byId.get(id);
    if (index === undefined) throw new Error(`Missing source unit ${id}`);
    return { evidenceUnit: id, units: units.slice(Math.max(0, index - 1), index + 2).map(unit => ({id: unit.id, zh: unit.zh, translations: unit.translations})) };
  });
  return { ...change, person: person ? { id: person[0], preferredName: person[1] } : null, contexts };
});
const diagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
let validation;
try {
  const valid = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket('jinshu', '022'));
  validation = { status: 'passed', stats: valid.stats };
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = { status: 'failed', errors: error.errors };
}
const resultPacket = buildDateAuditPacket('jinshu', '022', { extraction: candidate });
const files = ['scripts/lib/people-reception-reconciliation.mjs', 'scripts/lib/people-date-audit.mjs', 'scripts/validate-people-extraction.mjs', 'scripts/lib/people-schema.mjs', 'data/people/schema/compact-extraction.schema.json', 'data/people/schema/extraction.schema.json'];
const available = files.map(file => {
  try { return {file, sha256: digest(file)}; } catch (error) { if (error.code === 'ENOENT') return {file, missing: true}; throw error; }
});
const preview = { kind: 'incomplete-mechanical-preview-not-historical-review', nodeVersion: process.version,
  inputs: {sourceFile, sourceBytesSha256: digest(sourceFile), candidateFile, candidateBytesSha256: digest(candidateFile), sourceHash: originalPacket.sourceHash, extractionHash: originalPacket.extractionHash},
  codeFingerprints: available, previewExtractionHash: resultPacket.extractionHash,
  scopedValidation: validation, dateDiagnostics: diagnostics, rows,
  limitation: 'Each proposed retrospective classification requires independent source review. No changes were applied to sealed or canonical files; schema and diagnostics cannot prove historical correctness.' };
const output = `${dir}retrospective-preview-source-context-incomplete.json`;
writeFileSync(output, `${JSON.stringify(preview, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({output, rows: rows.length, previewExtractionHash: resultPacket.extractionHash, validation, diagnosticsCount: diagnostics.length}));
if (validation.status !== 'passed' || diagnostics.length) process.exitCode = 1;
