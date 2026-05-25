/**
 * Chapter status helpers for progress metrics.
 * Green and red both count as translated/complete (red = translated with quality flags).
 */

export function isChapterTranslated(status) {
  return status === 'green' || status === 'red';
}

export function countTranslatedChapters(chapters) {
  return (chapters || []).filter((chapter) => isChapterTranslated(chapter.status)).length;
}

export function isBookFullyTranslated(book) {
  const chapters = book?.chapters || [];
  return chapters.length > 0 && chapters.every((chapter) => isChapterTranslated(chapter.status));
}

export function countCompletedBooks(books) {
  const entries = Object.values(books || {});
  const totalBooks = entries.length;
  const completedBooks = entries.filter(isBookFullyTranslated).length;
  return { completedBooks, totalBooks };
}
