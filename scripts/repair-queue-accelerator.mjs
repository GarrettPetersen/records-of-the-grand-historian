#!/usr/bin/env node
/**
 * One-command lane picker for the source repair queue.
 *
 * This script does not translate and does not accept source text. It helps the
 * repair loop move faster by showing the best safe metadata resolvers and the
 * highest-yield manual review packet to work next.
 */

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  compareChapterKeys,
  itemChapterKey,
  loadItems,
  summarize,
} from './triage-repair-queue.mjs';

const DEFAULT_REVIEWER = 'repair-queue-accelerator';
const WIKI_TABLE_CLASS_RE = /\bclass\s*=\s*["']?wikitable\b|class="wikitable"/iu;
const WIKI_TABLE_ATTR_RE = /\b(?:style|colspan|rowspan|width|height|align|valign)\s*=/iu;
const WIKI_TABLE_SEPARATOR_RE = /(?:\|\||!!|\|-|\{\||\|\})/u;
const TABLE_NUMERIC_RESIDUE_RE = /^[0-9０-９一二三四五六七八九十百千萬万廿卅卌元正閏年月日朔晦春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥\s，、。；：！？「」『』（）()\-.]+$/u;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const PUNCT_RE = /[^\p{Script=Han}0-9\s]/gu;
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
  '云⇄雲',
  '雲⇄云',
  '鍾⇄鐘',
  '鐘⇄鍾',
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-queue-accelerator.mjs plan [--book BOOK] [--chapter CH]
    [--class CLASS] [--json] [--skip-resolvers] [--group-limit N]
  node scripts/repair-queue-accelerator.mjs packet [--book BOOK] [--chapter CH]
    [--class CLASS] [--group GROUP_ID] [--packet-size N] [--dry-run]
    [--out-dir DIR] [--prefill-graph-source-approve]
  node scripts/repair-queue-accelerator.mjs safe [--book BOOK] [--chapter CH]
    [--apply] [--include-pattern-noops] [--allow-reopen]
  node scripts/repair-queue-accelerator.mjs cycle [--book BOOK] [--chapter CH]
    [--apply] [--packet-size N] [--dry-run]

Safe mode only runs queue-metadata resolvers by default. Pattern no-ops are
optional because they can reopen old automatic denials when they were too broad.`);
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
    skipResolvers: false,
    groupLimit: 8,
    minGroup: 2,
    packetSize: 80,
    outDir: null,
    groupId: null,
    dryRun: false,
    apply: false,
    includePatternNoops: false,
    allowReopen: false,
    prefillDefault: false,
    prefillGraphSourceApprove: false,
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
    if (arg === '--skip-resolvers') {
      opts.skipResolvers = true;
      continue;
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--include-pattern-noops') {
      opts.includePatternNoops = true;
      continue;
    }
    if (arg === '--allow-reopen') {
      opts.allowReopen = true;
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
    if (arg === '--class') {
      opts.classFilter = args[++i];
      continue;
    }
    if (arg.startsWith('--class=')) {
      opts.classFilter = arg.slice('--class='.length);
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
    if (arg === '--group') {
      opts.groupId = args[++i];
      continue;
    }
    if (arg.startsWith('--group=')) {
      opts.groupId = arg.slice('--group='.length);
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

  if (!['plan', 'packet', 'safe', 'cycle'].includes(opts.command)) {
    console.error(`Unknown command: ${opts.command}`);
    usage();
    process.exit(2);
  }
  for (const key of ['groupLimit', 'minGroup', 'packetSize']) {
    if (!Number.isFinite(opts[key]) || opts[key] < 0) opts[key] = key === 'minGroup' ? 2 : 8;
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
    limit: 0,
    packets: 0,
    outDir: '',
    applySafeDenials: false,
    includeAllChapters: false,
    reviewer: opts.reviewer,
  };
}

function scopeArgs(opts) {
  const args = [];
  for (const book of opts.books) args.push('--book', book);
  for (const chapter of opts.chapters) args.push('--chapter', chapter);
  for (const queue of opts.queues) args.push('--queue', queue);
  for (const sourceName of opts.sourceNames) args.push('--source-name', sourceName);
  if (opts.classFilter) args.push('--class', opts.classFilter);
  return args;
}

function resolverScopeArgs(opts) {
  const args = [];
  for (const book of opts.books) args.push('--book', book);
  for (const chapter of opts.chapters) args.push('--chapter', chapter);
  for (const queue of opts.queues) args.push('--queue', queue);
  return args;
}

function patternScopeArgs(opts) {
  const args = [];
  for (const book of opts.books) args.push('--book', book);
  return args;
}

function patternScopeSupported(opts) {
  return opts.chapters.size === 0
    && opts.queues.length === 0
    && opts.sourceNames.size === 0
    && !opts.classFilter;
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function contentKey(text) {
  return normalizeWhitespace(text).replace(/[^\p{Script=Han}0-9]/gu, '');
}

function punctuationSignature(text) {
  const marks = normalizeWhitespace(text).match(PUNCT_RE) || [];
  return marks.length > 0 ? marks.join('').slice(0, 80) : 'none';
}

function sourceText(record) {
  return record.item.sourceRange?.text || record.item.found || '';
}

function localText(record) {
  return record.item.localRange?.text || record.item.excerpt || '';
}

function shortText(text, max = 96) {
  const value = normalizeWhitespace(text);
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

function repeatedTextKey(prefix, text) {
  const value = normalizeWhitespace(text);
  if (!value) return `${prefix}:empty`;
  if ([...value].length <= 80) return `${prefix}:exact:${value}`;
  return `${prefix}:${lengthBucket(value)}:${value.slice(0, 24)}...${value.slice(-24)}`;
}

function patternKey(record) {
  const className = record.classification.className;
  const action = record.classification.action;
  const item = record.item;
  const source = sourceText(record);
  const local = localText(record);
  const pairs = charDiffPairs(source, local);

  if (pairs.length > 0) return `graph-diff:${pairs.sort().join('|')}`;
  if (source && local && (className.includes('punctuation') || className === 'leading-close-punctuation')) {
    return `punctuation:${punctuationSignature(source)}=>${punctuationSignature(local)}`;
  }
  if (locationKind(record) === 'table' || className === 'table-structure-review') {
    const type = item.type || 'unknown';
    const severity = item.severity ?? 'unknown';
    if (WIKI_TABLE_CLASS_RE.test(source)) return `table-markup:wikitable:${type}:sev${severity}`;
    if (WIKI_TABLE_ATTR_RE.test(source)) return `table-markup:attributes:${type}:sev${severity}`;
    if (WIKI_TABLE_SEPARATOR_RE.test(source)) return `table-markup:cell-separators:${type}:sev${severity}`;
    if (source && local && TABLE_NUMERIC_RESIDUE_RE.test(source) && TABLE_NUMERIC_RESIDUE_RE.test(local)) {
      return `table-residue:numeric-or-date:${type}:sev${severity}`;
    }
  }
  if (source && !local) return repeatedTextKey(`${className}:source-only`, source);
  if (!source && local) return repeatedTextKey(`${className}:local-only`, local);
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

function groupRecords(records, minGroup) {
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
        examples: [],
      };
      groups.set(key, group);
    }
    group.count += 1;
    addCount(group.byClass, record.classification.className);
    addCount(group.byAction, record.classification.action);
    addCount(group.byBook, record.item.book || 'unknown');
    group.chapters.add(itemChapterKey(record.item));
    if (group.examples.length < 4) {
      group.examples.push({
        id: record.item.id,
        chapter: itemChapterKey(record.item),
        source: shortText(sourceText(record)),
        local: shortText(localText(record)),
      });
    }
  }

  return [...groups.values()]
    .filter((group) => group.count >= minGroup)
    .map((group) => ({
      ...group,
      chapters: [...group.chapters].sort(compareChapterKeys),
    }))
    .sort((a, b) => groupScore(b) - groupScore(a) || b.count - a.count || a.key.localeCompare(b.key));
}

function topEntry(map) {
  return Object.entries(map || {}).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || ['unknown', 0];
}

function chapterPacketLane(entry) {
  const counts = {
    manualTranslation: Number(entry.byAction['manual-translate-if-accepted'] || 0),
    tableReview: Number(entry.byAction['batch-table-review'] || 0),
    punctuation: Number(entry.byAction['batch-punctuation-review'] || 0),
    manualSourceCheck: Number(entry.byAction['manual-source-check'] || 0)
      + Number(entry.byAction['manual-or-variant-review'] || 0),
  };
  if (counts.manualTranslation > 0) {
    return {
      kind: 'chapter-omission-translation',
      risk: 'high',
      dominantClass: entry.byClass['probable-source-omission'] ? 'probable-source-omission' : 'minor-source-omission',
      count: counts.manualTranslation,
      hint: 'Work in chapter context; accepted omissions need Chinese insertion plus manual English translations.',
    };
  }
  if (counts.tableReview > 0) {
    return {
      kind: 'chapter-table-review',
      risk: 'medium-high',
      dominantClass: 'table-structure-review',
      count: counts.tableReview,
      hint: 'Review whole rows/tables together; isolated table cells are slower and less reliable.',
    };
  }
  if (counts.punctuation > 0) {
    return {
      kind: 'chapter-punctuation-review',
      risk: 'medium',
      dominantClass: entry.byClass['leading-close-punctuation'] ? 'leading-close-punctuation' : 'variant-or-punctuation',
      count: counts.punctuation,
      hint: 'Check Chinese punctuation and matching English punctuation together in this chapter.',
    };
  }
  return {
    kind: 'chapter-source-review',
    risk: 'high',
    dominantClass: topEntry(entry.byClass)[0],
    count: counts.manualSourceCheck || entry.pending,
    hint: 'Mixed chapter review; keep source and translation context open while deciding items.',
  };
}

function chapterPacketScore(entry) {
  const lane = chapterPacketLane(entry);
  const base = {
    'chapter-omission-translation': 450000,
    'chapter-table-review': 390000,
    'chapter-punctuation-review': 330000,
    'chapter-source-review': 180000,
  }[lane.kind] || 100000;
  return base + lane.count * 1000 + entry.pending;
}

function chapterPackets(records, limit, opts) {
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

  return [...chapters.values()]
    .map((entry) => {
      const lane = chapterPacketLane(entry);
      return {
        ...entry,
        lane,
        dominantClass: lane.dominantClass,
        packetCommand: packetCommandForChapter(entry, opts),
        focusedPacketCommand: packetCommandForChapter({ ...entry, dominantClass: lane.dominantClass }, opts, { focused: true }),
      };
    })
    .sort((a, b) => chapterPacketScore(b) - chapterPacketScore(a)
      || b.pending - a.pending
      || compareChapterKeys(a.chapter, b.chapter))
    .slice(0, limit);
}

function graphPairsFromKey(key) {
  if (!String(key || '').startsWith('graph-diff:')) return [];
  return String(key)
    .slice('graph-diff:'.length)
    .split('|')
    .filter(Boolean);
}

function graphPairDetails(group) {
  const pairs = [...new Set(graphPairsFromKey(group.key))];
  const hasSemanticRisk = pairs.some((pair) => SEMANTIC_GRAPH_RISK_PAIRS.has(pair));
  const tableCount = Number(group.byClass?.['table-structure-review'] || 0);
  const manualSourceCount = Number(group.byAction?.['manual-source-check'] || 0)
    + Number(group.byAction?.['manual-or-variant-review'] || 0);
  return {
    pairs,
    hasSemanticRisk,
    touchesTables: tableCount > 0,
    manualSourceCount,
    lowFriction: !hasSemanticRisk && tableCount === 0,
  };
}

function laneForGroup(group) {
  const [topClass] = topEntry(group.byClass);
  const [topAction] = topEntry(group.byAction);
  const key = group.key;
  if (key.startsWith('graph-diff:')) {
    const graph = graphPairDetails(group);
    return {
      kind: 'graph-pair',
      risk: graph.hasSemanticRisk || graph.touchesTables
        ? 'medium-high'
        : group.count >= 10 ? 'medium' : 'medium-high',
      hint: graph.hasSemanticRisk
        ? 'Meaning-sensitive graph pair: review English carefully and use manualTranslations for any semantic change.'
        : 'Low-friction graph pair: graph packets prefill existing-English candidates; audit context, then process the whole pair packet.',
      graph,
    };
  }
  if (key.startsWith('punctuation:') || topClass === 'leading-close-punctuation' || topClass === 'variant-or-punctuation') {
    return {
      kind: 'punctuation-boundary',
      risk: 'medium',
      hint: 'Run metadata punctuation resolver first; survivors need Chinese and English punctuation checked together.',
    };
  }
  if (key.startsWith('table-markup:') || key.startsWith('table-residue:') || topClass === 'table-structure-review') {
    return {
      kind: 'table-review',
      risk: 'medium-high',
      hint: 'Work by chapter/table context; do not decide isolated cells without checking surrounding rows.',
    };
  }
  if (topAction === 'manual-translate-if-accepted') {
    return {
      kind: 'source-omission',
      risk: 'high',
      hint: 'If accepted, insert Chinese and write the English translation manually before marking applied.',
    };
  }
  if (key.startsWith('replacement-exact:')) {
    return {
      kind: 'exact-replacement',
      risk: 'medium-high',
      hint: 'Repeated exact replacement; sample examples before deciding whether it is an edition variant or a corpus error.',
    };
  }
  return {
    kind: key.startsWith('broad:') ? 'chapter-context' : 'repeated-pattern',
    risk: key.startsWith('broad:') ? 'high' : 'medium-high',
    hint: 'Use a packet and decide item by item.',
  };
}

function groupScore(group) {
  const laneInfo = laneForGroup(group);
  const lane = laneInfo.kind;
  const base = {
    'graph-pair': 600000,
    'punctuation-boundary': 500000,
    'exact-replacement': 420000,
    'table-review': 360000,
    'source-omission': 240000,
    'repeated-pattern': 200000,
    'chapter-context': 50000,
  }[lane] || 100000;
  const graphPenalty = lane === 'graph-pair' && laneInfo.graph
    ? (laneInfo.graph.hasSemanticRisk ? 120000 : 0) + (laneInfo.graph.touchesTables ? 70000 : 0)
    : 0;
  return base - graphPenalty + group.count * 100;
}

function packetCommandForGroup(group, opts) {
  const args = [
    'npm run quality:repair-workbench:packet --',
    `--group ${group.id}`,
    `--packet-size ${opts.packetSize}`,
  ];
  if (opts.classFilter) args.push(`--class ${opts.classFilter}`);
  for (const book of opts.books) args.push(`--book ${book}`);
  for (const chapter of opts.chapters) args.push(`--chapter ${chapter}`);
  for (const queue of opts.queues) args.push(`--queue ${queue}`);
  for (const sourceName of opts.sourceNames) args.push(`--source-name ${sourceName}`);
  if (opts.prefillDefault) args.push('--prefill-default');
  if (opts.prefillGraphSourceApprove) args.push('--prefill-graph-source-approve');
  if (opts.outDir) args.push(`--out-dir ${opts.outDir}`);
  return args.join(' ');
}

function graphPacketCommandForGroup(group, opts) {
  const args = [
    'npm run quality:repair-workbench:graph-packet --',
    `--group ${group.id}`,
    `--packet-size ${opts.packetSize}`,
  ];
  if (opts.classFilter) args.push(`--class ${opts.classFilter}`);
  for (const book of opts.books) args.push(`--book ${book}`);
  for (const chapter of opts.chapters) args.push(`--chapter ${chapter}`);
  for (const queue of opts.queues) args.push(`--queue ${queue}`);
  for (const sourceName of opts.sourceNames) args.push(`--source-name ${sourceName}`);
  if (opts.outDir) args.push(`--out-dir ${opts.outDir}`);
  return args.join(' ');
}

function packetCommandForChapter(chapter, opts, { focused = false } = {}) {
  const [book, chapterNumber] = chapter.chapter.split('/');
  const args = [
    'npm run quality:repair-workbench:packet --',
    `--book ${book}`,
    `--chapter ${chapterNumber}`,
    `--packet-size ${Math.max(opts.packetSize, 120)}`,
  ];
  if (focused && chapter.dominantClass) args.push(`--class ${chapter.dominantClass}`);
  if (opts.prefillDefault) args.push('--prefill-default');
  if (opts.prefillGraphSourceApprove) args.push('--prefill-graph-source-approve');
  if (opts.outDir) args.push(`--out-dir ${opts.outDir}`);
  return args.join(' ');
}

function commandArgsForPacket(group, opts) {
  const args = ['scripts/repair-queue-workbench.mjs', 'packet', '--group', group.id, '--packet-size', String(opts.packetSize)];
  if (opts.classFilter) args.push('--class', opts.classFilter);
  for (const book of opts.books) args.push('--book', book);
  for (const chapter of opts.chapters) args.push('--chapter', chapter);
  for (const queue of opts.queues) args.push('--queue', queue);
  for (const sourceName of opts.sourceNames) args.push('--source-name', sourceName);
  if (opts.outDir) args.push('--out-dir', opts.outDir);
  if (opts.prefillDefault) args.push('--prefill-default');
  if (opts.prefillGraphSourceApprove) args.push('--prefill-graph-source-approve');
  return args;
}

function runNodeJson(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const stderr = result.stderr.trim();
    const stdout = result.stdout.trim();
    throw new Error(`${script} failed with status ${result.status}\n${stderr || stdout}`);
  }
  const stdout = result.stdout.trim();
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${script} did not return JSON: ${error.message}\n${stdout.slice(0, 500)}`);
  }
}

