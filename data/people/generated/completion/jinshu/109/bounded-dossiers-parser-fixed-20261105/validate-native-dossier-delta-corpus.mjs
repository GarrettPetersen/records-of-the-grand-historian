import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { pinnedIdentityChapterContext } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-pinned-identity-source.mjs';
import { readIdentityDossierRegistry } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-dossier-delta.mjs';
import { memberContract, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-dossiers.mjs';
import { localNameKeys } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-resolution.mjs';
import { loadProperNounMatcher } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import { peopleDigest } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-seal.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian', dir = new URL('.', import.meta.url).pathname;
const hash = bytes => createHash('sha256').update(bytes).digest('hex'), read = name => JSON.parse(fs.readFileSync(dir + name));
assert.equal(inspectLocalDisk(root).errors.length, 0);
const snapshot = read('reviewed-source-snapshot.json'), registry = dir + 'candidate-native-dossier-delta';
const context = pinnedIdentityChapterContext(root, snapshot.revision), index = await readIdentityDossierRegistry(registry, new Map());
try {
  assert.equal(index.provenance.revision, snapshot.revision);
  const matcher = loadProperNounMatcher(), chapters = [];
  for (const chapter of ['108','109']) {
    const source = context.load('jinshu', chapter, { properNounMatcher: matcher, strictAliasDispositions: chapter === '109' });
    for (const [id, person] of source.localPeople) assert.equal(index.memberVersions.get(id), peopleDigest(memberContract(person, localNameKeys(person))), id);
    chapters.push({ chapter, people: source.localPeople.size, currentMemberVersionsMatch: true });
  }
  const inputs = Object.fromEntries(['source','extraction','editorial'].map((key, i) => {
    const file = ['data/jinshu/109.json','data/people/extractions/jinshu/109.json','data/people/editorial-decisions/jinshu/109.json'][i];
    const bytes = context.snapshot.read(file); assert(fs.readFileSync(root + '/' + file).equals(bytes), 'Current source changed after snapshot');
    return [key, 'sha256:' + hash(bytes)];
  }));
  assert(!fs.existsSync(root + '/data/people/date-audits/jinshu/109.json'));
  inputs.dateAudit = 'sha256:' + hash('null'); // Explicit absence; no current date approval.
  const plan = planChapterIdentityReview(index, { book: 'jinshu', chapter: '109' }, inputs, IDENTITY_REVIEW_LIMITS);
  assert.equal(plan.metrics.generatedPairs, 0); assert(plan.metrics.maxDossiersInCase <= 8);
  const before = read('plan.json'), evidence = read('semantic-proof-reuse-diagnostic.json'), comparisons = [];
  for (const row of evidence.caseRows) {
    const original = before.cases.find(c => c.id === row.caseId), current = plan.cases.find(c => c.id === row.caseId);
    assert(original && current, 'Canonical chapter case inventory changed');
    const changedDimensions = Object.keys(original).filter(key => peopleDigest(original[key]) !== peopleDigest(current[key]));
    comparisons.push({ caseId: row.caseId, localPeople: row.localPeople, sourceUnchanged: row.targetAndAnchorSemanticallyUnchanged,
      currentCaseContractUnchanged: changedDimensions.length === 0, changedDimensions,
      eligibleForNativeComposition: row.targetAndAnchorSemanticallyUnchanged && changedDimensions.length === 0 });
  }
  const output = { schemaVersion: 1, kind: 'actual-corpus-native-dossier-delta-validation', at: new Date().toISOString(),
    sourceRevision: snapshot.revision, registry, registryManifestSha256: hash(fs.readFileSync(registry + '/manifest.json')),
    changedMembers: index.provenance.update.changedMembers, updatedDossiers: index.provenance.update.updatedDossiers,
    materializedPeople: index.provenance.update.materializedPeople, deltaBytes: fs.statSync(registry + '/delta.json').size,
    currentChapterContracts: chapters, metrics: plan.metrics, savedCases: comparisons.length,
    sourceAndCurrentCaseUnchanged: comparisons.filter(c => c.eligibleForNativeComposition).length, comparisons,
    productionAdopted: false, currentDateApproval: false, currentIdentityApproval: false, chapterApproved: false, published: false };
  fs.writeFileSync(dir + 'native-dossier-delta-corpus-validation.json', JSON.stringify(output, null, 2) + '\n');
  fs.writeFileSync(dir + 'current-delta-plan-unapproved.json', JSON.stringify(plan, null, 2) + '\n');
  console.log(JSON.stringify({ updatedDossiers: output.updatedDossiers, materializedPeople: output.materializedPeople, deltaBytes: output.deltaBytes,
    metrics: output.metrics, savedCases: output.savedCases, sourceAndCurrentCaseUnchanged: output.sourceAndCurrentCaseUnchanged, chapterApproved: false }));
} finally { index.close(); }
