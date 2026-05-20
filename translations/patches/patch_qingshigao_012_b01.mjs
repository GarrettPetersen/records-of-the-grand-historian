#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Twenty-first year, spring, first month, day gengwu: because the imperial son-in-law, Korcin Prince Sebten Balzhur, had bungled military affairs, his title was stripped and he was imprisoned.',
    'In spring of Qianlong 21, on gengwu, Korcin prince and imperial son-in-law Sebten Balzhur lost his rank for military negligence and was confined.',
  ],
  s0002: [
    'Khalkha Prince Erechin Dorji was sentenced to decapitation for laxly allowing Amursana to escape.',
    'Erechin Dorji, Khalkha prince, was executed for letting Amursana slip away.',
  ],
  s0003: [
    'On day jimao, because the wife of the former Dzungar grand taiji Dashdawa led her people in surrender, she was enfeoffed as Princess Chen Merigen Khatun.',
    'On jimao, Dashdawa\'s widow, who led a Dzungar surrender, was made Princess Chen Merigen Khatun.',
  ],
  s0004: [
    'Yin Jishan was ordered to go to Zhejiang to join in the joint trial of E Leshun.',
    'Yin Jishan was sent to Zhejiang to help try E Leshun.',
  ],
  s0005: [
    'On day dinghai, Abaghas Demuqi Hadan and others came to surrender.',
    'On dinghai, Abaghas Demuqi Hadan\'s party surrendered.',
  ],
  s0006: [
    'On day yiwei, Hadaha was ordered to advance troops from Altai to assist in the suppression campaign.',
    'On yiwei, Hadaha was told to march from Altai for the joint campaign.',
  ],
  s0007: [
    'Former Vice-General Sarala, having returned from Zhuoledusi, was ordered to share the vice-general\'s seal with Orenjei.',
    'Sarala, ex-vice-general, came back from Zhuoledusi and shared the vice-general seal with Orenjei.',
  ],
  s0008: [
    'Associate Grand Secretary Daledang\'a was ordered to advance troops from Zhuoledusi to assist in the suppression campaign.',
    'Daledang\'a was sent from Zhuoledusi with troops for the joint campaign.',
  ],
  s0009: [
    'On day dingyou, retired Associate Grand Secretary Akedun died.',
    'On dingyou, Akedun, retired associate grand secretary, died.',
  ],
  s0010: [
    'Second month, day guimao: the minister in charge of affairs at Barkol, Heqi, was granted the imperial commissioner seal.',
    'In month 2, guimao, Heqi at Barkol received the imperial commissioner\'s seal.',
  ],
  s0011: [
    'On day wushen, Yang Tingzhang was made Zhejiang governor.',
    'On wushen, Yang Tingzhang became Zhejiang governor.',
  ],
  s0012: [
    'On day xinhai, the Emperor set out on tour and paid rites at the Kong Forest.',
    'On xinhai, Hongli left the capital to worship at Confucius\'s forest tomb.',
  ],
  s0013: [
    'Because Celeng reported the capture of Amursana, the Emperor was ordered to change course and pay rites at Tailing.',
    'Celeng\'s report of Amursana\'s capture sent Hongli to Tailing instead.',
  ],
  s0014: [
    'On day jiayin, the Emperor paid rites at Tailing.',
    'On jiayin, Hongli worshipped at Tailing.',
  ],
  s0015: [
    'Quota taxes were remitted three-tenths for prefectures and counties passed through in Zhili and Shandong; five-tenths where harvests were poor.',
    'Zhili and Shandong counties on the route lost three-tenths of tax; poor-harvest districts lost half.',
  ],
  s0016: [
    'On day yimao, the Emperor went to Shandong and visited the Kong Forest.',
    'On yimao, Hongli went to Shandong and worshipped at the Kong Forest.',
  ],
  s0017: [
    'Quota taxes were remitted for tidal disaster in Haifeng and two other Shandong counties.',
    'Three Shandong tidal-flood counties were tax-exempt.',
  ],
  s0018: [
    'On day renchen, flood relief was given for disaster in Lanshan and other Shandong prefectures and counties.',
    'On renchen, Shandong flood districts including Lanshan were relieved.',
  ],
  s0019: [
    'On day guihai, flood relief was given for seawall flooding in Renhe and fourteen other Zhejiang prefectures, counties, and salt fields.',
    'On guihai, fifteen Zhejiang coastal flood districts were relieved.',
  ],
  s0020: [
    'On day jiazi, Minister of Works Wei Zhe, ill, was relieved; Zhao Hongen replaced him.',
    'On jiazi, sick Wei Zhe left the Works ministry; Zhao Hongen took over.',
  ],
  s0021: [
    'Celeng memorialized that Amursana had been captured—a false report.',
    'Celeng falsely reported Amursana\'s capture.',
  ],
  s0022: [
    'On day dingmao, Sarala was ordered to station as vice-general at Tenager.',
    'On dingmao, Sarala was posted as vice-general at Tenager.',
  ],
  s0023: [
    'On day wuchen, Suose was made Huguang governor-general; Guo Yiyu Yunnan governor.',
    'On wuchen, Suose took Huguang; Guo Yiyu, Yunnan.',
  ],
  s0024: [
    'Third month, new moon on day jisi: the Emperor reached Qufu and paid rites at the Temple of the First Teacher Confucius.',
    'On the third-month new moon, Hongli worshipped at Confucius\'s temple in Qufu.',
  ],
  s0025: [
    'Qingbao was made Mukden general.',
    'Qingbao became Mukden general.',
  ],
  s0026: [
    'On day gengwu, the libation ceremony was completed.',
    'On gengwu, the Confucian sacrifice ended.',
  ],
  s0027: [
    'Rites were paid at the Kong Forest, Shaohao\'s tomb, and the Temple of the Primordial Sage Duke of Zhou.',
    'He visited the Kong Forest, Shaohao\'s tomb, and the Duke of Zhou temple.',
  ],
  s0028: [
    'Quota taxes were remitted for Qufu in the dingchou year.',
    'Qufu\'s dingchou-year taxes were forgiven.',
  ],
  s0029: [
    'On day xinwei, flood relief was given for disaster in Zou county and sixteen other Shandong prefectures, counties, and guards.',
    'On xinwei, seventeen Shandong flood districts were relieved.',
  ],
  s0030: [
    'On day bingxu, canal rents were remitted for disaster in Suqian, Jiangsu; last year\'s flood quota taxes in Qianjiang and four other Hubei prefectures and counties.',
    'On bingxu, Jiangsu canal rents and five Hubei flood counties\' last-year taxes were forgiven.',
  ],
  s0031: [
    'On day dinghai, Hadaha was ordered to advance on Uriankhai at Buyantu; Qinggunjab and Chebudeng were made campaign assistant commissioners.',
    'On dinghai, Hadaha marched on Buyantu; Qinggunjab and Chebudeng became expedition advisers.',
  ],
  s0032: [
    'Celeng and others memorialized the recovery of Ili.',
    'Celeng reported Ili restored.',
  ],
  s0033: [
    'On day wuzi, last year\'s flood quota taxes were remitted for twenty-one Anhui prefectures, counties, and guards including Suzhou, and seventy-two Jiangsu prefectures, counties, and guards including Funing.',
    'On wuzi, ninety-three Anhui and Jiangsu flood districts lost last year\'s taxes.',
  ],
  s0034: [
    'On day renchen, the Emperor paid rites at Zhaoxi Tomb, Xiaoling, and Jingling, and offered libation at Empress Xiaoxian\'s tomb.',
    'On renchen, Hongli worshipped at the imperial tombs and poured wine for Empress Xiaoxian.',
  ],
  s0035: [
    'On day bingshen, E Leshun was granted permission to take his own life.',
    'On bingshen, E Leshun was ordered to commit suicide.',
  ],
  s0036: [
    'On day dingyou, the Emperor returned to the capital.',
    'On dingyou, Hongli returned to Beijing.',
  ],
  s0037: [
    'Summer, fourth month, day renzi: last year\'s tidal-disaster quota taxes were remitted for Zou county and eighteen other Shandong prefectures, counties, and guards.',
    'In month 4, renzi, nineteen Shandong tidal-flood districts lost last year\'s taxes.',
  ],
  s0038: [
    'Daledang\'a was ordered to campaign against the Kazakhs by the western route; Hadaha by the northern route; Haning\'a and Eshe were made campaign assistant commissioners.',
    'Daledang\'a took the west, Hadaha the north, against the Kazakhs; Haning\'a and Eshe advised.',
  ],
  s0039: [
    'On day guichou, Grand Secretary Fu Heng was ordered to go to Erjen Habirga to put military affairs in order.',
    'On guichou, Fu Heng was sent to Erjen Habirga to reform the front.',
  ],
  s0040: [
    'Celeng and Yubao were arrested and questioned.',
    'Celeng and Yubao were taken into custody.',
  ],
  s0041: [
    'Uleden was sentenced to decapitation for laxly allowing Amursana to escape.',
    'Uleden was executed for letting Amursana escape.',
  ],
  s0042: [
    'On day jiayin, Minister Aligun was ordered to serve at the Grand Council.',
    'On jiayin, Aligun joined the Grand Council.',
  ],
  s0043: [
    'On day dingsi, Fu Heng was recalled to the capital.',
    'On dingsi, Fu Heng was recalled to Beijing.',
  ],
  s0044: [
    'Fude memorialized defeating the Kazakhs at Saibosutai.',
    'Fude reported a Kazakh defeat at Saibosutai.',
  ],
  s0045: [
    'On day renxu, twenty years of frost-disaster quota taxes were remitted for Kelan prefecture, Shanxi.',
    'On renxu, Kelan, Shanxi, shed twenty years of frost-disaster back taxes.',
  ],
  s0046: [
    'On day guihai, Grand Councillors Yarhashan and Liu Lun were dismissed.',
    'On guihai, Yarhashan and Liu Lun left the Grand Council.',
  ],
  s0047: [
    'Qiu Yixiu was ordered to serve at the Grand Council.',
    'Qiu Yixiu joined the Grand Council.',
  ],
  s0048: [
    'On day yichou, Liu Tongxun was recalled to the capital.',
    'On yichou, Liu Tongxun was recalled to Beijing.',
  ],
  s0049: [
    'Fifth month, new moon on day wuchen: Yubao was demoted to leading commander; Daledang\'a was made Right Vice-General for Pacifying the Frontier; Balu campaign assistant commissioner.',
    'On the fifth-month new moon, Yubao was demoted; Daledang\'a became right frontier vice-general; Balu, adviser.',
  ],
  s0050: [
    'On day yihai, last year\'s disaster quota taxes were remitted for Renhe and twelve other Zhejiang prefectures and counties.',
    'On yihai, thirteen Zhejiang disaster counties lost last year\'s taxes.',
  ],
  s0051: [
    'On day gengchen, the Emperor went to Black Dragon Pool to pray for rain.',
    'On gengchen, Hongli prayed for rain at Black Dragon Pool.',
  ],
  s0052: [
    'Mangana and Dashiceling were made campaign assistant commissioners.',
    'Mangana and Dashiceling became expedition advisers.',
  ],
  s0053: [
    'On day dinghai, this year\'s civilian-colony quota taxes were remitted for Ganzhou and two other Gansu prefectures.',
    'On dinghai, three Gansu prefectures\' settler taxes were forgiven.',
  ],
  s0054: [
    'Relief was given for last year\'s hail and frost in Gaolan and nineteen other Gansu prefectures and counties.',
    'Twenty Gansu districts received hail and frost relief.',
  ],
  s0055: [
    'On day xinchou, the Galzut zaisang Genden and others came to surrender.',
    'On xinchou, Galzut chief Genden\'s party surrendered.',
  ],
  s0056: [
    'On day renzi, Mangana was made commander at Guihua city.',
    'On renzi, Mangana took command at Guihua.',
  ],
  s0057: [
    'On day guichou, He Guozong was demoted and transferred; Zhao Hongen was made Left Censor-in-Chief; Wang Youdun transferred to Minister of Works; Liu Tongxun Minister of Punishments.',
    'On guichou, He Guozong was demoted; Zhao Hongen took the censorate; Wang Youdun, Works; Liu Tongxun, Punishments.',
  ],
  s0058: [
    'On day bingchen, the zaisang Sayinbeg of Boshigashi\'s following came to surrender.',
    'On bingchen, Sayinbeg, a Boshigashi subchief, surrendered.',
  ],
  s0059: [
    'On day guihai, the Dorbet taiji Boshigashi sent envoys to surrender and was ordered enfeoffed as prince.',
    'On guihai, Boshigashi of the Dorbet sent envoys; he was made a prince.',
  ],
  s0060: [
    'On day yichou, the Dorbet taiji Ubashi was enfeoffed as beizi.',
    'On yichou, Dorbet taiji Ubashi became a beizi.',
  ],
  s0061: [
    'Autumn, seventh month, day wuchen: last year\'s flood quota taxes were remitted for Wuwei and thirty-one other Anhui prefectures and guards.',
    'In month 7, wuchen, thirty-two Anhui flood districts lost last year\'s taxes.',
  ],
  s0062: [
    'On day renshen, the Telingut zaisang Dundok and Gurban Khoja and others feigned surrender at Jier Matai; Hadaha and others led troops and destroyed them.',
    'On renshen, Dundok and Gurban Khoja feigned surrender at Jier Matai; Hadaha annihilated them.',
  ],
  s0063: [
    'Hadaha was made chief chamberlain of the imperial bodyguard; Chebudeng Jab duke; Tangkalu and Suhede vice commandants; Sanduobudorji duke; the rest rewarded with graded honors.',
    'Hadaha became inner chamberlain; Chebudeng Jab, duke; Tangkalu and Suhede, vice commandants; others rewarded by rank.',
  ],
  s0064: [
    'On day gengchen, Grain Transport Governor-General Hubao died; Zhang Shizai replaced him.',
    'On gengchen, Hubao died; Zhang Shizai took the canal post.',
  ],
  s0065: [
    'On day dinghai, the Emperor went to Qinghe and bestowed offerings at the mourning lodges of Bandi and E Rong\'an.',
    'On dinghai, Hongli mourned Bandi and E Rong\'an at Qinghe.',
  ],
  s0066: [
    'On day renchen, because Qinggunjab\'s rebellious tracks were clear, an edict ordered Shuming, Chenggunjab, and others to capture and suppress him.',
    'On renchen, with Qinggunjab\'s rebellion evident, Shuming and Chenggunjab were told to hunt him down.',
  ],
  s0067: [
    'On day guisi, the Kucha beg Odui and others came to surrender.',
    'On guisi, Odui of Kucha and others surrendered.',
  ],
  s0068: [
    'Eighth month, day renyin: Chuo\'erduo was made Heilongjiang general.',
    'In month 8, renyin, Chuo\'erduo became Heilongjiang general.',
  ],
  s0069: [
    'On day yisi, Khalkha Prince Chenggunjab was made Left Vice-General for Pacifying the Frontier; Shuming, Alantai, Sangzhai Dorji, Deqinjab, and Talemaasan campaign assistant commissioners.',
    'On yisi, Chenggunjab became left frontier vice-general; five others became expedition advisers.',
  ],
  s0070: [
    'On day xinhai, Namuzhale and Demuchuke were made campaign assistant commissioners.',
    'On xinhai, Namuzhale and Demuchuke became expedition advisers.',
  ],
  s0071: [
    'Baode was ordered acting commander at Suiyuan.',
    'Baode acted as Suiyuan commander.',
  ],
  s0072: [
    'On day guichou, the Emperor, escorting the Empress Dowager, went on the autumn hunt at Mulan.',
    'On guichou, Hongli and the Empress Dowager left for the Mulan autumn hunt.',
  ],
  s0073: [
    'Abaghas and others were dismembered at the market.',
    'Abaghas and others were executed by lingchi.',
  ],
  s0074: [
    'On day wuwu, drought relief was given for six banners including Jaksaq Assistant State Duke Chenggun of the Tsetsen Khan tribe.',
    'On wuwu, six Tsetsen Khan banners received drought relief.',
  ],
  s0075: [
    'The Oirat Damalin came to surrender.',
    'The Oirat Damalin surrendered.',
  ],
  s0076: [
    'On day gengshen, the Emperor, escorting the Empress Dowager, toured Mulan and held the hunt enclosure.',
    'On gengshen, Hongli and the Empress Dowager hunted at Mulan.',
  ],
  s0077: [
    'Hutuling\'a, Fuchang, Baode, Zhekuna, and Arbin were made campaign assistant commissioners to serve with Chenggunjab.',
    'Five men became advisers under Chenggunjab.',
  ],
  s0078: [
    'Baoyun was ordered acting commander at Suiyuan.',
    'Baoyun acted as Suiyuan commander.',
  ],
  s0079: [
    'On day renxu, taiji Boshigashi entered audience; he was summoned to the traveling palace and granted a banquet.',
    'On renxu, Boshigashi was received at the traveling palace and feasted.',
  ],
  s0080: [
    'On day guihai, graded honors were granted to Chenggunjab and others.',
    'On guihai, Chenggunjab\'s party received graded rewards.',
  ],
  s0081: [
    'On day jiazi, the Khalkha beile-rank Chemuchukeb, for continuing relay stations, was enfeoffed as beile.',
    'On jiazi, Chemuchukeb of Khalkha was made beile for maintaining relay stations.',
  ],
  s0082: [
    'On day yichou, Hadaha and others campaigned against the Kazakhs and inflicted a great defeat.',
    'On yichou, Hadaha routed the Kazakhs.',
  ],
  s0083: [
    'Zhalafenga was enfeoffed as beizi; Mingrui vice commandant.',
    'Zhalafenga became beizi; Mingrui, vice commandant.',
  ],
  s0084: [
    'Relief was given for hail disaster in Chang\'an and twelve other Shaanxi prefectures and counties.',
    'Thirteen Shaanxi hail districts were relieved.',
  ],
  s0085: [
    'Ninth month, day jiaxu: taiji Bari of Dawachi\'s close kin led households in surrender and was ordered to graze at Zahakin.',
    'In month 9, jiaxu, Bari of Dawachi\'s kin surrendered and was settled at Zahakin.',
  ],
  s0086: [
    'On day dingchou, the Torgut taiji Dundobdash sent the envoy Chuizhab to pay tribute; the Emperor summoned him at the traveling tent and granted a banquet.',
    'On dingchou, Dundobdash sent Chuizhab with tribute; Hongli feasted him at the traveling tent.',
  ],
  s0087: [
    'On day wuzi, accumulated tax arrears from Qianlong years 1 through 15 in Gansu were remitted, and this year\'s quota taxes in Ningxia, Anxi, and twenty other prefectures and guards were remitted by gradation.',
    'On wuzi, Gansu back taxes through year 15 were forgiven; twenty-two northwest districts got partial tax relief.',
  ],
  s0088: [
    'On day gengyin, the Emperor, escorting the Empress Dowager, returned to lodge at the Mountain Resort for Escaping the Heat.',
    'On gengyin, Hongli and the Empress Dowager returned to the Summer Resort.',
  ],
  s0089: [
    'Dorbet Prince Boshigashi was made league chief.',
    'Boshigashi, Dorbet prince, became league chief.',
  ],
  s0090: [
    'On day yiwei, the king of Siam sent envoys with tribute goods.',
    'On yiwei, Siam sent tribute.',
  ],
  s0091: [
    'Flood relief was given for disaster in Yutai and other Shandong counties.',
    'Shandong flood counties including Yutai were relieved.',
  ],
  s0092: [
    'Intercalary ninth month, day guimao: Luobuzha Cheling\'s son Tamuchukeb was enfeoffed as beile.',
    'On the intercalary ninth-month guimao, Tamuchukeb son of Luobuzha Cheling became beile.',
  ],
  s0093: [
    'On day wushen, the Emperor, escorting the Empress Dowager, returned in triumph.',
    'On wushen, Hongli and the Empress Dowager returned from the tour.',
  ],
  s0094: [
    'On day gengxu, Agui was made campaign assistant commissioner for the northern route.',
    'On gengxu, Agui became northern-route adviser.',
  ],
  s0095: [
    'Permission was granted to lend seed grain and rations to flood-affected households in Heilongjiang.',
    'Heilongjiang flood victims could borrow seed and rations.',
  ],
  s0096: [
    'On day jiayin, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On jiayin, Hongli and the Empress Dowager returned to Beijing.',
  ],
  s0097: [
    'Flood relief was given for disaster in Suzhou and eleven other Anhui prefectures, counties, and guards.',
    'Twelve Anhui flood districts were relieved.',
  ],
  s0098: [
    'On day xinyou, grain-transport levies were remitted for disaster in Qinghe and eleven other Jiangsu prefectures, counties, and guards.',
    'On xinyou, twelve Jiangsu disaster districts lost canal levies.',
  ],
  s0099: [
    'Winter, tenth month, day wuchen: Hadaha was ordered to serve as campaign assistant commissioner with Chenggunjab; Aligun and Fude recalled to the capital.',
    'In month 10, wuchen, Hadaha joined Chenggunjab; Aligun and Fude returned to Beijing.',
  ],
  s0100: [
    'On day renshen, because Fulehe had failed to prevent the river breach in advance, he was summoned to the capital.',
    'On renshen, Fulehe was recalled to Beijing for failing to prevent the breach.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b01.mjs <translation.json>'
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
