#!/usr/bin/env node

/**
 * generate-manifest.js - Generate manifest.json from scraped data
 * 
 * Creates a lightweight index of all available books and chapters
 * so the web app doesn't need to probe for files.
 * 
 * Usage: node generate-manifest.js
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = './data';
const PUBLIC_DATA_DIR = './public/data';

// Chronological order of the 24 dynastic histories
const CHRONOLOGICAL_ORDER = [
  'shiji',        // Records of the Grand Historian - Xia to Han
  'hanshu',       // Book of Han - Western Han
  'houhanshu',    // Book of Later Han - Eastern Han
  'sanguozhi',    // Records of the Three Kingdoms - Three Kingdoms
  'jinshu',       // Book of Jin - Jin
  'songshu',      // Book of Song - Liu Song
  'nanqishu',     // Book of Southern Qi - Southern Qi
  'liangshu',     // Book of Liang - Liang
  'chenshu',      // Book of Chen - Chen
  'weishu',       // Book of Wei - Northern Wei
  'beiqishu',     // Book of Northern Qi - Northern Qi
  'zhoushu',      // Book of Zhou - Northern Zhou
  'suishu',       // Book of Sui - Sui
  'nanshi',       // History of the Southern Dynasties - Southern Dynasties
  'beishi',       // History of the Northern Dynasties - Northern Dynasties
  'jiutangshu',   // Old Book of Tang - Tang
  'xintangshu',   // New Book of Tang - Tang
  'jiuwudaishi',  // Old History of the Five Dynasties - Five Dynasties
  'xinwudaishi',  // New History of the Five Dynasties - Five Dynasties
  'songshi',      // History of Song - Song
  'liaoshi',      // History of Liao - Liao (Khitan)
  'jinshi',       // History of Jin - Jin (Jurchen)
  'yuanshi',      // History of Yuan - Yuan (Mongol)
  'mingshi'       // History of Ming - Ming
];

const BOOKS = {
  shiji: { name: 'Records of the Grand Historian', chinese: '史記', pinyin: 'Shǐjì', dynasty: 'Xia to Han', author: 'Sima Qian', authorChinese: '司馬遷' },
  hanshu: { name: 'Book of Han', chinese: '漢書', pinyin: 'Hànshū', dynasty: 'Western Han', author: 'Ban Gu', authorChinese: '班固' },
  houhanshu: { name: 'Book of Later Han', chinese: '後漢書', pinyin: 'Hòu Hànshū', dynasty: 'Eastern Han', author: 'Fan Ye', authorChinese: '范曄' },
  sanguozhi: { name: 'Records of the Three Kingdoms', chinese: '三國志', pinyin: 'Sānguó Zhì', dynasty: 'Three Kingdoms', author: 'Chen Shou', authorChinese: '陳壽' },
  jinshu: { name: 'Book of Jin', chinese: '晉書', pinyin: 'Jìnshū', dynasty: 'Jin', author: 'Fang Xuanling et al.', authorChinese: '房玄齡等' },
  songshu: { name: 'Book of Song', chinese: '宋書', pinyin: 'Sòngshū', dynasty: 'Liu Song', author: 'Shen Yue', authorChinese: '沈約' },
  nanqishu: { name: 'Book of Southern Qi', chinese: '南齊書', pinyin: 'Nán Qíshū', dynasty: 'Southern Qi', author: 'Xiao Zixian', authorChinese: '蕭子顯' },
  liangshu: { name: 'Book of Liang', chinese: '梁書', pinyin: 'Liángshū', dynasty: 'Liang', author: 'Yao Silian', authorChinese: '姚思廉' },
  chenshu: { name: 'Book of Chen', chinese: '陳書', pinyin: 'Chénshū', dynasty: 'Chen', author: 'Yao Silian', authorChinese: '姚思廉' },
  weishu: { name: 'Book of Wei', chinese: '魏書', pinyin: 'Wèishū', dynasty: 'Northern Wei', author: 'Wei Shou', authorChinese: '魏收' },
  beiqishu: { name: 'Book of Northern Qi', chinese: '北齊書', pinyin: 'Běi Qíshū', dynasty: 'Northern Qi', author: 'Li Baiyao', authorChinese: '李百藥' },
  zhoushu: { name: 'Book of Zhou', chinese: '周書', pinyin: 'Zhōushū', dynasty: 'Northern Zhou', author: 'Linghu Defen et al.', authorChinese: '令狐德棻等' },
  suishu: { name: 'Book of Sui', chinese: '隋書', pinyin: 'Suíshū', dynasty: 'Sui', author: 'Wei Zheng et al.', authorChinese: '魏徵等' },
  nanshi: { name: 'History of the Southern Dynasties', chinese: '南史', pinyin: 'Nánshǐ', dynasty: 'Southern Dynasties', author: 'Li Yanshou', authorChinese: '李延壽' },
  beishi: { name: 'History of the Northern Dynasties', chinese: '北史', pinyin: 'Běishǐ', dynasty: 'Northern Dynasties', author: 'Li Yanshou', authorChinese: '李延壽' },
  jiutangshu: { name: 'Old Book of Tang', chinese: '舊唐書', pinyin: 'Jiù Tángshū', dynasty: 'Tang', author: 'Liu Xu et al.', authorChinese: '劉昫等' },
  xintangshu: { name: 'New Book of Tang', chinese: '新唐書', pinyin: 'Xīn Tángshū', dynasty: 'Tang', author: 'Ouyang Xiu and Song Qi', authorChinese: '歐陽修、宋祁' },
  jiuwudaishi: { name: 'Old History of the Five Dynasties', chinese: '舊五代史', pinyin: 'Jiù Wǔdàishǐ', dynasty: 'Five Dynasties', author: 'Xue Juzheng et al.', authorChinese: '薛居正等' },
  xinwudaishi: { name: 'New History of the Five Dynasties', chinese: '新五代史', pinyin: 'Xīn Wǔdàishǐ', dynasty: 'Five Dynasties', author: 'Ouyang Xiu', authorChinese: '歐陽修' },
  songshi: { name: 'History of Song', chinese: '宋史', pinyin: 'Sòngshǐ', dynasty: 'Song', author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  liaoshi: { name: 'History of Liao', chinese: '遼史', pinyin: 'Liáoshǐ', dynasty: 'Liao (Khitan)', author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  jinshi: { name: 'History of Jin', chinese: '金史', pinyin: 'Jīnshǐ', dynasty: 'Jin (Jurchen)', author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  yuanshi: { name: 'History of Yuan', chinese: '元史', pinyin: 'Yuánshǐ', dynasty: 'Yuan (Mongol)', author: 'Song Lian et al.', authorChinese: '宋濂等' },
  mingshi: { name: 'History of Ming', chinese: '明史', pinyin: 'Míngshǐ', dynasty: 'Ming', author: 'Zhang Tingyu et al.', authorChinese: '張廷玉等' }
};

function generateManifest() {
  // Load existing manifest to preserve quality scores
  let existingManifest = {};
  const existingManifestPath = path.join(DATA_DIR, 'manifest.json');
  if (fs.existsSync(existingManifestPath)) {
    try {
      existingManifest = JSON.parse(fs.readFileSync(existingManifestPath, 'utf8'));
    } catch (e) {
      console.warn('Could not read existing manifest, starting fresh');
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    books: {}
  };

  // Scan data directory for books and sort them chronologically
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  const availableBooks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const bookId = entry.name;
    if (BOOKS[bookId]) {
      availableBooks.push(bookId);
    }
  }

  // Sort books in chronological order
  const sortedBooks = CHRONOLOGICAL_ORDER.filter(id => availableBooks.includes(id));

  // Add any books not in the chronological list at the end
  const remainingBooks = availableBooks.filter(id => !sortedBooks.includes(id));
  sortedBooks.push(...remainingBooks);

  for (const bookId of sortedBooks) {

    const bookDir = path.join(DATA_DIR, bookId);
    const chapterFiles = fs.readdirSync(bookDir)
      .filter(f => f.endsWith('.json'))
      .sort();

    if (chapterFiles.length === 0) continue;

    // Read each chapter to get title info
    const chapters = [];
    for (const file of chapterFiles) {
      const chapterNum = file.replace('.json', '');
      const chapterPath = path.join(bookDir, file);

      try {
        const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

        // Preserve existing quality score if available
        const existingChapter = existingManifest.books?.[bookId]?.chapters?.find(c => c.chapter === chapterNum);
        const qualityScore = existingChapter?.qualityScore ?? null;

        chapters.push({
          chapter: chapterNum,
          title: data.meta.title,
          sentenceCount: data.meta.sentenceCount,
          translatedCount: data.meta.translatedCount,
          qualityScore: qualityScore
        });
      } catch (e) {
        console.error(`Error reading ${chapterPath}: ${e.message}`);
      }
    }

    manifest.books[bookId] = {
      ...BOOKS[bookId],
      chapterCount: chapters.length,
      chapters
    };
  }

  return manifest;
}

function main() {
  console.log('Generating manifest...');
  
  const manifest = generateManifest();
  
  // Write to data directory
  const dataManifestPath = path.join(DATA_DIR, 'manifest.json');
  fs.writeFileSync(dataManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Wrote ${dataManifestPath}`);
  
  // Also write to public/data if it exists
  if (fs.existsSync(PUBLIC_DATA_DIR)) {
    const publicManifestPath = path.join(PUBLIC_DATA_DIR, 'manifest.json');
    fs.writeFileSync(publicManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Wrote ${publicManifestPath}`);
  }
  
  // Summary
  const bookCount = Object.keys(manifest.books).length;
  const totalChapters = Object.values(manifest.books).reduce((sum, b) => sum + b.chapterCount, 0);
  console.log(`\nManifest contains ${bookCount} books with ${totalChapters} total chapters.`);
}

main();