function runNodeText(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const stderr = result.stderr.trim();
    const stdout = result.stdout.trim();
    throw new Error(`${script} failed with status ${result.status}\n${stderr || stdout}`);
  }
  return result.stdout.trim();
}

function patternCompletions(patterns) {
  const stats = patterns?.correspondence || {};
  return [
    'variantNoOps',
    'upstreamResidueNoOps',
    'wikisourceLinkedChronologyNoOps',
    'wikisourceDroppedChronologyPrefixNoOps',
    'leadingClosePunctuationNoOps',
    'chapterStartHeadingNoOps',
    'sourceStartHeadingNoOps',
    'chapterStartRangeHeadingNoOps',
  ].reduce((sum, key) => sum + Number(stats[key] || 0), 0);
}

function patternReopens(patterns) {
  const stats = patterns?.correspondence || {};
  return Number(stats.reopenedVariantNoOps || 0) + Number(stats.reopenedResidueNoOps || 0);
}

function previewResolvers(opts) {
  const resolverScoped = resolverScopeArgs(opts);
  const patternScoped = patternScopeArgs(opts);
  const punctuation = runNodeJson('scripts/resolve-current-source-punctuation-queue.mjs', resolverScoped);
  const current = runNodeJson('scripts/resolve-current-source-variant-queue.mjs', resolverScoped);
  const houhanshuCommentary = runNodeJson('scripts/resolve-houhanshu-interleaved-commentary-noops.mjs', resolverScoped);
  const jiutangshuMarkers = runNodeJson('scripts/resolve-jiutangshu-zhuan-table-marker-noops.mjs', resolverScoped);
  const patterns = patternScopeSupported(opts)
    ? runNodeJson('scripts/repair-source-queue-patterns.mjs', patternScoped)
    : null;
  const staleComplete = Number(punctuation.verified || 0)
    + Number(current.verified || 0)
    + Number(houhanshuCommentary.total || 0)
    + Number(jiutangshuMarkers.total || 0);
  const patternComplete = patternCompletions(patterns);
  const reopened = patternReopens(patterns);
  const artifactsChanged = Number(patterns?.artifacts?.unitsChanged || 0);
  return {
    punctuation,
    current,
    houhanshuCommentary,
    jiutangshuMarkers,
    patterns,
    summary: {
      metadataOnlyCompletable: staleComplete,
      patternCompletable: patternComplete,
      patternReopened: reopened,
      artifactSourceUnitsChanged: artifactsChanged,
      netPatternQueueChange: patternComplete - reopened,
      patternPreviewSkipped: patterns ? null : 'Optional broad pattern resolver supports only whole-corpus or --book scopes.',
    },
  };
}

