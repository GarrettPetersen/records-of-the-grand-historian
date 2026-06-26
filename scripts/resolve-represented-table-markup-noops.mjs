#!/usr/bin/env node
/**
 * Close source-correspondence items where a raw Wikisource table span is
 * already represented in the current local chapter as split table/cell text.
 *
 * This is intentionally strict: every nontrivial source table fragment must
 * already appear in the full chapter text after variant and numeral
 * normalization. No chapter source or translation is edited.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-represented-table-markup-noops';
const NOTE = 'Reviewed as no-op: raw Wikisource table markup overgrouped text that is already represented in the local chapter table/cell structure; local corpus retained.';

const TABLE_MARKUP_RE = /\{\||\|\}|\|-|\|\+|\|\||!!|\b(?:class|style|ALIGN|VALIGN|align|valign|colspan|rowspan|WIDTH|width|HEIGHT|height|border|cellspacing|cellpadding|bgcolor|scope)\s*=/iu;
const ATTR_RE = /\b(?:class|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s]+)|\b(?:ALIGN|VALIGN|align|valign|colspan|rowspan|WIDTH|width|HEIGHT|height|border|cellspacing|cellpadding|bgcolor|scope)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s]+)/giu;
const IGNORE_KEYS = new Set([
  '表',
  '第一',
  '第二',
  '第三',
  '第四',
  '第五',
  '第六',
  '上',
  '中',
  '下',
  '西元',
  '公元',
  '號謚',
  '號諡',
  '姓名',
  '屬',
  '始封',
  '子',
  '孫',
  '曾孫',
  '玄孫',
  '六世',
  '七世',
  '功狀戶數',
  '官秩',
  '紀年',
]);

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Number.POSITIVE_INFINITY,
    sampleLimit: 30,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-represented-table-markup-noops.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length));
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
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 30;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      const base = path.basename(file);
      return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
    })
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'done';
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'done';
  return 'pending';
}

function inScope(item, opts) {
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return false;
  return true;
}

function normalizeTableNumerals(text) {
  return String(text || '')
    .replace(/二十/gu, '廿')
    .replace(/三十/gu, '卅')
    .replace(/四十/gu, '卌');
}

function key(text) {
  return variantText(normalizeTableNumerals(String(text || '').normalize('NFKC')))
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function cleanTableMarkup(text) {
  return String(text || '')
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(ATTR_RE, '')
    .replace(/\{\||\|\}|\|-|\|\+/gu, '\n')
    .replace(/==[^=]{0,30}==/gu, '\n');
}

function sourceFragments(text) {
  return cleanTableMarkup(text)
    .split(/\|\||!!|\n|\|/u)
    .map((part) => part.replace(/^[!|+\-\s]+|[!|\s]+$/gu, ''))
    .map((textPart) => ({ text: textPart, key: key(textPart) }))
    .filter((part) => part.key.length >= 2 && !IGNORE_KEYS.has(part.key));
}

function sourceKey(unit) {
  return ['zh', 'source', 'content', 'text'].find((field) => typeof unit?.[field] === 'string') || null;
}

function collectChapterText(file) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const parts = [];
  for (const block of chapter.content || []) {
    for (const unit of block.sentences || []) {
      const field = sourceKey(unit);
      if (field) parts.push(unit[field]);
    }
    for (const unit of block.cells || []) {
      const field = sourceKey(unit);
      if (field) parts.push(unit[field]);
    }
  }
  return parts.join('');
}

const chapterKeyCache = new Map();

function chapterKey(file) {
  const absolute = path.resolve(file);
  if (!chapterKeyCache.has(absolute)) chapterKeyCache.set(absolute, key(collectChapterText(absolute)));
  return chapterKeyCache.get(absolute);
}

function candidate(item) {
  if (statusOf(item) !== 'pending') return null;
  const source = item.sourceRange?.text || '';
  if (!source || !TABLE_MARKUP_RE.test(source)) return null;
  const file = item.file || path.join('data', item.book || '', `${item.chapter || ''}.json`);
  if (!fs.existsSync(file)) return null;

  const fragments = sourceFragments(source);
  if (fragments.length < 2) return null;
  if (!fragments.some((fragment) => fragment.key.length >= 4)) return null;

  const full = chapterKey(file);
  const missing = fragments.filter((fragment) => !full.includes(fragment.key));
  if (missing.length > 0) return null;
  return { fragments };
}

function appendNote(existing, addition) {
  const current = String(existing || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function short(text) {
  const value = normalizeWhitespace(text || '');
  return value.length > 180 ? `${value.slice(0, 179)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    apply: opts.apply,
    total: 0,
    touchedQueueFiles: 0,
    byBook: {},
    byChapter: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (stats.total >= opts.limit) break;
      if (!inScope(item, opts)) continue;
      const match = candidate(item);
      if (!match) continue;

      stats.total += 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapter = `${item.book}/${item.chapter}`;
      stats.byChapter[chapter] = (stats.byChapter[chapter] || 0) + 1;
      if (stats.samples.length < opts.sampleLimit) {
        stats.samples.push({
          id: item.id,
          chapter,
          type: item.type,
          fragmentCount: match.fragments.length,
          source: short(item.sourceRange?.text || ''),
          fragmentSample: match.fragments.slice(0, 8).map((fragment) => short(fragment.text, 80)),
          local: short(item.localRange?.text || ''),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = item.reviewedAt || now;
        item.reviewer = item.reviewer || opts.reviewer;
        item.notes = appendNote(item.notes, NOTE);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      stats.touchedQueueFiles += 1;
    }
    if (stats.total >= opts.limit) break;
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
