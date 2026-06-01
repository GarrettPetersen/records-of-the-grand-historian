#!/usr/bin/env node
/**
 * Reusable QA bundle for generated e-book products.
 *
 * This intentionally composes the smaller validators so future e-books run the
 * same checks as the Shiji pilot without requiring a long command checklist.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'ebooks', 'manifest.json');

function usage() {
  console.error(`Usage:
  node scripts/ebook-qa.mjs --slug SLUG [--book BOOK] [--skip-calibre]
  node scripts/ebook-qa.mjs --all [--skip-calibre]

Options:
  --slug SLUG      E-book product slug under dist/ebooks/
  --book BOOK      Source book id; derived from ebooks/manifest.json when omitted
  --all            Run QA for every product listed in ebooks/manifest.json
  --skip-calibre   Skip optional Calibre EPUB->AZW3 conversion smoke test
  --require-languagetool-current
                  Require current cached LanguageTool scores for the product source chapters
  --require-manual-signoff
                  Also require the artifact-bound Kindle/KDP manual QA signoff`);
}

function parseArgs(argv) {
  const opts = {
    slug: null,
    book: null,
    all: false,
    skipCalibre: false,
    requireLanguageToolCurrent: false,
    requireManualSignoff: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--skip-calibre') {
      opts.skipCalibre = true;
      continue;
    }
    if (arg === '--require-languagetool-current') {
      opts.requireLanguageToolCurrent = true;
      continue;
    }
    if (arg === '--require-manual-signoff') {
      opts.requireManualSignoff = true;
      continue;
    }
    if (arg === '--all') {
      opts.all = true;
      continue;
    }
    if (arg === '--slug') {
      opts.slug = argv[++i];
      continue;
    }
    if (arg.startsWith('--slug=')) {
      opts.slug = arg.slice('--slug='.length);
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }
  if (opts.all && (opts.slug || opts.book)) {
    console.error('--all cannot be combined with --slug or --book.');
    usage();
    process.exit(2);
  }
  if (!opts.all && !opts.slug) {
    usage();
    process.exit(2);
  }
  return opts;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function productForSlug(manifest, slug) {
  if (!manifest) return null;
  return (manifest.products || []).find((product) => product.slug === slug) || null;
}

function run(label, command, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: false,
  });
  if (result.error) {
    console.error(`${label} failed to start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`${label} failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
}

function chapterPathsForProduct(product) {
  if (!product.book || !Array.isArray(product.chapters) || product.chapters.length === 0) return null;
  return product.chapters.map((chapter) => path.join('data', product.book, `${String(chapter).padStart(3, '0')}.json`));
}

function runProduct(productLike, opts) {
  const slug = productLike.slug;
  const book = opts.book || productLike.book;

  if (!book) {
    console.error(`Could not derive source book for slug "${slug}". Pass --book BOOK.`);
    process.exit(2);
  }

  const epubPath = path.join('dist', 'ebooks', slug, `${slug}.epub`);
  if (!fs.existsSync(path.join(REPO_ROOT, epubPath))) {
    console.error(`Missing EPUB artifact: ${epubPath}`);
    console.error(`Run: make ebook BOOK=${book}`);
    process.exit(1);
  }

  run('EPUB structure validation', 'node', ['scripts/validate-ebook.mjs', epubPath]);

  if (!opts.skipCalibre) {
    run('Calibre conversion smoke test', 'node', ['scripts/smoke-calibre-ebook.mjs', epubPath]);
  }

  const chapterPaths = chapterPathsForProduct({ ...productLike, book });
  const sourceScopeArgs = chapterPaths || ['--book', book];

  run('Quote span alignment', 'node', ['scripts/scan-quote-span-alignment.mjs', '--limit=0', ...sourceScopeArgs]);
  run('Cheap translation quality scan', 'node', ['scripts/quality-scan.mjs', '--fail', ...sourceScopeArgs]);
  if (opts.requireLanguageToolCurrent) {
    run('LanguageTool cache freshness', 'node', ['scripts/score-languagetool.mjs', ...sourceScopeArgs, '--check-cache']);
  }
  if (opts.requireManualSignoff) {
    run('Manual publication signoff', 'node', ['scripts/validate-ebook-manual-qa.mjs', '--slug', slug]);
  }

  console.log(`\nE-book QA passed for ${slug} (${book}).`);
}

const opts = parseArgs(process.argv.slice(2));
const manifest = readManifest();

if (opts.all) {
  const products = manifest?.products || [];
  if (products.length === 0) {
    console.error('No e-book products found in ebooks/manifest.json.');
    process.exit(1);
  }
  for (const product of products) runProduct(product, opts);
  console.log(`\nE-book QA passed for ${products.length} product(s).`);
} else {
  const product = productForSlug(manifest, opts.slug) || { slug: opts.slug, book: opts.book };
  runProduct(product, opts);
}
