#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Dai Yuheng was made Grand Secretary and Fei Chun Minister of Works.',
    'Dai Yuheng became Grand Secretary and Fei Chun Minister of Works.',
  ],
  s0802: [
    'Sixth month, day wuxu: the Rehe vice commander-in-chief post was changed to commander-in-chief, and Jilakan was appointed to fill it.',
    'In the sixth month, on wuxu day, Rehe\'s vice commander became commander-in-chief and Jilakan was appointed.',
  ],
  s0803: [
    'On day renzi, Bailing was granted the hereditary title Light Chariot Commandant for merit in capturing and delivering the pirate Wu Shier.',
    'On renzi day, Bailing received a hereditary commandant title for capturing the pirate Wu Shier.',
  ],
  s0804: [
    'Autumn, seventh month, day jiayin: the Yongding River overflowed.',
    'In the seventh month, on jiayin day, the Yongding River burst its banks.',
  ],
  s0805: [
    'On day renshen, the Emperor toured to Mulan.',
    'On renshen day, the Emperor went to Mulan.',
  ],
  s0806: [
    'On day xinsi, Xu Duan was made Southern River waterways governor-general.',
    'On xinsi day, Xu Duan became Southern River waterways governor-general.',
  ],
  s0807: [
    'The Yuntiguan estuary was repaired, with Ma Huiyu ordered to supervise.',
    'Yuntiguan estuary repairs were ordered under Ma Huiyu.',
  ],
  s0808: [
    'Eighth month, day wuxu: the Emperor went on the autumn hunt.',
    'In the eighth month, on wuxu day, the Emperor began the autumn hunt.',
  ],
  s0809: [
    'On day renzi, Zhaobao was made Mongol commander-in-chief.',
    'On renzi day, Zhaobao became Mongol commander-in-chief.',
  ],
  s0810: [
    'A Guangdong naval commander-in-chief was established, and a Yangjiang naval brigade commander.',
    'Guangdong gained a naval commander-in-chief and Yangjiang a naval brigade commander.',
  ],
  s0811: [
    'Ninth month, day jiwei: Wang Zhiyi was made Fujian-Zhejiang governor-general, Ma Huiyu Huguang governor-general, and Gongala Minister of Works.',
    'In the ninth month, Wang Zhiyi took Fujian-Zhejiang, Ma Huiyu Huguang, and Gongala the works ministry.',
  ],
  s0812: [
    'On day jiazi, the Yongding River breach was closed.',
    'On jiazi day, the Yongding breach was sealed.',
  ],
  s0813: [
    'On day jisi, the Emperor returned to the capital.',
    'On jisi day, the Emperor returned to Beijing.',
  ],
  s0814: [
    'On day yihai, the price of straw materials for the Southern River was increased in silver.',
    'On yihai day, Southern River straw-material payments were raised.',
  ],
  s0815: [
    'Winter, tenth month, day jiawu: the Gaoyan and Shanxu dikes in Jiangnan burst.',
    'In the tenth month, Gaoyan and Shanxu dikes in Jiangnan failed.',
  ],
  s0816: [
    'On day dingyou, regulations for daily duty rotation in ministries and courts were fixed.',
    'On dingyou day, ministry and court daily-duty rules were set.',
  ],
  s0817: [
    'Eleventh month, day renxu: former Jilin general Xiulin was granted death for embezzling ginseng funds.',
    'In the eleventh month, ex-general Xiulin was sentenced to death for ginseng embezzlement.',
  ],
  s0818: [
    'Twelfth month, day bingshen: Guangxi reported the long-lived subject Lan Xiang at one hundred forty-two years of age; he was specially granted an imperial poem, an imperial inscribed plaque, a sixth-rank hat button, and fifty taels of silver.',
    'In the twelfth month, Lan Xiang, aged 142, received an imperial poem, plaque, rank insignia, and silver.',
  ],
  s0819: [
    'On day dingyou, Ma Huiyu memorialized that the great Yuntiguan works were closed and the river returned to its proper course to the sea.',
    'On dingyou day, Ma Huiyu reported Yuntiguan works complete and the river restored.',
  ],
  s0820: [
    'An edict commended him.',
    'The throne praised him.',
  ],
  s0821: [
    'On day jihai, Chen Fengxiang was made Jiangnan waterways governor-general.',
    'On jihai day, Chen Fengxiang became Jiangnan waterways governor-general.',
  ],
  s0822: [
    'On day renyin, Xingzhao was transferred as Chahar commander-in-chief.',
    'On renyin day, Xingzhao was moved to Chahar command.',
  ],
  s0823: [
    'On day jiyou, joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On jiyou day, the seasonal temple joint sacrifice was held.',
  ],
  s0824: [
    'That year, disaster land tax was remitted for seven Zhili prefectures and counties.',
    'That year seven Zhili districts were forgiven disaster taxes.',
  ],
  s0825: [
    'Land tax on collapsed fields in Dantu and Shanghai, Jiangsu, and on abandoned fields in Wuwei Prefecture, Anhui, was abolished.',
    'Collapsed Jiangsu fields and abandoned Anhui fields were exempted from tax.',
  ],
  s0826: [
    'Korea and Siam presented tribute.',
    'Korea and Siam sent tribute.',
  ],
  s0827: [
    'Sixteenth year, xinwei, spring, first month, day wuwu: because a new long dike was built at Yuntiguan Horse Harbor, the Huaihai circuit was added, with assistant prefects at Hai\'an and Haifu.',
    'In Jiaqing 16 spring, Huaihai circuit and two subprefects were added for the new Yuntiguan dike.',
  ],
  s0828: [
    'On day guiyou, Bailing was made Minister of Punishments, Songyun transferred to Guangdong governor-general, and Lebao to Liangjiang governor-general.',
    'On guiyou day, Bailing took punishments, Songyun Guangdong, and Lebao Liangjiang.',
  ],
  s0829: [
    'Second month, day renwu: the Emperor attended the Classics Lecture.',
    'In the second month, on renwu day, the Emperor held the Classics Lecture.',
  ],
  s0830: [
    'On day dinghai, sacrifice was offered to Confucius.',
    'On dinghai day, Confucius received sacrifice.',
  ],
  s0831: [
    'An edict said: "Because Southern River works over successive years have consumed more than forty million taels, I specially ordered Tuojin and Chu Pengling to go and investigate.',
    'An edict noted forty million taels spent on Southern River works and ordered Tuojin and Chu Pengling to investigate.',
  ],
  s0832: [
    'According to their report on examination, audited funds received and disbursed still correspond, but the works are not yet entirely solid.',
    'Their audit found funds balanced but works still unsound.',
  ],
  s0833: [
    'This is truly the blame of successive river officials; Wu Jun and Xu Duan were each demoted by degree.',
    'Past river officials were blamed; Wu Jun and Xu Duan were demoted.',
  ],
  s0834: [
    'Work staff are to be dismissed together.',
    'On-site staff were all dismissed.',
  ],
  s0835: [
    'The six hundred thousand taels not yet issued are likewise ordered withheld.',
    'Six hundred thousand taels still unissued were withheld.',
  ],
  s0836: [
    '"',
    'The edict ended.',
  ],
  s0837: [
    'Third month, day bingyin: the Emperor visited the Western Tombs.',
    'In the third month, on bingyin day, the Emperor visited the Western Tombs.',
  ],
  s0838: [
    'On day renwu, after the tomb rites were completed, he toured west to Wutai Mountain.',
    'On renwu day, tomb rites done, he went west to Wutai Mountain.',
  ],
  s0839: [
    'On day yihai, Minister of Works Fei Chun died and was posthumously granted Grand Secretary rank.',
    'On yihai day, Fei Chun died and was posthumously made Grand Secretary.',
  ],
  s0840: [
    'Prince Su Yongxi was made Mongol commander-in-chief.',
    'Prince Su Yongxi became Mongol commander-in-chief.',
  ],
  s0841: [
    'Intercalary third month, day gengchen: the Emperor halted at Wutai Mountain.',
    'In the intercalary third month, on gengchen day, he stayed at Wutai Mountain.',
  ],
  s0842: [
    'On day yiyou, the Emperor returned in imperial progress.',
    'On yiyou day, the imperial progress returned.',
  ],
  s0843: [
    'On day bingshen, the Emperor visited Empress Yao\'s tomb and the Emperor Yao Temple and performed rites.',
    'On bingshen day, he worshipped at Empress Yao\'s tomb and the Yao Temple.',
  ],
  s0844: [
    'On day wuxu, the Emperor reviewed Zhili Green Standard troops, visited Lianchi Academy, and dispatched an official to sacrifice at the shrine of Ming minister Yang Jisheng.',
    'On wuxu day, he reviewed Zhili troops, visited Lianchi Academy, and sacrificed at Yang Jisheng\'s shrine.',
  ],
  s0845: [
    'On day guimao, the Emperor returned to the capital.',
    'On guimao day, the Emperor returned to Beijing.',
  ],
  s0846: [
    'Summer, fourth month, day wushen: Grand Secretary Dai Yuheng died.',
    'In the fourth month, on wushen day, Dai Yuheng died.',
  ],
  s0847: [
    'On day jiazi, the Emperor prayed for rain.',
    'On jiazi day, the Emperor prayed for rain.',
  ],
  s0848: [
    'Retired cooperating Grand Secretary Chang Lin died.',
    'Retired Assistant Grand Secretary Chang Lin died.',
  ],
  s0849: [
    'On day renshen, Jiang Lilong and two hundred thirty-seven others received jinshi degrees with differentiated ranks.',
    'On renshen day, Jiang Lilong and 237 others received jinshi degrees.',
  ],
  s0850: [
    'Fu Qing was made Hanjun commander-in-chief and Chongluo Mongol commander-in-chief.',
    'Fu Qing became Hanjun commander-in-chief and Chongluo Mongol commander-in-chief.',
  ],
  s0851: [
    'Fifth month, day xinsi: Liu Quanzhi was made Grand Secretary, Zou Bingtai cooperating Grand Secretary, and Liu Huan Minister of War.',
    'In the fifth month, Liu Quanzhi became Grand Secretary, Zou Bingtai assistant, and Liu Huan war minister.',
  ],
  s0852: [
    'On day dinghai, the Emperor again went to the Heavenly Spirits Altar to pray for rain.',
    'On dinghai day, the Emperor again prayed for rain at the Heavenly Spirits Altar.',
  ],
  s0853: [
    'On day gengyin, rain fell.',
    'On gengyin day, rain fell.',
  ],
  s0854: [
    'Sixth month, day renwu: Mingliang was demoted to vice commander-in-chief for an untrue memorial reply.',
    'In the sixth month, Mingliang was demoted for a false memorial reply.',
  ],
  s0855: [
    'Songyun was made cooperating Grand Secretary.',
    'Songyun became cooperating Grand Secretary.',
  ],
  s0856: [
    'On day guichou, Lukang was demoted to vice commander-in-chief for an untrue memorial reply.',
    'On guichou day, Lukang was demoted for a false reply.',
  ],
  s0857: [
    'Lebao was made Grand Secretary directing the Board of Civil Office; Ji Lun was Minister of Works and metropolitan gendarmerie commander.',
    'Lebao became Grand Secretary over civil appointments; Ji Lun took works and the gendarmerie.',
  ],
  s0858: [
    'On day yichou, Hunan surveillance commissioner Fu Nai died and was posthumously granted governor rank; a private shrine was permitted.',
    'On yichou day, Fu Nai died, was posthumously made governor, and granted a shrine.',
  ],
  s0859: [
    'Autumn, seventh month, day wuyin: Court of Imperial Entertainments vice director Lu Yinpu was ordered into the Grand Council and given fourth-rank minister counselor rank.',
    'In the seventh month, Lu Yinpu entered the Grand Council with fourth-rank counselor rank.',
  ],
  s0860: [
    'On day renchen, Westerners secretly residing inland were forbidden.',
    'On renchen day, secret inland residence by Westerners was banned.',
  ],
  s0861: [
    'On day bingshen, the Emperor toured to Mulan.',
    'On bingshen day, the Emperor went to Mulan.',
  ],
  s0862: [
    'On day guichou, the Li Family Tower River in Jiangnan burst.',
    'On guichou day, Jiangnan\'s Li Family Tower River broke.',
  ],
  s0863: [
    'On day yisi, Xingzhao was excused for age; Guntukezhabu was recalled as Chahar commander-in-chief.',
    'On yisi day, Xingzhao retired and Guntukezhabu became Chahar commander.',
  ],
  s0864: [
    'Eighth month, day renxu: the Emperor went on the autumn hunt.',
    'In the eighth month, on renxu day, the Emperor began the autumn hunt.',
  ],
  s0865: [
    'Ninth month, day jimao: a shrine to the god of the Great Ridge of Xing\'an was built, with spring and autumn sacrifices; on day wuzi, the Emperor returned in imperial progress.',
    'In the ninth month, an Xing\'an ridge shrine was founded; on wuzi day the imperial progress returned.',
  ],
  s0866: [
    'On day yiwei, Songyun was made Minister of Civil Office and Jiang Youxian Guangdong governor-general.',
    'On yiwei day, Songyun took civil office and Jiang Youxian Guangdong.',
  ],
  s0867: [
    'On day dingyou, the Emperor visited the tombs.',
    'On dingyou day, the Emperor visited the tombs.',
  ],
  s0868: [
    'On day gengzi, the Emperor returned to the capital.',
    'On gengzi day, the Emperor returned to Beijing.',
  ],
  s0869: [
    'On day xinchou, twelve Yi branches in Sichuan submitted and were converted from native chieftain rule to regular administration.',
    'On xinchou day, twelve Sichuan Yi branches were converted to regular rule.',
  ],
  s0870: [
    'Eleventh month, day gengzi: an edict ordered the Pi and Su canal works on the Grand Canal restored to river officials\' management.',
    'In the eleventh month, Pi-Su canal works were returned to river officials.',
  ],
  s0871: [
    'Twelfth month, day guichou: Hening was made Shengjing general.',
    'In the twelfth month, on guichou day, Hening became Shengjing general.',
  ],
  s0872: [
    'On day guiyou, joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On guiyou day, the seasonal temple joint sacrifice was held.',
  ],
  s0873: [
    'That year, disaster land tax was remitted for eight prefectures and counties in Shuntian, Jiangsu, Henan, and other provinces.',
    'That year eight disaster districts in Shuntian, Jiangsu, Henan, and elsewhere were relieved.',
  ],
  s0874: [
    'Arrears in Gansu were remitted, and land tax on Kashgar Muslim village fields was also abolished.',
    'Gansu arrears were forgiven and Kashgar village land tax abolished.',
  ],
  s0875: [
    'Korea, Ryukyu, Siam, and Burma presented tribute.',
    'Korea, Ryukyu, Siam, and Burma sent tribute.',
  ],
  s0876: [
    'Seventeenth year, renshen, spring, first month, day renwu: seasonal sacrifice at the Imperial Ancestral Temple; the second imperial son performed the rites.',
    'In Jiaqing 17 spring, the second imperial son led the temple seasonal sacrifice.',
  ],
  s0877: [
    'Second month, new moon on day jiachen: the Emperor attended the Classics Lecture.',
    'At the second-month new moon, on jiachen day, the Emperor held the Classics Lecture.',
  ],
  s0878: [
    'Third month, day bingzi: the Emperor visited the Eastern Tombs.',
    'In the third month, on bingzi day, the Emperor visited the Eastern Tombs.',
  ],
  s0879: [
    'On day jichou, the Emperor went to the Southern Park for the autumn hunt.',
    'On jichou day, the Emperor hunted at the Southern Park.',
  ],
  s0880: [
    'On day xinmao, Mingliang was made Xi\'an general.',
    'On xinmao day, Mingliang became Xi\'an general.',
  ],
  s0881: [
    'On day renchen, the Emperor went to Liangying Terrace and held a grand review of the Eight Banners officers and soldiers.',
    'On renchen day, the Emperor reviewed the Eight Banners at Liangying Terrace.',
  ],
  s0882: [
    'On day bingshen, the Emperor returned to the capital.',
    'On bingshen day, the Emperor returned to Beijing.',
  ],
  s0883: [
    'Summer, fourth month, day jiachen: an edict said: "The Eight Banners population grows daily; livelihoods must urgently be broadened.',
    'In the fourth month, an edict urged broader livelihoods as banner population grew.',
  ],
  s0884: [
    'I hear that Jilin soil is rich and fertile, with broad lands and sparse people.',
    'It noted Jilin\'s fertile, sparsely settled lands.',
  ],
  s0885: [
    'Beyond the Willow Palisade, ginseng grounds have shifted far outward; the open land between stretches more than a thousand li, mostly fertile soil, and migrants sometimes go to farm it.',
    'Beyond the palisade lay over a thousand li of fertile open land migrants sometimes farmed.',
  ],
  s0886: [
    'Following the Qianlong-era Lalin precedent, idle bannermen should be sent to Jilin with land allotted to farm or rent for support.',
    'Following the Lalin precedent, idle bannermen should be sent to Jilin with land to farm or rent.',
  ],
  s0887: [
    'In farming intervals they may still practice mounted archery to prepare for service, benefiting both nurture and training.',
    'They could still drill archery in slack seasons while gaining a livelihood.',
  ],
  s0888: [
    'The generals there are to plan carefully, assign dwelling districts, and report details.',
    'Generals were told to plan settlements and report.',
  ],
  s0889: [
    '" On day bingchen, the Emperor reviewed the Jianrui Camp troops.',
    'The edict ended." On bingchen day, the Emperor reviewed the Jianrui Camp.',
  ],
  s0890: [
    'On day guihai, Guards commander Zhaktar died and was granted three hundred taels of silver.',
    'On guihai day, Zhaktar died and received 300 taels of silver.',
  ],
  s0891: [
    'Fifth month, day wuzi: Wen Chenghui memorialized capture at Luanzhou of Jindan and Bagua sect leader Dong Huaixin and others.',
    'In the fifth month, Wen Chenghui reported capturing Dong Huaixin and other sect leaders at Luanzhou.',
  ],
  s0892: [
    'An edict ordered severe punishment.',
    'The throne ordered severe punishment.',
  ],
  s0893: [
    'Sixth month, day yisi: idle imperial clansmen were moved to reside in Shengjing; houses were built and fields and silver granted.',
    'In the sixth month, idle clansmen were settled in Shengjing with housing, land, and silver.',
  ],
  s0894: [
    'Autumn, seventh month, day wuzi: the Emperor toured to Mulan.',
    'In the seventh month, on wuzi day, the Emperor went to Mulan.',
  ],
  s0895: [
    'Eighth month, day renzi: Chen Fengxiang was removed for misconduct; Li Shixu was made Jiangnan waterways governor-general.',
    'In the eighth month, Chen Fengxiang was dismissed and Li Shixu made Jiangnan waterways governor-general.',
  ],
  s0896: [
    'On day jiayin, Ruan Yuan was made grain transport governor-general.',
    'On jiayin day, Ruan Yuan became grain transport governor-general.',
  ],
  s0897: [
    'On day bingchen, the Emperor went on the autumn hunt.',
    'On bingchen day, the Emperor began the autumn hunt.',
  ],
  s0898: [
    'Ninth month, day wuzi: the Emperor returned to the capital.',
    'In the ninth month, on wuzi day, the Emperor returned to Beijing.',
  ],
  s0899: [
    'On day jiawu, Qing Gui retired for age; Songyun was made Grand Councilor.',
    'On jiawu day, Qing Gui retired and Songyun joined the Grand Council.',
  ],
  s0900: [
    'Winter, tenth month, day dingmao: Gongala was made Minister of Rites.',
    'In the tenth month, on dingmao day, Gongala became Minister of Rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b09.mjs <translation.json>'
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
