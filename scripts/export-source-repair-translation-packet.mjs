#!/usr/bin/env node
/**
 * Export source-correspondence spans into fillable manual-translation packets.
 *
 * This helper does not translate. It mirrors the source-unit splitting used by
 * apply-source-correspondence so large approved spans can be translated in
 * reviewable batches before the gated source apply step.
 */

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_OUT_DIR = path.join(process.cwd(), 'data', 'quality', 'repair-packets', 'manual-translations');
const DEFAULT_TRANSLATOR = 'Garrett M. Petersen (2026)';
const DEFAULT_MODEL = 'Manual source repair';

const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;
const HAN_RE = /\p{Script=Han}/u;

function usage() {
  console.error(`Usage:
  node scripts/export-source-repair-translation-packet.mjs --queue PATH --item ID
    [--out PATH] [--out-dir DIR] [--start N] [--limit N]

The output is gitignored under data/quality/repair-packets/ by default.`);
}

function parseArgs(argv) {
  const opts = {
    queue: '',
    itemIds: new Set(),
    out: '',
    outDir: DEFAULT_OUT_DIR,
    start: 0,
    limit: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--queue') {
      opts.queue = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length);
      continue;
    }
    if (arg === '--item') {
      addIds(opts.itemIds, argv[++i]);
      continue;
    }
    if (arg.startsWith('--item=')) {
      addIds(opts.itemIds, arg.slice('--item='.length));
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--out-dir') {
      opts.outDir = argv[++i] || DEFAULT_OUT_DIR;
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      opts.outDir = arg.slice('--out-dir='.length);
      continue;
    }
    if (arg === '--start') {
      opts.start = Number(argv[++i] || 0);
      continue;
    }
    if (arg.startsWith('--start=')) {
      opts.start = Number(arg.slice('--start='.length) || 0);
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || 0);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || 0);
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!opts.queue) throw new Error('Missing --queue PATH.');
  if (opts.itemIds.size === 0) throw new Error('Missing --item ID.');
  if (!Number.isFinite(opts.start) || opts.start < 0) throw new Error('--start must be a non-negative number.');
  if (!Number.isFinite(opts.limit) || opts.limit < 0) throw new Error('--limit must be a non-negative number.');
  return opts;
}

function addIds(target, value) {
  for (const id of String(value || '').split(',').map((part) => part.trim()).filter(Boolean)) {
    target.add(id);
  }
}

function hasHan(text) {
  return HAN_RE.test(String(text || ''));
}

function splitSentences(text) {
  const sentences = [];
  let current = '';
  const parts = String(text || '').replace(/category:[^\n]+$/u, '').trim().split(SENTENCE_ENDINGS);

  for (let index = 0; index < parts.length; index += 1) {
    if (index % 2 === 1) {
      const punctuation = parts[index];
      const isOpeningPunc = /[〈(（]/u.test(punctuation);

      if (isOpeningPunc) {
        if (current.trim()) sentences.push(current.trim());
        current = punctuation;
      } else {
        current += punctuation;
        if (current.trim()) {
          sentences.push(current.trim());
          current = '';
        }
      }
    } else {
      current += parts[index];
    }
  }
  if (current.trim()) sentences.push(current.trim());

  const merged = [];
  let pendingPrefix = '';
  const openingOnly = /^[〈《「『【〔（(\s]+$/u;
  const leadingClose = /^([〉》」』】〕）)\]\s]+)(.+)$/u;

  for (let sentence of sentences) {
    const leadingCloseMatch = sentence.match(leadingClose);
    if (leadingCloseMatch && merged.length > 0) {
      merged[merged.length - 1] += leadingCloseMatch[1].trimEnd();
      sentence = leadingCloseMatch[2].trim();
      if (!sentence) continue;
    }

    if (openingOnly.test(sentence)) {
      pendingPrefix += sentence;
      continue;
    }

    if (PUNCTUATION_ONLY_RE.test(sentence)) {
      if (merged.length > 0) merged[merged.length - 1] += sentence;
      else pendingPrefix += sentence;
      continue;
    }

    if (pendingPrefix) {
      merged.push(pendingPrefix + sentence);
      pendingPrefix = '';
    } else {
      merged.push(sentence);
    }
  }

  if (pendingPrefix) {
    if (merged.length > 0) merged[merged.length - 1] += pendingPrefix;
    else merged.push(pendingPrefix);
  }

  return merged.filter((sentence) => hasHan(sentence));
}

function defaultOutPath(opts, items) {
  if (opts.out) return opts.out;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/u, 'Z');
  const label = items.map((entry) => `${entry.item.book}-${entry.item.chapter}-${entry.item.id.slice(-12)}`).join('_');
  return path.join(opts.outDir, `${stamp}-${label}.json`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  const selected = [];
  for (const [queueIndex, item] of (queue.items || []).entries()) {
    if (opts.itemIds.has(item.id)) selected.push({ queueIndex, item });
  }
  if (selected.length !== opts.itemIds.size) {
    const found = new Set(selected.map((entry) => entry.item.id));
    const missing = [...opts.itemIds].filter((id) => !found.has(id));
    throw new Error(`Queue item(s) not found: ${missing.join(', ')}`);
  }

  const items = [];
  for (const entry of selected) {
    const sourceText = entry.item.sourceRange?.text || '';
    const allUnits = splitSentences(sourceText);
    const units = opts.limit > 0
      ? allUnits.slice(opts.start, opts.start + opts.limit)
      : allUnits.slice(opts.start);
    items.push({
      queueFile: path.relative(process.cwd(), opts.queue),
      queueIndex: entry.queueIndex,
      id: entry.item.id,
      book: entry.item.book,
      chapter: entry.item.chapter,
      type: entry.item.type,
      sourceUrl: entry.item.sourceUrl,
      sourceRange: {
        startIndex: entry.item.sourceRange?.startIndex,
        endIndex: entry.item.sourceRange?.endIndex,
        scannerCount: entry.item.sourceRange?.count,
        splitCount: allUnits.length,
        exportedStart: opts.start,
        exportedCount: units.length,
      },
      translations: units.map((zh, offset) => ({
        index: opts.start + offset,
        zh,
        literal: '',
        idiomatic: '',
        translator: DEFAULT_TRANSLATOR,
        model: DEFAULT_MODEL,
      })),
    });
  }

  const packet = {
    generatedAt: new Date().toISOString(),
    note: 'Manual translation worksheet only. Copy completed translations into the source-correspondence queue item manualTranslations before applying.',
    items,
  };

  const outPath = defaultOutPath(opts, selected);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    out: path.relative(process.cwd(), outPath),
    items: items.map((item) => ({
      id: item.id,
      splitCount: item.sourceRange.splitCount,
      exportedStart: item.sourceRange.exportedStart,
      exportedCount: item.sourceRange.exportedCount,
    })),
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
