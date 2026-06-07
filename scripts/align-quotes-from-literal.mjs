#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

function usage() {
  console.error(`Usage:
  node scripts/align-quotes-from-literal.mjs [--book=<id>] [--chapter=data/<book>/<chapter>.json] [--apply] [--details] [--out=<report.json>]

For sentences currently flagged by the strict quote-span checker, replace the
rendered English field with the literal translation, adding English quote
boundaries from the Chinese span when needed. This is a scaffolded
quote-alignment repair for chapters whose idiomatic translation compressed
direct quotation into narration.`);
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const chapter = argValue('--chapter');
  const book = argValue('--book');
  if ((chapter && book) || (!chapter && !book)) usage();
  return {
    book,
    chapter,
    apply: process.argv.includes('--apply'),
    details: process.argv.includes('--details'),
    out: argValue('--out') || null
  };
}

function chapterFiles(opts) {
  if (opts.chapter) return [opts.chapter];
  return fs.readdirSync(path.join('data', opts.book))
    .filter(file => /^\d{3}\.json$/.test(file))
    .sort()
    .map(file => path.join('data', opts.book, file));
}

function scannerProblems(file) {
  const res = spawnSync('node', ['scripts/scan-quote-span-alignment.mjs', file, '--limit=-1'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 32
  });
  const output = `${res.stdout || ''}${res.stderr || ''}`;
  if (res.status === 0) return [];
  if (!/^Found \d+ quote-span alignment problem/m.test(output)) {
    process.stderr.write(output);
    process.exit(res.status || 1);
  }
  return [...output.matchAll(/^\S+\s+(\S+)\s+block\s+\d+/gm)].map(match => match[1]);
}

function renderedField(sentence) {
  if (typeof sentence.idiomatic === 'string') return { owner: sentence, key: 'idiomatic' };
  if (sentence.translations?.[0] && typeof sentence.translations[0].idiomatic === 'string') {
    return { owner: sentence.translations[0], key: 'idiomatic' };
  }
  if (typeof sentence.translation === 'string') return { owner: sentence, key: 'translation' };
  return null;
}

function literalText(sentence) {
  if (typeof sentence.literal === 'string') return sentence.literal;
  if (typeof sentence.translations?.[0]?.literal === 'string') return sentence.translations[0].literal;
  return '';
}

function hasEnglishQuote(text) {
  return /["“”'‘’]/.test(String(text || ''));
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

function opensWithQuote(text) {
  return /^[\s〈(\[]*["“'‘]/u.test(String(text || ''));
}

function closesWithQuote(text) {
  return /["”'’][\s〉)\].,;:!?]*$/u.test(String(text || ''));
}

function addOpeningAtStart(text) {
  if (opensWithQuote(text)) return text;
  return insertAt(text, firstNonSpaceIndex(text), '"');
}

function addClosingAtEnd(text) {
  if (closesWithQuote(text)) return text;
  return appendBeforeTrailingSpace(text, '"');
}

function afterLastColon(text) {
  const index = Math.max(text.lastIndexOf(':'), text.lastIndexOf('：'));
  if (index < 0) return -1;
  return index + 1 + (text.slice(index + 1).match(/^\s*/)?.[0].length || 0);
}

function addOpeningAfterSpeechTag(text) {
  if (opensWithQuote(text)) return text;
  const colon = afterLastColon(text);
  if (colon >= 0) return insertAt(text, colon, '"');
  return addOpeningAtStart(text);
}

function quoteKindForSentence(sentence, depthBefore) {
  const zh = sentence.zh || sentence.content || '';
  const openCount = countSubstr(zh, '「');
  const closeCount = countSubstr(zh, '」');
  const depthAfter = Math.max(0, depthBefore + openCount - closeCount);
  const kind = depthBefore === 0 && depthAfter === 0 && openCount > 0 && closeCount > 0
    ? 'complete'
    : depthBefore === 0 && depthAfter > 0 && openCount > 0
      ? 'opening'
      : depthBefore > 0 && depthAfter === 0 && closeCount > 0
        ? 'closing'
        : depthBefore > 0 || depthAfter > 0 || openCount > 0 || closeCount > 0
          ? 'inside'
          : null;
  return { kind, depthAfter };
}

function addBoundaryQuotes(text, kind) {
  if (hasEnglishQuote(text)) return text;
  if (kind === 'complete') return addClosingAtEnd(addOpeningAfterSpeechTag(text));
  if (kind === 'opening') return addOpeningAfterSpeechTag(text);
  if (kind === 'closing') return addClosingAtEnd(text);
  return text;
}

function main() {
  const opts = parseArgs();
  const report = [];
  let total = 0;

  for (const chapterFile of chapterFiles(opts)) {
    const ids = new Set(scannerProblems(chapterFile));
    if (ids.size === 0) continue;
    const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
    const changes = [];

    for (const block of chapter.content || []) {
      if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
      let depth = 0;
      for (const sentence of block.sentences || []) {
        const { kind, depthAfter } = quoteKindForSentence(sentence, depth);
        depth = depthAfter;
        if (!ids.has(sentence.id)) continue;
        const field = renderedField(sentence);
        const literal = literalText(sentence);
        if (!field || !literal || !kind) continue;
        const before = field.owner[field.key];
        const after = addBoundaryQuotes(literal, kind);
        if (before === after) continue;
        field.owner[field.key] = after;
        changes.push({ id: sentence.id, field: field.key, before, after });
      }
    }

    if (changes.length === 0) continue;
    total += changes.length;
    report.push({ chapter: chapterFile, changes });
    if (opts.apply) fs.writeFileSync(chapterFile, `${JSON.stringify(chapter, null, 2)}\n`);

    console.log(`${chapterFile}: ${opts.apply ? 'applied' : 'proposed'} ${changes.length} literal-scaffold quote alignment change(s)`);
    if (opts.details) {
      for (const change of changes) {
        console.log(`  ${change.id} ${change.field}`);
        console.log(`    before: ${change.before}`);
        console.log(`    after:  ${change.after}`);
      }
    }
  }

  console.log(`${opts.apply ? 'Applied' : 'Proposed'} ${total} literal-scaffold quote alignment change(s) across ${report.length}/${chapterFiles(opts).length} chapter(s).`);
  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify({ applied: opts.apply, book: opts.book, chapter: opts.chapter, total, chapters: report }, null, 2)}\n`);
    console.log(`Wrote ${opts.out}`);
  }
}

main();
