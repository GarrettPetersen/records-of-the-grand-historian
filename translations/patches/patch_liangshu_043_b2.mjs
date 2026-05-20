#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He went out as interior minister of Yongyang, returned and was made staff major to the Prince of Xuancheng of the Central Army and regular palace attendant.',
    'He went out as interior minister of Yongyang, returned as staff major to the Prince of Xuancheng of the Central Army and regular palace attendant.',
  ],
  s0102: [
    'Again he went out as chief clerk to the Prince of Xiangdong of the Pacifying South Army and magistrate of Xunyang.',
    'Again he went out as chief clerk to the Prince of Xiangdong of the Pacifying South Army and magistrate of Xunyang.',
  ],
  s0103: [
    'In the first year of Zhongdatong he was summoned as minister of the palace treasury, soon promoted to magistrate of Wuxing.',
    'In the first year of Zhongdatong he was summoned as minister of the palace treasury, soon promoted to magistrate of Wuxing.',
  ],
  s0104: [
    'In the second year of Supreme Purity Hou Jing besieged the capital; Sheng sent his younger brother Yi to lead several thousand commandery troops to the rescue.',
    'In the second year of Supreme Purity Hou Jing besieged the capital; Sheng sent his younger brother Yi to lead several thousand commandery troops to the rescue.',
  ],
  s0105: [
    'In the third year the palace city fell; censor-in-chief Shen Jun fled east in hardship.',
    'In the third year the palace city fell; censor-in-chief Shen Jun fled east in hardship.',
  ],
  s0106: [
    'Sheng went to see him and said: "The traitor minister towers over us; the altars are in peril and shame—this is the season for ministers to devote their lives.',
    'Sheng went to see him and said, "The traitor towers over us; the altars are in peril—this is the season for ministers to devote their lives.',
  ],
  s0107: [
    'Now I wish to gather troops and hold your noble district.',
    'Now I wish to gather troops and hold your noble district.',
  ],
  s0108: [
    'If Heaven\'s way is without spirit and loyal resolve cannot unfold, even if death follows, truly I have no regret.',
    'If Heaven is without spirit and loyal resolve cannot unfold, even if death follows, I have no regret.',
  ],
  s0109: [
    '" Jun said: "Though my commandery is small, who relying on righteousness to resist the villain dares not follow!',
    '" Jun said, "Though my commandery is small, who relying on righteousness to resist the villain dares not follow!',
  ],
  s0110: [
    '" He firmly urged Sheng to raise righteousness.',
    '" He firmly urged Sheng to raise righteousness.',
  ],
  s0111: [
    'Thereupon he gathered soldiers and repaired walls and ramparts.',
    'Thereupon he gathered soldiers and repaired walls and ramparts.',
  ],
  s0112: [
    'At the time the Prince of Shaoling had fled east to Qiantang; hearing of it he sent a commission appointing Sheng General Who Pacifies the East with rank equal to two thousand shi.',
    'The Prince of Shaoling had fled east to Qiantang; hearing of it he sent a commission appointing Sheng General Who Pacifies the East with rank equal to two thousand shi.',
  ],
  s0113: [
    'Sheng said: "The court is in peril and the Son of Heaven suffers dust—what heart today for receiving glory and title.',
    'Sheng said, "The court is in peril and the Son of Heaven suffers dust—what heart today for glory and title.',
  ],
  s0114: [
    '" He kept the commission only.',
    '" He kept the commission only.',
  ],
  s0115: [
    'The bandit\'s field headquarters Liu Shenmao took Yixing and sent a messenger persuading Sheng: "If you surrender early, you will be returned the commandery to govern and further receive enfeoffment and reward.',
    'The bandit field headquarters Liu Shenmao took Yixing and sent a messenger persuading Sheng, "If you surrender early, you will be returned the commandery to govern and receive enfeoffment and reward.',
  ],
  s0116: [
    '" Sheng ordered the messenger beheaded and sent the commander Wang Xiong and others with troops to meet the attack at Lüdu, defeated Shenmao, and Shenmao retreated.',
    '" Sheng ordered the messenger beheaded and sent commander Wang Xiong and others to meet the attack at Lüdu, defeated Shenmao, and Shenmao retreated.',
  ],
  s0117: [
    'Hou Jing heard Shenmao was defeated and sent his central army Hou Zijian with twenty thousand crack troops to help Shenmao attack Sheng.',
    'Hou Jing heard Shenmao was defeated and sent his central army Hou Zijian with twenty thousand crack troops to help Shenmao attack Sheng.',
  ],
  s0118: [
    'Sheng sent the commander Fan Zhilang west of the commandery to meet battle, was defeated by Shenmao, and withdrew.',
    'Sheng sent commander Fan Zhilang west of the commandery to meet battle, was defeated by Shenmao, and withdrew.',
  ],
  s0119: [
    'The bandit cavalry pressed the victory and burned the palisade; troops within the palisade all collapsed.',
    'The bandit cavalry pressed the victory and burned the palisade; troops within the palisade all collapsed.',
  ],
  s0120: [
    'Sheng then put off military dress and sat in the audience hall; the bandit held blades to him and he was never bent.',
    'Sheng put off military dress and sat in the audience hall; the bandit held blades to him and he was never bent.',
  ],
  s0121: [
    'They seized Sheng and sent him to Jing; Jing executed him in the market, and sons and younger brothers who suffered with him numbered more than ten—he was sixty-two.',
    'They seized Sheng and sent him to Jing; Jing executed him in the market, and sons and brothers who suffered with him numbered more than ten—he was sixty-two.',
  ],
  s0122: [
    'When the bandit was pacified the Shizu Emperor posthumously made him palace attendant, central army commander, and Grand Master with the Golden Seal and Purple Ribbon with the same rites as the Three Excellencies.',
    'When the bandit was pacified Emperor Shizu posthumously made him palace attendant, central army commander, and Grand Master with the Golden Seal and Purple Ribbon with the rites of the Three Excellencies.',
  ],
  s0123: [
    'His posthumous title was Loyal and Upright.',
    'His posthumous title was Loyal and Upright.',
  ],
  s0124: [
    'Shen Jun, courtesy name Shuyuan, was a native of Wukang in Wuxing.',
    'Shen Jun, styled Shuyuan, came from Wukang in Wuxing.',
  ],
  s0125: [
    'His grandfather Xian had been regular palace attendant under Qi; the Qi history has his biography.',
    'His grandfather Xian had been regular palace attendant under Qi; the Qi history has his biography.',
  ],
  s0126: [
    'Jun from youth was broadly learned and gifted in affairs; he held the magistracies of Shanyin, Wu, and Jiankang in succession, all with a name for ability.',
    'Jun from youth was broadly learned and gifted; he held Shanyin, Wu, and Jiankang in succession, all with a name for ability.',
  ],
  s0127: [
    'He entered court as gentleman of the Secretariat and left assistant.',
    'He entered court as Secretariat gentleman and left assistant.',
  ],
  s0128: [
    'When Hou Jing pressed the capital he was promoted to censor-in-chief.',
    'When Hou Jing pressed the capital he was promoted to censor-in-chief.',
  ],
  s0129: [
    'At that time outside aid all arrived; Hou Jing memorialized asking for peace and an edict granted it.',
    'Outside aid all arrived; Hou Jing memorialized asking for peace and an edict granted it.',
  ],
  s0130: [
    'After the oath Jing knew plague raged within the city and again harbored treacherous design, hesitating and not leaving.',
    'After the oath Jing knew plague raged within the city and again harbored treacherous design, hesitating and not leaving.',
  ],
  s0131: [
    'After several days the crown prince ordered Jun to Jing\'s quarters; Jing said: "It has already turned hot—not the season for marching again.',
    'After several days the crown prince ordered Jun to Jing\'s quarters; Jing said, "It has already turned hot—not the season for marching again.',
  ],
  s0132: [
    'A host of a hundred thousand—how could they go? I wish again to render service to the court; you may report this for me.',
    'A host of a hundred thousand—how could they go? I wish again to serve the court; you may report this for me.',
  ],
  s0133: [
    '" Jun said: "General, this talk of yours aims at getting the city.',
    '" Jun said, "General, this talk aims at getting the city.',
  ],
  s0134: [
    'Within the city troops and grain still last a hundred days.',
    'Within the city troops and grain still last a hundred days.',
  ],
  s0135: [
    'General, your stores within are exhausted and the state\'s rescue armies gather without—a host of a hundred thousand, on what will they rely?',
    'General, your stores within are exhausted and rescue armies gather without—a host of a hundred thousand, on what will they rely?',
  ],
  s0136: [
    'Yet you set forth this talk—do you mean to coerce the court?',
    'Yet you set forth this talk—do you mean to coerce the court?',
  ],
  s0137: [
    '" Jing laid a blade across his knee and glared with true eyes and shouted at him.',
    '" Jing laid a blade across his knee and glared and shouted at him.',
  ],
  s0138: [
    'Jun in stern color rebuked Jing: "Your Grace is plainly a minister who raised troops against the palace; the sage ruler extended grace and pardoned past faults, and you have already sworn alliance—oath blood not yet dry, yet there is treachery.',
    'Jun in stern color rebuked Jing, "Your Grace is plainly a minister who raised troops against the palace; the sage ruler pardoned past faults and you have sworn alliance—oath blood not yet dry, yet there is treachery.',
  ],
  s0139: [
    'Shen Jun is sixty years old and moreover the Son of Heaven\'s envoy—life and death have their allotment; how would I fear a traitor\'s blade!',
    'Shen Jun is sixty and the Son of Heaven\'s envoy—life and death have their allotment; how would I fear a traitor\'s blade!',
  ],
  s0140: [
    '" Without a glance he went out.',
    '" Without a glance he went out.',
  ],
  s0141: [
    'Jing said: "This is a true upright censor."',
    'Jing said, "This is a true upright censor."',
  ],
  s0142: [
    'Yet he secretly harbored resentment.',
    'Yet he secretly harbored resentment.',
  ],
  s0143: [
    'When Zhang Sheng was defeated he asked for Jun to kill him.',
    'When Zhang Sheng was defeated he asked for Jun to kill him.',
  ],
  s0144: [
    'Liu Jingli was grandson of Grand Master with the Golden Seal and Purple Ribbon with the same rites as the Three Excellencies Qingyuan.',
    'Liu Jingli was grandson of Grand Master Qingyuan with the rites of the Three Excellencies.',
  ],
  s0145: [
    'His father Jin was tutor to the crown prince.',
    'His father Jin was tutor to the crown prince.',
  ],
  s0146: [
    'Jingli and his elder brother Zhongli were both famed from youth for fierce courage.',
    'Jingli and his elder brother Zhongli were both famed from youth for fierce courage.',
  ],
  s0147: [
    'He began office as gentleman of the Palace Library and was gradually promoted to magistrate of Fufeng.',
    'He began as gentleman of the Palace Library and rose to magistrate of Fufeng.',
  ],
  s0148: [
    'When Hou Jing crossed the river Jingli led three thousand horse and foot to the rescue.',
    'When Hou Jing crossed the river Jingli led three thousand horse and foot to the rescue.',
  ],
  s0149: [
    'Reaching the capital he held Qingxi Ford and fought Jing repeatedly, always first to scale and break the line, winning great renown for martial awe.',
    'Reaching the capital he held Qingxi Ford and fought Jing repeatedly, always first to scale and break the line, winning great renown.',
  ],
  s0150: [
    'When the terrace city fell Jingli and Zhongli both appeared before Jing; Jing sent Zhongli to command the upriver region and kept Jingli as hostage, making him General Who Guards the Army.',
    'When the terrace city fell Jingli and Zhongli both appeared before Jing; Jing sent Zhongli upriver and kept Jingli as hostage, making him General Who Guards the Army.',
  ],
  s0151: [
    'Jing saw Zhongli off at Rear Ford; Jingli secretly said to Zhongli: "Jing comes to this meeting today—Jingli will embrace him; brother, draw your sword and you can cut him down; Jingli dies without regret.',
    'Jing saw Zhongli off at Rear Ford; Jingli secretly said to Zhongli, "Jing comes to this meeting—Jingli will embrace him; brother, draw your sword and you can cut him down; Jingli dies without regret.',
  ],
  s0152: [
    '" Zhongli admired his words and agreed.',
    '" Zhongli admired his words and agreed.',
  ],
  s0153: [
    'When cups had gone round several times Jingli signaled Zhongli; Zhongli saw the guards strict and dared not move—the plan in the end did not succeed.',
    'When cups had gone round several times Jingli signaled Zhongli; Zhongli saw the guards strict and dared not move—the plan did not succeed.',
  ],
  s0154: [
    'When Jing campaigned against Jinxing Jingli with the Prince of Nankang Huili plotted to seize his city; the day fixed they were about to rise when the Marquis of Jian\'an Xiao Ben learned and reported it, and he was killed.',
    'When Jing campaigned against Jinxing Jingli with the Prince of Nankang Huili plotted to seize his city; the day fixed they were about to rise when the Marquis of Jian\'an Xiao Ben reported it, and he was killed.',
  ],
  s0155: [
    'The historian says: When righteousness outweighs life, former canons leave instruction—this is what the sages prized.',
    'The historian writes: When righteousness outweighs life, former canons leave instruction—this is what the sages prized.',
  ],
  s0156: [
    'Thus Mencius said life is what I desire and righteousness is also what I desire; the two cannot be grasped together—I would rather relinquish life and take righteousness.',
    'Thus Mencius said life is what I desire and righteousness is also what I desire; the two cannot be grasped together—I would rather relinquish life and take righteousness.',
  ],
  s0157: [
    'As for men such as Zhang Sheng and the two or three like him, who gave their bodies and died for integrity, going to death like returning home—their heroic wind and firm spirit cover past and present; the gentleman knows the Liang had loyal ministers.',
    'Men such as Zhang Sheng and the two or three like him gave their bodies and died for integrity, going to death like returning home—their heroic wind and firm spirit cover past and present; the gentleman knows the Liang had loyal ministers.',
  ],
  s0158: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0159: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_043_b2.mjs <translation.json>'
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
