#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  assessEbookPeopleReadiness,
  ebookPeopleReadinessErrors,
} from './lib/ebook-people-readiness.mjs';

function person(id, localPeople, status = 'machine-reviewed') {
  return { id, localPeople, curation: { status } };
}

const context = {
  active: true,
  catalog: {
    people: [
      person('ready', ['fixture:001:p001']),
      person('review', ['fixture:002:p001'], 'needs-review'),
      person('outside', ['other:001:p001']),
    ],
  },
  siteIndex: {
    currentPromptVersion: 7,
    chapters: {
      'fixture:001': { promptVersion: 7, dateAudit: { status: 'audited', auditVersion: 1 } },
      'fixture:002': { promptVersion: 7 },
      'fixture:004': { promptVersion: 6 },
    },
  },
};

const ready = assessEbookPeopleReadiness(context, { book: 'fixture', chapters: ['001'] });
assert.equal(ready.active, true);
assert.equal(ready.ready, true);
assert.equal(ready.preview, false);
assert.deepEqual(ready.people.map((item) => item.id), ['ready']);

// A locally complete product cannot promote globally incomplete preview data.
const previewContext = { ...context, preview: true };
const previewProduct = { book: 'fixture', chapters: ['001'] };
const gatedPreview = assessEbookPeopleReadiness(previewContext, previewProduct);
assert.equal(gatedPreview.active, false);
assert.equal(gatedPreview.ready, false);
assert.equal(gatedPreview.preview, false);
assert.equal(gatedPreview.reason, 'people-catalog-preview');
const permittedPreview = assessEbookPeopleReadiness(previewContext, previewProduct, { allowPreview: true });
assert.equal(permittedPreview.active, true);
assert.equal(permittedPreview.ready, false);
assert.equal(permittedPreview.preview, true);
assert.deepEqual(ebookPeopleReadinessErrors({
  active: permittedPreview.active,
  ready: permittedPreview.ready,
  preview: permittedPreview.preview,
  people: permittedPreview.people.length,
  shards: 1,
  expectedMentionLinks: 0,
  expectedBacklinks: 0,
  missingChapters: permittedPreview.missingChapters,
  legacyChapters: permittedPreview.legacyChapters,
  dateAuditChapters: permittedPreview.dateAuditChapters,
  peopleNeedingReview: permittedPreview.peopleNeedingReview.length,
}, { requireGlossary: true }), [
  'People glossary is an incomplete preview and is not valid for publication.',
]);

const unaudited = structuredClone(context);
delete unaudited.siteIndex.chapters['fixture:001'].dateAudit;
const datesPending = assessEbookPeopleReadiness(unaudited, { book: 'fixture', chapters: ['001'] });
assert.equal(datesPending.ready, false);
assert.deepEqual(datesPending.dateAuditChapters, ['001']);
unaudited.siteIndex.chapters['fixture:001'].dateAudit = { status: 'stale', auditVersion: 1 };
assert.equal(assessEbookPeopleReadiness(unaudited, { book: 'fixture', chapters: ['001'] }).ready, false);

const missing = assessEbookPeopleReadiness(context, { book: 'fixture', chapters: ['001', '003'] });
assert.equal(missing.active, false);
assert.equal(missing.reason, 'product-catalog-incomplete');
assert.deepEqual(missing.missingChapters, ['003']);

const preview = assessEbookPeopleReadiness(
  context,
  { book: 'fixture', chapters: ['001', '003'] },
  { allowPreview: true },
);
assert.equal(preview.active, true);
assert.equal(preview.ready, false);
assert.equal(preview.preview, true);

const unresolved = assessEbookPeopleReadiness(context, { book: 'fixture', chapters: ['002'] });
assert.equal(unresolved.active, false);
assert.equal(unresolved.peopleNeedingReview.length, 1);

const legacy = assessEbookPeopleReadiness(context, { book: 'fixture', chapters: ['004'] });
assert.equal(legacy.active, false);
assert.deepEqual(legacy.legacyChapters, ['004']);

const unavailable = assessEbookPeopleReadiness(
  { active: false, reason: 'generated-data-missing' },
  { book: 'fixture', chapters: ['001'] },
);
assert.equal(unavailable.active, false);
assert.equal(unavailable.reason, 'generated-data-missing');

