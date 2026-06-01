#!/usr/bin/env node
/**
 * Validate human publication signoff for generated e-book products.
 *
 * Automated checks can prove structure, packaging, and obvious text artifacts.
 * They cannot prove that Kindle Previewer, reader navigation, and KDP draft
 * ingestion have been inspected. This script gives that manual gate a reusable,
 * artifact-bound record for each product.
 */

import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'ebooks', 'manifest.json');
const QA_DIR = path.join(REPO_ROOT, 'ebooks', 'manual-qa');

function usage() {
  console.error(`Usage:
  node scripts/validate-ebook-manual-qa.mjs --slug SLUG [--init] [--report] [--json]
  node scripts/validate-ebook-manual-qa.mjs --all [--init] [--report] [--json]

Options:
  --slug SLUG  E-book product slug from ebooks/manifest.json
  --all        Validate or initialize every product in ebooks/manifest.json
  --init       Create a pending signoff file when it does not already exist
  --report     Print a human-readable manual QA checklist without failing on pending items
  --json       Emit a machine-readable signoff summary`);
}

function parseArgs(argv) {
  const opts = { slug: null, all: false, init: false, report: false, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--all') {
      opts.all = true;
      continue;
    }
    if (arg === '--init') {
      opts.init = true;
      continue;
    }
    if (arg === '--report') {
      opts.report = true;
      continue;
    }
    if (arg === '--json') {
      opts.json = true;
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
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }
  if (opts.all && opts.slug) {
    console.error('--all cannot be combined with --slug.');
    usage();
    process.exit(2);
  }
  if (!opts.all && !opts.slug) {
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

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('Missing ebooks/manifest.json.');
    process.exit(1);
  }
  return readJson(MANIFEST_PATH);
}

function productPath(product, file) {
  return path.join(REPO_ROOT, 'dist', 'ebooks', product.slug, file);
}

function chapterPath(product, chapter) {
  return path.join(REPO_ROOT, 'data', product.book, `${chapter}.json`);
}

function signoffPath(slug) {
  return path.join(QA_DIR, `${slug}.json`);
}

function epubPath(product) {
  return productPath(product, `${product.slug}.epub`);
}

function textContent(value) {
  if (value == null) return '';
  return String(value).replace(/\s+/gu, ' ').trim();
}

function decodeBasicEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

function visibleText(value) {
  return textContent(decodeBasicEntities(String(value || '').replace(/<[^>]+>/gu, ' ')));
}

function epubEntryText(product, entry) {
  const epub = epubPath(product);
  if (!fs.existsSync(epub)) return '';
  const result = childProcess.spawnSync('unzip', ['-p', epub, entry], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) return '';
  return result.stdout || '';
}

function tagTexts(content, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gu');
  return [...String(content || '').matchAll(re)].map((match) => visibleText(match[1])).filter(Boolean);
}

function navLinks(product) {
  const nav = epubEntryText(product, 'EPUB/nav.xhtml');
  const toc = nav.match(/<nav\b[^>]*epub:type="toc"[\s\S]*?<\/nav>/u)?.[0] || nav;
  return [...toc.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gu)]
    .map((match) => ({
      href: decodeBasicEntities(match[1]),
      text: visibleText(match[2]),
    }))
    .filter((link) => link.href && link.text);
}

function navigationTargets(product) {
  const links = navLinks(product);
  const chapterLinks = links.filter((link) => /^text\/chapter-\d{3}\.xhtml$/u.test(link.href));
  return [
    links.find((link) => link.href === 'cover.xhtml'),
    links.find((link) => link.href === 'frontmatter.xhtml'),
    links.find((link) => link.href === 'about.xhtml'),
    chapterLinks[0],
    chapterLinks[Math.floor(chapterLinks.length / 2)],
    chapterLinks.at(-1),
  ].filter(Boolean);
}

function proseFlowTargets(product) {
  const tableHeavy = new Set(tableChapters(product));
  const chapterLinks = navLinks(product)
    .filter((link) => {
      const chapter = link.href.match(/^text\/chapter-(\d{3})\.xhtml$/u)?.[1];
      return chapter && !tableHeavy.has(chapter);
    })
    .map((link) => ({
      chapter: link.href.match(/^text\/chapter-(\d{3})\.xhtml$/u)?.[1],
      epubEntry: `EPUB/${link.href}`,
      title: link.text,
    }));
  if (chapterLinks.length <= 3) return chapterLinks;
  return [chapterLinks[0], chapterLinks[Math.floor(chapterLinks.length / 2)], chapterLinks.at(-1)];
}

function qaReport(product) {
  const file = productPath(product, 'qa-report.json');
  return fs.existsSync(file) ? readJson(file) : null;
}

function publicationManifest(product) {
  const file = productPath(product, 'publication-manifest.json');
  return fs.existsSync(file) ? readJson(file) : null;
}

function kdpUploadFields(product) {
  const file = productPath(product, 'kdp-upload-fields.json');
  return fs.existsSync(file) ? readJson(file) : null;
}

function kdpDraftTargets(product) {
  const fields = kdpUploadFields(product);
  if (!fields) return null;
  return {
    title: fields.product?.title || '',
    subtitle: fields.product?.subtitle || '',
    contributors: Array.isArray(fields.product?.contributors) ? fields.product.contributors : [],
    publisher: fields.product?.publisher || '',
    language: fields.product?.language || '',
    series: fields.product?.series || '',
    seriesNumber: fields.product?.seriesNumber ?? null,
    isbnInstruction: fields.product?.isbn?.instruction || '',
    edition: fields.product?.edition || '',
    suggestedListPriceUsd: fields.kdp?.suggestedListPriceUsd || '',
    publishingRights: fields.kdp?.publishingRights || '',
    aiGeneratedContent: fields.kdp?.aiGeneratedContent || '',
    productDescription: fields.kdp?.productDescription || '',
    categories: Array.isArray(fields.kdp?.categories) ? fields.kdp.categories : [],
    keywords: Array.isArray(fields.kdp?.keywords) ? fields.kdp.keywords : [],
  };
}

