#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Grand Secretary Tian Congdian, on leave, died.',
    'Grand Secretary Tian Congdian died while on leave.',
  ],
  s0402: [
    'On day guimao, Zha Lang\'a and Ji Zengyun were made Ministers of Personnel.',
    'On guimao day, Zha Lang\'a and Ji Zengyun became Ministers of Personnel.',
  ],
  s0403: [
    'On day renyin, an edict said: "Local officials\' private collection of surcharges is hard to abolish outright.',
    'On renyin day, an edict said local surcharge collection could not be fully abolished.',
  ],
  s0404: [
    'Governors and governors-general must use it cautiously and must not remit it to the public treasury.',
    'Governors were to use surcharges cautiously and not remit them to the treasury.',
  ],
  s0405: [
    'If it is remitted to the treasury, local officials will again levy doubly on the people.',
    'Remitting surcharges to the treasury would only make officials levy on the people again.',
  ],
  s0406: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0407: [
    'Fifth month, day guichou: Guo Shu was made governor of Guangxi.',
    'In the fifth month, on guichou day, Guo Shu became governor of Guangxi.',
  ],
  s0408: [
    'E\'ertai reported suppressing rebel Miao Lu Tianyou and Lu Shihao in Dongchuan and pacifying them; on day renxu, an edict said: "The \'advanced age\' provision among the Eight Regulations is not fully satisfactory in meaning.',
    'E\'ertai reported pacifying Dongchuan rebel Miao; on renxu day, an edict revised the Eight Regulations\' age rule.',
  ],
  s0409: [
    'Those advanced in age but still able to handle affairs shall not be placed under the Eight Regulations."',
    'Capable elderly officials were exempted from the Eight Regulations."',
  ],
  s0410: [
    '" On day dingmao, Funing\'an\'s marquis rank was stripped; he remained Grand Secretary.',
    'On dingmao day, Funing\'an lost his marquisate but stayed Grand Secretary.',
  ],
  s0411: [
    'Ma\'ersai was ordered to handle affairs among the Grand Secretaries.',
    'Ma\'ersai was ordered to manage Grand Secretariat business.',
  ],
  s0412: [
    'On day yihai, Tian Wenjing was made governor-general of Hedong, with concurrent jurisdiction over Shandong.',
    'On yihai day, Tian Wenjing became Hedong governor-general, also overseeing Shandong.',
  ],
  s0413: [
    'Geng Huazuo was made Han Chinese Banner commander-in-chief.',
    'Geng Huazuo became Han Banner commander-in-chief.',
  ],
  s0414: [
    'Sixth month, day gengchen: an edict made sixth-rank secretaries and seventh-rank clerks open posts without banner rotation for promotion.',
    'In the sixth month, ministry clerks were made open posts free of banner promotion rules.',
  ],
  s0415: [
    'On day guiwei, a Five Classics Erudite post was established for a descendant of the ancient sage Zhong Gong.',
    'On guiwei day, a Five Classics Erudite was appointed for Zhong Gong\'s descendant.',
  ],
  s0416: [
    'On day bingxu, Cai Liang was made general at Guangzhou, Shi Liha general at Fuzhou, and Yin Jishan was assigned to assist on Jiangnan river works.',
    'On bingxu day, Cai Liang and Shi Liha became generals; Yin Jishan assisted Jiangnan river works.',
  ],
  s0417: [
    'On day guisi, Zhang Guangsi was made governor of Guizhou and Yue Jun acting governor of Shandong.',
    'On guisi day, Zhang Guangsi became Guizhou governor and Yue Jun acting Shandong governor.',
  ],
  s0418: [
    'On day jihai, Prince Cheng Yin Zhi was demoted to commandery prince for crimes; his son Hongsheng was detained in the Imperial Clan Court.',
    'On jihai day, Prince Cheng Yin Zhi was demoted and his son Hongsheng was detained.',
  ],
  s0419: [
    'Prince Limi\'s son Hong Yan was enfeoffed as Defender Duke of the State.',
    'Prince Limi\'s son Hong Yan was made Defender Duke of the State.',
  ],
  s0420: [
    'Autumn, seventh month, day xinhai: Li Wei was ordered to take concurrent charge of arrest work in Jiangsu.',
    'In the seventh month, Li Wei was ordered to oversee Jiangsu arrests.',
  ],
  s0421: [
    'On day wuwu, E\'ertai reported dispatching troops to suppress rebel Miao at Mitie in Pingchuan.',
    'On wuwu day, E\'ertai reported suppressing rebel Miao at Mitie in Pingchuan.',
  ],
  s0422: [
    'The matter was placed under Sichuan provincial commander Huang Tinggui.',
    'The campaign was placed under Sichuan commander Huang Tinggui.',
  ],
  s0423: [
    'On day xinyou, Yue Zhongqi reported Poluonai\'s troops reaching Tibet; lamas captured and presented Arbu Ba, Longbunai, Zha\'ertai, and others; Tibet was pacified.',
    'On xinyou day, Yue Zhongqi reported Tibet pacified after rebel leaders were captured.',
  ],
  s0424: [
    'On day wuchen, Ji Chengbin was made provincial commander of Guyuan.',
    'On wuchen day, Ji Chengbin became Guyuan provincial commander.',
  ],
  s0425: [
    'On day renshen, Grand Secretary Funing\'an died.',
    'On renshen day, Grand Secretary Funing\'an died.',
  ],
  s0426: [
    'The late Grand Secretary Ning Wanwo\'s third-generation descendant Ning Lan was granted captaincy in the Deliberately Fearless Cavalry, one residence, and five hundred taels of silver; the fourth-generation descendant Ning Bangxi received the title Baitang\'a.',
    'Ning Wanwo\'s descendants Ning Lan and Ning Bangxi received offices, a house, silver, and a title.',
  ],
  s0427: [
    'Eighth month, day jiashen: the Emperor attended the Classics lecture.',
    'In the eighth month, on jiashen day, the Emperor held the Classics lecture.',
  ],
  s0428: [
    'Yin Jishan was made acting governor of Jiangsu.',
    'Yin Jishan became acting Jiangsu governor.',
  ],
  s0429: [
    'On day yiyou, the two native chieftaincies of Sangzhi and Baojing in Huguang were converted to regular administration.',
    'On yiyou day, Sangzhi and Baojing in Huguang were converted to regular administration.',
  ],
  s0430: [
    'Ma\'ersai was made Grand Secretary.',
    'Ma\'ersai became Grand Secretary.',
  ],
  s0431: [
    'On day jiawu, Zu Bingheng was made general at Jingkou.',
    'On jiawu day, Zu Bingheng became Jingkou general.',
  ],
  s0432: [
    'On day dingwei, an edict restored the provincial and metropolitan examinations in Zhejiang.',
    'On dingwei day, Zhejiang provincial and metropolitan examinations were restored.',
  ],
  s0433: [
    'Ninth month, day guichou: an order required that descendants of meritorious Eight Banner families who broke the law or caused treasury deficits be investigated and reported when verified.',
    'In the ninth month, meritorious banner descendants who broke the law were to be investigated and reported.',
  ],
  s0434: [
    'Children and grandchildren of Han officials who died in battle or served with integrity were to be reported under the same procedure.',
    'Descendants of loyal or upright Han officials were reported the same way.',
  ],
  s0435: [
    'Grand Duke E Qi, commanding the Tianjin naval camp, had his title stripped for failure to supervise soldiers who wounded an official; he was demoted to third-class bodyguard.',
    'E Qi lost his title and was demoted for failing to stop soldiers who wounded an official.',
  ],
  s0436: [
    'On day dingmao, Zha Lang\'a reported leading troops to Tibet; together with Vice Commander-in-chief Mara and Academician Sengge they examined the rebel leaders Arbu Ba and others, executed them at once, and disposed of the rest.',
    'On dingmao day, Zha Lang\'a reported executing Tibetan rebel leaders and disposing of the rest.',
  ],
  s0437: [
    'Winter, tenth month, day dinghai: for E\'ertai\'s suppression of rebel Miao at Badazhai in Guangxi, he was given concurrent supervision of Yunnan, Guizhou, and Guangxi; one hundred thousand taels were issued from the treasury to reward Yunnan and Guizhou troops.',
    'In the tenth month, E\'ertai was given three-province supervision and one hundred thousand taels to reward troops.',
  ],
  s0438: [
    'On day xinmao, nine hundred forty thousand taels from the inner treasury were issued to cover indemnities and recovered funds for soldiers on the western expedition.',
    'On xinmao day, 940,000 taels were issued for western expedition indemnities.',
  ],
  s0439: [
    'Shi Wenchao was made Minister of Rites and Lu Zhenyang Minister of War.',
    'Shi Wenchao and Lu Zhenyang became Ministers of Rites and War.',
  ],
  s0440: [
    'On day yiwei, Yue Zhongqi reported Tibetan bandits at Lawuwo in Jianchang in revolt; they were suppressed and pacified.',
    'On yiwei day, Yue Zhongqi reported suppressing Jianchang Tibetan rebels.',
  ],
  s0441: [
    'An edict said: "Huguang has many native chieftains who perform duties and pay tribute no differently from regular officials; governors must not lightly propose converting them to regular administration.',
    'An edict warned governors not to lightly convert Huguang native chieftains to regular administration.',
  ],
  s0442: [
    '" Cai Shishan was made Zhejiang moral-reform commissioner.',
    'Cai Shishan became Zhejiang moral-reform commissioner.',
  ],
  s0443: [
    'On day guisi, an instruction ordered princes to cease managing banner affairs.',
    'On guisi day, princes were ordered to stop managing banner affairs.',
  ],
  s0444: [
    'Eleventh month, day bingchen: the Xian\'an Palace official school was established for booi bondsmen to study.',
    'In the eleventh month, the Xian\'an Palace school was opened for booi students.',
  ],
  s0445: [
    'On day gengshen, executions for the year were suspended.',
    'On gengshen day, executions were halted for the year.',
  ],
  s0446: [
    'On day wuchen, Jiangxi Governor Burantai was dismissed for incompetence.',
    'On wuchen day, Jiangxi Governor Burantai was dismissed.',
  ],
  s0447: [
    'One additional Western assistant director was added at the Directorate of Astronomy.',
    'A Western assistant director was added at the Directorate of Astronomy.',
  ],
  s0448: [
    'Twelfth month, day jiawu: seven years of quota land tax for Chongqing prefecture in Sichuan were remitted.',
    'In the twelfth month, seven years of Chongqing tax were remitted.',
  ],
  s0449: [
    'On day bingshen, the Completed Qing Code with Collected Explanations and Appended Precedents was finished.',
    'On bingshen day, the Completed Qing Code with Explanations and Precedents was finished.',
  ],
  s0450: [
    'On day dingyou, for pacifying Tibet Poluonai was enfeoffed as beile to administer rear Tibet; two kalons were selected to administer front Tibet; his soldiers were rewarded with thirty thousand taels of silver.',
    'On dingyou day, Poluonai was enfeoffed to rule Tibet; kalons were chosen and troops rewarded.',
  ],
  s0451: [
    'On day gengzi, Vice Ministers Wang Ji and Peng Weixin were ordered to Jiangnan to investigate delinquent taxes.',
    'On gengzi day, Wang Ji and Peng Weixin were sent to Jiangnan to investigate tax arrears.',
  ],
  s0452: [
    'On day jiachen, the joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On jiachen day, the joint seasonal sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s0453: [
    'This year, disaster land tax for twenty-six prefectures and counties in Zhili, Jiangnan, Shaanxi, Sichuan, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in twenty-six districts across several provinces.',
  ],
  s0454: [
    'Korea paid tribute.',
    'Korea sent tribute.',
  ],
  s0455: [
    'Seventh year, spring, first month, day xinhai: E\'ertai reported that on the Longevity Festival auspicious clouds appeared in Yunnan.',
    'In the seventh year, on the first day of spring, E\'ertai reported auspicious clouds in Yunnan on the Longevity Festival.',
  ],
  s0456: [
    'An order was issued to announce this to the Historiographical Institute.',
    'The court ordered the event recorded in the Historiographical Institute.',
  ],
  s0457: [
    'On day dingsi, Chen Yuanlong and Yin Tai were made Grand Secretaries.',
    'On dingsi day, Chen Yuanlong and Yin Tai became Grand Secretaries.',
  ],
  s0458: [
    'On day renshen, the Mongol Enggeder\'s marquisate was restored to third-rank duke, inherited by his great-grandson Ga\'ersa.',
    'On renshen day, Enggeder\'s title was restored as third-rank duke for his great-grandson Ga\'ersa.',
  ],
  s0459: [
    'Mongol second-rank count Ming\'an was promoted to first-rank marquis; his grandson Malantai inherited.',
    'Ming\'an was promoted to first-rank marquis; his grandson Malantai inherited.',
  ],
  s0460: [
    'Commander-in-chief fourth-rank count Si Ge was imprisoned for crimes; the Emperor, remembering his grandfather Manggu\'erdai\'s merit, released him.',
    'Si Ge was imprisoned but released in memory of his grandfather Manggu\'erdai\'s merit.',
  ],
  s0461: [
    'On day guiyou, Vice Minister Fabao and others were ordered to inspect and repair the main road from Zhili to Jiangnan.',
    'On guiyou day, Fabao and others were ordered to repair the Zhili–Jiangnan highway.',
  ],
  s0462: [
    'Second month, day dingchou: expedition troops were ordered to receive sitting grain rations in addition to marching grain.',
    'In the second month, expedition troops received sitting grain as well as marching grain.',
  ],
  s0463: [
    'Yin Jishan was made Director-General of Rivers and Waterways.',
    'Yin Jishan became Director-General of Rivers and Waterways.',
  ],
  s0464: [
    'On day wuyin, Duosuoli was made general at Fengtian.',
    'On wuyin day, Duosuoli became Fengtian general.',
  ],
  s0465: [
    'On day jiashen, the Emperor visited the imperial tombs.',
    'On jiashen day, the Emperor visited the imperial tombs.',
  ],
  s0466: [
    'On day gengyin, he returned to the capital.',
    'On gengyin day, the Emperor returned to Beijing.',
  ],
  s0467: [
    'A Zhili agricultural inspection censor was established.',
    'A Zhili agricultural inspection censor was appointed.',
  ],
  s0468: [
    'On day jihai, Prince Yi and others were ordered to investigate banner hereditary posts vacated for lack of heirs; clansmen might be allowed to continue the title.',
    'On jihai day, Prince Yi was ordered to allow clansmen to continue vacant banner titles.',
  ],
  s0469: [
    'On day yiwei, the Emperor attended the Classics lecture.',
    'On yiwei day, the Emperor held the Classics lecture.',
  ],
  s0470: [
    'Li Shu was made Han Banner commander-in-chief.',
    'Li Shu became Han Banner commander-in-chief.',
  ],
  s0471: [
    'Zhejiang\'s annual quota land tax of six hundred thousand taels was remitted for the year.',
    'Zhejiang\'s annual land tax of six hundred thousand taels was remitted.',
  ],
  s0472: [
    'Third month, day yisi, first day of the month: Kong Yu\'e was made Director-General of Jiangnan Rivers; Hao Yulin governor of Guangdong.',
    'On the first of the third month, Kong Yu\'e and Hao Yulin received new appointments.',
  ],
  s0473: [
    'Yue Zhongqi reported suppressing over one hundred rebel Miao stockades at Leibo.',
    'Yue Zhongqi reported pacifying more than one hundred Leibo rebel stockades.',
  ],
  s0474: [
    'On day wushen, E\'ertai reported suppressing raw Miao at Danjiang, Jiugu, and elsewhere.',
    'On wushen day, E\'ertai reported pacifying raw Miao at Danjiang and Jiugu.',
  ],
  s0475: [
    'Henan\'s annual quota land tax of four hundred thousand taels was remitted.',
    'Henan\'s annual land tax of four hundred thousand taels was remitted.',
  ],
  s0476: [
    'On day xinhai, Ji Zengyun was made governor-general of Henan and Shandong.',
    'On xinhai day, Ji Zengyun became Henan–Shandong governor-general.',
  ],
  s0477: [
    'On day bingshen, because Dzungar Galdan Tsering was deeply wicked and treacherous and would ultimately menace the frontier, Fu Erdan was made Great General for Pacifying the Frontier for the northern route and Yue Zhongqi Great General for Pacifying the Distance for the western route to campaign against Dzungaria.',
    'On bingshen day, Fu Erdan and Yue Zhongqi were made generals to campaign against Dzungaria.',
  ],
  s0478: [
    'On day jiazi, E Shan and Mang Hulu were both made Mongol commanders-in-chief.',
    'On jiazi day, E Shan and Mang Hulu became Mongol commanders-in-chief.',
  ],
  s0479: [
    'On day xinyou, an edict made Gongbasei deputy general, Prince Xun of the Commandery Xibao Pacifying Martial General, with Chen Tai, Guntai, Shi Liha, Daihao, Dafu, and Hailan as advisers; six thousand banner troops, eight thousand from three provinces, and eight hundred Mongol troops were assigned to the northern route, encamped at Altai;',
    'On xinyou day, generals and advisers were appointed and northern-route forces encamped at Altai;',
  ],
  s0480: [
    'Brigadier-generals Wei Lin and Shan Wenxiu led eight thousand cavalry camp troops to the western route at Bur Ha.',
    'Wei Lin and Shan Wenxiu led eight thousand cavalry to the western route at Bur Ha.',
  ],
  s0481: [
    'Summer, fourth month, day jiawu: Zha Lang\'a was made acting governor-general of Shaanxi and Sichuan; Shi Yizhi acting governor-general of Fujian.',
    'In the fourth month, Zha Lang\'a and Shi Yizhi became acting governors-general.',
  ],
  s0482: [
    'An imperial order established altars and temples to Cloud, Rain, Wind, and Thunder.',
    'Altars and temples to Cloud, Rain, Wind, and Thunder were ordered built.',
  ],
  s0483: [
    'Sichuan\'s Tianquan native chieftaincy was converted to regular administration and made a prefecture.',
    'Sichuan\'s Tianquan chieftaincy was converted to a regular prefecture.',
  ],
  s0484: [
    'Gao Qizhuo impeached Marquis Haicheng Huang Yingzuan for bribing to inherit his title; he should be stripped of rank.',
    'Gao Qizhuo urged stripping Huang Yingzuan for bribing to inherit his marquisate.',
  ],
  s0485: [
    'An edict granted leniency.',
    'The Emperor granted leniency.',
  ],
  s0486: [
    'Fifth month, day wuwu: the three Huguang chieftaincies Baojing, Sangzhi, and Yongshun were converted to regular administration with prefectures and counties established.',
    'In the fifth month, Baojing, Sangzhi, and Yongshun were converted to regular prefectures and counties.',
  ],
  s0487: [
    'On day jiazi, grain transport boats were permitted to carry merchant goods up to one hundred piculs beyond the former limit of sixty.',
    'On jiazi day, transport boats could carry up to one hundred piculs of merchant goods.',
  ],
  s0488: [
    'On day yichou: earlier, Yue Zhongqi memorialized that a Hunan man Zhang Xi had delivered a seditious letter; examination showed his teacher Zeng Jing had sent him.',
    'On yichou day, Yue Zhongqi reported Zhang Xi\'s seditious letter came from his teacher Zeng Jing.',
  ],
  s0489: [
    'Zeng Jing and Zhang Xi were ordered brought to the capital.',
    'Zeng Jing and Zhang Xi were ordered to the capital.',
  ],
  s0490: [
    'The Nine Ministers jointly examined them; Zeng Jing confessed that reading books by the late Lü Liuliang had led him into frantic heterodoxy.',
    'The Nine Ministers examined them; Zeng Jing blamed Lü Liuliang\'s books for his heterodoxy.',
  ],
  s0491: [
    'At this point a clear edict condemned Lü Liuliang and ordered civil and military officials at home and abroad to deliberate on his crimes.',
    'An edict condemned Lü Liuliang and ordered officials to deliberate his punishment.',
  ],
  s0492: [
    'Sixth month, day jimao: Tang Zhiyu was made acting governor-general of Zhili.',
    'In the sixth month, Tang Zhiyu became acting Zhili governor-general.',
  ],
  s0493: [
    'On day yiyou, because transport costs were heavy in Gansu, Sichuan, Yunnan, Guizhou, and Guangxi, the full gengxu year\'s quota tax was remitted; Shaanxi received a three-tenths remission.',
    'On yiyou day, full tax remissions were granted to western provinces; Shaanxi received partial relief.',
  ],
  s0494: [
    'Autumn, seventh month, day bingwu: raw Miao of Duyun in Guizhou and Nong and Zhong raw Miao submitted.',
    'In the seventh month, Guizhou raw Miao of Duyun, Nong, and Zhong submitted.',
  ],
  s0495: [
    'On day jiayin, Prince Guo Yin Li was put in charge of the Ministry of Works and Prince Zhuang Yin Lu of the Manchu commanders-in-chief.',
    'On jiayin day, Prince Guo Yin Li took the Works Ministry and Prince Zhuang Yin Lu the Manchu command.',
  ],
  s0496: [
    'On day jisi, Siam\'s tribute levy was reduced.',
    'On jisi day, Siam\'s tribute was reduced.',
  ],
  s0497: [
    'Intercalary seventh month, day yiyou: Arigun was made general at Hangzhou.',
    'In the intercalary seventh month, Arigun became Hangzhou general.',
  ],
  s0498: [
    'Eighth month, day guimao: Wang Qin was made general at Jingkou.',
    'In the eighth month, Wang Qin became Jingkou general.',
  ],
  s0499: [
    'On day jiyou, the Emperor attended the Classics lecture.',
    'On jiyou day, the Emperor held the Classics lecture.',
  ],
  s0500: [
    'Ninth month, day wuzi: Guangxi\'s Zhen\'an was converted to regular administration.',
    'In the ninth month, Guangxi\'s Zhen\'an was converted to regular administration.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b05.mjs <translation.json>'
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
