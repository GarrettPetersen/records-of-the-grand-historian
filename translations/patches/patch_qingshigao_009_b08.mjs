#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day guichou, Chen Tan and three hundred twenty-eight others were granted jinshi and other ranks with distinctions.',
    'On guichou day, Chen Tan and 328 others received jinshi degrees with graded ranks.',
  ],
  s0702: [
    'On day yimao, Ji Zengyun was made Grand Secretary while continuing as director-general of waterways.',
    'On yimao day, Ji Zengyun became Grand Secretary and kept charge of the Grand Canal.',
  ],
  s0703: [
    'Liu Yuyi was made Minister of Personnel, Tu Tianxiang Minister of Justice, and Zhang Zhao Left Censor-in-chief.',
    'Liu Yuyi, Tu Tianxiang, and Zhang Zhao received new ministerial posts.',
  ],
  s0704: [
    'On day jiwei, an imperial call was issued to recommend men of broad learning and eminent literary talent.',
    'On jiwei day, the court summoned candidates for the erudite-literary examination.',
  ],
  s0705: [
    'Fifth month, day jiashen: Gao Qizhuo memorialized that Pu\'en Miao leader Diao Xingguo had rebelled; he was suppressed and pacified.',
    'In the fifth month, Gao Qizhuo reported suppression of a Pu\'en Miao revolt led by Diao Xingguo.',
  ],
  s0706: [
    'Compiler Zhang Ruogai and Hanlin expectants E Rong\'an and E Lun were ordered to serve at the Grand Council.',
    'Zhang Ruogai, E Rong\'an, and E Lun were assigned to the Grand Council.',
  ],
  s0707: [
    'On day yiwei, Imperial Son-in-law Celeng was made Left Deputy General for Pacifying the Frontier, Changde as his deputy; Tarda\'e Right Deputy General, Yongfu as his deputy; together they garrisoned Kobdo.',
    'On yiwei day, Celeng and Tarda\'e became left and right deputy frontier generals at Kobdo, with Changde and Yongfu as deputies.',
  ],
  s0708: [
    'The continued revision of the Collected Statutes was completed.',
    'The revised Collected Statutes were completed.',
  ],
  s0709: [
    'On day renyin, Heilongjiang general Du Zai memorialized that six Chuo Min clans of Temen, Qitu Hill, and other sea islands had submitted, paying tribute of sable pelts annually.',
    'On renyin day, six clans on Heilongjiang sea islands submitted and paid annual sable tribute.',
  ],
  s0710: [
    'On day jiyou, former provincial commander Ji Chengabin was executed.',
    'On jiyou day, former commander Ji Chengabin was executed.',
  ],
  s0711: [
    'Sixth month, day wuwu: the king of Sulu, Muhammad Maulana, memorialized that his distant ancestor the Eastern King came to court in the Yongle reign of Ming and died of illness at Dezhou, Shandong, on the return journey.',
    'In the sixth month, the Sulu king reported that his Ming-era ancestor the Eastern King died at Dezhou, Shandong, after an embassy.',
  ],
  s0712: [
    'His eldest son returned home to succeed as king; the second son Andulu and the third son Wenkhala remained to guard the tomb.',
    'The eldest son succeeded at home; Andulu and Wenkhala stayed to guard the tomb.',
  ],
  s0713: [
    'Their descendants divided into the An and Wen surnames, receiving eight taels of silver yearly for sacrifices; they asked that their descendants be made ritual attendants.',
    'Descendants of the An and Wen lines received eight taels yearly for rites and sought appointment as ritual attendants.',
  ],
  s0714: [
    'It was approved.',
    'The request was granted.',
  ],
  s0715: [
    'On day wuyin, Ha Yuansheng memorialized that the nine-braid rebellious Miao had been suppressed and pacified.',
    'On wuyin day, Ha Yuansheng reported suppression of nine-braid Miao rebels.',
  ],
  s0716: [
    'Autumn, seventh month, day yiyou: Grand Secretary Chen Yuanlong, over eighty years old, asked to retire; he was made Junior Tutor to the Heir Apparent and retired with honor.',
    'In the seventh month, Grand Secretary Chen Yuanlong, over eighty, retired as Junior Tutor to the Heir Apparent.',
  ],
  s0717: [
    'Li Hui was stripped of office for speaking on matters beyond his jurisdiction.',
    'Li Hui lost his post for overstepping in memorializing.',
  ],
  s0718: [
    'The Hunan commissioner for observing customs and reforming popular practices was abolished.',
    'The Hunan customs-reform commissioner post was cut.',
  ],
  s0719: [
    'On day wuzi, Prince Shuncheng Xibao was stripped of his noble rank; his son Xiliang still inherited the commandery prince title.',
    'Prince Shuncheng Xibao lost his rank; his son Xiliang kept the commandery prince title.',
  ],
  s0720: [
    'Prince Ping Fupeng was made great general for securing the frontier.',
    'Prince Ping Fupeng became frontier great general.',
  ],
  s0721: [
    'Prince Danjin Dorji was demoted from prince to commandery prince and his brave-title removed.',
    'Prince Danjin Dorji was demoted to commandery prince and lost his honorary epithet.',
  ],
  s0722: [
    'Eighth month, day dingmao: Gu Cong was made Zhili director-general of waterways; Zhao Hong\'en Two-Jiangs governor-general; Gao Qizhuo Jiangsu provincial governor.',
    'In the eighth month, Gu Cong, Zhao Hong\'en, and Gao Qizhuo received river and provincial posts.',
  ],
  s0723: [
    'On day jisi, four route co-magistrates for catching bandits were established in Shuntian prefecture.',
    'On jisi day, four Shuntian bandit-catching co-magistrates were created.',
  ],
  s0724: [
    'Ninth month, day xinchou: E\'erqi was dismissed from office and placed under investigation.',
    'In the ninth month, E\'erqi was dismissed pending investigation.',
  ],
  s0725: [
    'Qing Fu was made Minister of Revenue; E Chang acted as commandant of the Metropolitan Banners.',
    'Qing Fu became Minister of Revenue; E Chang acted as metropolitan banner commandant.',
  ],
  s0726: [
    'Winter, tenth month, day xinyou: Kou Lou was made Mongol banner commander-in-chief; Duke Zhongda Ma Lishan Minister of Justice.',
    'In the tenth month, Kou Lou became Mongol commander-in-chief and Ma Lishan Minister of Justice.',
  ],
  s0727: [
    'Eleventh month, day jiachen: Duke Guoyi Neqin was ordered to serve at the Grand Council.',
    'In the eleventh month, Duke Guoyi Neqin was assigned to the Grand Council.',
  ],
  s0728: [
    'Twelfth month, day wuwu, an edict said: "Earlier E\'mida memorialized on building walled cities in Taiwan.',
    'In the twelfth month, an edict cited earlier proposals to fortify Taiwan.',
  ],
  s0729: [
    'Hao Yulin memorialized that Taiwan thorn bamboo, planted densely, could form a wall.',
    'Hao Yulin said thorn bamboo could serve as defensive walls.',
  ],
  s0730: [
    'Taiwan disturbances generally arise from within.',
    'The edict said Taiwan revolts usually sprang from internal causes.',
  ],
  s0731: [
    'Without walled cities for bandits to hold, they are easily suppressed.',
    'Without cities, rebels were easier to rout.',
  ],
  s0732: [
    'Only at Lukang is the gateway to the prefectural seat; building batteries there suffices for defense.',
    'Lukang batteries were ordered for the prefectural gateway.',
  ],
  s0733: [
    'Planting thorn bamboo can serve as an outer hedge.',
    'Thorn bamboo hedges were approved where useful.',
  ],
  s0734: [
    'Batteries at Tamsui and other places should also be built and repaired in season."',
    'Forts at Tamsui and elsewhere were to be built and maintained."',
  ],
  s0735: [
    'On day jiwei, Shi Yizhi was made Minister of Revenue, Zhang Zhao Minister of Justice, and Xu Ben Left Censor-in-chief.',
    'On jiwei day, Shi Yizhi, Zhang Zhao, and Xu Ben received ministerial posts.',
  ],
  s0736: [
    'On day renxu, Gao Bin was made Jiangnan director-general of waterways.',
    'On renxu day, Gao Bin became Jiangnan river director-general.',
  ],
  s0737: [
    'On day bingzi, joint seasonal sacrifice was held at the Imperial Ancestral Temple.',
    'On bingzi day, the seasonal temple sacrifice was held.',
  ],
  s0738: [
    'That year, disaster land tax was remitted for twenty-nine prefectures, counties, and garrisons in Zhili, Jiangsu, Anhui, Jiangxi, Shandong, and other provinces; salt-field tax was also remitted in Jiangsu for twenty-five yin of salt quota to varying degrees.',
    'That year, disaster tax relief was granted across several provinces and Jiangsu salt levies were reduced.',
  ],
  s0739: [
    'Korea, Annam, and Sulu sent tribute.',
    'Korea, Annam, and Sulu paid tribute.',
  ],
  s0740: [
    'Twelfth year, jiazi year, spring, first month, day xinchou: Prince Ping Fupeng presented five hundred horses to supply the army.',
    'In the twelfth year, Prince Ping Fupeng presented five hundred horses for the army.',
  ],
  s0741: [
    'On day renyin, Vice Minister Chakedan, having handled affairs of the Tsetsen Khan tribes well, was given the ministerial rank, granted five thousand taels of silver, and his confiscated estates, land, and household members were restored.',
    'On renyin day, Chakedan received ministerial rank, silver, and restoration of confiscated property.',
  ],
  s0742: [
    'Second month, day guichou: the Emperor attended the Classics lecture.',
    'In the second month, the Emperor held the Classics lecture.',
  ],
  s0743: [
    'On day jiwei, Imperial Clansman Yinhu was promoted from beizi to beile.',
    'On jiwei day, Yinhu was promoted from beizi to beile.',
  ],
  s0744: [
    'On day yichou, Reader Chunshan and Censor Li Xueyu were ordered to invest the king of Annam.',
    'On yichou day, Chunshan and Li Xueyu were sent to invest the Annam king.',
  ],
  s0745: [
    'On day renshen, Imperial Son-in-law Celeng was ordered to take overall charge of front-line military affairs.',
    'On renshen day, Celeng took overall charge of frontier operations.',
  ],
  s0746: [
    'On day guiyou, Yuan Zhancheng memorialized that one hundred sixty stockades east and west of the slopes had submitted.',
    'On guiyou day, Yuan Zhancheng reported 160 Miao stockades had submitted.',
  ],
  s0747: [
    'Recognition was granted to Xingning county old man Xing Dengyun, one hundred two years old, and five sons each seventy or eighty, long-lived in one family; an additional bolt of imperial satin was bestowed.',
    'A 102-year-old Guangdong patriarch and his five elderly sons received an imperial satin gift.',
  ],
  s0748: [
    'Third month, day dingchou: Minister of Works Fan Shiyi was dismissed.',
    'In the third month, Works Minister Fan Shiyi was dismissed.',
  ],
  s0749: [
    'On day wuxu, Henan education intendant Yu Hongtu was executed for extortion; his father Vice Minister Yu Zhaosheng was stripped of office.',
    'On wuxu day, Yu Hongtu was executed for graft and his father Yu Zhaosheng dismissed.',
  ],
  s0750: [
    'Yin Jishan memorialized that Pu\'en rebel Miao had been suppressed and those who surrendered were received.',
    'Yin Jishan reported Pu\'en rebels suppressed and surrenders accepted.',
  ],
  s0751: [
    'An edict received: "In all affairs one is lax near completion and careless after things are settled.',
    'The Emperor warned against slackness near victory.',
  ],
  s0752: [
    'Strive on."',
    'He urged continued effort."',
  ],
  s0753: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0754: [
    'Summer, fourth month, day dingwei: Rongmei native prefect Tian Minru was guilty and removed; the territory was converted to regular administration.',
    'In the fourth month, Rongmei chieftain Tian Minru was deposed and the district garrisoned with regular officials.',
  ],
  s0755: [
    'Prince Kang Chong\'an died; his uncle Barutu inherited the title; his son Yong\'en was enfeoffed as beile.',
    'Prince Kang Chong\'an died; Barutu succeeded and Yong\'en was made beile.',
  ],
  s0756: [
    'On day gengwu, Guangdong ivory sleeping mats were banned, and private purchase was forbidden.',
    'On gengwu day, Guangdong ivory mats were banned for official and private use.',
  ],
  s0757: [
    'Fifth month, day jimao: the Shinan pacification commissioner post was replaced with a regular official.',
    'In the fifth month, Shinan was converted to regular administration.',
  ],
  s0758: [
    'On day guisi, Li Xi was made Han banner commander-in-chief.',
    'On guisi day, Li Xi became Han commander-in-chief.',
  ],
  s0759: [
    'On day yiwei, because Dzungar envoys had come, the advance of troops was halted.',
    'On yiwei day, troop advance halted when Dzungar envoys arrived.',
  ],
  s0760: [
    'On day jihai, Internal Affairs commissioner Laibao was ordered to proceed to the Tsetsen Khan department to handle affairs jointly with Chakedan.',
    'On jihai day, Laibao was sent to the Tsetsen Khan department with Chakedan.',
  ],
  s0761: [
    'Sixth month, day dingwei: fifteen native offices including Zhongdong in Huguang were replaced with regular officials.',
    'In the sixth month, fifteen Huguang native offices were converted to regular rule.',
  ],
  s0762: [
    'Autumn, seventh month, day guisi: Prince Guo Yinli was ordered to manage affairs at the Dalai Lama\'s residence in Tibet and to review troops in Zhili, Shanxi, Shaanxi, and Sichuan.',
    'In the seventh month, Prince Guo Yinli was sent to Tibet and to review troops in several provinces.',
  ],
  s0763: [
    'An edict said that on the northwestern two routes troops had been employed for many years: either advance directly into enemy territory with present strength, or dispatch envoys to explain pros and cons; court ministers were to deliberate jointly and report.',
    'The court was ordered to debate whether to advance or send envoys on the long northwest campaign.',
  ],
  s0764: [
    'Prince Kang Bartu and others favored advance; Grand Secretary Zhang Tingyu and others favored sending envoys.',
    'Bartu favored attack; Zhang Tingyu favored diplomacy.',
  ],
  s0765: [
    'The Emperor then set forth the whole course of the campaign from the start and followed the latter proposal to send envoys.',
    'The Emperor recounted the war and chose to send envoys.',
  ],
  s0766: [
    'Eighth month, day bingwu: Fu Tai and Akedun were dispatched to Dzungaria to proclaim the edict.',
    'In the eighth month, Fu Tai and Akedun were sent to Dzungaria.',
  ],
  s0767: [
    'On day renxu, Beizi Yinli was demoted to duke; Prince Tai Hongchun was demoted to beizi.',
    'On renxu day, Yinli and Hongchun were demoted.',
  ],
  s0768: [
    'Ninth month, day jiashen: Vice Minister Lü Yaoceng and Director Defu were ordered to proclaim edicts to Miao tribes in Guizhou.',
    'In the ninth month, Lü Yaoceng and Defu were sent to Guizhou Miao.',
  ],
  s0769: [
    'Yunnan was ordered to open furnaces for coin casting.',
    'Yunnan was ordered to mint coin.',
  ],
  s0770: [
    'Winter, tenth month, day bingwu: Prince Guo Yinli memorialized: "When ministers submit memorials on regulations, they should state facts fully and must not patch together perfunctory answers.',
    'In the tenth month, Prince Guo urged honest memorials, not perfunctory ones.',
  ],
  s0771: [
    'An edict received: "What you say is very correct; inform the officials who rotate in submitting regulations."',
    'The Emperor agreed and told rotating memorialists to heed it."',
  ],
  s0772: [
    'On day dingwei, E\'mida acted as Tianjin banner commander; Aligung Qingzhou general; Fusen Hangzhou general.',
    'On dingwei day, E\'mida, Aligung, and Fusen received military posts.',
  ],
  s0773: [
    'On day wuwu, Hao Yulin was made Zhe-Fujian governor-general.',
    'On wuwu day, Hao Yulin became Zhe-Fujian governor-general.',
  ],
  s0774: [
    'San Tai and Xu Ben were both assigned to assist Grand Secretariat affairs.',
    'San Tai and Xu Ben were assigned to assist the Grand Secretariat.',
  ],
  s0775: [
    'On day jisi, auspicious fungi grew at Jingling.',
    'On jisi day, auspicious fungi appeared at the Yongzheng mausoleum.',
  ],
  s0776: [
    'Eleventh month, day renshen, first of the month: former Prince Zhi Yinze died; he was buried with beizi rites; his son Hongfang was enfeoffed as Defender of the State.',
    'On the first of the eleventh month, Yinze died; Hongfang was made Defender of the State.',
  ],
  s0777: [
    'On day bingyin, continued revision of the Imperial Qing Literary Collection was ordered.',
    'On bingyin day, revision of the Imperial Qing Literary Collection was ordered.',
  ],
  s0778: [
    'On day renwu, a special edict to Zhang and Quan prefectures in Fujian to reform their fierce character and cease clan armed fights.',
    'On renwu day, Fujian\'s Zhang and Quan prefectures were told to end clan feuds.',
  ],
  s0779: [
    'On day wuzi, Prince Limi\'s son Hongchao was enfeoffed as Assistant State Defender.',
    'On wuzi day, Hongchao was made Assistant State Defender.',
  ],
  s0780: [
    'Twelfth month, day guichou, first of the month: Guangxi was again placed under the Guangdong governor-general\'s concurrent jurisdiction.',
    'On the first of the twelfth month, Guangxi returned to Guangdong governor-general\'s jurisdiction.',
  ],
  s0781: [
    'On day dingsi, Wei Tingzhen was made Minister of War; Gu Cong grain transport director-general; Zhu Zao Zhili director-general of waterways; Bai Zhongshan Hedong director-general of waterways; Gao Bin Jiangnan director-general of waterways.',
    'On dingsi day, Wei Tingzhen, Gu Cong, Zhu Zao, Bai Zhongshan, and Gao Bin received posts.',
  ],
  s0782: [
    'On day gengwu, joint seasonal sacrifice was held at the Imperial Ancestral Temple.',
    'On gengwu day, the seasonal temple sacrifice was held.',
  ],
  s0783: [
    'That year, disaster land tax was remitted for fourteen prefectures and counties in Zhili, Anhui, and other provinces; Zhili salt-field tax was also remitted for fourteen yin of salt quota to varying degrees.',
    'That year, disaster tax and salt relief were granted in several provinces.',
  ],
  s0784: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0785: [
    'Thirteenth year, yimao year, spring, first month, day jichou: Aisin Gioro Baixiu was made Shengjing general; Nasutu Heilongjiang general; Hexing Ningxia general.',
    'In the thirteenth year, Baixiu, Nasutu, and Hexing became frontier generals.',
  ],
  s0786: [
    'Second month, day jiyou: the Emperor attended the Classics lecture.',
    'In the second month, the Emperor held the Classics lecture.',
  ],
  s0787: [
    'On day gengxu, Wei Tingzhen was made Minister of Rites.',
    'On gengxu day, Wei Tingzhen became Minister of Rites.',
  ],
  s0788: [
    'On day guichou, the Emperor visited the imperial tombs.',
    'On guichou day, the Emperor visited the tombs.',
  ],
  s0789: [
    'On day jiwei, he returned to the capital.',
    'On jiwei day, he returned to Beijing.',
  ],
  s0790: [
    'On day jiazi, Batai was assigned to assist as Grand Secretary.',
    'On jiazi day, Batai was assigned to assist the Grand Secretariat.',
  ],
  s0791: [
    'Third month, day dingsi: the Emperor personally plowed the sacred field.',
    'In the third month, the Emperor plowed the sacred field.',
  ],
  s0792: [
    'On day wuzi, an edict said: "In organizing local baojia household registers, one must comply with popular feeling and guide them gradually.',
    'On wuzi day, an edict urged gradual, popular-guided baojia registration.',
  ],
  s0793: [
    'If too harsh, the good suffer.',
    'Harsh enforcement would harm the innocent.',
  ],
  s0794: [
    'In governing, obtaining the right men is essential; without the right men, however fine the law, it is mere display and of no benefit to the people."',
    'Without capable officials, good laws availed nothing."',
  ],
  s0795: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0796: [
    'Summer, fourth month, day yimao: the Collected Writings of the Holy Ancestor were published and bestowed on court ministers.',
    'In the fourth month, Kangxi\'s collected writings were published and given to ministers.',
  ],
  s0797: [
    'On day dingsi, Guangdong mining was halted.',
    'On dingsi day, Guangdong mining was stopped.',
  ],
  s0798: [
    'Intercalary fourth month, day dingyou: the Dzungars sent envoy Namuka bearing tribute and memorial.',
    'In the intercalary fourth month, a Dzungar envoy brought tribute.',
  ],
  s0799: [
    'Orders were issued to fix the border.',
    'The court ordered a border demarcation.',
  ],
  s0800: [
    'On day jihai, the First Silkworm Altar was built in the northern suburbs.',
    'On jihai day, the First Silkworm Altar was built north of the city.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b08.mjs <translation.json>'
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
