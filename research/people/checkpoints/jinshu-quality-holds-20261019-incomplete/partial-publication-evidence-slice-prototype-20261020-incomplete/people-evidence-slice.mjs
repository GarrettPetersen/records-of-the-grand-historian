// A corpus input slice, not a publication decision. Callers must independently
// establish chapter eligibility and current identity decisions before using it.
// In particular, filtering the candidate universe to this slice is NOT a valid
// identity-resolution gate.

const CHAPTER_ID = /^[a-z0-9_-]+:\d{3}$/u;
const LOCAL_PERSON_ID = /[a-z0-9_-]+:\d{3}:p\d{3,}/gu;

function assertNoExcludedPersonReferences(value, selectedPeople, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoExcludedPersonReferences(item, selectedPeople, `${location}[${index}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      assertNoExcludedPersonReferences(item, selectedPeople, `${location}.${key}`);
    }
  } else if (typeof value === 'string') {
    for (const match of value.matchAll(LOCAL_PERSON_ID)) {
      if (!selectedPeople.has(match[0])) {
        throw new Error(`${location} references a person outside the evidence slice: ${match[0]}`);
      }
    }
  }
}

/**
 * Reconstruct canonical-compiler inputs from only the explicitly selected,
 * already validated chapter extractions. This makes it impossible to inherit
 * a hidden member's claims by selecting a previously aggregated person.
 *
 * Returns fresh objects, preserving honest whole-corpus coverage. Any local
 * person reference outside the slice fails closed rather than being silently
 * omitted or rewritten. Resolution decisions and curation overrides are NOT
 * selected here: they require a separately verified identity boundary.
 */
export function slicePeopleCorpusEvidence(corpus, chapterIds) {
  if (!corpus || !Array.isArray(corpus.chapters) || !corpus.coverage ||
      !Array.isArray(corpus.coverage.missingChapterIds) || !Array.isArray(chapterIds)) {
    throw new Error('Evidence slicing requires chapter inputs and authoritative coverage');
  }
  const requested = new Set(chapterIds);
  if (requested.size !== chapterIds.length || chapterIds.some((id) => typeof id !== 'string' || !CHAPTER_ID.test(id))) {
    throw new Error('Evidence slice chapter IDs must be unique valid chapter IDs');
  }
  const chaptersById = new Map();
  for (const chapter of corpus.chapters) {
    const extraction = chapter?.extraction;
    const id = `${extraction?.book}:${extraction?.chapter}`;
    if (!CHAPTER_ID.test(id) || chaptersById.has(id)) throw new Error(`Invalid or duplicate extracted chapter ${id}`);
    chaptersById.set(id, chapter);
  }
  const missing = corpus.coverage.missingChapterIds;
  const missingSet = new Set(missing);
  if (missingSet.size !== missing.length || missing.some((id) => typeof id !== 'string' || !CHAPTER_ID.test(id) || chaptersById.has(id)) ||
      corpus.coverage.extractedChapters !== chaptersById.size ||
      corpus.coverage.sourceChapters !== chaptersById.size + missing.length) {
    throw new Error('Evidence slice coverage is inconsistent');
  }
  for (const id of requested) {
    if (!chaptersById.has(id)) throw new Error(`Evidence slice chapter is not extracted: ${id}`);
  }
  const chapters = [...chaptersById.entries()]
    .filter(([id]) => requested.has(id))
    .map(([, chapter]) => structuredClone(chapter));
  const localPeople = new Map();
  for (const { extraction } of chapters) {
    const chapterId = `${extraction.book}:${extraction.chapter}`;
    if (!Array.isArray(extraction.people) || !Array.isArray(extraction.claims) || !Array.isArray(extraction.mentions) ||
        !Number.isInteger(extraction.run?.promptVersion)) {
      throw new Error(`Evidence slice requires a normalized extraction for ${chapterId}`);
    }
    for (const person of extraction.people) {
      if (typeof person.localId !== 'string' || !new RegExp(`^${chapterId}:p\\d{3,}$`, 'u').test(person.localId) || localPeople.has(person.localId)) {
        throw new Error(`Invalid or duplicate person ID in ${chapterId}: ${person.localId}`);
      }
      localPeople.set(person.localId, {
        ...person, book: extraction.book, chapter: extraction.chapter,
        promptVersion: extraction.run.promptVersion, claims: [], mentions: [],
      });
    }
  }
  for (const { extraction } of chapters) {
    const chapterId = `${extraction.book}:${extraction.chapter}`;
    assertNoExcludedPersonReferences(extraction, localPeople, chapterId);
    for (const claim of extraction.claims) {
      const person = localPeople.get(claim.subject);
      if (!person || `${person.book}:${person.chapter}` !== chapterId) throw new Error(`Invalid claim subject in ${chapterId}: ${claim.subject}`);
      if (typeof claim.id !== 'string' || !claim.id.startsWith(`${chapterId}:c`) ||
          !Array.isArray(claim.evidence) || claim.evidence.some((ref) => typeof ref !== 'string' || !ref.startsWith(`${chapterId}:`))) {
        throw new Error(`Claim has evidence outside its source chapter: ${claim.id}`);
      }
      person.claims.push(claim);
    }
    for (const mention of extraction.mentions) {
      const person = localPeople.get(mention.person);
      if (!person || `${person.book}:${person.chapter}` !== chapterId) throw new Error(`Invalid mention person in ${chapterId}: ${mention.person}`);
      if (typeof mention.id !== 'string' || !mention.id.startsWith(`${chapterId}:m`)) throw new Error(`Invalid mention ID in ${chapterId}: ${mention.id}`);
      person.mentions.push(mention);
    }
  }
  return {
    chapters,
    localPeople,
    coverage: {
      sourceChapters: corpus.coverage.sourceChapters,
      extractedChapters: chapters.length,
      missingChapterIds: [...missing, ...[...chaptersById.keys()].filter((id) => !requested.has(id))].sort(),
    },
  };
}
