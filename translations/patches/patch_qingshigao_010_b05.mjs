#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day jihai, the Emperor sacrificed at Tailing.',
    'On jihai day, the Emperor offered sacrifice at Tailing.',
  ],
  s0402: [
    'On day xinchou, the Emperor visited the Southern Park for the hunt enclosure.',
    'On xinchou day, the Emperor went to the Southern Park for a hunting round.',
  ],
  s0403: [
    'On day renyin, the Emperor returned to the capital.',
    'On renyin day, the Emperor returned to Beijing.',
  ],
  s0404: [
    'On day bingwu, the Classics lecture was held.',
    'On bingwu day, the Classics lecture was held.',
  ],
  s0405: [
    'From this it was held once each middle month of the season, and this became the annual custom.',
    'Thereafter it was held once in each season\'s middle month as a fixed yearly practice.',
  ],
  s0406: [
    'On day dingwei, assessed tax quotas for thirty-two prefectures, counties, and garrisons in Shandong including Qihe were remitted on account of flood.',
    'On dingwei day, flood-assessed tax quotas were remitted for thirty-two Shandong districts including Qihe.',
  ],
  s0407: [
    'On day xinhai, the Emperor personally ploughed the sacred field, adding one furrow.',
    'On xinhai day, the Emperor personally ploughed the sacred field with one extra push of the plough.',
  ],
  s0408: [
    'From this it was so every year.',
    'This became the annual practice thereafter.',
  ],
  s0409: [
    'On day renzi, Zhao Hong\'en was stripped of office for taking bribes; Gao Qizhuo was made Minister of Works and Zhang Qu Hunan governor.',
    'On renzi day, Zhao Hong\'en lost his post for bribery; Gao Qizhuo became Works Minister and Zhang Qu Hunan governor.',
  ],
  s0410: [
    'Third month, first day guichou: relief was given for typhoon damage in eight counties of Fujian including Min county.',
    'In the third month, on the first guichou day, eight Fujian counties including Min were relieved after a typhoon.',
  ],
  s0411: [
    'On day jiayin, the Emperor went to the Imperial Academy for the sacrifice, ascended the Hall of Constant Norms, and ordered lectures on the Doctrine of the Mean and the Documents.',
    'On jiayin day, the Emperor offered sacrifice at the Academy, took the Hall of Constant Norms, and ordered lectures on the Mean and the Documents.',
  ],
  s0412: [
    'On day yimao, Cui Ji was transferred to be Hubei governor and Zhang Kai Xi\'an governor.',
    'On yimao day, Cui Ji became Hubei governor and Zhang Kai Xi\'an governor.',
  ],
  s0413: [
    'On day jiwei, flood-assessed quotas were remitted for twelve Jiangsu districts including Liuhe, and drought-assessed quotas for ten Guangdong districts including Sanshui.',
    'On jiwei day, water and drought tax quotas were remitted for Jiangsu and Guangdong districts.',
  ],
  s0414: [
    'On day xinyou, twenty-five Jiangsu districts including Shangyuan were relieved for flood, and assessed quotas were also remitted.',
    'On xinyou day, twenty-five Jiangsu districts were relieved and their tax quotas remitted after floods.',
  ],
  s0415: [
    'On day dingmao, the Emperor went to Black Dragon Pool to pray for rain.',
    'On dingmao day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0416: [
    'On day xinwei, drought-assessed tax quotas for Gansu places including Lanzhou were remitted.',
    'On xinwei day, drought tax quotas were remitted for Gansu districts including Lanzhou.',
  ],
  s0417: [
    'On day renshen, because of drought the Ministry of Punishments was ordered to clear common criminal cases.',
    'On renshen day, drought prompted orders to review ordinary prisons at the Ministry of Punishments.',
  ],
  s0418: [
    'On day guiwei, flood-assessed quotas for eleven Anhui districts including Taiping were remitted.',
    'On guiwei day, flood tax quotas were remitted for eleven Anhui districts including Taiping.',
  ],
  s0419: [
    'On day dingchou, tax arrears for Hubei\'s Mianyang prefecture were remitted.',
    'On dingchou day, Mianyang\'s tax arrears in Hubei were forgiven.',
  ],
  s0420: [
    'Summer, fourth month, day jiashen: because of drought an edict again ordered memorials with counsel.',
    'In the fourth month of summer, drought led to renewed orders for candid memorials.',
  ],
  s0421: [
    'Governors\' and governors-general\'s tribute offerings were halted.',
    'Provincial tribute from governors was suspended.',
  ],
  s0422: [
    'Minister of the Court of Colonial Affairs Sengge retired; Nayantai replaced him.',
    'Colonial Affairs Minister Sengge retired and Nayantai took his place.',
  ],
  s0423: [
    'On day jichou, Sun Jia\'gan was transferred to Minister of Personnel; Zhao Guolin was made Minister of Punishments and Sun Guoxi Anhui governor.',
    'On jichou day, Sun Jia\'gan became Personnel Minister; Zhao Guolin became Punishments Minister and Sun Guoxi Anhui governor.',
  ],
  s0424: [
    'On day renchen, Gu Zong was ordered to Zhili to join Zhu Zao in managing river works.',
    'On renchen day, Gu Zong was sent to Zhili to manage rivers with Zhu Zao.',
  ],
  s0425: [
    'Flood-assessed quotas were remitted for Changlu saltworks including Lutai and districts including Hengshui.',
    'Flood tax quotas were remitted for Changlu salt fields and Hengshui districts.',
  ],
  s0426: [
    'Fifth month, day guichou: ten Shaanxi districts including Pucheng were relieved for hail damage.',
    'In the fifth month, ten Shaanxi districts including Pucheng were relieved after hail.',
  ],
  s0427: [
    'On day jiwei, Shandong districts including Zhangqiu were relieved for hail.',
    'On jiwei day, Shandong hail-struck districts including Zhangqiu were relieved.',
  ],
  s0428: [
    'On day gengshen, eight Shaanxi districts including Luonan were relieved for hail.',
    'On gengshen day, eight Shaanxi districts including Luonan were relieved after hail.',
  ],
  s0429: [
    'On day renxu, Miao Asha and others of Guizhou\'s Dingfan prefecture rebelled; Zhang Guangsi suppressed and pacified them.',
    'On renxu day, Dingfan Miao rebels led by Asha were suppressed by Zhang Guangsi.',
  ],
  s0430: [
    'On day xinwei, E\'ertu was transferred to Fengtian general and Bodi Heilongjiang general.',
    'On xinwei day, E\'ertu became Fengtian general and Bodi Heilongjiang general.',
  ],
  s0431: [
    'On day yihai, Jiangnan\'s Songjiang prefecture\'s assessed quota was remitted.',
    'On yihai day, Songjiang\'s assessed tax quota in Jiangnan was remitted.',
  ],
  s0432: [
    'On day xinsi, eight Shaanxi districts including Jingbian were relieved for drought.',
    'On xinsi day, eight drought-struck Shaanxi districts including Jingbian were relieved.',
  ],
  s0433: [
    'Sixth month, day gengyin: four Shandong districts including Dongping were relieved for hail.',
    'In the sixth month, four Shandong districts including Dongping were relieved after hail.',
  ],
  s0434: [
    'On day bingwu, Left Censor-in-chief Yang Rugu asked to retire; permission was granted.',
    'On bingwu day, Left Censor-in-chief Yang Rugu\'s retirement request was approved.',
  ],
  s0435: [
    'Autumn, seventh month, day renzi: former Left Censor-in-chief Peng Weixin was recalled to his former office.',
    'In the seventh month, former Left Censor Peng Weixin was reappointed.',
  ],
  s0436: [
    'On day dingsi, drought-assessed quota for Fujian\'s Zhao\'an county was remitted.',
    'On dingsi day, Zhao\'an\'s drought tax quota in Fujian was remitted.',
  ],
  s0437: [
    'On day guiwei, grain-transport arrears for Zhejiang garrisons including Wenzhou were remitted.',
    'On guiwei day, Wenzhou garrison grain-transport arrears in Zhejiang were forgiven.',
  ],
  s0438: [
    'On day yichou, Shi Yizhi was transferred to Minister of Works and Gao Qizhuo Minister of Revenue.',
    'On yichou day, Shi Yizhi became Works Minister and Gao Qizhuo Revenue Minister.',
  ],
  s0439: [
    'On day dingmao, Zhalang\'a was ordered to enter the Grand Secretariat to handle affairs.',
    'On dingmao day, Zhalang\'a was ordered into the Grand Secretariat.',
  ],
  s0440: [
    'E\'mida was transferred to be governor-general of Sichuan and Shaanxi.',
    'E\'mida became Sichuan-Shaanxi governor-general.',
  ],
  s0441: [
    'Ma\'ertai was made governor-general of the Two Guangs, Chakedan Left Censor-in-chief, and Tuo Shi grain-transport governor-general.',
    'Ma\'ertai took the Two Guangs, Chakedan the left censorate, and Tuo Shi the grain transport post.',
  ],
  s0442: [
    'Grand Secretary Yintai asked to retire; permission was granted.',
    'Grand Secretary Yintai\'s retirement was approved.',
  ],
  s0443: [
    'Eighth month, day bingxu: locusts in Jiangsu\'s Haizhou and Shandong\'s Tancheng and other districts.',
    'In the eighth month, locusts struck Haizhou in Jiangsu and Tancheng in Shandong.',
  ],
  s0444: [
    'Relief was given for floods in Hunan\'s Shimen county and three Gansu counties including Wuwei.',
    'Shimen in Hunan and three Gansu counties including Wuwei were relieved after floods.',
  ],
  s0445: [
    'On day jichou, Haiwang entered mourning; Neqin was made acting Minister of Revenue.',
    'On jichou day, Haiwang went into mourning and Neqin acted as Revenue Minister.',
  ],
  s0446: [
    'On day jihai, the Emperor led the Empress Dowager to visit Tailing.',
    'On jihai day, the Emperor led the Empress Dowager to Tailing.',
  ],
  s0447: [
    'On day guimao, the Emperor went to Tailing to perform the third-anniversary sacrifice.',
    'On guimao day, the Emperor performed the third-anniversary rites at Tailing.',
  ],
  s0448: [
    'On day bingwu, the Emperor lodged the Empress Dowager at the Southern Park and went on a hunting round.',
    'On bingwu day, the Empress Dowager lodged at the Southern Park while the Emperor hunted.',
  ],
  s0449: [
    'On day wushen, forty-eight Anhui districts and garrisons including Wangjiang were relieved for drought.',
    'On wushen day, forty-eight drought-struck Anhui districts including Wangjiang were relieved.',
  ],
  s0450: [
    'Ninth month, first day gengxu: the Emperor led the Empress Dowager back to the palace.',
    'On the first gengxu of the ninth month, the Emperor and Empress Dowager returned to the palace.',
  ],
  s0451: [
    'Hail-assessed tax quotas for fifteen Shaanxi districts including Chang\'an were remitted.',
    'Hail tax quotas were remitted for fifteen Shaanxi districts including Chang\'an.',
  ],
  s0452: [
    'Shandong\'s Zhaoyuan county was relieved for hail damage.',
    'Zhaoyuan in Shandong was relieved after hail.',
  ],
  s0453: [
    'On day wuwu, last year\'s drought-assessed quota for Fujian\'s Zhangpu was remitted.',
    'On wuwu day, Zhangpu\'s prior-year drought tax quota in Fujian was remitted.',
  ],
  s0454: [
    'On day xinyou, Ji Zengyun was ordered to enter the Grand Secretariat to handle affairs and concurrently to manage Yongding River works.',
    'On xinyou day, Ji Zengyun entered the Grand Secretariat and took charge of Yongding River works.',
  ],
  s0455: [
    'The Zhejiang governor-generalship was abolished and the governorship restored; Hao Yulin remained Fujian-Zhejiang governor-general and Lu Chao Zhejiang governor.',
    'Zhejiang\'s governor-general post was cut and a governor restored; Hao Yulin stayed Fujian-Zhejiang governor-general and Lu Chao became Zhejiang governor.',
  ],
  s0456: [
    'On day jiazi, Zhu Zao was relieved; Neqin and Sun Jia\'gan were dispatched to try him.',
    'On jiazi day, Zhu Zao left office and Neqin and Sun Jia\'gan were sent to investigate him.',
  ],
  s0457: [
    'Gu Zong was put in charge of the seal of the director-general of waterways.',
    'Gu Zong took charge of the Grand Canal director-general\'s seal.',
  ],
  s0458: [
    'Annam sent tribute.',
    'Annam presented tribute.',
  ],
  s0459: [
    'On day jisi, Grand Secretary Yintai died.',
    'On jisi day, Grand Secretary Yintai died.',
  ],
  s0460: [
    'Compiler Peng Shukui presented the Ten Reflections Admonition; the Emperor praised and rewarded him.',
    'Compiler Peng Shukui offered the Ten Reflections Admonition and received imperial praise and gifts.',
  ],
  s0461: [
    'Gansu places including Minzhou were relieved for drought.',
    'Drought relief was given for Gansu districts including Minzhou.',
  ],
  s0462: [
    'On day dingchou, flood-assessed quotas for fifty-two Jiangsu districts and garrisons including Jiangning were remitted, and relief was also given.',
    'On dingchou day, fifty-two Jiangsu districts including Jiangning had flood quotas remitted and received relief.',
  ],
  s0463: [
    'On day wuyin, Taiwan was relieved for drought.',
    'On wuyin day, Taiwan received drought relief.',
  ],
  s0464: [
    'Winter, tenth month, first day gengchen: six Shaanxi districts including Anding were relieved for hail.',
    'On the first gengchen of the tenth month, six Shaanxi districts including Anding were relieved after hail.',
  ],
  s0465: [
    'On day xinsi, this year\'s hail-assessed quotas for eight Shandong districts including Zouping were remitted.',
    'On xinsi day, current-year hail tax quotas were remitted for eight Shandong districts including Zouping.',
  ],
  s0466: [
    'On day renwu, tax arrears for flood-struck Zhili districts were remitted.',
    'On renwu day, flood districts in Zhili had tax arrears forgiven.',
  ],
  s0467: [
    'Tax arrears for all disaster-struck districts in Jiangsu and Anhui were remitted.',
    'Disaster districts in Jiangsu and Anhui had tax arrears forgiven.',
  ],
  s0468: [
    'On day xinmao, the second imperial son Yonglian died; court was suspended five days; since taking the throne the Emperor had personally written a secret edict naming Yonglian crown prince, and all rites followed crown prince protocol.',
    'On xinmao day, the second son Yonglian died and court halted five days; he had been named crown prince in a secret edict at accession, and rites followed crown prince usage.',
  ],
  s0469: [
    'Fifty Anhui districts and garrisons including Huaining were relieved for drought.',
    'Fifty drought-struck Anhui districts including Huaining were relieved.',
  ],
  s0470: [
    'On day renchen, Minister of Revenue Gao Qizhuo died.',
    'On renchen day, Revenue Minister Gao Qizhuo died.',
  ],
  s0471: [
    'On day bingshen, Ren Lanzhi was transferred to Minister of Revenue, Zhao Guolin Minister of Rites, Shi Yizhi Minister of Punishments, and Zhao Dianzui Minister of Works.',
    'On bingshen day, Ren Lanzhi became Revenue Minister, Zhao Guolin Rites Minister, Shi Yizhi Punishments Minister, and Zhao Dianzui Works Minister.',
  ],
  s0472: [
    'On day dingyou, Crown Prince Yonglian was given the posthumous title Duanhui Crown Prince.',
    'On dingyou day, Crown Prince Yonglian was posthumously titled Duanhui Crown Prince.',
  ],
  s0473: [
    'Zhili Governor-General Li Wei was excused on account of illness; Sun Jia\'gan was ordered to act in his place.',
    'Li Wei left the Zhili governor-generalship for illness and Sun Jia\'gan was ordered to act.',
  ],
  s0474: [
    'On day jihai, Zhejiang districts including Ji\'an were relieved for drought.',
    'On jihai day, drought relief was given for Zhejiang districts including Ji\'an.',
  ],
  s0475: [
    'On day gengzi, Korea\'s King Yeongjo memorialized congratulating the Empress Dowager\'s honorific title and the empress\'s investiture, and again memorialized thanks for enfeoffing the heir apparent, presenting tribute goods with the memorials.',
    'On gengzi day, King Yeongjo of Korea sent memorials on the empress dowager\'s title and empress\'s investiture, thanked the heir\'s enfeoffment, and presented tribute.',
  ],
  s0476: [
    'On day renyin, the Emperor visited Tiancun to offer sacrifice to Duanhui Crown Prince.',
    'On renyin day, the Emperor went to Tiancun to mourn Duanhui Crown Prince.',
  ],
  s0477: [
    'On day guimao, grain-transport arrears for Jiangnan, Jiangxi, and Henan were remitted.',
    'On guimao day, grain-transport arrears in Jiangnan, Jiangxi, and Henan were forgiven.',
  ],
  s0478: [
    'On day yisi, Sun Jia\'gan was appointed Zhili governor-general; Gan Rulai was made Minister of Personnel with concurrent charge of War, and Yang Chaozeng Minister of War.',
    'On yisi day, Sun Jia\'gan became Zhili governor-general; Gan Rulai took Personnel with War, and Yang Chaozeng the War Ministry.',
  ],
  s0479: [
    'On day bingwu, Gu Zong was appointed Zhili river-course governor-general.',
    'On bingwu day, Gu Zong became Zhili river-course governor-general.',
  ],
  s0480: [
    'Eleventh month, first day jiyou: Guangdong\'s Hainan circuit was restored as the Lei-Qiong circuit, and the Gao-Lei circuit was renamed the Gao-Lian circuit.',
    'On the first jiyou of the eleventh month, Hainan circuit became Lei-Qiong again and Gao-Lei was renamed Gao-Lian.',
  ],
  s0481: [
    'On day gengxu, because Sun Jia\'gan impeached Prince Yunhu, the Emperor praised him and granted merit evaluation.',
    'On gengxu day, the Emperor praised Sun Jia\'gan for impeaching Prince Yunhu and ordered him rewarded.',
  ],
  s0482: [
    'Yunhu was sent down to the Imperial Clan Court for severe deliberation.',
    'Prince Yunhu was referred to the Imperial Clan Court for strict judgment.',
  ],
  s0483: [
    'On day renzi, six Jiangsu districts and garrisons including Huating were relieved for drought.',
    'On renzi day, six drought-struck Jiangsu districts including Huating were relieved.',
  ],
  s0484: [
    'Hunan\'s Shimen county was relieved for drought.',
    'Shimen in Hunan received drought relief.',
  ],
  s0485: [
    'On day guichou, insect-assessed quotas for four Fengtian districts including Ningyuan were remitted.',
    'On guichou day, insect tax quotas were remitted for four Fengtian districts including Ningyuan.',
  ],
  s0486: [
    'Gui\'an and Wucheng in Zhejiang and four Shaanxi districts including Suide were relieved for hail, and six Hubei districts including Xiaogan for drought.',
    'Zhejiang\'s Gui\'an and Wucheng, four Shaanxi hail districts including Suide, and six Hubei drought districts including Xiaogan were relieved.',
  ],
  s0487: [
    'On day guichou, drought-assessed quotas for eight Henan districts including Xinyang were remitted.',
    'On guichou day, drought tax quotas were remitted for eight Henan districts including Xinyang.',
  ],
  s0488: [
    'Hubei\'s Yingshan, Sichuan\'s Zhongzhou, and one other district were relieved for drought.',
    'Yingshan in Hubei, Zhongzhou in Sichuan, and one other district received drought relief.',
  ],
  s0489: [
    'On day yichou, assessed rent for lake shoals in Jiangnan\'s Huai\'an and Xuzhou prefectures was remitted.',
    'On yichou day, lake-shoal rent quotas in Huai\'an and Xuzhou in Jiangnan were remitted.',
  ],
  s0490: [
    'Hail-assessed quota for Shandong\'s Zhaoyuan county was remitted.',
    'Zhaoyuan\'s hail tax quota in Shandong was remitted.',
  ],
  s0491: [
    'On day gengwu, Grand Secretary Ji Zengyun asked to retire on account of illness; permission was granted.',
    'On gengwu day, Grand Secretary Ji Zengyun\'s sick-leave retirement was approved.',
  ],
  s0492: [
    'On day renshen, Ningxia in Gansu was shaken by earthquake; water surged into the new canal, Baofeng county seat was submerged, two hundred thousand taels were issued from the Lanzhou treasury, and Vice Minister of War Bandi was ordered to give relief.',
    'On renshen day, a Ningxia earthquake flooded the new canal and submerged Baofeng; 200,000 taels were sent and Bandi ordered to relieve the disaster.',
  ],
  s0493: [
    'On day yihai, Minister of Personnel Xinggui asked to retire; permission was granted.',
    'On yihai day, Personnel Minister Xinggui\'s retirement was approved.',
  ],
  s0494: [
    'On day dingchou, tax arrears for Zhili prefectures and departments including Xuanhua were remitted.',
    'On dingchou day, Xuanhua and other Zhili districts had tax arrears forgiven.',
  ],
  s0495: [
    'Twelfth month, first day yimao: Neqin was transferred to Minister of Personnel.',
    'On the first yimao of the twelfth month, Neqin became Personnel Minister.',
  ],
  s0496: [
    'On day gengchen, six Sichuan counties including Shehong were relieved for flood.',
    'On gengchen day, six flood-struck Sichuan counties including Shehong were relieved.',
  ],
  s0497: [
    'The Two Huai saltworks were relieved for this year\'s drought.',
    'This year\'s drought relief was given to the Two Huai salt fields.',
  ],
  s0498: [
    'On day bingxu, Peng Weixin was stripped of office; Wei Tingzhen was made Left Censor-in-chief.',
    'On bingxu day, Peng Weixin was dismissed and Wei Tingzhen became Left Censor-in-chief.',
  ],
  s0499: [
    'On day dinghai, Ningxia in Gansu was shaken by earthquake.',
    'On dinghai day, Ningxia in Gansu suffered an earthquake.',
  ],
  s0500: [
    'On day jiawu, Pingfan in Gansu was relieved for insect damage.',
    'On jiawu day, Pingfan in Gansu received relief from insect damage.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b05.mjs <translation.json>'
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
