#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'Shaoyuan held the perilous city alone; over several years he fought more than a hundred battles and fell when his strength was exhausted.',
    'Wen Shaoyuan alone held Liuhe through peril, fought a hundred-odd battles over years, and fell when spent.',
  ],
  s1102: [
    'The Emperor mourned him, posthumously granted the rank of provincial administrative commissioner, gave generous bereavement grace, and had a temple built with a posthumous title.',
    'The Emperor mourned him, posthumously made him administrative commissioner, granted generous relief, and built a temple with posthumous honors.',
  ],
  s1103: [
    'Winter, tenth month, new moon on day guimao: bandits rose in Ninghai, Zhejiang; Admiral Alinbao suppressed them.',
    'In winter, month 10, guimao new moon, Ninghai bandits were pacified by Admiral Alinbao.',
  ],
  s1104: [
    'On day yisi, Sheng Bao memorialized the recovery of Tianchang; Li Zhaoshou had rendered distinguished service in the affair.',
    'On yisi day, Sheng Bao reported Tianchang retaken and praised Li Zhaoshou\'s service.',
  ],
  s1105: [
    'An edict replied: "Li Zhaoshou is granted the name Li Shizhong, given third-rank insignia and peacock feather, and appointed colonel."',
    'The court ruled Li Zhaoshou would be named Li Shizhong, given third rank and peacock feather, and made colonel.',
  ],
  s1106: [
    'On day jiyou, Censor Meng Chuanjin memorialized impeaching graduate Ping Ling for ink-script mismatch; Zaiyuan and Duhua were assigned to investigate thoroughly.',
    'On jiyou, Meng Chuanjin impeached Ping Ling for exam ink fraud; Zaiyuan and Duhua were ordered to investigate.',
  ],
  s1107: [
    'On day dingsi, Sengge Rinchen memorialized that Tianjin forts were completed.',
    'On dingsi day, Sengge Rinchen reported Tianjin forts finished.',
  ],
  s1108: [
    'The Emperor praised this and granted imperial robes.',
    'The Emperor praised him and gave imperial dress.',
  ],
  s1109: [
    'On day jiwei, Jiangnan government troops recovered Lishui.',
    'On jiwei day, Jiangnan forces retook Lishui.',
  ],
  s1110: [
    'On day renxu, Li Xubin was ordered to assist Sheng Bao in managing Anhui military affairs.',
    'On renxu day, Li Xubin was assigned to help Sheng Bao with Anhui affairs.',
  ],
  s1111: [
    'On day wuchen, an edict stated that this year\'s provincial examination chief and associate examiners had been absurd to the extreme—more than fifty papers that should have been failed still passed the re-examination; chief examiner Baozhan was first dismissed from office, and associate examiners Zhu Fengbiao and Cheng Tinggui were temporarily removed pending investigation.',
    'On wuchen, the court denounced the provincial examiners\' absurdity—fifty failed papers had passed re-check; Baozhan was dismissed and Zhu Fengbiao and Cheng Tinggui suspended pending inquiry.',
  ],
  s1112: [
    'Prince Zhuang Yiren was ordered to study and serve among grand ministers before the throne.',
    'Prince Zhuang Yiren was assigned to train among imperial presence grand ministers.',
  ],
  s1113: [
    'Eleventh month, new moon on day renshen: Jilin cavalry was transferred to reinforce Yuan Jiasan\'s army.',
    'In month 11, renshen new moon, Jilin horse troops reinforced Yuan Jiasan.',
  ],
  s1114: [
    'On day yihai, Yuan Jiasan requested levies from Shandong\'s eastern three prefectures to aid army pay; this was approved.',
    'On yihai day, Yuan Jiasan won levy rights in eastern Shandong to fund the army.',
  ],
  s1115: [
    'On day jimao, Xu Zechun died; Zhu Yun was made Minister of Rites and Zhang Xianghe Left Censor-in-Chief.',
    'On jimao day, Xu Zechun died; Zhu Yun took rites and Zhang Xianghe the left censorate.',
  ],
  s1116: [
    'On day yiyou, troops aiding Fujian and Zhejiang recovered Pucheng and Shunchang; Zhou Tianpei was given grand commander rank.',
    'On yiyou day, Fujian-Zhejiang relief forces retook Pucheng and Shunchang; Zhou Tianpei gained grand commander rank.',
  ],
  s1117: [
    'On day bingxu, Hengfu memorialized a great government victory over Nian bandits and that Henan was pacified; Brigadier Fu Zhenbang was promoted to grand commander, and Compiler Yuan Baoheng was granted the Batulu brave title.',
    'On bingxu day, Hengfu reported Henan cleared of Nian rebels; Fu Zhenbang became grand commander and Yuan Baoheng gained a Batulu title.',
  ],
  s1118: [
    'On day dingyou, the Grand Secretariat duplicate archive was robbed.',
    'On dingyou day, the Grand Secretariat duplicate vault was burgled.',
  ],
  s1119: [
    'On day jihai, Wu Zhendong was relieved for illness; Zhang Liangji was made Yunnan-Guizhou governor-general and Xu Zhiming Yunnan governor.',
    'On jihai day, ill Wu Zhendong yielded to Zhang Liangji as Yunnan-Guizhou governor and Xu Zhiming as Yunnan governor.',
  ],
  s1120: [
    'On day gengzi, fallen Admiral Deng Shaoliang received generous bereavement grace and a memorial temple.',
    'On gengzi day, fallen Admiral Deng Shaoliang was mourned with relief and a temple.',
  ],
  s1121: [
    'Twelfth month, day dingwei: Song Chancellor Lu Xiufu was admitted to secondary sacrifice at the Confucian temple.',
    'In month 12, dingwei, Lu Xiufu joined Confucian temple sacrifice.',
  ],
  s1122: [
    'On day gengchen, Admiral Li Chaobin recovered Dongliu and Jiande in Anhui and was granted the Batulu brave title.',
    'On gengchen day, Li Chaobin retook Dongliu and Jiande and gained a Batulu title.',
  ],
  s1123: [
    'Yongzhou garrison commander Fan Xie was impeached and dismissed for riding in a sedan chair.',
    'Fan Xie lost his Yongzhou command for using a sedan chair.',
  ],
  s1124: [
    'On day bingchen, Zheng Kuishi was made Zhejiang grand commander to supervise Ningguo military affairs.',
    'On bingchen day, Zheng Kuishi became Zhejiang commander to handle Ningguo affairs.',
  ],
  s1125: [
    'On day jiwei, Li Xubin advanced into Anhui, was defeated at Sanheji, and died; he was posthumously made governor-general, with a temple and posthumous title.',
    'On jiwei day, Li Xubin died in defeat at Sanheji; he was posthumously made governor-general with temple honors.',
  ],
  s1126: [
    'Subprefect Zeng Guohua was posthumously made circuit intendant with a posthumous title.',
    'Zeng Guohua was posthumously made circuit intendant and titled.',
  ],
  s1127: [
    'On day dingmao, He Guiqing was made Imperial Commissioner to handle trade affairs.',
    'On dingmao day, He Guiqing became Imperial Commissioner for trade.',
  ],
  s1128: [
    'Zhao Dezhe was dismissed; Xu Youren was made Jiangsu governor.',
    'Zhao Dezhe left office; Xu Youren took Jiangsu.',
  ],
  s1129: [
    'On day gengwu, Ruilin was made grand secretary; Suishun became Minister of Revenue, Lin Kui Minister of Rites, and Ruichang Minister of Punishments.',
    'On gengwu day, Ruilin entered the grand secretariat; Suishun, Lin Kui, and Ruichang took revenue, rites, and punishments.',
  ],
  s1130: [
    'The autumnal collective sacrifice was performed at the Imperial Ancestral Temple.',
    'Autumn joint sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s1131: [
    'That year, quota taxes were remitted for ninety-two districts in Zhili, Anhui, Fujian, Hubei, Guizhou, and elsewhere stricken by disaster or bandits; Jiangsu salt levies at six fields were also remitted in varying degrees.',
    'That year, taxes were forgiven in ninety-two disaster- or bandit-struck districts and Jiangsu salt dues partly remitted.',
  ],
  s1132: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s1133: [
    'Ninth year, spring, first month, new moon on day renshen: Gui Liang and others memorialized that the English used Guangdong affairs as a pretext to break off talks and return south.',
    'In year 9, spring, renshen new moon, Gui Liang reported the English quit talks citing Guangdong troubles.',
  ],
  s1134: [
    'On day yihai, Yuan Jiasan was summoned to the capital; Fu Zhenbang was placed in command over three provinces\' Nian suppression, with Yixing\'a as deputy.',
    'On yihai day, Yuan Jiasan was recalled; Fu Zhenbang commanded three provinces\' Nian campaigns with Yixing\'a assisting.',
  ],
  s1135: [
    'On day renwu, Jiangxi government troops recovered Ruijin and lifted the siege of Anyuan; other bandits took Nan\'an.',
    'On renwu day, Jiangxi forces retook Ruijin and relieved Anyuan while Nan\'an fell elsewhere.',
  ],
  s1136: [
    'Gui Liang and others memorialized four treaty items.',
    'Gui Liang reported four treaty points.',
  ],
  s1137: [
    'An edict ordered awaiting the English envoy\'s return to Shanghai for proper negotiation.',
    'The court ordered talks to await the envoy\'s return to Shanghai.',
  ],
  s1138: [
    'On day gengyin, Fujian rebels including Zhou Huangxi submitted, and Liancheng was recovered.',
    'On gengyin day, Zhou Huangxi and other Fujian rebels submitted and Liancheng was retaken.',
  ],
  s1139: [
    'On day yiwei, Anhui government troops recovered Jiande.',
    'On yiwei day, Anhui forces retook Jiande.',
  ],
  s1140: [
    'On day dingyou, Hubei was ordered to purchase horses and train cavalry.',
    'On dingyou day, Hubei was told to buy horses and train cavalry.',
  ],
  s1141: [
    'On day wuxu, Gui Liang and others memorialized that the English envoy insisted on entering Beijing.',
    'On wuxu day, Gui Liang reported the English envoy demanded entry to Beijing.',
  ],
  s1142: [
    'An edict ordered Sengge Rinchen to guard the sea mouth strictly.',
    'The court ordered Sengge Rinchen to hold the coastal forts.',
  ],
  s1143: [
    'On day xinchou, Duxing\'a took leave; Duolong\'a took over his army.',
    'On xinchou day, Duxing\'a went on leave and Duolong\'a took his command.',
  ],
  s1144: [
    'An edict ordered grain-transport ships on the sea route to scout and avoid foreign steamers.',
    'The court told grain ships to watch for and avoid foreign steamers.',
  ],
  s1145: [
    'Second month, day dingwei: Nian chieftain Xue Zhiyuan surrendered at Jiangpu; joining Li Shizhong\'s capture of Pukou, he was granted the name Xue Chengliang, given peacock feather and third-rank insignia, and Li Shizhong was promoted to deputy commander.',
    'In month 2, dingwei, Xue Zhiyuan surrendered at Jiangpu; with Pukou taken, he became Xue Chengliang with third rank and peacock feather, and Li Shizhong was made deputy commander.',
  ],
  s1146: [
    'On day guichou, coastal forts were built in Fengtian.',
    'On guichou day, Fengtian coastal batteries were built.',
  ],
  s1147: [
    'Zheng Kuishi captured rebel fortifications at Wanzhi and Huangchi.',
    'Zheng Kuishi took rebel forts at Wanzhi and Huangchi.',
  ],
  s1148: [
    'On day jiayin, the Emperor summoned court ministers and announced the crimes in the wuwu examination scandal; following Zaiyuan and Duhua\'s recommendations, chief examiner Grand Secretary Baozhan was sentenced to death for having servants switch papers and alter marking slips in the middle exam halls.',
    'On jiayin day, the Emperor announced the wuwu exam scandal; Baozhan was beheaded for servants swapping papers per Zaiyuan and Duhua\'s finding.',
  ],
  s1149: [
    'Associate examiner Pu An was sentenced to death for obeying Li Heling\'s bribery requests, and Luo Hongyi to death for bribing his way to success.',
    'Pu An was beheaded for taking Li Heling\'s bribes and Luo Hongyi for buying his pass.',
  ],
  s1150: [
    'On day yimao, Zhang Fei memorialized government troops\' capture of Wuyuan; bandit leaders including Zhang Congxiang begged to surrender.',
    'On yimao day, Zhang Fei reported Wuyuan taken and Zhang Congxiang and other leaders sought surrender.',
  ],
  s1151: [
    'On day dingsi, Weng Tongshu memorialized that bandits took Lu\'an.',
    'On dingsi day, Weng Tongshu reported Lu\'an fallen.',
  ],
  s1152: [
    'Qingqi died; Hengfu was made Zhili governor-general and Yingqi Henan governor.',
    'Qingqi died; Hengfu became Zhili governor-general and Yingqi Henan governor.',
  ],
  s1153: [
    'On day guihai, Zhang Guoliang memorialized capturing Yangzhou and Yizheng and, on the return march, retaking Lishui in succession.',
    'On guihai day, Zhang Guoliang took Yangzhou and Yizheng and retook Lishui on the march back.',
  ],
  s1154: [
    'A special edict praised and rewarded him, granting hereditary Commandant of Light Chariots rank; Li Ruozhu was given a yellow jacket.',
    'Special praise granted Zhang Guoliang hereditary commandant rank; Li Ruozhu received a yellow jacket.',
  ],
  s1155: [
    'On day yichou, Zeng Guofan memorialized his army reaching Nankang; Xiao Qijiang recovered Nan\'an.',
    'On yichou day, Zeng Guofan reached Nankang and Xiao Qijiang retook Nan\'an.',
  ],
  s1156: [
    'An edict praised this; Xiao Qijiang was granted the Batulu brave title.',
    'The court praised them and gave Xiao Qijiang a Batulu title.',
  ],
  s1157: [
    'An edict ordered Compiler Li Hongzhang attached to Yixing\'a for assignment.',
    'Li Hongzhang was assigned to Yixing\'a\'s staff.',
  ],
  s1158: [
    'Third month, new moon on day xinwei: former provincial commissioner Li Mengqun\'s army was routed at Guanting and he died; his office was restored and bereavement granted.',
    'In month 3, xinwei new moon, Li Mengqun was killed when routed at Guanting; his rank was posthumously restored.',
  ],
  s1159: [
    'On day jiaxu, Yishan and Jingchun memorialized Russians going straight to the Ussuri and Suifen rivers to choose sites and build houses, and requesting a joint survey; an edict refused.',
    'On jiaxu day, Yishan reported Russians building on the Ussuri and Suifen; joint survey was refused.',
  ],
  s1160: [
    'On day bingzi, Nian bandits attacked Xihua and Wuyin in Henan; former brigadier Qiu Lian\'en died; he was posthumously made grand commander with bereavement.',
    'On bingzi day, Nian rebels struck Henan; Qiu Lian\'en was killed and posthumously made grand commander.',
  ],
  s1161: [
    'On day dingchou, Gui Liang and others memorialized English warships going north; orders to stop them were not heeded.',
    'On dingchou day, Gui Liang reported English ships heading north despite orders to halt.',
  ],
  s1162: [
    'On day jimao, Sichuan Litang headmen rebelled; En Qing suppressed them and executed their chieftain Deng Zhu.',
    'On jimao day, Litang headmen rebelled; En Qing crushed them and killed Deng Zhu.',
  ],
  s1163: [
    'On day jiashen, the Emperor prayed for rain.',
    'On jiashen day, the Emperor prayed for rain.',
  ],
  s1164: [
    'On day gengyin, because of drought he sought memorials and advice.',
    'On gengyin day, drought prompted a call for counsel.',
  ],
  s1165: [
    'On day xinmao, Li Jun died; Huang Zantang was made Grand Canal governor-general of the Eastern Rivers.',
    'On xinmao day, Li Jun died; Huang Zantang took the Eastern Canal post.',
  ],
  s1166: [
    'On day yiwei, Russians were allowed to trade on the Amur tax-free, but forbidden to intrude into the Ussuri and Suifen.',
    'On yiwei day, Russians traded tax-free on the Amur but could not enter the Ussuri or Suifen.',
  ],
  s1167: [
    'Summer, fourth month, new moon on day xinchou: Sheng Bao memorialized recovery of Lu\'an.',
    'In summer, month 4, xinchou new moon, Sheng Bao reported Lu\'an retaken.',
  ],
  s1168: [
    'Yixing\'a was relieved from assisting; Guanbao was assigned to assist Fu Zhenbang\'s military affairs.',
    'Yixing\'a left the staff; Guanbao joined Fu Zhenbang\'s command.',
  ],
  s1169: [
    'On day renyin, Wang Qingyun was transferred as Liangguang governor-general and Huang Zonghan as Sichuan governor-general.',
    'On renyin day, Wang Qingyun took Liangguang and Huang Zonghan Sichuan.',
  ],
  s1170: [
    'Jiangxi bandits fled into Chenzhou and Guiyang in Hunan; Liu Changyou drove them off.',
    'Jiangxi rebels entered Hunan; Liu Changyou repulsed them.',
  ],
  s1171: [
    'On day guimao, Sheng Bao memorialized Nian chieftain Zhang Yuanlong\'s surrender and recovery of Fengyang prefecture and county and Linhuai Pass.',
    'On guimao day, Sheng Bao reported Zhang Yuanlong\'s surrender and Fengyang and Linhuai retaken.',
  ],
  s1172: [
    'Ninghe forts were built.',
    'Ninghe batteries were constructed.',
  ],
  s1173: [
    'On day wushen, bandits rose in Yuyao, Zhejiang; they were suppressed.',
    'On wushen day, Yuyao bandits were pacified.',
  ],
  s1174: [
    'On day jiayin, Russian envoy Saishan entered Beijing by land through Chahar and requested guns and cannon, which were sent to Kyakhta.',
    'On jiayin day, Russia\'s Saishan reached Beijing overland and obtained arms sent via Kyakhta.',
  ],
  s1175: [
    'On day bingchen, the Emperor again prayed for rain.',
    'On bingchen day, the Emperor prayed for rain again.',
  ],
  s1176: [
    'On day jiwei, Shao Can was relieved for illness; Yuan Jiasan acted as Grand Canal transport governor-general.',
    'On jiwei day, ill Shao Can was replaced by Yuan Jiasan acting as canal transport governor-general.',
  ],
  s1177: [
    'Luo Chongguang was transferred as Guangdong governor and also acting governor-general.',
    'Luo Chongguang became Guangdong governor and acting governor-general.',
  ],
  s1178: [
    'Bandits took Tianchang; former Admiral De\'an died; his office was restored and bereavement granted.',
    'Tianchang fell; former Admiral De\'an was killed and posthumously honored.',
  ],
  s1179: [
    'On day xinyou, Yishan memorialized Russian ships entering the Songhua from the Amur and sailing east to sea.',
    'On xinyou day, Yishan reported Russian ships entering the Songhua from the Amur bound for sea.',
  ],
  s1180: [
    'An edict replied: entry into Suifen was not permitted; Te Puqin was ordered to send men to block them.',
    'The court forbade Suifen entry and told Te Puqin to block the ships.',
  ],
  s1181: [
    'On day renxu, Wang Yide was dismissed; Qingduan was made Fujian-Zhejiang governor-general and Luo Zundian Fujian governor.',
    'On renxu day, Wang Yide left office; Qingduan took Fujian-Zhejiang and Luo Zundian Fujian.',
  ],
  s1182: [
    'On day guihai, it rained.',
    'On guihai day, rain fell.',
  ],
  s1183: [
    'On day yichou, Sun Jianai and one hundred eighty others were granted jinshi degrees and court ranks in varying grades.',
    'On yichou day, Sun Jianai and 180 others received jinshi ranks.',
  ],
  s1184: [
    'On day wuchen, Guangdong government troops recovered Jiaying; fleeing bandits harassed Lianping and took Lechang.',
    'On wuchen day, Guangdong retook Jiaying; fleeing rebels took Lechang after raiding Lianping.',
  ],
  s1185: [
    'Fifth month, day bingzi: an edict ordered Luo Bingzhang still to send Tian Xingyu back to aid Guizhou and to withdraw Zhao Chen\'s army.',
    'In month 5, bingzi, Luo Bingzhang was told to send Tian Xingyu to Guizhou and pull back Zhao Chen\'s force.',
  ],
  s1186: [
    'On day jimao, Yishan was ordered to correct the Russian treaty.',
    'On jimao day, Yishan was told to revise the Russian treaty.',
  ],
  s1187: [
    'On day xinsi, Qingyun was ordered secretly to investigate Russians residing at Zhangjiakou and Baicheng.',
    'On xinsi day, Qingyun was told to investigate Russians at Zhangjiakou and Baicheng.',
  ],
  s1188: [
    'On day renwu, Zhou Tianshou was placed in command of Ningguo military affairs.',
    'On renwu day, Zhou Tianshou took over Ningguo operations.',
  ],
  s1189: [
    'On day jiashen, Russians requested to trade at Sanxing.',
    'On jiashen day, Russians asked to trade at Sanxing.',
  ],
  s1190: [
    'An edict rebuked Yishan for weak handling, stripped Vice Banner Commander Jilaming\'a of office, and had him cangued at the Ussuri.',
    'The court scolded Yishan\'s weakness, dismissed Jilaming\'a, and cangued him on the Ussuri.',
  ],
  s1191: [
    'On day gengyin, Guan Wen memorialized intelligence that Shi Dakai would invade Sichuan; Zeng Guofan was ordered to move his army to Kuizhou.',
    'On gengyin day, Guan Wen reported Shi Dakai bound for Sichuan; Zeng Guofan was sent to Kuizhou.',
  ],
  s1192: [
    'On day xinmao, Gui Liang and Hua Shana memorialized the English chief would weigh anchor on the thirteenth of this month and enter Beijing; Gui Liang and others immediately rushed back to the capital by courier post.',
    'On xinmao day, Gui Liang reported the English would sail for Beijing on the 13th and raced back by post.',
  ],
  s1193: [
    'Grand Secretary Weng Xincun requested retirement; this was granted.',
    'Weng Xincun retired from the grand secretariat.',
  ],
  s1194: [
    'Jia Zhen was again made grand secretary.',
    'Jia Zhen rejoined the grand secretariat.',
  ],
  s1195: [
    'Xu Naipu was transferred as Minister of Personnel, Zhang Xianghe Minister of Works, and Shen Zhaolin Left Censor-in-Chief.',
    'Xu Naipu took personnel, Zhang Xianghe works, and Shen Zhaolin the left censorate.',
  ],
  s1196: [
    'On day guisi, Luo Bingzhang memorialized Shi Dakai fleeing into Hunan; armies under Liu Changyou, Jiang Zhongyi, and Tian Xingyu drove him off.',
    'On guisi day, Luo Bingzhang reported Shi Dakai in Hunan driven off by Liu Changyou and others.',
  ],
  s1197: [
    'On day bingshen, Sengge Rinchen memorialized English ships firing cannon and forcing entry at Dagu; our forces opened fire and sank many ships; infantry also landed to skirmish; our troops pressed forward fiercely and killed several hundred; their commander surnamed He was wounded by cannon.',
    'On bingshen day, Sengge Rinchen reported English ships forced Dagu; Qing guns sank many and killed hundreds, wounding their leader He.',
  ],
  s1198: [
    'Our forces also lost Admiral Shi Rongchun, Deputy Commander Long Ruyuan, and others.',
    'Qing losses included Admiral Shi Rongchun and Deputy Commander Long Ruyuan.',
  ],
  s1199: [
    'The foreign ships immediately left the estuary.',
    'The foreign ships withdrew at once.',
  ],
  s1200: [
    'An edict replied: "Officers and men acted in concert with exceptional valor; reward five thousand taels of silver first, and report names for commendation after investigation."',
    'The court granted five thousand taels for exceptional valor and ordered commendations after review.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b12.mjs <translation.json>'
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
