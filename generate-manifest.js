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

const BOOKS = {
  shiji: { name: 'Records of the Grand Historian', chinese: '史記', pinyin: 'Shǐjì', dynasty: 'Xia to Han' },
  hanshu: { name: 'Book of Han', chinese: '漢書', pinyin: 'Hànshū', dynasty: 'Western Han' },
  houhanshu: { name: 'Book of Later Han', chinese: '後漢書', pinyin: 'Hòu Hànshū', dynasty: 'Eastern Han' },
  sanguozhi: { name: 'Records of the Three Kingdoms', chinese: '三國志', pinyin: 'Sānguó Zhì', dynasty: 'Three Kingdoms' },
  jinshu: { name: 'Book of Jin', chinese: '晉書', pinyin: 'Jìnshū', dynasty: 'Jin' },
  songshu: { name: 'Book of Song', chinese: '宋書', pinyin: 'Sòngshū', dynasty: 'Liu Song' },
  nanqishu: { name: 'Book of Southern Qi', chinese: '南齊書', pinyin: 'Nán Qíshū', dynasty: 'Southern Qi' },
  liangshu: { name: 'Book of Liang', chinese: '梁書', pinyin: 'Liángshū', dynasty: 'Liang' },
  chenshu: { name: 'Book of Chen', chinese: '陳書', pinyin: 'Chénshū', dynasty: 'Chen' },
  weishu: { name: 'Book of Wei', chinese: '魏書', pinyin: 'Wèishū', dynasty: 'Northern Wei' },
  beiqishu: { name: 'Book of Northern Qi', chinese: '北齊書', pinyin: 'Běi Qíshū', dynasty: 'Northern Qi' },
  zhoushu: { name: 'Book of Zhou', chinese: '周書', pinyin: 'Zhōushū', dynasty: 'Northern Zhou' },
  suishu: { name: 'Book of Sui', chinese: '隋書', pinyin: 'Suíshū', dynasty: 'Sui' },
  nanshi: { name: 'History of the Southern Dynasties', chinese: '南史', pinyin: 'Nánshǐ', dynasty: 'Southern Dynasties' },
  beishi: { name: 'History of the Northern Dynasties', chinese: '北史', pinyin: 'Běishǐ', dynasty: 'Northern Dynasties' },
  jiutangshu: { name: 'Old Book of Tang', chinese: '舊唐書', pinyin: 'Jiù Tángshū', dynasty: 'Tang' },
  xintangshu: { name: 'New Book of Tang', chinese: '新唐書', pinyin: 'Xīn Tángshū', dynasty: 'Tang' },
  jiuwudaishi: { name: 'Old History of the Five Dynasties', chinese: '舊五代史', pinyin: 'Jiù Wǔdàishǐ', dynasty: 'Five Dynasties' },
  xinwudaishi: { name: 'New History of the Five Dynasties', chinese: '新五代史', pinyin: 'Xīn Wǔdàishǐ', dynasty: 'Five Dynasties' },
  songshi: { name: 'History of Song', chinese: '宋史', pinyin: 'Sòngshǐ', dynasty: 'Song' },
  liaoshi: { name: 'History of Liao', chinese: '遼史', pinyin: 'Liáoshǐ', dynasty: 'Liao (Khitan)' },
  jinshi: { name: 'History of Jin', chinese: '金史', pinyin: 'Jīnshǐ', dynasty: 'Jin (Jurchen)' },
  yuanshi: { name: 'History of Yuan', chinese: '元史', pinyin: 'Yuánshǐ', dynasty: 'Yuan (Mongol)' },
  mingshi: { name: 'History of Ming', chinese: '明史', pinyin: 'Míngshǐ', dynasty: 'Ming' }
};

function generateManifest() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    books: {}
  };

  // Scan data directory for books
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const bookId = entry.name;
    if (!BOOKS[bookId]) continue;
    
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
        chapters.push({
          chapter: chapterNum,
          title: data.meta.title,
          sentenceCount: data.meta.sentenceCount,
          translatedCount: data.meta.translatedCount
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