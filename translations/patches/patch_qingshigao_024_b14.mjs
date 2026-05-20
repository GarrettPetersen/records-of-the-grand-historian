#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1301: [
    'Eighth month, day dinghai: quota land taxes on Linchuan flood-washed fields were remitted.',
    'In month 8, dinghai, Linchuan flood-washed quota taxes were forgiven.',
  ],
  s1302: [
    'On day gengyin, the Japanese prince Bokō and Minister Lin Quanzhu were received at the Hall of Benevolent Longevity.',
    'On gengyin day, Japanese Prince Bokō and envoy Lin Quanzhu were received at Benevolent Longevity Hall.',
  ],
  s1303: [
    'That month, relief was given for Anhui flood disaster, Guangdong wind disaster, and Huzhou flood disaster.',
    'That month, Anhui floods, Guangdong wind damage, and Huzhou flooding were relieved.',
  ],
  s1304: [
    'Ninth month, day guimao: foreign ministers and others were received at the Hall of Benevolent Longevity.',
    'In month 9, guimao, foreign ministers were received at Benevolent Longevity Hall.',
  ],
  s1305: [
    'On day bingwu, Chen Jintao and other returned students were granted jinshi, juren, and other degrees with distinctions.',
    'On bingwu day, returned students including Chen Jintao received jinshi and juren degrees.',
  ],
  s1306: [
    'On day jiayin, an edict ordered the official system to be revised.',
    'On jiayin day, the court ordered a new official system.',
  ],
  s1307: [
    'The Grand Council, the Council of State, the Foreign, Personnel, Rites, and Education ministries, the Imperial Clan Court, the Hanlin Academy, and the like remained unchanged.',
    'The Grand Council, State Council, foreign and civil ministries, Imperial Clan Court, and Hanlin Academy stayed as before.',
  ],
  s1308: [
    'The Patrol Police Board became the Ministry of Civil Affairs; the Board of Revenue became the Ministry of Finance; the Board of War became the Ministry of the Army; the Board of Punishments became the Ministry of Justice; the Board of Works was merged into the Board of Commerce as the Ministry of Agriculture, Industry, and Commerce; and the Court of Colonial Affairs became the Ministry of Colonial Affairs.',
    'Patrol Police became Civil Affairs; Revenue became Finance; War became Army; Punishments became Justice; Works merged into Commerce as Agriculture-Industry-Commerce; Colonial Affairs became a ministry.',
  ],
  s1309: [
    'Each was to have one minister and two vice-ministers, with no distinction between Manchu and Han.',
    'Each ministry got one minister and two vice-ministers, ending Manchu-Han division.',
  ],
  s1310: [
    'The Censorate was to have one censor-in-chief and two deputy censors-in-chief.',
    'The Censorate was set at one chief and two deputy censors-in-chief.',
  ],
  s1311: [
    'The six supervising censors were changed to censors, and the Court of Judicial Review became the Supreme Court.',
    'Six supervising censors became censors; the Court of Judicial Review became the Supreme Court.',
  ],
  s1312: [
    'The Ministry of Posts and Communications, the Ministry of the Navy, the General Staff, the Political Consultative Council, and the Audit Office were newly established.',
    'New bodies included Posts and Communications, Navy, General Staff, Political Consultative Council, and Audit Office.',
  ],
  s1313: [
    'The Finance Office was placed under the Ministry of Finance; the Temple of Imperial Ancestors, the Imperial Banqueting Court, and the Court of State Ceremonial were placed under the Ministry of Rites.',
    'The Finance Office joined Finance; the Ancestor Temple, Banqueting Court, and State Ceremonial Court joined Rites.',
  ],
  s1314: [
    'The Court of the Imperial Stud and the Army Training Office were placed under the Ministry of the Army.',
    'The Imperial Stud and Army Training Office were placed under the Army Ministry.',
  ],
  s1315: [
    'All ministry ministers were also to serve as ministers on the Council for Political Affairs.',
    'Every ministry minister also sat on the Council for Political Affairs.',
  ],
  s1316: [
    'Shixu was made a Grand Councilor; Lin Shaonian was to study while serving on the Grand Council; Lu Chuanlin, Rongqing, Xu Shichang, and Tieliang were all removed from the Grand Council and were to manage their ministries exclusively.',
    'Shixu joined the Grand Council; Lin Shaonian studied on the council; Lu Chuanlin, Rongqing, Xu Shichang, and Tieliang left the council for ministry posts.',
  ],
  s1317: [
    'On day yimao, 100,000 taels from the Guangdong treasury were issued to relieve Hong Kong and the Chao, Gao, Lei, Qin, and Lian districts from wind disaster.',
    'On yimao day, 100,000 Guangdong taels relieved Hong Kong and coastal districts hit by wind.',
  ],
  s1318: [
    'On day dingsi, the Council for Political Affairs was renamed the Council for Deliberation on Government Affairs.',
    'On dingsi day, the political affairs council became the deliberative government council.',
  ],
  s1319: [
    'On day wuwu, Zeng Guangquan was ordered to serve as minister to Germany with third-rank capital official rank.',
    'On wuwu day, Zeng Guangquan was sent as minister to Germany.',
  ],
  s1320: [
    'Winter, tenth month, day guiyou: the empress dowager\'s birthday; banquets were suspended.',
    'In winter, month 10, guiyou, the empress dowager\'s birthday banquets were stopped.',
  ],
  s1321: [
    'On day guiwei, British Minister Zhu Erdian and Belgian Minister Ke Niya were received in the Palace of Heavenly Purity.',
    'On guiwei day, British Minister Zhu Erdian and Belgian Minister Ke Niya were received at Heavenly Purity.',
  ],
  s1322: [
    'On day yiyou, the Guangdong land-route and water-route regional commanders were merged into one Guangdong regional commander.',
    'On yiyou day, Guangdong\'s land and water commanders were merged into one post.',
  ],
  s1323: [
    'On day dinghai, Japanese Minister Lin Quanzhu and others were received at the Hall of Diligent Government.',
    'On dinghai day, Japanese Minister Lin Quanzhu and others were received at Diligent Government Hall.',
  ],
  s1324: [
    'On day wuzi, the sorcerer-rebels Wang Yongqiu and Chen Xianlong of Liuyang and Liling incited disorder; government troops captured and executed them.',
    'On wuzi day, Liuyang and Liling sorcerer-leaders Wang Yongqiu and Chen Xianlong were captured and executed.',
  ],
  s1325: [
    'On day jichou, 300,000 taels of transport-tax conversion funds were allocated for Jiangsu relief.',
    'On jichou day, 300,000 taels of converted transport tax were set aside for Jiangsu relief.',
  ],
  s1326: [
    'On day xinmao, an official gazette office was established in the capital.',
    'On xinmao day, an official gazette office was opened in Beijing.',
  ],
  s1327: [
    'Eleventh month, day jihai: 100,000 taels of Guangdong annual funds were retained for relief.',
    'In month 11, jihai, 100,000 Guangdong annual funds were kept for relief.',
  ],
  s1328: [
    'On day renyin, the antimony mine shaft tax in Guangxi was remitted.',
    'On renyin day, Guangxi antimony mine shaft tax was forgiven.',
  ],
  s1329: [
    'On day jiachen, 80,000 taels from the Shaanxi official treasury were allocated to aid Jiangsu relief.',
    'On jiachen day, 80,000 Shaanxi official taels aided Jiangsu relief.',
  ],
  s1330: [
    'On day wushen, an edict raised Confucius to the rank of great sacrifice; the responsible offices were ordered to deliberate ritual and report.',
    'On wushen day, Confucius was raised to great-sacrifice rank and ritual offices were told to report.',
  ],
  s1331: [
    'On day guichou, the provinces were ordered to deliberate currency reform.',
    'On guichou day, provinces were ordered to debate currency reform.',
  ],
  s1332: [
    'On day dingmao, a school was built at Qufu and 100,000 taels from the inner treasury were issued to fund the work.',
    'On dingmao day, a Qufu school was built with 100,000 inner-treasury taels.',
  ],
  s1333: [
    'That month, Mexican Minister Huerda was received at the Hall of Diligent Government; German Minister Leikesi, French Minister Baside, and British Minister Zhu Erdian were received in the Palace of Heavenly Purity.',
    'That month, Mexican, German, French, and British ministers were received at court.',
  ],
  s1334: [
    'Twelfth month, new moon on day guihai: there was an eclipse of the sun.',
    'At the twelfth-month new moon, guihai, the sun was eclipsed.',
  ],
  s1335: [
    'On day dingmao, stipends for integrity were increased for capital officials.',
    'On dingmao day, capital officials\' integrity stipends were raised.',
  ],
  s1336: [
    'On day jiaxu, ministers resident in foreign countries were changed to substantive second-rank posts.',
    'On jiaxu day, resident foreign ministers became substantive second-rank officials.',
  ],
  s1337: [
    'That winter, relief was given for disasters in Puning, Zhaozhou, Luoping, and Shizong, and for flood disaster in Jiangning and Yangzhou.',
    'That winter, Puning, Zhaozhou, Luoping, Shizong, Jiangning, and Yangzhou disasters were relieved.',
  ],
  s1338: [
    'Quota grain taxes were remitted for flood disaster in Luanping and Anzhou; quota taxes in Yongcheng; overdue levies in Xianning and other places in Shaanxi; and owed grain on disaster land in Yongping, Taihe, and Kunming.',
    'Luanping, Anzhou, Yongcheng, Shaanxi arrears, and Yongping, Taihe, and Kunming disaster grain were forgiven.',
  ],
  s1339: [
    'Thirty-third year, dingwei, spring, first month, day jiachen: foreign ministers were received in the Palace of Heavenly Purity.',
    'Year 33, spring 1, jiachen: foreign ministers were received at Heavenly Purity.',
  ],
  s1340: [
    'On day gengxu, the minor capital officials of each ministry were cut.',
    'On gengxu day, each ministry\'s minor capital posts were abolished.',
  ],
  s1341: [
    'Second month, day jiazi: You Tai was stripped of office for mishandling Tibetan affairs and was banished to the military garrisons.',
    'In month 2, jiazi, You Tai lost office over Tibet and was banished to the garrisons.',
  ],
  s1342: [
    'On day renshen, 150,000 taels of Jiangsu transport grain were retained for relief.',
    'On renshen day, 150,000 taels of Jiangsu transport grain were kept for relief.',
  ],
  s1343: [
    'Third month, day bingshen: Japanese Minister Lin Quanzhu and others were received at the Hall of Diligent Government.',
    'In month 3, bingshen, Japanese Minister Lin Quanzhu and others were received.',
  ],
  s1344: [
    'On day wuxu, treaty ports were opened at Changchun and Harbin.',
    'On wuxu day, Changchun and Harbin were opened as treaty ports.',
  ],
  s1345: [
    'On day jihai, the Shengjing general was changed to governor-general of the three eastern provinces; the Jilin and Heilongjiang generals were abolished and three governors were set up for Fengtian, Jilin, and Heilongjiang; Xu Shichang was made imperial commissioner and governor-general of the three eastern provinces.',
    'On jihai day, Shengjing became a three-province governor-generalship under Xu Shichang with three governors.',
  ],
  s1346: [
    'On day renyin, Prefect Sun Baoqi was ordered to serve as minister to Germany.',
    'On renyin day, Sun Baoqi was sent as minister to Germany.',
  ],
  s1347: [
    'On day renzi, Tianjin Circuit Intendant Liang Dunyan was ordered to serve as minister to the United States, Mexico, and Peru.',
    'On renzi day, Liang Dunyan was sent as minister to the United States, Mexico, and Peru.',
  ],
  s1348: [
    'On day bingshen, Lu Zhengxiang was ordered to serve as special envoy to the Hague Peace Conference; Li Jingfang was ordered as minister to Britain; Qian Xun was ordered as minister to the Netherlands.',
    'On bingshen day, Lu Zhengxiang, Li Jingfang, and Qian Xun were assigned as ministers abroad.',
  ],
  s1349: [
    'On day dingsi, Kungang died.',
    'On dingsi day, Kungang died.',
  ],
  s1350: [
    'That spring, overdue levies were remitted for Zhongwei flood districts and Yulin and its subordinates; overdue grain and quota taxes were remitted for Yunnan drought districts.',
    'That spring, Zhongwei, Yulin, and Yunnan drought and flood arrears were forgiven.',
  ],
  s1351: [
    'Fourth month, day jiazi: civil braves and constables in each province were cut and patrol police were established instead.',
    'In month 4, jiazi, provincial braves and catchers were cut and patrol police set up.',
  ],
  s1352: [
    'Suilai suffered an earthquake.',
    'Suilai was hit by an earthquake.',
  ],
  s1353: [
    'On day yichou, Censor Zhao Qilin was stripped of office for slandering imperial relatives.',
    'On yichou day, Zhao Qilin lost his post for slandering imperial kin.',
  ],
  s1354: [
    'On day xinwei, the official system of the three eastern provinces was revised: Fengtian, Jilin, and Heilongjiang each set up provincial government offices with the governor-general as chief and the governor as deputy, with left and right counselors to head the Announcement and Deliberation offices, and seven departments for foreign affairs, banner affairs, civil administration, education, finance, industry promotion, and Mongol affairs, each with a commissioner, as well as a judicial commissioner, a training command, and the like.',
    'On xinwei day, the three eastern provinces got provincial offices, counselors, seven departments, and judicial and training posts.',
  ],
  s1355: [
    'On day jimao, prayers were offered for rain.',
    'On jimao day, the court prayed for rain.',
  ],
  s1356: [
    'On day xinsi, because of flood disaster north of the Yangtze, the export of grain was strictly forbidden.',
    'On xinsi day, grain exports were banned because of Jiangbei flooding.',
  ],
  s1357: [
    'On day dinghai, the army and navy official systems were fixed: the Army Ministry was to have two offices and ten departments, the General Staff five departments, and the Navy Ministry six departments.',
    'On dinghai day, army and navy ministries were organized with two offices and ten, five, and six departments.',
  ],
  s1358: [
    'On day wuzi, the Duke of Yansheng Kong Lingyi was ordered to inspect Shandong educational affairs.',
    'On wuzi day, Kong Lingyi, Duke of Yansheng, was told to inspect Shandong schools.',
  ],
  s1359: [
    'Fifth month, day guisi: lamas in Batang and its subordinates incited western barbarians on the Hexi frontier to rebel; government troops suppressed and pacified them.',
    'In month 5, guisi, Batang lamas stirred Hexi tribes; troops pacified them.',
  ],
  s1360: [
    'On day yiwei, Wang Shizhen was ordered to act as Jiangbei regional commander with vice-minister rank.',
    'On yiwei day, Wang Shizhen acted as Jiangbei commander with vice-minister rank.',
  ],
  s1361: [
    'On day bingshen, fires were forbidden in the western tombs preserve.',
    'On bingshen day, fires were banned in the western tombs preserve.',
  ],
  s1362: [
    'On day dingyou, Qu Hongji was dismissed.',
    'On dingyou day, Qu Hongji was dismissed.',
  ],
  s1363: [
    'On day jihai, Lu Chuanlin was made a Grand Councilor.',
    'On jihai day, Lu Chuanlin joined the Grand Council.',
  ],
  s1364: [
    'Prince Chun was ordered to attend directly in the Grand Council.',
    'Prince Chun was ordered to sit directly on the Grand Council.',
  ],
  s1365: [
    'On day xinchou, Wang Wenshao was dismissed and Zhang Zhidong was ordered to serve as assisting grand secretary.',
    'On xinchou day, Wang Wenshao fell and Zhang Zhidong became assisting grand secretary.',
  ],
  s1366: [
    'On day guimao, Chongli died.',
    'On guimao day, Chongli died.',
  ],
  s1367: [
    'On day dingsi, provincial surveillance commissioners were changed to judicial commissioners; patrol and industry-promotion circuits were established; divisional and circuit-intendant posts were cut, military-preparedness circuits were retained as appropriate, trial offices were set up in preparation for judicial independence, and auxiliary local officials were increased and adjusted in preparation for local self-government, to be fully implemented within fifteen years.',
    'On dingsi day, surveillance became judicial commissioners, trial offices and self-government reforms were planned within fifteen years.',
  ],
  s1368: [
    'On day wuwu, an edict said: \\"Under a constitution, officials and people alike bear responsibility; those who know how to prepare and the order in which measures should be applied may submit items in detail for selection and report by the authorities.',
    'On wuwu day, an edict said: \\"Under a constitution officials and people share duty; those who know how to prepare may submit plans.\\"',
  ],
  s1369: [
    '\\" Xu Xilin, an expectant circuit intendant in Anhui, assassinated Governor Enming; Xu was captured and executed.',
    'Expectant intendant Xu Xilin assassinated Governor Enming in Anhui and was executed.',
  ],
  s1370: [
    'Sixth month, day xinyou: Li Jiaju was ordered to serve as minister to Japan.',
    'In month 6, xinyou, Li Jiaju was sent as minister to Japan.',
  ],
  s1371: [
    'On day bingyin, Censor Zhao Qilin\'s office was restored.',
    'On bingyin day, Zhao Qilin was restored as censor.',
  ],
  s1372: [
    'On day renshen, from the fourth month without rain until this day it rained.',
    'On renshen day, rain ended a drought that had lasted since the fourth month.',
  ],
  s1373: [
    'Zhang Zhidong was made grand secretary of the Hall of Esteeming Benevolence; Lu Chuanlin was made assisting grand secretary.',
    'Zhang Zhidong became a grand secretary and Lu Chuanlin assisting grand secretary.',
  ],
  s1374: [
    'On day yiyou, the longevity banquet was suspended.',
    'On yiyou day, the longevity banquet was stopped.',
  ],
  s1375: [
    'The Yongding River burst its banks.',
    'The Yongding River broke.',
  ],
  s1376: [
    'That summer, quota taxes were remitted for flood at Xinhua; overdue levies for bandit damage at Yitong; and silver and grain for drought districts in Yunnan.',
    'That summer, Xinhua flood taxes, Yitong bandit arrears, and Yunnan drought grain were forgiven.',
  ],
  s1377: [
    'Famine in Yunnan and flood disaster in Zhili were relieved.',
    'Yunnan famine and Zhili flooding were relieved.',
  ],
  s1378: [
    'Autumn, seventh month, day xinmao: Chinese and foreign officials were ordered to deliberate the abolition of Manchu-Han distinctions.',
    'In autumn, month 7, xinmao, officials were told to debate ending Manchu-Han distinctions.',
  ],
  s1379: [
    'On day jiawu, the Bureau for the Investigation of Government was changed to the Bureau for the Compilation and Investigation of Constitutional Government.',
    'On jiawu day, the political investigation bureau became the constitutional compilation bureau.',
  ],
  s1380: [
    'Grand Councilors, grand secretaries, and ministers on the Council for Political Affairs were to deliberate matters in the Grand Secretariat.',
    'Councilors, grand secretaries, and political-affairs ministers were to meet in the Grand Secretariat.',
  ],
  s1381: [
    'On day renyin, an empress dowager edict sent Yang Shiqi to inspect the various ports of Southeast Asia and encourage overseas Chinese.',
    'On renyin day, Yang Shiqi was sent to Southeast Asian ports to encourage overseas Chinese.',
  ],
  s1382: [
    'Quota taxes were remitted for disaster in Zhaozhou and Lufeng.',
    'Zhaozhou and Lufeng disaster quota taxes were forgiven.',
  ],
  s1383: [
    'Disaster victims in Shuntian and its subordinates were relieved, as were those in the flood-dragon disasters at Liuyang and Shaoyang.',
    'Shuntian victims and Liuyang and Shaoyang flood-dragon disasters were relieved.',
  ],
  s1384: [
    'On day jiachen, an edict said that rebels often used the name of revolution to deceive and incite people.',
    'On jiachen day, an edict said rebels often used revolution to incite people.',
  ],
  s1385: [
    'Each governor and governor-general was to find means to disband them.',
    'Each governor was told to disband such groups.',
  ],
  s1386: [
    'Captured offenders were to be sentenced separately as rebels or bandits; those coerced and family members who did not know were not to be implicated.',
    'Rebels and bandits were to be sentenced separately; coerced followers and innocent kin were spared.',
  ],
  s1387: [
    'Zhang Yintang was ordered to serve as plenipotentiary to negotiate a Tibetan treaty with Britain.',
    'Zhang Yintang was made plenipotentiary to negotiate Tibet with Britain.',
  ],
  s1388: [
    'Jingshin died.',
    'Jingshin died.',
  ],
  s1389: [
    'On day jiyou, a time limit was set for organizing thirty-six army divisions.',
    'On jiyou day, a schedule was fixed to organize thirty-six army divisions.',
  ],
  s1390: [
    'On day bingchen, Zhang Zhidong and Yuan Shikai were both made Grand Councilors, with Yuan Shikai as minister of foreign affairs.',
    'On bingchen day, Zhang Zhidong and Yuan Shikai joined the Grand Council and Yuan became foreign minister.',
  ],
  s1391: [
    'On day dingsi, Yang Shixiang was ordered to act as Zhili governor-general and Beiyang commissioner.',
    'On dingsi day, Yang Shixiang acted as Zhili governor-general and Beiyang commissioner.',
  ],
  s1392: [
    'On day wuwu, Li Jingmai was excused because of his mother\'s illness; Lei Butong was ordered to serve as minister to Austria.',
    'On wuwu day, Li Jingmai left for his mother\'s illness and Lei Butong went to Austria.',
  ],
  s1393: [
    'On day jiwei, the Yellow River burst its banks at Meng County.',
    'On jiwei day, the Yellow River broke at Meng County.',
  ],
  s1394: [
    'Eighth month, day xinyou: the Emperor was unwell; the provinces were ordered to recommend men skilled in medicine.',
    'In month 8, xinyou, the Emperor fell ill and provinces were told to recommend physicians.',
  ],
  s1395: [
    'Wang Daxi was sent to Britain, Dashou to Japan, and Yu Shimei to Germany, all as commissioners to investigate constitutional government.',
    'Wang Daxi, Dashou, and Yu Shimei were sent to Britain, Japan, and Germany to study constitutional government.',
  ],
  s1396: [
    'On day renxu, the capital High Court of Justice was established.',
    'On renxu day, the capital High Court of Justice was set up.',
  ],
  s1397: [
    'On day jisi, the Office of the Prosecutor General was established.',
    'On jisi day, the Prosecutor General\'s Office was established.',
  ],
  s1398: [
    'On day renshen, the Political Consultative Council was established, with the prince Pulun and Sun Jianai as presidents.',
    'On renshen day, the Political Consultative Council was opened under Pulun and Sun Jianai.',
  ],
  s1399: [
    'On day yihai, Wu Tingfang was ordered to serve as minister to the United States and Sa Yintu as minister to Russia.',
    'On yihai day, Wu Tingfang went to the United States and Sa Yintu to Russia.',
  ],
  s1400: [
    'On day jimao, an edict said that garrison troops in the provinces had grown idle through habit; each general and the like was ordered to grant fields and supervise farming, and after they returned to agriculture all affairs were to pass to the civil authorities.',
    'On jimao day, idle provincial garrisons were ordered to farm and then yield civil authority to local officials.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b14.mjs <translation.json>'
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
