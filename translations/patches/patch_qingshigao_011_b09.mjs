#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'On day xinyou, the tombs of Jin Taizu and Shizong in Fangshan County were repaired.',
    'On xinyou day, Jin Taizu and Shizong tombs at Fangshan were restored.',
  ],
  s0802: [
    'Third month, day wuchen: because disasters in eastern Zhejiang were severe, Yarhashan was instructed to increase relief and prevent displacement.',
    'In the third month, Yarhashan was told to step up Zhejiang east relief and stop flight from famine.',
  ],
  s0803: [
    'On day gengwu, the Emperor returned to the palace.',
    'On gengwu day, the Emperor returned to the palace.',
  ],
  s0804: [
    'On day renshen, Mo\'erhuan was made commander at Guihua City.',
    'On renshen day, Mo\'erhuan became Guihua City commander.',
  ],
  s0805: [
    'On day wuyin, Fujian governor Pan Sirong died; Chen Hongmou was transferred to be Fujian governor and Jiang Bing made Henan governor.',
    'On wuyin day, Pan Sirong died; Chen Hongmou took Fujian and Jiang Bing Henan.',
  ],
  s0806: [
    'Summer, fourth month, day jiawu: last year\'s flood quota taxes were remitted for twelve Shandong prefectures, counties, and garrisons including Qidong.',
    'In the fourth month, twelve Shandong units including Qidong were excused last year\'s flood taxes.',
  ],
  s0807: [
    'On day yisi, last year\'s flood quota taxes were remitted for twenty-three Zhili garrisons, prefectures, and counties including Wuqing.',
    'On yisi day, twenty-three Zhili units including Wuqing were excused last year\'s flood taxes.',
  ],
  s0808: [
    'On day gengxu, last year\'s flood quota taxes were remitted for seventy-three Zhejiang prefectures, counties, garrisons, and thirteen salt-fields including Daisong.',
    'On gengxu day, seventy-three Zhejiang units and thirteen salt-fields including Daisong were excused flood taxes.',
  ],
  s0809: [
    'On day dingsi, last year\'s flood quota taxes were remitted for four Zhili salt-fields including Yongli and Shanxi counties including Shanyin.',
    'On dingsi day, Yongli and other Zhili salt-fields and Shanyin and other Shanxi counties were excused flood taxes.',
  ],
  s0810: [
    'Fifth month, day xinwei: locusts in forty-three Zhili prefectures and counties including Dongguang and Wuqing.',
    'In the fifth month, locusts struck forty-three Zhili units including Dongguang and Wuqing.',
  ],
  s0811: [
    'On day gengchen, relief was given for flood in fourteen Henan counties including Xiangfu.',
    'On gengchen day, fourteen Henan counties including Xiangfu received flood relief.',
  ],
  s0812: [
    'On day jichou, relief was given for last year\'s flood in fourteen Gansu prefectures and counties including Didao.',
    'On jichou day, fourteen Gansu units including Didao were relieved for last year\'s flood.',
  ],
  s0813: [
    'Locusts in eight Shandong prefectures including Jinan; hopper larvae in twelve Jiangnan prefectures and counties including Shangyuan.',
    'Eight Shandong prefectures including Jinan had locusts; twelve Jiangnan units including Shangyuan had hopper larvae.',
  ],
  s0814: [
    'Sixth month, day jiawu: Niyas of the Dzungars came to surrender.',
    'In the sixth month, the Dzungar Niyas defected.',
  ],
  s0815: [
    'On day dingwei, the palace examination of Hanlin and Grand Secretariat officials was held; Wang Tingyu and two others were ranked first class, others promoted or demoted by grade.',
    'On dingwei day, Hanlin and related officials were examined; Wang Tingyu and two others took first rank.',
  ],
  s0816: [
    'Manchu officials transferred from ministries to Hanlin and related posts were examined; De\'ertai was ranked first class, others demoted for use with distinctions.',
    'Transferred Manchu officials were examined; De\'ertai ranked first, others demoted by grade.',
  ],
  s0817: [
    'On day bingchen, E Leshun was made Gansu governor.',
    'On bingchen day, E Leshun became Gansu governor.',
  ],
  s0818: [
    'Autumn, seventh month, day dingchou: the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
    'In the seventh month, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
  ],
  s0819: [
    'On day jimao, three-tenths of quota taxes were remitted for prefectures and counties passed along the route.',
    'On jimao day, three-tenths of route taxes were waived.',
  ],
  s0820: [
    'On day guiwei, the Emperor accompanied the Empress Dowager to halt at the Mountain Resort for Summer Retreat.',
    'On guiwei day, the court halted at the Summer Mountain Resort.',
  ],
  s0821: [
    'On day dinghai, relief was given for flood in Jiangsu counties including Tongshan.',
    'On dinghai day, Tongshan and other Jiangsu counties received flood relief.',
  ],
  s0822: [
    'Eighth month, day bingshen: Censor Cai Shitian and graduate Cao Yongzu of the Shuntian provincial examination inner curtain were executed for collusion in examination irregularities.',
    'In the eighth month, Cai Shitian and Cao Yongzu were executed for Shuntian examination bribery.',
  ],
  s0823: [
    'On day renyin, relief was given for typhoon in Fujian subprefectures and counties including Jinjiang.',
    'On renyin day, Jinjiang and other Fujian units received typhoon relief.',
  ],
  s0824: [
    'On day jiachen, the Emperor accompanied the Empress Dowager on a tour to mulan for the enclosure hunt.',
    'On jiachen day, the Empress Dowager toured mulan for the enclosure hunt.',
  ],
  s0825: [
    'On day bingwu, Huang Tinggui was ordered to investigate Shaanxi relief administration.',
    'On bingwu day, Huang Tinggui was sent to audit Shaanxi relief.',
  ],
  s0826: [
    'On day yimao, relief was given for drought in twenty-one Shaanxi prefectures and counties including Xianning.',
    'On yimao day, twenty-one Shaanxi units including Xianning received drought relief.',
  ],
  s0827: [
    'Ninth month, day xinyou: the Western Ocean country of Portugal sent tribute envoys.',
    'In the ninth month, Portugal sent tribute envoys.',
  ],
  s0828: [
    'The Zagegu native chieftain Cangwang rebelled in Sichuan; Yue Zhongqi was ordered to lead troops to suppress him.',
    'Zagegu chieftain Cangwang rebelled in Sichuan; Yue Zhongqi was ordered to suppress him.',
  ],
  s0829: [
    'On day gengwu, the tribute memorial brought by Sulu\'s native officials did not conform; Ka\'erjishan and others were instructed to send them home.',
    'On gengwu day, Sulu\'s irregular tribute memorial led Ka\'erjishan to send the envoys home.',
  ],
  s0830: [
    'On day jiaxu, Sichuan government troops took Zagegu brain and one hundred six native stockades surrendered.',
    'On jiaxu day, Sichuan troops took Zagegu brain and 106 stockades submitted.',
  ],
  s0831: [
    'Celeng and Yue Zhongqi were given preferential commendation.',
    'Celeng and Yue Zhongqi received preferential rewards.',
  ],
  s0832: [
    'On day wuyin, excessively heavy quota taxes were reduced for five Gansu counties including Zhangye.',
    'On wuyin day, Zhangye and four other Gansu counties had heavy taxes reduced.',
  ],
  s0833: [
    'Relief was given to famine victims in disaster-stricken Henan.',
    'Henan disaster victims received famine relief.',
  ],
  s0834: [
    'On day jimao, the Emperor accompanied the Empress Dowager back to the capital.',
    'On jimao day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0835: [
    'On day gengchen, Associate Grand Secretary and Minister of Personnel Liang Shizheng asked to retire to care for a parent until death; this was granted.',
    'On gengchen day, Liang Shizheng was allowed to retire for parental mourning.',
  ],
  s0836: [
    'Sun Jiagan was made Minister of Personnel and Associate Grand Secretary; Wang Youdun Minister of Works.',
    'Sun Jiagan became Minister of Personnel and associate grand secretary; Wang Youdun Minister of Works.',
  ],
  s0837: [
    'On day xinsi, the Dzungar lamas Genden Linqin and others came to surrender.',
    'On xinsi day, Dzungar lamas including Genden Linqin defected.',
  ],
  s0838: [
    'On day dinghai, Yin Jishan was summoned to the capital and Zhuang Yougong was ordered to act as Liangjiang governor-general.',
    'On dinghai day, Yin Jishan was recalled and Zhuang Yougong acted as Liangjiang governor-general.',
  ],
  s0839: [
    'Cangwang was executed after surrender.',
    'Cangwang was put to death.',
  ],
  s0840: [
    'Winter, tenth month, new moon on day wuzi: Qin Dashi and one hundred forty-one others were granted jinshi and other degrees with distinctions.',
    'On the tenth-month new moon, Qin Dashi and 141 others received jinshi degrees with graded ranks.',
  ],
  s0841: [
    'E Chang was summoned to the capital; E Rong\'an was ordered to act as Jiangxi governor and Yang Yingyu as Shandong governor.',
    'E Chang was recalled; E Rong\'an acted as Jiangxi governor and Yang Yingyu as Shandong governor.',
  ],
  s0842: [
    'On day renyin, Asiha memorialized that gentry and commoners of Pingyang had donated relief silver for disaster.',
    'On renyin day, Asiha reported Pingyang gentry and commoners had donated disaster relief silver.',
  ],
  s0843: [
    'An edict said the Emperor could not bear to have wealthy men in disaster areas pay out; orders were issued to return the donations.',
    'The Emperor refused disaster-area donations from the wealthy and ordered them returned.',
  ],
  s0844: [
    'Ding Chang was transferred to be Shanxi governor and Li Xitai made Guangxi governor.',
    'Ding Chang became Shanxi governor; Li Xitai Guangxi governor.',
  ],
  s0845: [
    'On day jiyou, the Emperor went to the Eastern Tombs and also saw Empress Xiaoxian placed in the underground palace.',
    'On jiyou day, the Emperor visited the Eastern Tombs and interred Empress Xiaoxian.',
  ],
  s0846: [
    'On day renzi, the Emperor paid respects at Zhaoxi Tomb, Xiaoling, Xiaodong Tomb, and Jingling.',
    'On renzi day, the Emperor visited Zhaoxi, Xiaoling, Xiaodong, and Jing tombs.',
  ],
  s0847: [
    'On day dingsi, drought relief was given for nineteen Jiangsu prefectures and counties including Shangyuan, ten Shanxi prefectures and counties including Linjin, and twenty-five Hubei prefectures, counties, and garrisons including Zhongxiang.',
    'On dingsi day, drought relief reached Jiangsu, Shanxi, and Hubei units including Shangyuan, Linjin, and Zhongxiang.',
  ],
  s0848: [
    'Sichuan Zagegu and upper and lower stockades of the Black Water rear Tibetans came to surrender.',
    'Zagegu and Black Water rear Tibetan stockades in Sichuan submitted.',
  ],
  s0849: [
    'Eleventh month, day gengshen: the Emperor returned to the capital.',
    'In the eleventh month, the Emperor returned to Beijing.',
  ],
  s0850: [
    'On day jiazi, Minister of Justice Liu Tongxun was ordered to serve at the Grand Council.',
    'On jiazi day, Liu Tongxun joined the Grand Council.',
  ],
  s0851: [
    'On day wuchen, drought relief was given for five Shanxi prefectures and counties including Wenxi.',
    'On wuchen day, five Shanxi units including Wenxi received drought relief.',
  ],
  s0852: [
    'On day gengchen, E Rong\'an was made Jiangxi governor.',
    'On gengchen day, E Rong\'an became Jiangxi governor.',
  ],
  s0853: [
    'Twelfth month, day wuzi: relief was given for flood and hail in twenty-one Gansu garrisons, prefectures, and counties including Gaolan.',
    'In the twelfth month, twenty-one Gansu units including Gaolan were relieved for flood and hail.',
  ],
  s0854: [
    'On day jichou, walls of nine Shaanxi counties including Yongshou were repaired, relief being given through labor.',
    'On jichou day, nine Shaanxi county walls including Yongshou were rebuilt as work relief.',
  ],
  s0855: [
    'Relief was given for flood in Henan\'s Wuzhi County.',
    'Wuzhi County in Henan received flood relief.',
  ],
  s0856: [
    'Heilongjiang general Fu\'erdan died; Zhuo\'erduo replaced him.',
    'Fu\'erdan died as Heilongjiang general; Zhuo\'erduo succeeded him.',
  ],
  s0857: [
    'On day yisi, Censor Shucheng asked to release persons convicted in the circulated forged memorial case, contrary to the imperial will; he was stripped of office.',
    'On yisi day, Censor Shucheng was dismissed for asking to free forged-memorial convicts.',
  ],
  s0858: [
    'An edict instructed Chen Hongmou not to pursue and arrest Catholic believers.',
    'Chen Hongmou was told not to hunt Catholic believers.',
  ],
  s0859: [
    'Eighteenth year, spring, first month, day wuwu: drought relief was given for thirty-seven Shaanxi prefectures and counties including Yaozhou and eleven Shanxi prefectures and counties including Yongji.',
    'In spring of year 18, thirty-seven Shaanxi and eleven Shanxi units including Yaozhou and Yongji received drought relief.',
  ],
  s0860: [
    'On day bingyin, bandits Mo Xinfeng and others of Guangdong\'s Dongguan County and Cai Rongzu and others of Fujian\'s Pinghe County rebelled and were captured and punished.',
    'On bingyin day, Dongguan and Pinghe bandits were captured and punished.',
  ],
  s0861: [
    'On day wuyin, Huang Tinggui was transferred to act as Sichuan governor-general, Yin Jishan to act as Shaanxi-Gansu governor-general, E Rong\'an also to act as Liangjiang governor-general, and Ban Di to act as Liang-Guang governor-general.',
    'On wuyin day, Huang Tinggui acted for Sichuan, Yin Jishan for Shaanxi-Gansu, E Rong\'an also for Liangjiang, and Ban Di for Liang-Guang.',
  ],
  s0862: [
    'On day xinsi, E Chang and others were stripped of office and arrested for trial.',
    'On xinsi day, E Chang and others were dismissed and arrested.',
  ],
  s0863: [
    'On day yiyou, long-overdue taxes were remitted for thirty-one Shandong prefectures, counties, and garrisons including Zhangqiu.',
    'On yiyou day, thirty-one Shandong units including Zhangqiu were excused long arrears.',
  ],
  s0864: [
    'Second month, new moon on day dinghai: because Yue Zhongqi asked to use troops against Guoluo Ke, Huang Tinggui was instructed to deliberate and memorialize.',
    'On the second-month new moon, Huang Tinggui was told to report on Yue Zhongqi\'s request for troops against Guoluo Ke.',
  ],
  s0865: [
    'On day bingshen, the Emperor paid respects at Tailing.',
    'On bingshen day, the Emperor visited Tailing.',
  ],
  s0866: [
    'On day dingyou, the Emperor sacrificed at the tombs of Jin Taizu and Shizong.',
    'On dingyou day, the Emperor sacrificed at Jin Taizu and Shizong tombs.',
  ],
  s0867: [
    'Jiangnan company commander Lu Lusheng was dismembered in the marketplace for forging Sun Jiagan\'s memorial.',
    'Lu Lusheng was dismembered for forging Sun Jiagan\'s memorial.',
  ],
  s0868: [
    'On day jihai, the Empress Dowager set out from Shenyang Spring Garden to Zhuozhou; the Emperor went to the traveling palace to inquire after her health.',
    'On jihai day, the Empress Dowager left Shenyang Spring Garden for Zhuozhou and the Emperor paid his respects at her traveling palace.',
  ],
  s0869: [
    'On day renyin, the Emperor accompanied the Empress Dowager by boat to Lianhua Marsh to review the water enclosure hunt.',
    'On renyin day, the court reviewed the water hunt at Lianhua Marsh by boat.',
  ],
  s0870: [
    'On day bingwu, sixteen years of flood quota taxes were remitted for five Henan counties including Xiayi.',
    'On bingwu day, five Henan counties including Xiayi were excused sixteen years of flood taxes.',
  ],
  s0871: [
    'On day dingwei, Zhao Hui was ordered to go to Tibet on affairs.',
    'On dingwei day, Zhao Hui was sent to Tibet on business.',
  ],
  s0872: [
    'On day wushen, the Emperor inspected Yongding River works.',
    'On wushen day, the Emperor inspected Yongding River projects.',
  ],
  s0873: [
    'On day gengxu, the Emperor went to the Southern Park for an enclosure hunt.',
    'On gengxu day, the Emperor hunted at the Southern Park.',
  ],
  s0874: [
    'On day xinhai, seventeen years of flood quota taxes were remitted for ten Jiangsu prefectures and counties including Shangyuan.',
    'On xinhai day, ten Jiangsu units including Shangyuan were excused seventeen years of flood taxes.',
  ],
  s0875: [
    'Third month, day guihai: because Yarhashan had not thoroughly examined the forged memorial case, the ministry was ordered to deliberate severely on him.',
    'In the third month, Yarhashan faced severe ministry review for a lax forged-memorial inquiry.',
  ],
  s0876: [
    'On day wuyin, relief was given to famine victims of last year\'s drought in eleven Anhui prefectures, counties, and garrisons including Shouzhou.',
    'On wuyin day, eleven Anhui units including Shouzhou were relieved for last year\'s drought famine.',
  ],
  s0877: [
    'On day jimao, Kaitai was ordered to act as Huguang governor-general and Ding Chang to act as Guizhou governor.',
    'On jimao day, Kaitai acted as Huguang governor-general and Ding Chang as Guizhou governor.',
  ],
  s0878: [
    'On day xinsi, relief was given for last year\'s drought in nineteen Hubei prefectures, counties, and garrisons.',
    'On xinsi day, nineteen Hubei units were relieved for last year\'s drought.',
  ],
  s0879: [
    'Summer, fourth month, day dinghai: Qian Chenqun remonstrated on the forged memorial investigation; the Emperor rebuked him for seeking reputation, ordered that no copies be kept, and warned him that "your posterity will not keep their heads."',
    'In the fourth month, Qian Chenqun was rebuked for remonstrating on the forged memorial and warned that his descendants would lose their heads.',
  ],
  s0880: [
    'On day jichou, the Western Ocean country of Portugal sent envoys with tribute goods; an edict of favor answered them.',
    'On jichou day, Portugal sent tribute and received a gracious reply.',
  ],
  s0881: [
    'Hengwen was ordered to act as Huguang governor-general.',
    'Hengwen acted as Huguang governor-general.',
  ],
  s0882: [
    'On day jiawu, a banquet was granted to the Portuguese tribute envoys.',
    'On jiawu day, the Portuguese envoys were banqueted.',
  ],
  s0883: [
    'On day yiwei, quota taxes for the sixteenth and seventeenth years\' earthquake and flood damage in Yunnan\'s Jianchuan Prefecture were remitted with distinctions and relief was also given.',
    'On yiwei day, Jianchuan was excused earthquake and flood taxes and relieved.',
  ],
  s0884: [
    'On day xinchou, an imperial letter and extra silks and treasures were granted to the king of Portugal.',
    'On xinchou day, Portugal\'s king received an imperial letter and added gifts.',
  ],
  s0885: [
    'On day bingwu, because of drought the Ministry of Justice was ordered to clear ordinary prisons and reduce sentences below exile; Zhili was likewise instructed.',
    'On bingwu day, drought led to prison clearing and sentence reductions in the ministry and Zhili.',
  ],
  s0886: [
    'On day dingwei, the Emperor went to Black Dragon Pool to pray for rain.',
    'On dingwei day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0887: [
    'On day renzi, Yongchang and Nusan were sent to Anxi and given the seals of imperial commissioners.',
    'On renzi day, Yongchang and Nusan went to Anxi as imperial commissioners.',
  ],
  s0888: [
    'Fifth month, day guihai: sentences deferred three or more times in autumn and court review were reduced.',
    'In the fifth month, thrice-deferred autumn and court sentences were reduced.',
  ],
  s0889: [
    'On day dingmao, hopper larvae in Shandong prefectures and counties including Jining and Wen.',
    'On dingmao day, Jining, Wen, and other Shandong units had hopper larvae.',
  ],
  s0890: [
    'Last year\'s flood quota taxes were remitted for three Guangdong counties including Fengshun.',
    'Fengshun and two other Guangdong counties were excused last year\'s flood taxes.',
  ],
  s0891: [
    'On day xinwei, last year\'s flood quota taxes were remitted for six Zhejiang counties including Renhe and Renhe salt-field, and relief was also given.',
    'On xinwei day, six Zhejiang counties and Renhe salt-field were excused flood taxes and relieved.',
  ],
  s0892: [
    'On day xinwei, Dzungar taiji Lama Darja was captured while fighting Dawachi, who made himself taiji.',
    'Also on xinwei day, Lama Darja fell to Dawachi, who seized the Dzungar taiji title.',
  ],
  s0893: [
    'Sixth month, day guisi: Celeng was ordered to act as Minister of War.',
    'In the sixth month, Celeng acted as Minister of War.',
  ],
  s0894: [
    'On day yiwei, Ding Wenbin of Zhejiang\'s Shangyu was dismembered after the Duke of Yansheng Kong Zhaohuan exposed his treasonous writings, which proved true upon trial.',
    'On yiwei day, Ding Wenbin was dismembered after Kong Zhaohuan exposed his treasonous books.',
  ],
  s0895: [
    'On day bingshen, locusts in Tianjin and other prefectures and counties.',
    'On bingshen day, locusts struck Tianjin and other units.',
  ],
  s0896: [
    'Autumn, seventh month, day jiazi: locusts in thirty-two Shuntian prefectures, counties, and garrisons including Wanping.',
    'In the seventh month, locusts hit thirty-two Shuntian units including Wanping.',
  ],
  s0897: [
    'On day renshen, two flood gates on Jiangnan\'s Shaobo Lake and the Cheyu dam at Gaoyou burst at once; Celeng, Liu Tongxun, and Gao Bin were ordered jointly to investigate the flood damage.',
    'On renshen day, Shaobo Lake gates and Gaoyou\'s Cheyu dam burst; Celeng, Liu Tongxun, and Gao Bin investigated the floods.',
  ],
  s0898: [
    'Relief was given for flood in Anhui counties including She and Taihu.',
    'She, Taihu, and other Anhui counties received flood relief.',
  ],
  s0899: [
    'On day gengchen, Zhuang Yougong was ordered to relieve flood in Gaoyou and Baoying.',
    'On gengchen day, Zhuang Yougong relieved Gaoyou and Baoying floods.',
  ],
  s0900: [
    'On day renwu, concurrent titles of touring circuits as provincial administration vice commissioners and surveillance vice commissioners across provinces were suspended, as was promotion use as vice director of the Court of State Ceremonial.',
    'On renwu day, provincial circuit concurrent ranks and promotion to Court of State Ceremonial vice director were halted.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b09.mjs <translation.json>'
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
