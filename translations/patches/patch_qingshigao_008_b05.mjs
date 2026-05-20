#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Xintai was appointed Mongol commander-in-chief.',
    'Xintai became Mongol commander-in-chief.',
  ],
  s0402: [
    'Eleventh month, first day guiyou: Prince of the First Rank Yin Zhen was stripped of his title and confined.',
    'On the first of the eleventh month, Prince of the First Rank Yin Zhen was stripped of rank and imprisoned.',
  ],
  s0403: [
    'On day jimao, the retired Grand Secretary Zhang Ying died; sacrificial rites and burial honors were granted, posthumous title Wenduan.',
    'Retired Grand Secretary Zhang Ying died and received posthumous name Wenduan.',
  ],
  s0404: [
    'On day xinsi, Vice Censor-in-chief Lao Zhibian memorialized to restore the deposed Crown Prince; he was dismissed from office and beaten with the rod.',
    'Lao Zhibian urged restoring the deposed Crown Prince; he was dismissed and flogged.',
  ],
  s0405: [
    'On day bingxu, court ministers were summoned to deliberate on establishing an heir apparent.',
    'On bingxu day, ministers were summoned to debate naming an heir apparent.',
  ],
  s0406: [
    'Aling\'a, Elundai, Kuaixu, Wang Hongxu, and other high ministers asked on behalf of the eighth imperial son Yinsi; the Emperor would not agree.',
    'Aling\'a, Elundai, Kuaixu, Wang Hongxu, and others urged Yinsi as heir; the Emperor refused.',
  ],
  s0407: [
    'On day wuzi, the deposed Crown Prince Yinreng was released.',
    'On wuzi day, the deposed Crown Prince Yinreng was freed from confinement.',
  ],
  s0408: [
    'On day jichou, princes and high ministers asked that Yinreng be reinstalled as Crown Prince.',
    'On jichou day, princes and ministers asked to restore Yinreng as Crown Prince.',
  ],
  s0409: [
    'On day bingshen, the clansman Fadu was made general of Heilongjiang.',
    'Fadu of the imperial clan became Heilongjiang general.',
  ],
  s0410: [
    'On day gengzi, Yinsi was restored as beile.',
    'On gengzi day, Yinsi was restored to beile rank.',
  ],
  s0411: [
    'Twelfth month, day jiachen: the student martyrs Ji Yongren, Wang Longguang, Shen Tiancheng, and Fan Chengpu were posthumously honored; they were granted collateral sacrifice at Fan Chengmou\'s shrine at the request of Chengmou\'s son, Governor Fan Shichong.',
    'In the twelfth month, martyred students Ji Yongren and others were honored with collateral sacrifice at Fan Chengmou\'s shrine on Governor Fan Shichong\'s petition.',
  ],
  s0412: [
    'On day dingsi, Chen Shuo was made governor of Huguang, Jiang Chenxi governor of Shandong, Huang Bingzhong governor of Zhejiang, and Liu Yinshu governor of Guizhou.',
    'Chen Shuo, Jiang Chenxi, Huang Bingzhong, and Liu Yinshu were appointed provincial governors.',
  ],
  s0413: [
    'This year, disaster land tax for sixty prefectures and counties in Shandong, Fujian, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in sixty districts across Shandong, Fujian, Huguang, and elsewhere.',
  ],
  s0414: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0415: [
    'Forty-eighth year, spring, first month, day guisi: court ministers were summoned and asked who had initiated the proposal to install Yinsi as heir.',
    'In the forty-eighth year, on the first day of spring, ministers were asked who had led the move to make Yinsi heir.',
  ],
  s0416: [
    'The ministers were terrified and dared not answer; the Grand Secretary Zhang Yushu was brought forward and questioned; he replied: "I first heard of it from Ma Qi.',
    'Terrified ministers were silent until Zhang Yushu was questioned; he said, "I first heard it from Ma Qi.',
  ],
  s0417: [
    '" The Emperor sharply reprimanded him.',
    '" The Emperor sharply rebuked him.',
  ],
  s0418: [
    'The next day Ma Qi\'s crimes were listed; he was spared death but imprisoned.',
    'The next day Ma Qi was spared execution but imprisoned.',
  ],
  s0419: [
    'Later the Emperor slowly examined the case and found it false, and released him.',
    'The Emperor later found the charge false and released Ma Qi.',
  ],
  s0420: [
    'On day bingshen, the Emperor visited the Southern Park.',
    'On bingshen day, the Emperor visited the Southern Park.',
  ],
  s0421: [
    'On day jihai, Vice Minister He Shou was ordered to be stationed in Tibet to assist in Tibetan affairs.',
    'He Shou was posted to Tibet to assist in frontier affairs.',
  ],
  s0422: [
    'Earlier Lhabzang Khan and Qinghai had disputed the installation of the Dalai Lama without resolution; a minister was specially ordered to go and supervise.',
    'Lhabzang Khan and Qinghai had disputed the Dalai Lama\'s succession; the court sent a minister to supervise.',
  ],
  s0423: [
    'Wang Hongxu and Li Zhenyu were dismissed.',
    'Wang Hongxu and Li Zhenyu left office.',
  ],
  s0424: [
    'Second month, day jiyou: the Emperor toured the capital region.',
    'In the second month, the Emperor toured the capital region.',
  ],
  s0425: [
    'The clansman Yang Fu was made general of Heilongjiang, Aisin Gioro Meng\'eluo general of Ningguta, and Wang Wenyi provincial commander of Guizhou.',
    'Yang Fu, Meng\'eluo, and Wang Wenyi received frontier military appointments.',
  ],
  s0426: [
    'On day wuwu, Songzhu was made acting general of Fengtian.',
    'On wuwu day, Songzhu became acting Fengtian general.',
  ],
  s0427: [
    'On day wuchen, the Emperor returned to the palace.',
    'On wuchen day, the Emperor returned to the palace.',
  ],
  s0428: [
    'On day gengwu, Zhang Pengge was made Minister of Revenue and Zhang Tinglu Minister of Punishments.',
    'Zhang Pengge became Minister of Revenue; Zhang Tinglu Minister of Punishments.',
  ],
  s0429: [
    'Third month, day xinsi: Yinreng was reinstalled as Crown Prince; the ancestral temples were notified and an edict promulgated throughout the realm.',
    'In the third month, Yinreng was restored as Crown Prince with empire-wide proclamation.',
  ],
  s0430: [
    'On day jiawu, Zhao Xiongzhao and two hundred ninety-two others were granted jinshi and other ranks with distinctions.',
    'Zhao Xiongzhao and 292 others received jinshi degrees.',
  ],
  s0431: [
    'Summer, fourth month, day jiachen: Funing\'an was made Minister of Personnel, Mu Helun Minister of Rites, and Mu Dan Censor-in-chief of the Left.',
    'In the fourth month, Funing\'an, Mu Helun, and Mu Dan received high appointments.',
  ],
  s0432: [
    'Yin Zhen was moved to confinement in a public office; officials were sent with troops to guard him.',
    'Yin Zhen was confined under guard in a public office.',
  ],
  s0433: [
    'On day dingmao, the Emperor toured beyond the passes.',
    'On dingmao day, the Emperor toured the frontier.',
  ],
  s0434: [
    'Fifth month, day jiaxu: the court halted at Rehe.',
    'In the fifth month, the entourage stopped at Rehe.',
  ],
  s0435: [
    'Sixth month, day wuwu: Prince Kang Chuntai died; posthumous title Dao; his son Chong\'an succeeded.',
    'Prince Kang Chuntai died; posthumous name Dao; his son Chong\'an inherited the title.',
  ],
  s0436: [
    'Autumn, seventh month, day gengyin: Yin Tai was made governor-general of Sichuan and Shaanxi, Ge Li governor-general of Jiangnan and Jiangxi, Jiang Qi provincial commander of Gansu, and Shi Yide provincial commander of Jiangnan.',
    'Yin Tai, Ge Li, Jiang Qi, and Shi Yide received frontier and southern appointments.',
  ],
  s0437: [
    'On day wuxu, the Emperor went on the hunting encirclement.',
    'On wuxu day, the Emperor went hunting.',
  ],
  s0438: [
    'Eighth month, first day jihai: there was a solar eclipse.',
    'On the first of the eighth month there was a solar eclipse.',
  ],
  s0439: [
    'Pan Yulong, provincial commander of Shaanxi, was given the additional title Pacification General.',
    'Shaanxi commander Pan Yulong was made Pacification General.',
  ],
  s0440: [
    'Ninth month, day gengyin: the Emperor returned to the capital.',
    'In the ninth month, the Emperor returned to Beijing.',
  ],
  s0441: [
    'Nian Gengyao was made governor of Sichuan.',
    'Nian Gengyao became Sichuan governor.',
  ],
  s0442: [
    'Winter, tenth month, day renyin: an edict ordered the governors-general and governors of Fujian and Guangdong to recommend men deeply versed in watercraft and thoroughly acquainted with naval forces.',
    'In the tenth month, Fujian and Guangdong authorities were ordered to recommend skilled naval officers.',
  ],
  s0443: [
    'On day wuwu, the third imperial son Yin Zhi was enfeoffed as Prince Cheng, the fourth son Yinzhen as Prince Yong, the fifth son Yinqi as Prince Heng, the seventh son Yinyou as Prince Chun of the Commandery, the tenth son Yin\'e as Prince Dun of the Commandery, and the ninth son Yintang, twelfth son Yinti, and fourteenth son Yinti—all as beile.',
    'Yin Zhi, Yinzhen, Yinqi, Yinyou, and Yin\'e received princely ranks; Yintang, Yinti, and Yinti were made beile.',
  ],
  s0444: [
    'On day renxu, an edict remitted next year\'s land-and-poll tax quotas for the Huai, Yang, and Xu districts of disaster-struck Jiangsu, Yanzhou in Shandong, and Guide in Henan.',
    'Tax quotas were remitted for disaster areas in Jiangsu, Shandong, and Henan.',
  ],
  s0445: [
    'Eleventh month, day bingzi: an edict said that remittances sent from the provinces to the central treasury were excessive and might be retained in part as local reserve for urgent needs.',
    'In the eleventh month, provinces were allowed to retain part of central remittances for emergencies.',
  ],
  s0446: [
    'Prince of the Commandery Ma\'erhun died; posthumous title Que; his son Huayang succeeded.',
    'Prince of the Commandery Ma\'erhun died; posthumous name Que; his son Huayang inherited.',
  ],
  s0447: [
    'On day jimao, Sang\'e, director-general of grain transport, was given the additional title Junior Mentor of the Heir Apparent.',
    'Grain transport director Sang\'e received the title Junior Mentor of the Heir Apparent.',
  ],
  s0448: [
    'On day gengyin, the Emperor discussed with Grand Secretary Li Guangdi the courses of rivers and their sources, saying that Mount Tai and other peaks derive from the Changbai range.',
    'On gengyin day, the Emperor discussed river sources with Li Guangdi, tracing major mountains to Changbai.',
  ],
  s0449: [
    'The Ji River runs underground; the Yellow River before Jishi also flows underground—Mongols have books describing this in great detail.',
    'He said the Ji and upper Yellow River run underground, as Mongol texts describe in detail.',
  ],
  s0450: [
    'The Yangzi\'s source likewise comes from Kunlun; only at Mount Min does it cease to be subterranean.',
    'The Yangzi too rises from Kunlun and surfaces at Mount Min.',
  ],
  s0451: [
    'Zhang Pengge and Gamin Tu were ordered to investigate the case of treasury shortfalls by Yisi Gong of Jiangnan.',
    'Zhang Pengge and Gamin Tu were sent to investigate Yisi Gong\'s Jiangnan treasury case.',
  ],
  s0452: [
    'Twelfth month, day jihai: the Emperor paid respects at the imperial tombs.',
    'In the twelfth month, the Emperor visited the imperial tombs.',
  ],
  s0453: [
    'On day jiwei, the Emperor returned to the palace.',
    'On jiwei day, the Emperor returned to the palace.',
  ],
  s0454: [
    'Ma Qi was ordered to manage Russo trade affairs.',
    'Ma Qi was put in charge of Russian trade.',
  ],
  s0455: [
    'Minister of Punishments Chao Ketuo was dismissed.',
    'Minister Chao Ketuo left office.',
  ],
  s0456: [
    'This year, disaster land tax for fifty-three prefectures and counties in Zhili, Jiangsu, Anhui, Shandong, Henan, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in fifty-three districts across several provinces.',
  ],
  s0457: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0458: [
    'Forty-ninth year, spring, first month, day gengyin: orders were issued to compile the Manchu-Mongol bilingual Qing literary mirror.',
    'In the forty-ninth year, work began on the Manchu-Mongol Qing literary mirror.',
  ],
  s0459: [
    'Second month, day dingyou: the Emperor toured Mount Wutai.',
    'In the second month, the Emperor toured Mount Wutai.',
  ],
  s0460: [
    'Minister of Personnel Xu Chao asked to retire; permission was granted.',
    'Personnel Minister Xu Chao retired.',
  ],
  s0461: [
    'Third month, day jisi: the Emperor returned to the capital.',
    'In the third month, the Emperor returned to Beijing.',
  ],
  s0462: [
    'On day yihai, orders were issued to compile the character dictionary.',
    'On yihai day, compilation of the Kangxi Dictionary was ordered.',
  ],
  s0463: [
    'An edict ordered that Li Minqi, grandson of the late Grand Secretary Li Wei and a director in office, be specially promoted to Vice Director of the Court of Imperial Sacrifices.',
    'Li Wei\'s grandson Li Minqi was promoted to Vice Director of Imperial Sacrifices.',
  ],
  s0464: [
    'On day wuyin, an imperial patent enfeoffed the Tibetan Hubi\'er Khan Bokhta as the Sixth Dalai Lama.',
    'Bokhta was enfeoffed as the Sixth Dalai Lama.',
  ],
  s0465: [
    'On day xinsi, an edict remitted more than thirty-nine thousand shi of unpaid transport grain for Hangzhou and Huzhou prefectures in Zhejiang.',
    'Unpaid Zhejiang transport grain for Hang and Hu prefectures was remitted.',
  ],
  s0466: [
    'Summer, fourth month, day yisi: Xiao Yongzao was transferred to Minister of Personnel and Wang Yan Minister of War.',
    'Xiao Yongzao became Minister of Personnel; Wang Yan Minister of War.',
  ],
  s0467: [
    'Fifth month, first day jiyou: the Emperor toured beyond the passes.',
    'On the first of the fifth month, the Emperor toured the frontier.',
  ],
  s0468: [
    'On day guiyou, the court halted at Huayugou.',
    'On guiyou day, the entourage stopped at Huayugou.',
  ],
  s0469: [
    'Troops of Jilin and Heilongjiang were reviewed.',
    'The Emperor reviewed Jilin and Heilongjiang troops.',
  ],
  s0470: [
    'On day dingchou, the court halted at Rehe.',
    'On dingchou day, the entourage stopped at Rehe.',
  ],
  s0471: [
    'Sixth month, day jihai: the imperial sons were ordered to escort the Empress Dowager respectfully to Rehe for the summer retreat.',
    'In the sixth month, princes were ordered to bring the Empress Dowager to Rehe.',
  ],
  s0472: [
    'On day wuwu, Minister of Punishments Zhang Tinglu was dismissed.',
    'Zhang Tinglu left the Ministry of Punishments.',
  ],
  s0473: [
    'Autumn, seventh month, day renwu: investigating affairs in Hunan, Minister Xiao Yongzao and others memorialized on the case of mutual impeachment between the governor and provincial commander; investigation found both charges true.',
    'Xiao Yongzao reported a Hunan case in which governor and commander impeached each other; both charges were sustained.',
  ],
  s0474: [
    'The reply received said: "Yu Yimou is to retire; Zhao Shenqiao is dismissed from office but retained on duty.',
    'The Emperor ruled that Yu Yimou should retire and Zhao Shenqiao be demoted yet kept on duty.',
  ],
  s0475: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0476: [
    'Intercalary seventh month, day jiayin: the Emperor went on the hunting encirclement.',
    'In the intercalary seventh month, the Emperor went hunting.',
  ],
  s0477: [
    'Eighth month, day yihai: an edict said Zhangzhou and Quanzhou in Fujian suffered drought; three hundred thousand shi of transport grain from Jiangsu and Zhejiang were sent for relief, and this year\'s unpaid quotas were also remitted.',
    'Drought relief grain was sent to Zhang and Quan in Fujian and local taxes remitted.',
  ],
  s0478: [
    'On day bingxu, the Emperor returned and halted at Rehe.',
    'On bingxu day, the Emperor returned to Rehe.',
  ],
  s0479: [
    'On day gengyin, Fan Shichong was made governor-general of Fujian and Zhejiang, and Elente provincial commander of Hunan.',
    'Fan Shichong became governor-general of Fujian and Zhejiang; Elente Hunan commander.',
  ],
  s0480: [
    'Ninth month, day xinchou: the Emperor escorted the Empress Dowager back to the palace.',
    'In the ninth month, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0481: [
    'On day xinhai, Xifuna was dismissed.',
    'Xifuna left office.',
  ],
  s0482: [
    'At this time the Ministry of Revenue\'s deficit in funds for purchasing fodder and beans came to light; accumulated over more than ten years, one hundred twenty former ministers and vice ministers were involved, with losses reaching more than four hundred thousand taels.',
    'A decade-long Ministry of Revenue fodder-purchase deficit involving 120 officials totaled over 400,000 taels.',
  ],
  s0483: [
    'The Emperor waived prosecution, ordered repayment within a time limit, and especially dismissed Xifuna, then serving as minister.',
    'The Emperor waived arrests but ordered repayment and dismissed serving Minister Xifuna.',
  ],
  s0484: [
    'Mu Helun was made Minister of Revenue and Bei Henuo Minister of Rites.',
    'Mu Helun became Minister of Revenue; Bei Henuo Minister of Rites.',
  ],
  s0485: [
    'Winter, tenth month, day jiazi: an edict said: "We have ruled the realm for nearly fifty years, truly holding that the people are the foundation of the state and that government lies in nourishing the people.',
    'In the tenth month, the Emperor issued an edict on fifty years of rule and care for the people.',
  ],
  s0486: [
    'Time and again We have remitted taxes by tens of millions, using what frugality has saved to spread broad relief.',
    'He had repeatedly remitted tens of millions in taxes from imperial frugality.',
  ],
  s0487: [
    'Yet observing the people\'s livelihood, prosperity is not yet complete—truly because population daily grows while land does not increase.',
    'Population growth outpaced land, he said, so prosperity was still incomplete.',
  ],
  s0488: [
    'It is fitting to pour forth great grace and thereby strengthen the people\'s strength.',
    'He would grant great grace to strengthen the people.',
  ],
  s0489: [
    'Beginning in the fiftieth year of Kangxi, land-and-poll taxes throughout the realm are to be universally remitted, the cycle completing in three years.',
    'From Kangxi year 50, a three-year empire-wide land-tax remission would begin.',
  ],
  s0490: [
    'For Zhili, Fengtian, Zhejiang, Fujian, Guangdong, Guangxi, Sichuan, Yunnan, and Guizhou—the nine provinces\' land-and-poll taxes are to be investigated and wholly remitted.',
    'Nine provinces would have land taxes wholly remitted after investigation.',
  ],
  s0491: [
    'Arrears accumulated over years are to be forgiven in one act.',
    'All arrears would be forgiven at once.',
  ],
  s0492: [
    'As for provinces to be remitted in the fifty-first and fifty-second years, await Our order when the time comes.',
    'Other provinces would follow in years 51 and 52 as ordered.',
  ],
  s0493: [
    'Local governors and prefects must enter into Our mind of protecting the people, sincerely loving and nurturing them, so that ascending peace and shared benefit may truly be seen.',
    'Officials were urged to nurture the people so peace and prosperity might be real.',
  ],
  s0494: [
    'When this text arrives, engrave and promulgate it so that all may hear and know.',
    'The edict was to be carved on stone and published everywhere.',
  ],
  s0495: [
    '" On day dingmao, vassal rulers who had already attended court at the traveling palace were told they need not come for the New Year audience.',
    'The edict closed; on dingmao day, vassals at court were excused from the New Year audience.',
  ],
  s0496: [
    'On day bingzi, Guo Zhen was made governor-general of Yunnan and Guizhou, Guo Shilong Minister of Punishments, and Ehai governor-general of Huguang.',
    'Guo Zhen, Guo Shilong, and Ehai received high appointments.',
  ],
  s0497: [
    'On day guimao, the Grand Secretaries were instructed: "Jiangnan treasury shortfalls reach hundreds of thousands of taels—this may be because on Our several southern tours local funds were diverted.',
    'On guimao day, the Emperor told Grand Secretaries Jiangnan deficits might reflect costs of his southern tours.',
  ],
  s0498: [
    'Zhang Pengge says salary and labor allotments can be used to make up the deficit.',
    'Zhang Pengge proposed covering deficits with salary and labor funds.',
  ],
  s0499: [
    'District magistrates have no salary, yet the burden still falls on the people—better to remit it entirely.',
    'The Emperor said magistrates had no salary and burdened the people; full remission was better.',
  ],
  s0500: [
    'Deliberate and memorialize."',
    'He ordered the matter discussed and reported."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b05.mjs <translation.json>'
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
