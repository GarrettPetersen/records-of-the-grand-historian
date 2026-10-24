// Research candidate only: do not change canonical files or retained workflows.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const input = 'research/people/jinshu025-combined-cap-hint-cleared-20261019-incomplete.json';
const output = 'research/people/jinshu025-seal-fuzi-holds-20261019-incomplete.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const original = readFileSync(input);
if (hash(original) !== '31d731f4029d9cc6e423111fff139a1be74d0398a773c19d0f83f9d3d89f2c99') throw new Error('Unexpected candidate bytes');
const candidate = JSON.parse(original);
const person = candidate.people.find(row => row[0] === 'p072');
const expectedHint = 'Reported wearing no earlier than BC 207, conditional on the Songshu/Jinshu seal tradition and the Qin-conquest chronology. The cited handbook dates entry to Xianyang to BC 207 in its timeline but Ziying’s surrender to early BC 206 in its narrative; competing accounts do not establish the physical seal’s identity.';
if (!person || JSON.stringify(person[4].a) !== JSON.stringify([expectedHint])) throw new Error('Unexpected seal hint');
const expectedAttestation = ['p072', 'attestation', { sourceDate: { text: '漢高祖佩之' }, westernBounds: { onOrAfter: { era: 'BC', year: 207, precision: 'year' } }, event: 'Han Gaozu wore the Lantian jade transmission seal' }, 'uncertain', ['s0537']];
const expectedSex = ['p051', 'sex', { sex: 'male' }, 'strongly-inferred', ['s0444']];
const exactIndex = expected => {
  const matches = candidate.claims.flatMap((row, index) => JSON.stringify(row) === JSON.stringify(expected) ? [index] : []);
  if (matches.length !== 1) throw new Error(`Expected one matching ${expected[0]} ${expected[1]} claim`);
  return matches[0];
};
const sealIndex = exactIndex(expectedAttestation);
const sexIndex = exactIndex(expectedSex);
if (candidate.claims.filter(row => row[0] === 'p072' && row[1] === 'attestation').length !== 1) throw new Error('Unexpected additional seal attestation');
person[4].a = [];
candidate.claims[sealIndex][2] = {
  sourceDate: { text: '漢高祖佩之' },
  unresolved: true,
  unresolvedReason: "Jinshu gives no year for Gaozu's wearing; the proposed BC 207 bound depends on contested seal traditions and reconstructions of the conquest chronology.",
  event: 'Han Gaozu wore the Lantian jade transmission seal',
};
candidate.claims.splice(sexIndex, 1);
const result = Buffer.from(`${JSON.stringify(candidate, null, 2)}\n`);
writeFileSync(output, result, { flag: 'wx' });
console.log(`${output} sha256:${hash(result)}; incomplete research hold, not approved or publishable`);
