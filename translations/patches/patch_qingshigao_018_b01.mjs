#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the eleventh year, spring, first month, day xinyou, Zhalong\'a was dismissed; Har\'a and Yang Fang were ordered to administer the Kashgar resident minister post.',
    'In Daoguang 11, month 1, xinyou, Zhalong\'a left office; Har\'a and Yang Fang took charge at Kashgar.',
  ],
  s0002: [
    'On day yichou, Rong\'an was sentenced to execution.',
    'On yichou Rong\'an was condemned to death.',
  ],
  s0003: [
    'On day bingzi, Wei Yuanhuang was made Fujian governor.',
    'On bingzi Wei Yuanhuang became Fujian governor.',
  ],
  s0004: [
    'The King of Korea, Li Xi, asked to enfeoff his grandson Huan as heir-apparent grandson and presented tribute goods.',
    'Korea\'s King Li Xi asked to enfeoff grandson Huan as heir-apparent grandson and sent tribute.',
  ],
  s0005: [
    'That month, ration grain was given to eight districts and guards including Pei in Jiangsu, Wuhu in Anhui, and Fuyang in Zhejiang.',
    'That month eight disaster districts including Pei, Wuhu, and Fuyang received ration grain.',
  ],
  s0006: [
    'Ration grain, house-repair funds, and seed were lent to troops and people at Sanxing and Shuangcheng Bao, nine Zhili districts including Cizhou, Anxiang and Huarong in Hunan, Wu\'an in Henan, and five Gansu counties including Huining.',
    'Disaster loans of grain, repair funds, and seed went to Sanxing, Shuangcheng Bao, nine Zhili districts, two Hunan counties, Wu\'an, and five Gansu counties.',
  ],
  s0007: [
    'Old and new quota taxes were remitted or deferred for troops and people in four places including Jilin.',
    'Jilin and three other districts had old and new taxes remitted or deferred.',
  ],
  s0008: [
    'Second month, day jichou: the Emperor attended the classics lecture.',
    'In month 2, jichou, the Emperor attended the classics lecture.',
  ],
  s0009: [
    'On day xinmao, because of the visit to the Western Tombs, Yishao and others were ordered to remain in Beijing to conduct affairs.',
    'On xinmao, for the Western Tombs visit, Yishao and others stayed in Beijing to govern.',
  ],
  s0010: [
    'Nayancheng was stripped of Grand Guardian of the Heir Apparent for provoking conflict by expelling Andijan Hui Muslims, and his son Rongzhao was also stripped of vice minister rank.',
    'Nayancheng lost Grand Guardian of the Heir Apparent for expelling Andijan Muslims and provoking trouble; son Rongzhao lost vice minister rank.',
  ],
  s0011: [
    'On day weimo, Nayancheng was dismissed from office; Qishan was transferred as Zhili governor-general, with Wang Ding acting.',
    'On weimo Nayancheng was dismissed; Qishan became Zhili governor-general with Wang Ding acting.',
  ],
  s0012: [
    'Eshan was made Sichuan governor-general, with Nayanchengbao acting; Shi Pu was made Shaanxi governor.',
    'Eshan took Sichuan with Nayanchengbao acting; Shi Pu took Shaanxi.',
  ],
  s0013: [
    'On day wuxu, the ban on cultivating and selling opium in all provinces was reiterated.',
    'On wuxu all provinces were again forbidden to grow or sell opium.',
  ],
  s0014: [
    'On day xinchou, the Emperor visited the Western Tombs.',
    'On xinchou the Emperor visited the Western Tombs.',
  ],
  s0015: [
    'On day yisi, he visited Tailing, Taidongling, and Changling.',
    'On yisi he visited Tailing, Taidongling, and Changling.',
  ],
  s0016: [
    'The Emperor inspected the eternal auspicious site and bestowed the name Longquan Yu.',
    'He inspected the eternal tomb site and named it Longquan Yu.',
  ],
  s0017: [
    'On day bingwu, the Emperor again visited Changling and performed the earth-spreading rite.',
    'On bingwu he again visited Changling and performed the earth-spreading rite.',
  ],
  s0018: [
    'At Long\'en Hall he held the great feast rite.',
    'At Long\'en Hall he held the great feast rite.',
  ],
  s0019: [
    'That month, grain stores were lent to Jingmen garrison troops flooded the previous year.',
    'That month Jingmen garrison troops flooded the year before received lent grain stores.',
  ],
  s0020: [
    'Third month, new moon on day guichou: Yinghe and his sons Kuizhao and Kuiyao were released to return to the capital.',
    'In month 3, guichou new moon, Yinghe and sons Kuizhao and Kuiyao were freed to return to Beijing.',
  ],
  s0021: [
    'Li bandits rebelled in Guangdong; Li Hongbin was ordered to suppress them.',
    'Li rebels rose in Guangdong; Li Hongbin was sent to suppress them.',
  ],
  s0022: [
    'On day xinyou, because British traders in Guangdong trade violated the ban, Li Hongbin and others were ordered to investigate and report.',
    'On xinyou British traders in Guangdong broke the ban; Li Hongbin and others were ordered to investigate.',
  ],
  s0023: [
    'That month, grain stores were lent to the Hubei governor-general and governor banners and to garrisons at Wuchang and Huangzhou.',
    'That month Hubei governor and governor banners and Wuchang and Huangzhou garrisons received lent grain stores.',
  ],
  s0024: [
    'Summer, fourth month, day wuzi: the Emperor reviewed Jianrui Camp troops.',
    'In summer, month 4, wuzi, the Emperor reviewed Jianrui Camp troops.',
  ],
  s0025: [
    'On day guimao, the Emperor prayed for rain at the Black Dragon Pool shrine.',
    'On guimao the Emperor prayed for rain at the Black Dragon Pool shrine.',
  ],
  s0026: [
    'The Guangdong Li bandits were pacified.',
    'Guangdong Li bandits were pacified.',
  ],
  s0027: [
    'Fifth month, day bingyin: Tang Jinzhao was demoted over an affair and also removed as chief tutor of the Upper Study.',
    'In month 5, bingyin, Tang Jinzhao was demoted and lost his Upper Study chief tutorship.',
  ],
  s0028: [
    'Pan Shien was transferred to Minister of Personnel; Zhu Shiyan to Works; Bai Rong to Left Censor-in-Chief.',
    'Pan Shien took personnel; Zhu Shiyan works; Bai Rong the left censorate.',
  ],
  s0029: [
    'On day wuchen, Changling was ordered to Kashgar to discuss suppression, pacification, and follow-up affairs.',
    'On wuchen Changling was sent to Kashgar to handle suppression, pacification, and aftermath.',
  ],
  s0030: [
    'On day xinwei, it rained.',
    'On xinwei it rained.',
  ],
  s0031: [
    'Sixth month, day bingshen: penalties for officials and commoners buying and consuming opium were fixed.',
    'In month 6, bingshen, penalties for officials and commoners buying and smoking opium were fixed.',
  ],
  s0032: [
    'On day jihai, flood disaster relief was given to twenty-five Anhui districts including Sizhou.',
    'On jihai twenty-five Anhui districts including Sizhou received flood relief.',
  ],
  s0033: [
    'On day gengxu, because twenty Hubei districts including Mianyang suffered flood, grain stores were ordered sold at fair price and Hubei transit rice taxes were waived.',
    'On gengxu twenty flooded Hubei districts including Mianyang had fair-price grain sales and transit rice taxes waived.',
  ],
  s0034: [
    'That month, ration grain was given to nine Jiangsu districts and guards including Shangyuan for flood.',
    'That month nine flooded Jiangsu districts including Shangyuan received ration grain.',
  ],
  s0035: [
    'Seed grain was lent to flood-stricken tun settlements of Huai\'anwei in Jiangsu.',
    'Flood-hit Huai\'anwei tun settlements in Jiangsu received lent seed grain.',
  ],
  s0036: [
    'Autumn, seventh month, day wuwu: Tao Shu with Cheng Zuluo were ordered to handle Jiangsu disaster relief.',
    'In autumn, month 7, wuwu, Tao Shu and Cheng Zuluo were ordered to handle Jiangsu disaster relief.',
  ],
  s0037: [
    'Because of Anhui floods, Deng Tingzhen was allowed to buy grain from neighboring provinces for fair sale and to prepare army rations.',
    'For Anhui floods Deng Tingzhen could buy neighboring grain for fair sale and army rations.',
  ],
  s0038: [
    'On day guiyou, Zhalong\'a was sentenced to execution for falsely implicating the Muslim king Isa in rebellion.',
    'On guiyou Zhalong\'a was condemned for falsely charging Muslim king Isa with rebellion.',
  ],
  s0039: [
    'On day xinwei, the Xinjiang resident minister and Hotan brigade commander posts were moved to Yarkand, and a regional commander was added at Barkul.',
    'On xinwei the Xinjiang resident minister and Hotan brigade commander moved to Yarkand; a commander was added at Barkul.',
  ],
  s0040: [
    'On day jimao, Muzhang\'a and Zhu Shiyan were ordered to Jiangnan to investigate relief affairs.',
    'On jimao Muzhang\'a and Zhu Shiyan were sent to Jiangnan to investigate relief.',
  ],
  s0041: [
    'That month, ration grain was given to five Hunan districts including Wuling, Tongzi in Guizhou, and Shixian guard.',
    'That month Wuling and four other Hunan districts, Tongzi, and Shixian guard received ration grain.',
  ],
  s0042: [
    'Pay was lent to six Jiangsu garrisons including Jiangning in disaster areas.',
    'Six Jiangsu garrisons including Jiangning received lent disaster pay.',
  ],
  s0043: [
    'Eighth month, day jichou, longevity festival: the Emperor went to the Empress Dowager\'s palace to perform rites.',
    'In month 8, jichou, longevity day, the Emperor paid respects at the Empress Dowager\'s palace.',
  ],
  s0044: [
    'At the Hall of Supreme Harmony, princes and civil and military officials, Mongol nobles, and foreign envoys performed congratulations; the banquet was suspended.',
    'At the Hall of Supreme Harmony princes, officials, Mongol nobles, and foreign envoys congratulated; no banquet was held.',
  ],
  s0045: [
    'On day xinmao, Changling was advanced to Grand Preceptor.',
    'On xinmao Changling became Grand Preceptor.',
  ],
  s0046: [
    'On day weimo, Songyun was dismissed for illness; Muzhang\'a was transferred to Minister of War; Fujun to Works.',
    'On weimo Songyun left for illness; Muzhang\'a took war and Fujun works.',
  ],
  s0047: [
    'Boqitu was made Minister of the Court of Colonial Affairs.',
    'Boqitu took the Colonial Affairs ministry.',
  ],
  s0048: [
    'On day xinchou, the King of Siam sent a tribute envoy returning officials and people from the interior stranded by wind to Guangdong; a warm edict praised and rewarded him.',
    'On xinchou Siam\'s envoy returned storm-stranded interior subjects to Guangdong and received warm praise and reward.',
  ],
  s0049: [
    'On day guimao, Baochang was made Rehe commander.',
    'On guimao Baochang became Rehe commander.',
  ],
  s0050: [
    'Wu Rongguang was made Hunan governor.',
    'Wu Rongguang became Hunan governor.',
  ],
  s0051: [
    'That month, ration grain and seed were given for floods to eleven Jiangsu districts including Ganquan, sixteen Hubei including Jiangxia, and twenty Jiangxi including Dehua.',
    'That month eleven Jiangsu, sixteen Hubei, and twenty Jiangxi flood districts received ration grain and seed.',
  ],
  s0052: [
    'Rice was lent to the Jiangning garrison and Liyang Camp in Jiangnan.',
    'Jiangnan\'s Jiangning garrison and Liyang Camp received lent rice.',
  ],
  s0053: [
    'Ninth month, day jiazi: Fukejing\'a was stripped of office over an affair; Baoxing was made Jilin general.',
    'In month 9, jiazi, Fukejing\'a lost office over an affair; Baoxing became Jilin general.',
  ],
  s0054: [
    'On day dingchou, the King of Vietnam sent an envoy returning storm victims to Fujian; a warm edict praised and rewarded him.',
    'On dingchou Vietnam\'s envoy returned storm victims to Fujian and received warm praise and reward.',
  ],
  s0055: [
    'Winter, tenth month: Yan Yan was dismissed for illness; Lin Zexu was made Hedong river conservancy governor-general.',
    'In winter, month 10, Yan Yan left for illness; Lin Zexu became Hedong river conservancy governor-general.',
  ],
  s0056: [
    'On day jichou, the Kashgar assistant post was changed to brigade commander.',
    'On jichou Kashgar\'s assistant post became brigade commander.',
  ],
  s0057: [
    'On day weimo, eighty thousand shi of Jiangxi tribute grain were ordered retained to relieve famine in Nanchang and Jiujiang.',
    'On weimo eighty thousand shi of Jiangxi tribute grain were held back for Nanchang and Jiujiang famine relief.',
  ],
  s0058: [
    'That month, flood relief was given to twenty-three Anhui districts and guards including Wuwei, twenty-six Jiangsu including Shangyuan, seven Zhejiang including Renhe, and six Lianghuai salt fields including Dingxi.',
    'That month floods were relieved in twenty-three Anhui, twenty-six Jiangsu, seven Zhejiang, and six Lianghuai salt districts.',
  ],
  s0059: [
    'Ration grain and house-repair funds were given to ten Anhui districts including Tongcheng, five Hunan including Wuling, and Dehua in Jiangxi.',
    'Tongcheng and nine other Anhui districts, five Hunan counties, and Dehua received ration grain and repair funds.',
  ],
  s0060: [
    'Ration grain was lent in eighteen Gansu districts including Gaolan; dyke repair funds were lent for Wuling and Longyang in Hunan.',
    'Eighteen Gansu districts including Gaolan received lent grain; Wuling and Longyang received dyke repair funds.',
  ],
  s0061: [
    'Eleventh month, day bingchen: Grand Secretary Tuojin was dismissed for illness.',
    'In month 11, bingchen, Grand Secretary Tuojin left for illness.',
  ],
  s0062: [
    'Wu Bangqing was made grain transport governor-general.',
    'Wu Bangqing became grain transport governor-general.',
  ],
  s0063: [
    'On day jisi, Songyun was removed as inner grand minister, demoted to third-rank top, and retired.',
    'On jisi Songyun lost inner grand minister rank, took third-rank top, and retired.',
  ],
  s0064: [
    'That month, ration grain was lent at five Fengtian districts including Tieling and four Juliu River places; dyke funds were lent for six Jiangxi counties including Nanchang.',
    'That month Tieling and four other Fengtian districts and four Juliu River places received lent grain; six Jiangxi counties including Nanchang received dyke funds.',
  ],
  s0065: [
    'Old and new quota taxes were remitted or deferred for hail and frost at Ningguta and Shuangcheng Bao.',
    'Ningguta and Shuangcheng Bao had hail and frost taxes remitted or deferred.',
  ],
  s0066: [
    'Twelfth month, day yiyou: Fujun was made grand secretary in charge of War; Wen Fu was made associate grand secretary.',
    'In month 12, yiyou, Fujun became grand secretary over War; Wen Fu became associate grand secretary.',
  ],
  s0067: [
    'Muzhang\'a was transferred to Minister of Works.',
    'Muzhang\'a took works.',
  ],
  s0068: [
    'Na Qing\'an was made Minister of War; Sheng Yin was made Left Censor-in-Chief; Yande was made Suiyuan City general.',
    'Na Qing\'an took war; Sheng Yin the left censorate; Yande became Suiyuan City general.',
  ],
  s0069: [
    'On day yisi, Wu Bangqing was made Jiangxi governor; Su Chenge was made grain transport governor-general.',
    'On yisi Wu Bangqing took Jiangxi and Su Chenge grain transport.',
  ],
  s0070: [
    'That month, extended relief was given for floods in sixteen Hubei districts including Jiangxia.',
    'That month sixteen flooded Hubei districts including Jiangxia received extended relief.',
  ],
  s0071: [
    'Ration grain was given for floods to twenty-five Jiangsu districts and guards including Shangyuan and fifteen Dingxi salt fields.',
    'Twenty-five Jiangsu districts including Shangyuan and fifteen Dingxi salt fields received flood ration grain.',
  ],
  s0072: [
    'Pay was lent to twenty-seven Jiangsu garrisons including Zhenjiang and to Changde and Lizhou camps in Hunan for flood.',
    'Twenty-seven Jiangsu garrisons including Zhenjiang and Changde and Lizhou camps received lent flood pay.',
  ],
  s0073: [
    'In the twelfth year, spring, first month, day xinyou, commercial ship rice tax was waived for three Zhejiang prefectures including Hangzhou.',
    'In Daoguang 12, month 1, xinyou, commercial ship rice tax was waived for Hangzhou and two other Zhejiang prefectures.',
  ],
  s0074: [
    'On day dingmao, Chen Ruolin was dismissed; Dai Dunyuan was ordered to act as Minister of Punishments.',
    'On dingmao Chen Ruolin left office; Dai Dunyuan acted at Punishments.',
  ],
  s0075: [
    'On day guiyou, Wang Yinzhi entered mourning leave; Wang Shouhe was made Minister of Rites.',
    'On guiyou Wang Yinzhi mourned; Wang Shouhe took rites.',
  ],
  s0076: [
    'That month, flood and drought relief was given to twenty-one Anhui districts including Huaining, and poor relief grain was given to seventeen districts and guards including Huaining.',
    'That month twenty-one Anhui districts including Huaining were relieved for flood and drought; seventeen including Huaining received poor relief grain.',
  ],
  s0077: [
    'Grain was lent to disaster victims in four Zhili districts including Daming, three Henan including Shangqiu, four Shaanxi including Jiazhou, sixteen Jiangxi including Nanchang, twenty Hubei districts and guards including Jiangxia, ten Hunan districts and guards including Wuling, seven Gansu including Weiyuan, and Tongzi in Guizhou.',
    'Disaster grain and seed loans went to victims in Zhili, Henan, Shaanxi, Jiangxi, Hubei, Hunan, Gansu, and Guizhou.',
  ],
  s0078: [
    'Second month, day wuyin: Yao bandit Zhao Jinlong rebelled in Jianghua, Hunan; Lu Kun and others were ordered to suppress him.',
    'In month 2, wuyin, Yao rebel Zhao Jinlong rose in Jianghua; Lu Kun and others were sent to suppress him.',
  ],
  s0079: [
    'On day jimao, the Emperor attended the classics lecture.',
    'On jimao the Emperor attended the classics lecture.',
  ],
  s0080: [
    'On day jiashen, Liang Zhongjing memorialized on investigating heterodox sects with wrongful implication and suppression; an edict rebuked him.',
    'On jiashen Liang Zhongjing attacked wrongful sect prosecutions and was rebuked by edict.',
  ],
  s0081: [
    'On day xinmao, Zhong Chang was demoted and transferred.',
    'On xinmao Zhong Chang was demoted and transferred.',
  ],
  s0082: [
    'Dai Dunyuan was made Minister of Punishments.',
    'Dai Dunyuan took Punishments.',
  ],
  s0083: [
    'On day weimo, Fujian-Zhejiang Governor-General Sun Erzhun died; Cheng Zuluo was made Fujian-Zhejiang governor-general, Lin Zexu Jiangsu governor, Wu Bangqing Hedong river conservancy governor-general, and Zhou Zhiqi Jiangxi governor.',
    'On weimo Sun Erzhun died; Cheng Zuluo took Fujian-Zhejiang, Lin Zexu Jiangsu, Wu Bangqing Hedong river works, Zhou Zhiqi Jiangxi.',
  ],
  s0084: [
    'On day bingshen, Li Hongbin was ordered to suppress the Yao bandits.',
    'On bingshen Li Hongbin was sent to suppress the Yao bandits.',
  ],
  s0085: [
    'On day renyin, because of the visit to the Eastern Tombs, Yishao and others were ordered to remain in Beijing to conduct affairs.',
    'On renyin, for the Eastern Tombs visit, Yishao and others stayed in Beijing to govern.',
  ],
  s0086: [
    'Third month, day jiyou: Hunan Commander Hailing\'a, Vice General Ma Tao, and others fought Yao bandits at Ningyuan, were defeated, and died.',
    'In month 3, jiyou, Hailing\'a and Ma Tao fought Yao bandits at Ningyuan, lost, and were killed.',
  ],
  s0087: [
    'On day renzi, the Emperor visited the Eastern Tombs and waived thirty percent of quota taxes along the route.',
    'On renzi the Emperor visited the Eastern Tombs and cut route taxes by thirty percent.',
  ],
  s0088: [
    'On day yimao, the Emperor visited Zhaoxiling, Xiaoling, Xiaodongling, Jingling, and Yuling.',
    'On yimao he visited Zhaoxiling, Xiaoling, Xiaodongling, Jingling, and Yuling.',
  ],
  s0089: [
    'On day bingchen, Husong\'e was summoned; Yihao was ordered to act as Shengjing general.',
    'On bingchen Husong\'e was summoned; Yihao acted as Shengjing general.',
  ],
  s0090: [
    'On day jiwei, the Emperor went to the Southern Park for the encircling hunt.',
    'On jiwei the Emperor hunted at the Southern Park.',
  ],
  s0091: [
    'On day gengshen, Changling was summoned.',
    'On gengshen Changling was summoned.',
  ],
  s0092: [
    'On day guihai, the Emperor returned to the capital.',
    'On guihai the Emperor returned to Beijing.',
  ],
  s0093: [
    'On day gengwu, Minister of Revenue Xi\'en was ordered to Hunan to suppress Yao bandits; Wen Fu was ordered to act as Minister of Revenue.',
    'On gengwu Xi\'en was sent to Hunan against the Yao bandits; Wen Fu acted at Revenue.',
  ],
  s0094: [
    'That month, extended relief was given for floods in Jiangxia and Hanchuan in Hubei.',
    'That month Jiangxia and Hanchuan received extended flood relief.',
  ],
  s0095: [
    'Ration grain was given to disaster victims in Qingyang, Anhui.',
    'Qingyang disaster victims received ration grain.',
  ],
  s0096: [
    'Ration grain and seed were lent to disaster victims in seven Gansu districts including Gaolan and to tun settlers in five Hunan districts including Qianzhou; grain stores were lent to flooded troops of the Hubei governor-general and provincial commander banners and the Wuchang city garrison.',
    'Gaolan and six other Gansu districts, five Qianzhou-area Hunan tun districts, and flooded Hubei banners and Wuchang garrison received disaster loans.',
  ],
  s0097: [
    'Summer, fourth month, day guisi: prayers for rain.',
    'In summer, month 4, guisi, the court prayed for rain.',
  ],
  s0098: [
    'On day wuxu, it rained.',
    'On wuxu it rained.',
  ],
  s0099: [
    'On day xinchou, two hundred six men including Wu Zhongjun were granted metropolitan graduate degrees with rank differences.',
    'On xinchou 206 men including Wu Zhongjun received jinshi degrees with differing ranks.',
  ],
  s0100: [
    'On day yisi, Lu Kun and others defeated Yao bandits at Yangquan, annihilated them, and captured Zhao Jinlong\'s son and more than fifty bandit chiefs.',
    'On yisi Lu Kun routed Yao bandits at Yangquan, killed them all, and took Zhao Jinlong\'s son and over fifty chiefs.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b01.mjs <translation.json>'
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
