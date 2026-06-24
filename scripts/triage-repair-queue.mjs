#!/usr/bin/env node
/**
 * Summarize and packetize source-correspondence repair queues.
 *
 * This is a planning tool, not a translator. It classifies pending queue items
 * so safe no-op classes and punctuation-only work can be handled in batches,
 * while real source insertions still get manual translation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const DEFAULT_PACKET_DIR = path.join(QUALITY_DIR, 'repair-packets');
const REPAIR_QUEUE_RE = /^source-((?:artifacts|correspondence).+)\.json$/u;
const CLOSE_PUNCT_RE = /^[」』”）)\]】〉》]+/u;
const UPSTREAM_RESIDUE_RE = /__TOC__|__NOTOC__|PD-old|Category:|----\s*校勘記/u;
const UPSTREAM_RESIDUE_TOKEN_RE = /__(?:FORCE)?TOC__|__NOTOC__|__NOCC__|Author-PD-old|PD-old|Category:[^\s<>{}|]+|<!--[\s\S]*?-->|----\s*校勘記/gu;
const WIKI_PAGE_FIELD_RE = /\|?(?:previous|next|override_author|noauthor|notes|from|type|times)=[^|]*/gu;
const HAN_RE = /\p{Script=Han}/u;
const SENTENCE_END_RE = /[。！？；]$/u;
const TABLE_NUMERIC_FRAGMENT_RE = /^[一二三四五六七八九十百千萬億〇零元正閏年月日朔晦春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥、，。；：！？「」『』（）()\d]+$/u;
const TABLE_NUMERIC_RESIDUE_CHARS_RE = /^[\p{Script=Han}0-9\s，、。；：！？「」『』（）()《》〈〉·．\-—]+$/u;
const LOCAL_WIKI_HEADING_MARKUP_RE = /^=+[^=].*=+$/u;
const LOCAL_COLLATION_MARKER_RE = /^=*\s*(?:校勘記|校刊記|注)\s*=*$/u;
const LOCAL_UI_ARTIFACTS = new Set([
  '打開字典',
]);

const SAFE_DENIAL_NOTES = new Map([
  ['safe-variant-noop', 'Reviewed as no-op: source/local difference is only approved graph variants; local corpus text retained.'],
  ['safe-upstream-residue-noop', 'Reviewed as no-op: difference is only upstream MediaWiki/source-page residue; local corpus text retained.'],
  ['source-layout-marker-noop', 'Reviewed as no-op: upstream raw witness contains only table/list layout markers or duplicate punctuation; local corpus text retained.'],
  ['section-heading-noop', 'Reviewed as no-op: local unit is a structural section heading retained for site/chapter navigation; upstream raw witness omits standalone headings.'],
  ['table-cell-repeat-noop', 'Reviewed as no-op: local unit is a table cell boundary/repetition fragment; upstream raw witness collapses table layout differently.'],
  ['table-numeric-residue-noop', 'Reviewed as no-op: upstream raw table witness contains only stray Arabic numeric residue; local table text retained.'],
]);

const CHRONOLOGICAL_ORDER = [
  'shiji', 'hanshu', 'houhanshu', 'sanguozhi', 'jinshu', 'songshu',
  'nanqishu', 'liangshu', 'chenshu', 'weishu', 'beiqishu', 'zhoushu',
  'suishu', 'nanshi', 'beishi', 'jiutangshu', 'xintangshu',
  'jiuwudaishi', 'xinwudaishi', 'songshi', 'liaoshi', 'jinshi',
  'yuanshi', 'mingshi', 'zizhitongjian', 'qingshigao',
];