const previewQa = {
  active: true,
  ready: false,
  preview: true,
  people: 1,
  shards: 1,
  expectedMentionLinks: 1,
  expectedBacklinks: 1,
  missingChapters: ['003'],
  legacyChapters: [],
  dateAuditChapters: [],
  peopleNeedingReview: 1,
};
assert.deepEqual(ebookPeopleReadinessErrors(previewQa), [
  'People glossary is an incomplete preview and is not valid for publication.',
  'Active people glossary retains coverage, date-audit or identity-review blockers.',
]);
assert.deepEqual(ebookPeopleReadinessErrors(previewQa, { allowPreview: true }), []);
assert.deepEqual(ebookPeopleReadinessErrors(previewQa, { allowPreview: true, requireGlossary: true }), [
  'People glossary is an incomplete preview and is not valid for publication.',
  'Active people glossary retains coverage, date-audit or identity-review blockers.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({ active: false }, { requireGlossary: true }), [
  'A publication-ready people glossary is required but is not active.',
]);
assert.deepEqual(ebookPeopleReadinessErrors(null, { requireGlossary: true }), [
  'A publication-ready people glossary is required but is not active.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({ active: true, ready: true, dateAuditChapters: [] }, { requireGlossary: true }), [
  'Required people-glossary readiness report has missing or invalid fields.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({
  active: true, ready: true, preview: false, missingChapters: [], legacyChapters: [],
  dateAuditChapters: [], peopleNeedingReview: -1,
}, { requireGlossary: true }), [
  'Required people-glossary readiness report has missing or invalid fields.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({
  ...previewQa,
  preview: false,
}, { allowPreview: true }), [
  'Active people glossary is neither publication-ready nor marked as a preview.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({
  active: true,
  ready: true,
  preview: false,
  people: 1,
  shards: 1,
  expectedMentionLinks: 1,
  expectedBacklinks: 1,
  missingChapters: [],
  legacyChapters: [],
  dateAuditChapters: [],
  peopleNeedingReview: 0,
}), []);
assert.deepEqual(ebookPeopleReadinessErrors({
  active: true,
  ready: true,
  preview: false,
  people: 1,
  shards: 1,
  expectedMentionLinks: 1,
  expectedBacklinks: 1,
  missingChapters: [],
  legacyChapters: [],
  dateAuditChapters: [],
  peopleNeedingReview: 0,
}, { requireGlossary: true }), []);
assert.deepEqual(ebookPeopleReadinessErrors({
  active: true, ready: true, preview: false, people: 0, shards: 0,
  expectedMentionLinks: 0, expectedBacklinks: 0, missingChapters: [], legacyChapters: [],
  dateAuditChapters: [], peopleNeedingReview: 0,
}, { requireGlossary: true }), [
  'Required people-glossary readiness report has missing or invalid fields.',
]);
const validRequiredQa = {
  active: true, ready: true, preview: false, people: 1, shards: 1,
  expectedMentionLinks: 1, expectedBacklinks: 1, missingChapters: [], legacyChapters: [],
  dateAuditChapters: [], peopleNeedingReview: 0,
};
for (const [field, badValue] of [
  ['people', 0], ['shards', 0], ['expectedMentionLinks', -1], ['expectedBacklinks', -1],
  ['peopleNeedingReview', -1], ['missingChapters', null], ['legacyChapters', null],
  ['dateAuditChapters', null], ['ready', 'true'], ['preview', null],
]) {
  assert.deepEqual(ebookPeopleReadinessErrors({ ...validRequiredQa, [field]: badValue }, { requireGlossary: true }), [
    'Required people-glossary readiness report has missing or invalid fields.',
  ], `invalid ${field} should fail required mode`);
}
assert.deepEqual(ebookPeopleReadinessErrors({
  active: true,
  ready: true,
  preview: true,
  missingChapters: ['003'],
  legacyChapters: [],
  dateAuditChapters: [],
  peopleNeedingReview: 0,
}, { allowPreview: true }), [
  'Publication-ready people glossary is also marked as a preview.',
  'Publication-ready people glossary retains coverage, date-audit or identity-review blockers.',
]);

assert.deepEqual(ebookPeopleReadinessErrors({ active: true, ready: true }), [
  'Active people glossary is missing date-audit coverage.',
]);
assert.deepEqual(ebookPeopleReadinessErrors({ active: true, ready: true, dateAuditChapters: ['001'] }), [
  'Publication-ready people glossary retains coverage, date-audit or identity-review blockers.',
]);

console.log('ebook people readiness self-test: ok');
