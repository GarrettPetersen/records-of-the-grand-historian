#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'All overdue debts from before year 19 are fully remitted.',
    'Every outstanding debt dating to before the nineteenth year is cancelled outright.',
  ],
  s0402: [
    'Where there was no harvest last year, assess by field and report reductions.',
    'Where last year\u2019s harvest failed, reductions are to be surveyed field by field and reported.',
  ],
  s0403: [
    'In places of extreme hardship, envoys are sent to the commanderies and counties to grant relief as appropriate.',
    'In the worst-afflicted districts, envoys are dispatched to the commanderies and counties to distribute relief as local conditions require.',
  ],
  s0404: [
    'All who wish to attach to farming but lack seed grain are to be given additional loans.',
    'Anyone wishing to settle on the land but short of seed is to receive extra grain on loan.',
  ],
  s0405: [
    'Corvée laborers of the thousand-mu estate units are each granted cloth in differing amounts.',
    'Corvée workers on the thousand-mu estates receive cloth stipends graded by rank.',
  ],
  s0406: [
    'On wuwu, General of the Guard Prince of Linchuan Yiqing died.',
    'On wuwu, Prince of Linchuan Yiqing, general of the guard, died.',
  ],
  s0407: [
    'On xinyou, Crown Prince Household Steward Liu Yizong was made Southern Xuzhou Inspector.',
    'On xinyou, crown prince household steward Liu Yizong was appointed Southern Xuzhou inspector.',
  ],
  s0408: [
    'In the second month, on gengwu, General of the Household Guards Zhao Bofu was made Yuzhou Inspector.',
    'In the second month, on gengwu, household guards general Zhao Bofu became Yuzhou inspector.',
  ],
  s0409: [
    'On jichou, Minister over the Masses and Supervisor of the Masters of Writing Prince of Jiangxia Yigong advanced to Grand Commandant, retaining Minister over the Masses.',
    'On jichou, Prince of Jiangxia Yigong—minister over the masses and supervisor of the Masters of Writing—was promoted to grand commandant while keeping the ministry of works.',
  ],
  s0410: [
    'On gengyin, General of the Right Guard Shen Yanzhi was made General of the Central Household Guards.',
    'On gengyin, right guard general Shen Yanzhi was appointed general of the central household guards.',
  ],
  s0411: [
    'On xinmao, the seventh imperial son Hong was established as Prince of Jianping.',
    'On xinmao, the seventh prince Hong was enfeoffed as Prince of Jianping.',
  ],
  s0412: [
    'On jiawu, Prince of Guangling Dan was made Southern Yanzhou Inspector.',
    'On jiawu, Prince of Guangling Dan was appointed Southern Yanzhou inspector.',
  ],
  s0413: [
    'In the fourth month of summer, Xu Geng of Yanling in Jinling commandery presented a thousand hu of grain to relieve the famine-stricken people.',
    'In the fourth summer month, Xu Geng of Yanling in Jinling donated a thousand hu of grain to feed the hungry.',
  ],
  s0414: [
    'On renxu of the fifth month, Minister of the Masters of Writing He Shangzhi was made General Who Protects the Army; Consulting Military Adviser Liu Daoxi was made Guangzhou Inspector.',
    'On renxu of the fifth month, He Shangzhi of the Masters of Writing became general who protects the army, and consulting adviser Liu Daoxi became Guangzhou inspector.',
  ],
  s0415: [
    'In the sixth month, rain fell continuously.',
    'The sixth month brought unbroken rain.',
  ],
  s0416: [
    'On dinghai, an edict said: "Days of steady rain have turned into flooding; the people, long frugal, are easily driven to want."',
    'On dinghai an edict declared: "Prolonged rain has brought floods; after years of thrift the people are quickly reduced to need."',
  ],
  s0417: [
    'The magistrates of the two counties and the supervising officers of the camps and offices are each, according to their jurisdiction, to inspect and verify and supply firewood and grain, making certain that nothing is left wanting."',
    'Magistrates of the two counties and camp and office supervisors are to check their jurisdictions, verify needs, and issue firewood and grain until every household is provided for."',
  ],
  s0418: [
    'In the seventh month of autumn, on dingyou, Yangzhou Inspector Prince of Shixing Jun was given the additional title General of the Central Army; Southern Yuzhou Inspector Prince of Wuling Jun was given the additional title General Who Pacifies the Army.',
    'On dingyou in the seventh autumn month, Prince of Shixing Jun, Yangzhou inspector, was made general of the central army, and Prince of Wuling Jun, Southern Yuzhou inspector, general who pacifies the army.',
  ],
  s0419: [
    '[30] On yisi, an edict said: "In recent years the grain harvest has been injured, and excessive drought has become a disaster—this is also because the fit seasons for sowing are still not fully observed."',
    '[30] On yisi an edict declared: "Harvests have suffered in recent years and drought has become a calamity—partly because sowing seasons are still not fully kept."',
  ],
  s0420: [
    'In Southern Xu, Yan, Yu, and the commanderies west of the Zhe River belonging to Yang Province, from now on wheat is to be supervised and planted throughout, to help supply what is lacking.',
    'Southern Xu, Yan, Yu, and the Yangzhou commanderies west of the Zhe are henceforth to plant wheat under supervision to fill the shortfall.',
  ],
  s0421: [
    'Quickly transport the seed on hand in Pengcheng and Xiapi commanderies and entrust it to the inspectors for loan and distribution.',
    'Seed stock in Pengcheng and Xiapi is to be rushed forward and lent out by the provincial inspectors.',
  ],
  s0422: [
    'Xu and Yu have much paddy land, yet the people devote themselves solely to dry-field crops; orders are to be sent to the two military districts to follow the old embankments, repair them together, and moreover assign reclamation—so that this may be achieved by next year.',
    'Xu and Yu are rich in paddies yet farmers favor dry crops; the two frontier commands are ordered to restore old dikes jointly, open new fields, and finish the work within the year.',
  ],
  s0423: [
    'In all provinces and commanderies, let every inch of land\u2019s benefit be diligently pursued; encourage sowing; mulberry, hemp, and ramie each according to its proper method—do not merely carry out documents on paper."',
    'Every province and commandery must exploit its soil to the full, promote planting, and raise silk, hemp, and ramie each in its season—not merely shuffle paperwork."',
  ],
  s0424: [
    'On wuchen of the eighth month, General Who Campaigns in the West and Jingzhou Inspector Prince of Hengyang Yiji was made General Who Campaigns in the North, Opening Office with ceremonial equal to the Three Excellencies, and Southern Xuzhou Inspector; General Who Campaigns in the North and Southern Xuzhou Inspector Prince of Nanqiao Yixuan was made General of Chariots and Cavalry and Jingzhou Inspector.',
    'On wuchen of the eighth month, Prince of Hengyang Yiji became northern campaigning general with opening office equal to the Three Excellencies and Southern Xuzhou inspector; Prince of Nanqiao Yixuan became general of chariots and cavalry and Jingzhou inspector.',
  ],
  s0425: [
    '[31] Southern Yanzhou Inspector Prince of Guangling Dan was made Southern Xuzhou Inspector.',
    '[31] Prince of Guangling Dan moved from Southern Yanzhou to Southern Xuzhou.',
  ],
  s0426: [
    'On jiachen of the ninth month, Juqu Anzhou of Northern Liang was made General Who Campaigns in the West and Liangzhou Inspector and enfeoffed as King of Hexi.',
    'On jiachen of the ninth month, Juqu Anzhou of Northern Liang was made western campaigning general and Liangzhou inspector and enfeoffed king of Hexi.',
  ],
  s0427: [
    'In the tenth month of winter, on jimao, General of the Left Army Xu Qiong was made Yanzhou Inspector; Grand General Staff Officer Shen Tian was made Jizhou Inspector.',
    'In the tenth winter month, on jimao, left army general Xu Qiong became Yanzhou inspector and grand general staff officer Shen Tian Jizhou inspector.',
  ],
  s0428: [
    'In the first month of spring of year 22, on xinmao, the new Yuanjia calendar of Censor-in-Chief He Chengtian was adopted.',
    'On xinmao, new year\u2019s day of year 22, the court adopted He Chengtian\u2019s Yuanjia calendar.',
  ],
  s0429: [
    'On renchen, General Who Pacifies the Army and Southern Yuzhou Inspector Prince of Wuling Jun was made Yongzhou Inspector; Xiangzhou Inspector Prince of Nanping Shuo was made Southern Yuzhou Inspector.',
    'On renchen, Prince of Wuling Jun moved from Southern Yuzhou to Yongzhou, and Prince of Nanping Shuo from Xiangzhou to Southern Yuzhou.',
  ],
  s0430: [
    'In the second month, on xinsi, Palace Attendant Wang Silang was made Xiangzhou Inspector.',
    'In the second month, on xinsi, palace attendant Wang Silang was appointed Xiangzhou inspector.',
  ],
  s0431: [
    'On jiaxu, the eighth imperial son Hui was established as Prince of Donghai, and the ninth imperial son Chang as Prince of Yiyang.',
    'On jiaxu, the eighth prince Hui was enfeoffed as Prince of Donghai and the ninth prince Chang as Prince of Yiyang.',
  ],
  s0432: [
    'In the sixth month of summer, on xinhai, Southern Yuzhou Inspector Prince of Nanping Shuo was made Yuzhou Inspector.',
    'On xinhai in the sixth summer month, Prince of Nanping Shuo was transferred from Southern Yuzhou to Yuzhou.',
  ],
  s0433: [
    'In the seventh month of autumn, on jiwei, Vice Director of the Masters of Writing Meng Yi was made Left Vice Director of the Masters of Writing; General Who Protects the Army He Shangzhi was made Right Vice Director of the Masters of Writing.',
    'On jiwei in the seventh autumn month, Meng Yi became left vice director of the Masters of Writing and He Shangzhi right vice director.',
  ],
  s0434: [
    'Yongzhou Inspector Prince of Wuling Jun attacked the Man along the Han River and moved more than fourteen thousand households to the capital.',
    'Prince of Wuling Jun, Yongzhou inspector, campaigned against Han River tribes and resettled more than fourteen thousand households at the capital.',
  ],
  s0435: [
    'On yiyou, General Who Campaigns in the North and Southern Xuzhou Inspector Prince of Hengyang Yiji was made Xuzhou Inspector.',
    'On yiyou, Prince of Hengyang Yiji was transferred from northern campaigning general and Southern Xuzhou to Xuzhou.',
  ],
  s0436: [
    'On jiwei of the ninth month, [32] the prohibition on wine was lifted.',
    'On jiwei of the ninth month, [32] the ban on wine was revoked.',
  ],
  s0437: [
    'In the tenth month of winter, a thousand qing of abandoned fields at Hushu were brought back into cultivation.',
    'In the tenth winter month, a thousand qing of fallow land at Hushu were reopened.',
  ],
  s0438: [
    'On yiwei of the twelfth month, Crown Prince Household Steward Fan Ye plotted rebellion; he and his faction were all executed.',
    'On yiwei of the twelfth month, Fan Ye, crown prince household steward, was convicted of treason; he and his associates were put to death.',
  ],
  s0439: [
    'On dingyou, Grand General Prince of Pengcheng Yikang was stripped of rank and made a commoner.',
    'On dingyou, Grand General Prince of Pengcheng Yikang was demoted to commoner status.',
  ],
  s0440: [
    'On gengxu, former Yuzhou Inspector Zhao Bofu was made General Who Protects the Army.',
    'On gengxu, former Yuzhou inspector Zhao Bofu was appointed general who protects the army.',
  ],
  s0441: [
    'In the first month of spring of year 23, on dingsi, Interior Minister of Changsha Lu Hui was made Yi Province Inspector.',
    'On dingsi in the twenty-third year\u2019s first spring month, Changsha interior minister Lu Hui became Yi Province inspector.',
  ],
  s0442: [
    'On gengshen, Left Vice Director of the Masters of Writing Meng Yi left office.',
    'On gengshen, left vice director Meng Yi resigned his post.',
  ],
  s0443: [
    'Migrants from the Han River region were resettled along the Mian.',
    'Han River refugees were relocated to the banks of the Mian.',
  ],
  s0444: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0445: [
    'In the second month, on guimao, General of the Left Guard Liu Yibin was made Southern Xuzhou Inspector.',
    'On guimao in the second month, left guard general Liu Yibin was appointed Southern Xuzhou inspector.',
  ],
  s0446: [
    'In the third month, the Northern Wei raided Yan and Yu; Qing and Ji Inspector Shen Tian defeated them.',
    'In the third month the Northern Wei attacked Yan and Yu; Shen Tian, inspector of Qing and Ji, routed them.',
  ],
  s0447: [
    'In the fourth month of summer, on dingwei, a general amnesty was proclaimed for the empire.',
    'On dingwei in the fourth summer month a general amnesty was declared.',
  ],
  s0448: [
    'On guiwei, the new moon of the sixth month, there was a solar eclipse.',
    'On guiwei, new moon of the sixth month, the sun was eclipsed.',
  ],
  s0449: [
    'Jiao Province Inspector Tan Hezhi attacked the state of Linyi and took it.',
    'Tan Hezhi, Jiao Province inspector, campaigned against Linyi and conquered the kingdom.',
  ],
  s0450: [
    'In the seventh month of autumn, on xinwei, Regular Attendant of the Scattered Cavalry Du Tan was made Qingzhou Inspector.',
    'On xinwei in the seventh autumn month, scattered cavalry regular attendant Du Tan became Qingzhou inspector.',
  ],
  s0451: [
    'On guimao of the eighth month, the cinnabar-bandits of Jieyang attacked Jian\u2019an commandery and burned the prefectural city and offices.',
    'On guimao of the eighth month, Jieyang\u2019s cinnabar rebels stormed Jian\u2019an, burning the prefectural seat.',
  ],
  s0452: [
    'On jimao of the ninth month, the imperial carriage visited the Imperial Academy, examined the students by question and answer, and fifty-nine in all replied.',
    'On jimao of the ninth month the emperor went to the Imperial Academy, tested the students, and fifty-nine answered satisfactorily.',
  ],
  s0453: [
    'In the tenth month of winter, on wuzi, an edict said: "The schools have stood for many years, and the sons of the nobility have completed their studies."',
    'On wuzi in the tenth winter month an edict declared: "Our academies have stood for years, and the crown students have finished their training."',
  ],
  s0454: [
    'Having recently examined them in person, we behold their splendid array and, gazing toward Zhu and Si, ever cherish the past.',
    'In testing them lately we saw their splendid ranks and, thinking of Zhu and Si, felt anew the age of the sages.',
  ],
  s0455: [
    'The students\u2019 answers for the most part may be adopted and reviewed.',
    'Most of the students\u2019 replies are fit to be read and kept.',
  ],
  s0456: [
    'The instructors in office should all receive rewards."',
    'Their teachers in office are all to receive gifts."',
  ],
  s0457: [
    'Cloth was bestowed in differing amounts.',
    'Silks were granted in graded amounts.',
  ],
  s0458: [
    'On dingyou of the twelfth month, Rapid Cavalry Staff Officer Xiao Jingxian was made Jiao Province Inspector.',
    'On dingyou of the twelfth month, rapid cavalry staff officer Xiao Jingxian was appointed Jiao Province inspector.',
  ],
  s0459: [
    'That year was a great harvest year.',
    'That year brought an abundant harvest.',
  ],
  s0460: [
    'The northern embankment was built, Black Tortoise Lake was established, and Jingyang Hill was constructed in the Hualin Park.',
    'They built the northern dike, opened Black Tortoise Lake, and raised Jingyang Hill in Hualin Park.',
  ],
  s0461: [
    'In the first month of spring of year 24, on jiaxu, a general amnesty was proclaimed for the empire; civil and military officials were granted one rank in status.',
    'On jiaxu in the twenty-fourth year\u2019s first spring month a general amnesty was declared and civil and military officials advanced one rank.',
  ],
  s0462: [
    'Bound prisoners were pardoned by reduction; overdue obligations were leniently reduced in differing degrees.',
    'Prisoners received graded pardons and overdue levies were eased by degree.',
  ],
  s0463: [
    'Orphans, the aged living alone, and those afflicted with the six infirmities who could not support themselves were each granted five hu of grain.',
    'Each orphan, solitary elder, or person disabled by the six infirmities who could not live without aid received five hu of grain.',
  ],
  s0464: [
    'Half this year\u2019s land tax of Jiankang and Moling counties was remitted.',
    'Jiankang and Moling were granted a half remission of this year\u2019s land tax.',
  ],
  s0465: [
    'In the third month, on renshen, General Who Protects the Army Zhao Bofu was transferred to another post.',
    'On renshen of the third month, Zhao Bofu left the post of general who protects the army.',
  ],
  s0466: [
    'In the fifth month of summer, on jiaxu, Qingzhou Inspector Du Tan was given the additional post of Jizhou Inspector.',
    'On jiaxu in the fifth summer month, Du Tan of Qingzhou was also made Jizhou inspector.',
  ],
  s0467: [
    'In the sixth month a pestilence struck the capital; on bingxu, the commanderies, counties, camps, and offices were all ordered to make a general inspection tour and supply medicine.',
    'In the sixth month plague ravaged the capital; on bingxu every commandery, county, camp, and office was ordered to tour its jurisdiction and provide medicine.',
  ],
  s0468: [
    'That month, because goods were dear, large coins were made to count as two.',
    'That month, with prices high, large coins were decreed to pass at double value.',
  ],
  s0469: [
    'In the seventh month of autumn, on yimao, the gold, silver, and treasures taken from Linyi were distributed in graded rewards.',
    'On yimao in the seventh autumn month, booty of gold, silver, and gems from Linyi was handed out in graded gifts.',
  ],
  s0470: [
    'On yiwei of the eighth month, General Who Campaigns in the North and Xuzhou Inspector Prince of Hengyang Yiji died.',
    'On yiwei of the eighth month, Prince of Hengyang Yiji, northern campaigning general and Xuzhou inspector, died.',
  ],
  s0471: [
    'On guimao, Southern Xuzhou Inspector Liu Yibin was made Xuzhou Inspector.',
    'On guimao, Liu Yibin moved from Southern Xuzhou to Xuzhou.',
  ],
  s0472: [
    'On jiwei of the ninth month, General of the Central Household Guards Shen Yanzhi was made General of the Household Guards.',
    'On jiwei of the ninth month, Shen Yanzhi was promoted from central to full household guards general.',
  ],
  s0473: [
    'On xinwei, Crown Prince Household Steward Xu Zhanzhi was made Southern Xuzhou Inspector.',
    'On xinwei, crown prince household steward Xu Zhanzhi became Southern Xuzhou inspector.',
  ],
  s0474: [
    'In the tenth month of winter, on renwu, Hu Danshi of Yuzhang rebelled and killed Prefect Huan Longzhi; former Jiao Province Inspector Tan Hezhi, returning south, reached Yuzhang and there suppressed and pacified the revolt.',
    'On renwu in the tenth winter month, Yuzhang\u2019s Hu Danshi rose in revolt and slew the prefect; Tan Hezhi, former Jiao inspector returning south, crushed the rebellion at Yuzhang.',
  ],
  s0475: [
    'On renchen, Prince of Jianping Hong was made General Who Protects the Army.',
    'On renchen, Prince of Jianping Hong was appointed general who protects the army.',
  ],
  s0476: [
    'In the eleventh month, on jiayin, the tenth imperial son Hun was established as Prince of Ruyin.',
    'On jiayin of the eleventh month, the tenth prince Hun was enfeoffed as Prince of Ruyin.',
  ],
  s0477: [
    'In the first month of spring of year 25, on wuchen, an edict said: "Recently ice and snow lasted many days; firewood and grain rose steeply in price, and poor households were often left in desperate want."',
    'On wuchen in the twenty-fifth year\u2019s first spring month an edict declared: "Snow and ice have lingered for weeks; fuel and grain have soared, and many poor homes are at the edge of ruin."',
  ],
  s0478: [
    'Let the two capital counties and the camps be inspected and supplied with firewood and grain."',
    'Inspect the two metropolitan counties and the military camps and issue firewood and grain."',
  ],
  s0479: [
    'In the second month, on gengyin, an edict said: "In security do not forget peril—this all ages share in common;"',
    'On gengyin in the second month an edict declared: "Peace must not erase vigilance—every age has known this;"',
  ],
  s0480: [
    'to train the army and teach warfare is the constant statute of a state.',
    'drilling troops and teaching battle is the standing law of any realm.',
  ],
  s0481: [
    'Therefore through drilled obedience and clear shame, young and old alike learn restraint.',
    'Only when discipline and shame are clear do young and old learn their bounds.',
  ],
  s0482: [
    'Recently military affairs have been maintained, yet orders are not yet clear.',
    'Military affairs have lately been kept up, but the commands are still vague.',
  ],
  s0483: [
    'Now that the Martial Display Ground is newly completed, on a set day the mass of armies may undergo great drill.',
    'Now that the Martial Display Ground is finished, a day should be fixed for a grand review of all forces.',
  ],
  s0484: [
    'There should be a hunt in connection with the review, to practice arms and discuss affairs."',
    'A hunt is to accompany the review, to exercise arms and rehearse command."',
  ],
  s0485: [
    'In the intercalary month, on jiyou, a great hunt was held at the Martial Display Ground.',
    'On jiyou of the intercalary month a great hunt was held on the Martial Display Ground.',
  ],
  s0486: [
    'In the third month, on gengchen, the imperial carriage conducted a hunt review.',
    'On gengchen of the third month the emperor led a ceremonial hunt.',
  ],
  s0487: [
    'In the fourth month of summer, on yisi, the new Changle and Guangmo gates were built; the former Guangmo gate was renamed Chenming, and Kaiyang was renamed Jinyang.',
    'On yisi in the fourth summer month new Changle and Guangmo gates were built; old Guangmo became Chenming and Kaiyang became Jinyang.',
  ],
  s0488: [
    'On yimao, General Who Pacifies the Army and Yongzhou Inspector Prince of Wuling Jun was made General Who Pacifies the North and Xuzhou Inspector.',
    'On yimao, Prince of Wuling Jun became northern pacifying general and Xuzhou inspector.',
  ],
  s0489: [
    'On guihai, General of the Right Guard Xiao Sihua was made Yongzhou Inspector.',
    'On guihai, right guard general Xiao Sihua was appointed Yongzhou inspector.',
  ],
  s0490: [
    'On jimao of the fifth month, the large coin valued at two was abolished.',
    'On jimao of the fifth month the double-value large coin was withdrawn.',
  ],
  s0491: [
    'On gengxu of the sixth month, Staff Officer to the Prince of Lingling Sima Yuanyu died.',
    'On gengxu, staff officer to the Prince of Lingling Sima Yuanyu died.',
  ],
  s0492: [
    'On gengshen, General Who Pacifies the North and Xuzhou Inspector Prince of Wuling Jun was given the additional post of Yanzhou Inspector.',
    'On gengshen, Prince of Wuling Jun, northern pacifying general and Xuzhou inspector, was also made Yanzhou inspector.',
  ],
  s0493: [
    'On bingyin, General of Chariots and Cavalry and Jingzhou Inspector Prince of Nanqiao Yixuan advanced to Minister of Works.',
    'On bingyin, Prince of Nanqiao Yixuan, general of chariots and cavalry and Jingzhou inspector, was promoted to minister of works.',
  ],
  s0494: [
    'In the seventh month of autumn, on renwu, Left Grand Master of Splendid Happiness Wang Jinghong died.',
    'On renwu in the seventh autumn month, left grand master of splendid happiness Wang Jinghong died.',
  ],
  s0495: [
    'On jiyou of the eighth month, Pacifying-Army Staff Officer Liu Xiuzhi was made Inspector of Liang and Southern Qin provinces.',
    'On jiyou of the eighth month, pacifying-army staff officer Liu Xiuzhi became inspector of Liang and Southern Qin.',
  ],
  s0496: [
    'On jiazi, the eleventh imperial son Yu was established as Prince of Huaiyang.',
    'On jiazi, the eleventh prince Yu was enfeoffed as Prince of Huaiyang.',
  ],
  s0497: [
    'On xinwei of the ninth month, Right Vice Director of the Masters of Writing He Shangzhi was made Left Vice Director of the Masters of Writing; General of the Household Guards Shen Yanzhi was transferred to another post; Wuxing Prefect Liu Zunkao was made General of the Household Guards.',
    'On xinwei of the ninth month, He Shangzhi became left vice director, Shen Yanzhi left the household guards, and Liu Zunkao of Wuxing became household guards general.',
  ],
  s0498: [
    'In the first month of spring of year 26, on xinsi, the imperial carriage personally sacrificed at the southern suburban altar.',
    'On xinsi in the twenty-sixth year\u2019s first spring month the emperor offered sacrifice at the southern suburb in person.',
  ],
  s0499: [
    'On jihai of the second month, the imperial carriage went by land road to Dantu and paid respects at the Jing tombs.',
    'On jihai of the second month the emperor traveled overland to Dantu to worship at the Jing mausoleums.',
  ],
  s0500: [
    'On dingsi of the third month, [34] an edict said: "We have been away from the northern capital for more than twenty years; though it is said to be near, we could not behold the road."',
    'On dingsi of the third month, [34] an edict declared: "For more than twenty years we have been absent from the northern capital; though close at hand on the map, we could not see the road home."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b5.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
