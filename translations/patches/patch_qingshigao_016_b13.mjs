#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'On day gengshen, the Emperor went on tour to Mulan.',
    'On gengshen day, the Emperor toured Mulan.',
  ],
  s1202: [
    'On day renwu, the Yongding River breached; Wu Jin and Nayanbao were ordered to survey and build dikes.',
    'On renwu day, the Yongding broke; Wu Jin and Nayanbao were sent to survey and repair.',
  ],
  s1203: [
    'Eighth month, day xinmao: the Yellow River overflowed on the north bank at Lanyang in Henan.',
    'In the eighth month, on xinmao day, the river flooded Lanyang\'s north bank in Henan.',
  ],
  s1204: [
    'Grand Secretary on leave, Duke Weiqin Lebao, died and was posthumously enfeoffed as a first-class marquis.',
    'Lebao, grand secretary on leave and Duke Weiqin, died and was made a first-class marquis posthumously.',
  ],
  s1205: [
    'Ninth month, day renxu: the Emperor returned to the capital.',
    'In the ninth month, on renxu day, the Emperor returned to Beijing.',
  ],
  s1206: [
    'On day guiyou, Songyun was removed as an imperial presence minister and made Mukden general.',
    'On guiyou day, Songyun left the inner ministry and became Mukden general.',
  ],
  s1207: [
    'Winter, tenth month, day yiwei: on the Longevity Festival the Emperor received congratulations in the Hall of Supreme Harmony.',
    'In the tenth winter month, on yiwei day, the Emperor received birthday felicitations at Taihe Hall.',
  ],
  s1208: [
    'Vice Minister Zhou Xiying, for impeaching Hunan migrant-guest arson and killing while also sending a private letter, was dismissed from office and his son, a provincial graduate, was likewise expelled.',
    'Zhou Xiying was dismissed and his graduate son disqualified for mixing a private letter into a Hunan migrant-violence impeachment.',
  ],
  s1209: [
    'Eleventh month, day yisi: Mingliang was promoted to third-class marquis.',
    'In the eleventh month, on yisi day, Mingliang was raised to third-class marquis.',
  ],
  s1210: [
    'Twelfth month, day gengzi: Wu Bangqing was demoted for memorializing that the Hunan migrant-guest arson-and-killing case was untrue.',
    'On gengzi day, Wu Bangqing was demoted for a false report on the Hunan migrant arson case.',
  ],
  s1211: [
    'On day bingwu, Dong Jiaozeng memorialized asking that foreign ships be allowed to sell tea; an edict sharply rebuked him.',
    'On bingwu day, Dong Jiaozeng\'s plea to let foreign ships sell tea was sharply rejected.',
  ],
  s1212: [
    'On day bingchen, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On bingchen day, the temple seasonal rites were performed.',
  ],
  s1213: [
    'That year, disaster land tax and banner rent were remitted by varying amounts for thirty-nine prefectures, counties, and garrisons in Zhili, Zhejiang, Hunan, and other provinces.',
    'That year, thirty-nine disaster districts in Zhili, Zhejiang, Hunan, and elsewhere received partial tax and banner-rent relief.',
  ],
  s1214: [
    'Land tax on abandoned fields in Chuansha subprefecture and Baoshan county, Jiangsu, was abolished.',
    'Abandoned-field taxes in Jiangsu\'s Chuansha and Baoshan were abolished.',
  ],
  s1215: [
    'Korea, Ryukyu, Vietnam, Siam, and Lan Xang sent tribute.',
    'Korea, Ryukyu, Vietnam, Siam, and Lan Xang paid tribute.',
  ],
  s1216: [
    'Twenty-fifth year, spring, first month, day renshen: an edict gave preferential care to aged ministers including Mingliang and Hening, who need not come to the gardens to lead presentation audiences.',
    'In year 25, on the first-month renshen day, Mingliang, Hening, and other aged ministers were excused from garden presentation audiences.',
  ],
  s1217: [
    'Second month, day jichou: the Emperor attended the Classics Lecture.',
    'In the second month, on jichou day, the Emperor held the Classics Lecture.',
  ],
  s1218: [
    'On day guimao, Zhang Xu retired for illness; Dai Junyuan was made Grand Secretary and Wu Jin associate Grand Secretary.',
    'On guimao day, Zhang Xu retired; Dai Junyuan became grand secretary and Wu Jin, associate grand secretary.',
  ],
  s1219: [
    'On day wushen, the Emperor reviewed the Firearms Camp troops.',
    'On wushen day, the Emperor inspected the Firearms Camp.',
  ],
  s1220: [
    'On day yimao, Prince of Qing Yonglin fell ill; the Emperor visited him in person and promoted him to prince of the first rank.',
    'On yimao day, the ailing Prince of Qing Yonglin was visited and raised to full prince.',
  ],
  s1221: [
    'Third month, day jiazi: the Emperor visited the Eastern Tombs.',
    'In the third month, on jiazi day, the Emperor visited the Eastern Tombs.',
  ],
  s1222: [
    'The Ministry of War lost its traveling seal; when the matter was reported, Mingliang and others were fined and demoted by degree.',
    'After the War Ministry lost its traveling seal, Mingliang and others were demoted by degree.',
  ],
  s1223: [
    'On day yichou, the Emperor offered libations at the tombs of the Ming founders Chengzu, Xuanzong, and Xiaozong.',
    'On yichou day, the Emperor poured libations at Chengzu, Xuanzong, and Xiaozong\'s tombs.',
  ],
  s1224: [
    'On day jisi, Prince of Qing Yonglin died.',
    'On jisi day, Prince of Qing Yonglin died.',
  ],
  s1225: [
    'On day wuyin, the Emperor returned to the capital.',
    'On wuyin day, the Emperor returned to Beijing.',
  ],
  s1226: [
    'He visited the late prince\'s mansion to grant mourning gifts and ordered his son Mianmin to succeed as Prince of Qing.',
    'At the late prince\'s house he granted mourning rites and made Mianmin Prince of Qing.',
  ],
  s1227: [
    'Summer, fourth month, day jiawu: the Emperor went to Balizhuang to grant mourning at the bier of the late Prince Qingxi.',
    'In the fourth summer month, on jiawu day, he mourned at Balizhuang for Prince Qingxi.',
  ],
  s1228: [
    'On day gengxu, Chen Jichang and two hundred forty-six others received jinshi degrees with differentiated ranks.',
    'On gengxu day, Chen Jichang and 246 others received jinshi degrees.',
  ],
  s1229: [
    'Sixth month, day guimao: princes were forbidden to set up private language masters or buy commoners\' daughters as concubines.',
    'In the sixth month, on guimao day, princes were barred from private andars and buying commoner concubines.',
  ],
  s1230: [
    'Songyun was demoted to Commandant of Brave Cavalry.',
    'Songyun was reduced to commandant of brave cavalry.',
  ],
  s1231: [
    'Autumn, seventh month, day renshen: the Emperor went on tour to Mulan.',
    'In the seventh autumn month, on renshen day, the Emperor toured Mulan.',
  ],
  s1232: [
    'Fang Shoudi and others memorialized presenting fine grain.',
    'Fang Shoudi and others presented a memorial of fine grain.',
  ],
  s1233: [
    'On day wuyin, the court halted at the Mountain Resort for Avoiding Summer Heat.',
    'On wuyin day, the court stayed at the Summer Resort.',
  ],
  s1234: [
    'On day jimao, the Emperor fell ill; by evening his condition grew critical.',
    'On jimao day, the Emperor fell ill and was gravely ill by nightfall.',
  ],
  s1235: [
    'An edict was proclaimed installing the second imperial son, Prince of Zhi, as heir apparent.',
    'An edict installed the second son, Prince of Zhi, as heir apparent.',
  ],
  s1236: [
    'At the double-hour xu the Emperor died at the traveling palace, aged sixty-one.',
    'At the xu hour he died at the traveling palace, aged sixty-one.',
  ],
  s1237: [
    'Eighth month, day yisi: the coffin was escorted back to the capital.',
    'In the eighth month, on yisi day, the coffin was brought back to Beijing.',
  ],
  s1238: [
    'Tenth month, day jiachen: the posthumous honorific Shoutian Xingyun Fuhua Suiyou Chongwen Jingwu Xiaogong Qinjian Duanmin Yingzhe Rui Huangdi was respectfully submitted; temple name Renzong.',
    'In the tenth month, the full posthumous title and temple name Renzong were conferred.',
  ],
  s1239: [
    'Third month of Daoguang 1, day guiyou: burial at Changling Mausoleum.',
    'In Daoguang 1, third month, he was buried at Changling.',
  ],
  s1240: [
    'The commentators say: At first Renzong met tutelage in government and was reverent without breach.',
    'The annalists say Renzong began under tutelage and obeyed without deviation.',
  ],
  s1241: [
    'When he personally took the myriad affairs in hand, he uprooted the wicked and advanced the good.',
    'Once he ruled in person, he rooted out traitors and promoted the worthy.',
  ],
  s1242: [
    'He pacified lingering bandits, seized sea pirates, firmly held key levers, honored frugality and diligent service, and opened land to resettle migrants—all great foundations of rule.',
    'He crushed bandits and pirates, held power firmly, prized thrift and diligence, and opened land for settlers—the great foundations of his rule.',
  ],
  s1243: [
    'Edicts issued again and again, earnestly seeking counsel.',
    'Edict after edict earnestly sought honest counsel.',
  ],
  s1244: [
    'Yet the climate of open remonstrance was not soon seen—at this one may sigh.',
    'Yet open remonstrance did not quickly appear—and at that one sighs.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b13.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
