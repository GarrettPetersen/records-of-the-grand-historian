#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'His ancestor Ning served Jin as Staff Officer on the Western Campaign Headquarters and Grand Administrator of Yidu.',
    'Ancestor Ning was Jin western-campaign staff officer and Yidu grand administrator.',
  ],
  s0302: [
    'The Xingsi family for generations lived at Gushu.',
    'The Xingsi clan lived at Gushu for generations.',
  ],
  s0303: [
    'At thirteen he traveled to study in the capital; over more than ten years he came to master records broadly and was skilled at literary composition.',
    'At thirteen he studied in the capital; after ten-plus years he mastered records and wrote well.',
  ],
  s0304: [
    'Once walking from Gushu he lodged at an inn; at night someone said to him: "Sir, your learning surpasses the age; at first you will be known to eminent ministers, and in the end favored by an outstanding lord."',
    'Walking from Gushu he lodged at an inn; at night a voice said: "Your learning surpasses the age; first eminent ministers will know you, then an outstanding lord."',
  ],
  s0305: [
    'When the speech ended, he could not tell where the man went.',
    'When it ended he could not tell where the man went.',
  ],
  s0306: [
    'In Qi\'s Longchang era Attendant-in-ordinary Xie Tiao was Grand Administrator of Wuxing and discussed literature and history with Xingsi alone.',
    'In Qi\'s Longchang, Xie Tiao as Wuxing grand administrator discussed only literature and history with Xingsi.',
  ],
  s0307: [
    'When he left his post and returned, he greatly commended and recommended him.',
    'Leaving office he greatly praised and recommended him.',
  ],
  s0308: [
    'The commandery recommended him as Outstanding Talent; he was appointed Assistant Administrator of Guiyang. Grand Administrator Wang Rong had long admired him and treated him with very thick courtesy.',
    'Recommended as Outstanding Talent, he became Guiyang assistant; Grand Administrator Wang Rong long admired him and treated him generously.',
  ],
  s0309: [
    'When Gaozu overthrew the old regime, Xingsi submitted "Ode on Rest and Peace"; its writing was very fine and Gaozu praised it.',
    'When Gaozu took power, Xingsi submitted "Ode on Rest and Peace"—very fine, and Gaozu praised it.',
  ],
  s0310: [
    'He was appointed Gentleman of the Prince of Ancheng\'s state and served straight at the Hualin Office.',
    'He became Prince Ancheng\'s gentleman and served straight at Hualin.',
  ],
  s0311: [
    'That year Henan presented tribute horses; an edict had Xingsi and Attendant-at-Draft Dao Hong and Zhang Shuai compose fu; Gaozu regarded Xingsi\'s as best.',
    'That year Henan sent tribute horses; Gaozu had Xingsi, Dao Hong, and Zhang Shuai compose fu and judged Xingsi best.',
  ],
  s0312: [
    'He was promoted to Cadet-Attendant Emeritus and advanced to serve straight in the Wende and Shouguang offices.',
    'He rose to cadet-attendant emeritus and served straight in Wende and Shouguang.',
  ],
  s0313: [
    'At that time Gaozu made the old residence at Three Bridges into Guangzai Temple and ordered Xingsi and Lu Yan each to compose a temple stele.',
    'Gaozu made the Three Bridges old residence Guangzai Temple and ordered Xingsi and Lu Yan each to write a stele.',
  ],
  s0314: [
    'When both were submitted Gaozu used the one Xingsi composed.',
    'Both were submitted; Gaozu used Xingsi\'s.',
  ],
  s0315: [
    'From then on the Bronze Column Inscription, Barrier Pond Stele, Northern Expedition Proclamation, and verse matching Wang Xizhi\'s Thousand Characters were all entrusted to Xingsi for the text;',
    'Thence the bronze-column inscription, barrier-pond stele, northern expedition proclamation, and verse matching Wang Xizhi\'s Thousand Characters all went to Xingsi;',
  ],
  s0316: [
    'each time he submitted, Gaozu would praise it and add gifts of gold and silk.',
    'each submission won praise and gifts of gold and silk.',
  ],
  s0317: [
    'In the ninth year he was appointed Assistant Administrator of Xin\'an; when his term expired he again became Cadet-Attendant Emeritus and assisted in compiling the National History.',
    'Year nine he became Xin\'an assistant; after his term he again became cadet-attendant emeritus and helped compile national history.',
  ],
  s0318: [
    'In the twelfth year he was promoted to Supervisor of Attendants, composing documents as before.',
    'Year twelve he became supervisor of attendants, writing as before.',
  ],
  s0319: [
    'Xingsi had long suffered wind sores in both hands; that year he also caught plague, his left eye went blind; Gaozu stroked his hand and sighed: "That a man like this should have such an illness!"',
    'Xingsi long had wind sores in both hands; that year plague came and his left eye went blind; Gaozu stroked his hand: "That such a man should have such illness!"',
  ],
  s0320: [
    'By hand he drafted a prescription for treating sores and bestowed it on him.',
    'Gaozu drafted a sore-treatment prescription by hand and gave it him.',
  ],
  s0321: [
    'He was cherished thus.',
    'He was cherished thus.',
  ],
  s0322: [
    'Ren Fang also loved his talent and often said: "Were it not for Zhou Xingsi\'s illness, within ten days he would reach Vice Director of the Secretariat Censorate."',
    'Ren Fang loved his talent and said: "Without Zhou Xingsi\'s illness, within ten days he would reach vice censor-in-chief."',
  ],
  s0323: [
    'In the fourteenth year he was appointed Assistant Administrator of Linchuan.',
    'Year fourteen he became Linchuan assistant.',
  ],
  s0324: [
    'In the seventeenth year he again became Supervisor of Attendants, serving straight in the Western Office.',
    'Year seventeen he again became supervisor of attendants, serving straight in the Western Office.',
  ],
  s0325: [
    'Leader of the Left Guard Zhou She received an edict to annotate the various fu composed by successive emperors as ordered by Gaozu, and memorialized that Xingsi should assist.',
    'Zhou She of the Left Guard received an edict to annotate imperial fu and asked Xingsi to assist.',
  ],
  s0326: [
    'In the second year of Putong he died.',
    'In Putong year two he died.',
  ],
  s0327: [
    'What he compiled—*Imperial Veritable Records*, *Record of Imperial Virtue*, *Daily Records*, *Rites of Office*, and the like—totaled over a hundred juan, and his collected writings ten juan.',
    'He compiled *Imperial Veritable Records*, *Record of Imperial Virtue*, *Daily Records*, *Rites of Office*, and more—over a hundred juan—and ten juan of collected writings.',
  ],
  s0328: [
    'Earlier there were Gao Shuang of Guangling, Jiang Hong of Jiyang, and Yu Qian of Kuaiji, all skilled at literary composition.',
    'Earlier Gao Shuang of Guangling, Jiang Hong of Jiyang, and Yu Qian of Kuaiji all wrote well.',
  ],
  s0329: [
    'Shuang, in Qi\'s Yongming era, presented a poem to Defender-General Wang Jian, was esteemed by Jian; when Jian headed Danyang as Governor he recommended Shuang as commandery Filial and Incorrupt.',
    'Shuang in Yongming presented verse to Wang Jian, won his esteem, and when Jian governed Danyang recommended him as filial and incorrupt.',
  ],
  s0330: [
    'At the beginning of Tianjian he served in succession as Staff Officer on the Central Army under the Prince of Linchuan.',
    'Early Tianjian he served as Prince Linchuan\'s central-army staff officer.',
  ],
  s0331: [
    'He went out as magistrate of Jinling; for an offense he was imprisoned in the foundry, composed "Rhapsody on the Cauldron-Fish" to depict his plight—the writing was very accomplished.',
    'As Jinling magistrate he was imprisoned in the foundry for an offense and wrote "Rhapsody on the Cauldron-Fish" to depict his plight—very accomplished.',
  ],
  s0332: [
    'Later, meeting an amnesty he was released; not long after, he died.',
    'Later an amnesty freed him; soon after he died.',
  ],
  s0333: [
    'Hong was magistrate of Jianyang and was executed for an offense.',
    'Hong was Jianyang magistrate and was executed for an offense.',
  ],
  s0334: [
    'Qian rose to Gentleman of a princely state.',
    'Qian rose to a princely gentleman.',
  ],
  s0335: [
    'All had collected works.',
    'All had literary collections.',
  ],
  s0336: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0337: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_049_b4.mjs <translation.json>'
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

