import { loadCurrentIdentityEvidence } from './people-identity-evidence.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { projectPeopleProduct } from '../compile-people-catalog.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';
import { ChapterIdentityReviewError, acceptedCatalogIdentityView, chapterIdentityInputs, readChapterIdentityBundle, chapterIdentityEvidenceScopes, validateChapterIdentityBundle, assertReviewedIdentityCoverage, applyReviewedIdentityUncertainty } from './people-chapter-identity.mjs';
import { DATA_DIR, PEOPLE_DIR, extractionPath, readJson } from './people-content.mjs';
import { DATE_AUDIT_VERSION, dateAuditStatus } from './people-date-audit.mjs';
import { editorialDecisionPath, validateAppliedEditorialDecisions } from './people-editorial-decisions.mjs';
import { assertPeopleCatalogPublicationState } from './people-publication.mjs';
import { readPeopleCatalog, readPeopleSiteIndex } from './people-generated-data.mjs';
import { assertIdentitySeal, identityInputSeal, peopleDigest } from './people-identity-seal.mjs';

export class PeopleScopeGateError extends Error {}

export function assertChapterGates(extraction, currentPromptVersion, dateStatus, editorialDocument) {
  const scope = `${extraction.book}:${extraction.chapter}`;
  if (!Number.isInteger(currentPromptVersion) || currentPromptVersion < 1 ||
      extraction.run?.promptVersion !== currentPromptVersion) throw new PeopleScopeGateError(`Invalid or legacy prompt version: ${scope}`);
  if (!Array.isArray(extraction.translationRepairs)) throw new PeopleScopeGateError(`Missing editorial repair accounting: ${scope}`);
  if (extraction.translationRepairs.some(repair => repair.status === 'proposed')) {
    throw new PeopleScopeGateError(`Pending translation repair: ${scope}`);
  }
  if (extraction.translationRepairs.some(repair => repair.status === 'applied') && !editorialDocument) {
    throw new PeopleScopeGateError(`Missing independent applied editorial history: ${scope}`);
  }
  if (editorialDocument) {
    if (editorialDocument.book !== extraction.book || editorialDocument.chapter !== extraction.chapter) {
      throw new PeopleScopeGateError(`Editorial history scope mismatch: ${scope}`);
    }
    validateAppliedEditorialDecisions(editorialDocument, extraction);
  }
  if (dateStatus?.status !== 'audited' || dateStatus.auditVersion !== DATE_AUDIT_VERSION) {
    throw new PeopleScopeGateError(`Current independent date audit is ${dateStatus?.status ?? 'missing'}: ${scope}`);
  }
}

export const assertScopedIdentity = assertReviewedIdentityCoverage;

