#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Emperor Xuanzong, who accorded with Heaven and bore the mandate, established the central body, rectified the ultimate, was cultured and sagely, martial and wise, brave and benevolent, frugal and diligent, filial and keen, tolerant and steadfast in accomplishment—taboo name Minning—was the second son of the Renzong Emperor.',
    'Xuanzong, taboo Minning, was Renzong\'s second son; his posthumous titles praise Heaven\'s mandate, central order, and accomplished sagacity.',
  ],
  s0002: [
    'His mother was Empress Xiaoshu Rui; on the tenth day of the eighth month, Qianlong 47, he was born in the Palace of Gathering Fragrance.',
    'His mother was Empress Xiaoshu Rui; he was born in Qianlong 47, eighth month, day 10, at the Palace of Gathering Fragrance.',
  ],
  s0003: [
    'In youth he loved study; he received instruction in turn from compilers Qin Chengye and Wan Chengfeng.',
    'As a boy he studied with Qin Chengye and Wan Chengfeng in succession.',
  ],
  s0004: [
    'He also discussed day and night with Vice Minister of Rites Wang Tingzhen and Hanlin Reader Xu Ying.',
    'He debated daily with Wang Tingzhen and Xu Ying.',
  ],
  s0005: [
    'In the eighth month of Qianlong 56, when the Gaozong Emperor went on the encircling hunt at Weixunge\'er, the Emperor drew his bow and took a deer; the Gaozong Emperor was greatly pleased and bestowed a yellow jacket and peacock feather.',
    'In Qianlong 56, month 8, at Weixunge\'er Hongli saw Minning shoot a deer and gave him a yellow jacket and peacock plume.',
  ],
  s0006: [
    'In Jiaqing 1 he married Empress Xiaomu Cheng.',
    'In Jiaqing 1 he wed Empress Xiaomu Cheng.',
  ],
  s0007: [
    'On day wuxu in the fourth month of year 4, the Renzong Emperor, following the house law for establishing an heir, personally wrote the Emperor\'s name and sealed it in the locked casket.',
    'On wuxu in month 4 of Jiaqing 4, Renzong wrote Minning\'s name and sealed it in the heir-apparent casket.',
  ],
  s0008: [
    'In the first month of year 13, Empress Xiaomu Cheng died; he then married Empress Xiaoshen Cheng.',
    'In Jiaqing 13, month 1, Empress Xiaomu Cheng died; he then wed Empress Xiaoshen Cheng.',
  ],
  s0009: [
    'In the ninth month of year 18, while accompanying the fortune on the autumn hunt at Mulan, the Emperor returned first to the capital, and the affair of teaching-bandit Lin Qing\'s party assaulting the palace occurred.',
    'In Jiaqing 18, month 9, Minning returned early from the Mulan hunt while Lin Qing\'s sect stormed the palace.',
  ],
  s0010: [
    'That month, on day wuyin, the bandits entered the inner right gate, reached south of the Hall of Mental Cultivation, and wished to flee north.',
    'That month, on wuyin, rebels reached the Hall of Mental Cultivation and tried to break north.',
  ],
  s0011: [
    'The Emperor wielded his gun and shot dead two bandits; the rest dispersed in rout, and the disturbance was pacified.',
    'Minning shot two rebels with his musket; the rest fled and order returned.',
  ],
  s0012: [
    'A flying memorial reported the matter to the throne.',
    'An urgent memorial reported the fight to the throne.',
  ],
  s0013: [
    'The Renzong Emperor was gratified, enfeoffed the Emperor as Prince Zhi, and titled the gun he wielded "Weilie."',
    'Renzong made Minning Prince Zhi and named his musket Weilie.',
  ],
  s0014: [
    'An edict to the Grand Secretariat said: "Loyalty and filial piety in full measure—how could favors be stinted?',
    'Renzong told the Grand Secretariat that Minning\'s loyalty and filial piety deserved full reward.',
  ],
  s0015: [
    '" The Emperor, modest and not presuming on merit, thanked grace and memorialized: "The affair came in sudden haste; there was no one to fight the bandits, and I had no choice. The more I reflect afterward, the more I fear.',
    'Minning refused the praise and wrote that the fight was sudden, that he had no guards, and that he grew more afraid on reflection.',
  ],
  s0016: [
    '" Such was his humility without boasting.',
    'That was how little he boasted of himself.',
  ],
  s0017: [
    'In the autumn of the twenty-fifth year, the Renzong Emperor\'s autumn encampment hunt at Rehe was held; the Emperor followed in attendance.',
    'In Jiaqing 25, autumn, Minning followed Renzong to the Rehe hunt.',
  ],
  s0018: [
    'On day wuyin the Renzong Emperor fell ill; on day jimao he was gravely ill. Grand Ministers in Attendance Saichong\'a and Sotnamu Dobche, Military Grand Councilors Tuojin, Dai Junyuan, Lu Yinpu, and Wen Fu, and chief stewards of the Imperial Household Department Xi En and Heshen Tai opened the sealed casket and proclaimed the Jiaqing 4 imperial handwriting, establishing the Emperor as heir apparent.',
    'On wuyin Renzong fell ill; on jimao he worsened. Saichong\'a, Tuojin, and others opened the casket and proclaimed Minning heir apparent.',
  ],
  s0019: [
    'When the Renzong Emperor died, that same day they escorted the late Emperor\'s coffin back to the capital.',
    'When Renzong died, his coffin left for Beijing the same day.',
  ],
  s0020: [
    'On day xinsi the mother was honored as Empress Dowager; Prince Dun Miankai was raised to Prince of the First Rank Dun; Mianyu to Prince of the Second Rank Hui.',
    'On xinsi the mother became Empress Dowager; Miankai became Prince Dun and Mianyu Prince Hui.',
  ],
  s0021: [
    'On day guiwei, by the Empress Dowager\'s decree: "The late Emperor\'s dragon coach has ascended on high; the second imperial son, Prince Zhi, is humane, filial, intelligent, and perspicacious, brave and upright in bearing, and is with the entourage—he should surely receive the entrustment and govern the people.',
    'On guiwei the Empress Dowager decreed that Prince Zhi, with the court at Rehe, should receive the throne and rule the people.',
  ],
  s0022: [
    'Yet fearing that in haste the late Emperor had no time to make clear instruction, and the second imperial son by nature is modest—I know this well.',
    'She feared Renzong had not spoken clearly in haste and knew the prince was modest by nature.',
  ],
  s0023: [
    'Therefore an edict is sent down, transmitted to the Beijing princes and grandees, sent posthaste to the second imperial son, to take the supreme place immediately.',
    'She ordered Beijing princes and ministers to tell him at once to ascend the throne.',
  ],
  s0024: [
    '" The Emperor received the decree, respectfully memorialized in reply, and presented the vermillion edict of Jiaqing 4, fourth month, establishing the heir apparent, from what the Grand Ministers in Attendance and others had opened in the sealed casket.',
    'Minning obeyed, replied respectfully, and presented the Jiaqing 4 heir-apparent edict from the casket.',
  ],
  s0025: [
    'Qin Chengye, Hanlin Reader-at-large, was summoned to the capital.',
    'Qin Chengye was called to Beijing.',
  ],
  s0026: [
    'On day yiyou in the eighth month, he was ordered to observe the ancient three-year mourning, while subjects still followed the fixed term of dress.',
    'On yiyou in month 8, the court took three-year mourning while subjects kept the usual mourning term.',
  ],
  s0027: [
    'Next year\'s quota taxes were remitted for Chengde prefecture and its subordinates and five districts including Wanping along the route.',
    'Next year\'s taxes were waived for Chengde and five route districts including Wanping.',
  ],
  s0028: [
    'On day guisi, the princes\' and ministers\' request to observe mourning for one hundred days was granted.',
    'On guisi the court was allowed to mourn one hundred days.',
  ],
  s0029: [
    'On day weimo, the late Emperor\'s coffin returned to the capital.',
    'On weimo the late emperor\'s coffin reached Beijing.',
  ],
  s0030: [
    'Censor Yuan Xian memorialized seven matters on fixing standards and distinguishing good and evil.',
    'Censor Yuan Xian proposed seven reforms on standards and moral judgment.',
  ],
  s0031: [
    'The Emperor issued a favorable edict praising and adopting it.',
    'Minning praised the memorial and accepted it.',
  ],
  s0032: [
    'Fang Shoudi was added Grand Preceptor of the Heir Apparent.',
    'Fang Shoudi became Grand Preceptor of the Heir Apparent.',
  ],
  s0033: [
    'On day wushen, the Grand Secretariat and Nine Ministers submitted the late Emperor\'s temple name and honorific title: Renzong, Received Heaven, Raised Fortune, Spread Transformation, Secured the Plan, Honored Culture, Regulated Arms, Filial, Respectful, Diligent, Frugal, Upright, Keen, Wise, and Perspicacious Emperor.',
    'On wushen the court named Renzong and gave his full posthumous title.',
  ],
  s0034: [
    'The late Emperor\'s testamentary edict was promulgated to Korea, Ryukyu, Siam, Vietnam, Burma, and other states.',
    'Renzong\'s testament was sent to Korea, Ryukyu, Siam, Vietnam, Burma, and others.',
  ],
  s0035: [
    'On day gengxu the Emperor took the throne at the Hall of Supreme Harmony, reported to Heaven, Earth, the Ancestral Temple, and the Altar of Soil and Grain, promulgated an edict empire-wide, and made the next year Daoguang 1.',
    'On gengxu Minning ascended at the Hall of Supreme Harmony, sacrificed to Heaven, Earth, and the altars, and made the next year Daoguang 1.',
  ],
  s0036: [
    'Grace was extended within and without; those not forgiven by extraordinary amnesty were all pardoned.',
    'A general amnesty covered all crimes not excluded by extraordinary pardon.',
  ],
  s0037: [
    'Huang Yue, Liu Chengzhi, Saichong\'a, Sun Yuting, and Jiang Yinshe were made Junior Guardian of the Heir Apparent.',
    'Huang Yue, Liu Chengzhi, Saichong\'a, Sun Yuting, and Jiang Yinshe became Junior Guardian of the Heir Apparent.',
  ],
  s0038: [
    'On day xinhai autumn executions were halted.',
    'On xinhai autumn executions were suspended.',
  ],
  s0039: [
    'That month, Xu Prefecture, Henan, earthquake disaster was relieved.',
    'That month Henan\'s Xu Prefecture earthquake victims were relieved.',
  ],
  s0040: [
    'Soldiers drowned at Shengzhangwutai and other border posts were lent one year\'s pay and grain, with house-repair funds given.',
    'Flooded border garrisons at Shengzhangwutai and elsewhere received a year\'s pay, grain, and repair funds.',
  ],
  s0041: [
    'One month\'s rations were lent at Juliu River and elsewhere.',
    'One month\'s rations were lent at Juliu River and elsewhere.',
  ],
  s0042: [
    'On day jiwei in the ninth month the late Emperor\'s mausoleum was titled Changling.',
    'On jiwei in month 9 the late emperor\'s tomb was named Changling.',
  ],
  s0043: [
    'On day gengshen the Military Grand Councilors were sharply rebuked for errors in drafting the testament; Tuojin and Dai Junyuan were dismissed from the Grand Council; Wen Fu and Lu Yinpu remained; all were referred for severe deliberation.',
    'On gengshen Tuojin and Dai Junyuan left the Grand Council over a flawed testament draft; Wen Fu and Lu Yinpu stayed; all faced severe review.',
  ],
  s0044: [
    'Bin Jing reported that the Aiman of Chibaghash, Bruke chief Susuwanqi, had stirred up Jahangir, son of the Saman Sakk, to rebel.',
    'Bin Jing reported Jahangir, stirred up by Susuwanqi, in revolt at Chibaghash.',
  ],
  s0045: [
    'Qing Xiang was ordered to hurry to Kashgar to suppress them.',
    'Qing Xiang was sent posthaste to Kashgar to suppress them.',
  ],
  s0046: [
    'Grand Secretary Cao Zhengyong and Ministers Huang Yue and Yinghe were ordered to serve on the Grand Council.',
    'Cao Zhengyong, Huang Yue, and Yinghe joined the Grand Council.',
  ],
  s0047: [
    'On day renxu Nayancheng was made Minister of the Court of Colonial Affairs.',
    'On renxu Nayancheng took the Colonial Affairs ministry.',
  ],
  s0048: [
    'Minister of Personnel and Associate Grand Secretary Wu Jun was ordered to supervise Henan Yifeng River works.',
    'Wu Jun was ordered to supervise the Henan Yifeng River project.',
  ],
  s0049: [
    'Liu Chengzhi was transferred to Minister of Personnel; Ru Fen to War; Lu Yinpu to Works; Huang Yue to Revenue; Wang Tingzhen to Rites; Gu Deqing to Left Censor-in-Chief.',
    'Liu Chengzhi took personnel; Ru Fen war; Lu Yinpu works; Huang Yue revenue; Wang Tingzhen rites; Gu Deqing the left censorate.',
  ],
  s0050: [
    'Songyun was recalled as Left Vice Censor-in-Chief.',
    'Songyun returned as Left Vice Censor-in-Chief.',
  ],
  s0051: [
    'On day wuchen Qin Chengye was made Hanlin Reader and ordered to serve in the Upper Study.',
    'On wuchen Qin Chengye became Hanlin reader and served in the Upper Study.',
  ],
  s0052: [
    'On day gengwu the Emperor for the first time held court at the western factory curtain and received the court ministers.',
    'On gengwu Minning first held court at the western factory curtain and received ministers.',
  ],
  s0053: [
    'An edict opened a special provincial and metropolitan examination year.',
    'A special civil-service examination year was proclaimed.',
  ],
  s0054: [
    'Ministers were ordered to memorialize facts genuinely.',
    'Officials were told to speak frankly in memorials.',
  ],
  s0055: [
    'On day dingchou Prince Yu Xing of the Bordered Yellow Banner was deprived of his rank and confined for crime.',
    'On dingchou Prince Yu Xing lost his rank and was confined.',
  ],
  s0056: [
    'On day renwu Brigadier Yang Yuchun was made Junior Guardian of the Heir Apparent and granted double peacock feathers.',
    'On renwu Yang Yuchun became Junior Guardian of the Heir Apparent with double peacock plumes.',
  ],
  s0057: [
    'That month, seven Henan districts including Suizhou were relieved for flood, with one month\'s rations for four districts including Suizhou.',
    'That month seven Henan flood districts were relieved, four with a month\'s rations.',
  ],
  s0058: [
    'Winter, tenth month, day wuzi: Yinghe was transferred to Minister of Revenue; Nayancheng to Personnel; Mukedeng\'e to Works; Pugong to Rites; Heshen Tai to Colonial Affairs; Songyun to Left Censor-in-Chief.',
    'In month 10, wuzi, Yinghe took revenue, Nayancheng personnel, Mukedeng\'e works, Pugong rites, Heshen Tai colonial affairs, Songyun the left censorate.',
  ],
  s0059: [
    'On day xinchou the late Emperor\'s honorific temple name was performed.',
    'On xinchou the late emperor received his temple name and honorific.',
  ],
  s0060: [
    'The next day an edict was promulgated empire-wide; grace was extended by degree.',
    'The next day an empire-wide edict granted graded favors.',
  ],
  s0061: [
    'On day jiachen Jiangsu\'s eight flooded districts including Jiangning were relieved; Anhui\'s Fengyang and subordinate districts for water disaster.',
    'On jiachen eight flooded Jiangsu districts including Jiangning and Fengyang in Anhui were relieved.',
  ],
  s0062: [
    'On day wushen Deying\'a was made Urumqi commander.',
    'On wushen Deying\'a became Urumqi commander.',
  ],
  s0063: [
    'That month, eight districts including Haizhou in Jiangnan and Sizhou in Anhui for flood and drought; tunwei as well.',
    'That month eight Jiangnan and Anhui districts, including tunwei settlements, were relieved for flood and drought.',
  ],
  s0064: [
    'Poor of thirty-three Zhejiang counties including Xiaoshan were given rations.',
    'Thirty-three Zhejiang counties including Xiaoshan received poor relief grain.',
  ],
  s0065: [
    'Eleventh month, day bingchen: the Emperor installed the Empress Dowager at the Palace of Longevity and Health.',
    'In month 11, bingchen, Minning installed the Empress Dowager at the Palace of Longevity and Health.',
  ],
  s0066: [
    'On day wuchen Wei Yuanyu was made Jiangsu governor; Zuo Fu Hunan governor.',
    'On wuchen Wei Yuanyu took Jiangsu and Zuo Fu Hunan.',
  ],
  s0067: [
    'On day gengwu, winter solstice, Heaven was sacrificed to at the Round Mound.',
    'On gengwu, the winter solstice, Minning sacrificed to Heaven at the Round Mound.',
  ],
  s0068: [
    'Henceforth this was done every year.',
    'Thereafter he did so every year.',
  ],
  s0069: [
    'On day guiyou Chengan was made Left Censor-in-Chief; Songyun Rehe commander.',
    'On guiyou Chengan took the left censorate and Songyun became Rehe commander.',
  ],
  s0070: [
    'On day jiaxu Chengan was transferred to Bordered Yellow Chinese Banner commander.',
    'On jiaxu Chengan became Bordered Yellow Chinese Banner commander.',
  ],
  s0071: [
    'Wen Fu was made Left Censor-in-Chief.',
    'Wen Fu took the left censorate.',
  ],
  s0072: [
    'On day dingchou Hanlin Reader Gu Chun memorialized that Songyun should be kept at the Emperor\'s side; he offended the throne and was referred for severe deliberation.',
    'On dingchou Gu Chun urged keeping Songyun near the throne, offended the Emperor, and faced severe review.',
  ],
  s0073: [
    'Twelfth month, day jiashen: the Empress Dowager was given the honorific Empress Dowager Gongci.',
    'In month 12, jiashen, the Empress Dowager received the honorific Gongci.',
  ],
  s0074: [
    'The next day an edict was promulgated empire-wide; grace was extended by degree.',
    'The next day an empire-wide edict granted graded favors.',
  ],
  s0075: [
    'An edict transmitted the Empress Dowager\'s decree: the Emperor\'s consort, Lady Niohuru of the second rank, was installed as Empress.',
    'By the Empress Dowager\'s order Minning\'s consort Niohuru became Empress.',
  ],
  s0076: [
    'On day bingxu Heshen Tai was transferred to Fuzhou general.',
    'On bingxu Heshen Tai became Fuzhou general.',
  ],
  s0077: [
    'Jinchang was made Minister of the Court of Colonial Affairs.',
    'Jinchang took the Colonial Affairs ministry.',
  ],
  s0078: [
    'Qingbao was transferred to Fujian-Zhejiang governor-general.',
    'Qingbao became Fujian-Zhejiang governor-general.',
  ],
  s0079: [
    'Shi Zhiguang was made Yunnan-Guizhou governor-general; Han Kejun Yunnan governor; Yan Jian Fujian governor.',
    'Shi Zhiguang took Yunnan-Guizhou; Han Kejun Yunnan; Yan Jian Fujian.',
  ],
  s0080: [
    'On day gengyin the Henan Yifeng breach closed.',
    'On gengyin the Henan Yifeng dike closed.',
  ],
  s0081: [
    'On day guisi added honorific titles for Empress Xiaogong Xian, Xiaosheng Xian, the Gaozong Chun Emperor, Xiaoxian Chun Empress, and Xiaoyi Chun Empress.',
    'On guisi added posthumous titles for earlier empresses and Gaozong.',
  ],
  s0082: [
    'Yinghe was dismissed from the Grand Council and continued at his former ministerial posts.',
    'Yinghe left the Grand Council but kept his ministries.',
  ],
  s0083: [
    'On day bingchen because Wang Tingzhen, Tang Jinzhao, Fang Shoudi, and Jiang Yinshe spoke on investigating corrupt practices and were inconvenient to reward, while Sun Yuting\'s memorial was especially pointed—a warm edict praised him.',
    'On bingchen Wang Tingzhen and others were passed over for rewards after attacking corrupt fees, but Sun Yuting\'s pointed memorial won warm praise.',
  ],
  s0084: [
    'Li Hongbin was recalled as Anhui governor.',
    'Li Hongbin returned as Anhui governor.',
  ],
  s0085: [
    'Zhang Yinghan was summoned to the capital; Chen Ruolin was made Huguang governor-general; Shuai Chengying Zhejiang governor.',
    'Zhang Yinghan was called to Beijing; Chen Ruolin took Huguang; Shuai Chengying Zhejiang.',
  ],
  s0086: [
    'That year Korea and Ryukyu sent tribute.',
    'That year Korea and Ryukyu sent tribute.',
  ],
  s0087: [
    'Daoguang 1, spring, first month, day guichou: the Emperor received court at the Hall of Supreme Harmony; music was set but not played; felicitations were not read.',
    'In Daoguang 1, month 1, guichou, Minning received court at the Hall of Supreme Harmony without music or congratulatory scrolls.',
  ],
  s0088: [
    'On day bingchen Junior Secretary Chu Pengling of the Board of Punishments was granted Vice Minister of Rites rank.',
    'On bingchen Chu Pengling of Punishments received Vice Minister of Rites rank.',
  ],
  s0089: [
    'The Zhejiang salt controller post was abolished; the governor was to oversee it concurrently.',
    'Zhejiang\'s salt post was abolished and the governor took charge.',
  ],
  s0090: [
    'On day jiwei Wen Fu was made Minister of Rites; Na Qing\'an Left Censor-in-Chief.',
    'On jiwei Wen Fu took rites and Na Qing\'an the left censorate.',
  ],
  s0091: [
    'On day dingmao Vietnam sent an incense offering, congratulatory memorial, and tribute; an edict ordered it stopped.',
    'On dingmao Vietnam\'s incense mission and tribute were refused by edict.',
  ],
  s0092: [
    'On day bingzi the King of Korea Li Xi offered a memorial of condolence;',
    'On bingzi Korea\'s King Li Xi sent a condolence memorial;',
  ],
  s0093: [
    'the King of Nepal Hotradandabigarmasaya reported mourning for Renzong\'s ascension, presented gold brocade; an imperial letter granted praise and reward.',
    'Nepal\'s king mourned Renzong, sent gold brocade, and received an imperial letter of praise.',
  ],
  s0094: [
    'Second month, new moon on day renwu: there was a solar eclipse.',
    'In month 2, renwu new moon, there was a solar eclipse.',
  ],
  s0095: [
    'The Panchen Lama sent tribute objects; an imperial letter praised and rewarded.',
    'The Panchen Lama sent tribute and received an imperial letter of praise and reward.',
  ],
  s0096: [
    'On day wuxu Associate Grand Secretary Wu Jun was granted leave.',
    'On wuxu Wu Jun retired on leave.',
  ],
  s0097: [
    'On day gengzi Sun Yuting was ordered Associate Grand Secretary while remaining Liang-Jiang governor-general.',
    'On gengzi Sun Yuting became associate grand secretary while staying at Liang-Jiang.',
  ],
  s0098: [
    'Shaanxi-Gansu Governor-General Changling was made Junior Guardian of the Heir Apparent.',
    'Changling became Junior Guardian of the Heir Apparent.',
  ],
  s0099: [
    'On day jiachen seed-loan grain arrears were remitted for six Jiangxi counties including Fengcheng.',
    'On jiachen six Jiangxi counties including Fengcheng lost seed-loan grain arrears.',
  ],
  s0100: [
    'Third month, new moon on day xinhai: the Directorate of Astronomy reported that on the first day of the fourth month this year the sun and moon would join in brilliance and the five planets align in a pearl string.',
    'In month 3, xinhai new moon, the Astronomical Bureau reported a sun-moon conjunction and five-planet alignment on the first day of month 4.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b01.mjs <translation.json>'
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