function getTranslation(item) {
  if (!item) return '';
  if (item.translations?.[0]?.idiomatic) return item.translations[0].idiomatic;
  if (item.idiomatic) return item.idiomatic;
  if (item.translations?.[0]?.literal) return item.translations[0].literal;
  if (item.literal) return item.literal;
  return item.content || '';
}

function tableCells(block) {
  return Array.isArray(block?.cells) ? block.cells : [];
}

function isoDateOrEmpty(value) {
  if (!value || typeof value !== 'string') return '';
  const time = Date.parse(value);
  return Number.isNaN(time) ? '' : new Date(time).toISOString();
}

function currentArtifactInfo(product) {
  const epub = productPath(product, `${product.slug}.epub`);
  const cover = productPath(product, 'cover.png');
  const kdpUploadFields = productPath(product, 'kdp-upload-fields.json');
  const kdpDraftWorksheet = productPath(product, 'kdp-draft-worksheet.md');
  const tableReview = productPath(product, 'table-review.md');
  const reviewChecklist = productPath(product, 'review-checklist.md');
  const uploadChecklist = productPath(product, 'upload-checklist.md');
  const uploadBundleReadme = productPath(product, 'upload/README.md');
  const uploadBundleChecksums = productPath(product, 'upload/SHA256SUMS.txt');
  const artifact = (file, label) => fs.existsSync(file)
    ? { file: label, bytes: fs.statSync(file).size, sha256: sha256File(file) }
    : null;
  return {
    epub: artifact(epub, `dist/ebooks/${product.slug}/${product.slug}.epub`),
    cover: artifact(cover, `dist/ebooks/${product.slug}/cover.png`),
    kdpUploadFields: artifact(kdpUploadFields, `dist/ebooks/${product.slug}/kdp-upload-fields.json`),
    kdpDraftWorksheet: artifact(kdpDraftWorksheet, `dist/ebooks/${product.slug}/kdp-draft-worksheet.md`),
    tableReview: artifact(tableReview, `dist/ebooks/${product.slug}/table-review.md`),
    reviewChecklist: artifact(reviewChecklist, `dist/ebooks/${product.slug}/review-checklist.md`),
    uploadChecklist: artifact(uploadChecklist, `dist/ebooks/${product.slug}/upload-checklist.md`),
    uploadBundleReadme: artifact(uploadBundleReadme, `dist/ebooks/${product.slug}/upload/README.md`),
    uploadBundleChecksums: artifact(uploadBundleChecksums, `dist/ebooks/${product.slug}/upload/SHA256SUMS.txt`),
  };
}

function tableChapterDetails(product) {
  const qaReport = productPath(product, 'qa-report.json');
  if (!fs.existsSync(qaReport)) return [];
  const qa = readJson(qaReport);
  return (qa.chapters || [])
    .filter((chapter) => chapter.tableRendering?.reviewRecommended)
    .map((chapter) => ({
      chapter: chapter.chapter,
      title: chapter.title || '',
      epubEntry: `EPUB/text/chapter-${chapter.chapter}.xhtml`,
      rows: chapter.tableRendering.rows,
      renderedRows: chapter.tableRendering.renderedRows,
      maxCells: chapter.tableRendering.maxCells,
      blankHeaders: chapter.tableRendering.blankHeaders,
      resolvedBlankHeaders: chapter.tableRendering.resolvedBlankHeaders,
      genericLabels: chapter.tableRendering.genericLabels,
      spotCheckRows: chapterTableRowTitles(product, chapter.chapter),
    }));
}

function tableChapters(product) {
  return tableChapterDetails(product).map((chapter) => chapter.chapter);
}

function pendingTableChapterReview(chapter) {
  return {
    chapter: chapter.chapter,
    title: chapter.title,
    epubEntry: `EPUB/text/chapter-${chapter.chapter}.xhtml`,
    rows: chapter.rows,
    renderedRows: chapter.renderedRows,
    maxCells: chapter.maxCells,
    blankHeaders: chapter.blankHeaders,
    resolvedBlankHeaders: chapter.resolvedBlankHeaders,
    genericLabels: chapter.genericLabels,
    spotCheckRows: chapter.spotCheckRows,
    status: 'pending',
    notes: '',
  };
}

function chapterTableRowTitles(product, chapter, limit = 3) {
  const file = chapterPath(product, chapter);
  if (!fs.existsSync(file)) return [];
  const chapterData = readJson(file);
  const rows = (chapterData.content || [])
    .filter((block) => block.type === 'table_row')
    .map((block) => {
      const title = textContent(getTranslation(tableCells(block)[0]));
      return title || null;
    })
    .filter(Boolean)
    .filter((title) => !['state name', 'state'].includes(title.toLowerCase()));
  if (rows.length <= limit) return rows;
  return [rows[0], rows[Math.floor(rows.length / 2)], rows.at(-1)];
}

