#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HANZI_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;

function usage() {
  console.error(`Usage:
  node scripts/repair-translation-field-pairs.mjs [--book=<id>] [--chapter=<path>] [--apply] [--remove-invalid] [path ...]

Safely normalizes translation objects:
  - if literal is invalid and idiomatic is valid English, copy idiomatic to literal
  - if idiomatic is invalid and literal is valid English, copy literal to idiomatic
  - if both are invalid on an empty source sentence/cell, remove the placeholder translation object
  - with --remove-invalid, also remove translation objects where both fields are invalid on non-empty source text

It does not invent translations for non-empty source text when both fields are invalid.
Dry-run by default.`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, chapter: null, apply: false, removeInvalid: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') usage();
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--remove-invalid') {
      opts.removeInvalid = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) usage();
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--chapter') {
      opts.chapter = argv[++i];
      if (!opts.chapter) usage();
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapter = arg.slice('--chapter='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
    }
    opts.inputs.push(arg);
  }
  const targetModes = [opts.book, opts.chapter, opts.inputs.length > 0].filter(Boolean).length;
  if (targetModes > 1) {
    console.error('Use only one target mode: --book, --chapter, or positional files.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(opts) {
  if (opts.inputs.length > 0) return opts.inputs;
  if (opts.chapter) return [opts.chapter];
  const inputs = opts.book
    ? [path.join(DATA_DIR, opts.book)]
    : fs.readdirSync(DATA_DIR)
      .map(entry => path.join(DATA_DIR, entry))
      .filter(entry => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');

  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
  };
  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function validEnglish(value) {
  return typeof value === 'string' && value.trim().length > 0 && !HANZI_RE.test(value);
}

function sourceText(node) {
  return String(node?.zh || node?.content || '').trim();
}

function repairNode(node, stats, opts) {
  if (!node || typeof node !== 'object') return false;
  let changed = false;

  if (Array.isArray(node)) {
    for (const child of node) {
      if (repairNode(child, stats, opts)) changed = true;
    }
    return changed;
  }

  if (Array.isArray(node.translations)) {
    const nextTranslations = [];
    for (const translation of node.translations) {
      if (!translation || typeof translation !== 'object' || Array.isArray(translation)) {
        nextTranslations.push(translation);
        continue;
      }

      let literalValid = validEnglish(translation.literal);
      let idiomaticValid = validEnglish(translation.idiomatic);

      if (!literalValid && idiomaticValid) {
        translation.literal = translation.idiomatic;
        literalValid = true;
        stats.literalFromIdiomatic += 1;
        changed = true;
      }

      if (!idiomaticValid && literalValid) {
        translation.idiomatic = translation.literal;
        idiomaticValid = true;
        stats.idiomaticFromLiteral += 1;
        changed = true;
      }

      const emptySource = sourceText(node).length === 0;
      if (!literalValid && !idiomaticValid && (emptySource || opts.removeInvalid)) {
        if (emptySource) stats.removedEmptySourcePlaceholders += 1;
        else stats.removedInvalidTranslations += 1;
        changed = true;
        continue;
      }

      if (!literalValid || !idiomaticValid) {
        stats.unresolved += 1;
      }

      nextTranslations.push(translation);
    }

    if (nextTranslations.length !== node.translations.length) {
      if (nextTranslations.length === 0) delete node.translations;
      else node.translations = nextTranslations;
    }
  }

  for (const value of Object.values(node)) {
    if (repairNode(value, stats, opts)) changed = true;
  }

  return changed;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  const totals = {
    literalFromIdiomatic: 0,
    idiomaticFromLiteral: 0,
    removedEmptySourcePlaceholders: 0,
    removedInvalidTranslations: 0,
    unresolved: 0,
  };
  let changedFiles = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const stats = {
      literalFromIdiomatic: 0,
      idiomaticFromLiteral: 0,
      removedEmptySourcePlaceholders: 0,
      removedInvalidTranslations: 0,
      unresolved: 0,
    };
    const changed = repairNode(data, stats, opts);
    for (const key of Object.keys(totals)) totals[key] += stats[key];
    if (!changed) continue;
    changedFiles += 1;
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`${file}: ${opts.apply ? 'applied' : 'would apply'} ${JSON.stringify(stats)}`);
  }

  console.log(`${opts.apply ? 'Applied' : 'Would apply'} repairs in ${changedFiles}/${files.length} file(s): ${JSON.stringify(totals)}`);
}

main();
