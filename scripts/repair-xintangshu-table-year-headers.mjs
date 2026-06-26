#!/usr/bin/env node
/**
 * Insert missing year/reign-year row headers in New Tang History table chapters.
 *
 * This intentionally handles only the narrow, single-header rows from the
 * Xintangshu chancellor tables. Later table chapters can bundle multiple row
 * labels and event cells in one queue item; those need a fuller table parser.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUEUE_FILE = path.join(DATA_DIR, 'quality/source-correspondence-corpus-wikisource-xintangshu.json');
const DEFAULT_REVIEWER = 'repair-xintangshu-table-year-headers';
const DEFAULT_CHAPTERS = new Set(Array.from({ length: 15 }, (_, index) => String(index + 61).padStart(3, '0')));
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const ERA_NAMES = new Map([
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
]);

const ERA_ALT = [...ERA_NAMES.keys()].sort((a, b) => b.length - a.length).join('|');
const CN_NUM = '[元一二三四五六七八九十百廿卅]+';
const CYCLE_RE = /([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])$/u;
const YEAR_LABEL_RE = new RegExp(`^(?:(?<era>${ERA_ALT}))?(?<year>${CN_NUM})(?<unit>[年載])(?<cycle>[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?$`, 'u');

const STEMS = new Map([
  ['甲', 'jia'], ['乙', 'yi'], ['丙', 'bing'], ['丁', 'ding'], ['戊', 'wu'],
  ['己', 'ji'], ['庚', 'geng'], ['辛', 'xin'], ['壬', 'ren'], ['癸', 'gui'],
]);
const BRANCHES = new Map([
  ['子', 'zi'], ['丑', 'chou'], ['寅', 'yin'], ['卯', 'mao'], ['辰', 'chen'], ['巳', 'si'],
  ['午', 'wu'], ['未', 'wei'], ['申', 'shen'], ['酉', 'you'], ['戌', 'xu'], ['亥', 'hai'],
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-xintangshu-table-year-headers.mjs [--apply]
    [--chapter CHAPTER] [--queue PATH] [--limit N] [--reviewer NAME]

Dry-run by default. This repairs only simple, one-header raw Wikisource table
spans in Xintangshu chapters 061-063.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    chapters: new Set(DEFAULT_CHAPTERS),
    explicitChapters: false,
    queue: QUEUE_FILE,
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
    if (arg === '--chapter') {
      if (!opts.explicitChapters) {
        opts.chapters = new Set();
        opts.explicitChapters = true;
      }
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      if (!opts.explicitChapters) {
        opts.chapters = new Set();
        opts.explicitChapters = true;
      }
      opts.chapters.add(arg.slice('--chapter='.length));
      continue;
    }
    if (arg === '--queue') {
      opts.queue = argv[++i] || QUEUE_FILE;
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length) || QUEUE_FILE;
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

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function sourceKey(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function unitText(unit) {
  const key = sourceKey(unit);
  return key ? String(unit[key] || '') : '';
}

function normalize(text) {
  return String(text || '').replace(/\s+/g, '').normalize('NFKC');
}

function rawTableTokens(source) {
  return String(source || '')
    .replace(/[A-Za-z]+="[^"]*"/gu, '|')
    .replace(/[{}!]/gu, '|')
    .split('|')
    .map((token) => token.replace(/\s+/gu, '').trim())
    .filter(Boolean)
    .filter((token) => !/^[|\-]+$/u.test(token));
}

function parseHeader(source) {
  const tokens = rawTableTokens(source);
  if (tokens.length !== 2) return null;
  const [ce, label] = tokens;
  if (!/^\d{3,4}$/u.test(ce)) return null;
  const parsedLabel = parseYearLabel(label);
  if (!parsedLabel) return null;
  return {
    ce,
    label,
    zh: `${ce} ${label}`,
    translation: translateHeader(ce, parsedLabel),
  };
}

function parseHeaderSequence(source) {
  const tokens = rawTableTokens(source);
  const consumed = new Set();
  const headers = [];
  let firstHeaderIndex = Infinity;

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const ce = tokens[index];
    const label = tokens[index + 1];
    if (!/^\d{3,4}$/u.test(ce)) continue;
    const parsedLabel = parseYearLabel(label);
    if (!parsedLabel) continue;
    headers.push({
      tokenIndex: index,
      ce,
      label,
      zh: `${ce} ${label}`,
      translation: translateHeader(ce, parsedLabel),
    });
    consumed.add(index);
    consumed.add(index + 1);
    firstHeaderIndex = Math.min(firstHeaderIndex, index);
    index += 1;
  }

  if (headers.length === 0) return null;
  const bodyTokens = tokens
    .map((token, tokenIndex) => ({ token, tokenIndex }))
    .filter(({ tokenIndex }) => tokenIndex > firstHeaderIndex && !consumed.has(tokenIndex));

  return { headers, bodyTokens };
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

function parseCycle(cycle) {
  if (!cycle) return null;
  return `${STEMS.get(cycle[0]) || cycle[0]}${BRANCHES.get(cycle[1]) || cycle[1]}`;
}

function parseYearLabel(label) {
  const match = String(label || '').match(YEAR_LABEL_RE);
  if (!match) return null;
  const year = parseChineseInteger(match.groups.year);
  if (!year) return null;
  return {
    era: match.groups.era || '',
    eraEnglish: match.groups.era ? ERA_NAMES.get(match.groups.era) : '',
    year,
    unit: match.groups.unit,
    cycle: match.groups.cycle || '',
  };
}

function translateHeader(ce, parsed) {
  const yearPhrase = `${ordinal(parsed.year)} year`;
  const reign = parsed.eraEnglish ? ` of the ${parsed.eraEnglish} reign` : '';
  const cycle = parseCycle(parsed.cycle);
  const cyclePhrase = cycle ? `, ${cycle} year` : '';
  return `${ce} CE, ${yearPhrase}${reign}${cyclePhrase}.`;
}

function collectUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const [collectionName, kind] of [['sentences', 'sentence'], ['cells', 'cell']]) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        const field = sourceKey(unit);
        if (!field) continue;
        units.push({
          blockIndex,
          unitIndex,
          kind,
          id: unit.id || '',
          text: String(unit[field] || ''),
        });
      }
    }
  }
  return units;
}

function maxSentenceNumber(chapter) {
  let max = 0;
  for (const block of chapter.content || []) {
    for (const collection of [block.sentences || [], block.cells || []]) {
      for (const unit of collection) {
        const match = String(unit.id || '').match(/^s(\d+)$/u);
        if (match) max = Math.max(max, Number(match[1]));
      }
    }
  }
  return max;
}

function makeId(state) {
  state.nextId += 1;
  return `s${String(state.nextId).padStart(4, '0')}`;
}

function fullTextKey(chapter) {
  return normalize(collectUnits(chapter).map((unit) => unit.text).join(''));
}

function locateInsertionBlock(chapter, item) {
  const units = collectUnits(chapter);
  const before = normalize(item.context?.beforeLocal || '');
  const after = normalize(item.context?.afterLocal || '');

  if (after) {
    const matches = units
      .map((unit) => ({ unit, key: normalize(unit.text) }))
      .filter(({ key }) => key === after);
    if (matches.length === 1) return matches[0].unit.blockIndex;
    if (matches.length > 1 && before) {
      const beforeMatches = units
        .map((unit, index) => ({ unit, index, key: normalize(unit.text) }))
        .filter(({ key }) => key === before);
      for (const beforeMatch of beforeMatches) {
        const next = matches.find(({ unit }) => unit.blockIndex > beforeMatch.unit.blockIndex);
        if (next) return next.unit.blockIndex;
      }
    }
  }

  if (before) {
    const matches = units
      .map((unit) => ({ unit, key: normalize(unit.text) }))
      .filter(({ key }) => key === before);
    if (matches.length === 1) return matches[0].unit.blockIndex + 1;
  }

  return null;
}

function locateLocalBlock(chapter, item) {
  const ids = item.localRange?.ids || [];
  if (!ids.length) return null;
  const wanted = new Set(ids);
  const units = collectUnits(chapter);
  const matches = units.filter((unit) => wanted.has(unit.id));
  if (matches.length === 0) return null;
  return Math.min(...matches.map((unit) => unit.blockIndex));
}

const chapterCache = new Map();

function loadChapter(chapterId) {
  if (!chapterCache.has(chapterId)) {
    const file = path.join(DATA_DIR, 'xintangshu', `${chapterId}.json`);
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    chapterCache.set(chapterId, {
      file,
      chapter,
      changed: false,
      nextId: maxSentenceNumber(chapter),
      inserted: 0,
    });
  }
  return chapterCache.get(chapterId);
}

function createHeaderBlock(id, header) {
  return {
    type: 'paragraph',
    sentences: [
      {
        id,
        zh: header.zh,
        translations: [
          {
            lang: 'en',
            literal: header.translation,
            idiomatic: header.translation,
            translator: TRANSLATOR,
            model: MODEL,
          },
        ],
      },
    ],
  };
}

function updateMeta(record) {
  const { chapter } = record;
  let sentenceCount = 0;
  for (const block of chapter.content || []) {
    sentenceCount += (block.sentences || []).length + (block.cells || []).length;
  }
  chapter.meta = chapter.meta || {};
  chapter.meta.sentenceCount = sentenceCount;
  chapter.meta.translatedCount = sentenceCount;
  if (Array.isArray(chapter.meta.translators) && chapter.meta.translators[0]) {
    chapter.meta.translators[0].paragraphs = (chapter.content || []).length;
    chapter.meta.translators[0].sentences = sentenceCount;
  }
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function markApplied(item, now, reviewer, header, id) {
  item.status = 'applied';
  item.decision = 'included';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.appliedAt = now;
  item.appliedSummary = {
    mode: 'xintangshu-table-year-header-insertion',
    insertedId: id,
    zh: header.zh,
  };
  item.notes = appendNote(
    item.notes,
    'Inserted missing cleaned table year header from raw Wikisource table markup and supplied the matching English date translation.',
  );
}

function markAppliedMany(item, now, reviewer, inserted) {
  item.status = 'applied';
  item.decision = 'included';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.appliedAt = now;
  item.appliedSummary = {
    mode: 'xintangshu-table-year-header-sequence-insertion',
    inserted: inserted.map(({ id, header }) => ({
      id,
      zh: header.zh,
    })),
  };
  item.notes = appendNote(
    item.notes,
    'Inserted missing cleaned table year headers from raw Wikisource table markup and supplied matching English date translations.',
  );
}

function classifyItem(item, opts) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'xintangshu' || !opts.chapters.has(item.chapter)) return null;
  const source = item.sourceRange?.text || '';
  if (!/(?:ALIGN|VALIGN|HEIGHT)/u.test(source)) return null;
  if (normalize(item.localRange?.text || '')) return null;
  const header = parseHeader(source);
  if (!header) return null;
  const record = loadChapter(item.chapter);
  if (fullTextKey(record.chapter).includes(normalize(header.zh))) return null;
  const blockIndex = locateInsertionBlock(record.chapter, item);
  if (blockIndex == null) return null;
  return { item, record, header, blockIndex };
}

function classifySequenceItem(item, opts) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'xintangshu' || !opts.chapters.has(item.chapter)) return null;
  const source = item.sourceRange?.text || '';
  if (!/(?:ALIGN|VALIGN|HEIGHT)/u.test(source)) return null;

  const sequence = parseHeaderSequence(source);
  if (!sequence || sequence.headers.length === 0) return null;

  const record = loadChapter(item.chapter);
  const chapterKey = fullTextKey(record.chapter);
  const missingHeaders = sequence.headers.filter((header) => !chapterKey.includes(normalize(header.zh)));
  if (missingHeaders.length === 0) return null;

  const localText = normalize(item.localRange?.text || '');
  const bodyTokens = sequence.bodyTokens
    .map(({ token, tokenIndex }) => ({ token, tokenIndex, key: normalize(token) }))
    .filter(({ key }) => key);

  let localBlockIndex = null;
  let localTokenIndex = null;
  if (localText) {
    const localMatch = bodyTokens.find(({ key }) => key === localText);
    if (!localMatch) return null;
    localTokenIndex = localMatch.tokenIndex;
    localBlockIndex = locateLocalBlock(record.chapter, item);
    if (localBlockIndex == null) return null;
  } else if (bodyTokens.length > 0) {
    return null;
  }

  const afterBlockIndex = locateInsertionBlock(record.chapter, item);
  const insertions = [];
  for (const header of missingHeaders) {
    let blockIndex = afterBlockIndex;
    if (localText && localTokenIndex != null && header.tokenIndex < localTokenIndex) {
      blockIndex = localBlockIndex;
    }
    if (blockIndex == null) return null;
    insertions.push({
      header,
      blockIndex,
    });
  }

  return insertions.length > 0 ? { item, record, insertions } : null;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    insertedHeaders: 0,
    touchedChapterFiles: 0,
    touchedQueueFiles: 0,
    byChapter: {},
    samples: [],
    skippedAfterLimit: 0,
  };

  let queueChanged = false;
  for (const item of queue.items || []) {
    if (summary.repaired >= opts.limit) {
      summary.skippedAfterLimit += 1;
      continue;
    }
    const singleRepair = classifyItem(item, opts);
    const sequenceRepair = singleRepair ? null : classifySequenceItem(item, opts);
    if (!singleRepair && !sequenceRepair) continue;

    summary.repaired += 1;
    summary.byChapter[item.chapter] = (summary.byChapter[item.chapter] || 0) + 1;
    if (singleRepair) {
      summary.insertedHeaders += 1;
      const nextId = `s${String(singleRepair.record.nextId + 1).padStart(4, '0')}`;
      if (summary.samples.length < 20) {
        summary.samples.push({
          id: item.id,
          chapter: item.chapter,
          insertedId: nextId,
          before: item.context?.beforeLocal || '',
          zh: singleRepair.header.zh,
          translation: singleRepair.header.translation,
          after: item.context?.afterLocal || '',
        });
      }

      if (!opts.apply) continue;
      const id = makeId(singleRepair.record);
      singleRepair.record.chapter.content.splice(singleRepair.blockIndex, 0, createHeaderBlock(id, singleRepair.header));
      singleRepair.record.changed = true;
      singleRepair.record.inserted += 1;
      markApplied(item, now, opts.reviewer, singleRepair.header, id);
      queueChanged = true;
      continue;
    }

    summary.insertedHeaders += sequenceRepair.insertions.length;
    if (summary.samples.length < 20) {
      let nextIdNumber = sequenceRepair.record.nextId;
      summary.samples.push({
        id: item.id,
        chapter: item.chapter,
        inserted: sequenceRepair.insertions.map(({ header, blockIndex }) => {
          nextIdNumber += 1;
          return {
            insertedId: `s${String(nextIdNumber).padStart(4, '0')}`,
            blockIndex,
            zh: header.zh,
            translation: header.translation,
          };
        }),
        before: item.context?.beforeLocal || '',
        local: item.localRange?.text || '',
        after: item.context?.afterLocal || '',
      });
    }

    if (!opts.apply) continue;
    const inserted = [];
    let offset = 0;
    for (const insertion of sequenceRepair.insertions.sort((a, b) => a.blockIndex - b.blockIndex)) {
      const id = makeId(sequenceRepair.record);
      const blockIndex = insertion.blockIndex + offset;
      sequenceRepair.record.chapter.content.splice(blockIndex, 0, createHeaderBlock(id, insertion.header));
      inserted.push({ id, header: insertion.header });
      offset += 1;
    }
    sequenceRepair.record.changed = true;
    sequenceRepair.record.inserted += sequenceRepair.insertions.length;
    markAppliedMany(item, now, opts.reviewer, inserted);
    queueChanged = true;
  }

  if (opts.apply) {
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      updateMeta(record);
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
    if (queueChanged) {
      queue.updatedAt = now;
      fs.writeFileSync(opts.queue, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles = 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
