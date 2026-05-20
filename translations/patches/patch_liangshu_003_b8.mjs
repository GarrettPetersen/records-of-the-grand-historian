#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'When he reached advanced age, he entrusted affairs to favored minions.',
    'In his old age he handed government over to favored minions.',
  ],
  s0702: [
    'But Zhu Yi and his kind wielded power and enjoyed privilege, formed factions and built cliques, government was achieved through bribery, and who wore caps and rode chariots lay in their grasp—so court regulations fell into chaos and rewards and punishments lacked standard.',
    'But men like Zhu Yi made power and profit, formed factions, bought office with bribes, and controlled who held rank and rode in chariots—so court order collapsed and rewards and punishments had no rule.',
  ],
  s0703: [
    '"The way of petty men grows long"—this is what is meant.',
    '"The way of petty men grows long"—that is what this means.',
  ],
  s0704: [
    'Jia Yi said, "There is cause for bitter weeping."',
    'Jia Yi said, "One could weep in anguish over this."',
  ],
  s0705: [
    'Thus heaven-filling Jie bandits seized the interval to raid by surprise; eagle pennants streamed to the royal hall, golden seals shamed the imperial carriage, the black-haired people were charred, and palaces turned to Grain Tall lament.',
    'Thus Jie bandits filled the heavens, seized their chance, and struck by surprise; eagle banners reached the royal hall, treaty seals humiliated the imperial carriage, the people were scorched, and palace halls became a scene of Grain Tall grief.',
  ],
  s0706: [
    'Alas!',
    'Alas!',
  ],
  s0707: [
    'How cruel is Heaven\'s way!',
    'How cruel Heaven\'s way is!',
  ],
  s0708: [
    'Though the allotted span of the dynasty had reached its end, this was surely also a matter of human affairs.',
    'Though the dynastic tally had run its course, this was surely also the work of men.',
  ],
  s0709: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0710: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b8.mjs <translation.json>'
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
