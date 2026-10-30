import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from './lib/people-content.mjs';
import { editorialDecisionSeed, mergeEditorialDecisionReview, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';

const repair = {
  id: 'fixture:001:r0001',
  unit: { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 },
  field: 'idiomatic', before: 'Yun disliked Chi and firmly kept him out.',
  after: 'Yun disliked Chi and firmly refused him.', reason: 'Proposed stylistic clarification.',
  confidence: 'medium', status: 'proposed',
};
function extraction(proposal = repair) {
  return { book: 'fixture', chapter: '001', input: { chapterFingerprint: sha256('fixture') },
    run: { agentId: 'extractor' }, people: [], claims: [], translationRepairs: [structuredClone(proposal)] };
}
function review(proposal, decision, revised = null) {
  const result = editorialDecisionSeed(extraction(proposal));
  result.reviewer = { kind: 'codex', name: 'Independent fixture reviewer', model: null,
    agentId: `reviewer-${decision}`, runId: null, completedAt: '2026-09-14T00:00:00Z' };
  result.decisions[0] = { repairId: proposal.id, decision, after: revised,
    reason: decision === 'reject' ? 'Keep the accurate original expression.' : 'Correct the name while preserving the accurate expression.',
    sourceWitness: { source: 'chapter-text', citation: 'fixture:001:s0001', excerpt: null } };
  return result;
}
const rejected = review(repair, 'reject');
const corrected = { ...repair, id: 'fixture:001:r0002', after: 'Yun disliked Wei and firmly kept him out.' };

test('later independently accepted name correction does not apply a rejected style change', () => {
  const accepted = review(corrected, 'accept');
  const final = extraction({ ...corrected, reason: accepted.decisions[0].reason, status: 'applied' });
  assert.doesNotThrow(() => validateAppliedEditorialDecisions(mergeEditorialDecisionReview(rejected, accepted), final));
});

test('a rejected replacement remains forbidden without subsequent approval', () => {
  assert.throws(() => validateAppliedEditorialDecisions(rejected, extraction({ ...repair, status: 'applied' })), /rejected.*applied/);
});

test('a different but unreviewed replacement is not enough to bypass rejection', () => {
  assert.throws(() => validateAppliedEditorialDecisions(rejected, extraction({ ...corrected, status: 'applied' })), /rejected.*applied/);
});

test('later approval cannot authorize the rejected wording or a different reason', () => {
  const accepted = review(corrected, 'accept');
  const history = mergeEditorialDecisionReview(rejected, accepted);
  assert.throws(() => validateAppliedEditorialDecisions(history, extraction({ ...repair, status: 'applied' })), /rejected.*applied/);
  assert.throws(() => validateAppliedEditorialDecisions(history, extraction({ ...corrected, status: 'applied' })), /rejected.*applied/);
});

test('a later revised replacement is checked against the reviewer wording', () => {
  const accepted = review(corrected, 'revise', 'Yun disliked Wei and kept him out.');
  const final = extraction({ ...corrected, after: accepted.decisions[0].after, reason: accepted.decisions[0].reason, status: 'applied' });
  assert.doesNotThrow(() => validateAppliedEditorialDecisions(mergeEditorialDecisionReview(rejected, accepted), final));
});
