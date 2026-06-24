#!/usr/bin/env node
/**
 * Workbench for moving through the source repair queue in larger, safer units.
 *
 * This script does not translate. It helps find repeated queue patterns, write
 * editable decision packets, and copy reviewed decisions back into queue files.
 */

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  compareChapterKeys,
  itemChapterKey,
  itemForJson,
  loadItems,
  summarize,
  variantText,
} from './triage-repair-queue.mjs';

const DEFAULT_PACKET_DIR = path.join(process.cwd(), 'data', 'quality', 'repair-packets', 'workbench');
const DEFAULT_REVIEWER = 'repair-queue-workbench';
const WIKI_TABLE_CLASS_RE = /\bclass\s*=\s*["']?wikitable\b|class="wikitable"/iu;
const WIKI_TABLE_ATTR_RE = /\b(?:style|colspan|rowspan|width|height|align|valign)\s*=/iu;
const WIKI_TABLE_SEPARATOR_RE = /(?:\|\||!!|\|-|\{\||\|\})/u;
const TABLE_NUMERIC_RESIDUE_RE = /^[0-9０-９一二三四五六七八九十百千萬万廿卅卌元正閏年月日朔晦春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥\s，、。；：！？「」『』（）()\-.]+$/u;
const LOW_RISK_NOOP_CLASSES = new Set([
  'safe-variant-noop',
  'safe-upstream-residue-noop',
  'source-layout-marker-noop',
  'section-heading-noop',
  'table-cell-repeat-noop',
  'table-numeric-residue-noop',
]);
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const HAN_RE = /\p{Script=Han}/u;
const PUNCT_RE = /[^\p{Script=Han}0-9\s]/gu;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const LEADING_CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const TRAILING_CLOSE_RE = /[」』”）)\]】〉》]+$/u;
const SEMANTIC_GRAPH_RISK_PAIRS = new Set([
  '谷⇄穀',
  '穀⇄谷',
  '后⇄後',
  '後⇄后',
  '干⇄乾',
  '乾⇄干',
  '余⇄餘',
  '餘⇄余',
  '歷⇄曆',
  '曆⇄歷',
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-queue-workbench.mjs plan [--book BOOK] [--class CLASS]
  node scripts/repair-queue-workbench.mjs packet [--book BOOK] [--chapter CH]
    [--class CLASS] [--group GROUP_ID] [--packet-size N] [--out-dir DIR]
    [--graph-pair SOURCE⇄LOCAL]
    [--prefill-default] [--prefill-graph-source-approve]
    [--prefill-existing-english]
    [--default-decision DECISION] [--default-notes TEXT]
    [--default-preserve-existing-translations]
    [--default-translation-review-note TEXT]
  node scripts/repair-queue-workbench.mjs apply --decisions PACKET.json [--dry-run]
    [--apply-source] [--source-dry-run] [--rebuild] [--progress] [--validate]

Useful commands:
  npm run quality:repair-workbench
  npm run quality:repair-workbench:packet -- --class text-discrepancy --group <id>
  npm run quality:repair-workbench:apply -- --decisions data/quality/repair-packets/workbench/<packet>.json
  npm run quality:repair-workbench:finish:dry-run -- --decisions data/quality/repair-packets/workbench/<packet>.json
  npm run quality:repair-workbench:finish -- --decisions data/quality/repair-packets/workbench/<packet>.json`);
}

function parseArgs(argv) {
  const args = [...argv];
  const command = args[0] && !args[0].startsWith('-') ? args.shift() : 'plan';
  const opts = {
    command,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    sourceNames: new Set(),
    classFilter: null,
    json: false,
    limit: 20,
    groupLimit: 20,
    minGroup: 2,
    packetSize: 80,
    outDir: DEFAULT_PACKET_DIR,
    groupId: null,
    graphPair: null,
    decisionsFile: null,
    dryRun: false,
    applySource: false,
    sourceDryRun: false,
    rebuild: false,
    refreshProgress: false,
    validate: false,
    prefillDefault: false,
    prefillGraphSourceApprove: false,
    defaultDecision: null,
    defaultNotes: null,
    defaultPreserveExistingTranslations: false,
    defaultTranslationReviewNote: '',
    prefillExistingEnglish: false,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--apply-source') {
      opts.applySource = true;
      continue;
    }
    if (arg === '--source-dry-run') {
      opts.sourceDryRun = true;
      continue;
    }
    if (arg === '--rebuild') {
      opts.rebuild = true;
      continue;
    }
    if (arg === '--progress') {
      opts.refreshProgress = true;
      continue;
    }
    if (arg === '--validate') {
      opts.validate = true;
      continue;
    }
    if (arg === '--prefill-default') {
      opts.prefillDefault = true;
      continue;
    }
    if (arg === '--prefill-graph-source-approve') {
      opts.prefillGraphSourceApprove = true;
      continue;
    }
    if (arg === '--prefill-existing-english') {
      opts.prefillExistingEnglish = true;
      continue;
    }
    if (arg === '--default-preserve-existing-translations') {
      opts.defaultPreserveExistingTranslations = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(args[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(args[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(args[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--source-name') {
      opts.sourceNames.add(args[++i]);
      continue;
    }
    if (arg.startsWith('--source-name=')) {
      opts.sourceNames.add(arg.slice('--source-name='.length));
      continue;
    }
    if (arg === '--graph-pair') {
      opts.graphPair = args[++i] || '';
      continue;
    }
    if (arg.startsWith('--graph-pair=')) {
      opts.graphPair = arg.slice('--graph-pair='.length);
      continue;
    }
    if (arg === '--class') {
      opts.classFilter = args[++i];
      continue;
    }
    if (arg.startsWith('--class=')) {
      opts.classFilter = arg.slice('--class='.length);
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(args[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--group-limit') {
      opts.groupLimit = Number(args[++i]);
      continue;
    }
    if (arg.startsWith('--group-limit=')) {
      opts.groupLimit = Number(arg.slice('--group-limit='.length));
      continue;
    }
    if (arg === '--min-group') {
      opts.minGroup = Number(args[++i]);
      continue;
    }
    if (arg.startsWith('--min-group=')) {
      opts.minGroup = Number(arg.slice('--min-group='.length));
      continue;
    }
    if (arg === '--packet-size') {
      opts.packetSize = Number(args[++i]);
      continue;
    }
    if (arg.startsWith('--packet-size=')) {
      opts.packetSize = Number(arg.slice('--packet-size='.length));
      continue;
    }
    if (arg === '--out-dir') {
      opts.outDir = args[++i];
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      opts.outDir = arg.slice('--out-dir='.length);
      continue;
    }
    if (arg === '--default-decision') {
      opts.defaultDecision = args[++i];
      continue;
    }
    if (arg.startsWith('--default-decision=')) {
      opts.defaultDecision = arg.slice('--default-decision='.length);
      continue;
    }
    if (arg === '--default-notes') {
      opts.defaultNotes = args[++i] || '';
      continue;
    }
    if (arg.startsWith('--default-notes=')) {
      opts.defaultNotes = arg.slice('--default-notes='.length);
      continue;
    }
    if (arg === '--default-translation-review-note') {
      opts.defaultTranslationReviewNote = args[++i] || '';
      continue;
    }
    if (arg.startsWith('--default-translation-review-note=')) {
      opts.defaultTranslationReviewNote = arg.slice('--default-translation-review-note='.length);
      continue;
    }
    if (arg === '--group') {
      opts.groupId = args[++i];
      continue;
    }
    if (arg.startsWith('--group=')) {
      opts.groupId = arg.slice('--group='.length);
      continue;
    }
    if (arg === '--decisions') {
      opts.decisionsFile = args[++i];
      continue;
    }
    if (arg.startsWith('--decisions=')) {
      opts.decisionsFile = arg.slice('--decisions='.length);
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = args[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.queues.push(arg);
  }

  for (const key of ['limit', 'groupLimit', 'minGroup', 'packetSize']) {
    if (!Number.isFinite(opts[key]) || opts[key] < 0) opts[key] = key === 'minGroup' ? 2 : 20;
  }
  if (!['plan', 'packet', 'apply'].includes(opts.command)) {
    console.error(`Unknown command: ${opts.command}`);
    usage();
    process.exit(2);
  }
  if (opts.command === 'apply' && !opts.decisionsFile) {
    console.error('Missing --decisions PACKET.json.');
    usage();
    process.exit(2);
  }
  return opts;
}

function triageOpts(opts) {
  return {
    books: opts.books,
    chapters: opts.chapters,
    queues: opts.queues,
    sourceNames: opts.sourceNames,
    classFilter: opts.classFilter,
    json: false,
    limit: opts.limit,
    packets: 0,
    outDir: opts.outDir,
    applySafeDenials: false,
    includeAllChapters: false,
    reviewer: opts.reviewer,
  };
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function contentKey(text) {
  return normalizeWhitespace(text).replace(/[^\p{Script=Han}0-9]/gu, '');
}

function punctuationSignature(text) {
  const marks = normalizeWhitespace(text).match(PUNCT_RE) || [];
  if (marks.length === 0) return 'none';
  return marks.join('').slice(0, 80);
}

function sourceText(record) {
  const item = record.item;
  return item.sourceRange?.text || item.found || '';
}

function localText(record) {
  const item = record.item;
  return item.localRange?.text || item.excerpt || '';
}

function shortText(text, max = 96) {
  const value = normalizeWhitespace(text);
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

function shortProseText(text, max = 140) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

function lengthBucket(text) {
  const length = [...normalizeWhitespace(text)].length;
  if (length <= 8) return 'tiny';
  if (length <= 24) return 'short';
  if (length <= 80) return 'medium';
  if (length <= 200) return 'long';
  return 'very-long';
}

function locationKind(record) {
  const locations = [
    ...(record.item.localRange?.locations || []),
    ...(record.item.sourceRange?.locations || []),
  ];
  if (locations.some((location) => location.kind === 'cell' || String(location.blockType || '').startsWith('table'))) {
    return 'table';
  }
  if (locations.some((location) => location.kind === 'sentence')) return 'paragraph';
  return 'unknown-location';
}

function hashId(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 10);
}

function charDiffPairs(source, local, maxPairs = 4) {
  const left = [...contentKey(source)];
  const right = [...contentKey(local)];
  if (left.length === 0 || right.length === 0 || left.length !== right.length) return [];

  const pairs = [];
  for (let i = 0; i < left.length; i += 1) {
    if (left[i] === right[i]) continue;
    if (!HAN_OR_DIGIT_RE.test(left[i]) || !HAN_OR_DIGIT_RE.test(right[i])) return [];
    pairs.push(`${left[i]}⇄${right[i]}`);
    if (pairs.length > maxPairs) return [];
  }
  return pairs;
}

function splitGraphPair(pair) {
  return String(pair || '')
    .split('⇄')
    .map((part) => part.trim())
    .filter(Boolean);
}

function graphPairMatches(candidate, requested) {
  const left = splitGraphPair(candidate);
  const right = splitGraphPair(requested);
  if (left.length !== 2 || right.length !== 2) return false;
  return (
    (left[0] === right[0] && left[1] === right[1])
    || (left[0] === right[1] && left[1] === right[0])
  );
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function unitSourceText(entry) {
  if (!entry) return '';
  return String(entry.unit?.[entry.field] || '');
}

function firstEnglishTranslation(unit) {
  const translations = Array.isArray(unit?.translations) ? unit.translations : [];
  const row = translations.find((translation) => translation?.lang === 'en') || translations[0] || {};
  return {
    literal: String(row.literal || unit?.literal || '').trim(),
    idiomatic: String(row.idiomatic || row.translation || unit?.idiomatic || unit?.translation || '').trim(),
    translator: String(row.translator || unit?.translator || '').trim(),
    model: String(row.model || unit?.model || '').trim(),
    reviewed: row.reviewed === true || unit?.reviewed === true,
  };
}

function flattenCurrentUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    const collections = [
      ['sentences', block?.sentences, 'sentence'],
      ['cells', block?.cells, 'cell'],
    ];
    for (const [collectionName, collection, kind] of collections) {
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
          blockType: block?.type || collectionName,
          kind,
          unitIndex,
          flatIndex: units.length,
        });
      }
    }
  }
  return units;
}

const currentChapterCache = new Map();

function currentChapterFile(item) {
  return item.file || path.join('data', item.book || '', `${item.chapter || ''}.json`);
}

function loadCurrentChapter(file) {
  if (!currentChapterCache.has(file)) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const units = flattenCurrentUnits(chapter);
    currentChapterCache.set(file, {
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
    });
  }
  return currentChapterCache.get(file);
}

function unitForPacket(entry, role) {
  const translation = firstEnglishTranslation(entry?.unit || {});
  return {
    role,
    id: entry?.id || '',
    blockIndex: entry?.blockIndex,
    blockType: entry?.blockType || '',
    kind: entry?.kind || '',
    unitIndex: entry?.unitIndex,
    field: entry?.field || '',
    text: unitSourceText(entry),
    literal: translation.literal,
    idiomatic: translation.idiomatic,
    translator: translation.translator,
    model: translation.model,
    reviewed: translation.reviewed,
  };
}

function adjustedSourcePreview(item, currentContext = {}) {
  let text = item.sourceRange?.text || item.found || '';
  const before = currentContext.previousText || item.context?.beforeLocal || '';
  const after = currentContext.nextText || item.context?.afterLocal || '';
  const afterSource = item.context?.afterSource || '';

  if (before && TRAILING_CLOSE_RE.test(before) && LEADING_CLOSE_RE.test(text)) {
    text = text.replace(LEADING_CLOSE_RE, '');
  }

  const trailingClose = String(afterSource || '').match(LEADING_CLOSE_RE)?.[0] || '';
  if (trailingClose && !LEADING_CLOSE_RE.test(after) && !TRAILING_CLOSE_RE.test(text)) {
    text += trailingClose;
  }

  return text;
}

function currentReviewContext(record, radius = 1) {
  const item = record.item;
  const file = currentChapterFile(item);
  if (!file || !fs.existsSync(file)) {
    return {
      file,
      error: 'Current chapter file was not found.',
      localIdsFound: false,
      currentLocalText: '',
      currentLocalUnits: [],
      neighboringUnits: [],
      reviewHints: ['chapter-file-missing'],
    };
  }

  const current = loadCurrentChapter(file);
  const ids = item.localRange?.ids || [];
  const entries = ids.map((id) => current.byId.get(id)).filter(Boolean);
  const foundAll = ids.length > 0 && entries.length === ids.length;
  const flatIndices = entries.map((entry) => entry.flatIndex);
  const start = flatIndices.length > 0 ? Math.min(...flatIndices) : -1;
  const end = flatIndices.length > 0 ? Math.max(...flatIndices) : -1;
  const neighbors = start >= 0
    ? current.units
      .slice(Math.max(0, start - radius), Math.min(current.units.length, end + radius + 1))
      .map((entry) => unitForPacket(entry, entries.includes(entry) ? 'target' : 'context'))
    : [];
  const previousEntry = start > 0 ? current.units[start - 1] : null;
  const nextEntry = end >= 0 && end + 1 < current.units.length ? current.units[end + 1] : null;
  const tableBlockIndexes = new Set(
    entries
      .filter((entry) => entry.kind === 'cell' || entry.blockType === 'table_row')
      .map((entry) => entry.blockIndex),
  );
  const tableRowUnits = tableBlockIndexes.size > 0
    ? current.units
      .filter((entry) => tableBlockIndexes.has(entry.blockIndex))
      .map((entry) => unitForPacket(entry, entries.includes(entry) ? 'target' : 'row-context'))
    : [];
  const graphPairs = charDiffPairs(sourceText(record), localText(record));
  const hints = [];
  const source = sourceText(record);
  const afterSource = item.context?.afterSource || '';

  if (record.classification.action === 'manual-translate-if-accepted') {
    hints.push('manual-translation-required-if-accepted');
  }
  if (locationKind(record) === 'table' || record.classification.className === 'table-structure-review') {
    hints.push('review-whole-table-row-or-table');
  }
  if (LEADING_CLOSE_RE.test(source) || LEADING_CLOSE_RE.test(afterSource)) {
    hints.push('quote-boundary-check-required');
  }
  if (graphPairs.length > 0) {
    hints.push('graph-pair-review');
    if (graphPairs.some((pair) => SEMANTIC_GRAPH_RISK_PAIRS.has(pair))) {
      hints.push('semantic-graph-risk-check-english');
    } else {
      hints.push('english-usually-preservable-after-manual-check');
    }
  }
  if (foundAll && entries.length === 1 && graphPairs.length > 0 && firstEnglishTranslation(entries[0].unit).idiomatic) {
    hints.push('single-current-unit-with-existing-english');
  }

  return {
    file,
    localIdsFound: foundAll,
    adjustedSourcePreview: adjustedSourcePreview(item, {
      previousText: unitSourceText(previousEntry),
      nextText: unitSourceText(nextEntry),
    }),
    currentLocalText: entries.map(unitSourceText).join(''),
    currentLocalUnits: entries.map((entry) => unitForPacket(entry, 'target')),
    neighboringUnits: neighbors,
    tableRowUnits,
    reviewHints: hints,
  };
}

function repeatedTextKey(prefix, text) {
  const value = normalizeWhitespace(text);
  if (!value) return `${prefix}:empty`;
  if ([...value].length <= 80) return `${prefix}:exact:${value}`;
  return `${prefix}:${lengthBucket(value)}:${value.slice(0, 24)}…${value.slice(-24)}`;
}

function patternKey(record) {
  const className = record.classification.className;
  const action = record.classification.action;
  const item = record.item;
  const source = sourceText(record);
  const local = localText(record);
  const pairs = charDiffPairs(source, local);

  if (pairs.length > 0) {
    return `graph-diff:${pairs.sort().join('|')}`;
  }
  if (source && local && (className.includes('punctuation') || className === 'leading-close-punctuation')) {
    return `punctuation:${punctuationSignature(source)}=>${punctuationSignature(local)}`;
  }
  if (locationKind(record) === 'table' || className === 'table-structure-review') {
    const type = item.type || 'unknown';
    const severity = item.severity ?? 'unknown';
    if (WIKI_TABLE_CLASS_RE.test(source)) {
      return `table-markup:wikitable:${type}:sev${severity}`;
    }
    if (WIKI_TABLE_ATTR_RE.test(source)) {
      return `table-markup:attributes:${type}:sev${severity}`;
    }
    if (WIKI_TABLE_SEPARATOR_RE.test(source)) {
      return `table-markup:cell-separators:${type}:sev${severity}`;
    }
    if (source && local && TABLE_NUMERIC_RESIDUE_RE.test(source) && TABLE_NUMERIC_RESIDUE_RE.test(local)) {
      return `table-residue:numeric-or-date:${type}:sev${severity}`;
    }
  }
  if (source && !local) {
    return repeatedTextKey(`${className}:source-only`, source);
  }
  if (!source && local) {
    return repeatedTextKey(`${className}:local-only`, local);
  }
  if (source && local && [...normalizeWhitespace(source)].length <= 80 && [...normalizeWhitespace(local)].length <= 80) {
    return `replacement-exact:${className}:${normalizeWhitespace(source)}=>${normalizeWhitespace(local)}`;
  }
  if (locationKind(record) === 'table') {
    return `table:${className}:${item.type || 'unknown'}:sev${item.severity ?? 'unknown'}`;
  }
  return `broad:${[
    className,
    action,
    item.type || 'unknown',
    `sev${item.severity ?? 'unknown'}`,
    `${lengthBucket(source)}-source`,
    `${lengthBucket(local)}-local`,
  ].join(':')}`;
}

function addCount(map, key, inc = 1) {
  map[key] = (map[key] || 0) + inc;
}

function groupRecords(records, opts = {}) {
  const groups = new Map();
  for (const record of records) {
    const key = patternKey(record);
    let group = groups.get(key);
    if (!group) {
      group = {
        id: hashId(key),
        key,
        count: 0,
        byClass: {},
        byAction: {},
        byBook: {},
        chapters: new Set(),
        records: [],
      };
      groups.set(key, group);
    }
    group.count += 1;
    addCount(group.byClass, record.classification.className);
    addCount(group.byAction, record.classification.action);
    addCount(group.byBook, record.item.book || 'unknown');
    group.chapters.add(itemChapterKey(record.item));
    if (group.records.length < 8) group.records.push(record);
  }

  return [...groups.values()]
    .filter((group) => group.count >= opts.minGroup)
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .map((group) => ({
      ...group,
      chapters: [...group.chapters].sort(compareChapterKeys),
      examples: group.records.map((record) => ({
        id: record.item.id,
        chapter: itemChapterKey(record.item),
        source: shortText(sourceText(record)),
        local: shortText(localText(record)),
      })),
    }));
}

function variantCandidates(records, limit = 30) {
  const stats = new Map();
  for (const record of records) {
    const source = sourceText(record);
    const local = localText(record);
    if (!source || !local) continue;
    const pairs = charDiffPairs(source, local, 3);
    if (pairs.length === 0 || pairs.length > 3) continue;
    for (const pair of new Set(pairs)) {
      const [left, right] = pair.split('⇄');
      if (!HAN_RE.test(left) || !HAN_RE.test(right)) continue;
      if (variantText(left) === variantText(right)) continue;
      const entry = stats.get(pair) || {
        pair,
        count: 0,
        classes: {},
        examples: [],
      };
      entry.count += 1;
      addCount(entry.classes, record.classification.className);
      if (entry.examples.length < 5) {
        entry.examples.push({
          id: record.item.id,
          chapter: itemChapterKey(record.item),
          source: shortText(source, 80),
          local: shortText(local, 80),
        });
      }
      stats.set(pair, entry);
    }
  }

  return [...stats.values()]
    .sort((a, b) => b.count - a.count || a.pair.localeCompare(b.pair))
    .slice(0, limit);
}

function chapterBatches(records, limit = 30) {
  const chapters = new Map();
  for (const record of records) {
    const key = itemChapterKey(record.item);
    const entry = chapters.get(key) || {
      chapter: key,
      pending: 0,
      byClass: {},
      byAction: {},
      severity2: 0,
      severity3: 0,
    };
    entry.pending += 1;
    addCount(entry.byClass, record.classification.className);
    addCount(entry.byAction, record.classification.action);
    if (Number(record.item.severity || 0) === 2) entry.severity2 += 1;
    if (Number(record.item.severity || 0) >= 3) entry.severity3 += 1;
    chapters.set(key, entry);
  }

  const all = [...chapters.values()];
  return {
    largest: [...all].sort((a, b) => b.pending - a.pending || compareChapterKeys(a.chapter, b.chapter)).slice(0, limit),
    chronological: [...all].sort((a, b) => compareChapterKeys(a.chapter, b.chapter)).slice(0, limit),
  };
}

function buildPlan(records, opts) {
  const groups = groupRecords(records, { minGroup: opts.minGroup });
  const summary = summarize(records);
  const actionableGroups = groups.filter((group) => !group.key.startsWith('broad:'));
  return {
    generatedAt: new Date().toISOString(),
    scope: scopeForJson(opts),
    summary,
    recommendedWorkflow: [
      'Run plan to identify a repeated pattern group or high-impact chapter.',
      'Generate a packet for that group/chapter.',
      'Edit only the packet decision fields: deny, approve, applied, or skip.',
      'For approved Chinese source insertions/changes, add manualTranslations in the packet before applying decisions.',
      'Apply packet decisions back to the queue, then run the source apply script for approved source-correspondence items.',
    ],
    topPatternGroups: actionableGroups.slice(0, opts.groupLimit).map(groupForJson),
    topVariantCandidates: variantCandidates(records, opts.groupLimit),
    chapterBatches: chapterBatches(records, opts.groupLimit),
  };
}

function scopeForJson(opts) {
  return {
    books: [...opts.books],
    chapters: [...opts.chapters],
    queues: opts.queues,
    sourceNames: [...opts.sourceNames],
    classFilter: opts.classFilter,
    graphPair: opts.graphPair,
  };
}

function groupForJson(group) {
  const lane = laneRecommendation(group);
  return {
    id: group.id,
    count: group.count,
    key: group.key,
    lane,
    byClass: group.byClass,
    byAction: group.byAction,
    byBook: group.byBook,
    chapterCount: group.chapters.length,
    firstChapters: group.chapters.slice(0, 12),
    examples: group.examples,
  };
}

function firstDominant(map) {
  return Object.entries(map || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || ['unknown', 0];
}

function laneRecommendation(group) {
  const [topClass] = firstDominant(group.byClass);
  const [topAction] = firstDominant(group.byAction);
  const key = group.key;
  const base = {
    kind: 'mixed-review',
    risk: 'high',
    suggestedDefaultDecision: 'skip',
    suggestedDefaultNotes: '',
    requiresManualTranslation: topAction === 'manual-translate-if-accepted',
    prefersChapterContext: false,
    reviewHint: 'Review as a normal source dispute; avoid batch decisions until examples show a stable pattern.',
    packetCommand: `npm run quality:repair-workbench:packet -- --group ${group.id} --packet-size 80`,
  };

  if (LOW_RISK_NOOP_CLASSES.has(topClass) && Object.keys(group.byClass).length === 1) {
    return {
      ...base,
      kind: 'verified-noop',
      risk: 'low',
      suggestedDefaultDecision: 'deny',
      suggestedDefaultNotes: 'Reviewed as no-op from a repeated low-risk repair lane; local corpus retained.',
      reviewHint: 'Sample a few examples across books, then this lane can usually be denied as queue-only metadata.',
    };
  }

  if (key.startsWith('graph-diff:')) {
    return {
      ...base,
      kind: 'graph-pair',
      risk: group.count >= 10 ? 'medium' : 'medium-high',
      reviewHint: 'Audit the graph pair once in context, then process a packet by pair. If upstream is clearly correct, approve and apply source edits; if it is only an edition preference, deny.',
    };
  }

  if (key.startsWith('punctuation:') || topClass === 'leading-close-punctuation' || topClass === 'variant-or-punctuation') {
    return {
      ...base,
      kind: 'punctuation-boundary',
      risk: 'medium',
      reviewHint: 'Use punctuation/quote-boundary helpers first, then review any survivors in packets. English punctuation must be checked with the matching Chinese sentence.',
    };
  }

  if (key.startsWith('table-markup:')) {
    return {
      ...base,
      kind: 'table-markup-boundary',
      risk: 'medium-high',
      prefersChapterContext: true,
      reviewHint: 'This looks like raw Wikisource table markup or collapsed table cells. Work by chapter/table, not isolated sentence, and deny only when the local table already preserves the content.',
      packetCommand: `npm run quality:repair-workbench:packet -- --class table-structure-review --group ${group.id} --packet-size 120`,
    };
  }

  if (key.startsWith('table-residue:')) {
    return {
      ...base,
      kind: 'table-residue',
      risk: 'medium',
      prefersChapterContext: true,
      reviewHint: 'Likely row/date/index residue from a table scrape. Review row context and clear in larger packets when the local table content is already intact.',
      packetCommand: `npm run quality:repair-workbench:packet -- --class table-structure-review --group ${group.id} --packet-size 120`,
    };
  }

  if (topClass === 'table-structure-review') {
    return {
      ...base,
      kind: 'table-content-review',
      risk: 'high',
      prefersChapterContext: true,
      reviewHint: 'Table context is required. Prefer largest chapter packets so row/cell alignment can be judged as a unit.',
      packetCommand: `npm run quality:repair-workbench:packet -- --class table-structure-review --group ${group.id} --packet-size 80`,
    };
  }

  if (topAction === 'manual-translate-if-accepted') {
    return {
      ...base,
      kind: 'source-omission',
      risk: 'high',
      requiresManualTranslation: true,
      reviewHint: 'If accepted, insert the Chinese and write the English translation manually before marking applied.',
    };
  }

  if (topAction === 'manual-deny-candidate') {
    return {
      ...base,
      kind: 'likely-heading-or-local-extra',
      risk: 'medium-high',
      reviewHint: 'Often a heading or retained local structural unit, but anchors differ; sample before denying.',
    };
  }

  return base;
}

function topEntries(map, limit = 3) {
  return Object.entries(map || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
}

function printPlan(plan, opts) {
  const lines = [
    `Pending items in scope: ${plan.summary.pendingItems}`,
    `Fast lanes: ${JSON.stringify(plan.summary.fastLanes)}`,
    '',
    'Next workflow:',
    '  1. Pick a pattern group or chapter below.',
    '  2. Generate a packet, edit decisions, then apply that packet.',
    '  3. Run source apply/build only after approved Chinese source edits are translated.',
    '',
    'Top pattern groups:',
  ];

  if (plan.topPatternGroups.length === 0) {
    lines.push('  none');
  } else {
    for (const group of plan.topPatternGroups) {
      lines.push(`  ${group.id} count=${group.count} classes=[${topEntries(group.byClass)}] chapters=${group.chapterCount}`);
      lines.push(`    lane: ${group.lane.kind} risk=${group.lane.risk}`);
      lines.push(`    ${group.key}`);
      lines.push(`    hint: ${group.lane.reviewHint}`);
      lines.push(`    packet: ${group.lane.packetCommand}`);
      for (const example of group.examples.slice(0, 2)) {
        lines.push(`    - ${example.id} ${example.chapter}`);
        lines.push(`      source: ${example.source || '(none)'}`);
        lines.push(`      local:  ${example.local || '(none)'}`);
      }
    }
  }

  lines.push('', 'Top graph-pair candidates (review before treating as variants):');
  if (plan.topVariantCandidates.length === 0) {
    lines.push('  none');
  } else {
    for (const candidate of plan.topVariantCandidates.slice(0, opts.limit)) {
      lines.push(`  ${candidate.pair} count=${candidate.count} classes=[${topEntries(candidate.classes)}]`);
      for (const example of candidate.examples.slice(0, 2)) {
        lines.push(`    - ${example.id} ${example.chapter}: ${example.source} / ${example.local}`);
      }
    }
  }

  lines.push('', 'Largest chapter packets:');
  for (const chapter of plan.chapterBatches.largest.slice(0, opts.limit)) {
    lines.push(`  ${chapter.chapter}: ${chapter.pending} pending, actions=[${topEntries(chapter.byAction, 4)}]`);
  }

  lines.push('', 'Packet command examples:');
  lines.push('  npm run quality:repair-workbench:packet -- --group <group-id> --packet-size 80');
  lines.push('  npm run quality:repair-workbench:graph-packet -- --graph-pair "里⇄裏" --packet-size 80');
  lines.push('  npm run quality:repair-workbench:packet -- --book houhanshu --chapter 007 --packet-size 80');
  lines.push('  npm run quality:repair-workbench:apply -- --decisions data/quality/repair-packets/workbench/<packet>.json');
  console.log(lines.join('\n'));
}

function existingEnglishManualTranslations(item) {
  const context = item.currentReviewContext || {};
  const source = String(context.adjustedSourcePreview || item.sourceText || '').trim();
  const currentUnits = Array.isArray(context.currentLocalUnits) ? context.currentLocalUnits : [];
  if (!source || currentUnits.length !== 1) return [];

  const current = currentUnits[0];
  const graphPairs = charDiffPairs(source, current.text || '');
  if (graphPairs.length === 0) return [];
  if (contentKey(source).length !== contentKey(current.text || '').length) return [];

  const literal = String(current.literal || current.idiomatic || '').trim();
  const idiomatic = String(current.idiomatic || current.literal || '').trim();
  if (!literal || !idiomatic) return [];

  return [{
    zh: source,
    literal,
    idiomatic,
    translator: current.translator || 'Garrett M. Petersen (2026)',
    model: current.model || 'Existing English retained after source repair',
  }];
}

function packetItem(record, opts = {}) {
  const item = itemForJson(record);
  const packetRecord = {
    ...item,
    queueFile: path.relative(process.cwd(), item.queueFile),
    currentReviewContext: currentReviewContext(record),
    decision: 'pending',
    notes: '',
    preserveExistingTranslations: null,
    translationReviewNote: '',
    manualTranslations: [],
  };

  if (opts.prefillExistingEnglish) {
    packetRecord.manualTranslations = existingEnglishManualTranslations(packetRecord);
  }

  return packetRecord;
}

function escapeFence(text) {
  return String(text || '').replace(/```/g, "'''");
}

