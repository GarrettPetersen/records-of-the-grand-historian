#!/usr/bin/env node

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const epubPath = process.argv[2];

if (!epubPath) {
  console.error('Usage: node scripts/validate-ebook.mjs dist/ebooks/<slug>/<slug>.epub');
  process.exit(1);
}

if (!fs.existsSync(epubPath)) {
  console.error(`EPUB not found: ${epubPath}`);
  process.exit(1);
}

function unzipText(file) {
  return childProcess.execFileSync('unzip', ['-p', epubPath, file], { encoding: 'utf8' });
}

function listEntries() {
  return childProcess.execFileSync('unzip', ['-Z1', epubPath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
}

const errors = [];
const entries = listEntries();
const required = [
  'mimetype',
  'META-INF/container.xml',
  'EPUB/package.opf',
  'EPUB/nav.xhtml',
  'EPUB/styles/ebook.css'
];

for (const entry of required) {
  if (!entries.includes(entry)) errors.push(`Missing required EPUB entry: ${entry}`);
}

if (entries[0] !== 'mimetype') {
  errors.push('The first ZIP entry must be mimetype.');
}

const mimetype = unzipText('mimetype').trim();
if (mimetype !== 'application/epub+zip') {
  errors.push(`Invalid mimetype: ${mimetype}`);
}

const packageXml = unzipText('EPUB/package.opf');
const nav = unzipText('EPUB/nav.xhtml');
if (!packageXml.includes('properties="nav"')) {
  errors.push('package.opf does not identify nav.xhtml with properties="nav".');
}
if (!nav.includes('epub:type="toc"')) {
  errors.push('nav.xhtml does not contain an EPUB TOC nav.');
}

const chapterEntries = entries.filter((entry) => /^EPUB\/text\/chapter-\d+\.xhtml$/.test(entry));
if (chapterEntries.length === 0) {
  errors.push('No chapter XHTML files found.');
}

for (const chapterEntry of chapterEntries) {
  const content = unzipText(chapterEntry);
  if (/\(No translation available\)|\[translation\]|\bTODO\b/i.test(content)) {
    errors.push(`Placeholder text found in ${chapterEntry}`);
  }
}

if (errors.length > 0) {
  console.error(`EPUB validation failed for ${path.relative(process.cwd(), epubPath)}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`EPUB validation passed: ${path.relative(process.cwd(), epubPath)}`);
