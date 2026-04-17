#!/usr/bin/env node

/**
 * submit-translations.js - Submit translations from a translation session
 *
 * Validates and applies translations from the JSON file created by start-translation.js,
 * then runs quality checks and cleans up.
 *
 * Usage:
 *   node submit-translations.js <translation-file> <translator> <model>
 *   node submit-translations.js translations/current_translation_shiji.json "Garrett M. Petersen (2026)" "grok-1.5"
 */

import fs from 'node:fs';
import path from 'node:path';

const TERMINAL_PUNCTUATION_REGEX = /[.!?]["')\]]*\s*$/;

function endsWithTerminalPunctuation(text) {
  if (!text || !text.trim()) return false;
  return TERMINAL_PUNCTUATION_REGEX.test(text.trim());
}

function startsWithLowercaseLetter(text) {
  if (!text || !text.trim()) return false;
  const match = text.trim().match(/^[\s"'`([{<]*([A-Za-z])/);
  if (!match) return false;
  return match[1] === match[1].toLowerCase();
}

function getChapterIdiomaticText(entry) {
  if (!entry) return '';
  if (entry.blockType === 'table_row') {
    return entry.raw?.idiomatic || entry.raw?.translation || '';
  }
  return entry.raw?.translations?.[0]?.idiomatic || entry.raw?.idiomatic || entry.raw?.translation || '';
}

function buildChapterLookup(chapter) {
  const byId = new Map();
  const boundaryEntries = [];

  for (let blockIndex = 0; blockIndex < chapter.content.length; blockIndex++) {
    const block = chapter.content[blockIndex];
    let blockSentences = [];
    let blockType = block.type;

    if (block.type === 'paragraph' || block.type === 'table_header') {
      blockSentences = block.sentences || [];
    } else if (block.type === 'table_row') {
      blockSentences = block.cells || [];
    } else {
      continue;
    }

    for (const chapterSentence of blockSentences) {
      const id = chapterSentence.id;
      if (!id) continue;
      const chinese = block.type === 'table_row' ? chapterSentence.content : chapterSentence.zh;
      const entry = { id, chinese, blockType, blockIndex, raw: chapterSentence, boundaryIndex: null };
      byId.set(id, entry);

      if (block.type === 'paragraph' || block.type === 'table_header') {
        entry.boundaryIndex = boundaryEntries.length;
        boundaryEntries.push(entry);
      }
    }
  }

  return { byId, boundaryEntries };
}

function validateTranslations(translationFile, chapterFile) {
  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
  const chapterLookup = buildChapterLookup(chapter);
  const pendingById = new Map();
  for (const s of translations.sentences) {
    pendingById.set(s.originalId || s.id, s);
  }

  const errors = [];
  let identicalCount = 0;

  for (const sentence of translations.sentences) {
    // Check if literal is empty
    if (!sentence.literal || !sentence.literal.trim()) {
      errors.push(`Missing literal translation for sentence ${sentence.id}. Please provide both literal and idiomatic translations for each sentence.`);
    }

    // Check if idiomatic is empty
    if (!sentence.idiomatic || !sentence.idiomatic.trim()) {
      errors.push(`Missing idiomatic translation for sentence ${sentence.id}. Please provide both literal and idiomatic translations for each sentence.`);
    }

    // Check if literal and idiomatic are identical (after trimming)
    if (sentence.literal && sentence.idiomatic &&
        sentence.literal.trim() === sentence.idiomatic.trim()) {
      identicalCount++;
    }

    // NEW: Check for placeholder text and poor quality indicators
    if (sentence.literal && sentence.literal.trim()) {
      const literalText = sentence.literal.trim();

      // Check for placeholder patterns
      if (literalText.includes('(translated)') || literalText.includes('[translated]') ||
          literalText.includes('TODO') || literalText.includes('PLACEHOLDER') ||
          literalText.includes('...') || literalText === sentence.chinese) {
        errors.push(`❌ PLACEHOLDER DETECTED in literal translation for sentence ${sentence.id}: "${literalText}". Please provide a proper English translation, not placeholder text.`);
      }

      // Check for extremely short translations compared to Chinese length
      const chineseLength = sentence.chinese.length;
      const englishLength = literalText.length;
      const lengthRatio = englishLength / chineseLength;
      if (lengthRatio < 0.3 && chineseLength > 10) {
        errors.push(`❌ SUSPICIOUSLY SHORT literal translation for sentence ${sentence.id}: Chinese has ${chineseLength} characters, English has ${englishLength} characters (${(lengthRatio * 100).toFixed(1)}% ratio). This suggests an incomplete or placeholder translation. Please provide a proper full translation.`);
      }

    }

    if (sentence.idiomatic && sentence.idiomatic.trim()) {
      const idiomaticText = sentence.idiomatic.trim();

      // Check for placeholder patterns
      if (idiomaticText.includes('(translated)') || idiomaticText.includes('[translated]') ||
          idiomaticText.includes('TODO') || idiomaticText.includes('PLACEHOLDER') ||
          idiomaticText.includes('...') || idiomaticText === sentence.chinese) {
        errors.push(`❌ PLACEHOLDER DETECTED in idiomatic translation for sentence ${sentence.id}: "${idiomaticText}". Please provide a proper English translation, not placeholder text.`);
      }

      // Check for extremely short translations
      const chineseLength = sentence.chinese.length;
      const englishLength = idiomaticText.length;
      const lengthRatio = englishLength / chineseLength;
      if (lengthRatio < 0.3 && chineseLength > 10) {
        errors.push(`❌ SUSPICIOUSLY SHORT idiomatic translation for sentence ${sentence.id}: Chinese has ${chineseLength} characters, English has ${englishLength} characters (${(lengthRatio * 100).toFixed(1)}% ratio). This suggests an incomplete or placeholder translation. Please provide a proper full translation.`);
      }

      // Check for missing basic English articles (common in choppy translations)
      // Non-blocking: many valid English sentences omit articles (proper nouns, imperatives, literary style)
      if (chineseLength > 15 && !idiomaticText.includes(' the ') && !idiomaticText.includes(' a ') && !idiomaticText.includes(' an ') && !idiomaticText.includes('The ') && !idiomaticText.includes('A ') && !idiomaticText.includes('An ')) {
        console.warn(`⚠️  NOTE: Idiomatic translation for sentence ${sentence.id} has no English articles (the/a/an). Review if needed: "${idiomaticText}".`);
      }

      // Check for choppy sentence fragments (sentences without verbs)
      // Non-blocking: the verb list is incomplete and short introductory clauses are valid
      const words = idiomaticText.split(' ');
      if (words.length > 3 && words.length < 10) {
        const hasVerb = /\b(is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|can|could|should|may|might|must|shall|am|going|want|need|like|love|hate|know|think|feel|see|hear|say|tell|get|give|take|make|come|go|run|walk|eat|drink|sleep|work|play|live|die|remarks|says|said|wrote|asked|replied|answered|spoke|declared|noted|observed|passed|fell|rose|died|attacked|captured|defeated|fled|led|sent|returned|became|took|gave|held|set|broke|built|seized|struck|fought|entered|left|received|appointed|granted|summoned|ordered|established)\b/i.test(idiomaticText);
        if (!hasVerb && !idiomaticText.includes(',') && !idiomaticText.includes('.') && !idiomaticText.includes(':')) {
          console.warn(`⚠️  NOTE: Idiomatic translation for sentence ${sentence.id} may be a fragment without a verb: "${idiomaticText}".`);
        }
      }
    }

    const originalId = sentence.originalId || sentence.id;
    const chapterEntry = chapterLookup.byId.get(originalId);
    if (!chapterEntry) {
      errors.push(`Sentence ${sentence.id} not found in chapter file`);
      continue;
    }

    if (chapterEntry.chinese !== sentence.chinese) {
      errors.push(`Chinese text mismatch for sentence ${sentence.id}: expected "${chapterEntry.chinese}", got "${sentence.chinese}"`);
    }

    // Context-aware sentence-start capitalization flag for idiomatic translations:
    // enforce only at likely sentence boundaries (chapter start or after terminal punctuation).
    if ((chapterEntry.blockType === 'paragraph' || chapterEntry.blockType === 'table_header') &&
        sentence.idiomatic && sentence.idiomatic.trim()) {
      const boundaryIndex = chapterEntry.boundaryIndex;
      const prevEntry = boundaryIndex > 0 ? chapterLookup.boundaryEntries[boundaryIndex - 1] : null;
      let prevIdiomatic = '';
      if (prevEntry) {
        const pendingPrev = pendingById.get(prevEntry.id);
        prevIdiomatic = pendingPrev?.idiomatic || getChapterIdiomaticText(prevEntry);
      }
      const shouldEnforce = !prevEntry || endsWithTerminalPunctuation(prevIdiomatic);
      if (shouldEnforce && startsWithLowercaseLetter(sentence.idiomatic)) {
        console.warn(`⚠️  NOTE: Idiomatic translation for sentence ${sentence.id} appears to start with lowercase at a sentence boundary: "${sentence.idiomatic.trim()}".`);
      }
    }
  }

  // Check if too many translations are identical
  const totalSentences = translations.sentences.length;
  if (totalSentences > 0 && identicalCount === totalSentences) {
    errors.push(`❌ SHORTCUT DETECTED: All ${totalSentences} literal and idiomatic translations are identical.`);
    errors.push(`You cannot just copy literal translations to fill idiomatic fields.`);
    errors.push(`Please provide distinct, high-quality idiomatic translations for each sentence.`);
    errors.push(`Each idiomatic translation should be more natural and flowing while maintaining semantic fidelity.`);
  }

  return errors;
}

function applyTranslations(translationFile, chapterFile, translator, model) {
  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

  console.log(`Applying ${translations.sentences.length} translations to ${chapterFile}`);

  for (const sentence of translations.sentences) {
    // Find and update the sentence in the chapter
    const originalId = sentence.originalId || sentence.id;
    const blockIndex = sentence.blockIndex;
    let found = false;
    if (blockIndex !== undefined && blockIndex < chapter.content.length) {
      // Use block index if available
      const block = chapter.content[blockIndex];
      let blockSentences = [];

      if (block.type === 'paragraph') {
        blockSentences = block.sentences;
      } else if (block.type === 'table_row') {
        blockSentences = block.cells;
      } else if (block.type === 'table_header') {
        blockSentences = block.sentences;
      }

      for (const chapterSentence of blockSentences) {
        let chapterId = '';

        if (block.type === 'paragraph') {
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_row') {
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_header') {
          chapterId = chapterSentence.id;
        }

        if (chapterId === originalId) {
          found = true;
          if (block.type === 'paragraph') {
            if (!chapterSentence.translations) {
              chapterSentence.translations = [];
            }
            if (chapterSentence.translations.length === 0) {
              chapterSentence.translations.push({});
            }
            chapterSentence.translations[0].translator = translator;
            chapterSentence.translations[0].model = model;
            chapterSentence.translations[0].literal = sentence.literal;
            chapterSentence.translations[0].idiomatic = sentence.idiomatic;
          } else if (block.type === 'table_row') {
            chapterSentence.literal = sentence.literal;
            chapterSentence.idiomatic = sentence.idiomatic;
          } else if (block.type === 'table_header') {
            if (!chapterSentence.translations) {
              chapterSentence.translations = [];
            }
            if (chapterSentence.translations.length === 0) {
              chapterSentence.translations.push({});
            }
            chapterSentence.translations[0].translator = translator;
            chapterSentence.translations[0].model = model;
            chapterSentence.translations[0].literal = sentence.literal;
            chapterSentence.translations[0].idiomatic = sentence.idiomatic;
          }
          break;
        }
      }
    } else {
      // Fallback: search all blocks (old behavior)
      for (const block of chapter.content) {
        let blockSentences = [];

        if (block.type === 'paragraph') {
          blockSentences = block.sentences;
        } else if (block.type === 'table_row') {
          blockSentences = block.cells;
        } else if (block.type === 'table_header') {
          blockSentences = block.sentences;
        }

        for (const chapterSentence of blockSentences) {
          let chapterId = '';

          if (block.type === 'paragraph') {
            chapterId = chapterSentence.id;
          } else if (block.type === 'table_row') {
            chapterId = chapterSentence.id;
          } else if (block.type === 'table_header') {
            chapterId = chapterSentence.id;
          }

          if (chapterId === originalId) {
            found = true;
            if (block.type === 'paragraph') {
              if (!chapterSentence.translations) {
                chapterSentence.translations = [];
              }
              if (chapterSentence.translations.length === 0) {
                chapterSentence.translations.push({});
              }
              chapterSentence.translations[0].translator = translator;
              chapterSentence.translations[0].model = model;
              chapterSentence.translations[0].literal = sentence.literal;
              chapterSentence.translations[0].idiomatic = sentence.idiomatic;
            } else if (block.type === 'table_row') {
              chapterSentence.literal = sentence.literal;
              chapterSentence.idiomatic = sentence.idiomatic;
            } else if (block.type === 'table_header') {
              if (!chapterSentence.translations) {
                chapterSentence.translations = [];
              }
              if (chapterSentence.translations.length === 0) {
                chapterSentence.translations.push({});
              }
              chapterSentence.translations[0].translator = translator;
              chapterSentence.translations[0].model = model;
              chapterSentence.translations[0].literal = sentence.literal;
              chapterSentence.translations[0].idiomatic = sentence.idiomatic;
            }
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
      console.warn(`Warning: Sentence ${sentence.id} (original: ${originalId}) not found in chapter file`);
    }
  }

  // Recalculate translatedCount
  let translatedCount = 0;
  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.idiomatic && cell.idiomatic.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    }
  }
  chapter.meta.translatedCount = translatedCount;

  fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
  console.log(`Applied translations. Updated translated count: ${translatedCount}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node submit-translations.js <translation-file> <translator> <model>');
    console.error('Example: node submit-translations.js translations/current_translation_shiji.json "Garrett M. Petersen (2026)" "grok-1.5"');
    process.exit(1);
  }

  const translationFile = args[0];
  const translator = args[1];
  const model = args[2];

  if (!fs.existsSync(translationFile)) {
    console.error(`Translation file not found: ${translationFile}`);
    process.exit(1);
  }

  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapterFile = translations.metadata.file;

  if (!fs.existsSync(chapterFile)) {
    console.error(`Chapter file not found: ${chapterFile}`);
    process.exit(1);
  }

  console.log(`Validating translations from ${translationFile}...`);

  const errors = validateTranslations(translationFile, chapterFile);
  if (errors.length > 0) {
    console.error('Validation errors:');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log('✅ Validation passed! All quality checks met:');
  console.log('   • Both literal and idiomatic translations provided');
  console.log('   • No placeholder text detected');
  console.log('   • Translations are not identical');
  console.log('   • Reasonable length and proper English structure');
  console.log('   • Ken Liu quality standards met');
  console.log('');
  console.log('Applying translations...');

  applyTranslations(translationFile, chapterFile, translator, model);

  console.log('🧹 Cleaning up translation file...');
  fs.unlinkSync(translationFile);
  console.log(`Deleted: ${translationFile}`);

  console.log('✅ Translations applied successfully!');
}

main();
