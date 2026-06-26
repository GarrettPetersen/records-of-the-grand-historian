#!/usr/bin/env node
/**
 * Close source-only upstream commentary/page-residue no-ops.
 *
 * This script does not edit chapter source or translations. It only marks
 * source-correspondence queue items denied when the upstream-only span is
 * clearly a citation note, commentator gloss, or source-page residue rather
 * than missing base corpus text.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  noPunctuationKey,
  normalizeWhitespace,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-source-only-commentary-noops';

const LEADING_PUNCT_RE = /^[」』”）)\]】〉》，、。；：！？\s|□-]+/u;
const TABLE_MARKUP_RE = /(?:class|style|ALIGN|VALIGN|colspan|rowspan|width|height)\s*=|\{\||\|\}|\|-|\|\+|!!|\|\||<table|<\/table>|<tr|<\/tr>|<td|<\/td>|<th|<\/th>/iu;
const PAGE_RESIDUE_RE = /^(?:[。；：，、\s]*)?(?:Category:[^\s|<>]+|(?:----\s*)?校勘記|(?:Author-)?PD-old|__(?:FORCE)?TOC__|__NOTOC__|__NOCC__|傳\d+Category:[^\s|<>]+)(?:[。；：，、\s]*)?$/iu;
const EXPLICIT_START_RE = /^(?:《[^》]{1,30}》|(?:禮記|春秋|春秋感精符|前漢|漢法|前書|續漢書|續漢志|東觀記|東觀漢記|古今注|蔡質漢儀|漢官|冊府元龜|永樂大典|案|按|臣昭|臣賢案|師古|李賢|章懷|杜預|徐廣|服虔|應劭|楊孚卓傳|梁冀別傳|獻帝起居注|鄭衆|鄭玄|酈元))/u;
const EXPLICIT_COMMENTARY_RE = /^(?:《[^》]{1,30}》|(?:禮記|春秋|春秋感精符|前漢|漢法|前書|續漢書|續漢志|東觀記|東觀漢記|古今注|蔡質漢儀|漢官|冊府元龜|永樂大典|案|按|臣昭|臣賢案|師古|李賢|章懷|杜預|徐廣|服虔|應劭|楊孚卓傳|梁冀別傳|獻帝起居注|鄭衆|鄭玄|酈元))[\s\S]{0,180}(?:曰|云|案|按|注|謂|為|也|反|音|屬|在今|縣名|郡名)/u;
const GENERAL_COMMENTARY_RE = /^(?:\*?\|*)?(?:【(?:正義|集解|索隱|考證|校勘記)[^】]*】|(?:集解|索隱)[^。！？；]{0,40}(?:曰|云|案|按|：)|(?:蘇林|徐廣|裴駰|司馬貞|張守節|師古|臣瓚|孟康|應劭|如淳|晉灼|李奇|李竒|服虔|韋昭|李賢|章懷|臣賢案)[^。！？；]{0,80}(?:曰|云|案|按|：)|(?:案|按)(?:新唐書|通鑑|舊唐書|薛史|唐書|漢書|後漢書|晉書|宋書|南史|北史|隋書|舊唐書|五代史|冊府元龜|考異))/u;
const HHS_NOTE_START_RE = /^(?:《[^》]{1,30}》|(?:禮記|春秋|春秋感精符|春秋漢含孳|春秋緯|前漢|漢法|前書|漢書|續漢書|續漢志|東觀記|東觀漢記|古今注|蔡質漢儀|漢官|漢官儀|周禮|蔡質|決錄注|孔叢|京房占|黃帝占|黃帝星經|郗萌|袁山松書|方儲對策|管子|案|按|臣昭|臣賢案|師古|李賢|章懷|杜預|徐廣|服虔|應劭|楊孚卓傳|梁冀別傳|獻帝起居注|鄭衆|鄭玄|酈元))/u;
const HHS_SHORT_NOTE_RE = /^(?:禮記|漢法|周禮|案大駕鹵簿)[^。！？；]{1,40}。?$/u;
const HHS_COLLATION_RESIDUE_RE = /(?:[一二三四五六七八九〇零]{2,}頁[一二三四五六七八九〇零]{0,4}行|校補|殿本|逕改正|原訛|按：)/u;
const SHORT_GLOSS_RE = /^[^。！？；：「」『』]{1,12}(?:音[^。！？；]{0,16}反|讀曰[^。！？；]{1,16}|一作[^。！？；]{1,16})。?$/u;
const BASE_TEXT_START_RE = /^(?:[元一二三四五六七八九十百千萬万〇零]+年|[春夏秋冬](?!秋感精符)|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|是月|是歲|其年|明年|初|先是|詔|制曰|帝|上|天子|王|太后|太子|遣|拜|封|立|殺|誅|卒|薨|崩|復|大赦|改元|置|罷|徙|寇|伐|攻|破|圍|以|乃|遂|會|及|時|冬十月|夏五月|秋七月)/u;
const WHITELISTED_SHORT_STARTS = new Set([
  '中官',
  '禮記',
  '洛京',
  '妻父',
  '婉',
  '洋溢',
  '唏',
  '司隷',
  '曹陽',
  '蹋頓',
  '郎年',
  '前漢',
  '自禮樂長',
  '平樂觀',
  '首陽山',
]);

const NOTE = 'Reviewed as no-op: upstream source-only annotation/commentary/page residue is not base corpus text; local corpus retained.';

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Number.POSITIVE_INFINITY,
    sampleLimit: 40,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-source-only-commentary-noops.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
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
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 40;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
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
  if (item.appliedAt || status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function compact(text) {
  return normalizeWhitespace(text || '');
}

function stripLeadingPunctuation(text) {
  return String(text || '').replace(LEADING_PUNCT_RE, '');
}

function sameAnchor(sourceText, localText) {
  const sourceKey = noPunctuationKey(sourceText || '');
  const localKey = noPunctuationKey(localText || '');
  return sourceKey === localKey;
}

function hasMatchingAnchors(item) {
  const context = item.context || {};
  return sameAnchor(context.beforeSource || '', context.beforeLocal || '')
    && sameAnchor(context.afterSource || '', context.afterLocal || '');
}

function hasHan(text) {
  return /\p{Script=Han}/u.test(text || '');
}

function hanKeyLength(text) {
  return noPunctuationKey(text || '').length;
}

function startsWithWhitelistedShortGloss(text) {
  if (!/^[^。！？；：「」『』]{1,16}，[^。！？；]{1,40}(?:也|同|之文|之詩|之語)。?$/u.test(text)) return false;
  return [...WHITELISTED_SHORT_STARTS].some((start) => text.startsWith(start));
}

function classify(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.ruleId) return null;
  if (item.type !== 'source_omission_candidate') return null;
  if (compact(item.localRange?.text || '')) return null;
  if (!hasMatchingAnchors(item)) return null;

  const source = compact(item.sourceRange?.text || '');
  const stripped = stripLeadingPunctuation(source);
  if (!stripped || !hasHan(stripped)) return null;
  if (TABLE_MARKUP_RE.test(stripped)) return null;

  if (PAGE_RESIDUE_RE.test(stripped)) {
    return { reason: 'source-page-residue' };
  }

  if (GENERAL_COMMENTARY_RE.test(stripped)) {
    return { reason: 'source-only-general-commentary' };
  }

  if (item.book !== 'houhanshu') return null;

  const length = hanKeyLength(stripped);
  if (length === 0) return null;

  if (HHS_COLLATION_RESIDUE_RE.test(stripped)) {
    return { reason: 'houhanshu-source-collation-residue' };
  }

  if (HHS_NOTE_START_RE.test(stripped) && length <= 600) {
    return { reason: 'houhanshu-source-only-annotation' };
  }

  if (HHS_SHORT_NOTE_RE.test(stripped)) {
    return { reason: 'houhanshu-source-only-short-note' };
  }

  if (length > 140) return null;

  if (!EXPLICIT_START_RE.test(stripped) && BASE_TEXT_START_RE.test(stripped)) return null;

  if (EXPLICIT_COMMENTARY_RE.test(stripped)) {
    return { reason: 'source-only-explicit-commentary' };
  }

  if (SHORT_GLOSS_RE.test(stripped)) {
    return { reason: 'source-only-short-gloss' };
  }

  if (startsWithWhitelistedShortGloss(stripped)) {
    return { reason: 'source-only-whitelisted-gloss' };
  }

  return null;
}

function appendNote(existing, note) {
  const current = String(existing || '').trim();
  if (!current) return note;
  if (current.includes(note)) return current;
  return `${current}\n${note}`;
}

function short(text) {
  const value = normalizeWhitespace(text || '');
  return value.length > 180 ? `${value.slice(0, 179)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    dryRun: !opts.apply,
    total: 0,
    byReason: {},
    byBook: {},
    byQueue: {},
    touchedQueueFiles: 0,
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (stats.total >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter).padStart(3, '0'))) continue;

      const result = classify(item);
      if (!result) continue;

      stats.total += 1;
      stats.byReason[result.reason] = (stats.byReason[result.reason] || 0) + 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const relQueue = path.relative(process.cwd(), queueFile);
      stats.byQueue[relQueue] = (stats.byQueue[relQueue] || 0) + 1;

      if (stats.samples.length < opts.sampleLimit) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          severity: item.severity ?? null,
          reason: result.reason,
          source: short(item.sourceRange?.text || ''),
          before: short(item.context?.beforeLocal || ''),
          after: short(item.context?.afterLocal || ''),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = now;
        item.reviewedBy = opts.reviewer;
        item.notes = appendNote(item.notes, NOTE);
        changed = true;
      }
    }

    if (changed && opts.apply) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      stats.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
