// Research preview only. Never writes canonical files, approvals, or claims.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dir = path.join(root, 'data/people/generated/date-workflow/jinshu/108');
const moduleAt = async (name) => import(pathToFileURL(path.join(root, name)).href);
const { buildPeopleExtractionPacket } = await moduleAt('scripts/build-people-extraction-packet.mjs');
const { buildCompactInput } = await moduleAt('scripts/lib/people-compact.mjs');
const { loadProperNounMatcher } = await moduleAt('scripts/lib/people-candidates.mjs');
const { validateCompactPeopleExtraction } = await moduleAt('scripts/validate-people-extraction.mjs');
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
function readPinned(file, expected) {
  const bytes = fs.readFileSync(file);
  if (digest(bytes) !== expected) throw new Error(`Input changed: ${file}`);
  return JSON.parse(bytes);
}
function writeNew(name, value) {
  const target = path.join(dir, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
}
const original = readPinned(path.join(root, 'data/jinshu/108.json'), '8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb');
const source = readPinned(path.join(dir, 's0090-source-preview-20261019-incomplete.json'), '244366caf41ad98a45cec3005ee5b29c077eb19b2be1dc90137d9ea3f60935ce');
const candidate = readPinned(path.join(dir, 'candidate-2.json'), 'c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413');
const unit = (obj) => obj.content.flatMap((block) => block.sentences ?? []).find((entry) => entry.id === 's0090');
const tr = unit(source)?.translations?.find((entry) => entry.lang === 'en');
const expectedNote = 'The Chinese text here names Hui (廆). A version labelled as the Siku Quanshu text reads Tao (燾), which fits the surrounding account in which Hui confronts Tao.';
if (!tr || tr.footnote !== expectedNote || unit(source).zh !== '廆懼，首服。') throw new Error('Unexpected source preview');
tr.footnote = 'The Chinese text here names Hui (廆). A Siku-labelled digital transcription reads Tao (燾), which fits the surrounding account in which Hui confronts Tao.';
const matcher = loadProperNounMatcher();
const beforePacket = buildPeopleExtractionPacket('jinshu', '108', { chapterData: original, properNounMatcher: matcher });
const packet = buildPeopleExtractionPacket('jinshu', '108', { chapterData: source, properNounMatcher: matcher });
if (JSON.stringify(candidate.input) !== JSON.stringify(buildCompactInput(beforePacket))) throw new Error('Retained candidate does not match original source');
const oldRows = candidate.surfaces.filter((row) => row[0] === 'p050' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'Tao');
if (oldRows.length !== 1 || JSON.stringify(oldRows[0][4]) !== JSON.stringify([['s0090', [0]]])) throw new Error('Unexpected Tao surface');
candidate.surfaces.splice(candidate.surfaces.indexOf(oldRows[0]), 1);
const dispositions = candidate.candidateDispositions.filter((row) => row[0] === 'duplicate-hint' && row[1] === 'duplicate-candidate' && row[2].some((entry) => entry[0] === 'cand_82b7f03d9b1db47f'));
if (dispositions.length !== 1) throw new Error('Unexpected Tao candidate disposition');
dispositions[0][2] = dispositions[0][2].filter((entry) => entry[0] !== 'cand_82b7f03d9b1db47f');
const huiRows = candidate.surfaces.filter((row) => row[0] === 'p001' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'Hui');
if (huiRows.length !== 1 || huiRows[0][4].some((row) => row[0] === 's0090')) throw new Error('Unexpected Hui surface');
const index = huiRows[0][4].findIndex((row) => row[0] > 's0090');
if (index < 0) throw new Error('Unexpected Hui unit ordering');
huiRows[0][4].splice(index, 0, ['s0090', [0]]);
candidate.input = buildCompactInput(packet);
let validation;
try {
  validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
  validation = { passed: true, error: null };
} catch (error) {
  validation = { passed: false, error: String(error.stack ?? error) };
}
writeNew('s0090-refined-source-v2-20261019-incomplete.json', source);
writeNew('s0090-link-candidate-v2-20261019-incomplete.json', candidate);
writeNew('s0090-link-diagnostics-v2-20261019-incomplete.json', {
  status: 'incomplete-research-preview-not-approved', validation,
  originalFingerprint: beforePacket.input.chapterFingerprint,
  previewFingerprint: packet.input.chapterFingerprint,
  warning: 'No editorial repair history was created or approved. Fresh independent identity/date review, repair evidence and supported footnote publication are required.',
});
console.log(JSON.stringify({ validation, originalFingerprint: beforePacket.input.chapterFingerprint, previewFingerprint: packet.input.chapterFingerprint }, null, 2));
