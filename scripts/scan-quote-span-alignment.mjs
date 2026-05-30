#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function countSubstr(str, needle) {
  if (!str || !needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = String(str).indexOf(needle, index)) !== -1) {
    count++;
    index += needle.length;
  }
  return count;
}

function countSingleQuoteDelimiters(text) {
  const en = String(text || '');
  let count = 0;
  for (let i = 0; i < en.length; i++) {
    if (en[i] !== "'") continue;
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
  return ['"', '“', "'"].includes(char) ? { index, char } : null;
}

function trailingQuote(text) {
  const index = lastNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '”', "'"].includes(char) ? { index, char } : null;
}

function preservesLeadingInnerSingleQuote(zh, en, quote) {
  if (quote.char !== "'") return false;
  if (!String(zh || '').trimStart().startsWith('『')) return false;
  return !/["“”]/.test(String(en || '').slice(quote.index + 1));
}

function preservesTrailingInnerQuote(zh, en, quote) {
  if (!/』[。！？!?]?$/u.test(String(zh || '').trim())) return false;
  const text = String(en || '');
  if (quote.char === '"' || quote.char === '”') return text[quote.index - 1] !== "'";
  if (quote.char !== "'") return false;
  const beforeQuote = text.slice(0, quote.index);
  return !/["“”]/.test(beforeQuote);
}

function quoteBoundaryProblems(chinese, english, beforeDepth, afterDepth, openCount, closeCount, innerOpenCount, innerCloseCount) {
  const problems = [];
  const lead = leadingQuote(english);
  const trail = trailingQuote(english);
  const englishQuoteCount = countEnglishQuoteMarks(english);
  const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
  const isInteriorUnit = beforeDepth > 0 && afterDepth > 0 && openCount === 0 && closeCount === 0;
  const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;

  if (isOpeningUnit && trail && (!lead || lead.index !== trail.index) && !(innerCloseCount > 0 && (trail.char === "'" || preservesTrailingInnerQuote(chinese, english, trail)))) {
    problems.push('English has a closing quote at the end of an opening unit whose Chinese quote continues into the next unit.');
  }

  if (isInteriorUnit && lead && !(innerOpenCount > 0 && preservesLeadingInnerSingleQuote(chinese, english, lead))) {
    problems.push('English has an opening quote at the start of an interior unit of a Chinese quote span.');
  }

  if (isInteriorUnit && trail && !lead && englishQuoteCount === 1 && !(innerCloseCount > 0 && preservesTrailingInnerQuote(chinese, english, trail))) {
    problems.push('English has a closing quote at the end of an interior unit of a Chinese quote span.');
  }

  if (isClosingUnit && lead && trail && lead.index !== trail.index && !(innerOpenCount > 0 && preservesLeadingInnerSingleQuote(chinese, english, lead))) {
    problems.push('English has an opening quote at the start of a closing unit whose Chinese quote began earlier.');
  }

  return problems;
}

function chapterFiles(bookFilter) {
  const dataDir = 'data';
  const books = fs.readdirSync(dataDir)
    .filter(name => fs.statSync(path.join(dataDir, name)).isDirectory())
    .filter(name => !bookFilter || name === bookFilter)
    .sort();

  const files = [];
  for (const book of books) {
    const bookDir = path.join(dataDir, book);
    for (const file of fs.readdirSync(bookDir).sort()) {
      if (/^\d{3}\.json$/.test(file)) {
        files.push(path.join(bookDir, file));
      }
    }
  }
  return files;
}

function idiomaticText(item) {
  return item.idiomatic || item.translation ||
    (item.translations && item.translations[0] && item.translations[0].idiomatic) ||
    '';
}

function scanSequence(items, file, blockIndex) {
  const problems = [];
  let zhQuoteDepth = 0;

  for (const item of items) {
    const chinese = item.content || item.zh || '';
    const english = idiomaticText(item);
    const openCount = countSubstr(chinese, '「');
    const closeCount = countSubstr(chinese, '」');
    const beforeDepth = zhQuoteDepth;
    const afterDepth = Math.max(0, zhQuoteDepth + openCount - closeCount);
    const inChineseQuoteSpan = beforeDepth > 0 || afterDepth > 0 || openCount > 0 || closeCount > 0;
    zhQuoteDepth = afterDepth;

    if (!inChineseQuoteSpan || !english) continue;

    const innerOpenCount = countSubstr(chinese, '『');
    const innerCloseCount = countSubstr(chinese, '』');
    const boundaryProblems = quoteBoundaryProblems(
      chinese,
      english,
      beforeDepth,
      afterDepth,
      openCount,
      closeCount,
      innerOpenCount,
      innerCloseCount
    );
    if (boundaryProblems.length > 0) {
      problems.push({
        file,
        blockIndex,
        id: item.id,
        boundaryProblems,
        chinese,
        english
      });
    }
  }

  return problems;
}

function scanChapter(file) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const problems = [];
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      problems.push(...scanSequence(block.sentences || [], file, blockIndex));
    }
  }
  return problems;
}

function main() {
  const bookArg = process.argv.find(arg => arg.startsWith('--book='));
  const bookFilter = bookArg ? bookArg.slice('--book='.length) : null;
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const outputLimit = limitArg ? Number.parseInt(limitArg.slice('--limit='.length), 10) : 50;
  const files = chapterFiles(bookFilter);
  const problems = files.flatMap(scanChapter);

  if (problems.length > 0) {
    console.error(`Found ${problems.length} quote-span alignment problem(s):\n`);
    const shownProblems = Number.isFinite(outputLimit) && outputLimit >= 0
      ? problems.slice(0, outputLimit)
      : problems;
    for (const problem of shownProblems) {
      console.error(`${problem.file} ${problem.id} block ${problem.blockIndex}`);
      for (const note of problem.boundaryProblems) console.error(`  ${note}`);
      console.error(`  zh: ${problem.chinese}`);
      console.error(`  en: ${problem.english}`);
      console.error('');
    }
    if (shownProblems.length < problems.length) {
      console.error(`Showing ${shownProblems.length} of ${problems.length}. Use --limit=0 for count only or --limit=-1 for all details.`);
    }
    process.exit(1);
  }

  console.log(`Quote span alignment OK (${files.length} chapter files scanned${bookFilter ? ` for ${bookFilter}` : ''}).`);
}

main();
