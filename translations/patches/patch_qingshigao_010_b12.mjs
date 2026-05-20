#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'Because of drought, punishments were ordered reduced and prohibitions relaxed.',
    'Drought prompted orders to lighten penalties and relax bans.',
  ],
  s1102: [
    'On day xinwei, drought relief was given to eight prefectures and counties including Deping in Shandong.',
    'On xinwei day, Shandong\'s Deping and seven other counties received drought relief.',
  ],
  s1103: [
    'On day jimao, an edict said: "Since spring, rain has been scarce.',
    'On jimao day, an edict said spring rains had been scarce.',
  ],
  s1104: [
    'The Empress Dowager, anxious over the long drought, walked today from her sleeping palace to the Dragon God Temple in the garden to pray devoutly.',
    'The Empress Dowager, troubled by prolonged drought, walked from her palace to the garden Dragon God Temple to pray.',
  ],
  s1105: [
    'I was filled with fear and trembling, went at once to pay my respects, earnestly begged forgiveness, and specially informed all officials inside and outside.',
    'The Emperor went at once to pay respects, apologized earnestly, and instructed all officials.',
  ],
  s1106: [
    '" On day wuzi, the earth was sacrificed to at Fangze, without riding the palanquin and without setting out the guard of honor.',
    'On wuzi day, earth sacrifice at Fangze was performed without palanquin or guard of honor.',
  ],
  s1107: [
    'On day gengyin, it rained.',
    'On gengyin day, rain fell.',
  ],
  s1108: [
    'On day renyin, Grand Secretaries and the Nine Ministers replied to Censor Chai Chaosheng\'s memorial requesting Zhili water works; Associate Grand Secretary Liu Yuyi was ordered to Baoding to plan with Gao Bin.',
    'On renyin day, officials replied on Zhili water works; Liu Yuyi was sent to Baoding with Gao Bin to plan.',
  ],
  s1109: [
    'Sixth month, day jiyou: Grand Secretary Xu Ben begged leave on illness; permission was granted.',
    'In the sixth month, Xu Ben retired ill and was allowed to leave.',
  ],
  s1110: [
    'On day guichou, drought relief was given to thirty-two prefectures and counties including Licheng in Shandong, and hail disaster relief to six prefectures and counties including Lanshan.',
    'On guichou day, Shandong drought and hail disasters in Lanshan and elsewhere were relieved.',
  ],
  s1111: [
    'Autumn, seventh month, first day bingzi: edict to Tianjin and fifteen other hard-hit Zhili prefectures and counties to halt collection of old and new taxes and grain for the year.',
    'In the seventh month, sixteen hard-hit Zhili districts were told to stop tax and grain levies for the year.',
  ],
  s1112: [
    'On day bingxu, arrears of the Yongzheng thirteenth year in Jiangsu and Anhui were remitted.',
    'On bingxu day, Jiangsu and Anhui\'s Yongzheng-era tax arrears were remitted.',
  ],
  s1113: [
    'On day renchen, E\'ertu was dismissed for incompetence; Daledang\'a was made Fengtian general.',
    'On renchen day, E\'ertu was dismissed and Daledang\'a became Fengtian general.',
  ],
  s1114: [
    'Eighth month, day jiyou: consolation and relief for flood in Shexian and nineteen other prefectures and counties in Anhui.',
    'In the eighth month, flood victims in twenty Anhui districts were consoled.',
  ],
  s1115: [
    'On day wushen, arrears of Yongzheng thirteenth year in Huai\'an prefecture, Jiangsu, and Fengyang prefecture, Anhui, were remitted.',
    'On wushen day, Huai\'an and Fengyang\'s Yongzheng tax arrears were remitted.',
  ],
  s1116: [
    'On day guichou, flood relief was given to Chengdu and other prefectures and counties in Sichuan.',
    'On guichou day, Sichuan flood districts including Chengdu were relieved.',
  ],
  s1117: [
    'On day yichou, retired Grand Secretary Xu Ben returned home; the Emperor bestowed a poem to honor his departure, added generous gifts, and ordered that when touring the Southern Park he would visit in person to console him.',
    'On yichou day, Xu Ben went home with imperial poetry and gifts; the Emperor would visit him when touring the Southern Park.',
  ],
  s1118: [
    'On day bingyin, last year\'s tax arrears in Tianjin and thirty other Zhili prefectures and counties were remitted.',
    'On bingyin day, tax arrears were remitted in thirty-one Zhili districts including Tianjin.',
  ],
  s1119: [
    'On day jisi, the Emperor accompanied the Empress Dowager to the Southern Park and went on a hunting encampment tour.',
    'On jisi day, the Emperor took the Empress Dowager to the Southern Park and hunted.',
  ],
  s1120: [
    'Ninth month, first day jihai: Hanlin Compiler Huang Timing\'s submitted lecture chapter, touching on excessively strict searches, implicitly satirized; the ministry was ordered to investigate strictly and strip office.',
    'In the ninth month, Huang Timing was dismissed after a lecture chapter satirized strict searches.',
  ],
  s1121: [
    'On day yiwei, this year\'s assessed tax for hail disaster in Qingshui River, Shanxi, was remitted.',
    'On yiwei day, Shanxi hail-damaged districts\' taxes were remitted.',
  ],
  s1122: [
    'On day guimao, drought relief was given to Boxing and other counties in Shandong.',
    'On guimao day, Shandong drought counties including Boxing were relieved.',
  ],
  s1123: [
    'On day dingwei, next year\'s metropolitan examination was moved to the third month.',
    'On dingwei day, the next metropolitan exam was set for the third month.',
  ],
  s1124: [
    'On day jiyou, Chen Shiguan\'s leave expired; he was ordered to enter the Grand Secretariat to handle affairs.',
    'On jiyou day, Chen Shiguan returned from leave to serve in the Grand Secretariat.',
  ],
  s1125: [
    'Flood relief was given to Wenshui and other counties in Shanxi.',
    'Shanxi flood districts including Wenshui were relieved.',
  ],
  s1126: [
    'On day gengxu, Sichuan Education Intendant Jiang Wei was kept in office for conscientious instruction of scholars.',
    'On gengxu day, Jiang Wei was kept as Sichuan education intendant for devoted teaching.',
  ],
  s1127: [
    'On day yimao, the Emperor accompanied the Empress Dowager to Tangshan.',
    'On yimao day, the Emperor took the Empress Dowager to Tangshan.',
  ],
  s1128: [
    'Locusts in Jiangnan, Henan, and Shandong.',
    'Locusts plagued Jiangnan, Henan, and Shandong.',
  ],
  s1129: [
    'On day guihai, the Emperor visited Panshan.',
    'On guihai day, the Emperor visited Panshan.',
  ],
  s1130: [
    'On day dingmao, the Emperor accompanied the Empress Dowager back to the palace.',
    'On dingmao day, the Emperor and Empress Dowager returned to the palace.',
  ],
  s1131: [
    'On day gengwu, reconstruction of the Hanlin Academy was completed.',
    'On gengwu day, Hanlin Academy reconstruction was finished.',
  ],
  s1132: [
    'The Emperor visited the Hanlin Academy, bestowed a banquet, and assigned rhymes for poetry; he also composed the opening line of a Bo Liang-style poem for ministers to continue in turn.',
    'At the Hanlin banquet the Emperor set rhymes and the opening Bo Liang verse for ministers to continue.',
  ],
  s1133: [
    'Plaques with imperial calligraphy were bestowed on Chancellor Grand Secretaries Ortai and Zhang Tingyu, and books and silk to Hanlin and Daroga officials in graded amounts.',
    'Ortai and Zhang Tingyu received imperial inscribed plaques; other officials received graded gifts.',
  ],
  s1134: [
    'That day he visited the examination compound and bestowed paired scrolls with imperial writing.',
    'That day the Emperor visited the exam compound and gave inscribed scrolls.',
  ],
  s1135: [
    'He also visited Ziwei Hall and the Observatory.',
    'He also visited Ziwei Hall and the Observatory.',
  ],
  s1136: [
    'Relief for flood, insect, and hail disasters in Baoding and seventeen other Zhili prefectures and counties.',
    'Eighteen Zhili districts including Baoding received disaster relief.',
  ],
  s1137: [
    'Relief for tidal disaster in twelve Jiangsu prefectures, counties, and guards including Jingjiang, and flood in twenty-one Anhui districts including Shexian.',
    'Jiangsu tidal and Anhui flood districts were relieved.',
  ],
  s1138: [
    'On day gengchen, Sun Jiagan was recalled as vice director of the Imperial Clan Court.',
    'On gengchen day, Sun Jiagan became Imperial Clan Court vice director.',
  ],
  s1139: [
    'On day xinsi, land tax on flood-washed land in Zhuozhou and two other Zhili prefectures and counties was remitted.',
    'On xinsi day, tax on flood-washed Zhili land was remitted.',
  ],
  s1140: [
    'On day bingxu, Shandong Dengzhou garrison Commander Ma Shilong, for extorting levies from soldiers, was tried, facts established, and sentenced to strangulation.',
    'On bingxu day, Ma Shilong was sentenced to death for extorting his troops.',
  ],
  s1141: [
    'Relief for hail and flood in thirty-five Gansu prefectures, counties, and guards including Hezhou.',
    'Thirty-five Gansu districts received hail and flood relief.',
  ],
  s1142: [
    'On day xinmao, Jiangxi Education Intendant Jin Deying was kept for fair selection of scholars.',
    'On xinmao day, Jin Deying was kept for fair Jiangxi examinations.',
  ],
  s1143: [
    'On day jihai, Guizhou Education Intendant Tong Bao was kept for integrity in scholarly attire.',
    'On jihai day, Tong Bao was kept for upright conduct as Guizhou education intendant.',
  ],
  s1144: [
    'On day bingwu, Ortai replied on Liu Yuyi\'s memorial surveying Zhili water works; five hundred thousand taels of silver were ordered allocated for construction.',
    'On bingwu day, five hundred thousand taels were allocated for Zhili water works.',
  ],
  s1145: [
    'On day dingwei, assessed tax for drought in thirty-one Zhejiang prefectures and districts including Renhe was remitted and relief given.',
    'On dingwei day, Zhejiang drought taxes were remitted and relief distributed.',
  ],
  s1146: [
    'On day xinhai, flood relief for Chengdu and thirty prefectures and counties.',
    'On xinhai day, thirty Sichuan districts including Chengdu received flood relief.',
  ],
  s1147: [
    'On day renzi, Dzungar tribute envoys Haliu and others were permitted to trade cattle and sheep they brought at Suzhou.',
    'On renzi day, Dzungar envoys were allowed to trade livestock at Suzhou.',
  ],
  s1148: [
    'On day jiazi, this year\'s assessed tax for drought, hail, and other disasters in thirty-two Shandong districts including Licheng was remitted.',
    'On jiazi day, Shandong disaster taxes in thirty-two districts were remitted.',
  ],
  s1149: [
    'On day yichou, this year\'s disaster taxes in eleven Zhili districts including Baoding were remitted.',
    'On yichou day, eleven Zhili districts\' disaster taxes were remitted.',
  ],
  s1150: [
    'On day bingyin, Lei Chuo was given additional rank as Exhortation Tutor with salary.',
    'On bingyin day, Lei Chuo received Exhortation Tutor rank and salary.',
  ],
  s1151: [
    'On day wuchen, Zhang Zhao entered mourning; Wang Youdun was transferred to Minister of Justice, and Zhao Hong\'en made Minister of Works.',
    'On wuchen day, Zhang Zhao mourned; Wang Youdun and Zhao Hong\'en received ministerial posts.',
  ],
  s1152: [
    'Water disaster taxes in twenty-one Anhui districts including Shexian were remitted.',
    'Anhui flood taxes in twenty-one districts were remitted.',
  ],
  s1153: [
    'On day xinwei, because of fire in Minxian and other Fujian counties, frontier officials were rebuked for lax fire precautions.',
    'On xinwei day, Fujian officials were rebuked over fire in Minxian and elsewhere.',
  ],
  s1154: [
    'Luobuzangdanjin was captured.',
    'Luobuzangdanjin was taken prisoner.',
  ],
  s1155: [
    'Tenth year, spring, first month, day bingzi: Grand Secretaries and inner-court Hanlin were summoned to coupled verses at the Palace of Double Glory.',
    'In the tenth year, first month, Grand Secretaries and Hanlin composed coupled verses at Chonghua Palace.',
  ],
  s1156: [
    'The metropolitan examination was moved to the third month and made a standing rule.',
    'The metropolitan exam was permanently set for the third month.',
  ],
  s1157: [
    'On day yiwei, Grand Secretary Ortai begged to resign on illness; a warm edict comforted and kept him.',
    'On yiwei day, Ortai\'s resignation for illness was refused with comforting words.',
  ],
  s1158: [
    'On day jihai, Dzungars sent envoy Haliu with tribute goods.',
    'On jihai day, Dzungar envoy Haliu brought tribute.',
  ],
  s1159: [
    'On day gengzi, Gao Bin was summoned to the capital; Liu Yuyi acted as Zhili governor-general.',
    'On gengzi day, Gao Bin was recalled and Liu Yuyi acted Zhili governor-general.',
  ],
  s1160: [
    'On day jiyou, last year\'s flood in four Zhejiang counties including Chun\'an was relieved.',
    'On jiyou day, four Zhejiang counties received flood relief.',
  ],
  s1161: [
    'Korea sent tribute.',
    'Korea presented tribute.',
  ],
  s1162: [
    'On day xinhai, the Emperor visited Ortai\'s illness at his lodge inside the Right Inner Gate.',
    'On xinhai day, the Emperor visited the ailing Ortai.',
  ],
  s1163: [
    'On day jiwei, the Emperor paid respects at Zhaoxi, Xiao, Xiaodong, and Jing Mausoleums.',
    'On jiwei day, the Emperor visited the imperial mausoleums.',
  ],
  s1164: [
    'On day gengshen, last year\'s flood taxes in Haiyang and one other Guangdong county were remitted.',
    'On gengshen day, Guangdong flood taxes were remitted.',
  ],
  s1165: [
    'On day jiazi, last year\'s flood taxes in ten Jiangsu districts including Dantu were remitted.',
    'On jiazi day, Jiangsu flood taxes in ten districts were remitted.',
  ],
  s1166: [
    'On day dingmao, the Emperor returned to the capital.',
    'On dingmao day, the Emperor returned to Beijing.',
  ],
  s1167: [
    'On day jisi, drought taxes of Qianlong ninth year in Boxing and one other Shandong county were remitted.',
    'On jisi day, Shandong drought taxes from the ninth year were remitted.',
  ],
  s1168: [
    'On day gengwu, Gao Bin resumed as Zhili governor-general.',
    'On gengwu day, Gao Bin returned as Zhili governor-general.',
  ],
  s1169: [
    'Third month, first day guiyou: solar eclipse.',
    'In the third month, a solar eclipse occurred.',
  ],
  s1170: [
    'On day yihai, the palace examination was moved to the fourth month and made a standing rule.',
    'On yihai day, the palace exam was permanently set for the fourth month.',
  ],
  s1171: [
    'Flood relief for Baiyanjing, Yunnan.',
    'Yunnan\'s Baiyanjing received flood relief.',
  ],
  s1172: [
    'On day gengchen, the Emperor visited Ortai at his residence to see his illness.',
    'On gengchen day, the Emperor called on the ailing Ortai at home.',
  ],
  s1173: [
    'On day xinsi, Ortai was given the added title Grand Tutor.',
    'On xinsi day, Ortai was made Grand Tutor.',
  ],
  s1174: [
    'On day jichou, Associate Grand Secretary and Minister of Rites San Tai begged retirement; granted.',
    'On jichou day, San Tai retired and was allowed to leave.',
  ],
  s1175: [
    'On day gengyin, Prince Neqin was ordered to assist as Grand Secretary; Laibao was transferred to Minister of Rites, and Sheng\'an made Minister of Justice.',
    'On gengyin day, Neqin assisted the Grand Secretariat; Laibao and Sheng\'an received posts.',
  ],
  s1176: [
    'On day guisi, last year\'s drought taxes in thirty Zhejiang districts including Renhe were remitted.',
    'On guisi day, Zhejiang drought taxes were remitted.',
  ],
  s1177: [
    'On day jiawu, because Annam\'s Mo Kangwu rebelled and seized Taiyuan, Gaoping, and other places, Nasutu and others were ordered to guard the frontier strictly.',
    'On jiawu day, officials were ordered to guard the border after Mo Kangwu seized Annamese towns.',
  ],
  s1178: [
    'On day yiwei, Shi Yizhi, Chen Shiguan, Laibao, and Gao Bin were made Junior Grand Mentors of the Heir Apparent; Liu Yuyi, Zhang Yunsui, and Zhang Guangsi Junior Grand Preceptors.',
    'On yiwei day, several ministers received heir-apparent tutor ranks.',
  ],
  s1179: [
    'Summer, fourth month, first day guimao: five hundred sixty thousand taels from Jiangnan treasury were issued to dredge river channels.',
    'In the fourth month, 560,000 taels were sent from Jiangnan to dredge rivers.',
  ],
  s1180: [
    'On day jisi, assessed salt-works tax for drought in Haifeng and one other Shandong county was remitted.',
    'On jisi day, Shandong salt-field drought taxes were remitted.',
  ],
  s1181: [
    'On day yimao, Grand Secretary Ortai died; the Emperor attended the mourning, halted court two days, and ordered according to the Yongzheng emperor\'s testament that he share sacrifice in the Grand Temple.',
    'On yimao day, Ortai died; the Emperor mourned, halted court, and ordered him enshrined in the Grand Temple.',
  ],
  s1182: [
    'Nasutu was summoned to the capital; Celeng was made governor-general of Liangguang.',
    'Nasutu was recalled; Celeng became Liangguang governor-general.',
  ],
  s1183: [
    'Zhuntai was transferred to Guangdong governor.',
    'Zhuntai became Guangdong governor.',
  ],
  s1184: [
    'Wei Dingguo was made Anhui governor.',
    'Wei Dingguo became Anhui governor.',
  ],
  s1185: [
    'On day gengshen, Jiang Pu was summoned to the capital; Yang Xifu was made Hunan governor.',
    'On gengshen day, Jiang Pu was recalled and Yang Xifu became Hunan governor.',
  ],
  s1186: [
    'On day renxu, coastal provinces were ordered to train naval forces.',
    'On renxu day, coastal provinces were told to train their fleets.',
  ],
  s1187: [
    'On day guihai, because of drought the Ministry of Justice was ordered to clear routine prisons.',
    'On guihai day, drought prompted orders to clear routine cases in prison.',
  ],
  s1188: [
    'On day wuchen, palace examination was held for presented scholars; those able to understand current policy and remonstrate frankly were heard.',
    'On wuchen day, presented scholars were examined; frank remonstrance on policy was welcomed.',
  ],
  s1189: [
    'On day jisi, Qing Fu and Ji Shan memorialized advancing against the Dondup tribes.',
    'On jisi day, Qing Fu and Ji Shan reported advancing against Dondup tribes.',
  ],
  s1190: [
    'Fifth month, first day renshen: Qian Weicheng and three hundred thirty-two others were granted metropolitan doctoral ranks in graded order.',
    'In the fifth month, 333 graduates including Qian Weicheng received doctoral degrees.',
  ],
  s1191: [
    'On day dinghai, reed-tax on collapsed land in nine Jiangsu prefectures including Suzhou was remitted.',
    'On dinghai day, Jiangsu reed taxes on lost land were remitted.',
  ],
  s1192: [
    'The Emperor\'s essay admonishing scholars at the Imperial Academy was promulgated to provincial academies, to be lectured on new and full moons together with the Taizu stone inscription, Kangxi Sacred Edict, and Yongzheng Factionalism essay.',
    'An imperial essay on scholars was sent to provincial schools for monthly lectures with earlier dynastic texts.',
  ],
  s1193: [
    'Neqin was made Grand Secretary of the Hall of Preserving Harmony.',
    'Neqin became Grand Secretary of the Hall of Preserving Harmony.',
  ],
  s1194: [
    'On day xinmao, Minister of Revenue Arsai was killed by a household slave; the slave was dismembered in the marketplace.',
    'On xinmao day, Revenue Minister Arsai was killed by a slave who was executed by dismemberment.',
  ],
  s1195: [
    'Gao Bin was made Minister of Personnel; Nasutu was made Zhili governor-general.',
    'Gao Bin became Personnel Minister and Nasutu Zhili governor-general.',
  ],
  s1196: [
    'Gao Bin and Liu Yuyi were still ordered to manage Zhili water works and river channels.',
    'Gao Bin and Liu Yuyi remained in charge of Zhili waterways.',
  ],
  s1197: [
    'Liang Shizheng was made Minister of Revenue.',
    'Liang Shizheng became Minister of Revenue.',
  ],
  s1198: [
    'On day jihai, Liu Yuyi was ordered concurrently to manage Ministry of Revenue affairs.',
    'On jihai day, Liu Yuyi was also placed over Revenue Ministry business.',
  ],
  s1199: [
    'Sixth month, day dingwei: taxes and grain were universally remitted throughout the empire.',
    'In the sixth month, taxes and grain were remitted empire-wide.',
  ],
  s1200: [
    'An edict said: "I have ruled the empire for ten years now.',
    'An edict said the Emperor had ruled ten years.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b12.mjs <translation.json>'
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
