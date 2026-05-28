#!/usr/bin/env node
/**
 * Scan chapter JSON for source annotation spans marked with 〈...〉.
 *
 * These spans are common in annotated histories such as Sanguozhi, where Pei
 * Songzhi's commentary and cited works are embedded in angle brackets. The
 * initial English pass often translated the text but dropped the visible
 * annotation boundary, making commentary read like main text.
 *
 * Usage:
 *   node scripts/scan-annotation-boundaries.mjs data/sanguozhi/001.json
 *   node scripts/scan-annotation-boundaries.mjs --book sanguozhi
 *   node scripts/scan-annotation-boundaries.mjs --book sanguozhi --details
 *   node scripts/scan-annotation-boundaries.mjs data/sanguozhi/001.json --extract
 */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const opts = {
    book: null,
    details: false,
    extract: false,
    fix: false,
    onlyMissing: false,
    irregular: false,
    out: null,
    outDir: null,
    paths: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--book') {
      opts.book = argv[++i];
    } else if (arg === '--details') {
      opts.details = true;
    } else if (arg === '--extract') {
      opts.extract = true;
    } else if (arg === '--fix') {
      opts.fix = true;
    } else if (arg === '--only-missing') {
      opts.onlyMissing = true;
    } else if (arg === '--irregular') {
      opts.irregular = true;
    } else if (arg === '--out') {
      opts.out = argv[++i];
    } else if (arg === '--out-dir') {
      opts.outDir = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      opts.paths.push(arg);
    }
  }

  return opts;
}

function printHelp() {
  console.log(`Usage:
  node scripts/scan-annotation-boundaries.mjs [chapter.json ...]
  node scripts/scan-annotation-boundaries.mjs --book <book>
  node scripts/scan-annotation-boundaries.mjs --book <book> --details
  node scripts/scan-annotation-boundaries.mjs --book <book> --only-missing --details
  node scripts/scan-annotation-boundaries.mjs --book <book> --irregular --details
  node scripts/scan-annotation-boundaries.mjs <chapter.json> --extract [--out path]
  node scripts/scan-annotation-boundaries.mjs --book <book> --only-missing --extract [--out-dir dir]
  node scripts/scan-annotation-boundaries.mjs --book <book> --only-missing --fix

Options:
  --book <book>     Scan every data/<book>/*.json file.
  --details         Print one TSV row per annotation-scoped sentence.
  --only-missing    Limit details/extract output to spans with missing English boundaries.
  --irregular       Limit output to chapters with open spans or unbalanced closes.
  --extract         Write a review JSON with only annotation-scoped sentences.
  --fix             Insert missing English 〈/〉 markers on boundary rows in place.
  --out <path>      Output path for --extract. Defaults to translations/annotation_review_<book>_<chapter>.json.
  --out-dir <dir>   Output directory for multi-chapter --extract. Defaults to translations/.
`);
}

function countChar(text, char) {
  if (!text) return 0;
  let count = 0;
  for (const c of String(text)) {
    if (c === char) count++;
  }
  return count;
}

