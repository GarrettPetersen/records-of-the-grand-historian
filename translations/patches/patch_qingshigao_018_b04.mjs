#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Rations and house-repair funds were issued to soldiers and civilians flooded in seven Hunan counties and guards including Wuling.',
    'Wuling and six other Hunan districts received flood rations and repair funds.',
  ],
  s0302: [
    'Eighth month, day jiyou: Zhejiang\'s northern sea wall at Beitang was rebuilt as a stone dike.',
    'On jiyou in the eighth month, Zhejiang\'s Beitang sea wall became a stone dike.',
  ],
  s0303: [
    'On day guichou, Wuzhong\'e was made Uliassutai general with Lunbuduo\'erji acting.',
    'On guichou, Wuzhong\'e took Uliassutai and Lunbuduo\'erji acted.',
  ],
  s0304: [
    'Songpu was made Rehe military governor.',
    'Songpu became Rehe military governor.',
  ],
  s0305: [
    'On day gengshen, the sub-tribes on Sichuan\'s Qian border were pacified.',
    'On gengshen, Sichuan\'s Qian border tribes were pacified.',
  ],
  s0306: [
    'Lu Kun reported that the English merchant Napier had come to Canton, wrote letters styling himself as Great Britain, and asked that trade be suspended.',
    'Lu Kun reported Napier\'s arrival at Canton, British-letter arrogance, and a request to halt trade.',
  ],
  s0307: [
    'An edict approved this.',
    'The Emperor approved.',
  ],
  s0308: [
    'On day xinyou, the Emperor offered tea and wine before Empress Xiaoshen\'s coffin-palace.',
    'On xinyou, the Emperor mourned at Empress Xiaoshen\'s coffin.',
  ],
  s0309: [
    'That month, flood relief was given at three places in Mukden including Gaizhou, Jiande and Chun\'an in Zhejiang, and twenty-five counties in Jiangxi including Nanchang.',
    'That month, floods were relieved in Mukden, Zhejiang, and Jiangxi.',
  ],
  s0310: [
    'Granary grain was loaned for drought in six Gansu counties including Gaolan.',
    'Gaolan and five other Gansu counties received drought grain loans.',
  ],
  s0311: [
    'Old and new quota taxes were remitted and deferred for twenty-five Jiangxi prefectures and counties including Nanchang.',
    'Nanchang and twenty-four other Jiangxi districts received tax remissions.',
  ],
  s0312: [
    'Ninth month, day yichou: English warships entered the inner reaches of Guangdong; Lu Kun was stripped of rank but retained in office.',
    'In the ninth month on yichou, British warships entered Guangdong\'s inner river and Lu Kun was demoted yet kept in post.',
  ],
  s0313: [
    'On day gengwu, the Emperor reviewed troops of the Vanguard Camp.',
    'On gengwu, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0314: [
    'On day guiyou, when the English warships left port, Lu Kun was restored as Junior Tutor of the Heir Apparent but still dismissed from office yet retained in post.',
    'On guiyou, after British ships left, Lu Kun regained Junior Heir Apparent Tutor rank but remained dismissed yet in post.',
  ],
  s0315: [
    'That month, flood relief was given in seven Zhili prefectures and counties including Wanping and four Fengtian prefectures, counties, and subprefectures including Xinmin.',
    'That month, floods were relieved in Zhili and Fengtian.',
  ],
  s0316: [
    'Seed grain was loaned for floods in Guangdong\'s Guangzhou and Zhaoqing prefectures; granary grain to flooded Banner people of the hunting Ula.',
    'Guangzhou, Zhaoqing, and flooded Ula Banner people received seed and grain loans.',
  ],
  s0317: [
    'Old and new quota taxes were remitted and deferred for floods in fifty-one Zhili prefectures and counties including Dacheng and Taiyuan County, Shanxi.',
    'Dacheng and fifty other districts plus Taiyuan received flood tax remissions.',
  ],
  s0318: [
    'Tenth month, day jiyou: Imperial Noble Consort of the Niuhuru clan was made Empress; an edict granted differentiated favors.',
    'On jiyou in the tenth month, Niuhuru was made Empress and favors were announced.',
  ],
  s0319: [
    'On day renzi, the Emperor conferred on the Empress Dowager the honorific title "Reverent, Kind, Tranquil, Prosperous, Accomplished, Solemn, Bountiful Empress Dowager"; an edict granted broad differentiated favors.',
    'On renzi, the Empress Dowager received a new honorific title and broad favors were granted.',
  ],
  s0320: [
    'On day xinyou, Na Qing\'an was dismissed for illness; Jingzheng was made Minister of War and Yihao Left Censor-in-Chief.',
    'On xinyou, Na Qing\'an left office; Jingzheng took War and Yihao the Left Censorate.',
  ],
  s0321: [
    'That month, flood relief was given in three Hubei counties and guards including Huangmei and four Hunan counties and guards including Anxiang.',
    'That month, Huangmei and Anxiang districts received flood relief.',
  ],
  s0322: [
    'Ration grain was loaned for drought and hail in eight Gansu prefectures and counties including Gaolan.',
    'Gaolan and seven other Gansu districts received drought and hail ration loans.',
  ],
  s0323: [
    'Eleventh month, day yichou: Wang Shouhe was transferred to Minister of Rites and Shi Zhiyi Minister of Works.',
    'On yichou in the eleventh month, Wang Shouhe took Rites and Shi Zhiyi Works.',
  ],
  s0324: [
    'On day renshen, Minister of Rites Shengyin died; Yihao was made Minister of Rites and Enming Left Censor-in-Chief.',
    'On renshen, Shengyin died; Yihao took Rites and Enming the Left Censorate.',
  ],
  s0325: [
    'Zhu Weibi was transferred to Grand Canal transport governor-general.',
    'Zhu Weibi became canal transport governor-general.',
  ],
  s0326: [
    'On day bingzi, Gunchuke Celeng was made Tarbagatai assistant military governor.',
    'On bingzi, Gunchuke Celeng became Tarbagatai assistant governor.',
  ],
  s0327: [
    'On day jimao, Minister of Punishments Dai Dunyuan died; Shi Zhiyi was transferred to replace him.',
    'On jimao, Dai Dunyuan died and Shi Zhiyi replaced him at Punishments.',
  ],
  s0328: [
    'Wang Yinzhi was made Minister of Works.',
    'Wang Yinzhi became Minister of Works.',
  ],
  s0329: [
    'On day gengchen, Wuergong\'e was made Zhejiang governor.',
    'On gengchen, Wuergong\'e became Zhejiang governor.',
  ],
  s0330: [
    'On day bingxu, Wen Fu was made Grand Secretary superintending the Board of Personnel.',
    'On bingxu, Wen Fu became Grand Secretary over Personnel.',
  ],
  s0331: [
    'Muzhang\'a was transferred to Minister of Personnel and associate Grand Secretary; Qiying Minister of Revenue; Jingzheng Minister of Works; Yihao Minister of War.',
    'Muzhang\'a took Personnel and became associate Grand Secretary; Qiying Revenue; Jingzheng Works; Yihao War.',
  ],
  s0332: [
    'Zaiquan was made Minister of Rites.',
    'Zaiquan became Minister of Rites.',
  ],
  s0333: [
    'Minister of Works Wang Yinzhi died.',
    'Wang Yinzhi died.',
  ],
  s0334: [
    'On day dinghai, He Linghan was made Minister of Works and Wu Chun Left Censor-in-Chief.',
    'On dinghai, He Linghan took Works and Wu Chun the Left Censorate.',
  ],
  s0335: [
    'That month, flood disaster in Lishui County, Zhejiang, was relieved.',
    'That month, Lishui received flood relief.',
  ],
  s0336: [
    'Old and new quota taxes were remitted and deferred for floods in sixteen Zhejiang prefectures, counties, and guards including Jiande.',
    'Jiande and fifteen other Zhejiang districts received flood tax remissions.',
  ],
  s0337: [
    'Twelfth month, day jisi: Kokand again invaded Selikul; Xingde and others were ordered to admonish them.',
    'On jisi in the twelfth month, Kokand invaded Selikul again and Xingde was sent to remonstrate.',
  ],
  s0338: [
    'Wen Fu was ordered made Eastern Pavilion Grand Secretary.',
    'Wen Fu became Eastern Pavilion Grand Secretary.',
  ],
  s0339: [
    'On day bingshen, Yi bandits on Sichuan\'s Qian border rebelled again; Yang Fang was reduced to second-rank marquis, stripped of imperial bodyguard status, and placed on reserve as regional commander.',
    'On bingshen, Qian border Yi rebelled again; Yang Fang was demoted to second-rank marquis and lost bodyguard rank.',
  ],
  s0340: [
    'On day jiachen, Heilongjiang general Fusengde was transferred to Xi\'an general; Yijing replaced him.',
    'On jiachen, Fusengde went to Xi\'an and Yijing to Heilongjiang.',
  ],
  s0341: [
    'On day guichou, the Emperor prayed for snow at the Dagao Hall.',
    'On guichou, the Emperor prayed for snow at Dagao.',
  ],
  s0342: [
    'That month, pay was loaned to camp troops in Zhili disaster areas; silver and grain to Jiangning Eight Banner officers and soldiers; seed and embankment-repair funds to nine Guangdong counties including Nanhai.',
    'That month, Zhili troops, Jiangning Banner troops, and nine Guangdong counties received loans and repair funds.',
  ],
  s0343: [
    'That year, Korea, Ryukyu, Burma, and Siam sent tribute.',
    'That year, Korea, Ryukyu, Burma, and Siam paid tribute.',
  ],
  s0344: [
    'Fifteenth year, spring, first month, day jiazi: Grand Secretary Cao Zhenyong died.',
    'In spring of year 15, on jiazi, Cao Zhenyong died.',
  ],
  s0345: [
    'On day renwu, Changling, for accepting Kokand gifts, was removed as imperial attendant minister managing the Board of Revenue.',
    'On renwu, Changling lost his attendant minister post over Kokand gifts.',
  ],
  s0346: [
    'On day bingxu, Shaanxi-Gansu governor-general Yang Yuchun retired but was warmly ordered to come to the capital.',
    'On bingxu, Yang Yuchun retired yet was invited warmly to Beijing.',
  ],
  s0347: [
    'Husong\'e was made Shaanxi-Gansu governor-general.',
    'Husong\'e became Shaanxi-Gansu governor-general.',
  ],
  s0348: [
    'Baoxing was transferred to Chengdu general.',
    'Baoxing became Chengdu general.',
  ],
  s0349: [
    'Yijing was made Mukden general; Baochang Heilongjiang general; Suqing\'a Jilin general.',
    'Yijing took Mukden, Baochang Heilongjiang, and Suqing\'a Jilin.',
  ],
  s0350: [
    'That month, disaster-struck Banner households at three places in Fengtian including Niuzhuang were relieved.',
    'That month, Niuzhuang and two other Fengtian Banner districts were relieved.',
  ],
  s0351: [
    'Rations were issued in nine Jiangxi counties including Nanchang and six Gansu prefectures and counties including Jingyuan.',
    'Nanchang and eight other Jiangxi counties and six Gansu districts received rations.',
  ],
  s0352: [
    'Granary grain and seed were loaned to disaster victims in three Shanxi prefectures and counties including Taiyuan, twenty-six Jiangxi prefectures and counties including Nanchang, four Hunan prefectures and counties including Anxiang, and Qinzhou and Jingyuan, Gansu.',
    'Disaster districts in Shanxi, Jiangxi, Hunan, and Gansu received grain and seed loans.',
  ],
  s0353: [
    'Second month, day bingshen: Ruan Yuan was made Grand Secretary superintending Punishments; Wang Ding associate Grand Secretary; Yilibu Yunnan-Guizhou governor-general; He Xuan Yunnan governor.',
    'On bingshen in the second month, Ruan Yuan took Punishments, Wang Ding became associate Grand Secretary, Yilibu Yunnan-Guizhou, and He Xuan Yunnan.',
  ],
  s0354: [
    'On day gengzi, Qimingbao was ordered to act as Heilongjiang general.',
    'On gengzi, Qimingbao acted as Heilongjiang general.',
  ],
  s0355: [
    'On day dingwei, Changling was ordered to manage the Court of Colonial Affairs; Wen Fu Revenue; Pan Shien Works; Ruan Yuan was reassigned to War; Wang Ding Punishments.',
    'On dingwei, Changling took Colonial Affairs, Wen Fu Revenue, Pan Works, Ruan War, and Wang Ding Punishments.',
  ],
  s0356: [
    'Li Huan, Korean royal heir, was invested as King of Korea.',
    'Li Huan succeeded as King of Korea.',
  ],
  s0357: [
    'On day wuwu, Jilin general Suqing\'a died; Baochang was transferred to replace him.',
    'On wuwu, Suqing\'a died and Baochang replaced him at Jilin.',
  ],
  s0358: [
    'Xiangkang was made Heilongjiang general.',
    'Xiangkang became Heilongjiang general.',
  ],
  s0359: [
    'Third month: bandit Cao Shun rebelled in Zhaocheng County, Shanxi; prefectural judge Yang Yanliang died resisting and they then besieged Huozhou.',
    'In month 3, Cao Shun rebelled at Zhaocheng, Yang Yanliang fell, and Huozhou was besieged.',
  ],
  s0360: [
    'E Shun\'an was ordered to suppress them.',
    'E Shun\'an was sent to suppress the rebels.',
  ],
  s0361: [
    'On day yihai, the Emperor personally plowed the ceremonial field.',
    'On yihai, the Emperor plowed the sacred field.',
  ],
  s0362: [
    'He visited the Southern Park for the hunt enclosure.',
    'The Emperor went to the Southern Park to hunt.',
  ],
  s0363: [
    'On day gengchen, the Emperor returned to the capital.',
    'On gengchen, the Emperor returned to Beijing.',
  ],
  s0364: [
    'That month, rations were issued for crop failure in five Gansu prefectures, counties, and subprefectures including Gaolan.',
    'That month, Gaolan and four other Gansu districts received famine rations.',
  ],
  s0365: [
    'Summer, fourth month: Sichuan\'s Qian border sub-tribes were pacified; E Shan was promoted to Grand Guardian of the Heir Apparent and given double-eyed peacock feathers.',
    'In the fourth month, Qian border tribes were pacified and E Shan gained Grand Guardian rank and peacock feathers.',
  ],
  s0366: [
    'On day jiayin, 276 men including Liu Yi were granted advanced scholar and palace graduate ranks with distinctions.',
    'On jiayin, 276 graduates including Liu Yi received jinshi honors with distinctions.',
  ],
  s0367: [
    'On day dingsi, the Emperor prayed for rain at the Black Dragon Pool shrine.',
    'On dingsi, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0368: [
    'Fifth month, day dingmao: retired Shaanxi-Gansu governor-general Yang Yuchun was advanced to first-rank marquis with full salary.',
    'On dingmao in the fifth month, retired Yang Yuchun became a first-rank marquis at full pay.',
  ],
  s0369: [
    'On day xinwei, bandit chiefs Cao Shun and others were executed.',
    'On xinwei, Cao Shun and fellow leaders were executed.',
  ],
  s0370: [
    'On day dingchou, the Emperor again prayed for rain at the Black Dragon Pool shrine.',
    'On dingchou, the Emperor again prayed for rain at Black Dragon Pool.',
  ],
  s0371: [
    'Li Yumei was made Grand Canal east-route governor-general.',
    'Li Yumei became east-route canal governor-general.',
  ],
  s0372: [
    'On day gengchen, rain fell.',
    'On gengchen, it rained.',
  ],
  s0373: [
    'That month, granary grain was loaned for drought in two Shanxi counties, Fengtai and Qinshui.',
    'That month, Fengtai and Qinshui received drought grain loans.',
  ],
  s0374: [
    'Sixth month, day bingwu: quota taxes on flooded reed fields in Dantu, Jiangsu, were reduced.',
    'On bingwu in the sixth month, Dantu flooded reed-field taxes were cut.',
  ],
  s0375: [
    'Intercalary sixth month, day dingmao: Jingzheng was demoted and transferred; Zaiquan Minister of Works; Enming Minister of Rites; Wuzhong\'e Left Censor-in-Chief.',
    'On dingmao in the intercalary sixth month, Jingzheng was demoted, Zaiquan took Works, Enming Rites, and Wuzhong\'e the Left Censorate.',
  ],
  s0376: [
    'Baochang was transferred to Uliassutai general; Xiangkang Jilin general; Hafeng\'a Heilongjiang general.',
    'Baochang went to Uliassutai, Xiangkang to Jilin, and Hafeng\'a to Heilongjiang.',
  ],
  s0377: [
    'On day jisi, this autumn\'s executions were suspended.',
    'On jisi, autumn executions were halted.',
  ],
  s0378: [
    'Autumn, seventh month, day jiachen: Wen Fu was removed as Grand Councilor but still ordered to serve as Grand Secretary superintending Personnel.',
    'On jiachen in the seventh month, Wen Fu left the Grand Council yet kept Personnel as Grand Secretary.',
  ],
  s0379: [
    'Pan Shien was reassigned to manage Revenue; Muzhang\'a Works.',
    'Pan Shien took Revenue and Muzhang\'a Works.',
  ],
  s0380: [
    'Right Vice Minister of Punishments Zhao Shengkui and Right Vice Minister of Works Saishang\'a were ordered to study under the Grand Councilors.',
    'Zhao Shengkui and Saishang\'a were assigned to train with the Grand Council.',
  ],
  s0381: [
    'That month, rations were issued for floods in Mian and Luochuan counties, Shaanxi, and drought in three Hunan counties and guards including Huarong.',
    'That month, Mian, Luochuan, and Huarong districts received disaster rations.',
  ],
  s0382: [
    'Eighth month, day jiazi: for the Empress Dowager\'s sixtieth birthday, overdue taxes in all provinces were universally remitted.',
    'On jiazi in the eighth month, overdue provincial taxes were remitted for the Empress Dowager\'s sixtieth birthday.',
  ],
  s0383: [
    'On day gengchen, an edict said: "Censorial officials Feng Zunxun, Jin Yinglin, Huang Juezi, and Zeng Wangyan have been promoted to metropolitan offices so that loyal remonstrance may be broadened. You must not avoid grudges; whenever there are failures in people\'s livelihood, state policy, appointments and administration, or governance, still report the facts frankly at any time so they may be adopted."',
    'On gengchen, an edict promoted four censors to broaden remonstrance and ordered frank reporting on governance failures without avoiding grudges.',
  ],
  s0384: [
    'Guangdong-Guangxi governor-general Lu Kun died; Deng Tingzhen was made governor-general with Qi acting; Sebuxing\'e Anhui governor.',
    'Lu Kun died; Deng Tingzhen became governor-general with Qi acting and Sebuxing\'e Anhui governor.',
  ],
  s0385: [
    'On day jiashen, the Emperor visited the Western Tombs.',
    'On jiashen, the Emperor visited the Western Tombs.',
  ],
  s0386: [
    'That day, Empress Xiaoshen\'s coffin-palace was moved from Tiancun; five-tenths of quota taxes along the route were remitted.',
    'That day, Empress Xiaoshen\'s coffin left Tiancun and route taxes were cut by half.',
  ],
  s0387: [
    'That month, hail-disaster rations were issued in Fugu County, Shaanxi.',
    'That month, Fugu received hail rations.',
  ],
  s0388: [
    'Ninth month, day jichou: coffin-palaces of Empresses Xiaomu and Xiaoshen reached Longquanyu; the Emperor mourned in person.',
    'On jichou in the ninth month, both empresses\' coffins reached Longquanyu and the Emperor mourned there.',
  ],
  s0389: [
    'On day gengyin, the Emperor returned to the capital.',
    'On gengyin, the Emperor returned to Beijing.',
  ],
  s0390: [
    'On day wuxu, Lin Qing was appointed Jiangnan canal-route governor-general.',
    'On wuxu, Lin Qing became Jiangnan canal governor-general.',
  ],
  s0391: [
    'On day bingwu, Zhu Weibi was dismissed for illness; Enteheng\'e was made Grand Canal transport governor-general.',
    'On bingwu, Zhu Weibi left office and Enteheng\'e became canal transport governor-general.',
  ],
  s0392: [
    'That month, rations were issued to saltern households flooded at two Lianghuai fields, Banpu and Zhongzheng.',
    'That month, flooded Banpu and Zhongzheng saltern workers received rations.',
  ],
  s0393: [
    'Quota taxes were deferred for hail in Yulin County and Jia Prefecture, Shaanxi, and drought in nine Jiangxi counties including Jinxi.',
    'Yulin, Jia, and nine Jiangxi counties including Jinxi received tax deferrals.',
  ],
  s0394: [
    'Winter, tenth month, day wuwu: Yushu was made Kobdo assistant military governor.',
    'On wuwu in the tenth month, Yushu became Kobdo assistant governor.',
  ],
  s0395: [
    'On day jiazi, for the Empress Dowager\'s sixtieth sacred birthday, the honorific title "Reverent, Kind, Prosperous, Tranquil, Accomplished, Solemn, Bountiful, Longevous, Auspicious Empress Dowager" was conferred.',
    'On jiazi, the Empress Dowager received a sixtieth-birthday honorific title.',
  ],
  s0396: [
    'On day yichou, the Empress Dowager\'s sixtieth sacred birthday: the Emperor led princes, dukes, and ministers to the Palace of Longevity and Health to perform congratulatory rites.',
    'On yichou, the Emperor led the court to congratulate the Empress Dowager at Shoukang Palace.',
  ],
  s0397: [
    'The Emperor ascended the Hall of Supreme Harmony; ministers presented memorials and performed congratulatory rites.',
    'At Taihe Hall, ministers presented birthday congratulations.',
  ],
  s0398: [
    'An edict granted differentiated favors throughout the empire.',
    'An edict granted empire-wide differentiated favors.',
  ],
  s0399: [
    'Funiyang\'a was made Urumchi military governor.',
    'Funiyang\'a became Urumchi military governor.',
  ],
  s0400: [
    'On day guiwei, Censor Tang Peng was dismissed for impeaching Zaiquan contrary to the imperial will.',
    'On guiwei, Tang Peng was dismissed for impeaching Zaiquan against the throne\'s will.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b04.mjs <translation.json>'
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
