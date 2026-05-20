#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1401: [
    'Chang Qing was made Ili General.',
    'Chang Qing became general of Ili.',
  ],
  s1402: [
    'On day xinyou, Jintan fell; Magistrate Li Huai had defended for three years; reinforcements did not arrive; he died when his strength was exhausted; gentry and commoners who followed him in death exceeded a thousand persons.',
    'On xinyou day Jintan fell after Magistrate Li Huai\'s three-year defense without relief; over a thousand gentry and townspeople died with him.',
  ],
  s1403: [
    'Sheng Bao was ordered to supervise the cavalry garrison at Tongzhou.',
    'Sheng Bao was put in charge of the mounted force defending Tongzhou.',
  ],
  s1404: [
    'Eighth month, day guihai: foreign troops reached Tongzhou; Zaiyuan lured and seized the British envoy Parkes and sent him to the capital.',
    'In the eighth month, on guihai day, foreign troops reached Tongzhou; Zaiyuan captured the British envoy Parkes by ruse and sent him to Beijing.',
  ],
  s1405: [
    'On day wuchen, Ruilin and others fought foreign troops at Baliqiao; the result was unfavorable.',
    'On wuchen day Ruilin and others fought foreign troops at Baliqiao and were beaten.',
  ],
  s1406: [
    'Prince Gong Yixin was ordered to serve as Imperial Commissioner to handle the pacification arrangements.',
    'Prince Gong Yixin became Imperial Commissioner to manage the peace talks.',
  ],
  s1407: [
    'On day jisi, the Emperor proceeded to Mulan, departing from the Yuanming Garden.',
    'On jisi day the Emperor left the Yuanming Garden for Mulan.',
  ],
  s1408: [
    'On day dingchou, the Emperor halted at the Mountain Resort for Escaping the Heat.',
    'On dingchou day the Emperor took up residence at the Rehe mountain resort.',
  ],
  s1409: [
    'Li Shizhong was promoted and appointed Jiangnan Military Governor for capturing the rebel general Xue Chengliang.',
    'Li Shizhong was made Jiangnan military governor for capturing the rebel Xue Chengliang.',
  ],
  s1410: [
    'On day wuyin, an edict said: "Jiangnan Military Governor Zhang Guoliang combines stratagem and courage, and his loyal devotion was ardent.',
    'On wuyin day an edict praised Jiangnan governor Zhang Guoliang\'s courage and loyalty:',
  ],
  s1411: [
    'In the army ten years, his battle achievements were outstanding; the southeastern half of the realm relied on him as its great wall.',
    'For ten years in the field his victories were outstanding, and the southeast had leaned on him as its bulwark.',
  ],
  s1412: [
    'This year the great camp was routed and scattered; returning to reinforce and strike the rebels, he was wounded and drowned.',
    'This year, after the great camp broke up, he was wounded and drowned while hurrying back to fight the rebels.',
  ],
  s1413: [
    'Memorials reported this in succession, yet We still hoped it was not certain.',
    'Repeated reports still left the throne hoping they were untrue.',
  ],
  s1414: [
    'Until now, several months on, there is no doubt that he died in loyal sacrifice.',
    'Months later his death in service could no longer be doubted.',
  ],
  s1415: [
    'Had Zhang Guoliang still been alive, how could the Suzhou and Chang regions have been ruined to this extent.',
    'Had Zhang Guoliang lived, Suzhou and Changzhou would not have collapsed as they did.',
  ],
  s1416: [
    'Recalling his loyal toil, Our grief deepens all the more.',
    'Remembering his loyal service deepened the court\'s grief.',
  ],
  s1417: [
    'He was posthumously granted Grand Guardian of the Heir Apparent, entered sacrifice at the Shrine of Manifest Loyalty, and separate temples were built in his honor.',
    'He was posthumously made Grand Guardian of the Heir Apparent, enshrined at the Shrine of Manifest Loyalty, and given dedicated temples.',
  ],
  s1418: [
    'Several of his sons and grandsons were sent to the ministries for appointment.',
    'Several of his descendants were sent to the ministries for office.',
  ],
  s1419: [
    '" On day jimao, Du Xing\'a was ordered to bring troops to guard the capital, at official Wen\'s request.',
    '" On jimao day Du Xing\'a was ordered to the capital with troops at Wen Wenzao\'s request.',
  ],
  s1420: [
    'Yu Ming, Cheng Kai, Le Bin, Wen Yu, and Ying Gui were ordered to supervise troops entering to guard the capital.',
    'Yu Ming, Cheng Kai, Le Bin, Wen Yu, and Ying Gui were told to bring troops to guard Beijing.',
  ],
  s1421: [
    'On day xinsi, Hengfu was ordered to garrison at Gubeikou on defense, and Wu Tingdong was to relay memorials and reports.',
    'On xinsi day Hengfu was posted at Gubeikou and Wu Tingdong took over dispatch of documents.',
  ],
  s1422: [
    'On day renwu, Zhejiang government troops recovered Pinghu and Jiashan.',
    'On renwu day Zhejiang forces retook Pinghu and Jiashan.',
  ],
  s1423: [
    'Guangdong government troops recovered Lechang and Renhua.',
    'Guangdong forces retook Lechang and Renhua.',
  ],
  s1424: [
    'On day guimao, Jiangsu rebels took Changshu.',
    'On guimao day rebels seized Changshu in Jiangsu.',
  ],
  s1425: [
    'The Yuanming Garden suffered disaster by fire; Imperial Concubine Chang died; Grand Minister of the Imperial Household and Minister Wen Feng died in it.',
    'Fire ravaged the Yuanming Garden; Concubine Chang and Household Minister Wen Feng perished in it.',
  ],
  s1426: [
    'On day gengyin, Prince Gong memorialized requesting that Parkes be returned to the British army.',
    'On gengyin day Prince Gong asked that Parkes be returned to the British.',
  ],
  s1427: [
    'Xue Huan memorialized impeaching Feng Zicai for going to relieve Jintan yet holding his troops back without advancing, causing the city to fall.',
    'Xue Huan impeached Feng Zicai for stalling on the march to relieve Jintan and letting the city fall.',
  ],
  s1428: [
    'An edict mildly rebuked him.',
    'The court issued a mild rebuke.',
  ],
  s1429: [
    'Ninth month, day renchen: Sheng Bao was made Imperial Commissioner with overall command of relief armies.',
    'In the ninth month, on renchen day, Sheng Bao became Imperial Commissioner over relief forces.',
  ],
  s1430: [
    'Prince Gong Yixin was ordered to notify the English in writing not to repair the northern city batteries and to conclude the treaty quickly.',
    'Prince Gong was told to notify the British not to rebuild the northern batteries and to hurry the treaty.',
  ],
  s1431: [
    'On day jiawu, the British and French envoys entered the city.',
    'On jiawu day the British and French envoys entered Beijing.',
  ],
  s1432: [
    'Grand Secretary Peng Yunzhang and Minister Xu Naipu begged leave for illness and were permitted.',
    'Peng Yunzhang and Xu Naipu were allowed to retire for illness.',
  ],
  s1433: [
    'On day jihai, Qinglian and Ying Gui were ordered to station troops in Zhili for dispatch as needed.',
    'On jihai day Qinglian and Ying Gui were posted in Zhili with troops on call.',
  ],
  s1434: [
    'On day xinchou, rebels took Ningguo; Zhou Tianshou died in defense.',
    'On xinchou day rebels took Ningguo and Zhou Tianshou was killed.',
  ],
  s1435: [
    'On day jiachen, Zuo Zongtang was ordered to supervise Zhejiang military affairs.',
    'On jiachen day Zuo Zongtang was put in charge of Zhejiang operations.',
  ],
  s1436: [
    'On day yisi, the pacification arrangements were concluded.',
    'On yisi day the peace settlement was completed.',
  ],
  s1437: [
    'Prince Gong Yixin memorialized requesting that it be proclaimed at home and abroad and carried out as agreed.',
    'Prince Gong asked that the settlement be proclaimed at home and abroad and carried out as agreed.',
  ],
  s1438: [
    'Russians were permitted to station at Ussuri and Suifen.',
    'Russia was allowed garrisons at Ussuri and Suifen.',
  ],
  s1439: [
    'Relief armies from the provinces were halted.',
    'Provincial relief armies were ordered to stand down.',
  ],
  s1440: [
    'Ying Gui was ordered to come to the capital.',
    'Ying Gui was recalled to Beijing.',
  ],
  s1441: [
    'A western tour was discussed.',
    'The court discussed moving the court farther west.',
  ],
  s1442: [
    'On day wushen, Li Ruozhu memorialized the recovery of Jiangyin.',
    'On wushen day Li Ruozhu reported the recapture of Jiangyin.',
  ],
  s1443: [
    'On day xinhai, rebels took Huizhou; defending circuit intendant Li Yuandu abandoned the city and fled.',
    'On xinhai day rebels took Huizhou and Li Yuandu fled.',
  ],
  s1444: [
    'On day guichou, bandits rose together in Zhili, Shandong, and Henan; Sengge Rinchen was ordered to suppress them.',
    'On guichou day bandits rose across Zhili, Shandong, and Henan, and Sengge Rinchen was sent against them.',
  ],
  s1445: [
    'On day gengshen, Prince Gong Yixin memorialized that the foreigners had withdrawn to Tianjin and pleaded for the imperial return.',
    'On gengshen day Prince Gong reported the foreigners had withdrawn to Tianjin and asked the Emperor to return.',
  ],
  s1446: [
    'Winter, tenth month, new moon day xinyou: an edict said the weather was growing cold and the return to the capital was temporarily deferred.',
    'At the tenth-month new moon the court said cold weather required deferring the return to Beijing.',
  ],
  s1447: [
    'Tian Xingyu was made Guizhou Military Governor.',
    'Tian Xingyu became Guizhou military governor.',
  ],
  s1448: [
    'Hereditary offices were granted to the fallen military governors Zhou Tianshou and Zhou Tianpei; temples, posthumous titles, and attached sacrifice with Circuit Intendant Fu Xian and others were ordered.',
    'Fallen governors Zhou Tianshou and Zhou Tianpei received hereditary honors, temples, posthumous titles, and joint sacrifice with Fu Xian and others.',
  ],
  s1449: [
    'On day renxu, Liu Yuanhao was made Yunnan-Guizhou Governor-General and Deng Erheng Guizhou Governor.',
    'On renxu day Liu Yuanhao took Yunnan-Guizhou and Deng Erheng Guizhou.',
  ],
  s1450: [
    'On day jiazi, Wen Qian and Hengqi were ordered to handle trade affairs; Wu Tingdong was ordered to supervise defense.',
    'On jiazi day Wen Qian and Hengqi took trade affairs and Wu Tingdong defense.',
  ],
  s1451: [
    'Wen An was made Hunan Military Governor.',
    'Wen An became Hunan military governor.',
  ],
  s1452: [
    'Feng Zicai was ordered to supervise Zhenjiang military affairs.',
    'Feng Zicai was put in charge of operations at Zhenjiang.',
  ],
  s1453: [
    'On day bingyin, Prince Gong Yixin memorialized exchanging the Russian treaty and requested use of the imperial seal; it was approved.',
    'On bingyin day Prince Gong\'s request to seal the revised Russian treaty was approved.',
  ],
  s1454: [
    'On day xinwei, Russia presented firearms.',
    'On xinwei day Russia presented guns and cannon.',
  ],
  s1455: [
    'On day guiyou, Le Bin and Ying Gui were ordered to return to their posts.',
    'On guiyou day Le Bin and Ying Gui were told to resume their posts.',
  ],
  s1456: [
    'On day gengchen, Yan Shusen was made Henan Governor and Mao Changxi was ordered to supervise Henan Nian bandit suppression.',
    'On gengchen day Yan Shusen took Henan and Mao Changxi the Nian suppression there.',
  ],
  s1457: [
    'On day xinsi, Du Xing\'a was ordered to supervise Jiangbei military affairs, with Li Ruozhu as deputy.',
    'On xinsi day Du Xing\'a took Jiangbei command with Li Ruozhu as deputy.',
  ],
  s1458: [
    'Brigade General Tian Zaitian was ordered to take over suppression of bandits in Xu and Su; Huai-Xu intendant Wu Tang was to assist.',
    'Tian Zaitian took over Xu-Su suppression with Intendant Wu Tang assisting.',
  ],
  s1459: [
    'Eleventh month, day xinmao: Sheng Bao memorialized that Dashunguangdao should ally with Britain to specialize in river defense; memorial reporting was approved.',
    'In the eleventh month, on xinmao day, Sheng Bao won approval to have Dashunguangdao ally with Britain for river defense.',
  ],
  s1460: [
    'On day guisi, Weng Tonghe memorialized on revering Heaven\'s warnings, securing the state\'s foundation, gathering talent, drilling the Metropolitan Banner, and contesting strategic position.',
    'On guisi day Weng Tonghe urged heeding Heaven\'s warnings, strengthening the state, gathering talent, drilling the capital banners, and seizing strategic advantage.',
  ],
  s1461: [
    'The rescript said: "On gathering talent, the benefits are few and the harms many.',
    'The throne replied: "Gathering talent does more harm than good.',
  ],
  s1462: [
    'The rest is left for review."',
    'The rest may be reviewed."',
  ],
  s1463: [
    '" On day jiawu, Zhejiang rebels took Xincheng, Lin\'an, and Fuyang.',
    '" On jiawu day rebels took Xincheng, Lin\'an, and Fuyang in Zhejiang.',
  ],
  s1464: [
    'On day yiwei, Wang Mengling memorialized victory in suppressing rebels and the pacification of Sanhe, and also requested control over Huang Kaibang\'s naval force; it was approved.',
    'On yiwei day Wang Mengling reported victory at Sanhe and won control of Huang Kaibang\'s fleet.',
  ],
  s1465: [
    'On day gengzi, Zeng Guofan memorialized that Bao Chao and others had recovered Yi county.',
    'On gengzi day Zeng Guofan reported Bao Chao\'s recapture of Yi county.',
  ],
  s1466: [
    'On day xinchou, Li Ruozhu begged leave to care for his parents; Zeng Bingzhong replaced him.',
    'On xinchou day Li Ruozhu retired to care for his parents and Zeng Bingzhong replaced him.',
  ],
  s1467: [
    'On day guimao, because Hangzhou was relieved, Ruichang, Wang Youling, and others received special rewards.',
    'On guimao day Ruichang, Wang Youling, and others were richly rewarded for the relief of Hangzhou.',
  ],
  s1468: [
    'Ruichang memorialized that Qing Duan had vigorously defended Zhejiang and requested added rewards.',
    'Ruichang asked extra honors for Qing Duan\'s defense of Zhejiang.',
  ],
  s1469: [
    'The rescript said: "Without regard to boundaries, all are matters within your duty as great officials.',
    'The throne replied: "Provincial boundaries do not limit a governor\'s duty.',
  ],
  s1470: [
    'Commendation of governors and governors-general comes from court edict; it is not for you to request on your own authority."',
    'Rewards for governors come from the throne, not from your own petitions."',
  ],
  s1471: [
    '" On day wushen, Cheng Qi was ordered to join Jing Dun in surveying the eastern border with Russia.',
    '" On wushen day Cheng Qi was sent with Jing Dun to survey Russia\'s eastern border.',
  ],
  s1472: [
    'On day guimao, Zhejiang forces under Zhang Yuliang attacked and recovered Yanzhou.',
    'On guimao day Zhang Yuliang\'s Zhejiang force retook Yanzhou.',
  ],
  s1473: [
    'On day jiayin, Guan Wen and Hu Linyi memorialized that Chen Yucheng intended to attack Huai and Tong; Duolong\'a joined Li Xuyi to meet and suppress them, inflicting a great defeat and killing more than ten thousand rebels.',
    'On jiayin day Guan Wen and Hu Linyi reported Duolong\'a and Li Xuyi had crushed Chen Yucheng\'s thrust toward Huai and Tong, killing over ten thousand rebels.',
  ],
  s1474: [
    'Duolong\'a was granted the yellow riding jacket; Li Xuyi was raised two ranks in rank.',
    'Duolong\'a received the yellow jacket and Li Xuyi a two-rank promotion.',
  ],
  s1475: [
    'Twelfth month, day xinyou: Xiling\'a and Guorui were ordered to assist in Sengge Rinchen\'s military affairs.',
    'In the twelfth month, on xinyou day, Xiling\'a and Guorui were assigned to Sengge Rinchen\'s staff.',
  ],
  s1476: [
    'On day bingyin, Zhang Liangji was ordered to remain and handle Yunnan military affairs.',
    'On bingyin day Zhang Liangji was kept in Yunnan to manage operations.',
  ],
  s1477: [
    'On day jisi, the Office for the General Management of the Affairs of All Nations was first established; Prince Gong Yixin, Gui Liang, and Wen Xiang were ordered to administer it.',
    'On jisi day the Zongli Yamen was established under Prince Gong, Gui Liang, and Wen Xiang.',
  ],
  s1478: [
    'Chonghou was appointed Minister for the Three Ports; Xue Huan was additionally ordered to handle trade affairs at Shanghai and elsewhere.',
    'Chonghou became minister for the three treaty ports and Xue Huan took Shanghai trade affairs.',
  ],
  s1479: [
    'Bannermen were permitted to study foreign languages and writing.',
    'Bannermen were allowed to study foreign languages.',
  ],
  s1480: [
    'On day jisi, Tian Xingyu was made Imperial Commissioner to supervise Guizhou military affairs.',
    'On jisi day Tian Xingyu became Imperial Commissioner for Guizhou.',
  ],
  s1481: [
    'On day bingzi, Zuo Zongtang memorialized that his supervised army had recovered Dexing in Jiangxi and Wuyuan in Anhui; he was granted third-rank capital official.',
    'On bingzi day Zuo Zongtang reported the recapture of Dexing and Wuyuan and received third-rank capital rank.',
  ],
  s1482: [
    'On day yiyou, Guan Wen and Zhou Zupei were made Grand Secretaries; Su Shun was made cooperating grand secretary; Shen Zhaolin was made Minister of Revenue; Zhu Fengbiao was made Minister of War.',
    'On yiyou day Guan Wen and Zhou Zupei entered the Grand Secretariat, Su Shun as cooperating secretary, Shen Zhaolin Revenue, and Zhu Fengbiao War.',
  ],
  s1483: [
    'On day wuzi, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On wuzi day the court performed the joint sacrifice at the ancestral temple.',
  ],
  s1484: [
    'That year, quota levies and arrears were remitted for Jiangsu, Zhejiang, and Anhui; and for 401 prefectures, departments, counties, and garrisons in Zhili, Shandong, Henan, Jiangxi, Hubei, Hunan, Fujian, Guangxi, and other provinces, quota levies were remitted in differing degrees where there had been disaster or rebel depredation.',
    'That year Jiangsu, Zhejiang, and Anhui had taxes and arrears remitted, and 401 districts in eight provinces received partial relief where war or disaster had struck.',
  ],
  s1485: [
    'The empire\'s population was reckoned at 260,924,675 persons; grain in storage totaled 5,231,920 piculs, 4 dou, 6 sheng, 5 ge, and 1 shao.',
    'The empire counted 260,924,675 people and 5,231,920-plus piculs of grain in store.',
  ],
  s1486: [
    'Korea sent tribute.',
    'Korea presented tribute.',
  ],
  s1487: [
    'In the eleventh year, xinyou, the Emperor was at Mulan.',
    'In Xianfeng 11, xinyou year, the Emperor was at Mulan.',
  ],
  s1488: [
    'Spring, first month, new moon day gengyin: the Emperor received congratulations in the Suicheng Hall.',
    'In spring, at the first-month new moon, the Emperor received New Year homage in the Suicheng Hall.',
  ],
  s1489: [
    'On day xinyou, an edict fixed the return to the capital on the thirteenth day of the second month.',
    'On xinyou day the court set the return to Beijing for the thirteenth of the second month.',
  ],
  s1490: [
    'On day yiwei, Zeng Guofan memorialized that Yang Zaifu had suppressed rebels, taken Duchang, and lifted the siege of Nanling.',
    'On yiwei day Zeng Guofan reported Yang Zaifu had taken Duchang and relieved Nanling.',
  ],
  s1491: [
    'Tian Zaitian memorialized that Nian bandits attacked Dangshan and were driven off; he was given the military governor rank.',
    'Tian Zaitian reported beating off Nian bandits at Dangshan and received the military governor rank.',
  ],
  s1492: [
    'On day bingshen, Weng Tonghe was summoned to the capital; Li Xuyi was made Anhui Governor.',
    'On bingshen day Weng Tonghe was called to Beijing and Li Xuyi made Anhui governor.',
  ],
  s1493: [
    'On day dingyou, Fu Qing was made Chengdu General.',
    'On dingyou day Fu Qing became Chengdu general.',
  ],
  s1494: [
    'On day xinchou, rebels took Xiaofeng; Hangzhou was placed on alert.',
    'On xinchou day rebels took Xiaofeng and Hangzhou went on alert.',
  ],
  s1495: [
    'On day renyin, an edict said: "As the reign year opens a new cycle, a special amnesty should be granted; what is not normally pardoned even in ordinary amnesties shall all be reduced or remitted.',
    'On renyin day the court proclaimed a special amnesty for the new reign cycle, reducing even offenses outside ordinary amnesties.',
  ],
  s1496: [
    '" On day guimao, Zuo Zongtang\'s army recovered Raozhou and Duliang.',
    '" On guimao day Zuo Zongtang retook Raozhou and Duliang.',
  ],
  s1497: [
    'On day yisi, Hengfu was relieved for illness; Wen Yu was made Zhili Governor-General; Tan Tingxiang Shandong Governor; Deng Erheng Shaanxi Governor; He Guanying acted as Guizhou Governor.',
    'On yisi day Hengfu left for illness; Wen Yu took Zhili, Tan Tingxiang Shandong, Deng Erheng Shaanxi, and He Guanying acted at Guizhou.',
  ],
  s1498: [
    'On day dingwei, Sengge Rinchen memorialized that Nian bandits had fled into Shandong; detachments were sent in pursuit and engaged them at Heze, with an unfavorable result.',
    'On dingwei day Sengge Rinchen reported pursuing Nian bandits into Shandong and losing an engagement at Heze.',
  ],
  s1499: [
    'The rescript said: "Sengge Rinchen commands a heavy force on which the northern regions rely as their bulwark.',
    'The throne replied: "Sengge Rinchen commands the great force the north relies on as its shield.',
  ],
  s1500: [
    'Yet with hungry and weary troops he pursued a rebel host at full strength, with no support on the flank; it was fitting that he should be defeated.',
    'Yet he pursued a swelling enemy with exhausted men and no flank support; defeat was to be expected.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b15.mjs <translation.json>'
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
