#!/usr/bin/env node

/**
 * Improved alignment algorithm that tries multiple partitions and scores them.
 * 
 * Strategy:
 * - Generate candidate alignments (ways to partition English sentences to Chinese sentences)
 * - Score each alignment based on:
 *   1. Penalty for unmapped Chinese sentences (high penalty)
 *   2. Consistency of character/word ratios across aligned pairs (reward low variance)
 * - Return the best scoring alignment
 */

/**
 * Segment English text into sentences
 * @param {string} text - English paragraph text
 * @param {string} mode - 'normal' (split on .!?), 'semicolon' (also split on ;), 'comma' (also split on ,)
 */
function segmentEnglishSentences(text, mode = 'normal') {
  if (!text || !text.trim()) return [];
  
  // Choose pattern based on mode
  let pattern;
  if (mode === 'comma') {
    // Split on . ! ? ; and , followed by space
    pattern = /[.!?]+(?:\s+(?=[A-Z])|$)|[;,]\s+/g;
  } else if (mode === 'semicolon') {
    // Split on . ! ? and ; followed by space
    pattern = /[.!?]+(?:\s+(?=[A-Z])|$)|;\s+/g;
  } else {
    // Normal: split on . ! ? followed by space and capital letter, or end of string
    pattern = /[.!?]+(?:\s+(?=[A-Z])|$)/g;
  }
  
  const sentences = [];
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    const sentence = text.slice(lastIndex, match.index + match[0].length).trim();
    if (sentence) {
      sentences.push(sentence);
    }
    lastIndex = match.index + match[0].length;
  }
  
  // Catch any remaining text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) {
      sentences.push(remaining);
    }
  }
  
  return sentences;
}

/**
 * Count words in English text
 */
function countEnglishWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Count Chinese characters (excluding punctuation)
 */
function countChineseChars(text) {
  return (text.match(/[\u4e00-\u9fff]/g) || []).length;
}

/**
 * Generate partitions using a greedy sampling approach to avoid combinatorial explosion.
 * Uses different strategies to explore the search space without generating all possibilities.
 * 
 * Returns array of partitions, where each partition is an array of arrays.
 * Example: [[0,1], [2], [3,4]] means sentences 0-1 map to zh[0], sentence 2 to zh[1], etc.
 */
