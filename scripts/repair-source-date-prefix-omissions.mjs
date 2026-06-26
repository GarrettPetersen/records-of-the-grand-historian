#!/usr/bin/env node
/**
 * Repair exact source-correspondence items where Wikisource has a reign-year
 * prefix that the local corpus dropped from one paragraph sentence.
 *
 * This is intentionally narrow:
 * - one local paragraph sentence only;
 * - upstream text must equal Chinese date prefix + current local source text;
 * - the prefix must be an explicit, mapped reign year;
 * - existing English is updated by prepending the same date phrase.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const DEFAULT_REVIEWER = 'repair-source-date-prefix-omissions';

const ERA_NAMES = new Map([
  ['中大通', 'Zhong Datong'],
  ['中平', 'Zhongping'],
  ['建元', 'Jianyuan'],
  ['元封', 'Yuanfeng'],
  ['元嘉', 'Yuanjia'],
  ['嘉平', 'Jiaping'],
  ['景初', 'Jingchu'],
  ['正始', 'Zhengshi'],
  ['景元', 'Jingyuan'],
  ['咸熙', 'Xianxi'],
  ['青龍', 'Qinglong'],
  ['泰始', 'Taishi'],
  ['咸寧', 'Xianning'],
  ['太康', 'Taikang'],
  ['太熙', 'Taixi'],
  ['元康', 'Yuankang'],
  ['永康', 'Yongkang'],
  ['永寧', 'Yongning'],
  ['永甯', 'Yongning'],
  ['太安', "Tai'an"],
  ['永安', "Yong'an"],
  ['永興', 'Yongxing'],
  ['光熙', 'Guangxi'],
  ['永嘉', 'Yongjia'],
  ['建興', 'Jianxing'],
  ['太興', 'Taixing'],
  ['太寧', 'Taining'],
  ['咸和', 'Xianhe'],
  ['咸康', 'Xiankang'],
  ['永和', 'Yonghe'],
  ['升平', 'Shengping'],
  ['昇平', 'Shengping'],
  ['興寧', 'Xingning'],
  ['興甯', 'Xingning'],
  ['寧康', 'Ningkang'],
  ['太元', 'Taiyuan'],
  ['隆安', "Long'an"],
  ['元興', 'Yuanxing'],
  ['義熙', 'Yixi'],
  ['建安', "Jian'an"],
  ['天紀', 'Tianji'],
  ['永明', 'Yongming'],
  ['隆昌', 'Longchang'],
  ['延興', 'Yanxing'],
  ['建武', 'Jianwu'],
  ['永泰', 'Yongtai'],
  ['中興', 'Zhongxing'],
  ['元徽', 'Yuanhui'],
  ['大明', 'Daming'],
  ['泰豫', 'Taiyu'],
  ['景和', 'Jinghe'],
  ['昇明', 'Shengming'],
  ['永元', 'Yongyuan'],
  ['承聖', 'Chengsheng'],
  ['大同', 'Datong'],
  ['天保', 'Tianbao'],
  ['乾明', 'Qianming'],
  ['武泰', 'Wutai'],
  ['普泰', 'Putai'],
  ['興和', 'Xinghe'],
  ['皇建', 'Huangjian'],
  ['皇始', 'Huangshi'],
  ['神瑞', 'Shenrui'],
  ['正平', 'Zhengping'],
  ['武定', 'Wuding'],
  ['武平', 'Wuping'],
  ['建德', 'Jiande'],
  ['宣政', 'Xuanzheng'],
  ['禎明', 'Zhenming'],
  ['開皇', 'Kaihuang'],
  ['仁壽', 'Renshou'],
  ['大業', 'Daye'],
  ['武德', 'Wude'],
  ['貞觀', 'Zhenguan'],
  ['永徽', 'Yonghui'],
  ['顯慶', 'Xianqing'],
  ['龍朔', 'Longshuo'],
  ['麟德', 'Linde'],
  ['乾封', 'Qianfeng'],
  ['總章', 'Zongzhang'],
  ['咸亨', 'Xianheng'],
  ['上元', 'Shangyuan'],
  ['儀鳳', 'Yifeng'],
  ['調露', 'Tiaolu'],
  ['永隆', 'Yonglong'],
  ['開耀', 'Kaiyao'],
  ['永淳', 'Yongchun'],
  ['弘道', 'Hongdao'],
  ['文明', 'Wenming'],
  ['光宅', 'Guangzhai'],
  ['垂拱', 'Chuigong'],
  ['永昌', 'Yongchang'],
  ['載初', 'Zaichu'],
  ['天授', 'Tianshou'],
  ['如意', 'Ruyi'],
  ['長壽', 'Changshou'],
  ['延載', 'Yanzai'],
  ['證聖', 'Zhengsheng'],
  ['天冊萬歲', 'Tiance Wansui'],
  ['萬歲登封', 'Wansui Dengfeng'],
  ['萬歲通天', 'Wansui Tongtian'],
  ['神功', 'Shengong'],
  ['聖曆', 'Shengli'],
  ['久視', 'Jiushi'],
  ['大足', 'Dazu'],
  ['長安', "Chang'an"],
  ['神龍', 'Shenlong'],
  ['景龍', 'Jinglong'],
  ['唐隆', 'Tanglong'],
  ['景雲', 'Jingyun'],
  ['太極', 'Taiji'],
  ['延和', 'Yanhe'],
  ['先天', 'Xiantian'],
  ['開元', 'Kaiyuan'],
  ['天寶', 'Tianbao'],
  ['至德', 'Zhide'],
  ['乾元', 'Qianyuan'],
  ['寶應', 'Baoying'],
  ['廣德', 'Guangde'],
  ['永泰', 'Yongtai'],
  ['大曆', 'Dali'],
  ['大歷', 'Dali'],
  ['建中', 'Jianzhong'],
  ['興元', 'Xingyuan'],
  ['貞元', 'Zhenyuan'],
  ['永貞', 'Yongzhen'],
  ['元和', 'Yuanhe'],
  ['長慶', 'Changqing'],
  ['寶曆', 'Baoli'],
  ['大和', 'Dahe'],
  ['太和', 'Taihe'],
  ['開成', 'Kaicheng'],
  ['會昌', 'Huichang'],
  ['大中', 'Dazhong'],
  ['咸通', 'Xiantong'],
  ['乾符', 'Qianfu'],
  ['廣明', 'Guangming'],
  ['中和', 'Zhonghe'],
  ['光啟', 'Guangqi'],
  ['文德', 'Wende'],
  ['龍紀', 'Longji'],
  ['大順', 'Dashun'],
  ['景福', 'Jingfu'],
  ['乾寧', 'Qianning'],
  ['光化', 'Guanghua'],
  ['天復', 'Tianfu'],
  ['天祐', 'Tianyou'],
  ['天命', 'Tianming'],
  ['天聰', 'Tiancong'],
  ['崇德', 'Chongde'],
  ['順治', 'Shunzhi'],
  ['康熙', 'Kangxi'],
  ['雍正', 'Yongzheng'],
  ['乾隆', 'Qianlong'],
  ['嘉慶', 'Jiaqing'],
  ['道光', 'Daoguang'],
  ['咸豐', 'Xianfeng'],
  ['同治', 'Tongzhi'],
  ['光緒', 'Guangxu'],
  ['宣統', 'Xuantong'],
  ['建文', 'Jianwen'],
  ['崇禎', 'Chongzhen'],
]);

const ERA_ALT = [...ERA_NAMES.keys()].sort((a, b) => b.length - a.length).join('|');
const ERA_EN_ALT = [...new Set(ERA_NAMES.values())]
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'))
  .join('|');
const CN_NUM = '[元一二三四五六七八九十百廿卅]+';
const DATE_PREFIX_RE = new RegExp(`^(${ERA_ALT})(${CN_NUM})(?:年|載)[，,]?$`, 'u');

function usage() {
  console.error(`Usage:
  node scripts/repair-source-date-prefix-omissions.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, prepends exact mapped reign-year prefixes to
matching Chinese source sentences, updates the first English translation object,
and marks the queue item applied/included.`);
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
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
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
  if (opts.queues.length > 0) return opts.queues;
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
  if (status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function itemFile(item) {
  return item.file || path.join('data', item.book, `${item.chapter}.json`);
}

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, '');
}

function hasTableLocation(item) {
  return [...(item.localRange?.locations || []), ...(item.sourceRange?.locations || [])]
    .some((location) => String(location.blockType || '').startsWith('table') || location.kind === 'cell');
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function flattenUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          unit,
          field,
          id: unit.id || '',
          blockIndex,
          blockType: block.type || '',
          unitIndex,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const abs = path.resolve(file);
  if (!chapterCache.has(abs)) {
    const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(abs, {
      file: abs,
      chapter,
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(abs);
}

function parseChineseInteger(text) {
  if (text === '元') return 1;
  const digits = new Map([
    ['零', 0], ['〇', 0], ['一', 1], ['二', 2], ['三', 3], ['四', 4], ['五', 5],
    ['六', 6], ['七', 7], ['八', 8], ['九', 9],
  ]);
  if (text === '十') return 10;
  if (text.startsWith('廿')) return 20 + (digits.get(text[1]) || 0);
  if (text.startsWith('卅')) return 30 + (digits.get(text[1]) || 0);
  const tenIndex = text.indexOf('十');
  if (tenIndex !== -1) {
    const before = text.slice(0, tenIndex);
    const after = text.slice(tenIndex + 1);
    const tens = before ? digits.get(before) : 1;
    const ones = after ? digits.get(after) : 0;
    if (tens != null && ones != null) return tens * 10 + ones;
  }
  if (digits.has(text)) return digits.get(text);
  return null;
}

function ordinal(number) {
  const special = new Map([
    [1, 'first'], [2, 'second'], [3, 'third'], [4, 'fourth'], [5, 'fifth'],
    [6, 'sixth'], [7, 'seventh'], [8, 'eighth'], [9, 'ninth'], [10, 'tenth'],
    [11, 'eleventh'], [12, 'twelfth'], [13, 'thirteenth'], [14, 'fourteenth'],
    [15, 'fifteenth'], [16, 'sixteenth'], [17, 'seventeenth'], [18, 'eighteenth'],
    [19, 'nineteenth'], [20, 'twentieth'], [30, 'thirtieth'],
  ]);
  if (special.has(number)) return special.get(number);
  const tens = Math.floor(number / 10) * 10;
  const ones = number % 10;
  const tensWord = new Map([[20, 'twenty'], [30, 'thirty'], [40, 'forty'], [50, 'fifty'], [60, 'sixty'], [70, 'seventy'], [80, 'eighty'], [90, 'ninety']]).get(tens);
  if (tensWord && special.has(ones)) return `${tensWord}-${special.get(ones)}`;
  return String(number);
}

function parseDatePrefix(prefix) {
  const match = String(prefix || '').match(DATE_PREFIX_RE);
  if (!match) return null;
  const era = ERA_NAMES.get(match[1]);
  const year = parseChineseInteger(match[2]);
  if (!era || !year) return null;
  return {
    zh: prefix,
    english: `In the ${ordinal(year)} year of ${era}`,
  };
}

function lowerContinuationLead(text) {
  return text.replace(
    /^(In|On|At|During|For|When|Soon|That|This|It|Its|He|His|She|Her|They|Their|The|A|An|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Field|Fire)\b/u,
    (match) => match.toLowerCase(),
  );
}

function cleanContinuation(text) {
  return String(text || '')
    .trim()
    .replace(/^[\-–—]+\s*/u, '')
    .replace(/^and\s+/iu, '')
    .replace(/^(?:in\s+)?that\s+same\s+year,?\s+/iu, '')
    .replace(/^that\s+year,?\s+/iu, '');
}

