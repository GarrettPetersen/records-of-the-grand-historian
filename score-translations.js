#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { countHanzi, rubricScaffoldingIssue } from './translation-guards.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Regular expressions for detecting problematic translations
const CHINESE_CHARS_REGEX = /[\u4e00-\u9fff]/;
const CORRUPTED_CHARS_REGEX = /[\uFFFD\u0080-\u009F]/; // Unicode replacement character and control chars
const PLACEHOLDER_REGEX = /\[Literal translation\]|\[Idiomatic translation\]|This historical passage.*\[Literal translation\]|This passage continues.*\[Idiomatic translation\]/;
const TERMINAL_PUNCTUATION_REGEX = /[.!?]["')\]]*\s*$/;

function countSubstr(str, needle) {
  if (!str || !needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = String(str).indexOf(needle, index)) !== -1) {
    count++;
    index += needle.length;
  }
  return count;
}

function countSingleQuoteDelimiters(text) {
  const en = String(text || '');
  let count = 0;
  for (let i = 0; i < en.length; i++) {
    if (en[i] !== "'") continue;
    const prev = en[i - 1] || '';
    const next = en[i + 1] || '';
    if (/[A-Za-z]/.test(prev) && /[A-Za-z]/.test(next)) continue;
    if (/[sS]/.test(prev) && (!next || /[\s,.;:!?)}\]]/.test(next))) continue;
    count++;
  }
  return count;
}

function countEnglishQuoteMarks(text) {
  const en = String(text || '');
  const doubleQuoteCount = countSubstr(en, '"') + countSubstr(en, '“') + countSubstr(en, '”');
  return doubleQuoteCount + countSingleQuoteDelimiters(en);
}

function firstNonSpaceIndex(text) {
  const match = String(text).match(/\S/);
  return match ? match.index : -1;
}

function lastNonSpaceIndex(text) {
  const str = String(text);
  for (let i = str.length - 1; i >= 0; i--) {
    if (!/\s/.test(str[i])) return i;
  }
  return -1;
}

function leadingQuote(text) {
  const index = firstNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '“', "'"].includes(char) ? { index, char } : null;
}

function trailingQuote(text) {
  const index = lastNonSpaceIndex(text);
  if (index < 0) return null;
  const char = text[index];
  return ['"', '”', "'"].includes(char) ? { index, char } : null;
}

function preservesLeadingInnerSingleQuote(zh, en, quote) {
  if (quote.char !== "'") return false;
  if (!String(zh || '').trimStart().startsWith('『')) return false;
  return !/["“”]/.test(String(en || '').slice(quote.index + 1));
}

function preservesTrailingInnerQuote(zh, en, quote) {
  if (!/』[。！？!?]?$/u.test(String(zh || '').trim())) return false;
  const text = String(en || '');
  if (quote.char === '"' || quote.char === '”') return text[quote.index - 1] !== "'";
  if (quote.char !== "'") return false;
  const beforeQuote = text.slice(0, quote.index);
  return !/["“”]/.test(beforeQuote);
}

function endsWithTerminalPunctuation(text) {
  if (!text || !text.trim()) return false;
  return TERMINAL_PUNCTUATION_REGEX.test(text.trim());
}

function startsWithLowercaseLetter(text) {
  if (!text || !text.trim()) return false;
  // Ignore leading whitespace, quotes, and brackets before checking first Latin letter.
  const match = text.trim().match(/^[\s"'`([{<]*([A-Za-z])/);
  if (!match) return false;
  return match[1] === match[1].toLowerCase();
}

function hasLegitimateChineseCharacterMention(english) {
  if (!english || !CHINESE_CHARS_REGEX.test(english)) return false;
  if (/[《》「」『』【】]/.test(english)) return true;
  if (/-\{[^}]*[\u4e00-\u9fff][^}]*\}-/.test(english)) return true;
  if (/[\[（(〈〔][^\]\)）〉〕]{0,40}[\u4e00-\u9fff][^\]\)）〉〕]{0,40}[\]）)〉〕]/.test(english)) return true;
  if (/[\(（][^()（）]{0,30}[\u4e00-\u9fff][^()（）]{0,30}[\)）]/.test(english)) return true;
  if (/\b(character|characters|glyph|glyphs|read|reads|reading|edition|editions|emended|emend|restored|restore|supplied|supply|deleted|delete|variant|variants|gloss|commentary|note|notes|title|titles|tune|tunes|hymn|hymns|ritual|quote|quoted|quotation|text|texts|superfluous|missing|incorrect|wrong|misread|miswritten|corrupt|corrupted|corrected|amended|fixed|insert|inserts|inserted|omit|omits|omitted|omission|deletion|interchangeable)\b/i.test(english)) {
    return true;
  }
  if (/\b(add|adds|added|replace|replaces|replaced|write|writes|written|writeup)\b/i.test(english)) {
    return true;
  }
  if (/\b(?:the|this|that|these|those)\s+Chinese character(?:s)?\b/i.test(english)) return true;
  if (/[\p{L}][\u4e00-\u9fff]+|[\u4e00-\u9fff]+[\p{L}]/u.test(english)) return true;
  return false;
}