function templateFor(product) {
  const artifacts = currentArtifactInfo(product);
  const tables = tableChapterDetails(product);
  return {
    schemaVersion: 1,
    slug: product.slug,
    title: product.title || '',
    status: 'pending',
    checkedBy: '',
    checkedAt: '',
    artifacts,
    checks: {
      kindlePreviewer: {
        status: 'pending',
        appVersion: '',
        conversionErrors: null,
        notes: '',
      },
      readerRendering: {
        status: 'pending',
        readers: [],
        lightModeOk: null,
        darkModeOk: null,
        proseFlowTargets: proseFlowTargets(product),
        notes: '',
      },
      coverRendering: {
        status: 'pending',
        onePage: null,
        whiteBandOpaqueInDarkMode: null,
        notes: '',
      },
      navigation: {
        status: 'pending',
        tocOk: null,
        firstMiddleLastChapterLinksOk: null,
        targets: navigationTargets(product),
        notes: '',
      },
      frontmatter: {
        status: 'pending',
        aiDisclosureOk: null,
        sourceAttributionOk: null,
        rightsStatementOk: null,
        notes: '',
      },
      tableHeavyChapters: {
        status: tables.length === 0 ? 'not-applicable' : 'pending',
        chaptersReviewed: tables.map(pendingTableChapterReview),
        notes: '',
      },
      kdpDraft: {
        status: 'pending',
        draftCreated: null,
        fieldsMatchUploadFields: null,
        productDescriptionEntered: null,
        priceEntered: null,
        publishingRightsEntered: null,
        categoriesEntered: null,
        keywordsEntered: null,
        aiDisclosureEntered: null,
        ingestionErrors: null,
        targets: kdpDraftTargets(product),
        notes: '',
      },
    },
  };
}

function initSignoff(product) {
  fs.mkdirSync(QA_DIR, { recursive: true });
  const file = signoffPath(product.slug);
  if (fs.existsSync(file)) {
    const existing = readJson(file);
    if (existing.status !== 'pending') {
      console.log(`Manual QA signoff already exists: ${path.relative(REPO_ROOT, file)}`);
      return;
    }
    const next = {
      ...existing,
      title: product.title || existing.title || '',
      artifacts: currentArtifactInfo(product),
      checks: {
        ...(existing.checks || {}),
        readerRendering: refreshReaderRenderingChecklist(product, existing.checks?.readerRendering),
        navigation: refreshNavigationChecklist(product, existing.checks?.navigation),
        kdpDraft: refreshKdpDraftChecklist(product, existing.checks?.kdpDraft),
        tableHeavyChapters: refreshTableChapterChecklist(product, existing.checks?.tableHeavyChapters),
      },
    };
    fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`Refreshed pending manual QA signoff: ${path.relative(REPO_ROOT, file)}`);
    return;
  }
  fs.writeFileSync(file, `${JSON.stringify(templateFor(product), null, 2)}\n`);
  console.log(`Created pending manual QA signoff: ${path.relative(REPO_ROOT, file)}`);
}

function refreshReaderRenderingChecklist(product, existing = {}) {
  return {
    status: existing.status || 'pending',
    readers: Array.isArray(existing.readers) ? existing.readers : [],
    lightModeOk: existing.lightModeOk ?? null,
    darkModeOk: existing.darkModeOk ?? null,
    proseFlowTargets: proseFlowTargets(product),
    notes: existing.notes || '',
  };
}

function refreshNavigationChecklist(product, existing = {}) {
  return {
    status: existing.status || 'pending',
    tocOk: existing.tocOk ?? null,
    firstMiddleLastChapterLinksOk: existing.firstMiddleLastChapterLinksOk ?? null,
    targets: navigationTargets(product),
    notes: existing.notes || '',
  };
}

function refreshKdpDraftChecklist(product, existing = {}) {
  return {
    status: existing.status || 'pending',
    draftCreated: existing.draftCreated ?? null,
    fieldsMatchUploadFields: existing.fieldsMatchUploadFields ?? null,
    productDescriptionEntered: existing.productDescriptionEntered ?? null,
    priceEntered: existing.priceEntered ?? null,
    publishingRightsEntered: existing.publishingRightsEntered ?? null,
    categoriesEntered: existing.categoriesEntered ?? null,
    keywordsEntered: existing.keywordsEntered ?? null,
    aiDisclosureEntered: existing.aiDisclosureEntered ?? null,
    ingestionErrors: existing.ingestionErrors ?? null,
    targets: kdpDraftTargets(product),
    notes: existing.notes || '',
  };
}

function refreshTableChapterChecklist(product, existing = {}) {
  const chapters = tableChapterDetails(product);
  const existingByChapter = new Map((existing.chaptersReviewed || []).map((item) => [item.chapter, item]));
  return {
    status: chapters.length === 0 ? 'not-applicable' : existing.status || 'pending',
    chaptersReviewed: chapters.map((chapter) => ({
      ...pendingTableChapterReview(chapter),
      status: existingByChapter.get(chapter.chapter)?.status || 'pending',
      notes: existingByChapter.get(chapter.chapter)?.notes || '',
    })),
    notes: existing.notes || '',
  };
}

function assertPassedStatus(errors, label, value, { allowNotApplicable = false } = {}) {
  const allowed = allowNotApplicable ? ['passed', 'not-applicable'] : ['passed'];
  if (!allowed.includes(value)) {
    errors.push(`${label} status is ${JSON.stringify(value)}; expected ${allowed.join(' or ')}.`);
  }
}

function validateBoolean(errors, label, value, expected = true) {
  if (value !== expected) errors.push(`${label} is ${JSON.stringify(value)}; expected ${expected}.`);
}

