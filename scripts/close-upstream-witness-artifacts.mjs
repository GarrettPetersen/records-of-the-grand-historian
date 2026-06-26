#!/usr/bin/env node
/**
 * Close high-confidence source-correspondence items where the external
 * upstream witness is the artifact, not the local corpus text.
 *
 * This script does not edit chapter source or translations. It only marks
 * pending queue items denied/no-op when the local text already contains the
 * upstream Han/number sequence and the upstream span has a strong artifact
 * fingerprint: raw table markup, interleaved commentary, correction notation,
 * leading-close boundary residue, or visible truncation/dropped-template
 * punctuation.
 *
 * Dry-run by default. Use --apply to update queue metadata.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const DATA_DIR = path.join(process.cwd(), 'data');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const DEFAULT_REVIEWER = 'close-upstream-witness-artifacts';
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];

const VARIANTS = new Map([
  ['并', '並'],
  ['竝', '並'],
  ['爲', '為'],
  ['为', '為'],
  ['复', '復'],
  ['覆', '復'],
  ['无', '無'],
  ['歳', '歲'],
  ['嵗', '歲'],
  ['髙', '高'],
  ['撃', '擊'],
  ['鄕', '鄉'],
  ['郷', '鄉'],
  ['内', '內'],
  ['呉', '吳'],
  ['衞', '衛'],
  ['徴', '徵'],
  ['征', '徵'],
  ['録', '錄'],
  ['歩', '步'],
  ['茍', '苟'],
  ['姧', '奸'],
  ['姦', '奸'],
  ['筭', '算'],
  ['恒', '恆'],
  ['辠', '罪'],
  ['輓', '挽'],
  ['範', '范'],
  ['祕', '秘'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['陜', '陝'],
  ['墻', '牆'],
  ['惪', '德'],
  ['衆', '眾'],
  ['僞', '偽'],
  ['説', '說'],
  ['倶', '俱'],
  ['毎', '每'],
  ['廿', '二十'],
  ['卅', '三十'],
  ['卌', '四十'],
]);

const TABLE_MARKUP_RE = /\{\||\|\}|\|-|\|\+|\|\||!!|\b(?:class|style|colspan|rowspan|width|height|align|valign|border|cellspacing|cellpadding)\s*=|wikitable/iu;
const TABLE_MARKUP_STRIP_RE = /\{\||\|\}|\|-|\|\+|\|\||!!|\b(?:class|style|colspan|rowspan|width|height|align|valign|border|cellspacing|cellpadding)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s，。；：、]+)\s*\|?|wikitable/giu;
const CLOSE_OR_WRAPPER_START_RE = /^[」』”）)\]】〉》]+/u;
const MALFORMED_SOURCE_PUNCT_RE = /[，,]{2,}|[。！？；;：:][，,]|[，,][。！？；;：:]|[；;：:][。！？]|[「『][」』]/u;
const LOCAL_BAD_ARTIFACT_RE = /__TOC__|\{\{|\}\}|[{}]|-\{|\}-|[\[［〔]|注\[|[〈〉]|\*\(|\*\[|\]\*|[忄扌氵衤辶阝訁糹釒飠犭]|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=|[●□�\uE000-\uF8FF]|Category:|PD-old/iu;
const CORRECTION_MARKUP_RE = /(?:（[^）]{1,12}）［[^］]{1,12}］|\([^)]{1,12}\)\[[^\]]{1,12}\]|[〔［\[][^〕］\]]{1,12}[〕］\]])/u;
const COMMENTARY_MARKER_RE = /【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|釋名|風俗通|廣雅|說文|爾雅|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:)/u;
const COMMENTARY_BLOCK_RE = /(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】(?:[「『][\s\S]{1,260}?[」』]|[^。！？]{0,180}[。！？]?)|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|釋名|風俗通|廣雅|說文|爾雅|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:)(?:[「『][\s\S]{1,260}?[」』]|[^。！？]{1,180}[。！？]?))/gu;
const GLOSS_COMMENTARY_RE = /(?:[^。！？]{1,24}(?:音[^。！？]{0,14}反|音[^。！？]{1,10}|讀曰[^。！？]{1,12}|一作[^。！？]{1,12}|縣名|郡名|星名|陵名|官名|故城在|今[^。！？]{1,24}(?:縣|州|郡)|屬[^。！？]{1,18}郡|謂[^。！？]{1,35}也|猶[^。！？]{1,35}也|即[^。！？]{1,35}也)[。！？]?)/gu;

const NOTES = {
  rawTableMarkup: 'Reviewed as no-op: upstream raw witness includes MediaWiki table markup/separators while the local structured table cell text is already represented; local corpus text retained.',
  tableSourceAlreadyInChapter: 'Reviewed as no-op: upstream raw table span is already represented in the current structured chapter text; local table structure retained.',
  tableSourceSubsequenceInChapter: 'Reviewed as no-op: upstream raw table span is represented in order across the current structured table cells after dropping Wikisource row-number residue; local table structure retained.',
  postTocAlreadyLocal: 'Reviewed as no-op: upstream witness includes Wikisource page TOC/header residue before __TOC__; the post-TOC source text is already represented in the local range.',
  tocPostTextAlreadyLocal: 'Reviewed as no-op: upstream witness includes Wikisource page TOC/header residue before __TOC__; the real post-TOC source text is already represented in the local range, so the upstream header residue is rejected.',
  orthographicCorrection: 'Reviewed as no-op: source/local difference is only approved graph variants or upstream correction-bracket notation; local corpus text retained.',
  commentaryOnly: 'Reviewed as no-op: upstream witness interleaves commentary/gloss text that strips to the local base text; local corpus text retained.',
  leadingCloseFuller: 'Reviewed as no-op: upstream raw witness starts with closing punctuation while its remaining Han/number sequence is contained in the fuller local corpus text; local corpus text retained.',
  malformedUpstream: 'Reviewed as no-op: upstream raw witness is visibly truncated or malformed while its Han/number sequence is contained in the fuller local corpus text; local corpus text retained.',
};

const chapterKeyCache = new Map();
const chapterNoAsciiDigitKeyCache = new Map();

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    queues: [],
    limit: Infinity,
    sampleLimit: 40,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
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
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || Infinity);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || Infinity);
      continue;
    }
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i] || 40);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length) || 40);
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

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
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
  if (status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function simplifyCorrectionMarkup(text) {
  return String(text || '')
    .replace(/（[^）]{1,12}）［([^］]{1,12})］/gu, '$1')
    .replace(/\([^)]{1,12}\)\[([^\]]{1,12})\]/gu, '$1')
    .replace(/〔([^〕]{1,12})〕/gu, '$1')
    .replace(/［([^］]{1,12})］/gu, '$1')
    .replace(/\[([^\]]{1,12})\]/gu, '$1');
}

function tokenKey(text) {
  let out = '';
  for (const char of simplifyCorrectionMarkup(text).normalize('NFKC')) {
    if (!/[\p{Script=Han}0-9]/u.test(char)) continue;
    out += VARIANTS.get(char) || char;
  }
  return out;
}

function tokenKeyNoAsciiDigits(text) {
  return tokenKey(text).replace(/[0-9]/gu, '');
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function flattenChapterText(chapter) {
  const parts = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) parts.push(unit[field]);
      }
    }
  }
  return parts.join('');
}

function currentChapterKey(item) {
  const file = path.join(DATA_DIR, item.book || '', `${String(item.chapter || '').padStart(3, '0')}.json`);
  const abs = path.resolve(file);
  if (!chapterKeyCache.has(abs)) {
    if (!fs.existsSync(abs)) {
      chapterKeyCache.set(abs, '');
    } else {
      const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
      chapterKeyCache.set(abs, tokenKey(flattenChapterText(chapter)));
    }
  }
  return chapterKeyCache.get(abs);
}

function currentChapterNoAsciiDigitKey(item) {
  const file = path.join(DATA_DIR, item.book || '', `${String(item.chapter || '').padStart(3, '0')}.json`);
  const abs = path.resolve(file);
  if (!chapterNoAsciiDigitKeyCache.has(abs)) {
    if (!fs.existsSync(abs)) {
      chapterNoAsciiDigitKeyCache.set(abs, '');
    } else {
      const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
      chapterNoAsciiDigitKeyCache.set(abs, tokenKeyNoAsciiDigits(flattenChapterText(chapter)));
    }
  }
  return chapterNoAsciiDigitKeyCache.get(abs);
}

function stripTableMarkup(text) {
  return String(text || '').replace(TABLE_MARKUP_STRIP_RE, '');
}

function stripCommentary(text) {
  let current = String(text || '');
  for (let i = 0; i < 4; i += 1) {
    const next = current.replace(COMMENTARY_BLOCK_RE, '').replace(GLOSS_COMMENTARY_RE, '');
    if (next === current) break;
    current = next;
  }
  return current;
}

function isSubsequence(needle, haystack) {
  if (!needle) return false;
  let j = 0;
  for (const char of needle) {
    j = haystack.indexOf(char, j);
    if (j < 0) return false;
    j += 1;
  }
  return true;
}

function subsequenceSpan(needle, haystack) {
  if (!needle) return null;
  let cursor = 0;
  let first = -1;
  let last = -1;
  for (const char of needle) {
    const next = haystack.indexOf(char, cursor);
    if (next < 0) return null;
    if (first < 0) first = next;
    last = next;
    cursor = next + 1;
  }
  return last - first + 1;
}

function hasTableLocation(item) {
  const locations = [
    ...(item.localRange?.locations || []),
    ...(item.sourceRange?.locations || []),
  ];
  return locations.some((location) => (
    location.kind === 'cell'
    || String(location.blockType || '').startsWith('table')
  ));
}

function countChar(text, char) {
  return [...String(text || '')].filter((candidate) => candidate === char).length;
}

function hasUnbalancedWrappers(text) {
  const value = String(text || '');
  return countChar(value, '（') !== countChar(value, '）')
    || countChar(value, '(') !== countChar(value, ')')
    || countChar(value, '「') !== countChar(value, '」')
    || countChar(value, '『') !== countChar(value, '』')
    || countChar(value, '〈') !== countChar(value, '〉')
    || countChar(value, '《') !== countChar(value, '》');
}

function hasRepeatedHanPrefix(text) {
  const key = tokenKey(text);
  for (let length = 2; length <= 12; length += 1) {
    if (key.length < length * 2) continue;
    const prefix = key.slice(0, length);
    if (key.slice(length, length * 2) === prefix) return true;
  }
  return false;
}

function isRawTableMarkupNoop(item, source, local) {
  if (!source || !local) return false;
  if (!hasTableLocation(item)) return false;
  if (LOCAL_BAD_ARTIFACT_RE.test(local) || hasUnbalancedWrappers(local) || hasRepeatedHanPrefix(local)) return false;
  if (!TABLE_MARKUP_RE.test(source)) return false;
  const sourceKey = tokenKey(stripTableMarkup(source));
  const localKey = tokenKey(local);
  if (!sourceKey || !localKey || localKey.length < 1) return false;
  return sourceKey.includes(localKey);
}

function isTableSourceAlreadyInChapterNoop(item, source) {
  if (!source || !hasTableLocation(item)) return false;
  const sourceKey = tokenKey(stripCommentary(stripTableMarkup(source)));
  if (sourceKey.length < 8) return false;
  return currentChapterKey(item).includes(sourceKey);
}

function isTableSourceSubsequenceInChapterNoop(item, source) {
  if (!source || !hasTableLocation(item)) return false;
  if (!TABLE_MARKUP_RE.test(source) && !/[|!]{2,}/u.test(source)) return false;
  const sourceKey = tokenKeyNoAsciiDigits(stripCommentary(stripTableMarkup(source)));
  if (sourceKey.length < 8) return false;
  const chapterKey = currentChapterNoAsciiDigitKey(item);
  const span = subsequenceSpan(sourceKey, chapterKey);
  if (!span) return false;
  return span <= Math.max(80, sourceKey.length * 4);
}

function isPostTocAlreadyLocalNoop(source, local) {
  if (!source || !local || !source.includes('__TOC__')) return false;
  if (LOCAL_BAD_ARTIFACT_RE.test(local) || hasUnbalancedWrappers(local) || hasRepeatedHanPrefix(local)) return false;
  const postToc = source.slice(source.indexOf('__TOC__') + '__TOC__'.length);
  const sourceKey = tokenKey(postToc);
  const localKey = tokenKey(local);
  if (sourceKey.length < 12 || localKey.length < sourceKey.length) return false;
  return localKey === sourceKey || localKey.endsWith(sourceKey);
}

function isTocPostTextAlreadyLocalNoop(source, local) {
  if (!source || !local || !source.includes('__TOC__')) return false;
  if (LOCAL_BAD_ARTIFACT_RE.test(local) || hasUnbalancedWrappers(local) || hasRepeatedHanPrefix(local)) return false;
  const postToc = source.slice(source.indexOf('__TOC__') + '__TOC__'.length);
  const sourceKey = tokenKey(postToc);
  const localKey = tokenKey(local);
  if (sourceKey.length < 6 || localKey.length < sourceKey.length) return false;
  return localKey.includes(sourceKey);
}

function isOrthographicCorrectionNoop(source, local) {
  if (!source || !local || source === local) return false;
  if (!CORRECTION_MARKUP_RE.test(source) && !CORRECTION_MARKUP_RE.test(local)) {
    const rawSource = String(source || '');
    const rawLocal = String(local || '');
    const hasMappedVariant = [...rawSource + rawLocal].some((char) => VARIANTS.has(char));
    if (!hasMappedVariant) return false;
  }
  const sourceKey = tokenKey(source);
  const localKey = tokenKey(local);
  return !!sourceKey && sourceKey === localKey;
}

function isCommentaryOnlyNoop(source, local) {
  if (!source || !local) return false;
  if (!COMMENTARY_MARKER_RE.test(source)) return false;
  const stripped = stripCommentary(source);
  const strippedKey = tokenKey(stripped);
  const localKey = tokenKey(local);
  if (!strippedKey || !localKey) return false;
  return strippedKey === localKey;
}

function isMalformedUpstreamNoop(source, local) {
  if (!source || !local) return false;
  if (!MALFORMED_SOURCE_PUNCT_RE.test(source)) return false;
  if (LOCAL_BAD_ARTIFACT_RE.test(local) || hasUnbalancedWrappers(local)) return false;
  const sourceKey = tokenKey(source);
  const localKey = tokenKey(local);
  if (sourceKey.length < 4 || localKey.length <= sourceKey.length) return false;
  if (localKey.length > sourceKey.length * 8) return false;
  if (CLOSE_OR_WRAPPER_START_RE.test(source) && sourceKey.length < 8) return false;
  return isSubsequence(sourceKey, localKey);
}

function isLeadingCloseFullerNoop(source, local) {
  if (!source || !local) return false;
  if (!CLOSE_OR_WRAPPER_START_RE.test(source)) return false;
  if (LOCAL_BAD_ARTIFACT_RE.test(local) || hasUnbalancedWrappers(local) || hasRepeatedHanPrefix(local)) return false;
  const sourceKey = tokenKey(source.replace(CLOSE_OR_WRAPPER_START_RE, ''));
  const localKey = tokenKey(local);
  if (sourceKey.length < 4 || localKey.length <= sourceKey.length) return false;
  if (localKey.length > sourceKey.length * 8) return false;
  return isSubsequence(sourceKey, localKey);
}

function classify(item) {
  if (item.sourceName && item.sourceName !== 'wikisource') return null;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate', 'local_extra_candidate', 'source_omission_candidate'].includes(item.type || '')) return null;

  const source = String(item.sourceRange?.text || '');
  const local = String(item.localRange?.text || '');

  if (isPostTocAlreadyLocalNoop(source, local)) {
    return { reason: 'post-toc-already-local', note: NOTES.postTocAlreadyLocal };
  }
  if (isTocPostTextAlreadyLocalNoop(source, local)) {
    return { reason: 'toc-post-text-already-local', note: NOTES.tocPostTextAlreadyLocal };
  }
  if (isTableSourceAlreadyInChapterNoop(item, source)) {
    return { reason: 'table-source-already-in-chapter', note: NOTES.tableSourceAlreadyInChapter };
  }
  if (isTableSourceSubsequenceInChapterNoop(item, source)) {
    return { reason: 'table-source-subsequence-in-chapter', note: NOTES.tableSourceSubsequenceInChapter };
  }
  if (item.type !== 'source_omission_candidate' && isRawTableMarkupNoop(item, source, local)) {
    return { reason: 'raw-table-markup', note: NOTES.rawTableMarkup };
  }
  if (isOrthographicCorrectionNoop(source, local)) {
    return { reason: 'orthographic-correction', note: NOTES.orthographicCorrection };
  }
  if (isCommentaryOnlyNoop(source, local)) {
    return { reason: 'commentary-only', note: NOTES.commentaryOnly };
  }
  if (isLeadingCloseFullerNoop(source, local)) {
    return { reason: 'leading-close-fuller', note: NOTES.leadingCloseFuller };
  }
  if (isMalformedUpstreamNoop(source, local)) {
    return { reason: 'malformed-upstream', note: NOTES.malformedUpstream };
  }
  return null;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function markDenied(item, classification, opts, now) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || opts.reviewer;
  item.notes = appendNote(item.notes, classification.note);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    dryRun: !opts.apply,
    total: 0,
    byReason: {},
    byBook: {},
    byQueue: {},
    touchedQueueFiles: 0,
    samples: [],
  };

  for (const queuePath of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changed = false;
    let queueCount = 0;

    for (const item of queue.items || []) {
      if (summary.total >= opts.limit) break;
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;

      const classification = classify(item);
      if (!classification) continue;

      summary.total += 1;
      queueCount += 1;
      summary.byReason[classification.reason] = (summary.byReason[classification.reason] || 0) + 1;
      summary.byBook[item.book || 'unknown'] = (summary.byBook[item.book || 'unknown'] || 0) + 1;
      if (summary.samples.length < opts.sampleLimit) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          severity: item.severity,
          reason: classification.reason,
          source: String(item.sourceRange?.text || '').slice(0, 180),
          local: String(item.localRange?.text || '').slice(0, 180),
        });
      }

      if (opts.apply) {
        markDenied(item, classification, opts, now);
        changed = true;
      }
    }

    if (queueCount > 0) summary.byQueue[path.relative(process.cwd(), queuePath)] = queueCount;
    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
