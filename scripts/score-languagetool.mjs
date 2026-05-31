#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = 'data';
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');
const OUTPUT_PATH = path.join(DATA_DIR, 'quality', 'languagetool-scores.json');
const DEFAULT_URL = 'http://localhost:8081';
const MAX_CHUNK_CHARS = 12000;
const SCORER_VERSION = '2026-05-30-language-tool-v5';

const IGNORED_RULE_IDS = new Set([
  'WHITESPACE_RULE',
  'EN_QUOTES',
  // Genealogies and annals naturally repeat official titles at sentence starts
  // ("Duke...", "King...", "In the nth year..."). This rule dominates false
  // positives and pushes review toward ornamental rewrites rather than defects.
  'ENGLISH_WORD_REPEAT_BEGINNING_RULE',
]);
const IGNORED_CATEGORY_IDS = new Set([
  // Historical names and romanized Chinese terms produce too many false positives
  // to be useful for chapter-level cleanup scoring.
  'TYPOS',
]);
const IGNORED_MATCH_TEXT_BY_RULE = {
  // LanguageTool's RUDE_SARCASTIC rule treats "Your Majesty" as sarcasm. In this
  // corpus it is a standard court address, especially in memorials and speeches.
  RUDE_SARCASTIC: new Set(['Your Majesty']),
  // Ji An and Sima An are personal names. LanguageTool sometimes reads "An" as
  // the English article and reports article/agreement errors around correct names.
  AN_AND: new Set(['An']),
  A_INFINITIVE: new Set(['An be']),
  DT_PRP: new Set(['An himself']),
  EN_MULTITOKEN_SPELLING_TWO: new Set(['Sima An']),
  // The fengshan chapter uses shan as the name of a ritual, not as a mangled
  // contraction of "shan't".
  MISSING_APOSTROPHE_T: new Set(['shan']),
  // Su is a common Chinese surname, as in Su Qin. LanguageTool reads it as a
  // US state abbreviation and asks for "Su.", which would be wrong in names.
  MISSING_PERIOD_AFTER_ABBREVIATION: new Set(['Su']),
  // LanguageTool sometimes treats the ordinary verb "march" as the month March.
  LOWERCASE_MONTHS: new Set(['march']),
};

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function usage() {
  console.log(`Usage:
  node scripts/score-languagetool.mjs --all
  node scripts/score-languagetool.mjs --book shiji
  node scripts/score-languagetool.mjs --chapter data/shiji/012.json

Options:
  --url http://localhost:8081   LanguageTool server URL (default: LANGUAGETOOL_URL or ${DEFAULT_URL})
  --limit 20                    Stop after N chapters, useful for testing
  --concurrency 8               Chapters to check in parallel (default: 8)
  --stamp-existing              Add fingerprints to existing cached results without rechecking
  --force                       Re-score chapters already present in the cache`);
}

function normalizeBaseUrl(value) {
  return (value || DEFAULT_URL).replace(/\/+$/, '');
}

function extractTranslation(sentence) {
  const idiomatic = sentence?.translations?.[0]?.idiomatic ?? sentence?.idiomatic ?? '';
  return String(idiomatic || '').trim();
}

function collectEnglishText(chapterData) {
  const parts = [];
  for (const block of chapterData.content || []) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      const sentences = block.sentences || [];
      const text = sentences.map(extractTranslation).filter(Boolean).join(' ');
      if (text) parts.push(text);
    } else if (block.type === 'table_row') {
      const cells = block.cells || [];
      const text = cells.map(extractTranslation).filter(Boolean).join(' | ');
      if (text) parts.push(text);
    }
  }
  return parts;
}

function wordCount(text) {
  return (text.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || []).length;
}

function scorerConfig() {
  return {
    scorerVersion: SCORER_VERSION,
    language: 'en-US',
    level: 'picky',
    maxChunkChars: MAX_CHUNK_CHARS,
    ignoredRules: Array.from(IGNORED_RULE_IDS).sort(),
    ignoredCategories: Array.from(IGNORED_CATEGORY_IDS).sort(),
    ignoredMatchTextByRule: Object.fromEntries(
      Object.entries(IGNORED_MATCH_TEXT_BY_RULE).map(([ruleId, values]) => [ruleId, Array.from(values).sort()])
    ),
  };
}

function sourceFingerprint(parts) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify({
      config: scorerConfig(),
      text: parts,
    }))
    .digest('hex');
}

