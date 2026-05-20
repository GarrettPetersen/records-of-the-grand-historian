#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day renwu, the bandits of Sanshan in Guangdong were pacified.',
    'On renwu day, Sanshan bandits in Guangdong were suppressed.',
  ],
  s1002: [
    'On day guimao, Guangdong rebels took Zhen\'an but it was soon recovered.',
    'On guimao day, Guangdong rebels seized Zhen\'an and troops soon retook it.',
  ],
  s1003: [
    'On day dinghai, Duolong\'a had besieged Zhouzhi for a long time without taking it and was sharply rebuked.',
    'On dinghai day, Duolong\'a was rebuked for failing to take Zhouzhi after a long siege.',
  ],
  s1004: [
    'The mu land surtax in Shandong was suspended, at Yan Jingming\'s request.',
    'Shandong\'s mu surtax was halted on Yan Jingming\'s petition.',
  ],
  s1005: [
    'On day wuzi, Guangxi forces took Cangwu and other counties.',
    'On wuzi day, Guangxi troops captured Cangwu and neighboring counties.',
  ],
  s1006: [
    'On day gengyin, Zeng Guoquan and other armies took the Zhongshan stone fort and completely invested Jinling.',
    'On gengyin day, Zeng Guoquan took the Zhongshan stone fort and closed the siege on Jinling.',
  ],
  s1007: [
    'Jiang Yilin\'s army recovered Tongxiang.',
    'Jiang Yilin\'s forces retook Tongxiang.',
  ],
  s1008: [
    'Guangdong rebels pressed the Fujian border; Zhang Yunlan\'s army went to their aid.',
    'Guangdong rebels threatened Fujian and Zhang Yunlan marched to assist.',
  ],
  s1009: [
    'On day renchen, Henan forces took rebel stockades at Xi county and Guangzhou.',
    'On renchen day, Henan troops seized rebel camps at Xi and Guangzhou.',
  ],
  s1010: [
    'On day jiawu, Guangdong rebels fled to Guangfeng and Yiyang.',
    'On jiawu day, Guangdong rebels raided into Guangfeng and Yiyang.',
  ],
  s1011: [
    'On day gengzi, southern Shaanxi bandits fled into Neixiang.',
    'On gengzi day, southern Shaanxi bandits entered Neixiang.',
  ],
  s1012: [
    'Third month, day renyin: Cheng Xueqi and other armies took Jiaxing.',
    'In the third month, on renyin day, Cheng Xueqi retook Jiaxing.',
  ],
  s1013: [
    'Jiangxi forces recovered Jinxi.',
    'Jiangxi troops retook Jinxi.',
  ],
  s1014: [
    'Jiangnan forces recovered Liyang.',
    'Jiangnan troops retook Liyang.',
  ],
  s1015: [
    'Shaanxi forces took Zhouzhi; Duolong\'a was granted leave for wounds and Mutushan temporarily supervised military affairs.',
    'Shaanxi troops took Zhouzhi; wounded Duolong\'a went on leave and Mutushan acted as commander.',
  ],
  s1016: [
    'Lei Zhengan and other armies advanced to suppress the rebellious Hui.',
    'Lei Zhengan and others marched against rebel Hui forces.',
  ],
  s1017: [
    'Sichuan bandit Lan Ershun fled into Xunyang.',
    'Sichuan rebel Lan Ershun fled to Xunyang.',
  ],
  s1018: [
    'On day bingwu, Sengge Rinchen took command of the full army for Henan and advanced to Xuzhou.',
    'On bingwu day, Sengge Rinchen led the main force into Henan as far as Xuzhou.',
  ],
  s1019: [
    'Jiangnan forces recovered Guangde.',
    'Jiangnan troops retook Guangde.',
  ],
  s1020: [
    'Lin Gansheng, rebel chief of Jiayi, was executed.',
    'Jiayi rebel leader Lin Gansheng was put to death.',
  ],
  s1021: [
    'On day jiyou, Gordon was wounded attacking Jintan; an edict ordered condolences.',
    'On jiyou day, Gordon was wounded at Jintan and the court sent condolences.',
  ],
  s1022: [
    'Cen Yuying and other armies took Talang and Zhenyuan.',
    'Cen Yuying\'s forces captured Talang and Zhenyuan.',
  ],
  s1023: [
    'On day gengxu, Duolong\'a was ordered to supervise Shaanxi and Gansu military affairs.',
    'On gengxu day, Duolong\'a was put in charge of Shaanxi-Gansu operations.',
  ],
  s1024: [
    'On day renzi, Jiang Yilin\'s armies recovered Hangzhou and Yuhang.',
    'On renzi day, Jiang Yilin retook Hangzhou and Yuhang.',
  ],
  s1025: [
    'Zuo Zongtang was given the Junior Guardian of the Heir Apparent rank; Yilin was rewarded with a yellow riding jacket, and soon given a hereditary office.',
    'Zuo Zongtang became Junior Guardian of the Heir Apparent; Yilin received a yellow jacket and later a hereditary post.',
  ],
  s1026: [
    'On day jiayin, grain and land taxes in newly recovered Hang-Jia districts were remitted for two years.',
    'On jiayin day, Hangzhou and Jiaxing were granted two years\' tax relief.',
  ],
  s1027: [
    'Mutushan was ordered to assist Duolong\'a; he temporarily held the Imperial Commissioner post.',
    'Mutushan was assigned to assist Duolong\'a and acted as Imperial Commissioner.',
  ],
  s1028: [
    'Sichuan troops attacked Songpan bandits and lost the Diexi garrison city.',
    'Sichuan forces attacking Songpan bandits were routed at Diexi.',
  ],
  s1029: [
    'On day dingsi, Yunnan forces recovered Jingdong, Yuanmou, and Chuxiong.',
    'On dingsi day, Yunnan troops retook Jingdong, Yuanmou, and Chuxiong.',
  ],
  s1030: [
    'On day guihai, Jiangxi bandits fled into Fujian.',
    'On guihai day, Jiangxi rebels crossed into Fujian.',
  ],
  s1031: [
    'On day yichou, rebel chief Lan Dashun was executed.',
    'On yichou day, rebel leader Lan Dashun was executed.',
  ],
  s1032: [
    'On day bingyin, Zhejiang forces recovered Wukang, Deqing, and Shimen.',
    'On bingyin day, Zhejiang troops retook Wukang, Deqing, and Shimen.',
  ],
  s1033: [
    'An edict ordered Zuo Zongtang to care for Hangzhou refugees.',
    'Zuo Zongtang was told to shelter Hangzhou refugees.',
  ],
  s1034: [
    'On day jisi, Grand Coordinator Cheng Xueqi died in camp.',
    'On jisi day, Grand Coordinator Cheng Xueqi died on campaign.',
  ],
  s1035: [
    'On day gengwu, Zhang Zongyu fled into Zhenping.',
    'On gengwu day, Zhang Zongyu fled toward Zhenping.',
  ],
  s1036: [
    'Gansu Hui rebel Ma Sanwa took Chijinbao; government troops suppressed and pacified it.',
    'Ma Sanwa\'s Hui rebels seized Chijinbao and were crushed by government forces.',
  ],
  s1037: [
    'That month, arrears of taxes in Guizhou prefectures, departments, and counties that had been ravaged were remitted.',
    'That month, back taxes were forgiven in ravaged Guizhou districts.',
  ],
  s1038: [
    'Summer, fourth month, first day xinwei: there was a solar eclipse.',
    'In summer, on the xinwei new moon of the fourth month, the sun was eclipsed.',
  ],
  s1039: [
    'On day renshen, Bao Chao\'s army recovered Jurong.',
    'On renshen day, Bao Chao retook Jurong.',
  ],
  s1040: [
    'On day bingzi, Duxing\'a was ordered to Dingbian to take over Neqin\'s forces and advance against bandits entrenched at Ningling.',
    'On bingzi day, Duxing\'a went to Dingbian to command Neqin\'s troops against Ningling bandits.',
  ],
  s1041: [
    'On day dingchou, Li Shixian and others fled into Jiangxi.',
    'On dingchou day, Li Shixian and others raided into Jiangxi.',
  ],
  s1042: [
    'Bao Chao\'s army recovered Jintan.',
    'Bao Chao retook Jintan.',
  ],
  s1043: [
    'Nian and Guangdong bandits jointly fled to Zaoyang.',
    'Nian and Guangdong rebels together fled into Zaoyang.',
  ],
  s1044: [
    'Southern Shaanxi bandits fled into Henan and took Jingziguan.',
    'Southern Shaanxi bandits entered Henan and seized Jingziguan.',
  ],
  s1045: [
    'On day wuyin, Hunan forces jointly recovered Guzhou.',
    'On wuyin day, Hunan troops jointly retook Guzhou.',
  ],
  s1046: [
    'On day xinsi, excess grain levies at Shaoxing were audited and reduced, made a permanent statute.',
    'On xinsi day, Shaoxing\'s excess levies were cut permanently after audit.',
  ],
  s1047: [
    'On day jiashen, Li Hongzhang\'s supervised army took Changzhou.',
    'On jiashen day, Li Hongzhang\'s forces captured Changzhou.',
  ],
  s1048: [
    'Feng Zicai and other armies recovered Danyang.',
    'Feng Zicai and others retook Danyang.',
  ],
  s1049: [
    'The late Korean king Li □: his son Xi inherited the title; Vice President Zao Bao and Assistant Banner Commander Wen Qian were sent to invest him.',
    'The late Korean king Li □ was succeeded by his son Xi; Zao Bao and Wen Qian were sent to enfeoff him.',
  ],
  s1050: [
    'On day bingxu, Vice President Xue Huan and Censor of Communications Wang Zheng impeached each other; both were demoted, and officials were admonished.',
    'On bingxu day, Xue Huan and Wang Zheng\'s mutual impeachments brought demotions and a warning to the bureaucracy.',
  ],
  s1051: [
    'Guan Wen went to Anlu to supervise the army; Yan Shusen managed capital defense.',
    'Guan Wen took command at Anlu while Yan Shusen defended the provincial capital.',
  ],
  s1052: [
    'On day gengyin, Duolong\'a died in camp.',
    'On gengyin day, Duolong\'a died on campaign.',
  ],
  s1053: [
    'Duxing\'a was ordered to supervise Gansu military affairs; Lei Zhengan was to assist.',
    'Duxing\'a was put in charge of Gansu operations with Lei Zhengan assisting.',
  ],
  s1054: [
    'On day xinmao, Jiangxi forces relieved the siege of Yushan.',
    'On xinmao day, Jiangxi troops lifted the siege of Yushan.',
  ],
  s1055: [
    'On day guisi, Yan Shusen was demoted because of Guan Wen\'s impeachment; Wu Changshou became Hubei governor and Tang Xunfang acted.',
    'On guisi day, Yan Shusen fell after Guan Wen\'s impeachment; Wu Changshou became Hubei governor with Tang Xunfang acting.',
  ],
  s1056: [
    'Yang Yuebin was ordered to supervise Jiangxi and southern Anhui military affairs.',
    'Yang Yuebin was assigned Jiangxi and southern Anhui operations.',
  ],
  s1057: [
    'On day xinmao, Sengge Rinchen joined Chu forces to suppress Guangdong and Nian bandits at Suizhou and routed them.',
    'On xinmao day, Sengge Rinchen and Chu troops crushed Guangdong and Nian rebels at Suizhou.',
  ],
  s1058: [
    'On day dingyou, because the lower river defense was cleared, patrol boats were cut and the river blockade was lifted.',
    'On dingyou day, lower Yangtze patrols were reduced and the river closure ended.',
  ],
  s1059: [
    'On day wuxu, Guangdong rebels took Yiyang.',
    'On wuxu day, Guangdong rebels seized Yiyang.',
  ],
  s1060: [
    'Southern Shaanxi Guangdong rebels fled into De\'an prefecture; Sengge Rinchen pursued them.',
    'Guangdong rebels from southern Shaanxi entered De\'an and Sengge Rinchen gave chase.',
  ],
  s1061: [
    'On day jihai, military commanders were admonished for ornate reports.',
    'On jihai day, field commanders were warned against embellished memorials.',
  ],
  s1062: [
    'That month, quotas for Wujin and Yanghu were remitted.',
    'That month, land tax quotas were forgiven at Wujin and Yanghu.',
  ],
  s1063: [
    'Fifth month, first day gengzi: Guizhou bandits took Changzhai, Dingfan, and Guangshun but they were soon recovered.',
    'On the gengzi new moon of the fifth month, Guizhou rebels took three towns but troops soon retook them.',
  ],
  s1064: [
    'On day jiachen, Guangdong rebels fled to Tianmen, Yingcheng, De\'an, and Suizhou.',
    'On jiachen day, Guangdong rebels spread into Tianmen, Yingcheng, De\'an, and Suizhou.',
  ],
  s1065: [
    'On day yisi, Guangdong rebels took Ninghua but it was soon recovered.',
    'On yisi day, Guangdong rebels seized Ninghua and troops soon retook it.',
  ],
  s1066: [
    'Xi Lin was removed for illness; Yang Yuebin became Shaanxi-Gansu governor and Duxing\'a acted.',
    'Ill Xi Lin left office; Yang Yuebin became Shaanxi-Gansu governor with Duxing\'a acting.',
  ],
  s1067: [
    'On day dingwei, Spain was permitted to conclude a commercial treaty; Xue Huan and Chonghou were made plenipotentiaries to handle it properly.',
    'On dingwei day, trade with Spain was approved and Xue Huan and Chonghou were sent as plenipotentiaries.',
  ],
  s1068: [
    'An edict ordered Li Hongzhang to send strong detachments to assist the Jinling siege.',
    'Li Hongzhang was told to detach strong columns to help besiege Jinling.',
  ],
  s1069: [
    'On day jiyou, Li Shixian attacked Fuzhou; government troops drove him off and recovered Yiyang.',
    'On jiyou day, Li Shixian struck Fuzhou but was beaten back and Yiyang was retaken.',
  ],
  s1070: [
    'Gordon was rewarded with a yellow riding jacket and peacock feather, given grand coordinator regalia; the Ever Victorious Army was thinned and foreign officers dismissed.',
    'Gordon received a yellow jacket, peacock feather, and grand coordinator dress; the Ever Victorious Army was cut and foreign officers sent home.',
  ],
  s1071: [
    'On day xinhai, government troops recovered Dujiang, Shangjiang, and other cities.',
    'On xinhai day, government forces retook Dujiang, Shangjiang, and other towns.',
  ],
  s1072: [
    'Guangdong rebels pressed toward Xi\'an.',
    'Guangdong rebels threatened Xi\'an.',
  ],
  s1073: [
    'On day guichou, Liu Rong and Li Yunlin were stripped of office but kept on duty.',
    'On guichou day, Liu Rong and Li Yunlin lost rank yet remained at their posts.',
  ],
  s1074: [
    'Mutushan was ordered to remain at Xi\'an to plan defense and suppression.',
    'Mutushan was told to stay at Xi\'an and coordinate defense.',
  ],
  s1075: [
    'Guizhou bandits fled into Xiushan.',
    'Guizhou rebels entered Xiushan.',
  ],
  s1076: [
    'On day wuwu, Bao Chao asked leave to bury his parent; the throne urged him to stay.',
    'On wuwu day, Bao Chao sought mourning leave and was urged to remain on duty.',
  ],
  s1077: [
    'Li Shixian took Yihuang and Chongren; Nanchang was placed on alert.',
    'Li Shixian seized Yihuang and Chongren and Nanchang went on alert.',
  ],
  s1078: [
    'On day gengshen, Hui rebels took Didao but it was soon recovered.',
    'On gengshen day, Hui rebels took Didao and troops soon retook it.',
  ],
  s1079: [
    'On day renxu, Guangdong rebels fled to Huangpi; Guan Wen moved troops to Xiaogan.',
    'On renxu day, Guangdong rebels reached Huangpi and Guan Wen shifted to Xiaogan.',
  ],
  s1080: [
    'On day guihai, an edict of the Empress Dowager ordered Ruichang, Baojun, Zailing, Shan Maoqian, and Xu Tong to take turns lecturing on the Zhiping Baojian.',
    'On guihai day, the Empress Dowager told Ruichang, Baojun, Zailing, Shan Maoqian, and Xu Tong to lecture on the Zhiping Baojian in rotation.',
  ],
  s1081: [
    'Guangdong rebels again took Jianning and Ninghua but they were soon recovered.',
    'Guangdong rebels retook Jianning and Ninghua but government forces soon recovered them.',
  ],
  s1082: [
    'On day dingmao, Lei Zhengan\'s army recovered Pingliang.',
    'On dingmao day, Lei Zhengan retook Pingliang.',
  ],
  s1083: [
    'On day wuchen, frontier officials were told not to draw territorial lines in jointly suppressing border bandits.',
    'On wuchen day, frontier governors were ordered to cooperate across borders against bandits.',
  ],
  s1084: [
    'Li Hengsong and Liu Xungao were ordered to exchange treaties with Danish envoy Beile at Shanghai.',
    'Li Hengsong and Liu Xungao were sent to exchange treaties with Denmark\'s Beile at Shanghai.',
  ],
  s1085: [
    'On day jisi, Guangxi forces took the Guixian rebel nest; Xunzhou was pacified.',
    'On jisi day, Guangxi troops cleared Guixian bandit lairs and pacified Xunzhou.',
  ],
  s1086: [
    'Sixth month, day renshen: ministers of departments and boards were admonished not to continue prior laxity.',
    'In the sixth month, on renshen day, department ministers were warned against old slack ways.',
  ],
  s1087: [
    'On day guiyou, Guangdong rebels fled to Macheng and Huanggang.',
    'On guiyou day, Guangdong rebels raided Macheng and Huanggang.',
  ],
  s1088: [
    'On day dingchou, rain.',
    'On dingchou day, it rained.',
  ],
  s1089: [
    'Jiangsu forces recovered Changxing.',
    'Jiangsu troops retook Changxing.',
  ],
  s1090: [
    'Guizhou forces recovered Pu\'an.',
    'Guizhou troops retook Pu\'an.',
  ],
  s1091: [
    'Ma Rulong and Cen Yuying\'s armies suppressed western Yunnan Hui rebels and recovered Zhongdian, Weixi, Simao, Weiyuan, and Shigaojing and other rebel nests.',
    'Ma Rulong and Cen Yuying cleared western Yunnan Hui rebels from Zhongdian, Weixi, Simao, Weiyuan, Shigaojing, and other strongholds.',
  ],
  s1092: [
    'On day wuyin, Han and Hui at Kuche revolted; Commissioner Wen Yi and Muslim prince Aimoerte died.',
    'On wuyin day, Kuche Han and Hui rose; Commissioner Wen Yi and Prince Aimoerte were killed.',
  ],
  s1093: [
    'Kazakh people were settled southeast of Zaisang Nor.',
    'Kazakhs were resettled southeast of Zaisang Nor.',
  ],
  s1094: [
    'On day wuzi, Jiangxi forces took the Guixi rebel fort.',
    'On wuzi day, Jiangxi troops stormed Guixi rebel works.',
  ],
  s1095: [
    'Zeng Guoquan\'s army took Jinling\'s outer city.',
    'Zeng Guoquan captured Jinling\'s outer wall.',
  ],
  s1096: [
    'On day xinmao, rain.',
    'On xinmao day, it rained.',
  ],
  s1097: [
    'Hui rebels took Bugur and Korla.',
    'Hui rebels seized Bugur and Korla.',
  ],
  s1098: [
    'An edict ordered withdrawal of Neqin\'s army and others.',
    'Neqin\'s forces and others were ordered withdrawn.',
  ],
  s1099: [
    'On day guisi, Zhejiang forces recovered Xiaofeng.',
    'On guisi day, Zhejiang troops retook Xiaofeng.',
  ],
  s1100: [
    'On day wuxu, government troops recovered Jiangning; Hong Xiuquan had committed suicide first, his son Fufu escaped, rebel chiefs Hong Rendan and Li Xiucheng were captured, and Jiangnan was pacified.',
    'On wuxu day, Jiangning fell; Hong Xiuquan had killed himself, his son Fufu fled, Hong Rendan and Li Xiucheng were taken, and Jiangnan was pacified.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b11.mjs <translation.json>'
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
