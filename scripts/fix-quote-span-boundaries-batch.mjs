#!/usr/bin/env node

import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

import { fixChapterQuoteBoundaries } from './fix-quote-span-boundaries.mjs';

function usage() {
  console.error('Usage: node scripts/fix-quote-span-boundaries-batch.mjs [--book=<id>] [--chapter=<path>] [--apply] [--summary-only] [--details] [--out=<report.json>] [--limit-chapters=N] [--limit-changes-per-chapter=N] [--unsafe-depth-fixes]');
  console.error('Examples:');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --book=shiji');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --book=shiji --apply');
  console.error('  node scripts/fix-quote-span-boundaries-batch.mjs --chapter=data/shiji/005.json --details');
  console.error('');
  console.error('Default mode only moves adjacent boundary punctuation. Depth-based');
  console.error('English quote add/remove fixes require --unsafe-depth-fixes and manual review.');
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
    unsafeDepthFixes: process.argv.includes('--unsafe-depth-fixes'),
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

function strictQuoteProblemCount(file) {
  const result = spawnSync('node', ['scripts/scan-quote-span-alignment.mjs', file, '--publication', '--json', '--no-fail'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`Quote scanner failed for ${file}`);
  }
  return JSON.parse(result.stdout).totalItems || 0;
}

function strictQuoteProblemCountForChapter(chapter, sourceFile) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quote-fix-'));
  const tempFile = path.join(tempDir, path.basename(sourceFile));
  try {
    fs.writeFileSync(tempFile, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
    return strictQuoteProblemCount(tempFile);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
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
    const beforeQuoteProblems = strictQuoteProblemCount(file);
    const working = JSON.parse(JSON.stringify(original));
    const { proposals, summary } = fixChapterQuoteBoundaries(working, {
      limit: options.limitChangesPerChapter,
      unsafeDepthFixes: options.unsafeDepthFixes,
    });
    const afterQuoteProblems = strictQuoteProblemCountForChapter(working, file);

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
        console.log(`${file}: ${action} ${proposals.length} quote-boundary change(s); quote problems ${beforeQuoteProblems} -> ${afterQuoteProblems}`);
      }
      if (options.details) printChapterDetails(file, proposals);
      if (options.apply) {
        fs.writeFileSync(file, JSON.stringify(working, null, 2));
      }
    }
  }

  console.log('');
  console.log(`${options.apply ? 'Applied' : 'Proposed'} ${totals.proposedChanges} quote-boundary change(s) across ${totals.changed}/${totals.scanned} chapter(s).`);
  if (options.unsafeDepthFixes) {
    console.log('WARNING: --unsafe-depth-fixes was enabled; every before/after change requires manual review before commit.');
  }
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
