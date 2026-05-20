#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Gaozong Emperor, styled Fatian Longyun Zhicheng Xianjue Tiyuan Liji Fuwen Fenwu Qinming Xiaoci Shensheng Chun, personal name Hongli, was the fourth son of Emperor Shizong; his mother was Empress Xiaoshengxian; he was born on the thirteenth day of the eighth month in the fiftieth year of Kangxi at the residence of Prince Yong.',
    'Emperor Gaozong (Qianlong), temple name Hongli, was Yongzheng\'s fourth son, born at Prince Yong\'s mansion in Kangxi 50.',
  ],
  s0002: [
    'His nose was high and his frame tall; when the Sage Ancestor saw him he took special delight in him, had him read in the palace, and placed him under the Metropolitan Graduate Fu Min—what he read once he could recite from memory.',
    'Kangxi favored the tall, imposing boy and had him study in the palace under Fu Min, who found him memorized lessons at a glance.',
  ],
  s0003: [
    'He also learned archery from Prince Beile Yunxi and firearms from Prince Zhuang Yunlu.',
    'He trained in archery with Yunxi and in firearms with Prince Zhuang Yunlu.',
  ],
  s0004: [
    'On a mulan hunt he was ordered to have guards lead him to shoot a bear.',
    'During a mulan hunt, guards were told to guide him to shoot a bear.',
  ],
  s0005: [
    'He had just mounted when the bear suddenly reared up.',
    'He had barely mounted when the bear charged.',
  ],
  s0006: [
    'The Emperor held the reins with perfect composure.',
    'Hongli kept his seat and did not flinch.',
  ],
  s0007: [
    'The Sage Ancestor took up his musket and killed the bear.',
    'Kangxi fired and brought the bear down.',
  ],
  s0008: [
    'Entering the military tent, he turned and said to Imperial Noble Consort Wen Hui: "This child\'s fate is precious; fortune will surpass mine.',
    'In the tent Kangxi told Imperial Noble Consort Wen Hui that the boy\'s destiny was august and his blessings would exceed his own.',
  ],
  s0009: [
    '"" (closing quotation mark in the source.)',
    'The remark ended there.',
  ],
  s0010: [
    'In the eighth month of the first year of Yongzheng, Emperor Shizong went to the Palace of Heavenly Purity, secretly wrote the heir\'s name, sealed it, and hid it above the plaque "Upright and Illuminating" inscribed by Emperor Shizu.',
    'In Yongzheng 1, month 8, Yongzheng sealed Hongli\'s name in the casket behind the "Upright and Illuminating" plaque.',
  ],
  s0011: [
    'In the fifth year he married Empress Xiaoxian of the Fu clan.',
    'In year 5 he wed Empress Xiaoxian (Fu).',
  ],
  s0012: [
    'In the eleventh year he was enfeoffed as Prince Bao of the First Rank.',
    'In year 11 he became Prince Bao.',
  ],
  s0013: [
    'The Dzungar campaign was not yet finished, and there was also the Miao war in Guizhou; the Emperor ordered him to oversee military affairs at the Grand Council and to decide major strategy.',
    'With Dzungar and Guizhou Miao wars still raging, Yongzheng put him in charge of Grand Council strategy.',
  ],
  s0014: [
    'In the eighth month of the thirteenth year, on day dinghai, Emperor Shizong fell ill.',
    'In month 8 of Yongzheng 13, on dinghai day, Yongzheng took ill.',
  ],
  s0015: [
    'At the time the court was staying at the Old Summer Palace; the Emperor and Prince He Hongzhou attended him day and night with care.',
    'At Yuanmingyuan, Hongli and Prince He Hongzhou kept constant vigil at his bedside.',
  ],
  s0016: [
    'On day wuzi, as Shizong\'s illness grew critical, Prince Zhuang Yunlu, Prince Guo Yunli, Grand Secretaries Ortai and Zhang Tingyu, chief chamberlain Fengsheng\'e, Neqin, and inner chamberlain Haiwang of the Board of Revenue were summoned to receive his deathbed charge.',
    'On wuzi day, dying Yongzheng summoned Yunlu, Yunli, Ortai, Zhang Tingyu, Fengsheng\'e, Neqin, and Haiwang for his final instructions.',
  ],
  s0017: [
    'On day jichou he died.',
    'On jichou day Yongzheng died.',
  ],
  s0018: [
    'The princes and ministers asked that the late Emperor\'s coffin be escorted back to the palace.',
    'Ministers asked to bring the late emperor\'s coffin back to the Forbidden City.',
  ],
  s0019: [
    'Prince Zhuang Yunlu and the others opened the sealed document establishing the heir from the first year of Yongzheng, proclaimed the edict, and Hongli at once took the throne.',
    'Yunlu opened Yongzheng\'s sealed heir choice; Hongli was proclaimed and ascended.',
  ],
  s0020: [
    'Soon an edict ordered obedience to the late Emperor\'s testament: Prince Zhuang Yunlu, Prince Guo Yunli, Ortai, and Zhang Tingyu were to assist in government; Ortai was also ordered to resume duty, as he had asked leave on grounds of illness.',
    'Hongli followed Yongzheng\'s will: Yunlu, Yunli, Ortai, and Zhang Tingyu would rule jointly; Ortai returned from sick leave.',
  ],
  s0021: [
    'By the testament his birth mother was honored as Empress Dowager; by a further edict Consort Yuan was made Empress.',
    'His mother became Empress Dowager; Consort Yuan was raised to Empress.',
  ],
  s0022: [
    'Grand Secretary Zhu Shi was summoned to the capital.',
    'Zhu Shi was recalled to Beijing.',
  ],
  s0023: [
    'Grand Secretary Ji Zengyun was ordered to oversee Zhejiang seawall works; Zhao Hong\'en was made acting Jiangnan canal governor-general.',
    'Ji Zengyun took charge of Zhejiang seawalls; Zhao Hong\'en acted as Jiangnan canal governor-general.',
  ],
  s0024: [
    'When the late Emperor was placed in the coffin, the south wing of the Palace of Heavenly Purity was ordered to serve as the mourning lodge.',
    'Yongzheng\'s coffin was prepared; the south wing of Qianqing became the mourning lodge.',
  ],
  s0025: [
    'On day gengyin the regent princes were ordered to deliberate the three-year mourning.',
    'On gengyin day, regents were told to plan the three-year mourning.',
  ],
  s0026: [
    'Prince of the Commandery Yunxiang was ordered temporarily to manage the Board of Rites.',
    'Yunxiang was put in temporary charge of the Board of Rites.',
  ],
  s0027: [
    'Zhang Zhao was summoned to the capital; Zhang Guangsi was ordered to manage Miao frontier affairs; Grand Secretary Mai Zhu acted as Huguang governor-general.',
    'Zhang Zhao was recalled; Zhang Guangsi took the Miao command; Mai Zhu acted at Huguang.',
  ],
  s0028: [
    'An edict ordered General Cha Lang\'a to garrison at Jiuquan and share military affairs with Liu Yuyi; the Northern Route Grand General, Prince of the Commandery Fu Peng, was to hold firm.',
    'Cha Lang\'a was posted to Jiuquan with Liu Yuyi; Fu Peng was told to hold the northern line.',
  ],
  s0029: [
    'Generals Ha Yuansheng and others were ordered to suppress and pacify the Miao frontier.',
    'Ha Yuansheng and others were ordered to fight and pacify the Miao.',
  ],
  s0030: [
    'On day guisi the late Emperor\'s testament edict was promulgated.',
    'On guisi day Yongzheng\'s death edict was issued.',
  ],
  s0031: [
    'Ninth month, day dingyou, new moon: there was a solar eclipse.',
    'On the first of the ninth month, dingyou day, the sun was eclipsed.',
  ],
  s0032: [
    'Gao Qi and Xiande were both dismissed but retained ministerial rank.',
    'Gao Qi and Xiande left office but kept minister titles.',
  ],
  s0033: [
    'Ortai was ordered to manage the Board of War; Prince Guo Yunli the Board of Punishments; Prince Zhuang Yunlu the Board of Works; Gan Rulai was made Han Chinese Minister of War; Fu Nai acted as Manchu Minister of War.',
    'Ortai took War; Yunli Punishments; Yunlu Works; Gan Rulai and Fu Nai headed the two War ministries.',
  ],
  s0034: [
    'On day jihai the Emperor acceded at the Hall of Supreme Harmony; the following year was taken as the first year of Qianlong.',
    'On jihai day Hongli ascended at Taihedian; the next year began Qianlong.',
  ],
  s0035: [
    'On day gengzi the three-year mourning was fixed, and the ministers\' request to shorten mourning from years to days was refused.',
    'On gengzi day he upheld full three-year mourning and rejected shortening it to twenty-seven days.',
  ],
  s0036: [
    'Grand Secretary Zhu Shi was ordered to assist the regent princes in managing affairs.',
    'Zhu Shi was ordered to assist the regent council.',
  ],
  s0037: [
    'On day xinyou Shi Yizhi was summoned to the capital.',
    'On xinyou day Shi Yizhi was recalled to Beijing.',
  ],
  s0038: [
    'On day renyin the presentation of tribute goods was halted.',
    'On renyin day provincial tribute offerings were stopped.',
  ],
  s0039: [
    'Monks who strolled the Inner Court soliciting alms were forbidden.',
    'Soliciting monks in the Inner Court were banned.',
  ],
  s0040: [
    'The calendar for the first year of Qianlong was issued.',
    'The Qianlong 1 calendar was promulgated.',
  ],
  s0041: [
    'Qianlong tongbao cash was cast.',
    'New Qianlong coinage was minted.',
  ],
  s0042: [
    'Officials were dispatched to proclaim the accession in Korea.',
    'Envoys announced the new reign in Korea.',
  ],
  s0043: [
    'On day bingchen relief was given for drought in Lanzhou, Pingliang, and other places in Gansu.',
    'On bingchen day drought relief was ordered for Gansu.',
  ],
  s0044: [
    'On day bingwu Qing Fu was ordered to the Northern Route army to relieve Fu Peng on his return.',
    'On bingwu day Qing Fu went north to replace the returning Fu Peng.',
  ],
  s0045: [
    'By the Emperor\'s own brush an edict told the imperial son-in-law Tsewang not to leave the camp.',
    'Hongli personally ordered Tsewang to remain with the army.',
  ],
  s0046: [
    'On day dingwei the late Emperor\'s coffin was installed at the Yonghe Palace.',
    'On dingwei day Yongzheng\'s coffin was placed at Yonghe gong.',
  ],
  s0047: [
    'On day wushen the Emperor went to the Yonghe Palace to perform rites.',
    'On wushen day Hongli paid rites at Yonghe.',
  ],
  s0048: [
    'From this day until day yimao it was made the regular practice.',
    'He did the same each day through yimao.',
  ],
  s0049: [
    'On day jiyou Prince Zhuang Yunlu and Prince Guo Yunli were granted double salary; Ortai and Zhang Tingyu hereditary first-rank Colonel of the Chariots; Zhu Shi hereditary Captain.',
    'On jiyou day Yunlu and Yunli received double stipends; Ortai and Zhang Tingyu, hereditary colonels; Zhu Shi, hereditary captain.',
  ],
  s0050: [
    'On day gengxu Yang Mingshi was summoned to the capital.',
    'On gengxu day Yang Mingshi was recalled.',
  ],
  s0051: [
    'On day xinhai Haiwang was ordered to act as Minister of Revenue; Fu Nai to act as Minister of Punishments.',
    'On xinhai day Haiwang acted at Revenue; Fu Nai at Punishments.',
  ],
  s0052: [
    'On day yimao the Emperor went to the Yonghe Palace to perform the great mourning sacrifice.',
    'On yimao day he offered the great mourning rite at Yonghe.',
  ],
  s0053: [
    'The Empress Dowager was installed at the Palace of Eternal Benevolence.',
    'The Empress Dowager moved to Yongren Palace.',
  ],
  s0054: [
    'That day the Emperor moved his residence to the Hall of Mental Cultivation.',
    'The same day Hongli took up residence in the Hall of Mental Cultivation.',
  ],
  s0055: [
    'Court ministers were ordered to submit memorials in rotation, each recommending persons he knew.',
    'Officials were told to report in turn and recommend talent.',
  ],
  s0056: [
    'On day wuwu Li Fu was granted vice-ministerial rank and ordered to manage the three treasuries of the Board of Revenue.',
    'On wuwu day Li Fu received vice-minister rank and the Revenue treasuries.',
  ],
  s0057: [
    'On day jiwei the Emperor went before the late Emperor\'s coffin at the Yonghe Palace to perform the monthly sacrifice.',
    'On jiwei day he offered the monthly rite before the coffin at Yonghe.',
  ],
  s0058: [
    'From then until the coffin was moved, the same was done each month.',
    'Monthly rites continued until the coffin was transferred.',
  ],
  s0059: [
    'The people\'s overdue poll and land taxes were again remitted, and an edict also remitted amounts officials had embezzled.',
    'Arrears in poll and land tax were forgiven again, including sums officials had skimmed.',
  ],
  s0060: [
    'When Fu Erdan was imprisoned.',
    'Fu Erdan was sent to prison.',
  ],
  s0061: [
    'On day gengshen the special provincial and metropolitan examinations of grace were opened.',
    'On gengshen day the enke provincial and metropolitan exams began.',
  ],
  s0062: [
    'Quota taxes were remitted for Guizhou prefectures and counties that had been disturbed; where undisturbed, collection was suspended.',
    'War-ravaged Guizhou counties were exempted from quota tax; peaceful ones had levies halted.',
  ],
  s0063: [
    'On day xinyou the Emperor went to Tiancun to offer sacrifice before the coffin of Empress Xiaojing.',
    'On xinyou day he sacrificed before Empress Xiaojing\'s coffin at Tiancun.',
  ],
  s0064: [
    'Because there was much cheating in this year\'s provincial examination, examiners Gu Zuzhen and Dai Han were arrested and punished.',
    'Exam fraud led to the arrest of provincial examiners Gu Zuzhen and Dai Han.',
  ],
  s0065: [
    'Grand Secretary Ma Qi asked to retire; permission was granted.',
    'Ma Qi retired with approval.',
  ],
  s0066: [
    'On day guihai acting Hedong salt intendant Sun Jiagan was summoned to the capital to be used as a vice minister.',
    'On guihai day Sun Jiagan was recalled from salt duty for a vice-minister post.',
  ],
  s0067: [
    'Winter, tenth month, day bingyin, new moon: sacrifice at the Imperial Ancestral Temple; Prince Yu Guangbao was ordered to perform it in the Emperor\'s stead.',
    'On the first of the tenth month, the ancestral offering was delegated to Prince Yu Guangbao.',
  ],
  s0068: [
    'Vice general Changde was ordered to proceed to the Northern Route army.',
    'Changde was sent to the northern front.',
  ],
  s0069: [
    'On day dingmao tribute from the provinces was again forbidden.',
    'On dingmao day provincial tribute was banned again.',
  ],
  s0070: [
    'Zhang Guangsi was made coordinator of the Miao campaign; Generals Ha Yuansheng and Dong Fang and those below were all placed under his command.',
    'Zhang Guangsi became Miao campaign coordinator over Ha Yuansheng, Dong Fang, and subordinates.',
  ],
  s0071: [
    'On day gengwu Prince of the Commandery Yunxiang was ordered to manage the Board of Rites; former Minister Tu Tianxiang was summoned to the capital.',
    'On gengwu day Yunxiang took Rites; Tu Tianxiang was recalled.',
  ],
  s0072: [
    'On day xinwei Ren Lanzhi was made Minister of Rites.',
    'On xinwei day Ren Lanzhi became Minister of Rites.',
  ],
  s0073: [
    'On day renshen canal grain reed levies and school rents and miscellaneous taxes in Jiangnan and other provinces were remitted.',
    'On renshen day Jiangnan canal surcharges and school levies were forgiven.',
  ],
  s0074: [
    'An order was issued to try Zeng Jing and Zhang Xi for their crimes.',
    'Zeng Jing and Zhang Xi were ordered brought to trial.',
  ],
  s0075: [
    'Left Censor-in-Chief Fu Min was promoted to Grand Guardian of the Heir Apparent.',
    'Fu Min was raised to Grand Guardian of the Heir Apparent.',
  ],
  s0076: [
    'Because the prince-ministers were dilatory and lax in conducting affairs, an edict admonished them to be strict and vigorous and not to run counter to the intent to use leniency.',
    'Hongli rebuked slow, slack regents: be firm and alert, not lax in the name of mercy.',
  ],
  s0077: [
    'Xu Ben was transferred to Minister of Punishments; Tu Tianxiang to Minister of Works.',
    'Xu Ben took Punishments; Tu Tianxiang, Works.',
  ],
  s0078: [
    'On day bingzi Liu Le was made Zhili canal governor-general.',
    'On bingzi day Liu Le became Zhili canal governor-general.',
  ],
  s0079: [
    'On day dingchou Peng Weixin was recalled as Left Censor-in-Chief.',
    'On dingchou day Peng Weixin returned as Left Censor-in-Chief.',
  ],
  s0080: [
    'Xu Ben was ordered to serve at the Grand Council.',
    'Xu Ben was assigned to the Grand Council.',
  ],
  s0081: [
    'On day guimao princes\' concurrent management of boards and ministries was halted.',
    'On guimao day princes ceased concurrently heading ministries.',
  ],
  s0082: [
    'On day jiashen Haiwang was appointed Minister of Revenue.',
    'On jiashen day Haiwang became Minister of Revenue.',
  ],
  s0083: [
    'On day jichou Laibao was ordered to act as Minister of Works and concurrently to manage the Imperial Household Department.',
    'On jichou day Laibao acted at Works and the Imperial Household.',
  ],
  s0084: [
    'On day guisi Fu Erdan, Yue Zhongqi, Shi Yuncong, and Ma Lantai were sentenced to death.',
    'On guisi day Fu Erdan, Yue Zhongqi, Shi Yuncong, and Ma Lantai received death sentences.',
  ],
  s0085: [
    'On day jiawu Neqin, Haiwang, and Xu Ben were changed to assistants in managing grand affairs; Nayantai was ordered to attend, following the precedent of Bandi and others.',
    'On jiawu day Neqin, Haiwang, and Xu Ben became assistant regents; Nayantai joined council duty like Bandi.',
  ],
  s0086: [
    'Fengsheng\'e and Manghuli were dismissed.',
    'Fengsheng\'e and Manghuli left office.',
  ],
  s0087: [
    'On day gengzi Zhang Zhao was imprisoned for trial.',
    'On gengzi day Zhang Zhao was jailed for investigation.',
  ],
  s0088: [
    'On day renyin fifteen tusi of Zhongdong and other districts in Hubei were converted to direct rule; one prefecture and five counties were established, with the prefectural seat at Enshi named Shinan Prefecture, and counties named Xuan\'en, Laifeng, Xianfeng, and Lichuan.',
    'On renyin day fifteen Hubei tusi were abolished for counties under the new Shinan prefecture at Enshi.',
  ],
  s0089: [
    'On day yisi an edict admonished those who recommended candidates for the Erudite Literati examination.',
    'On yisi day Hongli cautioned scholars recommending Erudite Literati candidates.',
  ],
  s0090: [
    'On day dingwei the late Emperor was given the posthumous title Respecter of Heaven, Prosperous Fortune, Establishing the Mean, Manifesting Correctness, Civil and Martial Brilliance, Broad Benevolence, Faith and Resolution, Great Filiality, Utmost Sincerity, and Sagely, with temple name Shizong; the next day an edict of general grace was issued with distinctions.',
    'On dingwei day Yongzheng received his posthumous title and temple name Shizong; amnesty followed next day.',
  ],
  s0091: [
    'Quota taxes were remitted for Baxian and other drought-stricken districts in Sichuan.',
    'Sichuan drought counties including Baxian were exempted from quota tax.',
  ],
  s0092: [
    'On day wushen Mai Zhu was summoned to the capital; Shi Yizhi acted as Huguang governor-general.',
    'On wushen day Mai Zhu was recalled; Shi Yizhi acted at Huguang.',
  ],
  s0093: [
    'On day gengxu Sun Jiagan was made Left Censor-in-Chief.',
    'On gengxu day Sun Jiagan became Left Censor-in-Chief.',
  ],
  s0094: [
    'On day guichou Qing Fu was ordered to be Pacification General on the Border and to proceed to the Northern Route army.',
    'On guichou day Qing Fu became border pacification general and went north.',
  ],
  s0095: [
    'Sun Jiagan was ordered still to manage the Board of Personnel concurrently.',
    'Sun Jiagan kept concurrent charge of Personnel.',
  ],
  s0096: [
    'An edict pardoned crimes of Miao who had surrendered.',
    'Surrendered Miao were pardoned.',
  ],
  s0097: [
    'Surcharges within three years in Guizhou were remitted.',
    'Guizhou surcharges for three years were forgiven.',
  ],
  s0098: [
    'On day bingchen at Tiancun the late Empress was given the honorific title Respectful, Filial, Congenial, Gracious, Compliant, Bright, Favoring, Assisting Heaven, and Supporting Sagely; the next day an edict of general grace was issued with distinctions.',
    'On bingchen day Empress Xiaojing received her full posthumous title at Tiancun; amnesty followed next day.',
  ],
  s0099: [
    'The Hedong governor-generalship was changed back to the Henan governorship; Fu De was appointed.',
    'Hedong was downgraded to Henan governorship under Fu De.',
  ],
  s0100: [
    'On day dingsi Zhong Bao was appointed Hunan governor; Yu Zhaoyue Jiangxi governor.',
    'On dingsi day Zhong Bao took Hunan and Yu Zhaoyue Jiangxi.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b01.mjs <translation.json>'
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
