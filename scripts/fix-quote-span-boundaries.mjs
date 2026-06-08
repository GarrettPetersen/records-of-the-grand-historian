#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const OUTER_OPEN = new Set(['「', '“']);
const OUTER_CLOSE = new Set(['」', '”']);
const INNER_OPEN = '『';
const INNER_CLOSE = '』';
const BOUNDARY_OPEN_QUOTES = ['“', '"', '‘', "'"];
const BOUNDARY_CLOSE_QUOTES = ['”', '"', '’', "'"];

function usage() {
  console.error('Usage: node scripts/fix-quote-span-boundaries.mjs <chapter.json> [--apply] [--limit=N]');
  console.error('Example: node scripts/fix-quote-span-boundaries.mjs data/shiji/002.json --limit=12');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const chapterFile = args.find(arg => !arg.startsWith('--'));
  if (!chapterFile) usage();

  const limitArg = args.find(arg => arg.startsWith('--limit='));
  return {
    chapterFile,
    apply: args.includes('--apply'),
    limit: limitArg ? Number.parseInt(limitArg.slice('--limit='.length), 10) : Infinity
  };
}

function sentenceZh(sentence) {
  return sentence.zh ?? sentence.content ?? '';
}

function setSentenceZh(sentence, value) {
  if (Object.hasOwn(sentence, 'zh')) {
    sentence.zh = value;
  } else {
    sentence.content = value;
  }
}

function translationFields(sentence) {
  const fields = [];
  if (sentence.translations?.[0]) {
    fields.push({ owner: sentence.translations[0], key: 'literal', label: 'literal' });
    fields.push({ owner: sentence.translations[0], key: 'idiomatic', label: 'idiomatic' });
  }
  if (Object.hasOwn(sentence, 'literal')) fields.push({ owner: sentence, key: 'literal', label: 'literal' });
  if (Object.hasOwn(sentence, 'idiomatic')) fields.push({ owner: sentence, key: 'idiomatic', label: 'idiomatic' });
  if (Object.hasOwn(sentence, 'translation')) fields.push({ owner: sentence, key: 'translation', label: 'translation' });
  return fields.filter(field => typeof field.owner[field.key] === 'string' && field.owner[field.key].length > 0);
}

