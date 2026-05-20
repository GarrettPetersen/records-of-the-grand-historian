#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1501: [
    'He is bold to excess yet unable to hold steady weight.',
    'His daring outruns his steadiness.',
  ],
  s1502: [
    'You are still to cull troops and choose generals, hold choke points in strict defense, plan before moving, and do not advance lightly again.',
    'Cull troops, pick generals, hold the passes, plan first, and do not rush forward again.',
  ],
  s1503: [
    'On day wushen, an edict to Yuan Jiasan and others: "Nian bandits have coerced good people; they must not all be put to death without distinction. You should earnestly instruct and announce this and devise means to disband them.',
    'On wushen day, Yuan Jiasan was told not to massacre coerced civilians among the Nian and to disband them by proclamation.',
  ],
  s1504: [
    'Those who surrender shall be pardoned; those who kill bandits shall be rewarded for merit.',
    'Surrender brought pardon; killing bandits brought merit.',
  ],
  s1505: [
    'And communicate the same to Li Shizhong for joint surrender and pacification.',
    'Li Shizhong was told to offer the same terms.',
  ],
  s1506: [
    'On day xinhai, Guizhou government troops recovered Dushan.',
    'On xinhai day, Guizhou troops retook Dushan.',
  ],
  s1507: [
    'On day renzi, Weng Tongshu memorialized that the militia-trained Miao Peilin raided Shouzhou and was overbearingly abnormal.',
    'On renzi day, Weng Tongshu reported Miao Peilin\'s militia raiding Shouzhou with outrageous arrogance.',
  ],
  s1508: [
    'An edict ordered Li Xuyi to deliberate and handle it.',
    'Li Xuyi was ordered to handle the matter.',
  ],
  s1509: [
    'Henan Nian bandits raided Dongming and Changyuan.',
    'Henan Nian raiders struck Dongming and Changyuan.',
  ],
  s1510: [
    'Second month, new moon on day jiwei, Yunnan government troops recovered Jinning.',
    'In month 2, jiwei new moon, Yunnan troops retook Jinning.',
  ],
  s1511: [
    'On day renxu, the Fengtian Jinzhou naval camp was re-established.',
    'On renxu day, Fengtian\'s Jinzhou naval camp was restored.',
  ],
  s1512: [
    'On day bingyin, an edict approved Shandong\'s return of French church land, and ordered all provinces that meet foreign affairs to deliberate, report, and seek instructions—shifting responsibility was forbidden.',
    'On bingyin day, Shandong returned French church land with approval, and provinces were forbidden to shirk foreign-affairs cases.',
  ],
  s1513: [
    'On day dingmao, Zhang Yuliang\'s army recovered Jiangshan and Changshan.',
    'On dingmao day, Zhang Yuliang retook Jiangshan and Changshan.',
  ],
  s1514: [
    'On day gengwu, Zeng Guofan memorialized that Zuo Zongtang defeated bandits at Jingdezhen and Bao Chao defeated bandits at Shimen Yangtang.',
    'On gengwu day, Zeng Guofan reported Zuo Zongtang\'s victory at Jingdezhen and Bao Chao\'s at Shimen Yangtang.',
  ],
  s1515: [
    'On day renshen, Zhejiang troops recovered Fuyang.',
    'On renshen day, Zhejiang forces retook Fuyang.',
  ],
  s1516: [
    'Bandits in Chaoyang, Rehe, captured the city; Kexing\'a was ordered to suppress them.',
    'Rehe Chaoyang bandits took the city; Kexing\'a was sent to suppress them.',
  ],
  s1517: [
    'Ming Yi and Ming Xu were ordered to survey the Russian border; Ying Yun and Kui Ying were to handle Russian trade.',
    'Ming Yi and Ming Xu surveyed the Russian border; Ying Yun and Kui Ying handled Russian trade.',
  ],
  s1518: [
    'Nian bandits struck the Wen River; Vice Commander-in-Chief Yi Xing\'a and Major General Teng Jiasheng met them in battle and died.',
    'Nian raiders hit the Wen River; Yi Xing\'a and Teng Jiasheng died fighting them.',
  ],
  s1519: [
    'On day yihai, Chen Yucheng gathered Nian bandits and from Yingshan invaded Qishui in Hubei; an edict ordered Hu Linyi to return troops and strike them.',
    'On yihai day, Chen Yucheng led Nian forces from Yingshan into Hubei Qishui; Hu Linyi was ordered back to strike them.',
  ],
  s1520: [
    'On day gengchen, an edict said: "An edict was earlier issued fixing a day for the return to the capital.',
    'On gengchen day, an edict said a return to the capital had been fixed.',
  ],
  s1521: [
    'For more than ten days my bodily condition has not recovered.',
    'For ten days the Emperor\'s health had not recovered.',
  ],
  s1522: [
    'So it will await autumn for a further edict.',
    'A further edict would wait until autumn.',
  ],
  s1523: [
    'On day renwu, the King of Korea sent envoys to attend the court at the temporary palace.',
    'On renwu day, Korea sent envoys to the traveling court.',
  ],
  s1524: [
    'A warm edict stopped them; brocade, precious vessels, and gifts were bestowed on them and their envoys.',
    'They were warmly told to stay home and were given brocade, treasures, and gifts.',
  ],
  s1525: [
    'On day guiwei, an edict ordered selected soldiers drilled on firearms sent from Russia.',
    'On guiwei day, troops were ordered to drill on Russian firearms.',
  ],
  s1526: [
    'On day jiashen, Heilongjiang militia levies were disbanded and returned to farming.',
    'On jiashen day, Heilongjiang militia were disbanded to farming.',
  ],
  s1527: [
    'Third month, new moon on day jichou, treaty commissioners Chonglun and Chonghou were given full powers to act at convenience.',
    'In month 3, jichou new moon, Chonglun and Chonghou received full treaty powers.',
  ],
  s1528: [
    'Vice Minister Cheng Qi was ordered to go to Lake Xingkai to survey Russian boundary matters jointly.',
    'Cheng Qi was sent to Lake Xingkai to survey the Russian border.',
  ],
  s1529: [
    'Circuit Intendant Lian Jie was granted fourth-rank capital official and ordered to manage river defense.',
    'Lian Jie became a fourth-rank capital official in charge of river defense.',
  ],
  s1530: [
    'On day renchen, Prince Gong Yixin asked to go to the temporary residence to pay respects and inquire after the Emperor\'s health.',
    'On renchen day, Prince Gong Yixin asked to attend the Emperor at the traveling palace.',
  ],
  s1531: [
    'The Emperor personally replied by edict: "We have been apart half a year and I often think of speaking face to face.',
    'The Emperor replied in his own hand: half a year apart, he longed to speak in person.',
  ],
  s1532: [
    'Lately incessant coughing does not cease and there is sometimes bloody sputum; I still need quiet care and am not fit for much talk.',
    'Coughing and bloody sputum required quiet; he was not fit for much talk.',
  ],
  s1533: [
    'Wait until autumn for another face-to-face conversation.',
    'They would meet face to face in autumn.',
  ],
  s1534: [
    'On day bingchen, an edict ordered the Crown Prince to enter study on the seventh day of the fourth month, with Li Hongzao as tutor.',
    'On bingchen day, the Crown Prince was to begin study on the fourth month\'s seventh day under Li Hongzao.',
  ],
  s1535: [
    'On day wuxu, Du Xing\'a memorialized that Zhen-Yang naval vessels were long damaged; he asked Guangdong to purchase and transport red-barque ships—approved.',
    'On wuxu day, Du Xing\'a won approval to buy Guangdong red-barques for worn Zhen-Yang ships.',
  ],
  s1536: [
    'On day gengzi, Sheng Bao was ordered to supervise suppression of bandits in Zhili and Shandong.',
    'On gengzi day, Sheng Bao took charge of bandit suppression in Zhili and Shandong.',
  ],
  s1537: [
    'Jia Zhen was made acting Anhui governor.',
    'Jia Zhen became acting Anhui governor.',
  ],
  s1538: [
    'On day gengxu, English and French troops withdrew from Guangzhou\'s provincial city.',
    'On gengxu day, Anglo-French forces left Guangzhou city.',
  ],
  s1539: [
    'On day xinhai, former Grand Secretary Peng Yunzhang was made acting Minister of War.',
    'On xinhai day, Peng Yunzhang acted as Minister of War.',
  ],
  s1540: [
    'On day jiayin, Zhejiang bandits took Haiyan, Pinghu, and Zhapu; Vice Commander-in-Chief Xiling\'e died.',
    'On jiayin day, Zhejiang bandits took Haiyan, Pinghu, and Zhapu; Xiling\'e was killed.',
  ],
  s1541: [
    'On day bingchen, Guangxi native bandits took Taiping prefecture and Yangli subprefecture.',
    'On bingchen day, Guangxi bandits took Taiping and Yangli.',
  ],
  s1542: [
    'Summer, fourth month, new moon on day jiwei, Yan Shusen memorialized that bandits attacked Runan and Circuit Intendant Zhang Yao drove them off.',
    'In summer, month 4, jiwei new moon, Yan Shusen reported Zhang Yao driving bandits from Runan.',
  ],
  s1543: [
    'On day wuchen, Shandong Nian and sect bandits together took seven counties including Guantao.',
    'On wuchen day, Shandong Nian and sect rebels took seven counties including Guantao.',
  ],
  s1544: [
    'Senggelinqin entered Teng county to hold fast; an edict ordered Sheng Bao to divide troops to aid him.',
    'Senggelinqin held Teng county; Sheng Bao was told to send reinforcements.',
  ],
  s1545: [
    'On day jiaxu, an edict said: "We hear that everywhere donations are conducted—designated donation, loan donation, gunboat donation, per-mu donation, rice donation, army-pay donation, dike-work donation, boat donation, house donation, salt donation, plank donation, live donation—the names multiply and the clerks are confused.',
    'On jiaxu day, the Emperor denounced proliferating levy names from designated gifts to live taxes.',
  ],
  s1546: [
    'In fact what is taken from the people is much and what reaches the public treasury is little.',
    'Little reached the treasury; most was taken from the people.',
  ],
  s1547: [
    'In recent years military funds are vast and we have had no choice but to borrow from popular and merchant strength.',
    'Heavy war costs had forced reliance on the people and merchants.',
  ],
  s1548: [
    'Yet every drop must reach the public treasury and expenditure must be economical before there is real benefit.',
    'Funds had to reach the treasury and be spent frugally to do real good.',
  ],
  s1549: [
    'If exactions are boundless like this, draining the people\'s livelihood, what sort of government is this still?',
    'Boundless exactions that drained livelihoods were no government at all.',
  ],
  s1550: [
    'All grand ministers and governors-general, see that you rigorously investigate, root out corruption, and answer Our intent."',
    'Ministers and governors were ordered to investigate strictly and root out graft.',
  ],
  s1551: [
    'On day yihai, Zuo Zongtang defeated bandits at Leping.',
    'On yihai day, Zuo Zongtang beat bandits at Leping.',
  ],
  s1552: [
    'On day gengchen, Shandong sect bandits besieged Daming; Lian Jie drove them off.',
    'On gengchen day, Shandong sect rebels besieged Daming; Lian Jie repulsed them.',
  ],
  s1553: [
    'On day guiwei, Anhui bandits again raided Zhejiang, took Changshan and Jiangshan, and pressed on Quzhou.',
    'On guiwei day, Anhui raiders retook Changshan and Jiangshan and threatened Quzhou.',
  ],
  s1554: [
    'Fifth month, day guisi, Tian Zaitian memorialized that Miao militia attacked Fuli; an edict ordered Senggelinqin to divide troops to aid.',
    'In month 5, guisi, Tian Zaitian reported Miao militia at Fuli; Senggelinqin was told to detach troops.',
  ],
  s1555: [
    'On day jiawu, Deng Erheng was killed at Qujing.',
    'On jiawu day, Deng Erheng was murdered at Qujing.',
  ],
  s1556: [
    'Liu Yuanhao was ordered to investigate.',
    'Liu Yuanhao was ordered to investigate.',
  ],
  s1557: [
    'Ying Qi was made Shaanxi governor.',
    'Ying Qi became Shaanxi governor.',
  ],
  s1558: [
    'On day gengzi, Sheng Bao memorialized recovery of Guantao.',
    'On gengzi day, Sheng Bao reported Guantao recovered.',
  ],
  s1559: [
    'On day xinchou, Jia Zhen and Li Shizhong were ordered to assist in Yuan Jiasan\'s military affairs.',
    'On xinchou day, Jia Zhen and Li Shizhong were ordered to assist Yuan Jiasan.',
  ],
  s1560: [
    'On day jiachen, Duolong\'a was ordered to assist in the military affairs of Guan Wen and Hu Linyi.',
    'On jiachen day, Duolong\'a was ordered to assist Guan Wen and Hu Linyi.',
  ],
  s1561: [
    'On day yisi, bandits took Zhejiang\'s Shouchang, Jinhua, Longyou, Tangxi, and Changxing, and advanced to take Lanxi and Wuyi.',
    'On yisi day, bandits took Shouchang, Jinhua, Longyou, Tangxi, and Changxing and pressed Lanxi and Wuyi.',
  ],
  s1562: [
    'An edict urgently ordered Zuo Zongtang to go to the rescue.',
    'Zuo Zongtang was urgently ordered to the rescue.',
  ],
  s1563: [
    'Sixth month, new moon on day wuwu, there was a solar eclipse.',
    'In month 6, wuwu new moon, there was a solar eclipse.',
  ],
  s1564: [
    'On day gengshen, Zeng Guofan and Hu Linyi memorialized: "Since our army has long besieged Anqing city, the rebel chieftain Chen Yucheng led his faction to return and relieve Anqing, and at Chigang Ridge outside Jixian Pass firmly built four forts.',
    'On gengshen day, Zeng Guofan and Hu Linyi reported Chen Yucheng relieving besieged Anqing with four forts at Chigang Ridge.',
  ],
  s1565: [
    'Bao Chao, Cheng Daji, and others joined Duolong\'a\'s cavalry forces in strenuous advance and suppression, bombarding day and night.',
    'Bao Chao, Cheng Daji, and Duolong\'a\'s cavalry bombarded the forts day and night.',
  ],
  s1566: [
    'On the first day of the fifth month, three forts all surrendered.',
    'On the fifth month\'s first day, three forts surrendered.',
  ],
  s1567: [
    'Coerced followers were released; long-haired old bandits were all executed according to law.',
    'Coerced men were freed; veteran long-haired rebels were executed.',
  ],
  s1568: [
    'The bandit Liu Canglin who held the first fort fled by night in stealth.',
    'Liu Canglin, who held the first fort, fled by night.',
  ],
  s1569: [
    'Bao Chao destroyed him at Mata Stone; the remainder were nearly all beheaded by the naval force, and Liu Canglin was verified, dismembered, and displayed as a warning.',
    'Bao Chao killed Liu Canglin at Mata Stone; the navy finished the rest and his body was dismembered for display.',
  ],
  s1570: [
    'The memorial received commendatory reply.',
    'The memorial won praise.',
  ],
  s1571: [
    'Prussia exchanged treaties and opened trade.',
    'Prussia concluded a treaty and opened trade.',
  ],
  s1572: [
    'On day xinyou, Russians were allowed to trade at Kulun and Kyakhta.',
    'On xinyou day, Russians were allowed trade at Kulun and Kyakhta.',
  ],
  s1573: [
    'On day yichou, the Directorate of Astronomy reported that on the first day of the eighth month the sun and moon would join in brilliance and the five planets would align in a pearl.',
    'On yichou day, the Astronomical Bureau reported a sun-moon conjunction and five-planet alignment on the eighth month\'s first day.',
  ],
  s1574: [
    'The memorial received reply: it need not be sent to the Historiography Office.',
    'The court said it need not go to the Historiography Office.',
  ],
  s1575: [
    'On day jiaxu, bandits took Zhejiang\'s Suichang, Songyang, and Yongkang.',
    'On jiaxu day, bandits took Suichang, Songyang, and Yongkang in Zhejiang.',
  ],
  s1576: [
    'On day bingzi, Muslim rebels raided Kashgar.',
    'On bingzi day, Muslim rebels raided Kashgar.',
  ],
  s1577: [
    'An edict ordered Jing Lian to go to Aksu for defense and suppression.',
    'Jing Lian was ordered to Aksu to defend and suppress them.',
  ],
  s1578: [
    'On day bingxu, Zhejiang government troops recovered Changxing.',
    'On bingxu day, Zhejiang troops retook Changxing.',
  ],
  s1579: [
    'Autumn, seventh month, day dinghai, an edict ordered that every autumn princes and nobles perform sacrifice at the two mausoleums; if rivers and mountains are in flood they may wait on the road until the way is clear, then proceed at once.',
    'In autumn, month 7, dinghai, princes were told to sacrifice at the two mausoleums each autumn, waiting on flooded roads if needed.',
  ],
  s1580: [
    'If the date arrives and they are not present, guardian beiles and dukes and the like shall perform the rites.',
    'Guardian beiles and dukes would perform the rites if princes could not arrive.',
  ],
  s1581: [
    'On day jiawu, Zeng Guofan memorialized recovery of Anhui Huizhou.',
    'On jiawu day, Zeng Guofan reported Huizhou recovered.',
  ],
  s1582: [
    'On day wuxu, a temple was granted to Yang Xin, Inner Palace Guard and Marquis Zhaoyong, who died in battle in Sichuan.',
    'On wuxu day, a temple was granted to Marquis Zhaoyong Yang Xin, killed in Sichuan.',
  ],
  s1583: [
    'On day xinchou, the Emperor was unwell.',
    'On xinchou day, the Emperor fell ill.',
  ],
  s1584: [
    'On day renyin, the Emperor grew gravely ill; princes and ministers were summoned to write vermilion rescripts, and the eldest imperial son was established as Crown Prince.',
    'On renyin day, the Emperor worsened; ministers wrote vermilion rescripts and the eldest son became Crown Prince.',
  ],
  s1585: [
    'On day guimao, the Emperor died at the traveling palace, aged thirty-one.',
    'On guimao day, the Emperor died at the traveling palace, aged thirty-one.',
  ],
  s1586: [
    'In the tenth month, the coffin was escorted to the capital.',
    'In the tenth month, the coffin was brought to the capital.',
  ],
  s1587: [
    'In the twelfth month, the posthumous honorific title was respectfully offered.',
    'In the twelfth month, the posthumous title was conferred.',
  ],
  s1588: [
    'In the ninth month of Tongzhi 4, burial at Ding Mausoleum.',
    'In Tongzhi 4, month 9, he was buried at Ding Mausoleum.',
  ],
  s1589: [
    'The commentators say: Wenzong met the yang-nine fate and personally endured the mingyi ordeal.',
    'The annalists say Wenzong met calamity and personally bore dark times.',
  ],
  s1590: [
    'Foreign powers pressed for treaties and internal disorders competed; in the blink of an eye one cycle passed without a single day\'s peace.',
    'Foreign coercion and internal revolt left not one peaceful day in a dozen years.',
  ],
  s1591: [
    'Yet he was able to employ worthies and promote talent, seeing clearly and responding broadly.',
    'Yet he employed worthies, promoted talent, and responded with broad vision.',
  ],
  s1592: [
    'In taxing the people he first cut vexatious exactions; in governing the army he carefully held the reins.',
    'He curbed harsh levies on the people and held the army with steady reins.',
  ],
  s1593: [
    'Assistants filled their posts, all stemming from the temple calculations.',
    'His ministers filled their posts, all chosen by statecraft from the temple.',
  ],
  s1594: [
    'Had he been granted full years on the throne, how could there have been the calamities that came after?',
    'Had he ruled a full span of years, how could later disasters have followed?',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b16.mjs <translation.json>'
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
