#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1501: [
    'On day yiwei, because Ike Zhao League chief Banner Prince Zha Najierdi had suffered successive years of drought on his pastures, ten thousand taels of treasury funds were issued for relief.',
    'On yiwei day, 10,000 taels were sent to relieve drought on the pastures of Zha Najierdi, banner prince of Ike Zhao League.',
  ],
  s1502: [
    'Sixth month, day yimao: all provinces were ordered to select and recommend men skilled in astronomy, medicine, divination, mathematics, and geomancy and send them up to the Imperial Household Department.',
    'In month 6, yimao, provinces were told to send skilled astronomers, physicians, diviners, mathematicians, and geomancers to the Household Department.',
  ],
  s1503: [
    'On day wuwu, thirty thousand taels from the ministry treasury were allocated for relief in Liling and other disaster areas.',
    'On wuwu day, 30,000 taels were set aside for Liling and other flood districts.',
  ],
  s1504: [
    'On day gengshen, the German envoy Shenke was received at Chengguang Hall.',
    'On gengshen day, the German minister Shenke was received at Chengguang Hall.',
  ],
  s1505: [
    'On day guihai, prayers were offered for clear weather.',
    'On guihai day, the court prayed for fair weather.',
  ],
  s1506: [
    'On day dingmao, bandit chiefs Liu Yanfei and others of Pu\'an were executed.',
    'On dingmao day, Liu Yanfei and other Pu\'an bandit leaders were executed.',
  ],
  s1507: [
    'On day guiyou, because of rain disasters in the capital, an edict ordered porridge kitchens set up at six points outside the six gates, with ten thousand shi of capital granary rice for relief.',
    'On guiyou day, rain disasters in Beijing brought porridge kitchens outside six gates and 10,000 shi of capital grain.',
  ],
  s1508: [
    'On day yihai, Fengtian grain and north-south tribute grain were again allocated for relief needs in Zhili.',
    'On yihai day, more Fengtian and tribute grain was reserved for Zhili relief.',
  ],
  s1509: [
    'The Yongding River breached; floods on both north and south reaches overflowed together.',
    'The Yongding River broke, flooding both upper and lower courses.',
  ],
  s1510: [
    'On day bingzi, Anhui\'s accumulated tax arrears and prior summer grain debts of Qianshan and other counties and garrisons were remitted.',
    'On bingzi day, Anhui\'s arrears and Qianshan\'s old summer taxes were forgiven.',
  ],
  s1511: [
    'Autumn, seventh month, day jiashen: Shuntian prefecture was ordered to sell grain at fair prices.',
    'In month 7, jiashen, Shuntian was told to sell grain at fair prices.',
  ],
  s1512: [
    'On day jiachen, as flooding in the capital region gradually receded, the court ordered impoverished refugees who had gone elsewhere for food to return to their native registers.',
    'On jiachen day, as capital-area floods receded, destitute refugees were told to return home.',
  ],
  s1513: [
    'Eighth month, day xinhai: the late governor-general Zeng Guoquan\'s grandson Guanghan was granted a fourth- or fifth-rank capital office.',
    'In month 8, xinhai, Zeng Guoquan\'s grandson Guanghan was given a fourth- or fifth-rank capital post.',
  ],
  s1514: [
    'The overseas Chinese maritime ban was lifted; from now on merchants and people abroad, whether long absent or brief, were broadly permitted to return to settle businesses at home; going abroad to trade was also allowed.',
    'The overseas-Chinese ban was lifted so merchants abroad, old or new settlers, could return home or trade overseas freely.',
  ],
  s1515: [
    'On day dingmao, miscellaneous grain was purchased in Fengtian, Henan, and Shandong provinces for Zhili relief.',
    'On dingmao day, grain was bought in Fengtian, Henan, and Shandong for Zhili relief.',
  ],
  s1516: [
    'Ninth month, day guiwei: Shandong retained sixty thousand shi of new tribute grain to relieve disaster victims in river-border prefectures and counties.',
    'In month 9, guiwei, Shandong kept 60,000 shi of new tribute grain for counties along the river.',
  ],
  s1517: [
    'Another hundred thousand shi of north-south tribute grain was again diverted to cash redemption; eighty thousand shi of Jiangsu tribute grain was again retained for Zhili relief, half of which was distributed.',
    'Another 100,000 shi of tribute grain was cashed out and 80,000 shi of Jiangsu grain was kept for Zhili, half of it issued.',
  ],
  s1518: [
    'On day guimao, thirty thousand shi of capital granary rice was issued to relieve Shuntian.',
    'On guimao day, 30,000 shi of capital grain went to Shuntian relief.',
  ],
  s1519: [
    'That month, Shaanxi\'s accumulated taxes and quota taxes in all subordinate districts were remitted.',
    'That month all Shaanxi arrears and quota taxes were forgiven.',
  ],
  s1520: [
    'Winter, tenth month, new moon on day jiyou: the sea dikes of the four prefectures and counties of Taicang were repaired.',
    'In month 10, jiyou new moon, Taicang\'s four coastal counties repaired sea walls.',
  ],
  s1521: [
    'On day renzi, Sichuan provincial treasurer Gong Zhaoyuan was granted third-rank capital office rank and appointed minister plenipotentiary to Britain, France, Italy, and Belgium.',
    'On renzi day, Sichuan treasurer Gong Zhaoyuan became envoy to Britain, France, Italy, and Belgium.',
  ],
  s1522: [
    'On day jiwei, the Ministry of Revenue was ordered to pay five hundred thousand taels annually into the Imperial Household Department.',
    'On jiwei day, Revenue was ordered to pay 500,000 taels yearly to the Household Department.',
  ],
  s1523: [
    'On day yichou, grain taxes of Tongzhou and other places were remitted.',
    'On yichou day, Tongzhou and other districts were forgiven grain taxes.',
  ],
  s1524: [
    'Eleventh month, day jichou: the private-coin ban was reiterated; anyone melting, recasting, or transporting them would be strictly pursued by the authorities.',
    'In month 11, jichou, the private-coin ban was renewed with strict penalties for melting, recasting, or transport.',
  ],
  s1525: [
    'On day wuzi, Gansu and Xinjiang were shaken by earthquake.',
    'On wuzi day, Gansu and Xinjiang suffered an earthquake.',
  ],
  s1526: [
    'On day xinmao, Xu Zhenyi was ordered to join Li Hongzhang in surveying the Yongding River.',
    'On xinmao day, Xu Zhenyi was sent to survey the Yongding River with Li Hongzhang.',
  ],
  s1527: [
    'On day jiawu, autumn taxes of Daxing and other counties were remitted.',
    'On jiawu day, autumn taxes in Daxing and other counties were forgiven.',
  ],
  s1528: [
    'Twelfth month, day xinhai: Ministry Vice Minister Xu Yongyi was ordered to study and serve under the Grand Council ministers.',
    'In month 12, xinhai, Vice Minister Xu Yongyi joined the Grand Council as a student attendant.',
  ],
  s1529: [
    'On day renzi, an edict ordered strict evaluation in the capital inspection of officials.',
    'On renzi day, the capital official inspection was ordered strict.',
  ],
  s1530: [
    'On day wuwu, the ban on inland people going to sea was lifted.',
    'On wuwu day, the ban on inland people sailing abroad was lifted.',
  ],
  s1531: [
    'On day xinyou, Anren plague disaster was relieved.',
    'On xinyou day, Anren\'s plague victims received relief.',
  ],
  s1532: [
    'On day renxu, rents and taxes of seven banners including Guihua were remitted.',
    'On renxu day, seven banners including Guihua were forgiven rents.',
  ],
  s1533: [
    'On day dingmao, the Wula tribute of eastern pearls was remitted.',
    'On dingmao day, Wula\'s eastern-pearl tribute was canceled.',
  ],
  s1534: [
    'On day renshen, fifty thousand shi of Jingdong granary rice was allocated for spring relief in Shuntian.',
    'On renshen day, 50,000 shi of Jingdong grain was set aside for Shuntian spring relief.',
  ],
  s1535: [
    'On day guiyou, the Ministry of Justice memorialized that dismissed official Zhou Fuqing, who had sent letters to influence examiners on the road, was originally sentenced to beating and exile but was changed to suspended decapitation pending review.',
    'On guiyou day, Zhou Fuqing\'s bribery of examiners on the road, first punished by beating and exile, was changed to suspended execution.',
  ],
  s1536: [
    'Twentieth year, jiawu, spring, first month, new moon on day jimao: by empress-dowager rescript, for the sixtieth birthday celebration, consorts were advanced in rank, Prince Gong\'s guard was increased, Yikuang was promoted to prince, Prince Chun Zai Feng and others received differentiated rewards.',
    'Year 20, spring 1, jimao new moon: for the empress dowager\'s sixtieth birthday, consorts were promoted, Yikuang made a prince, and Zai Feng and others were rewarded.',
  ],
  s1537: [
    'From foreign and domestic ministers, civil and military grandees, Mongol princes and nobles down through the ranks, grace gifts were bestowed in sequence.',
    'Ministers, officials, and Mongol nobles down the ranks received graded gifts.',
  ],
  s1538: [
    'On day bingshen, Xu Zhenyi surveyed Yongding River works and was ordered to plan jointly with Li Hongzhang.',
    'On bingshen day, Xu Zhenyi\'s Yongding survey was referred to joint planning with Li Hongzhang.',
  ],
  s1539: [
    'An annual increase of forty thousand taels for repairs was approved, and three hundred thousand taels of ministry funds were allocated as operating expenses.',
    'Yearly repairs rose by 40,000 taels and 300,000 taels were granted for the works.',
  ],
  s1540: [
    'On day jihai, Kucha was shaken by earthquake.',
    'On jihai day, Kucha suffered an earthquake.',
  ],
  s1541: [
    'Arrears of taxes in districts of Kashgar and Yarkand were remitted.',
    'Kashgar and Yarkand arrears were forgiven.',
  ],
  s1542: [
    'On day gengzi, examination-hall prohibitions were reiterated.',
    'On gengzi day, civil-service exam rules were reiterated.',
  ],
  s1543: [
    'On day xinchou, the Oroqen sable tribute was remitted.',
    'On xinchou day, Oroqen sable tribute was canceled.',
  ],
  s1544: [
    'On day renyin, the renewed Yunnan-Burma treaty was concluded.',
    'On renyin day, the renewed Yunnan-Burma treaty was signed.',
  ],
  s1545: [
    'Second month, day xinhai: an edict ordered palace examination grading ministers to be impartial in selection and not lax.',
    'In month 2, xinhai, examiners were warned to grade fairly and avoid lax standards.',
  ],
  s1546: [
    'The Tonghui Canal was dredged and sluices and dams built.',
    'The Tonghui Canal was dredged and fitted with sluice-gates.',
  ],
  s1547: [
    'On day jiazi, Li Hongzhang was ordered to inspect the navy.',
    'On jiazi day, Li Hongzhang was sent to inspect the navy.',
  ],
  s1548: [
    'On day jiaxu, prefectures and counties were forbidden to levy taxes untimely in advance or to abuse non-statutory punishments.',
    'On jiaxu day, counties were banned from advance levies and illegal torture.',
  ],
  s1549: [
    'Xu Zhenyi\'s request was approved: a river-defense bureau was set up at Lugou Bridge; following Qiu Yuexiu\'s established method, one hundred twenty dredging boats were provided.',
    'Xu Zhenyi won a Lugou Bridge river bureau with 120 dredgers on Qiu Yuexiu\'s model.',
  ],
  s1550: [
    'Third month, new moon on day wuyin: there was an eclipse of the sun.',
    'In month 3, wuyin new moon, a solar eclipse occurred.',
  ],
  s1551: [
    'Frontier governors were instructed not to recommend subordinates indiscriminately.',
    'Frontier governors were told not to over-recommend subordinates.',
  ],
  s1552: [
    'On day wuzi, an edict ordered suspension of autumn executions.',
    'On wuzi day, autumn executions were suspended.',
  ],
  s1553: [
    'That spring, Xinjiang\'s accumulated taxes and Yunnan\'s quota taxes and miscellaneous levies in all subordinate districts were remitted.',
    'That spring, Xinjiang arrears and Yunnan quotas were forgiven.',
  ],
  s1554: [
    'Summer, fourth month, day wushen: bandit disorder at Shaozhou Nanxiong was suppressed and pacified.',
    'In month 4, wushen, Nanxiong bandits in Shaozhou were pacified.',
  ],
  s1555: [
    'On day jiyou, bandit chief Chen Beihai of Xupu was executed.',
    'On jiyou day, Xupu bandit Chen Beihai was executed.',
  ],
  s1556: [
    'On day jiayin, a major examination of Hanlin and Academicians was held; Wen Tingshi and five others were placed first class, the rest promoted or demoted with differences.',
    'On jiayin day, Hanlin was examined and Wen Tingshi with five others topped the list.',
  ],
  s1557: [
    'On day xinyou, the Italian envoys Baldi and others were received at Chengguang Hall.',
    'On xinyou day, Italian envoys including Baldi were received at Chengguang Hall.',
  ],
  s1558: [
    'On day xinwei, Zhang Jian and three hundred eleven others were granted jinshi and advanced degrees with differences.',
    'On xinwei day, Zhang Jian and 311 others received jinshi degrees.',
  ],
  s1559: [
    'On day renshen, the provinces were instructed to clear accumulated Beijing appeal cases.',
    'On renshen day, provinces were told to clear Beijing appeal backlogs.',
  ],
  s1560: [
    'Fifth month, day dinghai: because of many bandits in the capital region, strict capture was ordered.',
    'In month 5, dinghai, the capital region was told to hunt bandits strictly.',
  ],
  s1561: [
    'On day wuzi, an edict provided that ministers stationed in Tibet and assistant ministers, after three years, might request an audience on completion of term; this was made a standing rule.',
    'On wuzi day, Tibet ministers could request audience after three years as a standing rule.',
  ],
  s1562: [
    'On day dingyou, at first, because Korea sought troops against bandit disorder, Li Hongzhang ordered Brigade Commander Ye Zhichao and Brigadier Nie Shicheng to lead troops there.',
    'On dingyou day, Korea\'s call for help against bandits sent Ye Zhichao and Nie Shicheng under Li Hongzhang.',
  ],
  s1563: [
    'The Emperor feared the force was insufficient and therefore instructed that border pacification among the subject peoples should aim at complete security; additional troops still needed to be sent in reinforcement for certain victory.',
    'Worried the force was too small, the court told frontier commanders to send more troops for a sure victory.',
  ],
  s1564: [
    'On day renyin, Jiangsu transport grain lost by shipwreck on the sea route was remitted and exempted.',
    'On renyin day, Jiangsu\'s sea-transport losses were forgiven.',
  ],
  s1565: [
    'On day yisi, Liu Mingchuan was summoned to the capital.',
    'On yisi day, Liu Mingchuan was recalled to Beijing.',
  ],
  s1566: [
    'The Oroqen commander post was abolished; the Buteha commander was promoted to vice commander-in-chief.',
    'The Oroqen commander was abolished and Buteha\'s commander made vice commander-in-chief.',
  ],
  s1567: [
    'Sixth month, day jiyou: an edict suspended donations for circuit and prefecture posts.',
    'In month 6, jiyou, purchased circuit and prefect posts were suspended.',
  ],
  s1568: [
    'On day guichou, because of continuous rain in the capital, prayers were offered for clear weather.',
    'On guichou day, Beijing rain brought prayers for clear skies.',
  ],
  s1569: [
    'On day yimao, the Japanese envoy Komura Jutaro was received at Chengguang Hall.',
    'On yimao day, Japan\'s Komura Jutaro was received at Chengguang Hall.',
  ],
  s1570: [
    'On day wuwu, Weng Tonghe and Li Hongzao were ordered to confer with the Grand Council and the Zongli Yamen on Korean affairs.',
    'On wuwu day, Weng Tonghe and Li Hongzao met the Grand Council and Zongli Yamen on Korea.',
  ],
  s1571: [
    'On day renxu, naval "contributions" (purchase of office) were suspended.',
    'On renxu day, navy contribution sales were halted.',
  ],
  s1572: [
    'On day yichou, an instruction stated: "Hunan tribute grain on the Jing route is to be redeemed for cash to supply Zhili relief.',
    'On yichou day, the court said Hunan Jing-route tribute grain would be cashed for Zhili relief.',
  ],
  s1573: [
    'Former famine relief funds are also to be reported and deposited in storage.',
    'Old famine funds were also to be remitted to storage.',
  ],
  s1574: [
    '" All begin this year and are to be regular hereafter.',
    'These rules began this year as permanent measures.',
  ],
  s1575: [
    'On day dingmao, Brigadier Liu Yongfu of Nan\'ao was ordered to Taiwan.',
    'On dingmao day, Nan\'ao\'s Liu Yongfu was sent to Taiwan.',
  ],
  s1576: [
    'On day wuchen, Liu Jintang was summoned to the capital.',
    'On wuchen day, Liu Jintang was recalled to Beijing.',
  ],
  s1577: [
    'On day xinwei, for the first ten-day birthday celebration, the Emperor held court to receive congratulations and banqueted.',
    'On xinwei day, the early birthday celebrations opened with court congratulations and a feast.',
  ],
  s1578: [
    'Xu Yongyi was appointed Grand Council minister.',
    'Xu Yongyi joined the Grand Council.',
  ],
  s1579: [
    'On day renshen, recalled from Japan the dismissed envoy Wang Fengzao.',
    'On renshen day, envoy Wang Fengzao was recalled from Japan.',
  ],
  s1580: [
    'Autumn, seventh month, new moon on day yihai: Japan invaded Korea; an edict declared war.',
    'In month 7, yihai new moon, Japan invaded Korea and war was declared.',
  ],
  s1581: [
    'On day wuyin, Li Hanzhang was ordered to destroy the books written by Nanhai juren Kang Zuyi.',
    'On wuyin day, Li Hanzhang was told to burn Kang Zuyi\'s books.',
  ],
  s1582: [
    'On day jimao, Yuan Shikai was dispatched as circuit intendant to pacify and console at Pyongyang.',
    'On jimao day, Yuan Shikai was sent to Pyongyang to restore order.',
  ],
  s1583: [
    'On day bingchen, Taiwan provincial treasurer Tang Jingsong and Nan\'ao Brigadier Liu Yongfu were ordered to assist Shao Youlian in defense preparations.',
    'On bingchen day, Tang Jingsong and Liu Yongfu helped Shao Youlian prepare Taiwan\'s defense.',
  ],
  s1584: [
    'On day xinsi, Li Hongzhang was instructed to expand the navy, carefully select commanders, thoroughly train forces, and report after comprehensive planning.',
    'On xinsi day, Li Hongzhang was told to expand the navy, pick commanders, and train thoroughly.',
  ],
  s1585: [
    'On day yiyou, land rents of Binchuan and other prefectures and counties were remitted.',
    'On yiyou day, Binchuan and nearby districts were forgiven land rent.',
  ],
  s1586: [
    'On day bingxu, Shenji Camp troops were ordered to guard the capital approaches, stationed at Tongzhou, soon moved to Nan Yuan.',
    'On bingxu day, Shenji Camp troops guarded the approaches at Tongzhou, then Nan Yuan.',
  ],
  s1587: [
    'On day wuzi, Prince Duan Zai Yi and Jing Xin were ordered to drill banner troops, drawing from Manchu Firearms Camp, Jianrui Camp, Yuanmingyuan Eight-Banner Musket Camp, and Hanjun musket companies.',
    'On wuzi day, Zai Yi and Jing Xin drilled banner troops from firearms and musket camps.',
  ],
  s1588: [
    'Zai Yi soon took charge of the Shenji Camp.',
    'Zai Yi soon headed the Shenji Camp.',
  ],
  s1589: [
    'Non-urgent construction projects were ordered suspended.',
    'Nonessential building was halted.',
  ],
  s1590: [
    'Wu Dacheng\'s request was approved; he took command of Hunan troops to Korea to supervise operations.',
    'Wu Dacheng was approved to lead Hunan troops to supervise the war in Korea.',
  ],
  s1591: [
    'On day dingyou, Huitong and Huile counties\' disasters were relieved.',
    'On dingyou day, Huitong and Huile received disaster relief.',
  ],
  s1592: [
    'On day jihai, Ye Zhichao was appointed commander-in-chief of all forces at Pyongyang.',
    'On jihai day, Ye Zhichao commanded all Pyongyang forces.',
  ],
  s1593: [
    'Jing Xin and Wang Mingluan both served in the Zongli Yamen for Foreign Affairs.',
    'Jing Xin and Wang Mingluan joined the Zongli Yamen.',
  ],
  s1594: [
    'On day guimao, the Sino-foreign treaty on protection of Chinese laborers was revised.',
    'On guimao day, the treaty protecting Chinese workers abroad was revised.',
  ],
  s1595: [
    'Eighth month, day bingwu: Wu Dacheng led troops out through the pass; he himself requested to assist the navy but was not permitted.',
    'In month 8, bingwu, Wu Dacheng marched through the pass; his request to help the navy was denied.',
  ],
  s1596: [
    'On day dingwei, the libation sacrifice to the Master was performed.',
    'On dingwei day, the Confucian libation to the Master was held.',
  ],
  s1597: [
    'On day jiyou, Liu Jintang died.',
    'On jiyou day, Liu Jintang died.',
  ],
  s1598: [
    'On day wuwu, the empress dowager\'s honorific title was conferred; an edict of universal grace was issued with differences.',
    'On wuwu day, the empress dowager received a new title and grace was proclaimed.',
  ],
  s1599: [
    'On day renxu, because the army had long been without success, Li Hongzhang was deprived of the three-eyed peacock feather and yellow jacket.',
    'On renxu day, Li Hongzhang lost his peacock feather and yellow jacket for prolonged military failure.',
  ],
  s1600: [
    'On day bingyin, by empress-dowager rescript, three million taels from the inner treasury were issued for military supplies.',
    'On bingyin day, three million inner-treasury taels were issued for the army.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b16.mjs <translation.json>'
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
