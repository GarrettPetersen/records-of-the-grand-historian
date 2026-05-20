#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'On day jiazi, a commander-in-chief post was added for the Penghu garrison in Fujian.',
    'On jiazi day, Fujian\'s Penghu garrison gained a commander-in-chief.',
  ],
  s1102: [
    'On day yichou, flood relief was sent to Nanyang and other places.',
    'On yichou day, Nanyang and other flood districts were relieved.',
  ],
  s1103: [
    'On day dingmao, accumulated civilian arrearages in silver, grain, and miscellaneous levies in Gansu were remitted.',
    'On dingmao day, Gansu\'s long-standing grain and silver arrears were forgiven.',
  ],
  s1104: [
    'Hail disaster relief was sent to Tao Prefecture and subordinate districts.',
    'Tao Prefecture and its districts received hail relief.',
  ],
  s1105: [
    'On day yihai, the Yunnan Lin\'an Kaiguang Circuit was established.',
    'On yihai day, Yunnan\'s Lin\'an Kaiguang Circuit was set up.',
  ],
  s1106: [
    'On day dingchou, Li bandits were pacified.',
    'On dingchou day, the Li rebels were subdued.',
  ],
  s1107: [
    'On day xinsi, Circuit Intendant Li Shuchang was appointed envoy minister to Japan.',
    'On xinsi day, Li Shuchang became envoy minister to Japan.',
  ],
  s1108: [
    'Eighth month, day wuzi: sacrifice to the great altars of earth and grain.',
    'In month 8, wuzi, the great earth and grain altars were sacrificed to.',
  ],
  s1109: [
    'On day jiachen, the Qin River burst its banks.',
    'On jiachen day, the Qin River broke.',
  ],
  s1110: [
    'Flood relief was sent to Pingyi.',
    'Pingyi received flood relief.',
  ],
  s1111: [
    'On day bingwu, Mianyang and other districts were flooded; thirty thousand piculs of winter tribute grain were retained for relief.',
    'On bingwu day, flooded Mianyang districts kept thirty thousand piculs of winter grain for relief.',
  ],
  s1112: [
    'The Zhengzhou river breached and flowed south into the Huai; River Superintendent Cheng Fu was stripped of office but kept on duty.',
    'Zhengzhou\'s breach poured into the Huai; Cheng Fu lost his river post but stayed on the works.',
  ],
  s1113: [
    'On day jiyou, fifty thousand piculs of capital granary tribute rice were allocated to relieve Shuntian and Tongzhou districts.',
    'On jiyou day, fifty thousand piculs of Beijing granary rice went to Shuntian and Tongzhou relief.',
  ],
  s1114: [
    'Three hundred thousand taels of retained Beijing stipend rice-commutation silver were diverted for Henan relief.',
    'Three hundred thousand taels of held Beijing stipend silver were sent to Henan.',
  ],
  s1115: [
    'On day guichou, an empress-dowager edict released one hundred thousand taels from the privy purse for flood relief.',
    'On guichou day, the empress dowager gave one hundred thousand taels from the privy purse for floods.',
  ],
  s1116: [
    'Ninth month, new moon on day yimao: overdue levies from the previous year in Shaanxi prefectures, departments, and counties were remitted.',
    'In month 9, yimao new moon, Shaanxi\'s prior-year arrears were forgiven.',
  ],
  s1117: [
    'On day xinyou, because of the Zhengzhou breach, next year\'s Jiangbei and Jiangsu canal grain transport and fees were retained for relief.',
    'On xinyou day, next year\'s Jiangbei and Jiangsu transport grain and fees were held for Zhengzhou relief.',
  ],
  s1118: [
    'On day xinwei, tribute from the Tumed Khutukhtu was approved.',
    'On xinwei day, the Tumed Khutukhtu\'s tribute was accepted.',
  ],
  s1119: [
    'On day yihai, Xue Yun was ordered to go to Henan to inspect the Zhengzhou works.',
    'On yihai day, Xue Yun was sent to Henan to inspect Zhengzhou river works.',
  ],
  s1120: [
    'On day dingchou, Li Hongzao went to Henan to join the river inspection.',
    'On dingchou day, Li Hongzao went to Henan for the joint river inspection.',
  ],
  s1121: [
    'That month, flood relief was sent to Wuzhi, An County, Yunyang, and northern Anhui; Hanzhou and Longzhou floods; Jianshui and Tonghai hail.',
    'That month brought relief for Wuzhi, An, Yunyang, northern Anhui floods, Hanzhou and Longzhou waters, and Jianshui-Tonghai hail.',
  ],
  s1122: [
    'Winter, tenth month, new moon jiazi: fire relief for Rong County.',
    'In winter, month 10, jiazi new moon, Rong County fire victims were relieved.',
  ],
  s1123: [
    'On day dinghai, Feng Zicai resigned on illness; he was ordered to remain in Guangdong to manage Qinzhou and Lianzhou defense.',
    'On dinghai day, ill Feng Zicai was told to stay in Guangdong for Qinzhou and Lianzhou defense.',
  ],
  s1124: [
    'He begged retirement; it was not permitted.',
    'His retirement plea was denied.',
  ],
  s1125: [
    'On day jichou, wind disaster relief was sent to Hui, Gao, Lian, Lei, Qiong, Chixi, and Yangjiang.',
    'On jichou day, wind relief went to Hui, Gao, Lian, Lei, Qiong, Chixi, and Yangjiang.',
  ],
  s1126: [
    'On day jihai, Mutushan died.',
    'On jihai day, Mutushan died.',
  ],
  s1127: [
    'Poor victims in Zhengzhou and other disaster zones were given grain rations.',
    'Zhengzhou and other disaster zones received poor relief grain.',
  ],
  s1128: [
    'On day renyin, Shan Qing was made Fuzhou general, assisted in naval affairs, and also managed the Shenjiying.',
    'On renyin day, Shan Qing became Fuzhou general, helped the navy, and ran the Shenjiying.',
  ],
  s1129: [
    'Autumn levies were remitted for flooded districts in Zhili.',
    'Zhili\'s flooded districts were forgiven autumn levies.',
  ],
  s1130: [
    'On day yisi, snow disaster relief was sent to Zhenxi subprefecture.',
    'On yisi day, Zhenxi received snow relief.',
  ],
  s1131: [
    'On day wushen, the emperor attended the Empress Dowager in visiting the ailing Prince Chun; thereafter he visited frequently until recovery in the seventh month of the next year.',
    'On wushen day, the emperor and empress dowager visited ill Prince Chun and kept visiting until his recovery in month 7 next year.',
  ],
  s1132: [
    'On day gengxu, flood relief was sent to Chang\'an and subordinate districts.',
    'On gengxu day, Chang\'an and its districts received flood relief.',
  ],
  s1133: [
    'On day guichou, frost disaster relief was sent to Suilai.',
    'On guichou day, Suilai received frost relief.',
  ],
  s1134: [
    'Eleventh month, day yimao: Ding An was appointed Imperial Commissioner to train troops with the three eastern provinces generals, with authority over vice-commandants and below.',
    'In month 11, yimao, Ding An became commissioner to train troops with the three eastern generals and command vice-commandants down.',
  ],
  s1135: [
    'On day xinyou, winter solstice; Heaven was worshipped at the Circular Mound.',
    'On xinyou day, winter solstice, Heaven was sacrificed to at the Circular Mound.',
  ],
  s1136: [
    'On day renxu, Wen Shuo was instructed to draw lots for the Hutuktu reincarnation by regulation.',
    'On renxu day, Wen Shuo was told to draw lots for the Hutuktu by rule.',
  ],
  s1137: [
    'On day renshen, prayer for snow.',
    'On renshen day, snow was prayed for.',
  ],
  s1138: [
    'Twelfth month, day dinghai: Li Hongzao was ordered to supervise Zhengzhou river works.',
    'In month 12, dinghai, Li Hongzao was put in charge of Zhengzhou river works.',
  ],
  s1139: [
    'On day jichou, quota levies on wasteland in Enlong, Bose, and other places were remitted.',
    'On jichou day, wasteland levies at Enlong, Bose, and elsewhere were forgiven.',
  ],
  s1140: [
    'Fire relief was sent to Guilin and other places.',
    'Guilin and other fire districts were relieved.',
  ],
  s1141: [
    'On day renchen, disaster-deferred taxes and rents for Yangcheng and other counties were remitted.',
    'On renchen day, Yangcheng and other counties were forgiven deferred disaster taxes.',
  ],
  s1142: [
    'On day dingyou, rain and snow.',
    'On dingyou day, rain and snow fell.',
  ],
  s1143: [
    'On day wuxu, an empress-dowager edict restored Yan Jingming, Fu Kun, Weng Tonghe, Song Shen, Sun Yijing, Jing Shan, and Sun Jian to favor.',
    'On wuxu day, the empress dowager restored Yan Jingming, Fu Kun, Weng Tonghe, Song Shen, Sun Yijing, Jing Shan, and Sun Jian.',
  ],
  s1144: [
    'On day gengzi, because northern Anhui was stricken, one hundred thousand taels from Anhui rice commutation and Wuhu customs were allocated for next spring\'s relief.',
    'On gengzi day, northern Anhui got one hundred thousand taels from Anhui rice commutation and Wuhu customs for spring relief.',
  ],
  s1145: [
    'On day xinchou, Yitadada Circuit and Ili Prefecture, Korgas subprefecture, and Tacheng subprefecture were established in Xinjiang with circuit intendant, prefect, and other officials.',
    'On xinchou day, Xinjiang gained Yitadada Circuit, Ili Prefecture, Korgas and Tacheng subprefectures, and their officials.',
  ],
  s1146: [
    'On day renyin, earthquake at Shiping and Jianshui.',
    'On renyin day, Shiping and Jianshui were shaken.',
  ],
  s1147: [
    'On day jiyou, fifty thousand piculs of Shandong winter tribute grain were allocated for Henan\'s winter relief next year.',
    'On jiyou day, fifty thousand piculs of Shandong winter grain were set aside for Henan\'s next winter relief.',
  ],
  s1148: [
    'That year, Korea presented tribute.',
    'That year Korea sent tribute.',
  ],
  s1149: [
    'Fourteenth year, wuzi, spring, first month, new moon guichou: the emperor personally performed rites at the Tangzi.',
    'Year 14, spring 1, guichou new moon, the emperor worshipped at the Tangzi in person.',
  ],
  s1150: [
    'On day bingchen, snow.',
    'On bingchen day, it snowed.',
  ],
  s1151: [
    'Summer grain was remitted for flooded Taihe and other districts in Anhui.',
    'Anhui\'s flooded Taihe and other districts were forgiven summer grain.',
  ],
  s1152: [
    'On day jiwei, the Mohe gold mines in Heilongjiang were opened.',
    'On jiwei day, Heilongjiang\'s Mohe gold mines opened.',
  ],
  s1153: [
    'On day gengshen, the Changhua stone-green copper mines in Guangdong were opened.',
    'On gengshen day, Guangdong\'s Changhua copper mines opened.',
  ],
  s1154: [
    'On day xinyou, the telegraph line from Tengyue to the Yunnan provincial capital was extended.',
    'On xinyou day, the Tengyue-Yunnan capital telegraph line was extended.',
  ],
  s1155: [
    'On day yihai, Liu Jintang begged sick leave.',
    'On yihai day, Liu Jintang sought sick leave.',
  ],
  s1156: [
    'He was comforted and retained; another four months\' leave was granted.',
    'He was kept on duty and given four more months\' leave.',
  ],
  s1157: [
    'On day renwu, an edict ordered that when ten-cash coins are cast, each piece weighing two qian or more shall be used uniformly.',
    'On renwu day, ten-cash coins of two qian or more were ordered into general use.',
  ],
  s1158: [
    'That month, a total of one hundred thirty thousand piculs of retained Beijing granary and sea-transport tribute grain were sent to relieve Zhili disaster.',
    'That month, one hundred thirty thousand piculs of Beijing and sea-transport grain relieved Zhili.',
  ],
  s1159: [
    'Second month, day yiyou: fire relief for Wuzhou.',
    'In month 2, yiyou, Wuzhou fire victims were relieved.',
  ],
  s1160: [
    'On day bingxu, Pei Yinsen was rewarded with Third Rank Beijing Yamen rank and ordered to supervise the Fujian shipyard.',
    'On bingxu day, Pei Yinsen received third-rank Beijing Yamen rank and took Fujian shipyard supervision.',
  ],
  s1161: [
    'On day gengyin, Wen Shuo was stripped of office for submitting a confidential memorial draft to the Censorate on his own authority.',
    'On gengyin day, Wen Shuo lost office for sending a secret memorial draft to the Censorate without leave.',
  ],
  s1162: [
    'On day xinhai, the Former Agriculturist was sacrificed to and the emperor personally plowed the sacred field.',
    'On xinhai day, the Former Agriculturist was worshipped and the emperor plowed the sacred field.',
  ],
  s1163: [
    'That month, an edict ordered repair of the Summer Palace for the Empress Dowager\'s visits.',
    'That month, the Summer Palace was ordered repaired for the empress dowager.',
  ],
  s1164: [
    'Third month, day bingchen: overdue levies before Guangxu year 5 in Zhejiang were remitted.',
    'In month 3, bingchen, Zhejiang arrears before Guangxu 5 were forgiven.',
  ],
  s1165: [
    'On day bingyin, the reincarnate Panchen Hutuktu was bestowed a khada, rosary, and ruyi.',
    'On bingyin day, the Panchen reincarnation received khada, rosary, and ruyi.',
  ],
  s1166: [
    'Summer, fourth month, day gengyin: the Yongding River breach was closed.',
    'In summer, month 4, gengyin, the Yongding breach closed.',
  ],
  s1167: [
    'On day xinmao, the emperor escorted the Empress Dowager on her first visit to the Western Park.',
    'On xinmao day, the emperor took the empress dowager to the Western Park for the first time.',
  ],
  s1168: [
    'On day jiawu, the Guangdong telegraph line was extended from Jiujiang to Dayuling.',
    'On jiawu day, Guangdong\'s line was extended from Jiujiang to Dayuling.',
  ],
  s1169: [
    'On day dingyou, hail fell.',
    'On dingyou day, hail fell.',
  ],
  s1170: [
    'On day xinhai, Zhang Yao was ordered to assist in naval affairs.',
    'On xinhai day, Zhang Yao was told to help naval affairs.',
  ],
  s1171: [
    'Flood relief was sent to Huizhou and subordinate districts.',
    'Huizhou and its districts received flood relief.',
  ],
  s1172: [
    'Fifth month, day yimao: earthquake in the capital, Fengtian, and Shandong.',
    'In month 5, yimao, Beijing, Fengtian, and Shandong were shaken.',
  ],
  s1173: [
    'On day guihai, summer solstice; Earth was worshipped at the Square Mound.',
    'On guihai day, summer solstice, Earth was sacrificed to at the Square Mound.',
  ],
  s1174: [
    'On day dingmao, prayer for rain.',
    'On dingmao day, rain was prayed for.',
  ],
  s1175: [
    'Sixth month, day guisi: rain.',
    'In month 6, guisi, it rained.',
  ],
  s1176: [
    'On day jihai, an empress-dowager edict: the emperor\'s grand wedding ceremony would be held in the first month of next year.',
    'On jihai day, the empress dowager set the emperor\'s grand wedding for next year\'s first month.',
  ],
  s1177: [
    'On day jiachen, Peng Yulin was relieved as Minister of War on illness but continued touring the Yangtze naval forces as before.',
    'On jiachen day, ill Peng Yulin left the War Ministry but kept inspecting the Yangtze fleet.',
  ],
  s1178: [
    'On day renyin, an empress-dowager edict: restoration of power on the third day of the second month of next year.',
    'On renyin day, the empress dowager fixed restoration of power for next year\'s second-month third day.',
  ],
  s1179: [
    'Seventh month, day gengshen: for delay in river works, Li Hongzao and Ni Wenwei were stripped of office but kept on duty; Li Henian and Cheng Fu were both sent to frontier punishment.',
    'In month 7, gengshen, delayed river works cost Li Hongzao and Ni Wenwei their posts but not their duties; Li Henian and Cheng Fu went to the frontier.',
  ],
  s1180: [
    'On day jiazi, the Yongding River breached again.',
    'On jiazi day, the Yongding broke again.',
  ],
  s1181: [
    'On day bingyin, Yan Jingming was dismissed.',
    'On bingyin day, Yan Jingming left office.',
  ],
  s1182: [
    'On day dingchou, Wu Dacheng was instructed to inspect and verify river works.',
    'On dingchou day, Wu Dacheng was told to inspect river works.',
  ],
  s1183: [
    'That month, the Tianjin-Taku railway was completed.',
    'That month the Tianjin-Taku railway opened.',
  ],
  s1184: [
    'Eighth month, day dinghai: flood relief for Fengtian departments, prefectures, and counties and Huaining and other Anhui counties.',
    'In month 8, dinghai, Fengtian and Anhui\'s Huaining counties received flood relief.',
  ],
  s1185: [
    'On day jichou, an edict ordered all provinces to clear crowded prisons.',
    'On jichou day, provinces were told to clear crowded prisons.',
  ],
  s1186: [
    'On day renchen, flood relief was sent to Cangwu and other places.',
    'On renchen day, Cangwu and other flood districts were relieved.',
  ],
  s1187: [
    'On day dingyou, Jiangbei tribute grain was retained for Jiangsu and Anhui relief.',
    'On dingyou day, Jiangbei tribute grain was held for Jiangsu and Anhui relief.',
  ],
  s1188: [
    'On day yisi, with restoration of power approaching, Prince Chun asked to be relieved of his duties.',
    'On yisi day, Prince Chun sought release from duty as restoration neared.',
  ],
  s1189: [
    'An empress-dowager edict: he was to continue managing the Naval Office and Shenjiying as before, and after restoration his memorials were not to carry his title in the signature block.',
    'The empress dowager kept him on the Naval Office and Shenjiying and barred title lines after restoration.',
  ],
  s1190: [
    'Ninth month, day bingchen: last year\'s overdue levies in Shaanxi were remitted.',
    'In month 9, bingchen, Shaanxi\'s last-year arrears were forgiven.',
  ],
  s1191: [
    'On day jiaxu, the Yongding River breach was closed.',
    'On jiaxu day, the Yongding breach closed.',
  ],
  s1192: [
    'Winter, tenth month, new moon jimao: sacrifice at the Imperial Ancestral Temple.',
    'In winter, month 10, jimao new moon, the Imperial Ancestral Temple was sacrificed to.',
  ],
  s1193: [
    'On day guiwei, an empress-dowager edict installed the Yehe Nara clan woman as empress.',
    'On guiwei day, the empress dowager made a Yehe Nara woman empress.',
  ],
  s1194: [
    'On day guisi, twenty thousand piculs of Beijing tribute grain were allocated for Zhili\'s winter relief.',
    'On guisi day, twenty thousand piculs of Beijing grain were set for Zhili winter relief.',
  ],
  s1195: [
    'On day jiawu, corvée grain levies for Shuicheng and other places were remitted.',
    'On jiawu day, Shuicheng and other districts were forgiven corvée grain.',
  ],
  s1196: [
    'Drought relief was sent to Dantu; flood relief to Nanchang and other counties.',
    'Dantu received drought relief; Nanchang and other counties received flood relief.',
  ],
  s1197: [
    'On day gengzi, Korea\'s red-ginseng surtax was remitted.',
    'On gengzi day, Korea\'s red-ginseng surtax was forgiven.',
  ],
  s1198: [
    'Eleventh month, day renxu: the Sino-French telegraph line along the Yunnan-Vietnam border was completed.',
    'In month 11, renxu, the Yunnan-Vietnam Sino-French telegraph line opened.',
  ],
  s1199: [
    'The Beiyang naval commander-in-chief post was established for the first time; Ding Ruchang was appointed.',
    'Beiyang\'s first naval commander-in-chief was Ding Ruchang.',
  ],
  s1200: [
    'On day bingyin, winter solstice; Heaven was worshipped at the Circular Mound.',
    'On bingyin day, winter solstice, Heaven was sacrificed to at the Circular Mound.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b12.mjs <translation.json>'
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
