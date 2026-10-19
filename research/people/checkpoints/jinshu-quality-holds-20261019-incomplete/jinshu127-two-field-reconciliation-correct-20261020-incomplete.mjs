// Research-only exact removal of the demonstrably false s0213 disposition.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = '/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const scriptPins = {
  'validate-people-extraction.mjs': '33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6',
  'build-people-extraction-packet.mjs': '6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245',
  'lib/people-editorial-decisions.mjs': '8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6',
};
for (const [name, expected] of Object.entries(scriptPins)) if (sha(fs.readFileSync(path.join(fixture, 'scripts', name))) !== expected) throw new Error(`Changed fixture script ${name}`);
const loadModule = name => import(pathToFileURL(path.join(fixture, 'scripts', name)).href);
const { validateCompactPeopleExtraction } = await loadModule('validate-people-extraction.mjs');
const { buildPeopleExtractionPacket } = await loadModule('build-people-extraction-packet.mjs');
const { validateAppliedEditorialDecisions } = await loadModule('lib/people-editorial-decisions.mjs');
const base = 'jinshu127-two-field-materialized-held-20261020-incomplete';
const pins = {
  extraction: ['compact-extraction-UNREVIEWED.json', '4b07a0e5b17abec04d2487e2d76a7cc807dc887a96c219ca7c931467a37138a6'],
  packet: ['packet.json', 'cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
  source: ['source.json', 'ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
  history: ['editorial-history.json', '093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e'],
};
const load = ([name, expected]) => { const bytes = fs.readFileSync(path.join(dir, base, name)); if (sha(bytes) !== expected) throw new Error(`Changed input ${name}`); return JSON.parse(bytes); };
const {extraction, packet, source, history} = Object.fromEntries(Object.entries(pins).map(([key,value]) => [key, load(value)]));
// Preserve the historical packet's source-path metadata while recomputing from the new source bytes.
const rebuilt = buildPeopleExtractionPacket('jinshu', '127', {chapterData: source, chapterFile: path.join(dir, 'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if (!isDeepStrictEqual(rebuilt, packet)) throw new Error('Packet is not current for pinned source');
const unit = packet.units.find(item => item.id === 's0213');
if (unit.zh !== '中黃門遜進扶德逾城，隱於進舍。' || unit.en !== "Palace attendant Xun Jin helped De over the wall, and De hid at Jin's residence.") throw new Error('Unexpected source witness');
const original = structuredClone(extraction);
const groups = extraction.candidateDispositions.filter(group => group[0] === 'not-person' && group[1] === 'polity');
if (groups.length !== 1) throw new Error('Unexpected polity groups');
const index = groups[0][2].findIndex(entry => entry[0] === 'cand_b79e43b7adcb8ce4' && entry[1] === 'Jin');
if (index < 0 || groups[0][2].filter(entry => entry[0] === 'cand_b79e43b7adcb8ce4').length !== 1) throw new Error('Unexpected false disposition');
const removed = groups[0][2].splice(index, 1)[0];
if (extraction.surfaces.filter(row => row[0] === 'p125' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'Jin' && isDeepStrictEqual(row[4], [['s0213', [1]]])).length !== 1) throw new Error('Reviewed personal-name surface missing');
const restored = structuredClone(extraction);
restored.candidateDispositions.find(group => group[0] === 'not-person' && group[1] === 'polity')[2].splice(index, 0, removed);
if (!isDeepStrictEqual(restored, original)) throw new Error('Unexpected change beyond exact disposition');
const result = validateCompactPeopleExtraction(extraction, packet, {strictAliasDispositions: true});
validateAppliedEditorialDecisions(history, result.normalized);
const candidate = packet.preflight.candidates.find(item => item.id === 'jinshu:127:cand_b79e43b7adcb8ce4');
if (!candidate || candidate.unit !== 's0213' || candidate.language !== 'en' || candidate.exact !== 'Jin' || candidate.occurrence !== 1) throw new Error('Unexpected candidate');
const matching = result.normalized.mentions.filter(item => item.person === 'jinshu:127:p125' && item.unit.id === 's0213' && item.spans.en.some(span => span.exact === 'Jin' && span.occurrence === 1));
if (matching.length !== 1 || !matching[0].candidateRefs.includes(candidate.id)) throw new Error('Candidate not accounted for by retained person surface');
const bytes = Buffer.from(`${JSON.stringify(extraction, null, 2)}\n`);
const receipt = {status: 'research-only-held-needs-independent-review', stagingScriptsRevision: '303b4e0fe883d4d305d84987b656322a91e5c3a4', fixture, scriptHashes: scriptPins, inputHashes: Object.fromEntries(Object.entries(pins).map(([key,value]) => [key,value[1]])), extractionSha256: sha(bytes), chapterFingerprint: packet.input.chapterFingerprint, correction: {removed, unit: 's0213', reason: 'The referenced Jin is Xun Jin, the attendant whose residence shelters De, not the Jin polity.', person: 'jinshu:127:p125', retainedCandidateReference: candidate.id}, validation: {strictAliasDispositions: true, appliedHistory: true, exactRemovalOnly: true, stats: result.stats}, limitations: ['Independent review of this exact corrected extraction remains required.', 'This preserves the unreviewed results of the known unsafe reconciliation apart from the one correction; validators do not approve them.', 'No chapter-wide editorial, date, identity or publication approval.', 'No canonical data, queue, locks or Git state was changed.']};
const out = path.join(dir, 'jinshu127-two-field-reconciliation-corrected-20261020-incomplete');
fs.mkdirSync(out);
fs.writeFileSync(path.join(out, 'extraction.json'), bytes, {flag: 'wx', mode: 0o600});
fs.writeFileSync(path.join(out, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx', mode: 0o600});
console.log(JSON.stringify({out, receipt}, null, 2));
