#!/usr/bin/env node
/**
 * Compare local chapter source text against external source pages and export a
 * review queue for probable omissions, extras, and textual discrepancies.
 *
 * This is intentionally a scanner, not a fixer: source-text repairs need a
 * separate approval step because changing Chinese source requires translation
 * realignment.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const DATA_DIR = path.join(process.cwd(), 'data');
const DEFAULT_MIN_SEVERITY = 2;
const DEFAULT_FETCH_TIMEOUT_MS = 15000;
const SENTENCE_ENDINGS = new Set(['。', '！', '？', '；']);
const CJK_RE = /[\p{Script=Han}]/u;
const LATIN_RUN_RE = /[A-Za-z][A-Za-z0-9'’.,:;!?()[\]\- ]*/g;
const COMMON_VARIANTS = new Map([
  ['并', '並'],
  ['竝', '並'],
  ['茍', '苟'],
  ['姧', '奸'],
  ['姦', '奸'],
  ['筭', '算'],
  ['恒', '恆'],
  ['辠', '罪'],
  ['輓', '挽'],
  ['範', '范'],
  ['祕', '秘'],
  ['徴', '徵'],
  ['征', '徵'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['于', '於'],
  ['陜', '陝'],
  ['墻', '牆'],
]);

function usage() {
  console.error(`Usage:
  node scripts/scan-source-correspondence.mjs [--book BOOK --chapter CHAPTER | path ...]
    [--source-url NAME=URL] [--ctext-url URL] [--out PATH] [--json] [--summary]
    [--fail] [--min-severity N] [--limit N] [--fetch-timeout-ms N]
    [--source-name NAME[,NAME...]] [--quiet]

Examples:
  node scripts/scan-source-correspondence.mjs --book songshu --chapter 069 --summary
  node scripts/scan-source-correspondence.mjs data/songshu/069.json \\
    --source-url ctext=https://ctext.org/wiki.pl?if=en\\&chapter=707318 \\
    --out data/quality/source-correspondence-songshu-069.json

The chapter meta.url is used automatically as the chinesenotes source when it is
present, and meta.ctextUrl is used automatically as a ctext source when present.
Additional sources can be supplied with --source-url NAME=URL.`);
}

function parseArgs(argv) {
  const opts = {
    inputs: [],
    book: null,
    chapter: null,
    sourceUrls: [],
    out: null,
    json: false,
    summary: false,
    quiet: false,
    fail: false,
    minSeverity: DEFAULT_MIN_SEVERITY,
    limit: null,
    fetchTimeoutMs: DEFAULT_FETCH_TIMEOUT_MS,
    sourceNames: new Set(),
  };

  const addNames = (value) => {
    if (!value) return;
    for (const name of String(value).split(',').map((part) => part.trim()).filter(Boolean)) {
      opts.sourceNames.add(name);
    }
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--quiet') {
      opts.quiet = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--chapter') {
      opts.chapter = argv[++i];
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapter = arg.slice('--chapter='.length);
      continue;
    }
    if (arg === '--source-url') {
      opts.sourceUrls.push(parseSourceUrl(argv[++i]));
      continue;
    }
    if (arg.startsWith('--source-url=')) {
      opts.sourceUrls.push(parseSourceUrl(arg.slice('--source-url='.length)));
      continue;
    }
    if (arg === '--ctext-url') {
      opts.sourceUrls.push({ name: 'ctext', url: argv[++i] });
      continue;
    }
    if (arg.startsWith('--ctext-url=')) {
      opts.sourceUrls.push({ name: 'ctext', url: arg.slice('--ctext-url='.length) });
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[++i];
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--min-severity') {
      opts.minSeverity = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--min-severity=')) {
      opts.minSeverity = Number(arg.slice('--min-severity='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--fetch-timeout-ms') {
      opts.fetchTimeoutMs = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--fetch-timeout-ms=')) {
      opts.fetchTimeoutMs = Number(arg.slice('--fetch-timeout-ms='.length));
      continue;
    }
    if (arg === '--source-name') {
      addNames(argv[++i]);
      continue;
    }
    if (arg.startsWith('--source-name=')) {
      addNames(arg.slice('--source-name='.length));
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }

  if ((opts.book && !opts.chapter) || (!opts.book && opts.chapter)) {
    console.error('Use --book and --chapter together.');
    process.exit(2);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book/--chapter or explicit paths, not both.');
    process.exit(2);
  }
  if (!Number.isFinite(opts.minSeverity)) {
    console.error('--min-severity must be a number.');
    process.exit(2);
  }
  if (opts.limit !== null && (!Number.isInteger(opts.limit) || opts.limit < 1)) {
    console.error('--limit must be a positive integer.');
    process.exit(2);
  }
  if (!Number.isFinite(opts.fetchTimeoutMs) || opts.fetchTimeoutMs < 1000) {
    console.error('--fetch-timeout-ms must be at least 1000.');
    process.exit(2);
  }
  return opts;
}

function parseSourceUrl(value) {
  if (!value) {
    console.error('Missing value for --source-url.');
    process.exit(2);
  }
  const eq = value.indexOf('=');
  if (eq <= 0) return { name: sourceNameFromUrl(value), url: value };
  return {
    name: value.slice(0, eq).trim() || sourceNameFromUrl(value.slice(eq + 1)),
    url: value.slice(eq + 1).trim(),
  };
}

function sourceNameFromUrl(url) {
  if (/chinesenotes\.com/i.test(url)) return 'chinesenotes';
  if (/ctext\.org/i.test(url)) return 'ctext';
  if (/wikisource\.org/i.test(url)) return 'wikisource';
  return 'source';
}

function chapterFiles(opts) {
  if (opts.book) {
    return [path.join(DATA_DIR, opts.book, `${String(opts.chapter).padStart(3, '0')}.json`)];
  }
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
  };
  for (const input of opts.inputs) enqueue(input);
  const unique = [...new Set(files)].sort();
  return opts.limit ? unique.slice(0, opts.limit) : unique;
}

function chapterRef(file) {
  return {
    book: path.basename(path.dirname(file)),
    chapter: path.basename(file, '.json'),
  };
}

function sourceUrlsForChapter(data, extraSources, opts = {}) {
  const sources = [];
  const metaUrl = data.meta?.url || data.url;
  if (metaUrl) {
    sources.push({ name: sourceNameFromUrl(metaUrl), url: metaUrl });
    const migrated = migratedChineseNotesUrl(metaUrl);
    if (migrated && migrated !== metaUrl) {
      sources.push({ name: 'chinesenotes-migrated', url: migrated });
    }
  }
  if (data.meta?.ctextUrl) {
    sources.push({ name: 'ctext', url: data.meta.ctextUrl });
  }
  for (const source of extraSources) sources.push(source);

  const seen = new Set();
  return sources.filter((source) => {
    if (!source.url) return false;
    if (opts.sourceNames?.size > 0 && !opts.sourceNames.has(source.name)) return false;
    const key = `${source.name}:${source.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function migratedChineseNotesUrl(url) {
  const match = String(url || '').match(/^https:\/\/chinesenotes\.com\/([^/]+)\/([^/.]+)\.html$/i);
  if (!match) return null;
  return `https://chinesenotes.com/library/${match[1]}/${match[2]}`;
}

async function fetchText(url, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; records-source-correspondence/1.0)',
      'Accept': 'text/html, text/plain;q=0.9, */*;q=0.8',
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status} ${response.statusText}`);
  return {
    text: await response.text(),
    finalUrl: response.url,
  };
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function normalizeVariants(text) {
  let out = '';
  for (const char of text) out += COMMON_VARIANTS.get(char) || char;
  return out;
}

function comparisonKey(text) {
  return normalizeVariants(normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC'))
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function strictKey(text) {
  return normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function hasHan(text) {
  return CJK_RE.test(text);
}

function looksLikeChapterHeading(text) {
  const compact = normalizeWhitespace(text);
  if (compact.length > 60) return false;
  return /^(?:卷[一二三四五六七八九十百千零〇]+)?(?:本紀|列傳|志|表|世家|載記|書|紀)[第卷一二三四五六七八九十百千零〇\d]*(?:[上下])?/.test(compact);
}

function cleanupExtractedText(text) {
  return String(text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\r/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/Dictionary cache status:[^\n]*/gi, '')
    .replace(/Click on any word[^\n]*/gi, '')
    .replace(/Source:\s*Chinese Text Project[\s\S]*$/gi, '')
    .replace(/Copyright[\s\S]*$/gi, '');
}

function stripLatinNoise(text) {
  return String(text || '')
    .split(/\n+/)
    .map((line) => {
      if (!hasHan(line)) return '';
      return line.replace(LATIN_RUN_RE, '').trim();
    })
    .filter(Boolean)
    .join('\n');
}

function splitUnits(text) {
  const units = [];
  let buffer = '';
  const push = () => {
    const raw = buffer.trim();
    buffer = '';
    if (!raw || !hasHan(raw)) return;
    const display = raw.replace(/\s+/g, '');
    if (looksLikeChapterHeading(display)) return;
    const key = comparisonKey(display);
    if (!key) return;
    units.push({
      index: units.length,
      text: display,
      key,
      strictKey: strictKey(display),
      charLength: [...key].length,
    });
  };

  for (const char of cleanupExtractedText(text)) {
    if (char === '\n') {
      if (buffer.length > 120) push();
      else buffer += char;
      continue;
    }
    buffer += char;
    if (SENTENCE_ENDINGS.has(char)) push();
  }
  push();
  return units;
}

function extractChineseNotesText(html) {
  const $ = load(html, { decodeEntities: true });
  let $main = $('main.main-content');
  if (!$main.length) $main = $('body');

  $main.find('script, style, footer, nav, aside').remove();
  let fragment = $main.html() || '';
  const headerEnd = fragment.search(/<\/header>/i);
  if (headerEnd >= 0) fragment = fragment.slice(headerEnd + '</header>'.length);
  const footerStart = fragment.search(/<footer\b/i);
  if (footerStart >= 0) fragment = fragment.slice(0, footerStart);
  fragment = fragment.replace(/<br\s*\/?>/gi, '\n');

  const cleaned = load(fragment, { decodeEntities: true }).text();
  return stripLatinNoise(cleanupExtractedText(cleaned));
}

function extractCtextText(html) {
  const $ = load(html, { decodeEntities: true });
  $('#menu, #menubar, script, style, form, .etext, .translationtitle, .inlinecomment').remove();

  const chunks = [];
  $('tr.result td.ctext').each((_, element) => {
    const $cell = $(element);
    const text = $cell.text().trim();
    if (text.length < 8 || !hasHan(text)) return;
    if (/^\d+\s*$/.test(text)) return;
    if (/Chinese Text Project|Jump to dictionary|Show parallel/i.test(text)) return;
    chunks.push(text);
  });

  if (chunks.length === 0) {
    $('#content td.ctext, #content .ctext').each((_, element) => {
      const $node = $(element);
      const text = $node.text().trim();
      if (text.length >= 8 && hasHan(text)) chunks.push(text);
    });
  }

  return stripLatinNoise(cleanupExtractedText(chunks.join('\n')));
}

function extractSourceUnits(sourceName, url, html) {
  const name = sourceNameFromUrl(url) || sourceName;
  const text = name === 'ctext' ? extractCtextText(html) : extractChineseNotesText(html);
  return splitUnits(text);
}

function flattenLocalUnits(data) {
  const units = [];
  const addUnits = (text, location) => {
    if (typeof text !== 'string' || !hasHan(text)) return;
    for (const unit of splitUnits(text)) {
      units.push({
        ...unit,
        index: units.length,
        sentenceId: location.id || '',
        blockIndex: location.blockIndex,
        location,
      });
    }
  };

  (data.content || []).forEach((block, blockIndex) => {
    if ((block.type === 'paragraph' || block.type === 'table_header') && Array.isArray(block.sentences)) {
      block.sentences.forEach((sentence, sentenceIndex) => {
        addUnits(sentence.zh, {
          blockIndex,
          blockType: block.type,
          kind: 'sentence',
          sentenceIndex,
          field: 'zh',
          id: sentence.id || '',
        });
      });
      return;
    }
    if (block.type === 'table_row' && Array.isArray(block.cells)) {
      block.cells.forEach((cell, cellIndex) => {
        addUnits(cell.content, {
          blockIndex,
          blockType: block.type,
          kind: 'cell',
          cellIndex,
          field: 'content',
          id: cell.id || '',
        });
      });
    }
  });
  return units;
}

function lcsPairs(sourceUnits, localUnits) {
  const n = sourceUnits.length;
  const m = localUnits.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = n - 1; i >= 0; i -= 1) {
    const sourceKey = sourceUnits[i].key;
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = sourceKey === localUnits[j].key
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (sourceUnits[i].key === localUnits[j].key) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
}

function levenshteinDistance(a, b) {
  const left = [...a];
  const right = [...b];
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  let prev = new Uint16Array(right.length + 1);
  let curr = new Uint16Array(right.length + 1);
  for (let j = 0; j <= right.length; j += 1) prev[j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[right.length];
}

function similarity(a, b) {
  const left = comparisonKey(a);
  const right = comparisonKey(b);
  const max = Math.max([...left].length, [...right].length);
  if (max === 0) return 1;
  return 1 - (levenshteinDistance(left, right) / max);
}

function unitRange(units, start, end) {
  if (start >= end) return null;
  const locations = [];
  const seenLocations = new Set();
  const ids = [];
  const seenIds = new Set();
  for (const unit of units.slice(start, end)) {
    if (unit.sentenceId && !seenIds.has(unit.sentenceId)) {
      seenIds.add(unit.sentenceId);
      ids.push(unit.sentenceId);
    }
    if (!unit.location) continue;
    const key = [
      unit.location.blockIndex,
      unit.location.blockType,
      unit.location.kind,
      unit.location.sentenceIndex ?? '',
      unit.location.cellIndex ?? '',
      unit.location.id || '',
    ].join(':');
    if (seenLocations.has(key)) continue;
    seenLocations.add(key);
    locations.push(unit.location);
  }
  return {
    startIndex: start,
    endIndex: end - 1,
    count: end - start,
    text: units.slice(start, end).map((unit) => unit.text).join(''),
    ids,
    locations,
  };
}

function rangeLength(range) {
  return range ? [...comparisonKey(range.text)].length : 0;
}

function classifyHunk(sourceRange, localRange) {
  const sourceLen = rangeLength(sourceRange);
  const localLen = rangeLength(localRange);

  if (sourceRange && !localRange) {
    return {
      type: 'source_omission_candidate',
      severity: sourceLen >= 80 || sourceRange.count >= 2 ? 3 : 2,
      recommendation: 'Source text appears in the external witness but not in local JSON. Review and, if approved, restore the Chinese and translate/realign following sentences.',
    };
  }
  if (!sourceRange && localRange) {
    return {
      type: 'local_extra_candidate',
      severity: localLen >= 80 || localRange.count >= 2 ? 3 : 2,
      recommendation: 'Local JSON has source text not found in this external witness. Check for source edition differences before deleting anything.',
    };
  }

  const sim = similarity(sourceRange.text, localRange.text);
  if (sourceLen > localLen + 60 && sourceLen > localLen * 1.8) {
    return {
      type: 'source_omission_candidate',
      severity: 3,
      similarity: Number(sim.toFixed(3)),
      recommendation: 'External source has substantially more text between the surrounding anchors than local JSON. Review as a likely scrape omission; if approved, restore the Chinese and translate/realign the affected span.',
    };
  }
  if (localLen > sourceLen + 60 && localLen > sourceLen * 1.8) {
    return {
      type: 'local_extra_candidate',
      severity: 3,
      similarity: Number(sim.toFixed(3)),
      recommendation: 'Local JSON has substantially more text between the surrounding anchors than this external witness. Check for edition differences before removing anything.',
    };
  }
  if (sim >= 0.74) {
    return {
      type: 'text_discrepancy_candidate',
      severity: sim < 0.9 || Math.abs(sourceLen - localLen) > 20 ? 2 : 1,
      similarity: Number(sim.toFixed(3)),
      recommendation: 'Local and external source text are similar but not identical. Usually this is an edition/variant issue; approve only if the local source should be changed.',
    };
  }

  return {
    type: 'source_replacement_candidate',
    severity: Math.max(sourceLen, localLen) >= 80 ? 3 : 2,
    similarity: Number(sim.toFixed(3)),
    recommendation: 'Local and external text diverge between the same anchors. Inspect as a possible scrape skip, duplicate, or edition mismatch.',
  };
}

function contextAround(units, index, side) {
  if (side === 'before') {
    return index > 0 ? units[index - 1].text : '';
  }
  return index < units.length ? units[index].text : '';
}

function makeItem({ file, book, chapter, source, sourceUnits, localUnits, sourceStart, sourceEnd, localStart, localEnd }) {
  const sourceRange = unitRange(sourceUnits, sourceStart, sourceEnd);
  const localRange = unitRange(localUnits, localStart, localEnd);
  const classified = classifyHunk(sourceRange, localRange);
  const hashInput = [
    book,
    chapter,
    source.name,
    classified.type,
    sourceRange?.text || '',
    localRange?.text || '',
    contextAround(sourceUnits, sourceStart, 'before'),
    contextAround(sourceUnits, sourceEnd, 'after'),
  ].join('\u241f');
  const id = crypto.createHash('sha1').update(hashInput).digest('hex').slice(0, 12);

  return {
    id: `source-${book}-${chapter}-${source.name}-${id}`,
    status: 'pending',
    type: classified.type,
    severity: classified.severity,
    similarity: classified.similarity,
    book,
    chapter,
    file,
    sourceName: source.name,
    sourceUrl: source.url,
    sourceRange,
    localRange,
    context: {
      beforeSource: contextAround(sourceUnits, sourceStart, 'before'),
      afterSource: contextAround(sourceUnits, sourceEnd, 'after'),
      beforeLocal: contextAround(localUnits, localStart, 'before'),
      afterLocal: contextAround(localUnits, localEnd, 'after'),
    },
    recommendation: classified.recommendation,
    decision: null,
    notes: '',
  };
}

function diffUnits({ file, book, chapter, source, sourceUnits, localUnits }) {
  const pairs = lcsPairs(sourceUnits, localUnits);
  const items = [];
  let prevSource = 0;
  let prevLocal = 0;

  const emitGap = (sourceNext, localNext) => {
    if (prevSource === sourceNext && prevLocal === localNext) return;
    items.push(makeItem({
      file,
      book,
      chapter,
      source,
      sourceUnits,
      localUnits,
      sourceStart: prevSource,
      sourceEnd: sourceNext,
      localStart: prevLocal,
      localEnd: localNext,
    }));
  };

  for (const [sourceIndex, localIndex] of pairs) {
    emitGap(sourceIndex, localIndex);
    const sourceUnit = sourceUnits[sourceIndex];
    const localUnit = localUnits[localIndex];
    if (sourceUnit.strictKey !== localUnit.strictKey) {
      items.push(makeItem({
        file,
        book,
        chapter,
        source,
        sourceUnits,
        localUnits,
        sourceStart: sourceIndex,
        sourceEnd: sourceIndex + 1,
        localStart: localIndex,
        localEnd: localIndex + 1,
      }));
    }
    prevSource = sourceIndex + 1;
    prevLocal = localIndex + 1;
  }
  emitGap(sourceUnits.length, localUnits.length);
  return items;
}

function mergeExistingDecisions(report, outPath) {
  if (!outPath || !fs.existsSync(outPath)) return report;
  let previous;
  try {
    previous = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  } catch {
    return report;
  }
  const priorItems = new Map((previous.items || []).map((item) => [item.id, item]));
  for (const item of report.items) {
    const prior = priorItems.get(item.id);
    if (!prior) continue;
    item.status = prior.status || item.status;
    item.decision = prior.decision ?? item.decision;
    item.notes = prior.notes || item.notes;
    item.reviewedAt = prior.reviewedAt;
    item.reviewer = prior.reviewer;
  }
  return report;
}

function summarize(items) {
  const byType = {};
  const bySeverity = {};
  const bySource = {};
  for (const item of items) {
    byType[item.type] = (byType[item.type] || 0) + 1;
    bySeverity[item.severity] = (bySeverity[item.severity] || 0) + 1;
    bySource[item.sourceName] = (bySource[item.sourceName] || 0) + 1;
  }
  return {
    total: items.length,
    byType,
    bySeverity,
    bySource,
  };
}

async function scanFile(file, opts) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { book, chapter } = chapterRef(file);
  const localUnits = flattenLocalUnits(data);
  const sources = sourceUrlsForChapter(data, opts.sourceUrls, opts);
  const sourceReports = [];
  const items = [];

  for (const source of sources) {
    let fetched;
    try {
      fetched = await fetchText(source.url, opts.fetchTimeoutMs);
    } catch (error) {
      sourceReports.push({
        name: source.name,
        url: source.url,
        sourceUnits: 0,
        localUnits: localUnits.length,
        itemCount: 0,
        error: error.message,
      });
      continue;
    }
    if (source.url.includes('chinesenotes.com') && new URL(fetched.finalUrl).pathname === '/') {
      sourceReports.push({
        name: source.name,
        url: source.url,
        finalUrl: fetched.finalUrl,
        sourceUnits: 0,
        localUnits: localUnits.length,
        itemCount: 0,
        error: 'redirected to Chinese Notes homepage instead of a chapter page',
      });
      continue;
    }
    const html = fetched.text;
    const sourceUnits = extractSourceUnits(source.name, source.url, html);
    if (sourceUnits.length === 0) {
      sourceReports.push({
        name: source.name,
        url: source.url,
        finalUrl: fetched.finalUrl,
        sourceUnits: 0,
        localUnits: localUnits.length,
        itemCount: 0,
        error: 'no Chinese source units extracted',
      });
      continue;
    }
    const sourceItems = diffUnits({
      file,
      book,
      chapter,
      source,
      sourceUnits,
      localUnits,
    }).filter((item) => item.severity >= opts.minSeverity);

    sourceReports.push({
      name: source.name,
      url: source.url,
      sourceUnits: sourceUnits.length,
      localUnits: localUnits.length,
      itemCount: sourceItems.length,
    });
    items.push(...sourceItems);
  }

  return {
    file,
    book,
    chapter,
    localUnits: localUnits.length,
    sources: sourceReports,
    items,
  };
}

function printSummary(report) {
  console.log(`Source correspondence candidates: ${report.summary.total}`);
  for (const chapter of report.chapters) {
    console.log(`${chapter.book}/${chapter.chapter}: localUnits=${chapter.localUnits}`);
    for (const source of chapter.sources) {
      const suffix = source.error ? ` error=${source.error}` : '';
      console.log(`  ${source.name}: sourceUnits=${source.sourceUnits} items=${source.itemCount}${suffix}`);
    }
  }
  for (const item of report.items.slice(0, 40)) {
    const sourcePreview = (item.sourceRange?.text || '').slice(0, 90);
    const localPreview = (item.localRange?.text || '').slice(0, 90);
    console.log(`\n${item.id} severity=${item.severity} ${item.type} ${item.sourceName}`);
    if (sourcePreview) console.log(`  source: ${sourcePreview}`);
    if (localPreview) console.log(`  local:  ${localPreview}`);
    if (item.context.beforeSource) console.log(`  before: ${item.context.beforeSource.slice(0, 80)}`);
    if (item.context.afterSource) console.log(`  after:  ${item.context.afterSource.slice(0, 80)}`);
  }
  if (report.items.length > 40) console.log(`\n... ${report.items.length - 40} more item(s). Use --json or --out for full details.`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  if (files.length === 0) {
    console.error('No chapter files found.');
    process.exit(2);
  }

  const chapters = [];
  const allItems = [];
  for (const file of files) {
    const chapterReport = await scanFile(file, opts);
    chapters.push({
      file: chapterReport.file,
      book: chapterReport.book,
      chapter: chapterReport.chapter,
      localUnits: chapterReport.localUnits,
      sources: chapterReport.sources,
    });
    allItems.push(...chapterReport.items);
  }

  const report = mergeExistingDecisions({
    generatedAt: new Date().toISOString(),
    scanner: 'scan-source-correspondence',
    minSeverity: opts.minSeverity,
    chapters,
    summary: summarize(allItems),
    items: allItems,
  }, opts.out);

  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (opts.quiet) {
    if (opts.out) console.log(`Wrote ${opts.out}`);
  } else if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printSummary(report);
    if (opts.out) console.log(`\nWrote ${opts.out}`);
  }

  if (opts.fail && report.items.some((item) => item.severity >= opts.minSeverity && item.status !== 'denied')) {
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
