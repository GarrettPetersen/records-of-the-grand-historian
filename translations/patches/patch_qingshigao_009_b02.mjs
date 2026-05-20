#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Imperial commendation was received.',
    'The memorial received imperial praise.',
  ],
  s0102: [
    'On day xinchou, at the winter solstice, Heaven was sacrificed to at the Circular Mound Altar, with Emperor Shengzu Ren accompanying.',
    'On xinchou day, at the winter solstice, the Emperor sacrificed to Heaven at the Circular Mound, with the Kangxi Emperor as associate spirit.',
  ],
  s0103: [
    'Twelfth month, first day of the month on day bingwu: because Wu Erzhan and others showed resentment, they were not permitted to inherit the title Prince of An commandery, and their attached commanders were withdrawn.',
    'On the first of the twelfth month, Wu Erzhan and others were barred from inheriting the Prince of An title and lost their attached commanders for disloyalty.',
  ],
  s0104: [
    'On day xinyou, Nian Gengyao reported that bandits had come to attack; Assistant Commander Sun Jizong defeated them.',
    'On xinyou day, Nian Gengyao reported an attack; Assistant Commander Sun Jizong drove the raiders off.',
  ],
  s0105: [
    'Foreigners were settled at Macao; the Catholic church was converted to a public hall, and joining the religion was strictly forbidden.',
    'Westerners were settled at Macao, the Catholic church was turned into a public hall, and conversion was forbidden.',
  ],
  s0106: [
    'On day dingmao, the principal consort of the Nara clan was invested as empress; the Nian clan was made Noble Consort, the Niuhuru clan Honored Consort Xi, and the Geng clan Pure Concubine Yu.',
    'On dingmao day, Empress Nara was installed, with Noble Consort Nian, Honored Consort Xi Niuhuru, and Pure Concubine Yu Geng.',
  ],
  s0107: [
    'On day jiaxu, the seasonal great offering was made at the Imperial Ancestral Temple.',
    'On jiaxu day, the Emperor performed the collective ancestral sacrifice.',
  ],
  s0108: [
    'This year, disaster land tax for forty-nine prefectures and counties in Zhili, Jiangnan, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across forty-nine districts in Zhili, Jiangnan, and other provinces.',
  ],
  s0109: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0110: [
    'Registered households numbered 25,326,270, and additionally 480,557 persons registered after the perpetual exemption from additional levies.',
    'The census counted 25,326,270 households and 480,557 persons registered after the perpetual no-new-levy rule.',
  ],
  s0111: [
    'Land tax collected 30,223,943 taels odd.',
    'Land tax yielded 30,223,943 taels and a fraction.',
  ],
  s0112: [
    'Salt tax 4,261,933 taels odd.',
    'The salt levy brought 4,261,933 taels and a fraction.',
  ],
  s0113: [
    'Coinage 499,200 odd.',
    'Coin was cast to the amount of 499,200 and a fraction.',
  ],
  s0114: [
    'Second year, spring, first month, day xinsi: grain-and-meat offering to the Supreme Lord, with Emperor Shengzu Ren accompanying.',
    'In the second year, on the first day of spring, the Emperor offered grain and meat to Heaven, with the Kangxi Emperor as associate spirit.',
  ],
  s0115: [
    'An edict ordered Grand Secretary Tulai to share in the great offering at the Imperial Ancestral Temple.',
    'Grand Secretary Tulai was ordered to share in the ancestral temple offering.',
  ],
  s0116: [
    'Chang Shou returned from Lobsang Danjin\'s side and was ordered confined at Xi\'an.',
    'Chang Shou came back from Lobsang Danjin and was imprisoned at Xi\'an.',
  ],
  s0117: [
    'On day dinghai, Yue Zhongqi was made Valiant and Majestic General and given sole command of the Qinghai expedition.',
    'On dinghai day, Yue Zhongqi became Valiant and Majestic General with sole command in Qinghai.',
  ],
  s0118: [
    'On day dingyou, Gao Qipei was made Han Banner commander-in-chief.',
    'On dingyou day, Gao Qipei became Han Banner commander-in-chief.',
  ],
  s0119: [
    'On day gengzi, a Confucian temple was built at Guihua Town.',
    'On gengzi day, a Confucian temple was erected at Guihua Town.',
  ],
  s0120: [
    'Second month, day bingwu: the Emperor composed the Sacred Edict for Extensive Instruction and promulgated it throughout the realm.',
    'In the second month, the Emperor issued his Sacred Edict for Extensive Instruction empire-wide.',
  ],
  s0121: [
    'On day wuwu, Yue Zhongqi\'s army reached Qinghai, captured the three captives including Alibutan Wenbu, and received the surrender of scattered tribes.',
    'On wuwu day, Yue Zhongqi reached Qinghai, seized Alibutan Wenbu and two other captives, and gathered fleeing tribes.',
  ],
  s0122: [
    'An edict said that because the Qinghai campaign was nearing its end and Tsewang Arabtan was submissive, the armies at Altai and Ulan Gumu were dismissed.',
    'An edict ended the Altai and Ulan Gumu armies now that Qinghai was nearly pacified and Tsewang Arabtan had submitted.',
  ],
  s0123: [
    'On day xinyou, an edict on the imperial lecture at the National University changed "the Emperor visits the school" to "the Emperor proceeds to the school."',
    'On xinyou day, the court altered the ritual wording for the imperial visit to the National University.',
  ],
  s0124: [
    'On day guihai, the Emperor ploughed the sacred field, finished three furrows, and then added one more.',
    'On guihai day, the Emperor ploughed the sacred field three furrows and then one more.',
  ],
  s0125: [
    'On day jiazi, prefectures and districts were ordered to recommend aged farmers and grant them official caps.',
    'On jiazi day, districts were told to honor elderly farmers with official caps.',
  ],
  s0126: [
    'Nian Gengyao reported that Liangzhou Circuit intendant Jiang Bing had suppressed the Agang tribes; he was given the rank of surveillance commissioner.',
    'Nian Gengyao reported Jiang Bing\'s suppression of the Agang tribes and his promotion to surveillance commissioner.',
  ],
  s0127: [
    'On day bingyin, Gao Qizhuo reported that the Zhongdian tribal peoples had submitted.',
    'On bingyin day, Gao Qizhuo reported the submission of the Zhongdian tribes.',
  ],
  s0128: [
    'On day gengwu, the Emperor prayed for rain at Black Dragon Pool.',
    'On gengwu day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0129: [
    'Third month, first day of the month on day yihai: the Emperor proceeded to the National University for the sacrifice, lectured on the Documents and Great Learning in the Hall of Moral Principles, and increased the provincial examination quota for the university.',
    'On the first of the third month, the Emperor sacrificed at the National University, lectured on the Classics, and enlarged the university provincial quota.',
  ],
  s0130: [
    'On day dingchou, sacrifice was offered at the Temple of Former Dynasties\' Emperors.',
    'On dingchou day, the court sacrificed at the Temple of Former Dynasties\' Emperors.',
  ],
  s0131: [
    'On day gengchen, the Emperor visited the imperial tombs.',
    'On gengchen day, the Emperor paid his respects at the imperial tombs.',
  ],
  s0132: [
    'Yue Zhongqi\'s army reached the rebels\' lair; Lobsang Danjin fled, his mother Altai Katun was captured, and Qinghai was pacified.',
    'Yue Zhongqi reached the rebel stronghold; Lobsang Danjin fled, his mother was taken, and Qinghai was pacified.',
  ],
  s0133: [
    'Nian Gengyao was enfeoffed Duke of the First Rank, Yue Zhongqi Duke of the Third Rank, and two hundred thousand taels from the treasury were issued to reward the army.',
    'Nian Gengyao became a first-rank duke, Yue Zhongqi a third-rank duke, and two hundred thousand taels rewarded the troops.',
  ],
  s0134: [
    'On day yiyou, at the Qingming festival, the Emperor proceeded to Jing Mausoleum to perform the spreading-earth rite.',
    'On yiyou day, at Qingming, the Emperor went to Jing Mausoleum for the spreading-earth rite.',
  ],
  s0135: [
    'On day dinghai, the Emperor returned to the palace.',
    'On dinghai day, the Emperor returned to the palace.',
  ],
  s0136: [
    'Summer, fourth month, day dingwei: Kong Yuxun was made governor-general of the Two Guangs, and Li Fu governor of Guangxi.',
    'In the fourth month, Kong Yuxun became governor-general of the Two Guangs and Li Fu governor of Guangxi.',
  ],
  s0137: [
    'On day gengxu, princes and high ministers were summoned to admonish Prince Lian Yinsi and order him to reform; they were also ordered to observe his conduct and report truthfully.',
    'On gengxu day, ministers were summoned to admonish Prince Lian Yinsi, order his reform, and report on his conduct.',
  ],
  s0138: [
    'On day jisi, Prince Dun of the Commandery Yin\'e was guilty; his title was stripped and he was confined.',
    'On jisi day, Prince Dun Yin\'e was stripped of rank and imprisoned.',
  ],
  s0139: [
    'Intercalary fourth month, day dingchou: the Comprehensive Statutes were continued in revision.',
    'In the intercalary fourth month, revision of the Comprehensive Statutes continued.',
  ],
  s0140: [
    'On day bingxu, Ji Zengyun was made deputy director-general of waterways.',
    'On bingxu day, Ji Zengyun became deputy director-general of waterways.',
  ],
  s0141: [
    'On day dingyou, Sudan was made Mongol commander-in-chief.',
    'On dingyou day, Sudan became Mongol commander-in-chief.',
  ],
  s0142: [
    'On day guiwei, the Qinghai rebels Alibutan Wenbu, Chilak Nuomuqi, and Zangbazhab were sent to the capital in cangues; the Emperor received the captives at the Meridian Gate.',
    'On guiwei day, three Qinghai rebel leaders were brought to Beijing in cangues and presented at the Meridian Gate.',
  ],
  s0143: [
    'Fifth month, first day of the month on day maoyin: at the summer solstice, Earth was sacrificed to at the Square Mound Altar, with Emperor Shengzu Ren accompanying.',
    'On the first of the fifth month, at the summer solstice, the Emperor sacrificed to Earth at the Square Mound, with the Kangxi Emperor as associate spirit.',
  ],
  s0144: [
    'Beile Ablan was again reduced to Defender-general of the State.',
    'Beile Ablan was demoted again to defender-general of the state.',
  ],
  s0145: [
    'On day bingchen, Beizi Sunu, as a partisan of Prince Lian, was stripped of his title; he and his sons were all sent to the Right Wing.',
    'On bingchen day, Beizi Sunu was stripped of rank for Prince Lian\'s faction and sent with his sons to the Right Wing.',
  ],
  s0146: [
    'On day xinyou, an edict to the governors-general, governors, provincial commanders, and regional commanders of Sichuan, Shaanxi, Huguang, Yunnan, and Guizhou said: "We hear that native chiefs everywhere scarcely know law and discipline, cruelly treat their subjects, and kill or spare at will.',
    'On xinyou day, an edict to the southwestern provinces said native chiefs often abused their subjects and killed at will.',
  ],
  s0147: [
    'Now the realm enjoys ease and benefit, yet native peoples alone still feel pressed to the corner; Our heart cannot bear it.',
    'While the empire prospered, native peoples still suffered; the Emperor said his heart could not bear it.',
  ],
  s0148: [
    'You should strictly admonish native chiefs not to commit cruelty wantonly, to fulfill Our intent of cherishing all in the primordial unity."',
    'Chiefs were ordered to cease cruelty and honor the Emperor\'s care for all his subjects."',
  ],
  s0149: [
    '" On day renxu, Na Min was made Manchu commander-in-chief.',
    'On renxu day, Na Min became Manchu commander-in-chief.',
  ],
  s0150: [
    'On day wuchen, Beizi Hongchun was stripped of his title.',
    'On wuchen day, Beizi Hongchun lost his rank.',
  ],
  s0151: [
    'Sixth month, day guiwei: the Eight Banners were forbidden to beat household members to death on their own authority.',
    'In the sixth month, the Banners were forbidden to kill household members arbitrarily.',
  ],
  s0152: [
    'On day yiyou, because Qinghai had been pacified, a stone inscription was ordered at the Imperial University.',
    'On yiyou day, a victory stele was ordered at the Imperial University for the Qinghai pacification.',
  ],
  s0153: [
    'On day wuxu, because the temple at Confucius\'s birthplace had suffered fire, the Emperor offered sacrifice to the Sage and sent officials to supervise repairs.',
    'On wuxu day, after fire at Qufu, the Emperor sacrificed to Confucius and ordered repairs.',
  ],
  s0154: [
    'Beizi Yintao was reduced to Defender-general of the State.',
    'Beizi Yintao was demoted to defender-general of the state.',
  ],
  s0155: [
    'Li Guangfu was dismissed; Li Yongshao was made Minister of Works.',
    'Li Guangfu left office and Li Yongshao became Minister of Works.',
  ],
  s0156: [
    'Autumn, seventh month, day dingsi: the Emperor composed the Treatise on Factions and issued it to the ministers.',
    'In the seventh month, the Emperor issued his Treatise on Factions to the court.',
  ],
  s0157: [
    'On day renxu, Ding Shou was made garrison general at Altai.',
    'On renxu day, Ding Shou became garrison general at Altai.',
  ],
  s0158: [
    'On day guihai, Deputy Commander Arana died in camp; because he had long toiled abroad, a hereditary office was granted in addition.',
    'On guihai day, Deputy Commander Arana died on campaign and received a posthumous hereditary rank.',
  ],
  s0159: [
    'Eighth month, day jiaxu: provincial and metropolitan candidates subject to avoidance were ordered to be examined together with other candidates, with separate ministers appointed to read the papers.',
    'In the eighth month, examination avoidance rules were revised so related candidates were tested with others under separate examiners.',
  ],
  s0160: [
    'On day renwu, this year\'s autumn judicial review was suspended.',
    'On renwu day, autumn executions were halted for the year.',
  ],
  s0161: [
    'On day gengyin, Tian Wenjing was made acting governor of Henan.',
    'On gengyin day, Tian Wenjing became acting Henan governor.',
  ],
  s0162: [
    'Ninth month, first day of the month on day xinchou: because of Altai military merit, Ding Shou was granted a hereditary office.',
    'On the first of the ninth month, Ding Shou received a hereditary office for Altai service.',
  ],
  s0163: [
    'Purchase-by-donation regulations at the Ministry of Revenue were suspended.',
    'Revenue purchase-by-donation was halted.',
  ],
  s0164: [
    'On day jiayin, an order was issued that Shanxi poll tax silver be assessed within land grain; afterward the other provinces gradually followed.',
    'On jiayin day, Shanxi poll tax was folded into land tax, a practice other provinces later adopted.',
  ],
  s0165: [
    'Winter, tenth month, day yihai: Chen Dun and two hundred ninety-nine others were granted metropolitan graduate degrees with distinctions in rank.',
    'In the tenth month, Chen Dun and 299 others received metropolitan degrees with distinctions.',
  ],
  s0166: [
    'On day wuyin, Ming descendant Zhu Zhilian was enfeoffed Marquis of the First Rank, charged generation after generation to maintain Ming sacrifices.',
    'On wuyin day, Zhu Zhilian, heir of the Ming, became a first-rank marquis to maintain Ming rites.',
  ],
  s0167: [
    'On day guiwei, an edict ordered a Hall of Loyalty and Righteousness built in the capital.',
    'On guiwei day, the court ordered a Hall of Loyalty and Righteousness in Beijing.',
  ],
  s0168: [
    'On day yiwei, an edict granted Olot prince and imperial son-in-law Abao pasture in Qinghai.',
    'On yiwei day, Prince Abao of the Olot was granted Qinghai pasture.',
  ],
  s0169: [
    'A Ningxia garrison was established.',
    'A Ningxia garrison was set up.',
  ],
  s0170: [
    'On day bingshen, Minister of Justice Ersong\'a, for lack of wholehearted service, was stripped of office and title and sent to Mukden; his uncle Yinde inherited the office of Duke Guoyi.',
    'On bingshen day, Minister of Justice Ersong\'a was dismissed and sent to Mukden; his uncle Yinde inherited Duke Guoyi.',
  ],
  s0171: [
    'Siam sent tribute of rice seed and fruit trees.',
    'Siam presented rice seed and fruit trees as tribute.',
  ],
  s0172: [
    'The Zhili provincial administration commission and surveillance commission were established; Governor Li Weijun was made governor-general.',
    'Zhili gained provincial administration and surveillance offices, and Li Weijun became governor-general.',
  ],
  s0173: [
    'On day gengzi, Yinde and Kuadai were both made senior chamberlains of the imperial bodyguard.',
    'On gengzi day, Yinde and Kuadai became senior chamberlains of the imperial bodyguard.',
  ],
  s0174: [
    'On day dingwei, Sudan was made Ningxia regional commander.',
    'On dingwei day, Sudan became Ningxia regional commander.',
  ],
  s0175: [
    'Eleventh month, day gengxu: Hongsheng was guilty and stripped of his title.',
    'In the eleventh month, Hongsheng lost his rank for his crimes.',
  ],
  s0176: [
    'On day yimao, Chuoqi was made Mongol commander-in-chief and Ga\'erbi Han Banner commander-in-chief.',
    'On yimao day, Chuoqi became Mongol commander-in-chief and Ga\'erbi Han commander-in-chief.',
  ],
  s0177: [
    'On day dingsi, Gao Qizhuo reported that officers and soldiers had advanced against the Zhong Miao and pacified them.',
    'On dingsi day, Gao Qizhuo reported the pacification of the Zhong Miao.',
  ],
  s0178: [
    'On day xinyou, the mausoleum of Empress Xiaozhuang Wen was fixed to be called Zhaoxi Mausoleum.',
    'On xinyou day, Empress Xiaozhuang Wen\'s tomb was named Zhaoxi Mausoleum.',
  ],
  s0179: [
    'Twelfth month, day guiyou: the Imperial University was ordered to erect a metropolitan graduate name stele.',
    'In the twelfth month, the National University was ordered to set up a graduate name stele.',
  ],
  s0180: [
    'On day guiwei, the deposed Crown Prince Yinreng died; he was enfeoffed Prince Li and given the posthumous title Mi.',
    'On guiwei day, the deposed Crown Prince Yinreng died and was posthumously made Prince Li with the name Mi.',
  ],
  s0181: [
    'Chuoqi was made Fengtian regional commander.',
    'Chuoqi became Fengtian regional commander.',
  ],
  s0182: [
    'On day jichou, Prince Yu Baotai was guilty and stripped of his title; his younger brother\'s son Guangning succeeded as Prince Yu.',
    'On jichou day, Prince Yu Baotai lost his rank; his nephew Guangning inherited the title.',
  ],
  s0183: [
    'A Hunan provincial education intendant was established.',
    'A Hunan education intendant was appointed.',
  ],
  s0184: [
    'On day wuxu, the seasonal great offering was made at the Imperial Ancestral Temple.',
    'On wuxu day, the collective ancestral sacrifice was performed.',
  ],
  s0185: [
    'This year, disaster land tax for fifty-seven prefectures, districts, and guards in Jiangnan, Zhejiang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across fifty-seven districts in Jiangnan, Zhejiang, and other provinces.',
  ],
  s0186: [
    'Korea, Annam, and Siam sent tribute.',
    'Korea, Annam, and Siam paid tribute.',
  ],
  s0187: [
    'Third year, spring, first month, day guichou: an edict set aside two hundred qing of Gu\'an official land as well-field land and sent idle Banner households to cultivate it.',
    'In the third year, on the first day of spring, an edict turned two hundred qing of Gu\'an official land into well-fields for idle Banner households.',
  ],
  s0188: [
    'On day renxu, Cai Ting was made Censor-in-chief of the Left.',
    'On renxu day, Cai Ting became Censor-in-chief of the Left.',
  ],
  s0189: [
    'On day guihai, Aqitu was made infantry commander-in-chief.',
    'On guihai day, Aqitu became infantry commander-in-chief.',
  ],
  s0190: [
    'Second month, day gengwu: the sun and moon appeared united and the five planets aligned.',
    'In the second month, the sun and moon appeared conjoined and the five planets aligned.',
  ],
  s0191: [
    'On day gengchen, because the three-year mourning period had ended, the Emperor performed the collective ancestral sacrifice.',
    'On gengchen day, with mourning ended, the Emperor performed the collective ancestral sacrifice.',
  ],
  s0192: [
    'On day dinghai, an edict rebuked Nian Gengyao for failing to soothe and comfort the remnant tribes of Qinghai, saying that if even one or two persons fled into the Dzungars, he would be heavily punished.',
    'On dinghai day, an edict warned Nian Gengyao to pacify Qinghai remnants or face severe punishment should any flee to the Dzungars.',
  ],
  s0193: [
    'On day yiwei, Erendai, as a partisan of Prince Lian, was stripped of office and title and sent to Mukden; his younger brother Kuadai inherited the rank of Duke of the First Rank.',
    'On yiwei day, Erendai was dismissed for Prince Lian\'s faction and sent to Mukden; his brother Kuadai inherited a first-rank dukedom.',
  ],
  s0194: [
    'On day dingyou, court ministers were summoned and the crimes of Yintang were proclaimed, together with those of Yinsi, Yin\'e, and Yinti.',
    'On dingyou day, ministers heard Yintang\'s crimes proclaimed along with those of Yinsi, Yin\'e, and Yinti.',
  ],
  s0195: [
    'Third month, day dingwei: Ma Huibo was made provincial commander of Guizhou.',
    'In the third month, Ma Huibo became Guizhou provincial commander.',
  ],
  s0196: [
    'Tsewang Arabtan sent envoys with tribute.',
    'Tsewang Arabtan sent tribute envoys.',
  ],
  s0197: [
    'An Anhui provincial education intendant was established.',
    'An Anhui education intendant was appointed.',
  ],
  s0198: [
    'On day guichou, Grand Secretary Zhang Penghe died.',
    'On guichou day, Grand Secretary Zhang Penghe died.',
  ],
  s0199: [
    'Minister of Rites Zhang Boxing died.',
    'Minister of Rites Zhang Boxing died.',
  ],
  s0200: [
    'On day dingsi, the floating grain tax of Suzhou and Songjiang totaling four hundred fifty thousand taels was remitted.',
    'On dingsi day, four hundred fifty thousand taels of floating grain tax in Suzhou and Songjiang were forgiven.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b02.mjs <translation.json>'
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
