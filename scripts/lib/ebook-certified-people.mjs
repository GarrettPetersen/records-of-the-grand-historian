import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { projectPeopleProduct } from '../compile-people-catalog.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../validate-people-extraction.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { isCompactPeopleExtraction } from './people-compact.mjs';
import { DATA_DIR, PEOPLE_DIR, REPO_ROOT, extractionPath, readJson } from './people-content.mjs';
import { DATE_AUDIT_VERSION, dateAuditStatus } from './people-date-audit.mjs';
import { editorialDecisionPath, validateAppliedEditorialDecisions } from './people-editorial-decisions.mjs';
import { readPeopleCatalog, readPeopleSiteIndex } from './people-generated-data.mjs';
import { assertIdentitySeal, identityInputSeal, peopleDigest, stableJson } from './people-identity-seal.mjs';

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

export function assertChapterGates(extraction, currentPromptVersion, dateStatus, editorialDocument) {
  const scope = `${extraction.book}:${extraction.chapter}`;
  if (!Number.isInteger(currentPromptVersion) || currentPromptVersion < 1 ||
      extraction.run?.promptVersion !== currentPromptVersion) throw new Error(`Invalid or legacy prompt version: ${scope}`);
  if (!Array.isArray(extraction.translationRepairs)) throw new Error(`Missing editorial repair accounting: ${scope}`);
  if (extraction.translationRepairs.some(repair => repair.status === 'proposed')) {
    throw new Error(`Pending translation repair: ${scope}`);
  }
  if (extraction.translationRepairs.some(repair => repair.status === 'applied') && !editorialDocument) {
    throw new Error(`Missing independent applied editorial history: ${scope}`);
  }
  if (editorialDocument) {
    if (editorialDocument.book !== extraction.book || editorialDocument.chapter !== extraction.chapter) {
      throw new Error(`Editorial history scope mismatch: ${scope}`);
    }
    validateAppliedEditorialDecisions(editorialDocument, extraction);
  }
  if (dateStatus?.status !== 'audited' || dateStatus.auditVersion !== DATE_AUDIT_VERSION) {
    throw new Error(`Current independent date audit is ${dateStatus?.status ?? 'missing'}: ${scope}`);
  }
}

export function assertScopedIdentity(corpus, globalCatalog, seal) {
  const selected = new Set();
  for (const localId of corpus.localPeople.keys()) {
    const id = globalCatalog.localPersonMap[localId];
    if (!id) throw new Error(`No sealed global canonical identity for ${localId}`);
    selected.add(id);
  }
  if (seal.unresolvedCanonicalPeople.some(id => selected.has(id))) {
    throw new Error('Unresolved global identity comparison touches this product');
  }
}

