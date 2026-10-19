import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sha256 } from './lib/people-content.mjs';
import { replayReviewedFootnoteAdditions } from './lib/people-combined-footnote-review.mjs';

const hash = value => sha256(JSON.stringify(value));
function fixture() {
  const before = { content: [{ sentences: [{ id: 's0090', zh: '廆懼，首服。', translations: [{ lang: 'en', literal: 'Hui feared.', idiomatic: 'Hui feared.', model: 'original' }] }] }] };
  const after = structuredClone(before);
  after.content[0].sentences[0].translations[0].footnote = 'The witnesses differ.';
  const contract = { schemaVersion: 1, kind: 'english-footnote-additions', book: 'jinshu', chapter: '108', authorAgentId: 'author', beforeSourceHash: hash(before), afterSourceHash: hash(after), additions: [{ unit: 's0090', text: 'The witnesses differ.' }] };
  const pin = hash(contract);
  const identity = { reviewer: { agentId: 'reviewer', independentOfExtractor: true, independentOfRepairAuthor: true }, reviewContext: { sourceFootnoteContractHash: pin }, sourceFootnoteReviewKind: 'independent-editorial-footnote-review', references: [{ kind: 'external', title: 'fixture only', url: 'https://example.org/witness', quote: 'test', sourceHash: sha256('test'), accessedAt: '2026-10-20T00:00:00Z', reason: 'Synthetic test source and interpretation.' }], sourceFootnoteChecks: [{ unit: 's0090', text: 'The witnesses differ.', verdict: 'supported', reason: 'The documented witness has a different reading.', sourceQuote: '廆', referenceIndexes: [0] }] };
  const options = { contract, identity, dateReport: { reviewContext: { sourceFootnoteContractHash: pin } }, validation: { sourceFootnoteContractHash: pin }, seal: { sourceFootnoteContractHash: pin }, book: 'jinshu', chapter: '108', authorAgentIds: ['author'] };
  return { before, after, options };
}
function bind(o) {
  const h = hash(o.contract);
  o.identity.reviewContext.sourceFootnoteContractHash = h;
  o.dateReport.reviewContext.sourceFootnoteContractHash = h;
  o.validation.sourceFootnoteContractHash = h;
  o.seal.sourceFootnoteContractHash = h;
}

test('exact reviewed footnote is replayed without changing the original', () => {
  const { before, after, options } = fixture();
  const saved = structuredClone(before);
  assert.deepEqual(replayReviewedFootnoteAdditions(before, options), after);
  assert.deepEqual(before, saved);
});
test('no contract permits no detached approval or hidden pins', () => {
  const { before, options } = fixture();
  delete options.contract;
  assert.throws(() => replayReviewedFootnoteAdditions(before, options), /contract pin/);
  for (const r of [options.identity.reviewContext, options.dateReport.reviewContext, options.validation, options.seal]) delete r.sourceFootnoteContractHash;
  assert.throws(() => replayReviewedFootnoteAdditions(before, options), /without contract/);
  delete options.identity.sourceFootnoteChecks;
  assert.throws(() => replayReviewedFootnoteAdditions(before, options), /without contract/);
  delete options.identity.sourceFootnoteReviewKind;
  assert.deepEqual(replayReviewedFootnoteAdditions(before, options), before);
});
for (const [name, mutate, pattern] of [
  ['missing date pin', o => delete o.dateReport.reviewContext.sourceFootnoteContractHash, /contract pin/],
  ['missing validation pin', o => delete o.validation.sourceFootnoteContractHash, /contract pin/],
  ['missing seal pin', o => delete o.seal.sourceFootnoteContractHash, /contract pin/],
  ['wrong reviewer pin', o => o.identity.reviewContext.sourceFootnoteContractHash = 'wrong', /contract pin/],
  ['missing author', o => o.authorAgentIds = [], /declared footnote author/],
  ['self reviewer', o => o.identity.reviewer.agentId = 'author', /independent/],
  ['empty reference', o => o.identity.references[0] = {}, /reference quote/],
  ['bad external hash', o => o.identity.references[0].sourceHash = sha256('wrong'), /Invalid external/],
  ['wrong scope', o => { o.contract.chapter = '109'; bind(o); }, /scope/],
  ['unknown contract field', o => { o.contract.extraneous = true; bind(o); }, /contract fields/],
  ['stale source', o => { o.contract.beforeSourceHash = 'sha256:bad'; bind(o); }, /before source/],
  ['unreviewed text', o => { o.contract.additions[0].text = 'Changed'; bind(o); }, /exact reviewed footnote/],
  ['no explicit editorial review', o => delete o.identity.sourceFootnoteReviewKind, /editorial review kind/],
  ['rejected review', o => o.identity.sourceFootnoteChecks[0].verdict = 'rejected', /exact reviewed footnote/],
  ['inadequate reasoning', o => o.identity.sourceFootnoteChecks[0].reason = '', /reasoning/],
  ['invented source', o => o.identity.sourceFootnoteChecks[0].sourceQuote = 'fake', /not in the source/],
  ['missing reference', o => o.identity.sourceFootnoteChecks[0].referenceIndexes = [], /requires cited/],
  ['invalid reference', o => o.identity.sourceFootnoteChecks[0].referenceIndexes = [5], /reference index/],
  ['wrong after source', o => { o.contract.afterSourceHash = 'sha256:bad'; bind(o); }, /after source/],
]) {
  test(`rejects ${name}`, () => {
    const { before, options } = fixture(); mutate(options);
    assert.throws(() => replayReviewedFootnoteAdditions(before, options), pattern);
  });
}
test('cannot replace an existing footnote or choose between two English translations', () => {
  for (const modify of [s => s.translations[0].footnote = 'Existing', s => s.translations.push({ lang: 'en', literal: 'another' })]) {
    const { before, options } = fixture(); modify(before.content[0].sentences[0]);
    options.contract.beforeSourceHash = hash(before); bind(options);
    assert.throws(() => replayReviewedFootnoteAdditions(before, options), /one English translation/);
  }
});
test('rejects duplicate unit IDs and duplicate additions even if resealed', () => {
  const f = fixture();
  f.before.content[0].sentences.push(structuredClone(f.before.content[0].sentences[0]));
  f.options.contract.beforeSourceHash = hash(f.before); bind(f.options);
  assert.throws(() => replayReviewedFootnoteAdditions(f.before, f.options), /duplicate content-unit ID/);
  const g = fixture();
  g.options.contract.additions.push(structuredClone(g.options.contract.additions[0]));
  g.options.identity.sourceFootnoteChecks.push(structuredClone(g.options.identity.sourceFootnoteChecks[0])); bind(g.options);
  assert.throws(() => replayReviewedFootnoteAdditions(g.before, g.options), /Duplicate footnote unit/);
});
test('cannot attach a footnote to an empty translation', () => {
  const f = fixture();
  delete f.before.content[0].sentences[0].translations[0].literal;
  delete f.before.content[0].sentences[0].translations[0].idiomatic;
  f.options.contract.beforeSourceHash = hash(f.before); bind(f.options);
  assert.throws(() => replayReviewedFootnoteAdditions(f.before, f.options), /nonempty English translation/);
});