function tidyEnglishPunctuation(text) {
  return String(text || '')
    .replace(/\s+([,.;:!?])/gu, '$1')
    .replace(/,\s*,/gu, ',')
    .replace(/;\./gu, '.')
    .replace(/,\./gu, '.')
    .replace(/:\./gu, '.')
    .replace(/!\./gu, '!')
    .replace(/\?\./gu, '?');
}

function prependEnglishDate(existing, datePhrase) {
  const cleaned = cleanContinuation(existing);
  if (!cleaned) return '';
  if (cleaned.startsWith(`${datePhrase},`)) return tidyEnglishPunctuation(cleaned);
  const replacedDate = replaceLeadingEnglishDate(cleaned, datePhrase);
  if (replacedDate) return replacedDate;
  return tidyEnglishPunctuation(`${datePhrase}, ${lowerContinuationLead(cleaned)}`);
}

function firstTranslation(unit) {
  if (Array.isArray(unit.translations) && unit.translations[0]) return unit.translations[0];
  return null;
}

const ENGLISH_ORDINAL_LEAD = '(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty[- ]first|twenty[- ]second|twenty[- ]third|twenty[- ]fourth|twenty[- ]fifth|twenty[- ]sixth|twenty[- ]seventh|twenty[- ]eighth|twenty[- ]ninth|thirtieth|\\d+(?:st|nd|rd|th))';
const EXPLICIT_ENGLISH_REIGN_YEAR_RE = new RegExp(
  `^(?:In|During)\\s+(?:the\\s+)?${ENGLISH_ORDINAL_LEAD}\\s+year\\s+of\\s+(?:${ERA_EN_ALT})\\b,?\\s*`,
  'iu',
);
const GENERIC_ENGLISH_YEAR_RE = new RegExp(
  `^(?:In|During)\\s+(?:the\\s+)?${ENGLISH_ORDINAL_LEAD}\\s+year\\b,?\\s*`,
  'iu',
);

