#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-yuanshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const omissionRows = [
  {
    zh: '秋七月丁卯，泉州天雨白絲，海潮日三至。',
    literal:
      'Autumn, seventh month, on dingmao day, Quanzhou had rain of white silk; the sea tide came three times in one day.',
    idiomatic:
      'In autumn, on the dingmao day of the seventh month, white silk fell like rain on Quanzhou, and the sea tide rose three times in one day.',
  },
  {
    zh: '時享太廟。',
    literal: 'At that time seasonal offerings were presented at the Imperial Ancestral Temple.',
    idiomatic: 'At that time seasonal offerings were presented at the Imperial Ancestral Temple.',
  },
  {
    zh: '戊辰，太白晝見。',
    literal: 'On wuchen day, Venus was seen in daylight.',
    idiomatic: 'On the wuchen day, Venus was seen in daylight.',
  },
  {
    zh: '宦官至一品二品者，依常例給俸祿。',
    literal:
      'Eunuchs who had reached ranks of the first and second grades were granted salaries according to the usual precedent.',
    idiomatic:
      'Eunuchs who had reached first- and second-grade ranks were granted salaries according to usual precedent.',
  },
  {
    zh: '壬申，湖廣行省參知政事阿魯輝復武昌及漢陽府。',
    literal:
      'On renshen day, Aruhui, vice minister of the Huguang Branch Secretariat, recovered Wuchang and Hanyang prefecture.',
    idiomatic:
      'On the renshen day, Aruhui, vice minister of the Huguang branch secretariat, recovered Wuchang and Hanyang.',
  },
  {
    zh: '癸酉，詔詹事院自行銓注本院屬官。',
    literal:
      'On guiyou day, an edict ordered the Household of the Heir Apparent to conduct its own selection and appointment of subordinate officials of the bureau.',
    idiomatic:
      'On the guiyou day, an edict authorized the Household of the Heir Apparent to select and appoint its own subordinate officials.',
  },
  {
    zh: '壬辰，親王只兒哈忽薨于海寧軍中，以其子寶童繼襲王爵。',
    literal:
      'On renchen day, Prince Zhierhahu died in the army at Haining; his son Baotong was ordered to succeed and inherit the princely enfeoffment.',
    idiomatic:
      'On the renchen day, Prince Zhierhahu died in the army at Haining; his son Baotong was ordered to succeed to the princely enfeoffment.',
  },
];

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const item = queue.items.find((x) => x.id === 'source-yuanshi-043-wikisource-ca5f511dde9e');
if (!item) throw new Error('Missing omission queue item');

item.manualTranslations = omissionRows.map((row) => ({
  ...row,
  translator: T,
  model: M,
}));
item.acceptedSourceText = omissionRows.map((row) => row.zh).join('');
item.status = 'approved';
item.decision = 'approved';
item.notes =
  'Restored seven missing seventh-month annals sentences after 是夏，薊州大水 with manual translations.';
item.reviewedAt = new Date().toISOString();
item.reviewer = 'sdk-repair-chapter';

fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

execSync(
  'node scripts/apply-source-correspondence.mjs --queue data/quality/source-correspondence-corpus-wikisource-yuanshi.json --approve source-yuanshi-043-wikisource-ca5f511dde9e --item source-yuanshi-043-wikisource-ca5f511dde9e --reviewer sdk-repair-chapter',
  { stdio: 'inherit' },
);

const denied = [
  {
    id: 'source-yuanshi-043-wikisource-3ce805d95494',
    notes:
      'Reviewed as no-op: 司農分司 and 分司農司 are equivalent office-order variants; chapter consistently uses 分司農司.',
  },
  {
    id: 'source-yuanshi-043-wikisource-a9f0ca0275a4',
    notes:
      'Reviewed as no-op: tenth month already established at s0093; 陞/升 are promotion glyph variants.',
  },
  {
    id: 'source-yuanshi-043-wikisource-ea70914ce083',
    notes:
      'Reviewed as no-op: 并/並 glyph variant and 司農分司/分司農司 office-order variant; local 分司農司 is consistent.',
  },
  {
    id: 'source-yuanshi-043-wikisource-f72bede61f0d',
    notes:
      'Reviewed as no-op: 系/係, 并/並, 衛/衞 glyph variants and 司農分司/分司農司 office-order variant; local text is consistent.',
  },
];

for (const row of denied) {
  execSync(
    `node scripts/mark-source-correspondence.mjs --queue ${QUEUE} --item ${row.id} --decision denied --notes "${row.notes}" --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied yuanshi/043 source correspondence repairs.');
