#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { getBookMetadata } from './book-metadata.mjs';
import { renderBookCover } from './generate-book-covers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'ebooks', 'manifest.json');
const outRoot = path.join(repoRoot, 'dist', 'ebooks');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    if (key === 'all' || key === 'all-volumes') {
      args[key] = true;
    } else {
      args[key] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function writeBinaryFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function textContent(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function formatList(values) {
  const items = values.map(textContent).filter(Boolean);
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function getTranslation(item) {
  if (!item) return '';
  if (typeof item.idiomatic === 'string' && item.idiomatic.trim()) return item.idiomatic.trim();
  if (typeof item.literal === 'string' && item.literal.trim()) return item.literal.trim();
  if (typeof item.translation === 'string' && item.translation.trim()) return item.translation.trim();
  const translation = item.translations?.find((entry) => entry.lang === 'en') || item.translations?.[0];
  return textContent(translation?.idiomatic || translation?.literal || translation?.text || '');
}

function getParagraphTranslations(block) {
  const sentenceTexts = (block.sentences || []).map(getTranslation).map(textContent).filter(Boolean);
  if (sentenceTexts.length > 0) return sentenceTexts;
  const text = textContent(getTranslation(block));
  return text ? [text] : [];
}

function wordCount(value) {
  const text = textContent(value);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function splitParagraphSentences(sentences, maxWords = 220) {
  const chunks = [];
  let current = [];
  let currentWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = wordCount(sentence);
    if (current.length > 0 && currentWords + sentenceWords > maxWords) {
      chunks.push(current.join(' '));
      current = [];
      currentWords = 0;
    }
    current.push(sentence);
    currentWords += sentenceWords;
  }

  if (current.length > 0) chunks.push(current.join(' '));
  return chunks;
}

function recordCjkOccurrence(qa, chapter, blockIndex, text, allowed) {
  qa.cjkBodyOccurrences.push({
    chapter: chapter.meta.chapter,
    block: blockIndex + 1,
    allowed,
    excerpt: text.slice(0, 240)
  });
}

function tableFieldLabel(headers, cellIndex) {
  const header = textContent(headers[cellIndex] || '');
  return header;
}

function renderTableHeaderSummary(headers) {
  const labels = headers.map(textContent).filter(Boolean);
  if (labels.length === 0) return '';
  return `<p class="table-column-summary">Columns: ${labels.map(escapeXml).join('; ')}</p>`;
}

function inferInitialTableHeaders(chapter) {
  if (chapter?.meta?.book === 'shiji' && chapter?.meta?.chapter === '013') {
    return ['Zhou', 'Lu', 'Qi', 'Jin', 'Qin', 'Chu', 'Song', 'Wei', 'Chen', 'Cai', 'Cao', 'Yan'];
  }
  return [];
}

function renderTableEntry(block, headers, chapter, blockIndex, rowNumber, qa) {
  const fields = (block.cells || [])
    .map((cell, cellIndex) => {
      const text = textContent(getTranslation(cell));
      if (!text && textContent(cell.content || cell.zh)) {
        qa.errors.push(`Missing table cell translation in ${chapter.meta.chapter} block ${blockIndex + 1} cell ${cellIndex + 1}`);
      }
      if (hasPlaceholder(text)) {
        qa.errors.push(`Placeholder text in ${chapter.meta.chapter} block ${blockIndex + 1} cell ${cellIndex + 1}`);
      }
      if (!text) return null;
      return {
        label: tableFieldLabel(headers, cellIndex),
        text
      };
    })
    .filter(Boolean);

  if (fields.length === 0) return '';

  const titleField = fields[0];
  const details = fields.slice(1)
    .map((field) => {
      if (!field.label) return `<dd class="table-entry-unlabeled">${escapeXml(field.text)}</dd>`;
      return `<dt>${escapeXml(field.label)}</dt><dd>${escapeXml(field.text)}</dd>`;
    })
    .join('');
  const fallbackTitle = `Table row ${rowNumber}`;
  const title = titleField?.text || fallbackTitle;
  const titleLabel = titleField?.label ? `<span class="table-entry-kicker">${escapeXml(titleField.label)}</span>` : '';
  const detailList = details ? `\n  <dl>${details}</dl>` : '';

  return `<section class="table-entry">
  <h3>${titleLabel}${escapeXml(title)}</h3>${detailList}
</section>`;
}

function hasPlaceholder(value) {
  return /\(no translation available\)|\[translation\]|\bTODO\b/i.test(value);
}

function hasCjk(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function allowsChineseCharacters(item) {
  return item?.allowChineseCharacters === true ||
    item?.translations?.some((entry) => entry.allowChineseCharacters === true) === true;
}

function chapterFileName(chapterId) {
  return `chapter-${chapterId}.xhtml`;
}

function packageDate() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function productId(product) {
  const hex = crypto.createHash('sha1').update(product.slug).digest('hex');
  return `urn:uuid:${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function validateProductMetadata(product, qa) {
  const requiredFields = [
    'slug',
    'book',
    'title',
    'subtitle',
    'author',
    'translator',
    'publisher',
    'rights',
    'description',
    'productDescription',
    'aiDisclosure',
    'editionStatus'
  ];
  for (const field of requiredFields) {
    if (!textContent(product[field])) {
      qa.errors.push(`Missing e-book product metadata field: ${field}`);
    }
  }

  if (!Array.isArray(product.sourceAttribution) || product.sourceAttribution.map(textContent).filter(Boolean).length === 0) {
    qa.errors.push('Missing e-book source attribution metadata.');
  }

  const kdp = product.kdp || {};
  if (!textContent(kdp.suggestedListPriceUsd)) qa.warnings.push('Missing KDP suggested USD list price.');
  if (!textContent(kdp.publishingRights)) qa.warnings.push('Missing KDP publishing-rights note.');
  if (!textContent(kdp.aiGeneratedContent)) qa.warnings.push('Missing KDP AI-generated-content disclosure note.');
  const categories = Array.isArray(kdp.categories) ? kdp.categories.map(textContent).filter(Boolean) : [];
  if (categories.length === 0) qa.warnings.push('Missing KDP category suggestions.');
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords.map(textContent).filter(Boolean) : [];
  if (keywords.length < 7) qa.warnings.push(`KDP keyword list has ${keywords.length} entries; expected 7.`);
  if (keywords.length > 7) qa.warnings.push(`KDP keyword list has ${keywords.length} entries; KDP accepts 7 keyword slots.`);
}

function loadProducts(args) {
  const manifest = readJson(manifestPath);
  const products = manifest.products || [];
  if (args.all) return products;
  if (!args.book) {
    throw new Error('Missing --book. Use --book shiji --volume 001, --book shiji --all-volumes, or --all.');
  }
  const matches = products.filter((product) => product.book === args.book);
  if (args['all-volumes']) return matches;
  if (args.volume) {
    const requested = Number.parseInt(args.volume, 10);
    return matches.filter((product) => product.volume === requested);
  }
  throw new Error('Missing --volume or --all-volumes.');
}

function collectChapterBlocks(chapter, qa) {
  const blocks = [];
  let currentHeaders = inferInitialTableHeaders(chapter);
  let tableRowNumber = 0;

  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    if (block.type === 'paragraph') {
      const sentences = getParagraphTranslations(block);
      const text = textContent(sentences.join(' '));
      if (!text && (block.sentences || []).length > 0) {
        qa.errors.push(`Missing paragraph translation in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      if (hasPlaceholder(text)) {
        qa.errors.push(`Placeholder text in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      if (hasCjk(text) && !allowsChineseCharacters(block) && !(block.sentences || []).some(allowsChineseCharacters)) {
        qa.warnings.push(`Chinese characters in English paragraph in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      if (hasCjk(text)) {
        recordCjkOccurrence(
          qa,
          chapter,
          blockIndex,
          text,
          allowsChineseCharacters(block) || (block.sentences || []).some(allowsChineseCharacters)
        );
      }
      if (text) {
        const chunks = splitParagraphSentences(sentences);
        if (chunks.length > 1) qa.paragraphRendering.splits += chunks.length - 1;
        for (const chunk of chunks) {
          const chunkWords = wordCount(chunk);
          if (chunkWords > qa.paragraphRendering.maxWords) qa.paragraphRendering.maxWords = chunkWords;
          if (chunkWords > 350) {
            qa.paragraphRendering.longParagraphs += 1;
            qa.warnings.push(`Long rendered paragraph in ${chapter.meta.chapter} block ${blockIndex + 1}: ${chunkWords} words`);
          }
          blocks.push(`<p>${escapeXml(chunk)}</p>`);
        }
      }
      continue;
    }

    if (block.type === 'table_header') {
      currentHeaders = (block.sentences || []).map(getTranslation).map(textContent);
      tableRowNumber = 0;
      const summary = renderTableHeaderSummary(currentHeaders);
      if (summary) blocks.push(summary);
      qa.tableRendering.headers += 1;
      continue;
    }

    if (block.type === 'table_row') {
      tableRowNumber += 1;
      const entry = renderTableEntry(block, currentHeaders, chapter, blockIndex, tableRowNumber, qa);
      if (entry) blocks.push(entry);
      qa.tableRendering.rows += 1;
      continue;
    }

    qa.warnings.push(`Unsupported block type "${block.type}" in ${chapter.meta.chapter} block ${blockIndex + 1}`);
  }

  return blocks;
}

function renderChapter(chapter, qa) {
  const chapterId = chapter.meta.chapter;
  const zhTitle = chapter.meta.title?.zh || `Chapter ${chapterId}`;
  const enTitle = chapter.meta.title?.en || `Chapter ${Number.parseInt(chapterId, 10)}`;
  const blocks = collectChapterBlocks(chapter, qa);
  if (blocks.length === 0) qa.errors.push(`No rendered English content for chapter ${chapterId}`);

  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${escapeXml(enTitle)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/ebook.css" />
</head>
<body>
  <section epub:type="chapter">
    <h1>${escapeXml(enTitle)}</h1>
    <p class="chapter-kicker">${escapeXml(zhTitle)} - Chapter ${escapeXml(chapterId)}</p>
    ${blocks.join('\n    ')}
  </section>
</body>
</html>
`;
}

function renderCover(product, bookInfo) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <title>${escapeXml(product.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles/ebook.css" />
</head>
<body class="cover-page">
  <div class="cover-image-wrap">
    <img class="cover-image" src="images/cover.png" alt="${escapeXml(product.title)} cover" />
  </div>
</body>
</html>
`;
}

function renderCoverPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1600
    }
  });
  return resvg.render().asPng();
}

function renderFrontMatter(product, bookInfo) {
  const sources = formatList(product.sourceAttribution || []);
  const aiDisclosure = product.aiDisclosure || 'This English translation was generated with AI tools under the direction and editorial supervision of Garrett M. Petersen.';
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>Copyright</title>
  <link rel="stylesheet" type="text/css" href="styles/ebook.css" />
</head>
<body>
  <section epub:type="frontmatter">
    <h1>${escapeXml(product.title)}</h1>
    ${product.subtitle ? `<h2>${escapeXml(product.subtitle)}</h2>` : ''}
    <p>Original work: ${escapeXml(bookInfo.chinese || '')} (${escapeXml(bookInfo.pinyin || '')}), by ${escapeXml(product.author)}.</p>
    <p>English translation: ${escapeXml(product.translator)}.</p>
    <p>${escapeXml(product.rights || '')}</p>
    <p>${escapeXml(aiDisclosure)}</p>
    <p>Chinese source texts were drawn from ${escapeXml(sources)}.</p>
    <p>Edition status: ${escapeXml(product.editionStatus || '')}.</p>
  </section>
</body>
</html>
`;
}

function renderNav(product, chapters) {
  const chapterItems = chapters.map(({ chapter, data }) => {
    const title = data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`;
    return `<li><a href="text/${chapterFileName(chapter)}">${escapeXml(title)}</a></li>`;
  }).join('\n      ');

  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="styles/ebook.css" />
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Contents</h1>
    <ol>
      <li><a href="cover.xhtml">Cover</a></li>
      <li><a href="frontmatter.xhtml">Copyright and Source Note</a></li>
      ${chapterItems}
    </ol>
  </nav>
