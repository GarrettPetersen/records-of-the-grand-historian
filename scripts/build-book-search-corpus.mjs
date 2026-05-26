#!/usr/bin/env node
/**
 * Build per-book full-text search corpora under public/data/search-corpus/.
 *
 * Small books stay as a single `public/data/search-corpus/{bookId}.json` file.
 * Oversized books are split into `public/data/search-corpus/{bookId}/index.json`
 * plus `part-XXX.json` shards so no individual asset exceeds the Pages limit.
 *
 * Block index `i` matches chapter HTML fragment #p-{i}.
 * Mirrors generate-static-pages.js content walk for paragraph / table_row / table_header+rows.
 *
 * Usage:
 *   node scripts/build-book-search-corpus.mjs
 *   node scripts/build-book-search-corpus.mjs --book shiji
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const outDir = path.join(root, 'public', 'data', 'search-corpus');
const MAX_FLAT_BYTES = 20 * 1024 * 1024;
const MAX_CHUNK_BYTES = 20 * 1024 * 1024;

/** @typedef {[number, string, string]} BlockTuple [contentIndex, zhText, enText] */

/**
 * @param {object} chapterData
 * @returns {BlockTuple[]}
 */
function extractBlocks(chapterData) {
  const content = chapterData.content || [];
  /** @type {BlockTuple[]} */
  const blocks = [];

  for (let i = 0; i < content.length; i += 1) {
    const block = content[i];

    if (block.type === 'table_row') {
      const tableRows = [block];
      let j = i + 1;
      while (j < content.length && content[j].type === 'table_row') {
        tableRows.push(content[j]);
        j += 1;
      }
      const zhParts = [];
      const enParts = [];
      for (const row of tableRows) {
        for (const cell of row.cells || []) {
          if (cell.content) zhParts.push(cell.content);
          if (cell.translation) enParts.push(cell.translation);
        }
      }
      blocks.push([i, zhParts.join(' '), enParts.join(' ')]);
      i = j - 1;
      continue;
    }

    if (block.type === 'paragraph') {
      const zh = (block.sentences || []).map((s) => s.zh || '').join('');
      const en = (block.sentences || [])
        .map((s) => {
          const t = s.translation || (s.translations && s.translations.length > 0 ? s.translations[0] : null);
          return t ? String(t.idiomatic || t.literal || t.text || '').trim() : '';
        })
        .join(' ');
      blocks.push([i, zh, en]);
      continue;
    }

    if (block.type === 'table_header') {
      const tableRows = [];
      let j = i + 1;
      while (j < content.length && content[j].type === 'table_row') {
        tableRows.push(content[j]);
        j += 1;
      }
      if (tableRows.length === 0) continue;

      const zhH = (block.sentences || []).map((s) => s.zh || '').join('');
      const zhCells = [];
      const enCells = [];
      for (const row of tableRows) {
        for (const cell of row.cells || []) {
          if (cell.content) zhCells.push(cell.content);
          if (cell.translation) enCells.push(cell.translation);
        }
      }
      const enH = (block.sentences || [])
        .map((s) => {
          const tr = s.translations && s.translations[0];
          return tr ? String(tr.idiomatic || tr.literal || tr.text || '').trim() : '';
        })
        .join('');
      blocks.push([i, `${zhH} ${zhCells.join(' ')}`.trim(), `${enH} ${enCells.join(' ')}`.trim()]);
      i = j - 1;
    }
  }

  return blocks;
}

function buildBookCorpus(bookId) {
  const bookPath = path.join(dataDir, bookId);
  if (!fs.existsSync(bookPath) || !fs.statSync(bookPath).isDirectory()) return null;

  /** @type {Record<string, BlockTuple[]>} */
  const chapters = {};
  const files = fs.readdirSync(bookPath).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const chPad = path.basename(file, '.json');
    const fp = path.join(bookPath, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch {
      continue;
    }
    const blocks = extractBlocks(data);
    if (blocks.length > 0) chapters[chPad] = blocks;
  }

  if (Object.keys(chapters).length === 0) return null;

  return {
    v: 1,
    bookId,
    generatedAt: new Date().toISOString(),
    chapters,
  };
}

/**
 * Remove stale outputs for a book before rewriting its corpus.
 * @param {string} bookId
 */
function cleanBookOutput(bookId) {
  fs.rmSync(path.join(outDir, `${bookId}.json`), { force: true });
  fs.rmSync(path.join(outDir, bookId), { recursive: true, force: true });
}

/**
 * @param {Record<string, BlockTuple[]>} chapters
 * @returns {Array<[string, BlockTuple[]]>}
 */
