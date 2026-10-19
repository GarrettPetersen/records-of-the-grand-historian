// Isolated, source-reviewed research proposal; never publishes canonical files.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-seven-selective-reconciliation-v3-20261019-incomplete`;
const output = `${root}/jinshu053-reviewed-claim-repair-proposal-v2-20261019-incomplete`;
const hash = b => createHash('sha256').update(b).digest('hex');
function read(name, expected) {
  const bytes = fs.readFileSync(`${input}/${name}`);
  assert.equal(hash(bytes), expected, `unexpected ${name} bytes`);
  return JSON.parse(bytes);
}
const source = read('source.json', 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d');
const extraction = read('extraction.json', '13215bc5ec25605eda82e9ae22e99786480821e61b5a709faed7816e0445f22f');
const history = read('editorial-history.json', 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7');
const decisions = read('review-decisions.json', 'e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
const before = structuredClone(extraction);
function claim(id) { const matches = extraction.claims.filter(x => x.id === `jinshu:053:${id}`); assert.equal(matches.length, 1, id); return matches[0]; }
function person(id) { const matches = extraction.people.filter(x => x.localId === `jinshu:053:${id}`); assert.equal(matches.length, 1, id); return matches[0]; }
function replace(object, key, expected, replacement) { assert.deepEqual(object[key], expected); object[key] = replacement; }
replace(claim('c0106').value, 'en', 'Heir guardian Jiang Jun', "Crown Prince's baolin Jiang Jun");
replace(person('p051').preferredNameSuggestion, 'en', 'Sima Tong', 'Sima Rong');
replace(person('p051').preferredNameSuggestion, 'pinyin', 'Sima Tong', 'Sima Rong');
replace(claim('c0186').value, 'en', 'Sima Tong', 'Sima Rong');
replace(claim('c0186').value, 'pinyin', 'Tong', 'Rong');
replace(claim('c0186'), 'certainty', 'explicit', 'strongly-inferred');
for (const [id, expected] of [['c0333', 1], ['c0348', 2], ['c0349', 3]]) {
  const value = claim(id).value; assert.equal(value.subjectBirthOrder, expected); delete value.subjectBirthOrder;
}
for (const [id, parentage] of [['c0350', 'paternal-half'], ['c0351', 'paternal-half'], ['c0352', 'full']]) {
  const value = claim(id).value; assert.equal(value.sharedParentage, parentage); assert.equal(value.subjectRelativeAge, 'younger');
  assert.deepEqual(value.kinshipTerm, { zh: '子', en: 'brother' });
  delete value.sharedParentage; delete value.subjectRelativeAge; delete value.kinshipTerm;
}
replace(person('p028'), 'descriptorSuggestion', 'Eldest son of Sima Yu', 'Son of Sima Yu');
replace(person('p068'), 'descriptorSuggestion', 'Second son of Sima Yu; imperial grandson-heir', 'Son of Sima Yu; imperial grandson-heir');
replace(person('p069'), 'descriptorSuggestion', 'Third son of Sima Yu; imperial grandson-heir', 'Son of Sima Yu; imperial grandson-heir');
assert.equal(claim('c0528').value.authorityPersonId, 'jinshu:053:p053');
delete claim('c0528').value.authorityPersonId;
const result = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const changes = [];
for (const [section, key] of [['people', 'localId'], ['claims', 'id']]) {
  for (const item of result.normalized[section]) {
    const original = before[section].find(x => x[key] === item[key]); assert(original);
    if (JSON.stringify(original) !== JSON.stringify(item)) changes.push({ section, id: item[key], before: original, after: item });
  }
}
assert.equal(changes.length, 13);
assert(!fs.existsSync(output), `refusing to overwrite ${output}`);
fs.mkdirSync(output);
const metadata = { status: 'incomplete research proposal; independent exact-output review and all downstream gates remain required', input, chapterFingerprint: packet.input.chapterFingerprint, evidence: `${root}/jinshu053-claim-repair-independent-review-incomplete-20261020.md`, unresolved: ['s0017 unnamed grandson linked to p028 and related unsupported parentage and hint evidence', 'Chinese s0170/s0171 lacuna and related p028 claims', 'fresh independent date audit, identity resolution and full editorial coverage'], changes, validationStats: result.stats };
const files = { 'source.json': source, 'extraction.json': result.normalized, 'editorial-history.json': history, 'review-decisions.json': decisions, 'claim-repair-delta.json': metadata };
const hashes = {};
for (const [name, value] of Object.entries(files)) { const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`); fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' }); hashes[name] = hash(bytes); }
console.log(JSON.stringify({ output, hashes, chapterFingerprint: packet.input.chapterFingerprint, stats: result.stats, changedRecords: changes.map(x => x.id) }, null, 2));