</body>
</html>
`;
}

function renderPackage(product, chapters) {
  const items = chapters.map(({ chapter }) => `    <item id="chapter-${chapter}" href="text/${chapterFileName(chapter)}" media-type="application/xhtml+xml" />`).join('\n');
  const spine = chapters.map(({ chapter }) => `    <itemref idref="chapter-${chapter}" />`).join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${escapeXml(productId(product))}</dc:identifier>
    <dc:title id="title">${escapeXml(product.title)}</dc:title>
    ${product.subtitle ? `<dc:title id="subtitle">${escapeXml(product.subtitle)}</dc:title>
    <meta refines="#title" property="title-type">main</meta>
    <meta refines="#subtitle" property="title-type">subtitle</meta>` : '<meta refines="#title" property="title-type">main</meta>'}
    <dc:language>${escapeXml(product.language || 'en')}</dc:language>
    <dc:creator>${escapeXml(product.author)}</dc:creator>
    <dc:contributor id="translator">${escapeXml(product.translator)}</dc:contributor>
    <dc:publisher>${escapeXml(product.publisher || '')}</dc:publisher>
    <dc:rights>${escapeXml(product.rights || '')}</dc:rights>
    <dc:description>${escapeXml(product.description || '')}</dc:description>
    <meta property="dcterms:modified">${packageDate()}</meta>
    <meta property="belongs-to-collection" id="series">${escapeXml(product.series || product.title)}</meta>
    <meta refines="#series" property="collection-type">series</meta>
    <meta property="group-position">${escapeXml(product.seriesNumber || product.volume || 1)}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="css" href="styles/ebook.css" media-type="text/css" />
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />
    <item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image" />
    <item id="frontmatter" href="frontmatter.xhtml" media-type="application/xhtml+xml" />
${items}
  </manifest>
  <spine>
    <itemref idref="cover" />
    <itemref idref="frontmatter" />
${spine}
  </spine>
</package>
`;
}

