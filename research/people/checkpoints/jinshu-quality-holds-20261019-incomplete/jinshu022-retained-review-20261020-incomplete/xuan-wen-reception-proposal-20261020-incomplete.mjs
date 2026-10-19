import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data/people/generated/date-workflow/jinshu/022';
const input = join(dir, 'cumulative-ritual-hymn-candidate-20261020-incomplete.json');
const output = join(dir, 'xuan-wen-reception-candidate-20261020-incomplete.json');
const bytes = readFileSync(input);
const expectedHash = '01d03455ea8ebadd823b7edbc63eccae5bd24150995efa4d809767a2aabdcfe3';
if (createHash('sha256').update(bytes).digest('hex') !== expectedHash) throw new Error('Input fingerprint changed; stop and re-review.');
const candidate = JSON.parse(bytes);
for (const [index, person, other] of [[915, 'p047', 'p048'], [916, 'p048', 'p047']]) {
  const row = candidate.claims[index];
  if (row?.[0] !== person || row[1] !== 'event-participation' || row[2]?.otherPersonId !== other || row[2]?.kind !== 'posthumous-reference' || row[2]?.receptionType !== 'posthumous' || row[2]?.action !== 'credited-with-pacifying-and-founding-statutes') throw new Error(`Unexpected claim ${index}; stop and re-review.`);
  row[2].kind = 'retrospective-reference';
  row[2].receptionType = 'retrospective';
}
writeFileSync(output, `${JSON.stringify(candidate, null, 2)}\n`, { flag: 'wx' });