function buildPlan(opts) {
  const { records } = loadItems(triageOpts(opts));
  const summary = summarize(records);
  const groups = groupRecords(records, opts.minGroup);
  const nextGroups = groups.slice(0, opts.groupLimit).map((group) => {
    const lane = laneForGroup(group);
    return {
      id: group.id,
      count: group.count,
      key: group.key,
      lane,
      byClass: group.byClass,
      byAction: group.byAction,
      byBook: group.byBook,
      chapterCount: group.chapters.length,
      firstChapters: group.chapters.slice(0, 8),
      packetCommand: packetCommandForGroup(group, opts),
      graphPacketCommand: lane.kind === 'graph-pair' ? graphPacketCommandForGroup(group, opts) : null,
      examples: group.examples,
    };
  });
  const plan = {
    generatedAt: new Date().toISOString(),
    scope: {
      books: [...opts.books],
      chapters: [...opts.chapters],
      queues: opts.queues,
      sourceNames: [...opts.sourceNames],
      classFilter: opts.classFilter,
    },
    summary,
    resolverPreview: opts.skipResolvers ? null : previewResolvers(opts),
    nextGroups,
    nextChapterPackets: chapterPackets(records, opts.groupLimit, opts),
  };
  return plan;
}

function topEntries(map, limit = 5) {
  return Object.entries(map || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => `${key}:${count}`)
    .join(', ');
}

