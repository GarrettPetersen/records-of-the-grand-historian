from pathlib import Path
import subprocess
J=Path(__file__).resolve().parent; C=J/'candidate'
ref='1f031602cf7aa15090b26ec997097d46dd2ef09f'
def source(f):return subprocess.check_output(['git','show',ref+':'+f]).decode()
p=C/'scripts/lib/people-chapter-identity.mjs';s=p.read_text().replace("export class ChapterIdentityReviewError extends Error {}", "export class ChapterIdentityReviewError extends Error {}\nconst validatedCertificates = new WeakSet();\nexport const IDENTITY_UNCERTAINTY_NOTE = 'It is not yet established whether this person is the same as similarly named people in other chapters.';")
s=s.replace("return validateRetainedDossierReview(index, bundle.plan, bundle.report, sourceUnits,", "const certificate = validateRetainedDossierReview(index, bundle.plan, bundle.report, sourceUnits,")
s=s.replace("bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, inputs, localNameKeys);", "bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, inputs, localNameKeys);\n    validatedCertificates.add(certificate);\n    return certificate;")
s+=r'''
export function assertReviewedIdentityCoverage(corpus, view, certificates) {
  const coverage = new Map();
  need(Array.isArray(certificates), 'Current independently validated person certificates required');
  for (const certificate of certificates) {
    need(validatedCertificates.has(certificate), 'Identity coverage requires a current validated report, not a serialized certificate');
    for (const row of certificate.retained) for (const localId of row.localPeople) {
      need(!coverage.has(localId), `Duplicate independent identity coverage ${localId}`);
      need(view.localPersonMap.get(localId) === row.canonicalPersonId, `Changed accepted canonical assignment ${localId}`);
      coverage.set(localId, row);
    }
  }
  for (const localId of corpus.localPeople.keys()) need(coverage.has(localId), `Missing independent person coverage ${localId}`);
  return coverage;
}

export function applyReviewedIdentityUncertainty(projectedCatalog, certificates) {
  const uncertain = new Set(certificates.flatMap(certificate => certificate.retained.filter(row => row.unresolvedIdentity).map(row => row.canonicalPersonId)));
  for (const person of projectedCatalog.people) if (uncertain.has(person.id) && !person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE)) {
    person.curation.notes.push(IDENTITY_UNCERTAINTY_NOTE);
  }
}
''';p.write_text(s)
f='scripts/lib/people-qualified-scope.mjs';s=source(f)
s=s.replace("import { isCompactPeopleExtraction } from './people-compact.mjs';", "import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';\nimport { ChapterIdentityReviewError, acceptedCatalogIdentityView, chapterIdentityInputs, readChapterIdentityBundle, chapterIdentityEvidenceScopes, validateChapterIdentityBundle, assertReviewedIdentityCoverage, applyReviewedIdentityUncertainty } from './people-chapter-identity.mjs';")
s=s.replace("import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';\n",'').replace("import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../validate-people-extraction.mjs';\n",'')
a=s.index('export function assertScopedIdentity('); b=s.index('// Shared qualification',a)
s=s[:a]+"export const assertScopedIdentity = assertReviewedIdentityCoverage;\n\n"+s[b:]
a=s.index('  const unresolvedIds = ');b=s.index('  for (const { book, chapter } of scopes)',a)
s=s[:a]+"  const identityView = acceptedCatalogIdentityView(catalog), identityCertificates = [], sourceCache = new Map();\n"+s[b:]
a=s.index('      if (unresolvedChapters.has(');b=s.index('      const dateFile',a)
s=s[:a]+"      if (!fs.existsSync(path.join(PEOPLE_DIR, 'identity-reviews', book, `${chapter}.json`))) {\n        holds.push({ book, chapter, reason: 'missing-independent-person-dossier-review' });\n        continue;\n      }\n"+s[b:]
a=s.index('    const raw = readJson(extractionPath(');b=s.index('    workload.validatedChapters',a)
s=s[:a]+"    const current = loadValidatedPeopleChapter(book, chapter, { properNounMatcher: matcher });\n    const { raw, packet, extraction } = current;\n"+s[b:]
a=s.index('    const chapterCorpus = ');b=s.index('    const report = ',a)
s=s[:a]+r'''    let identityCertificate = null, identityBundle = null;
    if (current.localPeople.size) {
      identityBundle = readChapterIdentityBundle(book, chapter);
      const evidenceSources = new Map([[`${book}:${chapter}`, current]]);
      for (const evidenceScope of chapterIdentityEvidenceScopes(identityBundle)) {
        const key = `${evidenceScope.book}:${evidenceScope.chapter}`;
        if (evidenceSources.has(key)) continue;
        if (!sourceCache.has(key)) sourceCache.set(key, loadValidatedPeopleChapter(evidenceScope.book, evidenceScope.chapter,
          { properNounMatcher: matcher, strictAliasDispositions: false }));
        evidenceSources.set(key, sourceCache.get(key));
      }
      identityCertificate = validateChapterIdentityBundle(identityView, evidenceSources, { book, chapter }, identityBundle, chapterIdentityInputs(book, chapter));
      assertScopedIdentity(current, identityView, [identityCertificate]);
    }
'''+s[b:]
s=s.replace("editorial: peopleDigest(editorial), dateAudit: peopleDigest(report) });", "editorial: peopleDigest(editorial), dateAudit: peopleDigest(report), identityReview: peopleDigest(identityBundle) });\n    if (identityCertificate) identityCertificates.push(identityCertificate);")
a=s.index('    for (const person of extraction.people) {\n      if (corpus.localPeople.has(person.localId))',s.index('    corpus.chapters.push'))
b=s.index('    } catch (error)',a)
s=s[:a]+"    for (const [localId, person] of current.localPeople) corpus.localPeople.set(localId, person);\n"+s[b:]
s=s.replace("error instanceof PeopleScopeGateError ||", "error instanceof PeopleScopeGateError || error instanceof ChapterIdentityReviewError ||")
s=s.replace('  assertScopedIdentity(corpus, catalog, seal);','  assertScopedIdentity(corpus, identityView, identityCertificates);')
s=s.replace("  if (!skipUnqualified && projected.catalog.people.length", "  applyReviewedIdentityUncertainty(projected.catalog, identityCertificates);\n  if (!skipUnqualified && projected.catalog.people.length")
s=s.replace("status.status !== 'audited' || status.auditVersion !== DATE_AUDIT_VERSION)", "status.status !== 'audited' || status.auditVersion !== DATE_AUDIT_VERSION ||\n        evidence.identityReview !== peopleDigest(identityCertificates.some(certificate => certificate.scope.book === book && certificate.scope.chapter === chapter) ? readChapterIdentityBundle(book, chapter) : null))")
s=s.replace("workload, gateEvidence, identity:","workload, gateEvidence, identityCertificates, identity:")
(C/f).write_text(s)
# Show the exact note on the public person page. Ebook renderer is handled next.
f='scripts/generate-people-pages.mjs';s=source(f);s="import { IDENTITY_UNCERTAINTY_NOTE } from './lib/people-chapter-identity.mjs';\n"+s
s=s.replace("addSection('Overview', `${personOverview(person)}${renderPersonFacets(person)}`", "addSection('Overview', `${personOverview(person)}${person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) ? `<p class=\"person-identity-note\">${escapeHtml(IDENTITY_UNCERTAINTY_NOTE)}</p>` : ''}${renderPersonFacets(person)}`")
(C/f).write_text(s)
