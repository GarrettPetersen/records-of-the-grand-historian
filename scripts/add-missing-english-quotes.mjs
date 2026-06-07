#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const OUTER_OPEN = '「';
const OUTER_CLOSE = '」';

function usage() {
  console.error(`Usage:
  node scripts/add-missing-english-quotes.mjs [--book=<id>] [--chapter=<path>] [--apply] [--details] [--out=<report.json>]

Adds English quote marks where Chinese 「...」 quote spans have no matching English quote marks.
This intentionally handles only structural quote-boundary cases. It does not convert indirect
speech into direct speech; those remain translation errors for review.`);
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const opts = {
    book: argValue('--book') || null,
    chapter: argValue('--chapter') || null,
    apply: process.argv.includes('--apply'),
    details: process.argv.includes('--details'),
    out: argValue('--out') || null
  };
  if (opts.book && opts.chapter) {
    console.error('Use either --book or --chapter, not both.');
    process.exit(2);
  }
  return opts;
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

function countSubstr(str, needle) {
  if (!str || !needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = String(str).indexOf(needle, index)) !== -1) {
    count += 1;
    index += needle.length;
  }
  return count;
}

function countSingleQuoteDelimiters(text) {
  const en = String(text || '');
  let count = 0;
  for (let i = 0; i < en.length; i += 1) {
    if (en[i] !== "'" && en[i] !== '‘' && en[i] !== '’') continue;
    if (en[i] === '‘' || en[i] === '’') {
      count += 1;
      continue;
    }
    const prev = en[i - 1] || '';
    const next = en[i + 1] || '';
    if (/[A-Za-z]/.test(prev) && /[A-Za-z]/.test(next)) continue;
    if (/[sS]/.test(prev) && (!next || /[\s,.;:!?)}\]]/.test(next))) continue;
    count += 1;
  }
  return count;
}

function countEnglishQuoteMarks(text) {
  const en = String(text || '');
  return countSubstr(en, '"') + countSubstr(en, '“') + countSubstr(en, '”') + countSingleQuoteDelimiters(en);
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
  return match ? match.index : 0;
}

function lastNonSpaceIndex(text) {
  const str = String(text);
  for (let i = str.length - 1; i >= 0; i -= 1) {
    if (!/\s/.test(str[i])) return i;
  }
  return -1;
}

function insertAt(text, index, value) {
  return text.slice(0, index) + value + text.slice(index);
}

function appendBeforeTrailingSpace(text, value) {
  const end = lastNonSpaceIndex(text);
  if (end < 0) return value;
  return insertAt(text, end + 1, value);
}

function appendBeforeTrailingAnnotationClosers(text, value) {
  let end = lastNonSpaceIndex(text);
  if (end < 0) return value;
  while (end >= 0 && /[〉)\]]/u.test(text[end])) end -= 1;
  return insertAt(text, end + 1, value);
}

function opensWithQuote(text) {
  return /^[\s〈(\[]*["“'‘]/u.test(String(text || ''));
}

function closesWithQuote(text) {
  return /["”'’][\s〉)\].,;:!?]*$/u.test(String(text || ''));
}

function addOpeningAtStart(text) {
  if (opensWithQuote(text)) return text;
  const index = firstNonSpaceIndex(text);
  return insertAt(text, index, '"');
}

function addClosingAtEnd(text) {
  if (closesWithQuote(text)) return text;
  if (/[〉)\]][\s]*$/u.test(String(text || ''))) {
    return appendBeforeTrailingAnnotationClosers(text, '"');
  }
  return appendBeforeTrailingSpace(text, '"');
}

function afterLastColon(text) {
  const index = Math.max(text.lastIndexOf(':'), text.lastIndexOf('：'));
  if (index < 0) return -1;
  return index + 1 + (text.slice(index + 1).match(/^\s*/)?.[0].length || 0);
}

function looksLikeIndirectSpeech(text) {
  return /\b(?:said|asked|answered|replied|declared|reported|remarked|warned|advised|urged|argued|memorialized|proclaimed|announced|ordered|commanded|instructed|told|addressed|responded|objected|explained|noted|wrote|records|says)\b(?:[^.!?;:]{0,110})?\s+that\s+/i.test(String(text || ''))
    || /\b(?:warned|advised|urged|ordered|commanded|instructed|told|asked)\s+(?:him|her|them|people|everyone|the emperor|the king|the ruler|the court|his men|his officers|his troops)\s+(?:to|not to)\b/i.test(String(text || ''));
}

function addOpeningQuote(text) {
  if (countEnglishQuoteMarks(text) > 0 || opensWithQuote(text)) return text;
  if (looksLikeIndirectSpeech(text)) return text;
  const colon = afterLastColon(text);
  if (colon >= 0 && colon >= text.length - 2) {
    return /:\s*$/u.test(text) ? `${text} "` : insertAt(text, text.length, '"');
  }
  if (colon >= 0) return insertAt(text, colon, '"');

  return text;
}

function addCompleteQuotes(text) {
  if (countEnglishQuoteMarks(text) > 0) return text;
  let next = addOpeningQuote(text);
  if (next === text) return text;
  next = addClosingAtEnd(next);
  return next;
}

function addBoundaryQuote(text, kind) {
  if (countEnglishQuoteMarks(text) > 0) return text;
  if (kind === 'complete') return addCompleteQuotes(text);
  if (kind === 'opening') return addOpeningQuote(text);
  if (kind === 'closing') return addClosingAtEnd(text);
  return text;
}

function fixChapter(chapter) {
  const changes = [];

  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    let depth = 0;

    for (const sentence of block.sentences || []) {
      const zh = sentence.zh || sentence.content || '';
      const openCount = countSubstr(zh, OUTER_OPEN);
      const closeCount = countSubstr(zh, OUTER_CLOSE);
      const beforeDepth = depth;
      const afterDepth = Math.max(0, depth + openCount - closeCount);
      depth = afterDepth;

      const inChineseQuoteSpan = beforeDepth > 0 || afterDepth > 0 || openCount > 0 || closeCount > 0;
      if (!inChineseQuoteSpan) continue;

      const isCompleteUnit = beforeDepth === 0 && afterDepth === 0 && openCount > 0 && closeCount > 0;
      const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
      const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;

      const kind = isCompleteUnit ? 'complete' : isOpeningUnit ? 'opening' : isClosingUnit ? 'closing' : null;
      if (!kind) continue;

      for (const field of translationFields(sentence)) {
        const before = field.owner[field.key];
        const after = addBoundaryQuote(before, kind);
        if (after === before) continue;
        field.owner[field.key] = after;
        changes.push({
          blockIndex,
          id: sentence.id,
          field: field.key,
          kind,
          before,
          after
        });
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
    console.log(`${file}: ${opts.apply ? 'applied' : 'proposed'} ${changes.length} missing-quote change(s)`);
    if (opts.details) {
      for (const change of changes) {
        console.log(`  ${change.id} ${change.field} ${change.kind}`);
        console.log(`    before: ${change.before}`);
        console.log(`    after:  ${change.after}`);
      }
    }
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`);
  }

  console.log(`${opts.apply ? 'Applied' : 'Proposed'} ${total} missing-quote change(s) across ${report.length}/${files.length} chapter(s).`);
  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify({ applied: opts.apply, total, chapters: report }, null, 2)}\n`);
    console.log(`Wrote ${opts.out}`);
  }
}

main();
