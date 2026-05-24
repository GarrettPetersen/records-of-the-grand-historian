#!/usr/bin/env node
/**
 * List books/chapters from data/progress.json by translation status.
 *
 * Status meanings (see generate-progress.js):
 *   gray   — no translations
 *   yellow — partial (missing idiomatic coverage)
 *   red    — translated but scorer flagged problems (not "untranslated")
 *   green  — complete idiomatic, no major issues
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROGRESS_PATH = path.join(REPO_ROOT, 'data', 'progress.json');

/** Chapters that still need new/partial translation work. */
export const TRANSLATION_NEEDED_STATUSES = new Set(['gray', 'yellow']);

/** Chapters with existing translations flagged for quality issues. */
export const FLAGGED_STATUSES = new Set(['red']);

/**
 * @param {{ status: string }} chapter
 * @param {{ includeRed?: boolean }} [opts]
 */
export function chapterNeedsTranslationWork(chapter, opts = {}) {
  if (TRANSLATION_NEEDED_STATUSES.has(chapter.status)) return true;
  if (opts.includeRed && FLAGGED_STATUSES.has(chapter.status)) return true;
  return false;
}

/**
 * @param {{ chapters?: Array<{ status: string }> }} book
 * @param {{ includeRed?: boolean }} [opts]
 */
export function countChapterStatuses(book, opts = {}) {
  const counts = { gray: 0, yellow: 0, red: 0, green: 0 };
  for (const ch of book.chapters ?? []) {
    const key = ch.status in counts ? ch.status : 'gray';
    counts[key] += 1;
  }
  const needsTranslation = counts.gray + counts.yellow + (opts.includeRed ? counts.red : 0);
  return { ...counts, needsTranslation };
}

/** @typedef {{ id: string, name: string, gray: number, yellow: number, red: number, green: number, needsTranslation: number, totalChapters: number }} BookProgress */

/**
 * @param {{ bookFilter?: string[], minChapters?: number, includeRed?: boolean }} [opts]
 * @returns {BookProgress[]}
 */
function loadProgressJson() {
  if (fs.existsSync(PROGRESS_PATH)) {
    return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
  }
  try {
    const raw = execSync('git show origin/master:data/progress.json', {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(raw);
  } catch {
    return { books: {} };
  }
}

export function listBooksNeedingTranslation(opts = {}) {
  const progress = loadProgressJson();
  const filter = opts.bookFilter?.length ? new Set(opts.bookFilter) : null;
  const minChapters = opts.minChapters ?? 1;
  const includeRed = opts.includeRed ?? false;

  /** @type {BookProgress[]} */
  const out = [];
  for (const [id, book] of Object.entries(progress.books ?? {})) {
    if (filter && !filter.has(id)) continue;
    const counts = countChapterStatuses(book, { includeRed });
    if (counts.needsTranslation < minChapters) continue;
    out.push({
      id,
      name: book.name ?? id,
      gray: counts.gray,
      yellow: counts.yellow,
      red: counts.red,
      green: counts.green,
      needsTranslation: counts.needsTranslation,
      totalChapters: (book.chapters ?? []).length,
    });
  }

  out.sort((a, b) => b.needsTranslation - a.needsTranslation);
  return out;
}

export { PROGRESS_PATH, REPO_ROOT };