function printPlan(plan) {
  const lines = [
    `Pending queue items: ${plan.summary.pendingItems}`,
    `Fast lanes: ${JSON.stringify(plan.summary.fastLanes)}`,
    `Top classes: ${topEntries(plan.summary.byClass, 8) || 'none'}`,
    '',
  ];

  if (plan.resolverPreview) {
    const preview = plan.resolverPreview.summary;
    lines.push('Safe resolver preview:');
    lines.push(`  metadata-only stale completions: ${preview.metadataOnlyCompletable}`);
    lines.push(`  optional pattern completions: ${preview.patternCompletable}`);
    lines.push(`  optional pattern reopens: ${preview.patternReopened}`);
    lines.push(`  optional artifact source-unit changes: ${preview.artifactSourceUnitsChanged}`);
    lines.push(`  optional pattern net queue change: ${preview.netPatternQueueChange}`);
    if (preview.patternPreviewSkipped) lines.push(`  optional pattern preview skipped: ${preview.patternPreviewSkipped}`);
    if (preview.metadataOnlyCompletable > 0) {
      lines.push('  apply metadata-only: npm run quality:repair-fast -- --apply');
    }
    if (preview.patternCompletable > 0 || preview.patternReopened > 0) {
      lines.push('  inspect pattern no-ops: npm run quality:repair-fast -- --include-pattern-noops');
    }
    lines.push('');
  }

  lines.push('Best next packet lanes:');
  if (plan.nextGroups.length === 0) {
    lines.push('  none');
  } else {
    for (const group of plan.nextGroups) {
      lines.push(`  ${group.id} count=${group.count} lane=${group.lane.kind} risk=${group.lane.risk}`);
      lines.push(`    classes=[${topEntries(group.byClass, 3)}] chapters=${group.chapterCount}`);
      lines.push(`    ${group.key}`);
      lines.push(`    hint: ${group.lane.hint}`);
      lines.push(`    packet: ${group.packetCommand}`);
      if (group.graphPacketCommand) {
        lines.push(`    reviewed graph packet: ${group.graphPacketCommand}`);
      }
      for (const example of group.examples.slice(0, 2)) {
        lines.push(`    - ${example.id} ${example.chapter}`);
        lines.push(`      source: ${example.source || '(none)'}`);
        lines.push(`      local:  ${example.local || '(none)'}`);
      }
    }
  }

  lines.push('', 'Highest-yield chapter packets:');
  if (plan.nextChapterPackets.length === 0) {
    lines.push('  none');
  } else {
    for (const chapter of plan.nextChapterPackets) {
      lines.push(`  ${chapter.chapter} pending=${chapter.pending} lane=${chapter.lane.kind} risk=${chapter.lane.risk}`);
      lines.push(`    classes=[${topEntries(chapter.byClass, 3)}] actions=[${topEntries(chapter.byAction, 3)}]`);
      lines.push(`    hint: ${chapter.lane.hint}`);
      lines.push(`    packet: ${chapter.packetCommand}`);
      if (chapter.focusedPacketCommand !== chapter.packetCommand) {
        lines.push(`    focused: ${chapter.focusedPacketCommand}`);
      }
    }
  }

  lines.push('', 'Shortcut: npm run quality:repair-next:packet -- --dry-run');
  console.log(lines.join('\n'));
}

