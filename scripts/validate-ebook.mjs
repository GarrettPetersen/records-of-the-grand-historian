#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
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

const productDir = path.dirname(epubPath);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function unzipText(file) {
  return childProcess.execFileSync('unzip', ['-p', epubPath, file], { encoding: 'utf8' });
}

function unzipBuffer(file) {
  return childProcess.execFileSync('unzip', ['-p', epubPath, file]);
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
  'EPUB/cover.xhtml',
  'EPUB/images/cover.png',
  'EPUB/styles/ebook.css'
];

for (const entry of required) {
  if (!entries.includes(entry)) errors.push(`Missing required EPUB entry: ${entry}`);
}

for (const sidecar of ['cover.png', 'kdp-metadata.md', 'metadata.json', 'qa-report.json', 'publication-manifest.json']) {
  if (!fs.existsSync(path.join(productDir, sidecar))) {
    errors.push(`Missing generated e-book sidecar: ${sidecar}`);
  }
}

if (fs.existsSync(path.join(productDir, 'publication-manifest.json'))) {
  const publicationManifest = readJson(path.join(productDir, 'publication-manifest.json'));
  const artifacts = [
    publicationManifest.uploadArtifacts?.epub,
    publicationManifest.uploadArtifacts?.cover,
    publicationManifest.uploadArtifacts?.kdpMetadata,
    publicationManifest.supportArtifacts?.metadata,
    publicationManifest.supportArtifacts?.qaReport
  ].filter(Boolean);
  for (const artifact of artifacts) {
    const artifactPath = path.join(productDir, artifact.file || '');
    if (!artifact.file || !fs.existsSync(artifactPath)) {
      errors.push(`Publication manifest references missing artifact: ${artifact.file || '(empty)'}`);
      continue;
    }
    const actualBytes = fs.statSync(artifactPath).size;
    if (artifact.bytes !== actualBytes) {
      errors.push(`Publication manifest byte count mismatch for ${artifact.file}: ${artifact.bytes} != ${actualBytes}`);
    }
    const actualSha = sha256File(artifactPath);
    if (artifact.sha256 !== actualSha) {
      errors.push(`Publication manifest SHA-256 mismatch for ${artifact.file}.`);
    }
  }
}

if (fs.existsSync(path.join(productDir, 'qa-report.json'))) {
  const qaReport = readJson(path.join(productDir, 'qa-report.json'));
  if (Array.isArray(qaReport.errors) && qaReport.errors.length > 0) {
    errors.push(`QA report contains ${qaReport.errors.length} error(s).`);
  }
  for (const chapter of qaReport.chapters || []) {
    const tableRendering = chapter.tableRendering || {};
    if (tableRendering.rows > 0 && tableRendering.renderedRows === 0) {
      errors.push(`QA report shows no rendered table rows for chapter ${chapter.chapter}.`);
    }
    if (tableRendering.renderedRows > tableRendering.rows) {
      errors.push(`QA report table row count mismatch for chapter ${chapter.chapter}: ${tableRendering.renderedRows}/${tableRendering.rows}.`);
    }
  }
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
const cover = unzipText('EPUB/cover.xhtml');
if (!packageXml.includes('properties="nav"')) {
  errors.push('package.opf does not identify nav.xhtml with properties="nav".');
}
if (!packageXml.includes('href="images/cover.png"') || !packageXml.includes('media-type="image/png"') || !packageXml.includes('properties="cover-image"')) {
  errors.push('package.opf does not identify images/cover.png as the PNG cover image.');
}
if (!nav.includes('epub:type="toc"')) {
  errors.push('nav.xhtml does not contain an EPUB TOC nav.');
}
if (!cover.includes('src="images/cover.png"')) {
  errors.push('cover.xhtml does not reference images/cover.png.');
}
if (entries.includes('EPUB/images/cover.svg')) {
  errors.push('EPUB still packages cover.svg; use the raster cover image for store upload.');
}

const png = unzipBuffer('EPUB/images/cover.png');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (png.length < 24 || !png.subarray(0, 8).equals(pngSignature)) {
  errors.push('EPUB/images/cover.png is not a valid PNG file.');
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