/**
 * Collation / commentary lines (esp. Zhonghua shuju 頁/行 notes) routinely quote graphs in English.
 * Do not treat Hanzi in the English as "leakage" from the main narrative, and skip
 * sentence-boundary capitalization heuristics (e.g. "p. 1423, l. 6 …").
 */
function isCriticalApparatusNote(zh) {
  if (!zh || typeof zh !== 'string') return false;
  const t = zh.trim();
  if (t.length === 0) return false;
  if (/頁.{0,20}行/.test(t)) return true;
  if (/^按[:：]/.test(t)) return true;
  if (/^今據/.test(t)) return true;
  if (/^又引/.test(t)) return true;
  if (/^今按[:：]/.test(t)) return true;
  if (/^[（(][^)）]{1,14}[)）]$/.test(t)) return true;
  if (t.length <= 40 && /或為/.test(t)) return true;
  if (t.length <= 24 && /音.{1,18}[。.]$/.test(t)) return true;
  if (/左氏傳「|左傳「/.test(t)) return true;
  if (t.length <= 80 && /」續漢書「/.test(t)) return true;
  if (t.length <= 200 && /(校補(引|謂)?|集解引|刊誤)/.test(t)) return true;
  if (t.length <= 120 && /(汲本|殿本)/.test(t) && /「/.test(t)) return true;
  if (t.length <= 160 && /字衍[,，]/.test(t)) return true;
  return false;
}

/**
 * Calculate a rough length ratio score between Chinese and English text
 * Chinese characters are more information-dense than English words
 */
function getLengthRatio(chinese, english) {
  const chineseLength = chinese.length;
  const englishLength = english.trim().split(/\s+/).length;

  // Check for obviously wrong translations
  if (englishLength === 0 && chineseLength > 0) {
    return 0; // Empty translation for non-empty Chinese
  }

  if (englishLength === 1 && chineseLength > 10) {
    return 0; // Single word translation for long Chinese text
  }

  // Special handling for very short Chinese phrases (ordinals, single words, etc.)
  if (chineseLength <= 5) {
    // For very short phrases (5 or fewer characters), be very lenient
    // Only flag if English is empty or absurdly long (>20 words for <=5 chars)
    if (englishLength >= 1 && englishLength <= 20) {
      return 1;
    }
    return 0;
  }

  // Special handling for short phrases (6-12 characters)
  // Classical Chinese is extremely terse; a 10-char sentence routinely needs 15-25 English words
  if (chineseLength <= 12) {
    if (englishLength >= 1 && englishLength <= 30) {
      return 1;
    }
    return 0;
  }

  // For longer content (>12 characters), expect proper translations
  const expectedRatio = chineseLength * 1.8; // more lenient estimate for longer text
  const ratio = englishLength / expectedRatio;

  // Special handling for common patterns that are acceptable:
  // - Year numbers (like "四十三" -> "43rd year.")
  // - Ordinal numbers (like "十四" -> "14th year")
  // - Simple dates (like "474" -> "474 BC")
  // - Names and titles that are naturally short
  if (/^\d+$/.test(chinese) || /^[\u4e00-\u9fff]+年?$/.test(chinese) ||
      (chineseLength <= 8 && english.includes('year') && english.includes('.'))) {
    return 1; // Accept these as valid
  }

  // Score from 0-1, where 1 is perfect length match
  if (ratio < 0.05) return 0; // way too short
  if (ratio > 20.0) return 0; // way too long
  if (ratio >= 0.15 && ratio <= 6.0) return 1; // good range (more lenient)
  return Math.max(0, 1 - Math.abs(Math.log(ratio)) * 0.15); // gradual decrease (less aggressive)
}

