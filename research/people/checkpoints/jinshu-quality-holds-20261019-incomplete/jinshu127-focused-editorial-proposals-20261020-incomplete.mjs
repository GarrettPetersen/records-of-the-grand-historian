// Research-only: create a reviewable extraction proposal, never canonical files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '../../../../scripts/build-people-editorial-review.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'jinshu127-focused-editorial-proposals-20261020-incomplete');
const sha = value => createHash('sha256').update(value).digest('hex');
const read = (name, expected) => {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (sha(bytes) !== expected) throw new Error(`Input fingerprint changed: ${name}`);
  return JSON.parse(bytes);
};
const source = read('jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json', 'cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264');
const prior = read('jinshu127-p141-hint-proposal-20261020-incomplete/candidate-extraction.json', '5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8');
const history = read('jinshu127-s0177-two-dates-reconciled-20261020-incomplete/editorial-history.json', '63ce6951e5ddefc83413787448dd900a8ac9eb282fa961392c5f34977e539a41');
const evidencePins = [
  ['jinshu127-s0205-s0213-source-findings-20261020-incomplete.md', 'efddfde4f1bb5146947fec49a3369b3e4e8979a6f2558cb63b0712bc8b4f610c'],
  ['jinshu127-s0205-s0213-independent-source-review-20261020-incomplete.md', '3410fa5e4ee259798fa5bee73c8be36325bfc50e6a44be649dc9a8d9ad83175f'],
  ['jinshu127-s0243-s0279-independent-source-review-20261020-incomplete.md', '1f0fd541af69c3d01686c94a47eed0151fd7ebbabe80b3e0de3b7531919fef1a'],
];
for (const [name, expected] of evidencePins) if (sha(fs.readFileSync(path.join(dir, name))) !== expected) throw new Error(`Evidence fingerprint changed: ${name}`);
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(dir, 'jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json') });
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const priorChecked = validateCompactPeopleExtraction(prior, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, priorChecked.normalized);
const proposals = [];
function add(id, field, zh, before, after, reason) {
  const unit = units.get(id);
  if (!unit || unit.zh !== zh || (field === 'literal' ? unit.literal : unit.en) !== before) throw new Error(`Stale unit or translation: ${id}/${field}`);
  if (prior.translationRepairs.some(row => row[0] === id && row[1] === field)) throw new Error(`Existing repair: ${id}/${field}`);
  proposals.push([id, field, before, after, reason, 'high', 'proposed']);
}
const replaceOnce = (s, a, b) => {
  if (s.split(a).length !== 2) throw new Error(`Replacement must be unique: ${a}`);
  return s.replace(a, b);
};
for (const field of ['literal', 'idiomatic']) {
  const u = units.get('s0205'); const before = field === 'literal' ? u.literal : u.en;
  add(u.id, field, '遂以謨從至漢城陽景王廟，宴庶老于申池，北登社首山，東望鼎足，因目牛山而歎曰：「古無不死！」', before, replaceOnce(before, 'the temple of Prince Jing of Chengyang at Hancheng', 'the temple of Han Prince Jing of Chengyang'), '漢 identifies the Han dynasty, not the place Hancheng. The proposal only changes this phrase; the remainder needs separate review.');
}
add('s0210', 'idiomatic', '立冶于商山，置鹽官于烏常澤，以廣軍國之用。', "He opened ironworks on Mount Shang and salt monopolies at Wuchang Marsh to swell the army's coffers.", 'He established smelting works on Mount Shang and a salt office at Wuchang Marsh to increase resources for the army and the state.', 'The source specifies smelting and a salt administration for military and state use, but not iron, monopolies, or army coffers.');
for (const field of ['literal', 'idiomatic']) {
  const before = field === 'literal' ? 'Palace attendant Xun Jin helped De over the wall and hid him in a forward lodging.' : 'A eunuch helped Murong De over the wall into hiding.';
  add('s0213', field, '中黃門遜進扶德逾城，隱於進舍。', before, "Palace attendant Xun Jin helped De over the wall, and De hid at Jin's residence.", '遜進 is the personal name Xun Jin; 進舍 is his residence. The subject of the second clause is rendered as De, without inventing Xun Jin as the agent of hiding.');
}
for (const field of ['literal', 'idiomatic']) add('s0255', field, '跨地數千，眾逾十萬，可以西並強秦，北抗大魏。', 'Spanning several thousand li, hosts exceeding a hundred thousand, we could west merge with strong Qin and north resist Great Wei.', 'Spanning several thousand li with a host exceeding a hundred thousand, we could annex strong Qin to the west and resist Great Wei to the north.', '西並強秦 describes annexing Qin, not merging with it by agreement.');
add('s0267', 'idiomatic', '於是講武於城西，步兵三十七萬，車一萬七千乘，鐵騎五萬三千，周亙山澤，旌旗彌漫，鉦鼓之聲，振動天地。', 'He staged a review west of the city with hundreds of thousands on parade.', 'He reviewed his forces west of the city: 370,000 infantry, 17,000 vehicles, and 53,000 armored cavalry. They stretched across the mountains and marshes, their banners filled the landscape, and the sound of gongs and drums shook heaven and earth.', 'Restore the reported troop and vehicle figures and visual and sound details; these are the text’s figures, not an independently verified count. Vehicles avoids deciding the exact type of 車.');
for (const field of ['literal', 'idiomatic']) {
  const u = units.get('s0268'); const before = field === 'literal' ? u.literal : u.en;
  add(u.id, field, '德登高望之，顧謂劉軌、高雅之曰：「昔郤克仇齊，子胥怨楚，終能暢其剛烈，名流千載。', before, replaceOnce(before, 'Xi Ke avenged Qi', 'Xi Ke took vengeance on Qi'), '仇齊 makes Qi the object of Xi Ke’s hostility, not the injured party whom he avenged. Other wording remains for separate review.');
}
add('s0272', 'idiomatic', '初，德迎其兄子超于長安，及是而至。', "Murong Chao, whom he had summoned from Chang'an, now arrived.", "Murong Chao, De's nephew whom he had earlier summoned from Chang'an, now arrived.", 'Restore 兄子, his elder brother’s son, without claiming a named father. The related literal translation needs separate review of 迎.');
add('s0275', 'idiomatic', '乃下書以超為皇太子，大赦境內，子為父後者人爵二級。', 'He named Murong Chao crown prince and issued a broad amnesty.', 'He issued an edict naming Murong Chao crown prince and granting a general amnesty throughout the realm; sons succeeding their fathers each received a two-grade increase in rank.', 'Restore the rank-grant provision 子為父後者人爵二級. Its exact scope and phrasing require an independent editorial decision.');
if (proposals.length !== 12 || new Set(proposals.map(r => `${r[0]}/${r[1]}`)).size !== 12) throw new Error('Unexpected proposal scope');
const candidate = structuredClone(prior);
candidate.translationRepairs.push(...proposals);
const restored = structuredClone(candidate); restored.translationRepairs.splice(-proposals.length);
if (!isDeepStrictEqual(restored, prior)) throw new Error('Unexpected unrelated extraction change');
const checked = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '127', packet, extraction: checked.normalized }, { context: 2 });
if (dossier.items.length !== 12) throw new Error(`Unexpected dossier count ${dossier.items.length}`);
const json = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = { 'proposed-extraction.json': json(candidate), 'review-dossier.json': json(dossier), 'blank-decision-seed.json': json(dossier.decisionSeed) };
const receipt = { status: 'research-only-incomplete-no-approval', sourceSha256: 'cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264', extractionSha256: '5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8', editorialHistorySha256: '63ce6951e5ddefc83413787448dd900a8ac9eb282fa961392c5f34977e539a41', evidence: ['jinshu127-s0205-s0213-source-findings-20261020-incomplete.md', 'jinshu127-s0205-s0213-independent-source-review-20261020-incomplete.md', 'jinshu127-s0243-s0279-independent-source-review-20261020-incomplete.md'].map(name => ({ path: name, sha256: sha(fs.readFileSync(path.join(dir, name))) })), outputSha256: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])), checks: { strictAliasDispositions: true, priorAppliedEditorialDecisions: true, proposedRepairs: proposals.length, existingExtractionPreserved: true }, limits: ['Independent review of exact proposed repairs and fingerprints, including wording and paired fields, is required; blank seed is not an approval.', 'No chapter-wide editorial, date or identity approval is implied.', 'p157 false alias and p163 chronology are separate findings not repaired here.', 'Applying any repairs changes fingerprints and requires reconciliation, complete fresh independent date audit, identity checks and publication gates.', 'Checks use the current working checkout, not verified staging versions of all transitive dependencies.'] };
outputs['receipt.json'] = json(receipt);
if (fs.existsSync(out)) {
  for (const [name, bytes] of Object.entries(outputs)) {
    if (!fs.readFileSync(path.join(out, name)).equals(bytes)) throw new Error(`Existing output differs; refusing to overwrite ${name}`);
  }
} else {
  fs.mkdirSync(out);
  for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, { flag: 'wx', mode: 0o600 });
}
console.log(JSON.stringify({ out, reproducible: true, stats: checked.stats, sha256: receipt.outputSha256 }, null, 2));
