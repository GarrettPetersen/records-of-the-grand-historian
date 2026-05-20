#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1501: [
    'The siege of Gongchang was lifted.',
    'Gongchang was relieved.',
  ],
  s1502: [
    'On day bingxu, government troops were defeated at Jimusa; Heng Yi died.',
    'On bingxu day the army lost at Jimusa and Heng Yi was killed.',
  ],
  s1503: [
    'On day dinghai, Liu Changyou was ordered to garrison the border passes and supervise suppression of the horse bandits.',
    'On dinghai day Liu Changyou was told to hold the passes and suppress the horse bandits.',
  ],
  s1504: [
    'On day jichou, Sichuan troops suppressed the Songpan tribal bandits and pacified them.',
    'On jichou day Sichuan forces pacified the Songpan tribes.',
  ],
  s1505: [
    'Guizhou bandits attacked Xuyong and Qijiang.',
    'Guizhou raiders struck Xuyong and Qijiang.',
  ],
  s1506: [
    'On day gengyin, Zuo Zongtang was ordered to proceed in person to Jiaying to oversee the army.',
    'On gengyin day Zuo Zongtang was sent to Jiaying to take command.',
  ],
  s1507: [
    'Twelfth month, new moon on day renchen: Zeng Guofan moved his army to Zhoujiakou.',
    'In month 12, renchen new moon, Zeng Guofan shifted to Zhoujiakou.',
  ],
  s1508: [
    'Mingxu was permitted to send Rongquan to Russia to borrow troops and grain.',
    'Mingxu was allowed to send Rongquan to Russia for troops and grain.',
  ],
  s1509: [
    'On day jiawu, Guizhou bandits captured Qingzhen county seat, which was soon recovered.',
    'On jiawu day Guizhou bandits took Qingzhen but lost it again quickly.',
  ],
  s1510: [
    'Zhou Dawu was appointed military commander of Guizhou.',
    'Zhou Dawu became Guizhou provincial commander.',
  ],
  s1511: [
    'On day yiwei, Lianjie was punished for greed and harassment; he was removed from joint supervision of military affairs and assigned as a bodyguard under Cheng Lu\'s army.',
    'On yiwei day Lianjie lost his joint military post for extortion and joined Cheng Lu as a guardsman.',
  ],
  s1512: [
    'On day jihai, Li Xian\'s army was routed at Suzhou.',
    'On jihai day Li Xian\'s force broke at Suzhou.',
  ],
  s1513: [
    'On day xinchou, the horse bandits fled back and raided Changtu.',
    'On xinchou day the horse bandits doubled back into Changtu.',
  ],
  s1514: [
    'The Board of Revenue request was approved: salt-tax and related funds were allocated to increase inner-court expenses by three hundred thousand.',
    'The revenue board won approval to add three hundred thousand taels to palace spending from salt levies.',
  ],
  s1515: [
    'On day renyin, Rehe troops recovered Chaoyang.',
    'On renyin day Rehe forces retook Chaoyang.',
  ],
  s1516: [
    'On day guimao, Boyan Namuhuto was ordered to return to his banner, join the league chiefs, and summon Mongol troops to help suppress the horse bandits.',
    'On guimao day Boyan Namuhuto was told to rally banner chiefs and Mongol auxiliaries against the horse bandits.',
  ],
  s1517: [
    'Wen Lin was made commissioner at Hami.',
    'Wen Lin became the Hami commissioner.',
  ],
  s1518: [
    'On day yisi, the Danba rebel chiefs Gongbu Langjie and others were executed; the Three Dan districts were all placed under the Dalai Lama\'s administration.',
    'On yisi day Danba rebels including Gongbu Langjie were executed and the Three Dan areas went to the Dalai Lama.',
  ],
  s1519: [
    'On day bingwu, Jinzhou bandits feigned surrender and fled to Tieling; Wen Xiang and others were ordered to handle Fengtian defensive arrangements.',
    'On bingwu day Jinzhou bandits sham-surrendered into Tieling and Wen Xiang was told to organize Fengtian defense.',
  ],
  s1520: [
    'On day renzi, because snow and moisture were untimely, an edict ordered review of ordinary prisons and burial of exposed corpses.',
    'On renzi day untimely snow brought orders to clear common jails and bury exposed dead.',
  ],
  s1521: [
    'On day yimao, Enhe was stripped of office for delaying and harming military affairs.',
    'On yimao day Enhe lost his post for military delay.',
  ],
  s1522: [
    'Military Commander Cheng Daji\'s army was routed at Macheng.',
    'Commander Cheng Daji\'s troops broke at Macheng.',
  ],
  s1523: [
    'On day bingchen, Guangdong troops jointly recovered Ninghai prefecture city in Vietnam.',
    'On bingchen day Guangdong forces retook Ninghai in Vietnam.',
  ],
  s1524: [
    'Du Xing\'a was transferred to be general of Shengjing.',
    'Du Xing\'a became Shengjing general.',
  ],
  s1525: [
    'Mutushan was ordered to supervise Gansu military affairs and take over all troops formerly under Du Xing\'a.',
    'Mutushan was put in charge of Gansu and inherited Du Xing\'a\'s armies.',
  ],
  s1526: [
    'On day gengshen, the Emperor attended at the Hall of Preserving Harmony and granted the New Year\'s banquet to outer feudatories.',
    'On gengshen day the throne feasted outer feudatories in the Hall of Preserving Harmony.',
  ],
  s1527: [
    'Henceforth this was done every year.',
    'The practice continued annually thereafter.',
  ],
  s1528: [
    'Yunnan troops recovered Lijiang and Heqing.',
    'Yunnan forces retook Lijiang and Heqing.',
  ],
  s1529: [
    'That winter, overdue taxes were remitted for disturbed prefectures and counties including Songpan in Sichuan and Chaling in Hunan.',
    'That winter tax arrears were forgiven for Songpan, Chaling, and other disturbed districts.',
  ],
  s1530: [
    'Fifth year, spring, first month, new moon on day xinyou: banquets were suspended.',
    'In spring of year 5, xinyou new moon, court banquets were halted.',
  ],
  s1531: [
    'On day jiazi, Nian bandits harassed Hubei; Zeng Guofan ordered Liu Mingchuan to aid Huangzhou.',
    'On jiazi day Nian raiders hit Hubei and Zeng Guofan sent Liu Mingchuan to Huangzhou.',
  ],
  s1532: [
    'Ma Hualong sought pacification and surrendered Ningxia\'s Han city.',
    'Ma Hualong sued for peace and handed over Ningxia\'s Chinese quarter.',
  ],
  s1533: [
    'On day yichou, Guangxi troops recovered Natan.',
    'On yichou day Guangxi forces retook Natan.',
  ],
  s1534: [
    'Fujian\'s quota tribute graduates were exempted.',
    'Fujian\'s routine tribute examinations were waived.',
  ],
  s1535: [
    'On day jisi, Mutushan was ordered to handle pacification and aftermath for the Muslims.',
    'On jisi day Mutushan was told to settle Muslim surrender and aftermath.',
  ],
  s1536: [
    'On day gengwu, Yunnan Governor Lin Hongnian went to Zhaotong.',
    'On gengwu day Governor Lin Hongnian moved to Zhaotong.',
  ],
  s1537: [
    'On day yihai, horse bandits entered and occupied Boduna, soon reaching Shuangcheng Fort; Jilin was in grave danger.',
    'On yihai day horse bandits seized Boduna and threatened Shuangcheng; Jilin was critical.',
  ],
  s1538: [
    'Wen Xiang and Bao Shan ordered Heilongjiang troops and cavalry columns to assist.',
    'Wen Xiang and Bao Shan called Heilongjiang infantry and horse to the rescue.',
  ],
  s1539: [
    'On day jimao, Huangyan Garrison Commander Gang Antai was patrolling the sea, encountered boat bandits, and died.',
    'On jimao day Gang Antai died fighting boat bandits while cruising off Huangyan.',
  ],
  s1540: [
    'On day guiwei, Lin Hongnian was stripped of office for timidity that caused delay; Liu Yuezhao replaced him.',
    'On guiwei day Lin Hongnian was dismissed for cowardice and Liu Yuezhao took Yunnan.',
  ],
  s1541: [
    'Zuo Zongtang directed the armies to recover Jiaying; the Guangdong bandits were pacified.',
    'Zuo Zongtang retook Jiaying and ended the Guangdong rebellion.',
  ],
  s1542: [
    'Zuo Zongtang and his subordinates were rewarded according to merit.',
    'Zuo Zongtang\'s officers were ennobled and promoted by merit.',
  ],
  s1543: [
    'On day bingxu, horse bandits raided into and captured Alechuka and Lalin; Fu Ming\'a went to Jilin to suppress them.',
    'On bingxu day horse bandits took Alechuka and Lalin and Fu Ming\'a marched into Jilin.',
  ],
  s1544: [
    'Tepuqin was ordered back to Heilongjiang to arrange defenses.',
    'Tepuqin was sent back to Heilongjiang to organize defense.',
  ],
  s1545: [
    'Wu Changshou was demoted and transferred; Li Henian became Henan governor and Zeng Guoquan Hubei governor.',
    'Wu Changshou was lowered in rank; Li Henian went to Henan and Zeng Guoquan to Hubei.',
  ],
  s1546: [
    'On day wuzi, Fengtian troops recovered Bamiancheng.',
    'On wuzi day Fengtian forces retook Bamiancheng.',
  ],
  s1547: [
    'On day jichou, an edict ordered strict arrest of Gelaohui bandits in the camps.',
    'On jichou day the court ordered a crackdown on Gelaohui in the armies.',
  ],
  s1548: [
    'Second month, new moon on day xinmao: an edict told Zuo Zongtang and others to slow withdrawal of Jiangsu and Fujian armies to prepare transfer north to help suppress Nian and Muslim bandits.',
    'In month 2, xinmao new moon, Zuo Zongtang was told to keep Jiangsu and Fujian troops ready for the northern Nian and Muslim campaigns.',
  ],
  s1549: [
    'Guizhou Muslims captured Yongning, which was soon recovered.',
    'Guizhou Muslims took Yongning but lost it again.',
  ],
  s1550: [
    'On day renchen, Zhao Chen was ordered to Zhenyuan to handle military affairs.',
    'On renchen day Zhao Chen was sent to Zhenyuan for military duty.',
  ],
  s1551: [
    'On day xinchou, government troops recovered Huangpi.',
    'On xinchou day the army retook Huangpi.',
  ],
  s1552: [
    'On day dingwei, Du Xing\'a was stripped of office but kept in post because his troops had wantonly killed.',
    'On dingwei day Du Xing\'a was punished yet retained after his men massacred civilians.',
  ],
  s1553: [
    'On day wushen, Guangdong infantry commander Gao Liansheng was ordered to his post to suppress local bandits.',
    'On wushen day Gao Liansheng was told to take up Guangdong command and crush local bandits.',
  ],
  s1554: [
    'Boyan Namuhuto defeated the horse bandits at Zhengjiatun with a great victory.',
    'Boyan Namuhuto won a major victory over horse bandits at Zhengjiatun.',
  ],
  s1555: [
    'Ma Xinyi was instructed to plan coastal embankment works.',
    'Ma Xinyi was ordered to organize sea-dike repairs.',
  ],
  s1556: [
    'On day xinhai, Ding\'an\'s force defeated horse bandits at Changchun; an edict restored his vice-commander rank.',
    'On xinhai day Ding\'an beat horse bandits at Changchun and regained vice-commander status.',
  ],
  s1557: [
    'On day renzi, De Ying was relieved for mourning; Fu Ming\'a became general of Jilin.',
    'On renzi day De Ying left for mourning and Fu Ming\'a became Jilin general.',
  ],
  s1558: [
    'On day bingchen, Guo Songtao was summoned to the capital; Jiang Yili acted as Guangdong governor.',
    'On bingchen day Guo Songtao was called to Beijing and Jiang Yili acted for Guangdong.',
  ],
  s1559: [
    'On day jiwei, Hunan troops repelled Guizhou Miao.',
    'On jiwei day Hunan forces drove back Guizhou Miao raiders.',
  ],
  s1560: [
    'Third month, day renxu: Zeng Guofan moved his army to Jining to supervise suppression of Zhang Zongyu.',
    'In month 3, renxu day, Zeng Guofan shifted to Jining against Zhang Zongyu.',
  ],
  s1561: [
    'On day yichou, Alechuka, Boduna, and Shuangcheng Fort were recovered.',
    'On yichou day Alechuka, Boduna, and Shuangcheng were retaken.',
  ],
  s1562: [
    'On day jisi, Fengtian troops routed north- and south-route horse bandits.',
    'On jisi day Fengtian forces crushed horse bandits on both routes.',
  ],
  s1563: [
    'Silver and grain taxes were remitted for disturbed areas in Fengtian and Jilin.',
    'Taxes in silver and grain were forgiven in ravaged Fengtian and Jilin districts.',
  ],
  s1564: [
    'On day gengwu, Mingyi requested sick leave; Lin Xing was ordered to command Mongol troops to aid Ili.',
    'On gengwu day Mingyi begged leave and Lin Xing led Mongols to relieve Ili.',
  ],
  s1565: [
    'On day yihai, Lai Wenguang and others raided toward Kaifeng.',
    'On yihai day Lai Wenguang pressed on Kaifeng.',
  ],
  s1566: [
    'On day wuyin, Heilongjiang tribute sable from levy households on campaign was exempted.',
    'On wuyin day campaign households in Heilongjiang were freed from sable tribute.',
  ],
  s1567: [
    'Court and officials inside and outside were instructed to study the legal statutes.',
    'An edict told all officials to master the code and regulations.',
  ],
  s1568: [
    'On day jimao, horse bandits raided Rehe.',
    'On jimao day horse bandits struck Rehe.',
  ],
  s1569: [
    'On day gengchen, Ma Hualong and others\' surrender was accepted.',
    'On gengchen day Ma Hualong\'s submission was approved.',
  ],
  s1570: [
    'On day jiashen, Zhang Zongyu raided Pu and Fan; Lai Wenguang from Henan into Yuncheng and Juye; Zeng Guofan and others were ordered to guard the Grand Canal and Qiao Songnian\'s army to intercept.',
    'On jiashen day Zhang Zongyu hit Pu and Fan while Lai Wenguang crossed Henan into Yuncheng and Juye; Zeng Guofan was told to hold the canal and Qiao Songnian to cut them off.',
  ],
  s1571: [
    'On day yiyou, horse bandits captured Niuzhuang.',
    'On yiyou day horse bandits took Niuzhuang.',
  ],
  s1572: [
    'On day bingxu, Cao Yubing died.',
    'On bingxu day Cao Yubing died.',
  ],
  s1573: [
    'On day dinghai, Fujian troops recovered Chong\'an and Jianyang.',
    'On dinghai day Fujian forces retook Chong\'an and Jianyang.',
  ],
  s1574: [
    'On day wuzi, Li Hongzao was made Grand Councilor; Hu Jiayu was to study in the Council.',
    'On wuzi day Li Hongzao joined the Grand Council and Hu Jiayu apprenticed there.',
  ],
  s1575: [
    'That spring, Henan\'s accumulated tax arrears were remitted, and quotas were forgiven for flood- and disturbance-stricken districts including Anzhou in Zhili and Xinmin in Fengtian.',
    'That spring Henan\'s backlog of taxes was cleared and flood-hit Anzhou, Xinmin, and others were relieved.',
  ],
  s1576: [
    'Summer, fourth month, new moon on day jichou: the Fengtian north-route bandit chief Ma Shazi was executed and the rest surrendered.',
    'In summer, month 4, jichou new moon, Fengtian bandit Ma Shazi was killed and his followers submitted.',
  ],
  s1577: [
    'Government troops recovered Niuzhuang.',
    'The army retook Niuzhuang.',
  ],
  s1578: [
    'Guangdong and Nian bandits attacked the Zhili river banks and were repelled.',
    'Guangdong and Nian raiders on the Zhili rivers were beaten back.',
  ],
  s1579: [
    'On day xinmao, Zeng Guoquan\'s request to cut troops and pay was approved, and Liu Lianjie, Peng Yugao, Zhu Nangui, and Guo Songlin were transferred to Hubei.',
    'On xinmao day Zeng Guoquan won troop cuts and Liu Lianjie, Peng Yugao, Zhu Nangui, and Guo Songlin went to Hubei.',
  ],
  s1580: [
    'On day bingshen, Muslims of Taozhou surrendered to Cao Kezhong\'s army.',
    'On bingshen day Taozhou Muslims submitted to Cao Kezhong.',
  ],
  s1581: [
    'On day wuxu, Ma Rulong was appointed acting military commander of Yunnan.',
    'On wuxu day Ma Rulong acted as Yunnan commander.',
  ],
  s1582: [
    'On day gengzi, Wen Xiang and Fu Xing were recalled to the capital; Du Xing\'a was ordered to take over Fengtian military affairs and command all armies.',
    'On gengzi day Wen Xiang and Fu Xing returned to Beijing and Du Xing\'a took Fengtian command.',
  ],
  s1583: [
    'On day xinchou, Naerji recovered Mulei, Qitai, and Gucheng and recruited militia to defend them.',
    'On xinchou day Naerji retook Mulei, Qitai, and Gucheng and raised local guards.',
  ],
  s1584: [
    'On day guimao, government troops recovered Suiyang.',
    'On guimao day the army retook Suiyang.',
  ],
  s1585: [
    'On day jiachen, Muslim bandits captured Jingyuan.',
    'On jiachen day Muslim rebels took Jingyuan.',
  ],
  s1586: [
    'On day wushen, an edict ordered Fengtian and Jilin to join in suppressing bandits inside and outside the mountains.',
    'On wushen day Fengtian and Jilin were told to hunt bandits in the hills together.',
  ],
  s1587: [
    'On day jiyou, Tan Yulong\'s army was routed; Cao Kezhong was ordered to take combined command of his force.',
    'On jiyou day Tan Yulong broke and Cao Kezhong absorbed his troops.',
  ],
  s1588: [
    'On day renzi, Muslim bandits fled back into Qingyang.',
    'On renzi day Muslim rebels doubled back into Qingyang.',
  ],
  s1589: [
    'Kashgar mustered its full strength and pressed Kokand; Jing Wen was ordered to the border passes to investigate.',
    'Kashgar massed troops against Kokand and Jing Wen was sent to the frontier to inquire.',
  ],
  s1590: [
    'On day jiayin, Wuyuan bandits were pacified.',
    'On jiayin day Wuyuan bandits were subdued.',
  ],
  s1591: [
    'On day bingchen, Guangdong and Nian bandits harassed Tong, Pei, Sizhou, and Lingbi.',
    'On bingchen day Guangdong and Nian raiders hit Tong, Pei, Sizhou, and Lingbi.',
  ],
  s1592: [
    'Lao Chongguang advanced and garrisoned Kunming.',
    'Lao Chongguang moved his headquarters into Kunming.',
  ],
  s1593: [
    'Du Wenxiu again captured Lijiang, Heqing, and Jianchuan.',
    'Du Wenxiu retook Lijiang, Heqing, and Jianchuan.',
  ],
  s1594: [
    'On day wuwu, Muslim bandits attacked Lanzhou; government troops repelled them.',
    'On wuwu day Muslim rebels besieged Lanzhou and were driven off.',
  ],
  s1595: [
    'Fifth month, day renxu: Guizhou bandits again captured Xingyi, Zhenfeng, and Yongning.',
    'In month 5, renxu day, Guizhou bandits retook Xingyi, Zhenfeng, and Yongning.',
  ],
  s1596: [
    'The Russian envoy insistently requested inland trade in Heilongjiang.',
    'Russia pressed for interior trade rights in Heilongjiang.',
  ],
  s1597: [
    'Tepuqin was instructed to rectify the camps.',
    'Tepuqin was ordered to reform his garrisons.',
  ],
  s1598: [
    'On day yichou, the great examination of Hanlin and Academicians was held; Sun Yuwen and four others were graded top class, and the rest were promoted or demoted variously.',
    'On yichou day Hanlin and Academicians were examined; Sun Yuwen and four others took first rank while others rose or fell.',
  ],
  s1599: [
    'On day wuchen, Ma Chaoqing surrendered; Lingzhou was recovered.',
    'On wuchen day Ma Chaoqing submitted and Lingzhou was restored.',
  ],
  s1600: [
    'On day xinwei, Muslim bandits Huo San and others fled back into Fengxiang and Qishan; government troops repelled them, and Yang Yuebin and Liu Rong were ordered to strike jointly and not let them enter Shaanxi again.',
    'On xinwei day Huo San\'s Muslims raided Fengxiang and Qishan, were beaten back, and Yang Yuebin and Liu Rong were told to keep them out of Shaanxi.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b16.mjs <translation.json>'
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
