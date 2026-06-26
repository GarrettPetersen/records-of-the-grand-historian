#!/usr/bin/env node
/**
 * Repair Old Tang geography source-correspondence items where Wikisource has
 * regnal-year date text that the local Chinese dropped, while the existing
 * English already translates those same dates.
 *
 * This script does not generate English. It only inserts Chinese date phrases
 * already present in both existing English translation fields, keeps local
 * structural headings, and marks the queue item applied only when the repaired
 * local Han/digit stream contains the full upstream Han/digit stream.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  noPunctuationKey,
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_PATH = path.join(
  process.cwd(),
  'data',
  'quality',
  'source-correspondence-corpus-wikisource-jiutangshu.json',
);
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'repair-jiutangshu-translated-date-inserts';
const DEFAULT_CHAPTERS = new Set(['039', '040', '041']);

const ERA_NAMES = new Map([
  ['武德', ['wude']],
  ['貞觀', ['zhenguan']],
  ['永徽', ['yonghui']],
  ['顯慶', ['xianqing']],
  ['龍朔', ['longshuo']],
  ['麟德', ['linde']],
  ['乾封', ['qianfeng']],
  ['總章', ['zongzhang']],
  ['咸亨', ['xianheng']],
  ['上元', ['shangyuan']],
  ['儀鳳', ['yifeng']],
  ['調露', ['tiaolu']],
  ['永隆', ['yonglong']],
  ['開耀', ['kaiyao']],
  ['永淳', ['yongchun']],
  ['弘道', ['hongdao']],
  ['文明', ['wenming']],
  ['光宅', ['guangzhai']],
  ['垂拱', ['chuigong']],
  ['永昌', ['yongchang']],
  ['載初', ['zaichu']],
  ['天授', ['tianshou']],
  ['如意', ['ruyi']],
  ['長壽', ['changshou']],
  ['延載', ['yanzai']],
  ['證聖', ['zhengsheng']],
  ['天冊萬歲', ['tiance wansui', 'tiancewansui']],
  ['萬歲登封', ['wansui dengfeng', 'wansuidengfeng']],
  ['萬歲通天', ['wansui tongtian', 'wansuitongtian']],
  ['神功', ['shengong']],
  ['聖曆', ['shengli']],
  ['久視', ['jiushi']],
  ['大足', ['dazu']],
  ['長安', ["chang\\s*[\\u2019']?an", 'changan']],
  ['神龍', ['shenlong']],
  ['景龍', ['jinglong']],
  ['唐隆', ['tanglong']],
  ['景雲', ['jingyun']],
  ['太極', ['taiji']],
  ['延和', ['yanhe']],
  ['先天', ['xiantian']],
  ['開元', ['kaiyuan']],
  ['天寶', ['tianbao']],
  ['至德', ['zhide']],
  ['乾元', ['qianyuan']],
  ['寶應', ['baoying']],
  ['廣德', ['guangde']],
  ['永泰', ['yongtai']],
  ['大曆', ['dali']],
  ['建中', ['jianzhong']],
  ['興元', ['xingyuan']],
  ['貞元', ['zhenyuan']],
  ['永貞', ['yongzhen']],
  ['元和', ['yuanhe']],
  ['長慶', ['changqing']],
  ['寶曆', ['baoli']],
  ['大和', ['dahe', 'taihe']],
  ['太和', ['taihe', 'dahe']],
  ['開成', ['kaicheng']],
  ['會昌', ['huichang']],
  ['大中', ['dazhong']],
  ['咸通', ['xiantong']],
  ['乾符', ['qianfu']],
  ['廣明', ['guangming']],
  ['中和', ['zhonghe']],
  ['光啟', ['guangqi']],
  ['文德', ['wende']],
  ['龍紀', ['longji']],
  ['大順', ['dashun']],
  ['景福', ['jingfu']],
  ['乾寧', ['qianning']],
  ['光化', ['guanghua']],
  ['天復', ['tianfu']],
  ['天祐', ['tianyou']],
]);

const CARDINALS = new Map([
  [1, ['one']],
  [2, ['two']],
  [3, ['three']],
  [4, ['four']],
  [5, ['five']],
  [6, ['six']],
  [7, ['seven']],
  [8, ['eight']],
  [9, ['nine']],
  [10, ['ten']],
  [11, ['eleven']],
  [12, ['twelve']],
  [13, ['thirteen']],
  [14, ['fourteen']],
  [15, ['fifteen']],
  [16, ['sixteen']],
  [17, ['seventeen']],
  [18, ['eighteen']],
  [19, ['nineteen']],
  [20, ['twenty']],
  [21, ['twenty[-\\s]+one']],
  [22, ['twenty[-\\s]+two']],
  [23, ['twenty[-\\s]+three']],
  [24, ['twenty[-\\s]+four']],
  [25, ['twenty[-\\s]+five']],
  [26, ['twenty[-\\s]+six']],
  [27, ['twenty[-\\s]+seven']],
  [28, ['twenty[-\\s]+eight']],
  [29, ['twenty[-\\s]+nine']],
  [30, ['thirty']],
]);

const ORDINALS = new Map([
  [1, ['first', '1st']],
  [2, ['second', '2nd']],
  [3, ['third', '3rd']],
  [4, ['fourth', '4th']],
  [5, ['fifth', '5th']],
  [6, ['sixth', '6th']],
  [7, ['seventh', '7th']],
  [8, ['eighth', '8th']],
  [9, ['ninth', '9th']],
  [10, ['tenth', '10th']],
  [11, ['eleventh', '11th']],
  [12, ['twelfth', '12th']],
  [13, ['thirteenth', '13th']],
  [14, ['fourteenth', '14th']],
  [15, ['fifteenth', '15th']],
  [16, ['sixteenth', '16th']],
  [17, ['seventeenth', '17th']],
  [18, ['eighteenth', '18th']],
  [19, ['nineteenth', '19th']],
  [20, ['twentieth', '20th']],
  [21, ['twenty[-\\s]+first', '21st']],
  [22, ['twenty[-\\s]+second', '22nd']],
  [23, ['twenty[-\\s]+third', '23rd']],
  [24, ['twenty[-\\s]+fourth', '24th']],
  [25, ['twenty[-\\s]+fifth', '25th']],
  [26, ['twenty[-\\s]+sixth', '26th']],
  [27, ['twenty[-\\s]+seventh', '27th']],
  [28, ['twenty[-\\s]+eighth', '28th']],
  [29, ['twenty[-\\s]+ninth', '29th']],
  [30, ['thirtieth', '30th']],
]);

const ERA_ALT = [...ERA_NAMES.keys()]
  .sort((a, b) => b.length - a.length)
  .join('|');
const DATE_RE = new RegExp(`(${ERA_ALT})(元|[一二三四五六七八九十廿卅0-9]+)年[，,、]?`, 'gu');
const MONTH_AFTER_RE = /^(?:閏?[正一二三四五六七八九十]+月|[一二三四五六七八九十]+日)/u;
const HAN_DIGIT_RE = /[\p{Script=Han}0-9]/u;

function usage() {
  console.error(`Usage:
  node scripts/repair-jiutangshu-translated-date-inserts.mjs [--apply]
    [--chapter CHAPTER] [--limit N] [--queue PATH] [--reviewer NAME]

Dry-run by default. Inserts only Chinese regnal dates whose existing literal
and idiomatic English translations already contain the same date.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    chapters: new Set(DEFAULT_CHAPTERS),
    limit: Infinity,
    queue: QUALITY_PATH,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--chapter') {
      if (opts.chapters === DEFAULT_CHAPTERS) opts.chapters = new Set();
      opts.chapters.add(String(argv[++index] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      if (opts.chapters === DEFAULT_CHAPTERS) opts.chapters = new Set();
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++index] || Infinity);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || Infinity);
      continue;
    }
    if (arg === '--queue') {
      opts.queue = argv[++index] || QUALITY_PATH;
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length) || QUALITY_PATH;
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++index] || DEFAULT_REVIEWER;
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

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (item?.appliedAt || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function collectUnits(chapter) {
  const byId = new Map();
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const [unitIndex, unit] of collection.entries()) {
        const field = sourceField(unit);
        if (!field || !unit.id) continue;
        byId.set(unit.id, {
          unit,
          field,
          id: unit.id,
          blockIndex,
          blockType: block.type || '',
          unitIndex,
        });
      }
    }
  }
  return byId;
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    chapterCache.set(absolute, {
      file: absolute,
      chapter,
      byId: collectUnits(chapter),
      changed: false,
    });
  }
  return chapterCache.get(absolute);
}

function sourceOf(entry) {
  return String(entry?.unit?.[entry.field] || '');
}

function parseChineseNumber(text) {
  if (text === '元') return 1;
  if (/^\d+$/u.test(text)) return Number(text);
  const digits = new Map([
    ['零', 0], ['〇', 0], ['一', 1], ['二', 2], ['三', 3], ['四', 4], ['五', 5],
    ['六', 6], ['七', 7], ['八', 8], ['九', 9],
  ]);
  if (text === '十') return 10;
  if (text.startsWith('廿')) return 20 + (digits.get(text[1]) || 0);
  if (text.startsWith('卅')) return 30 + (digits.get(text[1]) || 0);
  const tenIndex = text.indexOf('十');
  if (tenIndex >= 0) {
    const before = text.slice(0, tenIndex);
    const after = text.slice(tenIndex + 1);
    const tens = before ? digits.get(before) : 1;
    const ones = after ? digits.get(after) : 0;
    if (tens != null && ones != null) return tens * 10 + ones;
  }
  return digits.get(text) ?? null;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function englishDatePattern(date) {
  const eras = ERA_NAMES.get(date.era) || [];
  const yearTerms = [
    ...(ORDINALS.get(date.year) || []),
    ...(CARDINALS.get(date.year) || []),
    String(date.year),
  ].map(escapeRegExp);
  if (eras.length === 0 || yearTerms.length === 0) return null;
  const eraPattern = `(?:${eras.join('|')})`;
  const yearPattern = `(?:${yearTerms.join('|')})`;
  return new RegExp(
    `(?:\\b${yearPattern}\\s+year\\s+of\\s+(?:the\\s+)?${eraPattern}(?:\\s+(?:reign|era))?\\b|\\b${eraPattern}(?:\\s+(?:reign|era))?\\s*,?\\s+(?:year\\s+)?${yearPattern}\\b|\\b${eraPattern}\\s+${yearPattern}\\s+year\\b)`,
    'giu',
  );
}

function countEnglishDate(text, date) {
  const pattern = englishDatePattern(date);
  if (!pattern) return 0;
  return [...String(text || '').toLowerCase().matchAll(pattern)].length;
}

function rangeTranslationText(entries, field) {
  return entries.map((entry) => {
    const first = Array.isArray(entry.unit?.translations) ? entry.unit.translations[0] : null;
    return String(first?.[field] || '');
  }).join(' ');
}

function keyWithOffsets(text) {
  let key = '';
  const offsets = [];
  for (const [offset, char] of [...String(text || '')].entries()) {
    if (!HAN_DIGIT_RE.test(char)) continue;
    key += variantText(char);
    offsets.push(offset);
  }
  return { key, offsets };
}

function dateOccurrences(source, localText) {
  const localKey = noPunctuationKey(localText);
  const dates = [];
  for (const match of source.matchAll(DATE_RE)) {
    const raw = match[0];
    const after = source.slice(match.index + raw.length);
    if (MONTH_AFTER_RE.test(after)) continue;
    const era = match[1];
    const year = parseChineseNumber(match[2]);
    if (!year || year < 1 || year > 30) continue;
    const zh = normalizeWhitespace(raw.replace(/[，,、]$/u, ''));
    if (localKey.includes(noPunctuationKey(zh))) continue;
    dates.push({
      zh,
      insertText: /[，,、]$/u.test(raw) ? raw.replace(/[,、]$/u, '，') : `${zh}，`,
      era,
      year,
      sourceIndex: match.index,
    });
  }
  return dates;
}

function countByDate(dates) {
  const counts = new Map();
  for (const date of dates) {
    const key = `${date.era}:${date.year}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function translationsCoverDates(entries, dates) {
  const literal = rangeTranslationText(entries, 'literal');
  const idiomatic = rangeTranslationText(entries, 'idiomatic');
  const counts = countByDate(dates);
  for (const [key, needed] of counts.entries()) {
    const [era, yearText] = key.split(':');
    const date = { era, year: Number(yearText) };
    if (countEnglishDate(literal, date) < needed) return false;
    if (countEnglishDate(idiomatic, date) < needed) return false;
  }
  return true;
}

function sourceAfterDateKey(source, date) {
  const after = source.slice(date.sourceIndex + date.zh.length).replace(/^[，,、。；：！？\s]+/u, '');
  let key = '';
  for (const char of after) {
    if (!HAN_DIGIT_RE.test(char)) continue;
    key += variantText(char);
    if (key.length >= 10) break;
  }
  return key;
}

function rawOffsetToEntry(entries, offset) {
  let cursor = 0;
  for (const entry of entries) {
    const text = sourceOf(entry);
    const end = cursor + [...text].length;
    if (offset <= end) return { entry, localOffset: Math.max(0, offset - cursor) };
    cursor = end;
  }
  return null;
}

function charAtRaw(text, offset) {
  return [...String(text || '')][offset] || '';
}

function replaceCharAtRaw(text, offset, replacement) {
  const chars = [...String(text || '')];
  chars[offset] = replacement;
  return chars.join('');
}

function isSubsequence(needle, haystack) {
  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) index += 1;
    if (index === needle.length) return true;
  }
  return index === needle.length;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function entriesForItem(item) {
  if (!item.file || !fs.existsSync(item.file)) return null;
  if (!Array.isArray(item.localRange?.ids) || item.localRange.ids.length === 0) return null;
  const record = loadChapter(item.file);
  const entries = [];
  for (const id of item.localRange.ids) {
    const entry = record.byId.get(id);
    if (!entry || entry.kind !== 'sentence' || entry.blockType !== 'paragraph') return null;
    entries.push(entry);
  }
  return { record, entries };
}

function classifyItem(item, opts) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'jiutangshu' || !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return null;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type || '')) return null;
  const source = String(item.sourceRange?.text || '');
  if (!source) return null;

  const range = entriesForItem(item);
  if (!range) return null;
  const localText = range.entries.map(sourceOf).join('');
  const dates = dateOccurrences(source, localText);
  if (dates.length === 0) return null;
  if (!translationsCoverDates(range.entries, dates)) return null;

  const localKeyInfo = keyWithOffsets(localText);
  const operations = [];
  let cursorKeyIndex = 0;
  for (const date of dates) {
    const anchor = sourceAfterDateKey(source, date);
    if (anchor.length < 4) return null;
    const index = localKeyInfo.key.indexOf(anchor, cursorKeyIndex);
    if (index < 0) return null;
    if (localKeyInfo.key.indexOf(anchor, index + 1) >= 0 && index < cursorKeyIndex) return null;
    const rawOffset = localKeyInfo.offsets[index];
    if (!Number.isInteger(rawOffset)) return null;
    operations.push({ ...date, rawOffset });
    cursorKeyIndex = index + anchor.length;
  }

  let preview = localText;
  for (const op of [...operations].sort((a, b) => b.rawOffset - a.rawOffset)) {
    const prev = charAtRaw(preview, op.rawOffset - 1);
    if (prev === '，') preview = replaceCharAtRaw(preview, op.rawOffset - 1, '。');
    preview = `${[...preview].slice(0, op.rawOffset).join('')}${op.insertText}${[...preview].slice(op.rawOffset).join('')}`;
  }

  const sourceKey = noPunctuationKey(source);
  const previewKey = noPunctuationKey(preview);
  if (!isSubsequence(sourceKey, previewKey)) return null;

  return {
    item,
    record: range.record,
    entries: range.entries,
    before: localText,
    after: preview,
    operations,
  };
}

function applyRepair(repair, now, reviewer) {
  for (const op of [...repair.operations].sort((a, b) => b.rawOffset - a.rawOffset)) {
    const target = rawOffsetToEntry(repair.entries, op.rawOffset);
    if (!target) throw new Error(`Could not map insertion offset for ${repair.item.id}`);
    const text = sourceOf(target.entry);
    const chars = [...text];
    const globalPrev = op.rawOffset - 1;
    const previous = rawOffsetToEntry(repair.entries, globalPrev);
    if (previous && charAtRaw(sourceOf(previous.entry), previous.localOffset) === '，') {
      previous.entry.unit[previous.entry.field] = replaceCharAtRaw(
        sourceOf(previous.entry),
        previous.localOffset,
        '。',
      );
    }
    chars.splice(target.localOffset, 0, op.insertText);
    target.entry.unit[target.entry.field] = chars.join('');
  }
  repair.record.changed = true;

  repair.item.status = 'applied';
  repair.item.decision = 'included';
  repair.item.reviewedAt = repair.item.reviewedAt || now;
  repair.item.reviewer = repair.item.reviewer || reviewer;
  repair.item.appliedAt = now;
  repair.item.appliedSummary = {
    mode: 'verified-existing-english-date-insert-repair',
    insertedDates: repair.operations.map((op) => op.zh),
    retainedLocalStructure: true,
  };
  repair.item.notes = appendNote(
    repair.item.notes,
    'Inserted missing Chinese regnal dates while retaining local structural headings; both existing English translation fields already contained each date.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queuePath = path.resolve(opts.queue);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    touchedQueueFiles: 0,
    touchedChapterFiles: 0,
    byChapter: {},
    byDate: {},
    samples: [],
    skippedAfterLimit: 0,
  };

  let changedQueue = false;
  for (const item of queue.items || []) {
    if (summary.repaired >= opts.limit) {
      summary.skippedAfterLimit += 1;
      continue;
    }
    const repair = classifyItem(item, opts);
    if (!repair) continue;
    summary.repaired += 1;
    summary.byChapter[item.chapter] = (summary.byChapter[item.chapter] || 0) + 1;
    for (const op of repair.operations) {
      summary.byDate[op.zh] = (summary.byDate[op.zh] || 0) + 1;
    }
    if (summary.samples.length < 25) {
      summary.samples.push({
        id: item.id,
        chapter: item.chapter,
        insertedDates: repair.operations.map((op) => op.zh),
        before: repair.before.slice(0, 220),
        after: repair.after.slice(0, 260),
      });
    }
    if (!opts.apply) continue;
    applyRepair(repair, now, opts.reviewer);
    changedQueue = true;
  }

  if (opts.apply && changedQueue) {
    queue.updatedAt = now;
    fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    summary.touchedQueueFiles = 1;
  }

  if (opts.apply) {
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
