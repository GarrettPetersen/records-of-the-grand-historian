#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-liaoshi.json';
const ID = 'source-liaoshi-054-wikisource-cc1ed8969e48';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const rows = [
  {
    zh: '聖宗統和元年，冊承天皇太后，設宮懸、簨虡，太樂工、協律郎入。',
    literal: 'In the first year of Tonghe, Emperor Shengzong, at the investiture of Empress Dowager Chengtian, suspended bells and music frames were set up; musicians of the Grand Music Office and pitch-tuning officers entered.',
    idiomatic: 'In the first year of Tonghe, at the investiture of Empress Dowager Chengtian, full suspended bells and music frames were installed; musicians of the Grand Music Office and pitch-tuning officers took their places.',
  },
  {
    zh: '太后儀衛動，舉麾，《太和》樂作；',
    literal: 'When the empress dowager\'s guards moved, the baton was raised and the music Taihe sounded;',
    idiomatic: 'When the empress dowager\'s guards moved, the baton was raised and the music Taihe began;',
  },
  {
    zh: '太樂令、太常卿導引升御坐，簾卷，樂止。',
    literal: 'the Director of Music and the Director of the Court of Imperial Sacrifices led her up to the imperial seat, the curtains were raised, and the music ceased.',
    idiomatic: 'the Director of Music and the Director of the Court of Imperial Sacrifices led her up to the throne, the curtains were raised, and the music ceased.',
  },
  {
    zh: '文武三品以上入，《舒和》樂作；',
    literal: 'Civil and military officials of the third rank and above entered; the music Shuhe sounded;',
    idiomatic: 'Civil and military officials of the third rank and above entered; the music Shuhe sounded;',
  },
  {
    zh: '至位，樂止。',
    literal: 'when they reached their places, the music ceased.',
    idiomatic: 'when they reached their places, the music ceased.',
  },
  {
    zh: '皇帝入門，《雍和》樂作；',
    literal: 'The emperor entered the gate; the music Yonghe sounded;',
    idiomatic: 'The emperor entered the gate; the music Yonghe sounded;',
  },
  {
    zh: '至殿前位，樂止。',
    literal: 'when he reached his place before the hall, the music ceased.',
    idiomatic: 'when he reached his place before the hall, the music ceased.',
  },
  {
    zh: '宰相押冊，皇帝隨冊，樂作；',
    literal: 'The chief minister escorted the register, the emperor followed the register, music sounded;',
    idiomatic: 'The chief minister escorted the document of investiture, the emperor followed the register, and music sounded;',
  },
  {
    zh: '至殿前置冊於案，樂止。',
    literal: 'when the register was placed on the table before the hall, the music ceased.',
    idiomatic: 'when the document was set on the table before the hall, the music ceased.',
  },
  {
    zh: '翰林學士、大將軍舁冊，樂作；',
    literal: 'Hanlin academicians and the grand general bore the register, music sounded;',
    idiomatic: 'Hanlin academicians and the grand general bore the register, music sounded;',
  },
  {
    zh: '置御坐前，樂止。',
    literal: 'when it was set before the imperial seat, the music ceased.',
    idiomatic: 'when it was set before the throne, the music ceased.',
  },
  {
    zh: '丞相上殿，樂作；',
    literal: 'The chief counselor ascended the hall, music sounded;',
    idiomatic: 'The chief counselor ascended the hall, music sounded;',
  },
  {
    zh: '至讀冊位，樂止。',
    literal: 'when he reached the place for reading the register, the music ceased.',
    idiomatic: 'when he reached the place for reading the register, the music ceased.',
  },
  {
    zh: '皇帝下殿，樂作；',
    literal: 'The emperor descended from the hall, music sounded;',
    idiomatic: 'The emperor descended from the hall, music sounded;',
  },
  {
    zh: '至位，樂止。',
    literal: 'when he reached his place, the music ceased.',
    idiomatic: 'when he reached his place, the music ceased.',
  },
  {
    zh: '太后宣答訖，樂作；',
    literal: 'When the empress dowager had finished her proclamation and response, music sounded;',
    idiomatic: 'When the empress dowager had finished her proclamation and response, music sounded;',
  },
  {
    zh: '皇帝至西閣，樂止。',
    literal: 'when the emperor reached the west side chamber, the music ceased.',
    idiomatic: 'when the emperor reached the west side chamber, the music ceased.',
  },
  {
    zh: '親王、丞相上殿，樂作；',
    literal: 'Princes and the chief counselor ascended the hall, music sounded;',
    idiomatic: 'Princes and the chief counselor ascended the hall, music sounded;',
  },
  {
    zh: '退班出，樂止。',
    literal: 'when they withdrew from the ranks and departed, the music ceased.',
    idiomatic: 'when they withdrew from the ranks and departed, the music ceased.',
  },
  {
    zh: '下簾，樂作；',
    literal: 'The curtains were lowered, music sounded;',
    idiomatic: 'The curtains were lowered, music sounded;',
  },
  {
    zh: '皇太后入內，樂止。',
    literal: 'when the empress dowager entered the inner quarters, the music ceased.',
    idiomatic: 'when the empress dowager entered the inner quarters, the music ceased.',
  },
];

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const item = queue.items.find((x) => x.id === ID);
if (!item) throw new Error(`Missing ${ID}`);

item.manualTranslations = rows.map((row) => ({ ...row, translator: T, model: M }));
item.acceptedSourceText = rows.map((r) => r.zh).join('');
item.status = 'approved';
item.decision = 'approved';
item.notes = 'Restored missing Tonghe-era empress dowager investiture ceremony text with manual translations.';
item.reviewedAt = new Date().toISOString();
item.reviewer = 'sdk-repair-chapter';
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

execSync(
  `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${ID} --item ${ID} --reviewer sdk-repair-chapter`,
  { stdio: 'inherit' },
);

console.log('Applied liaoshi/054 Tonghe ceremony omission.');
