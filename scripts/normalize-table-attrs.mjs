#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = process.argv.slice(2);
const files = targets.length > 0
  ? targets
  : fs.readdirSync(path.join(root, 'data'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => fs.readdirSync(path.join(root, 'data', entry.name))
      .filter((file) => /^\d+\.json$/.test(file))
      .map((file) => path.join('data', entry.name, file)));

function parsePrefix(text) {
  const source = String(text || '');
  const match = source.match(/^((?:(?:rowspan|colspan|valign|align|style|class)\s*=\s*"[^"]*"\s*)+)\|\s*/i);
  if (!match) return null;

  const attrs = {};
  for (const attr of match[1].matchAll(/\b(rowspan|colspan)\s*=\s*"(\d+)"/gi)) {
    attrs[attr[1].toLowerCase()] = parseInt(attr[2], 10);
  }

  return {
    attrs,
    text: source.slice(match[0].length)
  };
}

function cleanText(holder, key, spanTarget) {
  if (!holder || typeof holder[key] !== 'string') return false;
  const parsed = parsePrefix(holder[key]);
  if (!parsed) return false;

  holder[key] = parsed.text;
  if (spanTarget) {
    if (Number.isInteger(parsed.attrs.rowspan) && parsed.attrs.rowspan > 1) spanTarget.rowspan = parsed.attrs.rowspan;
    if (Number.isInteger(parsed.attrs.colspan) && parsed.attrs.colspan > 1) spanTarget.colspan = parsed.attrs.colspan;
  }
  return true;
}

function cleanTranslationObject(translation) {
  let changed = false;
  for (const key of ['literal', 'idiomatic', 'text', 'translation']) {
    changed = cleanText(translation, key, null) || changed;
  }
  return changed;
}

function cleanCellLike(item) {
  let changed = false;
  for (const key of ['content', 'zh']) {
    changed = cleanText(item, key, item) || changed;
  }
  for (const key of ['literal', 'idiomatic', 'text', 'translation']) {
    changed = cleanText(item, key, null) || changed;
  }
  if (Array.isArray(item.translations)) {
    for (const translation of item.translations) {
      changed = cleanTranslationObject(translation) || changed;
    }
  }
  return changed;
}

let changedFiles = 0;
let changedItems = 0;

for (const rel of files) {
  const file = path.resolve(root, rel);
  if (!file.startsWith(path.join(root, 'data') + path.sep)) continue;
  if (!fs.existsSync(file)) continue;

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;

  for (const block of data.content || []) {
    if (block.type === 'table_row' && Array.isArray(block.cells)) {
      for (const cell of block.cells) {
        if (cleanCellLike(cell)) {
          changed = true;
          changedItems += 1;
        }
      }
    } else if (block.type === 'table_header' && Array.isArray(block.sentences)) {
      for (const sentence of block.sentences) {
        if (cleanCellLike(sentence)) {
          changed = true;
          changedItems += 1;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    changedFiles += 1;
    console.log(rel);
  }
}

console.log(`Normalized table attributes in ${changedItems} cells across ${changedFiles} files.`);
