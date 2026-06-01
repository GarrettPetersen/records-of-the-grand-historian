#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'ebooks', 'manifest.json');

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.error(`Usage:
  node scripts/quality-scan.mjs [--book BOOK | --product SLUG] [--json] [--fail] [scanner options...] [path ...]

Runs the reusable cheap QA scanners:
  - scan-source-artifacts.mjs
  - scan-translation-artifacts.mjs
  - scan-translation-alignment.mjs
  - scan-compound-name-spacing.mjs
  - scan-title-style.mjs
  - scan-translation-completeness.mjs
  - scan-translation-metadata.mjs
  - scan-literal-identical-prose.mjs (advisory review priority only)

Options:
  --book BOOK       Scan data/BOOK
  --product SLUG    Scan the chapter files listed for an e-book product in ebooks/manifest.json
  --json            Emit one combined machine-readable report
  --fail            Exit 1 when any hard-gate scanner finds candidates

Additional shared scanner options, such as --include-literal, are passed through.`);
  process.exit(0);
}

const wantsJson = args.includes('--json');
const productIndex = args.findIndex((arg) => arg === '--product');
const productArg = productIndex >= 0
  ? args[productIndex + 1]
  : (args.find((arg) => arg.startsWith('--product=')) || '').slice('--product='.length) || null;
if (productIndex >= 0 && !productArg) {
  console.error('Missing product slug after --product.');
  process.exit(2);
}

function chapterPathsForProduct(slug) {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Missing e-book manifest: ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const product = (manifest.products || []).find((entry) => entry.slug === slug);
  if (!product) {
    console.error(`No product "${slug}" found in ebooks/manifest.json.`);
    process.exit(2);
  }
  if (!product.book || !Array.isArray(product.chapters) || product.chapters.length === 0) {
    console.error(`Product "${slug}" must define book and chapters before it can be scanned.`);
    process.exit(2);
  }
  return product.chapters.map((chapter) => path.join('data', product.book, `${String(chapter).padStart(3, '0')}.json`));
}

const passThroughArgs = args
  .filter((arg, index) => {
    if (arg === '--json' || arg === '--summary') return false;
    if (arg === '--product') return false;
    if (productIndex >= 0 && index === productIndex + 1) return false;
    if (arg.startsWith('--product=')) return false;
    return true;
  });

if (productArg && passThroughArgs.some((arg) => arg === '--book' || arg.startsWith('--book='))) {
  console.error('Use either --book or --product, not both.');
  process.exit(2);
}

const productPaths = productArg ? chapterPathsForProduct(productArg) : [];

function omitFlagWithOptionalValue(args, flag) {
  const result = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === flag) {
      index += 1;
      continue;
    }
    if (arg.startsWith(`${flag}=`)) continue;
    result.push(arg);
  }
  return result;
}

const argsFor = (scanner) => {
  let scannerArgs = productArg ? [...passThroughArgs, ...productPaths] : passThroughArgs;
  if (scanner.advisory) scannerArgs = scannerArgs.filter(arg => arg !== '--fail');
  if (scanner.id !== 'translation-alignment') {
    scannerArgs = scannerArgs.filter(arg => arg !== '--review-priorities');
    scannerArgs = omitFlagWithOptionalValue(scannerArgs, '--min-severity');
    scannerArgs = omitFlagWithOptionalValue(scannerArgs, '--glossary-scope');
  }
  if (scanner.id === 'translation-artifacts') {
    return scannerArgs.filter(arg => arg !== '--no-source-check');
  }
  if (scanner.id === 'translation-alignment'
    && !scannerArgs.some(arg => arg === '--min-severity' || arg.startsWith('--min-severity='))) {
    return [...scannerArgs, '--min-severity', '3'];
  }
  return scannerArgs;
};

const commands = [
  {
    id: 'source-artifacts',
    label: 'Source artifact candidates',
    command: 'node',
    args: ['scripts/scan-source-artifacts.mjs'],
  },
  {
    id: 'translation-artifacts',
    label: 'Translation artifact candidates',
    command: 'node',
    args: ['scripts/scan-translation-artifacts.mjs'],
  },
  {
    id: 'translation-alignment',
    label: 'Translation alignment candidates',
    command: 'node',
    args: ['scripts/scan-translation-alignment.mjs'],
    advisory: true,
  },
  {
    id: 'compound-name-spacing',
    label: 'Compound name spacing candidates',
    command: 'node',
    args: ['scripts/scan-compound-name-spacing.mjs'],
  },
  {
    id: 'title-style',
    label: 'Title style candidates',
    command: 'node',
    args: ['scripts/scan-title-style.mjs'],
  },
  {
    id: 'translation-completeness',
    label: 'Translation completeness candidates',
    command: 'node',
    args: ['scripts/scan-translation-completeness.mjs'],
  },
  {
    id: 'translation-metadata',
    label: 'Translation metadata candidates',
    command: 'node',
    args: ['scripts/scan-translation-metadata.mjs'],
  },
  {
    id: 'literal-identical-prose',
    label: 'Literal-identical prose review priorities',
    command: 'node',
    args: ['scripts/scan-literal-identical-prose.mjs'],
    advisory: true,
  },
];

let exitCode = 0;
const reports = [];

for (const scanner of commands) {
  const scannerArgs = wantsJson ? ['--json', ...argsFor(scanner)] : ['--summary', ...argsFor(scanner)];
  const result = spawnSync(scanner.command, [...scanner.args, ...scannerArgs], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    stdio: wantsJson ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (wantsJson) {
    if (result.stderr) process.stderr.write(result.stderr);
    try {
      reports.push({
        id: scanner.id,
        label: scanner.label,
        advisory: Boolean(scanner.advisory),
        ...JSON.parse(result.stdout || '{}'),
      });
    } catch (error) {
      console.error(`Could not parse JSON from ${scanner.id}: ${error.message}`);
      if (result.stdout) process.stderr.write(result.stdout);
      process.exit(1);
    }
  }

  if (!scanner.advisory && result.status) exitCode = result.status;
}

if (wantsJson) {
  const totalHardHits = reports
    .filter((report) => !report.advisory)
    .reduce((sum, report) => (
      sum + (Number(report.count) || Number(report.totalHits) || 0)
    ), 0);
  const totalAdvisoryHits = reports
    .filter((report) => report.advisory)
    .reduce((sum, report) => (
      sum + (Number(report.count) || Number(report.totalHits) || 0)
    ), 0);
  console.log(JSON.stringify({
    totalHits: totalHardHits + totalAdvisoryHits,
    totalHardHits,
    totalAdvisoryHits,
    scanners: reports,
  }, null, 2));
}

process.exit(exitCode);
