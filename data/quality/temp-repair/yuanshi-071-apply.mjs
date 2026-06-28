#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-yuanshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

function withMeta(rows) {
  return rows.map((row) => ({ ...row, translator: T, model: M }));
}

const packets = {
  'source-yuanshi-071-wikisource-3b2bdb2495ea': {
    manualTranslations: withMeta([
      {
        zh: '〈（一絃琴三，三絃以下皆六。',
        literal: '(Three one-string zithers; six each of three-string and below.',
        idiomatic: '(Three one-string zithers; six each of three-string and below.',
      },
    ]),
    acceptedSourceText: '〈（一絃琴三，三絃以下皆六。',
    notes:
      'Corrected annotation text from 五弦 to 三絃 per upstream; preserved local 〈（ annotation opener.',
  },
  'source-yuanshi-071-wikisource-79f610477f0c': {
    manualTranslations: withMeta([
      {
        zh: '閏餘匏在簫之東，七星匏在西，九曜匏次之。',
        literal:
          'The intercalary-surplus gourd-pipe was east of the xiao; the Seven Stars gourd-pipe was west; the Nine Luminaries gourd-pipe came after it.',
        idiomatic:
          'The intercalary-surplus gourd-pipe stood east of the xiao; the Seven Stars gourd-pipe to the west; the Nine Luminaries gourd-pipe followed.',
      },
      {
        zh: '一絃琴列路鼓之東西，',
        literal: 'One-string zithers were arrayed east and west of the road drums,',
        idiomatic: 'One-string zithers were placed east and west of the road drums,',
      },
      {
        zh: '〈（東一，西二。）〉',
        literal: '(one in the east, two in the west.)',
        idiomatic: '(one in the east, two in the west.)',
      },
      {
        zh: '三絃、五絃、七絃、九絃次之。',
        literal: 'three-string, five-string, seven-string, and nine-string zithers came after.',
        idiomatic: 'followed by three-, five-, seven-, and nine-string zithers.',
      },
    ]),
    acceptedSourceText:
      '閏餘匏在簫之東，七星匏在西，九曜匏次之。一絃琴列路鼓之東西，〈（東一，西二。）〉三絃、五絃、七絃、九絃次之。',
    notes:
      'Normalized 余/弦 graph variants to 餘/絃; preserved local annotation sentence for 東一，西二.',
  },
  'source-yuanshi-071-wikisource-7ea7915c63db': {
    manualTranslations: withMeta([
      {
        zh: '凡樂作，則跪，俛伏，舉麾以興，工鼓柷以奏；',
        literal:
          'Whenever music began, they knelt and prostrated themselves, raised the banner to start it, and the workers drummed the zhu to play;',
        idiomatic:
          'When music began, they knelt and prostrated themselves, raised the banner to start it, and the musicians drummed the zhu to play;',
      },
      {
        zh: '樂止則偃麾，工戞敔而樂止。',
        literal: 'when it stopped they lowered the banner, and the workers struck the yi and the music ceased.',
        idiomatic: 'when it stopped they lowered the banner, and the musicians struck the yi to end the music.',
      },
    ]),
    notes: 'Restored missing instrument names 柷 and 敔; normalized 俯伏 to 俛伏 per upstream.',
  },
  'source-yuanshi-071-wikisource-e8187c7a2f42': {
    manualTranslations: withMeta([
      {
        zh: '𥱧，制如箏而七絃，有柱，用竹軋之。',
        literal:
          'The ya was made like the zheng but with seven strings, with bridges, played by rubbing with bamboo.',
        idiomatic:
          'The ya (zha zheng) resembled the zheng but had seven strings and bridges, and was played by rubbing with bamboo.',
      },
    ]),
    notes: 'Corrected misread 闉 to upstream 𥱧 (zha zheng); normalized 七弦 to 七絃.',
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, patch] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = patch.manualTranslations;
  if (patch.acceptedSourceText) item.acceptedSourceText = patch.acceptedSourceText;
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = patch.notes;
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

console.log('Applied source correspondence items for yuanshi/071.');