function runSafe(opts) {
  const resolverScoped = resolverScopeArgs(opts);
  const patternScoped = patternScopeArgs(opts);
  const args = opts.apply ? ['--apply', ...resolverScoped] : resolverScoped;
  const punctuation = runNodeJson('scripts/resolve-current-source-punctuation-queue.mjs', args);
  const current = runNodeJson('scripts/resolve-current-source-variant-queue.mjs', args);
  const houhanshuCommentary = runNodeJson('scripts/resolve-houhanshu-interleaved-commentary-noops.mjs', args);
  const jiutangshuMarkers = runNodeJson('scripts/resolve-jiutangshu-zhuan-table-marker-noops.mjs', args);
  const sourcePlaceholders = runNodeJson('scripts/resolve-source-placeholder-noops.mjs', args);
  const representedTables = runNodeJson('scripts/resolve-represented-table-markup-noops.mjs', args);
  let patterns = null;

  if (opts.includePatternNoops) {
    if (!patternScopeSupported(opts)) {
      return {
        apply: opts.apply,
        blocked: true,
        reason: 'Pattern no-op pass supports only whole-corpus or --book scopes; remove --chapter, --queue, --source-name, and --class.',
        punctuation,
        current,
        houhanshuCommentary,
        jiutangshuMarkers,
        sourcePlaceholders,
        representedTables,
      };
    }
    const patternPreview = runNodeJson('scripts/repair-source-queue-patterns.mjs', patternScoped);
    const reopens = patternReopens(patternPreview);
    if (opts.apply && reopens > 0 && !opts.allowReopen) {
      return {
        apply: opts.apply,
        blocked: true,
        reason: `Pattern no-op pass would reopen ${reopens} older decisions. Re-run with --allow-reopen if that is intended.`,
        punctuation,
        current,
        houhanshuCommentary,
        jiutangshuMarkers,
        sourcePlaceholders,
        representedTables,
        patternPreview,
      };
    }
    patterns = opts.apply
      ? runNodeJson('scripts/repair-source-queue-patterns.mjs', ['--apply', ...patternScoped])
      : patternPreview;
  }

  let progress = null;
  if (opts.apply) {
    progress = runNodeText('generate-progress.js');
  }

  return {
    apply: opts.apply,
    punctuation,
    current,
    houhanshuCommentary,
    jiutangshuMarkers,
    sourcePlaceholders,
    representedTables,
    patterns,
    progress,
    summary: {
      metadataOnlyCompleted: Number(punctuation.verified || 0)
        + Number(current.verified || 0)
        + Number(houhanshuCommentary.total || 0)
        + Number(jiutangshuMarkers.total || 0)
        + Number(sourcePlaceholders.total || 0)
        + Number(representedTables.total || 0),
      patternCompleted: patternCompletions(patterns),
      patternReopened: patternReopens(patterns),
      artifactSourceUnitsChanged: Number(patterns?.artifacts?.unitsChanged || 0),
    },
  };
}

