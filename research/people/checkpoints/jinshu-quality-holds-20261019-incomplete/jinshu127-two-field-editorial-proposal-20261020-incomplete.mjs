// Research-only proposal: canonical files, claims and locks are never written.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = '/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const loadModule = name => import(pathToFileURL(path.join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await loadModule('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await loadModule('validate-people-extraction.mjs');
const { validateAppliedEditorialDecisions } = await loadModule('lib/people-editorial-decisions.mjs');
const { buildEditorialReviewDossierFromLoaded } = await loadModule('build-people-editorial-review.mjs');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pins = {
  source: ['jinshu127-four-field-materialized-20261020-incomplete/source.json', '7ee2060fe19858753d4b08bd4171a567abe85c0d84b77c9b3396d033db0dccd4'],
  extraction: ['jinshu127-four-field-reconciliation-corrected-20261020-incomplete/extraction.json', '5ff93e9532bc7f546c577982a90b8931879179dadf6f29a898ea159a9ce79add'],
  history: ['jinshu127-four-field-materialized-20261020-incomplete/editorial-history.json', 'ccdfed5ce8b2f7ae0303a3854f26258f71ee6cb855efd347280d1e9adabd86a1'],
  evidence: ['jinshu127-s0214-s0224-additional-source-review-20261020-incomplete.md', 'c7317e87ff10d0b7683af8b6e21e6e725830dd93761daa68f34301ab40680623'],
  researchReview: ['jinshu127-s0214-s0224-independent-proposal-review-20261020-incomplete.md', '764492ef79a7a53c4ed80d72e49d1c40ec326b2188a6c0ea8a6fb7f5da7d1648'],
};
function load([name, expected], json = true) {
  const bytes = fs.readFileSync(path.join(dir, name));
  if (sha(bytes) !== expected) throw new Error(`Input changed: ${name}`);
  return json ? JSON.parse(bytes) : bytes;
}
const source = load(pins.source);
const prior = load(pins.extraction);
const history = load(pins.history);
load(pins.evidence, false);
load(pins.researchReview, false);
const packet = buildPeopleExtractionPacket('jinshu', '127', {
  chapterData: source, chapterFile: path.join(dir, pins.source[0]),
});
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const checkedPrior = validateCompactPeopleExtraction(prior, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checkedPrior.normalized);
const proposals = [];
function add(id, zh, before, after, reason) {
  const unit = units.get(id);
  if (!unit || unit.zh !== zh || unit.en !== before) throw new Error(`Stale source ${id}/idiomatic`);
  if (prior.translationRepairs.some(row => row[0] === id && row[1] === 'idiomatic')) throw new Error(`Existing repair ${id}/idiomatic`);
  proposals.push([id, 'idiomatic', before, after, reason, 'high', 'proposed']);
}
add('s0214', '段宏等聞宮中有變，勒兵屯四門。',
  'Duan Hong and the rest heard the alarm and sealed the four gates with troops.',
  'Duan Hong and the others heard of the palace disturbance and stationed their troops at the four gates.',
  'The source places troops at the four gates but does not say they were sealed. 勒兵 also suggests mustering or commanding troops; this narrow correction does not resolve that nuance.');
add('s0215', '德入宮，誅赤眉等，達懼而奔魏。',
  "Murong De re-entered the palace, executed Hou Chimei's faction, and Murong Da fled to Wei.",
  'Murong De entered the palace and executed Hou Chimei and the others; Murong Da fled in fear to Wei.',
  '赤眉等 means Chimei and others, not necessarily a faction; 達懼 expressly gives Da’s fear. Names follow the immediately preceding context.');
if (proposals.length !== 2 || new Set(proposals.map(row => `${row[0]}/${row[1]}`)).size !== 2) throw new Error('Unexpected proposal scope');
const candidate = structuredClone(prior);
candidate.translationRepairs.push(...proposals);
const restored = structuredClone(candidate);
restored.translationRepairs.splice(-2);
if (!isDeepStrictEqual(restored, prior)) throw new Error('Unexpected extraction change');
const checked = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '127', packet, extraction: checked.normalized }, { context: 2 });
if (dossier.items.length !== 2) throw new Error(`Unexpected dossier size ${dossier.items.length}`);
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = {
  'packet.json': encode(packet),
  'proposed-extraction.json': encode(candidate),
  'review-dossier.json': encode(dossier),
  'blank-decision-seed.json': encode(dossier.decisionSeed),
};
const receipt = {
  status: 'research-only-incomplete-no-production-approval',
  stagingScriptsRevision: '303b4e0fe883d4d305d84987b656322a91e5c3a4', fixture,
  inputHashes: Object.fromEntries(Object.entries(pins).map(([key, value]) => [key, value[1]])),
  outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])),
  stats: checked.stats,
  checks: { strictAliasDispositions: true, appliedHistory: true, exactTwoFields: true, otherExtractionFieldsPreserved: true },
  limits: [
    'Research reviewer supported these exact renderings, but the blank seed is not a production decision.',
    's0214 retains an open nuance of 勒兵; no claim that the gates were closed is made.',
    's0223 and other known defects are deliberately untouched.',
    'No whole-chapter editorial, date, identity or publication approval.',
    'An independent source-witness decision and host reconciliation followed by fresh downstream gates are required.',
  ],
};
outputs['receipt.json'] = encode(receipt);
const out = path.join(dir, 'jinshu127-two-field-editorial-proposal-20261020-incomplete');
fs.mkdirSync(out);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ out, fixture, receipt }, null, 2));
