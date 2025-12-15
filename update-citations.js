#!/usr/bin/env node

/**
 * update-citations.js - Add chapter-level citation metadata
 * 
 * Analyzes paragraph-level translators and generates appropriate
 * chapter-level citations.
 * 
 * Usage: node update-citations.js
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = './data';

function generateCitation(translatorStats) {
  // Filter out empty translators and aggregate
  const translators = Object.entries(translatorStats)
    .filter(([name, _]) => name && name.trim() !== '')
    .sort((a, b) => b[1].paragraphs - a[1].paragraphs); // Sort by paragraph count desc
  
  if (translators.length === 0) {
    return null;
  }
  
  if (translators.length === 1) {
    return `Translation: ${translators[0][0]}`;
  }
  
  // Multiple translators - use "partial" format without counts
  const primary = translators[0][0];
  const others = translators.slice(1).map(t => t[0]);
  
  return `Translation: Partial translation by ${primary}; remaining portions by ${others.join(', ')}`;
}

function analyzeChapter(chapterPath) {
  const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  
  // Collect translator statistics
  const translatorStats = {};
  
  for (const block of data.content) {
    if (block.type !== 'paragraph') continue;
    
    // Get paragraph-level translator (fallback)
    let paragraphTranslator = '';
    if (block.translations && block.translations.length > 0) {
      paragraphTranslator = block.translations[0].translator || '';
    }
    
    // Check sentence-level translations for more accurate attribution
    let hasTranslatedSentences = false;
    for (const sentence of block.sentences) {
      if (sentence.translations && sentence.translations.length > 0) {
        const sentenceTranslator = sentence.translations[0].translator || '';
        const sentenceText = sentence.translations[0].text || '';
        
        // Only count if there's actual translation text
        if (sentenceText.trim()) {
          hasTranslatedSentences = true;
          const translator = sentenceTranslator || paragraphTranslator;
          
          if (!translatorStats[translator]) {
            translatorStats[translator] = { paragraphs: 0, sentences: 0 };
          }
          translatorStats[translator].sentences++;
        }
      }
    }
    
    // Count paragraphs by the dominant translator
    if (hasTranslatedSentences) {
      // Find which translator has most sentences in this paragraph
      const paragraphSentenceTranslators = {};
      for (const sentence of block.sentences) {
        if (sentence.translations && sentence.translations[0]?.text?.trim()) {
          const t = sentence.translations[0].translator || paragraphTranslator;
          paragraphSentenceTranslators[t] = (paragraphSentenceTranslators[t] || 0) + 1;
        }
      }
      
      const dominantTranslator = Object.entries(paragraphSentenceTranslators)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      
      if (dominantTranslator) {
        if (!translatorStats[dominantTranslator]) {
          translatorStats[dominantTranslator] = { paragraphs: 0, sentences: 0 };
        }
        translatorStats[dominantTranslator].paragraphs++;
      }
    }
  }
  
  // Generate citation
  const citation = generateCitation(translatorStats);
  
  // Create translator list for metadata (using actual translator names)
  data.meta.translators = Object.entries(translatorStats)
    .filter(([name, _]) => name && name.trim() !== '')
    .map(([name, stats]) => ({
      name,
      paragraphs: stats.paragraphs,
      sentences: stats.sentences
    }))
    .sort((a, b) => b.paragraphs - a.paragraphs);
  
  data.meta.citation = citation;
  
  return data;
}

function main() {
  console.log('Updating citations in all chapter files...\n');
  
  let totalFiles = 0;
  let updatedFiles = 0;
  
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const bookId = entry.name;
    const bookDir = path.join(DATA_DIR, bookId);
    
    console.log(`Processing ${bookId}...`);
    
    const chapterFiles = fs.readdirSync(bookDir)
      .filter(f => f.endsWith('.json'))
      .sort();
    
    for (const file of chapterFiles) {
      const chapterPath = path.join(bookDir, file);
      totalFiles++;
      
      try {
        const updatedData = analyzeChapter(chapterPath);
        fs.writeFileSync(chapterPath, JSON.stringify(updatedData, null, 2), 'utf8');
        updatedFiles++;
      } catch (e) {
        console.error(`  Error processing ${chapterPath}: ${e.message}`);
      }
    }
  }
  
  console.log(`\nProcessed ${totalFiles} files.`);
  console.log(`Updated ${updatedFiles} files.`);
}

main();