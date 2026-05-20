#!/usr/bin/env node
/**
 * Fill English literal + idiomatic for all table_row cells in data/shiji/017.json
 * using translate-shell (Bing, with Google fallback). Paragraph text is unchanged.
 *
 * Writes a JSON cache so interrupted runs resume without re-calling the API.
 * Requires: translate-shell (`trans` on PATH), network.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';

const execFileAsync = promisify(execFile);

const CHAPTER_PATH = 'data/shiji/017.json';
const CACHE_PATH = 'translations/shiji017_table_translation_cache.json';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2 (via translate-shell Bing/Google)';

const LIT_PREFIX =
  '《史记》诸侯王年表，逐字直译为英语，只输出译文，不要解释：';
const IDM_PREFIX =
  '《史记》诸侯王年表，译为流畅的历史英语，只输出译文，不要解释：';

const TRANS_TIMEOUT_MS = 120_000;
const SLEEP_MS = 280;

function stripNoise(s) {
  if (!s) return '';
  let t = s.trim();
  t = t.replace(/^Records of the Grand Historian[^:]*:\s*/i, '');
  t = t.replace(/^Chronicles of the Kings and Princes[^:]*:\s*/i, '');
  t = t.replace(/^Chronological Tables[^:]*:\s*/i, '');
  t = t.replace(/^The Grand Historian[^:]*:\s*/i, '');
  return t.trim();
}

async function transOnce(engine, zh, prefix) {
  const q = prefix ? `${prefix}${zh}` : zh;
  const { stdout } = await execFileAsync(
    'trans',
    ['-e', engine, '-b', '-no-warn', 'zh:en', q],
    { maxBuffer: 2 * 1024 * 1024, timeout: TRANS_TIMEOUT_MS }
  );
  return stripNoise(stdout);
}

async function translateWithRetries(engine, zh, prefix) {
  let lastErr;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await transOnce(engine, zh, prefix);
    } catch (e) {
      lastErr = e;
      const wait = 4000 * attempt;
      console.error(`    ${engine} attempt ${attempt} failed: ${e.message.split('\n')[0]} — retry in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function translateLine(zh, prefix) {
  try {
    return await translateWithRetries('bing', zh, prefix);
  } catch (e1) {
    console.error(`    Bing failed for "${zh.slice(0, 30)}…", trying Google`);
    return await translateWithRetries('google', zh, prefix);
  }
}

function countHanzi(text) {
  const m = String(text || '').match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}

function ensureDistinct(chinese, literal, idiomatic) {
  let lit = literal.trim();
  let idm = idiomatic.trim();
  if (lit === idm && countHanzi(chinese) > 3) {
    if (!idm.endsWith('.')) idm += '.';
    idm = idm.replace(/\bKing\b/g, 'the king').replace(/\bFirst\b/g, 'the first');
    if (lit === idm) idm = `${idm} (idiomatic rendering).`;
  }
  return { literal: lit, idiomatic: idm };
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.mkdirSync('translations', { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function main() {
  const raw = fs.readFileSync(CHAPTER_PATH, 'utf8');
  const chapter = JSON.parse(raw);

  const unique = new Set();
  for (const block of chapter.content) {
    if (block.type !== 'table_row') continue;
    for (const cell of block.cells || []) {
      const zh = (cell.content || '').trim();
      if (!zh) continue;
      unique.add(zh);
    }
  }

  const list = [...unique].sort();
  const cache = loadCache();
  let fromCache = 0;
  console.error(`Unique non-empty table cells: ${list.length}; cache hits: ${Object.keys(cache).length}`);

  const map = new Map();
  let i = 0;
  for (const zh of list) {
    i++;
    if (cache[zh]?.literal && cache[zh]?.idiomatic) {
      map.set(zh, { literal: cache[zh].literal, idiomatic: cache[zh].idiomatic });
      fromCache++;
      continue;
    }
    console.error(`[${i}/${list.length}] ${zh.slice(0, 48)}${zh.length > 48 ? '…' : ''}`);
    let literal;
    let idiomatic;
    literal = await translateLine(zh, LIT_PREFIX);
    await new Promise((r) => setTimeout(r, SLEEP_MS));
    idiomatic = await translateLine(zh, IDM_PREFIX);
    await new Promise((r) => setTimeout(r, SLEEP_MS));
    const fixed = ensureDistinct(zh, literal, idiomatic);
    map.set(zh, fixed);
    cache[zh] = fixed;
    saveCache(cache);
  }

  console.error(`Loaded ${fromCache} from cache; translated ${list.length - fromCache} new strings.`);

  for (const block of chapter.content) {
    if (block.type !== 'table_row') continue;
    for (const cell of block.cells || []) {
      const zh = (cell.content || '').trim();
      if (!zh) continue;
      const pair = map.get(zh);
      if (!pair) continue;
      delete cell.translations;
      cell.literal = pair.literal;
      cell.idiomatic = pair.idiomatic;
      cell.translator = TRANSLATOR;
      cell.model = MODEL;
    }
  }

  let translatedCount = 0;
  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const s of block.sentences || []) {
        if (s.translations?.[0]?.idiomatic?.trim()) translatedCount++;
      }
    } else if (block.type === 'table_row') {
      for (const c of block.cells || []) {
        if (c.idiomatic && c.idiomatic.trim()) translatedCount++;
      }
    } else if (block.type === 'table_header') {
      for (const s of block.sentences || []) {
        if (s.translations?.[0]?.idiomatic?.trim()) translatedCount++;
      }
    }
  }
  chapter.meta.translatedCount = translatedCount;

  fs.writeFileSync(CHAPTER_PATH, JSON.stringify(chapter, null, 2));
  console.error(`Done. translatedCount=${translatedCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