function validateNonEmptyString(errors, label, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${label} is required.`);
  }
}

function validateSignedArtifact(errors, label, signed, current) {
  if (!current) return;
  if (!signed || typeof signed !== 'object') {
    errors.push(`${label} signed artifact is missing.`);
    return;
  }
  if (signed.file !== current.file) {
    errors.push(`${label} signed artifact file is ${JSON.stringify(signed.file)}; expected ${current.file}.`);
  }
  if (signed.bytes !== current.bytes) {
    errors.push(`${label} signed artifact byte count is ${JSON.stringify(signed.bytes)}; expected ${current.bytes}.`);
  }
  if (signed.sha256 !== current.sha256) {
    errors.push(`${label} signed artifact SHA-256 does not match the current generated artifact.`);
  }
}

function validateProduct(product) {
  const file = signoffPath(product.slug);
  const errors = [];
  if (!fs.existsSync(file)) {
    errors.push(`Missing manual QA signoff: ${path.relative(REPO_ROOT, file)}. Run with --init to create a template.`);
    return errors;
  }

  const signoff = readJson(file);
  const artifacts = currentArtifactInfo(product);
  const checks = signoff.checks || {};
  const tables = tableChapterDetails(product);

  if (signoff.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (signoff.slug !== product.slug) errors.push(`slug mismatch: ${signoff.slug} != ${product.slug}.`);
  assertPassedStatus(errors, 'top-level publication signoff', signoff.status);
  if (!signoff.checkedBy || typeof signoff.checkedBy !== 'string') errors.push('checkedBy is required.');
  if (!isoDateOrEmpty(signoff.checkedAt)) errors.push('checkedAt must be a valid date or ISO timestamp.');

  if (!artifacts.epub) errors.push(`Missing EPUB artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.cover) errors.push(`Missing cover artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.kdpUploadFields) errors.push(`Missing KDP upload fields artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.kdpDraftWorksheet) errors.push(`Missing KDP draft worksheet artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.tableReview) errors.push(`Missing table review artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.reviewChecklist) errors.push(`Missing review checklist artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.uploadChecklist) errors.push(`Missing upload checklist artifact for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.uploadBundleReadme) errors.push(`Missing KDP upload bundle README for ${product.slug}; build it before signoff validation.`);
  if (!artifacts.uploadBundleChecksums) errors.push(`Missing KDP upload bundle checksums for ${product.slug}; build it before signoff validation.`);
  validateSignedArtifact(errors, 'EPUB', signoff.artifacts?.epub, artifacts.epub);
  validateSignedArtifact(errors, 'cover', signoff.artifacts?.cover, artifacts.cover);
  validateSignedArtifact(errors, 'KDP upload fields', signoff.artifacts?.kdpUploadFields, artifacts.kdpUploadFields);
  validateSignedArtifact(errors, 'KDP draft worksheet', signoff.artifacts?.kdpDraftWorksheet, artifacts.kdpDraftWorksheet);
  validateSignedArtifact(errors, 'table review', signoff.artifacts?.tableReview, artifacts.tableReview);
  validateSignedArtifact(errors, 'review checklist', signoff.artifacts?.reviewChecklist, artifacts.reviewChecklist);
  validateSignedArtifact(errors, 'upload checklist', signoff.artifacts?.uploadChecklist, artifacts.uploadChecklist);
  validateSignedArtifact(errors, 'KDP upload bundle README', signoff.artifacts?.uploadBundleReadme, artifacts.uploadBundleReadme);
  validateSignedArtifact(errors, 'KDP upload bundle checksums', signoff.artifacts?.uploadBundleChecksums, artifacts.uploadBundleChecksums);

  assertPassedStatus(errors, 'Kindle Previewer', checks.kindlePreviewer?.status);
  validateNonEmptyString(errors, 'Kindle Previewer appVersion', checks.kindlePreviewer?.appVersion);
  validateBoolean(errors, 'Kindle Previewer conversionErrors', checks.kindlePreviewer?.conversionErrors, false);

  assertPassedStatus(errors, 'reader rendering', checks.readerRendering?.status);
  if (!Array.isArray(checks.readerRendering?.readers) || checks.readerRendering.readers.length === 0) {
    errors.push('readerRendering.readers must list at least one checked reader.');
  } else if (checks.readerRendering.readers.some((reader) => typeof reader !== 'string' || reader.trim() === '')) {
    errors.push('readerRendering.readers must contain non-empty reader names.');
  }
  validateBoolean(errors, 'readerRendering.lightModeOk', checks.readerRendering?.lightModeOk);
  validateBoolean(errors, 'readerRendering.darkModeOk', checks.readerRendering?.darkModeOk);
  if (JSON.stringify(checks.readerRendering?.proseFlowTargets || []) !== JSON.stringify(proseFlowTargets(product))) {
    errors.push('readerRendering.proseFlowTargets are stale; run with --init to refresh them.');
  }

  assertPassedStatus(errors, 'cover rendering', checks.coverRendering?.status);
  validateBoolean(errors, 'coverRendering.onePage', checks.coverRendering?.onePage);
  validateBoolean(errors, 'coverRendering.whiteBandOpaqueInDarkMode', checks.coverRendering?.whiteBandOpaqueInDarkMode);

  assertPassedStatus(errors, 'navigation', checks.navigation?.status);
  validateBoolean(errors, 'navigation.tocOk', checks.navigation?.tocOk);
  validateBoolean(errors, 'navigation.firstMiddleLastChapterLinksOk', checks.navigation?.firstMiddleLastChapterLinksOk);
  if (JSON.stringify(checks.navigation?.targets || []) !== JSON.stringify(navigationTargets(product))) {
    errors.push('navigation.targets are stale; run with --init to refresh them.');
  }

  assertPassedStatus(errors, 'frontmatter', checks.frontmatter?.status);
  validateBoolean(errors, 'frontmatter.aiDisclosureOk', checks.frontmatter?.aiDisclosureOk);
  validateBoolean(errors, 'frontmatter.sourceAttributionOk', checks.frontmatter?.sourceAttributionOk);
  validateBoolean(errors, 'frontmatter.rightsStatementOk', checks.frontmatter?.rightsStatementOk);

  assertPassedStatus(errors, 'table-heavy chapter review', checks.tableHeavyChapters?.status, { allowNotApplicable: true });
  const reviewed = checks.tableHeavyChapters?.chaptersReviewed || [];
  const reviewedByChapter = new Map(reviewed.map((item) => [item.chapter, item]));
  for (const chapter of tables) {
    const item = reviewedByChapter.get(chapter.chapter);
    if (!item) {
      errors.push(`tableHeavyChapters is missing required chapter ${chapter.chapter}.`);
    } else {
      assertPassedStatus(errors, `table-heavy chapter ${chapter.chapter}`, item.status);
      for (const key of ['title', 'epubEntry', 'rows', 'renderedRows', 'maxCells', 'blankHeaders', 'resolvedBlankHeaders', 'genericLabels']) {
        if (item[key] !== chapter[key]) {
          errors.push(`table-heavy chapter ${chapter.chapter} ${key} is ${JSON.stringify(item[key])}; expected current value ${JSON.stringify(chapter[key])}.`);
        }
      }
      if (JSON.stringify(item.spotCheckRows || []) !== JSON.stringify(chapter.spotCheckRows || [])) {
        errors.push(`table-heavy chapter ${chapter.chapter} spotCheckRows are stale; run with --init to refresh them.`);
      }
    }
  }

  assertPassedStatus(errors, 'KDP draft', checks.kdpDraft?.status);
  validateBoolean(errors, 'kdpDraft.draftCreated', checks.kdpDraft?.draftCreated);
  validateBoolean(errors, 'kdpDraft.fieldsMatchUploadFields', checks.kdpDraft?.fieldsMatchUploadFields);
  validateBoolean(errors, 'kdpDraft.productDescriptionEntered', checks.kdpDraft?.productDescriptionEntered);
  validateBoolean(errors, 'kdpDraft.priceEntered', checks.kdpDraft?.priceEntered);
  validateBoolean(errors, 'kdpDraft.publishingRightsEntered', checks.kdpDraft?.publishingRightsEntered);
  validateBoolean(errors, 'kdpDraft.categoriesEntered', checks.kdpDraft?.categoriesEntered);
  validateBoolean(errors, 'kdpDraft.keywordsEntered', checks.kdpDraft?.keywordsEntered);
  validateBoolean(errors, 'kdpDraft.aiDisclosureEntered', checks.kdpDraft?.aiDisclosureEntered);
  validateBoolean(errors, 'kdpDraft.ingestionErrors', checks.kdpDraft?.ingestionErrors, false);
  if (JSON.stringify(checks.kdpDraft?.targets || null) !== JSON.stringify(kdpDraftTargets(product))) {
    errors.push('kdpDraft.targets are stale; run with --init to refresh them.');
  }

  return errors;
}