function packetMarkdown(packet) {
  const lines = [
    `# Repair Decision Packet: ${packet.name}`,
    '',
    `Generated: ${packet.generatedAt}`,
    `Items: ${packet.items.length}`,
    '',
    packet.recommendation
      ? `Lane: ${packet.recommendation.kind} (risk: ${packet.recommendation.risk})`
      : '',
    packet.recommendation?.reviewHint
      ? `Review hint: ${packet.recommendation.reviewHint}`
      : '',
    '',
    'Edit the JSON packet, not this Markdown file. Set each item decision to one of:',
    '',
    '- `deny`: local corpus/source retained; queue item is rejected.',
    '- `approve`: queue item is approved for source application; add `manualTranslations` first if Chinese text changes or is inserted.',
    '- `applied`: source/translation was already fixed manually; queue item is marked complete.',
    '- `skip`: leave untouched.',
    '',
    'For repeated same-decision packets, set top-level `defaultDecision` and',
    '`defaultNotes`; per-item decisions override the default.',
    'For reviewed graph-only source fixes whose English still fits, set',
    '`defaultPreserveExistingTranslations: true` with a',
    '`defaultTranslationReviewNote`; item-level false disables it.',
    '',
    'When approving a Chinese source change whose existing English translation',
    'has been manually checked and still fits, set',
    '`preserveExistingTranslations: true` and add a `translationReviewNote`.',
    'Use `manualTranslations` instead whenever the English needs to change or',
    'new Chinese source units are inserted.',
    '',
    'Apply edited decisions with:',
    '',
    '```bash',
    `npm run quality:repair-workbench:apply -- --decisions ${packet.jsonPath}`,
    '```',
    '',
    '## Items',
  ];

  for (const item of packet.items) {
    lines.push(
      '',
      `### ${item.id}`,
      '',
      `- chapter: ${item.book}/${item.chapter}`,
      `- class: ${item.className}`,
      `- action: ${item.action}`,
      `- severity: ${item.severity ?? 'unknown'}`,
      `- local ids: ${(item.localIds || []).join(', ') || 'none'}`,
      '',
      `before source: ${shortText(item.beforeSource) || '(none)'}`,
      `before local: ${shortText(item.beforeLocal) || '(none)'}`,
      `after source: ${shortText(item.afterSource) || '(none)'}`,
      `after local: ${shortText(item.afterLocal) || '(none)'}`,
      '',
      `adjusted source preview: ${shortText(item.currentReviewContext?.adjustedSourcePreview || '') || '(none)'}`,
      `current local: ${shortText(item.currentReviewContext?.currentLocalText || '') || '(none)'}`,
      `review hints: ${(item.currentReviewContext?.reviewHints || []).join(', ') || 'none'}`,
      '',
      'Source:',
      '',
      '```text',
      escapeFence(item.sourceText),
      '```',
      '',
      'Local:',
      '',
      '```text',
      escapeFence(item.localText),
      '```',
    );
    if (item.currentReviewContext?.neighboringUnits?.length > 0) {
      lines.push('', 'Current corpus context:', '');
      for (const unit of item.currentReviewContext.neighboringUnits) {
        const marker = unit.role === 'target' ? '*' : '-';
        lines.push(`${marker} ${unit.id || '(no id)'} ${unit.blockType}/${unit.kind}: ${shortText(unit.text, 140)}`);
        if (unit.literal || unit.idiomatic) {
          lines.push(`  literal: ${shortProseText(unit.literal, 140) || '(none)'}`);
          lines.push(`  idiomatic: ${shortProseText(unit.idiomatic, 140) || '(none)'}`);
        }
      }
    }
    if (item.currentReviewContext?.tableRowUnits?.length > 0) {
      lines.push('', 'Current table row:', '');
      for (const unit of item.currentReviewContext.tableRowUnits) {
        const marker = unit.role === 'target' ? '*' : '-';
        lines.push(`${marker} ${unit.id || '(no id)'} cell ${unit.unitIndex}: ${shortText(unit.text, 160)}`);
        if (unit.literal || unit.idiomatic) {
          lines.push(`  literal: ${shortProseText(unit.literal, 160) || '(none)'}`);
          lines.push(`  idiomatic: ${shortProseText(unit.idiomatic, 160) || '(none)'}`);
        }
      }
    }
    if (item.manualTranslations?.length > 0) {
      lines.push('', 'Prefilled existing-English candidate:', '');
      for (const row of item.manualTranslations) {
        lines.push(`- zh: ${shortText(row.zh, 140)}`);
        lines.push(`  literal: ${shortProseText(row.literal, 180)}`);
        lines.push(`  idiomatic: ${shortProseText(row.idiomatic, 180)}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

function timestampForFile() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/u, 'Z');
}

function safeSlug(value) {
  return String(value || 'packet')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 80) || 'packet';
}

function selectPacketRecords(records, opts) {
  if (opts.groupId && opts.graphPair) {
    throw new Error('Use either --group or --graph-pair, not both.');
  }
  if (opts.graphPair) {
    const pair = String(opts.graphPair || '').trim();
    if (splitGraphPair(pair).length !== 2) {
      throw new Error('--graph-pair must look like SOURCE⇄LOCAL, for example 里⇄裏.');
    }
    return records
      .filter((record) => {
        const pairs = charDiffPairs(sourceText(record), localText(record));
        return pairs.length > 0 && pairs.every((candidate) => graphPairMatches(candidate, pair));
      })
      .slice(0, opts.packetSize);
  }
  if (!opts.groupId) return records.slice(0, opts.packetSize);

  const groups = groupRecords(records, { minGroup: 1 });
  const group = groups.find((candidate) => candidate.id === opts.groupId);
  if (!group) {
    throw new Error(`No pattern group found for id ${opts.groupId}. Run plan again to see current group IDs.`);
  }
  return records
    .filter((record) => patternKey(record) === group.key)
    .slice(0, opts.packetSize);
}

function writePacket(records, opts) {
  const selected = selectPacketRecords(records, opts);
  if (selected.length === 0) throw new Error('No records matched the requested packet scope.');
  const groupsForRecommendation = opts.groupId
    ? groupRecords(records, { minGroup: 1 }).filter((group) => group.id === opts.groupId)
    : groupRecords(selected, { minGroup: 1 });
  const packetRecommendation = opts.graphPair
    ? {
      kind: 'graph-pair',
      risk: selected.length >= 10 ? 'medium' : 'medium-high',
      suggestedDefaultDecision: 'skip',
      suggestedDefaultNotes: '',
      requiresManualTranslation: false,
      prefersChapterContext: false,
      reviewHint: `Audit graph pair ${opts.graphPair} in context. If upstream is clearly correct, approve and apply source edits; if it is only an edition preference, deny.`,
    }
    : groupsForRecommendation.length === 1
    ? laneRecommendation(groupsForRecommendation[0])
    : {
      kind: 'mixed-review',
      risk: 'high',
      suggestedDefaultDecision: 'skip',
      suggestedDefaultNotes: '',
      requiresManualTranslation: selected.some((record) => record.classification.action === 'manual-translate-if-accepted'),
      prefersChapterContext: false,
      reviewHint: 'Mixed packet; make item-level decisions.',
    };
  if (opts.prefillGraphSourceApprove && packetRecommendation.kind !== 'graph-pair') {
    throw new Error('--prefill-graph-source-approve can only be used with a graph-pair packet.');
  }

  fs.mkdirSync(opts.outDir, { recursive: true });
  const scopePart = opts.groupId
    ? `group-${opts.groupId}`
    : opts.graphPair
      ? `graph-${hashId(opts.graphPair)}`
    : [
      opts.classFilter || 'mixed',
      [...opts.books].join('-'),
      [...opts.chapters].join('-'),
    ].filter(Boolean).join('-');
  const base = `${timestampForFile()}-${safeSlug(scopePart)}`;
  const jsonPath = path.join(opts.outDir, `${base}.json`);
  const mdPath = path.join(opts.outDir, `${base}.md`);
  const defaultDecision = opts.defaultDecision
    || (opts.prefillGraphSourceApprove ? 'approve' : null)
    || (opts.prefillDefault ? packetRecommendation.suggestedDefaultDecision : 'skip');
  const defaultNotes = opts.defaultNotes !== null
    ? opts.defaultNotes
    : opts.prefillGraphSourceApprove
      ? 'Reviewed graph-pair lane; upstream graph form accepted for source text after checking item context.'
      : opts.prefillDefault
        ? packetRecommendation.suggestedDefaultNotes
        : '';
  const defaultPreserveExistingTranslations = opts.defaultPreserveExistingTranslations
    || opts.prefillGraphSourceApprove;
  const defaultTranslationReviewNote = opts.defaultTranslationReviewNote
    || (opts.prefillGraphSourceApprove
      ? 'Existing English translation manually checked for this graph-only source repair and retained.'
      : '');
  const prefillExistingEnglish = opts.prefillExistingEnglish || opts.prefillGraphSourceApprove;
  const packet = {
    schema: 'repair-decision-packet/v1',
    name: base,
    generatedAt: new Date().toISOString(),
    scope: scopeForJson(opts),
    groupId: opts.groupId,
    jsonPath: path.relative(process.cwd(), jsonPath),
    markdownPath: path.relative(process.cwd(), mdPath),
    instructions: [
      'Set decision to deny, approve, applied, or skip.',
      'For same-decision batches, set defaultDecision/defaultNotes instead of editing every item.',
      'Do not approve Chinese source insertions or changes until manualTranslations are supplied.',
      'For reviewed graph-only source fixes, defaultPreserveExistingTranslations may be true after checking the English still fits.',
      'Prefilled manualTranslations copy existing English only; confirm they still fit before applying.',
      'Run quality:repair-workbench:apply after editing this packet.',
    ],
    recommendation: packetRecommendation,
    defaultDecision,
    defaultNotes,
    defaultPreserveExistingTranslations,
    defaultTranslationReviewNote,
    prefillExistingEnglish,
    items: selected.map((record) => packetItem(record, { prefillExistingEnglish })),
  };

  fs.writeFileSync(jsonPath, `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  fs.writeFileSync(mdPath, packetMarkdown(packet), 'utf8');
  return { packet, jsonPath, mdPath };
}

function normalizeDecision(value) {
  const decision = String(value || '').trim().toLowerCase();
  if (!decision || decision === 'pending' || decision === 'skip') return 'skip';
  if (['deny', 'denied', 'reject', 'rejected'].includes(decision)) return 'deny';
  if (['approve', 'approved', 'accept', 'accepted'].includes(decision)) return 'approve';
  if (['applied', 'included', 'done', 'fixed'].includes(decision)) return 'applied';
  throw new Error(`Unknown packet decision: ${value}`);
}

function queueItems(queue) {
  return queue.items || queue.hits || [];
}

function resolveQueuePath(queueFile, packetDir) {
  if (!queueFile) throw new Error('Packet item is missing queueFile.');
  if (path.isAbsolute(queueFile)) return queueFile;
  const fromCwd = path.resolve(process.cwd(), queueFile);
  if (fs.existsSync(fromCwd)) return fromCwd;
  return path.resolve(packetDir, queueFile);
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  const next = String(addition || '').trim();
  if (!next) return current;
  if (!current) return next;
  if (current.includes(next)) return current;
  return `${current}\n${next}`;
}

function addToMapList(map, key, value) {
  const list = map.get(key) || [];
  list.push(value);
  map.set(key, list);
}

function shellQuote(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:@=,+-]+$/u.test(text)) return text;
  return `'${text.replace(/'/g, "'\\''")}'`;
}

function commandString(parts) {
  return parts.map(shellQuote).join(' ');
}

function sourceCorrespondenceQueue(queuePath) {
  return path.basename(queuePath).startsWith('source-correspondence');
}

function packetItemBook(packetItemRecord) {
  if (packetItemRecord.book) return packetItemRecord.book;
  const file = packetItemRecord.file || packetItemRecord.chapterFile || '';
  const match = String(file).match(/(?:^|\/)data\/([^/]+)\//u);
  if (match) return match[1];
  const chapter = packetItemRecord.chapter || '';
  if (String(chapter).includes('/')) return String(chapter).split('/')[0];
  return '';
}

function bookFromDataFile(file) {
  const match = String(file || '').match(/(?:^|\/)data\/([^/]+)\//u);
  return match ? match[1] : '';
}

function runCommand(command, args, { parseJson = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 80 * 1024 * 1024,
  });
  const commandText = commandString([command, ...args]);
  const report = {
    command: commandText,
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error([
      `${commandText} failed with status ${result.status}`,
      report.stderr.trim(),
      report.stdout.trim(),
    ].filter(Boolean).join('\n'));
  }
  if (parseJson) {
    try {
      report.json = JSON.parse(report.stdout);
    } catch (error) {
      throw new Error(`${commandText} did not return JSON: ${error.message}\n${report.stdout.slice(0, 1000)}`);
    }
  }
  return report;
}

function compactCommandReport(report) {
  const tail = (text) => String(text || '').trim().slice(-3000);
  return {
    command: report.command,
    status: report.status,
    stdout: tail(report.stdout),
    stderr: tail(report.stderr),
  };
}

function sourceApplyArgs(queue, ids, opts) {
  const args = [
    'scripts/apply-source-correspondence.mjs',
    '--queue',
    queue,
    '--item',
    ids.join(','),
  ];
  if (opts.dryRun || opts.sourceDryRun) args.push('--dry-run');
  return args;
}

function sourceApplyCommand(queue, ids, opts = {}) {
  return commandString([
    process.execPath,
    ...sourceApplyArgs(queue, ids, opts),
  ]);
}

function applyDecisionToItem(queueItem, packetItemRecord, decision, opts, now) {
  const notes = packetItemRecord.effectiveNotes ?? packetItemRecord.notes;
  if (decision === 'deny') {
    queueItem.status = 'denied';
    queueItem.decision = 'denied';
    queueItem.notes = appendNote(queueItem.notes, notes || 'Reviewed from repair decision packet; local corpus retained.');
  } else if (decision === 'approve') {
    queueItem.status = 'approved';
    queueItem.decision = 'approved';
    queueItem.notes = appendNote(queueItem.notes, notes || 'Approved from repair decision packet; pending source application.');
    if (Array.isArray(packetItemRecord.manualTranslations) && packetItemRecord.manualTranslations.length > 0) {
      queueItem.manualTranslations = packetItemRecord.manualTranslations;
    }
    if (packetItemRecord.preserveExistingTranslations === true) {
      queueItem.preserveExistingTranslations = true;
      queueItem.translationReviewNote = String(packetItemRecord.translationReviewNote || '').trim()
        || 'Existing English translation manually checked and retained for this source repair.';
      queueItem.notes = appendNote(queueItem.notes, queueItem.translationReviewNote);
    }
  } else if (decision === 'applied') {
    queueItem.status = 'applied';
    queueItem.decision = 'included';
    queueItem.notes = appendNote(queueItem.notes, notes || 'Marked complete from repair decision packet after manual source/translation repair.');
  }
  queueItem.reviewedAt = queueItem.reviewedAt || now;
  queueItem.reviewer = queueItem.reviewer || opts.reviewer;
}

function applyPacketDefaults(packet, packetItemRecord, decision) {
  if (decision !== 'approve') return;
  if (
    packet.defaultPreserveExistingTranslations === true
    && packetItemRecord.preserveExistingTranslations !== false
  ) {
    packetItemRecord.preserveExistingTranslations = true;
  }
  if (
    packetItemRecord.preserveExistingTranslations === true
    && !String(packetItemRecord.translationReviewNote || '').trim()
    && String(packet.defaultTranslationReviewNote || '').trim()
  ) {
    packetItemRecord.translationReviewNote = String(packet.defaultTranslationReviewNote || '').trim();
  }
}

function runSourceApplications(summary, sourceApplyItemsByQueue, opts) {
  for (const entry of summary.approvedSourceItemsByQueue) {
    const queue = sourceApplyItemsByQueue.tempQueues?.get(entry.queue) || entry.queue;
    const args = sourceApplyArgs(queue, entry.ids, opts);
    const report = runCommand(process.execPath, args, { parseJson: true });
    summary.sourceApplyReports.push(report.json);
    summary.sourceApplyCommandReports.push(compactCommandReport(report));

    for (const queueReport of report.json.queues || []) {
      for (const fileReport of queueReport.files || []) {
        const book = bookFromDataFile(fileReport.file);
        if (book) sourceApplyItemsByQueue.rebuildBooks.add(book);
      }
    }
  }
}

function runRebuilds(summary, touchedBooks, opts) {
  if (opts.dryRun || opts.sourceDryRun) {
    summary.rebuildSkipped = 'Dry-run mode; rebuild was not run.';
    return;
  }
  for (const book of [...touchedBooks].sort()) {
    const report = runCommand('make', ['update', `BOOK=${book}`]);
    summary.rebuildReports.push(compactCommandReport(report));
  }
}

function runProgress(summary, opts) {
  if (opts.dryRun || opts.sourceDryRun) {
    summary.progressSkipped = 'Dry-run mode; progress was not regenerated.';
    return;
  }
  const report = runCommand(process.execPath, ['generate-progress.js']);
  summary.progressReport = compactCommandReport(report);
}

function runValidate(summary, opts) {
  if (opts.dryRun || opts.sourceDryRun) {
    summary.validateSkipped = 'Dry-run mode; validation was not run.';
    return;
  }
  const report = runCommand('make', ['validate']);
  summary.validateReport = compactCommandReport(report);
}

function applyDecisions(opts) {
  const decisionsPath = path.resolve(opts.decisionsFile);
  const packet = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
  if (packet.schema !== 'repair-decision-packet/v1') {
    throw new Error(`Unsupported decision packet schema: ${packet.schema || 'missing'}`);
  }

  const packetDir = path.dirname(decisionsPath);
  const defaultDecision = normalizeDecision(packet.defaultDecision);
  const defaultNotes = String(packet.defaultNotes || '').trim();
  const queueCache = new Map();
  const sourceApplyItemsByQueue = new Map();
  sourceApplyItemsByQueue.affectedBooks = new Set();
  sourceApplyItemsByQueue.rebuildBooks = new Set();
  sourceApplyItemsByQueue.tempQueues = new Map();
  const now = new Date().toISOString();
  const summary = {
    packet: path.relative(process.cwd(), decisionsPath),
    dryRun: opts.dryRun,
    applySource: opts.applySource,
    sourceDryRun: opts.dryRun || opts.sourceDryRun,
    rebuild: opts.rebuild,
    progress: opts.refreshProgress,
    validate: opts.validate,
    skipped: 0,
    denied: 0,
    approved: 0,
    applied: 0,
    missing: [],
    touchedQueues: [],
    affectedBooks: [],
    touchedBooks: [],
    approvedSourceItemsByQueue: [],
    sourceApplyCommands: [],
    sourceApplyDryRunCommands: [],
    sourceApplyReports: [],
    sourceApplyCommandReports: [],
    rebuildReports: [],
    progressReport: null,
    validateReport: null,
    alreadyComplete: [],
    sourceDryRunTempDir: null,
  };

  for (const packetItemRecord of packet.items || []) {
    let decision = normalizeDecision(packetItemRecord.decision);
    const itemHasOwnDecision = !['', 'pending'].includes(String(packetItemRecord.decision || '').trim().toLowerCase());
    if (decision === 'skip' && !itemHasOwnDecision && defaultDecision !== 'skip') {
      decision = defaultDecision;
      packetItemRecord.effectiveNotes = packetItemRecord.notes || defaultNotes;
    }
    if (decision === 'skip') {
      summary.skipped += 1;
      continue;
    }
    applyPacketDefaults(packet, packetItemRecord, decision);
    const queuePath = resolveQueuePath(packetItemRecord.queueFile, packetDir);
    let cached = queueCache.get(queuePath);
    if (!cached) {
      cached = {
        path: queuePath,
        queue: JSON.parse(fs.readFileSync(queuePath, 'utf8')),
        changed: false,
      };
      queueCache.set(queuePath, cached);
    }

    const items = queueItems(cached.queue);
    const item = Number.isInteger(packetItemRecord.queueIndex)
      && items[packetItemRecord.queueIndex]?.id === packetItemRecord.id
      ? items[packetItemRecord.queueIndex]
      : items.find((candidate) => candidate.id === packetItemRecord.id);
    if (!item) {
      summary.missing.push({ id: packetItemRecord.id, queueFile: packetItemRecord.queueFile });
      continue;
    }
    if (
      (decision === 'approve' && (item.status === 'applied' || item.decision === 'applied'))
      || (decision === 'applied' && (item.status === 'applied' || item.decision === 'applied'))
      || (decision === 'deny' && (item.status === 'denied' || item.decision === 'denied'))
    ) {
      summary.alreadyComplete.push({ id: packetItemRecord.id, queueFile: packetItemRecord.queueFile });
      continue;
    }
    applyDecisionToItem(item, packetItemRecord, decision, opts, now);
    cached.changed = true;
    summary[decision === 'deny' ? 'denied' : decision === 'approve' ? 'approved' : 'applied'] += 1;

    const book = packetItemBook(packetItemRecord);
    if (book) sourceApplyItemsByQueue.affectedBooks.add(book);
    if (book && (decision === 'approve' || decision === 'applied')) {
      sourceApplyItemsByQueue.rebuildBooks.add(book);
    }
    if (decision === 'approve' && sourceCorrespondenceQueue(queuePath)) {
      addToMapList(sourceApplyItemsByQueue, path.relative(process.cwd(), queuePath), packetItemRecord.id);
    }
  }

  for (const cached of queueCache.values()) {
    if (!cached.changed) continue;
    summary.touchedQueues.push(path.relative(process.cwd(), cached.path));
    if (!opts.dryRun) fs.writeFileSync(cached.path, `${JSON.stringify(cached.queue, null, 2)}\n`, 'utf8');
  }

  summary.approvedSourceItemsByQueue = [...sourceApplyItemsByQueue.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([queue, ids]) => ({ queue, ids: [...new Set(ids)].sort() }));
  summary.sourceApplyCommands = summary.approvedSourceItemsByQueue
    .map((entry) => sourceApplyCommand(entry.queue, entry.ids, { dryRun: false, sourceDryRun: false }));
  summary.sourceApplyDryRunCommands = summary.approvedSourceItemsByQueue
    .map((entry) => sourceApplyCommand(entry.queue, entry.ids, { dryRun: true, sourceDryRun: true }));
  summary.affectedBooks = [...sourceApplyItemsByQueue.affectedBooks].sort();

  if (opts.applySource && opts.dryRun && summary.approvedSourceItemsByQueue.length > 0) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-packet-queue-'));
    summary.sourceDryRunTempDir = tempDir;
    for (const cached of queueCache.values()) {
      const originalQueue = path.relative(process.cwd(), cached.path);
      if (!sourceApplyItemsByQueue.has(originalQueue)) continue;
      const tempQueue = path.join(tempDir, path.basename(cached.path));
      fs.writeFileSync(tempQueue, `${JSON.stringify(cached.queue, null, 2)}\n`, 'utf8');
      sourceApplyItemsByQueue.tempQueues.set(originalQueue, tempQueue);
    }
  }

  if (opts.applySource) {
    runSourceApplications(summary, sourceApplyItemsByQueue, opts);
  }

  summary.touchedBooks = [...sourceApplyItemsByQueue.rebuildBooks].sort();

  if (opts.rebuild) {
    runRebuilds(summary, sourceApplyItemsByQueue.rebuildBooks, opts);
  }
  if (opts.refreshProgress || opts.rebuild) {
    runProgress(summary, opts);
  }
  if (opts.validate) {
    runValidate(summary, opts);
  }

  return summary;
}

function printApplySummary(summary) {
  const lines = [
    `Decision packet: ${summary.packet}`,
    `Dry run: ${summary.dryRun}`,
    `Source application requested: ${summary.applySource}`,
    `Source application dry run: ${summary.sourceDryRun}`,
    `Rebuild requested: ${summary.rebuild}`,
    `Progress refresh requested: ${summary.progress}`,
    `Validation requested: ${summary.validate}`,
    `Applied decisions: denied=${summary.denied}, approved=${summary.approved}, completed=${summary.applied}, skipped=${summary.skipped}`,
    `Touched queue files: ${summary.touchedQueues.length}`,
    ...summary.touchedQueues.map((file) => `  ${file}`),
    `Affected books: ${summary.affectedBooks.join(', ') || 'none'}`,
    `Books needing rebuild: ${summary.touchedBooks.join(', ') || 'none'}`,
    summary.missing.length ? `Missing item IDs: ${summary.missing.length}` : 'Missing item IDs: 0',
    summary.alreadyComplete.length ? `Already complete item IDs: ${summary.alreadyComplete.length}` : 'Already complete item IDs: 0',
  ];

  if (summary.sourceApplyCommands.length > 0) {
    lines.push('', 'Approved source-correspondence items in this packet:');
    for (const entry of summary.approvedSourceItemsByQueue) {
      lines.push(`  ${entry.queue}: ${entry.ids.length} item(s)`);
    }
    lines.push('', 'Packet-scoped source dry-run commands:');
    for (const command of summary.sourceApplyDryRunCommands) lines.push(`  ${command}`);
    lines.push('', 'Packet-scoped source apply commands:');
    for (const command of summary.sourceApplyCommands) lines.push(`  ${command}`);
  }

  if (summary.sourceApplyReports.length > 0) {
    const applied = summary.sourceApplyReports
      .flatMap((report) => report.queues || [])
      .reduce((sum, queue) => sum + Number(queue.appliedItems || 0), 0);
    lines.push('', `Source application reports: ${summary.sourceApplyReports.length}; applied items=${applied}`);
  }
  if (summary.rebuildReports.length > 0) {
    lines.push(`Rebuild commands completed: ${summary.rebuildReports.length}`);
  } else if (summary.rebuildSkipped) {
    lines.push(`Rebuild skipped: ${summary.rebuildSkipped}`);
  }
  if (summary.progressReport) lines.push('Progress regenerated.');
  else if (summary.progressSkipped) lines.push(`Progress skipped: ${summary.progressSkipped}`);
  if (summary.validateReport) lines.push('Validation completed.');
  else if (summary.validateSkipped) lines.push(`Validation skipped: ${summary.validateSkipped}`);

  console.log(lines.join('\n'));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.command === 'apply') {
    const summary = applyDecisions(opts);
    if (opts.json) console.log(JSON.stringify(summary, null, 2));
    else printApplySummary(summary);
    return;
  }

  const { records } = loadItems(triageOpts(opts));
  if (opts.command === 'plan') {
    const plan = buildPlan(records, opts);
    if (opts.json) console.log(JSON.stringify(plan, null, 2));
    else printPlan(plan, opts);
    return;
  }

  const written = writePacket(records, opts);
  if (opts.json) {
    console.log(JSON.stringify({
      jsonPath: path.relative(process.cwd(), written.jsonPath),
      markdownPath: path.relative(process.cwd(), written.mdPath),
      items: written.packet.items.length,
    }, null, 2));
    return;
  }
  console.log(`Wrote ${written.packet.items.length} item decision packet:`);
  console.log(`  ${path.relative(process.cwd(), written.jsonPath)}`);
  console.log(`  ${path.relative(process.cwd(), written.mdPath)}`);
}

main();
