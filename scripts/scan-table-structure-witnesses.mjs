#!/usr/bin/env node
/**
 * Compare local table structure against upstream ctext / Wikisource witnesses.
 *
 * This scanner compares structure only: table count, row count, effective row
 * widths, and per-cell colspan/rowspan sequences. It intentionally ignores
 * cell text variants except for short evidence excerpts.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { load } from 'cheerio';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_QUEUE = path.join(QUALITY_DIR, 'table-audit-queue.json');
const DEFAULT_OUT = path.join(QUALITY_DIR, 'table-structure-witnesses.json');
const DEFAULT_CACHE_DIR = path.join(QUALITY_DIR, 'temp-repair', 'table-witness-cache');

function parseArgs(argv) {
  const opts = {
    queue: DEFAULT_QUEUE,
    out: DEFAULT_OUT,
    cacheDir: DEFAULT_CACHE_DIR,
    book: null,
    chapter: null,
    limit: null,
    fetch: false,
    summary: false,
    forceFetch: false,
    fetchTimeoutMs: 20000,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--queue') opts.queue = argv[++i];
    else if (arg.startsWith('--queue=')) opts.queue = arg.slice(8);
    else if (arg === '--out') opts.out = argv[++i];
    else if (arg.startsWith('--out=')) opts.out = arg.slice(6);
    else if (arg === '--cache-dir') opts.cacheDir = argv[++i];
    else if (arg.startsWith('--cache-dir=')) opts.cacheDir = arg.slice(12);
    else if (arg === '--book') opts.book = argv[++i];
    else if (arg.startsWith('--book=')) opts.book = arg.slice(7);
    else if (arg === '--chapter') opts.chapter = String(argv[++i]).padStart(3, '0');
    else if (arg.startsWith('--chapter=')) opts.chapter = String(arg.slice(10)).padStart(3, '0');
    else if (arg === '--limit') opts.limit = Number(argv[++i]);
    else if (arg.startsWith('--limit=')) opts.limit = Number(arg.slice(8));
    else if (arg === '--fetch') opts.fetch = true;
    else if (arg === '--force-fetch') opts.forceFetch = true;
    else if (arg === '--summary') opts.summary = true;
    else if (arg === '--fetch-timeout-ms') opts.fetchTimeoutMs = Number(argv[++i]);
    else if (arg.startsWith('--fetch-timeout-ms=')) opts.fetchTimeoutMs = Number(arg.slice(19));
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(2);
    }
  }
  return opts;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function textOf(unit) {
  return String(unit?.content ?? unit?.zh ?? '').replace(/\s+/gu, '').trim();
}

function shortText(text, limit = 80) {
  const compact = String(text || '').replace(/\s+/gu, '');
  return compact.length > limit ? `${compact.slice(0, limit - 1)}...` : compact;
}

function cellSpan(cell) {
  return {
    colspan: Number.isInteger(cell?.colspan) && cell.colspan > 0 ? cell.colspan : 1,
    rowspan: Number.isInteger(cell?.rowspan) && cell.rowspan > 0 ? cell.rowspan : 1,
  };
}

function rowSignature(cells) {
  return cells.map((cell) => {
    const { colspan, rowspan } = cellSpan(cell);
    return `${colspan}x${rowspan}`;
  });
}

function effectiveWidth(cells) {
  return cells.reduce((sum, cell) => sum + cellSpan(cell).colspan, 0);
}

function tableBlockCells(block) {
  if (block?.type === 'table_header') return block.sentences || [];
  if (block?.type === 'table_row') return block.cells || [];
  return [];
}

function isLocalTableBlock(block) {
  return block?.type === 'table_header' || block?.type === 'table_row';
}

function signatureFromRows(rows, source = 'local') {
  const normalizedRows = rows
    .map((row) => ({
      cells: row.cells.map((cell) => ({
        text: shortText(cell.text || ''),
        colspan: cell.colspan || 1,
        rowspan: cell.rowspan || 1,
      })),
      kind: row.kind || 'row',
    }))
    .filter((row) => row.cells.length > 0);

  const widthCounts = {};
  const rowWidths = normalizedRows.map((row) => {
    const width = row.cells.reduce((sum, cell) => sum + (cell.colspan || 1), 0);
    widthCounts[width] = (widthCounts[width] || 0) + 1;
    return width;
  });
  const spanCount = normalizedRows.reduce(
    (sum, row) => sum + row.cells.filter((cell) => (cell.colspan || 1) > 1 || (cell.rowspan || 1) > 1).length,
    0,
  );

  return {
    source,
    rowCount: normalizedRows.length,
    rowWidths,
    widthCounts,
    spanCount,
    cellStructure: normalizedRows.map((row) => row.cells.map((cell) => `${cell.colspan || 1}x${cell.rowspan || 1}`)),
    firstExcerpt: shortText(normalizedRows.find((row) => row.cells.some((cell) => cell.text))?.cells.map((cell) => cell.text).join('') || ''),
    lastExcerpt: shortText([...normalizedRows].reverse().find((row) => row.cells.some((cell) => cell.text))?.cells.map((cell) => cell.text).join('') || ''),
  };
}

function localSignatures(chapter) {
  const signatures = [];
  let rows = [];
  for (const block of chapter.content || []) {
    if (isLocalTableBlock(block)) {
      if (block.type === 'table_header' && rows.length > 0) {
        signatures.push(signatureFromRows(rows, 'local'));
        rows = [];
      }
      rows.push({
        kind: block.type === 'table_header' ? 'header' : 'row',
        cells: tableBlockCells(block).map((cell) => {
          const { colspan, rowspan } = cellSpan(cell);
          return { text: textOf(cell), colspan, rowspan };
        }),
      });
      continue;
    }
    if (rows.length > 0) {
      signatures.push(signatureFromRows(rows, 'local'));
      rows = [];
    }
  }
  if (rows.length > 0) signatures.push(signatureFromRows(rows, 'local'));
  return signatures;
}

function stableHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 24);
}

async function fetchWithCache(url, opts) {
  fs.mkdirSync(opts.cacheDir, { recursive: true });
  const cacheFile = path.join(opts.cacheDir, `${stableHash(url)}.txt`);
  if (!opts.forceFetch && fs.existsSync(cacheFile)) {
    return { text: fs.readFileSync(cacheFile, 'utf8'), cache: 'hit', cacheFile };
  }
  if (!opts.fetch) return { text: null, cache: 'missing', cacheFile };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.fetchTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'records-of-the-grand-historian-table-audit/1.0' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    fs.writeFileSync(cacheFile, text);
    return { text, cache: 'fetched', cacheFile };
  } finally {
    clearTimeout(timer);
  }
}

function parseSpanFromAttrs(attrs) {
  const out = { colspan: 1, rowspan: 1 };
  const colspan = String(attrs || '').match(/\bcolspan\s*=\s*["']?(\d+)/iu);
  const rowspan = String(attrs || '').match(/\browspan\s*=\s*["']?(\d+)/iu);
  if (colspan) out.colspan = Number(colspan[1]);
  if (rowspan) out.rowspan = Number(rowspan[1]);
  return out;
}

function parseMediaWikiCell(part) {
  const raw = String(part || '').trim();
  let attrs = '';
  let text = raw;
  const pipe = raw.indexOf('|');
  const beforePipe = pipe >= 0 ? raw.slice(0, pipe) : '';
  if (pipe >= 0 && /=/.test(beforePipe)) {
    attrs = beforePipe;
    text = raw.slice(pipe + 1);
  }
  return { text, ...parseSpanFromAttrs(attrs) };
}

function splitMediaWikiCells(line, marker) {
  const body = line.slice(marker.length).trim();
  const separator = marker === '!' ? '!!' : '||';
  return body.split(separator).map(parseMediaWikiCell);
}

function parseWikisourceTables(raw) {
  const lines = String(raw || '').split(/\r?\n/u);
  const tables = [];
  let depth = 0;
  let rows = null;
  let current = null;

  const closeRow = () => {
    if (current && current.cells.length > 0) rows.push(current);
    current = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('{|')) {
      depth += 1;
      if (depth === 1) {
        rows = [];
        current = null;
      }
      continue;
    }
    if (trimmed.startsWith('|}')) {
      if (depth === 1 && rows) {
        closeRow();
        if (rows.length > 0) tables.push(signatureFromRows(rows, 'wikisource'));
        rows = null;
      }
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (depth !== 1 || !rows) continue;
    if (!trimmed || trimmed.startsWith('|+')) continue;
    if (trimmed.startsWith('|-')) {
      closeRow();
      current = { kind: 'row', cells: [] };
      continue;
    }
    if (trimmed.startsWith('!')) {
      if (!current) current = { kind: 'header', cells: [] };
      current.cells.push(...splitMediaWikiCells(trimmed, '!'));
      continue;
    }
    if (trimmed.startsWith('|')) {
      if (!current) current = { kind: 'row', cells: [] };
      current.cells.push(...splitMediaWikiCells(trimmed, '|'));
    }
  }
  return tables.filter((table) => table.rowCount > 0);
}

function htmlCellText($, cell) {
  return $(cell).clone().children('table').remove().end().text();
}

function parseHtmlTables(html, source) {
  const $ = load(String(html || ''));
  const tables = [];
  $('table').each((_, table) => {
    const $table = $(table);
    if ($table.closest('#menu, #menubar, #footer').length > 0) return;
    const inText = $table.closest('td.ctext, div#content3, div.mw-parser-output, body').length > 0;
    if (!inText) return;
    const rows = [];
    $table.find('tr').each((__, tr) => {
      const cells = [];
      $(tr).children('th,td').each((___, cell) => {
        cells.push({
          text: htmlCellText($, cell),
          colspan: Number($(cell).attr('colspan')) || 1,
          rowspan: Number($(cell).attr('rowspan')) || 1,
        });
      });
      if (cells.length > 0) rows.push({ kind: 'row', cells });
    });
    const cjkText = rows.map((row) => row.cells.map((cell) => cell.text).join('')).join('');
    if (!/[\p{Script=Han}]/u.test(cjkText)) return;
    if (rows.length < 2 && rows.every((row) => row.cells.length < 2)) return;
    tables.push(signatureFromRows(rows, source));
  });
  return tables;
}

function sameSignature(a, b) {
  return JSON.stringify(a?.cellStructure || []) === JSON.stringify(b?.cellStructure || []);
}

function witnessMatch(local, witness) {
  if (local.length !== witness.length) return false;
  return local.every((table, index) => sameSignature(table, witness[index]));
}

function findMatchingWindow(local, witness) {
  if (local.length === 0 || witness.length < local.length) return -1;
  for (let start = 0; start <= witness.length - local.length; start += 1) {
    const candidate = witness.slice(start, start + local.length);
    if (witnessMatch(local, candidate)) return start;
  }
  return -1;
}

function witnessContainsMatch(local, witness) {
  return findMatchingWindow(local, witness) >= 0;
}

function witnessDistance(local, witness) {
  const matchingWindow = findMatchingWindow(local, witness);
  if (matchingWindow >= 0) return 0;

  let distance = Math.abs(local.length - witness.length) * 1000;
  const n = Math.min(local.length, witness.length);
  for (let i = 0; i < n; i += 1) {
    distance += Math.abs(local[i].rowCount - witness[i].rowCount) * 20;
    const rows = Math.min(local[i].cellStructure.length, witness[i].cellStructure.length);
    for (let r = 0; r < rows; r += 1) {
      if (local[i].cellStructure[r].join(',') !== witness[i].cellStructure[r].join(',')) distance += 1;
    }
  }
  return distance;
}

function compactSignature(signature) {
  return {
    source: signature.source,
    rowCount: signature.rowCount,
    rowWidths: signature.rowWidths,
    widthCounts: signature.widthCounts,
    spanCount: signature.spanCount,
    structureHash: stableHash(JSON.stringify(signature.cellStructure || [])),
    firstExcerpt: signature.firstExcerpt,
    lastExcerpt: signature.lastExcerpt,
  };
}

async function scanItem(item, opts) {
  const chapter = readJson(path.join(process.cwd(), item.file));
  const local = localSignatures(chapter);
  const witnesses = [];
  for (const candidate of item.upstreamCandidates || []) {
    if (!['ctext', 'wikisource-raw'].includes(candidate.kind)) continue;
    try {
      const fetched = await fetchWithCache(candidate.url, opts);
      let tables = [];
      if (fetched.text) {
        tables = candidate.kind === 'wikisource-raw'
          ? parseWikisourceTables(fetched.text)
          : parseHtmlTables(fetched.text, 'ctext');
      }
      const containsLocal = tables.length > 0 ? witnessContainsMatch(local, tables) : false;
      witnesses.push({
        kind: candidate.kind,
        url: candidate.url,
        cache: fetched.cache,
        tableCount: tables.length,
        matchesLocal: containsLocal,
        matchingWindowStart: containsLocal ? findMatchingWindow(local, tables) : -1,
        distance: tables.length > 0 ? witnessDistance(local, tables) : null,
        tables: tables.map(compactSignature),
      });
    } catch (error) {
      witnesses.push({
        kind: candidate.kind,
        url: candidate.url,
        error: error.message,
        tableCount: 0,
        matchesLocal: false,
        distance: null,
        tables: [],
      });
    }
  }
  const usable = witnesses.filter((witness) => witness.tableCount > 0);
  const matching = usable.filter((witness) => witness.matchesLocal);
  const best = usable.slice().sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))[0] || null;
  return {
    id: item.id,
    book: item.book,
    chapter: item.chapter,
    file: item.file,
    status: matching.length > 0 ? 'matched' : usable.length > 0 ? 'mismatch' : 'no-usable-witness',
    localTableCount: local.length,
    local: local.map(compactSignature),
    witnesses,
    bestWitness: best ? { kind: best.kind, url: best.url, distance: best.distance, tableCount: best.tableCount } : null,
  };
}

function summarize(results) {
  const byStatus = {};
  const byBook = {};
  for (const result of results) {
    byStatus[result.status] = (byStatus[result.status] || 0) + 1;
    byBook[result.book] = byBook[result.book] || {};
    byBook[result.book][result.status] = (byBook[result.book][result.status] || 0) + 1;
  }
  return { total: results.length, byStatus, byBook };
}

const opts = parseArgs(process.argv.slice(2));
const queue = readJson(opts.queue);
const allQueueItems = queue.items || [];
let items = allQueueItems;
if (opts.book) items = items.filter((item) => item.book === opts.book);
if (opts.chapter) items = items.filter((item) => item.chapter === opts.chapter);
if (Number.isFinite(opts.limit) && opts.limit > 0) items = items.slice(0, opts.limit);

const results = [];
for (let i = 0; i < items.length; i += 1) {
  const item = items[i];
  console.log(`Scanning ${i + 1}/${items.length} ${item.book}/${item.chapter}`);
  results.push(await scanItem(item, opts));
}

const report = {
  generatedAt: new Date().toISOString(),
  scanner: 'scan-table-structure-witnesses',
  description: 'Compares local table structures against ctext and Wikisource table witnesses.',
  summary: summarize(results),
  results,
};

const isScopedDefaultOutput = opts.out === DEFAULT_OUT && results.length < allQueueItems.length;
if (isScopedDefaultOutput && fs.existsSync(opts.out)) {
  const existing = readJson(opts.out);
  const byId = new Map((existing.results || []).map((result) => [result.id, result]));
  for (const result of results) byId.set(result.id, result);
  const order = new Map(allQueueItems.map((item, index) => [item.id, index]));
  report.results = [...byId.values()].sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
  report.summary = summarize(report.results);
}
writeJson(opts.out, report);

if (opts.summary) {
  console.log(`Wrote ${opts.out}`);
  console.log(JSON.stringify(report.summary, null, 2));
  const mismatches = results.filter((result) => result.status !== 'matched');
  for (const result of mismatches.slice(0, 25)) {
    const best = result.bestWitness ? `${result.bestWitness.kind} distance=${result.bestWitness.distance}` : 'no witness';
    console.log(`${result.status}\t${result.book}/${result.chapter}\tlocal=${result.localTableCount}\t${best}`);
  }
  if (mismatches.length > 25) console.log(`... ${mismatches.length - 25} more`);
}
