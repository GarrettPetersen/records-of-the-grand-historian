#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Emperor Renzong, who received Heaven\'s mandate, raised the realm, spread transformation, secured the plan, honored culture, regulated arms, was filial, respectful, diligent, frugal, upright, keen, wise, and perspicacious—taboo name Yongyan—was the fifteenth son of the Gaozong Emperor.',
    'Renzong, taboo Yongyan, was Hongli\'s fifteenth son; his posthumous titles praise Heaven\'s mandate, civil and military order, and frugal sagacity.',
  ],
  s0002: [
    'His mother was of the Wei clan; she was posthumously honored as Empress Xiaoyi.',
    'His mother, the Wei clan, became Empress Xiaoyi posthumously.',
  ],
  s0003: [
    'He was born on the sixth day of the tenth month, Qianlong 25.',
    'He was born in Qianlong 25, tenth month, day 6.',
  ],
  s0004: [
    'In year 54 he was enfeoffed as Prince Jia.',
    'In Qianlong 54 he became Prince Jia.',
  ],
  s0005: [
    'In the ninth month of year 60 he was installed as heir apparent; the Gaozong Emperor would transmit the throne, with the following year as Jiaqing 1.',
    'In Qianlong 60, month 9, Yongyan became heir apparent; Hongli would abdicate and the next year would be Jiaqing 1.',
  ],
  s0006: [
    'Jiaqing 1, bingchen year, spring, first month, new moon on day wuchen: the internal abdication was performed; the Emperor attended the Retired Emperor in performing rites throughout at the Hall of the Ancestors, the Hall of Imperial Forebears, and the Hall of Imperial Longevity.',
    'At Jiaqing 1 New Year, wuchen, the abdication rites were held; Yongyan accompanied the Retired Emperor at the ancestral halls.',
  ],
  s0007: [
    'The Retired Emperor presided at the Hall of Supreme Harmony and transmitted the seals.',
    'Hongli took the Hall of Supreme Harmony and handed over the seals.',
  ],
  s0008: [
    'The Emperor took the throne, honored the Retired Emperor, who continued to instruct in government.',
    'Yongyan ascended; Hongli became Retired Emperor and still guided policy.',
  ],
  s0009: [
    'An edict was promulgated empire-wide and a feast given to the imperial clan.',
    'Jiaqing issued an empire-wide edict and feasted the imperial clan.',
  ],
  s0010: [
    'On day gengxu, Empress Xitala was installed.',
    'On gengxu, Empress Xitala was enthroned.',
  ],
  s0011: [
    'At the Palace of Tranquil Longevity a Feast of a Thousand Elders was held; the Retired Emperor attended.',
    'The Thousand Elders Banquet at Ningshou Palace included the Retired Emperor.',
  ],
  s0012: [
    'Those aged ninety and above were summoned to the imperial seat and granted a cup of wine, as in precedent.',
    'Men of ninety and more came to the throne for the cup-of-wine rite, as of old.',
  ],
  s0013: [
    'On day xinyou, prayer for grain was offered to the Supreme Lord.',
    'On xinyou, the Emperor prayed for grain to Heaven.',
  ],
  s0014: [
    'On day guihai, the Emperor, attending the Retired Emperor, granted the court ministers a feast at the Hall of Great Brightness.',
    'On guihai, Yongyan with the Retired Emperor feasted ministers at the Hall of Great Brightness.',
  ],
  s0015: [
    'All such feasts followed this practice.',
    'Every such feast followed the same form.',
  ],
  s0016: [
    'Grand Secretary Fukang\'an and others, managing the Miao frontier, memorialized capture of Langpo and advance against Pinglong.',
    'Fukang\'an reported Langpo taken and an advance on Pinglong.',
  ],
  s0017: [
    'Teaching-bandit rebels rose in Zhijiang and Yidu, Hubei.',
    'White Lotus rebels rose in Zhijiang and Yidu, Hubei.',
  ],
  s0018: [
    'Second month, new moon on day dingchou: the sacrifice to Confucius was performed.',
    'In month 2, dingchou new moon, the Emperor sacrificed to Confucius.',
  ],
  s0019: [
    'On day wuyin, the altars of soil and grain were sacrificed to.',
    'On wuyin, the Emperor sacrificed to soil and grain.',
  ],
  s0020: [
    'On day gengchen, the Classics Lecture was inaugurated.',
    'On gengchen, the Classics Lecture began.',
  ],
  s0021: [
    'On day xinsi, an edict ordered a Confucian temple built at Guide subprefecture, Gansu.',
    'On xinsi, Guide, Gansu, was ordered to build a Confucian temple.',
  ],
  s0022: [
    'On day wuzi, at the spring equinox the sun was worshipped at the eastern suburb.',
    'On wuzi, the spring equinox, the Emperor worshipped the sun in the eastern suburb.',
  ],
  s0023: [
    'On day jichou, the Emperor held court at the Gate of Heavenly Purity to hear government; when at the garden residence he held court at the Hall of Diligence in Government, as the regular practice.',
    'On jichou, Yongyan heard government at Qianqing Gate, or at the Diligence Hall when at the garden.',
  ],
  s0024: [
    'On day jihai, teaching-bandit rebels rose in Dangyang, Hubei, and killed officials.',
    'On jihai, rebels in Dangyang, Hubei, killed officials.',
  ],
  s0025: [
    'Xi\'an General Heng Rui led two thousand troops to suppress them.',
    'Heng Rui marched two thousand men from Xi\'an to suppress them.',
  ],
  s0026: [
    'On day xinchou, the temple of successive emperors was sacrificed to.',
    'On xinchou, the Emperor sacrificed at the temple of past emperors.',
  ],
  s0027: [
    'On day bingwu, Hubei Governor Hui Ling memorialized capture of the teaching-bandit Nie Jieren.',
    'On bingwu, Hui Ling reported capturing rebel leader Nie Jieren.',
  ],
  s0028: [
    'Third month, day gengxu: continued collection of military-supply silver in Sichuan was halted.',
    'In month 3, gengxu, Sichuan\'s continued military-supply levy was stopped.',
  ],
  s0029: [
    'On day xinhai, the Emperor plowed the sacred field, four furrows.',
    'On xinhai, the Emperor plowed the sacred field with four passes.',
  ],
  s0030: [
    'On day renzi, the Emperor, attending the Retired Emperor, went to worship at the tombs.',
    'On renzi, Yongyan accompanied the Retired Emperor to the tombs.',
  ],
  s0031: [
    'On day dingmao, the imperial carriage returned to the capital.',
    'On dingmao, the court returned to Beijing.',
  ],
  s0032: [
    'On day jisi, the Empress sacrificed to the Silkworm Ancestor.',
    'On jisi, the Empress performed the silkworm rite.',
  ],
  s0033: [
    'On day guiyou, Heng Rui memorialized recovery of Zhushan, Hubei.',
    'On guiyou, Heng Rui reported recovering Zhushan.',
  ],
  s0034: [
    'On day renshen, Liu Baozhu was dismissed from office.',
    'On renshen, Liu Baozhu was removed.',
  ],
  s0035: [
    'Wuer\'tunaxun was made Minister of the Court of Colonial Affairs; Fu Rui was made Suiyuan garrison general; Yongqing was made Mongol commander-in-chief.',
    'Wuer\'tunaxun took the Colonial Affairs ministry; Fu Rui, Suiyuan; Yongqing, the Mongol command.',
  ],
  s0036: [
    'Summer, fourth month, new moon on day bingzi: seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'In month 4, bingzi new moon, the Emperor sacrificed at the ancestral temple.',
  ],
  s0037: [
    'Yi Mian, Yongbao, Heng Rui, Sun Shiyi, and others were ordered to suppress the Hubei teaching bandits in separate columns.',
    'Yi Mian, Yongbao, Heng Rui, and Sun Shiyi were ordered to crush Hubei rebels in separate forces.',
  ],
  s0038: [
    'On day xinsi, at the summer solstice Heaven was sacrificed to at the Round Mound.',
    'On xinsi, the summer solstice, the Emperor sacrificed to Heaven at the Round Mound.',
  ],
  s0039: [
    'For merit in suppressing rebels at Laifeng, Sichuan Governor Sun Shiyi was promoted to third-rank baron.',
    'Sun Shiyi became a third-rank baron for crushing Laifeng rebels.',
  ],
  s0040: [
    'An edict ordered tribute horses from Ili sent by the overland route.',
    'Ili tribute horses were ordered overland.',
  ],
  s0041: [
    'On day dingyou, the Emperor, attending the Retired Emperor, prayed for rain at Black Dragon Pool.',
    'On dingyou, Yongyan with the Retired Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0042: [
    'That day, rain fell.',
    'Rain fell that day.',
  ],
  s0043: [
    'On day gengzi, Zhao Wenkai and one hundred one others received jinshi degrees with differentiated ranks.',
    'On gengzi, Zhao Wenkai and 101 others received jinshi degrees.',
  ],
  s0044: [
    'Fifth month, day wushen: an edict said that hereafter Oirat visitors to the capital who had had smallpox should come by the overland route to Rehe for audience.',
    'In month 5, wushen, Oirat visitors with smallpox history were ordered to audience at Rehe by the overland route.',
  ],
  s0045: [
    'On day xinyou, Earth was sacrificed to at the Square Mound.',
    'On xinyou, the Emperor sacrificed to Earth at the Square Mound.',
  ],
  s0046: [
    'On day renxu, the Emperor, attending the Retired Emperor, went to escape summer heat at Mulan.',
    'On renxu, Yongyan accompanied the Retired Emperor to Mulan.',
  ],
  s0047: [
    'On day yichou, Fu Gang was made grain-transport governor-general.',
    'On yichou, Fu Gang took the grain-transport command.',
  ],
  s0048: [
    'On day renshen, Grand Secretary and Imperial Prince Fukang\'an died in camp.',
    'On renshen, Fukang\'an died on campaign.',
  ],
  s0049: [
    'Sixth month, new moon on day yihai: there was a solar eclipse.',
    'At the sixth-month new moon, yihai, there was a solar eclipse.',
  ],
  s0050: [
    'Kui Lun was made Fujian-Zhejiang governor-general; Zhu Gui was made Liang-Guang governor-general.',
    'Kui Lun took Fujian-Zhejiang; Zhu Gui, Liang-Guang.',
  ],
  s0051: [
    'Ji Yun was made Minister of War; Jin Shisong Minister of Rites; Shen Chu Left Censor-in-Chief.',
    'Ji Yun took war; Jin Shisong, rites; Shen Chu, the left censorate.',
  ],
  s0052: [
    'On day bingzi, Fu Chang\'an was transferred to be Fuzhou general.',
    'On bingzi, Fu Chang\'an became Fuzhou general.',
  ],
  s0053: [
    'Mingliang was ordered to act as Guangzhou general.',
    'Mingliang acted as Guangzhou general.',
  ],
  s0054: [
    'On day dingchou, water-scoured field taxes were remitted for three subprefectures and counties of Daizhou, Shanxi.',
    'On dingchou, three Daizhou districts lost water-scoured field taxes.',
  ],
  s0055: [
    'On day wuyin, He Lin memorialized capture of the Miao bandit Shi Sanbao, who was sent to the capital and executed.',
    'On wuyin, He Lin sent captured Miao leader Shi Sanbao to the capital for execution.',
  ],
  s0056: [
    'On day guisi, the Fengxun River breached its banks in Jiangnan.',
    'On guisi, the Fengxun River broke through in Jiangnan.',
  ],
  s0057: [
    'Autumn, seventh month, day xinhai: Mingliang memorialized that teaching bandits in Xiaogan county had been suppressed.',
    'In month 7, xinhai, Mingliang reported Xiaogan rebels suppressed.',
  ],
  s0058: [
    'Grand Secretary, Sichuan Governor, and third-rank Baron Sun Shiyi died in camp.',
    'Sun Shiyi, grand secretary and Sichuan governor, died on campaign.',
  ],
  s0059: [
    'Eighth month, day bingzi: because of rain the autumn hunt was canceled.',
    'In month 8, bingzi, rain canceled the autumn hunt.',
  ],
  s0060: [
    'On day renyin, He Lin died in camp; Mingliang and E\'hui were ordered to take over military affairs.',
    'On renyin, He Lin died in camp; Mingliang and E\'hui took command.',
  ],
  s0061: [
    'Ninth month, day yisi: the imperial carriage returned to the capital.',
    'In month 9, yisi, the court returned to Beijing.',
  ],
  s0062: [
    'Winter, tenth month, day wuyin: on the Emperor\'s birthday he went to perform rites before the Retired Emperor.',
    'In month 10, wuyin, Yongyan\'s birthday rites began with homage to the Retired Emperor.',
  ],
  s0063: [
    'When the rites were complete, he received congratulations from the court ministers.',
    'After the rites he received court congratulations.',
  ],
  s0064: [
    'On day jimao, Dong Gao was made Grand Secretary.',
    'On jimao, Dong Gao joined the Grand Secretariat.',
  ],
  s0065: [
    'Wang Jie, citing foot ailment, memorialized to resign from the Grand Council, Southern Studio, and Ministry of Rites affairs; this was granted.',
    'Wang Jie resigned from the Grand Council, Southern Studio, and Rites over foot ailment.',
  ],
  s0066: [
    'Shen Chu was ordered to serve in the Grand Council.',
    'Shen Chu joined the Grand Council.',
  ],
  s0067: [
    'On day xinsi, Brigadier Hua Lianbu, who died fighting the Miao campaign, was posthumously granted Junior Guardian of the Heir Apparent and a hereditary office.',
    'On xinsi, the fallen Miao-campaign general Hua Lianbu received posthumous honors and a hereditary post.',
  ],
  s0068: [
    'On day bingxu, Shen Chu was transferred to be Minister of War and Ji Yun was made Left Censor-in-Chief.',
    'On bingxu, Shen Chu took war and Ji Yun the left censorate.',
  ],
  s0069: [
    'Eleventh month, day gengxu: the Fengxun river works, though closed, breached again.',
    'In month 11, gengxu, the Fengxun dike closed and broke again.',
  ],
  s0070: [
    'Hereditary offices were granted to Hubei officials who died in service—Patrol Inspector Wang Yisun, Instructor Gan Du, and Registry Clerk Pu Baoguang.',
    'Wang Yisun, Gan Du, and Pu Baoguang of Hubei received hereditary posts for dying in service.',
  ],
  s0071: [
    'On day jiazi, at the winter solstice Heaven was sacrificed to at the Round Mound.',
    'On jiazi, the winter solstice, the Emperor sacrificed to Heaven at the Round Mound.',
  ],
  s0072: [
    'On day yichou, Jiangxi Governor Chen Huai was guilty of crimes, arrested and questioned, and sent into exile.',
    'On yichou, Chen Huai of Jiangxi was arrested, tried, and exiled.',
  ],
  s0073: [
    'On day jisi, because Hubei teaching bandits had slipped across the Gun River into Shaanxi, Yongbao was stripped of office and arrested for trial; Hui Ling was put in overall command of his army.',
    'On jisi, Yongbao was arrested after rebels crossed into Shaanxi; Hui Ling took his army.',
  ],
  s0074: [
    'Twelfth month, day wuzi: Hunan Miao bandits were pacified; Mingliang was enfeoffed as earl, E\'le Dengbao as marquis, and Delengtai and others received differentiated hereditary offices.',
    'In month 12, wuzi, Hunan Miao rebels were pacified; Mingliang became earl and E\'le Dengbao marquis.',
  ],
  s0075: [
    'On day gengzi, the joint winter sacrifice was offered at the Imperial Ancestral Temple.',
    'On gengzi, the Emperor performed the winter ancestral sacrifice.',
  ],
  s0076: [
    'On day xinchou, the Emperor, attending the Retired Emperor, presided at the Hall of Supreme Harmony and granted the New Year feast to foreign tributaries at court.',
    'On xinchou, Yongyan with the Retired Emperor feasted foreign tributaries at New Year.',
  ],
  s0077: [
    'That year, disaster tax arrears were remitted by varying amounts for thirty-nine subprefectures, prefectures, and counties in Zhili, Jiangsu, Shanxi, Hunan, Fujian, and other provinces.',
    'That year, thirty-nine disaster districts in several provinces lost tax arrears by degree.',
  ],
  s0078: [
    'The empire\'s population was reckoned at 275,662,044 persons; grain at 37,206,539 piculs, 1 sheng, 2 ge, and 7 shao.',
    'The empire counted 275,662,044 people and 37,206,539 piculs of grain.',
  ],
  s0079: [
    'Korea sent tribute.',
    'Korea sent tribute that year.',
  ],
  s0080: [
    'Second year, dingsi year, spring, first month, day dingmao: the Zhong Miao woman Wang Nangxian of Nanlong, Guizhou, rebelled; Governor Lebao was ordered to suppress her.',
    'In Jiaqing 2, dingmao, Wang Nangxian of Nanlong, Guizhou, rebelled and Lebao was sent to suppress her.',
  ],
  s0081: [
    'On day gengwu, Guan Cheng memorialized that the Sichuan teaching-bandit Xu Tiande had raided Dazhou and Dongxiang; Brigade General Zhu Shedou and others were ordered to suppress him.',
    'On gengwu, Guan Cheng reported Xu Tiande raiding Dazhou and Zhu Shedou was sent against him.',
  ],
  s0082: [
    'Second month, day guiyou: the Emperor attended the Classics Lecture.',
    'In month 2, guiyou, the Emperor attended the Classics Lecture.',
  ],
  s0083: [
    'Jiangnan again reported the Fengxun breach closed.',
    'Jiangnan again reported the Fengxun dike closed.',
  ],
  s0084: [
    'On day wuyin, the Empress died; following the Retired Emperor\'s instruction, plain dress was worn for seven days without removing the queue tassel.',
    'On wuyin, the Empress died; by the Retired Emperor\'s order the court mourned seven days in plain dress without removing queue tassels.',
  ],
  s0085: [
    'Court ministers did likewise; close attendants wore ordinary dress without court beads.',
    'Ministers followed suit; close attendants wore plain dress without beads.',
  ],
  s0086: [
    'On day xinsi, for merit in suppressing and capturing teaching bandits, Jing An was promoted to third-rank earl.',
    'On xinsi, Jing An became a third-rank earl for capturing rebels.',
  ],
  s0087: [
    'On day wuxu, the late Empress was given the posthumous title Empress Xiaoshu.',
    'On wuxu, the late Empress was titled Xiaoshu.',
  ],
  s0088: [
    'Hui Ling memorialized capture of the bandit chiefs Liu Qi and others, who were sent to the capital and executed.',
    'Hui Ling sent captured chiefs Liu Qi and others to the capital for execution.',
  ],
  s0089: [
    'Third month, day wushen: the Emperor went to worship at the Western Tombs.',
    'In month 3, wushen, the Emperor went to the Western Tombs.',
  ],
  s0090: [
    'On day dingsi, he returned to the capital.',
    'On dingsi, the Emperor returned to Beijing.',
  ],
  s0091: [
    'On day guihai, Liu Yong was made Grand Secretary; Shen Chu was transferred to be Minister of Personnel; Zhu Gui was made Minister of War.',
    'On guihai, Liu Yong joined the Grand Secretariat; Shen Chu took personnel; Zhu Gui, war.',
  ],
  s0092: [
    'Fu Chang\'an and Qing Gui were made Manchu commanders-in-chief; Delengtai was made Chinese Banner commander-in-chief.',
    'Fu Chang\'an and Qing Gui took the Manchu command; Delengtai, the Chinese Banner command.',
  ],
  s0093: [
    'Baketanbu and Qing Cheng memorialized that in pursuit from Yingshan into Henan it was verified that the bandit chiefs Li Quan, Wang Tingzhao, and Yao Zhifu were all among them.',
    'Baketanbu and Qing Cheng reported Li Quan, Wang Tingzhao, and Yao Zhifu among rebels pursued from Yingshan into Henan.',
  ],
  s0094: [
    'An edict ordered their capture.',
    'An edict ordered them seized.',
  ],
  s0095: [
    'Summer, fourth month, day renshen: a Zhenbi garrison commander was established in Hunan and Baojing native county was changed to regular administration.',
    'In month 4, renshen, Hunan gained a Zhenbi garrison commander and Baojing became a regular county.',
  ],
  s0096: [
    'On day xinsi, Vice Minister Feng Kuan was posthumously honored as Grand Preceptor and Minister of Rites—he had been the Emperor\'s teacher in receiving the Classics.',
    'On xinsi, Feng Kuan, the Emperor\'s Classics teacher, was posthumously made grand preceptor and minister of rites.',
  ],
  s0097: [
    'Fifth month, day wuchen: the Emperor, attending the Retired Emperor, went to escape summer heat at Mulan.',
    'In month 5, wuchen, Yongyan accompanied the Retired Emperor to Mulan.',
  ],
  s0098: [
    'On day jisi, Hui Ling memorialized that the teaching bandit Yao Zhifu and others had crossed the Han River at Baimashi into Sichuan.',
    'On jisi, Hui Ling reported Yao Zhifu and others crossing the Han into Sichuan at Baimashi.',
  ],
  s0099: [
    'An edict dismissed the overall commanders Qing Cheng, Heng Rui, and others, each demoted in rank; Yi Mian was made overall commander, with Mingliang and Delengtai as assistants.',
    'Qing Cheng and Heng Rui were demoted; Yi Mian took overall command with Mingliang and Delengtai as assistants.',
  ],
  s0100: [
    'Sixth month, day guiyou: Lebao memorialized that in suppressing the Nanlong Zhong Miao he had taken in succession Shuoyanping, Kazi River, and other places.',
    'In month 6, guiyou, Lebao reported successive captures at Shuoyanping, Kazi River, and elsewhere against Nanlong Miao rebels.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b01.mjs <translation.json>'
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
