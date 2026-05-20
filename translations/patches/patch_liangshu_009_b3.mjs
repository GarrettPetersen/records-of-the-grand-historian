#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    '」 When the coffin returned to the capital, Gaozu went out in person to mourn.',
    'When the coffin returned to the capital, Gaozu went out in person to mourn.',
  ],
  s0202: [
    'His son Jin succeeded.',
    'His son Jin succeeded.',
  ],
  s0203: [
    'Earlier, Qingyuan\'s paternal cousin, the General of the Guard Shilong, had once told Qingyuan: "I once dreamed the Grand Marshal gave me bedding; I then stood second to the Three Excellencies. Now I dream again that I gave you my bedding—you will surely bring glory to our clan."',
    'Earlier Qingyuan\'s paternal cousin, General of the Guard Shilong, had told him: "I once dreamed the Grand Marshal gave me bedding and I rose next to the Three Excellencies. Now I dream I gave you my bedding—you will surely honor our house."',
  ],
  s0204: [
    'By then Qingyuan had indeed followed in Shilong\'s footsteps.',
    'By then Qingyuan had indeed followed in Shilong\'s footsteps.',
  ],
  s0205: [
    'Chen Minister of the Secretariat Yao Cha said: Wang Mao, Cao Jingzong, and Liu Qingyuan, though from military families for generations, had not yet shown extraordinary deeds.',
    'The Chen Minister of the Secretariat Yao Cha said: Wang Mao, Cao Jingzong, and Liu Qingyuan came from generations of generals yet had not yet shown extraordinary deeds.',
  ],
  s0206: [
    'When Liang arose, they rode the last light of the age to fulfill their ambitions—rivaling Fang and Shao, their merit engraved on bells and cauldrons. How grand!',
    'When Liang arose they caught the day\'s last light and achieved their aims—rivaling Fang Hu and Shao Yi, their deeds cut into bell and tripod. Magnificent!',
  ],
  s0207: [
    'In Han, Guangwu treated his meritorious ministers with full favor, yet granted them no more than Palace Attendant or Special Advance; Kou, Deng, Geng, and Jia never used their full capacity.',
    'Han\'s Guangwu cherished his merit-holders yet gave them only Palace Attendant or Special Advance; Kou, Deng, Geng, and Jia never exhausted their talents.',
  ],
  s0208: [
    'Mao and the others in turn held command of provinces, ending as supreme generals—the bond between ruler and minister surpassed the former age.',
    'Mao and the others in turn held provincial commands and died as supreme generals; the bond between throne and minister outdid earlier times.',
  ],
  s0209: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0210: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_009_b3.mjs <translation.json>'
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
