#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'On day bingxu, arrears of land tax and grain in fourteen Anhui prefectures, counties, and guards including Suzhou were remitted.',
    'On bingxu day, tax arrears were forgiven in fourteen Anhui districts including Suzhou.',
  ],
  s0302: [
    'On day gengyin, Fukang\'an was ordered to escort Le Viet Ki and his dependents to the capital, enroll them in the Han Banner register, and appoint Le Viet Ki hereditary company commander.',
    'On gengyin day, Fukang\'an brought Le Viet Ki to Beijing as a Han Banner company commander.',
  ],
  s0303: [
    'On day guisi, Sichuan governor-general Li Shijie fell ill; guard Qingcheng was sent with physicians to examine him; Sun Shiyi acted in his post and Peng Yuanrui in the Ministry of War.',
    'On guisi day, Li Shijie was ill; Qingcheng brought doctors while Sun Shiyi and Peng Yuanrui filled in for him.',
  ],
  s0304: [
    'On day wuxu, grain borrowed from granaries by people in five Shenyang-area cities was remitted.',
    'On wuxu day, Shenyang-area granary loans were forgiven.',
  ],
  s0305: [
    'Twelfth month, day gengshen: posthumous titles were stripped from the late Grand Secretary Feng Quan and others.',
    'On gengshen in the twelfth month, Feng Quan and others lost their posthumous titles.',
  ],
  s0306: [
    'On day xinwei, because his eightieth-birthday longevity celebration would fall next year, the Emperor ordered the seal "Ba Zheng Mao Nian Zhi Bao" engraved.',
    'On xinwei day, Hongli ordered an eighty-year longevity seal carved ahead of next year\'s birthday.',
  ],
  s0307: [
    'Fifty-fifth year, spring, first month, new moon on day renwu: because of the eightieth-birthday longevity celebration, an edict granted favors by degree.',
    'In spring of the fifty-fifth year, on the first-month new moon, graded amnesties were proclaimed for Hongli\'s eightieth birthday.',
  ],
  s0308: [
    'Land tax and grain dues in all provinces were broadly remitted.',
    'All provinces received a general remission of land tax and grain.',
  ],
  s0309: [
    'On day jichou, the grace edict was promulgated to Korea, Annam, Ryukyu, Siam, and other states.',
    'On jichou day, the amnesty edict went to Korea, Vietnam, Ryukyu, Siam, and others.',
  ],
  s0310: [
    'On day renchen, Grand Secretary Heshen was awarded a yellow belt and a four-panel surcoat.',
    'On renchen day, Heshen received a yellow belt and ceremonial surcoat.',
  ],
  s0311: [
    'The Annam king Nguyen Quang Binh was granted a golden yellow sash belt.',
    'King Nguyen Quang Binh of Vietnam received a golden yellow belt.',
  ],
  s0312: [
    'On day yisi, Korea\'s King Yi San memorialized congratulations on the longevity celebration and presented tribute goods.',
    'On yisi day, King Yi San of Korea sent birthday congratulations and tribute.',
  ],
  s0313: [
    'On day jiyou, Ryukyu\'s King Shang Mu submitted a memorial of thanks and presented tribute goods.',
    'On jiyou day, King Shang Mu of Ryukyu sent thanks and tribute.',
  ],
  s0314: [
    'Second month, new moon on day renzi: because Kaicheng city works in Henan had errors, the Jiang-Lan circuit intendant was demoted and Bi Yuan and others stripped of office but kept at their posts.',
    'On the second-month new moon, Henan wall errors cost Bi Yuan and others their titles while they remained on duty.',
  ],
  s0315: [
    'On day guichou, quota land tax for Yongqing and Wuqing in Zhili for the fifty-fourth year\'s flood was remitted.',
    'On guichou day, Zhili flood taxes for the fifty-fourth year were forgiven at Yongqing and Wuqing.',
  ],
  s0316: [
    'On day jiwei, the Emperor went to the Eastern and Western Tombs, toured Shandong, and remitted three-tenths of land tax and grain in Zhili districts along the route.',
    'On jiwei day, Hongli toured the tombs and Shandong, cutting transit taxes in Zhili by three-tenths.',
  ],
  s0317: [
    'On day renxu, the Emperor paid respects at Zhaoxi, Xiao, and Xiao East Tombs.',
    'On renxu day, the Emperor visited the Zhaoxi, Xiao, and Xiao East Tombs.',
  ],
  s0318: [
    'On day gengwu, the Emperor paid respects at the Tai Tomb and Tai East Tomb.',
    'On gengwu day, the Emperor visited the Tai and Tai East Tombs.',
  ],
  s0319: [
    'On day xinwei, land tax and grain in all Zhili subordinates that had been suspended year by year because of disaster were remitted.',
    'On xinwei day, Zhili disaster-deferred taxes accumulated over years were forgiven.',
  ],
  s0320: [
    'On day renshen, Fukang\'an was ordered to bring Nguyen Quang Binh to audience; Guo Shixun served concurrently as Liangguang governor-general.',
    'On renshen day, Fukang\'an escorted Nguyen Quang Binh to court while Guo Shixun acting headed Liangguang.',
  ],
  s0321: [
    'On day yihai, quota land tax for earthquake disaster fields in five Yunnan subprefectures and counties including Tonghai for the fifty-fourth year was remitted, and tax on fields lost to the sea in the quake was also removed.',
    'On yihai day, Yunnan earthquake taxes for the fifty-fourth year were forgiven, including fields swallowed by the sea.',
  ],
  s0322: [
    'Three-tenths of land tax and grain in Shandong districts along the route were remitted.',
    'Transit districts in Shandong received a three-tenths tax cut.',
  ],
  s0323: [
    'Zhili governor-general Liu E was demoted to vice minister; Liang Kentang became Zhili governor-general and Mu Helan was transferred to Henan governor.',
    'Liu E was demoted; Liang Kentang took Zhili and Mu Helan, Henan.',
  ],
  s0324: [
    'On day wuyin, silver dues in all Shandong subordinates that had been suspended because of disaster were remitted.',
    'On wuyin day, Shandong disaster-deferred silver payments were forgiven.',
  ],
  s0325: [
    'Fu Song was made Anhui governor.',
    'Fu Song became Anhui governor.',
  ],
  s0326: [
    'Third month, day yiyou: the Emperor ascended Mount Tai.',
    'In the third month, the Emperor climbed Mount Tai.',
  ],
  s0327: [
    'On day jiawu, the Emperor paid respects at Shaohao\'s tomb.',
    'On jiawu day, the Emperor visited the tomb of Shaohao.',
  ],
  s0328: [
    'He reached Qufu and paid respects at the Confucius temple.',
    'At Qufu he visited the temple of the Master.',
  ],
  s0329: [
    'On day yiwei, the libation sacrifice was performed.',
    'On yiwei day, he performed the Confucian sacrifice.',
  ],
  s0330: [
    'The Duke Yansheng Kong Xianpei and Kong clansmen were granted regalia, silver, and coins by degree.',
    'Kong Xianpei and the Kong lineage received graded robes, silver, and coins.',
  ],
  s0331: [
    'On day bingshen, the Emperor paid respects at the Kong forest tombs.',
    'On bingshen day, the Emperor visited the Kong cemetery.',
  ],
  s0332: [
    'On day gengzi, one-tenth of levied land grain in all Urumqi prefectures and counties was remitted.',
    'On gengzi day, Urumqi land grain was cut by one-tenth.',
  ],
  s0333: [
    'On day yisi, Burma\'s chief Meng Yun sent envoys to congratulate on the longevity celebration, presented tame elephants, and requested enfeoffment.',
    'On yisi day, Meng Yun of Burma sent birthday envoys with elephants and sought a title.',
  ],
  s0334: [
    'He was ordered enfeoffed King of Burma.',
    'He was created king of Burma.',
  ],
  s0335: [
    'Rent silver on Banner lands in seven Zhili prefectures and counties including Changping that had suffered flood was remitted.',
    'Flood rents on Banner land in seven Zhili districts including Changping were forgiven.',
  ],
  s0336: [
    'The king of Nanzhang Zhaowenmeng memorialized congratulations on the longevity celebration and presented tame elephants.',
    'Nanzhang\'s king sent birthday elephants.',
  ],
  s0337: [
    'On day jiyou, salt-field taxes at five Zhili sites including Changlu for last year\'s flood were remitted.',
    'On jiyou day, Changlu-area salt works\' flood taxes were forgiven.',
  ],
  s0338: [
    'Summer, fourth month, day dingsi: the Emperor visited Tianjin prefecture.',
    'In the fourth month, the Emperor went to Tianjin.',
  ],
  s0339: [
    'Wulana was instructed to investigate abuses in Zhejiang\'s excess collection of tribute grain transport levies.',
    'Wulana was told to probe Zhejiang canal-grain overcharges.',
  ],
  s0340: [
    'On day jiwei, Grand Secretary Ji Huang again received the Grace and Glory Banquet and imperial poems were bestowed on him.',
    'On jiwei day, Ji Huang was again feted at court and given imperial verse.',
  ],
  s0341: [
    'On day xinyou, Ji Qing and Songchun were ordered jointly to survey and clarify the boundary from Ying\'e to Aiyang.',
    'On xinyou day, Ji Qing and Songchun were to fix the Ying\'e–Aiyang frontier.',
  ],
  s0342: [
    'On day yichou, quota land tax for last year\'s flood in eight Anhui prefectures, counties, and guards including Suzhou and Lingbi was remitted.',
    'On yichou day, last year\'s flood taxes were forgiven in eight Anhui districts including Suzhou and Lingbi.',
  ],
  s0343: [
    'The Emperor returned to the capital.',
    'The Emperor returned to Beijing.',
  ],
  s0344: [
    'On day bingyin, the Emperor went to Black Dragon Pool to pray for rain.',
    'On bingyin day, Hongli prayed for rain at Black Dragon Pool.',
  ],
  s0345: [
    'Min E\'yuan was dismissed; Fu Song was transferred to Jiangsu governor and He Yucheng to Anhui governor.',
    'Min E\'yuan was removed; Fu Song took Jiangsu and He Yucheng, Anhui.',
  ],
  s0346: [
    'On day gengwu, because Shu Lin\'s memorial reply had deceit, he was referred to the boards for stern deliberation but kept at his post.',
    'On gengwu day, Shu Lin faced strict review for deceitful reporting but stayed in office.',
  ],
  s0347: [
    'Min E\'yuan was stripped of office and arrested for trial.',
    'Min E\'yuan was deposed and jailed for trial.',
  ],
  s0348: [
    'On day renshen, Yongcheng\'s fifty-fourth-year flood quota land tax in Henan was remitted.',
    'On renshen day, Henan flood taxes for the fifty-fourth year at Yongcheng were forgiven.',
  ],
  s0349: [
    'On day guiyou, Sun Shiyi was made Sichuan governor-general and Li Shijie Minister of War.',
    'On guiyou day, Sun Shiyi took Sichuan and Li Shijie, War.',
  ],
  s0350: [
    'On day yihai, Shi Yunyu and ninety-six others were granted metropolitan graduate degrees and origins by degree.',
    'On yihai day, ninety-seven men including Shi Yunyu received jinshi ranks.',
  ],
  s0351: [
    'On day jimao, three-tenths of quota land tax in sixteen Shanxi prefectures including Taiyuan and Liaozhou and at Guisihua City and elsewhere was remitted.',
    'On jimao day, Shanxi land tax was cut by three-tenths in sixteen districts and at Guisihua.',
  ],
  s0352: [
    'Fifth month, day gengyin: the Emperor went to the Mountain Estate for Escaping the Heat.',
    'In the fifth month, the Emperor went to Rehe.',
  ],
  s0353: [
    'On day gengzi, Le Viet Ki was awarded third-rank office title.',
    'On gengzi day, Le Viet Ki received third-rank rank.',
  ],
  s0354: [
    'On day renyin, land tax and grain for Tibet\'s thirty-nine subject tribes were remitted.',
    'On renyin day, tax was forgiven for Tibet\'s thirty-nine tribes.',
  ],
  s0355: [
    'On day jiyou, Shu Lin was stripped of office and arrested for trial; Fu Song concurrently served as Liangjiang governor-general.',
    'On jiyou day, Shu Lin was deposed and arrested; Fu Song acting headed Liangjiang.',
  ],
  s0356: [
    'Han Heng went to Jiangnan to assist in river works.',
    'Han Heng was sent to Jiangnan for river works.',
  ],
  s0357: [
    'Sixth month, day renzi: Sun Shiyi was transferred to Liangjiang governor-general; Baoning acted as Sichuan governor-general and Yongbao as Ili general.',
    'On renzi in the sixth month, Sun Shiyi took Liangjiang; Baoning and Yongbao acting filled Sichuan and Ili.',
  ],
  s0358: [
    'On day yimao, Chen Yongfu was made Guangxi governor.',
    'On yimao day, Chen Yongfu became Guangxi governor.',
  ],
  s0359: [
    'Min E\'yuan was sentenced to decapitation.',
    'Min E\'yuan was condemned to death.',
  ],
  s0360: [
    'On day dingsi, last year\'s flood quota land tax in fifty-four Zhili circuits, prefectures, and counties including Bazhou and on subordinate Banner lands was remitted.',
    'On dingsi day, last year\'s Zhili flood taxes in fifty-four districts and Banner lands were forgiven.',
  ],
  s0361: [
    'On day wuwu, miscellaneous grain levies on Miao people in five Hunan circuits and counties including Qianzhou were abolished.',
    'On wuwu day, Miao miscellaneous grain taxes in five Hunan districts including Qianzhou were ended.',
  ],
  s0362: [
    'Autumn, seventh month, day jichou: the Annam king Nguyen Quang Binh entered audience.',
    'In the seventh month, King Nguyen Quang Binh of Vietnam came to court.',
  ],
  s0363: [
    'On day gengyin, Zhu Gui was made Anhui governor.',
    'On gengyin day, Zhu Gui became Anhui governor.',
  ],
  s0364: [
    'On day jiawu, flood victims in Chaoyang and Tianjin in Zhili were relieved.',
    'On jiawu day, Chaoyang and Tianjin received Zhili flood relief.',
  ],
  s0365: [
    'On day bingshen, flood victims at Jiuguantai in Fengtian\'s Jinzhou and in Shandong counties including Pingyuan and Yucheng were relieved.',
    'On bingshen day, flood relief was given at Jinzhou Jiuguantai and Shandong\'s Pingyuan and Yucheng.',
  ],
  s0366: [
    'On day dingyou, Minister of War Li Shijie retired for failure to oversee clerks.',
    'On dingyou day, Li Shijie retired from War for lax oversight of clerks.',
  ],
  s0367: [
    'On day jihai, Liu E was recalled and made Minister of War.',
    'On jihai day, Liu E was recalled to head War.',
  ],
  s0368: [
    'On day wushen, the Emperor returned to the capital.',
    'On wushen day, the Emperor returned to Beijing.',
  ],
  s0369: [
    'Flood victims in Jiangsu counties including Dangshan, Suzhou in Anhui, and Yongcheng and Xiayi in Henan were relieved.',
    'Flood relief went to Dangshan and other Jiangsu counties, Suzhou, and Yongcheng and Xiayi.',
  ],
  s0370: [
    'The Wangpingzhuang river in Jiangsu\'s Dangshan breached.',
    'The Wangpingzhuang breach opened in Dangshan, Jiangsu.',
  ],
  s0371: [
    'Fu Song was ordered to go to Suzhou to manage river works.',
    'Fu Song was sent to Suzhou for river works.',
  ],
  s0372: [
    'On day dingwei, flood victims in Shandong\'s Linqing were relieved.',
    'On dingwei day, Linqing received flood relief.',
  ],
  s0373: [
    'Eighth month, day gengxu: Siam\'s King Zheng Hua memorialized congratulations on the longevity celebration and presented tribute goods.',
    'On gengxu in the eighth month, King Zheng Hua of Siam sent birthday tribute.',
  ],
  s0374: [
    'Langgan impeached himself for failure to oversee tribute grain and was dismissed.',
    'Langgan resigned over canal grain and was removed.',
  ],
  s0375: [
    'Haining was transferred to Zhejiang governor and Shu Lin to Shanxi governor.',
    'Haining took Zhejiang and Shu Lin, Shanxi.',
  ],
  s0376: [
    'On day xinyou, on the eightieth-birthday longevity festival, the Emperor took the throne in the Hall of Supreme Harmony; princes, beile, beizi, dukes, civil and military grandees, Mongol khans, princes, beile, beizi, dukes, imperial sons-in-law and taiji, Muslim kings, dukes, taiji and beks, Kazakh, Annam king, Korean, Burmese, and Nanzhang tribute envoys, provincial native chiefs, and Taiwan aborigines all performed congratulatory rites.',
    'On xinyou day, Hongli\'s eightieth birthday was celebrated at the Hall of Supreme Harmony with princes, ministers, Mongols, Muslims, foreign envoys, native chiefs, and Taiwan tribes paying homage.',
  ],
  s0377: [
    'When the rites were complete, banquets were given at the Palace of Tranquil Longevity and the Palace of Heavenly Purity according to ceremony.',
    'After the rites, ceremonial banquets were held at Ningshou and Qianqing Palaces.',
  ],
  s0378: [
    'On day jisi, Minister of Punishments Kaning\'a died; Mingliang succeeded him and Shuchang was ordered to serve concurrently.',
    'On jisi day, Kaning\'a died; Mingliang took Punishments and Shuchang acted.',
  ],
  s0379: [
    'Ninth month, day wuyin: flood victims in Anhui\'s Sizhou were relieved.',
    'In the ninth month, Sizhou received flood relief.',
  ],
  s0380: [
    'On day guawei, the Annam king Nguyen Quang Binh was ordered to return Le Viet Ki\'s kin and former ministers still in his country.',
    'On guawei day, Nguyen Quang Binh was told to send back Le Viet Ki\'s family and old ministers.',
  ],
  s0381: [
    'On day jichou, the Emperor reviewed Vanguard Camp troops.',
    'On jichou day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0382: [
    'On day jiawu, flood victims in twenty-seven Shandong prefectures and counties including Pingyuan were relieved.',
    'On jiawu day, twenty-seven Shandong districts including Pingyuan received flood relief.',
  ],
  s0383: [
    'On day gengzi, Chang Lin was stripped of office for an untrue case judgment; Hui Ling was transferred to Shandong governor, Fu Ning to Hubei governor, and Bi Yuan served concurrently.',
    'On gengzi day, Chang Lin was deposed over a false verdict; Hui Ling took Shandong, Fu Ning Hubei, and Bi Yuan acted.',
  ],
  s0384: [
    'Winter, tenth month, day bingchen: flood victims in twenty-seven Shandong prefectures and counties including Pingyuan were relieved.',
    'On bingchen in the tenth month, twenty-seven Shandong districts including Pingyuan were relieved again.',
  ],
  s0385: [
    'On day jiazi, Baoning was ordered back as Ili general and E\'hui made Sichuan governor-general.',
    'On jiazi day, Baoning returned to Ili and E\'hui took Sichuan.',
  ],
  s0386: [
    'On day renshen, Fu Song was made Zhejiang governor and Chang Lin recalled to act as Jiangsu governor.',
    'On renshen day, Fu Song took Zhejiang and Chang Lin was recalled to acting Jiangsu.',
  ],
  s0387: [
    'Frost victims in three Gansu counties including Gaolan were relieved.',
    'Gaolan and two other Gansu counties received frost relief.',
  ],
  s0388: [
    'Eleventh month, new moon on day dingchou: Pu Lin was made Fujian governor and Feng Guangxiong Hunan governor.',
    'On the eleventh-month new moon, Pu Lin took Fujian and Feng Guangxiong Hunan.',
  ],
  s0389: [
    'On day bingxu, Grand Secretary Wang Jie was promoted Grand Guardian of the Heir Apparent; Ministers Peng Yuanrui, Dong Gao, Hu Jitang, and Fu Chang\'an and General Baoning Lesser Grand Guardian of the Heir Apparent.',
    'On bingxu day, Wang Jie became Grand Guardian and Peng Yuanrui, Dong Gao, Hu Jitang, Fu Chang\'an, and Baoning Lesser Guardian.',
  ],
  s0390: [
    'On day yiwei, Fulehun and Yade were released.',
    'On yiwei day, Fulehun and Yade were freed.',
  ],
  s0391: [
    'On day wuxu, Qingcheng and Yin Zhuangtu were ordered to go to Shanxi to inspect granaries and treasuries.',
    'On wuxu day, Qingcheng and Yin Zhuangtu were sent to audit Shanxi storehouses.',
  ],
  s0392: [
    'On day renxu, flood victims in three Fengtian prefectures and counties including Jinzhou were relieved.',
    'On renxu day, three Fengtian districts including Jinzhou received flood relief.',
  ],
  s0393: [
    'On day wuchen, Minister of Personnel Peng Yuanrui was ordered to assist the Grand Secretariat.',
    'On wuchen day, Peng Yuanrui of Personnel was assigned to the Grand Secretariat.',
  ],
  s0394: [
    'Fifty-sixth year, spring, first month, day dingchou: last year\'s flood victims in three Jiangsu counties including Xiaoxian and three Anhui prefectures and counties including Suzhou were relieved.',
    'In spring of the fifty-sixth year, flood victims in three Jiangsu and three Anhui districts received relief.',
  ],
  s0395: [
    'On day jimao, flood victims in thirty Zhili prefectures and counties including Wen\'an and twenty-seven Shandong prefectures and counties including Pingyuan were relieved.',
    'On jimao day, thirty Zhili districts including Wen\'an and twenty-seven Shandong districts including Pingyuan received flood relief.',
  ],
  s0396: [
    'On day yiyou, because Yin Zhuangtu\'s memorial reply had deceived, he was stripped of office and punished.',
    'On yiyou day, Yin Zhuangtu was deposed and punished for deceitful reporting.',
  ],
  s0397: [
    'On day wuxu, Yuan Fengming was executed by decapitation.',
    'On wuxu day, Yuan Fengming was beheaded.',
  ],
  s0398: [
    'Korea, Siam, and Burma all sent envoys to express thanks and presented tribute goods.',
    'Korea, Siam, and Burma all sent thanks and tribute.',
  ],
  s0399: [
    'Rewards and banquet gifts were bestowed according to precedent.',
    'Rewards and banquets were given as usual.',
  ],
  s0400: [
    'On day jihai, Baoning was made palace attendant grandee before the throne.',
    'On jihai day, Baoning became an imperial presence grandee.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b04.mjs <translation.json>'
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
