#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Shizong Emperor, styled Jingtian Changyun Jianzhong Biaozheng Wenwu Yingming Kuanren Xinyi Ruisheng Daxiao Zhicheng Xian, personal name Yinzhen, was the fourth son of the Sage Ancestor.',
    'Emperor Shizong (Yongzheng), temple name Yinzhen, was Kangxi\'s fourth son.',
  ],
  s0002: [
    'His mother was Empress Xiaogongren of the Uya clan.',
    'His mother was Empress Xiaogongren (Uya).',
  ],
  s0003: [
    'At birth there were auspicious signs; his bearing was imposing and his deportment grave and composed.',
    'Portents attended his birth; he was tall and dignified in manner.',
  ],
  s0004: [
    'In the thirty-seventh year of Kangxi he was enfeoffed as a beile.',
    'In Kangxi year 37 he received the rank of beile.',
  ],
  s0005: [
    'In the forty-eighth year he was enfeoffed as Prince Yong.',
    'In year 48 he became Prince Yong.',
  ],
  s0006: [
    'In the eleventh month of the sixty-first year, when the Sage Ancestor fell ill at the Changchun Garden, Yinzhen was ordered to perform the suburban sacrifice at the Round Altar in his stead.',
    'In month 11 of Kangxi 61, as Kangxi lay ill at Changchun Garden, Yinzhen was sent to offer the suburban sacrifice at the Round Altar.',
  ],
  s0007: [
    'On day jiawu, as the Sage Ancestor\'s illness grew critical, he was summoned to the fasting palace and the edict of succession was proclaimed.',
    'On jiawu day, with Kangxi near death, Yinzhen was called to the fasting palace and proclaimed heir.',
  ],
  s0008: [
    'The Sage Ancestor died.',
    'Kangxi died.',
  ],
  s0009: [
    'On day xinchou the Emperor acceded; the following year was taken as the first year of Yongzheng.',
    'On xinchou day Yinzhen took the throne; the next year began the Yongzheng reign.',
  ],
  s0010: [
    'Prince Yinsi, the thirteenth imperial brother Yinxiang, Grand Secretary Ma Qi, and Minister Longkodo were ordered to manage state affairs jointly.',
    'Yinsi, Yinxiang, Ma Qi, and Longkodo were put in charge of government.',
  ],
  s0011: [
    'The Pacification General of the Far Regions Yinti was summoned to the capital.',
    'Yinti, Pacification General on the western frontier, was recalled to Beijing.',
  ],
  s0012: [
    'Minister of War Bai Huang was ordered to assist the Grand Secretaries.',
    'Bai Huang of the Board of War was ordered to assist the Grand Secretariat.',
  ],
  s0013: [
    'Yang Zongren was made governor-general of Huguang; Nian Xiyao acted as Guangdong governor.',
    'Yang Zongren became Huguang governor-general; Nian Xiyao served as acting Guangdong governor.',
  ],
  s0014: [
    'Twelfth month, day wuwu: tribute goods from the provinces were halted.',
    'In the twelfth month, on wuwu day, provincial tribute offerings were stopped.',
  ],
  s0015: [
    'On day renxu, Prince Yinsi was enfeoffed as Prince Lian, Yinxiang as Prince Yi, Yintao as Prince of the Commandery of Lu, and Hongxi, son of the deposed Crown Prince Yinreng, as Prince of the Commandery of Li.',
    'On renxu day, Yinsi became Prince Lian, Yinxiang Prince Yi, Yintao Prince of Lu, and Hongxi—Yinreng\'s son—Prince of Li.',
  ],
  s0016: [
    'The ritual canon for sacrifices at the Temple of Former Emperors was revised.',
    'Sacrificial regulations for the Temple of Former Emperors were revised.',
  ],
  s0017: [
    'On day guihai, an edict said the Comprehensive Mirror of Ancient and Modern Books was not yet finished and scholars of broad learning should be quickly selected to complete the compilation.',
    'On guihai day, an edict urged swift completion of the Gujin Tushu Jicheng encyclopedia.',
  ],
  s0018: [
    'Assistant State Duke Yanxin was made general at Xi\'an and acted as Pacification General of the Far Regions.',
    'Yanxin became Xi\'an general and acting Pacification General.',
  ],
  s0019: [
    'On day jiazi, an edict ordered that provincial treasury deficits be made up within three years, with punishment beyond the deadline.',
    'On jiazi day, provinces were given three years to cover warehouse shortfalls or face punishment.',
  ],
  s0020: [
    'Funing\'an was made Grand Secretary, Longkodo Minister of Personnel, and Prince Lian Yinsi put in charge of the Board of Imperial Clansmen.',
    'Funing\'an became Grand Secretary; Longkodo, Minister of Personnel; Yinsi managed the Clansmen Board.',
  ],
  s0021: [
    'On day renshen, Zhang Tingyu was made Minister of Rites.',
    'On renshen day, Zhang Tingyu became Minister of Rites.',
  ],
  s0022: [
    'Grand Secretary Ma Qi was granted a second-rank earldom and given the honor name Dunhui.',
    'Ma Qi received a second-rank earldom and the honor name Dunhui.',
  ],
  s0023: [
    'First year of Yongzheng, spring, first month, day xinsi, new year\'s day: edicts admonishing governors-general, governors, provincial commanders, and garrison commanders, down to prefects and magistrates among civil officials and colonels and battalion commanders among military officers—eleven edicts in all.',
    'On New Year\'s day of Yongzheng 1, eleven admonitory edicts went out to every level of civil and military official.',
  ],
  s0024: [
    'On day bingxu, seasonal sacrifice at the Imperial Ancestral Temple.',
    'On bingxu day, the seasonal offering was made at the Imperial Ancestral Temple.',
  ],
  s0025: [
    'On day xinmao, grain prayer to the Supreme Lord.',
    'On xinmao day, the Emperor prayed for grain to Heaven.',
  ],
  s0026: [
    'On day renyin, bows, arrows, and quivers from the late Emperor\'s bequest were distributed to provincial commanders, garrison commanders, and deputy generals.',
    'On renyin day, Kangxi\'s parting gifts of bow and quiver were bestowed on senior field commanders.',
  ],
  s0027: [
    'Ministers of Justice Tao Lai and Zhang Tingshu were demoted for releasing Chen Menglei\'s two sons during trial of his case.',
    'Tao Lai and Zhang Tingshu were demoted for freeing Chen Menglei\'s sons during his trial.',
  ],
  s0028: [
    'On day jiachen, Hongshu and Hongchun, sons of Prince Chun of the Commandery, were enfeoffed as eldest son and beizi respectively.',
    'On jiachen day, Hongshu and Hongchun, sons of Prince Chun, became eldest son and beizi.',
  ],
  s0029: [
    'On day yisi, Grand Secretary Wang Yan asked to retire; permission was granted.',
    'On yisi day, Grand Secretary Wang Yan retired with approval.',
  ],
  s0030: [
    'Second month, day xinhai, new moon: Foge and Li Tingyi were made Ministers of Justice.',
    'On the first of the second month, Foge and Li Tingyi became Ministers of Justice.',
  ],
  s0031: [
    'On day renzi, Zhang Penghe was made Grand Secretary.',
    'On renzi day, Zhang Penghe became Grand Secretary.',
  ],
  s0032: [
    'On day yimao, the sixteenth imperial brother Yinlu was adopted into the line of Prince Zhuang Boguoduo and inherited his rank.',
    'On yimao day, Yinlu succeeded Prince Zhuang Boguoduo by adoption.',
  ],
  s0033: [
    'Boguoduo\'s nephew Qiulin was made a beile.',
    'Qiulin, Boguoduo\'s nephew, received the rank of beile.',
  ],
  s0034: [
    'On day gengshen, Prince Yintang was admonished.',
    'On gengshen day, Prince Yintang was publicly rebuked.',
  ],
  s0035: [
    'On day yichou, Assistant State Duke Yanxin was enfeoffed as beizi.',
    'On yichou day, Yanxin was raised to beizi.',
  ],
  s0036: [
    'Regulations were fixed for ministry clerks who, on completing service examination, return home for selection.',
    'Rules were set for ministry clerks to return home after passing service review.',
  ],
  s0037: [
    'Censors were ordered that one person each day submit a memorial-fold report on affairs.',
    'One censor each day was required to submit a folded memorial.',
  ],
  s0038: [
    'On day xinwei, Yi Zhaoxiong was made general at Fuzhou.',
    'On xinwei day, Yi Zhaoxiong became Fuzhou general.',
  ],
  s0039: [
    'Zhao Zhiyuan was dismissed; Li Weijun was made Zhili governor.',
    'Zhao Zhiyuan left office; Li Weijun became Zhili governor.',
  ],
  s0040: [
    'On day jimao, Deputy General Alana reported that Muslims of Lobnor had submitted.',
    'On jimao day, Alana reported submission of the Lobnor Muslims.',
  ],
  s0041: [
    'Third month, day jiashen: Tibetan garrison troops at Chamdo were withdrawn.',
    'In the third month, on jiashen day, the Chamdo garrison in Tibet was recalled.',
  ],
  s0042: [
    'Longkodo, Ma Qi, and Nian Gengyao were promoted to Grand Guardian.',
    'Longkodo, Ma Qi, and Nian Gengyao received the rank of Grand Guardian.',
  ],
  s0043: [
    'Governors-general and governors were ordered to recommend staff in memorials.',
    'Provincial governors were told to recommend advisers in memorials.',
  ],
  s0044: [
    'Nian Gengyao was enfeoffed as Duke of the Third Rank.',
    'Nian Gengyao was made a third-rank duke.',
  ],
  s0045: [
    'On day renchen, grandsons of the late Prince Anhe Yuele—Wuerzhan, Sehengtu, Jingxi, and their sons—were ordered to move to Mukden and were struck from the imperial clan register.',
    'On renchen day, Yuele\'s grandsons and their sons were sent to Mukden and removed from the clan rolls.',
  ],
  s0046: [
    'Summer, fourth month, day xinhai: the late Emperor\'s coffin was installed in the mourning hall; Prince Yinti was ordered to remain on guard.',
    'In the fourth month, Kangxi\'s coffin was placed in the mourning hall; Yinti was left to guard it.',
  ],
  s0047: [
    'On day bingchen, Prince Yi Yinxiang was ordered to manage the Board of Revenue; his son Hongchang was enfeoffed as beizi.',
    'On bingchen day, Yinxiang took charge of the Board of Revenue; his son Hongchang became beizi.',
  ],
  s0048: [
    'Translation examination subjects were established for provincial and metropolitan examinations.',
    'Manchu translation tracks were added to the provincial and metropolitan exams.',
  ],
  s0049: [
    'On day yichou, Daily Records officials were reinstated.',
    'On yichou day, the office of the Daily Records was restored.',
  ],
  s0050: [
    'The seventeenth imperial brother Yinzhi was enfeoffed as Prince of the Commandery of Guo.',
    'The seventeenth brother, Yinzhi, became Prince of Guo.',
  ],
  s0051: [
    'On day dingmao, for the first time he held court at the Gate of Heavenly Purity.',
    'On dingmao day, the Emperor heard affairs at the Gate of Heavenly Purity for the first time.',
  ],
  s0052: [
    'Imperial proclamations admonishing Grand Secretaries, leading grand chamberlains, and civil and military ministers—three in all.',
    'Three admonitory proclamations were issued to the highest civil and military ministers.',
  ],
  s0053: [
    'On day bingzi, Prince Chun of the Commandery Yinwu was promoted to full prince.',
    'On bingzi day, Yinwu was raised from commandery prince to full prince.',
  ],
  s0054: [
    'Regional commanders were ordered to submit memorial-folds on affairs.',
    'Regional commanders were required to report by folded memorial.',
  ],
  s0055: [
    'Fifth month, day gengchen: an edict remitted Yunnan troops\' obligation to replace horses that died on the Tibet route.',
    'In the fifth month, on gengchen day, Yunnan soldiers were excused from replacing horses lost on the road to Tibet.',
  ],
  s0056: [
    'On day guimao, he held audience at the Hall of Supreme Harmony.',
    'On guimao day, the Emperor held formal audience at the Hall of Supreme Harmony.',
  ],
  s0057: [
    'Li Weijun asked to use annual prefectural and county revenue to cover accumulated deficits.',
    'Li Weijun proposed covering treasury shortfalls from local annual revenue.',
  ],
  s0058: [
    'The Emperor said: "Prefects and magistrates should be given some leeway before they can be expected to devote themselves fully to good administration—how can they be compelled to make up others\' deficits!',
    'The Emperor refused: local officials need breathing room to govern well; they cannot be forced to pay off someone else\'s debts.',
  ],
  s0059: [
    '"" (closing quotation mark in the source.) On day yiyou, an edict ordered Prince of the Commandery of Li Hongxi to move to Zhengjiazhuang.',
    'The edict continued. On yiyou day, Hongxi was ordered to reside at Zhengjiazhuang.',
  ],
  s0060: [
    'On day dingyou, Minister Xu Yuanmeng was ordered to act as Grand Secretary.',
    'On dingyou day, Xu Yuanmeng served as acting Grand Secretary.',
  ],
  s0061: [
    'On day xinchou, Empress Dowager Renshou died—she was the Emperor\'s birth mother; the coffin was placed at Ningshou Palace.',
    'On xinchou day the Emperor\'s mother, Empress Dowager Renshou, died; her coffin rested at Ningshou Palace.',
  ],
  s0062: [
    'Prince Yinti was enfeoffed as Prince of the Commandery of Xun.',
    'Yinti was raised to Prince of Xun.',
  ],
  s0063: [
    'Sixth month, day dingsi: Zuo Shiyong was made Han Chinese commander-in-chief.',
    'In the sixth month, on dingsi day, Zuo Shiyong became Han commander-in-chief.',
  ],
  s0064: [
    'On day jiwei, the five generations of Confucius were granted princely rank.',
    'On jiwei day, five generations of Confucius\' line received princely titles.',
  ],
  s0065: [
    'On day xinyou, banner people without fixed property were ordered to move to Rehe to open farmland.',
    'On xinyou day, landless bannermen were sent to Rehe to farm.',
  ],
  s0066: [
    'On day renxu, the Qinghai prince Erdeni, broken by Lobsang Danjin, came in submission with his followers; officials were sent to comfort them.',
    'On renxu day, the Qinghai prince, defeated by Lobsang Danjin, fled in with his people and received imperial care.',
  ],
  s0067: [
    'His nephew Galdan Tashi also came to submit; they were ordered to dwell together at Suyou.',
    'His nephew Galdan Tashi followed; both groups were settled at Suyou.',
  ],
  s0068: [
    'On day renshen, an edict to Li Weijun said: "Within the capital region, banner people and commoners live mingled; bannermen\'s violence has greatly troubled the people.',
    'On renshen day, Li Weijun was told that banner bullying of commoners in the capital region must be stopped.',
  ],
  s0069: [
    'You must rectify this; do not avoid the distinction between banner and Han, or fear princes and meritorious nobles—all are to be reported in secret memorials.',
    'He was to act without regard to banner privilege or noble rank and report abuses secretly.',
  ],
  s0070: [
    '"" (closing quotation mark in the source.) On day bingzi, banner personnel who suffered extortion from their banner commander or supervising prince were permitted to lodge complaints.',
    'The edict continued. On bingzi day, bannermen could sue commanders or princes who oppressed them.',
  ],
  s0071: [
    'Autumn, seventh month, day jimao: Vice Minister Chang Shou was sent to negotiate with Lobsang Danjin.',
    'In the seventh month, on jimao day, Chang Shou was dispatched to treat with Lobsang Danjin.',
  ],
  s0072: [
    'On day yiyou, officers were sent to Mukden, Jiangxi, and Huguang to sell grain and ship it to the capital.',
    'On yiyou day, grain was purchased in Mukden, Jiangxi, and Huguang for transport to Beijing.',
  ],
  s0073: [
    'On day jichou, an edict remitted wrongly collected transport fees and porter surcharges on Jiangxi tribute grain.',
    'On jichou day, excess charges on Jiangxi grain transport were forgiven.',
  ],
  s0074: [
    'On day renchen, the Manchu titles gushan ejen and idu ejen were changed to gushan angbang and idu zhangjing.',
    'On renchen day, Manchu banner officer titles were renamed.',
  ],
  s0075: [
    'On day xinsi, autumn executions were suspended for this year.',
    'On xinsi day, the autumn executions were halted.',
  ],
  s0076: [
    'The beggar registry of indolent households in Shaoxing was abolished.',
    'Shaoxing\'s hereditary beggar caste was struck from the registers.',
  ],
  s0077: [
    'The Expanded Meaning of the Classic of Filial Piety was promulgated.',
    'The Xiaojing yanyi was issued throughout the realm.',
  ],
  s0078: [
    'On day renyin, Longkodo and Wang Yuling were ordered to supervise compilation of the History of Ming, with Xu Yuanmeng and Zhang Tingyu as chief editors.',
    'On renyin day, Longkodo and Wang Yuling oversaw the Ming History; Xu Yuanmeng and Zhang Tingyu led the editorial staff.',
  ],
  s0079: [
    'Eighth month, day dingsi: Yang Lin was made Guangdong governor-general; Kong Yuqi Guangxi governor-general.',
    'In the eighth month, on dingsi day, Yang Lin and Kong Yuqi received southern posts.',
  ],
  s0080: [
    'On day jiazi, princes, ministers, and the Nine Ministers were summoned for face-to-face instruction: "The matter of establishing an heir ought long ago to have been settled.',
    'On jiazi day, the Emperor told his highest ministers that the succession should have been settled earlier.',
  ],
  s0081: [
    'Last November\'s affair was decided in a single word amid haste.',
    'Last November\'s choice was made in a moment of crisis.',
  ],
  s0082: [
    'The Sage Ancestor was divine in wisdom—beyond what We can match.',
    'Kangxi\'s wisdom surpassed his own.',
  ],
  s0083: [
    'Now We have personally written a sealed document, placed in a brocade casket and hidden behind the plaque "Upright and Illuminating"; you ministers are to take note of it.',
    'He had written the heir\'s name, sealed it in a casket behind the "Upright and Illuminating" plaque, and bade them remember.',
  ],
  s0084: [
    '"" (closing quotation mark in the source.) On day gengwu, Chang Shou memorialized that he had reached Qinghai and negotiated with Lobsang Danjin, who would not comply.',
    'The edict continued. On gengwu day, Chang Shou reported that Lobsang Danjin refused negotiation at Qinghai.',
  ],
  s0085: [
    'An edict ordered Nian Gengyao to prepare troops.',
    'Nian Gengyao was ordered to ready his forces.',
  ],
  s0086: [
    'On day xinwei, the Emperor visited the imperial tombs.',
    'On xinwei day, the Emperor went to the tombs.',
  ],
  s0087: [
    'Ninth month, day dingchou, new moon: the Sage Ancestor Ren Emperor was buried at Jingling; Empress Xiaogong was enshrined with him.',
    'On the first of the ninth month, Kangxi was buried at Jingling with Empress Xiaogong.',
  ],
  s0088: [
    'That day, five-colored clouds appeared.',
    'A five-colored cloud was seen that day.',
  ],
  s0089: [
    'On day jimao, the Emperor returned to the capital.',
    'On jimao day, the Emperor returned to Beijing.',
  ],
  s0090: [
    'On day xinsi, Hao Yulin was made Yunnan provincial commander.',
    'On xinsi day, Hao Yulin became Yunnan provincial commander.',
  ],
  s0091: [
    'On day renwu, Zhang Tingyu was made Minister of Revenue; Zhang Boxing Minister of Rites.',
    'On renwu day, Zhang Tingyu took Revenue; Zhang Boxing, Rites.',
  ],
  s0092: [
    'On day guisi, Prince Yu Bao Tai was put in charge of the Plain Yellow Banner.',
    'On guisi day, Prince Yu Bao Tai managed the Plain Yellow Banner.',
  ],
  s0093: [
    'An order was issued to compile and revise the legal code.',
    'Work on revising the legal code was ordered.',
  ],
  s0094: [
    'On day bingshen, Alana was made Mongol commander-in-chief.',
    'On bingshen day, Alana became Mongol commander-in-chief.',
  ],
  s0095: [
    'Winter, tenth month, day wushen: Nian Gengyao was appointed Pacification General of the Far Regions; Yanxin was changed to Pacification General for Suppressing Rebels.',
    'In the tenth month, on wushen day, Nian Gengyao became Pacification General; Yanxin, Pacification General against Rebels.',
  ],
  s0096: [
    'On day guihai, Lobsang Danjin seized our envoy Chang Shou; clerk Dorji died.',
    'On guihai day, Lobsang Danjin seized Chang Shou and killed clerk Dorji.',
  ],
  s0097: [
    'On day guiyou, Arsonga was made Minister of Rites; Yin Tai Censor-in-chief of the Left.',
    'On guiyou day, Arsonga and Yin Tai received new posts.',
  ],
  s0098: [
    'Eleventh month, day dingchou: Yu Zhen and two hundred forty-six others were granted jinshi and other ranks with distinctions.',
    'In the eleventh month, on dingchou day, Yu Zhen and 246 others received jinshi degrees.',
  ],
  s0099: [
    'On day wuyin, Lobsang Danjin raided Xining; garrison commander Ma Youren and Regional Commander Song Kejin defeated him at Shenzhong Fort; the rebels fled.',
    'On wuyin day, Lobsang Danjin attacked Xining and was beaten back at Shenzhong Fort.',
  ],
  s0100: [
    'On day bingxu, Nian Gengyao memorialized that Regional Commander Yang Jinxin advanced against Tibetan rebels at Zhuanglang Chair Mountain and beheaded several hundred.',
    'On bingxu day, Nian Gengyao reported Yang Jinxin\'s victory at Zhuanglang, with hundreds of rebels slain.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b01.mjs <translation.json>'
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
