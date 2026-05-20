#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Agui was granted Chariot Commandant; Fukang\'an was advanced to Marquis Jia-yong with courage; Hai Lancha\'s son Anlu was promoted to second-rank bodyguard; Wu Dai was made commander-in-chief; all were given Commandant of Cavalry rank; Heshen was again granted Chariot Commandant; the rest received differentiated promotions and rewards.',
    'Agui received Chariot Commandant; Fukang\'an was made Marquis Jia-yong; Anlu, Hai Lancha\'s son, became a second-rank guard; Wu Dai took command; all gained cavalry commandant rank; Heshen received Chariot Commandant again; others were promoted by degree.',
  ],
  s0702: [
    'On day bingyin, Changqing was made Urumqi commander-in-chief.',
    'On bingyin day, Changqing became Urumqi commander-in-chief.',
  ],
  s0703: [
    'On day guiyou, Wu Mitai was made Grand Secretary of the Eastern Pavilion.',
    'On guiyou day, Wu Mitai became an Eastern Pavilion grand secretary.',
  ],
  s0704: [
    'Heshen was transferred to Minister of Personnel, associate grand secretary, concurrently overseeing the Ministry of Revenue.',
    'Heshen took personnel, became associate grand secretary, and kept charge of revenue.',
  ],
  s0705: [
    'Fukang\'an was made Minister of Revenue while remaining Shaanxi governor-general.',
    'Fukang\'an became revenue minister while staying Shaanxi governor-general.',
  ],
  s0706: [
    'On day wuyin, military discipline regulations were ordered promulgated.',
    'On wuyin day, army discipline regulations were ordered issued.',
  ],
  s0707: [
    'On day guiwei, Li Shiyao was sentenced to execution.',
    'On guiwei day, Li Shiyao was sentenced to death.',
  ],
  s0708: [
    'Gangta\'s crime was pardoned; he was banished to serve at Ili.',
    'Gangta was pardoned and sent to serve exile at Ili.',
  ],
  s0709: [
    'That month, quota land tax from the previous year\'s drought disaster was remitted for eight prefectures and counties including Yulin in Shaanxi.',
    'That month, last year\'s drought taxes were remitted in eight Shaanxi districts including Yulin.',
  ],
  s0710: [
    'Eighth month, day jichou: the Yellow River breached at Suizhou, Henan; Agui was ordered to supervise repairs.',
    'In the eighth month, on jichou day, the Suizhou river broke in Henan and Agui was ordered to repair it.',
  ],
  s0711: [
    'On day guisi, accumulated tax arrears were remitted in Gansu—350,000 taels of silver and 470,000 shi of grain, each by varying amounts.',
    'On guisi day, Gansu back taxes of 350,000 taels and 470,000 shi of grain were forgiven by degree.',
  ],
  s0712: [
    'On day yiwei, because Ren Tiandu of Yanshi County, Henan, had nine generations living together, imperially composed verse and an imperially written plaque were bestowed.',
    'On yiwei day, Ren Tiandu of Yanshi, Henan, received an imperial poem and plaque for nine generations under one roof.',
  ],
  s0713: [
    'On day jihai, the Emperor went to Mulan for the enclosure hunt.',
    'On jihai day, the Emperor hunted at Mulan.',
  ],
  s0714: [
    'On day xinchou, Zhang Wenqing and others were executed.',
    'On xinchou day, Zhang Wenqing and others were put to death.',
  ],
  s0715: [
    'On day jiachen, Siam\'s chief Zheng Hua sent an attendant minister with tribute goods, requesting investiture.',
    'On jiachen day, Siam\'s Zheng Hua sent tribute and asked for investiture.',
  ],
  s0716: [
    'Ninth month, new moon on day guichou: flood relief was given for Anhui districts including Suzhou.',
    'At the ninth-month new moon, flood relief went to Anhui districts including Suzhou.',
  ],
  s0717: [
    'On day yimao, because the Muslim rebels had been pacified, Heshen was enfeoffed as a first-class baron.',
    'On yimao day, Heshen was made a first-class baron after the Muslim rebels were pacified.',
  ],
  s0718: [
    'On day gengshen, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On gengshen day, the Emperor stayed at the Summer Resort.',
  ],
  s0719: [
    'On day jiazi, Wuer\'tunaxun was transferred to Chahar commander-in-chief; Jifu was made Suiyuan city general.',
    'On jiazi day, Wuer\'tunaxun took Chahar command and Jifu became Suiyuan general.',
  ],
  s0720: [
    'On day jiaxu, the Emperor returned to the capital.',
    'On jiaxu day, the Emperor returned to Beijing.',
  ],
  s0721: [
    'On day bingzi, Chuoketuo\'s crime was pardoned.',
    'On bingzi day, Chuoketuo was pardoned.',
  ],
  s0722: [
    'On day gengchen, Interior Minister Ximing and Hanlin Academy Reader-in-Waiting Asu were ordered to Korea to invest the heir apparent.',
    'On gengchen day, Ximing and Asu were sent to Korea to invest the heir apparent.',
  ],
  s0723: [
    'That month, flood relief was given for three Shaanxi districts including Huazhou.',
    'That month, flood relief went to three Shaanxi districts including Huazhou.',
  ],
  s0724: [
    'Winter, tenth month, day xinmao: the Feast of a Thousand Elders was ordered held again.',
    'In the tenth winter month, on xinmao day, the Thousand Elder Banquet was ordered held again.',
  ],
  s0725: [
    'On day wuxu, flood relief was given for six Jiangxi counties including Nanchang.',
    'On wuxu day, flood relief went to six Jiangxi counties including Nanchang.',
  ],
  s0726: [
    'On day jiyou, penalties were reduced for persons in the Beijing autumn and court reviews whose death sentences had been confirmed more than three times.',
    'On jiyou day, penalties were reduced for Beijing review prisoners confirmed to death more than three times.',
  ],
  s0727: [
    'Eleventh month, day yichou: an edict ordered differentiated grade reduction for autumn and court review prisoners deferred three times.',
    'In the eleventh month, on yichou day, prisoners deferred three times in autumn and court review were reduced by degree.',
  ],
  s0728: [
    'On day renshen, the Suizhou river works were closed and joined.',
    'On renshen day, the Suizhou river works were closed.',
  ],
  s0729: [
    'On day gengchen, Liubao was ordered to be resident minister in Tibet; Fulu was made Xining affairs commissioner.',
    'On gengchen day, Liubao was posted to Tibet and Fulu became Xining commissioner.',
  ],
  s0730: [
    'Twelfth month, day jiachen: an edict for the forthcoming Feast of a Thousand Elders allowed one descendant to support officials and commoners aged ninety or above;',
    'In the twelfth month, on jiachen day, the court allowed one descendant to assist officials and commoners aged ninety or above at the Thousand Elder Banquet;',
  ],
  s0731: [
    'for ministers past seventy, if walking was somewhat difficult, one descendant was also permitted to support them.',
    'ministers past seventy who walked with difficulty could also have one descendant assist them.',
  ],
  s0732: [
    'That year, Korea, Ryukyu, Siam, and Annam sent tribute.',
    'That year, Korea, Ryukyu, Siam, and Annam paid tribute.',
  ],
  s0733: [
    'Fiftieth year, spring, first month, new moon on day xinhai: because of the fiftieth-year national celebration, an edict of grace was promulgated with differentiated favors.',
    'In spring of the fiftieth year, on the first-month new moon, Hongli issued a differentiated grace edict for the jubilee.',
  ],
  s0734: [
    'On day bingchen, the Feast of a Thousand Elders ceremony was held, entertaining three thousand persons from princes downward in the Palace of Heavenly Purity, with differentiated rewards.',
    'On bingchen day, three thousand guests from princes downward were feasted in the Palace of Heavenly Purity at the Thousand Elder Banquet, with rewards by degree.',
  ],
  s0735: [
    'On day dingsi, Left Censor-in-Chief Zhou Huang retired; Ji Yun was made Left Censor-in-Chief.',
    'On dingsi day, Zhou Huang retired as left censor-in-chief and Ji Yun succeeded him.',
  ],
  s0736: [
    'Wu Yuan was transferred to Hubei governor; Sun Yongqing was made Guangxi governor.',
    'Wu Yuan took Hubei and Sun Yongqing took Guangxi.',
  ],
  s0737: [
    'On day wuchen, Kuilin was summoned to the capital; Lawangduoerji acted as Uliasutai general.',
    'On wuchen day, Kuilin was recalled to Beijing and Lawangduoerji acted as Uliasutai general.',
  ],
  s0738: [
    'On day jiaxu, Kashgar\'s Akim Beg Alimu was executed when his secret contact with Samarkand was discovered.',
    'On jiaxu day, Kashgar beg Alimu was executed for secret dealings with Samarkand.',
  ],
  s0739: [
    'On day yiyou, flood relief was given for three Jiangxi counties including Pingxiang.',
    'On yiyou day, flood relief went to three Jiangxi counties including Pingxiang.',
  ],
  s0740: [
    'On day dinghai, the Emperor offered sacrifice to the First Teacher and lectured at the Imperial Academy.',
    'On dinghai day, the Emperor sacrificed to Confucius and lectured at the Imperial Academy.',
  ],
  s0741: [
    'On day wuzi, tax arrears were remitted for fourteen Henan counties including Jixian.',
    'On wuzi day, back taxes were remitted in fourteen Henan counties including Jixian.',
  ],
  s0742: [
    'On day jichou, the Emperor examined Hanlin Academy and Household of the Heir Apparent officials, promoting Lu Bokun and Wu Jing to first rank; the rest were promoted or demoted by degree.',
    'On jichou day, the Emperor tested Hanlin and heir-apparent officials, ranking Lu Bokun and Wu Jing first; others rose or fell by degree.',
  ],
  s0743: [
    'Officials of the Six Ministries promoted to Hanlin and related posts were examined; Qingling was raised to first rank; the rest were promoted or demoted by degree.',
    'Six-Ministry officials promoted to Hanlin posts were examined; Qingling ranked first; others rose or fell by degree.',
  ],
  s0744: [
    'On day xinmao, Bi Yuan was transferred to Henan governor; He Yucheng to Shaanxi governor.',
    'On xinmao day, Bi Yuan took Henan and He Yucheng took Shaanxi.',
  ],
  s0745: [
    'On day jiachen, tax arrears were remitted for six Jiangnan prefectures and departments including Jiangning.',
    'On jiachen day, back taxes were remitted in six Jiangnan districts including Jiangning.',
  ],
  s0746: [
    'That month, flood relief was given for three Jiangxi counties including Pingxiang and two Fujian counties including Jian\'an; drought relief for fourteen Henan counties including Jixian.',
    'That month, floods were relieved in three Jiangxi and two Fujian counties; drought was relieved in fourteen Henan counties including Jixian.',
  ],
  s0747: [
    'Third month, day renzi: the Emperor went to Mount Pan.',
    'In the third month, on renzi day, the Emperor went to Mount Pan.',
  ],
  s0748: [
    'On day jiayin, the Emperor went to the Ming Changling mausoleum to offer libations.',
    'On jiayin day, the Emperor offered libations at the Ming Changling.',
  ],
  s0749: [
    'On day dingsi, the Emperor halted at Mount Pan.',
    'On dingsi day, the Emperor stayed at Mount Pan.',
  ],
  s0750: [
    'On day xinyou, 300,000 shi of canal grain from Henan and Shandong were diverted to relieve drought in Weihui, Henan.',
    'On xinyou day, 300,000 shi of Henan and Shandong canal grain were sent to drought-stricken Weihui.',
  ],
  s0751: [
    'On day jiazi, tax arrears were remitted for Andong and Funing in Jiangsu.',
    'On jiazi day, back taxes were remitted in Jiangsu\'s Andong and Funing.',
  ],
  s0752: [
    'On day bingyin, the Emperor returned to the capital.',
    'On bingyin day, the Emperor returned to Beijing.',
  ],
  s0753: [
    'On day dingmao, Yongduo was made Ili councilor; Changqing, Xi\'an general; Kuilin, Urumqi commander-in-chief; Fuxing, Uliasutai general.',
    'On dingmao day, Yongduo took Ili, Changqing Xi\'an, Kuilin Urumqi, and Fuxing Uliasutai.',
  ],
  s0754: [
    'Shuchang was made Minister of Works; Sun Shiyi concurrently acted as Liangguang governor-general.',
    'Shuchang became works minister and Sun Shiyi acted as Liangguang governor-general.',
  ],
  s0755: [
    'On day yihai, tax arrears were remitted for forty-nine Zhili prefectures and counties including Bazhou.',
    'On yihai day, back taxes were remitted in forty-nine Zhili districts including Bazhou.',
  ],
  s0756: [
    'On day bingzi, quota land tax from the previous year\'s flood disaster was remitted for six Henan prefectures and counties including Shangqiu.',
    'On bingzi day, last year\'s flood taxes were remitted in six Henan districts including Shangqiu.',
  ],
  s0757: [
    'Summer, fourth month, day jiashen: earthquake at Suzhou and elsewhere in Gansu; relief was given.',
    'In the fourth summer month, on jiashen day, Gansu districts including Suzhou were earthquake-stricken and relieved.',
  ],
  s0758: [
    'On day renchen, the Emperor reviewed troops of the Jianrui Camp.',
    'On renchen day, the Emperor reviewed Jianrui Camp troops.',
  ],
  s0759: [
    'On day dingyou, Ministers of Punishments Kaning\'a and Hu Jitang and Vice Ministers Mu Jing\'a and Jiang Sheng, for incorrect forensic examination, were demoted to fourth-rank hat knobs.',
    'On dingyou day, Kaning\'a, Hu Jitang, Mu Jing\'a, and Jiang Sheng lost rank for faulty forensic findings.',
  ],
  s0760: [
    'On day wuxu, Grand Secretary Cai Xin retired.',
    'On wuxu day, Grand Secretary Cai Xin retired.',
  ],
  s0761: [
    'That month, drought-disaster quota land tax was remitted for Henan counties including Jixian.',
    'That month, drought quota taxes were remitted in Henan counties including Jixian.',
  ],
  s0762: [
    'Drought relief was given for districts including Xiangfu.',
    'Drought relief went to districts including Xiangfu.',
  ],
  s0763: [
    'Fifth month, day renzi: accumulated new and old quota land tax arrears were remitted for sixteen Henan prefectures and counties including Xiangfu and thirty-two including Zhengzhou.',
    'In the fifth month, on renzi day, new and old quota tax arrears were remitted in sixteen Henan districts including Xiangfu and thirty-two including Zhengzhou.',
  ],
  s0764: [
    'On day jiayin, Yongbao was transferred to Jiangxi governor; Chen Yongfu to Guizhou governor.',
    'On jiayin day, Yongbao took Jiangxi and Chen Yongfu took Guizhou.',
  ],
  s0765: [
    'On day jiwei, one million taels from the Liang-Huai transport treasury were allocated to Henan for famine relief.',
    'On jiwei day, one million taels from the Liang-Huai transport treasury were sent to Henan for relief.',
  ],
  s0766: [
    'On day bingyin, the Emperor conducted the autumn hunt at Mulan.',
    'On bingyin day, the Emperor hunted at Mulan in autumn.',
  ],
  s0767: [
    'On day dingmao, because Pingyang and subordinate districts in Shanxi were famished, two months\' grain was given to the poor.',
    'On dingmao day, two months\' grain was given to the poor in famished Shanxi districts around Pingyang.',
  ],
  s0768: [
    'On day renshen, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On renshen day, the Emperor stayed at the Summer Resort.',
  ],
  s0769: [
    'On day bingzi, Liang Guozhi was ordered made Grand Secretary of the Eastern Pavilion, concurrently Minister of Revenue; Liu Yong, associate grand secretary.',
    'On bingzi day, Liang Guozhi became Eastern Pavilion grand secretary and revenue minister; Liu Yong became associate grand secretary.',
  ],
  s0770: [
    'Cao Wenzhuan was made Minister of Revenue.',
    'Cao Wenzhuan became revenue minister.',
  ],
  s0771: [
    'On day dingchou, banditry at Zhecheng was pacified.',
    'On dingchou day, bandits at Zhecheng were pacified.',
  ],
  s0772: [
    'That month, drought relief was given for sixteen Jiangsu prefectures and counties including Tongshan and forty Shandong prefectures and counties including Lingxian.',
    'That month, drought relief went to sixteen Jiangsu districts including Tongshan and forty Shandong districts including Lingxian.',
  ],
  s0773: [
    'Sixth month, day renwu: because of delayed grain transport, Sazai and others were referred for strict deliberation and ordered to compensate by degree.',
    'In the sixth month, on renwu day, Sazai and others faced strict inquiry and graded compensation for late grain transport.',
  ],
  s0774: [
    'On day yiyou, Minister of the Court of Colonial Affairs Boqing\'a died.',
    'On yiyou day, Colonial Affairs Minister Boqing\'a died.',
  ],
  s0775: [
    'On day bingxu, Liubao was made minister of the Court of Colonial Affairs.',
    'On bingxu day, Liubao became colonial affairs minister.',
  ],
  s0776: [
    'On day xinchou, Kuilin acted as Ili general; Yongduo acted as Urumqi commander-in-chief.',
    'On xinchou day, Kuilin acted as Ili general and Yongduo as Urumqi commander-in-chief.',
  ],
  s0777: [
    'On day yisi, an order was issued to divert a further 100,000 shi of Jiangxi canal grain, held in Anhui for relief reserves.',
    'On yisi day, another 100,000 shi of Jiangxi canal grain was held in Anhui for relief stores.',
  ],
  s0778: [
    'That month, drought relief was given for eight Anhui prefectures and counties including Bozhou.',
    'That month, drought relief went to eight Anhui districts including Bozhou.',
  ],
  s0779: [
    'Autumn, seventh month, day jiyou: Fulehun was transferred to Liangguang governor-general; Yade was made Min-Zhe governor-general; Pulin, Fujian governor.',
    'In the seventh autumn month, on jiyou day, Fulehun took Liangguang; Yade took Min-Zhe; Pulin took Fujian.',
  ],
  s0780: [
    'On day gengxu, Pulin was transferred to Hunan governor; Xu Cizeng was made Fujian governor.',
    'On gengxu day, Pulin took Hunan and Xu Cizeng took Fujian.',
  ],
  s0781: [
    'On day xinyou, Li Qingfen was made Guizhou governor.',
    'On xinyou day, Li Qingfen became Guizhou governor.',
  ],
  s0782: [
    'On day yichou, one million taels from the Ministry of Revenue were allocated to Henan for famine relief.',
    'On yichou day, one million taels from the revenue ministry were sent to Henan for relief.',
  ],
  s0783: [
    'On day xinwei, flood relief was given for six Shanxi prefectures and counties including Daizhou.',
    'On xinwei day, flood relief went to six Shanxi districts including Daizhou.',
  ],
  s0784: [
    'On day yihai, Kuilin was made Ili general; Yongduo, Urumqi commander-in-chief.',
    'On yihai day, Kuilin became Ili general and Yongduo Urumqi commander-in-chief.',
  ],
  s0785: [
    'Eighth month, day yiyou: Agui was ordered to Henan to inspect disaster, and also to Jiangnan and Shandong to investigate canal transport.',
    'In the eighth month, on yiyou day, Agui was sent to inspect Henan disaster and Jiangnan and Shandong canal transport.',
  ],
  s0786: [
    'On day guisi, the Emperor went to Mulan for the enclosure hunt.',
    'On guisi day, the Emperor hunted at Mulan.',
  ],
  s0787: [
    'On day gengzi, flood relief was given for Chaoyi County, Shaanxi.',
    'On gengzi day, flood relief went to Chaoyi in Shaanxi.',
  ],
  s0788: [
    'On day guimao, Yisang\'a was made Shanxi governor.',
    'On guimao day, Yisang\'a became Shanxi governor.',
  ],
  s0789: [
    'Ninth month, day jiyou: Fukang\'an was ordered to Aksu to pacify and settle the Muslim populace.',
    'In the ninth month, on jiyou day, Fukang\'an was sent to Aksu to pacify the Muslim populace.',
  ],
  s0790: [
    'Qinggui was made Wushi councilor, acting Shaanxi-Gansu governor-general.',
    'Qinggui became Wushi councilor and acted as Shaanxi-Gansu governor-general.',
  ],
  s0791: [
    'Hailu was demoted to Ili expeditionary vice commander.',
    'Hailu was demoted to Ili expeditionary vice commander.',
  ],
  s0792: [
    'Mingliang was ordered, as Ili councilor, to act as Wushi councilor.',
    'Mingliang, as Ili councilor, was ordered to act as Wushi councilor.',
  ],
  s0793: [
    'On day jiayin, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On jiayin day, the Emperor stayed at the Summer Resort.',
  ],
  s0794: [
    'On day wuwu, Yongbao was transferred to Shaanxi governor; He Yucheng to Jiangxi governor.',
    'On wuwu day, Yongbao took Shaanxi and He Yucheng took Jiangxi.',
  ],
  s0795: [
    'On day wuchen, the Emperor returned to the capital.',
    'On wuchen day, the Emperor returned to Beijing.',
  ],
  s0796: [
    'On day renshen, drought relief was given for fifty-six Jiangsu prefectures, counties, and guards including Changzhou.',
    'On renshen day, drought relief went to fifty-six Jiangsu districts and guards including Changzhou.',
  ],
  s0797: [
    'Winter, tenth month, new moon on day dingchou: Lebao and Songyun were recalled to the capital; Fozhu was ordered stationed at Khalkha, jointly conducting affairs with Yunduoduoerji.',
    'At the tenth-month winter new moon, on dingchou day, Lebao and Songyun were recalled; Fozhu was posted to Khalkha with Yunduoduoerji.',
  ],
  s0798: [
    'On day gengchen, drought relief was given for ten Hunan prefectures and counties including Baling.',
    'On gengchen day, drought relief went to ten Hunan districts including Baling.',
  ],
  s0799: [
    'On day xinchou, drought relief was given for fifty-one Anhui prefectures and counties including Bozhou and nine guards including Fengyang.',
    'On xinchou day, drought relief went to fifty-one Anhui districts including Bozhou and nine guards including Fengyang.',
  ],
  s0800: [
    'That month, this year\'s hail-and-flood disaster quota land tax was remitted for twelve Gansu departments, prefectures, counties, and guards including Gaolan.',
    'That month, this year\'s hail-and-flood quota taxes were remitted in twelve Gansu districts and guards including Gaolan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b08.mjs <translation.json>'
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
