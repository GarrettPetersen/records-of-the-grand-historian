// Isolated, fingerprint-bound proposals only; no decisions or canonical writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '../../../../scripts/build-people-editorial-review.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const base = `${root}/jinshu053-anonymous-son-proposal-v3-20261019-incomplete`;
const out = `${root}/jinshu053-oath-proposals-v1-20261019-incomplete`;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const expected = {
  'source.json': 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d',
  'extraction.json': '9fd9057a444fef6b50119009fe7e113c1956ea0abc8f74217e9998ef052938ec',
  'editorial-history.json': 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7',
};
const bytes = Object.fromEntries(Object.entries(expected).map(([name, hash]) => {
  const contents = fs.readFileSync(`${base}/${name}`);
  assert.equal(sha(contents), hash, name);
  return [name, contents];
}));
const source = JSON.parse(bytes['source.json']);
const original = JSON.parse(bytes['extraction.json']);
const history = JSON.parse(bytes['editorial-history.json']);
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
const baseline = validatePeopleExtraction(original, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, baseline.normalized);
const candidate = structuredClone(baseline.normalized);
assert.equal(candidate.translationRepairs.length, 114);
assert(candidate.translationRepairs.every(r => r.status === 'applied'));
assert(!candidate.translationRepairs.some(r => r.unit.id === 's0053'));
const units = packet.units.filter(unit => unit.id === 's0053');
assert.equal(units.length, 1);
const u = units[0];
const ref = { id: u.id, kind: u.kind, blockIndex: u.blockIndex, collection: u.collection, itemIndex: u.itemIndex };
const target = source.content.flatMap(b => b.sentences ?? []).filter(s => s.id === 's0053');
assert.equal(target.length, 1);
const english = target[0].translations.filter(t => t.lang === 'en');
assert.equal(english.length, 1);
const after = {
  literal: 'Chewing hair and drinking blood beneath the three luminaries, High Heaven permits it; we shall sweep away the harm, establish Daowen as king, and make Jiang the inner ruler.',
  idiomatic: 'Beneath the sun, moon, and stars, we pledge with hair and blood: Heaven gives its leave, and we shall sweep away the danger, make Daowen king, and make Jiang ruler of the inner court.',
};
for (const [field, text] of Object.entries(after)) {
  assert.notEqual(english[0][field], text);
  candidate.translationRepairs.push({
    id: `jinshu:053:r${String(candidate.translationRepairs.length + 1).padStart(4, '0')}`,
    unit: ref, field, before: english[0][field], after: text,
    reason: 'Restore the oath imagery, Daowen and Jiang in the forged document; Hu Sanxing reads the oath as a covenant. The division of 許/當 and modal force remain interpretive; exact-field independent decision and reconciliation are required.',
    confidence: 'high', status: 'proposed',
  });
}
assert.deepEqual(candidate.translationRepairs.slice(0, 114), baseline.normalized.translationRepairs);
const checked = validatePeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, checked.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '053', packet, extraction: checked.normalized }, { context: 2 });
assert.equal(dossier.items.length, 2);
assert.equal(dossier.decisionSeed.decisions.length, 2);
assert(dossier.decisionSeed.decisions.every(d => d.reason === '' && d.sourceWitness === null));
const outputs = {
  'source.json': bytes['source.json'],
  'original-extraction.json': bytes['extraction.json'],
  'editorial-history.json': bytes['editorial-history.json'],
  'proposed-extraction.json': Buffer.from(`${JSON.stringify(checked.normalized, null, 2)}\n`),
  'dossier.json': Buffer.from(`${JSON.stringify(dossier, null, 2)}\n`),
  'blank-decision-seed.json': Buffer.from(`${JSON.stringify(dossier.decisionSeed, null, 2)}\n`),
};
const manifest = {
  status: 'INCOMPLETE: proposals only; blank seed is not a decision or approval',
  inputSha256: expected,
  outputSha256: Object.fromEntries(Object.entries(outputs).map(([name, content]) => [name, sha(content)])),
  fingerprints: dossier.decisionSeed.input,
  reviewEvidence: ['jinshu053-s0053-oath-philology-proposal-20261019-incomplete.md', 'jinshu053-s0053-independent-oath-review-20261019-incomplete.md', 'jinshu053-s0053-oath-proposal-v2-20261019-incomplete.md', 'jinshu053-s0053-oath-v2-independent-reassessment-20261019-incomplete.md'],
  stats: checked.stats,
  remaining: 'Genuine decision on this exact dossier, mention/candidate reconciliation, chronology, Jiang identity, source lacuna, remaining editorial work and publication gates. The interpretation of 許/當 remains explicitly qualified.',
};
assert(!fs.existsSync(out), 'Refusing existing destination');
fs.mkdirSync(out);
for (const [name, content] of Object.entries(outputs)) {
  fs.writeFileSync(`${out}/${name}`, content, { flag: 'wx' });
  assert.equal(sha(fs.readFileSync(`${out}/${name}`)), manifest.outputSha256[name]);
}
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(`${out}/manifest.json`, manifestBytes, { flag: 'wx' });
console.log(JSON.stringify({ out, manifestSha256: sha(manifestBytes), ...manifest }, null, 2));
