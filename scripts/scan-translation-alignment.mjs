#!/usr/bin/env node
/**
 * Scan for likely Chinese/English sentence misalignment and low glossary
 * coverage using bilingual anchors.
 *
 * This does not try to prove semantic fidelity. Distinctive manual terms are
 * treated as high-confidence anchors. The full glossary, including proper nouns,
 * is used as fuzzy aggregate evidence when several terms point to the same
 * neighboring sentence. It is also used to score same-sentence glossary coverage
 * so review passes can surface translations that are not obvious offsets but
 * still fail to carry enough distinctive source terms into English.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const GLOSSARY_PATH = path.join(DATA_DIR, 'glossary.json');

const CHECK_FIELDS = new Set([
  'idiomatic',
  'translation',
  'en',
  'english',
]);
const SUPPORT_FIELDS = new Set([
  ...CHECK_FIELDS,
  'literal',
]);

const MANUAL_ANCHORS = [
  ['Taiyi', ['太一', '泰一', '泰畤'], /\bTai ?yi\b/i],
  ['Shangdi', ['上帝'], /\b(?:Shangdi|Shang Di|Supreme (?:God|Deity))\b/i],
  ['Houtu', ['后土', '後土'], /\bHou ?tu\b/i],
  ['Lingxing', ['靈星', '灵星'], /\bLingxing\b/i],
  ['Penglai', ['蓬萊', '蓬莱'], /\bPenglai\b/i],
  ['Fangzhang', ['方丈'], /\bFangzhang\b/i],
  ['Yingzhou', ['瀛洲'], /\bYingzhou\b/i],
  ['Jianzhang Palace', ['建章宮', '建章宫'], /\bJian ?zhang\b/i],
  ['Ganquan', ['甘泉'], /\bGanquan\b/i],
  ['Mount Tai', ['泰山', '太山', '岱'], /\b(?:Mount Tai|Tai Shan|Taishan|Dai ?zong)\b/i],
  ['Daizong', ['岱宗'], /\bDai ?zong\b/i],
  ['Langya', ['瑯邪', '琅邪', '琅琊'], /\bLang(?:ya|ye)\b/i],
  ['Linzi', ['臨菑', '臨淄', '临淄'], /\bLinzi\b/i],
  ["Chang'an", ['長安', '长安'], /\bChang[’']?an\b/i],
  ['Jieshi', ['碣石'], /\bJieshi\b/i],
  ['Liaoxi', ['遼西', '辽西'], /\bLiaoxi\b/i],
  ['Jiuyuan', ['九原'], /\bJiuyuan\b/i],
  ['Pengcheng', ['彭城'], /\bPengcheng\b/i],
  ['Jiang-Huai', ['江淮'], /\b(?:Jiang-?Huai|Yangzi and Huai)\b/i],
  ['Yellow River', ['黃河', '黄河'], /\bYellow River\b/],
  // Common topical ethnonyms/titles are too often supplied from context in English;
  // let the glossary aggregate catch them only when several terms shift together.
  ['Linhu', ['林胡'], /\bLinhu\b/i],
  ['Jizi', ['箕子'], /\bJizi\b/i],
  ['Bigan', ['比干'], /\bBigan\b/i],
  ['Wei Zi', ['微子'], /\bWei Zi\b/i],
  ['Wu Geng', ['武庚'], /\bWu Geng\b/i],
  ['Guan Shu', ['管叔'], /\bGuan Shu\b/i],
  ['Cai Shu', ['蔡叔'], /\bCai Shu\b/i],
  ['Xinyuan Ping', ['新垣平'], /\bXinyuan Ping\b/i],
  ['Gongsun Qing', ['公孫卿', '公孙卿'], /\bGongsun Qing\b/i],
  ['Gongsun Chen', ['公孫臣', '公孙臣'], /\bGongsun Chen\b/i],
  ['Shaojun', ['少君'], /\bShaojun\b/i],
  ['Shaoweng', ['少翁'], /\bShao ?weng\b/i],
  ['General of the Five Benefits', ['五利'], /\b(?:Five Benefits|Wuli)\b/i],
  ['Guiyu Qu', ['鬼臾區', '鬼臾区'], /\bGuiyu Qu\b/i],
  ['Jade Hall', ['玉堂'], /\bJade Hall\b/i],
  ['Bi Gate', ['璧門', '璧门'], /\b(?:Bi|Jade) Gate\b/i],
  ['Great Bird', ['大鳥', '大鸟'], /\bGreat Bird\b/i],
  ['immortals', ['僊', '仙', '神仙'], /\bimmortals?\b/i],
  ['fangshi', ['方士'], /\bfangshi\b/i],
  ['tripods', ['鼎'], /\b(?:dings?|tripods?|Nine Tripods)\b/],
  ['white deer', ['白鹿'], /\bwhite deer\b/i],
  ['white gold', ['白金'], /\bwhite gold\b/i],
  ['jade cup', ['玉杯'], /\bjade cup\b/i],
];

const COMMON_SOURCE_MIN_LENGTH = 2;
const VALID_GLOSSARY_SCOPES = new Set(['all', 'proper', 'manual']);
const PROPER_GLOSSARY_MIN_NEARBY_SCORE = 2.35;
const MIXED_GLOSSARY_MIN_NEARBY_SCORE = 2.7;
const COMMON_ONLY_GLOSSARY_MIN_NEARBY_SCORE = 4.2;
const SAME_SENTENCE_MIN_SOURCE_SCORE = 4.2;
const SAME_SENTENCE_REVIEW_MIN_SOURCE_SCORE = 1.5;
const SAME_SENTENCE_MAX_COVERAGE = 0.12;
const SAME_SENTENCE_REVIEW_MAX_COVERAGE = 0.4;
const MAX_VARIANT_LENGTH = 40;

function stripDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function definitionVariants(definition) {
  return String(definition || '')
    .split(/[;,/]/)
    .map((value) => value.replace(/\([^)]*\)/g, '').replace(/^(?:the|a|an)\s+/i, '').trim())
    .filter((value) => (
      value.length >= 3
      && value.length <= MAX_VARIANT_LENGTH
      && /[A-Za-z]/.test(value)
      && !/^(?:of|and|or|to|in|on|at|by|for|from|with|as|is|are|was|were)\b/i.test(value)
    ));
}

function pinyinVariants(pinyin) {
  const normalized = stripDiacritics(String(pinyin || ''))
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized || normalized.length < 3) return [];
  const compact = normalized.replace(/\s+/g, '');
  if (compact.length < 5) return [];
  const spaced = normalized
    .split(' ')
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : '')
    .join(' ');
  const compactTitle = compact[0].toUpperCase() + compact.slice(1);
  return [...new Set([compact, compactTitle, spaced].filter(Boolean))];
}

function expandedEnglishVariants(variants) {
  const expanded = [];
  for (const variant of variants) {
    const plainApostrophe = variant.replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainApostrophe !== variant) expanded.push(plainApostrophe);
    const noApostrophe = variant.replace(/[’']/g, '');
    if (noApostrophe !== variant) expanded.push(noApostrophe);

    const mt = variant.match(/^Mt\.?\s+(.+)$/);
    if (mt) {
      expanded.push(`Mount ${mt[1]}`);
      expanded.push(`Mount ${mt[1].replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim()}`);
    }

    const trailingDynasty = variant.match(/^((?:King|Queen|Emperor|Prince|Duke|Marquis|Lord) [A-Z][A-Za-z'’.-]+) of [A-Z][A-Za-z'’.-]+$/);
    if (trailingDynasty) expanded.push(trailingDynasty[1]);

    const compactTitle = variant.match(/^(Duke|Marquis|Lord|Prince) ([A-Z][A-Za-z'’.-]+)$/);
    if (compactTitle) expanded.push(`${compactTitle[1]} of ${compactTitle[2]}`);

    const compactKing = variant.match(/^King ([A-Z][A-Za-z'’.-]+)$/);
    if (compactKing) expanded.push(`${compactKing[1]} Wang`);

    const wangTitle = variant.match(/^([A-Z][A-Za-z'’.-]+) Wang$/);
    if (wangTitle) expanded.push(`King ${wangTitle[1]}`);

    const heavenlyEmperor = variant.match(/^(.+?) Heavenly Emperor$/);
    if (heavenlyEmperor) expanded.push(`${heavenlyEmperor[1]} Emperor`);

    const dukeOf = variant.match(/^Duke of ([A-Z][A-Za-z'’.-]+)$/);
    if (dukeOf) {
      expanded.push(`${dukeOf[1]} Gong`);
      expanded.push(`Lord ${dukeOf[1]}`);
    }
  }
  return [...new Set([...variants, ...expanded])];
}

function variantRegex(variants) {
  const parts = expandedEnglishVariants([...new Set(variants)])
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((variant) => escapeRegex(variant).replace(/\\ /g, '[\\\\s-]+'));
  if (parts.length === 0) return null;
  return new RegExp(`\\b(?:${parts.join('|')})\\b`, 'i');
}

function capitalizedDefinitionVariants(definitions) {
  return definitions
    .flatMap(definitionVariants)
    .filter((variant) => /(?:^|[\s-])[A-Z][a-z]/.test(variant));
}

function loadGlossaryAnchors({ properOnly = false, commonOnly = false, mode = 'pinyin' } = {}) {
  if (!fs.existsSync(GLOSSARY_PATH)) return [];
  const glossary = Object.values(JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf8')));
  const anchors = [];
  const seen = new Set();
  for (const entry of glossary) {
    const text = String(entry.text || '');
    const isProperNoun = Boolean(entry.isProperNoun);
    if (properOnly && !isProperNoun) continue;
    if (commonOnly && isProperNoun) continue;
    if (text.length < (isProperNoun ? 2 : COMMON_SOURCE_MIN_LENGTH)) continue;
    if (/^[一二三四五六七八九十]+月$/.test(text)) continue;
    const definitions = Array.isArray(entry.definitions) ? entry.definitions : [];
    let variants = [];
    if (mode === 'pinyin') {
      variants = [
        ...pinyinVariants(entry.pinyin),
        ...capitalizedDefinitionVariants(definitions),
      ].filter(Boolean);
    } else if (mode === 'definitions') {
      variants = definitions.flatMap(definitionVariants);
    }
    const englishRe = variantRegex(variants);
    if (!englishRe) continue;
    const key = `${text}:${englishRe.source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    anchors.push({
      label: text,
      sourceForms: [text],
      englishRe,
      glossary: true,
      proper: isProperNoun,
      common: !isProperNoun,
    });
  }
  return anchors;
}

let HARD_ANCHORS = [];
let COMMON_ANCHORS = [];
let COMMON_SOURCE_INDEX = new Map();
let ANCHOR_STATS = {};

function configureAnchors({ glossaryScope = 'all' } = {}) {
  const manualAnchors = MANUAL_ANCHORS
    .map(([label, sourceForms, englishRe]) => ({ label, sourceForms, englishRe, manual: true }));
  const glossaryAnchors = [];
  if (glossaryScope !== 'manual') {
    glossaryAnchors.push(...loadGlossaryAnchors({ properOnly: true, mode: 'pinyin' }));
  }
  if (glossaryScope === 'all') {
    glossaryAnchors.push(...loadGlossaryAnchors({ commonOnly: true, mode: 'definitions' }));
  }
  HARD_ANCHORS = manualAnchors;
  COMMON_ANCHORS = glossaryAnchors;
  COMMON_SOURCE_INDEX = sourceIndex(COMMON_ANCHORS);
  ANCHOR_STATS = {
    glossaryScope,
    manualAnchors: HARD_ANCHORS.length,
    glossaryAnchors: COMMON_ANCHORS.length,
    properGlossaryAnchors: COMMON_ANCHORS.filter((anchor) => anchor.proper).length,
    commonGlossaryAnchors: COMMON_ANCHORS.filter((anchor) => anchor.common).length,
  };
}

function sourceIndex(anchors) {
  const index = new Map();
  for (const anchor of anchors) {
    for (const form of anchor.sourceForms) {
      const first = form[0];
      if (!first) continue;
      const bucket = index.get(first) || [];
      bucket.push({ form, anchor });
      index.set(first, bucket);
    }
  }
  for (const bucket of index.values()) {
    bucket.sort((a, b) => b.form.length - a.form.length);
  }
  return index;
}

function usage() {
  console.error(`Usage:
  node scripts/scan-translation-alignment.mjs [--book BOOK] [--json] [--summary] [--fail] [--min-severity N] [--min-glossary-risk N] [--review-priorities] [--offset-clusters] [--glossary-scope all|proper|manual] [--include-sentence-scores] [--no-same-sentence-glossary] [path ...]

Flags likely sentence-misalignment candidates using distinctive manual anchors plus fuzzy aggregate matches from the full glossary.
Also scores same-sentence glossary coverage and flags suspiciously low coverage when the Chinese sentence has enough distinctive anchors.
Proper nouns carry more weight; common terms are used only when several terms corroborate one another.
Use --offset-clusters for a hard publication gate: it reports adjacent nearby-anchor
warnings as probable sentence shifts, and also keeps high-confidence
FABRICATED_OR_SUBSTITUTED_TRANSLATION hits where dense source anchors vanish
from suspiciously thin English. It ignores isolated glossary noise.

Glossary scopes:
  all      Use proper nouns and common multi-character terms as fuzzy evidence (default)
  proper   Use only proper nouns as fuzzy evidence
  manual   Use only the curated hard anchors`);
}

function parseArgs(argv) {
  const opts = {
    inputs: [],
    book: null,
    json: false,
    summary: false,
    fail: false,
    minSeverity: 3,
    minGlossaryRisk: null,
    reviewPriorities: false,
    offsetClusters: false,
    glossaryScope: 'all',
    sameSentenceGlossary: true,
    includeSentenceScores: false,
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
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--review-priorities') {
      opts.reviewPriorities = true;
      continue;
    }
    if (arg === '--offset-clusters') {
      opts.offsetClusters = true;
      continue;
    }
    if (arg === '--no-same-sentence-glossary') {
      opts.sameSentenceGlossary = false;
      continue;
    }
    if (arg === '--include-sentence-scores') {
      opts.includeSentenceScores = true;
      continue;
    }
    if (arg === '--glossary-scope') {
      opts.glossaryScope = argv[++i];
      if (!VALID_GLOSSARY_SCOPES.has(opts.glossaryScope)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--glossary-scope=')) {
      opts.glossaryScope = arg.slice('--glossary-scope='.length);
      if (!VALID_GLOSSARY_SCOPES.has(opts.glossaryScope)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--min-severity') {
      opts.minSeverity = Number(argv[++i]);
      if (!Number.isFinite(opts.minSeverity)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--min-glossary-risk') {
      opts.minGlossaryRisk = Number(argv[++i]);
      if (!Number.isFinite(opts.minGlossaryRisk)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--min-glossary-risk=')) {
      opts.minGlossaryRisk = Number(arg.slice('--min-glossary-risk='.length));
      if (!Number.isFinite(opts.minGlossaryRisk)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--min-severity=')) {
      opts.minSeverity = Number(arg.slice('--min-severity='.length));
      if (!Number.isFinite(opts.minSeverity)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (entry.endsWith('.json')) files.push(entry);
  };
  if (inputs.length === 0) enqueue(DATA_DIR);
  else inputs.forEach(enqueue);
  return files.sort();
}

function sentenceRecords(chapter) {
  const records = [];
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    for (const [sentenceIndex, sentence] of (block.sentences || []).entries()) {
      const translation = (sentence.translations || [])[0] || {};
      const englishParts = [];
      const supportEnglishParts = [];
      for (const [key, value] of Object.entries(translation)) {
        if (CHECK_FIELDS.has(key) && typeof value === 'string') englishParts.push(value);
        if (SUPPORT_FIELDS.has(key) && typeof value === 'string') supportEnglishParts.push(value);
      }
      records.push({
        id: sentence.id || '',
        blockIndex,
        sentenceIndex,
        zh: sentence.zh || '',
        english: englishParts.join(' '),
        supportEnglish: supportEnglishParts.join(' '),
      });
    }
  }
  return records;
}

function hasSource(record, anchor) {
  return anchor.sourceForms.some((form) => record.zh.includes(form));
}

function hasEnglish(record, anchor) {
  anchor.englishRe.lastIndex = 0;
  if (anchor.englishRe.test(record.english)) return true;
  anchor.englishRe.lastIndex = 0;
  return anchor.englishRe.test(stripDiacritics(record.english));
}

function normalizedEnglishMatch(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchedEnglishTexts(record, anchor) {
  anchor.englishRe.lastIndex = 0;
  const match = record.english.match(anchor.englishRe);
  if (match) return [normalizedEnglishMatch(match[0])];
  anchor.englishRe.lastIndex = 0;
  const strippedMatch = stripDiacritics(record.english).match(anchor.englishRe);
  return strippedMatch ? [normalizedEnglishMatch(strippedMatch[0])] : [];
}

function nearbyHasSource(records, index, anchor) {
  return [-2, -1, 1, 2].some((offset) => {
    const record = records[index + offset];
    return record && hasSource(record, anchor);
  });
}

function nearbyHasEnglish(records, index, anchor) {
  return [-2, -1, 1, 2].some((offset) => {
    const record = records[index + offset];
    return record && hasEnglish(record, anchor);
  });
}

function nearbySourceOffsets(records, index, anchor) {
  return [-2, -1, 1, 2].filter((offset) => {
    const record = records[index + offset];
    return record && hasSource(record, anchor);
  });
}

function nearbyEnglishOffsets(records, index, anchor) {
  return [-2, -1, 1, 2].filter((offset) => {
    const record = records[index + offset];
    return record && hasEnglish(record, anchor);
  });
}

function nearbyRecords(records, index) {
  return [-2, -1, 0, 1, 2]
    .map((offset) => ({ offset, record: records[index + offset] }))
    .filter((entry) => entry.record);
}

function sourceMatchedAnchorsForRecord(record, index) {
  const matches = [];
  const seen = new Set();
  for (let i = 0; i < record.zh.length; i += 1) {
    const bucket = index.get(record.zh[i]);
    if (!bucket) continue;
    for (const { form, anchor } of bucket) {
      if (!record.zh.startsWith(form, i)) continue;
      if (seen.has(anchor.label)) continue;
      seen.add(anchor.label);
      matches.push(anchor);
    }
  }
  return matches;
}

function sourceMatchedCommonAnchorsForRecord(record) {
  return sourceMatchedAnchorsForRecord(record, COMMON_SOURCE_INDEX);
}

function sourceMatchedCommonAnchors(records, index) {
  const window = nearbyRecords(records, index);
  const matches = [];
  for (const { offset, record } of window) {
    for (const anchor of sourceMatchedCommonAnchorsForRecord(record)) {
      matches.push({ anchor, offset });
    }
  }
  return matches;
}

function anchorWeight(anchor) {
  if (anchor.proper) return 1;
  // Common glossary terms are useful as corroboration, but are too noisy to
  // prove misalignment on their own.
  return 0.35;
}

function uniqueGlossaryAnchors(anchors) {
  return [...new Map(anchors.map((anchor) => [anchor.label, anchor])).values()]
    .filter((anchor, _index, unique) => !unique.some((other) => (
      other !== anchor
      && other.label.length > anchor.label.length
      && other.label.includes(anchor.label)
    )));
}

function glossaryGroupScore(labels, { reviewPriorities = false } = {}) {
  const unique = uniqueGlossaryAnchors(labels);
  const properCount = unique.filter((anchor) => anchor.proper).length;
  const commonCount = unique.filter((anchor) => anchor.common).length;
  const score = unique.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  let threshold = properCount >= 2
    ? PROPER_GLOSSARY_MIN_NEARBY_SCORE
    : properCount >= 1
      ? MIXED_GLOSSARY_MIN_NEARBY_SCORE
      : COMMON_ONLY_GLOSSARY_MIN_NEARBY_SCORE;
  if (reviewPriorities) {
    threshold = properCount >= 2
      ? 1.75
      : properCount >= 1
        ? 2
        : 3.5;
  }
  return {
    anchors: unique,
    properCount,
    commonCount,
    score,
    threshold,
    reportable: score >= threshold,
  };
}

function scoreSentenceGlossaryCoverage(record) {
  const sourceAnchors = uniqueGlossaryAnchors(sourceMatchedCommonAnchorsForRecord(record));
  if (sourceAnchors.length === 0) return null;

  const properCount = sourceAnchors.filter((anchor) => anchor.proper).length;
  const commonCount = sourceAnchors.filter((anchor) => anchor.common).length;
  const sourceScore = sourceAnchors.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  const matchedAnchors = sourceAnchors.filter((anchor) => hasEnglish(record, anchor));
  const matchedProperCount = matchedAnchors.filter((anchor) => anchor.proper).length;
  const matchedCommonCount = matchedAnchors.filter((anchor) => anchor.common).length;
  const matchedScore = matchedAnchors.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  const coverage = sourceScore > 0 ? matchedScore / sourceScore : 1;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors: sourceAnchors.filter((anchor) => !matchedAnchors.includes(anchor)),
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  };
}

function sameSentenceGlossaryCoverage(record, { reviewPriorities = false } = {}) {
  const score = scoreSentenceGlossaryCoverage(record);
  if (!score) return null;

  const {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  } = score;
  const minSourceScore = reviewPriorities
    ? SAME_SENTENCE_REVIEW_MIN_SOURCE_SCORE
    : SAME_SENTENCE_MIN_SOURCE_SCORE;
  if (sourceScore < minSourceScore) return null;

  const maxCoverage = reviewPriorities
    ? SAME_SENTENCE_REVIEW_MAX_COVERAGE
    : SAME_SENTENCE_MAX_COVERAGE;

  // Do not let a pile of generic common terms create a priority unless there is
  // enough cumulative evidence to make the fuzzy check meaningful. Review mode
  // is intentionally broader: a single proper noun with weak coverage can be
  // useful triage, but common-only sentences still need several anchors.
  if (properCount === 0 && commonCount < (reviewPriorities ? 5 : 10)) return null;
  if (!reviewPriorities && properCount === 1 && commonCount < 4 && sourceScore < 3) return null;
  if (reviewPriorities && properCount === 1 && commonCount === 0 && coverage > 0) return null;

  if (coverage > maxCoverage) return null;
  if (isCompactTableOrFormulaRecord(record, score)) return null;

  const glossaryRiskScore = sourceScore * (1 - coverage)
    * (properCount > 0 && matchedProperCount === 0 ? 1.35 : 1);

  const highSignal = (
    (coverage === 0 && sourceScore >= 3.5)
    || (coverage <= SAME_SENTENCE_MAX_COVERAGE && (sourceScore >= 5 || properCount >= 3))
    || (properCount >= 2 && matchedProperCount === 0 && coverage <= SAME_SENTENCE_MAX_COVERAGE)
  );
  const severity = highSignal ? 3 : 2;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
    glossaryRiskScore,
    severity,
  };
}

function fabricatedOrSubstitutedTranslation(record) {
  const score = scoreSentenceGlossaryCoverage(record);
  if (!score) return null;
  if (isCompactTableOrFormulaRecord(record, score)) return null;

  const {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  } = score;

  // This is stricter than LOW_GLOSSARY_SAME_SENTENCE_COVERAGE. It targets the
  // incident class where the English is fluent but is effectively about a
  // different source sentence: enough distinctive source anchors are present,
  // yet almost none survive in English.
  const hasEnoughDistinctiveSource = (
    (properCount >= 2 && sourceScore >= 8)
    || (properCount >= 1 && commonCount >= 10 && sourceScore >= 8)
    || (properCount === 0 && commonCount >= 24 && sourceScore >= 9)
  );
  if (!hasEnoughDistinctiveSource) return null;
  if (matchedProperCount > 0) return null;
  if (matchedScore > 0.35 || coverage > 0.05) return null;

  const supportEnglish = record.supportEnglish || record.english || '';
  const englishWords = String(record.english || '').match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (englishWords.length < 8) return null;
  const sourceLength = String(record.zh || '').replace(/\s+/g, '').length;
  const englishLength = String(supportEnglish || '').replace(/\s+/g, ' ').trim().length;
  if (sourceLength > 0 && englishLength / sourceLength > 4.25) return null;
  if (englishSpecificityScore(supportEnglish) >= 4) return null;
  if (englishFormulaOrListScore(supportEnglish) >= 4) return null;

  const glossaryRiskScore = sourceScore * (1 - coverage)
    * (properCount >= 2 ? 1.6 : 1.25);
  if (glossaryRiskScore < 10) return null;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
    glossaryRiskScore,
    severity: 3,
  };
}

function englishSpecificityScore(english) {
  const stop = new Set([
    'A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'From', 'He', 'His',
    'If', 'In', 'It', 'On', 'Or', 'She', 'The', 'They', 'This', 'To', 'When',
    'While', 'With',
  ]);
  const genericTitles = new Set([
    'Administrator', 'Attendant', 'Cavalier', 'Chancellor', 'Commander',
    'Director', 'Emperor', 'General', 'Governor', 'Inspector', 'King',
    'Marquis', 'Minister', 'Palace', 'Prince', 'Secretary',
  ]);
  const tokens = String(english || '').match(/\b[A-Z][A-Za-z'’-]{2,}\b/g) || [];
  return tokens.filter((token) => !stop.has(token) && !genericTitles.has(token)).length;
}

function englishFormulaOrListScore(english) {
  const text = String(english || '');
  const numeric = (text.match(/\b\d+(?:[.,]\d+)*\b|[°¼½¾]/g) || []).length;
  const separators = (text.match(/[;:]/g) || []).length;
  const commas = (text.match(/,/g) || []).length;
  return numeric + separators + Math.floor(commas / 3);
}

function isCompactTableOrFormulaRecord(record, score) {
  const zh = String(record.zh || '');
  const english = String(record.english || '');
  if (!zh || !english) return false;

  const compactEnglish = english.replace(/\s+/g, '');
  const compactSource = zh.replace(/\s+/g, '');
  const numericSourceChars = (compactSource.match(/[一二三四五六七八九十百千萬万\d年月日度分刻丈尺寸步里斗牛女虛虚危室壁奎婁娄胃昴畢毕觜參参井鬼柳星張张翼軫轸角亢氐房心尾箕甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g) || []).length;
  const numericEnglishChars = (compactEnglish.match(/[\d°′'½¼~+\\/—;:.,-]/g) || []).length;
  const hasFormulaEnglish = /(?:\d|°|′|½|¼|\b(?:d|p)\b|\.{3}|…|\+|\/)/i.test(english);
  const hasFormulaSource = numericSourceChars >= 10 && numericSourceChars / Math.max(compactSource.length, 1) >= 0.28;
  const mostlyCommonAnchors = score.properCount <= 1 && score.commonCount >= 6;

  if (hasFormulaSource && hasFormulaEnglish && mostlyCommonAnchors) return true;
  if (/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{6,}/.test(zh) && /[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/.test(english)) return true;
  if (hasFormulaSource && numericEnglishChars >= 8 && compactEnglish.length <= 180 && mostlyCommonAnchors) return true;

  return false;
}

function excerpt(text, width = 110) {
  return text.replace(/\s+/g, ' ').trim().slice(0, width);
}

function scanFile(file, { reviewPriorities = false, sameSentenceGlossary = true, includeSentenceScores = false } = {}) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const records = sentenceRecords(chapter);
  const hits = [];
  const sentenceScores = [];

  for (const [index, record] of records.entries()) {
    if (!record.english || !record.zh) continue;
    if (includeSentenceScores) {
      const score = scoreSentenceGlossaryCoverage(record);
      if (score) {
        sentenceScores.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          glossarySourceScore: Number(score.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(score.matchedScore.toFixed(2)),
          glossaryCoverage: Number(score.coverage.toFixed(2)),
          properAnchors: score.properCount,
          commonAnchors: score.commonCount,
          matchedProperAnchors: score.matchedProperCount,
          matchedCommonAnchors: score.matchedCommonCount,
          sourceAnchor: score.sourceAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          matchedAnchor: score.matchedAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          missingAnchor: score.missingAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }
    for (const anchor of HARD_ANCHORS) {
      const source = hasSource(record, anchor);
      const english = hasEnglish(record, anchor);
      if (english && !source) {
        const nearbySource = nearbyHasSource(records, index, anchor);
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: nearbySource ? 'ENGLISH_ANCHOR_NEARBY_SOURCE' : 'ENGLISH_ANCHOR_ABSENT_SOURCE',
          severity: nearbySource ? 3 : 2,
          anchor: anchor.label,
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      } else if (source && !english && (anchor.manual || nearbyHasEnglish(records, index, anchor))) {
        const nearbyEnglish = nearbyHasEnglish(records, index, anchor);
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: nearbyEnglish ? 'SOURCE_ANCHOR_NEARBY_ENGLISH' : 'SOURCE_ANCHOR_MISSING_ENGLISH',
          severity: nearbyEnglish ? 3 : 1,
          anchor: anchor.label,
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }

    const englishNearbySource = new Map();
    const sourceNearbyEnglish = new Map();
    const currentMatchedEnglishTexts = new Set(
      sourceMatchedCommonAnchorsForRecord(record).flatMap((anchor) => matchedEnglishTexts(record, anchor)),
    );
    for (const { anchor, offset } of sourceMatchedCommonAnchors(records, index)) {
      const source = hasSource(record, anchor);
      const english = hasEnglish(record, anchor);
      if (english && !source) {
        const sameRenderedEntity = matchedEnglishTexts(record, anchor)
          .some((match) => currentMatchedEnglishTexts.has(match));
        if (sameRenderedEntity) continue;
        const group = englishNearbySource.get(offset) || [];
        group.push(anchor);
        englishNearbySource.set(offset, group);
      }
      if (source && !english) {
        for (const englishOffset of nearbyEnglishOffsets(records, index, anchor)) {
          const group = sourceNearbyEnglish.get(englishOffset) || [];
          group.push(anchor);
          sourceNearbyEnglish.set(englishOffset, group);
        }
      }
    }

    for (const [offset, labels] of englishNearbySource.entries()) {
      const group = glossaryGroupScore(labels, { reviewPriorities });
      if (!group.reportable) continue;
      hits.push({
        file,
        id: record.id,
        block: record.blockIndex + 1,
        sentence: record.sentenceIndex + 1,
        rule: 'COMMON_GLOSSARY_NEARBY_SOURCE',
        severity: 3,
        offset,
        anchor: group.anchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
        glossaryScore: Number(group.score.toFixed(2)),
        glossaryThreshold: Number(group.threshold.toFixed(2)),
        properAnchors: group.properCount,
        commonAnchors: group.commonCount,
        zh: excerpt(record.zh),
        english: excerpt(record.english),
      });
    }

    for (const [offset, labels] of sourceNearbyEnglish.entries()) {
      const group = glossaryGroupScore(labels, { reviewPriorities });
      if (!group.reportable) continue;
      hits.push({
        file,
        id: record.id,
        block: record.blockIndex + 1,
        sentence: record.sentenceIndex + 1,
        rule: 'COMMON_GLOSSARY_NEARBY_ENGLISH',
        severity: 3,
        offset,
        anchor: group.anchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
        glossaryScore: Number(group.score.toFixed(2)),
        glossaryThreshold: Number(group.threshold.toFixed(2)),
        properAnchors: group.properCount,
        commonAnchors: group.commonCount,
        zh: excerpt(record.zh),
        english: excerpt(record.english),
      });
    }

    if (sameSentenceGlossary) {
      const fabricated = fabricatedOrSubstitutedTranslation(record);
      if (fabricated) {
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: 'FABRICATED_OR_SUBSTITUTED_TRANSLATION',
          severity: fabricated.severity,
          anchor: fabricated.missingAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          glossarySourceScore: Number(fabricated.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(fabricated.matchedScore.toFixed(2)),
          glossaryCoverage: Number(fabricated.coverage.toFixed(2)),
          glossaryRiskScore: Number(fabricated.glossaryRiskScore.toFixed(2)),
          properAnchors: fabricated.properCount,
          commonAnchors: fabricated.commonCount,
          matchedProperAnchors: fabricated.matchedProperCount,
          matchedCommonAnchors: fabricated.matchedCommonCount,
          matchedAnchor: fabricated.matchedAnchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }

      const coverage = sameSentenceGlossaryCoverage(record, { reviewPriorities });
      if (coverage) {
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: 'LOW_GLOSSARY_SAME_SENTENCE_COVERAGE',
          severity: coverage.severity,
          anchor: coverage.missingAnchors.slice(0, 10).map((anchor) => anchor.label).join(', '),
          glossarySourceScore: Number(coverage.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(coverage.matchedScore.toFixed(2)),
          glossaryCoverage: Number(coverage.coverage.toFixed(2)),
          glossaryRiskScore: Number(coverage.glossaryRiskScore.toFixed(2)),
          properAnchors: coverage.properCount,
          commonAnchors: coverage.commonCount,
          matchedProperAnchors: coverage.matchedProperCount,
          matchedCommonAnchors: coverage.matchedCommonCount,
          matchedAnchor: coverage.matchedAnchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }
  }

  return { hits, sentenceScores };
}

function bookFromFile(file) {
  const parts = file.split(path.sep);
  const dataIndex = parts.lastIndexOf('data');
  return dataIndex >= 0 ? parts[dataIndex + 1] || '' : '';
}

function printSummary(hits) {
  const byBook = new Map();
  const byChapter = new Map();
  const byRule = new Map();
  for (const hit of hits) {
    const book = bookFromFile(hit.file);
    const bookStats = byBook.get(book) || { chapters: new Set(), hits: 0 };
    bookStats.chapters.add(hit.file);
    bookStats.hits += 1;
    byBook.set(book, bookStats);

    const chapterStats = byChapter.get(hit.file) || { hits: 0, maxSeverity: 0 };
    chapterStats.hits += 1;
    chapterStats.maxSeverity = Math.max(chapterStats.maxSeverity, hit.severity);
    byChapter.set(hit.file, chapterStats);

    const ruleStats = byRule.get(hit.rule) || { hits: 0, severity: hit.severity };
    ruleStats.hits += 1;
    ruleStats.severity = Math.max(ruleStats.severity, hit.severity);
    byRule.set(hit.rule, ruleStats);
  }
  console.log(`Translation alignment candidates: ${hits.length} hit(s) in ${new Set(hits.map((hit) => hit.file)).size} chapter(s)`);
  console.log(`Anchors: ${ANCHOR_STATS.manualAnchors} manual, ${ANCHOR_STATS.glossaryAnchors} glossary (${ANCHOR_STATS.glossaryScope}; ${ANCHOR_STATS.properGlossaryAnchors} proper, ${ANCHOR_STATS.commonGlossaryAnchors} common)`);
  console.log('\nbook\tchapters\thits');
  for (const [book, stats] of [...byBook.entries()].sort()) {
    console.log(`${book}\t${stats.chapters.size}\t${stats.hits}`);
  }
  console.log('\nrule\tseverity\thits');
  for (const [rule, stats] of [...byRule.entries()].sort()) {
    console.log(`${rule}\t${stats.severity}\t${stats.hits}`);
  }
  console.log('\ntop chapters');
  console.log('hits\tseverity\tfile');
  for (const [file, stats] of [...byChapter.entries()].sort((a, b) => b[1].hits - a[1].hits).slice(0, 20)) {
    console.log(`${stats.hits}\t${stats.maxSeverity}\t${file}`);
  }
}

function sentenceNumber(id) {
  const match = String(id || '').match(/^s(\d+)$/);
  return match ? Number(match[1]) : null;
}

function nearbyAnchorClusters(hits, { minUniqueSentences = 4, maxSpan = 4 } = {}) {
  const nearby = hits
    .filter((hit) => /NEARBY/.test(hit.rule))
    .filter((hit) => sentenceNumber(hit.id) !== null);
  const byFile = new Map();
  for (const hit of nearby) {
    const list = byFile.get(hit.file) || [];
    list.push(hit);
    byFile.set(hit.file, list);
  }

  const clusters = [];
  const seen = new Set();
  for (const [file, fileHits] of byFile) {
    fileHits.sort((a, b) => sentenceNumber(a.id) - sentenceNumber(b.id));
    const sentenceStarts = [...new Set(fileHits.map((hit) => sentenceNumber(hit.id)))];
    for (const start of sentenceStarts) {
      const inWindow = fileHits.filter((hit) => {
        const n = sentenceNumber(hit.id);
        return n >= start && n <= start + maxSpan;
      });
      const uniqueIds = [...new Set(inWindow.map((hit) => hit.id))].sort();
      if (uniqueIds.length < minUniqueSentences) continue;
      const key = `${file}:${uniqueIds.join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const anchors = [...new Set(inWindow.map((hit) => hit.anchor).filter(Boolean))];
      clusters.push({
        file,
        id: `${uniqueIds[0]}-${uniqueIds[uniqueIds.length - 1]}`,
        block: inWindow[0].block,
        sentence: inWindow[0].sentence,
        rule: 'NEARBY_ANCHOR_CLUSTER',
        severity: Math.max(...inWindow.map((hit) => hit.severity || 0), 3),
        anchor: anchors.slice(0, 8).join('; '),
        glossaryScore: Number(Math.max(...inWindow.map((hit) => Number(hit.glossaryScore || 0))).toFixed(2)),
        zh: `Probable offset cluster across ${uniqueIds.length} nearby sentence(s).`,
        english: inWindow
          .slice(0, 4)
          .map((hit) => `${hit.id} ${hit.rule}: ${hit.english}`)
          .join(' | '),
        clusteredHits: inWindow.map((hit) => ({
          id: hit.id,
          rule: hit.rule,
          anchor: hit.anchor,
          zh: hit.zh,
          english: hit.english,
        })),
      });
    }
  }
  return clusters;
}

const opts = parseArgs(process.argv.slice(2));
configureAnchors(opts);
const inputs = opts.book ? [path.join(DATA_DIR, opts.book)] : opts.inputs;
const files = chapterFiles(inputs);
const scanner = (file) => scanFile(file, {
  reviewPriorities: opts.reviewPriorities,
  sameSentenceGlossary: opts.sameSentenceGlossary,
  includeSentenceScores: opts.includeSentenceScores,
});
const scanReports = files.map(scanner);
let hits = scanReports.flatMap((report) => report.hits)
  .filter((hit) => hit.severity >= opts.minSeverity)
  .filter((hit) => (
    opts.minGlossaryRisk === null
    || hit.rule !== 'LOW_GLOSSARY_SAME_SENTENCE_COVERAGE'
    || Number(hit.glossaryRiskScore || 0) >= opts.minGlossaryRisk
  ));
if (opts.offsetClusters) {
  const fabricatedHits = hits.filter((hit) => hit.rule === 'FABRICATED_OR_SUBSTITUTED_TRANSLATION');
  hits = [...nearbyAnchorClusters(hits), ...fabricatedHits];
}
const sentenceScores = opts.includeSentenceScores
  ? scanReports.flatMap((report) => report.sentenceScores)
  : [];

if (opts.json) {
  console.log(JSON.stringify({
    count: hits.length,
    anchorStats: ANCHOR_STATS,
    hits,
    ...(opts.includeSentenceScores ? { sentenceScores } : {}),
  }, null, 2));
} else if (opts.summary) {
  printSummary(hits);
} else {
  printSummary(hits);
  for (const hit of hits) {
    console.log(`${hit.file}: ${hit.id || `block ${hit.block} sentence ${hit.sentence}`} ${hit.rule} ${hit.anchor}: ${hit.english}`);
  }
}

if (opts.fail && hits.length > 0) process.exit(1);
