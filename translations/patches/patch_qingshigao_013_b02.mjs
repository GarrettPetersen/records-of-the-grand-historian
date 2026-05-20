#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day yiyou, Zhong Yin was made Guangdong governor.',
    'On yiyou, Zhong Yin became Guangdong governor.',
  ],
  s0102: [
    'On day yichou, Ming Rui was instructed that Eledeng\'e would replace Tan Wuge for advancing troops by separate routes.',
    'On yichou, Ming Rui was told Eledeng\'e would replace Tan Wuge on a separate route.',
  ],
  s0103: [
    'Ninth month, day gengzi: relief was given for flood disaster in twenty-seven Hubei counties including Jiangxia and seven guards including Wuchang.',
    'In month 9, gengzi, twenty-seven Hubei counties and seven guards received flood relief.',
  ],
  s0104: [
    'On day jiayin, Toenduo was ordered to act as Minister of War.',
    'On jiayin, Toenduo acted as Minister of War.',
  ],
  s0105: [
    'Winter, tenth month, day renxu: Li Yinpei was granted permission to take his own life.',
    'In month 10, renxu, Li Yinpei was ordered to commit suicide.',
  ],
  s0106: [
    'On day jimao, Ming Rui was instructed to combine general and governor-general duties.',
    'On jimao, Ming Rui was told to hold both general and governor-general posts.',
  ],
  s0107: [
    'Eleventh month, day renyin: relief was given to the people of thirty-four Gansu prefectures, departments, and counties including Pingliang for hail disaster.',
    'In month 11, renyin, thirty-four Gansu hail districts including Pingliang were relieved.',
  ],
  s0108: [
    'On day renzi, E Bao was transferred to Hubei governor.',
    'On renzi, E Bao became Hubei governor.',
  ],
  s0109: [
    'On day dingsi, a secret edict instructed Ming Rui that Ava could not be taken quickly and to withdraw the army to Mubang.',
    'On dingsi, Ming Rui was secretly told Ava would not fall soon and to pull back to Mubang.',
  ],
  s0110: [
    'Twelfth month, day jiaxu: Yang Ning was stripped of office and banished to serve at Yili.',
    'In month 12, jiaxu, Yang Ning lost his post and was exiled to Yili.',
  ],
  s0111: [
    'On day wuyin, Ming Rui memorialized crossing the Dadies River and advancing on Xibo; the tusi headmen Luo Waiyao and others of Bolong and elsewhere came over.',
    'On wuyin, Ming Rui crossed the Dadies and marched on Xibo; Bolong chiefs including Luo Waiyao submitted.',
  ],
  s0112: [
    'Thirty-third year, spring, first month, day xinmao: Ming Rui memorialized the capture of Manjie.',
    'In year 33, month 1, xinmao, Ming Rui reported Manjie taken.',
  ],
  s0113: [
    'On day renchen, Ming Rui was enfeoffed as first-rank Duke of Sincere Valor and Courageous Merit, and granted yellow belt, ruby finial, and four-round-dragon rank robe.',
    'On renchen, Ming Rui became Duke of Sincere Valor and Courageous Merit with yellow belt, ruby finial, and four-dragon robe.',
  ],
  s0114: [
    'On day dingyou, Ming Rui advanced the army to Song Sai.',
    'On dingyou, Ming Rui marched on Song Sai.',
  ],
  s0115: [
    'On day gengzi, Zhang Bao was transferred to Shandong governor; Su Erde was made Shanxi governor.',
    'On gengzi, Zhang Bao took Shandong; Su Erde, Shanxi.',
  ],
  s0116: [
    'On day bingwu, Mukden general Xinzhu died; Ming Fu was transferred to replace him.',
    'On bingwu, Xinzhu died; Ming Fu became Mukden general.',
  ],
  s0117: [
    'Fujian-Zhejiang governor-general Su Chang died.',
    'Su Chang, Fujian-Zhejiang governor-general, died.',
  ],
  s0118: [
    'On day dingwei, Arigun was ordered to serve as campaigning assistant commissioner and go to the Yunnan army camp.',
    'On dingwei, Arigun was sent as expedition adviser to Yunnan.',
  ],
  s0119: [
    'Cui Yingjie was made Fujian-Zhejiang governor-general; Funihan Fujian governor.',
    'Cui Yingjie took Fujian-Zhejiang; Funihan, Fujian.',
  ],
  s0120: [
    'On day jiayin, the Burmese besieged Mubang.',
    'On jiayin, Burmese forces besieged Mubang.',
  ],
  s0121: [
    'Second month, day bingyin: an edict on the Burma campaign blamed underestimating the enemy for setbacks, took the fault on himself, and ordered Ming Rui and others to withdraw the army.',
    'In month 2, bingyin, Hongli blamed himself for underestimating Burma and ordered Ming Rui to withdraw.',
  ],
  s0122: [
    'Eledeng\'e and Tan Wuge were stripped of office and arrested for trial.',
    'Eledeng\'e and Tan Wuge were dismissed and arrested.',
  ],
  s0123: [
    'E Ning was ordered back to Yunnan; Arigun acted as Yunnan-Guizhou governor-general, stationed at Yongchang.',
    'E Ning returned to Yunnan; Arigun acted as Yunnan-Guizhou governor at Yongchang.',
  ],
  s0124: [
    'The Burmese took Mubang; Zhulune died in the fighting.',
    'Burmese forces took Mubang; Zhulune was killed.',
  ],
  s0125: [
    'On day wuyin, the Emperor returned to the Old Summer Palace.',
    'On wuyin, Hongli returned to Yuanmingyuan.',
  ],
  s0126: [
    'On day bingxu, Ming Rui and others were defeated at Mengyu and died.',
    'On bingxu, Ming Rui\'s force was defeated at Mengyu; he died.',
  ],
  s0127: [
    'Agui was summoned to the capital; Yiletuo acted as Yili general.',
    'Agui was recalled to Beijing; Yiletuo acted as Yili general.',
  ],
  s0128: [
    'Fu Heng was ordered as campaign commander-in-chief; Arigun and Agui as deputy generals; Suhede as assistant commissioner—all to go to Yunnan.',
    'Fu Heng became commander-in-chief; Arigun and Agui, deputy generals; Suhede, adviser—all for Yunnan.',
  ],
  s0129: [
    'E Ning was made Yunnan-Guizhou governor-general; Mingde was transferred to Yunnan governor.',
    'E Ning became Yunnan-Guizhou governor-general; Mingde, Yunnan governor.',
  ],
  s0130: [
    'Fu Long\'an was made Minister of War and ordered to study and serve at the Grand Council.',
    'Fu Long\'an became Minister of War and joined the Grand Council as trainee.',
  ],
  s0131: [
    'Yongde was made Zhejiang governor; Zhang Bao transferred to Jiangsu governor; Funihan Shandong governor; E Bao Fujian governor; Cheng Tao Hubei governor.',
    'Yongde took Zhejiang; Zhang Bao, Jiangsu; Funihan, Shandong; E Bao, Fujian; Cheng Tao, Hubei.',
  ],
  s0132: [
    'Third month, day guisi: quota taxes were remitted for the thirty-second year of flood in three Shandong counties including Gaoyuan.',
    'In month 3, guisi, three Shandong flood counties including Gaoyuan lost year-32 taxes.',
  ],
  s0133: [
    'On day yisi, E Bao was transferred to Guangxi governor; Zhong Yin Fujian governor; Liangqing Guangdong governor; Qian Du Guizhou governor; Balu Chahar commander; Fu Liang Suiyuan general.',
    'On yisi, E Bao took Guangxi; Zhong Yin, Fujian; Liangqing, Guangdong; Qian Du, Guizhou; Balu, Chahar; Fu Liang, Suiyuan.',
  ],
  s0134: [
    'On day guichou, quota taxes were remitted for the thirty-second year of flood in thirteen Jiangxi counties including Nanchang.',
    'On guichou, thirteen Jiangxi flood counties lost year-32 taxes.',
  ],
  s0135: [
    'Summer, fourth month, day dingmao: Qian Du was transferred to Guangdong governor.',
    'In month 4, dingmao, Qian Du became Guangdong governor.',
  ],
  s0136: [
    'On day jisi, quota taxes were remitted for the thirty-second year of flood in seven Anhui prefectures and departments including Anqing and their subordinate districts.',
    'On jisi, seven Anhui flood prefectures lost year-32 taxes.',
  ],
  s0137: [
    'On day renshen, the Emperor held the palace examination for Hanlin Academy, Household Administration of the Heir Apparent, and other officials; Wu Shengqin and two others were promoted first class; the rest promoted or demoted variously.',
    'On renshen, Hongli examined Hanlin and related officials; Wu Shengqin and two others took first place.',
  ],
  s0138: [
    'Officials entering the Hanlin from boards and courts were examined; Jueluo Bayanxue was promoted first class; the rest promoted variously.',
    'Board entrants to the Hanlin were examined; Jueluo Bayanxue took first place.',
  ],
  s0139: [
    'On day jiashen, Eledeng\'e was dismembered at the market; Tan Wuge was executed.',
    'On jiashen, Eledeng\'e was executed by lingchi; Tan Wuge beheaded.',
  ],
  s0140: [
    'On day yiyou, the Emperor went in person to offer mourning for Ming Rui, Zhala Feng\'a, and Guanyinbao.',
    'On yiyou, Hongli mourned Ming Rui, Zhala Feng\'a, and Guanyinbao.',
  ],
  s0141: [
    'Fifth month, day gengshen: Mingde was ordered to go to Yongchang.',
    'In month 5, gengshen, Mingde was sent to Yongchang.',
  ],
  s0142: [
    'On day yichou, Sebten Balzhur was excused on grounds of illness; Yiletuo was made Minister of the Court of Colonial Affairs.',
    'On yichou, sick Sebten Balzhur left office; Yiletuo became colonial affairs minister.',
  ],
  s0143: [
    'On day gengwu, Guanbao was instead ordered to act as Minister of the Court of Colonial Affairs.',
    'On gengwu, Guanbao acted as colonial affairs minister instead.',
  ],
  s0144: [
    'On day xinsi, Fan Shishou was made Left Censor-in-Chief.',
    'On xinsi, Fan Shishou became Left Censor-in-Chief.',
  ],
  s0145: [
    'On day renwu, Agui was made Yunnan-Guizhou governor-general.',
    'On renwu, Agui became Yunnan-Guizhou governor-general.',
  ],
  s0146: [
    'Yin Jishan and Gao Jin, for concealing long-standing abuses in the Lianghuai salt administration and not reporting them, were both referred to the ministry for severe deliberation.',
    'Yin Jishan and Gao Jin faced severe ministry review for hiding Lianghuai salt abuses.',
  ],
  s0147: [
    'Autumn, seventh month, day guisi: the Emperor, escorting the Empress Dowager, went on the autumn hunt at Mulan.',
    'In month 7, guisi, Hongli and the Empress Dowager left for the Mulan autumn hunt.',
  ],
  s0148: [
    'On day jiawu, Tuoyong was transferred to Minister of War.',
    'On jiawu, Tuoyong became Minister of War.',
  ],
  s0149: [
    'Guanbao was made Minister of Punishments and still concurrently acted as Minister of the Court of Colonial Affairs.',
    'Guanbao became Punishments minister and still acted at colonial affairs.',
  ],
  s0150: [
    'On day jihai, the Emperor, escorting the Empress Dowager, lodged at the Mountain Resort for Escaping the Heat.',
    'On jihai, Hongli and the Empress Dowager stayed at the Summer Resort.',
  ],
  s0151: [
    'On day xinchou, Yinletu was made Yili general, still concurrently Minister of the Court of Colonial Affairs.',
    'On xinchou, Yinletu became Yili general and still held colonial affairs.',
  ],
  s0152: [
    'On day renzi, Ji Yun, for leaking the secret edict on former transport commissioner Lu Jianzeng\'s confiscation, was stripped of office and banished to Urumqi.',
    'On renzi, Ji Yun was dismissed and exiled to Urumqi for leaking Lu Jianzeng\'s confiscation edict.',
  ],
  s0153: [
    'Eighth month, day dingmao: Russia was permitted to trade at Kiakhta.',
    'In month 8, dingmao, Russia was allowed trade at Kiakhta.',
  ],
  s0154: [
    'On day xinwei, the Emperor went to Mulan for the hunt enclosure.',
    'On xinwei, Hongli hunted at Mulan.',
  ],
  s0155: [
    'On day renshen, Zhili governor-general Fang Guancheng died; Yang Tingzhang replaced him.',
    'On renshen, Fang Guancheng died; Yang Tingzhang became Zhili governor-general.',
  ],
  s0156: [
    'Qiu Yixiu was transferred to Minister of Punishments; Cai Xin was made Minister of Works.',
    'Qiu Yixiu took Punishments; Cai Xin, Works.',
  ],
  s0157: [
    'On day jiaxu, Li Shiyao memorialized that Siam had been broken by the Burmese; the king\'s grandson Zhao Cui fled to Ha Tien in Annam, where native official Mo Shilin sheltered him; the mainland man Gan Endi held Siam and begged to be enfeoffed.',
    'On jiaxu, Li Shiyao reported Burma had broken Siam; the royal grandson Zhao Cui fled to Ha Tien; Gan Endi seized Siam and sought a title.',
  ],
  s0158: [
    'Mo Shilin was commended; Gan Endi was ordered to find a near collateral of the former ruler to install and not seek a kingship for himself.',
    'Mo Shilin was praised; Gan Endi was told to restore a legitimate Siam ruler, not crown himself.',
  ],
  s0159: [
    'On day jimao, Toenduo, Yu Minzhong, and Cui Yingjie were promoted to Grand Guardian of the Heir Apparent; Tuoyong and Yang Tingzhang to Junior Guardian.',
    'On jimao, three became grand guardians of the heir; Tuoyong and Yang Tingzhang, junior guardians.',
  ],
  s0160: [
    'Ninth month, day wuzi: Songchun acted as Yili general.',
    'In month 9, wuzi, Songchun acted as Yili general.',
  ],
  s0161: [
    'On day yiwei, the Emperor returned to lodge at the Mountain Resort.',
    'On yiwei, Hongli returned to the Summer Resort.',
  ],
  s0162: [
    'On day wuxu, Gao Heng and Pufu were sentenced to decapitation.',
    'On wuxu, Gao Heng and Pufu were sentenced to death.',
  ],
  s0163: [
    'On day dingwei, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On dingwei, Hongli and the Empress Dowager returned to Beijing.',
  ],
  s0164: [
    'E Bao was made Shanxi governor.',
    'E Bao became Shanxi governor.',
  ],
  s0165: [
    'Heilongjiang general Fuseng\'a was transferred to Xi\'an general; Fu Yu replaced him.',
    'Fuseng\'a moved from Heilongjiang to Xi\'an; Fu Yu took Heilongjiang.',
  ],
  s0166: [
    'Winter, tenth month, day jiwei: quota taxes were remitted for the thirty-second year of disaster in twelve Gansu prefectures and counties including Pingliang.',
    'In month 10, jiwei, twelve Gansu disaster districts including Pingliang lost year-32 taxes.',
  ],
  s0167: [
    'On day xinwei, Gong Zhaolin was made Guangxi governor.',
    'On xinwei, Gong Zhaolin became Guangxi governor.',
  ],
  s0168: [
    'On day xinsi, Gao Heng, Pufu, and Dase were executed; Haiming and others were changed to suspended sentences.',
    'On xinsi, Gao Heng, Pufu, and Dase were executed; Haiming\'s party got reprieves.',
  ],
  s0169: [
    'Eleventh month, day wuxu: because the Burmese letter was disrespectful, Arigun was instructed to plan an advance and suppression.',
    'In month 11, wuxu, a rude Burmese letter sent Arigun to plan a new campaign.',
  ],
  s0170: [
    'Twelfth month, day jiwei: Fu Ming\'an was made Shandong governor; Kuaiyi acted as Hubei governor.',
    'In month 12, jiwei, Fu Ming\'an took Shandong; Kuaiyi acted at Hubei.',
  ],
  s0171: [
    'Canal Transport Governor-General Yang Xizhen died; Liang Zhuhong acted in the post.',
    'Yang Xizhen died; Liang Zhuhong acted as canal commissioner.',
  ],
  s0172: [
    'On day yichou, Huguang governor-general Ding Chang died; Wu Dashan was transferred to replace him; Zhang Bao concurrently acted as Liangjiang governor-general; Mingshan was made Shaanxi-Gansu governor-general.',
    'On yichou, Ding Chang died; Wu Dashan took Huguang; Zhang Bao acted at Liangjiang; Mingshan, Shaanxi-Gansu.',
  ],
  s0173: [
    'Asiha was transferred to Shaanxi governor; Wen Shou was made Henan governor.',
    'Asiha took Shaanxi; Wen Shou, Henan.',
  ],
  s0174: [
    'On day dingmao, Ming Fu was summoned to the capital; Erdeni Meng\'e acted as Mukden general.',
    'On dingmao, Ming Fu was recalled; Erdeni Meng\'e acted as Mukden general.',
  ],
  s0175: [
    'On day jiaxu, relief was given for flood disaster in four Fengtian prefectures and counties including Chengde.',
    'On jiaxu, four Fengtian flood districts including Chengde were relieved.',
  ],
  s0176: [
    'On day renwu, Asiha was kept as Henan governor; Wen Shou was changed to Shaanxi governor.',
    'On renwu, Asiha stayed at Henan; Wen Shou moved to Shaanxi.',
  ],
  s0177: [
    'Thirty-fourth year, spring, first month, day bingxu: quota taxes were remitted for this year in places passed through by Yunnan troops and three prefectures and departments including Yongchang.',
    'In year 34, month 1, bingxu, Yunnan march routes and three Yongchang-area prefectures lost this year\'s taxes.',
  ],
  s0178: [
    'Where troops did not pass, five-tenths were remitted; in Hubei, Hunan, and Guizhou places troops passed through, three-tenths of this year\'s quota taxes were remitted.',
    'Non-route districts lost half their taxes; Hubei, Hunan, and Guizhou march routes lost three-tenths.',
  ],
  s0179: [
    'On day gengyin, because the Burmese letter was arrogant, Deputy General Agui and Deputy General Arigun were ordered to assist Fu Heng in the punitive campaign.',
    'On gengyin, an arrogant Burmese letter put Agui and Arigun under Fu Heng for the campaign.',
  ],
  s0180: [
    'On day xinmao, Mingde was ordered as Yunnan-Guizhou governor-general, stationed at Yongchang; Kaning\'a Yunnan governor.',
    'On xinmao, Mingde became Yunnan-Guizhou governor at Yongchang; Kaning\'a, Yunnan governor.',
  ],
  s0181: [
    'On day renchen, Arigun and others defeated the Burmese at Nandi Dam.',
    'On renchen, Arigun routed the Burmese at Nandi Dam.',
  ],
  s0182: [
    'Two hundred thousand shi of grain from the Tong warehouse were allocated to relieve disaster in twelve prefectures and counties including Bazhou.',
    'Two hundred thousand shi from Tong granary relieved twelve districts including Bazhou.',
  ],
  s0183: [
    'On day jiawu, Zholqi and others, sons of Alibis of the Right Wing Kazakh, came to court.',
    'On jiawu, Right Wing Kazakh Alibis\'s sons Zholqi and others paid court.',
  ],
  s0184: [
    'On day yiwei, Henglu was transferred to Mukden general; Fu Liang Jilin general; Changzai Suiyuan general.',
    'On yiwei, Henglu took Mukden; Fu Liang, Jilin; Changzai, Suiyuan.',
  ],
  s0185: [
    'On day xinchou, Fu Heng went to Yunnan.',
    'On xinchou, Fu Heng left for Yunnan.',
  ],
  s0186: [
    'Guanbao was ordered to act as Minister of Revenue.',
    'Guanbao acted as Revenue minister.',
  ],
  s0187: [
    'The Ningxia Right Wing vice commander and Jilin Lalin vice commander posts were abolished.',
    'Ningxia Right Wing and Jilin Lalin vice commander posts were cut.',
  ],
  s0188: [
    'Changqing was ordered to act as Suiyuan general.',
    'Changqing acted as Suiyuan general.',
  ],
  s0189: [
    'On day guimao, Fu Heng was granted imperial campaign armor.',
    'On guimao, Fu Heng received imperial armor.',
  ],
  s0190: [
    'On day wushen, Guanbao was ordered to assist as Grand Secretary; Fu Long\'an acted as Minister of Punishments.',
    'On wushen, Guanbao became associate grand secretary; Fu Long\'an acted at Punishments.',
  ],
  s0191: [
    'On day guichou, because the king of Lan Xang\'s younger brother Zhao Weng sent envoys requesting troops for revenge, Agui and others were instructed to prepare to advance by separate routes through Lan Xang.',
    'On guichou, Lan Xang\'s prince Zhao Weng sought aid; Agui was told to prepare a southern route.',
  ],
  s0192: [
    'Second month, new moon on day jiayin: Ji Huang was demoted and transferred over an affair; Cheng Jingyi was made Minister of Works.',
    'On the second-month new moon, Ji Huang was demoted; Cheng Jingyi took Works.',
  ],
  s0193: [
    'On day yichou, Funihan was made Anhui governor.',
    'On yichou, Funihan became Anhui governor.',
  ],
  s0194: [
    'On day guiwei, Fu Heng was ordered to put Yunnan horse administration in order.',
    'On guiwei, Fu Heng was told to reform Yunnan horse affairs.',
  ],
  s0195: [
    'Nuolun was made Suiyuan general.',
    'Nuolun became Suiyuan general.',
  ],
  s0196: [
    'Third month, day yiyou: Yili general Yiletuo was ordered to the Yunnan army camp.',
    'In month 3, yiyou, Yili general Yiletuo was sent to Yunnan.',
  ],
  s0197: [
    'On day jichou, Yirtu was ordered as Urga campaigning assistant commissioner.',
    'On jichou, Yirtu became Urga expedition adviser.',
  ],
  s0198: [
    'On day xinchou, Plain White Banner chief imperial bodyguard minister Fulu was dismissed; Agui replaced him.',
    'On xinchou, Fulu left the inner guard; Agui replaced him.',
  ],
  s0199: [
    'On day bingwu, Agui was ordered to act as Yunnan-Guizhou governor-general.',
    'On bingwu, Agui acted as Yunnan-Guizhou governor-general.',
  ],
  s0200: [
    'On day dingwei, Orizuletong and others of the Right Wing Kazakh came to audience; they were ordered seated, granted tea, and given graded robes and caps.',
    'On dingwei, Right Wing Kazakh Orizuletong\'s party was received, seated for tea, and given graded dress.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b02.mjs <translation.json>'
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
