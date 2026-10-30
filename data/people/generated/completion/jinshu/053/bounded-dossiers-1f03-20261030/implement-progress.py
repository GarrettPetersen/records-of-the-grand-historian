from pathlib import Path
import subprocess
J=Path(__file__).resolve().parent;C=J/'candidate';ref='1f031602cf7aa15090b26ec997097d46dd2ef09f'
s=subprocess.check_output(['git','show',ref+':generate-progress.js']).decode();a=s.index('function applyPeopleIdentityProgress(');b=s.index('function buildPeopleGlossaryProgress(',a)
s=s[:a]+r'''function applyPeopleIdentityProgress(byChapter, summary) {
  assertPeopleProgress(fs.existsSync(PEOPLE_CATALOG_PATH), `missing ${PEOPLE_CATALOG_PATH}; run npm run people:catalog`);
  const catalog = readPeopleCatalog(PEOPLE_CATALOG_PATH);
  assertPeopleProgress(catalog.stats?.sourceChapters === summary.sourceChapters && catalog.stats?.extractedChapters === summary.extractedChapters,
    'canonical catalog is stale relative to extraction coverage; run npm run people:catalog');
  assertPeopleProgress(catalog.identityReviewByChapter && typeof catalog.identityReviewByChapter === 'object',
    'canonical catalog lacks independent person-review coverage; run npm run people:catalog');
  const states = { current: 0, 'date-review': 0, 'editorial-review': 0, 'identity-review': 0, rereview: 0, missing: 0 };
  let identityReviewedChapters = 0, identityPendingChapters = 0, identityPendingCases = 0, reviewedAmbiguousCases = 0, zeroPersonReviews = 0;
  for (const [key, chapter] of byChapter) {
    const review = catalog.identityReviewByChapter[key];
    if (chapter.state !== 'missing') assertPeopleProgress(review, `missing compiled identity coverage for ${key}`);
    chapter.identityReview = review ?? null;
    if (chapter.state === 'current') {
      if (review.status === 'review-required') { identityPendingChapters += 1; identityPendingCases += review.heldCases; }
      else if (review.status === 'reviewed') identityReviewedChapters += 1;
      else if (review.status === 'no-people') zeroPersonReviews += 1;
      reviewedAmbiguousCases += review.reviewedAmbiguousCases;
    }
    chapter.glossaryState = chapter.state === 'current'
      ? chapter.dateAudit.status !== 'audited' ? 'date-review'
        : chapter.pendingTranslationRepairs > 0 ? 'editorial-review'
        : review.status === 'review-required' ? 'identity-review' : 'current'
      : chapter.state;
    states[chapter.glossaryState] += 1;
  }
  return { ...summary,
    // Gate-ready is a staging metric; deployed nonempty receipts are recorded separately.
    completeChapters: states.current, dateReviewChapters: states['date-review'], editorialReviewChapters: states['editorial-review'],
    identityReviewChapters: states['identity-review'], identityReviewedChapters, identityPendingChapters, identityPendingCases,
    reviewedAmbiguousCases, reviewedAmbiguousPeople: catalog.stats.reviewedAmbiguousPeople, zeroPersonReviews,
    completePercent: summary.sourceChapters > 0 ? states.current / summary.sourceChapters * 100 : 0 };
}

'''+s[b:]
(C/'generate-progress.js').write_text(s)
# The old broad identity scheduler must refuse fresh pair work. It retains its
# existing sealed artifacts and exact recovery command; no flags pretend pairs cleared.
f='scripts/run-people-deadline-wave.mjs';s=subprocess.check_output(['git','show',ref+':'+f]).decode()
# Insert at the function's operational boundary, after parseArgs, before planning.
needle='  const opts = parseArgs(process.argv.slice(2));'
assert s.count(needle)==1
s=s.replace(needle,needle+"\n  if (!opts.selfTest && opts.phase === 'resolution') {\n    throw new Error('Fresh all-pairs identity waves are retired. Preserve retained claims/artifacts; prepare one chapter with people:identity:prepare and independently review its dossiers. Historical recovery requires the exact saved worker invocation.');\n  }")
(C/f).write_text(s)
f='package.json';p=__import__('json').loads(subprocess.check_output(['git','show',ref+':'+f]));p['scripts']['people:identity:prepare']='node scripts/prepare-people-chapter-identity.mjs';p['scripts']['people:identity:self-test']='node --test scripts/test-people-identity-dossiers.mjs scripts/test-people-identity-dossier-store.mjs scripts/test-people-chapter-identity.mjs';(C/f).write_text(__import__('json').dumps(p,indent=2)+'\n')
