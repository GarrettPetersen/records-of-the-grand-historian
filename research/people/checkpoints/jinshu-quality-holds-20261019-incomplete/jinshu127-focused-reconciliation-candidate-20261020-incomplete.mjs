// Research-only proposed corrections to two source-reviewed reconciliation errors.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = process.env.JINSHU127_REVIEW_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw new Error('An exact staging-derived fixture is required');
const { validateCompactPeopleExtraction } = await import(pathToFileURL(path.join(fixture, 'scripts/validate-people-extraction.mjs')).href);
const sha = value => createHash('sha256').update(value).digest('hex');
const inputs = [
  ['jinshu127-focused-reviewed-materialized-20261020-incomplete/extraction.json', 'f4cb3edee8fd984ef1ae1239a1d8ffed0054e26cf47f478af739118131ccfd0f'],
  ['jinshu127-focused-reviewed-materialized-20261020-incomplete/packet.json', 'dff2f301a4eead9c56c031ecb50c02d9b1f2973988ed578b9178d76134f467f6'],
];
const read = ([name, hash]) => { const b = fs.readFileSync(path.join(dir, name)); if (sha(b) !== hash) throw new Error(`Changed input: ${name}`); return JSON.parse(b); };
const [original, packet] = inputs.map(read);
const revised = structuredClone(original);
function removeCandidate(reason, id, expectedNote) {
  const groups = revised.candidateDispositions.filter(group => group[0] === 'not-person' && group[1] === reason);
  if (groups.length !== 1) throw new Error(`Unexpected group ${reason}`);
  const index = groups[0][2].findIndex(item => item[0] === id && item[1] === expectedNote);
  if (index < 0 || groups[0][2].filter(item => item[0] === id).length !== 1) throw new Error(`Missing exact candidate ${id}`);
  groups[0][2].splice(index, 1);
}
removeCandidate('polity', 'cand_b79e43b7adcb8ce4', 'Jin');
removeCandidate('place', 'cand_2d07edf4384f74af', '漢城');
const nonName = revised.candidateDispositions.filter(group => group[0] === 'not-person' && group[1] === 'not-a-name');
if (nonName.length !== 1) throw new Error('Unexpected not-a-name group');
nonName[0][2].push(['cand_2d07edf4384f74af', 'Scanner span crosses the Han dynasty identifier 漢 and the beginning of Chengyang 城陽; it is not a place or person name.']);
if (revised.surfaces.some(row => row[0] === 'p125' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'Jin')) throw new Error('Unexpected existing Jin mention');
revised.surfaces.push(['p125', 'personal-name', 'en', 'Jin', [['s0213', [1]]]]);
const validated = validateCompactPeopleExtraction(revised, packet, { strictAliasDispositions: true });
const encoded = Buffer.from(`${JSON.stringify(revised, null, 2)}\n`);
const receipt = { status: 'research-only-needs-independent-review', baseExtractionSha256: inputs[0][1], packetSha256: inputs[1][1], proposedExtractionSha256: sha(encoded), stagingScriptsRevision: '4049df22ccbe5a5c62c60ba8589607c55866e93a', changes: ['s0213 Jin: remove polity disposition and link p125 Xun Jin, occurrence 1', 's0205 漢城: replace unsupported place disposition with non-name cross-boundary scanner span'], checks: validated.stats, limitations: ['No canonical publication or whole-chapter approval.', 'Independent review must check these changes and all other reconciliation changes.', 'Paired-field and other known source defects remain unresolved.'] };
const out = path.join(dir, 'jinshu127-focused-reconciliation-candidate-20261020-incomplete');
fs.mkdirSync(out);
fs.writeFileSync(path.join(out, 'extraction.json'), encoded, {flag:'wx', mode:0o600});
fs.writeFileSync(path.join(out, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, {flag:'wx', mode:0o600});
console.log(JSON.stringify(receipt, null, 2));
