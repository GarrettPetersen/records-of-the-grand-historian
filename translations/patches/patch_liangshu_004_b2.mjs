#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On dingwei, he set out from the capital; from Shitou to Xinlin, war vessels linked stem to stern.',
    'On dingwei day he marched from the capital; from Shitou to Xinlin, boats stretched bow to stern without a break.',
  ],
  s0102: [
    'In the fourth month, he reached Xiyang.',
    'In the fourth month he reached Xiyang.',
  ],
  s0103: [
    'On yihai, Jing sent out in detachments the rebel generals Song Zixian and Ren Yue to raid Yingzhou.',
    'On yihai day Hou Jing detached the rebel generals Song Zixian and Ren Yue to strike Yingzhou.',
  ],
  s0104: [
    'On bingzi, they seized Inspector Xiao Fangzhu.',
    'On bingzi day they seized inspector Xiao Fangzhu.',
  ],
  s0105: [
    'In the intercalary month, day jiazi, Jing advanced to attack Baling; Wang Senbian, commanding general sent by Prince Yi of Xiangdong, fought repeatedly but could not overcome him.',
    'On jiazi in the intercalary month Hou Jing pressed on Baling; Wang Senbian, the commanding general Prince Yi of Xiangdong had sent, fought again and again but could not win.',
  ],
  s0106: [
    'On guwei, fifth month, Prince Yi of Xiangdong urgently sent Mobile Corps General Hu Sengyou and Xin province Inspector Lu Fahe to relieve Baling; Jing sent Ren Yue to lead troops to resist the relief army.',
    'On guwei in the fifth month Prince Yi of Xiangdong urgently sent mobile corps general Hu Sengyou and Xin province inspector Lu Fahe to relieve Baling; Hou Jing sent Ren Yue with an army to block them.',
  ],
  s0107: [
    'On jiachen, sixth month, Sengyou and others defeated and captured Ren Yue.',
    'On jiachen in the sixth month Sengyou and his forces routed Ren Yue and took him prisoner.',
  ],
  s0108: [
    'On yisi, Jing lifted the siege and fled by night; Wang Senbian directed the massed armies in pursuit of Jing.',
    'On yisi day Hou Jing broke the siege and fled under cover of night; Wang Senbian led the combined armies in pursuit.',
  ],
  s0109: [
    'On gengshen, they attacked Lushan fortress, took it, and captured Wei Minister of Education Zhang Huaren and Formation Companion Men Hongqing.',
    'On gengshen day they stormed Lushan fortress, took it, and captured Wei minister of education Zhang Huaren and formation companion Men Hongqing.',
  ],
  s0110: [
    'On xinyou, they advanced to besiege Yingzhou, took it, and captured the rebel leaders Song Zixian and others.',
    'On xinyou day they pressed the siege of Yingzhou, took the city, and captured the rebel chiefs Song Zixian and others.',
  ],
  s0111: [
    'A former general of the Prince of Poyang, Hou Zhen, raised troops and attacked the false Formation Companion Yu Qing at Yuzhang; Qing was defeated and fled.',
    'Hou Zhen, a former officer of the Prince of Poyang, raised troops and struck the rebel formation companion Yu Qing at Yuzhang; Qing was beaten and fled.',
  ],
  s0112: [
    'In the seventh month of autumn, day dinghai, Hou Jing returned to the capital.',
    'On dinghai day in the seventh month of autumn Hou Jing returned to the capital.',
  ],
  s0113: [
    'On xinchou, Wang Senbian\'s army halted at Pencheng; Fan Xirong, who held Jiangzhou affairs for the rebels, abandoned the city and fled.',
    'On xinchou day Wang Senbian\'s army camped at Pencheng; Fan Xirong, the rebel officer in charge of Jiangzhou, abandoned the city and fled.',
  ],
  s0114: [
    'On bingwu, eighth month, Wang Sengzhen and Zheng Chong of Jinxi raised troops and raided the commandery seat; the false Jinzhou Inspector Xia Hou Weisheng and Formation Companion Ren Yan fled.',
    'On bingwu in the eighth month Wang Sengzhen and Zheng Chong of Jinxi rose and stormed the commandery seat; the rebel Jinzhou inspector Xia Hou Weisheng and formation companion Ren Yan fled.',
  ],
  s0115: [
    'On wuwu, Hou Jing sent Minister of the Guard Peng Jun and Palace Section Commander Wang Senggui to lead troops into the hall, deposed Taizong as Prince of Jin\'an, and confined him in Yongfu Palace.',
    'On wuwu day Hou Jing sent minister of the guard Peng Jun and palace section commander Wang Senggui with troops into the hall, deposed Taizong as Prince of Jin\'an, and imprisoned him in Yongfu Palace.',
  ],
  s0116: [
    'He killed Crown Prince Daqi, Prince of Xunyang Daxin, Prince of Xiyang Dajun, Prince of Wuning Dawei, Prince of Jianping Daqiu, Prince of Yi\'an Daxin, and twenty sons of the Prince of Xunyang.',
    'He killed Crown Prince Daqi, the princes of Xunyang, Xiyang, Wuning, Jianping, and Yi\'an, and twenty sons of the Prince of Xunyang.',
  ],
  s0117: [
    'Forging an edict in Taizong\'s name, he abdicated to the Successor Prince of Yuzhang, Dong; a general amnesty was proclaimed and the reign title changed.',
    'He forged an abdication edict in Taizong\'s name to the successor prince of Yuzhang, Dong, proclaimed a general amnesty, and changed the reign title.',
  ],
  s0118: [
    'Envoys were sent to kill Prince of Nanhai Dailin at Wu commandery, Prince of Nanjun Dalian at Gudu, Prince of Anlu Dachun at Kuaiji, and Prince of Xinxing Dazhuang at Jingkou.',
    'Envoys were sent to kill Prince Dailin of Nanhai at Wu, Prince Dalian of Nanjun at Gudu, Prince Dachun of Anlu at Kuaiji, and Prince Dazhuang of Xinxing at Jingkou.',
  ],
  s0119: [
    'In the tenth month of winter, day renyin, the Emperor said to Attendant Yin Buhai: "Last night I dreamed I swallowed earth—try to interpret it for me.',
    'On renyin in the tenth month of winter the emperor said to attendant Yin Buhai, "Last night I dreamed I swallowed earth—please interpret it for me.',
  ],
  s0120: [
    '" Buhai said: "In old times Chong\'er was given a clod of earth and at last returned to the state of Jin.',
    '" Buhai said, "Long ago Chong\'er was given a clod of earth and at last returned to Jin.',
  ],
  s0121: [
    'What Your Majesty dreamed accords with that, does it not?"',
    'Surely Your Majesty\'s dream matches that sign?"',
  ],
  s0122: [
    'When Wang Wei and the others came forward with a toast to the Emperor, they said: "The Chancellor, seeing Your Majesty\'s long grief and distress, has sent us to offer longevity wine."',
    'Then Wang Wei and the others came forward with a toast and said, "The chancellor, seeing Your Majesty\'s long grief, has sent us to offer longevity wine."',
  ],
  s0123: [
    'The Emperor smiled and said: "Longevity wine—must it not be drunk to the end?"',
    'The emperor smiled and said, "Longevity wine—must it not be drunk to the dregs?"',
  ],
  s0124: [
    'Thereupon they all bestowed wine and food, a curved-neck pipa, and drank with the Emperor.',
    'They then gave wine and food, a curved-neck pipa, and drank with him.',
  ],
  s0125: [
    'Knowing he could not escape, the Emperor drank his fill and said: "I never thought pleasure could reach this point!"',
    'Knowing he could not escape, the emperor drank his fill and said, "I never thought merriment could come to this!"',
  ],
  s0126: [
    'When he was drunk and asleep, Wang Wei and Peng Jun brought in a bag of earth; Wang Xiuzuan sat upon it—and thereupon Taizong died in Yongfu Palace, aged forty-nine.',
    'When he was drunk and asleep, Wang Wei and Peng Jun brought in a bag of earth; Wang Xiuzuan sat on it—and Taizong died in Yongfu Palace at the age of forty-nine.',
  ],
  s0127: [
    'The rebels gave the posthumous title Bright Emperor and the temple name Gaozong.',
    'The rebels gave him the posthumous title Bright Emperor and the temple name Gaozong.',
  ],
  s0128: [
    'The next year, third month, day jichou, Wang Senbian led the former hundred officials in escorting the coffin up the audience hall; Shizu posthumously honored him as Emperor Jianwen, with temple name Taizong.',
    'The next year, on jichou in the third month, Wang Senbian led the former hundred officials to raise the coffin to the audience hall; Shizu posthumously honored him as Emperor Jianwen with temple name Taizong.',
  ],
  s0129: [
    'Fourth month, day yichou, he was buried at Zhuang Mausoleum.',
    'On yichou in the fourth month he was buried at Zhuang Mausoleum.',
  ],
  s0130: [
    'At first, when Taizong was imprisoned, he wrote a self-account on the wall, saying: "I, Xiao Shizuan of Lanling, upright man of Liang, in conduct from first to last one—though wind and rain darken the sky, the cock crows without cease.',
    'At first, when Taizong was held captive, he wrote on the wall: "I, Xiao Shizuan of Lanling, upright man of Liang, one in conduct from start to finish—though wind and rain darken the sky, the cock crows without cease.',
  ],
  s0131: [
    'I would not deceive a dark room—how much less the three luminaries; to reach this number is fate—what can be done!"',
    'I would not deceive a dark room—how much less the sun, moon, and stars; to come to this count is fate—what can be done!"',
  ],
  s0132: [
    'He also composed two Linked Pearls pieces, the text deeply mournful.',
    'He also wrote two "Linked Pearls" pieces, their tone deeply mournful.',
  ],
  s0133: [
    'Taizong from youth was keen and perceptive, his understanding surpassing others; at six he could compose texts, and Gaozu marveled at his early maturity but did not believe it.',
    'Taizong from childhood was quick and perceptive, his insight beyond others; at six he could write, and Gaozu marveled at his early gift but did not believe it.',
  ],
  s0134: [
    'He was then tested before the imperial presence, and his literary color was very fine.',
    'He was tested before the throne, and his literary grace was superb.',
  ],
  s0135: [
    'Gaozu sighed and said: "This boy is our family\'s Dong\'e."',
    'Gaozu sighed and said, "This boy is our family\'s Dong\'e."',
  ],
  s0136: [
    'When he grew up, his bearing was broad and magnanimous; he was never seen angry or pleased.',
    'When he grew up, his bearing was broad and calm; anger and delight never showed on his face.',
  ],
  s0137: [
    'Square of cheek and full below, his beard and temples like a painting; when he glanced sidelong his gaze lit upon men.',
    'Square of cheek and full below, beard and temples like painted lines; a sidelong glance lit upon men like fire.',
  ],
  s0138: [
    'In reading he took in ten lines at once.',
    'In reading he took in ten lines at a glance.',
  ],
  s0139: [
    'Of the nine schools and the hundred clans, what passed his eye he always remembered;',
    'Of the nine schools and hundred thinkers, whatever passed his eye he remembered;',
  ],
  s0140: [
    'in essays, rhapsodies, and verse he took up the brush and finished at once.',
    'in essays, rhapsodies, and verse he took up the brush and finished on the spot.',
  ],
  s0141: [
    'Broadly versed in Confucian books, skilled in discoursing on Dark Learning.',
    'He mastered Confucian classics and was skilled in Neo-Daoist discourse.',
  ],
  s0142: [
    'From age eleven he could personally attend to the multitude of affairs; repeatedly tested in frontier administration, wherever he went he won praise.',
    'From age eleven he could handle routine affairs himself; repeatedly tried in frontier posts, wherever he went he won praise.',
  ],
  s0143: [
    'In mourning for Noble Consort Mu, his grief wasted him to bone; day and night his weeping never ceased, and the mat he sat on was soaked through and rotted.',
    'Mourning Noble Consort Mu, grief wasted him to bone; day and night he wept without pause, and the mat he sat on rotted from wetting.',
  ],
  s0144: [
    'At Xiangyang he memorialized for a northern campaign; he sent Chief Clerk Liu Jin, Marshal Dong Dangmen, Martial Valor General Du Huaibao, Far-Shaking General Cao Yizong, and others with the massed armies on expedition, conquering Nanyang, Xinye, and other commanderies; Wei\'s South Jingzhou Inspector Li Zhi, holding Anchang fortress, surrendered, and territory was extended more than a thousand li.',
    'At Xiangyang he memorialized for a northern campaign and sent chief clerk Liu Jin, marshal Dong Dangmen, martial valor general Du Huaibao, far-shaking general Cao Yizong, and others with the armies; they took Nanyang, Xinye, and other commanderies, Wei\'s south Jingzhou inspector Li Zhi surrendered Anchang fortress, and territory expanded more than a thousand li.',
  ],
  s0145: [
    'When he held the regency he was broadly indulgent in many matters, yet in documents and ledgers not the finest thread could be deceived.',
    'As regent he was broadly lenient in many matters, yet in documents and ledgers not the finest thread could be falsified.',
  ],
  s0146: [
    'He drew in men of letters and rewarded them without weariness, constantly discussing texts and following with compositions.',
    'He welcomed literary men and rewarded them tirelessly, constantly discussing texts and then writing himself.',
  ],
  s0147: [
    'When Gaozu composed Expositions on the Five Classics, Taizong once presented them at the Dark Garden; listeners filled court and countryside.',
    'When Gaozu composed his Expositions on the Five Classics, Taizong once lectured on them at the Dark Garden; listeners filled court and countryside.',
  ],
  s0148: [
    'He loved composing poetry by nature; in his preface he wrote: "At seven I had a poetry mania, and in growing up I never tired of it."',
    'He loved poetry by nature; in his preface he wrote, "At seven I had a poetry mania, and as I grew I never tired of it."',
  ],
  s0149: [
    'Yet he was faulted for frivolous ornament, and his age styled this the "Palace Style."',
    'Yet he was faulted for frivolous ornament, and his age called it the "Palace Style."',
  ],
  s0150: [
    'His works included Biography of the Heir Apparent Zhaoming in five scrolls, Biographies of the Princes in thirty scrolls, Great Meaning of the Rites in twenty scrolls, Meaning of the Laozi in twenty scrolls, Meaning of the Zhuangzi in twenty scrolls, Recorded Meaning of Eternal Spring in one hundred scrolls, and Treasured Laws Linked Pearls in three hundred scrolls—all circulated in his time.',
    'His works included Biography of the Heir Apparent Zhaoming in five scrolls, Biographies of the Princes in thirty scrolls, Great Meaning of the Rites in twenty scrolls, Meaning of the Laozi in twenty scrolls, Meaning of the Zhuangzi in twenty scrolls, Recorded Meaning of Eternal Spring in one hundred scrolls, and Treasured Laws Linked Pearls in three hundred scrolls—all circulated in his day.',
  ],
  s0151: [
    'The historian writes: In youth Taizong was clever and perceptive, his fair renown marked from of old, his heavenly talent unrestrained, foremost in past and present.',
    'The historian writes: In youth Taizong was clever and perceptive, his fair renown marked from of old, his heavenly talent unrestrained, foremost in past and present.',
  ],
  s0152: [
    'In literature he was at times burdened by frivolous ornament—what gentlemen do not take up.',
    'In literature he was at times burdened by frivolous ornament—what gentlemen do not take up.',
  ],
  s0153: [
    'When he cultivated virtue in the Eastern Palace, his fame reached barbarians and Chinese alike; when he succeeded to the throne, he truly had a ruler\'s excellence.',
    'When he cultivated virtue in the Eastern Palace, his fame reached barbarians and Chinese alike; when he succeeded to the throne, he truly had a ruler\'s excellence.',
  ],
  s0154: [
    'Just as he was to match Wen and Jing, fate struck the hexagrams Tun and Bo; constrained by the rebel minister, he could not unfold what he held within, and at last suffered the cruelty of Huai and Min—alas!',
    'Just as he was to match Wen and Jing, fate struck the hexagrams Tun and Bo; constrained by the rebel minister, he could not unfold what he held within, and at last suffered the cruelty of Huai and Min—alas!',
  ],
  s0155: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0156: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_004_b2.mjs <translation.json>'
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