/**
 * Score a single translation entry
 */
function scoreTranslation(entry, options = {}) {
  const {
    id,
    content: chinese,
    translation: english,
    isIdiomatic = true,
    allowChineseCharacters = false,
  } = entry;
  const {
    fieldLabel = isIdiomatic ? 'Idiomatic' : 'Literal',
    shouldEnforceSentenceStartCapitalization = false
  } = options;
  const issues = [];
  let score = 1.0;

  // Check for empty Chinese but non-empty English (shouldn't happen)
  if ((!chinese || chinese.trim() === '') && english && english.trim() !== '') {
    issues.push('Empty Chinese text with non-empty translation');
    score = 0;
  }

  // Check for non-empty Chinese but empty English
  if (chinese && chinese.trim() !== '' && (!english || english.trim() === '')) {
    issues.push('Missing translation for non-empty Chinese text');
    score = 0;
  }

  const apparatusNote = chinese && isCriticalApparatusNote(chinese);

  // Check for Chinese characters in English translation (skip for collation commentary)
  if (english && CHINESE_CHARS_REGEX.test(english) && !apparatusNote && !allowChineseCharacters && !hasLegitimateChineseCharacterMention(english)) {
    issues.push('Contains Chinese characters');
    score = 0;
  }

  if (chinese && english && score > 0) {
    const rub = rubricScaffoldingIssue(chinese, english);
    if (rub) {
      issues.push(rub);
      score = 0;
    }
  }

  // Check for corrupted characters in original
  if (chinese && CORRUPTED_CHARS_REGEX.test(chinese)) {
    issues.push('Corrupted characters in original Chinese');
    score = 0;
  }

  // Check for corrupted characters in translation
  if (english && CORRUPTED_CHARS_REGEX.test(english)) {
    issues.push('Corrupted characters in translation');
    score = 0;
  }

  // Check for placeholder text
  if (english && PLACEHOLDER_REGEX.test(english)) {
    issues.push('Contains placeholder text instead of actual translation');
    score = 0;
  }

  // Check for AI artifacts and unwanted markers
  if (english) {
    // Check for "(translated)" artifacts
    if (/\(translated\)|\(translated\.\)|translated\.?$/.test(english)) {
      issues.push('Contains AI-generated "(translated)" artifacts that should be removed');
      score = 0;
    }

    // Check for other common AI artifacts
    if (/\s*\[.*?\]\s*$/.test(english)) {
      issues.push('Contains bracketed artifacts [like this] that should be removed');
      score = 0;
    }

    // Check for redundant translation markers
    if (/\s*(translated by AI|machine translation|auto-translated|AI translation)\s*$/i.test(english)) {
      issues.push('Contains redundant translation markers that should be removed');
      score = 0;
    }
  }

  // Check for missing basic English articles (informational only, not scored)
  // Many valid English sentences use proper nouns throughout without articles
  if (isIdiomatic && chinese && chinese.length > 30 && english && english.length > 50 &&
      !english.includes(' the ') && !english.includes(' a ') && !english.includes(' an ') &&
      !english.includes('The ') && !english.includes('A ') && !english.includes('An ')) {
    // Non-blocking: proper-noun-heavy sentences legitimately omit articles
  }

  // Check for obviously wrong translations
  if (chinese && english && chinese.length > 10 && english.trim().split(/\s+/).length === 1) {
    issues.push('Single word translation for long Chinese text');
    score = 0;
  }

  // Check length ratio (only if no other fails) - be more lenient
  if (score > 0 && chinese && english) {
    const lengthScore = getLengthRatio(chinese, english);
    if (lengthScore < 0.3) { // More lenient threshold
      issues.push('Length mismatch between Chinese and English');
      score = Math.min(score, Math.max(lengthScore, 0.5)); // Don't reduce below 0.5
    }
  }

  // Flag likely sentence-start lowercase when sentence boundary suggests capitalization is expected.
  if (
    score > 0 &&
    english &&
    shouldEnforceSentenceStartCapitalization &&
    !apparatusNote &&
    startsWithLowercaseLetter(english)
  ) {
    issues.push('Likely sentence-start capitalization issue');
    score = Math.min(score, 0.8);
  }

  // Punctuation alignment is useful for targeted diagnostics, but it is too broad
  // for global scoring/progress: it turns almost every translated chapter red.
  // Keep this disabled unless we narrow it to high-confidence annotation failures.
  // if (chinese && english) {
  //   for (const note of punctuationAlignmentNotes(chinese, english, fieldLabel)) {
  //     issues.push(`Punctuation alignment: ${note}`);
  //     score = Math.min(score, 0.8);
  //   }
  // }

  return {
    id,
    chinese,
    english,
    score,
    issues,
    problematic: score < 1.0 || issues.length > 0
  };
}

