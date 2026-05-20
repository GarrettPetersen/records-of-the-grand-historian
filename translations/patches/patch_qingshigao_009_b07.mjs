#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'In this campaign, advancing rashly they fell into an ambush; Furdan abandoned the main army and retreated first, leading to a great defeat.',
    'Furdan\'s rash advance into an ambush and early retreat brought a crushing defeat.',
  ],
  s0602: [
    'Deputy commander Zhabina, Gongbasai, and staff officer Gong Dafu all died in the action.',
    'Deputy generals Zhabina and Gongbasai and staff officer Gong Dafu were killed.',
  ],
  s0603: [
    'On day jiaxu, Maiser was appointed Pacification Commissioner-in-chief; an edict ordered Xibao to hold Chahan Sho\'or firmly.',
    'On jiaxu day, Maiser became Pacification Commissioner-in-chief and Xibao was ordered to defend Chahan Sho\'or.',
  ],
  s0604: [
    'Yue Zhongqi memorialized that he was leading troops toward Urumqi.',
    'Yue Zhongqi reported marching on Urumqi.',
  ],
  s0605: [
    'Eighth month, day jihai: Emida was made Qingzhou commander.',
    'In the eighth month, on jihai day, Emida became Qingzhou commander.',
  ],
  s0606: [
    'On day bingwu, troops at Kobdo were moved to garrison Chahan Sho\'or.',
    'On bingwu day, Kobdo forces were shifted to Chahan Sho\'or.',
  ],
  s0607: [
    'On day jiyou, Xibao was advanced in rank to Prince Shuncheng.',
    'On jiyou day, Xibao was promoted to Prince Shuncheng.',
  ],
  s0608: [
    'On day jiayin, Yue Zhongqi memorialized that the army reached Nalin River, two days\' march from Urumqi; scouts found the rebels had fled, and the main force at once withdrew.',
    'On jiayin day, Yue Zhongqi reported reaching Nalin River near Urumqi, learning the enemy had fled, and turning back.',
  ],
  s0609: [
    'An order was issued to reward them with preferential commendation.',
    'The court ordered preferential rewards.',
  ],
  s0610: [
    'Ninth month, day yihai: Prince Chong\'an was ordered to proceed to the army camp and was granted ten thousand taels of silver for outfitting.',
    'In the ninth month, Prince Chong\'an was sent to camp with ten thousand taels for expenses.',
  ],
  s0611: [
    'On day wuzi, Liu Yuyi was made governor-general of Zhili, Shen Tingyu governor-general of the Zhili waterways, and Zhu Zao governor-general of the Hedong waterways.',
    'On wuzi day, Liu Yuyi, Shen Tingyu, and Zhu Zao received new waterway and Zhili posts.',
  ],
  s0612: [
    'On day jisi, Empress Nara died; she was given the posthumous title Xiaojing.',
    'On jisi day, Empress Nara died and received the posthumous name Xiaojing.',
  ],
  s0613: [
    'Winter, tenth month, day bingwu: Qian Yikai asked to retire; Wei Tingzhen was made Minister of Rites.',
    'In the tenth month, Qian Yikai retired and Wei Tingzhen became Minister of Rites.',
  ],
  s0614: [
    'The Dzungars invaded the Kerulen, plundering nomadic camps; Princes Danjin Duo\'erji and imperial son-in-law Prince Celeng joined forces to attack them and killed and captured without number.',
    'Dzungar raiders on the Kerulen were beaten by Princes Danjin Duo\'erji and Celeng with heavy enemy losses.',
  ],
  s0615: [
    'The Emperor praised them; each was granted ten thousand taels of silver, and Celeng was advanced to prince.',
    'Each received ten thousand taels of silver and Celeng was made a prince.',
  ],
  s0616: [
    'Eleventh month, day guihai: Prince Shuncheng Xibao was appointed Pacification Commissioner-in-chief for the frontier; Furdan was reduced to Zhenwu General and Maiser to Suiyuan General.',
    'In the eleventh month, Xibao became frontier commander while Furdan and Maiser were demoted.',
  ],
  s0617: [
    'Prince Chong\'an was ordered to act as Pacification Commissioner-in-chief.',
    'Prince Chong\'an was named acting Pacification Commissioner-in-chief.',
  ],
  s0618: [
    'On day chou: Shi Yizhi was made Minister of War and Peng Weixin Censor-in-chief of the Left.',
    'On chou day, Shi Yizhi became Minister of War and Peng Weixin Left Censor-in-chief.',
  ],
  s0619: [
    'Twelfth month, first day of the month on day gengyin: there was a solar eclipse.',
    'On the new moon of the twelfth month there was a solar eclipse.',
  ],
  s0620: [
    'On day jiyou, the Veritable Records and Sacred Instructions of the Kangxi Emperor were completed.',
    'On jiyou day, the Kangxi Veritable Records and Sacred Instructions were finished.',
  ],
  s0621: [
    'On day jiayin, Ma Shijie was appointed acting Guangzhou commander and Zhuntai acting Fuzhou commander.',
    'On jiayin day, Ma Shijie and Zhuntai received acting regional commands.',
  ],
  s0622: [
    'On day dingsi, the collective autumn sacrifice was performed at the Imperial Ancestral Temple.',
    'On dingsi day, the autumn temple sacrifice was held.',
  ],
  s0623: [
    'This year, disaster land tax for ninety-three prefectures, counties, and garrisons in Zhili, Jiangnan, Henan, Fujian, Shaanxi, Hunan, Guangxi, Gansu, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in ninety-three districts across several provinces.',
  ],
  s0624: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0625: [
    'Tenth year, spring, first month, day guihai: at the first-spring sacrifice to the Imperial Ancestral Temple, the fourth imperial son Hongli performed the rites.',
    'In the tenth year, on guihai day in the first month, Prince Hongli led the spring temple sacrifice.',
  ],
  s0626: [
    'On day renwu, Ortai was made Grand Secretary.',
    'On renwu day, Ortai became Grand Secretary.',
  ],
  s0627: [
    'On day jiashen, Da\'erji, commander at the front, was made Jianxun General and stationed troops at Baige\'er.',
    'On jiashen day, front commander Da\'erji became Jianxun General at Baige\'er.',
  ],
  s0628: [
    'Second month: Wang Chao\'en was made governor-general of the Zhili waterways, and Wei Tingzhen transport commissioner.',
    'In the second month, Wang Chao\'en and Wei Tingzhen received waterway and transport posts.',
  ],
  s0629: [
    'On day jihai, Ortai was enfeoffed as a first-class baron with hereditary succession.',
    'On jihai day, Ortai received a hereditary first-class barony.',
  ],
  s0630: [
    'On day gengzi, Yue Zhongqi memorialized that the Dzungars attacked Hami; Regional Commander Cao Peng was sent to aid, defeated them, and the rebels fled by the Wukeke Ridge.',
    'On gengzi day, Yue Zhongqi reported a Dzungar attack on Hami repulsed by Cao Peng as the enemy fled.',
  ],
  s0631: [
    'Deputy commander Shi Yunzhuo was charged with failing to intercept and was arrested for trial.',
    'Shi Yunzhuo was arrested for letting the enemy escape.',
  ],
  s0632: [
    'On day guichou, Zhang Guangsi was made western-route deputy commander and Liu Shiming joined the staff.',
    'On guichou day, Zhang Guangsi and Liu Shiming received western-route commands.',
  ],
  s0633: [
    'Third month, day dingchou: the Grand Secretaries and others jointly impeached Yue Zhongqi for false reporting and mutually contradictory statements.',
    'In the third month, the Grand Secretaries impeached Yue Zhongqi for inconsistent reports.',
  ],
  s0634: [
    'The matter was referred to the ministries for strict deliberation.',
    'The ministries were ordered to investigate strictly.',
  ],
  s0635: [
    'Summer, fourth month, day xinmao: a regional commander was established at each of Guzhou and Qingjiang in Guizhou.',
    'In the fourth month, Guizhou received new commanders at Guzhou and Qingjiang.',
  ],
  s0636: [
    'On day yisi, Hai Shou was made Minister of Revenue and Xinggui Minister of Punishments.',
    'On yisi day, Hai Shou and Xinggui became revenue and punishment ministers.',
  ],
  s0637: [
    'Third-rank Duke Yue Zhongqi was reduced to third-rank marquis but still acted as commander-in-chief.',
    'Yue Zhongqi was demoted from duke to marquis while keeping command.',
  ],
  s0638: [
    'On day bingwu, Zhang Dayou was made Minister of Rites and Fan Shiyi Minister of Works.',
    'On bingwu day, Zhang Dayou and Fan Shiyi received ministry posts.',
  ],
  s0639: [
    'On day yimao, an edict ordered waterworks repaired in Songming and Xundian prefectures of Yunnan.',
    'On yimao day, Yunnan irrigation works at Songming and Xundian were ordered repaired.',
  ],
  s0640: [
    'Fifth month, day wuchen: Wuge was made Yangwu General with Liu Shiming as his deputy.',
    'In the fifth month, Wuge became Yangwu General with Liu Shiming as deputy.',
  ],
  s0641: [
    'Intercalary fifth month, day jiachen: Prince Heng Yinqi died; posthumous title Wen; his son Hongzhi inherited Prince Heng.',
    'In the intercalary fifth month, Prince Heng Yinqi died with posthumous name Wen; Hongzhi succeeded as Prince Heng.',
  ],
  s0642: [
    'Former Prince Cheng Yinqi died in confinement at Jingshan; five thousand taels of silver were granted and he was buried by the standards of a commandery prince.',
    'Prince Cheng Yinqi died under house arrest at Jingshan and received commandery-prince burial honors.',
  ],
  s0643: [
    'Minister of Personnel Li Tingyi died.',
    'Minister of Personnel Li Tingyi died.',
  ],
  s0644: [
    'On day gengxu, western barbarians in northern Taiwan caused trouble; government troops suppressed them.',
    'On gengxu day, troops pacified western barbarian unrest in northern Taiwan.',
  ],
  s0645: [
    'On day guichou, Li Wei was appointed acting Minister of Punishments.',
    'On guichou day, Li Wei became acting Minister of Punishments.',
  ],
  s0646: [
    'Sixth month, day bingchen: Mang Holi was made commander-in-chief of the Han Banners.',
    'In the sixth month, Mang Holi became Han Banner commander-in-chief.',
  ],
  s0647: [
    'On day renshen, Gao Qizhuo memorialized that Simao native chiefs in Yunnan had joined Yuanjiang tribesmen in attacking Pu\'er prefectural city; Regional Commander Dong Fang was sent with troops to suppress them.',
    'On renshen day, Gao Qizhuo reported a Yunnan uprising and sent Dong Fang to suppress it.',
  ],
  s0648: [
    'On day xinsi, the Grand Councilors deliberated and memorialized posthumous honors for the fallen Khalkha taiji Celerke, enfeoffed as Defender Duke of the State; his son Mishike succeeded.',
    'On xinsi day, the Grand Council granted honors to the fallen Khalkha taiji Celerke and his son Mishike.',
  ],
  s0649: [
    'The establishment of Grand Councilors dates from this.',
    'The office of Grand Councilor began here.',
  ],
  s0650: [
    'Autumn, seventh month, day bingxu: Mala was dismissed and Wuge was made Minister of Works.',
    'In the seventh month, Mala was dismissed and Wuge became Minister of Works.',
  ],
  s0651: [
    'On day dinghai, at Juye in Shandong a cow gave birth to an auspicious qilin.',
    'On dinghai day, a cow at Juye in Shandong bore a reputed qilin.',
  ],
  s0652: [
    'On day jichou, ten thousand taels of silver were granted to the descendants of Gu Badai.',
    'On jichou day, Gu Badai\'s descendants received ten thousand taels of silver.',
  ],
  s0653: [
    'On day dingyou, Ortai was ordered to take overall direction of military affairs.',
    'On dingyou day, Ortai was placed in charge of military affairs.',
  ],
  s0654: [
    'Yue Zhongqi was summoned to the capital.',
    'Yue Zhongqi was recalled to Beijing.',
  ],
  s0655: [
    'Liu Yuyi was made governor-general of Shaanxi and Li Wei governor-general of Zhili.',
    'Liu Yuyi became Shaanxi governor-general and Li Wei Zhili governor-general.',
  ],
  s0656: [
    'On day xinchou, the Dzungars invaded Wusun Zhu\'er; Furdan met them in battle but was defeated; Commander-in-chief Xibao was ordered to verify the defeat and report.',
    'On xinchou day, Furdan was beaten repelling a Dzungar attack at Wusun Zhu\'er and Xibao was told to report.',
  ],
  s0657: [
    'On day yisi, Grand Secretary Jiang Yingsi died.',
    'On yisi day, Grand Secretary Jiang Yingsi died.',
  ],
  s0658: [
    'On day jiyou, Fumin was ordered to assist the Grand Secretariat and Tang Zhiyu to act concurrently as Minister of Punishments.',
    'On jiyou day, Fumin joined the Grand Secretariat and Tang Zhiyu acted as punishment minister.',
  ],
  s0659: [
    'Eighth month, day bingchen: Prince Gong\'s son Haishan was restored to his original beile rank.',
    'In the eighth month, Haishan, son of Prince Gong, regained his beile title.',
  ],
  s0660: [
    'On day gengwu, the three khans of Balu beyond Tibet\'s borders—Yamubu, Yeleng, and Kukumu—sent envoys with tribute; a gracious edict replied to them.',
    'On gengwu day, three Balu khans beyond Tibet sent tribute and received an imperial reply.',
  ],
  s0661: [
    'On day renshen, northern-route deputy commanders Prince Danjin Duo\'erji and imperial son-in-law Prince Celeng memorialized that in pursuing the Dzungars to Erdeni Zhao they killed more than ten thousand rebels before the enemy fled toward the Tui River.',
    'On renshen day, Danjin Duo\'erji and Celeng reported killing over ten thousand Dzungars at Erdeni Zhao.',
  ],
  s0662: [
    'On day jiashen, two million taels from the treasury were sent to the northern army for rewards.',
    'On jiashen day, two million taels were allocated for northern-front rewards.',
  ],
  s0663: [
    'Ninth month, first day of the month on day yiyou: for merit against the Dzungars, Danjin Duo\'erji was given the honorific Zhiyong and Celeng Chaoyong; Celeng\'s son Kebudeng Zhabu was enfeoffed Defender Duke of the State; others were promoted in varying degrees.',
    'On the ninth-month new moon, victors over the Dzungars received titles and promotions.',
  ],
  s0664: [
    'Maiser was stripped of rank and office and executed for letting the enemy escape and missing his chance.',
    'Maiser was executed for allowing the Dzungars to escape.',
  ],
  s0665: [
    'On day jiyou, Furdan was stripped of rank and office.',
    'On jiyou day, Furdan lost his title and post.',
  ],
  s0666: [
    'Winter, tenth month, day renxu: executions of condemned prisoners for the year were suspended.',
    'In the tenth month, autumn executions were halted for the year.',
  ],
  s0667: [
    'Yue Zhongqi was stripped of rank and office, brought to the capital, and confined by the Ministry of War.',
    'Yue Zhongqi was disgraced, arrested, and held by the Ministry of War.',
  ],
  s0668: [
    'Eleventh month, day bingxu: Changde was made left deputy frontier commander.',
    'In the eleventh month, Changde became left deputy frontier commander.',
  ],
  s0669: [
    'On day yimao, Emin Hezhuo of Turfan was enfeoffed Defender Duke of the State.',
    'On yimao day, Turfan\'s Emin Hezhuo became Defender Duke of the State.',
  ],
  s0670: [
    'An imperial calligraphic plaque was granted to licentiate Qiao Jin of Yuanjiang county, Hunan, whose family had lived together for seven generations.',
    'A seven-generation household in Yuanjiang, Hunan, received an imperial plaque.',
  ],
  s0671: [
    'Twelfth month, day yimao: posthumous honors of varying degrees were granted to northern-route officers fallen in battle, including Zhabina, Ma\'ersa, Hailan, and Dafu.',
    'In the twelfth month, fallen northern commanders including Zhabina received posthumous honors.',
  ],
  s0672: [
    'Vice Minister Sun Jiagan, guilty of a capital offense, was sentenced to death but ordered to serve in the silver vault.',
    'Sun Jiagan, though condemned to death, was put to work in the silver vault.',
  ],
  s0673: [
    'On day chou: the cases of Lü Liuliang, Lü Baozhong, and Yan Hongkui were judged; their corpses were dismembered, Lü Yizhong and Shen Zaikuan were beheaded, their grandsons were sent to the frontier as slaves, and Zhu Yucai and others were released.',
    'On chou day, the Lü Liuliang treason case ended in executions and enslavement while some co-defendants were freed.',
  ],
  s0674: [
    'On day bingyin, Wuge was arrested for spreading false talk to withdraw the army.',
    'On bingyin day, Wuge was arrested for rumor-mongering about withdrawal.',
  ],
  s0675: [
    'On day xinsi, the collective autumn sacrifice was performed at the Imperial Ancestral Temple.',
    'On xinsi day, the autumn temple sacrifice was held.',
  ],
  s0676: [
    'This year, disaster land tax for seventy-five prefectures and counties in Zhili, Jiangnan, Shandong, Hunan, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in seventy-five districts.',
  ],
  s0677: [
    'Registered ding households numbered 25,412,289; additional persons registered after the perpetual no-increase policy numbered 936,486.',
    'Registers listed 25.4 million ding households and 936,486 additional persons under the no-increase rule.',
  ],
  s0678: [
    'Cultivated land totaled 890,416 qing and 40 mou; collected silver amounted to 29,872,332 taels and 6 cash.',
    'Land registers showed 890,416 qing and tax silver of 29.87 million taels.',
  ],
  s0679: [
    'Tea totaled 342,351 licenses.',
    'Tea licenses numbered 342,351.',
  ],
  s0680: [
    'Salt tax silver amounted to 3,988,851 taels.',
    'Salt tax revenue was 3.99 million taels of silver.',
  ],
  s0681: [
    'Coins minted totaled more than 684,363,200 strings.',
    'Coinage exceeded 684 million strings.',
  ],
  s0682: [
    'Korea and Balu sent tribute.',
    'Korea and Balu paid tribute.',
  ],
  s0683: [
    'Eleventh year, spring, first month, day wuzi: Haiwang and Li Wei were ordered to survey the Zhejiang seawall.',
    'In the eleventh year, on wuzi day in the first month, Haiwang and Li Wei were sent to inspect the Zhejiang coast.',
  ],
  s0684: [
    'The Fan Gong embankment was repaired.',
    'The Fan Gong dike was repaired.',
  ],
  s0685: [
    'On day renchen, stipends of one thousand taels each were issued to provincial academies for lamp oil.',
    'On renchen day, each provincial academy received one thousand taels for stipends.',
  ],
  s0686: [
    'Gao Qizhuo was made governor-general of Liangjiang and Yin Jishan governor-general of Yunnan-Guizhou.',
    'Gao Qizhuo became Liangjiang governor-general and Yin Jishan Yunnan-Guizhou governor-general.',
  ],
  s0687: [
    'On day gengzi, Ortai was ordered to inspect northern-route military affairs.',
    'On gengzi day, Ortai was sent to review the northern armies.',
  ],
  s0688: [
    'On day dingwei, the Emperor visited the imperial tombs.',
    'On dingwei day, the Emperor visited the tombs.',
  ],
  s0689: [
    'Second month, day renzi: the Emperor saw water jars set along the route storing water to sprinkle the road.',
    'In the second month, on renzi day, the Emperor noticed jars of water set out to wet the road.',
  ],
  s0690: [
    'The Emperor instructed them, saying: "Along the imperial progress route, though there be a little dust, what harm is there?',
    'The Emperor said a little dust along the route did not matter.',
  ],
  s0691: [
    'Local officials should regard nourishing the people as paramount.',
    'Officials should put the people\'s welfare first.',
  ],
  s0692: [
    'If you turned the mind devoted to serving Us toward comforting the common people, would that not be better?"',
    'Devoting the same zeal to the people as to the throne would be better."',
  ],
  s0693: [
    '" On day guichou, the Emperor returned to the capital.',
    'On guichou day, the Emperor returned to Beijing.',
  ],
  s0694: [
    'On day bingchen, Baoming, Cha\'ertai, and Yilezhen were all made Manchu commanders-in-chief.',
    'On bingchen day, Baoming, Cha\'ertai, and Yilezhen became Manchu commanders-in-chief.',
  ],
  s0695: [
    'On day jiwei, the Emperor attended the Classics lecture.',
    'On jiwei day, the Emperor held the Classics lecture.',
  ],
  s0696: [
    'The twenty-fourth imperial brother Yinmi was enfeoffed Prince Cheng, the fourth son Hongli Prince Bao, and the fifth son Hongzhou Prince He.',
    'Yinmi became Prince Cheng, Hongli Prince Bao, and Hongzhou Prince He.',
  ],
  s0697: [
    'Beile Hongchun was advanced to Prince Tai.',
    'Beile Hongchun was made Prince Tai.',
  ],
  s0698: [
    'On day renxu, Peng Weixin was ordered to assist in the Grand Secretariat.',
    'On renxu day, Peng Weixin joined the Grand Secretariat staff.',
  ],
  s0699: [
    'Wu Shiyu was made Minister of Rites and Tu Tianxiang Censor-in-chief of the Left.',
    'Wu Shiyu became Minister of Rites and Tu Tianxiang Left Censor-in-chief.',
  ],
  s0700: [
    'Summer, fourth month, day renzi: Ren Qiyun was specially granted Hanlin status to serve in the princes\' study.',
    'In the fourth month, Ren Qiyun received special Hanlin appointment in the princes\' school.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b07.mjs <translation.json>'
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
