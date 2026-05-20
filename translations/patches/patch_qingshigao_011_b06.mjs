#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day jihai, the Jiangxi governor was given the concurrent rank of Grand Coordinator.',
    'On jihai day, the Jiangxi governor received the Grand Coordinator title.',
  ],
  s0502: [
    'On day gengzi, Namin was summoned to the capital and Wei Zhezhi was made Anhui governor.',
    'On gengzi day, Namin was called to Beijing and Wei Zhezhi became Anhui governor.',
  ],
  s0503: [
    'On day yisi, relief was given for disaster in three counties including Taiwan in Fujian.',
    'On yisi day, Fujian disaster relief reached three counties including Taiwan.',
  ],
  s0504: [
    'Quota land tax for Xinning in Hunan stricken by flood the previous year was remitted.',
    'Prior-year flood tax was remitted in Hunan Xinning.',
  ],
  s0505: [
    'Fifth month, day yimao: quota land tax for thirteen guards, prefectures, and counties including Gaolan in Gansu stricken by drought was remitted.',
    'In the fifth month, drought tax relief was granted in thirteen Gansu districts including Gaolan.',
  ],
  s0506: [
    'On day bingchen, quota land tax for thirteen prefectures, counties, and guards including Fuyang in Anhui stricken by drought the previous year was remitted.',
    'On bingchen day, prior-year drought tax was remitted in thirteen Anhui districts including Fuyang.',
  ],
  s0507: [
    'On day xinyou, the Emperor went to Black Dragon Pool to pray for rain.',
    'On xinyou day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0508: [
    'Sixth month, day bingshen: relief was given for drought disaster in prefectures and counties including Weiyuan in Gansu.',
    'In the sixth month, drought relief reached Gansu districts including Weiyuan.',
  ],
  s0509: [
    'On day jihai, Hu Zhongzao, Guangxi education commissioner, was resentful after being cut from staff; he was ordered to Beijing to await reassignment, and the ministry was still ordered to deliberate severely.',
    'On jihai day, Hu Zhongzao was recalled to Beijing for severe review after resenting his staff reduction.',
  ],
  s0510: [
    'Autumn, seventh month, day wushen: relief was given for flood disaster in two counties including Guangze in Fujian.',
    'In the seventh month, flood relief reached two Fujian counties including Guangze.',
  ],
  s0511: [
    'On day gengxu, quota land tax for six prefectures and counties including Hanchuan in Hubei stricken by flood the previous year was remitted.',
    'On gengxu day, prior-year flood tax was remitted in six Hubei districts including Hanchuan.',
  ],
  s0512: [
    'On day xinhai, Zhili Governor-General Nasutu died.',
    'On xinhai day, Zhili Governor-General Nasutu died.',
  ],
  s0513: [
    'Quota land tax for nine counties including Jinjiang in Fujian stricken by tidal disaster was remitted.',
    'Tidal-disaster tax relief was granted in nine Fujian counties including Jinjiang.',
  ],
  s0514: [
    'On day renzi, Fang Guancheng was made Zhili governor-general, Chen Dashou acted for him, and Yonggui acted as Shandong governor.',
    'On renzi day, Fang Guancheng became Zhili governor-general; Chen Dashou and Yonggui received acting posts.',
  ],
  s0515: [
    'Laibao was ordered to take charge concurrently of the Boards of Personnel and Revenue; A Kedun was made acting commandant of the Metropolitan Banner Garrison.',
    'Laibao took concurrent charge of Personnel and Revenue; A Kedun became acting banner garrison commandant.',
  ],
  s0516: [
    'On day gengshen, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On gengshen day, the court halted at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0517: [
    'On day xinyou, Fu Heng and Chen Dashou were ordered to translate barbarian books of Western Ocean countries and the like.',
    'On xinyou day, Fu Heng and Chen Dashou were ordered to translate Western books.',
  ],
  s0518: [
    'On day dingmao, the Emperor, accompanying the Empress Dowager, went to the Mulan hunting park.',
    'On dingmao day, the Emperor accompanied the Empress Dowager to the Mulan hunt.',
  ],
  s0519: [
    'On day yihai, a supplemental remission was granted for quota land tax in six prefectures and counties including Yongji in Shanxi stricken by disaster.',
    'On yihai day, supplemental disaster tax relief was granted in six Shanxi districts including Yongji.',
  ],
  s0520: [
    'Eighth month, day gengchen: the Emperor went on the hunt enclosure at Bayan Gou; Mongol princes and others presented banquet offerings.',
    'In the eighth month, the Emperor hunted at Bayan Gou and received banquets from Mongol princes.',
  ],
  s0521: [
    'On day renwu, relief was given for flood disaster in two counties including Luotian in Hubei.',
    'On renwu day, flood relief reached two Hubei counties including Luotian.',
  ],
  s0522: [
    'On day guimao, relief was given for flood disaster in seven counties including Yanjin in Henan.',
    'On guimao day, flood relief reached seven Henan counties including Yanjin.',
  ],
  s0523: [
    'On day jiachen, relief was given for flood disaster in thirteen prefectures and counties including Qianjiang in Hubei.',
    'On jiachen day, flood relief reached thirteen Hubei districts including Qianjiang.',
  ],
  s0524: [
    'Ninth month, day yimao: the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'In the ninth month, the court returned to Beijing with the Empress Dowager.',
  ],
  s0525: [
    'On day yichou, E Rong\'an was appointed Henan governor.',
    'On yichou day, E Rong\'an became Henan governor.',
  ],
  s0526: [
    'On day bingyin, Dondup chieftain Bandi submitted.',
    'On bingyin day, Dondup chieftain Bandi surrendered.',
  ],
  s0527: [
    'Qing Fu was permitted to take his own life.',
    'Qing Fu was allowed to commit suicide.',
  ],
  s0528: [
    'Winter, tenth month, day jiawu: relief was given for flood disaster in twenty-two prefectures, counties, and guards including Qiantang in Zhejiang and eighteen salt-fields including Baolang.',
    'In the tenth month, flood relief reached twenty-two Zhejiang districts and eighteen salt-fields.',
  ],
  s0529: [
    'Fu Qing was granted the rank of commandant and stationed in Tibet with Ji Shan, holding the seal of the Imperial Commissioner.',
    'Fu Qing received commandant rank and shared Tibet duty with Ji Shan under the commissioner seal.',
  ],
  s0530: [
    'On day dingyou, Bashiwu was summoned to the capital and Zhuotai was made commandant at Guihua City.',
    'On dingyou day, Bashiwu was recalled and Zhuotai became Guihua City commandant.',
  ],
  s0531: [
    'On day wuxu, Sichuan was ordered to rigorously pursue Gulo bandits.',
    'On wuxu day, Sichuan was ordered to suppress Gulo bandits rigorously.',
  ],
  s0532: [
    'Because Zhu\'ermute Namuzhale was licentious, Celeng, Yue Zhongqi, Fu Qing, and Ji Shan were instructed to guard against him.',
    'Zhu\'ermute Namuzhale\'s misconduct prompted orders to Celeng, Yue Zhongqi, Fu Qing, and Ji Shan to take precautions.',
  ],
  s0533: [
    'Wangbu Duo\'erji, son of Khalkha taiji E Linqin, captured Eleuth fugitives; the Emperor praised and rewarded him.',
    'The Emperor rewarded Wangbu Duo\'erji for capturing Eleuth fugitives.',
  ],
  s0534: [
    'Grain transport tax for twenty-three prefectures and counties including Funing in Jiangsu was remitted in graded amounts.',
    'Graded remissions of grain transport tax were granted in twenty-three Jiangsu districts including Funing.',
  ],
  s0535: [
    'On day jihai, quota land tax for eighteen prefectures, counties, and guards including Jizhou in Zhili stricken by flood was remitted, and relief was also given.',
    'On jihai day, Zhili flood tax was remitted and relief granted in eighteen districts including Jizhou.',
  ],
  s0536: [
    'On day jiachen, former Left Vice Censor-in-chief Sun Jiagan was summoned to the capital.',
    'On jiachen day, former Vice Censor Sun Jiagan was called to Beijing.',
  ],
  s0537: [
    'Eleventh month, day dingwei: Liang Shizheng was ordered to take charge concurrently of the Board of Personnel.',
    'In the eleventh month, Liang Shizheng received concurrent charge of Personnel.',
  ],
  s0538: [
    'On day guihai, Minister of Punishments Wang Youdun was made acting Assistant Grand Secretary.',
    'On guihai day, Wang Youdun became acting Assistant Grand Secretary.',
  ],
  s0539: [
    'On day wuchen, Grand Secretary Zhang Tingyu asked to retire; this was granted.',
    'On wuchen day, Zhang Tingyu\'s retirement request was approved.',
  ],
  s0540: [
    'On day gengchen, Liu Tongxun was made Minister of Works.',
    'On gengchen day, Liu Tongxun became Minister of Works.',
  ],
  s0541: [
    'On day xinsi, Peng Weixin was recalled to serve as Left Censor-in-chief.',
    'On xinsi day, Peng Weixin was recalled as Left Censor-in-chief.',
  ],
  s0542: [
    'On day guiwei, a poem was bestowed on Zhang Tingyu reaffirming the order for him to share in offerings.',
    'On guiwei day, the Emperor bestowed a poem on Zhang Tingyu reaffirming his offering privilege.',
  ],
  s0543: [
    'On day dinghai, Wang Youdun was removed as Assistant Grand Secretary for leaking an edict, but retained his ministry post.',
    'On dinghai day, Wang Youdun lost his assistant grand secretary post for leaking an edict.',
  ],
  s0544: [
    'Liang Shizheng was made Assistant Grand Secretary.',
    'Liang Shizheng became Assistant Grand Secretary.',
  ],
  s0545: [
    'On day xinmao, retired Grand Secretary Zhang Tingyu was stripped of the Xuanqin earldom, permitted to retire with his original grand secretary rank, and still allowed to share in offerings at the Imperial Ancestral Temple.',
    'On xinmao day, Zhang Tingyu lost his earldom but kept grand secretary retirement rank and ancestral temple offering rights.',
  ],
  s0546: [
    'Hadaha was transferred to Minister of Works, Suhede to Minister of War, and Haiwang to Minister of Revenue.',
    'Hadaha, Suhede, and Haiwang were reassigned as works, war, and revenue ministers.',
  ],
  s0547: [
    'Muhelan was made Minister of Rites, Xinzhu Jilin general, and Yongxing Huguang governor-general.',
    'Muhelan, Xinzhu, and Yongxing received rites, Jilin, and Huguang posts.',
  ],
  s0548: [
    'On day yiwei, Wei Zhezhi was summoned to the capital; Tuerbing\'a was moved to Anhui governor and Yue Jun to Yunnan governor.',
    'On yiwei day, Wei Zhezhi was recalled; Tuerbing\'a and Yue Jun became Anhui and Yunnan governors.',
  ],
  s0549: [
    'Suchang was made Guangdong governor.',
    'Suchang became Guangdong governor.',
  ],
  s0550: [
    'Fifteenth year, spring, first month, day bingwu: outstanding surcharges in Zhili, Shanxi, Henan, and Zhejiang were remitted.',
    'In the fifteenth year\'s first month, outstanding surcharges were forgiven in four provinces.',
  ],
  s0551: [
    'Six-tenths of surcharges in Jiangsu, Anhui, and Shandong were remitted.',
    'Six-tenths of surcharges were remitted in Jiangsu, Anhui, and Shandong.',
  ],
  s0552: [
    'On day dingwei, Zhang Yunsui was made Eastern Lodge Grand Secretary, Shuose Yunnan-Guizhou governor-general, Chen Dashou Liangguang governor-general, Liang Shizheng Minister of Personnel, and Li Yuanliang Minister of War.',
    'On dingwei day, Zhang Yunsui, Shuose, Chen Dashou, Liang Shizheng, and Li Yuanliang received major appointments.',
  ],
  s0553: [
    'On day jiayin, the Emperor visited the Ziguang Pavilion on Yingtai and granted a banquet to Dzungar envoy Nima.',
    'On jiayin day, the Emperor banqueted Dzungar envoy Nima at Ziguang Pavilion.',
  ],
  s0554: [
    'On day yimao, Ji Shan was summoned to the capital and Labudun was ordered to handle Tibetan affairs jointly with Fu Qing.',
    'On yimao day, Ji Shan was recalled and Labudun joined Fu Qing in Tibet.',
  ],
  s0555: [
    'On day renxu, Vice Minister of Works Liu Lun was ordered to serve in the Grand Council.',
    'On renxu day, Liu Lun entered Grand Council duty.',
  ],
  s0556: [
    'Li Zhicui was executed; death by decapitation was proposed for Wang Shitai and Luo Yuchao.',
    'Li Zhicui was executed; Wang Shitai and Luo Yuchao faced proposed decapitation.',
  ],
  s0557: [
    'Second month, day yihai: the Emperor, accompanying the Empress Dowager, toured west to Wutai and remitted one-third of quota land tax in districts passed through.',
    'In the second month, the court toured Wutai with the Empress Dowager and cut passing districts\' tax by one-third.',
  ],
  s0558: [
    'On day gengchen, Korea presented tribute.',
    'On gengchen day, Korea sent tribute.',
  ],
  s0559: [
    'On day bingxu, the Emperor, accompanying the Empress Dowager, halted at Pusa Peak on Wutai Mountain.',
    'On bingxu day, the court halted at Wutai\'s Pusa Peak.',
  ],
  s0560: [
    'On day jichou, Celeng, Khalkha Chaoyong Prince and Left Assistant Frontier General, died; Prince Luobuzang was made acting Left Assistant Frontier General.',
    'On jichou day, Celeng died; Prince Luobuzang became acting frontier general.',
  ],
  s0561: [
    'On day dingyou, a further three-tenths of quota land tax for two counties including Puxian in Shanxi stricken by disaster the previous year was remitted.',
    'On dingyou day, a further third of prior-year disaster tax was remitted in two Shanxi counties.',
  ],
  s0562: [
    'On day wuxu, the Emperor halted at Zhaobeikou for the hunting enclosure.',
    'On wuxu day, the Emperor halted at Zhaobeikou for the hunt.',
  ],
  s0563: [
    'On day xinchou, surviving books of classical learning were sought out.',
    'On xinchou day, the court sought surviving classical texts.',
  ],
  s0564: [
    'On day guimao, the Emperor inspected Yongding River embankment works.',
    'On guimao day, the Emperor inspected Yongding River dikes.',
  ],
  s0565: [
    'Third month, day bingwu: Zhang Yunsui was advanced to Grand Guardian of the Heir Apparent; Jiang Pu, Fang Guancheng, and Huang Tinggui to Junior Guardian.',
    'In the third month, Zhang Yunsui became Grand Guardian; Jiang Pu, Fang Guancheng, and Huang Tinggui Junior Guardians.',
  ],
  s0566: [
    'A further three-tenths of quota land tax for seventeen prefectures and counties including Jizhou in Zhili was remitted.',
    'A further third of quota tax was remitted in seventeen Zhili districts including Jizhou.',
  ],
  s0567: [
    'On day jiyou, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On jiyou day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0568: [
    'On day jiayin, on the second anniversary of Empress Xiaoxian, the Emperor went to Jing\'anzhuang to offer sacrifice.',
    'On jiayin day, the Emperor mourned Empress Xiaoxian at Jing\'anzhuang.',
  ],
  s0569: [
    'On day yimao, retired Grand Secretary Zhang Tingyu returned home with exceptional favors; a minister of scattered rank was ordered to lead ten guardsmen to escort him.',
    'On yimao day, Zhang Tingyu went home with honors and a guarded escort.',
  ],
  s0570: [
    'On day wuwu, quota land tax for thirty prefectures and counties including Guichi in Anhui stricken by the fourteenth year\'s flood was remitted, and relief was also given.',
    'On wuwu day, fourteenth-year flood tax was remitted and relief granted in thirty Anhui districts.',
  ],
  s0571: [
    'On day yichou, quota land tax for four prefectures and counties including Qianjiang in Hubei stricken by the fourteenth year\'s flood was remitted.',
    'On yichou day, fourteenth-year flood tax was remitted in four Hubei districts.',
  ],
  s0572: [
    'On day gengwu, quota land tax for twenty-seven prefectures, counties, and guards including Zouping in Shandong stricken by the fourteenth year\'s flood was remitted.',
    'On gengwu day, fourteenth-year flood tax was remitted in twenty-seven Shandong districts.',
  ],
  s0573: [
    'Summer, fourth month, day bingzi: the powder magazine in Yunnan provincial capital suffered disaster.',
    'In the fourth month, Yunnan\'s powder magazine exploded.',
  ],
  s0574: [
    'On day renchen, A Gui was recalled to serve in the Board of Personnel as an outside attendant.',
    'On renchen day, A Gui was recalled to Personnel duty.',
  ],
  s0575: [
    'On day yiwei, retired Grand Secretary Zhang Tingyu was deprived of sharing in offerings.',
    'On yiwei day, Zhang Tingyu lost his ancestral temple offering privilege.',
  ],
  s0576: [
    'Quota land tax for thirty prefectures, counties, and guards including Guichi in Anhui stricken by the fourteenth year\'s flood was remitted.',
    'Fourteenth-year flood tax was remitted in thirty Anhui districts including Guichi.',
  ],
  s0577: [
    'On day wuxu, Labudun was summoned to the capital; Bandi was ordered to garrison Tibet and Ji Shan Qinghai.',
    'On wuxu day, Labudun was recalled; Bandi went to Tibet and Ji Shan to Qinghai.',
  ],
  s0578: [
    'Fifth month, day gengxu: the Emperor went to Black Dragon Pool to pray for rain.',
    'In the fifth month, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0579: [
    'On day xinhai, the Ministry of Punishments was ordered to clear routine prisons and reduce punishments below exile; Zhili was likewise ordered.',
    'On xinhai day, routine prisons were cleared and lesser sentences reduced in the empire and Zhili.',
  ],
  s0580: [
    'On day guichou, the Nine Ministers, censors, and surveillance officials were instructed to speak frankly on shortcomings.',
    'On guichou day, high officials were told to report faults frankly.',
  ],
  s0581: [
    'On day jiayin, Xinzhu was summoned to the capital; Zhuotai was made Jilin general and Zhongfobao commandant at Guihua City.',
    'On jiayin day, Xinzhu was recalled; Zhuotai and Zhongfobao received frontier commands.',
  ],
  s0582: [
    'On day gengwu, the Emperor went to Black Dragon Pool to pray for rain.',
    'On gengwu day, the Emperor again prayed for rain at Black Dragon Pool.',
  ],
  s0583: [
    'Sixth month, day bingzi: Khalkha Prince Chengun Zhabu was made Left Assistant Frontier General.',
    'In the sixth month, Khalkha Prince Chengun Zhabu became Left Assistant Frontier General.',
  ],
  s0584: [
    'On day bingshen, relief was given for flood disaster in Leting in Zhili.',
    'On bingshen day, flood relief was granted in Zhili Leting.',
  ],
  s0585: [
    'Baode was made Assistant Commander of the Northern Route Army Camp.',
    'Baode became Northern Route camp assistant commander.',
  ],
  s0586: [
    'Autumn, seventh month, day bingwu: Guangdong Governor Yue Jun was stripped of office.',
    'In the seventh month, Guangdong Governor Yue Jun was dismissed.',
  ],
  s0587: [
    'Tuerbing\'a and Wei Zhezhi were ordered to remain in their Yunnan and Anhui governorships.',
    'Tuerbing\'a and Wei Zhezhi kept their Yunnan and Anhui posts.',
  ],
  s0588: [
    'On day jiyou, Liu Tongxun was ordered to go to Guangdong to investigate abuses in converting rice and collecting granary stores.',
    'On jiyou day, Liu Tongxun was sent to Guangdong to probe granary abuses.',
  ],
  s0589: [
    'On day gengshen, Wang Youdun was demoted to Vice Minister of War.',
    'On gengshen day, Wang Youdun was demoted to war vice minister.',
  ],
  s0590: [
    'Liu Tongxun was made Minister of War and Sun Jiagan Minister of Works.',
    'Liu Tongxun became War Minister and Sun Jiagan Works Minister.',
  ],
  s0591: [
    'On day yichou, Burma presented tribute.',
    'On yichou day, Burma sent tribute.',
  ],
  s0592: [
    'Eighth month, day renshen: the Emperor took his seat in the Hall of Supreme Harmony and, by the Empress Dowager\'s instruction, invested Noble Consort of the Nara clan as Empress.',
    'In the eighth month, the Nara Noble Consort was invested as Empress by the Empress Dowager\'s order.',
  ],
  s0593: [
    'On day guiyou, because the Empress had been invested, the Emperor led princes and grand ministers with the Empress Dowager to Cining Palace for congratulatory rites, and the Empress Dowager was given the honorific title Empress Dowager Chongqing Cixuan Kanghui Dunhe.',
    'On guiyou day, the court celebrated the new Empress and added the Empress Dowager\'s honorific title.',
  ],
  s0594: [
    'On day dinghai, the Emperor, accompanying the Empress Dowager and leading the Empress, visited the tombs and also toured Song and Luo.',
    'On dinghai day, the court visited the tombs and toured Song and Luo.',
  ],
  s0595: [
    'On day wuzi, Ji Shan was ordered to handle affairs at Xining, Bandi to handle affairs in Tibet, replacing Labudun\'s return to the capital.',
    'On wuzi day, Ji Shan went to Xining and Bandi to Tibet as Labudun returned.',
  ],
  s0596: [
    'On day gengyin, the Emperor, accompanying the Empress Dowager, visited Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On gengyin day, the court visited Zhaoxi, Xiaoling, Xiaodongling, and Jingling.',
  ],
  s0597: [
    'On day jiawu, Left Censor-in-chief Detong and Peng Weixin and Left Vice Censor-in-chief Ma Ling\'a were punished with graded demotions and dismissals for favoring Fu Heng in deliberation.',
    'On jiawu day, Detong, Peng Weixin, and Ma Ling\'a were punished for favoring Fu Heng.',
  ],
  s0598: [
    'On day dingyou, relief was given for flood disaster in seven prefectures and counties including Yi county in Shandong.',
    'On dingyou day, flood relief reached seven Shandong districts including Yi county.',
  ],
  s0599: [
    'Ninth month, day gengzi, new moon: Mei Yucheng was made Left Censor-in-chief.',
    'In the ninth month\'s new moon, Mei Yucheng became Left Censor-in-chief.',
  ],
  s0600: [
    'On day renyin, the Emperor, accompanying the Empress Dowager and leading the Empress, visited Tailing.',
    'On renyin day, the court visited Tailing with the Empress Dowager and Empress.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b06.mjs <translation.json>'
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
