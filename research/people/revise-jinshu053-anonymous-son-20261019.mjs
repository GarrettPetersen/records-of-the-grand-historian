// Independent-review revisions to an isolated draft; no canonical writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';
const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-anonymous-son-proposal-20261019-incomplete`;
const output = `${root}/jinshu053-anonymous-son-proposal-v2-20261019-incomplete`;
const sha = value => createHash('sha256').update(value).digest('hex');
function read(name, expected) { const bytes = fs.readFileSync(`${input}/${name}`); if (expected) assert.equal(sha(bytes), expected); return JSON.parse(bytes); }
const source = read('source.json', 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d');
const extraction = read('extraction.json', '448c298ef74f09bdd911635546df64840800ed7daf2d96f797a7b38d9c3308d7');
const history = read('editorial-history.json', 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7');
const decisions = read('review-decisions.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
const before = structuredClone(extraction), id = x => `jinshu:053:${x}`;
function one(collection, field, key) { let found = collection.filter(x => x[field] === id(key)); assert.equal(found.length, 1, key); return found[0]; }
const person = k => one(extraction.people, 'localId', k), mention = k => one(extraction.mentions, 'id', k), claim = k => one(extraction.claims, 'id', k);
const father = id('p001'), jun = id('p027'), son = id('p072'), mother = id('p073'), edictJiang = id('p074');
assert(!extraction.people.some(x => [mother, edictJiang].includes(x.localId)));
extraction.people.push({ localId: mother, preferredNameSuggestion: { en: 'Consort Jiang', zh: '蔣美人', pinyin: 'Jiang meiren' }, historicity: 'historical', descriptorSuggestion: 'Favored consort of Sima Yu', identityHints: { nativePlaces: [], relatedLocalPeople: [father, son], activeDateHints: [], polityHints: ['Western Jin', '晉'] } });
extraction.people.push({ localId: edictJiang, preferredNameSuggestion: { en: 'Jiang', zh: '蔣', pinyin: 'Jiang' }, historicity: 'uncertain', descriptorSuggestion: 'Jiang named in the forged statement', identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [], polityHints: ['Western Jin', '晉'] } });
const baolin = person('p027');
assert.deepEqual(baolin.preferredNameSuggestion, { en: 'Consort Jiang', zh: '蔣美人', pinyin: 'Jiang meiren' });
baolin.preferredNameSuggestion = { en: 'Jiang Jun', zh: '蔣俊', pinyin: 'Jiang Jun' };
baolin.descriptorSuggestion = "Crown prince's baolin";
assert.deepEqual(baolin.identityHints.relatedLocalPeople, [father, son]); baolin.identityHints.relatedLocalPeople = [];
assert.deepEqual(baolin.identityHints.activeDateHints, ['AD 291-299', 'AD 299']); baolin.identityHints.activeDateHints = ['AD 299'];
assert(person('p001').identityHints.relatedLocalPeople.includes(jun));
person('p001').identityHints.relatedLocalPeople = person('p001').identityHints.relatedLocalPeople.map(x => x === jun ? mother : x);
assert(person('p072').identityHints.relatedLocalPeople.includes(jun));
person('p072').identityHints.relatedLocalPeople = person('p072').identityHints.relatedLocalPeople.map(x => x === jun ? mother : x);
for (const k of ['m0097', 'm0100']) { assert.equal(mention(k).person, jun); mention(k).person = mother; }
for (const k of ['m0205', 'm0207']) { assert.equal(mention(k).person, jun); mention(k).person = edictJiang; }
for (const k of ['c0104', 'c0315', 'c0332', 'c0405']) { assert.equal(claim(k).subject, jun); claim(k).subject = mother; }
assert.equal(claim('c0107').subject, jun); claim('c0107').subject = edictJiang;
assert.equal(claim('c0334').value.personId, jun); claim('c0334').value.personId = mother;
assert.deepEqual(claim('c0108').evidence, [id('s0017'), id('s0065')]); claim('c0108').evidence = [id('s0065')];
assert.deepEqual(claim('c0405').value, { sourceDate: { text: '元康中' }, westernInterval: { start: { era: 'AD', year: 291, precision: 'year' }, end: { era: 'AD', year: 299, precision: 'year' } } });
claim('c0405').value = { undatedSourceAttestation: true, event: 'The crown prince’s favored Consort Jiang bears a son.' }; claim('c0405').certainty = 'explicit';
const loc = structuredClone(mention('m0098').unit);
const unit = source.content[loc.blockIndex].sentences[loc.itemIndex]; assert.equal(unit.id, 's0017');
const eng = unit.translations.find(x => x.lang === 'en').idiomatic;
function span(text, exact) { const start = text.indexOf(exact); assert(start >= 0); return { exact, occurrence: 0, startCodePoint: [...text.slice(0, start)].length, endCodePoint: [...text.slice(0, start + exact.length)].length, unitTextHash: `sha256:${sha(text)}` }; }
assert.equal(mention('m0098').person, son); assert.deepEqual(mention('m0098').spans.en, []); mention('m0098').spans.en.push(span(eng, 'imperial grandson'));
extraction.mentions.push({ id: id('m0493'), person: son, unit: loc, kind: 'kinship-reference', spans: { zh: [span(unit.zh, '男')], en: [span(eng, 'son')] }, candidateRefs: [] });
extraction.claims.push({ id: id('c0542'), subject: mother, predicate: 'role', value: { roleId: 'consort' }, certainty: 'explicit', evidence: [id('s0017')] });
extraction.claims.push({ id: id('c0543'), subject: jun, predicate: 'attestation', value: { sourceDate: { text: '十二月' }, unresolved: true, unresolvedReason: 'The preceding December heading and its regnal year require independent review for whether they govern Jiang Jun’s interrogation and death.' }, certainty: 'uncertain', evidence: [id('s0044'), id('s0045'), id('s0065')] });
extraction.claims.push({ id: id('c0544'), subject: edictJiang, predicate: 'role', value: { roleId: 'named-individual' }, certainty: 'explicit', evidence: [id('s0053')] });
extraction.claims.push({ id: id('c0545'), subject: edictJiang, predicate: 'attestation', value: { undatedSourceAttestation: true, event: 'A forged statement calls for Jiang to become inner ruler.' }, certainty: 'explicit', evidence: [id('s0053')] });
extraction.claims.push({ id: id('c0546'), subject: son, predicate: 'birth', value: { event: 'Consort Jiang bore this son.' }, certainty: 'explicit', evidence: [id('s0017')] });
const result = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true }); validateAppliedEditorialDecisions(history, result.normalized);
const changes = [];
for (const [section, key] of [['people', 'localId'], ['mentions', 'id'], ['claims', 'id']]) for (const item of result.normalized[section]) { const old = before[section].find(x => x[key] === item[key]); if (JSON.stringify(old) !== JSON.stringify(item)) changes.push({ section, id: item[key], before: old ?? null, after: item }); }
assert(!fs.existsSync(output)); fs.mkdirSync(output);
const delta = { status: 'incomplete research proposal; exact output requires independent review', input, chapterFingerprint: packet.input.chapterFingerprint, review: `${root}/jinshu053-anonymous-son-independent-review-20261019-incomplete.md`, rationale: 'Separate source-specific Jiang references without making any same- or different-person identity decision; retain explicit unknown birth date and remove the fabricated chronology from the mother.', unresolved: ['Bin evidence depends on lacunose s0170 and s0171; source correspondence and claim review remain required', 'independent identity review of p027, p073, p074, p028 and p072 including external witnesses', 'independent date audit of all source chronology and inherited context', 'independent exact-output and candidate-surface review, full editorial coverage and publication gates'], changes, validationStats: result.stats };
for (const [name, value] of Object.entries({ 'source.json': source, 'extraction.json': result.normalized, 'editorial-history.json': history, 'review-decisions.json': decisions, 'anonymous-son-v2-delta.json': delta })) { const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`); fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' }); console.log(`${name} ${sha(bytes)}`); }
console.log(JSON.stringify({ output, changedRecords: changes.map(x => x.id), stats: result.stats }, null, 2));
