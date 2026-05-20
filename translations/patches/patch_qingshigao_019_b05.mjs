#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Lu Jianying was made Yunnan provincial governor.',
    'Lu Jianying became Yunnan governor.',
  ],
  s0402: [
    'That month, ration grain was issued to banner people at Fengtian\'s Fengcheng and Xiuyan subprefecture and in four Zhili counties including Baodi.',
    'That month, Fengcheng and Xiuyan banner people and Baodi and three other Zhili counties received rations.',
  ],
  s0403: [
    'Seed grain was loaned to disaster victims in thirteen Gansu counties including Jingning.',
    'Jingning and twelve other Gansu counties received seed loans.',
  ],
  s0404: [
    'Second month, day jichou: Hui rebels rose at Yongchang, Yunnan; provincial commander-in-chief Zhang Bilu was ordered to suppress them.',
    'In month 2, jichou, Yongchang Hui rebels rose; Zhang Bilu was sent to suppress them.',
  ],
  s0405: [
    'On day yimao, for the tomb visit Prince Ding, Zaiquan, and others were left in the capital to handle affairs.',
    'On yimao, Zaiquan and others stayed in Beijing for the tomb visit.',
  ],
  s0406: [
    'Third month, day haihai: the Emperor visited the Western Tombs and remitted one-third of quota levies in passed areas.',
    'In month 3, haihai, the Emperor visited the Western Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0407: [
    'On day dingmao, the Emperor offered libation at Tailing, Tai East Tombs, Changling, and the tombs of Empress Xiaomu, Empress Xiaoshen, and Empress Xiaoquan.',
    'On dingmao, the Emperor poured libations at Tai, Tai East, Chang, and the three empresses\' tombs.',
  ],
  s0408: [
    'On day gengwu, the Emperor went to the Southern Park for the battue.',
    'On gengwu, the Emperor hunted at the Southern Park.',
  ],
  s0409: [
    'On day xinwei, the Emperor conducted the battue; the next day he did the same.',
    'On xinwei and again the next day, the Emperor hunted.',
  ],
  s0410: [
    'On day yihai, the Emperor returned to the capital.',
    'On yihai, the Emperor returned to Beijing.',
  ],
  s0411: [
    'Fire broke out at the Xingping granary.',
    'The Xingping granary burned.',
  ],
  s0412: [
    'On day yiyou, the Emperor went to the Black Dragon Pool to pray for rain.',
    'On yiyou, the Emperor prayed for rain at the Black Dragon Pool.',
  ],
  s0413: [
    'Lin Zexu was made Shaanxi provincial governor.',
    'Lin Zexu became Shaanxi governor.',
  ],
  s0414: [
    'That month, granary grain was loaned for poor harvests in nine Shanxi prefectures and counties including Pingding.',
    'That month, Pingding and eight other Shanxi districts received granary loans for poor harvest.',
  ],
  s0415: [
    'Summer, fourth month, day xinchou: because Yongchang Muslims seized pretexts to stir trouble, He Changling was ordered to investigate; on day bingwu the Emperor again went to the Black Dragon Pool to pray for rain.',
    'In month 4, xinchou, He Changling investigated Yongchang Muslim unrest; on bingwu the Emperor again prayed for rain at the Black Dragon Pool.',
  ],
  s0416: [
    'On day gengxu, Ruiyuan was made Kobdo consultant minister.',
    'On gengxu, Ruiyuan became Kobdo consultant minister.',
  ],
  s0417: [
    'Fifth month, day renxu: the Emperor went to the Black Dragon Pool to pray for rain.',
    'In month 5, renxu, the Emperor prayed for rain at the Black Dragon Pool.',
  ],
  s0418: [
    'On day yichou, Zhang Bilu defeated the Hui rebels at Yongchang.',
    'On yichou, Zhang Bilu beat the rebels at Yongchang.',
  ],
  s0419: [
    'Because too many cooperating Yongchang Muslims were killed last year, He Changling was referred to the ministries for disciplinary action.',
    'He Changling faced ministry discipline for excessive killings of Yongchang Muslim collaborators last year.',
  ],
  s0420: [
    'On day dingmao, the Emperor again went to the Black Dragon Pool to pray for rain.',
    'On dingmao, the Emperor again prayed for rain at the Black Dragon Pool.',
  ],
  s0421: [
    'The British withdrew from Zhoushan.',
    'British forces left Zhoushan.',
  ],
  s0422: [
    'Intercalary fifth month, new moon on day yiyou: Tibetans of Hei Cuo Four Gullies in Qinghai rebelled; Buyantai was ordered to suppress them.',
    'On the yiyou new moon in intercalary month 5, Hei Cuo Four Gullies Tibetans rebelled; Buyantai was sent to suppress them.',
  ],
  s0423: [
    'On day guisi, Yongchang Hui rebels fled into Mengting; He Changling directed troops to suppress them.',
    'On guisi, Yongchang rebels fled to Mengting; He Changling pursued them.',
  ],
  s0424: [
    'On day wushen, Lin Kui was made Uliassutai consultant minister.',
    'On wushen, Lin Kui became Uliassutai consultant minister.',
  ],
  s0425: [
    'Sixth month, day wuwu: Qi Junzao and Wenqing were ordered to investigate Tianjin salt administration.',
    'In month 6, wuwu, Qi Junzao and Wenqing were assigned to inspect Tianjin salt affairs.',
  ],
  s0426: [
    'On day renwu, because retiring Grand Secretary Ruan Yuan had again passed the provincial examination, he was promoted to Grand Tutor with full salary.',
    'On renwu, Ruan Yuan, retired but re-examined, was made Grand Tutor at full pay.',
  ],
  s0427: [
    'On day guiwei, Dahunga suppressed Guangoufan bandits in hiding and defeated them.',
    'On guiwei, Dahunga routed hiding Guangoufan bandits.',
  ],
  s0428: [
    'Autumn, seventh month, day xinmao: Xi\'en, for failure to detect wicked commoners, was stripped of his dukedom and reduced to Banner General of the State.',
    'In month 7, xinmao, Xi\'en lost his dukedom and became a banner general for lax oversight.',
  ],
  s0429: [
    'On day renyin, the Emperor reviewed mounted and foot archery of Jilin and Heilongjiang troops.',
    'On renyin, the Emperor reviewed Jilin and Heilongjiang archery.',
  ],
  s0430: [
    'On day guimao, because old Han-Muslim grievances in Yunnan were unresolved, He Changling was ordered to handle matters impartially and not draw boundaries.',
    'On guimao, He Changling was told to settle Yunnan Han-Muslim feuds impartially, without taking sides.',
  ],
  s0431: [
    'On day xinhai, gate security was tightened.',
    'On xinhai, capital gates were strictly guarded.',
  ],
  s0432: [
    'That month, flood relief was given at Sanshing and Ningguta and other places.',
    'That month, flood victims at Sanshing, Ningguta, and elsewhere were relieved.',
  ],
  s0433: [
    'Eighth month, day renshen: generals, governors, and governors-general of seven provinces—Shengjing, Zhili, Jiangnan, Zhejiang, Fujian, Shandong, and Guangdong—were ordered to plan troop drill and stores of pay and grain.',
    'In month 8, renshen, seven provincial commanders were told to ready drill, pay, and grain.',
  ],
  s0434: [
    'On day guiyou, the Emperor reviewed troops of the Firearms Camp.',
    'On guiyou, the Emperor reviewed the Firearms Camp.',
  ],
  s0435: [
    'On day yihai, He Changling, for failing in defense and suppression, was demoted to Henan provincial administrator.',
    'On yihai, He Changling was demoted to Henan administrator after campaign failure.',
  ],
  s0436: [
    'Li Xingyuan was made Yunnan-Guizhou governor-general; Lu Jianying was transferred to Jiangsu governor; Zhang Rizhen was made Yunnan governor.',
    'Li Xingyuan took Yunnan-Guizhou, Lu Jianying Jiangsu, and Zhang Rizhen Yunnan.',
  ],
  s0437: [
    'On day bingzi, Burut bandits entered the Kashgar pass; Saishiyaletai was ordered to suppress them.',
    'On bingzi, Buruts crossed into Kashgar; Saishiyaletai was sent against them.',
  ],
  s0438: [
    'Ninth month, day jihai: in Xintian county, Hunan, bandits led by Wang Zongxian and others rebelled and were captured and executed.',
    'In month 9, jihai, Wang Zongxian\'s Xintian rebels were seized and killed.',
  ],
  s0439: [
    'On day wushen, Yang Dianbang was made acting grain-transport governor-general.',
    'On wushen, Yang Dianbang acted as grain-transport governor-general.',
  ],
  s0440: [
    'On day xinhai, in Zhaowen county, Jiangsu, bandits led by Jin Deshun and others rebelled and were captured and executed.',
    'On xinhai, Zhaowen\'s Jin Deshun rebels were captured and killed.',
  ],
  s0441: [
    'That month, disaster victims in two Shandong prefectures and counties, Dongping and Laiwu, were relieved.',
    'That month, Dongping and Laiwu flood victims received relief.',
  ],
  s0442: [
    'Banner people afflicted by floods at Sanshing and Hunchun were relieved.',
    'Flood-hit banner people at Sanshing and Hunchun were relieved.',
  ],
  s0443: [
    'Ration grain was issued to disaster victims in four Shandong counties including Wen.',
    'Wen and three other Shandong counties received disaster rations.',
  ],
  s0444: [
    'New and old quota levies were remitted or deferred for thirteen Fengtian prefectures, departments, and counties including Liaoyang, thirty-five Zhili prefectures and counties including Bazhou, and four Shandong prefectures and counties including Dongping that had suffered disaster and poor harvest.',
    'Disaster quota taxes were eased for Liaoyang and twelve other Fengtian units, Bazhou and thirty-four other Zhili units, and Dongping and three other Shandong units.',
  ],
  s0445: [
    'Tenth month, day dingsi: quota levies of the Hei Cuo Four Gullies Tibetans were remitted.',
    'In month 10, dingsi, Hei Cuo Four Gullies Tibetans were exempted from quota levies.',
  ],
  s0446: [
    'On day bingyin, Xu Jisuo was made Guangxi governor.',
    'On bingyin, Xu Jisuo became Guangxi governor.',
  ],
  s0447: [
    'That month, ration grain was issued to disaster victims in eight Henan counties including Ji and two Shaanxi counties, Fugu and Shenmu.',
    'That month, Ji and seven other Henan counties and Fugu and Shenmu received disaster rations.',
  ],
  s0448: [
    'Quota levies were remitted or deferred for five Hunan prefectures and counties including Lizhou and Yuezhou Guard that had suffered disaster.',
    'Lizhou and four other Hunan units plus Yuezhou Guard received disaster tax relief.',
  ],
  s0449: [
    'Eleventh month, day yiyou: Guilun was transferred to Jingzhou general; Te Yishun was made Uliassutai general.',
    'In month 11, yiyou, Guilun went to Jingzhou and Te Yishun took Uliassutai.',
  ],
  s0450: [
    'On day yiwei, the Emperor went to the Dagao Hall to pray for snow.',
    'On yiwei, the Emperor prayed for snow at the Dagao Hall.',
  ],
  s0451: [
    'On day bingwu, Bichang and others were ordered to plan division of Jiangsu tribute grain transport by sea.',
    'On bingwu, Bichang and others were told to plan partial sea transport of Jiangsu grain.',
  ],
  s0452: [
    'On day jiyou, Huang Entong, for memorializing to grant official titles to elderly military licentiates taking the examination, was referred to the ministries for severe deliberation.',
    'On jiyou, Huang Entong faced ministry scrutiny for asking titles for old military examinees.',
  ],
  s0453: [
    'On day xinhai, Shandong was ordered strictly to apprehend kidnappers who extorted ransom.',
    'On xinhai, Shandong was told to crack down on kidnapping for ransom.',
  ],
  s0454: [
    'That month, disaster victims in Yuanqu county, Shanxi, were relieved.',
    'That month, Yuanqu flood victims were relieved.',
  ],
  s0455: [
    'New and old quota levies were remitted or deferred for six Shanxi prefectures and counties including Baode and three places including Guihuacheng, forty-four Zhejiang counties and guards including Yuhang, and six Zhili prefectures and counties including Anzhou that had suffered disaster.',
    'Disaster taxes were eased for Baode and five other Shanxi units, three Guihua units, Yuhang and forty-three other Zhejiang units, and Anzhou and five other Zhili units.',
  ],
  s0456: [
    'Twelfth month, day guichou: Huang Entong was dismissed from office; Xu Guangjin was transferred to Guangdong governor; Cheng Yusai was made Yunnan governor; Yang Dianbang was made grain-transport governor-general.',
    'In month 12, guichou, Huang Entong was dismissed, Xu Guangjin went to Guangdong, Cheng Yusai to Yunnan, and Yang Dianbang took grain transport.',
  ],
  s0457: [
    'On day guihai, Mengtong Hui rebels from Yunnan slipped into Linning; Lu Jianying was ordered to investigate.',
    'On guihai, Mengtong rebels entered Linning; Lu Jianying was assigned the case.',
  ],
  s0458: [
    'On day jiazi, Xining frontier commissioner Dahunga was dismissed for illness; Halejina replaced him.',
    'On jiazi, ill Dahunga left Xining and Halejina succeeded him.',
  ],
  s0459: [
    'On day wuchen, Wang Zhaochen was made Shanxi governor.',
    'On wuchen, Wang Zhaochen became Shanxi governor.',
  ],
  s0460: [
    'On day gengwu, a general review of cases was ordered at the Board of Punishments and in Zhili, Shandong, Shanxi, Henan, Shaanxi, and Gansu.',
    'On gengwu, the punishment ministry and six provinces were ordered to clear backlog cases.',
  ],
  s0461: [
    'Bao Xing was left in the capital to manage the Board of Punishments.',
    'Bao Xing stayed in Beijing to run the punishment ministry.',
  ],
  s0462: [
    'Qishan was granted second-rank insignia and made Shaanxi-Gansu governor-general.',
    'Qishan received second rank and the Shaanxi-Gansu governor-general post.',
  ],
  s0463: [
    'On day bingzi, Zheng Zuchen was transferred to Guangxi governor and Xu Jisuo to Fujian governor.',
    'On bingzi, Zheng Zuchen took Guangxi and Xu Jisuo Fujian.',
  ],
  s0464: [
    'That month, ration grain was issued for flood disasters in two Zhejiang counties, Jinyun and Xuanping.',
    'That month, Jinyun and Xuanping received flood rations.',
  ],
  s0465: [
    'That year, Korea and Ryukyu sent tribute.',
    'That year, Korea and Ryukyu paid tribute.',
  ],
  s0466: [
    'Twenty-seventh year, spring, first month, day guiwei: Cheng Kai was transferred to Tarbagatai consultant minister.',
    'In year 27, spring, month 1, guiwei, Cheng Kai went to Tarbagatai.',
  ],
  s0467: [
    'On day yiyou, Tielin was transferred to Jingzhou general and Yucheng made Chahar commander-in-chief.',
    'On yiyou, Tielin took Jingzhou and Yucheng Chahar.',
  ],
  s0468: [
    'That month, last year\'s disaster rations were issued to six Zhejiang counties and guards including Fuyang, three Anhui counties including Wuhe, five Jiangsu counties and guards including Taoyuan, and disaster rations and seed to thirteen Henan counties including Henei, and granary grain was loaned to eight counties including Huixian.',
    'That month, Fuyang and other disaster districts in Zhejiang, Anhui, and Jiangsu received rations; Henei and twelve other Henan counties received rations and seed; Huixian and seven others received granary loans.',
  ],
  s0469: [
    'Seed grain, ration grain, and granary grain were loaned for disaster and poor harvest to three Shaanxi prefectures and counties including Jiaz and thirty-nine Zhili prefectures and counties including Bazhou.',
    'Disaster loans went to Jiaz and two other Shaanxi units and Bazhou and thirty-eight other Zhili units.',
  ],
  s0470: [
    'Second month, day jiwei: Hui rebels rose at Yunzhou, Yunnan; Li Xingyuan was ordered to suppress them.',
    'In month 2, jiwei, Yunzhou Hui rebels rose; Li Xingyuan was sent to suppress them.',
  ],
  s0471: [
    'On day haihai, for the tomb visit Zaiquan and others were left in the capital to handle affairs.',
    'On haihai, Zaiquan and others stayed in Beijing for the tomb visit.',
  ],
  s0472: [
    'On day bingzi, because Fujian pirates had robbed and killed foreign merchants, Liu Yunke and others were ordered to hunt them down.',
    'On bingzi, Liu Yunke was told to hunt Fujian pirates who killed foreign merchants.',
  ],
  s0473: [
    'On day wuyin, the Emperor visited the Eastern Tombs and remitted one-third of quota levies in passed areas.',
    'On wuyin, the Emperor visited the Eastern Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0474: [
    'That month, ration grain was issued to disaster victims in five Henan counties including Ji.',
    'That month, Ji and four other Henan counties received disaster rations.',
  ],
  s0475: [
    'On day yiwei, Bichang was transferred to inner court minister; Li Xingyuan was transferred to Liangjiang governor-general; Lin Zexu was made Yunnan-Guizhou governor-general; Yang Yizeng was made Shaanxi governor.',
    'On yiwei, Bichang entered the inner court, Li Xingyuan took Liangjiang, Lin Zexu Yunnan-Guizhou, and Yang Yizeng Shaanxi.',
  ],
  s0476: [
    'On day wuxu, British ships withdrew from Humen.',
    'On wuxu, British ships left Humen.',
  ],
  s0477: [
    'On day yisi, Wei Yuanhuang was made Minister of Rites and Jia Zhen Left Censor-in-Chief.',
    'On yisi, Wei Yuanhuang took Rites and Jia Zhen the Left Censorate.',
  ],
  s0478: [
    'Summer, fourth month, day wuwu: Burut bandits again attacked Serkule; Bekbash and others drove them off.',
    'In month 4, wuwu, Buruts attacked Serkule and Bekbash repulsed them.',
  ],
  s0479: [
    'Saishiyaletai and others memorialized that the British held Indi and Nupur and that all tribes had submitted to them.',
    'Saishiyaletai reported British occupation of Indi and Nupur and widespread tribal submission.',
  ],
  s0480: [
    'On day bingyin, arrears of quota levies and banner rent silver were remitted for Fengning county, Rehe.',
    'On bingyin, Fengning\'s tax and banner-rent arrears were forgiven.',
  ],
  s0481: [
    'On day guiyou, Zhang Zhiwan and two hundred thirty-one others were granted jinshi degrees and origin-ranks by degree.',
    'On guiyou, Zhang Zhiwan and 231 others received jinshi ranks by degree.',
  ],
  s0482: [
    'That month, seed grain and ration grain were loaned to two Jiangxi counties, Shanggao and Xinchang, and to garrison colonists and Miao tenants in five Hunan departments and counties including Fenghuang.',
    'That month, Shanggao and Xinchang and five Fenghuang-area units received seed and ration loans.',
  ],
  s0483: [
    'Fifth month, day bingxu: the Emperor held the palace examination for Hanlin and Academician officials; Wang Qingyun and four others were advanced to first class and the rest promoted or demoted with difference.',
    'In month 5, bingxu, the palace exam ranked Wang Qingyun and four first and adjusted the rest.',
  ],
  s0484: [
    'He Rulin left office on mourning; Wei Yuanhuang was transferred to Minister of War; Jia Zhen was made Minister of Rites; Sun Ruizhen was made Left Censor-in-Chief.',
    'He Rulin mourned; Wei Yuanhuang took War, Jia Zhen Rites, and Sun Ruizhen the Left Censorate.',
  ],
  s0485: [
    'On day dinghai, Wenqing and Chen Fuen were ordered to walk as supernumeraries above the Grand Councilors.',
    'On dinghai, Wenqing and Chen Fuen joined the Grand Council as supernumeraries.',
  ],
  s0486: [
    'On day xinmao, because Guangdong popular sentiment easily led to clashes with foreigners, gentry were selected to assist in handling foreign affairs.',
    'On xinmao, Guangdong gentry were chosen to help manage foreign contact and avoid clashes.',
  ],
  s0487: [
    'On day dingwei, Zeng Guofan was promoted to Hanlin Academician of the Secretariat.',
    'On dingwei, Zeng Guofan became a secretariat academician.',
  ],
  s0488: [
    'Sixth month: the Court of Colonial Affairs memorialized that a Russian lama had requested trade at Tarbagatai, Ili, and Kashgar; permission was denied.',
    'In month 6, the Colonial Office refused a Russian lama\'s request to trade at Tarbagatai, Ili, and Kashgar.',
  ],
  s0489: [
    'Autumn, seventh month, day jimao: Lin Zexu was ordered to try the case of Yunnan Muslims charging that Xiang bandits had killed more than ten thousand innocents.',
    'In month 7, jimao, Lin Zexu was assigned the Yunnan Muslim case over Xiang-bandit mass killings.',
  ],
  s0490: [
    'On day yiwei, Lin Zexu was ordered to try the case of Yunnan Muslim Du Wenxiu charging false accusation of rebellion.',
    'On yiwei, Lin Zexu took Du Wenxiu\'s false-rebellion case.',
  ],
  s0491: [
    'On day guimao, because of drought disaster in Henan, one hundred thousand taels from the treasury and two hundred thousand taels transferred from neighboring provinces were issued for relief.',
    'On guimao, Henan drought relief received 100,000 treasury taels and 200,000 from neighbors.',
  ],
  s0492: [
    'Eighth month, day jiyou: Andijan bandits attacked Kashgar; Jiming and others drove them off.',
    'In month 8, jiyou, Andijan raiders hit Kashgar and Jiming repulsed them.',
  ],
  s0493: [
    'Saishiyaletai committed suicide; Yishan was transferred to Yarkand consultant minister.',
    'Saishiyaletai killed himself; Yishan became Yarkand consultant minister.',
  ],
  s0494: [
    'On day guihai, because Buyantai went to Suzhou to direct operations, Yang Yizeng was made acting Shaanxi-Gansu governor-general and Hengchun acting Shaanxi governor.',
    'On guihai, Buyantai went to Suzhou; Yang Yizeng acted Shaanxi-Gansu and Hengchun Shaanxi.',
  ],
  s0495: [
    'On day jiazi, because Burut and Andijan bandits beyond the Kashgar passes had rebelled, Buyantai was made Pacification General of the West and Yishan consultant minister to attack them.',
    'On jiazi day, frontier Burut and Andijan rebels brought Buyantai as western general and Yishan as consultant minister.',
  ],
  s0496: [
    'Shanyu was made Uliassutai consultant minister.',
    'Shanyu became Uliassutai consultant minister.',
  ],
  s0497: [
    'Jiming was made acting Yarkand consultant minister.',
    'Jiming acted at Yarkand.',
  ],
  s0498: [
    'On day wuchen, Yixiang was transferred to Hangzhou general; Yixing was transferred to Shengjing general; and Yinglong was made Suiyuan garrison general.',
    'On wuchen, Yixiang went to Hangzhou, Yixing to Shengjing, and Yinglong to Suiyuan.',
  ],
  s0499: [
    'Because the Henan disaster was widespread, another three hundred thousand taels from the inner treasury and three hundred thousand taels from the Board of Revenue were allocated for relief.',
    'Henan\'s widening disaster drew another 600,000 taels from palace and revenue reserves.',
  ],
  s0500: [
    'On day bingzi, Andijan bandits besieged Yengisar city; Buyantai was stationed at Suzhou and troops were dispatched to attack them.',
    'On bingzi, Andijan rebels besieged Yengisar; Buyantai at Suzhou sent troops against them.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b05.mjs <translation.json>'
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
