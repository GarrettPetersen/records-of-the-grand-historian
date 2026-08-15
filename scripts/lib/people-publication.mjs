const BLOCKER_FIELDS = [
  'missingChapters',
  'legacyChapters',
  'legacyLocalPeople',
  'pendingTranslationRepairs',
  'unresolvedCandidateBlocks',
];

export function peopleCatalogPublicationBlockers(stats) {
  const blockers = [];
  for (const field of BLOCKER_FIELDS) {
    const count = stats?.[field];
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`People catalog has invalid ${field} count`);
    }
    if (count > 0) blockers.push({ field, count });
  }
  return blockers;
}

export function peopleCatalogIsComplete(stats) {
  return peopleCatalogPublicationBlockers(stats).length === 0;
}

export function peopleCatalogIsPublishable(catalog) {
  const stats = catalog?.stats;
  return Array.isArray(catalog?.people) && catalog.people.length > 0 &&
    Number.isInteger(stats?.extractedChapters) && stats.extractedChapters > 0 &&
    Number.isInteger(stats?.pendingTranslationRepairs) && stats.pendingTranslationRepairs === 0;
}

export function assertPeopleCatalogPublicationState(catalog) {
  const stats = catalog?.stats;
  for (const field of ['sourceChapters', 'extractedChapters', 'missingChapters']) {
    if (!Number.isInteger(stats?.[field]) || stats[field] < 0) {
      throw new Error(`People catalog has invalid ${field} count`);
    }
  }
  if (stats.sourceChapters !== stats.extractedChapters + stats.missingChapters) {
    throw new Error('People catalog chapter coverage counts are inconsistent');
  }
  if (!Array.isArray(catalog.missingChapterIds) || catalog.missingChapterIds.length !== stats.missingChapters) {
    throw new Error('People catalog missing-chapter list does not match its count');
  }
  const expectedComplete = peopleCatalogIsComplete(stats);
  if (catalog.complete !== expectedComplete) {
    throw new Error(
      `People catalog complete=${catalog.complete} contradicts ${peopleCatalogPublicationBlockers(stats).length} publication blocker(s)`,
    );
  }
}