// Shared qualification reconstructs facts only from current, strictly validated members.
// Ebook callers assert the authoritative product contract before entering here.
export function loadQualifiedPeopleScope(scopes, { skipUnqualified = false,
  expectedInputs = null } = {}) {
  const catalogPath = path.join(PEOPLE_DIR, 'generated', 'catalog.json');
  const catalog = readPeopleCatalog(catalogPath);
  const siteIndex = readPeopleSiteIndex(path.join(PEOPLE_DIR, 'generated', 'site-index.json'));
  assertPeopleCatalogPublicationState(catalog);
  if (siteIndex.schemaVersion !== 2 || catalog.complete !== siteIndex.complete) {
    throw new Error('Sealed catalog and current site index publication state are inconsistent');
  }
  const seal = readJson(`${catalogPath}.identity-seal.json`);
  const inputs = identityInputSeal();
  assertIdentitySeal(seal, catalog, siteIndex, inputs);
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  if (catalog.currentPromptVersion !== config.promptVersion || siteIndex.currentPromptVersion !== config.promptVersion ||
      catalog.generatedAt !== siteIndex.generatedAt) throw new Error('Sealed identity generation does not match current configuration');
  const matcher = loadProperNounMatcher();
  const corpus = { chapters: [], localPeople: new Map() };
  const gateEvidence = [];
  const holds = [];
  const workload = { scopeChapters: scopes.length, candidateChapters: 0, validatedChapters: 0 };
  const identityView = acceptedCatalogIdentityView(catalog), identityCertificates = [], sourceCache = new Map();
  for (const { book, chapter } of scopes) {
    if (!fs.existsSync(extractionPath(book, chapter))) {
      if (!skipUnqualified) throw new Error(`Missing scoped extraction: ${book}:${chapter}`);
      holds.push({ book, chapter, reason: 'missing-extraction' });
      continue;
    }
    if (skipUnqualified) {
      // Only exclusion hints come from the sealed compiler generation. Fresh
      // report status may shortlist a newly approved chapter without a rebuild;
      // it never grants approval. Every candidate below still passes full gates.
      const chapterId = `${book}:${chapter}`;
      const compiled = siteIndex.chapters[chapterId];
      if (!compiled || compiled.promptVersion !== config.promptVersion) {
        holds.push({ book, chapter, reason: 'missing-or-legacy-compiled-chapter' });
        continue;
      }
      if (compiled.mentions.length && !fs.existsSync(path.join(PEOPLE_DIR, 'identity-reviews', book, `${chapter}.json`))) {
        holds.push({ book, chapter, reason: 'missing-independent-person-dossier-review' });
        continue;
      }
      const dateFile = path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);
      if (!fs.existsSync(dateFile)) {
        holds.push({ book, chapter, reason: 'missing-independent-date-audit' });
        continue;
      }
      const report = readJson(dateFile);
      if (report.auditVersion !== DATE_AUDIT_VERSION || report.status !== 'audited') {
        holds.push({ book, chapter, reason: `independent-date-audit-${report.status ?? 'invalid'}-v${report.auditVersion ?? 'missing'}` });
        continue;
      }
    }
    workload.candidateChapters += 1;
    try {
    const current = loadValidatedPeopleChapter(book, chapter, { properNounMatcher: matcher });
    const { raw, packet, extraction } = current;
    workload.validatedChapters += 1;
    const editorialFile = editorialDecisionPath(book, chapter);
    const editorial = fs.existsSync(editorialFile) ? readJson(editorialFile) : null;
    const dateStatus = dateAuditStatus(book, chapter);
    assertChapterGates(extraction, config.promptVersion, dateStatus, editorial);
    let identityCertificate = null, identityBundle = null;
    if (current.localPeople.size) {
      identityBundle = readChapterIdentityBundle(book, chapter);
      const evidenceSources = loadCurrentIdentityEvidence(identityBundle, current, matcher, sourceCache);
      identityCertificate = validateChapterIdentityBundle(identityView, evidenceSources, { book, chapter }, identityBundle, chapterIdentityInputs(book, chapter));
      assertScopedIdentity(current, identityView, [identityCertificate]);
    }
    const report = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
    for (const person of extraction.people) {
      if (corpus.localPeople.has(person.localId)) throw new Error(`Duplicate scoped local person ${person.localId}`);
    }
    gateEvidence.push({ book, chapter, personCount: current.localPeople.size, inputFingerprint: packet.input.chapterFingerprint, inputUnitCount: packet.input.unitCount, extraction: peopleDigest(raw), source: peopleDigest(readJson(path.join(DATA_DIR, book, `${chapter}.json`))),
      editorial: peopleDigest(editorial), dateAudit: peopleDigest(report), identityReview: peopleDigest(identityBundle) });
    if (identityCertificate) identityCertificates.push(identityCertificate);
    corpus.chapters.push({ extraction });
    for (const [localId, person] of current.localPeople) corpus.localPeople.set(localId, person);
    } catch (error) {
      if (!skipUnqualified || !(error instanceof PeopleScopeGateError || error instanceof ChapterIdentityReviewError ||
          ['PeopleExtractionValidationError', 'EditorialDecisionValidationError'].includes(error.name))) throw error;
      holds.push({ book, chapter, reason: String(error.message) });
    }
  }
  assertScopedIdentity(corpus, identityView, identityCertificates);
  const roles = readJson(path.join(PEOPLE_DIR, 'curation', 'role-vocabulary.json'));
  const overrides = readJson(path.join(PEOPLE_DIR, 'curation', 'overrides.json'));
  const projected = projectPeopleProduct(corpus, catalog, new Map(roles.roles.map(role => [role.id, role.label])), overrides.people);
  applyReviewedIdentityUncertainty(projected.catalog, identityCertificates);
  if (!skipUnqualified && projected.catalog.people.length === 0) throw new Error('Certified product contains no people');
  if (identityInputSeal() !== inputs) throw new Error('Identity inputs changed while qualifying product');
  for (const evidence of gateEvidence) {
    const { book, chapter } = evidence;
    const editorialFile = editorialDecisionPath(book, chapter);
    const currentEditorial = fs.existsSync(editorialFile) ? readJson(editorialFile) : null;
    const report = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
    const status = dateAuditStatus(book, chapter);
    if (evidence.extraction !== peopleDigest(readJson(extractionPath(book, chapter))) ||
        evidence.source !== peopleDigest(readJson(path.join(DATA_DIR, book, `${chapter}.json`))) ||
        evidence.editorial !== peopleDigest(currentEditorial) || evidence.dateAudit !== peopleDigest(report) ||
        status.status !== 'audited' || status.auditVersion !== DATE_AUDIT_VERSION ||
        evidence.identityReview !== peopleDigest(identityCertificates.some(certificate => certificate.scope.book === book && certificate.scope.chapter === chapter) ? readChapterIdentityBundle(book, chapter) : null)) {
      throw new Error(`Editorial/date evidence changed while qualifying ${book}:${chapter}`);
    }
  }
  if (expectedInputs !== null && expectedInputs !== inputs) throw new Error('Qualified scope expected input pin is stale');
  return { ...projected, globalCatalog: catalog, holds, workload, gateEvidence, identityCertificates, identity: peopleDigest(seal), inputs };
}