function renderCss() {
  return `body {
  color: #1d1c18;
  font-family: serif;
  line-height: 1.45;
  margin: 0;
  padding: 1em;
}

h1, h2 {
  line-height: 1.15;
}

p {
  margin: 0 0 0.85em;
  text-indent: 1.25em;
}

.chapter-kicker {
  color: #59554b;
  font-size: 0.9em;
  margin-bottom: 1.5em;
  text-indent: 0;
}

.cover-page {
  background: #ffffff;
  padding: 0;
}

.cover-image-wrap {
  background: #ffffff;
  box-sizing: border-box;
  margin: 0 auto;
  page-break-after: always;
  page-break-inside: avoid;
  text-align: center;
}

.cover-image {
  background: #ffffff;
  display: block;
  height: auto;
  margin: 0 auto;
  max-height: 99vh;
  max-width: 100%;
  width: auto;
}

.table-column-summary {
  color: #59554b;
  font-size: 0.9em;
  margin: 1.25em 0;
  text-indent: 0;
}

.table-entry {
  border-top: 0.08em solid #d8d2c4;
  margin: 1.15em 0 0;
  padding-top: 0.8em;
  page-break-inside: avoid;
}

.table-entry h3 {
  font-size: 1.05em;
  line-height: 1.2;
  margin: 0 0 0.55em;
}

.table-entry-kicker {
  color: #6b665b;
  display: block;
  font-size: 0.72em;
  font-weight: normal;
  letter-spacing: 0.04em;
  margin-bottom: 0.2em;
  text-transform: uppercase;
}

.table-entry dl {
  margin: 0;
}

.table-entry dt {
  color: #5c574f;
  font-weight: bold;
  margin: 0.25em 0 0.05em;
}

.table-entry dd {
  margin: 0 0 0.42em 1em;
}

.table-entry-unlabeled {
  margin-left: 0;
}
`;
}

