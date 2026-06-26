#!/usr/bin/env node
/**
 * Repair source-artifact placeholder glyphs using the source-correspondence
 * upstream witness for the same chapter.
 *
 * This is stricter than a glyph map: it replaces a component/PUA placeholder
 * only when the current local context and the queued upstream source produce a
 * single replacement candidate.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const ARTIFACT_QUEUE = path.join(QUALITY_DIR, 'source-artifacts-corpus.json');
const DEFAULT_REVIEWER = 'repair-source-artifact-correspondence-placeholders';
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const COMPONENT_MARKERS = new Set(Array.from('氵訁钅釒糹飠饣礻衤忄扌犭艹辶阝疒攵彡'));
const COMPONENT_MARKER_RE = /[氵訁钅釒糹飠饣礻衤忄扌犭艹辶阝疒攵彡]/u;
const PRIVATE_USE_RE = /[\uE000-\uF8FF]/u;
const PRIVATE_USE_GLOBAL_RE = /[\uE000-\uF8FF]/gu;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const REPAIRABLE_RULES = new Set(['SOURCE_COMPONENT_PLACEHOLDER', 'SOURCE_PRIVATE_USE_GLYPH']);
const SEARCH_CONTEXT = 8;

function usage() {
  console.error(`Usage:
  node scripts/repair-source-artifact-correspondence-placeholders.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]

Dry-run by default. Uses pending source-correspondence upstream text as the
unique witness for source-artifact placeholder repairs.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++index]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++index] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++index] || DEFAULT_REVIEWER;
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
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (item?.appliedAt || item?.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function hitInScope(hit, opts) {
  if (statusOf(hit) !== 'pending') return false;
  if (!REPAIRABLE_RULES.has(hit.ruleId)) return false;
  if (opts.books.size > 0 && !opts.books.has(hit.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(hit.chapter || '').padStart(3, '0'))) return false;
  return true;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function walkUnits(value, visitor) {
  if (!value || typeof value !== 'object') return;
  const field = sourceField(value);
  if (field && value.id) visitor(value, field);
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') walkUnits(child, visitor);
  }
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const byId = new Map();
    walkUnits(chapter, (unit, field) => byId.set(unit.id, { unit, field }));
    chapterCache.set(absolute, {
      file: absolute,
      chapter,
      byId,
      changed: false,
    });
  }
  return chapterCache.get(absolute);
}

const queueCache = new Map();

function correspondenceItems(book) {
  if (!queueCache.has(book)) {
    const file = path.join(QUALITY_DIR, `source-correspondence-corpus-wikisource-${book}.json`);
    const items = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, 'utf8')).items || []
      : [];
    queueCache.set(book, items);
  }
  return queueCache.get(book);
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

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function replacementFromCorrespondence(hit, currentText, expression) {
  const currentKey = keyText(currentText);
  const expressionKey = keyText(expression);
  if (!expressionKey) return null;
  const index = currentKey.indexOf(expressionKey);
  if (index < 0 || currentKey.indexOf(expressionKey, index + 1) >= 0) return null;

  const prefix = currentKey.slice(Math.max(0, index - SEARCH_CONTEXT), index);
  const suffix = currentKey.slice(index + expressionKey.length, index + expressionKey.length + SEARCH_CONTEXT);
  if (prefix.length < 3 || suffix.length < 3) return null;

  const pattern = new RegExp(`${escapeRegExp(prefix)}([\\p{Script=Han}0-9]{1,4})${escapeRegExp(suffix)}`, 'u');
  const matches = new Map();
  for (const item of correspondenceItems(hit.book)) {
    if (item.chapter !== hit.chapter) continue;
    const sourceText = String(item.sourceRange?.text || '');
    if (!sourceText || COMPONENT_MARKER_RE.test(sourceText) || PRIVATE_USE_RE.test(sourceText)) continue;
    const match = keyText(sourceText).match(pattern);
    if (!match) continue;
    const replacement = match[1];
    if (!replacement || expression.includes(replacement)) continue;
    if (!matches.has(replacement)) matches.set(replacement, []);
    if (matches.get(replacement).length < 5) matches.get(replacement).push(item.id);
  }
  if (matches.size !== 1) return null;
  const [[replacement, evidence]] = matches.entries();
  return { expression, replacement, evidence };
}

function updateTranslations(unit, expression, replacement) {
  let changed = false;
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string' || !translation[field].includes(expression)) continue;
      translation[field] = translation[field].split(expression).join(replacement);
      translation.allowChineseCharacters = true;
      changed = true;
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

function markApplied(hit, now, opts, repair) {
  hit.status = 'applied';
  hit.decision = 'included';
  hit.reviewedAt = hit.reviewedAt || now;
  hit.reviewer = hit.reviewer || opts.reviewer;
  hit.appliedAt = now;
  hit.appliedSummary = {
    mode: 'source-artifact-correspondence-placeholder-repair',
    replacement: `${repair.expression}->${repair.replacement}`,
    evidence: repair.evidence,
  };
  hit.notes = appendNote(
    hit.notes,
    'Applied source placeholder repair from a unique same-chapter source-correspondence witness.',
  );
}

function classifyHit(hit, opts) {
  if (!hitInScope(hit, opts)) return null;
  const file = path.resolve(hit.file || path.join(DATA_DIR, hit.book, `${hit.chapter}.json`));
  if (!fs.existsSync(file)) return null;
  const record = loadChapter(file);
  const entry = record.byId.get(hit.sentenceId || '');
  if (!entry) return null;

  const current = String(entry.unit[entry.field] || '');
  const repairs = [];
  for (const expression of expressionKeys(hit.found, hit.ruleId)) {
    if (!current.includes(expression)) continue;
    const repair = replacementFromCorrespondence(hit, current, expression);
    if (repair) repairs.push(repair);
  }
  if (repairs.length !== 1) return null;

  const repair = repairs[0];
  const next = current.split(repair.expression).join(repair.replacement);
  if (next === current) return null;
  if (COMPONENT_MARKER_RE.test(repair.replacement) || PRIVATE_USE_RE.test(repair.replacement)) return null;

  return {
    hit,
    record,
    entry,
    repair,
    before: current,
    after: next,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(ARTIFACT_QUEUE, 'utf8'));
  const now = new Date().toISOString();
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
  };

  for (const hit of queue.hits || []) {
    if (summary.repairedHits >= opts.limit) break;
    const repair = classifyHit(hit, opts);
    if (!repair) continue;

    summary.repairedHits += 1;
    summary.byBook[hit.book] = (summary.byBook[hit.book] || 0) + 1;
    const replacementKey = `${repair.repair.expression}->${repair.repair.replacement}`;
    summary.byReplacement[replacementKey] = (summary.byReplacement[replacementKey] || 0) + 1;
    if (summary.samples.length < 30) {
      summary.samples.push({
        id: hit.id,
        chapter: `${hit.book}/${hit.chapter}`,
        replacement: replacementKey,
        before: repair.before,
        after: repair.after,
        evidence: repair.repair.evidence,
      });
    }
    if (!opts.apply) continue;

    repair.entry.unit[repair.entry.field] = repair.after;
    repair.record.changed = true;
    summary.unitsChanged += 1;
    if (updateTranslations(repair.entry.unit, repair.repair.expression, repair.repair.replacement)) {
      repair.record.changed = true;
      summary.translationsChanged += 1;
    }
    markApplied(hit, now, opts, repair.repair);
    summary.touchedQueue = true;
  }

  if (opts.apply) {
    if (summary.touchedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(ARTIFACT_QUEUE, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
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