function replaceLeadingEnglishDate(text, datePhrase) {
  const match = text.match(EXPLICIT_ENGLISH_REIGN_YEAR_RE) || text.match(GENERIC_ENGLISH_YEAR_RE);
  if (!match) return null;
  const rest = cleanContinuation(text.slice(match[0].length));
  if (!rest) return `${datePhrase}.`;
  return tidyEnglishPunctuation(`${datePhrase}, ${lowerContinuationLead(rest)}`);
}

function startsWithExplicitEnglishDate(text) {
  const cleaned = cleanContinuation(text);
  const explicitDate = new RegExp(`^(?:In|During)\\s+(?:the\\s+)?(?:[^,.]{1,80}\\byear\\s+of\\b|${ENGLISH_ORDINAL_LEAD}\\s+year\\b)`, 'iu');
  return explicitDate.test(cleaned);
}

function classifyItem(item) {
  if (statusOf(item) !== 'pending') return null;
  if (hasTableLocation(item)) return null;
  if ((item.localRange?.ids || []).length !== 1) return null;
  const location = item.localRange?.locations?.[0];
  if (!location || location.blockType !== 'paragraph' || location.kind !== 'sentence') return null;

  const source = normalizeText(item.sourceRange?.text);
  const local = normalizeText(item.localRange?.text);
  if (!source || !local || source === local || !source.endsWith(local)) return null;

  const prefix = source.slice(0, source.length - local.length);
  if (/[0-9A-Za-z_<>|=]/u.test(prefix)) return null;
  const parsedPrefix = parseDatePrefix(prefix);
  if (!parsedPrefix) return null;

  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;
  const chapterRecord = loadChapter(file);
  const entry = chapterRecord.byId.get(item.localRange.ids[0]);
  if (!entry) return null;
  if (entry.blockType !== 'paragraph') return null;
  if (normalizeText(entry.unit[entry.field]) !== local) return null;

  const translation = firstTranslation(entry.unit);
  if (!translation || !String(translation.literal || '').trim() || !String(translation.idiomatic || '').trim()) return null;

  return {
    item,
    chapterRecord,
    entry,
    prefix: parsedPrefix,
    sourceText: item.sourceRange.text,
    localText: entry.unit[entry.field],
    nextLiteral: prependEnglishDate(translation.literal, parsedPrefix.english),
    nextIdiomatic: prependEnglishDate(translation.idiomatic, parsedPrefix.english),
  };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function applyRepair(repair, now, reviewer) {
  const translation = firstTranslation(repair.entry.unit);
  repair.entry.unit[repair.entry.field] = repair.sourceText;
  translation.literal = repair.nextLiteral;
  translation.idiomatic = repair.nextIdiomatic;
  repair.chapterRecord.changed = true;

  repair.item.status = 'applied';
  repair.item.decision = 'included';
  repair.item.reviewedAt = repair.item.reviewedAt || now;
  repair.item.reviewer = repair.item.reviewer || reviewer;
  repair.item.appliedAt = now;
  repair.item.appliedSummary = {
    mode: 'date-prefix-source-repair',
    prefix: repair.prefix.zh,
    localId: repair.entry.id,
  };
  repair.item.notes = appendNote(
    repair.item.notes,
    'Applied exact upstream reign-year prefix to local source and prepended the corresponding English date phrase.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    touchedQueueFiles: 0,
    touchedChapterFiles: 0,
    byBook: {},
    byPrefix: {},
    samples: [],
    skippedAfterLimit: 0,
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changedQueue = false;
    for (const item of queue.items || []) {
      if (summary.repaired >= opts.limit) {
        summary.skippedAfterLimit += 1;
        continue;
      }
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      const repair = classifyItem(item);
      if (!repair) continue;

      summary.repaired += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      summary.byPrefix[repair.prefix.zh] = (summary.byPrefix[repair.prefix.zh] || 0) + 1;
      if (summary.samples.length < 20) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          localId: repair.entry.id,
          prefix: repair.prefix.zh,
          zhBefore: repair.localText,
          zhAfter: repair.sourceText,
          literalAfter: repair.nextLiteral,
          idiomaticAfter: repair.nextIdiomatic,
        });
      }

      if (!opts.apply) continue;
      applyRepair(repair, now, opts.reviewer);
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
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
