#!/usr/bin/env node
/**
 * Repair source artifact hits where split-radical placeholders identify a
 * single CJK character, e.g. 扌適 -> 擿.
 *
 * Most mappings are derived by inverting macOS' local IDS decomposition table.
 * A small override map covers historical placeholders whose source component is
 * close but not byte-for-byte identical to the Unicode decomposition.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUEUE_PATH = path.join(DATA_DIR, 'quality', 'source-artifacts-corpus.json');
const IDS_PATH = '/System/Library/PrivateFrameworks/CoreHandwriting.framework/Versions/A/Resources/zhja_ids_decomposition_mapping.json';
const DEFAULT_REVIEWER = 'repair-source-artifact-component-placeholders';
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const LEFT_COMPONENTS = new Set(Array.from('氵訁钅糹飠饣礻衤忄扌犭艹辶疒'));
const RIGHT_COMPONENTS = new Set(Array.from('阝攵彡'));
const HAN_OR_MARK = /[\p{Script=Han}々]/u;
const HANZI_RE = /\p{Script=Han}/u;

const COMPONENT_ALIASES = new Map([
  ['氵', ['水']],
  ['訁', ['言']],
  ['讠', ['言']],
  ['钅', ['金']],
  ['釒', ['金']],
  ['糹', ['糸']],
  ['飠', ['食']],
  ['饣', ['食']],
  ['礻', ['示']],
  ['衤', ['衣']],
  ['忄', ['心']],
  ['扌', ['手']],
  ['犭', ['犬']],
  ['艹', ['艸']],
  ['辶', ['辵']],
  ['阝', ['邑']],
  ['攵', ['攴']],
]);

const CURATED_REPLACEMENTS = new Map([
  ['扌雝', '擁'],
  ['扌監', '攬'],
  ['扌為', '撝'],
  ['易攵', '敭'],
  ['氵義', '汊'],
  ['氵鶒', '鶒'],
  ['衤強', '襁'],
  ['钅屈', '𨧱'],
  ['钅巢', '鎖'],
]);

const BLOCKED_EXPRESSIONS = new Set([
  '子攵',
  '钅朵',
  '衤取',
  '艹一',
  '艹口',
  '艹林',
  '艹間',
  '艹采',
  '辶一',
  '辶大',
  '辶日',
  '辶力',
  '辶山',
  '辶列',
  '辶肖',
  '辶巛',
  '田攵',
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-source-artifact-component-placeholders.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]

Dry-run by default. Repairs only source-artifact SOURCE_COMPONENT_PLACEHOLDER
hits with a unique IDS-derived or curated mapping, then marks the artifact hit
applied so a later artifact scan can preserve it as resolved.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
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
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function loadIdsData() {
  if (!fs.existsSync(IDS_PATH)) {
    throw new Error(`IDS decomposition file not found: ${IDS_PATH}`);
  }
  return JSON.parse(fs.readFileSync(IDS_PATH, 'utf8'));
}

function buildResolver(idsData) {
  const flatMemo = new Map();
  const flatten = (char) => {
    if (flatMemo.has(char)) return flatMemo.get(char);
    if (COMPONENT_ALIASES.has(char)) {
      const value = COMPONENT_ALIASES.get(char);
      flatMemo.set(char, value);
      return value;
    }
    const raw = idsData[char];
    if (!Array.isArray(raw) || (raw.length === 1 && raw[0] === char)) {
      const value = [char];
      flatMemo.set(char, value);
      return value;
    }
    const value = raw.flatMap((part) => flatten(part));
    flatMemo.set(char, value);
    return value;
  };

  const inverted = new Map();
  for (const char of Object.keys(idsData)) {
    if (Array.from(char).length !== 1) continue;
    const key = flatten(char).join('\u241f');
    if (!key) continue;
    if (!inverted.has(key)) inverted.set(key, []);
    inverted.get(key).push(char);
  }

  const resolve = (expression) => {
    if (BLOCKED_EXPRESSIONS.has(expression)) return null;
    if (CURATED_REPLACEMENTS.has(expression)) return {
      expression,
      replacement: CURATED_REPLACEMENTS.get(expression),
      source: 'curated',
    };
    const key = Array.from(expression).flatMap((char) => flatten(char)).join('\u241f');
    const candidates = [...new Set(inverted.get(key) || [])]
      .filter((char) => !expression.includes(char) && HANZI_RE.test(char))
      .sort();
    if (candidates.length !== 1) return null;
    return {
      expression,
      replacement: candidates[0],
      source: 'ids',
    };
  };

  return resolve;
}

function expressionCandidates(found, resolve) {
  const chars = Array.from(String(found || ''));
  const candidates = [];

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];
    if (LEFT_COMPONENTS.has(char)) {
      for (let following = 1; following <= 4; following += 1) {
        if (i + 1 + following > chars.length) continue;
        const tail = chars.slice(i + 1, i + 1 + following);
        if (!tail.every((part) => HAN_OR_MARK.test(part))) continue;
        const expression = chars.slice(i, i + 1 + following).join('');
        const resolved = resolve(expression);
        if (resolved) candidates.push({ ...resolved, start: i, end: i + 1 + following });
      }
    }

    if (RIGHT_COMPONENTS.has(char)) {
      for (let preceding = 1; preceding <= 4; preceding += 1) {
        if (i - preceding < 0) continue;
        const head = chars.slice(i - preceding, i);
        if (!head.every((part) => HAN_OR_MARK.test(part))) continue;
        const expression = chars.slice(i - preceding, i + 1).join('');
        const resolved = resolve(expression);
        if (resolved) candidates.push({ ...resolved, start: i - preceding, end: i + 1 });
      }
    }
  }

  const chosen = [];
  const used = new Set();
  for (const candidate of candidates.sort((a, b) => (
    (a.end - a.start) - (b.end - b.start) ||
    a.start - b.start ||
    a.expression.localeCompare(b.expression)
  ))) {
    const range = [];
    for (let index = candidate.start; index < candidate.end; index += 1) range.push(index);
    if (range.some((index) => used.has(index))) continue;
    for (const index of range) used.add(index);
    chosen.push(candidate);
  }

  return chosen.sort((a, b) => a.start - b.start);
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function flattenUnits(chapter) {
  const units = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          id: unit.id || '',
          unit,
          field,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(absolute, {
      file: absolute,
      chapter,
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(absolute);
}

function applyTextReplacements(text, replacements) {
  let next = String(text || '');
  const applied = [];
  for (const replacement of replacements) {
    if (!next.includes(replacement.expression)) continue;
    next = next.split(replacement.expression).join(replacement.replacement);
    applied.push(`${replacement.expression}->${replacement.replacement}`);
  }
  return {
    text: next,
    applied,
  };
}

function updateTranslationStrings(unit, replacements) {
  let changed = false;
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string') continue;
      const next = applyTextReplacements(translation[field], replacements);
      if (next.text === translation[field]) continue;
      translation[field] = next.text;
      changed = true;
      if (HANZI_RE.test(next.text)) translation.allowChineseCharacters = true;
    }
  }
  if (changed) unit.allowChineseCharacters = true;
  return changed;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function markApplied(hit, now, reviewer, replacements) {
  hit.status = 'applied';
  hit.decision = 'included';
  hit.reviewedAt = hit.reviewedAt || now;
  hit.reviewer = hit.reviewer || reviewer;
  hit.appliedAt = now;
  hit.appliedSummary = {
    mode: 'source-artifact-component-placeholder-repair',
    replacements: [...new Set(replacements.map((entry) => `${entry.expression}->${entry.replacement}`))].sort(),
    mappingSources: [...new Set(replacements.map((entry) => entry.source))].sort(),
  };
  hit.notes = appendNote(
    hit.notes,
    'Applied source component-placeholder repair using local IDS decomposition plus curated overrides; matching placeholders in English translation fields were updated when present.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const resolve = buildResolver(loadIdsData());
  const summary = {
    apply: opts.apply,
    repairedHits: 0,
    unitsChanged: 0,
    translationsChanged: 0,
    touchedChapterFiles: 0,
    touchedQueue: false,
    byBook: {},
    byReplacement: {},
    samples: [],
    skippedAfterLimit: 0,
  };

  for (const hit of queue.hits || []) {
    if (summary.repairedHits >= opts.limit) {
      summary.skippedAfterLimit += 1;
      continue;
    }
    if (statusOf(hit) !== 'pending') continue;
    if (hit.ruleId !== 'SOURCE_COMPONENT_PLACEHOLDER') continue;
    if (opts.books.size > 0 && !opts.books.has(hit.book)) continue;
    if (opts.chapters.size > 0 && !opts.chapters.has(String(hit.chapter || '').padStart(3, '0'))) continue;

    const replacements = expressionCandidates(hit.found, resolve);
    if (replacements.length === 0) continue;
    const file = hit.file || path.join(DATA_DIR, hit.book, `${hit.chapter}.json`);
    if (!fs.existsSync(file)) continue;
    const chapter = loadChapter(file);
    const entry = chapter.byId.get(hit.sentenceId || '');
    if (!entry) continue;

    const current = entry.unit[entry.field];
    const next = applyTextReplacements(current, replacements);
    const changedSource = next.text !== current;
    if (!changedSource && replacements.some((replacement) => current.includes(replacement.expression))) continue;

    summary.repairedHits += 1;
    summary.byBook[hit.book] = (summary.byBook[hit.book] || 0) + 1;
    for (const replacement of replacements) {
      const key = `${replacement.expression}->${replacement.replacement}`;
      summary.byReplacement[key] = (summary.byReplacement[key] || 0) + 1;
    }
    if (summary.samples.length < 30) {
      summary.samples.push({
        id: hit.id,
        chapter: `${hit.book}/${hit.chapter}`,
        source: replacements.map((replacement) => replacement.source),
        replacements: replacements.map((replacement) => `${replacement.expression}->${replacement.replacement}`),
        before: current,
        after: next.text,
      });
    }

    if (!opts.apply) continue;
    if (changedSource) {
      entry.unit[entry.field] = next.text;
      chapter.changed = true;
      summary.unitsChanged += 1;
    }
    if (updateTranslationStrings(entry.unit, replacements)) {
      chapter.changed = true;
      summary.translationsChanged += 1;
    }
    markApplied(hit, now, opts.reviewer, replacements);
    summary.touchedQueue = true;
  }

  if (opts.apply) {
    if (summary.touchedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
