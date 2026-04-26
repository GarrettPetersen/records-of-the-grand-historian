#!/usr/bin/env node

/**
 * start-translation.js - Start a translation session by finding the next chapter and sentences to translate
 *
 * Finds the first chapter needing idiomatic translations and creates a JSON file with
 * the next N non-empty untranslated sentences, including existing translations for reference.
 *
 * Usage:
 *   node start-translation.js [book] [output-file] [batch-size] [chapter]
 *   node start-translation.js
 *   node start-translation.js shiji
 *   node start-translation.js hanshu translations/current_translation_hanshu.json
 *   node start-translation.js shiji "" 100 22
 */

import fs from 'node:fs';
import path from 'node:path';

const CHRONOLOGICAL_ORDER = [
  'shiji', 'hanshu', 'houhanshu', 'sanguozhi', 'jinshu', 'songshu',
  'nanqishu', 'liangshu', 'chenshu', 'weishu', 'beiqishu', 'zhoushu',
  'suishu', 'nanshi', 'beishi', 'jiutangshu', 'xintangshu',
  'jiuwudaishi', 'xinwudaishi', 'songshi', 'liaoshi', 'jinshi',
  'yuanshi', 'mingshi'
];

const OTHER_WORKS_ORDER = ['zizhitongjian', 'qingshigao'];

function countMissingTranslations(data) {
  let total = 0, missing = 0;
  for (const block of data.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.zh && sentence.zh.trim()) {
          total++;
          const trans = sentence.translations?.[0];
          const translator = trans?.translator;
          if (translator !== 'Herbert J. Allen (1894)' && (!trans?.idiomatic || !trans.idiomatic.trim())) {
            missing++;
          }
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.content && cell.content.trim()) {
          total++;
          if (!cell.idiomatic || !cell.idiomatic.trim()) {
            missing++;
          }
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.zh && sentence.zh.trim()) {
          total++;
          const trans = sentence.translations?.[0];
          if (!trans?.idiomatic || !trans.idiomatic.trim()) {
            missing++;
          }
        }
      }
    }
  }

  return { total, missing };
}

function chapterToFileName(chapter) {
  const normalized = String(chapter).trim();
  if (/^\d+$/.test(normalized)) {
    return `${normalized.padStart(3, '0')}.json`;
  }
  if (/^\d+\.json$/.test(normalized)) {
    return normalized.replace(/^(\d+)\.json$/, (_, n) => `${n.padStart(3, '0')}.json`);
  }
  return normalized.endsWith('.json') ? normalized : `${normalized}.json`;
}

function buildChapterResult(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const { total, missing } = countMissingTranslations(data);
  return {
    book: data.meta.book,
    chapter: data.meta.chapter,
    file: filePath,
    total,
    missing
  };
}

function findSpecificChapter(book, chapter) {
  const bookDir = `data/${book}`;
  if (!fs.existsSync(bookDir)) {
    console.error(`Book not found: ${book}`);
    process.exit(1);
  }

  const filePath = path.join(bookDir, chapterToFileName(chapter));
  if (!fs.existsSync(filePath)) {
    console.error(`Chapter not found: ${filePath}`);
    process.exit(1);
  }

  const result = buildChapterResult(filePath);
  if (result.missing === 0) {
    console.log(`No untranslated sentences found in ${book} chapter ${result.chapter}`);
    process.exit(0);
  }

  return result;
}

function findFirstUntranslatedChapter(bookFilter = null) {
  const dirs = [];

  if (bookFilter) {
    if (fs.existsSync(`data/${bookFilter}`)) {
      dirs.push(`data/${bookFilter}/`);
    }
  } else {
    // Add chronological order books
    for (const book of [...CHRONOLOGICAL_ORDER, ...OTHER_WORKS_ORDER]) {
      if (fs.existsSync(`data/${book}`)) {
        dirs.push(`data/${book}/`);
      }
    }
  }

  for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();

    for (const file of files) {
      const filePath = path.join(dir, file);
      const chapter = buildChapterResult(filePath);

      // Return the first chapter found that has any missing translations
      if (chapter.missing > 0) {
        return chapter;
      }
    }
  }

  return null;
}

