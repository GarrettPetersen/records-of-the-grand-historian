#!/usr/bin/env node
/**
 * Fill the final manual QA signoff fields after an unpublished KDP draft has
 * been created and inspected.
 *
 * This script does not verify KDP itself. It records the human-reviewed KDP
 * draft evidence in the artifact-bound manual QA file, and refuses to run
 * unless the earlier local/manual reader checks are already passed.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();

function usage() {
  console.error(`Usage:
  node scripts/signoff-ebook-kdp-draft.mjs --slug SLUG --checked-by NAME --confirm-kdp-draft [--checked-at ISO_DATE] [--notes TEXT] [--dry-run]

Options:
  --slug SLUG            E-book product slug, for example shiji
  --checked-by NAME      Human reviewer signing off the KDP draft
  --confirm-kdp-draft    Required explicit confirmation that the KDP draft exists and ingested cleanly
  --checked-at ISO_DATE  Optional timestamp/date; defaults to the current time
  --notes TEXT           Optional note stored on checks.kdpDraft.notes
  --dry-run              Validate inputs and print the updated signoff without writing`);
}

function parseArgs(argv) {
  const opts = {
    slug: '',
    checkedBy: '',
    checkedAt: '',
    notes: '',
    confirmKdpDraft: false,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--confirm-kdp-draft') {
      opts.confirmKdpDraft = true;
      continue;
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--slug') {
      opts.slug = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--slug=')) {
      opts.slug = arg.slice('--slug='.length);
      continue;
    }
    if (arg === '--checked-by') {
      opts.checkedBy = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--checked-by=')) {
      opts.checkedBy = arg.slice('--checked-by='.length);
      continue;
    }
    if (arg === '--checked-at') {
      opts.checkedAt = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--checked-at=')) {
      opts.checkedAt = arg.slice('--checked-at='.length);
      continue;
    }
    if (arg === '--notes') {
      opts.notes = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--notes=')) {
      opts.notes = arg.slice('--notes='.length);
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }
  return opts;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function artifact(slug, file) {
  const fullPath = path.join(REPO_ROOT, 'dist', 'ebooks', slug, file);
  return {
    file: `dist/ebooks/${slug}/${file}`,
    bytes: fs.statSync(fullPath).size,
    sha256: sha256File(fullPath),
  };
}

function currentArtifacts(slug) {
  return {
    epub: artifact(slug, `${slug}.epub`),
    cover: artifact(slug, 'cover.png'),
    kdpUploadFields: artifact(slug, 'kdp-upload-fields.json'),
    kdpDraftWorksheet: artifact(slug, 'kdp-draft-worksheet.md'),
    tableReview: artifact(slug, 'table-review.md'),
    reviewChecklist: artifact(slug, 'review-checklist.md'),
    uploadChecklist: artifact(slug, 'upload-checklist.md'),
    uploadBundleReadme: artifact(slug, 'upload/README.md'),
    uploadBundleChecksums: artifact(slug, 'upload/SHA256SUMS.txt'),
  };
}

function assertPassed(errors, label, value) {
  if (value !== 'passed') errors.push(`${label} is ${JSON.stringify(value)}; expected "passed".`);
}

function assertBoolean(errors, label, value, expected = true) {
  if (value !== expected) errors.push(`${label} is ${JSON.stringify(value)}; expected ${expected}.`);
}

function requirePreconditions(signoff) {
  const errors = [];
  const checks = signoff.checks || {};
  assertPassed(errors, 'Kindle Previewer status', checks.kindlePreviewer?.status);
  assertBoolean(errors, 'Kindle Previewer conversionErrors', checks.kindlePreviewer?.conversionErrors, false);
  assertPassed(errors, 'reader rendering status', checks.readerRendering?.status);
  assertBoolean(errors, 'readerRendering.lightModeOk', checks.readerRendering?.lightModeOk);
  assertBoolean(errors, 'readerRendering.darkModeOk', checks.readerRendering?.darkModeOk);
  assertPassed(errors, 'cover rendering status', checks.coverRendering?.status);
  assertPassed(errors, 'navigation status', checks.navigation?.status);
  assertPassed(errors, 'frontmatter status', checks.frontmatter?.status);
  if (checks.tableHeavyChapters?.status !== 'passed' && checks.tableHeavyChapters?.status !== 'not-applicable') {
    errors.push(`table-heavy chapter review status is ${JSON.stringify(checks.tableHeavyChapters?.status)}; expected "passed" or "not-applicable".`);
  }
  for (const chapter of checks.tableHeavyChapters?.chaptersReviewed || []) {
    assertPassed(errors, `table-heavy chapter ${chapter.chapter}`, chapter.status);
  }
  return errors;
}

function validIso(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? '' : new Date(time).toISOString();
}

const opts = parseArgs(process.argv.slice(2));
const errors = [];
if (!opts.slug) errors.push('--slug is required.');
if (!opts.checkedBy.trim()) errors.push('--checked-by is required.');
if (!opts.confirmKdpDraft) errors.push('--confirm-kdp-draft is required after creating and checking the unpublished KDP draft.');
const checkedAt = opts.checkedAt ? validIso(opts.checkedAt) : new Date().toISOString();
if (!checkedAt) errors.push('--checked-at must be a valid date or ISO timestamp.');

const signoffFile = opts.slug ? path.join(REPO_ROOT, 'ebooks', 'manual-qa', `${opts.slug}.json`) : '';
if (signoffFile && !fs.existsSync(signoffFile)) {
  errors.push(`Missing manual QA signoff file: ${path.relative(REPO_ROOT, signoffFile)}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  usage();
  process.exit(2);
}

const signoff = readJson(signoffFile);
const preconditionErrors = requirePreconditions(signoff);
if (preconditionErrors.length > 0) {
  console.error(`Cannot complete KDP signoff for ${opts.slug}:`);
  for (const error of preconditionErrors) console.error(`- ${error}`);
  process.exit(1);
}

const next = {
  ...signoff,
  status: 'passed',
  checkedBy: opts.checkedBy.trim(),
  checkedAt,
  artifacts: currentArtifacts(opts.slug),
  checks: {
    ...(signoff.checks || {}),
    kdpDraft: {
      ...(signoff.checks?.kdpDraft || {}),
      status: 'passed',
      draftCreated: true,
      fieldsMatchUploadFields: true,
      productDescriptionEntered: true,
      priceEntered: true,
      publishingRightsEntered: true,
      categoriesEntered: true,
      keywordsEntered: true,
      aiDisclosureEntered: true,
      ingestionErrors: false,
      notes: opts.notes || signoff.checks?.kdpDraft?.notes || 'Unpublished KDP draft created, fields checked against kdp-draft-worksheet.md, and manuscript/cover ingestion showed no errors.',
    },
  },
};

if (opts.dryRun) {
  process.stdout.write(`${JSON.stringify(next, null, 2)}\n`);
} else {
  fs.writeFileSync(signoffFile, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Recorded KDP draft signoff: ${path.relative(REPO_ROOT, signoffFile)}`);
}
