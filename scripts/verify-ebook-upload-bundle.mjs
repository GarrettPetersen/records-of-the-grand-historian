#!/usr/bin/env node
/**
 * Verify the small KDP upload bundle for a generated e-book.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2] || '';

function usage() {
  console.error('Usage: node scripts/verify-ebook-upload-bundle.mjs SLUG');
}

if (!slug) {
  usage();
  process.exit(2);
}

const repoRoot = process.cwd();
const productDir = path.join(repoRoot, 'dist', 'ebooks', slug);
const uploadDir = path.join(productDir, 'upload');
const required = [
  `${slug}.epub`,
  'cover.jpg',
  'kdp-draft-worksheet.md',
  'kdp-upload-fields.json',
  'upload-checklist.md',
  'README.md',
  'SHA256SUMS.txt',
];
const errors = [];

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

if (!fs.existsSync(uploadDir)) {
  errors.push(`Missing upload bundle directory: ${path.relative(repoRoot, uploadDir)}`);
} else {
  for (const file of required) {
    if (!fs.existsSync(path.join(uploadDir, file))) {
      errors.push(`Missing upload bundle file: ${path.relative(repoRoot, path.join(uploadDir, file))}`);
    }
  }
}

const checksumPath = path.join(uploadDir, 'SHA256SUMS.txt');
if (fs.existsSync(checksumPath)) {
  const seen = new Set();
  const lines = fs.readFileSync(checksumPath, 'utf8').trim().split(/\r?\n/u).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/u);
    if (!match) {
      errors.push(`Invalid checksum line: ${line}`);
      continue;
    }
    const [, expectedSha, file] = match;
    seen.add(file);
    const fullPath = path.join(uploadDir, file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Checksum references missing file: ${file}`);
      continue;
    }
    const actualSha = sha256File(fullPath);
    if (actualSha !== expectedSha) {
      errors.push(`Checksum mismatch for ${file}: ${expectedSha} != ${actualSha}`);
    }
  }
  for (const file of required.filter((item) => item !== 'SHA256SUMS.txt')) {
    if (!seen.has(file)) errors.push(`SHA256SUMS.txt is missing ${file}`);
  }
}

if (errors.length > 0) {
  console.error(`KDP upload bundle check failed for ${slug}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`KDP upload bundle OK: dist/ebooks/${slug}/upload`);