function extractSentencesForTranslation(filePath, maxSentences = 100) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sentences = [];
  const seenIds = new Set();
  const isGenealogicalTable = data.meta.book === 'shiji' &&
                             ['013', '014', '015', '016'].includes(data.meta.chapter);

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    if (sentences.length >= maxSentences) break;

    let blockSentences = [];

    if (block.type === 'paragraph') {
      // Skip paragraphs in genealogical table chapters that contain table-like data
      if (isGenealogicalTable && block.sentences && block.sentences.length > 0) {
        const zh = block.sentences[0].zh;
        // Skip if it contains years (4-digit numbers) or is mostly numbers/spaces
        if (/\d{4}/.test(zh) || /^[\d\s]+$/.test(zh)) {
          continue;
        }
      }
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter(cell => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter(sentence => sentence.zh && sentence.zh.trim());
    }

    for (const sentence of blockSentences) {
      if (sentences.length >= maxSentences) break;

      let chineseText = '';
      let sentenceId = '';
      let existingLiteral = '';

      if (block.type === 'paragraph') {
        chineseText = sentence.zh;
        sentenceId = sentence.id;
        const trans = sentence.translations?.[0];
        if (trans && trans.literal && trans.literal.trim()) {
          existingLiteral = trans.literal;
        }
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
        sentenceId = sentence.id;
        if (sentence.literal && sentence.literal.trim()) {
          existingLiteral = sentence.literal;
        }
      } else if (block.type === 'table_header') {
        chineseText = sentence.zh;
        sentenceId = sentence.id;
        const trans = sentence.translations?.[0];
        if (trans && trans.literal && trans.literal.trim()) {
          existingLiteral = trans.literal;
        }
      }

      // Skip if already has idiomatic translation
      let hasIdiomatic = false;
      if (block.type === 'paragraph') {
        const trans = sentence.translations?.[0];
        hasIdiomatic = trans?.idiomatic && trans.idiomatic.trim() !== '';
      } else if (block.type === 'table_row') {
        hasIdiomatic = sentence.idiomatic && sentence.idiomatic.trim() !== '';
      } else if (block.type === 'table_header') {
        const trans = sentence.translations?.[0];
        hasIdiomatic = trans?.idiomatic && trans.idiomatic.trim() !== '';
      }

      if (!hasIdiomatic && chineseText && chineseText.trim()) {
        // Keep sentence IDs readable (e.g., "s0101"). Only append block index on collision.
        let displayId = sentenceId;
        if (seenIds.has(displayId)) {
          displayId = `${sentenceId}@${blockIndex}`;
        }
        seenIds.add(displayId);
        sentences.push({
          id: displayId,
          originalId: sentenceId,
          blockIndex: blockIndex,
          chinese: chineseText,
          literal: existingLiteral,
          idiomatic: ''
        });
      }
    }
  }

  return sentences;
}

function main() {
  const args = process.argv.slice(2);
  const book = args[0]?.trim() || null;
  const outputFileArg = args[1]?.trim() || null;
  const batchSizeArg = args[2];
  const parsedBatchSize = Number.parseInt(batchSizeArg ?? '', 10);
  const batchSize = Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? parsedBatchSize : 100;
  const chapterArg = args[3]?.trim() || null;

  if (chapterArg) {
    if (!book) {
      console.error('Error: CHAPTER requires BOOK because chapter numbers are not unique across books.');
      console.error('Usage: node start-translation.js shiji "" 100 22');
      process.exit(1);
    }
    console.log(`Finding untranslated sentences in ${book} chapter ${chapterArg}`);
  } else if (book) {
    console.log(`Finding the most complete chapter needing translation in book: ${book}`);
  } else {
    console.log('Finding the first chapter needing translation across all books');
  }

  const chapter = chapterArg ? findSpecificChapter(book, chapterArg) : findFirstUntranslatedChapter(book);
  if (!chapter) {
    if (book) {
      console.log(`No untranslated chapters found in ${book}`);
    } else {
      console.log('No untranslated chapters found');
    }
    process.exit(0);
  }

  console.log(`Found: ${chapter.book} chapter ${chapter.chapter} (${chapter.total - chapter.missing}/${chapter.total} = ${((chapter.total - chapter.missing)/chapter.total*100).toFixed(1)}% complete, ${chapter.missing} missing)`);
  console.log(`File: ${chapter.file}`);

  const sentences = extractSentencesForTranslation(chapter.file, batchSize);
  console.log(`Extracted ${sentences.length} sentences for translation`);

  const outputFile = outputFileArg || `translations/current_translation_${chapter.book}.json`;

  const result = {
    metadata: {
      book: chapter.book,
      chapter: chapter.chapter,
      file: chapter.file
    },
    sentences: sentences
  };

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`Saved to: ${outputFile}`);
  console.log('');
  console.log('Now fill in BOTH "literal" and "idiomatic" fields for each sentence and run: make submit-translations');
  console.log('Note: Both literal and idiomatic translations are required for each sentence.');
  console.log(`Note: The translation file is now named current_translation_${chapter.book}.json`);
}

main();
