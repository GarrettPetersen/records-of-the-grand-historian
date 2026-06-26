#!/usr/bin/env node
/**
 * Approve source omissions when the omitted span is duplicated elsewhere in
 * the corpus as complete translated units.
 *
 * This does not generate English. It copies existing non-empty translations
 * from a unique complete-unit witness into manualTranslations, then optionally
 * applies those approved source-correspondence items.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { variantText } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const PREFIX_LENGTH = 12;
const DEFAULT_REVIEWER = 'approve-omissions-from-duplicate-passages';
const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/;
const CJK_RE = /[\p{Script=Han}]/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;

function usage() {
  console.error(`Usage:
  node scripts/approve-omissions-from-duplicate-passages.mjs [--apply]
    [--apply-source] [--source-dry-run] [--book BOOK] [--chapter CHAPTER]
    [--queue PATH] [--limit N] [--reviewer NAME]

Dry-run by default. With --apply, writes approval metadata and copied
manualTranslations. With --apply-source, also invokes apply-source-correspondence
for the approved item IDs.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    applySource: false,
    sourceDryRun: false,
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
    if (arg === '--apply-source') {
      opts.applySource = true;
      continue;
    }
    if (arg === '--source-dry-run') {
      opts.sourceDryRun = true;
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
  if (opts.applySource && !opts.apply && !opts.sourceDryRun) {
    throw new Error('--apply-source requires --apply, unless paired with --source-dry-run for validation.');
  }
  return opts;
}

function queueFiles(opts) {
  const files = opts.queues.length > 0
    ? opts.queues.map((queue) => path.resolve(queue))
    : fs.readdirSync(QUALITY_DIR)
      .filter((entry) => QUEUE_RE.test(entry))
      .map((entry) => path.join(QUALITY_DIR, entry))
      .filter((file) => {
        if (opts.books.size === 0) return true;
        const base = path.basename(file);
        return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
      })
      .sort();
  return files;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
}

function strictKey(text) {
  return String(text || '')
    .replace(/\s+/gu, '')
    .normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function hasHan(text) {
  return CJK_RE.test(String(text || ''));
}

function splitSentences(text) {
  const sentences = [];
  const parts = String(text || '').split(SENTENCE_ENDINGS);

  let current = '';
  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 1) {
      const punctuation = parts[i];
      const isOpeningPunc = /[〈(（]/.test(punctuation);

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
  const openingOnly = /^[〈《「『【〔（(\s]+$/;
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

function variantKey(text) {
  let out = '';
  for (const char of strictKey(text)) out += variantText(char);
  return out;
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (
    item.appliedAt
    || status === 'applied'
    || status === 'denied'
    || status === 'approved'
    || status === 'rejected'
    || decision === 'included'
    || decision === 'applied'
    || decision === 'denied'
    || decision === 'approved'
    || decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function hasTranslation(unit) {
  if (Array.isArray(unit?.translations)) {
    return unit.translations.some((translation) => (
      String(translation?.literal || '').trim()
      && String(translation?.idiomatic || '').trim()
    ));
  }
  return String(unit?.literal || '').trim() && String(unit?.idiomatic || unit?.translation || '').trim();
}

function primaryTranslation(unit) {
  const row = (unit.translations || []).find((translation) => (
    String(translation?.literal || '').trim()
    && String(translation?.idiomatic || '').trim()
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

function walkUnits(chapter, visitor) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) visitor(unit, field);
      }
    }
  }
}

function buildQueries(opts) {
  const records = [];
  for (const queuePath of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (item.type !== 'source_omission_candidate') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) continue;
      if (String(item.localRange?.text || '').trim()) continue;
      const source = String(item.sourceRange?.text || '');
      const key = strictKey(source);
      if (key.length < PREFIX_LENGTH) continue;
      records.push({
        queuePath,
        item,
        source,
        key,
        variantKey: variantKey(source),
        target: `${item.book}/${String(item.chapter || '').padStart(3, '0')}`,
      });
    }
  }
  return records;
}

function addIndex(index, key, value) {
  const bucket = index.get(key);
  if (bucket) bucket.push(value);
  else index.set(key, [value]);
}

function buildCorpusIndexes(queries) {
  const strictPrefixes = new Set(queries.map((query) => query.key.slice(0, PREFIX_LENGTH)));
  const variantPrefixes = new Set(queries.map((query) => query.variantKey.slice(0, PREFIX_LENGTH)));
  const strictIndex = new Map();
  const variantIndex = new Map();
  const chapters = [];

  for (const book of fs.readdirSync(DATA_DIR).sort()) {
    const bookDir = path.join(DATA_DIR, book);
    if (!fs.statSync(bookDir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const filename of fs.readdirSync(bookDir).filter((entry) => CHAPTER_RE.test(entry)).sort()) {
      const file = path.join(bookDir, filename);
      const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
      const units = [];
      const starts = new Map();
      const ends = new Map();
      let strict = '';
      let variant = '';

      walkUnits(chapter, (unit) => {
        const text = sourceText(unit);
        const key = strictKey(text);
        if (!key) return;
        const vKey = variantKey(text);
        starts.set(strict.length, units.length);
        strict += key;
        variant += vKey;
        ends.set(strict.length, units.length);
        units.push({ unit, text, key, variantKey: vKey, hasTranslation: hasTranslation(unit) });
      });

      const chapterIndex = chapters.length;
      chapters.push({
        book,
        chapter: filename.replace(/\.json$/u, ''),
        file,
        units,
        starts,
        ends,
        strict,
        variant,
      });

      for (let index = 0; index + PREFIX_LENGTH <= strict.length; index += 1) {
        const prefix = strict.slice(index, index + PREFIX_LENGTH);
        if (strictPrefixes.has(prefix)) addIndex(strictIndex, prefix, [chapterIndex, index]);
        const vPrefix = variant.slice(index, index + PREFIX_LENGTH);
        if (variantPrefixes.has(vPrefix)) addIndex(variantIndex, vPrefix, [chapterIndex, index]);
      }
    }
  }

  return { chapters, strictIndex, variantIndex };
}

function boundaryUnits(chapter, start, end) {
  const first = chapter.starts.get(start);
  const lastInclusive = chapter.ends.get(end);
  if (first == null || lastInclusive == null || lastInclusive < first) return null;
  return chapter.units.slice(first, lastInclusive + 1);
}

function findWitness(query, corpus) {
  const search = (index, key, mode) => {
    const hits = [];
    let tooMany = false;
    for (const [chapterIndex, position] of index.get(key.slice(0, PREFIX_LENGTH)) || []) {
      const chapter = corpus.chapters[chapterIndex];
      if (`${chapter.book}/${chapter.chapter}` === query.target) continue;
      const haystack = mode === 'strict' ? chapter.strict : chapter.variant;
      if (haystack.slice(position, position + key.length) !== key) continue;
      const units = boundaryUnits(chapter, position, position + key.length);
      if (!units || units.length === 0 || units.some((unit) => !unit.hasTranslation)) continue;
      hits.push({ chapter, units, mode });
      if (hits.length > 25) {
        tooMany = true;
        break;
      }
    }
    return tooMany ? null : hits;
  };

  const strictHits = search(corpus.strictIndex, query.key, 'strict');
  const strictWitness = chooseTranslationStableWitness(strictHits, query);
  if (strictWitness) return strictWitness;
  if (strictHits === null || strictHits.length > 0) return null;

  const variantHits = search(corpus.variantIndex, query.variantKey, 'variant');
  return chooseTranslationStableWitness(variantHits, query);
}

function translationSignature(rows) {
  return JSON.stringify(rows.map((row) => ({
    zhKey: strictKey(row.zh),
    literal: row.literal,
    idiomatic: row.idiomatic,
    footnote: row.footnote || '',
    allowChineseCharacters: row.allowChineseCharacters === true,
  })));
}

function chooseTranslationStableWitness(hits, query) {
  if (!Array.isArray(hits) || hits.length === 0) return null;
  if (hits.length === 1) return hits[0];

  let signature = null;
  for (const hit of hits) {
    const rows = manualTranslationsFromWitness(hit, query);
    if (!rows) return null;
    const nextSignature = translationSignature(rows);
    if (signature == null) {
      signature = nextSignature;
      continue;
    }
    if (signature !== nextSignature) return null;
  }
  return {
    ...hits[0],
    duplicateWitnesses: hits.length,
  };
}

function manualTranslationsFromWitness(witness, query) {
  const targetSentences = splitSentences(query.source);
  if (targetSentences.length !== witness.units.length) return null;
  return witness.units.map(({ unit }, index) => {
    const translation = primaryTranslation(unit);
    const row = {
      zh: targetSentences[index],
      literal: translation.literal,
      idiomatic: translation.idiomatic,
      translator: translation.translator,
      model: translation.model,
    };
    if (translation.footnote) row.footnote = translation.footnote;
    if (translation.allowChineseCharacters) row.allowChineseCharacters = true;
    return row;
  });
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function runApplySource(queuePath, ids, opts, queueOverride = null) {
  let effectiveQueuePath = queuePath;
  let tempQueuePath = null;
  if (opts.sourceDryRun && queueOverride) {
    tempQueuePath = path.join(
      '/tmp',
      `duplicate-passage-queue-${process.pid}-${path.basename(queuePath)}`,
    );
    fs.writeFileSync(tempQueuePath, `${JSON.stringify(queueOverride, null, 2)}\n`, 'utf8');
    effectiveQueuePath = tempQueuePath;
  }

  const args = [
    'scripts/apply-source-correspondence.mjs',
    '--queue',
    effectiveQueuePath,
    '--approve',
    ids.join(','),
    '--item',
    ids.join(','),
    '--reviewer',
    opts.reviewer,
  ];
  if (opts.sourceDryRun) args.push('--dry-run');
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (tempQueuePath) fs.rmSync(tempQueuePath, { force: true });
  if (result.status !== 0) {
    throw new Error(`apply-source-correspondence failed for ${queuePath}\n${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queries = buildQueries(opts);
  const corpus = buildCorpusIndexes(queries);
  const now = new Date().toISOString();
  const approvedByQueue = new Map();
  const queueCache = new Map();
  const summary = {
    apply: opts.apply,
    applySource: opts.applySource,
    sourceDryRun: opts.sourceDryRun,
    queries: queries.length,
    approved: 0,
    touchedQueueFiles: 0,
    byBook: {},
    byQueue: {},
    samples: [],
    applyReports: [],
  };

  for (const query of queries) {
    if (summary.approved >= opts.limit) break;
    const witness = findWitness(query, corpus);
    if (!witness) continue;
    const manualTranslations = manualTranslationsFromWitness(witness, query);
    if (!manualTranslations) continue;

    summary.approved += 1;
    summary.byBook[query.item.book] = (summary.byBook[query.item.book] || 0) + 1;
    summary.byQueue[path.relative(process.cwd(), query.queuePath)] = (summary.byQueue[path.relative(process.cwd(), query.queuePath)] || 0) + 1;
    if (summary.samples.length < 30) {
      summary.samples.push({
        id: query.item.id,
        chapter: query.target,
        witness: `${witness.chapter.book}/${witness.chapter.chapter}`,
        witnessFile: path.relative(process.cwd(), witness.chapter.file),
        mode: witness.mode,
        unitCount: witness.units.length,
        source: query.source.slice(0, 180),
      });
    }

    if (!opts.apply && !opts.sourceDryRun) continue;

    if (!queueCache.has(query.queuePath)) {
      queueCache.set(query.queuePath, JSON.parse(fs.readFileSync(query.queuePath, 'utf8')));
    }
    const queue = queueCache.get(query.queuePath);
    const item = (queue.items || []).find((candidate) => candidate.id === query.item.id);
    if (!item) continue;
    item.status = 'approved';
    item.decision = 'approved';
    item.reviewedAt = item.reviewedAt || now;
    item.reviewer = item.reviewer || opts.reviewer;
    item.manualTranslations = manualTranslations;
    item.notes = appendNote(
      item.notes,
      `Approved with complete duplicate-passage coverage from ${witness.chapter.book}/${witness.chapter.chapter}; copied existing human translations, no generated English used.`,
    );
    const ids = approvedByQueue.get(query.queuePath) || [];
    ids.push(query.item.id);
    approvedByQueue.set(query.queuePath, ids);
  }

  if (opts.apply) {
    for (const [queuePath, queue] of queueCache.entries()) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  if (opts.applySource || opts.sourceDryRun) {
    for (const [queuePath, ids] of approvedByQueue.entries()) {
      const report = runApplySource(queuePath, ids, opts, queueCache.get(queuePath));
      summary.applyReports.push({
        queue: path.relative(process.cwd(), queuePath),
        ids: ids.length,
        appliedItems: report.queues?.[0]?.appliedItems || 0,
        dryRun: opts.sourceDryRun,
      });
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
