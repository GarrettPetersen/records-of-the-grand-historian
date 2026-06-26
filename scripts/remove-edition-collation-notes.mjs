#!/usr/bin/env node
/**
 * Remove standalone edition-collation notes that leaked into source text.
 *
 * These notes are scraper/editorial residue such as:
 *   全文以中華書局、一九七二年一月版《南齊書》爲本校。
 *
 * Dry-run by default. With --apply, removes standalone note units from chapter
 * JSON, removes an adjacent bare note marker when present, and marks matching
 * source-correspondence queue items complete when the note removal accounts for
 * the queued difference.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_REVIEWER = 'remove-edition-collation-notes';
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const NOTE_RE = /全文以中華書局[^。]{0,80}[為爲]本校。/u;
const NOTE_ONLY_RE = /^\s*全文以中華書局[^。]{0,80}[為爲]本校。\s*$/u;
const NOTE_MARKER_RE = /^\s*(?:注)?\[[一二三四五六七八九十百千萬万零〇0-9]+\]\s*$/u;
const LEADING_CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const SOURCE_APPARATUS_START_RE = /^(?:\*+\s*)?(?:(?:校勘記)?[一二三四五六七八九十百千萬万零〇0-9０-９]+頁[一二三四五六七八九十百千萬万零〇0-9０-９]+(?:行|頁)|校勘記)/u;
const SOURCE_APPARATUS_CUE_RE = /[一二三四五六七八九十百千萬万零〇0-9０-９]+頁[一二三四五六七八九十百千萬万零〇0-9０-９]+(?:行|頁)|按：|據[^。！？]{0,30}(?:本|補|改|刪)|校勘記|校補|集解引|王先謙|惠棟|刊誤|殿本|汲本|景祐本|紹興本|原訛|逕改正/u;

const VARIANTS = new Map([
  ['爲', '為'],
  ['为', '為'],
  ['竝', '並'],
  ['并', '並'],
  ['臥', '卧'],
  ['戯', '戲'],
  ['戱', '戲'],
  ['涌', '湧'],
  ['臯', '皋'],
  ['槩', '㮣'],
  ['賔', '賓'],
]);

function usage() {
  console.error(`Usage:
  node scripts/remove-edition-collation-notes.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]

Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
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

function chapterFiles(opts) {
  const files = [];
  for (const book of fs.readdirSync(DATA_DIR).sort()) {
    const dir = path.join(DATA_DIR, book);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;
    if (book === 'quality') continue;
    if (opts.books.size && !opts.books.has(book)) continue;
    for (const entry of fs.readdirSync(dir).sort()) {
      if (!/^\d{3}\.json$/u.test(entry)) continue;
      const chapter = entry.replace(/\.json$/u, '');
      if (opts.chapters.size && !opts.chapters.has(chapter)) continue;
      files.push(path.join(dir, entry));
    }
  }
  return files;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function sentenceCount(chapter) {
  let count = 0;
  let translated = 0;
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      for (const unit of block[collectionName] || []) {
        if (!sourceField(unit)) continue;
        count += 1;
        if ((unit.translations || []).some((translation) => (
          translation.lang === 'en' && (translation.literal || translation.idiomatic)
        ))) translated += 1;
      }
    }
  }
  return { count, translated };
}

function removeAdjacentMarker(content, blockIndex, sentenceIndex, removedIds) {
  const block = content[blockIndex];
  const same = block?.sentences || [];
  const previous = same[sentenceIndex - 1];
  if (previous && NOTE_MARKER_RE.test(previous.zh || '')) {
    removedIds.push(previous.id || '');
    same.splice(sentenceIndex - 1, 1);
    return true;
  }

  const previousBlock = content[blockIndex - 1];
  const previousSentences = previousBlock?.sentences || [];
  const tail = previousSentences[previousSentences.length - 1];
  if (tail && NOTE_MARKER_RE.test(tail.zh || '')) {
    removedIds.push(tail.id || '');
    previousSentences.pop();
    if (previousSentences.length === 0) content.splice(blockIndex - 1, 1);
    return true;
  }

  return false;
}

function cleanChapter(file, opts) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const removedIds = [];
  const samples = [];

  for (let blockIndex = chapter.content.length - 1; blockIndex >= 0; blockIndex -= 1) {
    const block = chapter.content[blockIndex];
    const sentences = block.sentences || [];
    for (let sentenceIndex = sentences.length - 1; sentenceIndex >= 0; sentenceIndex -= 1) {
      if (removedIds.length >= opts.limit) break;
      const sentence = sentences[sentenceIndex];
      if (!NOTE_ONLY_RE.test(sentence.zh || '')) continue;
      removedIds.push(sentence.id || '');
      if (samples.length < 20) samples.push({ id: sentence.id || '', text: sentence.zh });
      sentences.splice(sentenceIndex, 1);
      removeAdjacentMarker(chapter.content, blockIndex, sentenceIndex, removedIds);
    }
    if (sentences.length === 0 && Array.isArray(block.sentences)) chapter.content.splice(blockIndex, 1);
  }

  if (removedIds.length > 0) {
    const counts = sentenceCount(chapter);
    chapter.meta = chapter.meta || {};
    chapter.meta.sentenceCount = counts.count;
    chapter.meta.translatedCount = counts.translated;
    if (Array.isArray(chapter.meta.translators) && chapter.meta.translators.length === 1) {
      chapter.meta.translators[0].paragraphs = chapter.content.length;
      chapter.meta.translators[0].sentences = counts.translated;
    }
  }

  if (opts.apply && removedIds.length > 0) {
    fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
  }

  return { removedIds, samples };
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function key(text) {
  let out = '';
  for (const char of String(text || '').normalize('NFKC')) {
    if (!/[\p{Script=Han}0-9]/u.test(char)) continue;
    out += VARIANTS.get(char) || char;
  }
  return out;
}

function stripNote(text) {
  return String(text || '').replace(NOTE_RE, '').replace(NOTE_MARKER_RE, '');
}

function noteAccountsForDifference(item, removedIdSet) {
  const localText = item.localRange?.text || '';
  const sourceText = item.sourceRange?.text || '';
  const localHadNote = NOTE_RE.test(localText);
  const sourceHadNote = NOTE_RE.test(sourceText);
  if (!localHadNote && !sourceHadNote) return false;

  const ids = item.localRange?.ids || [];
  const touchesRemovedUnit = ids.some((id) => removedIdSet.has(`${item.book}/${String(item.chapter).padStart(3, '0')}/${id}`));
  if (localHadNote && !touchesRemovedUnit) return false;

  const local = key(localText);
  const source = key(sourceText);
  const strippedLocal = key(stripNote(localText));
  const strippedSource = key(stripNote(sourceText));

  if (strippedLocal && strippedSource && strippedLocal === strippedSource) return true;
  if (source && strippedLocal && source === strippedLocal) return true;
  if (local && strippedSource && local === strippedSource) return true;
  if (!strippedLocal && !strippedSource) return true;
  if (localHadNote && !sourceText.trim() && !strippedLocal) return true;
  return false;
}

function sourceOnlyApparatusNoOp(item) {
  if (item.type !== 'source_omission_candidate') return false;
  const sourceText = String(item.sourceRange?.text || '').replace(/\s+/gu, '');
  const localText = String(item.localRange?.text || '').replace(/\s+/gu, '');
  if (!sourceText || localText) return false;

  const normalized = sourceText.replace(LEADING_CLOSE_RE, '');
  if (!normalized) return false;
  if (normalized === '校勘記') return true;
  return SOURCE_APPARATUS_START_RE.test(normalized) && SOURCE_APPARATUS_CUE_RE.test(normalized);
}

function queueFiles(opts) {
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (!opts.books.size) return true;
      return [...opts.books].some((book) => path.basename(file).includes(`-${book}.json`));
    })
    .sort();
}

function markQueues(opts, removedIdSet, now) {
  const summary = {
    marked: 0,
    touchedQueueFiles: 0,
    samples: [],
  };

  for (const file of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size && !opts.books.has(item.book)) continue;
      const chapter = String(item.chapter || '').padStart(3, '0');
      if (opts.chapters.size && !opts.chapters.has(chapter)) continue;
      const sourceOnlyNoOp = sourceOnlyApparatusNoOp(item);
      if (!sourceOnlyNoOp && !noteAccountsForDifference(item, removedIdSet)) continue;

      summary.marked += 1;
      if (summary.samples.length < 20) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter,
          type: item.type,
          mode: sourceOnlyNoOp ? 'source-only-apparatus-noop' : 'edition-collation-note-removal',
        });
      }
      if (!opts.apply) continue;

      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      if (sourceOnlyNoOp) {
        item.status = 'denied';
        item.decision = 'denied';
        item.notes = item.notes
          ? `${item.notes}\nReviewed as no-op: upstream source-only edition collation apparatus is not base corpus text; local corpus text retained.`
          : 'Reviewed as no-op: upstream source-only edition collation apparatus is not base corpus text; local corpus text retained.';
      } else {
        item.status = 'applied';
        item.decision = 'included';
        item.appliedAt = now;
        item.appliedSummary = {
          mode: 'edition-collation-note-removal',
        };
        item.notes = item.notes
          ? `${item.notes}\nRemoved standalone edition-collation note from local source; remaining local/source text matches for this queued difference.`
          : 'Removed standalone edition-collation note from local source; remaining local/source text matches for this queued difference.';
      }
      changed = true;
    }

    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }
  return summary;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    removedUnits: 0,
    touchedChapterFiles: 0,
    byBook: {},
    byChapter: {},
    samples: [],
    queue: null,
  };
  const removedIdSet = new Set();

  for (const file of chapterFiles(opts)) {
    if (summary.removedUnits >= opts.limit) break;
    const book = path.basename(path.dirname(file));
    const chapter = path.basename(file, '.json');
    const result = cleanChapter(file, {
      ...opts,
      limit: opts.limit - summary.removedUnits,
    });
    if (result.removedIds.length === 0) continue;
    summary.removedUnits += result.removedIds.length;
    summary.touchedChapterFiles += 1;
    summary.byBook[book] = (summary.byBook[book] || 0) + result.removedIds.length;
    summary.byChapter[`${book}/${chapter}`] = result.removedIds.length;
    for (const id of result.removedIds) removedIdSet.add(`${book}/${chapter}/${id}`);
    for (const sample of result.samples) {
      if (summary.samples.length >= 20) break;
      summary.samples.push({ book, chapter, ...sample });
    }
  }

  summary.queue = markQueues(opts, removedIdSet, now);
  console.log(JSON.stringify(summary, null, 2));
}

main();