function quoteSpanAlignmentIssuesForSequence(items) {
  const issues = [];
  let zhQuoteDepth = 0;

  for (const item of items) {
    const chinese = item.content || item.zh || '';
    const english = item.idiomatic || item.translation ||
      (item.translations && item.translations[0] && item.translations[0].idiomatic) ||
      '';
    const openCount = countSubstr(chinese, '「');
    const closeCount = countSubstr(chinese, '」');
    const beforeDepth = zhQuoteDepth;
    const afterDepth = Math.max(0, zhQuoteDepth + openCount - closeCount);
    const isInChineseQuoteSpan = beforeDepth > 0 || afterDepth > 0 || openCount > 0 || closeCount > 0;
    zhQuoteDepth = afterDepth;

    if (!isInChineseQuoteSpan || !english) continue;

    const innerOpenCount = countSubstr(chinese, '『');
    const innerCloseCount = countSubstr(chinese, '』');
    const englishQuoteCount = countEnglishQuoteMarks(english);
    const lead = leadingQuote(english);
    const trail = trailingQuote(english);
    const isOpeningUnit = beforeDepth === 0 && afterDepth > 0 && openCount > 0 && closeCount === 0;
    const isInteriorUnit = beforeDepth > 0 && afterDepth > 0 && openCount === 0 && closeCount === 0;
    const isClosingUnit = beforeDepth > 0 && afterDepth === 0 && openCount === 0 && closeCount > 0;
    const boundaryIssues = [];

    if (isOpeningUnit && trail && (!lead || lead.index !== trail.index) && !(innerCloseCount > 0 && (trail.char === "'" || preservesTrailingInnerQuote(chinese, english, trail)))) {
      boundaryIssues.push('English has a closing quote at the end of an opening unit whose Chinese quote continues into the next unit.');
    }
    if (isInteriorUnit && lead && !(innerOpenCount > 0 && preservesLeadingInnerSingleQuote(chinese, english, lead))) {
      boundaryIssues.push('English has an opening quote at the start of an interior unit of a Chinese quote span.');
    }
    if (isInteriorUnit && trail && !lead && englishQuoteCount === 1 && !(innerCloseCount > 0 && preservesTrailingInnerQuote(chinese, english, trail))) {
      boundaryIssues.push('English has a closing quote at the end of an interior unit of a Chinese quote span.');
    }
    if (isClosingUnit && lead && trail && lead.index !== trail.index && !(innerOpenCount > 0 && preservesLeadingInnerSingleQuote(chinese, english, lead))) {
      boundaryIssues.push('English has an opening quote at the start of a closing unit whose Chinese quote began earlier.');
    }

    if (boundaryIssues.length > 0) {
      issues.push({
        id: item.id || 'quote-span-check',
        chinese,
        english,
        score: 0,
        issues: [
          `Quote span boundary mismatch: ${boundaryIssues.join(' ')} Move Chinese and English quote boundaries together when a quotation crosses unit boundaries.`
        ],
        problematic: true
      });
    }
  }

  return issues;
}

/**
 * Score all translations in a parsed chapter object.
 */
