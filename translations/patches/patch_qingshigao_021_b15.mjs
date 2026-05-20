#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1401: [
    'On day yimao, the Sichuan relief army for Guizhou recovered Zheng\'an.',
    'On yimao day the Sichuan force aiding Guizhou retook Zheng\'an.',
  ],
  s1402: [
    'On day dingsi, Qitai and Hami fell; Hami Commissioner Zakdanga died.',
    'On dingsi day Qitai and Hami fell and Hami Commissioner Zakdanga was killed.',
  ],
  s1403: [
    'Wen Lin withdrew to Barkol.',
    'Wen Lin fell back to Barkol.',
  ],
  s1404: [
    'An edict ordered Yang Yuebin, Cheng Lu, and Lianjie\'s army to advance and attack the rebels at Suzhou.',
    'The court ordered Yang Yuebin, Cheng Lu, and Lianjie to advance against the Suzhou rebels.',
  ],
  s1405: [
    'The Muslim banner noble Lubuqin submitted.',
    'Banner noble Lubuqin of the Muslims submitted.',
  ],
  s1406: [
    'On day dingsi, Censor Mujixiang\'a asked that palace attendants and servants be carefully selected.',
    'On dingsi day Censor Mujixiang\'a urged careful selection of palace attendants and servants.',
  ],
  s1407: [
    'An edict ordered the Imperial Household Department to investigate those who were crafty and obsequious; where facts were established, severe punishment was to be applied.',
    'The court told the Imperial Household Department to expose obsequious schemers and punish them severely when proven.',
  ],
  s1408: [
    'That summer, assessed taxes of disturbed districts in Shaanxi, Zhejiang, Fujian, and elsewhere were remitted, as were grain levies disturbed by troops in Hami.',
    'That summer taxes were remitted in disturbed Shaanxi, Zhejiang, and Fujian districts and for Hami grain levies disrupted by troops.',
  ],
  s1409: [
    'Seventh month, autumn, first day guihai: Liu Rong was ordered to guard Dingbian, Fu, Yan, Bin, and Long strictly; Yang Yuebin was to guard against the Muslim chief He Mingtang.',
    'On the seventh month\'s guihai new moon Liu Rong was told to hold the northwest passes and Yang Yuebin to watch Muslim chief He Mingtang.',
  ],
  s1410: [
    'On day jiazi, Muslim rebels took Bayandai; Ili Brigade Commander Mukedenge and others died.',
    'On jiazi day rebels took Bayandai and Ili Brigade Commander Mukedenge and others were killed.',
  ],
  s1411: [
    'The offices of the begs Dulusu and others who aided the rebels were stripped.',
    'Begs such as Dulusu who aided the rebels were dismissed from office.',
  ],
  s1412: [
    'Government troops recovered Kuerkala Wusu.',
    'Imperial forces retook Kuerkala Wusu.',
  ],
  s1413: [
    'Burhede was ordered to act as Brigade Commander and relieve Tacheng.',
    'Burhede was made acting brigade commander to relieve Tacheng.',
  ],
  s1414: [
    'Lei Zhengwan\'s forces failed in attacking Jinjibao and withdrew to Weizhou.',
    'Lei Zhengwan\'s attack on Jinjibao failed and his troops fell back to Weizhou.',
  ],
  s1415: [
    'On day dingmao, Wulong\'e suppressed the Muslim rebels at Libaisi and pacified them.',
    'On dingmao day Wulong\'e crushed the Libaisi Muslim rebels and restored order.',
  ],
  s1416: [
    'Guizhou rebels took Shiqian; Prefect Yan Jin fell in battle; government troops soon recovered the city.',
    'Guizhou rebels seized Shiqian and Prefect Yan Jin died fighting, but government troops soon retook the city.',
  ],
  s1417: [
    'On day guiyou, Dong Xun and Chonghou were made Plenipotentiary Ministers to handle commercial treaty affairs.',
    'On guiyou day Dong Xun and Chonghou became plenipotentiary ministers for commercial treaties.',
  ],
  s1418: [
    'On day jimao, Horqin Prince Boyannamohu was granted the hereditary title of Botoletuote Prince.',
    'On jimao day Horqin Prince Boyannamohu received the hereditary Botoletuote princely title.',
  ],
  s1419: [
    'On day renwu, Censor Cai Shouqi was dismissed for reckless speech.',
    'On renwu day Censor Cai Shouqi lost his post for reckless statements.',
  ],
  s1420: [
    'Guizhou rebels took Dading and soon it was recovered.',
    'Guizhou rebels captured Dading but the city was soon retaken.',
  ],
  s1421: [
    'On day jichou, Fengtian horse bandits harassed Zunhua and Jizhou; Yu Ming was dismissed and subjected to severe censure.',
    'On jichou day Fengtian horse bandits raided Zunhua and Jizhou; Yu Ming was dismissed and severely censured.',
  ],
  s1422: [
    'Enhe was made acting Shengjing General.',
    'Enhe became acting general of Shengjing.',
  ],
  s1423: [
    'The treaty with the Netherlands was renewed.',
    'The Dutch treaty was renewed.',
  ],
  s1424: [
    'On day gengyin, an edict forbade French clergy from interfering in military affairs.',
    'On gengyin day the court forbade French missionaries to meddle in military affairs.',
  ],
  s1425: [
    'On day renchen, Chen Guorui was removed from assistant command of military affairs.',
    'On renchen day Chen Guorui was relieved of assistant military command.',
  ],
  s1426: [
    'Eighth month, gengzi day: for errors in peace negotiations, Enlin was stripped of office and Cheng Rui was banished to Heilongjiang.',
    'In the eighth month on gengzi day Enlin was dismissed for botched peace talks and Cheng Rui was exiled to Heilongjiang.',
  ],
  s1427: [
    'Qi Junzao retired from office.',
    'Qi Junzao retired.',
  ],
  s1428: [
    'Guangdong and Nian rebels fled into Anhui and Henan.',
    'Guangdong and Nian rebels crossed into Anhui and Henan.',
  ],
  s1429: [
    'On day renyin, a Machinery Bureau was established at Shanghai.',
    'On renyin day a machinery bureau was set up in Shanghai.',
  ],
  s1430: [
    'On day guimao, Muslim rebels attacked Barkol; Naerji routed them.',
    'On guimao day Muslim rebels struck Barkol and Naerji drove them off.',
  ],
  s1431: [
    'Wen Lin\'s army suffered defeat at Kuisu.',
    'Wen Lin was beaten at Kuisu.',
  ],
  s1432: [
    'On day jiachen, Litang frontier affairs were concluded.',
    'On jiachen day the Litang frontier business was closed.',
  ],
  s1433: [
    'Sichuan Governor-General Luo Bingzhang was granted leave; Chongshi was ordered to act in his place.',
    'Luo Bingzhang was given leave as Sichuan governor-general and Chongshi was ordered to act for him.',
  ],
  s1434: [
    'Lin Xing was sternly ordered to survey in person the boundary marking at Tannu Uriankhai.',
    'Lin Xing was sharply ordered to survey the Tannu Uriankhai boundary in person.',
  ],
  s1435: [
    'On day yisi, Zuo Zongtang was ordered to remain in Guangdong and supervise all armies of Jiangxi, Guangdong, and Fujian.',
    'On yisi day Zuo Zongtang was told to stay in Guangdong and command Jiangxi, Guangdong, and Fujian forces.',
  ],
  s1436: [
    'On day bingwu, Zeng Guofan was ordered to advance and garrison Xuzhou and join in suppressing the Henan Nian.',
    'On bingwu day Zeng Guofan was ordered to Xuzhou to join the campaign against the Henan Nian.',
  ],
  s1437: [
    'On day xinhai, an order was issued that Ili capture and execute officers and soldiers who followed the rebellion.',
    'On xinhai day Ili was ordered to capture and execute rebel followers among the troops.',
  ],
  s1438: [
    'Those who had exerted themselves in suppressing rebels, including Oirat Administrator Mengkubayar, were rewarded according to merit.',
    'Oirat administrator Mengkubayar and others active against rebels received graded rewards.',
  ],
  s1439: [
    'On day guiyou, Yu Ming\'s office was stripped.',
    'On guiyou day Yu Ming was dismissed from office.',
  ],
  s1440: [
    'Guo Songshen asked to be relieved of duty; because his language was often contentious, he was sternly reprimanded.',
    'Guo Songshen asked to resign but was sharply rebuked for his contentious tone.',
  ],
  s1441: [
    'Excess levies on Jiangxi land and grain transport taxes were reduced.',
    'Jiangxi land-tax and grain-transport surcharges were cut.',
  ],
  s1442: [
    'Burdensome miscellaneous local surcharges at prefectures and counties were cut.',
    'Heavy county and prefectural levy surcharges were abolished.',
  ],
  s1443: [
    'Guangdong rebel chief Wang Haiyang killed Li Shixian.',
    'Guangdong rebel leader Wang Haiyang killed Li Shixian.',
  ],
  s1444: [
    'On day yimao, Guangdong rebels took Changle in Guangdong.',
    'On yimao day Guangdong rebels seized Changle.',
  ],
  s1445: [
    'Britain and France returned the forts at Tianjin\'s harbor mouth.',
    'Britain and France handed back the Tianjin estuary forts.',
  ],
  s1446: [
    'On day bingchen, Duxing\'a\'s resignation from supervising military affairs was not accepted.',
    'On bingchen day Duxing\'a was not allowed to resign his military supervision.',
  ],
  s1447: [
    'On day dingsi, Li Hongzhang and others were ordered to deliberate properly on combined river and sea transport for the new northern grain route.',
    'On dingsi day Li Hongzhang and others were told to plan joint river-and-sea transport for the new northern grain route.',
  ],
  s1448: [
    'On day gengshen, districts under Suzhou, Songjiang, Hangzhou, Jiaxing, and Huzhou suffered flooding; relief was granted.',
    'On gengshen day flooded districts around Suzhou, Songjiang, Hangzhou, Jiaxing, and Huzhou received relief.',
  ],
  s1449: [
    'A temple was built for the men and women of Longxi militia who died for the cause, and the place was granted the name Loyalty and Righteousness Township.',
    'A shrine was raised for Longxi militia dead of both sexes and the district was named Loyalty and Righteousness Township.',
  ],
  s1450: [
    'On day xinyou, Chongshi and others were ordered to investigate the Youyang church case.',
    'On xinyou day Chongshi and others were ordered to handle the Youyang church incident.',
  ],
  s1451: [
    'Ninth month, jiazi day: the Emperor personally escorted the Ding Mausoleum interment; Prince Su Huafeng and others were ordered to remain in the capital to conduct affairs.',
    'On the ninth month\'s jiazi day the Emperor escorted Wenzong\'s burial at Ding Mausoleum and left Prince Su Huafeng in Beijing to govern.',
  ],
  s1452: [
    'Changle rebels surrendered the city to Guangdong troops.',
    'Changle rebels handed the city to Guangdong forces.',
  ],
  s1453: [
    'On day bingyin, land taxes along the Ding Mausoleum interment route were remitted.',
    'On bingyin day land tax was remitted along the Ding Mausoleum route.',
  ],
  s1454: [
    'On day wuchen, because Nian chief Zhang Zongyu and the Lai and Ren rebels were raiding Henan and Shandong, Li Hongzhang was ordered to join in suppression; Wu Tang acted as Liangjiang Governor-General; Li Zongxi acted as Grain Transport Governor-General.',
    'On wuchen day, with Zhang Zongyu and the Lai and Ren bands raiding Henan and Shandong, Li Hongzhang was sent to suppress them, Wu Tang acted at Liangjiang, and Li Zongxi at grain transport.',
  ],
  s1455: [
    'Zeng Guofan was again ordered to garrison at Xuzhou.',
    'Zeng Guofan was again told to hold Xuzhou.',
  ],
  s1456: [
    'On day jisi, merchants were allowed to contract for Yunnan copper mines.',
    'On jisi day private contractors were allowed to run Yunnan copper mines.',
  ],
  s1457: [
    'On day gengwu, gunboats from Jiangnan were transferred to Shanxi river defense to instruct in naval warfare.',
    'On gengwu day Jiangnan gunboats were sent to Shanxi river defense to teach naval warfare.',
  ],
  s1458: [
    'On day renshen, the Muslims of Haoshuichuan submitted.',
    'On renshen day the Haoshuichuan Muslims surrendered.',
  ],
  s1459: [
    'Government troops relieved the siege of Nanyang.',
    'Imperial forces lifted the siege of Nanyang.',
  ],
  s1460: [
    'Tao Maolin\'s army broke up again.',
    'Tao Maolin\'s force collapsed again.',
  ],
  s1461: [
    'On day jiaxu, government troops recovered Zhenping.',
    'On jiaxu day government troops retook Zhenping.',
  ],
  s1462: [
    'On day bingzi, Lei Zhengwan\'s subordinates Hu Dagui and Lei Heng rebelled and besieged Jingzhou; Regional Commander Zhou Xiancheng drove them back.',
    'On bingzi day Hu Dagui and Lei Heng, officers under Lei Zhengwan, rebelled and besieged Jingzhou until Zhou Xiancheng repulsed them.',
  ],
  s1463: [
    'Ma Hualong and Hu Dagui and others fled separately into Shaanxi.',
    'Ma Hualong, Hu Dagui, and others scattered into Shaanxi.',
  ],
  s1464: [
    'Zhang Zhiwan was appointed Governor-General of the Eastern Yellow River Conservancy.',
    'Zhang Zhiwan became governor-general of the Eastern Yellow River conservancy.',
  ],
  s1465: [
    'On day jimao, the Emperor, attending the two empress dowagers, began the journey from the capital.',
    'On jimao day the Emperor set out with the two empress dowagers.',
  ],
  s1466: [
    'Guangdong rebels attacked Longnan; Liu Kunyi went to Ganzhou to supervise suppression.',
    'Guangdong rebels struck Longnan and Liu Kunyi went to Ganzhou to command the campaign.',
  ],
  s1467: [
    'On day jiashen, Wenzong was buried at the Ding Mausoleum.',
    'On jiashen day Wenzong was interred at Ding Mausoleum.',
  ],
  s1468: [
    'On day yiyou, the imperial procession returned.',
    'On yiyou day the court returned to the capital.',
  ],
  s1469: [
    'Qitai Magistrate Hengyi, with militia, recovered Qitai, Jimusa, and Gucheng.',
    'Qitai magistrate Hengyi used militia to retake Qitai, Jimusa, and Gucheng.',
  ],
  s1470: [
    'On day dinghai, the Emperor returned to the palace.',
    'On dinghai day the Emperor returned to the palace.',
  ],
  s1471: [
    'On day wuzi, Emperor and Empress Wenzong were enshrined in the Imperial Ancestral Temple; the next day an edict granted differentiated favors broadly.',
    'On wuzi day Wenzong and his empress were enshrined in the ancestral temple, and the next day a broad favor edict was issued.',
  ],
  s1472: [
    'On day gengyin, Gansu Regional Commander Tao Maolin was stripped of office and Cao Kezhong replaced him; Brigadier General Tao Shenglin and others were arrested for punishment.',
    'On gengyin day Tao Maolin was removed as Gansu commander and replaced by Cao Kezhong, while Tao Shenglin and other generals were arrested.',
  ],
  s1473: [
    'Zuo Zongtang\'s resignation from supervising the three provinces was not accepted.',
    'Zuo Zongtang was not allowed to resign command of the three provinces.',
  ],
  s1474: [
    'That autumn, overdue taxes in disturbed places such as Xiaoyi in Shaanxi and Lanxi in Zhejiang were remitted.',
    'That autumn overdue taxes were forgiven in disturbed districts such as Xiaoyi in Shaanxi and Lanxi in Zhejiang.',
  ],
  s1475: [
    'Tenth month, winter, first day renchen: Tibetan troops took Dartsedo.',
    'On the tenth month\'s renchen new moon Tibetan forces took Dartsedo.',
  ],
  s1476: [
    'Muslim rebels attacked Qingyang; government troops drove them back.',
    'Muslim rebels struck Qingyang and were repulsed.',
  ],
  s1477: [
    'On day guisi, the treaty with Belgium was concluded.',
    'On guisi day the Belgian treaty was settled.',
  ],
  s1478: [
    'On day jiawu, Xu Jiyu was ordered to serve in the Zongli Yamen with third-rank capital official rank.',
    'On jiawu day Xu Jiyu was posted to the Zongli Yamen as a third-rank capital official.',
  ],
  s1479: [
    'Nepal\'s regular tribute was ordered to be presented together after six years.',
    'Nepal was told to combine its regular tribute presentations every six years.',
  ],
  s1480: [
    'On day gengzi, excess collections on Zhejiang transport rice and southern rice were reduced.',
    'On gengzi day excess levies on Zhejiang transport and southern rice were cut.',
  ],
  s1481: [
    'On day renyin, Guangdong rebels took Heping.',
    'On renyin day Guangdong rebels seized Heping.',
  ],
  s1482: [
    'On day yisi, Wang Rongji said Shanxi salt was blocked and asked for suspension, reduction, or renewed increase of tax tickets by category; it was approved.',
    'On yisi day Wang Rongji reported blocked Shanxi salt and sought graded suspension or renewal of tax tickets, which was approved.',
  ],
  s1483: [
    'On day dingwei, Muslim rebels besieged Gongchang and Ningyuan.',
    'On dingwei day Muslim rebels besieged Gongchang and Ningyuan.',
  ],
  s1484: [
    'On day jiyou, Zhejiang troops took the rebel stockade at Nantian.',
    'On jiyou day Zhejiang forces captured the Nantian rebel fort.',
  ],
  s1485: [
    'On day xinhai, Liu Rong was ordered to act as Shaanxi Governor.',
    'On xinhai day Liu Rong was made acting governor of Shaanxi.',
  ],
  s1486: [
    'On day renzi, because the joint enshrinement rites were complete, a collective ancestral temple sacrifice was held.',
    'On renzi day, with the joint enshrinement finished, a collective ancestral sacrifice was performed.',
  ],
  s1487: [
    'Prince Chun declined the Eight Banner training duties.',
    'Prince Chun asked to be excused from Eight Banner drill.',
  ],
  s1488: [
    'An edict still ordered inspection, review, and diligent training.',
    'The court still ordered inspection, review, and hard training.',
  ],
  s1489: [
    'On day jiayin, horse bandits pressed Fengtian; government troops were defeated.',
    'On jiayin day horse bandits threatened Fengtian and government troops were beaten.',
  ],
  s1490: [
    'On day gengshen, Fuxing was ordered to lead Jilin and Heilongjiang cavalry and Shenjiying troops to suppress them.',
    'On gengshen day Fuxing was sent with Jilin, Heilongjiang, and Shenjiying forces to suppress them.',
  ],
  s1491: [
    'On day xinyou, Mianxing was released.',
    'On xinyou day Mianxing was freed.',
  ],
  s1492: [
    'Eleventh month, guihai day: Lai and Ren bandits fled to Wuyang and Yancheng and joined Zhang Zongyu\'s band; Hubei and Henan were ordered to attack from both sides.',
    'On the eleventh month\'s guihai day the Lai and Ren bands fled to Wuyang and Yancheng and merged with Zhang Zongyu, and Hubei and Henan were told to strike from both sides.',
  ],
  s1493: [
    'On day bingyin, rice and bean levies for Suzhou, Songjiang, Changzhou, Zhenjiang, and Taicang were reduced by over 540,000 shi.',
    'On bingyin day rice and bean levies for Suzhou, Songjiang, Changzhou, Zhenjiang, and Taicang were cut by more than 540,000 shi.',
  ],
  s1494: [
    'On day renyin, Fengtian troops were defeated while suppressing horse bandits.',
    'On renyin day Fengtian forces lost a fight against horse bandits.',
  ],
  s1495: [
    'Li Tangjie died.',
    'Li Tangjie died.',
  ],
  s1496: [
    'Li Hongzao was ordered to study and serve under the Grand Councilors.',
    'Li Hongzao was ordered to apprentice under the Grand Council.',
  ],
  s1497: [
    'Hubei Governor Zheng Dunjin entered the capital as Vice Minister of Revenue; Li Hedian replaced him.',
    'Hubei governor Zheng Dunjin became vice minister of revenue and Li Hedian succeeded him in Hubei.',
  ],
  s1498: [
    'On day yihai, for the crime of acting without regard to the commanding general, Cheng Bao was sentenced to death and Guo Baochang was banished to Xinjiang.',
    'On yihai day Cheng Bao was sentenced to death for defying his commander and Guo Baochang was exiled to Xinjiang.',
  ],
  s1499: [
    'On day bingzi, Fengtian rebel chief Xu Dian rebelled again at Guangning.',
    'On bingzi day Fengtian rebel leader Xu Dian rose again at Guangning.',
  ],
  s1500: [
    'On day gengchen, Guangdong rebels took Jiaying.',
    'On gengchen day Guangdong rebels seized Jiaying.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b15.mjs <translation.json>'
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
