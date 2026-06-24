#!/usr/bin/env node
/**
 * Clean source repair queue items that are corpus artifacts, not upstream text.
 *
 * This handles two safe classes:
 * - local-heading-markup: strip MediaWiki heading wrappers like =人物名=.
 * - local-ui-artifact / local-source-note-marker: remove the bogus unit.
 *
 * The script intentionally does not renumber IDs. Existing repair queue items
 * still point at the old chapter IDs, and stable IDs make the remaining queue
 * easier to keep applying.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence-corpus-wikisource-(.+)\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const HEADING_MARKUP_RE = /^=+([^=].*?)=+$/u;
const COLLATION_MARKER_RE = /^=*\s*(?:校勘記|校刊記|注)\s*=*$/u;
const COLLATION_APPARATUS_RE = /^(?:校勘記|校刊記)/u;
const LOCAL_UI_ARTIFACT_RE = /^(?:Disambig\.svg|註：章節乃維基文庫編輯後加，以方便索引。)$/u;
const UI_ARTIFACTS = new Set(['打開字典']);
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;
const DEFAULT_REVIEWER = 'clean-source-repair-artifact-lane';

function usage() {
  console.error(`Usage:
  node scripts/clean-source-repair-artifact-lane.mjs [--apply] [--book BOOK] [--chapter CHAPTER]

Dry-run by default. With --apply, edits chapter JSON and marks matching queue
items applied.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
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
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
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
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  return opts;
}

function normalize(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function cleanHeadingText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'applied' || decision === 'included') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function classify(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.type !== 'local_extra_candidate') return null;
  const rawText = String(item.localRange?.text || '').trim();
  const text = normalize(rawText);
  const markupText = cleanHeadingText(rawText);
  if (!text) return null;
  if (UI_ARTIFACTS.has(text)) return { className: 'local-ui-artifact', mode: 'remove', replacement: '' };
  if (LOCAL_UI_ARTIFACT_RE.test(markupText)) return { className: 'local-ui-artifact', mode: 'remove', replacement: '' };
  if (COLLATION_APPARATUS_RE.test(markupText)) return { className: 'local-collation-apparatus', mode: 'remove', replacement: '' };
  if (COLLATION_MARKER_RE.test(markupText)) return { className: 'local-source-note-marker', mode: 'remove', replacement: '' };
  const headingMatch = markupText.match(HEADING_MARKUP_RE);
  if (!headingMatch) return null;
  const replacement = cleanHeadingText(headingMatch[1]);
  if (!replacement || COLLATION_MARKER_RE.test(replacement)) return null;
  return { className: 'local-heading-markup', mode: 'clean-heading', replacement };
}

function queueFiles(opts) {
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => {
      if (opts.books.size === 0) return true;
      return [...opts.books].some((book) => entry === `source-correspondence-corpus-wikisource-${book}.json`);
    })
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => Object.hasOwn(unit, field));
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
}

function setSourceText(unit, value) {
  const field = sourceField(unit);
  if (!field) throw new Error(`Unit ${unit.id || '(no id)'} has no source field`);
  unit[field] = value;
}

function hasMeaningfulTranslation(unit) {
  if (Array.isArray(unit.translations)) {
    return unit.translations.some((translation) => (
      normalize(translation?.literal) || normalize(translation?.idiomatic)
    ));
  }
  return Boolean(normalize(unit.literal) || normalize(unit.idiomatic));
}

function isCountableSource(text) {
  const value = normalize(text);
  return value !== '' && !PUNCTUATION_ONLY_RE.test(value);
}

function countUnits(chapter) {
  let sourceCount = 0;
  let translatedCount = 0;
  const translatorMap = new Map();

  forEachUnit(chapter, ({ unit, blockIndex }) => {
    if (!isCountableSource(sourceText(unit))) return;
    sourceCount += 1;
    if (!hasMeaningfulTranslation(unit)) return;
    translatedCount += 1;
    const names = new Set();
    if (normalize(unit.translator)) names.add(normalize(unit.translator));
    for (const translation of unit.translations || []) {
      if (normalize(translation?.translator)) names.add(normalize(translation.translator));
    }
    for (const name of names) {
      const record = translatorMap.get(name) || { name, paragraphs: new Set(), sentences: 0 };
      record.paragraphs.add(blockIndex);
      record.sentences += 1;
      translatorMap.set(name, record);
    }
  });

  return {
    sourceCount,
    translatedCount,
    translators: [...translatorMap.values()]
      .map((record) => ({
        name: record.name,
        paragraphs: record.paragraphs.size,
        sentences: record.sentences,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function updateMeta(chapter) {
  if (!chapter.meta || typeof chapter.meta !== 'object') return;
  const counts = countUnits(chapter);
  chapter.meta.sentenceCount = counts.sourceCount;
  chapter.meta.translatedCount = counts.translatedCount;
  if (counts.translators.length > 0) chapter.meta.translators = counts.translators;
}

function forEachUnit(chapter, callback) {
  const content = chapter.content || [];
  for (let blockIndex = 0; blockIndex < content.length; blockIndex += 1) {
    const block = content[blockIndex];
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        if (!unit?.id || !sourceField(unit)) continue;
        callback({ unit, block, blockIndex, collectionName, unitIndex });
      }
    }
  }
}

function findUnits(chapter, item) {
  const ids = new Set(item.localRange?.ids || []);
  const matches = [];
  forEachUnit(chapter, (entry) => {
    if (ids.has(entry.unit.id)) matches.push(entry);
  });
  return matches;
}

function cleanTranslationMarkup(unit, before, after) {
  const stripExact = (value) => {
    const text = String(value || '');
    if (text === before) return after;
    return text;
  };
  if (Array.isArray(unit.translations)) {
    for (const translation of unit.translations) {
      if (typeof translation.literal === 'string') translation.literal = stripExact(translation.literal);
      if (typeof translation.idiomatic === 'string') translation.idiomatic = stripExact(translation.idiomatic);
      if (typeof translation.text === 'string') translation.text = stripExact(translation.text);
    }
  }
  if (typeof unit.literal === 'string') unit.literal = stripExact(unit.literal);
  if (typeof unit.idiomatic === 'string') unit.idiomatic = stripExact(unit.idiomatic);
}

function removeUnit(chapter, entry) {
  const block = entry.block;
  const collection = block[entry.collectionName];
  collection.splice(entry.unitIndex, 1);
  if (entry.collectionName === 'sentences' && collection.length === 0) {
    const index = chapter.content.indexOf(block);
    if (index >= 0) chapter.content.splice(index, 1);
  }
}

function applyArtifact(chapter, item, classification) {
  const matches = findUnits(chapter, item);
  const allowPartialRange = classification.className === 'local-collation-apparatus';
  if ((!allowPartialRange && matches.length !== (item.localRange?.ids || []).length) || matches.length === 0) {
    throw new Error(`${item.id}: could not locate all local ids ${(item.localRange?.ids || []).join(', ')}`);
  }

  const beforeTexts = matches.map((entry) => sourceText(entry.unit));
  if (classification.mode === 'clean-heading') {
    if (matches.length !== 1) throw new Error(`${item.id}: heading cleanup expected exactly one local unit`);
    const entry = matches[0];
    const before = sourceText(entry.unit);
    const unitHeadingMatch = cleanHeadingText(before).match(HEADING_MARKUP_RE);
    const replacement = unitHeadingMatch
      ? cleanHeadingText(unitHeadingMatch[1])
      : classification.replacement;
    setSourceText(entry.unit, replacement);
    cleanTranslationMarkup(entry.unit, before, replacement);
    return {
      mode: classification.mode,
      ids: [...(item.localRange?.ids || [])],
      before: beforeTexts,
      after: [replacement],
    };
  }

  const ordered = [...matches].sort((a, b) => {
    if (a.blockIndex !== b.blockIndex) return b.blockIndex - a.blockIndex;
    return b.unitIndex - a.unitIndex;
  });
  for (const entry of ordered) removeUnit(chapter, entry);
  return {
    mode: classification.mode,
    ids: [...(item.localRange?.ids || [])],
    before: beforeTexts,
    after: [],
  };
}

function appendNote(notes, addition) {
  const current = normalize(notes);
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    queueItems: 0,
    chaptersChanged: 0,
    headingMarkupCleaned: 0,
    artifactsRemoved: 0,
    touchedBooks: new Set(),
    touchedChapters: new Set(),
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let queueChanged = false;
    const byChapter = new Map();

    for (const item of queue.items || []) {
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      const classification = classify(item);
      if (!classification) continue;
      const chapterFile = item.file || path.join('data', item.book, `${item.chapter}.json`);
      const bucket = byChapter.get(chapterFile) || [];
      bucket.push({ item, classification });
      byChapter.set(chapterFile, bucket);
    }

    for (const [chapterFile, records] of byChapter.entries()) {
      const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
      const applied = [];
      for (const { item, classification } of records) {
        const result = applyArtifact(chapter, item, classification);
        applied.push({ id: item.id, className: classification.className, ...result });
        summary.queueItems += 1;
        if (classification.mode === 'clean-heading') summary.headingMarkupCleaned += 1;
        else summary.artifactsRemoved += result.before.length;
        summary.touchedBooks.add(item.book);
        summary.touchedChapters.add(`${item.book}/${item.chapter}`);

        item.status = opts.apply ? 'applied' : 'pending';
        item.decision = opts.apply ? 'applied' : item.decision;
        item.reviewedAt = opts.apply ? now : item.reviewedAt;
        item.reviewer = opts.apply ? opts.reviewer : item.reviewer;
        item.appliedAt = opts.apply ? now : item.appliedAt;
        item.appliedSummary = opts.apply ? result : item.appliedSummary;
        item.notes = appendNote(
          item.notes,
          classification.mode === 'clean-heading'
            ? 'Applied corpus cleanup: stripped local MediaWiki heading markup and retained the cleaned structural heading.'
            : 'Applied corpus cleanup: removed local source artifact that is not chapter content.',
        );
        queueChanged = true;
      }

      updateMeta(chapter);
      summary.chaptersChanged += 1;
      if (summary.samples.length < 12) {
        summary.samples.push({ chapterFile, applied: applied.slice(0, 8) });
      }

      if (opts.apply) fs.writeFileSync(chapterFile, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
    }

    if (opts.apply && queueChanged) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
  }

  console.log(JSON.stringify({
    ...summary,
    touchedBooks: [...summary.touchedBooks].sort(),
    touchedChapters: [...summary.touchedChapters].sort(),
  }, null, 2));
}

main();
