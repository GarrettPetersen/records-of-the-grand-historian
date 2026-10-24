// Research only: correct one independently witnessed s0191 De candidate.
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
const {validateCompactPeopleExtraction} = await loadModule('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket} = await loadModule('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions} = await loadModule('lib/people-editorial-decisions.mjs');
const pins = {
  extraction: ['jinshu127-two-field-reconciliation-corrected-20261020-incomplete/extraction.json', 'ba7e5437d01c7065015f6f73e2be26d45390b97a8fcd85f454ac2c56355cf4f6'],
  packet: ['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json', 'cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
  source: ['jinshu127-two-field-materialized-held-20261020-incomplete/source.json', 'ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
  history: ['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json', '093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e'],
  challenge: ['jinshu127-unscanned-v7-independent-challenge-20261020-incomplete.md', 'b81cad9e23c5521900af7ec99ae3d6255607e8ec8b783d8c37b9110c10be285e'],
};
const load = ([name, expected], json = true) => { const bytes = fs.readFileSync(path.join(dir, name)); if (sha(bytes) !== expected) throw new Error(`Changed input ${name}`); return json ? JSON.parse(bytes) : bytes.toString('utf8'); };
const extraction = load(pins.extraction), packet = load(pins.packet), source = load(pins.source), history = load(pins.history);
const challenge = load(pins.challenge, false);
if (!challenge.includes('cand_9831e41404c31316') || !challenge.includes('p078')) throw new Error('Independent challenge lacks exact evidence');
const rebuilt = buildPeopleExtractionPacket('jinshu', '127', {chapterData: source, chapterFile: path.join(dir, 'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if (!isDeepStrictEqual(rebuilt, packet)) throw new Error('Stale packet');
const candidate = packet.preflight.candidates.find(item => item.id === 'jinshu:127:cand_9831e41404c31316');
if (!candidate || candidate.unit !== 's0191' || candidate.language !== 'en' || candidate.exact !== 'De' || candidate.occurrence !== 0 || candidate.startCodePoint !== 0 || candidate.endCodePoint !== 2) throw new Error('Unexpected candidate');
const unit = packet.units.find(item => item.id === 's0191');
if (!unit.zh.startsWith('德母兄先在長安') || !unit.en.startsWith("De's mother and elder brother")) throw new Error('Unexpected source witness');
const person = extraction.people.find(row => row[0] === 'p078');
if (!person || !isDeepStrictEqual(person[1].slice(0, 2), ['Murong De', '慕容德'])) throw new Error('Unexpected local person');
const motherBefore = structuredClone(extraction.surfaces.filter(row => row[0] === 'p106'));
if (!motherBefore.some(row => row[2] === 'zh' && row[3] === '母')) throw new Error('Mother surface missing');
if (extraction.surfaces.some(row => row[0] === 'p078' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'De' && row[4].some(loc => loc[0] === 's0191'))) throw new Error('Already linked');
const original = structuredClone(extraction);
const groups = extraction.candidateDispositions.filter(group => group[0] === 'not-person' && group[1] === 'other');
if (groups.length !== 1) throw new Error('Unexpected disposition groups');
const index = groups[0][2].findIndex(entry => isDeepStrictEqual(entry, ['cand_9831e41404c31316', 'De @ s0191']));
if (index < 0 || groups[0][2].filter(entry => entry[0] === 'cand_9831e41404c31316').length !== 1) throw new Error('Unexpected disposition');
const removed = groups[0][2].splice(index, 1)[0];
const added = ['p078', 'personal-name', 'en', 'De', [['s0191', [0]]]];
extraction.surfaces.push(added);
const restored = structuredClone(extraction);
if (!isDeepStrictEqual(restored.surfaces.pop(), added)) throw new Error('Unexpected added surface');
restored.candidateDispositions.find(group => group[0] === 'not-person' && group[1] === 'other')[2].splice(index, 0, removed);
if (!isDeepStrictEqual(restored, original) || !isDeepStrictEqual(motherBefore, extraction.surfaces.filter(row => row[0] === 'p106'))) throw new Error('Unexpected other extraction change');
const checked = validateCompactPeopleExtraction(extraction, packet, {strictAliasDispositions: true});
validateAppliedEditorialDecisions(history, checked.normalized);
const links = checked.normalized.mentions.filter(m => m.person === 'jinshu:127:p078' && m.unit.id === 's0191' && m.spans.en.some(s => s.exact === 'De' && s.occurrence === 0));
if (links.length !== 1 || !links[0].candidateRefs.includes(candidate.id)) throw new Error('New surface does not account for candidate');
const bytes = Buffer.from(`${JSON.stringify(extraction, null, 2)}\n`);
const receipt = {status:'research-only-held-independent-review-required', stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4', fixture, scriptHashes:scriptPins, inputHashes:Object.fromEntries(Object.entries(pins).map(([key,value]) => [key,value[1]])), extractionSha256:sha(bytes), chapterFingerprint:packet.input.chapterFingerprint, changes:{removedDisposition:removed, addedSurface:added, motherSurfacesPreserved:motherBefore}, validation:{strictAliasDispositions:true, appliedHistory:true, exactChangesOnly:true, stats:checked.stats}, limitations:['Independent review of this exact change is required.', 'The original extraction has no English mother kinship surface in s0191; this candidate does not add it.', 'Other reconciliation and chapter-wide editorial, date, identity and publication gates remain unapproved.', 'No canonical files, Git, queue or locks changed.']};
const out = path.join(dir, 'jinshu127-s0191-de-corrected-20261020-incomplete');
fs.mkdirSync(out);
fs.writeFileSync(path.join(out, 'extraction.json'), bytes, {flag:'wx',mode:0o600});
fs.writeFileSync(path.join(out, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, {flag:'wx',mode:0o600});
console.log(JSON.stringify({out,receipt}, null, 2));
