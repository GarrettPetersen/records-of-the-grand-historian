#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1301: [
    'On day yisi, Hui rebels rose at Tacheng.',
    'On yisi day, Hui rebels revolted at Tacheng.',
  ],
  s1302: [
    'Xilin asked leave for illness; he was dismissed and ordered to go to Ili under Mingxu\'s dispatch.',
    'Xilin took sick leave, was dismissed, and was sent to Ili under Mingxu.',
  ],
  s1303: [
    'Regional commander Tan Shengda was stripped of office for withholding soldiers\' grain but was still ordered to join Bao Chao\'s army.',
    'Tan Shengda lost his post for skimming rations but was ordered to Bao Chao\'s army.',
  ],
  s1304: [
    'Wulong\'e was made acting Tarbagatai assistant frontier commissioner.',
    'Wulong\'e became acting Tarbagatai commissioner.',
  ],
  s1305: [
    'On day dingwei, Barkol garrison commander Sepuxin led troops to aid Gucheng, met bandits, was defeated, and died.',
    'On dingwei day, Sepuxin died aiding Gucheng when his Barkol relief force was defeated.',
  ],
  s1306: [
    'On day jiyou, Fujian troops defeated entrenched bandits at Tingzhou and Liancheng.',
    'On jiyou day, Fujian troops defeated bandits at Tingzhou and Liancheng.',
  ],
  s1307: [
    'On day gengxu, Gansu troops drove back Hui rebels at Gulang and Pingfan.',
    'On gengxu day, Gansu troops repelled Hui rebels at Gulang and Pingfan.',
  ],
  s1308: [
    'On day xinhai, acceding to Prince Wang\'s request, Prince Gong was ordered to continue attendance in the inner court and to manage the Yamen for General Management of Foreign Affairs.',
    'On xinhai day, Prince Gong was kept in the inner court and put in charge of foreign affairs.',
  ],
  s1309: [
    'On day bingchen, an edict told Guan Wen to reduce troops and braves.',
    'On bingchen day, Guan Wen was ordered to cut troops and braves.',
  ],
  s1310: [
    'On day jiwei, Yang Yuebin was ordered to proceed to Gansu.',
    'On jiwei day, Yang Yuebin was sent to Gansu.',
  ],
  s1311: [
    'Shen Baozhen was in mourning for his mother; by edict his mourning was set aside and he acted as Jiangxi governor.',
    'Shen Baozhen\'s mourning was waived and he acted as Jiangxi governor.',
  ],
  s1312: [
    'On day xinyou, Xining Hui rebels rebelled again and took Datong.',
    'On xinyou day, Xining Hui rebels retook arms and seized Datong.',
  ],
  s1313: [
    'On day renxu, Guangxi troops recovered Yongchun.',
    'On renxu day, Guangxi troops recovered Yongchun.',
  ],
  s1314: [
    'On day guihai, Mao Changxi was ordered to return to the capital.',
    'On guihai day, Mao Changxi was recalled to Beijing.',
  ],
  s1315: [
    'That spring, land tax quotas and arrears were remitted in disaster-stricken parts of Zhili, Jiangsu, Anhui, and Jiangxi.',
    'That spring, taxes and arrears were remitted in Zhili, Jiangsu, Anhui, and Jiangxi disaster areas.',
  ],
  s1316: [
    'Summer, fourth month, new moon day yichou: reclamation within the Red Tallow inner zone of the Rehe hunting enclosure was forbidden.',
    'On the fourth month\'s yichou new moon, reclamation inside Rehe\'s Red Tallow reserve was banned.',
  ],
  s1317: [
    'Hui rebels at Suzhou occupied Jiayuguan and besieged the prefectural city; pacified Yi Hui rebels also rose.',
    'Suzhou Hui rebels held Jiayuguan and besieged the city; Yi Hui rebels rose as well.',
  ],
  s1318: [
    'On day dingmao, Peng Yulin memorialized to resign as grain-transport governor and asked to devote himself solely to the navy; it was granted.',
    'On dingmao day, Peng Yulin resigned the grain transport post to head the navy alone.',
  ],
  s1319: [
    'Wu Tang was kept in the grain-transport governor-general post to manage Qing and Huai defenses.',
    'Wu Tang stayed grain-transport governor-general for Qing and Huai defense.',
  ],
  s1320: [
    'On day jisi, government troops recovered Yanchating; dismissed regional commander Cheng Rui was pardoned.',
    'On jisi day, Yanchating was recovered and dismissed commander Cheng Rui was pardoned.',
  ],
  s1321: [
    'On day gengwu, Hui rebels took Gucheng; garrison commander Huiqing and others died.',
    'On gengwu day, Gucheng fell and Commander Huiqing died.',
  ],
  s1322: [
    'On day yihai, Taiwan was pacified.',
    'On yihai day, Taiwan was pacified.',
  ],
  s1323: [
    'On day dingchou, Guizhou troops recovered Yuping and Tianzhu.',
    'On dingchou day, Guizhou troops retook Yuping and Tianzhu.',
  ],
  s1324: [
    'Prince Gong was ordered to resume duty on the Grand Council without again participating in regency government.',
    'Prince Gong returned to the Grand Council without resuming regency rule.',
  ],
  s1325: [
    'Gansu Hui rebels took Yonggubao.',
    'Gansu Hui rebels seized Yonggubao.',
  ],
  s1326: [
    'On day renwu, Guangdong bandits again took Shuyang and Suxian.',
    'On renwu day, Taiping bandits retook Shuyang and Suxian.',
  ],
  s1327: [
    'Eighteen battalions of the Ting Army refused the western campaign and broke at Jinkou.',
    'Eighteen Ting Army battalions refused the western expedition and mutinied at Jinkou.',
  ],
  s1328: [
    'Bao Chao\'s western campaign was halted; he was ordered to gather the routed braves and go to Fujian to suppress bandits.',
    'Bao Chao\'s westward march was stopped; he was to rally mutineers for Fujian.',
  ],
  s1329: [
    'On day yiyou, Ningxia government troops won a great victory suppressing bandits.',
    'On yiyou day, Ningxia troops won a major victory.',
  ],
  s1330: [
    'On day bingxu, Guangdong and Nian bandits together fled back into Yanzhou and Jining; Liu Mingchuan was ordered to set defenses in Zhili.',
    'On bingxu day, Taiping and Nian rebels fled into Yanzhou and Jining; Liu Mingchuan was sent to fortify Zhili.',
  ],
  s1331: [
    'On day jichou, Chong Qi and 265 others were granted jinshi and other degrees with distinctions.',
    'On jichou day, Chong Qi and 265 others received jinshi degrees.',
  ],
  s1332: [
    'On day renchen, because bandit power was spreading in Shandong, Zeng Guofan was ordered out of the province to command troops and join Sengge Rinchen\'s army in a north-south pincer.',
    'On renchen day, Zeng Guofan left the province to join Sengge Rinchen against Shandong bandits.',
  ],
  s1333: [
    'On day guisi, Sengge Rinchen attacked bandits at Wujiadian south of Heze, was defeated, and died with Grand Secretariat reader-in-waiting Quan Shun, regional commander He Jian\'ao, and others.',
    'On guisi day, Sengge Rinchen died in defeat at Wujiadian south of Heze with Quan Shun and He Jian\'ao.',
  ],
  s1334: [
    'When the report arrived, court was suspended three days and he was specially granted posthumous sacrifice in the Grand Temple.',
    'The court mourned three days and granted him Grand Temple sacrifice.',
  ],
  s1335: [
    'Zeng Guofan was ordered to command troops against bandits; Li Hongzhang acted as Liang-Jiang governor-general.',
    'Zeng Guofan took field command; Li Hongzhang acted as Liang-Jiang governor-general.',
  ],
  s1336: [
    'Fifth month, new moon day yiwei: Cheng Lu was ordered to advance against entrenched bandits at Suzhou.',
    'On the fifth month\'s yiwei new moon, Cheng Lu was told to attack Suzhou bandits.',
  ],
  s1337: [
    'Mutinous Ting-brigade braves from Jiangxi fled into Fujian.',
    'Mutinous Ting braves fled from Jiangxi into Fujian.',
  ],
  s1338: [
    'Guangdong and Nian bandits together fled into Kaizhou and Dongming.',
    'Taiping and Nian rebels fled into Kaizhou and Dongming.',
  ],
  s1339: [
    'On day bingshen, Tao Maolin\'s army collapsed; Hui rebels besieged Anding and Lanzhou went on alert.',
    'On bingshen day, Tao Maolin\'s army broke; Hui rebels besieged Anding and Lanzhou was alarmed.',
  ],
  s1340: [
    'On day wuxu, Zeng Guofan was ordered to control military defenses of Zhili, Henan, and Shandong.',
    'On wuxu day, Zeng Guofan was given command over Zhili, Henan, and Shandong defenses.',
  ],
  s1341: [
    'Routed braves from Gansu raided Shaanxi.',
    'Gansu mutineers harassed Shaanxi.',
  ],
  s1342: [
    'On day yisi, Li Yuandu was spared exile punishment.',
    'On yisi day, Li Yuandu\'s exile sentence was remitted.',
  ],
  s1343: [
    'On day dingwei, Guangdong and Nian bandits together crossed the Grand Canal and fled east toward Jining, Yanzhou, and Taian.',
    'On dingwei day, Taiping and Nian rebels crossed the canal toward Jining, Yan, and Tai.',
  ],
  s1344: [
    'On day wushen, a strict edict ordered Shengjing and Jilin to suppress horse bandits.',
    'On wushen day, Shengjing and Jilin were urgently ordered to crush horse bandits.',
  ],
  s1345: [
    'On day jiyou, for failure to suppress bandits Guan Wen, Zhang Zhiwan, and Mao Changxi were stripped of office but all kept their posts, and Guan Wen\'s palace rank was also removed.',
    'On jiyou day, Guan Wen, Zhang Zhiwan, and Mao Changxi were demoted for failure yet kept on duty; Guan Wen lost palace rank.',
  ],
  s1346: [
    'Bao Chao was urgently ordered to Jiangxi.',
    'Bao Chao was urgently sent to Jiangxi.',
  ],
  s1347: [
    'On day xinhai, Reader-in-waiting Wei Rongguang was ordered to Dongchang to supervise riverside militia along the canal.',
    'On xinhai day, Wei Rongguang was sent to Dongchang to organize canal militia.',
  ],
  s1348: [
    'On day renzi, government troops took Zhangzhou and Nanjing.',
    'On renzi day, government troops captured Zhangzhou and Nanjing.',
  ],
  s1349: [
    'Shen Baozhen was allowed to complete mourning.',
    'Shen Baozhen was permitted to observe mourning.',
  ],
  s1350: [
    'Zeng Guofan declined command over the three provinces\' military affairs; it was not permitted.',
    'Zeng Guofan\'s refusal of tri-province command was denied.',
  ],
  s1351: [
    'Hui rebels took Suzhou.',
    'Hui rebels seized Suzhou.',
  ],
  s1352: [
    'Guangdong and Nian bandits split and fled into Feng and Pei counties.',
    'Taiping and Nian rebels split toward Feng and Pei.',
  ],
  s1353: [
    'An edict ordered coastal naval forces reorganized.',
    'Coastal naval forces were ordered reorganized.',
  ],
  s1354: [
    'Routed braves who had fled into Shaanxi were pacified.',
    'Shaanxi-roving mutineers were pacified.',
  ],
  s1355: [
    'Liu Changyou was ordered to station on the Zhili border, Chonghou at Dongchang, to deploy defenses along the river.',
    'Liu Changyou and Chonghou were posted to secure canal defenses.',
  ],
  s1356: [
    'Guizhou bandits took Guangshun but soon it was recovered.',
    'Guizhou rebels took Guangshun and soon lost it again.',
  ],
  s1357: [
    'On day jiayin, rain fell.',
    'On jiayin day, it rained.',
  ],
  s1358: [
    'Guangdong bandits besieged Yongding.',
    'Taiping rebels besieged Yongding.',
  ],
  s1359: [
    'On day yimao, Jiangsu troops recovered Zhangpu.',
    'On yimao day, Jiangsu troops retook Zhangpu.',
  ],
  s1360: [
    'Liu Kunyi was made Jiangxi governor.',
    'Liu Kunyi became Jiangxi governor.',
  ],
  s1361: [
    'On day gengshen, for delay in defense and suppression Regional Commander Liu Mingchuan was stripped of office but kept on duty.',
    'On gengshen day, Liu Mingchuan lost his post for delay but remained in service.',
  ],
  s1362: [
    'Yang Yuebin asked to vacate his post; it was denied and he was still ordered to Gansu.',
    'Yang Yuebin\'s request to leave office was denied; he was still sent to Gansu.',
  ],
  s1363: [
    'On day renxu, Qitai government troops recovered Jimusa.',
    'On renxu day, Qitai troops recovered Jimusa.',
  ],
  s1364: [
    'On day guihai, government troops recovered Jiezhou.',
    'On guihai day, government troops retook Jiezhou.',
  ],
  s1365: [
    'Intercalary fifth month, new moon day jiazi: Shen Baozhen was summoned to supervise Jiangxi defense and suppression.',
    'On intercalary month 5\'s jiazi new moon, Shen Baozhen took Jiangxi defense.',
  ],
  s1366: [
    'On day yichou, Guangdong bandits from Fujian fled into Jiaying.',
    'On yichou day, Taiping rebels fled from Fujian into Jiaying.',
  ],
  s1367: [
    'On day wuchen, Guangdong troops recovered Pinghe and Zhao\'an.',
    'On wuchen day, Guangdong troops retook Pinghe and Zhao\'an.',
  ],
  s1368: [
    'Sichuan troops recovered Zheng\'an.',
    'Sichuan troops retook Zheng\'an.',
  ],
  s1369: [
    'On day renshen, Sicheng bandits were pacified.',
    'On renshen day, Sicheng rebels were pacified.',
  ],
  s1370: [
    'On day jiaxu, canal tribute grain from Hang, Jia, and Hu districts was reduced by 260,000 shi.',
    'On jiaxu day, Hang-Jia-Hu canal grain was cut by 260,000 shi.',
  ],
  s1371: [
    'On day dingchou, Wang Haiyang fled back to Yongding; government troops were defeated; Regional Commander Ding Changsheng and others died.',
    'On dingchou day, Wang Haiyang retreated to Yongding; Ding Changsheng died in defeat.',
  ],
  s1372: [
    'On day jimao, Hui rebels occupied Fukang.',
    'On jimao day, Hui rebels held Fukang.',
  ],
  s1373: [
    'Zhang Zong\'en fled south to Zhiheji; Liu Mingchuan, Wu Tang, and others were ordered to join in suppression.',
    'Zhang Zong\'en fled south to Zhiheji; Liu Mingchuan and Wu Tang were ordered to pursue him jointly.',
  ],
  s1374: [
    'Guangdong bandits took Zhenping in Guangdong.',
    'Taiping rebels took Guangdong\'s Zhenping.',
  ],
  s1375: [
    'Zunyi bandits surrendered.',
    'Zunyi rebels surrendered.',
  ],
  s1376: [
    'On day bingxu, Ordos Mongol troops drove back Hui rebels at Huamachi.',
    'On bingxu day, Ordos Mongols repelled Huamachi Hui rebels.',
  ],
  s1377: [
    'Guizhou bandits took Suiyang.',
    'Guizhou rebels seized Suiyang.',
  ],
  s1378: [
    'On day jichou, the Emperor attended Prince Sengge Rinchen\'s mourning and granted offerings.',
    'On jichou day, the Emperor attended Sengge Rinchen\'s funeral rites.',
  ],
  s1379: [
    'His grandson Narsu was granted prince of the second rank; Wensudu was granted bulwark-of-the-state duke.',
    'Grandsons Narsu and Wensudu were ennobled as prince and duke.',
  ],
  s1380: [
    'Zeng Guofan stationed his army at Linhuai.',
    'Zeng Guofan camped at Linhuai.',
  ],
  s1381: [
    'Tekeshen died; Bao was ordered to investigate the Barag border dispute; Enhe was made Jilin general.',
    'After Tekeshen died, Bao investigated the Barag border dispute and Enhe became Jilin general.',
  ],
  s1382: [
    'On day gengyin, because of prolonged drought, an edict urged self-examination and sought memorials.',
    'On gengyin day, drought prompted an edict calling for repentance and advice.',
  ],
  s1383: [
    'On day guisi, an edict said Qishan had been condemned and need not be rehabilitated.',
    'On guisi day, the court said Qishan should not be posthumously cleared.',
  ],
  s1384: [
    'Sons of Su Shun were barred from office.',
    'Su Shun\'s sons were barred from serving.',
  ],
  s1385: [
    'Because Qishan\'s son Qingsi pleaded injustice, saying his father died through Su Shun\'s machinations.',
    'Qishan\'s son Qingsi petitioned, blaming Su Shun for his father\'s death.',
  ],
  s1386: [
    'Sixth month, new moon day jiawu: the An-Lu-Chu-He circuit of Anhui was added.',
    'On the sixth month\'s jiawu new moon, Anhui\'s An-Lu-Chu-He circuit was created.',
  ],
  s1387: [
    'The Feng-Lu-Ying circuit was changed to Feng-Ying-Liu-Si circuit, still combining Fengyang Pass superintendency.',
    'Feng-Lu-Ying circuit became Feng-Ying-Liu-Si, still supervising Fengyang Pass.',
  ],
  s1388: [
    'Liu Changyou was ordered back to Baoding; Pan Dingxin\'s army stationed at Jining.',
    'Liu Changyou returned to Baoding; Pan Dingxin garrisoned Jining.',
  ],
  s1389: [
    'On day bingshen, Gansu militia recovered Jiayuguan.',
    'On bingshen day, Gansu militia retook Jiayuguan.',
  ],
  s1390: [
    'Because Hui rebellion broke out in Anxi, Yumen, and other counties, Yang Yuebin was ordered to advance and station at Lanzhou.',
    'Hui revolts in Anxi and Yumen prompted Yang Yuebin to advance to Lanzhou.',
  ],
  s1391: [
    'On day jihai, an edict again told all provinces to screen prefects and magistrates.',
    'On jihai day, provinces were again ordered to evaluate local officials.',
  ],
  s1392: [
    'On day renyin, Tarbagatai Hui rebels lured and killed Assistant Commissioner Xilin and others, besieged the city, and were driven back by Lama Genggazhala\'s troops.',
    'On renyin day, Tarbagatai rebels killed Xilin and besieged the city until Genggazhala\'s lama troops repulsed them.',
  ],
  s1393: [
    'Wulong\'e was transferred to Tarbagatai assistant commissioner.',
    'Wulong\'e was made Tarbagatai assistant commissioner.',
  ],
  s1394: [
    'Eteng\'e was made Yarkand assistant commissioner.',
    'Eteng\'e became Yarkand assistant commissioner.',
  ],
  s1395: [
    'On day bingwu, rain fell.',
    'On bingwu day, it rained.',
  ],
  s1396: [
    'Za Hua and others were judged guilty of embezzling construction funds; Za Hua lost his beile and Enbi his bulwark dukedom; both remained in house arrest two years.',
    'Za Hua and Enbi were punished for graft, losing ranks but staying under house arrest two years.',
  ],
  s1397: [
    'On day jiyou, Shen Guifen was excused for mourning; Zeng Guoquan was made Shanxi governor.',
    'On jiyou day, Shen Guifen left for mourning and Zeng Guoquan became Shanxi governor.',
  ],
  s1398: [
    'Guizhou bandits again took Tianzhu, harassed Huitong in Hunan; Luo Chongguang and Li Hanzhang jointly suppressed them.',
    'Guizhou rebels retook Tianzhu and raided Hunan\'s Huitong; Luo Chongguang and Li Hanzhang combined against them.',
  ],
  s1399: [
    'Guizhou troops recovered Qianxi but were defeated at Dushan.',
    'Guizhou troops retook Qianxi but lost at Dushan.',
  ],
  s1400: [
    'On day renzi, Minzhou Hui rebels rose, killed magistrate Zeng Qi and others, and harassed Taozhou.',
    'On renzi day, Minzhou Hui rebels killed Magistrate Zeng Qi and raided Taozhou.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b14.mjs <translation.json>'
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
