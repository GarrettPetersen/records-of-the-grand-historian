#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day jisi, Jiangxi Governor Ruan Yuan was promoted to Junior Tutor of the Heir Apparent for capturing bandits.',
    'On jisi day, Ruan Yuan of Jiangxi was made Junior Tutor of the Heir Apparent for suppressing bandits.',
  ],
  s1002: [
    'Eleventh month, day guichou: orders were given to open wasteland in Ili and Jilin.',
    'In the eleventh month, on guichou day, reclamation was ordered in Ili and Jilin.',
  ],
  s1003: [
    'Twelfth month, day guiwei: Bailin was removed as concurrent Grand Secretary; Zhang Xu was made concurrent Grand Secretary.',
    'In the twelfth month, Bailin left the concurrent grand secretary post and Zhang Xu took it.',
  ],
  s1004: [
    'On day yiyou, the joint seasonal sacrifice was performed at the Grand Temple.',
    'On yiyou day, the Ancestral Temple received the collective seasonal rites.',
  ],
  s1005: [
    'That year, disaster land taxes were remitted for two Zhili counties, two Henan counties, and every walled city of Heilongjiang.',
    'That year, flood taxes were forgiven in four counties and all Heilongjiang garrisons.',
  ],
  s1006: [
    'Land taxes on abandoned fields were abolished in four counties including Xiuyan in Fengtian and Xi\'an in Zhejiang.',
    'Abandoned-field taxes were ended in Xiuyan, Xi\'an, and two other counties.',
  ],
  s1007: [
    'Korea and Ryukyu sent tribute.',
    'Tribute missions came from Korea and Ryukyu.',
  ],
  s1008: [
    'Twentieth year, spring, first month, day jiawu: seasonal offerings at the Grand Temple; the Prince of Zhi was ordered to perform the rites.',
    'In year 20, on first-month jiawu, seasonal temple rites were entrusted to the Prince of Zhi.',
  ],
  s1009: [
    'Second month, day jiwei: the Emperor attended the Classics Lecture.',
    'In the second month, on jiwei day, the Emperor lectured on the classics.',
  ],
  s1010: [
    'Third month, day gengyin: the Emperor visited the Eastern Imperial Tombs.',
    'In the third month, on gengyin day, the Emperor went to the Eastern Tombs.',
  ],
  s1011: [
    'On day wushen, the Emperor returned to the capital.',
    'On wushen day, the Emperor returned to Beijing.',
  ],
  s1012: [
    'On day jiawu, Chu Pengling was demoted for an unfounded impeachment of Bailin and for having Mao Yu plead illness on his behalf.',
    'On jiawu day, Chu Pengling was demoted for false charges against Bailin and improper leave-taking for Mao Yu.',
  ],
  s1013: [
    'Soon afterward, after Bailin investigated and memorialized in rebuttal, his office was stripped.',
    'Bailin\'s inquiry led to Chu Pengling\'s dismissal.',
  ],
  s1014: [
    'On day jiyou, Liangguang Governor-General Jiang Youtie memorialized regulations for investigating and banning opium.',
    'On jiyou day, Jiang Youtie proposed rules to suppress opium in Guangdong and Guangxi.',
  ],
  s1015: [
    'The reply stated: "When foreign ships reach Macau, each ship shall be inspected to cut off the source.',
    'The court ordered ship-by-ship inspection at Macau to block opium at the source.',
  ],
  s1016: [
    'Officials who release contraband and civilians who trade privately shall be punished according to the case.',
    'Official traffickers and private dealers were to be punished by degree.',
  ],
  s1017: [
    '"',
    '"',
  ],
  s1018: [
    'Summer, fourth month, day jisi: the Emperor reviewed the Jianrui Camp troops.',
    'In the fourth month, on jisi day, the Emperor inspected the Jianrui Camp.',
  ],
  s1019: [
    'On day renwu, the Emperor composed twenty-six chapters of admonitions for officials and proclaimed them to the bureaucracy.',
    'On renwu day, the Emperor issued twenty-six chapters of official admonitions.',
  ],
  s1020: [
    'Fifth month, day dinghai: the Ministry of Justice memorialized that Prefect Wang Shuxun was the monk Mingxin, who had fraudulently purchased office through donation.',
    'In the fifth month, the Board of Punishments found Prefect Wang Shuxun was the monk Mingxin, who had bought office by fraud.',
  ],
  s1021: [
    'The reply ordered: two months in the cangue, then banishment to Heilongjiang.',
    'He was to wear the cangue two months, then serve exile in Heilongjiang.',
  ],
  s1022: [
    'Vice Minister Jiang Yupu, who had entered the sect, was stripped of office.',
    'Sect-affiliated Vice Minister Jiang Yupu was dismissed.',
  ],
  s1023: [
    'Sixth month, day wuchen: the Emperor composed an essay on diligent government and love of the people and proclaimed it at home and abroad.',
    'In the sixth month, on wuchen day, the Emperor published an essay on diligent rule and caring for the people.',
  ],
  s1024: [
    'On day jimao, Chang Ming memorialized that the Zhongzhandui Tibetan tribesman Lob Chilili had caused trouble; command was changed to send Regional Commander Luo Siju from Xiazhandui to suppress them.',
    'On jimao day, Chang Ming reported Lob Chilili\'s revolt and sent Luo Siju from below Zhandui to suppress it.',
  ],
  s1025: [
    'Regional Commander Luo Shengkao, who had failed in the campaign, and Company Commander Tutang\'a, who had filed false reports, were both stripped of office and arrested for trial.',
    'Luo Shengkao and Tutang\'a were dismissed and arrested for poor campaigning and false reports.',
  ],
  s1026: [
    'Autumn, seventh month, day jiawu: Regional Commander Luo Siju finished suppressing the Zhongzhandui Tibetan tribesman Lob Chilili; the ministry was ordered to deliberate rewards.',
    'In the seventh month, Luo Siju completed the Lob Chilili campaign and rewards were referred to the ministry.',
  ],
  s1027: [
    'On day guimao, the Emperor toured Mulan.',
    'On guimao day, the Emperor went to Mulan.',
  ],
  s1028: [
    'Eighth month, day wuchen: the Emperor went on the hunting encampment.',
    'In the eighth month, on wuchen day, the Emperor joined the autumn hunt.',
  ],
  s1029: [
    'Bailin was advanced three ranks in the third-class baronage for capturing Fang Rongsheng, chief culprit in fabricating seditious words.',
    'Bailin was raised three ranks in his barony for capturing sedition ringleader Fang Rongsheng.',
  ],
  s1030: [
    'Ninth month, day jihai: the Emperor returned to the capital.',
    'In the ninth month, on jihai day, the Emperor returned to Beijing.',
  ],
  s1031: [
    'Winter, tenth month, day gengshen: Songyun was summoned to the capital; Changling was made Ili General.',
    'In the tenth month, Songyun was recalled and Changling became Ili general.',
  ],
  s1032: [
    'On day guihai, Vice Minister Nayenbao was ordered to go investigate the Shanxi earthquake disaster.',
    'On guihai day, Nayenbao was sent to survey Shanxi earthquake damage.',
  ],
  s1033: [
    'Eleventh month, day dinghai: Prince Li Zhaochi was stripped of his title and confined for punishing tenant farmers like criminals over rent arrears; Linzhi succeeded to the title.',
    'In the eleventh month, Prince Li Zhaochi lost his rank and was confined; Linzhi inherited.',
  ],
  s1034: [
    'Twelfth month, day jimao: the joint seasonal sacrifice was performed at the Grand Temple.',
    'In the twelfth month, on jimao day, the Ancestral Temple received the collective seasonal rites.',
  ],
  s1035: [
    'That year, disaster land taxes were remitted for two counties of Zhili Ningjin.',
    'That year, Ningjin and one other Zhili county were forgiven flood taxes.',
  ],
  s1036: [
    'Land taxes on abandoned fields were abolished in Baoshan and Jingjiang of Jiangsu and Jingle of Shanxi.',
    'Abandoned-field taxes ended in Baoshan, Jingjiang, and Jingle.',
  ],
  s1037: [
    'The empire\'s population was reckoned at 326,574,895 persons; stored grain totaled 30,802,869 shi 9 dou 1 sheng 7 he 5 shuo.',
    'Registered population reached 326,574,895; granary stores stood at 30,802,869 shi and fractions.',
  ],
  s1038: [
    'Korea, Ryukyu, and Siam sent tribute.',
    'Tribute came from Korea, Ryukyu, and Siam.',
  ],
  s1039: [
    'Twenty-first year, spring, first month, day bingxu: a special edict ordered princes of the first and second ranks not to let eunuchs present memorials on their behalf, lest openings for improper association be created.',
    'In year 21, an edict barred princes from using eunuchs to file memorials and court favor.',
  ],
  s1040: [
    'Second month, day renzi: the Emperor attended the Classics Lecture.',
    'In the second month, on renzi day, the Emperor lectured on the classics.',
  ],
  s1041: [
    'On day jiaxu, the Emperor visited the Eastern Imperial Tombs.',
    'On jiaxu day, the Emperor went to the Eastern Tombs.',
  ],
  s1042: [
    'On day gengchen, the Emperor returned to the capital.',
    'On gengchen day, the Emperor returned to Beijing.',
  ],
  s1043: [
    'Third month, day gengyin: the Emperor visited the Western Imperial Tombs.',
    'In the third month, on gengyin day, the Emperor went to the Western Tombs.',
  ],
  s1044: [
    'On day xinchou, the Emperor went in person to the tomb of the late Grand Secretary Zhu Gui and bestowed offerings.',
    'On xinchou day, the Emperor offered at Zhu Gui\'s tomb.',
  ],
  s1045: [
    'On day dingwei, the Emperor returned to the palace.',
    'On dingwei day, the Emperor returned to the palace.',
  ],
  s1046: [
    'Summer, fourth month, day bingzi.',
    'Fourth month of summer, bingzi day.',
  ],
  s1047: [
    'Zhang Shicheng memorialized his father\'s illness and, without awaiting the reply, returned home; he was dismissed.',
    'Zhang Shicheng left office without leave over his father\'s illness and was dismissed.',
  ],
  s1048: [
    'Hu Kejia was made Jiangsu governor.',
    'Hu Kejia became Jiangsu governor.',
  ],
  s1049: [
    'Fifth month, day xinmao: Ma Huiyu was made Left Censor-in-Chief; Sun Yuting was made Huguang governor-general.',
    'In the fifth month, Ma Huiyu became left censor-in-chief and Sun Yuting Huguang governor-general.',
  ],
  s1050: [
    'On day dingwei, Eleqiyetu was made a Grand Minister in Attendance.',
    'On dingwei day, Eleqiyetu became a grand minister in attendance.',
  ],
  s1051: [
    'Sixth month, day dingchou: retired Grand Secretary Qinggui died.',
    'In the sixth month, on dingchou day, the retired grand secretary Qinggui died.',
  ],
  s1052: [
    'On day wuyin, Nayancheng was stripped of office and arrested for trial over an affair; Fang Shoudi was made Zhili governor-general.',
    'On wuyin day, Nayancheng was dismissed and arrested; Fang Shoudi took Zhili.',
  ],
  s1053: [
    'Intercalary sixth month, day wuxu: Zhaochi was released from confinement.',
    'In the leap sixth month, Zhaochi was freed from detention.',
  ],
  s1054: [
    'On day renyin, Dai Junyuan was made Minister of Personnel.',
    'On renyin day, Dai Junyuan became minister of personnel.',
  ],
  s1055: [
    'Autumn, seventh month, day yimao: Heshengtai, Mukedeng\'e, and Suleng\'e, who had escorted the British envoy, were all demoted for not understanding protocol and failing to secure an audience.',
    'In the seventh month, Heshengtai, Mukedeng\'e, and Suleng\'e were demoted for mishandling the British mission.',
  ],
  s1056: [
    'Songyun was made Manchu Banner commander-in-chief; Hening was made Minister of Works.',
    'Songyun became a banner commander-in-chief and Hening works minister.',
  ],
  s1057: [
    'On day yichou, the Emperor toured Mulan.',
    'On yichou day, the Emperor went to Mulan.',
  ],
  s1058: [
    'Eighth month, day renchen: the Emperor went on the hunting encampment.',
    'In the eighth month, on renchen day, the Emperor joined the autumn hunt.',
  ],
  s1059: [
    'Ninth month, day wuwu: the imperial procession returned.',
    'In the ninth month, on wuwu day, the Emperor ended the tour.',
  ],
  s1060: [
    'He reviewed troops at Gubeikou.',
    'The Emperor inspected troops at Gubeikou.',
  ],
  s1061: [
    'On day renxu, the Emperor returned to the capital.',
    'On renxu day, the Emperor returned to Beijing.',
  ],
  s1062: [
    'Winter, tenth month, day wuzi: Songyun was ordered to act as Liangjiang governor-general; Zhang Xu was made a Grand Councilor.',
    'In the tenth month, Songyun acted at Liangjiang and Zhang Xu joined the Grand Council.',
  ],
  s1063: [
    'Eleventh month, day renzi: Bailin died; Sun Yuting was transferred to Liangjiang governor-general and Ruan Yuan to Huguang governor-general.',
    'In the eleventh month, Bailin died; Sun Yuting took Liangjiang and Ruan Yuan Huguang.',
  ],
  s1064: [
    'On day bingchen, Mianzhi was made Chief Commandant of the Palace Guard.',
    'On bingchen day, Mianzhi became chief commandant of the palace guard.',
  ],
  s1065: [
    'Twelfth month, day guimao: the joint seasonal sacrifice was performed at the Grand Temple.',
    'In the twelfth month, on guimao day, the Ancestral Temple received the collective seasonal rites.',
  ],
  s1066: [
    'That year, disaster land taxes were remitted by varying amounts for fifty-six prefectures and counties of Zhili, Henan, Zhejiang, Hunan, and other provinces.',
    'That year, fifty-six disaster districts in several provinces received partial tax remissions.',
  ],
  s1067: [
    'Korea, Ryukyu, and England sent tribute.',
    'Tribute came from Korea, Ryukyu, and Britain.',
  ],
  s1068: [
    'Twenty-second year, spring, first month, day renshen: the Emperor attended the Classics Lecture.',
    'In year 22, on first-month renshen, the Emperor lectured on the classics.',
  ],
  s1069: [
    'Second month, day dingchou: the sacrifice to Confucius was performed.',
    'In the second month, on dingchou day, the court sacrificed to Confucius.',
  ],
  s1070: [
    'On day guiwei, Changling was made Shaanxi-Gansu governor-general; Jinchang was made Ili General; Fujun was made Shengjing General.',
    'On guiwei day, Changling took Shaanxi-Gansu, Jinchang Ili, and Fujun Shengjing.',
  ],
  s1071: [
    'Third month, new moon on day jiachen: Dong Jiazeng was made Fujian-Zhejiang governor-general.',
    'On the third-month new moon, Dong Jiazeng became Fujian-Zhejiang governor-general.',
  ],
  s1072: [
    'On day wushen, a Tianjin Naval Camp regional commander was added to command both naval battalions exclusively.',
    'On wushen day, Tianjin gained a naval regional commander over both water battalions.',
  ],
  s1073: [
    'On day renzi, the Emperor visited the Eastern Imperial Tombs.',
    'On renzi day, the Emperor went to the Eastern Tombs.',
  ],
  s1074: [
    'On day jisi, the Emperor returned to the capital.',
    'On jisi day, the Emperor returned to Beijing.',
  ],
  s1075: [
    'On day xinwei, Zhang Xu was removed; Dai Junyuan was made concurrent Grand Secretary; Lu Yinpobo was made Minister of War; Wang Tingzhen was made Left Censor-in-Chief.',
    'On xinwei day, Zhang Xu left office; Dai Junyuan became concurrent grand secretary; Lu Yinpobo war minister; Wang Tingzhen left censor-in-chief.',
  ],
  s1076: [
    'Summer, fourth month, day dinghai: the Emperor reviewed the Jianrui Camp troops.',
    'In the fourth month, on dinghai day, the Emperor inspected the Jianrui Camp.',
  ],
  s1077: [
    'On day gengyin, the midsummer horse tribute from Ili was suspended.',
    'On gengyin day, the court stopped Ili\'s midsummer horse tribute.',
  ],
  s1078: [
    'On day xinmao, Yunnan tribal bandits were pacified; Bolin was promoted to Junior Tutor of the Heir Apparent.',
    'On xinmao day, Yunnan tribes were pacified and Bolin was made Junior Tutor of the Heir Apparent.',
  ],
  s1079: [
    'On day wuxu, Wu Qijun and 255 others received jinshi degrees with differentiated ranks.',
    'On wuxu day, Wu Qijun and 255 others received jinshi degrees.',
  ],
  s1080: [
    'Fifth month, day xinyou: the Emperor prayed for rain.',
    'In the fifth month, on xinyou day, the Emperor prayed for rain.',
  ],
  s1081: [
    'On day renxu, rain fell.',
    'On renxu day, rain fell.',
  ],
  s1082: [
    'Yu Lin was made Tibet resident commissioner.',
    'Yu Lin became Tibet resident commissioner.',
  ],
  s1083: [
    'On day dingmao, Fujian Provincial Administration Commissioner Li Gengyun was falsely accused and hanged himself; Xichang and Wang Yinzhi were sent to try the case and found the facts.',
    'On dingmao day, Li Gengyun hanged himself after false charges; Xichang and Wang Yinzhi verified the facts.',
  ],
  s1084: [
    'The imperial reply: Governor-General Wang Zhiyi and Governor Wang Shaolan were both stripped of office.',
    'The court dismissed Governors-General Wang Zhiyi and Wang Shaolan.',
  ],
  s1085: [
    'On day renshen, the Emperor composed an essay on hoping for rain and reflecting on faults.',
    'On renshen day, the Emperor published an essay on drought and self-examination.',
  ],
  s1086: [
    'Sixth month, day jiaxu: Songyun memorialized requesting to stop next year\'s visit to the ancestral tombs.',
    'In the sixth month, Songyun asked to cancel next year\'s tomb pilgrimage.',
  ],
  s1087: [
    'The reply sternly rebuked him; he was dismissed as Grand Secretary and demoted to Chahar banner commander-in-chief.',
    'The Emperor rebuked him, removed him as grand secretary, and made him Chahar commander-in-chief.',
  ],
  s1088: [
    'Mingliang was made Grand Secretary; Bolin concurrent Grand Secretary; Hening Minister of War.',
    'Mingliang became grand secretary; Bolin concurrent grand secretary; Hening war minister.',
  ],
  s1089: [
    'Saichong\'a was made a Grand Minister in Attendance; Deninger\'e was made Chengdu General.',
    'Saichong\'a became a grand minister in attendance and Deninger\'e Chengdu general.',
  ],
  s1090: [
    'Autumn, seventh month, day gengshen: the Emperor toured Mulan.',
    'In the seventh month, on gengshen day, the Emperor went to Mulan.',
  ],
  s1091: [
    'Suleng\'e was made Minister of Works; Heshengtai Minister of the Court of Colonial Affairs.',
    'Suleng\'e became works minister and Heshengtai colonial affairs minister.',
  ],
  s1092: [
    'Eighth month, day dinghai: the Emperor went on the hunting encampment.',
    'In the eighth month, on dinghai day, the Emperor joined the autumn hunt.',
  ],
  s1093: [
    'On day renchen, Jilakan was removed; Yu Xiu was made Hangzhou General.',
    'On renchen day, Jilakan was dismissed and Yu Xiu became Hangzhou general.',
  ],
  s1094: [
    'Ninth month, day guichou: Chang Ming died; Jiang Youtie was made Sichuan governor-general; Ruan Yuan Liangguang governor-general; Qingbao Huguang governor-general.',
    'In the ninth month, Chang Ming died; Jiang Youtie took Sichuan, Ruan Yuan Liangguang, and Qingbao Huguang.',
  ],
  s1095: [
    'On day gengshen, the Emperor returned to the capital.',
    'On gengshen day, the Emperor returned to Beijing.',
  ],
  s1096: [
    'On day gengwu, the Emperor composed an essay on remonstrating officials and issued it to the Censorate.',
    'On gengwu day, the Emperor published an essay on remonstrating officials for the Censorate.',
  ],
  s1097: [
    'Winter, tenth month, new moon on day xinwei: there was a solar eclipse.',
    'On the tenth-month new moon, a solar eclipse occurred.',
  ],
  s1098: [
    'Eleventh month, day yichou: Yichong\'a was made Rehe banner commander-in-chief.',
    'In the eleventh month, Yichong\'a became Rehe commander-in-chief.',
  ],
  s1099: [
    'Twelfth month, day jiaxu: arrears silver for Yunnan copper mines was remitted.',
    'In the twelfth month, Yunnan copper-mine arrears were forgiven.',
  ],
  s1100: [
    'On day dingyou, the joint seasonal sacrifice was performed at the Grand Temple.',
    'On dingyou day, the Ancestral Temple received the collective seasonal rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b11.mjs <translation.json>'
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
