#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-yuanshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-yuanshi-010-wikisource-2a72ed9a7c51': [
    {
      zh: '以中書右丞別乞里迷失同知樞密院事。',
      literal: 'Right vice chancellor of the Central Secretariat Begirmish was made associate director of the Privy Council.',
      idiomatic: 'Right vice chancellor of the Central Secretariat Begirmish was made associate director of the Privy Council.',
    },
  ],
  'source-yuanshi-010-wikisource-c51ddaf1b882': [
    {
      zh: '帝師亦憐真卒。',
      literal: 'Imperial Preceptor Rinchen died.',
      idiomatic: 'Imperial Preceptor Rinchen died.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.acceptedSourceText = rows.map((r) => r.zh).join('');
  item.status = 'approved';
  item.decision = 'approved';
  item.notes =
    id === 'source-yuanshi-010-wikisource-2a72ed9a7c51'
      ? 'Corrected office title from 左丞 to 右丞 per upstream emendation and chapter 009 appointment; normalized 裏/里 graph variant.'
      : 'Corrected personal name from 亦憐吉 to 亦憐真 (Imperial Preceptor Rinchen); prior English wrongly named Phags-pa.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied source correspondence items for yuanshi/010.');