function sortChapterEntries(chapters) {
  return Object.entries(chapters).sort((a, b) => {
    const aNum = Number.parseInt(a[0], 10);
    const bNum = Number.parseInt(b[0], 10);
    if (Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== bNum) {
      return aNum - bNum;
    }
    return a[0].localeCompare(b[0]);
  });
}

/**
 * @param {string} bookId
 * @param {Record<string, BlockTuple[]>} chapters
 */
function chunkBookCorpus(bookId, chapters) {
  const entries = sortChapterEntries(chapters);
  /** @type {Record<string, BlockTuple[]>[]} */
  const parts = [];
  /** @type {Record<string, BlockTuple[]>} */
  let current = {};

  const encodePart = (partChapters) =>
    JSON.stringify({
      v: 2,
      bookId,
      chapters: partChapters,
    });

  for (const [chKey, blocks] of entries) {
    const next = { ...current, [chKey]: blocks };
    const nextBytes = Buffer.byteLength(encodePart(next), 'utf8');
    if (nextBytes > MAX_CHUNK_BYTES && Object.keys(current).length > 0) {
      parts.push(current);
      current = { [chKey]: blocks };
      continue;
    }
    current = next;
  }

  if (Object.keys(current).length > 0) {
    parts.push(current);
  }

  return parts;
}

/**
 * @param {string} bookId
 * @param {{ v: number, bookId: string, generatedAt: string, chapters: Record<string, BlockTuple[]> }} corpus
 */
function writeBookCorpus(bookId, corpus) {
  cleanBookOutput(bookId);

  const flatJson = JSON.stringify(corpus);
  const flatBytes = Buffer.byteLength(flatJson, 'utf8');
  if (flatBytes <= MAX_FLAT_BYTES) {
    const outPath = path.join(outDir, `${bookId}.json`);
    fs.writeFileSync(outPath, flatJson, 'utf8');
    return {
      mode: 'flat',
      parts: 1,
      bytes: flatBytes,
    };
  }

  const bookDir = path.join(outDir, bookId);
  fs.mkdirSync(bookDir, { recursive: true });

  const parts = chunkBookCorpus(bookId, corpus.chapters);
  const manifest = {
    v: 2,
    bookId,
    generatedAt: corpus.generatedAt,
    format: 'chunked',
    parts: parts.map((part, index) => ({
      file: `part-${String(index + 1).padStart(3, '0')}.json`,
      chapters: sortChapterEntries(part).map(([chKey]) => chKey),
    })),
  };
  fs.writeFileSync(path.join(bookDir, 'index.json'), JSON.stringify(manifest), 'utf8');

  let totalBytes = Buffer.byteLength(JSON.stringify(manifest), 'utf8');
  parts.forEach((part, index) => {
    const payload = JSON.stringify({
      v: 2,
      bookId,
      part: index + 1,
      parts: parts.length,
      chapters: part,
    });
    const outPath = path.join(bookDir, `part-${String(index + 1).padStart(3, '0')}.json`);
    fs.writeFileSync(outPath, payload, 'utf8');
    totalBytes += Buffer.byteLength(payload, 'utf8');
  });

  return {
    mode: 'chunked',
    parts: parts.length,
    bytes: totalBytes,
  };
}

function listBookDirs() {
  return fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => {
      if (name === 'public') return false;
      const p = path.join(dataDir, name);
      try {
        return fs.readdirSync(p).some((f) => f.endsWith('.json'));
      } catch {
        return false;
      }
    });
}

function main() {
  const args = process.argv.slice(2);
  const bookIdx = args.indexOf('--book');
  const single = bookIdx !== -1 && args[bookIdx + 1] ? args[bookIdx + 1] : null;

  fs.mkdirSync(outDir, { recursive: true });

  const books = single ? [single] : listBookDirs();
  let n = 0;
  for (const bookId of books) {
    const corpus = buildBookCorpus(bookId);
    if (!corpus) {
      console.warn(`search-corpus: skip ${bookId} (no chapter JSON or empty)`);
      continue;
    }
    const result = writeBookCorpus(bookId, corpus);
    if (result.mode === 'flat') {
      console.log(
        `search-corpus: ${bookId}.json\t${(result.bytes / 1024 / 1024).toFixed(2)} MB`,
      );
    } else {
      console.log(
        `search-corpus: ${bookId}/index.json + ${result.parts} part(s)\t${(result.bytes / 1024 / 1024).toFixed(2)} MB`,
      );
    }
    n += 1;
  }
  console.log(`search-corpus: wrote ${n} corpus output(s) → ${path.relative(root, outDir)}`);
}

main();
