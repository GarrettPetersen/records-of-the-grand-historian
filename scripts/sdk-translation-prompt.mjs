#!/usr/bin/env node
/**
 * Build a per-book translation prompt from prompt.txt or prompt-local.txt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_PATH = path.join(REPO_ROOT, 'prompt.txt');
const PROMPT_LOCAL_PATH = path.join(REPO_ROOT, 'prompt-local.txt');

/** Display name for make MODEL= metadata (not the API model id). */
const MODEL_DISPLAY_NAMES = {
  'composer-2.5': 'Composer 2.5',
};

/**
 * @param {string} book
 * @param {{ model?: string, translator?: string, directToMaster?: boolean }} [opts]
 */
export function buildTranslationPrompt(book, opts = {}) {
  const apiModel = opts.model ?? 'composer-2.5';
  const modelDisplay = MODEL_DISPLAY_NAMES[apiModel] ?? apiModel;
  const translator = opts.translator ?? 'Garrett M. Petersen (2026)';
  const translationFile = `translations/current_translation_${book}.json`;
  const directToMaster = opts.directToMaster ?? false;

  const vars = {
    book,
    translation_file: translationFile,
    model: modelDisplay,
    translator,
  };

  const promptPath = directToMaster ? PROMPT_LOCAL_PATH : PROMPT_PATH;
  let text = fs.readFileSync(promptPath, 'utf8');

  for (const [key, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${key}}`, value);
  }

  if (
    text.includes('BOOK=shiji') ||
    text.includes('current_translation_shiji.json') ||
    /\{book\}|\{translation_file\}/.test(text)
  ) {
    throw new Error(
      `${path.basename(promptPath)} still has unresolved placeholders or shiji for book=${book}`,
    );
  }

  const modeNote = directToMaster
    ? 'Mode: LOCAL agent — push directly to origin/master (no PR). Economy Composer (fast mode OFF). Ignore other books\' dirty files in the working tree.'
    : 'Mode: CLOUD agent — open a PR against master when done.';

  const header = [
    '=== SDK translation session ===',
    `Book: ${book} (work only on this book)`,
    `Translation session file: ${translationFile}`,
    `API model id for your reference: ${apiModel}`,
    modeNote,
    '===',
    '',
  ].join('\n');

  return `${header}${text}`;
}

export { PROMPT_PATH, PROMPT_LOCAL_PATH, REPO_ROOT };
