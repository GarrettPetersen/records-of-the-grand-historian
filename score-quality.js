#!/usr/bin/env node

/**
 * score-quality.js - Tool for subjective quality scoring of translations
 *
 * Designed for both human interactive use and AI programmatic scoring.
 *
 * Human Usage:
 *   node score-quality.js                    # Interactive mode
 *   node score-quality.js --list            # List unscored chapters
 *   node score-quality.js --stats           # Show scoring statistics
 *   node score-quality.js --book shiji      # Score chapters from specific book
 *   node score-quality.js --chapter 083     # Score specific chapter
 *
 * AI/Programmatic Usage:
 *   node score-quality.js --set-score 8 --chapter 083
 *   node score-quality.js --batch-scores '{"083": 8, "084": 7}'
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const MANIFEST_PATH = './data/manifest.json';
const DATA_DIR = './data';

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Manifest updated successfully');
}

function listUnscoredChapters(bookFilter = null) {
  const manifest = loadManifest();
  const unscored = [];

  for (const bookId in manifest.books) {
    if (bookFilter && bookId !== bookFilter) continue;

    const book = manifest.books[bookId];
    for (const chapter of book.chapters) {
      if (chapter.qualityScore === null && chapter.translatedCount > 0) {
        unscored.push({
          bookId,
          bookName: book.name,
          chapter: chapter.chapter,
          title: chapter.title.en || chapter.title.zh,
          sentenceCount: chapter.sentenceCount,
          translatedCount: chapter.translatedCount
        });
      }
    }
  }

  return unscored;
}

function showScoringStats() {
  const manifest = loadManifest();
  const stats = {
    totalChapters: 0,
    translatedChapters: 0,
    scoredChapters: 0,
    scores: {}
  };

  for (const bookId in manifest.books) {
    const book = manifest.books[bookId];
    for (const chapter of book.chapters) {
      stats.totalChapters++;
      if (chapter.translatedCount > 0) {
        stats.translatedChapters++;
        if (chapter.qualityScore !== null) {
          stats.scoredChapters++;
          const score = chapter.qualityScore;
          stats.scores[score] = (stats.scores[score] || 0) + 1;
        }
      }
    }
  }

  console.log('\n=== Translation Quality Scoring Statistics ===');
  console.log(`Total chapters: ${stats.totalChapters}`);
  console.log(`Translated chapters: ${stats.translatedChapters}`);
  console.log(`Scored chapters: ${stats.scoredChapters}`);
  console.log(`Unscored translated chapters: ${stats.translatedChapters - stats.scoredChapters}`);

  if (Object.keys(stats.scores).length > 0) {
    console.log('\nScore distribution:');
    Object.keys(stats.scores).sort((a, b) => parseInt(a) - parseInt(b)).forEach(score => {
      console.log(`  ${score}: ${stats.scores[score]} chapters`);
    });
  }

  const completionRate = stats.translatedChapters > 0 ?
    ((stats.scoredChapters / stats.translatedChapters) * 100).toFixed(1) : 0;
  console.log(`\nCompletion rate: ${completionRate}%`);
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function setQualityScore(bookId, chapterNum, score) {
  const manifest = loadManifest();
  const chapter = manifest.books[bookId]?.chapters?.find(c => c.chapter === chapterNum);

  if (!chapter) {
    console.error(`Chapter ${bookId}/${chapterNum} not found`);
    return false;
  }

  if (score < 1 || score > 10) {
    console.error(`Score must be between 1 and 10, got: ${score}`);
    return false;
  }

  chapter.qualityScore = score;
  saveManifest(manifest);
  console.log(`Set quality score ${score} for chapter ${bookId}/${chapterNum}`);
  return true;
}

function setBatchScores(scoresJson) {
  try {
    const scores = JSON.parse(scoresJson);
    const manifest = loadManifest();
    let updated = 0;

    for (const [chapterNum, score] of Object.entries(scores)) {
      const chapter = manifest.books.shiji?.chapters?.find(c => c.chapter === chapterNum);
      if (chapter) {
        if (score >= 1 && score <= 10) {
          chapter.qualityScore = score;
          updated++;
          console.log(`Set score ${score} for chapter ${chapterNum}`);
        } else {
          console.warn(`Invalid score ${score} for chapter ${chapterNum}, skipping`);
        }
      } else {
        console.warn(`Chapter ${chapterNum} not found, skipping`);
      }
    }

    if (updated > 0) {
      saveManifest(manifest);
      console.log(`Updated ${updated} chapter scores`);
    }

    return updated;
  } catch (e) {
    console.error(`Error parsing scores JSON: ${e.message}`);
    return 0;
  }
}

async function scoreChapterInteractive(bookId, chapterNum) {
  const manifest = loadManifest();
  const chapter = manifest.books[bookId]?.chapters?.find(c => c.chapter === chapterNum);

  if (!chapter) {
    console.error(`Chapter ${bookId}/${chapterNum} not found`);
    return;
  }

  console.log(`\n=== Scoring Chapter: ${chapter.title.en || chapter.title.zh} ===`);
  console.log(`Book: ${manifest.books[bookId].name}`);
  console.log(`Chapter: ${chapterNum}`);
  console.log(`Sentences: ${chapter.sentenceCount}`);
  console.log(`Translated: ${chapter.translatedCount}`);
  console.log(`Current score: ${chapter.qualityScore ?? 'Not scored'}`);

  // Show sample translations for context
  const chapterPath = path.join(DATA_DIR, bookId, `${chapterNum}.json`);
  if (fs.existsSync(chapterPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      const sampleSentences = data.content.slice(0, 3).flatMap(p => p.sentences.slice(0, 2));

      console.log('\n--- Sample Translations ---');
      sampleSentences.forEach((sentence, i) => {
        const translation = sentence.translations?.[0]?.text || '[Not translated]';
        console.log(`${i + 1}. ${sentence.zh}`);
        console.log(`   ${translation}`);
        console.log();
      });
    } catch (e) {
      console.log('Could not load chapter data for sample');
    }
  }

  const rl = createInterface();

  try {
    console.log('\nQuality Scoring Guidelines:');
    console.log('1-2: Poor - Major issues with accuracy, readability, or style');
    console.log('3-4: Adequate - Generally accurate but could be improved');
    console.log('5-6: Good - Solid translation with minor issues');
    console.log('7-8: Very Good - High quality, few noticeable issues');
    console.log('9-10: Excellent - Exceptional translation quality');
    console.log();

    let score;
    while (true) {
      const answer = await askQuestion(rl, 'Enter quality score (1-10) or "skip" to skip: ');
      if (answer.toLowerCase() === 'skip') {
        console.log('Skipped scoring this chapter');
        return;
      }

      score = parseInt(answer);
      if (isNaN(score) || score < 1 || score > 10) {
        console.log('Please enter a number between 1 and 10');
      } else {
        break;
      }
    }

    // Update the manifest
    chapter.qualityScore = score;
    saveManifest(manifest);
    console.log(`Score of ${score} recorded for chapter ${bookId}/${chapterNum}`);

  } finally {
    rl.close();
  }
}

async function interactiveMode(bookFilter = null) {
  const unscored = listUnscoredChapters(bookFilter);

  if (unscored.length === 0) {
    console.log('No unscored chapters found!');
    return;
  }

  console.log(`Found ${unscored.length} unscored chapters`);

  for (const chapter of unscored) {
    console.log(`\nNext: ${chapter.bookId}/${chapter.chapter} - ${chapter.title}`);
    console.log(`(${chapter.translatedCount}/${chapter.sentenceCount} sentences translated)`);

    await scoreChapterInteractive(chapter.bookId, chapter.chapter);

    const rl = createInterface();
    try {
      const answer = await askQuestion(rl, '\nContinue scoring? (y/n): ');
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        break;
      }
    } finally {
      rl.close();
    }
  }

  console.log('\nScoring session complete');
  showScoringStats();
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    const unscored = listUnscoredChapters();
    if (unscored.length === 0) {
      console.log('No unscored chapters found');
    } else {
      console.log(`\n=== Unscored Chapters ===`);
      unscored.forEach(chapter => {
        console.log(`${chapter.bookId}/${chapter.chapter}: ${chapter.title}`);
        console.log(`  ${chapter.translatedCount}/${chapter.sentenceCount} sentences translated`);
      });
    }
  } else if (args.includes('--stats')) {
    showScoringStats();
  } else if (args.includes('--set-score')) {
    const scoreIndex = args.indexOf('--set-score');
    const score = parseInt(args[scoreIndex + 1]);
    const chapterIndex = args.indexOf('--chapter');
    const chapterNum = args[chapterIndex + 1];
    const bookIndex = args.indexOf('--book');
    const bookId = bookIndex >= 0 ? args[bookIndex + 1] : 'shiji';

    if (isNaN(score) || !chapterNum) {
      console.error('Usage: node score-quality.js --set-score SCORE --chapter CHAPTER [--book BOOK]');
      process.exit(1);
    }

    setQualityScore(bookId, chapterNum, score);
  } else if (args.includes('--batch-scores')) {
    const batchIndex = args.indexOf('--batch-scores');
    const scoresJson = args[batchIndex + 1];

    if (!scoresJson) {
      console.error('Usage: node score-quality.js --batch-scores \'{"083": 8, "084": 7}\'');
      process.exit(1);
    }

    setBatchScores(scoresJson);
  } else if (args.includes('--book')) {
    const bookIndex = args.indexOf('--book');
    const bookId = args[bookIndex + 1];
    interactiveMode(bookId);
  } else if (args.includes('--chapter')) {
    const chapterIndex = args.indexOf('--chapter');
    const chapterNum = args[chapterIndex + 1];
    // Default to shiji if no book specified
    scoreChapterInteractive('shiji', chapterNum);
  } else if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    // Interactive mode
    interactiveMode();
  }
}

function showHelp() {
  console.log(`
Quality Scoring Tool for Records of the Grand Historian

USAGE:
  node score-quality.js [OPTIONS]

OPTIONS:
  --list                    List all unscored chapters
  --stats                   Show scoring statistics
  --set-score SCORE         Set quality score (1-10) for a chapter
    --chapter CHAPTER         Chapter number (required with --set-score)
    --book BOOK             Book ID (default: shiji)
  --batch-scores JSON       Set multiple scores from JSON object
  --book BOOK               Interactive scoring for specific book
  --chapter CHAPTER         Interactive scoring for specific chapter
  --help, -h               Show this help

EXAMPLES:
  node score-quality.js --stats
  node score-quality.js --list
  node score-quality.js --set-score 8 --chapter 083
  node score-quality.js --batch-scores '{"083": 8, "084": 7}'
  node score-quality.js --book shiji
  node score-quality.js --chapter 083

SCORING SCALE:
  1-2: Poor - Major issues with accuracy, readability, or style
  3-4: Adequate - Generally accurate but could be improved
  5-6: Good - Solid translation with minor issues
  7-8: Very Good - High quality, few noticeable issues
  9-10: Excellent - Exceptional translation quality
`);
}

main();
