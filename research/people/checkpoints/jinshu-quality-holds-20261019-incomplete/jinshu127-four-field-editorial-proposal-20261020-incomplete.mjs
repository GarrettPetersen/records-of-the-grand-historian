// Fingerprinted, research-only proposal. Never writes canonical data.
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
  source: ['jinshu127-focused-reviewed-materialized-20261020-incomplete/source.json', '6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652'],
  extraction: ['jinshu127-focused-reconciliation-candidate-20261020-incomplete/extraction.json', 'cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7'],
  history: ['jinshu127-focused-reviewed-materialized-20261020-incomplete/editorial-history.json', '4e496af66185e95535f0ffbc7fb9085b13b75f41ce216f7357bb6aa7495e8102'],
  evidence: ['jinshu127-followon-translation-proposals-20261020-incomplete.md', 'ecb70893a649c58fed9fe3c06dcc9ad65fb82dd902179e45465f6ab8c1587a56'],
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
const packet = buildPeopleExtractionPacket('jinshu', '127', {
  chapterData: source, chapterFile: path.join(dir, pins.source[0]),
});
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const checkedPrior = validateCompactPeopleExtraction(prior, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checkedPrior.normalized);
const proposals = [];
function add(id, field, zh, before, after, reason) {
  const unit = units.get(id);
  if (!unit || unit.zh !== zh || (field === 'literal' ? unit.literal : unit.en) !== before) throw new Error(`Stale source ${id}/${field}`);
  if (prior.translationRepairs.some(row => row[0] === id && row[1] === field)) throw new Error(`Existing repair ${id}/${field}`);
  proposals.push([id, field, before, after, reason, 'high', 'proposed']);
}
for (const field of ['literal', 'idiomatic']) add('s0182', field,
  '後因宴其群臣，酒酣，笑而言曰：「朕雖寡薄，恭己南面而朝諸侯，在上不驕，夕惕於位，可方自古何等主也？」',
  "Later at a banquet for his ministers, when the wine was warm he laughed and said, 'Though I am meager, I reverently face south to court the lords; not proud on high, anxious at my post by night; with whom among the ancients may I be compared?'",
  "Later at a banquet for his ministers, when the wine was warm he laughed and said, 'Though I am meager, I conduct myself respectfully, face south, and receive the lords at court; not proud on high, anxious at my post by night; with whom among the ancients may I be compared?'",
  '恭己南面而朝諸侯 depicts the south-facing ruler receiving the lords at court, not him courting them; the remaining inherited wording is not assessed by this focused repair.');
add('s0272', 'literal', '初，德迎其兄子超于長安，及是而至。',
  "Earlier, De had welcomed his brother's son Chao from Chang'an; at this point he arrived.",
  "Earlier, De had sought to bring his brother's son Chao from Chang'an; at this point Chao arrived.",
  'The later arrival should not become an earlier completed welcome. This pairs with the previously reviewed idiomatic wording without asserting a precise means of 迎.');
add('s0275', 'literal', '乃下書以超為皇太子，大赦境內，子為父後者人爵二級。',
  "Thereupon he issued an edict making Chao crown prince, amnestied the realm, and for sons continuing fathers raised each man's rank two grades.",
  'Thereupon he issued an edict making Chao crown prince and granting an amnesty throughout the realm; sons succeeding their fathers were each granted two grades of rank.',
  'The rank grant does not require a prior rank; match the independently revised idiomatic field without asserting an increase.');
if (proposals.length !== 4 || new Set(proposals.map(row => `${row[0]}/${row[1]}`)).size !== 4) throw new Error('Unexpected proposal scope');
const candidate = structuredClone(prior);
candidate.translationRepairs.push(...proposals);
const restored = structuredClone(candidate);
restored.translationRepairs.splice(-4);
if (!isDeepStrictEqual(restored, prior)) throw new Error('Unexpected extraction change');
const checked = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '127', packet, extraction: checked.normalized }, { context: 2 });
if (dossier.items.length !== 4) throw new Error(`Unexpected dossier size ${dossier.items.length}`);
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const outputs = {
  'packet.json': encode(packet),
  'proposed-extraction.json': encode(candidate),
  'review-dossier.json': encode(dossier),
  'blank-decision-seed.json': encode(dossier.decisionSeed),
};
const receipt = {
  status: 'research-only-incomplete-no-approval',
  stagingScriptsRevision: '303b4e0fe883d4d305d84987b656322a91e5c3a4',
  fixture, inputHashes: Object.fromEntries(Object.entries(pins).map(([key, value]) => [key, value[1]])),
  outputHashes: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, sha(bytes)])),
  stats: checked.stats, checks: { strictAliasDispositions: true, appliedHistory: true, exactFourFields: true, otherExtractionFieldsPreserved: true },
  limits: ['Blank seed is not a review decision.', 's0181 and s0194 are deliberately untouched and remain held.', 'No whole-chapter editorial, date, identity or publication approval.', 'A separate reviewer must evaluate the exact source and wording, then host reconciliation and fresh downstream gates are required.'],
};
outputs['receipt.json'] = encode(receipt);
const out = path.join(dir, 'jinshu127-four-field-editorial-proposal-20261020-incomplete');
fs.mkdirSync(out);
for (const [name, bytes] of Object.entries(outputs)) fs.writeFileSync(path.join(out, name), bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ out, fixture, receipt }, null, 2));
