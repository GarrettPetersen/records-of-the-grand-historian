import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { buildPeopleExtractionPacket } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import { peopleForExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-validated-chapter.mjs';
import { peopleDigest } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-seal.mjs';
import { identitySourceEvidenceFingerprint } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-chapter-identity.mjs';
import { semanticIdentityEvidence, semanticIdentityFingerprint } from './semantic-identity-evidence-proposal.mjs';

const dir = new URL('.', import.meta.url).pathname, root = '/Users/garrettpetersen/records-of-the-grand-historian';
const read = file => JSON.parse(fs.readFileSync(file)), hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(inspectLocalDisk(root).errors.length, 0, 'Resource guard');
const matcher = loadProperNounMatcher(), contexts = new Map(), rows = [];
for (const chapter of ['108', '109']) {
  const load = old => {
    const source = read(old ? dir + 'before-amendments-' + chapter + '-source.json' : root + '/data/jinshu/' + chapter + '.json');
    const raw = read(old ? dir + 'before-amendments-' + chapter + '-extraction.json' : root + '/data/people/extractions/jinshu/' + chapter + '.json');
    const packet = buildPeopleExtractionPacket('jinshu', chapter, { chapterData: source, chapterFile: root + '/data/jinshu/' + chapter + '.json', properNounMatcher: matcher });
    const { normalized: extraction } = validateCompactPeopleExtraction(raw, packet, { strictAliasDispositions: chapter === '109' });
    return { packet, localPeople: peopleForExtraction(extraction) };
  };
  const before = load(true), after = load(false);
  assert.deepEqual([...before.localPeople.keys()].sort(), [...after.localPeople.keys()].sort());
  const changedRaw = [], changedSemantic = [], changedDimensions = {};
  for (const [id, person] of before.localPeople) {
    const current = after.localPeople.get(id), a = semanticIdentityEvidence(person, before.packet), b = semanticIdentityEvidence(current, after.packet);
    if (identitySourceEvidenceFingerprint(person, before.packet) !== identitySourceEvidenceFingerprint(current, after.packet)) changedRaw.push(id);
    if (peopleDigest(a) !== peopleDigest(b)) {
      changedSemantic.push(id);
      changedDimensions[id] = Object.keys(a).filter(key => peopleDigest(a[key]) !== peopleDigest(b[key]));
    }
  }
  contexts.set('jinshu:' + chapter, { before, after });
  rows.push({ chapter, people: before.localPeople.size, changedRaw: changedRaw.length, changedSemantic, changedDimensions });
}
const packet = read(dir + 'source-review-packet.json'), plan = read(dir + 'plan.json');
const oldPeople = new Map(packet.people.map(p => [p.localId, p]));
const originalUnits = person => ({ units: packet.units.filter(u => u.book === person.book && u.chapter === person.chapter) });
const needed = new Set();
for (let part = 1; part <= 3; part++) for (const review of read(dir + 'part-' + String(part).padStart(3, '0') + '-report.json').reviews) {
  const item = plan.cases.find(c => c.id === review.caseId); assert(item);
  for (const id of [...item.localPeople, item.canonicalMembership.anchorLocalId, ...review.sourceWitnesses.map(w => w.localId)]) needed.add(id);
}
const externalScopes = [...new Set([...needed].map(id => id.split(':').slice(0, 2).join(':')))].filter(key => !contexts.has(key)).sort();
const externalInputs = [];
for (const key of externalScopes) {
  assert.equal(inspectLocalDisk(root).errors.length, 0, 'Resource guard before source validation');
  const [book, chapter] = key.split(':'), sourcePath = 'data/' + book + '/' + chapter + '.json', extractionPath = 'data/people/extractions/' + book + '/' + chapter + '.json';
  const sourceBytes = fs.readFileSync(root + '/' + sourcePath), extractionBytes = fs.readFileSync(root + '/' + extractionPath);
  const nativePacket = buildPeopleExtractionPacket(book, chapter, { chapterData: JSON.parse(sourceBytes), chapterFile: root + '/' + sourcePath, properNounMatcher: matcher });
  const { normalized: extraction } = validateCompactPeopleExtraction(JSON.parse(extractionBytes), nativePacket, { strictAliasDispositions: false });
  const after = { packet: nativePacket, localPeople: peopleForExtraction(extraction) };
  // Original review evidence is compared directly below; pin actual current
  // bytes too, so this diagnostic cannot silently become a mutable approval.
  contexts.set(key, { after });
  externalInputs.push({ scope: key, sourceSha256: hash(sourceBytes), extractionSha256: hash(extractionBytes), nativeValidated: true });
}
let checks = 0;
for (const person of packet.people) {
  const context = contexts.get(person.book + ':' + person.chapter);
  if (context?.before) { assert.equal(identitySourceEvidenceFingerprint(person, originalUnits(person)), identitySourceEvidenceFingerprint(context.before.localPeople.get(person.localId), context.before.packet), 'Original/native before evidence mismatch ' + person.localId); checks++; }
}
const caseRows = [];
for (let part = 1; part <= 3; part++) {
  const prefix = 'part-' + String(part).padStart(3, '0'), reportBytes = fs.readFileSync(dir + prefix + '-report.json');
  const report = JSON.parse(reportBytes), capture = read(dir + prefix + '-capture.json');
  assert.equal(hash(reportBytes), capture.reportSha256.replace(/^sha256:/u, ''));
  assert.equal(report.reviewer.agentId, capture.agentId);
  for (const review of report.reviews) {
    const item = plan.cases.find(c => c.id === review.caseId); assert(item);
    const dependencies = [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId, ...review.sourceWitnesses.map(w => w.localId)])];
    const affected = [], externalUnverified = [];
    for (const id of dependencies) {
      const person = oldPeople.get(id); assert(person, 'Missing original reviewed person ' + id);
      const context = contexts.get(person.book + ':' + person.chapter);
      if (!context) { externalUnverified.push(id); continue; }
      if (semanticIdentityFingerprint(person, originalUnits(person)) !== semanticIdentityFingerprint(context.after.localPeople.get(id), context.after.packet)) affected.push(id);
    }
    caseRows.push({ caseId: item.id, localPeople: item.localPeople, actualReviewer: capture.agentId, originalReportSha256: hash(reportBytes), affected, externalUnverified,
      targetAndAnchorSemanticallyUnchanged: affected.length === 0, currentMembershipAndRetrievalVerified: false });
  }
}
const context = contexts.get('jinshu:109').before, person = context.localPeople.values().next().value;
const original = semanticIdentityFingerprint(person, context.packet), changed = mutate => { const p = structuredClone(person), packet = structuredClone(context.packet); mutate(p, packet); return semanticIdentityFingerprint(p, packet); };
const tests = [];
function test(name, mutate, equal) { assert.equal(changed(mutate) === original, equal, name); tests.push(name); }
test('incidental mention IDs and scanner references', p => { for (const m of p.mentions) { m.id += '-renumbered'; m.candidateRefs = ['changed-scanner-reference']; } }, true);
test('span geometry and English unit hashes after native revalidation', p => { for (const m of p.mentions) for (const spans of Object.values(m.spans)) for (const s of spans) { s.startCodePoint++; s.endCodePoint++; s.unitTextHash = 'new-current-English-hash'; } }, true);
test('claim IDs only', p => { for (const c of p.claims) c.id += '-renumbered'; }, true);
test('preferred name', p => { p.preferredNameSuggestion.en += ' Changed'; }, false);
test('historicity', p => { p.historicity = 'changed'; }, false);
test('descriptor', p => { p.descriptorSuggestion += ' changed'; }, false);
test('claim value', p => { p.claims[0].value = { changed: true }; }, false);
test('claim certainty', p => { p.claims[0].certainty = 'changed'; }, false);
test('claim multiplicity', p => { p.claims.push(structuredClone(p.claims[0])); }, false);
test('mention multiplicity', p => { p.mentions.push(structuredClone(p.mentions[0])); }, false);
assert.throws(() => changed(p => { p.mentions[0].person = 'jinshu:109:p999'; }), /attribution/u); tests.push('wrong mention attribution fails loudly');
test('mention exact name', p => { Object.values(p.mentions[0].spans).find(s => s.length)[0].exact += 'X'; }, false);
test('mention occurrence', p => { Object.values(p.mentions[0].spans).find(s => s.length)[0].occurrence++; }, false);
test('full primary Chinese context', (p, packet) => { const id = p.claims[0].evidence[0].split(':').at(-1); packet.units.find(u => u.id === id).zh += '異'; }, false);
assert.throws(() => changed(p => { p.mentions[0].unreviewedSemanticField = true; }), /Unknown/u); tests.push('unknown semantic field fails loudly');
const output = { schemaVersion: 1, kind: 'diagnostic-semantic-proof-reuse-proposal', at: new Date().toISOString(),
  productionAdopted: false, canonicalWrites: 0, originalApprovalsRetagged: false, chapterApproved: false,
  originalPacketSha256: hash(fs.readFileSync(dir + 'source-review-packet.json')), originalPlanFingerprint: plan.fingerprint,
  nativeValidatedChapters: rows, originalPacketPeopleMatchedToNativeBefore: checks,
  currentExternalSources: externalInputs,
  savedCases: caseRows.length, sourceUnchangedCases: caseRows.filter(r => r.targetAndAnchorSemanticallyUnchanged).length,
  sourceChangedCases: caseRows.filter(r => !r.targetAndAnchorSemanticallyUnchanged).length,
  caseRows, counterfactualChecks: tests,
  remainingRequired: ['Native proof composition preserving original raw report, plan, packet and actual producer hashes',
    'Current canonical membership, anchor versions and bounded retrieval validation', 'Immutable update of affected dossiers',
    'Independent code review and normal current date, identity, website, ebook, CI, deployment and live qualification'] };
fs.writeFileSync(dir + 'semantic-proof-reuse-diagnostic.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ chapters: rows.map(({ chapter, people, changedRaw, changedSemantic }) => ({ chapter, people, changedRaw, changedSemantic })),
  savedCases: output.savedCases, sourceUnchangedCases: output.sourceUnchangedCases, checks: tests.length,
  adopted: false, chapterApproved: false }));
