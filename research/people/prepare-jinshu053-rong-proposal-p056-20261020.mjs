// Noncanonical proposed-only handoff. Does not apply repairs or invent reviews.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-real-letter-p056-v1-incomplete-20261020`;
const output = `${root}/jinshu053-rong-p056-proposed-v1-incomplete-20261020`;
const pins = {
  'source.json': '26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78',
  'candidate.json': '35620e8c25541384a137c93eb7d2c6324f7777f5b142860ef8fb74d8bcf2c131',
  'editorial-history.json': '9542ec6bf9385e9b1974d19c74c8227e902931abad8bc33cd58b18c27f696f10',
};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const data = {};
for (const [file, pin] of Object.entries(pins)) {
  const bytes = fs.readFileSync(`${input}/${file}`);
  assert.equal(sha(bytes), pin, file);
  data[file] = JSON.parse(bytes);
}
const source = data['source.json'];
const candidate = structuredClone(data['candidate.json']);
const rows = source.content.flatMap(section => section.sentences ?? []).filter(row => row.id === 's0063');
assert.equal(rows.length, 1);
assert.ok(rows[0].zh.includes('大將軍梁王肜'));
const translations = rows[0].translations.filter(translation => translation.lang === 'en');
assert.equal(translations.length, 1);
const edits = [
  ['s0063', 'literal', [['Prince Liang of Liang', 'Rong, Prince of Liang'], ['Prince Huainan of Yun', 'Yun, Prince of Huainan'], ['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0063', 'idiomatic', [['Sima Tong', 'Sima Rong']]],
  ['s0108', 'literal', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0108', 'idiomatic', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0111', 'literal', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0179', 'literal', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0179', 'idiomatic', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
  ['s0183', 'literal', [['Prince Zhao of Lun', 'Lun, Prince of Zhao']]],
];
for (const [unitId, field, replacements] of edits) {
  const matching = source.content.flatMap(section => section.sentences ?? []).filter(row => row.id === unitId);
  assert.equal(matching.length, 1, unitId);
  const english = matching[0].translations.filter(translation => translation.lang === 'en');
  assert.equal(english.length, 1, unitId);
  const before = english[0][field];
  let after = before;
  for (const [beforeText, afterText] of replacements) {
    assert.equal(after.split(beforeText).length, 2, `${unitId} ${field}`);
    after = after.replace(beforeText, afterText);
  }
  candidate.translationRepairs.push([unitId, field, before, after,
    'Proposed correction: the cited Chinese identifies a personal name after a princely title. Full surname and reading of Rong rely on separately cited corroboration.', 'high', 'proposed']);
}
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
const valid = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(data['editorial-history.json'], valid.normalized);
const person = candidate.people.filter(value => value[0] === 'p051');
assert.equal(person.length, 1);
assert.deepEqual(person[0][1], ['Sima Tong', '司馬肜', 'Sima Tong']);
const name = person[0][5].filter(value => value[0].en === 'Sima Tong' && value[0].zh === '肜');
assert.equal(name.length, 1);
const surface = candidate.surfaces.filter(value => value[0] === 'p051' && value[2] === 'en' && value[3] === 'General-in-Chief Sima Tong');
assert.equal(surface.length, 1);
const dossier = {
  status: 'INCOMPLETE proposed-only: source and existing history untouched; no review or publication approval',
  inputPins: pins,
  sourceUnit: { id: rows[0].id, zh: rows[0].zh },
  proposedTranslationReplacements: edits.map(([unitId, field, replacements]) => ({unitId, field, replacements})),
  postAcceptanceReconciliation: [
    { target: 'people[p051].preferred', before: person[0][1], after: ['Sima Rong', '司馬肜', 'Sima Rong'] },
    { target: 'people[p051].personal-name', before: name[0], after: [{kind:'personal-name',en:'Sima Rong',zh:'肜',pinyin:'Rong'},'strongly-inferred',['s0063']] },
    { target: 'surfaces[p051] English personal-name', before: surface[0], after: ['p051','personal-name','en','General-in-Chief Sima Rong',[['s0063',[0]]]] },
    { target: 'people[p054] title claim', before: 'Prince Zhao of Lun', after: 'Prince of Zhao', evidence: ['s0063','s0108','s0179'] },
    { target: 'surfaces[p054] English title references at s0108 and s0179', before: 'Prince Zhao of Lun', after: 'Prince of Zhao', note: 'Regenerate occurrences against the final approved source; check whether overlapping Lun personal-name spans require separate decisions.' },
    { target: 's0063 p052 and p054 English title references', before: 'No English title-reference surface for p054 in this unit', after: 'Review exact Prince of Huainan and Prince of Zhao mentions after source application; preserve p052 existing and add p054 only if validator and independent review support the span.' },
  ],
  reasoning: '053 s0063 explicitly supplies 梁王肜, not 司馬. Cross-chapter Jinshu 038 and the CText person record independently substantiate the surname and conventional romanization; do not present full-name inference as literal wording in 053.',
  references: ['research/people/jinshu053-sima-rong-incomplete-20261020.md', `${root}/jinshu053-rong-v1-independent-review-20261020.md`],
  holds: ['The named-person and mention replacements are a plan, not current candidate content.', 'Fresh independent decisions against these exact proposed repair IDs are required.', 'Full editorial, date, identity, source-variant and publication gates remain open.', 'Rebuild the source packet and exact mention spans after accepted edits; validate and reconcile all invalidated review fingerprints.', 'No synthetic editorial decisions or approvals are created.'],
  validation: valid.stats,
};
if (fs.existsSync(output)) throw Error('Refusing to overwrite existing proposal');
fs.mkdirSync(output);
for (const [file, value] of Object.entries({'candidate.json':candidate, 'dossier.json':dossier})) {
  fs.writeFileSync(`${output}/${file}`, `${JSON.stringify(value, null, 2)}\n`, { flag:'wx' });
}
console.log(JSON.stringify({output, stats:valid.stats}, null, 2));
