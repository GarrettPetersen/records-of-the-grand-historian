#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'Summer, fourth month, day bingwu: zaisang Abaghas of Erlin Khabsargal and others came to submit.',
    'In the fourth month, Abaghas of Erlin Khabsargal and other zaisangs submitted.',
  ],
  s1102: [
    'On day renzi, retired Grand Guardian and Grand Secretary Zhang Tingyu died; he was ordered enshrined in the Grand Temple according to the Yongzheng Emperor\'s testamentary edict.',
    'On renzi day, Zhang Tingyu died and was ordered enshrined in the Grand Temple per Yongzheng\'s will.',
  ],
  s1103: [
    'On day jiayin, Hu Zhongzao was executed.',
    'On jiayin day, Hu Zhongzao was executed.',
  ],
  s1104: [
    'On day yichou, Turpan bek Manggarlik came to submit.',
    'On yichou day, Turpan bek Manggarlik submitted.',
  ],
  s1105: [
    'Land tax was remitted for three saltern fields at Changlu Yongli and Haifeng county for flood disaster.',
    'Flood land tax was remitted at Changlu salterns and Haifeng.',
  ],
  s1106: [
    'On day bingyin, land tax was remitted for sixteen prefectures and counties including Huimin in Shandong for flood disaster.',
    'On bingyin day, Shandong flood land tax was remitted in sixteen districts.',
  ],
  s1107: [
    'On day dingmao, Zunghar taiji Gombozhab and Muslim begs of Ye\'erqiang and other regions came to submit.',
    'On dingmao day, Gombozhab and Ye\'erqiang Muslim begs submitted.',
  ],
  s1108: [
    'On day wuchen, Ryukyu crown prince Shang Mu sent envoys with tribute requesting investiture; this was granted.',
    'On wuchen day, Ryukyu requested investiture for the crown prince and was approved.',
  ],
  s1109: [
    'On day renshen, Jasak zaisang Qiba Khan came to submit.',
    'On renshen day, Qiba Khan submitted.',
  ],
  s1110: [
    'Fifth month, new moon on jiaxu: land tax was remitted for nineteen prefectures, counties, and guards including Shouzhou in Anhui for flood disaster.',
    'In the fifth month, Anhui flood land tax was remitted in nineteen districts.',
  ],
  s1111: [
    'The Khalkha Tüsiyetü Khan deputy general Gong\'er Babamupile was stripped of rank and kept at camp to serve; Jasak Prince Demuchuke replaced him.',
    'Gong\'er Babamupile lost his rank and Demuchuke became jasak prince in his place.',
  ],
  s1112: [
    'On day wuyin, flood relief was given to seven prefectures and counties including Chengde in Fengtian.',
    'On wuyin day, Fengtian flood districts including Chengde were relieved.',
  ],
  s1113: [
    'On day gengchen, Hanlin Academician-in-Waiting Quan Kui and Compiler Zhou Huang were sent to Ryukyu for investiture.',
    'On gengchen day, Quan Kui and Zhou Huang were sent to invest the Ryukyu king.',
  ],
  s1114: [
    'On day xinsi, Hotong Ermegen zaisang Ejete and others came to submit.',
    'On xinsi day, Ejete and other zaisangs submitted.',
  ],
  s1115: [
    'On day rewu, Kutuqinar zaisang Sasei came to submit.',
    'On rewu day, Sasei submitted.',
  ],
  s1116: [
    'On day jiashen, Dzungar zaisang Urum came to submit.',
    'On jiashen day, the Dzungar zaisang Urum submitted.',
  ],
  s1117: [
    'On day wuzi, Altai khin otok zaisang Ta\'erba came to submit.',
    'On wuzi day, Ta\'erba submitted.',
  ],
  s1118: [
    'On day jichou, Dawachi fled to Tekesi.',
    'On jichou day, Dawachi fled to Tekesi.',
  ],
  s1119: [
    'On day gengyin, Shi Yizhi retired at his original rank.',
    'On gengyin day, Shi Yizhi retired at his former rank.',
  ],
  s1120: [
    'Echang was granted suicide.',
    'Echang was ordered to take his own life.',
  ],
  s1121: [
    'On day xinmao, Huang Tinggui was made Grand Secretary of the Wuying Hall, remaining Sichuan governor-general.',
    'On xinmao day, Huang Tinggui became Wuying Grand Secretary while keeping Sichuan.',
  ],
  s1122: [
    'Wang Anguo was moved to Minister of Personnel; Yang Xizhen was made Minister of Rites and He Guozong Censor-in-Chief.',
    'Wang Anguo, Yang Xizhen, and He Guozong received central ministry posts.',
  ],
  s1123: [
    'Chen Hongmou was moved to Hunan governor; Wu Dashan was made Gansu governor and Tu\'erbinge\'a Henan governor.',
    'Chen Hongmou, Wu Dashan, and Tu\'erbinge\'a were appointed provincial governors.',
  ],
  s1124: [
    'On day renchen, Amursana memorialized that Ili had been secured; Amursana was rewarded with a prince\'s double stipend and his son enfeoffed as heir.',
    'On renchen day, Amursana reported securing Ili and received princely rewards for himself and his son.',
  ],
  s1125: [
    'Ban Di and Saral were promoted to first-rank duke and Mamute to third-rank duke.',
    'Ban Di and Saral became first-rank dukes and Mamute a third-rank duke.',
  ],
  s1126: [
    'Sebten Baljur was rewarded with a prince\'s double stipend.',
    'Sebten Baljur received a prince\'s double stipend.',
  ],
  s1127: [
    'Zalafeng\'a was enfeoffed as prince; Chebudengzhab and Pu\'erpu were made beile.',
    'Zalafeng\'a became prince and Chebudengzhab and Pu\'erpu became beile.',
  ],
  s1128: [
    'Che Ling was rewarded with a prince\'s double stipend.',
    'Che Ling received a prince\'s double stipend.',
  ],
  s1129: [
    'Che Ling Ubashi, Banzhu\'er, and Nemuku were enfeoffed as princes; Celengmengke was made a prince of the second degree.',
    'Several Mongol leaders were enfeoffed as princes and Celengmengke as a commandery prince.',
  ],
  s1130: [
    'Fu Heng was again granted the rank of first-rank duke.',
    'Fu Heng was again made a first-rank duke.',
  ],
  s1131: [
    'Grand Councilors and others were all rewarded with preferential treatment according to merit.',
    'Grand Councilors and others received differentiated rewards.',
  ],
  s1132: [
    'Flood relief was given in Jiangsu prefectures and counties including Qinghe and Tongshan.',
    'Jiangsu flood districts including Qinghe and Tongshan were relieved.',
  ],
  s1133: [
    'On day guisi, Daledang\'a was summoned to the capital to assist the Grand Secretariat; Chuoleduo acted as Heilongjiang general.',
    'On guisi day, Daledang\'a was called to Beijing and Chuoleduo acted at Heilongjiang.',
  ],
  s1134: [
    'Grand Secretary Fu Heng declined the ducal title; permission was granted.',
    'Fu Heng declined his ducal rank and was allowed to do so.',
  ],
  s1135: [
    'Ban Di was enfeoffed as Duke Chengyong, Saral as Duke Chaoyong, and Mamute as Duke Xinyong.',
    'Ban Di, Saral, and Mamute received new ducal titles.',
  ],
  s1136: [
    'Sixth month, new moon on guimao: because the Dzungar region had been pacified, sacrifice was reported at the Grand Temple and officers were sent to report at Heaven, Earth, the altars of soil and grain, and to Confucius.',
    'In the sixth month, pacification of Dzungaria was announced with sacrifices at the Grand Temple and major altars.',
  ],
  s1137: [
    'The four Uriankhai leagues were ordered organized like the Khalkha, each tribe to have one league chief and one deputy general.',
    'Four Uriankhai leagues were given Khalkha-style league chiefs and deputy generals.',
  ],
  s1138: [
    'On day bingwu, Amursana memorialized that his troops reached Geden Mountain and greatly defeated Dawachi\'s army.',
    'On bingwu day, Amursana reported a great victory over Dawachi at Geden Mountain.',
  ],
  s1139: [
    'Qarabalatur Ayusi, Batujiergale, Chahashi, and others were enfeoffed as barons and made honorary grand ministers; the rest were rewarded variously.',
    'Ayusi, Batujiergale, Chahashi, and others became barons with other rewards.',
  ],
  s1140: [
    'On day jiyou, the Empress Dowager was given the additional honorific Chongqing Cixuan Kanghui Dunhe Yu Shou Chongxi Empress Dowager, and an edict of grace was issued with differentiated favors.',
    'On jiyou day, the Empress Dowager received a new honorific and a grace edict was promulgated.',
  ],
  s1141: [
    'On day guichou, A Kedun was dismissed; E\'mida was made Minister of Punishments while still acting Minister of Personnel, Ali Gun acting Minister of War, and Yong Chang reduced to vice minister.',
    'On guichou day, A Kedun was dismissed and several ministers were reassigned.',
  ],
  s1142: [
    'Grand Secretary Huang Tinggui was made Shaanxi-Gansu governor-general and Kaitai was moved to Sichuan governor-general.',
    'Huang Tinggui became Shaanxi-Gansu governor-general and Kaitai went to Sichuan.',
  ],
  s1143: [
    'Liu Tongxun was summoned to the capital; Shuo Se acted as Huguang governor-general and Aibida acted as Yunnan-Guizhou governor-general.',
    'Liu Tongxun was called to Beijing while Shuo Se and Aibida acted as governors-general.',
  ],
  s1144: [
    'On day jiwei, Lobzang Danjin and others were escorted to the capital; officers were sent to report at the Grand Temple and the captive presentation rite was performed.',
    'On jiwei day, Lobzang Danjin was brought to Beijing and a captive rite was held.',
  ],
  s1145: [
    'On day gengshen, the Emperor received captives at the Meridian Gate, pardoned Lobzang Danjin, and Balang and Mengkete Mu\'er were executed.',
    'On gengshen day, captives were received at the Meridian Gate; Lobzang Danjin was spared and two others executed.',
  ],
  s1146: [
    'On day jiazi, because Ban Di and others memorialized that Amursana\'s dealings with various leaders were secretive, that he had killed Dawachi\'s zaisangs without authority, and intended to seize Ili—',
    'On jiazi day, Ban Di reported Amursana\'s secret dealings, unauthorized killings, and designs on Ili.',
  ],
  s1147: [
    'a warm edict ordered him to come at once for audience.',
    'A warm edict ordered Amursana to come immediately to court.',
  ],
  s1148: [
    'On day wuchen, Dawachi was captured and the Dzungar region was pacified.',
    'On wuchen day, Dawachi was captured and Dzungaria was pacified.',
  ],
  s1149: [
    'Autumn, seventh month, day wuyin: Durbet taiji Boshigashi and others came to submit.',
    'In the seventh month, Durbet taiji Boshigashi and others submitted.',
  ],
  s1150: [
    'On day dinghai, Wulantai was enfeoffed as baron for capturing Dawachi.',
    'On dinghai day, Wulantai became a baron for capturing Dawachi.',
  ],
  s1151: [
    'Heilongjiang General Chuoleduo was made Jingzhou general and Dase replaced him.',
    'Chuoleduo went to Jingzhou and Dase became Heilongjiang general.',
  ],
  s1152: [
    'Eighth month, day bingwu: flood and hail relief was given in seven Jiangsu prefectures and counties including Haizhou.',
    'In the eighth month, Jiangsu flood and hail districts including Haizhou were relieved.',
  ],
  s1153: [
    'On day dingwei, the Emperor accompanied the Empress Dowager on a tour to Mulan.',
    'On dingwei day, the Emperor took the Empress Dowager to Mulan.',
  ],
  s1154: [
    'On day renzi, the Emperor accompanied the Empress Dowager and halted at the Mountain Resort for Summer.',
    'On renzi day, the court halted at the Summer Mountain Resort.',
  ],
  s1155: [
    'On day jiayin, flood relief was given in twenty-two prefectures, counties, and guards including Jinxiang in Shandong.',
    'On jiayin day, Shandong flood districts including Jinxiang were relieved.',
  ],
  s1156: [
    'The Dzungar taiji Boshigashi was enfeoffed as prince.',
    'Dzungar taiji Boshigashi was made a prince.',
  ],
  s1157: [
    'On day dingsi, the Emperor accompanied the Empress Dowager to Mulan for the hunting encirclement.',
    'On dingsi day, the Emperor took the Empress Dowager to the Mulan hunt.',
  ],
  s1158: [
    'On day gengshen, Yin Jishan was summoned to Rehe.',
    'On gengshen day, Yin Jishan was called to Rehe.',
  ],
  s1159: [
    'Ninth month, new moon on renshen: land tax was remitted for three counties in Fujian Taiwan for last year\'s flood.',
    'In the ninth month, last year\'s flood land tax was remitted in three Taiwan counties.',
  ],
  s1160: [
    'On day jiaxu, the Emperor received audience at the traveling palace; Zunghar Galdan Dorji and others were received and granted a banquet.',
    'On jiaxu day, Galdan Dorji and others were received at the traveling palace and banqueted.',
  ],
  s1161: [
    'Amursana came for audience but at Wulonggu rebelled and plundered the Erqisi courier stations.',
    'Amursana rebelled at Wulonggu and raided Erqisi stations on his way to audience.',
  ],
  s1162: [
    'On day bingzi, Dzungar leaders including Abaghas rebelled.',
    'On bingzi day, Abaghas and other Dzungar leaders rebelled.',
  ],
  s1163: [
    'Yong Chang was restored as inner court minister and still handled the Pacify-the-West general\'s affairs; Celeq, Yu Bao, and Zalafeng\'a were made assistant commanders.',
    'Yong Chang resumed as inner minister for the western campaign; Celeq, Yu Bao, and Zalafeng\'a became assistants.',
  ],
  s1164: [
    'Hada Ha was ordered to remain at Uliastai and join Alan Tai in handling affairs.',
    'Hada Ha was left at Uliastai to work with Alan Tai.',
  ],
  s1165: [
    'On day dingchou, Amursana attacked Ili.',
    'On dingchou day, Amursana attacked Ili.',
  ],
  s1166: [
    'On day gengchen, an edict to win over Amursana was issued.',
    'On gengchen day, an edict offering to win over Amursana was issued.',
  ],
  s1167: [
    'On day renwu, the Emperor accompanied the Empress Dowager back to the Mountain Resort for Summer.',
    'On renwu day, the court returned to the Summer Mountain Resort.',
  ],
  s1168: [
    'On day guiwei, Galdan Dorji and others were granted court dress; Galdan Dorji was enfeoffed as Khan of the Zunghars, Che Ling as Khan of the Durbets, Shakdu Ermanji as Khan of the Khoshuuds, and Bayar as Khan of the Khoid.',
    'On guiwei day, four steppe khans were enfeoffed and given court dress.',
  ],
  s1169: [
    'The Khalkha prince of the second degree Sangjai Dorji was promoted to prince of the first degree.',
    'Sangjai Dorji was promoted from commandery prince to prince.',
  ],
  s1170: [
    'Hada Ha and others were ordered to campaign against Amursana.',
    'Hada Ha and others were ordered to attack Amursana.',
  ],
  s1171: [
    'On day dinghai, Celeq was made Pacify-the-West general.',
    'On dinghai day, Celeq became Pacify-the-West general.',
  ],
  s1172: [
    'Because Khalkha Prince Bayarshidi and others captured and executed the rebel Tai Lak of Baoxin, Bayarshidi was promoted to prince, Shakdu Erzhab to beile, and Darzha Norbuzhab to beizi.',
    'Bayarshidi was promoted for capturing rebel Tai Lak; Shakdu Erzhab and Darzha Norbuzhab were also ennobled.',
  ],
  s1173: [
    'Flood victims were relieved in fifteen Zhejiang prefectures and counties including Shanyin, five saltern fields including Cao\'e, one district in Huzhou, and Jianchuan prefecture in Yunnan for this year\'s flood.',
    'Flood relief was given in Zhejiang, Huzhou, and Yunnan Jianchuan.',
  ],
  s1174: [
    'Flood victims were relieved in eight Hubei prefectures, counties, and guards including Jiangling for this year\'s flood.',
    'Hubei flood districts including Jiangling were relieved.',
  ],
  s1175: [
    'On day gengyin, Yong Chang was arrested and brought to the capital; Celeq was reduced to assistant commander and Zalafeng\'a made Pacify-the-West general.',
    'On gengyin day, Yong Chang was arrested; Celeq was demoted and Zalafeng\'a made western general.',
  ],
  s1176: [
    'Liu Tongxun abandoned Barkul and withdrew to Hami and was sharply rebuked.',
    'Liu Tongxun was rebuked for abandoning Barkul and retreating to Hami.',
  ],
  s1177: [
    'On day bingshen, Liu Tongxun was arrested and brought to the capital; Fang Guancheng was sent to the army to handle provisions and E\'mida acted as Zhili governor-general.',
    'On bingshen day, Liu Tongxun was arrested; Fang Guancheng went to the army and E\'mida acted at Zhili.',
  ],
  s1178: [
    'Galdan Dorji\'s son Norbulinchin attacked Abaghas, defeated him, and captured Demuqibanjan; he was further enfeoffed as commandery prince.',
    'Norbulinchin defeated Abaghas, took Demuqibanjan, and was promoted to commandery prince.',
  ],
  s1179: [
    'Beile Qimuku\'er was enfeoffed as commandery prince.',
    'Beile Qimuku\'er became a commandery prince.',
  ],
  s1180: [
    'Ali Gun acted as Minister of Punishments and Wang Youdun was moved to Minister of Punishments.',
    'Ali Gun acted at Punishments and Wang Youdun became Minister of Punishments.',
  ],
  s1181: [
    'On day wuxu, Minister of Revenue Haiwang died.',
    'On wuxu day, Minister of Revenue Haiwang died.',
  ],
  s1182: [
    'Winter, tenth month, new moon on xinchou: Celeq was stripped of office and arrested; Vice Censor-in-Chief Mang\'ana and Karing\'a were made Western Route leading commanders.',
    'In the tenth month, Celeq was arrested and Mang\'ana and Karing\'a led the western route.',
  ],
  s1183: [
    'On day jiachen, Wei Zhezhi was made Minister of Works and E\'bao acted as Guangxi governor.',
    'On jiachen day, Wei Zhezhi became Minister of Works and E\'bao acted in Guangxi.',
  ],
  s1184: [
    'On day wushen, flood relief was given in Zhejiang prefectures, counties, saltern fields, and other places including Kuaiji.',
    'On wushen day, Zhejiang flood districts including Kuaiji were relieved.',
  ],
  s1185: [
    'Fu De was made assistant commander.',
    'Fu De became an assistant commander.',
  ],
  s1186: [
    'On day renzi, Liu Tongxun and Celeq were pardoned and sent from camp to serve as clerks.',
    'On renzi day, Liu Tongxun and Celeq were pardoned and sent to serve as clerks.',
  ],
  s1187: [
    'On day guichou, flood relief was given in nineteen Shandong prefectures, counties, and guards and four saltern fields including Guantai.',
    'On guichou day, Shandong flood districts including Zou county were relieved.',
  ],
  s1188: [
    'On day dingsi, Dawachi and others were escorted to the capital; officers were sent to report at the Grand Temple and the altars of soil and grain, and the captive presentation rite was performed.',
    'On dingsi day, Dawachi reached Beijing and a captive rite was held at the Grand Temple.',
  ],
  s1189: [
    'On day wuwu, the Emperor received captives at the gate tower and released Dawachi and others.',
    'On wuwu day, Dawachi and other captives were received and released.',
  ],
  s1190: [
    'Famine victims of flood were relieved in thirty-two Anhui prefectures and counties including Wuwei.',
    'Anhui flood famine victims in thirty-two districts including Wuwei were relieved.',
  ],
  s1191: [
    'Li Yuanliang was ordered to act as Minister of Works.',
    'Li Yuanliang acted as Minister of Works.',
  ],
  s1192: [
    'On day xinyou, Celeq was restored as assistant commander and acting Pacify-the-West general and ordered to advance against Amursana.',
    'On xinyou day, Celeq was restored and ordered to attack Amursana.',
  ],
  s1193: [
    'On day jiazi, General Ban Di and Minister E\'rong\'an were defeated at Ulan Kutule and died.',
    'On jiazi day, Ban Di and E\'rong\'an were defeated and killed at Ulan Kutule.',
  ],
  s1194: [
    'Deputy General Saral was taken prisoner.',
    'Saral was captured.',
  ],
  s1195: [
    'On day bingyin, Hada Ha was made Pacify-the-Border Left Deputy General, Ya\'erhashan assistant commander, Daledang\'a Pacify-the-Border Right Deputy General, and Alan Tai Uliastai assistant commander.',
    'On bingyin day, Hada Ha, Ya\'erhashan, Daledang\'a, and Alan Tai received frontier commands.',
  ],
  s1196: [
    'Eleventh month, day xinwei: Durbet beile Sebten was made Northern Route assistant commander.',
    'In the eleventh month, Durbet beile Sebten became Northern Route assistant.',
  ],
  s1197: [
    'On day guiyou, Celeq was made inner court minister and Pacify-the-West general; Zalafeng\'a Pacify-the-Border Right Deputy General and Daledang\'a assistant commander.',
    'On guiyou day, Celeq became western general and Zalafeng\'a and Daledang\'a were reassigned.',
  ],
  s1198: [
    'Qinggunjab\'s crime was pardoned.',
    'Qinggunjab was pardoned.',
  ],
  s1199: [
    'On day jiaxu, E\'lecheyi and Kazakh Sira were made assistant commanders and Nima inner court minister and assistant commander.',
    'On jiaxu day, E\'lecheyi, Sira, and Nima received assistant commands.',
  ],
  s1200: [
    'Jianchuan prefecture in Yunnan was struck by earthquake.',
    'Yunnan\'s Jianchuan prefecture suffered an earthquake.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b12.mjs <translation.json>'
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
