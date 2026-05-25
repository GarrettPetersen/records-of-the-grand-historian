/**
 * Shared helpers: find translated chapters needing editorial review (manifest order).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isChapterFullyReviewed } from '../chapter-counts.mjs';
import { extractTranslationsForReview } from '../extract-translations-for-review.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(REPO_ROOT, 'data', 'manifest.json');
const DATA_DIR = path.join(REPO_ROOT, 'data');
const TRANSLATIONS_DIR = path.join(REPO_ROOT, 'translations');

const CHRONOLOGICAL_ORDER = [
  'shiji', 'hanshu', 'houhanshu', 'sanguozhi', 'jinshu', 'songshu',
  'nanqishu', 'liangshu', 'chenshu', 'weishu', 'beiqishu', 'zhoushu',
  'suishu', 'nanshi', 'beishi', 'jiutangshu', 'xintangshu',
  'jiuwudaishi', 'xinwudaishi', 'songshi', 'liaoshi', 'jinshi',
  'yuanshi', 'mingshi',
];

const OTHER_WORKS_ORDER = ['zizhitongjian', 'qingshigao'];

/**
 * @returns {object}
 */
export function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found: ${MANIFEST_PATH}`);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

/**
 * @param {object} manifest
 * @param {string | null} [bookFilter]
 */
export function orderedBookIds(manifest, bookFilter = null) {
  const available = new Set(Object.keys(manifest.books || {}));

  if (bookFilter) {
    return available.has(bookFilter) ? [bookFilter] : [];
  }

  const ordered = [
    ...CHRONOLOGICAL_ORDER.filter((id) => available.has(id)),
    ...OTHER_WORKS_ORDER.filter((id) => available.has(id)),
  ];

  for (const bookId of available) {
    if (!ordered.includes(bookId)) {
      ordered.push(bookId);
    }
  }

  return ordered;
}

/**
 * @param {object} manifest
 * @param {string | null} [bookFilter]
 * @returns {{ bookId: string, chapter: string, filePath: string } | null}
 */
export function findNextReviewChapter(manifest, bookFilter = null) {
  for (const bookId of orderedBookIds(manifest, bookFilter)) {
    const book = manifest.books?.[bookId];
    if (!book) continue;

    const chapters = [...(book.chapters || [])].sort((a, b) =>
      a.chapter.localeCompare(b.chapter, 'en', { numeric: true }),
    );

    for (const chapter of chapters) {
      if ((chapter.translatedCount || 0) <= 0) continue;
      if (chapter.reviewed === true) continue;

      const filePath = path.join(DATA_DIR, bookId, `${chapter.chapter}.json`);
      if (!fs.existsSync(filePath)) continue;

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (isChapterFullyReviewed(data)) continue;

      return { bookId, chapter: chapter.chapter, filePath };
    }
  }

  return null;
}

/**
 * @param {{ bookId: string, chapter: string }} target
 */
export function reviewFilePath({ bookId, chapter }) {
  return path.join(TRANSLATIONS_DIR, `review_${bookId}_${chapter}.json`);
}

/**
 * @param {string} chapterFilePath
 * @param {{ bookId: string, chapter: string }} target
 */
export function writeReviewExtract(chapterFilePath, target) {
  const reviewData = extractTranslationsForReview(chapterFilePath);
  const outPath = reviewFilePath(target);
  fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(reviewData, null, 2));
  return { reviewData, reviewFile: outPath };
}

/**
 * @param {object} manifest
 * @param {string | null} [bookFilter]
 */
export function countUnreviewedChapters(manifest, bookFilter = null) {
  let count = 0;
  for (const bookId of orderedBookIds(manifest, bookFilter)) {
    const book = manifest.books?.[bookId];
    if (!book) continue;
    for (const ch of book.chapters || []) {
      if ((ch.translatedCount || 0) <= 0) continue;
      if (ch.reviewed === true) continue;
      const filePath = path.join(DATA_DIR, bookId, `${ch.chapter}.json`);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (isChapterFullyReviewed(data)) continue;
      }
      count += 1;
    }
  }
  return count;
}

export { REPO_ROOT, MANIFEST_PATH, DATA_DIR };
