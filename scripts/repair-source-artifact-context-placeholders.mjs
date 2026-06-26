#!/usr/bin/env node
/**
 * Repair source-artifact placeholder glyphs using corpus context.
 *
 * A repair is accepted only when the current sentence has a component/PUA
 * placeholder and another source unit in the corpus has the same surrounding
 * Han/digit context with exactly one real Han character in the placeholder
 * slot. This is meant for duplicated passages across histories, not guessing.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUEUE_PATH = path.join(DATA_DIR, 'quality', 'source-artifacts-corpus.json');
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const CHAPTER_RE = /^\d{3}\.json$/u;
const DEFAULT_REVIEWER = 'repair-source-artifact-context-placeholders';
const COMPONENT_MARKERS = new Set(Array.from('氵訁钅釒糹飠饣礻衤忄扌犭艹辶阝疒攵彡'));
const COMPONENT_MARKER_RE = /[氵訁钅釒糹飠饣礻衤忄扌犭艹辶阝疒攵彡]/u;
const PRIVATE_USE_RE = /[\uE000-\uF8FF]/u;
const PRIVATE_USE_GLOBAL_RE = /[\uE000-\uF8FF]/gu;
const BAD_CONTEXT_RE = /[A-Za-z<>{}\[\]|_=]/u;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const SEARCH_CONTEXT = 8;

function usage() {
  console.error(`Usage:
  node scripts/repair-source-artifact-context-placeholders.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]

Dry-run by default. Repairs SOURCE_COMPONENT_PLACEHOLDER and
SOURCE_PRIVATE_USE_GLYPH hits only when a unique same-context corpus witness is
found.`);
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

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function walkUnits(chapter, visitor) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) visitor(unit, field);
      }
    }
  }
}

function keyChars(text) {
  return Array.from(String(text || '')).filter((char) => (
    HAN_OR_DIGIT_RE.test(char)
    || COMPONENT_MARKERS.has(char)
    || PRIVATE_USE_RE.test(char)
  ));
}

function keyText(text) {
  return keyChars(text).join('');
}

function expressionKeys(found, ruleId) {
  if (ruleId === 'SOURCE_PRIVATE_USE_GLYPH') {
    return [...new Set(String(found || '').match(PRIVATE_USE_GLOBAL_RE) || [])];
  }

  const chars = keyChars(found);
  const candidates = new Set();
  for (let i = 0; i < chars.length; i += 1) {
    if (!COMPONENT_MARKERS.has(chars[i])) continue;
    for (let start = Math.max(0, i - 3); start <= i; start += 1) {
      for (let end = i + 2; end <= Math.min(chars.length, i + 5); end += 1) {
        const segment = chars.slice(start, end);
        if (segment.length < 2 || segment.length > 5) continue;
        if (!segment.some((char) => COMPONENT_MARKERS.has(char))) continue;
        if (segment.every((char) => COMPONENT_MARKERS.has(char))) continue;
        candidates.add(segment.join(''));
      }
    }
  }
  return [...candidates].sort((a, b) => a.length - b.length || a.localeCompare(b));
}

function regexEscape(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function buildWitnesses() {
  const witnesses = [];
  for (const book of fs.readdirSync(DATA_DIR).sort()) {
    const bookDir = path.join(DATA_DIR, book);
    if (!fs.statSync(bookDir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const filename of fs.readdirSync(bookDir).filter((entry) => CHAPTER_RE.test(entry)).sort()) {
      const file = path.join(bookDir, filename);
      const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
      walkUnits(chapter, (unit, field) => {
        const text = String(unit[field] || '');
        if (!text || BAD_CONTEXT_RE.test(text) || COMPONENT_MARKER_RE.test(text) || PRIVATE_USE_RE.test(text)) return;
        const key = keyText(text);
        if (key.length < SEARCH_CONTEXT * 2 + 1) return;
        witnesses.push({
          key,
          file,
          id: unit.id || '',
        });
      });
    }
  }
  return witnesses;
}

function replacementFromWitnesses(currentText, expression, witnesses, selfFile, selfId) {
  const key = keyText(currentText);
  const expr = keyText(expression);
  if (!expr) return null;
  const index = key.indexOf(expr);
  if (index < 0 || key.indexOf(expr, index + 1) >= 0) return null;
  const prefix = key.slice(Math.max(0, index - SEARCH_CONTEXT), index);
  const suffix = key.slice(index + expr.length, index + expr.length + SEARCH_CONTEXT);
  if (prefix.length < 4 || suffix.length < 4) return null;

  const re = new RegExp(`${regexEscape(prefix)}(\\p{Script=Han})${regexEscape(suffix)}`, 'u');
  const matches = new Map();
  for (const witness of witnesses) {
    if (witness.file === selfFile && witness.id === selfId) continue;
    const match = witness.key.match(re);
    if (!match) continue;
    const replacement = match[1];
    if (expression.includes(replacement)) continue;
    if (!matches.has(replacement)) matches.set(replacement, []);
    if (matches.get(replacement).length < 5) {
      matches.get(replacement).push(path.relative(process.cwd(), witness.file) + (witness.id ? `#${witness.id}` : ''));
    }
  }
  if (matches.size !== 1) return null;
  const [[replacement, sources]] = matches.entries();
  return { expression, replacement, sources };
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const byId = new Map();
    walkUnits(chapter, (unit, field) => {
      if (unit.id) byId.set(unit.id, { unit, field });
    });
    chapterCache.set(absolute, { file: absolute, chapter, byId, changed: false });
  }
  return chapterCache.get(absolute);
}

function applyReplacement(text, expression, replacement) {
  return String(text || '').split(expression).join(replacement);
}

function updateTranslations(unit, expression, replacement) {
  let changed = false;
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string' || !translation[field].includes(expression)) continue;
      translation[field] = applyReplacement(translation[field], expression, replacement);
      translation.allowChineseCharacters = true;
      changed = true;
    }
  }
  if (changed) unit.allowChineseCharacters = true;
  return changed;
}

function markApplied(hit, now, opts, repair) {
  hit.status = 'applied';
  hit.decision = 'included';
  hit.reviewedAt = hit.reviewedAt || now;
  hit.reviewer = hit.reviewer || opts.reviewer;
  hit.appliedAt = now;
  hit.appliedSummary = {
    mode: 'source-artifact-context-placeholder-repair',
    replacement: `${repair.expression}->${repair.replacement}`,
    evidence: repair.sources,
  };
  const note = 'Applied source placeholder repair from a unique same-context corpus witness.';
  hit.notes = hit.notes ? `${hit.notes}\n${note}` : note;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const witnesses = buildWitnesses();
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repairedHits: 0,
    unitsChanged: 0,
    translationsChanged: 0,
    touchedChapterFiles: 0,
    touchedQueue: false,
    witnessCount: witnesses.length,
    byBook: {},
    byReplacement: {},
    samples: [],
  };

  for (const hit of queue.hits || []) {
    if (summary.repairedHits >= opts.limit) break;
    if (statusOf(hit) !== 'pending') continue;
    if (!['SOURCE_COMPONENT_PLACEHOLDER', 'SOURCE_PRIVATE_USE_GLYPH'].includes(hit.ruleId)) continue;
    if (opts.books.size > 0 && !opts.books.has(hit.book)) continue;
    if (opts.chapters.size > 0 && !opts.chapters.has(String(hit.chapter || '').padStart(3, '0'))) continue;

    const file = path.resolve(hit.file || path.join(DATA_DIR, hit.book, `${hit.chapter}.json`));
    if (!fs.existsSync(file)) continue;
    const record = loadChapter(file);
    const entry = record.byId.get(hit.sentenceId || '');
    if (!entry) continue;
    const current = String(entry.unit[entry.field] || '');
    const repairs = [];
    for (const expression of expressionKeys(hit.found, hit.ruleId)) {
      if (!current.includes(expression)) continue;
      const repair = replacementFromWitnesses(current, expression, witnesses, file, hit.sentenceId || '');
      if (repair) repairs.push(repair);
    }
    if (repairs.length !== 1) continue;

    const repair = repairs[0];
    const next = applyReplacement(current, repair.expression, repair.replacement);
    if (next === current || COMPONENT_MARKER_RE.test(repair.replacement) || PRIVATE_USE_RE.test(repair.replacement)) continue;

    summary.repairedHits += 1;
    summary.byBook[hit.book] = (summary.byBook[hit.book] || 0) + 1;
    const replacementKey = `${repair.expression}->${repair.replacement}`;
    summary.byReplacement[replacementKey] = (summary.byReplacement[replacementKey] || 0) + 1;
    if (summary.samples.length < 30) {
      summary.samples.push({
        id: hit.id,
        chapter: `${hit.book}/${hit.chapter}`,
        replacement: replacementKey,
        before: current,
        after: next,
        evidence: repair.sources,
      });
    }

    if (!opts.apply) continue;
    entry.unit[entry.field] = next;
    record.changed = true;
    summary.unitsChanged += 1;
    if (updateTranslations(entry.unit, repair.expression, repair.replacement)) {
      record.changed = true;
      summary.translationsChanged += 1;
    }
    markApplied(hit, now, opts, repair);
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
