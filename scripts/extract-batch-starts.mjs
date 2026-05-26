#!/usr/bin/env node
/**
 * Extract book/chapter keys from batch log === START lines.
 *
 *   node scripts/extract-batch-starts.mjs
 *   node scripts/extract-batch-starts.mjs /tmp/sdk-full-batch.log
 *   node scripts/extract-batch-starts.mjs --out data/batch-started-chapters.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterKey } from './translation-inflight.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_LOG = process.env.SDK_SHORTEST_BATCH_LOG || '/tmp/sdk-full-batch.log';
const DEFAULT_OUT = path.join(ROOT, 'data', 'batch-started-chapters.json');

const START_RE = /^=== START (\S+)\/(\S+) \((\d+) sentences\) /;

function parseArgs() {
  let logPath = DEFAULT_LOG;
  let outPath = DEFAULT_OUT;
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--out' && process.argv[i + 1]) {
      outPath = path.resolve(ROOT, process.argv[++i]);
    } else if (!process.argv[i].startsWith('-')) {
      logPath = path.resolve(process.argv[i]);
    }
  }
  return { logPath, outPath };
}

/**
 * @param {string} logPath
 */
export function parseBatchStartLog(logPath) {
  if (!fs.existsSync(logPath)) {
    throw new Error(`Log not found: ${logPath}`);
  }
  const text = fs.readFileSync(logPath, 'utf8');
  /** @type {Map<string, { book: string, chapter: string, sentences: number, firstStartedAt?: string }>} */
  const byKey = new Map();

  for (const line of text.split('\n')) {
    const m = line.match(START_RE);
    if (!m) continue;
    const book = m[1];
    const chapter = m[2];
    const sentences = Number.parseInt(m[3], 10);
    const ts = line.match(/(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/)?.[1];
    const key = chapterKey(book, chapter);
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, { book, chapter, sentences, firstStartedAt: ts });
    } else if (ts && (!prev.firstStartedAt || ts < prev.firstStartedAt)) {
      prev.firstStartedAt = ts;
    }
  }

  const chapters = [...byKey.values()].sort(
    (a, b) =>
      a.sentences - b.sentences ||
      a.book.localeCompare(b.book) ||
      a.chapter.localeCompare(b.chapter, 'en', { numeric: true }),
  );

  return { chapters, startLineCount: (text.match(/^=== START /gm) || []).length };
}

function main() {
  const { logPath, outPath } = parseArgs();
  const { chapters, startLineCount } = parseBatchStartLog(logPath);

  const payload = {
    extractedAt: new Date().toISOString(),
    logPath,
    startLineCount,
    uniqueChapters: chapters.length,
    chapters,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');

  console.log(`Log: ${logPath}`);
  console.log(`START lines: ${startLineCount}`);
  console.log(`Unique chapters: ${chapters.length}`);
  console.log(`Wrote: ${outPath}`);
  if (chapters.length > 0) {
    console.log(`Shortest started: ${chapters[0].book}/${chapters[0].chapter} (${chapters[0].sentences})`);
    const last = chapters[chapters.length - 1];
    console.log(`Latest in log (by sentence sort): ${last.book}/${last.chapter} (${last.sentences})`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
