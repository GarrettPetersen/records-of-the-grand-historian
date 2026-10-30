from pathlib import Path
import subprocess,json
J=Path(__file__).resolve().parent;C=J/'candidate';ref='1f031602cf7aa15090b26ec997097d46dd2ef09f'
def source(f):return subprocess.check_output(['git','show',ref+':'+f]).decode()
p=C/'scripts/lib/people-chapter-identity.mjs';s=p.read_text().replace("extractionPath, readJson }", "extractionPath, readJson, contentUnits }")
s+="\n"+r'''// Full compilation has already run the native corpus validator. Reuse those
// normalized people and load only the primary units needed by preserved reports.
export function assessCorpusIdentityReviews(corpus, clusters) {
  const catalog = { localPersonMap: {}, people: clusters.map(cluster => ({ id: cluster.canonicalPersonId, retiredIds: cluster.retiredIds })) };
  for (const cluster of clusters) for (const id of cluster.localPeople) catalog.localPersonMap[id] = cluster.canonicalPersonId;
  const view = acceptedCatalogIdentityView(catalog), chapters = new Map(), pendingLocalPeople = new Set(), certificates = [], work = {};
  for (const { extraction } of corpus.chapters) chapters.set(`${extraction.book}:${extraction.chapter}`, { extraction, localPeople: new Map() });
  for (const [id, person] of corpus.localPeople) {
    const chapter = chapters.get(`${person.book}:${person.chapter}`);
    need(chapter, `Missing validated chapter for ${id}`); chapter.localPeople.set(id, person);
  }
  const materialize = (book, chapter) => {
    const key = `${book}:${chapter}`, result = chapters.get(key);
    need(result, `Missing validated identity source chapter ${key}`);
    if (!result.packet) result.packet = { units: contentUnits(readJson(path.join(DATA_DIR, book, `${chapter}.json`))) };
    return result;
  };
  for (const [key, own] of chapters) {
    const { book, chapter } = own.extraction, cases = new Set([...own.localPeople.keys()].map(id => view.localPersonMap.get(id))).size;
    let certificate = null, reason = null;
    if (cases) {
      try {
        const bundle = readChapterIdentityBundle(book, chapter), evidence = new Map();
        for (const scope of chapterIdentityEvidenceScopes(bundle)) evidence.set(`${scope.book}:${scope.chapter}`, materialize(scope.book, scope.chapter));
        certificate = validateChapterIdentityBundle(view, evidence, { book, chapter }, bundle, chapterIdentityInputs(book, chapter));
        assertReviewedIdentityCoverage(own, view, [certificate]); certificates.push(certificate);
      } catch (error) {
        if (!(error instanceof ChapterIdentityReviewError)) throw error;
        reason = error.message;
        for (const id of own.localPeople.keys()) pendingLocalPeople.add(id);
      }
    }
    work[key] = { targetCases: cases, approvedCases: certificate ? certificate.retained.length : 0,
      heldCases: reason ? cases : 0, reviewedAmbiguousCases: certificate ? certificate.ambiguity.length : 0,
      status: reason ? 'review-required' : cases ? 'reviewed' : 'no-people', reason };
  }
  return { work, pendingLocalPeople, certificates,
    pendingChapters: Object.values(work).filter(row => row.status === 'review-required').length,
    reviewedAmbiguousPeople: new Set(certificates.flatMap(certificate => certificate.retained.filter(row => row.unresolvedIdentity).map(row => row.canonicalPersonId))).size };
}
''';p.write_text(s)
f='scripts/compile-people-catalog.mjs';s=source(f)
s=s.replace("import { buildPeopleResolutionCandidateDocument } from './build-people-resolution-candidates.mjs';", "import { assessCorpusIdentityReviews, applyReviewedIdentityUncertainty } from './lib/people-chapter-identity.mjs';")
s=s.replace('  writePeopleResolutionCandidates,\n','').replace("personSlug, resolvePeopleClusters }", "personSlug, resolvePeopleClusters, resolveAcceptedPeopleClusters }")
s=s.replace('  const candidateDocument = buildPeopleResolutionCandidateDocument(corpus);\n  const resolved = resolvePeopleClusters(corpus.localPeople, resolutionDocuments);', '  const resolved = resolveAcceptedPeopleClusters(corpus.localPeople, resolutionDocuments);')
a=s.index('  const unresolvedState = unresolvedCandidateState(',s.index('export function compilePeopleCatalog'))
b=s.index('  const roleData = ',a)
s=s[:a]+"  const identityReviews = assessCorpusIdentityReviews(corpus, resolved.clusters);\n  const unresolvedLocalPeople = identityReviews.pendingLocalPeople;\n"+s[b:]
s=s.replace('    unresolvedCandidateBlocks: unresolvedBlocks.length,','    identityReviewPendingChapters: identityReviews.pendingChapters,\n    reviewedAmbiguousPeople: identityReviews.reviewedAmbiguousPeople,')
s=s.replace('      unresolvedCandidateBlockIds: unresolvedBlocks.map((block) => block.id),\n      resolutionWorkByChapter,','      identityReviewByChapter: identityReviews.work,')
s=s.replace('  assertPeopleCatalogPublicationState(catalog);\n  const validateCatalog', '  applyReviewedIdentityUncertainty(catalog, identityReviews.certificates);\n  assertPeopleCatalogPublicationState(catalog);\n  const validateCatalog')
s=s.replace('    unresolvedCanonicalPeople: [...new Set([...unresolvedLocalPeople].map(id => localMap.get(id)))].sort(),\n    candidates: candidateDocument,','    identityReviewMetrics: { generatedPairs: 0, pendingChapters: identityReviews.pendingChapters, reviewedAmbiguousPeople: identityReviews.reviewedAmbiguousPeople },')
s=s.replace('  candidates: writePeopleResolutionCandidates,\n','').replace('  writers.candidates(options.candidatesOut, result.candidates);\n','')
s=s.replace('`${result.catalog.stats.unresolvedCandidateBlocks} unresolved identity block(s)`','`${result.catalog.stats.identityReviewPendingChapters} person-review pending chapter(s)`')
s=s.replace("schemaVersion: 1, kind: 'people-global-identity-seal', inputs: inputSeal,", "schemaVersion: 2, kind: 'people-accepted-identity-seal', inputs: inputSeal,")
s=s.replace('    unresolvedCanonicalPeople: result.unresolvedCanonicalPeople,','    identityReviews: peopleDigest(result.catalog.identityReviewByChapter),')
s=s.replace('`${result.catalog.stats.localPeople} local people; ${result.catalog.stats.unresolvedCandidateBlocks} ` +\n    `unresolved block(s);', '`${result.catalog.stats.localPeople} local people; ${result.catalog.stats.identityReviewPendingChapters} ` +\n    `person-review pending chapter(s);')
# An option that used to regenerate pair work must fail rather than silently do nothing.
s=s.replace("else if (arg === '--candidates-out') opts.candidatesOut = path.resolve(argv[++index]);", "else if (arg === '--candidates-out') throw new Error('Pair generation is retired from people:catalog; use chapter dossier review');")
(C/f).write_text(s)
f='scripts/lib/people-identity-seal.mjs';s=source(f)
a=s.index('export function assertIdentitySeal(')
s=s[:a]+r'''export function assertIdentitySeal(seal, catalog, siteIndex, currentInputs) {
  if (seal?.schemaVersion !== 2 || seal.kind !== 'people-accepted-identity-seal' ||
      seal.inputs !== currentInputs || seal.catalog !== peopleDigest(catalog) ||
      seal.siteIndex !== peopleDigest(siteIndex) || seal.identityReviews !== peopleDigest(catalog.identityReviewByChapter)) {
    throw new Error('Missing, stale or invalid accepted identity seal; rerun people:catalog');
  }
}
'''
# Report inputs are versioned publication evidence, not global candidate closures.
s=s.replace("  files.push('data/people/config.json'", "  if (fs.existsSync(path.join(root, 'data/people/identity-reviews'))) visit('data/people/identity-reviews', file => file.endsWith('.json'));\n  files.push('data/people/config.json'")
(C/f).write_text(s)
f='scripts/lib/people-publication.mjs';s=source(f).replace("'unresolvedCandidateBlocks'", "'identityReviewPendingChapters'");(C/f).write_text(s)
f='data/people/schema/catalog.schema.json';x=json.loads(source(f));x['required']=[k for k in x['required'] if k not in ['unresolvedCandidateBlockIds','resolutionWorkByChapter']]+['identityReviewByChapter']
for k in ['unresolvedCandidateBlockIds','resolutionWorkByChapter']:x['properties'].pop(k,None)
stats=x['properties']['stats'];stats['required']=[k for k in stats['required'] if k!='unresolvedCandidateBlocks']+['identityReviewPendingChapters','reviewedAmbiguousPeople'];stats['properties'].pop('unresolvedCandidateBlocks');stats['properties'].update({k:{'type':'integer','minimum':0} for k in ['identityReviewPendingChapters','reviewedAmbiguousPeople']})
x['properties']['identityReviewByChapter']={'type':'object','additionalProperties':{'type':'object','additionalProperties':False,'required':['targetCases','approvedCases','heldCases','reviewedAmbiguousCases','status','reason'],'properties':{**{k:{'type':'integer','minimum':0} for k in ['targetCases','approvedCases','heldCases','reviewedAmbiguousCases']},'status':{'enum':['reviewed','review-required','no-people']},'reason':{'type':['string','null']}}}}
(C/f).parent.mkdir(parents=True,exist_ok=True);(C/f).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
# Preserve the same public uncertainty note in ebook entries.
f='scripts/lib/ebook-people-render.mjs';s=source(f);s="import { IDENTITY_UNCERTAINTY_NOTE } from './people-chapter-identity.mjs';\n"+s;s=s.replace('  <p class="glossary-description">${escapeXml(personPublicDescription(person))}</p>', '  <p class="glossary-description">${escapeXml(personPublicDescription(person))}</p>\n  ${person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) ? `<p class="glossary-identity-note">${escapeXml(IDENTITY_UNCERTAINTY_NOTE)}</p>` : \'\'}');(C/f).write_text(s)
