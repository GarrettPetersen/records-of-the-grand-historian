#!/usr/bin/env node
/**
 * Build a per-book translation prompt from prompt.txt ({book}, {model}, … placeholders).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_PATH = path.join(REPO_ROOT, 'prompt.txt');

/** Display name for make MODEL= metadata (not the API model id). */
const MODEL_DISPLAY_NAMES = {
  'composer-2.5': 'Composer 2.5',
};

/**
 * @param {string} book
 * @param {{ model?: string, translator?: string }} [opts]
 */
export function buildTranslationPrompt(book, opts = {}) {
  const apiModel = opts.model ?? 'composer-2.5';
  const modelDisplay = MODEL_DISPLAY_NAMES[apiModel] ?? apiModel;
  const translator = opts.translator ?? 'Garrett M. Petersen (2026)';
  const translationFile = `translations/current_translation_${book}.json`;

  const vars = {
    book,
    translation_file: translationFile,
    model: modelDisplay,
    translator,
  };

  let text = fs.readFileSync(PROMPT_PATH, 'utf8');
  for (const [key, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${key}}`, value);
  }

  const header = [
    '=== SDK translation session ===',
    `Book: ${book} (work only on this book)`,
    `Translation session file: ${translationFile}`,
    `API model id for your reference: ${apiModel}`,
    '===',
    '',
  ].join('\n');

  return `${header}${text}`;
}

export { PROMPT_PATH, REPO_ROOT };
