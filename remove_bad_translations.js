#!/usr/bin/env node

import fs from 'fs';

// Chapters with translation issues that need to be reset
const chaptersWithIssues = [
  '002', '004', '005', '006', '007', '009', '010', '012', '013',
  '016', '017', '022', '028', '032', '043', '044', '046', '047',
  '048', '052', '053', '056', '080', '090', '091', '094', '095',
  '096', '114'
];

console.log(`Removing translations from ${chaptersWithIssues.length} problematic shiji chapters...\n`);

let processedCount = 0;
let totalTranslationsRemoved = 0;

for (const chapterNum of chaptersWithIssues) {
  const chapterPath = `data/shiji/${chapterNum}.json`;

  try {
    // Read the chapter
    const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

    let translationsRemoved = 0;

    // Remove translations from all sentences
    for (const block of chapterData.content) {
      let sentences = [];

      if (block.type === 'paragraph') {
        sentences = block.sentences;
      } else if (block.type === 'table_row') {
        sentences = block.cells;
      } else if (block.type === 'table_header') {
        sentences = block.sentences;
      }

      for (const sentence of sentences) {
        if (sentence.translations && sentence.translations.length > 0) {
          // Count removed translations
          translationsRemoved += sentence.translations.length;

          // Remove all translations except those by "Herbert J. Allen (1894)" which are historical
          const historicalTranslations = sentence.translations.filter(t =>
            t.translator && t.translator.includes('Herbert J. Allen (1894)')
          );

          if (historicalTranslations.length > 0) {
            sentence.translations = historicalTranslations;
            translationsRemoved -= historicalTranslations.length; // Don't count these as removed
          } else {
            sentence.translations = [];
          }
        }

        // Also clear any direct translation fields
        if (sentence.literal) delete sentence.literal;
        if (sentence.idiomatic) delete sentence.idiomatic;
      }
    }

    // Update metadata
    chapterData.meta.translatedCount = 0;
    chapterData.meta.translators = [];

    // Write back
    fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2));

    console.log(`Chapter ${chapterNum}: Removed ${translationsRemoved} translations`);
    processedCount++;
    totalTranslationsRemoved += translationsRemoved;

  } catch (error) {
    console.error(`Error processing chapter ${chapterNum}: ${error.message}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Processed ${processedCount} chapters`);
console.log(`Total translations removed: ${totalTranslationsRemoved}`);
console.log(`These chapters are now ready for fresh translation using the correct workflow.`);
