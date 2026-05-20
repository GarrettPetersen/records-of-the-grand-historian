#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'Prince Chun of the Commandery was sent to the Wenzong Emperor\'s mourning couch to offer sacrifices and report on His Majesty\'s behalf.',
    'Prince Chun was sent to Wenzong\'s bier to sacrifice and announce for the throne.',
  ],
  s1102: [
    'The Emperor went to the two palaces to celebrate the victory.',
    'The Emperor visited the two palaces to hail the victory.',
  ],
  s1103: [
    'Merit was assessed: Zeng Guofan was advanced to marquis of the first rank;',
    'For merit, Zeng Guofan was made a first-rank marquis;',
  ],
  s1104: [
    'Zeng Guoquan to count of the first rank, with Junior Guardian of the Heir Apparent rank;',
    'Zeng Guoquan a first-rank count with Junior Guardian of the Heir Apparent rank;',
  ],
  s1105: [
    'Admiral Li Chengdian to viscount of the first rank, granted a yellow jacket;',
    'Admiral Li Chengdian a first-rank viscount with a yellow jacket;',
  ],
  s1106: [
    'Xiao Fusi to baron of the first rank: all were granted double-eyed peacock feathers.',
    'Xiao Fusi a first-rank baron; all received double-eyed peacock feathers.',
  ],
  s1107: [
    'Circuit intendant Liu Lianjie and others received hereditary offices; promotions varied.',
    'Liu Lianjie and other circuit intendants gained hereditary ranks with graded promotions.',
  ],
  s1108: [
    'Hong Xiuquan\'s corpse was ordered hacked apart and the head sent through the provinces.',
    'Hong Xiuquan\'s body was dismembered and his head sent to every province.',
  ],
  s1109: [
    'Merit in suppressing rebels on every route was assessed: Boyannemeku, son of Sengge Rinchen, was made a beile; Guanwen a first-rank count; Li Hongzhang a first-rank count; Luo Bingzhang a first-rank Commandant of Light Chariots—all granted double-eyed peacock feathers; Yang Yuebin and Peng Yulin were made Junior Guardians of the Heir Apparent, and Bao Chao likewise a first-rank Commandant of Light Chariots; Duxing\'a, Fuming\'a, and Feng Zicai Commandants of the Cavalry; Kuiyu an Ensign of the Cloud.',
    'Anti-rebel merit brought Boyannemeku a beile, Guanwen, Li Hongzhang, and Luo Bingzhang first-rank honors with peacock feathers, Yang Yuebin and Peng Yulin Junior Guardians, Bao Chao a light-chariot commandant, and Duxing\'a, Fuming\'a, Feng Zicai, and Kuiyu lower command ranks.',
  ],
  s1110: [
    'Muslim rebels took Karashahr; Commissioner Yiqili and others all died.',
    'Muslim rebels seized Karashahr and killed Commissioner Yiqili and his party.',
  ],
  s1111: [
    'That month, arrears of taxes were remitted for districts under Jianning and elsewhere in Fujian that had been disturbed.',
    'That month, Fujian\'s Jianning districts and others had disturbed arrears forgiven.',
  ],
  s1112: [
    'Seventh month, autumn, day gengzi: with Jiangnan pacified merit was assessed; Prince Regent Prince Gong\'s son Zaichong was advanced to beile, Zaijun to Baron of the Commandery outside the Eight Banners, and Zaiying to Baron of the Commandery outside the Eight Banners; Grand Councilor Wenxiang received Junior Mentor of the Heir Apparent rank; Baojun and Li Tangjie Junior Guardians of the Heir Apparent; imperial clansmen and grand chamberlains of the imperial presence and the Imperial Household were additionally favored; the rest received rewards in varying degrees.',
    'On gengzi in the seventh month, Jiangnan merit raised Zaichong to beile, Zaijun and Zaiying to commandery barons outside the Eight Banners, Wenxiang to Junior Mentor, Baojun and Li Tangjie to Junior Guardians, and others were rewarded in turn.',
  ],
  s1113: [
    'Day xinchou: because the year met the sexagenary jiazi cycle, an edict halted executions of those with confirmed sentences.',
    'On xinchou, a jiazi year, executions of the sentenced were suspended.',
  ],
  s1114: [
    'An edict stated: "Jiangnan is newly recovered and the people are destitute; officials must recruit settlers and soothe them.',
    'The court ordered Jiangnan officials to settle and comfort a destitute, newly recovered populace.',
  ],
  s1115: [
    'In provinces where military affairs are not yet settled, commanders-in-chief, governors, and others must rouse officers and men to strive zealously for results."',
    'Where fighting continued, commanders and governors were told to drive troops to earnest effort."',
  ],
  s1116: [
    'Russian troops entered a Kobdo border post, seized the commissioner and the zasak.',
    'Russians entered a Kobdo post and took the commissioner and zasak prisoner.',
  ],
  s1117: [
    'Day renchen: members of the imperial clan and gioro were forbidden to lodge secretly in the outer city.',
    'On renchen, clan and gioro were barred from living secretly outside the inner city.',
  ],
  s1118: [
    'Day jiachen: posthumous judgment was passed on those who had sided with Miao Peilin; Grand Commander Bo Chongwu and others were banished to Xinjiang, and Circuit Intendant Zhang Xuechun to a military courier station.',
    'On jiachen, allies of Miao Peilin were punished; Bo Chongwu was sent to Xinjiang and Zhang Xuechun to a courier post.',
  ],
  s1119: [
    'Cantonese bandits fled into and seized Luotian.',
    'Cantonese rebels seized Luotian.',
  ],
  s1120: [
    'Guangxi bandits took Guishun.',
    'Guangxi rebels captured Guishun.',
  ],
  s1121: [
    'Day jiyou: an edict ordered repair of the Ming Taizu\'s mausoleum.',
    'On jiyou, the court ordered repairs to the Ming founder\'s tomb.',
  ],
  s1122: [
    'Jiangbei transit levies were abolished.',
    'Jiangbei transit taxes were cut.',
  ],
  s1123: [
    'Liang-Huai salt administration was restored.',
    'The Liang-Huai salt monopoly was restored.',
  ],
  s1124: [
    'Day gengxu: Shen Guifen was formally appointed Shanxi governor.',
    'On gengxu, Shen Guifen became Shanxi governor in full tenure.',
  ],
  s1125: [
    'Zheng Dunjin was made Director-General of the Yellow River Conservancy in Hedong.',
    'Zheng Dunjin took the Hedong Yellow River director-generalship.',
  ],
  s1126: [
    'Day xinhai: the treaty with Denmark was concluded.',
    'On xinhai, the Danish treaty was ratified.',
  ],
  s1127: [
    'Day renzi: Hong Rendeng and Li Xiucheng were executed.',
    'On renzi, Hong Rendeng and Li Xiucheng were put to death.',
  ],
  s1128: [
    'Wang Haiyang fled into and seized Xuwang.',
    'Wang Haiyang seized Xuwang.',
  ],
  s1129: [
    'Day guichou: Hong Fuzhen entered Huzhou.',
    'On guichou, Hong Fuzhen entered Huzhou.',
  ],
  s1130: [
    'Salt-tea and Guyuan Muslim rebels rebelled again, fled north into Ningling, and harassed Zhongwei and Jingyuan; Salar Muslims colluded and took Xunhua [text damaged], and Toksun in Turpan\'s dependency saw Han and Muslim unrest alike.',
    'Salt-tea and Guyuan Muslims rose again, raided north into Ningling and Zhongwei-Jingyuan, Salar allies seized Xunhua, and Toksun in Turpan also rebelled.',
  ],
  s1131: [
    'Day jiayin: Vice Minister of Revenue Wu Tingdong memorialized that Jinling had reported victory and asked that reverence and caution be increased still more; this was praised and accepted.',
    'On jiayin, Wu Tingdong urged greater caution after Jinling\'s victory and was praised.',
  ],
  s1132: [
    'Day dingsi: because the Guangxi route was blocked, Vietnam\'s tribute mission was halted.',
    'On dingsi, Vietnam\'s tribute was stopped because Guangxi was cut off.',
  ],
  s1133: [
    'Han and Muslims rose in Qitai; Gucheng and Urumqi were unsettled at the same time.',
    'Qitai saw Han-Muslim revolt while Gucheng and Urumqi also turned violent.',
  ],
  s1134: [
    'Wenguang and others advanced to relieve Kucha, were defeated, and were destroyed at Wushataikela; they died.',
    'Wenguang\'s relief column for Kucha was wiped out at Wushataikela.',
  ],
  s1135: [
    'Day gengshen: Di and He Muslim rebels joined Salar Muslims to harass Hezhou.',
    'On gengshen, Di and He Muslims with Salar allies raided Hezhou.',
  ],
  s1136: [
    'Jiangxi government troops recovered Chongren and Dongxiang.',
    'Jiangxi forces retook Chongren and Dongxiang.',
  ],
  s1137: [
    'Day xinyou: Jinxian was recovered.',
    'On xinyou, Jinxian was retaken.',
  ],
  s1138: [
    'Day renxu: Qi Junzao begged retirement on grounds of illness and was ordered to continue serving at Hongde Hall with grand secretary rank.',
    'On renxu, ill Qi Junzao retired yet kept grand secretary rank at Hongde Hall.',
  ],
  s1139: [
    'Government troops captured the Changtu bandit Liu Fahao and others and executed them.',
    'Changtu bandits including Liu Fahao were caught and executed.',
  ],
  s1140: [
    'Day guihai: succession to the Princedoms of Zheng and Yi was restored.',
    'On guihai, the Zheng and Yi princedoms were reinstated.',
  ],
  s1141: [
    'Merit of deceased ministers was recorded: Hu Linyi was granted Commandant of Light Chariots of the first rank; Li Xubin of the second rank; Taqibu, Zhang Guoliang, Jiang Zhongyuan, and Cheng Xueqi of the third rank; Jiang Zhongji, Luo Zinan, Duolong\'a, and Zeng Guohua each received an additional Ensign of the Cloud.',
    'Dead ministers were honored: Hu Linyi a first-rank light-chariot commandant, Li Xubin second rank, Taqibu, Zhang Guoliang, Jiang Zhongyuan, and Cheng Xueqi third rank, and others an extra cloud ensign.',
  ],
  s1142: [
    'Jiangxi troops recovered Yihuang; on day jiazi they took Xuwang.',
    'Jiangxi forces retook Yihuang and on jiazi captured Xuwang.',
  ],
  s1143: [
    'Day yichou: Sengge Rinchen defeated bandits at Macheng.',
    'On yichou, Sengge Rinchen beat rebels at Macheng.',
  ],
  s1144: [
    'Zeng Guoquan begged leave on grounds of illness; a warm edict urged him to stay.',
    'Ill Zeng Guoquan sought leave but was warmly told to remain.',
  ],
  s1145: [
    'Li Chengdian died in camp of his wounds.',
    'Li Chengdian died of wounds in the army.',
  ],
  s1146: [
    'That month, arrears of taxes were remitted for districts in Jiangsu and Anhui that had been disturbed.',
    'That month, disturbed districts in Jiangsu and Anhui had tax arrears forgiven.',
  ],
  s1147: [
    'Eighth month, day jisi, new moon: the order of precedence among princes was fixed and made statute.',
    'On the eighth month\'s jisi new moon, princely precedence was fixed by law.',
  ],
  s1148: [
    'Jiangxi troops recovered Nanfeng; on day gengwu the Urumqi deputy commander rebelled and Provincial Commander Yepu Chong\'e died.',
    'Jiangxi retook Nanfeng; on gengwu the Urumqi deputy rebelled and Yepu Chong\'e was killed.',
  ],
  s1149: [
    'Ili was in grave peril; Khalkha troops from Tarbagatai were transferred to reinforce it.',
    'Ili was desperate and Khalkha troops from Tarbagatai were sent to aid it.',
  ],
  s1150: [
    'An edict ordered Liu Rong to handle Shaanxi military affairs exclusively; Mutushan was to lead his command to Gansu and join Lei Zhengkui in managing military affairs.',
    'Liu Rong was assigned Shaanxi affairs alone; Mutushan marched to Gansu with Lei Zhengkui.',
  ],
  s1151: [
    'Yang Yuebin was urged to proceed at once to his Shaanxi-Gansu post.',
    'Yang Yuebin was pressed to take up his Shaanxi-Gansu post quickly.',
  ],
  s1152: [
    'Day xinwei: an edict ordered Zhang Jixin to go to Guyuan and Salt-tea to handle pacification of Muslim affairs.',
    'On xinwei, Zhang Jixin was sent to Guyuan and Salt-tea to pacify Muslims.',
  ],
  s1153: [
    'Day guiyou: Jiangsu and Zhejiang government troops jointly took Huzhou and Anji.',
    'On guiyou, Jiangsu-Zhejiang forces took Huzhou and Anji together.',
  ],
  s1154: [
    'Day yihai: Jiangxi troops recovered Xincheng; Chen Bingwen surrendered.',
    'On yihai, Jiangxi retook Xincheng and Chen Bingwen submitted.',
  ],
  s1155: [
    'Day xinsi: government troops recovered Guangde.',
    'On xinsi, government forces retook Guangde.',
  ],
  s1156: [
    'Guo Songlin was granted a hereditary office; Yang Dingxun and Zhou Shengbo received yellow jackets.',
    'Guo Songlin gained a hereditary rank; Yang Dingxun and Zhou Shengbo yellow jackets.',
  ],
  s1157: [
    'Bandits in Guixian were pacified.',
    'Guixian bandits were cleared.',
  ],
  s1158: [
    'Liu Mingchuan was promoted to Zhili provincial commander.',
    'Liu Mingchuan became Zhili provincial commander.',
  ],
  s1159: [
    'Day renwu: Muslim rebels took the Han city of Gucheng.',
    'On renwu, Muslims seized Gucheng\'s Han quarter.',
  ],
  s1160: [
    'Day guimao: Lei Zhengkui\'s army took the Zhangjiachuan rebel nest.',
    'On guimao, Lei Zhengkui stormed the Zhangjiachuan rebel stronghold.',
  ],
  s1161: [
    'Day jiashen: Sengge Rinchen\'s suppression of bandits who had fled to Luoshan failed; Commander-in-Chief Shutong\'e and others died.',
    'On jiashen, Sengge Rinchen failed against Luoshan fugitives and Shutong\'e was killed.',
  ],
  s1162: [
    'Day dinghai: Yunnan Governor Jia Hongzhao was stripped of office for feigning illness to evade duty.',
    'On dinghai, Jia Hongzhao lost his post for sham illness to avoid service.',
  ],
  s1163: [
    'Day jichen: Mongol troops of the Tushiyetu and Setsen Khan leagues were transferred to assist suppression at Urumqi and elsewhere.',
    'On jichen, Tushiyetu and Setsen Khan Mongols were sent to fight at Urumqi and elsewhere.',
  ],
  s1164: [
    'Day renchen: Zhejiang troops pursued bandits through Changhua and Chun\'an and captured and executed bandit chieftain Huang Wenjin and others.',
    'On renchen, Zhejiang forces caught Huang Wenjin and other chiefs in Changhua and Chun\'an and executed them.',
  ],
  s1165: [
    'Lin Hongnian was made Yunnan governor.',
    'Lin Hongnian became Yunnan governor.',
  ],
  s1166: [
    'Day guisi: an edict ordered Xinjiang commissioners on every route to suppress or pacify as each case required.',
    'On guisi, Xinjiang commissioners were told to suppress or pacify by local need.',
  ],
  s1167: [
    'Hui prince Bexiar was praised for linking the cities in killing rebels.',
    'Hui Prince Bexiar was commended for rallying the cities against rebels.',
  ],
  s1168: [
    'Muslim rebels rose at Kurukara Usu and elsewhere; government troops were defeated.',
    'Muslims rebelled at Kurukara Usu and elsewhere and beat government troops.',
  ],
  s1169: [
    'Day jiawu: Lin Xing was ordered to handle boundary affairs at Uliassutai.',
    'On jiawu, Lin Xing was assigned Uliassutai boundary work.',
  ],
  s1170: [
    'Day yiwei: Sengge Rinchen\'s bandit suppression failed; Grand Commander Bayang\'a and others died.',
    'On yiwei, Sengge Rinchen\'s campaign failed and Bayang\'a was killed.',
  ],
  s1171: [
    'Day bingshen: Lei Zhengkui\'s attack on Lianhuacheng failed; Muslim rebels again took Guyuan.',
    'On bingshen, Lei Zhengkui failed at Lianhuacheng and Guyuan fell again.',
  ],
  s1172: [
    'Day dingyou: He and Di Muslim rebels raided Lanzhou and Jinxian.',
    'On dingyou, He and Di Muslims raided Lanzhou and Jinxian.',
  ],
  s1173: [
    'Ninth month, day jihai, new moon: Liu Mingchuan\'s various units defeated bandits who had fled into Ningguo and elsewhere.',
    'On the ninth month\'s jihai new moon, Liu Mingchuan routed fugitives in Ningguo and nearby.',
  ],
  s1174: [
    'Day gengzi: Jiangxi troops recovered Yudu.',
    'On gengzi, Jiangxi forces retook Yudu.',
  ],
  s1175: [
    'Li Yunlin was stripped of office for feigning illness to evade duty, and the Long army under his command was withdrawn.',
    'Li Yunlin lost office for sham illness and his Long command was disbanded.',
  ],
  s1176: [
    'Day renyin: Zeng Guoquan begged exemption on grounds of illness; this was granted.',
    'On renyin, ill Zeng Guoquan\'s plea to leave office was granted.',
  ],
  s1177: [
    'Ma Xinyi was appointed Zhejiang governor but was retained to manage Anqing defense affairs.',
    'Ma Xinyi became Zhejiang governor yet stayed to handle Anqing defense.',
  ],
  s1178: [
    'Day guimao: Mutushan was ordered to assist in Duxing\'a\'s military affairs.',
    'On guimao, Mutushan was assigned to help Duxing\'a\'s command.',
  ],
  s1179: [
    'Day jiachen: Yang Yuebin begged leave on grounds of illness; a warm edict urged him to stay.',
    'On jiachen, ill Yang Yuebin sought leave but was warmly told to remain.',
  ],
  s1180: [
    'Li Shixian attacked Nan\'an; government troops drove him off.',
    'Li Shixian struck Nan\'an but was repulsed.',
  ],
  s1181: [
    'Day yisi: Muslim rebels took Yarkand; Acting Assistant Commissioner Kui Dong died; Kashgar and Yengisar garrison officers rebelled together.',
    'On yisi, Muslims took Yarkand, Kui Dong was killed, and Kashgar and Yengisar garrisons mutinied.',
  ],
  s1182: [
    'Day jiyou: Xining\'s Muslim populace submitted.',
    'On jiyou, Xining Muslims surrendered.',
  ],
  s1183: [
    'Day gengxu: Zhangjiachuan Muslim rebels attacked Qingyang.',
    'On gengxu, Zhangjiachuan Muslims raided Qingyang.',
  ],
  s1184: [
    'Day xinhai: Jiangxi bandits fled into Nanxiong.',
    'On xinhai, Jiangxi rebels crossed into Nanxiong.',
  ],
  s1185: [
    'Day renzi: Cantonese bandits took Kaihua and fled into Jiangxi.',
    'On renzi, Cantonese rebels seized Kaihua and crossed into Jiangxi.',
  ],
  s1186: [
    'Huang and Ma bandits fled into Shangcheng.',
    'Huang and Ma rebels entered Shangcheng.',
  ],
  s1187: [
    'Day yimao: a treaty with Spain was concluded.',
    'On yimao, the Spanish treaty was ratified.',
  ],
  s1188: [
    'Day bingchen: the Imperial Household was ordered to strive hard for economy.',
    'On bingchen, the Imperial Household was told to practice strict thrift.',
  ],
  s1189: [
    'Zhakteonga was ordered to act as Hami commissioner.',
    'Zhakteonga was made acting Hami commissioner.',
  ],
  s1190: [
    'Day dingsi: Xining Muslim rebels rebelled again.',
    'On dingsi, Xining Muslims rose again.',
  ],
  s1191: [
    'Day wuwu: Cantonese bandits including Cai Derong fled into and took Jiezhou.',
    'On wuwu, Cantonese rebels led by Cai Derong seized Jiezhou.',
  ],
  s1192: [
    'Day gengshen: an edict ordered repair of the Confucian temple at Qufu and provincial school temples.',
    'On gengshen, Qufu\'s Confucian temple and provincial academies were ordered repaired.',
  ],
  s1193: [
    'Day xinyou: Zhejiang\'s sea dikes were repaired.',
    'On xinyou, Zhejiang\'s coastal dikes were rebuilt.',
  ],
  s1194: [
    'Day jiazi: Nian bandits fled into Qishui; Hubei troops were defeated; Grand Commander Shi Qingji died.',
    'On jiazi, Nian rebels entered Qishui, Hubei forces were beaten, and Shi Qingji was killed.',
  ],
  s1195: [
    'Day yichou: Russian troops intruded into the Altai lakes region.',
    'On yichou, Russian troops entered the Altai lake country.',
  ],
  s1196: [
    'Day dingmao: Shen Guifen memorialized raising funds to move garrisons and colonies to relieve bannermen.',
    'On dingmao, Shen Guifen urged funded garrison transfers to aid banner communities.',
  ],
  s1197: [
    'Tenth month, winter, day wuchen, new moon: Yang Yuebin was permitted to return home to visit kin and also to recruit braves for Gansu.',
    'On the tenth month\'s wuchen new moon, Yang Yuebin was allowed home leave and to raise volunteers for Gansu.',
  ],
  s1198: [
    'Minister of Punishments Miansen and Vice Minister of Revenue Wu Tingdong were sent to try the Chahar case.',
    'Miansen and Wu Tingdong were dispatched to judge the Chahar affair.',
  ],
  s1199: [
    'Day jisi: Urumqi Commander Wenxiang\'s name was changed to Wenqi.',
    'On jisi, Urumqi Commander Wenxiang was renamed Wenqi.',
  ],
  s1200: [
    'Day xinwei: General Changqing was stripped of office; Mingxu replaced him, and Lianjie was made assistant commissioner.',
    'On xinwei, Changqing was dismissed, Mingxu replaced him, and Lianjie became assistant commissioner.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b12.mjs <translation.json>'
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
