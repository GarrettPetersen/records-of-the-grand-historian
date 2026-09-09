export const KDP_MAX_HTML_FILES = 299;
export const EBOOK_TARGET_XHTML_FILES = 240;

function normalizedChapterId(chapter) {
  const value = typeof chapter === 'object' && chapter !== null ? chapter.chapter : chapter;
  const id = String(value ?? '').padStart(3, '0');
  if (!/^\d{3}$/u.test(id)) throw new Error(`Invalid e-book chapter id: ${value}`);
  return id;
}

export function ebookChapterSectionId(chapter) {
  return `chapter-${normalizedChapterId(chapter)}`;
}

export function ebookSentenceAnchor(chapter, language, unitId) {
  if (!['zh', 'en'].includes(language)) throw new Error(`Unsupported sentence-anchor language ${language}`);
  if (!unitId) throw new Error('Cannot build an e-book sentence anchor without a unit id.');
  return `${ebookChapterSectionId(chapter)}-${language}-${unitId}`;
}

export function planEbookContentDocuments(chapters, {
  hasAbout = false,
  peopleActive = false,
  peopleShards = 0,
  targetXhtmlFiles = EBOOK_TARGET_XHTML_FILES,
} = {}) {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new Error('Cannot plan an e-book without chapters.');
  }
  if (!Number.isInteger(peopleShards) || peopleShards < 0) {
    throw new Error(`Invalid e-book people-shard count: ${peopleShards}`);
  }
  if (!Number.isInteger(targetXhtmlFiles) || targetXhtmlFiles < 1 || targetXhtmlFiles > KDP_MAX_HTML_FILES) {
    throw new Error(`Invalid e-book XHTML target: ${targetXhtmlFiles}`);
  }

  const items = chapters.map((chapter) => ({ chapter, id: normalizedChapterId(chapter) }));
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate e-book chapter id: ${item.id}`);
    seen.add(item.id);
  }

  // nav, cover, and frontmatter are always present. The introduction and people
  // documents consume the same Kindle HTML-file allowance as chapter documents.
  const fixedXhtmlFiles = 3 + (hasAbout ? 1 : 0) + (peopleActive ? peopleShards + 1 : 0);
  const maxContentDocuments = targetXhtmlFiles - fixedXhtmlFiles;
  if (maxContentDocuments < 1) {
    throw new Error(
      `E-book fixed content needs ${fixedXhtmlFiles} XHTML files, leaving no room under the ${targetXhtmlFiles}-file target.`
    );
  }

  const groupSize = Math.max(1, Math.ceil(items.length / maxContentDocuments));
  const documents = [];
  const documentByChapter = new Map();
  for (let index = 0; index < items.length; index += groupSize) {
    const group = items.slice(index, index + groupSize);
    const first = group[0].id;
    const last = group.at(-1).id;
    const stem = group.length === 1 ? `chapter-${first}` : `chapters-${first}-${last}`;
    const document = {
      itemId: stem,
      file: `${stem}.xhtml`,
      chapterIds: group.map((item) => item.id),
      chapters: group.map((item) => item.chapter),
    };
    documents.push(document);
    for (const item of group) documentByChapter.set(item.id, document);
  }

  return {
    targetXhtmlFiles,
    fixedXhtmlFiles,
    groupSize,
    documents,
    documentByChapter,
    xhtmlFiles: fixedXhtmlFiles + documents.length,
  };
}

export function ebookChapterHref(layout, chapter, prefix = '') {
  const id = normalizedChapterId(chapter);
  const document = layout?.documentByChapter?.get(id);
  if (!document) throw new Error(`No e-book content document planned for chapter ${id}`);
  return `${prefix}${document.file}#${ebookChapterSectionId(id)}`;
}

export function ebookSentenceHref(layout, chapter, language, unitId, prefix = '') {
  const id = normalizedChapterId(chapter);
  const document = layout?.documentByChapter?.get(id);
  if (!document) throw new Error(`No e-book content document planned for chapter ${id}`);
  return `${prefix}${document.file}#${ebookSentenceAnchor(id, language, unitId)}`;
}