const COMMON_VARIANTS = new Map([
  ['并', '並'],
  ['竝', '並'],
  ['爲', '為'],
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
  ['徴', '徵'],
  ['征', '徵'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['于', '於'],
  ['陜', '陝'],
  ['墻', '牆'],
  ['衞', '衛'],
]);

function usage() {
  console.error(`Usage:
  node scripts/triage-repair-queue.mjs [--book BOOK] [--chapter CHAPTER]
    [--queue PATH] [--source-name NAME] [--class CLASS] [--json]
    [--limit N] [--packets N] [--out-dir DIR]
    [--apply-safe-denials] [--reviewer NAME]

Examples:
  node scripts/triage-repair-queue.mjs --book beishi
  node scripts/triage-repair-queue.mjs --book beishi --packets 3
  node scripts/triage-repair-queue.mjs --class punctuation-only --limit 20

Classes are report labels. Only classes listed as safe no-op candidates in the
report can be marked automatically, and only with --apply-safe-denials.`);
}

function parseArgs(argv) {
  const opts = {
    books: new Set(),
    chapters: new Set(),
    queues: [],
    sourceNames: new Set(),
    classFilter: null,
    json: false,
    limit: 20,
    packets: 0,
    outDir: DEFAULT_PACKET_DIR,
    applySafeDenials: false,
    includeAllChapters: false,
    reviewer: 'triage-repair-queue',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--apply-safe-denials') {
      opts.applySafeDenials = true;
      continue;
    }
    if (arg === '--include-all-chapters') {
      opts.includeAllChapters = true;
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
    if (arg === '--source-name') {
      opts.sourceNames.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--source-name=')) {
      opts.sourceNames.add(arg.slice('--source-name='.length));
      continue;
    }
    if (arg === '--class') {
      opts.classFilter = argv[++i];
      continue;
    }
    if (arg.startsWith('--class=')) {
      opts.classFilter = arg.slice('--class='.length);
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
    if (arg === '--packets') {
      opts.packets = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--packets=')) {
      opts.packets = Number(arg.slice('--packets='.length));
      continue;
    }
    if (arg === '--out-dir') {
      opts.outDir = argv[++i];
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      opts.outDir = arg.slice('--out-dir='.length);
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || opts.reviewer;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || opts.reviewer;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.queues.push(arg);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = 20;
  if (!Number.isFinite(opts.packets) || opts.packets < 0) opts.packets = 0;
  return opts;
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function variantText(text) {
  let out = '';
  for (const char of String(text || '')) out += COMMON_VARIANTS.get(char) || char;
  return out;
}

function noPunctuationKey(text, { variants = false } = {}) {
  const normalized = normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC');
  const value = variants ? variantText(normalized) : normalized;
  return value.replace(/[^\p{Script=Han}0-9]/gu, '');
}

function exactVariantKey(text) {
  return variantText(normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC'));
}

function localLocations(item) {
  return item.localRange?.locations || [];
}

function sourceLocations(item) {
  return item.sourceRange?.locations || [];
}

function hasTableLocations(locations) {
  return locations.some((location) => (
    location.kind === 'cell'
    || String(location.blockType || '').startsWith('table')
  ));
}

function localHasOnlyTableCells(item) {
  const locations = localLocations(item);
  return locations.length > 0 && locations.every((location) => (
    location.kind === 'cell'
    || String(location.blockType || '').startsWith('table')
  ));
}

function localHasOnlyParagraphSentences(item) {
  const locations = localLocations(item);
  return locations.length > 0 && locations.every((location) => (
    location.kind === 'sentence'
    && String(location.blockType || '') === 'paragraph'
  ));
}

function localStartsParagraphs(item) {
  const locations = localLocations(item);
  return locations.length > 0 && locations.every((location) => Number(location.sentenceIndex || 0) === 0);
}

function sameAnchors(item) {
  return normalizeWhitespace(item.context?.beforeSource || '') === normalizeWhitespace(item.context?.beforeLocal || '')
    && normalizeWhitespace(item.context?.afterSource || '') === normalizeWhitespace(item.context?.afterLocal || '');
}

function isTitleLikeLocalExtra(text) {
  const value = normalizeWhitespace(text);
  if (!value || !HAN_RE.test(value)) return false;
  if (value.length > 80) return false;
  if (SENTENCE_END_RE.test(value)) return false;
  return !/[，、：；！？「」『』《》]/u.test(value);
}

function isTableRepeatFragment(text) {
  const value = normalizeWhitespace(text);
  if (!value || value.length > 32) return false;
  return TABLE_NUMERIC_FRAGMENT_RE.test(value);
}

function isTableNumericResidueNoop(item, sourceText, localText) {
  if (!sourceText || !localText) return false;
  if (!hasTableLocations(localLocations(item)) && !hasTableLocations(sourceLocations(item))) return false;
  if (!/\d/u.test(sourceText) || /\d/u.test(localText)) return false;
  if (!TABLE_NUMERIC_RESIDUE_CHARS_RE.test(sourceText) || !TABLE_NUMERIC_RESIDUE_CHARS_RE.test(localText)) return false;
  const strippedSource = sourceText.replace(/\d+/gu, '');
  return strippedSource !== sourceText && exactVariantKey(strippedSource) === exactVariantKey(localText);
}

function isLocalUiArtifact(text) {
  return LOCAL_UI_ARTIFACTS.has(normalizeWhitespace(text));
}

function isLocalWikiHeadingMarkup(text) {
  return LOCAL_WIKI_HEADING_MARKUP_RE.test(normalizeWhitespace(text));
}

function isLocalCollationMarker(text) {
  return LOCAL_COLLATION_MARKER_RE.test(normalizeWhitespace(text));
}

function stripUpstreamResidue(text) {
  return normalizeWhitespace(String(text || '')
    .replace(UPSTREAM_RESIDUE_TOKEN_RE, '')
    .replace(WIKI_PAGE_FIELD_RE, ''));
}

function stripSourceLayoutMarkers(text) {
  return String(text || '')
    .replace(/^\s*(?:\|\|)+/u, '')
    .replace(/^\s*::+/u, '')
    .replace(/：:+/gu, '：');
}

function isSourceLayoutMarkerNoop(sourceText, localText) {
  if (!sourceText || !localText) return false;
  const strippedSource = stripSourceLayoutMarkers(sourceText);
  if (strippedSource === sourceText) return false;
  return exactVariantKey(strippedSource) === exactVariantKey(localText);
}

function shortText(text, max = 220) {
  const value = normalizeWhitespace(text);
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function repairQueueItemKey(item, sourceFile, index) {
  return [
    sourceFile,
    index,
    item?.id || '',
    item?.book || '',
    item?.chapter || '',
    item?.ruleId || item?.type || '',
    item?.path || '',
    item?.sentenceId || '',
    item?.sourceName || '',
    item?.sourceRange?.text || '',
    item?.localRange?.text || '',
    item?.excerpt || '',
  ].join('\u241f');
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => REPAIR_QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      const base = path.basename(file);
      return [...opts.books].some((book) => base.includes(`-${book}.json`));
    })
    .sort();
}

function queueLabel(file) {
  const match = path.basename(file).match(REPAIR_QUEUE_RE);
  return match ? match[1] : path.basename(file, '.json');
}

function itemChapterKey(item) {
  return `${item.book || 'unknown'}/${item.chapter || 'unknown'}`;
}

function bookOrder(book) {
  const index = CHRONOLOGICAL_ORDER.indexOf(book);
  return index === -1 ? 9999 : index;
}

function compareChapterKeys(a, b) {
  const [bookA, chapterA] = a.split('/');
  const [bookB, chapterB] = b.split('/');
  const order = bookOrder(bookA) - bookOrder(bookB);
  if (order !== 0) return order;
  const bookCompare = bookA.localeCompare(bookB);
  if (bookCompare !== 0) return bookCompare;
  return chapterA.localeCompare(chapterB, 'en', { numeric: true });
}

function classifyItem(item) {
  if (item.ruleId === 'SOURCE_PRIVATE_USE_GLYPH') {
    return {
      className: 'source-private-use-glyph',
      action: 'manual-source-check',
      reason: 'Local Chinese source contains a private-use glyph; resolve against the upstream witness and manually update English if the source changes.',
    };
  }

  if (item.ruleId === 'SOURCE_KANA_PLACEHOLDER') {
    return {
      className: 'source-kana-placeholder',
      action: 'manual-source-check',
      reason: 'Local Chinese source contains a kana placeholder; resolve against the upstream witness and manually update English if the source changes.',
    };
  }

  if (item.ruleId) {
    return {
      className: 'source-artifact-review',
      action: 'manual-source-check',
      reason: 'Source artifact scanner reported a local corpus artifact; inspect against upstream before changing source text.',
    };
  }

  const sourceText = item.sourceRange?.text || '';
  const localText = item.localRange?.text || '';
  const sourceKey = noPunctuationKey(sourceText);
  const localKey = noPunctuationKey(localText);
  const sourceVariantKey = noPunctuationKey(sourceText, { variants: true });
  const localVariantKey = noPunctuationKey(localText, { variants: true });
  const type = item.type || 'unknown';
  const severity = Number(item.severity || 0);

  if (sourceText && localText && exactVariantKey(sourceText) === exactVariantKey(localText) && sourceText !== localText) {
    return {
      className: 'safe-variant-noop',
      action: 'deny-noop',
      reason: 'Source and local text differ only by approved graph variants with equivalent punctuation.',
    };
  }

  if (isSourceLayoutMarkerNoop(sourceText, localText)) {
    return {
      className: 'source-layout-marker-noop',
      action: 'deny-noop',
      reason: 'External raw witness differs only by table/list layout markers or duplicate punctuation.',
    };
  }

  if (sourceText && localText && sourceKey && sourceKey === localKey && sourceText !== localText) {
    return {
      className: 'punctuation-only',
      action: 'batch-punctuation-review',
      reason: 'Han/digit content matches exactly after removing punctuation; review punctuation placement or apply source punctuation fix.',
    };
  }

  if (sourceText && localText && sourceVariantKey && sourceVariantKey === localVariantKey && sourceText !== localText) {
    return {
      className: 'variant-or-punctuation',
      action: 'batch-punctuation-review',
      reason: 'Text matches after approved graph variants and punctuation are normalized.',
    };
  }

  if (isTableNumericResidueNoop(item, sourceText, localText)) {
    return {
      className: 'table-numeric-residue-noop',
      action: 'deny-noop',
      reason: 'External raw table witness differs only by stray Arabic numeric residue; local table text is already correct.',
    };
  }

  if (UPSTREAM_RESIDUE_RE.test(sourceText) && (!localText || !UPSTREAM_RESIDUE_RE.test(localText))) {
    const strippedSource = stripUpstreamResidue(sourceText);
    const strippedSourceKey = noPunctuationKey(strippedSource, { variants: true });
    if (
      !strippedSourceKey
      || (localText && exactVariantKey(strippedSource) === exactVariantKey(localText))
    ) {
      return {
        className: 'safe-upstream-residue-noop',
        action: 'deny-noop',
        reason: 'External witness differs only by removable MediaWiki/source-page residue.',
      };
    }
    if (localText && strippedSourceKey === localVariantKey) {
      return {
        className: 'residue-plus-punctuation',
        action: 'batch-punctuation-review',
        reason: 'After stripping residue, the remaining source/local text matches by content but punctuation or variants differ.',
      };
    }
    return {
      className: 'upstream-residue-boundary-review',
      action: 'manual-source-check',
      reason: 'External witness contains residue, but the remaining source span is not equivalent to local; review as a scrape-boundary/source mismatch.',
    };
  }

  if (
    sourceText
    && localText
    && item.sourceRange?.startIndex === 0
    && item.localRange?.startIndex === 0
    && item.localRange?.count > item.sourceRange?.count
    && localVariantKey.endsWith(sourceVariantKey)
  ) {
    return {
      className: 'chapter-start-heading-noop',
      action: 'manual-deny-candidate',
      reason: 'Local chapter start has title/opening units before the upstream witness text; usually a heading/opening false positive.',
    };
  }

  if (!sourceText && localText && type === 'local_extra_candidate') {
    if (isLocalUiArtifact(localText)) {
      return {
        className: 'local-ui-artifact',
        action: 'remove-local-artifact',
        reason: 'Local-only text is a known scraped UI artifact and should be removed from corpus source and translation fields.',
      };
    }

    if (isLocalCollationMarker(localText)) {
      return {
        className: 'local-source-note-marker',
        action: 'remove-local-artifact',
        reason: 'Local-only text is a source collation-note marker, not chapter content; remove the marker unit and translation fields.',
      };
    }

    if (isLocalWikiHeadingMarkup(localText)) {
      return {
        className: 'local-heading-markup',
        action: 'clean-local-heading-markup',
        reason: 'Local-only heading still contains MediaWiki heading markers; clean the heading text before resolving the queue item.',
      };
    }

    if (sameAnchors(item) && localHasOnlyTableCells(item) && isTableRepeatFragment(localText)) {
      return {
        className: 'table-cell-repeat-noop',
        action: 'deny-noop',
        reason: 'Local table cell preserves a short repeated/date fragment while the upstream raw witness collapses the table boundary.',
      };
    }

    if (sameAnchors(item) && localHasOnlyParagraphSentences(item) && localStartsParagraphs(item) && isTitleLikeLocalExtra(localText)) {
      return {
        className: 'section-heading-noop',
        action: 'deny-noop',
        reason: 'Local unit is a standalone structural heading between identical source anchors; keep it and deny the queue item.',
      };
    }

    if (localHasOnlyTableCells(item)) {
      return {
        className: 'table-structure-review',
        action: 'batch-table-review',
        reason: 'Local-only text occurs inside a table cell; review by row/cell rather than as ordinary prose omission.',
      };
    }

    if (localHasOnlyParagraphSentences(item) && localStartsParagraphs(item) && isTitleLikeLocalExtra(localText)) {
      return {
        className: 'section-heading-review',
        action: 'manual-deny-candidate',
        reason: 'Local-only text looks like a standalone heading, but anchors differ; inspect before denying.',
      };
    }
  }

  if (
    sourceText
    && localText
    && (hasTableLocations(localLocations(item)) || hasTableLocations(sourceLocations(item)))
  ) {
    return {
      className: 'table-structure-review',
      action: 'batch-table-review',
      reason: 'Difference touches table cells; review the whole row/table context before changing source text.',
    };
  }

  if (!localText && type === 'source_omission_candidate') {
    return {
      className: severity >= 3 ? 'probable-source-omission' : 'minor-source-omission',
      action: 'manual-translate-if-accepted',
      reason: 'External source has text absent from local JSON; if accepted, insert Chinese and manually translate.',
    };
  }

  if (!sourceText && type === 'local_extra_candidate') {
    return {
      className: severity >= 3 ? 'probable-local-extra' : 'minor-local-extra',
      action: 'manual-source-check',
      reason: 'Local text has no matching upstream span; decide whether local preserves valid source text or should be removed.',
    };
  }

  if (sourceText && CLOSE_PUNCT_RE.test(sourceText)) {
    return {
      className: 'leading-close-punctuation',
      action: 'batch-punctuation-review',
      reason: 'Upstream span begins with closing punctuation; often means the close mark belongs to the previous local unit.',
    };
  }

  if (type === 'source_replacement_candidate' && severity >= 3) {
    return {
      className: 'major-replacement',
      action: 'manual-source-check',
      reason: 'Local and upstream ranges diverge substantially between anchors.',
    };
  }

  if (type === 'text_discrepancy_candidate') {
    return {
      className: 'text-discrepancy',
      action: 'manual-or-variant-review',
      reason: 'Single-span source/local wording differs; usually edition variant, glyph repair, or punctuation.',
    };
  }

  return {
    className: 'other-source-discrepancy',
    action: 'manual-source-check',
    reason: 'No high-confidence pattern matched.',
  };
}

function addCount(map, key, inc = 1) {
  map[key] = (map[key] || 0) + inc;
}

function loadItems(opts) {
  const records = [];
  const queues = [];
  const seen = new Set();

  for (const file of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    queues.push({ file, queue });
    for (const [index, item] of (queue.items || queue.hits || []).entries()) {
      const key = repairQueueItemKey(item, file, index);
      if (seen.has(key)) continue;
      seen.add(key);
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      if (opts.sourceNames.size > 0 && !opts.sourceNames.has(item.sourceName)) continue;
      const classification = classifyItem(item);
      if (opts.classFilter && classification.className !== opts.classFilter) continue;
      records.push({
        queueFile: file,
        queueIndex: index,
        queueLabel: queueLabel(file),
        item,
        classification,
      });
    }
  }

  records.sort((a, b) => {
    const chapterCompare = compareChapterKeys(itemChapterKey(a.item), itemChapterKey(b.item));
    if (chapterCompare !== 0) return chapterCompare;
    return String(a.item.id).localeCompare(String(b.item.id));
  });

  return { queues, records };
}

function summarize(records, { includeAllChapters = false } = {}) {
  const byChapter = {};
  const byChapterClass = {};
  const summary = {
    pendingItems: records.length,
    byClass: {},
    byAction: {},
    byTypeSeverity: {},
    byBook: {},
    fastLanes: {
      safeNoopCandidates: 0,
      manualTranslationCandidates: 0,
      tableReviewCandidates: 0,
      punctuationCandidates: 0,
      localArtifactRemovals: 0,
      localHeadingMarkupCleanups: 0,
      sourceArtifactCandidates: 0,
      manualSourceChecks: 0,
    },
  };

  for (const record of records) {
    const item = record.item;
    const className = record.classification.className;
    const action = record.classification.action;
    const typeSeverity = `${item.type || 'unknown'}|sev${item.severity ?? 'unknown'}`;
    const book = item.book || 'unknown';
    const chapter = itemChapterKey(item);
    addCount(summary.byClass, className);
    addCount(summary.byAction, action);
    addCount(summary.byTypeSeverity, typeSeverity);
    addCount(summary.byBook, book);
    addCount(byChapter, chapter);
    byChapterClass[chapter] ||= {};
    addCount(byChapterClass[chapter], className);

    if (SAFE_DENIAL_NOTES.has(className)) summary.fastLanes.safeNoopCandidates += 1;
    if (action === 'manual-translate-if-accepted') summary.fastLanes.manualTranslationCandidates += 1;
    if (action === 'batch-table-review') summary.fastLanes.tableReviewCandidates += 1;
    if (action === 'batch-punctuation-review') summary.fastLanes.punctuationCandidates += 1;
    if (action === 'remove-local-artifact') summary.fastLanes.localArtifactRemovals += 1;
    if (action === 'clean-local-heading-markup') summary.fastLanes.localHeadingMarkupCleanups += 1;
    if (item.ruleId) summary.fastLanes.sourceArtifactCandidates += 1;
    if (action === 'manual-source-check' || action === 'manual-or-variant-review') summary.fastLanes.manualSourceChecks += 1;
  }

  summary.nextChapters = Object.entries(byChapter)
    .sort(([a], [b]) => compareChapterKeys(a, b))
    .slice(0, 20)
    .map(([chapter, pending]) => ({ chapter, pending }));
  summary.nextSafeNoopChapters = Object.entries(byChapterClass)
    .map(([chapter, classes]) => ({
      chapter,
      pending: byChapter[chapter],
      safeNoopCandidates: Object.entries(classes)
        .filter(([className]) => SAFE_DENIAL_NOTES.has(className))
        .reduce((sum, [, count]) => sum + count, 0),
    }))
    .filter((entry) => entry.safeNoopCandidates > 0)
    .sort((a, b) => b.safeNoopCandidates - a.safeNoopCandidates || compareChapterKeys(a.chapter, b.chapter))
    .slice(0, 20);
  summary.nextManualTranslationChapters = Object.entries(byChapterClass)
    .map(([chapter, classes]) => ({
      chapter,
      pending: byChapter[chapter],
      manualTranslationCandidates: (classes['probable-source-omission'] || 0) + (classes['minor-source-omission'] || 0),
    }))
    .filter((entry) => entry.manualTranslationCandidates > 0)
    .sort((a, b) => b.manualTranslationCandidates - a.manualTranslationCandidates || compareChapterKeys(a.chapter, b.chapter))
    .slice(0, 20);
  if (includeAllChapters) summary.byChapter = byChapter;

  return summary;
}

function statusLine(summary) {
  const topClasses = Object.entries(summary.byClass)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => `  ${name}: ${count}`)
    .join('\n');
  const topBooks = Object.entries(summary.byBook)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => `  ${name}: ${count}`)
    .join('\n');
  const next = summary.nextChapters
    .slice(0, 10)
    .map(({ chapter, pending }) => `  ${chapter}: ${pending}`)
    .join('\n');
  const safeNoop = summary.nextSafeNoopChapters
    .slice(0, 10)
    .map(({ chapter, safeNoopCandidates, pending }) => `  ${chapter}: ${safeNoopCandidates}/${pending}`)
    .join('\n');
  return [
    `Pending items in scope: ${summary.pendingItems}`,
    `Fast lanes: ${JSON.stringify(summary.fastLanes)}`,
    '',
    'Top classes:',
    topClasses || '  none',
    '',
    'Top books:',
    topBooks || '  none',
    '',
    'Best safe no-op batches:',
    safeNoop || '  none',
    '',
    'Next chapters:',
    next || '  none',
  ].join('\n');
}

function itemForJson(record) {
  const item = record.item;
  return {
    id: item.id,
    queueIndex: record.queueIndex,
    book: item.book,
    chapter: item.chapter,
    queueFile: record.queueFile,
    sourceName: item.sourceName,
    type: item.type,
    severity: item.severity,
    className: record.classification.className,
    action: record.classification.action,
    reason: record.classification.reason,
    sourceText: item.sourceRange?.text || item.found || '',
    localText: item.localRange?.text || item.excerpt || '',
    ruleId: item.ruleId,
    path: item.path,
    sentenceId: item.sentenceId,
    found: item.found,
    excerpt: item.excerpt,
    beforeSource: item.context?.beforeSource || '',
    afterSource: item.context?.afterSource || '',
    beforeLocal: item.context?.beforeLocal || '',
    afterLocal: item.context?.afterLocal || '',
    localIds: item.localRange?.ids || [],
    localLocations: item.localRange?.locations || [],
    sourceLocations: item.sourceRange?.locations || [],
  };
}

function escapeFence(text) {
  return String(text || '').replace(/```/g, "'''");
}

function packetMarkdown(chapterKey, records) {
  const [book, chapter] = chapterKey.split('/');
  const counts = summarize(records);
  const lines = [
    `# Repair Packet: ${book} ${chapter}`,
    '',
    `Pending items: ${records.length}`,
    '',
    '## Class Summary',
    '',
    ...Object.entries(counts.byClass)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `- ${name}: ${count}`),
    '',
    '## Items',
  ];

  for (const record of records) {
    const item = record.item;
    const classification = record.classification;
    lines.push(
      '',
      `### ${item.id}`,
      '',
      `- type: ${item.type || 'unknown'}`,
      `- severity: ${item.severity ?? 'unknown'}`,
      `- class: ${classification.className}`,
      `- suggested action: ${classification.action}`,
      `- reason: ${classification.reason}`,
      `- local ids: ${(item.localRange?.ids || []).join(', ') || 'none'}`,
      `- local locations: ${(item.localRange?.locations || []).map((location) => [
        location.blockType || 'unknown',
        location.kind || 'unit',
        location.cellIndex !== undefined ? `cell ${location.cellIndex}` : null,
        location.sentenceIndex !== undefined ? `sentence ${location.sentenceIndex}` : null,
      ].filter(Boolean).join('/')).join('; ') || 'none'}`,
      '',
      'Context:',
      '',
      `- before source: ${shortText(item.context?.beforeSource || '') || '(none)'}`,
      `- before local: ${shortText(item.context?.beforeLocal || '') || '(none)'}`,
      `- after source: ${shortText(item.context?.afterSource || '') || '(none)'}`,
      `- after local: ${shortText(item.context?.afterLocal || '') || '(none)'}`,
      '',
      'Source:',
      '',
      '```text',
      escapeFence(item.sourceRange?.text || ''),
      '```',
      '',
      'Local:',
      '',
      '```text',
      escapeFence(item.localRange?.text || ''),
      '```',
    );
  }

  return `${lines.join('\n')}\n`;
}

function writePackets(records, opts) {
  if (opts.packets <= 0 || records.length === 0) return [];

  const grouped = new Map();
  for (const record of records) {
    const key = itemChapterKey(record.item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }

  const selected = [...grouped.entries()]
    .sort(([a], [b]) => compareChapterKeys(a, b))
    .slice(0, opts.packets);

  fs.mkdirSync(opts.outDir, { recursive: true });
  const written = [];
  for (const [chapterKey, chapterRecords] of selected) {
    const [book, chapter] = chapterKey.split('/');
    const base = `${book}-${chapter}`;
    const mdPath = path.join(opts.outDir, `${base}.md`);
    const jsonPath = path.join(opts.outDir, `${base}.json`);
    fs.writeFileSync(mdPath, packetMarkdown(chapterKey, chapterRecords), 'utf8');
    fs.writeFileSync(jsonPath, `${JSON.stringify(chapterRecords.map(itemForJson), null, 2)}\n`, 'utf8');
    written.push({ chapter: chapterKey, markdown: mdPath, json: jsonPath, items: chapterRecords.length });
  }
  return written;
}

function applySafeDenials(queues, opts, now) {
  const touched = [];
  let marked = 0;

  for (const { file, queue } of queues) {
    let changed = false;
    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      if (opts.sourceNames.size > 0 && !opts.sourceNames.has(item.sourceName)) continue;
      const classification = classifyItem(item);
      if (!SAFE_DENIAL_NOTES.has(classification.className)) continue;
      if (opts.classFilter && opts.classFilter !== classification.className) continue;
      item.status = 'denied';
      item.decision = 'denied';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.notes = appendNote(item.notes, SAFE_DENIAL_NOTES.get(classification.className));
      changed = true;
      marked += 1;
    }
    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      touched.push(file);
    }
  }

  return { marked, touched };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { queues, records } = loadItems(opts);
  const summary = summarize(records, { includeAllChapters: opts.includeAllChapters });
  const packets = writePackets(records, opts);
  let applied = null;

  if (opts.applySafeDenials) {
    applied = applySafeDenials(queues, opts, new Date().toISOString());
  }

  const result = { summary, packets, applied, sample: records.slice(0, opts.limit).map(itemForJson) };

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(statusLine(summary));
  if (packets.length > 0) {
    console.log('');
    console.log('Wrote packets:');
    for (const packet of packets) {
      console.log(`  ${packet.chapter}: ${packet.items} item(s)`);
      console.log(`    ${packet.markdown}`);
      console.log(`    ${packet.json}`);
    }
  }
  if (applied) {
    console.log('');
    console.log(`Applied safe no-op denials: ${applied.marked}`);
    for (const file of applied.touched) console.log(`  ${file}`);
  }
  if (records.length > 0 && opts.limit > 0) {
    console.log('');
    console.log(`Sample (${Math.min(opts.limit, records.length)}):`);
    for (const record of records.slice(0, opts.limit)) {
      const item = record.item;
      console.log(`  ${item.id} ${item.book}/${item.chapter} ${record.classification.className} ${item.type || 'unknown'} sev${item.severity ?? 'unknown'}`);
      console.log(`    ${record.classification.action}: ${record.classification.reason}`);
      console.log(`    source: ${shortText(item.sourceRange?.text || '')}`);
      console.log(`    local:  ${shortText(item.localRange?.text || '')}`);
    }
  }
}

export {
  classifyItem,
  compareChapterKeys,
  itemChapterKey,
  itemForJson,
  loadItems,
  queueLabel,
  statusOf,
  summarize,
  variantText,
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
