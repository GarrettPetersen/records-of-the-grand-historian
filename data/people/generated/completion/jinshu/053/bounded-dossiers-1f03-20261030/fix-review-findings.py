from pathlib import Path
import subprocess
j=Path(__file__).resolve().parent;c=j/'candidate';ref='1f031602cf7aa15090b26ec997097d46dd2ef09f'
p=c/'scripts/generate-people-pages.mjs';s=p.read_text()
a=s.index('function personJsonLd(')
s=s[:a]+"""function personIdentityNote(person) {
  return person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) ? IDENTITY_UNCERTAINTY_NOTE : '';
}

function personSearchDescription(person) {
  return [person.description.en, personIdentityNote(person)].filter(Boolean).join('. ');
}

"""+s[a:]
s=s.replace("description: `${personPublicDescription(person)}. ${lifeSummaryForPerson(person)}. ${plural(person.references.length, 'source passage')}.`,", "description: [personPublicDescription(person), lifeSummaryForPerson(person), plural(person.references.length, 'source passage'), personIdentityNote(person)].filter(Boolean).join('. '),")
s=s.replace('return `<p class="person-lede">${escapeHtml(sentence)}</p>`;', 'return `<p class="person-lede">${escapeHtml(sentence)}${personIdentityNote(person) ? ` ${escapeHtml(personIdentityNote(person))}` : \'\'}</p>`;')
s=s.replace("${person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) ? `<p class=\"person-identity-note\">${escapeHtml(IDENTITY_UNCERTAINTY_NOTE)}</p>` : ''}",'')
s=s.replace('    person.description.en,\n','    personSearchDescription(person),\n')
s=s.replace('const description = `${personFullDisplayName(person)} — ${publicDescription}. ${chronology}; ${stats.passages} cited passages across the Chinese histories.`;', 'const description = `${personFullDisplayName(person)} — ${publicDescription}. ${personIdentityNote(person)} ${chronology}; ${stats.passages} cited passages across the Chinese histories.`;')
p.write_text(s)
p=c/'scripts/compile-people-catalog.mjs';s=p.read_text().replace('personSlug, resolvePeopleClusters, resolveAcceptedPeopleClusters','personSlug, resolveAcceptedPeopleClusters').replace('  --candidates-out PATH  Generated identity-candidate dossier path.\n','')
a=s.index("  if (resolvedPage.curation.status !==");b=s.index('  // The matching name block',a)
s=s[:a]+"""  if ([resolvedPage, ...ambiguousPages].some(person => person.curation.status !== 'needs-review')) {
    throw new Error('Historical pair decisions incorrectly granted independent chapter-person coverage');
  }
  const homonymWork = homonymCatalog.identityReviewByChapter;
  if (['fixture:011', 'fixture:012', 'fixture:013'].some(id => homonymWork[id]?.targetCases !== 1 || homonymWork[id].heldCases !== 1) ||
      Object.hasOwn(homonymCatalog, 'resolutionWorkByChapter')) {
    throw new Error('Chapter identity work must count bounded person cases, never pair comparisons');
  }
"""+s[b:]
a=s.index("  if (aliasCatalog.resolutionWorkByChapter[");b=s.index('  const reviewedAmbiguity',a)
s=s[:a]+"""  const alternateWork = aliasCatalog.identityReviewByChapter['fixture:014'];
  const sharedAliasRecord = aliasCatalog.people.find(person => person.localPeople.includes(alternateHomonym.localId));
  if (alternateWork?.targetCases !== 1 || alternateWork.heldCases !== 1 ||
      !sharedAliasRecord.localPeople.includes(resolvedHomonym.localId) || sharedAliasRecord.curation.status !== 'needs-review') {
    throw new Error('An accepted alias merge lost its chapter identity case or existing canonical members');
  }
"""+s[b:]
a=s.index('  if (reviewedHomonymCatalog.stats.unresolvedCandidateBlocks');b=s.index('  if (!/^per_',a)
s=s[:a]+"""  if (reviewedHomonymCatalog.stats.identityReviewPendingChapters !== homonymCorpus.chapters.length ||
      Object.values(reviewedHomonymCatalog.identityReviewByChapter).some(row => row.status !== 'review-required')) {
    throw new Error('A historical ambiguity pair incorrectly substituted for complete chapter-person proof coverage');
  }
"""+s[b:]
s=s.replace("['catalog', 'candidates', 'siteIndex']", "['catalog', 'siteIndex']").replace("out: 'catalog', candidatesOut: 'candidates', siteIndexOut:","out: 'catalog', siteIndexOut:").replace("!== 'catalog,candidates,siteIndex'", "!== 'catalog,siteIndex'")
p.write_text(s)
p=c/'scripts/lib/people-chapter-identity.mjs';s=p.read_text().replace('export function chapterIdentityInputs(book, chapter) {','export function chapterIdentityInputs(book, chapter, { requireAuditReport = true } = {}) {')
s=s.replace("  const editorial = editorialDecisionPath(book, chapter);", "  const editorial = editorialDecisionPath(book, chapter);\n  const dateFile = path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);\n  need(!requireAuditReport || fs.existsSync(dateFile), `Missing required independent date report: ${book}:${chapter}`);")
s=s.replace("dateAudit: byteDigest(fs.readFileSync(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`)))", "dateAudit: byteDigest(fs.existsSync(dateFile) ? fs.readFileSync(dateFile) : Buffer.from('null'))")
s=s.replace("bundle, chapterIdentityInputs(book, chapter));", "bundle, chapterIdentityInputs(book, chapter, { requireAuditReport: false }));")
s=s.replace('// required source/extraction/date files never fall back to empty values.', '// required source/extraction files never fall back to empty values. Catalog\n// assessment may explicitly record an absent date report; qualification and\n// preparation require it, and the independent chronology gate always remains.')
p.write_text(s)
f='scripts/test-people-progress.mjs';s=subprocess.check_output(['git','show',ref+':'+f]).decode();s=s.replace("      !Number.isInteger(chapter.unresolvedPeople) ||\n      !Number.isInteger(chapter.resolutionTargetPeople) ||\n      !Number.isInteger(chapter.resolutionComparisons)","      (chapter.state !== 'missing' && (!chapter.identityReview ||\n        !Number.isInteger(chapter.identityReview.targetCases) ||\n        !Number.isInteger(chapter.identityReview.heldCases)))")
(c/f).write_text(s)
f='scripts/sdk-people-resolve.mjs';s=subprocess.check_output(['git','show',ref+':'+f]).decode();needle='  const opts = parseArgs(process.argv.slice(2));';assert s.count(needle)==1
s=s.replace(needle,needle+"\n  if (!opts.selfTest && !opts.recoverOnly) {\n    throw new Error('Fresh pair resolution is retired. Use people:identity:prepare for one chapter. --recover-only preserves retrieval of existing runs/checkpoints and cannot commission a new pair wave.');\n  }")
(c/f).write_text(s)
p=c/'PEOPLE_ONE_HOUR_WORKFLOW.md';s=p.read_text();a=s.index('Current prototype state:');s=s[:a]+"""Current state: compact accepted-constraint replay, immutable dossiers and bounded
planning are implemented. Candidate scheduler entry points refuse fresh pair waves;
the shared qualification gate and website/ebook uncertainty disclosure have candidate
integration code. Jinshu053 has a native-accepted independent report covering all
72 cases/73 local records (63 reviewed uncertain), with exact unchanged input pins.
Code adoption, remaining CI fixture/command integration, a passing normal build,
PR/deployment and live nonempty receipt are still required. No chapter is published
or data-qualified by this checkpoint. The one-hour release target remains unproven.
""";p.write_text(s)
