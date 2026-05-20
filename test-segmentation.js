#!/usr/bin/env node

// Test script to verify sentence segmentation with parentheses as breaks

// Classical Chinese sentence-ending punctuation, plus parentheses to split parenthetical content
const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/;

function segmentSentences(text) {
  const sentences = [];
  const parts = text.split(SENTENCE_ENDINGS);

  let current = '';
  for (let i = 0; i < parts.length; i++) {
    // If this part is punctuation (odd indices after split)
    if (i % 2 === 1) {
      const punctuation = parts[i];
      // Check if it's opening punctuation (should start a new sentence)
      const isOpeningPunc = /[〈(（]/.test(punctuation);

      if (isOpeningPunc) {
        // Opening punctuation: complete current sentence (if any) and start new one with punctuation
        if (current.trim()) {
          sentences.push(current.trim());
        }
        current = punctuation;
      } else {
        // Closing punctuation: add to current sentence and complete it
        current += punctuation;
        if (current.trim()) {
          sentences.push(current.trim());
          current = '';
        }
      }
    } else {
      // Text part: add to current sentence
      current += parts[i];
    }
  }

  // Don't forget remaining text without ending punctuation
  if (current.trim()) {
    sentences.push(current.trim());
  }

// Post-process: attach opening punctuation to the next sentence and closing punctuation to the previous one.
const merged = [];
let pendingPrefix = '';
const openingOnly = /^[〈《「『【〔（(\s]+$/;
const punctuationOnly = /^[\p{P}\p{S}\s]+$/u; // Any standalone punctuation/symbol fragment

for (let i = 0; i < sentences.length; i++) {
  const sentence = sentences[i];

  if (openingOnly.test(sentence)) {
    pendingPrefix += sentence;
  }
  else if (punctuationOnly.test(sentence)) {
    if (merged.length > 0) merged[merged.length - 1] += sentence;
    else pendingPrefix += sentence;
  }
  else {
    if (pendingPrefix) {
      merged.push(pendingPrefix + sentence);
      pendingPrefix = '';
    } else {
      merged.push(sentence);
    }
  }
}

if (pendingPrefix) {
  if (merged.length > 0) {
    merged[merged.length - 1] += pendingPrefix;
  } else {
    merged.push(pendingPrefix);
  }
}

return merged;
}

console.log('Testing sentence segmentation with parentheses as breaks...\n');

// Test cases
const testCases = [
  {
    input: '主語〈註釋〉謂語。',
    expected: ['主語', '〈註釋〉', '謂語。'],
    description: 'Basic Chinese with angle brackets'
  },
  {
    input: '發生舂陵節侯買，〈舂陵，郷名，本屬零陵泠道縣，在今永州唐興縣北，元帝時徙南陽，仍號舂陵，故城今在隨州棗陽縣東。',
    expected: ['發生舂陵節侯買，', '〈舂陵，郷名，本屬零陵泠道縣，在今永州唐興縣北，元帝時徙南陽，仍號舂陵，故城今在隨州棗陽縣東。'],
    description: 'Complex parenthetical content'
  },
  {
    input: 'Regular sentence without parentheses.',
    expected: ['Regular sentence without parentheses.'],
    description: 'Regular sentence without parentheses'
  },
  {
    input: 'First part (parenthetical) second part.',
    expected: ['First part', '(parenthetical)', 'second part.'],
    description: 'English with parentheses'
  },
  {
    input: '〈師古曰：「但次古人而不表今人者，其書未畢故也。」〉',
    expected: ['〈師古曰：「但次古人而不表今人者，其書未畢故也。」〉'],
    description: 'Closing angle quote should merge with previous sentence'
  }
];

for (const testCase of testCases) {
  console.log(`Test: ${testCase.description}`);
  console.log(`Input: "${testCase.input}"`);

  const result = segmentSentences(testCase.input);
  console.log(`Output: ${JSON.stringify(result)}`);

  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
  console.log(`Expected: ${JSON.stringify(testCase.expected)}`);
  console.log(`✅ PASS: ${passed ? 'YES' : 'NO'}\n`);
}
