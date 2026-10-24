// Isolated contract for a reviewed addition to an English translation footnote.
// This module alone cannot publish, validate an extraction, or establish that a
// reviewer actually examined the cited source. Its caller must enforce all the
// combined-curation receipt, reviewer-independence and date/reference gates.
import { isDeepStrictEqual } from 'node:util';
import { contentUnits, validateUnitIds, sha256 } from './people-content.mjs';

const hash = value => sha256(JSON.stringify(value));
function equal(actual, expected, label) {
  if (!isDeepStrictEqual(actual, expected)) throw new Error(`Footnote contract mismatch: ${label}`);
}
function fields(value, names, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Missing ${label}`);
  equal(Object.keys(value).sort(), names.slice().sort(), `${label} fields`);
}
function text(value, label, minimum = 1) {
  if (typeof value !== 'string' || value !== value.trim() || value.length < minimum) throw new Error(`Invalid ${label}`);
}

// Called after the approved text repairs are replayed. Only adding a footnote to
// one uniquely identified English translation is supported: no replacement,
// deletion, Chinese/metadata edits or change to any other translation object.
export function replayReviewedFootnoteAdditions(before, { contract, identity, dateReport, validation, seal, book, chapter, authorAgentIds }) {
  const contractHash = contract === undefined ? undefined : hash(contract);
  for (const report of [identity?.reviewContext, dateReport?.reviewContext, validation, seal]) {
    equal(report?.sourceFootnoteContractHash, contractHash, 'review and seal contract pin');
  }
  if (contract === undefined) {
    equal(identity?.sourceFootnoteChecks, undefined, 'footnote approval without contract');
    equal(identity?.sourceFootnoteReviewKind, undefined, 'footnote review kind without contract');
    return structuredClone(before);
  }
  fields(contract, ['schemaVersion', 'kind', 'book', 'chapter', 'authorAgentId', 'beforeSourceHash', 'afterSourceHash', 'additions'], 'footnote contract');
  equal([contract.schemaVersion, contract.kind, contract.book, contract.chapter], [1, 'english-footnote-additions', book, chapter], 'protocol and scope');
  text(contract.authorAgentId, 'author');
  if (!Array.isArray(authorAgentIds) || !authorAgentIds.includes(contract.authorAgentId)) throw new Error('Missing declared footnote author');
  const reviewer = identity?.reviewer;
  text(reviewer?.agentId, 'reviewer agent ID');
  if (authorAgentIds.includes(reviewer.agentId) || reviewer.independentOfExtractor !== true || reviewer.independentOfRepairAuthor !== true || (reviewer.actualAgentId !== undefined && reviewer.actualAgentId !== reviewer.agentId)) throw new Error('Footnote reviewer must be independent of all declared authors');
  equal(hash(before), contract.beforeSourceHash, 'before source');
  const copy = structuredClone(before), units = contentUnits(copy);
  validateUnitIds(units, 'footnote source');
  if (!Array.isArray(contract.additions) || !contract.additions.length) throw new Error('Missing footnote additions');
  equal(identity?.sourceFootnoteReviewKind, 'independent-editorial-footnote-review', 'explicit editorial review kind');
  if (!Array.isArray(identity?.sourceFootnoteChecks)) throw new Error('Missing footnote approval');
  equal(identity.sourceFootnoteChecks.length, contract.additions.length, 'footnote review coverage');
  const seen = new Set();
  for (const [index, addition] of contract.additions.entries()) {
    fields(addition, ['unit', 'text'], 'footnote addition');
    text(addition.unit, 'unit');
    text(addition.text, 'footnote text');
    if (seen.has(addition.unit)) throw new Error('Duplicate footnote unit');
    seen.add(addition.unit);
    const unit = units.find(item => item.id === addition.unit);
    if (!unit || !Array.isArray(unit.source.translations)) throw new Error('Footnote unit has no translations');
    const translations = unit.source.translations.filter(item => item?.lang === 'en');
    if (translations.length !== 1 || Object.hasOwn(translations[0], 'footnote')) throw new Error('Footnote addition needs one English translation without an existing footnote');
    if (![translations[0].literal, translations[0].idiomatic].some(value => typeof value === 'string' && value.trim())) throw new Error('Footnote requires a nonempty English translation');
    const check = identity.sourceFootnoteChecks[index];
    fields(check, ['unit', 'text', 'verdict', 'reason', 'sourceQuote', 'referenceIndexes'], 'footnote approval');
    equal([check.unit, check.text, check.verdict], [addition.unit, addition.text, 'supported'], 'exact reviewed footnote');
    text(check.reason, 'review reasoning', 20);
    text(check.sourceQuote, 'source quote');
    if (!unit.zh.includes(check.sourceQuote)) throw new Error('Footnote source quote is not in the source unit');
    if (!Array.isArray(check.referenceIndexes) || !check.referenceIndexes.length || new Set(check.referenceIndexes).size !== check.referenceIndexes.length) throw new Error('Footnote requires cited review references');
    for (const i of check.referenceIndexes) {
      if (!Number.isInteger(i) || i < 0 || i >= (identity.references?.length ?? 0)) throw new Error('Invalid footnote review reference index');
      const reference = identity.references[i];
      if (!reference || typeof reference !== 'object' || Array.isArray(reference)) throw new Error('Invalid footnote review reference');
      text(reference.quote, 'footnote reference quote');
      text(reference.reason, 'footnote reference reason', 20);
      if (!/^sha256:[a-f0-9]{64}$/.test(reference.sourceHash ?? '')) throw new Error('Footnote reference requires a source hash');
      if (reference.kind === 'external') {
        text(reference.title, 'footnote reference title');
        let url;
        try { url = new URL(reference.url); } catch { throw new Error('Invalid external footnote reference URL'); }
        if (!['http:', 'https:'].includes(url.protocol) || !Number.isFinite(Date.parse(reference.accessedAt)) || reference.sourceHash !== sha256(reference.quote)) throw new Error('Invalid external footnote reference');
      } else {
        text(reference.book, 'footnote reference book');
        text(reference.chapter, 'footnote reference chapter');
        text(reference.unit, 'footnote reference unit');
      }
    }
    translations[0].footnote = addition.text;
  }
  equal(hash(copy), contract.afterSourceHash, 'after source');
  return copy;
}
