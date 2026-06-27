#!/usr/bin/env node
/**
 * Import completed manual translation packets into a source repair queue item.
 *
 * This script does not translate. It validates worksheet rows created by
 * export-source-repair-translation-packet and copies the completed manual
 * translations into the queue item so apply-source-correspondence can perform
 * its gated source edit.
 */

import fs from 'node:fs';
import path from 'node:path';

const HAN_RE = /\p{Script=Han}/u;
const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;

function usage() {
  console.error(`Usage:
  node scripts/import-source-repair-translations.mjs --queue PATH --item ID
    [--packet PATH ...] [--packet-dir DIR]
    [--accepted-source-from-packets] [--approve] [--dry-run]

Use --accepted-source-from-packets when worksheet zh rows intentionally correct
upstream source typos and should become the accepted source text.`);
}

function parseArgs(argv) {
  const opts = {
    queue: '',
    itemId: '',
    packets: [],
    packetDirs: [],
    acceptedSourceFromPackets: false,
    approve: false,
    dryRun: false,
    reviewer: 'source-correspondence',
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
      opts.itemId = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--item=')) {
      opts.itemId = arg.slice('--item='.length);
      continue;
    }
    if (arg === '--packet') {
      opts.packets.push(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--packet=')) {
      opts.packets.push(arg.slice('--packet='.length));
      continue;
    }
    if (arg === '--packet-dir') {
      opts.packetDirs.push(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--packet-dir=')) {
      opts.packetDirs.push(arg.slice('--packet-dir='.length));
      continue;
    }
    if (arg === '--accepted-source-from-packets') {
      opts.acceptedSourceFromPackets = true;
      continue;
    }
    if (arg === '--approve') {
      opts.approve = true;
      continue;
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || opts.reviewer;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || opts.reviewer;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!opts.queue) throw new Error('Missing --queue PATH.');
  if (!opts.itemId) throw new Error('Missing --item ID.');
  if (opts.packets.length === 0 && opts.packetDirs.length === 0) {
    throw new Error('Provide at least one --packet or --packet-dir.');
  }
  return opts;
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

function packetFiles(opts) {
  const files = new Set(opts.packets.filter(Boolean));
  for (const dir of opts.packetDirs.filter(Boolean)) {
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.json')) files.add(path.join(dir, name));
    }
  }
  return [...files].sort();
}

function readRows(files, itemId) {
  const rows = [];
  const packetPaths = [];
  let expectedCount = 0;

  for (const filename of files) {
    const packet = JSON.parse(fs.readFileSync(filename, 'utf8'));
    for (const packetItem of packet.items || []) {
      if (packetItem.id !== itemId) continue;
      packetPaths.push(filename);
      expectedCount = Math.max(expectedCount, Number(packetItem.sourceRange?.splitCount || 0));
      for (const row of packetItem.translations || []) {
        rows.push({ ...row, packet: filename });
      }
    }
  }

  if (rows.length === 0) throw new Error(`No worksheet rows found for ${itemId}.`);
  return { rows, packetPaths: [...new Set(packetPaths)].sort(), expectedCount };
}

function validateRows(rows, expectedCount) {
  const byIndex = new Map();
  const errors = [];

  for (const row of rows) {
    const index = Number(row.index);
    if (!Number.isInteger(index) || index < 0) {
      errors.push(`${row.packet}: invalid index ${row.index}`);
      continue;
    }
    if (byIndex.has(index)) errors.push(`Duplicate worksheet index ${index}.`);
    byIndex.set(index, row);
  }

  if (expectedCount > 0) {
    for (let index = 0; index < expectedCount; index += 1) {
      if (!byIndex.has(index)) errors.push(`Missing worksheet index ${index}.`);
    }
  }

  for (const [index, row] of [...byIndex.entries()].sort((a, b) => a[0] - b[0])) {
    for (const field of ['zh', 'literal', 'idiomatic']) {
      if (!String(row[field] || '').trim()) errors.push(`Index ${index} missing ${field}.`);
    }
    const english = `${row.literal || ''}\n${row.idiomatic || ''}`;
    if (row.allowChineseCharacters !== true && hasHan(english)) {
      errors.push(`Index ${index} has Han characters in English fields.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.slice(0, 20).join('\n'));
  }

  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, row]) => row);
}

function sourceCorrections(item, rows) {
  const sourceUnits = splitSentences(item.sourceRange?.text || '');
  const corrections = [];
  for (const row of rows) {
    const original = sourceUnits[row.index];
    if (original && original !== row.zh) {
      corrections.push({
        index: row.index,
        from: original,
        to: row.zh,
      });
    }
  }
  return corrections;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  const item = (queue.items || []).find((entry) => entry.id === opts.itemId);
  if (!item) throw new Error(`Queue item not found: ${opts.itemId}`);

  const { rows, packetPaths, expectedCount } = readRows(packetFiles(opts), opts.itemId);
  const orderedRows = validateRows(rows, expectedCount);
  const corrections = sourceCorrections(item, orderedRows);

  item.manualTranslations = orderedRows.map((row) => {
    const next = {
      zh: String(row.zh).trim(),
      literal: String(row.literal).trim(),
      idiomatic: String(row.idiomatic).trim(),
      translator: String(row.translator || 'Garrett M. Petersen (2026)').trim(),
      model: String(row.model || 'Manual source repair').trim(),
    };
    if (row.footnote) next.footnote = String(row.footnote).trim();
    if (row.allowChineseCharacters === true) next.allowChineseCharacters = true;
    return next;
  });

  if (opts.acceptedSourceFromPackets) {
    item.acceptedSourceText = orderedRows.map((row) => row.zh).join('');
    const acceptedUnits = splitSentences(item.acceptedSourceText);
    if (acceptedUnits.length !== orderedRows.length) {
      throw new Error(`Accepted source split count ${acceptedUnits.length} does not match worksheet rows ${orderedRows.length}.`);
    }
  }

  if (corrections.length > 0) {
    item.acceptedSourceCorrections = corrections;
  } else {
    delete item.acceptedSourceCorrections;
  }

  item.manualTranslationImportedAt = new Date().toISOString();
  item.manualTranslationPackets = packetPaths.map((filename) => path.relative(process.cwd(), filename));

  if (opts.approve) {
    item.status = 'approved';
    item.decision = 'approved';
    item.reviewedAt = new Date().toISOString();
    item.reviewer = opts.reviewer;
  }

  const summary = {
    item: opts.itemId,
    packets: packetPaths.length,
    rows: orderedRows.length,
    expectedCount,
    corrections: corrections.length,
    acceptedSourceFromPackets: opts.acceptedSourceFromPackets,
    approved: opts.approve,
    dryRun: opts.dryRun,
  };

  if (!opts.dryRun) {
    fs.writeFileSync(opts.queue, `${JSON.stringify(queue, null, 2)}\n`);
  }
  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
