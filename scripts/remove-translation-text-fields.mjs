#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HANZI_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;

function usage() {
  console.error(`Usage:
  node scripts/remove-translation-text-fields.mjs [--book=<id>] [--chapter=<path>] [--apply] [--details] [--repair-from-text]
  node scripts/remove-translation-text-fields.mjs data/hanshu/001.json [more files ...] [--apply] [--repair-from-text]

Removes deprecated translations[].text fields only when the same translation object has
non-empty literal and idiomatic fields with no Chinese characters. With --repair-from-text,
invalid literal/idiomatic values are first replaced from text, but only when text itself is
non-empty English with no Chinese characters. Dry-run by default.`);
  process.exit(1);
}

function argValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find(item => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) usage();
  const positional = process.argv.slice(2).filter(arg => !arg.startsWith('-'));
  const opts = {
    book: argValue('--book') || null,
    chapter: argValue('--chapter') || null,
    apply: process.argv.includes('--apply'),
    details: process.argv.includes('--details'),
    repairFromText: process.argv.includes('--repair-from-text'),
    positional,
  };
  const targetModes = [opts.book, opts.chapter, opts.positional.length > 0].filter(Boolean).length;
  if (targetModes > 1) {
    console.error('Use only one target mode: --book, --chapter, or positional files.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(opts) {
  if (opts.positional.length > 0) return opts.positional;
  if (opts.chapter) return [opts.chapter];
  const books = fs.readdirSync(DATA_DIR)
    .filter(name => fs.statSync(path.join(DATA_DIR, name)).isDirectory())
    .filter(name => name !== 'quality')
    .filter(name => !opts.book || name === opts.book)
    .sort();
  return books.flatMap(book => fs.readdirSync(path.join(DATA_DIR, book))
    .filter(file => /^\d{3}\.json$/.test(file))
    .sort()
    .map(file => path.join(DATA_DIR, book, file)));
}

function pathLabel(parts) {
  return parts.map(part => (typeof part === 'number' ? `[${part}]` : (part.includes('.') ? `["${part}"]` : `.${part}`))).join('').replace(/^\./, '');
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function validateReplacementField(translation, key) {
  if (!hasOwn(translation, key)) return `${key} is missing`;
  if (typeof translation[key] !== 'string') return `${key} is not a string`;
  if (translation[key].trim().length === 0) return `${key} is empty`;
  if (HANZI_RE.test(translation[key])) return `${key} contains Chinese characters`;
  return null;
}

function inspectTextField(translation, parts) {
  const failures = ['literal', 'idiomatic']
    .map(key => validateReplacementField(translation, key))
    .filter(Boolean);
  return {
    path: pathLabel([...parts, 'text']),
    text: translation.text,
    failures,
  };
}

function fieldNeedsRepair(translation, key) {
  return validateReplacementField(translation, key) !== null;
}

function validateTextSource(translation) {
  if (typeof translation.text !== 'string') return 'text is not a string';
  if (translation.text.trim().length === 0) return 'text is empty';
  if (HANZI_RE.test(translation.text)) return 'text contains Chinese characters';
  return null;
}

function repairFromTextFields(node) {
  const repairs = [];
  if (!node || typeof node !== 'object') return repairs;

  const visit = (value, parts = []) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (const [index, item] of value.entries()) visit(item, [...parts, index]);
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === 'translations' && Array.isArray(child)) {
        for (const [index, translation] of child.entries()) {
          if (!translation || typeof translation !== 'object' || Array.isArray(translation) || !hasOwn(translation, 'text')) continue;
          const sourceFailure = validateTextSource(translation);
          if (sourceFailure) {
            repairs.push({
              path: pathLabel([...parts, key, index, 'text']),
              field: 'text',
              failure: sourceFailure,
              repaired: false,
            });
            continue;
          }
          for (const field of ['literal', 'idiomatic']) {
            if (!fieldNeedsRepair(translation, field)) continue;
            translation[field] = translation.text;
            repairs.push({
              path: pathLabel([...parts, key, index, field]),
              field,
              repaired: true,
            });
          }
        }
        continue;
      }
      visit(child, [...parts, key]);
    }
  };

  visit(node);
  return repairs;
}

