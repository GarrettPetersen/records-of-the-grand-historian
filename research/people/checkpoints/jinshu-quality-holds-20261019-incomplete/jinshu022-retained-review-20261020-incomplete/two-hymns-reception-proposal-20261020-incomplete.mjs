import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

// Research-only proposal. This does not apply changes or approve any gate.
const dir = 'data/people/generated/date-workflow/jinshu/022/';
const extractionPath = dir + 'cumulative-ritual-hymn-candidate-20261020-incomplete.json';
const sourcePath = 'data/jinshu/022.json';
const outputPath = dir + 'two-hymns-reception-proposal-20261020-incomplete.json';
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const extractionSha256 = '01d03455ea8ebadd823b7edbc63eccae5bd24150995efa4d809767a2aabdcfe3';
const sourceSha256 = '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38';
if (sha(extractionPath) !== extractionSha256 || sha(sourcePath) !== sourceSha256) throw new Error('Pinned source or candidate has changed');
const extraction = JSON.parse(readFileSync(extractionPath));
const source = JSON.parse(readFileSync(sourcePath));
const units = Object.fromEntries(source.content.flatMap(p => p.sentences ?? []).map(s => [s.id, s.zh]));
const specifications = [
  { index: 438, person: 'p066', unit: 's0284', title: '於赫篇', subject: '武帝' },
  { index: 444, person: 'p067', unit: 's0285', title: '巍巍篇', subject: '文帝' },
];
const changes = specifications.map(({ index, person, unit, title, subject }) => {
  const before = extraction.claims[index];
  if (!before || before[0] !== person || before[1] !== 'work-association' || before[2].work.zh !== title || before[2].relation !== 'subject-of' || before[2].receptionType !== 'posthumous' || !isDeepStrictEqual(before[4], [unit]) || !units[unit].includes(title) || !units[unit].includes(subject)) throw new Error(`Unexpected row or source at ${index}`);
  const after = structuredClone(before);
  after[2].receptionType = 'retrospective';
  const inverse = structuredClone(after);
  inverse[2].receptionType = 'posthumous';
  if (!isDeepStrictEqual(before, inverse)) throw new Error(`Non-category change at ${index}`);
  return { zeroBasedIndex: index, before, after, evidence: { unit, chinese: units[unit] } };
});
writeFileSync(outputPath, JSON.stringify({
  status: 'incomplete research proposal; not a date, identity, editorial, or publication approval',
  extractionPath, extractionSha256, sourcePath, sourceSha256,
  evidence: 's0279–s0283 set out inherited music, Taihe-era tune revision, and subsequent changes to ceremonial songs; s0284–s0285 state the hymn subjects. Both are narrowly classified as later reception, not events establishing when the subject lived. Prior independent source-label review is hymn-held-claims-independent-review-20261020-incomplete.md.',
  limitations: ['The exact date of song composition or performance is not established here.', 'No inference about a death date is made. The identity of the Wu and Wen subjects across dynasties remains for independent verification.', 'Retrospective is the only accepted receptionType. This category does not assert that a subject had died.', 'No date field, certainty, source citation, companion event claim, identity, translation, or other extraction field is changed.', 'The full candidate still requires integrated validation, fresh independent date audit, identity and editorial review, and publication gates.'],
  changes,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ outputPath, sha256: sha(outputPath), changes: changes.length }));
