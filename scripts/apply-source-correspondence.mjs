#!/usr/bin/env node
/**
 * Apply approved source-correspondence queue items.
 *
 * This script intentionally has a human gate: it applies only queue items whose
 * status or decision is "approved", or items explicitly approved with
 * --approve. It then renumbers sentence IDs and preserves existing translations
 * by matching Chinese source text.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/;
const CJK_RE = /[\p{Script=Han}]/u;
const CLOSE_QUOTE_RE = /^[」』”）)\]】〉》]+/u;
const END_CLOSE_QUOTE_RE = /[」』”）)\]】〉》]+$/u;
const LEADING_ATTACHING_PUNCT_RE = /^[，、。；：！？」』”）)\]】〉》]+/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;
const DEFAULT_REVIEWER = 'source-correspondence';
const DEFAULT_TRANSLATOR = process.env.TRANSLATOR || 'Garrett M. Petersen (2026)';
const DEFAULT_MODEL = process.env.MODEL || 'Manual source repair';
const PRESERVE_TRANSLATION_TYPES = new Set([
  'text_discrepancy_candidate',
  'source_replacement_candidate',
]);

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
  ['衞', '衛'],
]);

function usage() {
  console.error(`Usage:
  node scripts/apply-source-correspondence.mjs --queue PATH [--dry-run]
    [--approve ID[,ID...]] [--deny ID[,ID...]] [--item ID[,ID...]]
    [--reviewer NAME]

Queue workflow:
  1. Run scan-source-correspondence to create data/quality/source-correspondence-*.json.
  2. Add manualTranslations to any approved item that inserts or changes Chinese:
     [{ "zh": "...", "literal": "...", "idiomatic": "...", "model": "..." }]
  3. Mark queue items status/decision "approved" or pass --approve ID.
  4. Run this script to apply approved source edits, renumber sentence IDs, and
     preserve existing translations by matching Chinese source text.`);
}

function parseArgs(argv) {
  const opts = {
    queues: [],
    dryRun: false,
    approve: new Set(),
    deny: new Set(),
    onlyItems: new Set(),
    reviewer: DEFAULT_REVIEWER,
  };

  const addIds = (target, value) => {
    if (!value) return;
    for (const id of value.split(',').map((part) => part.trim()).filter(Boolean)) {
      target.add(id);
    }
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--approve') {
      addIds(opts.approve, argv[++i]);
      continue;
    }
    if (arg.startsWith('--approve=')) {
      addIds(opts.approve, arg.slice('--approve='.length));
      continue;
    }
    if (arg === '--deny') {
      addIds(opts.deny, argv[++i]);
      continue;
    }
    if (arg.startsWith('--deny=')) {
      addIds(opts.deny, arg.slice('--deny='.length));
      continue;
    }
    if (arg === '--item') {
      addIds(opts.onlyItems, argv[++i]);
      continue;
    }
    if (arg.startsWith('--item=')) {
      addIds(opts.onlyItems, arg.slice('--item='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.queues.push(arg);
  }

  if (opts.queues.length === 0) {
    console.error('Missing --queue PATH.');
    usage();
    process.exit(2);
  }
  for (const id of opts.approve) {
    if (opts.deny.has(id)) {
      console.error(`Item cannot be both approved and denied: ${id}`);
      process.exit(2);
    }
  }
  return opts;
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
  return CJK_RE.test(String(text || ''));
}

function splitSentences(text) {
  const sentences = [];
  const parts = String(text || '').split(SENTENCE_ENDINGS);

  let current = '';
  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 1) {
      const punctuation = parts[i];
      const isOpeningPunc = /[〈(（]/.test(punctuation);

      if (isOpeningPunc) {
        if (current.trim()) sentences.push(current.trim());
        current = punctuation;
      } else {
        current += punctuation;
        if (current.trim()) {
          sentences.push(current.trim());
          current = '';
        }
      }
    } else {
      current += parts[i];
    }
  }

  if (current.trim()) sentences.push(current.trim());

  const merged = [];
  let pendingPrefix = '';
  const openingOnly = /^[〈《「『【〔（(\s]+$/;
  const leadingClose = /^([〉》」』】〕）)\]\s]+)(.+)$/u;

  for (let sentence of sentences) {
    const leadingCloseMatch = sentence.match(leadingClose);
    if (leadingCloseMatch && merged.length > 0) {
      merged[merged.length - 1] += leadingCloseMatch[1].trimEnd();
      sentence = leadingCloseMatch[2].trim();
      if (!sentence) continue;
    }

    if (openingOnly.test(sentence)) {
      pendingPrefix += sentence;
      continue;
    }

    if (PUNCTUATION_ONLY_RE.test(sentence)) {
      if (merged.length > 0) merged[merged.length - 1] += sentence;
      else pendingPrefix += sentence;
      continue;
    }

    if (pendingPrefix) {
      merged.push(pendingPrefix + sentence);
      pendingPrefix = '';
    } else {
      merged.push(sentence);
    }
  }

  if (pendingPrefix) {
    if (merged.length > 0) merged[merged.length - 1] += pendingPrefix;
    else merged.push(pendingPrefix);
  }

  return merged.filter((sentence) => hasHan(sentence));
}

function emptyTranslation() {
  return {
    lang: 'en',
    literal: '',
    idiomatic: '',
    translator: '',
  };
}

function normalizeManualTranslations(item) {
  const raw = item.manualTranslations || item.manualTranslation || [];
  const rows = [];

  if (Array.isArray(raw)) {
    rows.push(...raw);
  } else if (raw && typeof raw === 'object') {
    for (const [key, value] of Object.entries(raw)) {
      if (value && typeof value === 'object') rows.push({ zh: key, ...value });
      else if (typeof value === 'string') rows.push({ zh: key, literal: value, idiomatic: value });
    }
  }

  return rows
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      zh: String(row.zh || row.source || row.text || '').trim(),
      literal: String(row.literal || '').trim(),
      idiomatic: String(row.idiomatic || row.translation || '').trim(),
      footnote: typeof row.footnote === 'string' ? row.footnote.trim() : undefined,
      translator: String(row.translator || DEFAULT_TRANSLATOR).trim(),
      model: String(row.model || DEFAULT_MODEL).trim(),
      allowChineseCharacters: row.allowChineseCharacters === true,
    }))
    .filter((row) => row.zh && row.literal && row.idiomatic);
}

function manualTranslationsBySource(item) {
  const map = new Map();
  for (const row of normalizeManualTranslations(item)) {
    const key = strictKey(row.zh);
    if (!key) continue;
    map.set(key, row);
  }
  return map;
}

function fallbackSingleManualTranslation(item, untranslatedEntries) {
  if (untranslatedEntries.length !== 1) return null;
  const rows = normalizeManualTranslations(item);
  return rows.length === 1 ? rows[0] : null;
}

function applyManualTranslation(unit, manual) {
  const translation = {
    lang: 'en',
    literal: manual.literal,
    idiomatic: manual.idiomatic,
    translator: manual.translator,
    model: manual.model,
  };
  if (manual.footnote) translation.footnote = manual.footnote;
  if (manual.allowChineseCharacters) translation.allowChineseCharacters = true;

  unit.translations = [translation];
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (Object.hasOwn(unit, key)) unit[key] = translation[key] || '';
  }
  unit.translator = manual.translator;
  unit.model = manual.model;
  if (manual.allowChineseCharacters) unit.allowChineseCharacters = true;
}

function applyManualTranslations(entries, item) {
  const translations = manualTranslationsBySource(item);
  if (translations.size === 0) return 0;

  let applied = 0;
  const untranslated = untranslatedCountableEntries(entries);
  const fallbackManual = fallbackSingleManualTranslation(item, untranslated);
  for (const entry of entries) {
    const manual = translations.get(strictKey(sourceText(entry))) || fallbackManual;
    if (!manual) continue;
    applyManualTranslation(entry.unit, manual);
    applied += 1;
  }
  return applied;
}

function untranslatedCountableEntries(entries) {
  return entries
    .filter((entry) => isCountableSource(sourceText(entry)))
    .filter((entry) => !hasMeaningfulTranslations(entry.unit));
}

function assertAppliedEntriesTranslated(item, entries, translationsBySource = new Map()) {
  const manualBySource = manualTranslationsBySource(item);
  const initiallyUntranslated = untranslatedCountableEntries(entries);
  const fallbackManual = fallbackSingleManualTranslation(item, initiallyUntranslated);
  const untranslated = initiallyUntranslated
    .filter((entry) => {
      const key = strictKey(sourceText(entry));
      if (translationsBySource.has(key)) return false;

      const manual = manualBySource.get(key) || fallbackManual;
      if (manual) {
        applyManualTranslation(entry.unit, manual);
        return false;
      }

      return true;
    });
  if (untranslated.length === 0) return [];

  const examples = untranslated.slice(0, 8).map((entry) => sourceText(entry).slice(0, 100));
  throw new Error(
    [
      `${item.id}: approved source-correspondence edit would create or change ${untranslated.length} countable source unit(s) without manual English translation.`,
      'Add manualTranslations to this queue item before applying.',
      ...examples.map((example) => `  ${example}`),
    ].join('\n'),
  );
}

function hasMeaningfulTranslations(unit) {
  if (!unit || typeof unit !== 'object') return false;
  if (typeof unit.translation === 'string' && unit.translation.trim()) return true;
  if (typeof unit.literal === 'string' && unit.literal.trim()) return true;
  if (typeof unit.idiomatic === 'string' && unit.idiomatic.trim()) return true;
  return Array.isArray(unit.translations) && unit.translations.some((translation) =>
    Object.entries(translation || {}).some(([key, value]) => (
      key !== 'lang'
      && typeof value === 'string'
      && value.trim()
    ))
  );
}

function clearTranslations(unit) {
  unit.translations = [emptyTranslation()];
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (Object.hasOwn(unit, key)) unit[key] = '';
  }
  if (Object.hasOwn(unit, 'reviewed')) unit.reviewed = false;
}

function translationSnapshot(unit) {
  if (!hasMeaningfulTranslations(unit)) return null;
  const snapshot = {};
  for (const key of ['translations', 'literal', 'idiomatic', 'translation', 'translator', 'model', 'reviewed']) {
    if (Object.hasOwn(unit, key)) snapshot[key] = clone(unit[key]);
  }
  return snapshot;
}

function applyTranslationSnapshot(unit, snapshot) {
  if (!snapshot) return;
  for (const key of ['translations', 'literal', 'idiomatic', 'translation', 'translator', 'model', 'reviewed']) {
    if (Object.hasOwn(snapshot, key)) unit[key] = clone(snapshot[key]);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sourceText(entry) {
  return entry.field === 'content'
    ? String(entry.unit.content || '')
    : String(entry.unit.zh || '');
}

function setSourceText(entry, text) {
  if (entry.field === 'content') entry.unit.content = text;
  else entry.unit.zh = text;
}

function isTableEntry(entry) {
  return entry.blockType === 'table_row' || entry.blockType === 'table_header';
}

function cloneEntryWithSource(entry, text, { preserveTranslations = false } = {}) {
  const next = {
    ...entry,
    unit: clone(entry.unit),
  };
  setSourceText(next, text);
  if (!preserveTranslations) clearTranslations(next.unit);
  return next;
}

function shouldPreserveExistingTranslation(item, entry, nextText) {
  if (item.preserveExistingTranslations !== true) return false;
  if (!PRESERVE_TRANSLATION_TYPES.has(item.type || '')) return false;
  if (!entry || !hasMeaningfulTranslations(entry.unit)) return false;
  if (!isCountableSource(sourceText(entry)) || !isCountableSource(nextText)) return false;
  return true;
}

function newEntry(text, templateEntry, fallbackBlockKey = 0) {
  const blockType = templateEntry?.blockType || 'paragraph';
  const field = blockType === 'table_row' ? 'content' : 'zh';
  const unit = field === 'content'
    ? { id: '', content: text, translations: [emptyTranslation()] }
    : { id: '', zh: text, translations: [emptyTranslation()] };
  return {
    blockKey: templateEntry?.blockKey ?? fallbackBlockKey,
    originalBlockIndex: null,
    blockType,
    kind: field === 'content' ? 'cell' : 'sentence',
    field,
    unit,
  };
}

function flattenEntries(chapter) {
  const entries = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    if ((block.type === 'paragraph' || block.type === 'table_header') && Array.isArray(block.sentences)) {
      for (let sentenceIndex = 0; sentenceIndex < block.sentences.length; sentenceIndex += 1) {
        entries.push({
          blockKey: blockIndex,
          originalBlockIndex: blockIndex,
          blockType: block.type,
          kind: 'sentence',
          field: 'zh',
          indexInBlock: sentenceIndex,
          unit: block.sentences[sentenceIndex],
        });
      }
      continue;
    }
    if (block.type === 'table_row' && Array.isArray(block.cells)) {
      for (let cellIndex = 0; cellIndex < block.cells.length; cellIndex += 1) {
        entries.push({
          blockKey: blockIndex,
          originalBlockIndex: blockIndex,
          blockType: block.type,
          kind: 'cell',
          field: 'content',
          indexInBlock: cellIndex,
          unit: block.cells[cellIndex],
        });
      }
      continue;
    }
    if (block.type !== 'paragraph' && block.type !== 'table_header' && block.type !== 'table_row') {
      throw new Error(`Unsupported block type at content[${blockIndex}]: ${block.type || 'unknown'}`);
    }
  }
  return entries;
}

function indexTranslationsBySource(entries) {
  const map = new Map();
  for (const entry of entries) {
    const key = strictKey(sourceText(entry));
    if (!key) continue;
    const snapshot = translationSnapshot(entry.unit);
    if (!snapshot) continue;
    if (!map.has(key)) map.set(key, snapshot);
  }
  return map;
}

function transferTranslations(entries, translationsBySource) {
  let transferred = 0;
  for (const entry of entries) {
    const snapshot = translationsBySource.get(strictKey(sourceText(entry)));
    if (!snapshot) continue;
    applyTranslationSnapshot(entry.unit, snapshot);
    transferred += 1;
  }
  return transferred;
}

function appendLeadingPunctuation(previousSentence, punctuation) {
  const chars = [...punctuation];
  let overlap = 0;
  for (let length = chars.length; length > 0; length -= 1) {
    const prefix = chars.slice(0, length).join('');
    if (previousSentence.zh.endsWith(prefix)) {
      overlap = length;
      break;
    }
  }
  previousSentence.zh += chars.slice(overlap).join('');
}

function repairPunctuationPlacement(entries) {
  const repaired = [];
  for (const entry of entries) {
    let zh = sourceText(entry).trim();
    const preserveEmptyEntry = isTableEntry(entry);

    while (LEADING_ATTACHING_PUNCT_RE.test(zh) && repaired.length > 0) {
      const mark = zh.match(LEADING_ATTACHING_PUNCT_RE)[0];
      appendLeadingPunctuation({
        get zh() {
          return sourceText(repaired[repaired.length - 1]);
        },
        set zh(value) {
          setSourceText(repaired[repaired.length - 1], value);
        },
      }, mark);
      zh = zh.slice(mark.length).trimStart();
    }

    if (!zh) {
      if (preserveEmptyEntry) {
        const next = {
          ...entry,
          unit: clone(entry.unit),
        };
        setSourceText(next, '');
        repaired.push(next);
      }
      continue;
    }

    if (!preserveEmptyEntry && PUNCTUATION_ONLY_RE.test(zh)) {
      if (repaired.length > 0) setSourceText(
        repaired[repaired.length - 1],
        sourceText(repaired[repaired.length - 1]) + zh,
      );
      continue;
    }

    const next = {
      ...entry,
      unit: clone(entry.unit),
    };
    setSourceText(next, zh);
    repaired.push(next);
  }
  return repaired;
}

function rebuildContent(entries, originalContent) {
  const blocks = [];
  let current = null;
  for (const entry of entries) {
    if (!current || current.blockKey !== entry.blockKey) {
      const originalBlock = Number.isInteger(entry.blockKey) ? originalContent[entry.blockKey] : null;
      const blockType = originalBlock?.type || entry.blockType || (entry.kind === 'cell' ? 'table_row' : 'paragraph');
      const block = { type: blockType };
      if (blockType === 'table_row') {
        block.cells = [];
      } else {
        block.sentences = [];
        if (originalBlock?.translations) {
          block.translations = clone(originalBlock.translations);
        }
      }
      current = {
        blockKey: entry.blockKey,
        block,
      };
      blocks.push(current);
    }
    if (current.block.type === 'table_row') current.block.cells.push(entry.unit);
    else current.block.sentences.push(entry.unit);
  }
  return blocks.map((entry) => entry.block);
}

function renumber(entries) {
  for (let i = 0; i < entries.length; i += 1) {
    entries[i].unit.id = `s${String(i + 1).padStart(4, '0')}`;
  }
}

function isCountableSource(text) {
  const value = String(text || '').trim();
  return value !== '' && !PUNCTUATION_ONLY_RE.test(value);
}

function countTranslated(entries) {
  return entries.filter((entry) => (
    isCountableSource(sourceText(entry))
    && hasMeaningfulTranslations(entry.unit)
  )).length;
}

function countSourceEntries(entries) {
  return entries.filter((entry) => isCountableSource(sourceText(entry))).length;
}

function updateMeta(chapter, entries) {
  if (!chapter.meta || typeof chapter.meta !== 'object') return;
  chapter.meta.sentenceCount = countSourceEntries(entries);
  chapter.meta.translatedCount = countTranslated(entries);

  const translatorMap = new Map();
  entries.forEach((entry) => {
    if (!isCountableSource(sourceText(entry)) || !hasMeaningfulTranslations(entry.unit)) return;
    const names = new Set();
    if (typeof entry.unit.translator === 'string' && entry.unit.translator.trim()) {
      names.add(entry.unit.translator.trim());
    }
    for (const translation of entry.unit.translations || []) {
      if (typeof translation.translator === 'string' && translation.translator.trim()) {
        names.add(translation.translator.trim());
      }
    }
    for (const name of names) {
      const record = translatorMap.get(name) || { name, paragraphs: new Set(), sentences: 0 };
      record.paragraphs.add(entry.blockKey);
      record.sentences += 1;
      translatorMap.set(name, record);
    }
  });
  if (translatorMap.size > 0) {
    chapter.meta.translators = [...translatorMap.values()]
      .map((record) => ({
        name: record.name,
        paragraphs: record.paragraphs.size,
        sentences: record.sentences,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
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

function rangeContains(ids, entry) {
  return ids.has(entry.unit.id);
}

function findRangeByIds(entries, ids) {
  if (ids.size === 0) return null;
  const indices = [];
  entries.forEach((entry, index) => {
    if (rangeContains(ids, entry)) indices.push(index);
  });
  if (indices.length !== ids.size) return null;
  const start = Math.min(...indices);
  const end = Math.max(...indices) + 1;
  for (let i = start; i < end; i += 1) {
    if (!ids.has(entries[i].unit.id)) return null;
  }
  return { start, end };
}

function findEntryByText(entries, text, start = 0, { allowContains = true } = {}) {
  const key = comparisonKey(text);
  if (!key) return -1;
  let contained = -1;
  for (let i = Math.max(0, start); i < entries.length; i += 1) {
    const entryKey = comparisonKey(sourceText(entries[i]));
    if (entryKey === key) return i;
    if (allowContains && contained < 0 && entryKey.includes(key)) contained = i;
  }
  return contained;
}

function findInsertionIndex(entries, item) {
  const beforeIndex = findEntryByText(entries, item.context?.beforeLocal || '');
  if (beforeIndex >= 0) return beforeIndex + 1;

  const afterIndex = findEntryByText(entries, item.context?.afterLocal || '');
  if (afterIndex >= 0) return afterIndex;

  throw new Error(`Could not locate insertion context for ${item.id}`);
}

function findTargetRange(entries, item) {
  const ids = new Set(item.localRange?.ids || []);
  const byIds = findRangeByIds(entries, ids);
  if (byIds) {
    const matchedText = entries.slice(byIds.start, byIds.end).map(sourceText).join('');
    if (!item.localRange?.text || comparisonKey(matchedText) === comparisonKey(item.localRange.text)) {
      return byIds;
    }
  }

  if (item.localRange?.text) {
    const key = comparisonKey(item.localRange.text);
    for (let start = 0; start < entries.length; start += 1) {
      let combined = '';
      for (let end = start; end < Math.min(entries.length, start + 25); end += 1) {
        combined += sourceText(entries[end]);
        if (comparisonKey(combined) === key) return { start, end: end + 1 };
      }
    }
  }

  if (!item.localRange) {
    const index = findInsertionIndex(entries, item);
    return { start: index, end: index };
  }

  throw new Error(`Could not locate local range for ${item.id}`);
}

function pairedSourceUnits(sourceSentences, localEntries) {
  const pairs = new Map();
  let cursor = 0;
  for (let localIndex = 0; localIndex < localEntries.length; localIndex += 1) {
    let best = -1;
    let bestScore = 0;
    for (let sourceIndex = cursor; sourceIndex < sourceSentences.length; sourceIndex += 1) {
      const score = similarity(sourceSentences[sourceIndex], sourceText(localEntries[localIndex]));
      if (score > bestScore) {
        best = sourceIndex;
        bestScore = score;
      }
      if (comparisonKey(sourceSentences[sourceIndex]) === comparisonKey(sourceText(localEntries[localIndex]))) break;
    }
    if (best >= 0 && bestScore >= 0.72) {
      pairs.set(best, localIndex);
      cursor = best + 1;
    }
  }
  return pairs;
}

function adjustedSourceText(item) {
  let text = item.sourceRange?.text || '';
  const before = item.context?.beforeLocal || '';
  const after = item.context?.afterLocal || '';
  const afterSource = item.context?.afterSource || '';

  if (before && END_CLOSE_QUOTE_RE.test(before) && CLOSE_QUOTE_RE.test(text)) {
    text = text.replace(CLOSE_QUOTE_RE, '');
  }

  const trailingClose = afterSource.match(CLOSE_QUOTE_RE)?.[0] || '';
  if (trailingClose && !CLOSE_QUOTE_RE.test(after) && !END_CLOSE_QUOTE_RE.test(text)) {
    text += trailingClose;
  }

  return text;
}

function blockKeyBetween(entries, start, end) {
  const before = entries[start - 1] || null;
  const after = entries[end] || null;
  if (before && after && before.blockKey !== after.blockKey) return before.blockKey + 0.5;
  if (before) return before.blockKey;
  if (after) return after.blockKey;
  return 0;
}

function templateForInsertion(entries, range) {
  return entries[range.start - 1] || entries[range.end] || null;
}

function allTableEntries(localEntries, templateEntry = null) {
  if (localEntries.length > 0) return localEntries.every((entry) => isTableEntry(entry));
  return templateEntry ? isTableEntry(templateEntry) : false;
}

function replaceWithinSingleEntry(entries, range, item) {
  if (range.end !== range.start + 1 || !item.localRange?.text || item.type === 'local_extra_candidate') {
    return null;
  }

  const entry = entries[range.start];
  if (!isTableEntry(entry)) return null;

  const original = sourceText(entry);
  const localText = item.localRange.text;
  const sourceReplacement = adjustedSourceText(item);
  const exactIndex = original.indexOf(localText);
  if (exactIndex < 0) return null;

  const nextText = `${original.slice(0, exactIndex)}${sourceReplacement}${original.slice(exactIndex + localText.length)}`;
  const next = cloneEntryWithSource(
    entry,
    nextText,
    { preserveTranslations: shouldPreserveExistingTranslation(item, entry, nextText) },
  );
  return [next];
}

function insertWithinSingleEntry(entries, item, translationsBySource) {
  if (item.localRange || !item.sourceRange?.text) return null;

  const before = item.context?.beforeLocal || '';
  const after = item.context?.afterLocal || '';
  if (!before || !after) return null;

  const beforeIndex = findEntryByText(entries, before);
  const afterIndex = findEntryByText(entries, after);
  if (beforeIndex < 0 || beforeIndex !== afterIndex || !isTableEntry(entries[beforeIndex])) return null;

  const entry = entries[beforeIndex];
  const original = sourceText(entry);
  const beforeOffset = original.indexOf(before);
  if (beforeOffset < 0) return null;
  const insertAt = beforeOffset + before.length;
  const afterOffset = original.indexOf(after, insertAt);
  if (afterOffset < 0) return null;

  const next = cloneEntryWithSource(
    entry,
    `${original.slice(0, insertAt)}${adjustedSourceText(item)}${original.slice(insertAt)}`,
    { preserveTranslations: false },
  );
  const manualTranslationsApplied = applyManualTranslations([next], item);
  assertAppliedEntriesTranslated(item, [next], translationsBySource);
  return {
    index: beforeIndex,
    replacement: next,
    manualTranslationsApplied,
  };
}

function tableReplacementEntries(entries, range, item) {
  if (item.type === 'local_extra_candidate') return [];

  const localEntries = entries.slice(range.start, range.end);
  const fallbackBlockKey = blockKeyBetween(entries, range.start, range.end);
  const templateEntry = localEntries[0] || templateForInsertion(entries, range);
  const source = adjustedSourceText(item);

  if (localEntries.length === 0) {
    return [newEntry(source, templateEntry, fallbackBlockKey)];
  }

  if (localEntries.length === 1) {
    const preserveTranslations = comparisonKey(source) === comparisonKey(sourceText(localEntries[0]));
    return [cloneEntryWithSource(localEntries[0], source, {
      preserveTranslations: preserveTranslations || shouldPreserveExistingTranslation(item, localEntries[0], source),
    })];
  }

  const sourceSentences = splitSentences(source);
  if (sourceSentences.length !== localEntries.length) {
    throw new Error(
      `${item.id} spans ${localEntries.length} table cells but source splits into ${sourceSentences.length} unit(s); apply this table edit manually.`,
    );
  }
  return localEntries.map((entry, index) => {
    const nextText = sourceSentences[index];
    return cloneEntryWithSource(entry, nextText, {
      preserveTranslations: comparisonKey(nextText) === comparisonKey(sourceText(entry))
        || shouldPreserveExistingTranslation(item, entry, nextText),
    });
  });
}

function replacementEntries(entries, range, item) {
  const localEntries = entries.slice(range.start, range.end);
  if (item.type === 'local_extra_candidate') {
    if (localEntries.some((entry) => isTableEntry(entry))) {
      return localEntries.map((entry) => cloneEntryWithSource(entry, '', { preserveTranslations: false }));
    }
    return [];
  }

  const partialReplacement = replaceWithinSingleEntry(entries, range, item);
  if (partialReplacement) return partialReplacement;

  const fallbackBlockKey = blockKeyBetween(entries, range.start, range.end);
  const templateEntry = localEntries[0] || templateForInsertion(entries, range);
  if (allTableEntries(localEntries, templateEntry)) {
    return tableReplacementEntries(entries, range, item);
  }

  const sourceSentences = splitSentences(adjustedSourceText(item));
  const pairs = pairedSourceUnits(sourceSentences, localEntries);
  const afterBlockKey = (
    range.end < entries.length
    && localEntries.length > 0
    && entries[range.end].blockKey !== localEntries[localEntries.length - 1].blockKey
  )
    ? localEntries[localEntries.length - 1].blockKey + 0.5
    : fallbackBlockKey;

  let lastPairedBlockKey = localEntries[0]?.blockKey ?? fallbackBlockKey;

  return sourceSentences.map((zh, sourceIndex) => {
    const localIndex = pairs.get(sourceIndex);
    if (localIndex !== undefined) {
      const localEntry = localEntries[localIndex];
      lastPairedBlockKey = localEntry.blockKey;
      const preserveLocalSource = item.type === 'source_omission_candidate';
      const nextText = preserveLocalSource ? sourceText(localEntry) : zh;
      return cloneEntryWithSource(localEntry, nextText, {
        preserveTranslations: comparisonKey(nextText) === comparisonKey(sourceText(localEntry))
          || shouldPreserveExistingTranslation(item, localEntry, nextText),
      });
    }

    const blockKey = localEntries.length > 0 && sourceIndex > Math.min(...pairs.keys(), sourceSentences.length)
      ? afterBlockKey
      : lastPairedBlockKey;
    const template = {
      ...(templateEntry || {}),
      blockKey,
      blockType: templateEntry?.blockType || 'paragraph',
      kind: 'sentence',
      field: 'zh',
    };
    return newEntry(zh, template, blockKey);
  });
}

function applyItem(entries, item, translationsBySource) {
  const intraEntryInsertion = insertWithinSingleEntry(entries, item, translationsBySource);
  if (intraEntryInsertion) {
    const beforeCount = entries.length;
    entries.splice(intraEntryInsertion.index, 1, intraEntryInsertion.replacement);
    return {
      id: item.id,
      type: item.type,
      start: intraEntryInsertion.index,
      removed: 1,
      inserted: 1,
      delta: entries.length - beforeCount,
      mode: 'intra-entry-insert',
      manualTranslationsApplied: intraEntryInsertion.manualTranslationsApplied,
    };
  }

  const range = findTargetRange(entries, item);
  const beforeCount = entries.length;
  const replacements = replacementEntries(entries, range, item);
  const manualTranslationsApplied = applyManualTranslations(replacements, item);
  assertAppliedEntriesTranslated(item, replacements, translationsBySource);
  entries.splice(range.start, range.end - range.start, ...replacements);
  return {
    id: item.id,
    type: item.type,
    start: range.start,
    removed: range.end - range.start,
    inserted: replacements.length,
    delta: entries.length - beforeCount,
    manualTranslationsApplied,
  };
}

function itemApproved(item, opts) {
  if (opts.onlyItems.size > 0 && !opts.onlyItems.has(item.id)) return false;
  if (opts.deny.has(item.id)) return false;
  if (item.status === 'applied' || item.status === 'denied') return false;
  if (item.decision === 'applied' || item.decision === 'denied') return false;
  if (opts.approve.has(item.id)) return true;
  return item.status === 'approved' || item.decision === 'approved';
}

function updateQueueDecisions(queue, opts) {
  const now = new Date().toISOString();
  for (const item of queue.items || []) {
    if (opts.approve.has(item.id)) {
      item.status = 'approved';
      item.decision = 'approved';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
    }
    if (opts.deny.has(item.id)) {
      item.status = 'denied';
      item.decision = 'denied';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
    }
  }
}

function applyQueue(queue, opts) {
  updateQueueDecisions(queue, opts);

  const approvedItems = (queue.items || [])
    .filter((item) => itemApproved(item, opts))
    .sort((a, b) => {
      const aStart = a.localRange?.startIndex ?? Number.MAX_SAFE_INTEGER;
      const bStart = b.localRange?.startIndex ?? Number.MAX_SAFE_INTEGER;
      return a.file.localeCompare(b.file) || aStart - bStart || a.id.localeCompare(b.id);
    });

  const byFile = new Map();
  for (const item of approvedItems) {
    const bucket = byFile.get(item.file) || [];
    bucket.push(item);
    byFile.set(item.file, bucket);
  }

  const files = [];
  const now = new Date().toISOString();

  for (const [file, items] of byFile.entries()) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const originalEntries = flattenEntries(chapter);
    const translationsBySource = indexTranslationsBySource(originalEntries);
    let entries = originalEntries.map((entry) => ({
      ...entry,
      unit: clone(entry.unit),
    }));

    const applied = [];
    for (const item of items) {
      const summary = applyItem(entries, item, translationsBySource);
      applied.push(summary);
      item.status = opts.dryRun ? 'approved' : 'applied';
      item.decision = opts.dryRun ? 'approved' : 'applied';
      item.appliedAt = opts.dryRun ? undefined : now;
      item.appliedSummary = summary;
    }

    entries = repairPunctuationPlacement(entries);
    renumber(entries);
    const transferred = transferTranslations(entries, translationsBySource);
    updateMeta(chapter, entries);
    chapter.content = rebuildContent(entries, chapter.content || []);

    files.push({
      file,
      applied,
      beforeSentences: originalEntries.length,
      afterSentences: entries.length,
      beforeCountableSources: countSourceEntries(originalEntries),
      afterCountableSources: countSourceEntries(entries),
      transferredTranslations: transferred,
      translatedCount: countTranslated(entries),
    });

    if (!opts.dryRun) {
      fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
    }
  }

  return {
    appliedItems: approvedItems.length,
    files,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const reports = [];

  for (const queuePath of opts.queues) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const result = applyQueue(queue, opts);
    reports.push({
      queue: queuePath,
      ...result,
    });

    if (!opts.dryRun) {
      queue.updatedAt = new Date().toISOString();
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
  }

  console.log(JSON.stringify({
    dryRun: opts.dryRun,
    queues: reports,
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
