#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const OUTER_OPEN = '「';
const OUTER_CLOSE = '」';

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function usage() {
  console.error('Usage: node scripts/fix-quote-span-boundaries-stage2.mjs [--book=<id>] [--chapter=<path>] [--apply] [--details] [--out=<report.json>]');
  process.exit(1);
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  return {
    book: argValue('--book') || null,
    chapter: argValue('--chapter') || null,
    apply: process.argv.includes('--apply'),
    details: process.argv.includes('--details'),
    out: argValue('--out')
  };
}

function chapterFiles(opts) {
  if (opts.chapter) return [opts.chapter];
  const books = fs.readdirSync('data')
    .filter(name => fs.statSync(path.join('data', name)).isDirectory())
    .filter(name => name !== 'quality')
    .filter(name => !opts.book || name === opts.book)
    .sort();
  return books.flatMap(book => fs.readdirSync(path.join('data', book))
    .filter(file => /^\d{3}\.json$/.test(file))
    .sort()
    .map(file => path.join('data', book, file)));
}

function countChar(text, char) {
  return [...String(text || '')].filter(item => item === char).length;
}

function countSubstr(text, needle) {
  if (!text || !needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = String(text).indexOf(needle, index)) !== -1) {
    count++;
    index += needle.length;
  }
  return count;
}

function countSingleQuoteDelimiters(text) {
  const en = String(text || '');
  let count = 0;
  for (let i = 0; i < en.length; i++) {
    if (en[i] !== "'" && en[i] !== '‘' && en[i] !== '’') continue;
    if (en[i] === '‘' || en[i] === '’') {
      count++;
      continue;
    }
    const prev = en[i - 1] || '';
    const next = en[i + 1] || '';
    if (/[A-Za-z]/.test(prev) && /[A-Za-z]/.test(next)) continue;
    if (/[sS]/.test(prev) && (!next || /[\s,.;:!?)}\]]/.test(next))) continue;
    count++;
  }
  return count;
}

function countEnglishQuoteMarks(text) {
  const en = String(text || '');
  const doubleQuoteCount = countSubstr(en, '"') + countSubstr(en, '“') + countSubstr(en, '”');
  return doubleQuoteCount + countSingleQuoteDelimiters(en);
}

function translationFields(sentence) {
  const fields = [];
  if (sentence.translations?.[0]) {
    fields.push({ owner: sentence.translations[0], key: 'idiomatic' });
  }
  if (Object.hasOwn(sentence, 'idiomatic')) fields.push({ owner: sentence, key: 'idiomatic' });
  if (Object.hasOwn(sentence, 'translation')) fields.push({ owner: sentence, key: 'translation' });
  return fields.filter(field => typeof field.owner[field.key] === 'string' && field.owner[field.key].length > 0);
}

function firstNonSpaceIndex(text) {
  const match = String(text).match(/\S/);
  return match ? match.index : -1;
}

function lastNonSpaceIndex(text) {
  const str = String(text);
  for (let i = str.length - 1; i >= 0; i--) {
    if (!/\s/.test(str[i])) return i;
  }
  return -1;
}

function leadingQuote(text) {
  const index = firstNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '“', "'", '‘'].includes(char) ? { index, char } : null;
}

function trailingQuote(text) {
  const index = lastNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '”', "'", '’'].includes(char) ? { index, char } : null;
}

function leadingQuoteRun(text) {
  const str = String(text);
  const start = firstNonSpaceIndex(str);
  if (start < 0) return [];
  const run = [];
  for (let i = start; i < str.length && ['"', '“', "'", '‘'].includes(str[i]); i++) {
    run.push({ index: i, char: str[i] });
  }
  return run;
}

function trailingQuoteRun(text) {
  const str = String(text);
  const end = lastNonSpaceIndex(str);
  if (end < 0) return [];
  const run = [];
  for (let i = end; i >= 0 && ['"', '”', "'", '’'].includes(str[i]); i--) {
    run.push({ index: i, char: str[i] });
  }
  return run.reverse();
}

function removeCharAt(text, index) {
  return text.slice(0, index) + text.slice(index + 1);
}

function removeCharsAt(text, indexes) {
  const sorted = [...indexes].sort((a, b) => b - a);
  let next = text;
  for (const index of sorted) next = removeCharAt(next, index);
  return next;
}

