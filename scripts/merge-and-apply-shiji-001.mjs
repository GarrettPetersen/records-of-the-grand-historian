#!/usr/bin/env node
/**
 * Merge translation patches (id + literal + idiomatic) into shiji 001 chapter JSON,
 * rebuild paragraph-level translations, write data + public copies.
 *
 * Usage: node scripts/merge-and-apply-shiji-001.mjs translations/patches/shiji001-merged.json
 */
import fs from 'node:fs';
import path from 'node:path';

const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2';

const chapterPath = path.resolve('data/shiji/001.json');
const patchPath = path.resolve(process.argv[2] || 'translations/patches/shiji001-merged.json');

const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
const byId = new Map(patch.map((p) => [p.id, p]));

for (const block of chapter.content) {
  if (block.type !== 'paragraph') continue;
  for (const sent of block.sentences || []) {
    const p = byId.get(sent.id);
    if (!p) {
      console.error(`Missing patch for ${sent.id}`);
      process.exit(1);
    }
    if (!sent.translations?.length) sent.translations = [{}];
    sent.translations[0].lang = 'en';
    sent.translations[0].translator = TRANSLATOR;
    sent.translations[0].model = MODEL;
    sent.translations[0].literal = p.literal;
    sent.translations[0].idiomatic = p.idiomatic;
  }
  const literals = (block.sentences || []).map((s) => s.translations?.[0]?.literal?.trim()).filter(Boolean);
  const idioms = (block.sentences || []).map((s) => s.translations?.[0]?.idiomatic?.trim()).filter(Boolean);
  if (!block.translations?.length) block.translations = [{}];
  block.translations[0].lang = 'en';
  block.translations[0].translator = TRANSLATOR;
  block.translations[0].model = MODEL;
  block.translations[0].literal = literals.join(' ');
  block.translations[0].idiomatic = idioms.join(' ');
}

let translatedCount = 0;
for (const block of chapter.content) {
  if (block.type !== 'paragraph') continue;
  for (const s of block.sentences || []) {
    if (s.translations?.[0]?.idiomatic?.trim()) translatedCount++;
  }
}
chapter.meta.translatedCount = translatedCount;

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2));
const pub = path.resolve('public/data/shiji/001.json');
if (fs.existsSync(pub)) {
  fs.writeFileSync(pub, JSON.stringify(chapter, null, 2));
}
console.log(`Updated ${chapterPath} and public copy; translatedCount=${translatedCount}`);
