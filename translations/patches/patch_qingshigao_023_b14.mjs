#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1301: [
    'Grain taxes were remitted for Yunnan villages disturbed by bandits.',
    'Yunnan villages hit by bandits were forgiven grain taxes.',
  ],
  s1302: [
    'On day dingyou, grain taxes were remitted in Zhengzhou, Huaining, Weishi, and other districts.',
    'On dingyou day, Zhengzhou, Huaining, Weishi, and other districts were forgiven grain taxes.',
  ],
  s1303: [
    'Grain levies were remitted in Renhe and other counties and in the Hang and Yan garrisons.',
    'Renhe and other counties and the Hang and Yan garrisons were forgiven grain levies.',
  ],
  s1304: [
    'That year, Korea sent tribute.',
    'That year Korea paid tribute.',
  ],
  s1305: [
    'In the sixteenth year, gengyin, spring, first month, new moon on day renyin, banquets were suspended.',
    'Year 16, spring 1, renyin new moon: banquets were stopped.',
  ],
  s1306: [
    'On day xinyou, salt-works levies in Zhili before the thirteenth year were remitted.',
    'On xinyou day, Zhili salt-works levies owed before year 13 were forgiven.',
  ],
  s1307: [
    'On day dingmao, an edict said that for this year\'s longevity celebration there need be no memorial sacrifices, the ascent-of-the-hall ceremony was suspended, and civil and military officials of the provinces were excused from coming to the capital to offer congratulations.',
    'On dingmao day, the court waived memorial rites, the hall ceremony, and provincial officials\' birthday congratulations for the year.',
  ],
  s1308: [
    'Second month, day yiyou: Zhang Yao reported that a unified accounting of Shandong river works would require more than 2,880,000 taels.',
    'In month 2, yiyou, Zhang Yao said Shandong river works would cost over 2,880,000 taels.',
  ],
  s1309: [
    'The responsible offices were ordered to arrange funding.',
    'The relevant offices were told to secure funds.',
  ],
  s1310: [
    'On day renchen, Taiwan interior mountain aboriginal chiefs including You Min were executed.',
    'On renchen day, Taiwan mountain chiefs including You Min were executed.',
  ],
  s1311: [
    'That month, overdue taxes in Yulin and other districts from the thirteenth year were remitted.',
    'That month, Yulin and other districts were forgiven thirteenth-year arrears.',
  ],
  s1312: [
    'Tax grain on official fields flooded in Dongchuan was remitted.',
    'Dongchuan flooded official-field tax grain was forgiven.',
  ],
  s1313: [
    'Overdue rents on Wen\'an, Jinghai, and Bazhou lake marshes and land taxes at Bodune were remitted.',
    'Wen\'an, Jinghai, and Bazhou marsh arrears and Bodune land taxes were forgiven.',
  ],
  s1314: [
    'Intercalary second month, day renyin: fire disaster relief was given to Guilin and its subordinate districts.',
    'In intercalary month 2, renyin, Guilin and its districts received fire relief.',
  ],
  s1315: [
    'On day jiyou, Grand Minister of the Imperial Stud Zhang Yinhuán was ordered to serve at the Yamen for General Management of Foreign Affairs.',
    'On jiyou day, Zhang Yinhuán of the Imperial Stud was assigned to the foreign affairs yamen.',
  ],
  s1316: [
    'On day yimao, the Emperor escorted the Empress Dowager to the Eastern Tombs; quota taxes along the route were remitted by three-tenths.',
    'On yimao day, the Emperor took the empress dowager to the Eastern Tombs and cut route taxes by three-tenths.',
  ],
  s1317: [
    'On day gengshen, the Emperor went in person to mourn at the tomb park of the Duanhui Crown Prince.',
    'On gengshen day, the Emperor mourned at Crown Prince Duanhui\'s tomb park.',
  ],
  s1318: [
    'On day guihai, the imperial procession returned from the Eastern Tombs.',
    'On guihai day, the court returned from the Eastern Tombs.',
  ],
  s1319: [
    'On day yichou, Zeng Jize died; a special posthumous title was soon granted.',
    'On yichou day, Zeng Jize died and soon received a special posthumous title.',
  ],
  s1320: [
    'An edict told Li Hongzhang to reorganize the Beiyang land and naval forces and ordered Ding\'an and others to train troops in the three eastern provinces.',
    'Li Hongzhang was told to reform the Beiyang forces and Ding\'an and others to train the three eastern provinces\' troops.',
  ],
  s1321: [
    'Third month, day xinwei: an empress dowager edict made Liu Mingchuan assistant in naval affairs.',
    'In month 3, xinwei, the empress dowager put Liu Mingchuan in charge of assisting naval affairs.',
  ],
  s1322: [
    'Xining suffered an earthquake; relief was given.',
    'Xining was earthquake-struck and received relief.',
  ],
  s1323: [
    'On day xinmao, for the twenty-day longevity celebration an edict was promulgated to all under Heaven with graded grace.',
    'On xinmao day, a nationwide edict granted graded grace for the twenty-day longevity celebration.',
  ],
  s1324: [
    'On day yiwei, the South Lake at Yuhang was dredged.',
    'On yiwei day, Yuhang\'s South Lake was dredged.',
  ],
  s1325: [
    'The Zhandui tribal head Sala Yongzhu and the Bazon lama joined wild tribes in revolt; government troops suppressed and pacified them.',
    'Sala Yongzhu and the Bazon lama raised wild tribes at Zhandui; government troops crushed the revolt.',
  ],
  s1326: [
    'Summer, fourth month, day gengyin: Peng Yulin died.',
    'In summer, month 4, gengyin, Peng Yulin died.',
  ],
  s1327: [
    'On day gengxu, an edict ordered the opium transit tax to be reorganized.',
    'On gengxu day, the court ordered reform of the opium transit tax.',
  ],
  s1328: [
    'Gangyi was ordered to investigate carefully Xuzhou\'s opium output and actual tax receipts and to set strict regulations for reorganization.',
    'Gangyi was told to audit Xuzhou opium production and tax receipts and fix strict rules.',
  ],
  s1329: [
    'On day dingmao, Wu Lu and 336 others were granted jinshi and other examination degrees with distinctions.',
    'On dingmao day, Wu Lu and 336 others received jinshi and related degrees.',
  ],
  s1330: [
    'Fifth month, new moon on day jisi: there was an eclipse of the sun.',
    'At the fifth-month new moon, jisi, the sun was eclipsed.',
  ],
  s1331: [
    'On day xinwei, Selenge died; Chang Geng was made Ili general.',
    'On xinwei day, Selenge died and Chang Geng became Ili general.',
  ],
  s1332: [
    'On day bingzi, Sheng Tai was made resident minister in Tibet.',
    'On bingzi day, Sheng Tai became resident minister in Tibet.',
  ],
  s1333: [
    'On day jimao, the Emperor went to the Hall of Great Height to pray for rain.',
    'On jimao day, the Emperor prayed for rain at the Hall of Great Height.',
  ],
  s1334: [
    'On day yiyou, at the Painted Barge Studio he reviewed the guards\' foot archery; this continued through day renchen.',
    'On yiyou day, the Emperor reviewed guards\' foot archery at the Painted Barge Studio through renchen.',
  ],
  s1335: [
    'On day jichou, it rained.',
    'On jichou day, rain fell.',
  ],
  s1336: [
    'Stone dams were built along the river at Minxiang.',
    'Minxiang river stone dams were built.',
  ],
  s1337: [
    'Wind disaster relief was given to Huaining and other counties.',
    'Huaining and other counties received wind-disaster relief.',
  ],
  s1338: [
    'Sixth month, new moon on day jihai: more than 2,000 households of river-bank villagers in Qi\'s eastern districts were relocated.',
    'At the sixth-month new moon, jihai, over 2,000 Qi eastern riverbank households were moved.',
  ],
  s1339: [
    'On day dingwei, the Sanxing gold mine was opened.',
    'On dingwei day, the Sanxing gold mine opened.',
  ],
  s1340: [
    'On day wushen, because Tibetan affairs were settled, sealed edicts were issued to the chief of Brokpa.',
    'On wushen day, Brokpa\'s chief received a sealed edict after Tibet was pacified.',
  ],
  s1341: [
    'From day guimao through day jiyou prayers for clear weather continued in succession.',
    'From guimao through jiyou the court prayed repeatedly for clear skies.',
  ],
  s1342: [
    'On day xinhai, prolonged rain around the capital became a disaster; gruel kitchens were added outside the six gates of Beijing, 15,000 shi of capital-granary grain were ordered for cooking relief, and 50,000 taels from the inner treasury were issued for relief needs.',
    'On xinhai day, capital-region floods brought gruel kitchens, 15,000 shi of grain, and 50,000 taels of relief funds.',
  ],
  s1343: [
    'On day renzi, the Yongding River burst its banks.',
    'On renzi day, the Yongding River broke.',
  ],
  s1344: [
    'On day guichou, Zhang Tianxi, native official of northern Yong, plotted rebellion; government troops attacked and beheaded him.',
    'On guichou day, northern Yong native official Zhang Tianxi rebelled and was beheaded.',
  ],
  s1345: [
    'On day dingsi, Fengtian grain shipped to the capital and retained north-of-the-Yangtze transport grain were allocated for Tianjin disaster relief.',
    'On dingsi day, Fengtian and retained transport grain were set aside for Tianjin relief.',
  ],
  s1346: [
    'On day jiazi, the longevity festival: the Emperor received congratulations in the Palace of Heavenly Purity.',
    'On jiazi day, the longevity festival, the Emperor received felicitations at the Palace of Heavenly Purity.',
  ],
  s1347: [
    'Autumn, seventh month, day yihai: the Zhenkang native tribes rebelled and were suppressed.',
    'In autumn, month 7, yihai, Zhenkang native tribes revolted and were crushed.',
  ],
  s1348: [
    'An edict rebuked Li Hongzhang for failing to close the Yongding River breach.',
    'The court rebuked Li Hongzhang for not closing the Yongding breach.',
  ],
  s1349: [
    'On day jimao, 50,000 taels from the treasury, 500,000 strings of large cash, and 100,000 shi of grain were issued to relieve disaster in Shuntian and its subordinates.',
    'On jimao day, 50,000 taels, 500,000 strings of cash, and 100,000 shi of grain relieved Shuntian.',
  ],
  s1350: [
    'On day renwu, an edict ordered severe punishment for embezzlement and skimming in distributing relief funds.',
    'On renwu day, relief distributors who embezzled or skimmed were to be punished severely.',
  ],
  s1351: [
    'On day gengyin, 300,000 taels from the ministry treasury and customs were allocated to fund Yongding River works.',
    'On gengyin day, 300,000 taels from the ministry and customs funded Yongding works.',
  ],
  s1352: [
    'On day guisi, Hanlin Academy reader Xu Jingcheng was appointed minister plenipotentiary to Russia, Germany, and Austria; expectant official Li Jingfang was appointed minister plenipotentiary to Japan.',
    'On guisi day, Xu Jingcheng went to Russia, Germany, and Austria and Li Jingfang to Japan as ministers plenipotentiary.',
  ],
  s1353: [
    'Flood relief was given to Hubei, Guangxi, Shaanxi, and Yunnan.',
    'Hubei, Guangxi, Shaanxi, and Yunnan received flood relief.',
  ],
  s1354: [
    'Eighth month, day renyin: another 100,000 shi of capital-granary grain was allocated for Shuntian relief needs.',
    'In month 8, renyin, another 100,000 shi of capital grain was set aside for Shuntian relief.',
  ],
  s1355: [
    'On day yisi, the Emperor went to Prince Chun\'s residence to inquire after his illness.',
    'On yisi day, the Emperor visited Prince Chun, who was ill.',
  ],
  s1356: [
    'On day jiyou, Liu Jintang asked to retire.',
    'On jiyou day, Liu Jintang asked to go home.',
  ],
  s1357: [
    'Leave was still granted.',
    'He was still given leave.',
  ],
  s1358: [
    'On day renzi, because Liu Mingchuan had on his own authority promoted commercial mining with confused regulations, an edict stopped it and referred the matter to the ministry for deliberation.',
    'On renzi day, Liu Mingchuan\'s unauthorized mining scheme was halted and sent to the ministry.',
  ],
  s1359: [
    'On day dingsi, 50,000 shi of transport grain were retained and 100,000 taels from the treasury were allocated for Shandong relief.',
    'On dingsi day, 50,000 shi of transport grain and 100,000 taels were set aside for Shandong relief.',
  ],
  s1360: [
    'On day renxu, because of flood disaster in Shuntian and Zhili, an edict told princes, noble mansions, and Beijing banner estates alike to reduce rents.',
    'On renxu day, princes, mansions, and banner estates in the capital region were told to cut rents after the floods.',
  ],
  s1361: [
    'That month, overdue taxes in Shaanxi and Jiangxi were remitted.',
    'That month, Shaanxi and Jiangxi arrears were forgiven.',
  ],
  s1362: [
    'Flood and hail disaster relief was given to Shaanxi; flood relief to Yunnan; and wind disaster relief to Taiwan.',
    'Shaanxi received flood and hail relief, Yunnan flood relief, and Taiwan wind relief.',
  ],
  s1363: [
    'Ninth month, day yihai: the Ministry of Revenue reported a deficit of 150,000 shi in the salary-grain granary; Granary Commissioner Xing Lian and Assistant Commissioner You Baichuan were referred to the ministry for deliberation and soon both were stripped of office.',
    'In month 9, yihai, the Revenue Ministry reported 150,000 shi missing from the salary-grain granary; Xing Lian and You Baichuan lost their posts.',
  ],
  s1364: [
    'On day bingzi, flood relief was given to Hunchun and Ningguta.',
    'On bingzi day, Hunchun and Ningguta received flood relief.',
  ],
  s1365: [
    'On day renwu, censor Wu Zhaotai asked to halt work on the Summer Palace and received severe censure.',
    'On renwu day, censor Wu Zhaotai\'s plea to stop the Summer Palace earned severe censure.',
  ],
  s1366: [
    'The Yongding River breach was closed and the works joined.',
    'The Yongding breach was sealed.',
  ],
  s1367: [
    'On day jiashen, hail disaster relief was given to Gansu.',
    'On jiashen day, Gansu received hail relief.',
  ],
  s1368: [
    'On day renchen, secret-society bandits at Shiyi rebelled and were suppressed and settled.',
    'On renchen day, Shiyi secret-society bandits were crushed.',
  ],
  s1369: [
    'On day guisi, ministry funds and granary grain were allocated for Shuntian relief reserves.',
    'On guisi day, ministry funds and granary grain were set aside for Shuntian relief.',
  ],
  s1370: [
    'Winter, tenth month, day dingwei: Liu Kunyi was made governor-general of the two Jiangs and concurrently Southern Ocean minister.',
    'In winter, month 10, dingwei, Liu Kunyi became two-Jiangs governor-general and Southern Ocean minister.',
  ],
  s1371: [
    'On day gengxu, Zeng Guoquan died and was posthumously made Grand Tutor.',
    'On gengxu day, Zeng Guoquan died and was made Grand Tutor posthumously.',
  ],
  s1372: [
    'On day xinhai, another 50,000 shi of capital-granary grain was allocated for Shuntian relief.',
    'On xinhai day, another 50,000 shi of capital grain went to Shuntian relief.',
  ],
  s1373: [
    'Miscellaneous-grain tax levies on merchants in Fengtian, Zhili, Shandong, and Henan were remitted.',
    'Merchants\' miscellaneous-grain taxes in Fengtian, Zhili, Shandong, and Henan were forgiven.',
  ],
  s1374: [
    'Eleventh month, day yihai: flood relief was given to flooded districts in Hunan.',
    'In month 11, yihai, flooded Hunan districts received relief.',
  ],
  s1375: [
    'On day yiyou, the Emperor escorted the Empress Dowager to Prince Chun\'s residence to inquire after his illness.',
    'On yiyou day, the Emperor took the empress dowager to visit the ailing Prince Chun.',
  ],
  s1376: [
    'On day dinghai, Prince Chun died; court audiences were suspended for seven days; the Emperor escorted the Empress Dowager to the residence to view the encoffining, and the Empress Dowager sent offerings of condolence.',
    'On dinghai day, Prince Chun died; the court mourned seven days and the emperor and empress dowager viewed the encoffining.',
  ],
  s1377: [
    'The prince\'s son, Defender Duke of the State Zai Feng, was ordered to succeed to the princedom that same day.',
    'Prince Chun\'s son Zai Feng succeeded to the title the same day.',
  ],
  s1378: [
    'The Emperor put on mourning garments; an empress dowager edict fixed the title as "the Emperor\'s biological father"; on day jichou an empress dowager edict granted the posthumous epithet Xian.',
    'The Emperor mourned; the empress dowager styled him the emperor\'s biological father and on jichou gave the posthumous name Xian.',
  ],
  s1379: [
    'The Emperor was to wear mourning for one year.',
    'The emperor mourned for one year.',
  ],
  s1380: [
    'Twelfth month, day renzi: an empress dowager edict advanced Assistant Duke of the State Zai Xun to be a one-eighth-rank Defender Duke of the State, and Defender General Zai Tao to be a one-eighth-rank Assistant Duke of the State.',
    'In month 12, renzi, Zai Xun was raised to Defender Duke and Zai Tao to Assistant Duke.',
  ],
  s1381: [
    'On day yimao, Prince Chun the Worthy\'s golden coffin was moved to the garden residence; the Emperor escorted it as far as Shiyuan.',
    'On yimao day, Prince Chun the Worthy\'s coffin went to the garden residence and the emperor escorted it to Shiyuan.',
  ],
  s1382: [
    'On day renxu, work on the Southern Park was slowed.',
    'On renxu day, Southern Park construction was deferred.',
  ],
  s1383: [
    'On day jiazi, overdue taxes from the early Guangxu years at salt fields in Zhejiang departments and districts were remitted.',
    'On jiazi day, Zhejiang salt-field arrears from early Guangxu were forgiven.',
  ],
  s1384: [
    'In the seventeenth year, xinmao, spring, first month, day guisi: Yi bandits at Leibo in Sichuan submitted.',
    'Year 17, spring 1, guisi: Leibo Yi bandits in Sichuan surrendered.',
  ],
  s1385: [
    'Second month, day guimao: 160,000 shi of sea-transport tribute grain were retained for spring relief in Shuntian and Zhili.',
    'In month 2, guimao, 160,000 shi of sea-transport grain were kept for Shuntian-Zhili spring relief.',
  ],
  s1386: [
    'On day jisi, censor Gao Xiezeng asked that daily lectures be instituted.',
    'On jisi day, censor Gao Xiezeng asked for daily lectures.',
  ],
  s1387: [
    'An edict said the proposal was nominal in name and empty in fact and was not adopted.',
    'The court rejected the proposal as empty form.',
  ],
  s1388: [
    'On day xinhai, Li Hongzhang and Zhang Yao were ordered jointly to review the Beiyang navy.',
    'On xinhai day, Li Hongzhang and Zhang Yao were told to inspect the Beiyang fleet.',
  ],
  s1389: [
    'Liu Jintang left office in mourning; Tao Mo was made Xinjiang governor.',
    'Liu Jintang quit in mourning and Tao Mo became Xinjiang governor.',
  ],
  s1390: [
    'Bandits in Yunnan rebelled, took Fumin and Luquan county seats, and were suppressed.',
    'Yunnan bandits seized Fumin and Luquan and were crushed.',
  ],
  s1391: [
    'That month, overdue taxes in Hubei and Shanxi before the thirteenth year were remitted.',
    'That month, Hubei and Shanxi arrears before year 13 were forgiven.',
  ],
  s1392: [
    'Third month, day dingmao: an edict ordered refugees sent home with support.',
    'In month 3, dingmao, refugees were told to return home with aid.',
  ],
  s1393: [
    'On day jisi, the Empress sacrificed to the Sericulture Ancestor.',
    'On jisi day, the empress performed the sericulture rite.',
  ],
  s1394: [
    'On day renshen, river works were repaired in Baodi, Tong, and Ji districts.',
    'On renshen day, Baodi, Tong, and Ji river works were repaired.',
  ],
  s1395: [
    'On day dingchou, Li Hongzhang was ordered to supervise repair of the Guandong railway.',
    'On dingchou day, Li Hongzhang was put in charge of the Guandong railway.',
  ],
  s1396: [
    'On day gengyin, Shankdolin Zhabu was ordered to join Erqing\'e in surveying the Haba River.',
    'On gengyin day, Shankdolin Zhabu and Erqing\'e were sent to survey the Haba River.',
  ],
  s1397: [
    'On day xinmao, Liu Mingchuan was excused on account of illness.',
    'On xinmao day, Liu Mingchuan was released for illness.',
  ],
  s1398: [
    'Summer, fourth month, day dingyou: a temple to Prince Chun the Worthy was established.',
    'In summer, month 4, dingyou, a temple to Prince Chun the Worthy was founded.',
  ],
  s1399: [
    'On day bingwu, the shrine was rebuilt.',
    'On bingwu day, the shrine was rebuilt.',
  ],
  s1400: [
    'On day xinyou, the Summer Palace was completed; from this time the Emperor escorted the Empress Dowager on visits there.',
    'On xinyou day, the Summer Palace was finished and the emperor began taking the empress dowager there.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b14.mjs <translation.json>'
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