function statusLabel(value) {
  if (value === 'passed') return 'PASS';
  if (value === 'not-applicable') return 'N/A';
  return 'TODO';
}

function boolLabel(value, expected = true) {
  if (value === expected) return 'PASS';
  return 'TODO';
}

function passTodo(value) {
  return value ? 'PASS' : 'TODO';
}

function automatedReadiness(product, artifacts, qa, manifest) {
  const expectedChapterLinks = Array.isArray(product.chapters) ? product.chapters.length : 0;
  const chapterLinks = navLinks(product).filter((link) => /^text\/chapter-\d{3}\.xhtml$/u.test(link.href));
  const frontmatter = epubEntryText(product, 'EPUB/frontmatter.xhtml');
  const kdpTargets = kdpDraftTargets(product);
  const tableDetails = tableChapterDetails(product);
  const allArtifactsPresent = Object.values(artifacts).every(Boolean);
  const qaClean = qa && (qa.errors?.length || 0) === 0 && (qa.warnings?.length || 0) === 0;
  const coverOpaque = qa?.coverImage?.alpha?.fullyOpaque === true;
  const tocComplete = expectedChapterLinks > 0 && chapterLinks.length === expectedChapterLinks;
  const frontmatterComplete = /(AI tools|AI-assisted)/iu.test(frontmatter)
    && /Chinese source texts/iu.test(frontmatter)
    && /(All rights reserved|English translation and edition are copyright)/iu.test(frontmatter);
  const kdpTargetsComplete = Boolean(kdpTargets)
    && Boolean(kdpTargets.title)
    && Boolean(kdpTargets.productDescription)
    && Boolean(kdpTargets.suggestedListPriceUsd)
    && (kdpTargets.categories || []).length === 3
    && (kdpTargets.keywords || []).length === 7;
  const tableTargetsCurrent = tableDetails.every((chapter) => (
    chapter.epubEntry
    && Number.isFinite(chapter.rows)
    && Number.isFinite(chapter.renderedRows)
    && Array.isArray(chapter.spotCheckRows)
    && chapter.spotCheckRows.length > 0
  ));

  return {
    allArtifactsPresent,
    qaClean: Boolean(qaClean),
    coverOpaque,
    tocComplete,
    tocChapterLinks: chapterLinks.length,
    expectedChapterLinks,
    frontmatterComplete,
    kdpTargetsComplete,
    tableTargetsCurrent,
    publicationManifestGenerated: Boolean(manifest?.generatedAt),
    publicationManifestGeneratedAt: manifest?.generatedAt || null,
  };
}

