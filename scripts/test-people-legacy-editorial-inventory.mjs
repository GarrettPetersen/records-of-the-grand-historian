import test from 'node:test';
import assert from 'node:assert/strict';
import { editorialDecisionSeed, editorialReviews, mergeEditorialDecisionReview } from './lib/people-editorial-decisions.mjs';
import { inventoryHistory, semanticHash } from './people-legacy-editorial-inventory.mjs';

const locator = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
const witness = { source: 'chapter-text', citation: 'fixture:001:s0001', excerpt: null };
const reason = 'The source supports this correction.';
const repair = { id: 'fixture:001:r0001', unit: locator, field: 'idiomatic', before: 'Alice arrived.', after: 'Alice came.', reason, confidence: 'high', status: 'proposed' };
const claim = (id, en) => ({ id: `fixture:001:${id}`, subject: 'fixture:001:p001', predicate: 'name', value: { kind: 'personal', en }, certainty: 'explicit', evidence: ['fixture:001:s0001'] });
function fixture() {
  const extraction = { book: 'fixture', chapter: '001', input: { chapterFingerprint: `sha256:${'1'.repeat(64)}` }, run: { agentId: 'extractor' }, people: [{ localId: 'fixture:001:p001', preferredNameSuggestion: { en: 'Alice' } }], claims: [], translationRepairs: [structuredClone(repair)] };
  const history = editorialDecisionSeed(extraction);
  history.reviewer = { kind: 'codex', name: 'Unidentified legacy reviewer', model: null, agentId: null, runId: null, completedAt: '2026-09-14T00:00:00Z' };
  history.decisions[0] = { repairId: repair.id, decision: 'accept', after: null, reason, sourceWitness: witness };
  const before = claim('c0001', 'Alicia'), after = claim('c0001', 'Alice');
  history.claimRevisions = [{ repairId: repair.id, before, after, reason, sourceWitness: witness }];
  history.claimRetractions = [{ repairId: repair.id, claim: claim('c0002', 'Alison'), reason, sourceWitness: witness }];
  history.claimAdditions = [{ repairId: repair.id, claim: claim('c0003', 'Alis'), reason, sourceWitness: witness }];
  extraction.claims = [structuredClone(after), claim('c0003', 'Alis')];
  extraction.translationRepairs = [{ ...repair, status: 'applied' }];
  return { history, extraction };
}

test('inventory records all action kinds and original anonymous reviewer without mutation', () => {
  const { history, extraction } = fixture(), before = JSON.stringify({ history, extraction });
  const [review] = inventoryHistory(history, extraction);
  assert.equal(review.originalReviewer.agentId, null);
  assert.equal(review.componentHash, semanticHash(editorialReviews(history)[0]));
  assert.equal(review.storedComponentHash, semanticHash(history));
  assert.deepEqual(review.actions.map(action => [action.kind, action.ordinal]), [['decision', 1], ['claim-retraction', 1], ['claim-revision', 1], ['claim-addition', 1]]);
  assert.equal(review.actions[2].contentHash, semanticHash(history.claimRevisions[0]));
  assert.equal(JSON.stringify({ history, extraction }), before);
});
test('duplicate and missing decisions or claim actions fail', () => {
  const { history, extraction } = fixture();
  history.decisions.push(structuredClone(history.decisions[0]));
  assert.throws(() => inventoryHistory(history, extraction), /duplicate decision/);
  history.decisions.pop(); history.claimRevisions.push(structuredClone(history.claimRevisions[0]));
  assert.throws(() => inventoryHistory(history, extraction), /duplicate claim revision/);
  history.claimRevisions.pop(); history.proposals = [];
  assert.throws(() => inventoryHistory(history, extraction));
});
test('production JSON hashes preserve key order and detect content tampering', () => {
  assert.notEqual(semanticHash({ a: 1, b: 2 }), semanticHash({ b: 2, a: 1 }));
  assert.notEqual(semanticHash({ a: 1, b: 2 }), semanticHash({ a: 1, b: 3 }));
  const { history, extraction } = fixture();
  history.claimRevisions[0].after.value.en = 'Unreviewed';
  assert.throws(() => inventoryHistory(history, extraction), /replacement fact is missing/);
});
test('distinct alias claim actions are not conflated by a shared person', () => {
  const { history, extraction } = fixture();
  const second = { ...history.claimAdditions[0], claim: claim('c0004', 'Alice of Example') };
  history.claimAdditions.push(second); extraction.claims.push(second.claim);
  const actions = inventoryHistory(history, extraction)[0].actions.filter(action => action.kind === 'claim-addition');
  assert.equal(actions.length, 2); assert.notEqual(actions[0].contentHash, actions[1].contentHash);
});
test('multi-review history preserves original component and action order', () => {
  const { history, extraction } = fixture();
  const nextRepair = { ...repair, id: 'fixture:001:r0002', field: 'literal', before: 'Alice arrived.', after: 'Alice came.' };
  const next = editorialDecisionSeed({ ...extraction, translationRepairs: [nextRepair] });
  next.reviewer = { ...history.reviewer, agentId: 'second-reviewer' };
  next.decisions[0] = { repairId: nextRepair.id, decision: 'accept', after: null, reason, sourceWitness: witness };
  const merged = mergeEditorialDecisionReview(history, next);
  extraction.translationRepairs.push({ ...nextRepair, status: 'applied' });
  const reviews = inventoryHistory(merged, extraction);
  assert.deepEqual(reviews.map(item => item.ordinal), [1, 2]);
  assert.equal(reviews[0].componentHash, semanticHash(editorialReviews(merged)[0]));
  assert.equal(reviews[1].componentHash, semanticHash(editorialReviews(merged)[1]));
  assert.equal(reviews[0].storedComponentHash, semanticHash(merged.reviews[0]));
  assert.equal(reviews[1].storedComponentHash, semanticHash(merged.reviews[1]));
  assert.equal(reviews[1].actions[0].content.repairId, nextRepair.id);
});
test('mismatched scope and pending work are rejected', () => {
  const { history, extraction } = fixture();
  extraction.chapter = '002'; assert.throws(() => inventoryHistory(history, extraction), /scopes differ/);
  extraction.chapter = '001'; extraction.translationRepairs[0].status = 'proposed';
  assert.throws(() => inventoryHistory(history, extraction), /Pending proposed/);
});
