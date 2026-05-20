#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1601: [
    'On day jiaxu, Hui rebels took Tarbagatai; Wulong\'e was killed.',
    'On jiaxu day, Hui rebels seized Tarbagatai and Wulong\'e was killed.',
  ],
  s1602: [
    'Dexing\'a was made commissioner-attendant; Kuichang acted as Kobdo commissioner.',
    'Dexing\'a became commissioner-attendant and Kuichang acted at Kobdo.',
  ],
  s1603: [
    'A stern edict ordered Cheng Lu to pass the frontier post with all speed.',
    'Cheng Lu was sternly ordered to hurry out of the passes.',
  ],
  s1604: [
    'On day yihai, Hui rebels took Ili; Ming Xu and others were killed.',
    'On yihai day, Hui rebels took Ili and Ming Xu and others died.',
  ],
  s1605: [
    'Rong Quan was made acting general of Ili.',
    'Rong Quan acted as general of Ili.',
  ],
  s1606: [
    'Kukejitai was ordered to supervise military affairs in Xinjiang.',
    'Kukejitai was put in charge of Xinjiang military affairs.',
  ],
  s1607: [
    'On day dingchou, an edict ordered the clearing of ordinary prisons.',
    'On dingchou day, ordinary prisoners were ordered released from jail.',
  ],
  s1608: [
    'On day renwu, because rain had long failed, an edict sought frank counsel and forbade maltreatment of criminal prisoners.',
    'On renwu day, drought brought a call for frank counsel and a ban on abusing prisoners.',
  ],
  s1609: [
    'On day jiashen, an edict urged recommendation of officials who devoted themselves to the people\'s affairs.',
    'On jiashen day, officials diligent in civil affairs were urged for promotion.',
  ],
  s1610: [
    'On day dinghai, government troops recovered Libo.',
    'On dinghai day, government forces retook Libo.',
  ],
  s1611: [
    'That month, overdue taxes were remitted for Jiaying and other districts in Guangdong disturbed by rebels.',
    'That month, Guangdong\'s Jiaying and other disturbed districts were freed of back taxes.',
  ],
  s1612: [
    'Sixth month, day gengyin: rain fell.',
    'In the sixth month, on gengyin day, it rained.',
  ],
  s1613: [
    'Zuo Zongtang\'s request was granted to build a yard in Fujian to trial-build steamships.',
    'Zuo Zongtang won approval to trial-build steamships at a Fujian yard.',
  ],
  s1614: [
    'On day renchen, an edict urged inner and outer ministers to attend diligently to duty.',
    'On renchen day, ministers at court and in the provinces were urged to diligence.',
  ],
  s1615: [
    'On day xinchou, Cheng Lu\'s army advanced to besiege Suzhou.',
    'On xinchou day, Cheng Lu\'s force moved to besiege Suzhou.',
  ],
  s1616: [
    'On day renyin, an edict ordered Fuming\'a to search out and capture remaining bandits in the hill country.',
    'On renyin day, Fuming\'a was ordered to hunt down hill-country bandits.',
  ],
  s1617: [
    'On day jiachen, bandits in Lingshan were pacified.',
    'On jiachen day, Lingshan bandits were pacified.',
  ],
  s1618: [
    'On day wushen, General Ming Yi of Uliastai was relieved for illness.',
    'On wushen day, Uliastai General Ming Yi was relieved on account of illness.',
  ],
  s1619: [
    'On day jiyou, Deleke Duo\'erji was made general of Uliastai and Fuxing was made general of Suiyuan.',
    'On jiyou day, Deleke Duo\'erji became Uliastai general and Fuxing became Suiyuan general.',
  ],
  s1620: [
    'On day gengxu, Hui rebels of Yan and Gu submitted in good faith.',
    'On gengxu day, the Yan and Gu Hui rebels surrendered.',
  ],
  s1621: [
    'On day xinhai, bandits at Lingyun and Yangwan were pacified.',
    'On xinhai day, Lingyun and Yangwan bandits were pacified.',
  ],
  s1622: [
    'On day yimao, an edict ordered Yang Yuebin to suppress Di and He Hui rebels.',
    'On yimao day, Yang Yuebin was ordered to suppress Di and He Hui rebels.',
  ],
  s1623: [
    'Autumn, seventh month, day gengshen: Guang Feng and Tu\'erku were stripped of office and arrested for interrogation.',
    'In autumn, month 7, on gengshen day, Guang Feng and Tu\'erku were dismissed and arrested.',
  ],
  s1624: [
    'Vice Minister Kui Ling and others were sent as envoys to Korea to invest the queen consort.',
    'Kui Ling and other vice ministers were sent to Korea to invest the queen.',
  ],
  s1625: [
    'On day renxu, government troops recovered Hami.',
    'On renxu day, government forces retook Hami.',
  ],
  s1626: [
    'On day jiazi, an edict ordered the rectification of Guangdong civil government, military affairs, and likin taxation.',
    'On jiazi day, Guangdong administration, armies, and likin were ordered rectified.',
  ],
  s1627: [
    'On day yichou, Li Hongzao entered mourning for his mother; an edict from the Empress Dowager ordered him, after a hundred days, still to attend at Hongde Hall and the Grand Council.',
    'On yichou day, Li Hongzao mourned his mother but was told after a hundred days to resume at Hongde Hall and the Grand Council.',
  ],
  s1628: [
    'On day gengwu, Hunan troops took the bandit nest at Sinan.',
    'On gengwu day, Hunan forces stormed the Sinan bandit nest.',
  ],
  s1629: [
    'On day renshen, Li Hongzao asked to observe the full mourning term; it was not permitted.',
    'On renshen day, Li Hongzao\'s plea for full mourning was denied.',
  ],
  s1630: [
    'On day guiyou, excess grain collections were reduced in Suzhou, Songjiang, Changzhou, and Taicang by more than 370,000 piculs, and excess cash collections by more than 1,670,000 strings.',
    'On guiyou day, excess grain and cash levies were cut in the lower Yangtze prefectures.',
  ],
  s1631: [
    'On day bingzi, Chong Hou exchanged treaties with the Spanish envoy.',
    'On bingzi day, Chong Hou exchanged treaties with Spain.',
  ],
  s1632: [
    'On day jimao, Guizhou bandits took Shiqian and soon lost it again.',
    'On jimao day, Guizhou rebels seized Shiqian but were soon driven out.',
  ],
  s1633: [
    'On day gengchen, half the tribute due from the seven banners of the Urianghai was remitted.',
    'On gengchen day, half the Urianghai tribute was remitted.',
  ],
  s1634: [
    'On day yiyou, the Yellow River broke through at Hujiatun in Henan.',
    'On yiyou day, the Yellow River breached at Henan\'s Hujiatun.',
  ],
  s1635: [
    'Eighth month, day wuzi: Liu Rong was relieved for illness; Qiao Songnian was transferred to be Shaanxi governor and Ying Han was made Anhui governor.',
    'In month 8, on wuzi day, Liu Rong was relieved; Qiao Songnian went to Shaanxi and Ying Han to Anhui.',
  ],
  s1636: [
    'On day jichou, the Yellow River broke through at Puzhou.',
    'On jichou day, the Yellow River breached at Puzhou.',
  ],
  s1637: [
    'On day gengyin, bandits in Xun and Yu were pacified.',
    'On gengyin day, Xun and Yu bandits were pacified.',
  ],
  s1638: [
    'The Shanhaiguan superintendent was abolished and the Fengjin Shanhaiguan circuit intendant was established in its place.',
    'The Shanhaiguan superintendent was replaced by a Fengjin Shanhaiguan circuit intendant.',
  ],
  s1639: [
    'On day xinchou, Li Yunlin was granted first-rank bodyguard and ordered to assist in Xinjiang military affairs.',
    'On xinchou day, Li Yunlin became a first-rank bodyguard aiding Xinjiang command.',
  ],
  s1640: [
    'On day guimao, Yang Yuebin was relieved for illness; Zuo Zongtang was transferred to be governor-general of Shaanxi-Gansu, Wu Tang to Fujian-Zhejiang, and Zhang Zhiwan to grain transport.',
    'On guimao day, Yang Yuebin was relieved; Zuo Zongtang went to Shaanxi-Gansu, Wu Tang to Fujian-Zhejiang, and Zhang Zhiwan to grain transport.',
  ],
  s1641: [
    'Rui Lin was fully appointed governor-general of Liangguang.',
    'Rui Lin received full appointment as Liangguang governor-general.',
  ],
  s1642: [
    'On day jiachen, government troops took the bandit nest at Dagu Hill; Xu Zongli was executed.',
    'On jiachen day, government forces stormed Dagu Hill and Xu Zongli was executed.',
  ],
  s1643: [
    'On day yisi, government troops routed and defeated the Zhang and Niu Nian bands.',
    'On yisi day, government troops defeated the Zhang and Niu Nian bands.',
  ],
  s1644: [
    'Because a lunar eclipse served as a warning, court ministers were ordered to cultivate self-reform.',
    'A lunar eclipse prompted an order for court ministers to reform themselves.',
  ],
  s1645: [
    'On day dingwei, at Censor Qing Fu\'s request, grain was stored up at Zhangjiakou and Suiyuan and transported to Xinjiang to relieve the people\'s food shortage.',
    'On dingwei day, grain stores at Zhangjiakou and Suiyuan were ordered for transport to famine-stricken Xinjiang.',
  ],
  s1646: [
    'Ninth month, new moon on day dingsi: Tan Tingxiang was ordered to join Chong Hou in handling commercial treaty affairs with Italy.',
    'In month 9, dingsi new moon, Tan Tingxiang was told to join Chong Hou on Italian treaty business.',
  ],
  s1647: [
    'On day guihai, bandits in Xinghua, Fujian, were pacified.',
    'On guihai day, Fujian Xinghua bandits were pacified.',
  ],
  s1648: [
    'On day jiazi, an edict ordered Li Yunlin with Lin Xing and others to put the northern-route defense forces in order.',
    'On jiazi day, Li Yunlin and Lin Xing were ordered to reorganize the northern-route army.',
  ],
  s1649: [
    'Bao Bao was ordered to go to Guihua to supervise transport of funds for Xinjiang.',
    'Bao Bao was sent to Guihua to supervise Xinjiang funds.',
  ],
  s1650: [
    'Hui rebels took Fukang.',
    'Hui rebels seized Fukang.',
  ],
  s1651: [
    'Qi Junzao died.',
    'Qi Junzao died.',
  ],
  s1652: [
    'On day xinwei, Yunnan Hui rebels took Anning and other prefectures and counties.',
    'On xinwei day, Yunnan Hui rebels seized Anning and neighboring districts.',
  ],
  s1653: [
    'On day guiwei, Zuo Zongtang asked to cut Fujian and Zhejiang Green Standard forces and add pay, training troops from the saved funds; it was granted.',
    'On guiwei day, Zuo Zongtang won approval to cut Green Standard numbers in Fujian and Zhejiang and train troops on the savings.',
  ],
  s1654: [
    'That autumn, quota taxes were remitted for disturbed parts of Guizhou, Guangdong, Shandong, and Fujian, disaster-struck Jiangxi, and overdue taxes in Zhejiang counties.',
    'That autumn, taxes were remitted in disturbed and disaster-hit provinces and for Zhejiang arrears.',
  ],
  s1655: [
    'Winter, tenth month, day xinmao: Liu Changyou was ordered strictly to verify metropolitan-area troop rolls.',
    'In winter, month 10, on xinmao day, Liu Changyou was ordered to audit metropolitan troop rolls.',
  ],
  s1656: [
    'On day guisi, Zhang Zongyu fled from Shanzhou into Pinglu; government troops beat him back.',
    'On guisi day, Zhang Zongyu fled from Shanzhou into Pinglu and government troops drove him back.',
  ],
  s1657: [
    'Shen Baozhen was ordered to take overall charge of Fujian shipyard affairs.',
    'Shen Baozhen was put in overall charge of the Fujian shipyard.',
  ],
  s1658: [
    'Liu Dian was ordered to assist in Zuo Zongtang\'s military affairs.',
    'Liu Dian was ordered to assist Zuo Zongtang\'s command.',
  ],
  s1659: [
    'On day jihai, Zhang Zongyu fled west, taking Huayin and Weinan.',
    'On jihai day, Zhang Zongyu fled west and seized Huayin and Weinan.',
  ],
  s1660: [
    'Gansu Hui rebels raided Yijun and Sanshui.',
    'Gansu Hui rebels raided Yijun and Sanshui.',
  ],
  s1661: [
    'An edict reproached Zeng Guofan for letting the rebels spread.',
    'Zeng Guofan was rebuked for letting rebels spread.',
  ],
  s1662: [
    'On day xinchou, Li Hongzao\'s request for sick leave was granted.',
    'On xinchou day, Li Hongzao was granted sick leave.',
  ],
  s1663: [
    'Fuming\'a was ordered to handle post-pacification affairs in Jilin; Wang Yuanfang was made Grand Councilor.',
    'Fuming\'a was sent to manage Jilin recovery and Wang Yuanfang joined the Grand Council.',
  ],
  s1664: [
    'On day renyin, Guizhou Hui rebels took Xingyi and soon lost it, also recovering Anping and Zhenning.',
    'On renyin day, Guizhou Hui rebels took Xingyi but soon lost it and recovered Anping and Zhenning.',
  ],
  s1665: [
    'On day yisi, Zeng Guofan begged leave on grounds of illness, asked to resign all posts while serving in camp, and requested cancellation of his marquisate; an edict comforted him and ordered him, when recovered, to come to audience.',
    'On yisi day, Zeng Guofan asked sick leave and to resign his posts and marquisate; he was comforted and told to attend court when well.',
  ],
  s1666: [
    'An edict ordered Mutushan to reinforce Shaanxi.',
    'Mutushan was ordered to reinforce Shaanxi.',
  ],
  s1667: [
    'On day bingwu, the stone seawall at Haining was repaired.',
    'On bingwu day, Haining\'s stone seawall was repaired.',
  ],
  s1668: [
    'That month, new and old quota taxes were remitted for flood-stricken districts in Anhui and Shouzhou.',
    'That month, flood-hit Anhui and Shouzhou districts were freed of new and old taxes.',
  ],
  s1669: [
    'Eleventh month, day bingchen: Zeng Guofan was ordered back to the Liangjiang governor-generalship, acting as treaty-trade commissioner.',
    'In month 11, on bingchen day, Zeng Guofan returned to Liangjiang and acted as treaty commissioner.',
  ],
  s1670: [
    'Li Hongzhang was made Imperial Commissioner with control over Hunan and Huai armies, charged solely with suppressing bandits.',
    'Li Hongzhang became Imperial Commissioner over Hunan and Huai forces to suppress bandits.',
  ],
  s1671: [
    'On day wuwu, Shandong Governor Yan Jingming was granted leave; Ding Baozhen acted in his place.',
    'On wuwu day, Shandong Governor Yan Jingming took leave and Ding Baozhen acted for him.',
  ],
  s1672: [
    'On day gengshen, Liu Mingchuan and others routed the Ren and Lai bandits at Jinxiang in a great victory.',
    'On gengshen day, Liu Mingchuan won a great victory over the Ren and Lai bandits at Jinxiang.',
  ],
  s1673: [
    'On day yichou, the western-expedition Mongol troops of the Three Banners and Two Leagues collapsed; Li Yunlin returned to Wucheng.',
    'On yichou day, western-expedition Mongol levies collapsed and Li Yunlin fell back to Wucheng.',
  ],
  s1674: [
    'An edict ordered Kukejitai to lead the Jilin and Heilongjiang armies forward with all speed.',
    'Kukejitai was ordered to hurry the Jilin and Heilongjiang armies forward.',
  ],
  s1675: [
    'On day dingmao, Sichuan troops took the bandit nest at Tongzi.',
    'On dingmao day, Sichuan forces stormed the Tongzi bandit nest.',
  ],
  s1676: [
    'On day dingyou, Zeng Guoquan memorialized that Guan Wen was greedy, incompetent, arrogant, and overbearing.',
    'On dingyou day, Zeng Guoquan impeached Guan Wen for greed, incompetence, and arrogance.',
  ],
  s1677: [
    'He was ordered removed from office and investigated.',
    'Guan Wen was dismissed and ordered investigated.',
  ],
  s1678: [
    'On day jimao, regulations for the Fujian shipyard were fixed.',
    'On jimao day, the Fujian shipyard regulations were fixed.',
  ],
  s1679: [
    'Twelfth month, day dinghai: because Censor Xun Luanwei\'s impeachment proved unfounded, he was sharply rebuked, and censors were thereupon urged to speak with care.',
    'In month 12, on dinghai day, Censor Xun Luanwei was rebuked for a false impeachment and censors were urged to be careful.',
  ],
  s1680: [
    'On day jichou, Guo Songlin and others routed the Ren and Lai bandits at De\'an in a great defeat.',
    'On jichou day, Guo Songlin routed the Ren and Lai bandits at De\'an.',
  ],
  s1681: [
    'On day gengyin, because the Yellow River was tending north, Su Tingkui was ordered to survey it throughout and jointly with Zhili, Shandong, and Henan to plan dike works.',
    'On gengyin day, Su Tingkui was ordered to survey the Yellow River and plan dikes with Zhili, Shandong, and Henan.',
  ],
  s1682: [
    'Gansu Hui rebels again took Hami.',
    'Gansu Hui rebels again seized Hami.',
  ],
  s1683: [
    'Hu Jiayu was removed from the Grand Council and stripped of rank while retained in office, for having accepted bribes from Guan Wen.',
    'Hu Jiayu left the Grand Council, kept office but lost rank, for taking Guan Wen\'s bribes.',
  ],
  s1684: [
    'On day jiawu, Zeng Guofan again memorialized asking to resign his posts.',
    'On jiawu day, Zeng Guofan again asked to resign his posts.',
  ],
  s1685: [
    'A warm edict comforted him and kept him in place.',
    'A warm edict comforted him and kept him at post.',
  ],
  s1686: [
    'On day jihai, Lei Zhengkuan\'s army recovered Pingliang.',
    'On jihai day, Lei Zhengkuan retook Pingliang.',
  ],
  s1687: [
    'Bandits in Hulan were pacified.',
    'Hulan bandits were pacified.',
  ],
  s1688: [
    'On day gengzi, Hunan troops aiding Guizhou routed Miao bandits at Tongren in a great victory.',
    'On gengzi day, Hunan forces aiding Guizhou won a great victory over Miao bandits at Tongren.',
  ],
  s1689: [
    'On day jiyou, Hui rebels besieged Qingyang; Regional Commander Zhou Xiancheng and others died fighting fiercely.',
    'On jiyou day, Hui rebels besieged Qingyang and Regional Commander Zhou Xiancheng and others died fighting.',
  ],
  s1690: [
    'On day jiayin, Shaanxi troops fought Zhang Zongyu and were defeated at Baqiao; Major General Xiao Deyang and others were killed.',
    'On jiayin day, Shaanxi forces were beaten by Zhang Zongyu at Baqiao and Xiao Deyang and others were killed.',
  ],
  s1691: [
    'Because the Nian momentum was running wild, Zeng Guofan and others were ordered broadly to devise strategy.',
    'With Nian rebels raging, Zeng Guofan and others were ordered to plan broadly.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b17.mjs <translation.json>'
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