function printAutomatedReadiness(product, artifacts, qa, manifest) {
  const readiness = automatedReadiness(product, artifacts, qa, manifest);
  console.log('## Automated Readiness');
  console.log(`- ${passTodo(readiness.allArtifactsPresent)} all signed artifacts exist and have current hashes`);
  console.log(`- ${passTodo(readiness.qaClean)} automated EPUB QA has zero errors and zero warnings`);
  console.log(`- ${passTodo(readiness.coverOpaque)} cover image is fully opaque for dark-mode readers`);
  console.log(`- ${passTodo(readiness.tocComplete)} EPUB TOC has ${readiness.tocChapterLinks}/${readiness.expectedChapterLinks} chapter links`);
  console.log(`- ${passTodo(readiness.frontmatterComplete)} frontmatter includes AI disclosure, source attribution, and rights statement`);
  console.log(`- ${passTodo(readiness.kdpTargetsComplete)} KDP target fields are complete, including 3 categories and 7 keywords`);
  console.log(`- ${passTodo(readiness.tableTargetsCurrent)} table-heavy chapter review targets are generated`);
  console.log(`- ${readiness.publicationManifestGenerated ? 'PASS' : 'TODO'} publication manifest generated timestamp: ${readiness.publicationManifestGeneratedAt || 'missing'}`);
  console.log('');
}

function printEvidence(product) {
  const qa = qaReport(product);
  const manifest = publicationManifest(product);
  const kdpFields = kdpUploadFields(product);
  const frontmatter = epubEntryText(product, 'EPUB/frontmatter.xhtml');
  const frontmatterParagraphs = tagTexts(frontmatter, 'p');
  const links = navLinks(product);
  const chapterLinks = links.filter((link) => /^text\/chapter-\d{3}\.xhtml$/u.test(link.href));
  const targets = navigationTargets(product);

  console.log('## Artifact Evidence');
  console.log(`- Upload manuscript file: dist/ebooks/${product.slug}/${product.slug}.epub`);
  console.log(`- Upload cover file: dist/ebooks/${product.slug}/cover.png`);
  console.log(`- Support upload-field source: dist/ebooks/${product.slug}/kdp-upload-fields.json`);
  console.log(`- KDP draft worksheet: dist/ebooks/${product.slug}/kdp-draft-worksheet.md`);
  console.log(`- Support table-review source: dist/ebooks/${product.slug}/table-review.md`);
  console.log(`- EPUB manifest generated: ${manifest?.generatedAt || 'missing'}`);
  console.log(`- Automated QA errors/warnings: ${qa ? `${qa.errors?.length || 0}/${qa.warnings?.length || 0}` : 'missing qa-report.json'}`);
  console.log(`- Cover: ${qa?.coverImage ? `${qa.coverImage.width}x${qa.coverImage.height}, opaque=${qa.coverImage.alpha?.fullyOpaque === true}` : 'missing cover QA'}`);
  console.log(`- EPUB chapter links in TOC: ${chapterLinks.length}`);
  for (const link of targets) {
    console.log(`  - ${link.href}: ${link.text}`);
  }
  console.log('');

  console.log('## Frontmatter Evidence');
  for (const paragraph of frontmatterParagraphs) {
    if (/(AI tools|Chinese source texts|All rights reserved|English translation)/iu.test(paragraph)) {
      console.log(`- ${paragraph}`);
    }
  }
  console.log('');

  console.log('## KDP Draft Evidence');
  if (!kdpFields) {
    console.log('- Missing kdp-upload-fields.json');
  } else {
    console.log(`- Title: ${kdpFields.product?.title || ''}`);
    if (kdpFields.product?.subtitle) console.log(`- Subtitle: ${kdpFields.product.subtitle}`);
    for (const contributor of kdpFields.product?.contributors || []) {
      console.log(`- ${contributor.role}: ${contributor.name}`);
    }
    console.log(`- Publisher: ${kdpFields.product?.publisher || ''}`);
    console.log(`- Language: ${kdpFields.product?.language || ''}`);
    console.log(`- Series: ${kdpFields.product?.series || ''}`);
    console.log(`- Series number: ${kdpFields.product?.seriesNumber ?? ''}`);
    console.log(`- ISBN: ${kdpFields.product?.isbn?.instruction || ''}`);
    console.log(`- Edition: ${kdpFields.product?.edition || ''}`);
    console.log(`- Rights: ${kdpFields.product?.rights || ''}`);
    console.log(`- Suggested list price USD: ${kdpFields.kdp?.suggestedListPriceUsd || ''}`);
    console.log(`- Publishing rights: ${kdpFields.kdp?.publishingRights || ''}`);
    console.log(`- AI-generated content: ${kdpFields.kdp?.aiGeneratedContent || ''}`);
    console.log(`- Product description: ${kdpFields.kdp?.productDescription || ''}`);
    console.log('- Categories:');
    for (const category of kdpFields.kdp?.categories || []) console.log(`  - ${category}`);
    console.log('- Keywords:');
    for (const keyword of kdpFields.kdp?.keywords || []) console.log(`  - ${keyword}`);
  }
  console.log('');
}

