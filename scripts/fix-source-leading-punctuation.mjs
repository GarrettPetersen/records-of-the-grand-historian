#!/usr/bin/env node
/**
 * Move source-side sentence-leading closing punctuation onto the previous
 * source unit. This repairs scrape/segmentation artifacts such as:
 *
 *   previous.zh = "常寄以布素之意。"
 *   current.zh  = "，悠然玄邁，不以世務嬰心。"
 *
 * into:
 *
 *   previous.zh = "常寄以布素之意。，"
 *   current.zh  = "悠然玄邁，不以世務嬰心。"
 *
 * Dry-run by default. Pass --apply to write chapter files and mark matching
 * source-artifact queue entries as applied.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DEFAULT_QUEUE = path.join(DATA_DIR, 'quality/source-artifacts-corpus.json');
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const LEADING_ATTACHING_PUNCT_RE = /^[，、。；：！？」』”）)\]】〉》]+/u;
const TERMINAL_SEPARATOR_ARTIFACT_RE = /[。！？；]([，、：；？！]+[」』”）)\]】〉》]*)/gu;
const DEFAULT_REVIEWER = 'fix-source-leading-punctuation';

function usage() {
  console.error(`Usage:
  node scripts/fix-source-leading-punctuation.mjs [--apply] [--book BOOK]
    [--queue PATH] [--reviewer NAME] [path ...]

Moves leading attached punctuation in source fields to the previous source unit.
Dry-run by default. With --apply, also marks matching queue items applied.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    book: null,
    inputs: [],
    queue: DEFAULT_QUEUE,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--queue') {
      opts.queue = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length);
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }

  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }

  return opts;
}

function chapterFiles(opts) {
  const inputs = opts.inputs.length > 0
    ? opts.inputs
    : opts.book
      ? [path.join(DATA_DIR, opts.book)]
      : fs.readdirSync(DATA_DIR)
        .map((entry) => path.join(DATA_DIR, entry))
        .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');

  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (CHAPTER_RE.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function sourceKey(item) {
  for (const key of SOURCE_KEYS) {
    if (typeof item?.[key] === 'string') return key;
  }
  return null;
}

function collectSourceUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, item] of block.sentences.entries()) {
        const key = sourceKey(item);
        if (key) {
          units.push({
            item,
            key,
            blockIndex,
            blockType: block.type || '',
            index,
            path: `sentences.${index}.${key}`,
            id: item.id || '',
          });
        }
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, item] of block.cells.entries()) {
        const key = sourceKey(item);
        if (key) {
          units.push({
            item,
            key,
            blockIndex,
            blockType: block.type || '',
            index,
            path: `cells.${index}.${key}`,
            id: item.id || '',
          });
        }
      }
    }
  }
  return units;
}

function previousSourceUnit(units, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const unit = units[i];
    if (String(unit.item[unit.key] || '').length > 0) return unit;
  }
  return null;
}

function normalizeTerminalSeparatorArtifacts(units) {
  const changes = [];
  for (const unit of units) {
    const before = String(unit.item[unit.key] || '');
    let count = 0;
    const after = before.replace(TERMINAL_SEPARATOR_ARTIFACT_RE, (...args) => {
      count += 1;
      return args[1];
    });
    if (after === before) continue;
    unit.item[unit.key] = after;
    changes.push({ unit, before, after, count });
  }
  return changes;
}

function queueKey(file, unit, found) {
  return [
    path.resolve(file),
    unit.path,
    unit.id,
    found,
  ].join('\u241f');
}

function queueLookup(queue) {
  const lookup = new Map();
  for (const item of [...(queue?.hits || []), ...(queue?.resolvedHits || [])]) {
    if (item.ruleId !== 'SOURCE_LEADING_ATTACHED_PUNCTUATION') continue;
    const key = [
      path.resolve(item.file || ''),
      item.path || '',
      item.sentenceId || '',
      item.found || '',
    ].join('\u241f');
    if (!lookup.has(key)) lookup.set(key, []);
    lookup.get(key).push(item);
  }
  return lookup;
}

function loadQueue(queuePath) {
  if (!queuePath || !fs.existsSync(queuePath)) return null;
  return JSON.parse(fs.readFileSync(queuePath, 'utf8'));
}

function applyQueueStatus(queue, lookup, changes, now, reviewer) {
  if (!queue) return 0;
  let marked = 0;

  for (const change of changes) {
    const matches = lookup.get(queueKey(change.file, change.unit, change.punctuation)) || [];
    for (const item of matches) {
      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || reviewer;
      item.appliedAt = now;
      item.appliedSummary = `Moved leading source punctuation ${JSON.stringify(change.punctuation)} to previous source unit ${change.previousId || change.previousPath}.`;
      marked += 1;
    }
  }

  return marked;
}

function fixFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = collectSourceUnits(data);
  const changes = [];
  const skipped = [];

  for (let i = 0; i < units.length; i += 1) {
    const unit = units[i];
    const text = String(unit.item[unit.key] || '');
    const match = text.match(LEADING_ATTACHING_PUNCT_RE);
    if (!match) continue;

    const punctuation = match[0];
    const rest = text.slice(punctuation.length);
    if (rest.length === 0) {
      skipped.push({ file, unit, punctuation, reason: 'punctuation-only source unit' });
      continue;
    }

    const previous = previousSourceUnit(units, i);
    if (!previous) {
      skipped.push({ file, unit, punctuation, reason: 'no previous source unit' });
      continue;
    }

    previous.item[previous.key] = `${previous.item[previous.key]}${punctuation}`;
    unit.item[unit.key] = rest;
    changes.push({
      file,
      unit,
      previous,
      punctuation,
      previousPath: previous.path,
      previousId: previous.id,
    });
  }

  const separatorFixes = normalizeTerminalSeparatorArtifacts(units);

  return { data, changes, separatorFixes, skipped };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  const queue = opts.apply ? loadQueue(opts.queue) : null;
  const lookup = queueLookup(queue);
  const now = new Date().toISOString();

  let changedFiles = 0;
  let movedFiles = 0;
  let moved = 0;
  let normalizedSeparators = 0;
  let skippedCount = 0;
  let queueMarked = 0;
  const byPunctuation = new Map();
  const skippedSamples = [];

  for (const file of files) {
    const result = fixFile(file);
    const fileChanged = result.changes.length > 0 || result.separatorFixes.length > 0;
    if (fileChanged) {
      changedFiles += 1;
      for (const fix of result.separatorFixes) normalizedSeparators += fix.count;
    }
    if (result.changes.length > 0) {
      movedFiles += 1;
      moved += result.changes.length;
      for (const change of result.changes) {
        byPunctuation.set(change.punctuation, (byPunctuation.get(change.punctuation) || 0) + 1);
      }
    }
    if (opts.apply && fileChanged) {
      fs.writeFileSync(file, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
    }
    if (opts.apply && result.changes.length > 0) {
      queueMarked += applyQueueStatus(queue, lookup, result.changes, now, opts.reviewer);
    }

    skippedCount += result.skipped.length;
    for (const skipped of result.skipped.slice(0, 5)) {
      if (skippedSamples.length < 20) skippedSamples.push(skipped);
    }
  }

  if (opts.apply && queue) {
    queue.generatedAt = queue.generatedAt || now;
    queue.updatedAt = now;
    fs.writeFileSync(opts.queue, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  console.log(`${opts.apply ? 'Moved' : 'Would move'} ${moved} leading punctuation fragment(s) in ${movedFiles}/${files.length} chapter file(s).`);
  console.log(`${opts.apply ? 'Normalized' : 'Would normalize'} ${normalizedSeparators} terminal separator artifact(s).`);
  if (changedFiles > movedFiles) console.log(`${opts.apply ? 'Changed' : 'Would change'} ${changedFiles} chapter file(s) total.`);
  if (opts.apply && queue) console.log(`Marked ${queueMarked} queue item(s) as applied in ${opts.queue}.`);
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} fragment(s).`);
    for (const skipped of skippedSamples) {
      console.log(`  ${skipped.file}:${skipped.unit.id || skipped.unit.path}: ${skipped.reason} (${JSON.stringify(skipped.punctuation)})`);
    }
  }
  for (const [punctuation, count] of [...byPunctuation.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 20)) {
    console.log(`${JSON.stringify(punctuation)}\t${count}`);
  }
}

main();
