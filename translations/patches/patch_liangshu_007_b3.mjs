#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'In the fifth month of Taiping year 3, she was condemned to death and buried at Waguan Temple in Jiangling.',
    'In the fifth month of Taiping year 3 she was put to death by imperial reproof and buried at Jiangling\'s Waguan Temple.',
  ],
  s0202: [
    'The historian says:',
    'The historian says:',
  ],
  s0203: [
    'The historian says: The Way of empresses and consorts commends the royal wind and transforms the realm under Heaven—this broadly takes the meaning of "Ge Tan" and "Kuan-chiu."',
    'The historian writes: Empresses and consorts should uphold the court\'s moral influence and civilize the realm, following the spirit of "Ge Tan" and "Kuan-chiu."',
  ],
  s0204: [
    'As for Consort Mu the Precious, her fine splendor showed early; she bore the heir apparent; her virtue enriched the six palaces—beautiful indeed.',
    'Of Consort Mu the Precious: her merit shone early, she bore the heir apparent, and her virtue filled the six palaces—admirable indeed.',
  ],
  s0205: [
    'As for Shizu\'s Consort Xu, her want of conduct brought destruction on herself—fitting indeed.',
    'Shizu\'s Consort Xu, for her misdeeds, destroyed herself—as was fitting.',
  ],
  s0206: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0207: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_007_b3.mjs <translation.json>'
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
