#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'On day jichou, Grand Secretary Li Guangdi died; the fifth imperial son, Prince Heng Yinqi, was ordered to offer libations; one thousand taels of silver were granted; Xu Yuanmeng was ordered back to the capital to oversee the funeral; posthumous title Wenzhen.',
    'On jichou day, Li Guangdi died; Prince Heng Yinqi offered libations; Xu Yuanmeng oversaw the funeral; posthumous name Wenzhen.',
  ],
  s0902: [
    'On day dingwei, four hundred suits of clothing were granted to Hami soldiers.',
    'On dingwei day, Hami troops received four hundred suits of clothing.',
  ],
  s0903: [
    'Summer, seventh month, day jiwei: a lama of Moli outside Dajianlu submitted.',
    'In the seventh month, a Moli lama beyond Dajianlu submitted.',
  ],
  s0904: [
    'On day jiaxu, the ceremonial regulations for provincial inspection were revised.',
    'On jiaxu day, provincial inspection ceremonial regulations were revised.',
  ],
  s0905: [
    'Eighth month, day renzi: Solon suffered flood disaster; officials were sent to relieve it.',
    'In the eighth month, Solon flood victims were relieved by dispatched officials.',
  ],
  s0906: [
    'Meng Guangzu was executed.',
    'Meng Guangzu was put to death.',
  ],
  s0907: [
    'On day wuzi, the Emperor went on the autumn hunt.',
    'On wuzi day, the Emperor went hunting.',
  ],
  s0908: [
    'On day jiawu, Minister of Rites Tunzhu died; sacrificial rites and burial were granted; posthumous title Kemin.',
    'On jiawu day, Minister of Rites Tunzhu died with funeral honors and posthumous name Kemin.',
  ],
  s0909: [
    'Regional commander Qiu Ji, guilty of a crime, was executed.',
    'Regional commander Qiu Ji was executed for his crime.',
  ],
  s0910: [
    'Intercalary eighth month, day wuchen, an edict said: "Barbarian raiders are in revolt; the main army is stationed far on the western frontier; all levies and supplies weigh heavily on the people of Qin.',
    'In the intercalary eighth month, an edict cited frontier war burdens on Shaanxi and Gansu.',
  ],
  s0911: [
    'All land-poll and grain-tax quotas for Shaanxi and Gansu for next year are to be remitted, and overdue levies of past years are to be cleared entirely.',
    'Next year\'s land tax and all arrears in Shaanxi and Gansu were remitted.',
  ],
  s0912: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0913: [
    'Ninth month, day jimao: Commander-in-chief Arna and regional commander Li Yao were ordered to lead troops to garrison Gas Pass and Chaidamu.',
    'In the ninth month, Arna and Li Yao were posted at Gas Pass and Chaidamu.',
  ],
  s0914: [
    'On day bingxu, Wang Xunling was made Grand Secretary; Chen Yuanlong Minister of Works.',
    'On bingxu day, Wang Xunling became Grand Secretary and Chen Yuanlong Minister of Works.',
  ],
  s0915: [
    'On day jiachen, the Emperor returned to Beijing.',
    'On jiachen day, the Emperor returned to Beijing.',
  ],
  s0916: [
    'General Erlunte and guard Seleng joined forces at Karakunusu, repeatedly defeated the enemy; the enemy pressed on; the army had no reinforcements; fighting until arrows were spent and strength exhausted, they died in battle.',
    'Erlunte and Seleng won repeated victories at Karakunusu but, without reinforcements, were killed when the enemy pressed on.',
  ],
  s0917: [
    'Winter, tenth month, day jiayin: executions for this year were suspended.',
    'In the tenth month, executions were halted for the year.',
  ],
  s0918: [
    'On day bingchen, the fourteenth imperial son, Beizi Yinti, was made Pacification-general-in-chief of the Far Reaches to oversee the army in Qinghai.',
    'On bingchen day, the fourteenth son Yinti was made Pacification-general-in-chief for Qinghai.',
  ],
  s0919: [
    'Orders were issued to build shrines and enroll in the sacrifice rolls for Governor-general Gan Wenkui and prefect Huang Tingbai, who died for the state.',
    'Shrines were ordered for Governor-general Gan Wenkui and Prefect Huang Tingbai, who died for the state.',
  ],
  s0920: [
    'On day jiazi, an edict to Sichuan governor Nian Gengyao said that since the war began he had handled affairs with intelligence and perspicacity; he was at once promoted to governor-general.',
    'On jiazi day, Nian Gengyao was praised for wartime efficiency and promoted to governor-general of Sichuan.',
  ],
  s0921: [
    'Hanlin academicians and censorate officials were ordered to attend in rotating shifts.',
    'Hanlin and censorate officials were ordered to attend court in rotation.',
  ],
  s0922: [
    'On day wuchen, the Emperor halted at the hot springs.',
    'On wuchen day, the Emperor stayed at the hot springs.',
  ],
  s0923: [
    'The seventh son Yinyou, tenth son Yin\'e, and twelfth son Yinti were ordered to administer the affairs of the Plain Yellow, Plain White, and Plain Blue banners among Manchu, Mongol, and Han.',
    'Yinyou, Yin\'e, and Yinti were ordered to manage the three Plain banners for Manchu, Mongol, and Han.',
  ],
  s0924: [
    'Eleventh month, day bingzi: the Emperor returned and halted at Shenyang Spring Garden.',
    'In the eleventh month, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0925: [
    'Fujian governor Chen Bin died; he was posthumously made Minister of Rites; posthumous title Qingduan.',
    'Fujian Governor Chen Bin died and received posthumous rank and name Qingduan.',
  ],
  s0926: [
    'Yi Zhaoxiong was made Han Chinese commander-in-chief.',
    'Yi Zhaoxiong became Han commander-in-chief.',
  ],
  s0927: [
    'Twelfth month, day bingchen: the Emperor paid respects at the imperial tombs.',
    'In the twelfth month, the Emperor visited the imperial tombs.',
  ],
  s0928: [
    'On day jiwei, Empress Xiaohuizhang was enshrined in the Imperial Ancestral Temple, her place to the left of Empress Xiaokangzhang; an edict was promulgated throughout the realm.',
    'On jiwei day, Empress Xiaohuizhang entered the Ancestral Temple and the decree was published empire-wide.',
  ],
  s0929: [
    'Miao people of Sadian in Yunnan submitted.',
    'Yunnan Sadian Miao submitted.',
  ],
  s0930: [
    'On day jisi, the Emperor returned to the palace.',
    'On jisi day, the Emperor returned to the palace.',
  ],
  s0931: [
    'This year, disaster land tax for twenty-six prefectures, counties, and garrisons in Jiangnan, Fujian, Gansu, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for twenty-six disaster districts in several provinces.',
  ],
  s0932: [
    'Korea, Ryukyu, and Annam sent tribute.',
    'Korea, Ryukyu, and Annam paid tribute.',
  ],
  s0933: [
    'Fifty-eighth year, spring, first month, day jiaxu, first day of the month: there was a solar eclipse.',
    'In the fifty-eighth year, on the first day of spring, a solar eclipse occurred.',
  ],
  s0934: [
    'An edict said: "A solar eclipse at the three beginnings is a sign clearly displayed on high.',
    'An edict on the eclipse urged moral self-correction.',
  ],
  s0935: [
    'Human affairs should be rectified to heed Heaven\'s warning.',
    'Officials were to reform conduct to heed Heaven\'s warning.',
  ],
  s0936: [
    'Ministers are to report administrative omissions and faults."',
    'Ministers were to report governmental faults."',
  ],
  s0937: [
    '" On day yiwei, the Emperor went to the hot springs.',
    'On yiwei day, the Emperor went to the hot springs.',
  ],
  s0938: [
    'On day gengzi, the Emperor returned and halted at Shenyang Spring Garden.',
    'On gengzi day, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0939: [
    'On day xinchou, an edict ordered that meritorious officials in retirement might have their hereditary offices inherited by sons and younger brothers.',
    'On xinchou day, retired meritorious officials\' hereditary posts could pass to sons or brothers.',
  ],
  s0940: [
    'If there was no heir to inherit, salary was to be paid for life.',
    'Without an heir, salary continued for life.',
  ],
  s0941: [
    'On day renyin, an order was issued to divert four hundred thirty thousand shi of transport grain and retain it in Jiangsu and Anhui against famine.',
    'On renyin day, 430,000 shi of grain transport were held in Jiangsu and Anhui for famine relief.',
  ],
  s0942: [
    'Second month, day jisi: the Emperor made an inspection tour of the capital region.',
    'In the second month, the Emperor toured the capital region.',
  ],
  s0943: [
    'On day jimao, Academician Jiang Tingxi presented the Imperial Carriage Complete Survey Map and it was bestowed on court ministers.',
    'On jimao day, Jiang Tingxi presented the Imperial Carriage Complete Survey Map to the court.',
  ],
  s0944: [
    'On day gengshen, the Emperor returned and halted at Shenyang Spring Garden.',
    'On gengshen day, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0945: [
    'On day xinwei, Commander-in-chief Fala was ordered to pacify Litang and Batang; guard commander Galib was likewise ordered to handle military affairs.',
    'On xinwei day, Fala was sent to pacify Litang and Batang; Galib shared military command.',
  ],
  s0946: [
    'Third month, day yiwei: Vice Minister Se\'ertu was dismissed for delay in transport of provisions; Governor Gashitu was ordered to take over.',
    'In the third month, Se\'ertu was dismissed for supply delays; Gashitu took over transport.',
  ],
  s0947: [
    'Summer, fourth month, day yisi: Pacification-general-in-chief Yinti was ordered to station the army at Xining.',
    'In the fourth month, Yinti was ordered to camp at Xining.',
  ],
  s0948: [
    'On day guichou, the Emperor toured to Rehe.',
    'On guichou day, the Emperor went to Rehe.',
  ],
  s0949: [
    'Fifth month, day wuyin: because wheat had ripened abundantly, the people were ordered to harvest and store in good time.',
    'In the fifth month, the people were urged to harvest the abundant wheat promptly.',
  ],
  s0950: [
    'On day gengchen, Yang Du was made Mongol commander-in-chief.',
    'On gengchen day, Yang Du became Mongol commander-in-chief.',
  ],
  s0951: [
    'Zhejiang chief examiner Suotai sold examination favors; retired academician Chen Xun acted as go-between; Chen Fengdi gained the degree by improper influence—all were sentenced to death, and those who had recommended Suotai as examiner were also punished.',
    'Examiner Suotai, Chen Xun, and Chen Fengdi were executed in the Zhejiang examination bribery case, with punishments for their patrons.',
  ],
  s0952: [
    'Nanyang garrison soldiers seized and insulted prefect Shen Yuan; regional commander Gao Cheng was dismissed from office; guerrilla Wang Hongdao was sentenced to death; the soldiers were executed.',
    'Nanyang troops insulted Prefect Shen Yuan; Gao Cheng was dismissed, Wang Hongdao sentenced to death, and the soldiers executed.',
  ],
  s0953: [
    'Sixth month, day jiachen: imperial clansman Beile Manduhu was made Manchu commander-in-chief.',
    'In the sixth month, Beile Manduhu became Manchu commander-in-chief.',
  ],
  s0954: [
    'On day dingwei, Nian Gengyao, Galib, and Fala in succession memorialized that Vice Commander Yue Zhongqi had won the submission of Litang and Batang.',
    'On dingwei day, Nian Gengyao, Galib, and Fala reported Yue Zhongqi\'s pacification of Litang and Batang.',
  ],
  s0955: [
    'Fala was ordered to advance and station at Batang; Nian Gengyao was to detach troops to support him.',
    'Fala advanced to Batang with troops detached by Nian Gengyao.',
  ],
  s0956: [
    'On day bingyin, Ma Jianbo was made Gansu commander at Guyuan.',
    'On bingyin day, Ma Jianbo became Guyuan commander.',
  ],
  s0957: [
    'Autumn, seventh month, day guiwei: imperial clansman Zongchamu was made Xi\'an general.',
    'In the seventh month, Zongchamu became Xi\'an general.',
  ],
  s0958: [
    'Eighth month, day gengxu: the Emperor went on the autumn hunt.',
    'In the eighth month, the Emperor went hunting.',
  ],
  s0959: [
    'On day gengshen, Pacification-general Furdan memorialized that at two places in Erqitu cities and stations were to be built.',
    'On gengshen day, Furdan reported building cities and stations at Erqitu.',
  ],
  s0960: [
    'Minister Fan Shichong was ordered to go and supervise the work.',
    'Minister Fan Shichong was sent to supervise construction.',
  ],
  s0961: [
    'Ninth month, day yiwei: an instruction said that at Xining there was now a new Khutuktu who was in fact the reincarnation of the Dalai Lama; the great general was ordered to send an officer with troops to Tibet to install him on the throne.',
    'In the ninth month, the court recognized a new Dalai reincarnation at Xining and ordered troops to install him in Tibet.',
  ],
  s0962: [
    'On day wuxu, Prince An Hua Yang died; posthumous title Jie.',
    'On wuxu day, Prince An Hua Yang died; posthumous name Jie.',
  ],
  s0963: [
    'Winter, tenth month, day dingwei: the Emperor returned to Beijing.',
    'In the tenth month, the Emperor returned to Beijing.',
  ],
  s0964: [
    'On day renzi, licentiate Wang Lansheng of the Hall of Cultivating Harmony was ordered to revise the Rhyme Chart.',
    'On renzi day, Wang Lansheng was ordered to revise the Rhyme Chart.',
  ],
  s0965: [
    'On day jiayin, Gansu commander at Guyuan Pan Yulong died; he was posthumously made Junior Guardian of the Heir Apparent; sacrificial rites and burial were granted; posthumous title Xiangyong.',
    'On jiayin day, Pan Yulong died with posthumous honors and name Xiangyong.',
  ],
  s0966: [
    'Eleventh month, day bingzi: Minister of Rites Chen Shen retired from office.',
    'In the eleventh month, Minister of Rites Chen Shen retired.',
  ],
  s0967: [
    'On day gengyin, the quota for successful candidates at the provincial examinations in Jiangxi was increased.',
    'On gengyin day, Jiangxi provincial examination quotas were raised.',
  ],
  s0968: [
    'Twelfth month, day renyin: Cai Shengyuan was made Minister of Rites; Tian Congdian Censor-in-chief of the Left.',
    'In the twelfth month, Cai Shengyuan became Minister of Rites and Tian Congdian Left Censor-in-chief.',
  ],
  s0969: [
    'On day wushen, the coffin of Xi\'an general Erlunte reached the capital; the fifth son Prince Heng Yinqi and twelfth son Beizi Yinti were ordered to meet it and offer libations.',
    'On wushen day, Erlunte\'s coffin reached Beijing; Yinqi and Yinti met it with libations.',
  ],
  s0970: [
    'On day gengshen, an order was issued to divert one hundred thousand shi of Huguang transport grain and retain it in the province against famine.',
    'On gengshen day, 100,000 shi of Huguang grain transport were held in the province for famine relief.',
  ],
  s0971: [
    'On day xinyou, an edict said: "In recent years troops have been raised for the western campaign, ranging far along the frontier; transport and supplies have worn out the people\'s strength.',
    'On xinyou day, an edict cited frontier war burdens along the campaign route.',
  ],
  s0972: [
    'All scheduled silver and grain quotas for next year for the sixty-six prefectures, counties, and garrisons along the frontier are to be remitted.',
    'Next year\'s tax quotas for sixty-six frontier districts were remitted.',
  ],
  s0973: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0974: [
    'This year, disaster land tax for thirteen prefectures and counties in Jiangsu, Anhui, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for thirteen disaster districts in Jiangsu and Anhui.',
  ],
  s0975: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0976: [
    'Fifty-ninth year, spring, first month, day dingyou: Pacification-general-in-chief Yinti was ordered to move the army to Merususu.',
    'In the fifty-ninth year, Yinti was ordered to move his army to Merususu.',
  ],
  s0977: [
    'Imperial clansman Yansin was made Pacification-general for the Rebellion and ordered to lead troops into Tibet; Duke Cewang Norbu was made military aide.',
    'Yansin became Pacification-general for the Rebellion for Tibet; Cewang Norbu was his aide.',
  ],
  s0978: [
    'Xi\'an general Zongchamu was ordered to station at Xining; Prince of the Commandery of Peace Nersu at Gumu.',
    'Zongchamu was posted at Xining; Prince Nersu at Gumu.',
  ],
  s0979: [
    'Second month, day jiachen: the Emperor made an inspection tour of the capital region.',
    'In the second month, the Emperor toured the capital region.',
  ],
  s0980: [
    'On day guichou, Galib was made Pacification-general of the West and ordered to lead Sichuan and Yunnan troops into Tibet and invest the new Khutuktu as the Sixth Dalai Lama.',
    'On guichou day, Galib became Pacification-general of the West to enter Tibet and install the Sixth Dalai Lama.',
  ],
  s0981: [
    'On day xinyou, the Emperor returned and halted at Shenyang Spring Garden.',
    'On xinyou day, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0982: [
    'Third month, day jichou: Yunnan commander Zhang Guzhen was ordered to garrison Lijiang and Zhongdian.',
    'In the third month, Zhang Guzhen was posted at Lijiang and Zhongdian.',
  ],
  s0983: [
    'On day bingshen, Pacification-general Funing\'an was ordered to advance on Urumqi; Minister without Rank Arana to advance on Turfan; Qilide to lead seven thousand men from Buluer; Furdan eight thousand from Bulahan—all to strike Dzungar at the same time.',
    'On bingshen day, Funing\'an, Arana, Qilide, and Furdan were ordered on simultaneous advances against Dzungar.',
  ],
  s0984: [
    'Summer, fourth month, day wushen: the Emperor toured to Rehe.',
    'In the fourth month, the Emperor went to Rehe.',
  ],
  s0985: [
    'Fifth month, day xinsi: because of drought, the court sought memorials and advice.',
    'In the fifth month, drought led the court to invite memorials.',
  ],
  s0986: [
    'On day renwu, rain fell.',
    'On renwu day, it rained.',
  ],
  s0987: [
    'Sixth month, day jihai: Shaanxi suffered famine; stored grain from Henan was transported for relief.',
    'In the sixth month, Henan grain was sent to relieve famine in Shaanxi.',
  ],
  s0988: [
    'On day bingchen, Bao\'an and Huailai suffered earthquake; officials were sent to relieve.',
    'On bingchen day, earthquake relief was sent to Bao\'an and Huailai.',
  ],
  s0989: [
    'Autumn, seventh month, day bingyin, first day of the month: there was a solar eclipse.',
    'On the first of the seventh month, a solar eclipse occurred.',
  ],
  s0990: [
    'On day guiyou, Funing\'an attacked the enemy at Aktas and Yierbuheshao, defeated them, and captured their taiji Cuimupaier.',
    'On guiyou day, Funing\'an defeated the enemy at Aktas and captured taiji Cuimupaier.',
  ],
  s0991: [
    'Arana\'s army reached Qiketamu, met the enemy, routed them, and captured the entire force.',
    'Arana routed the enemy at Qiketamu and took all captive.',
  ],
  s0992: [
    'Pressing the attack, he reduced Pichan City.',
    'He then took Pichan City.',
  ],
  s0993: [
    'When the army reached Turfan, tribal chief Aksuer led the people in welcome and submission.',
    'At Turfan, chief Aksuer submitted with his followers.',
  ],
  s0994: [
    'On day bingxu, Furdan attacked the enemy at Geererge, killed and captured six hundred, seized in battle the zaisang Saikan Beiken, burned their stores, and returned; Beiken was sent to the capital.',
    'On bingxu day, Furdan defeated the enemy at Geererge, captured Beiken, and sent him to Beijing.',
  ],
  s0995: [
    'Qilide defeated the enemy on the Kenggeer River and received the submission of zaisang Sebuteng and more than two thousand others.',
    'Qilide won on the Kenggeer River; over two thousand including Sebuteng submitted.',
  ],
  s0996: [
    'Eighth month, day wuxu: the Emperor went on the autumn hunt.',
    'In the eighth month, the Emperor went hunting.',
  ],
  s0997: [
    'On day gengzi, Ryukyu asked that sons of its attendant ministers be admitted to study in the Imperial Academy; this was granted.',
    'On gengzi day, Ryukyu\'s request to enroll ministerial sons at the Academy was granted.',
  ],
  s0998: [
    'On day guichou, Pacification-general Yansin repeatedly defeated enemy forces on the Boke River.',
    'On guichou day, Yansin repeatedly defeated the enemy on the Boke River.',
  ],
  s0999: [
    'On day dingsi, he again defeated enemy forces at Chuomala; the enemy general Tsering Donrub fled.',
    'On dingsi day, Yansin won again at Chuomala; Tsering Donrub fled.',
  ],
  s1000: [
    'Pacification-general of the West Galib, with Vice Commander Yue Zhongqi, advanced troops from Lali.',
    'Galib and Yue Zhongqi advanced from Lali.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b10.mjs <translation.json>'
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
