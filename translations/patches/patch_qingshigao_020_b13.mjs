#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    '" On day wuxu, an edict said that although the barbarians had been punished, methods of pacification should still be devised; Hengfu was specially assigned to manage pacification, while Sengge Rinchen continued to handle defense.',
    'On wuxu day, the court ordered continued pacification of the barbarians: Hengfu took the pacification portfolio and Sengge Rinchen kept defense.',
  ],
  s1202: [
    'Sixth month, new moon day jihai: imperial precious robes were bestowed on Sengge Rinchen.',
    'In the sixth month, on the new moon jihai, Sengge Rinchen received imperial robes.',
  ],
  s1203: [
    'On day gengzi, Nian bandits took Xuyi; government troops soon recovered it.',
    'On gengzi day, Nian rebels seized Xuyi and the army soon retook it.',
  ],
  s1204: [
    'On day renyin, Tepuqin memorialized that Russians at Sanxing were obstinate and refused to turn back.',
    'On renyin day, Tepuqin reported Russians at Sanxing would not withdraw.',
  ],
  s1205: [
    'Jingchun was ordered to go and investigate.',
    'Jingchun was sent to investigate.',
  ],
  s1206: [
    'On day guimao, Guangxi government troops recovered Shanglin; bandits took Binzhou.',
    'On guimao day, Guangxi troops retook Shanglin while bandits seized Binzhou.',
  ],
  s1207: [
    'On day jiachen, Zhang Liangji memorialized that the Hui rebel Ma Linghan had been executed.',
    'On jiachen day, Zhang Liangji reported the execution of Hui rebel Ma Linghan.',
  ],
  s1208: [
    'On day bingwu, Hengfu memorialized that Americans were coming to the capital to exchange treaties; permission was granted.',
    'On bingwu day, Hengfu won assent for Americans to come to Beijing to exchange treaties.',
  ],
  s1209: [
    'On day guisi, all English and French warships set sail.',
    'On guisi day, the English and French fleets departed.',
  ],
  s1210: [
    'On day gengshen, Li Ruozhu was made Fujian land-route provincial commander.',
    'On gengshen day, Li Ruozhu became Fujian land-route commander.',
  ],
  s1211: [
    'On day xinyou, He Guiqing memorialized that the English and French were returning to Shanghai in succession.',
    'On xinyou day, He Guiqing reported the English and French were returning to Shanghai.',
  ],
  s1212: [
    'On day yichou, Chen Yucheng took Dingyuan.',
    'On yichou day, Chen Yucheng seized Dingyuan.',
  ],
  s1213: [
    'On day bingyin, He Chun memorialized that the naval force had defeated bandits in battle.',
    'On bingyin day, He Chun reported a naval victory over bandits.',
  ],
  s1214: [
    'Autumn, seventh month, day gengwu: Zeng Guofan memorialized that Jingdezhen had been taken and Fuliang recovered.',
    'In the seventh autumn month, on gengwu day, Zeng Guofan reported the capture of Jingdezhen and recovery of Fuliang.',
  ],
  s1215: [
    'On day wuyin, Sheng Bao memorialized on Weng Tonghe\'s rout.',
    'On wuyin day, Sheng Bao reported Weng Tonghe\'s defeat.',
  ],
  s1216: [
    'An edict said: "As commander-in-chief you only display your own strengths and do not excuse others\' failures.',
    'The court said: "As supreme commander you boast of yourself and blame allies for every setback.',
  ],
  s1217: [
    'Daily wrangling—of what use is it!"',
    'Daily quarrels accomplish nothing!"',
  ],
  s1218: [
    '" On day jimao, the American minister Ward presented his credentials; the treaty was sealed and exchanged at Beitang.',
    'On jimao day, Minister Ward exchanged credentials and the sealed treaty at Beitang.',
  ],
  s1219: [
    'On day gengchen, an edict said: "We have heard that Sheng Bao makes recruitment of surrenders his sole talent; surrendered masses have not all shaved their heads, and Zhang Yuanchong is even foraging in all directions.',
    'On gengchen day, the Emperor rebuked Sheng Bao for boasting of surrenders while rebels went unshorn and Zhang Yuanchong foraged widely.',
  ],
  s1220: [
    'He also reported the recovery of Xuyi, yet that county has no city walls; the bandits withdrew for lack of grain, and he falsely claimed merit.',
    'He also falsely claimed Xuyi, which has no walls, after bandits left for lack of food.',
  ],
  s1221: [
    'This time he is for the present not pursued deeply.',
    'On this occasion the court will not press the matter further.',
  ],
  s1222: [
    'He must at once restrain the disaffected and vigorously reform his former errors.',
    'He must restrain the unreliable and thoroughly mend his ways.',
  ],
  s1223: [
    'Take warning!"',
    'Be warned!"',
  ],
  s1224: [
    '" On day guiwei, Censor Zhao Yuanmo memorialized that the Yellow River had flowed north, exposing three or four thousand mu of riverside fields, and asked to establish military colonies, keeping troops among farmers, which would be better than militia drill.',
    'On guiwei day, Censor Zhao Yuanmo urged military farming on fields exposed by the Yellow River\'s northward shift.',
  ],
  s1225: [
    'The Emperor approved and referred it to Yuan Jiasan and Gengchang for joint memorial.',
    'The court approved and ordered Yuan Jiasan and Gengchang to report.',
  ],
  s1226: [
    'On day yiyou, an edict said: "The princes and ministers have further set forth the examination-fraud case of the great official father and son, and the clerks who relayed examination signals, with separate penalties fixed.',
    'On yiyou day, an edict fixed penalties in the examination-bribery case for great officials, their sons, and signal-carriers.',
  ],
  s1227: [
    'In this case Cheng Bingcai, after his father Cheng Tinggui entered the examination hall, received signals and had household members relay them inside; Cheng Tinggui did not report it.',
    'Cheng Bingcai relayed examination signals for his father Cheng Tinggui, who failed to report it.',
  ],
  s1228: [
    'Cheng Bingcai was sentenced to death; Cheng Tinggui was spared death and sent to garrison duty on the military colonies.',
    'Cheng Bingcai was executed; Cheng Tinggui was spared and exiled to the military colonies.',
  ],
  s1229: [
    'Xie Senchi, Pan Zutong, Pan Dunyi, and others were all spared death and sent to Xinjiang.',
    'Xie Senchi, Pan Zutong, Pan Dunyi, and others were spared death and exiled to Xinjiang.',
  ],
  s1230: [
    '" On day jichou, Luo Bingzhang memorialized that Shi Dakai was besieging Baoxing; Li Xuyi relieved it and the siege was at once raised.',
    'On jichou day, Luo Bingzhang reported Li Xuyi had raised Shi Dakai\'s siege of Baoxing.',
  ],
  s1231: [
    'On day guisi, Li Ruozhu was ordered to assist in Jiangnan military affairs.',
    'On guisi day, Li Ruozhu was assigned to assist Jiangnan operations.',
  ],
  s1232: [
    'Eighth month, new moon day wuxu: Chong\'en was dismissed and Wen Yu was made Shandong governor.',
    'In the eighth month, on the new moon wuxu, Chong\'en left office and Wen Yu became Shandong governor.',
  ],
  s1233: [
    'On day jihai, the Emperor attended the Classics Lecture.',
    'On jihai day, the Emperor attended the Classics Lecture.',
  ],
  s1234: [
    'On day yisi, an edict ordered Hengqi to remain and manage Guangdong trade.',
    'On yisi day, Hengqi was ordered to stay and handle Guangdong trade.',
  ],
  s1235: [
    'Sheng Bao memorialized that Li Shizhong had defeated bandits and raised the sieges of Dingyuan and Chuzhou.',
    'Sheng Bao reported Li Shizhong\'s victory and relief of Dingyuan and Chuzhou.',
  ],
  s1236: [
    'An edict promoted Li Shizhong to regional commander.',
    'Li Shizhong was promoted to regional commander.',
  ],
  s1237: [
    'Guangdong government troops recovered Lianshan and Kaijian.',
    'Guangdong troops retook Lianshan and Kaijian.',
  ],
  s1238: [
    'On day gengxu, Zeng Guofan was ordered to station his army at Hukou.',
    'On gengxu day, Zeng Guofan was ordered to camp at Hukou.',
  ],
  s1239: [
    'Duxing\'a was ordered to take up duties as Jiangning General; Dolongga took over his command and was put in overall charge of front-line affairs.',
    'Duxing\'a became Jiangning General; Dolongga took his troops and commanded the front.',
  ],
  s1240: [
    'On day jiayin, Jingchun memorialized that Russian ships at Sanxing had now been ordered to turn back.',
    'On jiayin day, Jingchun reported Russian ships at Sanxing were ordered back.',
  ],
  s1241: [
    'Those on the Ussuri had not yet obeyed.',
    'Those on the Ussuri still refused.',
  ],
  s1242: [
    'An edict ordered that public sentiment be gauged and the matter handled properly.',
    'The court ordered the matter handled with due regard for local opinion.',
  ],
  s1243: [
    'On day jiwei, Americans asked to open trade first; because English and French treaty talks were unsettled, it was refused.',
    'On jiwei day, an American request for early market opening was refused pending Anglo-French treaties.',
  ],
  s1244: [
    'On day xinyou, Luo Bingzhang memorialized that Shi Dakai had gone south and taken Jianghua and Yongmen and would enter Guangxi.',
    'On xinyou day, Luo Bingzhang reported Shi Dakai had seized Jianghua and Yongmen and was heading into Guangxi.',
  ],
  s1245: [
    'Liu Changyou was now ordered to command troops in pursuit.',
    'Liu Changyou was ordered to pursue with his army.',
  ],
  s1246: [
    'An edict said: Tian Xingyu\'s army is to aid Guizhou; Li Xuyi\'s army is to return to Hubei for reserve deployment.',
    'The court ordered Tian Xingyu to aid Guizhou and Li Xuyi back to Hubei as reserve.',
  ],
  s1247: [
    'On day renxu, Taiping and Nian bandits jointly attacked Shouzhou; government troops beat them back.',
    'On renxu day, Taiping and Nian rebels jointly attacked Shouzhou and were repulsed.',
  ],
  s1248: [
    'Censor Chen Qingsong memorialized that in the examination case the sons of great officials, Chen Jingyan and others, had been ransomed too quickly and asked that they still be sent into exile; a stern edict rebuked him.',
    'Censor Chen Qingsong\'s plea to re-exile examination-case offenders drew a sharp rebuke.',
  ],
  s1249: [
    'On day jiazi, Guangdong government troops recovered Lingshan.',
    'On jiazi day, Guangdong troops retook Lingshan.',
  ],
  s1250: [
    'Ninth month, day wuchen: Anhui bandits took Huoshan and Xuyi; Sheng Bao drove them back.',
    'In the ninth month, on wuchen day, Anhui rebels took Huoshan and Xuyi and Sheng Bao repulsed them.',
  ],
  s1251: [
    'Sheng Bao was in mourning for his mother but remained in camp to oversee the army.',
    'Sheng Bao, though mourning his mother, stayed with the army.',
  ],
  s1252: [
    'On day jiaxu, Hu Xingren was dismissed and Luo Zundian was transferred as Zhejiang governor.',
    'On jiaxu day, Hu Xingren left office and Luo Zundian became Zhejiang governor.',
  ],
  s1253: [
    'On day wuyin, Wang Qingyun was relieved for illness and Lao Chongguang was made Liang-Guang governor-general.',
    'On wuyin day, Wang Qingyun left for illness and Lao Chongguang took Liang-Guang.',
  ],
  s1254: [
    'On day gengchen, Guan Wen and Hu Linyi memorialized that Dolongga had stormed Shipai in Anhui, broken relieving bandits, and captured the bandit chiefs Huo Tianyan and Shi Tingyu; an edict praised them.',
    'On gengchen day, Guan Wen and Hu Linyi reported Dolongga\'s capture of Shipai and bandit chiefs, winning praise.',
  ],
  s1255: [
    'On day jichou, Fu Zhenbang memorialized on pursuing Nian bandits and defeating them.',
    'On jichou day, Fu Zhenbang reported defeating pursuing Nian bandits.',
  ],
  s1256: [
    'On day jiawu, Cao Shuzhong memorialized that Shi Dakai was besieging the Guangxi provincial capital; Xiao Qijiang and Su Fengwen joined Jiang Yili in divided pursuit, defeated him, and at once raised the siege.',
    'On jiawu day, Cao Shuzhong reported allied forces had raised Shi Dakai\'s siege of the Guangxi capital.',
  ],
  s1257: [
    'Winter, tenth month, new moon day dingyou: the seasonal offering was made at the Imperial Ancestral Temple and the Emperor went in person to perform the rites.',
    'In the tenth winter month, on the new moon dingyou, the Emperor personally offered at the Imperial Ancestral Temple.',
  ],
  s1258: [
    'Luo Bingzhang memorialized that refugees surrendering from among the bandits were given death-exemption passports, provided funds for return home, and those who wished to serve were allowed to remain in camp; an edict said all provinces might follow this.',
    'Luo Bingzhang\'s policy of passports and repatriation for surrendering refugees was approved for all provinces.',
  ],
  s1259: [
    'On day wuxu, Yunnan government troops recovered Songming and slew the bandit chief Sun Handing in battle.',
    'On wuxu day, Yunnan troops retook Songming and killed bandit chief Sun Handing.',
  ],
  s1260: [
    'On day gengzi, Zeng Wangyan acted as Sichuan governor and Tan Tingxiang acted as Shaanxi governor.',
    'On gengzi day, Zeng Wangyan acted as Sichuan governor and Tan Tingxiang as Shaanxi governor.',
  ],
  s1261: [
    'On day xinchou, Yuan Jiasan was made Imperial Commissioner to supervise Anhui military affairs.',
    'On xinchou day, Yuan Jiasan became Imperial Commissioner for Anhui.',
  ],
  s1262: [
    'Vice Minister Kuang Yuan and Hanlin Academician Wen Xiang were made Grand Council ministers.',
    'Kuang Yuan and Wen Xiang joined the Grand Council.',
  ],
  s1263: [
    'On day guimao, Henan Nian bandits took Lanyi, besieged Kaocheng and Tongxu, harassed Weishi, and scattered into Zhili and Shandong.',
    'On guimao day, Henan Nian rebels took Lanyi, besieged Kaocheng and Tongxu, raided Weishi, and spread into Zhili and Shandong.',
  ],
  s1264: [
    'On day wushen, Regional Commander Tian Zaitian was ordered to assist Fu Zhenbang in military affairs.',
    'On wushen day, Tian Zaitian was assigned to assist Fu Zhenbang.',
  ],
  s1265: [
    'On day yimao, Yuan Jiasan was appointed Grain Transport governor.',
    'On yimao day, Yuan Jiasan received the Grain Transport post.',
  ],
  s1266: [
    'On day bingchen, Sheng Bao recovered Huaiyuan.',
    'On bingchen day, Sheng Bao retook Huaiyuan.',
  ],
  s1267: [
    'Jiangsu government troops were defeated in attacking Liuhe; Li Ruozhu was stripped of office.',
    'Jiangsu troops failed at Liuhe and Li Ruozhu lost his post.',
  ],
  s1268: [
    'On day wuwu, the American minister asked to open treaty ports at Chaozhou and Taiwan.',
    'On wuwu day, the American minister sought treaty ports at Chaozhou and Taiwan.',
  ],
  s1269: [
    'On day gengshen, Henan government troops pacified Yanling Nian bandits and the western route was cleared.',
    'On gengshen day, Henan troops pacified Yanling Nian rebels and cleared the west.',
  ],
  s1270: [
    'On day renxu, Mingyi was made Uliasutai General, Jinglian Ili Assistant Resident Commissioner, and Chongshi Tibet Resident Commissioner.',
    'On renxu day, Mingyi took Uliasutai, Jinglian Ili, and Chongshi Tibet.',
  ],
  s1271: [
    'On day yichou, Guan Wen, Zeng Guofan, and Hu Linyi were ordered to plan properly a four-route campaign against Anhui.',
    'On yichou day, Guan Wen, Zeng Guofan, and Hu Linyi were told to plan a four-route Anhui campaign.',
  ],
  s1272: [
    'Eleventh month, day wuchen: Yunnan bandits attacked Xuzhou; Wan Fu was stripped of office and Gao Sheng was made Sichuan provincial commander.',
    'In the eleventh month, on wuchen day, Yunnan rebels attacked Xuzhou; Wan Fu lost his post and Gao Sheng became Sichuan commander.',
  ],
  s1273: [
    'On day xinwei, He Guiqing memorialized that intelligence indicated the English and French would certainly come seeking trouble next spring.',
    'On xinwei day, He Guiqing reported intelligence that the English and French would provoke trouble next spring.',
  ],
  s1274: [
    'Hengqi memorialized that English troops were continuing to Guangdong.',
    'Hengqi reported English troops were still heading to Guangdong.',
  ],
  s1275: [
    'An edict ordered Sengge Rinchen to pay special attention to Tianjin defenses.',
    'The court told Sengge Rinchen to strengthen Tianjin defenses.',
  ],
  s1276: [
    'On day dingchou, bandits took Pukou; Regional Commander Zhou Tianpei died in the fighting and was granted a hereditary office.',
    'On dingchou day, bandits took Pukou; Zhou Tianpei died fighting and received a hereditary rank.',
  ],
  s1277: [
    'On day guiwei, Tepuqin memorialized that Russians had occupied more than fifty villages on the left bank of the Amur and asked that Xidan, Moergen, and Buteha troops be transferred to Narenhu Shan for training, linking banner people and hired laborers so that in an emergency they could resist; assent was given.',
    'On guiwei day, Tepuqin won assent to train border militia against Russian occupation of Amur villages.',
  ],
  s1278: [
    'On day bingxu, Zhang Fu was ordered to supervise southern Anhui military affairs.',
    'On bingxu day, Zhang Fu was assigned southern Anhui operations.',
  ],
  s1279: [
    'On day jichou, Zeng Guofan memorialized that Wei Zhijun had surrendered Chizhou.',
    'On jichou day, Zeng Guofan reported Wei Zhijun\'s surrender of Chizhou.',
  ],
  s1280: [
    'Yunnan bandits took Xuzhou; another column took Youyang and Xiushan.',
    'Yunnan rebels took Xuzhou while another force took Youyang and Xiushan.',
  ],
  s1281: [
    'On day gengyin, Sichuan government troops recovered Junlian, Qingfu, and Gaoxian.',
    'On gengyin day, Sichuan troops retook Junlian, Qingfu, and Gaoxian.',
  ],
  s1282: [
    'On day yiwei, the Ministry of Revenue caught fire.',
    'On yiwei day, the Ministry of Revenue burned.',
  ],
  s1283: [
    'Twelfth month, new moon day bingshen: Jiang Yiyuan memorialized that Shi Dakai had gathered more than a hundred thousand followers to invade Guizhou from Guangxi, intending to threaten Sichuan.',
    'In the twelfth month, on the new moon bingshen, Jiang Yiyuan reported Shi Dakai was leading over a hundred thousand men from Guangxi into Guizhou toward Sichuan.',
  ],
  s1284: [
    'An edict ordered Tian Xingyu to suppress him.',
    'Tian Xingyu was ordered to suppress him.',
  ],
  s1285: [
    'On day wuxu, the Emperor went to the Dagao Hall to pray for snow.',
    'On wuxu day, the Emperor prayed for snow at the Dagao Hall.',
  ],
  s1286: [
    'In Yunnan, Qiubei local bandits made trouble and killed officials; government troops suppressed them.',
    'Yunnan Qiubei bandits killed officials and were suppressed.',
  ],
  s1287: [
    'On day gengzi, He Chun memorialized that government troops had stormed bandit stockades at Jiangpu and the western border of Yangzhou was cleared.',
    'On gengzi day, He Chun reported the storming of Jiangpu bandit camps and clearance west of Yangzhou.',
  ],
  s1288: [
    'On day renyin, Minister of Personnel Hua Shana died.',
    'On renyin day, Minister of Personnel Hua Shana died.',
  ],
  s1289: [
    'On day bingwu, He Guiqing reported that English and French warships had reached Shanghai.',
    'On bingwu day, He Guiqing reported Anglo-French warships at Shanghai.',
  ],
  s1290: [
    'Tian Xingyu was made Guizhou provincial commander.',
    'Tian Xingyu became Guizhou provincial commander.',
  ],
  s1291: [
    'On day xinwei, Hunan troops aiding Guizhou recovered Zhenyuan.',
    'On xinwei day, Hunan relief forces retook Zhenyuan in Guizhou.',
  ],
  s1292: [
    'On day gengshen, Jingchun memorialized asking to recruit migrant laborers, grant land, and establish checkpoints to aid border defense; assent was given.',
    'On gengshen day, Jingchun won assent to settle migrants on border lands with checkpoints.',
  ],
  s1293: [
    'On day renxu, Yuan Jiasan memorialized the capture of Linhuai Pass; an edict praised him, referred the matter to the boards for merit record, and Muteng\'a was given the vice-president rank.',
    'On renxu day, Yuan Jiasan\'s capture of Linhuai Pass won praise and Muteng\'a received a vice-president rank.',
  ],
  s1294: [
    'On day jiazi, the joint seasonal offering was made at the Imperial Ancestral Temple.',
    'On jiazi day, the joint seasonal offering was made at the Imperial Ancestral Temple.',
  ],
  s1295: [
    'That year, quota levies were remitted in varying degrees for one hundred fifty-seven districts in Zhili, Henan, Shandong, Zhejiang, Guizhou, and other provinces that had suffered disaster or banditry.',
    'That year, tax relief in varying degrees went to 157 districts in Zhili, Henan, Shandong, Zhejiang, Guizhou, and elsewhere hit by disaster or rebels.',
  ],
  s1296: [
    'Korea and Ryukyu sent tribute missions.',
    'Korea and Ryukyu paid tribute.',
  ],
  s1297: [
    'In the tenth year, spring, first month, day bingyin, the Emperor\'s thirtieth-birthday grand celebration was held and an edict of universal grace was issued.',
    'In Xianfeng 10, month 1, bingyin, the Emperor\'s thirtieth birthday brought a grace edict.',
  ],
  s1298: [
    'An edict said that on former dynasties\' birthday festivals there were rites of announcement and ascent to the hall; this year they need not be performed, and outer officials and outer vassals are likewise to cease coming to the capital to offer congratulations.',
    'The court suspended former birthday rites and barred outer officials and tributaries from birthday congratulations in the capital.',
  ],
  s1299: [
    'Grace was extended to imperial clansmen: Prince Dun Yixuan was raised to Prince of the First Rank, Beizi Yikuang to Beile, and the rest received enfeoffments and gifts, extending also to court and frontier ministers.',
    'Imperial clansmen and ministers received birthday enfeoffments and gifts, including Yixuan as prince and Yikuang as beile.',
  ],
  s1300: [
    'On day wuchen, the former Ningxia General Tuo Yunbao died.',
    'On wuchen day, former Ningxia General Tuo Yunbao died.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b13.mjs <translation.json>'
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
