#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Thereupon Qi hundred officials—Prince of Yuzhang Yuanlin and eight hundred nineteen others—and Liang Platform Attendant-in-Ordinary Minister Yun and one hundred seventeen others all submitted memorials urging accession; Gaozu modestly declined and did not accept.',
    'Thereupon eight hundred nineteen Qi officials, led by Prince Yuanlin of Yuzhang, and one hundred seventeen Liang Platform officials, led by Attendant-in-Ordinary Fan Yun, all submitted memorials urging accession; Gaozu modestly declined.',
  ],
  s0702: [
    'That day, Imperial Astronomer Jiang Daoxiu presented sixty-four items of astronomical omens and portents; the matters were all clearly manifest.',
    'That day Imperial Astronomer Jiang Daoxiu presented sixty-four astronomical omens and portents, each clearly established.',
  ],
  s0703: [
    'The ministers again submitted memorials firmly requesting; then he assented.',
    'When the ministers again memorialized, firmly urging him, he at last consented.',
  ],
  s0704: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0705: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang.',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b8.mjs <translation.json>'
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
