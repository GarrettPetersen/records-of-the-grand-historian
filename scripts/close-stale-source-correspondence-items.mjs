#!/usr/bin/env node
/**
 * Close source-correspondence queue items that are already resolved in the
 * live corpus or are high-confidence upstream/list-boundary no-ops.
 *
 * Dry-run by default. Use --apply to update queue item decisions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { variantKey, variantText } from './repair-source-queue-patterns.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'close-stale-source-correspondence-items';

const BAD_BOUNDARY_RE = /[0-9%●□�\uE000-\uF8FF?？*\[\]{}<>]/u;
const LIVE_NOTE_MARKER_RE = /(?:注\[|\[[一二三四五六七八九十百千万萬0-9]+\]|〔|校勘記)/u;

const DATE_PREFIX_RE = /^(?:[一二三四五六七八九十百千万萬廿卅元正閏年月日春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]|太元|義熙|開成|永徽|乾道|慶元|洪武|永樂|宣德|正統|嘉靖|萬曆|崇禎|天會|大定|皇統|普通|大同|黃龍|元鳳|神爵|太始|甘露|元康|五鳳|元狩|地節|元鼎|建武|順治|康熙|雍正|乾隆|嘉慶|道光|咸豐|同治|光緒|宣統)+$/u;
const SOURCE_DATE_START_RE = /^(?:\|\|)?[，,、：:；;]?(?:[一二三四五六七八九十百千万萬廿卅元正閏]+[年載月日]|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|春|夏|秋|冬|，|,|卒|薨|追諡|伏法|遣|復|加|以|[\p{Script=Han}]{1,8}侯)/u;
const BIOGRAPHY_START_RE = /^(?:字|其先|者|亦|初|少|本|為|仕|終|擢|進士|祖|父|子|孫|弟|兄|從|卒|性|通|襲|長|幼|見素|慎由|安潛|虛心|懷恩|叔夏|萬淑|盛彥師|劉孝孫|李守素|峘|能|勖|合|稷|元超|至|平|楚玉|朝宗|繩|維)/u;
const OFFICE_START_RE = /^(?:尚書|侍郎|監|少監|丞|令|卿|郎|員外|主簿|錄事|博士|祭酒|都督|刺史|太守|指揮|一人|二人|三人|四人|五人|六人|七人|八人|九人|十|百|千|左右|左|右|正|從|上|中|下)/u;
const GEO_OFFICE_PREFIX_RE = /(?:州|府|郡|縣|道|路|軍|監|省|部|司|院|寺|衛|衞|營|所|公主|皇后|王|侯|國)$/u;
const SECTION_PREFIX_RE = /^(?:序|結|史評|附|內官|外官|子|弟|兄|孫|曾孫|從子|族孫|附錄|本紀|列傳|志|表|傳|凡例)$/u;
const SONGSHI_LIST_START_RE = /^(?:宋初|周立|開寶|太平|慶曆|景祐|康定|府州|并州|麟州|陝西|諸州|本|左右|[一二三四五六七八九十百千万萬]+。)/u;
const LONG_HEADING_PREFIX_RE = /^(?:[\p{Script=Han}]{2,24}(?:篇|樂章|廟樂章)[一二三四五六七八九十百千万萬零〇0-9]*首?|志[一二三四五六七八九十百千万萬零〇0-9]+[\p{Script=Han}]{2,24})$/u;

const COMMENTARY_SOURCE_RE = /^(?:【|注|\[[一二三四五六七八九十百千万萬0-9]+\]|〔[一二三四五六七八九十百千万萬0-9]+〕|《[^》]{1,30}》曰|(?:前書|續漢書|東觀記|東觀漢記|謝承書|袁山松書|華嶠書|漢官儀|禮記|論語|周易|左傳|春秋|公羊傳|穀梁傳|史記|說文|爾雅|新序|孟子|詩|尚書|孝經|博物志|鄭玄注|杜預注|師古曰|臣賢案|李賢曰|劉昭曰|袁宏曰|謝承曰|胡廣曰|蔡邕曰)[^。！？]{0,20}(?:曰|云|：)|[^，。！？；：「」『』]{1,16}(?:音[^。！？]{0,12}反|音[^。！？]{1,8}。?$|縣名|郡名|故城在|屬[^。！？]{1,12}郡|謂[^。！？]{1,20}也|猶[^。！？]{1,20}也|，[^。！？]{1,20}也。?$|也。?$))/u;
const BASE_TEXT_START_RE = /^(?:[，,、；;。]|[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|永平|建初|元和|永元|元初|建光|延光|永建|陽嘉|永和|漢安|建康|永嘉|本初|建和|和平|元嘉|永興|永壽|延熹|永康|建寧|熹平|光和|中平|初平|建安|帝|詔|遣|拜|遷|轉|徵|征|出|復|及|後|明年|其年|是歲|時|會|遂|乃|以|又|卒|薨|崩|殺|誅|立|封|為|字|子|父|祖)/u;

function parseArgs(argv) {
  const opts = {
    apply: false,
    queues: [],
    books: new Set(),
    limit: 0,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      opts.apply = true;
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

  return opts;
}

function queuePaths(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'rejected';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function sourceKey(unit) {
  return SOURCE_KEYS.find((key) => typeof unit?.[key] === 'string') || null;
}

function collectUnits(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    for (const [index, unit] of (block.sentences || []).entries()) {
      const key = sourceKey(unit);
      if (key) units.push({ blockIndex, kind: 'sentence', index, key, text: unit[key] });
    }
    for (const [index, unit] of (block.cells || []).entries()) {
      const key = sourceKey(unit);
      if (key) units.push({ blockIndex, kind: 'cell', index, key, text: unit[key] });
    }
  }
  return units;
}

const chapterCache = new Map();

function unitsFor(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) chapterCache.set(absolute, collectUnits(file));
  return chapterCache.get(absolute);
}

function locationIndex(location) {
  return location?.sentenceIndex ?? location?.cellIndex ?? location?.index;
}

function liveRangeText(item) {
  const locations = item.localRange?.locations || [];
  if (!locations.length || !item.file || !fs.existsSync(item.file)) return null;
  const units = unitsFor(item.file);
  const parts = [];
  for (const location of locations) {
    const unit = units.find((candidate) => (
      candidate.blockIndex === location.blockIndex
      && candidate.kind === location.kind
      && candidate.index === locationIndex(location)
      && (!location.field || candidate.key === location.field)
    ));
    if (!unit) return null;
    parts.push(String(unit.text || ''));
  }
  return parts.join('');
}

function chapterTextKey(file) {
  return variantKey(unitsFor(file).map((unit) => unit.text).join(''));
}

function sourceBetweenAnchors(item) {
  if (!item.file || !fs.existsSync(item.file)) return false;
  const full = chapterTextKey(item.file);
  const source = variantKey(item.sourceRange?.text || '');
  if (!source || source.length < 4) return false;

  const sourceIndex = full.indexOf(source);
  if (sourceIndex < 0 || full.indexOf(source, sourceIndex + 1) >= 0) return false;

  const before = variantKey(item.context?.beforeLocal || item.context?.beforeSource || '');
  const after = variantKey(item.context?.afterLocal || item.context?.afterSource || '');
  if (before) {
    const beforeIndex = full.lastIndexOf(before, sourceIndex);
    if (beforeIndex < 0 || sourceIndex - (beforeIndex + before.length) > 5000) return false;
  }
  if (after) {
    const afterIndex = full.indexOf(after, sourceIndex + source.length);
    if (afterIndex < 0 || afterIndex - (sourceIndex + source.length) > 5000) return false;
  }
  return true;
}

function startsWithLastName(prefix, source) {
  const chars = [...prefix];
  for (let length = Math.min(4, chars.length); length >= 1; length -= 1) {
    if (source.startsWith(chars.slice(-length).join(''))) return true;
  }
  return false;
}

function hasOpeningLocation(item) {
  return (item.localRange?.locations || []).some((location) => Number(location.sentenceIndex ?? 0) === 0);
}

function prefixKind(prefix, source, sourceKey, item) {
  if (!prefix || BAD_BOUNDARY_RE.test(prefix) || prefix.length > 80) return '';
  if (DATE_PREFIX_RE.test(prefix) && SOURCE_DATE_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && startsWithLastName(prefix, sourceKey) && (BIOGRAPHY_START_RE.test(source) || prefix.length <= 8)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 6 && BIOGRAPHY_START_RE.test(source) && hasOpeningLocation(item)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 14 && GEO_OFFICE_PREFIX_RE.test(prefix) && (OFFICE_START_RE.test(source) || /郡|縣|府|州|赤|望|緊|上|中|下/u.test(source))) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 8 && OFFICE_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 8 && SECTION_PREFIX_RE.test(prefix)) return 'structural-prefix';
  if (item.book === 'songshi' && prefix.length >= 2 && prefix.length <= 4 && SONGSHI_LIST_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && LONG_HEADING_PREFIX_RE.test(prefix) && /^[:：]/u.test(source)) return 'source-leading-colon-heading';
  return '';
}

function suffixKind(suffix, source, liveText, item) {
  if (!suffix || suffix.length > 12 || BAD_BOUNDARY_RE.test(suffix)) return '';
  if (suffix === '傳' && /(?:自有|別有|有)[。.]?$/u.test(variantKey(source))) return 'structural-suffix';
  if (['州', '縣', '郡', '府'].includes(suffix) && /(?:次|至|幸|入|遷|徙|置|攻|圍|出|奔|在)[\p{Script=Han}]{1,4}[。.]?$/u.test(variantKey(source))) return 'structural-suffix';
  if (/[？?]/u.test(source) && suffix.length <= 4) return 'structural-suffix';
  if (/[*\[\]（）()〈〉]/u.test(liveText) && suffix.length <= 8) return 'structural-suffix';
  if (/[。！？；]$/u.test(source) && suffix.length >= 2 && suffix.length <= 8 && hasOpeningLocation(item)) return 'structural-suffix';
  return '';
}

function commentaryContained(item, liveText, sourceKey) {
  if (!LIVE_NOTE_MARKER_RE.test(liveText)) return false;
  const liveKey = variantKey(liveText);
  if (!sourceKey || !liveKey.includes(sourceKey) || liveKey === sourceKey) return false;

  const source = String(item.sourceRange?.text || '')
    .trim()
    .replace(/^」/u, '')
    .replace(/^』/u, '');
  if (!source || BASE_TEXT_START_RE.test(source)) return false;
  return COMMENTARY_SOURCE_RE.test(source);
}

function classify(item) {
  if (!item.sourceRange?.text) return null;

  const liveText = liveRangeText(item);
  if (liveText !== null) {
    if (variantText(liveText) === variantText(item.sourceRange.text)) {
      return {
        decision: 'denied',
        reason: 'live-variant-equivalent',
        notes: 'Reviewed as no-op: live local text is already equivalent to upstream under approved variants and punctuation; local corpus text retained.',
      };
    }
    if (variantKey(liveText) === variantKey(item.sourceRange.text)) {
      return {
        decision: 'denied',
        reason: 'live-content-equivalent',
        notes: 'Reviewed as no-op: live local Han/digit content is already equivalent to upstream after punctuation-boundary repair; local corpus text retained.',
      };
    }

    const source = variantKey(item.sourceRange.text);
    const local = variantKey(liveText);
    if (source && local && local !== source) {
      if (commentaryContained(item, liveText, source)) {
        return {
          decision: 'denied',
          reason: 'commentary-contained',
          notes: 'Reviewed as no-op: upstream commentary/gloss text is already present inside the live local note block; local corpus text retained.',
        };
      }

      const index = local.indexOf(source);
      if (index >= 0 && local.indexOf(source, index + 1) < 0) {
        const prefix = local.slice(0, index);
        const suffix = local.slice(index + source.length);
        const prefixReason = prefixKind(prefix, item.sourceRange.text, source, item);
        const suffixReason = suffixKind(suffix, item.sourceRange.text, liveText, item);
        if (prefix && !suffix && prefixReason) {
          return {
            decision: 'denied',
            reason: prefixReason,
            notes: 'Reviewed as no-op: upstream span is contained in the live local text after a structural heading/date/list prefix; local corpus text retained.',
          };
        }
        if (!prefix && suffix && suffixReason) {
          return {
            decision: 'denied',
            reason: suffixReason,
            notes: 'Reviewed as no-op: upstream span is contained in the live local text before a structural suffix or boundary heading; local corpus text retained.',
          };
        }
        if (prefix && suffix && prefixReason && suffixReason) {
          return {
            decision: 'denied',
            reason: 'structural-prefix-suffix',
            notes: 'Reviewed as no-op: upstream span is contained in the live local text between structural prefix/suffix material; local corpus text retained.',
          };
        }
      }
    }
  } else if ((item.localRange?.locations || []).length === 0 && sourceBetweenAnchors(item)) {
    return {
      decision: 'applied',
      reason: 'source-already-present-between-anchors',
      notes: 'Reviewed as already repaired: live corpus already contains the upstream source text between the recorded anchors.',
    };
  }

  return null;
}

function markItem(item, classification, opts, now) {
  if (classification.decision === 'applied') {
    item.status = 'applied';
    item.decision = 'applied';
    item.appliedAt = item.appliedAt || now;
    item.appliedSummary ||= {
      mode: 'already-present',
      source: opts.reviewer,
      reason: classification.reason,
    };
  } else {
    item.status = 'denied';
    item.decision = 'denied';
    item.reviewedAt = item.reviewedAt || now;
  }
  item.reviewer = item.reviewer || opts.reviewer;
  item.notes = item.notes ? `${item.notes}\n${classification.notes}` : classification.notes;
}

function addCount(map, key) {
  map[key] = (map[key] || 0) + 1;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    dryRun: !opts.apply,
    total: 0,
    byReason: {},
    byDecision: {},
    byQueue: {},
    samples: [],
  };

  for (const queuePath of queuePaths(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changed = false;
    let queueCount = 0;

    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const classification = classify(item);
      if (!classification) continue;

      summary.total += 1;
      queueCount += 1;
      addCount(summary.byReason, classification.reason);
      addCount(summary.byDecision, classification.decision);
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          decision: classification.decision,
          reason: classification.reason,
          source: String(item.sourceRange?.text || '').slice(0, 120),
          local: String(item.localRange?.text || '').slice(0, 120),
        });
      }

      if (opts.apply) {
        markItem(item, classification, opts, now);
        changed = true;
      }
      if (opts.limit > 0 && summary.total >= opts.limit) break;
    }

    if (queueCount > 0) summary.byQueue[path.relative(process.cwd(), queuePath)] = queueCount;
    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
    if (opts.limit > 0 && summary.total >= opts.limit) break;
  }

  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
