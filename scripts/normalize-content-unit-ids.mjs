#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const DEFAULT_REPORT = path.join(DATA_DIR, 'people', 'migrations', 'unit-id-normalization.json');

function usage() {
  console.log(`Usage:
  node scripts/normalize-content-unit-ids.mjs [--dry-run]
  node scripts/normalize-content-unit-ids.mjs --apply [--report PATH]
  node scripts/normalize-content-unit-ids.mjs --check
  node scripts/normalize-content-unit-ids.mjs --self-test

Options:
  --book BOOK       Limit the scan to one book.
  --chapter NNN     Limit the scan to one chapter; requires --book.
  --report PATH     Migration report path for --apply.
  --dry-run         Show the migration plan without writing files (default).
  --apply           Normalize chapter IDs, update exact QA locators, and write the report.
  --check           Fail when any chapter has missing or duplicate content-unit IDs.
  --self-test       Run deterministic fixture tests.`);
}

function parseArgs(argv) {
  const opts = {
    mode: 'dry-run',
    book: null,
    chapter: null,
    report: DEFAULT_REPORT,
    reportExplicit: false,
  };
  let explicitMode = null;

  const setMode = (mode, flag) => {
    if (explicitMode && explicitMode !== mode) {
      throw new Error(`Conflicting modes: ${explicitMode} and ${flag}`);
    }
    explicitMode = mode;
    opts.mode = mode;
  };

  const readValue = (flag, index) => {
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
    return value;
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') setMode('apply', arg);
    else if (arg === '--check') setMode('check', arg);
    else if (arg === '--dry-run') setMode('dry-run', arg);
    else if (arg === '--self-test') setMode('self-test', arg);
    else if (arg === '--book') opts.book = readValue(arg, i++);
    else if (arg === '--chapter') {
      const chapter = readValue(arg, i++);
      if (!/^\d+$/u.test(chapter)) throw new Error('--chapter must be numeric');
      opts.chapter = chapter.padStart(3, '0');
    } else if (arg === '--report') {
      opts.report = path.resolve(ROOT, readValue(arg, i++));
      opts.reportExplicit = true;
    }
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  return opts;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value || '')).digest('hex')}`;
}

function chapterFiles(opts) {
  const books = fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && (!opts.book || entry.name === opts.book))
    .map((entry) => entry.name)
    .sort();
  const files = [];
  for (const book of books) {
    const bookDir = path.join(DATA_DIR, book);
    for (const name of fs.readdirSync(bookDir).filter((file) => /^\d+\.json$/u.test(file)).sort()) {
      const chapter = name.slice(0, -5);
      if (opts.chapter && chapter !== opts.chapter) continue;
      files.push({ book, chapter, file: path.join(bookDir, name) });
    }
  }
  if (opts.book && books.length === 0) throw new Error(`Unknown book: ${opts.book}`);
  if (opts.chapter && files.length === 0) throw new Error(`Chapter not found: ${opts.book}/${opts.chapter}`);
  return files;
}

function contentUnits(chapter) {
  const units = [];
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    for (const [itemIndex, unit] of (block.sentences || []).entries()) {
      units.push({ blockIndex, collection: 'sentences', itemIndex, unit });
    }
    for (const [itemIndex, unit] of (block.cells || []).entries()) {
      units.push({ blockIndex, collection: 'cells', itemIndex, unit });
    }
  }
  return units;
}

function alphabeticSuffix(number) {
  let value = number;
  let suffix = '';
  do {
    value -= 1;
    suffix = String.fromCharCode(97 + (value % 26)) + suffix;
    value = Math.floor(value / 26);
  } while (value > 0);
  return suffix;
}

function nextDuplicateId(oldId, reserved) {
  for (let n = 1; ; n += 1) {
    const candidate = `${oldId}${alphabeticSuffix(n)}`;
    if (!reserved.has(candidate)) return candidate;
  }
}

function planChapter(chapter, book, chapterId) {
  const units = contentUnits(chapter);
  const reserved = new Set(units.map(({ unit }) => unit.id).filter(Boolean));
  const seen = new Set();
  let maxNumericId = 0;
  for (const { unit } of units) {
    const match = String(unit.id || '').match(/^s(\d+)/u);
    if (match) maxNumericId = Math.max(maxNumericId, Number(match[1]));
  }

  const changes = [];
  for (const location of units) {
    const oldId = location.unit.id || null;
    let newId = oldId;
    let reason = null;

    if (!oldId) {
      reason = 'missing';
      do {
        maxNumericId += 1;
        newId = `s${String(maxNumericId).padStart(4, '0')}`;
      } while (reserved.has(newId));
    } else if (seen.has(oldId)) {
      reason = 'duplicate';
      newId = nextDuplicateId(oldId, reserved);
    }

    if (reason) {
      reserved.add(newId);
      changes.push({
        book,
        chapter: chapterId,
        blockIndex: location.blockIndex,
        collection: location.collection,
        itemIndex: location.itemIndex,
        oldId,
        newId,
        reason,
        chineseHash: sha256(location.unit.zh || location.unit.content || ''),
      });
      seen.add(newId);
    } else {
      seen.add(oldId);
    }
  }
  return { unitCount: units.length, changes };
}

function locationKey(book, chapter, blockIndex, collection, itemIndex) {
  return `${book}:${chapter}:${blockIndex}:${collection}:${itemIndex}`;
}

function applyChapterChanges(file, changes) {
  const chapter = readJson(file);
  for (const change of changes) {
    const unit = chapter.content?.[change.blockIndex]?.[change.collection]?.[change.itemIndex];
    if (!unit) {
      throw new Error(`Migration target disappeared: ${locationKey(change.book, change.chapter, change.blockIndex, change.collection, change.itemIndex)}`);
    }
    const currentId = unit.id || null;
    if (currentId !== change.oldId) {
      throw new Error(`Migration target changed at ${change.book}/${change.chapter} block ${change.blockIndex} ${change.collection}[${change.itemIndex}]: expected ${change.oldId}, found ${currentId}`);
    }
    const currentHash = sha256(unit.zh || unit.content || '');
    if (currentHash !== change.chineseHash) {
      throw new Error(`Chinese text changed at ${change.book}/${change.chapter} ${change.oldId || '(missing ID)'}`);
    }
    unit.id = change.newId;
  }
  writeJsonAtomic(file, chapter);
}

function sourceCorrespondenceFiles() {
  const qualityDir = path.join(DATA_DIR, 'quality');
  if (!fs.existsSync(qualityDir)) return [];
  return fs.readdirSync(qualityDir)
    .filter((name) => /^source-correspondence.*\.json$/u.test(name))
    .sort()
    .map((name) => path.join(qualityDir, name));
}

function locationCollection(location) {
  return location.kind === 'cell' || location.cellIndex != null ? 'cells' : 'sentences';
}

function locationItemIndex(location) {
  return locationCollection(location) === 'cells' ? location.cellIndex : location.sentenceIndex;
}

function migrateSourceCorrespondenceReferences(changes, apply) {
  const byLocation = new Map(changes.map((change) => [
    locationKey(change.book, change.chapter, change.blockIndex, change.collection, change.itemIndex),
    change,
  ]));
  const files = [];
  let total = 0;
  const skippedStaleLocators = [];

  for (const file of sourceCorrespondenceFiles()) {
    const report = readJson(file);
    let updates = 0;
    for (const item of (report.items || [])) {
      const range = item.localRange;
      if (!range || !Array.isArray(range.locations)) continue;
      let itemUpdates = 0;
      for (const location of range.locations) {
        const itemIndex = locationItemIndex(location);
        if (!Number.isInteger(location.blockIndex) || !Number.isInteger(itemIndex)) continue;
        const key = locationKey(
          item.book,
          String(item.chapter).padStart(3, '0'),
          location.blockIndex,
          locationCollection(location),
          itemIndex,
        );
        const change = byLocation.get(key);
        if (!change) continue;
        if ((location.id || null) !== change.oldId) {
          skippedStaleLocators.push({
            file: path.relative(ROOT, file),
            itemId: item.id,
            location: key,
            recordedId: location.id || null,
            expectedOldId: change.oldId,
          });
          continue;
        }
        location.id = change.newId;
        updates += 1;
        itemUpdates += 1;
      }
      if (itemUpdates > 0) {
        range.ids = [...new Set(range.locations.map((location) => location.id).filter(Boolean))];
      }
    }
    if (updates > 0) {
      files.push({ file: path.relative(ROOT, file), updates });
      total += updates;
      if (apply) writeJsonAtomic(file, report);
    }
  }
  return { total, files, skippedStaleLocators };
}

function assertUniqueIds(chapter, label) {
  const seen = new Set();
  for (const { unit } of contentUnits(chapter)) {
    if (!unit.id) throw new Error(`${label}: missing content-unit ID`);
    if (seen.has(unit.id)) throw new Error(`${label}: duplicate content-unit ID ${unit.id}`);
    seen.add(unit.id);
  }
}

function runSelfTest() {
  const fixture = {
    content: [
      { type: 'paragraph', sentences: [
        { id: 's0001', zh: '甲' },
        { id: 's0001', zh: '乙' },
        { id: 's0001a', zh: '丙' },
        { zh: '丁' },
      ] },
      { type: 'table_row', cells: [
        { id: 's0002', content: '戊' },
        { id: 's0002', content: '己' },
      ] },
    ],
  };
  const first = planChapter(structuredClone(fixture), 'fixture', '001');
  const actual = first.changes.map(({ oldId, newId, reason }) => ({ oldId, newId, reason }));
  const expected = [
    { oldId: 's0001', newId: 's0001b', reason: 'duplicate' },
    { oldId: null, newId: 's0003', reason: 'missing' },
    { oldId: 's0002', newId: 's0002a', reason: 'duplicate' },
  ];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Self-test plan mismatch:\n${JSON.stringify(actual, null, 2)}`);
  }
  for (const change of first.changes) {
    fixture.content[change.blockIndex][change.collection][change.itemIndex].id = change.newId;
  }
  assertUniqueIds(fixture, 'fixture');
  const second = planChapter(fixture, 'fixture', '001');
  if (second.changes.length !== 0) throw new Error('Self-test failed idempotence check');
  console.log('normalize-content-unit-ids self-test: ok');
}

