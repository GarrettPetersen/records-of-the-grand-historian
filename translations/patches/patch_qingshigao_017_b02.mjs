#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'An edict stated: "Strive still more in reverent diligence, work with inner and outer officials alike toward good governance; there is no need to announce this to the historiographical office."',
    'The court urged greater reverent diligence with all officials and said the edict need not go to the historiographers.',
  ],
  s0102: [
    'On day renzi, because the coffin of the late Emperor Renzong was being escorted to the mausoleum, Prince Zhuang Mianke and others were ordered to remain in the capital to handle affairs.',
    'On renzi, Prince Zhuang Mianke and others stayed in Beijing while Renzong\'s coffin went to the tomb.',
  ],
  s0103: [
    'On day guichou, banner rents for the current year were again remitted for places along the route, and wheat-field seed was distributed.',
    'On guichou, banner rents along the route were remitted again and wheat seed was issued.',
  ],
  s0104: [
    'On day xinyou, the late Emperor Renzong\'s funeral cortege set out; the Emperor escorted the Empress Dowager to Changling.',
    'On xinyou, Renzong\'s funeral cortege departed and the Emperor escorted the Empress Dowager to Changling.',
  ],
  s0105: [
    'On day renxu, Gurkha presented enthronement tribute; they were ordered to present it together with the regular tribute of Daoguang 2.',
    'On renxu, Gurkha sent enthronement tribute and was told to combine it with the Daoguang 2 regular tribute.',
  ],
  s0106: [
    'On day bingyin, the Emperor visited Tailing, Taidongling, Changling, and the Hall of Imperial Grace, and bestowed the posthumous honorific on Empress Xiaoshu Rui as Xiaoshu Duanhe Renzhuang Ciyi Guangtian Yousheng Rui Empress.',
    'On bingyin, the Emperor visited the western tombs and gave Empress Xiaoshu Rui her full posthumous title.',
  ],
  s0107: [
    'On day dingmao, Chengdu General Ni Mashaan was ordered to Yunnan to assist in military affairs.',
    'On dingmao, Ni Mashaan was sent from Chengdu to assist Yunnan military affairs.',
  ],
  s0108: [
    'On day guiyou, the late Emperor Renzong was buried at Changling.',
    'On guiyou, Renzong was buried at Changling.',
  ],
  s0109: [
    'Tuojin and Cao Zhengyong were advanced to Grand Tutor of the Heir Apparent.',
    'Tuojin and Cao Zhengyong were made Grand Tutors of the Heir Apparent.',
  ],
  s0110: [
    'On day dingchou, the Emperor escorted the Empress Dowager back to the capital.',
    'On dingchou, the Emperor brought the Empress Dowager back to Beijing.',
  ],
  s0111: [
    'On day wuyin, the late Emperor Renzong and Empress Xiaoshu Rui were installed in the Imperial Ancestral Temple.',
    'On wuyin, Renzong and Empress Xiaoshu Rui were installed in the Ancestral Temple.',
  ],
  s0112: [
    'On day jimao, because the temple installation was complete, an edict was promulgated empire-wide and grace was distributed in varying degrees.',
    'On jimao, the temple rites finished and an empire-wide amnesty was granted in degrees.',
  ],
  s0113: [
    'Guizhou Provincial Military Commander Luo Siju was ordered to the Yunnan army camp to assist in suppression.',
    'Luo Siju was ordered from Guizhou to the Yunnan camps to assist in suppression.',
  ],
  s0114: [
    'That month, granary grain for famine rations was lent to disaster victims of the previous year in ten Shanxi prefectures and counties including Kelan and five Gansu prefectures and counties including Didao.',
    'That month, last year\'s disaster victims in Shanxi and Gansu were lent granary grain for rations.',
  ],
  s0115: [
    'Summer, fourth month, day bingxu: the regular rain prayer; Heaven was worshipped at the Circular Mound Altar with the late Emperor Renzong as associate spirit; henceforth this was done annually.',
    'In month 4, bingxu, the regular rain prayer at the Circular Mound paired Renzong; this became annual.',
  ],
  s0116: [
    'On day gengyin, Ni Mashaan was made Imperial Commissioner and ordered to oversee Yunnan Yongbei military affairs.',
    'On gengyin, Ni Mashaan became Imperial Commissioner for Yunnan Yongbei affairs.',
  ],
  s0117: [
    'Na Qing\'an was made Left Censor-in-Chief.',
    'Na Qing\'an became Left Censor-in-Chief.',
  ],
  s0118: [
    'Grand Secretary, third-rank marquis Mingliang retired.',
    'Grand Secretary Mingliang retired.',
  ],
  s0119: [
    'Dai Junyuan, Mukedenge, and Akedang\'a were ordered to survey the auspicious site for the eternal tomb.',
    'Dai Junyuan, Mukedenge, and Akedang\'a were ordered to survey the imperial tomb site.',
  ],
  s0120: [
    'On day jiachen, the Yunnan Dayao Lagu rebels were pacified.',
    'On jiachen, the Dayao Lagu rebels in Yunnan were pacified.',
  ],
  s0121: [
    'On day dingwei, the Emperor went to the Hall of Supreme Harmony to pray for rain.',
    'On dingwei, the Emperor prayed for rain at the Hall of Supreme Harmony.',
  ],
  s0122: [
    'On day wuwu, 456,000 taels of relief silver were allocated for Haizhou and other Jiangsu prefectures and counties.',
    'On wuwu, 456,000 taels of relief silver went to Jiangsu prefectures including Haizhou.',
  ],
  s0123: [
    'Bo Lin was made Grand Secretary in charge of the Ministry of War.',
    'Bo Lin became Grand Secretary supervising the Ministry of War.',
  ],
  s0124: [
    'Chang Ling was made Associate Grand Secretary while remaining Shaanxi-Gansu Governor-General.',
    'Chang Ling became Associate Grand Secretary and kept the Shaanxi-Gansu post.',
  ],
  s0125: [
    'On day guihai, an edict halted autumn executions for the year.',
    'On guihai, autumn executions were halted for the year.',
  ],
  s0126: [
    'On day jiazi, Bo Lin was made Grand Secretary of the Hall of the Esteemed and Humane; Cao Zhengyong of the Hall of Military Glory.',
    'On jiazi, Bo Lin joined the Esteemed and Humane Hall and Cao Zhengyong the Military Glory Hall.',
  ],
  s0127: [
    'On day bingyin, Ruan Fuzhao was enfeoffed as king of Vietnam.',
    'On bingyin, Ruan Fuzhao was enfeoffed as king of Vietnam.',
  ],
  s0128: [
    'Songyun was made Minister of War and Qinghui Commander-in-Chief of Rehe.',
    'Songyun took war and Qinghui took Rehe.',
  ],
  s0129: [
    'On day renshen, the summer solstice: Earth was worshipped at the Square Mound Altar with the late Emperor Renzong as associate spirit; henceforth this was done annually.',
    'On renshen, the summer solstice rites at the Square Mound paired Renzong; this became annual.',
  ],
  s0130: [
    'On day guiyou, the Yunnan Yongbei Dayao rebels were pacified.',
    'On guiyou, the Yongbei Dayao rebels in Yunnan were pacified.',
  ],
  s0131: [
    'Sixth month, day xinsi: Zhang Shicheng was made Guangdong governor.',
    'In month 6, xinsi, Zhang Shicheng became Guangdong governor.',
  ],
  s0132: [
    'On day jiashen, fire broke out at the Anding Gate.',
    'On jiashen, the Anding Gate burned.',
  ],
  s0133: [
    'On day gengyin, the Emperor took the Hall of Supreme Harmony and ordered Prince Zheng Wuer Gong\'a and Prince Shuncheng Lunzhu to carry seals and credentials to the mourning palace of Empress Xiaomu to perform enshrinement and posthumous honorific rites.',
    'On gengyin, the Emperor ordered Princes Zheng and Shuncheng to take seals to Empress Xiaomu\'s mourning palace for enshrinement rites.',
  ],
  s0134: [
    'On day wuxu, Cheng Ling was recalled to the capital; Li Hongbin was made Grand Canal Transport Director; Sun Erzhun Anhui governor.',
    'On wuxu, Cheng Ling was recalled; Li Hongbin took the canal and Sun Erzhun took Anhui.',
  ],
  s0135: [
    'Land tax for Xinxiang county, Henan, was remitted.',
    'Xinxiang county\'s land tax in Henan was remitted.',
  ],
  s0136: [
    'Qishan was made Shandong governor.',
    'Qishan became Shandong governor.',
  ],
  s0137: [
    'Autumn, seventh month, day gengxu: Minister of Punishments He Yong died; Na Yancheng was transferred to Minister of Punishments, Songyun to Minister of Personnel, Jin Chang to Minister of War.',
    'In month 7, gengxu, He Yong died; Na Yancheng took punishments, Songyun personnel, and Jin Chang war.',
  ],
  s0138: [
    'Mukedengbu was made Minister of the Court of Colonial Affairs.',
    'Mukedengbu became Minister of Colonial Affairs.',
  ],
  s0139: [
    'On day jiwei, Yan Huang was made acting Grand Canal Transport Director for the Eastern Hebei section with third-rank hat ornament.',
    'On jiwei, Yan Huang acted as eastern-route canal director with third-rank rank.',
  ],
  s0140: [
    'On day dingmao, Yu Dai was transferred to Jiangxi governor.',
    'On dingmao, Yu Dai became Jiangxi governor.',
  ],
  s0141: [
    'Yang Maotian was made Hubei governor.',
    'Yang Maotian became Hubei governor.',
  ],
  s0142: [
    'On day gengwu, the Emperor escorted the Empress Dowager to visit the Western Tombs and remitted three-tenths of quota taxes for places along the route.',
    'On gengwu, the Emperor escorted the Empress Dowager to the Western Tombs and cut route taxes by three-tenths.',
  ],
  s0143: [
    'On day renshen, the Emperor escorted the Empress Dowager back to the capital.',
    'On renshen, the Emperor brought the Empress Dowager back to Beijing.',
  ],
  s0144: [
    'That month, Ningxia and three other Gansu counties suffering flood and drought were relieved, and the previous year\'s quota taxes were remitted.',
    'That month, four Gansu counties including Ningxia were relieved and last year\'s taxes remitted.',
  ],
  s0145: [
    'Eighth month, day gengchen: the Shuntian provincial examination was postponed to the ninth month.',
    'In month 8, gengchen, the Shuntian provincial exam was moved to month 9.',
  ],
  s0146: [
    'On day dinghai, Songyun was ordered to serve on the Grand Council.',
    'On dinghai, Songyun joined the Grand Council.',
  ],
  s0147: [
    'Te Yishunbao was made General of Uliastai.',
    'Te Yishunbao became General of Uliastai.',
  ],
  s0148: [
    'On day guisi, Minister of War Ru Fen died; Chu Pengling succeeded him.',
    'On guisi, Ru Fen died and Chu Pengling took war.',
  ],
  s0149: [
    'On day yiwei, Kokand sent envoys requesting an audience; it was declined.',
    'On yiwei, Kokand\'s request for an audience was declined.',
  ],
  s0150: [
    'On day bingwu, Zhang Shicheng was transferred to Anhui governor and Sun Erzhun to Guangdong governor.',
    'On bingwu, Zhang Shicheng went to Anhui and Sun Erzhun to Guangdong.',
  ],
  s0151: [
    'Ninth month, day wuchen: the king of Siam, Zheng Fo, sent envoys to offer incense and regional products; a gentle edict stopped them.',
    'In month 9, wuchen, Siam\'s incense tribute was gently refused.',
  ],
  s0152: [
    'On day jisi, Chang Ling was recalled; Zhu Xun acted as Shaanxi-Gansu Governor-General.',
    'On jisi, Chang Ling was recalled and Zhu Xun acted for Shaanxi-Gansu.',
  ],
  s0153: [
    'That month, Suzhou and two other Anhui prefectures and counties suffering flood were relieved.',
    'That month, three Anhui prefectures including Suzhou were flood-reliefed.',
  ],
  s0154: [
    'Winter, tenth month, day jimao: the Emperor held court at the Gate of Heavenly Purity to hear government; henceforth this was done annually.',
    'In month 10, jimao, the Emperor heard government at the Gate of Heavenly Purity; this became annual.',
  ],
  s0155: [
    'On day dinghai, Sun Erzhun was transferred to Anhui governor and Song Fu to Guangdong governor.',
    'On dinghai, Sun Erzhun went to Anhui and Song Fu to Guangdong.',
  ],
  s0156: [
    'Eleventh month, day jiwei: Guizhou Governor Chen Ruolin memorialized to reduce annual rent from Han and Miao tenants by 22,000 shi to fund metropolitan examination travel for Miao-frontier graduates; approved.',
    'In month 11, jiwei, Chen Ruolin\'s plan to cut Miao rent for exam travel funds was approved.',
  ],
  s0157: [
    'On day renxu, for river-control merit Li Shixu was given the supplementary title Grand Guardian of the Heir Apparent.',
    'On renxu, Li Shixu gained Grand Guardian of the Heir Apparent for river work.',
  ],
  s0158: [
    'Twelfth month, day wuzi: Qiu Shutang was made Shanxi governor.',
    'In month 12, wuzi, Qiu Shutang became Shanxi governor.',
  ],
  s0159: [
    'On day guisi, Minister of Personnel Liu Huanzhi died; Lu Yinpu was transferred to Minister of Personnel and dismissed from the Grand Council.',
    'On guisi, Liu Huanzhi died; Lu Yinpu took personnel and left the Grand Council.',
  ],
  s0160: [
    'Chu Pengling was transferred to Minister of Works.',
    'Chu Pengling became Minister of Works.',
  ],
  s0161: [
    'Dai Liankui was made Minister of War.',
    'Dai Liankui became Minister of War.',
  ],
  s0162: [
    'That year, Korea, Vietnam, and Ryukyu sent tribute.',
    'That year, Korea, Vietnam, and Ryukyu sent tribute.',
  ],
  s0163: [
    'Spring, year 2, first month, new moon on dingwei: Fang Shouchou was dismissed for illness; Yan Jian was made Zhili Governor-General with Chang Ling acting.',
    'Daoguang 2, month 1 new moon: ill Fang Shouchou left office; Yan Jian took Zhili with Chang Ling acting.',
  ],
  s0164: [
    'Ye Shizhuo was made Fujian governor.',
    'Ye Shizhuo became Fujian governor.',
  ],
  s0165: [
    'On day xinyou, grain was prayed for to the Lord on High with the late Emperor Renzong as associate; henceforth this was done yearly.',
    'On xinyou, the grain prayer paired Renzong; this became yearly.',
  ],
  s0166: [
    'On day gengwu, Te Yishunbao was recalled; Yi Hao was made General of Uliastai and Songyun General of Heilongjiang.',
    'On gengwu, Te Yishunbao was recalled; Yi Hao took Uliastai and Songyun Heilongjiang.',
  ],
  s0167: [
    'Jin Chang was made General of Mukden; Na Qing\'an acted as Minister of War.',
    'Jin Chang took Mukden and Na Qing\'an acted for war.',
  ],
  s0168: [
    'On day xinwei, at the three-year performance review, Cao Zhengyong and others received graded rewards; Vice Ministers Na Yanbao, Shan Qing, and Wu Fangpei were dismissed; Left Censor-in-Chief Gu Deqing was demoted.',
    'On xinwei, the triennial review rewarded Cao Zhengyong and others and dismissed three vice ministers; Gu Deqing was demoted.',
  ],
  s0169: [
    'Wang Ding was made Left Censor-in-Chief.',
    'Wang Ding became Left Censor-in-Chief.',
  ],
  s0170: [
    'Chang Ling was ordered to return as Shaanxi-Gansu Governor-General.',
    'Chang Ling returned to Shaanxi-Gansu.',
  ],
  s0171: [
    'Songyun acted as Zhili Governor-General; Na Yancheng acted as Minister of Personnel.',
    'Songyun acted for Zhili and Na Yancheng for personnel.',
  ],
  s0172: [
    'Second month, day dinghai: for tomb visits, Prince Zhuang Mianke and others were ordered to remain in the capital to handle affairs.',
    'In month 2, dinghai, Prince Zhuang Mianke and others stayed in Beijing for tomb visits.',
  ],
  s0173: [
    'On day guisi, Minister of War Dai Liankui died; Wang Zongcheng succeeded him.',
    'On guisi, Dai Liankui died and Wang Zongcheng took war.',
  ],
  s0174: [
    'Third month, day bingwu: 540,000 taels of relief silver were allocated to twenty Jiangsu prefectures and counties including Shangyuan.',
    'In month 3, bingwu, 540,000 taels of relief silver went to twenty Jiangsu counties including Shangyuan.',
  ],
  s0175: [
    'On day dingwei, the Emperor visited the Eastern Tombs and remitted three-tenths of quota taxes along the route.',
    'On dingwei, the Emperor visited the Eastern Tombs and cut route taxes by three-tenths.',
  ],
  s0176: [
    'On day gengxu, the Emperor visited Zhaoxiling, Xiaodongling, Jingling, and Yuling, and offered wine at the garden tomb of the Crown Prince Duanhui.',
    'On gengxu, the Emperor visited several eastern tombs and offered wine at Crown Prince Duanhui\'s garden tomb.',
  ],
  s0177: [
    'Mukedenge was transferred to Minister of Rites; Wen Fu to Minister of Works.',
    'Mukedenge took rites and Wen Fu works.',
  ],
  s0178: [
    'On day guichou, the Emperor returned to the capital.',
    'On guichou, the Emperor returned to Beijing.',
  ],
  s0179: [
    'On day jiayin, the Emperor escorted the Empress Dowager to the Western Tombs and remitted three-tenths of quota taxes along the route.',
    'On jiayin, the Emperor escorted the Empress Dowager west and cut route taxes by three-tenths.',
  ],
  s0180: [
    'On day yimao, for negligence in the Yuling construction, Prince Zhuang Mianke was demoted to commandery prince; Dai Junyuan was stripped of Grand Guardian of the Heir Apparent and supervision of Punishments; Suleng\'e was dismissed and ordered to serve at the worksite, with proportional indemnities.',
    'On yimao, Yuling negligence cost Prince Zhuang his rank, Dai Junyuan his titles, and Suleng\'e his post with indemnities.',
  ],
  s0181: [
    'On day wuwu, the Emperor visited Tailing, Taidongling, and Changling.',
    'On wuwu, the Emperor visited Tailing, Taidongling, and Changling.',
  ],
  s0182: [
    'On day jiwei, Qingming: the Emperor went to Changling to perform the earth-spreading rite.',
    'On jiwei, Qingming, the Emperor spread earth at Changling.',
  ],
  s0183: [
    'On day renxu, the Emperor offered wine before the mourning palace of Empress Xiaomu.',
    'On renxu, the Emperor offered wine at Empress Xiaomu\'s mourning palace.',
  ],
  s0184: [
    'He escorted the Empress Dowager back to the capital.',
    'The Emperor escorted the Empress Dowager back to Beijing.',
  ],
  s0185: [
    'Intercalary third month, day wuyin: Mukedengbu was dismissed as Minister of Colonial Affairs.',
    'Intercalary month 3, wuyin, Mukedengbu left Colonial Affairs.',
  ],
  s0186: [
    'On day yiyou, Xi\'en was made Minister of Colonial Affairs.',
    'On yiyou, Xi\'en became Minister of Colonial Affairs.',
  ],
  s0187: [
    'On day gengzi, Dai Lanfen and 221 others were granted jinshi degrees with graded ranks.',
    'On gengzi, 222 graduates including Dai Lanfen received jinshi rank by degree.',
  ],
  s0188: [
    'That month, quota taxes were remitted or deferred for three Fengtian prefectures including Ningyuan.',
    'That month, taxes were remitted or deferred for three Fengtian prefectures including Ningyuan.',
  ],
  s0189: [
    'Summer, fourth month, day xinwei: posthumous honorifics were bestowed on Empresses Xiaojingxian, Xiaoshengxian, the Gaozong Emperor, Xiaoxianchun, and Xiaoyichun; books and seals were stored in the Imperial and Mukden Ancestral Temples, with those of Emperor Renzong and Empress Xiaoshu Rui stored in Mukden.',
    'In month 4, xinwei, posthumous titles were given and books and seals stored in Beijing and Mukden temples.',
  ],
  s0190: [
    'On day renwu, Qinghai tribal rebels were pacified.',
    'On renwu, Qinghai tribal rebels were pacified.',
  ],
  s0191: [
    'A Lin was made Jiangxi governor.',
    'A Lin became Jiangxi governor.',
  ],
  s0192: [
    'On day yiyou, Granary Commissioner Mo Jin was rebuked in vermillion rescript for reckless memorializing and demoted to Grand Secretariat academician.',
    'On yiyou, Mo Jin was rebuked and demoted from granary commissioner to academician.',
  ],
  s0193: [
    'That month, taxes on sand-silt, dike-occupied, and flood-submerged land were remitted or deferred for sixteen Henan prefectures including Suizhou; water-damaged levies in five Zhili prefectures and counties and two salt fields were likewise eased.',
    'That month, Henan and Zhili flood and sand-land taxes were remitted or deferred.',
  ],
  s0194: [
    'Sixth month, day guichou: Grand Secretary Bo Lin retired at his original rank.',
    'In month 6, guichou, Grand Secretary Bo Lin retired at original rank.',
  ],
  s0195: [
    'Dai Junyuan was again ordered to supervise the Ministry of Punishments.',
    'Dai Junyuan again supervised Punishments.',
  ],
  s0196: [
    'On day jiwei, Na Yancheng was ordered to act as Shaanxi governor.',
    'On jiwei, Na Yancheng acted as Shaanxi governor.',
  ],
  s0197: [
    'Song Fu was transferred to Guizhou governor.',
    'Song Fu became Guizhou governor.',
  ],
  s0198: [
    'Luo Hanzang was made Guangdong governor.',
    'Luo Hanzang became Guangdong governor.',
  ],
  s0199: [
    'Na Qing\'an acted as Minister of Punishments.',
    'Na Qing\'an acted for Punishments.',
  ],
  s0200: [
    'On day renxu, Songyun was stripped of Minister of Personnel and Grand Council membership and ordered to await assignment as a sixth-rank vice director.',
    'On renxu, Songyun lost personnel and Grand Council rank and awaited assignment as a vice director.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b02.mjs <translation.json>'
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
