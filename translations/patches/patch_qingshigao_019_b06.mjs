#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'That month, flood relief was given to Xining county, Gansu.',
    'That month, Gansu\'s Xining county received flood relief.',
  ],
  s0502: [
    'Collection of quota levies was deferred for six flooded Shandong counties including Le\'an, and stove tax was deferred for four salt fields including Yongli.',
    'Quota levies were deferred for Le\'an and five other flooded Shandong counties and for stove tax at Yongli and three other salt fields.',
  ],
  s0503: [
    'Ninth month, new moon on day dingchou: solar eclipse.',
    'At the ninth-month new moon, dingchou, there was a solar eclipse.',
  ],
  s0504: [
    'On day wuyin, Wenqing and Zhang Lizhong were ordered to Henan to inspect relief.',
    'On wuyin day, Wenqing and Zhang Lizhong were sent to Henan for relief inspection.',
  ],
  s0505: [
    'On day xinsi, Jiming and others sent troops to aid Kashgar, attacked Andijan bandits, and routed them.',
    'On xinsi day, Jiming\'s relief force routed Andijan bandits near Kashgar.',
  ],
  s0506: [
    'On day yisi, because French warships had entered Korea, Keying was ordered to tell the French envoy to withdraw his troops.',
    'On yisi day, Keying was told to demand French withdrawal after warships entered Korea.',
  ],
  s0507: [
    'That month, drought ration grain was issued to forty-one prefectures and counties in Henan including Yuzhou.',
    'That month, Yuzhou and forty other drought-stricken Henan districts received ration grain.',
  ],
  s0508: [
    'New and old quota levies were remitted or deferred for thirty-six Zhili prefectures and counties including Anzhou that suffered flood, drought, and hail.',
    'Quota taxes were remitted or deferred for Anzhou and thirty-five other Zhili districts hit by flood, drought, or hail.',
  ],
  s0509: [
    'Winter, tenth month, day xinyou: Yao rebels Lei Zaihao and others in Xinning county, Hunan, rebelled; Lu Fei\'e and others were ordered to capture and suppress them.',
    'In the tenth month, xinyou, Lei Zaihao\'s Yao rebels rose in Hunan\'s Xinning and Lu Fei\'e was ordered to suppress them.',
  ],
  s0510: [
    'On day yichou, the Emperor inspected Jianrui Camp troops.',
    'On yichou day, the Emperor reviewed the Jianrui Camp.',
  ],
  s0511: [
    'On day wuchen, Yishan and others routed Andijan bandits at Kekureyiwate in Yarkand.',
    'On wuchen day, Yishan defeated Andijan bandits at Kekureyiwate in Yarkand.',
  ],
  s0512: [
    'On day gengwu, they routed them again at Yengisar.',
    'On gengwu day, they beat the bandits again at Yengisar.',
  ],
  s0513: [
    'On day renshen, the Andijan bandits fled.',
    'On renshen day, the Andijan bandits withdrew.',
  ],
  s0514: [
    'Kashgar resident commander Kaiming\'a and others were stripped of office and arrested for questioning.',
    'Kaiming\'a and other Kashgar commanders were dismissed and arrested.',
  ],
  s0515: [
    'That month, new and old quota levies were remitted or deferred for thirty-nine Anhui prefectures and counties including Luzhou that suffered flood and drought.',
    'That month, Luzhou and thirty-eight other flood- and drought-stricken Anhui districts had quota taxes remitted or deferred.',
  ],
  s0516: [
    'Eleventh month, day jiashen: Yinglong was transferred to Heilongjiang general and Chengyu to Suiyuan City general.',
    'In month 11, jiashen, Yinglong took Heilongjiang and Chengyu took Suiyuan City.',
  ],
  s0517: [
    'On day renchen, Zhang Lizhong was made Shandong governor.',
    'On renchen day, Zhang Lizhong became Shandong governor.',
  ],
  s0518: [
    'On day yiwei, the Xinning rebels in Hunan were pacified.',
    'On yiwei day, Hunan\'s Xinning rebels were pacified.',
  ],
  s0519: [
    'On day gengzi, Daozhou bandits in Hunan fled into Guanyang county, Guangxi; Zheng Zuchen was ordered to suppress them.',
    'On gengzi day, Hunan\'s Daozhou bandits entered Guangxi\'s Guanyang and Zheng Zuchen was ordered to hunt them down.',
  ],
  s0520: [
    'That month, ration grain was issued to eleven Shanxi prefectures, departments, and counties including Jiangzhou.',
    'That month, Jiangzhou and ten other Shanxi districts received ration grain.',
  ],
  s0521: [
    'New and old regular and miscellaneous quota levies were remitted or deferred for three Zhili prefectures and counties including Anzhou, eleven Shanxi prefectures, departments, and counties including Jiangzhou, and sixty-four Henan prefectures and counties including Yuzhou.',
    'Regular and miscellaneous quotas were remitted or deferred across disaster-hit districts in Zhili, Shanxi, and Henan.',
  ],
  s0522: [
    'Twelfth month, day wuwu: Miao bandits in Qianzhou department, Hunan, rebelled; Yutai and others were ordered to suppress them.',
    'In month 12, wuwu, Qianzhou Miao rebels rose and Yutai was ordered to suppress them.',
  ],
  s0523: [
    'On day jiaxu, Keying was recalled to the capital; Xu Guangjin was made acting Guangdong governor-general and imperial commissioner for commercial relations.',
    'On jiaxu day, Keying returned to Beijing and Xu Guangjin became acting Guangdong governor-general and trade commissioner.',
  ],
  s0524: [
    'That month, flood ration grain was issued to seventeen Henan counties including Xiangfu, and granary grain was loaned to Zhengzhou and others.',
    'That month, Xiangfu and sixteen other flooded Henan counties received rations and Zhengzhou and others received granary loans.',
  ],
  s0525: [
    'That year, Korea and Ryukyu sent tribute.',
    'That year, Korea and Ryukyu paid tribute.',
  ],
  s0526: [
    'Twenty-eighth year, spring, first month, day dingchou: Pan Shien was advanced to Grand Tutor, Baoxing to Grand Preceptor, and Baochang, Aleqing\'a, Li Zhenhu, and Chenggang to Junior Grand Preceptor of the Heir Apparent.',
    'In year 28, month 1, dingchou, Pan Shien became grand tutor, Baoxing grand preceptor, and four others junior grand preceptors.',
  ],
  s0527: [
    'On day jiashen, Qianzhou Miao bandits surrendered; Yutai was ordered to punish accordingly and still hunt remaining bandits.',
    'On jiashen day, Qianzhou Miao rebels surrendered and Yutai was told to punish them and pursue remnants.',
  ],
  s0528: [
    'On day xinmao, the Nepalese envoy was ordered to join the banquet for the Korean and Siamese envoys.',
    'On xinmao day, the Nepalese envoy was seated with the Korean and Siamese envoys at court banquet.',
  ],
  s0529: [
    'On day wuxu, the king of Vietnam Nguyen Phuc Tho died; the annual tribute for that year was suspended.',
    'On wuxu day, Vietnam\'s Nguyen Phuc Tho died and that year\'s tribute was halted.',
  ],
  s0530: [
    'Regular and miscellaneous overdue levies for Han and Hui households in Kashgar were remitted.',
    'Kashgar\'s Han and Hui overdue taxes were remitted.',
  ],
  s0531: [
    'That month, disaster relief was extended for five Zhili counties including Yanshan.',
    'That month, Yanshan and four other Zhili counties received extended relief.',
  ],
  s0532: [
    'Ration grain was issued for flood and drought in three Anhui counties including Fengyang.',
    'Fengyang and two other Anhui counties received flood and drought rations.',
  ],
  s0533: [
    'Ration grain and seed grain were loaned to disaster victims in Hunan\'s Anxiang county, four Shanxi departments and counties including Ningyuan, and seven Gansu counties including Gaolan.',
    'Disaster victims in Anxiang, Ningyuan and three other Shanxi units, and Gaolan and six other Gansu counties received ration and seed loans.',
  ],
  s0534: [
    'Second month, day renzi: Minister of Personnel En Gui died; Wenqing left the Grand Council and was made Minister of Personnel.',
    'In month 2, renzi, En Gui died; Wenqing left the Grand Council for the Ministry of Personnel.',
  ],
  s0535: [
    'Lin Kui was made Minister of Rites; Gui Liang was made commandant of the Plain White Banner Han Army.',
    'Lin Kui took rites and Gui Liang became Plain White Banner Han Army commandant.',
  ],
  s0536: [
    'Huifeng replaced him as Rehe commandant; Baochang became Minister of War.',
    'Huifeng became Rehe commandant and Baochang Minister of War.',
  ],
  s0537: [
    'On day renxu, bandits in Changning and Chongyi counties, Jiangxi, rebelled; Wu Wenrong was ordered to suppress them.',
    'On renxu day, Jiangxi\'s Changning and Chongyi bandits rose and Wu Wenrong was ordered to suppress them.',
  ],
  s0538: [
    'On day jiazi, for the tomb visit Prince Rui Renshou and others were left in the capital to handle affairs.',
    'On jiazi day, Prince Rui Renshou and others stayed in Beijing for the tomb visit.',
  ],
  s0539: [
    'Third month, day wuyin: Zhao Prefecture bandits in Yunnan rebelled; Lin Zexu was ordered to suppress them.',
    'In month 3, wuyin, Yunnan\'s Zhao Prefecture bandits rose and Lin Zexu was ordered to suppress them.',
  ],
  s0540: [
    'Yishan was made Ili assistant commissioner; Jiming Yarkand assistant commissioner.',
    'Yishan became Ili assistant commissioner and Jiming Yarkand assistant commissioner.',
  ],
  s0541: [
    'On day renwu, the Emperor visited the Western Tombs and remitted one-third of quota levies in passed areas.',
    'On renwu day, the Emperor visited the Western Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0542: [
    'On day bingxu, the Emperor visited Tai Tomb, Tai East Tomb, and Chang Tomb and offered wine at the mausolea of Empresses Xiaomu, Xiaoshen, and Xiaoquan.',
    'On bingxu day, the Emperor worshipped at Tai, Tai East, and Chang tombs and made offerings at Xiaomu, Xiaoshen, and Xiaoquan.',
  ],
  s0543: [
    'On day gengyin, the Emperor returned to the capital.',
    'On gengyin day, the Emperor returned to Beijing.',
  ],
  s0544: [
    'On day guimao, Yu Cheng was transferred to Jingzhou general and Shuangde was made Chahar commander-in-chief.',
    'On guimao day, Yu Cheng went to Jingzhou and Shuangde became Chahar commander-in-chief.',
  ],
  s0545: [
    'That month, granary grain was loaned for poor harvest in seven Shanxi prefectures and counties including Jizhou.',
    'That month, Jizhou and six other Shanxi districts received poor-harvest granary loans.',
  ],
  s0546: [
    'Summer, fourth month, day wuchen: Baoshan bandits in Yunnan were pacified.',
    'In month 4, wuchen, Yunnan\'s Baoshan bandits were pacified.',
  ],
  s0547: [
    'On day xinwei, bandits in Guangxi counties including Guanyang, Pingle, and Yangshuo were pacified.',
    'On xinwei day, bandits in Guanyang, Pingle, Yangshuo, and other Guangxi counties were pacified.',
  ],
  s0548: [
    'Sixth month, new moon on day guimao: Xu Zequan was made Shandong governor.',
    'At the sixth-month new moon, guimao, Xu Zequan became Shandong governor.',
  ],
  s0549: [
    'On day bingwu, Keying was kept in the capital to oversee the Ministry of Rites; Xu Guangjin was given Guangdong governor-general and imperial commissioner posts for commercial relations.',
    'On bingwu day, Keying stayed in Beijing over rites and Xu Guangjin took Guangdong governor-general and trade commissioner posts.',
  ],
  s0550: [
    'Ye Mingchen was made Guangdong governor.',
    'Ye Mingchen became Guangdong governor.',
  ],
  s0551: [
    'On day guichou, Keying was transferred to oversee the Ministry of War.',
    'On guichou day, Keying was moved to oversee the Ministry of War.',
  ],
  s0552: [
    'On day jiayin, the Emperor prayed for rain at Black Dragon Pool.',
    'On jiayin day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0553: [
    'On day wuchen, Fu Shengxun was made Jiangxi governor.',
    'On wuchen day, Fu Shengxun became Jiangxi governor.',
  ],
  s0554: [
    'On day gengwu, Wu Wenrong was transferred to Zhejiang governor.',
    'On gengwu day, Wu Wenrong became Zhejiang governor.',
  ],
  s0555: [
    'Autumn, seventh month, day gengyin: Lin Zexu was advanced to Junior Grand Preceptor of the Heir Apparent and granted the peacock feather.',
    'In month 7, gengyin, Lin Zexu became junior grand preceptor and received the peacock feather.',
  ],
  s0556: [
    'Eighth month, day dingsi: Henan governor E Shun\'an was stripped of office and Pan Duo replaced him.',
    'In month 8, dingsi, E Shun\'an lost Henan and Pan Duo replaced him.',
  ],
  s0557: [
    'On day xinyou, a Russian merchant ship requested trade at Shanghai; it was refused.',
    'On xinyou day, a Russian merchant ship seeking Shanghai trade was refused.',
  ],
  s0558: [
    'Ninth month, day jiaxu: Pan Xi\'en was dismissed; Yang Yizeng was made Jiangsu grain-transport governor-general and Chen Shimei Shaanxi governor.',
    'In month 9, jiaxu, Pan Xi\'en was dismissed; Yang Yizeng took Jiangsu grain transport and Chen Shimei Shaanxi.',
  ],
  s0559: [
    'Chengyu was summoned to the capital; Sheng Xun acted as Suiyuan City general.',
    'Chengyu was called to Beijing and Sheng Xun acted as Suiyuan City general.',
  ],
  s0560: [
    'Flood relief was given to three Jiangning prefectures.',
    'Three Jiangning prefectures received flood relief.',
  ],
  s0561: [
    'On day yiyou, Hubei flood victims were relieved.',
    'On yiyou day, Hubei flood victims were relieved.',
  ],
  s0562: [
    'On day guisi, Qiao Yongqian was summoned to the capital; Luo Raodian acted as Guizhou governor.',
    'On guisi day, Qiao Yongqian was recalled and Luo Raodian acted as Guizhou governor.',
  ],
  s0563: [
    'That month, flood ration grain and housing funds were issued to four Hunan counties including Wuling.',
    'That month, Wuling and three other flooded Hunan counties received rations and housing funds.',
  ],
  s0564: [
    'Winter, tenth month, day jiayin: Grand Secretary Baoxing of the Wenhua Hall died.',
    'In the tenth month, jiayin, Wenhua Hall Grand Secretary Baoxing died.',
  ],
  s0565: [
    'On day dingmao, Barkul city was repaired.',
    'On dingmao day, Barkul city was repaired.',
  ],
  s0566: [
    'That month, flood relief was given to seven Zhili prefectures and counties including Tongzhou and sixteen Anhui prefectures and counties including Wuwei.',
    'That month, Tongzhou and six other Zhili districts and Wuwei and fifteen other Anhui districts received flood relief.',
  ],
  s0567: [
    'Ration grain was issued to fourteen Anhui prefectures and counties including Hezhou and to disaster victims in Huarong county and Yuezhou Guard, Hunan.',
    'Hezhou and thirteen other Anhui districts and Huarong and Yuezhou Guard received ration grain.',
  ],
  s0568: [
    'Seed grain was loaned to disaster victims in Hunan\'s Anxiang county and Lizhou.',
    'Anxiang and Lizhou received disaster seed loans.',
  ],
  s0569: [
    'New and old quota levies were remitted or deferred for fifty-two Zhili prefectures and counties including Tongzhou, thirty-nine Hubei prefectures, counties, and guards including Mianyang, nine Hunan prefectures and counties including Lizhou, and twenty-four Anhui prefectures and counties including Luzhou.',
    'Quota taxes were remitted or deferred across Tongzhou and fifty-one other Zhili districts, Mianyang and thirty-eight other Hubei units, Lizhou and eight other Hunan districts, and Luzhou and twenty-three other Anhui districts.',
  ],
  s0570: [
    'Eleventh month, day yihai: Nguyen Phuc Tho\'s son Phuc Thi was enfeoffed as king of Vietnam.',
    'In month 11, yihai, Phuc Thi was enfeoffed king of Vietnam.',
  ],
  s0571: [
    'On day jimao, Keying was made Grand Secretary overseeing the Ministry of War.',
    'On jimao day, Keying became grand secretary over war.',
  ],
  s0572: [
    'Qishan was made associate Grand Secretary while remaining Sichuan governor-general.',
    'Qishan became associate grand secretary and kept Sichuan governor-general.',
  ],
  s0573: [
    'Ruiyuan was summoned to the capital; Huicheng was made Kobdo assistant commissioner.',
    'Ruiyuan was recalled to Beijing and Huicheng became Kobdo assistant commissioner.',
  ],
  s0574: [
    'Censor Zhang Hongsheng requested casting large cash coins; the matter was referred to the ministries for discussion.',
    'Zhang Hongsheng urged large-cash coinage and the ministries were ordered to discuss it.',
  ],
  s0575: [
    'On day xinsi, Prince Ding Zaiquan and Vice Minister Ji Zhichang were ordered to investigate Zhili salt affairs; Grand Secretary Keying and Vice Minister Zhu Fengbiao to investigate Shandong salt affairs.',
    'On xinsi day, Zaiquan and Ji Zhichang were sent to investigate Zhili salt and Keying and Zhu Fengbiao Shandong salt.',
  ],
  s0576: [
    'On day dinghai, Keying was appointed Wenyuan Pavilion Grand Secretary.',
    'On dinghai day, Keying became Wenyuan Pavilion grand secretary.',
  ],
  s0577: [
    'On day dingyou, Tuoming\'a was made Suiyuan City general.',
    'On dingyou day, Tuoming\'a became Suiyuan City general.',
  ],
  s0578: [
    'That month, flood ration grain was issued to twenty Jiangxi counties including Dehua.',
    'That month, Dehua and nineteen other flooded Jiangxi counties received ration grain.',
  ],
  s0579: [
    'Troop pay was loaned to the Hunan provincial standard and Changde and other garrison camps in disaster zones.',
    'The Hunan provincial standard and Changde and other garrisons in disaster zones received pay loans.',
  ],
  s0580: [
    'New and old quota levies were remitted or deferred for seventy-seven Jiangsu prefectures, departments, counties, and guards including Taizhou, twenty Liang-Huai salt fields including Lüsi, twenty-two Jiangxi counties including Dehua, and six Zhili prefectures and counties including Anzhou.',
    'Quota taxes were remitted or deferred across Taizhou and seventy-six other Jiangsu units, Lüsi and nineteen other salt fields, Dehua and twenty-one other Jiangxi counties, and Anzhou and five other Zhili districts.',
  ],
  s0581: [
    'Twelfth month, day bingwu: the Emperor prayed for snow at the Dagao Hall.',
    'In month 12, bingwu, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0582: [
    'On day jiayin, the Emperor again prayed for snow at the Dagao Hall.',
    'On jiayin day, the Emperor again prayed for snow at Dagao Hall.',
  ],
  s0583: [
    'On day xinyou, the Emperor prayed for snow at the Temple of Heaven.',
    'On xinyou day, the Emperor prayed for snow at the Temple of Heaven.',
  ],
  s0584: [
    'On day renxu, because Vice Minister Chen Fu\'en had served as acting Shandong governor without accepting public stipends, he was granted a first-rank button and an imperial inscribed plaque.',
    'On renxu day, Chen Fu\'en was rewarded with a first-rank button and imperial plaque for refusing stipends as acting Shandong governor.',
  ],
  s0585: [
    'On day yichou, Woshina was made Jilin general, Chenggang Minister of Rites, and Baijia Left Censor-in-Chief.',
    'On yichou day, Woshina took Jilin, Chenggang rites, and Baijia the left censorate.',
  ],
  s0586: [
    'On day bingyin, Zhang Xianghe was made Shaanxi governor.',
    'On bingyin day, Zhang Xianghe became Shaanxi governor.',
  ],
  s0587: [
    'That month, disaster victims in fourteen Zhili prefectures and counties including Tongzhou were relieved.',
    'That month, Tongzhou and thirteen other Zhili districts received relief.',
  ],
  s0588: [
    'That year, Korea, Ryukyu, Siam, and Vietnam sent tribute.',
    'That year, Korea, Ryukyu, Siam, and Vietnam paid tribute.',
  ],
  s0589: [
    'Twenty-ninth year, spring, first month, day guiwei: Yige was made Uliasutai general.',
    'In year 29, month 1, guiwei, Yige became Uliasutai general.',
  ],
  s0590: [
    'On day xinmao, Keying and Ji Zhichang were ordered to inspect Zhejiang garrisons and storehouses.',
    'On xinmao day, Keying and Ji Zhichang were sent to inspect Zhejiang troops and storehouses.',
  ],
  s0591: [
    'That month, supplementary flood relief was given to fourteen Anhui prefectures, departments, counties, and guards including Wuwei.',
    'That month, Wuwei and thirteen other Anhui districts received added flood relief.',
  ],
  s0592: [
    'Flood ration grain was issued to six Hunan prefectures and counties including Lizhou and thirteen Anhui prefectures and counties including Hezhou.',
    'Lizhou and five other Hunan districts and Hezhou and twelve other Anhui districts received flood rations.',
  ],
  s0593: [
    'Flood seed grain was loaned to twelve Jiangxi counties including Nanchang and six Hunan prefectures and counties including Lizhou.',
    'Nanchang and eleven other Jiangxi counties and Lizhou and five other Hunan districts received flood seed loans.',
  ],
  s0594: [
    'Second month, new moon on day gengzi: solar eclipse.',
    'At the second-month new moon, gengzi, there was a solar eclipse.',
  ],
  s0595: [
    'On day xinchou, Liu Yunke was ordered to comfort flood and earthquake victims in northern Taiwan.',
    'On xinchou day, Liu Yunke was sent to comfort northern Taiwan\'s flood and earthquake victims.',
  ],
  s0596: [
    'On day bingwu, Li Xingyuan was instructed to handle Jiangsu relief affairs.',
    'On bingwu day, Li Xingyuan was ordered to manage Jiangsu relief.',
  ],
  s0597: [
    'On day xinhai, Muzhang\'a, Pan Shien, and Chen Guanjun were dismissed as chief tutors of the Upper Study.',
    'On xinhai day, Muzhang\'a, Pan Shien, and Chen Guanjun left the Upper Study chief tutorship.',
  ],
  s0598: [
    'Qi Junzao and Du Shoutian were made chief tutors of the Upper Study; Shoutian still taught the fourth imperial son.',
    'Qi Junzao and Du Shoutian became Upper Study chief tutors; Shoutian still taught the fourth imperial son.',
  ],
  s0599: [
    'On day bingchen, Bronjie of Zhonggandui Tibetan workers in Sichuan rebelled; Qishan was ordered to suppress them.',
    'On bingchen day, Bronjie\'s Zhonggandui Tibetan workers rebelled in Sichuan and Qishan was ordered to suppress them.',
  ],
  s0600: [
    'Yu Cheng was also ordered to act as Sichuan governor-general.',
    'Yu Cheng was also ordered to act as Sichuan governor-general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b06.mjs <translation.json>'
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
