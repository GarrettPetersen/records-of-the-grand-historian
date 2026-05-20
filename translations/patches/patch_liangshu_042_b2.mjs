#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'When peace envoys were sent, Hou Jing indeed harbored this suspicion and repeatedly memorialized asking that the envoys be recalled; edicts answered only evasively.',
    'When peace envoys were sent, Hou Jing indeed harbored this suspicion and repeatedly memorialized asking that the envoys be recalled; edicts answered only evasively.',
  ],
  s0102: [
    'By the eighth month he had raised troops in rebellion.',
    'By the eighth month he had raised troops in rebellion.',
  ],
  s0103: [
    'In the tenth month he invaded the capital and asked that Zhu Yi be executed.',
    'In the tenth month he invaded the capital and asked that Zhu Yi be executed.',
  ],
  s0104: [
    'In the third year he was promoted to commandant of the central army, attendant as before.',
    'In the third year he was promoted to commandant of the central army, keeping his attendant post.',
  ],
  s0105: [
    'In the second month Jing submitted a memorial before the palace gate, asking to cede the four prefectures west of the river to settle his followers and promising to lift the siege and return to garrison if granted; an edict approved.',
    'In the second month Jing submitted a memorial before the palace gate, asking to cede the four prefectures west of the river to settle his followers and promising to lift the siege and return to garrison if granted; an edict approved.',
  ],
  s0106: [
    'An oath was then sworn west of the city, and Jing asked that the Prince of Xuancheng be sent out as hostage.',
    'An oath was then sworn west of the city, and Jing asked that the Prince of Xuancheng be sent out as hostage.',
  ],
  s0107: [
    'Qi held firm to the weight of the legitimate heir of Xuancheng and said he ought not be granted; the Duke of Stone City, Dakuan, was sent instead.',
    'Qi held firm to the weight of Xuancheng\'s legitimate heir and said he ought not be granted; the Duke of Stone City, Dakuan, was sent instead.',
  ],
  s0115: [
    'Fu Qi\'s discernment of the falseness of the Qi peace offer may be called skill in planning affairs.',
    'Fu Qi\'s discernment of the false peace offered by Qi may be called true skill in planning affairs.',
  ],
  s0108: [
    'When the oath with Jing was finished, civil and military men in the city rejoiced, hoping the siege would be lifted.',
    'When the oath with Jing was finished, civil and military men in the city rejoiced, hoping the siege would be lifted.',
  ],
  s0109: [
    'Qi alone said to the assembly: "The bandit raised troops in rebellion and has not yet obtained peace; barbarian hearts and beast natures cannot be trusted—this peace will in the end be the bandit\'s deceit.',
    'Qi alone said to the assembly, "The bandit raised troops in rebellion and has not yet obtained peace; barbarian hearts and beast natures cannot be trusted—this peace will in the end be the bandit\'s deceit.',
  ],
  s0110: [
    'The crowd all resented and blamed him.',
    'The crowd all resented and blamed him.',
  ],
  s0111: [
    'When Jing broke the oath, none failed to admire him.',
    'When Jing broke the oath, none failed to admire Qi.',
  ],
  s0112: [
    'Soon an edict, for Qi\'s diligence, enfeoffed him as Marquis of Nanfeng with a fief of five hundred households; he firmly refused and did not accept.',
    'Soon an edict, for Qi\'s diligence, enfeoffed him as Marquis of Nanfeng with a fief of five hundred households; he firmly refused and did not accept.',
  ],
  s0113: [
    'When the palace city fell, Qi, though ill, broke out of the encirclement and died at his house.',
    'When the palace city fell, Qi, though ill, broke out of the encirclement and died at his house.',
  ],
  s0114: [
    'Yao Cha of Chen, Minister of Personnel, says: To raise an affair is to fix it in counsel—thus ten thousand undertakings without a missed plan; how true is that saying.',
    'Yao Cha of Chen, Minister of Personnel, writes: To raise an affair is to fix it in counsel—thus ten thousand undertakings without a missed plan; how true is that saying.',
  ],
  s0115: [
    'Fu Qi\'s discernment of the Qi state\'s false peace may be called skill in planning affairs.',
    'Fu Qi\'s discernment of the Qi state\'s false peace may be called skill in planning affairs.',
  ],
  s0116: [
    'Had the court then accepted Qi\'s counsel, the Supreme Purity calamity would surely not have come to be.',
    'Had the court then accepted Qi\'s counsel, the Supreme Purity calamity would surely not have come to be.',
  ],
  s0117: [
    'Master Shen said: "One leaning word, and the realm is swept along.',
    'Master Shen said, "One leaning word, and the realm is swept along.',
  ],
  s0118: [
    '" Is this not the sense of it?',
    '" Is this not the sense of it?',
  ],
  s0119: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0120: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_042_b2.mjs <translation.json>'
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
