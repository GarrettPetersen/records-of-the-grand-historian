#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const EN_OPEN_QUOTES = new Set(['"', '“', '‘']);
const EN_CLOSE_QUOTES = new Set(['"', '”', '’']);
const CH_OPEN_QUOTES = new Set(['「', '『']);
const CH_CLOSE_QUOTES = new Set(['」', '』']);
const CH_OPEN_TO_CLOSE = {
  '「': '」',
  '『': '』',
};
const CH_CLOSE_TO_OPEN = {
  '」': '「',
  '』': '『',
};
function collapseTrailingRepeatedChars(text, chars, replacementChar) {
  const pattern = new RegExp(`[${chars}]+\\s*$`);
  const match = text.match(pattern);
  if (!match || match[0].trim().length <= 1) return text;

  const keep = replacementChar || match[0].trim().slice(0, 1);
  const suffix = text.slice(0, text.length - match[0].length);
  const spaces = match[0].match(/\s*$/)?.[0] || '';
  return `${suffix}${keep}${spaces}`;
}

function collapseEnglishRepeatedBoundaryQuotes(text, replacement = '”') {
  let next = String(text);
  const match = next.match(/(["”’']{2,})(\s*)$/u);
  if (!match) return next;
  const run = match[1];
  const keep = run.includes('’') || run.includes('\'') ? run.match(/[’']/u)?.[0] : replacement;
  const spaces = match[2] || '';
  const base = next.slice(0, next.length - match[0].length);
  return `${base}${keep}${spaces}`;
}

function usage() {
  console.error('Usage: node scripts/fix-quote-edge-cases.mjs --book=<id> [--book=<id>...] [--apply]');
  process.exit(1);
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const books = process.argv
    .filter((arg) => arg.startsWith('--book='))
    .map((arg) => arg.slice('--book='.length));
  if (books.length === 0) usage();
  return {
    books,
    apply: process.argv.includes('--apply'),
  };
}

function translationFields(sentence) {
  const fields = [];
  if (sentence.translations?.[0]) {
    if (typeof sentence.translations[0].literal === 'string') fields.push({ owner: sentence.translations[0], key: 'literal' });
    if (typeof sentence.translations[0].idiomatic === 'string') fields.push({ owner: sentence.translations[0], key: 'idiomatic' });
    if (typeof sentence.translations[0].translation === 'string') fields.push({ owner: sentence.translations[0], key: 'translation' });
  }
  if (Object.hasOwn(sentence, 'literal') && typeof sentence.literal === 'string') fields.push({ owner: sentence, key: 'literal' });
  if (Object.hasOwn(sentence, 'idiomatic') && typeof sentence.idiomatic === 'string') fields.push({ owner: sentence, key: 'idiomatic' });
  if (Object.hasOwn(sentence, 'translation') && typeof sentence.translation === 'string') fields.push({ owner: sentence, key: 'translation' });
  return fields;
}

function firstNonSpaceIndex(text) {
  const match = String(text).match(/\S/);
  return match ? match.index : -1;
}

function lastNonSpaceIndex(text) {
  const str = String(text);
  for (let i = str.length - 1; i >= 0; i -= 1) {
    if (!/\s/.test(str[i])) return i;
  }
  return -1;
}

function trimLeadingBoundaryQuotes(text, chars) {
  let start = firstNonSpaceIndex(text);
  if (start < 0) return text;
  let next = text;

  while (start < next.length && chars.has(next[start])) {
    next = next.slice(0, start) + next.slice(start + 1);
    start = firstNonSpaceIndex(next);
    if (start < 0) break;
    if (/^[A-Za-z\u4e00-\u9fff]/.test(next[start - 1] || '')) {
      break;
    }
  }

  return next;
}

function trimTrailingBoundaryQuotes(text, chars) {
  let end = lastNonSpaceIndex(text);
  if (end < 0) return text;
  let next = text;

  while (end >= 0 && chars.has(next[end])) {
    const prev = next[end - 1] || '';
    if (next[end] === '\'' && /[A-Za-z0-9_]/.test(prev)) break;
    if (next[end] === '’' && /[A-Za-z0-9_]/.test(prev)) break;
    next = next.slice(0, end) + next.slice(end + 1);
    end = lastNonSpaceIndex(next);
  }

  return next;
}

function stripAllNonWordEnglishQuotes(text) {
  const str = String(text);
  let next = '';
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    if (!EN_OPEN_QUOTES.has(ch) && !EN_CLOSE_QUOTES.has(ch)) {
      next += ch;
      continue;
    }

    if ((ch === '\'' || ch === '’') && /[A-Za-z0-9]/.test(str[i - 1] || '') && /[A-Za-z0-9]/.test(str[i + 1] || '')) {
      next += ch;
      continue;
    }

    if (ch === '“' || ch === '”' || ch === '‘' || ch === '’') {
      // retain no-op for possible proper names or punctuation-inside cases.
      if (/[A-Za-z0-9]/.test(str[i - 1] || '') && /[A-Za-z0-9]/.test(str[i + 1] || '')) {
        next += ch;
      }
      continue;
    }

    // For plain double quotes, keep when between letters (e.g., inches: 8").
    if (ch === '"' && /[0-9]/.test(str[i - 1] || '') && /[0-9]/.test(str[i + 1] || '')) {
      next += ch;
      continue;
    }
  }
  return next;
}

function appendAtEndBeforeSpace(text, marker) {
  const str = String(text);
  const match = str.match(/\s*$/);
  const at = match ? str.length - match[0].length : str.length;
  return str.slice(0, at) + marker + str.slice(at);
}

function prependAfterLeadingSpace(text, marker) {
  const str = String(text);
  const match = str.match(/^\s*/);
  const at = match ? match[0].length : 0;
  return str.slice(0, at) + marker + str.slice(at);
}

function englishQuoteMarkerCount(text) {
  const str = String(text || '');
  let count = 0;
  for (const char of str) {
    if (EN_OPEN_QUOTES.has(char) || EN_CLOSE_QUOTES.has(char)) {
      count += 1;
    }
  }
  return count;
}

function quoteStyleFromChinese(zh) {
  const text = String(zh || '');
  if (text.includes('『')) return { open: '‘', close: '’' };
  if (text.includes('「')) return { open: '“', close: '”' };
  return { open: '"', close: '"' };
}

function addOpeningQuote(text, zh) {
  const str = String(text || '');
  if (englishQuoteMarkerCount(str) > 0) return str;
  const { open } = quoteStyleFromChinese(zh);
  return prependAfterLeadingSpace(str, open);
}

function addClosingQuote(text) {
  const str = String(text || '');
  if (englishQuoteMarkerCount(str) === 0) return str;
  return str;
}

function addClosingQuoteAtEnd(text, zh) {
  const str = String(text || '');
  if (englishQuoteMarkerCount(str) > 0) return str;
  const { close } = quoteStyleFromChinese(zh);
  return appendAtEndBeforeSpace(str, close);
}

function addOpeningQuoteAtStart(text, zh) {
  const str = String(text || '');
  if (englishQuoteMarkerCount(str) > 0) return str;
  const { open } = quoteStyleFromChinese(zh);
  return prependAfterLeadingSpace(str, open);
}

function normalizeDanglingQuotePair(text, zh) {
  let next = String(text || '');
  if (!next) return next;

  if (next.endsWith('”') || next.endsWith('“') || next.endsWith('’') || next.endsWith('‘') || next.endsWith('"') || next.endsWith("'")) {
    next = appendAtEndBeforeSpace(next, quoteStyleFromChinese(zh).close);
  }
  return next;
}

function surroundWithQuotes(text, zh) {
  const str = String(text || '');
  if (englishQuoteMarkerCount(str) > 0) return str;
  const { open, close } = quoteStyleFromChinese(zh);
  return appendAtEndBeforeSpace(prependAfterLeadingSpace(str, open), close);
}

function normalizeEnglishFieldWithCategory(text, zh, problems) {
  let next = String(text);
  if (!next) return next;

  if (problems.has('English begins with a likely closing quote mark.') || problems.has('English has an unmatched closing quote mark.')) {
    next = addOpeningQuoteAtStart(next, zh);
  }

  if (problems.has('English ends with a likely opening quote mark.') || problems.has('English has an unmatched opening quote mark.')) {
    next = addClosingQuoteAtEnd(next, zh);
  }

  if (problems.has('Chinese opens a multi-sentence quote span, but English has no quote marks.')) {
    next = addOpeningQuote(next, zh);
  } else if (problems.has('Chinese closes a multi-sentence quote span, but English has no quote marks.')) {
    next = addClosingQuoteAtEnd(next, zh);
  } else if (problems.has('Chinese has a complete quoted unit, but English has no quote marks.')) {
    next = surroundWithQuotes(next, zh);
  }

  const hasAnyQuoteProblem = [
    'English begins with a likely closing quote mark.',
    'English ends with a likely opening quote mark.',
    'English has an unmatched opening quote mark.',
    'English has an unmatched closing quote mark.',
  ].some((item) => problems.has(item));
  if (hasAnyQuoteProblem) {
    next = stripAllNonWordEnglishQuotes(next);
    // Rebalance after normalization, but preserve sentence-internal apostrophes
    // by only adding boundary punctuation when necessary.
    if (problems.has('English begins with a likely closing quote mark.')) {
      next = addOpeningQuoteAtStart(next, zh);
    }
    if (problems.has('English ends with a likely opening quote mark.')) {
      next = addClosingQuoteAtEnd(next, zh);
    }
  }

  if (problems.has('English begins with a likely closing quote mark.') ||
      problems.has('English has an unmatched closing quote mark.') ||
      problems.has('English ends with a likely opening quote mark.') ||
      problems.has('English has an unmatched opening quote mark.')) {
    next = collapseEnglishRepeatedBoundaryQuotes(next, quoteStyleFromChinese(zh).close);
  }

  return next;
}

function removeStrayChineseClose(text, closeChar) {
  if (!text.includes(closeChar)) return text;
  let next = text;
  let changed = true;
  while (changed) {
    changed = false;
    const start = next.trimStart();
    if (start.startsWith(closeChar)) {
      next = next.replace(new RegExp(`^[\\s]*\\${closeChar}`), '');
      changed = true;
      continue;
    }
    const trimmed = next.trimEnd();
    if (trimmed.endsWith(closeChar)) {
      next = next.replace(new RegExp(`\\${closeChar}[\\s]*$`), '');
      changed = true;
    }
  }
  return next;
}

function normalizeEnglishField(text, problems) {
  let next = String(text);
  if (!next) return next;

  const hasAnyQuoteProblem = [
    'English begins with a likely closing quote mark.',
    'English ends with a likely opening quote mark.',
    'English has an unmatched opening quote mark.',
    'English has an unmatched closing quote mark.',
  ].some((item) => problems.has(item));
  if (hasAnyQuoteProblem) {
    next = stripAllNonWordEnglishQuotes(next);
  }

  if (problems.has('English begins with a likely closing quote mark.') || problems.has('English has an unmatched closing quote mark.')) {
    next = trimLeadingBoundaryQuotes(next, EN_CLOSE_QUOTES);
  }

  if (problems.has('English ends with a likely opening quote mark.') || problems.has('English has an unmatched opening quote mark.')) {
    next = trimTrailingBoundaryQuotes(next, EN_OPEN_QUOTES);
  }

  if (problems.has('English has an unmatched opening quote mark.')) {
    next = trimLeadingBoundaryQuotes(next, EN_OPEN_QUOTES);
  }

  if (problems.has('English has an unmatched closing quote mark.')) {
    next = trimTrailingBoundaryQuotes(next, EN_CLOSE_QUOTES);
  }

  return next;
}

function normalizeChineseField(text, problems) {
  let next = String(text);
  if (!next) return next;

  if (problems.has('Chinese quote close (」) has no matching opening quote before it in this chapter segment.')) {
    next = removeStrayChineseClose(next, '」');
    next = collapseTrailingRepeatedChars(next, '」』', '」');
  }

  if (problems.has('Chinese quote close (』) has no matching opening quote before it in this chapter segment.')) {
    next = removeStrayChineseClose(next, '』');
    next = collapseTrailingRepeatedChars(next, '」』', '』');
  }

  if (problems.has('Chinese quote order mismatch: encountered 」 while the active opener is 『.')) {
    next = next.replace(/」/g, '』');
  }

  if (problems.has('Chinese quote order mismatch: encountered 』 while the active opener is 「.')) {
    next = next.replace(/』/g, '」');
  }

  if (problems.has('Chinese quote order mismatch: encountered 」 while the active opener is 『.')) {
    next = next.replace(/」/g, '』');
  }

  return next;
}

function parseChapterEndUnmatched(problemText) {
  const counts = new Map();
  const m = problemText.matchAll(/(\d+) unmatched ([「『])/g);
  for (const match of m) {
    counts.set(match[2], Number.parseInt(match[1], 10));
  }
  return counts;
}

function appendUnmatchedChineseCloses(chapter, counts) {
  const blocks = chapter.content || [];
  let sentence = null;

  for (let i = blocks.length - 1; i >= 0 && !sentence; i -= 1) {
    const block = blocks[i];
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    if (!block.sentences || block.sentences.length === 0) continue;
    sentence = block.sentences[block.sentences.length - 1];
  }

  if (!sentence) return false;

  let changed = false;
  const zhField = Object.hasOwn(sentence, 'zh') ? 'zh' : 'content';
  let zhValue = sentence[zhField] || '';

  for (const [open, count] of counts) {
    const close = CH_OPEN_TO_CLOSE[open];
    for (let i = 0; i < count; i += 1) {
      zhValue = appendAtEndBeforeSpace(zhValue, close);
      const enClose = close === '」' ? '”' : '’';
      for (const field of translationFields(sentence)) {
        field.owner[field.key] = appendAtEndBeforeSpace(field.owner[field.key], enClose);
      }
      changed = true;
    }
  }

  if (changed) {
    sentence[zhField] = zhValue;
  }

  return changed;
}

function listFilesForBook(book) {
  const dir = path.join('data', book);
  return fs.readdirSync(dir)
    .filter((file) => /^\d{3}\.json$/.test(file))
    .sort()
    .map((file) => path.join(dir, file));
}

function scanProblemsForBook(book) {
  const tmpPath = path.join(process.cwd(), `.tmp-quote-scan-${book}-${Date.now()}.json`);
  try {
    execSync(`node scripts/scan-quote-span-alignment.mjs --book=${book} --json > ${tmpPath}`, { shell: true });
  } catch (error) {
    const fallback = `${error.stdout || ''}${error.stderr || ''}`;
    if (!fs.existsSync(tmpPath) || !fs.readFileSync(tmpPath, 'utf8').trim()) {
      throw new Error(fallback || `Failed to run quote scanner for ${book}`);
    }
  }

  const payload = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
  fs.unlinkSync(tmpPath);

  const byId = new Map();
  const chapterEnd = new Map();
  for (const problem of payload.problems || []) {
    if (problem.id === 'chapter-end') {
      const current = chapterEnd.get(problem.file) || new Map();
      for (const note of problem.boundaryProblems || []) {
        const parsed = parseChapterEndUnmatched(note);
        for (const [open, count] of parsed) {
          current.set(open, (current.get(open) || 0) + count);
        }
      }
      if (current.size > 0) chapterEnd.set(problem.file, current);
      continue;
    }

    const setForFile = byId.get(problem.file) || new Map();
    const set = setForFile.get(problem.id) || new Set();
    for (const note of problem.boundaryProblems || []) set.add(note);
    setForFile.set(problem.id, set);
    byId.set(problem.file, setForFile);
  }

  return { byId, chapterEnd };
}

function sentenceIndexById(chapter) {
  const byId = new Map();
  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    for (const sentence of block.sentences || []) byId.set(sentence.id, sentence);
  }
  return byId;
}

function runForBook(book, apply) {
  const files = listFilesForBook(book);
  const { byId, chapterEnd } = scanProblemsForBook(book);
  let edits = 0;

  for (const file of files) {
    const idProblems = byId.get(file);
    const endIssues = chapterEnd.get(file);
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const sentenceById = sentenceIndexById(chapter);
    let touched = false;

    if (idProblems) {
      for (const [id, problems] of idProblems.entries()) {
        const sentence = sentenceById.get(id);
        if (!sentence) continue;
        const zhField = Object.hasOwn(sentence, 'zh') ? 'zh' : 'content';

        if (Object.hasOwn(sentence, 'zh') || Object.hasOwn(sentence, 'content')) {
          const beforeZh = sentence[zhField] || '';
          const afterZh = normalizeChineseField(beforeZh, problems);
          if (afterZh !== beforeZh) {
            sentence[zhField] = afterZh;
            touched = true;
            edits += 1;
          }
        }

        for (const field of translationFields(sentence)) {
          const before = field.owner[field.key] || '';
          const after = normalizeEnglishFieldWithCategory(before, sentence[zhField], problems);
          if (after !== before) {
            field.owner[field.key] = after;
            touched = true;
            edits += 1;
          }
        }
      }
    }

    if (endIssues) {
      if (appendUnmatchedChineseCloses(chapter, endIssues)) {
        touched = true;
      }
    }

    if (apply && touched) {
      fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`);
    }
  }

  console.log(`${book}: ${apply ? 'applied' : 'would apply'} ${edits} direct quote issue edits`);
  return edits;
}

function main() {
  const opts = parseArgs();
  let total = 0;
  for (const book of opts.books) {
    total += runForBook(book, opts.apply);
  }
  console.log(`Total quote issue fixes: ${total}`);
}

main();
