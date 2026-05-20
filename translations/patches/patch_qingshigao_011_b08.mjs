#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Hengwen was made Hubei governor.',
    'Hengwen became Hubei governor.',
  ],
  s0702: [
    'On day guimao, quota land tax for sixteen Henan prefectures and counties including Yanling was remitted on account of flood disaster in the fourteenth year.',
    'On guimao day, fourteenth-year flood taxes were remitted in sixteen Henan districts including Yanling.',
  ],
  s0703: [
    'On day yiyou, Yongxing was stripped of office and arrested for questioning; Jilin general Zhuotai was demoted and transferred, and Fusen replaced him.',
    'On yiyou day, Yongxing was dismissed and taken into custody; Zhuotai was demoted and Fusen became Jilin general.',
  ],
  s0704: [
    'On day bingxu, the Emperor halted at Taian prefecture and sacrificed to the Eastern Peak.',
    'On bingxu day, the court halted at Taian and sacrificed to Mount Tai.',
  ],
  s0705: [
    'On day wuzi, an edict ordered that because of the solar eclipse on the new moon of the fifth month, the traveling court was to remove suspended music and observe fasting.',
    'On wuzi day, the court ordered music suspended and fasting for the fifth-month eclipse.',
  ],
  s0706: [
    'On day jichou, Prince Fu Yunzhi was sent to perform the regular rain rites in his stead.',
    'On jichou day, Prince Fu Yunzhi performed the regular rain rites for the Emperor.',
  ],
  s0707: [
    'Fifth month, new moon on day dingyou: there was a solar eclipse.',
    'On the fifth-month new moon of dingyou, a solar eclipse occurred.',
  ],
  s0708: [
    'On day dingwei, the Emperor personally mourned Commander-in-chief Fu Qing and Censor-in-chief Labudun.',
    'On dingwei day, the Emperor mourned Fu Qing and Labudun in person.',
  ],
  s0709: [
    'On day wushen, because Yongxing and others had falsely impeached Tang Suizu, his registered property was restored and he was summoned to the capital.',
    'On wushen day, Tang Suizu\'s property was restored and he was recalled after Yongxing\'s false impeachment.',
  ],
  s0710: [
    'On day xinhai, Wu Hong and two hundred forty-three others were granted jinshi and other degrees with distinctions.',
    'On xinhai day, Wu Hong and 243 others received jinshi degrees with graded ranks.',
  ],
  s0711: [
    'On day dingsi, quota land tax for eleven Guangdong prefectures and counties including Haikang was remitted on account of wind disaster in the fifteenth year.',
    'On dingsi day, fifteenth-year wind-disaster taxes were remitted in eleven Guangdong districts including Haikang.',
  ],
  s0712: [
    'On day jiwei, Yan Ruilong was sentenced to decapitation for falsely accusing Tang Suizu.',
    'On jiwei day, Yan Ruilong was condemned to death for a false charge against Tang Suizu.',
  ],
  s0713: [
    'On day guihai, tidal-disaster relief was distributed for six Shandong prefectures and counties including Ye county.',
    'On guihai day, tidal relief reached six Shandong districts including Ye county.',
  ],
  s0714: [
    'Intercalary fifth month, day wuyin: Huang Tinggui was transferred to be Shaanxi-Gansu governor-general, and Yin Jishan to be Liangjiang governor-general.',
    'In the intercalary fifth month, Huang Tinggui became Shaanxi-Gansu governor-general and Yin Jishan Liangjiang governor-general.',
  ],
  s0715: [
    'On day wuzi, Yonggui was made Zhejiang governor.',
    'On wuzi day, Yonggui became Zhejiang governor.',
  ],
  s0716: [
    'On day renchen, Chen Zufan, Wu Ding, Liang Xiyu, and Gu Donggao, recommended for classical learning, were ordered to submit their writings; those originally due at the ministry for audience were excused.',
    'On renchen day, the four recommended classicists were told to submit writings; ministry audiences were waived.',
  ],
  s0717: [
    'On day guisi, locusts struck Zhili prefectures and counties including Hejian.',
    'On guisi day, locusts appeared in Hejian and other Zhili districts.',
  ],
  s0718: [
    'That month, quota land tax for nineteen Shanxi prefectures and counties including Taiyuan was remitted with distinctions on account of last year\'s flood, hail, and other disasters.',
    'That month, graded remissions were granted for Shanxi flood and hail damage in nineteen districts including Taiyuan.',
  ],
  s0719: [
    'Flood relief was distributed for six Shandong counties including Shouguang and three salterns including Guantai; for two Fujian counties including Ninghua; and earthquake relief for seven Yunnan prefectures and counties including Jianchuan.',
    'Relief went to Shandong, Fujian, and Yunnan disaster districts including Shouguang, Ninghua, and Jianchuan.',
  ],
  s0720: [
    'Sixth month, day jihai: Tang Suizu was reappointed Shanxi surveillance commissioner.',
    'In the sixth month, Tang Suizu returned as Shanxi surveillance commissioner.',
  ],
  s0721: [
    'On day renzi, hail-disaster relief was distributed for Jiangsu Jingjiang county.',
    'On renzi day, Jiangsu Jingjiang received hail relief.',
  ],
  s0722: [
    'Flood relief was distributed for four Guangdong prefectures and counties including Yingde.',
    'Guangdong flood relief reached four districts including Yingde.',
  ],
  s0723: [
    'Flood relief was distributed for Fengtai and Gaoping in Shanxi.',
    'Shanxi Fengtai and Gaoping received flood relief.',
  ],
  s0724: [
    'On day jiayin, last year\'s flood quota land tax was remitted for Jiangsu Pei county.',
    'On jiayin day, Pei county received last year\'s flood tax relief.',
  ],
  s0725: [
    'On day bingchen, last year\'s drought quota land tax was remitted for seven Zhejiang guards, prefectures, and garrisons including Yongjia.',
    'On bingchen day, seven Zhejiang units including Yongjia were excused last year\'s drought taxes.',
  ],
  s0726: [
    'Flood relief was distributed for Fujian counties including Ninghua.',
    'Fujian flood relief reached counties including Ninghua.',
  ],
  s0727: [
    'On day gengshen, Burma presented tribute.',
    'On gengshen day, Burma sent tribute.',
  ],
  s0728: [
    'On day xinyou, flood quota land tax was remitted for twenty-five Anhui prefectures and counties including Shouzhou.',
    'On xinyou day, flood taxes were remitted in twenty-five Anhui districts including Shouzhou.',
  ],
  s0729: [
    'On day jiazi, Butuxun Lintegusi of the Dzungar tribes came to surrender.',
    'On jiazi day, the Dzungar Butuxun Lintegusi submitted.',
  ],
  s0730: [
    'Autumn, seventh month, day gengwu: flood relief was distributed for Fujian counties including Guihua.',
    'In the seventh month, Fujian flood relief reached districts including Guihua.',
  ],
  s0731: [
    'On day renshen, the Emperor, accompanying the Empress Dowager, conducted the autumn hunt at Mulan.',
    'On renshen day, the court hunted at Mulan with the Empress Dowager.',
  ],
  s0732: [
    'On day wuyin, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On wuyin day, the court halted at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0733: [
    'On day jimao, thirteen embankments of the Yellow River burst at Yangwu in Henan.',
    'On jimao day, the Yellow River breached thirteen Yangwu embankments in Henan.',
  ],
  s0734: [
    'On day gengchen, the Emperor, accompanying the Empress Dowager, toured Mulan and conducted a hunting encirclement.',
    'On gengchen day, the court toured Mulan and held a battue with the Empress Dowager.',
  ],
  s0735: [
    'On day yimao, hail-disaster quota land tax was remitted for Shanxi Qingshuihe subprefecture.',
    'On yimao day, Qingshuihe subprefecture received hail tax relief.',
  ],
  s0736: [
    'On day bingxu, flood relief was distributed for Shaanxi Chaoyi county.',
    'On bingxu day, Shaanxi Chaoyi received flood relief.',
  ],
  s0737: [
    'On day jichou, flood relief was distributed for Shandong prefectures and counties including Pingdu.',
    'On jichou day, Shandong flood relief reached districts including Pingdu.',
  ],
  s0738: [
    'On day renchen, flood relief was distributed for nine Shanxi counties including Fengtai.',
    'On renchen day, nine Shanxi counties including Fengtai received flood relief.',
  ],
  s0739: [
    'Eighth month, day yiwei: drought relief was distributed for sixty-five Zhejiang prefectures, counties, guards, garrisons, and salterns including Haining and Dasong.',
    'In the eighth month, Zhejiang drought relief reached sixty-five units including Haining and Dasong.',
  ],
  s0740: [
    'Drought relief was distributed for seven drought-stricken Jiangxi counties including Shangrao.',
    'Jiangxi drought relief reached seven counties including Shangrao.',
  ],
  s0741: [
    'Drought relief was distributed for Hubei Tianmen.',
    'Hubei Tianmen received drought relief.',
  ],
  s0742: [
    'On day bingchen, Chen Zufan and Gu Donggao were granted the rank of vice director of the Imperial College.',
    'On bingchen day, Chen Zufan and Gu Donggao became Imperial College vice directors.',
  ],
  s0743: [
    'On day wuxu, because Shuose exposed a forged memorial in Sun Jiagan\'s name with a counterfeit vermillion comment, Fang Guancheng and others were ordered to arrest the culprits secretly.',
    'On wuxu day, Shuose exposed a forged Sun Jiagan memorial and Fang Guancheng was told to seize the forgers in secret.',
  ],
  s0744: [
    'On day jiyou, the Emperor, accompanying the Empress Dowager, returned to lodge at the Mountain Resort for Avoiding Summer Heat.',
    'On jiyou day, the court returned to the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0745: [
    'On day xinhai, repair was ordered for the tombs of Jin Taizu and Shizong in Fangshan county.',
    'On xinhai day, the Jin Taizu and Shizong tombs at Fangshan were ordered restored.',
  ],
  s0746: [
    'On day dingsi, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On dingsi day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0747: [
    'On day jiwei, flood relief was distributed for fourteen Henan counties including Shangqiu.',
    'On jiwei day, fourteen Henan counties including Shangqiu received flood relief.',
  ],
  s0748: [
    'On day gengyin, Zhuntai was stripped of office and arrested for concealing the forged memorial.',
    'On gengyin day, Zhuntai was dismissed and arrested for hiding the forgery.',
  ],
  s0749: [
    'E Rong\'an was transferred to be Shandong governor, Shulu to be Henan governor, Echang to be Jiangxi governor, and Yang Yingju to be Gansu governor.',
    'E Rong\'an, Shulu, Echang, and Yang Yingju became governors of Shandong, Henan, Jiangxi, and Gansu.',
  ],
  s0750: [
    'Gao Bin was ordered to proceed to Henan to manage Yangwu river works.',
    'Gao Bin was sent to Henan for Yangwu river works.',
  ],
  s0751: [
    'On day xinyou, Zhuang Yougong was made Jiangsu governor.',
    'On xinyou day, Zhuang Yougong became Jiangsu governor.',
  ],
  s0752: [
    'On day guihai, hail-disaster quota land tax was remitted for five Gansu prefectures and counties including Pingliang.',
    'On guihai day, five Gansu districts including Pingliang received hail tax relief.',
  ],
  s0753: [
    'On day yichou, grace provincial examinations in all provinces were fixed for the second month of the coming year.',
    'On yichou day, the court set grace provincial exams for next year\'s second month.',
  ],
  s0754: [
    'An edict halted autumn executions for the year.',
    'Autumn executions were suspended for the year.',
  ],
  s0755: [
    'On day guiyou, flood relief was distributed for fifty-three Shandong prefectures and counties including Zouping.',
    'On guiyou day, fifty-three Shandong districts including Zouping received flood relief.',
  ],
  s0756: [
    'On day bingzi, the Emperor, accompanying the Empress Dowager, proceeded to Tailing.',
    'On bingzi day, the court went to Tailing with the Empress Dowager.',
  ],
  s0757: [
    'On day dingchou, flood relief was distributed for two Fujian counties including Fu\'an.',
    'On dingchou day, two Fujian counties including Fu\'an received flood relief.',
  ],
  s0758: [
    'On day gengchen, the Emperor, accompanying the Empress Dowager, performed rites at Tailing.',
    'On gengchen day, the court worshipped at Tailing with the Empress Dowager.',
  ],
  s0759: [
    'That day, the court returned from the tour.',
    'That day, the court returned from the journey.',
  ],
  s0760: [
    'On day jiashen, Shuhede was ordered to proceed to Jiangnan to investigate the forged Sun Jiagan memorial case.',
    'On jiashen day, Shuhede was sent to Jiangnan to investigate the forged Sun Jiagan memorial.',
  ],
  s0761: [
    'On day gengyin, Chen Shiguang was ordered to administer the Board of Rites concurrently.',
    'On gengyin day, Chen Shiguang took concurrent charge of Rites.',
  ],
  s0762: [
    'Liangguang Governor-General Chen Dashou died; Aligun was transferred to replace him, and Yongchang was made Huguang governor-general.',
    'Chen Dashou died; Aligun succeeded him at Liangguang and Yongchang became Huguang governor-general.',
  ],
  s0763: [
    'On day xinmao, flood relief was distributed for Henan prefectures and counties including Shangcai.',
    'On xinmao day, Henan flood relief reached districts including Shangcai.',
  ],
  s0764: [
    'On day guisi, tidal-disaster relief was distributed for four Fujian counties including Xiapu.',
    'On guisi day, four Fujian counties including Xiapu received tidal relief.',
  ],
  s0765: [
    'Winter, tenth month, day wuxu: Fan Shishou was made acting Hunan governor.',
    'In the tenth month, Fan Shishou became acting Hunan governor.',
  ],
  s0766: [
    'On day renyin, flood relief was distributed for seven Changlu salterns including Fuguo and three Shandong salterns including Wangjiagang.',
    'On renyin day, flood relief reached Changlu and Shandong salterns including Fuguo and Wangjiagang.',
  ],
  s0767: [
    'On day jiayin, drought relief was distributed for eighteen Anhui prefectures and guards including She county.',
    'On jiayin day, eighteen Anhui units including She county received drought relief.',
  ],
  s0768: [
    'On day bingchen, flood relief was distributed for eight Jiangsu prefectures and counties including Tongshan.',
    'On bingchen day, eight Jiangsu districts including Tongshan received flood relief.',
  ],
  s0769: [
    'Chen Hongmou was transferred to be Henan governor, and Shulu to be Shaanxi governor.',
    'Chen Hongmou became Henan governor and Shulu Shaanxi governor.',
  ],
  s0770: [
    'Flood relief was distributed for this year\'s floods in seven Shandong prefectures and counties including Qidong, and for hail disaster in Rongcheng county.',
    'Shandong flood relief reached seven districts including Qidong, and Rongcheng received hail relief.',
  ],
  s0771: [
    'On day wuwu, flood and hail relief was distributed for twenty-six Zhili prefectures and counties including Wuqing.',
    'On wuwu day, twenty-six Zhili districts including Wuqing received flood and hail relief.',
  ],
  s0772: [
    'On day guihai, tidal-disaster relief was distributed for two Shandong Guantai saltern furnaces.',
    'On guihai day, two Guantai salterns received tidal relief.',
  ],
  s0773: [
    'Eleventh month, day jiaxu: flood relief was distributed for five Henan counties including Xiangfu.',
    'In the eleventh month, five Henan counties including Xiangfu received flood relief.',
  ],
  s0774: [
    'On day yihai, flood relief was distributed for three Zhili prefectures and counties including Dongming on account of this year\'s flood.',
    'On yihai day, three Zhili districts including Dongming received this year\'s flood relief.',
  ],
  s0775: [
    'On day gengchen, the Yangwu breach was closed.',
    'On gengchen day, the Yangwu river breach was sealed.',
  ],
  s0776: [
    'On day yiyou, for the Empress Dowager\'s sixtieth birthday, the Emperor gave her the honorific title Empress Dowager Chongqing Cixuan Kanghui Dunhe You Shou, and issued an edict of grace with differentiated favors.',
    'On yiyou day, the Empress Dowager received the honorific Chongqing Cixuan Kanghui Dunhe You Shou and a grace edict was promulgated.',
  ],
  s0777: [
    'On day bingxu, Gao Bin and Wang Youdun were ordered jointly to survey Tianjin river works.',
    'On bingxu day, Gao Bin and Wang Youdun were sent to inspect Tianjin river works.',
  ],
  s0778: [
    'On day wuzi, the Empress Dowager\'s birthday: the Emperor, accompanying her, went to Cining Palace, and led princes and grand ministers in congratulatory rites.',
    'On wuzi day, the court celebrated the Empress Dowager\'s birthday at Cining Palace.',
  ],
  s0779: [
    'Twelfth month, new moon on day guisi: Uleden was made campaign assistant commissioner for the Northern Route army camp.',
    'On the twelfth-month new moon of guisi, Uleden became Northern Route campaign assistant.',
  ],
  s0780: [
    'On day dingyou, the Yongding River diversion channel was dredged.',
    'On dingyou day, the Yongding diversion channel was dredged.',
  ],
  s0781: [
    'On day wuxu, flood relief was distributed for this year\'s flood in Jilin Hunchun.',
    'On wuxu day, Jilin Hunchun received this year\'s flood relief.',
  ],
  s0782: [
    'On day gengzi, flood relief was distributed for fifty-five Shandong prefectures and counties including Zouping.',
    'On gengzi day, fifty-five Shandong districts including Zouping received flood relief.',
  ],
  s0783: [
    'On day renyin, Yarhashan was made Zhejiang governor.',
    'On renyin day, Yarhashan became Zhejiang governor.',
  ],
  s0784: [
    'On day jiachen, the north and south transport relief canals of Zhili were dredged.',
    'On jiachen day, Zhili\'s north and south transport relief canals were dredged.',
  ],
  s0785: [
    'Duo\'erji was ordered to replace Bandi in overseeing Tibetan affairs.',
    'Duo\'erji replaced Bandi in Tibet.',
  ],
  s0786: [
    'On day xinhai, drought and locust relief was distributed for sixty Zhejiang prefectures, counties, guards, garrisons, and salterns including Yin county and eight salterns including Dasong.',
    'On xinhai day, Zhejiang drought and locust relief reached sixty units including Yin county and Dasong.',
  ],
  s0787: [
    'Seventeenth year, spring, first month, day yihai: a banquet was granted to Dzungar envoy Tubuqirhalang and others.',
    'In the seventeenth year\'s first month, Tubuqirhalang and other Dzungar envoys were feasted.',
  ],
  s0788: [
    'On day gengxu, a chief steward of the Imperial Household at Mukden was established, to be held concurrently by the general.',
    'On gengxu day, a Mukden Imperial Household chief steward was created, held by the general.',
  ],
  s0789: [
    'On day jiashen, because Dawachi and Amursana of the Dzungars were at feud, troops were increased at the Altay frontier passes.',
    'On jiashen day, Altay garrisons were reinforced over the Dawachi–Amursana feud.',
  ],
  s0790: [
    'Shuhede and Yubao were ordered to inspect the Northern Route army camp.',
    'Shuhede and Yubao were sent to review the Northern Route camp.',
  ],
  s0791: [
    'On day bingxu, Abachi and Daqing\'a were made Northern Route campaign assistant commissioners.',
    'On bingxu day, Abachi and Daqing\'a became Northern Route campaign assistants.',
  ],
  s0792: [
    'On day dinghai, relief was distributed for disaster-stricken poor in six Jiangsu prefectures and counties including Tongshan and nine Anhui prefectures and counties including She county.',
    'On dinghai day, poor victims in Jiangsu and Anhui districts including Tongshan and She county were relieved.',
  ],
  s0793: [
    'On day xinmao, the lower mouth of the Yongding River in Zhili and the Feng embankment were repaired.',
    'On xinmao day, Zhili repaired the Yongding outlet and Feng dike.',
  ],
  s0794: [
    'Second month, day yiwei: Zhong Yin was made Shaanxi governor.',
    'In the second month, Zhong Yin became Shaanxi governor.',
  ],
  s0795: [
    'On day jihai, Zhuntai was released.',
    'On jihai day, Zhuntai was pardoned.',
  ],
  s0796: [
    'On day jiayin, the Emperor proceeded to the Eastern Tombs.',
    'On jiayin day, the Emperor went to the Eastern Tombs.',
  ],
  s0797: [
    'On day bingchen, the Bhutanese erdini Diba presented local products.',
    'On bingchen day, Bhutan\'s erdini Diba sent tribute goods.',
  ],
  s0798: [
    'On day dingsi, the Emperor paid respects at Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On dingsi day, the Emperor worshipped at Zhaoxi, Xiaoling, Xiaodongling, and Jingling.',
  ],
  s0799: [
    'On day wuwu, the Emperor halted at Pan Mountain.',
    'On wuwu day, the court halted at Pan Mountain.',
  ],
  s0800: [
    'On day jiwei, relief was distributed for disaster-stricken poor in Shanxi Shanyin and Yuxiang.',
    'On jiwei day, poor victims in Shanxi Shanyin and Yuxiang were relieved.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b08.mjs <translation.json>'
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
