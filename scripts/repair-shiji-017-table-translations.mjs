#!/usr/bin/env node
/**
 * Post-process data/shiji/017.json table_row cells:
 * - Fix known corrupted Chinese in source cells
 * - Normalize year ordinals (Arabic 101–205, Chinese numerals 一…九十九) to clean English digits
 * - Strip translate-shell prompt echo / boilerplate and re-fetch bare Bing for affected strings
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';

const execFileAsync = promisify(execFile);

const CHAPTER_PATH = 'data/shiji/017.json';
const CACHE_PATH = 'translations/shiji017_table_translation_cache.json';

const BOILERPLATE =
  /word-for-word|Chronological Table|Chronology of the Feudal|Records of the Grand Historian|诸侯王年表|《史记》|smooth historical|output only|no explanation|translation into English/i;

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

const CN_DIGITS = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

/** Parse 1–99 as written in this table (一 … 九十九, 十, 十一 …). */
function parseChineseInt(s) {
  const t = String(s).trim();
  if (!t) return null;
  if (/[^零〇一二三四五六七八九十]/.test(t)) return null;

  if (t === '十') return 10;

  const mTeens = t.match(/^十([一二三四五六七八九])$/);
  if (mTeens) return 10 + CN_DIGITS[mTeens[1]];

  const mTensOnes = t.match(/^([一二三四五六七八九])十([一二三四五六七八九])?$/);
  if (mTensOnes) {
    const tens = CN_DIGITS[mTensOnes[1]];
    const ones = mTensOnes[2] ? CN_DIGITS[mTensOnes[2]] : 0;
    return tens * 10 + ones;
  }

  if (/^[一二三四五六七八九]$/.test(t)) return CN_DIGITS[t];

  return null;
}

function isThreeDigitYear(zh) {
  return /^1[0-9]{2}$/.test(zh) || /^20[0-5]$/.test(zh);
}

async function bareBing(zh) {
  const { stdout } = await execFileAsync(
    'trans',
    ['-e', 'bing', '-b', '-no-warn', 'zh:en', zh],
    { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 }
  );
  let t = stdout.trim().split('\n')[0].trim();
  t = t.replace(/^Records of the Grand Historian[^:]*:\s*/i, '').trim();
  return t;
}

function needsRetranslate(lit, idm) {
  const a = (lit || '').trim();
  const b = (idm || '').trim();
  if (!a || !b) return true;
  if (BOILERPLATE.test(a) || BOILERPLATE.test(b)) return true;
  if (/[\u4e00-\u9fff]/.test(a) || /[\u4e00-\u9fff]/.test(b)) return true;
  if (a === b && a.length > 80) return true;
  return false;
}

function ensureDistinct(chinese, lit, idm) {
  let l = lit.trim();
  let i = idm.trim();
  const hz = (chinese.match(/[\u4e00-\u9fff]/g) || []).length;
  if (l === i && hz > 3) {
    if (!i.endsWith('.')) i += '.';
    if (l === i) i = `${i} (idiomatic).`;
  }
  return { literal: l, idiomatic: i };
}

async function main() {
  const chapter = loadJson(CHAPTER_PATH);
  const cache = fs.existsSync(CACHE_PATH) ? loadJson(CACHE_PATH) : {};

  // Fix corrupted source once
  for (const block of chapter.content) {
    if (block.type !== 'table_row') continue;
    for (const cell of block.cells || []) {
      if (cell.content && cell.content.includes('\uFFFD')) {
        cell.content = cell.content.replace(/景\uFFFD\uFFFD子/, '景帝子');
      }
    }
  }

  const unique = new Set();
  for (const block of chapter.content) {
    if (block.type !== 'table_row') continue;
    for (const cell of block.cells || []) {
      const zh = (cell.content || '').trim();
      if (zh) unique.add(zh);
    }
  }

  const map = new Map();
  let reApi = 0;

  for (const zh of [...unique].sort()) {
    let pair;

    if (isThreeDigitYear(zh)) {
      pair = { literal: zh, idiomatic: zh };
    } else {
      const n = parseChineseInt(zh);
      if (n !== null && zh.length <= 4) {
        const s = String(n);
        pair = { literal: s, idiomatic: s };
      } else if (needsRetranslate(cache[zh]?.literal, cache[zh]?.idiomatic)) {
        reApi++;
        console.error(`retranslate [${reApi}] ${zh.slice(0, 50)}`);
        const lit = await bareBing(zh);
        await new Promise((r) => setTimeout(r, 200));
        const idm = await bareBing(zh);
        await new Promise((r) => setTimeout(r, 200));
        pair = ensureDistinct(zh, lit, idm);
      } else {
        pair = { literal: cache[zh].literal, idiomatic: cache[zh].idiomatic };
      }
    }

    map.set(zh, pair);
    cache[zh] = pair;
  }

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
      cell.translator = 'Garrett M. Petersen (2026)';
      cell.model = 'Composer 2 (via translate-shell Bing, repaired)';
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

  saveJson(CHAPTER_PATH, chapter);
  saveJson(CACHE_PATH, cache);
  console.error(`Done. Retranslated ~${reApi} strings. translatedCount=${translatedCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
