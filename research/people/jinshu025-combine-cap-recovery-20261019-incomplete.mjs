// Recovery-only materialization. Never copy this output into canonical paths.
// The retained input and staging checkpoint are intentionally left untouched.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const staging = '35bcdb2e607ebdda30520a3caa9c99798699da91';
const basePath = 'research/people/checkpoints/jinshu025-seal-conflict-qualified-incomplete-20261019/candidate.json';
const capPath = 'research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/jinshu025-cap-candidate-20261020-incomplete/candidate.json';
const output = 'research/people/jinshu025-combined-cap-candidate-20261019-incomplete.json';
const capBytes = execFileSync('git', ['show', `${staging}:${capPath}`], { maxBuffer: 5_000_000 });
const baseBytes = execFileSync('git', ['show', `${staging}:${basePath}`], { maxBuffer: 5_000_000 });
const hash = value => createHash('sha256').update(value).digest('hex');
if (hash(capBytes) !== 'af559fad13a77399c75070553907c4d074c1a6f6d7434d710b0c9777907d6a5d') throw new Error('Staged cap candidate mismatch');
if (hash(baseBytes) !== '8b0de4378494cb75542392033d582a826b820b77a10b8923555817e2c6f32d07') throw new Error('Seal candidate mismatch');
const cap = JSON.parse(capBytes);
const base = JSON.parse(baseBytes);
const rows = [161, 162].map(i => structuredClone(cap.claims[i]));
if (rows[0][0] !== 'p052' || rows[0][1] !== 'attestation' || rows[1][0] !== 'p052' || rows[1][1] !== 'event-participation') throw new Error('Unexpected staged cap claims');
if (rows[0][2].event !== 'Cao Rui ordered the high-mountain cap made lower because its form resembled the tongtian and far-roaming caps' || rows[1][2].action !== 'ordered the high-mountain cap made lower because its form resembled the tongtian and far-roaming caps') throw new Error('Unexpected reviewed cap wording');
if (base.claims[161][0] !== 'p052' || base.claims[161][1] !== 'attestation' || base.claims[162][0] !== 'p052' || base.claims[162][1] !== 'event-participation') throw new Error('Unexpected seal claims');
base.claims[161] = rows[0];
base.claims[162] = rows[1];
const bytes = Buffer.from(`${JSON.stringify(base, null, 2)}\n`);
writeFileSync(output, bytes, { flag: 'wx' });
console.log(`${output} sha256:${hash(bytes)}; incomplete, not approved or publishable`);
