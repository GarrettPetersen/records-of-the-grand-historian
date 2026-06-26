#!/usr/bin/env node
/**
 * Close no-op source-correspondence items where the external witness has a
 * placeholder/codepoint hole but the local corpus has the corresponding text.
 *
 * This never edits chapter source or translations. It only rejects the
 * upstream witness delta when the source skeleton matches the local unit after
 * treating each witness placeholder as one local Han/digit character.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-source-placeholder-noops';
const NOTE = 'Reviewed as no-op: upstream witness uses placeholder/codepoint glyphs where the local corpus already preserves the corresponding source text; local corpus retained.';

const PLACEHOLDER_RE = /\[[0-9A-Fa-f]{4,6}\]|[□�\uE000-\uF8FF]|<[^>]{1,8}>|\{[^}]{1,8}\}|[⿰⿱⿲⿳][\p{Script=Han}A-Za-z0-9]{2,8}/u;
const PLACEHOLDER_TOKEN_RE = /^\[[0-9A-Fa-f]{4,6}\]|^[□�\uE000-\uF8FF]|^<[^>]{1,8}>|^\{[^}]{1,8}\}|^[⿰⿱⿲⿳][\p{Script=Han}A-Za-z0-9]{2,8}/u;
const WILDCARD = '*';

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
      console.error(`Usage: node scripts/resolve-source-placeholder-noops.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
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

function keyChars(text) {
  return [...variantText(String(text || '').normalize('NFKC'))]
    .filter((char) => /[\p{Script=Han}0-9]/u.test(char));
}

function sourceTokens(text) {
  const tokens = [];
  const value = String(text || '').normalize('NFKC');
  for (let i = 0; i < value.length;) {
    const rest = value.slice(i);
    const placeholder = rest.match(PLACEHOLDER_TOKEN_RE);
    if (placeholder) {
      tokens.push(WILDCARD);
      i += placeholder[0].length;
      continue;
    }
    const char = [...rest][0];
    const normalized = variantText(char);
    for (const outChar of normalized) {
      if (/[\p{Script=Han}0-9]/u.test(outChar)) tokens.push(outChar);
    }
    i += char.length;
  }
  return tokens;
}

function wildcardMatches(source, local) {
  const tokens = sourceTokens(source);
  const localChars = keyChars(local);
  if (tokens.length === 0 || localChars.length === 0) return false;
  const wildcardCount = tokens.filter((token) => token === WILDCARD).length;
  if (wildcardCount === 0 || wildcardCount > 12) return false;
  if (tokens.length !== localChars.length) return false;

  for (let i = 0; i < tokens.length; i += 1) {
    if (tokens[i] === WILDCARD) continue;
    if (tokens[i] !== localChars[i]) return false;
  }
  return true;
}

function candidate(item) {
  if (statusOf(item) !== 'pending') return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (!PLACEHOLDER_RE.test(source)) return false;
  if (PLACEHOLDER_RE.test(local)) return false;
  return wildcardMatches(source, local);
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
      if (!candidate(item)) continue;

      stats.total += 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${item.chapter}`;
      stats.byChapter[chapterKey] = (stats.byChapter[chapterKey] || 0) + 1;
      if (stats.samples.length < opts.sampleLimit) {
        stats.samples.push({
          id: item.id,
          chapter: chapterKey,
          type: item.type,
          source: short(item.sourceRange?.text || ''),
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
