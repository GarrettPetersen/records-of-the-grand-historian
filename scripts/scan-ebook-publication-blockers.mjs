#!/usr/bin/env node
/**
 * Scan generated e-book upload artifacts for visible publication blockers.
 *
 * This is intentionally narrower than LanguageTool or the source QA scanners:
 * it catches embarrassing packaged-text artifacts that KDP/manual review has
 * flagged before, such as placeholders, raw table attributes, and known typo
 * variants that should not appear in an upload EPUB.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO_ROOT = process.cwd();

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.json',
  '.md',
  '.opf',
  '.txt',
  '.xhtml',
  '.xml',
]);

const BLOCKERS = [
  {
    id: 'missing_translation',
    pattern: /\(No translation available\)|\[translation\]/iu,
    reason: 'Visible missing-translation placeholder.',
  },
  {
    id: 'todo_placeholder',
    pattern: /\b(?:TODO|FIXME)\b/iu,
    reason: 'Visible editorial placeholder.',
  },
  {
    id: 'undefined_value',
    pattern: /\bundefined\b/iu,
    reason: 'Visible generated undefined value.',
  },
  {
    id: 'raw_table_span',
    pattern: /\b(?:colspan|rowspan)\b/iu,
    reason: 'Raw HTML table span attribute visible in rendered text.',
  },
  {
    id: 'maquis',
    pattern: /\bMaquis\b/u,
    reason: 'Likely typo for Marquis.',
  },
  {
    id: 'strategems',
    pattern: /\bstrategems\b/iu,
    reason: 'Misspelling; use stratagems.',
  },
  {
    id: 'edicted',
    pattern: /\bedicted\b/iu,
    reason: 'Non-standard KDP spellcheck hit; use ordered, issued an edict, or commanded.',
  },
  {
    id: 'unaccented_lese_majeste',
    pattern: /\blese-majeste\b/iu,
    reason: 'Use standard lèse-majesté spelling or a plain-English equivalent.',
  },
  {
    id: 'paoge',
    pattern: /\bpaoge\b/iu,
    reason: 'Unexplained romanized torture term reads like a typo in KDP spellcheck.',
  },
];

function usage() {
  console.error(`Usage:
  node scripts/scan-ebook-publication-blockers.mjs --slug SLUG [--fail]
  node scripts/scan-ebook-publication-blockers.mjs path/to/book.epub [path ...] [--fail]

Scans generated EPUB/upload artifacts for visible placeholders and known
KDP-facing spelling tripwires.`);
}

function parseArgs(argv) {
  const opts = {
    slug: null,
    inputs: [],
    fail: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--fail') {
      opts.fail = true;
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
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (!opts.slug && opts.inputs.length === 0) {
    usage();
    process.exit(2);
  }
  return opts;
}

function slugInputs(slug) {
  const productDir = path.join(REPO_ROOT, 'dist', 'ebooks', slug);
  return [
    path.join(productDir, `${slug}.epub`),
    path.join(productDir, 'upload'),
  ].filter((input) => fs.existsSync(input));
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ebook-publication-blockers-'));
}

function extractEpub(epubPath) {
  const tmpDir = makeTempDir();
  const result = spawnSync('unzip', ['-q', epubPath, '-d', tmpDir], {
    cwd: REPO_ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.error) {
    throw new Error(`Could not run unzip for ${epubPath}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`Could not extract ${epubPath}: ${result.stderr || result.stdout}`);
  }
  return tmpDir;
}

function walkFiles(input) {
  const files = [];
  const stat = fs.statSync(input);
  if (stat.isFile()) {
    files.push(input);
    return files;
  }
  for (const entry of fs.readdirSync(input, { withFileTypes: true })) {
    const fullPath = path.join(input, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function lineAndColumn(text, index) {
  const before = text.slice(0, index);
  const lines = before.split(/\n/u);
  return {
    line: lines.length,
    column: lines.at(-1).length + 1,
  };
}

function excerpt(text, index, length, width = 90) {
  const start = Math.max(0, index - Math.floor(width / 2));
  const end = Math.min(text.length, index + length + Math.floor(width / 2));
  return text.slice(start, end).replace(/\s+/gu, ' ').trim();
}

function scanFile(file, displayRoot = '') {
  if (!isTextFile(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const hits = [];
  for (const blocker of BLOCKERS) {
    const flags = blocker.pattern.flags.includes('g')
      ? blocker.pattern.flags
      : `${blocker.pattern.flags}g`;
    const pattern = new RegExp(blocker.pattern.source, flags);
    for (const match of text.matchAll(pattern)) {
      const index = match.index || 0;
      const position = lineAndColumn(text, index);
      hits.push({
        file: displayRoot ? path.relative(displayRoot, file) : file,
        absoluteFile: file,
        line: position.line,
        column: position.column,
        id: blocker.id,
        match: match[0],
        reason: blocker.reason,
        excerpt: excerpt(text, index, match[0].length),
      });
    }
  }
  return hits;
}

function expandInputs(inputs) {
  const expanded = [];
  const tempDirs = [];
  for (const input of inputs) {
    const fullPath = path.resolve(REPO_ROOT, input);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Input not found: ${input}`);
    }
    if (path.extname(fullPath).toLowerCase() === '.epub') {
      const extracted = extractEpub(fullPath);
      tempDirs.push(extracted);
      expanded.push({ root: extracted, label: input });
    } else {
      expanded.push({ root: fullPath, label: input });
    }
  }
  return { expanded, tempDirs };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inputs = opts.slug ? slugInputs(opts.slug) : opts.inputs;
  if (inputs.length === 0) {
    console.error(`No generated e-book artifacts found for slug "${opts.slug}". Run: make ebook BOOK=<book>`);
    process.exit(1);
  }

  const { expanded, tempDirs } = expandInputs(inputs);
  try {
    const hits = [];
    for (const input of expanded) {
      for (const file of walkFiles(input.root)) {
        hits.push(...scanFile(file, input.root).map((hit) => ({
          ...hit,
          input: input.label,
        })));
      }
    }

    console.log(`E-book publication blocker scan: ${hits.length} hit(s)`);
    if (hits.length > 0) {
      for (const hit of hits) {
        console.log(`${hit.input}:${hit.file}:${hit.line}:${hit.column} ${hit.id} "${hit.match}"`);
        console.log(`  ${hit.reason}`);
        console.log(`  ${hit.excerpt}`);
      }
    }
    if (opts.fail && hits.length > 0) process.exit(1);
  } finally {
    for (const tempDir of tempDirs) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

main();
