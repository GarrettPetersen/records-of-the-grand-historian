#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'On day wuxu, flood and hail relief was granted for Jingle and other districts of Shanxi.',
    'On wuxu day, Shanxi districts including Jingle received flood and hail relief.',
  ],
  s0302: [
    'On day gengzi, the Emperor, accompanying the Empress Dowager, conducted the autumn hunt at Mulan.',
    'On gengzi day, the court hunted at Mulan with the Empress Dowager.',
  ],
  s0303: [
    'On day renyin, Shele fled to Russia.',
    'On renyin day, Shele escaped to Russia.',
  ],
  s0304: [
    'Agui was recalled.',
    'Agui was summoned back to court.',
  ],
  s0305: [
    'On day guimao, Mamuthu Khuribimirong of the Right Wing Buruts sent his younger brother Sherberke to audience.',
    'On guimao day, the Right Wing Burut chief sent his brother Sherberke to court.',
  ],
  s0306: [
    'An edict ordered Sira of the Kazakhs bound and presented.',
    'The court ordered Kazakh Sira captured and sent in.',
  ],
  s0307: [
    'On day yisi, Namuzhale was made Pacification General and Santi campaign assistant commissioner.',
    'On yisi day, Namuzhale became Pacification General and Santi his assistant.',
  ],
  s0308: [
    'Zhaohui was ordered to proceed to Kucha; on bingwu day the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'Zhaohui was sent to Kucha; on bingwu day the court halted at the Summer Mountain Resort.',
  ],
  s0309: [
    'On day wushen, Chebudunjab was rewarded with princely rank.',
    'On wushen day, Chebudunjab received princely rank.',
  ],
  s0310: [
    'On day renzi, drought and hail relief was granted for Yan\'an and sixteen other districts of Shaanxi.',
    'On renzi day, seventeen Shaanxi districts including Yan\'an received drought and hail relief.',
  ],
  s0311: [
    'Eighth month, day bingyin: it rained.',
    'In the eighth month, on bingyin day, rain fell.',
  ],
  s0312: [
    'On day jisi, the Emperor, accompanying the Empress Dowager, went to Mulan for a hunting encirclement.',
    'On jisi day, the court held a Mulan battue with the Empress Dowager.',
  ],
  s0313: [
    'On day jiaxu, Du Lai was made Minister of War.',
    'On jiaxu day, Du Lai became Minister of War.',
  ],
  s0314: [
    'On day dingchou, drought relief was granted for Gaolan and twenty-three other prefectures, counties, and subprefectures of Gansu.',
    'On dingchou day, twenty-four Gansu districts including Gaolan received drought relief.',
  ],
  s0315: [
    'On day renwu, Burma\'s king Mangdala was killed by wild tribes of Deleng; Wengjiaya, native official of Mushu, seized power.',
    'On renwu day, Burma\'s king was slain by frontier tribes and Wengjiaya of Mushu rose up.',
  ],
  s0316: [
    'Ninth month, day jichou: a banquet was given for the Burut envoy Sherberke.',
    'In the ninth month, on jichou day, Sherberke of the Buruts was feasted.',
  ],
  s0317: [
    'Regional Commander Ma Desheng was executed for losing the opportunity in the attack on Kucha.',
    'Ma Desheng was put to death for mishandling the assault on Kucha.',
  ],
  s0318: [
    'On day gengyin, Turibai of the Right Wing Kazakhs and Turgachan of Tashkent and other Muslims came to submit.',
    'On gengyin day, Kazakh and Tashkent leaders submitted.',
  ],
  s0319: [
    'On day bingshen, the Empress Dowager halted at the Mountain Resort for Avoiding Summer Heat.',
    'On bingshen day, the Empress Dowager stayed at the Summer Mountain Resort.',
  ],
  s0320: [
    'On day wuxu, Gui Xuangguang was transferred to Left Censor-in-chief; Ji Huang was made Minister of Rites; Liang Shizheng was ordered to act as Minister of Works.',
    'On wuxu day, Gui Xuangguang, Ji Huang, and acting Works Minister Liang Shizheng were appointed.',
  ],
  s0321: [
    'The garrison commander at Ili was ordered concurrently to manage Muslim-region affairs.',
    'The Ili garrison chief was told to handle Muslim affairs as well.',
  ],
  s0322: [
    'On day jihai, flood relief was granted for Renhe and other counties of Zhejiang.',
    'On jihai day, Zhejiang flood districts including Renhe were relieved.',
  ],
  s0323: [
    'On day jiachen, Muslims of Karakhalbakh came to submit.',
    'On jiachen day, the Karakhalbakh Muslims submitted.',
  ],
  s0324: [
    'On day gengxu, the Khotan city beg Khojasi and others came to submit.',
    'On gengxu day, Khojasi of Khotan and other begs submitted.',
  ],
  s0325: [
    'On day renzi, Ushi city surrendered.',
    'On renzi day, Ushi surrendered.',
  ],
  s0326: [
    'Winter, tenth month, day guihai: flood relief was granted for Qiantang and fifteen other Zhejiang counties and salterns, and frost relief for districts under Shuoping Prefecture, Shanxi.',
    'In the tenth month, Zhejiang flood and Shanxi frost districts received relief.',
  ],
  s0327: [
    'On day dingmao, flood, hail, and frost relief was granted for Dacheng and eight other counties of Zhili.',
    'On dingmao day, nine Zhili counties received flood, hail, and frost relief.',
  ],
  s0328: [
    'Zhaohui advanced from Barkul toward Yarkand.',
    'Zhaohui marched from Barkul on Yarkand.',
  ],
  s0329: [
    'On day jiaxu, Wu Bai was dismissed for illness and Demin was made Left Censor-in-chief.',
    'On jiaxu day, sick Wu Bai left office and Demin became Left Censor-in-chief.',
  ],
  s0330: [
    'Flood relief was granted for Cangzhou and five other prefectures, counties, and salterns of Zhili.',
    'Six Zhili districts including Cangzhou received flood relief.',
  ],
  s0331: [
    'Eleventh month, new moon on day jiashen: the Right Wing Kazakhs sent envoys to court and were given a banquet.',
    'On the eleventh-month new moon of jiashen, Kazakh envoys were received and feasted.',
  ],
  s0332: [
    'On day yiyou, the Emperor returned from the tour.',
    'On yiyou day, the court returned from tour.',
  ],
  s0333: [
    'On day bingxu, the Emperor went to the Southern Park for a hunting encirclement.',
    'On bingxu day, the Emperor hunted at the Southern Park.',
  ],
  s0334: [
    'On day wuzi, the Emperor conducted a grand review.',
    'On wuzi day, the Emperor held a grand military review.',
  ],
  s0335: [
    'On day jichou, Arigun was made campaign assistant commissioner and sent to Zhaohui\'s army camp.',
    'On jichou day, Arigun joined Zhaohui\'s staff as assistant commissioner.',
  ],
  s0336: [
    'On day xinmao, flood, drought, and tidal relief was granted for Haizhou and four other prefectures and counties of Jiangsu.',
    'On xinmao day, five Jiangsu districts including Haizhou received disaster relief.',
  ],
  s0337: [
    'On day dingyou, Zhaohui reached outside Yarkand city and fell into the rebels\' encirclement.',
    'On dingyou day, Zhaohui was trapped outside Yarkand.',
  ],
  s0338: [
    'Fu De was made Pacification Assistant Commander of the Right on the Border; Arigun, Ailong\'a, Fulu, and Shujede were made campaign assistant commissioners and sent to Yarkand to support operations.',
    'Fu De became border assistant commander; Arigun, Ailong\'a, Fulu, and Shujede were sent as assistants to relieve Yarkand.',
  ],
  s0339: [
    'On day jihai, because the new and full moons of the twelfth month would both be eclipsed, an edict called for self-examination and reform.',
    'On jihai day, twin eclipses in the twelfth month prompted an edict of repentance.',
  ],
  s0340: [
    'On day xinchou, the Kucha beg Alimusha came to submit.',
    'On xinchou day, Kucha beg Alimusha submitted.',
  ],
  s0341: [
    'On day jiachen, because Zhaohui had fought deep in enemy territory, he was enfeoffed as Duke of Martial Resolution and Strategic Courage of the first rank; the rank of the Emin Khoja prince was raised to commandery-prince level, and Khojasi\'s beile rank was raised to beile-of-the-first-rank level.',
    'On jiachen day, Zhaohui and Khojasi received major ennoblements for the Yarkand campaign.',
  ],
  s0342: [
    'On day dingwei, Namuzhale, Santi, and Kuimadai, moving to support Zhaohui, encountered rebels on the road and were killed.',
    'On dingwei day, Namuzhale, Santi, and Kuimadai died fighting en route to Zhaohui.',
  ],
  s0343: [
    'Namuzhale was posthumously advanced to duke; Santi to baron; Kuimadai was granted a hereditary office.',
    'Posthumous honors went to Namuzhale, Santi, and Kuimadai.',
  ],
  s0344: [
    'Shujede was made Minister of Works.',
    'Shujede became Minister of Works.',
  ],
  s0345: [
    'On day gengxu, Fu De proceeded to Yarkand.',
    'On gengxu day, Fu De marched to Yarkand.',
  ],
  s0346: [
    'Twelfth month, new moon on day guichou: solar eclipse.',
    'On the twelfth-month new moon of guichou, the sun was eclipsed.',
  ],
  s0347: [
    'Left Vice Censor-in-chief Sun Hao memorialized asking to stop touring the following year; the Emperor rebuked his warped judgment, reduced him to third-rank metropolitan official, and issued an edict to court and country on "emulating the ancestral emperor in drilling troops and enduring hardship."',
    'Sun Hao\'s plea to end tours was rejected; he was demoted and the court was told to follow Qianlong\'s martial example.',
  ],
  s0348: [
    'Wind-disaster relief was granted for Taiwan and three other counties of Fujian.',
    'Four Fujian counties including Taiwan received wind relief.',
  ],
  s0349: [
    'Additional flood relief was granted for Renhe and six other counties and subprefectures of Zhejiang.',
    'Extra flood relief went to seven Zhejiang districts including Renhe.',
  ],
  s0350: [
    'On day renxu, Qiu Yixiu was removed from service at the Grand Council.',
    'On renxu day, Qiu Yixiu left Grand Council duty.',
  ],
  s0351: [
    'On day dingmao, quota land tax was remitted for fields washed away in Zhangye and three other subprefectures and counties of Gansu.',
    'On dingmao day, flood-washed fields in four Gansu districts had quota tax remitted.',
  ],
  s0352: [
    'On day wuchen, the Khalkha jasak prince Chibakeyalamupile of Zasak was advanced to prince of the first rank.',
    'On wuchen day, a Khalkha jasak prince was raised to first-rank prince.',
  ],
  s0353: [
    'On day renshen, this year\'s flood quota tax was remitted for Qiantang and six other counties of Zhejiang.',
    'On renshen day, seven Zhejiang counties including Qiantang had flood taxes remitted.',
  ],
  s0354: [
    'Twenty-fourth year, spring, first month, day jiashen: next year\'s quota tax and all accumulated arrears were remitted for the whole province of Gansu.',
    'In the twenty-fourth year\'s first month, Gansu received full remission of next year\'s levy and all arrears.',
  ],
  s0355: [
    'On day guisi, Yarhashan was executed.',
    'On guisi day, Yarhashan was put to death.',
  ],
  s0356: [
    'On day jihai, Grand Secretary Huang Tinggui died; Wu Dashan was made Shaanxi-Gansu governor-general, Mingde Gansu governor acting governor-general.',
    'On jihai day, Huang Tinggui died and Wu Dashan and Mingde received northwest posts.',
  ],
  s0357: [
    'Li Shiyao was appointed governor-general of Guangdong and Guangxi.',
    'Li Shiyao became governor-general of the two Guangs.',
  ],
  s0358: [
    'On day guimao, Jiang Pu was made Grand Secretary while remaining Minister of Revenue; Liang Shizheng Minister of War; Gui Xuangguang Minister of Works; Chen Dehua Left Censor-in-chief; Li Yuanliang concurrently managed the Manchu War Ministry; Suchang acted as Manchu Works Minister.',
    'On guimao day, Jiang Pu, Liang Shizheng, and other central ministers were appointed or shifted.',
  ],
  s0359: [
    'Second month, day renxu: Haning\'a was sentenced to execution.',
    'In the second month, on renxu day, Haning\'a was condemned to death.',
  ],
  s0360: [
    'On day guihai, drought relief was granted for the three banners of Chedub.',
    'On guihai day, three banners received drought relief.',
  ],
  s0361: [
    'On day jiazi, Fu De and Arigun fought Hojijan at Gureng and inflicted a great defeat.',
    'On jiazi day, Fu De and Arigun routed Hojijan at Gureng.',
  ],
  s0362: [
    'Fu De was enfeoffed as a third-rank earl; Shujede, Arigun, Dou Bin, and others were granted hereditary offices.',
    'Fu De became a third-rank earl and several commanders received hereditary ranks.',
  ],
  s0363: [
    'Shujede was ordered back to Aksu to handle affairs.',
    'Shujede was sent back to manage affairs at Aksu.',
  ],
  s0364: [
    'On day jisi, Fu De\'s troops reached Yarkand and joined Zhaohui\'s forces in attack.',
    'On jisi day, Fu De united with Zhaohui outside Yarkand.',
  ],
  s0365: [
    'Fu De was advanced to first-rank earl.',
    'Fu De was raised to first-rank earl.',
  ],
  s0366: [
    'Chebudunjab was made assistant commander; Fulu and Chemuchukejab were made campaign assistant commissioners.',
    'Chebudunjab, Fulu, and Chemuchukejab received frontier commands.',
  ],
  s0367: [
    'Osuman and others seized Kucha.',
    'Osuman\'s faction took Kucha.',
  ],
  s0368: [
    'An edict ordered Balu to relieve Khotan.',
    'Balu was ordered to aid Khotan.',
  ],
  s0369: [
    'On day gengchen, because Zhaohui and Fu De had returned to Aksu, they were severely rebuked.',
    'On gengchen day, Zhaohui and Fu De were sharply censured for withdrawing to Aksu.',
  ],
  s0370: [
    'Third month, day guimao: Shujede was ordered to station at Khotan with Khojasi and cut off the rebels\' escape routes.',
    'In the third month, Shujede and Khojasi were posted at Khotan to block flight.',
  ],
  s0371: [
    'On day jichou, First-rank guardsman Uleden and Vice Commander-in-chief Qinuhun were made Northern Route campaign assistant commissioners.',
    'On jichou day, Uleden and Qinuhun became Northern Route assistants.',
  ],
  s0372: [
    'On day renchen, Yang Yinggui was summoned to the capital; Yang Tingzhang acted as Fujian-Zhejiang governor-general.',
    'On renchen day, Yang Yinggui was recalled and Yang Tingzhang acted in Fujian-Zhejiang.',
  ],
  s0373: [
    'On day jiawu, a comet appeared.',
    'On jiawu day, a comet was seen.',
  ],
  s0374: [
    'On day jihai, Ming Rui was advanced to Duke who Inherits Grace with Resolute Courage.',
    'On jihai day, Ming Rui was raised to Duke who Inherits Grace with Resolute Courage.',
  ],
  s0375: [
    'Locusts appeared in Huai\'an and two other prefectures of Jiangsu.',
    'Locusts struck three Jiangsu prefectures including Huai\'an.',
  ],
  s0376: [
    'Summer, fourth month, day xinhai: Fu De and others relieved Khotan.',
    'In the fourth month, Fu De\'s force relieved Khotan.',
  ],
  s0377: [
    'On day guichou, Agui was made campaign assistant commissioner in Fu De\'s army camp.',
    'On guichou day, Agui joined Fu De\'s staff as assistant commissioner.',
  ],
  s0378: [
    'On day dingsi, the regular summer solstice sacrifice was performed; Heaven was worshipped at the Circular Mound.',
    'On dingsi day, the summer solstice rite was held at the Circular Mound.',
  ],
  s0379: [
    'Because the farmland longed for rain, the Emperor ordered the imperial escort suspended and walked in earnest prayer.',
    'For drought, the Emperor walked to pray without full ceremonial escort.',
  ],
  s0380: [
    'Yang Yinggui was made Shaanxi-Gansu governor-general; Wu Dashan, with governor-general rank, managed provincial governor affairs.',
    'Yang Yinggui took Shaanxi-Gansu; Wu Dashan handled governorship duties with higher rank.',
  ],
  s0381: [
    'On day wuwu, Yang Tingzhang was made Fujian-Zhejiang governor-general and Zhuang Yougong Zhejiang governor.',
    'On wuwu day, Yang Tingzhang and Zhuang Yougong received southeast posts.',
  ],
  s0382: [
    'On day gengshen, last year\'s wind-disaster quota tax was remitted for Qiantang and fifteen other Zhejiang counties and salterns.',
    'On gengshen day, sixteen Zhejiang districts had last year\'s wind taxes remitted.',
  ],
  s0383: [
    'On day xinyou, drought relief for Hezhou and other places in Gansu was extended.',
    'On xinyou day, Gansu drought relief at Hezhou and elsewhere was prolonged.',
  ],
  s0384: [
    'The Ministry of Punishments was ordered to clear prisons and reduce punishments; Gansu was to do the same.',
    'A prison review and sentence reduction were ordered, including in Gansu.',
  ],
  s0385: [
    'On day jiazi, drought and hail relief was granted for Didao and twenty-two other subprefectures, prefectures, counties, and guards of Gansu.',
    'On jiazi day, twenty-three Gansu districts including Didao received drought and hail relief.',
  ],
  s0386: [
    'On day dingmao, the Emperor went in person to the mourning hall of the late Grand Secretary Huang Tinggui.',
    'On dingmao day, the Emperor attended Huang Tinggui\'s funeral rites.',
  ],
  s0387: [
    'On day guiyou, last year\'s flood and hail quota tax was remitted for Yangqu and four other prefectures and counties of Shanxi.',
    'On guiyou day, five Shanxi districts including Yangqu had flood and hail taxes remitted.',
  ],
  s0388: [
    'On day dingchou, fine tribute silks woven for the palace were forbidden.',
    'On dingchou day, elaborate tribute gauzes and embroideries were banned.',
  ],
  s0389: [
    'Shujede was again ordered to return and station at Aksu.',
    'Shujede was told to go back to Aksu.',
  ],
  s0390: [
    'Fifth month, day xinsi: this year\'s quota tax was remitted with distinctions for Tongguan and sixty-four other subprefectures, prefectures, and counties of Shaanxi.',
    'In the fifth month, Shaanxi quota taxes were remitted with distinctions in sixty-five districts.',
  ],
  s0391: [
    'On day xinmao, the Emperor went to Black Dragon Pool to pray for rain.',
    'On xinmao day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0392: [
    'On day dingyou, drought relief was granted for Xianning and other prefectures and counties of Shaanxi.',
    'On dingyou day, Shaanxi drought districts including Xianning were relieved.',
  ],
  s0393: [
    'On day jihai, an edict called on all ministers to examine themselves and still speak frankly of gains and losses.',
    'On jihai day, the court was told to reform and offer candid criticism.',
  ],
  s0394: [
    'On day xinchou, in plain dress the Emperor went to the Altar of Soil and Grain to pray for rain.',
    'On xinchou day, the Emperor prayed in plain dress at the Altar of Soil and Grain.',
  ],
  s0395: [
    'On day dingwei, because rain had not been ample, the Emperor did not ride the palanquin or use the full escort, but walked from Jingyun Gate to sacrifice at the Altar of Earth.',
    'On dingwei day, the Emperor walked without palanquin or full escort to the Altar of Earth for rain.',
  ],
  s0396: [
    'On day jiyou, drought victims in Gaolan and other districts of Gansu were relieved.',
    'On jiyou day, Gansu drought victims including Gaolan received relief.',
  ],
  s0397: [
    'Sixth month, day gengxu: routine capital cases awaiting execution were deferred.',
    'In the sixth month, ordinary death sentences were postponed.',
  ],
  s0398: [
    'On day jiazi, Henglu was made general at Suiyuan city.',
    'On jiazi day, Henglu became Suiyuan garrison general.',
  ],
  s0399: [
    'On day wuwu, drought relief was granted for Yulin and ten other prefectures and counties of Shaanxi.',
    'On wuwu day, eleven Shaanxi districts including Yulin received drought relief.',
  ],
  s0400: [
    'On day gengshen, because of prolonged drought, the Emperor walked to the Circular Mound to perform the great rain-prayer rite.',
    'On gengshen day, the Emperor walked to the Circular Mound for the great rain sacrifice.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b04.mjs <translation.json>'
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
