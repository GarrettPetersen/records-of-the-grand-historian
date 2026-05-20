#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'That day, heavy rain fell.',
    'Heavy rain fell that day.',
  ],
  s0402: [
    'Zhaohui was ordered to advance on Kashgar and Fude on Yarkand.',
    'Orders went to Zhaohui for Kashgar and Fude for Yarkand.',
  ],
  s0403: [
    'On day jiaxu, locusts struck Haizhou and other Jiangsu districts and Lanshan and other Shandong counties; Qiu Yuexiu and Haiming were instructed to suppress them.',
    'On jiaxu day, locusts hit Jiangsu and Shandong districts and Qiu Yuexiu and Haiming were told to fight them.',
  ],
  s0404: [
    'On day bingzi, an English merchant ship went to Ningbo to trade; Zhuang Yougong memorialized that it be turned away.',
    'On bingzi day, an English ship sought trade at Ningbo and Zhuang Yougong had it refused.',
  ],
  s0405: [
    'Li Shiyao was instructed to summon foreign merchants and show them the prohibitions.',
    'Li Shiyao was told to gather foreign traders and read them the restrictions.',
  ],
  s0406: [
    'Intercalary sixth month, day bingxu: quota tax for last year was remitted for three Fujian counties including Taiwan for wind disaster.',
    'In intercalary month 6, bingxu, last year\'s wind-disaster tax was forgiven in three Fujian counties including Taiwan.',
  ],
  s0407: [
    'On day dingyou, drought relief was given for Gaolan and other Gansu prefectures and counties.',
    'On dingyou day, Gansu drought districts including Gaolan were relieved.',
  ],
  s0408: [
    'On day gengzi, Burdan abandoned Kashgar and fled.',
    'On gengzi day, Burdan fled Kashgar.',
  ],
  s0409: [
    'On day jiachen, Khoja Jahan abandoned Yarkand and fled.',
    'On jiachen day, Khoja Jahan fled Yarkand.',
  ],
  s0410: [
    'On day bingwu, Liu Lun was made Left Censor-in-chief.',
    'On bingwu day, Liu Lun became Left Censor-in-chief.',
  ],
  s0411: [
    'On day wushen, because of Gansu drought, exiles for the year to Barkul and other places were not dispatched.',
    'On wushen day, Gansu drought halted this year\'s exile shipments to Barkul.',
  ],
  s0412: [
    'Seventh month, autumn, new moon on day jiyou: Zhaohui and others reported that Muslim populations of Kashgar and Yarkand welcomed surrender.',
    'On the seventh-month new moon, jiyou, Zhaohui reported Kashgar and Yarkand Muslims submitting.',
  ],
  s0413: [
    'Burdan and Khoja Jahan fled toward Badakhshan.',
    'Burdan and Khoja Jahan escaped to Badakhshan.',
  ],
  s0414: [
    'Aligun and others were ordered to lead troops against Barchuk.',
    'Aligun was sent to attack Barchuk.',
  ],
  s0415: [
    'On day gengxu, Zhaohui and others were instructed to pursue Burdan and Khoja Jahan.',
    'On gengxu day, Zhaohui was ordered to hunt Burdan and Khoja Jahan.',
  ],
  s0416: [
    'Chebudengzhab was ordered to garrison Yili lest Khoja Jahan and others enter Russia.',
    'Chebudengzhab was stationed at Yili to block flight into Russia.',
  ],
  s0417: [
    'On day xinhai, because of ineffective locust control, Chen Hongmou was stripped of his governor-general title.',
    'On xinhai day, Chen Hongmou lost his governor-general rank for poor locust work.',
  ],
  s0418: [
    'On day renzi, the Emperor accompanied the Empress Dowager in setting out for the autumn hunt at Mulan.',
    'On renzi day, the court left for the Mulan autumn hunt with the Empress Dowager.',
  ],
  s0419: [
    'On day jiwei, the Emperor accompanied the Empress Dowager in halting at the Mountain Resort for Summer Retreat.',
    'On jiwei day, the court halted at the Summer Resort with the Empress Dowager.',
  ],
  s0420: [
    'Collection of drought quota tax was suspended for thirty-nine Shanxi prefectures, counties, and subprefectures including Yangqu.',
    'Drought quota tax collection was halted in thirty-nine Shanxi districts including Yangqu.',
  ],
  s0421: [
    'On day dingchou, the Xi\'an governor-general became Sichuan-Shaanxi governor-general, the Sichuan governor-general became Sichuan governor, and the Gansu governor became Gansu governor-general managing governor affairs.',
    'On dingchou day, Xi\'an, Sichuan, and Gansu posts were reorganized into Sichuan-Shaanxi governor-general, Sichuan governor, and Gansu governor-general.',
  ],
  s0422: [
    'Kaitai was made Sichuan-Shaanxi governor-general and Yang Yingju Gansu governor-general.',
    'Kaitai became Sichuan-Shaanxi governor-general and Yang Yingju Gansu governor-general.',
  ],
  s0423: [
    'Locusts appeared in Pingding and other Shanxi prefectures and counties.',
    'Locusts struck Shanxi districts including Pingding.',
  ],
  s0424: [
    'Eighth month, day jimao: Ming Rui pursued and routed Khoja Jahan and others at Khosurkuk Pass.',
    'In month 8, jimao, Ming Rui heavily defeated Khoja Jahan at Khosurkuk Pass.',
  ],
  s0425: [
    'On day renwu, this year\'s drought relief was given for forty Gansu prefectures, counties, and subprefectures including Gaolan.',
    'On renwu day, forty Gansu districts including Gaolan received drought relief for the year.',
  ],
  s0426: [
    'On day jichou, the ban on English merchant ships lingering at Ningbo was reiterated.',
    'On jichou day, lingering English ships at Ningbo were forbidden again.',
  ],
  s0427: [
    'On day renchen, Fude and others reported pursuing Khoja Jahan at Altishahr and inflicting a great defeat.',
    'On renchen day, Fude reported a great victory over Khoja Jahan at Altishahr.',
  ],
  s0428: [
    'On day guisi, the Emperor accompanied the Empress Dowager to Mulan for the battue.',
    'On guisi day, the court hunted at Mulan with the Empress Dowager.',
  ],
  s0429: [
    'On day gengzi, Fude reported that the army reached Lake Yashilkul and Khoja Jahan had fled into Badakhshan.',
    'On gengzi day, Fude reached Yashilkul and reported Khoja Jahan\'s flight to Badakhshan.',
  ],
  s0430: [
    'Ninth month, day gengxu: flood relief was given for Jiangshan and other Zhejiang counties.',
    'In month 9, gengxu, Jiangshan and other Zhejiang counties received flood relief.',
  ],
  s0431: [
    'Merits in suppressing the rebels were discussed: the Muslim Odu was advanced to beizi, Ashimet and Hadaimet were made dukes, and Minzhuer Dorji\'s ducal rank was restored.',
    'For pacification service, Odu became beizi, Ashimet and Hadaimet became dukes, and Minzhuer Dorji regained his ducal title.',
  ],
  s0432: [
    'On day guichou, the sacrificial code for the Western Regions was fixed.',
    'On guichou day, Western Region ritual rules were set.',
  ],
  s0433: [
    'Agui was ordered to proceed to Aksu to handle affairs.',
    'Agui was sent to manage affairs at Aksu.',
  ],
  s0434: [
    'Yusup was advanced to beile.',
    'Yusup was raised to beile.',
  ],
  s0435: [
    'On day bingyin, Gansu\'s Anxi garrison was changed to Anxi prefecture.',
    'On bingyin day, Anxi garrison became Anxi prefecture.',
  ],
  s0436: [
    'The Emperor accompanied the Empress Dowager back to the capital.',
    'The court returned to the capital with the Empress Dowager.',
  ],
  s0437: [
    'Suchang was made Huguang governor-general.',
    'Suchang became Huguang governor-general.',
  ],
  s0438: [
    'Excessive levies imposed by Khoja Jahan and others in the Muslim cities were abolished.',
    'Oppressive Muslim-city taxes under Khoja Jahan were removed.',
  ],
  s0439: [
    'Tenth month, winter, day jimao: the seal of the imperial commissioner was issued to Agui.',
    'In winter month 10, jimao, Agui received an imperial commissioner seal.',
  ],
  s0440: [
    'On day guiwei, drought relief was given for fifty-six Shanxi prefectures, counties, and subprefectures including Yangqu.',
    'On guiwei day, fifty-six Shanxi drought districts including Yangqu were relieved.',
  ],
  s0441: [
    'On day dinghai, Haning\'a was granted suicide.',
    'On dinghai day, Haning\'a was allowed to kill himself.',
  ],
  s0442: [
    'On day wuzi, counties and prefectures were forbidden to burden the people in dispatching locust-catching labor.',
    'On wuzi day, locust work must not be shifted onto commoners.',
  ],
  s0443: [
    'On day guisi, seventy percent of this year\'s drought quota tax was remitted for Shanxi zhuangtou at Zhumakou.',
    'On guisi day, Shanxi zhuangtou at Zhumakou had seventy percent of drought tax remitted.',
  ],
  s0444: [
    'On day yiwei, Ebi was made Shanxi governor.',
    'On yiwei day, Ebi became Shanxi governor.',
  ],
  s0445: [
    'Drought relief was given for Kaicheng and other Shenyang garrisons and seven Rehe counties including Chengde; salt workers flooded in six Changlu districts including Cangzhou and five saltern fields including Yanzhen were comforted and quota tax remitted in varying degrees.',
    'Shenyang and Rehe drought districts were relieved, Changlu flooded saltern workers were aided, and taxes were remitted by degree.',
  ],
  s0446: [
    'Last year\'s flood and hail quota tax was remitted for twenty-two Gansu prefectures, counties, and subprefectures including Didao.',
    'Twenty-two Gansu districts including Didao had last year\'s flood and hail tax forgiven.',
  ],
  s0447: [
    'On day bingshen, disaster relief was given for water, frost, hail, and insect damage in forty-seven Zhili prefectures, counties, and subprefectures including Gu\'an, and quota tax was remitted in varying degrees.',
    'On bingshen day, forty-seven Zhili disaster districts including Gu\'an were relieved and taxes remitted by degree.',
  ],
  s0448: [
    'On day dingyou, an edict said: "The state has enjoyed a century of peace; rest and nurture have increased and population has gradually grown.',
    'On dingyou day, an edict opened: the realm has been at peace a hundred years and the people have multiplied.',
  ],
  s0449: [
    'Now fortunately the frontier has been greatly extended for more than ten thousand li; newly opened territory will aid Central Plains farming, and fierce rebels will be turned into law-abiding cultivators—several goods accomplished at once.',
    'New frontiers now aid the heartland, rebels become farmers, and several benefits follow at once.',
  ],
  s0450: [
    'Governors and governors-general should instruct their subordinates to settle convicts from the Barkul garrisons, punish them appropriately, and not treat releasing the guilty as benevolence so that good law cannot operate."',
    'Governors must settle Barkul convicts, punish fittingly, and not mistake leniency toward criminals for virtue.',
  ],
  s0451: [
    'On day jihai, relief was given for water, insect, wind, and tide disasters in nineteen Jiangsu prefectures, counties, garrisons, and guards including Shangyuan.',
    'On jihai day, nineteen Jiangsu districts including Shangyuan received flood and pest relief.',
  ],
  s0452: [
    'On day gengzi, Fude reported that the Badakhshan ruler Sultan Shah had presented Khoja Jahan\'s head and the whole region submitted.',
    'On gengzi day, Fude reported Sultan Shah of Badakhshan sent Khoja Jahan\'s head and submitted.',
  ],
  s0453: [
    'Orders were issued to proclaim this at home and abroad.',
    'The court ordered the news proclaimed within and without.',
  ],
  s0454: [
    'General Zhaohui was additionally granted saddle and bridle of princely rank.',
    'Zhaohui received princely-grade saddle gear.',
  ],
  s0455: [
    'General Fude was advanced to marquis and granted the double-eyed peacock feather.',
    'Fude was raised to marquis and given double peacock feathers.',
  ],
  s0456: [
    'Campaign assistant grand ministers Duke Ming Rui and Duke Aligun were granted double peacock feathers.',
    'Ming Rui and Aligun received double peacock feathers.',
  ],
  s0457: [
    'Shuhede and all below were rewarded with preferential commendation.',
    'Shuhede and others received preferential merit review.',
  ],
  s0458: [
    'Emin Khoja was advanced to junwang and Yusup was granted junwang rank.',
    'Emin Khoja became junwang and Yusup received junwang status.',
  ],
  s0459: [
    'On day xinchou, an essay Clarifying Doubts on the origins of pacifying the Zunghar and Muslim regions was composed and promulgated at home and abroad.',
    'On xinchou day, Clarifying Doubts on the Zunghar and Muslim campaigns was issued.',
  ],
  s0460: [
    'Flood and insect disaster relief was given for twenty Zhejiang prefectures, counties, garrisons, and guards including Jiaxing and nine saltern fields including Shuangsu.',
    'Zhejiang flood and insect districts and nine saltern fields were relieved.',
  ],
  s0461: [
    'On day renyin, princes and grand ministers\' request for an honorific title was declined.',
    'On renyin day, requests for an honorific title were refused.',
  ],
  s0462: [
    'Drought, hail, and frost disaster relief was given for nine Shaanxi counties including Dingbian.',
    'Nine Shaanxi counties including Dingbian received drought and hail relief.',
  ],
  s0463: [
    'On day guimao, Khalkha and Dörbet tribal khans, princes, and dukes were summoned to the Great Peace felicitation banquet.',
    'On guimao day, Khalkha and Dörbet rulers were invited to the Great Peace banquet.',
  ],
  s0464: [
    'Eleventh month, day xinhai: because the Muslim regions were pacified, the Emperor led princes and grand ministers to congratulate the Empress Dowager at Shoukang Palace.',
    'In month 11, xinhai, the Emperor led the court to congratulate the Empress Dowager at Shoukang on pacifying the Muslims.',
  ],
  s0465: [
    'He received congratulatory audience at the Hall of Supreme Harmony.',
    'He received court congratulations at the Hall of Supreme Harmony.',
  ],
  s0466: [
    'An edict was promulgated at home and abroad and favor granted in varying degrees.',
    'Edicts went out and grace was distributed by degree.',
  ],
  s0467: [
    'On day xinyou, Yang Yingju was given the additional title Grand Tutor of the Heir Apparent.',
    'On xinyou day, Yang Yingju became Grand Tutor of the Heir Apparent.',
  ],
  s0468: [
    'On day yichou, flooded land tax was abolished for Jining prefecture and Yutai county in Shandong.',
    'On yichou day, Shandong flood land tax was abolished at Jining and Yutai.',
  ],
  s0469: [
    'On day guiyou, Muslim-city begs and others were ordered to come to audience in rotation.',
    'On guiyou day, Muslim begs were ordered to audience by turns.',
  ],
  s0470: [
    'Kirghiz of Khartai submitted.',
    'Khartai Kirghiz submitted.',
  ],
  s0471: [
    'Twelfth month, day jiazi: this year\'s drought relief was given for fourteen Gansu prefectures, counties, and subprefectures including Gaolan and the Dongle county assistant magistrate\'s jurisdiction.',
    'In month 12, jiazi, fourteen Gansu drought districts and Dongle were relieved.',
  ],
  s0472: [
    'On day guisi, seventy percent of the commuted price due from seven Two Huai saltern fields including Dingxi was remitted because of disaster.',
    'On guisi day, seven Two Huai saltern fields had seventy percent of commuted dues remitted.',
  ],
  s0473: [
    'On day jiawu, this year\'s flood and tide disaster relief was given for sixteen Shandong prefectures, counties, and guards including Haifeng and three saltern fields including Yongfu.',
    'On jiawu day, sixteen Shandong districts and three saltern fields received flood and tide relief.',
  ],
  s0474: [
    'On day dingyou, this year\'s flood quota tax was remitted for three Zhejiang counties including Jiangshan.',
    'On dingyou day, three Zhejiang flood counties including Jiangshan had tax remitted.',
  ],
  s0475: [
    'Twenty-fifth year, spring, first month, day wushen: because the western army returned victorious, next year\'s Gansu quota tax was again remitted.',
    'In spring of year 25, wushen, next year\'s Gansu quota tax was remitted for the western victory.',
  ],
  s0476: [
    'On day jiyou, drought relief was given for Gaolan and other Gansu prefectures and counties.',
    'On jiyou day, Gansu drought districts including Gaolan were relieved.',
  ],
  s0477: [
    'On day gengxu, colonization farming was ordered at Urumqi.',
    'On gengxu day, Urumqi colonization was ordered.',
  ],
  s0478: [
    'On day yimao, Kokand\'s ruler Id Khan sent envoys Toktamat and others to audience.',
    'On yimao day, Kokand sent Toktamat and other envoys to court.',
  ],
  s0479: [
    'On day bingchen, Badakhshan\'s Sultan Shah sent envoys E\'mo\'er Beg and others and envoys of Chitral and Baltistan came to audience.',
    'On bingchen day, Sultan Shah, Chitral, and Baltistan sent envoys to court.',
  ],
  s0480: [
    'Frontier Pacification General Zhaohui and others presented Khoja Jahan\'s head and brought captive chiefs including Mundosop and others to the capital.',
    'Zhaohui presented Khoja Jahan\'s head and captive leaders including Mundosop reached the capital.',
  ],
  s0481: [
    'On day dingji, the Emperor presided at the Meridian Gate for the captive-presentation rite.',
    'On dingji day, the Emperor held the captive rite at the Meridian Gate.',
  ],
  s0482: [
    'Khoja Jahan\'s head was ordered displayed at public crossroads; Mundosop and others were pardoned.',
    'Khoja Jahan\'s head was hung in the streets and Mundosop and others were forgiven.',
  ],
  s0483: [
    'On day jiwei, Kirghiz Ajib sent envoys Silagasi and others to audience.',
    'On jiwei day, Kirghiz Ajib sent Silagasi and others to court.',
  ],
  s0484: [
    'Second month, day dingchou: Vice Ministers Qiu Yuexiu and Yilushun were ordered to audit military supplies handled by Gansu prefectures and counties.',
    'In month 2, dingchou, Qiu Yuexiu and Yilushun audited Gansu military provisioning.',
  ],
  s0485: [
    'Famine relief was given for the four banners of the Jasagtu Khan and other tribes.',
    'Four Jasagtu banners received famine relief.',
  ],
  s0486: [
    'On day guiwei, the Emperor set out for the Eastern Mausolea.',
    'On guiwei day, the Emperor left for the Eastern Mausolea.',
  ],
  s0487: [
    'On day yiyou, drought relief was given for last year\'s drought in Yangqu and other Shanxi prefectures and counties.',
    'On yiyou day, Shanxi districts including Yangqu received last year\'s drought relief.',
  ],
  s0488: [
    'On day bingxu, the Emperor visited Zhao Mausoleum, Xiao Mausoleum, Xiao East Mausoleum, and Jing Mausoleum.',
    'On bingxu day, the Emperor visited Zhao, Xiao, Xiao East, and Jing mausolea.',
  ],
  s0489: [
    'On day dinghai, because Qing Fu delayed and concealed reports, he was ordered executed.',
    'On dinghai day, Qing Fu was executed for delay and concealment.',
  ],
  s0490: [
    'On day xinmao, drought quota tax was remitted for nineteen Shenyang relay stations and relief given.',
    'On xinmao day, nineteen Shenyang stations had drought tax remitted and were relieved.',
  ],
  s0491: [
    'On day guisi, the Emperor returned to the capital.',
    'On guisi day, the Emperor returned to the capital.',
  ],
  s0492: [
    'On day bingshen, Chebudengzhab was made deputy general to lead troops against the Kazakh Baruk Batiru; Ma Yan and Chemuchukezhab were made campaign assistant commissioners.',
    'On bingshen day, Chebudengzhab was sent against the Kazakh Baruk Batiru with Ma Yan and Chemuchukezhab as assistants.',
  ],
  s0493: [
    'The Emperor went to Tai Mausoleum.',
    'The Emperor went to Tai Mausoleum.',
  ],
  s0494: [
    'On day jihai, the Emperor visited Tai Mausoleum.',
    'On jihai day, the Emperor visited Tai Mausoleum.',
  ],
  s0495: [
    'Zhaohui and Fude were made Grand Ministers in Attendance.',
    'Zhaohui and Fude became Grand Ministers in Attendance.',
  ],
  s0496: [
    'On day renyin, Zhaohui and others returned victorious; the Emperor went to Liangxiang to welcome them in the suburbs.',
    'On renyin day, Zhaohui returned in triumph and the Emperor welcomed him at Liangxiang.',
  ],
  s0497: [
    'On day guimao, the Emperor returned to the capital.',
    'On guimao day, the Emperor returned to the capital.',
  ],
  s0498: [
    'On day jiachen, caps and robes were granted in varying degrees to the Jasak junwang-rank prince of Hami, beile Yusup, and others.',
    'On jiachen day, Hami\'s junwang prince, beile Yusup, and others received graded robes.',
  ],
  s0499: [
    'Third month, new moon on day bingwu: the Emperor presided at the Hall of Supreme Harmony and received congratulatory audience on the triumphant return.',
    'On the third-month new moon, bingwu, the Emperor received victory congratulations at the Hall of Supreme Harmony.',
  ],
  s0500: [
    'On day dingwei, trial colonization farming was launched at Hainuk and other places in Yili.',
    'On dingwei day, trial farming began at Hainuk and other Yili sites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b05.mjs <translation.json>'
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
