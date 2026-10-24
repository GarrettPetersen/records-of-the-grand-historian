import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '../../../../../../scripts/lib/people-candidates.mjs';

// Research preview only: this deliberately does not update canonical source or extraction.
const inputPath = 'data/jinshu/022.json';
const outputPath = 'data/people/generated/date-workflow/jinshu/022/yingchuan-source-working-candidate-20261020-incomplete.json';
const reportPath = 'data/people/generated/date-workflow/jinshu/022/yingchuan-source-working-scanner-delta-20261020-incomplete.json';
const bytes = readFileSync(inputPath);
const digest = value => createHash('sha256').update(value).digest('hex');
const expected = '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38';
if (digest(bytes) !== expected) throw new Error('Source changed since review; stop rather than overwrite.');
const source = JSON.parse(bytes);
const candidate = structuredClone(source);
const changes = {
  s0232: { zh: '于邈先後，實司於天。', literal: 'Ah, distant former lord, truly attending to Heaven.', idiomatic: 'How distant our former lord, who truly serves Heaven.' },
  s0233: { zh: '顯矣皇祖，帝祉肇臻。', literal: 'Manifest is the august ancestor; the Lord’s blessings first arrive.', idiomatic: 'Radiant is our august ancestor; the Lord’s blessings begin to arrive.' },
};
const seen = new Set();
for (const paragraph of candidate.content) for (const sentence of paragraph.sentences ?? []) {
  const change = changes[sentence.id];
  if (!change) continue;
  if (seen.has(sentence.id) || sentence.zh !== change.zh) throw new Error(`Unexpected unit ${sentence.id}`);
  const english = sentence.translations.filter(t => t.lang === 'en');
  if (english.length !== 1) throw new Error(`Unexpected translation count at ${sentence.id}`);
  english[0].literal = change.literal;
  english[0].idiomatic = change.idiomatic;
  seen.add(sentence.id);
}
if (seen.size !== Object.keys(changes).length) throw new Error('Missing required unit');
const matcher = loadProperNounMatcher();
const before = buildPeopleExtractionPacket('jinshu', '022', { chapterData: source, properNounMatcher: matcher });
const after = buildPeopleExtractionPacket('jinshu', '022', { chapterData: candidate, properNounMatcher: matcher });
const changed = before.input.unitDigests.filter((item, index) => JSON.stringify(item) !== JSON.stringify(after.input.unitDigests[index])).map(item => item.id);
if (JSON.stringify(changed) !== JSON.stringify(['s0232', 's0233'])) throw new Error(`Unexpected fingerprint changes: ${changed}`);
const ids = new Set(Object.keys(changes));
const select = packet => packet.preflight.candidates.filter(c => ids.has(c.unit));
const encoded = `${JSON.stringify(candidate, null, 2)}\n`;
const report = {
  status: 'working preview only; not an editorial, date, identity, or publication approval',
  sourceSha256: expected,
  candidateSha256: digest(encoded),
  before: { chapterFingerprint: before.input.chapterFingerprint, chineseFingerprint: before.input.chineseFingerprint, englishFingerprint: before.input.englishFingerprint, candidates: select(before) },
  after: { chapterFingerprint: after.input.chapterFingerprint, chineseFingerprint: after.input.chineseFingerprint, englishFingerprint: after.input.englishFingerprint, candidates: select(after) },
  changedUnits: changed,
};
writeFileSync(outputPath, encoded, { flag: 'wx' });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ outputPath, reportPath, sourceSha256: expected, candidateSha256: report.candidateSha256, beforeCandidates: report.before.candidates.length, afterCandidates: report.after.candidates.length }, null, 2));
