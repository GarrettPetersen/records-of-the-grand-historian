// Research-only independent review; writes no canonical or queue files.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions, validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const dir = path.dirname(new URL(import.meta.url).pathname);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function read(name, expected) {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (digest(bytes) !== expected) throw new Error(`Unexpected input hash: ${name}`);
  return JSON.parse(bytes);
}
const source = read('jinshu127-closing-materialized-source-20261019.json', '74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c');
const proposed = read('jinshu127-s0177-proposed-extraction-20261020-incomplete.json', 'cb1f5e1a6f7557c778a360b94a323574e9dc95bcceee4791c5c14c6e4b48c9e0');
const history = read('jinshu127-closing-materialized-history-20261019.json', '7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190');
const seed = read('jinshu127-s0177-blank-decision-seed-20261020-incomplete.json', 'f2b4789f096a31599253426b0567e3017cd387a8762a053bbdf3b88090e931b2');
read('jinshu127-s0177-review-dossier-20261020-incomplete.json', 'aae25f6839d9da3a258a01f1fca50b854afa7ea1822d884d5dcfa62629b360bc');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.resolve('data/jinshu/127.json') });
if (packet.input.chapterFingerprint !== 'sha256:bd9a75d4cc72084b701fb6baf97845edada0fa16160eb37d1ecf7efc5c02c2bd') throw new Error('Source fingerprint mismatch');
const unit = packet.units.find(item => item.id === 's0177');
if (unit?.zh !== '四年，僭即皇帝位於南郊，大赦，改元為建平，設行廟于宮南，遣使奉策告成焉。') throw new Error('Source text mismatch');
const checked = validateCompactPeopleExtraction(proposed, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
seed.reviewer = { kind: 'codex', name: 'Independent Codex reviewer /root/jin127_0177_decision', model: null, agentId: '/root/jin127_0177_decision', runId: null, completedAt: new Date().toISOString() };
const reason = 'Revise to restore the locative 焉, read as the immediately preceding temporary temple; this antecedent is plausible but interpretative. Attribute the evaluative 僭 to the history, not objective fact. Keep the document and reported accomplishment unspecified. The AD conversion in the idiomatic field remains unaudited.';
const sourceWitness = { source: 'chapter-text', citation: 'Jinshu 127, s0177, sealed dossier; cf. Tongdian juan 47, imperial ancestral temple rites', excerpt: unit.zh };
seed.decisions = [
  { repairId: 'jinshu:127:r0017', decision: 'revise', after: 'In the fourth year, at the southern suburb he assumed the imperial throne—an act the history presents as usurpation—issued a general amnesty, changed the era name to Jianping, established a temporary ancestral temple south of the palace, and sent envoys bearing a document to report the accomplishment there.', reason, sourceWitness },
  { repairId: 'jinshu:127:r0018', decision: 'revise', after: "In Long'an 4 (AD 400), at the southern suburb he assumed the imperial throne—an act the history presents as usurpation—issued a general amnesty, adopted the Jianping era name, established a temporary ancestral temple south of the palace, and sent envoys with a document to report the accomplishment there.", reason, sourceWitness },
];
validateEditorialDecisions(seed, checked.normalized, packet);
const bytes = Buffer.from(`${JSON.stringify(seed, null, 2)}\n`);
const output = path.join(dir, 'jinshu127-s0177-independent-decisions-20261020-incomplete.json');
fs.writeFileSync(output, bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ output, sha256: digest(bytes), checks: 'strict extraction, preserved applied history, and fingerprint-bound independent decisions pass in current checkout', dateApproved: false }));
