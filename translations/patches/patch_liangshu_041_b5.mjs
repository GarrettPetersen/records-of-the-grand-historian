#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    '" On leaving the mourning garb he was appointed Gentleman of the Palace Library, literary aide to the Prince of Luling, Secretariat gentleman in the palace bureau, crown prince attendant, and keeper of the records; he was promoted to junior tutor, Secretariat gentleman, and left assistant in the Secretariat.',
    '" After his first office he rose through Gentleman of the Palace Library, literary aide to the Prince of Luling, Secretariat gentleman in the palace bureau, crown prince attendant, and keeper of the records, then junior tutor, Secretariat gentleman, and left assistant in the Secretariat.',
  ],
  s0402: [
    'In his later years he devoted himself solely to Buddhism.',
    'In his last years he gave himself wholly to Buddhist teaching.',
  ],
  s0403: [
    'As magistrate of Xin\'an, a commandery rich in mountains and rivers that suited his temperament, he wandered as inclination led and wrote an account of the place.',
    'Made magistrate of Xin\'an, whose hills and streams were his special delight, he roamed at ease and composed a record of the commandery.',
  ],
  s0404: [
    'He died in office.',
    'He died while holding office.',
  ],
  s0405: [
    'His son Wei, courtesy name Yuanzhuan, also had literary talent.',
    'His son Wei, styled Yuanzhuan, likewise showed a gift for letters.',
  ],
  s0406: [
    'In office he reached crown prince attendant and magistrate of Yongkang.',
    'He served as crown prince attendant and magistrate of Yongkang.',
  ],
  s0407: [
    'The historian says: Wang Gui and his like all enjoyed high repute; meeting a fortunate age, each displayed his talents—how fine.',
    'The historian writes: Men such as Wang Gui all bore famous names; favored by a prosperous reign, each unfolded his abilities—admirable indeed.',
  ],
  s0408: [
    'Xiao Qia\'s composition "On the Royal Road" shows him a master of grand phrasing;',
    'Xiao Qia\'s "On the Royal Road" reveals a writer of mighty eloquence;',
  ],
  s0409: [
    'the brothers Liu Xiaoyi and the rest all won fame through literature.',
    'and the brothers Liu Xiaoyi and the others all rose to notice through their writing.',
  ],
  s0410: [
    'The gentleman knows that the Liang age had men of worth.',
    'A cultivated reader sees that the Liang had men of real stature.',
  ],
  s0411: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0412: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_041_b5.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
