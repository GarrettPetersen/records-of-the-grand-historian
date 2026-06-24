#!/usr/bin/env node
/**
 * Select source-correspondence repairs where upstream has a short leading
 * regnal-year prefix that the local Chinese is missing, but the existing
 * English translation already includes that same date.
 *
 * This script only creates a decision packet. It never translates text.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const DEFAULT_OUT_DIR = path.join(QUALITY_DIR, 'repair-packets', 'workbench');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const DATE_PREFIX_MAX_CHARS = 18;

const COMMON_VARIANTS = new Map([
  ['爲', '為'], ['为', '為'],
  ['衆', '眾'], ['众', '眾'],
  ['歷', '曆'], ['歴', '曆'], ['历', '曆'],
  ['后', '後'], ['复', '復'], ['于', '於'],
]);

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
  ['嗣聖', ['sisheng']],
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
  node scripts/select-verified-date-prefix-repairs.mjs [--queue PATH] [--book BOOK]
    [--limit N] [--sample N] [--json] [--packet PATH] [--out-dir PATH]

Creates a repair-decision-packet approving only items whose existing English
already contains the restored regnal date.`);
}

function parseArgs(argv) {
  const opts = {
    queues: [],
    books: new Set(),
    limit: 0,
    sample: 12,
    json: false,
    packet: '',
    outDir: DEFAULT_OUT_DIR,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
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
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || 0);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || 0);
      continue;
    }
    if (arg === '--sample') {
      opts.sample = Number(argv[++i] || opts.sample);
      continue;
    }
    if (arg.startsWith('--sample=')) {
      opts.sample = Number(arg.slice('--sample='.length) || opts.sample);
      continue;
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--packet') {
      opts.packet = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--packet=')) {
      opts.packet = arg.slice('--packet='.length);
      continue;
    }
    if (arg === '--out-dir') {
      opts.outDir = argv[++i] || DEFAULT_OUT_DIR;
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      opts.outDir = arg.slice('--out-dir='.length) || DEFAULT_OUT_DIR;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }
  return opts;
}

function defaultQueues() {
  return fs.readdirSync(QUALITY_DIR)
    .filter((filename) => QUEUE_RE.test(filename))
    .map((filename) => path.join(QUALITY_DIR, filename))
    .sort();
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (item?.appliedAt || item?.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'rejected';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/gu, '').trim();
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/gu, '，')
    .replace(/[﹔;]/gu, '；')
    .replace(/[﹕:]/gu, '：')
    .replace(/[﹗!]/gu, '！')
    .replace(/[﹖?]/gu, '？')
    .replace(/[“”]/gu, '「')
    .replace(/[‘’]/gu, '」')
    .replace(/[（]/gu, '(')
    .replace(/[）]/gu, ')');
}

function variantText(text) {
  let out = '';
  for (const char of normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC')) {
    out += COMMON_VARIANTS.get(char) || char;
  }
  return out;
}

function sourceKey(unit) {
  for (const key of SOURCE_KEYS) {
    if (typeof unit?.[key] === 'string') return key;
  }
  return null;
}

function collectUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, unit] of block.sentences.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'paragraph',
          index,
          kind: 'sentence',
          key,
          unit,
        });
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, unit] of block.cells.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'table_row',
          index,
          kind: 'cell',
          key,
          unit,
        });
      }
    }
  }
  return units;
}

function locationIndex(location) {
  return location?.sentenceIndex ?? location?.cellIndex ?? location?.index;
}

function unitMatchesLocation(unit, location) {
  if (!location) return false;
  return unit.blockIndex === location.blockIndex
    && unit.index === locationIndex(location)
    && unit.key === location.field;
}

const chapterCache = new Map();

function liveUnitForItem(item) {
  const locations = item.localRange?.locations || [];
  if (locations.length !== 1) return null;
  const location = locations[0];
  if (location.kind !== 'sentence' || String(location.blockType || '') !== 'paragraph') return null;

  const file = item.file || '';
  if (!file || !fs.existsSync(file)) return null;
  const absolute = path.resolve(file);
  let units = chapterCache.get(absolute);
  if (!units) {
    units = collectUnits(JSON.parse(fs.readFileSync(file, 'utf8')));
    chapterCache.set(absolute, units);
  }
  const unit = units.find((candidate) => unitMatchesLocation(candidate, location));
  if (!unit) return null;
  const liveText = String(unit.unit[unit.key] || '');
  if (variantText(liveText) !== variantText(item.localRange.text || '')) return null;
  return unit;
}

function englishText(unit) {
  const parts = [];
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (typeof unit?.[key] === 'string') parts.push(unit[key]);
  }
  for (const translation of unit?.translations || []) {
    for (const key of ['literal', 'idiomatic', 'translation']) {
      if (typeof translation?.[key] === 'string') parts.push(translation[key]);
    }
  }
  return parts.join('\n').replace(/\s+/gu, ' ').trim();
}

function parseChineseNumber(text) {
  const value = normalizeWhitespace(text);
  if (value === '元') return 1;
  if (/^\d+$/u.test(value)) return Number(value);
  const digit = new Map([
    ['零', 0], ['〇', 0], ['○', 0],
    ['一', 1], ['二', 2], ['三', 3], ['四', 4], ['五', 5],
    ['六', 6], ['七', 7], ['八', 8], ['九', 9],
  ]);
  if (value === '十') return 10;
  if (value === '廿') return 20;
  if (value === '卅') return 30;
  if (value.startsWith('廿')) return 20 + (digit.get(value.slice(1)) || 0);
  if (value.startsWith('卅')) return 30 + (digit.get(value.slice(1)) || 0);
  const tenIndex = value.indexOf('十');
  if (tenIndex >= 0) {
    const before = value.slice(0, tenIndex);
    const after = value.slice(tenIndex + 1);
    const tens = before ? digit.get(before) : 1;
    const ones = after ? digit.get(after) : 0;
    if (tens !== undefined && ones !== undefined) return tens * 10 + ones;
  }
  return digit.get(value);
}

function parseDatePrefix(prefix) {
  const match = normalizeWhitespace(prefix).match(/^(\p{Script=Han}{1,6})(元|[一二三四五六七八九十廿卅0-9]+)年[，,、]?$/u);
  if (!match) return null;
  const era = match[1];
  if (!ERA_NAMES.has(era)) return null;
  const year = parseChineseNumber(match[2]);
  if (!Number.isInteger(year) || year < 1 || year > 30) return null;
  return { era, year };
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function englishHasDate(text, date) {
  const english = String(text || '').toLowerCase();
  if (!english) return false;

  const eraPattern = `(?:${(ERA_NAMES.get(date.era) || []).join('|')})`;
  const yearTerms = [
    ...(ORDINALS.get(date.year) || []),
    ...(CARDINALS.get(date.year) || []),
    String(date.year),
  ].map(escapeRegExp);
  const yearPattern = `(?:${yearTerms.join('|')})`;

  const patterns = [
    new RegExp(`\\b${yearPattern}\\s+year\\s+of\\s+(?:the\\s+)?${eraPattern}(?:\\s+(?:reign|era))?\\b`, 'iu'),
    new RegExp(`\\b${eraPattern}(?:\\s+(?:reign|era))?\\s*,?\\s+(?:year\\s+)?${yearPattern}\\b`, 'iu'),
  ];
  return patterns.some((pattern) => pattern.test(english));
}

function extractDatePrefixRepair(item) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type || '')) return null;
  if (statusOf(item) !== 'pending') return null;
  if (!item.sourceRange?.text || !item.localRange?.text) return null;

  const source = normalizeWhitespace(item.sourceRange.text || '');
  const local = normalizeWhitespace(item.localRange.text || '');
  if (!source || !local || variantText(source) === variantText(local)) return null;

  const sourceChars = [...source];
  for (let end = 2; end <= Math.min(DATE_PREFIX_MAX_CHARS, sourceChars.length - 1); end += 1) {
    const prefix = sourceChars.slice(0, end).join('');
    const date = parseDatePrefix(prefix);
    if (!date) continue;
    const rest = sourceChars.slice(end).join('');
    if (variantText(rest) !== variantText(local)) continue;
    return { prefix, date };
  }
  return null;
}

function itemMatches(item, queuePath, queueIndex) {
  const repair = extractDatePrefixRepair(item);
  if (!repair) return null;

  const unit = liveUnitForItem(item);
  if (!unit) return null;

  const english = englishText(unit.unit);
  if (!englishHasDate(english, repair.date)) return null;

  return {
    id: item.id,
    queueFile: path.relative(process.cwd(), queuePath),
    queueIndex,
    book: item.book,
    chapter: item.chapter,
    file: item.file,
    prefix: repair.prefix,
    date: repair.date,
    source: item.sourceRange.text,
    local: item.localRange.text,
    english: english.slice(0, 240),
  };
}

function packetPath(opts) {
  if (opts.packet) return path.resolve(opts.packet);
  fs.mkdirSync(opts.outDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[-:]/gu, '').replace(/\.\d{3}Z$/u, 'Z');
  return path.join(opts.outDir, `${timestamp}-verified-date-prefix-source-repairs.json`);
}

function writePacket(candidates, opts) {
  if (candidates.length === 0) return '';
  const target = packetPath(opts);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const packet = {
    schema: 'repair-decision-packet/v1',
    name: path.basename(target, '.json'),
    generatedAt: new Date().toISOString(),
    scope: { class: 'verified-date-prefix-source-repair' },
    defaultDecision: 'approve',
    defaultNotes: 'Approved source repair: upstream restores a leading regnal-year prefix already present in the existing English translation.',
    defaultPreserveExistingTranslations: true,
    defaultTranslationReviewNote: 'Existing English translation already includes the restored upstream regnal date; retained.',
    items: candidates.map((candidate) => ({
      id: candidate.id,
      queueFile: candidate.queueFile,
      queueIndex: candidate.queueIndex,
      book: candidate.book,
      chapter: candidate.chapter,
      decision: 'approve',
      preserveExistingTranslations: true,
      translationReviewNote: 'Existing English translation already includes the restored upstream regnal date; retained.',
      notes: `Verified date prefix ${JSON.stringify(candidate.prefix)} against existing English.`,
      source: candidate.source,
      local: candidate.local,
      english: candidate.english,
    })),
  };
  fs.writeFileSync(target, `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  return target;
}

function summarize(candidates, packet) {
  const byBook = {};
  const byQueue = {};
  for (const candidate of candidates) {
    byBook[candidate.book] = (byBook[candidate.book] || 0) + 1;
    byQueue[candidate.queueFile] = (byQueue[candidate.queueFile] || 0) + 1;
  }
  return {
    total: candidates.length,
    packet: packet ? path.relative(process.cwd(), packet) : '',
    byBook,
    byQueue,
    samples: candidates,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queuePaths = opts.queues.length > 0 ? opts.queues.map((queue) => path.resolve(queue)) : defaultQueues();
  const candidates = [];

  for (const queuePath of queuePaths) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const [queueIndex, item] of (queue.items || []).entries()) {
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const candidate = itemMatches(item, queuePath, queueIndex);
      if (!candidate) continue;
      candidates.push(candidate);
      if (opts.limit > 0 && candidates.length >= opts.limit) break;
    }
    if (opts.limit > 0 && candidates.length >= opts.limit) break;
  }

  const packet = writePacket(candidates, opts);
  const summary = summarize(candidates, packet);
  summary.samples = summary.samples.slice(0, opts.sample);

  if (opts.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`Selected ${summary.total} verified date-prefix source repair(s).`);
  if (summary.packet) console.log(`Wrote packet: ${summary.packet}`);
  for (const [book, count] of Object.entries(summary.byBook)) console.log(`${book}: ${count}`);
  for (const sample of summary.samples) {
    console.log(`\n${sample.id} (${sample.book}/${sample.chapter}) ${sample.prefix}`);
    console.log(`  source: ${sample.source}`);
    console.log(`  local:  ${sample.local}`);
    console.log(`  english: ${sample.english}`);
  }
}

main();
