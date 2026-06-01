#!/usr/bin/env node

import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const epubPath = process.argv[2];
const errors = [];

function usage() {
  console.error('Usage: node scripts/smoke-calibre-ebook.mjs dist/ebooks/<slug>/<slug>.epub');
}

function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function findExecutable(name, envName, macAppPath) {
  const fromEnv = process.env[envName];
  if (fromEnv && isExecutable(fromEnv)) return fromEnv;

  const pathDirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    const candidate = path.join(dir, name);
    if (isExecutable(candidate)) return candidate;
  }

  if (macAppPath && isExecutable(macAppPath)) return macAppPath;
  return null;
}

function run(command, args) {
  try {
    return childProcess.execFileSync(command, args, {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (error) {
    const output = [
      error.stdout?.toString('utf8') || '',
      error.stderr?.toString('utf8') || ''
    ].join('\n').trim();
    errors.push(output || error.message);
    return '';
  }
}

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function metadataValue(output, label) {
  for (const line of output.split(/\r?\n/u)) {
    const [rawLabel, ...rest] = line.split(':');
    if (rawLabel?.trim() === label) return rest.join(':').trim();
  }
  return '';
}

function containsAllMetadataTags(tagsValue, expectedTags) {
  const tags = tagsValue.split(',').map((tag) => tag.trim()).filter(Boolean);
  return expectedTags.every((expected) => tags.includes(expected));
}

function validateConvertedMetadata(output, productMetadata) {
  if (!/Title\s+:/u.test(output) || !/Author\(s\)\s+:/u.test(output)) {
    errors.push('Calibre could not read expected title/author metadata from converted AZW3 output.');
    return;
  }
  if (!productMetadata) return;

  const expectedTitle = productMetadata.subtitle
    ? `${productMetadata.title}: ${productMetadata.subtitle}`
    : productMetadata.title;
  const title = metadataValue(output, 'Title');
  if (title !== expectedTitle) {
    errors.push(`Converted AZW3 title metadata mismatch: "${title}" != "${expectedTitle}".`);
  }

  const authors = metadataValue(output, 'Author(s)');
  if (authors !== productMetadata.author) {
    errors.push(`Converted AZW3 author metadata mismatch: "${authors}" != "${productMetadata.author}".`);
  }

  const publisher = metadataValue(output, 'Publisher');
  if ((productMetadata.publisher || '') && publisher !== productMetadata.publisher) {
    errors.push(`Converted AZW3 publisher metadata mismatch: "${publisher}" != "${productMetadata.publisher}".`);
  }

  const language = metadataValue(output, 'Languages');
  if (productMetadata.language === 'en' && language !== 'eng') {
    errors.push(`Converted AZW3 language metadata mismatch: "${language}" != "eng".`);
  }

  const comments = metadataValue(output, 'Comments');
  if ((productMetadata.description || '') && comments !== productMetadata.description) {
    errors.push('Converted AZW3 comments metadata does not match product description.');
  }

  const expectedTags = [
    ...(Array.isArray(productMetadata.kdp?.categories) ? productMetadata.kdp.categories : []),
    ...(Array.isArray(productMetadata.kdp?.keywords) ? productMetadata.kdp.keywords : []),
  ].filter(Boolean);
  if (expectedTags.length > 0 && !containsAllMetadataTags(metadataValue(output, 'Tags'), expectedTags)) {
    errors.push('Converted AZW3 tags metadata does not include all KDP categories and keywords.');
  }
}

if (!epubPath) {
  usage();
  process.exit(2);
}

if (!fs.existsSync(epubPath)) {
  console.error(`EPUB not found: ${epubPath}`);
  process.exit(1);
}

const ebookConvert = findExecutable(
  'ebook-convert',
  'CALIBRE_EBOOK_CONVERT',
  '/Applications/calibre.app/Contents/MacOS/ebook-convert'
);
const ebookMeta = findExecutable(
  'ebook-meta',
  'CALIBRE_EBOOK_META',
  '/Applications/calibre.app/Contents/MacOS/ebook-meta'
);

if (!ebookConvert) {
  console.error('Calibre ebook-convert not found. Install Calibre or set CALIBRE_EBOOK_CONVERT.');
  process.exit(1);
}

const slug = path.basename(epubPath, '.epub');
const productDir = path.dirname(epubPath);
const productMetadata = readJsonIfExists(path.join(productDir, 'metadata.json'));
const outputPath = path.join(os.tmpdir(), `${slug}-calibre-smoke.azw3`);
fs.rmSync(outputPath, { force: true });

const convertOutput = run(ebookConvert, [epubPath, outputPath]);

if (errors.length === 0 && (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 1024)) {
  errors.push(`Calibre conversion did not create a plausible AZW3 output: ${outputPath}`);
}

if (ebookMeta && fs.existsSync(outputPath)) {
  const metadataOutput = run(ebookMeta, [outputPath]);
  validateConvertedMetadata(metadataOutput, productMetadata);
}

if (errors.length > 0) {
  console.error(`Calibre smoke test failed for ${path.relative(process.cwd(), epubPath)}:`);
  for (const error of errors) console.error(error);
  process.exit(1);
}

const size = fs.statSync(outputPath).size;
console.log(`Calibre smoke test passed: ${path.relative(process.cwd(), epubPath)} -> ${outputPath} (${size} bytes)`);
if (convertOutput.includes('Output saved to')) {
  console.log(convertOutput.split(/\r?\n/).filter((line) => line.includes('Output saved to')).join('\n'));
}
