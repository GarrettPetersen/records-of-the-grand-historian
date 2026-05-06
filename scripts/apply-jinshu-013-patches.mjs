#!/usr/bin/env node
/**
 * Rebuild a full translation session JSON from patch arrays (id, literal, idiomatic)
 * plus blockIndex/chinese from data/jinshu/013.json, then run submit-translations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CHAPTER = path.join(ROOT, 'data/jinshu/013.json');
const OUT = path.join(ROOT, 'translations/full_013_apply.json');
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2';

const PATCH_FILES = [
  path.join(ROOT, 'translations/patch_b0.json'),
  path.join(ROOT, 'translations/patch_b3_a.json'),
  path.join(ROOT, 'translations/patch_b3_b.json'),
  path.join(ROOT, 'translations/patch_b3_c.json'),
  path.join(ROOT, 'translations/patch_b3_d.json'),
  path.join(ROOT, 'translations/patch_b4a.json'),
  path.join(ROOT, 'translations/patch_b4b.json'),
  path.join(ROOT, 'translations/patch_b5.json'),
  path.join(ROOT, 'translations/patch_b6.json'),
  path.join(ROOT, 'translations/patch_b7.json'),
  path.join(ROOT, 'translations/patch_b8.json'),
  path.join(ROOT, 'translations/patch_b9.json'),
  path.join(ROOT, 'translations/patch_b10.json'),
  path.join(ROOT, 'translations/patch_b11.json'),
  path.join(ROOT, 'translations/patch_b12.json'),
  path.join(ROOT, 'translations/patch_b13.json'),
  path.join(ROOT, 'translations/patch_b14.json'),
  path.join(ROOT, 'translations/patch_b15.json'),
  path.join(ROOT, 'translations/patch_b16.json'),
];

function buildChapterIdLookup(chapter) {
  const byId = new Map();
  for (let blockIndex = 0; blockIndex < chapter.content.length; blockIndex++) {
    const block = chapter.content[blockIndex];
    let list = [];
    if (block.type === 'paragraph') list = block.sentences || [];
    else if (block.type === 'table_row') list = block.cells || [];
    else if (block.type === 'table_header') list = block.sentences || [];
    else continue;
    for (const row of list) {
      const id = row.id;
      if (!id) continue;
      const chinese = block.type === 'table_row' ? row.content : row.zh;
      byId.set(id, { blockIndex, chinese: chinese || '' });
    }
  }
  return byId;
}

function main() {
  const validateOnly = process.argv.includes('--validate-only');
  const chapter = JSON.parse(fs.readFileSync(CHAPTER, 'utf8'));
  const lookup = buildChapterIdLookup(chapter);
  const sentences = [];

  for (const pf of PATCH_FILES) {
    if (!fs.existsSync(pf)) {
      console.error('Missing patch file:', pf);
      process.exit(1);
    }
    const patch = JSON.parse(fs.readFileSync(pf, 'utf8'));
    if (!Array.isArray(patch)) {
      console.error('Not an array:', pf);
      process.exit(1);
    }
    for (const p of patch) {
      const meta = lookup.get(p.id);
      if (!meta) {
        console.error('Unknown sentence id', p.id, 'in', pf);
        process.exit(1);
      }
      sentences.push({
        id: p.id,
        originalId: p.id,
        blockIndex: meta.blockIndex,
        chinese: meta.chinese,
        literal: p.literal,
        idiomatic: p.idiomatic,
      });
    }
  }

  const out = {
    metadata: {
      book: chapter.meta.book,
      chapter: String(chapter.meta.chapter),
      file: 'data/jinshu/013.json',
    },
    sentences,
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote', OUT, 'sentences:', sentences.length);

  const args = ['submit-translations.js', OUT, TRANSLATOR, MODEL];
  if (validateOnly) args.push('--validate-only');

  const r = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    cwd: ROOT,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

main();
