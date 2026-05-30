#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function usage() {
  console.error('Usage: node scripts/cleanup-quote-fix-artifacts.mjs --book=<id> [--apply]');
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function chapterFiles(book) {
  if (!book) usage();
  const bookDir = path.join('data', book);
  return fs.readdirSync(bookDir)
    .filter(file => /^\d{3}\.json$/.test(file))
    .sort()
    .map(file => path.join(bookDir, file));
}

function translationFields(sentence) {
  const fields = [];
  if (sentence.translations?.[0]) {
    fields.push({ owner: sentence.translations[0], key: 'literal' });
    fields.push({ owner: sentence.translations[0], key: 'idiomatic' });
  }
  if (Object.hasOwn(sentence, 'literal')) fields.push({ owner: sentence, key: 'literal' });
  if (Object.hasOwn(sentence, 'idiomatic')) fields.push({ owner: sentence, key: 'idiomatic' });
  if (Object.hasOwn(sentence, 'translation')) fields.push({ owner: sentence, key: 'translation' });
  return fields.filter(field => typeof field.owner[field.key] === 'string');
}

function cleanupText(text) {
  let next = text;
  next = next.replace(/''([,.;:!?)]?\s*)$/g, "'$1");
  next = next.replace(/""([,.;:!?)]?\s*)$/g, '"$1');
  next = next.replace(/””([,.;:!?)]?\s*)$/g, '”$1');
  next = next.replace(/^ ('|")/, '$1');
  next = next.trimStart();
  return next;
}

function cleanupChapter(chapter) {
  const changes = [];
  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
    for (const sentence of block.sentences || []) {
      for (const field of translationFields(sentence)) {
        const before = field.owner[field.key];
        const after = cleanupText(before);
        if (before === after) continue;
        field.owner[field.key] = after;
        changes.push({ id: sentence.id, field: field.key, before, after });
      }
    }
  }
  return changes;
}

function main() {
  const book = argValue('--book');
  const apply = process.argv.includes('--apply');
  const files = chapterFiles(book);
  let total = 0;

  for (const file of files) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const changes = cleanupChapter(chapter);
    if (changes.length === 0) continue;
    total += changes.length;
    console.log(`${file}: ${apply ? 'fixed' : 'found'} ${changes.length} artifact(s)`);
    for (const change of changes.slice(0, 10)) {
      console.log(`  ${change.id} ${change.field}`);
      console.log(`    before: ${change.before}`);
      console.log(`    after:  ${change.after}`);
    }
    if (changes.length > 10) console.log(`  ... ${changes.length - 10} more`);
    if (apply) fs.writeFileSync(file, JSON.stringify(chapter, null, 2));
  }

  console.log(`${apply ? 'Fixed' : 'Found'} ${total} quote-fix artifact(s).`);
}

main();