function renderContainer() {
  return `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function zipEpub(buildDir, epubPath) {
  fs.rmSync(epubPath, { force: true });
  childProcess.execFileSync('zip', ['-X0', epubPath, 'mimetype'], { cwd: buildDir, stdio: 'ignore' });
  childProcess.execFileSync('zip', ['-Xr9D', epubPath, 'META-INF', 'EPUB'], { cwd: buildDir, stdio: 'ignore' });
}

function buildProduct(product) {
  const bookInfo = getBookMetadata(product.book) || {};
  const productDir = path.join(outRoot, product.slug);
  const buildDir = path.join(productDir, 'content');
  const epubPath = path.join(productDir, `${product.slug}.epub`);
  const qa = {
    slug: product.slug,
    generatedAt: new Date().toISOString(),
    errors: [],
    warnings: [],
    tableRendering: {
      headers: 0,
      rows: 0
    },
    paragraphRendering: {
      splits: 0,
      maxWords: 0,
      longParagraphs: 0
    },
    cjkBodyOccurrences: [],
    chapters: []
  };

  validateProductMetadata(product, qa);

  cleanDir(buildDir);
  fs.mkdirSync(productDir, { recursive: true });

  writeFile(path.join(buildDir, 'mimetype'), 'application/epub+zip');
  writeFile(path.join(buildDir, 'META-INF', 'container.xml'), renderContainer());
  writeFile(path.join(buildDir, 'EPUB', 'styles', 'ebook.css'), renderCss());
  const coverSvg = renderBookCover(product.book);
  const coverPng = renderCoverPng(coverSvg);
  writeFile(path.join(buildDir, 'EPUB', 'cover.xhtml'), renderCover(product, bookInfo));
  writeBinaryFile(path.join(buildDir, 'EPUB', 'images', 'cover.png'), coverPng);
  writeFile(path.join(buildDir, 'EPUB', 'frontmatter.xhtml'), renderFrontMatter(product, bookInfo));

  const chapters = product.chapters.map((chapter) => {
    const file = path.join(repoRoot, 'data', product.book, `${chapter}.json`);
    const data = readJson(file);
    const chapterTitle = textContent(data.meta.title?.en || '');
    qa.chapters.push({
      chapter,
      title: chapterTitle,
      sentenceCount: data.meta.sentenceCount || 0,
      translatedCount: data.meta.translatedCount || 0
    });
    if (!chapterTitle) {
      qa.errors.push(`Missing English chapter title for ${product.book}/${chapter}`);
    }
    if ((data.meta.sentenceCount || 0) !== (data.meta.translatedCount || 0)) {
      qa.errors.push(`Chapter ${chapter} is not fully translated: ${data.meta.translatedCount}/${data.meta.sentenceCount}`);
    }
    return { chapter, data };
  });

  const titleToChapters = new Map();
  for (const { chapter, data } of chapters) {
    const title = textContent(data.meta.title?.en || '');
    if (!title) continue;
    titleToChapters.set(title, [...(titleToChapters.get(title) || []), chapter]);
  }
  for (const [title, chapterIds] of titleToChapters.entries()) {
    if (chapterIds.length > 1) {
      qa.warnings.push(`Repeated English chapter title "${title}" in ${product.book}: ${chapterIds.join(', ')}`);
    }
  }

  for (const chapter of chapters) {
    writeFile(
      path.join(buildDir, 'EPUB', 'text', chapterFileName(chapter.chapter)),
      renderChapter(chapter.data, qa)
    );
  }

  writeFile(path.join(buildDir, 'EPUB', 'nav.xhtml'), renderNav(product, chapters));
  writeFile(path.join(buildDir, 'EPUB', 'package.opf'), renderPackage(product, chapters));
  writeFile(path.join(productDir, 'metadata.json'), JSON.stringify(product, null, 2) + '\n');
  writeFile(path.join(productDir, 'qa-report.json'), JSON.stringify(qa, null, 2) + '\n');

  if (qa.errors.length > 0) {
    throw new Error(`${product.slug} has ${qa.errors.length} QA error(s). See ${path.relative(repoRoot, path.join(productDir, 'qa-report.json'))}`);
  }

  zipEpub(buildDir, epubPath);
  return { product, epubPath, qa };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const products = loadProducts(args);
  if (products.length === 0) {
    throw new Error('No ebook products matched the requested arguments.');
  }

  for (const product of products) {
    const result = buildProduct(product);
    console.log(`Generated ${path.relative(repoRoot, result.epubPath)}`);
    if (result.qa.warnings.length > 0) {
      console.log(`  Warnings: ${result.qa.warnings.length} (${path.relative(repoRoot, path.join(outRoot, product.slug, 'qa-report.json'))})`);
    }
  }
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
