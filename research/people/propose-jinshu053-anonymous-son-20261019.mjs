// Isolated research proposal; this script never writes canonical files.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-reviewed-claim-repair-proposal-v2-20261019-incomplete`;
const output = `${root}/jinshu053-anonymous-son-proposal-20261019-incomplete`;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function read(name, expected) {
  const bytes = fs.readFileSync(`${input}/${name}`);
  if (expected) assert.equal(digest(bytes), expected, `unexpected ${name}`);
  return JSON.parse(bytes);
}
const source = read('source.json', 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d');
const extraction = read('extraction.json', 'a333db403b09483991c7401ba8fb3756c8da394c38bbe2ececaa85a1bc12c5be');
const history = read('editorial-history.json');
const decisions = read('review-decisions.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
const before = structuredClone(extraction);
const id = x => `jinshu:053:${x}`;
function one(collection, key, value) { const matches = collection.filter(x => x[key] === id(value)); assert.equal(matches.length, 1, value); return matches[0]; }
const person = key => one(extraction.people, 'localId', key);
const claim = key => one(extraction.claims, 'id', key);
const mention = key => one(extraction.mentions, 'id', key);
assert(!extraction.people.some(x => x.localId === id('p072')));
const son = id('p072'), father = id('p001'), mother = id('p027'), bin = id('p028');
extraction.people.push({ localId: son, preferredNameSuggestion: { en: 'Son of Sima Yu and Consort Jiang', zh: null, pinyin: null }, historicity: 'historical', descriptorSuggestion: 'Son of Sima Yu and Consort Jiang', identityHints: { nativePlaces: [], relatedLocalPeople: [father, mother], activeDateHints: [], polityHints: ['Western Jin', '晉'] } });
assert.equal(mention('m0098').person, bin); mention('m0098').person = son;
for (const key of ['c0113', 'c0279', 'c0334']) { assert.equal(claim(key).subject, bin); claim(key).subject = son; }
assert.deepEqual(claim('c0114').evidence, [id('s0017'), id('s0170')]); claim('c0114').evidence = [id('s0170')];
assert.deepEqual(claim('c0333').evidence, [id('s0017'), id('s0170')]); claim('c0333').evidence = [id('s0170')];
assert.deepEqual(claim('c0333').value.kinshipTerm, { zh: '男', en: 'son' }); delete claim('c0333').value.kinshipTerm;
const motherHints = person('p027').identityHints.relatedLocalPeople;
assert(motherHints.includes(bin)); person('p027').identityHints.relatedLocalPeople = motherHints.map(x => x === bin ? son : x);
const binHints = person('p028').identityHints.relatedLocalPeople;
assert(binHints.includes(mother)); person('p028').identityHints.relatedLocalPeople = binHints.filter(x => x !== mother);
const fatherHints = person('p001').identityHints.relatedLocalPeople;
assert(!fatherHints.includes(son)); fatherHints.push(son);
extraction.claims.push({ id: id('c0539'), subject: son, predicate: 'family-relationship', value: { relation: 'child-of', personId: father, parentage: 'biological', subjectRole: 'son', objectRole: 'father' }, certainty: 'strongly-inferred', evidence: [id('s0017')] });
extraction.claims.push({ id: id('c0540'), subject: son, predicate: 'role', value: { roleId: 'royal-family-member' }, certainty: 'strongly-inferred', evidence: [id('s0017')] });
extraction.claims.push({ id: id('c0541'), subject: son, predicate: 'attestation', value: { undatedSourceAttestation: true, event: 'Consort Jiang bears a son for whom the crown prince is urged to commission toys.' }, certainty: 'explicit', evidence: [id('s0017')] });
const result = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const changes = [];
for (const [section, key] of [['people', 'localId'], ['mentions', 'id'], ['claims', 'id']]) {
  for (const item of result.normalized[section]) {
    const old = before[section].find(x => x[key] === item[key]);
    if (JSON.stringify(old) !== JSON.stringify(item)) changes.push({ section, id: item[key], before: old ?? null, after: item });
  }
}
assert(!fs.existsSync(output), `refusing to overwrite ${output}`); fs.mkdirSync(output);
const delta = { status: 'incomplete research proposal; no independent review or publication approval', input, chapterFingerprint: packet.input.chapterFingerprint, explanation: 'The newborn is individuated but unnamed in s0017. Do not infer that he is Bin without a source-supported identity decision; preserve distinct local records without asserting that they are different people.', unresolved: ['s0170 and s0171 Chinese lacuna and Bin-linked s0170 claim support', 'independent review of this exact delta, including surname/title evidence and any source conflict', 'independent chronology audit of undated attestation and any inherited date context', 'fresh independent date audit and identity resolution, editorial coverage and publication gates'], changes, validationStats: result.stats };
for (const [name, value] of Object.entries({ 'source.json': source, 'extraction.json': result.normalized, 'editorial-history.json': history, 'review-decisions.json': decisions, 'anonymous-son-delta.json': delta })) {
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`); fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' }); console.log(`${name} ${digest(bytes)}`);
}
console.log(JSON.stringify({ output, chapterFingerprint: packet.input.chapterFingerprint, changedRecords: changes.map(x => x.id), stats: result.stats }, null, 2));
