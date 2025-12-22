#!/usr/bin/env node

/**
 * fix-chapter-templates.js - Fix template errors in problematic chapters
 */

import fs from 'fs';

function fixTemplates(reviewFile, correctTranslations) {
  const data = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));

  console.log(`Fixing templates in ${reviewFile}...`);

  let fixed = 0;
  for (const translation of data.translations) {
    const original = translation.english;

    // Fix specific known incorrect templates
    if (translation.english === "Seventy disciples orally received their transmitted pointers, for had criticism ridicule praise concealment yielding reduction writings cannot written seen.") {
      translation.english = "[Needs proper translation]";
      fixed++;
    }

    // Apply specific corrections if available
    if (correctTranslations[translation.chinese]) {
      translation.english = correctTranslations[translation.chinese];
      fixed++;
    }
  }

  fs.writeFileSync(reviewFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Fixed ${fixed} template errors in ${reviewFile}`);
}

// Corrections for Chapter 014
const chapter014Corrections = {
  "是以孔子明王道，干七十餘君，莫能用，故西觀周室，論史記舊聞，興於魯而次春秋，上記隱，下至哀之獲麟，約其辭文，去其煩重，以制義法，王道備，人事浹。": "This is why Confucius clarified the way of the kings, solicited more than seventy rulers, but none could employ him. Therefore he observed the Western Zhou court, discussed the historical records and old traditions, arose in Lu and arranged the Spring and Autumn Annals, recording from Yin above to the capture of the unicorn in Ai's time below, condensing their wording and style, removing their tedious repetitions, to establish righteous principles—the way of the kings was complete, human affairs were thorough."
};

// Corrections for Chapter 015
const chapter015Corrections = {
  "務在彊兵并敵，謀詐用而從衡短長之說起。": "Their efforts were devoted to strengthening troops and uniting against enemies, and the sayings of scheming, deception, and the vertical and horizontal alliances of long and short arose from this.",
  "夫作事者必於東南，收功實者常於西北。": "Those who initiate affairs must do so in the southeast, those who gather actual merit are constantly in the northwest.",
  "及文公踰隴，攘夷狄，尊陳寶，營岐雍之閒，而穆公修政，東竟至河，則與齊桓、晉文中國侯伯侔矣。": "When Duke Wen crossed the Long mountains, drove back the Yi and Di barbarians, honored Chen Bao, and camped between Qi and Yong, Duke Mu repaired his government, his eastern border reached the Yellow River, and thus he equaled the central states' feudal lords like Duke Huan of Qi and Duke Wen of Jin."
};

// Apply fixes
fixTemplates('./review_014.json', chapter014Corrections);
fixTemplates('./review_015.json', chapter015Corrections);
