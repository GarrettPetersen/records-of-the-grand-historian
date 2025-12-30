#!/usr/bin/env node

/**
 * start-translation.js - Start a translation session by finding the next chapter and sentences to translate
 *
 * Finds the first chapter needing idiomatic translations and creates a JSON file with
 * the next 15 non-empty untranslated sentences, including existing translations for reference.
 *
 * Usage:
 *   node start-translation.js <book> [output-file]
 *   node start-translation.js shiji
 *   node start-translation.js hanshu translations/current_translation_hanshu.json
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

function findFirstUntranslatedChapter(bookFilter = null) {
  const dirs = [];

  if (bookFilter) {
    if (fs.existsSync(`data/${bookFilter}`)) {
      dirs.push(`data/${bookFilter}/`);
    }
  } else {
    // Add chronological order books
    for (const book of CHRONOLOGICAL_ORDER) {
      if (fs.existsSync(`data/${book}`)) {
        dirs.push(`data/${book}/`);
      }
    }
    // Add any other books
    const dataDir = 'data/';
    const entries = fs.readdirSync(dataDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'public' && !CHRONOLOGICAL_ORDER.includes(entry.name)) {
        dirs.push(`${dataDir}${entry.name}/`);
      }
    }
  }

  for (const dir of dirs) {
    const book = path.basename(dir);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();

    for (const file of files) {
      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

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

      // Return the first chapter found that has any missing translations
      if (missing > 0) {
        return {
          book,
          chapter: data.meta.chapter,
          file: filePath,
          total,
          missing
        };
      }
    }
  }

  return null;
}

function extractSentencesForTranslation(filePath, maxSentences = 15) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sentences = [];
  const isGenealogicalTable = data.meta.book === 'shiji' &&
                             ['013', '014', '015', '016'].includes(data.meta.chapter);

  for (const block of data.content) {
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
        sentences.push({
          id: sentenceId,
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
  if (args.length < 1) {
    console.error('Usage: node start-translation.js <book> [output-file]');
    console.error('Example: node start-translation.js shiji');
    process.exit(1);
  }

  const book = args[0];
  const outputFile = args[1] || `translations/current_translation_${book}.json`;

  console.log(`Finding the most complete chapter needing translation in book: ${book}`);

  const chapter = findFirstUntranslatedChapter(book);
  if (!chapter) {
    console.log(`No untranslated chapters found in ${book}`);
    process.exit(0);
  }

  console.log(`Found: ${chapter.book} chapter ${chapter.chapter} (${chapter.total - chapter.missing}/${chapter.total} = ${((chapter.total - chapter.missing)/chapter.total*100).toFixed(1)}% complete, ${chapter.missing} missing)`);
  console.log(`File: ${chapter.file}`);

  const sentences = extractSentencesForTranslation(chapter.file, 15);
  console.log(`Extracted ${sentences.length} sentences for translation`);

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
  console.log(`Note: The translation file is now named current_translation_${book}.json`);
}

main();
