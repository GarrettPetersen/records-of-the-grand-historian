#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'Eighth month, day wuzi: Prince Lü Yuntao was ordered to perform sacrifice in the emperor\'s stead at the altars of Earth and Grain.',
    'In the eighth month, Prince Lü Yuntao sacrificed at the Earth and Grain altars for the throne.',
  ],
  s0902: [
    'Relief was given for flood disaster at Banpu and other salt fields in the Two Huai region.',
    'Banpu and other Two Huai salt fields received flood relief.',
  ],
  s0903: [
    'On day wuxu, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
    'On wuxu day, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
  ],
  s0904: [
    'On day gengzi, Gao Bin was dismissed; Celeng was placed in charge as Director-General of the Southern Rivers and, together with Liu Tongxun, was to investigate embezzlement and other abuses in river works.',
    'On gengzi day, Gao Bin was dismissed; Celeng took the southern rivers and joined Liu Tongxun to probe river-work abuses.',
  ],
  s0905: [
    'On day xinchou, Yongchang and Kaitai were each ordered to return to their original posts.',
    'On xinchou day, Yongchang and Kaitai were sent back to their regular posts.',
  ],
  s0906: [
    'On day jiachen, the Emperor accompanied the Empress Dowager to halt at the Mountain Resort for Summer Retreat.',
    'On jiachen day, the court halted at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0907: [
    'On day yisi, one hundred thousand shi of rice each from Jiangxi and Hubei were allocated to relieve disaster in Jiangnan.',
    'On yisi day, Jiangxi and Hubei each sent one hundred thousand shi of rice to relieve Jiangnan.',
  ],
  s0908: [
    'On day dingwei, the Emperor accompanied the Empress Dowager on a tour to mulan for the enclosure hunt.',
    'On dingwei day, the Empress Dowager toured mulan for the enclosure hunt.',
  ],
  s0909: [
    'On day gengxu, Gao Bin and Zhang Shizai were stripped of office but kept at river works to serve; Wei Zhezhi was made Anhui governor.',
    'On gengxu day, Gao Bin and Zhang Shizai lost office but stayed on the rivers; Wei Zhezhi became Anhui governor.',
  ],
  s0910: [
    'On day xinhai, relief was given for floods in twelve Jiangsu prefectures and counties including Tongshan and in Shandong counties including Lanshan.',
    'On xinhai day, Tongshan and eleven other Jiangsu units and Lanshan and other Shandong counties were flood-relieved.',
  ],
  s0911: [
    'Ninth month, day gengshen: relief was given for flood in three Hubei counties including Qianjiang.',
    'In the ninth month, Qianjiang and two other Hubei counties received flood relief.',
  ],
  s0912: [
    'On day renxu, the Yellow River broke its banks at thirteen forts in Yangwu, Henan.',
    'On renxu day, the Yellow River burst at thirteen Yangwu forts in Henan.',
  ],
  s0913: [
    'On day dingmao, for timidly holding back while accompanying the hunt, Feng\'an was stripped of his duke\'s rank and Tianguoen of his marquis\'s rank; Arigun was dismissed as Grand Minister of the Imperial Bodyguard.',
    'On dingmao day, Feng\'an and Tianguoen lost their ranks for cowardice on the hunt, and Arigun was removed as bodyguard minister.',
  ],
  s0914: [
    'Hongsheng was made Grand Minister of the Imperial Bodyguard for the Plain White Banner.',
    'Hongsheng became Plain White Banner bodyguard minister.',
  ],
  s0915: [
    'On day gengwu, because the Empress had arrived at Panshan, Su Hede was made Grand Minister of the Imperial Bodyguard and Minister in charge of the Imperial Household Department to accompany her.',
    'On gengwu day, with the Empress at Panshan, Su Hede became bodyguard minister and household minister to attend her.',
  ],
  s0916: [
    'The Yellow River broke its banks at Tongshan, Jiangsu.',
    'The Yellow River burst at Tongshan in Jiangsu.',
  ],
  s0917: [
    'On day renshen, Su Hede was ordered to assist in Jiangnan river works; Arigun was placed in charge as Grand Minister of the Imperial Bodyguard to accompany the court at Panshan.',
    'On renshen day, Su Hede assisted Jiangnan rivers while Arigun acted as bodyguard minister at Panshan.',
  ],
  s0918: [
    'Yin Jishan was made Jiangnan canal director-general; E Rong\'an Two-Jiangs governor-general; Yongchang was transferred to Shaanxi-Gansu governor-general; Kaitai to Huguang; Huang Tinggui to Sichuan; Ding Chang was made Guizhou governor; Hu Baojin Shanxi; Fan Shishou Jiangxi; Yang Xifu Hunan.',
    'Yin Jishan, E Rong\'an, Yongchang, Kaitai, Huang Tinggui, and six governors were appointed across the provinces.',
  ],
  s0919: [
    'Bandi was summoned to the capital; Celeng was made governor-general of Liangguang.',
    'Bandi was called to Beijing and Celeng became Liangguang governor-general.',
  ],
  s0920: [
    'On day guiyou, the Emperor accompanied the Empress Dowager at the Mountain Resort for Summer Retreat.',
    'On guiyou day, the court stayed at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0921: [
    'On day jiaxu, Left Censor-in-Chief Mei Yucheng retired.',
    'On jiaxu day, Mei Yucheng retired as left censor-in-chief.',
  ],
  s0922: [
    'On day bingzi, an edict ordered that Sub-prefect Li Chun and garrison commander Zhang Bin, who had caused losses to river works, be beheaded at the Tongshan worksite.',
    'On bingzi day, Li Chun and Zhang Bin were ordered beheaded at Tongshan for ruining river works.',
  ],
  s0923: [
    'Celeng and others were ordered to bind Gao Bin and Zhang Shizai and make them witness the execution, then release them.',
    'Celeng and others were told to bind Gao Bin and Zhang Shizai, make them watch the execution, and then free them.',
  ],
  s0924: [
    'On day dingchou, relief was given for flood in Shandong counties including Lijin.',
    'On dingchou day, Lijin and other Shandong counties received flood relief.',
  ],
  s0925: [
    'Winter, tenth month, day gengyin: the king of Sulu sent envoys to console Duwan Chazha, who sought to submit; the matter was referred to the ministries for discussion.',
    'In the tenth month, Sulu sent envoys over Duwan Chazha\'s submission request, and ministries were to decide.',
  ],
  s0926: [
    'On day xinmao, Liu Tongxun was summoned to the capital.',
    'On xinmao day, Liu Tongxun was called to Beijing.',
  ],
  s0927: [
    'On day yiwei, relief was given for this year\'s tidal disaster in six Shandong counties including Haifeng.',
    'On yiwei day, Haifeng and five other Shandong counties received tidal-disaster relief.',
  ],
  s0928: [
    'Zhong Yin was ordered to act as Shaanxi-Gansu governor-general.',
    'Zhong Yin was told to act as Shaanxi-Gansu governor-general.',
  ],
  s0929: [
    'On day xinchou, Yang Xifu was made left censor-in-chief; Hu Baojin was transferred to Hunan governor; Hengwen to Shanxi; Zhang Ruozhen to Hubei.',
    'On xinchou day, Yang Xifu became left censor-in-chief and three governors were reassigned.',
  ],
  s0930: [
    'On day guimao, scheduled land tax was remitted with distinctions for twenty-six Jiangsu prefectures, counties, and guards including Funing.',
    'On guimao day, Funing and twenty-five other Jiangsu units received graded tax remissions.',
  ],
  s0931: [
    'On day yisi, relief was given for flood in thirty Anhui prefectures, counties, and guards including Taihu.',
    'On yisi day, Taihu and twenty-nine other Anhui units received flood relief.',
  ],
  s0932: [
    'On day gengxu, drought quota taxes were remitted with distinctions for twenty-eight Zhejiang prefectures, counties, guards, and posts including Qiantang.',
    'On gengxu day, Qiantang and twenty-seven other Zhejiang units received graded drought tax relief.',
  ],
  s0933: [
    'Eleventh month, day jiwei: Su Chang was summoned to the capital; Henian was made Guangdong governor.',
    'In the eleventh month, Su Chang was recalled and Henian became Guangdong governor.',
  ],
  s0934: [
    'On day guihai, Jiangxi student Liu Zhenyu was executed for phrases such as "changing clothing institutions" in his work New Policies for Ordering the Realm.',
    'On guihai day, Liu Zhenyu was executed over seditious language in his New Policies for Ordering the Realm.',
  ],
  s0935: [
    'On day jiazi, relief was given for flood and hail in twenty-nine Gansu prefectures, counties, guards, and posts including Gaolan, and quota tax was remitted with distinctions.',
    'On jiazi day, Gaolan and twenty-eight other Gansu units were relieved and excused taxes.',
  ],
  s0936: [
    'On day jiaxu, Yang Yingju was made Shandong governor.',
    'On jiaxu day, Yang Yingju became Shandong governor.',
  ],
  s0937: [
    'Dzungar Durbed taiji Che Ling Ubash and others led their tribes in submission.',
    'Che Ling Ubash and other Durbed taijis submitted with their followers.',
  ],
  s0938: [
    'On day bingzi, relief was given for drought in Zhejiang\'s Yuhuan subprefecture.',
    'On bingzi day, Yuhuan received drought relief.',
  ],
  s0939: [
    'On day gengchen, Chizhou prefect Wang Dai, stripped for deficit, fled and resisted arrest; he was executed.',
    'On gengchen day, Wang Dai was executed after fleeing arrest over a revenue deficit.',
  ],
  s0940: [
    'Twelfth month, day bingxu: relief was given for drought at Fu\'an and other Two Huai salt fields.',
    'In the twelfth month, Fu\'an and other Two Huai salt fields received drought relief.',
  ],
  s0941: [
    'Submitted Durbed taijis Che Ling and others were ordered moved to Hulun Buir.',
    'Che Ling and other submitting Durbed taijis were sent to Hulun Buir.',
  ],
  s0942: [
    'On day dinghai, Associate Grand Secretary and Minister of Personnel Sun Jiagan died.',
    'On dinghai day, Sun Jiagan died while serving as associate grand secretary and personnel minister.',
  ],
  s0943: [
    'Yubao, Nusan, and Salar were made Grand Minister Assistants on the Northern Route.',
    'Yubao, Nusan, and Salar became Northern Route grand minister assistants.',
  ],
  s0944: [
    'Su Hede was ordered to the Ergune army camp.',
    'Su Hede was sent to the Ergune army camp.',
  ],
  s0945: [
    'On day gengyin, Minister of Revenue Jiang Pu was ordered as associate grand secretary; Huang Tinggui was made Minister of Personnel while still governing Sichuan; E\'erda acted for him.',
    'On gengyin day, Jiang Pu became associate grand secretary and Huang Tinggui took personnel while E\'erda acted in Sichuan.',
  ],
  s0946: [
    'On day bingshen, the breaches at Zhangjia Malu in Jiangnan and the two sluice gates at Shaobo Lake were closed on the same day.',
    'On bingshen day, Zhangjia Malu and Shaobo Lake\'s two gates were closed the same day.',
  ],
  s0947: [
    'On day gengzi, because Dzungar taiji Dawachi had not sent envoys to the capital, Yongchang was instructed to suspend trade temporarily.',
    'On gengzi day, Dawachi\'s failure to send envoys led Yongchang to suspend trade.',
  ],
  s0948: [
    'Nineteenth year, spring, first month, day renzi: relief was given for last year\'s flood in fifteen Anhui prefectures, counties, and guards including Suzhou and fifteen Jiangsu including Funing.',
    'In spring of the nineteenth year, Suzhou and other Anhui and Jiangsu flood districts received relief.',
  ],
  s0949: [
    'On day renxu, Salar and others were ordered to attack Dzungar Oirats who had entered the passes.',
    'On renxu day, Salar and others were told to attack Oirats who had crossed the passes.',
  ],
  s0950: [
    'On day yihai, Yang Xifu was ordered to act as Minister of Personnel; E\'mida was relieved of concurrent duty.',
    'On yihai day, Yang Xifu acted at Personnel and E\'mida lost his concurrent post.',
  ],
  s0951: [
    'On day dingchou, Ryukyu presented tribute.',
    'On dingchou day, Ryukyu sent tribute.',
  ],
  s0952: [
    'On day jimao, Dzungar taijis Che Ling and others were received in audience.',
    'On jimao day, Che Ling and other Dzungar taijis were received at court.',
  ],
  s0953: [
    'Second month, day bingshen: relief was given for the eighteenth year\'s flood in Shandong\'s Lanshan.',
    'In the second month, Lanshan received relief for its eighteenth-year flood.',
  ],
  s0954: [
    'On day wuxu, Sulu presented tribute; the Guangdong governor and governor were ordered to instruct the king not to use inland merchants as envoys.',
    'On wuxu day, Sulu sent tribute and Guangdong officials were told to bar merchant-envoys.',
  ],
  s0955: [
    'Relief was given for tidal disaster in four Shandong counties including Changyi and five salt fields including Yongfeng.',
    'Changyi and three other counties and Yongfeng and four other fields received tidal relief.',
  ],
  s0956: [
    'On day guimao, Celeng was summoned to the capital.',
    'On guimao day, Celeng was called to Beijing.',
  ],
  s0957: [
    'On day yisi, Dzungar Oirat Kuben submitted.',
    'On yisi day, the Dzungar Oirat Kuben submitted.',
  ],
  s0958: [
    'On day jiyou, Celeng was ordered to the Northern Route army camp.',
    'On jiyou day, Celeng was sent to the Northern Route camp.',
  ],
  s0959: [
    'Third month, first day xinhai of the month: Bai Zhongshan was made Hedong canal director-general; Yang Yingju acted for him.',
    'On the third-month new moon of xinhai, Bai Zhongshan took Hedong rivers and Yang Yingju acted.',
  ],
  s0960: [
    'Dzungar taijis Amursana and others quarreled internally with Dawachi.',
    'Amursana and other Dzungar taijis fell out with Dawachi.',
  ],
  s0961: [
    'On day wuwu, Su Hede, Chengun Zhabu, and Salar were ordered to the capital.',
    'On wuwu day, Su Hede, Chengun Zhabu, and Salar were called to Beijing.',
  ],
  s0962: [
    'Khalkha Prince Erdeni Dorji was placed in charge of Khalkha military affairs.',
    'Erdeni Dorji was put in charge of Khalkha forces.',
  ],
  s0963: [
    'On day gengshen, Sichuan Provincial Commander Yue Zhongqi died.',
    'On gengshen day, Yue Zhongqi died in office as Sichuan commander.',
  ],
  s0964: [
    'Relief was given for flood in four Hubei prefectures, counties, and guards including Qianjiang, and tax was remitted with distinctions.',
    'Qianjiang and three other Hubei units were flood-relieved and excused taxes.',
  ],
  s0965: [
    'On day guihai, quota tax was remitted for flood, hail, and drought in ten Zhili guards and counties including Dacheng in the eighteenth year.',
    'On guihai day, ten Zhili units including Dacheng were excused eighteenth-year disaster taxes.',
  ],
  s0966: [
    'On day gengwu, quota tax was remitted for the eighteenth year\'s flood in twenty-five Anhui prefectures, counties, and guards including Taiping, and relief was also given.',
    'On gengwu day, Taiping and twenty-four other Anhui units were excused flood taxes and relieved.',
  ],
  s0967: [
    'On day yihai, relief was given for salt producers at twelve Two Huai fields including Fu\'an.',
    'On yihai day, Fu\'an and eleven other Two Huai salt fields were relieved.',
  ],
  s0968: [
    'Summer, fourth month, first day gengchen of the month: Liu Tongxun and Wang Youdun were made Junior Grand Mentors of the Heir Apparent; Fang Guancheng, Karjishan, and Huang Tinggui Junior Grand Preceptors; E Rong\'an and Kaitai Junior Grand Tutors; Yongchang and Suose Junior Grand Protectors.',
    'On the fourth-month new moon of gengchen, Liu Tongxun, Wang Youdun, and six others received heir-apparent honors.',
  ],
  s0969: [
    'Dzungar taijis Che Ling and others were ordered received in audience.',
    'Che Ling and other Dzungar taijis were ordered received at court.',
  ],
  s0970: [
    'On day gengyin, Chengun Zhabu was demoted to Khalkha deputy general; Celeng was made Pacification Commissioner Left Deputy General on the Northern Border.',
    'On gengyin day, Chengun Zhabu was demoted and Celeng became northern frontier deputy general.',
  ],
  s0971: [
    'On day xinmao, Bandi was recalled to the capital.',
    'On xinmao day, Bandi was recalled to Beijing.',
  ],
  s0972: [
    'Yang Yingju was ordered to act as Liangguang governor-general.',
    'Yang Yingju was told to act as Liangguang governor-general.',
  ],
  s0973: [
    'On day bingwu, Banner commander Dening and Dzungar taiji Sebeteng were made Grand Minister Assistants at the Northern Route army camp.',
    'On bingwu day, Dening and Sebeteng became Northern Route camp grand minister assistants.',
  ],
  s0974: [
    'That month, quota tax was remitted for last year\'s drought salt producers at two Changlu fields including Cangzhou and last year\'s flood salt producers at two Zhili districts including Cangzhou.',
    'That month, Changlu and Zhili salt producers were excused last year\'s drought and flood taxes.',
  ],
  s0975: [
    'Relief was given for last year\'s drought in fifteen Gansu prefectures including Gaolan.',
    'Fifteen Gansu districts including Gaolan received drought relief for the previous year.',
  ],
  s0976: [
    'Relief was given for last year\'s flood in twelve Anhui prefectures including Suzhou and twenty-three Jiangsu including Funing.',
    'Twelve Anhui and twenty-three Jiangsu districts received relief for last year\'s floods.',
  ],
  s0977: [
    'Intercalary fourth month, first day gengxu of the month: Zhuang Peiyin and two hundred thirty-three others were granted jinshi and other ranks with distinctions.',
    'On the intercalary fourth-month new moon of gengxu, Zhuang Peiyin and 233 others received jinshi ranks.',
  ],
  s0978: [
    'On day jiwei, last year\'s flood quota tax was remitted for four Hubei prefectures, counties, and guards including Qianjiang.',
    'On jiwei day, four Hubei units including Qianjiang were excused last year\'s flood taxes.',
  ],
  s0979: [
    'On day xinwei, Sebeteng was received in audience; Grand Secretary Fu Heng was ordered to Zhangjiakou to convey the imperial will and welcome him; he was enfeoffed as beile.',
    'On xinwei day, Sebeteng was received at court, welcomed by Fu Heng at Zhangjiakou, and enfeoffed as beile.',
  ],
  s0980: [
    'On day renshen, it rained in the capital.',
    'On renshen day, rain fell in the capital.',
  ],
  s0981: [
    'Fifth month, day xinsi: Qingbao was made general of Heilongjiang.',
    'In the fifth month, Qingbao became Heilongjiang general.',
  ],
  s0982: [
    'Because of Dzungar internal disorder, both routes were instructed to advance troops to take Ili.',
    'Dzungar civil strife led to orders for both armies to advance on Ili.',
  ],
  s0983: [
    'Yongchang and Celeng were summoned to the capital to receive strategy in person.',
    'Yongchang and Celeng were called to Beijing for face-to-face strategy.',
  ],
  s0984: [
    'On day jiashen, the Emperor accompanied the Empress Dowager on a tour to Mukden.',
    'On jiashen day, the Emperor accompanied the Empress Dowager to Mukden.',
  ],
  s0985: [
    'On day wuzi, last year\'s flood quota tax was remitted for twenty-five Anhui prefectures, counties, and guards including Taiping.',
    'On wuzi day, Taiping and twenty-four other Anhui units were excused last year\'s flood taxes.',
  ],
  s0986: [
    'On day gengyin, the Emperor accompanied the Empress Dowager to halt at the Mountain Resort for Summer Retreat.',
    'On gengyin day, the court halted at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0987: [
    'Dzungar taiji Che Ling was enfeoffed as prince; Che Ling Ubash as commandery prince; Che Ling Munke as beile; Munketmur, Bandzhur, and Genden as beizi.',
    'Che Ling, Che Ling Ubash, Che Ling Munke, and three others received Mongol ranks from prince to beizi.',
  ],
  s0988: [
    'On day guisi, quota tax was remitted for salt producers flooded in the eighteenth year at eleven Zhejiang fields including Miaowan; severely stricken areas were also relieved.',
    'On guisi day, Miaowan and ten other Zhejiang salt fields were excused flood taxes and heavily hit areas relieved.',
  ],
  s0989: [
    'On day dingyou, last year\'s flood quota tax was remitted for salt producers at three Changlu fields including Yongfu.',
    'On dingyou day, Yongfu and two other Changlu fields were excused last year\'s flood taxes.',
  ],
  s0990: [
    'On day wuxu, Chen Hongmou was summoned to the capital.',
    'On wuxu day, Chen Hongmou was called to Beijing.',
  ],
  s0991: [
    'Liu Tongxun was ordered to handle Shaanxi-Gansu governor-general affairs jointly with Yongchang.',
    'Liu Tongxun was told to manage Shaanxi-Gansu affairs with Yongchang.',
  ],
  s0992: [
    'Chen Hongmou was transferred to Shaanxi governor; Zhong Yin to Fujian.',
    'Chen Hongmou went to Shaanxi and Zhong Yin to Fujian.',
  ],
  s0993: [
    'On day jihai, Yarhashan was summoned to the capital; E\'leshun was transferred to Zhejiang governor; Echang was made Gansu governor.',
    'On jihai day, Yarhashan was recalled; E\'leshun went to Zhejiang and Echang to Gansu.',
  ],
  s0994: [
    'Sixth month, day renzi: relief was given for flood in Fujian prefectures and counties including Longxi.',
    'In the sixth month, Longxi and other Fujian units received flood relief.',
  ],
  s0995: [
    'On day gengshen, relief was given for drought in five Gansu prefectures including Gaolan.',
    'On gengshen day, Gaolan and four other Gansu prefectures received drought relief.',
  ],
  s0996: [
    'On day renxu, Amursana and others were defeated by Dawachi and fled to the Ertis at Zhaobo Heshuo.',
    'On renxu day, Dawachi defeated Amursana, who fled toward the Ertis at Zhaobo Heshuo.',
  ],
  s0997: [
    'Celeng and others were instructed to receive and support those submitting.',
    'Celeng and others were told to welcome and support defectors.',
  ],
  s0998: [
    'On day renshen, Yarhashan was ordered to act as Vice Minister of Revenue and serve at the Grand Council.',
    'On renshen day, Yarhashan acted at Revenue and joined the Grand Council.',
  ],
  s0999: [
    'Autumn, seventh month, day xinsi: relief was given for flood in Zhili prefectures and counties including Jizhou.',
    'In the seventh month, Jizhou and other Zhili flood districts were relieved.',
  ],
  s1000: [
    'On day renwu, the Emperor accompanied the Empress Dowager to Mukden.',
    'On renwu day, the Emperor accompanied the Empress Dowager to Mukden.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b10.mjs <translation.json>'
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
