import assert from 'node:assert/strict';
import { DATE_AUDIT_VERSION } from './lib/people-date-audit.mjs';
import { ebookCurrentDateErrors, ebookManifestScopeErrors } from './lib/ebook-current-date-audits.mjs';

const product = { book: 'jinshu', chapters: [1, '002'] };
assert.deepEqual(ebookManifestScopeErrors(product, { book: 'jinshu', chapters: ['001', 2] }), []);
for (const metadata of [
  { book: 'shiji', chapters: ['001', '002'] },
  { book: 'jinshu', chapters: ['001'] },
  { book: 'jinshu', chapters: ['001', '002', '003'] },
  { book: 'jinshu', chapters: ['002', '001'] },
  { book: 'jinshu', chapters: ['001', '001'] },
]) assert.match(ebookManifestScopeErrors(product, metadata)[0], /do not match/);
assert.match(ebookManifestScopeErrors(null, { book: 'jinshu', chapters: ['001'] })[0], /invalid product manifest/);
const approved = () => ({ status: 'audited', auditVersion: DATE_AUDIT_VERSION });
assert.deepEqual(ebookCurrentDateErrors(product, { getStatus: approved }), []);
assert.match(ebookCurrentDateErrors(product, { getStatus: (_book, chapter) =>
  chapter === '001' ? approved() : { status: 'stale', auditVersion: DATE_AUDIT_VERSION } })[0], /jinshu\/002 is stale/);
assert.match(ebookCurrentDateErrors(product, { getStatus: () => { throw new Error('bad report'); } })[0], /could not be validated: bad report/);
assert.equal(ebookCurrentDateErrors(product, { getStatus: () => ({ status: 'audited', auditVersion: DATE_AUDIT_VERSION + 1 }) }).length, 2);
assert.match(ebookCurrentDateErrors({ ...product, chapters: ['1', '001'] }, { getStatus: approved })[0], /duplicate/);
assert.match(ebookCurrentDateErrors({ ...product, chapters: [] }, { getStatus: approved })[0], /scope/);
assert.match(ebookCurrentDateErrors({ ...product, book: '../jinshu' }, { getStatus: approved })[0], /scope/);
assert.match(ebookCurrentDateErrors({ ...product, chapters: ['x'] }, { getStatus: approved })[0], /invalid product chapter/);
console.log('ebook current date audits self-test: ok');
