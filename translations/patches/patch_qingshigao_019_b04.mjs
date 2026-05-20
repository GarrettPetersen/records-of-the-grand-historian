#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    "On day bingxu, Zhong Xiang and others reported on river-works follow-up; the Emperor instructed: \"When one man loses his livelihood, the fault lies with me personally.\"",
    "On bingxu, Zhong Xiang reported river follow-up and the Emperor said losing one man was his own fault.",
  ],
  s0302: [
    "\"You ministers manage it well.\"",
    "\"See to it well.\"",
  ],
  s0303: [
    "That month, granary grain was loaned for poor harvest in eleven Shanxi prefectures and counties including Pingding.",
    "That month, Pingding and ten other Shanxi districts received poor-harvest granary loans.",
  ],
  s0304: [
    "Summer, fourth month, day jiyou: the inner-sea batteries at Guangdong's Humen were repaired.",
    "In month 4, jiyou, Humen's inner-sea batteries were repaired.",
  ],
  s0305: [
    "On day renzi, bandits in Taiwan were pacified.",
    "On renzi, Taiwan bandits were pacified.",
  ],
  s0306: [
    "On day xinyou, Sun Yuqin and 209 others were granted jinshi degrees with differentiated ranks.",
    "On xinyou, Sun Yuqin and 209 others received jinshi ranks.",
  ],
  s0307: [
    "That month, three months' flood ration grain was added for fifteen Henan prefectures and counties including Suizhou.",
    "That month, Suizhou and fourteen other Henan districts received three months' flood rations.",
  ],
  s0308: [
    "Sixth month, day dingyou: the Yongding River in Zhili burst.",
    "In month 6, dingyou, Zhili's Yongding River burst.",
  ],
  s0309: [
    "On day renyin, bandits led by Yang Dapeng rose in Leiyang County, Hunan; Lu Fei'en and others were ordered to suppress them.",
    "On renyin, Yang Dapeng's Leiyang bandits rose; Lu Fei'en was sent to suppress them.",
  ],
  s0310: [
    "On day jiyou, the American commercial treaty was settled.",
    "On jiyou, the American trade treaty was settled.",
  ],
  s0311: [
    "That month, new and old quota levies were deferred by degree for twenty-two Shandong prefectures and counties including Linqing and the Dezhou and Dongchang guards.",
    "That month, Linqing and twenty-one other Shandong districts plus Dezhou and Dongchang guards had taxes deferred.",
  ],
  s0312: [
    "Autumn, seventh month, day xinsi: Funiyang'a and Regional Commander Zhou Yuesheng were referred to the ministries for severe deliberation.",
    "In month 7, xinsi, Funiyang'a and Zhou Yuesheng faced severe ministry review.",
  ],
  s0313: [
    "On day jiashen, bandits in Leiyang County, Hunan, were pacified; ringleader Yang Dapeng was executed.",
    "On jiashen, Leiyang bandits were pacified and Yang Dapeng was executed.",
  ],
  s0314: [
    "On day wuzi, the Wancheng dike at Jingzhou, Hubei, burst.",
    "On wuzi, Jingzhou's Wancheng dike burst.",
  ],
  s0315: [
    "On day xinmao, Yixing was summoned to the capital; Tielin acted as Suiyuan garrison general and Ayantai acted as Chahar governor-general.",
    "On xinmao, Yixing was called to Beijing; Tielin acted at Suiyuan and Ayantai at Chahar.",
  ],
  s0316: [
    "That month, three months' flood ration grain was added for nine Henan counties including Zhongmou.",
    "That month, Zhongmou and eight other Henan counties received three months' flood rations.",
  ],
  s0317: [
    "Seed grain was loaned for hail disaster at Shaanxi's Jia Prefecture.",
    "Jia Prefecture in Shaanxi received hail seed loans.",
  ],
  s0318: [
    "Eighth month: flood and hail victims in Fenyang, Shanxi, were relieved, and quota levies were remitted or deferred for Fenyang and two other counties.",
    "In month 8, Fenyang and two other Shanxi counties were relieved and taxes remitted or deferred.",
  ],
  s0319: [
    "Ninth month: three months' flood ration grain was given to three Henan counties including Huaining.",
    "In month 9, Huaining and two other Henan counties received three months' flood rations.",
  ],
  s0320: [
    "Winter, tenth month, new moon on day jiawu: Ashimu of the Buruts was allowed to inherit a fourth-rank plumed-cap insignia.",
    "On the jiawu new moon in month 10, Burut Ashimu inherited a fourth-rank plume.",
  ],
  s0321: [
    "On day jiyou, Yarkand consultant minister Yijing was transferred to Ili commandant and Lin Kui replaced him.",
    "On jiyou, Yijing left Yarkand for Ili and Lin Kui replaced him.",
  ],
  s0322: [
    "On day renxu, Ili consultant minister Dahong'a was dismissed for illness.",
    "On renxu, ill Dahong'a left the Ili post.",
  ],
  s0323: [
    "Lin Zexu was ordered to proceed to Aksu, Ush, Kuqa, Khotan, and other places to survey and deliberate opening land for cultivation.",
    "Lin Zexu was sent to Aksu, Ush, Kuqa, Khotan, and elsewhere to plan reclamation.",
  ],
  s0324: [
    "On day guihai, Shuxing'a was made Ili consultant minister.",
    "On guihai, Shuxing'a became Ili consultant minister.",
  ],
  s0325: [
    "That month, banner civilians in Bazhou and Yongqing, Zhili, were relieved.",
    "That month, Bazhou and Yongqing banner civilians were relieved.",
  ],
  s0326: [
    "Flood ration grain was given in eight Fengtian prefectures and counties including Jinzhou.",
    "Jinzhou and seven other Fengtian districts received flood rations.",
  ],
  s0327: [
    "New and old quota levies were remitted or deferred for water, drought, and hail disasters in thirty-seven Zhili prefectures and counties including Bazhou, eight Fengtian counties including Jinzhou, and twenty-nine Hubei prefectures, counties, and guards including Mianyang.",
    "Bazhou-area Zhili, Jinzhou-area Fengtian, and Mianyang-area Hubei had disaster taxes remitted or deferred.",
  ],
  s0328: [
    "Eleventh month, day yichou: Gui Liang was permitted to come to audience; Wu Qijun concurrently acted as Yunnan-Guizhou governor-general.",
    "In month 11, yichou, Gui Liang came to audience and Wu Qijun acted Yunnan-Guizhou.",
  ],
  s0329: [
    "Former Vice Minister of Punishments Huang Juezi was employed as an outside-department official.",
    "Huang Juezi, former Punishments vice minister, was used as an outside-department officer.",
  ],
  s0330: [
    "On day jiashen, the Emperor went to the Hall of Great Height to pray for snow.",
    "On jiashen, the Emperor prayed for snow at the Hall of Great Height.",
  ],
  s0331: [
    "That month, ration grain was loaned for poor harvest to the maritime-camp troops at Shengjing's Jinzhou.",
    "That month, Jinzhou maritime-camp troops received poor-harvest ration loans.",
  ],
  s0332: [
    "Twelfth month, new moon on day guisi: the Emperor again went to the Hall of Great Height to pray for snow.",
    "On the guisi new moon in month 12, the Emperor again prayed for snow at the Hall of Great Height.",
  ],
  s0333: [
    "On day gengzi, Lin Zexu was again ordered to proceed to Kashgar to survey opening wasteland.",
    "On gengzi, Lin Zexu was again sent to Kashgar to survey reclamation.",
  ],
  s0334: [
    "On day xinchou, the Emperor again went to the Hall of Great Height to pray for snow.",
    "On xinchou, the Emperor again prayed for snow at the Hall of Great Height.",
  ],
  s0335: [
    "Zhuo Bingdi was made Grand Secretary; Chen Guanjun Minister of Rites and associate Grand Secretary; Du Shoutian Minister of Works; Zhu Qingfan Left Censor-in-Chief.",
    "Zhuo Bingdi became grand secretary; Chen Guanjun took Rites and became associate secretary; Du Shoutian Works; Zhu Qingfan the left censorate.",
  ],
  s0336: [
    "That month, additional disaster ration grain was given to fifteen Henan prefectures and counties including Suizhou, and seed and granary grain were loaned.",
    "That month, Suizhou and fourteen other Henan districts received extra rations plus seed and granary loans.",
  ],
  s0337: [
    "Silver and grain were loaned to garrison troops at Nanjing and artisan soldiers in Jiangsu camps.",
    "Nanjing garrison troops and Jiangsu camp artisans received silver and grain loans.",
  ],
  s0338: [
    "That year, Korea and Siam sent tribute.",
    "That year Korea and Siam paid tribute.",
  ],
  s0339: [
    "Twenty-fifth year, spring, first month, day yichou: the Zhongmou river works in Henan joined.",
    "In year 25, month 1, yichou, Henan's Zhongmou river works closed.",
  ],
  s0340: [
    "On day gengwu, Li Xingyuan was transferred to Jiangsu provincial governor, Huiji to Shaanxi provincial governor, Cheng Yucai made Grain Transport governor-general, and Huang Entong Guangdong provincial governor.",
    "On gengwu, Li Xingyuan took Jiangsu, Huiji Shaanxi, Cheng Yucai Grain Transport, and Huang Entong Guangdong.",
  ],
  s0341: [
    "On day wuzi, Rongzhao was summoned to the capital; Lin Qing was made Urga commissioner.",
    "On wuzi, Rongzhao was called to Beijing and Lin Qing took Urga.",
  ],
  s0342: [
    "That month, ration grain was given to disaster victims in Bazhou and Yongqing, Zhili.",
    "That month, Bazhou and Yongqing disaster victims received rations.",
  ],
  s0343: [
    "Seed grain was loaned to five Jiangxi counties including Dehua, six Hubei counties and guards including Jiangling, and two Hunan counties including Yuanjiang and Anxiang.",
    "Dehua and four other Jiangxi counties, Jiangling and five other Hubei districts, and Yuanjiang and Anxiang received seed loans.",
  ],
  s0344: [
    "On day gengxu, Fujie was made chief steward of the Imperial Household Department.",
    "On gengxu, Fujie became Imperial Household chief steward.",
  ],
  s0345: [
    "On day guichou, Prince Rui of the First Rank Ren Shou, for indiscriminately recommending Haipu, was stripped of left director of the Imperial Clan Court, commanding imperial bodyguard, and inner-palace attendance.",
    "On guichou, Prince Rui Ren Shou lost clan-court, bodyguard, and inner-palace posts for recommending Haipu.",
  ],
  s0346: [
    "Jingzheng, for indiscriminately recommending Mengbao, was stripped of associate Grand Secretary and Minister of Revenue.",
    "Jingzheng lost associate secretary and Revenue for recommending Mengbao.",
  ],
  s0347: [
    "Liang-Guang Governor-General Qiying was ordered to be associate Grand Secretary.",
    "Qiying became associate grand secretary while at Liang-Guang.",
  ],
  s0348: [
    "Saishang'a was transferred to Minister of Revenue and Yucheng to Minister of Works.",
    "Saishang'a took Revenue and Yucheng Works.",
  ],
  s0349: [
    "Wenqing was made Minister of War and Chenggang Left Censor-in-Chief.",
    "Wenqing became War minister and Chenggang left censor-in-chief.",
  ],
  s0350: [
    "Senggelinqin was transferred to commanding imperial bodyguard of the Bordered Yellow Banner.",
    "Senggelinqin took the Bordered Yellow Banner bodyguard command.",
  ],
  s0351: [
    "Chedengbazha'er was made commanding imperial bodyguard of the Plain Yellow Banner.",
    "Chedengbazha'er took the Plain Yellow Banner bodyguard command.",
  ],
  s0352: [
    "On day jiayin, Huiji was transferred to Fujian provincial governor and Deng Tingzhen made Shaanxi provincial governor.",
    "On jiayin, Huiji took Fujian and Deng Tingzhen Shaanxi.",
  ],
  s0353: [
    "On day yichou, the five-port commercial regulations were promulgated.",
    "On yichou, the five-port trade regulations were issued.",
  ],
  s0354: [
    "On day jisi, the Emperor reviewed firearms troops of the Eight Banners at the Old Summer Palace.",
    "On jisi, the Emperor reviewed Eight Banner musketry at Yuanmingyuan.",
  ],
  s0355: [
    "On day weiwei, Lin Qing was dismissed for illness and Chengkai made Urga commissioner.",
    "On weiwei, ill Lin Qing left Urga and Chengkai replaced him.",
  ],
  s0356: [
    "That month, granary grain was loaned for poor harvest in seventeen Shanxi prefectures and counties including Xinzhou.",
    "That month, Xinzhou and sixteen other Shanxi districts received poor-harvest granary loans.",
  ],
  s0357: [
    "Summer, fourth month, day guimao: Gui Liang remained in the capital and He Changling was made Yunnan-Guizhou governor-general.",
    "In month 4, guimao, Gui Liang stayed in Beijing and He Changling took Yunnan-Guizhou.",
  ],
  s0358: [
    "On day jiachen, Wu Qijun was transferred to Fujian provincial governor.",
    "On jiachen, Wu Qijun became Fujian governor.",
  ],
  s0359: [
    "Huiji was made Yunnan provincial governor and Qiao Yongqian Guizhou provincial governor.",
    "Huiji took Yunnan and Qiao Yongqian Guizhou.",
  ],
  s0360: [
    "On day bingwu, the Emperor went to the Black Dragon Pool to pray for rain.",
    "On bingwu, the Emperor prayed for rain at the Black Dragon Pool.",
  ],
  s0361: [
    "On day renzi, Funiyang'a died; Huiji was made Shaanxi provincial governor with Deng Tingzhen acting, and Zheng Zuchen Yunnan provincial governor.",
    "On renzi, Funiyang'a died; Huiji took Shaanxi with Deng Tingzhen acting and Zheng Zuchen Yunnan.",
  ],
  s0362: [
    "On day yimao, Xiao Jingzhong and 217 others were granted jinshi degrees with differentiated ranks.",
    "On yimao, Xiao Jingzhong and 217 others received jinshi ranks.",
  ],
  s0363: [
    "On day bingchen, Yucheng and Xu Naipu were demoted and transferred; Jingzheng was made Minister of Works and He Rulin Minister of War.",
    "On bingchen, Yucheng and Xu Naipu were demoted; Jingzheng took Works and He Rulin War.",
  ],
  s0364: [
    "Fifth month, day bingxu: rain fell.",
    "In month 5, bingxu, it rained.",
  ],
  s0365: [
    "On day dinghai, the Emperor again went to the Black Dragon Pool to pray for rain.",
    "On dinghai, the Emperor again prayed for rain at the Black Dragon Pool.",
  ],
  s0366: [
    "That month, flood ration grain was given to six Shandong counties including Le'an.",
    "That month, Le'an and five other Shandong counties received flood rations.",
  ],
  s0367: [
    "Sixth month, day jiawu: commerce with Belgium was permitted.",
    "In month 6, jiawu, Belgian trade was permitted.",
  ],
  s0368: [
    "An edict halted autumn executions for that year.",
    "Autumn executions were halted that year.",
  ],
  s0369: [
    "On day bingchen, Chong'en was ordered to suppress Nian bandits at Puzhou, Yancheng, and other places.",
    "On bingchen, Chong'en was sent against Nian bandits in Puzhou, Yancheng, and elsewhere.",
  ],
  s0370: [
    "On day xinchou, earthquake victims in Taiwan's Changhua County were relieved.",
    "On xinchou, Changhua earthquake victims in Taiwan were relieved.",
  ],
  s0371: [
    "On day guichou, Aksu commissioner Jirui, for opening wasteland and starting work before reporting to the throne, was dismissed from office.",
    "On guichou, Jirui lost office for starting reclamation before memorializing the throne.",
  ],
  s0372: [
    "On day jiwei, the Taoyuan flood in Jiangsu's Central River Office burst.",
    "On jiwei, Jiangsu Central River Office's Taoyuan flood burst.",
  ],
  s0373: [
    "Regional Commander Qinghe of Gansu's Xining Garrison met barbarian bandits at Jinyang Ridge and died.",
    "Qinghe, Xining regional commander, died fighting bandits at Jinyang Ridge.",
  ],
  s0374: [
    "Huiji was ordered to suppress the barbarian bandits.",
    "Huiji was sent to suppress the barbarian bandits.",
  ],
  s0375: [
    "That month, overdue levies from disaster were deferred for forty-two Shandong prefectures, counties, and guards including Binzhou.",
    "That month, Binzhou and forty-one other Shandong districts had overdue disaster levies deferred.",
  ],
  s0376: [
    "Autumn, seventh month, day xinwei: commerce with Denmark was permitted.",
    "In month 7, xinwei, Danish trade was permitted.",
  ],
  s0377: [
    "Grand Secretary Zhuo Bingdi was ordered to supervise the Ministry of War.",
    "Zhuo Bingdi was ordered to oversee War.",
  ],
  s0378: [
    "On day bingxu, Dahong'a was ordered to proceed to Gansu to investigate and handle the barbarian bandits.",
    "On bingxu, Dahong'a was sent to Gansu to handle the barbarian bandits.",
  ],
  s0379: [
    "Eighth month, day renchen: for the Empress Dowager's seventieth birthday, land tax actually owed before Daoguang 20 was remitted.",
    "In month 8, renchen, for the empress dowager's seventieth birthday, land tax owed before Daoguang 20 was remitted.",
  ],
  s0380: [
    "On day xinchou, Zheng Zuchen was transferred to Fujian provincial governor, Liang Yuhan to Yunnan, and Wu Qijun to Shanxi.",
    "On xinchou, Zheng Zuchen took Fujian, Liang Yuhan Yunnan, and Wu Qijun Shanxi.",
  ],
  s0381: [
    "Jingzheng was dismissed for illness; Tedeng'e was transferred to Minister of Works and Baochang Minister of Rites.",
    "Ill Jingzheng left office; Tedeng'e took Works and Baochang Rites.",
  ],
  s0382: [
    "On day bingxu, Lin Zexu was summoned to the capital to await assignment as fourth- or fifth-rank capital official.",
    "On bingxu, Lin Zexu was called to Beijing for fourth- or fifth-rank capital appointment.",
  ],
  s0383: [
    "Xi'en was dismissed for illness and Yixiang transferred to Shengjing general.",
    "Ill Xi'en left office and Yixiang became Shengjing general.",
  ],
  s0384: [
    "Winter, tenth month, day jiawu: the Empress Dowager was given the honorific title \"Reverent, Kind, Tranquil, Prosperous, Accomplished, Solemn, Bountiful, Long-lived, Auspicious, Esteemed, Blessed Empress Dowager.\"",
    "In month 10, jiawu, the empress dowager received a new twelve-character honorific title.",
  ],
  s0385: [
    "The Emperor presented the registers and seals; the princes, dukes, and grand ministers performed congratulations.",
    "The Emperor presented registers and seals and princes, dukes, and ministers congratulated.",
  ],
  s0386: [
    "On day wuxu, on the Empress Dowager's seventieth birthday, the Emperor led princes, dukes, and grand ministers in congratulations.",
    "On wuxu, the empress dowager's seventieth birthday, the Emperor led congratulations.",
  ],
  s0387: [
    "On day xinchou, Li Zongfang was dismissed for illness; Zhu Qingfan Minister of Rites and Wei Yuanhuang Left Censor-in-Chief.",
    "On xinchou, ill Li Zongfang left office; Zhu Qingfan took Rites and Wei Yuanhuang the left censorate.",
  ],
  s0388: [
    "On day guimao, because the empress dowager honorific ceremony was complete, an edict granted differentiated general amnesty.",
    "On guimao, after the honorific rites, differentiated amnesty was granted.",
  ],
  s0389: [
    "On day bingwu, banner rent owed by civilians in Zhili before Daoguang 20 was remitted.",
    "On bingwu, Zhili civilian banner rent owed before Daoguang 20 was remitted.",
  ],
  s0390: [
    "That month, disaster victims in four Zhili counties including Baodi were relieved.",
    "That month, Baodi and three other Zhili counties were relieved.",
  ],
  s0391: [
    "Eleventh month, day xinyou: Shaanxi-Gansu Governor-General Huiji died; Buyantai was made Shaanxi-Gansu governor-general with Lin Zexu acting; Saying'a Ili general and Gui Liang Rehe governor-general.",
    "In month 11, xinyou, Huiji died; Buyantai took Shaanxi-Gansu with Lin Zexu acting, Saying'a Ili, and Gui Liang Rehe.",
  ],
  s0392: [
    "On day guihai, Censor Chen Qingyong was demoted and transferred.",
    "On guihai, Chen Qingyong was demoted and transferred.",
  ],
  s0393: [
    "That month, silver was loaned to soldiers in straitened Rehe hunting grounds.",
    "That month, Rehe hunting-ground soldiers received silver loans.",
  ],
  s0394: [
    "Twelfth month, day xinmao: the Emperor went to the Hall of Great Height to pray for snow.",
    "In month 12, xinmao, the Emperor prayed for snow at the Hall of Great Height.",
  ],
  s0395: [
    "On day wuxu, rent grain and rice owed by civilians in Taiwan before Daoguang 20 was remitted.",
    "On wuxu, Taiwan civilian rent grain and rice owed before Daoguang 20 was remitted.",
  ],
  s0396: [
    "On day guimao, the Emperor again went to the Hall of Great Height to pray for snow.",
    "On guimao, the Emperor again prayed for snow at the Hall of Great Height.",
  ],
  s0397: [
    "On day guichou, the Emperor again went to the Hall of Great Height to pray for snow.",
    "On guichou, the Emperor again prayed for snow at the Hall of Great Height.",
  ],
  s0398: [
    "That year, Korea and Vietnam sent tribute.",
    "That year Korea and Vietnam paid tribute.",
  ],
  s0399: [
    "Twenty-sixth year, spring, first month, day gengchen: Saishang'a and Zhou Zupei were ordered to survey the river defenses.",
    "In year 26, month 1, gengchen, Saishang'a and Zhou Zupei were sent to survey river defenses.",
  ],
  s0400: [
    "On day xinsi, the ban on Catholicism was relaxed.",
    "On xinsi, the Catholic ban was relaxed.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b04.mjs <translation.json>'
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
