// Research-only, deterministic replay. Never publishes or approves a chapter.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket } from '../../../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../../../scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const dir = path.dirname(new URL(import.meta.url).pathname);
const previous = path.join(dir, 'jinshu127-expanded-date-work-tRX7ee');
const output = path.join(dir, 'jinshu127-two-chronology-repairs-20261020-incomplete');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {
  source: [path.join(dir, 'jinshu127-s0232-materialized-source-67faa205.json'), '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39'],
  extraction: [path.join(previous, 'candidate-extraction.json'), '59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301'],
};
for (const [name, [file, digest]] of Object.entries(inputs)) {
  if (sha(fs.readFileSync(file)) !== digest) throw new Error(`Changed input: ${name}`);
}
const source = JSON.parse(fs.readFileSync(inputs.source[0]));
const extraction = JSON.parse(fs.readFileSync(inputs.extraction[0]));
const historyFile = path.join(dir, 'jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json');
const history = JSON.parse(fs.readFileSync(historyFile));
const packet = buildDateAuditPacket('jinshu', '127', { dataDir: previous, extraction });
if (packet.sourceHash !== 'sha256:14d01bcccbaa64c7b778a8e554138a9b5e12ff7e00b31cc8f7d4805e342ee019' || packet.extractionHash !== 'sha256:c0ff60c109dab416784e5135583a6227408596249c409192f34367c02890e35b') throw new Error('Unexpected sealed packet');
const item = packet.items.find(x => x.id === 'claim-335');
if (item?.personId !== 'p141' || item.claimIndex !== 334 || item.claimHash !== 'sha256:f16bc8d9d799d7af1abc9a04c2d6233a9f91ae401bc329cabfe064279dd43619') throw new Error('Unexpected compact claim identity');
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes: [
  { kind: 'replace', id: item.id, before: structuredClone(extraction.claims[item.claimIndex]), after: ['p141', 'attestation', { undatedSourceAttestation: true, event: "Han Gaozu sacrificed at Lord Xinling's tomb." }, 'explicit', ['s0232']], reason: 'Jinshu s0232 recounts this sacrifice but gives no date; Shiji 77 distinguishes repeated sacrifices from a separately dated provision for tomb keepers.' },
  { kind: 'hints', personId: 'p142', before: ['BC 275-243'], after: [], reason: 'Jinshu s0232 gives no years; Tongjian 4 places Lord Xinling’s investiture in 276 BC, earlier than the retained range, without establishing a whole-career interval.' },
] };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const chapterFile = path.join(previous, 'jinshu/127.json');
if (sha(fs.readFileSync(chapterFile)) !== inputs.source[1]) throw new Error('Date-packet source bytes differ');
const extractionPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile });
const validation = validateCompactPeopleExtraction(candidate, extractionPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, validation.normalized);
const candidatePacket = buildDateAuditPacket('jinshu', '127', { dataDir: previous, extraction: candidate });
const outputs = { 'proposal.json': proposal, 'candidate-extraction.json': candidate, 'candidate-date-packet.json': candidatePacket, 'pre-repair-packet.json': packet };
fs.mkdirSync(output);
for (const [name, value] of Object.entries(outputs)) fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
const receipt = { status: 'research-only-unreviewed-incomplete', inputs: Object.fromEntries(Object.entries(inputs).map(([k, [p, digest]]) => [k, { path: p, sha256: digest }])), history: { path: historyFile, sha256: sha(fs.readFileSync(historyFile)) }, preRepairPacket: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash }, candidatePacket: { sourceHash: candidatePacket.sourceHash, extractionHash: candidatePacket.extractionHash }, outputs: Object.fromEntries(Object.keys(outputs).map(name => [name, sha(fs.readFileSync(path.join(output, name)))])), validator: 'Current checkout strict compact extraction and applied editorial history; research only', note: 'Independent focused review and complete fresh date audit required. Source/editorial materialization and previous seven-change candidate are not canonical. Gaozu activity hint and all other chronology remain unapproved.' };
fs.writeFileSync(path.join(output, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ output, candidatePacket: receipt.candidatePacket, stats: validation.stats }));
