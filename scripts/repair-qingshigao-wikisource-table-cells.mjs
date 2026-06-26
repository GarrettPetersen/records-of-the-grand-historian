#!/usr/bin/env node
/**
 * Repair Qing draft table cells from Wikisource raw table markup.
 *
 * The source-correspondence queue catches the flattened symptom: upstream rows
 * have names that local table cells dropped. For these Qing table chapters the
 * safer repair surface is the raw wikitable itself, because row and column
 * boundaries tell us which empty/nonempty local cell should receive the text.
 *
 * This script only restores nonempty upstream cells. It does not clear local
 * cells when Wikisource is empty.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  DEFAULT_MODEL,
  DEFAULT_TRANSLATOR,
  appendNote,
  compactKey,
  firstTranslation,
  isSafeFormulaicTranslation,
  normalizeText,
  statusOf,
  translateCell,
} from './repair-qingshigao-table-prefix-omissions.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_QUEUE = path.join(QUALITY_DIR, 'source-correspondence-corpus-wikisource-qingshigao.json');
const DEFAULT_CACHE_DIR = path.join(os.tmpdir(), 'qingshigao-wikisource-raw');
const DEFAULT_REVIEWER = 'repair-qingshigao-wikisource-table-cells';
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const HAN_RE = /\p{Script=Han}/u;

function usage() {
  console.error(`Usage:
  node scripts/repair-qingshigao-wikisource-table-cells.mjs [--apply]
    [--chapter CHAPTER] [--queue PATH] [--cache-dir DIR]
    [--limit-chapters N] [--limit-cells N] [--offline]
    [--sample-limit N] [--unsafe-sample-limit N]

Downloads/caches Wikisource raw Qing table chapters, restores nonempty upstream
table cells into matching local table rows, regenerates constrained table-cell
English, and marks represented table queue items applied.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    chapters: new Set(),
    queue: DEFAULT_QUEUE,
    cacheDir: DEFAULT_CACHE_DIR,
    limitChapters: Infinity,
    limitCells: Infinity,
    sampleLimit: 40,
    unsafeSampleLimit: 30,
    offline: false,
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
    if (arg === '--offline') {
      opts.offline = true;
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
      opts.queue = argv[++i] || DEFAULT_QUEUE;
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length) || DEFAULT_QUEUE;
      continue;
    }
    if (arg === '--cache-dir') {
      opts.cacheDir = argv[++i] || DEFAULT_CACHE_DIR;
      continue;
    }
    if (arg.startsWith('--cache-dir=')) {
      opts.cacheDir = arg.slice('--cache-dir='.length) || DEFAULT_CACHE_DIR;
      continue;
    }
    if (arg === '--limit-chapters') {
      opts.limitChapters = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit-chapters=')) {
      opts.limitChapters = Number(arg.slice('--limit-chapters='.length));
      continue;
    }
    if (arg === '--limit-cells') {
      opts.limitCells = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit-cells=')) {
      opts.limitCells = Number(arg.slice('--limit-cells='.length));
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
    if (arg === '--unsafe-sample-limit') {
      opts.unsafeSampleLimit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--unsafe-sample-limit=')) {
      opts.unsafeSampleLimit = Number(arg.slice('--unsafe-sample-limit='.length));
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

  if (!Number.isFinite(opts.limitChapters) || opts.limitChapters < 0) opts.limitChapters = Infinity;
  if (!Number.isFinite(opts.limitCells) || opts.limitCells < 0) opts.limitCells = Infinity;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 40;
  if (!Number.isFinite(opts.unsafeSampleLimit) || opts.unsafeSampleLimit < 0) opts.unsafeSampleLimit = 30;
  return opts;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function hasTableLocation(item) {
  return [...(item.localRange?.locations || []), ...(item.sourceRange?.locations || [])]
    .some((location) => String(location.blockType || '').startsWith('table') || location.kind === 'cell');
}

function chapterFile(chapter) {
  return path.join(DATA_DIR, 'qingshigao', `${String(chapter).padStart(3, '0')}.json`);
}

function tableBlocks(chapter) {
  return (chapter.content || [])
    .map((block, blockIndex) => ({ block, blockIndex }))
    .filter(({ block }) => String(block?.type || '').startsWith('table') && Array.isArray(block.sentences));
}

function stripTemplates(text) {
  let value = String(text || '');
  for (let i = 0; i < 25; i += 1) {
    const next = value
      .replace(/\{\{ProperNoun\|([^{}]*)\}\}/gu, '$1')
      .replace(/\{ProperNoun\|([^{}]*)\}\}/gu, '$1')
      .replace(/\{\{[^{}|]+\|([^{}]*)\}\}/gu, '$1')
      .replace(/\{\{[^{}]*\}\}/gu, '');
    if (next === value) break;
    value = next;
  }
  return value;
}

function cleanWikiText(text) {
  return stripTemplates(text)
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/giu, '')
    .replace(/<[^>]+>/gu, '')
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/gu, '$1')
    .replace(/\[\[([^\]]+)\]\]/gu, '$1')
    .replace(/'''?/gu, '')
    .replace(/&nbsp;|&#160;/giu, '')
    .replace(/\s+/gu, '')
    .trim();
}

function stripCellAttributes(text) {
  const value = String(text || '').trim();
  const attrMatch = value.match(/^(?:(?:[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^|]+))\s*)+\|(.*)$/u);
  return attrMatch ? attrMatch[1] : value;
}

function splitCellLine(line) {
  const marker = line[0];
  const separator = marker === '!' ? '!!' : '||';
  return line.slice(1).split(separator).map((part) => cleanWikiText(stripCellAttributes(part)));
}

function parseWikiTables(raw) {
  const tables = [];
  let inTable = false;
  let rows = [];
  let row = [];

  for (const rawLine of String(raw || '').split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('{|')) {
      inTable = true;
      rows = [];
      row = [];
      continue;
    }
    if (!inTable) continue;
    if (line.startsWith('|}')) {
      if (row.length > 0) rows.push(row);
      if (rows.length > 0) tables.push(rows);
      inTable = false;
      rows = [];
      row = [];
      continue;
    }
    if (line.startsWith('|-')) {
      if (row.length > 0) rows.push(row);
      row = [];
      continue;
    }
    if (line.startsWith('|') || line.startsWith('!')) {
      row.push(...splitCellLine(line));
      continue;
    }
    if (row.length > 0) row[row.length - 1] += cleanWikiText(line);
  }

  return tables;
}

function namesOnly(text) {
  const raw = normalizeText(text);
  if (!raw || /[。！？；]/u.test(raw)) return false;
  if (/[年月日朔晦尚書侍郎遷免卒革降休乞病署兼管授解調轉補罷留起仍]/u.test(raw)) return false;
  const value = raw.replace(/[，、]+/gu, '');
  return value.length > 0 && /^[\p{Script=Han}]+$/u.test(value);
}

function safeTranslation(zh, english) {
  if (!english || !/[A-Za-z\p{Script=Han}]/u.test(english)) return false;
  if (namesOnly(zh)) return true;
  return isSafeFormulaicTranslation(zh, english);
}

function translateTableCell(zh) {
  if (namesOnly(zh)) return `${normalizeText(zh).replace(/[。！？；]+$/u, '')}.`;
  return translateCell(zh);
}

function findMatchingTable(rawTables, blocks) {
  for (const table of rawTables) {
    if (table.length !== blocks.length) continue;
    let mismatch = false;
    for (let index = 0; index < table.length; index += 1) {
      const localCells = blocks[index].block.sentences || [];
      if (table[index].length !== localCells.length) {
        mismatch = true;
        break;
      }
      const localHeader = normalizeText(localCells[0]?.zh || '');
      const rawHeader = normalizeText(table[index][0] || '');
      if (index > 0 && localHeader && rawHeader && localHeader !== rawHeader) {
        mismatch = true;
        break;
      }
    }
    if (!mismatch) return table;
  }
  return null;
}

function sourceUrlForChapter(chapter, queueItems) {
  const file = chapterFile(chapter);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const meta = data.meta || data.metadata || {};
    if (meta.wikisourceUrl) return meta.wikisourceUrl;
    if (meta.url && String(meta.url).includes('wikisource.org')) return meta.url;
  }
  const queued = queueItems.find((item) => item.chapter === chapter && item.sourceUrl);
  return queued?.sourceUrl || '';
}

async function rawForChapter(chapter, url, opts) {
  fs.mkdirSync(opts.cacheDir, { recursive: true });
  const cachePath = path.join(opts.cacheDir, `qingshigao-${chapter}.wiki`);
  if (fs.existsSync(cachePath)) return fs.readFileSync(cachePath, 'utf8');
  if (opts.offline) throw new Error(`No cached raw source for qingshigao/${chapter}: ${cachePath}`);
  if (!url) throw new Error(`No Wikisource URL for qingshigao/${chapter}`);

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
  const raw = await response.text();
  fs.writeFileSync(cachePath, raw, 'utf8');
  return raw;
}

function chapterJoinedText(chapter) {
  const parts = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) parts.push(String(unit[field] || ''));
      }
    }
  }
  return normalizeText(parts.join(''));
}

function representedInChapter(item, joined, compactJoined) {
  const source = normalizeText(item.sourceRange?.text || '');
  if (!source) return false;
  if (joined.includes(source)) return true;
  const sourceKey = compactKey(source);
  return sourceKey.length > 0 && compactJoined.includes(sourceKey);
}

function updateTranslation(unit, zh, english) {
  const translation = firstTranslation(unit);
  translation.lang = translation.lang || 'en';
  translation.literal = english;
  translation.idiomatic = english;
  translation.translator = DEFAULT_TRANSLATOR;
  translation.model = DEFAULT_MODEL;
  if (HAN_RE.test(english)) {
    translation.allowChineseCharacters = true;
    unit.allowChineseCharacters = true;
  }
}

function short(text) {
  const value = normalizeText(text);
  return value.length > 120 ? `${value.slice(0, 120)}...` : value;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queuePath = path.resolve(opts.queue);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const pendingTableItems = (queue.items || [])
    .filter((item) => item.book === 'qingshigao')
    .filter((item) => statusOf(item) === 'pending')
    .filter((item) => hasTableLocation(item));

  const chapters = [...new Set(pendingTableItems.map((item) => String(item.chapter || '').padStart(3, '0')))]
    .filter((chapter) => opts.chapters.size === 0 || opts.chapters.has(chapter))
    .sort()
    .slice(0, opts.limitChapters);

  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    chaptersConsidered: chapters.length,
    chaptersFetched: 0,
    chaptersChanged: 0,
    cellsChanged: 0,
    queueItemsMarked: 0,
    skipped: {
      noLocalFile: 0,
      noTable: 0,
      noMatchingRawTable: 0,
      unsafeTranslation: 0,
      afterCellLimit: 0,
    },
    byChapter: {},
    samples: [],
    unsafeSamples: [],
  };

  let queueChanged = false;

  for (const chapter of chapters) {
    if (summary.cellsChanged >= opts.limitCells) {
      summary.skipped.afterCellLimit += 1;
      continue;
    }

    const file = chapterFile(chapter);
    if (!fs.existsSync(file)) {
      summary.skipped.noLocalFile += 1;
      continue;
    }

    const chapterData = JSON.parse(fs.readFileSync(file, 'utf8'));
    const blocks = tableBlocks(chapterData);
    if (blocks.length === 0) {
      summary.skipped.noTable += 1;
      continue;
    }

    const chapterItems = pendingTableItems.filter((item) => String(item.chapter || '').padStart(3, '0') === chapter);
    const raw = await rawForChapter(chapter, sourceUrlForChapter(chapter, chapterItems), opts);
    summary.chaptersFetched += 1;
    const table = findMatchingTable(parseWikiTables(raw), blocks);
    if (!table) {
      summary.skipped.noMatchingRawTable += 1;
      continue;
    }

    let chapterChanged = false;
    const chapterSummary = summary.byChapter[chapter] || {
      cellsChanged: 0,
      queueItemsMarked: 0,
    };

    for (let rowIndex = 0; rowIndex < table.length; rowIndex += 1) {
      const sourceRow = table[rowIndex];
      const localCells = blocks[rowIndex].block.sentences || [];
      for (let cellIndex = 0; cellIndex < sourceRow.length; cellIndex += 1) {
        if (summary.cellsChanged >= opts.limitCells) {
          summary.skipped.afterCellLimit += 1;
          break;
        }
        const source = sourceRow[cellIndex] || '';
        const unit = localCells[cellIndex];
        if (!unit || !source || !HAN_OR_DIGIT_RE.test(source)) continue;
        const field = sourceField(unit);
        if (!field) continue;
        const current = String(unit[field] || '');
        if (normalizeText(current) === normalizeText(source)) continue;

        const english = translateTableCell(source);
        if (!safeTranslation(source, english)) {
          summary.skipped.unsafeTranslation += 1;
          if (summary.unsafeSamples.length < opts.unsafeSampleLimit) {
            summary.unsafeSamples.push({
              chapter,
              id: unit.id || '',
              rowIndex,
              cellIndex,
              source: short(source),
              english: short(english),
            });
          }
          continue;
        }

        if (summary.samples.length < opts.sampleLimit) {
          summary.samples.push({
            chapter,
            id: unit.id || '',
            rowIndex,
            cellIndex,
            before: short(current),
            after: short(source),
            english: short(english),
          });
        }

        summary.cellsChanged += 1;
        chapterSummary.cellsChanged += 1;
        chapterChanged = true;

        unit[field] = source;
        updateTranslation(unit, source, english);
      }
    }

    if (chapterChanged) {
      summary.byChapter[chapter] = chapterSummary;
      summary.chaptersChanged += 1;
      if (opts.apply) {
        fs.writeFileSync(file, `${JSON.stringify(chapterData, null, 2)}\n`, 'utf8');
      }
    }

    const joined = chapterJoinedText(chapterData);
    const compactJoined = compactKey(joined);
    for (const item of chapterItems) {
      if (!representedInChapter(item, joined, compactJoined)) continue;
      chapterSummary.queueItemsMarked += 1;
      summary.queueItemsMarked += 1;
      if (!opts.apply) continue;
      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'qingshigao-wikisource-table-cell-repair',
        chapter,
      };
      item.notes = appendNote(
        item.notes,
        'Applied nonempty Wikisource table cells to the matching Qing table row/column cells and regenerated constrained table-cell English; Chinese names intentionally retained with allowChineseCharacters.',
      );
      queueChanged = true;
    }
    if (chapterSummary.queueItemsMarked > 0) summary.byChapter[chapter] = chapterSummary;
  }

  if (opts.apply && queueChanged) {
    queue.updatedAt = now;
    fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