function collectTranslationTextFields(node, parts = []) {
  const hits = [];
  if (!node || typeof node !== 'object') return hits;

  if (Array.isArray(node)) {
    for (const [index, item] of node.entries()) {
      hits.push(...collectTranslationTextFields(item, [...parts, index]));
    }
    return hits;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === 'translations' && Array.isArray(value)) {
      for (const [index, translation] of value.entries()) {
        if (!translation || typeof translation !== 'object' || Array.isArray(translation)) continue;
        if (hasOwn(translation, 'text')) {
          hits.push(inspectTextField(translation, [...parts, key, index]));
        }
      }
      continue;
    }
    hits.push(...collectTranslationTextFields(value, [...parts, key]));
  }
  return hits;
}

function removeTextFields(node) {
  let removed = 0;
  if (!node || typeof node !== 'object') return removed;

  if (Array.isArray(node)) {
    for (const item of node) removed += removeTextFields(item);
    return removed;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === 'translations' && Array.isArray(value)) {
      for (const translation of value) {
        if (!translation || typeof translation !== 'object' || Array.isArray(translation)) continue;
        if (hasOwn(translation, 'text')) {
          delete translation.text;
          removed += 1;
        }
      }
      continue;
    }
    removed += removeTextFields(value);
  }
  return removed;
}

function main() {
  const opts = parseArgs();
  const files = chapterFiles(opts);
  const changes = [];
  const blockers = [];
  let totalRepairs = 0;
  let totalTextFields = 0;

  for (const file of files) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const repairs = opts.repairFromText ? repairFromTextFields(chapter) : [];
    const failedRepairs = repairs.filter(repair => !repair.repaired);
    if (failedRepairs.length > 0) {
      blockers.push({ file, blockers: failedRepairs.map(repair => ({ path: repair.path, failures: [repair.failure] })) });
      continue;
    }
    const hits = collectTranslationTextFields(chapter);
    if (hits.length === 0) continue;

    totalTextFields += hits.length;
    totalRepairs += repairs.length;
    const fileBlockers = hits.filter(hit => hit.failures.length > 0);
    if (fileBlockers.length > 0) {
      blockers.push({ file, blockers: fileBlockers });
    } else {
      changes.push({ file, count: hits.length, repairs: repairs.length, chapter });
    }
  }

  if (blockers.length > 0) {
    console.error(`Refusing to remove translations[].text fields: ${blockers.reduce((sum, item) => sum + item.blockers.length, 0)} unsafe replacement(s) found.`);
    for (const item of blockers) {
      console.error(`${item.file}: ${item.blockers.length} blocker(s)`);
      for (const blocker of item.blockers.slice(0, opts.details ? item.blockers.length : 10)) {
        console.error(`  ${blocker.path}: ${blocker.failures.join('; ')}`);
      }
      if (!opts.details && item.blockers.length > 10) {
        console.error(`  ... ${item.blockers.length - 10} more; rerun with --details to list all`);
      }
    }
    console.error('No files were changed.');
    process.exit(1);
  }

  let removed = 0;
  for (const change of changes) {
    removed += change.count;
    if (opts.apply) {
      const actualRemoved = removeTextFields(change.chapter);
      if (actualRemoved !== change.count) {
        throw new Error(`${change.file}: expected to remove ${change.count} text field(s), removed ${actualRemoved}`);
      }
      fs.writeFileSync(change.file, `${JSON.stringify(change.chapter, null, 2)}\n`);
    }
    const repairMessage = change.repairs > 0 ? ` after ${opts.apply ? 'repairing' : 'would repair'} ${change.repairs} field(s)` : '';
    console.log(`${change.file}: ${opts.apply ? 'removed' : 'would remove'} ${change.count} translations[].text field(s)${repairMessage}`);
  }

  console.log(`${opts.apply ? 'Removed' : 'Would remove'} ${removed}/${totalTextFields} translations[].text field(s) across ${changes.length}/${files.length} chapter(s).`);
  if (opts.repairFromText) {
    console.log(`${opts.apply ? 'Repaired' : 'Would repair'} ${totalRepairs} literal/idiomatic field(s) from text.`);
  }
}

main();
