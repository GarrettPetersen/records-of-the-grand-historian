#!/usr/bin/env node
/**
 * Close queue items where the raw Wikisource witness is visibly less complete
 * than the current local corpus, while the upstream Han/digit sequence is still
 * contained in the fuller local text.
 *
 * This is a no-edit resolver: it only rejects the upstream delta and records
 * why the local text was retained. It deliberately skips local note markers,
 * edition brackets, component placeholders, and table/HTML residue so those
 * can remain repair items instead of being hidden by a broad containment rule.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-wikisource-local-fuller-noops';
const SOURCE_TYPES = new Set([
  'local_extra_candidate',
  'text_discrepancy_candidate',
  'source_replacement_candidate',
]);

const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const CN_NUM = '元一二三四五六七八九十百千万萬廿卅卌兩二〇零';
const DATE_DETAIL_RE = new RegExp(
  `^(?:[\\p{Script=Han}]{0,10}[${CN_NUM}]+[年載]|[${CN_NUM}]+[年載月日]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|[春夏秋冬]|[\\p{Script=Han}]{1,6}(?:元年|[一二三四五六七八九十]+年))$`,
  'u',
);
const ERA_NAME_RE = /^(?:建元|元光|元朔|元狩|元鼎|元封|太初|天漢|太始|征和|後元|始元|元鳳|元平|本始|地節|元康|神爵|五鳳|甘露|黃龍|初元|永光|建昭|竟寧|建始|河平|陽朔|鴻嘉|永始|元延|綏和|建平|元壽|黃初|太和|青龍|景初|正始|嘉平|甘露|景元|咸熙|泰始|咸寧|太康|太熙|永熙|永平|元康|永康|永寧|太安|永安|建武|永昌|太興|永嘉|建興|咸和|咸康|建元|永和|升平|隆和|興寧|太元|寧康|隆安|元興|義熙|元熙|武德|貞觀|永徽|顯慶|龍朔|麟德|乾封|總章|咸亨|上元|儀鳳|調露|永隆|開耀|永淳|弘道|文明|光宅|垂拱|永昌|載初|天授|如意|長壽|延載|證聖|神功|聖曆|久視|大足|長安|神龍|景龍|唐隆|景雲|太極|延和|先天|開元|天寶|至德|乾元|寶應|廣德|永泰|大曆|建中|興元|貞元|永貞|元和|長慶|寶曆|大和|太和|開成|會昌|大中|咸通|乾符|廣明|中和|光啟|文德|龍紀|大順|景福|乾寧|光化|天復|天祐|天會|天眷|皇統|大定|明昌|承安|泰和|貞祐|興定|元光|正大|開興|天興|清寧|咸雍|大康|大安|壽昌|乾統|天慶|保大|順治|康熙|雍正|乾隆|嘉慶|道光|咸豐|同治|光緒|宣統)$/u;
const STRUCTURAL_PREFIX_RE = /^(?:第[一二三四五六七八九十百千万萬0-9]+[\p{Script=Han}]{1,8}|[\p{Script=Han}]{1,24}(?:樂章|廟樂章|章|篇|首|宮|造|統軍|上將軍|使司|志|傳|表|紀|王|侯|公|州|府|郡|縣|軍|衛|衞|所|司|院|寺|監|路|道)|(?:弟|子|孫|曾孫|從子|兄|父|祖|母|妻|女)[\p{Script=Han}]{1,8}|[\p{Script=Han}]{1,8}(?:弟|子|孫|曾孫|從子|兄|父|祖|母|妻|女)[\p{Script=Han}]{1,8})$/u;

const LOCAL_SKIP_RE = /[\[\]［］〔〕{}<>〈〉|]|\{\{|\}\}|-\{|\}-|__TOC__|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=|Category:|校勘記|全文以|中華書局|為本校|爲本校|[●□�\uE000-\uF8FF]|[忄氵扌饣钅訁糹衤亻礻犭辶疒阝攵彡]|[⿰⿱⿲⿳]/iu;
const SOURCE_HOLE_RE = /\|\||:{2,}|----|，，|,,/u;
const EMPTY_QUOTE_RE = /(?:曰|詔曰|疏曰|奏曰|表曰|議曰|對曰)[：:]?[「『][」』]/u;

const VARIANTS = new Map([
  ['爲', '為'],
  ['为', '為'],
  ['衞', '衛'],
  ['卫', '衛'],
  ['説', '說'],
  ['说', '說'],
  ['絶', '絕'],
  ['绝', '絕'],
  ['彊', '強'],
  ['强', '強'],
  ['歳', '歲'],
  ['岁', '歲'],
  ['衆', '眾'],
  ['众', '眾'],
  ['鍾', '鐘'],
  ['钟', '鐘'],
  ['于', '於'],
  ['髙', '高'],
  ['惪', '德'],
  ['徳', '德'],
  ['祕', '秘'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['呉', '吳'],
  ['内', '內'],
  ['毎', '每'],
]);

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    limit: Number.POSITIVE_INFINITY,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-wikisource-local-fuller-noops.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]`);
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
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  return opts;
}

function queueFiles(opts) {
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

function sourceText(item) {
  return item.sourceRange?.text || item.sourceText || '';
}

function localText(item) {
  return item.localRange?.text || item.localText || '';
}

function canonicalChar(char) {
  return VARIANTS.get(char) || char;
}

function comparisonChars(text) {
  return [...String(text || '')]
    .filter((char) => HAN_OR_DIGIT_RE.test(char))
    .map(canonicalChar);
}

function subsequenceReport(source, local) {
  const sourceChars = comparisonChars(source);
  const localChars = comparisonChars(local);
  if (sourceChars.length < 4 || localChars.length <= sourceChars.length) return null;

  let sourceIndex = 0;
  let currentExtra = '';
  const extras = [];

  for (const char of localChars) {
    if (sourceIndex < sourceChars.length && char === sourceChars[sourceIndex]) {
      if (currentExtra) {
        extras.push(currentExtra);
        currentExtra = '';
      }
      sourceIndex += 1;
    } else {
      currentExtra += char;
    }
  }
  if (currentExtra) extras.push(currentExtra);
  if (sourceIndex !== sourceChars.length) return null;

  return {
    sourceLength: sourceChars.length,
    localLength: localChars.length,
    extraLength: localChars.length - sourceChars.length,
    extras,
  };
}

function appendNote(existing, note) {
  const current = String(existing || '').trim();
  if (!current) return note;
  if (current.includes(note)) return current;
  return `${current}\n${note}`;
}

function inScope(item, opts) {
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return false;
  return true;
}

function allDateDetails(extras) {
  return extras.every((extra) => DATE_DETAIL_RE.test(extra) || ERA_NAME_RE.test(extra));
}

function allStructuralPrefixes(extras) {
  return extras.every((extra) => [...extra].length <= 24 && STRUCTURAL_PREFIX_RE.test(extra));
}

function classify(item) {
  if (statusOf(item) !== 'pending') return null;
  if (!SOURCE_TYPES.has(item.type)) return null;
  if (!/wikisource/i.test(`${item.sourceName || ''} ${item.sourceUrl || ''}`)) return null;

  const source = sourceText(item);
  const local = localText(item);
  if (!source || !local) return null;
  if (LOCAL_SKIP_RE.test(local)) return null;

  const report = subsequenceReport(source, local);
  if (!report) return null;
  if (report.extraLength < 1 || report.extraLength > Math.max(1400, Math.floor(report.sourceLength * 10))) return null;

  const sourceHasHole = SOURCE_HOLE_RE.test(source);
  const sourceHasEmptyQuote = EMPTY_QUOTE_RE.test(source);

  if (allDateDetails(report.extras)) {
    return {
      ...report,
      reason: sourceHasHole ? 'dropped-date-details-with-raw-placeholder' : 'dropped-date-details',
      note: 'Reviewed as no-op: raw Wikisource omitted explicit date/reign-year detail while the local corpus preserves the fuller source wording; local text retained.',
    };
  }

  if (sourceHasEmptyQuote && report.extraLength >= 12) {
    return {
      ...report,
      reason: 'empty-quote-hole',
      note: 'Reviewed as no-op: raw Wikisource has an empty quotation hole while the local corpus preserves the full quoted source text; local text retained.',
    };
  }

  if (sourceHasHole && report.extraLength >= 20) {
    return {
      ...report,
      reason: 'raw-wikisource-placeholder-hole',
      note: 'Reviewed as no-op: raw Wikisource placeholder/layout residue omits a fuller local source span; local corpus text retained.',
    };
  }

  if (allStructuralPrefixes(report.extras) && report.extraLength <= 48) {
    return {
      ...report,
      reason: 'structural-prefix',
      note: 'Reviewed as no-op: raw Wikisource omitted small structural heading/list prefix text that the local corpus preserves; local text retained.',
    };
  }

  return null;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    apply: opts.apply,
    resolved: 0,
    touchedQueueFiles: 0,
    byReason: {},
    byBook: {},
    byChapter: {},
    samples: [],
  };

  for (const file of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (stats.resolved >= opts.limit) break;
      if (!inScope(item, opts)) continue;
      const report = classify(item);
      if (!report) continue;

      stats.resolved += 1;
      stats.byReason[report.reason] = (stats.byReason[report.reason] || 0) + 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${String(item.chapter || '').padStart(3, '0')}`;
      stats.byChapter[chapterKey] = (stats.byChapter[chapterKey] || 0) + 1;

      if (stats.samples.length < 30) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          severity: item.severity,
          reason: report.reason,
          extraLength: report.extraLength,
          extras: report.extras.slice(0, 16),
          source: sourceText(item).slice(0, 180),
          local: localText(item).slice(0, 260),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = item.reviewedAt || now;
        item.reviewer = item.reviewer || opts.reviewer;
        item.notes = appendNote(item.notes, report.note);
        changed = true;
      }
    }

    if (changed) {
      queue.updatedAt = now;
      fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      stats.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
