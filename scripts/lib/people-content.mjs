import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA_DIR = path.join(REPO_ROOT, 'data');
export const PEOPLE_DIR = path.join(DATA_DIR, 'people');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, file);
}

export function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value ?? '')).digest('hex')}`;
}

export function chapterPath(book, chapter) {
  return path.join(DATA_DIR, book, `${String(chapter).padStart(3, '0')}.json`);
}

export function extractionPath(book, chapter) {
  return path.join(PEOPLE_DIR, 'extractions', book, `${String(chapter).padStart(3, '0')}.json`);
}

export function packetPath(book, chapter) {
  return path.join(PEOPLE_DIR, 'generated', 'packets', book, `${String(chapter).padStart(3, '0')}.json`);
}

export function loadChapter(book, chapter) {
  const file = chapterPath(book, chapter);
  if (!fs.existsSync(file)) throw new Error(`Chapter not found: ${path.relative(REPO_ROOT, file)}`);
  return { file, chapter: readJson(file) };
}

export function chineseText(unit) {
  return String(unit?.zh ?? unit?.content ?? '');
}

export function englishText(unit) {
  if (!unit) return '';
  if (typeof unit.translation === 'string' && unit.translation.trim()) return unit.translation;
  if (typeof unit.idiomatic === 'string' && unit.idiomatic.trim()) return unit.idiomatic;
  if (typeof unit.literal === 'string' && unit.literal.trim()) return unit.literal;
  const translation = Array.isArray(unit.translations)
    ? unit.translations.find((item) => item?.lang === 'en') ?? unit.translations[0]
    : null;
  return String(translation?.idiomatic ?? translation?.literal ?? '');
}

export function literalText(unit) {
  if (!unit) return '';
  if (typeof unit.literal === 'string' && unit.literal.trim()) return unit.literal;
  if (unit.translation && typeof unit.translation === 'object' && typeof unit.translation.literal === 'string') {
    return unit.translation.literal;
  }
  const translation = Array.isArray(unit.translations)
    ? unit.translations.find((item) => item?.lang === 'en') ?? unit.translations[0]
    : null;
  return String(translation?.literal ?? '');
}

export function contentUnits(chapter) {
  const units = [];
  for (const [blockIndex, block] of (chapter.content ?? []).entries()) {
    const collections = [];
    if (Array.isArray(block.sentences)) collections.push(['sentences', block.sentences]);
    if (Array.isArray(block.cells)) collections.push(['cells', block.cells]);

    for (const [collection, items] of collections) {
      for (const [itemIndex, unit] of items.entries()) {
        const kind = collection === 'cells'
          ? 'table-body-cell'
          : block.type === 'table_header'
            ? 'table-header-cell'
            : 'paragraph-sentence';
        units.push({
          id: unit.id,
          kind,
          blockIndex,
          collection,
          itemIndex,
          zh: chineseText(unit),
          en: englishText(unit),
          literal: literalText(unit),
          source: unit,
        });
      }
    }
  }
  return units;
}

export function validateUnitIds(units, label = 'chapter') {
  const seen = new Set();
  for (const unit of units) {
    if (!unit.id || typeof unit.id !== 'string') {
      throw new Error(`${label} has a content unit without an ID at block ${unit.blockIndex} ${unit.collection}[${unit.itemIndex}]`);
    }
    if (seen.has(unit.id)) throw new Error(`${label} has duplicate content-unit ID ${unit.id}`);
    seen.add(unit.id);
  }
}

export function buildInputFingerprint(units) {
  validateUnitIds(units);
  const unitDigests = units.map((unit) => ({
    id: unit.id,
    zh: sha256(unit.zh),
    en: sha256(unit.en),
    literal: sha256(unit.literal),
  }));
  const chineseFingerprint = sha256(JSON.stringify(unitDigests.map(({ id, zh }) => [id, zh])));
  const englishFingerprint = sha256(JSON.stringify(unitDigests.map(({ id, en, literal }) => [id, en, literal])));
  return {
    unitCount: units.length,
    chapterFingerprint: sha256(JSON.stringify(unitDigests)),
    chineseFingerprint,
    englishFingerprint,
    unitDigests,
  };
}

export function sourceUnitAt(chapter, locator) {
  const unit = chapter.content?.[locator.blockIndex]?.[locator.collection]?.[locator.itemIndex];
  if (!unit || unit.id !== locator.id) {
    throw new Error(`Content unit locator is stale for ${locator.id}`);
  }
  return unit;
}

export function setTranslationField(chapter, locator, field, currentText, replacement) {
  const unit = sourceUnitAt(chapter, locator);
  const owners = [];
  if (Array.isArray(unit.translations)) {
    const translation = unit.translations.find((item) => item?.lang === 'en') ?? unit.translations[0];
    if (translation) owners.push({ owner: translation, key: field });
  }
  if (unit.translation && typeof unit.translation === 'object') owners.push({ owner: unit.translation, key: field });
  owners.push({ owner: unit, key: field });
  if (field === 'idiomatic' && typeof unit.translation === 'string') {
    owners.push({ owner: unit, key: 'translation' });
  }
  const target = owners.find(({ owner, key }) => typeof owner[key] === 'string' && owner[key] === currentText);
  if (!target) throw new Error(`Could not find current ${field} text for ${locator.id}`);
  target.owner[target.key] = replacement;
}

export function namespacedUnitId(book, chapter, unitId) {
  return `${book}:${String(chapter).padStart(3, '0')}:${unitId}`;
}

export function codePoints(value) {
  return Array.from(String(value ?? ''));
}

export function exactSpanAt(text, exact, occurrence) {
  if (!exact) throw new Error('Mention span exact text must not be empty');
  if (!Number.isInteger(occurrence) || occurrence < 0) {
    throw new Error(`Mention occurrence must be a nonnegative integer: ${occurrence}`);
  }

  const haystack = codePoints(text);
  const needle = codePoints(exact);
  const starts = [];
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (haystack[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) starts.push(start);
  }

  const startCodePoint = starts[occurrence];
  if (startCodePoint === undefined) {
    throw new Error(`Could not find occurrence ${occurrence} of ${JSON.stringify(exact)} in ${JSON.stringify(text)}`);
  }
  return {
    exact,
    occurrence,
    startCodePoint,
    endCodePoint: startCodePoint + needle.length,
    unitTextHash: sha256(text),
  };
}

export function occurrenceAt(text, exact, startCodePoint) {
  const points = codePoints(text);
  const needle = codePoints(exact);
  let occurrence = 0;
  for (let start = 0; start < startCodePoint; start += 1) {
    if (needle.every((point, offset) => points[start + offset] === point)) occurrence += 1;
  }
  return occurrence;
}

export function normalizedChapterId(chapter) {
  return String(chapter).padStart(3, '0');
}