function printSafe(result) {
  if (result.blocked) {
    console.log(result.reason);
    return;
  }
  const lines = [
    `Applied changes: ${result.apply}`,
    `Metadata-only stale completions: ${result.summary.metadataOnlyCompleted}`,
    `Pattern completions: ${result.summary.patternCompleted}`,
    `Pattern reopens: ${result.summary.patternReopened}`,
    `Artifact source-unit changes: ${result.summary.artifactSourceUnitsChanged}`,
  ];
  if (result.apply) lines.push('Progress regenerated.');
  console.log(lines.join('\n'));
}

function runPacket(opts) {
  const plan = buildPlan({ ...opts, skipResolvers: true, groupLimit: opts.groupId ? 100000 : opts.groupLimit });
  const group = opts.groupId
    ? plan.nextGroups.find((candidate) => candidate.id === opts.groupId)
    : plan.nextGroups[0];
  if (!group) throw new Error('No packet group found. Run quality:repair-next to inspect available lanes.');

  const commandArgs = commandArgsForPacket(group, opts);
  if (opts.dryRun) {
    return {
      dryRun: true,
      group,
      command: `${process.execPath} ${commandArgs.join(' ')}`,
      npmCommand: group.packetCommand,
    };
  }

  const output = runNodeText(commandArgs[0], commandArgs.slice(1));
  return {
    dryRun: false,
    group,
    output,
  };
}

