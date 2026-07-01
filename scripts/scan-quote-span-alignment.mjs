#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CHINESE_OPEN_QUOTES = new Set(['「', '『', '“', '‘']);
const CHINESE_CLOSE_QUOTES = new Set(['」', '』', '”', '’']);
const MATCHING_OPEN_FOR_CLOSE = {
  '」': '「',
  '』': '『',
  '”': '“',
  '’': '‘',
};

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

function isWordChar(ch) {
  return /[A-Za-z]/.test(ch);
}

function isWhitespaceOrEnd(ch) {
  return !ch || /\s/.test(ch);
}

function isQuoteBoundaryChar(ch) {
  return ch === '' || /[\s,.;:!?)>\]〉）"'“”‘’—–-]/u.test(ch);
}

function isNumericPrimeMark(text, index) {
  const prev = text[index - 1] || '';
  const next = text[index + 1] || '';
  if (!/\d/.test(prev)) return false;
  return next === '' || /[\s,.;:!?)}\]〉）]/u.test(next);
}

function isLikelySingleQuoteApostrophe(text, index, singleQuoteDepth = 0) {
  const prev = text[index - 1] || '';
  const next = text[index + 1] || '';
  if (!prev && !next) return false;

  if (isWordChar(prev) && isWordChar(next)) {
    return true;
  }

  if (isWordChar(prev) && !isWordChar(next)) {
    return singleQuoteDepth === 0;
  }

  return false;
}

