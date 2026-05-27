#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = process.argv.slice(2);

function isBlank(value) {
  return !String(value || '').trim();
}

function translationText(item) {
  const translations = Array.isArray(item?.translations) ? item.translations : [];
  return [
    item?.literal,
    item?.idiomatic,
    item?.text,
    item?.translation,
    ...translations.flatMap((t) => [t?.literal, t?.idiomatic, t?.text, t?.translation])
  ].join('');
}

function isEmptyParagraph(block) {
  if (block?.type !== 'paragraph') return false;
  const sentences = Array.isArray(block.sentences) ? block.sentences : [];
  if (sentences.length === 0) return true;
  return sentences.every((sentence) => isBlank(sentence?.zh) && isBlank(translationText(sentence)));
}

let changedFiles = 0;
let removedBlocks = 0;

for (const rel of targets) {
  const file = path.resolve(root, rel);
  if (!file.startsWith(path.join(root, 'data') + path.sep)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const before = data.content?.length || 0;
  data.content = (data.content || []).filter((block) => !isEmptyParagraph(block));
  const removed = before - data.content.length;
  if (removed > 0) {
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    changedFiles += 1;
    removedBlocks += removed;
    console.log(`${rel}: removed ${removed}`);
  }
}

console.log(`Removed ${removedBlocks} empty paragraph block(s) from ${changedFiles} file(s).`);
