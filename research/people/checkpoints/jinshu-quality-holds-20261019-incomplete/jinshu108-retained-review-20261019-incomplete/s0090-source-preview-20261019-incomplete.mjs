// PRELIMINARY research preview only: does not write canonical files or approvals.
// Run once from the repository root; exclusive outputs refuse to overwrite.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { contentUnits, buildInputFingerprint } from '../../../../../../scripts/lib/people-content.mjs';
import { scanPeopleCandidates } from '../../../../../../scripts/lib/people-candidates.mjs';

const sourcePath = 'data/jinshu/108.json';
const prefix = 'data/people/generated/date-workflow/jinshu/108/s0090-source-preview-20261019-incomplete';
const expectedHash = '8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb';
const bytes = fs.readFileSync(sourcePath);
const hash = (v) => crypto.createHash('sha256').update(v).digest('hex');
if (hash(bytes) !== expectedHash) throw new Error('Pinned source bytes changed; do not apply this proposal.');
const original = JSON.parse(bytes);
const preview = structuredClone(original);
const originalUnits = contentUnits(original).map((u, order) => ({ ...u, order }));
const matches = contentUnits(preview).filter((u) => u.id === 's0090');
if (matches.length !== 1) throw new Error('Expected exactly one s0090');
const unit = matches[0].source;
if (unit.zh !== '廆懼，首服。' || unit.translations?.length !== 1) throw new Error('Unexpected source unit');
const translation = unit.translations[0];
if (translation.lang !== 'en' || translation.literal !== 'Tao in terror submitted.' || translation.idiomatic !== 'Tao groveled in terror.' || Object.hasOwn(translation, 'footnote')) throw new Error('Unexpected original translation');
translation.literal = 'Hui was afraid and confessed.';
translation.idiomatic = 'Frightened, Hui confessed.';
translation.footnote = 'The Chinese text here names Hui (廆). A version labelled as the Siku Quanshu text reads Tao (燾), which fits the surrounding account in which Hui confronts Tao.';

// Enforce no unintended change anywhere, including existing translator/model attribution.
const restored = structuredClone(preview);
const restoredUnit = contentUnits(restored).find((u) => u.id === 's0090').source;
restoredUnit.translations[0].literal = 'Tao in terror submitted.';
restoredUnit.translations[0].idiomatic = 'Tao groveled in terror.';
delete restoredUnit.translations[0].footnote;
if (JSON.stringify(restored) !== JSON.stringify(original)) throw new Error('Unexpected changes outside the three proposed fields');
const previewUnits = contentUnits(preview).map((u, order) => ({ ...u, order }));
const scan = (units) => scanPeopleCandidates({ book: 'jinshu', chapter: '108', units });
const before = scan(originalUnits);
const after = scan(previewUnits);
const candidateId = (candidate) => candidate.id;
if (before.some((c) => !candidateId(c)) || after.some((c) => !candidateId(c))) throw new Error('Candidate IDs missing');
const beforeMap = new Map(before.map((c) => [candidateId(c), c]));
const afterMap = new Map(after.map((c) => [candidateId(c), c]));
const removed = before.filter((c) => !afterMap.has(candidateId(c)));
const added = after.filter((c) => !beforeMap.has(candidateId(c)));
const modified = after.filter((c) => beforeMap.has(candidateId(c)) && JSON.stringify(beforeMap.get(candidateId(c))) !== JSON.stringify(c)).map((c) => ({ before: beforeMap.get(candidateId(c)), after: c }));
const encoded = `${JSON.stringify(preview, null, 2)}\n`;
const report = {
  status: 'preliminary-unapproved-source-preview',
  warning: 'No canonical changes. Existing translator/model metadata is unchanged, inherited metadata and does not attribute or approve this proposed edit.',
  sourcePath, sourceSha256: expectedHash, previewSha256: hash(encoded),
  beforeInput: buildInputFingerprint(originalUnits), afterInput: buildInputFingerprint(previewUnits),
  beforeCount: before.length, afterCount: after.length, removed, added, modified,
  limitations: 'Whole-chapter candidate scan compares idiomatic English; it does not scan footnotes or independently validate identities, translation, dates, backlink rendering, or ebook output.',
};
const outPreview = `${prefix}.json`;
const outReport = `${prefix}-scanner-delta.json`;
if (fs.existsSync(outPreview) || fs.existsSync(outReport)) throw new Error('Output already exists; preserve existing evidence');
fs.writeFileSync(outPreview, encoded, { flag: 'wx' });
fs.writeFileSync(outReport, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ preview: outPreview, delta: outReport, previewSha256: report.previewSha256, beforeCount: before.length, afterCount: after.length, removed: removed.length, added: added.length, modified: modified.length }, null, 2));