// Required-glossary mode calls this separately for each authoritative product.
// Global identities are reused from a hash-sealed normal catalog generation;
// only product source members are freshly validated and projected into facts.
export function loadCertifiedEbookPeople(product) {
  const manifest = readJson(path.join(REPO_ROOT, 'ebooks', 'manifest.json'));
  const sourceChapters = fs.readdirSync(path.join(DATA_DIR, product.book))
    .filter(name => /^\d{3}\.json$/u.test(name)).sort().map(name => name.slice(0, -5));
  assertProductScope(product, manifest, sourceChapters);
  const catalogPath = path.join(PEOPLE_DIR, 'generated', 'catalog.json');
  const catalog = readPeopleCatalog(catalogPath);
  const siteIndex = readPeopleSiteIndex(path.join(PEOPLE_DIR, 'generated', 'site-index.json'));
  const seal = readJson(`${catalogPath}.identity-seal.json`);
  const inputs = identityInputSeal();
  assertIdentitySeal(seal, catalog, siteIndex, inputs);
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  if (catalog.currentPromptVersion !== config.promptVersion || siteIndex.currentPromptVersion !== config.promptVersion ||
      catalog.generatedAt !== siteIndex.generatedAt) throw new Error('Sealed identity generation does not match current configuration');
  const matcher = loadProperNounMatcher();
  const corpus = { chapters: [], localPeople: new Map() };
  const gateEvidence = [];
  for (const chapter of product.chapters) {
    const raw = readJson(extractionPath(product.book, chapter));
    if (raw.book !== product.book || raw.chapter !== chapter) throw new Error(`Extraction scope mismatch: ${product.book}:${chapter}`);
    const packet = buildPeopleExtractionPacket(product.book, chapter, { properNounMatcher: matcher });
    const options = { strictAliasDispositions: true };
    const { normalized: extraction } = isCompactPeopleExtraction(raw)
      ? validateCompactPeopleExtraction(raw, packet, options) : validatePeopleExtraction(raw, packet, options);
    const editorialFile = editorialDecisionPath(product.book, chapter);
    const editorial = fs.existsSync(editorialFile) ? readJson(editorialFile) : null;
    const dateStatus = dateAuditStatus(product.book, chapter);
    assertChapterGates(extraction, config.promptVersion, dateStatus, editorial);
    const report = readJson(path.join(PEOPLE_DIR, 'date-audits', product.book, `${chapter}.json`));
    gateEvidence.push({ chapter, inputFingerprint: packet.input.chapterFingerprint, inputUnitCount: packet.input.unitCount, extraction: peopleDigest(raw), source: peopleDigest(readJson(path.join(DATA_DIR, product.book, `${chapter}.json`))),
      editorial: peopleDigest(editorial), dateAudit: peopleDigest(report) });
    corpus.chapters.push({ extraction });
    for (const person of extraction.people) {
      if (corpus.localPeople.has(person.localId)) throw new Error(`Duplicate scoped local person ${person.localId}`);
      corpus.localPeople.set(person.localId, { ...person, book: extraction.book, chapter: extraction.chapter,
        promptVersion: extraction.run.promptVersion,
        claims: extraction.claims.filter(claim => claim.subject === person.localId),
        mentions: extraction.mentions.filter(mention => mention.person === person.localId) });
    }
  }
  assertScopedIdentity(corpus, catalog, seal);
  const roles = readJson(path.join(PEOPLE_DIR, 'curation', 'role-vocabulary.json'));
  const overrides = readJson(path.join(PEOPLE_DIR, 'curation', 'overrides.json'));
  const projected = projectPeopleProduct(corpus, catalog, new Map(roles.roles.map(role => [role.id, role.label])), overrides.people);
  if (projected.catalog.people.length === 0) throw new Error('Certified product contains no people');
  if (identityInputSeal() !== inputs) throw new Error('Identity inputs changed while qualifying product');
  for (const evidence of gateEvidence) {
    const chapter = evidence.chapter;
    const editorialFile = editorialDecisionPath(product.book, chapter);
    const currentEditorial = fs.existsSync(editorialFile) ? readJson(editorialFile) : null;
    const report = readJson(path.join(PEOPLE_DIR, 'date-audits', product.book, `${chapter}.json`));
    const status = dateAuditStatus(product.book, chapter);
    if (evidence.editorial !== peopleDigest(currentEditorial) || evidence.dateAudit !== peopleDigest(report) ||
        status.status !== 'audited' || status.auditVersion !== DATE_AUDIT_VERSION) {
      throw new Error(`Editorial/date evidence changed while qualifying ${product.book}:${chapter}`);
    }
  }
  const certificate = { schemaVersion: 1, kind: 'certified-ebook-people',
    scope: { slug: product.slug, book: product.book, chapters: product.chapters },
    manifest: peopleDigest(manifest), identity: peopleDigest(seal), gates: gateEvidence,
    projection: peopleDigest(projected) };
  return { active: true, preview: false, reason: null, ...projected, certificate,
    peopleById: new Map(projected.catalog.people.map(person => [person.id, person])),
    familyEdgesById: new Map(projected.catalog.familyEdges.map(edge => [edge.id, edge])) };
}

export function assertEbookPeopleCertificate(actual, expected) {
  if (stableJson(actual) !== stableJson(expected)) {
    throw new Error('EPUB people certificate does not match current authoritative source, gates, scope and identity generation');
  }
}
