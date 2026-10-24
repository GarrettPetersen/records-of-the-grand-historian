// Reuse the production curation fixture rather than maintaining a second model
// of its receipt, sealed bytes, date packet, and editorial history. Importing
// this module also registers the existing combined-curation regression tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { fixture } from './test-people-combined-curation.mjs';
import { sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { documentHash, validateCombinedReviews } from './lib/people-combined-curation-review.mjs';
import { prepareCombinedCuration, verifyCombinedCuration } from './lib/people-combined-curation.mjs';
import { editorialReviews } from './lib/people-editorial-decisions.mjs';

const byteHash = file => `sha256:${createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const pin = file => ({ file, bytes: fs.statSync(file).size, sha256: byteHash(file) });
function addFootnote(f) {
  const d = f.docs, before = structuredClone(d.source);
  const note = 'A separately checked witness has a different reading.';
  d.source.content[0].sentences[0].translations[0].footnote = note;
  const contract = { schemaVersion: 1, kind: 'english-footnote-additions', book: d.book, chapter: d.chapter,
    authorAgentId: 'footnote-author', beforeSourceHash: documentHash(before), afterSourceHash: documentHash(d.source), additions: [{ unit: 's0001', text: note }] };
  d.authorAgentIds.push('footnote-author');
  d.materialization.sourceFootnoteContract = contract;
  const hash = documentHash(contract);
  for (const doc of [d.identity.reviewContext, d.dateReport.reviewContext, d.validation, d.seal]) doc.sourceFootnoteContractHash = hash;
  d.identity.sourceFootnoteReviewKind = 'independent-editorial-footnote-review';
  d.identity.references.push({ kind: 'external', url: 'https://example.org/fixture', title: 'Synthetic test witness', quote: 'fixture quote', sourceHash: sha256('fixture quote'), accessedAt: '2026-10-20T00:00:00Z', reason: 'A synthetic test citation for the additional note.' });
  d.identity.sourceFootnoteChecks = [{ unit: 's0001', text: note, verdict: 'supported', reason: 'A separate reviewer checked the exact synthetic note.', sourceQuote: '艾麗絲', referenceIndexes: [0] }];
  d.validation.identityReviewHash = documentHash(d.identity);
  d.validation.dateReportHash = documentHash(d.dateReport);
  return d;
}
function validate(f) { return validateCombinedReviews(f.docs, { dataDir: path.join(f.root, 'data') }); }
function persistInputs(f) {
  const d = f.docs, p = f.inputPaths;
  for (const role of ['source', 'extraction', 'editorial']) writeJsonAtomic(p[role], d[role === 'extraction' ? 'candidate' : role]);
  d.materialization.sourceByteHash = byteHash(p.source);
  for (const report of [d.identity, d.dateReport]) report.reviewContext.sourceByteHash = d.materialization.sourceByteHash;
  writeJsonAtomic(p.materialization, d.materialization);
  d.validation.identityReviewHash = documentHash(d.identity);
  d.validation.dateReportHash = documentHash(d.dateReport);
  d.seal.protectedFiles = d.seal.protectedFiles.map(item => pin(item.file));
  for (const role of ['identity', 'dateReport', 'validation', 'seal']) writeJsonAtomic(p[role], d[role]);
}

test('old no-footnote combined curation still validates unchanged', t => {
  const f = fixture(t);
  assert.ok(validate(f).stats);
});
test('reviewed footnote validates through production and byte-sealed receipt', t => {
  const f = fixture(t); addFootnote(f); persistInputs(f);
  assert.ok(validate(f).stats);
  const { receipt, hash } = prepareCombinedCuration(f.spec);
  assert.equal(verifyCombinedCuration(receipt, hash, { root: f.root, requireBefore: true }).status, 'verified');
  const changedReceipt = structuredClone(receipt);
  changedReceipt.authorAgentIds.push('tampered');
  assert.throws(() => verifyCombinedCuration(changedReceipt, hash, { root: f.root }), /externally pinned receipt hash/);
  const source = JSON.parse(fs.readFileSync(f.inputPaths.source, 'utf8'));
  source.content[0].sentences[0].translations[0].footnote += ' tampered';
  writeJsonAtomic(f.inputPaths.source, source);
  assert.throws(() => verifyCombinedCuration(receipt, hash, { root: f.root, requireBefore: true }), /protected input drift/);
});
for (const [name, change, error] of [
  ['footnote author is identity reviewer', d => { d.identity.reviewer.agentId = 'footnote-author'; d.identity.reviewer.actualAgentId = 'footnote-author'; }, /independent/],
  ['footnote author is date reviewer', d => { d.dateReport.reviewer = { ...d.dateReport.reviewer, agentId: 'footnote-author', actualAgentId: 'footnote-author' }; }, /self-approved/],
  ['footnote author is sealed reviewer', d => { d.seal.reviewer = { ...d.seal.reviewer, agentId: 'footnote-author', actualAgentId: 'footnote-author' }; }, /self-approved/],
  ['footnote author is an editorial reviewer', d => { d.editorial.reviews[1].reviewer.agentId = 'footnote-author'; const h = documentHash(editorialReviews(d.editorial)[1]); d.identity.reviewContext.editorialDecisionHash = h; d.dateReport.reviewContext.editorialDecisionHash = h; }, /Self-approved or unidentified editorial amendment/],
  ['reference source hash is invalid', d => { d.identity.references[0].sourceHash = sha256('not the quote'); }, /external footnote reference/],
  ['same-chapter reference is stale', d => { d.identity.references[0] = { book: d.book, chapter: d.chapter, unit: 's0001', quote: '艾麗絲', sourceHash: sha256('stale text'), reason: 'An incorrect hash must never pass reference validation.' }; }, /Stale same-chapter review reference/],
  ['unreviewed footnote changed', d => { d.source.content[0].sentences[0].translations[0].footnote += ' changed'; }, /unrelated source edit/],
  ['date review pin is removed', d => { delete d.dateReport.reviewContext.sourceFootnoteContractHash; }, /contract pin/],
]) {
  test(`combined review rejects ${name}`, t => {
    const f = fixture(t); const d = addFootnote(f); change(d);
    assert.throws(() => validate(f), error);
  });
}
