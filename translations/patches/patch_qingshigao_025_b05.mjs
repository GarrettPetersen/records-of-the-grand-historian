#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Rent and reed tax on Wenyi Isle in Shishou county, Hubei, were remitted.',
    'Shishou\'s Wenyi Isle rent and reed tax were remitted.',
  ],
  s0402: [
    'On day bingshen, Hunan governor Cen Chunmian was stripped of office.',
    'On bingshen day Cen Chunmian was stripped of the Hunan governorship.',
  ],
  s0403: [
    'Fifth month, day bingchen: the Alasuo inspector at Ningyuan, Sichuan, was raised to salt-front department pacification commissioner.',
    'Month 5, bingchen: Sichuan Ningyuan\'s Alasuo inspector became salt-front pacification commissioner.',
  ],
  s0404: [
    'On day wuwu, because Changde prefecture in Hunan suffered flood disaster, twenty thousand taels from the treasury were issued for relief.',
    'On wuwu day twenty thousand taels went to flood-stricken Changde, Hunan.',
  ],
  s0405: [
    'Li Jingxi memorialized that Zhenkang native prefecture under Yongchang, Yunnan, was converted to direct administration and Yongkang department was added.',
    'Li Jingxi reported Yunnan Zhenkang native rule converted to direct administration and Yongkang added.',
  ],
  s0406: [
    'Silver and grain taxes for drought-stricken Luliang prefecture, Yunnan, were remitted.',
    'Yunnan Luliang drought taxes were remitted.',
  ],
  s0407: [
    'On day xinyou, flood victims in Haizhou and elsewhere in northern Jiangsu were relieved.',
    'On xinyou day northern Jiangsu flood victims including Haizhou were relieved.',
  ],
  s0408: [
    'On day guihai, the Censorate forwarded on behalf of advisory-council member Sun Hongyi and others and representatives of banner households from all provinces a petition requesting rapid convocation of a national parliament.',
    'On guihai day the Censorate forwarded Sun Hongyi and provincial banner representatives\' petition for a swift parliament.',
  ],
  s0409: [
    'An edict still waited until the nine-year preparatory term was complete before fixing by edict the date for summoning members, which was proclaimed.',
    'The throne still waited for nine-year preparation before fixing parliament\'s date and proclaimed it.',
  ],
  s0410: [
    'On day jiazi, arrears in rent from Miao tenant farmers in Hunan were remitted, and accumulated garrison-rent grain in seven departments and counties—Fenghuang, Qianzhou, Yongshou, Baojing, Luxi, Mayang, and Guzhangping—was remitted.',
    'On jiazi day Hunan Miao tenants\' rent arrears and seven districts\' garrison grain arrears were remitted.',
  ],
  s0411: [
    'On day jisi, disaster in Hubei was relieved.',
    'On jisi day Hubei disaster victims were relieved.',
  ],
  s0412: [
    'On day xinwei, the Tongjiang river-defense subprefect in Fengtian was abolished.',
    'On xinwei day Fengtian\'s Tongjiang river-defense subprefect was abolished.',
  ],
  s0413: [
    'Sixth month, day renwu: because Heilongjiang suffered disaster, twenty thousand taels from the treasury were issued for relief.',
    'Month 6, renwu: twenty thousand taels went to Heilongjiang disaster relief.',
  ],
  s0414: [
    'On day yiyou, Wang Daxie presented books he had examined on British constitutional compilation.',
    'On yiyou day Wang Daxie presented books on British constitutional compilation.',
  ],
  s0415: [
    'On day jichou, Prince Zaixun, superintendent of naval affairs, was made a participant in government affairs.',
    'On jichou day naval superintendent Prince Zaixun joined government affairs.',
  ],
  s0416: [
    'On day renchen, Foreign Vice Minister Hu Weide was made co-superintendent of the Tax Bureau.',
    'On renchen day Hu Weide became tax co-superintendent.',
  ],
  s0417: [
    'On day bingshen, an edict: 「Provincial governors-general and governors labor at administration and urgently raise funds, yet constantly neglect inspecting officials.',
    'On bingshen day the throne said: 「Governors labor at rule and fund-raising yet neglect inspecting officials.',
  ],
  s0418: [
    'They do not know that if official governance is not repaired, then exhausting the people and injuring wealth will cause disorder to arise from this, and how can the new policies be carried out?',
    'Without sound officials, exhausting the people breeds disorder and new policies cannot proceed.',
  ],
  s0419: [
    'Each should carefully select magistrates and choose men for the locality—this is the supreme plan for pacifying the regions.',
    'Each must pick honest magistrates and fit men to places—the supreme plan for peace.',
  ],
  s0420: [
    '」On day wuxu, an edict ordered every ministry and provincial governor-general and governor strictly to impeach corrupt officials, and also instructed nobles and Chinese and foreign ministers at court to cultivate character, encourage conduct, and rectify themselves and their subordinates.',
    '」On wuxu day ministries and governors were ordered to impeach corrupt officials and nobles and ministers to rectify conduct.',
  ],
  s0421: [
    'On day jihai, Zaize and Shou Xun were ordered with A Mu\'erlinggui and Zairun to investigate the Vanguard Camp and the Three-Banner Guard of the Interior Ministry, draw up regulations, and report.',
    'On jihai day Zaize and Shou Xun with A Mu\'erlinggui and Zairun were to fix Vanguard and Interior Guard rules.',
  ],
  s0422: [
    'That month, gentry and commoners feuded at Laizhou, Shandong; bandit chief Qu Siwen gathered more than ten thousand men, besieged cities, killed officials and soldiers, and Haiyang also rose over grain-tax collection; both were soon pacified.',
    'That month Laizhou gentry feuded, Qu Siwen led ten thousand to besiege towns and kill troops, and Haiyang rose over taxes; both were pacified.',
  ],
  s0423: [
    'Seventh month, day jiachen: the Fujian grain-intendant circuit was abolished and an industrial promotion circuit was established.',
    'Month 7, jiachen: Fujian lost its grain intendant and gained an industrial circuit.',
  ],
  s0424: [
    'Rui Xing was dismissed; Zhirui was made Hangzhou general.',
    'Rui Xing left and Zhirui became Hangzhou general.',
  ],
  s0425: [
    'On day yisi, Rui Cheng and Yang Wendian memorialized that bandit power was spreading in Hunan and proposed implementing the village-pacification method; it was approved.',
    'On yisi day Rui Cheng and Yang Wendian proposed Hunan village pacification as bandits spread; approved.',
  ],
  s0426: [
    'On day wushen, an edict ordered the Ministry of Agriculture, Industry, and Commerce, together with governors-general and governors, to investigate mineral resources and plan opening them carefully.',
    'On wushen day Agriculture, Industry, and Commerce with governors were told to survey minerals and plan mines.',
  ],
  s0427: [
    'On day gengxu, an edict urged governors-general to compile registers of official and private waste land and of climate and soil suitability, promote crafts and practical enterprise, and report to the Ministry of Agriculture, Industry, and Commerce for memorial.',
    'On gengxu day governors were urged to map waste land and climate, promote crafts, and report to Agriculture.',
  ],
  s0428: [
    'On day renzi, the Ministry of Agriculture, Industry, and Commerce established a factory for manufacturing weights and measures.',
    'On renzi day Agriculture opened a weights-and-measures factory.',
  ],
  s0429: [
    'On day guichou, Prince Zaitao memorialized on inspecting foreign military administration: soldiers\' crimes were uniformly tried by military law councils and were not subject to ordinary courts.',
    'On guichou day Zaitao reported foreign armies try soldiers only in military courts, not civil ones.',
  ],
  s0430: [
    'An edict ordered this carried out.',
    'The throne ordered it carried out.',
  ],
  s0431: [
    'On day jiayin, Shixu and Wu Yusheng were removed from the Grand Council; Yulang and Xu Shichang were made Grand Councilors.',
    'On jiayin day Shixu and Wu Yusheng left the Grand Council; Yulang and Xu Shichang joined it.',
  ],
  s0432: [
    'Tang Shaoyi was ordered to act as Postal Minister.',
    'Tang Shaoyi acted as postal minister.',
  ],
  s0433: [
    'Yulang was relieved of the Metropolitan Garrison and the post of minister solely in charge of training the Imperial Guard.',
    'Yulang left the Metropolitan Garrison and sole Imperial Guard training.',
  ],
  s0434: [
    'Wu Zhen was ordered concurrently to act as commander of the Metropolitan Garrison.',
    'Wu Zhen concurrently acted as Metropolitan Garrison commander.',
  ],
  s0435: [
    'Foreign-affairs commissioners were established in each province.',
    'Each province gained a foreign-affairs commissioner.',
  ],
  s0436: [
    'Tian Xi, an officer of the Xinjiang land army camp, was executed for unauthorized killing that provoked mutiny.',
    'Xinjiang camp officer Tian Xi was executed for unauthorized killing that sparked mutiny.',
  ],
  s0437: [
    'On day bingchen, because southern Wan, Nanling, Suzhou, and Lingbi in Anhui suffered flood disaster, forty thousand taels from the treasury were issued for relief.',
    'On bingchen day forty thousand taels went to flooded southern Anhui.',
  ],
  s0438: [
    'On day dingsi, the Ministry of Justice submitted autumn-review articles.',
    'On dingsi day Justice sent up autumn-review articles.',
  ],
  s0439: [
    'On day gengshen, former Jiangxi education commissioner and Zhejiang railway superintendent Tang Shouqian was stripped of office for impeaching Sheng Xuanhuai as chief culprit of the Jiangsu-Zhejiang railway affair.',
    'On gengshen day Tang Shouqian lost office for attacking Sheng Xuanhuai over the Jiangsu-Zhejiang railway.',
  ],
  s0440: [
    'On day xinyou, famine victims in northern Anhui were relieved.',
    'On xinyou day northern Anhui famine victims were relieved.',
  ],
  s0441: [
    'Zhong Rui was made commissioner at Kobdo.',
    'Zhong Rui became Kobdo commissioner.',
  ],
  s0442: [
    'Lian Kui was dismissed as Xinjiang governor; He Yansheng replaced him.',
    'Lian Kui left Xinjiang and He Yansheng replaced him.',
  ],
  s0443: [
    'Provincial surveillance commissioners were changed to judicial commissioners.',
    'Provincial surveillance commissioners became judicial commissioners.',
  ],
  s0444: [
    'On day jiazi, Grand Secretary Lu Chuanlin died; he was posthumously made Grand Tutor, entered the Shrine of Eminent Statesmen, and given silver for the funeral.',
    'On jiazi day Lu Chuanlin died and received posthumous Grand Tutor rank, eminent-statesmen shrine, and funeral silver.',
  ],
  s0445: [
    'On day yichou, Foreign Ministry counsellor Shen Ruilin was made envoy to Austria, and Foreign Vice Minister Liu Yulin full commissioner to the Dutch international anti-opium congress.',
    'On yichou day Shen Ruilin became envoy to Austria and Liu Yulin commissioner to the Dutch anti-opium congress.',
  ],
  s0446: [
    'On day wuchen, Huludao port in Fengtian was opened.',
    'On wuchen day Fengtian\'s Huludao port opened.',
  ],
  s0447: [
    'On day jisi, a direct subprefect was established at Nehe, Heilongjiang.',
    'On jisi day Heilongjiang gained a Nehe direct subprefect.',
  ],
  s0448: [
    'That month, Zaixun and Sa Zhenbing again went to the United States and Japan to inspect the navy.',
    'That month Zaixun and Sa Zhenbing again inspected navies in America and Japan.',
  ],
  s0449: [
    'Eighth month, day jiaxu: Zhendong county was established in Fengtian.',
    'Month 8, jiaxu: Fengtian gained Zhendong county.',
  ],
  s0450: [
    'On day yihai, Qing Rui was dismissed; Tie Liang was made Jiangning general.',
    'On yihai day Qing Rui left and Tie Liang became Jiangning general.',
  ],
  s0451: [
    'On day guiwei, Shen Jiaben was made vice-president of the Advisory Council.',
    'On guiwei day Shen Jiaben became Advisory Council vice-president.',
  ],
  s0452: [
    'On day jiashen, Foreign Vice Minister Liu Yulin was made envoy to Britain.',
    'On jiashen day Liu Yulin became envoy to Britain.',
  ],
  s0453: [
    'On day dinghai, the Court of Colonial Affairs memorialized relaxing old rules forbidding cultivation beyond the frontier, Han men marrying Mongol women, hiring inland clerks and teachers in Inner and Outer Mongolia, using Chinese in official documents, and Mongol use of Chinese characters in naming; it was approved.',
    'On dinghai day Colonial Affairs relaxed frontier-cultivation, marriage, clerk, document, and naming bans for Mongolia; approved.',
  ],
  s0454: [
    'Zhaojue county was added in Sichuan.',
    'Sichuan gained Zhaojue county.',
  ],
  s0455: [
    'On day jichou, Lian Fang was dismissed; Feng Shan was made Jingzhou general.',
    'On jichou day Lian Fang left and Feng Shan became Jingzhou general.',
  ],
  s0456: [
    'Yin Chang was ordered concurrently to train the metropolitan-area army divisions.',
    'Yin Chang concurrently trained metropolitan-area divisions.',
  ],
  s0457: [
    'On day jiazi, the metropolitan-area land army divisions were all placed under Army Ministry jurisdiction.',
    'On jiazi day metropolitan land divisions came under the Army Ministry.',
  ],
  s0458: [
    'The metropolitan training office was abolished.',
    'The metropolitan training office was abolished.',
  ],
  s0459: [
    'A Fengtian salt transport commissioner was added.',
    'Fengtian gained a salt transport commissioner.',
  ],
  s0460: [
    'The Sichuan salt-tea circuit was changed to salt transport commissioner, and tea affairs were placed under the industrial promotion circuit.',
    'Sichuan\'s salt-tea circuit became salt transport and tea went to the industrial circuit.',
  ],
  s0461: [
    'On day yiwei, because memorials on prohibiting opium cultivation were cosmetic, governors-general of Jilin, Heilongjiang, Henan, Shanxi, Fujian, Guangxi, Yunnan, and Xinjiang were ordered to deliberate in council and all provinces were again sternly forbidden to plant.',
    'On yiwei day eight provinces\' cosmetic anti-opium reports drew council review and a renewed planting ban.',
  ],
  s0462: [
    'On day bingwu, Xu Shichang was made Grand Secretary of the Tiren Hall, and Minister of Personnel Li Dianlin Associate Grand Secretary.',
    'On bingwu day Xu Shichang became Tiren grand secretary and Li Dianlin associate grand secretary.',
  ],
  s0463: [
    'On day dingyou, because the Gorkha king Birendrabir Bikram Shah Dev had refused Tibet\'s request for troops, he was commended by edict.',
    'On dingyou day the Gorkha king was commended for refusing Tibet troops.',
  ],
  s0464: [
    'On day gengzi, flood victims in Hua and Weinan prefectures, Shaanxi, were relieved.',
    'On gengzi day Shaanxi Hua and Weinan flood victims were relieved.',
  ],
  s0465: [
    'Ninth month, new moon on day xinchou: the Advisory Council held its opening ceremony; the Prince Regent attended and issued an admonitory address.',
    'Month 9, xinchou new moon: the Advisory Council opened; the Prince Regent attended and lectured.',
  ],
  s0466: [
    'On day renyin, four hundred fifty-nine returned students including Wu Naichen were granted jinshi and juren in letters, medicine, natural science, agriculture, engineering, commerce, and law in varying degrees.',
    'On renyin day four hundred fifty-nine returned students received graded jinshi and juren.',
  ],
  s0467: [
    'On day guimao, grain, fodder, and straw taxes on disaster-stricken land last year in nine departments and prefectures in Gansu—He, Jin, Weiyuan, Fuqiang, Anding, Huining, Ningling, Xunhua, and Qin—were remitted.',
    'On guimao day nine Gansu districts\' last-year disaster land taxes were remitted.',
  ],
  s0468: [
    'On day bingwu, because Xuzhou and other districts in northern Jiangsu suffered rain flood, the Revenue Board was ordered to issue treasury funds for relief.',
    'On bingwu day Revenue was told to fund northern Jiangsu rain-flood relief.',
  ],
  s0469: [
    'On day yisi, acting Suiyuan garrison general and superintendent of reclamation Xin Qin was relieved for illness; Kun Xiu replaced him.',
    'On yisi day acting Suiyuan general Xin Qin left for illness and Kun Xiu replaced him.',
  ],
  s0470: [
    'Kui Fang was made Urga general.',
    'Kui Fang became Urga general.',
  ],
  s0471: [
    'On day wushen, the Revenue Board was again ordered to issue twenty thousand taels for northern Anhui disaster.',
    'On wushen day Revenue issued another twenty thousand taels to northern Anhui.',
  ],
  s0472: [
    'On day renzi, because the situation in Shanghai was critical, Zhang Renjun requested a foreign loan with discretion and transport of five hundred thousand taels from the treasury; it was approved.',
    'On renzi day Zhang Renjun\'s Shanghai crisis loan and five hundred thousand taels transport were approved.',
  ],
  s0473: [
    'On day guichou, the Yongding River ran clear.',
    'On guichou day the Yongding ran clear.',
  ],
  s0474: [
    'Flood victims in Zizhu and other departments and counties in Sichuan were relieved.',
    'Sichuan flood victims in Zizhu and other districts were relieved.',
  ],
  s0475: [
    'On day jiayin, the Hailong hunting-ground superintendent was abolished.',
    'On jiayin day the Hailong hunting-ground superintendent was abolished.',
  ],
  s0476: [
    'On day bingchen, an edict ordered all provinces to recommend men of eminent integrity and upright conduct, with strict selection.',
    'On bingchen day provinces were told to recommend eminent men under strict selection.',
  ],
  s0477: [
    'On day jiwei, the facts in the case of Shandong Tangyi beggar Wu Xun, who amassed wealth to found schools, were ordered entered in the histories.',
    'On jiwei day Wu Xun of Tangyi, who begged to fund schools, entered the histories.',
  ],
  s0478: [
    'The Changde prefectural subprefect and the Chang\'an garrison subprefect in Baoding prefecture, Hunan, were abolished.',
    'Hunan lost Changde\'s subprefect and Baoding\'s Chang\'an garrison subprefect.',
  ],
  s0479: [
    'On day guihai, an edict said Suiyuan reclamation was urgent; officials from frontier circuits and departments downward concerned with reclamation were all subject to the reclamation superintendent.',
    'On guihai day Suiyuan reclamation officials were placed under the reclamation superintendent.',
  ],
  s0480: [
    'On day bingyin, Yang Shu was relieved for illness; Agriculture Vice Minister Li Guojie was made envoy to Belgium.',
    'On bingyin day Yang Shu left for illness and Li Guojie became envoy to Belgium.',
  ],
  s0481: [
    'Heilongjiang flood victims were relieved.',
    'Heilongjiang flood victims were relieved.',
  ],
  s0482: [
    'On day dingmao, Yuan Shuxun was relieved for illness; Zhang Mingqi was ordered to act as governor-general of the two Guangs.',
    'On dingmao day Yuan Shuxun left for illness and Zhang Mingqi acted as two-Guangs governor-general.',
  ],
  s0483: [
    'Shen Bingkan was made Yunnan governor.',
    'Shen Bingkan became Yunnan governor.',
  ],
  s0484: [
    'On day wuchen, Guizhou brigade generals, colonels, lieutenant colonels, and majors were abolished.',
    'On wuchen day Guizhou brigade through major posts were abolished.',
  ],
  s0485: [
    'Popular arrears in grain taxes and seed grain in eleven departments and counties including Dihua, Xinjiang, were remitted.',
    'Eleven Xinjiang districts\' popular tax and seed arrears were remitted.',
  ],
  s0486: [
    'Tenth month, day guiyou: an edict changed opening of the national parliament to the fifth year of Xuantong; because governors-general of all provinces had often spoken on it, and in accordance with the petition of people\'s representatives from the Shuntian and Zhili advisory councils requesting the original rapid opening, this order was issued.',
    'Month 10, guiyou: parliament was moved to Xuantong 5 after governors and Zhili representatives pressed for earlier opening.',
  ],
  s0487: [
    'On day jiaxu, Pulun and Zaize were made ministers drafting the constitution.',
    'On jiaxu day Pulun and Zaize drafted the constitution.',
  ],
  s0488: [
    'On day yihai, the Yellow River ran clear.',
    'On yihai day the Yellow River ran clear.',
  ],
  s0489: [
    'On day dingchou, bandit disorder at Cenxi, Guangxi, was suppressed by government troops; bandit chief Chen Rong\'an was executed.',
    'On dingchou day Guangxi Cenxi bandits were suppressed and chief Chen Rong\'an executed.',
  ],
  s0490: [
    'Cheng Wenbing died; Cheng Yunhe was made Yangtze naval commander, and Gansu provincial commander Zhang Xun was ordered to take over all camps at Pukou south of the Yangtze in Jiangnan.',
    'Cheng Wenbing died; Cheng Yunhe became Yangtze naval commander and Zhang Xun took Jiangnan Pukou camps.',
  ],
  s0491: [
    'Silver and grain for Lingzhou flood disaster in Gansu were remitted.',
    'Gansu Lingzhou flood silver and grain were remitted.',
  ],
  s0492: [
    'On day gengchen, Zeng Yun memorialized that Zhejiang\'s Green Standard was abolished and reorganized as a naval force.',
    'On gengchen day Zeng Yun reported Zhejiang\'s Green Standard abolished and reorganized as navy.',
  ],
  s0493: [
    'On day xinsi, an edict said that because opening parliament in the fifth year of Xuantong had been shortened, each supervising office was charged earnestly to prepare; the ministries of civil affairs, revenue, justice, and education all bore responsibility and were to plan comprehensively in advance, distinguishing essentials from secondary matters, and report in detail.',
    'On xinsi day the throne, having moved parliament to Xuantong 5, charged ministries to plan essentials and secondaries in detail.',
  ],
  s0494: [
    'It also admonished provincial governors-general to steel their spirits, carry this out in earnest, and not again procrastinate and shirk duty, thereby missing the deadline.',
    'Governors were admonished to act earnestly and not miss the deadline.',
  ],
  s0495: [
    'On day renwu, He Yansheng died; Yuan Dahua was made Xinjiang governor.',
    'On renwu day He Yansheng died and Yuan Dahua became Xinjiang governor.',
  ],
  s0496: [
    'On day wuxu, a shrine was granted to the late Grand Secretary and former acting governor-general of the two Guangs Zhang Zhidong in Jiangning province.',
    'On wuxu day late Zhang Zhidong received a Jiangning shrine.',
  ],
  s0497: [
    'Eleventh month, day guimao: the army minister, vice minister, and left and right directors and counsellors were abolished; one army minister and one vice minister were established.',
    'Month 11, guimao: army minister, vice minister, directors, and counsellors were abolished for one minister and one vice minister.',
  ],
  s0498: [
    'A Navy Ministry was established, with one navy minister and one vice minister.',
    'A Navy Ministry was created with one minister and one vice minister.',
  ],
  s0499: [
    'Yin Chang was made army minister and Shou Xun vice minister.',
    'Yin Chang became army minister and Shou Xun vice minister.',
  ],
  s0500: [
    'Prince Zaixun was navy minister and Tan Xueheng vice minister.',
    'Prince Zaixun became navy minister and Tan Xueheng vice minister.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b05.mjs <translation.json>'
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
