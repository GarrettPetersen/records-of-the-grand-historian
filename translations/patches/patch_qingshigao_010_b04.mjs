#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'On day bingshen, drought and hail relief was granted for Deping, Yanggu, and other districts of Shandong.',
    'On bingshen day, Shandong districts including Deping and Yanggu received drought and hail relief.',
  ],
  s0302: [
    'On day renyin, drought relief was granted for eighty-one prefectures, counties, and garrisons of Shuntian including Wanping and Qingyuan.',
    'On renyin day, eighty-one Shuntian districts received drought relief.',
  ],
  s0303: [
    'At the Hall of Cultivating Humanity the Emperor held the palace examination for the supplemental erudite scholars and appointed Wan Songling and others to office.',
    'Supplemental erudite scholars were examined at Tiren Hall; Wan Songling and others received posts.',
  ],
  s0304: [
    'On day bingchen, provinces were ordered to remit quota land tax; amounts already paid were to count toward the next year\'s regular levy—established as a standing rule.',
    'On bingchen day, quota tax remissions were ordered; prepayments could offset next year\'s levy by rule.',
  ],
  s0305: [
    'Flood relief was granted for fourteen prefectures and counties of Anhui including Yixian.',
    'Fourteen Anhui districts including Yixian received flood relief.',
  ],
  s0306: [
    'Eighth month, new moon on day dingsi: hail relief was granted for three counties of Shaanxi including Ansai.',
    'In the eighth month, on the new moon of dingsi, three Shaanxi counties received hail relief.',
  ],
  s0307: [
    'Yao bandits in Chengbu county, Hunan, were pacified.',
    'Hunan\'s Chengbu Yao rebels were subdued.',
  ],
  s0308: [
    'Drought relief was granted for four counties of Gansu including Pingfan.',
    'Four Gansu counties including Pingfan received drought relief.',
  ],
  s0309: [
    'Four grain-transport censors were ordered to station separately at Huai\'an, Jining, Tianjin, and Tongzhou.',
    'Four canal censors were posted to Huai\'an, Jining, Tianjin, and Tongzhou.',
  ],
  s0310: [
    'On day jiaxu, Ortai was ordered to investigate Zhili river and waterworks in detail.',
    'On jiaxu day, Ortai was told to survey Zhili waterways.',
  ],
  s0311: [
    'On day bingzi, Gu Cong was made acting governor-general of Zhili river works.',
    'On bingzi day, Gu Cong became acting Zhili river governor-general.',
  ],
  s0312: [
    'On day dingchou, seven-tenths of unpaid quota tax for flood in Dangshan, Jiangsu, was remitted.',
    'On dingchou day, Dangshan\'s flood tax arrears were cut by seventy percent.',
  ],
  s0313: [
    'On day renwu, the post of commander at Weining garrison in Guizhou was restored.',
    'On renwu day, Guizhou\'s Weining garrison commander was reinstated.',
  ],
  s0314: [
    'The Zhejiang fish-scale stone seawall was built.',
    'Zhejiang\'s stone seawall was constructed.',
  ],
  s0315: [
    'This year\'s drought quota tax was remitted for twenty-eight prefectures, counties, and garrisons of Shandong including Licheng.',
    'Twenty-eight Shandong districts including Licheng had drought taxes forgiven.',
  ],
  s0316: [
    'On day jiashen, drought relief was granted for Huining, Gansu, and flood relief for Xiapu and other districts of Fujian.',
    'On jiashen day, Gansu drought and Fujian flood districts received relief.',
  ],
  s0317: [
    'Ninth month, day xinmao: Northern Route deputy commissioner Hadai was recalled to the capital; Mani replaced him.',
    'In the ninth month, Hadai left the northern front and Mani took his post.',
  ],
  s0318: [
    'On day yiwei, the Dzungar Muslim Mir Hashur submitted.',
    'On yiwei day, the Dzungar Mir Hashur surrendered.',
  ],
  s0319: [
    'On day yiwei, Yang Yongbin was made governor of Jiangsu.',
    'On yiwei day, Yang Yongbin became Jiangsu governor.',
  ],
  s0320: [
    'On day jihai, coastal wind disaster relief was granted for Min county and other Fujian districts.',
    'On jihai day, Fujian coastal wind victims received relief.',
  ],
  s0321: [
    'On day jiachen, censors were admonished not to memorialize out of private motive.',
    'On jiachen day, censors were warned against partisan memorializing.',
  ],
  s0322: [
    'Shi Yizhi was summoned to the capital.',
    'Shi Yizhi was recalled to Beijing.',
  ],
  s0323: [
    'De Pei was made governor-general of Huguang; Yuan Zhancheng was made governor of Gansu.',
    'De Pei took Huguang; Yuan Zhancheng, Gansu.',
  ],
  s0324: [
    'Drought relief was granted for twelve prefectures and counties of Shanxi including Xing county.',
    'Twelve Shanxi districts including Xing county received drought relief.',
  ],
  s0325: [
    'On day xinhai, flood relief was granted for Ningxia county, Gansu.',
    'On xinhai day, Ningxia county received flood relief.',
  ],
  s0326: [
    'On day guichou, last year\'s summer tax for Ning prefecture, Yunnan, was remitted.',
    'On guichou day, Yunnan\'s Ningzhou had last summer\'s tax forgiven.',
  ],
  s0327: [
    'On day yimao, Nasutu was made acting Minister of War.',
    'On yimao day, Nasutu became acting Minister of War.',
  ],
  s0328: [
    'Intercalary ninth month, day guihai: this year\'s flood quota tax was remitted for four counties of Henan including Xihua.',
    'In the intercalary ninth month, four Henan counties had flood taxes remitted.',
  ],
  s0329: [
    'On day dingmao, Yin Jishan was made Minister of Punishments, concurrently handling Ministry of War affairs.',
    'On dingmao day, Yin Jishan took Punishments and war duties.',
  ],
  s0330: [
    'Qing Fu was transferred to be governor-general of Yunnan.',
    'Qing Fu became Yunnan governor-general.',
  ],
  s0331: [
    'Nasutu was made governor-general of the Two Jiangs.',
    'Nasutu became Two Jiangs governor-general.',
  ],
  s0332: [
    'On day jiaxu, flood relief was granted for salt-households at Changlu, Lutai, and other salterns.',
    'On jiaxu day, saltern flood victims at Changlu and Lutai received relief.',
  ],
  s0333: [
    'Miscellaneous taxes in Yuanzhou and Raozhou prefectures, Jiangxi, were abolished.',
    'Jiangxi abolished surtaxes in Yuanzhou and Raozhou.',
  ],
  s0334: [
    'On day bingzi, work at the Malanyu mausoleum was completed.',
    'On bingzi day, Malanyu tomb works were finished.',
  ],
  s0335: [
    'On day xinsi, wind disaster relief was granted for Xiapu and one other Fujian county.',
    'On xinsi day, two Fujian counties received wind relief.',
  ],
  s0336: [
    'On day renwu, flood relief was granted for Xiaoqing River post station in Fengtian.',
    'On renwu day, Fengtian\'s Xiaoqing River station received flood relief.',
  ],
  s0337: [
    'Yunnan provincial treasurer Chen Hongmou was referred for stern review for disrespectful memorializing on provincial land reclamation.',
    'Chen Hongmou faced discipline for a disrespectful reclamation memorial.',
  ],
  s0338: [
    'Flood relief was granted for twenty-five prefectures and counties of Jiangsu including Shangyuan, with supplemental relief in varying amounts.',
    'Twenty-five Jiangsu districts received flood relief with extra grants by case.',
  ],
  s0339: [
    'Hail relief was granted for Anshun and other prefectures and districts of Guizhou.',
    'Guizhou hail districts including Anshun received relief.',
  ],
  s0340: [
    'Winter, tenth month, new moon on day yiyou: frost relief was granted for three counties of Shanxi including Yongji.',
    'In the tenth month, on the new moon of yiyou, three Shanxi counties received frost relief.',
  ],
  s0341: [
    'On day dinghai, the three mausoleums at Mukden were repaired.',
    'On dinghai day, Mukden\'s three imperial tombs were restored.',
  ],
  s0342: [
    'On day wuzi, the Emperor went to the Eastern Tombs.',
    'On wuzi day, the Emperor visited the Eastern Tombs.',
  ],
  s0343: [
    'On day xinmao, the Emperor paid respects at Zhaoxi, Xiaoling, and Xiaodong tombs.',
    'On xinmao day, he worshipped at Zhaoxi, Xiaoling, and Xiaodong.',
  ],
  s0344: [
    'On day yiwei, the Emperor returned to the capital.',
    'On yiwei day, the Emperor returned to Beijing.',
  ],
  s0345: [
    'On day bingshen, Zhang Jiahan, garrison commander at Anxi, was sentenced to death for extorting military supplies.',
    'On bingshen day, Anxi commander Zhang Jiahan was condemned to death for squeezing the army.',
  ],
  s0346: [
    'Cui Ji was made governor of Shaanxi; Yin Huiyi governor of Henan; Zhang Kai governor of Hubei.',
    'Cui Ji took Shaanxi; Yin Huiyi, Henan; Zhang Kai, Hubei.',
  ],
  s0347: [
    'On day jihai, Grand Secretary Yin Tai requested retirement; a warm edict kept him in office.',
    'On jihai day, Yin Tai\'s retirement plea was met with a stay.',
  ],
  s0348: [
    'On day guimao, flood relief was granted for twenty-eight prefectures and garrisons of Shandong including Qihe.',
    'On guimao day, twenty-eight Shandong districts received flood relief.',
  ],
  s0349: [
    'This year\'s insect-disaster quota tax was remitted for Chun county, Jiangnan; unpaid silver and grain for Taoyuan and two other counties.',
    'Chun county\'s insect tax was forgiven; Taoyuan and two counties had arrears cleared.',
  ],
  s0350: [
    'On day dingwei, flood relief was granted in Heilongjiang.',
    'On dingwei day, Heilongjiang flood victims received relief.',
  ],
  s0351: [
    'On day wushen, the Hall of Imperial Ancestors was repaired.',
    'On wushen day, Fengxian Hall was restored.',
  ],
  s0352: [
    'On day xinhai, drought quota tax was remitted for Pingfan, Gansu.',
    'On xinhai day, Pingfan\'s drought tax was forgiven.',
  ],
  s0353: [
    'Eleventh month, day yimao: drought relief was granted for Shouzhou and Huoqiu, Anhui.',
    'In the eleventh month, Shouzhou and Huoqiu received drought relief.',
  ],
  s0354: [
    'This year\'s flood quota tax was remitted for eight prefectures and counties of Shaanxi including Jingbian.',
    'Eight Shaanxi districts including Jingbian had flood taxes remitted.',
  ],
  s0355: [
    'On day dingsi, Korea\'s king Yi Gyeong asked to invest his heir Yi Sado; the Ministry of Rites said he was under age, but the Emperor specially granted it.',
    'On dingsi day, Korea\'s heir investiture was granted despite his youth.',
  ],
  s0356: [
    'On day guihai, hail relief was granted for three subprefectures and counties of Guizhou including Langdai.',
    'On guihai day, three Guizhou districts received hail relief.',
  ],
  s0357: [
    'On day yichou, flooded quota tax at Hejin, Shanxi, was remitted.',
    'On yichou day, Hejin\'s flood tax was forgiven.',
  ],
  s0358: [
    'On day bingyin, flood relief was granted for eleven prefectures, counties, and garrisons of Anhui including Taiping.',
    'On bingyin day, eleven Anhui districts received flood relief.',
  ],
  s0359: [
    'On day xinwei, the Emperor went to Tailing; the chief steward was changed to vice commander-in-chief.',
    'On xinwei day, at Tailing the chief steward became a vice commander-in-chief.',
  ],
  s0360: [
    'Arrears were remitted for Tongshan and Dangshan, Jiangnan.',
    'Jiangnan\'s Tongshan and Dangshan tax arrears were cleared.',
  ],
  s0361: [
    'On day renyin, sacrifice was reported at Tailing; the Emperor ended mourning dress.',
    'On renyin day, Tailing rites were reported and mourning dress ended.',
  ],
  s0362: [
    'On day yihai, drought relief was granted for Huan county and Lanzhou, Gansu, and ten counties of Guangdong including Sanshui.',
    'On yihai day, Gansu and Guangdong drought districts received relief.',
  ],
  s0363: [
    'The Emperor returned to the capital.',
    'The Emperor returned to Beijing.',
  ],
  s0364: [
    'On day wuyin, on the Empress Dowager\'s birthday she took the seat at Cining Palace; the Emperor led princes and ministers in congratulations.',
    'On wuyin day, the court congratulated the Empress Dowager at Cining Palace.',
  ],
  s0365: [
    'Henceforth this was done every year.',
    'The birthday rite became annual.',
  ],
  s0366: [
    'On day jimao, drought poll-tax silver was remitted for four prefectures and counties of Shanxi including Xing county.',
    'On jimao day, four Shanxi districts had drought poll tax forgiven.',
  ],
  s0367: [
    'On day gengchen, the Grand Council was ordered re-established; Grand Secretaries Ortai and Zhang Tingyu, Ministers Neqin and Haiwang, and Vice Ministers Nayantai and Bandi were made grand councillors.',
    'On gengchen day, the Grand Council returned with Ortai, Zhang Tingyu, Neqin, Haiwang, Nayantai, and Bandi.',
  ],
  s0368: [
    'Twelfth month, new moon on day jiashen: grain transport director Bu Xi was dismissed; Zhakedan replaced him.',
    'In the twelfth month, Bu Xi left the grain transport post and Zhakedan succeeded him.',
  ],
  s0369: [
    'Laibao was made Minister of Works.',
    'Laibao became Minister of Works.',
  ],
  s0370: [
    'Last year\'s flood quota tax was remitted for Funing, Jiangnan.',
    'Funing\'s prior flood tax was forgiven.',
  ],
  s0371: [
    'On day dinghai, the Emperor took the throne at the Hall of Supreme Harmony and invested his principal consort of the Fuca clan as Empress.',
    'On dinghai day, the Fuca consort was invested empress at Taihe Hall.',
  ],
  s0372: [
    'On day wuzi, the Empress Dowager was escorted to Cining Palace; after princes and ministers congratulated, the Emperor took the Hall of Supreme Harmony, officials congratulated, and an amnesty edict was issued with graduated grace.',
    'On wuzi day, empress rites brought court congratulations and a graded amnesty.',
  ],
  s0373: [
    'On day xinmao, flood quota tax was remitted for twelve prefectures and counties of Jiangsu including Lishui.',
    'On xinmao day, twelve Jiangsu districts had flood taxes forgiven.',
  ],
  s0374: [
    'On day renchen, hail relief was granted for three counties of Shaanxi including Fugu.',
    'On renchen day, three Shaanxi counties received hail relief.',
  ],
  s0375: [
    'On day jiawu, because the empress investiture was complete, the Empress Dowager received the honorific Chongqing Cixuan.',
    'On jiawu day, the empress rite brought the honorific Chongqing Cixuan.',
  ],
  s0376: [
    'The Empress Dowager was escorted to Cining Palace; the Emperor led congratulations; next day an amnesty edict with graduated grace was issued.',
    'Cining congratulations were followed next day by a graded amnesty.',
  ],
  s0377: [
    'On day jihai, this year\'s drought saltern levy was remitted in Zhili.',
    'On jihai day, Zhili\'s drought saltern tax was forgiven.',
  ],
  s0378: [
    'Flood quota tax was remitted for Ningxia, Gansu.',
    'Ningxia\'s flood tax was remitted.',
  ],
  s0379: [
    'On day renyin, Ortai was enfeoffed as third-class baron.',
    'On renyin day, Ortai became a third-class baron.',
  ],
  s0380: [
    'Wind and tide disaster relief was granted for six counties of Fujian including Min and seven counties of Guangdong including Haikang.',
    'Fujian and Guangdong wind-tide districts received relief.',
  ],
  s0381: [
    'Grand Secretary Mai Zhu requested leave for illness; it was granted.',
    'Mai Zhu retired sick with approval.',
  ],
  s0382: [
    'Ryukyu sent tribute goods.',
    'Ryukyu paid tribute.',
  ],
  s0383: [
    'On day guimao, Zhang Tingyu was enfeoffed as third-class baron.',
    'On guimao day, Zhang Tingyu became a third-class baron.',
  ],
  s0384: [
    'On day xinhai, flood relief was granted for Zhuozhou.',
    'On xinhai day, Zhuozhou received flood relief.',
  ],
  s0385: [
    'Third year, spring, first month, new moon on day jiayin: the Emperor for the first time held New Year\'s court; he led princes and civil and military officials to congratulate the Empress Dowager at Shoukang Palace, then took the Hall of Supreme Harmony to receive congratulations.',
    'In year 3, on the New Year new moon, Hongli first held court and congratulated the empress dowager at Shoukang.',
  ],
  s0386: [
    'Henceforth this was done every New Year.',
    'The New Year court rite became annual.',
  ],
  s0387: [
    'On day yimao, Fu Min was made Grand Secretary of the Hall of Military Glory; Maertai was made Left Censor-in-chief.',
    'On yimao day, Fu Min joined the Grand Secretariat and Maertai became Left Censor-in-chief.',
  ],
  s0388: [
    'On day xinyou, prayer for grain was offered to Heaven with Shizong associated in the sacrifice.',
    'On xinyou day, the grain prayer paired Yongzheng as collateral spirit.',
  ],
  s0389: [
    'On day guihai, the Classics lecture was ordered held.',
    'On guihai day, the Classics lecture was restored.',
  ],
  s0390: [
    'On day jiazi, the Emperor for the first time visited the Old Summer Palace; the Empress Dowager was lodged at Shenyiyang Spring Garden.',
    'On jiazi day, Hongli first went to Yuanmingyuan and lodged the empress dowager at Shenyiyang.',
  ],
  s0391: [
    'On day wuchen, at the Hall of Rectitude and Bright Light he gave a banquet to foreign tributaries at New Year court and to inner ministers and grand secretaries.',
    'On wuchen day, he feasted tributary envoys and inner ministers at Zhengda Guangming.',
  ],
  s0392: [
    'On day guiyou, Zhu Zao was made Zhili river governor-general; Gu Cong assisted river affairs.',
    'On guiyou day, Zhu Zao took Zhili rivers and Gu Cong assisted.',
  ],
  s0393: [
    'On day dingchou, the Dzungar Galdan Tseren sent envoys bearing a memorial to the capital with sable furs.',
    'On dingchou day, Galdan Tseren\'s envoys arrived with tribute sables.',
  ],
  s0394: [
    'Vice Minister Agedun was sent as chief envoy; bodyguard Wangzhar and Qianqingmen taiji Emergen as deputies, bearing an imperial letter to fix borders with the Dzungars.',
    'Agedun led envoys Wangzhar and Emergen to the Dzungars to settle the frontier.',
  ],
  s0395: [
    'On day jimao, the Emperor returned from the Old Summer Palace to the palace.',
    'On jimao day, the Emperor left Yuanmingyuan for the Forbidden City.',
  ],
  s0396: [
    'On day xinsi, because the Emperor was visiting Tailing, Ortai was ordered to manage affairs in the capital.',
    'On xinsi day, Ortai ran Beijing while the emperor went to Tailing.',
  ],
  s0397: [
    'Second month, day dinghai: sacrifice was offered to Confucius.',
    'In the second month, on dinghai day, Confucius was honored.',
  ],
  s0398: [
    'On day wuzi, he visited the Old Summer Palace.',
    'On wuzi day, he went to Yuanmingyuan.',
  ],
  s0399: [
    'On day guisi, the Dzungar envoy had audience; silver and coins were granted in varying amounts.',
    'On guisi day, the Dzungar envoy was received and rewarded.',
  ],
  s0400: [
    'On day wuxu, the Emperor paid respects at Tailing.',
    'On wuxu day, the Emperor worshipped at Tailing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b04.mjs <translation.json>'
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
