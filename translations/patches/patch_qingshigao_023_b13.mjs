#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'On day dingmao, court congratulations were excused.',
    'On dingmao day, the court congratulations ceremony was waived.',
  ],
  s1202: [
    'On day wuchen, land rent for Jinghai\'s Jishui Dian was remitted.',
    'On wuchen day, Jinghai Jishui Dian land rents were forgiven.',
  ],
  s1203: [
    'Twelfth month, day renwu: relief was given for plague disaster at Ami, Mengzi, and other places.',
    'In month 12, renwu, Ami, Mengzi, and other plague districts received relief.',
  ],
  s1204: [
    'On day yiyou, an edict ordered the grace-cycle provincial examinations in Guangxu year 15 and the grace-cycle metropolitan examination in year 16.',
    'On yiyou, the court scheduled grace provincial exams in Guangxu 15 and grace metropolitan exams in 16.',
  ],
  s1205: [
    'On day xinmao, posts were added for the general superintendent and other officers of the Jilin naval camp.',
    'On xinmao day, new posts were created for Jilin\'s naval camp command.',
  ],
  s1206: [
    'On day guisi, disaster struck the Gate of Supreme Harmony.',
    'On guisi day, the Gate of Supreme Harmony burned.',
  ],
  s1207: [
    'On day jiawu, an edict called for self-examination and ordered officials to attend diligently to duty.',
    'On jiawu, the court ordered officials to reform themselves and work diligently.',
  ],
  s1208: [
    'On day yiwei, prior years\' overdue grain taxes owed by the people of Shaanxi were remitted.',
    'On yiwei day, Shaanxi peasants\' prior tax arrears were remitted.',
  ],
  s1209: [
    'On day dingyou, an empress-dowager rescript ordered work on the Garden of Clear Ripples reduced and halted because of flood disaster.',
    'On dingyou, Cixi halted and cut Summer Palace work because of floods.',
  ],
  s1210: [
    'Censors Yu Lianyuan, Tu Renshou, and Hong Liangpin each memorialized to abolish railways; Xu Huizao and others submitted detailed memorials, and all went together to the Naval Office to deliberate with Grand Council ministers.',
    'Censors Yu, Tu, and Hong demanded railways be scrapped; Xu Huizao and others submitted plans; all joined naval and grand-council ministers in debate.',
  ],
  s1211: [
    'Shortly afterward Weng Tonghe, Kui Run, You Baichuan, Wen Zhi, and others likewise said railways should not be built; they too were referred for joint deliberation.',
    'Then Weng Tonghe, Kui Run, You Baichuan, Wen Zhi, and others also opposed railways and were sent to joint deliberation.',
  ],
  s1212: [
    'Vice Director of the Court of Imperial Studs Lin Weiyuan was ordered to assist in Taiwan land reclamation and pacification of the aborigines.',
    'Lin Weiyuan, vice director of the Studs Court, was assigned to help Taiwan reclamation and aborigine pacification.',
  ],
  s1213: [
    'On day gengzi, flood disaster at Weiyuan Subprefecture was relieved.',
    'On gengzi day, Weiyuan subprefecture flood victims received relief.',
  ],
  s1214: [
    'On day xinchou, Circuit Intendant Xu Chengzu, former envoy to Japan, was stripped of office pending investigation for padded expenses and his household property was registered for seizure.',
    'On xinchou, ex-Japan envoy Xu Chengzu lost office for padded expenses and his estate was inventoried.',
  ],
  s1215: [
    'On day bingwu, the Zhengzhou breach in the Yellow River was closed.',
    'On bingwu day, the Zhengzhou Yellow River breach was sealed.',
  ],
  s1216: [
    'Wu Dacheng was appointed Governor-General of the Eastern Yellow River Works; Li Hongzao and Ni Wenwei were restored to their former offices with favorable seniority; Cheng Fu and Li Henian were released and returned.',
    'Wu Dacheng took the eastern Yellow River post; Li Hongzao and Ni Wenwei were restored with favor; Cheng Fu and Li Henian were released.',
  ],
  s1217: [
    'Guangxu year 15, spring, first month, dingwei new moon: banquets were suspended.',
    'In Guangxu 15, spring 1, dingwei new moon, banquets were canceled.',
  ],
  s1218: [
    'On day gengshen, Jingyuan and Gaolan were shaken by earthquake.',
    'On gengshen day, Jingyuan and Gaolan had an earthquake.',
  ],
  s1219: [
    'On day xinyou, Zhang Zhiwan was made Grand Secretary of the Eastern Pavilion and Xu Tong Assistant Grand Secretary while Minister of Personnel.',
    'On xinyou, Zhang Zhiwan became eastern-pavilion grand secretary and Personnel Minister Xu Tong an assistant grand secretary.',
  ],
  s1220: [
    'The Naval Office jointly with the Grand Council deliberated to rebut memorials to halt railways and memorialized again requesting detailed deliberation.',
    'Naval and grand-council officials rebutted halt-railway memorials and asked for fuller debate.',
  ],
  s1221: [
    'Empress-dowager rescript: "Qing Yu, Ding\'an, Zeng Guoquan, Zhang Zhidong, Huang Pengnian, and others shall, in light of present circumstances, each set forth their views for report.',
    'Cixi ordered Qing Yu, Ding\'an, Zeng Guoquan, Zhang Zhidong, Huang Pengnian, and others to state views on current affairs.',
  ],
  s1222: [
    '" On day yichou, Prince Dun died.',
    'On yichou day Prince Dun died.',
  ],
  s1223: [
    'The Emperor, escorting the Empress Dowager, went in person to mourn.',
    'The Emperor accompanied the empress dowager to mourn in person.',
  ],
  s1224: [
    'On day dingmao, Censor Tu Renshou memorialized: "With the return of rule near and affairs critically urgent, sealed secret memorials should still be addressed to Her Majesty the Empress Dowager\'s sacred inspection, to be put into effect after perusal.',
    'On dingmao, Censor Tu asked that secret memorials still go to the empress dowager for approval before taking effect.',
  ],
  s1225: [
    '" An empress-dowager rescript condemned this as perverse, dismissed the censor, referred the case to the ministries for deliberation, and returned the original memorial unaccepted.',
    'Cixi denounced this, dismissed the censor, referred the case to the ministries, and returned the memorial.',
  ],
  s1226: [
    'On day wuchen, Censor Lin Shaonian requested prohibition of governors-general and governors making tribute offerings.',
    'On wuchen, Censor Lin asked to ban provincial chiefs\' "contributions" to court.',
  ],
  s1227: [
    'An empress-dowager rescript rebuked this.',
    'The empress dowager rebuked him.',
  ],
  s1228: [
    'On day guiyou, the grand wedding ceremony was completed.',
    'On guiyou day the grand wedding was completed.',
  ],
  s1229: [
    'Second month, day wuyin: Wu Dacheng requested an imperial edict to deliberate ceremonial honors for Prince Chun; an empress-dowager rescript rebuked this and circulated notice through the empire.',
    'In month 2, wuyin, Wu Dacheng sought honors for Prince Chun; Cixi refused and notified all officials.',
  ],
  s1230: [
    'On day jimao, the Empress Dowager returned rule.',
    'On jimao day the empress dowager handed back rule.',
  ],
  s1231: [
    'The Emperor took the throne at the Hall of Supreme Harmony to receive congratulations and proclaimed an edict throughout the realm.',
    'The emperor received congratulations at the Hall of Supreme Harmony and issued an empire-wide edict.',
  ],
  s1232: [
    'On day bingxu, various taxes on disaster and good harvest in the Jiang-Huai region in early Guangxu years were remitted.',
    'On bingxu day, early Guangxu Jiang-Huai disaster and harvest taxes were forgiven.',
  ],
  s1233: [
    'On day jichou, because of flood in Qidong and other counties, 50,000 taels from the Shandong treasury were allocated for relief preparedness.',
    'On jichou, Shandong allotted fifty thousand taels for Qidong flood relief.',
  ],
  s1234: [
    'On day renchen, an honorific title was added for the Empress Dowager; an edict proclaimed grace with distinctions.',
    'On renchen, the empress dowager gained an honorific and an edict granted graded amnesty.',
  ],
  s1235: [
    'On day jiawu, Korea sent envoys to congratulate the return of rule, presented tribute goods, and the king and queen were granted bolts of silk.',
    'On jiawu, Korea congratulated the handover of rule with tribute; the king and queen received silk.',
  ],
  s1236: [
    'Third month, day bingwu new moon: Hanlin Compiler Cui Guoyin was appointed minister plenipotentiary to the United States, Japan, and Peru.',
    'In month 3, bingwu new moon, Compiler Cui Guoyin was made envoy to America, Japan, and Peru.',
  ],
  s1237: [
    'On day dingwei, Peng Yulin resigned his touring-inspection post.',
    'On dingwei day Peng Yulin quit his inspection tour.',
  ],
  s1238: [
    'A warm edict urged him to stay.',
    'A gracious edict asked him to remain.',
  ],
  s1239: [
    'The Yellow River breached at Puzhou.',
    'The river broke at Puzhou.',
  ],
  s1240: [
    'On day guichou, because the chief of Bhutan submitted, a title, seal, and patent were granted.',
    'On guichou, Bhutan\'s chief was granted title, seal, and patent for submission.',
  ],
  s1241: [
    'On day jiayin, 20,000 taels from the Heilongjiang treasury were allocated for added relief to disaster victims in Hulan circuit.',
    'On jiayin, Heilongjiang sent twenty thousand taels more for Hulan flood victims.',
  ],
  s1242: [
    'On day dingsi, the Empress sacrificed to the Silkworm Ancestor.',
    'On dingsi day the empress performed the silkworm rite.',
  ],
  s1243: [
    'On day jiwei, another honorific title was added for the Empress Dowager.',
    'On jiwei day another honorific was added for the empress dowager.',
  ],
  s1244: [
    'On day gengwu, grain taxes for villages and stockades in Yunnan ravaged by bandits were remitted.',
    'On gengwu day Yunnan bandit-hit villages had taxes remitted.',
  ],
  s1245: [
    'On day wuchen, the Emperor, escorting the Empress Dowager, visited the Garden of Clear Ripples and reviewed land and naval drills.',
    'On wuchen the emperor took the empress dowager to the Summer Palace to review drills.',
  ],
  s1246: [
    'Yan Jingming was permitted to return home to nurse illness.',
    'Ill Yan Jingming was allowed home to convalesce.',
  ],
  s1247: [
    'Summer, fourth month, day wuyin: 100,000 shi of southern grain transport were allocated for Shandong relief preparedness.',
    'In summer, month 4, wuyin, one hundred thousand shi of southern grain was set aside for Shandong relief.',
  ],
  s1248: [
    'On day jimao, disaster victims in Fengtian and Jilin were relieved.',
    'On jimao day Fengtian and Jilin disaster victims received relief.',
  ],
  s1249: [
    'On day xinmao, Hunan Surveillance Commissioner Xue Fucheng was favored with Third Rank Peking Courtier rank and appointed minister plenipotentiary to Britain, France, Italy, and Belgium.',
    'On xinmao, Xue Fucheng became a third-rank Peking officer and envoy to Britain, France, Italy, and Belgium.',
  ],
  s1250: [
    'An empress-dowager rescript released 100,000 taels from the privy purse for Shandong relief preparedness.',
    'Cixi released one hundred thousand taels from the privy purse for Shandong relief.',
  ],
  s1251: [
    'On day gengzi, Zhang Jianxun and 330 others were granted jinshi with chin-shih honors in varying degrees.',
    'On gengzi day three hundred thirty-one including Zhang Jianxun received jinshi ranks in varying degrees.',
  ],
  s1252: [
    'Fifth month, day guichou: autumn executions were halted.',
    'In month 5, guichou, autumn executions were suspended.',
  ],
  s1253: [
    'On day gengshen, Luzhou fire disaster was relieved.',
    'On gengshen day Luzhou fire victims received relief.',
  ],
  s1254: [
    'Sixth month, day bingzi: Cen Yuying died.',
    'In month 6, bingzi, Cen Yuying died.',
  ],
  s1255: [
    'On day dingchou, Wang Wenshao was made Yunnan-Guizhou governor-general.',
    'On dingchou day Wang Wenshao became Yunnan-Guizhou governor-general.',
  ],
  s1256: [
    'On day jimao, the Gate of Supreme Harmony was rebuilt.',
    'On jimao day the Gate of Supreme Harmony was rebuilt.',
  ],
  s1257: [
    'On day dinghai, Zhoujiakou fire disaster was relieved.',
    'On dinghai day Zhoujiakou fire victims received relief.',
  ],
  s1258: [
    'On day renchen, with the Yongding River commissioner post vacant, Li Hongzhang recommended men fit to hold it.',
    'On renchen, Li Hongzhang recommended candidates for the vacant Yongding River post.',
  ],
  s1259: [
    'The Emperor suspected this hinted at shifting decision-making power and rebuked him.',
    'The emperor suspected a power shift and rebuked Li.',
  ],
  s1260: [
    'Autumn, seventh month, day dingwei: the river breached at Zhangqiu.',
    'In autumn, month 7, dingwei, the river broke at Zhangqiu.',
  ],
  s1261: [
    'On day jiyou, quota levies at Xiliang Mountain, Guizhou, were abolished.',
    'On jiyou day Guizhou\'s Xiliang Mountain quota levies were ended.',
  ],
  s1262: [
    'On day gengwu, the river breached at Qihe.',
    'On gengwu day the river broke at Qihe.',
  ],
  s1263: [
    'On day xinwei, the Qin River breached.',
    'On xinwei day the Qin River broke.',
  ],
  s1264: [
    'That month, hail disaster at Juzhou and Yishui, flood at Zhoujiakou, and flood and hail at Chang\'an, Xixiang, and Fuzhou were relieved.',
    'That month, hail at Juzhou and Yishui, Zhoujiakou flood, and Chang\'an, Xixiang, and Fuzhou flood and hail were relieved.',
  ],
  s1265: [
    'Flood disaster at Kunyang and Taihe in Yunnan and Huoqiu and other districts in Anhui was relieved.',
    'Flood victims at Kunyang, Taihe, Huoqiu, and elsewhere received relief.',
  ],
  s1266: [
    'Eighth month, day yihai: Li Hongzhang and Zhang Zhidong were ordered jointly with the Naval Office to plan the Lu-Han Railway.',
    'In month 8, yihai, Li Hongzhang and Zhang Zhidong joined the naval office to plan the Lu-Han Railway.',
  ],
  s1267: [
    'On day dinghai, 100,000 shi of new grain transport were retained for Shandong relief.',
    'On dinghai day one hundred thousand shi of new transport grain was held for Shandong relief.',
  ],
  s1268: [
    'On day renchen, because of Sichuan flood, 50,000 taels were donated for disaster relief.',
    'On renchen, fifty thousand taels were donated for Sichuan flood victims.',
  ],
  s1269: [
    'On day dingyou, disaster struck the Temple of Heaven\'s Hall of Prayer for Good Harvests.',
    'On dingyou day the Temple of Heaven\'s prayer hall burned.',
  ],
  s1270: [
    'On day gengzi, earthquake disaster at Ili, Suiding, and other places was relieved.',
    'On gengzi day Ili, Suiding, and other quake districts received relief.',
  ],
  s1271: [
    'On day xinchou, uncollected and overdue taxes in Guizhou prefectures, departments, counties, and guards ravaged by rebels were remitted.',
    'On xinchou, uncollected Guizhou rebel-hit district taxes and peasant arrears were remitted.',
  ],
  s1272: [
    'Ninth month, day renzi: the Hall of Prayer for Good Harvests was rebuilt.',
    'In month 9, renzi, the prayer hall was rebuilt.',
  ],
  s1273: [
    'Wind and flood disaster at Wenzhou and other places were relieved.',
    'Wenzhou and other wind and flood victims received relief.',
  ],
  s1274: [
    'On day guichou, prior years\' overdue levies in Shaanxi circuits were remitted.',
    'On guichou day Shaanxi\'s prior tax arrears were remitted.',
  ],
  s1275: [
    'Flood and hail disaster at Xianning and other places were relieved.',
    'Xianning and other flood and hail victims received relief.',
  ],
  s1276: [
    'On day yimao, flood disaster at Gaolan and other places was relieved.',
    'On yimao day Gaolan and other flood districts received relief.',
  ],
  s1277: [
    'On day renchen, the Changyuan dike breached and Yellow River water flooded into Huaxian.',
    'On renchen the Changyuan dike broke and Yellow River water entered Huaxian.',
  ],
  s1278: [
    'On day bingyin, an edict ordered Ding\'an and others to eliminate bad practices in the Three Eastern Provinces\' drill troops.',
    'On bingyin, Ding\'an and others were told to end bad habits in Manchuria drill troops.',
  ],
  s1279: [
    'On day dingmao, it was fixed that next year\'s prayer-for-grain rite would temporarily be held at the Circular Mound Altar.',
    'On dingmao next year\'s grain prayer was set for the Circular Mound Altar.',
  ],
  s1280: [
    'Winter, tenth month, day yihai: hail and flood disaster at Yangqu and other places were relieved.',
    'In winter, month 10, yihai, Yangqu hail and flood victims received relief.',
  ],
  s1281: [
    'On day wuyin, a telegraph line was established from Xi\'an to Jiayuguan.',
    'On wuyin a telegraph line was laid from Xi\'an to Jiayuguan.',
  ],
  s1282: [
    'Flood disaster in Hangzhou, Jiaxing, and Huzhou circuits was relieved.',
    'Hangzhou, Jiaxing, and Huzhou flood victims received relief.',
  ],
  s1283: [
    'On day dinghai, because Jiangsu and Zhejiang rain caused disaster, 50,000 taels each were allocated from their treasuries and 50,000 taels released from the privy purse for relief.',
    'On dinghai, Jiangsu and Zhejiang each allotted fifty thousand taels and the privy purse fifty thousand for flood relief.',
  ],
  s1284: [
    'Because Zhang Zhidong rashly concluded a contract for purchased machinery, an edict sharply rebuked him: henceforth, in all new undertakings, nothing must be lightly attempted without prior memorial and clarification.',
    'Zhang Zhidong was sharply rebuked for rash machinery contracts; new projects now required prior memorial.',
  ],
  s1285: [
    'On day jichou, 100,000 taels from the Wuchang treasury were allocated for Hubei relief needs.',
    'On jichou, Wuchang allotted one hundred thousand taels for Hubei relief.',
  ],
  s1286: [
    'On day renchen, an edict restored provincial surveillance and administration commissioners\' exclusive memorial-by-fold authority on affairs.',
    'On renchen, provincial surveillance and administration commissioners regained sole fold-memorial authority.',
  ],
  s1287: [
    'Taiwan She aborigines rebelled; Vice Commander Liu Chaodai and others were lost in battle; Liu Mingchuan was ordered to suppress them.',
    'Taiwan She tribes rebelled; Vice Commander Liu Chaodai fell; Liu Mingchuan was ordered to suppress them.',
  ],
  s1288: [
    'On day jiawu, another 150,000 taels from the Zhejiang treasury were allocated for Hangzhou, Jiaxing, and Huzhou disaster relief.',
    'On jiawu, Zhejiang sent another one hundred fifty thousand taels for Hang-Jia-Hu relief.',
  ],
  s1289: [
    'On day jihai, the Shandong Dazhai river works were closed.',
    'On jihai day Shandong\'s Dazhai river closure was completed.',
  ],
  s1290: [
    'On day renyin, surplus funds from Jiangsu and Anhui relief subscriptions were allocated to repair the Grand Canal.',
    'On renyin, Jiangsu and Anhui relief surplus funded canal repair.',
  ],
  s1291: [
    'Hail and flood disaster in Suide and other circuits was relieved.',
    'Suide and other hail and flood victims received relief.',
  ],
  s1292: [
    'Eleventh month, day bingchen: the Naval Office request was approved; the Ministry of Revenue would annually allocate 2,000,000 taels to open railways.',
    'In month 11, bingchen, the treasury approved two million taels yearly for railways.',
  ],
  s1293: [
    'On day dingsi, an edict ordered elimination of redundant officials and cutting of wasteful expenditure.',
    'On dingsi day redundant posts and wasteful spending were ordered cut.',
  ],
  s1294: [
    'On day wuwu, 30,000 taels in commuted grain-transport silver from Anhui was allocated for Anqing, Ningguo, and Sizhou relief needs.',
    'On wuwu, Anhui allotted thirty thousand taels in commuted grain silver for three prefectures\' relief.',
  ],
  s1295: [
    'On day bingyin, Zhejiang released Ever-Normal granary grain to relieve refugees at Tiantai, Xianju, and other places.',
    'On bingyin, Zhejiang released granary grain for Tiantai, Xianju, and other refugees.',
  ],
  s1296: [
    'Twelfth month, day renshen new moon: due white-grain transport and land poll taxes in Hangzhou, Jiaxing, and Huzhou were remitted.',
    'In month 12, renshen new moon, Hang-Jia-Hu transport grain and land taxes were remitted.',
  ],
  s1297: [
    'On day jiaxu, 40,000 shi of Shandong transport grain were retained for relief preparedness.',
    'On jiaxu day forty thousand shi of Shandong transport grain was held for relief.',
  ],
  s1298: [
    'On day dingchou, another 50,000 taels from the Wuchang treasury were allocated for Hubei relief needs.',
    'On dingchou, Wuchang sent another fifty thousand taels for Hubei relief.',
  ],
  s1299: [
    'On day dinghai, the breach at Shandong\'s Xizhifang overflow point was closed.',
    'On dinghai day Shandong\'s Xizhifang breach was sealed.',
  ],
  s1300: [
    'On day guisi, a renewed prohibition was issued against accumulated abuses in handling tax remissions and deferrals.',
    'On guisi day officials were again forbidden the old abuses in tax relief processing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b13.mjs <translation.json>'
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
