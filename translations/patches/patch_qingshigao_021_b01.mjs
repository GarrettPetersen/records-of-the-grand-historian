#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Muzong Emperor, entitled Jitian Kaiyun Shouzhong Juzheng Baoda Dinggong Shengzhi Chengxiao Xinmin Gongkuan Yi, taboo name Zaichun, was the Wenzong Emperor\'s eldest son. His mother was Empress Xiaojinxian of the Niohuru clan. On the twenty-third day of the third month in the sixth year of Xianfeng he was born at the Palace of Gathered Elegance.',
    'Muzong Emperor Zaichun, Wenzong\'s eldest son, was born third month 23, Xianfeng 6, at Chuxiu Palace; his mother was Empress Xiaojinxian Niohuru.',
  ],
  s0002: [
    'In the eleventh year he began study; Compiler Li Hongzao was appointed tutor.',
    'In year 11 he began lessons under Compiler Li Hongzao.',
  ],
  s0003: [
    'Seventh month: the Wenzong Emperor was unwell; on day renyin his illness became grave; the Ministers of the Imperial Presence Zaiyuan, Duanhua, Jingshou, and Sushun and Grand Councilors Mukedeng, Kuang Yuan, Du Han, and Jiao Youying were summoned and instructed to proclaim him Crown Prince.',
    'In month 7, renyin, a dying Wenzong named Zaichun crown prince before Zaiyuan, Duanhua, Jingshou, Sushun, and the Grand Council.',
  ],
  s0004: [
    'Zaiyuan, Duanhua, Jingshou, Sushun, Mukedeng, Kuang Yuan, Du Han, and Jiao Youying were ordered to assist in government affairs.',
    'Those eight were ordered to assist the regency.',
  ],
  s0005: [
    'On day guimao the Wenzong Emperor died; Chen Fuen and Wen Yu were summoned to the traveling palace.',
    'On guimao Wenzong died and Chen Fuen and Wen Yu were called to the traveling palace.',
  ],
  s0006: [
    'On day jiachen the Empress and the Sacred Mother were both honored as Empress Dowager.',
    'On jiachen the Empress and Sacred Mother both became empresses dowager.',
  ],
  s0007: [
    'An edict ordered the Grand Council to endorse memorials after the signature 「Regent Princes Assisting Government.」',
    'Memorials were told to bear the regents\' endorsement on Grand Council slips.',
  ],
  s0008: [
    'On day yisi, Prince Dun, Prince Gong, Prince Chun of the commandery, Prince Zhong of the commandery, and Prince Fu of the commandery were exempted from ordinary summons to audience and from bowing at banquets and rewards.',
    'On yisi the five princes were spared routine audiences and ceremonial bows at feasts.',
  ],
  s0009: [
    'Tribute of local products from the provinces was stopped.',
    'Provincial tribute goods were halted.',
  ],
  s0010: [
    'On day bingwu the Shuntian civil provincial examination was postponed to the ninth month; the grace-cycle military metropolitan examination to the tenth; and the Shuntian military provincial examination to the eleventh.',
    'On bingwu Shuntian exams were rescheduled: civil provincial to month 9, grace military metropolitan to 10, military provincial to 11.',
  ],
  s0011: [
    'Luo Bingzhang was made Sichuan governor-general to supervise military affairs.',
    'Luo Bingzhang became Sichuan governor-general for the war.',
  ],
  s0012: [
    'Yunnan-Guizhou Governor-General Liu Yuanhao was summoned to the capital; Fu Ji replaced him.',
    'Liu Yuanhao was recalled to Beijing and Fu Ji took Yunnan-Guizhou.',
  ],
  s0013: [
    'Chong Shi was made Chengdu general; he was soon ordered to assist in Sichuan military affairs.',
    'Chong Shi became Chengdu general and soon joined Sichuan command.',
  ],
  s0014: [
    'Hubei government troops recovered Wuchang, Xianning, Tongcheng, and other counties and Yining subprefecture in Jiangxi.',
    'Hubei troops retook Wuchang, Xianning, Tongcheng, and Jiangxi\'s Yining.',
  ],
  s0015: [
    'On day wushen, Jing Wen was made Commissioner for Tibetan Affairs in Tibet.',
    'On wushen day Jing Wen became Tibet commissioner.',
  ],
  s0016: [
    'On day jiyou, Prince Gong was permitted to go to the traveling palace to pay respects before the late Emperor\'s coffin.',
    'On jiyou day Prince Gong was allowed to mourn at the traveling palace.',
  ],
  s0017: [
    'On day gengxu, Xue Huan requested recruiting merchants to trial-transport Huai salt to aid pay.',
    'On gengxu day Xue Huan proposed merchant trial runs of Huai salt for supplies.',
  ],
  s0018: [
    'The proposal was approved for implementation.',
    'The plan was approved.',
  ],
  s0019: [
    'On day xinhai, Guangdong rebels took Ji\'an.',
    'On xinhai day Guangdong rebels seized Ji\'an.',
  ],
  s0020: [
    'Guangxi government troops recovered Binzhou.',
    'Guangxi troops retook Binzhou.',
  ],
  s0021: [
    'On day guichou, posthumous honorific titles were added for the Xuanzong Emperor and Empress.',
    'On guichou day Xuanzong and his empress received added posthumous titles.',
  ],
  s0022: [
    'On day jiayin, Guangdong rebels took Jing\'an, Wuning, and Yining in the various prefectures and counties.',
    'On jiayin day Guangdong rebels seized Jing\'an, Wuning, and Yining.',
  ],
  s0023: [
    'On day yimao the reign title Qixiang was fixed.',
    'On yimao day the era name Qixiang was proclaimed.',
  ],
  s0024: [
    'Eighth month, new moon on day dingsi: the sun and moon joined in splendor and the five planets aligned.',
    'At the eighth-month new moon, dingsi, sun and moon conjoined and the five planets aligned.',
  ],
  s0025: [
    'Guangdong rebels took Yanzhou but soon it was recovered.',
    'Guangdong rebels took Yanzhou but troops soon retook it.',
  ],
  s0026: [
    'On day wuwu, government troops recovered Xinchang, Fengxin, Ruizhou, and Shanggao.',
    'On wuwu day troops retook Xinchang, Fengxin, Ruizhou, and Shanggao.',
  ],
  s0027: [
    'On day jiwei, Jing Lian was ordered to go to Yarkand to investigate Ying Yun\'s extortion of money and unauthorized killings.',
    'On jiwei day Jing Lian was sent to Yarkand to investigate Ying Yun.',
  ],
  s0028: [
    'At Zeng Guofan\'s request, existing steamships at Shanghai were sent to the Anhui River for his army to drill on.',
    'Zeng Guofan\'s request was granted: Shanghai steamers went to the Anhui River for training.',
  ],
  s0029: [
    'On day xinyou, Hubei government troops recovered De\'an.',
    'On xinyou day Hubei troops retook De\'an.',
  ],
  s0030: [
    'On day renxu, Jiangxi government troops recovered Wuning and Jing\'an.',
    'On renxu day Jiangxi troops retook Wuning and Jing\'an.',
  ],
  s0031: [
    'On day guihai the late Emperor\'s testamentary edict was promulgated.',
    'On guihai day the late Emperor\'s death edict was issued.',
  ],
  s0032: [
    'Sheng Bao\'s army recovered Puzhou.',
    'Sheng Bao\'s troops retook Puzhou.',
  ],
  s0033: [
    'On day dingmao, Nian bandits crossed the Grand Canal; Sheng Bao and Sengge Rinchen and others were ordered to intercept and suppress them and not let them flee north.',
    'On dingmao day Nian bandits crossed the canal; Sheng Bao and Sengge Rinchen were told to cut them off and block a northern breakout.',
  ],
  s0034: [
    'On day wuchen, Hu Linyi begged leave for illness; Li Xuyi was ordered to act as Hubei governor.',
    'On wuchen day Hu Linyi took sick leave and Li Xuyi acted as Hubei governor.',
  ],
  s0035: [
    'On day gengwu, Censor Dong Yuanchun requested that the Empress Dowager temporarily handle state affairs and that one or two imperial princes be chosen to assist.',
    'On gengwu day Dong Yuanchun asked the empresses dowager to rule and princes to assist.',
  ],
  s0036: [
    'Zaiyuan and the others drafted an edict to rebuke and reprimand him.',
    'Zaiyuan\'s faction drafted a rebuking edict.',
  ],
  s0037: [
    'On day jiaxu, Zeng Guoquan\'s army recovered Anqing.',
    'On jiaxu day Zeng Guoquan retook Anqing.',
  ],
  s0038: [
    'On day wuyin, Guangxi government troops recovered Xunzhou.',
    'On wuyin day Guangxi troops retook Xunzhou.',
  ],
  s0039: [
    'On day gengchen, Sichuan fan bandits took Songpan.',
    'On gengchen day Sichuan frontier bandits seized Songpan.',
  ],
  s0040: [
    'On day xinsi, for merit in recovering Anqing, Guan Wen and Zeng Guofan were promoted to Junior Guardian of the Heir Apparent; Hu Linyi to Grand Guardian of the Heir Apparent, all with hereditary Chief Commandant of Cavalry rank; Li Xuyi was rewarded with a yellow riding jacket; Yang Zaifu and Duolong\'a received hereditary Cloud Cavalry Captain rank.',
    'On xinsi day Anqing honors raised Guan Wen and Zeng Guofan to Junior Guardian, Hu Linyi to Grand Guardian, with hereditary ranks; Li Xuyi got a yellow jacket; Yang Zaifu and Duolong\'a got Cloud Cavalry Captain inheritances.',
  ],
  s0041: [
    'On day guimao the late Emperor\'s posthumous title was fixed as Xietian Yiyun Zhizhong Chui Mo Maode Zhenwu Shengxiao Yuan Gong Duanren Kuanmin Xian, with temple name Wenzong.',
    'On guimao day the late Emperor became Wenzong, posthumously Xietian Yiyun Zhizhong Chui Mo Maode Zhenwu Shengxiao Yuan Gong Duanren Kuanmin Xian.',
  ],
  s0042: [
    'Miao Peilin took Zhengyang and Huoqiu and besieged Shouzhou.',
    'Miao Peilin seized Zhengyang and Huoqiu and besieged Shouzhou.',
  ],
  s0043: [
    'Ninth month, new moon on day bingxu: the Empress Dowager Mother was given the honorific title Ci\'an; the Sacred Empress Dowager Mother the title Cixi.',
    'At the ninth-month new moon, bingxu, the two empresses dowager received the titles Ci\'an and Cixi.',
  ],
  s0044: [
    'On day xinmao, Yang Zaifu\'s army recovered Chizhou.',
    'On xinmao day Yang Zaifu retook Chizhou.',
  ],
  s0045: [
    'On day renchen, Nian bandits fled to Qishui and Gong county; government troops beat them back.',
    'On renchen day Nian raiders reached Qishui and Gong and were driven off.',
  ],
  s0046: [
    'Zhang Liangji was summoned to the capital.',
    'Zhang Liangji was recalled to Beijing.',
  ],
  s0047: [
    'Jinzhou prefecture suffered an earthquake.',
    'Jinzhou was shaken by an earthquake.',
  ],
  s0048: [
    'On day jiawu, Sichuan troops pacified the Hui rebels at Huili.',
    'On jiawu day Sichuan troops pacified Huili\'s Hui rebels.',
  ],
  s0049: [
    'On day dingyou, Yue Bin and others\' memorial that the Salar Hui rebels had surrendered and government troops should be withdrawn was approved.',
    'On dingyou day Yue Bin\'s report of Salar surrender and troop withdrawal was approved.',
  ],
  s0050: [
    'On day gengzi, Sichuan troops recovered Mingshan.',
    'On gengzi day Sichuan troops retook Mingshan.',
  ],
  s0051: [
    'On day renyin, Duolong\'a, Zeng Guoquan, and others recovered Tongcheng, Susong, Qizhou, Huangmei, and Guangji.',
    'On renyin day Duolong\'a and Zeng Guoquan retook Tongcheng, Susong, Qizhou, Huangmei, and Guangji.',
  ],
  s0052: [
    'Peng Yulin, Cheng Daji, and others recovered Huangzhou.',
    'Peng Yulin and Cheng Daji retook Huangzhou.',
  ],
  s0053: [
    'Hubei Governor Hu Linyi died; Li Xuyi was transferred as Hubei governor, still stationed at the Hubei-Anhui border to supervise military affairs.',
    'Hu Linyi died; Li Xuyi became Hubei governor and stayed on the Hubei-Anhui front.',
  ],
  s0054: [
    'Peng Yulin was promoted to Anhui governor.',
    'Peng Yulin became Anhui governor.',
  ],
  s0055: [
    'On day guimao, Zhejiang government troops recovered Yuqian and Changhua.',
    'On guimao day Zhejiang troops retook Yuqian and Changhua.',
  ],
  s0056: [
    'Guangdong rebels fled to Yanzhou; Zhang Yuliang and others\' armies were routed.',
    'Guangdong rebels raided Yanzhou and routed Zhang Yuliang\'s forces.',
  ],
  s0057: [
    'On day jiachen, England and France withdrew troops stationed at Guangzhou; England withdrew its cavalry stationed at Tianjin.',
    'On jiachen day Britain and France pulled garrisons from Guangzhou and Britain withdrew Tianjin cavalry.',
  ],
  s0058: [
    'On day yisi, Sengge Rinchen pacified the fleeing Nian bands in Qingzhou and elsewhere; his post as Minister of the Imperial Presence and his yellow bridle were restored.',
    'On yisi day Sengge Rinchen crushed Qingzhou Nian bands and regained his court post and yellow bridle.',
  ],
  s0059: [
    'On day wushen, the Emperor escorted the late Emperor\'s coffin back to the capital; land tax was remitted for Chengde and Wanping and their subordinate prefectures and counties.',
    'On wushen day the coffin procession reached the capital road and Chengde and Wanping taxes were remitted.',
  ],
  s0060: [
    'On day jiyou, Miao Peilin rebelled; Yuan Jiasan was ordered to join Jia Zhen and other armies to suppress him.',
    'On jiyou day Miao Peilin turned rebel and Yuan Jiasan was sent with Jia Zhen to crush him.',
  ],
  s0061: [
    'On day jiayin, the Emperor escorted the Empress Dowager Mother and the Sacred Empress Dowager Mother back to the palace.',
    'On jiayin day the two empresses dowager returned to the palace.',
  ],
  s0062: [
    'On day yimao, for altering edicts on their own authority and forcibly blocking regency from behind the curtain, Zaiyuan, Duanhua, and Sushun were removed from office; Jingshou, Mukedeng, Kuang Yuan, Du Han, and Jiao Youying were dismissed from the Grand Council.',
    'On yimao day Zaiyuan, Duanhua, and Sushun were stripped for tampering with edicts and blocking regency; five Grand Councilors were dismissed.',
  ],
  s0063: [
    'Prince Gong was ordered to join Grand Secretaries, the Six Ministries, the Nine Chief Courts, Hanlin, Censorate, and Supervising Secretaries in reporting judgment according to law.',
    'Prince Gong was told to convene the ministries and censorate for legal judgment.',
  ],
  s0064: [
    'Jia Zhen, Zhou Zupe, Shen Zhaolin, and Zhao Guang memorialized that political power should be wielded from above, and also discussed ritual for the Empress Dowager receiving officials and rules for conducting affairs.',
    'Jia Zhen, Zhou Zupe, Shen Zhaolin, and Zhao Guang urged power from the throne and rules for the empress dowager\'s audiences.',
  ],
  s0065: [
    'Sheng Bao memorialized requesting that the Empress Dowager personally administer great affairs and that imperial princes be chosen to assist government.',
    'Sheng Bao asked the empress dowager to rule in person with princes assisting.',
  ],
  s0066: [
    'Princes, grand secretaries, and others were ordered to fix deliberation and report.',
    'Princes and grand secretaries were told to settle policy and report up.',
  ],
  s0067: [
    'Prince Chun of the commandery Yiwan was summoned to the capital.',
    'Prince Chun Yiwan was called to Beijing.',
  ],
  s0068: [
    'That day Zaiyuan, Duanhua, and Sushun were stripped of rank and office and arrested for judgment.',
    'That day Zaiyuan, Duanhua, and Sushun lost rank and were arrested.',
  ],
  s0069: [
    'Prince Rui Renshou and Prince Chun Yiwan were ordered to arrest Sushun and escort him to the capital.',
    'Princes Rui and Chun were sent to seize Sushun and bring him to Beijing.',
  ],
  s0070: [
    'An edict ordered every civil and military yamen from the sixteenth day of the tenth month onward to take turns on daily duty.',
    'From tenth month 16 every yamen would rotate daily duty.',
  ],
  s0071: [
    'Bao Chao\'s army recovered Qianshan.',
    'Bao Chao\'s troops retook Qianshan.',
  ],
  s0072: [
    'That month, the assessed grain tax for Xining and Nianbo, disturbed by raids, was remitted.',
    'That month Xining and Nianbo grain taxes were remitted after disturbance.',
  ],
  s0073: [
    'Winter, tenth month, new moon on day bingchen: Prince Gong Yixin was made Prince Regent and served on the Grand Council; Grand Secretary Gui Liang, Minister of Revenue Shen Zhaolin, Vice Ministers Bao Jun and Wen Xiang were all made Grand Councilors; Junior Director of the Court of Imperial Sacrifices Cao Yuying studied service above the Grand Councilors.',
    'At the tenth-month new moon, bingchen, Yixin became Prince Regent on the Grand Council with Gui Liang, Shen Zhaolin, Bao Jun, and Wen Xiang; Cao Yuying apprenticed above them.',
  ],
  s0074: [
    'Woren, Vice Minister of Revenue for Shengjing, was summoned to the capital.',
    'Shengjing Vice Minister Woren was recalled to Beijing.',
  ],
  s0075: [
    'On day dingsi, an edict sought remonstrance and strictly enforced palace gates.',
    'On dingsi day the throne sought counsel and tightened the gates.',
  ],
  s0076: [
    'On day wuwu the late Emperor\'s coffin reached the capital and was placed in the Palace of Heavenly Purity.',
    'On wuwu day the coffin reached Beijing and rested in Qianqing Palace.',
  ],
  s0077: [
    'On day gengshen, an edict changed Qixiang to Tongzhi.',
    'On gengshen day the era name Qixiang became Tongzhi.',
  ],
  s0078: [
    'On day xinyou, Prince Gong and others drafted a request that Zaiyuan, Duanhua, and Sushun be executed by slicing under the great treason statute.',
    'On xinyou day Prince Gong proposed slicing Zaiyuan, Duanhua, and Sushun for treason.',
  ],
  s0079: [
    'An edict granted Zaiyuan and Duanhua suicide and executed Sushun by beheading; Jingshou, Mukedeng, Kuang Yuan, Du Han, and Jiao Youying were stripped of office; Mukedeng was banished to the military colonies.',
    'Zaiyuan and Duanhua were allowed suicide, Sushun was beheaded, five others were dismissed, and Mukedeng was sent to the colonies.',
  ],
  s0080: [
    'On day renxu, Chen Fuen, Huang Zonghan, Liu Kun, Cheng Qi, De Kejintai, and Fu Ji were stripped of office.',
    'On renxu day Chen Fuen, Huang Zonghan, Liu Kun, Cheng Qi, De Kejintai, and Fu Ji lost their posts.',
  ],
  s0081: [
    'An edict declared that the past would not be pursued and officials should not again request investigation of factional ties.',
    'The court declared no more digging into factions.',
  ],
  s0082: [
    'Princes, civil and military ministers within and without were sternly warned against seizing power and taking bribes.',
    'Princes and ministers were warned against power-grabbing and bribery.',
  ],
  s0083: [
    'On day jiazi the Emperor took the throne at the Hall of Supreme Harmony and received homage.',
    'On jiazi day Zaichun ascended the throne at Taihe Hall and received homage.',
  ],
  s0084: [
    'An edict was issued throughout the realm: the coming year is designated the first year of Tongzhi; favor was extended within and without; crimes not normally covered by a great amnesty were all pardoned.',
    'Edict to the realm: next year is Tongzhi 1, with broad mercy—even crimes beyond usual amnesty were forgiven.',
  ],
  s0085: [
    'Prince Dun, Prince Gong, Prince Chun of the commandery, Prince Zhong of the commandery, and Prince Fu of the commandery were exempted from having their names spoken in edicts and memorials.',
    'The five princes were spared name taboo in edicts and memorials.',
  ],
  s0086: [
    'On day yichou, an empress dowager edict, because material resources were strained, admonished the Imperial Household Department that palace utensils must be handled with strict economy.',
    'On yichou an empress dowager edict told the Household Department to economize palace spending.',
  ],
  s0087: [
    'Sengge Rinchen\'s rank as Prince Boduolerga was restored.',
    'Sengge Rinchen regained his Boduolerga princedom.',
  ],
  s0088: [
    'The Ministry of Punishments was ordered to conclude the Five-Character Banknote case.',
    'The Ministry of Punishments was told to close the Five-Character Banknote case.',
  ],
  s0089: [
    'An edict was sent throughout within and without to clear up miscellaneous prisons.',
    'A general order went out to clean up jails.',
  ],
  s0090: [
    'On day bingyin, Miao Peilin took Shouzhou.',
    'On bingyin day Miao Peilin seized Shouzhou.',
  ],
  s0091: [
    'In the southeast a sound like thunder was heard.',
    'Southeastern skies boomed like thunder.',
  ],
  s0092: [
    'An edict ordered unfinished works at Rehe stopped at once.',
    'Rehe construction was ordered halted immediately.',
  ],
  s0093: [
    'On day dingmao, field commanders in every route were sternly warned against whitewashing delays and letting bandits harm the people.',
    'On dingmao day commanders were warned against cosmetic reports and letting rebels ravage civilians.',
  ],
  s0094: [
    'The grace-cycle military metropolitan examination of Xianfeng 10 was held in supplement.',
    'Xianfeng 10\'s grace military metropolitan exam was held belatedly.',
  ],
  s0095: [
    'On day jisi, Major General Feng Zicai was ordered to supervise Zhenjiang military affairs.',
    'On jisi day Feng Zicai was put in charge at Zhenjiang.',
  ],
  s0096: [
    'On day gengwu, an edict told the Prince Regent and others to manage routine affairs and not shun petty suspicions.',
    'On gengwu day the regent was told to govern without petty grudges.',
  ],
  s0097: [
    'On day renshen, an edict told commanding generals to verify merit and guilt in truth and reward and punish with certainty.',
    'On renshen day commanders were told to judge deeds honestly and reward or punish firmly.',
  ],
  s0098: [
    'On day guiyou, Guangdong rebels took Yanzhou and Yuhang.',
    'On guiyou day Guangdong rebels seized Yanzhou and Yuhang.',
  ],
  s0099: [
    'Zeng Guofan was ordered to oversee military affairs in Jiangsu, Anhui, Jiangxi, and Zhejiang and to control governors, provincial military commanders, and all officials below them;',
    'Zeng Guofan was given Jiangsu, Anhui, Jiangxi, and Zhejiang with power over governors and generals;',
  ],
  s0100: [
    'Ruichang was to assist in Zhejiang military affairs; Junior Director of the Court of Imperial Sacrifices Zuo Zongtang was to go to Zhejiang to suppress bandits and deploy brigade and regimental commanders and officials below them.',
    'Ruichang would assist Zhejiang; Zuo Zongtang would campaign there and command brigade and regimental officers.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b01.mjs <translation.json>'
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