function getEnglishQuoteTokens(text) {
  const tokens = [];
  let singleQuoteDepth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (!['"', '“', '”', "'", '‘', '’'].includes(ch)) continue;

    if ((ch === '"' || ch === "'" || ch === '’') && isNumericPrimeMark(text, i)) {
      continue;
    }

    if (ch === '"') {
      const prev = text[i - 1] || '';
      const next = text[i + 1] || '';
      if (!next || isWhitespaceOrEnd(next) || /^[,.;:!?)}\]—–]/u.test(next)) {
        tokens.push({ index: i, char: ch, type: 'close' });
        continue;
      }
      if (!prev || /\s/.test(prev) || /^[:：;\[({<〈—–-]/u.test(prev)) {
        tokens.push({ index: i, char: ch, type: 'open' });
        continue;
      }
      if (isWordChar(prev) && !isWordChar(next)) {
        // contraction/possessive style in single-quoted text, but with a neutral quote this is still usually closing
        tokens.push({ index: i, char: ch, type: 'close' });
        continue;
      }
      tokens.push({ index: i, char: ch, type: 'close' });
      continue;
    }

    if (ch === '“') {
      tokens.push({ index: i, char: ch, type: 'open' });
      continue;
    }
    if (ch === '”') {
      tokens.push({ index: i, char: ch, type: 'close' });
      continue;
    }

    // Handle single-quote variants with state so contractions/possessives are ignored.
    if (ch === "'" && isLikelySingleQuoteApostrophe(text, i, singleQuoteDepth)) {
      continue;
    }
    if (isLikelySingleQuoteApostrophe(text, i, singleQuoteDepth)) {
      if (ch === '’' && singleQuoteDepth > 0) {
        singleQuoteDepth = Math.max(0, singleQuoteDepth - 1);
      }
      continue;
    }

    if (ch === '‘') {
      singleQuoteDepth += 1;
      tokens.push({ index: i, char: ch, type: 'open' });
      continue;
    }

    if (ch === '’') {
      if (singleQuoteDepth > 0) {
        singleQuoteDepth -= 1;
        tokens.push({ index: i, char: ch, type: 'close' });
      } else {
        const prev = text[i - 1] || '';
        const next = text[i + 1] || '';
        if (isWhitespaceOrEnd(prev) || /^[:：;\[({<〈—–-“‘'"]/.test(prev)) {
          singleQuoteDepth += 1;
          tokens.push({ index: i, char: ch, type: 'open' });
        } else if (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next)) {
          tokens.push({ index: i, char: ch, type: 'close' });
        }
      }
      continue;
    }

    const prev = text[i - 1] || '';
    const next = text[i + 1] || '';
    if (singleQuoteDepth > 0 && (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next))) {
      singleQuoteDepth -= 1;
      tokens.push({ index: i, char: ch, type: 'close' });
      continue;
    }
    if (isWhitespaceOrEnd(prev) || /^[:：;\[({<〈—–-“‘'"]/.test(prev)) {
      singleQuoteDepth += 1;
      tokens.push({ index: i, char: ch, type: 'open' });
      continue;
    }
    if (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next)) {
      tokens.push({ index: i, char: ch, type: 'close' });
    }
  }
  return tokens;
}

function classifyEnglishQuoteToken(text, index) {
  const ch = text[index];
  const tokens = getEnglishQuoteTokens(text);
  return tokens.find(item => item.index === index) || null;
}

function scanEnglishQuoteOrderErrors(english, state = { depth: 0 }) {
  const en = String(english || '');
  const problems = [];
  const quoteTokens = getEnglishQuoteTokens(en);

  if (quoteTokens.length === 0) return problems;
  if (quoteTokens[0].type === 'close' && state.depth === 0) {
    problems.push('English begins with a likely closing quote mark.');
  }

  for (const token of quoteTokens) {
    if (token.type === 'open') {
      state.depth += 1;
      continue;
    }
    if (state.depth > 0) {
      state.depth -= 1;
      continue;
    }
    if (token.type === 'close') {
      problems.push('English has an unmatched closing quote mark.');
      break;
    }
  }

  return problems;
}

function countEnglishQuoteMarks(text) {
  return getEnglishQuoteTokens(String(text || '')).length;
}

function isChineseContinuationOpen(text, index, char, state) {
  if (state.stack[state.stack.length - 1] !== char) return false;
  const prefix = String(text || '').slice(0, index).trim();
  if (!prefix) return true;
  return /^(?:\[\d+\]|\(\d+\)|[（(][一二三四五六七八九十百]+[）)])\s*$/u.test(prefix);
}

function validateChineseQuotes(text, state) {
  const problems = [];
  const zh = String(text || '');
  for (let index = 0; index < zh.length; index += 1) {
    const char = zh[index];
    if (CHINESE_OPEN_QUOTES.has(char)) {
      if (isChineseContinuationOpen(zh, index, char, state)) continue;
      state.stack.push(char);
      continue;
    }
    if (!CHINESE_CLOSE_QUOTES.has(char)) continue;

    const expected = state.stack[state.stack.length - 1];
    const opener = MATCHING_OPEN_FOR_CLOSE[char];
    if (!expected) {
      problems.push(`Chinese quote close (${char}) has no matching opening quote before it in this chapter segment.`);
      continue;
    }
    if (expected !== opener) {
      problems.push(`Chinese quote order mismatch: encountered ${char} while the active opener is ${expected}.`);
      const fallbackIndex = state.stack.lastIndexOf(opener);
      if (fallbackIndex >= 0) {
        state.stack = state.stack.slice(0, fallbackIndex);
      } else {
        state.stack = [];
      }
      continue;
    }
    state.stack.pop();
  }
  return problems;
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
  return ['"', '“'].includes(char) ? { index, char } : null;
}

function trailingQuote(text) {
  const index = lastNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '”'].includes(char) ? { index, char } : null;
}

function isTrailingOpeningQuote(text, quote) {
  if (!quote || !['"', '“'].includes(quote.char)) return false;
  return /[:：]\s*["“'‘]\s*$/u.test(String(text || ''));
}

function preservesLeadingInnerQuote(zh, en, quote) {
  if (!/^[〉\])）\s]*『/u.test(String(zh || '').trimStart())) return false;
  if (quote.char === '"' || quote.char === '“') return true;
  return quote.char === "'" && !/["“”]/.test(String(en || '').slice(quote.index + 1));
}

function preservesTrailingInnerQuote(zh, en, quote) {
  if (!/』[。！？!?]?$/u.test(String(zh || '').trim())) return false;
  const text = String(en || '');
  if (quote.char === '"' || quote.char === '”') return text[quote.index - 1] !== "'";
  return quote.char === "'";
}

function isQuotedGlossHeadword(english) {
  const text = String(english || '').trim();
  return /^["“'][^"“”']{1,80}["”'](?:\s*\([^)]{1,40}\))?\s*(?:[-—]\s*)?(?:(?:again|also|here|this)\s+)?(?:(?:this|the)\s+(?:character|phrase|line|passage|principle|term)\s+)?(?:means?|meant|signif(?:y|ies)|denotes?|describes?|gloss(?:es|ed)?|images?|symbolizes?|implies?|governs?|omits?|writes?|says?|is|are|was|were|names?|equals?|refers? to|stands? for|pointed to|rewarded)\b/i.test(text)
    || /^["“'][^"“”']{1,40}["”'](?:\s*,?\s*(?:and|or)\s*["“'][^"“”']{1,40}["”'])+\s+(?:refer|refers|mean|means|denote|denotes)\b/i.test(text)
    || /^["“'][^"“”']{1,80}["”']\s+refers(?:\s+\w+)?\s+to\b/i.test(text)
    || /^["“'][^"“”']{1,80}["”']\s*[-—]\s+(?:I|we|your servant|this servant|the minister|the court)\b/i.test(text);
}

function isChineseDirectSpeechUnit(chinese) {
  const zh = String(chinese || '');
  return /(?:曰|云|謂|告|問|對|言|諫|戒|命|詔|令|報|謝|辭|讓|謠|歌|祝|誓|號|呼|請|稱)(?:[^「」]{0,24})?[曰謂告問對言諫戒命詔令報謝辭讓謠歌祝誓號呼請稱]?[：:]?「/u.test(zh)
    || /(?:相謂|謂其|謂曰|對曰|問曰|告曰|諫曰|戒曰|曰)[：:]?「/u.test(zh);
}

function startsWithDeferredChineseClose(chinese) {
  return /^[\s"‘’“”]*[」』”’']|^[\s"‘’“”]*['"][」』”’]/u.test(String(chinese || ''));
}

function quoteBoundaryProblems(chinese, english, beforeDepth, afterDepth, openCount, closeCount, innerOpenCount, innerCloseCount, nextChinese) {
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

  if (isOpeningUnit && trail && !isTrailingOpeningQuote(english, trail) && (!lead || lead.index !== trail.index) && !(innerCloseCount > 0 && (trail.char === "'" || preservesTrailingInnerQuote(chinese, english, trail))) && !startsWithDeferredChineseClose(nextChinese)) {
    problems.push('English has a closing quote at the end of an opening unit whose Chinese quote continues into the next unit.');
  }

  if (isInteriorUnit && lead && !isQuotedGlossHeadword(english) && !(innerOpenCount > 0 && preservesLeadingInnerQuote(chinese, english, lead))) {
    problems.push('English has an opening quote at the start of an interior unit of a Chinese quote span.');
  }

  if (isInteriorUnit && trail && !lead && englishQuoteCount === 1 && !startsWithDeferredChineseClose(nextChinese) && !(innerCloseCount > 0 && preservesTrailingInnerQuote(chinese, english, trail))) {
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
  const translation = item.translations && item.translations[0];
  return item.idiomatic || item.translation ||
    (translation && (translation.idiomatic || translation.literal || translation.footnote)) ||
    '';
}

function hasQuoteSpanException(item) {
  return item?.allowUnclosedQuoteSpan === true || item?.quoteSpanException === true ||
    (item?.quoteSpanException && typeof item.quoteSpanException === 'object');
}

function stripQuoteSpanExceptionMarks(text) {
  return String(text || '').replace(/[「『“‘」』”’]/gu, '');
}

function scanSequence(items, file, blockIndex, quoteState, englishState) {
  const problems = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const nextItem = items[index + 1];
    const chinese = item.content || item.zh || '';
    const nextChinese = nextItem ? (nextItem.content || nextItem.zh || '') : '';
    const quoteChinese = hasQuoteSpanException(item) ? stripQuoteSpanExceptionMarks(chinese) : chinese;
    const english = idiomaticText(item);
    const beforeDepth = quoteState.stack.length;
    const englishBeforeDepth = englishState.depth;
    const chineseQuoteBalanceProblems = validateChineseQuotes(quoteChinese, quoteState);
    if (chineseQuoteBalanceProblems.length > 0) {
      problems.push({
        file,
        blockIndex,
        id: item.id,
        boundaryProblems: chineseQuoteBalanceProblems,
        chinese,
        english
      });
    }

    const openCount = countSubstr(quoteChinese, '「') + countSubstr(quoteChinese, '『') + countSubstr(quoteChinese, '“') + countSubstr(quoteChinese, '‘');
    const closeCount = countSubstr(quoteChinese, '」') + countSubstr(quoteChinese, '』') + countSubstr(quoteChinese, '”') + countSubstr(quoteChinese, '’');
    const afterDepth = quoteState.stack.length;
    const inChineseQuoteSpan = beforeDepth > 0 || afterDepth > 0 || openCount > 0 || closeCount > 0;
    const englishOrderProblems = scanEnglishQuoteOrderErrors(english, englishState);
    const englishAfterDepth = englishState.depth;

    if (!inChineseQuoteSpan) {
      if (englishOrderProblems.length > 0) {
        problems.push({
          file,
          blockIndex,
          id: item.id,
          boundaryProblems: englishOrderProblems,
          chinese,
          english
        });
      }
      if (englishBeforeDepth > 0 && englishAfterDepth < englishBeforeDepth && !startsWithDeferredChineseClose(nextChinese)) {
        problems.push({
          file,
          blockIndex,
          id: item.id,
          boundaryProblems: ['English closes a quote span in a unit with no Chinese quote close; the closing quote likely belongs to the previous sentence/cell.'],
          chinese,
          english
        });
      }
    }

    if (!inChineseQuoteSpan || !english) continue;

    if (beforeDepth === afterDepth && beforeDepth === 0 && (openCount > 0 || closeCount > 0) && englishBeforeDepth !== englishAfterDepth) {
      problems.push({
        file,
        blockIndex,
        id: item.id,
        boundaryProblems: ['Chinese quote span opens and closes within this unit, but the English quote span crosses the sentence/cell boundary.'],
        chinese,
        english
      });
    }

    const innerOpenCount = countSubstr(quoteChinese, '『');
    const innerCloseCount = countSubstr(quoteChinese, '』');
    const boundaryProblems = quoteBoundaryProblems(
      chinese,
      english,
      beforeDepth,
      afterDepth,
      openCount,
      closeCount,
      innerOpenCount,
      innerCloseCount,
      nextChinese
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
  const quoteState = { stack: [] };
  const englishState = { depth: 0 };
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      problems.push(...scanSequence(block.sentences || [], file, blockIndex, quoteState, englishState));
    } else if (block.type === 'table_row') {
      problems.push(...scanSequence(block.cells || [], file, blockIndex, quoteState, englishState));
    }
  }

  if (quoteState.stack.length > 0) {
    const openCount = new Map();
    for (const quote of quoteState.stack) {
      openCount.set(quote, (openCount.get(quote) || 0) + 1);
    }
    const unmatchedOpens = Array.from(openCount.entries())
      .map(([quote, count]) => `${count} unmatched ${quote}`)
      .join(', ');
    problems.push({
      file,
      blockIndex: -1,
      id: 'chapter-end',
      boundaryProblems: [`Chinese quote stack not closed by chapter end: ${unmatchedOpens}.`],
      chinese: 'End of chapter',
      english: 'End of chapter',
    });
  }
  if (englishState.depth > 0) {
    problems.push({
      file,
      blockIndex: -1,
      id: 'chapter-end',
      boundaryProblems: [`English quote stack not closed by chapter end: ${englishState.depth} unmatched quote span(s).`],
      chinese: 'End of chapter',
      english: 'End of chapter',
    });
  }
  return problems;
}

function isPublicationBlockingQuoteProblem(note) {
  return /^English (?:begins|ends|has an unmatched)/.test(note)
    || /^English quote stack not closed/.test(note)
    || /English (?:has no quote marks|has a closing quote|closes a quote span|has an opening quote)/.test(note)
    || /English quote span crosses/.test(note)
    || /Chinese (?:has a complete quoted unit|opens a multi-sentence quote span|closes a multi-sentence quote span|quote stack not closed)/.test(note);
}

function parseBookChapter(file) {
  const normalized = String(file || '').split(path.sep).join('/');
  const match = normalized.match(/(?:^|\/)data\/([^/]+)\/(\d{3})\.json$/u);
  if (!match) return { book: null, chapter: null };
  return { book: match[1], chapter: match[2] };
}

function quoteProblemSeverity(problem) {
  const notes = (problem.boundaryProblems || []).join(' ');
  if (/no quote marks|quote stack not closed|unmatched closing|begins with a likely closing|crosses|opens a multi-sentence|closes a multi-sentence/u.test(notes)) {
    return 3;
  }
  return 2;
}

function problemStableId(problem) {
  const { book, chapter } = parseBookChapter(problem.file);
  const key = [
    book || '',
    chapter || '',
    problem.id || '',
    problem.blockIndex ?? '',
    (problem.boundaryProblems || []).join('|'),
    problem.chinese || '',
    problem.english || '',
  ].join('\u241f');
  return `quote-${crypto.createHash('sha1').update(key).digest('hex').slice(0, 12)}`;
}

function addQuoteCounts(target, item) {
  target.totalItems = (target.totalItems || 0) + 1;
  target.pendingItems = (target.pendingItems || 0) + 1;
  const severity = String(item.severity || 'unknown');
  target.bySeverity = target.bySeverity || {};
  target.bySeverity[severity] = target.bySeverity[severity] || {
    severity,
    totalItems: 0,
    pendingItems: 0,
  };
  target.bySeverity[severity].totalItems += 1;
  target.bySeverity[severity].pendingItems += 1;
  if (Number(item.severity) >= 3) {
    target.highPendingItems = (target.highPendingItems || 0) + 1;
  } else if (Number(item.severity) > 0) {
    target.lowPendingItems = (target.lowPendingItems || 0) + 1;
  } else {
    target.unknownPendingItems = (target.unknownPendingItems || 0) + 1;
  }
  const currentHighest = Number(target.highestPendingSeverity || 0);
  if (Number(item.severity) > currentHighest) {
    target.highestPendingSeverity = Number(item.severity);
  }
}

function emptyQuoteCounts(extra = {}) {
  return {
    ...extra,
    totalItems: 0,
    pendingItems: 0,
    highPendingItems: 0,
    lowPendingItems: 0,
    unknownPendingItems: 0,
    highestPendingSeverity: null,
    bySeverity: {},
  };
}

function buildReport(files, problems, bookFilter, publicationOnly) {
  const report = {
    scanner: 'scan-quote-span-alignment',
    generatedAt: new Date().toISOString(),
    scannedFiles: files.length,
    book: bookFilter,
    publicationOnly,
    ...emptyQuoteCounts(),
    byFile: {},
    byProblem: {},
    byChapter: {},
    items: [],
  };

  for (const problem of problems) {
    const { book, chapter } = parseBookChapter(problem.file);
    const item = {
      id: problemStableId(problem),
      book,
      chapter,
      file: problem.file,
      blockIndex: problem.blockIndex,
      sentenceId: problem.id,
      severity: quoteProblemSeverity(problem),
      boundaryProblems: problem.boundaryProblems,
      chinese: problem.chinese,
      english: problem.english,
    };
    report.items.push(item);
    report.byFile[item.file] = (report.byFile[item.file] || 0) + 1;
    for (const note of item.boundaryProblems || []) {
      report.byProblem[note] = (report.byProblem[note] || 0) + 1;
    }
    addQuoteCounts(report, item);
    if (book && chapter) {
      const key = `${book}/${chapter}`;
      report.byChapter[key] = report.byChapter[key] || emptyQuoteCounts({ book, chapter });
      addQuoteCounts(report.byChapter[key], item);
    }
  }

  return report;
}

function runSelfTest() {
  const cases = [
    {
      name: 'aligned complete quote',
      items: [
        { id: 'ok', zh: '帝曰：「善。」', translations: [{ idiomatic: 'The emperor said, “Good.”' }] },
      ],
      expectProblem: false,
    },
    {
      name: 'missing English quote marks',
      items: [
        { id: 'missing', zh: '帝曰：「善。」', translations: [{ idiomatic: 'The emperor said good.' }] },
      ],
      expectProblem: /no quote marks/u,
    },
    {
      name: 'stray English closing quote',
      items: [
        { id: 'stray', zh: '帝從之。', translations: [{ idiomatic: 'The emperor accepted it.”' }] },
      ],
      expectProblem: /unmatched closing/u,
    },
  ];

  const failures = [];
  for (const testCase of cases) {
    const problems = scanSequence(testCase.items, 'self-test', 0, { stack: [] }, { depth: 0 });
    const notes = problems.flatMap(problem => problem.boundaryProblems || []).join('\n');
    if (testCase.expectProblem === false && problems.length > 0) {
      failures.push(`${testCase.name}: expected clean, got ${notes}`);
    } else if (testCase.expectProblem && !testCase.expectProblem.test(notes)) {
      failures.push(`${testCase.name}: expected ${testCase.expectProblem}, got ${notes || 'no problems'}`);
    }
  }

  if (failures.length > 0) {
    console.error('Quote span alignment self-test failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('Quote span alignment self-test OK.');
}

function main() {
  const inputs = [];
  let bookFilter = null;
  let outputLimit = 50;
  let wantsJson = false;
  let wantsSummary = false;
  let publicationOnly = false;
  let outPath = null;
  let failOnProblems = true;
  let wantsSelfTest = false;

  for (let i = 2; i < process.argv.length; i += 1) {
    const arg = process.argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage:
  node scripts/scan-quote-span-alignment.mjs [--book BOOK] [--limit N] [--summary] [--json] [--out PATH] [--no-fail] [path ...]
  node scripts/scan-quote-span-alignment.mjs --self-test

Options:
  --book BOOK  Scan data/BOOK
  --limit N    Number of detailed problems to show; 0 shows count only, -1 shows all
  --summary    Print count only
  --json       Emit machine-readable report
  --out PATH   Write machine-readable report to PATH
  --no-fail    Exit 0 even if problems are found
  --self-test  Verify quote detection with built-in fixtures

Explicit paths may be chapter files or directories. Use either --book or paths, not both.`);
      process.exit(0);
    }
    if (arg === '--self-test') {
      wantsSelfTest = true;
      continue;
    }
    if (arg === '--json') {
      wantsJson = true;
      continue;
    }
    if (arg === '--publication') {
      publicationOnly = true;
      continue;
    }
    if (arg === '--fail') {
      failOnProblems = true;
      continue;
    }
    if (arg === '--no-fail') {
      failOnProblems = false;
      continue;
    }
    if (arg === '--out') {
      outPath = process.argv[++i];
      continue;
    }
    if (arg.startsWith('--out=')) {
      outPath = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--summary') {
      wantsSummary = true;
      outputLimit = 0;
      continue;
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

  if (wantsSelfTest) {
    runSelfTest();
    return;
  }

  if (bookFilter && inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }

  const files = chapterFiles(inputs, bookFilter);
  let problems = files.flatMap(scanChapter);
  if (publicationOnly) {
    problems = problems
      .map(problem => ({
        ...problem,
        boundaryProblems: problem.boundaryProblems.filter(isPublicationBlockingQuoteProblem),
      }))
      .filter(problem => problem.boundaryProblems.length > 0);
  }

  const report = buildReport(files, problems, bookFilter, publicationOnly);

  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (wantsJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = problems.length > 0 && failOnProblems ? 1 : 0;
    return;
  }

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
    if (outPath) console.error(`Report written to ${outPath}.`);
    process.exitCode = failOnProblems ? 1 : 0;
    return;
  }

  console.log(`Quote span alignment OK (${files.length} chapter files scanned${bookFilter ? ` for ${bookFilter}` : ''}).`);
  if (outPath) console.log(`Report written to ${outPath}.`);
}

main();
