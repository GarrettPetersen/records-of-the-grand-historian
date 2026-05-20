#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'I nurture the common people, practice frugality in person, keep taxes light and corvée light, tirelessly preserve good government, and dare not slacken in the slightest.',
    'I cherish the people, live frugally, keep taxes and labor light, and govern diligently without rest.',
  ],
  s1202: [
    'Now the realm is pacified and the left treasury has surplus; to hold fullness and preserve peace, nothing comes before enriching the people.',
    'The empire is at peace and the treasury full; enriching the people is the first duty of lasting rule.',
  ],
  s1203: [
    'The wealth under Heaven has only this fixed measure; if it is not gathered above, it disperses below.',
    'The empire\'s wealth is finite: what is not kept at court flows to the people.',
  ],
  s1204: [
    'My imperial grandfather reigned sixty-one years; edicts remitting rent and granting relief fill the histories without break, and once he wholly remitted the empire\'s land-tax grain.',
    'My grandfather\'s sixty-one-year reign was filled with rent remissions and relief; once he remitted all land-tax grain empire-wide.',
  ],
  s1205: [
    'My imperial father never let a day pass without issuing orders to reduce levies and ease collection; in Gansu province alone, main taxes were wholly exempt for more than ten years.',
    'My father issued tax-relief orders daily; Gansu\'s main levies were fully exempt for over ten years.',
  ],
  s1206: [
    'I, with a heart of continuing the aim and fulfilling the work, at a time after repeated prosperity and concord, wishing coast and remote mountain hamlet alike to share great bounty, for this purpose especially issued an edict that for the bingyin year the land-tax grain due from metropolitan provinces be wholly remitted.',
    'Wishing every shore and valley to share bounty after long peace, I ordered all land-tax grain due from the provinces in the bingyin year wholly remitted.',
  ],
  s1207: [
    '"" (closing quotation mark in the source.) On day gengxu, surcharges were remitted for Fengyang and other prefectures in Anhui long afflicted by disaster.',
    'The edict closed. On gengxu day, disaster surcharges were remitted in Fengyang and other Anhui prefectures.',
  ],
  s1208: [
    'Fu Heng, Vice Minister of Revenue, was ordered to serve at the Grand Council.',
    'Fu Heng was assigned to the Grand Council.',
  ],
  s1209: [
    'On day xinyou, Censor He Tai asked to withdraw the edict wholly remitting land-tax grain.',
    'On xinyou day, Censor He Tai asked to revoke the universal tax remission.',
  ],
  s1210: [
    'The Emperor rebuked him as perverse and stripped him of office.',
    'The Emperor called him perverse and dismissed him.',
  ],
  s1211: [
    'On day guihai, the Emperor went to Black Dragon Pool to pray for rain.',
    'On guihai day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s1212: [
    'Autumn, seventh month, day xinwei (first of month): arrears in land tax were remitted for three counties including Ningxia in Gansu.',
    'Seventh month, xinwei new moon: Gansu arrears were remitted for Ningxia and two other counties.',
  ],
  s1213: [
    'On day guiyou, because sixty-four departments, prefectures, and counties including Wanping in Zhili Direct lacked rain, collection of land-tax grain was halted.',
    'On guiyou day, tax collection was halted in sixty-four rain-starved Zhili districts including Wanping.',
  ],
  s1214: [
    'On day yiyou, Gao Bin was again ordered to hold concurrently the post of Zhili River Director-General.',
    'On yiyou day, Gao Bin again held the Zhili river director-generalship.',
  ],
  s1215: [
    'On day wuzi, relief was given for flood and hail disaster in eighteen prefectures, counties, and guards including Shouzhou in Anhui.',
    'On wuzi day, flood and hail relief went to eighteen Anhui jurisdictions including Shouzhou.',
  ],
  s1216: [
    'On day renchen, the Emperor, accompanying the Empress Dowager, visited Duolun Nuo\'er and remitted four-tenths of quota land tax for counties passed through.',
    'On renchen day, traveling with the Empress Dowager to Duolun, the Emperor cut passing counties\' quota tax by four-tenths.',
  ],
  s1217: [
    'On day wuxu, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On wuxu day, the court halted at the Summer Mountain Resort.',
  ],
  s1218: [
    'Relief was given for flood disaster in Suzhou and other prefectures, counties, and guards in Anhui.',
    'Flood relief was sent to Suzhou and other Anhui prefectures and counties.',
  ],
  s1219: [
    'Eighth month, day guimao: relief was given for flood at three salt-fields including Guandu in the Two Huai region.',
    'Eighth month, guimao day: flood relief went to three Liang-Huai salt-fields including Guandu.',
  ],
  s1220: [
    'Collection of quota tax was halted and relief given for flood in seventeen prefectures and counties including Hanchuan in Hubei and hail in two counties including Guanghua.',
    'Quota tax was halted and relief given for Hubei floods and hail in Guanghua and one other county.',
  ],
  s1221: [
    'The Emperor, accompanying the Empress Dowager, went to the Mulan hunting park.',
    'The Emperor accompanied the Empress Dowager to the Mulan hunt.',
  ],
  s1222: [
    'On day jiachen, the Emperor halted at Boluohetun.',
    'On jiachen day, the Emperor halted at Boluohetun.',
  ],
  s1223: [
    'Banquets were given to Mongol princes of Qinghai and gifts were bestowed.',
    'Qinghai Mongol princes were feasted and rewarded.',
  ],
  s1224: [
    'On day dingwei, the Emperor went on the autumn hunt at Yong\'an Mangka.',
    'On dingwei day, the Emperor hunted at Yong\'an Mangka.',
  ],
  s1225: [
    'On day wushen, the Emperor went on the autumn hunt at Biya Kala.',
    'On wushen day, the Emperor hunted at Biya Kala.',
  ],
  s1226: [
    'On day jiyou, the Emperor went on the autumn hunt at Wenduli Hua.',
    'On jiyou day, the Emperor hunted at Wenduli Hua.',
  ],
  s1227: [
    'On day xinhai, the Emperor went on the autumn hunt at E\'ergun Guo.',
    'On xinhai day, the Emperor hunted at E\'ergun Guo.',
  ],
  s1228: [
    'Banquets were given to Mongol kings, imperial sons-in-law, and taiji.',
    'Mongol kings, imperial sons-in-law, and taiji were feasted.',
  ],
  s1229: [
    'On day guichou, the Emperor went on the autumn hunt at Bu\'erge Su Tai.',
    'On guichou day, the Emperor hunted at Bu\'erge Su Tai.',
  ],
  s1230: [
    'On day jiayin, the Emperor went on the autumn hunt at Bayan Gou.',
    'On jiayin day, the Emperor hunted at Bayan Gou.',
  ],
  s1231: [
    'On day yimao, the Emperor went on the autumn hunt at Wuliyasutai.',
    'On yimao day, the Emperor hunted at Wuliyasutai.',
  ],
  s1232: [
    'Banquets were given to princes, grand ministers, Mongol kings, sons-in-law, and taiji.',
    'Princes, ministers, Mongol kings, sons-in-law, and taiji were feasted.',
  ],
  s1233: [
    'On day bingchen, the Emperor went on the autumn hunt at Bitushe\'er.',
    'On bingchen day, the Emperor hunted at Bitushe\'er.',
  ],
  s1234: [
    'Relief was given for drought in districts under Xuanhua prefecture, Zhili.',
    'Drought relief went to Xuanhua prefecture districts in Zhili.',
  ],
  s1235: [
    'On day dingsi, the Emperor went on the autumn hunt at Aji Geju Heluo.',
    'On dingsi day, the Emperor hunted at Aji Geju Heluo.',
  ],
  s1236: [
    'On day wuwu, the Emperor went on the autumn hunt at Sengji Tu.',
    'On wuwu day, the Emperor hunted at Sengji Tu.',
  ],
  s1237: [
    'On day jiwei, the Emperor went on the autumn hunt at Yong\'an Pai.',
    'On jiwei day, the Emperor hunted at Yong\'an Pai.',
  ],
  s1238: [
    'On day gengshen, the Emperor went on the autumn hunt at Yingtu Heluo.',
    'On gengshen day, the Emperor hunted at Yingtu Heluo.',
  ],
  s1239: [
    'On day xinyou, the Emperor went on the autumn hunt at Sadaketu Pass.',
    'On xinyou day, the Emperor hunted at Sadaketu Pass.',
  ],
  s1240: [
    'On day renxu, flood relief was given for three prefectures, counties, and guards including Yicheng in Hubei.',
    'On renxu day, flood relief went to Yicheng and two other Hubei jurisdictions.',
  ],
  s1241: [
    'On day guihai, the Emperor went on the autumn hunt at Laotu Bo\'erqi\'er.',
    'On guihai day, the Emperor hunted at Laotu Bo\'erqi\'er.',
  ],
  s1242: [
    'On day yichou, the Emperor went on the autumn hunt at Ku\'erqi\'le.',
    'On yichou day, the Emperor hunted at Ku\'erqi\'le.',
  ],
  s1243: [
    'On day bingyin, drought relief was given for three counties including Anding in Gansu and two counties including Dianbai in Guangdong; insect disaster relief at Haifeng; wind disaster relief at Nan\'ao.',
    'On bingyin day, drought relief went to Gansu and Guangdong counties; Haifeng received insect relief and Nan\'ao wind relief.',
  ],
  s1244: [
    'The Emperor halted at Duolun Nuo\'er.',
    'The Emperor halted at Duolun.',
  ],
  s1245: [
    'On day dingmao, banquets were given to princes, ministers, Mongol kings, sons-in-law, and taiji.',
    'On dingmao day, princes, ministers, and Mongol nobles were feasted.',
  ],
  s1246: [
    'Flood relief was given for twelve prefectures and counties including Quwo in Shanxi.',
    'Flood relief went to Quwo and eleven other Shanxi counties.',
  ],
  s1247: [
    'Ninth month, day gengwu (first of month): the Emperor went on the autumn hunt at E\'ertuoang Seqin.',
    'Ninth month, gengwu new moon: the Emperor hunted at E\'ertuoang Seqin.',
  ],
  s1248: [
    'On day xinwei, the Emperor went on the autumn hunt at Duolun Ebo Tu.',
    'On xinwei day, the Emperor hunted at Duolun Ebo Tu.',
  ],
  s1249: [
    'On day renshen, envoys were sent to sacrifice at the Ming tombs.',
    'On renshen day, envoys sacrificed at the Ming tombs.',
  ],
  s1250: [
    'The Emperor went on the autumn hunt at Guzhe Nuo\'er.',
    'The Emperor hunted at Guzhe Nuo\'er.',
  ],
  s1251: [
    'On day guiyou, Zhang Yunrui reported that Meng-Burma native chiefs Feng Tingzheng and others had contacted Burmese rebels; he asked to replace native rule with direct administration, and detailed deliberation was ordered.',
    'On guiyou day, Zhang Yunrui reported Burmese collusion by native chiefs and sought direct rule; the court ordered review.',
  ],
  s1252: [
    'The Emperor went on the autumn hunt at Tabengtuoluo Hai.',
    'The Emperor hunted at Tabengtuoluo Hai.',
  ],
  s1253: [
    'On day yihai, flood relief was given for five counties including Yongcheng in Henan.',
    'On yihai day, flood relief went to five Henan counties including Yongcheng.',
  ],
  s1254: [
    'The Emperor went on the autumn hunt at Zhamake Tu.',
    'The Emperor hunted at Zhamake Tu.',
  ],
  s1255: [
    'On day bingzi, the Emperor went on the autumn hunt at Wei\'erhu.',
    'On bingzi day, the Emperor hunted at Wei\'erhu.',
  ],
  s1256: [
    'On day dingchou, drought relief was given for fifteen prefectures, counties, and guards including Gucheng in Zhili.',
    'On dingchou day, drought relief went to fifteen Zhili jurisdictions including Gucheng.',
  ],
  s1257: [
    'On day guiwei, the Emperor halted at Xuanhua prefecture.',
    'On guiwei day, the Emperor halted at Xuanhua.',
  ],
  s1258: [
    'On day jiashen, the Emperor reviewed troops at Xuanhua garrison.',
    'On jiashen day, the Emperor reviewed Xuanhua troops.',
  ],
  s1259: [
    'On day dinghai, flood relief was given for six prefectures, counties, and guards including Jining in Shandong; drought relief at Haifeng.',
    'On dinghai day, Shandong flood relief and Haifeng drought relief were ordered.',
  ],
  s1260: [
    'On day guisi, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On guisi day, the Emperor returned to Beijing with the Empress Dowager.',
  ],
  s1261: [
    'On day jiawu, Eminida was made Huguang governor-general.',
    'On jiawu day, Eminida became Huguang governor-general.',
  ],
  s1262: [
    'Flood relief was given at the Miaowan salt-field in the Two Huai region.',
    'Flood relief went to the Miaowan salt-field.',
  ],
  s1263: [
    'On day dingyou, because land-tax grain had been wholly remitted, each province was ordered to audit surplus silver accumulated over the years to offset annual needs.',
    'On dingyou day, provinces were told to use accumulated surpluses to cover needs after the universal remission.',
  ],
  s1264: [
    'On day wuxu, Yin Jishan was made Liangjiang governor-general.',
    'On wuxu day, Yin Jishan became Liangjiang governor-general.',
  ],
  s1265: [
    'Repair was ordered for Emperor Min of Ming\'s tomb.',
    'The court ordered repairs to the tomb of the Ming Min Emperor.',
  ],
  s1266: [
    'Relief was given for disaster-hit prefectures and counties in Huai, Xu, and Hai, Jiangsu.',
    'Jiangsu\'s Huai, Xu, and Hai districts received disaster relief.',
  ],
  s1267: [
    'Qing Fu memorialized that upper Zhangdui had been pacified and brought in, that he was advancing against lower Zhangdui at Banben, and that he had taken Kasheya Pass and stockades on the southern route.',
    'Qing Fu reported pacifying upper Zhangdui, attacking Banben in lower Zhangdui, and capturing Kasheya and southern stockades.',
  ],
  s1268: [
    'Flood relief was given for six counties including Chang\'an in Shaanxi.',
    'Flood relief went to six Shaanxi counties including Chang\'an.',
  ],
  s1269: [
    'Winter, tenth month, day dingwei: the Ganshan circuit in Gansu was merged into the Suzhou circuit.',
    'Tenth month, dingwei day: Gansu\'s Ganshan circuit was merged into Suzhou circuit.',
  ],
  s1270: [
    'On day wushen, flood relief was given for five counties including Shangqiu in Henan.',
    'On wushen day, flood relief went to five Henan counties including Shangqiu.',
  ],
  s1271: [
    'On day xinhai, one Han Right Vice Transmission Commissioner in the Transmission Office was abolished.',
    'On xinhai day, one Han vice transmission commissioner post was cut.',
  ],
  s1272: [
    'On day bingchen, orders were issued to block the breach at Chenjiapu.',
    'On bingchen day, the Chenjiapu breach was ordered closed.',
  ],
  s1273: [
    'On day wuwu, Sichuan was ordered to strictly investigate local bandits.',
    'On wuwu day, Sichuan was ordered to suppress bandits rigorously.',
  ],
  s1274: [
    'Minister of Rites Ren Lanzhi asked to retire; this was granted.',
    'Ren Lanzhi, Minister of Rites, retired on request.',
  ],
  s1275: [
    'On day guihai, tribute grain was remitted for seven prefectures and counties including Haizhou in Jiangsu.',
    'On guihai day, tribute grain was remitted in seven Jiangsu prefectures including Haizhou.',
  ],
  s1276: [
    'On day jiazi, silver was given to Jiangnan disaster victims to repair houses.',
    'On jiazi day, Jiangnan victims received silver to rebuild houses.',
  ],
  s1277: [
    'Flood relief was given for twenty-one prefectures, counties, and guards including Jiangpu in Jiangsu.',
    'Flood relief went to twenty-one Jiangsu jurisdictions including Jiangpu.',
  ],
  s1278: [
    'On day yichou, drought relief was given for three counties including Xiangyin in Hunan and twenty-one prefectures, counties, and guards including Hanchuan in Hubei.',
    'On yichou day, drought relief went to Hunan and Hubei counties including Xiangyin and Hanchuan.',
  ],
  s1279: [
    'On day bingyin, land tax on land washed away by flood in two counties and guards including Dangyang in Hubei was cancelled.',
    'On bingyin day, tax on flood-washed land was cancelled in Dangyang and one other Hubei jurisdiction.',
  ],
  s1280: [
    'Eleventh month, day gengwu: drought relief was given for forty-eight prefectures, departments, and counties including Xianghe in Zhili; flood relief for six counties including Xingping in Shaanxi.',
    'Eleventh month, gengwu day: Zhili drought and Shaanxi flood relief were ordered.',
  ],
  s1281: [
    'On day xinwei, flood relief was given for seven prefectures, counties, and guards including Tengzhou in Shandong.',
    'On xinwei day, flood relief went to seven Shandong jurisdictions including Tengzhou.',
  ],
  s1282: [
    'On day renshen, Wang Anguo was made Minister of Rites.',
    'On renshen day, Wang Anguo became Minister of Rites.',
  ],
  s1283: [
    'On day jiaxu, flood relief was given at salt-fields including Miaowan in the Two Huai region.',
    'On jiaxu day, Liang-Huai salt-fields including Miaowan received flood relief.',
  ],
  s1284: [
    'On day yihai, Fu Qing memorialized that Dzungar taiji Galdan Tseren and Khan Abudurgami were at war with each other.',
    'On yihai day, Fu Qing reported war between Galdan Tseren and Khan Abudurgami.',
  ],
  s1285: [
    'On day dingchou, drought, frost, and hail relief was given for eighteen prefectures and counties including Datong in Shanxi.',
    'On dingchou day, drought, frost, and hail relief went to eighteen Shanxi jurisdictions including Datong.',
  ],
  s1286: [
    'Hubei governor Yan Sisheng asked leave to care for his parents; Kai Tai replaced him.',
    'Yan Sisheng left Hubei to nurse his parents; Kai Tai succeeded him.',
  ],
  s1287: [
    'On day xinsi, drought relief was given for counties including Si\'en in Guangxi.',
    'On xinsi day, drought relief went to Si\'en and other Guangxi counties.',
  ],
  s1288: [
    'On day renwu, Dzungar taiji Galdan Tseren died.',
    'On renwu day, Galdan Tseren died.',
  ],
  s1289: [
    'Both northwest routes were ordered to prepare frontier defenses.',
    'The northwestern routes were told to ready frontier defenses.',
  ],
  s1290: [
    'On day yiyou, wind disaster relief was given at four salt-fields including Haichuo in Guangdong.',
    'On yiyou day, four Guangdong salt-fields including Haichuo received wind relief.',
  ],
  s1291: [
    'On day wuzi, tribute grain was remitted for five prefectures and counties including Suzhou in Anhui in flood districts.',
    'On wuzi day, tribute grain was remitted in five flooded Anhui prefectures including Suzhou.',
  ],
  s1292: [
    'On day gengyin, the Chenjiapu breach was closed.',
    'On gengyin day, the Chenjiapu breach was sealed.',
  ],
  s1293: [
    'On day guisi, drought relief was given for districts under Xuanhua prefecture and Qingyun county in Zhili.',
    'On guisi day, drought relief went to Xuanhua districts and Qingyun in Zhili.',
  ],
  s1294: [
    'Twelfth month, day xinhai: Grand Secretary Fu Min asked to retire; a gracious edict approved it and added the title Grand Tutor.',
    'Twelfth month, xinhai day: Fu Min retired with honors as Grand Tutor.',
  ],
  s1295: [
    'On day renzi, Qing Fu was made Grand Secretary of the Hall of Literary Glory, retaining his post as Sichuan-Shaanxi governor-general.',
    'On renzi day, Qing Fu became Grand Secretary of the Wenhua Hall while keeping the Sichuan-Shaanxi post.',
  ],
  s1296: [
    'Gao Bin was ordered to serve as Associate Grand Secretary.',
    'Gao Bin was made Associate Grand Secretary.',
  ],
  s1297: [
    'Drought relief was given for prefectures and counties including Longxi in Shaanxi.',
    'Drought relief went to Longxi and other Shaanxi counties.',
  ],
  s1298: [
    'Flood relief was given at salt-fields including Banpu north of the Huai.',
    'Flood relief went to Banpu and other north-Huai salt-fields.',
  ],
  s1299: [
    'On day yimao, Associate Grand Secretary Gao Bin and Vice Minister Jiang Pu were both ordered to serve at the Grand Council.',
    'On yimao day, Gao Bin and Jiang Pu joined the Grand Council.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b13.mjs <translation.json>'
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
