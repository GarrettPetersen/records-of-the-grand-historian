// Recovery-only revision; no canonical or retained workflow files are changed.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const input = 'research/people/jinshu025-combined-cap-candidate-20261019-incomplete.json';
const output = 'research/people/jinshu025-combined-cap-hint-cleared-20261019-incomplete.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const original = readFileSync(input);
if (hash(original) !== '623c9c9595499fe1731e400aae48849103c4f390b057e1beebe2a6e150eff373') throw new Error('Unexpected combined candidate bytes');
const candidate = JSON.parse(original);
const person = candidate.people[51];
if (person[0] !== 'p052' || JSON.stringify(person[4].a) !== JSON.stringify(['one reported high-mountain cap alteration, bounded by Cao Wei Mingdi’s reign: AD 226–AD 239'])) throw new Error('Unexpected cap date hint');
if (candidate.claims[161][2].unresolved !== true || candidate.claims[162][2].dateContext.unresolved !== true) throw new Error('Cap claim chronology no longer unresolved');
person[4].a = [];
const result = Buffer.from(`${JSON.stringify(candidate, null, 2)}\n`);
writeFileSync(output, result, { flag: 'wx' });
console.log(`${output} sha256:${hash(result)}; incomplete, not approved or publishable`);
