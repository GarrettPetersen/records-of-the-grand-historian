#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'That month, granary grain was again issued for the Jiangsu Yangzhou flood disaster.',
    'That month Yangzhou flood victims in Jiangsu received more granary grain.',
  ],
  s0102: [
    'Fifth month, day dingwei: Fujian land and naval camps and Zhejiang cavalry and infantry were reduced by varying amounts.',
    'In month 5, dingwei, Fujian and Zhejiang troop strengths were cut by degrees.',
  ],
  s0103: [
    'On day renzi, because Zhao Jinlong was already killed and the remaining bandits were all pacified, Lu Kun and Luo Siju were awarded double peacock feathers and hereditary first-class Commandant of Light Chariots, and Hunan Provincial Military Commander Yu Buyun was advanced to Junior Guardian of the Heir Apparent.',
    'On renzi, with Zhao Jinlong dead and rebels pacified, Lu Kun and Luo Siju won peacock plumes and hereditary ranks, and Yu Buyun became Junior Guardian of the Heir Apparent.',
  ],
  s0104: [
    'On day yimao, the teaching-bandit Yin Laoxu and others were executed.',
    'On yimao Yin Laoxu and other sect rebels were executed.',
  ],
  s0105: [
    'On day gengshen, the Emperor prayed for rain at the Black Dragon Pool shrine.',
    'On gengshen the Emperor prayed for rain at the Black Dragon Pool shrine.',
  ],
  s0106: [
    'On day wuchen, the Emperor went to the Altar of the Heavenly Spirit to pray for rain.',
    'On wuchen the Emperor prayed for rain at the Heavenly Spirit Altar.',
  ],
  s0107: [
    'On day jisi, an edict ordered the Ministry of Punishments to clear ordinary prison cases.',
    'On jisi punishments was ordered to clear routine prison cases.',
  ],
  s0108: [
    'That month, granary grain was lent to soldiers and civilians suffering disaster in three Shanxi counties including Datong.',
    'That month Datong and two other Shanxi counties received lent granary grain after disaster.',
  ],
  s0109: [
    'Sixth month, day gengchen: the Emperor walked to the Altar of Soil and Grain to pray for rain.',
    'In month 6, gengchen, the Emperor walked to the Soil and Grain Altar for rain prayers.',
  ],
  s0110: [
    'On day renwu, frank counsel was sought.',
    'On renwu the court sought frank counsel.',
  ],
  s0111: [
    'On day dinghai, the Emperor went to the Black Dragon Pool shrine to pray for rain.',
    'On dinghai the Emperor again prayed for rain at the Black Dragon Pool shrine.',
  ],
  s0112: [
    'On day renchen, because Guangdong Provincial Military Commander Liu Rongqing failed in suppressing the Lianzhou Yao bandits, he was stripped of office; Li Hongbin was stripped but retained in post.',
    'On renchen Liu Rongqing lost his post over a failed Yao campaign at Lianzhou; Li Hongbin was demoted but kept on duty.',
  ],
  s0113: [
    'On day guisi, the Emperor walked to the Square Mound to pray for rain.',
    'On guisi the Emperor walked to the Square Mound for rain prayers.',
  ],
  s0114: [
    'On day yiwei, Fujun begged to resign because of drought.',
    'On yiwei Fujun asked to resign citing drought.',
  ],
  s0115: [
    'The request was not granted.',
    'The request was denied.',
  ],
  s0116: [
    'On day bingshen, Kokand sent envoys with a memorial, returning captured Kashgar Hui Muslims.',
    'On bingshen Kokand sent envoys and returned captured Kashgar Muslims.',
  ],
  s0117: [
    'On day dingyou, Songyun\'s first-rank hat ornament was restored.',
    'On dingyou Songyun regained his first-rank hat ornament.',
  ],
  s0118: [
    'On day guimao, the Emperor walked from the fasting palace to the Circular Mound to perform the major rain ritual.',
    'On guimao the Emperor walked from the fasting palace to the Circular Mound for the great rain ritual.',
  ],
  s0119: [
    'That day it rained.',
    'Rain fell that day.',
  ],
  s0120: [
    'On day jiachen, Xi\'en and Husong\'e were ordered from Hunan to Guangdong to suppress Yao bandits.',
    'On jiachen Xi\'en and Husong\'e were sent from Hunan to Guangdong against the Yao.',
  ],
  s0121: [
    'That month, seed grain was lent to flood-stricken tun settlements of Huai\'anwei in Jiangsu.',
    'That month flood-hit Huai\'anwei tun settlements in Jiangsu received lent seed grain.',
  ],
  s0122: [
    'Autumn, seventh month, day dingwei: Rong\'an was pardoned and banished to serve in Jilin.',
    'In month 7, dingwei, Rong\'an was pardoned and sent to exile in Jilin.',
  ],
  s0123: [
    'On day wushen, Zhong Chang was made Kobdo Military Deputy Commissioner.',
    'On wushen Zhong Chang became Kobdo deputy commissioner.',
  ],
  s0124: [
    'Cheng Zuluo was ordered to clean up Zhejiang salt administration.',
    'Cheng Zuluo was ordered to reform Zhejiang salt affairs.',
  ],
  s0125: [
    'Khotan Muslims Tawake and others gathered a crowd in rebellion; they were captured and executed.',
    'Tawake and other Khotan rebels were captured and executed.',
  ],
  s0126: [
    'On day yichou, Pan Junhua and other Yao of Hexian in Guangxi rebelled; Qi suppressed and pacified them.',
    'On yichou Guangxi Yao rebels led by Pan Junhua were pacified by Qi.',
  ],
  s0127: [
    'That month, Penghu subprefecture in Fujian was relieved after a wind disaster.',
    'That month Fujian\'s Penghu was relieved after a typhoon.',
  ],
  s0128: [
    'Ration grain was issued for the flood disaster at Tianmen county, Hubei.',
    'Tianmen county in Hubei received ration grain for flood victims.',
  ],
  s0129: [
    'Eighth month: Tao Shu memorialized that English ships had again entered the inner seas and, if they would not obey restrictions, should be sternly punished.',
    'In month 8 Tao Shu reported British ships in inner waters again and urged stern punishment if they disobeyed.',
  ],
  s0130: [
    'An edict rebuked him for provoking conflict and dismissed the proposal.',
    'The court rebuked Tao Shu for provocation and rejected the idea.',
  ],
  s0131: [
    'On day jiawu, Li Hongbin was stripped of office and Provincial Military Commander Liu Rongqing was also seized for interrogation.',
    'On jiawu Li Hongbin was dismissed and Liu Rongqing was arrested for inquiry.',
  ],
  s0132: [
    'Lu Kun was transferred to Governor-General of Guangdong and Guangxi.',
    'Lu Kun became governor-general of the Two Guang.',
  ],
  s0133: [
    'Ruan Yuan was made Associate Grand Secretary while remaining Yunnan-Guizhou Governor-General.',
    'Ruan Yuan became associate grand secretary and kept Yunnan-Guizhou.',
  ],
  s0134: [
    'Na\'erjing\'e was made Huguang Governor-General and Zhong Xiang Shandong governor.',
    'Na\'erjing\'e took Huguang and Zhong Xiang took Shandong.',
  ],
  s0135: [
    'That month, Shuozhou in Shanxi was relieved after flood.',
    'That month Shuozhou in Shanxi was relieved after flooding.',
  ],
  s0136: [
    'Quota taxes for last year\'s flood and drought disasters were remitted or deferred for twenty-nine Anhui prefectures, counties, and guards including Huaining.',
    'Last year\'s disaster taxes were remitted or deferred for twenty-nine places in Anhui including Huaining.',
  ],
  s0137: [
    'Ninth month, first day jiachen: Yin Jiyuan was made Shanxi governor.',
    'On the 1st of month 9, jiachen, Yin Jiyuan became Shanxi governor.',
  ],
  s0138: [
    'On day bingwu, the Longwo flood-post dike on the Southern Yellow River was breached by thieves; Muzhang\'a was ordered jointly with Tao Shu to investigate, and Zhang Jing was stripped but retained.',
    'On bingwu thieves breached the Longwo dike; Muzhang\'a and Tao Shu were to investigate, and Zhang Jing was demoted but kept.',
  ],
  s0139: [
    'On day dingwei, because English ships had forced into the inner seas, coastal naval forces were ordered rectified.',
    'On dingwei English ships in inner waters led to orders to tighten coastal naval forces.',
  ],
  s0140: [
    'On day jiayin, Te Yishunbao was made Ili General.',
    'On jiayin Te Yishunbao became Ili general.',
  ],
  s0141: [
    'On day wuwu, the Lianzhou Yao in Guangdong were pacified.',
    'On wuwu the Lianzhou Yao in Guangdong were pacified.',
  ],
  s0142: [
    'Zhao Fujin and other Yao in Hunan were executed.',
    'Zhao Fujin and other Hunan Yao leaders were executed.',
  ],
  s0143: [
    'That month, ration grain was issued for flood disasters at seven counties and guards including Taoyuan in Jiangsu and Tianmen in Hubei.',
    'That month seven counties and guards including Taoyuan and Tianmen received flood rations.',
  ],
  s0144: [
    'Granary grain was lent for crop failure at Shanyin county, Shanxi.',
    'Shanyin county in Shanxi received lent granary grain after a poor harvest.',
  ],
  s0145: [
    'Intercalary ninth month, day dinghai: the Emperor inspected the Jianrui Camp troops.',
    'In intercalary month 9, dinghai, the Emperor inspected Jianrui Camp troops.',
  ],
  s0146: [
    'On day renyin, because Korean King Li Xi rejected English trade, an edict praised and rewarded him.',
    'On renyin the court praised Korea\'s King Li Xi for refusing British trade.',
  ],
  s0147: [
    'That month, disaster victims in ten Zhili prefectures and counties including Fuping were relieved.',
    'That month ten Zhili prefectures and counties including Fuping were relieved.',
  ],
  s0148: [
    'Ration grain was lent for floods at seven Henan prefectures and counties including Xiangfu and Xing\'an prefecture in Shaanxi.',
    'Flood victims in seven Henan places including Xiangfu and Xing\'an in Shaanxi received lent rations.',
  ],
  s0149: [
    'Silver and grain were lent to soldiers and garrison personnel suffering drought at Qiqihar and other places.',
    'Drought-hit troops at Qiqihar and elsewhere received lent silver and grain.',
  ],
  s0150: [
    'Winter, tenth month, day yisi: bandits rebelled in Qujiang and Ruyuan counties in Guangdong and were suppressed and pacified.',
    'In month 10, yisi, bandits in Qujiang and Ruyuan in Guangdong were suppressed.',
  ],
  s0151: [
    'On day bingwu, Zhu Shiyan and Jingzheng were ordered to Jiangnan to investigate affairs.',
    'On bingwu Zhu Shiyan and Jingzheng were sent to Jiangnan on investigation.',
  ],
  s0152: [
    'On day yichou, Muzhang\'a was ordered to Hubei jointly with Na\'erjing\'e to investigate affairs.',
    'On yichou Muzhang\'a was sent to Hubei with Na\'erjing\'e to investigate.',
  ],
  s0153: [
    'That month, flood and drought relief was given to two Zhili counties including Wuqiao and Dongguang, three Jiangsu prefectures and counties including Taoyuan, four Hubei counties and guards including Hankou, Wuhe county in Anhui, and three Lianghuai salt fields including Banpu.',
    'That month flood and drought relief went to Wuqiao and Dongguang in Zhili, Taoyuan and others in Jiangsu, Hankou and others in Hubei, Wuhe in Anhui, and Banpu and other salt fields.',
  ],
  s0154: [
    'Ration grain was issued to four Jiangsu prefectures and counties including Haizhou, eleven Anhui counties and guards including Wuhe, Anxiang and Huarong in Hunan, and banner people under Jizhou prefecture in Fengtian.',
    'Haizhou and three other Jiangsu places, eleven Anhui places including Wuhe, two Hunan counties, and Fengtian banner people under Jizhou received rations.',
  ],
  s0155: [
    'Granary grain was lent to garrison troops in the Datong garrison disaster zone in Shanxi.',
    'Datong garrison troops in the disaster zone received lent granary grain.',
  ],
  s0156: [
    'Quota taxes old and new for flood, drought, and hail disasters were remitted or deferred for seventeen Zhili prefectures and counties including Wuqiao, sixty-three Jiangsu prefectures, subprefectures, counties, and guards including Taoyuan, thirty-nine Anhui places including Wuhe, twenty-two Zhejiang places including Haining and Renhe field, fourteen Lianghuai fields including Fu\'an, seven Hunan places including Anxiang, six Shanxi places including Xizhou, and twenty-six Hubei places including Hankou.',
    'Disaster taxes were remitted or deferred across Zhili, Jiangsu, Anhui, Zhejiang, Lianghuai salt fields, Hunan, Shanxi, and Hubei in long lists of affected places.',
  ],
  s0157: [
    'Eleventh month, day wuyin: Acting Fuzhou General Husong\'e was made Imperial Commissioner and Colonel Har\'a Deputy Commissioner and sent to Taiwan to suppress bandits.',
    'In month 11, wuyin, Husong\'e became Imperial Commissioner for Taiwan with Har\'a as deputy.',
  ],
  s0158: [
    'On day bingshen, ten thousand shi of Beijing granary rice were allocated to relieve disaster victims in eight Shuntian prefectures and counties including Wuqing.',
    'On bingshen 10,000 shi of Beijing granary rice went to eight Shuntian counties including Wuqing.',
  ],
  s0159: [
    'On day dingyou, Li Hongbin was banished to Urumqi and Liu Rongqing to Ili.',
    'On dingyou Li Hongbin was exiled to Urumqi and Liu Rongqing to Ili.',
  ],
  s0160: [
    'That month, ration grain was lent for disasters to subordinates of five Shaanxi prefectures including Hanzhong and Yihe county in Gansu, and seed was lent at seven places including Jilin.',
    'That month Hanzhong and other Shaanxi areas, Yihe in Gansu, and seven places including Jilin received lent rations or seed.',
  ],
  s0161: [
    'Arrears of rent for Yihe county in Gansu were remitted or deferred.',
    'Yihe county\'s rent arrears in Gansu were remitted or deferred.',
  ],
  s0162: [
    'Twelfth month, day jiachen: two hundred thousand shi of granary grain from Zhejiang and Jiangxi were allocated to supply Fujian people\'s food.',
    'In month 12, jiachen, 200,000 shi of Zhejiang and Jiangxi granary grain were sent to Fujian.',
  ],
  s0163: [
    'On day bingwu, Lu Yinpu was granted leave and Wang Ding was ordered to supervise the Ministry of Punishments.',
    'On bingwu Lu Yinpu took leave and Wang Ding supervised punishments.',
  ],
  s0164: [
    'On day jisi, Xiao Shundai was made Kobdo Military Deputy Commissioner.',
    'On jisi Xiao Shundai became Kobdo deputy commissioner.',
  ],
  s0165: [
    'That month, troop pay was lent to camps in the Zhili disaster zone, and granary grain was lent to disaster victims in six Shanxi prefectures and counties including Fengzhen.',
    'That month Zhili disaster-zone troops and six Shanxi places including Fengzhen received lent pay or grain.',
  ],
  s0166: [
    'That year, Korea, Lan Xang, Ryukyu, and Siam presented tribute.',
    'That year Korea, Lan Xang, Ryukyu, and Siam paid tribute.',
  ],
  s0167: [
    'Year 13, spring, first month, day dingchou: Taiwan Jiayi bandit chief Chen Ban was executed.',
    'In Daoguang 13, month 1, dingchou, Taiwan bandit chief Chen Ban was executed.',
  ],
  s0168: [
    'On day jimao, Sheng Yin and others investigated and confirmed the bribery charges against Xi\'an General Xu Kun and he was stripped of office.',
    'On jimao Xu Kun was stripped after Sheng Yin confirmed his graft as Xi\'an general.',
  ],
  s0169: [
    'On day dingyou, Lin Qing was made Hubei governor.',
    'On dingyou Lin Qing became Hubei governor.',
  ],
  s0170: [
    'The breach at Taonan subprefecture was closed.',
    'The Taonan breach was sealed.',
  ],
  s0171: [
    'Second month, day jiachen: the Emperor presided at the classics lecture.',
    'In month 2, jiachen, the Emperor held the classics lecture.',
  ],
  s0172: [
    'On day jiwei, Yi bandits rebelled in places including Yuexi in Sichuan; Nayinbao and Gui Han were ordered to suppress them.',
    'On jiwei Yi rebels rose in Yuexi and elsewhere in Sichuan; Nayinbao and Gui Han were sent to suppress them.',
  ],
  s0173: [
    'On day gengshen, poor people farming Mongol land at Dolonuur who suffered disaster were relieved, and it was ordered that henceforth partial disasters beyond the passes could not be cited in requests.',
    'On gengshen Dolonuur tenants on Mongol land were relieved and partial frontier disasters could no longer be cited in petitions.',
  ],
  s0174: [
    'On day renxu, Wang Shouhe was made acting Minister of Personnel.',
    'On renxu Wang Shouhe acted as Minister of Personnel.',
  ],
  s0175: [
    'That month, disaster victims in seven Zhili prefectures and counties including Jizhou were relieved.',
    'That month seven Zhili places including Jizhou were relieved.',
  ],
  s0176: [
    'Granary grain was lent to poor people in five Shaanxi prefectures and subprefectures including Hanzhong.',
    'Poor people in five Shaanxi areas including Hanzhong received lent granary grain.',
  ],
  s0177: [
    'Third month, day bingzi: Grand Secretary Lu Yinpu retired.',
    'In month 3, bingzi, Grand Secretary Lu Yinpu retired.',
  ],
  s0178: [
    'On day xinsi, the Emperor reviewed Firearms Camp troops.',
    'On xinsi the Emperor reviewed Firearms Camp troops.',
  ],
  s0179: [
    'On day bingshen, Lu Kun memorialized the capture of the Vietnamese pirate Chen Jiahai and others and the clearing of the sea lanes.',
    'On bingshen Lu Kun reported capturing Vietnamese pirates including Chen Jiahai and securing the seas.',
  ],
  s0180: [
    'On day wuxu, Lin Qing was made Jiangnan Canal Director-General.',
    'On wuxu Lin Qing became Jiangnan Canal director-general.',
  ],
  s0181: [
    'E Shun\'an was made Hubei governor.',
    'E Shun\'an became Hubei governor.',
  ],
  s0182: [
    'On day gengzi it rained.',
    'On gengzi rain fell.',
  ],
  s0183: [
    'That month, granary grain was lent to troops at Zijing Pass camp in Zhili, soldiers under Jizhou prefecture in Fengtian, and garrison colonists and Miao tenant farmers in five Hunan subprefectures and counties including Qianzhou.',
    'That month Zhili, Fengtian, and five Hunan places including Qianzhou received lent grain for troops and tenants.',
  ],
  s0184: [
    'Summer, fourth month, day renyin: E Shun\'an was transferred to Shanxi governor and Yin Jiyuan to Hubei governor.',
    'In month 4, renyin, E Shun\'an took Shanxi and Yin Jiyuan took Hubei.',
  ],
  s0185: [
    'Leshan was transferred to Fuzhou general.',
    'Leshan became Fuzhou general.',
  ],
  s0186: [
    'Qingshan was transferred to Uliastai general.',
    'Qingshan became Uliastai general.',
  ],
  s0187: [
    'On day dingwei it rained.',
    'On dingwei rain fell.',
  ],
  s0188: [
    'On day wushen, Husong\'e was transferred to Chengdu general.',
    'On wushen Husong\'e became Chengdu general.',
  ],
  s0189: [
    'Baoxing was transferred to Mukden general and Baochang to Jilin general.',
    'Baoxing took Mukden and Baochang took Jilin.',
  ],
  s0190: [
    'Su Chenge was made Rehe Commander-in-Chief and Guiqing Grand Canal transport director-general.',
    'Su Chenge took Rehe and Guiqing took canal transport.',
  ],
  s0191: [
    'On day jiyou, Pan Shien was made Grand Secretary of the Hall of Embodying Benevolence and put in charge of the Ministry of Revenue.',
    'On jiyou Pan Shien joined the Embodying Benevolence Hall and supervised revenue.',
  ],
  s0192: [
    'Zhu Shiyan was transferred to Minister of Personnel.',
    'Zhu Shiyan became Minister of Personnel.',
  ],
  s0193: [
    'Bai Rong was made Minister of Works and Tang Jinzhao Left Censor-in-Chief.',
    'Bai Rong took works and Tang Jinzhao became left censor-in-chief.',
  ],
  s0194: [
    'On day yimao, quota tribute for Kashgar and Yarkand in Daoguang 11 and 12 was remitted.',
    'On yimao Kashgar and Yarkand quota tribute for Daoguang 11-12 was remitted.',
  ],
  s0195: [
    'On day jisi, Empress Tonggiya died.',
    'On jisi Empress Tonggiya died.',
  ],
  s0196: [
    'That month, military rice was lent at Yizhou in Fengtian and seed was lent to civilian and Yao at Xintian county in Hunan.',
    'That month Yizhou troops in Fengtian and civilians and Yao at Xintian in Hunan received lent rice or seed.',
  ],
  s0197: [
    'Fifth month, first day xinwei: Wang Mingxiang and two hundred twenty others were granted metropolitan graduate degrees with rank in varying degrees.',
    'On the 1st of month 5, xinwei, 220 graduates including Wang Mingxiang received jinshi ranks.',
  ],
  s0198: [
    'On day dingchou, Yang Fang suppressed Yi bandits at Yuexi, defeated them heavily, and advanced to suppress Yi bandits on the border.',
    'On dingchou Yang Fang heavily defeated Yuexi Yi rebels and advanced to the border campaign.',
  ],
  s0199: [
    'On day jichou, border bandit chiefs including Sang Shuge were executed.',
    'On jichou Sang Shuge and other border rebel chiefs were executed.',
  ],
  s0200: [
    'On day dingyou, Xi\'en was removed as Grand Minister in Attendance and Minister of Revenue and made Minister of the Court of Colonial Affairs.',
    'On dingyou Xi\'en left the inner attendance and revenue posts for colonial affairs minister.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b02.mjs <translation.json>'
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
