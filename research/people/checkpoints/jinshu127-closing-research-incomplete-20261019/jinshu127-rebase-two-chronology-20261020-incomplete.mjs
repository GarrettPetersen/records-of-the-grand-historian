// Research-only rebase onto independently reviewed closing materialization.
// This does not approve, publish, or alter canonical chapter data.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket } from '../../../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../../../scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(dir, 'jinshu127-rebased-two-chronology-20261020-incomplete');
const hashes = {
  'jinshu127-s0232-materialized-source-67faa205.json': '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39',
  'jinshu127-expanded-date-work-tRX7ee/candidate-extraction.json': '59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301',
  'jinshu127-two-chronology-repairs-20261020-incomplete/proposal.json': '88e8dae6332d2cbfc366afa4e0f3a5765b908943a14272e9adb7c8091f866e92',
  'jinshu127-two-chronology-repairs-20261020-incomplete/candidate-extraction.json': '912aba0388bb765569cc2586a65097e60b5354a8ac52044bd00431adf83b4c0d',
  'jinshu127-closing-materialized-source-20261019.json': '74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c',
  'jinshu127-closing-materialized-extraction-20261019.json': '1516f2bba52ebd08956e35da39e0387e926c8cbac9b99398c185c7cb6ebb8529',
  'jinshu127-closing-materialized-history-20261019.json': '7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190',
  'jinshu127-closing-independent-decisions-20261019.json': '2ceb79ff3abeabc2d67fd7f5b79f118009b4ddcb817e267439e7feea5f775c2e',
};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name)));
for (const [name, expected] of Object.entries(hashes)) if (sha(fs.readFileSync(path.join(dir, name))) !== expected) throw new Error(`Input changed: ${name}`);
const oldSource = read('jinshu127-s0232-materialized-source-67faa205.json');
const source = read('jinshu127-closing-materialized-source-20261019.json');
const original = read('jinshu127-closing-materialized-extraction-20261019.json');
const oldExtraction = read('jinshu127-expanded-date-work-tRX7ee/candidate-extraction.json');
const oldProposal = read('jinshu127-two-chronology-repairs-20261020-incomplete/proposal.json');
const oldCandidate = read('jinshu127-two-chronology-repairs-20261020-incomplete/candidate-extraction.json');
const history = read('jinshu127-closing-materialized-history-20261019.json');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Pin the source lineage: three exact English fields only; s0232 is untouched.
const differences = [];
function diff(a, b, at = '') {
  if (equal(a, b)) return;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[key], b[key], `${at}/${key}`);
  } else differences.push(at);
}
diff(oldSource, source);
const expectedPaths = ['/content/21/sentences/5/translations/0/idiomatic', '/content/21/sentences/7/translations/0/literal', '/content/21/sentences/7/translations/0/idiomatic'];
if (!equal(differences, expectedPaths)) throw new Error(`Unexpected source lineage: ${differences}`);
const priorChange = oldProposal.changes.find(x => x.kind === 'replace');
const hintChange = oldProposal.changes.find(x => x.kind === 'hints');
if (oldProposal.changes.length !== 2 || !priorChange || hintChange?.personId !== 'p142') throw new Error('Unexpected reviewed proposal');
// Prove that the prior reviewed output has exactly the two specified changes.
const reconstructedOld = structuredClone(oldExtraction);
const oldRows = reconstructedOld.claims.map((v, i) => equal(v, priorChange.before) ? i : -1).filter(i => i >= 0);
if (oldRows.length !== 1) throw new Error('Earlier claim row not unique');
reconstructedOld.claims[oldRows[0]] = structuredClone(priorChange.after);
const oldPerson = reconstructedOld.people.find(p => p[0] === 'p142');
if (!oldPerson || !equal(oldPerson[4].a, hintChange.before)) throw new Error('Earlier hint mismatch');
oldPerson[4].a = structuredClone(hintChange.after);
if (!equal(reconstructedOld, oldCandidate)) throw new Error('Earlier candidate has unexplained delta');
// Preserve the reviewed reception record and verify the old/new claim content.
const reception = oldExtraction.claims.filter(c => c[0] === 'p142' && c[1] === 'event-participation');
if (reception.length !== 1 || original.claims.filter(c => equal(c, reception[0])).length !== 1) throw new Error('Retrospective event changed');
const matches = original.claims.map((v, i) => equal(v, priorChange.before) ? i : -1).filter(i => i >= 0);
if (matches.length !== 1) throw new Error('Target claim not unique in closing extraction');
const targetPerson = original.people.find(p => p[0] === 'p142');
if (!targetPerson || !equal(targetPerson[4].a, hintChange.before)) throw new Error('Target hint changed');
// Source copy is a single chapter within the ignored isolated artifact directory.
fs.mkdirSync(output);
fs.mkdirSync(path.join(output, 'jinshu'));
const chapterFile = path.join(output, 'jinshu/127.json');
fs.copyFileSync(path.join(dir, 'jinshu127-closing-materialized-source-20261019.json'), chapterFile, fs.constants.COPYFILE_EXCL);
const packet = buildDateAuditPacket('jinshu', '127', { dataDir: output, extraction: original });
const items = packet.items.filter(x => x.claimIndex === matches[0] && x.personId === 'p141' && equal(x.value, priorChange.before[2]));
if (items.length !== 1 || items[0].claimHash !== 'sha256:f16bc8d9d799d7af1abc9a04c2d6233a9f91ae401bc329cabfe064279dd43619') throw new Error('Fresh packet claim mismatch');
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes: [{ ...priorChange, id: items[0].id }, structuredClone(hintChange)] };
const candidate = applyDateRepairProposal(original, proposal, packet);
const expected = structuredClone(original);
expected.claims[matches[0]] = structuredClone(priorChange.after);
expected.people.find(p => p[0] === 'p142')[4].a = structuredClone(hintChange.after);
if (!equal(expected, candidate)) throw new Error('Unexpected change beyond two reviewed edits');
const extractionPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile });
const validation = validateCompactPeopleExtraction(candidate, extractionPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, validation.normalized);
const candidatePacket = buildDateAuditPacket('jinshu', '127', { dataDir: output, extraction: candidate });
const outputs = { 'proposal.json': proposal, 'pre-repair-packet.json': packet, 'candidate-extraction.json': candidate, 'candidate-date-packet.json': candidatePacket };
for (const [name, value] of Object.entries(outputs)) fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
const receipt = { status: 'research-only-rebase-unreviewed-incomplete', inputSha256: hashes, sourceChanges: differences, matchedClaim: { id: items[0].id, index: matches[0], claimHash: items[0].claimHash }, preRepairPacket: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash }, candidatePacket: { sourceHash: candidatePacket.sourceHash, extractionHash: candidatePacket.extractionHash }, outputSha256: Object.fromEntries(Object.keys(outputs).map(name => [name, sha(fs.readFileSync(path.join(output, name)))])), stats: validation.stats, limitations: ['Independent source and delta review is required for this new materialization.', 'Full fresh independent date audit, unresolved p141 activity-hint provenance, identity and publication gates remain open.', 'Prior reviewed research is not canonical and prior approvals cannot be rebound to changed fingerprints.'] };
fs.writeFileSync(path.join(output, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ output, preRepairPacket: receipt.preRepairPacket, candidatePacket: receipt.candidatePacket, matchedClaim: receipt.matchedClaim, stats: validation.stats }));