function scoreChapterData(data) {
  const results = [];

  // Track identical translations for chapter-level check (skip ≤3 hanzi rubrics)
  let identicalTranslations = 0;
  let totalTranslations = 0;

  // Score paragraphs
  let previousBoundaryTranslation = null;
  let isFirstBoundarySentence = true;

  function hasChineseCharacterAllowance(item) {
    return item?.allowChineseCharacters === true ||
      item?.translations?.[0]?.allowChineseCharacters === true;
  }

  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        results.push(...quoteSpanAlignmentIssuesForSequence(block.sentences || []));
        for (const sentence of block.sentences || []) {
          // Skip sentences translated by Herbert J. Allen (1894)
          const translator = sentence.translations?.[0]?.translator;
          if (translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          // Check idiomatic first, then literal, supporting both old and new formats
          const idiomaticTranslation = (sentence.idiomatic || sentence.translation) ||
                                     (sentence.translations && sentence.translations[0] &&
                                      sentence.translations[0].idiomatic);
          const literalTranslation = sentence.translations && sentence.translations[0] &&
                                   sentence.translations[0].literal;
          const content = sentence.content || sentence.zh;
          const allowChineseCharacters = hasChineseCharacterAllowance(sentence);

          // Prefer idiomatic, fall back to literal
          const translation = idiomaticTranslation || literalTranslation;
          const isIdiomatic = !!idiomaticTranslation;

          if (translation) {
            const shouldEnforceSentenceStartCapitalization =
              isFirstBoundarySentence || endsWithTerminalPunctuation(previousBoundaryTranslation);
            results.push(scoreTranslation({
              id: sentence.id,
              content: content,
              translation: translation,
              isIdiomatic: isIdiomatic,
              allowChineseCharacters
            }, {
              shouldEnforceSentenceStartCapitalization
            }));
            previousBoundaryTranslation = translation;
            isFirstBoundarySentence = false;

            // Check for identical literal and idiomatic
            const literal = sentence.translations?.[0]?.literal || sentence.literal;
            const idiomatic = sentence.translations?.[0]?.idiomatic || sentence.idiomatic;
            if (literal && idiomatic) {
              totalTranslations++;
              if (literal.trim() === idiomatic.trim() && countHanzi(content) > 3) {
                identicalTranslations++;
              }
            }
          }
        }
      }
      // Score table header sentences
      else if (block.type === 'table_header') {
        results.push(...quoteSpanAlignmentIssuesForSequence(block.sentences || []));
        for (const sentence of block.sentences || []) {
          const translator = sentence.translations?.[0]?.translator;
          if (translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          const idiomaticTranslation = (sentence.idiomatic || sentence.translation) ||
                                     (sentence.translations && sentence.translations[0] &&
                                      sentence.translations[0].idiomatic);
          const literalTranslation = sentence.translations && sentence.translations[0] &&
                                   sentence.translations[0].literal;
          const content = sentence.content || sentence.zh;
          const allowChineseCharacters = hasChineseCharacterAllowance(sentence);
          const translation = idiomaticTranslation || literalTranslation;
          const isIdiomatic = !!idiomaticTranslation;

          if (translation) {
            const shouldEnforceSentenceStartCapitalization =
              isFirstBoundarySentence || endsWithTerminalPunctuation(previousBoundaryTranslation);
            results.push(scoreTranslation({
              id: sentence.id,
              content: content,
              translation: translation,
              isIdiomatic: isIdiomatic,
              allowChineseCharacters
            }, {
              shouldEnforceSentenceStartCapitalization
            }));
            previousBoundaryTranslation = translation;
            isFirstBoundarySentence = false;

            const literal = sentence.translations?.[0]?.literal || sentence.literal;
            const idiomatic = sentence.translations?.[0]?.idiomatic || sentence.idiomatic;
            if (literal && idiomatic) {
              totalTranslations++;
              if (literal.trim() === idiomatic.trim() && countHanzi(content) > 3) {
                identicalTranslations++;
              }
            }
          }
        }
      }
      // Score table rows
      else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          // Skip cells translated by Herbert J. Allen (1894)
          if (cell.translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          // Check translation field (legacy format)
          if (cell.translation) {
            results.push(scoreTranslation({
              id: cell.id,
              content: cell.content,
              translation: cell.translation,
              allowChineseCharacters: cell.allowChineseCharacters === true
            }));
          }

          // Check literal and idiomatic fields (new format)
          if (cell.literal) {
            results.push(scoreTranslation({
              id: cell.id,
              content: cell.content,
              translation: cell.literal,
              isIdiomatic: false,
              allowChineseCharacters: cell.allowChineseCharacters === true
            }, {
              fieldLabel: 'Literal'
            }));
          }

          if (cell.idiomatic) {
            results.push(scoreTranslation({
              id: cell.id,
              content: cell.content,
              translation: cell.idiomatic,
              isIdiomatic: true,
              allowChineseCharacters: cell.allowChineseCharacters === true
            }, {
              fieldLabel: 'Idiomatic'
            }));

            // Check for identical literal and idiomatic in table cells
            if (cell.literal && cell.idiomatic) {
              totalTranslations++;
              if (cell.literal.trim() === cell.idiomatic.trim() && countHanzi(cell.content) > 3) {
                identicalTranslations++;
              }
            }
          }
        }
      }
    }
  }

  // Check if too many translations are identical (1/3 threshold)
  if (totalTranslations > 0 && identicalTranslations >= totalTranslations / 3) {
    const ratio = identicalTranslations / totalTranslations;
    // Add a "problematic" entry to flag this issue
    results.push({
      id: 'chapter-level-check',
      chinese: `Chapter has ${identicalTranslations}/${totalTranslations} identical literal/idiomatic translations (${(ratio * 100).toFixed(1)}%)`,
      english: '',
      score: 0,
      issues: [`Excessive identical translations: ${identicalTranslations}/${totalTranslations} (${(ratio * 100).toFixed(1)}%)`],
      problematic: true
    });
  }

  return results;
}

