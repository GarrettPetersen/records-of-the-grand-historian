#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day xinwei, Jilin pearl tribute was suspended.',
    'On xinwei day, Jilin pearl tribute was halted.',
  ],
  s0502: [
    'That month, seed grain and ration grain were issued to disaster victims in Bao\'an, Shaanxi, and granary grain was loaned to four prefectures and counties including Suide.',
    'That month, Bao\'an received disaster seed and rations and Suide and three other districts received granary loans.',
  ],
  s0503: [
    'Old and new quota levies were remitted or deferred for ten Shanxi prefectures and counties including Yingzhou and three cities including Qiqihar that suffered disaster.',
    'Old and new quotas were remitted or deferred for Yingzhou and nine other Shanxi units and three Qiqihar cities.',
  ],
  s0504: [
    'Eleventh month, day xinmao: Chang Ling was advanced to first-rank Marquis of Weiyong.',
    'In month 11, xinmao, Chang Ling was made first-rank Marquis of Weiyong.',
  ],
  s0505: [
    'That month, seed grain and ration grain from granaries were loaned to the poor in nine Gansu prefectures and counties including Jinzhou, thirteen Jiangxi counties including Nanchang, and five Shaanxi prefectures and counties including Jiazhou that suffered disaster.',
    'That month, disaster seed and granary rations were loaned across Gansu, Jiangxi, and Shaanxi districts.',
  ],
  s0506: [
    'Twelfth month, day dingwei: Liangshan Yi bandits were pacified.',
    'In month 12, dingwei, Liangshan Yi rebels were pacified.',
  ],
  s0507: [
    'On day jisi, Li Zongfang left office on bereavement and Zhuo Bingtian was made Left Censor-in-Chief.',
    'On jisi day, Li Zongfang mourned out and Zhuo Bingtian became left censor-in-chief.',
  ],
  s0508: [
    'On day gengwu, Yande was kept in the capital on account of age and Gunchukeceleng was made Suiyuan City general.',
    'On gengwu day, Yande stayed in Beijing for age and Gunchukeceleng became Suiyuan City general.',
  ],
  s0509: [
    'That month, next spring\'s ration grain and seed grain were loaned to Dingbian and Anding, Shaanxi.',
    'That month, Dingbian and Anding received spring ration and seed loans.',
  ],
  s0510: [
    'That year, Korea, Ryukyu, Siam, and Vietnam sent tribute.',
    'That year, Korea, Ryukyu, Siam, and Vietnam paid tribute.',
  ],
  s0511: [
    'Eighteenth year, first month, new moon on day jiaxu: Kuizhao and Wenqing were made Grand Councilors.',
    'In year 18, month 1, jiaxu new moon, Kuizhao and Wenqing joined the Grand Council.',
  ],
  s0512: [
    'On day yihai, Grand Tutor, Grand Secretary, and first-rank Duke Chang Ling died.',
    'On yihai day, Grand Tutor and Grand Secretary Chang Ling died.',
  ],
  s0513: [
    'On day bingzi, the Emperor visited Chang Ling\'s residence to grant mourning gifts.',
    'On bingzi day, the Emperor mourned at Chang Ling\'s house.',
  ],
  s0514: [
    'On day yiyou, Sichuan Yi bandits were pacified.',
    'On yiyou day, Sichuan Yi rebels were pacified.',
  ],
  s0515: [
    'That month, ration grain, seed grain, and granary grain were loaned to disaster victims in fourteen Gansu prefectures, departments, and counties including Guyuan and five Shanxi prefectures and counties including Pingding.',
    'That month, disaster relief grain was loaned across Guyuan and other Gansu units and Pingding and four other Shanxi units.',
  ],
  s0516: [
    'Second month, new moon on day guimao: Qishan was made Grand Secretary while continuing to act as Zhili governor-general.',
    'In month 2, guimao new moon, Qishan became grand secretary and still acted Zhili governor-general.',
  ],
  s0517: [
    'Yunnan-Guizhou Governor-General Yilibu was made associate Grand Secretary while remaining in office.',
    'Yilibu became associate grand secretary and kept his Yunnan-Guizhou post.',
  ],
  s0518: [
    'On day yisi, Shi Zhiyan left office on illness and Qi was made Minister of Justice, Yiliang Guangdong governor.',
    'On yisi day, Shi Zhiyan retired ill; Qi took justice and Yiliang took Guangdong.',
  ],
  s0519: [
    'On day renxu, Karashahr city was repaired.',
    'On renxu day, Karashahr city was repaired.',
  ],
  s0520: [
    'On day wuchen, Zhejiang sea dikes were repaired.',
    'On wuchen day, Zhejiang sea dikes were repaired.',
  ],
  s0521: [
    'That month, seed grain was loaned for poor harvest in Huaiyuan and Fugu, Shaanxi.',
    'That month, Huaiyuan and Fugu received poor-harvest seed loans.',
  ],
  s0522: [
    'Third month, day yihai: for the tomb visit, Prince Su and others were left in the capital to handle affairs.',
    'On yihai in month 3, Prince Su and others stayed in Beijing for the tomb visit.',
  ],
  s0523: [
    'On day wuzi, the Emperor, escorting the Empress Dowager, paid rites at the Western Tombs; one-third of quota levies in passed areas was remitted.',
    'On wuzi day, the Emperor escorted the Empress Dowager to the Western Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0524: [
    'The Emperor paid rites at Tai Tomb, Tai East Tomb, and Chang Tomb and offered wine at the mausolea of Empresses Xiaomu and Xiaoshen.',
    'The Emperor worshipped at Tai, Tai East, and Chang tombs and made offerings at Xiaomu and Xiaoshen.',
  ],
  s0525: [
    'On day yiwei, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On yiwei day, the Emperor and Empress Dowager returned to Beijing.',
  ],
  s0526: [
    'On day bingshen, the Emperor visited the Southern Park for the battue; on days wuxu and jiwei he did the same.',
    'On bingshen day the Emperor hunted at the Southern Park, and again on wuxu and jiwei.',
  ],
  s0527: [
    'On day gengzi, the Emperor returned to the capital.',
    'On gengzi day, the Emperor returned to Beijing.',
  ],
  s0528: [
    'On day xinchou, Galedanxielietu Samadibakshi presented tribute.',
    'On xinchou day, Galedanxielietu Samadibakshi paid tribute.',
  ],
  s0529: [
    'That month, granary grain was loaned for last year\'s poor harvest in thirteen Shanxi prefectures, departments, and counties including Liaozhou.',
    'That month, Liaozhou and twelve other Shanxi units received loans for last year\'s poor harvest.',
  ],
  s0530: [
    'Summer, fourth month, day gengshen: because Funiyang\'a and others built an academy at Urumqi, they were punished to varying degrees.',
    'In month 4, gengshen, Funiyang\'a and others were punished for building an Urumqi academy.',
  ],
  s0531: [
    'An edict ordered Xinjiang generals, commandants, and grand ministers to drill troops earnestly so that all would be practiced in battle array and not abandon substantive duties for empty reputation.',
    'The court ordered Xinjiang commanders to drill troops in earnest and not chase empty reputation over real duty.',
  ],
  s0532: [
    'On day jiazi, Wu Changhua was made Hubei governor.',
    'On jiazi day, Wu Changhua became Hubei governor.',
  ],
  s0533: [
    'On day bingyin, Niu Fubao and one hundred ninety-four others were granted jinshi degrees and metropolitan graduate ranks in varying grades.',
    'On bingyin day, Niu Fubao and 194 others received jinshi and metropolitan ranks.',
  ],
  s0534: [
    'On day xinwei, Yichu was made Ili general and Tuanduobu Ili assistant commissioner.',
    'On xinwei day, Yichu became Ili general and Tuanduobu Ili assistant commissioner.',
  ],
  s0535: [
    'Intercalary fourth month, day bingzi: the Emperor prayed for rain at Black Dragon Pool.',
    'In intercalary month 4, bingzi, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0536: [
    'On day xinsi, it rained.',
    'On xinsi day, rain fell.',
  ],
  s0537: [
    'Honglu Temple Director Huang Juezi memorialized that all who smoked opium within the interior should be punished with death.',
    'Huang Juezi urged the death penalty for inland opium smokers.',
  ],
  s0538: [
    'The generals of Fengtian, Jilin, and Heilongjiang and the governors-general and governors of the provinces were ordered each to set forth his views in memorials.',
    'Fengtian, Jilin, and Heilongjiang generals and provincial governors were ordered to submit opinions.',
  ],
  s0539: [
    'On day jichou, Xi\'en was stripped of Grand Guardian of the Heir Apparent rank and the Ministry of War post; Chengge was transferred to Minister of War; Eshan was made Minister of Justice; Baoxing Sichuan governor-general; Qiying Fengtian general; Huiji Rehe commandant.',
    'On jichou day, Xi\'en lost Grand Guardian and war minister posts; Chengge, Eshan, Baoxing, Qiying, and Huiji were reassigned.',
  ],
  s0540: [
    'On day gengyin, Yiji was transferred to Minister of Revenue, Chengge to Minister of Rites, and Yihou Minister of War.',
    'On gengyin day, Yiji took revenue, Chengge rites, and Yihou war.',
  ],
  s0541: [
    'Fifth month, day bingwu: the Emperor prayed for rain at Black Dragon Pool.',
    'In month 5, bingwu, the Emperor again prayed for rain at Black Dragon Pool.',
  ],
  s0542: [
    'On day jiyou, it rained.',
    'On jiyou day, rain fell.',
  ],
  s0543: [
    'On day guichou, Grand Secretary Ruan Yuan retired.',
    'On guichou day, Grand Secretary Ruan Yuan retired.',
  ],
  s0544: [
    'Wang Ding was made Grand Secretary while continuing to oversee the Ministry of Justice; Tang Jinzhang Minister of Revenue and associate Grand Secretary; Zhu Shiyan Minister of Personnel; Zhuo Bingtian Minister of War; Yao Yuanzhi Left Censor-in-Chief.',
    'Wang Ding became grand secretary over justice; Tang Jinzhang revenue and associate grand secretary; Zhu Shiyan personnel; Zhuo Bingtian war; Yao Yuanzhi left censor-in-chief.',
  ],
  s0545: [
    'On day wuchen, Prince Dun Min Kai was removed from inner-court attendance and the post of clan prince, and deprived of three years\' princely stipend.',
    'On wuchen day, Prince Dun Min Kai lost inner-court and clan-prince duties and forfeited three years\' stipend.',
  ],
  s0546: [
    'Sixth month, day xinwei: overdue levies and copper and lead due from factories were remitted for Mabian and Leibo departments, Sichuan.',
    'In month 6, xinwei, Mabian and Leibo had overdue levies and factory dues remitted.',
  ],
  s0547: [
    'On day dingchou, Prince Dun Min Kai was reduced to commandery prince.',
    'On dingchou day, Prince Dun Min Kai was demoted to commandery prince.',
  ],
  s0548: [
    'On day jimao, Tuanduobu was made Tarbagatai assistant commissioner and Guanfu Ili assistant commissioner.',
    'On jimao day, Tuanduobu became Tarbagatai assistant commissioner and Guanfu Ili assistant commissioner.',
  ],
  s0549: [
    'That month, ration grain was issued to soldiers and civilians under Zhenyuan prefecture, Guizhou, who suffered flood.',
    'That month, flood rations went to Zhenyuan prefecture troops and people.',
  ],
  s0550: [
    'Autumn, seventh month, day wushen: Minister of Justice Eshan died; Baoxing was made Minister of Justice and Su Tingyu acted Sichuan governor-general.',
    'In month 7, wushen, Eshan died; Baoxing took justice and Su Tingyu acted Sichuan.',
  ],
  s0551: [
    'Eighth month, day bingxu: because Lin Zexu and others memorialized on seized opium traffickers and confiscated smoking paraphernalia, an edict praised them.',
    'In month 8, bingxu, the court praised Lin Zexu\'s report on seized traffickers and confiscated opium gear.',
  ],
  s0552: [
    'On day jichou, Chengge left office; Kuizhao was made Minister of Rites and Enming Left Censor-in-Chief.',
    'On jichou day, Chengge left office; Kuizhao took rites and Enming became left censor-in-chief.',
  ],
  s0553: [
    'Yiji was ordered to oversee the Court of Colonial Affairs.',
    'Yiji was placed over the Court of Colonial Affairs.',
  ],
  s0554: [
    'Saishang\'a acted Minister of the Court of Colonial Affairs and Buyantai Chahar commandant.',
    'Saishang\'a acted colonial minister and Buyantai became Chahar commandant.',
  ],
  s0555: [
    'That month, ration grain was issued to disaster victims in Anding and Fugu, Shaanxi.',
    'That month, Anding and Fugu received disaster rations.',
  ],
  s0556: [
    'Ninth month, day bingwu: Prince Zhuang Yi Bo and others were stripped of rank for smoking opium.',
    'In month 9, bingwu, Prince Zhuang Yi Bo and others lost rank for opium use.',
  ],
  s0557: [
    'On day dingwei, the Emperor reviewed the Jianrui Camp troops.',
    'On dingwei day, the Emperor reviewed Jianrui Camp troops.',
  ],
  s0558: [
    'On day jiyou, Vice Director of the Court of Imperial Sacrifices Xu Naiji asked that the opium prohibition be relaxed and was ordered to retire.',
    'On jiyou day, Xu Naiji urged relaxing the opium ban and was retired.',
  ],
  s0559: [
    'Lin Zexu was summoned to the capital and Wu Changhua acted Huguang governor-general.',
    'Lin Zexu was called to Beijing and Wu Changhua acted Huguang.',
  ],
  s0560: [
    'On day xinyou, Qian Baochen was transferred to Jiangxi governor and Yutai Hunan governor.',
    'On xinyou day, Qian Baochen went to Jiangxi and Yutai to Hunan.',
  ],
  s0561: [
    'Minister of Personnel Zhu Shiyan died; Tang Jinzhang was transferred to Minister of Personnel, Wu Chun Minister of Revenue, and Gong Shouzheng acted Minister of Rites.',
    'Zhu Shiyan died; Tang Jinzhang took personnel, Wu Chun revenue, and Gong Shouzheng acted rites.',
  ],
  s0562: [
    'That month, ration grain was issued to disaster victims in Weixian, Shandong.',
    'That month, Weixian received disaster rations.',
  ],
  s0563: [
    'Winter, tenth month, day gengyin: Sheng Gui was made Uliassutai assistant commissioner.',
    'In month 10, gengyin, Sheng Gui became Uliassutai assistant commissioner.',
  ],
  s0564: [
    'That month, old and new quota levies were remitted or deferred for thirteen Zhili prefectures and counties including Shenzhou, twenty-two Jiangxi counties including Nanchang, thirty-four Anhui prefectures, counties, guards, and banners including Shouzhou, eleven Henan counties including Neihuang, eight Hunan prefectures, counties, and guards including Lizhou, and Fengtian\'s Ningyuan prefecture that suffered disaster.',
    'That month, disaster quotas were remitted or deferred across Zhili, Jiangxi, Anhui, Henan, Hunan, and Ningyuan.',
  ],
  s0565: [
    'Eleventh month, day renyin: Yilibu and others were ordered to investigate and ban opium-poppy cultivation in Yunnan.',
    'In month 11, renyin, Yilibu and others were ordered to ban Yunnan poppy growing.',
  ],
  s0566: [
    'On day renzi, Baoxing was made Sichuan governor-general, Enming Minister of Justice, and Yucheng Left Censor-in-Chief.',
    'On renzi day, Baoxing took Sichuan, Enming justice, and Yucheng became left censor-in-chief.',
  ],
  s0567: [
    'On day guichou, Lin Zexu was made Imperial Commissioner to investigate the Guangdong port affair and to command that province\'s naval forces.',
    'On guichou day, Lin Zexu became Imperial Commissioner for Guangdong ports and commanded its fleet.',
  ],
  s0568: [
    'Zhou Tianjue acted Huguang governor-general and Tielin acted Grand Canal director-general.',
    'Zhou Tianjue acted Huguang and Tielin acted Grand Canal transport.',
  ],
  s0569: [
    'On day dingsi, the Emperor prayed for snow at the Dagao Hall.',
    'On dingsi day, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0570: [
    'Guqing was made Kobdo assistant commissioner.',
    'Guqing became Kobdo assistant commissioner.',
  ],
  s0571: [
    'On day yichou, Minister of War Yihou was stripped of office; Yucheng was transferred to Minister of War and Longwen Left Censor-in-Chief.',
    'On yichou day, Yihou was dismissed; Yucheng took war and Longwen became left censor-in-chief.',
  ],
  s0572: [
    'On day bingyin, Hafeng\'a was summoned to the capital and Shulunbao acted Heilongjiang general.',
    'On bingyin day, Hafeng\'a was called to Beijing and Shulunbao acted Heilongjiang.',
  ],
  s0573: [
    'That month, relief grain was given to Huaiyuan and Anding, Shaanxi, and to soldiers and civilians in the Ningguta Sanxing region.',
    'That month, Huaiyuan, Anding, and Ningguta Sanxing received relief rations.',
  ],
  s0574: [
    'Twelfth month, new moon on day wuchen: bandits including Xie Fazhen of Renhuai county, Guizhou, rose in revolt, and Yilibu was ordered to suppress them.',
    'At the twelfth-month new moon, wuchen, Renhuai rebels led by Xie Fazhen rose and Yilibu was ordered to suppress them.',
  ],
  s0575: [
    'On day xinwei, Commandery Prince Dun Min Kai died and was posthumously restored to princely rank.',
    'On xinwei day, Commandery Prince Dun Min Kai died and was posthumously restored as prince.',
  ],
  s0576: [
    'The Emperor personally attended his mourning three times to grant offerings.',
    'The Emperor thrice mourned at his funeral in person.',
  ],
  s0577: [
    'On day yihai, the Emperor again prayed for snow at the Dagao Hall.',
    'On yihai day, the Emperor again prayed for snow at Dagao Hall.',
  ],
  s0578: [
    'On day bingxu, the Emperor again prayed for snow at the Dagao Hall.',
    'On bingxu day, the Emperor prayed for snow at Dagao Hall again.',
  ],
  s0579: [
    'On day gengyin, the Urga assisting commissioner stationed at Kobdo was redesignated Kobdo assisting commissioner.',
    'On gengyin day, the Urga assisting post at Kobdo became the Kobdo assisting commissioner.',
  ],
  s0580: [
    'On day xinmao, Saishang\'a was appointed Minister of the Court of Colonial Affairs.',
    'On xinmao day, Saishang\'a became colonial minister.',
  ],
  s0581: [
    'On day yiwei, Left Censor-in-Chief Yao Yuanzhi left office and Gong Shouzheng replaced him.',
    'On yiwei day, Yao Yuanzhi left office and Gong Shouzheng replaced him.',
  ],
  s0582: [
    'Because the bandit disturbance was pacified, Yilibu was awarded the double-eyed peacock feather and Yu Buyun was advanced to Junior Guardian of the Heir Apparent.',
    'With the rebels pacified, Yilibu received the double-eyed peacock feather and Yu Buyun became Junior Guardian.',
  ],
  s0583: [
    'That year, Korea, Ryukyu, and Siam sent tribute.',
    'That year, Korea, Ryukyu, and Siam paid tribute.',
  ],
  s0584: [
    'Nineteenth year, first month, new moon on day wuxu: Commandery Prince of Hui Min Yu was advanced to prince.',
    'In year 19, month 1, wuxu new moon, Commandery Prince Min Yu became prince.',
  ],
  s0585: [
    'On day wuwu, Yishan was summoned to the capital and Guanfu acted Ili general.',
    'On wuwu day, Yishan was called to Beijing and Guanfu acted Ili.',
  ],
  s0586: [
    'That month, ration grain and seed grain were loaned for flood, drought, and hail disasters in Wuling county, Hunan, nine Shaanxi prefectures and counties including Jiazhou, and five Gansu prefectures and counties including Guyuan.',
    'That month, disaster rations and seed were loaned in Wuling, Jiazhou, and Guyuan districts.',
  ],
  s0587: [
    'Second month, day renwu: the palace examination of Hanlin and Household officials was held; Li Guoqi and three others were raised to first class and the rest were promoted or demoted in varying degrees.',
    'In month 2, renwu, the palace exam was held; Li Guoqi and three others took first rank.',
  ],
  s0588: [
    'On day bingxu, for the Eastern Tombs visit, Prince Su Jingmin and others were left in the capital to handle affairs.',
    'On bingxu day, Prince Su Jingmin and others stayed in Beijing for the Eastern Tombs visit.',
  ],
  s0589: [
    'Lin Zexu was ordered to proceed to Humen and Macao to guard against foreign ships entering port and domestic criminals going to sea.',
    'Lin Zexu was sent to Humen and Macao to block foreign entry and domestic smuggling at sea.',
  ],
  s0590: [
    'Third month, day gengzi: the Emperor paid rites at the Eastern Tombs; one-third of quota levies in passed areas was remitted.',
    'In month 3, gengzi, the Emperor worshipped at the Eastern Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0591: [
    'On day xinchou, Wu Chun left office on illness; He Linghan was transferred to Minister of Revenue; Chen Guanjun Minister of Works; Gong Shouzheng Minister of Rites; Liao Hongquan Left Censor-in-Chief.',
    'On xinchou day, Wu Chun retired ill; He Linghan took revenue; Chen Guanjun works; Gong Shouzheng rites; Liao Hongquan left censor-in-chief.',
  ],
  s0592: [
    'On day guimao, the Emperor paid rites at Zhaoxi Tomb, Xiao Tomb, Xiao East Tomb, Jing Tomb, and Yu Tomb and offered wine at the mausoleum of the Crown Prince Duanhui.',
    'On guimao day, the Emperor worshipped at Zhaoxi, Xiao, Xiao East, Jing, and Yu tombs and made offerings at Crown Prince Duanhui.',
  ],
  s0593: [
    'On day yisi, Tao Zhu left office on illness; Lin Zexu was transferred to Liangjiang governor-general, Chen Luan acting, Yu Qian acting Jiangsu governor, Gui Liang Huguang governor-general, and Zhu Shu Henan governor.',
    'On yisi day, Tao Zhu retired; Lin Zexu took Liangjiang with Chen Luan acting, Yu Qian Jiangsu, Gui Liang Huguang, and Zhu Shu Henan.',
  ],
  s0594: [
    'On day bingwu, the Emperor visited the Southern Park for the battue.',
    'On bingwu day, the Emperor hunted at the Southern Park.',
  ],
  s0595: [
    'On day xinhai, the Emperor returned to the capital.',
    'On xinhai day, the Emperor returned to Beijing.',
  ],
  s0596: [
    'On day yimao, because Lin Zexu and others memorialized that receiving ships had presented opium for surrender, an edict praised them and granted rewards.',
    'On yimao day, the court praised Lin Zexu for surrendered opium from receiving ships and granted rewards.',
  ],
  s0597: [
    'Lin Zexu and others were approved in memorializing to defer for the time being deliberation on cutting off mutual trade.',
    'The court approved Lin Zexu\'s request to postpone cutting off foreign trade.',
  ],
  s0598: [
    'Urumqi commandant Lian Jing was transferred to Chengdu general, Huiji replacing him; Enming Rehe commandant; Longwen Minister of Justice.',
    'Lian Jing left Urumqi for Chengdu; Huiji replaced him; Enming took Rehe and Longwen justice.',
  ],
  s0599: [
    'On day bingchen, Tielin was made Left Censor-in-Chief.',
    'On bingchen day, Tielin became left censor-in-chief.',
  ],
  s0600: [
    'Summer, fourth month, day xinwei: Wu Wenrong was made Fujian governor.',
    'In month 4, xinwei, Wu Wenrong became Fujian governor.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b06.mjs <translation.json>'
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
