#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day bingzi, silver was ordered distributed in relief to the six banners of Sunid; all was drawn from the treasury, with no deduction from princes\', beiles\', and other stipends.',
    'On bingzi day, Sunid relief silver came from the treasury without docking princely stipends.',
  ],
  s0202: [
    'On day xinsi, Qingfu memorialized that the assault on Gua\'erya had met success in successive battles.',
    'On xinsi day, Qingfu reported victories at Gua\'erya.',
  ],
  s0203: [
    'An edict said: "Capturing only petty stockades and forts—how can that comfort Us?',
    'An edict said petty forts taken were no comfort to the throne.',
  ],
  s0204: [
    '" On day renwu, flood relief was granted for three Zhejiang counties including Shouchang.',
    'On renwu day, three Zhejiang counties including Shouchang received flood relief.',
  ],
  s0205: [
    'On day yiyou, flood relief was granted for fifteen prefectures, counties, and garrisons in Zhili including Bazhou.',
    'On yiyou day, fifteen Zhili districts including Bazhou received flood relief.',
  ],
  s0206: [
    'Flood relief was granted for nine Hunan counties including Leiyang, Chaoyi in Shaanxi, and three Guangdong counties including Shunde.',
    'Flood relief reached Hunan, Shaanxi, and Guangdong districts.',
  ],
  s0207: [
    'Ninth month, new moon on day wuzi: registered tax quotas on localities the court passed through were remitted by three-tenths.',
    'In the ninth month, transit districts had taxes remitted by three-tenths.',
  ],
  s0208: [
    'Drought relief was granted for ten Gansu counties including Fuqiang and three Yunnan prefectures and counties including Anning.',
    'Drought relief reached Gansu and Yunnan districts.',
  ],
  s0209: [
    'The Emperor, escorting the Empress Dowager, returned to lodge at the Mountain Resort.',
    'The Emperor and Empress Dowager returned to the Mountain Resort.',
  ],
  s0210: [
    'On day guisi, because of tidal disaster at Chongming in Jiangsu, in which more than twelve thousand people drowned, next year\'s registered taxes were remitted and relief continued.',
    'On guisi day, Chongming tidal disaster brought tax remission and continued relief.',
  ],
  s0211: [
    'On day yisi, flood relief was granted for eight Anhui prefectures, counties, and garrisons including She County, twenty-seven Henan prefectures and counties including Tongxu, and eighty-seven Shandong prefectures and counties including Qihe.',
    'On yisi day, flood relief reached Anhui, Henan, and Shandong in large numbers.',
  ],
  s0212: [
    'On day dingyou, the Emperor, escorting the Empress Dowager, returned from the tour.',
    'On dingyou day, the imperial party returned from tour.',
  ],
  s0213: [
    'On day yisi, one hundred thousand shi of Fengtian grain was allocated to relieve Shandong.',
    'On yisi day, 100,000 shi of Fengtian grain relieved Shandong.',
  ],
  s0214: [
    'On day dingwei, retired Grand Secretary Zha Lang\'a died.',
    'On dingwei day, the retired Grand Secretary Zha Lang\'a died.',
  ],
  s0215: [
    'On day wushen, an edict on Jiangsu\'s audit of accumulated arrears stripped both Chen Weixin and Vice Minister Chen Dehua of office for evasion.',
    'On wushen day, Chen Weixin and Chen Dehua were dismissed for evading the Jiangsu arrears audit.',
  ],
  s0216: [
    'On day renzi, flood relief was granted for Xuzhou in Henan.',
    'On renzi day, Henan\'s Xuzhou received flood relief.',
  ],
  s0217: [
    'On day jiayin, Gu Cong was made Zhejiang governor and Yun Zhu Grand Canal transport director-general.',
    'On jiayin day, Gu Cong became Zhejiang governor and Yun Zhu canal director-general.',
  ],
  s0218: [
    'On day yimao, flood relief was granted for twenty salt fields in the Two Huai region including Lütian.',
    'On yimao day, twenty Two Huai salt fields received flood relief.',
  ],
  s0219: [
    'On day dingsi, Chen Dashou was made Minister of War; Pan Sirong was transferred to be Fujian governor, and Na Min made Anhui governor.',
    'On dingsi day, Chen Dashou became War Minister; Pan Sirong went to Fujian and Na Min to Anhui.',
  ],
  s0220: [
    'Winter, tenth month, day xinyou: because Sulu again sent envoys to Fujian to settle the matter of Luzon natives robbing the tribute mission, an edict said: "Island barbarians quarrel among themselves; they may be left to settle it themselves, without partiality on Our part.',
    'In the tenth month, an edict told Fujian to let Sulu and Luzon settle their dispute without favor.',
  ],
  s0221: [
    '" On day yichou, because the Empress Dowager was ill, the Emperor went to the Cining Palace to inquire after her health and oversee medicine.',
    'On yichou day, the Emperor tended the ill Empress Dowager at Cining Palace.',
  ],
  s0222: [
    'That day he lodged at the Cining Palace.',
    'He stayed overnight at Cining Palace.',
  ],
  s0223: [
    'He oversaw medicine three times daily; this continued through day xinwei.',
    'Medicine was supervised thrice daily until xinwei day.',
  ],
  s0224: [
    'On day gengwu, flood relief was granted for twenty Jiangsu prefectures, counties, and garrisons including Funing.',
    'On gengwu day, twenty Jiangsu districts including Funing received flood relief.',
  ],
  s0225: [
    'On day dingchou, registered tax quotas were remitted for flood-stricken places in Jilin.',
    'On dingchou day, Jilin flood districts had taxes remitted.',
  ],
  s0226: [
    'On day wuyin, flood relief was granted for eleven Zhejiang counties including Haining.',
    'On wuyin day, eleven Zhejiang counties including Haining received flood relief.',
  ],
  s0227: [
    'On day jimao, because Dzungars were going to Tibet to boil tea, zaisang Bayasihulang and others came to Debu\'erte to trade, and Qingfu was recalled to the capital.',
    'On jimao day, Qingfu was recalled as Dzungar traders reached Debu\'erte.',
  ],
  s0228: [
    'On day renwu, flood relief was granted for nineteen Jiangsu prefectures, counties, and garrisons including Changshu for tidal disaster, and fifteen including Shangyuan for drought; Jiangsu was ordered again to retain four hundred thousand shi of next year\'s tribute grain for relief.',
    'On renwu day, Jiangsu tidal and drought districts were relieved and 400,000 shi of grain retained.',
  ],
  s0229: [
    'On day guimao, Zhang Guangsi was instructed not to accept Suoluoben\'s surrender.',
    'On guimao day, Zhang Guangsi was told to reject Suoluoben\'s surrender.',
  ],
  s0230: [
    'Eleventh month, new moon on day dinghai: the Emperor went to the Empress Dowager to oversee medicine three times daily; this continued through day jichou.',
    'In the eleventh month, the Emperor tended the Empress Dowager\'s medicine thrice daily through jichou.',
  ],
  s0231: [
    'Aligun was summoned to the capital; Hehehu was made Shandong governor.',
    'Aligun was recalled and Hehehu made Shandong governor.',
  ],
  s0232: [
    'On day guisi, famine relief was granted for three Zhejiang counties including Shouchang, and disaster-stricken registered taxes were made up.',
    'On guisi day, Shouchang and two other counties received famine relief and tax make-up.',
  ],
  s0233: [
    'On day jiyou, imperial son-in-law Celeng had an audience; Tarma Shan was made acting deputy general at Dingbian.',
    'On jiyou day, Celeng had an audience and Tarma Shan acted at Dingbian.',
  ],
  s0234: [
    'On day gengxu, Jiangsu counties including Chongming received graded relief for disaster victims.',
    'On gengxu day, Chongming and other Jiangsu counties received graded relief.',
  ],
  s0235: [
    'On day guichou, Shandong prefectures, counties, and garrisons including Dongping received relief for disaster victims.',
    'On guichou day, Shandong districts including Dongping received disaster relief.',
  ],
  s0236: [
    'On day xinyou, flood relief was granted for Anhui prefectures, counties, and garrisons including She County.',
    'On xinyou day, Anhui flood districts including She County were relieved.',
  ],
  s0237: [
    'On day jisi, Xu Qi was summoned to the capital; Chen Hongmou was transferred to be Shaanxi governor, and Peng Shukui made acting Hubei governor.',
    'On jisi day, Xu Qi was recalled; Chen Hongmou went to Shaanxi and Peng Shukui acted in Hubei.',
  ],
  s0238: [
    'Flood relief was granted for eighty-five Shandong prefectures and counties including Qihe.',
    'Eighty-five Shandong districts including Qihe received flood relief.',
  ],
  s0239: [
    'On day xinwei, retired Grand Secretary Xu Ben died.',
    'On xinwei day, the retired Grand Secretary Xu Ben died.',
  ],
  s0240: [
    'On day yihai, because Zhang Guangsi was advancing against Greater Jinchuan, Huang Tinggui was made acting governor-general of Shaanxi and Gansu.',
    'On yihai day, Zhang Guangsi marched on Greater Jinchuan and Huang Tinggui acted in Shaanxi-Gansu.',
  ],
  s0241: [
    'Flood relief was granted for six Zhili prefectures and counties including Tianjin.',
    'Six Zhili districts including Tianjin received flood relief.',
  ],
  s0242: [
    'Zhang Guangsi memorialized that Suoluoben sought surrender and was told that in this campaign there would be no end short of extermination.',
    'Zhang Guangsi reported Suoluoben\'s surrender offer and was told the war would not end until he was destroyed.',
  ],
  s0243: [
    'The Emperor encouraged him with the words "You have found the right men."',
    'The Emperor praised Zhang Guangsi for having the right subordinates.',
  ],
  s0244: [
    'On day jimao, because Grand Secretary Qingfu, advancing against Dondup, had reported that Ban Gun\'s self-immolation was untrue, he was stripped of office to await punishment.',
    'On jimao day, Qingfu was dismissed for falsely reporting Ban Gun\'s self-immolation in Dondup.',
  ],
  s0245: [
    'Because both Bandi and Nu San had also reported Ban Gun\'s self-immolation, they were removed from attendance before the throne.',
    'Bandi and Nu San lost their posts at court for the false self-immolation report.',
  ],
  s0246: [
    'On day gengchen, Laibao was made Grand Secretary of the Hall of Military Glory.',
    'On gengchen day, Laibao became a Wuying Hall Grand Secretary.',
  ],
  s0247: [
    'Thirteenth year, spring, first month, day renchen: flood relief was granted for Jiangsu counties including Funing and five Anhui prefectures and counties including Suzhou.',
    'In the thirteenth year\'s first month, Jiangsu and Anhui flood districts were relieved.',
  ],
  s0248: [
    'On day gengzi, Fu Heng was ordered concurrently to administer the Ministry of War.',
    'On gengzi day, Fu Heng took charge of War as well.',
  ],
  s0249: [
    'On day xinchou, Neqin was ordered to go to Zhejiang with Gao Bin jointly to try Governor Chang An.',
    'On xinchou day, Neqin and Gao Bin were sent to try Zhejiang Governor Chang An.',
  ],
  s0250: [
    'On day yisi, Akedun was ordered to assist as Grand Secretary, and Fu Heng to assist in Grand Secretariat affairs for the imperial tour.',
    'On yisi day, Akedun and Fu Heng were assigned to assist the Grand Secretariat.',
  ],
  s0251: [
    'On day wushen, the Emperor reached Caoba Tun.',
    'On wushen day, the Emperor reached Caoba Tun.',
  ],
  s0252: [
    'On day jiayin, Grand Secretary Zhang Tingyu asked to retire; a warm edict urged him to remain, he ceased concurrently administering Personnel, and Laibao replaced him.',
    'On jiayin day, Zhang Tingyu\'s retirement was refused and Laibao took Personnel.',
  ],
  s0253: [
    'Second month, day wuwu: the Emperor made an eastern tour, escorting the Empress Dowager and leading the Empress to depart.',
    'In the second month, the Emperor began an eastern tour with the Empress Dowager and Empress.',
  ],
  s0254: [
    'On day guihai, the Emperor halted at Zhaobeikou; the Empress Dowager reviewed the water hunt.',
    'On guihai day, the court halted at Zhaobeikou for the Empress Dowager\'s water hunt.',
  ],
  s0255: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu presented tribute.',
  ],
  s0256: [
    'On day jiazi, flood relief was granted for fifteen Zhili prefectures and counties including Tianjin.',
    'On jiazi day, fifteen Zhili districts including Tianjin received flood relief.',
  ],
  s0257: [
    'On day bingyin, Chang An was stripped of office for greedy exactions.',
    'On bingyin day, Chang An was dismissed for corruption.',
  ],
  s0258: [
    'On day renshen, secret-society bandits rose at Ouning in Fujian; Regional Commander Liu Qizong suppressed them.',
    'On renshen day, Liu Qizong suppressed Ouning secret-society rebels.',
  ],
  s0259: [
    'On day guiyou, disaster districts in Shandong that the court passed through received one additional month of relief.',
    'On guiyou day, transit Shandong disaster districts gained a month of relief.',
  ],
  s0260: [
    'Qitong\'a was removed as chief commandant of the imperial bodyguard; Aligun replaced him.',
    'Qitong\'a was dismissed as bodyguard chief and Aligun replaced him.',
  ],
  s0261: [
    'On day yihai, registered tax quotas were remitted by three-tenths for prefectures and counties in Zhili and Shandong that the court passed through.',
    'On yihai day, Zhili and Shandong transit districts had taxes remitted by three-tenths.',
  ],
  s0262: [
    'On day wuyin, the Emperor halted at Qufu County and remitted the jisi year\'s registered taxes for Qufu, Tai\'an, and Licheng in Shandong where the court lodged.',
    'On wuyin day, the Emperor halted at Qufu and remitted taxes for three Shandong counties.',
  ],
  s0263: [
    'On day jimao, after the libation rite was completed, the Emperor visited the Kong forest.',
    'On jimao day, the Emperor completed the sacrifice and visited the Kong forest.',
  ],
  s0264: [
    'He went to offer sacrifice at the tomb of Shaohao and at the temple of the Duke of Zhou.',
    'He sacrificed at Shaohao\'s tomb and the Duke of Zhou\'s temple.',
  ],
  s0265: [
    'He ordered a curved yellow umbrella left for the Hall of Great Completion and granted a banquet to the Duke Yansheng Kong Zhaohuan and the erudites.',
    'A yellow umbrella was left at the Confucius hall and Kong Zhaohuan and the erudites were feasted.',
  ],
  s0266: [
    'On day renwu, the Emperor halted at Tai\'an prefecture.',
    'On renwu day, the Emperor halted at Tai\'an.',
  ],
  s0267: [
    'On day guimao, the Emperor sacrificed at the Mount Tai temple; the Empress Dowager ascended the peak.',
    'On guimao day, the Emperor sacrificed at Mount Tai and the Empress Dowager climbed the peak.',
  ],
  s0268: [
    'Third month, day yiyou: sentences of prisoners awaiting execution, reprieve, and military exile or below were reduced in Zhili and Shandong.',
    'In the third month, Zhili and Shandong criminal sentences were reduced.',
  ],
  s0269: [
    'On day dinghai, Bandi was ordered to the Jinchuan army camp to consult on military affairs.',
    'On dinghai day, Bandi was sent to the Jinchuan camp.',
  ],
  s0270: [
    'Zhang Guangsi and Bandi were instructed to transfer Yue Zhongqi to the army camp for use as regional commander.',
    'Zhang Guangsi and Bandi were told to bring Yue Zhongqi to camp as regional commander.',
  ],
  s0271: [
    'On day wuzi, the Emperor reached Jinan prefecture and visited Baotu Spring.',
    'On wuzi day, the Emperor reached Jinan and visited Baotu Spring.',
  ],
  s0272: [
    'On day jichou, the Emperor, escorting the Empress Dowager, reviewed troops and visited the temple of Emperor Shun.',
    'On jichou day, the Emperor reviewed troops and visited Shun\'s temple with the Empress Dowager.',
  ],
  s0273: [
    'On day gengyin, the Emperor inspected the city and visited Lixia Pavilion.',
    'On gengyin day, the Emperor inspected Jinan and visited Lixia Pavilion.',
  ],
  s0274: [
    'This year\'s tribute grain was remitted for five Zhejiang counties including Yuyao because of tidal disaster.',
    'Five Zhejiang tidal-disaster counties including Yuyao had tribute grain remitted.',
  ],
  s0275: [
    'On day renchen, the Emperor, escorting the Empress Dowager and leading the Empress, returned from the tour.',
    'On renchen day, the imperial party turned back from the eastern tour.',
  ],
  s0276: [
    'On day guisi, last year\'s flood-stricken registered taxes were remitted for seven Anhui prefectures, counties, and garrisons including She County.',
    'On guisi day, seven Anhui flood districts had last year\'s taxes remitted.',
  ],
  s0277: [
    'On day yiwei, the Emperor reached Dezhou and boarded a boat; the Empress died; Prince Zhuang Yunlu and Prince He Hongzhou were ordered to escort the Empress Dowager back to the capital; the Emperor halted at Dezhou.',
    'On yiwei day, the Empress died at Dezhou; Yunlu and Hongzhou escorted the Empress Dowager home.',
  ],
  s0278: [
    'Wan Yan Wei was summoned to the capital; Gu Cong was made Hedong river conservancy director-general, and Ai Bida Zhejiang governor.',
    'Wan Yan Wei was recalled; Gu Cong took Hedong rivers and Ai Bida Zhejiang.',
  ],
  s0279: [
    'Associate Grand Secretary and Minister of Personnel Liu Yuyi died.',
    'Associate Grand Secretary Liu Yuyi died.',
  ],
  s0280: [
    'On day xinchou, the court returned to the capital.',
    'On xinchou day, the Emperor returned to Beijing.',
  ],
  s0281: [
    'The late Empress\'s coffin reached the capital and was placed in Changchun Palace.',
    'The late Empress\'s coffin was installed at Changchun Palace.',
  ],
  s0282: [
    'The Emperor suspended court for nine days.',
    'Court was suspended for nine days.',
  ],
  s0283: [
    'On day renyin, an earthquake struck twenty-three Sichuan prefectures, counties, and garrisons including Chengdu.',
    'On renyin day, twenty-three Sichuan districts including Chengdu were shaken.',
  ],
  s0284: [
    'On day jiachen, the Empress Dowager reached the capital; the Emperor welcomed her back to the Palace of Longevity and Health.',
    'On jiachen day, the Empress Dowager returned to Shoukang Palace.',
  ],
  s0285: [
    'On day yisi, the Emperor went to Changchun Palace before the late Empress\'s coffin to offer mourning.',
    'On yisi day, the Emperor mourned before the coffin at Changchun Palace.',
  ],
  s0286: [
    'On day bingwu, the Emperor personally fixed the late Empress\'s posthumous title as Empress Xiaoxian.',
    'On bingwu day, the late Empress received the title Xiaoxian.',
  ],
  s0287: [
    'Because the eldest imperial son, being in mourning, could not fully perform the rites, tutors and Manchu instructors had their stipends reduced by graded amounts.',
    'The eldest son\'s tutors were fined graded stipends for incomplete mourning rites.',
  ],
  s0288: [
    'On day dingwei, the Emperor went to Changchun Palace before the late Empress\'s coffin to perform the secondary mourning rite.',
    'On dingwei day, the Emperor performed secondary mourning at Changchun Palace.',
  ],
  s0289: [
    'Gao Bin and Liu Tongxun were ordered to investigate and manage Shandong relief affairs.',
    'Gao Bin and Liu Tongxun were assigned Shandong relief.',
  ],
  s0290: [
    'On day jiyou, the late Empress\'s coffin was moved to the Hall of Observing Virtue.',
    'On jiyou day, the coffin was moved to Guande Hall.',
  ],
  s0291: [
    'An edict on the late Empress was promulgated to the provinces.',
    'Provinces received an edict on the late Empress.',
  ],
  s0292: [
    'Envoys were dispatched to bear the edict to Korea and to Inner Jasak, Khalkha, Hami, Qinghai, and other places.',
    'Edict-bearers were sent to Korea, Inner Jasak, Khalkha, Hami, Qinghai, and elsewhere.',
  ],
  s0293: [
    'On day xinhai, Ai Bida was transferred to be Guizhou governor, and Fang Guancheng made Zhejiang governor.',
    'On xinhai day, Ai Bida went to Guizhou and Fang Guancheng to Zhejiang.',
  ],
  s0294: [
    'On day dingsi, Fu Heng, Nasutu, Zhang Guangsi, and Bandi were made Junior Guardians of the Heir Apparent; Ka\'erjishan Junior Mentor of the Heir Apparent.',
    'On dingsi day, Fu Heng, Nasutu, Zhang Guangsi, Bandi, and Ka\'erjishan received heir-apparent honors.',
  ],
  s0295: [
    'On day gengshen, Fu Qing, deputy commander at Tibet, was summoned to the capital; Labudun replaced him.',
    'On gengshen day, Fu Qing was recalled from Tibet and Labudun replaced him.',
  ],
  s0296: [
    'Yilezhen, chief commandant of the imperial bodyguard of the Plain White Banner, died; Nasutu and Wangzhale acted in his place.',
    'Yilezhen died; Nasutu and Wangzhale acted as bodyguard chiefs.',
  ],
  s0297: [
    'Laibao was relieved of concurrently serving as bodyguard chief; Feng\'an replaced him.',
    'Laibao ceased as bodyguard chief and Feng\'an replaced him.',
  ],
  s0298: [
    'On day renxu, the Emperor went to Guande Hall to sacrifice to the late Empress.',
    'On renxu day, the Emperor sacrificed to the late Empress at Guande Hall.',
  ],
  s0299: [
    'On day jiazi, Neqin was made commissioner-general of Sichuan military affairs.',
    'On jiazi day, Neqin became Sichuan commissioner-general.',
  ],
  s0300: [
    'Associate Grand Secretary Akedun was dismissed; Fu Heng replaced him and was also ordered concurrently to administer the Ministry of Personnel.',
    'Akedun was dismissed; Fu Heng replaced him and took charge of Personnel as well.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b03.mjs <translation.json>'
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
