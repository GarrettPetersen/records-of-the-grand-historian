#!/usr/bin/env node

/**
 * batch-quality-check.js - Run quality checks on multiple chapters at once
 *
 * Usage:
 *   node batch-quality-check.js <chapter-spec> [options]
 *
 * Chapter specs:
 *   043-050        - Range of chapters
 *   043,045,047    - Specific chapters
 *   all            - All available chapters
 *   data/shiji/*.json - Glob pattern
 *
 * Options:
 *   --summary-only  - Show only summary statistics
 *   --detailed      - Show detailed problems for each chapter
 *   --samples-only  - Show only random samples, skip problem details
 *   --output=json   - Output results as JSON
 *   --min-problems=N - Only show chapters with N+ problems
 */

import fs from 'fs';
import path from 'path';

// Import functions from score-translations.js
import { scoreChapterFile, getLengthRatio } from './score-translations.js';

const CHINESE_CHARS_REGEX = /[\u4e00-\u9fff]/;
const CORRUPTED_CHARS_REGEX = /[\uFFFD\u0080-\u009F]/;

/**
 * Parse chapter specification into array of file paths
 */
function parseChapterSpec(spec, bookId = null) {
  // If book is specified in spec like "hanshu:043-050", extract it
  let dataDir = 'data/shiji'; // default
  let chapterSpec = spec;

  if (spec.includes(':')) {
    const parts = spec.split(':');
    if (parts.length === 2) {
      dataDir = `data/${parts[0]}`;
      chapterSpec = parts[1];
    }
  } else if (bookId) {
    dataDir = `data/${bookId}`;
  }

  // Handle range like "043-050"
  if (chapterSpec.includes('-')) {
    const [start, end] = chapterSpec.split('-').map(s => s.padStart(3, '0'));
    const files = [];
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      const chapterFile = `${dataDir}/${i.toString().padStart(3, '0')}.json`;
      if (fs.existsSync(chapterFile)) {
        files.push(chapterFile);
      }
    }
    return files;
  }

  // Handle comma-separated list like "043,045,047" or "043,047-048"
  if (chapterSpec.includes(',')) {
    const parts = chapterSpec.split(',');
    const files = [];

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        // Handle ranges within comma-separated list
        const [start, end] = trimmed.split('-').map(s => s.padStart(3, '0'));
        for (let i = parseInt(start); i <= parseInt(end); i++) {
          const chapterFile = `${dataDir}/${i.toString().padStart(3, '0')}.json`;
          if (fs.existsSync(chapterFile)) {
            files.push(chapterFile);
          }
        }
      } else {
        // Handle single chapters
        const chapterFile = `${dataDir}/${trimmed.padStart(3, '0')}.json`;
        if (fs.existsSync(chapterFile)) {
          files.push(chapterFile);
        }
      }
    }

    return [...new Set(files)]; // Remove duplicates
  }

  // Handle "all"
  if (chapterSpec === 'all') {
    try {
      const files = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.json'))
        .map(file => `${dataDir}/${file}`)
        .sort();
      return files;
    } catch (error) {
      console.error(`Error reading data directory: ${error.message}`);
      return [];
    }
  }

  // Handle glob patterns (simple support)
  if (chapterSpec.includes('*')) {
    try {
      const files = fs.readdirSync(path.dirname(chapterSpec) || dataDir)
        .filter(file => {
          const fullPath = path.join(path.dirname(chapterSpec) || dataDir, file);
          return fs.statSync(fullPath).isFile() && file.endsWith('.json');
        })
        .map(file => path.join(path.dirname(chapterSpec) || dataDir, file))
        .sort();
      return files;
    } catch (error) {
      console.error(`Error reading directory for pattern ${chapterSpec}: ${error.message}`);
      return [];
    }
  }

  // Handle single chapter
  const chapterFile = chapterSpec.startsWith(dataDir) ? chapterSpec : `${dataDir}/${chapterSpec.padStart(3, '0')}.json`;
  return fs.existsSync(chapterFile) ? [chapterFile] : [];
}

/**
 * Display random samples for spot-checking
 */
