#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'Let the Ministry of Civil Affairs, the metropolitan garrison commander, Jiang Guiti, Feng Guozhang, and others strictly guard and earnestly instruct.',
    'The Ministry of Civil Affairs, the metropolitan garrison, Jiang Guiti, Feng Guozhang, and others were ordered to guard strictly and instruct earnestly.',
  ],
  s1002: [
    'So that all may clearly understand the court\'s response to Heaven and the people\'s will, its great impartiality and selflessness.',
    'So all would see the court answering Heaven and the people with great impartiality.',
  ],
  s1003: [
    'As for the state\'s establishment of offices and division of duties to serve as the people\'s pole—',
    'Offices and duties exist to serve as the people\'s pole—',
  ],
  s1004: [
    'within are cabinets, offices, ministries, and bureaus; without are governors-general, governors, and circuit commissioners—all to preserve and comfort the multitude, not set up for one man or one house.',
    'cabinets and ministries within, governors and commissioners without—all to comfort the people, not one man or one house.',
  ],
  s1005: [
    'All of you, great and small officials within and beyond the capital, should deeply reflect on the hard times and carefully keep your posts.',
    'Capital and provincial officials alike should feel the hard times and keep their posts carefully.',
  ],
  s1006: [
    'Each superior should at once be charged earnestly to admonish and warn, that none neglect office, fulfilling Our long-standing intent to cherish the common people.',
    'Each chief should admonish his men not to neglect duty, fulfilling Our long intent to cherish the people.',
  ],
  s1007: [
    '」It also said: 「Earlier, because the overall situation stood on the brink and the myriad people were in distress, We specially ordered the cabinet to negotiate with the revolutionary army the various conditions for preferential treatment of the imperial house, in hope of a peaceful settlement.',
    '」It also said: 「Earlier, with the realm on the brink and the people in distress, We ordered the cabinet to negotiate preferential terms for the imperial house with the revolutionaries in hope of peace.',
  ],
  s1008: [
    'Now according to the returned memorial, the courteous terms offered by the revolutionary army—perpetual rites at the ancestral temples and imperial tombs, and maintenance of former imperial tomb regulations as before—have all been accepted in full.',
    'The returned memorial reported that the revolutionaries\' courteous terms—perpetual temple and tomb rites and maintenance of former tomb rules—were all accepted.',
  ],
  s1009: [
    'The Emperor only lays down ruling power and does not abolish his honored title.',
    'The emperor yields ruling power but keeps his honored title.',
  ],
  s1010: [
    'Eight articles on preferential treatment of the imperial house, four on treatment of the imperial clan, and seven on treatment of Manchus, Mongols, Muslims, and Tibetans were also agreed.',
    'Eight articles on the imperial house, four on the clan, and seven on Manchu, Mongol, Muslim, and Tibetan treatment were also fixed.',
  ],
  s1011: [
    'Reading the memorial, it was thorough indeed.',
    'The memorial was judged thorough.',
  ],
  s1012: [
    'This is specially proclaimed to the imperial clan and to the Manchus, Mongols, Muslims, and Tibetans: hereafter you must dissolve boundaries, jointly preserve security, behold the world\'s peace restored, and all share the happiness of the republic—We place great hope in this.',
    'The throne proclaimed to the clan and to Manchus, Mongols, Muslims, and Tibetans: dissolve old boundaries, keep the peace together, see the world made tranquil, and share republican happiness—on this We set great hope.',
  ],
  s1013: [
    '」Thereupon the throne was yielded.',
    'With that, the abdication was carried out.',
  ],
  s1014: [
    'The historiographer says: The Emperor succeeded in tender years; a regent ruled the realm; military and state affairs were all disposed by him, and great matters were also reported to the Empress Dowager for decision.',
    'The historiographer says: The emperor came to the throne as a child; a regent ruled; military and civil affairs all passed through him, and great matters were reported to the empress dowager.',
  ],
  s1015: [
    'When great change broke out, he at once yielded power; all under Heaven was for the public, and preferential treatment was preserved forever—thus opening a wonder without precedent in a thousand ages.',
    'When great change broke out he yielded power at once; all under Heaven was for the public and preferential treatment was preserved—a wonder without precedent.',
  ],
  s1016: [
    'Like the guest of Yu on the throne, the ritual and cultural forms were still renewed.',
    'Like Yu\'s guest on the throne, ritual and culture were still renewed.',
  ],
  s1017: [
    'When right and wrong are finally settled, those who compile history always find it hard.',
    'When judgment is finally rendered, historians always find it hard.',
  ],
  s1018: [
    'Yet when Confucius compiled the Spring and Autumn Annals, he wrote what should be written and cut what should be cut.',
    'Yet Confucius compiling the Spring and Autumn Annals wrote what should be written and cut what should be cut.',
  ],
  s1019: [
    'The age he saw is recorded in even greater detail than the age he only heard of; the events of a single court—how can they be left blank?',
    'The age he saw is set down more fully than the age he heard of; how can a single reign\'s record be left blank?',
  ],
  s1020: [
    'May this also be judged together by later ages under Heaven?',
    'May later ages under Heaven judge it together as well?',
  ],
  s1021: [
    'Annals 25',
    'Chapter 25',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b11.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
