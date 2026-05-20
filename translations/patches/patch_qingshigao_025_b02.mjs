#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'The matter was sent to the statute-revision legal ministers to deliberate with the Foreign Ministry.',
    'Legal revision ministers were told to meet with foreign affairs on it.',
  ],
  s0102: [
    'On day gengshen, salt-field dues in Renhe and other districts of Zhejiang were remitted.',
    'On gengshen day Zhejiang salt-field taxes in Renhe and elsewhere were forgiven.',
  ],
  s0103: [
    'On day yichou the purpose of implementing preparatory constitutionalism was proclaimed; an edict said: 「The national policy is fixed and the deadline must be met.',
    'On yichou day the court proclaimed constitutional prep: 「The national course is set and must be finished on time.',
  ],
  s0104: [
    'Officials great and small at court and in the provinces must all share this intent and assist the new design.',
    'Every official at court and in the provinces must share that aim and help the new order.',
  ],
  s0105: [
    'Censors and remonstrating officials should also frankly set forth the gains and losses of every new policy.',
    'Censors should speak plainly on what each new policy gains or costs.',
  ],
  s0106: [
    '" (closing quotation mark in the source.) On day dingmao, Xiyan, Qiao Shufang, Liu Tingchen, Wu Shijian, Zhou Ziqi, Lao Naiyuan, Zhao Binglin, Tan Xueheng, and Rongqing, Lu Runxiang, Zhang Yinglin, Tang Jingchong, Baoxi, and Zhu Yifan were ordered to lecture on assigned days.',
    'The edict closed. On dingmao day a roster of tutors was ordered to lecture on rotation.',
  ],
  s0107: [
    'Lecture texts were to be approved by Sun Jianai and Zhang Zhidong.',
    'Sun Jianai and Zhang Zhidong would approve lecture texts.',
  ],
  s0108: [
    'On day gengwu the Constitutional Compilation and Review Office submitted statistical forms.',
    'On gengwu day the constitutional office filed statistical forms.',
  ],
  s0109: [
    'On day jiaxu opium smoking was again forbidden.',
    'On jiaxu day the opium ban was renewed.',
  ],
  s0110: [
    'On day bingzi, silver and grain for disaster villages in Xuanwei prefecture, Yunnan, were remitted.',
    'On bingzi day Xuanwei\'s flooded villages were forgiven tax grain and silver.',
  ],
  s0111: [
    'Intercalary second month, day jiashen: an edict strictly fixed responsibility for preparatory constitutionalism and warned ministry and frontier officials against dragging, perfunctory work, and abandoning duty.',
    'Leap month 2, jiashen: the throne warned ministries and governors not to stall constitutional prep.',
  ],
  s0112: [
    'Because mourning rites and human relations were involved, an edict ordered that henceforth all at court and outside who suffered parents\' mourning, Manchu and Han alike, should leave office and observe the full mourning period.',
    'Henceforth Manchu and Han officials alike must leave office for full parent mourning.',
  ],
  s0113: [
    'Former Grand Secretariat Bachelor Chen Baochen was ordered to direct the Ritual Studies Hall.',
    'Chen Baochen was made head of the Ritual Studies Hall.',
  ],
  s0114: [
    'Wasteland in thirty-two prefectures and counties of Zhejiang including Renhe, and the Hang and Yan guards and three offices, was remitted for land tax, pond tax, and transport silver and grain.',
    'Zhejiang wasteland taxes and transport dues in thirty-two counties were forgiven.',
  ],
  s0115: [
    'On day bingxu Grand Councilor and Grand Secretary Natong mourned his mother; an edict ordered mourning leave withheld, and after a hundred days of filial observance he was to act in his post and still attend council duty.',
    'On bingxu day Natong\'s mother died; he was ordered to keep working through mourning with acting rank after a hundred days.',
  ],
  s0116: [
    'On day wuzi judicial commissioners were placed at Urga.',
    'On wuzi day Urga got judicial commissioners.',
  ],
  s0117: [
    'The new-mine wellhead tax in Guangdong was remitted.',
    'Guangdong\'s new-mine wellhead tax was cut.',
  ],
  s0118: [
    'Preferential posthumous treatment was granted Chen Changyong, artillery battalion commander of Anhui who died in service.',
    'Anhui artillery commander Chen Changyong, killed on duty, received posthumous honors.',
  ],
  s0119: [
    'On day xinmao the Regent Prince held court audience for princes, dukes, and all officials at Wenhua Hall.',
    'On xinmao day the Regent Prince received officials at Wenhua Hall.',
  ],
  s0120: [
    'The post of consul-general at Vladivostok was added.',
    'A consul-general was added at Vladivostok.',
  ],
  s0121: [
    'The Revenue Ministry\'s stamp tax was promulgated.',
    'The Revenue Ministry\'s stamp tax took effect.',
  ],
  s0122: [
    'Provincial fiscal supervisors were established.',
    'Each province got a fiscal supervisor.',
  ],
  s0123: [
    'On day bingshen deputy generals, colonels, brigadiers, commandants, and garrison commanders in Huangzhou, Jingmen, Yunyang, Yichang, Shinan, and De\'an, Hubei, were all cut.',
    'On bingshen day many Hubei military posts from Huangzhou to De\'an were abolished.',
  ],
  s0124: [
    'Envoy Wu Tingfang completed the arbitration treaty with the United States.',
    'Wu Tingfang finished the U.S. arbitration treaty.',
  ],
  s0125: [
    'On day dingyou work on Chongling was undertaken.',
    'On dingyou day Chongling tomb work began.',
  ],
  s0126: [
    'On day wuxu the Aristocratic School of Political Law was founded; Prince Yulang was ordered to direct it.',
    'On wuxu day the Aristocratic School of Political Law opened under Prince Yulang.',
  ],
  s0127: [
    'On day yisi Li Shengchao, a Hui commoner of Guyuan prefecture, Gansu, over a hundred years old, was honored and given an imperial inscribed plaque.',
    'On yisi day centenarian Li Shengchao of Gansu received an imperial plaque.',
  ],
  s0128: [
    'On day jiyou, because the late ruler lay in coffin mourning, the annual New Year audiences of Mongol khans, princes, nobles, lamas, Tibetan khutuktus, Qinghai and Xinjiang notables, and others were stopped from coming to the capital.',
    'On jiyou day mourning canceled the annual New Year visits of frontier nobles and lamas.',
  ],
  s0129: [
    'Third month, day xinhai: Zhejiang patrol and encouragement-of-industry circuits were added.',
    'Month 3, xinhai day: Zhejiang added patrol and industry circuits.',
  ],
  s0130: [
    'On day jiayin the former Henan Governor Li Henian was restored to his original post.',
    'On jiayin day Li Henian regained his old Henan governorship.',
  ],
  s0131: [
    'On day gengshen, by Empress Dowager rescript, the Revenue Ministry\'s annual New Year special payment of two hundred eighty thousand taels was stopped from this year.',
    'On gengshen day the Empress Dowager ended the Revenue Ministry\'s annual 280,000-tael holiday payment.',
  ],
  s0132: [
    'On day xinyou the coffin of the Jing Emperor Dezong was moved to the Lianggezhuang palace at the Western Mausoleum.',
    'On xinyou day Dezong\'s coffin went to Lianggezhuang at the Western Mausoleum.',
  ],
  s0133: [
    'On day jiazi the Steamship Merchants Bureau was placed under the Posts and Communications Ministry.',
    'On jiazi day the Merchants Steamship Bureau moved to the post ministry.',
  ],
  s0134: [
    'On day yichou the Fengtian patrol circuit was again cut.',
    'On yichou day Fengtian\'s patrol circuit was cut again.',
  ],
  s0135: [
    'Defense circuits were added at Taochang and elsewhere and sub-circuit defense posts at Linchanghai and elsewhere.',
    'New defense circuits were added in Manchuria and elsewhere.',
  ],
  s0136: [
    'The Fengtian Jinzhou maritime customs circuit became the Jinzhou defense circuit concurrent customs supervisor; the Eastern Circuit became the Xingfeng defense circuit.',
    'Fengtian customs and eastern circuits were renamed defense circuits.',
  ],
  s0137: [
    'Xingjing Department was raised to Xingjing Prefecture.',
    'Xingjing Department became Xingjing Prefecture.',
  ],
  s0138: [
    'On day bingyin, for the coffin\'s route through Wanping, Liangxiang, Zhuozhou, Fangshan, and Laishui, half this year\'s quota tax was remitted; for Yizhou seven-tenths; and silver was granted to compensate leveling wheat fields at one qian per mu.',
    'On bingyin day counties on the coffin route got tax cuts and silver for ruined wheat fields.',
  ],
  s0139: [
    'On day jisi an edict restored the original posts and granted posthumous titles to the late Ministers Lishan, Xu Yongyi, Vice Minister Xu Jingcheng, Bachelor Lian Yuan, and Director Yuan Chang.',
    'On jisi day the martyred 1900 ministers were restored and given posthumous titles.',
  ],
  s0140: [
    'Army Lieutenant Colonel Wu Luzhen was ordered to supervise Jilin frontier affairs.',
    'Wu Luzhen was put in charge of Jilin frontier affairs.',
  ],
  s0141: [
    'The Shanxi Yanping circuit was cut.',
    'Shanxi\'s Yanping circuit was abolished.',
  ],
  s0142: [
    'On day xinwei the former Foreign Ministry left councillor Yang Shu was appointed envoy minister to Belgium.',
    'On xinwei day Yang Shu became minister to Belgium.',
  ],
  s0143: [
    'Yadong, Gyantse, and Gartok were opened as treaty ports with customs.',
    'Yadong, Gyantse, and Gartok opened as customs ports.',
  ],
  s0144: [
    'On day bingzi Huinan Direct Prefecture in Fengtian was added.',
    'On bingzi day Huinan Direct Prefecture was added in Fengtian.',
  ],
  s0145: [
    'On day wuyin Sichuan Governor Zhao Erxun and Tibet Commissioner Zhao Erfeng aided schools with funds and were commended by the ministries.',
    'On wuyin day Zhao Erxun and Zhao Erfeng were praised for school donations.',
  ],
  s0146: [
    'Zhao Erxun donated his salary to support his clan and was given an imperial plaque reading "Deep kinship duty."',
    'Zhao Erxun\'s clan support won an imperial "Deep kinship duty" plaque.',
  ],
  s0147: [
    'Summer, fourth month, day gengchen: because foreign envoys came to offer condolences, Prince Guo rank Zaizhen was sent to Japan and Law Minister Dai Hongci to Russia to return thanks; other countries were handled by resident ministers.',
    'Month 4, gengchen: Zaizhen went to Japan and Dai Hongci to Russia to thank condolence missions; other states used resident ministers.',
  ],
  s0148: [
    'On day jiashen the Revenue Ministry established a currency investigation bureau and cast circulating silver coin.',
    'On jiashen day a currency bureau was set up and silver coin minted.',
  ],
  s0149: [
    'On day yiyou arrears from Guangxu years 14 through 33 in the provinces were broadly remitted.',
    'On yiyou day tax arrears from Guangxu 14–33 were broadly forgiven.',
  ],
  s0150: [
    'On day guisi deputy commanders at Hunchun, Sanxing, Ningguta, Boduna, and Alechuka in Jilin were all cut.',
    'On guisi day five Jilin deputy commanders were abolished.',
  ],
  s0151: [
    'Hunchun and Sanxing defense circuits were established.',
    'Hunchun and Sanxing got defense circuits.',
  ],
  s0152: [
    'Suifen, Yanji, Wuchang, Shuangcheng, Binzhou, Linjiang, and other prefectures, Yitong Direct Prefecture, Yushu Direct Department, Baoqing and Suiyuan prefectures, Hunchun, Binjiang, and Dongning departments, and Fuxin, Muling, Helong, Huachuan, Linhu, Wangqing, and E\'mu counties were raised, changed, or newly established.',
    'Many Jilin prefectures, departments, and counties were created or upgraded.',
  ],
  s0153: [
    'Soon after, Shulan, Acheng, Boli, and Raohe counties were restored.',
    'Shulan, Acheng, Boli, and Raohe counties were soon restored.',
  ],
  s0154: [
    'On day jiawu the Grand Secretariat, ministries, Hanlin, and censorate were ordered to confer on the great rite of elevating Dezong to the ancestral temple.',
    'On jiawu day offices were told to plan Dezong\'s ancestral temple elevation.',
  ],
  s0155: [
    'On day yiwei prayers were offered for rain.',
    'On yiwei day the court prayed for rain.',
  ],
  s0156: [
    'On day bingshen disasters struck Lanzhou, Liangzhou, Gongchang, Nianbo, and Huining in Gansu; sixty thousand taels were issued for relief.',
    'On bingshen day sixty thousand taels relieved Gansu disasters.',
  ],
  s0157: [
    'On day renyin Fengtian left and right councillors and the Announcement and Deliberation offices were cut.',
    'On renyin day Fengtian councillors and two offices were cut.',
  ],
  s0158: [
    'On day jiachen prayers for rain were offered again.',
    'On jiachen day the court prayed for rain again.',
  ],
  s0159: [
    'On day wushen the opium prohibition ministers were instructed to examine in earnest and not show favoritism or perfunctory work.',
    'On wushen day opium commissioners were told to enforce the ban without favoritism.',
  ],
  s0160: [
    'Provincial civil and military official schools were charged to governors, generals, and commanders for strict prohibition.',
    'Governors and generals were to enforce bans in provincial official schools.',
  ],
  s0161: [
    'Fifth month, new moon on day jiyou: there was an eclipse of the sun.',
    'Month 5, jiyou new moon: a solar eclipse occurred.',
  ],
  s0162: [
    'On day xinhai the palace examination was held for returned-student jinshi including Huang Dezhang, one hundred twenty persons; offices were granted by grade.',
    'On xinhai day 120 returned-student jinshi including Huang Dezhang passed the palace exam and received ranks.',
  ],
  s0163: [
    'On day renzi Yu Shimei said the provincial deliberative assembly regulations did not match the Prussian local parliament system.',
    'On renzi day Yu Shimei said provincial assembly rules diverged from Prussia\'s.',
  ],
  s0164: [
    'The matter was sent to the Constitutional Compilation and Review Office for proper deliberation.',
    'The constitutional office was told to review it.',
  ],
  s0165: [
    'On day guichou Chen Qitai died; Rui Cheng was made Jiangsu Governor.',
    'On guichou day Chen Qitai died and Rui Cheng became Jiangsu governor.',
  ],
  s0166: [
    'Zhejiang gentry were permitted to build temples at West Lake to the late Ministers Xu Yongyi and Xu Jingcheng and Director Yuan Chang.',
    'Zhejiang gentry were allowed West Lake shrines to the 1900 martyred ministers.',
  ],
  s0167: [
    'On day jiayin prayers for rain were offered again.',
    'On jiayin day the court prayed for rain again.',
  ],
  s0168: [
    'Shaanxi-Gansu Governor Sheng Yun was dismissed for memorializing on constitutional pros and cons; Chang Geng replaced him.',
    'Sheng Yun was removed as Shaanxi-Gansu governor for his constitutional memorial; Chang Geng replaced him.',
  ],
  s0169: [
    'On day yimao Guangfu was ordered to act as Ili General.',
    'On yimao day Guangfu acted as Ili general.',
  ],
  s0170: [
    'On day dingsi Lianyu and Wen Zongyao memorialized on training troops and founding schools in Tibet.',
    'On dingsi day Lianyu and Wen Zongyao reported on Tibetan troops and schools.',
  ],
  s0171: [
    'On day jiwei Shixu was ordered to act as joint foreign minister.',
    'On jiwei day Shixu acted as joint foreign minister.',
  ],
  s0172: [
    'Yang Shixiang died; Duan Fang became Zhili Governor and trade minister, Zhang Renjun became Liangjiang Governor and trade minister, and Sun Baoqi acted as Shandong Governor.',
    'Yang Shixiang died; Duan Fang took Zhili, Zhang Renjun took Liangjiang, Sun Baoqi acted in Shandong.',
  ],
  s0173: [
    'On day xinyou, because Chaya had formerly belonged to Sichuan, it was ordered placed under the frontier affairs commissioner.',
    'On xinyou day Chaya was put under the frontier commissioner as former Sichuan territory.',
  ],
  s0174: [
    'On day jiazi the Agriculture, Industry, and Commerce Ministry was urged to press each province to promote agriculture, forestry, and crafts.',
    'On jiazi day provinces were urged to expand agriculture, forestry, and industry.',
  ],
  s0175: [
    'On day yichou prayers for rain were offered again.',
    'On yichou day the court prayed for rain again.',
  ],
  s0176: [
    'That day it rained.',
    'Rain fell that day.',
  ],
  s0177: [
    'On day wuchen the former joint grand secretary and Revenue Minister Weng Tonghe was restored to his original post.',
    'On wuchen day Weng Tonghe regained his old rank.',
  ],
  s0178: [
    'On day jisi Tang Shaoyi was removed as Fengtian Governor and kept as vice minister on reserve.',
    'On jisi day Tang Shaoyi left Fengtian governorship for vice-minister reserve.',
  ],
  s0179: [
    'On day xinwei the Office for Study in America was established.',
    'On xinwei day the Office for Study in America was founded.',
  ],
  s0180: [
    'On day guiyou Henan\'s camp organization was reorganized.',
    'On guiyou day Henan reorganized its camps.',
  ],
  s0181: [
    'On day jiaxu Nanning prefecture, Yunnan, earthquake victims were relieved.',
    'On jiaxu day Yunnan\'s Nanning earthquake victims were fed.',
  ],
  s0182: [
    'On day bingzi an edict established the General Staff; Prince Yulang was placed at its head.',
    'On bingzi day the General Staff was founded under Prince Yulang.',
  ],
  s0183: [
    'The Regent Prince acted as commander-in-chief of land and sea forces; Prince Zaitao and Admiral Sa Zhenbing were both made naval planning ministers.',
    'The Regent Prince commanded land and sea forces; Zaitao and Sa Zhenbing planned the navy.',
  ],
  s0184: [
    'Flood victims in Lizhou, Hunan, were relieved.',
    'Hunan\'s Lizhou flood victims were relieved.',
  ],
  s0185: [
    'On day dingchou Prince Zaitao was ordered to manage General Staff affairs.',
    'On dingchou day Zaitao managed General Staff affairs.',
  ],
  s0186: [
    'Sixth month, day jiashen: Prince Qing Yikuang was removed from managing Army Ministry affairs.',
    'Month 6, jiashen: Yikuang left Army Ministry management.',
  ],
  s0187: [
    'Flood victims in Hanyang and other prefectures of Hubei were relieved.',
    'Hubei flood victims in Hanyang and elsewhere were fed.',
  ],
  s0188: [
    'On day yiyou land forces in Ili began organized drill.',
    'On yiyou day Ili began drilling a land army.',
  ],
  s0189: [
    'On day bingxu Cheng Detuan was made Fengtian Governor, Chen Zhaochang Jilin Governor, and Zhou Shumo Heilongjiang Governor.',
    'On bingxu day Cheng Detuan, Chen Zhaochang, and Zhou Shumo became the three Manchuria governors.',
  ],
  s0190: [
    'On day dinghai canals at Gaolan, Xincheng, and Xigu in Gansu were opened for work relief.',
    'On dinghai day Gansu canal work employed flood victims.',
  ],
  s0191: [
    'On day jichou earthquake victims in Mile county and Xier in Yunnan were relieved.',
    'On jichou day Yunnan earthquake victims in Mile and Xier were fed.',
  ],
  s0192: [
    'Grain tax for last year\'s disaster fields in Taihe county, Yunnan, was remitted.',
    'Taihe\'s disaster grain tax was forgiven.',
  ],
  s0193: [
    'On day gengyin the late demoted Liang-Guang Governor Mao Hongbin was restored to his original post.',
    'On gengyin day Mao Hongbin regained his old Liang-Guang post.',
  ],
  s0194: [
    'Yue Chang of Changzhou prefecture, Jiangsu, who died fighting bandits, was posthumously granted a shrine in Changzhou.',
    'Yue Chang, killed fighting bandits, got a shrine in Changzhou.',
  ],
  s0195: [
    'Flood victims in Andong, Fengtian, were relieved.',
    'Andong flood victims in Fengtian were fed.',
  ],
  s0196: [
    'On day jiawu Lv Haihuan was dismissed; Xu Shichang was made chief commissioner of the Tianjin-Pukou Railway and Shen Yunpei his deputy.',
    'On jiawu day Lv Haihuan left office; Xu Shichang headed the Tianjin-Pukou Railway with Shen Yunpei as deputy.',
  ],
  s0197: [
    'The Fengtian Jinzhou circuit was renamed the Jinzhou-Yingkou sub-circuit defense post.',
    'Fengtian\'s Jinzhou circuit was renamed the Jinzhou-Yingkou defense sub-circuit.',
  ],
  s0198: [
    'On day yiwei great floods in Jilin; sixty thousand taels were issued for relief.',
    'On yiwei day sixty thousand taels relieved Jilin\'s great flood.',
  ],
  s0199: [
    'Floods in Lizhou, Anxiang, Changde, Yuezhou, and other districts of Hunan were relieved.',
    'Hunan floods from Lizhou to Yuezhou were relieved.',
  ],
  s0200: [
    'On day dingyou floods in Jingzhou and Hanyang prefectures, Hubei; sixty thousand taels were issued and two hundred thousand taels were ordered raised for urgent relief.',
    'On dingyou day Hubei\'s Jingzhou and Hanyang floods got sixty thousand taels plus orders to raise two hundred thousand more.',
  ]
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b02.mjs <translation.json>'
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
