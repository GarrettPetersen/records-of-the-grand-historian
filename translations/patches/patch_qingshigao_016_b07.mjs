#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day yisi, the Emperor took the throne in the Chongzheng Hall to receive congratulatory rites.',
    'On yisi day, the Emperor received congratulations in Chongzheng Hall.',
  ],
  s0602: [
    'Imperial presence minister and third-rank duke E\'le Dengbao died; a shrine was built in the capital.',
    'E\'le Dengbao died; a capital shrine was erected.',
  ],
  s0603: [
    'Qingcheng was appointed Chengdu general.',
    'Qingcheng became Chengdu general.',
  ],
  s0604: [
    'On day bingwu, the Emperor presided at the Dazheng Hall and granted a feast to accompanying princes and ministers and Korean attending envoys.',
    'On bingwu day, at Dazheng Hall the Emperor feasted the entourage and Korean envoys.',
  ],
  s0605: [
    'The Emperor composed eight stanzas of "Ode to Shengjing."',
    'The Emperor composed eight stanzas praising Shengjing.',
  ],
  s0606: [
    'An imperial inscribed plaque was bestowed on Korean king Li Song.',
    'Li Song of Korea received an imperial inscribed plaque.',
  ],
  s0607: [
    'On day wushen, the imperial procession returned.',
    'On wushen day, the Emperor began the return journey.',
  ],
  s0608: [
    'Ninth month, day jisi: the Emperor visited the Eastern Tombs.',
    'In the ninth month, on jisi day, the Emperor visited the Eastern Tombs.',
  ],
  s0609: [
    'On day renshen, he returned to the capital.',
    'On renshen day, the Emperor returned to Beijing.',
  ],
  s0610: [
    'On day bingzi, he personally offered mourning for E\'le Dengbao.',
    'On bingzi day, the Emperor mourned E\'le Dengbao.',
  ],
  s0611: [
    'Winter, tenth month, day jiawu: Dai Junyuan was ordered to hurry to the Southern Canal to inspect the works.',
    'In the tenth winter month, on jiawu day, Dai Junyuan was sent to inspect Southern Canal works.',
  ],
  s0612: [
    'On day bingshen, the king of England presented tribute; an imperial rescript and patterned silks were granted.',
    'On bingshen day, England sent tribute and received a rescript and silks.',
  ],
  s0613: [
    'On day xinchou, Nayancheng was dismissed; Wu Xiongguang was transferred to be governor-general of the Two Guang, and Qiu Xingjian was ordered to act as Zhili governor-general.',
    'On xinchou day, Nayancheng was dismissed; Wu Xiongguang took the Two Guang and Qiu Xingjian acted at Zhili.',
  ],
  s0614: [
    'On day guimao, Saichong\'a was appointed Guangzhou general.',
    'On guimao day, Saichong\'a became Guangzhou general.',
  ],
  s0615: [
    'Eleventh month, day bingchen: Bailing was dismissed; Quanbao was made Huguang governor-general.',
    'In the eleventh month, on bingchen day, Bailing was dismissed and Quanbao took Huguang.',
  ],
  s0616: [
    'On day jiwei, Qingpu was made Hubei provincial commander.',
    'On jiwei day, Qingpu became Hubei provincial commander.',
  ],
  s0617: [
    'Twelfth month, day dingwei: the seasonal offering was made at the Imperial Ancestral Temple.',
    'In the twelfth month, on dingwei day, the seasonal temple offering was performed.',
  ],
  s0618: [
    'That year, disaster taxes in thirty-four districts of Zhili, Shanxi, Shaanxi, and other provinces were remitted by varying amounts, as were quota levies at eleven Lianghuai salt fields.',
    'That year, disaster taxes in thirty-four districts and eleven Lianghuai salt quotas were remitted by degree.',
  ],
  s0619: [
    'The empire\'s population was reckoned at 332,181,403 persons; stored grain totaled 29,411,999 shi 7 sheng 3 ge 2 shao.',
    'The empire counted 332,181,403 people and 29,411,999 shi of grain.',
  ],
  s0620: [
    'Korea and England presented tribute.',
    'Tribute came from Korea and England.',
  ],
  s0621: [
    'Eleventh year, spring, first month, day renzi: pirate Cai Qian took Fengshan county; Yude was ordered to suppress him, and Guangzhou general Saichong\'a was transferred to hurry there and supervise.',
    'In year 11, on first-month renzi, Cai Qian took Fengshan; Yude was sent against him and Saichong\'a hurried to supervise.',
  ],
  s0622: [
    'On day bingzi, Nayancheng was stripped of office for staging plays in his yamen and indiscriminately taking in pirates, and was banished to Ili.',
    'On bingzi day, Nayancheng was dismissed for theater in office and sheltering pirates and was exiled to Ili.',
  ],
  s0623: [
    'Second month, day guiwei: the Emperor attended the Classics Lecture.',
    'In the second month, on guiwei day, the Emperor lectured on the classics.',
  ],
  s0624: [
    'On day xinmao, the Emperor visited the Eastern Tombs.',
    'On xinmao day, the Emperor visited the Eastern Tombs.',
  ],
  s0625: [
    'On day jiachen, the Emperor went to the Southern Park for the enclosure hunt.',
    'On jiachen day, the Emperor hunted at the Southern Park.',
  ],
  s0626: [
    'On day wushen, he returned to the capital.',
    'On wushen day, the Emperor returned to Beijing.',
  ],
  s0627: [
    'Third month, day jichou: Taiwan brigade commander Aixintai recovered Fengshan county and was granted a hereditary office.',
    'In the third month, on jichou day, Aixintai recovered Fengshan and received a hereditary post.',
  ],
  s0628: [
    'Summer, fourth month, day xinmao: the Emperor reviewed troops of the Vanguard Camp.',
    'In the fourth summer month, on xinmao day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0629: [
    'On day guisi, Li Hengte was dismissed; Wu Jing was made canal governor of the Eastern He.',
    'On guisi day, Li Hengte was dismissed and Wu Jing took the Eastern He canal command.',
  ],
  s0630: [
    'On day bingshen, compilation of the Imperial Qing Literary Collection was continued.',
    'On bingshen day, the Imperial Qing Literary Collection was continued.',
  ],
  s0631: [
    'Fifth month, day bingyin: Yude was dismissed; Alinbao was made Fujian-Zhejiang governor-general.',
    'In the fifth month, on bingyin day, Yude was dismissed and Alinbao took Fujian-Zhejiang.',
  ],
  s0632: [
    'Sixth month, day wuyin: Jiang Sheng was transferred to be Minister of Works and Qin Cheng\'en Minister of Punishments.',
    'In the sixth month, on wuyin day, Jiang Sheng took works and Qin Cheng\'en punishments.',
  ],
  s0633: [
    'On day gengchen, Qingcheng was stripped of office for false statements in audience and banished to Heilongjiang.',
    'On gengchen day, Qingcheng was dismissed for false audience statements and exiled to Heilongjiang.',
  ],
  s0634: [
    'Teqing\'e was appointed Chengdu general.',
    'Teqing\'e became Chengdu general.',
  ],
  s0635: [
    'On day gengyin, Dai Junyuan was made canal governor of Jiangnan and Xu Duan vice canal director.',
    'On gengyin day, Dai Junyuan took Jiangnan canals and Xu Duan became vice director.',
  ],
  s0636: [
    'On day gengzi, Delengtai was ordered to administer the Ministry of War.',
    'On gengzi day, Delengtai was ordered to run the war ministry.',
  ],
  s0637: [
    'Autumn, seventh month, day guihai: new troops of Ningshan garrison under Chen Fengshun joined factions, killed officials, took Yang county, and disturbed Ningqiang.',
    'In the seventh autumn month, on guihai day, Ningshan new troops under Chen Fengshun killed officials and seized Yang county.',
  ],
  s0638: [
    'Delengtai was ordered to lead Baturu bodyguards and Solon troops to suppress them.',
    'Delengtai was sent with Baturu guards and Solon troops to suppress them.',
  ],
  s0639: [
    'On day dingmao, the Emperor toured Mulan.',
    'On dingmao day, the Emperor toured Mulan.',
  ],
  s0640: [
    'Eighth month, day gengyin: the Emperor conducted the enclosure hunt.',
    'In the eighth month, on gengyin day, the Emperor hunted in the enclosure.',
  ],
  s0641: [
    'On day jiachen, Li Changgeng memorialized that many of Cai Qian\'s band had been killed or captured; Cai Qian escaped.',
    'On jiachen day, Li Changgeng reported many of Cai Qian\'s followers killed; Cai Qian escaped.',
  ],
  s0642: [
    'Ninth month, day yisi: Baturu bodyguards, Solon, and other troops were dispatched to Shaanxi.',
    'In the ninth month, on yisi day, Baturu guards and Solon troops were sent to Shaanxi.',
  ],
  s0643: [
    'On day guichou, in the Zhili case of failure to detect treasury embezzlement, Yan Jian was banished to Urumqi and Jiang Sheng, Chen Dawen, and Xiong Mei were reduced to fourth-rank capital officials.',
    'On guichou day, Yan Jian was exiled to Urumqi and Jiang Sheng, Chen Dawen, and Xiong Mei were demoted in the Zhili treasury case.',
  ],
  s0644: [
    'At the outset Peng Ling was made Anhui governor.',
    'Peng Ling was first made Anhui governor.',
  ],
  s0645: [
    'On day gengshen, Liu Quanzhi was recalled as Left Censor-in-chief.',
    'On gengshen day, Liu Quanzhi was recalled as left censor-in-chief.',
  ],
  s0646: [
    'On day guihai, the Emperor returned to the capital.',
    'On guihai day, the Emperor returned to Beijing.',
  ],
  s0647: [
    'Winter, tenth month, day dingchou: Delengtai memorialized that the rebel troops at Yang county had been pacified.',
    'In the tenth winter month, on dingchou day, Delengtai reported Yang county rebels pacified.',
  ],
  s0648: [
    'On day jiashen, Quanbao was made Shaanxi-Gansu governor-general, Wang Zhiyi Huguang governor-general, and Cao Zhenyong Minister of Works.',
    'On jiashen day, Quanbao took Shaanxi-Gansu, Wang Zhiyi Huguang, and Cao Zhenyong works.',
  ],
  s0649: [
    'On day dinghai, Wen Chenghui was made Zhili governor-general.',
    'On dinghai day, Wen Chenghui became Zhili governor-general.',
  ],
  s0650: [
    'Ruan Yuan was recalled to act as Fujian governor but declined on grounds of illness.',
    'Ruan Yuan was recalled to act at Fujian but declined for illness.',
  ],
  s0651: [
    'Zhang Shicheng was transferred to be Fujian governor and Jin Guangti Jiangxi governor.',
    'Zhang Shicheng took Fujian and Jin Guangti Jiangxi.',
  ],
  s0652: [
    'On day guisi, Hening was made Urumqi commandant.',
    'On guisi day, Hening became Urumqi commandant.',
  ],
  s0653: [
    'Grand Secretary Baoning petitioned to retire; an excellent edict granted honorable retirement with public stipend.',
    'Baoning retired on an excellent edict with public stipend.',
  ],
  s0654: [
    'Eleventh month, day gengshen: Lukang was made Grand Secretary, Changlin assisting Grand Secretary, and Wenning Metropolitan Commander.',
    'In the eleventh month, on gengshen day, Lukang joined the Grand Secretariat, Changlin assisted, and Wenning took the metropolitan command.',
  ],
  s0655: [
    'An edict sharply rebuked Delengtai for too leniently accepting surrenders while suppressing rebels; Yang Yuchun was reduced to Ningshan brigade commander, Yang Fang was banished to Ili, and surrendered troops were immediately escorted to exile.',
    'An edict rebuked Delengtai for lenient surrenders, demoted Yang Yuchun, exiled Yang Fang, and sent surrendered troops to Ili.',
  ],
  s0656: [
    'Twelfth month, day wuyin: Grand Secretary Zhu Gui died.',
    'In the twelfth month, on wuyin day, Zhu Gui died.',
  ],
  s0657: [
    'On day jimao, the Emperor visited his residence to offer mourning gifts.',
    'On jimao day, the Emperor mourned at Zhu Gui\'s residence.',
  ],
  s0658: [
    'On day gengchen, a special edict urged banner people to practice thrift.',
    'On gengchen day, a special edict urged banner thrift.',
  ],
  s0659: [
    'On day xinchou, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On xinchou day, the seasonal temple offering was performed.',
  ],
  s0660: [
    'That year, disaster taxes in thirty-five departments, prefectures, and counties of Zhili, Sichuan, and other provinces were remitted by varying amounts.',
    'That year, disaster taxes in thirty-five districts of Zhili, Sichuan, and elsewhere were remitted by degree.',
  ],
  s0661: [
    'Korea and Ryukyu presented tribute.',
    'Tribute came from Korea and Ryukyu.',
  ],
  s0662: [
    'Twelfth year, spring, first month, day bingwu: Fei Chun was made Grand Secretary and Dai Quheng assisting Grand Secretary.',
    'In year 12, on first-month bingwu, Fei Chun joined the Grand Secretariat and Dai Quheng assisted.',
  ],
  s0663: [
    'On day guihai, an edict said: "When suppressing heterodox bandits in the past, militia were too numerous.',
    'On guihai day, an edict said past militia against heterodox bandits had been too numerous.',
  ],
  s0664: [
    'When affairs were settled, dispersing them was difficult, and many were enrolled as soldiers.',
    'After pacification, dispersing them was hard and many were kept as soldiers.',
  ],
  s0665: [
    'Now at Ningshan in Shaanxi and Suining in Sichuan reports of new troops causing trouble follow one another; they are promptly suppressed.',
    'Now Ningshan and Suining report new troops in repeated trouble, promptly suppressed.',
  ],
  s0666: [
    'Such violent men must be punished whenever needed, lest they spawn new trouble."',
    'Such violent men must be punished at once so they do not stir new trouble.',
  ],
  s0667: [
    'On day wuchen, new troops at Washiping in Shaanxi rebelled and were pacified.',
    'On wuchen day, Washiping new troops in Shaanxi rebelled and were pacified.',
  ],
  s0668: [
    'Second month, day jiaxu: the Emperor attended the Classics Lecture; on day wuzi Jilakan was dismissed and stripped of rank.',
    'In the second month, on jiaxu day, the Emperor lectured on the classics; on wuzi day Jilakan was dismissed and stripped of rank.',
  ],
  s0669: [
    'On day renchen, the Emperor visited the Eastern Tombs.',
    'On renchen day, the Emperor visited the Eastern Tombs.',
  ],
  s0670: [
    'Third month, day renchen: the Emperor went to the Southern Park for the enclosure hunt.',
    'In the third month, on renchen day, the Emperor hunted at the Southern Park.',
  ],
  s0671: [
    'On day xinhai, he visited the Western Tombs.',
    'On xinhai day, the Emperor visited the Western Tombs.',
  ],
  s0672: [
    'On day jiayin, he returned to the capital.',
    'On jiayin day, the Emperor returned to Beijing.',
  ],
  s0673: [
    'On day dingsi, the Veritable Records and Sacred Instructions of the Gaozong Emperor were completed.',
    'On dingsi day, Gaozong\'s Veritable Records and Sacred Instructions were completed.',
  ],
  s0674: [
    'On day xinsi, the Emperor prayed for rain.',
    'On xinsi day, the Emperor prayed for rain.',
  ],
  s0675: [
    'On day jiazi, rain fell.',
    'On jiazi day, rain fell.',
  ],
  s0676: [
    'Summer, fourth month, day bingxu: the Emperor reviewed troops of the Vanguard Camp.',
    'In the fourth summer month, on bingxu day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0677: [
    'On day gengzi, the Emperor prayed for rain.',
    'On gengzi day, the Emperor prayed for rain.',
  ],
  s0678: [
    'Fifth month, day jichou: rain fell.',
    'In the fifth month, on jichou day, rain fell.',
  ],
  s0679: [
    'On day jiwei, Changling was made Shaanxi-Gansu governor-general and Sabintu canal-transport governor-general.',
    'On jiwei day, Changling took Shaanxi-Gansu and Sabintu the grain transport command.',
  ],
  s0680: [
    'On day bingyin, material prices for river works were increased.',
    'On bingyin day, river-work material prices were raised.',
  ],
  s0681: [
    'Since the Yongzheng reign the annual works budget had stood at 600,000 taels; from this time it rose steadily to 1,600,000.',
    'Since Yongzheng the annual works budget had been 600,000 taels; it now rose to 1,600,000.',
  ],
  s0682: [
    'Sixth month, day yiwei: governors and governors-general were forbidden to let private secretaries use influence to secure office.',
    'In the sixth month, on yiwei day, governors were forbidden to let secretaries buy office through influence.',
  ],
  s0683: [
    'Autumn, seventh month, day yisi: compiler Qi Kun and supervising censor Fei Xizhang were ordered to invest the king of Ryukyu.',
    'In the seventh autumn month, on yisi day, Qi Kun and Fei Xizhang were sent to invest Ryukyu\'s king.',
  ],
  s0684: [
    'On day wuwu, the Emperor toured Mulan.',
    'On wuwu day, the Emperor toured Mulan.',
  ],
  s0685: [
    'Eighth month, day yiyou: the Emperor conducted the enclosure hunt.',
    'In the eighth month, on yiyou day, the Emperor hunted in the enclosure.',
  ],
  s0686: [
    'Ninth month, day bingwu: the Emperor returned and halted at Mulan.',
    'In the ninth month, on bingwu day, the Emperor returned and halted at Mulan.',
  ],
  s0687: [
    'Siam privately recruited merchants for trade; an imperial rescript was issued admonishing it to stop.',
    'Siam privately recruited traders; an imperial rescript ordered it to stop.',
  ],
  s0688: [
    'On day xinhai, the imperial procession returned.',
    'On xinhai day, the Emperor began the return journey.',
  ],
  s0689: [
    'On day jiayin, troops at Gubeikou were reviewed.',
    'On jiayin day, the Emperor reviewed troops at Gubeikou.',
  ],
  s0690: [
    'On day bingchen, he returned to the capital.',
    'On bingchen day, the Emperor returned to Beijing.',
  ],
  s0691: [
    'Winter, tenth month, day yiwei: military provincial and metropolitan examinations were ordered to drop policy essays in the inner court and require silent transcription of military classics.',
    'In the tenth winter month, on yiwei day, military exams dropped policy essays and required silent transcription of military classics.',
  ],
  s0692: [
    'Eleventh month, day xinchou: the Chenjiapu dam mouth was closed and the Yellow River was led by its old course to the sea.',
    'In the eleventh month, on xinchou day, Chenjiapu was closed and the Yellow River was returned to its old sea course.',
  ],
  s0693: [
    'Twelfth month, day guiwei: Qing Antai was transferred to be Henan governor and Ruan Yuan was made Zhejiang governor.',
    'In the twelfth month, on guiwei day, Qing Antai took Henan and Ruan Yuan Zhejiang.',
  ],
  s0694: [
    'On day guisi, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On guisi day, the seasonal temple offering was performed.',
  ],
  s0695: [
    'That year, disaster land taxes and salt levies in forty-seven districts of Zhili, Jiangsu, Sichuan, Gansu, and other provinces were remitted.',
    'That year, disaster land taxes and salt levies in forty-seven districts were remitted.',
  ],
  s0696: [
    'Quota taxes on fields washed away or collapsed by water in five counties of Jiangsu, Fujian, and Shanxi were abolished.',
    'Quota taxes on flood-washed fields in five Jiangsu, Fujian, and Shanxi counties were abolished.',
  ],
  s0697: [
    'Korea, Ryukyu, and Lan Xang presented tribute.',
    'Tribute came from Korea, Ryukyu, and Lan Xang.',
  ],
  s0698: [
    'Thirteenth year, spring, first month, day wuwu: Zhejiang provincial commander Li Changgeng died in service while pursuing pirates and was posthumously made a count.',
    'In year 13, on first-month wuwu, Li Changgeng died pursuing pirates and was posthumously made a count.',
  ],
  s0699: [
    'Wang Delu, his subordinate commander, was made Zhejiang provincial commander.',
    'Wang Delu, his lieutenant, became Zhejiang provincial commander.',
  ],
  s0700: [
    'Second month, day dingmao: the second imperial son was ordered to perform the Great Sacrifice to Confucius.',
    'In the second month, on dingmao day, the second imperial son was ordered to sacrifice to Confucius.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b07.mjs <translation.json>'
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
