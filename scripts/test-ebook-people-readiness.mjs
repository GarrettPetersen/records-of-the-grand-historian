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
  missingChapters: [],
  legacyChapters: [],
  dateAuditChapters: [],
  peopleNeedingReview: 0,
}), []);
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
