#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1401: [
    'On day gengchen, Fengtian courier stations were abolished and a Document Dispatch Bureau was established.',
    'On gengchen day Fengtian courier posts were cut and a Document Dispatch Bureau was set up.',
  ],
  s1402: [
    'On day renwu, an edict ordered Chinese and foreign officials to study constitutional monarchy.',
    'On renwu day the court ordered officials at home and abroad to study constitutional monarchy.',
  ],
  s1403: [
    'Autonomy regulations were laid down.',
    'The court laid down regulations for local self-government.',
  ],
  s1404: [
    'On day jiachen, the German envoy Rex and the Japanese envoy Abe Moritaro were received at Renshou Hall.',
    'On jiachen day the German envoy Rex and Japanese envoy Abe Moritaro were received at Renshou Hall.',
  ],
  s1405: [
    'The Divine Engine Corps guards and all officers and soldiers were ordered placed under Army Ministry jurisdiction.',
    'The court placed the Divine Engine Corps guards and troops under the Army Ministry.',
  ],
  s1406: [
    'Ninth month, day xinmao: an edict ordered deliberation on Manchu and Han ritual and penal codes and verification of unified weights and measures regulations.',
    'On month 9, xinmao, the court ordered debate on Manchu and Han ritual and law and unified weights and measures.',
  ],
  s1407: [
    'That day, because the opium habit had not been ended, an imperial reprimand dismissed Prince Zhuang Zaigong, Prince Rui Kuibin, Censor-in-chief Lu Baozhong, and Vice Censor-in-chief Chen Mingkan from office and ordered them to break the habit at once.',
    'That day, for lingering opium use, Zaigong, Kuibin, Lu Baozhong, and Chen Mingkan were dismissed and ordered to quit at once.',
  ],
  s1408: [
    'All civil and military officials within and without were likewise ordered to quit completely within three months, on pain of severe punishment.',
    'All officials were told to quit within three months or face severe punishment.',
  ],
  s1409: [
    'On day guisi, Shen Jiaben, Yu Liansan, and Ying Rui were appointed revision law ministers.',
    'On guisi day Shen Jiaben, Yu Liansan, and Ying Rui became revision law ministers.',
  ],
  s1410: [
    'On day jihai, each province was ordered to establish provincial assemblies and publicly elect members, and to plan establishment of prefectural and county councils.',
    'On jihai day provinces were told to set up assemblies, elect members, and plan prefectural and county councils.',
  ],
  s1411: [
    'On day renyin, Japan reported flood disaster and requested grain; 600,000 shi of rice from Jiangsu, Anhui, Zhejiang, and Hubei was sent as relief.',
    'On renyin day Japan asked for grain after floods; 600,000 shi from Jiangsu, Anhui, Zhejiang, and Hubei were sent.',
  ],
  s1412: [
    'On day jiachen, each province was ordered to establish investigation bureaus, and each ministry and court to set up statistical offices.',
    'On jiachen day provinces got investigation bureaus and ministries statistical offices.',
  ],
  s1413: [
    'Returned students including Zhang Zongyuan were granted jinshi and juren status in varying ranks.',
    'Returned students including Zhang Zongyuan received jinshi and juren ranks in varying degrees.',
  ],
  s1414: [
    'On day wushen, Hubei Judicial Commissioner Liang Dingfen memorialized that to save the situation nothing was more urgent than banning bribery and cutting off solicitation; he impeached Yikuang, Yuan Shikai, and others for clinging to power and private greed harming the state.',
    'On wushen day Liang Dingfen urged banning bribery and impeached Yikuang and Yuan Shikai for clinging to power and harming the state.',
  ],
  s1415: [
    'The court edict held he was deliberately seeking reputation and rebuked him.',
    'The court called it grandstanding and rebuked him.',
  ],
  s1416: [
    'That month, grain taxes were remitted in Yunnan drought-stricken districts.',
    'That month Yunnan drought districts were forgiven grain taxes.',
  ],
  s1417: [
    'Huaining and other counties received flood relief.',
    'Huaining and other counties received flood relief.',
  ],
  s1418: [
    'Winter, tenth month, day yichou: Sun Jianai, Rongqing, Lu Runxiang, Zhang Yinglin, Tang Jingchong, Baoxi, and Zhu Yifan were assigned to lecture on the classics and histories and Qing institutional precedents.',
    'On month 10, yichou, Sun Jianai, Rongqing, Lu Runxiang, Zhang Yinglin, Tang Jingchong, Baoxi, and Zhu Yifan were assigned to lecture on classics and Qing precedents.',
  ],
  s1419: [
    'The Yongding River works were joined.',
    'The Yongding River breach was closed.',
  ],
  s1420: [
    'On day wuchen, the Empress Dowager\'s birthday; banquets were suspended.',
    'On wuchen day, the Empress Dowager\'s birthday; banquets were stopped.',
  ],
  s1421: [
    'On day renshen, the Japanese envoy Hayashi Gonsuke and others were received at Qinzheng Hall.',
    'On renshen day the Japanese envoy Hayashi Gonsuke and others were received at Qinzheng Hall.',
  ],
  s1422: [
    'On day bingxu, the Jebtsundampa Khutuktu presented tribute goods.',
    'On bingxu day the Jebtsundampa Khutuktu presented tribute.',
  ],
  s1423: [
    'Eleventh month, day gengyin: Guangxi bandits seized the Nan Pass batteries; Zhang Mingqi was charged to supervise suppression and soon recovered them.',
    'On month 11, gengyin, Guangxi bandits took Nan Pass batteries; Zhang Mingqi suppressed them and soon recovered the post.',
  ],
  s1424: [
    'On day wushen, assemblies and public speeches were strictly forbidden.',
    'On wushen day mass meetings and public speeches were strictly banned.',
  ],
  s1425: [
    'Provinces were instructed to rectify schools and revise examination and admonition regulations.',
    'Provinces were told to rectify schools and revise examination rules.',
  ],
  s1426: [
    'On day renzi, the Russian envoy Pokotilov and others were received at the Qianqing Palace.',
    'On renzi day the Russian envoy Pokotilov and others were received at the Qianqing Palace.',
  ],
  s1427: [
    'Because officials debated currency using tael versus yuan with mutual pros and cons, governors-general and governors were instructed to investigate and report.',
    'As officials debated tael versus yuan coinage, governors-general and governors were told to investigate and report.',
  ],
  s1428: [
    '500,000 taels were issued for the Guangxi army.',
    '500,000 taels were issued for the Guangxi army.',
  ],
  s1429: [
    'Twelfth month, new moon on day wuwu: Guangdong Land and Naval commanders-in-chief posts were restored separately.',
    'On month 12\'s wuwu new moon, Guangdong land and naval commanders-in-chief were restored separately.',
  ],
  s1430: [
    'On day guihai, the Jilin deputy lieutenant-general was abolished; Foreign Affairs, Civil Affairs, and Revenue commissioners and a judicial commissioner and Industrial Promotion intendant were established.',
    'On guihai day Jilin\'s deputy lieutenant-general was cut; foreign affairs, civil affairs, revenue, judicial, and industrial promotion posts were added.',
  ],
  s1431: [
    'Jinshi Institute returned students including Yang Zhaolin received advancement in varying ranks.',
    'Jinshi Institute returned students including Yang Zhaolin were advanced in varying ranks.',
  ],
  s1432: [
    'On day renshen, the Shandong grain intendant was abolished and Police and Industrial Promotion intendants established.',
    'On renshen day the Shandong grain intendant was cut and police and industrial promotion intendants set up.',
  ],
  s1433: [
    'On day jiaxu, farming colonization was ordered for the Rehe hunting preserves; garrison troops were cut.',
    'On jiaxu day Rehe hunting grounds were ordered colonized and garrison troops cut.',
  ],
  s1434: [
    'On day yihai, Lv Haihuan was appointed Commissioner for the Tianjin-Pukou Railway.',
    'On yihai day Lv Haihuan became commissioner for the Tianjin-Pukou Railway.',
  ],
  s1435: [
    'On day bingzi, Natong was also made Commissioner for Customs Affairs.',
    'On bingzi day Natong was also made customs commissioner.',
  ],
  s1436: [
    'On day xinsi, Inspector General of Customs Hart was granted Ministerial rank.',
    'On xinsi day Inspector General Hart received brevet Minister rank.',
  ],
  s1437: [
    'On day bingxu, Buteha marten tribute was again suspended for one year.',
    'On bingxu day Buteha marten tribute was again suspended for one year.',
  ],
  s1438: [
    'That winter, taxes were remitted for Yunnan drought, Zhili flood, and Shaanxi arrears.',
    'That winter Yunnan drought, Zhili flood, and Shaanxi arrears were forgiven.',
  ],
  s1439: [
    'Yunnan hail disasters, Sichuan floods, and Guangdong wind and flood disasters received relief.',
    'Yunnan hail, Sichuan floods, and Guangdong wind and water disasters received relief.',
  ],
  s1440: [
    'Thirty-fourth year, wushen, spring, first month, new moon on day dinghai: Prince Chun Zaifeng was made Grand Council minister.',
    'Year 34, spring 1, dinghai new moon: Prince Chun Zaifeng joined the Grand Council.',
  ],
  s1441: [
    'On day gengyin, the various envoys were received at the Qianqing Palace.',
    'On gengyin day the various envoys were received at the Qianqing Palace.',
  ],
  s1442: [
    'On day jihai, because silver prices in the capital surged and goods soared, 500,000 taels were issued; the Shuntian prefect was ordered to buy up coin at reduced prices; provinces were ordered to cast ten-cash copper coins and additionally coin thirty percent more new cash per quota to remedy the situation.',
    'On jihai day, as capital silver soared and prices jumped, 500,000 taels were issued, Shuntian was told to buy coin cheaply, and provinces were told to cast ten-cash copper and extra new cash.',
  ],
  s1443: [
    'On day jiayin, the Lanzhou Yellow River iron bridge was built.',
    'On jiayin day the Lanzhou Yellow River iron bridge was built.',
  ],
  s1444: [
    'On day bingwu, the Austrian envoy Gratzmayr was received at Qinzheng Hall.',
    'On bingwu day the Austrian envoy Gratzmayr was received at Qinzheng Hall.',
  ],
  s1445: [
    'That month, arrears were remitted in Yunnan Kunming and other counties, Zhejiang Renhe salt fields, and Hunan Shaoyang quotas.',
    'That month Kunming and other Yunnan counties, Zhejiang Renhe salt works, and Hunan Shaoyang quotas were forgiven arrears.',
  ],
  s1446: [
    'Second month, day wuwu: sacrifice to the Altars of Soil and Grain; thereafter the emperor could not attend in person and always sent substitutes.',
    'On month 2, wuwu, the Soil and Grain altars were sacrificed to; thereafter the emperor always sent substitutes.',
  ],
  s1447: [
    'On day gengshen, Zhao Erfeng was granted Ministerial rank as Resident Minister in Tibet while retaining border affairs commissioner.',
    'On gengshen day Zhao Erfeng received Minister rank as Tibet resident minister while keeping border affairs.',
  ],
  s1448: [
    'On day guihai, an edict increased stipend-in-lieu for Manchu ministers and banner officers by the full ten percent and revised allowances for imperial bodyguard ranks and below.',
    'On guihai day Manchu ministers and banner officers got a full ten-percent stipend increase and bodyguard allowances were revised.',
  ],
  s1449: [
    'On day bingyin, prisons were ordered cleared in the capital and provinces.',
    'On bingyin day the capital and provinces were ordered to clear prisons.',
  ],
  s1450: [
    'On day jiaxu, the capital Labor Exhibition Hall burned.',
    'On jiaxu day the capital Labor Exhibition Hall burned.',
  ],
  s1451: [
    'An edict stated: "The opium prohibition agreement has been concluded; the British have agreed to reduce imports year by year, and reduction is now being carried out in stages.',
    'The court said: "The opium ban treaty is done; Britain agreed to cut imports yearly and staged cuts are under way.',
  ],
  s1452: [
    'A trial period of three years was agreed, after which further reduction would be pushed.',
    'A three-year trial was agreed, then further cuts would follow.',
  ],
  s1453: [
    'The term is about to expire—how shall we answer friendly powers?',
    'The term is nearly up—how shall we answer friendly powers.',
  ],
  s1454: [
    'The Civil Affairs and Revenue ministries are to draw up audit regulations at once, and governors-general and governors are to instruct subordinates to report fully on reducing cultivation and consumption."',
    'Civil Affairs and Revenue must draft audits at once, and governors must report fully on cutting cultivation and use."',
  ],
  s1455: [
    'On day dingchou, Dashou was recalled; Li Jiaju was made constitutional inspection commissioner and Hu Weide envoy to Japan.',
    'On dingchou day Dashou was recalled; Li Jiaju inspected constitutional affairs and Hu Weide went to Japan.',
  ],
  s1456: [
    'On day renwu, Huang Gao was dismissed; Qian Xun was transferred as envoy to Italy and Lu Zhengxiang as envoy to the Netherlands.',
    'On renwu day Huang Gao was dismissed; Qian Xun went to Italy and Lu Zhengxiang to the Netherlands.',
  ],
  s1457: [
    'Third month, day renchen: Prince Gong Pulun, Lu Chuanlin, Jing Xing, and Ding Zhenduo were made opium prohibition commissioners and an opium prohibition office was established for inspection.',
    'On month 3, renchen, Pulun, Lu Chuanlin, Jing Xing, and Ding Zhenduo became opium commissioners and an inspection office was set up.',
  ],
  s1458: [
    'On day bingwu, Nepal presented tribute goods.',
    'On bingwu day Nepal presented tribute.',
  ],
  s1459: [
    'On day jiayin, for profound classical learning Xiangtan juren Wang Kaiyun was granted Compiler rank.',
    'On jiayin day Wang Kaiyun of Xiangtan was made Compiler for classical learning.',
  ],
  s1460: [
    'That month, old and new quota taxes were remitted for disaster areas in Yunnan.',
    'That month Yunnan disaster districts were forgiven old and new quota taxes.',
  ],
  s1461: [
    'Summer, fourth month, day bingchen: the Japanese envoy Hayashi Gonsuke and others were received at Qinzheng Hall.',
    'On month 4, bingchen, the Japanese envoy Hayashi Gonsuke and others were received at Qinzheng Hall.',
  ],
  s1462: [
    'Suiyuan General Yigu was found guilty, dismissed, and imprisoned in the Board of Punishments; soon his property was confiscated.',
    'Suiyuan General Yigu was guilty, dismissed, jailed in the Board of Punishments, and soon his property was seized.',
  ],
  s1463: [
    'Xin Qin was made colonization commissioner and acting Suiyuan General.',
    'Xin Qin became colonization commissioner and acting Suiyuan general.',
  ],
  s1464: [
    'On day dingsi, the Anlu-Chuhe-Heyang Circuit in Anhui was abolished.',
    'On dingsi day Anhui\'s Anlu-Chuhe-Heyang Circuit was cut.',
  ],
  s1465: [
    'On day jiwei, Yunnan border: Vietnamese bandits took Hekou; Liu Chunlin was made third-rank capital official to assist border defense and all front-line armies were placed under his command.',
    'On jiwei day Vietnamese bandits took Hekou; Liu Chunlin assisted Yunnan border defense and commanded all front armies.',
  ],
  s1466: [
    'On day wuchen, the Guizhou grain intendant and Guixi Circuit were abolished.',
    'On wuchen day the Guizhou grain intendant and Guixi Circuit were cut.',
  ],
  s1467: [
    'On day jisi, envoys including Hertz and others were received at Renshou Hall and a banquet was given.',
    'On jisi day envoys including Hertz and others were received at Renshou Hall and feasted.',
  ],
  s1468: [
    'On day gengchen, Yunnan government troops defeated bandits at Tianfang, recovered four passes, then took Greater and Lesser Nanxi and Hekou; treasury funds rewarded the army.',
    'On gengchen day Yunnan troops beat bandits at Tianfang, retook four passes, then Nanxi and Hekou; treasury funds rewarded the army.',
  ],
  s1469: [
    'Fifth month, new moon on day yiyou: Yunnan bandits were pacified.',
    'On month 5\'s yiyou new moon, Yunnan bandits were pacified.',
  ],
  s1470: [
    'On day dinghai, Batang and Litang native chiefs were abolished and regular officials installed.',
    'On dinghai day Batang and Litang native chiefs were cut and regular officials installed.',
  ],
  s1471: [
    'On day renchen, the emperor\'s illness recurred; the provinces were ordered to recommend those skilled in medicine.',
    'On renchen day the emperor\'s illness returned; provinces were told to recommend skilled physicians.',
  ],
  s1472: [
    'On day guisi, descendants of mid-dynasty meritorious servants Duolong\'a, Xiang Rong, Jiang Zhongyuan, Luo Zexian, Luo Bingzhang, Zhang Guoliang, Li Xubin, Peng Yulin, Yang Yuebin, Bao Chao, Li Mengqun, Cheng Xueti, Liu Songshan, Feng Zicai, and others were enrolled for promotion in varying ranks.',
    'On guisi day descendants of meritorious servants including Duolong\'a, Xiang Rong, and Feng Zicai were enrolled for promotion in varying ranks.',
  ],
  s1473: [
    'On day jiawu, repair of the Confucius Temple at Qufu.',
    'On jiawu day the Confucius Temple at Qufu was repaired.',
  ],
  s1474: [
    'On day guimao, the Xiang River burst its banks and a hurricane brought disaster.',
    'On guimao day the Xiang River burst and a hurricane brought disaster.',
  ],
  s1475: [
    'On day gengxu, court gentleman Cao Yuanbi presented his Collated Ritual Classics and was granted Compiler.',
    'On gengxu day Cao Yuanbi presented his Collated Ritual Classics and became Compiler.',
  ],
  s1476: [
    'On day guichou, Guangdong heavy rains; the East, North, and West rivers all overflowed and breached dikes.',
    'On guichou day Guangdong flooded; the East, North, and West rivers overflowed and breached dikes.',
  ],
  s1477: [
    'Sixth month, day dingsi: former Libationer Wang Xianqian presented his Corrected Commentary on the Documents, Supplements to the Han History, Collected Exegesis of the Xunzi, and Study of Japanese Origins and was granted Hanlin Academy scholar rank.',
    'On month 6, dingsi, Wang Xianqian presented his classical works and received Hanlin scholar rank.',
  ],
  s1478: [
    'On day jiazi, Guangxi mine well and export taxes were remitted for five years.',
    'On jiazi day Guangxi mine and export taxes were forgiven for five years.',
  ],
  s1479: [
    'On day gengwu, Jinshi Institute returned students including Li Zhanzhi received advancement in varying ranks.',
    'On gengwu day Jinshi Institute returned students including Li Zhanzhi were advanced in varying ranks.',
  ],
  s1480: [
    'On day jiaxu, Zhang Zhidong was also made Commissioner for the Canton-Hankou Railway.',
    'On jiaxu day Zhang Zhidong was also made Canton-Hankou Railway commissioner.',
  ],
  s1481: [
    'On day yihai, the Dalai Lama\'s audience was approved.',
    'On yihai day the Dalai Lama\'s audience was approved.',
  ],
  s1482: [
    'On day bingzi, because America reduced indemnity payments, Tang Shaoyi was made special envoy to give thanks and also tour Western countries to study finance.',
    'On bingzi day, as America cut indemnity payments, Tang Shaoyi thanked America and toured the West to study finance.',
  ],
  s1483: [
    'Lijin surcharges were discussed for abolition.',
    'Lijin surcharges were discussed for abolition.',
  ],
  s1484: [
    'On day yimao, Yang Shixiang was made Governor-General of Zhili and Beiyang Commissioner.',
    'On yimao day Yang Shixiang became Zhili governor-general and Beiyang commissioner.',
  ],
  s1485: [
    'On day xinsi, Ministry of Law official Chen Jingren and others asked to open a parliament in three years.',
    'On xinsi day Chen Jingren and others asked to open parliament in three years.',
  ],
  s1486: [
    'An edict held Jingren was stirring trouble and stripped him of office for supervision.',
    'The court said Jingren was stirring trouble and stripped him for supervision.',
  ],
  s1487: [
    'That summer, quota taxes were remitted for Yunnan flood, drought, and hail and Gansu flood wasteland.',
    'That summer Yunnan flood, drought, and hail and Gansu flood wasteland were forgiven quota taxes.',
  ],
  s1488: [
    'Jiangsu wind and hail disasters and Hubei floods received relief.',
    'Jiangsu wind and hail and Hubei floods received relief.',
  ],
  s1489: [
    '50,000 taels from the ministry treasury for Chahar banner and two-wing herd disasters; another 100,000 taels for Guangzhou, Zhaoqing, Yangjiang, and other Guangdong flood districts.',
    '50,000 ministry taels for Chahar and herd disasters; another 100,000 for Guangzhou, Zhaoqing, Yangjiang, and other Guangdong floods.',
  ],
  s1490: [
    'Autumn, seventh month, day renchen: three Heilongjiang deputy lieutenant-generals including Aihui were abolished; the Aihui Circuit and Hulunbuir Circuit were added.',
    'On month 7, renchen, three Heilongjiang deputy lieutenant-generals including Aihui were cut; the Aihui and Hulunbuir circuits were added.',
  ],
  s1491: [
    'On day bingchen, Su Yuanchun was released and restored.',
    'On bingchen day Su Yuanchun was released and restored.',
  ],
  s1492: [
    'On day jihai, public and private railway taxes were remitted for three years.',
    'On jihai day public and private railway taxes were forgiven for three years.',
  ],
  s1493: [
    'On day gengzi, because provinces set up Political Association chapters to collect money and form factions disturbing order, the localities were ordered to prohibit them strictly.',
    'On gengzi day, as provinces set up Political Association chapters that collected money and disturbed order, localities were told to ban them.',
  ],
  s1494: [
    'On day xinchou, Zhejiang seawalls were repaired.',
    'On xinchou day Zhejiang seawalls were repaired.',
  ],
  s1495: [
    'On day guimao, Guangxi garrison troops mutinied and killed their commander; Zhang Renjun supervised suppression.',
    'On guimao day Guangxi garrison troops mutinied and killed their commander; Zhang Renjun suppressed them.',
  ],
  s1496: [
    'On day bingwu, third-rank Qing official Hu Guokui was put in charge of Qiong-Ya land reclamation and mining.',
    'On bingwu day Hu Guokui took charge of Qiong-Ya reclamation and mining.',
  ],
  s1497: [
    'On day gengxu, a Yunnan Foreign Affairs commissioner was established.',
    'On gengxu day a Yunnan foreign affairs commissioner was established.',
  ],
  s1498: [
    'That month, locusts in Shandong and Anhui.',
    'That month locusts struck Shandong and Anhui.',
  ],
  s1499: [
    'Eighth month, new moon on day jiayin: the Constitutional Compilation Bureau and Consultative Assembly submitted outlines for constitution, parliament, and elections with annual preparatory plans.',
    'On month 8\'s jiayin new moon, the Constitutional Compilation Bureau and Consultative Assembly submitted constitution, parliament, and election outlines with annual plans.',
  ],
  s1500: [
    'An edict ordered promulgation to capital and provincial offices to carry out within deadlines; every six months achievements were to be reported in full.',
    'The court ordered promulgation to capital and provincial offices on deadlines; every six months achievements were to be reported.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b15.mjs <translation.json>'
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