/**
 * Score all translations in a chapter file
 */
function scoreChapterFile(filePath) {
  console.log(`Scoring translations in: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return [];
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return scoreChapterData(data);
}

/**
 * Randomly select and display sample translations for manual spot-checking
 */
function displayRandomSamples(results, filename) {
  if (results.length === 0) {
    return;
  }

  // Randomly select up to 5 translations for spot-checking
  const sampleSize = Math.min(5, results.length);
  const shuffled = [...results].sort(() => 0.5 - Math.random());
  const samples = shuffled.slice(0, sampleSize);

  console.log(`\n🎯 Random spot-check samples from ${filename} (${sampleSize} selected):\n`);

  samples.forEach((sample, index) => {
    console.log(`${index + 1}. ${sample.id}:`);
    console.log(`   原文: ${sample.chinese}`);
    console.log(`   译文: ${sample.english}`);
    console.log('');
  });
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node score-translations.js <chapter-file> [chapter-file ...]');
    console.error('Example: node score-translations.js data/shiji/014.json');
    process.exit(1);
  }

  let totalProblems = 0;
  let totalEntries = 0;

  for (const filePath of args) {
    const results = scoreChapterFile(filePath);
    const problems = results.filter(r => r.problematic);

    totalEntries += results.length;
    totalProblems += problems.length;

    if (problems.length > 0) {
      console.log(`\nFound ${problems.length} problematic translations in ${path.basename(filePath)}:\n`);

      problems.forEach((problem, index) => {
        console.log(`${index + 1}. ${problem.id}`);
        console.log(`   Chinese: "${problem.chinese}"`);
        console.log(`   English: "${problem.english}"`);
        console.log(`   Score: ${problem.score.toFixed(2)}`);
        console.log(`   Issues: ${problem.issues.join(', ')}`);
        console.log('');
      });
    } else {
      console.log(`No problems found in ${path.basename(filePath)}`);
    }

    // Always show random samples for manual spot-checking
    displayRandomSamples(results, path.basename(filePath));
  }

  console.log(`\nSummary: ${totalProblems} problematic translations out of ${totalEntries} total entries`);

  if (totalProblems > 0) {
    process.exit(1); // Exit with error code if problems found
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  scoreTranslation,
  scoreChapterData,
  scoreChapterFile,
  getLengthRatio
};
