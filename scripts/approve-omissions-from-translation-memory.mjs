#!/usr/bin/env node
/**
 * Approve source omissions only when existing corpus translations cover every
 * inserted sentence exactly.
 *
 * This does not generate English. It copies non-conflicting translations from
 * already translated source units into source-correspondence manualTranslations,
 * then marks those queue items approved so apply-source-correspondence can make
 * the actual source edit with its normal translation guardrails.
 */

import fs from 'node:fs';
import path from 'node:path';
import { variantText } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/u;
const CJK_RE = /[\p{Script=Han}]/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;
const DEFAULT_REVIEWER = 'approve-omissions-from-translation-memory';

function usage() {
  console.error(`Usage:
  node scripts/approve-omissions-from-translation-memory.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, writes approval metadata and exact copied
manualTranslations to matching source-correspondence queue items.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
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
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
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

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function strictKey(text) {
  const key = normalizePunctuation(String(text || '').replace(/\s+/gu, '').trim()).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
  let out = '';
  for (const char of key) out += variantText(char);
  return out;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
}

function hasMeaningfulTranslations(unit) {
  if (!unit || typeof unit !== 'object') return false;
  if (typeof unit.translation === 'string' && unit.translation.trim()) return true;
  if (typeof unit.literal === 'string' && unit.literal.trim()) return true;
  if (typeof unit.idiomatic === 'string' && unit.idiomatic.trim()) return true;
  return Array.isArray(unit.translations) && unit.translations.some((translation) =>
    Object.entries(translation || {}).some(([key, value]) => (
      key !== 'lang'
      && typeof value === 'string'
      && value.trim()
    )),
  );
}

function primaryTranslation(unit) {
  const row = (unit.translations || []).find((translation) => (
    translation
    && typeof translation === 'object'
    && (String(translation.literal || '').trim() || String(translation.idiomatic || '').trim())
  )) || {};
  const literal = String(row.literal || unit.literal || unit.translation || '').trim();
  const idiomatic = String(row.idiomatic || unit.idiomatic || unit.translation || '').trim();
  return {
    literal,
    idiomatic,
    translator: String(row.translator || unit.translator || 'Garrett M. Petersen (2026)').trim(),
    model: String(row.model || unit.model || 'Translation memory').trim(),
    footnote: typeof row.footnote === 'string' ? row.footnote.trim() : '',
    allowChineseCharacters: row.allowChineseCharacters === true || unit.allowChineseCharacters === true,
  };
}

function translationSignature(translation) {
  return JSON.stringify({
    literal: translation.literal,
    idiomatic: translation.idiomatic,
    footnote: translation.footnote || '',
    allowChineseCharacters: translation.allowChineseCharacters === true,
  });
}

function walkUnits(chapter, visitor) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) visitor(unit);
    }
  }
}

function buildMemory() {
  const memory = new Map();
  const conflicts = new Set();

  for (const book of fs.readdirSync(DATA_DIR).sort()) {
    const bookDir = path.join(DATA_DIR, book);
    if (!fs.statSync(bookDir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const entry of fs.readdirSync(bookDir).filter((file) => CHAPTER_RE.test(file)).sort()) {
      const chapterPath = path.join(bookDir, entry);
      const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      walkUnits(chapter, (unit) => {
        const zh = sourceText(unit);
        const key = strictKey(zh);
        if (!key || !CJK_RE.test(zh) || !hasMeaningfulTranslations(unit)) return;
        const translation = primaryTranslation(unit);
        if (!translation.literal || !translation.idiomatic) return;
        const source = `${book}/${entry.replace(/\.json$/u, '')}`;
        const value = {
          zh,
          translation,
          sources: new Set([source]),
        };
        const existing = memory.get(key);
        if (!existing) {
          memory.set(key, value);
          return;
        }
        if (translationSignature(existing.translation) !== translationSignature(translation)) {
          conflicts.add(key);
          return;
        }
        existing.sources.add(source);
      });
    }
  }

  for (const key of conflicts) memory.delete(key);
  return { memory, conflicts };
}

function splitSentences(text) {
  const sentences = [];
  const parts = String(text || '').split(SENTENCE_ENDINGS);
  let current = '';

  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 1) {
      const punctuation = parts[i];
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
      current += parts[i];
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
  return merged.filter((sentence) => CJK_RE.test(sentence));
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (
    item.appliedAt ||
    status === 'applied' ||
    status === 'denied' ||
    status === 'approved' ||
    status === 'rejected' ||
    decision === 'included' ||
    decision === 'applied' ||
    decision === 'denied' ||
    decision === 'approved' ||
    decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function inScope(item, opts) {
  if (statusOf(item) !== 'pending') return false;
  if (item.type !== 'source_omission_candidate') return false;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return false;
  if (String(item.localRange?.text || '').trim()) return false;
  if (!String(item.sourceRange?.text || '').trim()) return false;
  return true;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function approvalFor(item, memory) {
  const target = `${item.book}/${String(item.chapter || '').padStart(3, '0')}`;
  const sentences = splitSentences(item.sourceRange?.text || '');
  if (sentences.length === 0) return null;
  const hits = sentences.map((sentence) => ({
    sentence,
    hit: memory.get(strictKey(sentence)),
  }));
  if (hits.some((record) => !record.hit)) return null;
  if (hits.some((record) => ![...record.hit.sources].some((source) => source !== target))) return null;
  return {
    sentences,
    hits,
    manualTranslations: hits.map(({ sentence, hit }) => {
      const row = {
        zh: sentence,
        literal: hit.translation.literal,
        idiomatic: hit.translation.idiomatic,
        translator: hit.translation.translator,
        model: hit.translation.model,
      };
      if (hit.translation.footnote) row.footnote = hit.translation.footnote;
      if (hit.translation.allowChineseCharacters) row.allowChineseCharacters = true;
      return row;
    }),
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { memory, conflicts } = buildMemory();
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    approved: 0,
    touchedQueueFiles: 0,
    memoryEntries: memory.size,
    conflictedMemoryKeys: conflicts.size,
    byBook: {},
    byQueue: {},
    samples: [],
  };

  for (const queuePath of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changed = false;
    let queueCount = 0;
    for (const item of queue.items || []) {
      if (summary.approved >= opts.limit) break;
      if (!inScope(item, opts)) continue;
      const approval = approvalFor(item, memory);
      if (!approval) continue;

      summary.approved += 1;
      queueCount += 1;
      summary.byBook[item.book || 'unknown'] = (summary.byBook[item.book || 'unknown'] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          sentenceCount: approval.sentences.length,
          sources: [...new Set(approval.hits.flatMap(({ hit }) => [...hit.sources]))],
          text: String(item.sourceRange?.text || '').slice(0, 180),
        });
      }

      if (!opts.apply) continue;
      item.status = 'approved';
      item.decision = 'approved';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.manualTranslations = approval.manualTranslations;
      item.notes = appendNote(
        item.notes,
        'Approved with exact non-conflicting translation-memory coverage from existing corpus translations; no generated English was used.',
      );
      changed = true;
    }

    if (queueCount > 0) summary.byQueue[path.relative(process.cwd(), queuePath)] = queueCount;
    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
