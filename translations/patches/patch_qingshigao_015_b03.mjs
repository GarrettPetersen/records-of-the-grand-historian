#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day wuchen, relief was given for flood disaster in Mianyang and Huanggang in Hubei.',
    'On wuchen, Mianyang and Huanggang in Hubei received flood relief.',
  ],
  s0202: [
    'On day guiyou, quota taxes for last year\'s flood disaster were remitted for twenty-one Anhui prefectures, counties, guards, and posts including Suzhou.',
    'On guiyou, twenty-one Anhui districts including Suzhou lost last year\'s flood taxes.',
  ],
  s0203: [
    'Winter, tenth month, day gengyin: Gurkhas invaded Sakya in rear Tibet.',
    'In month 10, gengyin, Gurkhas invaded Sakya in rear Tibet.',
  ],
  s0204: [
    'Sun Shiyi was ordered to leave the passes and supervise suppression.',
    'Sun Shiyi was sent beyond the passes to command suppression.',
  ],
  s0205: [
    'On day jiawu, relief was given for flood disaster in Qianjiang, Hubei.',
    'On jiawu, Qianjiang in Hubei received flood relief.',
  ],
  s0206: [
    'On day bingshen, relief was given for flood disaster in thirty-six Hubei prefectures and counties including Jiangxia.',
    'On bingshen, thirty-six Hubei districts including Jiangxia received flood relief.',
  ],
  s0207: [
    'On day jihai, because Lê Duy Kỳ was weak and feeble, Sun Shiyi was instructed to select a Lê descendant to come to the capital to pay tribute.',
    'On jihai, Sun Shiyi was told to choose a Lê heir for Beijing tribute because Lê Duy Kỳ was feeble.',
  ],
  s0208: [
    'On day gengzi, Yunnan provincial commander Wuda Jing was ordered to lead troops beyond the passes and send a proclamation summoning Nguyễn Huệ and others to submit.',
    'On gengzi, Wuda Jing marched out with a summons for Nguyễn Huệ to surrender.',
  ],
  s0209: [
    'On day guimao, Shu Lian was transferred to be resident commissioner in Tibet and Heng Rui was made Ili assistant commissioner.',
    'On guimao, Shu Lian took Tibet and Heng Rui, Ili.',
  ],
  s0210: [
    'Dorjia was transferred to be Mukden general; Hengxiu was made Jilin general.',
    'Dorjia became Mukden general and Hengxiu, Jilin general.',
  ],
  s0211: [
    'Songchun was changed to Xi\'an general, with Xingzhao replacing him.',
    'Songchun became Xi\'an general and Xingzhao replaced him.',
  ],
  s0212: [
    'Linning was made Heilongjiang general.',
    'Linning became Heilongjiang general.',
  ],
  s0213: [
    'On day yimao, Li Shiyao fell ill and Fukang\'an was ordered to act as Fujian-Zhejiang governor-general.',
    'On yimao, ill Li Shiyao left Fukang\'an acting as Fujian-Zhejiang governor-general.',
  ],
  s0214: [
    'Eleventh month, day xinyou: this year\'s flood quota taxes were remitted with differing amounts for twenty-six Anhui prefectures, counties, and guards including Wangjiang.',
    'In month 11, xinyou, twenty-six Anhui districts including Wangjiang lost this year\'s flood taxes, by degree.',
  ],
  s0215: [
    'On day jiazi, Li Shiyao died and Fukang\'an replaced him.',
    'On jiazi, Li Shiyao died and Fukang\'an succeeded him.',
  ],
  s0216: [
    'Lebao was made Shaanxi-Gansu governor-general and Haining was made Shanxi governor.',
    'Lebao took Shaanxi-Gansu and Haining, Shanxi.',
  ],
  s0217: [
    'On day bingzi, dikes at Jiangling and Gong\'an in Hubei were repaired.',
    'On bingzi, Hubei dikes at Jiangling and Gong\'an were repaired.',
  ],
  s0218: [
    'This year\'s flood quota taxes were remitted with differing amounts for thirty-six Hubei prefectures and counties including Jiangling.',
    'Thirty-six Hubei districts including Jiangling lost this year\'s flood taxes, by degree.',
  ],
  s0219: [
    'Twelfth month, day jichou: Fulehun and Yade were released.',
    'In month 12, jichou, Fulehun and Yade were freed.',
  ],
  s0220: [
    'Sun Shiyi memorialized defeating rebels on the Shouchang River.',
    'Sun Shiyi reported victory on the Shouchang River.',
  ],
  s0221: [
    'On day guisi, rebels were again defeated on the Shiqiu River.',
    'On guisi, rebels were beaten again at Shiqiu River.',
  ],
  s0222: [
    'On day bingshen, Licheng was recovered; Lê Duy Kỳ was re-enfeoffed as king of Annam; Sun Shiyi was enfeoffed as a first-class Duke of Sincere Planning and Brave Merit; Xu Shiheng was made a first-class baron.',
    'On bingshen, Licheng was taken, Lê Duy Kỳ restored as Annam king, Sun Shiyi made a first-class duke, and Xu Shiheng a first-class baron.',
  ],
  s0223: [
    'On day wushen, Sun Shiyi was ordered to withdraw the army.',
    'On wushen, Sun Shiyi was ordered to withdraw.',
  ],
  s0224: [
    'Fifty-fourth year, spring, first month, day jiwei: because the New Year audience was disorderly, the supervisory censor of the rites and others were stripped of office; Minister Debao had his plume and cap removed; the presidents of the Censorate and Court of State Ceremonial were all severely censured at the Board of Punishments.',
    'In year 54 spring, jiwei New Year, rites disorder cost censors their posts, Debao his insignia, and Censorate and Honglu chiefs a severe board hearing.',
  ],
  s0225: [
    'On day gengshen, Cheng De memorialized recovery of Dzongkha and Gyirong and capture of Nyalam.',
    'On gengshen, Cheng De reported recovery of Dzongkha, Gyirong, and Nyalam.',
  ],
  s0226: [
    'On day guiyou, Minister of Rites Debao died and Chang Qing replaced him.',
    'On guiyou, Debao died and Chang Qing took rites.',
  ],
  s0227: [
    'On day jiaxu, because Burma\'s Meng Yun had repented and submitted, he was instructed to live at peace with neighbors, and King Zheng Hua of Siam was given silks and told to end enmity and strife.',
    'On jiaxu, repentant Burma was told to keep peace and Siam\'s Zheng Hua was bribed to end feuds.',
  ],
  s0228: [
    'Arrears of quota taxes were remitted for six Fujian prefectures and counties including Danshui on account of disaster.',
    'Six Fujian districts including Danshui lost disaster tax arrears.',
  ],
  s0229: [
    'On day guiwei, Nguyễn Huệ again seized Licheng and Guangxi provincial commander Xu Shiheng and others died in battle.',
    'On guiwei, Nguyễn Huệ retook Licheng and Xu Shiheng and other Guangxi commanders fell.',
  ],
  s0230: [
    'Sun Shiyi was summoned to the capital and stripped of his ducal rank.',
    'Sun Shiyi was called to Beijing and lost his dukedom.',
  ],
  s0231: [
    'Fukang\'an was transferred to be Liangguang governor-general.',
    'Fukang\'an became Liangguang governor-general.',
  ],
  s0232: [
    'Wulana was made Fujian-Zhejiang governor-general and Liang Kentang was made Henan governor.',
    'Wulana took Fujian-Zhejiang and Liang Kentang, Henan.',
  ],
  s0233: [
    'Hailu was made Guangxi provincial commander.',
    'Hailu became Guangxi commander.',
  ],
  s0234: [
    'On day jiashen, the king of Annam, Lê Duy Kỳ, again fled to refuge; he was ordered settled in Guangxi.',
    'On jiashen, Lê Duy Kỳ fled again and was settled in Guangxi.',
  ],
  s0235: [
    'On day bingxu, Sun Shiyi was stripped of office but ordered still to wear a governor\'s insignia and handle affairs at Zhennan Pass.',
    'On bingxu, Sun Shiyi lost office but kept governor rank at Zhennan Pass.',
  ],
  s0236: [
    'Second month, day gengyin: because the capital evaluation period had come, Agui and other grand secretaries were given performance reviews; Secretariat academician Xie Yong and others were censured at the Board of Punishments; Lifanyuan vice president Fulu retired at his original rank; Fukang\'an and other governors-general were given evaluations.',
    'In month 2 gengyin, Agui and others were reviewed, Xie Yong censured, Fulu retired, and Fukang\'an reviewed.',
  ],
  s0237: [
    'On day dingyou, Lebao had audience and Bayansan acted as Shaanxi-Gansu governor-general.',
    'On dingyou, Lebao had audience and Bayansan acted at Shaanxi-Gansu.',
  ],
  s0238: [
    'Gebeng\'e, leading officer in Khotan, was found guilty on investigation of extortion and beheaded.',
    'Khotan officer Gebeng\'e was executed for proven extortion.',
  ],
  s0239: [
    'On day jiayin, Landisi was transferred to be Jiangnan canal transport governor-general and Li Fenggan was made Hedong canal transport governor-general.',
    'On jiayin, Landisi took Jiangnan canals and Li Fenggan, Hedong.',
  ],
  s0240: [
    'On day yimao, Fukang\'an was instructed in detail that Annam\'s miasma and harsh land were not worth military action.',
    'On yimao, Fukang\'an was told Annam was too feverish and poor for war.',
  ],
  s0241: [
    'Third month, day jiazi: accumulated Gansu tax arrears and unpaid seed grain and rations were remitted.',
    'In month 3 jiazi, Gansu arrears, seed, and rations were forgiven.',
  ],
  s0242: [
    'Unpaid stored grain in three Yan\'an prefectures and departments in Shaanxi was remitted.',
    'Three Yan\'an districts lost unpaid store grain.',
  ],
  s0243: [
    'Fukang\'an was instructed to demand by proclamation that Nguyễn Huệ bind and deliver the rebels who had killed provincial commanders.',
    'Fukang\'an was told to demand Nguyễn Huệ hand over those who killed commanders.',
  ],
  s0244: [
    'On day yichou, Liu Yong was demoted to vice-minister rank for absenteeism as tutor in the Upper Study Hall.',
    'On yichou, absent tutor Liu Yong was demoted to vice-minister.',
  ],
  s0245: [
    'Peng Yuanrui was made Minister of Personnel and Sun Shiyi Minister of War.',
    'Peng Yuanrui took personnel and Sun Shiyi, war.',
  ],
  s0246: [
    'On day dingmao, the Emperor went to Mount Pan.',
    'On dingmao, Hongli went to Mount Pan.',
  ],
  s0247: [
    'Summer, fourth month, day wuzi: quota taxes from last year\'s flood in two cities under Guangning and Fenghuang in Fengtian were remitted, with differentiated relief continued.',
    'In month 4 wuzi, Fengtian Guangning and Fenghuang lost last year\'s flood taxes and relief continued, by degree.',
  ],
  s0248: [
    'On day bingshen, Xu Shiheng was posthumously raised to a baron and his son Chengmou was ordered to inherit.',
    'On bingshen, Xu Shiheng was made a posthumous baron for Chengmou to inherit.',
  ],
  s0249: [
    'Sun Shiyi was recalled to the capital.',
    'Sun Shiyi was recalled to Beijing.',
  ],
  s0250: [
    'On day gengzi, Heng Rui was made Uliasutai general and Fukang\'an acting Minister of War.',
    'On gengzi, Heng Rui took Uliasutai and Fukang\'an acted at war.',
  ],
  s0251: [
    'Fukang\'an was instructed to settle the old clansmen and former ministers of the Lê house in Annam.',
    'Fukang\'an was told to settle Annam\'s Lê clansmen and old ministers.',
  ],
  s0252: [
    'Pan Qide, Lang Son prefect who had served in the campaign, was granted use at the rank of regional commander.',
    'Campaign veteran Pan Qide of Lang Son was made a regional commander.',
  ],
  s0253: [
    'On day renyin, Agui was ordered to re-inspect Jingzhou dike works.',
    'On renyin, Agui re-inspected Jingzhou dikes.',
  ],
  s0254: [
    'On day dingwei, an imperial proclamation stated: "Annam\'s waters and soil are vile; the decision is firmly not to use troops again.',
    'On dingwei, Hongli proclaimed Annam too foul to fight again.',
  ],
  s0255: [
    'Nguyễn Huệ has already begged surrender three times; if he truly comes to court to beg grace, a title may be granted in measure.',
    'If Nguyễn Huệ truly came to court, he might receive a measured title.',
  ],
  s0256: [
    'In cherishing outer barbarians, I never fail to embody Heaven\'s virtue of cherishing life and have never dared to exhaust the state in war.',
    'Hongli claimed he cherished life and never exhausted the state in war.',
  ],
  s0257: [
    '" On day xinhai, Hu Changling and ninety-eight others were granted jinshi graduate status with differing ranks.',
    'On xinhai, ninety-eight graduates including Hu Changling received jinshi rank by degree.',
  ],
  s0258: [
    'Dorjia was transferred to be Heilongjiang general; Songchun to Mukden general; Hengxiu to Suiyuan city general; Linning to Jilin general.',
    'Dorjia took Heilongjiang, Songchun Mukden, Hengxiu Suiyuan, and Linning Jilin.',
  ],
  s0259: [
    'On day guichou, because Nguyễn Huệ did not come in person to plead, Nguyễn Quang Hiển was sent through the pass to offer tribute; Fukang\'an was instructed to refuse him.',
    'On guichou, Nguyễn Quang Hiển\'s tribute was refused because Nguyễn Huệ would not come himself.',
  ],
  s0260: [
    'On day bingchen, quota taxes for last year\'s drought in four Zhili counties including Xuanhua were remitted.',
    'On bingchen, four Zhili drought counties including Xuanhua lost last year\'s taxes.',
  ],
  s0261: [
    'Fifth month, day jiwei: this year\'s quota taxes were remitted for five Guangxi prefectures under Liuzhou through which troops had passed.',
    'In month 5 jiwei, five Guangxi Liuzhou districts lost this year\'s taxes for troop passage.',
  ],
  s0262: [
    'Fukang\'an and others memorialized that Nguyễn Huệ had sent his nephew Nguyễn Quang Hiển bearing a memorial and tribute begging surrender and also pleading to have audience.',
    'Fukang\'an reported Nguyễn Huệ sent nephew Nguyễn Quang Hiển with tribute and a plea for audience.',
  ],
  s0263: [
    'This was granted, but the tribute was refused.',
    'Audience was allowed but tribute refused.',
  ],
  s0264: [
    'On day yiyou, official posts at Huizhou and Huining cities in Ili were increased.',
    'On yiyou, Ili\'s Huizhou and Huining gained more officials.',
  ],
  s0265: [
    'Intercalary fifth month, day gengyin: the Emperor went for the autumn hunt at Mulan.',
    'On intercalary month 5 gengyin, Hongli hunted at Mulan.',
  ],
  s0266: [
    'On day xinmao, quota taxes from last year\'s flood in seven Fengtian cities including Guangning were remitted.',
    'On xinmao, seven Fengtian districts including Guangning lost last year\'s flood taxes.',
  ],
  s0267: [
    'On day jiawu, victims of earthquake in five Yunnan prefectures and counties including Tonghai were relieved.',
    'On jiawu, five Yunnan districts including Tonghai received earthquake relief.',
  ],
  s0268: [
    'Sixth month: fifty-third-year flood quota taxes were remitted for seven Anhui prefectures and departments including Anqing.',
    'In month 6, seven Anhui districts including Anqing lost year-53 flood taxes.',
  ],
  s0269: [
    'On day jiazi, Guan Ganzhen was made Grand Canal transport governor-general.',
    'On jiazi, Guan Ganzhen became canal transport governor-general.',
  ],
  s0270: [
    'On day wuchen, flood victims in Li County, Zhili, were relieved.',
    'On wuchen, Zhili\'s Li County received flood relief.',
  ],
  s0271: [
    'On day gengwu, Minister of War Sun Shiyi was ordered to walk attendance at the Grand Council.',
    'On gengwu, Sun Shiyi joined Grand Council walking attendance.',
  ],
  s0272: [
    'On day renshen, Guo Shixun was made Guangdong governor.',
    'On renshen, Guo Shixun became Guangdong governor.',
  ],
  s0273: [
    'On day guiyou, Chen Buyuan was made Guizhou governor.',
    'On guiyou, Chen Buyuan became Guizhou governor.',
  ],
  s0274: [
    'On day bingzi, Fukang\'an memorialized that Nguyễn Huệ was Nguyễn Quang Bình; because his former crimes were pardoned, surrender was approved, he presented a memorial thanking for grace and offering tribute, and asked to come to the capital next year for the birthday celebration.',
    'On bingzi, Fukang\'an said Nguyễn Huệ was Nguyễn Quang Bình, pardoned and allowed to surrender and attend next year\'s birthday rites.',
  ],
  s0275: [
    'Because his words were earnest, he was enfeoffed king of Annam and an imperial patent was granted.',
    'Earnest pleading won him the Annam kingship and an imperial patent.',
  ],
  s0276: [
    'Last year\'s flood quota taxes were remitted for twenty-four Hubei prefectures and counties including Jiangxia.',
    'Twenty-four Hubei districts including Jiangxia lost last year\'s flood taxes.',
  ],
  s0277: [
    'Autumn, seventh month, new moon on day yiyou: because the Yellow River breach sent water down into the Suzhou area, disaster victims were instructed to be relieved.',
    'On the seventh-month new moon, Suzhou flood victims were told to be relieved after the breach.',
  ],
  s0278: [
    'On day dingyou, flood victims in eight Zhili prefectures and counties including Anzhou were relieved.',
    'On dingyou, eight Zhili districts including Anzhou received flood relief.',
  ],
  s0279: [
    'On day gengzi, Minister of Revenue Chuoketuo died.',
    'On gengzi, Revenue Minister Chuoketuo died.',
  ],
  s0280: [
    'On day bingwu, Bayansan was made Minister of Revenue and Qin Chengen was made Shaanxi governor.',
    'On bingwu, Bayansan took revenue and Qin Chengen, Shaanxi.',
  ],
  s0281: [
    'On day wushen, Annam tribute envoys including Nguyễn Quang Hiển had audience.',
    'On wushen, Nguyễn Quang Hiển and other Annam envoys were received.',
  ],
  s0282: [
    'Eighth month, day yichou: flood victims in Yongcheng and Linzhang and other counties in Henan were relieved.',
    'In month 8 yichou, Henan flood victims in Yongcheng and Linzhang were relieved.',
  ],
  s0283: [
    'On day wuchen, flood victims in Anhui\'s Suzhou were relieved.',
    'On wuchen, Anhui\'s Suzhou received flood relief.',
  ],
  s0284: [
    'On day jisi, the Emperor went to Mulan for the autumn hunt encampment.',
    'On jisi, Hongli encamped at Mulan for the hunt.',
  ],
  s0285: [
    'On day jiaxu, flood victims in thirty-four Zhili prefectures and counties including Qingyuan were relieved.',
    'On jiaxu, thirty-four Zhili districts including Qingyuan were relieved.',
  ],
  s0286: [
    'Ninth month, day jichou: Gurkha tribute envoys had audience; Ratna Bahadur was enfeoffed king and Bahadur Shah duke.',
    'In month 9 jichou, Gurkha envoys were received and Ratna Bahadur made king and Bahadur Shah duke.',
  ],
  s0287: [
    'On day gengyin, the Emperor returned to lodge at the Mountain Resort for Escaping Summer Heat.',
    'On gengyin, Hongli returned to the Summer Resort.',
  ],
  s0288: [
    'On day xinmao, flood victims in eleven Jiangsu prefectures and counties including Tongshan were relieved.',
    'On xinmao, eleven Jiangsu districts including Tongshan were relieved.',
  ],
  s0289: [
    'On day bingshen, flood victims in Jilin dependency of Huichun were relieved; due righteousness-store grain and last year\'s borrowed store grain were remitted.',
    'On bingshen, Huichun flood victims were relieved and store grain and last year\'s loans forgiven.',
  ],
  s0290: [
    'On day dingyou, the Emperor returned from the imperial progress.',
    'On dingyou, Hongli returned from progress.',
  ],
  s0291: [
    'On day bingwu, Annam\'s Lê Duy Kỳ, from among himself raising horses at Baole, was defeated by Nguyễn Quang Bình.',
    'On bingwu, Lê Duy Kỳ herding horses at Baole was beaten by Nguyễn Quang Bình.',
  ],
  s0292: [
    'Fukang\'an was instructed that if Lê Duy Kỳ came fleeing, he should be received.',
    'Fukang\'an was told to receive Lê Duy Kỳ if he fled.',
  ],
  s0293: [
    'On day xinhai, Left Censor-in-Chief Ayang\'a died and Shuchang replaced him.',
    'On xinhai, Ayang\'a died and Shuchang took the left censorate.',
  ],
  s0294: [
    'Winter, tenth month, day guichou: Chahar commander general Wulitunasson was dismissed and Baotai replaced him.',
    'In month 10 guichou, Wulitunasson left Chahar command and Baotai replaced him.',
  ],
  s0295: [
    'Wuerwusun was made Kobdo assistant commissioner.',
    'Wuerwusun became Kobdo assistant commissioner.',
  ],
  s0296: [
    'On day yimao, Fotu was made Uliasutai assistant commissioner.',
    'On yimao, Fotu became Uliasutai assistant commissioner.',
  ],
  s0297: [
    'Flood victims at Jilin hunting stations including Daqsheng Wula were relieved.',
    'Jilin hunting stations including Daqsheng Wula received flood relief.',
  ],
  s0298: [
    'On day jiwei, the Suining breach was closed.',
    'On jiwei, the Suining breach closed.',
  ],
  s0299: [
    'On day xinyou, flood victims in Huarong and other counties in Hunan were relieved.',
    'On xinyou, Hunan flood victims in Huarong and other counties were relieved.',
  ],
  s0300: [
    'Eleventh month, day yiyou: King Nguyễn Quang Bình of Annam, having received enfeoffment, presented thanks-and-grace tribute; this was granted.',
    'In month 11 yiyou, enfeoffed Nguyễn Quang Bình\'s thanks tribute was accepted.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b03.mjs <translation.json>'
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

