#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Jing, weary, napped by day; Yun spoke to the sea pilot: “Where is there any Mengshan in these waters!',
    'Jing fell asleep at midday; Yun told the pilot, “There is no Mengshan here—',
  ],
  s0202: [
    'You need only obey my orders.',
    'do as I say.”',
  ],
  s0203: [
    '” They then headed straight for Jingkou.',
    'They bore straight for Jingkou.',
  ],
  s0204: [
    'At Hudou Isle, Jing woke, greatly alarmed, and asked people on the shore, who said, “Guo Yuanjian is still at Guangling”; Jing rejoiced and meant to join him.',
    'At Hudou Isle Jing woke in panic and hailed the bank: Guo Yuanjian still held Guangling—Jing was overjoyed and meant to go to him.',
  ],
  s0205: [
    'Yun drew his sword and shouted at the sea pilot to steer for Jingkou.',
    'Yun bared his blade and drove the pilot toward Jingkou.',
  ],
  s0206: [
    'Jing tried to slip overboard; Yun struck with his blade. Jing ran into the hold and gouged the hull with a small knife; Yun thrust in with a spear and killed him.',
    'Jing tried to swim clear; Yun hacked at him. Jing fled into the cabin and picked at the planking with a knife—Yun ran him through with a spear.',
  ],
  s0207: [
    'Emperor Yuan made Yun Bearer of the Staff, Regular Attendant-in-Ordinary, Area Commander of all military affairs for Qing and Ji provinces, General of Bright Awe, and Inspector of Qingzhou; enfeoffed him Duke of the State of Changguo with a fief of two thousand households; granted five million cash, five thousand piculs of grain, and a thousand bolts each of cloth and silk; and he also held the post of Grand Administrator of Dongyang.',
    'Emperor Yuan gave Yun staff authority, Regular Attendant, Qing-Ji area command, General of Bright Awe, and Qingzhou inspector; made him Duke of Changguo, two thousand households; five million cash, five thousand piculs of grain, a thousand bolts each of cloth and silk; and Grand Administrator of Dongyang besides.',
  ],
  s0208: [
    'On the campaign against Lu Na he was given the additional title of Regular Attendant-in-Ordinary.',
    'Campaigning against Lu Na won him Regular Attendant as well.',
  ],
  s0209: [
    'When the mid-Yangzi gorges were pacified he was appointed Inspector of Western Jinzhou.',
    'The gorges pacified, he became Western Jinzhou inspector.',
  ],
  s0210: [
    'After defeating Guo Yuanjian at Dong Pass he was promoted to Full Staff Bearer, General of Trustworthy Valor, and Eastern Jinzhou Inspector.',
    'He broke Guo Yuanjian at Dong Pass and rose to full staff bearer, General of Trustworthy Valor, and Eastern Jinzhou inspector.',
  ],
  s0211: [
    'In the third year of Chengsheng, Western Wei besieged Jiangling; Yun could not reach them in time and followed Wang Sengyin on the campaign against Xiao Bo in Lingnan.',
    'Chengsheng year 3: Western Wei besieged Jiangling—Yun arrived too late and marched with Wang Senbian against Xiao Bo in the south.',
  ],
  s0212: [
    'Hearing that Grand Marshal Senbian had been defeated, he turned back; Hou Tian broke him, and he was killed at Yuzhang, aged twenty-eight.',
    'Word came that Grand Marshal Senbian had fallen; he turned back, Hou Tian routed him, and he was killed at Yuzhang at twenty-eight.',
  ],
  s0213: [
    'Yang Yaren, styled Xiaomu, was a man of Juping in Taishan commandery.',
    'Yang Yaren, styled Xiaomu, came from Juping in Taishan.',
  ],
  s0214: [
    'In youth he was fierce and daring, with courage and strength; he served the commandery as chief clerk.',
    'Young he was bold and strong and served the commandery as recorder.',
  ],
  s0215: [
    'In the Putong era he led his brothers back from Wei to the homeland and was enfeoffed Marquis of Guangjin county.',
    'In Putong he brought his brothers south from Wei and was made Marquis of Guangjin.',
  ],
  s0216: [
    'In campaigns between Qing and Qi he accumulated merit and was gradually promoted to Extraordinary Attendant-in-Ordinary and Grand Administrator of Liyang.',
    'Fighting in Qing and Qi he won honors, rising to Extraordinary Attendant and Liyang grand administrator.',
  ],
  s0217: [
    'In the fourth year of Zhongdatong he was made Bearer of the Staff, Area Commander of all military affairs for Qiao province, General of Trustworthy Awe, and Inspector of Qiaozhou.',
    'Zhongdatong year 4 made him staff bearer, Qiao area commander, General of Trustworthy Awe, and Qiaozhou inspector.',
  ],
  s0218: [
    'In the seventh year of Datong he was appointed Left Commandant of the Heir Apparent’s Guard, then went out as Bearer of the Staff, Area Commander of all military affairs for the Southern and Northern Si, Yu, and Chu provinces, General of Light Chariots, and Inspector of Northern Sizhou.',
    'Datong year 7 brought Left Commandant of the Heir Apparent’s Guard, then staff bearer over southern and northern Si, Yu, and Chu, General of Light Chariots, and Northern Sizhou inspector.',
  ],
  s0219: [
    'When Hou Jing surrendered, an edict ordered Yaren to supervise Huan Hezhi, Inspector of Shizhou, Zhan Haizhen, Inspector of Renzhou, and others with thirty thousand elite troops to hurry to Xuanchi to link with Jing; he also served as Area Commander of all military affairs for the seven provinces of Yu, Si, Huai, Ji, Yin, Ying, and Western Yu, and as Inspector of Si and Yu provinces, stationed at Xuanchi.',
    'When Hou Jing submitted, Yaren was told to lead Huan Hezhi of Shizhou, Zhan Haizhen of Renzhou, and thirty thousand picked men to Xuanchi to meet Jing—and to command seven provinces from Yu to Western Yu as Si-Yu inspector, based at Xuanchi.',
  ],
  s0220: [
    'Jing was defeated at Woyang and Wei forces pressed closer; fearing his supply line would fail, Yaren returned to Northern Si and submitted a memorial apologizing.',
    'Jing lost at Woyang and Wei closed in; Yaren, afraid grain would not follow, pulled back to Northern Si and apologized by memorial.',
  ],
  s0221: [
    'The High Ancestor was furious and rebuked him; Yaren in fear halted his army on the Huai.',
    'The High Ancestor raged and blamed him; Yaren, afraid, camped again on the Huai.',
  ],
  s0222: [
    'When Hou Jing rebelled, Yaren led his troops to the capital in relief.',
    'When Jing turned rebel, Yaren marched his command to the rescue.',
  ],
  s0223: [
    'In the second year of Taqing, after Jing broke the alliance, Yaren joined Zhao Bochao and Prince Huili of Nankang to attack the rebels at the Eastern Directorate compound but was in turn defeated by the rebels.',
    'Taqing year 2: Jing broke faith; Yaren, Zhao Bochao, and Prince Huili of Nankang struck the rebels at the Eastern Directorate and were beaten in turn.',
  ],
  s0224: [
    'When the capital fortress fell, Yaren went to see Jing and was detained by him, appointed Minister of the Five Weapons.',
    'The inner city fell; Yaren presented himself to Jing, who held him and named him Minister of the Five Weapons.',
  ],
  s0225: [
    'Yaren often thought of striking back and told those close to him: “I am but common clay, yet the court favored me, and I have utterly failed to repay that deep grace.',
    'Yaren brooded on a reckoning and told his intimates, “I am nobody, yet the throne raised me—and I have never repaid that debt.',
  ],
  s0226: [
    'The altars tottered and I could not die—I clung to life and escaped, until today.',
    'The realm crumbled and I would not die; I stole life and slipped away, and so it has gone.',
  ],
  s0227: [
    'To end this way leaves every grievance unspent.”',
    'If I end like this, no wrath will be left in me.”',
  ],
  s0228: [
    '” and he wept; those who saw it were grieved.',
    'He wept as he spoke; all who heard were stricken.',
  ],
  s0229: [
    'In the third year he fled west to Jiangxi; several hundred of his old followers welcomed him; he was bound for Jiangling but at Dongguan was murdered by the sons of the former Inspector of Northern Xuzhou, Xun Bodao.',
    'Year 3 he fled into Jiangxi; a few hundred veterans met him bound for Jiangling—but at Dongguan the sons of ex–Northern Xuzhou inspector Xun Bodao killed him.',
  ],
  s0230: [
    'The historian writes: The High Ancestor received the mandate in revolution and shone with the fortune of the age; where his power and virtue reached, none failed to come in heart—and they died for the state one after another.',
    'The historian writes: The High Ancestor took the throne and lit the age with fortune; his power drew every heart, and men threw themselves into death for the realm in endless succession.',
  ],
  s0231: [
    'Yuan Faseng and men like him who entered the realm were all showered with grace, given weighty posts and lofty rank, bell and tripod at table—splendid indeed.',
    'Yuan Faseng and his kind who came south were heaped with favor—heavy office, high rank, bells and tripods at feast: glorious.',
  ],
  s0232: [
    'Yet Yang Kan and Yaren met the calamity of Taqing and both poured out loyalty for the state.',
    'Yet Kan and Yaren met the Taqing disaster and gave the state their utmost loyalty.',
  ],
  s0233: [
    'Kan unbent in peril; Yaren kept faith and gave his life—they may be said to match pine and bamboo in will, iron and stone in heart; of the martyrs of old, is this not meant?',
    'Kan never bent under danger; Yaren kept faith and died—wills like pine and bamboo, hearts like iron and stone: the martyrs of old, was it not for such as these?',
  ],
  s0234: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0235: [
    'The full text has been collated against the Zhonghua Shuju edition of 《Book of Liang》, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of 《Book of Liang》, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_039_b3.mjs <translation.json>'
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
