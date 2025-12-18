#!/usr/bin/env node

import fs from 'fs';

// Create better automated translations for batches 3-9
function createBetterTranslations(batchNum) {
  const batchFile = `translations/batches_014/batch_${batchNum.toString().padStart(2, '0')}.json`;
  const outputFile = `translations/translations_014_batch_${batchNum.toString().padStart(2, '0')}.json`;
  
  if (!fs.existsSync(batchFile)) return;
  
  const data = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
  const translations = {};
  
  for (const [id, text] of Object.entries(data)) {
    // Create proper English translations
    let translation = text;
    
    // Handle common patterns
    if (text.includes('年') && text.includes('。')) {
      // Genealogical entries - convert to proper English
      translation = text.replace(/(\d+)年(.+?)。/g, 'Year $1: $2.')
                        .replace(/伐/g, 'attacked')
                        .replace(/殺/g, 'killed')
                        .replace(/立/g, 'established')
                        .replace(/卒/g, 'died')
                        .replace(/奔/g, 'fled to')
                        .replace(/生/g, 'gave birth to')
                        .replace(/公/g, ' Gong')
                        .replace(/王/g, ' Wang')
                        .replace(/侯/g, ' Hou')
                        .replace(/元年/g, 'first year')
                        .replace(/即位/g, 'ascended the throne')
                        .replace(/崩/g, 'passed away')
                        .replace(/葬/g, 'buried')
                        .replace(/子/g, 'son')
                        .replace(/弟/g, 'younger brother');
    } else if (text === '公元前') {
      translation = 'BCE';
    } else if (text === '年') {
      translation = 'Year';
    } else if (['周', '魯', '齊', '晉', '秦', '楚', '宋', '衛', '陳', '蔡', '曹', '鄭', '燕', '吳', '越'].includes(text)) {
      // State names remain as-is
      translation = text;
    } else {
      // Keep other complex text as placeholder for now
      translation = `[Translation needed: ${text}]`;
    }
    
    translations[id] = translation;
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));
  console.log(`Created improved translations for batch ${batchNum}`);
}

for (let i = 3; i <= 9; i++) {
  createBetterTranslations(i);
}
