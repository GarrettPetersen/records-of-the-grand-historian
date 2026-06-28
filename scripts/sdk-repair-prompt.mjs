#!/usr/bin/env node
/**
 * Build a chapter-repair prompt from prompt-repair-chapter.txt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PROMPT_REPAIR_PATH = path.join(REPO_ROOT, 'prompt-repair-chapter.txt');

function bulletList(items) {
  if (!items.length) return '- None sampled.';
  return items.map((item) => `- ${item}`).join('\n');
}

/**
 * @param {object} opts
 * @param {string} opts.book
 * @param {string} opts.chapter
 * @param {string} opts.chapterFile
 * @param {string} opts.sourceQueueFile
 * @param {string} opts.model
 * @param {{ source: number, placeholders: number, quotes: number }} opts.counts
 * @param {{ source: string[], placeholders: string[], quotes: string[] }} opts.samples
 */
export function buildRepairPrompt(opts) {
  const issueSummary = [
    '## Sampled pending issues',
    '',
    '### Source correspondence',
    bulletList(opts.samples.source),
    '',
    '### Placeholder translations',
    bulletList(opts.samples.placeholders),
    '',
    '### Quote-span alignment',
    bulletList(opts.samples.quotes),
  ].join('\n');

  const vars = {
    book: opts.book,
    chapter: opts.chapter,
    chapter_file: opts.chapterFile,
    source_queue_file: opts.sourceQueueFile,
    model: opts.model,
    source_count: String(opts.counts.source),
    placeholder_count: String(opts.counts.placeholders),
    quote_count: String(opts.counts.quotes),
    issue_summary: issueSummary,
  };

  let text = fs.readFileSync(PROMPT_REPAIR_PATH, 'utf8');
  for (const [key, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${key}}`, value);
  }

  if (/\{[a-z_]+\}/.test(text)) {
    throw new Error(`prompt-repair-chapter.txt has unresolved placeholders for ${opts.book}/${opts.chapter}`);
  }

  return text;
}
