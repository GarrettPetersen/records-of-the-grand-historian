/**
 * align-translations.js - Align Chinese sentences with English translations
 *
 * This module provides functions to align Chinese text segments with their
 * corresponding English translations, typically for existing translations
 * found on chinesenotes.com or ctext.org.
 */

/**
 * Simple sentence alignment algorithm
 * Tries to match Chinese sentences with English translations based on:
 * - Sentence count matching
 * - Rough length ratios
 * - Punctuation alignment
 */
export function alignTranslations(chineseSentences, englishText) {
  if (!chineseSentences || chineseSentences.length === 0) {
    return [];
  }

  if (!englishText || englishText.trim() === '') {
    return new Array(chineseSentences.length).fill('');
  }

  // Split English text into sentences
  const englishSentences = splitEnglishSentences(englishText);

  // If counts match exactly, assume 1:1 alignment
  if (chineseSentences.length === englishSentences.length) {
    return englishSentences;
  }

  // Try to align based on length ratios and content
  const alignments = [];

  let englishIndex = 0;
  for (let i = 0; i < chineseSentences.length; i++) {
    const chinese = chineseSentences[i];

    // If we have more Chinese than English, some Chinese sentences might not have translations
    if (englishIndex >= englishSentences.length) {
      alignments.push('');
      continue;
    }

    // Simple heuristic: if Chinese sentence is very short and English is very long,
    // it might be multiple Chinese sentences per English sentence
    if (chinese.length < 20 && englishSentences[englishIndex].length > 200) {
      // Check if next Chinese sentence also maps to this English sentence
      if (i + 1 < chineseSentences.length &&
          chineseSentences[i + 1].length < 20 &&
          englishIndex + 1 < englishSentences.length) {
        // Two short Chinese sentences for one long English sentence
        alignments.push(englishSentences[englishIndex]);
        i++; // Skip next Chinese sentence
        englishIndex++;
        continue;
      }
    }

    alignments.push(englishSentences[englishIndex]);
    englishIndex++;
  }

  // Pad with empty strings if needed
  while (alignments.length < chineseSentences.length) {
    alignments.push('');
  }

  return alignments;
}

/**
 * Split English text into sentences
 */
function splitEnglishSentences(text) {
  if (!text || text.trim() === '') {
    return [];
  }

  // No preprocessing needed - parentheses will be treated as sentence breaks

  // Simple sentence splitting on periods, question marks, exclamation points, and parentheses
  // This is a basic implementation - could be improved
  const sentences = text
    .split(/[.!?()]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !/^[」"'』】\s]*$/.test(s)) // Filter out punctuation-only sentences (removed ) from filter)
    .map(s => {
      // Add appropriate ending punctuation
      if (s.includes('(')) return s + ')';
      if (s.includes(')')) return s; // Already has closing paren
      return s + '.';
    });

  return sentences;
}

/**
 * Calculate rough alignment score between Chinese and English text
 */
export function getAlignmentScore(chineseText, englishText) {
  if (!chineseText || !englishText) return 0;

  const chineseLength = chineseText.length;
  const englishWords = englishText.split(/\s+/).length;

  // Rough character-to-word ratio for Chinese to English
  const expectedWords = chineseLength * 0.8; // Conservative estimate
  const ratio = englishWords / expectedWords;

  // Score from 0-1, with 1 being perfect alignment
  if (ratio >= 0.5 && ratio <= 2.0) return 1;
  if (ratio >= 0.25 && ratio <= 4.0) return 0.5;
  return 0;
}


