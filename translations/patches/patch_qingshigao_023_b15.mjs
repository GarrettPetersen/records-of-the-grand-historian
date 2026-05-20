#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1401: [
    'Fifth month, from day dingmao to gengwu, rain fell continuously.',
    'In month 5, from dingmao through gengwu, it rained without stop.',
  ],
  s1402: [
    'On day xinwei, the Empress personally performed the mulberry ceremony.',
    'On xinwei day the Empress performed the mulberry rite in person.',
  ],
  s1403: [
    'On day renwu, relief was given for wind disasters in Qingjiang and other places.',
    'On renwu day Qingjiang and other districts received wind-disaster relief.',
  ],
  s1404: [
    'That month, locusts appeared in the capital region.',
    'That month locusts struck the capital region.',
  ],
  s1405: [
    'The Zongli Yamen, because missionary cases kept arising in the provinces, asked that they be strictly handled.',
    'The Zongli Yamen asked the provinces to crack down as missionary cases kept breaking out.',
  ],
  s1406: [
    'An edict stated: "Missionary activity by the various powers is set out in the treaties; merchants and missionaries in every province should have their persons and property vigorously protected.',
    'The court said treaty powers may preach and every province must protect merchants and missionaries.',
  ],
  s1407: [
    'Recently churches have been burned, and this has happened at the same time in many places.',
    'Churches have lately been burned in many places at once.',
  ],
  s1408: [
    'Clearly bandits are spreading rumors and stirring trouble; each governor-general and governor is to arrest and punish them so that they do no harm.',
    'Bandits are clearly spreading rumors; governors-general and governors must arrest them and stop the trouble.',
  ],
  s1409: [
    '"',
    '"',
  ],
  s1410: [
    'Sixth month, day wuxu: an edict ordered strict pursuit of secret-society bandits.',
    'On month 6, wuxu, the court ordered secret-society bandits hunted down.',
  ],
  s1411: [
    'On day wushen, an edict granted original pardon to secret-society members who surrendered and to those who secretly reported ringleaders and thereby enabled capture.',
    'On wushen day secret-society members who surrendered or informed on leaders were pardoned.',
  ],
  s1412: [
    'On day xinhai, Wang Wenshao memorialized the execution of Battalion Vice Commander Bao Hu, who had joined the rebels.',
    'On xinhai day Wang Wenshao reported the execution of rebel ally Bao Hu.',
  ],
  s1413: [
    'The Pisha Man chief Lu Wenqin of Qiaojia subprefecture was executed; twenty-one Yi stockades in southwestern Yunnan submitted.',
    'Qiaojia Pisha Man chief Lu Wenqin was executed and twenty-one Yunnan Yi stockades submitted.',
  ],
  s1414: [
    'Autumn, seventh month, day guiwei: following Wang Wenshao\'s report, the Mengcan, Mengjiao, and Mengdong native chiefs in Yunnan had their boundaries fixed to end disputes.',
    'On month 7, guiwei, Yunnan\'s Mengcan, Mengjiao, and Mengdong chiefs had borders fixed to end strife.',
  ],
  s1415: [
    'Mengding native prefect Han Zhongbang was given the title of Pacification Commissioner; native officer Han Ronggao was put in charge of Mengjiao and Mengdong; a native company commander was granted hereditary succession.',
    'Han Zhongbang of Mengding became Pacification Commissioner; Han Ronggao took Mengjiao and Mengdong; a native captaincy was made hereditary.',
  ],
  s1416: [
    'On day yiyou, Zhang Yao died.',
    'On yiyou day Zhang Yao died.',
  ],
  s1417: [
    'Eighth month, new moon day renchen: the aged scholar Shi Menglan of Leting was given fourth-rank Courtier rank.',
    'On month 8\'s renchen new moon, Leting scholar Shi Menglan received fourth-rank Courtier rank.',
  ],
  s1418: [
    'On day guisi, Yikuang was ordered to direct naval affairs, with Ding\'an and Liu Kunyi assisting.',
    'On guisi day Yikuang took naval affairs and Ding\'an and Liu Kunyi assisted.',
  ],
  s1419: [
    'On day jihai, the Shunzhi Emperor\'s Moral Maxims in Manchu, translated into Chinese, was completed; it was issued to provincial school officials and, on the first and fifteenth of each month, was to be preached together with the Sacred Edict.',
    'On jihai day the Chinese translation of Shunzhi\'s Moral Maxims was finished and ordered preached with the Sacred Edict on new and full moons.',
  ],
  s1420: [
    'Bao Quan died.',
    'Bao Quan died.',
  ],
  s1421: [
    'On day guichou, frontier officials were ordered to discipline the camps, remove long-standing abuses, and strictly forbid collusion and shielding.',
    'On guichou day frontier officials were told to clean up the camps and stop collusion and cover-ups.',
  ],
  s1422: [
    'Ninth month, day guiwei: arrears of land tax in Shaanxi from previous years were remitted.',
    'On month 9, guiwei, Shaanxi\'s old land-tax arrears were remitted.',
  ],
  s1423: [
    'On day bingxu, at first envoys from friendly states, since the twelfth year of Tongzhi, had all been received at Ziguang Pavilion.',
    'On bingxu day it was noted that since Tongzhi year 12 foreign envoys had been received at Ziguang Pavilion.',
  ],
  s1424: [
    'That month, German minister von Brandt said China treated him like a dependency and repeatedly pressed to change the audience venue.',
    'That month German minister von Brandt complained of vassal treatment and kept asking to change the audience hall.',
  ],
  s1425: [
    'At this point the Austrian minister Biegeleben had arrived, so the audience was held at Chengguang Hall.',
    'The Austrian minister Biegeleben then arrived and was received at Chengguang Hall.',
  ],
  s1426: [
    'On day wuzi, Beisheng native subprefecture in Yunnan was converted from native rule to direct administration.',
    'On wuzi day Yunnan\'s Beisheng native subprefecture was abolished for direct rule.',
  ],
  s1427: [
    'Tenth month, day dingyou: arrears of tax and banner rent in Xi and Yuci and other places were remitted.',
    'On month 10, dingyou, tax and banner-rent arrears at Xi, Yuci, and elsewhere were remitted.',
  ],
  s1428: [
    'On day guichou, an edict ordered the Panchen Erdeni Khutuktu to take the throne next year in the first month; Sheng Tai and Su Khutuktu were sent to attend; an imperial letter and precious objects were dispatched.',
    'On guichou day the Panchen Erdeni was to take the throne next spring; Sheng Tai and Su Khutuktu were sent with gifts and an imperial letter.',
  ],
  s1429: [
    'On day jiayin, the Song Confucian You Zuo was granted posthumous worship in the Confucian temple.',
    'On jiayin day the Song scholar You Zuo entered the Confucian temple.',
  ],
  s1430: [
    'On day wuwu, bandits rose at Chaoyang in Rehe; Brigadier Ye Zhichao and Nie Shicheng suppressed and pacified them.',
    'On wuwu day Chaoyang bandits in Rehe were crushed by Ye Zhichao and Nie Shicheng.',
  ],
  s1431: [
    'Eleventh month, day dingmao: because the Rehe bandit ringleaders had been captured and executed, the people were told that whether or not they had joined societies they might start anew; those who came forward of their own accord were pardoned.',
    'On month 11, dingmao, Rehe bandit leaders were executed and all, society members or not, were offered amnesty if they came in.',
  ],
  s1432: [
    'On day yihai, Vice Minister of Revenue Chongli and Vice Minister of War Hong Jun were both ordered to serve in the Zongli Yamen.',
    'On yihai day Chongli and Hong Jun joined the Zongli Yamen.',
  ],
  s1433: [
    'On day jimao, the Sea Transport Granary caught fire.',
    'On jimao day the Sea Transport Granary burned.',
  ],
  s1434: [
    'On day jiashen, because of bandit disorder in the Kharachin banner, 30,000 taels from the treasury were allotted for relief.',
    'On jiashen day 30,000 taels were sent to relieve the Kharachin banner after bandit trouble.',
  ],
  s1435: [
    'Relief was given for the Hankou fire disaster.',
    'Hankou fire victims received relief.',
  ],
  s1436: [
    'Twelfth month, day bingshen: arrears of tax from early Guangxu years in Henan were remitted.',
    'On month 12, bingshen, Henan\'s early Guangxu tax arrears were remitted.',
  ],
  s1437: [
    'On day yisi, areas in Rehe afflicted by bandits received relief.',
    'On yisi day Rehe districts hit by bandits were relieved.',
  ],
  s1438: [
    'On day wushen, the Imperial Household Department was again ordered to economize expenses.',
    'On wushen day the Imperial Household Department was again told to cut costs.',
  ],
  s1439: [
    'That winter, unpaid grain taxes for the current year in Zhejiang and Shaanxi were remitted.',
    'That winter Zhejiang and Shaanxi were forgiven current-year tax arrears.',
  ],
  s1440: [
    'The eighteenth year, renchen, spring, first month, day dinghai: the Grand Canal was dredged.',
    'Year 18, spring 1, dinghai: the Grand Canal was dredged.',
  ],
  s1441: [
    'On day xinmao, 50,000 taels from the treasury were allotted to Rehe to relieve the Aohan and Naiman Mongol banners.',
    'On xinmao day 50,000 taels went to Rehe for the Aohan and Naiman banners.',
  ],
  s1442: [
    'On day guichou, British troops entered Kanjutai; native chiefs of the border fled to Sarikol and were comforted with relief.',
    'On guichou day British troops entered Kanjutai; border chiefs fled to Sarikol and were relieved.',
  ],
  s1443: [
    'Third month, day gengshen: Yan Jingming died.',
    'In month 3, gengshen, Yan Jingming died.',
  ],
  s1444: [
    'Summer, fourth month, day jiyou: Prince Chun the Worthy was buried.',
    'In summer, month 4, jiyou, Prince Chun the Worthy was buried.',
  ],
  s1445: [
    'That month, aboriginal communities in the Taiwan interior rose in disorder and were suppressed.',
    'That month Taiwan interior tribes rebelled and were pacified.',
  ],
  s1446: [
    'Fifth month, day jiazi: bandits rose at Yangjiang; ringleader Tan Yunqing was executed.',
    'On month 5, jiazi, Yangjiang bandits were crushed and Tan Yunqing executed.',
  ],
  s1447: [
    'On day gengwu, rain was prayed for.',
    'On gengwu day the court prayed for rain.',
  ],
  s1448: [
    'On day xinwei, Liu Fuyao and three hundred seventeen others received jinshi degrees with titles varying by rank.',
    'On xinwei day Liu Fuyao and 317 others received jinshi with graded titles.',
  ],
  s1449: [
    'On day yihai, Hefei and other prefectures and counties afflicted by drought and locusts received relief.',
    'On yihai day Hefei and other drought- and locust-hit counties were relieved.',
  ],
  s1450: [
    'That month, bandit ringleaders including Mo Zixian at Shanglin and Binzhou were executed.',
    'That month Mo Zixian and other bandit leaders at Shanglin and Binzhou were executed.',
  ],
  s1451: [
    'Sixth month, day gengyin: rain was prayed for.',
    'On month 6, gengyin, the court prayed for rain.',
  ],
  s1452: [
    'On day bingshen, it rained.',
    'On bingshen day rain fell.',
  ],
  s1453: [
    'On day renyin, Compiler Wang Fengzao was appointed minister to Japan.',
    'On renyin day Compiler Wang Fengzao became minister to Japan.',
  ],
  s1454: [
    'Intercalary sixth month, day jiwei: the Yongding River breached.',
    'On intercalary month 6, jiwei, the Yongding River broke its banks.',
  ],
  s1455: [
    'On day gengshen, Fenzhou and the seven banners of Guisui received drought relief.',
    'On gengshen day Fenzhou and Guisui\'s seven banners were relieved for drought.',
  ],
  s1456: [
    'On day jiazi, 50,000 shi of grain transport each from Jiangsu and northern Jiangsu were retained in Zhili for relief reserves.',
    'On jiazi day 50,000 shi each from Jiangsu and northern Jiangsu grain transport were held in Zhili for relief.',
  ],
  s1457: [
    'On day bingyin, Akedachun was dismissed as Shanxi governor for improper answers at audience.',
    'On bingyin day Akedachun lost the Shanxi governorship for a bad audience reply.',
  ],
  s1458: [
    'On day dingchou, because of flooding near the capital, 100,000 taels from the ministry treasury were allotted for relief reserves.',
    'On dingchou day 100,000 taels were set aside for capital-region flood relief.',
  ],
  s1459: [
    'On day gengchen, En Cheng died.',
    'On gengchen day En Cheng died.',
  ],
  s1460: [
    'That month, locusts appeared in the capital region.',
    'That month locusts struck the capital region.',
  ],
  s1461: [
    'Autumn, seventh month, day xinchou: 100,000 taels from the treasury were allotted as relief reserves for the various districts of Yunnan.',
    'On month 7, xinchou, 100,000 taels were reserved for Yunnan relief.',
  ],
  s1462: [
    'On day renyin, locusts appeared in Henan.',
    'On renyin day locusts hit Henan.',
  ],
  s1463: [
    'On day guichou, Tang Jiong was ordered to put copper transport in order.',
    'On guichou day Tang Jiong was told to straighten out copper transport.',
  ],
  s1464: [
    'Eighth month, day bingyin: Kui Huan was ordered to negotiate the India-Tibet trade treaty with British minister Bourdillon.',
    'On month 8, bingyin, Kui Huan was to treat the India-Tibet trade pact with Bourdillon.',
  ],
  s1465: [
    'On day jiayin, Fu Kun was made Grand Secretary of the Hall of Esteemed Morals; Lin Shu was made Associate Grand Secretary.',
    'On jiayin day Fu Kun joined the Grand Secretariat and Lin Shu became associate grand secretary.',
  ],
  s1466: [
    'New grain transport from Shandong was retained for relief.',
    'Shandong\'s new grain transport was held for relief.',
  ],
  s1467: [
    'Ninth month, day gengyin: 50,000 shi of northern Jiangsu grain transport were allotted as relief reserves for the districts under Zhenjiang.',
    'On month 9, gengyin, 50,000 shi of northern Jiangsu grain were reserved for Zhenjiang relief.',
  ],
  s1468: [
    'On day jihai, bandit ringleader Chen Gong of Dehua in Fujian was executed.',
    'On jihai day Fujian Dehua bandit Chen Gong was executed.',
  ],
  s1469: [
    'On day renyin, unpaid grain taxes in Shaanxi from previous years were remitted.',
    'On renyin day Shaanxi\'s old grain-tax arrears were remitted.',
  ],
  s1470: [
    'Tenth month, new moon day yimao: 30,000 shi of Jiangnan grain transport were retained as relief reserves for the counties under Jiangning.',
    'On month 10\'s yimao new moon, 30,000 shi of Jiangnan grain were held for Jiangning relief.',
  ],
  s1471: [
    'On day gengshen, bandit ringleader Deng Haishan of Liling was executed.',
    'On gengshen day Liling bandit Deng Haishan was executed.',
  ],
  s1472: [
    'On day jisi, relief was given for the flood disaster at Yarkand.',
    'On jisi day Yarkand flood victims were relieved.',
  ],
  s1473: [
    'Grain rent and miscellaneous levies in Tongzhou and other places in Zhili were remitted.',
    'Zhili\'s Tongzhou and other districts were forgiven grain rent and miscellany.',
  ],
  s1474: [
    'Eleventh month, new moon day yiyou: arrears of tax in Tongzhou and other places in Zhili were remitted.',
    'On month 11\'s yiyou new moon, Zhili tax arrears at Tongzhou and elsewhere were remitted.',
  ],
  s1475: [
    'On day xinmao, relief was given for flood disasters in Taiwan and other places.',
    'On xinmao day Taiwan and other flood-hit districts were relieved.',
  ],
  s1476: [
    'On day xinchou, Li Hongzhang, Sun Jia\'nai, and others were ordered to inspect relief work; officials in afflicted prefectures and counties who treated the people\'s suffering lightly were to be severely impeached and reported.',
    'On xinchou day Li Hongzhang and Sun Jia\'nai were told to inspect relief and impeach neglectful officials.',
  ],
  s1477: [
    'On day renyin, arrears of tax in the various subprefectures, prefectures, counties, and garrisons of Jiangsu were remitted.',
    'On renyin day Jiangsu\'s tax arrears were remitted.',
  ],
  s1478: [
    'On day gengxu, 100,000 taels from the treasury were allotted to relieve flood, drought, hail, and frost disasters in Taiyuan and other districts.',
    'On gengxu day 100,000 taels went to Taiyuan and other districts for flood, drought, and hail.',
  ],
  s1479: [
    'On day guichou, 20,000 taels from the privy purse were allotted to relieve disaster victims in the various districts of Zhili.',
    'On guichou day 20,000 taels from the privy purse relieved Zhili disaster victims.',
  ],
  s1480: [
    'Twelfth month, new moon day yimao: an edict ordered princes and ministers to undertake the sixtieth-birthday celebrations for the Empress Dowager, jointly with the Ministries of Revenue, Rites, and Works and the Imperial Household Department, to search old precedents carefully and report in detail.',
    'On month 12\'s yimao new moon, princes and ministers were told to plan the Empress Dowager\'s sixtieth birthday with the ministries and report.',
  ],
  s1481: [
    'On day bingyin, Liu Jintang was summoned to the capital.',
    'On bingyin day Liu Jintang was called to Beijing.',
  ],
  s1482: [
    'On day dingmao, 40,000 shi of grain from the capital granaries were again issued to relieve disaster victims in Shuntian.',
    'On dingmao day 40,000 shi of capital grain again relieved Shuntian victims.',
  ],
  s1483: [
    'On day yisi, an imperial rescript stated that in arranging the celebrations everything was to be economized; civil and military officials were exempted from the customary tribute offerings.',
    'On yisi day the court ordered the birthday celebrations kept frugal and waived customary official tribute.',
  ],
  s1484: [
    'A special allotment from the privy purse was issued to relieve disaster areas in Zhili; this was approved annually thereafter and given permanently to Shuntian prefecture and the Zhili governor-general to succor the destitute.',
    'A special privy-purse grant for Zhili disaster relief was made annual and permanent for Shuntian and the Zhili governor.',
  ],
  s1485: [
    'Each province was granted 20,000 taels of silver; from next year, jiawu, all were to be issued from the privy purse for the frontier governors to distribute.',
    'Each province received 20,000 taels yearly from the privy purse starting in jiawu for governors to distribute.',
  ],
  s1486: [
    'An edict stated that the late Beile Nar-su, grandson of Sengge Rinchen, was remembered for past service; he was posthumously enfeoffed as prince, but this must not be cited as precedent.',
    'The late Beile Nar-su, Sengge Rinchen\'s grandson, was posthumously made prince without precedent.',
  ],
  s1487: [
    'On day bingzi, Yang Ru, Circuit Intendant of Huaining-Chizhou-Taiping-Guangde, was given fourth-rank Capital Official rank and appointed minister to the United States, Japan, and Peru.',
    'On bingzi day Yang Ru became fourth-rank Capital Official and minister to the United States, Japan, and Peru.',
  ],
  s1488: [
    'That year, Korea sent tribute.',
    'That year Korea paid tribute.',
  ],
  s1489: [
    'The nineteenth year, guisi, spring, first month, new moon day yiyou: an edict stated that because the Empress Dowager\'s sixtieth birthday would fall next year, an extraordinary provincial examination would be held this year and the jiawu extraordinary metropolitan examination would be held the following year.',
    'Year 19, spring 1, yiyou new moon: an extraordinary examination was set this year and the jiawu metropolitan exam next year for the Empress Dowager\'s sixtieth birthday.',
  ],
  s1490: [
    'On day bingxu, winter grain transport in Changzhou and other prefectures and counties was remitted in shi.',
    'On bingxu day winter grain transport at Changzhou and elsewhere was remitted.',
  ],
  s1491: [
    'On day jihai, arrears of tax in Changsha and other prefectures and counties were remitted.',
    'On jihai day tax arrears at Changsha and elsewhere were remitted.',
  ],
  s1492: [
    'On day jiachen, an edict stated that Mongol princes and others of the Inner Zasak who would come to the capital next year to offer birthday congratulations, except those on the regular Beijing rotation, were all to stay away.',
    'On jiachen day Inner Zasak Mongols coming for next year\'s birthday were told to stay home except regular rotators.',
  ],
  s1493: [
    'On day guichou, because of disasters in the seven districts beyond the passes and in Datong and other prefectures, Zhili and Shanxi were ordered not to collect transport merchants\' grain taxes and 100,000 taels from the ministry treasury were allotted for relief.',
    'On guichou day Zhili and Shanxi forgave transport taxes and 100,000 taels went to the pass districts and Datong.',
  ],
  s1494: [
    'Second month, day wuwu: 50,000 shi of Jiangsu grain transport were retained as relief reserves for Anzhou and other places.',
    'On month 2, wuwu, 50,000 shi of Jiangsu grain were held for Anzhou relief.',
  ],
  s1495: [
    'On day wuchen, German minister von Brandt was received at Chengguang Hall.',
    'On wuchen day German minister von Brandt was received at Chengguang Hall.',
  ],
  s1496: [
    'On day guiyou, 50,000 taels of capital funds were retained to relieve disaster victims in the northern hills of Shaanxi and other places.',
    'On guiyou day 50,000 taels of capital funds relieved Shaanxi\'s northern hills.',
  ],
  s1497: [
    'Third month, day xinmao: an order was issued to sell more than 60,000 shi of grain transport from the two Hu basins to fund relief for the Shanxi disaster.',
    'On month 3, xinmao, over 60,000 shi of two-Hu grain were sold to fund Shanxi relief.',
  ],
  s1498: [
    'Summer, fourth month, day bingzi: fine weather was prayed for.',
    'In summer, month 4, bingzi, the court prayed for clear weather.',
  ],
  s1499: [
    'On day jimao, because the Alashan Zasak and Prince Doruo Se-leng had suffered successive years of drought on the pastures, 30,000 taels were issued for relief.',
    'On jimao day 30,000 taels relieved the Alashan prince\'s drought-stricken pastures.',
  ],
  s1500: [
    'Fifth month, day yiyou: the Beixin Granary caught fire.',
    'On month 5, yiyou, the Beixin Granary burned.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b15.mjs <translation.json>'
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
