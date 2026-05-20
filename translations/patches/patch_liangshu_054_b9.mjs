#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'They know letters and documents.',
    'They were literate in correspondence.',
  ],
  s0802: [
    'They plant mulberry and hemp.',
    'They cultivated mulberry and hemp.',
  ],
  s0803: [
    'They produce pongee, silk, fine cloth, lacquer, wax, pepper, and the like.',
    'They exported pongee, silk, fine cloth, lacquer, wax, pepper, and similar goods.',
  ],
  s0804: [
    'Their mountains yield copper and iron.',
    'The mountains produced copper and iron.',
  ],
  s0805: ['Kingdom of Ruru', 'Kingdom of Ruru'],
  s0806: [
    'Their state can by art sacrifice to Heaven and bring wind and snow; facing it one meets bright sun, behind one muddy flood streams across—thus when they are defeated none can pursue them.',
    'The Ruru could perform rituals to Heaven and summon wind and snow; bright sun lay ahead while muddy floods swept behind, so when they broke and fled no pursuer could catch them.',
  ],
  s0807: [
    'If performed within Central China, then it grows dim but does not rain; asked the reason, they say it is because of warmth.',
    'Performed in China proper, the rite only darkened the sky without bringing rain; asked why, they said the land was too warm.',
  ],
  s0808: [
    'The historian writes: The states of the Southern Sea, Eastern Yi, and Northwestern Rong—all lands at the utter edge of the realm, each with its own territory.',
    'The historian writes: From the Southern Sea to the Eastern Yi and Northwestern Rong, these states lay at the far edge of the world, each with its own domain.',
  ],
  s0809: [
    'As for strange mountains and wondrous seas, monstrous kinds and exotic species—none heard of in former antiquity, not recorded in prior documents.',
    'Strange peaks and curious seas, freakish breeds and alien peoples—nothing former ages had heard of, nothing old annals had set down.',
  ],
  s0810: [
    'Thus one knows that beyond the Nine Provinces and outside the Eight Wastes, in discerning regional products and soils, none can exhaust the furthest limit.',
    'So it is clear: beyond the Nine Provinces and past the Eight Wastes, cataloguing every land and tribute would never reach the end.',
  ],
  s0811: [
    'Gaozu embraced them through virtue, and so tribute arrived year after year—how fine.',
    'Gaozu drew them in through virtue, and tribute came year after year—a thing of beauty.',
  ],
  s0812: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0813: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b9.mjs <translation.json>'
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