function printManualReport(product) {
  const file = signoffPath(product.slug);
  const signoff = fs.existsSync(file) ? readJson(file) : templateFor(product);
  const checks = signoff.checks || {};
  const artifacts = currentArtifactInfo(product);
  const tables = checks.tableHeavyChapters?.chaptersReviewed || [];

  console.log(`# Manual Publication QA: ${product.title || product.slug}`);
  console.log('');
  console.log(`Signoff file: ${path.relative(REPO_ROOT, file)}`);
  console.log(`EPUB: ${artifacts.epub?.file || 'missing'}`);
  console.log(`EPUB bytes: ${artifacts.epub?.bytes ?? 'missing'}`);
  console.log(`EPUB SHA-256: ${artifacts.epub?.sha256 || 'missing'}`);
  console.log(`Cover: ${artifacts.cover?.file || 'missing'}`);
  console.log(`Cover bytes: ${artifacts.cover?.bytes ?? 'missing'}`);
  console.log(`Cover SHA-256: ${artifacts.cover?.sha256 || 'missing'}`);
  console.log(`KDP upload fields: ${artifacts.kdpUploadFields?.file || 'missing'}`);
  console.log(`KDP upload fields bytes: ${artifacts.kdpUploadFields?.bytes ?? 'missing'}`);
  console.log(`KDP upload fields SHA-256: ${artifacts.kdpUploadFields?.sha256 || 'missing'}`);
  console.log(`KDP draft worksheet: ${artifacts.kdpDraftWorksheet?.file || 'missing'}`);
  console.log(`KDP draft worksheet bytes: ${artifacts.kdpDraftWorksheet?.bytes ?? 'missing'}`);
  console.log(`KDP draft worksheet SHA-256: ${artifacts.kdpDraftWorksheet?.sha256 || 'missing'}`);
  console.log(`Table review: ${artifacts.tableReview?.file || 'missing'}`);
  console.log(`Table review bytes: ${artifacts.tableReview?.bytes ?? 'missing'}`);
  console.log(`Table review SHA-256: ${artifacts.tableReview?.sha256 || 'missing'}`);
  console.log(`Review checklist: ${artifacts.reviewChecklist?.file || 'missing'}`);
  console.log(`Review checklist bytes: ${artifacts.reviewChecklist?.bytes ?? 'missing'}`);
  console.log(`Review checklist SHA-256: ${artifacts.reviewChecklist?.sha256 || 'missing'}`);
  console.log(`Upload checklist: ${artifacts.uploadChecklist?.file || 'missing'}`);
  console.log(`Upload checklist bytes: ${artifacts.uploadChecklist?.bytes ?? 'missing'}`);
  console.log(`Upload checklist SHA-256: ${artifacts.uploadChecklist?.sha256 || 'missing'}`);
  console.log(`KDP upload bundle README: ${artifacts.uploadBundleReadme?.file || 'missing'}`);
  console.log(`KDP upload bundle README bytes: ${artifacts.uploadBundleReadme?.bytes ?? 'missing'}`);
  console.log(`KDP upload bundle README SHA-256: ${artifacts.uploadBundleReadme?.sha256 || 'missing'}`);
  console.log(`KDP upload bundle checksums: ${artifacts.uploadBundleChecksums?.file || 'missing'}`);
  console.log(`KDP upload bundle checksums bytes: ${artifacts.uploadBundleChecksums?.bytes ?? 'missing'}`);
  console.log(`KDP upload bundle checksums SHA-256: ${artifacts.uploadBundleChecksums?.sha256 || 'missing'}`);
  console.log('');

  printEvidence(product);
  printAutomatedReadiness(product, artifacts, qaReport(product), publicationManifest(product));

  console.log('## Required Fields');
  console.log(`- ${statusLabel(signoff.status)} top-level status: set status to "passed" after all sections pass`);
  console.log(`- ${signoff.checkedBy ? 'PASS' : 'TODO'} checkedBy`);
  console.log(`- ${isoDateOrEmpty(signoff.checkedAt) ? 'PASS' : 'TODO'} checkedAt`);
  console.log('');

  console.log('## Required Manual Checks');
  console.log(`- ${statusLabel(checks.kindlePreviewer?.status)} Kindle Previewer status`);
  console.log(`- ${checks.kindlePreviewer?.appVersion ? 'PASS' : 'TODO'} Kindle Previewer appVersion`);
  console.log(`- ${boolLabel(checks.kindlePreviewer?.conversionErrors, false)} Kindle Previewer conversionErrors=false`);
  console.log(`- ${statusLabel(checks.readerRendering?.status)} reader rendering status`);
  console.log(`- ${Array.isArray(checks.readerRendering?.readers) && checks.readerRendering.readers.length > 0 ? 'PASS' : 'TODO'} readerRendering.readers lists checked app(s)`);
  console.log(`- ${boolLabel(checks.readerRendering?.lightModeOk)} readerRendering.lightModeOk=true`);
  console.log(`- ${boolLabel(checks.readerRendering?.darkModeOk)} readerRendering.darkModeOk=true`);
  console.log('  Prose-flow targets to skim:');
  for (const target of checks.readerRendering?.proseFlowTargets || proseFlowTargets(product)) {
    console.log(`  - ${target.epubEntry}: ${target.title}`);
  }
  console.log(`- ${statusLabel(checks.coverRendering?.status)} cover rendering status`);
  console.log(`- ${boolLabel(checks.coverRendering?.onePage)} coverRendering.onePage=true`);
  console.log(`- ${boolLabel(checks.coverRendering?.whiteBandOpaqueInDarkMode)} coverRendering.whiteBandOpaqueInDarkMode=true`);
  console.log(`- ${statusLabel(checks.navigation?.status)} navigation status`);
  console.log(`- ${boolLabel(checks.navigation?.tocOk)} navigation.tocOk=true`);
  console.log(`- ${boolLabel(checks.navigation?.firstMiddleLastChapterLinksOk)} navigation.firstMiddleLastChapterLinksOk=true`);
  console.log('  Navigation targets to open:');
  for (const target of checks.navigation?.targets || navigationTargets(product)) {
    console.log(`  - ${target.href}: ${target.text}`);
  }
  console.log(`- ${statusLabel(checks.frontmatter?.status)} frontmatter status`);
  console.log(`- ${boolLabel(checks.frontmatter?.aiDisclosureOk)} frontmatter.aiDisclosureOk=true`);
  console.log(`- ${boolLabel(checks.frontmatter?.sourceAttributionOk)} frontmatter.sourceAttributionOk=true`);
  console.log(`- ${boolLabel(checks.frontmatter?.rightsStatementOk)} frontmatter.rightsStatementOk=true`);
  console.log(`- ${statusLabel(checks.kdpDraft?.status)} KDP draft status`);
  console.log(`- ${boolLabel(checks.kdpDraft?.draftCreated)} kdpDraft.draftCreated=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.fieldsMatchUploadFields)} kdpDraft.fieldsMatchUploadFields=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.productDescriptionEntered)} kdpDraft.productDescriptionEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.priceEntered)} kdpDraft.priceEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.publishingRightsEntered)} kdpDraft.publishingRightsEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.categoriesEntered)} kdpDraft.categoriesEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.keywordsEntered)} kdpDraft.keywordsEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.aiDisclosureEntered)} kdpDraft.aiDisclosureEntered=true`);
  console.log(`- ${boolLabel(checks.kdpDraft?.ingestionErrors, false)} kdpDraft.ingestionErrors=false`);
  const kdpTargets = checks.kdpDraft?.targets || kdpDraftTargets(product);
  if (kdpTargets) {
    console.log('  KDP field targets:');
    console.log(`  - Title: ${kdpTargets.title}`);
    if (kdpTargets.subtitle) console.log(`  - Subtitle: ${kdpTargets.subtitle}`);
    console.log(`  - Price USD: ${kdpTargets.suggestedListPriceUsd}`);
    console.log(`  - Categories: ${(kdpTargets.categories || []).join(' | ')}`);
    console.log(`  - Keywords: ${(kdpTargets.keywords || []).join(' | ')}`);
  }
  console.log('');

  console.log('## Table-Heavy Chapter Spot Checks');
  console.log(`Overall table review: ${statusLabel(checks.tableHeavyChapters?.status)}`);
  for (const chapter of tables) {
    console.log(`- ${statusLabel(chapter.status)} ${chapter.chapter} ${chapter.title}`);
    console.log(`  - EPUB entry: ${chapter.epubEntry || `EPUB/text/chapter-${chapter.chapter}.xhtml`}`);
    for (const row of chapter.spotCheckRows || []) {
      console.log(`  - ${row}`);
    }
  }
  console.log('');
  console.log('## Final Command');
  console.log(`make ebook-qa SLUG=${product.slug} REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1`);
}

