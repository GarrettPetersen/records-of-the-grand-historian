function normalizedChapterId(value) {
  const chapter = String(value);
  if (!/^\d{1,3}$/u.test(chapter)) throw new Error(`Invalid ebook chapter ID ${chapter}`);
  return chapter.padStart(3, '0');
}

export function assessEbookPeopleReadiness(siteContext, product, { allowPreview = false } = {}) {
  if (!product?.book || !Array.isArray(product.chapters) || product.chapters.length === 0) {
    throw new Error('Ebook people readiness requires a book and at least one chapter');
  }
  if (!siteContext?.active || !siteContext.catalog || !siteContext.siteIndex) {
    return {
      active: false,
      ready: false,
      preview: false,
      reason: siteContext?.reason ?? 'people-catalog-unavailable',
      chapterIds: new Set(product.chapters.map(normalizedChapterId)),
      people: [],
      missingChapters: [],
      legacyChapters: [],
      peopleNeedingReview: [],
    };
  }

  const chapterIds = new Set(product.chapters.map(normalizedChapterId));
  const chapterRecords = siteContext.siteIndex.chapters ?? {};
  const currentPromptVersion = siteContext.siteIndex.currentPromptVersion;
  const missingChapters = [];
  const legacyChapters = [];
  for (const chapter of chapterIds) {
    const record = chapterRecords[`${product.book}:${chapter}`];
    if (!record) {
      missingChapters.push(chapter);
      continue;
    }
    if (record.promptVersion < currentPromptVersion) legacyChapters.push(chapter);
  }

  const people = siteContext.catalog.people.filter((person) => person.localPeople.some((localId) => {
    const [book, chapter] = localId.split(':');
    return book === product.book && chapterIds.has(chapter);
  }));
  const peopleNeedingReview = people.filter((person) => person.curation?.status === 'needs-review');
  const ready = people.length > 0 && missingChapters.length === 0 && legacyChapters.length === 0 &&
    peopleNeedingReview.length === 0;
  const active = people.length > 0 && (ready || allowPreview);

  return {
    active,
    ready,
    preview: active && !ready,
    reason: active
      ? null
      : people.length === 0
        ? 'no-people-in-product'
        : 'product-catalog-incomplete',
    chapterIds,
    people,
    missingChapters,
    legacyChapters,
    peopleNeedingReview,
  };
}

export function ebookPeopleReadinessErrors(peopleQa, { allowPreview = false } = {}) {
  if (!peopleQa?.active) return [];
  const errors = [];
  const hasBlockers = (peopleQa.missingChapters?.length || 0) > 0 ||
    (peopleQa.legacyChapters?.length || 0) > 0 || Number(peopleQa.peopleNeedingReview || 0) > 0;

  if (peopleQa.ready === true) {
    if (peopleQa.preview === true) {
      errors.push('Publication-ready people glossary is also marked as a preview.');
    }
    if (hasBlockers) {
      errors.push('Publication-ready people glossary retains chapter-coverage or identity-review blockers.');
    }
    return errors;
  }

  if (peopleQa.preview !== true) {
    errors.push('Active people glossary is neither publication-ready nor marked as a preview.');
    return errors;
  }
  if (allowPreview) return errors;

  errors.push('People glossary is an incomplete preview and is not valid for publication.');
  if (hasBlockers) {
    errors.push('Active people glossary retains chapter-coverage or identity-review blockers.');
  }
  return errors;
}