function countChar(text, chars) {
  const lookup = chars instanceof Set ? chars : new Set([chars]);
  let count = 0;
  for (const ch of String(text || '')) {
    if (lookup.has(ch)) count += 1;
  }
  return count;
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

function leadingQuote(text, chars) {
  const index = firstNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return chars.includes(char) ? { index, char } : null;
}

function trailingQuote(text, chars) {
  const index = lastNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return chars.includes(char) ? { index, char } : null;
}

function boundaryQuoteRunStart(text) {
  const str = String(text);
  const start = firstNonSpaceIndex(str);
  if (start < 0) return [];
  const run = [];
  for (let i = start; i < str.length; i += 1) {
    if (!BOUNDARY_OPEN_QUOTES.includes(str[i]) && !BOUNDARY_CLOSE_QUOTES.includes(str[i])) break;
    run.push({ index: i, char: str[i] });
  }
  return run;
}

function boundaryQuoteRunEnd(text) {
  const str = String(text);
  const end = lastNonSpaceIndex(str);
  if (end < 0) return [];
  const run = [];
  for (let i = end; i >= 0; i -= 1) {
    if (!BOUNDARY_OPEN_QUOTES.includes(str[i]) && !BOUNDARY_CLOSE_QUOTES.includes(str[i])) break;
    run.push({ index: i, char: str[i] });
  }
  return run.reverse();
}

function isOpenBoundaryQuote(char) {
  return BOUNDARY_OPEN_QUOTES.includes(char);
}

function isCloseBoundaryQuote(char) {
  return BOUNDARY_CLOSE_QUOTES.includes(char);
}

function removeCharsAt(text, indexes) {
  const sorted = [...indexes].sort((a, b) => b - a);
  let next = text;
  for (const index of sorted) {
    next = next.slice(0, index) + next.slice(index + 1);
  }
  return next;
}

function quoteCloseFor(openOrClose) {
  if (openOrClose === '“' || openOrClose === '”') return '”';
  if (openOrClose === '‘' || openOrClose === '’') return '’';
  if (openOrClose === "'") return "'";
  return '"';
}

function removeCharAt(text, index) {
  return text.slice(0, index) + text.slice(index + 1);
}

function removeCharAtAndTrimBoundarySpace(text, index) {
  let result = removeCharAt(text, index);
  if (index === firstNonSpaceIndex(result) && result[index] === ' ') {
    result = result.slice(0, index) + result.slice(index + 1);
  }
  return result;
}

function appendBeforeTrailingSpace(text, char) {
  const str = String(text);
  const match = str.match(/\s*$/);
  const insertAt = match ? str.length - match[0].length : str.length;
  return str.slice(0, insertAt) + char + str.slice(insertAt);
}

function prependAfterLeadingSpace(text, char) {
  const str = String(text);
  const match = str.match(/^\s*/);
  const insertAt = match ? match[0].length : 0;
  return str.slice(0, insertAt) + char + str.slice(insertAt);
}

function preservesTrailingInnerQuote(chinese, english, quote) {
  if (!/』[。！？!?]?$/u.test(String(chinese || '').trim())) return false;
  const text = String(english || '');
  if (quote.char === '"' || quote.char === '”') return text[quote.index - 1] !== "'";
  return false;
}

function preservesLeadingInnerQuote(chinese, english, quote) {
  if (quote.char !== "'" && quote.char !== '‘') return false;
  if (!String(chinese || '').trimStart().startsWith('『')) return false;
  return !/[“”]/.test(String(english || '').slice(quote.index + 1));
}

function englishOpenChars() {
  return ['"', '“', "'"];
}

function englishCloseChars() {
  return ['"', '”', "'"];
}

function englishCloseFor(openOrClose) {
  return quoteCloseFor(openOrClose);
}

function alreadyEndsWithEnglishClose(text) {
  return Boolean(trailingQuote(text, englishCloseChars()));
}

function proposedChange(proposals, type, sentence, field, before, after, reason) {
  if (before === after) return false;
  proposals.push({
    type,
    id: sentence.id,
    field,
    before,
    after,
    reason
  });
  return true;
}

function normalizeAdjacentQuoteBoundary(sentences, proposals, remaining) {
  let applied = 0;

  for (let i = 0; i < sentences.length && applied < remaining; i++) {
    const current = sentences[i];
    const previous = sentences[i - 1];
    const next = sentences[i + 1];
    let zh = sentenceZh(current);

    const prevTrimmedStart = zh.trimStart();
    if (previous && ((prevTrimmedStart && OUTER_CLOSE.has(prevTrimmedStart[0])) || prevTrimmedStart.startsWith(INNER_CLOSE))) {
      if (applied + 2 > remaining) break;
      const quote = zh.trimStart()[0];
      const leadingSpaces = zh.match(/^\s*/)?.[0] || '';
      const beforeCurrent = zh;
      const beforePrevious = sentenceZh(previous);
      const afterCurrent = leadingSpaces + zh.trimStart().slice(1);
      const afterPrevious = appendBeforeTrailingSpace(beforePrevious, quote);
      proposedChange(proposals, 'move-leading-chinese-close', previous, 'zh', beforePrevious, afterPrevious, `Move leading ${quote} from ${current.id} to the end of ${previous.id}.`);
      proposedChange(proposals, 'move-leading-chinese-close', current, 'zh', beforeCurrent, afterCurrent, `Move leading ${quote} to the end of ${previous.id}.`);
      setSentenceZh(previous, afterPrevious);
      setSentenceZh(current, afterCurrent);
      zh = afterCurrent;
      applied += 2;

      for (const field of translationFields(current)) {
        const marker = leadingQuote(field.owner[field.key], englishCloseChars());
        if (!marker) continue;
        const priorField = translationFields(previous).find(candidate => candidate.label === field.label);
        if (!priorField) continue;
        if (applied + 2 > remaining) break;
        const currentBefore = field.owner[field.key];
        const previousBefore = priorField.owner[priorField.key];
        const currentAfter = removeCharAtAndTrimBoundarySpace(currentBefore, marker.index);
        const previousAfter = alreadyEndsWithEnglishClose(previousBefore)
          ? previousBefore
          : appendBeforeTrailingSpace(previousBefore, englishCloseFor(marker.char));
        proposedChange(proposals, 'move-leading-english-close', previous, field.label, previousBefore, previousAfter, `Move leading English close quote from ${current.id} to ${previous.id}.`);
        proposedChange(proposals, 'move-leading-english-close', current, field.label, currentBefore, currentAfter, `Move leading English close quote to ${previous.id}.`);
        priorField.owner[priorField.key] = previousAfter;
        field.owner[field.key] = currentAfter;
        applied += 2;
      }
    }

    if (next && ((zh.trimEnd() && OUTER_OPEN.has(zh.trimEnd().slice(-1))) || zh.trimEnd().endsWith(INNER_OPEN))) {
      if (applied + 2 > remaining) break;
      const quote = zh.trimEnd().slice(-1);
      const trailingSpaces = zh.match(/\s*$/)?.[0] || '';
      const beforeCurrent = zh;
      const beforeNext = sentenceZh(next);
      const afterCurrent = zh.trimEnd().slice(0, -1) + trailingSpaces;
      const afterNext = prependAfterLeadingSpace(beforeNext, quote);
      proposedChange(proposals, 'move-trailing-chinese-open', current, 'zh', beforeCurrent, afterCurrent, `Move trailing ${quote} from ${current.id} to the start of ${next.id}.`);
      proposedChange(proposals, 'move-trailing-chinese-open', next, 'zh', beforeNext, afterNext, `Move trailing ${quote} from ${current.id} to this sentence.`);
      setSentenceZh(current, afterCurrent);
      setSentenceZh(next, afterNext);
      applied += 2;

      for (const field of translationFields(current)) {
        const marker = trailingQuote(field.owner[field.key], englishOpenChars());
        if (!marker) continue;
        const nextField = translationFields(next).find(candidate => candidate.label === field.label);
        if (!nextField) continue;
        if (applied + 2 > remaining) break;
        const currentBefore = field.owner[field.key];
        const nextBefore = nextField.owner[nextField.key];
        const currentAfter = removeCharAt(currentBefore, marker.index);
        const nextAfter = prependAfterLeadingSpace(nextBefore, marker.char);
        proposedChange(proposals, 'move-trailing-english-open', current, field.label, currentBefore, currentAfter, `Move trailing English open quote from ${current.id} to ${next.id}.`);
        proposedChange(proposals, 'move-trailing-english-open', next, field.label, nextBefore, nextAfter, `Move trailing English open quote from ${current.id} to this sentence.`);
        field.owner[field.key] = currentAfter;
        nextField.owner[nextField.key] = nextAfter;
        applied += 2;
      }
    }
  }

  return applied;
}

function normalizeByChineseDepth(sentences, proposals, remaining) {
  let applied = 0;
  let zhDepth = 0;

  for (const sentence of sentences) {
    if (applied >= remaining) break;
    const zh = sentenceZh(sentence);
    const openCount = countChar(zh, OUTER_OPEN);
    const closeCount = countChar(zh, OUTER_CLOSE);
    const beforeDepth = zhDepth;
    const afterDepth = Math.max(0, zhDepth + openCount - closeCount);
    const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
    const isInteriorUnit = beforeDepth > 0 && afterDepth > 0 && openCount === 0 && closeCount === 0;
    const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;
    zhDepth = afterDepth;

    if (!isOpeningUnit && !isInteriorUnit && !isClosingUnit) continue;

    for (const field of translationFields(sentence)) {
      let before = field.owner[field.key];
      let after = before;
      const runStart = boundaryQuoteRunStart(before);
      const runEnd = boundaryQuoteRunEnd(before);

      if (isOpeningUnit) {
        const trailingOpen = runEnd.every(item => isOpenBoundaryQuote(item.char));
        if (trailingOpen && runEnd.length > 0) {
          after = removeCharsAt(before, runEnd.map(item => item.index));
          if (proposedChange(proposals, 'remove-open-at-open-unit-end', sentence, field.label, before, after, 'Remove opening quote placed at the end of a quote-opening sentence.')) {
            field.owner[field.key] = after;
            applied += 1;
          }
        }
        continue;
      }

      if (isInteriorUnit) {
        const indexes = [];
        for (const item of runStart) {
          if (isOpenBoundaryQuote(item.char) && preservesLeadingInnerQuote(zh, before, item)) continue;
          indexes.push(item.index);
        }
        for (const item of runEnd) {
          if (isCloseBoundaryQuote(item.char) && preservesTrailingInnerQuote(zh, before, item)) continue;
          indexes.push(item.index);
        }
        if (indexes.length > 0 && new Set(indexes).size > 0) {
          after = removeCharsAt(before, [...new Set(indexes)]);
          if (proposedChange(proposals, 'remove-boundary-quote-from-interior-unit', sentence, field.label, before, after, 'Remove boundary quote(s) from an interior sentence in a Chinese multi-sentence quote span.')) {
            field.owner[field.key] = after;
            applied += 1;
          }
        }
        continue;
      }

      if (isClosingUnit) {
        if (runStart.length > 0) {
          const startCloseIndexes = runStart.filter(item => isCloseBoundaryQuote(item.char)).map(item => item.index);
          if (startCloseIndexes.length > 0) {
            after = removeCharsAt(before, startCloseIndexes);
            if (proposedChange(proposals, 'remove-close-from-closing-unit-start', sentence, field.label, before, after, 'Remove a closing quote from the start of a closing sentence.')) {
              before = after;
              field.owner[field.key] = after;
              applied += 1;
            }
          }
        }

        const hasClosing = boundaryQuoteRunEnd(after).some(item => isCloseBoundaryQuote(item.char));
        if (!hasClosing && after.trim() !== '') {
          const quoteToAdd = quoteCloseFor(runStart.length > 0 ? runStart[runStart.length - 1].char : '"');
          const withClose = appendBeforeTrailingSpace(after, quoteToAdd);
          if (proposedChange(proposals, 'append-close-to-closing-unit-end', sentence, field.label, after, withClose, 'Add closing quote at the end of a closing sentence in a Chinese multi-sentence quote span.')) {
            field.owner[field.key] = withClose;
            applied += 1;
          }
        }
      }
    }
  }

  return applied;
}

function outerQuoteSpans(sentences) {
  const spans = [];
  const stack = [];

  for (let i = 0; i < sentences.length; i++) {
    const zh = sentenceZh(sentences[i]);
    for (let j = 0; j < countChar(zh, OUTER_OPEN); j++) stack.push(i);
    for (let j = 0; j < countChar(zh, OUTER_CLOSE); j++) {
      const start = stack.pop();
      if (start !== undefined && start < i) {
        spans.push({ start, end: i });
      }
    }
  }

  return spans;
}

function fixEnglishSpanBoundaries(sentences, proposals, remaining) {
  let applied = 0;

  for (const span of outerQuoteSpans(sentences)) {
    if (applied >= remaining) break;
    const start = sentences[span.start];
    const end = sentences[span.end];

    for (const startField of translationFields(start)) {
      if (applied >= remaining) break;
      const endField = translationFields(end).find(candidate => candidate.label === startField.label);
      if (!endField) continue;

      const startText = startField.owner[startField.key];
      const endText = endField.owner[endField.key];
      const startClose = trailingQuote(startText, englishCloseChars());
      if (!startClose) continue;
      if (startClose.char === "'") continue;
      if (preservesTrailingInnerQuote(sentenceZh(start), startText, startClose)) continue;

      const endAlreadyCloses = trailingQuote(endText, englishCloseChars());
      const quoteToMove = englishCloseFor(startClose.char);
      const startAfter = removeCharAt(startText, startClose.index);
      const endAfter = endAlreadyCloses ? endText : appendBeforeTrailingSpace(endText, quoteToMove);
      const changeCount = endAfter !== endText ? 2 : 1;
      if (applied + changeCount > remaining) continue;

      proposedChange(proposals, 'extend-english-quote-span', start, startField.label, startText, startAfter, `Chinese quote span continues through ${end.id}; remove premature closing quote from ${start.id}.`);
      startField.owner[startField.key] = startAfter;
      applied++;

      if (endAfter !== endText) {
        proposedChange(proposals, 'extend-english-quote-span', end, endField.label, endText, endAfter, `Chinese quote span closes here; add closing quote moved from ${start.id}.`);
        endField.owner[endField.key] = endAfter;
        applied++;
      }
    }
  }

  return applied;
}

function proposalSummary(proposals) {
  const counts = new Map();
  for (const proposal of proposals) {
    counts.set(proposal.type, (counts.get(proposal.type) || 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort());
}

function printProposals(chapterFile, proposals, apply) {
  console.log(`${apply ? 'Applied' : 'Proposed'} ${proposals.length} quote-boundary change(s) for ${chapterFile}`);
  console.log(JSON.stringify(proposalSummary(proposals), null, 2));
  console.log('');

  for (const proposal of proposals) {
    console.log(`${proposal.type} ${proposal.id} ${proposal.field}`);
    console.log(`  reason: ${proposal.reason}`);
    console.log(`  before: ${proposal.before}`);
    console.log(`  after:  ${proposal.after}`);
    console.log('');
  }
}

function fixChapterQuoteBoundaries(chapter, options = {}) {
  const limit = options.limit ?? Infinity;
  const proposals = [];

  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    const sentences = block.sentences || [];
    const remainingAfterAdjacent = Math.max(0, limit - proposals.length);
    normalizeAdjacentQuoteBoundary(sentences, proposals, remainingAfterAdjacent);
    const remainingAfterDepthFixes = Math.max(0, limit - proposals.length);
    normalizeByChineseDepth(sentences, proposals, remainingAfterDepthFixes);
    const remainingAfterSpanFixes = Math.max(0, limit - proposals.length);
    fixEnglishSpanBoundaries(sentences, proposals, remainingAfterSpanFixes);
  }

  return { chapter, proposals, summary: proposalSummary(proposals) };
}

function main() {
  const { chapterFile, apply, limit } = parseArgs();
  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
  const { proposals } = fixChapterQuoteBoundaries(chapter, { limit });

  printProposals(chapterFile, proposals, apply);

  if (apply && proposals.length > 0) {
    fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
    console.log(`Wrote ${path.relative(process.cwd(), chapterFile)}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  fixChapterQuoteBoundaries,
  proposalSummary
};
