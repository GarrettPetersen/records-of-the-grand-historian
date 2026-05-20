#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day jiawu, Yishan, Yijing, and Wenwei were all stripped of office and sentenced to execution; Te Yishun and Qi Shen were stripped of office but retained in post.',
    'On jiawu, Yishan, Yijing, and Wenwei lost office and were condemned to death; Te Yishun and Qi Shen were demoted but kept on duty.',
  ],
  s0202: [
    'On day yiwei, Minister of Revenue Jingzheng was ordered to serve as associate Grand Secretary; Engui was transferred to Minister of Personnel, and Lin Kui acted as Minister of Rites.',
    'On yiwei, Jingzheng became associate Grand Secretary; Engui took Personnel and Lin Kui acted at Rites.',
  ],
  s0203: [
    'On day wuxu, Prince Qing Yicai lost his title over an affair; Auxiliary State Duke Jixing, not in the eight banners, lost his title and was sent to Mukden.',
    'On wuxu, Prince Qing Yicai was disranked; Jixing, an out-of-eight-banners duke, was disranked and sent to Mukden.',
  ],
  s0204: [
    'That month, flood disaster in Taoyuan and Shuyang counties, Jiangsu, was relieved.',
    'That month Taoyuan and Shuyang in Jiangsu received flood relief.',
  ],
  s0205: [
    'Ration grain was given to disaster victims in four Hubei counties including Jiangling and three Shanxi prefectures and counties including Baode.',
    'Jiangling and three other Hubei counties and three Baode-area Shanxi districts received ration grain.',
  ],
  s0206: [
    'Ration grain was lent to disaster victims at Niuzhuang and other places in Fengtian.',
    'Niuzhuang and other Fengtian places received lent ration grain.',
  ],
  s0207: [
    'Old and new quota taxes were remitted or deferred for five Jiangsu prefectures and counties including Haizhou and eight Hunan prefectures, counties, and guards including Lizhou.',
    'Haizhou and four other Jiangsu districts and eight Lizhou-area Hunan districts had taxes remitted or deferred.',
  ],
  s0208: [
    'Eleventh month, day dingwei: Kobdo resident minister Gu Qing was summoned to the capital and Goleminka replaced him.',
    'In month 11, dingwei, Gu Qing was called to Beijing and Goleminka took Kobdo.',
  ],
  s0209: [
    'Urga resident minister Sheng Gui was summoned to the capital and Le Bin replaced him.',
    'Sheng Gui was called to Beijing and Le Bin replaced him at Urga.',
  ],
  s0210: [
    'Tibet resident minister Meng Bao was summoned to the capital and Haipu replaced him.',
    'Meng Bao was called to Beijing and Haipu replaced him in Tibet.',
  ],
  s0211: [
    'Pan Xi\'en was made Jiangnan river conservancy governor-general.',
    'Pan Xi\'en became Jiangnan river conservancy governor-general.',
  ],
  s0212: [
    'Huicheng was appointed Hedong river conservancy governor-general.',
    'Huicheng became Hedong river conservancy governor-general.',
  ],
  s0213: [
    'On day bingchen, Zhou Tianjue was allowed to return home for mourning; Liao Hongquan acted as grain transport governor-general.',
    'On bingchen, Zhou Tianjue went home to mourn and Liao Hongquan acted as grain transport governor-general.',
  ],
  s0214: [
    'On day jiazi, Yiliang was ordered to investigate Da Hong\'a and others for wantonly killing distressed foreigners.',
    'On jiazi, Yiliang was sent to investigate Da Hong\'a and others for killing foreigners without cause.',
  ],
  s0215: [
    'On day dingmao, Niu Jian was sentenced to execution.',
    'On dingmao, Niu Jian was condemned to death.',
  ],
  s0216: [
    'On day jiaxu, ration grain and house-repair funds were given to the poor in six Jiangsu counties including Dantu in the war-affected river districts, and quota taxes were remitted with differing amounts for thirteen prefectures, counties, and districts including Tongzhou.',
    'On jiaxu, six war-hit Jiangsu counties including Dantu received grain and repair funds, and thirteen districts including Tongzhou had taxes remitted by degree.',
  ],
  s0217: [
    'That month, ration grain was given for flood disaster in Xiaoxian and Xuzhou Guard, Jiangsu.',
    'That month Xiaoxian and Xuzhou Guard received flood ration grain.',
  ],
  s0218: [
    'Old and new quota taxes were remitted or deferred for three Zhejiang counties including Chun\'an.',
    'Chun\'an and two other Zhejiang counties had old and new taxes remitted or deferred.',
  ],
  s0219: [
    'Twelfth month, day xinsi: Liao Hongquan was summoned to the capital and Li Xiangfen acted as grain transport governor-general.',
    'In month 12, xinsi, Liao Hongquan went to Beijing and Li Xiangfen acted as grain transport governor-general.',
  ],
  s0220: [
    'On day jichou, a commander was established for Tongyong Garrison at Lutai, with Xiang Rong as Tongyong Garrison commander.',
    'On jichou, Tongyong Garrison was set up at Lutai under commander Xiang Rong.',
  ],
  s0221: [
    'On day gengyin, Cheng Yucai was summoned to the capital and Sun Shanbao was made Jiangsu governor.',
    'On gengyin, Cheng Yucai was called to Beijing and Sun Shanbao became Jiangsu governor.',
  ],
  s0222: [
    'On day yiwei, Tuohunbu left for illness and Cheng Yucai was made Shandong governor.',
    'On yiwei, ill Tuohunbu left office and Cheng Yucai took Shandong.',
  ],
  s0223: [
    'On day wuxu, the Grand Secretaries, Nine Chief Ministers, and censorate officials were again ordered to deliberate Yu Buyun\'s crime; he was executed.',
    'On wuxu, Yu Buyun was again tried by the grand secretaries, ministers, and censors and was executed.',
  ],
  s0224: [
    'On day jihai, Liang Baochang was transferred to Shandong governor and Cheng Yucai to Guangdong governor.',
    'On jihai, Liang Baochang took Shandong and Cheng Yucai Guangdong.',
  ],
  s0225: [
    'That month, ration grain and house-repair funds were given for flood disaster in three Fujian counties and districts including Fengshi.',
    'That month three Fujian districts including Fengshi received flood grain and repair funds.',
  ],
  s0226: [
    'That year, Gurkha, Korea, and Ryukyu presented tribute.',
    'That year Gurkha, Korea, and Ryukyu sent tribute.',
  ],
  s0227: [
    'In the twenty-third year, spring, first month, day xinhai, Li Kan and Cheng Gang were ordered to the Southern River to supervise works jointly with Pan Xi\'en.',
    'In year 23, month 1, xinhai, Li Kan and Cheng Gang joined Pan Xi\'en supervising Southern River works.',
  ],
  s0228: [
    'On day renzi, British military officer Pottinger returned to Hong Kong, leaving Morrison behind to await treaty negotiations.',
    'On renzi, Pottinger returned to Hong Kong and Morrison stayed to negotiate.',
  ],
  s0229: [
    'Yilibu and others were ordered to arrange commercial-treaty affairs.',
    'Yilibu and others were ordered to handle treaty commerce.',
  ],
  s0230: [
    'Li Xiangfen was ordered with Qiying to arrange postwar affairs north of the river.',
    'Li Xiangfen and Qiying were ordered to handle north-of-the-river recovery.',
  ],
  s0231: [
    'That month, disaster in Xiaoxian and Taoyuan, Jiangsu, was relieved, and ration grain was given to six counties and guards including Shuyang.',
    'That month Xiaoxian and Taoyuan were relieved and six districts including Shuyang received ration grain.',
  ],
  s0232: [
    'Seed grain and ration grain were lent for flood disaster to three Hubei counties and guards including Jiangling and to Lizhou and Dongting camps in Hunan.',
    'Jiangling and two other Hubei districts and Lizhou and Dongting camps received flood seed and ration loans.',
  ],
  s0233: [
    'Second month, day yiwei: Imperial Commissioner and Canton military governor Yilibu died; Qi was ordered to take over commercial-tax regulations.',
    'In month 2, yiwei, Yilibu died; Qi took over treaty tax rules.',
  ],
  s0234: [
    'On day dingyou, Urga general Yixiang was changed to Canton military governor and Lupu replaced him.',
    'On dingyou, Yixiang became Canton governor and Lupu replaced him at Urga.',
  ],
  s0235: [
    'On day xinchou, Yixing was transferred to Urga general and Lupu to Suiyuan City general.',
    'On xinchou, Yixing took Urga and Lupu Suiyuan City.',
  ],
  s0236: [
    'That month, granary grain was lent to flood-stricken Jiangzhou garrison troops in Hubei.',
    'That month flooded Jiangzhou garrison troops in Hubei received lent granary grain.',
  ],
  s0237: [
    'Third month, day gengxu: Qiying was made Imperial Commissioner to handle Jiangsu-Zhejiang commercial affairs.',
    'In month 3, gengxu, Qiying became Imperial Commissioner for Jiangsu-Zhejiang commerce.',
  ],
  s0238: [
    'Bi Chang acted as Liangjiang governor-general.',
    'Bi Chang acted as Liangjiang governor-general.',
  ],
  s0239: [
    'On day dingsi, the Emperor examined Hanlin and Household officials; Wan Qingli and four others were ranked first class and the rest promoted or demoted by degree.',
    'On dingsi, the Emperor tested Hanlin and Household officials; Wan Qingli and four others ranked first and the rest were graded.',
  ],
  s0240: [
    'On day yichou, Lupu was transferred to commander of the Mongol Plain Red Banner; Yixing was transferred to Suiyuan City general; Gui Lun was made Urga general; and Qishan was reinstated as Rehe commandant.',
    'On yichou, Lupu took the Plain Red Mongol command, Yixing Suiyuan City, Gui Lun Urga, and Qishan returned as Rehe commandant.',
  ],
  s0241: [
    'On day bingyin, Wenwei was reinstated as Gucheng detachment commander.',
    'On bingyin, Wenwei returned as Gucheng detachment commander.',
  ],
  s0242: [
    'Yijing was reinstated as Yarkand assistant commissioner.',
    'Yijing returned as Yarkand assistant commissioner.',
  ],
  s0243: [
    'On day dingmao, Yiliang memorialized that Da Hong\'a and Yao Ying had no battle merit and were ordered stripped of office and arrested for trial.',
    'On dingmao, Yiliang said Da Hong\'a and Yao Ying had no merit; both were stripped and arrested.',
  ],
  s0244: [
    'Soon Da Hong\'a and Yao Ying were exempted from punishment.',
    'Soon Da Hong\'a and Yao Ying were spared punishment.',
  ],
  s0245: [
    'That month, granary grain was lent for disaster to six Shanxi prefectures and counties including Jiangzhou and to flood-stricken Jiangzhou garrison stores in Hubei; silver was lent to disaster-afflicted garrison troops at Jiangning and all provincial and assistant camps; and seed grain and ration grain were lent to Miao tenant colonists in five Hunan districts including Fenghuang.',
    'That month six Shanxi districts including Jiangzhou, flooded Jiangzhou stores, Jiangning and camp troops, and five Fenghuang-area Hunan districts received disaster loans.',
  ],
  s0246: [
    'Summer, fourth month, first day on day jiaxu: Wei Qin was made Urumchi commandant.',
    'In summer, month 4, jiaxu new moon, Wei Qin became Urumchi commandant.',
  ],
  s0247: [
    'On day bingzi, Lin Kui was appointed Minister of Rites.',
    'On bingzi, Lin Kui became Minister of Rites.',
  ],
  s0248: [
    'On day dingchou, on impeachment by censor Chen Qingyong, Qishan, Wenwei, and Yijing were again stripped of office.',
    'On dingchou, Chen Qingyong\'s impeachment again cost Qishan, Wenwei, and Yijing their posts.',
  ],
  s0249: [
    'Kui Zhao left for illness; Tedeng\'e was made left censor-in-chief and Saying\'a Rehe commandant.',
    'Ill Kui Zhao left; Tedeng\'e took the left censorate and Saying\'a became Rehe commandant.',
  ],
  s0250: [
    'On day gengzi, Qiying was ordered to confer with the English on commerce.',
    'On gengzi, Qiying was ordered to negotiate trade with Britain.',
  ],
  s0251: [
    'On day wuchen, Yiliang left for illness; Liu Yunke was made Fujian-Zhejiang governor-general; Wu Qijun was transferred to Zhejiang governor; and Lu Fei\'en was made Hunan governor.',
    'On wuchen, ill Yiliang left; Liu Yunke took Fujian-Zhejiang, Wu Qijun Zhejiang, and Lu Fei\'en Hunan.',
  ],
  s0252: [
    'Sixth month, day yihai: the bandit Zeng Ruzhu rebelled at Wugang in Hunan and killed prefect Xu Guangbi; Wu Qijun was ordered to pursue and capture him.',
    'In month 6, yihai, Zeng Ruzhu rebelled at Wugang, killed Xu Guangbi, and Wu Qijun was sent to suppress him.',
  ],
  s0253: [
    'On day jiawu, Zeng Ruzhu was executed.',
    'On jiawu, Zeng Ruzhu was executed.',
  ],
  s0254: [
    'Autumn, seventh month, day yisi: the Yellow River burst at Jiubao in Zhongmou on the Eastern River; Huicheng was referred to the ministry for severe deliberation.',
    'In autumn, month 7, yisi, the Yellow River broke at Zhongmou Jiubao and Huicheng faced severe review.',
  ],
  s0255: [
    'Qiying\'s memorial was approved fixing commercial-tax regulations, first to be implemented in Guangzhou trade.',
    'Qiying\'s trade-tax plan was approved, to start in Guangzhou.',
  ],
  s0256: [
    'Jingzheng and He Rulin were instead ordered to the Eastern River to survey.',
    'Jingzheng and He Rulin were sent to survey the Eastern River instead.',
  ],
  s0257: [
    'On day bingwu, E Shun\'an was ordered to relieve flood victims along the river.',
    'On bingwu, E Shun\'an was ordered to relieve flooded river districts.',
  ],
  s0258: [
    'Intercalary seventh month, day wuyin: the Yongding River in Zhili burst its banks.',
    'In intercalary month 7, wuyin, the Yongding River in Zhili broke.',
  ],
  s0259: [
    'On day yiyou, the Zhongmou breach was still unclosed; Huicheng was ordered placed in the cangue at the river works.',
    'On yiyou the Zhongmou gap was still open and Huicheng was cangued at the works.',
  ],
  s0260: [
    'Zhong Xiang was made Hedong river conservancy governor-general.',
    'Zhong Xiang became Hedong river conservancy governor-general.',
  ],
  s0261: [
    'On day bingxu, Fafeng\'a was summoned to the capital and Dexing was made Xining commissioner.',
    'On bingxu, Fafeng\'a was called to Beijing and Dexing became Xining commissioner.',
  ],
  s0262: [
    'On day dinghai, Liao Hongquan was ordered to Henan to supervise river works jointly.',
    'On dinghai, Liao Hongquan went to Henan to co-supervise river works.',
  ],
  s0263: [
    'On day jichou, Lin Qing was reinstated and sent to the Eastern River to supervise river works.',
    'On jichou, Lin Qing returned to supervise Eastern River works.',
  ],
  s0264: [
    'On day gengyin, Jingzheng and others were ordered to deliberate on issuing paper notes.',
    'On gengyin, Jingzheng and others were told to plan paper currency.',
  ],
  s0265: [
    'On day jiawu, Wu Qijun was transferred to Yunnan governor and Guan Yuqun was made Zhejiang governor.',
    'On jiawu, Wu Qijun took Yunnan and Guan Yuqun Zhejiang.',
  ],
  s0266: [
    'Eighth month, day yisi: Cheng Maocai was again instructed to comfort and relieve flood victims in flooded Anhui prefectures and counties.',
    'In month 8, yisi, Cheng Maocai was again told to relieve flooded Anhui districts.',
  ],
  s0267: [
    'That month, flood and hail disaster in three Shaanxi counties including Mian was relieved.',
    'That month three Shaanxi counties including Mian received flood and hail relief.',
  ],
  s0268: [
    'Ninth month, day jiawu: Li Xiangfen was ordered to act as grain transport governor-general with third-rank top.',
    'In month 9, jiawu, Li Xiangfen acted as grain transport governor-general with third-rank top.',
  ],
  s0269: [
    'That month, flood disaster in Fushan county, Shandong, was relieved.',
    'That month Fushan in Shandong received flood relief.',
  ],
  s0270: [
    'Principal and miscellaneous quota taxes were remitted or deferred for flood and hail disaster at twenty-seven Zhili prefectures and counties including Jingzhou and Fushan in Shandong.',
    'Twenty-seven Zhili districts including Jingzhou and Fushan in Shandong had principal and miscellaneous taxes remitted or deferred.',
  ],
  s0271: [
    'Winter, tenth month, day jiyou: Qiying memorialized that commercial affairs were complete and was ordered back to his Liangjiang governor-general post to handle postwar affairs and Shanghai commerce; Qi and others handled remaining Guangdong affairs.',
    'In winter, month 10, jiyou, Qiying finished trade talks and returned to Liangjiang for recovery and Shanghai commerce while Qi handled Guangdong.',
  ],
  s0272: [
    'On day gengxu, Qishan was reinstated as Tibet commissioner.',
    'On gengxu, Qishan returned as Tibet commissioner.',
  ],
  s0273: [
    'On day jiazi, Da Hong\'a was reinstated as Hami commissioner.',
    'On jiazi, Da Hong\'a returned as Hami commissioner.',
  ],
  s0274: [
    'That month, flood and hail disaster in three Anhui counties including Taihe and Ke\'lan in Shanxi was relieved.',
    'That month Taihe and two other Anhui counties and Ke\'lan in Shanxi received flood and hail relief.',
  ],
  s0275: [
    'Ration grain was lent for crop failure to four Anhui counties including Taihe and four places including Qiqihar.',
    'Taihe and three other Anhui counties and four places including Qiqihar received failure ration loans.',
  ],
  s0276: [
    'Old and new principal and miscellaneous quota taxes were remitted or deferred for disaster at six Fengtian prefectures and counties including Liaoyang, three places including Shenyang, four places including Qiqihar, twenty-seven Shandong prefectures, counties, and guards including Linqing, thirty-seven Anhui prefectures, counties, and guards including Sizhou, seven Shanxi prefectures and counties including Ke\'lan, and six Hunan prefectures, counties, and guards including Lizhou.',
    'Disaster taxes were remitted or deferred across Liaoyang and five other Fengtian districts, Shenyang and two other places, four Qiqihar-area posts, twenty-seven Linqing-area Shandong districts, thirty-seven Sizhou-area Anhui districts, seven Ke\'lan-area Shanxi districts, and six Lizhou-area Hunan districts.',
  ],
  s0277: [
    'Eleventh month, first day on day jisi: solar eclipse.',
    'In month 11, jisi new moon, there was a solar eclipse.',
  ],
  s0278: [
    'On day jimao, Wang Zhi was made Zhejiang governor.',
    'On jimao, Wang Zhi became Zhejiang governor.',
  ],
  s0279: [
    'On day renwu, Cheng Maocai was transferred to Zhejiang governor and Wang Zhi to Anhui governor.',
    'On renwu, Cheng Maocai took Zhejiang and Wang Zhi Anhui.',
  ],
  s0280: [
    'On day dingyou, the Emperor went to the Dagao Hall to pray for snow.',
    'On dingyou the Emperor prayed for snow at Dagao Hall.',
  ],
  s0281: [
    'That month, disaster victims in Shuyang and Dahe Guard, Jiangsu, were relieved.',
    'That month Shuyang and Dahe Guard received disaster relief.',
  ],
  s0282: [
    'Seed grain, ration grain, and granary grain were lent to fifteen Jiangxi counties including Nanchang and nine Shaanxi prefectures and counties including Suide.',
    'Fifteen Jiangxi counties including Nanchang and nine Suide-area Shaanxi districts received seed, ration, and granary loans.',
  ],
  s0283: [
    'Old and new quota taxes were remitted or deferred for flood and drought disaster at four Zhili counties including Xinhe and sixty-eight Jiangsu prefectures, districts, counties, and guards including Gaoyou.',
    'Xinhe and three other Zhili counties and sixty-eight Gaoyou-area Jiangsu districts had flood and drought taxes remitted or deferred.',
  ],
  s0284: [
    'Twelfth month, day xinchou: commercial regulations with Italy were settled.',
    'In month 12, xinchou, Italy trade rules were settled.',
  ],
  s0285: [
    'On day jiachen, Liang Baochang was transferred to Zhejiang governor and Chong\'en was made Shandong governor.',
    'On jiachen, Liang Baochang took Zhejiang and Chong\'en Shandong.',
  ],
  s0286: [
    'On day bingwu, it snowed.',
    'On bingwu it snowed.',
  ],
  s0287: [
    'On day dingsi, Liu Yunke was ordered to handle Ningbo commercial affairs.',
    'On dingsi, Liu Yunke was ordered to handle Ningbo trade.',
  ],
  s0288: [
    'Minister of Rites Gong Shouzheng left for illness and Chen Guanjun replaced him.',
    'Ill Gong Shouzheng left the Ministry of Rites and Chen Guanjun replaced him.',
  ],
  s0289: [
    'That month, old and new principal and miscellaneous quota taxes were remitted or deferred for flood disaster at sixteen Henan prefectures and counties including Suizhou.',
    'That month sixteen Suizhou-area Henan districts had flood taxes remitted or deferred.',
  ],
  s0290: [
    'That year, Korea, Burma, and Siam presented tribute.',
    'That year Korea, Burma, and Siam sent tribute.',
  ],
  s0291: [
    'In the twenty-fourth year, spring, first month, day xinmao, seed grain was lent for flood and hail disaster in four Shaanxi prefectures and counties including Jiazhou and three Shanxi counties including Datong.',
    'In year 24, month 1, xinmao, Jiazhou and three other Shaanxi districts and three Datong-area Shanxi counties received hail-flood seed loans.',
  ],
  s0292: [
    'Second month, first day on day wuxu: Qi left for illness; Qiying was transferred to Liangguang governor-general and Bi Chang acted as Liangjiang governor-general.',
    'In month 2, wuxu new moon, ill Qi left; Qiying took Liangguang and Bi Chang acted at Liangjiang.',
  ],
  s0293: [
    'On day gengzi, because of visiting the Eastern Tombs, Prince Su Jingmin and others were ordered to remain in Beijing to conduct affairs.',
    'On gengzi, for the Eastern Tombs visit, Prince Su Jingmin and others stayed in Beijing to govern.',
  ],
  s0294: [
    'On day gengxu, because the Zhongmou dam works relapsed, Lin Kui and Liao Hongquan were stripped of office and given seventh-rank tops but retained at river works; Zhong Xiang was stripped of office but retained as Eastern River governor-general; and E Shun\'an was reduced to third-rank top.',
    'On gengxu, after the Zhongmou dam failed again, Lin Kui and Liao Hongquan were demoted to seventh rank but kept at the works, Zhong Xiang was demoted but kept as Eastern River governor-general, and E Shun\'an lost rank to third.',
  ],
  s0295: [
    'Tedeng\'e was made Minister of Rites, Wen Qing left censor-in-chief, Chen Guanjun was transferred to Minister of Works, Li Zongfang was made Minister of Rites, and Du Shoutian was made left censor-in-chief.',
    'Tedeng\'e took Rites, Wen Qing the left censorate, Chen Guanjun Works, Li Zongfang Rites, and Du Shoutian the left censorate.',
  ],
  s0296: [
    'On day jiayin, Muzhang\'a was ordered to remain in Beijing to conduct affairs.',
    'On jiayin, Muzhang\'a stayed in Beijing to govern.',
  ],
  s0297: [
    'On Cheng Yucai\'s memorial that the American envoy wished to come to Tianjin for audience and to discuss commercial regulations, Qiying was ordered to Guangdong to settle American and other countries\' commerce jointly with Cheng Yucai.',
    'After Cheng Yucai reported an American envoy wanted Tianjin audience and trade rules, Qiying went to Guangdong with him to settle U.S. and other trade.',
  ],
  s0298: [
    'On day dingmao, land tax along the route was remitted by three-tenths.',
    'On dingmao, transit land tax was cut by thirty percent.',
  ],
  s0299: [
    'That month, ration grain was given to civilian colonists in three Jiangsu prefectures, counties, and guards including Haizhou.',
    'That month three Haizhou-area Jiangsu districts gave colonist ration grain.',
  ],
  s0300: [
    'Third month, day renshen: Qiying was made Imperial Commissioner to handle commercial postwar affairs, and Cheng Yucai was still ordered to instruct the American envoy not to come to the capital.',
    'In month 3, renshen, Qiying became Imperial Commissioner for trade recovery and Cheng Yucai was told to stop the American envoy coming to Beijing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b03.mjs <translation.json>'
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