function printPacket(result) {
  console.log(`Selected group ${result.group.id}: ${result.group.count} item(s), lane=${result.group.lane.kind}, risk=${result.group.lane.risk}`);
  console.log(`Key: ${result.group.key}`);
  if (result.dryRun) {
    console.log(`Command: ${result.npmCommand}`);
  } else {
    console.log(result.output);
  }
}

function rebuildCommandsForGroup(group) {
  return Object.keys(group.byBook || {})
    .sort((a, b) => compareChapterKeys(`${a}/000`, `${b}/000`))
    .map((book) => `make update BOOK=${book}`);
}

function runCycle(opts) {
  const safeOpts = { ...opts, apply: opts.apply && !opts.dryRun };
  const safe = opts.skipResolvers ? null : runSafe(safeOpts);
  const plan = buildPlan({ ...opts, skipResolvers: true, groupLimit: opts.groupId ? 100000 : opts.groupLimit });
  const group = opts.groupId
    ? plan.nextGroups.find((candidate) => candidate.id === opts.groupId)
    : plan.nextGroups[0];
  if (!group) throw new Error('No packet group found after safe resolver step.');

  const commandArgs = commandArgsForPacket(group, opts);
  const packet = opts.dryRun
    ? {
      dryRun: true,
      command: `${process.execPath} ${commandArgs.join(' ')} --json`,
      npmCommand: group.packetCommand,
    }
    : runNodeJson(commandArgs[0], [...commandArgs.slice(1), '--json']);

  return {
    dryRun: opts.dryRun,
    applySafeMetadata: safeOpts.apply,
    safeSummary: safe?.summary || null,
    selectedGroup: group,
    packet,
    nextCommands: {
      editPacket: opts.dryRun ? null : packet.markdownPath,
      applyDecisions: opts.dryRun
        ? 'npm run quality:repair-workbench:apply -- --decisions <packet.json>'
        : `npm run quality:repair-workbench:apply -- --decisions ${packet.jsonPath}`,
      finishDryRun: opts.dryRun
        ? 'npm run quality:repair-workbench:finish:dry-run -- --decisions <packet.json>'
        : `npm run quality:repair-workbench:finish:dry-run -- --decisions ${packet.jsonPath}`,
      finish: opts.dryRun
        ? 'npm run quality:repair-workbench:finish -- --decisions <packet.json>'
        : `npm run quality:repair-workbench:finish -- --decisions ${packet.jsonPath}`,
      rebuildTouchedBooks: rebuildCommandsForGroup(group),
      refreshProgressOnly: 'node generate-progress.js',
    },
  };
}

