// Research-only proposal generation; never writes source, history, queue, or decisions.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '/Users/garrettpetersen/records-of-the-grand-historian/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/Users/garrettpetersen/records-of-the-grand-historian/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/Users/garrettpetersen/records-of-the-grand-historian/scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/Users/garrettpetersen/records-of-the-grand-historian/scripts/build-people-editorial-review.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const digest = data => createHash('sha256').update(data).digest('hex');
const read = (name, expected) => {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (digest(bytes) !== expected) throw new Error(`Input hash mismatch: ${name}`);
  return JSON.parse(bytes);
};
const source = read('jinshu127-closing-materialized-source-20261019.json', '74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c');
const extraction = read('jinshu127-closing-materialized-extraction-20261019.json', '1516f2bba52ebd08956e35da39e0387e926c8cbac9b99398c185c7cb6ebb8529');
const history = read('jinshu127-closing-materialized-history-20261019.json', '7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(root, 'data/jinshu/127.json') });
if (packet.input.chapterFingerprint !== 'sha256:bd9a75d4cc72084b701fb6baf97845edada0fa16160eb37d1ecf7efc5c02c2bd') throw new Error('Unexpected chapter fingerprint');
const unit = packet.units.find(item => item.id === 's0177');
if (unit?.zh !== '四年，僭即皇帝位於南郊，大赦，改元為建平，設行廟于宮南，遣使奉策告成焉。') throw new Error('Unexpected Chinese');
const changes = [
  ['s0177', 'literal',
    "In the fourth year he usurped the emperor's title at the southern suburb, issued a general amnesty, changed the era name to Jianping, set a traveling temple south of the palace, and sent envoys with the document to report completion.",
    'In the fourth year he claimed the imperial throne at the southern suburb, issued a general amnesty, changed the era name to Jianping, established a temporary ancestral temple south of the palace, and sent envoys bearing a document to report the accomplishment.',
    '行廟 is a temporary ancestral temple; 僭 conveys the history’s disapproval, not an objective judgment. 奉策告成 is a report of an accomplishment bearing a document: its precise contents, recipient and nature of the accomplishment remain unspecified.', 'medium', 'proposed'],
  ['s0177', 'idiomatic',
    "In Long'an 4 (AD 400), he claimed the imperial title at the southern suburban altar, issued a general amnesty, inaugurated the Jianping era, established a traveling ancestral temple south of the palace, and sent envoys bearing the accession proclamation.",
    "In Long'an 4 (AD 400), he claimed the imperial throne at the southern suburb, issued a general amnesty, adopted the Jianping era name, established a temporary ancestral temple south of the palace, and sent envoys with a document to report the accomplishment.",
    'Restore the reporting act in 告成 without specifying the document, recipient, or accomplishment more narrowly than the source. Temporary ancestral temple is a contextual rendering of 行廟. The retained Long’an 4 / AD 400 contextual date needs independent date review.', 'medium', 'proposed'],
];
if (unit.literal !== changes[0][2] || unit.en !== changes[1][2]) throw new Error('Unexpected before text');
const base = validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, base.normalized);
const candidate = structuredClone(extraction);
candidate.translationRepairs.push(...changes);
const withoutNew = structuredClone(candidate);
withoutNew.translationRepairs.splice(-changes.length);
if (!isDeepStrictEqual(withoutNew, extraction)) throw new Error('Unintended extraction changes');
const checked = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '127', packet, extraction: checked.normalized }, { context: 2 });
if (dossier.items.length !== 2 || dossier.items.some(item => item.proposal.unit.id !== 's0177')) throw new Error('Unexpected dossier');
const json = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = {
  'jinshu127-s0177-proposed-extraction-20261020-incomplete.json': json(candidate),
  'jinshu127-s0177-review-dossier-20261020-incomplete.json': json(dossier),
  'jinshu127-s0177-blank-decision-seed-20261020-incomplete.json': json(dossier.decisionSeed),
};
outputs['jinshu127-s0177-proposal-receipt-20261020-incomplete.json'] = json({ schemaVersion: 1, status: 'proposal-only-not-approved', sourceFingerprint: packet.input.chapterFingerprint,
  inputs: { source: '74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c', extraction: '1516f2bba52ebd08956e35da39e0387e926c8cbac9b99398c185c7cb6ebb8529', history: '7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190' },
  outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, digest(bytes)])),
  warnings: ['Blank decision seed is not a reviewer decision.', 'Tests use the current checkout and are not proof of staging code equivalence.', 'Exact independent editorial review, date review, identity and publication gates remain open.', 'No canonical files or prior history were edited.'] });
for (const name of Object.keys(outputs)) if (fs.existsSync(path.join(dir, name))) throw new Error(`Refusing to overwrite ${name}`);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(dir, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ status: 'proposal-only-not-approved', checks: checked.stats, outputs: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, digest(bytes)])) }, null, 2));