function printSummary(mode, filesScanned, unitsScanned, chapters, changes, references) {
  const duplicateCount = changes.filter((change) => change.reason === 'duplicate').length;
  const missingCount = changes.filter((change) => change.reason === 'missing').length;
  console.log(`Content-unit ID ${mode}:`);
  console.log(`- Chapters scanned: ${filesScanned}`);
  console.log(`- Units scanned: ${unitsScanned}`);
  console.log(`- Chapters requiring changes: ${chapters.length}`);
  console.log(`- Duplicate occurrences: ${duplicateCount}`);
  console.log(`- Missing IDs: ${missingCount}`);
  console.log(`- Total ID changes: ${changes.length}`);
  console.log(`- Exact source-correspondence locator updates: ${references.total}`);
  console.log(`- Pre-existing stale QA locators skipped: ${references.skippedStaleLocators.length}`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.mode === 'self-test') {
    runSelfTest();
    return;
  }

  const files = chapterFiles(opts);
  const chapters = [];
  const changes = [];
  let unitsScanned = 0;
  for (const target of files) {
    const plan = planChapter(readJson(target.file), target.book, target.chapter);
    unitsScanned += plan.unitCount;
    if (plan.changes.length === 0) continue;
    chapters.push({
      book: target.book,
      chapter: target.chapter,
      file: path.relative(ROOT, target.file),
      changes: plan.changes.length,
    });
    changes.push(...plan.changes);
  }

  const references = migrateSourceCorrespondenceReferences(changes, false);
  printSummary(opts.mode, files.length, unitsScanned, chapters, changes, references);

  if (opts.mode === 'check') {
    if (changes.length > 0) process.exitCode = 1;
    return;
  }
  if (opts.mode === 'dry-run' || changes.length === 0) return;

  if (fs.existsSync(opts.report) && !opts.reportExplicit) {
    throw new Error(`Migration report already exists: ${path.relative(ROOT, opts.report)}. Pass --report with a new path so the audit trail is not overwritten.`);
  }

  const changesByFile = new Map();
  for (const change of changes) {
    const file = path.join(DATA_DIR, change.book, `${change.chapter}.json`);
    if (!changesByFile.has(file)) changesByFile.set(file, []);
    changesByFile.get(file).push(change);
  }
  for (const [file, fileChanges] of changesByFile) applyChapterChanges(file, fileChanges);
  const appliedReferences = migrateSourceCorrespondenceReferences(changes, true);

  const report = {
    schemaVersion: 1,
    strategy: 'Preserve the first occurrence and all existing unique IDs; suffix later duplicates and assign the next free numeric ID to missing units.',
    chaptersScanned: files.length,
    unitsScanned,
    chaptersChanged: chapters.length,
    duplicateOccurrences: changes.filter((change) => change.reason === 'duplicate').length,
    missingIds: changes.filter((change) => change.reason === 'missing').length,
    totalChanges: changes.length,
    chapters,
    sourceCorrespondenceReferenceUpdates: appliedReferences,
    changes,
  };
  writeJsonAtomic(opts.report, report);
  console.log(`- Migration report: ${path.relative(ROOT, opts.report)}`);
}

main();
