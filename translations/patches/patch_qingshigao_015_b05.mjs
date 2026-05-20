#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day jiachen, Liu Yong was transferred to Minister of Rites and Ji Yun to Left Censor-in-chief of the Censorate.',
    'On jiachen day, Liu Yong took Rites and Ji Yun the Censorate\'s left censor-in-chief.',
  ],
  s0402: [
    'Second month, day jiyou, an edict said: "I diligently seek good government and hold vigilance in mind.',
    'In the second month, jiyou, the Emperor said he sought good rule with vigilance in mind.',
  ],
  s0403: [
    'Yin Zhuangtu\'s reckless presumptuous words may also be taken as admonition through criticism.',
    'Yin Zhuangtu\'s rash words might still serve as criticism turned counsel.',
  ],
  s0404: [
    'In grace he was spared punishment and Yin Zhuangtu was used as a Grand Secretariat reader.',
    'Yin Zhuangtu was spared and appointed a Grand Secretariat reader.',
  ],
  s0405: [
    '" On day wuwu, the palace examination of Hanlin academicians and related officials was held; Ruan Yuan and one other were raised to first class, the rest promoted or demoted by degree.',
    'On wuwu day, the palace exam raised Ruan Yuan and one other to first class; others moved by degree.',
  ],
  s0406: [
    'Third month, day yihai, banner households in Fengtian, Jinzhou, and elsewhere were given relief for last year\'s flood on banner lands, with rent remitted by degree.',
    'In the third month, yihai, Fengtian and Jinzhou banner flood victims were relieved and rent forgiven in grades.',
  ],
  s0407: [
    'On day wuyin, the Emperor visited Panshan.',
    'On wuyin day, the Emperor visited Panshan.',
  ],
  s0408: [
    'On day jiashen, quota tax was remitted for last year\'s frost damage in three Gansu counties including Gaolan.',
    'On jiashen day, three Gansu counties including Gaolan lost last year\'s frost quota tax.',
  ],
  s0409: [
    'On day dingyou, Yongbao was made an interior minister.',
    'On dingyou day, Yongbao became an interior minister.',
  ],
  s0410: [
    'Summer, fourth month, day dingmao: quota tax was remitted for last year\'s flood damage in thirty Shandong prefectures, counties, and guards including Linqing.',
    'In the fourth month, dingmao, thirty Shandong districts including Linqing lost last year\'s flood quota tax.',
  ],
  s0411: [
    'On day xinwei, Peng Yuanrui was demoted to vice minister for favoritism; Sun Shiyi was made Minister of Personnel.',
    'On xinwei day, Peng Yuanrui fell to vice minister for favoritism and Sun Shiyi took Personnel.',
  ],
  s0412: [
    'Shu Lin was made Liangjiang governor-general and Chang Lin acted temporarily.',
    'Shu Lin became Liangjiang governor-general and Chang Lin acted.',
  ],
  s0413: [
    'Feng Guangxiong was transferred to Shanxi governor.',
    'Feng Guangxiong became Shanxi governor.',
  ],
  s0414: [
    'Jiang Sheng was made Hunan governor.',
    'Jiang Sheng became Hunan governor.',
  ],
  s0415: [
    'Fifth month, day gengyin: Chang Lin was made Jiangsu governor.',
    'In the fifth month, gengyin, Chang Lin became Jiangsu governor.',
  ],
  s0416: [
    'On day yiwei, the Emperor went to Mulan for the autumn battue.',
    'On yiwei day, the Emperor went to Mulan for the autumn hunt.',
  ],
  s0417: [
    'On day xinchou, the Emperor halted at the Mountain Resort for Summer Retreat.',
    'On xinchou day, the court halted at the Summer Resort.',
  ],
  s0418: [
    'Sixth month, new moon on day jiachen: quota tax was remitted for last year\'s flood damage in sixty-nine Zhili departmental cities, prefectures, and counties including Bazhou.',
    'On the sixth-month new moon, jiachen, sixty-nine Zhili districts including Bazhou lost last year\'s flood quota tax.',
  ],
  s0419: [
    'Autumn, seventh month, day gengchen: half of disaster arrears tax was remitted for five Jiangsu prefectures including Jiangning.',
    'In the seventh month, gengchen, half of disaster arrears was forgiven in five Jiangsu prefectures including Jiangning.',
  ],
  s0420: [
    'On day jiashen, the Burmese king Meng Yun was rewarded for sending back people detained in the interior.',
    'On jiashen day, Burma\'s King Meng Yun was rewarded for returning detained subjects.',
  ],
  s0421: [
    'On day jihai, quota tax was remitted for last year\'s flood in nineteen Anhui prefectures, counties, and guards including Suzhou.',
    'On jihai day, nineteen Anhui districts including Suzhou lost last year\'s flood quota tax.',
  ],
  s0422: [
    'On day xinchou, arrears tax was remitted for two Shaanxi counties including Chaoyi.',
    'On xinchou day, Chaoyi and one other Shaanxi county lost tax arrears.',
  ],
  s0423: [
    'Eighth month, day dingwei: Latnasidi was made Kharchin jasak first-rank tabunang.',
    'In the eighth month, dingwei, Latnasidi became Kharchin jasak first-rank tabunang.',
  ],
  s0424: [
    'On day wuwu, the Emperor went to Mulan for the encampment hunt.',
    'On wuwu day, the Emperor went to Mulan for the encampment hunt.',
  ],
  s0425: [
    'On day jiazi, the Emperor conducted the hunt encampment.',
    'On jiazi day, the Emperor held the hunt encampment.',
  ],
  s0426: [
    'Gurkha, citing arrears, lured and besieged lamas and gambo and disturbed Tibet.',
    'Gurkha, claiming arrears, lured lamas and gambo and raided Tibet.',
  ],
  s0427: [
    'Sichuan governor-general E Hui and general Cheng De were ordered to suppress them.',
    'E Hui and Cheng De were sent from Sichuan to suppress them.',
  ],
  s0428: [
    'Sun Shiyi was ordered to act as Sichuan governor-general.',
    'Sun Shiyi was told to act as Sichuan governor-general.',
  ],
  s0429: [
    'On day jisi, Fukang\'an was ordered to come to the capital for his mother\'s birthday; Guo Shixun acted as Guangdong-Guangxi governor-general.',
    'On jisi day, Fukang\'an came to Beijing for his mother\'s birthday and Guo Shixun acted at Liang-Guang.',
  ],
  s0430: [
    'Gurkha captured various Tibetan dzong districts at Dingri and held Gyirong.',
    'Gurkha took Dingri dzongs and held Gyirong.',
  ],
  s0431: [
    'Ninth month, day bingzi: the Emperor returned and halted at the Summer Resort.',
    'In the ninth month, bingzi, the Emperor returned to the Summer Resort.',
  ],
  s0432: [
    'On day gengchen, Songchun was recalled; Linning was made Shengjing general and Hengxiu transferred to Jilin general.',
    'On gengchen day, Songchun was recalled; Linning took Shengjing and Hengxiu Jilin.',
  ],
  s0433: [
    'On day bingxu, the Emperor escorted the imperial progress back.',
    'On bingxu day, the court escorted the return journey.',
  ],
  s0434: [
    'On day wuzi, Tibetan troops and Dami Mongol troops met Gurkha in defeat; Tibetan duke Tashinamgyal and Dami assistant commandant Zepajie and others died.',
    'On wuzi day, Tibetan and Dami troops were beaten; Duke Tashinamgyal and Assistant Commandant Zepajie died.',
  ],
  s0435: [
    'Imperial Bodyguard Eledengbao and others were ordered to the Tibet army camp.',
    'Eledengbao and other imperial bodyguards were sent to the Tibet front.',
  ],
  s0436: [
    'On day renchen, Baotai was dismissed for cowardice; Kuilin was sent to Tibet and Shu Lian given vice commandant insignia to assist.',
    'On renchen day, Baotai was dismissed for cowardice; Kuilin went to Tibet and Shu Lian assisted as vice commandant.',
  ],
  s0437: [
    'The Dalai Lama and others were praised for firmly holding the Potala.',
    'The Dalai Lama and others were praised for holding the Potala.',
  ],
  s0438: [
    'Liu Yong was ordered to act as Minister of Personnel.',
    'Liu Yong was told to act as Minister of Personnel.',
  ],
  s0439: [
    'On day jiawu, because Gurkha besieged Tashilhunpo, E Hui and others were instructed to advance and suppress.',
    'On jiawu day, with Tashilhunpo besieged, E Hui and others were told to advance.',
  ],
  s0440: [
    'On day xinchou, arrears tax was remitted for Fengtian Guangning County.',
    'On xinchou day, Fengtian Guangning lost tax arrears.',
  ],
  s0441: [
    'Winter, tenth month, day yisi: Min Egui\'s crime was pardoned.',
    'In the tenth month, yisi, Min Egui was pardoned.',
  ],
  s0442: [
    'On day dingwei, Gurkha entered Tashilhunpo and soon fled.',
    'On dingwei day, Gurkha entered Tashilhunpo and soon withdrew.',
  ],
  s0443: [
    'On day guichou, Minister of Revenue Bayansan was dismissed for inflated estimates on city works; Fu Chang\'an replaced him.',
    'On guichou day, Bayansan lost Revenue for inflated city estimates and Fu Chang\'an replaced him.',
  ],
  s0444: [
    'Jin Jian and Peng Yuanrui were made Manchu and Han Ministers of Works.',
    'Jin Jian and Peng Yuanrui became Manchu and Han Works ministers.',
  ],
  s0445: [
    'On day bingchen, because Annam opened customs for trade, the Guangxi Longzhou subprefecture judge was changed to subprefect.',
    'On bingchen day, with Annam trade open, Longzhou\'s judge became subprefect.',
  ],
  s0446: [
    'On day yichou, an edict said princes and ministers need not hold empty concurrent Council of State titles.',
    'On yichou day, princes and ministers were told not to keep empty Council titles.',
  ],
  s0447: [
    'Eleventh month, day guiyou: Fukang\'an was made general, Hai Lancha and Kuilin collegial pacification officers, to campaign against Gurkha.',
    'In the eleventh month, guiyou, Fukang\'an became general and Hai Lancha and Kuilin joined the Gurkha campaign.',
  ],
  s0448: [
    'On day xinsi, E Hui and Cheng De were dismissed; Huiling became Sichuan governor-general, Kuilin Chengdu general, and Ji Qing Shandong governor.',
    'On xinsi day, E Hui and Cheng De were dismissed; Huiling took Sichuan, Kuilin Chengdu, and Ji Qing Shandong.',
  ],
  s0449: [
    'On day guiwei, Chen Huai was made Guizhou governor.',
    'On guiwei day, Chen Huai became Guizhou governor.',
  ],
  s0450: [
    'Twelfth month, day xinhai: Hai Lancha and others and Solon and Daur troops were ordered into Tibet via Xining.',
    'In the twelfth month, xinhai, Hai Lancha, Solon, and Daur troops were sent into Tibet via Xining.',
  ],
  s0451: [
    'On day dingmao, Duerjia was recalled to the capital.',
    'On dingmao day, Duerjia was recalled to Beijing.',
  ],
  s0452: [
    'Mingliang was made Heilongjiang general and Mingxing Kashgar collegial pacification officer.',
    'Mingliang became Heilongjiang general and Mingxing Kashgar collegial officer.',
  ],
  s0453: [
    'Fifty-seventh year, spring, first month, day renshen: retired Stable Court president Li Zhiying, seven generations alive under one roof, was awarded an imperial inscribed plaque.',
    'In spring of year 57, renshen, retired Stable Court president Li Zhiying, seven generations under one roof, received an imperial plaque.',
  ],
  s0454: [
    'Arrears tax was remitted in Fengtian, Zhili, Anhui, Hunan, and Guangdong.',
    'Tax arrears were forgiven in Fengtian, Zhili, Anhui, Hunan, and Guangdong.',
  ],
  s0455: [
    'On day yihai, because the Dalai Lama again sent Danjinbanzhu\'er and others to negotiate privately with Gurkha, they were instructed to stop.',
    'On yihai day, the Dalai Lama\'s private Gurkha envoys were ordered to stop.',
  ],
  s0456: [
    'On day bingzi, Baa Zhong\'s crime of negotiating with Gurkha and unilaterally promising annual silver was pursued.',
    'On bingzi day, Baa Zhong was charged for private Gurkha talks and promised tribute silver.',
  ],
  s0457: [
    'On day jiawu, Su Ling\'a was made Minister of Punishments.',
    'On jiawu day, Su Ling\'a became Minister of Punishments.',
  ],
  s0458: [
    'Second month, day renyin: Cheng De reported defeating the enemy at Paijialing.',
    'In the second month, renyin, Cheng De reported victory at Paijialing.',
  ],
  s0459: [
    'On day guimao, rewards were granted to Grand Secretary Agui, Minister Fu Chang\'an, Vice Minister De Ming, Governor-general Fukang\'an, Governor Chang Lin, and others.',
    'On guimao day, Agui, Fu Chang\'an, De Ming, Fukang\'an, Chang Lin, and others were rewarded.',
  ],
  s0460: [
    'Hedong salt controller, salt transport commissioner, and other posts were abolished.',
    'Hedong salt controller and transport posts were abolished.',
  ],
  s0461: [
    'Shanxi Hedong Circuit was moved to garrison at Yuncheng.',
    'Shanxi Hedong Circuit was stationed at Yuncheng.',
  ],
  s0462: [
    'On day dingwei, the fifteenth imperial son, Prince Jia, was ordered to sacrifice to Confucius.',
    'On dingwei day, the fifteenth son, Prince Jia, sacrificed to Confucius.',
  ],
  s0463: [
    'Quota tax was remitted for last year\'s drought in Fengtian Jinzhou prefecture dependencies.',
    'Last year\'s drought quota tax was forgiven in Fengtian Jinzhou dependencies.',
  ],
  s0464: [
    'On day jisi, Vice Minister Helin was ordered to manage Tibet affairs.',
    'On jisi day, Helin was told to manage Tibet affairs.',
  ],
  s0465: [
    'E Hui and others reported recovering Nyalam; they were rebuked for delay.',
    'E Hui reported Nyalam recovered and was rebuked for delay.',
  ],
  s0466: [
    'Third month, day dingchou: the Emperor went to the Western Tombs and toured Wutai Mountain, remitting three-tenths of this year\'s land tax in passed areas.',
    'In the third month, dingchou, the Emperor visited the Western Tombs and Wutai Mountain and cut three-tenths of land tax along the route.',
  ],
  s0467: [
    'On day wuyin, the Gyirong khutukhtu was granted the dharma title "Chan Master Huitong."',
    'On wuyin day, the Gyirong khutukhtu received the title Chan Master Huitong.',
  ],
  s0468: [
    'Pakli camp Tibetan officials who recovered Doklam and Drongme were rewarded.',
    'Pakli officials who recovered Doklam and Drongme were rewarded.',
  ],
  s0469: [
    'On day xinsi, the Emperor visited the Tailing and East Tailing tombs.',
    'On xinsi day, the Emperor visited the Tailing and East Tailing.',
  ],
  s0470: [
    'On day renwu, accumulated grain arrears were remitted in eight Zhili prefectures and counties including Daxing.',
    'On renwu day, eight Zhili districts including Daxing lost grain arrears.',
  ],
  s0471: [
    'On day jiashen, Fukang\'an was advanced to grand general.',
    'On jiashen day, Fukang\'an became grand general.',
  ],
  s0472: [
    'On day gengyin, half of Wutai\'s land tax was remitted and unpaid arrears in Datong and Shuoping dependencies.',
    'On gengyin day, Wutai lost half its land tax and Datong and Shuoping lost arrears.',
  ],
  s0473: [
    'On day xinmao, the Emperor halted at Wutai Mountain.',
    'On xinmao day, the court halted at Wutai Mountain.',
  ],
  s0474: [
    'Summer, fourth month, new moon on day jihai: Khotan Affairs minister Li Shizheng was referred for strict discipline for failure to detect Maimaitiniyazi\'er.',
    'On the fourth-month new moon, jihai, Li Shizheng was disciplined for missing Maimaitiniyazi\'er.',
  ],
  s0475: [
    'On day jiachen, the Emperor inspected the Hutuo River.',
    'On jiachen day, the Emperor inspected the Hutuo River.',
  ],
  s0476: [
    'Gunchukezhabu was made Uliastai collegial pacification officer.',
    'Gunchukezhabu became Uliastai collegial officer.',
  ],
  s0477: [
    'On day dingwei, the Emperor sacrificed at the Emperor Yao temple.',
    'On dingwei day, the Emperor sacrificed at the Emperor Yao temple.',
  ],
  s0478: [
    'On day jiayin, the Emperor returned to the capital.',
    'On jiayin day, the Emperor returned to Beijing.',
  ],
  s0479: [
    'On day yimao, the Emperor went to Black Dragon Pool to pray for rain.',
    'On yimao day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0480: [
    'The Ministry of Punishments was ordered to review ordinary prisons and reduce punishments below exile.',
    'Punishments ordered a prison review and reductions below exile.',
  ],
  s0481: [
    'Intercalary fourth month, day jiashen: because of prolonged drought, Taiwan and coastal provinces were instructed to try capital and robbery cases carefully and not deliberately apply harsh penalties.',
    'In the intercalary fourth month, jiashen, drought led Taiwan and coastal provinces to try capital and robbery cases without deliberate harshness.',
  ],
  s0482: [
    'Quota tax was remitted for last year\'s drought in five Henan counties including Tangyin.',
    'Five Henan counties including Tangyin lost last year\'s drought quota tax.',
  ],
  s0483: [
    'On day bingshen, because of prolonged drought an edict sought memorials.',
    'On bingshen day, prolonged drought brought an edict seeking advice.',
  ],
  s0484: [
    'On day dingyou, it rained.',
    'On dingyou day, rain fell.',
  ],
  s0485: [
    'For the fall of Tashilhunpo, the Shigatse khutukhtu and dzasak lamas and others were punished.',
    'After Tashilhunpo fell, the Shigatse khutukhtu and dzasak lamas were punished.',
  ],
  s0486: [
    'Helin and E Hui were ordered to proclaim instructions to the Dalai Lama and others.',
    'Helin and E Hui were told to instruct the Dalai Lama and others.',
  ],
  s0487: [
    'Fifth month, day xinchou: Annam was fixed at tribute every two years and an embassy every six years.',
    'In the fifth month, xinchou, Annam was set to tribute every two years and an embassy every six.',
  ],
  s0488: [
    'On day dingwei, the Emperor went to the Summer Resort, remitting five-tenths of land tax in passed areas.',
    'On dingwei day, the Emperor went to the Summer Resort and cut five-tenths of land tax along the route.',
  ],
  s0489: [
    'On day wushen, Chang Lin was transferred to Shanxi governor and Qifeng\'e made Jiangsu governor.',
    'On wushen day, Chang Lin took Shanxi and Qifeng\'e Jiangsu.',
  ],
  s0490: [
    'On day xinhai, Kokand khan Narbatu\'s tribute embassy was accepted.',
    'On xinhai day, Kokand\'s Narbatu sent tribute and it was accepted.',
  ],
  s0491: [
    'On day guichou, the Emperor halted at the Summer Resort.',
    'On guichou day, the court halted at the Summer Resort.',
  ],
  s0492: [
    'Sixth month, day jiaxu: Fukang\'an reported capturing the Gurkha-held Tsam-srong pass.',
    'In the sixth month, jiaxu, Fukang\'an reported taking the Gurkha-held Tsam-srong pass.',
  ],
  s0493: [
    'On day dingchou, Nanfeng and Guangchang in Jiangxi were given flood relief.',
    'On dingchou day, Jiangxi\'s Nanfeng and Guangchang received flood relief.',
  ],
  s0494: [
    'Fukang\'an reported annihilating the enemy at Magarkhal ridge.',
    'Fukang\'an reported wiping out the enemy at Magarkhal ridge.',
  ],
  s0495: [
    'On day jimao, Fukang\'an and others reported capturing Gyirong.',
    'On jimao day, Fukang\'an and others reported taking Gyirong.',
  ],
  s0496: [
    'On day xinsi, Chen Huai was transferred to Jiangxi governor and Feng Guangxiong to Guizhou governor.',
    'On xinsi day, Chen Huai took Jiangxi and Feng Guangxiong Guizhou.',
  ],
  s0497: [
    'On day bingxu, Fukang\'an and others reported capturing the Resuo Bridge.',
    'On bingxu day, Fukang\'an and others reported taking the Resuo Bridge.',
  ],
  s0498: [
    'On day dingyou, Fukang\'an and others reported capturing the Syabru stockade.',
    'On dingyou day, Fukang\'an and others reported taking the Syabru stockade.',
  ],
  s0499: [
    'Autumn, seventh month, day jiachen: drought relief was given in Hejian and elsewhere in Zhili, and locusts in Wanping, Yutian, and other districts.',
    'In the seventh month, jiachen, Zhili drought districts including Hejian were relieved and locusts hit Wanping and Yutian.',
  ],
  s0500: [
    'On day jiyou, Fukang\'an and others captured Gurkha positions at Dongjue ridge and Yarsala camp stations; Cheng De and others captured Dram and the iron-chain bridge.',
    'On jiyou day, Fukang\'an took Dongjue ridge and Yarsala camps and Cheng De took Dram and the iron-chain bridge.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b05.mjs <translation.json>'
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
