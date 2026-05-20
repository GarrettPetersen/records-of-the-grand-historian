#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day xinyou, Jiangxi Governor De Xin was stripped of office for wrongdoing.',
    'On xinyou, De Xin was dismissed as Jiangxi governor.',
  ],
  s0102: [
    'An earthquake struck Yarkand.',
    'Yarkand was shaken by earthquake.',
  ],
  s0103: [
    'On day renxu, because Hui rebels were rampant, Grand Commander Tang Yanhe was stripped of office; Yang Changjun and Lei Zhengqian were also stripped but kept in acting posts.',
    'On renxu, Tang Yanhe was dismissed while Yang Changjun and Lei Zhengqian were stripped yet retained in acting posts.',
  ],
  s0104: [
    'On day dingmao, the dismissed Regional Commander Huang Shilin was sentenced to death.',
    'On dingmao, Huang Shilin was condemned to death after dismissal.',
  ],
  s0105: [
    'Eighth month, day renshen: flood victims in Fuchuan and Rong counties were relieved.',
    'Month 8, renshen: Fuchuan and Rong flood victims were relieved.',
  ],
  s0106: [
    'On day bingzi, flood victims in Jie, Wen, Xining, and other districts were relieved.',
    'On bingzi, Jie, Wen, Xining, and other districts received flood relief.',
  ],
  s0107: [
    'On day jimao, Sichuan Governor-General Liu Bingzhang was stripped for failing to protect churches.',
    'On jimao, Liu Bingzhang was dismissed for not protecting churches.',
  ],
  s0108: [
    'On day bingxu, Bureau Director Qing Chang was given fifth-rank kuotang status as envoy to France.',
    'On bingxu, Qing Chang became a fifth-rank kuotang envoy to France.',
  ],
  s0109: [
    'On day guisi, tax on disaster-struck fields at Weiyuan in Yunnan was remitted.',
    'On guisi, Weiyuan disaster-field tax in Yunnan was remitted.',
  ],
  s0110: [
    'Ninth month, day gengzi: fire victims in Wuzhou prefecture were relieved.',
    'Month 9, gengzi: Wuzhou fire victims were relieved.',
  ],
  s0111: [
    'New Shandong grain tribute was retained for disaster relief along the river.',
    'Shandong new tribute grain was kept for riverside disaster relief.',
  ],
  s0112: [
    'On day yisi, thirty thousand shi of Hubei\'s winter tribute grain were retained for relief in Zhongxiang and other counties.',
    'On yisi, thirty thousand shi of Hubei winter tribute were kept for Zhongxiang relief.',
  ],
  s0113: [
    'On day dingwei, Wei Guangtao was ordered to command troops to aid Gansu.',
    'On dingwei, Wei Guangtao was sent to command relief troops in Gansu.',
  ],
  s0114: [
    'On day wushen, Wangdu corvée and half the quota levies on surrendered enclosed lands were remitted and made permanent law.',
    'On wushen, Wangdu corvée and half enclosed-land quota tax were permanently remitted.',
  ],
  s0115: [
    'On day jiyou, Shaanxi\'s prior-year arrears and Huazhou canal-land tax were remitted.',
    'On jiyou, Shaanxi arrear taxes and Huazhou canal-land tax were remitted.',
  ],
  s0116: [
    'On day renzi, the British envoy O\'Conor was received at the Wenhua Hall.',
    'On renzi, the British envoy O\'Conor was received at Wenhua Hall.',
  ],
  s0117: [
    'On day yimao, refugees in Gansu\'s disturbed districts were relieved.',
    'On yimao, Gansu refugees in disturbed areas were relieved.',
  ],
  s0118: [
    'On day wuwu, flood-dragon victims at Linxiang were relieved.',
    'On wuwu, Linxiang flood-dragon victims were relieved.',
  ],
  s0119: [
    'Thirty thousand taels were allocated to buy granary grain against drought at Changde and Hengzhou.',
    'Thirty thousand taels were set aside to buy grain for Changde and Hengzhou drought relief.',
  ],
  s0120: [
    'On day renxu, the Dutch envoy Kroebel was received at the Wenhua Hall.',
    'On renxu, the Dutch envoy Kroebel was received at Wenhua Hall.',
  ],
  s0121: [
    'On day guihai, Subdirector of the Imperial Clan Wu Tingfen was also appointed to serve at the Office for the General Management of Affairs with Foreign Countries.',
    'On guihai, Wu Tingfen was also made an officer of the Foreign Affairs Office.',
  ],
  s0122: [
    'On day bingyin, the Tashi Lama from Tibet came to the capital to attend the tombs and presented tribute.',
    'On bingyin, Tibet\'s Tashi Lama came to the capital for tomb rites and sent tribute.',
  ],
  s0123: [
    'Jieyang, Chaoyang, Puning, and other counties were shaken by earthquake.',
    'Jieyang, Chaoyang, Puning, and other counties had an earthquake.',
  ],
  s0124: [
    'Tenth month, day xinwei: Yang Changjun was dismissed and Tao Mo was made acting governor-general of Shaanxi-Gansu.',
    'Month 10, xinwei: Yang Changjun was dismissed and Tao Mo became acting Shaanxi-Gansu governor-general.',
  ],
  s0125: [
    'On day xinsi, Li Hongzhang exchanged with the Japanese envoy the treaty for the return of Liaodong.',
    'On xinsi, Li Hongzhang exchanged the Liaodong restoration treaty with Japan.',
  ],
  s0126: [
    'On day jiashen, Chang Lin and Wang Mingluan were stripped for reckless speech at imperial audience.',
    'On jiashen, Chang Lin and Wang Mingluan were dismissed for rash words at audience.',
  ],
  s0127: [
    'On day jichou, the new army was first established and Yuan Shikai at Wenzhou Circuit was ordered to drill it.',
    'On jichou, the new army was created with Yuan Shikai ordered to train it at Wenzhou.',
  ],
  s0128: [
    'On day bingshen, Jiangchuan\'s disaster field tax was remitted for two years.',
    'On bingshen, Jiangchuan disaster-field tax was remitted for two years.',
  ],
  s0129: [
    'Water and drought victims in Heqing and other districts were relieved.',
    'Heqing and other districts received flood and drought relief.',
  ],
  s0130: [
    'Eleventh month, day yiyou, first day: the breach at Zhao Jiakou in Shandong was closed.',
    'Month 11, yiyou: Shandong\'s Zhao Jiakou breach was closed.',
  ],
  s0131: [
    'On day dingwei, quota levies on flooded official estates at Shengjing were remitted.',
    'On dingwei, Shengjing flooded official-estate quota tax was remitted.',
  ],
  s0132: [
    'On day wushen, eighty thousand shi of Henan\'s tribute grain conversion were retained for works and relief in Neihuang and other counties.',
    'On wushen, eighty thousand shi of Henan tribute conversion were kept for Neihuang works and relief.',
  ],
  s0133: [
    'On day jiyou, Hubei Provincial Treasurer Wang Zhichun was appointed congratulatory envoy for the Russian emperor\'s coronation.',
    'On jiyou, Wang Zhichun was sent as envoy to congratulate the Russian coronation.',
  ],
  s0134: [
    'On day gengxu, two years of field tax for banner folk in war-struck Fengtian districts were remitted, along with accumulated arrears.',
    'On gengxu, Fengtian banner folk in war districts had two years of field tax and arrears remitted.',
  ],
  s0135: [
    'On day guichou, Liu Yongfu was dismissed.',
    'On guichou, Liu Yongfu was dismissed.',
  ],
  s0136: [
    'On day guihai, Gansu Regional Commander Li Peirong was stripped for lingering on the way to aid Xining.',
    'On guihai, Li Peirong was dismissed for delay en route to aid Xining.',
  ],
  s0137: [
    'On day yichou, Dong Fuxiang was made Gansu regional commander and still commanded the Gansu Army; all former front-line generals were placed under him.',
    'On yichou, Dong Fuxiang became Gansu regional commander, still commanding the Gansu Army and all former front generals.',
  ],
  s0138: [
    'Flood-dragon victims at Baoshan were relieved.',
    'Baoshan flood-dragon victims were relieved.',
  ],
  s0139: [
    'Twelfth month, day wuyin: the breach at Shouzhang was closed.',
    'Month 12, wuyin: the Shouzhang breach was closed.',
  ],
  s0140: [
    'On day gengchen, sixty thousand taels from the treasury were set aside for Hubei\'s spring relief.',
    'On gengchen, sixty thousand taels were allocated for Hubei spring relief.',
  ],
  s0141: [
    'On day guisi, Li Hongzhang was reassigned as envoy to Russia with Shao Youlian as deputy.',
    'On guisi, Li Hongzhang was made envoy to Russia with Shao Youlian as deputy.',
  ],
  s0142: [
    'This month, Shaanxi\'s prior-year arrears, Fengtian\'s prior-year reed tax, and official-estate grain taxes were remitted.',
    'This month, Shaanxi arrear taxes, Fengtian reed tax, and official-estate grain tax were remitted.',
  ],
  s0143: [
    'Victims at Shengjing and Pingxiang were relieved.',
    'Shengjing and Pingxiang disaster victims were relieved.',
  ],
  s0144: [
    'One hundred thousand taels each were sent to relieve disaster in Hunan, Yunnan, and Shaanxi.',
    'One hundred thousand taels each went to Hunan, Yunnan, and Shaanxi disaster relief.',
  ],
  s0145: [
    'In the twenty-second year, bingchen, spring, first month, day bingchen, first day: banquets were suspended.',
    'Year 22, spring 1, bingchen: court banquets were suspended.',
  ],
  s0146: [
    'On day dingyou, because Li Hongzhang was specially sent as envoy to Russia, Shao Youlian and Wang Zhichun were told not to go.',
    'On dingyou, Shao Youlian and Wang Zhichun were told not to go since Li Hongzhang was sent to Russia.',
  ],
  s0147: [
    'On day jihai, victims of flood and drought in Changsha and other prefectures were relieved.',
    'On jihai, Changsha and other prefectures received flood and drought relief.',
  ],
  s0148: [
    'On day yimao, envoys of all nations were received at the Wenhua Hall.',
    'On yimao, foreign envoys were received at Wenhua Hall.',
  ],
  s0149: [
    'On day gengshen, Feng Zicai was ordered back to Guangdong to oversee defenses at Qin and Lian.',
    'On gengshen, Feng Zicai returned to Guangdong to oversee Qin and Lian defenses.',
  ],
  s0150: [
    'Second month, day gengwu: the Oirat commandant at Tarbagatai was moved to Brunbrak and the Chahar commandant at Ili to Borotala.',
    'Month 2, gengwu: the Tarbagatai Oirat commandant moved to Brunbrak and the Ili Chahar commandant to Borotala.',
  ],
  s0151: [
    'On day renshen, postal union with foreign states was first discussed.',
    'On renshen, union with foreign postal systems was first discussed.',
  ],
  s0152: [
    'The Longzhou railway was opened.',
    'The Longzhou railway opened.',
  ],
  s0153: [
    'Liu Mingchuan died.',
    'Liu Mingchuan died.',
  ],
  s0154: [
    'On day dinghai, the Ministry of Revenue burned.',
    'On dinghai, the Ministry of Revenue burned.',
  ],
  s0155: [
    'Third month, day wuxu: E Le He Bu retired.',
    'Month 3, wuxu: E Le He Bu retired.',
  ],
  s0156: [
    'On day guimao, the commercial port at Hangzhou was opened.',
    'On guimao, Hangzhou commercial port opened.',
  ],
  s0157: [
    'On day dingwei, Wang Wenshao and Zhang Zhidong were ordered to oversee the Lu-Han Railway.',
    'On dingwei, Wang Wenshao and Zhang Zhidong were ordered to oversee the Lu-Han Railway.',
  ],
  s0158: [
    'On day xinyou, Hui bandits menaced Zhuludos.',
    'On xinyou, Hui bandits threatened Zhuludos.',
  ],
  s0159: [
    'On day guihai, Dong Fuxiang was stationed at Xining to suppress and pacify exclusively; Wei Guangtao returned to station at Hezhou and was soon told to resume as Shaanxi governor.',
    'On guihai, Dong Fuxiang was posted to Xining for suppression while Wei Guangtao returned to Hezhou and soon resumed as Shaanxi governor.',
  ],
  s0160: [
    'Summer, fourth month, day renshen: fire at the Bodhisattva Peak on Wutai Mountain.',
    'Month 4, renshen: Wutai Mountain\'s Bodhisattva Peak burned.',
  ],
  s0161: [
    'On day yihai, summer grain at Kunming and Qiubei was remitted.',
    'On yihai, Kunming and Qiubei summer grain tax was remitted.',
  ],
  s0162: [
    'On day xinsi, Rong Lu was sent to Tianjin to review the new army.',
    'On xinsi, Rong Lu went to Tianjin to inspect the new army.',
  ],
  s0163: [
    'On day wuzi, Kun Gang was made a titular Grand Secretary; Rong Lu became an associate grand secretary while retaining his post as Minister of War.',
    'On wuzi, Kun Gang became titular grand secretary and Rong Lu associate grand secretary while remaining Minister of War.',
  ],
  s0164: [
    'Fifth month, day dingyou: an edict told Li Bingheng to audit county grain levies and reduce excess collection.',
    'Month 5, dingyou: Li Bingheng was told to audit county grain levies and cut excess collection.',
  ],
  s0165: [
    'Disaster levies at En\'an were remitted.',
    'En\'an disaster levies were remitted.',
  ],
  s0166: [
    'On day xinchou, the Confucian temple at Zhengzhou burned.',
    'On xinchou, Zhengzhou\'s Confucian temple burned.',
  ],
  s0167: [
    'This month, the emperor repeatedly accompanied the empress dowager to the mansion of the Prince Regent Chun to visit the prince\'s consort, who was ill.',
    'This month, the emperor repeatedly went with the empress dowager to Prince Chun\'s mansion to visit his ill consort.',
  ],
  s0168: [
    'On day guimao, the consort of Prince Chun the Esteemed, of the Yehe Nara clan, died; court was suspended eleven days; the emperor and empress dowager went to the mansion for encoffining and returned the next day for mourning sacrifices.',
    'On guimao, Prince Chun the Esteemed\'s Yehe Nara consort died; court halted eleven days; the emperor and empress dowager encoffined her and mourned again next day.',
  ],
  s0169: [
    'An empress dowager\'s rescript said that with the death of the consort of Prince Chun the Esteemed she should be styled "the emperor\'s biological mother."',
    'A rescript styled Prince Chun the Esteemed\'s late consort "the emperor\'s biological mother."',
  ],
  s0170: [
    'On day yisi, the emperor left mourning dress.',
    'On yisi, the emperor ended mourning dress.',
  ],
  s0171: [
    'On day renzi, Anhui\'s accumulated arrear taxes were remitted.',
    'On renzi, Anhui accumulated arrear taxes were remitted.',
  ],
  s0172: [
    'On day jiazi, the Oroqen tribute of sable pelts was postponed.',
    'On jiazi, Oroqen sable tribute was postponed.',
  ],
  s0173: [
    'Sixth month, day bingyin: an edict told Kui Shun to comfort Qinghai Mongols.',
    'Month 6, bingyin: Kui Shun was told to comfort Qinghai Mongols.',
  ],
  s0174: [
    'On day dingmao, the Yellow River broke at Lijin.',
    'On dingmao, the Yellow River broke at Lijin.',
  ],
  s0175: [
    'On day wuchen, Zhejiang\'s accumulated salt-works and salt-tax arrears were remitted.',
    'On wuchen, Zhejiang salt-works and salt-tax arrears were remitted.',
  ],
  s0176: [
    'On day gengwu, victims of Zhejiang\'s wind disaster were relieved.',
    'On gengwu, Zhejiang wind-disaster victims were relieved.',
  ],
  s0177: [
    'On day renshen, the golden coffin of the prince\'s consort was moved; the emperor went in person to see it off.',
    'On renshen, the prince\'s consort\'s golden coffin was moved and the emperor saw it off in person.',
  ],
  s0178: [
    'On day jiaxu, the emperor and empress dowager went to the Prince Chun\'s garden residence to mourn before the golden coffin.',
    'On jiaxu, the emperor and empress dowager mourned before the consort\'s golden coffin at Prince Chun\'s garden.',
  ],
  s0179: [
    'On day jimao, an edict ordered the Yangtze naval forces reorganized.',
    'On jimao, Yangtze naval forces were ordered reorganized.',
  ],
  s0180: [
    'On day renwu, Yu Lu was additionally appointed Superintendent of the Navy.',
    'On renwu, Yu Lu was also made Superintendent of the Navy.',
  ],
  s0181: [
    'On day bingxu, Songpan tribes rebelled and government troops pacified them.',
    'On bingxu, Songpan tribes rebelled and were pacified.',
  ],
  s0182: [
    'On day dinghai, at the princes\' request, the Shenji Battalion drill office was allowed to train troops in Western style.',
    'On dinghai, the Shenji drill office was allowed Western-style training at princes\' request.',
  ],
  s0183: [
    'On day xinmao, the Yongding River overflowed.',
    'On xinmao, the Yongding River overflowed.',
  ],
  s0184: [
    'This month, victims of the Great East Ditch sea flood and flood-dragon disasters in Anhui and Hubei were relieved.',
    'This month, Great East Ditch sea-flood and Anhui-Hubei flood-dragon victims were relieved.',
  ],
  s0185: [
    'Autumn, seventh month, day jiawu, first day: there was an eclipse of the sun.',
    'Month 7, jiawu: a solar eclipse occurred.',
  ],
  s0186: [
    'On day dingyou, water in southeastern Zhili; Sun Jia\'nai and others were ordered to prepare relief quickly.',
    'On dingyou, southeastern Zhili flooded and Sun Jia\'nai was told to prepare relief quickly.',
  ],
  s0187: [
    'On day yisi, one hundred thousand shi of southern tribute grain were kept at Tianjin for relief.',
    'On yisi, one hundred thousand shi of southern tribute grain were kept at Tianjin for relief.',
  ],
  s0188: [
    'Eighth month, day yichou: as Hui bandits inside and outside the passes were gradually pacified, Tao Mo and Dong Fuxiang were told to settle those who surrendered and hunt down remnants.',
    'Month 8, yichou: as Hui bandits were pacified, Tao Mo and Dong Fuxiang were told to settle surrenders and hunt remnants.',
  ],
  s0189: [
    'On day jisi, Sichuan troops campaigning in Drayag took successive passes and advanced on central Drayag.',
    'On jisi, Sichuan troops in Drayag took passes and advanced on central Drayag.',
  ],
  s0190: [
    'On day gengchen, an edict to Lu Chuanlin said: "Using troops in Drayag is only a temporary measure.',
    'On gengchen, Lu Chuanlin was told: "Drayag campaigning is only temporary.',
  ],
  s0191: [
    'After affairs are settled, whether Tibetan officials should still be appointed must be reconsidered.',
    'Whether Tibetan officials should remain must be reconsidered after settlement.',
  ],
  s0192: [
    'Do not on that account harshly blame the lamas and provoke new trouble; do not act rashly."',
    'Do not harshly blame lamas and provoke new trouble; do not act rashly."',
  ],
  s0193: [
    '" On day jichou, an edict told the Ministry of Punishments to conclude trials swiftly and not delay.',
    'On jichou, the Ministry of Punishments was told to conclude trials swiftly without delay.',
  ],
  s0194: [
    'On day renchen, the provinces were forbidden to use illegal torture at will.',
    'On renchen, provinces were forbidden to use illegal torture at will.',
  ],
  s0195: [
    'Ninth month, day bingshen: Fu Kun died.',
    'Month 9, bingshen: Fu Kun died.',
  ],
  s0196: [
    'Shaanxi\'s prior-year arrear taxes were remitted.',
    'Shaanxi prior-year arrear taxes were remitted.',
  ],
  s0197: [
    'On day jihai, insects ravaged the Eastern Tombs.',
    'On jihai, insects ravaged the Eastern Tombs.',
  ],
  s0198: [
    'On day bingwu, Sheng Xuanhuai was given fourth-rank kuotang status.',
    'On bingwu, Sheng Xuanhuai received fourth-rank kuotang status.',
  ],
  s0199: [
    'Earlier, Wang Wenshao and Zhang Zhidong had asked to establish a China Merchants Steam Navigation Company with Sheng Xuanhuai as superintendent.',
    'Earlier, Wang Wenshao and Zhang Zhidong proposed a China Merchants Steam Navigation Company under Sheng Xuanhuai.',
  ],
  s0200: [
    'Now the decree came down, and he was allowed memorials on his own authority.',
    'Now the decree came down, and he was allowed to memorialize on his own authority.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b02.mjs <translation.json>'
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
