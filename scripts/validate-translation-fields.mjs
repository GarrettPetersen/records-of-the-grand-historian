#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const HANZI_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;

function usage() {
  console.error(`Usage:
  node scripts/validate-translation-fields.mjs [--book=<id>] [--public-data] [path ...]

Validates chapter translations:
  - translations[].text must not be present
  - translations[].literal and translations[].idiomatic must exist, be strings, and contain no Chinese characters
  - literal/idiomatic may be empty only for rows with non-empty footnote text or source-empty residue rows

Set allowChineseCharacters: true on a sentence or translation object for intentional
short Chinese references such as graph disambiguation or quoted source terms.`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, publicData: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') usage();
    if (arg === '--public-data') {
      opts.publicData = true;
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
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function targetRoot(opts) {
  return opts.publicData ? PUBLIC_DATA_DIR : DATA_DIR;
}

function chapterFiles(inputs) {
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

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function contextPath(parts) {
  return parts.map(part => (typeof part === 'number' ? `[${part}]` : `.${part}`)).join('').replace(/^\./, '');
}

function allowsChineseCharacters(sentence, translation) {
  return sentence?.allowChineseCharacters === true || translation?.allowChineseCharacters === true;
}

function sourceText(sentence) {
  for (const key of ['zh', 'source', 'content', 'text']) {
    if (typeof sentence?.[key] === 'string') return sentence[key];
  }
  return '';
}

function canHaveEmptyMainTranslation(translation, sentence) {
  return Boolean(String(translation?.footnote || '').trim()) || !String(sourceText(sentence)).trim();
}

function validateEnglishField(translation, field, allowChineseCharacters = false, allowEmpty = false) {
  if (!hasOwn(translation, field)) return `${field} missing`;
  if (typeof translation[field] !== 'string') return `${field} not string`;
  if (translation[field].trim().length === 0) return allowEmpty ? null : `${field} empty`;
  if (!allowChineseCharacters && HANZI_RE.test(translation[field])) return `${field} contains Chinese characters`;
  return null;
}

function validateTranslationObject(translation, parts, sentence) {
  const issues = [];
  if (hasOwn(translation, 'text')) issues.push('text present');
  const allowChinese = allowsChineseCharacters(sentence, translation);
  const allowEmpty = canHaveEmptyMainTranslation(translation, sentence);
  for (const field of ['literal', 'idiomatic']) {
    const issue = validateEnglishField(translation, field, allowChinese, allowEmpty);
    if (issue) issues.push(issue);
  }
  return issues.map(issue => ({ path: contextPath(parts), issue }));
}

function validateNode(node, parts = [], sentenceId = '') {
  const issues = [];
  if (!node || typeof node !== 'object') return issues;

  const nextSentenceId = typeof node.id === 'string' ? node.id : sentenceId;
  if (Array.isArray(node)) {
    for (const [index, item] of node.entries()) {
      issues.push(...validateNode(item, [...parts, index], nextSentenceId));
    }
    return issues;
  }

  if (Array.isArray(node.translations)) {
    for (const [index, translation] of node.translations.entries()) {
      if (!translation || typeof translation !== 'object' || Array.isArray(translation)) {
        issues.push({ path: contextPath([...parts, 'translations', index]), issue: 'translation object invalid', sentenceId: nextSentenceId });
        continue;
      }
      for (const issue of validateTranslationObject(translation, [...parts, 'translations', index], node)) {
        issues.push({ ...issue, sentenceId: nextSentenceId });
      }
    }
  }

  for (const [key, value] of Object.entries(node)) {
    issues.push(...validateNode(value, [...parts, key], nextSentenceId));
  }
  return issues;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = targetRoot(opts);
  let inputs = opts.inputs;
  if (opts.book) inputs = [path.join(root, opts.book)];
  if (inputs.length === 0) {
    inputs = fs.readdirSync(root)
      .map(entry => path.join(root, entry))
      .filter(entry => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');
  }

  const files = chapterFiles(inputs);
  const issues = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const issue of validateNode(data)) {
      issues.push({ file, ...issue });
    }
  }

  if (issues.length > 0) {
    console.error(`Translation field validation failed: ${issues.length} issue(s) in ${new Set(issues.map(issue => issue.file)).size} file(s).`);
    for (const issue of issues.slice(0, 200)) {
      const id = issue.sentenceId ? ` ${issue.sentenceId}` : '';
      console.error(`${issue.file}:${id} ${issue.path}: ${issue.issue}`);
    }
    if (issues.length > 200) console.error(`... ${issues.length - 200} more issue(s).`);
    process.exit(1);
  }

  console.log(`Translation field validation passed for ${files.length} chapter file(s).`);
}

main();