function displayRandomSamples(results, filename, options) {
  if (options.samplesOnly || (!options.summaryOnly && results.length > 0)) {
    const sampleSize = Math.min(5, results.length);
    const shuffled = [...results].sort(() => 0.5 - Math.random());
    const samples = shuffled.slice(0, sampleSize);

    console.log(`\n🎯 Random spot-check samples from ${path.basename(filename)} (${sampleSize} selected):`);

    samples.forEach((sample, index) => {
      console.log(`\n${index + 1}. ${sample.id}:`);
      console.log(`   原文: ${sample.chinese}`);
      console.log(`   译文: ${sample.english}`);

      // Try to show both literal and idiomatic translations if available
      try {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const sentence = findSentenceById(data, sample.id);
        if (sentence) {
          const literal = sentence.translations?.[0]?.literal || sentence.literal;
          const idiomatic = sentence.translations?.[0]?.idiomatic || sentence.idiomatic;
          if (literal && idiomatic) {
            console.log(`   直译: ${literal}`);
            console.log(`   意译: ${idiomatic}`);
          }
        }
      } catch (error) {
        // Silently continue if we can't read the file or find the sentence
      }
    });
    console.log('');
  }
}

/**
 * Find a sentence by ID in chapter data
 */
function findSentenceById(data, sentenceId) {
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph' && block.sentences) {
        const sentence = block.sentences.find(s => s.id === sentenceId);
        if (sentence) return sentence;
      }
    }
  }
  return null;
}

/**
 * Display detailed problems for a chapter
 */
function displayChapterProblems(problems, filename, options) {
  if (options.summaryOnly || problems.length === 0) return;

  console.log(`\n❌ Found ${problems.length} problematic translations in ${path.basename(filename)}:`);

  problems.forEach((problem, index) => {
    console.log(`\n${index + 1}. ${problem.id}`);
    console.log(`   Chinese: "${problem.chinese}"`);
    console.log(`   English: "${problem.english}"`);
    console.log(`   Score: ${problem.score.toFixed(2)}`);
    console.log(`   Issues: ${problem.issues.join(', ')}`);
  });

  // Specifically highlight chapters with excessive identical translations
  const identicalProblem = problems.find(p => p.id === 'chapter-level-check' && p.issues.some(issue => issue.includes('Excessive identical translations')));
  if (identicalProblem) {
    console.log(`\n🚨 CRITICAL: ${path.basename(filename)} has ${identicalProblem.issues[0]} - this chapter may have low quality translations!`);
  }
}

/**
 * Generate summary statistics
 */
function generateSummary(results, options) {
  const summary = {
    totalChapters: results.length,
    chaptersWithProblems: results.filter(r => r.problems > 0).length,
    totalProblems: results.reduce((sum, r) => sum + r.problems, 0),
    totalEntries: results.reduce((sum, r) => sum + r.totalEntries, 0),
    chaptersByStatus: {},
    problemBreakdown: {}
  };

  // Group by translation status
  results.forEach(result => {
    const percent = result.totalEntries > 0 ?
      Math.round((result.translated / result.totalEntries) * 100) : 0;
    const status = percent === 100 ? 'complete' :
                  percent >= 50 ? 'partial' : 'minimal';

    summary.chaptersByStatus[status] = (summary.chaptersByStatus[status] || 0) + 1;
  });

  // Problem type breakdown
  results.forEach(result => {
    result.problemDetails.forEach(problem => {
      problem.issues.forEach(issue => {
        summary.problemBreakdown[issue] = (summary.problemBreakdown[issue] || 0) + 1;
      });
    });
  });

  return summary;
}

/**
 * Display summary
 */
