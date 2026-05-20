#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Bozhi then at Shouyang led a host of eight thousand in surrender.',
    'Bozhi then at Shouyang led eight thousand men home in surrender.',
  ],
  s0202: [
    'Huya was killed by Wei men.',
    'Huya was killed by the Wei.',
  ],
  s0203: [
    'When Bozhi arrived he was made Bearer of Staff, Area Commander of Western Xinyang military affairs, Pacification North General, and Western Xinyang Inspector, Marquis of Yongxin county, fief of one thousand households.',
    'When Bozhi arrived he was made bearer of staff, area commander of Western Xinyang, Pacification North general, and Western Xinyang inspector, Marquis of Yongxin with a fief of one thousand households.',
  ],
  s0204: [
    'Before he took the post he was again made Regular Attendant-through-passage Scattered Cavalry Attendant, Valiant Cavalry General, and also Grand Master for Consulting the Monarch.',
    'Before taking post he was again made through-passage scattered cavalry attendant, Valiant Cavalry general, and grand master for consulting the monarch.',
  ],
  s0205: [
    'After a long while he died at home.',
    'After a long while he died at home.',
  ],
  s0206: [
    'Some of his sons were still in Wei.',
    'Some of his sons were still in Wei.',
  ],
  s0207: [
    'Chu Chuo was in Wei; the Wei wished to promote and employ him.',
    'Chu Chuo was in Wei, and the Wei court wished to promote and employ him.',
  ],
  s0208: [
    'At the Wei new year\'s court assembly Chu jested in verse, saying: "Upon his hat he set a cage-crown; upon his trousers he wore vermilion robes—not knowing whether this is now, not knowing whether that was not then.',
    'At the Wei New Year assembly Chu jested in verse: "A cage-crown on his hat, vermilion robes on his trousers—he cannot tell now from then, nor then from now.',
  ],
  s0209: [
    '" The Wei were enraged and sent him out as Administrator of Shiping.',
    '" The Wei were enraged and posted him as administrator of Shiping.',
  ],
  s0210: [
    'He went hunting daily and died falling from his horse.',
    'He hunted every day and died in a fall from his horse.',
  ],
  s0211: [
    'The historian says: Liu Jilian had the small refinements of a literary official, yet could not preserve himself—such is growing accustomed to disorder.',
    'The historian writes: Liu Jilian had a literary man\'s polish, yet could not save himself—as habit in troubled times will do.',
  ],
  s0212: [
    'Chen Bozhi was a petty man who took up the vessel of a gentleman; the bandit mob further slandered and seized it from him—how could it last long?',
    'Chen Bozhi was a petty man wielding a gentleman\'s post; the robber bands slandered and tore it from him—how could he endure?',
  ],
  s0213: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0214: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_020_b3.mjs <translation.json>'
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
