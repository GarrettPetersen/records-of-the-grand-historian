// Research-only; fail on unexpected bytes, state or validation. Never publish.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-seven-selective-reconciliation-v3-20261019-incomplete`;
const output = `${root}/jinshu053-v3-p038-source-claim-v1-20261020-incomplete`;
const expected = {
  'source.json': 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d',
  'extraction.json': '13215bc5ec25605eda82e9ae22e99786480821e61b5a709faed7816e0445f22f',
  'editorial-history.json': 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7',
  'review-decisions.json': 'e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a',
};
const sha = b => createHash('sha256').update(b).digest('hex');
const raw = {}, data = {};
for (const [name, fingerprint] of Object.entries(expected)) {
  raw[name] = fs.readFileSync(`${input}/${name}`);
  assert.equal(sha(raw[name]), fingerprint, name);
  data[name] = JSON.parse(raw[name]);
}
assert.equal(sha(fs.readFileSync('data/jinshu/096.json')), 'be8370803176c863317a6ec0bf918bea32f05c0c0f31168f6c5978c9bac60be2');
const extraction = structuredClone(data['extraction.json']);
const claim = id => {
  const rows = extraction.claims.filter(c => c.id === `jinshu:053:${id}`);
  assert.equal(rows.length, 1, id);
  return rows[0];
};

// Category unknown in local unit: preserve the exact occurrence and preferred
// label, but do not assert it was explicitly a personal name. The two mention
// kinds are deliberately held for a separate cross-source representation review.
const name = claim('c0146');
assert.deepEqual(name.value, {kind:'personal-name', en:'Huifeng', zh:'惠風', pinyin:'Huifeng'});
assert.deepEqual(name.evidence, ['jinshu:053:s0035']);
extraction.claims.splice(extraction.claims.indexOf(name), 1);
const surname = claim('c0147');
assert.deepEqual(surname.value, {kind:'personal-name', en:'Wang Huifeng', zh:'王氏'});
surname.value = {kind:'surname', en:'Wang', zh:'王'};
const role = claim('c0150');
assert.deepEqual(role.evidence, ['jinshu:053:s0035','jinshu:053:s0065']);
role.evidence = ['jinshu:053:s0065'];
const spouse = claim('c0335');
assert.equal(spouse.value.relationshipState, 'divorced');
assert.deepEqual(spouse.evidence, ['jinshu:053:s0035','jinshu:053:s0073']);
delete spouse.value.relationshipState;
delete spouse.value.unionCategory;
delete spouse.value.subjectRole;
delete spouse.value.objectRole;
spouse.certainty = 'strongly-inferred';
spouse.evidence = ['jinshu:053:s0065','jinshu:053:s0073'];
const child = claim('c0336');
assert.equal(child.value.parentage, 'biological');
delete child.value.parentage;
const sibling = claim('c0338');
assert.equal(sibling.value.sharedParentage, 'full');
delete sibling.value.sharedParentage;

const packet = buildPeopleExtractionPacket('jinshu', '053', {chapterData:data['source.json']});
const valid = validatePeopleExtraction(extraction, packet, {strictAliasDispositions:true});
validateAppliedEditorialDecisions(data['editorial-history.json'], valid.normalized);
assert(!fs.existsSync(output), `refusing to overwrite ${output}`);
fs.mkdirSync(output);
const result = {
  'source.json': raw['source.json'],
  'extraction.json': Buffer.from(`${JSON.stringify(valid.normalized,null,2)}\n`),
  'editorial-history.json': raw['editorial-history.json'],
  'review-decisions.json': raw['review-decisions.json'],
};
const hashes = {};
for (const [filename, bytes] of Object.entries(result)) {
  fs.writeFileSync(`${output}/${filename}`, bytes, {flag:'wx'});
  hashes[filename] = sha(bytes);
}
const manifest = {
  status: 'INCOMPLETE RESEARCH ONLY: no publication or whole-chapter approval',
  input, inputSha256: expected, outputSha256: hashes,
  chapterFingerprint:packet.input.chapterFingerprint, stats:valid.stats,
  validatorScope: 'Pinned staging fixture only; current shared-checkout compatibility unverified',
  modifications: ['remove unsupported explicit category for Huifeng claim, retain mentions pending source-aware name representation', 'replace unequal full name with locally attested Wang surname', 'remove betrothal from explicit consort role evidence', 'remove unproved divorce and marriage qualifiers; qualify inferred spouse link', 'remove unsupported biological-parentage and full-sibling qualifiers'],
  holds: ['two Huifeng occurrence types still personal-name; local unit does not determine category, while 096 s0099 says courtesy-name and cannot be added as a 053 unit', 'inherited title rendering and all inherited extraction claims not reviewed', 'exact candidate must be independently reviewed; existing editorial, date, identity and publication holds remain'],
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest,null,2)}\n`);
fs.writeFileSync(`${output}/manifest.json`, manifestBytes, {flag:'wx'});
console.log(JSON.stringify({output, manifestSha256:sha(manifestBytes),...manifest},null,2));
