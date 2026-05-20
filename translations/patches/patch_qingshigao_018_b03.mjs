#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Grand Secretary Changlin was ordered to superintend the Ministry of Revenue and Pan Shien the Ministry of Works.',
    'Changlin took Revenue and Pan Shien Works.',
  ],
  s0202: [
    'Muzhang\'a was transferred to Minister of Revenue and Boqitu to Minister of Works.',
    'Muzhang\'a took Revenue and Boqitu Works.',
  ],
  s0203: [
    'On day jihai, the Yi bandits on the Qianbian border in Sichuan were pacified.',
    'On jihai, Sichuan Qianbian Yi bandits were pacified.',
  ],
  s0204: [
    'Sixth month, new moon on day gengzi: solar eclipse.',
    'In month 6, gengzi new moon, there was a solar eclipse.',
  ],
  s0205: [
    'That month, seed grain was loaned for hail disaster in three Zhili counties including Boye.',
    'That month, Boye and two other Zhili counties received hail-disaster seed loans.',
  ],
  s0206: [
    'Seventh month, day jiashen: the Emperor examined Hanlin and Household officials; Tian Songnian and two others were ranked first class and the rest promoted or demoted by degree.',
    'In month 7, jiashen, the Emperor tested Hanlin and Household officials; Tian Songnian and two others ranked first and the rest were graded.',
  ],
  s0207: [
    'On day renchen, the late Empress was given the posthumous title Xiaoshen Empress.',
    'On renchen, the late Empress became Xiaoshen Empress.',
  ],
  s0208: [
    'Qi was transferred to Guangdong governor and Huiji made Guangxi governor.',
    'Qi took Guangdong and Huiji Guangxi.',
  ],
  s0209: [
    'That month, flood disaster in four Guizhou departments and counties including Guzhou was relieved.',
    'That month, four Guizhou districts including Guzhou received flood relief.',
  ],
  s0210: [
    'Eighth month: that month, flood disaster in two Guizhou departments including Dujiang was relieved.',
    'In month 8, two Guizhou departments including Dujiang received flood relief.',
  ],
  s0211: [
    'Ninth month, day gengwu: the coffin of Xiaoshen Empress was moved to Tiancun and the Emperor escorted it in person.',
    'In month 9, gengwu, Xiaoshen Empress\'s coffin went to Tiancun and the Emperor saw it off.',
  ],
  s0212: [
    'On day yihai, Yang Fang was promoted to first-rank marquis.',
    'On yihai, Yang Fang became a first-rank marquis.',
  ],
  s0213: [
    'On day renchen, Guiqing was made Rehe commandant.',
    'On renchen, Guiqing became Rehe commandant.',
  ],
  s0214: [
    'Song Pu was transferred to Grand Canal transport governor-general.',
    'Song Pu took the Canal transport post.',
  ],
  s0215: [
    'Shi Pu was transferred to Guizhou governor.',
    'Shi Pu became Guizhou governor.',
  ],
  s0216: [
    'Yang Mingyang was made Shaanxi governor.',
    'Yang Mingyang took Shaanxi.',
  ],
  s0217: [
    'On day jiawu, quota taxes for this year were remitted for ten Yunnan prefectures and counties including Kunming afflicted by earthquake, and relief was given.',
    'On jiawu, ten Yunnan districts including Kunming lost this year\'s taxes after the earthquake and received relief.',
  ],
  s0218: [
    'That month, flood disaster in six Jiangsu counties including Shangyuan was relieved.',
    'That month, six Jiangsu counties including Shangyuan received flood relief.',
  ],
  s0219: [
    'Tenth month, day wuwu: Buyantai was transferred to Ili councilor-assistant and Changde to Tarbagatai councilor-assistant.',
    'In month 10, wuwu, Buyantai went to Ili and Changde to Tarbagatai.',
  ],
  s0220: [
    'On day jiwei, Tang Jinzhao was made Minister of Works and Shi Zhiyan Left Censor-in-Chief.',
    'On jiwei, Tang Jinzhao took Works and Shi Zhiyan the left censorate.',
  ],
  s0221: [
    'That month, disaster victims were relieved in twelve Jiangsu counties and guards including Shangyuan, Anxiang and Huarong in Hunan, Quyang in Zhili, and three places in Heilongjiang.',
    'That month, twelve Jiangsu districts including Shangyuan, two Hunan counties, Quyang, and three Heilongjiang posts received relief.',
  ],
  s0222: [
    'Flood disaster in six Hubei counties including Wuchang was relieved.',
    'Six Hubei counties including Wuchang received flood relief.',
  ],
  s0223: [
    'Ration grain was issued to disaster victims in six Anhui counties including Huaiyuan.',
    'Six Anhui counties including Huaiyuan received ration grain.',
  ],
  s0224: [
    'Eleventh month, day bingxu: the Emperor prayed for snow at the Hall of Great Height.',
    'In month 11, bingxu, the Emperor prayed for snow at the Hall of Great Height.',
  ],
  s0225: [
    'Yutai was made Guizhou governor.',
    'Yutai became Guizhou governor.',
  ],
  s0226: [
    'On day dinghai, Wuzhong\'e was made Rehe commandant.',
    'On dinghai, Wuzhong\'e became Rehe commandant.',
  ],
  s0227: [
    'Kaiyinbu acted as Chahar commandant.',
    'Kaiyinbu acted at Chahar.',
  ],
  s0228: [
    'Twelfth month, day dingsi: land taxes on flooded land were reduced or remitted in five Zhili counties including Hejian.',
    'In month 12, dingsi, flooded-land taxes were cut in five Zhili counties including Hejian.',
  ],
  s0229: [
    'That month, flood disaster in twelve Jiangsu counties and guards including Shangyuan was relieved.',
    'That month, twelve Jiangsu counties and guards including Shangyuan received flood relief.',
  ],
  s0230: [
    'That year, Korea, Vietnam, Ryukyu, and Burma presented tribute.',
    'That year, Korea, Vietnam, Ryukyu, and Burma sent tribute.',
  ],
  s0231: [
    'Fourteenth year, spring, first month, new moon on day dingmao; on day xinwei, Wen Fu was dismissed as Inner Palace Grand Secretary of the Plain Yellow Banner and Zaiquan replaced him.',
    'In year 14, month 1, dingmao new moon; on xinwei, Wen Fu left the Plain Yellow Banner inner grand secretary post and Zaiquan replaced him.',
  ],
  s0232: [
    'On day dingchou, the Burmese tribute envoy Nie Niuyegongnaya died in the capital.',
    'On dingchou, Burma\'s tribute envoy Nie Niuyegongnaya died in Beijing.',
  ],
  s0233: [
    'On day gengchen, Li bandits rebelled in Danzhou, Guangdong; Lu Kun was ordered to suppress them.',
    'On gengchen, Li rebels rose in Danzhou, Guangdong, and Lu Kun was sent to suppress them.',
  ],
  s0234: [
    'On day jiashen, because of disaster in Hangzhou and other Zhejiang prefectures, transit duties on rice brought by foreign merchants and Zhejiang people were remitted.',
    'On jiashen, Zhejiang disaster led to remission of rice transit duties for foreign merchants and Zhejiang shippers.',
  ],
  s0235: [
    'Bandits in Yong\'an and other Fujian counties kidnapped people for ransom; they were captured and punished.',
    'Fujian bandits in Yong\'an and elsewhere who kidnapped for ransom were captured and punished.',
  ],
  s0236: [
    'Hangzhou and Huzhou in Zhejiang were permitted to collect both red and white grain tribute and accept both indica and japonica rice.',
    'Hangzhou and Huzhou tribute grain could mix red and white grain and both indica and japonica rice.',
  ],
  s0237: [
    'On day dinghai, Pan Shien was ordered to serve on the Grand Council above the rank of Grand Councilor.',
    'On dinghai, Pan Shien was placed above ordinary Grand Councilors on the Council.',
  ],
  s0238: [
    'On day wuzi, after three-year merit review, Changlin and others were recorded for promotion.',
    'On wuzi, three-year review recorded Changlin and others for promotion.',
  ],
  s0239: [
    'Songyun was ordered to retire with the rank of commandant.',
    'Songyun retired with commandant rank.',
  ],
  s0240: [
    'Qi memorialized that Lang Son in Vietnam had been relieved; Ruan Wenquan, magistrate of Qiquan Yizhou, and others sought to enter the border and were refused.',
    'Qi reported Lang Son relieved; Ruan Wenquan of Qiquan Yizhou and others asked to cross the border and were refused.',
  ],
  s0241: [
    'That month, the poor of Quyang County, Zhili, were relieved.',
    'That month, Quyang\'s poor received relief.',
  ],
  s0242: [
    'Ration grain and seed grain were issued for last year\'s failed harvests in eight Jiangsu counties including Shangyuan, four Zhejiang prefectures and counties including Haining, and twenty-two Jiangxi counties including Nanchang.',
    'Last year\'s failed harvests in eight Jiangsu counties, four Zhejiang districts, and twenty-two Jiangxi counties received ration and seed grain.',
  ],
  s0243: [
    'Granary grain, ration grain, and seed grain were loaned for last year\'s disasters in ten Shanxi prefectures and counties including Shuozhou, fourteen Shaanxi prefectures and counties including Jiazhou, six Jiangxi counties including Nanchang, eighteen Hubei prefectures, counties, and guards including Wuchang, four Hunan prefectures and counties including Lizhou, and nine Gansu prefectures and counties including Gaolan.',
    'Last year\'s disasters in Shanxi, Shaanxi, Jiangxi, Hubei, Hunan, and Gansu districts received granary, ration, and seed loans.',
  ],
  s0244: [
    'Second month, new moon on day bingshen: Zhu Shiyan was granted leave to visit his parents and Tang Jinzhao acted as Minister of Personnel.',
    'In month 2, bingshen new moon, Zhu Shiyan went home on leave and Tang Jinzhao acted at Personnel.',
  ],
  s0245: [
    'The garrison chief at exchange-post Balkh was changed to vice commander.',
    'Balkh exchange-post garrison chief became vice commander.',
  ],
  s0246: [
    'On day jihai, the Emperor attended the classics lecture.',
    'On jihai, the Emperor attended the classics lecture.',
  ],
  s0247: [
    'On day guimao, Sheng Yin and others were sent to investigate affairs in Shandong and Henan; Jingzheng acted as Left Censor-in-Chief.',
    'On guimao, Sheng Yin and others investigated Shandong and Henan affairs; Jingzheng acted at the left censorate.',
  ],
  s0248: [
    'On day yisi, Li Hongbin and Liu Rongqing were released to return home.',
    'On yisi, Li Hongbin and Liu Rongqing were freed to go home.',
  ],
  s0249: [
    'On day bingwu, because Jiangsu grain prices rose, boat duties on merchant grain from Sichuan and Huguang at each pass were remitted.',
    'On bingwu, rising Jiangsu grain prices led to remission of boat duties on Sichuan and Huguang merchant grain.',
  ],
  s0250: [
    'On day wushen, Guangdong education intendant Li Taijiao hanged himself; Lu Kun was ordered to investigate thoroughly.',
    'On wushen, Guangdong intendant Li Taijiao hanged himself and Lu Kun was ordered to investigate.',
  ],
  s0251: [
    'On day jiyou, regulations were fixed for inspecting springs along the Shandong transport canal.',
    'On jiyou, Shandong canal spring-inspection regulations were fixed.',
  ],
  s0252: [
    'On day gengxu, for visits to the Western Tombs, Yishao and others were ordered to remain in the capital to conduct affairs.',
    'On gengxu, for the Western Tombs visit, Yishao and others stayed in Beijing to govern.',
  ],
  s0253: [
    'On day renzi, Kaiyinbu was ordered to investigate affairs at Uliastai.',
    'On renzi, Kaiyinbu was sent to investigate Uliastai affairs.',
  ],
  s0254: [
    'Suletong\'a acted as Chahar commandant.',
    'Suletong\'a acted at Chahar.',
  ],
  s0255: [
    'On day xinyou, Zhu Shiyan was dismissed for mourning; Tang Jinzhao was transferred to Minister of Personnel, Wang Shouhe made Minister of Works, Shi Zhiyan Minister of Rites, and He Linghan Left Censor-in-Chief.',
    'On xinyou, Zhu Shiyan mourned out; Tang Jinzhao took Personnel, Wang Shouhe Works, Shi Zhiyan Rites, and He Linghan the left censorate.',
  ],
  s0256: [
    'On day yichou, Grand Secretary Fujun died.',
    'On yichou, Grand Secretary Fujun died.',
  ],
  s0257: [
    'That month, ration grain was issued for last year\'s disasters in eight Jiangsu counties and guards including Shangyuan.',
    'That month, eight Jiangsu counties and guards including Shangyuan received last year\'s disaster rations.',
  ],
  s0258: [
    'Seed grain was loaned for last year\'s disaster in Guzhou Department, Guizhou.',
    'Guizhou\'s Guzhou Department received a seed loan for last year\'s disaster.',
  ],
  s0259: [
    'Third month, day gengwu: Mingshan was dismissed on account of illness; Chengge was made Minister of Punishments and Na Qing\'an also acted.',
    'In month 3, gengwu, Mingshan left for illness; Chengge took Punishments and Na Qing\'an acted.',
  ],
  s0260: [
    'Chang Qing was made Urumchi commandant and Xingde Yarkand councilor-assistant.',
    'Chang Qing took Urumchi and Xingde Yarkand.',
  ],
  s0261: [
    'On day guiyou, the Emperor visited the Western Tombs, offered wine before Xiaoshen Empress\'s coffin at Tiancun, and remitted three-tenths of quota taxes along the route.',
    'On guiyou, the Emperor visited the Western Tombs, poured wine at Tiancun before Xiaoshen Empress\'s coffin, and cut route taxes by three-tenths.',
  ],
  s0262: [
    'On day dingchou, the Emperor visited Tailing, Taidongling, and Changling.',
    'On dingchou, the Emperor visited Tailing, Taidongling, and Changling.',
  ],
  s0263: [
    'On day gengchen, the Emperor returned to the capital.',
    'On gengchen, the Emperor returned to Beijing.',
  ],
  s0264: [
    'On day renwu, the Emperor visited the late Grand Secretary Fujun\'s residence and bestowed sacrificial gifts.',
    'On renwu, the Emperor mourned at Grand Secretary Fujun\'s house.',
  ],
  s0265: [
    'On day yiyou, because Khalkha pastures suffered disaster, Kaiyinbu\'s request to defer border surveys was approved.',
    'On yiyou, Khalkha pasture disaster led to approval of Kaiyinbu\'s request to defer border surveys.',
  ],
  s0266: [
    'Quota taxes for last year were remitted for three Sichuan departments and counties including Qingxi harassed by Yi bandits and for the two garrisons of Ningyue and Yuexi.',
    'Last year\'s taxes were remitted for three Sichuan districts including Qingxi and the Ningyue and Yuexi garrisons.',
  ],
  s0267: [
    'Summer, fourth month, day dingyou: on memorial of supervising censor Huang Juezi, each province\'s governor and governor-general was ordered to revive academies and select mountain chiefs, inspect household registers, repair waterworks, stock granaries, strictly forbid abuses of deducting pay and dispatching troops, investigate smuggling of foreign customs duties, and forbid silver export and private casting of foreign silver.',
    'In month 4, dingyou, Huang Juezi\'s memorial ordered governors to revive academies, inspect registers, repair waterworks, stock grain, stop pay abuses, and curb foreign-duty smuggling and silver export.',
  ],
  s0268: [
    'On day wuxu, rents on official land washed away by water in Leting County, Zhili, were abolished.',
    'On wuxu, Leting\'s water-washed official land rents were abolished.',
  ],
  s0269: [
    'On day dingwei, Prince of Yi Commandery Mianzhi died.',
    'On dingwei, Prince of Yi Commandery Mianzhi died.',
  ],
  s0270: [
    'On day jiayin, the Emperor visited the late Prince of Yishun Commandery Mianzhi\'s residence and bestowed sacrificial gifts.',
    'On jiayin, the Emperor mourned at Prince of Yishun Mianzhi\'s house.',
  ],
  s0271: [
    'His son Yiyin inherited as beile.',
    'His son Yiyin became beile.',
  ],
  s0272: [
    'On day dingsi, Vice Minister Zhao Shengkui and retired former Yellow River governor Yan Huang were ordered to join Funiyang\'a in surveying Zhejiang seawall works.',
    'On dingsi, Zhao Shengkui and Yan Huang joined Funiyang\'a to survey Zhejiang seawalls.',
  ],
  s0273: [
    'On day xinyou, Su Qing\'a was made Ili councilor-assistant.',
    'On xinyou, Su Qing\'a became Ili councilor-assistant.',
  ],
  s0274: [
    'On day jiazi, the Emperor performed the first anniversary rites at Xiaoshen Empress\'s coffin at Tiancun.',
    'On jiazi, the Emperor held the first anniversary rite at Tiancun for Xiaoshen Empress.',
  ],
  s0275: [
    'That month, granary grain was loaned to civilian farming colonies in twelve Shanxi prefectures, departments, and counties including Yueyang that had poor harvests.',
    'That month, twelve Shanxi districts including Yueyang received granary loans for poor harvests in civilian colonies.',
  ],
  s0276: [
    'Fifth month, day jisi: Enming acted as Grand Canal transport governor-general.',
    'In month 5, jisi, Enming acted as Canal transport governor-general.',
  ],
  s0277: [
    'On day renshen, Kaiyinbu was appointed Chahar commandant.',
    'On renshen, Kaiyinbu became Chahar commandant.',
  ],
  s0278: [
    'On day guiyou, taxes for last year\'s earthquake in ten Yunnan prefectures and counties including Kunming were remitted.',
    'On guiyou, ten Yunnan districts including Kunming lost last year\'s earthquake taxes.',
  ],
  s0279: [
    'On day xinsi, the Emperor offered wine at Xiaoshen Empress\'s coffin at Tiancun.',
    'On xinsi, the Emperor poured wine at Tiancun before Xiaoshen Empress\'s coffin.',
  ],
  s0280: [
    'On day bingxu, Lu Kun and others were ordered to drive away British opium depot ships and not allow them to anchor.',
    'On bingxu, Lu Kun and others were told to expel British opium depot ships and forbid anchorage.',
  ],
  s0281: [
    'On day gengyin, the forest and temple of Confucius at Qufu in Shandong were repaired.',
    'On gengyin, Qufu\'s Confucian forest and temple were repaired.',
  ],
  s0282: [
    'On day jiawu, an injunction was sent that Dorji Labutan and others must follow old regulations in dealings with Russia.',
    'On jiawu, Dorji Labutan and others were told to follow old rules in Russian dealings.',
  ],
  s0283: [
    'That month, seed grain was loaned to farming colonies in Huai\'an and Dahe guards that had poor harvests.',
    'That month, Huai\'an and Dahe guards received seed loans for poor harvests.',
  ],
  s0284: [
    'Sixth month, day wushen: because of flood in Fujian\'s provincial capital, grain from Gutian and Fuqing county granaries and merchant rice at Xiamen was permitted to be sold at fair price.',
    'In month 6, wushen, Fujian capital flooding led to fair-price sale of Gutian and Fuqing granary grain and Xiamen merchant rice.',
  ],
  s0285: [
    'On day guichou, because people privately leasing Mongol land in Ordos Dala Banner resisted arrest and wounded a taiji, Eshun\'an was ordered to capture and punish them.',
    'On guichou, Ordos Dala Banner tenants who wounded a taiji resisting arrest were to be seized by Eshun\'an.',
  ],
  s0286: [
    'On day renxu, Enming was formally appointed Grand Canal transport governor-general.',
    'On renxu, Enming became Canal transport governor-general.',
  ],
  s0287: [
    'That month, overdue grain taxes of Muslim households in three cities including Yarkand were remitted or deferred.',
    'That month, overdue grain taxes in three cities including Yarkand were remitted or deferred.',
  ],
  s0288: [
    'Autumn, seventh month, day yichou: investigation was ordered into accumulated abuses of shortfall on canal transport, and private sale in the capital to supply returning tribute grain was forbidden.',
    'In month 7, yichou, canal transport shortfalls were to be investigated and capital sales feeding returning tribute grain were banned.',
  ],
  s0289: [
    'On day dingmao, Boqitu was granted leave and Yihao acted as Minister of Works.',
    'On dingmao, Boqitu took leave and Yihao acted at Works.',
  ],
  s0290: [
    'On day wuchen, the Kokand begs, granted duty-free trade, sent envoys with memorial and tribute and requested annual audience; this was approved.',
    'On wuchen, Kokand begs with duty-free trade sent tribute and asked for annual audience; it was allowed.',
  ],
  s0291: [
    'On day gengwu, Su Qing\'a was ordered to survey reclaimed fields at Balkh and Kashgar.',
    'On gengwu, Su Qing\'a surveyed reclaimed fields at Balkh and Kashgar.',
  ],
  s0292: [
    'Four Fujian counties harassed by Taiwan bandits and rented grain from rebellious confiscations in Tamsui Department were remitted.',
    'Four Taiwan-troubled Fujian counties and Tamsui confiscated rebel rents were remitted.',
  ],
  s0293: [
    'On day renshen, Te Yishunbao and others were ordered to deliberate properly on frontier patrol regulations.',
    'On renshen, Te Yishunbao and others were to settle frontier patrol rules.',
  ],
  s0294: [
    'Cheng Zuluo memorialized that foreign pirate Liu Si and others had been captured and executed.',
    'Cheng Zuluo reported foreign pirate Liu Si and others captured and executed.',
  ],
  s0295: [
    'On day jiaxu, branch Yi in Qianbian Department, Sichuan, rebelled; Husong\'e, Yang Fang, and others were ordered to investigate and handle it.',
    'On jiaxu, Sichuan Qianbian branch Yi rebelled; Husong\'e, Yang Fang, and others were sent to handle it.',
  ],
  s0296: [
    'Jiangxi flood disaster was relieved.',
    'Jiangxi flood victims received relief.',
  ],
  s0297: [
    'On day bingzi, Minister of Works Boqitu died; Qiying was transferred to Minister of Works, Sheng Yin to Minister of Rites, and Jingzheng to Left Censor-in-Chief.',
    'On bingzi, Boqitu died; Qiying took Works, Sheng Yin Rites, and Jingzheng the left censorate.',
  ],
  s0298: [
    'On day renwu, Guiliang was made Henan governor.',
    'On renwu, Guiliang became Henan governor.',
  ],
  s0299: [
    'On day wuzi, the Yellow River burst its banks at Zhujiawan on the Eastern River.',
    'On wuzi, the Yellow River broke at Zhujiawan on the Eastern River.',
  ],
  s0300: [
    'That month, flood disaster in thirteen Jiangxi counties including Nanchang was relieved.',
    'That month, thirteen Jiangxi counties including Nanchang received flood relief.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b03.mjs <translation.json>'
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