function tsv(value) {
  return String(value ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
}

function titleFor(data) {
  const title = data.meta?.title;
  if (typeof title === 'string') return title;
  return title?.en || title?.zh || title?.raw || '';
}

function* iterRows(data) {
  for (const block of data.content || []) {
    const rows = block.type === 'table_row' ? block.cells : block.sentences;
    if (!rows) continue;
    for (const row of rows) {
      const tr = row.translations?.[0] || row;
      const translator = tr?.translator || row.translator;
      if (translator === 'Herbert J. Allen (1894)') continue;
      yield {
        id: row.id,
        type: block.type,
        zh: row.zh ?? row.content ?? '',
        literal: tr?.literal ?? row.literal ?? '',
        idiomatic: tr?.idiomatic ?? row.idiomatic ?? row.translation ?? '',
      };
    }
  }
}

function englishHasAnnotationMarker(text, boundary) {
  const en = String(text || '').trim();
  if (!en) return false;
  if (boundary === 'start') {
    return /^(?:[〈\[\(（⟨‹]|<|(?:annotation|annot\.|commentary|note):)/i.test(en);
  }
  if (boundary === 'end') {
    return /(?:[〉\]\)）⟩›]|>)["')\]）。．.,;:!?！？]*\s*$/.test(en);
  }
  return /(?:annotation|annot\.|commentary|note|\[|〈|〉|\])/i.test(en);
}

function addEnglishAnnotationMarker(text, boundary) {
  const value = String(text || '');
  if (!value.trim()) return value;
  if (englishHasAnnotationMarker(value, boundary)) return value;
  if (boundary === 'start') {
    return value.replace(/^(\s*)/, '$1〈');
  }
  if (boundary === 'end') {
    return value.replace(/(\s*)$/, '〉$1');
  }
  return value;
}

function sourceTitle(zh) {
  const m = String(zh || '').match(/《([^》]+)》\s*(?:曰|云|載|載曰|並云|及)/);
  return m?.[1] || '';
}

function startsWithAnnotationBoundary(zh) {
  const value = String(zh || '').trim();
  const index = value.indexOf('〈');
  if (index === -1) return false;
  return /^[\s「『“‘"'(（【\[]*$/.test(value.slice(0, index));
}

function endsWithAnnotationBoundary(zh) {
  const value = String(zh || '').trim();
  const index = value.lastIndexOf('〉');
  if (index === -1) return false;
  return /^[\s。．.，,、；;：:！？!?」』”’"')）】\]]*$/.test(value.slice(index + 1));
}

function scanChapter(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const book = data.meta?.book || path.basename(path.dirname(filePath));
  const chapter = data.meta?.chapter || path.basename(filePath, '.json');

  const rows = [];
  const spans = [];
  const openStack = [];
  let depth = 0;
  let nextSpanId = 1;
  let unbalancedCloses = 0;

  for (const row of iterRows(data)) {
    const opens = countChar(row.zh, '〈');
    const closes = countChar(row.zh, '〉');
    const startsHere = opens > 0;
    const startsAtRowStart = startsWithAnnotationBoundary(row.zh);
    const endsAtRowEnd = endsWithAnnotationBoundary(row.zh);
    const wasInside = depth > 0;
    const inside = wasInside || startsHere;
    const spanIds = openStack.map((s) => s.id);

    for (let i = 0; i < opens; i++) {
      const span = {
        id: nextSpanId++,
        startId: row.id,
        endId: null,
        sentences: 0,
      };
      openStack.push(span);
      spans.push(span);
      spanIds.push(span.id);
      depth++;
    }

    if (inside) {
      for (const span of openStack) span.sentences++;
      rows.push({
        book,
        chapter,
        file: filePath,
        spanIds: [...new Set(spanIds)],
        id: row.id,
        type: row.type,
        startsAnnotation: startsAtRowStart,
        endsAnnotation: endsAtRowEnd,
        depthBefore: wasInside ? depth - opens : 0,
        sourceTitle: sourceTitle(row.zh),
        missingEnglishStart: startsAtRowStart && !englishHasAnnotationMarker(row.idiomatic || row.literal, 'start'),
        missingEnglishEnd: endsAtRowEnd && (wasInside || startsAtRowStart) && !englishHasAnnotationMarker(row.idiomatic || row.literal, 'end'),
        zh: row.zh,
        literal: row.literal,
        idiomatic: row.idiomatic,
      });
    }

    for (let i = 0; i < closes; i++) {
      const span = openStack.pop();
      if (span) {
        span.endId = row.id;
        depth--;
      } else {
        unbalancedCloses++;
      }
    }
  }

  const missingBoundarySpanIds = new Set();
  for (const row of rows) {
    if (!row.missingEnglishStart && !row.missingEnglishEnd) continue;
    for (const id of row.spanIds) missingBoundarySpanIds.add(id);
  }

  return {
    book,
    chapter,
    title: titleFor(data),
    file: filePath,
    annotationSpans: spans.length,
    closedSpans: spans.filter((s) => s.endId).length,
    openSpans: openStack.length,
    unbalancedCloses,
    annotationSentences: rows.length,
    missingEnglishStarts: rows.filter((r) => r.missingEnglishStart).length,
    missingEnglishEnds: rows.filter((r) => r.missingEnglishEnd).length,
    missingBoundarySpanIds,
    openSpanStarts: openStack.map((span) => span.startId),
    rows,
  };
}

function fixChapter(filePath, result, opts) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rowsById = new Map();
  for (const row of filterRows(result, opts)) rowsById.set(row.id, row);
  if (rowsById.size === 0) return { changedRows: 0, changedFields: 0 };

  let changedRows = 0;
  let changedFields = 0;

  for (const block of data.content || []) {
    const rows = block.type === 'table_row' ? block.cells : block.sentences;
    if (!rows) continue;
    for (const row of rows) {
      const scanned = rowsById.get(row.id);
      if (!scanned) continue;

      let rowChanged = false;
      const target = row.translations?.[0] || row;
      for (const field of ['literal', 'idiomatic']) {
        if (typeof target[field] !== 'string' || !target[field].trim()) continue;
        let next = target[field];
        if (scanned.missingEnglishStart) {
          next = addEnglishAnnotationMarker(next, 'start');
        }
        if (scanned.missingEnglishEnd) {
          next = addEnglishAnnotationMarker(next, 'end');
        }
        if (next !== target[field]) {
          target[field] = next;
          changedFields++;
          rowChanged = true;
        }
      }
      if (rowChanged) changedRows++;
    }
  }

  if (changedRows > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  return { changedRows, changedFields };
}

function filterRows(result, opts) {
  let rows = result.rows;
  if (opts.onlyMissing) {
    rows = rows.filter((row) => row.spanIds.some((id) => result.missingBoundarySpanIds.has(id)));
  }
  return rows;
}

function resultMatches(result, opts) {
  if (opts.irregular && result.openSpans === 0 && result.unbalancedCloses === 0) return false;
  if (opts.onlyMissing && result.missingBoundarySpanIds.size === 0) return false;
  return true;
}

function chapterPaths(opts) {
  if (opts.paths.length > 0) return opts.paths.map((p) => path.resolve(p));
  if (opts.book) {
    const dir = path.resolve('data', opts.book);
    return fs.readdirSync(dir)
      .filter((name) => name.endsWith('.json'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((name) => path.join(dir, name));
  }
  printHelp();
  process.exit(1);
}

function writeExtract(result, outPath, rows) {
  const output = outPath || path.join(
    'translations',
    `annotation_review_${result.book}_${result.chapter}.json`
  );
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({
    book: result.book,
    chapter: result.chapter,
    title: result.title,
    sourceFile: result.file,
    extractedAt: new Date().toISOString(),
    note: 'Only sentences inside Chinese 〈...〉 annotation spans are included. Preserve visible annotation boundaries or add equivalent annotation markup in English.',
    translations: rows.map((row) => ({
      id: row.id,
      type: row.type,
      spanIds: row.spanIds,
      startsAnnotation: row.startsAnnotation,
      endsAnnotation: row.endsAnnotation,
      sourceTitle: row.sourceTitle,
      chinese: row.zh,
      literal: row.literal,
      idiomatic: row.idiomatic,
    })),
  }, null, 2));
  return output;
}

const opts = parseArgs(process.argv.slice(2));
const paths = chapterPaths(opts);
const results = paths.map(scanChapter)
  .filter((r) => r.annotationSentences > 0)
  .filter((r) => resultMatches(r, opts));

if (opts.extract) {
  if (opts.out && results.length !== 1) {
    console.error('--out can only be used when extracting exactly one chapter. Use --out-dir for book-wide extraction.');
    process.exit(1);
  }
  let totalRows = 0;
  for (const result of results) {
    const rows = filterRows(result, opts);
    if (rows.length === 0) continue;
    const output = opts.out || path.join(
      opts.outDir || 'translations',
      `annotation_review_${result.book}_${result.chapter}.json`
    );
    writeExtract(result, output, rows);
    totalRows += rows.length;
    console.log(`Wrote ${rows.length} annotation-scoped sentence(s) to ${output}`);
  }
  console.log(`Wrote ${totalRows} total annotation-scoped sentence(s) across ${results.length} chapter(s).`);
  process.exit(0);
}

if (opts.fix) {
  let totalChangedRows = 0;
  let totalChangedFields = 0;
  for (const result of results) {
    const { changedRows, changedFields } = fixChapter(result.file, result, opts);
    totalChangedRows += changedRows;
    totalChangedFields += changedFields;
    if (changedRows > 0) {
      console.log(`${result.book}/${result.chapter}: added boundary markers to ${changedRows} row(s), ${changedFields} field(s)`);
    }
  }
  console.log(`Added boundary markers to ${totalChangedRows} row(s), ${totalChangedFields} field(s) across ${results.length} chapter(s).`);
  process.exit(0);
}

if (opts.details) {
  console.log('book\tchapter\tspan_ids\tsentence_id\tstarts_annotation\tends_annotation\tsource_title\tmissing_english_start\tmissing_english_end\tchinese\tidiomatic');
  for (const result of results) {
    for (const row of filterRows(result, opts)) {
      console.log([
        row.book,
        row.chapter,
        row.spanIds.join(','),
        row.id,
        row.startsAnnotation ? 'yes' : 'no',
        row.endsAnnotation ? 'yes' : 'no',
        row.sourceTitle,
        row.missingEnglishStart ? 'yes' : 'no',
        row.missingEnglishEnd ? 'yes' : 'no',
        row.zh,
        row.idiomatic,
      ].map(tsv).join('\t'));
    }
  }
  process.exit(0);
}

console.log('book\tchapter\tspans\tclosed_spans\topen_spans\tunbalanced_closes\tannotation_sentences\tmissing_english_starts\tmissing_english_ends\tmissing_boundary_spans\topen_span_starts\tfile');
for (const result of results) {
  console.log([
    result.book,
    result.chapter,
    result.annotationSpans,
    result.closedSpans,
    result.openSpans,
    result.unbalancedCloses,
    result.annotationSentences,
    result.missingEnglishStarts,
    result.missingEnglishEnds,
    result.missingBoundarySpanIds.size,
    result.openSpanStarts.join(','),
    path.relative(process.cwd(), result.file),
  ].join('\t'));
}