function generatePartitions(numEnglish, numChinese, maxPartitions = 1000) {
  if (numChinese === 0) return [];
  if (numChinese === 1) return [[[...Array(numEnglish).keys()]]];
  if (numEnglish === 0) return [];
  
  const partitions = new Set();
  
  // Handle case where English < Chinese - some Chinese will be unmapped
  if (numEnglish < numChinese) {
    const numToSkip = numChinese - numEnglish;
    
    // Strategy 1: Map all English to first numEnglish Chinese (skip at end)
    let partition = [];
    for (let i = 0; i < numChinese; i++) {
      if (i < numEnglish) {
        partition.push([i]);
      } else {
        partition.push([]);
      }
    }
    partitions.add(JSON.stringify(partition));
    
    // Strategy 2: Map all English to last numEnglish Chinese (skip at beginning)
    partition = [];
    for (let i = 0; i < numChinese; i++) {
      if (i < numToSkip) {
        partition.push([]);
      } else {
        partition.push([i - numToSkip]);
      }
    }
    partitions.add(JSON.stringify(partition));
    
    // Strategy 3: Try skipping different contiguous ranges
    for (let skipStart = 1; skipStart < numChinese - numEnglish; skipStart++) {
      partition = [];
      let enIdx = 0;
      for (let i = 0; i < numChinese; i++) {
        if (i >= skipStart && i < skipStart + numToSkip) {
          partition.push([]);
        } else if (enIdx < numEnglish) {
          partition.push([enIdx]);
          enIdx++;
        } else {
          partition.push([]);
        }
      }
      partitions.add(JSON.stringify(partition));
    }
    
    // Strategy 4: Try merging some English sentences (fewer Chinese get mapped but no empties in middle)
    // For example, with 9 English and 11 Chinese, try grouping to make 11 groups
    const needExtraGroups = numToSkip;
    for (let attempt = 0; attempt < Math.min(10, maxPartitions - partitions.size); attempt++) {
      partition = [];
      let enIdx = 0;
      
      // Decide which Chinese positions should get multiple English sentences
      const multiPositions = new Set();
      for (let i = 0; i < needExtraGroups; i++) {
        const pos = attempt === 0 ? i : Math.floor(Math.random() * numChinese);
        multiPositions.add(pos);
      }
      
      for (let i = 0; i < numChinese; i++) {
        if (enIdx >= numEnglish) {
          partition.push([]);
        } else if (multiPositions.has(i) && enIdx + 1 < numEnglish) {
          partition.push([enIdx, enIdx + 1]);
          enIdx += 2;
        } else {
          partition.push([enIdx]);
          enIdx++;
        }
      }
      
      if (partition.length === numChinese) {
        partitions.add(JSON.stringify(partition));
      }
    }
    
    return Array.from(partitions).map(s => JSON.parse(s)).slice(0, maxPartitions);
  }
  
  // Standard case: numEnglish >= numChinese
  
  // Strategy 1: Equal distribution (baseline)
  const equalSize = Math.floor(numEnglish / numChinese);
  const remainder = numEnglish % numChinese;
  let partition = [];
  let idx = 0;
  for (let i = 0; i < numChinese; i++) {
    const size = equalSize + (i < remainder ? 1 : 0);
    partition.push(Array.from({ length: size }, (_, j) => idx + j));
    idx += size;
  }
  partitions.add(JSON.stringify(partition));
  
  // Strategy 2: Front-loaded (more English sentences at the start)
  partition = [];
  idx = 0;
  for (let i = 0; i < numChinese; i++) {
    const remaining = numEnglish - idx;
    const remainingChinese = numChinese - i;
    const size = Math.max(1, Math.ceil(remaining * 0.6 / remainingChinese));
    const actualSize = Math.min(size, remaining - remainingChinese + 1);
    partition.push(Array.from({ length: actualSize }, (_, j) => idx + j));
    idx += actualSize;
  }
  if (idx === numEnglish) {
    partitions.add(JSON.stringify(partition));
  }
  
  // Strategy 3: Back-loaded (more English sentences at the end)
  partition = [];
  idx = 0;
  for (let i = 0; i < numChinese; i++) {
    const remaining = numEnglish - idx;
    const remainingChinese = numChinese - i;
    const size = Math.max(1, Math.floor(remaining * 0.4 / remainingChinese));
    const actualSize = Math.max(1, size);
    if (i === numChinese - 1) {
      // Last chunk gets all remaining
      partition.push(Array.from({ length: remaining }, (_, j) => idx + j));
    } else {
      partition.push(Array.from({ length: actualSize }, (_, j) => idx + j));
      idx += actualSize;
    }
  }
  if (partition.length === numChinese) {
    partitions.add(JSON.stringify(partition));
  }
  
  // Strategy 4: Random variations
  const numRandomTries = Math.min(50, maxPartitions - partitions.size);
  for (let attempt = 0; attempt < numRandomTries; attempt++) {
    partition = [];
    idx = 0;
    for (let i = 0; i < numChinese - 1; i++) {
      const remaining = numEnglish - idx;
      const remainingChinese = numChinese - i;
      const minSize = 1;
      const maxSize = remaining - remainingChinese + 1;
      const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      partition.push(Array.from({ length: size }, (_, j) => idx + j));
      idx += size;
    }
    // Last chunk gets remaining
    partition.push(Array.from({ length: numEnglish - idx }, (_, j) => idx + j));
    
    if (partition[partition.length - 1].length > 0) {
      partitions.add(JSON.stringify(partition));
    }
  }
  
  // Convert back to arrays
  return Array.from(partitions).map(s => JSON.parse(s));
}

/**
 * Calculate variance of an array of numbers
 */
function variance(numbers) {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  return numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
}

