import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, REPO_ROOT, readJson } from './people-content.mjs';
import { peopleDigest, stableJson } from './people-identity-seal.mjs';
import { loadQualifiedPeopleScope } from './people-qualified-scope.mjs';
export { assertChapterGates, assertScopedIdentity } from './people-qualified-scope.mjs';

export function assertProductScope(product, manifest, sourceChapters) {
  const expected = manifest?.products?.find(item => item.slug === product?.slug);
  const valid = item => item && /^[a-z0-9_-]+$/u.test(item.book) &&
    Array.isArray(item.chapters) && item.chapters.length > 0 &&
    item.chapters.every(chapter => typeof chapter === 'string' && /^\d{3}$/u.test(chapter)) &&
    new Set(item.chapters).size === item.chapters.length;
  if (!valid(product) || !valid(expected) || product.book !== expected.book ||
      stableJson(product.chapters) !== stableJson(expected.chapters)) {
    throw new Error('Certified people scope must match the authoritative ordered product manifest');
  }
  if (product.slug === product.book && stableJson(product.chapters) !== stableJson(sourceChapters)) {
    throw new Error('Whole-book product does not cover every authoritative source chapter in order');
  }
}

export function loadCertifiedEbookPeople(product) {
  const manifest = readJson(path.join(REPO_ROOT, 'ebooks', 'manifest.json'));
  const sourceChapters = fs.readdirSync(path.join(DATA_DIR, product.book))
    .filter(name => /^\d{3}\.json$/u.test(name)).sort().map(name => name.slice(0, -5));
  assertProductScope(product, manifest, sourceChapters);
  const qualified = loadQualifiedPeopleScope(product.chapters.map(chapter => ({ book: product.book, chapter })));
  const { catalog, siteIndex, identity } = qualified;
  const gateEvidence = qualified.gateEvidence.map(({ book, ...evidence }) => evidence);
  const projected = { catalog, siteIndex };
  const certificate = { schemaVersion: 1, kind: 'certified-ebook-people',
    scope: { slug: product.slug, book: product.book, chapters: product.chapters },
    manifest: peopleDigest(manifest), identity, gates: gateEvidence,
    projection: peopleDigest(projected) };
  return { active: true, preview: false, reason: null, ...projected, certificate,
    peopleById: new Map(catalog.people.map(person => [person.id, person])),
    familyEdgesById: new Map(catalog.familyEdges.map(edge => [edge.id, edge])) };
}

export function assertEbookPeopleCertificate(actual, expected) {
  if (stableJson(actual) !== stableJson(expected)) {
    throw new Error('EPUB people certificate does not match current authoritative source, gates, scope and identity generation');
  }
}
