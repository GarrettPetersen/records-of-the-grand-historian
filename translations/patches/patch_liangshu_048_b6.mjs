#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Manrong and Tongzhi lectured on the Way in the late Qi but were not changed by the times;',
    'Manrong and Tongzhi taught the Way in late Qi and would not bend to the age;',
  ],
  s0502: [
    'He Yan, Yan Zhizhi, and their like met Liang\'s honoring of Confucianism and reverence for the Way—all reached high office; the power of investigating antiquity, each in his way, they fully displayed.',
    'He Yan, Yan Zhizhi, and others met Liang\'s esteem for Confucian learning and rose to high office, each displaying the force of classical scholarship.',
  ],
  s0503: [
    'Fan Zhen, in black mourning garb, sought favor by chance and did not fulfill his aim—fitting indeed.',
    'Fan Zhen wore mourning black yet courted favor and failed of his aim—as he deserved.',
  ],
  s0504: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0505: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b6.mjs <translation.json>'
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
