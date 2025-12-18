#!/usr/bin/env node

import fs from 'node:fs';

// Read the chapter
const chapter = JSON.parse(fs.readFileSync('data/shiji/015.json', 'utf8'));
const problematicIds = fs.readFileSync('problematic_ids.txt', 'utf8').trim().split('\n').map(line => {
  const match = line.match(/^\d+\.\s*(s\d+)$/);
  return match ? match[1] : null;
}).filter(id => id);

// Create a map of basic translations for common terms
const termMap = {
  // States and entities
  '秦': 'Qin',
  '楚': 'Chu',
  '魏': 'Wei',
  '韓': 'Han',
  '趙': 'Zhao',
  '齊': 'Qi',
  '燕': 'Yan',
  '晉': 'Jin',
  '宋': 'Song',
  '衛': 'Wei',
  '陳': 'Chen',
  '蔡': 'Cai',
  '曹': 'Cao',
  '鄭': 'Zheng',
  '魯': 'Lu',
  '吳': 'Wu',
  '越': 'Yue',
  '蜀': 'Shu',
  '巴': 'Ba',
  '中原': 'the Central Plains',

  // Actions
  '伐': 'Attacked',
  '擊': 'Attacked',
  '敗': 'Defeated',
  '取': 'Took',
  '拔': 'Captured',
  '圍': 'Besieged',
  '救': 'Saved/Rescued',
  '侵': 'Invaded',
  '入': 'Entered',
  '出': 'Went out',
  '至': 'Reached',
  '城': 'Built city of',
  '築': 'Built',
  '縣': 'Established county of',
  '賀': 'Congratulated',
  '致': 'Sent',

  // Places (common ones)
  '邯鄲': 'Handan',
  '臨淄': 'Linzi',
  '大梁': 'Daliang',
  '咸陽': 'Xianyang',
  '滎陽': 'Xingyang',
  '長平': 'Changping',
  '馬陵': 'Maling',
  '即墨': 'Jimo',
  '莒': 'Ju',
  '安陽': 'Anyang',
  '魯陽': 'Luyang',
  '觀': 'Guan',
  '武都': 'Wudu',
  '櫟陽': 'Queyang',
  '桑丘': 'Sangqiu',
  '靈丘': 'Lingqiu',
  '澮': 'Hua',
  '懷': 'Huai',
  '藺': 'Lin',
  '皮牢': 'Pilao',
  '宅陽': 'Zhaiyang',
  '洛陰': 'Luoyin',
  '少梁': 'Shaoliang',
  '涿澤': 'Zhuoze',
  '陽狐': 'Yanghu',
  '乘丘': 'Chengqiu',
  '酸棗': 'Suanzao',
  '儀臺': 'Yitai',
  '茲方': 'Zifang',
  '元里': 'Yuanli',
  '臨晉': 'Linjin',
  '伊闕': 'Yique',
  '宜陽': 'Yiyang',
  '負黍': 'Fushu',
  '襄陵': 'Xiangling',
  '平陸': 'Pinglu',
  '陰晉': 'Yinjìn',
  '濁澤': 'Zhuoze',
  '南鄭': 'Nanzheng',
  '黃池': 'Huangchi',
  '朱': 'Zhu'
};

function basicTranslate(text) {
  // Remove the year prefix like "九。" or "二十三。" and keep just the event description
  let cleanText = text.replace(/^\d+。/, '').trim();

  // Replace known terms
  for (const [chinese, english] of Object.entries(termMap)) {
    cleanText = cleanText.replace(new RegExp(chinese, 'g'), english);
  }

  // Handle some common patterns
  cleanText = cleanText.replace(/(\w+)敗(\w+)/g, '$2 defeated $1');
  cleanText = cleanText.replace(/伐(\w+)/g, 'Attacked $1');
  cleanText = cleanText.replace(/取(\w+)/g, 'Took $1');
  cleanText = cleanText.replace(/圍(\w+)/g, 'Besieged $1');
  cleanText = cleanText.replace(/救(\w+)/g, 'Saved $1');
  cleanText = cleanText.replace(/侵(\w+)/g, 'Invaded $1');

  return cleanText;
}

// Apply corrections for remaining problematic entries
let appliedCount = 0;
const corrections = {};

for (const id of problematicIds.slice(60)) { // Skip the ones we already fixed
  // Find the entry
  let found = false;
  let chineseText = '';
  let isTableRow = false;

  // Check table rows
  for (const block of chapter.content) {
    if (block.type === 'table_row') {
      for (const cell of block.cells) {
        if (cell.id === id) {
          chineseText = cell.content;
          isTableRow = true;
          found = true;
          break;
        }
      }
    }
    if (found) break;
  }

  if (!found) {
    // Check paragraphs
    for (const block of chapter.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences) {
          if (sentence.id === id) {
            chineseText = sentence.zh;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
  }

  if (found && chineseText) {
    const basicTranslation = basicTranslate(chineseText);
    if (basicTranslation !== chineseText) { // Only if we made changes
      corrections[id] = basicTranslation;
      appliedCount++;
    }
  }

  if (appliedCount >= 50) break; // Limit to 50 at a time
}

console.log(`Generated ${appliedCount} basic translations`);
console.log('Sample corrections:');
console.log(JSON.stringify(Object.fromEntries(Object.entries(corrections).slice(0, 5)), null, 2));

// Apply the corrections
for (const block of chapter.content) {
  if (block.type === 'paragraph') {
    for (const sentence of block.sentences) {
      if (corrections[sentence.id]) {
        sentence.translations[0] = {
          lang: 'en',
          text: corrections[sentence.id],
          translator: 'Garrett Petersen (auto-generated)',
          model: 'basic-pattern-matching'
        };
      }
    }
  } else if (block.type === 'table_row') {
    for (const cell of block.cells) {
      if (corrections[cell.id]) {
        cell.translation = corrections[cell.id];
        cell.translator = 'Garrett Petersen (auto-generated)';
        cell.model = 'basic-pattern-matching';
      }
    }
  }
}

// Write back
fs.writeFileSync('data/shiji/015.json', JSON.stringify(chapter, null, 2));
console.log(`Applied ${Object.keys(corrections).length} auto-generated translations`);
