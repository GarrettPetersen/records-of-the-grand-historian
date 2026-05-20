#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Winter, tenth month, day jiazi, first day: sacrifice at the Imperial Ancestral Temple.',
    'Month 10, jiazi: the emperor offered sacrifice at the Imperial Ancestral Temple.',
  ],
  s0102: [
    'On day guiyou, Empress Dowager Cixi\'s birthday; banquets were suspended.',
    'On guiyou, Cixi\'s birthday was marked without court banquets.',
  ],
  s0103: [
    'On day jiaxu, Ding Baozhen\'s request was approved to build forts and establish machine works at Yantai, Weihaiwei, and Dengzhou.',
    'On jiaxu, forts and arsenals were approved for Yantai, Weihaiwei, and Dengzhou.',
  ],
  s0104: [
    'On day jimao, the prohibition on Zhejiang\'s Nantian Island was lifted and farming was permitted.',
    'On jimao, Nantian Island was opened to cultivation.',
  ],
  s0105: [
    'On day gengchen, the capital\'s poor were given cotton clothing and silver; this was done every year.',
    'On gengchen, the capital poor received winter relief as an annual practice.',
  ],
  s0106: [
    'Bandits led by Li Zengyuan of Xuyong rose in revolt; Regional Commander Li Youheng suppressed them.',
    'Xuyong rebels under Li Zengyuan were suppressed by Li Youheng.',
  ],
  s0107: [
    'On day guiwei, each Eight Banners camp was given one month\'s stipend; this became an annual custom.',
    'On guiwei, the banners received a month\'s pay as a yearly grant.',
  ],
  s0108: [
    'Bandits rose in Hunan\'s Xinhuai, Heng, and Yong; Grand Commander Xie Jinjun and Regional Commander Zhao Liansheng suppressed them.',
    'Hunan bandits in Xinhuai, Heng, and Yong were put down by Xie Jinjun and Zhao Liansheng.',
  ],
  s0109: [
    'On day dinghai, the honorary grandee Ji He and Hanlin Academician Wulaxichong\'a were sent to Korea to invest Li Xi\'s son Tuo as heir apparent.',
    'On dinghai, Ji He and Wulaxichong\'a went to Korea and enfeoffed Li Xi\'s son Tuo as heir.',
  ],
  s0110: [
    'Eleventh month, day wuxu: Cen Yuying took the great stockade at Zhenxiong; bandit chief Ju Zhan\'neng was executed.',
    'Month 11, wuxu: Cen Yuying took Zhenxiong and executed Ju Zhan\'neng.',
  ],
  s0111: [
    'Liu Yuezhao was dismissed for negligence and dilatoriness.',
    'Liu Yuezhao was stripped for slackness.',
  ],
  s0112: [
    'On day dingwei, Bureau Director Chen Lanbin was given third-rank kuotang candidacy and appointed envoy to the United States, Japan, and Peru.',
    'On dingwei, Chen Lanbin became a kuotang candidate and envoy to the United States, Japan, and Peru.',
  ],
  s0113: [
    'On day yimao, bandits at Fengtian\'s Datonggou were pacified.',
    'On yimao, Fengtian\'s Datonggou bandits were pacified.',
  ],
  s0114: [
    'On day wuwu, the winter solstice; Heaven was sacrificed to at the Circular Mound Altar.',
    'On wuwu, the winter solstice sacrifice was held at the Circular Mound.',
  ],
  s0115: [
    'On day jiwei, congratulatory audiences were exempted.',
    'On jiwei, court congratulations were waived.',
  ],
  s0116: [
    'On day gengshen, the spirit tablets of Emperor Muzong and his consort were placed in the Hall of Ancestral Veneration.',
    'On gengshen, Muzong\'s tablets were installed in the Fengxian Hall.',
  ],
  s0117: [
    'Twelfth month, day bingyin: the imperial spirit tablet was installed at the Shouhuang Hall.',
    'Month 12, bingyin: the spirit tablet was placed in the Shouhuang Hall.',
  ],
  s0118: [
    'On day dingmao, the quota tax on Shengjing\'s alkaline pasturelands for imperial herds was remitted.',
    'On dingmao, Shengjing pasture tax was remitted.',
  ],
  s0119: [
    'On day jiaxu, an empress dowager\'s rescript said: "The emperor is to pursue his studies. Grand Secretary Weng Tonghe and Vice Minister Xia Tongshan shall lecture him in the Yuying Palace, and grandees in attendance shall teach Manchu and Mongol speech and script as well as riding and archery.',
    'On jiaxu, Cixi ordered Weng Tonghe and Xia Tongshan to tutor the emperor at Yuying Palace while grandees taught Manchu, Mongol, and archery.',
  ],
  s0120: [
    '" Grand Secretary Wen Xiang asked to leave Grand Council affairs and was urged to remain.',
    'Wen Xiang asked to quit the Grand Council but was kept in office.',
  ],
  s0121: [
    'On day wuyin, old and new tax levies in disaster-struck Zhejiang were remitted.',
    'On wuyin, Zhejiang disaster taxes were remitted.',
  ],
  s0122: [
    'On day jiashen, snow was prayed for at the altars and temples.',
    'On jiashen, snow-prayer rites were held.',
  ],
  s0123: [
    'On day xinmao, the fall collective sacrifice was performed at the Imperial Ancestral Temple.',
    'On xinmao, the fall temple sacrifice was held.',
  ],
  s0124: [
    'This year, Korea, Ryukyu, and Burma presented tribute.',
    'Korea, Ryukyu, and Burma sent tribute this year.',
  ],
  s0125: [
    'In the second year, bingzi, spring, first month, day guisi, first day: congratulatory audiences were exempted.',
    'Year 2, spring 1, guisi: congratulatory audiences were waived.',
  ],
  s0126: [
    'On day wuxu, the provinces were ordered to lecture the Sacred Edict and its Amplified Instructions.',
    'On wuxu, provinces were told to preach the Sacred Edict.',
  ],
  s0127: [
    'On day guimao, levies on unopened salt pans in Renhe and other fields were remitted.',
    'On guimao, unopened Renhe salt-field levies were remitted.',
  ],
  s0128: [
    'On day guichou, Guizhou bandits took Xiajiang but it was soon recovered.',
    'On guichou, Guizhou bandits briefly held Xiajiang.',
  ],
  s0129: [
    'On day bingchen, rain was prayed for.',
    'On bingchen, a rain prayer was held.',
  ],
  s0130: [
    'From then on rain prayers were held frequently.',
    'Rain prayers then became frequent.',
  ],
  s0131: [
    'On day xinyou, the barbarian bandits of Sichuan were pacified.',
    'On xinyou, Sichuan barbarian bandits were pacified.',
  ],
  s0132: [
    'Second month, day yichou: an edict said that from early summer of this year, before the emperor took power in person, seasonal and fall great sacrifices at the Imperial Ancestral Temple would all be performed by the emperor in person on the day before.',
    'Month 2, yichou: before personal rule, the emperor would perform temple rites himself the day before each sacrifice.',
  ],
  s0133: [
    'On day jimao, salt-field quotas at Haisha, Luli, and other pans were remitted.',
    'On jimao, coastal salt-field levies were remitted.',
  ],
  s0134: [
    'On day renwu, the Dengchuan bandit chiefs Luo Hongchang and Xiang He were executed.',
    'On renwu, Luo Hongchang and Xiang He were executed.',
  ],
  s0135: [
    'Arrear taxes in Zhejiang were remitted.',
    'Zhejiang arrear taxes were remitted.',
  ],
  s0136: [
    'On day gengyin, Yangwan native-official assistant prefect Cen Runqing rebelled; Yan Shusen suppressed him.',
    'On gengyin, Cen Runqing of Yangwan rebelled and Yan Shusen suppressed him.',
  ],
  s0137: [
    'On day renchen, Dongxiang bandits gathered in force to resist officials.',
    'On renchen, Dongxiang bandits rose against the government.',
  ],
  s0138: [
    'Third month, day bingshen: because of drought, an edict ordered ordinary prisons cleared.',
    'Month 3, bingshen: drought led to an order to clear ordinary prisons.',
  ],
  s0139: [
    'On day jihai, Wu Zancheng was given third-rank kuotang status to supervise the Fujian shipyard.',
    'On jihai, Wu Zancheng became a third-rank kuotang officer over the Fujian shipyard.',
  ],
  s0140: [
    'On day jiayin, the dismissed commander Chen Guorui was exiled to Heilongjiang.',
    'On jiayin, Chen Guorui was banished to Heilongjiang.',
  ],
  s0141: [
    'On day bingwu, arrear taxes in sixty-six Shaanxi districts were remitted.',
    'On bingwu, Shaanxi arrear taxes in sixty-six districts were remitted.',
  ],
  s0142: [
    'On day dingwei, an edict said that because of Empress Dowager Ci\'an\'s fortieth birthday, autumn executions were suspended this year.',
    'On dingwei, Ci\'an\'s fortieth birthday halted autumn executions.',
  ],
  s0143: [
    'The Four-footed Ox bandit nest in Guizhou and the bandits of the six dong were pacified.',
    'Guizhou\'s Four-footed Ox nest and six-dong bandits were pacified.',
  ],
  s0144: [
    'On day wushen, because rains were delayed, officials at court and in the provinces were told to speak frankly on faults and omissions.',
    'On wushen, delayed rains brought an order for frank criticism of government faults.',
  ],
  s0145: [
    'Summer, fourth month, day yihai: Shaanxi\'s tribute presentations were halted, and arrear taxes in Huai and Yang jurisdictions before the sixth year of Tongzhi were remitted.',
    'Month 4, yihai: Shaanxi tribute stopped and Huai-Yang arrear taxes before Tongzhi 6 were remitted.',
  ],
  s0146: [
    'On day renwu, the emperor began study in the Yuying Palace.',
    'On renwu, the emperor began lessons at Yuying Palace.',
  ],
  s0147: [
    'On day bingxu, Cao Hongxun and three hundred twenty-four others were granted jinshi degrees and court ranks with differences.',
    'On bingxu, Cao Hongxun and 324 others received jinshi degrees.',
  ],
  s0148: [
    'On day wuzi, the Tibetan Sukreta Bege\'er Ma Sa-ha presented a mourning memorial; an edict answered it and silk was bestowed.',
    'On wuzi, the Tibetan Sukreta Bege\'er Ma Sa-ha was answered with an edict and silk.',
  ],
  s0149: [
    'Fifth month, day yiwei: Wen Xiang died.',
    'Month 5, yiwei: Wen Xiang died.',
  ],
  s0150: [
    'On day yisi, because of severe drought near the capital, common people in Zhili, Shandong, Henan, Hebei, and other prefectures faced hunger; local chiefs were ordered to relieve them and catch locusts and hopper larvae.',
    'On yisi, drought near the capital brought orders to relieve famine and catch locusts in Zhili, Shandong, Henan, and Hebei.',
  ],
  s0151: [
    'On day bingchen, Censor Pan Dunyi asked to change the posthumous title of Empress Xiaozhe.',
    'On bingchen, Pan Dunyi sought to change Empress Xiaozhe\'s posthumous title.',
  ],
  s0152: [
    'He was severely reprimanded and soon dismissed.',
    'He was sharply rebuked and soon stripped of office.',
  ],
  s0153: [
    'Intercalary fifth month, day xinyou, first day: drought relief was given in the capital region.',
    'Intercalary month 5, xinyou: the capital region received drought relief.',
  ],
  s0154: [
    'On day gengwu, Fujian\'s flood victims were relieved.',
    'On gengwu, Fujian flood relief was ordered.',
  ],
  s0155: [
    'On day xinwei, because of drought an edict ordered self-examination and reform.',
    'On xinwei, drought brought an edict of self-examination.',
  ],
  s0156: [
    'On day renshen, the great stele pavilion at the Xiaoling Mausoleum burned.',
    'On renshen, Xiaoling\'s great stele pavilion burned.',
  ],
  s0157: [
    'From the first month of spring there had been no rain until rain fell on this day.',
    'Rain finally fell after drought since spring.',
  ],
  s0158: [
    'On day jiashen, the Qi sect bandits of Jiezhou were pacified.',
    'On jiashen, Jiezhou Qi bandits were pacified.',
  ],
  s0159: [
    'On day yiyou, Liu Kunyi was told to guard the coast, train troops, and reform quickly.',
    'On yiyou, Liu Kunyi was ordered to guard the coast and train troops.',
  ],
  s0160: [
    'Sixth month, day gengyin, first day: Wen Kun and others were told to punish severely those who spread heterodox practices.',
    'Month 6, gengyin: Wen Kun and others were ordered to crack down on heterodox cults.',
  ],
  s0161: [
    'On day renchen, the militia of Tengyue seized the city in revolt and also took Shunning and Yunzhou.',
    'On renchen, Tengyue militia rebelled and seized Shunning and Yunzhou.',
  ],
  s0162: [
    'On day dingyou, Li Hongzhang was made plenipotentiary minister and sent to Yantai to settle the Margary case with the British minister Wade.',
    'On dingyou, Li Hongzhang went to Yantai to settle the Margary case with Wade.',
  ],
  s0163: [
    'On day gengzi, locusts appeared in Anhui.',
    'On gengzi, Anhui suffered locusts.',
  ],
  s0164: [
    'On day wushen, the Yunnan sale of real offices was opened.',
    'On wushen, Yunnan opened sale of substantive offices.',
  ],
  s0165: [
    'On day xinhai, because banditry disturbed Jiangsu, Anhui, Shandong, and Henan, Shen Baozhen and others were told to search and suppress in separate forces and disperse coerced followers.',
    'On xinhai, Shen Baozhen and others were told to suppress bandits in Jiangsu, Anhui, Shandong, and Henan and free the coerced.',
  ],
  s0166: [
    'On day dingsi, Grand Commander Kong Cai attacked Manas and beheaded the bandit chief Ma Deming and others.',
    'On dingsi, Kong Cai attacked Manas and killed Ma Deming.',
  ],
  s0167: [
    'This month, flood relief was given in Nanfeng, Nanchang, and Fujian.',
    'This month, Nanfeng, Nanchang, and Fujian received flood relief.',
  ],
  s0168: [
    'This summer, arrear taxes in Huai and Yang jurisdictions were remitted; arrear taxes in Shengjing before the sixth year of Tongzhi were remitted; salt-field levies at Changlu pans before the tenth year of Tongzhi were remitted; and arrear taxes in Zhili since the tenth year of Tongzhi were remitted.',
    'This summer brought broad tax remissions in Huai-Yang, Shengjing, Changlu, and Zhili.',
  ],
  s0169: [
    'Autumn, seventh month, day xinyou: the emperor offered honorific titles to both empress dowagers.',
    'Month 7, xinyou: the emperor offered honorific titles to both empress dowagers.',
  ],
  s0170: [
    'On day xinwei, the Huai salt market on the Chu bank was restored.',
    'On xinwei, the Huai salt Chu market was restored.',
  ],
  s0171: [
    'On day jiaxu, the Dongxiang bandit chief Yuan Tingjiao was executed.',
    'On jiaxu, Yuan Tingjiao was executed.',
  ],
  s0172: [
    'On day xinsi, Liu Changyou and Pan Dingxin recovered the cities of Tengyue; the bandit chief Su Kaixian was executed.',
    'On xinsi, Liu Changyou and Pan Dingxin retook Tengyue and executed Su Kaixian.',
  ],
  s0173: [
    'On day wuzi, the Margary case was settled and the penalties on officials involved were remitted.',
    'On wuzi, the Margary case closed and officials in it were pardoned.',
  ],
  s0174: [
    'Eighth month, day xinmao: Liu Jintang and Jin Shun defeated the Muslim chief Bai Yanhu, recovered Urumqi and Dihua, and soon retook Changji, Hutubi, Jinghua, and other cities.',
    'Month 8, xinmao: Liu Jintang and Jin Shun beat Bai Yanhu and recovered Urumqi, then Changji and other cities.',
  ],
  s0175: [
    'On day xinchou, Xu Ling\'s appointment was changed to envoy to Japan.',
    'On xinchou, Xu Ling became envoy to Japan.',
  ],
  s0176: [
    'On day dingwei, Zhejiang\'s flood victims were relieved.',
    'On dingwei, Zhejiang flood relief was ordered.',
  ],
  s0177: [
    'On day xinhai, Jiangxi\'s flood victims were relieved.',
    'On xinhai, Jiangxi flood relief was ordered.',
  ],
  s0178: [
    'Kong Cai and others recovered the north city of Manas.',
    'Kong Cai retook Manas\'s north city.',
  ],
  s0179: [
    'Ninth month, day wuwu, first day: one hundred ninety-five people of thirty-five families in one gate who died for the state in Shangyuan and Jiangning counties were honored, pensioned, and given memorial arches.',
    'Month 9, wuwu: 195 martyrs from 35 Shangyuan and Jiangning families were honored with arches.',
  ],
  s0180: [
    'On day renxu, additional porridge kitchens were set up in Shuntian.',
    'On renxu, Shuntian added famine porridge kitchens.',
  ],
  s0181: [
    'On day jisi, regulations for envoys to foreign states were fixed.',
    'On jisi, rules for foreign envoys were set.',
  ],
  s0182: [
    'Because civil and religious lawsuits were tangled in Sichuan districts, Kuiyu and others were told to judge impartially.',
    'Sichuan civil-religious suits led to an order for impartial judgment by Kuiyu and others.',
  ],
  s0183: [
    'On day renshen, Wen Yu and others were told to arrest strictly the heterodox bandit factions of Fujian, Jiangxi, Anhui, and other provinces.',
    'On renshen, Wen Yu and others were ordered to suppress sect bandits in several provinces.',
  ],
  s0184: [
    'Winter, tenth month, day bingwu: drought relief was given in northern Anhui.',
    'Month 10, bingwu: north Anhui received drought relief.',
  ],
  s0185: [
    'Jing Lian and Li Hongzao were ordered to serve at the Zongli Yamen.',
    'Jing Lian and Li Hongzao were assigned to the Zongli Yamen.',
  ],
  s0186: [
    'On day jiayin, Rongquan was summoned to the capital and Jin Shun was made Ili general.',
    'On jiayin, Rongquan came to Beijing and Jin Shun became Ili general.',
  ],
  s0187: [
    'On day dingsi, famine relief was given in Koubei, Shandong, Anhui, and northern Jiangsu.',
    'On dingsi, Koubei, Shandong, Anhui, and Jiangbei received famine relief.',
  ],
  s0188: [
    'Eleventh month, day dingmao: Jin Shun and Xi Lun took the south city of Manas; the bandit chiefs He Lu and Ma Youcai were executed.',
    'Month 11, dingmao: Jin Shun and Xi Lun took south Manas and executed He Lu and Ma Youcai.',
  ],
  s0189: [
    'On day renwu, because the northern route in Xinjiang was pacified, treasury funds were issued to reduce and send home Jin Shun\'s army.',
    'On renwu, northern Xinjiang\'s pacification brought funds to demobilize Jin Shun\'s troops.',
  ],
  s0190: [
    'On day jiashen, ten thousand shi of grain transport were cut and granary grain was drawn to support refugees kept in Suzhou and Changzhou.',
    'On jiashen, 10,000 shi of transport grain and granary stocks were used for Suzhou-Changzhou refugees.',
  ],
  s0191: [
    'Twelfth month, day wuzi: Reader-in-waiting He Ruzhang was appointed envoy to Japan.',
    'Month 12, wuzi: He Ruzhang became envoy to Japan.',
  ],
  s0192: [
    'On day jiachen, governors and governors-general were ordered to inspect districts strictly, not conceal disasters, and judge civil and mission cases impartially in every province.',
    'On jiachen, governors were told to expose disasters and judge mission cases fairly.',
  ],
  s0193: [
    'On day wushen, disaster relief was given on the Huai and sea coasts of northern Jiangsu.',
    'On wushen, Jiangbei\'s Huai-Hai coast received disaster relief.',
  ],
  s0194: [
    'On day jiyou, Muslim bandits raided Kolun; the Kolun assistant commissioner Baoying was sharply rebuked for slow dispatch of troops.',
    'On jiyou, Hui raiders hit Kolun and Baoying was rebuked for delay.',
  ],
  s0195: [
    'On day yimao, salt-field levies on unopened land in Hang, Jia, and Song pans were remitted.',
    'On yimao, unopened Hang-Jia-Song salt-field levies were remitted.',
  ],
  s0196: [
    'In the third year, dingchou, spring, first month, day dingsi, first day: congratulatory audiences were exempted.',
    'Year 3, spring 1, dingsi: congratulatory audiences were waived.',
  ],
  s0197: [
    'On day wuwu, Left Censor-in-chief Jing Lian was appointed Grand Councilor.',
    'On wuwu, Jing Lian became a Grand Councilor.',
  ],
  s0198: [
    'On day gengshen, the former Jilong Hutuktu of Tibet was ordered to manage Shang trade affairs before the Dalai Lama was reborn and was given the title "Dashan."',
    'On gengshen, Tibet\'s former Jilong Hutuktu was named Dashan and managed trade before the Dalai\'s rebirth.',
  ],
  s0199: [
    'On day guihai, Ying Gui was made Grand Secretary of the Hall of Embodied Benevolence and Zai Ling, Minister of Personnel, was made associate grand secretary.',
    'On guihai, Ying Gui became grand secretary and Zai Ling associate grand secretary.',
  ],
  s0200: [
    'On day bingyin, arrear rents on Hongze Lake shoals were remitted.',
    'On bingyin, Hongze Lake shoal arrear rents were remitted.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b02.mjs <translation.json>'
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
