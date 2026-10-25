import assert from 'node:assert/strict';
import { baselineApi, prepareOwnershipPlan, hash, changedRecords, guardOwnershipDelta, invalidateWholeDecisions } from './lib/people-ownership-plan.mjs';
const root = process.cwd(), commit = '30e2e9700c2494e6e7abcefeb53b19c24f7197c1', book = 'jiutangshu', chapter = '029';
const api = await baselineApi(root, commit), parse = b => JSON.parse(b.toString());
const encode = x => Buffer.from(JSON.stringify(x)), clone = x => JSON.parse(JSON.stringify(x));
const sourceBytes = api.read(`data/${book}/${chapter}.json`), beforeBytes = api.read(`data/people/extractions/${book}/${chapter}.json`), before = parse(beforeBytes);
const packet = api.p.buildPeopleExtractionPacket(book, chapter, { chapterData: parse(sourceBytes) });
const expanded = api.v.validateCompactPeopleExtraction(before, packet, { strictAliasDispositions: true }).normalized;
let count = 0;
function check(label, fn) { fn(); count++; console.log(`ok ${count} ${label}`); }
async function rejects(label, args, pattern) { await assert.rejects(prepareOwnershipPlan(args), pattern); count++; console.log(`ok ${count} ${label}`); }
function inputs(candidate = clone(before)) {
  // Source-backed metadata correction fixture; not a historical approval.
  const owner = candidate.people.find(p => p[0] === 'p060');
  owner[3] = 'Tang imperial ancestor';
  for (const row of [...owner[5], ...owner[6]]) row[2] = row[2].filter(unit => unit !== 's0107');
  for (const row of candidate.claims.filter(c => c[0] === 'p060')) row[4] = row[4].filter(unit => unit !== 's0107');
  const candidateBytes = encode(candidate), scope = { commit, book, chapter, sourceSha256: hash(sourceBytes), extractionSha256: hash(beforeBytes), candidateSha256: hash(candidateBytes) };
  const after = api.v.validateCompactPeopleExtraction(parse(candidateBytes), packet, { strictAliasDispositions: true }).normalized;
  const deltas = clone(api.d.computeCurationDrift(api.d.parseCurationDriftJson(JSON.stringify(before)), api.d.parseCurationDriftJson(candidateBytes.toString()))), changed = changedRecords(expanded, after);
  const lineage = changed.before.map(record => ({ kind: record.kind, before: [record.locator], after: changed.after.filter(r => r.kind === record.kind && (r.kind === 'claim' ? r.value.subject === record.value.subject && r.value.predicate === record.value.predicate : r.value.person === record.value.person)).map(r => r.locator), reason: 'Partition the misowned Jin evidence from the retained Tang evidence.' }));
  const proposal = { schemaVersion: 1, input: scope, authorId: 'offline-author', affectedPeople: ['p060'], deltas, changedRecords: changed, lineage };
  const proposalBytes = encode(proposal);
  const review = { schemaVersion: 1, input: { ...scope, proposalSha256: hash(proposalBytes) }, reviewerId: 'offline-independent-reviewer', reviewedAt: '2026-10-25T00:00:00Z', status: 'approved', findings: [], deltas, changedRecords: changed, lineage,
    deltaChecks: deltas.map(delta => ({ delta, reason: 'Fixture metadata distinguishes the Tang ancestor in the exact source.', units: ['s0114'], quotes: ['其弘農府君、宣、光二帝'] })), evidenceChecks: changed.after.map(record => { const units = record.kind === 'claim' ? record.value.evidence.map(id => id.split(':').at(-1)) : [record.value.unit]; return { record, reason: 'The retained evidence identifies the Tang ancestor, separately from Jin Xuan.', units, quotes: units.map(id => packet.units.find(u => u.id === id).zh) }; }) };
  const reviewBytes = encode(review), pins = { sourceSha256: hash(sourceBytes), extractionSha256: hash(beforeBytes), candidateSha256: hash(candidateBytes), proposalSha256: hash(proposalBytes), reviewSha256: hash(reviewBytes) };
  return { root, commit, book, chapter, candidateBytes, proposalBytes, reviewBytes, pins };
}
function modify(args, field, fn) { const next = { ...args, pins: { ...args.pins } }, x = JSON.parse(next[field]); fn(x); next[field] = encode(x); next.pins[field.replace('Bytes', 'Sha256')] = hash(next[field]); return next; }
const good = inputs(), plan = await prepareOwnershipPlan(good);
check('verified extraction-only plan is deterministic and contains no date write', () => { assert.equal(plan.status, 'extraction-ready-only'); assert(plan.changes.every(x => x.path.startsWith('data/people/extractions/') || x.path.startsWith('data/people/resolutions/') || x.path.startsWith('data/people/ownership-repairs/'))); assert.equal(plan.changes[0].contentBase64, good.candidateBytes.toString('base64')); const receipt = plan.changes.at(-1); assert.equal(receipt.beforeSha256, null); assert.equal(hash(Buffer.from(receipt.contentBase64, 'base64')), plan.receiptSha256); });
check('complete merge decision removed; unrelated decision retained', () => { const unrelated = { decision: 'merge', localPeople: ['b:001:p001', 'b:001:p002'] }, bad = { decision: 'merge', localPeople: ['a:001:p001', 'b:001:p003', 'c:001:p004'] }; const result = invalidateWholeDecisions({ decisions: [bad, unrelated] }, new Set(['a:001:p001'])); assert.deepEqual(result.removed, [bad]); assert.deepEqual(result.document.decisions, [unrelated]); assert.equal(invalidateWholeDecisions({ decisions: [bad] }, new Set(['a:001:p001'])).document.decisions.length, 0); });
assert.deepEqual(await prepareOwnershipPlan(good), plan); count++; console.log(`ok ${count} deterministic read-only replay`);
for (const role of ['source', 'extraction', 'candidate', 'proposal', 'review']) await rejects(`stale ${role} pin`, { ...good, pins: { ...good.pins, [`${role}Sha256`]: 'sha256:bad' } }, /Stale/);
await rejects('self review', modify(good, 'reviewBytes', x => x.reviewerId = 'offline-author'), /Independent/);
await rejects('unreviewed delta', modify(good, 'reviewBytes', x => x.deltas = []), /exact deltas/);
await rejects('no delta source review', modify(good, 'reviewBytes', x => x.deltaChecks = []), /Every semantic/);
await rejects('missing reviewed ownership lineage', modify(good, 'reviewBytes', x => x.lineage = []), /exact ownership lineage/);
await rejects('unsupported source quote', modify(good, 'reviewBytes', x => x.deltaChecks[0].quotes = ['invented']), /Unsupported delta/);
await rejects('unsupported affected ID', modify(good, 'proposalBytes', x => x.affectedPeople = ['p999999']), /Review scope/);
const after = clone(before); after.people.find(p => p[0] === 'p060')[3] = 'Tang imperial ancestor';
check('inbound related-person hints may change only affected references', () => { const bad = clone(after); bad.people[0][4].r.push('p060'); guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded); bad.people[0][4].r.push('p999999'); assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /Unrelated/); });
check('unrelated person mutation', () => { const bad = clone(after); bad.people[0][3] = 'changed'; assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /Unrelated/); });
check('lost source occurrence', () => { const bad = clone(expanded); bad.mentions.pop(); assert.throws(() => guardOwnershipDelta(before, after, new Set(['p060']), expanded, bad), /source occurrences/); });
check('existing person lost', () => { const bad = clone(after); bad.people.pop(); assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /person ID lost/); });
check('unsupported new ID', () => { const bad = clone(after), p = clone(bad.people[0]); p[0] = 'unsafe'; bad.people.push(p); assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /Unsupported person ID/); });
check('changed extraction source fingerprint', () => { const bad = clone(after); bad.input.chapterFingerprint = 'sha256:bad'; assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /Changed source/); });
check('changed extractor provenance', () => { const bad = clone(after); bad.run.model = 'other'; assert.throws(() => guardOwnershipDelta(before, bad, new Set(['p060']), expanded, expanded), /Changed source/); });
check('production rejects invalid candidate', () => { const bad = parse(encode(after)); bad.surfaces[0][0] = 'p999999'; assert.throws(() => api.v.validateCompactPeopleExtraction(bad, packet, { strictAliasDispositions: true })); });
console.log(`${count} focused offline checks passed; no canonical files written.`);
