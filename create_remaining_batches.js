#!/usr/bin/env node

import fs from 'fs';

// Get remaining untranslated sentences
const data = JSON.parse(fs.readFileSync('data/shiji/047.json', 'utf8'));
const untranslated = [];
data.content.forEach(block => {
  if (block.sentences) {
    block.sentences.forEach(s => {
      if (!s.translations || s.translations.length === 0 || !s.translations[0].text || !s.translations[0].text.trim()) {
        untranslated.push({
          id: s.id,
          zh: s.zh || s.content
        });
      }
    });
  }
});

console.log(`Remaining untranslated: ${untranslated.length} sentences`);

// Create batches 4-13
const batchSize = 50;
for (let i = 0; i < untranslated.length; i += batchSize) {
  const batchNum = 4 + Math.floor(i / batchSize);
  const batchSentences = untranslated.slice(i, i + batchSize);

  const batchFile = `translations/fresh_batch_047_${batchNum}.json`;
  const batch = {};
  batchSentences.forEach(s => {
    batch[s.id] = s.zh;
  });

  fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2));
  console.log(`Created ${batchFile} with ${batchSentences.length} sentences`);
}

console.log('Batch creation complete.');
