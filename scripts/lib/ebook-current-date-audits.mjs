import { DATE_AUDIT_VERSION, dateAuditStatus } from './people-date-audit.mjs';

function chapterIds(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some(value => !/^\d{1,3}$/u.test(String(value)))) return null;
  const chapters = values.map(value => String(value).padStart(3, '0'));
  return new Set(chapters).size === chapters.length ? chapters : null;
}

export function ebookManifestScopeErrors(product, metadata) {
  const expected = chapterIds(product?.chapters);
  const actual = chapterIds(metadata?.chapters);
  if (!product || typeof product.book !== 'string' || !/^[a-z0-9_-]+$/u.test(product.book) || !expected) {
    return ['Cannot verify ebook scope: invalid product manifest scope.'];
  }
  if (metadata?.book !== product.book || !actual || expected.join('|') !== actual.join('|')) {
    return ['Ebook metadata book or ordered chapters do not match the product manifest.'];
  }
  return [];
}

// Necessary current-source check, not an editorial, identity or EPUB provenance certificate.
// Product scope must come from the repository's ebook manifest, not a QA sidecar.
export function ebookCurrentDateErrors(product, { getStatus = dateAuditStatus } = {}) {
  if (!product || typeof product.book !== 'string' || !/^[a-z0-9_-]+$/u.test(product.book) ||
      !Array.isArray(product.chapters) || product.chapters.length === 0) {
    return ['Cannot verify current ebook date audits: invalid product manifest scope.'];
  }
  const chapters = [];
  for (const value of product.chapters) {
    if (!/^\d{1,3}$/u.test(String(value))) {
      return ['Cannot verify current ebook date audits: invalid product chapter.'];
    }
    chapters.push(String(value).padStart(3, '0'));
  }
  if (new Set(chapters).size !== chapters.length) {
    return ['Cannot verify current ebook date audits: duplicate product chapter.'];
  }
  const errors = [];
  for (const chapter of chapters) {
    try {
      const result = getStatus(product.book, chapter);
      if (result?.status !== 'audited' || result.auditVersion !== DATE_AUDIT_VERSION) {
        errors.push(`Current date audit for ${product.book}/${chapter} is ${result?.status || 'invalid'} (version ${result?.auditVersion ?? 'missing'}).`);
      }
    } catch (error) {
      errors.push(`Current date audit for ${product.book}/${chapter} could not be validated: ${error.message}`);
    }
  }
  return errors;
}
