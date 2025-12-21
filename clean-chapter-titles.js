#!/usr/bin/env node

/**
 * clean-chapter-titles.js - Clean up and separate Chinese and English chapter titles
 *
 * Separates mixed titles from scraping into proper zh and en fields.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = 'data/shiji';

function cleanTitle(rawTitle) {
  if (!rawTitle) return { zh: null, en: null };

  // Handle angle bracket format first
  if (rawTitle.includes('《') && rawTitle.includes('》')) {
    // Extract content between angle brackets as Chinese title
    const angleMatch = rawTitle.match(/《([^》]+)》/);
    if (angleMatch) {
      const zh = angleMatch[1];
      // Check if there's English after the angle brackets
      const afterAngle = rawTitle.split('》')[1]?.trim();
      if (afterAngle && /[A-Za-z]/.test(afterAngle)) {
        return { zh, en: afterAngle };
      } else {
        return { zh, en: null };
      }
    }
  }

  // For titles without angle brackets but with mixed content
  const hasEnglish = /[A-Za-z]/.test(rawTitle);

  if (hasEnglish) {
    // Try to find patterns like "Chinese Title English Title"
    // Look for the transition from Chinese characters to English
    const parts = rawTitle.split(/\s+/);
    let splitIndex = -1;

    for (let i = 0; i < parts.length; i++) {
      // If this part starts with English letter and previous parts were Chinese
      if (/^[A-Za-z]/.test(parts[i]) && i > 0) {
        // Check if previous parts contain Chinese characters
        const prevPart = parts[i-1];
        if (/[\u4e00-\u9fff]/.test(prevPart)) {
          splitIndex = i;
          break;
        }
      }
    }

    if (splitIndex > 0) {
      const zh = parts.slice(0, splitIndex).join(' ').trim();
      const en = parts.slice(splitIndex).join(' ').trim();
      return { zh, en };
    }

    // Fallback: assume it's all Chinese
    return { zh: rawTitle, en: null };
  } else {
    // Pure Chinese title
    return { zh: rawTitle, en: null };
  }
}

function processChapter(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const rawTitle = data.meta.title.raw || data.meta.title.zh;

    const cleaned = cleanTitle(rawTitle);
    data.meta.title.zh = cleaned.zh;
    data.meta.title.en = cleaned.en;

    // If raw was different, keep it for reference, otherwise remove it
    if (data.meta.title.raw === data.meta.title.zh || data.meta.title.raw === cleaned.zh) {
      delete data.meta.title.raw;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✓ ${path.basename(filePath)}: "${rawTitle}" → zh: "${cleaned.zh}", en: "${cleaned.en}"`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => parseInt(a.match(/(\d+)/)?.[1] || 0) - parseInt(b.match(/(\d+)/)?.[1] || 0));

  console.log(`Processing ${files.length} chapter files...\n`);

  for (const file of files) {
    processChapter(path.join(DATA_DIR, file));
  }

  console.log('\nTitle cleanup complete!');
}

main();