/**
 * Score an alignment
 * Lower score is better
 */
function scoreAlignment(zhSentences, enSentences, partition) {
  let score = 0;
  const ratios = [];
  
  // Count unmapped Chinese sentences (severe penalty)
  const unmappedChinese = zhSentences.length - partition.length;
  score += unmappedChinese * 10000; // Very high penalty
  
  let emptyMappingCount = 0;
  let consecutiveEmptyAtEnd = 0;
  
  // Count consecutive empties at the end
  for (let i = partition.length - 1; i >= 0; i--) {
    const enIndices = partition[i];
    if (enIndices.length === 0) {
      consecutiveEmptyAtEnd++;
    } else {
      break;
    }
  }
  
  // For each mapped pair, calculate the ratio of English words to Chinese characters
  for (let i = 0; i < partition.length; i++) {
    const zhText = zhSentences[i];
    const enIndices = partition[i];
    const enText = enIndices.map(idx => enSentences[idx]).join(' ');
    
    const zhChars = countChineseChars(zhText);
    const enWords = countEnglishWords(enText);
    
    if (zhChars === 0) continue; // Skip if no Chinese characters
    
    // Penalty for empty mappings based on position
    if (enWords === 0) {
      emptyMappingCount++;
      
      // Calculate position-based penalty
      const fromEnd = partition.length - 1 - i;
      if (fromEnd < consecutiveEmptyAtEnd) {
        // This is part of trailing empties - significant penalty
        // We prefer having all Chinese sentences mapped to something
        score += 1000;
      } else if (i < 3) {
        // Empty at the beginning - very high penalty
        score += 15000 * (3 - i); // First position gets 45000, second 30000, third 15000
      } else {
        // Empty in the middle - high penalty
        score += 8000;
      }
    } else {
      const ratio = enWords / zhChars;
      ratios.push(ratio);
      
      // Small penalty for multi-sentence mappings (English sentences combined)
      if (enIndices.length > 1) {
        score += 50 * (enIndices.length - 1);
      }
    }
  }
  
  // Reward consistency: low variance in ratios is good
  if (ratios.length > 1) {
    const ratioVariance = variance(ratios);
    score += ratioVariance * 100; // Weight the variance
  }
  
  // Bonus for having all Chinese sentences mapped to something
  if (emptyMappingCount === 0 && partition.length === zhSentences.length) {
    score -= 500; // Reward complete mappings
  }
  
  return { score, ratios, unmappedChinese, emptyMappingCount };
}

/**
 * Try alignment with a specific segmentation mode
 */
function tryAlignment(zhSentences, enParagraph, mode, maxPartitions, verbose) {
  const enSentences = segmentEnglishSentences(enParagraph, mode);
  
  // Simple case: equal number of sentences
  if (zhSentences.length === enSentences.length) {
    if (verbose) {
      console.error(`[${mode}] Equal number of sentences (${enSentences.length}), direct 1:1 mapping`);
    }
    return { aligned: enSentences, score: -500, mode, enSentences }; // Best possible score
  }
  
  // Simple case: only one Chinese sentence
  if (zhSentences.length === 1) {
    if (verbose) {
      console.error(`[${mode}] Single Chinese sentence, mapping all English`);
    }
    return { aligned: [enParagraph], score: 0, mode, enSentences };
  }
  
  if (verbose) {
    console.error(`[${mode}] Generating partitions for ${enSentences.length} English → ${zhSentences.length} Chinese sentences...`);
  }
  
  let partitions = generatePartitions(enSentences.length, zhSentences.length);
  
  // Limit number of partitions to avoid explosion
  if (partitions.length > maxPartitions) {
    if (verbose) {
      console.error(`[${mode}] Too many partitions (${partitions.length}), sampling ${maxPartitions}...`);
    }
    const step = Math.floor(partitions.length / maxPartitions);
    partitions = partitions.filter((_, i) => i % step === 0).slice(0, maxPartitions);
  }
  
  if (verbose) {
    console.error(`[${mode}] Evaluating ${partitions.length} possible alignments...`);
  }
  
  // Score each partition
  let bestScore = Infinity;
  let bestPartition = null;
  let bestMetrics = null;
  
  for (const partition of partitions) {
    const { score, ratios, unmappedChinese, emptyMappingCount } = scoreAlignment(zhSentences, enSentences, partition);
    
    if (score < bestScore) {
      bestScore = score;
      bestPartition = partition;
      bestMetrics = { ratios, unmappedChinese, emptyMappingCount };
    }
  }
  
  if (verbose) {
    console.error(`[${mode}] Best score: ${bestScore.toFixed(2)}, empty mappings: ${bestMetrics.emptyMappingCount}`);
  }
  
  // Convert partition to aligned translations
  const aligned = [];
  for (let i = 0; i < zhSentences.length; i++) {
    if (i < bestPartition.length) {
      const enIndices = bestPartition[i];
      const enText = enIndices.map(idx => enSentences[idx]).join(' ');
      aligned.push(enText);
    } else {
      aligned.push('');
    }
  }
  
  return { aligned, score: bestScore, mode, enSentences, metrics: bestMetrics };
}

