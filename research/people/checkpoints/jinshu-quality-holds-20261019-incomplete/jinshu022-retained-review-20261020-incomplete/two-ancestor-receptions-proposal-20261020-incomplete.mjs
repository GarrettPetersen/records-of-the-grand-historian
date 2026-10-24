import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const path = dir + 'seven-receptions-composed-candidate-20261020-incomplete.json';
const bytes = readFileSync(path);
const fingerprint = createHash('sha256').update(bytes).digest('hex');
if (fingerprint !== '6f664654b5c0a8758dc467f5c94a41a0e042e178f4aa719c6fb79c5dc6466068') throw new Error('Candidate changed');
const candidate = JSON.parse(bytes);
const targets = [[571, 'p083', 's0388'], [590, 'p085', 's0396']];
const changes = targets.map(([index, person, unit]) => {
  const before = candidate.claims[index];
  const expected = [person, 'event-participation', {kind: 'posthumous-commemoration', role: 'honoree'}, 'strongly-inferred', [unit]];
  if (!isDeepStrictEqual(before, expected)) throw new Error(`Unexpected claim ${index}`);
  const after = structuredClone(before);
  after[2].kind = 'retrospective-reference';
  return {index, before, after};
});
const output = dir + 'two-ancestor-receptions-proposal-20261020-incomplete.json';
writeFileSync(output, JSON.stringify({status: 'incomplete research proposal, not approval', candidate: path, candidateSha256: fingerprint, changes, evidence: ['s0388 皇皇顯祖 refers to an illustrious ancestor in the hymn; s0389–s0391 continue its praise.', 's0396 穆穆烈考 names an ancestral father, with s0397–s0399 describing the founding of Jin.', 'Source-backed category only. Assignments of each epithet to the extracted person and any inferred identity or temple name remain open; do not infer exact hymn dates.', 'See hymn-held-claims-source-proposals-20261020-incomplete.md and hymn-held-claims-independent-review-20261020-incomplete.md for independent earlier assessments.']}, null, 2) + '\n', {flag: 'wx'});
console.log(output);
