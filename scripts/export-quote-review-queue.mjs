#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

function usage() {
  console.error(`Usage:
  node scripts/export-quote-review-queue.mjs --book=<id> [--out=<path>]

Runs the strict quote alignment scanner and writes a JSON review queue with
coarse categories for triage. Items categorized as indirect_speech require
translation edits, not punctuation-only fixes.`);
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const book = argValue('--book');
  if (!book) usage();
  return {
    book,
    out: argValue('--out') || `data/quality/quote-review-${book}.json`
  };
}

function runScanner(book) {
  const res = spawnSync('node', ['scripts/scan-quote-span-alignment.mjs', '--book', book, '--limit=-1'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64
  });
  const output = `${res.stdout || ''}${res.stderr || ''}`;
  if (res.status !== 0 && !/^Found \d+ quote-span alignment problem/m.test(output)) {
    process.stderr.write(output);
    process.exit(res.status || 1);
  }
  return output;
}

function parseScannerOutput(output) {
  const items = [];
  let current = null;

  for (const line of output.split(/\n/)) {
    const head = line.match(/^(data\/[^/]+\/\d{3}\.json)\s+(\S+)\s+block\s+(\d+)/);
    if (head) {
      current = {
        file: head[1],
        id: head[2],
        blockIndex: Number(head[3]),
        problems: [],
        chinese: '',
        english: ''
      };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const problem = line.match(/^  ((?:Chinese|English).+\.)$/);
    if (problem) {
      current.problems.push(problem[1]);
      continue;
    }
    const zh = line.match(/^  zh: (.*)$/);
    if (zh) {
      current.chinese = zh[1];
      continue;
    }
    const en = line.match(/^  en: (.*)$/);
    if (en) current.english = en[1];
  }

  return items;
}

function looksLikeIndirectSpeech(english) {
  const text = String(english || '');
  return /\b(?:said|asked|answered|replied|declared|reported|remarked|warned|advised|urged|argued|memorialized|proclaimed|announced|ordered|commanded|instructed|told|addressed|responded|objected|explained|noted|wrote|records|says)\b(?:[^.!?;:]{0,110})?\s+that\s+/i.test(text)
    || /\b(?:warned|advised|urged|ordered|commanded|instructed|told|asked)\s+(?:him|her|them|people|everyone|the emperor|the king|the ruler|the court|his men|his officers|his troops|the officers)\s+(?:to|not to)\b/i.test(text)
    || /^(?:He|She|They|The emperor|The king|The ruler|The court|The officials|The memorial|The edict|The reply)\s+(?:ordered|commanded|instructed|warned|advised|urged|reported|declared|said|answered|replied|asked|memorialized|proclaimed)\b/i.test(text);
}

function looksLikePunctuationOnly(item) {
  const en = item.english.trim();
  return /:\s*$/u.test(en)
    || /:\s+\S/u.test(en)
    || /^(?:Let|Do not|Do|May|If|When|Why|How|Who|What|Where|Please|I|We|You|Your|Our|This|These|That|Those)\b/.test(en);
}

function looksLikeTextualVariant(chinese) {
  return /(?:一作|或作|本作|當作|疑作|衍|脫|少|多)[^「」]{0,8}「[^」]{1,20}」/u.test(String(chinese || ''));
}

function categorize(item) {
  if (looksLikeTextualVariant(item.chinese)) return 'textual_variant_or_gloss';
  if (looksLikeIndirectSpeech(item.english)) return 'indirect_speech';
  if (looksLikePunctuationOnly(item)) return 'punctuation_or_boundary';
  if (item.problems.some(problem => problem.includes('English has'))) return 'misplaced_existing_quotes';
  return 'needs_review';
}

function summarize(items) {
  const byCategory = {};
  const byChapter = {};
  for (const item of items) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    byChapter[item.file] = (byChapter[item.file] || 0) + 1;
  }
  return {
    total: items.length,
    byCategory,
    affectedChapters: Object.keys(byChapter).length,
    topChapters: Object.entries(byChapter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([file, count]) => ({ file, count }))
  };
}

function main() {
  const opts = parseArgs();
  const output = runScanner(opts.book);
  const items = parseScannerOutput(output).map(item => ({
    ...item,
    category: categorize(item)
  }));
  const report = {
    book: opts.book,
    generatedAt: new Date().toISOString(),
    summary: summarize(items),
    items
  };

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${opts.out}`);
  console.log(JSON.stringify(report.summary, null, 2));
}

main();
