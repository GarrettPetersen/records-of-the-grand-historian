#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the twenty-first year, spring, first month, day jichou, the English attacked Guangdong\'s Humen; Vice Commander Chen Lianbi and his son Ju Peng died.',
    'In Daoguang 21, month 1, jichou, the British struck Humen in Guangdong; Chen Lianbi and his son Ju Peng were killed.',
  ],
  s0002: [
    'On day gengyin, Yishan was made an imperial presence grand minister.',
    'On gengyin day, Yishan became an imperial presence grand minister.',
  ],
  s0003: [
    'On day xinmao, because Humen had fallen Qishan was referred to the ministries for severe deliberation, and Naval Commander Guan Tianpei\'s peacock feather was stripped.',
    'On xinmao day, after Humen fell Qishan faced severe board review and Guan Tianpei lost his peacock feather.',
  ],
  s0004: [
    'Yishan was ordered to be Pacification-of-Rebellion General, with Long Wen and Yang Fang as staff commissioners to supervise Guangdong coastal defense.',
    'Yishan was made Pacification General with Long Wen and Yang Fang as commissioners for Guangdong coastal defense.',
  ],
  s0005: [
    'Saishang\'a was ordered to serve on the Grand Council.',
    'Saishang\'a joined the Grand Council.',
  ],
  s0006: [
    'On day gengzi, Ne\'erjing\'e was ordered to remain at Tianjin and supervise coastal defense.',
    'On gengzi day, Ne\'erjing\'e was posted at Tianjin to supervise coastal defense.',
  ],
  s0007: [
    'Hala\'a was ordered to proceed to Shanhaiguan and supervise coastal defense.',
    'Hala\'a was sent to Shanhaiguan to supervise coastal defense.',
  ],
  s0008: [
    'Qiying and others were ordered to keep scouting patrols diligent.',
    'Qiying and others were told to keep scouts active.',
  ],
  s0009: [
    'On day jisi, Yilibu was ordered to return to his Liang-Jiang governor-general post; Yuqian was made Imperial Commissioner to handle Zhejiang military affairs.',
    'On jisi day, Yilibu went back to Liang-Jiang and Yuqian became Imperial Commissioner for Zhejiang.',
  ],
  s0010: [
    'On day xinhai, Qishan was stripped of grand secretary rank and again referred to the ministries for severe deliberation.',
    'On xinhai day, Qishan lost grand secretary rank and again faced severe board review.',
  ],
  s0011: [
    'That month, ration grain was issued to banner households at Fengtian\'s Baiqibao for flood disaster.',
    'That month, Fengtian\'s Baiqibao banner households received flood rations.',
  ],
  s0012: [
    'Granary grain was issued for flood disaster to Jiangdu and Dantu counties, Jiangsu; Fengtian\'s Xiaoheishan station households; Jiangsu\'s Miaowan saltern households; and Dongliu and Fanchang counties, Anhui, for flood-and-drought ration grain.',
    'Jiangdu and Dantu, Xiaoheishan stationers, Miaowan saltern workers, and Dongliu and Fanchang received disaster grain.',
  ],
  s0013: [
    'Seed grain was loaned for flood disaster to eight Hubei prefectures, counties, and guards including Mianyang, Wuling county in Hunan, and five Gansu prefectures and counties including Jinzhou; ration grain was loaned for flood disaster to eleven Jiangsu counties including Shangyuan and Gaolan county, Gansu; and granary grain was issued for hail disaster at Hequ county, Shanxi.',
    'Flood seed loans went to Mianyang and seven other Hubei units, Wuling, five Gansu districts, Shangyuan and ten other Jiangsu counties, and Gaolan; Hequ received hail granary grain.',
  ],
  s0014: [
    'Second month, day gengshen: because Yilibu delayed and did not advance, he was referred to the ministries for severe deliberation.',
    'In month 2, gengshen, Yilibu was sent for severe review for delaying his advance.',
  ],
  s0015: [
    'On day xinyou, Qishan was arrested for interrogation and his household property was again confiscated.',
    'On xinyou day, Qishan was arrested and his property was confiscated again.',
  ],
  s0016: [
    'Qi was made Liang-Guang governor-general, with Yiliang acting concurrently; Li Zhenfu acted as Minister of Punishments; Ne\'erjing\'e was appointed Zhili governor-general; and Enteheng\'e was made Shaanxi-Gansu governor-general.',
    'Qi took Liang-Guang with Yiliang acting; Li Zhenfu acted at Punishments; Ne\'erjing\'e took Zhili; Enteheng\'e took Shaanxi-Gansu.',
  ],
  s0017: [
    'On day bingyin, Vietnam\'s King Ruan Fuciao died; tribute goods were ordered suspended.',
    'On bingyin day, Vietnam\'s King Ruan Fuciao died and tribute was suspended.',
  ],
  s0018: [
    'On day wuchen, because the English had left Dinghai, Yilibu was stripped of associate grand secretary rank for cowardice but kept the Liang-Jiang governor-general post.',
    'On wuchen day, with the British gone from Dinghai, Yilibu lost associate grand secretary rank for cowardice but kept Liang-Jiang.',
  ],
  s0019: [
    'Baoxing was made grand secretary while remaining Sichuan governor-general.',
    'Baoxing became grand secretary and stayed at Sichuan.',
  ],
  s0020: [
    'Yijing was made associate grand secretary.',
    'Yijing became associate grand secretary.',
  ],
  s0021: [
    'On day wuyin, Qi Shen was ordered to be staff commissioner and proceed to Guangdong for joint suppression.',
    'On wuyin day, Qi Shen was sent to Guangdong as staff commissioner for joint suppression.',
  ],
  s0022: [
    'On day renwu, the English took Guangdong\'s Humen batteries and the Wuyong barrier post; Guangdong naval commander Guan Tianpei, acting Hunan commander Xiang Fu, and others died.',
    'On renwu day, the British took Humen batteries and Wuyong; Guan Tianpei, Xiang Fu, and others were killed.',
  ],
  s0023: [
    'That month, extended relief was given to disaster victims in Jiangsu\'s Jiangning and Tongzhou prefectures.',
    'That month, Jiangning and Tongzhou received extended disaster relief.',
  ],
  s0024: [
    'Third month, new moon on day bingxu: Zhou Tianjue was released to proceed to the Guangdong army camp.',
    'In month 3, bingxu new moon, Zhou Tianjue was freed to go to the Guangdong camp.',
  ],
  s0025: [
    'On day jiawu, the Emperor visited the Western Tombs and remitted three-tenths of quota levies on places the route passed through.',
    'On jiawu day, the Emperor visited the Western Tombs and cut route taxes by thirty percent.',
  ],
  s0026: [
    'On day yiwei, retired Grand Secretary Wen Fu died.',
    'On yiwei day, retired Grand Secretary Wen Fu died.',
  ],
  s0027: [
    'On day bingshen, English warships entered Guangdong\'s inner harbor; Yang Fang and others drove them off.',
    'On bingshen day, British ships entered Guangdong\'s inner harbor and Yang Fang drove them off.',
  ],
  s0028: [
    'On day wuxu, the Emperor visited Tailing, Taidongling, and Changling, and at Longquan Valley offered libation at the tomb palaces of Empresses Xiaomu, Xiaoshen, and Xiaoquan.',
    'On wuxu day, the Emperor visited Tailing, Taidongling, and Changling and offered at Longquan Valley to Empresses Xiaomu, Xiaoshen, and Xiaoquan.',
  ],
  s0029: [
    'On day jihai, the Emperor again visited Changling and performed the earth-spreading rite.',
    'On jihai day, the Emperor again visited Changling and performed the earth-spreading rite.',
  ],
  s0030: [
    'He went to Long\'en Hall and performed the great feast rite.',
    'At Long\'en Hall he held the great feast rite.',
  ],
  s0031: [
    'On day renyin, the Emperor returned to the capital.',
    'On renyin day, the Emperor returned to Beijing.',
  ],
  s0032: [
    'On day bingwu, the Emperor went in person to the late Grand Secretary Wen Fu\'s residence to grant mourning gifts.',
    'On bingwu day, the Emperor mourned at Wen Fu\'s house.',
  ],
  s0033: [
    'On day wushen, Meilijian and other states were permitted to trade.',
    'On wushen day, America and other countries were allowed to trade.',
  ],
  s0034: [
    'On day gengxu, because Yuqian memorialized, coastal treaty ports were ordered to allow merchants to trade as before.',
    'On gengxu day, Yuqian\'s memorial reopened coastal treaty ports to merchant trade.',
  ],
  s0035: [
    'On day renzi, Yang Fang and others asked that British merchant ships still be allowed to trade at Guangdong.',
    'On renzi day, Yang Fang and others asked to keep British trade at Guangdong.',
  ],
  s0036: [
    'It was not permitted; Yang Fang and Yiliang were ordered referred to the ministries for severe deliberation.',
    'The court refused and sent Yang Fang and Yiliang for severe review.',
  ],
  s0037: [
    'Intercalary third month, new moon on day yimao: Yang Fang and Yiliang were stripped of office but kept in post.',
    'At intercalary month 3, yimao new moon, Yang Fang and Yiliang lost rank but stayed on.',
  ],
  s0038: [
    'On day bingyin, Tang Jinzhao was demoted and transferred; Zhuo Bingtian was transferred to be Minister of Personnel and associate grand secretary; Qi Junzao was made Minister of Revenue; and Xu Naipu was made Minister of War.',
    'On bingyin day, Tang Jinzhao was demoted; Zhuo Bingtian took Personnel and became associate grand secretary; Qi Junzao took Revenue; Xu Naipu took War.',
  ],
  s0039: [
    'On day dingmao, Yilibu was summoned to the capital; Yuqian was made Liang-Jiang governor-general; and Dinghai coastal defense was ordered handed to Liu Yunke.',
    'On dingmao day, Yilibu was called to Beijing; Yuqian took Liang-Jiang; Liu Yunke took Dinghai defense.',
  ],
  s0040: [
    'Liang Zhangju was transferred to be Jiangsu governor, and Zhou Zhiqi was made Guangxi governor.',
    'Liang Zhangju took Jiangsu and Zhou Zhiqi took Guangxi.',
  ],
  s0041: [
    'On day yihai, Yishan and others were instructed to comfort and relieve foreign merchants of all nations.',
    'On yihai day, Yishan and others were told to soothe foreign merchants.',
  ],
  s0042: [
    'That month, granary grain was loaned for last year\'s poor harvest to ten Shanxi prefectures and counties including Jizhou and Horinger banner.',
    'That month, Jizhou and nine other Shanxi districts and Horinger received poor-harvest granary loans.',
  ],
  s0043: [
    'Flood-stricken beach rents at Suqian county, Jiangsu, were remitted or deferred.',
    'Suqian\'s flooded beach rents were remitted or deferred.',
  ],
  s0044: [
    'Summer, fourth month, day jichou: Yuqian was again ordered to be Imperial Commissioner to supervise Zhejiang coastal defense.',
    'In summer, month 4, jichou, Yuqian again became Imperial Commissioner for Zhejiang coastal defense.',
  ],
  s0045: [
    'The English took the batteries outside Guangdong\'s provincial city.',
    'The British took Guangzhou\'s outer batteries.',
  ],
  s0046: [
    'On day jiachen, Minister of Rites Kuizhao left office on illness; Sekejin\'e was made Minister of Rites.',
    'On jiachen day, Kuizhao retired ill and Sekejin\'e took Rites.',
  ],
  s0047: [
    'Two hundred two men including Long Qirui were granted metropolitan graduate degrees with rank differences.',
    '202 men including Long Qirui received jinshi degrees with differing ranks.',
  ],
  s0048: [
    'On day xinhai, the Prince of Rui and others, grand secretaries, Grand Councilors, and ministers of the boards were ordered to join the Ministry of Punishments in interrogating Yilibu.',
    'On xinhai day, princes, grand secretaries, councilors, and ministers joined Punishments to try Yilibu.',
  ],
  s0049: [
    'On day guichou, because the siege of Guangdong\'s provincial city was urgent, Yishan and others were permitted by memorial to allow the English to trade.',
    'On guichou day, with Guangzhou besieged, Yishan\'s memorial opened trade to the British.',
  ],
  s0050: [
    'That month, overdue levies were deferred for six Shanxi prefectures and counties including Shuozhou.',
    'That month, Shuozhou and five other Shanxi districts had overdue levies deferred.',
  ],
  s0051: [
    'Fifth month, day bingchen: English ships entered Zhejiang waters; Yuqian was ordered to tighten naval defenses at every port.',
    'In month 5, bingchen, British ships entered Zhejiang waters and Yuqian was told to tighten every port.',
  ],
  s0052: [
    'On day guihai, Deng Tingzhen and Lin Zexu were banished to Yili.',
    'On guihai day, Deng Tingzhen and Lin Zexu were exiled to Yili.',
  ],
  s0053: [
    'On day guiyou, English ships left Guangdong\'s Humen.',
    'On guiyou day, British ships left Humen.',
  ],
  s0054: [
    'Muzhang\'a was removed from managing the Court of Colonial Affairs; Saishang\'a was ordered to replace him.',
    'Muzhang\'a left colonial affairs management and Saishang\'a replaced him.',
  ],
  s0055: [
    'Staff Commissioner and Minister of Revenue Long Wen died in camp.',
    'Staff Commissioner and Revenue Minister Long Wen died in the field.',
  ],
  s0056: [
    'On day gengchen, Jingzheng was transferred to be Minister of Revenue; Saishang\'a Minister of Works; and En Gui Minister of the Court of Colonial Affairs.',
    'On gengchen day, Jingzheng took Revenue, Saishang\'a Works, and En Gui colonial affairs.',
  ],
  s0057: [
    'On day renwu, Wu Wenrong was transferred to be Jiangxi governor and Qian Baochen Hunan governor.',
    'On renwu day, Wu Wenrong took Jiangxi and Qian Baochen Hunan.',
  ],
  s0058: [
    'Yixing was made Suiyuan City general.',
    'Yixing became Suiyuan City general.',
  ],
  s0059: [
    'Sixth month: Qi and others\' memorial fixing regulations for merchant ships proceeding to Tianjin and other places was approved.',
    'In month 6, Qi\'s regulations for merchant ships to Tianjin and elsewhere were approved.',
  ],
  s0060: [
    'On day gengyin, Yilibu was stripped of office and sent to military courier stations to redeem guilt through service.',
    'On gengyin day, Yilibu lost office and was sent to courier stations to redeem his guilt.',
  ],
  s0061: [
    'Yishan and others\' memorial to withdraw troops by stages was approved.',
    'Yishan\'s staged troop withdrawal was approved.',
  ],
  s0062: [
    'On day wuxu, Qishan was sentenced to decapitation.',
    'On wuxu day, Qishan was sentenced to death.',
  ],
  s0063: [
    'On day guimao, the Henan Xiaonan Office river breached.',
    'On guimao day, the Henan Xiaonan Office river broke.',
  ],
  s0064: [
    'On day xinmao, Wen Chong was stripped of office but kept the Grand Canal-East transport governor-general post; Niu Jian was referred to the ministries for severe deliberation.',
    'On xinmao day, Wen Chong lost rank but kept canal-east transport; Niu Jian faced severe review.',
  ],
  s0065: [
    'Seventh month, day bingchen: Wang Ding and others were ordered to proceed to the Eastern River to supervise works.',
    'In month 7, bingchen, Wang Ding and others were sent to supervise Eastern River works.',
  ],
  s0066: [
    'On day renxu, Li Zhenfu was made Minister of Punishments.',
    'On renxu day, Li Zhenfu took Punishments.',
  ],
  s0067: [
    'On day dingmao, because the Dalai Lama had been enthroned in the fourth month, an imperial patent was issued.',
    'On dingmao day, after the Dalai Lama\'s fourth-month enthronement, an imperial patent was issued.',
  ],
  s0068: [
    'On day wuchen, former Ningxia general Te Yishun was made staff commissioner and ordered to proceed to Guangdong.',
    'On wuchen day, former Ningxia general Te Yishun was sent to Guangdong as staff commissioner.',
  ],
  s0069: [
    'On day xinwei, because the river had overflowed, Niu Jian was ordered to move the people and give disaster relief.',
    'On xinwei day, with the river in flood, Niu Jian was ordered to relocate people and relieve disaster.',
  ],
  s0070: [
    'On day jimao, Lan Xang presented tribute.',
    'On jimao day, Lan Xang sent tribute.',
  ],
  s0071: [
    'On day gengchen, the English took Fujian\'s Xiamen; Regional Commander Jiang Jiyun and others died.',
    'On gengchen day, the British took Xiamen; Jiang Jiyun and others were killed.',
  ],
  s0072: [
    'The late Vietnam King Ruan Fuciao\'s son Ruan Fuxuan was made King of Vietnam; Guangxi surveillance commissioner Bao Qing was ordered to proceed to invest him.',
    'Ruan Fuxuan succeeded his father as Vietnam\'s king and Bao Qing was sent to invest him.',
  ],
  s0073: [
    'Eighth month, day guiwei: Gui Lun was made Rehe commander.',
    'In month 8, guiwei, Gui Lun became Rehe commander.',
  ],
  s0074: [
    'On day dinghai, the English attacked Zhejiang.',
    'On dinghai day, the British attacked Zhejiang.',
  ],
  s0075: [
    'On day gengyin, Zhu Xiang was made Grand Canal-East transport governor-general.',
    'On gengyin day, Zhu Xiang became canal-east transport governor-general.',
  ],
  s0076: [
    'On day xinmao, longevity festival: the Emperor went to the Empress Dowager\'s palace to perform rites.',
    'On xinmao day, longevity day, the Emperor paid respects at the Empress Dowager\'s palace.',
  ],
  s0077: [
    'At the Hall of Supreme Harmony, princes and civil and military officials, Mongol envoys, and foreign tributary princes performed congratulations.',
    'At the Hall of Supreme Harmony princes, officials, Mongol envoys, and foreign princes congratulated.',
  ],
  s0078: [
    'Wen Chong was stripped of office and cangued at the river bank.',
    'Wen Chong lost office and wore the cangue at the riverbank.',
  ],
  s0079: [
    'Wang Ding was ordered to act as Grand Canal-East transport governor-general.',
    'Wang Ding acted as canal-east transport governor-general.',
  ],
  s0080: [
    'The English left Xiamen.',
    'The British left Xiamen.',
  ],
  s0081: [
    'On day dingyou, the English attacked Shuang\'ao, Shipu, and other places in Zhejiang; Yuqian supervised troops and drove them off.',
    'On dingyou day, the British hit Shuang\'ao and Shipu in Zhejiang and Yuqian drove them off.',
  ],
  s0082: [
    'Yiliang was ordered to proceed to Fujian to investigate military affairs.',
    'Yiliang was sent to Fujian to investigate military affairs.',
  ],
  s0083: [
    'Liang Baochang was ordered to act as Guangdong governor.',
    'Liang Baochang acted as Guangdong governor.',
  ],
  s0084: [
    'On day gengzi, Zhao Bingyan was made Hubei governor.',
    'On gengzi day, Zhao Bingyan became Hubei governor.',
  ],
  s0085: [
    'On day xinchou, the English again attacked Zhejiang on a large scale.',
    'On xinchou day, the British again invaded Zhejiang in force.',
  ],
  s0086: [
    'On day wushen, the English again took Dinghai; Regional Commander Wang Xipeng, Zheng Guohong, Ge Yunfei, and others died.',
    'On wushen day, the British retook Dinghai; Wang Xipeng, Zheng Guohong, Ge Yunfei, and others were killed.',
  ],
  s0087: [
    'Yuqian and Yu Buyun were referred to the ministries for severe deliberation.',
    'Yuqian and Yu Buyun faced severe board review.',
  ],
  s0088: [
    'That month, quota levies were remitted for flood disaster at Huazhou and Daliji prefectures, Shaanxi, and eight Henan prefectures and counties including Suizhou.',
    'That month, Huazhou, Daliji, and eight Henan districts including Suizhou had flood taxes remitted.',
  ],
  s0089: [
    'Ninth month, day yimao: the English took Zhenhai; Imperial Commissioner Yuqian died, and Commander Yu Buyun fled.',
    'In month 9, yimao, the British took Zhenhai; Yuqian was killed and Yu Buyun fled.',
  ],
  s0090: [
    'Yijing was ordered to be Displaying-Might General, with Hala\'a and Hu Chao as staff commissioners to supervise Zhejiang coastal defense.',
    'Yijing became Displaying-Might General with Hala\'a and Hu Chao as commissioners for Zhejiang defense.',
  ],
  s0091: [
    'Yiliang was made Imperial Commissioner to join Yan Bozhao and Liu Hong\'ao in supervising Zhejiang coastal defense.',
    'Yiliang became Imperial Commissioner with Yan Bozhao and Liu Hong\'ao for Zhejiang defense.',
  ],
  s0092: [
    'Niu Jian was ordered to act as Liang-Jiang governor-general, and E Shun\'an to act as Henan governor.',
    'Niu Jian acted at Liang-Jiang and E Shun\'an at Henan.',
  ],
  s0093: [
    'On day dingsi, Wen Wei was ordered to be staff commissioner and proceed to Zhejiang; Hu Chao remained stationed at Tianjin.',
    'On dingsi day, Wen Wei was sent to Zhejiang as staff commissioner; Hu Chao stayed at Tianjin.',
  ],
  s0094: [
    'Te Yishun was ordered to be staff commissioner and proceed to Zhejiang; Hala\'a remained stationed at Shanhaiguan.',
    'Te Yishun was sent to Zhejiang as staff commissioner; Hala\'a stayed at Shanhaiguan.',
  ],
  s0095: [
    'Qi Junzao was ordered to serve on the Grand Council.',
    'Qi Junzao joined the Grand Council.',
  ],
  s0096: [
    'Niu Jian was appointed Liang-Jiang governor-general.',
    'Niu Jian became Liang-Jiang governor-general.',
  ],
  s0097: [
    'On day xinyou, the English took Zhejiang\'s Ningbo prefecture.',
    'On xinyou day, the British took Ningbo prefecture.',
  ],
  s0098: [
    'On day jisi, the Emperor reviewed Firearms Camp troops.',
    'On jisi day, the Emperor reviewed Firearms Camp troops.',
  ],
  s0099: [
    'That month, ration grain was issued for flood disaster to six Fengtian prefectures and counties including Liaoyang.',
    'That month, Liaoyang and five other Fengtian districts received flood rations.',
  ],
  s0100: [
    'Winter, tenth month, day wuzi: Senggelinqin and others were ordered to inspect the Tianjin river mouth.',
    'In winter, month 10, wuzi, Senggelinqin and others were sent to inspect Tianjin\'s river mouth.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b01.mjs <translation.json>'
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
