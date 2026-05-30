#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { fixChapterQuoteBoundaries } from './fix-quote-span-boundaries.mjs';
import { scoreChapterData } from '../score-translations.js';

function usage() {
  console.error('Usage: node scripts/fix-quote-span-boundaries-batch.mjs [--book=<id>] [--chapter=<path>] [--apply] [--summary-only] [--details] [--out=<report.json>] [--limit-chapters=N] [--limit-changes-per-chapter=N]');
  console.error('Examples:');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --book=shiji');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --book=shiji --apply');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --chapter=data/shiji/005.json --details');
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const limitChapters = argValue('--limit-chapters');
  const limitChanges = argValue('--limit-changes-per-chapter');
  return {
    book: argValue('--book'),
    chapter: argValue('--chapter'),
    apply: process.argv.includes('--apply'),
    details: process.argv.includes('--details'),
    summaryOnly: process.argv.includes('--summary-only'),
    out: argValue('--out'),
    limitChapters: limitChapters ? Number.parseInt(limitChapters, 10) : Infinity,
    limitChangesPerChapter: limitChanges ? Number.parseInt(limitChanges, 10) : Infinity
  };
}

function chapterFiles(options) {
  if (options.chapter) return [options.chapter];

  const dataDir = 'data';
  const books = fs.readdirSync(dataDir)
    .filter(name => fs.statSync(path.join(dataDir, name)).isDirectory())
    .filter(name => name !== 'quality')
    .filter(name => !options.book || name === options.book)
    .sort();

  if (options.book && books.length === 0) {
    throw new Error(`Book not found: ${options.book}`);
  }

  const files = [];
  for (const book of books) {
    const bookDir = path.join(dataDir, book);
    for (const file of fs.readdirSync(bookDir).sort()) {
      if (/^\d{3}\.json$/.test(file)) files.push(path.join(bookDir, file));
    }
  }

  return files.slice(0, options.limitChapters);
}

function quoteProblemCount(chapter) {
  return scoreChapterData(chapter)
    .filter(result => result.problematic)
    .filter(result => result.issues.some(issue => issue.includes('Quote span mismatch')))
    .length;
}

function mergeSummary(target, source) {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] || 0) + value;
  }
}

function printChapterDetails(file, proposals) {
  for (const proposal of proposals) {
    console.log(`${file} ${proposal.type} ${proposal.id} ${proposal.field}`);
    console.log(`  before: ${proposal.before}`);
    console.log(`  after:  ${proposal.after}`);
    console.log(`  reason: ${proposal.reason}`);
    console.log('');
  }
}

function main() {
  const options = parseArgs();
  const files = chapterFiles(options);
  const totals = {
    scanned: 0,
    changed: 0,
    proposedChanges: 0,
    beforeQuoteProblems: 0,
    afterQuoteProblems: 0
  };
  const fixTypeSummary = {};
  const remaining = [];
  const chapters = [];

  for (const file of files) {
    const original = JSON.parse(fs.readFileSync(file, 'utf8'));
    const beforeQuoteProblems = quoteProblemCount(original);
    const working = JSON.parse(JSON.stringify(original));
    const { proposals, summary } = fixChapterQuoteBoundaries(working, {
      limit: options.limitChangesPerChapter
    });
    const afterQuoteProblems = quoteProblemCount(working);

    totals.scanned++;
    totals.proposedChanges += proposals.length;
    totals.beforeQuoteProblems += beforeQuoteProblems;
    totals.afterQuoteProblems += afterQuoteProblems;
    mergeSummary(fixTypeSummary, summary);

    if (afterQuoteProblems > 0) {
      remaining.push({ file, beforeQuoteProblems, afterQuoteProblems, proposedChanges: proposals.length });
    }
    if (proposals.length > 0 || beforeQuoteProblems > 0 || afterQuoteProblems > 0) {
      chapters.push({
        file,
        proposedChanges: proposals.length,
        beforeQuoteProblems,
        afterQuoteProblems,
        fixTypes: summary
      });
    }

    if (proposals.length > 0) {
      totals.changed++;
      const action = options.apply ? 'applied' : 'proposed';
      if (!options.summaryOnly) {
        console.log(`${file}: ${action} ${proposals.length} safe change(s); quote problems ${beforeQuoteProblems} -> ${afterQuoteProblems}`);
      }
      if (options.details) printChapterDetails(file, proposals);
      if (options.apply) {
        fs.writeFileSync(file, JSON.stringify(working, null, 2));
      }
    }
  }

  console.log('');
  console.log(`${options.apply ? 'Applied' : 'Proposed'} ${totals.proposedChanges} safe quote-boundary change(s) across ${totals.changed}/${totals.scanned} chapter(s).`);
  console.log(`Quote problems in scanned chapters: ${totals.beforeQuoteProblems} -> ${totals.afterQuoteProblems}`);
  console.log(`Fix types: ${JSON.stringify(fixTypeSummary)}`);

  const unresolvedCount = totals.afterQuoteProblems;
  if (unresolvedCount > 0) {
    console.log(`${unresolvedCount} quote issue(s) remain in scanned chapters after safe fixes.`);
    const shown = remaining
      .sort((a, b) => b.afterQuoteProblems - a.afterQuoteProblems)
      .slice(0, 20);
    for (const item of shown) {
      console.log(`  ${item.file}: ${item.afterQuoteProblems} remaining (${item.proposedChanges} safe change(s) ${options.apply ? 'applied' : 'available'})`);
    }
    if (remaining.length > shown.length) {
      console.log(`  ... ${remaining.length - shown.length} more chapter(s) with no safe fix proposals`);
    }
  }

  if (options.out) {
    fs.mkdirSync(path.dirname(options.out), { recursive: true });
    fs.writeFileSync(options.out, JSON.stringify({
      applied: options.apply,
      scannedChapters: totals.scanned,
      changedChapters: totals.changed,
      proposedChanges: totals.proposedChanges,
      beforeQuoteProblems: totals.beforeQuoteProblems,
      afterQuoteProblems: totals.afterQuoteProblems,
      fixTypes: fixTypeSummary,
      chapters
    }, null, 2));
    console.log(`Wrote ${options.out}`);
  }
}

main();