function displaySummary(summary, options) {
  console.log('\n📊 BATCH QUALITY CHECK SUMMARY');
  console.log('=' .repeat(50));

  console.log(`📚 Total Chapters Processed: ${summary.totalChapters}`);
  console.log(`❌ Chapters with Problems: ${summary.chaptersWithProblems}`);
  console.log(`🔢 Total Problematic Translations: ${summary.totalProblems}`);
  console.log(`📝 Total Translation Entries: ${summary.totalEntries}`);
  console.log(`✅ Translation Completion Rate: ${((summary.totalEntries - summary.totalProblems) / summary.totalEntries * 100).toFixed(1)}%`);

  if (Object.keys(summary.chaptersByStatus).length > 0) {
    console.log('\n📈 Chapters by Completion Status:');
    Object.entries(summary.chaptersByStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} chapters`);
    });
  }

  if (Object.keys(summary.problemBreakdown).length > 0) {
    console.log('\n🚨 Problem Breakdown:');
    Object.entries(summary.problemBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issue, count]) => {
        console.log(`   ${issue}: ${count} instances`);
      });
  }

  // Add note about subjective quality assessment
  console.log('\n💡 IMPORTANT: The automated checks above detect technical issues like length mismatches,');
  console.log('   corrupted characters, and placeholder text. However, there may be subjective quality');
  console.log('   problems not caught by these automated checks. Always review the spot-check samples');
  console.log('   above to ensure uniform high quality across all translations in the Ken Liu style.');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node batch-quality-check.js <chapter-spec> [options]');
    console.error('');
    console.error('Chapter specs:');
    console.error('  043-050              - Range of chapters (shiji by default)');
    console.error('  hanshu:043-050        - Range of chapters in specific book');
    console.error('  043,045,047          - Specific chapters');
    console.error('  all                   - All available chapters (shiji by default)');
    console.error('  hanshu:all           - All chapters in specific book');
    console.error('  data/hanshu/*.json    - Glob pattern');
    console.error('');
    console.error('Options:');
    console.error('  --summary-only        - Show only summary statistics');
    console.error('  --detailed            - Show detailed problems for each chapter');
    console.error('  --samples-only        - Show only random samples, skip problem details');
    console.error('  --output=json         - Output results as JSON');
    console.error('  --min-problems=N      - Only show chapters with N+ problems');
    console.error('');
    console.error('Examples:');
    console.error('  node batch-quality-check.js 043-050');
    console.error('  node batch-quality-check.js hanshu:001-010');
    console.error('  node batch-quality-check.js all --summary-only');
    console.error('  node batch-quality-check.js hanshu:all --min-problems=5');
    process.exit(1);
  }

  const spec = args[0];
  const options = {
    summaryOnly: args.includes('--summary-only'),
    detailed: args.includes('--detailed'),
    samplesOnly: args.includes('--samples-only'),
    outputJson: args.includes('--output=json'),
    minProblems: (() => {
      const arg = args.find(a => a.startsWith('--min-problems='));
      return arg ? parseInt(arg.split('=')[1]) : 0;
    })()
  };

  // Parse book and chapter specification
  let bookId = null;
  let chapterSpec = spec;

  if (spec.includes(':')) {
    const parts = spec.split(':');
    if (parts.length === 2) {
      bookId = parts[0];
      chapterSpec = parts[1];
    }
  }

  const chapterFiles = parseChapterSpec(chapterSpec, bookId);
  if (chapterFiles.length === 0) {
    const bookName = bookId || 'shiji';
    console.error(`No chapter files found for spec: ${spec} (in ${bookName})`);
    process.exit(1);
  }

  console.log(`🔍 Starting batch quality check on ${chapterFiles.length} chapters...\n`);

  const results = [];
  let processed = 0;

  for (const filePath of chapterFiles) {
    try {
      const chapterResults = scoreChapterFile(filePath);
      const problems = chapterResults.filter(r => r.problematic);

      // Count translated entries
      const translated = chapterResults.filter(r =>
        r.english && r.english.trim() && !r.problematic
      ).length;

      const chapterResult = {
        filename: path.basename(filePath),
        filepath: filePath,
        totalEntries: chapterResults.length,
        translated: translated,
        problems: problems.length,
        problemDetails: problems,
        allResults: chapterResults
      };

      // Only process chapters that meet minimum problem threshold
      if (chapterResult.problems >= options.minProblems) {
        results.push(chapterResult);

        if (!options.summaryOnly && !options.outputJson) {
          console.log(`\n📖 ${chapterResult.filename}: ${chapterResult.translated}/${chapterResult.totalEntries} translated, ${chapterResult.problems} problems`);

          if (chapterResult.problems > 0) {
            displayChapterProblems(problems, filePath, options);
          }

          displayRandomSamples(chapterResults, filePath, options);
        }
      }

      processed++;
      if (processed % 10 === 0 && !options.outputJson) {
        console.log(`⏳ Processed ${processed}/${chapterFiles.length} chapters...`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  // Generate and display summary
  const summary = generateSummary(results, options);

  if (options.outputJson) {
    console.log(JSON.stringify({ summary, results }, null, 2));
  } else {
    displaySummary(summary, options);
  }

  // Exit with error code if any problems found
  if (summary.totalProblems > 0 && !options.samplesOnly) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
