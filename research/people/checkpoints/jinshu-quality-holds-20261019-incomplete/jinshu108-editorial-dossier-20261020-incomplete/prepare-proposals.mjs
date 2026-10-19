// Build an isolated, UNAPPROVED editorial input from the retained candidate.
// This does not edit a chapter, claim, lock, review decision, or workflow state.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '../../../../../../scripts/lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../../../scripts/lib/people-editorial-decisions.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function pinned(file, hash) {
  const bytes = fs.readFileSync(file);
  if (digest(bytes) !== hash) throw new Error(`Pinned input changed: ${file}`);
  return JSON.parse(bytes);
}
const source = pinned('data/jinshu/108.json', '8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb');
const candidate = pinned('data/people/generated/date-workflow/jinshu/108/candidate-2.json', 'c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413');
const preview = pinned('data/people/generated/date-workflow/jinshu/108/s0090-refined-source-v2-20261019-incomplete.json', '19f2cba5cb0902f9b63d950ac9c23d6f921b07d70276acf226f5b41beed50521');
const unit = (chapter) => chapter.content.flatMap(block => block.sentences ?? []).find(row => row.id === 's0090');
const before = unit(source), after = unit(preview);
if (before?.zh !== '廆懼，首服。' || after?.zh !== before.zh) throw new Error('Unexpected Chinese source');
const english = row => row.translations.find(translation => translation.lang === 'en');
const reason = 'The displayed Chinese reads 廆, Hui, and 首服 supports confessed; the alternate digital transcription is noted separately.';
for (const field of ['idiomatic', 'literal']) {
  const old = candidate.translationRepairs.filter(row => row[0] === 's0090' && row[1] === field);
  if (old.length !== 1 || old[0][6] !== 'applied' || old[0][3] !== english(before)[field] || english(before)[field] === english(after)[field]) {
    throw new Error(`Unexpected old repair chain for ${field}`);
  }
  candidate.translationRepairs.push(['s0090', field, english(before)[field], english(after)[field], reason, 'medium', 'proposed']);
}
const packet = buildPeopleExtractionPacket('jinshu', '108', { chapterData: source, properNounMatcher: loadProperNounMatcher() });
const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(JSON.parse(fs.readFileSync('data/people/editorial-decisions/jinshu/108.json')), result.normalized);
const out = 'data/people/generated/editorial-review/jinshu/108-s0090-recovery-20261020-incomplete/proposed-candidate.json';
const serialized = Buffer.from(`${JSON.stringify(candidate, null, 2)}\n`);
fs.writeFileSync(out, serialized, { flag: 'wx' });
console.log(JSON.stringify({ status: 'unapproved-proposal-only', path: out, sha256: digest(serialized), sourceFingerprint: packet.input.chapterFingerprint, stats: result.stats }));
