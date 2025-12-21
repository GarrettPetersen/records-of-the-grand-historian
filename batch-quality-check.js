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
function parseChapterSpec(spec) {
  const dataDir = 'data/shiji';

  // Handle range like "043-050"
  if (spec.includes('-')) {
    const [start, end] = spec.split('-').map(s => s.padStart(3, '0'));
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
  if (spec.includes(',')) {
    const parts = spec.split(',');
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
  if (spec === 'all') {
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
  if (spec.includes('*')) {
    try {
      const files = fs.readdirSync(path.dirname(spec) || dataDir)
        .filter(file => {
          const fullPath = path.join(path.dirname(spec) || dataDir, file);
          return fs.statSync(fullPath).isFile() && file.endsWith('.json');
        })
        .map(file => path.join(path.dirname(spec) || dataDir, file))
        .sort();
      return files;
    } catch (error) {
      console.error(`Error reading directory for pattern ${spec}: ${error.message}`);
      return [];
    }
  }

  // Handle single chapter
  const chapterFile = spec.startsWith(dataDir) ? spec : `${dataDir}/${spec.padStart(3, '0')}.json`;
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
    });
    console.log('');
  }
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
    console.error('  043-050        - Range of chapters');
    console.error('  043,045,047    - Specific chapters');
    console.error('  all            - All available chapters');
    console.error('  data/shiji/*.json - Glob pattern');
    console.error('');
    console.error('Options:');
    console.error('  --summary-only  - Show only summary statistics');
    console.error('  --detailed      - Show detailed problems for each chapter');
    console.error('  --samples-only  - Show only random samples, skip problem details');
    console.error('  --output=json   - Output results as JSON');
    console.error('  --min-problems=N - Only show chapters with N+ problems');
    console.error('');
    console.error('Examples:');
    console.error('  node batch-quality-check.js 043-050');
    console.error('  node batch-quality-check.js all --summary-only');
    console.error('  node batch-quality-check.js 043,047 --min-problems=5');
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

  // Parse chapter specification
  const chapterFiles = parseChapterSpec(spec);
  if (chapterFiles.length === 0) {
    console.error(`No chapter files found for spec: ${spec}`);
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
