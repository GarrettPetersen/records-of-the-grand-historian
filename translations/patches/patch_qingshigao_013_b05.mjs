#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day gengyin, Grand Secretary and Liangjiang governor-general Gao Jin was summoned to the capital to inspect Yongding River works.',
    'On gengyin day, Gao Jin was recalled from Liangjiang to inspect the Yongding River.',
  ],
  s0402: [
    'Saizai was ordered to act concurrently as Liangjiang governor-general.',
    'Saizai was told to act at Liangjiang.',
  ],
  s0403: [
    'On day renchen, the Yongding River breach was closed.',
    'On renchen day, the Yongding breach closed.',
  ],
  s0404: [
    'On day guisi, the Emperor proceeded to Mulan for the battue.',
    'On guisi day, the Emperor went to Mulan to hunt.',
  ],
  s0405: [
    'On day dingyou, Altai was ordered to continue managing Sichuan governor-general affairs and Defu was recalled to the capital.',
    'On dingyou day, Altai kept Sichuan duties and Defu was recalled.',
  ],
  s0406: [
    'Ninth month, new moon on day wuxu: this year\'s review of capital sentences was suspended.',
    'On the ninth-month new moon, wuxu, capital executions were halted for the year.',
  ],
  s0407: [
    'On day guimao, Lifanyuan Vice Minister Qing Gui was ordered to serve in the Grand Council.',
    'On guimao day, Qing Gui joined the Grand Council.',
  ],
  s0408: [
    'On day yisi, Torghut taiji Ubashi and others had audience and were rewarded with rank insignia and court dress in differing grades.',
    'On yisi day, Ubashi and other Torghut taiji were received and given graded insignia and robes.',
  ],
  s0409: [
    'Vice General Wenfu and Grand Minister Consultant Wu Dai were ordered to the Sichuan army camp to consult on the advance and suppression.',
    'Wenfu and Wu Dai were sent to the Sichuan front to plan the campaign.',
  ],
  s0410: [
    'On day xinhai, Ubashi was enfeoffed as Khan of the Old Torghut Choliktu under Unaen Sizhuketu; Tsebek Dorji as Prince Buyantu of the Old Torghut; Sele as Prince Biliktu of the New Torghut under Cisit Qilitu; Bambal as Prince Bixiletu; and the rest received peerages in differing grades.',
    'On xinhai day, Ubashi and other Torghut leaders received khan, prince, and lesser titles in graded ranks.',
  ],
  s0411: [
    'On day jiayin, the Emperor returned and halted at the Mountain Resort for Summer Retreat.',
    'On jiayin day, the Emperor returned to the Summer Resort.',
  ],
  s0412: [
    'On day dingmao, Wenshou was made Sichuan governor and Le\'erjin Shaanxi governor.',
    'On dingmao day, Wenshou became Sichuan governor and Le\'erjin Shaanxi governor.',
  ],
  s0413: [
    'Yongde was transferred to Guangxi governor, Liang Guozhi to Hunan governor, and Chen Huizu to Hubei governor.',
    'Yongde, Liang Guozhi, and Chen Huizu were reassigned to Guangxi, Hunan, and Hubei.',
  ],
  s0414: [
    'Winter, tenth month, new moon on day wuchen: Sanbao was made Shanxi governor.',
    'On the tenth-month new moon, wuchen, Sanbao became Shanxi governor.',
  ],
  s0415: [
    'On day jisi, the Emperor escorted the Empress Dowager in returning the imperial progress.',
    'On jisi day, the court escorted the Empress Dowager on the return journey.',
  ],
  s0416: [
    'Shuhede was made general-in-chief presiding over Yili and other places; Iletu Tarbagatai grand minister consultant; Antai Ush grand minister consultant.',
    'Shuhede headed Yili; Iletu took Tarbagatai and Antai took Ush.',
  ],
  s0417: [
    'On day jiaxu, Ji Yun was pardoned and granted Hanlin Academician Compiler.',
    'On jiaxu day, Ji Yun was pardoned and made Hanlin compiler.',
  ],
  s0418: [
    'On day yihai, the Emperor escorted the Empress Dowager back to the capital.',
    'On yihai day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0419: [
    'On day jimao, Gao Jin and others reported the Chenjiakou river works at Taoyuan subprefecture closed; the Emperor praised this.',
    'On jimao day, Gao Jin reported the Taoyuan Chenjiakou works closed and was praised.',
  ],
  s0420: [
    'Gao Jin, Qiu Yuexiu, and Yang Tingzhang were ordered to inspect the Southern Grand Canal.',
    'Gao Jin, Qiu Yuexiu, and Yang Tingzhang were sent to inspect the Southern Canal.',
  ],
  s0421: [
    'On day dinghai, Yang Tingzhang was summoned as Minister of Punishments; Zhou Yuanli was made Zhili governor-general and Xu Ji Shandong governor.',
    'On dinghai day, Yang Tingzhang became Minister of Punishments; Zhou Yuanli took Zhili and Xu Ji Shandong.',
  ],
  s0422: [
    'On day jiawu, Shaanxi-Gansu governor-general Wu Dashan died; Wenshou was transferred to replace him.',
    'On jiawu day, Wu Dashan died and Wenshou replaced him in Shaanxi-Gansu.',
  ],
  s0423: [
    'Eleventh month, day jiyou: Dong Tianbi reported capturing the Lesser Jinchuan Niuchang stockade.',
    'In the eleventh month, jiyou, Dong Tianbi took Lesser Jinchuan Niuchang.',
  ],
  s0424: [
    'On day bingchen, the Emperor escorted the Empress Dowager to Cining Palace and ceremonially offered the honorific title Chongqing Cixuan Kanghui Dunhe Yushou Chunxi Gongyi Anqi Empress Dowager; an amnesty edict was issued with differing favors.',
    'On bingchen day, the Empress Dowager received a long honorific at Cining and a graded amnesty followed.',
  ],
  s0425: [
    'Wenfu was made Grand Secretary of the Hall of Military Glory and concurrently Minister of War; Guilin became Sichuan governor.',
    'Wenfu became War Minister and grand secretary; Guilin became Sichuan governor.',
  ],
  s0426: [
    'On day dingsi, Suo\'erna was transferred to Lifanyuan Minister and Shuhede Minister of Revenue.',
    'On dingsi day, Suo\'erna took Lifanyuan and Shuhede took Revenue.',
  ],
  s0427: [
    'On day xinyou, on the Empress Dowager\'s Longevity Festival the Emperor went to Shoukang Palace and led princes and ministers in congratulations.',
    'On xinyou day, the Emperor led court congratulations at Shoukang for the Empress Dowager\'s birthday.',
  ],
  s0428: [
    'On day renchen, Dong Tianbi attacked Dambazong and was defeated.',
    'On renchen day, Dong Tianbi failed at Dambazong.',
  ],
  s0429: [
    'On day jiazi, Lesser Jinchuan tribes recaptured Niuchang.',
    'On jiazi day, Lesser Jinchuan retook Niuchang.',
  ],
  s0430: [
    'Twelfth month, day gengwu: Wenfu reported advancing headquarters to Xiangyangping and attacking Balangla mountain blockhouses in Lesser Jinchuan without success.',
    'In month 12, gengwu, Wenfu attacked Balangla blockhouses from Xiangyangping and failed.',
  ],
  s0431: [
    'Guilin reported capturing Yueza stockade in Lesser Jinchuan.',
    'Guilin reported taking Lesser Jinchuan Yueza.',
  ],
  s0432: [
    'Sichuan provincial military commander Dong Tianbi was stripped of office; Agui was ordered to act in his place.',
    'Dong Tianbi lost his Sichuan command and Agui acted in his stead.',
  ],
  s0433: [
    'On day yihai, quota tax was remitted for thirty-three Gansu prefectures and counties including Longxi for water, drought, hail, and frost disasters of the thirty-third year.',
    'On yihai day, thirty-three Gansu districts including Longxi were forgiven disaster taxes for year 33.',
  ],
  s0434: [
    'On day bingxu, because Greater Jinchuan chief Songge Sang sent a tribal envoy to Guilin\'s camp with gifts, orders were given to reward and send him back.',
    'On bingxu day, Songge Sang\'s envoy to Guilin was rewarded and dismissed.',
  ],
  s0435: [
    'On day jichou, Wenfu reported capturing Balangla blockhouses.',
    'On jichou day, Wenfu took Balangla blockhouses.',
  ],
  s0436: [
    'On day guisi, Wenfu reported advancing headquarters to Rilongzong; Dong Tianbi recovered the Woqeshi chieftain\'s stockades.',
    'On guisi day, Wenfu moved to Rilongzong and Dong Tianbi retook Woqeshi stockades.',
  ],
  s0437: [
    'Thirty-seventh year, spring, first month, day xinchou: quota rice and beans were remitted for Fengtian and Jinzhou prefectures.',
    'In spring of year 37, xinchou, Fengtian and Jinzhou lost quota rice and beans.',
  ],
  s0438: [
    'Quota silver and grain were remitted for Yuhuan and Haining subprefectures in Zhejiang.',
    'Zhejiang\'s Yuhuan and Haining lost quota silver and grain.',
  ],
  s0439: [
    'Quota military rations in rice, beans, grain, and wheat were remitted for Datong and one other Shanxi prefecture; three-tenths of quotas for fourteen prefectures including Taiyuan and Guihuacheng dependencies.',
    'Shanxi military rations were forgiven at Datong and elsewhere; Taiyuan and thirteen others lost three-tenths of quota.',
  ],
  s0440: [
    'On day renchen, quota silver for grazing lands at Horinger and other places and the Imperial Stud pastures was remitted, and three-tenths of quota silver and rice and beans at Qingshuihe subprefecture and Stud pastures.',
    'On renchen day, Horinger and Stud pasture taxes were forgiven; Qingshuihe lost three-tenths of silver and grain.',
  ],
  s0441: [
    'On day guimao, Minister of Punishments Yang Tingzhang died; Cui Yingjie was made Minister of Punishments and Jiamo acted as grain transport governor-general.',
    'On guimao day, Yang Tingzhang died; Cui Yingjie took Punishments and Jiamo acted at grain transport.',
  ],
  s0442: [
    'On day yisi, Wenfu reported capturing Zengtougou and Kay blockhouses in Lesser Jinchuan.',
    'On yisi day, Wenfu took Zengtougou and Kay in Lesser Jinchuan.',
  ],
  s0443: [
    'On day dingwei, Guilin reported capturing Guosong and Jiamu blockhouses.',
    'On dingwei day, Guilin took Guosong and Jiamu blockhouses.',
  ],
  s0444: [
    'On day gengxu, Hengluo was made inner grand minister.',
    'On gengxu day, Hengluo became an inner grand minister.',
  ],
  s0445: [
    'On day guichou, Urumqi city was built and troops stationed for colonization farming.',
    'On guichou day, Urumqi was walled and garrisoned for farming.',
  ],
  s0446: [
    'On day guihai, Minister Qiu Yuexiu was ordered with Zhili governor-general Zhou Yuanli to dredge the Yongding and Northern Grand Canals.',
    'On guihai day, Qiu Yuexiu and Zhou Yuanli were told to dredge the Yongding and Northern Canal.',
  ],
  s0447: [
    'Second month, day dingmao: Agui was made campaign consultant minister in the Sichuan army.',
    'In month 2, dingmao, Agui became a Sichuan campaign consultant.',
  ],
  s0448: [
    'On day jiaxu, the Emperor visited Panshan.',
    'On jiaxu day, the Emperor went to Panshan.',
  ],
  s0449: [
    'On day bingxu, the Emperor returned the progress and proceeded to the Old Summer Palace.',
    'On bingxu day, the court returned and went to the Old Summer Palace.',
  ],
  s0450: [
    'On day dinghai, Sebten Balzhur was made campaign consultant minister in the Sichuan army.',
    'On dinghai day, Sebten Balzhur became a Sichuan campaign consultant.',
  ],
  s0451: [
    'On day yiwei, original-form rent grain for twelve Shaanxi prefectures including Xi\'an for the previous year was remitted.',
    'On yiwei day, twelve Shaanxi districts including Xi\'an lost last year\'s rent grain.',
  ],
  s0452: [
    'Third month, new moon on day bingshen: arrears from years six through ten were remitted for eleven Jiangsu prefectures and counties including Jintan.',
    'On the third-month new moon, bingshen, eleven Jiangsu districts including Jintan lost arrears from years 6–10.',
  ],
  s0453: [
    'On day wuxu, Sonom Tablai was made Urumqi grand minister consultant, Degyun expedition commander, both under Yili general\'s command.',
    'On wuxu day, Sonom Tablai took Urumqi and Degyun led the column, both under Yili.',
  ],
  s0454: [
    'On day yisi, Fengsheng\'e was made Sichuan army campaign consultant minister.',
    'On yisi day, Fengsheng\'e became a Sichuan campaign consultant.',
  ],
  s0455: [
    'On day jiyou, Luo Shan county retired magistrate Zha Shizhu was sentenced to decapitation for concealing the Ming History compilation Essentials.',
    'On jiyou day, Zha Shizhu was executed for hiding the Ming History Essentials.',
  ],
  s0456: [
    'On day renzi, Guilin reported capturing Mubala and other places held by Greater Jinchuan in the Gurbushi chieftain\'s domain.',
    'On renzi day, Guilin retook Gurbushi lands seized by Greater Jinchuan.',
  ],
  s0457: [
    'On day maoyin, Wenfu reported capturing the Zili stockade in Lesser Jinchuan.',
    'On maoyin day, Wenfu took Lesser Jinchuan Zili.',
  ],
  s0458: [
    'On day dingwei, Guilin reported capturing the Jidi stockade.',
    'On dingwei day, Guilin took Jidi stockade.',
  ],
  s0459: [
    'Wenfu reported capturing the Akemuya stockade in Lesser Jinchuan.',
    'Wenfu reported taking Lesser Jinchuan Akemuya.',
  ],
  s0460: [
    'Guilin reported capturing Dangli and other stockades of the Gurbushi chieftain and blockhouses below Zhawakeiya in Lesser Jinchuan.',
    'Guilin took Gurbushi Dangli and other stockades and Zhawakeiya blockhouses.',
  ],
  s0461: [
    'Fourth month, summer, new moon on day bingyin: Guilin reported capturing Ayangdong Shanliang and other stockades in Lesser Jinchuan.',
    'On the fourth-month new moon, bingyin, Guilin took Ayangdong Shanliang and other Lesser Jinchuan stockades.',
  ],
  s0462: [
    'Stored grain arrears owed by the people over the years in Gansu totaling more than 3.76 million shi were written off.',
    'Gansu granary arrears above 3.76 million shi were forgiven.',
  ],
  s0463: [
    'On day renshen, Guilin reported fully recovering Gurbushi chieftain territory and capturing Gewu and other places in Lesser Jinchuan.',
    'On renshen day, Guilin restored all Gurbushi lands and took Gewu and other Lesser Jinchuan sites.',
  ],
  s0464: [
    'Wenfu and Guilin were instructed to advance and suppress Suonuomu.',
    'Wenfu and Guilin were ordered to press the attack on Suonuomu.',
  ],
  s0465: [
    'On day yihai, Li Hu was appointed Yunnan governor and Tu Side Guizhou governor.',
    'On yihai day, Li Hu took Yunnan and Tu Side Guizhou.',
  ],
  s0466: [
    'On day renwu, the Anxi circuit was changed to Barkol colonization and grain transport defense circuit; the Gansu circuit to Ansu defense circuit; the Liangzhuang circuit to Ganliang defense circuit.',
    'On renwu day, Anxi, Gansu, and Liangzhuang circuits were reorganized as Barkol, Ansu, and Ganliang defense circuits.',
  ],
  s0467: [
    'The Urumqi grain circuit was abolished.',
    'The Urumqi grain circuit was ended.',
  ],
  s0468: [
    'On day gengyin, Jin Bang and 161 others were granted jinshi with differing ranks of appointment.',
    'On gengyin day, Jin Bang and 161 others received jinshi degrees in graded ranks.',
  ],
  s0469: [
    'On day jiawu, Guilin attacked the Dawu east-bank mountain ridge in Lesser Jinchuan and was defeated.',
    'On jiawu day, Guilin failed at Dawu\'s east-bank ridge.',
  ],
  s0470: [
    'Fifth month, new moon on day yimao: because Wenfu impeached Sebten Balzhur for bungling military affairs, his title and office were stripped.',
    'On the fifth-month new moon, yimao, Sebten Balzhur lost rank after Wenfu\'s impeachment for military failure.',
  ],
  s0471: [
    'On day bingchen, arrears accumulated over years were remitted for fifteen Zhili prefectures and counties including Cangzhou.',
    'On bingchen day, fifteen Zhili districts including Cangzhou lost long arrears.',
  ],
  s0472: [
    'On day dingyou, Shuhede was made senior imperial bodyguard of the interior.',
    'On dingyou day, Shuhede became senior imperial bodyguard.',
  ],
  s0473: [
    'Fulang\'an was ordered to proceed to Sichuan to investigate Altai\'s impeachment of Guilin for perverse fabrication.',
    'Fulang\'an was sent to Sichuan to probe Altai\'s charge that Guilin had falsified reports.',
  ],
  s0474: [
    'Tuoyong was ordered temporarily to manage concurrently as Minister of War; Suo\'erna acted as Minister of Works.',
    'Tuoyong temporarily took War and Suo\'erna acted at Works.',
  ],
  s0475: [
    'On day renyin, Vice Minister of Revenue Fukang\'an was ordered to serve in the Grand Council.',
    'On renyin day, Fukang\'an joined the Grand Council.',
  ],
  s0476: [
    'On day guimao, Hailancha and others were ordered to the Western Route Sichuan army camp; Elan and others to the Southern Route camp.',
    'On guimao day, Hailancha went to the Western Route and Elan to the Southern Route.',
  ],
  s0477: [
    'Rongbao was transferred to Suiyuan garrison general.',
    'Rongbao became Suiyuan garrison general.',
  ],
  s0478: [
    'Guilin was stripped of office and arrested for concealing defeats.',
    'Guilin was dismissed and arrested for hiding setbacks.',
  ],
  s0479: [
    'Altai was ordered to act as Sichuan governor.',
    'Altai was told to act at Sichuan.',
  ],
  s0480: [
    'On day jiwei, the Emperor escorted the Empress Dowager to the Mountain Resort for Summer Retreat.',
    'On jiwei day, the court went to the Summer Resort with the Empress Dowager.',
  ],
  s0481: [
    'On day jiazi, Huguang governor-general Fuming\'an died; Haiming became Huguang governor-general and Haicheng Jiangxi governor.',
    'On jiazi day, Fuming\'an died; Haiming took Huguang and Haicheng Jiangxi.',
  ],
  s0482: [
    'Quota tax was remitted with differing measures for fifteen Zhili prefectures and counties including Daxing.',
    'Fifteen Zhili districts including Daxing lost quota tax in graded amounts.',
  ],
  s0483: [
    'Sixth month, new moon on day yichou: the Emperor escorted the Empress Dowager and halted at the Summer Resort.',
    'On the sixth-month new moon, yichou, the court halted at the Summer Resort with the Empress Dowager.',
  ],
  s0484: [
    'Wenfu and others captured the Dongma stockade in Lesser Jinchuan.',
    'Wenfu\'s force took Lesser Jinchuan Dongma.',
  ],
  s0485: [
    'Agui was instructed to supervise the upper, middle, and lower Zhaigu and Chuosijiabu native chieftains in advancing against Jinchuan.',
    'Agui was told to lead Zhaigu and Chuosijiabu chiefs against Jinchuan.',
  ],
  s0486: [
    'On day dingchou, quota tax was remitted for twenty-five Gansu subprefectures and counties including Gaolan for drought disaster.',
    'On dingchou day, twenty-five Gansu districts including Gaolan lost drought quota tax.',
  ],
  s0487: [
    'On day xinsi, Shengjing general Hengluo died and Zenghai was transferred to replace him.',
    'On xinsi day, Hengluo died and Zenghai replaced him at Shengjing.',
  ],
  s0488: [
    'Fu Yu was made Heilongjiang general.',
    'Fu Yu became Heilongjiang general.',
  ],
  s0489: [
    'On day jiashen, Wenshou was transferred to Sichuan governor-general, Haiming to Shaanxi-Gansu governor-general, with Le\'erjin acting.',
    'On jiashen day, Wenshou took Sichuan, Haiming Shaanxi-Gansu, and Le\'erjin acted.',
  ],
  s0490: [
    'Altai was ordered to act as Huguang governor-general.',
    'Altai was told to act at Huguang.',
  ],
  s0491: [
    'On day bingxu, Altai was dismissed; Haiming was transferred to Huguang governor-general.',
    'On bingxu day, Altai was removed and Haiming took Huguang.',
  ],
  s0492: [
    'Le\'erjin was ordered to act as Shaanxi-Gansu governor-general; Fulehun was transferred to Shaanxi governor.',
    'Le\'erjin acted in Shaanxi-Gansu and Fulehun became Shaanxi governor.',
  ],
  s0493: [
    'Granary director Liu Bingqian was ordered to the Western Route Sichuan army camp to supervise supplies.',
    'Liu Bingqian was sent to the Western Route to oversee rations.',
  ],
  s0494: [
    'On day xinmao, Huguang governor-general Haiming died; Fulehun replaced him with Chen Huizu acting.',
    'On xinmao day, Haiming died; Fulehun succeeded with Chen Huizu acting.',
  ],
  s0495: [
    'Bayansan was appointed Shaanxi governor.',
    'Bayansan became Shaanxi governor.',
  ],
  s0496: [
    'Seventh month, day yimao: Vice Minister of Punishments Ebao was ordered to the Southern Route Sichuan army camp to supervise supplies; Le\'erjin was granted Shaanxi-Gansu governor-general.',
    'In month 7, yimao, Ebao oversaw Southern Route supplies and Le\'erjin received Shaanxi-Gansu.',
  ],
  s0497: [
    'Eighth month, day jisi: Agui reported capturing Airmu Shanliang blockhouses in Lesser Jinchuan.',
    'In month 8, jisi, Agui took Lesser Jinchuan Airmu Shanliang blockhouses.',
  ],
  s0498: [
    'Agui was made inner grand minister.',
    'Agui became an inner grand minister.',
  ],
  s0499: [
    'The Bulakdi chieftain Andor was granted the honorific name Gongshun and the Bawang native chieftainess Jarang the name Gongyi.',
    'Bulakdi\'s Andor received the style Gongshun and Bawang\'s Jarang Gongyi.',
  ],
  s0500: [
    'On day renshen, Wenfu and others reported Lesser Jinchuan bandits raiding the Maldike transport route; Hailancha and others defeated them.',
    'On renshen day, Wenfu reported a raid on the Maldike supply line and Hailancha beat the attackers back.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b05.mjs <translation.json>'
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
