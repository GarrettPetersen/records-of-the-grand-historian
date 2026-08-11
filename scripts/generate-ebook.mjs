#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { getBookMetadata } from './book-metadata.mjs';
import { renderBookCover } from './generate-book-covers.mjs';
import {
  chapterPeopleContext,
  loadPeopleSiteContext,
  peopleSentenceAnchor,
  renderUnitWithPeople,
} from './lib/people-site.mjs';
import {
  humanizePeopleValue,
  personAlternateNames,
  personDisplayName,
  personFullDisplayName,
  personLifeSummary,
} from './lib/people-presentation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'ebooks', 'manifest.json');
const publicationDescriptionsPath = path.join(repoRoot, 'ebooks', 'publication-descriptions.json');
const outRoot = path.join(repoRoot, 'dist', 'ebooks');
const introductionTitle = "Translator's Introduction";
const peopleGlossaryTitle = 'People Glossary';
const PEOPLE_EBOOK = loadPeopleSiteContext({
  allowMissing: true,
  allowPreview: process.env.PEOPLE_EBOOK_PREVIEW === '1',
});
const publicationDescriptions = (() => {
  if (!fs.existsSync(publicationDescriptionsPath)) return {};
  return readJson(publicationDescriptionsPath);
})();

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    if (key === 'all' || key === 'all-products') {
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

function publicationTextFromEntry(entry = {}) {
  if (typeof entry.text === 'string') {
    return entry.text.replace(/\r\n/g, '\n').trim();
  }
  if (typeof entry.productDescription === 'string') {
    return entry.productDescription.replace(/\r\n/g, '\n').trim();
  }
  if (Array.isArray(entry.aboutThisEdition)) {
    const paragraphs = entry.aboutThisEdition.map((paragraph) => textContent(paragraph)).filter(Boolean);
    return paragraphs.join('\n\n');
  }
  return '';
}

function applyPublicationDescriptions(product) {
  const entry = publicationDescriptions[product.slug] || publicationDescriptions[product.book] || {};
  const resolved = structuredClone(product);
  if (Object.prototype.hasOwnProperty.call(entry, 'text') || Object.prototype.hasOwnProperty.call(entry, 'productDescription') || Object.prototype.hasOwnProperty.call(entry, 'aboutThisEdition')) {
    const publicationText = publicationTextFromEntry(entry);
    resolved.aboutThisEdition = publicationText ? publicationText.split(/\n{2,}/).map((paragraph) => textContent(paragraph)).filter(Boolean) : [];
  }
  return resolved;
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function writeBinaryFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function artifactInfo(productDir, fileName) {
  const file = path.join(productDir, fileName);
  const stat = fs.statSync(file);
  return {
    file: fileName,
    bytes: stat.size,
    sha256: sha256File(file)
  };
}

function pngInfo(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!Buffer.isBuffer(buffer) || buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) {
    return null;
  }
  const chunks = [];
  let colorType = null;
  let bitDepth = null;
  for (let offset = 8; offset + 12 <= buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > buffer.length) return null;
    if (type === 'IHDR') {
      bitDepth = buffer[dataStart + 8];
      colorType = buffer[dataStart + 9];
    }
    chunks.push({ type, dataStart, dataEnd });
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bytes: buffer.length,
    bitDepth,
    colorType,
    chunks
  };
}

function paethPredictor(left, above, upperLeft) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  if (aboveDistance <= upperLeftDistance) return above;
  return upperLeft;
}

function pngAlphaInfo(buffer, info) {
  if (!info || info.bitDepth !== 8) return null;
  if (info.colorType !== 4 && info.colorType !== 6) {
    return { hasAlphaChannel: false, min: 255, max: 255, fullyOpaque: true };
  }

  const bytesPerPixel = info.colorType === 6 ? 4 : 2;
  const alphaOffset = info.colorType === 6 ? 3 : 1;
  const rowBytes = info.width * bytesPerPixel;
  const idat = Buffer.concat(info.chunks
    .filter((chunk) => chunk.type === 'IDAT')
    .map((chunk) => buffer.subarray(chunk.dataStart, chunk.dataEnd)));
  const inflated = zlib.inflateSync(idat);
  const expected = (rowBytes + 1) * info.height;
  if (inflated.length < expected) return null;

  let min = 255;
  let max = 0;
  let sourceOffset = 0;
  let previous = Buffer.alloc(rowBytes);
  for (let y = 0; y < info.height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const raw = inflated.subarray(sourceOffset, sourceOffset + rowBytes);
    sourceOffset += rowBytes;
    const row = Buffer.alloc(rowBytes);
    for (let x = 0; x < rowBytes; x += 1) {
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const above = previous[x] || 0;
      const upperLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] || 0 : 0;
      const value = raw[x];
      if (filter === 0) row[x] = value;
      else if (filter === 1) row[x] = (value + left) & 0xff;
      else if (filter === 2) row[x] = (value + above) & 0xff;
      else if (filter === 3) row[x] = (value + Math.floor((left + above) / 2)) & 0xff;
      else if (filter === 4) row[x] = (value + paethPredictor(left, above, upperLeft)) & 0xff;
      else return null;
    }
    for (let x = alphaOffset; x < rowBytes; x += bytesPerPixel) {
      const alpha = row[x];
      if (alpha < min) min = alpha;
      if (alpha > max) max = alpha;
    }
    previous = row;
  }

  return { hasAlphaChannel: true, min, max, fullyOpaque: min === 255 && max === 255 };
}

function validateCoverImage(buffer, qa) {
  const info = pngInfo(buffer);
  if (!info) {
    qa.errors.push('Generated cover image is not a valid PNG.');
    return null;
  }
  const alpha = pngAlphaInfo(buffer, info);
  const ratio = info.height / info.width;
  qa.coverImage = {
    file: 'cover.png',
    format: 'png',
    width: info.width,
    height: info.height,
    bytes: info.bytes,
    aspectRatio: Number(ratio.toFixed(3)),
    alpha
  };
  if (info.width < 1000 || info.height < 1600) {
    qa.errors.push(`Generated cover image is too small: ${info.width}x${info.height}.`);
  }
  if (Math.abs(ratio - 1.6) > 0.02) {
    qa.warnings.push(`Generated cover image aspect ratio is ${ratio.toFixed(3)}; expected about 1.600.`);
  }
  if (!alpha) {
    qa.warnings.push('Could not inspect generated cover image alpha channel.');
  } else if (!alpha.fullyOpaque) {
    qa.errors.push(`Generated cover image has transparent pixels (alpha range ${alpha.min}-${alpha.max}).`);
  }
  return info;
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
  return getMainText(item);
}

function getTranslationObject(item) {
  if (!item) return null;
  if (typeof item.idiomatic === 'string' || typeof item.literal === 'string' || typeof item.translation === 'string') {
    return null;
  }
  const translation = item.translations?.find((entry) => entry.lang === 'en') || item.translations?.[0];
  return translation || null;
}

function getMainText(item) {
  if (!item) return '';
  const direct = item.idiomatic || item.literal || item.translation;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const trans = getTranslationObject(item);
  if (trans) {
    return textContent(trans.idiomatic || trans.literal || '');
  }
  return '';
}

