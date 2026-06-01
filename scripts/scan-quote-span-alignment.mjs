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

function preservesLeadingInnerQuote(zh, en, quote) {
  if (!/^[〉\])）\s]*『/u.test(String(zh || '').trimStart())) return false;
  if (quote.char === '"' || quote.char === '“') return true;
  if (quote.char !== "'") return false;
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

function isQuotedGlossHeadword(english) {
  const text = String(english || '').trim();
  return /^["“'][^"“”']{1,80}["”'](?:\s*\([^)]{1,40}\))?\s*(?:[-—]\s*)?(?:(?:again|also|here|this)\s+)?(?:(?:this|the)\s+(?:character|phrase|line|passage|principle|term)\s+)?(?:means?|signif(?:y|ies)|denotes?|describes?|gloss(?:es|ed)?|images?|symbolizes?|implies?|governs?|omits?|writes?|says?|is|are|was|were|names?|equals?|refers? to|stands? for|pointed to|rewarded)\b/i.test(text)
    || /^["“'][^"“”']{1,40}["”'](?:\s*,?\s*(?:and|or)\s*["“'][^"“”']{1,40}["”'])+\s+(?:refer|refers|mean|means|denote|denotes)\b/i.test(text)
    || /^["“'][^"“”']{1,80}["”']\s+refers(?:\s+\w+)?\s+to\b/i.test(text)
    || /^["“'][^"“”']{1,80}["”']\s*[-—]\s+(?:I|we|your servant|this servant|the minister|the court)\b/i.test(text);
}

function isChineseDirectSpeechUnit(chinese) {
  const zh = String(chinese || '');
  return /(?:曰|云|謂|告|問|對|言|諫|戒|命|詔|令|報|謝|辭|讓|謠|歌|祝|誓|號|呼|請|稱)(?:[^「」]{0,24})?[曰謂告問對言諫戒命詔令報謝辭讓謠歌祝誓號呼請稱]?[：:]?「/u.test(zh)
    || /(?:相謂|謂其|謂曰|對曰|問曰|告曰|諫曰|戒曰|曰)[：:]?「/u.test(zh);
}

function quoteBoundaryProblems(chinese, english, beforeDepth, afterDepth, openCount, closeCount, innerOpenCount, innerCloseCount) {
  const problems = [];
  const lead = leadingQuote(english);
  const trail = trailingQuote(english);
  const englishQuoteCount = countEnglishQuoteMarks(english);
  const isCompleteUnit = beforeDepth === 0 && afterDepth === 0 && openCount > 0 && closeCount > 0;
  const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
  const isInteriorUnit = beforeDepth > 0 && afterDepth > 0 && openCount === 0 && closeCount === 0;
  const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;

  if (isCompleteUnit && englishQuoteCount === 0 && (isChineseDirectSpeechUnit(chinese) || /「/.test(String(chinese || '')))) {
    problems.push('Chinese has a complete quoted unit, but English has no quote marks.');
  }

  if (isOpeningUnit && englishQuoteCount === 0) {
    problems.push('Chinese opens a multi-sentence quote span, but English has no quote marks.');
  }

  if (isOpeningUnit && trail && (!lead || lead.index !== trail.index) && !(innerCloseCount > 0 && (trail.char === "'" || preservesTrailingInnerQuote(chinese, english, trail)))) {
    problems.push('English has a closing quote at the end of an opening unit whose Chinese quote continues into the next unit.');
  }

  if (isInteriorUnit && lead && !isQuotedGlossHeadword(english) && !(innerOpenCount > 0 && preservesLeadingInnerQuote(chinese, english, lead))) {
    problems.push('English has an opening quote at the start of an interior unit of a Chinese quote span.');
  }

  if (isInteriorUnit && trail && !lead && englishQuoteCount === 1 && !(innerCloseCount > 0 && preservesTrailingInnerQuote(chinese, english, trail))) {
    problems.push('English has a closing quote at the end of an interior unit of a Chinese quote span.');
  }

  if (isClosingUnit && englishQuoteCount === 0) {
    problems.push('Chinese closes a multi-sentence quote span, but English has no quote marks.');
  }

  if (isClosingUnit && lead && trail && lead.index !== trail.index && !isQuotedGlossHeadword(english) && !(innerOpenCount > 0 && preservesLeadingInnerQuote(chinese, english, lead))) {
    problems.push('English has an opening quote at the start of a closing unit whose Chinese quote began earlier.');
  }

  return problems;
}

function chapterFiles(inputs, bookFilter) {
  if (inputs.length > 0) {
    const files = [];
    const enqueue = (entry) => {
      if (!fs.existsSync(entry)) return;
      const st = fs.statSync(entry);
      if (st.isDirectory()) {
        for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
        return;
      }
      if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
    };
    for (const input of inputs) enqueue(input);
    return [...new Set(files)].sort();
  }

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
  const inputs = [];
  let bookFilter = null;
  let outputLimit = 50;

  for (let i = 2; i < process.argv.length; i += 1) {
    const arg = process.argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage:
  node scripts/scan-quote-span-alignment.mjs [--book BOOK] [--limit N] [path ...]

Options:
  --book BOOK  Scan data/BOOK
  --limit N    Number of detailed problems to show; 0 shows count only, -1 shows all

Explicit paths may be chapter files or directories. Use either --book or paths, not both.`);
      process.exit(0);
    }
    if (arg === '--book') {
      bookFilter = process.argv[++i];
      continue;
    }
    if (arg.startsWith('--book=')) {
      bookFilter = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--limit') {
      outputLimit = Number.parseInt(process.argv[++i], 10);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      outputLimit = Number.parseInt(arg.slice('--limit='.length), 10);
      continue;
    }
    if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`);
      process.exit(2);
    }
    inputs.push(arg);
  }

  if (bookFilter && inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }

  const files = chapterFiles(inputs, bookFilter);
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