function signoffSummary(product) {
  const file = signoffPath(product.slug);
  const signoff = fs.existsSync(file) ? readJson(file) : null;
  const artifacts = currentArtifactInfo(product);
  const errors = validateProduct(product);
  const checks = signoff?.checks || {};
  const manualSections = {
    kindlePreviewer: checks.kindlePreviewer?.status || 'missing',
    readerRendering: checks.readerRendering?.status || 'missing',
    coverRendering: checks.coverRendering?.status || 'missing',
    navigation: checks.navigation?.status || 'missing',
    frontmatter: checks.frontmatter?.status || 'missing',
    tableHeavyChapters: checks.tableHeavyChapters?.status || 'missing',
    kdpDraft: checks.kdpDraft?.status || 'missing',
  };
  return {
    slug: product.slug,
    title: product.title || '',
    signoffFile: path.relative(REPO_ROOT, file),
    status: signoff?.status || 'missing',
    checkedBy: signoff?.checkedBy || '',
    checkedAt: signoff?.checkedAt || '',
    passed: errors.length === 0,
    automatedReadiness: automatedReadiness(product, artifacts, qaReport(product), publicationManifest(product)),
    artifacts,
    manualSections,
    pendingHumanChecks: errors,
  };
}

const opts = parseArgs(process.argv.slice(2));
const manifest = readManifest();
const products = opts.all
  ? (manifest.products || [])
  : (manifest.products || []).filter((product) => product.slug === opts.slug);

if (products.length === 0) {
  console.error(`No e-book product found for ${opts.all ? '--all' : opts.slug}.`);
  process.exit(1);
}

if (opts.init) {
  for (const product of products) initSignoff(product);
  process.exit(0);
}

if (opts.report) {
  for (const product of products) printManualReport(product);
  process.exit(0);
}

if (opts.json) {
  const summaries = products.map(signoffSummary);
  console.log(JSON.stringify({
    passed: summaries.every((summary) => summary.passed),
    products: summaries,
  }, null, 2));
  process.exit(summaries.every((summary) => summary.passed) ? 0 : 1);
}

let failures = 0;
for (const product of products) {
  const errors = validateProduct(product);
  if (errors.length > 0) {
    failures += 1;
    console.error(`Manual QA signoff incomplete for ${product.slug}:`);
    for (const error of errors) console.error(`- ${error}`);
  } else {
    console.log(`Manual QA signoff passed for ${product.slug}.`);
  }
}

if (failures > 0) process.exit(1);