function printCycle(result) {
  const lines = [
    `Dry run: ${result.dryRun}`,
    `Applied safe metadata first: ${result.applySafeMetadata}`,
  ];
  if (result.safeSummary) {
    lines.push(`Safe metadata completed: ${result.safeSummary.metadataOnlyCompleted}`);
    lines.push(`Pattern completed: ${result.safeSummary.patternCompleted}`);
  }
  lines.push(
    '',
    `Selected group ${result.selectedGroup.id}: ${result.selectedGroup.count} item(s), lane=${result.selectedGroup.lane.kind}, risk=${result.selectedGroup.lane.risk}`,
    `Key: ${result.selectedGroup.key}`,
  );
  if (result.dryRun) {
    lines.push(`Packet command: ${result.packet.npmCommand}`);
  } else {
    lines.push(`Packet JSON: ${result.packet.jsonPath}`);
    lines.push(`Packet Markdown: ${result.packet.markdownPath}`);
  }
  lines.push('', 'Next commands:');
  lines.push(`  review/edit: ${result.nextCommands.editPacket || '<packet markdown>'}`);
  lines.push(`  dry-run finish: ${result.nextCommands.finishDryRun}`);
  lines.push(`  finish reviewed packet: ${result.nextCommands.finish}`);
  lines.push(`  decisions only: ${result.nextCommands.applyDecisions}`);
  console.log(lines.join('\n'));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.command === 'safe') {
    const result = runSafe(opts);
    if (opts.json) console.log(JSON.stringify(result, null, 2));
    else printSafe(result);
    return;
  }

  if (opts.command === 'packet') {
    const result = runPacket(opts);
    if (opts.json) console.log(JSON.stringify(result, null, 2));
    else printPacket(result);
    return;
  }

  if (opts.command === 'cycle') {
    const result = runCycle(opts);
    if (opts.json) console.log(JSON.stringify(result, null, 2));
    else printCycle(result);
    return;
  }

  const plan = buildPlan(opts);
  if (opts.json) console.log(JSON.stringify(plan, null, 2));
  else printPlan(plan);
}

main();
