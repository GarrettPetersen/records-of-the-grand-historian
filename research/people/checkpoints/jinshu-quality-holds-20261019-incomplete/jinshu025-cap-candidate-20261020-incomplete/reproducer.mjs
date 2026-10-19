// Focused research candidate. Never publishes, edits a sealed packet or takes a lease.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../scripts/lib/people-date-audit.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';

const input = 'data/people/generated/date-workflow/jinshu/025';
const output = 'data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu025-cap-editorial-candidate-20261020-incomplete';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function read(path, expected) {
  const bytes = fs.readFileSync(path);
  assert.equal(digest(bytes), expected, `Unexpected bytes: ${path}`);
  return JSON.parse(bytes);
}
const candidate = read(`${input}/candidate-3.json`, '7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981');
const report = read(`${input}/review-3.json`, '31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9');
read('data/jinshu/025.json', 'e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60');
const original = structuredClone(candidate);
const packet = buildPeopleExtractionPacket('jinshu', '025');
validateCompactPeopleExtraction(original, packet, { strictAliasDispositions: true });
function replace(object, key, before, after) { assert.equal(object[key], before); object[key] = after; }
assert.equal(candidate.claims[161][0], 'p052');
assert.equal(candidate.claims[161][1], 'attestation');
assert.equal(candidate.claims[162][0], 'p052');
assert.equal(candidate.claims[162][1], 'event-participation');
replace(candidate.claims[161][2], 'event', 'Cao Rui ordered the high-mountain cap reserved for lower ranks', 'Cao Rui ordered the high-mountain cap made lower because its form resembled the tongtian and far-roaming caps');
replace(candidate.claims[161][2], 'unresolvedReason', 's0444 names 魏明帝 as the ruler who demoted the high-mountain cap but gives no reign year; AD 226–239 is the conventional Cao-Wei Mingdi span, not a conversion of 改令卑下.', 's0444 names 魏明帝 as the ruler who ordered the cap made lower but gives no reign year; AD 226–239 is the conventional Cao-Wei Mingdi span, not a conversion of 改令卑下.');
replace(candidate.claims[162][2], 'action', 'ordered the high-mountain cap reserved for lower ranks because it resembled imperial caps', 'ordered the high-mountain cap made lower because its form resembled the tongtian and far-roaming caps');
replace(candidate.claims[162][2].dateContext, 'unresolvedReason', 's0444 dates the demotion only by 魏明帝…改令卑下; AD 226–239 is the imported Mingdi reign, not a year in this unit.', 's0444 dates the order only by 魏明帝…改令卑下; AD 226–239 is the imported Mingdi reign, not a year in this unit.');
assert.equal(candidate.claims[161][2].unresolved, true);
assert.equal(candidate.claims[162][2].dateContext.unresolved, true);
const check = structuredClone(candidate);
check.claims[161] = structuredClone(original.claims[161]);
check.claims[162] = structuredClone(original.claims[162]);
assert.deepEqual(check, original, 'Unexpected changes outside the two targeted rows');
const validation = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
const datePacket = buildDateAuditPacket('jinshu', '025', { extraction: candidate });
assert.equal(datePacket.sourceHash, report.sourceHash);
const originalDate = buildDateAuditPacket('jinshu', '025', { extraction: original });
assert.equal(originalDate.extractionHash, report.extractionHash);
assert.notEqual(datePacket.extractionHash, report.extractionHash);
const decisions = JSON.parse(fs.readFileSync('data/people/editorial-decisions/jinshu/025.json'));
let editorialCheck;
try { validateAppliedEditorialDecisions(decisions, validation.normalized); editorialCheck = 'passed'; }
catch (error) { editorialCheck = `failed: ${error.message}`; }
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
const metadata = { status: 'incomplete research candidate; no date approval or permission to publish', sourceHash: datePacket.sourceHash, originalExtractionHash: originalDate.extractionHash, candidateExtractionHash: datePacket.extractionHash, priorReportStatus: report.status, priorReportByteSha256: '31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9', focusedReview: '240fd204:research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/jinshu025-cap-redesign-20261020-incomplete/independent-review.md', outputNeeds: ['independent exact-output and editorial decision consistency review', 'resolution of all existing research holds', 'fresh independent complete date audit on the new fingerprint', 'identity and publication gates'], knownAdditionalIssue: 'claim-160 includes externally sourced lifespan years in event prose despite an undated source citation; separately review before publication', validationStats: validation.stats, editorialCheck, geometry, changes: [161,162].map(i => ({ id: `claim-${i+1}`, before: original.claims[i], after: candidate.claims[i] })) };
assert(!fs.existsSync(output), 'Refusing to overwrite research output');
fs.mkdirSync(output);
const hashes = {};
for (const [name, obj] of Object.entries({ 'candidate.json': candidate, 'date-packet.json': datePacket, 'handoff.json': metadata })) {
  const bytes = Buffer.from(`${JSON.stringify(obj, null, 2)}\n`);
  fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' });
  hashes[name] = digest(bytes);
}
console.log(JSON.stringify({ output, hashes, ...metadata }, null, 2));
