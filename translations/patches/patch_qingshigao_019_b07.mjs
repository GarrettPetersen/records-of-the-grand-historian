#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'That month, one quarter\'s army pay was loaned to eight camps including Jingzuo in the Jiangsu disaster area.',
    'That month Jiangsu disaster camps including Jingzuo received a quarter\'s army pay on loan.',
  ],
  s0602: [
    'Third month, day gengyin: Xu Guangjin and others memorialized that soldiers and people were protecting one another, inner rivers and outer seas were being strictly guarded, and English entry into the provincial capital was absolutely impermissible.',
    'In the third month, on gengyin day, Xu Guangjin reported tight coastal defense and insisted the English must not enter the provincial capital.',
  ],
  s0603: [
    'An edict praised and accepted it.',
    'The court praised and approved the memorial.',
  ],
  s0604: [
    'Summer, fourth month, day renyin: Li Xingyuan was dismissed for illness; Lu Jianying was made Liang-Jiang governor-general; Fu Shengxun was transferred as Jiangsu governor; Fei Kaishou was made Jiangxi governor.',
    'In summer, month 4, renyin, Li Xingyuan left office for illness; Lu Jianying took Liang-Jiang, Fu Shengxun Jiangsu, and Fei Kaishou Jiangxi.',
  ],
  s0605: [
    'On day bingwu, Lu Jianying and others memorialized that southern grain transport need not be converted to cash payments; the Emperor assented.',
    'On bingwu day, Lu Jianying won assent to keep southern tribute grain unconverted.',
  ],
  s0606: [
    'On day dingwei, Xu Guangjin memorialized that the English had abandoned talks on entering the city.',
    'On dingwei day, Xu Guangjin reported the English had dropped demands to enter the city.',
  ],
  s0607: [
    'Xu Guangjin was enfeoffed as viscount and Ye Mingchen as baron, both with first-rank hereditary succession.',
    'Xu Guangjin became a hereditary viscount and Ye Mingchen a hereditary baron of the first rank.',
  ],
  s0608: [
    'An edict praised and rewarded the Cantonese for deeply understanding righteousness.',
    'The court praised Guangdong for grasping the larger duty.',
  ],
  s0609: [
    'Intercalary fourth month, day xinwei: Yan Yiyu was ordered to administer as Hedong Grand Canal governor-general.',
    'In the intercalary fourth month, on xinwei day, Yan Yiyu acted as Hedong canal governor-general.',
  ],
  s0610: [
    'On day guiyou, Zhao Bingyan was transferred as Hunan governor and Luo Raodian as Hubei governor.',
    'On guiyou day, Zhao Bingyan took Hunan and Luo Raodian Hubei.',
  ],
  s0611: [
    'On day xinsi, Qishan suppressed the Zhongzhandui tribes and defeated them.',
    'On xinsi day, Qishan defeated the Zhongzhandui tribes.',
  ],
  s0612: [
    'On day renwu, Deling was made Yarkand resident commissioner.',
    'On renwu day, Deling became Yarkand resident commissioner.',
  ],
  s0613: [
    'Fifth month, day yisi: the Guangdong Macao tax station was moved to Huangpu.',
    'In the fifth month, on yisi day, Macao customs moved to Huangpu.',
  ],
  s0614: [
    'On day jiyou, wild tribes in Tengyue subprefecture, Yunnan, rebelled; Lin Zexu quelled them.',
    'On jiyou day, Yunnan Tengyue tribes rebelled and Lin Zexu suppressed them.',
  ],
  s0615: [
    'On day jiwei, Shanxi governor Wang Zhaochen was stripped of office and arrested for accepting bribes; Ji Zhichang was made Shanxi governor.',
    'On jiwei day, Wang Zhaochen lost Shanxi for bribery and Ji Zhichang replaced him.',
  ],
  s0616: [
    'That month, granary grain was loaned for hail disaster in Teng county, Shandong.',
    'That month Shandong\'s Teng county received hail-disaster granary loans.',
  ],
  s0617: [
    'Sixth month, day bingzi: bandits in Yangshan and Yingde counties, Guangdong, were pacified.',
    'In the sixth month, on bingzi day, Guangdong bandits in Yangshan and Yingde were pacified.',
  ],
  s0618: [
    'On day jichou, Minister of Rites Cheng Gang died.',
    'On jichou day, Minister of Rites Cheng Gang died.',
  ],
  s0619: [
    'On day gengyin, Yushu was transferred as Urumchi general and Wei Qin as Rehe general.',
    'On gengyin day, Yushu went to Urumchi and Wei Qin became Rehe general.',
  ],
  s0620: [
    'Autumn, seventh month, new moon day bingchen: bandits led by Lin Shi and others in Min county, Fujian, rebelled; they were captured and executed.',
    'In the seventh autumn month, on the new moon bingchen, Fujian Min county rebels under Lin Shi were captured and executed.',
  ],
  s0621: [
    'On day wuxu, Cooperating Grand Secretary and Minister of Personnel Chen Guanjun died; Jia Zhen was transferred as Minister of Personnel.',
    'On wuxu day, Chen Guanjun died; Jia Zhen became Minister of Personnel.',
  ],
  s0622: [
    'Sun Ruizhen was made Minister of Rites and Wang Guangyin Left Censor-in-Chief.',
    'Sun Ruizhen took Rites and Wang Guangyin the left censorate.',
  ],
  s0623: [
    'Feng Dexin was made Hunan governor.',
    'Feng Dexin became Hunan governor.',
  ],
  s0624: [
    'On day jihai, Qi Junzao was ordered to cooperate as Grand Secretary.',
    'On jihai day, Qi Junzao was ordered to serve as cooperating grand secretary.',
  ],
  s0625: [
    'On day xinhai, Hunan provincial treasurer Wan Gongzhen was ordered to relieve flood victims in Wuling and other counties.',
    'On xinhai day, Wan Gongzhen was sent to relieve flood victims in Wuling and other Hunan counties.',
  ],
  s0626: [
    'On day bingchen, Wang Zhaochen was sent into exile in Xinjiang.',
    'On bingchen day, Wang Zhaochen was exiled to Xinjiang.',
  ],
  s0627: [
    'On day jiwei, Lin Zexu was dismissed for illness; Cheng Yucai was made Yunnan-Guizhou governor-general and Zhang Rizhao Yunnan governor.',
    'On jiwei day, Lin Zexu left office for illness; Cheng Yucai took Yunnan-Guizhou and Zhang Rizhao Yunnan.',
  ],
  s0628: [
    'Vice Minister Dai Xi was reduced to third-rank hat and granted retirement.',
    'Dai Xi retired with a reduced third-rank hat.',
  ],
  s0629: [
    'That month, famine rations were given for flood in five counties including Dehua, Jiangxi, and nine prefectures and counties including Lizhou, Hunan.',
    'That month flood rations went to five Jiangxi counties including Dehua and nine Hunan districts including Lizhou.',
  ],
  s0630: [
    'New and old quota levies were remitted or deferred for twenty-two subprefectures and counties including Chuansha, Jiangsu.',
    'Jiangsu\'s twenty-two districts including Chuansha had new and old quotas remitted or deferred.',
  ],
  s0631: [
    'Eighth month, day dingchou: Lu Jianying memorialized on relief work and conditions after the waters receded.',
    'In the eighth month, on dingchou day, Lu Jianying reported on relief and recession of the flood.',
  ],
  s0632: [
    'An edict said: "The welfare of ministers and people is the Emperor\'s welfare.',
    'The court said: "The people\'s welfare is the Emperor\'s welfare.',
  ],
  s0633: [
    '" On day bingxu, Ji Zhichang was summoned to the capital; Gong Yu acted as Shanxi governor.',
    '" On bingxu day, Ji Zhichang was recalled and Gong Yu acted as Shanxi governor.',
  ],
  s0634: [
    'That month, famine rations were given to Jinzhou banner people in Fengtian, nine counties including Poyang in Jiangxi, and ten prefectures and counties including Lizhou in Hunan.',
    'That month flood rations went to Fengtian Jinzhou bannermen, nine Jiangxi counties including Poyang, and ten Hunan districts including Lizhou.',
  ],
  s0635: [
    'Ninth month, day jiachen: Buyantai was dismissed for illness; Qishan acted as Shaanxi-Gansu governor-general and Yusheng acted as Sichuan governor-general.',
    'In the ninth month, on jiachen day, Buyantai left office; Qishan acted at Shaanxi-Gansu and Yusheng at Sichuan.',
  ],
  s0636: [
    'On day bingwu, Yan Yiyu was appointed Hedong Grand Canal governor-general.',
    'On bingwu day, Yan Yiyu received the Hedong canal post.',
  ],
  s0637: [
    'On day wushen, acting Vice Minister of Personnel Ji Zhichang was ordered to serve on the Grand Council.',
    'On wushen day, acting personnel vice minister Ji Zhichang joined the Grand Council.',
  ],
  s0638: [
    'On day jiyou, Qishan was appointed Shaanxi-Gansu governor-general.',
    'On jiyou day, Qishan received Shaanxi-Gansu.',
  ],
  s0639: [
    'Xu Zechun was made Sichuan governor-general and Chen Qingxie Shandong governor.',
    'Xu Zechun became Sichuan governor-general and Chen Qingxie Shandong governor.',
  ],
  s0640: [
    'On day guichou, wild tribes beyond Baoshan, Yunnan, including Xiaoyujiang, rebelled; Cheng Yucai suppressed them.',
    'On guichou day, Yunnan tribes beyond Baoshan rebelled and Cheng Yucai put them down.',
  ],
  s0641: [
    'On day wuwu, Minister He Rulin, having completed mourning, was again ordered to serve on the Grand Council.',
    'On wuwu day, He Rulin, back from mourning, rejoined the Grand Council.',
  ],
  s0642: [
    'That month, famine rations were given for flood in Tongzi county, Guizhou, and quota levies were remitted or deferred.',
    'That month Guizhou\'s Tongzi received flood rations and tax relief.',
  ],
  s0643: [
    'Winter, tenth month, day gengwu: because the former king of Korea, Li Huan\'s son Bian, succeeded to the title, Ruichang and Heseben were sent to invest him.',
    'In the tenth winter month, on gengwu day, Ruichang and Heseben were sent to invest Korea\'s new king Bian.',
  ],
  s0644: [
    'On day jiashen, Grand Secretary Pan Shien asked to be relieved of duty and was removed from the Grand Council.',
    'On jiashen day, Pan Shien left office and left the Grand Council.',
  ],
  s0645: [
    'On day gengyin, Gengfu acted as Rehe general.',
    'On gengyin day, Gengfu acted as Rehe general.',
  ],
  s0646: [
    'That month, famine rations were given to seven prefectures and counties including Lizhou, Hunan, and Xugou county, Shanxi.',
    'That month seven Hunan districts including Lizhou and Shanxi\'s Xugou received famine rations.',
  ],
  s0647: [
    'New and old quota levies were remitted or deferred for thirty-seven prefectures and counties including Jizhou, Zhili, twenty-one counties including Fuyang, Zhejiang, and three subprefectures and counties including Salaqi, Shanxi.',
    'Tax relief covered thirty-seven Zhili districts, twenty-one Zhejiang counties, and three Shanxi units including Salaqi.',
  ],
  s0648: [
    'Eleventh month, new moon day jiawu: bandits led by Li Yuanfa in Xinning county, Hunan, rebelled; Feng Dexin was ordered to suppress them.',
    'In the eleventh month, on the new moon jiawu, Hunan Xinning rebels under Li Yuanfa rose and Feng Dexin was sent against them.',
  ],
  s0649: [
    'On day bingshen, Grand Tutor and retired Grand Secretary Ruan Yuan died.',
    'On bingshen day, Ruan Yuan, grand tutor and retired grand secretary, died.',
  ],
  s0650: [
    'On day jiachen, Gong Yu was transferred as Hubei governor and Zhaonasutu as Shanxi governor.',
    'On jiachen day, Gong Yu took Hubei and Zhaonasutu Shanxi.',
  ],
  s0651: [
    'On day yisi, the A-ge residence caught fire.',
    'On yisi day, the princes\' quarters burned.',
  ],
  s0652: [
    'On day gengxu, bandits led by Wu Xun and others in Jiayi county, Taiwan, rebelled; they were captured and executed.',
    'On gengxu day, Taiwan Jiayi rebels under Wu Xun were captured and executed.',
  ],
  s0653: [
    'That month, flood disaster in fourteen counties including Dehua, Jiangxi, was relieved.',
    'That month fourteen Jiangxi counties including Dehua received flood relief.',
  ],
  s0654: [
    'Famine rations were given to banner people in six cities including Qiqihar and to saltern households in eight fields including Renhe, Zhejiang.',
    'Qiqihar and five other cities\' bannermen and eight Zhejiang salterns received famine rations.',
  ],
  s0655: [
    'New and old quota levies were remitted or deferred for seventy-three prefectures, subprefectures, counties, and garrisons including Taizhou, Jiangsu, twenty-one counties including Dehua, Jiangxi, and saltern levies in fourteen fields including Haisha, Zhejiang.',
    'Tax relief covered seventy-three Jiangsu units, twenty-one Jiangxi counties, and fourteen Zhejiang salterns.',
  ],
  s0656: [
    'Twelfth month, day gengwu: bandits led by Huang San and others in Daozhou, Hunan, rebelled; Yutai was ordered to suppress them.',
    'In the twelfth month, on gengwu day, Daozhou rebels under Huang San rose and Yutai was sent against them.',
  ],
  s0657: [
    'Zhalafentai was made Tarbagatai resident commissioner.',
    'Zhalafentai became Tarbagatai resident commissioner.',
  ],
  s0658: [
    'On day xinwei, the Empress Dowager fell ill; the Emperor went to Cining Palace to inquire after her health, and did so daily thereafter.',
    'On xinwei day, the empress dowager fell ill and the Emperor began daily visits to Cining Palace.',
  ],
  s0659: [
    'On day jiaxu, the Empress Dowager died.',
    'On jiaxu day, the empress dowager died.',
  ],
  s0660: [
    'On day yihai, the coffin of the late empress dowager was placed in Cining Palace.',
    'On yihai day, the dowager\'s coffin was installed at Cining Palace.',
  ],
  s0661: [
    'The Emperor dwelt in a mourning shed, sleeping on the ground on rush mats.',
    'The Emperor mourned in a shed, sleeping on rush mats on the ground.',
  ],
  s0662: [
    'Princes and ministers asked him to return to the palace; he did not consent.',
    'Princes and ministers begged him to return to the palace; he refused.',
  ],
  s0663: [
    'On day jiashen, the empress dowager\'s coffin was moved to Yinghui Hall in the Qichun Garden.',
    'On jiashen day, the coffin was moved to Yinghui Hall in Qichun Garden.',
  ],
  s0664: [
    'From then on the Emperor dwelt in mourning quarters at Shende Hall.',
    'Thereafter the Emperor kept mourning quarters at Shende Hall.',
  ],
  s0665: [
    'On day yiyou, Li Zhenhu was dismissed for illness; Chen Fuen was made Minister of Punishments.',
    'On yiyou day, Li Zhenhu left office and Chen Fuen became minister of punishments.',
  ],
  s0666: [
    'On day dinghai, Xinning rebels scattered into Guangxi; Zheng Zuchen sent troops to defend and suppress them.',
    'On dinghai day, Xinning rebels fled into Guangxi and Zheng Zuchen sent troops against them.',
  ],
  s0667: [
    'That year, Korea, Ryukyu, and Vietnam presented tribute.',
    'That year Korea, Ryukyu, and Vietnam sent tribute.',
  ],
  s0668: [
    'In the thirtieth year, spring, first month, new moon day jiawu: there was a solar eclipse.',
    'In year 30, spring, month 1, new moon jiawu, there was a solar eclipse.',
  ],
  s0669: [
    'On day bingshen, because Qi Junzao and others investigated and reported that Shaanxi-Gansu governor-general Buyantai\'s seal inspection had been lax, the case was referred to the Boards for severe deliberation.',
    'On bingshen day, Buyantai faced severe board review after Qi Junzao found lax seal control.',
  ],
  s0670: [
    'On day dingyou, because princes and ministers again asked that the Emperor stop personally escorting the late empress dowager\'s coffin, an edict assented.',
    'On dingyou day, the court assented when princes again asked the Emperor not to escort the coffin in person.',
  ],
  s0671: [
    'On day wuxu, the late empress dowager was given the honorific title Empress Xiaoyi, Respectful, Harmonious, Kind, Joyful, Secure, Accomplished, Radiant, Sagely, and Wise.',
    'On wuxu day, the late empress dowager received the posthumous title Empress Xiaoyi.',
  ],
  s0672: [
    'On day gengzi, the Emperor performed the great mourning rites before the coffin of Empress Xiaoyi at Yinghui Hall.',
    'On gengzi day, the Emperor performed great mourning rites before the dowager\'s coffin at Yinghui Hall.',
  ],
  s0673: [
    'On day jiachen, the Emperor performed the monthly mourning rites before the coffin.',
    'On jiachen day, the Emperor performed the monthly mourning rites before the coffin.',
  ],
  s0674: [
    'On day yisi, Empress Xiaoyi\'s mausoleum was titled Changxi Mausoleum.',
    'On yisi day, the dowager\'s tomb was named Changxi Mausoleum.',
  ],
  s0675: [
    'On day bingwu, the Emperor fell ill.',
    'On bingwu day, the Emperor fell ill.',
  ],
  s0676: [
    'On day dingwei, the Emperor\'s illness grew critical.',
    'On dingwei day, the Emperor\'s illness turned critical.',
  ],
  s0677: [
    'The Director of the Imperial Clan Zaiquan, Imperial Front Grandees Zaiyuan, Duanhua, and Sengge Rinchen, Grand Councillors Mujangga, Saishanga, He Rulin, Chen Fuen, and Ji Zhichang, and Chief Steward of the Imperial Household Weng Qing opened the sealed casket and proclaimed the imperial will: "The fourth imperial son is established as crown prince."',
    'Zaiquan, Zaiyuan, Duanhua, Sengge Rinchen, Mujangga, Saishanga, He Rulin, Chen Fuen, Ji Zhichang, and Weng Qing opened the sealed box and read: "Establish the fourth imperial son as crown prince."',
  ],
  s0678: [
    'That day, the Emperor died in mourning quarters at Shende Hall in the Yuanming Garden.',
    'That day the Emperor died at Shende Hall in the Yuanming Garden.',
  ],
  s0679: [
    'A vermillion edict said: "Enfeoff the sixth imperial son Yixin as prince."',
    'A vermillion edict enfeoffed the sixth son Yixin as prince.',
  ],
  s0680: [
    'Fourth month, day jiaxu: the late Emperor was given the posthumous title Emperor who accorded with Heaven and bore the mandate, established the central body, rectified the ultimate, was cultured and sagely, martial and wise, brave and benevolent, frugal and diligent, filial and keen, and accomplished; his temple name was Xuanzong.',
    'In month 4, jiaxu, the late Emperor received his full posthumous title and the temple name Xuanzong.',
  ],
  s0681: [
    'Xianfeng 2, second month, day renzi: burial at Mu Mausoleum.',
    'In Xianfeng 2, month 2, renzi, he was buried at Mu Mausoleum.',
  ],
  s0682: [
    'The commentators say: Xuanzong\'s respectful frugality and generous magnanimity made him an accomplished keeper of the heritage.',
    'The annalists say Xuanzong was frugal and magnanimous—a true keeper of the throne.',
  ],
  s0683: [
    'Distant peoples\' trade provoked quarrels and raised armies.',
    'Foreign trade stirred conflict and war.',
  ],
  s0684: [
    'Compared with the frontier troubles of former ages, they were hardly comparable.',
    'Beside earlier frontier troubles, these were in a different order.',
  ],
  s0685: [
    'The ministers in charge were first harsh and exacting, then fearful and hesitant, and thus left the worry of sleepless nights.',
    'Leading ministers began harsh, then grew timid, leaving the ruler sleepless with care.',
  ],
  s0686: [
    'As the saying goes, there was a ruler but no ministers—able to comply but unable to correct and rescue.',
    'So it was said: there was a ruler but no ministers—men who could flatter but not save the state.',
  ],
  s0687: [
    'The empire\'s verge of ruin began from this.',
    'The dynasty\'s slide toward ruin began here.',
  ],
  s0688: [
    'Alas, how remote!',
    'Alas, how far it has fallen!',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b07.mjs <translation.json>'
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
