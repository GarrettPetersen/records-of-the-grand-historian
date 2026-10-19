// Reconcile a source-scoped research hold in an isolated research draft only.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../../../scripts/lib/people-editorial-decisions.mjs';
const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const input = `${root}/jinshu053-anonymous-son-proposal-v2-20261019-incomplete`;
const output = `${root}/jinshu053-anonymous-son-proposal-v3-20261019-incomplete`;
const digest = b => createHash('sha256').update(b).digest('hex');
function read(name, expected) { const bytes = fs.readFileSync(`${input}/${name}`); if (expected) assert.equal(digest(bytes), expected, `unexpected ${name}`); return JSON.parse(bytes); }
const source = read('source.json', 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d');
const extraction = read('extraction.json', 'ebf3b0cc4fef72a8561c98a51913bfbc0177924c09d96b50869cb1568cf24475');
const history = read('editorial-history.json', 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7');
const decisions = read('review-decisions.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
const before = structuredClone(extraction);
const one = (xs, key, id) => { const a = xs.filter(x => x[key] === `jinshu:053:${id}`); assert.equal(a.length, 1, id); return a[0]; };
const jun = one(extraction.people, 'localId', 'p027');
assert.deepEqual(jun.identityHints.activeDateHints, ['AD 299']); jun.identityHints.activeDateHints = [];
const death = one(extraction.claims, 'id', 'c0528');
assert.deepEqual(death.value, { manner: 'interrogated-to-death', dateContext: { sourceDate: { text: '十二月' }, westernYear: { era: 'AD', year: 299, precision: 'year' } } });
assert.deepEqual(death.evidence, ['jinshu:053:s0065']);
death.value.dateContext = { sourceDate: { text: '十二月' }, unresolved: true, unresolvedReason: 'The preceding December heading and its regnal year require independent review for whether they govern Jiang Jun’s interrogation and death.' };
death.evidence = ['jinshu:053:s0044', 'jinshu:053:s0045', 'jinshu:053:s0065'];
const result = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const changes = [];
for (const [section, key] of [['people', 'localId'], ['claims', 'id']]) for (const item of result.normalized[section]) { const old = before[section].find(x => x[key] === item[key]); if (JSON.stringify(old) !== JSON.stringify(item)) changes.push({ section, id: item[key], before: old ?? null, after: item }); }
assert.deepEqual(changes.map(x => x.id), ['jinshu:053:p027', 'jinshu:053:c0528']);
assert(!fs.existsSync(output)); fs.mkdirSync(output);
const delta = { status: 'incomplete; independent exact-output and chronology review required', input, chapterFingerprint: packet.input.chapterFingerprint, independentReview: `${root}/jinshu053-anonymous-son-v2-independent-review-20261019-incomplete.md`, rationale: 'Remove the unverified Western year and active-date hint while retaining the explicit death event and a research hold for its possible inherited December context; no date approval is implied.', unresolved: ['Month/year conversion and whether the December heading governs this death need independent source review', 's0053 translation requires a separate editorial proposal and independent review', 'Jiang identities, anonymous son versus Bin, Bin lacuna, complete editorial coverage, date and identity audits and publication gates'], changes, validationStats: result.stats };
for (const [name, value] of Object.entries({ 'source.json': source, 'extraction.json': result.normalized, 'editorial-history.json': history, 'review-decisions.json': decisions, 'anonymous-son-v3-delta.json': delta })) { const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`); fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' }); console.log(`${name} ${digest(bytes)}`); }
console.log(JSON.stringify({ output, changedRecords: changes.map(x => x.id), stats: result.stats }, null, 2));
