#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Yang Yuchun was appointed Imperial Commissioner to suppress them; E Shan acted as Shaanxi-Gansu governor-general.',
    'Yang Yuchun became Imperial Commissioner to suppress the rebels; E Shan acted as Shaanxi-Gansu governor-general.',
  ],
  s0502: [
    'Wulong\'a was appointed Imperial Commissioner to proceed to Taiwan.',
    'Wulong\'a was made Imperial Commissioner for Taiwan.',
  ],
  s0503: [
    'On day jihai, Deying\'a was made Ili Assistant Commissioner and Lunbudo\'erji acted as Uliastai general; on day gengzi, Jahangir took Hotan, and expeditionary commissioner Yimei, assisting commissioner Guibin, and others died.',
    'On jihai day, Deying\'a became Ili assistant commissioner and Lunbudo\'erji acted as Uliastai general; on gengzi day Jahangir took Hotan and Yimei, Guibin, and others fell.',
  ],
  s0504: [
    'On day jiachen, Chang Ling was made Campaigning General; Wulong\'a was Imperial Commissioner, and with Yang Yuchun he was to assist military affairs.',
    'On jiachen day, Chang Ling became Campaigning General; Wulong\'a was Imperial Commissioner with Yang Yuchun to assist the campaign.',
  ],
  s0505: [
    'On day yisi, Deying\'a acted as Ili general.',
    'On yisi day, Deying\'a acted as Ili general.',
  ],
  s0506: [
    'That month, flood relief was given for six Jiangsu prefectures and counties including Gaoyou.',
    'That month, Jiangsu units including Gaoyou received flood relief.',
  ],
  s0507: [
    'Ration grain was issued for flood victims in three Hunan prefectures and counties including Liling and at Guihua City, Shanxi.',
    'Flood rations went to three Hunan units including Liling and to Guihua City in Shanxi.',
  ],
  s0508: [
    'Seed loans were made for flood disaster in Xixiang and Zhouzhi, Shaanxi, and fodder silver was issued for the posts under Fengtian\'s Jinzhou prefecture.',
    'Shaanxi\'s Xixiang and Zhouzhi received seed loans, and Jinzhou posts received fodder silver.',
  ],
  s0509: [
    'Eighth month: Muslim chiefs including Babuding took Yengisar.',
    'In the eighth month, Muslim chiefs including Babuding seized Yengisar.',
  ],
  s0510: [
    'On day jiaxu, Jahangir took Kashgar; Assistant Commissioner Qingxiang, assisting commissioner Shuerhashan, and others died.',
    'On jiaxu day, Jahangir took Kashgar; Qingxiang, Shuerhashan, and others were killed.',
  ],
  s0511: [
    'He advanced and took Yarkand; affairs commissioner Yindenge, assisting commissioner Duolongwu, and others died.',
    'He then took Yarkand; Yindenge, Duolongwu, and others were killed.',
  ],
  s0512: [
    'That month, flood relief was given for five Jiangsu prefectures and counties including Haizhou.',
    'That month, five Jiangsu units including Haizhou received flood relief.',
  ],
  s0513: [
    'Ration grain was issued for flood victims in Saragh banner.',
    'Saragh banner received flood rations.',
  ],
  s0514: [
    'Ration grain was loaned for flood disaster at Hunjin Heihe, Suiyuan, Shanxi.',
    'Flood rations were loaned at Hunjin Heihe in Shanxi\'s Suiyuan.',
  ],
  s0515: [
    'Ninth month, new moon on day yimao: Huang Yue was removed from office and Wang Ding was made Minister of Revenue.',
    'At the ninth-month new moon, yimao, Huang Yue left office and Wang Ding took revenue.',
  ],
  s0516: [
    'On day xinsi, the Emperor visited the Southern Park.',
    'On xinsi day, the Emperor visited the Southern Park.',
  ],
  s0517: [
    'Guyuan Regional Commander Yang Fang and Gansu Regional Commander Qi Zhen were ordered to the Aksu army camp.',
    'Yang Fang and Qi Zhen were ordered to the Aksu camp.',
  ],
  s0518: [
    'On day dinghai, the Emperor returned to Yuanmingyuan.',
    'On dinghai day, the Emperor returned to Yuanmingyuan.',
  ],
  s0519: [
    'On day wuzi, Boqitu was made Chahar commandant.',
    'On wuzi day, Boqitu became Chahar commandant.',
  ],
  s0520: [
    'On day xinmao, Muzhang\'a was summoned to the capital and Yang Maotian acted as grain-transport governor-general.',
    'On xinmao day, Muzhang\'a was called to Beijing and Yang Maotian acted as grain-transport governor-general.',
  ],
  s0521: [
    'On day yiwei, Chang Qing was made Aksu affairs commissioner.',
    'On yiwei day, Chang Qing became Aksu commissioner.',
  ],
  s0522: [
    'On day jihai, Qing Lian memorialized defeating rebels at Achataike.',
    'On jihai day, Qing Lian reported a rebel defeat at Achataike.',
  ],
  s0523: [
    'On day xinchou, this year\'s wheat tribute due from Muslim villages near Aksu was remitted.',
    'On xinchou day, Aksu-area Muslim villages were exempted from this year\'s wheat tribute.',
  ],
  s0524: [
    'On day guimao, Gebushe was transferred to be Uliastai general.',
    'On guimao day, Gebushe became Uliastai general.',
  ],
  s0525: [
    'That month, ration grain and silver were issued for flood victims in Guizhou\'s Songtao banner, Shanxi\'s Guihua banner, Jiangsu\'s Shanyang and Yancheng counties, and seven Jiangxi banners and counties including Lianhua.',
    'That month, flood rations in grain and silver went to Songtao, Guihua, Shanyang, Yancheng, and seven Jiangxi units including Lianhua.',
  ],
  s0526: [
    'Winter, tenth month, day gengshen: Qingxiang, Assistant Commissioner who died at Kashgar, was posthumously granted Grand Guardian of the Heir Apparent.',
    'In winter month 10, gengshen, martyr Qingxiang of Kashgar was posthumously made Grand Guardian.',
  ],
  s0527: [
    'On day renxu, salt-field tax was remitted for fourteen Liang-Huai pans including Fu\'an that suffered flood.',
    'On renxu day, flood-struck Liang-Huai salt pans including Fu\'an were forgiven salt tax.',
  ],
  s0528: [
    'On day jiazi, 1,450,000 taels from the Jiangsu provincial treasury were allocated for flood relief in twenty prefectures and counties including Gaoyou.',
    'On jiazi day, 1.45 million taels from Jiangsu funds relieved floods in twenty units including Gaoyou.',
  ],
  s0529: [
    'That month, ration grain was issued for victims in eight Anhui prefectures, counties, and guards including Suzhou.',
    'That month, eight Anhui units including Suzhou received disaster rations.',
  ],
  s0530: [
    'Old and new quota taxes were remitted or deferred for disaster victims in forty-seven Jiangsu prefectures, banners, counties, and guards including Gaoyou.',
    'Forty-seven Jiangsu units including Gaoyou had old and new quotas remitted or deferred.',
  ],
  s0531: [
    'Eleventh month, day wuzi: Chang Ling and others memorialized defeating rebels at Korla in Aksu.',
    'In month 11, wuzi, Chang Ling reported defeating rebels at Korla near Aksu.',
  ],
  s0532: [
    'On day jichou, because Taiwan was pacified, Sun Erzhun was advanced to Junior Guardian of the Heir Apparent.',
    'On jichou day, with Taiwan pacified, Sun Erzhun became Junior Guardian.',
  ],
  s0533: [
    'That month, relief was given for disaster victims in three Hunan prefectures and counties including Chaling.',
    'That month, three Hunan units including Chaling received disaster relief.',
  ],
  s0534: [
    'Ration grain was loaned for disaster victims in thirteen Gansu prefectures and counties including Qinzhou.',
    'Thirteen Gansu units including Qinzhou received ration loans.',
  ],
  s0535: [
    'Grain rent was remitted or deferred for flood at Shenyang\'s Niuzhuang and elsewhere, and old and new quota taxes were remitted or deferred for flood in five Hunan prefectures and counties including Chaling.',
    'Niuzhuang and other Shenyang flood rents were eased, and five Hunan units including Chaling had quotas remitted or deferred.',
  ],
  s0536: [
    'Twelfth month, new moon on day wushen: Yang Jian was made Hubei governor.',
    'At the twelfth-month new moon, wushen, Yang Jian became Hubei governor.',
  ],
  s0537: [
    'Na\'erjing\'e was made grain-transport governor-general.',
    'Na\'erjing\'e became grain-transport governor-general.',
  ],
  s0538: [
    'On day bingchen, Ishchukurub, zhasake prince of the Four Sons Department, was stripped of rank for presumption.',
    'On bingchen day, Ishchukurub, a zhasake prince of the Four Sons, lost his title for presumption.',
  ],
  s0539: [
    'On day wuwu, Yinghe was transferred to Minister of the Court of Colonial Affairs, Xi\'en to Minister of Revenue, and Muzhang\'a to Minister of Works.',
    'On wuwu day, Yinghe took colonial affairs, Xi\'en revenue, and Muzhang\'a works.',
  ],
  s0540: [
    'That year, Ryukyu and Korea paid tribute.',
    'That year Ryukyu and Korea sent tribute.',
  ],
  s0541: [
    'Year 7, spring, first month, day dingyou: the Muslims of Hotan surrendered and were ordered specially rewarded.',
    'In year 7, spring month 1, dingyou, Hotan Muslims surrendered and were ordered favored rewards.',
  ],
  s0542: [
    'Soon afterward they were again taken by Jahangir.',
    'Soon Jahangir seized them again.',
  ],
  s0543: [
    'On day gengzi, Huixian was made resident commissioner in Tibet.',
    'On gengzi day, Huixian became Tibet commissioner.',
  ],
  s0544: [
    'That month, extended flood relief was given for military and civilian victims in twenty-three Jiangsu prefectures, counties, and guards including Gaoyou, and for salt households at nine Liang-Huai pans including Dingxi.',
    'That month, extended flood relief went to twenty-three Jiangsu units including Gaoyou and nine Liang-Huai salt pans including Dingxi.',
  ],
  s0545: [
    'Ration grain was issued for victims in Anhui\'s Sizhou and Wuhe counties and garrison settlements, and at Fengtian\'s Baqi Fort and Xiaoheishan.',
    'Sizhou, Wuhe, garrison settlements, Baqi Fort, and Xiaoheishan received disaster rations.',
  ],
  s0546: [
    'Ration grain and seed were loaned for disaster and poor harvest in ten Zhili prefectures and counties including Kaizhou, seventeen Gansu prefectures and counties including Qinzhou, four Henan counties including Yuanwu, five Liang-Huai salt pans including Fu\'an, and five Jiangxi banners and counties including Lianhua; granary grain for victims in Henan\'s Xiuwu and Fengqiu counties and Shanxi\'s Saragh banner; and silver and grain for three Jiangsu garrisons including Chuansha and eight garrisons including Qingcun.',
    'Kaizhou and nine other Zhili units, seventeen Gansu units including Qinzhou, four Henan counties, five Liang-Huai pans, five Jiangxi units, Xiuwu and Fengqiu, Saragh, and eleven Jiangsu garrisons received ration, seed, or granary aid.',
  ],
  s0547: [
    'Second month, day jiaxu: the Emperor went to Black Dragon Pool to pray for rain.',
    'In month 2, jiaxu, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0548: [
    'That month, military pay was loaned to three Jiangsu garrisons including Langshan that bordered disaster areas.',
    'That month, three Jiangsu garrisons including Langshan received pay loans near flooded districts.',
  ],
  s0549: [
    'Third month, day jichou: flood relief was given for Jiangsu prefectures and counties including Gaoyou.',
    'In month 3, jichou, Jiangsu units including Gaoyou received flood relief.',
  ],
  s0550: [
    'On day bingshen, Chang Ling and others memorialized defeating rebels at Yang\'arbart.',
    'On bingshen day, Chang Ling reported defeating rebels at Yang\'arbart.',
  ],
  s0551: [
    'Chang Ling was advanced to Grand Guardian of the Heir Apparent.',
    'Chang Ling became Grand Guardian.',
  ],
  s0552: [
    'On day dingyou, the Emperor went to Black Dragon Pool to pray for rain.',
    'On dingyou day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0553: [
    'On day jihai, Chang Ling and others defeated rebels at Shabudur and captured the Kokand Muslim headman Setiba\'erdi.',
    'On jihai day, Chang Ling defeated rebels at Shabudur and captured the Kokand notable Setiba\'erdi.',
  ],
  s0554: [
    'Jiang Youxian and Muzhang\'a were ordered to inspect the Southern Canal.',
    'Jiang Youxian and Muzhang\'a were told to survey the Southern Canal.',
  ],
  s0555: [
    'Na Qing\'an acted as Minister of Works.',
    'Na Qing\'an acted as works minister.',
  ],
  s0556: [
    'On day guimao, Huixian was made resident minister in Tibet.',
    'On guimao day, Huixian became Tibet commissioner.',
  ],
  s0557: [
    'On day jiachen, rain fell.',
    'On jiachen day, it rained.',
  ],
  s0558: [
    'That month, disaster victims in Jiangsu prefectures and counties including Gaoyou were relieved.',
    'That month, Jiangsu units including Gaoyou received disaster relief.',
  ],
  s0559: [
    'Ration grain was loaned to the poor in three Gansu counties including Zhangye and six Zhili prefectures and counties including Kaizhou.',
    'Zhangye and two other Gansu counties and six Zhili units including Kaizhou received ration loans.',
  ],
  s0560: [
    'Summer, fourth month, new moon on day bingwu: there was a solar eclipse.',
    'In summer month 4, bingwu new moon, there was a solar eclipse.',
  ],
  s0561: [
    'On day wushen, Chang Ling and others memorialized defeating rebels at Akwabart.',
    'On wushen day, Chang Ling reported defeating rebels at Akwabart.',
  ],
  s0562: [
    'Chang Ling was granted purple reins; Yang Yuchun was made Grand Tutor of the Heir Apparent and Wulong\'a Junior Guardian of the Heir Apparent.',
    'Chang Ling received purple reins; Yang Yuchun became Grand Tutor and Wulong\'a Junior Guardian.',
  ],
  s0563: [
    'On day renzi, Chang Ling and others took Kashgar and Jahangir fled.',
    'On renzi day, Kashgar was recovered and Jahangir escaped.',
  ],
  s0564: [
    'On day xinyou, they advanced and took Yengisar.',
    'On xinyou day, Yengisar was recovered.',
  ],
  s0565: [
    'Because Jahangir had not been captured, Chang Ling\'s purple reins and the ranks of Yang Yuchun and Wulong\'a were stripped.',
    'With Jahangir still at large, Chang Ling lost his purple reins and Yang Yuchun and Wulong\'a lost their honors.',
  ],
  s0566: [
    'Fifth month, day gengchen: Yang Fang took Hotan, captured the Muslim headmen including Ga\'erle, and executed them.',
    'In month 5, gengchen, Yang Fang recovered Hotan, seized Ga\'erle and other Muslim leaders, and executed them.',
  ],
  s0567: [
    'On day renwu, Lu Yizhuang was removed from office and Wang Yinzhi was made Minister of Works.',
    'On renwu day, Lu Yizhuang left office and Wang Yinzhi took works.',
  ],
  s0568: [
    'On day guiwei, Qi Shan, Zhang Jing, and Pan Xi\'en were severely reprimanded.',
    'On guiwei day, Qi Shan, Zhang Jing, and Pan Xi\'en were sharply rebuked.',
  ],
  s0569: [
    'Qi Shan was removed as Liangjiang governor-general and Jiang Youxian replaced him.',
    'Qi Shan left the Liangjiang post and Jiang Youxian replaced him.',
  ],
  s0570: [
    'Tuojin was placed in charge of the Ministry of Punishments.',
    'Tuojin took charge of punishments.',
  ],
  s0571: [
    'On day dinghai, Muzhang\'a was ordered to study and serve under the Grand Council ministers.',
    'On dinghai day, Muzhang\'a was told to study under the Grand Council.',
  ],
  s0572: [
    'Intercalary fifth month, new moon on day yisi: old and new quota taxes for the eight Muslim cities were remitted.',
    'At the intercalary fifth-month new moon, yisi, quotas for the eight border cities were remitted.',
  ],
  s0573: [
    'On day bingwu, Yang Yuchun was ordered to return and Yang Fang was made Assistant Commissioner.',
    'On bingwu day, Yang Yuchun was recalled and Yang Fang became assistant commissioner.',
  ],
  s0574: [
    'On day wushen, Yihao was transferred to Shenyang general and Jin Chang to Suiyuan general.',
    'On wushen day, Yihao became Shenyang general and Jin Chang Suiyuan general.',
  ],
  s0575: [
    'That month, grain was loaned to soldiers at the Huangzhou garrison post at Daoshifu.',
    'That month, Huangzhou post soldiers at Daoshifu received grain loans.',
  ],
  s0576: [
    'Sixth month, day renwu: the Emperor went to Black Dragon Pool to pray for rain.',
    'In month 6, renwu, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0577: [
    'On day bingxu, rain fell.',
    'On bingxu day, it rained.',
  ],
  s0578: [
    'Autumn, seventh month, day renzi: Associate Grand Secretary and Minister of Rites Wang Tingzhen died.',
    'In autumn month 7, renzi, Associate Grand Secretary Wang Tingzhen died.',
  ],
  s0579: [
    'Jin Chang was removed as inner palace guard of the Plain Yellow Banner and Prince Zheng Urgung\'a replaced him.',
    'Jin Chang left the Plain Yellow guard post and Prince Zheng Urgung\'a replaced him.',
  ],
  s0580: [
    'On day bingchen, Yao Wentian was made Minister of Rites and Tang Jinzhao Left Censor-in-Chief.',
    'On bingchen day, Yao Wentian took rites and Tang Jinzhao the left censorate.',
  ],
  s0581: [
    'On day dingsi, Lu Yinpu was appointed Associate Grand Secretary.',
    'On dingsi day, Lu Yinpu became associate grand secretary.',
  ],
  s0582: [
    'On day jiwei, Yinghe, for failing to control household servants, was stripped of Associate Grand Secretary, Minister of the Court of Colonial Affairs, and purple reins.',
    'On jiwei day, Yinghe lost associate grand secretary, colonial affairs, and purple reins for lax control of servants.',
  ],
  s0583: [
    'Fujun was summoned as Minister of the Court of Colonial Affairs and Associate Grand Secretary.',
    'Fujun was called to colonial affairs and associate grand secretary.',
  ],
  s0584: [
    'Boqitu was made Jilin general.',
    'Boqitu became Jilin general.',
  ],
  s0585: [
    'Anfu was made Chahar commandant.',
    'Anfu became Chahar commandant.',
  ],
  s0586: [
    'On day xinyou, Rehe commandant Sheng Yin was removed and Na Qing\'an replaced him.',
    'On xinyou day, Sheng Yin left Rehe and Na Qing\'an replaced him.',
  ],
  s0587: [
    'On day guihai, Na Qing\'an again became Left Censor-in-Chief.',
    'On guihai day, Na Qing\'an returned as left censor-in-chief.',
  ],
  s0588: [
    'Yinghe was stripped of Grand Guardian of the Heir Apparent, reduced to second-rank cap insignia, and made Rehe commandant.',
    'Yinghe lost Grand Guardian rank, was reduced to second-rank insignia, and became Rehe commandant.',
  ],
  s0589: [
    'On day yichou, Wulong\'a was made Kashgar Assistant Commissioner.',
    'On yichou day, Wulong\'a became Kashgar assistant commissioner.',
  ],
  s0590: [
    'Lu Kun was made Shandong governor.',
    'Lu Kun became Shandong governor.',
  ],
  s0591: [
    'On day wuchen, quota taxes were remitted for Gansu prefectures and counties through which troops passed, and sixty percent of quota taxes were remitted for Gansu and Shaanxi prefectures and counties that aided military supplies.',
    'On wuchen day, Gansu transit taxes were forgiven and Gansu and Shaanxi military-aid counties lost sixty percent of quotas.',
  ],
  s0592: [
    'On day gengwu, discussing merit in recovering Kashgar and three other cities, Yang Yuchun was again made Grand Guardian of the Heir Apparent and E Shan and Lu Kun were made Junior Guardian of the Heir Apparent.',
    'On gengwu day, for recovering four cities, Yang Yuchun regained Grand Guardian rank and E Shan and Lu Kun became Junior Guardians.',
  ],
  s0593: [
    'On day renshen, because the Muslim borderlands were secured again, Cao Zhenyong was advanced to Grand Preceptor of the Heir Apparent, Jiang Youxian and Wen Fu to Grand Guardian of the Heir Apparent, and Wang Ding and Yu Lin to Junior Guardian of the Heir Apparent.',
    'On renshen day, with the borderlands secured again, Cao Zhenyong became Grand Preceptor, Jiang Youxian and Wen Fu Grand Guardians, and Wang Ding and Yu Lin Junior Guardians.',
  ],
  s0594: [
    'That month, ration grain was issued for banner people in three Fengtian prefectures and counties including Jinzhou who suffered flood.',
    'That month, flood rations went to three Fengtian units including Jinzhou.',
  ],
  s0595: [
    'Eighth month, day guiwei: on the Longevity Festival, banquets were suspended.',
    'In month 8, guiwei, Longevity Festival banquets were cancelled.',
  ],
  s0596: [
    'On day bingshen, Lu Kun was transferred to Shanxi governor and Qi Shan was made Shandong governor.',
    'On bingshen day, Lu Kun went to Shanxi and Qi Shan to Shandong.',
  ],
  s0597: [
    'That month, flood relief was given for Shaanxi\'s Lueyang county and Hubei\'s Jiangling and Jianli counties.',
    'That month, Lueyang, Jiangling, and Jianli received flood relief.',
  ],
  s0598: [
    'Monthly rations were issued for canal laborers harmed by disaster in the Jiang-Huai region and elsewhere.',
    'Disaster-hit canal laborers in the Jiang-Huai region received monthly rations.',
  ],
  s0599: [
    'Old and new quota taxes were remitted or deferred for forty-seven Jiangsu prefectures, counties, guards, and banners flooded by water.',
    'Forty-seven flooded Jiangsu units had old and new quotas remitted or deferred.',
  ],
  s0600: [
    'Ninth month, day guichou: because Empress Xiaomu\'s coffin was moved to Baohua Valley, the eldest son Yiwei was ordered to perform the ancestral offering rites.',
    'In month 9, guichou, Empress Xiaomu\'s coffin went to Baohua Valley and eldest son Yiwei was ordered to lead the ancestral rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b06.mjs <translation.json>'
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
