#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Third month, day gengshen, first of the month: worried about drought, the Emperor ordered a renewed call for memorials and admonished the Nine Ministers and great officials to fulfill state duties with their whole persons.',
    'In the third month, on the new moon of gengshen, drought led the Emperor to solicit advice and urge ministers to their duties.',
  ],
  s0802: [
    'On day dingmao, Grand Secretaries, the Nine Ministers, governors, and governors-general were ordered to recommend men like Ma Zhou and Yang Cheng for remonstrance posts.',
    'On dingmao day, ministers were told to recommend outspoken officials like Ma Zhou and Yang Cheng.',
  ],
  s0803: [
    'On day yihai, because of drought the Ministry of Justice was ordered to clear ordinary prisons; all provinces were to do likewise.',
    'On yihai day, drought led to orders to clear prisons nationwide.',
  ],
  s0804: [
    'Yan Sisheng was made Shandong governor.',
    'Yan Sisheng became Shandong governor.',
  ],
  s0805: [
    'On day xinsi, Dzungar taiji Galdan Tseren sent envoys Chuinamuka and others with a memorial and tribute, asking that trade not be limited by year.',
    'On xinsi day, Galdan Tseren sent Chuinamuka and others with tribute, seeking unrestricted annual trade.',
  ],
  s0806: [
    'On day renwu, because Galdan Tseren\'s memorial was crafty and deceitful, the northwestern two-route army grand ministers were instructed to guard against him carefully.',
    'On renwu day, Galdan Tseren\'s deceitful memorial led to tighter frontier vigilance.',
  ],
  s0807: [
    'On day wuzi, the Emperor went to Black Dragon Pool to pray for rain.',
    'On wuzi day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0808: [
    'Because Two-Jiangs governor-general Naxitu had omissions in relief administration, he was sharply rebuked.',
    'Naxitu was sharply rebuked for gaps in Two-Jiangs famine relief.',
  ],
  s0809: [
    'Summer, fourth month, day gengyin, first of the month: Dzungar tribute envoys Chuinamuka and others were received in audience.',
    'In the fourth month, Dzungar envoys Chuinamuka and others were received.',
  ],
  s0810: [
    'One vice commander at each of Bagou and Dushikou was cut; one vice commander at Tianjin was added.',
    'Vice commanders at Bagou and Dushikou were cut; Tianjin gained one.',
  ],
  s0811: [
    'The Gubeikou commander was placed in charge of courier stations outside Dushikou.',
    'The Gubeikou commander took charge of stations beyond Dushikou.',
  ],
  s0812: [
    'Scheduled grain tax remitted for three Henan counties including Yongcheng for last year\'s flood damage.',
    'Henan\'s Yongcheng and two other counties were excused last year\'s flood taxes.',
  ],
  s0813: [
    'On day jiawu, Jin Shen and three hundred twenty-three others were granted jinshi and other ranks with distinctions.',
    'On jiawu day, Jin Shen and 323 others received jinshi degrees with graded ranks.',
  ],
  s0814: [
    'Depei was transferred to Two-Jiangs governor-general; Naxitu to Min-Zhe governor-general.',
    'Depei became Two-Jiangs governor-general; Naxitu Min-Zhe governor-general.',
  ],
  s0815: [
    'On day yiwei, over three hundred thousand taels of Anhui relief silver were allocated, and purchase of Huguang rice for relief sale was approved.',
    'On yiwei day, over 300,000 taels of Anhui relief silver were issued and Huguang rice purchases approved.',
  ],
  s0816: [
    'On day xinchou, relief was given for flood in Anhui\'s Suzhou and other prefectures, counties, and garrisons.',
    'On xinchou day, Anhui flood victims in Suzhou and elsewhere were relieved.',
  ],
  s0817: [
    'On day jiachen, an imperial letter was granted to Dzungar taiji Galdan Tseren, admonishing him for repeatedly bringing up old grievances and violating fixed agreements, and instructing that this memorial\'s requests for trade and changing the Gas route be stopped; gifts were still granted as usual.',
    'On jiachen day, Galdan Tseren received an imperial letter rebuking broken agreements and refusing trade and route requests while keeping usual gifts.',
  ],
  s0818: [
    'On day jiayin, land tax was remitted for eleven Henan counties including Weichuan for flood-washed fields.',
    'On jiayin day, eleven Henan counties including Weichuan were excused flood-washed land tax.',
  ],
  s0819: [
    'Scheduled grain tax was remitted for seven Fujian counties including Fuqing for typhoon damage.',
    'Fujian\'s Fuqing and six other counties were excused typhoon taxes.',
  ],
  s0820: [
    'On day bingchen, Minister of Justice Liu Wulong died; Zhang Zhao was made Minister of Justice.',
    'On bingchen day, Liu Wulong died; Zhang Zhao became Minister of Justice.',
  ],
  s0821: [
    'Fifth month, day jiwei, first of the month: because eight prefectures including Shuntian and Baoding and five departments including Yizhou lacked rain, collection of old and new taxes was suspended.',
    'In the fifth month, drought in Shuntian, Baoding, and other areas led to suspension of tax collection.',
  ],
  s0822: [
    'Regulations were fixed for relocating Manchu troops to farm at Lalin and Alechuka; a vice commander was established, with Baling\'a appointed.',
    'Rules were set for Manchu farming colonies at Lalin and Alechuka; Baling\'a became vice commander.',
  ],
  s0823: [
    'On day wuchen, because censor Hu Ding impeached him, Zhao Hong\'en\'s appointment as vice minister of Justice was set aside.',
    'On wuchen day, Hu Ding\'s impeachment blocked Zhao Hong\'en\'s Justice vice ministership.',
  ],
  s0824: [
    'On day guiyou, rain-prayer ritual regulations were fixed and imperial hymns composed.',
    'On guiyou day, rain-prayer rites were codified with new imperial hymns.',
  ],
  s0825: [
    'Grain tax was remitted for flooded fields in Jiangsu\'s Pei County at Zhaoyang Lake.',
    'Pei County\'s Zhaoyang Lake flood fields were excused grain tax.',
  ],
  s0826: [
    'On day bingxu, memorials were forbidden to call Mongols "barbarians."',
    'On bingxu day, memorials could no longer call Mongols "barbarians."',
  ],
  s0827: [
    'The Ryukyu king was praised for supplying refugees from Jiangnan who had suffered shipwreck.',
    'Ryukyu was commended for aiding Jiangnan shipwreck survivors.',
  ],
  s0828: [
    'Zhang Yunsui memorialized that Menggen chief Zhao Hehan beyond the Mengzhe boundary had been expelled and fled into Burma.',
    'Zhang Yunsui reported Menggen chief Zhao Hehan driven out and fled to Burma.',
  ],
  s0829: [
    'Sixth month, day jiayin: governors and governors-general were instructed to lead prefectures and counties in planning local advantages.',
    'In the sixth month, governors were told to guide counties in land planning.',
  ],
  s0830: [
    'On day wushen, local officials were admonished to manage relief grain sales in earnest.',
    'On wushen day, officials were urged to run fair-price grain sales conscientiously.',
  ],
  s0831: [
    'Autumn, seventh month, day jiwei: shipwrecked Japanese refugees were ordered sent home with support.',
    'In the seventh month, Japanese castaways were sent home with aid.',
  ],
  s0832: [
    'Arrears were remitted for three Guangxi prefectures including Wuzhou.',
    'Guangxi\'s Wuzhou and two other prefectures were excused tax arrears.',
  ],
  s0833: [
    'On day xinyou, grain tax was remitted for wasteland in Shanxi\'s Fanshi and Guangxi\'s Wuyuan.',
    'On xinyou day, wasteland tax was cut in Fanshi and Wuyuan.',
  ],
  s0834: [
    'On day yichou, Minister of Rites Zhao Guolin asked to retire; the Emperor charged him with affectation and stripped him of office.',
    'On yichou day, Zhao Guolin\'s retirement plea brought rebuke and dismissal.',
  ],
  s0835: [
    'Ren Lanzhi was transferred to Minister of Rites; Chen Dehua to Minister of War; Xu Ben given concurrent charge of Minister of Revenue.',
    'Ren Lanzhi, Chen Dehua, and Xu Ben received new ministerial posts.',
  ],
  s0836: [
    'On day bingyin, Grand Secretary Ortai was ordered to hold the concurrent post of interior palace guard commander.',
    'On bingyin day, Ortai was made interior palace guard commander as well.',
  ],
  s0837: [
    'Relief was ordered for flood in Jiangsu\'s Shanyang and other prefectures and counties.',
    'Jiangsu flood victims in Shanyang and elsewhere were ordered relieved.',
  ],
  s0838: [
    'Comfort was ordered for flood in Jiangsu\'s Funing and other prefectures and counties.',
    'Funing and other Jiangsu flood areas were ordered comforted.',
  ],
  s0839: [
    'On day guiwei, Gao Bin and Zhou Xuejian were sent to Jiangnan to investigate disaster relief and waterworks.',
    'On guiwei day, Gao Bin and Zhou Xuejian were sent to audit Jiangnan relief and rivers.',
  ],
  s0840: [
    'On day jiashen, relief was given for hail-flood in Hubei\'s Hanchuan, Xiangyang, and other prefectures, counties, and garrisons, and scheduled taxes were suspended.',
    'On jiashen day, Hubei hail-flood areas were relieved and taxes suspended.',
  ],
  s0841: [
    'On day bingxu, relief was given for Jiangsu\'s Jiangpu and eighteen other prefectures, counties, and garrisons, and Anhui\'s Linhuai and other prefectures, counties, and garrisons.',
    'On bingxu day, Jiangsu and Anhui flood areas received relief.',
  ],
  s0842: [
    'Comfort was given to disaster victims in Jiangxi\'s Xingguo and other prefectures and counties, Zhejiang\'s Chun\'an and other prefectures and counties, Hunan\'s Liling and eight other prefectures and counties, Shandong\'s Yi County and ten other prefectures, counties, and garrisons, and Gansu\'s Didao and four other prefectures, counties, and departments.',
    'Disaster victims in Jiangxi, Zhejiang, Hunan, Shandong, and Gansu were comforted.',
  ],
  s0843: [
    'Eighth month, day wuzi: the Huang and Huai rivers rose together in Jiangnan; frontier officials were ordered to save the afflicted without binding themselves to routine.',
    'In the eighth month, Jiangnan\'s Huang-Huai floods led to orders to save victims beyond routine rules.',
  ],
  s0844: [
    'Military administration was admonished to be carefully handled.',
    'Officials were admonished to handle military affairs carefully.',
  ],
  s0845: [
    'Over two million five hundred thousand taels of Jiangsu and Anhui relief silver were allocated.',
    'Over 2.5 million taels of Jiangsu and Anhui relief silver were issued.',
  ],
  s0846: [
    'On day gengyin, scheduled grain tax for the year was remitted for flooded areas in Jiangsu and Anhui.',
    'On gengyin day, this year\'s grain tax was cut in flooded Jiangsu and Anhui.',
  ],
  s0847: [
    'On day xinmao, regulations were fixed for the empress\'s personal silkworm rite.',
    'On xinmao day, the empress\'s silkworm ceremony was codified.',
  ],
  s0848: [
    'On day wuxu, arrears were remitted for Zhili, Jiangsu, Anhui, Fujian, Gansu, Guangdong, and other provinces for Yongzheng 13, and unpaid grain transport items for Jiangnan and Zhejiang for Yongzheng 13 were also remitted.',
    'On wuxu day, Yongzheng 13 arrears were cut in several provinces and Jiangnan-Zhejiang transport dues.',
  ],
  s0849: [
    'On day gengzi, Henan and other provinces were instructed to comfort Jiangnan refugees.',
    'On gengzi day, provinces were told to aid Jiangnan refugees.',
  ],
  s0850: [
    'On day renyin, the Emperor accompanied the Empress Dowager to the Southern Park; the Emperor conducted a hunt.',
    'On renyin day, the Emperor took the Empress Dowager to the Southern Park and hunted.',
  ],
  s0851: [
    'On day guimao, relief was given for Jiangxi\'s Xingguo flood.',
    'On guimao day, Xingguo flood victims were relieved.',
  ],
  s0852: [
    'On day yisi, the Emperor accompanied the Empress Dowager to Laying-Hawk Terrace to review the hunt.',
    'On yisi day, the Empress Dowager watched the hunt at Laying-Hawk Terrace.',
  ],
  s0853: [
    'Ninth month, day dingsi, first of the month: one hundred thousand shi of grain transport rice detained in Shandong from Jiangsu was allocated for relief sale in Huai, Xu, Feng, and Ying districts.',
    'In the ninth month, 100,000 shi of detained transport grain was set aside for Huai-Xu relief sales.',
  ],
  s0854: [
    'Relief was given for flood in ten Hubei prefectures and counties including Qianjiang.',
    'Ten Hubei prefectures and counties including Qianjiang received flood relief.',
  ],
  s0855: [
    'On day xinyou, scheduled tax was remitted for two Guangdong prefectures and counties including Yazhou for wind damage.',
    'On xinyou day, Yazhou and one other Guangdong county were excused wind taxes.',
  ],
  s0856: [
    'Grain transport tax for Anhui\'s Feng, Ying, and Si three prefectures and departments was remitted for this year\'s flood areas; where disaster was partial, collection in commutation was ordered.',
    'Anhui transport tax was cut in flood zones; partial disaster areas paid in commutation.',
  ],
  s0857: [
    'Relief was given for flood in nine Hunan counties including Xiangyin.',
    'Nine Hunan counties including Xiangyin received flood relief.',
  ],
  s0858: [
    'On day dingmao, the Emperor went to the Eastern Tombs.',
    'On dingmao day, the Emperor went to the Eastern Tombs.',
  ],
  s0859: [
    'On day gengwu, the Emperor paid respects at Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On gengwu day, the Emperor visited Zhaoxi, Xiaoling, Xiaodongling, and Jingling.',
  ],
  s0860: [
    'Grain transport tax was remitted for twenty-one Jiangsu prefectures and counties including Shanyang flooded this year.',
    'Twenty-one flooded Jiangsu counties including Shanyang were excused transport tax.',
  ],
  s0861: [
    'On day renshen, the Emperor went to Mount Pan.',
    'On renshen day, the Emperor went to Mount Pan.',
  ],
  s0862: [
    'Disaster relief and comfort: over two million nine hundred thousand taels of silver and over two million two hundred thousand shi of grain for Jiangsu and Anhui.',
    'Jiangsu and Anhui received over 2.9 million taels of silver and 2.2 million shi of grain in relief.',
  ],
  s0863: [
    'Orders were given to allocate another one million taels from neighboring provinces for relief next spring.',
    'Another million taels from neighboring provinces was ordered for spring relief.',
  ],
  s0864: [
    'On day yihai, the Emperor went to Fenji Mountain.',
    'On yihai day, the Emperor went to Fenji Mountain.',
  ],
  s0865: [
    'On day wuyin, the Emperor returned in procession.',
    'On wuyin day, the Emperor returned to the capital.',
  ],
  s0866: [
    'Winter, tenth month, day bingxu: fifty thousand shi each of next year\'s transport grain from Shandong and Henan were allocated for Jiangnan relief; grain was still to be purchased beyond the Great Wall at Gubeikou in corresponding amounts to make up transport, per Zhili.',
    'In the tenth month, Shandong and Henan each gave 50,000 shi of next year\'s grain for Jiangnan relief, with Gubeikou purchases to replenish.',
  ],
  s0867: [
    'On day jichou, scheduled tax was remitted for nineteen Shandong prefectures and counties including Licheng for drought.',
    'On jichou day, nineteen drought-struck Shandong counties including Licheng were excused tax.',
  ],
  s0868: [
    'On day gengyin, two hundred thousand shi of Qianlong guihai year grain transport detained in Jiangnan was ordered, and still two hundred thousand shi of Shandong transport grain and two hundred thousand shi of Henan warehouse grain were to be transported to Jiangnan for relief.',
    'On gengyin day, 200,000 shi of detained guihai transport grain plus Shandong and Henan grain were sent to Jiangnan.',
  ],
  s0869: [
    'On day guisi, Zhejiang commander Pei Yue and others were stripped of office and tried for extortion.',
    'On guisi day, Pei Yue and others were dismissed and tried for graft.',
  ],
  s0870: [
    'On day renchen, relief was given for famine in twenty-eight Jiangsu prefectures, counties, and garrisons including Shanyang.',
    'On renchen day, twenty-eight Jiangsu areas including Shanyang received famine relief.',
  ],
  s0871: [
    'On day jiawu, backlog of cases was ordered cleared.',
    'On jiawu day, delayed court cases were ordered cleared.',
  ],
  s0872: [
    'On day yiwei, one hundred thousand shi of grain along Shandong rivers was ordered transported to Jiangnan for relief.',
    'On yiwei day, 100,000 shi of Shandong river grain was sent to Jiangnan.',
  ],
  s0873: [
    'On day dingyou, relief was given for flood in twenty-four Anhui prefectures, counties, and garrisons in Fengyang.',
    'On dingyou day, twenty-four Fengyang-area units received flood relief.',
  ],
  s0874: [
    'On day jiachen, Korean King Yeongjo memorialized thanks that his subject Kim Sijong and others had repeatedly violated the border yet received repeated clemency.',
    'On jiachen day, King Yeongjo thanked the court for clemency toward border violators led by Kim Sijong.',
  ],
  s0875: [
    'The Emperor said: "This is My policy of gentle treatment toward the distant.',
    'The Emperor said, "This is My gracious policy toward distant peoples.',
  ],
  s0876: [
    'If you rely on repeated clemency and offenses multiply, that is not My intent in preserving outer vassals.',
    'If you rely on repeated pardons and offenses multiply, that is not how I mean to protect vassal states.',
  ],
  s0877: [
    'Your Majesty must strictly restrain them and not let them violate discipline.',
    'You must strictly restrain them and not let them break the law.',
  ],
  s0878: [
    '" Saileng\'e was made Shaanxi governor.',
    'Saileng\'e became Shaanxi governor.',
  ],
  s0879: [
    'On day jiyou, relief was given for famine in thirteen Henan prefectures and counties including Yongcheng.',
    'On jiyou day, thirteen Henan areas including Yongcheng received famine relief.',
  ],
  s0880: [
    'On day xinhai, the Emperor went to Imperial Noble Consort Shunyi\'s palace to inquire after her illness.',
    'On xinhai day, the Emperor inquired after Imperial Noble Consort Shunyi\'s illness.',
  ],
  s0881: [
    'On day renyin, relief was given for flood in seven Jiangsu prefectures, counties, and garrisons including Shanyang.',
    'On renyin day, seven Jiangsu flood areas including Shanyang were relieved.',
  ],
  s0882: [
    'Eleventh month, day bingchen, first of the month: Grand Secretaries and others memorialized on compiling principles for the History of the Ming.',
    'In the eleventh month, Grand Secretaries reported principles for compiling the Ming History.',
  ],
  s0883: [
    'The Emperor said: "What you gentlemen see accords with My mind.',
    'The Emperor said, "Your views accord with My mind.',
  ],
  s0884: [
    'Carrying on the Spring and Autumn in aiding the Way, illuminating models for generations to come—let ruler and ministers together exert ourselves.',
    'Follow the Spring and Autumn in aiding the Way and set a mirror for posterity—let us strive together.',
  ],
  s0885: [
    '" Relief was given for flood famine in twelve Hubei prefectures and counties including Hanchuan.',
    'Relief was given for flood famine in twelve Hubei counties including Hanchuan.',
  ],
  s0886: [
    'On day wuwu, relief was given for flood in Zhejiang\'s Ruian and other counties and departments, and Hunan\'s Xiangyin and nine other counties.',
    'On wuwu day, Zhejiang and Hunan flood areas including Ruian and Xiangyin were relieved.',
  ],
  s0887: [
    'On day gengshen, in Zhangpu County, Fujian, a secret society slew the magistrate; severe punishment was ordered.',
    'On gengshen day, after Zhangpu magistrates were killed by a secret society, harsh punishment was ordered.',
  ],
  s0888: [
    'On day renxu, relief was given for flood in ten Shandong prefectures, counties, and garrisons including Jiaozhou.',
    'On renxu day, ten Shandong flood areas including Jiaozhou were relieved.',
  ],
  s0889: [
    'On day guihai, relief was given for hail flood in Gansu\'s Didao and other prefectures and counties.',
    'On guihai day, Didao and other Gansu hail-flood areas were relieved.',
  ],
  s0890: [
    'On day yihai, law enforcement was ordered to balance severity and leniency and seek fairness.',
    'On yihai day, officials were told to apply law with balanced severity.',
  ],
  s0891: [
    'Chen Shiguan was ordered to join Gao Bin in surveying Jiangnan waterworks.',
    'Chen Shiguan was ordered to survey Jiangnan rivers with Gao Bin.',
  ],
  s0892: [
    'On day wuyin, it was announced that in spring next year the Empress Dowager would be taken to Mukden to visit the tombs.',
    'On wuyin day, a spring visit to Mukden tombs with the Empress Dowager was announced.',
  ],
  s0893: [
    'On day gengchen, because the fasting palace rite was newly established, on that day the Emperor went to the fasting palace.',
    'On gengchen day, with the new fasting palace rite in place, the Emperor went there.',
  ],
  s0894: [
    'Twelfth month, day bingxu, first of the month: relief was given for famine in seven Shandong prefectures, counties, and garrisons including Jining.',
    'In the twelfth month, seven Shandong famine areas including Jining were relieved.',
  ],
  s0895: [
    'On day dinghai, examination of talents recommended from the censorate and other tracks was ordered.',
    'On dinghai day, recommended censorate and other talents were ordered examined.',
  ],
  s0896: [
    'Zhou Xuejian recommended three men, all fellow-townsmen; he was admonished.',
    'Zhou Xuejian was rebuked for recommending three fellow-townsmen.',
  ],
  s0897: [
    'Left Vice Censor-in-chief Zhong Yongtan was ordered to join Zhou Xuejian in inspecting relief.',
    'Zhong Yongtan was ordered to inspect relief with Zhou Xuejian.',
  ],
  s0898: [
    'On day renchen, the Emperor accompanied the Empress Dowager to Yingtai.',
    'On renchen day, the Emperor took the Empress Dowager to Yingtai.',
  ],
  s0899: [
    'On day bingzi, Zhong Yongtan and E Rong\'an, for leaking state secrets, were taken to the Imperial Household Department\'s Prudence and Punishment Office; Prince Zhuang and others were ordered to try them.',
    'On bingzi day, Zhong Yongtan and E Rong\'an were arrested for leaking secrets and tried under Prince Zhuang.',
  ],
  s0900: [
    'Overflow tax was remitted for wasteland in four Fujian counties including Youxi.',
    'Youxi and three other Fujian counties were excused wasteland overflow tax.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b09.mjs <translation.json>'
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
