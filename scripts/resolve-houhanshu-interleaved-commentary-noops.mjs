#!/usr/bin/env node
/**
 * Close Hou Hanshu source-correspondence items caused by interleaved
 * Wikisource commentary.
 *
 * The Hou Hanshu Wikisource witness often inserts Li Xian notes directly into
 * the base text. This script only marks a queue item rejected/no-op when the
 * current local base text appears in order inside the upstream span and every
 * upstream-only gap looks like annotation/commentary rather than base text.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  noPunctuationKey,
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-houhanshu-interleaved-commentary-noops';
const NOTE = 'Reviewed as no-op: Wikisource interleaves commentary/gloss text into this Hou Hanshu base span; current local base text is retained.';

const EXPLICIT_NOTE_RE = /^(?:《[^》]{1,40}》|(?:禮記|禮疑議|周禮|尚書|書|詩|論語|春秋|春秋緯|左傳|左氏傳|公羊傳|穀梁傳|爾雅|說文|方言|廣雅|廣州記|交州記|華陽國志|水經注|漢官儀|漢官|漢舊儀|續漢書|續漢志|東觀記|東觀漢記|伏侯古今注|古今注|前書|前漢|漢書|漢法|五經通義|五經要義|大戴禮|蔡質漢儀|謝承書|應劭風俗通|風俗通|淮南子|世本|搜神記|十三州志|漢魏故事|魏志|魏書|決錄注|孔叢|京房占|黃帝占|黃帝星經|臣賢案|案|按|孔安國注|鄭玄注|鄭衆曰|高誘注|應劭曰|服虔曰|師古曰|李賢曰|章懷曰|杜預曰|徐廣曰|司馬貞曰|張守節曰))/u;
const EXPLICIT_NOTE_NEAR_START_RE = /^(?:[^。！？；]{0,24})(?:《[^》]{1,40}》|禮記|周禮|尚書|詩曰|論語|春秋|左傳|公羊傳|爾雅|說文|方言|廣雅|漢官儀|續漢志|東觀記|前書|伏侯|古今注|案|按|臣賢案)[^。！？；]{0,80}(?:曰|云|雲|注|案|按|謂|音|反|見|在今|故城|縣名|郡名)/u;
const SHORT_GLOSS_RE = /^(?:[^。！？；「」『』]{1,60})(?:音[^。！？；]{0,24}反?|讀曰[^。！？；]{1,24}|一作[^。！？；]{1,24}|謂[^。！？；]{1,50}|猶[^。！？；]{1,50}|也|者[^。！？；]{0,30}也|見[^。！？；]{1,30}|解見[^。！？；]{1,30}|事見[^。！？；]{1,30})。?$/u;
const PLACE_GLOSS_RE = /^[^。！？；「」『』]{1,30}(?:，)?(?:縣|郡|國|山|水|湖|塞|城|亭|關|宮|陵|廟|殿|池|渠|津|河|州|道)名[^。！？；]{0,80}。?$/u;
const GEOGRAPHY_RE = /^(?:[^。！？；]{0,24})?(?:故城在今|在今|今[^。！？；]{1,20}(?:縣|州|郡)|屬[^。！？；]{1,20}(?:郡|國|州)|即今|故[^。！？；]{1,20}地也)[^。！？；]{0,80}。?$/u;
const PURE_COMMENTARY_END_RE = /^[^。！？；]{1,90}(?:也|焉|耳|矣|反|音|誤|謬|訛|同|別也|類也|之義也|之詞|之文|之詩|之語|之類|之貌|之稱|之名|之制|之法|之官|之地|之縣|之郡)。?$/u;
const COMMENTARY_CLAUSE_RE = /(?:^|[。；])[^。！？；]{0,70}(?:，[^。！？；]{0,36})?(?:謂|猶|音|讀曰|一作|解見|事見|見上|見下|見本傳|闕名|縣名|郡名|國名|山名|水名|湖名|塞名|宮名|陵名|故城在今|在今|即今|屬[^。！？；]{0,12}(?:郡|國|州)|曰|云|雲)[^。！？；]{0,90}/u;
const STARTS_LIKE_BASE_RE = /^(?:[元一二三四五六七八九十百千萬万〇零]+年|[春夏秋冬](?!祭|物)|閏月|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|是歲|是年|是月|其年|明年|先是|初|詔曰|詔|制曰|帝|上|太后|皇太后|王|太子|遣|拜|封|立|殺|誅|卒|薨|崩|復|大赦|改元|置|罷|徙|寇|伐|攻|破|圍|以|乃|遂|會|及|時|冬十月|夏四月|秋七月)/u;
const PLACEHOLDER_RE = /[□�\uE000-\uF8FF]|\[[0-9A-Fa-f]{4,6}\]/u;
const LOCAL_NOTE_MARKER_RE = /\[[一二三四五六七八九十百千万萬\d]{1,6}\]/u;

function usage() {
  console.error(`Usage: node scripts/resolve-houhanshu-interleaved-commentary-noops.mjs [--apply] [--chapter CH] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
}

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
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(String(argv[++i] || '').trim());
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length).trim());
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
  if (opts.books.size > 0 && !opts.books.has('houhanshu')) return [];
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => entry === 'source-correspondence-corpus-wikisource-houhanshu.json')
    .map((entry) => path.join(QUALITY_DIR, entry));
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (
    item?.appliedAt
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

function compact(text) {
  return normalizeWhitespace(text || '');
}

function keyItems(text) {
  const items = [];
  const chars = [...String(text || '')];
  let offset = 0;
  for (const char of chars) {
    const normalized = variantText(char.normalize('NFKC'));
    for (const outChar of normalized) {
      if (/[\p{Script=Han}0-9]/u.test(outChar)) {
        items.push({ char: outChar, offset });
      }
    }
    offset += char.length;
  }
  return items;
}

function subsequenceMatch(sourceText, localText) {
  const sourceItems = keyItems(sourceText);
  const localKey = noPunctuationKey(localText);
  if (!sourceItems.length || !localKey) return null;
  const matched = [];
  let cursor = 0;
  for (const localChar of localKey) {
    while (cursor < sourceItems.length && sourceItems[cursor].char !== localChar) cursor += 1;
    if (cursor >= sourceItems.length) return null;
    matched.push(sourceItems[cursor]);
    cursor += 1;
  }
  return { sourceItems, localKey, matched };
}

function stripGapPunctuation(text) {
  return compact(text)
    .replace(/^[\p{P}\p{S}\s|]+/gu, '')
    .replace(/[\p{P}\p{S}\s|]+$/gu, '');
}

function sourceGaps(sourceText, matched) {
  const gaps = [];
  let start = 0;
  for (const item of matched) {
    const gap = sourceText.slice(start, item.offset);
    if (gap) gaps.push(gap);
    start = item.offset + [...sourceText.slice(item.offset)][0].length;
  }
  const tail = sourceText.slice(start);
  if (tail) gaps.push(tail);
  return gaps;
}

function meaningfulGap(gap) {
  const stripped = stripGapPunctuation(gap);
  if (!stripped) return '';
  if (!/[\p{Script=Han}0-9]/u.test(stripped)) return '';
  return stripped;
}

function isCommentaryGap(gap) {
  const text = meaningfulGap(gap);
  if (!text) return true;
  const hanLength = noPunctuationKey(text).length;
  if (hanLength === 0) return true;
  if (STARTS_LIKE_BASE_RE.test(text) && !EXPLICIT_NOTE_NEAR_START_RE.test(text)) return false;
  if (EXPLICIT_NOTE_RE.test(text)) return true;
  if (EXPLICIT_NOTE_NEAR_START_RE.test(text)) return true;
  if (PLACE_GLOSS_RE.test(text)) return true;
  if (GEOGRAPHY_RE.test(text)) return true;
  if (SHORT_GLOSS_RE.test(text) && hanLength <= 90) return true;
  if (COMMENTARY_CLAUSE_RE.test(text) && hanLength <= 220) return true;
  if (!STARTS_LIKE_BASE_RE.test(text) && PURE_COMMENTARY_END_RE.test(text) && hanLength <= 80) return true;
  return false;
}

function candidate(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'houhanshu') return null;
  const source = compact(item.sourceRange?.text || '');
  const local = compact(item.localRange?.text || '');
  if (!source || !local) return null;
  if (PLACEHOLDER_RE.test(source) || PLACEHOLDER_RE.test(local) || LOCAL_NOTE_MARKER_RE.test(local)) return null;
  const sourceKey = noPunctuationKey(source);
  const localKey = noPunctuationKey(local);
  if (sourceKey.length < 8 || localKey.length < 8) return null;
  if (sourceKey.length <= localKey.length + 4) return null;
  const match = subsequenceMatch(source, local);
  if (!match) return null;
  const gaps = sourceGaps(source, match.matched).map(meaningfulGap).filter(Boolean);
  if (gaps.length === 0) return null;
  if (!gaps.every(isCommentaryGap)) return null;
  return { gaps };
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function short(text) {
  const value = compact(text);
  return value.length > 160 ? `${value.slice(0, 159)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const samples = [];
  const byChapter = {};
  const byType = {};
  let total = 0;
  let touchedQueueFiles = 0;

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (total >= opts.limit) break;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) continue;
      const result = candidate(item);
      if (!result) continue;
      total += 1;
      byChapter[item.chapter] = (byChapter[item.chapter] || 0) + 1;
      byType[item.type] = (byType[item.type] || 0) + 1;
      if (samples.length < opts.sampleLimit) {
        samples.push({
          id: item.id,
          chapter: `${item.book}/${item.chapter}`,
          type: item.type,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
          gaps: result.gaps.slice(0, 5).map(short),
        });
      }
      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'rejected';
        item.reviewedBy = opts.reviewer;
        item.reviewedAt = now;
        item.resolution = 'noop-upstream-commentary';
        item.notes = appendNote(item.notes, NOTE);
        changed = true;
      }
    }
    if (opts.apply && changed) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`);
      touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify({
    apply: opts.apply,
    total,
    touchedQueueFiles,
    byChapter,
    byType,
    samples,
  }, null, 2));
}

main();
