#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0502: [
    'Eleventh month, first day of the month on day xinmao: an edict ordered that in years when land tax was remitted, landowners were exempted seven-tenths and tenant farmers three-tenths; this was established as a regulation.',
    'In the eleventh month, on the new moon of xinmao day, an edict fixed tax relief at seventy percent for landowners and thirty percent for tenants whenever levies were remitted.',
  ],
  s0503: [
    'Grand Secretary Chen Tingjing asked to retire on account of age; a gracious edict comforted him, and he was ordered to leave office.',
    'Grand Secretary Chen Tingjing retired on account of age after a gracious imperial message.',
  ],
  s0504: [
    'On day yisi, the Emperor visited the imperial tombs.',
    'On yisi day, the Emperor visited the tombs.',
  ],
  s0505: [
    'Xiao Yongzao was made Grand Secretary, Wang Yan Minister of Rites, and Xu Yuanzheng Minister of Works.',
    'Xiao Yongzao became Grand Secretary; Wang Yan Minister of Rites; Xu Yuanzheng Minister of Works.',
  ],
  s0506: [
    'On day dingwei, Sun Zhenghao was made Minister of War.',
    'On dingwei day, Sun Zhenghao became Minister of War.',
  ],
  s0507: [
    'On day yimao, Sang\'e was made Minister of Personnel.',
    'On yimao day, Sang\'e became Minister of Personnel.',
  ],
  s0508: [
    'Twelfth month, day guiyou: He Shou was made grain-transport governor-general.',
    'In the twelfth month, He Shou was appointed grain-transport governor-general.',
  ],
  s0509: [
    'On day wuyin, the Emperor returned to the capital.',
    'On wuyin day, the Emperor returned to Beijing.',
  ],
  s0510: [
    'On day xinsi, an edict said: "Because the old ministers of the court are gradually passing away, those from the Shunzhi-era jinshi who left office and remain in their native places are now few.',
    'On xinsi day, an edict said that few Shunzhi-era jinshi who had retired to their home districts still survived among the court\'s senior ministers.',
  ],
  s0511: [
    'Wang Shizhen, Jiang Gao, Zhou Minzheng, Ye Jiaoran, and Xu Shujia had all been dismissed for minor offenses and were now all restored to their original offices.',
    'Wang Shizhen, Jiang Gao, Zhou Minzheng, Ye Jiaoran, and Xu Shujia, all earlier dismissed for minor faults, were restored to their former ranks.',
  ],
  s0512: [
    '" Zhao Shenqiao was made Censor-in-chief of the Left.',
    'Zhao Shenqiao became Censor-in-chief of the Left.',
  ],
  s0513: [
    'This year, disaster land tax for seven prefectures and counties in Zhili, Jiangnan, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in Zhili, Jiangnan, and elsewhere.',
  ],
  s0514: [
    'Korea and Annan sent tribute.',
    'Korea and Annan paid tribute.',
  ],
  s0515: [
    'Fiftieth year, spring, first month, day guichou: the Emperor toured the capital region and inspected the Tongzhou river dikes.',
    'In the fiftieth year, on guichou day in the first month, the Emperor toured the capital region and inspected Tongzhou\'s river works.',
  ],
  s0516: [
    'Second month, day xinyou: Bandi was made Manchu commander-in-chief and Shandan Mongol commander-in-chief.',
    'In the second month, Bandi became Manchu commander-in-chief and Shandan Mongol commander-in-chief.',
  ],
  s0517: [
    'On day dingmao, the Emperor inspected Kuang\'er Harbor and ordered construction of a water-lifting dam.',
    'On dingmao day, the Emperor inspected Kuang\'er Harbor and ordered a water-lifting dam built.',
  ],
  s0518: [
    'Next at Hexiwu, the Emperor went ashore and walked more than two li, personally set instruments, fixed the direction, and nailed marker stakes to record the points of survey.',
    'At Hexiwu he went ashore, walked two li, set surveying instruments, fixed the direction, and drove marker stakes for the survey.',
  ],
  s0519: [
    'He instructed: "With this method one can measure heaven and earth and solar and lunar eclipses.',
    'He said this method could measure heaven and earth and predict eclipses.',
  ],
  s0520: [
    'Calculation originates in the Changes.',
    'Calculation, he said, originated in the Book of Changes.',
  ],
  s0521: [
    'When the odd numbers seven and nine cannot exhaust all cases, use the even numbers twelve and twenty-four to exhaust them—that is, taking the image of the twelve hours and twenty-four seasonal nodes."',
    'Where seven and nine could not suffice, twelve and twenty-four completed the reckoning, matching the twelve hours and twenty-four qi.',
  ],
  s0522: [
    '" On day gengwu, the Emperor returned to the capital.',
    'On gengwu day, the Emperor returned to Beijing.',
  ],
  s0523: [
    'On day xinsi, the Emperor attended the Classics lecture.',
    'On xinsi day, the Emperor held the Classics lecture.',
  ],
  s0524: [
    'Third month, day gengyin: Wang Dachen and others asked that an honorific title be conferred for the longevity festival.',
    'In the third month, Wang Dachen and others sought an honorific title for the Emperor\'s longevity celebration.',
  ],
  s0525: [
    'Since the pacification of Yunnan, by now there had been four such requests in all.',
    'Since Yunnan was pacified, this was the fourth such request.',
  ],
  s0526: [
    'The Emperor had long been modest by nature and ultimately did not permit it.',
    'The Emperor, modest as ever, again refused.',
  ],
  s0527: [
    'Summer, fourth month, day gengshen: Xu Yuanzheng returned home to care for his parents, and Chen Shi was made Minister of Works.',
    'In the fourth month, Xu Yuanzheng went home to care for his parents and Chen Shi became Minister of Works.',
  ],
  s0528: [
    'On day gengchen, the Emperor escorted the Empress Dowager to Rehe for the summer.',
    'On gengchen day, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0529: [
    'On day yiwei, the Ministry of Rites was ordered to pray for rain.',
    'On yiwei day, the Ministry of Rites was ordered to conduct rain prayers.',
  ],
  s0530: [
    'On day gengzi, there was heavy rain.',
    'On gengzi day, heavy rain fell.',
  ],
  s0531: [
    'On day bingwu, Beijing Grand Secretary Zhang Yushu died; the Emperor mourned him, composed a poem, sent officers to manage the funeral, granted one thousand taels of silver, added sacrificial burial honors, and gave the posthumous title Wen Zhen.',
    'Grand Secretary Zhang Yushu died in Beijing; the Emperor mourned him, composed a poem, granted funeral honors and one thousand taels of silver, and gave the posthumous name Wen Zhen.',
  ],
  s0532: [
    'On day jiyou, an edict remitted more than one hundred thousand taels of Jiangsu unaccounted silver.',
    'On jiyou day, Jiangsu was granted remission of over one hundred thousand taels in unaccounted silver.',
  ],
  s0533: [
    'On day bingchen, the retired Grand Secretary Chen Tingjing was summoned to enter the Grand Secretariat and handle affairs.',
    'On bingchen day, retired Grand Secretary Chen Tingjing was recalled to the Grand Secretariat.',
  ],
  s0534: [
    'The quota for successful candidates who passed the Five Classics at the provincial and metropolitan examinations was increased.',
    'Provincial and metropolitan examination quotas for Five Classics passers were raised.',
  ],
  s0535: [
    'Sixth month, day wuchen: a Confucian school instructor was established for Xilong Prefecture in western Guangxi.',
    'In the sixth month, a school instructor was established at Xilong Prefecture in Guangxi.',
  ],
  s0536: [
    'Autumn, seventh month, day bingchen: the Emperor went on the hunting encirclement.',
    'In the seventh month, the Emperor went hunting.',
  ],
  s0537: [
    'Eighth month, day gengwu: the Chun Emperor Gaozong was born.',
    'In the eighth month, the future Qianlong Emperor was born.',
  ],
  s0538: [
    'Wang Yuanqi was made Academy Chancellor.',
    'Wang Yuanqi became Academy Chancellor.',
  ],
  s0539: [
    'A Five Classics Doctor was established for a descendant of the sage Ziyou.',
    'A Five Classics doctorate was established for a descendant of Ziyou.',
  ],
  s0540: [
    'Ninth month, day wushen: the Emperor escorted the Empress Dowager back to the palace.',
    'In the ninth month, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0541: [
    'Lan Li was dismissed for crimes; Yang Lin was made Fujian land-route provincial commander, and Ma Jibo Sichuan commander.',
    'Lan Li was dismissed; Yang Lin became Fujian land-route commander and Ma Jibo Sichuan commander.',
  ],
  s0542: [
    'Autumn executions for this year were suspended.',
    'Autumn executions were halted for the year.',
  ],
  s0543: [
    'Winter, tenth month, day bingchen: an edict remitted the rice levy due from Taiwan for the fifty-first year.',
    'In the tenth month, Taiwan\'s grain levy for the fifty-first year was remitted.',
  ],
  s0544: [
    'Bei Henuo was dismissed, and Song Zhu was made Minister of Rites.',
    'Bei Henuo was dismissed and Song Zhu became Minister of Rites.',
  ],
  s0545: [
    'On day wuwu, an edict said: "By the earlier decree land tax throughout the empire was universally remitted in rotation every three years; the fifty-first year reached Shanxi, Henan, Shaanxi, Gansu, Hubei, and Hunan, and land-poll tax and arrears in those six provinces were all remitted."',
    'An edict extended the empire-wide tax remission rotation to Shanxi, Henan, Shaanxi, Gansu, Hubei, and Hunan, remitting land tax and arrears there.',
  ],
  s0546: [
    'On day gengwu, Shuonai was made Manchu commander-in-chief, and Hu Shiba and Ma\'ersai Mongol commanders-in-chief.',
    'On gengwu day, Shuonai became Manchu commander-in-chief; Hu Shiba and Ma\'ersai Mongol commanders-in-chief.',
  ],
  s0547: [
    'On day wuyin, Korea\'s annual tribute of white gold and leopard skins was exempted.',
    'On wuyin day, Korea was exempted from its annual tribute of silver ingots and leopard skins.',
  ],
  s0548: [
    'On day gengchen, an edict ordered recommendation of filial and righteous conduct.',
    'On gengchen day, an edict called for recommending the filial and righteous.',
  ],
  s0549: [
    'On day xinsi, Zhang Penghe was ordered to set up a tribunal at Yangzhou to investigate the Jiangnan examination-hall case.',
    'On xinsi day, Zhang Penghe was sent to Yangzhou to investigate the Jiangnan examination scandal.',
  ],
  s0550: [
    'On day renwu, E Shan, Geng\'e, Qi Shiwu, Wuli, and others were found guilty; their offices were stripped and they were confined.',
    'On renwu day, E Shan, Geng\'e, Qi Shiwu, Wuli, and others were stripped of rank and imprisoned.',
  ],
  s0551: [
    'Zhao Shenqiao memorialized impeaching the newly appointed compiler Dai Mingshi for arrogant talent and many seditious words; the case was referred to the ministry for strict investigation.',
    'Zhao Shenqiao impeached the new compiler Dai Mingshi for arrogant, seditious writings; the ministry was ordered to investigate strictly.',
  ],
  s0552: [
    'Eleventh month, day bingxu: Yintebu was made Han Chinese commander-in-chief, Longkedo infantry commander, and Zhang Guzhen Yunnan commander.',
    'In the eleventh month, Yintebu became Han commander-in-chief, Longkedo infantry commander, and Zhang Guzhen Yunnan commander.',
  ],
  s0553: [
    'On day dingwei, the Emperor visited the tombs and granted horses and silver to the tomb-guarding officials and staff.',
    'On dingwei day, the Emperor visited the tombs and rewarded tomb guards with horses and silver.',
  ],
  s0554: [
    'Twelfth month, day guiyou: the Emperor returned to the palace.',
    'In the twelfth month, the Emperor returned to the palace.',
  ],
  s0555: [
    'On day guiwei, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On guiwei day, the joint seasonal temple sacrifice was held.',
  ],
  s0556: [
    'This year, disaster land tax for eight prefectures and counties in Zhili, Anhui, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in Zhili, Anhui, and elsewhere.',
  ],
  s0557: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0558: [
    'Registered households numbered 24,621,324; cultivated land 6,930,034 qing and 34 mou; collected silver 29,904,652 taels and 8 cash.',
    'The registers recorded 24.6 million households, 6.93 million qing of land, and 29.9 million taels of tax silver.',
  ],
  s0559: [
    'Salt tax silver amounted to 3,729,228 taels.',
    'Salt tax revenue was 3.73 million taels of silver.',
  ],
  s0560: [
    'Coins minted totaled more than 373,493,300 strings.',
    'Coinage exceeded 373 million strings.',
  ],
  s0561: [
    'Fifty-first year, spring, first month, day bingwu: Compiler Zhang Yishao was promoted to Hanlin Reader-in-waiting; he was the son of the late Grand Secretary Zhang Yushu.',
    'In the fifty-first year, on bingwu day in the first month, Compiler Zhang Yishao, son of the late Grand Secretary Zhang Yushu, was promoted to Hanlin Reader.',
  ],
  s0562: [
    'On day renzi, inner and outer ministers were ordered to submit folded memorials reporting affairs.',
    'On renzi day, civil and military ministers were ordered to submit folded memorials.',
  ],
  s0563: [
    'Folded memorial reporting thus began.',
    'This marked the beginning of folded-memorial reporting.',
  ],
  s0564: [
    'On day guichou, the Emperor toured the capital region.',
    'On guichou day, the Emperor toured the capital region.',
  ],
  s0565: [
    'An edict said: "Right Guard General of the imperial clan Feiyanggu has served honestly and long, and as he is a prince\'s son, he may be enfeoffed as Duke Who Assists the State."',
    'Feiyanggu, an imperial clansman serving as Right Guard General, was enfeoffed as Duke Who Assists the State for honest, long service.',
  ],
  s0566: [
    'Second month, day dingsi: an edict ordered the Song Neo-Confucian Zhu Xi added to sacrifice in the Confucian temple, placed after the Ten Wise Ones.',
    'In the second month, Zhu Xi was ordered enshrined in the Confucian temple after the Ten Wise Ones.',
  ],
  s0567: [
    'Jiangsu Governor Zhang Boxing and Governor-General Gali mutually impeached each other; both were dismissed and the case was referred to Zhang Penghe and He Shou for investigation.',
    'Governor Zhang Boxing and Governor-General Gali impeached each other; both were dismissed and Zhang Penghe and He Shou were sent to investigate.',
  ],
  s0568: [
    'Fujian-Zhejiang Governor-General Fan Shichong memorialized on coastal fishing boats: only single-masted vessels were permitted and they might not travel across provinces; local civil and military officials were to restrain them.',
    'Fan Shichong proposed restricting coastal fishing boats to single masts and confining them to their home provinces under local control.',
  ],
  s0569: [
    'The Emperor said: "This measure cannot be carried out.',
    'The Emperor said the proposal would not do.',
  ],
  s0570: [
    'If fishing households were merged into naval camps, soldiers and officers would bully them.',
    'Merging fishermen into naval camps would invite abuse by officers and troops.',
  ],
  s0571: [
    'How can bandits be entirely eliminated? Theft arises everywhere.',
    'Bandits cannot be wholly eradicated; theft occurs everywhere.',
  ],
  s0572: [
    'Only do what benefits the people; one must not use written law as a snare."',
    'Only measures that truly benefit the people should be adopted; written law must not become a trap."',
  ],
  s0573: [
    '" On day wuyin, outstanding military officers were ordered presented for audience like civil officials.',
    'On wuyin day, distinguished military officers were presented at court like civil officials.',
  ],
  s0574: [
    'On day gengchen, the Emperor returned to the capital.',
    'On gengchen day, the Emperor returned to Beijing.',
  ],
  s0575: [
    'On day renwu, an edict said: "In long peace the population daily grows.',
    'On renwu day, an edict noted that in prolonged peace the population kept growing.',
  ],
  s0576: [
    'Henceforth for newly registered population do not again levy poll-tax head; use this year\'s poll count as the fixed quota, and establish this as a regulation."',
    'Henceforth newly registered households would pay no additional poll tax; the current head count would serve as the permanent quota."',
  ],
  s0577: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0578: [
    'Third month, day xinmao: the Emperor instructed the Grand Secretaries: "Translating memorials is very important.',
    'In the third month, the Emperor told the Grand Secretaries that translating memorials was crucial.',
  ],
  s0579: [
    'Yesterday I saw in a text the two characters for \'acting official\' rendered as \'false official\'—the error is grave.',
    'He had seen \'acting official\' mistranslated as \'false official\' and called the mistake serious.',
  ],
  s0580: [
    'Strictly admonish this."',
    'He ordered strict correction."',
  ],
  s0581: [
    '" On day dingyou, the Emperor attended the Classics lecture.',
    'On dingyou day, the Emperor held the Classics lecture.',
  ],
  s0582: [
    'Summer, fourth month, day dingsi: Wang Shichen and one hundred seventy-seven others were granted jinshi and other ranks with distinctions.',
    'In the fourth month, Wang Shichen and 177 others received jinshi degrees with distinctions.',
  ],
  s0583: [
    'On day jiazi, Kang Tai was made Sichuan commander.',
    'On jiazi day, Kang Tai became Sichuan commander.',
  ],
  s0584: [
    'The rule for provincial quotas at the metropolitan examination was fixed.',
    'Provincial quotas for the metropolitan examination were fixed.',
  ],
  s0585: [
    'On day renshen, an instruction said: "The late Grand Secretary Xiong Cilü was a scholar of long standing; after his death We often think of him.',
    'On renshen day, the Emperor recalled the late scholar-minister Xiong Cilü.',
  ],
  s0586: [
    'Hearing that his son has grown up, he may be ordered to come to the capital for employment."',
    'He ordered Xiong\'s grown son summoned to Beijing for appointment."',
  ],
  s0587: [
    '" On day renxu, the late First-rank Guard Hai Qing was granted the designation of vice censor-in-chief of the Right, sacrificial burial honors were granted, and the posthumous title Guoyi was given.',
    'On renxu day, the late Guard Hai Qing received vice censor rank, burial honors, and the posthumous name Guoyi.',
  ],
  s0588: [
    'Retired Grand Secretary Chen Tingjing died; the third imperial son was ordered to offer tea and wine, the Emperor composed an elegy, and Hanlin Academicians Li Tingyi and Zhang Tingyu were ordered to deliver it and burn it; one thousand taels of silver were granted for the funeral, and the posthumous title Wen Zhen was given.',
    'Retired Grand Secretary Chen Tingjing died; the third prince offered libations, the Emperor wrote an elegy sent by Li Tingyi and Zhang Tingyu, and he received funeral silver and the posthumous name Wen Zhen.',
  ],
  s0589: [
    'An edict ordered that for the sixtieth-birthday longevity festival next year, a special provincial examination would be held in the second month and a metropolitan examination in the eighth month.',
    'Special provincial and metropolitan examinations were ordered for the Emperor\'s sixtieth-birthday year.',
  ],
  s0590: [
    'Song Zhu was made Grand Secretary, Hei Shuo\'e Minister of Rites, Man Du Minister of Works; Wang Yan was made Grand Secretary, Chen Shi Minister of Rites, and Zhang Tingchu was recalled as Minister of Works.',
    'Song Zhu, Hei Shuo\'e, Man Du, Wang Yan, Chen Shi, and Zhang Tingchu received new appointments.',
  ],
  s0591: [
    'On day bingzi, the Emperor escorted the Empress Dowager to Rehe for the summer and set out on the journey.',
    'On bingzi day, the Emperor escorted the Empress Dowager to Rehe and began the summer journey.',
  ],
  s0592: [
    'On day renwu, the Emperor halted at Rehe.',
    'On renwu day, the Emperor halted at Rehe.',
  ],
  s0593: [
    'Fifth month, day renyin: officials were ordered to investigate drifting population who planted land on the frontiers.',
    'In the fifth month, officials were ordered to investigate migrants farming on the frontiers.',
  ],
  s0594: [
    'Mu Dan was made Censor-in-chief of the Left, and E\'dai Mongol commander-in-chief.',
    'Mu Dan became Censor-in-chief of the Left and E\'dai Mongol commander-in-chief.',
  ],
  s0595: [
    'Sixth month, first day of the month on day guichou: there was a solar eclipse.',
    'On the new moon of the sixth month there was a solar eclipse.',
  ],
  s0596: [
    'On day dingsi, Mu Helun and Zhang Tingchu were ordered to re-investigate the mutual impeachment case between the Jiangnan governor-general and governor.',
    'On dingsi day, Mu Helun and Zhang Tingchu were sent to re-investigate the Zhang Boxing–Gali case.',
  ],
  s0597: [
    'In Huguang, Zhenjiang Red Miao leader Wu Laohua led Maodutang and fifty-two stockades to submit.',
    'Red Miao leader Wu Laohua of Zhenjiang led fifty-two stockades in Huguang to submit.',
  ],
  s0598: [
    'On day xinyou, Zhang Chaowu was made Guangxi commander.',
    'On xinyou day, Zhang Chaowu became Guangxi commander.',
  ],
  s0599: [
    'Autumn, eighth month, day guichou: the Emperor went on the hunting encirclement.',
    'In the eighth month, the Emperor went hunting.',
  ],
  s0600: [
    'On day wuyin, an edict ordered that when Korea encountered Chinese fishing boats violating prohibitions at border patrol posts, they might detain them and report.',
    'On wuyin day, Korea was permitted to detain Chinese fishing boats that violated border rules and report them.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b06.mjs <translation.json>'
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