/**
 * Find the best alignment between Chinese sentences and English paragraph
 * Returns array of English translations, one per Chinese sentence
 */
function alignTranslations(zhSentences, enParagraph, options = {}) {
  const maxPartitions = options.maxPartitions || 10000;
  const verbose = options.verbose || false;
  
  const normalSentences = segmentEnglishSentences(enParagraph, 'normal');
  
  // Determine which modes to try based on sentence count
  const modes = ['normal'];
  if (normalSentences.length < zhSentences.length) {
    // Need more English segments - try splitting on semicolons
    modes.push('semicolon');
    
    const semicolonSentences = segmentEnglishSentences(enParagraph, 'semicolon');
    if (semicolonSentences.length < zhSentences.length) {
      // Still not enough - try splitting on commas too
      modes.push('comma');
    }
  }
  
  if (verbose) {
    console.error(`Trying segmentation modes: ${modes.join(', ')}`);
  }
  
  // Try each mode and pick the best result
  let bestResult = null;
  
  for (const mode of modes) {
    const result = tryAlignment(zhSentences, enParagraph, mode, maxPartitions, verbose);
    
    if (!bestResult || result.score < bestResult.score) {
      bestResult = result;
    }
  }
  
  if (verbose) {
    console.error(`\nBest mode: ${bestResult.mode} with score ${bestResult.score.toFixed(2)}`);
    if (bestResult.metrics) {
      console.error(`Empty mappings: ${bestResult.metrics.emptyMappingCount}`);
      if (bestResult.metrics.ratios.length > 0) {
        const avgRatio = bestResult.metrics.ratios.reduce((sum, r) => sum + r, 0) / bestResult.metrics.ratios.length;
        const ratioVar = variance(bestResult.metrics.ratios);
        console.error(`Average words/char ratio: ${avgRatio.toFixed(3)} (variance: ${ratioVar.toFixed(4)})`);
      }
    }
  }
  
  return bestResult.aligned;
}

// Export for use as module
export { alignTranslations, segmentEnglishSentences, countEnglishWords, countChineseChars };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 2 || args.includes('--help')) {
    console.log(`Usage: node align-translations.js <zh-sentences-json> <en-paragraph-text> [--verbose]

Examples:
  node align-translations.js '["句子一。", "句子二。"]' "Sentence one. Sentence two."
  node align-translations.js '["黃帝者，少典之子。", "姓公孫，名曰軒轅。"]' "The Yellow Emperor was the son of Shaodian. His surname was Gongsun and his given name was Xuanyuan." --verbose
`);
    process.exit(1);
  }
  
  const zhSentences = JSON.parse(args[0]);
  const enParagraph = args[1];
  const verbose = args.includes('--verbose');
  
  const aligned = alignTranslations(zhSentences, enParagraph, { verbose });
  
  console.log(JSON.stringify(aligned, null, 2));
}
