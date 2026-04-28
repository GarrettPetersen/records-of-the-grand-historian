#!/usr/bin/env node
/**
 * Re-run submit-time validation (including punctuation / delimiter warnings) against
 * an existing translated chapter, without applying changes.
 *
 * Usage:
 *   node scripts/validate-chapter-as-batch.mjs data/hanshu/088.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chapterPath = path.resolve(process.argv[2] || '');
if (!chapterPath.endsWith('.json') || !fs.existsSync(chapterPath)) {
  console.error('Usage: node scripts/validate-chapter-as-batch.mjs <chapter.json>');
  process.exit(1);
}

const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
const sentences = [];

for (let blockIndex = 0; blockIndex < chapter.content.length; blockIndex++) {
  const block = chapter.content[blockIndex];
  const rows = block.type === 'table_row' ? block.cells : block.sentences;
  if (!rows) continue;
  for (const s of rows) {
    const zh = s.zh ?? s.content ?? '';
    const tr = s.translations?.[0];
    if (tr?.translator === 'Herbert J. Allen (1894)') continue;
    const lit = tr?.literal ?? '';
    const idm = tr?.idiomatic ?? '';
    if (!String(lit).trim() || !String(idm).trim()) continue;
    const sentenceId = s.id;
    if (!sentenceId) continue;
    sentences.push({
      id: sentenceId,
      originalId: sentenceId,
      blockIndex,
      chinese: zh,
      literal: lit,
      idiomatic: idm,
    });
  }
}

const batch = {
  metadata: {
    book: chapter.meta?.book,
    chapter: chapter.meta?.chapter,
    file: chapterPath,
  },
  sentences,
};

const outPath = path.join(
  path.dirname(chapterPath),
  `.validate-batch-${path.basename(chapterPath)}`
);
fs.writeFileSync(outPath, JSON.stringify(batch, null, 2));

const { validateTranslations } = await import(
  pathToFileURL(path.resolve(import.meta.dirname, '..', 'submit-translations.js')).href
);

console.log(`Validating ${sentences.length} sentences from ${chapterPath} (batch file: ${outPath})...\n`);

const errors = validateTranslations(outPath, chapterPath);
fs.unlinkSync(outPath);

if (errors.length > 0) {
  console.error('Validation errors:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Validation finished (exit 0). Review any ⚠️ warnings printed above.)');
