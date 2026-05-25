#!/usr/bin/env node
/**
 * Build editorial-review prompt from prompt-review.txt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_REVIEW_PATH = path.join(REPO_ROOT, 'prompt-review.txt');

const MODEL_DISPLAY_NAMES = {
  'composer-2.5': 'Composer 2.5',
};

/**
 * @param {object} opts
 * @param {string} opts.bookId
 * @param {string} opts.chapter
 * @param {string} opts.chapterFile relative to repo root
 * @param {string} opts.reviewFile relative to repo root
 * @param {string} [opts.model]
 * @param {boolean} [opts.directToMaster]
 * @param {boolean} [opts.reviewFileReady] local orchestrator pre-extracted
 */
export function buildReviewPrompt(opts) {
  const apiModel = opts.model ?? 'composer-2.5';
  const modelDisplay = MODEL_DISPLAY_NAMES[apiModel] ?? apiModel;

  const vars = {
    book: opts.bookId,
    chapter: opts.chapter,
    chapter_file: opts.chapterFile,
    review_file: opts.reviewFile,
    model: modelDisplay,
  };

  let text = fs.readFileSync(PROMPT_REVIEW_PATH, 'utf8');
  for (const [key, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${key}}`, value);
  }

  if (/\{[a-z_]+\}/.test(text)) {
    throw new Error(`prompt-review.txt has unresolved placeholders for ${opts.bookId}/${opts.chapter}`);
  }

  const modeNote = opts.directToMaster
    ? 'Mode: LOCAL agent — push directly to origin/master (no PR).'
    : 'Mode: CLOUD agent — open a PR against master when done.';

  const extractNote = opts.reviewFileReady
    ? `The review file ${opts.reviewFile} is already extracted on disk — edit it directly; do not re-run extract unless the file is missing.`
    : `Run make extract-review CHAPTER=${opts.chapterFile} if ${opts.reviewFile} is not present.`;

  const header = [
    '=== SDK editorial review session ===',
    `Book: ${opts.bookId}  Chapter: ${opts.chapter}`,
    `Chapter file: ${opts.chapterFile}`,
    `Review file: ${opts.reviewFile}`,
    extractNote,
    `API model id: ${apiModel}`,
    modeNote,
    '===',
    '',
  ].join('\n');

  return `${header}${text}`;
}

export { PROMPT_REVIEW_PATH, REPO_ROOT };
