#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const jsonPath = path.join(repoRoot, 'ebooks', 'publication-descriptions.json');
const mdDir = path.join(repoRoot, 'ebooks', 'publication-descriptions');

const args = new Set(process.argv.slice(2));
const initMdFromJson = args.has('--init-md-from-json');
const check = args.has('--check');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

function textForMarkdown(text) {
  return normalizeText(text)
    // Repair the common typo from editing JSON by hand.
    .replace(/\/n\/n/g, '\n\n');
}

function jsonTextFromMarkdown(text) {
  return normalizeText(text);
}

function writeIfChanged(file, content) {
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (existing === content) return false;
  if (check) {
    console.error(`Would update ${path.relative(repoRoot, file)}`);
    return true;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

function initMarkdownFiles() {
  const descriptions = readJson(jsonPath);
  let changed = 0;
  for (const [bookId, entry] of Object.entries(descriptions)) {
    const text = textForMarkdown(entry?.text || '');
    const content = text ? `${text}\n` : '';
    if (writeIfChanged(path.join(mdDir, `${bookId}.md`), content)) changed += 1;
  }
  if (check && changed > 0) process.exitCode = 1;
  console.log(`${check ? 'Checked' : 'Wrote'} ${Object.keys(descriptions).length} markdown publication description files.`);
}

function syncJsonFromMarkdown() {
  const existing = fs.existsSync(jsonPath) ? readJson(jsonPath) : {};
  const bookIds = new Set(Object.keys(existing));
  if (fs.existsSync(mdDir)) {
    for (const name of fs.readdirSync(mdDir)) {
      if (!name.endsWith('.md')) continue;
      if (name === 'README.md' || name.startsWith('.') || name.startsWith('_')) continue;
      bookIds.add(path.basename(name, '.md'));
    }
  }

  const next = {};
  for (const bookId of [...bookIds].sort()) {
    const file = path.join(mdDir, `${bookId}.md`);
    const text = fs.existsSync(file) ? jsonTextFromMarkdown(fs.readFileSync(file, 'utf8')) : normalizeText(existing[bookId]?.text || '');
    next[bookId] = { text };
  }

  const content = `${JSON.stringify(next, null, 2)}\n`;
  const changed = writeIfChanged(jsonPath, content);
  if (check && changed) process.exitCode = 1;
  console.log(`${check ? 'Checked' : 'Synced'} ${Object.keys(next).length} publication descriptions to ${path.relative(repoRoot, jsonPath)}.`);
}

if (initMdFromJson) {
  initMarkdownFiles();
} else {
  syncJsonFromMarkdown();
}
