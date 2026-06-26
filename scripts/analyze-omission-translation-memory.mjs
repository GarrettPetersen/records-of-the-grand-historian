#!/usr/bin/env node
/**
 * Estimate how many pending source omissions can be repaired with exact
 * translation-memory matches from the existing corpus.
 *
 * Read-only. This does not approve, apply, or generate translations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { variantText } from './triage-repair-queue.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/;
const CJK_RE = /[\p{Script=Han}]/u;
const PUNCTUATION_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;

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

function strictKey(text) {
  return normalizePunctuation(String(text || '').replace(/\s+/gu, '').trim()).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function variantKey(text) {
  return Array.from(strictKey(text)).map((char) => variantText(char)).join('');
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
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

function primaryTranslation(unit) {
  const row = (unit.translations || []).find((translation) => (
    translation
    && typeof translation === 'object'
    && (String(translation.literal || '').trim() || String(translation.idiomatic || '').trim())
  )) || {};
  return {
    literal: String(row.literal || unit.literal || unit.translation || '').trim(),
    idiomatic: String(row.idiomatic || unit.idiomatic || unit.translation || '').trim(),
    translator: String(row.translator || unit.translator || 'Garrett M. Petersen (2026)').trim(),
    model: String(row.model || unit.model || 'Translation memory').trim(),
    footnote: typeof row.footnote === 'string' ? row.footnote.trim() : '',
    allowChineseCharacters: row.allowChineseCharacters === true || unit.allowChineseCharacters === true,
  };
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
  return merged.filter((sentence) => CJK_RE.test(sentence));
}

function walkUnits(chapter, visitor) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) visitor(unit);
    }
  }
}

function buildMemory(keyFn = strictKey) {
  const memory = new Map();
  const conflicts = new Set();
  for (const book of fs.readdirSync(DATA_DIR).sort()) {
    const bookDir = path.join(DATA_DIR, book);
    if (!fs.statSync(bookDir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const entry of fs.readdirSync(bookDir).filter((file) => CHAPTER_RE.test(file)).sort()) {
      const file = path.join(bookDir, entry);
      const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
      walkUnits(chapter, (unit) => {
        const zh = sourceText(unit);
        const key = keyFn(zh);
        if (!key || !hasMeaningfulTranslations(unit)) return;
        const translation = primaryTranslation(unit);
        if (!translation.literal || !translation.idiomatic) return;
        const value = { zh, translation, source: `${book}/${entry.replace(/\.json$/u, '')}` };
        const existing = memory.get(key);
        if (!existing) {
          memory.set(key, value);
          return;
        }
        if (
          existing.translation.literal !== translation.literal
          || existing.translation.idiomatic !== translation.idiomatic
        ) {
          conflicts.add(key);
        }
      });
    }
  }
  for (const key of conflicts) memory.delete(key);
  return { memory, conflicts };
}

function itemStatus(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (
    item.appliedAt ||
    status === 'applied' ||
    status === 'denied' ||
    status === 'approved' ||
    status === 'rejected' ||
    decision === 'included' ||
    decision === 'applied' ||
    decision === 'denied' ||
    decision === 'approved' ||
    decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function omissionItems() {
  const items = [];
  for (const entry of fs.readdirSync(QUALITY_DIR).filter((file) => QUEUE_RE.test(file)).sort()) {
    const queueFile = path.join(QUALITY_DIR, entry);
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    for (const item of queue.items || []) {
      if (itemStatus(item) !== 'pending') continue;
      if (item.type !== 'source_omission_candidate') continue;
      if (String(item.localRange?.text || '').trim()) continue;
      if (!String(item.sourceRange?.text || '').trim()) continue;
      items.push({ queueFile, item });
    }
  }
  return items;
}

const { memory, conflicts } = buildMemory();
const { memory: variantMemory, conflicts: variantConflicts } = buildMemory(variantKey);
const items = omissionItems();
const covered = [];
const partial = [];
const uncovered = [];
const variantCovered = [];
const variantPartial = [];

for (const record of items) {
  const sentences = splitSentences(record.item.sourceRange.text);
  const hits = sentences
    .map((sentence) => ({ sentence, memory: memory.get(strictKey(sentence)) }))
    .filter((hit) => hit.memory);
  if (sentences.length > 0 && hits.length === sentences.length) covered.push({ ...record, sentences, hits });
  else if (hits.length > 0) partial.push({ ...record, sentences, hits });
  else uncovered.push({ ...record, sentences, hits });

  const variantHits = sentences
    .map((sentence) => ({ sentence, memory: variantMemory.get(variantKey(sentence)) }))
    .filter((hit) => hit.memory);
  if (sentences.length > 0 && variantHits.length === sentences.length) {
    variantCovered.push({ ...record, sentences, hits: variantHits });
  } else if (variantHits.length > 0) {
    variantPartial.push({ ...record, sentences, hits: variantHits });
  }
}

function topBy(records, keyFn) {
  const map = new Map();
  for (const record of records) {
    const key = keyFn(record.item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12));
}

function sample(records) {
  return records.slice(0, 12).map((record) => ({
    id: record.item.id,
    chapter: `${record.item.book}/${record.item.chapter}`,
    sentenceCount: record.sentences.length,
    hits: record.hits.length,
    source: record.item.sourceRange.text.slice(0, 160),
    memorySources: [...new Set(record.hits.map((hit) => hit.memory.source))].slice(0, 8),
  }));
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  memoryEntries: memory.size,
  conflictingMemoryKeys: conflicts.size,
  variantMemoryEntries: variantMemory.size,
  conflictingVariantMemoryKeys: variantConflicts.size,
  pendingOmissions: items.length,
  fullyCovered: covered.length,
  partiallyCovered: partial.length,
  uncovered: uncovered.length,
  fullyCoveredWithVariants: variantCovered.length,
  partiallyCoveredWithVariants: variantPartial.length,
  fullyCoveredByBook: topBy(covered, (item) => item.book),
  fullyCoveredWithVariantsByBook: topBy(variantCovered, (item) => item.book),
  partiallyCoveredByBook: topBy(partial, (item) => item.book),
  partiallyCoveredWithVariantsByBook: topBy(variantPartial, (item) => item.book),
  fullyCoveredSamples: sample(covered),
  fullyCoveredWithVariantsSamples: sample(variantCovered),
  partiallyCoveredSamples: sample(partial),
}, null, 2));
