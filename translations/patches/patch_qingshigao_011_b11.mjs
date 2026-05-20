#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day guiwei, Guards commander-in-chief Talerima Shan and vice banner commander Zalehang\'a were made campaign assistant commissioners for the Northern Route army camp.',
    'On guiwei day, Talerima Shan and Zalehang\'a became Northern Route campaign assistants.',
  ],
  s1002: [
    'On day bingxu, because the Uriankhai Balang had fled, Chebudeng was demoted to beizi; campaign assistant commissioners Anchong\'a and De\'ning were sentenced to decapitation after deliberation.',
    'On bingxu day, Chebudeng was demoted and Anchong\'a and De\'ning were condemned to death over Balang\'s flight.',
  ],
  s1003: [
    'On day dingyou, Amursana led his tribesmen in submission; Sarhula was ordered to welcome and entertain them.',
    'On dingyou day, Amursana submitted and Sarhula was sent to receive him.',
  ],
  s1004: [
    'On day jihai, the Emperor halted at the great camp east of the Zhangwu Terrace River and received the Empress Dowager in the traveling quarters.',
    'On jihai day, the court halted east of Zhangwu Terrace and lodged the Empress Dowager.',
  ],
  s1005: [
    'On day gengzi, Khalkha taiji Danbazhab was found to have missed his opportunity and ordered executed.',
    'On gengzi day, Danbazhab was executed for military failure.',
  ],
  s1006: [
    'Cewang, Suhede, Sebten, and Sarhula were summoned to the capital; Erechin Dorji was made acting general and Zhaohui campaign assistant commissioner.',
    'Cewang, Suhede, Sebten, and Sarhula were recalled; Erechin Dorji became acting general and Zhaohui campaign assistant.',
  ],
  s1007: [
    'On day renyin, Amursana was ordered to come to court for audience.',
    'On renyin day, Amursana was summoned to audience.',
  ],
  s1008: [
    'On day bingwu, Bandi was made Minister of War and acting Left Deputy General for Pacifying the Frontier.',
    'On bingwu day, Bandi became Minister of War and acting Left Deputy Frontier General.',
  ],
  s1009: [
    'Aligun was made commander of the Metropolitan Banner Infantry.',
    'Aligun became commander of the Metropolitan Banner Infantry.',
  ],
  s1010: [
    'Flood disaster in Xinghua and other districts of Jiangsu was relieved.',
    'Jiangsu flood districts including Xinghua were relieved.',
  ],
  s1011: [
    'Eighth month, day xinhai: Yang Yingju was appointed governor-general of Liangguang.',
    'In the eighth month, Yang Yingju became Liangguang governor-general.',
  ],
  s1012: [
    'On day guichou, Daledang\'a was ordered to be Heilongjiang general.',
    'On guichou day, Daledang\'a was made Heilongjiang general.',
  ],
  s1013: [
    'On day jiayin, the Emperor halted the progress at Jilin.',
    'On jiayin day, the court halted at Jilin.',
  ],
  s1014: [
    'On day yimao, the Emperor went to Wendehun Mountain to perform distant-sacrifice rites toward Changbai Mountain and the Songhua River.',
    'On yimao day, the Emperor sacrificed from Wendehun toward Changbai and the Songhua.',
  ],
  s1015: [
    'On day dingsi, E Rong\'an was summoned to the traveling court; Yin Jishan was made acting governor-general of Liangjiang.',
    'On dingsi day, E Rong\'an was recalled and Yin Jishan became acting Liangjiang governor-general.',
  ],
  s1016: [
    'On day jiwei, flood disaster in Qiqihar and two other cities was relieved.',
    'On jiwei day, Qiqihar and two other cities received flood relief.',
  ],
  s1017: [
    'On day gengshen, drought disaster in Gaolan and four other prefectures and counties of Gansu was relieved.',
    'On gengshen day, drought relief reached five Gansu districts including Gaolan.',
  ],
  s1018: [
    'On day bingyin, the Emperor inspected Huifa city.',
    'On bingyin day, the Emperor inspected Huifa.',
  ],
  s1019: [
    'On day dingmao, Amursana was ordered to move his nomadic pastures to the Ergun and Tamir.',
    'On dingmao day, Amursana was told to pasture at the Ergun and Tamir.',
  ],
  s1020: [
    'On day guiyou, Cering Mongke together with Cering Ubashi and Nemuku were made campaign assistant commissioners for the Western Route.',
    'On guiyou day, Cering Mongke, Cering Ubashi, and Nemuku became Western Route campaign assistants.',
  ],
  s1021: [
    'On day yihai, the Northern Route had Daledang\'a, Uleden, Nusan, and Zhaohui as campaign assistant commissioners; the Western Route had Sarhula, Alantai, and Yubao as campaign assistant commissioners.',
    'On yihai day, Northern Route assistants were Daledang\'a, Uleden, Nusan, and Zhaohui; Western Route assistants Sarhula, Alantai, and Yubao.',
  ],
  s1022: [
    'Ninth month, new moon on day dingchou: tide disaster at salt-fields including Jiaoxie in the Two Huai region was relieved.',
    'In the ninth month, Two Huai salt-fields hit by tide received relief.',
  ],
  s1023: [
    'On day xinsi, the Emperor, accompanying the Empress Dowager and leading the Empress, visited Yong Mausoleum.',
    'On xinsi day, the Emperor with the Empress Dowager and Empress visited Yong Mausoleum.',
  ],
  s1024: [
    'Sarhula and others campaigned against the Uriankhai.',
    'Sarhula led troops against the Uriankhai.',
  ],
  s1025: [
    'On day jiashen, quota land taxes were remitted for fifteen prefectures and counties of Gansu including Gaolan that suffered flood and hail.',
    'On jiashen day, flood and hail taxes were remitted in fifteen Gansu districts including Gaolan.',
  ],
  s1026: [
    'Zhaoling and Fuling mausoleums were visited.',
    'The Emperor visited Zhaoling and Fuling.',
  ],
  s1027: [
    'On day dinghai, the Emperor, accompanying the Empress Dowager, halted the progress at Mukden.',
    'On dinghai day, the court with the Empress Dowager halted at Mukden.',
  ],
  s1028: [
    'On day wuwu, the Emperor led the civil and military officials to the Empress Dowager\'s palace to perform congratulatory rites.',
    'On wuwu day, officials congratulated the Empress Dowager.',
  ],
  s1029: [
    'At Chongzheng Hall the Emperor received congratulations.',
    'Congratulations were received at Chongzheng Hall.',
  ],
  s1030: [
    'Poll taxes for the current year in jurisdictions subordinate to Fengtian Fu were remitted.',
    'Fengtian poll taxes for the year were remitted.',
  ],
  s1031: [
    'From outside Shanhaiguan and places including Ningguta, completed and pending capital cases were all reduced one grade; military exile and below were wholly forgiven.',
    'Outside Shanhaiguan and at Ningguta, capital sentences were reduced and lesser punishments forgiven.',
  ],
  s1032: [
    'The King of Korea, Li Yin, sent envoys to Mukden with tribute offerings.',
    'Korean King Li Yin sent tribute envoys to Mukden.',
  ],
  s1033: [
    'On day jichou, the autumn judicial executions of this year were halted.',
    'On jichou day, autumn executions were suspended.',
  ],
  s1034: [
    'On day xinmao, the Emperor visited the Confucian temple.',
    'On xinmao day, the Emperor visited the Confucian temple.',
  ],
  s1035: [
    'On day guisi, the Emperor presided at Dazheng Hall; Mukden imperial clansmen, jueluo, and generals presented imperial meals.',
    'On guisi day, at Dazheng Hall Mukden clansmen and generals presented imperial meals.',
  ],
  s1036: [
    'On day jiawu, the Emperor, accompanying the Empress Dowager and leading the Empress, returned from Mukden.',
    'On jiawu day, the court left Mukden with the Empress Dowager and Empress.',
  ],
  s1037: [
    'On day jihai, quota land taxes were reduced for four counties of Zhili including Wuqing.',
    'On jihai day, quota taxes were cut in four Zhili counties including Wuqing.',
  ],
  s1038: [
    'On day xinchou, Bandi was made Left Deputy General for Pacifying the Frontier and E Rong\'an campaign assistant commissioner.',
    'On xinchou day, Bandi became Left Deputy Frontier General and E Rong\'an campaign assistant.',
  ],
  s1039: [
    'On day guimao, Cering Ubashi, Nemuku, Cering Mongke, and others were ordered to the Western Route to serve above the campaign assistant commissioners; Khalkha princes including Bayarshidi were ordered to the Northern Route army camp to lead detachments above ordinary duty.',
    'On guimao day, western princes were posted above campaign assistants and Khalkha princes led northern detachments.',
  ],
  s1040: [
    'Winter, tenth month, day guichou: flood disaster in sixteen prefectures, counties, and guards of Shandong including Huimin, and three salt-fields including Yonghe, was relieved.',
    'In the tenth month, Shandong floods and three salt-fields including Yonghe were relieved.',
  ],
  s1041: [
    'On day jiayin, Wei Zhezhi was transferred to be Guangxi governor; E Leshun Anhui governor; Zhou Renji was made Zhejiang governor.',
    'On jiayin day, Wei Zhezhi went to Guangxi, E Leshun to Anhui, and Zhou Renji to Zhejiang.',
  ],
  s1042: [
    'On day yimao, this year\'s flood disaster in nineteen prefectures, counties, and guards of Anhui including Shouzhou, and hail disaster in Mayi, Shanxi, were relieved.',
    'On yimao day, Anhui floods and Shanxi hail at Mayi were relieved.',
  ],
  s1043: [
    'On day bingchen, the Emperor, accompanying the Empress Dowager, returned to the palace.',
    'On bingchen day, the court returned to the palace with the Empress Dowager.',
  ],
  s1044: [
    'On day wuwu, the Emperor presided at the Hall of Supreme Harmony and received from princes downward the civil and military officials\' memorial tables of congratulation.',
    'On wuwu day, officials offered congratulatory memorials at the Hall of Supreme Harmony.',
  ],
  s1045: [
    'On day jiwei, Minister of Works Wang Youdun was put in charge of the Ministry of Justice.',
    'On jiwei day, Wang Youdun took charge of the Ministry of Justice.',
  ],
  s1046: [
    'On day xinyou, flood disaster in sixteen prefectures, counties, and guards of Jiangsu including Funing was relieved, and land-tax quotas were remitted in varying degrees.',
    'On xinyou day, Jiangsu floods were relieved and taxes remitted in varying degrees.',
  ],
  s1047: [
    'On day xinwei, three thousand metropolitan Manchu soldiers were moved to garrison and open farmland at Alechuke and other posts; one vice banner commander and one assistant commander were added.',
    'On xinwei day, three thousand Manchu troops were sent to farm at Alechuke and command posts were increased.',
  ],
  s1048: [
    'On day gengwu, Erimida was made acting Minister of Personnel.',
    'On gengwu day, Erimida became acting Minister of Personnel.',
  ],
  s1049: [
    'Eleventh month, day wuyin: wind disaster in two counties of Fujian including Zhuluo was relieved.',
    'In the eleventh month, Fujian wind damage in Zhuluo and one other county was relieved.',
  ],
  s1050: [
    'The Emperor visited the Southern Park.',
    'The Emperor went to the Southern Park.',
  ],
  s1051: [
    'The King of Sulu sent envoys with native products as tribute.',
    'Sulu sent tribute envoys with local goods.',
  ],
  s1052: [
    'Dzungar Khorchin taiji Abudashi came to submit.',
    'Dzungar taiji Abudashi surrendered.',
  ],
  s1053: [
    'On day gengchen, hungry people in fifteen districts of Shuntian Zhili including Wuqing that suffered flood and hail were relieved, and quota land taxes were remitted in varying degrees.',
    'On gengchen day, flood and hail victims in fifteen Zhili districts were fed and taxes remitted.',
  ],
  s1054: [
    'On day yiyou, the Emperor visited the Mountain Resort for Avoiding Summer Heat.',
    'On yiyou day, the Emperor went to the Summer Mountain Resort.',
  ],
  s1055: [
    'On day dinghai, Khoshut taiji Amursana, Dorbod taiji Nemuku, and others led submitted peoples to welcome the imperial progress at Guangren Ridge.',
    'On dinghai day, Amursana, Nemuku, and others welcomed the Emperor at Guangren Ridge.',
  ],
  s1056: [
    'That day the Emperor summoned Amursana and others to audience, granted a banquet, and bestowed rewards in varying degrees.',
    'That day Amursana and others were received, banqueted, and rewarded.',
  ],
  s1057: [
    'On day wuzi, Amursana was enfeoffed as prince of the first degree; Nemuku and Banzhu\'er as princes of the second degree;',
    'On wuzi day, Amursana became a first-rank prince and Nemuku and Banzhu\'er second-rank princes;',
  ],
  s1058: [
    'Dorbod taijis Gundorji and Batubolot, and Khoshut taijis Zhamcen and Qimku\'er were made beile;',
    'Gundorji and Batubolot of the Dorbod and Zhamcen and Qimku\'er of the Khoshut became beile;',
  ],
  s1059: [
    'Dorbod taijis Butuxken, Erdeni, and Luolei Yunduan, and Khoshut taijis Dejiete, Pu\'erpu, and Keshike were made beizi;',
    'Butuxken, Erdeni, and Luolei Yunduan of the Dorbod and Dejiete, Pu\'erpu, and Keshike of the Khoshut became beizi;',
  ],
  s1060: [
    'Khoshut taiji Gendun Zhab and others, and Dorbod taiji Buyintegusi and others were made dukes;',
    'Gendun Zhab of the Khoshut and Buyintegusi of the Dorbod and others became dukes;',
  ],
  s1061: [
    'Dorbod taiji Ubashi and others, and Khoshut taiji Yishi and others were made first-rank taiji.',
    'Ubashi of the Dorbod and Yishi of the Khoshut and others became first-rank taiji.',
  ],
  s1062: [
    'Khoshut Prince Amursana was made Northern Route campaign assistant commissioner and Second-rank Prince Nemuku Western Route campaign assistant commissioner.',
    'Prince Amursana headed the Northern Route assistants and Prince Nemuku the Western Route.',
  ],
  s1063: [
    'Erechin Dorji was ordered Western Route campaign assistant commissioner; Bandi was summoned to the capital.',
    'Erechin Dorji took the Western Route and Bandi was recalled to Beijing.',
  ],
  s1064: [
    'Amursana was ordered acting general; imperial son-in-law Sebten Balzhur to assist.',
    'Amursana became acting general with Sebten Balzhur as aide.',
  ],
  s1065: [
    'Cewang was ordered to the Western Route army camp together with Cering Ubashi; Nemuku to the Northern Route army camp together with Amursana and Banzhu\'er.',
    'Cewang went west with Cering Ubashi; Nemuku north with Amursana and Banzhu\'er.',
  ],
  s1066: [
    'On day wuxu, the Emperor returned to Beijing.',
    'On wuxu day, the Emperor returned to Beijing.',
  ],
  s1067: [
    'Twelfth month, day wushen: Bandi was made Northern Pacification General; Amursana Left Deputy General for Pacifying the Frontier; Yongchang Western Pacification General; Sarhula Right Deputy General for Pacifying the Frontier.',
    'In the twelfth month, Bandi became Northern Pacification General, Amursana Left Deputy Frontier General, Yongchang Western Pacification General, and Sarhula Right Deputy Frontier General.',
  ],
  s1068: [
    'On day xinhai, the Emperor visited Grand Secretary Laibao and retired Grand Secretary Fumin at their homes to inquire after their illnesses.',
    'On xinhai day, the Emperor called on Laibao and the retired Fumin to ask after their health.',
  ],
  s1069: [
    'On day xinhai, Imperial Son-in-law Sebten Balzhur, prince-by-title Linchin, Second-rank Princes Nemuku and Banzhu\'er, prince-by-title Chinggunjab, Minister Duke Daledang\'a, Governor Duke E Rong\'an, and Guards commander-in-chief Uleden were made Northern Route campaign assistant commissioners; Prince Erechin Dorji, Cewang, Second-rank Prince Cering Ubashi, Beile Cering Mongke, Sebten, Beizi Zhalafenga, Dukes Batumengke and Mashibatu, and General Alantai were made Western Route campaign assistant commissioners.',
    'On xinhai day, Sebten Balzhur, Nemuku, Banzhu\'er, Daledang\'a, E Rong\'an, and Uleden became Northern Route assistants; Erechin Dorji, Cewang, Cering Ubashi, Cering Mongke, and Alantai Western Route assistants.',
  ],
  s1070: [
    'On day guihai, the King of Annam, Li Weiyi, presented native products.',
    'On guihai day, Annam\'s King Li Weiyi sent tribute goods.',
  ],
  s1071: [
    'Flood disaster in fifteen guards, prefectures, counties, and guards of Gansu including Hezhou was relieved.',
    'Gansu flood districts including Hezhou were relieved.',
  ],
  s1072: [
    'On day bingyin, E Rong\'an was transferred to Western Route campaign assistant commissioner; Alantai and Kuxin Mamuti were ordered Northern Route campaign assistant commissioners.',
    'On bingyin day, E Rong\'an went to the Western Route and Alantai and Kuxin Mamuti to the Northern Route.',
  ],
  s1073: [
    'Twentieth year, spring, first month, day dingchou: Left Deputy General for Pacifying the Frontier Amursana was ordered to lead campaign assistant commissioners Imperial Son-in-law Sebten Balzhur, Second-rank Prince Qinggunjab, Court Chamberlain Mamute, and Fengtian General Alantai on the Northern Route campaign; Right Deputy General Sarhula was to lead campaign assistant commissioners Second-rank Prince Banzhu\'er, Beile-by-rank Zhalafenga, and Court Chamberlain E Rong\'an on the Western Route campaign.',
    'In the twentieth year\'s first month, Amursana led the Northern Route with Sebten Balzhur, Qinggunjab, Mamute, and Alantai; Sarhula led the Western Route with Banzhu\'er, Zhalafenga, and E Rong\'an.',
  ],
  s1074: [
    'On day guiwei, Aligun was made acting Minister of Justice.',
    'On guiwei day, Aligun became acting Minister of Justice.',
  ],
  s1075: [
    'On day guimao, tribute levies of the Uriankhai, Zhahachin, Baoxin, and others were remitted for one year.',
    'On guimao day, Uriankhai and related peoples were exempted from tribute for one year.',
  ],
  s1076: [
    'Second month, new moon on day yisi: solar eclipse.',
    'In the second month, a solar eclipse occurred on the new moon.',
  ],
  s1077: [
    'Zhaohui was ordered to remain at Uliyasutai to assist in military affairs, serving above the leading-detachment commanders.',
    'Zhaohui stayed at Uliyasutai to assist operations above the leading commanders.',
  ],
  s1078: [
    'On day bingwu, Korea presented native products.',
    'On bingwu day, Korea sent tribute goods.',
  ],
  s1079: [
    'On day yimao, the Emperor visited the Eastern Mausoleum.',
    'On yimao day, the Emperor visited the Eastern Mausoleum.',
  ],
  s1080: [
    'On day wuwu, the Emperor visited Zhaoxiling, Xiaoling, Xiaodongling, and Jingling, and offered libation at Empress Xiaoxian\'s tomb.',
    'On wuwu day, the Emperor visited several imperial tombs and poured libation at Empress Xiaoxian\'s grave.',
  ],
  s1081: [
    'On day jiwei, Fan Shishou was summoned to the capital; Hu Baojian was transferred to Jiangxi governor; Yang Xizhen was made acting Hunan governor; Jiang Pu acting Minister of Personnel.',
    'On jiwei day, Fan Shishou was recalled; Hu Baojian became Jiangxi governor; Yang Xizhen acting Hunan governor; Jiang Pu acting Minister of Personnel.',
  ],
  s1082: [
    'Flood disaster in twelve prefectures, counties, and guards of Shandong including Huimin was relieved.',
    'Shandong flood districts including Huimin were relieved.',
  ],
  s1083: [
    'On day gengshen, Qilun of the Dzungar Galzuut tribe came to submit.',
    'On gengshen day, Qilun of the Dzungar Galzuut surrendered.',
  ],
  s1084: [
    'On day dingmao, earthquake victims in Yimen and Shiping, Yunnan, were relieved.',
    'On dingmao day, Yunnan earthquake victims at Yimen and Shiping were relieved.',
  ],
  s1085: [
    'On day jisi, victims of last year\'s disaster in Gaoyou and other districts of Jiangsu were relieved.',
    'On jisi day, last year\'s Jiangsu disaster victims in Gaoyou and elsewhere were relieved.',
  ],
  s1086: [
    'Third month, day bingzi: Yongchang and others memorialized that Ölöd Yeqimiyan Bayar had come to submit.',
    'In the third month, Yongchang reported that Ölöd Yeqimiyan Bayar had surrendered.',
  ],
  s1087: [
    'On day wuyin, quota land taxes were remitted for twenty-two prefectures, counties, and guards of Jiangsu including Jiangpu for the nineteenth year\'s flood disaster.',
    'On wuyin day, nineteenth-year flood taxes were remitted in twenty-two Jiangsu districts including Jiangpu.',
  ],
  s1088: [
    'On day jimao, the Emperor went to Tailing.',
    'On jimao day, the Emperor went to Tailing.',
  ],
  s1089: [
    'E Chang was summoned to the capital; Chen Hongmou was transferred to Gansu governor; Tai Zhu was made acting Shaanxi governor.',
    'E Chang was recalled; Chen Hongmou became Gansu governor and Tai Zhu acting Shaanxi governor.',
  ],
  s1090: [
    'On day renwu, the Emperor visited Tailing.',
    'On renwu day, the Emperor visited Tailing.',
  ],
  s1091: [
    'On day yiyou, the Emperor halted at Wujiazhuang and inspected the Yongding River dikes.',
    'On yiyou day, the court halted at Wujiazhuang to inspect Yongding River dikes.',
  ],
  s1092: [
    'On day bingxu, the Emperor went to Langying Terrace for a hunting encirclement and killed one bear and two tigers.',
    'On bingxu day, the Emperor hunted at Langying Terrace and killed one bear and two tigers.',
  ],
  s1093: [
    'Grand secretaries, the Nine Ministers, Hanlin and academicians, and censors were summoned; the Emperor instructed them on the rebellious verses of Hu Zhongzao, the printing by Zhang Taikai, the harmonies by E Chang, and other crimes, and ordered strict interrogation and sentencing proposals.',
    'Officials were summoned and told to try Hu Zhongzao\'s rebellious poetry, Zhang Taikai\'s printing, and E Chang\'s harmonies.',
  ],
  s1094: [
    'On day gengyin, the Emperor returned to Beijing.',
    'On gengyin day, the Emperor returned to Beijing.',
  ],
  s1095: [
    'E Chang was stripped of office and arrested for interrogation.',
    'E Chang was dismissed and arrested.',
  ],
  s1096: [
    'On day renchen, Gao Bin died.',
    'On renchen day, Gao Bin died.',
  ],
  s1097: [
    'Zhang Shizai was released to return home.',
    'Zhang Shizai was freed to go home.',
  ],
  s1098: [
    'On day yiwei, Demuqibahamanji of the Zhahachin and zaisang Dunduoke and others came to submit.',
    'On yiwei day, Zhahachin and zaisang leaders including Dunduoke surrendered.',
  ],
  s1099: [
    'On day gengzi, quota land taxes were remitted for six prefectures, counties, and guards of Zhili including Bazhou for this year\'s drought disaster.',
    'On gengzi day, drought taxes were remitted in six Zhili districts including Bazhou.',
  ],
  s1100: [
    'On day renyin, Dzungar taiji Galjadorji and others came to submit.',
    'On renyin day, Galjadorji and other Dzungar taijis surrendered.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b11.mjs <translation.json>'
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