function getFootnote(item) {
  const trans = getTranslationObject(item);
  return trans?.footnote ? textContent(trans.footnote) : '';
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

function splitLongRenderedUnit(unit, maxWords) {
  const plain = typeof unit === 'string' ? unit : textContent(unit.plain || unit);
  if (wordCount(plain) <= maxWords) return [unit];
  if (typeof unit !== 'string' && /class="person-link"/u.test(unit.rendered || '')) {
    return [unit];
  }
  const parts = plain.match(/[^;.!?]+[;.!?]+(?:["'’”〉])?|[^;.!?]+$/gu)
    ?.map((part) => textContent(part))
    .filter(Boolean) || [];
  if (parts.length < 2) return [unit];

  const groups = [];
  let current = [];
  let currentWords = 0;
  for (const part of parts) {
    const partWords = wordCount(part);
    if (current.length > 0 && currentWords + partWords > maxWords) {
      groups.push(current.join(' ').trim());
      current = [];
      currentWords = 0;
    }
    current.push(part);
    currentWords += partWords;
  }
  if (current.length > 0) groups.push(current.join(' ').trim());
  if (groups.length < 2) return [unit];

  if (typeof unit === 'string') return groups;
  const rendered = unit.rendered || '';
  const anchor = rendered.match(/^<span id="([^"]+)">([\s\S]*)<\/span>$/u);
  const inner = anchor?.[2] ?? rendered;
  const noterefIndex = inner.indexOf('<a epub:type="noteref"');
  const noteref = noterefIndex >= 0 ? inner.slice(noterefIndex) : '';
  return groups.map((group, index) => ({
    plain: group,
    rendered: `${index === 0 && anchor ? `<span id="${anchor[1]}">` : ''}` +
      `${escapeXml(group)}${index === 0 && anchor ? '</span>' : ''}` +
      `${index === groups.length - 1 ? noteref : ''}`,
  }));
}

function splitParagraphSentences(sentences, maxWords = 220) {
  const groups = [];
  let current = [];
  let currentWords = 0;

  for (const sent of sentences) {
    const splitUnits = splitLongRenderedUnit(sent, maxWords);
    for (const unit of splitUnits) {
    const sText = typeof unit === 'string' ? unit : (unit.plain || unit);
    const sentenceWords = wordCount(sText);
    if (current.length > 0 && currentWords + sentenceWords > maxWords) {
      groups.push(current);
      current = [];
      currentWords = 0;
    }
    current.push(unit);
    currentWords += sentenceWords;
    }
  }

  if (current.length > 0) groups.push(current);
  return groups;
}

function recordCjkOccurrence(qa, chapter, blockIndex, text, allowed) {
  const matches = cjkMatches(text);
  qa.cjkBodyOccurrences.push({
    chapter: chapter.meta.chapter,
    block: blockIndex + 1,
    allowed,
    allowReason: allowed ? 'Source item is marked allowChineseCharacters.' : '',
    matches: matches.map((match) => ({
      text: match.text,
      excerpt: excerptAround(text, match.index)
    })),
    excerpt: text.slice(0, 240)
  });
}

function tableFieldLabel(headers, cellIndex) {
  const header = textContent(headers[cellIndex] || '');
  return header;
}

function fallbackTableFieldLabel(headers, cellIndex) {
  const header = tableFieldLabel(headers, cellIndex);
  if (header) return header;
  return `Column ${cellIndex + 1}`;
}

function isGenericTableFieldLabel(label) {
  return /^Column \d+$/u.test(label);
}

const TABLE_NUMBER_WORDS = new Map(Object.entries({
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

const TABLE_ORDINAL_WORDS = new Map(Object.entries({
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
  if (TABLE_NUMBER_WORDS.has(normalized)) return TABLE_NUMBER_WORDS.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && TABLE_NUMBER_WORDS.has(parts[0]) && TABLE_NUMBER_WORDS.has(parts[1])) {
    const tens = TABLE_NUMBER_WORDS.get(parts[0]);
    const ones = TABLE_NUMBER_WORDS.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function parseTableMarkerWord(value) {
  const normalized = String(value || '').toLowerCase().replace(/-/gu, ' ').trim();
  const cardinal = parseTableNumberWord(normalized);
  if (cardinal != null) return cardinal;
  if (TABLE_ORDINAL_WORDS.has(normalized)) return TABLE_ORDINAL_WORDS.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && TABLE_NUMBER_WORDS.has(parts[0]) && TABLE_ORDINAL_WORDS.has(parts[1])) {
    const tens = TABLE_NUMBER_WORDS.get(parts[0]);
    const ones = TABLE_ORDINAL_WORDS.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function parseTableOrdinalWord(value) {
  const normalized = String(value || '').toLowerCase().replace(/-/gu, ' ').trim();
  if (TABLE_ORDINAL_WORDS.has(normalized)) return TABLE_ORDINAL_WORDS.get(normalized);
  const parts = normalized.split(/\s+/u);
  if (parts.length === 2 && TABLE_NUMBER_WORDS.has(parts[0]) && TABLE_ORDINAL_WORDS.has(parts[1])) {
    const tens = TABLE_NUMBER_WORDS.get(parts[0]);
    const ones = TABLE_ORDINAL_WORDS.get(parts[1]);
    if (tens >= 20 && tens % 10 === 0 && ones > 0 && ones < 10) return tens + ones;
  }
  return null;
}

function isChronologyTableField(label) {
  return /\b(?:year|era|period|Gaozu|Emperor|Empress|Gao|Hui|Wen|Jing|Jianyuan|Yuanguang|Yuanshuo|Yuanshou|Yuanding|Yuanfeng|Taichu|Houyuan)\b/iu.test(label);
}

function tableMarkerPrefix(chapter, label) {
  return isChronologyTableField(label) ? 'Year' : '';
}

function normalizeLeadingTableYearMarkers(label, text, chapter) {
  if (chapter?.meta?.book === 'shiji' && chapter?.meta?.chapter === '016') {
    return normalizeShiji016MonthMarkers(text);
  }
  const markerPrefix = tableMarkerPrefix(chapter, label);
  if (!markerPrefix) {
    return chapter?.meta?.book === 'shiji' && chapter?.meta?.chapter === '017'
      ? normalizeOrdinalTableSentenceMarkers(text, 'Year')
      : text;
  }
  let rest = text.trim();
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
  if (markers.length === 0) {
    const standaloneDigit = rest.match(/^(\d{1,3})(?:st|nd|rd|th)?$/iu);
    if (standaloneDigit) return `${markerPrefix} ${Number(standaloneDigit[1])}`;
    const standaloneWord = parseTableMarkerWord(rest);
    if (standaloneWord != null) return `${markerPrefix} ${standaloneWord}`;
    return normalizeInternalTableYearMarkers(text, markerPrefix);
  }
  const normalized = rest ? `${markers.join('; ')}: ${rest}` : markers.join('; ');
  return normalizeInternalTableYearMarkers(normalized, markerPrefix);
}

function normalizeInternalTableYearMarkers(text, markerPrefix = 'Year') {
  return text
    .replace(/(^|[.!?]\s+)(\d{1,3})(?:st|nd|rd|th)?\.\s+/giu, (_match, prefix, value) => `${prefix}${markerPrefix} ${Number(value)}: `)
    .replace(/(^|[.!?]\s+)((?:One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Thirtieth|Fortieth|Fiftieth|Sixtieth|Seventieth|Eightieth|Ninetieth)(?:[- ][a-z]+)?)\.\s+/gu, (match, prefix, value) => {
      const parsed = parseTableMarkerWord(value);
      return parsed == null ? match : `${prefix}${markerPrefix} ${parsed}: `;
    });
}

function normalizeShiji016MonthMarkers(text) {
  let rest = text.trim();
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
  const normalized = markers.length > 0 && rest ? `${markers.join('; ')}: ${rest}` : markers.join('; ') || text;
  return normalized
    .replace(/(^|[.!?]\s+)(\d{1,2})(?:st|nd|rd|th)\.\s+/giu, (_match, prefix, value) => `${prefix}Month ${Number(value)}: `)
    .replace(/(^|[.!?]\s+)((?:First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Thirtieth|Fortieth|Fiftieth|Sixtieth|Seventieth|Eightieth|Ninetieth)(?:[- ][a-z]+)?)\.\s+/gu, (match, prefix, value) => {
      const parsed = parseTableOrdinalWord(value);
      return parsed == null ? match : `${prefix}Month ${parsed}: `;
    });
}

function normalizeOrdinalTableSentenceMarkers(text, markerPrefix) {
  const value = String(text || '').trim();
  const standaloneDigit = value.match(/^(\d{1,3})(?:st|nd|rd|th)?\.?$/iu);
  if (standaloneDigit) return `${markerPrefix} ${Number(standaloneDigit[1])}`;
  const standaloneWord = parseTableMarkerWord(value.replace(/\.$/u, ''));
  if (standaloneWord != null) return `${markerPrefix} ${standaloneWord}`;
  return value
    .replace(/^(\d{1,2})(?:st|nd|rd|th)?\.\s+/iu, (_match, value) => `${markerPrefix} ${Number(value)}: `)
    .replace(/^((?:[A-Z][a-z]+)(?:[- ][a-z]+)?)\.\s+/u, (match, value) => {
      const parsed = parseTableMarkerWord(value);
      return parsed == null ? match : `${markerPrefix} ${parsed}: `;
    })
    .replace(/([.!?]\s+)(\d{1,2})(?:st|nd|rd|th)?\.\s+/giu, (_match, prefix, value) => `${prefix}${markerPrefix} ${Number(value)}: `)
    .replace(/([.!?]\s+)((?:One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Thirtieth|Fortieth|Fiftieth|Sixtieth|Seventieth|Eightieth|Ninetieth)(?:[- ][a-z]+)?)\.\s+/gu, (match, prefix, value) => {
      const parsed = parseTableMarkerWord(value);
      return parsed == null ? match : `${prefix}${markerPrefix} ${parsed}: `;
    });
}

function tableDisplayText(label, text, chapter) {
  const normalizedLabel = textContent(label || '');
  const normalizedText = textContent(text || '');
  if (!normalizedLabel || !normalizedText || isGenericTableFieldLabel(normalizedLabel)) return normalizedText;
  if (normalizedText.replace(/[.:：。]\s*$/u, '').toLowerCase() === normalizedLabel.toLowerCase()) return '';
  const prefix = `${normalizedLabel}:`;
  const withoutDuplicatePrefix = normalizedText.toLowerCase().startsWith(prefix.toLowerCase())
    ? normalizedText.slice(prefix.length).trim()
    : normalizedText;
  return normalizeLeadingTableYearMarkers(normalizedLabel, withoutDuplicatePrefix || normalizedText, chapter);
}

function hasSuspiciousTableTitlePunctuation(title) {
  return /^[\p{Lu}\p{Lt}0-9][\p{L}0-9'’𨜓 -]{0,60}\.$/u.test(title);
}

function tableCells(block) {
  return block.cells || block.sentences || [];
}

function renderTableHeaderSummary(headers, headerItems = [], chapterContext = null, ebookPeople = null) {
  const labels = headers.map(textContent).filter(Boolean);
  if (labels.length === 0) return '';
  const rendered = headers.map((header, index) => {
    let label = textContent(header);
    if (!label) return '';
    const item = headerItems[index];
    if (hasEbookEnglishPersonMention(item, chapterContext)) label = textContent(getTranslation(item));
    return wrapEbookUnitAnchor(item, renderEbookUnit(item, label, chapterContext, ebookPeople));
  }).filter(Boolean);
  return `<p class="table-column-summary">Columns: ${rendered.join('; ')}</p>`;
}

function isBlankHeader(headers) {
  return headers.length > 0 && headers.every((header) => !textContent(header));
}

function promotableHeaderRow(block) {
  const labels = tableCells(block).map(getTranslation).map(textContent);
  const lowerLabels = labels.map((label) => label.toLowerCase());
  const hasStateName = lowerLabels.some((label) => label === 'state name' || label === 'state');
  const hasMeritColumn = lowerLabels.some((label) => label.includes('merit') || label.includes('meritorious'));
  if (!hasStateName || !hasMeritColumn) return null;
  return labels;
}

function inferInitialTableHeaders(chapter) {
  if (chapter?.meta?.book === 'shiji' && chapter?.meta?.chapter === '013') {
    return ['Zhou', 'Lu', 'Qi', 'Jin', 'Qin', 'Chu', 'Song', 'Wei', 'Chen', 'Cai', 'Cao', 'Yan'];
  }
  return [];
}

function expandTableHeadersForRow(chapter, headers, columnCount) {
  if (chapter?.meta?.book === 'shiji' && chapter?.meta?.chapter === '013' && columnCount === 12 && headers.length < 12) {
    return inferInitialTableHeaders(chapter);
  }
  return headers;
}

function inferChapterTableHeaders(chapter, headers) {
  if (chapter?.meta?.book !== 'shiji') return null;
  const columnCount = headers.length;

  if (chapter?.meta?.chapter === '016' && columnCount === 21) {
    return [
      'BCE',
      'Qin',
      'Western Chu',
      'Hengshan',
      'Linjiang',
      'Jiujiang',
      'Changshan',
      'Dai',
      'Linzi',
      'Jibei',
      'Jiaodong',
      'Han (Liu Bang)',
      'Yong',
      'Sai',
      'Di',
      'Yan',
      'Liaodong',
      'Western Wei',
      'Yin',
      'Han (former state)',
      'Henan'
    ];
  }

  if (chapter?.meta?.chapter === '017' && columnCount === 28) {
    return [
      'Year',
      'Reign year',
      'Chu',
      'Lu',
      'Hengshan',
      'Qi',
      'Chengyang',
      'Jibei',
      'Jinan',
      'Langya / Zichuan',
      'Jiaoxi',
      'Jiaodong',
      'Jing',
      'Huainan',
      'Yan',
      'Zhao',
      'Hejian',
      'Guangchuan',
      'Zhongshan',
      'Lujiang',
      'Changshan',
      'Liang',
      'Jichuan',
      'Linjiang',
      'Lü',
      'Huaiyang',
      'Dai',
      'Changsha'
    ];
  }

  return null;
}

function inferBlankTableHeaders(chapter, columnCount) {
  if (chapter?.meta?.book !== 'shiji') return null;
  if (chapter?.meta?.chapter === '019') {
    return [
      'State name',
      'Meritorious service',
      'Hui, year 7',
      'Empress Gao, year 8',
      'Wen, year 23',
      'Jing, year 16',
      'Jianyuan through Yuanfeng, 36 years',
      'Taichu and later'
    ].slice(0, columnCount);
  }
  if (chapter?.meta?.chapter === '020' && columnCount === 2) {
    return ['State name', 'Account'];
  }
  return null;
}

function renderTableEntry(
  block,
  headers,
  chapter,
  blockIndex,
  rowNumber,
  qa,
  tableStats,
  footnotes,
  chapterContext = null,
  ebookPeople = null,
) {
  const fields = tableCells(block)
    .map((cell, cellIndex) => {
      const mainText = getMainText(cell);
      const text = textContent(mainText);
      const fnText = getFootnote(cell);
      if (!text && !fnText && textContent(cell.content || cell.zh)) {
        qa.errors.push(`Missing table cell translation in ${chapter.meta.chapter} block ${blockIndex + 1} cell ${cellIndex + 1}`);
      }
      if (hasPlaceholder(text)) {
        qa.errors.push(`Placeholder text in ${chapter.meta.chapter} block ${blockIndex + 1} cell ${cellIndex + 1}`);
      }
      if (!text && !fnText) return null;
      const label = fallbackTableFieldLabel(headers, cellIndex);
      if (isGenericTableFieldLabel(label)) tableStats.genericLabels += 1;
      const displayMain = hasEbookEnglishPersonMention(cell, chapterContext)
        ? text
        : tableDisplayText(label, text, chapter);
      if (!displayMain && !fnText) return null;
      let cellContent = renderEbookUnit(cell, displayMain, chapterContext, ebookPeople);
      if (fnText) {
        const fnNum = footnotes.length + 1;
        const fnId = `fn-${chapter.meta.chapter}-${fnNum}`;
        footnotes.push({
          id: fnId,
          number: fnNum,
          text: fnText
        });
        cellContent += `<a epub:type="noteref" href="#${fnId}"><sup>${fnNum}</sup></a>`;
      }
      cellContent = wrapEbookUnitAnchor(cell, cellContent);
      return {
        label: label ? escapeXml(label) : null,
        main: displayMain,
        content: cellContent
      };
    })
    .filter(Boolean);

  if (fields.length === 0) return '';

  const titleField = fields[0];
  const details = fields.slice(1)
    .map((field) => {
      if (!field.label) return `<dd class="table-entry-unlabeled">${field.content}</dd>`;
      return `<dt>${field.label}</dt><dd>${field.content}</dd>`;
    })
    .join('');
  const fallbackTitle = `Table row ${rowNumber}`;
  const title = titleField?.main || fallbackTitle;
  const titleContent = titleField?.content || escapeXml(fallbackTitle);
  if (/state|name/i.test(titleField?.label || '') && hasSuspiciousTableTitlePunctuation(title)) {
    qa.errors.push(`Suspicious terminal punctuation in table title in ${chapter.meta.chapter} block ${blockIndex + 1}: ${title}`);
  }
  const titleLabel = titleField?.label ? `<span class="table-entry-kicker">${titleField.label}</span>` : '';
  const detailList = details ? `\n  <dl>${details}</dl>` : '';

  return `<section class="table-entry">
  <h3>${titleLabel}${titleContent}</h3>${detailList}
</section>`;
}

function hasPlaceholder(value) {
  return /\(no translation available\)|\[translation\]|\bTODO\b/i.test(value);
}

function hasCjk(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function cjkMatches(value) {
  return [...value.matchAll(/[\u3400-\u9fff]+/gu)].map((match) => ({
    text: match[0],
    index: match.index
  }));
}

function isInsideChineseBookTitle(text, index) {
  const beforeOpen = text.lastIndexOf('《', index);
  const beforeClose = text.lastIndexOf('》', index);
  if (beforeOpen === -1 || beforeClose > beforeOpen) return false;
  const afterClose = text.indexOf('》', index);
  return afterClose !== -1;
}

function isIntentionalCjkReference(text, match) {
  const value = textContent(text);
  if (isInsideChineseBookTitle(value, match.index)) return true;

  const referenceCue = /\b(?:character|characters|graph|gloss(?:es|ed)?|means?|describes?|refers?|is\s+(?:like|an?|the)|rhyme|read|reads|pronounced|pronunciation|fanqie|text reads|written|place-name|corrupt|insert(?:ed)?|marks?)\b/i;
  if (!referenceCue.test(value)) return false;

  const cjkRuns = cjkMatches(value);
  const shortReference = match.text.length <= 6 && cjkRuns.length <= 8;
  const compactGloss = value.length <= 220 && cjkRuns.every((run) => run.text.length <= 6);
  return shortReference || compactGloss;
}

function hasUnmarkedCjk(value) {
  const text = textContent(value);
  return cjkMatches(text).some((match) => !isIntentionalCjkReference(text, match));
}

function excerptAround(text, index, width = 80) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function allowsChineseCharacters(item) {
  return item?.allowChineseCharacters === true ||
    item?.translations?.some((entry) => entry.allowChineseCharacters === true) === true;
}

function chapterFileName(chapterId) {
  return `chapter-${chapterId}.xhtml`;
}

function ebookPersonAnchor(personId) {
  return `person-${personId}`;
}

function buildEbookPeople(product) {
  if (!PEOPLE_EBOOK.active) return null;
  const chapterIds = new Set(product.chapters.map((chapter) => String(chapter).padStart(3, '0')));
  const people = PEOPLE_EBOOK.catalog.people.filter((person) => person.localPeople.some((localId) => {
    const [book, chapter] = localId.split(':');
    return book === product.book && chapterIds.has(chapter);
  })).sort((left, right) =>
    personDisplayName(left).localeCompare(personDisplayName(right), 'en') || left.id.localeCompare(right.id)
  );
  if (!people.length) return null;
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const shards = [];
  const shardSize = 350;
  for (let index = 0; index < people.length; index += shardSize) {
    const number = shards.length + 1;
    shards.push({
      number,
      file: `glossary-${String(number).padStart(3, '0')}.xhtml`,
      people: people.slice(index, index + shardSize),
    });
  }
  const fileByPersonId = new Map();
  for (const shard of shards) {
    for (const person of shard.people) fileByPersonId.set(person.id, shard.file);
  }
  const chapterContexts = new Map(product.chapters.map((chapter) => {
    const chapterId = String(chapter).padStart(3, '0');
    return [chapterId, chapterPeopleContext(PEOPLE_EBOOK, product.book, chapterId)];
  }));
  const mentionSpanKeys = new Set();
  for (const [chapterId, context] of chapterContexts) {
    for (const mention of context?.record.mentions ?? []) {
      for (const span of mention.spans?.en ?? []) {
        mentionSpanKeys.add([
          chapterId,
          mention.unit.id,
          mention.personId,
          span.startCodePoint,
          span.endCodePoint,
        ].join(':'));
      }
    }
  }
  const backlinks = people.reduce((total, person) =>
    total + person.references.filter((reference) =>
      reference.book === product.book && chapterIds.has(reference.chapter)
    ).length, 0);
  return {
    preview: PEOPLE_EBOOK.preview,
    book: product.book,
    chapterIds,
    people,
    peopleById,
    shards,
    fileByPersonId,
    chapterContexts,
    expectedMentionLinks: mentionSpanKeys.size,
    expectedBacklinks: backlinks,
  };
}

function ebookPersonHref(ebookPeople, personId, from = 'chapter') {
  const file = ebookPeople?.fileByPersonId.get(personId);
  if (!file) throw new Error(`No EPUB glossary target for canonical person ${personId}`);
  const prefix = from === 'chapter' ? '../people/' : '';
  return `${prefix}${file}#${ebookPersonAnchor(personId)}`;
}

function renderEbookUnit(item, main, chapterContext, ebookPeople) {
  if (!item?.id || !chapterContext || !ebookPeople) return escapeXml(main);
  return renderUnitWithPeople({
    unitId: item.id,
    text: main,
    language: 'en',
    chapterContext,
    chineseWordSpans: false,
    hrefForPerson: ({ personId }) => ebookPersonHref(ebookPeople, personId, 'chapter'),
  });
}

function hasEbookEnglishPersonMention(item, chapterContext) {
  if (!item?.id || !chapterContext) return false;
  return (chapterContext.mentionsByUnit.get(item.id) ?? [])
    .some((mention) => (mention.spans?.en ?? []).length > 0);
}

function wrapEbookUnitAnchor(item, rendered) {
  if (!item?.id) return rendered;
  return `<span id="${peopleSentenceAnchor('en', item.id)}">${rendered}</span>`;
}

function emptyChapterTableStats() {
  return {
    headers: 0,
    rows: 0,
    renderedRows: 0,
    emptyRows: 0,
    blankHeaders: 0,
    resolvedBlankHeaders: 0,
    inferredBlankHeaders: 0,
    promotedHeaderRows: 0,
    reviewRecommended: false,
    genericLabels: 0,
    cells: 0,
    translatedCells: 0,
    maxCells: 0
  };
}

function normalizeTimestamp(value) {
  const time = Date.parse(value || '');
  if (Number.isNaN(time)) return null;
  return new Date(time).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function buildTimestamp(product) {
  const override = normalizeTimestamp(process.env.EBOOK_GENERATED_AT);
  if (override) return override;
  const year = Number(product.publishedYear);
  if (Number.isInteger(year) && year >= 1000 && year <= 9999) {
    return `${year}-01-01T00:00:00Z`;
  }
  return '2000-01-01T00:00:00Z';
}

function editionField(product) {
  return String(product.editionNumber ?? product.editionStatus ?? '');
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
    'aiDisclosure',
    'editionNote',
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

  const title = textContent(product.title);
  const subtitle = textContent(product.subtitle);
  if (title && subtitle && `${title}: ${subtitle}`.length > 200) {
    qa.warnings.push('KDP title and subtitle together exceed 200 characters.');
  }

  for (const [label, value] of [
    ['title', product.title],
    ['subtitle', product.subtitle],
    ['author', product.author],
    ['translator', product.translator],
    ['publisher', product.publisher],
    ['series', product.series],
  ]) {
    const field = textContent(value);
    if (!field) continue;
    if (/[<>]/u.test(field)) {
      qa.warnings.push(`KDP ${label} field contains HTML-like characters.`);
    }
    if (/https?:\/\/|www\./iu.test(field)) {
      qa.warnings.push(`KDP ${label} field contains a URL.`);
    }
    if (/\b(?:free|sale|discount|bestseller|best-selling|kindle|kdp)\b/iu.test(field)) {
      qa.warnings.push(`KDP ${label} field may contain promotional or platform language.`);
    }
  }

  const kdp = product.kdp || {};
  if (!textContent(kdp.suggestedListPriceUsd)) qa.warnings.push('Missing KDP suggested USD list price.');
  if (!textContent(kdp.publishingRights)) qa.warnings.push('Missing KDP publishing-rights note.');
  if (!textContent(kdp.aiGeneratedContent)) qa.warnings.push('Missing KDP AI-generated-content disclosure note.');
  const productDescription = textContent(product.productDescription || product.description);
  if (!productDescription) {
    qa.warnings.push('No product description found for publication metadata.');
  }
  if (productDescription.length > 4000) {
    qa.warnings.push('Product description is longer than 4,000 characters.');
  }
  if (/https?:\/\/|www\./iu.test(productDescription)) {
    qa.warnings.push('Product description contains a URL; KDP metadata guidelines disallow website URLs in descriptions.');
  }
  const categories = Array.isArray(kdp.categories) ? kdp.categories.map(textContent).filter(Boolean) : [];
  if (categories.length === 0) qa.warnings.push('Missing KDP category suggestions.');
  if (categories.length > 3) qa.warnings.push(`KDP category list has ${categories.length} entries; KDP accepts up to 3 categories.`);
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords.map(textContent).filter(Boolean) : [];
  if (keywords.length < 7) qa.warnings.push(`KDP keyword list has ${keywords.length} entries; expected 7.`);
  if (keywords.length > 7) qa.warnings.push(`KDP keyword list has ${keywords.length} entries; KDP accepts 7 keyword slots.`);
  validateKdpDescription(productDescription, categories, keywords, qa);
  validateKdpKeywords(product, categories, keywords, qa);
}

function normalizeMetadataPhrase(value) {
  return textContent(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function phraseTokens(value) {
  return normalizeMetadataPhrase(value)
    .split(' ')
    .filter((token) => token.length >= 4);
}

function validateKdpDescription(productDescription, categories, keywords, qa) {
  const normalizedDescription = normalizeMetadataPhrase(productDescription);
  if (!normalizedDescription) return;
  for (const phrase of [...categories, ...keywords]) {
    const normalizedPhrase = normalizeMetadataPhrase(phrase);
    if (!normalizedPhrase) continue;
    if (normalizedDescription.includes(normalizedPhrase)) {
      qa.warnings.push(`Product description repeats a KDP category or keyword phrase: ${phrase}`);
    }
  }
}

function validateKdpKeywords(product, categories, keywords, qa) {
  const seen = new Set();
  const metadataPhrases = [
    product.title,
    product.subtitle,
    product.author,
    product.translator,
    product.series,
    ...categories,
  ].map(normalizeMetadataPhrase).filter(Boolean);
  const metadataTokens = new Set(metadataPhrases.flatMap((phrase) => phraseTokens(phrase)));
  for (const keyword of keywords) {
    const normalized = normalizeMetadataPhrase(keyword);
    if (!normalized) continue;
    if (seen.has(normalized)) {
      qa.warnings.push(`Duplicate KDP keyword: ${keyword}`);
    }
    seen.add(normalized);
    if (/[<>"“”]/u.test(keyword)) {
      qa.warnings.push(`KDP keyword contains unsupported punctuation or HTML-like characters: ${keyword}`);
    }
    if (/(?:https?:\/\/|www\.|kindle unlimited|kdp select|on sale|available now|new\b)/iu.test(keyword)) {
      qa.warnings.push(`KDP keyword contains disallowed promotional/platform language: ${keyword}`);
    }
    if (metadataPhrases.includes(normalized)) {
      qa.warnings.push(`KDP keyword repeats an existing metadata field: ${keyword}`);
      continue;
    }
    const tokens = phraseTokens(keyword);
    if (tokens.length > 0 && tokens.every((token) => metadataTokens.has(token))) {
      qa.warnings.push(`KDP keyword is covered by title, contributor, series, or category metadata: ${keyword}`);
    }
  }
}

function markdownList(values) {
  return values.map(textContent).filter(Boolean).map((value) => `- ${value}`).join('\n');
}

function packageSubjects(product) {
  const kdp = product.kdp || {};
  return [
    ...(Array.isArray(kdp.categories) ? kdp.categories : []),
    ...(Array.isArray(kdp.keywords) ? kdp.keywords : [])
  ]
    .map(textContent)
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function renderKdpMetadata(product) {
  const kdp = product.kdp || {};
  const categories = Array.isArray(kdp.categories) ? kdp.categories : [];
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords : [];
  return `# KDP Metadata: ${product.title}

## Product

- Title: ${product.title}
- Subtitle: ${product.subtitle || ''}
- Author: ${product.author}
- Translator: ${product.translator}
- Publisher: ${product.publisher || ''}
- Language: ${product.language || 'en'}
- Series: ${product.series || ''}
- Series number: ${product.seriesNumber || ''}
- Edition: ${editionField(product)}
- Edition status: ${product.editionStatus || ''}
- Copyright: ${product.rights || ''}

## Description

${product.productDescription || product.description || ''}

## AI Disclosure

${product.aiDisclosure || ''}

KDP field suggestion: ${kdp.aiGeneratedContent || ''}

## Edition Note

${product.editionNote || ''}

## Publishing Rights

${kdp.publishingRights || ''}

## Pricing

- Suggested list price USD: ${kdp.suggestedListPriceUsd || ''}

## Categories

${markdownList(categories)}

## Keywords

${markdownList(keywords)}
`;
}

function languageToolCacheSummary(product) {
  if (!product.book || !Array.isArray(product.chapters) || product.chapters.length === 0) {
    return {
      available: false,
      line: `Run \`make check-languagetool-cache BOOK=${product.book || '<book>'}\` before final upload.`,
    };
  }
  const chapterPaths = product.chapters.map((chapter) => path.join('data', product.book, `${chapter}.json`));
  const result = childProcess.spawnSync(
    process.execPath,
    ['scripts/score-languagetool.mjs', ...chapterPaths, '--check-cache', '--json'],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  try {
    const summary = JSON.parse(result.stdout || '{}');
    const counts = summary.counts || {};
    const current = counts.current || 0;
    const total = summary.count || product.chapters.length;
    const staleCount = summary.staleCount || 0;
    if (staleCount === 0 && total > 0) {
      return {
        available: true,
        current: true,
        line: `LanguageTool cache is current for ${current}/${total} source chapters.`,
      };
    }
    return {
      available: true,
      current: false,
      line: `LanguageTool cache needs refresh: current ${current}/${total}; missing ${counts.missing || 0}, stale version ${counts['stale-version'] || 0}, stale source ${counts['stale-source'] || 0}.`,
    };
  } catch (_error) {
    return {
      available: false,
      line: `Could not inspect cached LanguageTool scores while generating this checklist; run \`make check-languagetool-cache BOOK=${product.book}\` before final upload.`,
    };
  }
}

function renderUploadChecklist(product, qa, manifest) {
  const kdp = product.kdp || {};
  const categories = Array.isArray(kdp.categories) ? kdp.categories : [];
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords : [];
  const upload = manifest.uploadArtifacts || {};
  const support = manifest.supportArtifacts || {};
  const languageTool = languageToolCacheSummary(product);

  return `# Upload Checklist: ${product.title}

Generated: ${manifest.generatedAt}

## Upload Files

- Manuscript: \`${upload.epub?.file || `${product.slug}.epub`}\`
  - SHA-256: \`${upload.epub?.sha256 || ''}\`
  - Bytes: ${upload.epub?.bytes || ''}
- Cover image: \`${upload.coverJpeg?.file || upload.cover?.file || 'cover.jpg'}\`
  - SHA-256: \`${upload.coverJpeg?.sha256 || upload.cover?.sha256 || ''}\`
  - Bytes: ${upload.coverJpeg?.bytes || upload.cover?.bytes || ''}

## KDP Fields

- Title: ${product.title}
- Subtitle: ${product.subtitle || ''}
- Contributors:
  - Author: ${product.author}
  - Translator: ${product.translator}
- Publisher: ${product.publisher || ''}
- Language: ${product.language || 'en'}
- Series: ${product.series || ''}
- Series number: ${product.seriesNumber || ''}
- ISBN: Not required for the Kindle eBook; leave blank unless assigning your own ISBN.
- Edition: ${editionField(product)}
- Edition status: ${product.editionStatus || ''}
- Suggested list price USD: ${kdp.suggestedListPriceUsd || ''}
- Publishing rights: ${kdp.publishingRights || ''}
- AI-generated content: ${kdp.aiGeneratedContent || ''}

## Product Description

${product.productDescription || product.description || ''}

## Categories

${markdownList(categories)}

## Keywords

${markdownList(keywords)}

## Support Files

These files are for review and recordkeeping; do not upload them as the manuscript or cover.

- Metadata sidecar: \`${upload.kdpMetadata?.file || 'kdp-metadata.md'}\`
- Structured KDP fields: \`${support.kdpUploadFields?.file || 'kdp-upload-fields.json'}\`
- KDP draft worksheet: \`${support.kdpDraftWorksheet?.file || 'kdp-draft-worksheet.md'}\`
- QA report: \`${support.qaReport?.file || 'qa-report.json'}\`
- Table rendering review: \`${support.tableReview?.file || 'table-review.md'}\`
- Publication manifest: \`publication-manifest.json\`
- Manual review checklist: \`${support.reviewChecklist?.file || 'review-checklist.md'}\`

## Final Gate

- Automated QA errors: ${qa.errors.length}
- Automated QA warnings: ${qa.warnings.length}
- ${languageTool.line}
- Local artifact checks covered by automated QA: EPUB structure, packaged cover opacity, frontmatter text, table-of-contents completeness, KDP field sidecar completeness, and generated table-review targets.
- Manual publication checks are tracked in \`ebooks/manual-qa/${product.slug}.json\`: Kindle Previewer or bundled Amazon converter smoke test, at least one reader light/dark rendering pass, and a KDP draft with fields entered from \`${support.kdpUploadFields?.file || 'kdp-upload-fields.json'}\`.
- After Kindle Previewer or bundled Amazon converter and local reader checks pass, record local evidence with \`make ebook-local-signoff SLUG=${product.slug} CHECKED_BY="Garrett M. Petersen" KINDLE_PREVIEWER_VERSION="<version>"\`.
- After the unpublished KDP draft ingests successfully, record final KDP evidence with \`make ebook-kdp-signoff SLUG=${product.slug} CHECKED_BY="Garrett M. Petersen" CONFIRM_KDP_DRAFT=1\`.
- Before publishing, complete \`ebooks/manual-qa/${product.slug}.json\` and run \`make ebook-qa SLUG=${product.slug} REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1\`.
`;
}

function renderKdpDraftWorksheet(product, manifest) {
  const kdp = product.kdp || {};
  const upload = manifest.uploadArtifacts || {};
  const categories = Array.isArray(kdp.categories) ? kdp.categories : [];
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords : [];
  const contributors = [
    ['Author', product.author],
    ['Translator', product.translator],
  ].filter(([, name]) => textContent(name));

  return `# KDP Draft Worksheet: ${product.title}

Use this worksheet while creating the unpublished KDP draft. It mirrors \`kdp-upload-fields.json\` but is ordered like a form-entry checklist.

## Upload Files

- Manuscript: \`dist/ebooks/${product.slug}/${upload.epub?.file || `${product.slug}.epub`}\`
  - Bytes: ${upload.epub?.bytes || ''}
  - SHA-256: \`${upload.epub?.sha256 || ''}\`
- Cover: \`dist/ebooks/${product.slug}/${upload.coverJpeg?.file || upload.cover?.file || 'cover.jpg'}\`
  - Bytes: ${upload.coverJpeg?.bytes || upload.cover?.bytes || ''}
  - SHA-256: \`${upload.coverJpeg?.sha256 || upload.cover?.sha256 || ''}\`

## Book Details

- Title: ${product.title}
- Subtitle: ${product.subtitle || ''}
- Contributors:
${contributors.map(([role, name]) => `  - ${role}: ${name}`).join('\n')}
- Publisher: ${product.publisher || ''}
- Language: ${product.language || 'en'}
- Series: ${product.series || ''}
- Series number: ${product.seriesNumber || ''}
- ISBN: Leave blank unless assigning your own ISBN.
- Edition: ${editionField(product)}
- Edition status: ${product.editionStatus || ''}

## Rights And AI Disclosure

- Publishing rights: ${kdp.publishingRights || ''}
- Copyright statement: ${product.rights || ''}
- AI-generated content: ${kdp.aiGeneratedContent || ''}

## Description

${product.productDescription || product.description || ''}

## Categories

${markdownList(categories)}

## Keywords

${keywords.map((keyword, index) => `${index + 1}. ${keyword}`).join('\n') || '-'}

## Pricing

- Suggested list price USD: ${kdp.suggestedListPriceUsd || ''}

## Draft Checks To Record In ebooks/manual-qa/${product.slug}.json

- \`draftCreated\`: true after the KDP draft exists.
- \`fieldsMatchUploadFields\`: true after the visible KDP fields match this worksheet or intentional changes are noted.
- \`productDescriptionEntered\`: true after the description is entered.
- \`priceEntered\`: true after the USD price is entered.
- \`publishingRightsEntered\`: true after the rights selection/note matches this worksheet.
- \`categoriesEntered\`: true after all selected categories are entered.
- \`keywordsEntered\`: true after all seven keyword slots are entered.
- \`aiDisclosureEntered\`: true after KDP's AI-generated content disclosure is entered.
- \`ingestionErrors\`: false only after KDP reports no manuscript or cover ingestion errors.
`;
}

function kdpUploadFields(product, manifest) {
  const kdp = product.kdp || {};
  const upload = manifest.uploadArtifacts || {};
  return {
    schemaVersion: 1,
    slug: product.slug,
    generatedAt: manifest.generatedAt,
    uploadFiles: {
      manuscript: upload.epub || null,
      cover: upload.coverJpeg || upload.cover || null,
      packagedCover: upload.cover || null,
    },
    product: {
      title: product.title,
      subtitle: product.subtitle || '',
      contributors: [
        { role: 'Author', name: product.author },
        { role: 'Translator', name: product.translator },
      ],
      publisher: product.publisher || '',
      language: product.language || 'en',
      series: product.series || '',
      seriesNumber: product.seriesNumber || '',
      isbn: {
        requiredForKindleEbook: false,
        instruction: 'Leave blank unless assigning your own ISBN.',
      },
      edition: editionField(product),
      editionStatus: product.editionStatus || '',
      rights: product.rights || '',
    },
    kdp: {
      suggestedListPriceUsd: kdp.suggestedListPriceUsd || '',
      publishingRights: kdp.publishingRights || '',
      aiGeneratedContent: kdp.aiGeneratedContent || '',
      productDescription: product.productDescription || product.description || '',
      categories: Array.isArray(kdp.categories) ? kdp.categories : [],
      keywords: Array.isArray(kdp.keywords) ? kdp.keywords : [],
    },
  };
}

function chapterTableRowTitles(chapter, limit = 3) {
  const rows = (chapter.content || [])
    .filter((block) => block.type === 'table_row')
    .map((block) => {
      const title = textContent(getTranslation(tableCells(block)[0]));
      return title || null;
    })
    .filter(Boolean)
    .filter((title) => !['state name', 'state'].includes(title.toLowerCase()));
  if (rows.length <= limit) return rows;
  const middle = rows[Math.floor(rows.length / 2)];
  return [rows[0], middle, rows.at(-1)];
}

function tableReviewRows(chapter) {
  const rows = [];
  let currentHeaders = inferInitialTableHeaders(chapter);
  let pendingBlankHeader = false;
  let rowNumber = 0;
  let renderedRowNumber = 0;

  for (const block of chapter.content || []) {
    if (block.type === 'paragraph') {
      pendingBlankHeader = false;
      continue;
    }
    if (block.type === 'table_header') {
      currentHeaders = (block.sentences || []).map(getTranslation).map(textContent);
      currentHeaders = inferChapterTableHeaders(chapter, currentHeaders) || currentHeaders;
      pendingBlankHeader = isBlankHeader(currentHeaders);
      rowNumber = 0;
      continue;
    }
    if (block.type !== 'table_row') continue;

    if (pendingBlankHeader && rowNumber === 0) {
      const promotedHeaders = promotableHeaderRow(block);
      if (promotedHeaders) {
        currentHeaders = promotedHeaders;
        pendingBlankHeader = false;
        continue;
      }
      currentHeaders = inferBlankTableHeaders(chapter, currentHeaders.length) || currentHeaders;
    }

    pendingBlankHeader = false;
    rowNumber += 1;
    const fields = tableCells(block)
      .map((cell, cellIndex) => ({
        label: fallbackTableFieldLabel(currentHeaders, cellIndex),
        text: tableDisplayText(
          fallbackTableFieldLabel(currentHeaders, cellIndex),
          textContent(getTranslation(cell)),
          chapter
        )
      }))
      .filter((field) => field.text);
    if (fields.length === 0) continue;
    renderedRowNumber += 1;
    rows.push({
      rowNumber: renderedRowNumber,
      heading: fields[0].text,
      fields
    });
  }

  return rows;
}

function tableReviewSampleRows(chapter) {
  const rows = tableReviewRows(chapter);
  if (rows.length <= 3) return rows;
  return [rows[0], rows[Math.floor(rows.length / 2)], rows.at(-1)];
}

function renderTableReview(product, qa, chapters) {
  const tableChapters = qa.chapters.filter((chapter) => chapter.tableRendering.reviewRecommended);
  const chapterData = new Map(chapters.map(({ chapter, data }) => [chapter, data]));
  const chapterSections = tableChapters.map((chapter) => {
    const stats = chapter.tableRendering;
    const samples = tableReviewSampleRows(chapterData.get(chapter.chapter) || {})
      .map((row) => {
        const fields = row.fields
          .map((field) => `    - ${field.label || 'Unlabeled'}: ${field.text}`)
          .join('\n');
        return `- Row ${row.rowNumber}: ${row.heading}\n${fields}`;
      })
      .join('\n');
    return `## Chapter ${chapter.chapter}: ${chapter.title}

- Source rows: ${stats.rows}
- Rendered rows: ${stats.renderedRows}
- Max source cells per row: ${stats.maxCells}
- Blank header rows resolved: ${stats.resolvedBlankHeaders}/${stats.blankHeaders}
- Generic labels: ${stats.genericLabels}

${samples || '- No rendered table row sample available.'}`;
  }).join('\n\n');

  return `# Table Rendering Review: ${product.title}

Generated: ${qa.generatedAt}

These samples expand the first, middle, and last rendered table entries for each table-heavy chapter. Use them to verify that the EPUB's list-style table rendering preserves row headings, field labels, and representative cell content.

${chapterSections || 'No table-heavy chapters flagged.'}
`;
}

function reviewNavigationTargets(product, chapters) {
  const chapterLinks = chapters.map(({ chapter, data }) => ({
    href: `EPUB/text/${chapterFileName(chapter)}`,
    text: data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`,
  }));
  return [
    { href: 'EPUB/cover.xhtml', text: 'Cover' },
    { href: 'EPUB/frontmatter.xhtml', text: 'Copyright and Source Note' },
    ...(Array.isArray(product.aboutThisEdition) && product.aboutThisEdition.length > 0
      ? [{ href: 'EPUB/about.xhtml', text: introductionTitle }]
      : []),
    chapterLinks[0],
    chapterLinks[Math.floor(chapterLinks.length / 2)],
    chapterLinks.at(-1),
  ].filter(Boolean);
}

function reviewProseTargets(chapters, qa) {
  const tableHeavy = new Set((qa.chapters || [])
    .filter((chapter) => chapter.tableRendering?.reviewRecommended)
    .map((chapter) => chapter.chapter));
  const proseChapters = chapters
    .filter(({ chapter }) => !tableHeavy.has(chapter))
    .map(({ chapter, data }) => ({
      chapter,
      epubEntry: `EPUB/text/${chapterFileName(chapter)}`,
      title: data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`,
    }));
  if (proseChapters.length <= 3) return proseChapters;
  return [proseChapters[0], proseChapters[Math.floor(proseChapters.length / 2)], proseChapters.at(-1)];
}

function proseFlowMetrics(chapterData) {
  let sourceParagraphs = 0;
  let renderedParagraphs = 0;
  let splitParagraphs = 0;
  let maxWords = 0;
  for (const block of chapterData.content || []) {
    if (block.type !== 'paragraph') continue;
    const sentences = getParagraphTranslations(block);
    if (sentences.length === 0) continue;
    sourceParagraphs += 1;
    const groups = splitParagraphSentences(sentences);
    renderedParagraphs += groups.length;
    if (groups.length > 1) splitParagraphs += 1;
    for (const group of groups) {
      const chunk = group.join(' ');
      maxWords = Math.max(maxWords, wordCount(chunk));
    }
  }
  return {
    sourceParagraphs,
    renderedParagraphs,
    splitParagraphs,
    maxWords,
  };
}

function renderReviewChecklist(product, qa, chapters) {
  const tableChapters = qa.chapters.filter((chapter) => chapter.tableRendering.reviewRecommended);
  const chapterData = new Map(chapters.map(({ chapter, data }) => [chapter, data]));
  const languageTool = languageToolCacheSummary(product);
  const navigationTargets = reviewNavigationTargets(product, chapters)
    .map((target) => `  - \`${target.href}\`: ${target.text}`)
    .join('\n');
  const proseTargets = reviewProseTargets(chapters, qa)
    .map((target) => {
      const metrics = proseFlowMetrics(chapterData.get(target.chapter) || {});
      return `  - \`${target.epubEntry}\`: ${target.title} (${metrics.renderedParagraphs} rendered paragraphs, ${metrics.splitParagraphs} source paragraph splits, max ${metrics.maxWords} words)`;
    })
    .join('\n');
  const kdp = product.kdp || {};
  const categories = Array.isArray(kdp.categories) ? kdp.categories : [];
  const keywords = Array.isArray(kdp.keywords) ? kdp.keywords : [];
  const tableItems = tableChapters.map((chapter) => {
    const stats = chapter.tableRendering;
    const samples = chapterTableRowTitles(chapterData.get(chapter.chapter) || {})
      .map((title) => `  - ${title}`)
      .join('\n') || '  - No rendered table row sample';
    return `### Chapter ${chapter.chapter}: ${chapter.title}

- EPUB entry: \`EPUB/text/chapter-${chapter.chapter}.xhtml\`
- Rows: ${stats.rows}
- Max source cells per row: ${stats.maxCells}
- Rendered rows: ${stats.renderedRows}
- Blank header rows resolved: ${stats.resolvedBlankHeaders}/${stats.blankHeaders}
- Generic labels: ${stats.genericLabels}
- Spot-check rows:
${samples}`;
  }).join('\n\n');

  return `# Publication Review Checklist: ${product.title}

Generated: ${qa.generatedAt}

## Automated Gate Summary

- EPUB QA errors: ${qa.errors.length}
- EPUB QA warnings: ${qa.warnings.length}
- Cover: ${qa.coverImage?.width || '?'}x${qa.coverImage?.height || '?'} ${qa.coverImage?.alpha?.fullyOpaque ? 'fully opaque' : 'opacity not confirmed'}
- Rendered table rows: ${qa.tableRendering.rows}
- Paragraph splits for e-reader comfort: ${qa.paragraphRendering.splits}
- Long rendered paragraphs: ${qa.paragraphRendering.longParagraphs}

## Local Conversion Smoke Tests

- Run \`make ebook-validate SLUG=${product.slug}\`.
- Run \`make ebook-smoke-calibre SLUG=${product.slug}\` on a machine with Calibre installed.
- Run \`make ebook-manual-qa SLUG=${product.slug} INIT=1\` to create the manual signoff template.
- After Kindle Previewer or bundled Amazon converter and local reader checks pass, run \`make ebook-local-signoff SLUG=${product.slug} CHECKED_BY="Garrett M. Petersen" KINDLE_PREVIEWER_VERSION="<version>"\`.
- ${languageTool.line}
- After Kindle/KDP review, run \`make ebook-qa SLUG=${product.slug} REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1\`.

## Manual Reader QA

- Open \`dist/ebooks/${product.slug}/${product.slug}.epub\` in Kindle Previewer and confirm conversion has no blocking errors.
- Open \`dist/ebooks/${product.slug}/${product.slug}.epub\` in Calibre or another EPUB reader in light and dark mode.
- Use \`dist/ebooks/${product.slug}/cover.jpg\` as the KDP cover upload file.
- Use \`dist/ebooks/${product.slug}/kdp-upload-fields.json\` as the source of record for KDP form fields.
- The generated cover is already checked for opaque pixels and the packaged cover page uses an explicit white background; still confirm the cover appears as one page in Kindle Previewer.
- Frontmatter text is checked by automated QA; still confirm it displays normally in the reader.
- Check the prose-flow targets below for paragraph flow.
- Check the table-heavy chapters below on a narrow/mobile-sized reading pane.

## Navigation Targets

Open these entries from the EPUB table of contents and confirm each lands on the expected section:

${navigationTargets || '- No navigation targets available.'}

## Prose Flow Targets

Open these ordinary prose chapters and skim several pages in each reader mode for paragraph flow, indentation, and comfortable line wrapping:

${proseTargets || '- No prose-flow targets available.'}

## KDP Field Targets

- Title: ${product.title}
- Subtitle: ${product.subtitle || ''}
- Author: ${product.author}
- Translator: ${product.translator}
- Publisher: ${product.publisher || ''}
- Language: ${product.language || 'en'}
- Series: ${product.series || ''}
- Series number: ${product.seriesNumber || ''}
- ISBN: Leave blank unless assigning your own ISBN.
- Edition: ${editionField(product)}
- Edition status: ${product.editionStatus || ''}
- Suggested list price USD: ${kdp.suggestedListPriceUsd || ''}
- Publishing rights: ${kdp.publishingRights || ''}
- AI-generated content: ${kdp.aiGeneratedContent || ''}
- Product description: ${product.productDescription || product.description || ''}
Categories:
${markdownList(categories)}
Keywords:
${markdownList(keywords)}

## Table-Heavy Chapters

These chapters are intentionally rendered as list-style entries instead of wide tables.

${tableItems || 'No table-heavy chapters flagged.'}
`;
}

function loadProducts(args) {
  const manifest = readJson(manifestPath);
  const products = manifest.products || [];
  if (args.all) return products.map((product) => applyPublicationDescriptions(product));
  if (!args.book) {
    throw new Error('Missing --book. Use --book shiji or --all.');
  }
  const matches = products.filter((product) => product.book === args.book);
  const resolvedMatches = matches.map((product) => applyPublicationDescriptions(product));
  if (args['all-products']) return resolvedMatches;
  if (resolvedMatches.length === 1) return resolvedMatches;
  throw new Error(`Book "${args.book}" has ${matches.length} products. Use --all-products or a more specific selector.`);
}

function collectChapterBlocks(chapter, qa, chapterQa, footnotes = [], ebookPeople = null) {
  const blocks = [];
  const chapterContext = ebookPeople?.chapterContexts.get(String(chapter.meta.chapter).padStart(3, '0')) ?? null;
  let currentHeaders = inferInitialTableHeaders(chapter);
  let currentHeaderItems = [];
  let pendingBlankHeader = false;
  let tableRowNumber = 0;
  const tableStats = chapterQa.tableRendering;

  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    if (block.type === 'paragraph') {
      pendingBlankHeader = false;
      const sentenceItems = block.sentences || [];
      const units = [];
      for (const item of sentenceItems) {
        const main = getMainText(item);
        let rendered = renderEbookUnit(item, main, chapterContext, ebookPeople);
        const fnText = getFootnote(item);
        if (!main && !fnText) continue;
        if (fnText) {
          const fnNum = footnotes.length + 1;
          const fnId = `fn-${chapter.meta.chapter}-${fnNum}`;
          footnotes.push({
            id: fnId,
            number: fnNum,
            text: fnText
          });
          rendered += `<a epub:type="noteref" href="#${fnId}"><sup>${fnNum}</sup></a>`;
        }
        rendered = wrapEbookUnitAnchor(item, rendered);
        units.push({ plain: main, rendered });
      }
      if (units.length === 0) continue;
      const plainSentences = units.map(u => u.plain);
      const text = textContent(plainSentences.join(' '));
      if (!text && sentenceItems.length > 0) {
        qa.errors.push(`Missing paragraph translation in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      if (hasPlaceholder(text)) {
        qa.errors.push(`Placeholder text in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      const hasUnmarkedSentenceCjk = plainSentences.some((sentence, sentenceIndex) => {
        const item = sentenceItems[sentenceIndex];
        return hasCjk(sentence) && !allowsChineseCharacters(item) && hasUnmarkedCjk(sentence);
      });
      if (hasCjk(text) && !allowsChineseCharacters(block) && hasUnmarkedSentenceCjk) {
        qa.warnings.push(`Chinese characters in English paragraph in ${chapter.meta.chapter} block ${blockIndex + 1}`);
      }
      if (hasCjk(text)) {
        recordCjkOccurrence(
          qa,
          chapter,
          blockIndex,
          text,
          allowsChineseCharacters(block) || sentenceItems.some(allowsChineseCharacters)
        );
      }
      if (text) {
        const groups = splitParagraphSentences(units);
        if (groups.length > 1) qa.paragraphRendering.splits += groups.length - 1;
        for (const group of groups) {
          const chunkWords = wordCount(group.map(u => u.plain).join(' '));
          if (chunkWords > qa.paragraphRendering.maxWords) qa.paragraphRendering.maxWords = chunkWords;
          if (chunkWords > 350) {
            qa.paragraphRendering.longParagraphs += 1;
            qa.warnings.push(`Long rendered paragraph in ${chapter.meta.chapter} block ${blockIndex + 1}: ${chunkWords} words`);
          }
          const chunkHtml = group.map(u => u.rendered).join(' ');
          blocks.push(`<p>${chunkHtml}</p>`);
        }
      }
      continue;
    }

    if (block.type === 'table_header') {
      currentHeaderItems = block.sentences || [];
      currentHeaders = currentHeaderItems.map(getTranslation).map(textContent);
      currentHeaders = inferChapterTableHeaders(chapter, currentHeaders) || currentHeaders;
      tableRowNumber = 0;
      tableStats.headers += 1;
      tableStats.maxCells = Math.max(tableStats.maxCells, currentHeaders.length);
      pendingBlankHeader = isBlankHeader(currentHeaders);
      if (pendingBlankHeader) {
        tableStats.blankHeaders += 1;
      }
      const summary = renderTableHeaderSummary(currentHeaders, currentHeaderItems, chapterContext, ebookPeople);
      if (summary) blocks.push(summary);
      qa.tableRendering.headers += 1;
      continue;
    }

    if (block.type === 'table_row') {
      if (pendingBlankHeader && tableRowNumber === 0) {
        const promotedHeaders = promotableHeaderRow(block);
        if (promotedHeaders) {
          currentHeaders = promotedHeaders;
          currentHeaderItems = tableCells(block);
          tableStats.resolvedBlankHeaders += 1;
          tableStats.promotedHeaderRows += 1;
          tableStats.maxCells = Math.max(tableStats.maxCells, currentHeaders.length);
          const summary = renderTableHeaderSummary(currentHeaders, currentHeaderItems, chapterContext, ebookPeople);
          if (summary) blocks.push(summary);
          pendingBlankHeader = false;
          continue;
        }
        const inferredHeaders = inferBlankTableHeaders(chapter, currentHeaders.length);
        if (inferredHeaders) {
          currentHeaders = inferredHeaders;
          tableStats.resolvedBlankHeaders += 1;
          tableStats.inferredBlankHeaders += 1;
        }
      }
      pendingBlankHeader = false;
      tableRowNumber += 1;
      const cells = tableCells(block);
      const translatedCells = cells.filter((cell) => textContent(getTranslation(cell))).length;
      tableStats.rows += 1;
      tableStats.cells += cells.length;
      tableStats.translatedCells += translatedCells;
      tableStats.maxCells = Math.max(tableStats.maxCells, cells.length);
      if (translatedCells === 0) tableStats.emptyRows += 1;
      currentHeaders = expandTableHeadersForRow(chapter, currentHeaders, cells.length);
      const entry = renderTableEntry(
        block,
        currentHeaders,
        chapter,
        blockIndex,
        tableRowNumber,
        qa,
        tableStats,
        footnotes,
        chapterContext,
        ebookPeople,
      );
      if (entry) {
        blocks.push(entry);
        tableStats.renderedRows += 1;
      }
      qa.tableRendering.rows += 1;
      continue;
    }

    qa.warnings.push(`Unsupported block type "${block.type}" in ${chapter.meta.chapter} block ${blockIndex + 1}`);
  }

  return blocks;
}

function renderChapter(chapter, qa, chapterQa, ebookPeople = null) {
  const chapterId = chapter.meta.chapter;
  const zhTitle = chapter.meta.title?.zh || `Chapter ${chapterId}`;
  const enTitle = chapter.meta.title?.en || `Chapter ${Number.parseInt(chapterId, 10)}`;
  const footnotes = [];
  const blocks = collectChapterBlocks(chapter, qa, chapterQa, footnotes, ebookPeople);
  if (blocks.length === 0) qa.errors.push(`No rendered English content for chapter ${chapterId}`);
  const tableStats = chapterQa.tableRendering;
  if (tableStats.rows > 0 && tableStats.renderedRows === 0) {
    qa.errors.push(`No rendered table rows for chapter ${chapterId} despite ${tableStats.rows} source table row(s).`);
  }
  if (tableStats.rows >= 100 || tableStats.maxCells >= 8) {
    tableStats.reviewRecommended = true;
  }
  if (tableStats.genericLabels > 0 && chapter?.meta?.book === 'shiji') {
    qa.warnings.push(`Generic table labels in chapter ${chapterId}: ${tableStats.genericLabels} Column-N label(s).`);
  }
  const unresolvedBlankHeaders = tableStats.blankHeaders - tableStats.resolvedBlankHeaders;
  if (unresolvedBlankHeaders > 0 && chapter?.meta?.book === 'shiji') {
    qa.warnings.push(`Manual table label QA recommended for chapter ${chapterId}: ${unresolvedBlankHeaders} unresolved blank table header row(s).`);
  }

  let footnotesSection = '';
  if (footnotes.length > 0) {
    footnotesSection = '\n    ' + footnotes.map((fn) =>
      `<aside epub:type="footnote" id="${fn.id}">\n      <p><sup>${fn.number}</sup> ${escapeXml(fn.text)}</p>\n    </aside>`
    ).join('\n    ');
  }

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
    ${footnotesSection}
  </section>
</body>
</html>
`;
}

function renderCover(product, bookInfo) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${escapeXml(product.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles/ebook.css" />
</head>
<body class="cover-page">
  <section epub:type="cover">
    <img class="cover-image" src="images/cover.png" alt="${escapeXml(product.title)} cover" />
  </section>
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

function convertPngToJpeg(pngPath, jpegPath, qa) {
  const converters = [
    {
      command: 'sips',
      args: [pngPath, '-s', 'format', 'jpeg', '-s', 'formatOptions', '95', '--out', jpegPath]
    },
    {
      command: 'magick',
      args: [pngPath, '-background', 'white', '-alpha', 'remove', '-quality', '95', jpegPath]
    },
    {
      command: 'convert',
      args: [pngPath, '-background', 'white', '-alpha', 'remove', '-quality', '95', jpegPath]
    }
  ];

  for (const converter of converters) {
    try {
      childProcess.execFileSync(converter.command, converter.args, { stdio: 'ignore' });
      if (fs.existsSync(jpegPath) && fs.statSync(jpegPath).size > 0) {
        return true;
      }
    } catch (_error) {
      fs.rmSync(jpegPath, { force: true });
    }
  }

  qa.warnings.push('Could not generate cover.jpg; install macOS sips or ImageMagick and rerun the ebook generator.');
  return false;
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
    ${product.publisher ? `<p>Published by ${escapeXml(product.publisher)}.</p>` : ''}
    <p>${escapeXml(product.rights || '')}</p>
    <p>${escapeXml(aiDisclosure)}</p>
    <p>Chinese source texts were drawn from ${escapeXml(sources)}.</p>
    ${product.editionNumber ? `<p>Edition: ${escapeXml(editionField(product))}.</p>` : ''}
    <p>Edition status: ${escapeXml(product.editionStatus || '')}.</p>
    ${product.editionNote ? `<p>${escapeXml(product.editionNote)}</p>` : ''}
  </section>
</body>
</html>
`;
}

function renderAboutThisEdition(product) {
  const paragraphs = Array.isArray(product.aboutThisEdition) ? product.aboutThisEdition : [];
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${introductionTitle}</title>
  <link rel="stylesheet" type="text/css" href="styles/ebook.css" />
</head>
<body>
  <section epub:type="frontmatter">
    <h1>${introductionTitle}</h1>
    ${paragraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('\n    ')}
  </section>
</body>
</html>
`;
}

function ebookGlossaryReferences(person, ebookPeople) {
  return person.references.filter((reference) =>
    reference.book === ebookPeople.book && ebookPeople.chapterIds.has(reference.chapter)
  );
}

function renderEbookGlossaryFamily(person, ebookPeople) {
  const rows = [];
  const seen = new Set();
  for (const relationship of person.familyRelationships) {
    const key = `${relationship.edgeId}:${relationship.value.relation}:${relationship.value.personId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const target = PEOPLE_EBOOK.peopleById.get(relationship.value.personId);
    if (!target) continue;
    const label = `${humanizePeopleValue(relationship.value.relation)} ${personFullDisplayName(target)}`;
    const targetFile = ebookPeople.fileByPersonId.get(target.id);
    rows.push(targetFile
      ? `<li><a href="${escapeXml(targetFile)}#${ebookPersonAnchor(target.id)}">${escapeXml(label)}</a></li>`
      : `<li>${escapeXml(label)}</li>`);
  }
  return rows.length ? `<h3>Family</h3><ul class="glossary-family">${rows.join('')}</ul>` : '';
}

function renderEbookGlossaryReferences(person, ebookPeople, chapterTitles) {
  const groups = new Map();
  for (const reference of ebookGlossaryReferences(person, ebookPeople)) {
    if (!groups.has(reference.chapter)) groups.set(reference.chapter, []);
    groups.get(reference.chapter).push(reference);
  }
  if (!groups.size) return '';
  const rows = [...groups.entries()].sort((left, right) => left[0].localeCompare(right[0])).map(([chapter, refs]) => {
    const title = chapterTitles.get(chapter) || `Chapter ${Number.parseInt(chapter, 10)}`;
    const links = refs.map((reference, index) =>
      `<a class="glossary-mention-link" href="../text/${chapterFileName(chapter)}#${peopleSentenceAnchor('en', reference.unitId)}">${index + 1}</a>`
    ).join(', ');
    return `<li><span>${escapeXml(title)}</span>: ${links}</li>`;
  });
  return `<h3>Mentions</h3><ul class="glossary-mentions">${rows.join('')}</ul>`;
}

function renderEbookGlossaryEntry(person, ebookPeople, chapterTitles) {
  const aliases = personAlternateNames(person);
  const roles = person.roles.map((role) => role.label);
  const lifeSummary = personLifeSummary(person);
  return `<section class="glossary-entry" id="${ebookPersonAnchor(person.id)}">
  <h2>${escapeXml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeXml(person.preferredName.zh)}</span>` : ''}</h2>
  <p class="glossary-description">${escapeXml(person.description.en)}</p>
  ${lifeSummary ? `<p class="glossary-dates">${escapeXml(lifeSummary)}</p>` : ''}
  ${roles.length ? `<p><strong>Roles:</strong> ${escapeXml(formatList(roles))}</p>` : ''}
  ${aliases.length ? `<p><strong>Other names:</strong> ${escapeXml(formatList(aliases))}</p>` : ''}
  ${renderEbookGlossaryFamily(person, ebookPeople)}
  ${renderEbookGlossaryReferences(person, ebookPeople, chapterTitles)}
</section>`;
}

function renderEbookPeopleIndex(ebookPeople) {
  const items = ebookPeople.people.map((person) => {
    const file = ebookPeople.fileByPersonId.get(person.id);
    return `<li><a class="glossary-person-link" href="${escapeXml(file)}#${ebookPersonAnchor(person.id)}">` +
      `${escapeXml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeXml(person.preferredName.zh)}</span>` : ''}` +
      `</a><span>${escapeXml(person.description.en)}</span></li>`;
  }).join('\n      ');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${peopleGlossaryTitle}</title>
  <link rel="stylesheet" type="text/css" href="../styles/ebook.css" />
</head>
<body>
  <nav epub:type="glossary" class="people-glossary-index">
    <h1>${peopleGlossaryTitle}</h1>
    <ol>${items}</ol>
  </nav>
</body>
</html>`;
}

function renderEbookGlossaryShard(shard, ebookPeople, chapterTitles) {
  const entries = shard.people.map((person) =>
    renderEbookGlossaryEntry(person, ebookPeople, chapterTitles)
  ).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${peopleGlossaryTitle} ${shard.number}</title>
  <link rel="stylesheet" type="text/css" href="../styles/ebook.css" />
</head>
<body>
  <section epub:type="glossary" class="people-glossary">
    <h1>${peopleGlossaryTitle}</h1>
    ${entries}
  </section>
</body>
</html>`;
}

function renderNav(product, chapters, ebookPeople = null) {
  const chapterItems = chapters.map(({ chapter, data }) => {
    const title = data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`;
    return `<li><a href="text/${chapterFileName(chapter)}">${escapeXml(title)}</a></li>`;
  }).join('\n      ');
  const hasAbout = Array.isArray(product.aboutThisEdition) && product.aboutThisEdition.length > 0;
  const aboutTocItem = hasAbout ? `<li><a href="about.xhtml">${introductionTitle}</a></li>` : '';
  const aboutLandmarkItem = hasAbout ? `<li><a epub:type="preface" href="about.xhtml">${introductionTitle}</a></li>` : '';
  const peopleTocItem = ebookPeople ? `<li><a href="people/index.xhtml">${peopleGlossaryTitle}</a></li>` : '';
  const peopleLandmarkItem = ebookPeople ? `<li><a epub:type="glossary" href="people/index.xhtml">${peopleGlossaryTitle}</a></li>` : '';

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
      ${aboutTocItem}
      ${chapterItems}
      ${peopleTocItem}
    </ol>
  </nav>
  <nav epub:type="landmarks" id="landmarks" aria-label="Guide">
    <h2>Guide</h2>
    <ol>
      <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
      <li><a epub:type="copyright-page" href="frontmatter.xhtml">Copyright and Source Note</a></li>
      ${aboutLandmarkItem}
      <li><a epub:type="bodymatter" href="text/${chapterFileName(chapters[0]?.chapter || '001')}">Start Reading</a></li>
      ${peopleLandmarkItem}
    </ol>
  </nav>
</body>
</html>
`;
}

function renderPackage(product, chapters, generatedAt, ebookPeople = null) {
  const items = chapters.map(({ chapter }) => `    <item id="chapter-${chapter}" href="text/${chapterFileName(chapter)}" media-type="application/xhtml+xml" />`).join('\n');
  const spine = chapters.map(({ chapter }) => `    <itemref idref="chapter-${chapter}" />`).join('\n');
  const hasAbout = Array.isArray(product.aboutThisEdition) && product.aboutThisEdition.length > 0;
  const aboutItem = hasAbout ? '    <item id="about" href="about.xhtml" media-type="application/xhtml+xml" />\n' : '';
  const aboutSpine = hasAbout ? '    <itemref idref="about" />\n' : '';
  const peopleItems = ebookPeople
    ? `    <item id="people-index" href="people/index.xhtml" media-type="application/xhtml+xml" />\n` +
      ebookPeople.shards.map((shard) =>
        `    <item id="people-${String(shard.number).padStart(3, '0')}" href="people/${shard.file}" media-type="application/xhtml+xml" />`
      ).join('\n') + '\n'
    : '';
  const peopleSpine = ebookPeople
    ? `    <itemref idref="people-index" />\n` + ebookPeople.shards.map((shard) =>
      `    <itemref idref="people-${String(shard.number).padStart(3, '0')}" />`
    ).join('\n') + '\n'
    : '';
  const subjects = packageSubjects(product)
    .map((subject) => `    <dc:subject>${escapeXml(subject)}</dc:subject>`)
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="en" prefix="schema: http://schema.org/">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${escapeXml(productId(product))}</dc:identifier>
    <dc:title id="title">${escapeXml(product.title)}</dc:title>
    ${product.subtitle ? `<dc:title id="subtitle">${escapeXml(product.subtitle)}</dc:title>
    <meta refines="#title" property="title-type">main</meta>
    <meta refines="#subtitle" property="title-type">subtitle</meta>` : '<meta refines="#title" property="title-type">main</meta>'}
    <dc:language>${escapeXml(product.language || 'en')}</dc:language>
    <dc:creator id="author">${escapeXml(product.author)}</dc:creator>
    <meta refines="#author" property="role" scheme="marc:relators">aut</meta>
    <dc:contributor id="translator">${escapeXml(product.translator)}</dc:contributor>
    <meta refines="#translator" property="role" scheme="marc:relators">trl</meta>
    <dc:publisher>${escapeXml(product.publisher || '')}</dc:publisher>
    <dc:rights>${escapeXml(product.rights || '')}</dc:rights>
    <dc:description>${escapeXml(product.description || '')}</dc:description>
${subjects}
    <meta property="dcterms:modified">${generatedAt}</meta>
    <meta property="belongs-to-collection" id="series">${escapeXml(product.series || product.title)}</meta>
    <meta refines="#series" property="collection-type">series</meta>
    <meta property="group-position">${escapeXml(product.seriesNumber || 1)}</meta>
    <meta property="schema:accessibilityFeature">alternativeText</meta>
    <meta property="schema:accessibilityFeature">readingOrder</meta>
    <meta property="schema:accessibilityFeature">tableOfContents</meta>
    <meta property="schema:accessibilityHazard">none</meta>
    <meta property="schema:accessMode">textual</meta>
    <meta property="schema:accessModeSufficient">textual</meta>
    <meta property="schema:accessibilitySummary">This reflowable EPUB includes a navigable table of contents, reading-order spine, cover alternative text, and text-based chapter content.</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="css" href="styles/ebook.css" media-type="text/css" />
    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" />
    <item id="cover" href="images/cover.png" media-type="image/png" properties="cover-image" />
    <item id="frontmatter" href="frontmatter.xhtml" media-type="application/xhtml+xml" />
${aboutItem}${items}
${peopleItems}
  </manifest>
  <spine>
    <itemref idref="cover-page" />
    <itemref idref="frontmatter" />
${aboutSpine}${spine}
${peopleSpine}
  </spine>
</package>
`;
}

function renderCss() {
  return `html {
  height: 100%;
}

body {
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
  height: 100%;
  padding: 0;
}

.cover-page section {
  background: #ffffff;
  box-sizing: border-box;
  height: 100%;
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

.person-link,
.glossary-person-link,
.glossary-family a,
.glossary-mentions a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.12em;
}

.people-glossary-index ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.people-glossary-index li {
  border-top: 0.06em solid #d8d2c4;
  margin: 0;
  padding: 0.55em 0;
}

.people-glossary-index li > a {
  display: block;
  font-weight: bold;
}

.people-glossary-index li > span {
  color: #59554b;
  display: block;
  font-size: 0.9em;
  margin-top: 0.1em;
}

.glossary-entry {
  border-top: 0.08em solid #a9a293;
  margin-top: 1.6em;
  padding-top: 0.9em;
  page-break-before: auto;
}

.glossary-entry h2 {
  font-size: 1.2em;
  margin: 0 0 0.45em;
}

.glossary-entry h3 {
  font-size: 1em;
  margin: 0.9em 0 0.3em;
}

.glossary-entry p {
  text-indent: 0;
}

.glossary-description {
  font-weight: bold;
}

.glossary-dates {
  color: #59554b;
}

.glossary-family,
.glossary-mentions {
  margin: 0.25em 0 0.75em;
  padding-left: 1.4em;
}

[epub\\:type="noteref"] {
  font-size: 0.65em;
  vertical-align: super;
  line-height: 0;
  text-decoration: none;
  color: #c0392b;
}

[epub\\:type="footnote"] {
  font-size: 0.85em;
  margin-top: 1em;
  padding-top: 0.5em;
  border-top: 1px solid #d8d2c4;
  page-break-inside: avoid;
}

[epub\\:type="footnote"] p {
  text-indent: 0;
  margin: 0.2em 0;
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

function normalizeFileTimes(dir, timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return;
  const visit = (entry) => {
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) visit(path.join(entry, child));
    }
    fs.utimesSync(entry, date, date);
  };
  visit(dir);
}

function zipEpub(buildDir, epubPath) {
  fs.rmSync(epubPath, { force: true });
  childProcess.execFileSync('zip', ['-X0', epubPath, 'mimetype'], { cwd: buildDir, stdio: 'ignore' });
  childProcess.execFileSync('zip', ['-Xr9D', epubPath, 'META-INF', 'EPUB'], { cwd: buildDir, stdio: 'ignore' });
}

function renderUploadBundleReadme(product, manifest) {
  const upload = manifest.uploadArtifacts || {};
  const support = manifest.supportArtifacts || {};
  return `# KDP Upload Bundle: ${product.title}

Use this directory while creating the unpublished KDP draft.

## Upload These Files

- Manuscript: \`${upload.epub?.file || `${product.slug}.epub`}\`
- Cover: \`${upload.coverJpeg?.file || upload.cover?.file || 'cover.jpg'}\`

## Use For Form Entry

- KDP draft worksheet: \`${support.kdpDraftWorksheet?.file || 'kdp-draft-worksheet.md'}\`
- Structured KDP fields: \`${support.kdpUploadFields?.file || 'kdp-upload-fields.json'}\`
- Upload checklist: \`${support.uploadChecklist?.file || 'upload-checklist.md'}\`

## Do Not Upload As Manuscript Or Cover

The worksheet, JSON, checklist, README, and checksum file are support files only.

## Integrity

Before upload, compare files against \`SHA256SUMS.txt\`. After Kindle Previewer,
bundled Amazon converter, and local reader checks pass, run:

\`\`\`bash
make ebook-local-signoff SLUG=${product.slug} CHECKED_BY="Garrett M. Petersen" KINDLE_PREVIEWER_VERSION="<version>"
\`\`\`

After a KDP draft ingests successfully, run:

\`\`\`bash
make ebook-kdp-signoff SLUG=${product.slug} CHECKED_BY="Garrett M. Petersen" CONFIRM_KDP_DRAFT=1
make ebook-qa SLUG=${product.slug} REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1
\`\`\`
`;
}

function writeUploadBundle(product, productDir, manifest) {
  const uploadDir = path.join(productDir, 'upload');
  cleanDir(uploadDir);
  const files = [
    `${product.slug}.epub`,
    fs.existsSync(path.join(productDir, 'cover.jpg')) ? 'cover.jpg' : 'cover.png',
    'kdp-draft-worksheet.md',
    'kdp-upload-fields.json',
    'upload-checklist.md',
  ];
  for (const file of files) {
    fs.copyFileSync(path.join(productDir, file), path.join(uploadDir, file));
  }
  writeFile(path.join(uploadDir, 'README.md'), renderUploadBundleReadme(product, manifest));
  const checksums = [...files, 'README.md']
    .map((file) => `${sha256File(path.join(uploadDir, file))}  ${file}`)
    .join('\n');
  writeFile(path.join(uploadDir, 'SHA256SUMS.txt'), `${checksums}\n`);
}

function publicationManifest(product, productDir, epubPath, qa, generatedAt) {
  const epubFile = path.basename(epubPath);
  const supportArtifacts = {
    metadata: artifactInfo(productDir, 'metadata.json'),
    ...(fs.existsSync(path.join(productDir, 'kdp-upload-fields.json')) ? { kdpUploadFields: artifactInfo(productDir, 'kdp-upload-fields.json') } : {}),
    ...(fs.existsSync(path.join(productDir, 'kdp-draft-worksheet.md')) ? { kdpDraftWorksheet: artifactInfo(productDir, 'kdp-draft-worksheet.md') } : {}),
    qaReport: artifactInfo(productDir, 'qa-report.json'),
    tableReview: artifactInfo(productDir, 'table-review.md'),
    reviewChecklist: artifactInfo(productDir, 'review-checklist.md')
  };
  if (fs.existsSync(path.join(productDir, 'upload-checklist.md'))) {
    supportArtifacts.uploadChecklist = artifactInfo(productDir, 'upload-checklist.md');
  }
  if (fs.existsSync(path.join(productDir, 'upload', 'README.md'))) {
    supportArtifacts.uploadBundleReadme = artifactInfo(productDir, 'upload/README.md');
  }
  if (fs.existsSync(path.join(productDir, 'upload', 'SHA256SUMS.txt'))) {
    supportArtifacts.uploadBundleChecksums = artifactInfo(productDir, 'upload/SHA256SUMS.txt');
  }
  return {
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle || '',
    generatedAt,
    qa: {
      errors: qa.errors.length,
      warnings: qa.warnings.length
    },
    uploadArtifacts: {
      epub: artifactInfo(productDir, epubFile),
      cover: artifactInfo(productDir, 'cover.png'),
      ...(fs.existsSync(path.join(productDir, 'cover.jpg')) ? { coverJpeg: artifactInfo(productDir, 'cover.jpg') } : {}),
      kdpMetadata: artifactInfo(productDir, 'kdp-metadata.md')
    },
    supportArtifacts
  };
}

function writePublicationManifest(product, productDir, epubPath, qa, generatedAt) {
  const manifest = publicationManifest(product, productDir, epubPath, qa, generatedAt);
  writeFile(path.join(productDir, 'publication-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function buildProduct(product) {
  const generatedAt = buildTimestamp(product);
  const bookInfo = getBookMetadata(product.book) || {};
  const productDir = path.join(outRoot, product.slug);
  const buildDir = path.join(productDir, 'content');
  const epubPath = path.join(productDir, `${product.slug}.epub`);
  const qa = {
    slug: product.slug,
    generatedAt,
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
    kdpMetadata: {
      file: 'kdp-metadata.md'
    },
    publicationManifest: {
      file: 'publication-manifest.json'
    },
    coverImage: null,
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
  validateCoverImage(coverPng, qa);
  const coverPngPath = path.join(productDir, 'cover.png');
  writeBinaryFile(coverPngPath, coverPng);
  convertPngToJpeg(coverPngPath, path.join(productDir, 'cover.jpg'), qa);
  writeFile(path.join(productDir, 'kdp-metadata.md'), renderKdpMetadata(product));
  writeFile(path.join(buildDir, 'EPUB', 'cover.xhtml'), renderCover(product, bookInfo));
  writeBinaryFile(path.join(buildDir, 'EPUB', 'images', 'cover.png'), coverPng);
  writeFile(path.join(buildDir, 'EPUB', 'frontmatter.xhtml'), renderFrontMatter(product, bookInfo));
  if (Array.isArray(product.aboutThisEdition) && product.aboutThisEdition.length > 0) {
    writeFile(path.join(buildDir, 'EPUB', 'about.xhtml'), renderAboutThisEdition(product));
  }

  const chapters = product.chapters.map((chapter) => {
    const file = path.join(repoRoot, 'data', product.book, `${chapter}.json`);
    const data = readJson(file);
    const chapterTitle = textContent(data.meta.title?.en || '');
    const chapterQa = {
      chapter,
      title: chapterTitle,
      sentenceCount: data.meta.sentenceCount || 0,
      translatedCount: data.meta.translatedCount || 0,
      tableRendering: emptyChapterTableStats()
    };
    qa.chapters.push(chapterQa);
    if (!chapterTitle) {
      qa.errors.push(`Missing English chapter title for ${product.book}/${chapter}`);
    }
    if ((data.meta.sentenceCount || 0) !== (data.meta.translatedCount || 0)) {
      qa.errors.push(`Chapter ${chapter} is not fully translated: ${data.meta.translatedCount}/${data.meta.sentenceCount}`);
    }
    return { chapter, data, qa: chapterQa };
  });
  const ebookPeople = buildEbookPeople(product);
  qa.peopleGlossary = ebookPeople ? {
    active: true,
    preview: ebookPeople.preview,
    people: ebookPeople.people.length,
    shards: ebookPeople.shards.length,
    expectedMentionLinks: ebookPeople.expectedMentionLinks,
    expectedBacklinks: ebookPeople.expectedBacklinks,
  } : {
    active: false,
    preview: false,
    reason: PEOPLE_EBOOK.reason ?? 'no-people-in-product',
    people: 0,
    shards: 0,
    expectedMentionLinks: 0,
    expectedBacklinks: 0,
  };

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
      renderChapter(chapter.data, qa, chapter.qa, ebookPeople)
    );
  }

  if (ebookPeople) {
    const chapterTitles = new Map(chapters.map(({ chapter, data }) => [
      chapter,
      data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`,
    ]));
    writeFile(path.join(buildDir, 'EPUB', 'people', 'index.xhtml'), renderEbookPeopleIndex(ebookPeople));
    for (const shard of ebookPeople.shards) {
      writeFile(
        path.join(buildDir, 'EPUB', 'people', shard.file),
        renderEbookGlossaryShard(shard, ebookPeople, chapterTitles),
      );
    }
  }

  writeFile(path.join(buildDir, 'EPUB', 'nav.xhtml'), renderNav(product, chapters, ebookPeople));
  writeFile(path.join(buildDir, 'EPUB', 'package.opf'), renderPackage(product, chapters, generatedAt, ebookPeople));
  writeFile(path.join(productDir, 'metadata.json'), JSON.stringify(product, null, 2) + '\n');
  writeFile(path.join(productDir, 'qa-report.json'), JSON.stringify(qa, null, 2) + '\n');
  writeFile(path.join(productDir, 'table-review.md'), renderTableReview(product, qa, chapters));
  writeFile(path.join(productDir, 'review-checklist.md'), renderReviewChecklist(product, qa, chapters));

  if (qa.errors.length > 0) {
    throw new Error(`${product.slug} has ${qa.errors.length} QA error(s). See ${path.relative(repoRoot, path.join(productDir, 'qa-report.json'))}`);
  }

  normalizeFileTimes(buildDir, generatedAt);
  zipEpub(buildDir, epubPath);
  const preliminaryManifest = publicationManifest(product, productDir, epubPath, qa, generatedAt);
  writeFile(path.join(productDir, 'kdp-upload-fields.json'), `${JSON.stringify(kdpUploadFields(product, preliminaryManifest), null, 2)}\n`);
  const manifestWithKdpFields = publicationManifest(product, productDir, epubPath, qa, generatedAt);
  writeFile(path.join(productDir, 'kdp-draft-worksheet.md'), renderKdpDraftWorksheet(product, manifestWithKdpFields));
  const manifestWithKdpWorksheet = publicationManifest(product, productDir, epubPath, qa, generatedAt);
  writeFile(path.join(productDir, 'upload-checklist.md'), renderUploadChecklist(product, qa, manifestWithKdpWorksheet));
  const manifestWithUploadChecklist = publicationManifest(product, productDir, epubPath, qa, generatedAt);
  writeUploadBundle(product, productDir, manifestWithUploadChecklist);
  writePublicationManifest(product, productDir, epubPath, qa, generatedAt);
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