function prepareTarget(target) {
  const chapterData = JSON.parse(fs.readFileSync(target.path, 'utf8'));
  const parts = collectEnglishText(chapterData);
  const text = parts.join('\n\n');
  const words = wordCount(text);
  const chunks = chunkParts(parts);
  return {
    parts,
    text,
    wordCount: words,
    chunks,
    sourceFingerprint: sourceFingerprint(parts),
  };
}

function chunkParts(parts) {
  const chunks = [];
  let current = '';

  for (const part of parts) {
    if (!part) continue;
    if (part.length > MAX_CHUNK_CHARS) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      for (let i = 0; i < part.length; i += MAX_CHUNK_CHARS) {
        chunks.push(part.slice(i, i + MAX_CHUNK_CHARS));
      }
      continue;
    }

    const next = current ? `${current}\n\n${part}` : part;
    if (next.length > MAX_CHUNK_CHARS && current) {
      chunks.push(current);
      current = part;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function chapterStatus(matchesPer1000Words) {
  if (!Number.isFinite(matchesPer1000Words)) return 'gray';
  if (matchesPer1000Words <= 8) return 'green';
  if (matchesPer1000Words <= 20) return 'yellow';
  return 'red';
}

function loadExistingScores() {
  if (!fs.existsSync(OUTPUT_PATH)) {
    return { generatedAt: null, tool: 'LanguageTool', books: {} };
  }
  return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
}

function writeScores(scores) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(scores, null, 2)}\n`, 'utf8');
}

function updateScoreMetadata(scores, baseUrl) {
  scores.generatedAt = new Date().toISOString();
  scores.tool = 'LanguageTool';
  scores.language = 'en-US';
  scores.url = baseUrl;
  scores.scorerVersion = SCORER_VERSION;
  scores.fingerprintAlgorithm = 'sha256 of extracted English text plus scorer settings';
  scores.thresholds = {
    green: '0-8 matches per 1,000 words',
    yellow: '>8-20 matches per 1,000 words',
    red: '>20 matches per 1,000 words',
    gray: 'not checked or no words',
  };
  scores.ignoredCategories = Array.from(IGNORED_CATEGORY_IDS);
  scores.ignoredRules = Array.from(IGNORED_RULE_IDS);
}

function chapterTargets(manifest, { bookId, chapterPath }) {
  if (chapterPath) {
    const parts = chapterPath.split(path.sep);
    const dataIndex = parts.indexOf(DATA_DIR);
    if (dataIndex === -1 || !parts[dataIndex + 1]) {
      throw new Error(`Cannot infer book id from ${chapterPath}`);
    }
    return [{
      bookId: parts[dataIndex + 1],
      chapter: path.basename(chapterPath, '.json'),
      path: chapterPath,
    }];
  }

  const targets = [];
  for (const [id, book] of Object.entries(manifest.books || {})) {
    if (bookId && id !== bookId) continue;
    for (const chapter of book.chapters || []) {
      targets.push({
        bookId: id,
        chapter: chapter.chapter,
        path: path.join(DATA_DIR, id, `${chapter.chapter}.json`),
      });
    }
  }
  return targets;
}

async function checkChunk(baseUrl, text) {
  const form = new URLSearchParams();
  form.set('language', 'en-US');
  form.set('text', text);
  form.set('level', 'picky');

  const response = await fetch(`${baseUrl}/v2/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LanguageTool returned ${response.status}: ${body.slice(0, 240)}`);
  }

  return response.json();
}

function compactMatch(match) {
  return {
    message: match.message,
    ruleId: match.rule?.id,
    category: match.rule?.category?.id,
    issueType: match.rule?.issueType,
    context: match.context?.text,
    offset: match.context?.offset,
    length: match.context?.length,
    replacements: (match.replacements || []).slice(0, 5).map((replacement) => replacement.value),
  };
}

function matchedContextText(match) {
  const context = match.context?.text;
  const offset = match.context?.offset;
  const length = match.context?.length;
  if (typeof context !== 'string' || !Number.isInteger(offset) || !Number.isInteger(length)) {
    return '';
  }
  return context.slice(offset, offset + length);
}

function isIgnoredMatch(match) {
  const ruleId = match.rule?.id;
  if (IGNORED_RULE_IDS.has(ruleId) || IGNORED_CATEGORY_IDS.has(match.rule?.category?.id)) {
    return true;
  }
  const ignoredText = IGNORED_MATCH_TEXT_BY_RULE[ruleId];
  return ignoredText ? ignoredText.has(matchedContextText(match)) : false;
}

function countByRule(matches) {
  const counts = new Map();
  for (const match of matches) {
    const ruleId = match.ruleId || 'UNKNOWN_RULE';
    counts.set(ruleId, (counts.get(ruleId) || 0) + 1);
  }
  return Object.fromEntries(
    Array.from(counts.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
  );
}

async function scoreChapter(baseUrl, target) {
  const matches = [];
  for (const chunk of target.prepared.chunks) {
    const result = await checkChunk(baseUrl, chunk);
    for (const match of result.matches || []) {
      if (!isIgnoredMatch(match)) {
        matches.push(compactMatch(match));
      }
    }
  }

  const matchesPer1000Words = target.prepared.wordCount > 0 ? (matches.length / target.prepared.wordCount) * 1000 : null;
  return {
    checkedAt: new Date().toISOString(),
    scorerVersion: SCORER_VERSION,
    sourceFingerprint: target.prepared.sourceFingerprint,
    status: chapterStatus(matchesPer1000Words),
    wordCount: target.prepared.wordCount,
    chunkCount: target.prepared.chunks.length,
    matchCount: matches.length,
    matchesPer1000Words,
    ruleCounts: countByRule(matches),
    topMatches: matches.slice(0, 3),
  };
}

async function assertServer(baseUrl) {
  const response = await fetch(`${baseUrl}/v2/languages`);
  if (!response.ok) {
    throw new Error(`LanguageTool server at ${baseUrl} returned ${response.status}`);
  }
}

async function main() {
  if (hasFlag('--help') || hasFlag('-h')) {
    usage();
    return;
  }

  const bookId = getArg('--book');
  const chapterPath = getArg('--chapter');
  const all = hasFlag('--all');
  const limit = Number(getArg('--limit') || 0);
  const concurrency = Math.max(1, Math.min(16, Number(getArg('--concurrency') || process.env.LANGUAGETOOL_CONCURRENCY || 8)));
  const force = hasFlag('--force');
  const stampExisting = hasFlag('--stamp-existing');
  const baseUrl = normalizeBaseUrl(getArg('--url') || process.env.LANGUAGETOOL_URL);

  if (!all && !bookId && !chapterPath) {
    usage();
    process.exit(1);
  }

  const manifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : { books: {} };
  const scores = loadExistingScores();
  scores.books = scores.books || {};

  const targets = chapterTargets(manifest, { bookId, chapterPath }).slice(0, limit || undefined);
  const queue = [];
  let skipped = 0;
  let stamped = 0;
  let stale = 0;
  for (const target of targets) {
    if (!fs.existsSync(target.path)) {
      console.warn(`Missing ${target.path}; skipping`);
      continue;
    }
    scores.books[target.bookId] = scores.books[target.bookId] || { chapters: {} };
    const existing = scores.books[target.bookId].chapters[target.chapter];
    const prepared = prepareTarget(target);
    const isCurrent = existing
      && existing.sourceFingerprint === prepared.sourceFingerprint
      && existing.scorerVersion === SCORER_VERSION;
    if (isCurrent && !force) {
      skipped++;
      continue;
    }
    if (existing && stampExisting && !force && !existing.sourceFingerprint) {
      scores.books[target.bookId].chapters[target.chapter] = {
        ...existing,
        scorerVersion: SCORER_VERSION,
        sourceFingerprint: prepared.sourceFingerprint,
      };
      stamped++;
      continue;
    }
    if (existing && !force) stale++;
    queue.push({ ...target, prepared });
  }

  if (stamped > 0) {
    updateScoreMetadata(scores, baseUrl);
    writeScores(scores);
  }
  if (queue.length > 0) await assertServer(baseUrl);

  let nextIndex = 0;
  let processed = 0;

  async function worker() {
    while (nextIndex < queue.length) {
      const target = queue[nextIndex++];
      const result = await scoreChapter(baseUrl, target);
      scores.books[target.bookId].chapters[target.chapter] = result;
      processed++;
      updateScoreMetadata(scores, baseUrl);
      writeScores(scores);
      console.log(`${target.bookId}/${target.chapter}: ${result.status}, ${result.matchCount} matches, ${result.matchesPer1000Words?.toFixed(1) ?? 'n/a'}/1k words (${processed}/${queue.length})`);
    }
  }

  console.log(`Scoring ${queue.length} chapter${queue.length === 1 ? '' : 's'} with concurrency ${concurrency}; skipped ${skipped}, stamped ${stamped}, stale ${stale}.`);
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));

  const changed = processed > 0 || stamped > 0;
  if (changed) {
    updateScoreMetadata(scores, baseUrl);
    writeScores(scores);
  }
  console.log(`${changed ? `Wrote ${OUTPUT_PATH}` : `No cache changes for ${OUTPUT_PATH}`}; processed ${processed}, skipped ${skipped}, stamped ${stamped}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
