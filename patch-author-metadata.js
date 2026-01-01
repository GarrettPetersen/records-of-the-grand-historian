#!/usr/bin/env node

/**
 * patch-author-metadata.js - Update all chapter JSON files with author metadata
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = './data';

const BOOKS_METADATA = {
  shiji: { author: 'Sima Qian', authorChinese: '司馬遷' },
  hanshu: { author: 'Ban Gu', authorChinese: '班固' },
  houhanshu: { author: 'Fan Ye', authorChinese: '范曄' },
  sanguozhi: { author: 'Chen Shou', authorChinese: '陳壽' },
  jinshu: { author: 'Fang Xuanling et al.', authorChinese: '房玄齡等' },
  songshu: { author: 'Shen Yue', authorChinese: '沈約' },
  nanqishu: { author: 'Xiao Zixian', authorChinese: '蕭子顯' },
  liangshu: { author: 'Yao Silian', authorChinese: '姚思廉' },
  chenshu: { author: 'Yao Silian', authorChinese: '姚思廉' },
  weishu: { author: 'Wei Shou', authorChinese: '魏收' },
  beiqishu: { author: 'Li Baiyao', authorChinese: '李百藥' },
  zhoushu: { author: 'Linghu Defen et al.', authorChinese: '令狐德棻等' },
  suishu: { author: 'Wei Zheng et al.', authorChinese: '魏徵等' },
  nanshi: { author: 'Li Yanshou', authorChinese: '李延壽' },
  beishi: { author: 'Li Yanshou', authorChinese: '李延壽' },
  jiutangshu: { author: 'Liu Xu et al.', authorChinese: '劉昫等' },
  xintangshu: { author: 'Ouyang Xiu and Song Qi', authorChinese: '歐陽修、宋祁' },
  jiuwudaishi: { author: 'Xue Juzheng et al.', authorChinese: '薛居正等' },
  xinwudaishi: { author: 'Ouyang Xiu', authorChinese: '歐陽修' },
  songshi: { author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  liaoshi: { author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  jinshi: { author: 'Toqto\'a et al.', authorChinese: '脫脫等' },
  yuanshi: { author: 'Song Lian et al.', authorChinese: '宋濂等' },
  mingshi: { author: 'Zhang Tingyu et al.', authorChinese: '張廷玉等' }
};

function patchFiles() {
  const books = fs.readdirSync(DATA_DIR).filter(f => fs.statSync(path.join(DATA_DIR, f)).isDirectory() && f !== 'public');
  
  for (const bookId of books) {
    const metadata = BOOKS_METADATA[bookId];
    if (!metadata) continue;
    
    const bookDir = path.join(DATA_DIR, bookId);
    const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.json'));
    
    console.log(`Patching ${bookId}...`);
    
    for (const file of files) {
      const filePath = path.join(bookDir, file);
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (content.meta && content.meta.bookInfo) {
          content.meta.bookInfo.author = metadata.author;
          content.meta.bookInfo.authorChinese = metadata.authorChinese;
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        }
      } catch (e) {
        console.error(`Error patching ${filePath}: ${e.message}`);
      }
    }
  }
}

patchFiles();

