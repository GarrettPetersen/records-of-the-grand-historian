#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Second month, day wuzi: Yi bandits at Muping were executed.',
    'In month 2, wuzi, Muping Yi bandits were put to death.',
  ],
  s0202: [
    'On day jichou, an imperial instruction was sent to all provinces to reclaim wasteland, ban armed brawls, be cautious in impeachments, and rectify military regulations.',
    'On jichou, provinces were told to reclaim land, ban brawls, watch impeachments, and fix camp rules.',
  ],
  s0203: [
    'Famine relief was granted to returned native-place refugees in Zhili, Shandong, Shanxi, Henan, Anhui, Jiangxi, and Fujian.',
    'Zhili, Shandong, Shanxi, Henan, Anhui, Jiangxi, and Fujian received relief for returned famine refugees.',
  ],
  s0204: [
    'On day jihai, overdue taxes in Hubei were remitted.',
    'On jihai, Hubei arrears were forgiven.',
  ],
  s0205: [
    'On day gengzi, an imperial edict stated: "With the coffin still in mourning and the Emperor in tender years, apart from great court congratulatory ceremonies, bestowals, celebrations, banquets, and receptions of foreign envoys are temporarily suspended."',
    'On gengzi, an edict suspended most celebrations while the coffin lay in state and the Emperor was young.',
  ],
  s0206: [
    'On day xinchou, Huai salt certificate lands were restored.',
    'On xinchou, Huai salt certificate lands were restored.',
  ],
  s0207: [
    'On day renyin, the Ministry of Justice reversed the case of the Zhejiang commoner Ge Pinlian; Governor-General Yang Changjun and Vice Minister Hu Ruidun were dismissed from office, and the prefect and subordinates were punished according to their guilt.',
    'On renyin, Ge Pinlian\'s case was reversed; Yang Changjun and Hu Ruidun lost office and lower officials were punished.',
  ],
  s0208: [
    'An instruction was sent to all provinces on criminal adjudication, requiring truth in facts and fitness in punishment and forbidding rashness.',
    'Provinces were told to judge cases carefully and not act rashly.',
  ],
  s0209: [
    'Third month, new moon on day dingwei: the Emperor ended mourning dress.',
    'In month 3, dingwei new moon, the Emperor left mourning dress.',
  ],
  s0210: [
    'Because the imperial tomb was not yet settled, palace feasts and theatrical performances remained forbidden.',
    'With the tomb unsettled, palace feasts and opera stayed banned.',
  ],
  s0211: [
    'On day xinwei, grain and land tax were remitted for three years in flood-stricken Huayin.',
    'On xinwei, Huayin flood districts were exempted three years\' grain and land tax.',
  ],
  s0212: [
    'On day guiyou, Liu Xihong was appointed envoy to Germany.',
    'On guiyou, Liu Xihong was made envoy to Germany.',
  ],
  s0213: [
    'Disaster relief was granted to the people of Shuyang.',
    'Shuyang disaster victims received relief.',
  ],
  s0214: [
    'On day xinsi, miscellaneous levies under Taiwan Prefecture were abolished and famine relief was granted to hungry aborigines in the inner mountains.',
    'On xinsi, Taiwan levies were cut and inner-mountain aborigines were fed.',
  ],
  s0215: [
    'Summer, fourth month, day xinmao: the regular rain sacrifice was performed; Heaven was worshipped at the Circular Mound.',
    'In summer, month 4, xinmao, the rain sacrifice was held at the Circular Mound.',
  ],
  s0216: [
    'On day jiawu, naked Yi of Mabian joined wild and Black Yi in raids; Kuiyu and others suppressed them.',
    'On jiawu, Mabian Yi joined other tribes in raids and Kuiyu suppressed them.',
  ],
  s0217: [
    'On day yiwei, overdue taxes for flood-stricken Ling county were remitted.',
    'On yiwei, Ling county flood arrears were forgiven.',
  ],
  s0218: [
    'On day wuxu, Liu Jintang and others took Qiketengmu and Pizhan and recovered the Manchu and Han quarters of Turpan.',
    'On wuxu, Liu Jintang took Qiketengmu and Pizhan and recovered Turpan.',
  ],
  s0219: [
    'Soon afterward Dabancheng and the Toksun rebel forts were taken, and the Andijan khan Pasha killed himself.',
    'Dabancheng and Toksun fell next, and the Andijan khan Pasha committed suicide.',
  ],
  s0220: [
    'On day jihai, Commander Zhang Qiguang attacked the Shu Mang aborigine community in Taiwan and took it.',
    'On jihai, Zhang Qiguang took Taiwan\'s Shu Mang community.',
  ],
  s0221: [
    'On day gengzi, seed-grain silver was loaned to banner households in Yizhou.',
    'On gengzi, Yizhou banner households received seed loans.',
  ],
  s0222: [
    'On day xinchou, relief was granted for the Guiyang earthquake disaster.',
    'On xinchou, Guiyang earthquake victims were relieved.',
  ],
  s0223: [
    'On day renyin, bandits arose in Zhaotong and Guangnan; government troops suppressed them.',
    'On renyin, Zhaotong and Guangnan bandits were put down.',
  ],
  s0224: [
    'On day guimao, because disaster areas had deferred levies yet clerks still committed fraud, all provinces were instructed to rectify matters.',
    'On guimao, provinces were told to stop clerical fraud in disaster tax relief.',
  ],
  s0225: [
    'Wei Puxie, an enrolled student of Gaoyou who loved poverty and the Way, was commended.',
    'Gaoyou student Wei Puxie, poor yet devoted to learning, was honored.',
  ],
  s0226: [
    'On day jiachen, Vietnam sent envoys with local products, and the king was rewarded with satin.',
    'On jiachen, Vietnam presented tribute and its king received satin.',
  ],
  s0227: [
    'On day gengxu, Wang Renkan and three hundred twenty-nine others were granted jinshi degrees and appointment with distinctions.',
    'On gengxu, Wang Renkan and 329 others received jinshi with distinctions.',
  ],
  s0228: [
    'That month, locusts struck Jiangsu and Anhui.',
    'That month, Jiangsu and Anhui had locusts.',
  ],
  s0229: [
    'Fifth month, day wuchen: Japan blocked Ryukyu from presenting tribute, and the envoy was sent home.',
    'In month 5, wuchen, Japan barred Ryukyu tribute and sent the envoy back.',
  ],
  s0230: [
    'On day guiyou, because Shanxi was in drought, two hundred thousand taels of capital grain funds were retained for relief.',
    'On guiyou, 200,000 taels of capital grain funds were kept for drought-stricken Shanxi.',
  ],
  s0231: [
    'On day jiaxu, Wang Shanzang and others of the Jianli secret society rebelled and were executed.',
    'On jiaxu, Jianli secret-society leader Wang Shanzang and others were executed.',
  ],
  s0232: [
    'One million two hundred thousand taels of treasury silver were allocated to the Western Expedition grain bureau.',
    '1.2 million taels were sent to the Western Expedition grain bureau.',
  ],
  s0233: [
    'On day wuyin, flood relief was granted for Fuzhou.',
    'On wuyin, Fuzhou flood victims were relieved.',
  ],
  s0234: [
    'On day renwu, an imperial edict held that because the Emperor\'s birthday fell in a fasting period, the congratulatory ceremony was fixed for the twenty-sixth day of the sixth month as a standing rule.',
    'On renwu, the birthday celebration was moved to the sixth month, day 26, because of fasting.',
  ],
  s0235: [
    'In the great Shanxi drought, Governor Zeng Guoquan asked that a plaque be issued for prayer.',
    'Governor Zeng Guoquan sought a prayer plaque for Shanxi\'s drought.',
  ],
  s0236: [
    'It was not permitted, as there was no precedent.',
    'The request was denied for lack of precedent.',
  ],
  s0237: [
    'An edict stated: "Prayer lies only in sincerity; officials should diligently seek good governance, clear ordinary lawsuits, and thereby welcome timely rain."',
    'An edict said sincere prayer required good government and cleared lawsuits.',
  ],
  s0238: [
    '"',
    '"',
  ],
  s0239: [
    'Sixth month, day wuzi: an edict recognized the son of Gonggarinchen, Robzangtabkejamco, as the Dalai Lama\'s Hubilgan without drawing lots from the golden urn.',
    'In month 6, wuzi, Robzangtabkejamco was recognized as Dalai Lama without the golden urn.',
  ],
  s0240: [
    'On day xinmao, the North River dike in Guangdong burst and Lianzhou suffered great flood; disaster victims were ordered relieved.',
    'On xinmao, Guangdong\'s North River dike broke; Lianzhou was flooded and victims relieved.',
  ],
  s0241: [
    'On day wuxu: earlier, on the placement of Muzong\'s spirit tablets in the Ancestral Temple, an imperial edict had ordered high ministers to confer; Prince Chun again asked for a long-term plan; Junior Mentor Wen Zhi, Director of Ceremonies Xu Shuming, Vice Minister Wen Shuo, Hanlin Reader Zhong Peixian, and Academician Baoting all submitted memorials.',
    'On wuxu, memorials on Muzong\'s temple placement came from Prince Chun, Wen Zhi, Xu Shuming, and others.',
  ],
  s0242: [
    'At this time, grand secretaries were again ordered to deliberate fully and report, and Li Hongzhang was also ordered to work out a proper plan.',
    'Grand secretaries and Li Hongzhang were ordered to report a proper plan.',
  ],
  s0243: [
    'On day bingwu, because calamities recurred, officials were admonished to repent and reform.',
    'On bingwu, recurring calamities brought an admonition to officials to reform.',
  ],
  s0244: [
    'On day gengxu, on the Emperor\'s birthday, he received congratulations in the Palace of Heavenly Purity.',
    'On gengxu, the Emperor\'s birthday was celebrated at the Qianqing Palace.',
  ],
  s0245: [
    'Seventh month, day dingsi: coastal defense funds were allocated to aid Shanxi relief.',
    'In month 7, dingsi, coastal defense funds aided Shanxi relief.',
  ],
  s0246: [
    'On day jiwei, Prince Dun and others reported on the placement of Muzong\'s imperial and empress spirit tablets, proposing four bays east and west in the central hall of the Ancestral Temple, following the Daoguang precedent of adding niches behind the Hall of Imperial Ancestors, with repairs and redecoration, and accepting Prince Chun\'s request that hereafter the rule of "not removed for a hundred generations" not be invoked.',
    'On jiwei, Prince Dun proposed Muzong\'s tablets in the central temple hall and rejected the hundred-generation rule.',
  ],
  s0247: [
    'On day wuchen, thirty percent of the assessed land tax was remitted for disaster counties including Jiangning and Shangyuan.',
    'On wuchen, Jiangning and Shangyuan disaster counties lost thirty percent of land tax.',
  ],
  s0248: [
    'On day jisi, capital grain funds and canal conversion silver were retained to relieve famine in Henan.',
    'On jisi, capital grain and canal silver were kept for Henan famine relief.',
  ],
  s0249: [
    'Eighth month, day dinghai: all provinces were instructed to repair agricultural irrigation works.',
    'In month 8, dinghai, provinces were told to repair irrigation.',
  ],
  s0250: [
    'On day renchen, one hundred thousand taels of Tianjin training pay were allocated to aid Shanxi relief.',
    'On renchen, 100,000 taels of Tianjin training funds aided Shanxi.',
  ],
  s0251: [
    'On day jiawu, Taiwan\'s Tongzhi tenth-year grain tribute and rice converted to grain were remitted.',
    'On jiawu, Taiwan\'s Tongzhi tenth-year tribute grain was forgiven.',
  ],
  s0252: [
    'On day gengzi, Liu Kunyi and others were instructed to rectify police affairs in Guangdong.',
    'On gengzi, Liu Kunyi was told to fix Guangdong policing.',
  ],
  s0253: [
    'On day wushen, four hundred thousand taels were allocated to relieve disasters in Shanxi and Henan, and forty thousand piculs each of Jiang\'an canal grain were retained for shipment to Shanxi and Henan as relief reserve.',
    'On wushen, 400,000 taels and 40,000 piculs each of canal grain were set aside for Shanxi and Henan.',
  ],
  s0254: [
    'Ninth month, day jiayin: bandit chief Chen Zi\'ao of Luotian was executed.',
    'In month 9, jiayin, Luotian bandit Chen Zi\'ao was executed.',
  ],
  s0255: [
    'On day wuwu, former Vice Minister Yan Jingming was ordered to Shanxi to inspect relief.',
    'On wuwu, Yan Jingming was sent to inspect Shanxi relief.',
  ],
  s0256: [
    'On day jiwei, opium planting in Shanxi was again forbidden and mulberry and cotton planting was urged instead.',
    'On jiwei, Shanxi was told to stop opium and plant mulberry and cotton.',
  ],
  s0257: [
    'On day xinyou, eighty thousand piculs each of Shandong winter canal grain were allocated to continue relief in Shanxi and Henan.',
    'On xinyou, 80,000 piculs each of Shandong canal grain continued Shanxi and Henan relief.',
  ],
  s0258: [
    'On day jiazi, the Han scholar Prince Xian of Hejian, Liu De, was admitted to posthumous worship in the Confucian temple.',
    'On jiazi, Liu De, Prince Xian of Hejian, entered the Confucian temple.',
  ],
  s0259: [
    'On day yichou, an edict sought frank memorials.',
    'On yichou, frank memorials were requested.',
  ],
  s0260: [
    'On day dingmao, Li Henian was ordered to Henan to inspect relief.',
    'On dingmao, Li Henian was sent to inspect Henan relief.',
  ],
  s0261: [
    'On day wuchen, coordinated Western Expedition military pay due from Shanxi and Henan was reduced or deferred.',
    'On wuchen, Shanxi and Henan Western Expedition contributions were eased.',
  ],
  s0262: [
    'On day gengchen, additional grain relief was granted to disaster victims in counties including Xiangfu.',
    'On gengchen, Xiangfu and other counties received added grain relief.',
  ],
  s0263: [
    'On day xinsi, typhoon disaster relief was granted in Xinghua Prefecture and its subordinates.',
    'On xinsi, Xinghua typhoon victims were relieved.',
  ],
  s0264: [
    'Winter, tenth month, day renchen: hail disaster relief was granted at Sanxing.',
    'In winter, month 10, renchen, Sanxing hail victims were relieved.',
  ],
  s0265: [
    'On day gengzi, all provinces were instructed to settle transplanted famine refugees.',
    'On gengzi, provinces were told to settle wandering famine refugees.',
  ],
  s0266: [
    'On day jiachen, silver and grain were remitted for disaster at Sanxing.',
    'On jiachen, Sanxing disaster taxes and grain were forgiven.',
  ],
  s0267: [
    'Additional grain relief was granted to disaster victims in counties including Yangqu.',
    'Yangqu and other counties received added grain relief.',
  ],
  s0268: [
    'On day yisi, additional porridge kitchens were established in the inner city.',
    'On yisi, more inner-city porridge kitchens were opened.',
  ],
  s0269: [
    'On day gengxu, Liu Jintang reported recovery of Karashahr and Kucha; soon Aksu and Wushi were also recovered.',
    'On gengxu, Liu Jintang recovered Karashahr and Kucha, then Aksu and Wushi.',
  ],
  s0270: [
    'Eleventh month, day guichou: an edict warned all ministries and boards against laxity and procrastination.',
    'In month 11, guichou, ministries were warned against delay and neglect.',
  ],
  s0271: [
    'On day yimao, Shandong opened a new canal transport route.',
    'On yimao, Shandong opened a new grain canal.',
  ],
  s0272: [
    'On day dingsi, governors, governors-general, and metropolitan magistrates were instructed to pursue good official governance.',
    'On dingsi, governors and metropolitan officials were told to improve governance.',
  ],
  s0273: [
    'Twelfth month, day xinmao: Hezhe tribute sable furs were deferred.',
    'In month 12, xinmao, Hezhe sable tribute was deferred.',
  ],
  s0274: [
    'On day gengzi, next year\'s grain tax was pre-remitted for disaster prefectures and counties in Shanxi and Henan.',
    'On gengzi, next year\'s grain tax was forgiven in disaster areas of Shanxi and Henan.',
  ],
  s0275: [
    'That winter, snow was repeatedly prayed for.',
    'That winter, repeated prayers were made for snow.',
  ],
  s0276: [
    'One hundred twenty thousand piculs of next year\'s Jiangsu and Hubei canal rice were allocated to relieve Shanxi, and treasury funds were issued to relieve Shaanxi.',
    '120,000 piculs of Jiang-Hubei canal rice aided Shanxi, and treasury funds aided Shaanxi.',
  ],
  s0277: [
    'That year, great drought struck Shanxi and Shaanxi, and people ate one another.',
    'That year, Shanxi and Shaanxi drought drove people to cannibalism.',
  ],
  s0278: [
    'In the fourth year, wuyin, spring, first month, day xinwei: famine relief was granted in Henan.',
    'Year 4, spring 1, xinwei: Henan famine victims were relieved.',
  ],
  s0279: [
    'Guo Songtao was additionally appointed envoy to France.',
    'Guo Songtao was also made envoy to France.',
  ],
  s0280: [
    'The Western army recovered Yarkand and Kashgar, and the people of Khotan submitted.',
    'Yarkand and Kashgar were recovered and Khotan submitted.',
  ],
  s0281: [
    'On day jimao, all provinces were instructed to clear lawsuits.',
    'On jimao, provinces were told to clear lawsuits.',
  ],
  s0282: [
    'Second month, new moon on day xinsi: the Dujiangyan works at Chengdu were repaired.',
    'In month 2, xinsi new moon, Chengdu\'s Dujiangyan was repaired.',
  ],
  s0283: [
    'On day renwu, northern water conservancy was urged.',
    'On renwu, northern irrigation works were urged.',
  ],
  s0284: [
    'On day yiyou, Acting Vice Minister of War Wang Wenshao was appointed Grand Councilor.',
    'On yiyou, Wang Wenshao became Grand Councilor.',
  ],
  s0285: [
    'On day gengyin, magistrates who truly carried out famine relief were to be recommended.',
    'On gengyin, magistrates who truly relieved famine were to be commended.',
  ],
  s0286: [
    'On day renchen, Xinjiang was pacified; bandit chief Bai Yanhu fled into Russia.',
    'On renchen, Xinjiang was pacified and Bai Yanhu fled to Russia.',
  ],
  s0287: [
    'Merit was discussed: Zuo Zongtang was promoted to secondary marquis; Liu Jintang to secondary baron; Grand Commander Yu Hu\'en and others received hereditary ranks with distinctions.',
    'For merit, Zuo Zongtang became a secondary marquis, Liu Jintang a secondary baron, and Yu Hu\'en and others received hereditary ranks.',
  ],
  s0288: [
    'On day jiawu, ordinary prisons were to be cleared.',
    'On jiawu, ordinary prisons were to be cleared.',
  ],
  s0289: [
    'On day dingyou, disaster relief was granted for Hulan.',
    'On dingyou, Hulan disaster victims were relieved.',
  ],
  s0290: [
    'On day jihai, a self-reproach edict was issued.',
    'On jihai, the Emperor issued a self-reproach edict.',
  ],
  s0291: [
    'Famine relief was granted in Shanxi and Henan.',
    'Shanxi and Henan famine victims were relieved.',
  ],
  s0292: [
    'On day bingwu, unburied corpses in disaster areas were interred.',
    'On bingwu, disaster-area corpses were buried.',
  ],
  s0293: [
    'On day gengxu, poll tax and grain levies were remitted for flood-stricken Houguan.',
    'On gengxu, Houguan flood poll tax was forgiven.',
  ],
  s0294: [
    'Third month, day jiayin: disaster provinces were instructed to trial the zone-field method.',
    'In month 3, jiayin, disaster provinces were told to trial zone-field farming.',
  ],
  s0295: [
    'On day renshen, famine relief was granted in Zhili, and three thousand horses from Chahar herds were allocated to poor people for farming.',
    'On renshen, Zhili was relieved and 3,000 Chahar horses were given poor farmers.',
  ],
  s0296: [
    'On day jiaxu, the Imperial Household Department was instructed to reduce expenses and cut inflated claims.',
    'On jiaxu, the Imperial Household was told to cut costs and fraud.',
  ],
  s0297: [
    'On day wuyin, Ying Gui retired from office.',
    'On wuyin, Ying Gui retired.',
  ],
  s0298: [
    'That month, rain fell in Henan.',
    'That month, Henan had rain.',
  ],
  s0299: [
    'Fourth month, day renwu: Shen Baozhen memorialized to abolish the military examination; it was rejected.',
    'In month 4, renwu, Shen Baozhen\'s plea to end military exams was rejected.',
  ],
  s0300: [
    'On day renchen, wind disaster relief was granted in Guangdong.',
    'On renchen, Guangdong wind disaster victims were relieved.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b03.mjs <translation.json>'
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