function preservesLeadingInnerSingleQuote(zh, en, quote) {
  if (quote.char !== "'" && quote.char !== '‘') return false;
  if (!String(zh || '').trimStart().startsWith('『')) return false;
  return !/["“”]/.test(String(en || '').slice(quote.index + 1));
}

function preservesTrailingInnerQuote(zh, en, quote) {
  if (!/』[。！？!?]?$/u.test(String(zh || '').trim())) return false;
  const text = String(en || '');
  if (quote.char === '"' || quote.char === '”') return text[quote.index - 1] !== "'";
  if (quote.char !== "'" && quote.char !== '’') return false;
  const beforeQuote = String(en || '').slice(0, quote.index);
  return !/["“”]/.test(beforeQuote);
}

function fixChapter(chapter) {
  const changes = [];

  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    let depth = 0;

    for (const sentence of block.sentences || []) {
      const zh = sentence.zh || sentence.content || '';
      const openCount = countChar(zh, OUTER_OPEN);
      const closeCount = countChar(zh, OUTER_CLOSE);
      const innerOpenCount = countChar(zh, '『');
      const innerCloseCount = countChar(zh, '』');
      const beforeDepth = depth;
      const afterDepth = Math.max(0, depth + openCount - closeCount);
      depth = afterDepth;

      const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
      const isInteriorUnit = beforeDepth > 0 && afterDepth > 0 && openCount === 0 && closeCount === 0;
      const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;

      if (!isOpeningUnit && !isInteriorUnit && !isClosingUnit) continue;

      for (const field of translationFields(sentence)) {
        const before = field.owner[field.key];
        const lead = leadingQuote(before);
        const trail = trailingQuote(before);
        let after = before;
        let reason = null;

        if (isOpeningUnit && trail && (!lead || lead.index !== trail.index) && !(innerCloseCount > 0 && (trail.char === "'" || preservesTrailingInnerQuote(zh, before, trail)))) {
          after = removeCharAt(before, trail.index);
          reason = 'Remove premature English closing quote from the opening unit of a Chinese multi-sentence quote span.';
        } else if (isInteriorUnit) {
          const indexes = [];
          for (const item of leadingQuoteRun(before)) {
            if (innerOpenCount > 0 && preservesLeadingInnerSingleQuote(zh, before, item)) continue;
            indexes.push(item.index);
          }
          for (const item of trailingQuoteRun(before)) {
            if (innerCloseCount > 0 && preservesTrailingInnerQuote(zh, before, item)) continue;
            if (indexes.includes(item.index)) continue;
            indexes.push(item.index);
          }
          if (indexes.length > 0 && (indexes.length > 1 || countEnglishQuoteMarks(before) === 1)) {
            after = removeCharsAt(before, indexes);
            reason = 'Remove repeated English boundary quote(s) from an interior unit of a Chinese multi-sentence quote span.';
          }
        } else if (isClosingUnit && lead && trail && lead.index !== trail.index && !(innerOpenCount > 0 && preservesLeadingInnerSingleQuote(zh, before, lead))) {
          after = removeCharAt(before, lead.index);
          reason = 'Remove English opening quote from the closing unit of a Chinese multi-sentence quote span.';
        }

        if (after !== before) {
          field.owner[field.key] = after;
          changes.push({
            id: sentence.id,
            field: field.key,
            before,
            after,
            reason
          });
        }
      }
    }
  }

  return changes;
}

function main() {
  const opts = parseArgs();
  const files = chapterFiles(opts);
  const report = [];
  let total = 0;

  for (const file of files) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const changes = fixChapter(chapter);
    if (changes.length === 0) continue;
    total += changes.length;
    report.push({ file, changes });
    console.log(`${file}: ${opts.apply ? 'applied' : 'proposed'} ${changes.length} stage-2 change(s)`);
    if (opts.details) {
      for (const change of changes) {
        console.log(`  ${change.id} ${change.field}`);
        console.log(`    before: ${change.before}`);
        console.log(`    after:  ${change.after}`);
        console.log(`    reason: ${change.reason}`);
      }
    }
    if (opts.apply) fs.writeFileSync(file, JSON.stringify(chapter, null, 2));
  }

  console.log(`${opts.apply ? 'Applied' : 'Proposed'} ${total} stage-2 quote-boundary change(s) across ${report.length}/${files.length} chapter(s).`);
  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, JSON.stringify({ applied: opts.apply, total, chapters: report }, null, 2));
    console.log(`Wrote ${opts.out}`);
  }
}

main();
