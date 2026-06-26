#!/usr/bin/env node
/**
 * Repair Old Tang geography source-correspondence rows where Wikisource keeps
 * a regnal-year prefix that the local Chinese dropped, but the existing English
 * already translates that exact date.
 *
 * This script deliberately refuses to translate. It only prepends the Chinese
 * date when both literal and idiomatic English already contain the same reign
 * year.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  noPunctuationKey,
  normalizeWhitespace,
} from './source-variant-utils.mjs';

const QUALITY_PATH = path.join(
  process.cwd(),
  'data',
  'quality',
  'source-correspondence-corpus-wikisource-jiutangshu.json',
);
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'repair-jiutangshu-geography-date-prefixes';
const DEFAULT_CHAPTERS = new Set(['039', '040', '041']);
const DATE_PREFIX_MAX_CHARS = 18;

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

function usage() {
  console.error(`Usage:
  node scripts/repair-jiutangshu-geography-date-prefixes.mjs [--apply]
    [--chapter CHAPTER] [--limit N] [--queue PATH] [--reviewer NAME]

Dry-run by default. Repairs only exact dropped Chinese date prefixes in
jiutangshu geography chapters when both English translation fields already
contain that same date.`);
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
  if (item?.appliedAt || item?.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function collectUnits(chapter) {
  const units = [];
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    for (const [sentenceIndex, unit] of (block.sentences || []).entries()) {
      const field = sourceField(unit);
      if (!field) continue;
      units.push({
        blockIndex,
        blockType: block.type || '',
        kind: 'sentence',
        index: sentenceIndex,
        id: unit.id || '',
        unit,
        field,
      });
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const units = collectUnits(chapter);
    chapterCache.set(absolute, {
      file: absolute,
      chapter,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(absolute);
}

function parseChineseNumber(text) {
  const value = normalizeWhitespace(text);
  if (value === '元') return 1;
  if (/^\d+$/u.test(value)) return Number(value);
  const digits = new Map([
    ['零', 0], ['〇', 0], ['○', 0],
    ['一', 1], ['二', 2], ['三', 3], ['四', 4], ['五', 5],
    ['六', 6], ['七', 7], ['八', 8], ['九', 9],
  ]);
  if (value === '十') return 10;
  if (value === '廿') return 20;
  if (value === '卅') return 30;
  if (value.startsWith('廿')) return 20 + (digits.get(value.slice(1)) || 0);
  if (value.startsWith('卅')) return 30 + (digits.get(value.slice(1)) || 0);
  const tenIndex = value.indexOf('十');
  if (tenIndex >= 0) {
    const before = value.slice(0, tenIndex);
    const after = value.slice(tenIndex + 1);
    const tens = before ? digits.get(before) : 1;
    const ones = after ? digits.get(after) : 0;
    if (tens !== undefined && ones !== undefined) return tens * 10 + ones;
  }
  return digits.get(value);
}

function parseDatePrefix(prefix) {
  const match = normalizeWhitespace(prefix).match(/^(\p{Script=Han}{1,6})(元|[一二三四五六七八九十廿卅0-9]+)年[，,、]?$/u);
  if (!match) return null;
  const era = match[1];
  if (!ERA_NAMES.has(era)) return null;
  const year = parseChineseNumber(match[2]);
  if (!Number.isInteger(year) || year < 1 || year > 30) return null;
  return { era, year, zh: prefix };
}

function extractDatePrefix(sourceText) {
  const chars = [...String(sourceText || '')];
  for (let end = 2; end <= Math.min(DATE_PREFIX_MAX_CHARS, chars.length - 1); end += 1) {
    let prefix = chars.slice(0, end).join('');
    const date = parseDatePrefix(prefix);
    if (!date) continue;
    let restStart = end;
    if (/[，,、]/u.test(chars[end] || '')) {
      prefix = chars.slice(0, end + 1).join('');
      restStart = end + 1;
    }
    const rest = chars.slice(restStart).join('');
    if (!rest) continue;
    return { prefix, date, rest };
  }
  return null;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function englishHasDate(text, date) {
  const english = String(text || '').toLowerCase();
  if (!english) return false;
  const eras = ERA_NAMES.get(date.era) || [];
  if (eras.length === 0) return false;
  const eraPattern = `(?:${eras.join('|')})`;
  const yearTerms = [
    ...(ORDINALS.get(date.year) || []),
    ...(CARDINALS.get(date.year) || []),
    String(date.year),
  ].map(escapeRegExp);
  const yearPattern = `(?:${yearTerms.join('|')})`;
  const patterns = [
    new RegExp(`\\b${yearPattern}\\s+year\\s+of\\s+(?:the\\s+)?${eraPattern}(?:\\s+(?:reign|era))?\\b`, 'iu'),
    new RegExp(`\\b${eraPattern}(?:\\s+(?:reign|era))?\\s*,?\\s+(?:year\\s+)?${yearPattern}\\b`, 'iu'),
    new RegExp(`\\b${eraPattern}\\s+${yearPattern}\\s+year\\b`, 'iu'),
  ];
  return patterns.some((pattern) => pattern.test(english));
}

function firstTranslation(unit) {
  if (Array.isArray(unit?.translations) && unit.translations[0]) return unit.translations[0];
  return null;
}

function translatedDateAlreadyPresent(entry, date) {
  const translation = firstTranslation(entry.unit);
  if (!translation) return false;
  return englishHasDate(translation.literal, date) && englishHasDate(translation.idiomatic, date);
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
  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText) return null;
  const datePrefix = extractDatePrefix(sourceText);
  if (!datePrefix) return null;

  const range = entriesForItem(item);
  if (!range) return null;
  const liveText = range.entries.map((entry) => String(entry.unit[entry.field] || '')).join('');
  if (noPunctuationKey(datePrefix.rest) !== noPunctuationKey(liveText)) return null;
  const firstEntry = range.entries[0];
  const current = String(firstEntry.unit[firstEntry.field] || '');
  if (noPunctuationKey(current).startsWith(noPunctuationKey(datePrefix.prefix))) return null;
  if (!translatedDateAlreadyPresent(firstEntry, datePrefix.date)) return null;

  return {
    item,
    record: range.record,
    entry: firstEntry,
    prefix: datePrefix.prefix,
    date: datePrefix.date,
    before: current,
    after: `${datePrefix.prefix}${current}`,
    liveText,
  };
}

function applyRepair(repair, now, reviewer) {
  repair.entry.unit[repair.entry.field] = repair.after;
  repair.record.changed = true;

  repair.item.status = 'applied';
  repair.item.decision = 'included';
  repair.item.reviewedAt = repair.item.reviewedAt || now;
  repair.item.reviewer = repair.item.reviewer || reviewer;
  repair.item.appliedAt = now;
  repair.item.appliedSummary = {
    mode: 'verified-existing-english-date-prefix-repair',
    prefix: repair.prefix,
    localId: repair.entry.id,
  };
  repair.item.notes = appendNote(
    repair.item.notes,
    'Added missing Chinese reign-year prefix; both existing English translation fields already contained this date.',
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
    byPrefix: {},
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
    summary.byChapter[repair.item.chapter] = (summary.byChapter[repair.item.chapter] || 0) + 1;
    summary.byPrefix[repair.prefix] = (summary.byPrefix[repair.prefix] || 0) + 1;
    if (summary.samples.length < 20) {
      summary.samples.push({
        id: item.id,
        chapter: item.chapter,
        localId: repair.entry.id,
        prefix: repair.prefix,
        before: repair.before,
        after: repair.after,
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
