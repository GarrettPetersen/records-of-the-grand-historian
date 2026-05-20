#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Ninth month, day gengzi: the Emperor returned to the capital.',
    'On gengzi in the ninth month, the Emperor returned to Beijing.',
  ],
  s0302: [
    'Winter, tenth month, day renxu: community-granary grain owed by the people of subordinate units of three Shaanxi prefectures and departments including Yan\'an, from Qianlong 20 through 37, was remitted.',
    'On renxu in the tenth month, Yan\'an and two other Shaanxi districts were forgiven community-granary grain debts from 1735–1772.',
  ],
  s0303: [
    'Horse tribute silver due from Tibetan Nakshu thirty-nine tribes and other Fan people was remitted.',
    'Horse tribute silver for Nakshu\'s thirty-nine Tibetan tribes was forgiven.',
  ],
  s0304: [
    'On day yihai, quota land tax for seventeen Gansu subprefectures, departments, and counties including Zhuanglang that had suffered disaster was remitted.',
    'On yihai day, disaster taxes were remitted in seventeen Gansu districts including Zhuanglang.',
  ],
  s0305: [
    'Eleventh month, day jiashen: quota land tax was remitted for eleven Anhui prefectures and counties including Bozhou.',
    'On jiashen in the eleventh month, land tax was forgiven in eleven Anhui districts including Bozhou.',
  ],
  s0306: [
    'On day wuxu, Hangzhou general Songzhu was stripped of office for indulgence in pleasure, and a circular notice of admonition was still issued.',
    'On wuxu day, Hangzhou general Songzhu lost his post for dissipation; a general warning was issued.',
  ],
  s0307: [
    'On day guimao, disaster victims in twelve Gansu subprefectures, departments, and counties including Gaolan were relieved, and this year\'s quota land tax was also remitted.',
    'On guimao day, Gaolan and eleven other Gansu districts received relief and this year\'s tax was forgiven.',
  ],
  s0308: [
    'On day bingwu, Yao Chengilie was made Guangxi governor.',
    'On bingwu day, Yao Chengilie became Guangxi governor.',
  ],
  s0309: [
    'Wumitai was assigned to escort the Panchen to Rehe and was given the imperial commissioner seal.',
    'Wumitai escorted the Panchen to Rehe with commissioner credentials.',
  ],
  s0310: [
    'Twelfth month, day guichou: Vice Minister Decheng was ordered to Henan to jointly manage river works.',
    'On guichou in the twelfth month, Vice Minister Decheng was sent to Henan for river works.',
  ],
  s0311: [
    'On day jiayin, Revenue Vice Minister Dong Gao was ordered to serve at the Grand Council.',
    'On jiayin day, Dong Gao of Revenue joined the Grand Council.',
  ],
  s0312: [
    'On day yimao, Liangguang governor-general Gui Lin died; Bayaan succeeded him, and Yade became Shanxi governor.',
    'On yimao day, Gui Lin died; Bayaan took Liangguang and Yade became Shanxi governor.',
  ],
  s0313: [
    'On day wuwu, Grand Secretary Yu Minzhong died.',
    'On wuwu day, Grand Secretary Yu Minzhong died.',
  ],
  s0314: [
    'Huguang governor-general Tuside died; Fulehun succeeded him, and Chuoketuo became Minister of Works.',
    'Tuside died; Fulehun took Huguang and Chuoketuo became Works minister.',
  ],
  s0315: [
    'On day bingyin, this year\'s flood victims in seven Hubei prefectures, counties, and guards including Mianyang were relieved.',
    'On bingyin day, flood relief was given in seven Hubei districts including Mianyang.',
  ],
  s0316: [
    'On day jisi, Cheng Jingyi was made Wenyuan Pavilion Grand Secretary; Ji Huang was transferred to Minister of Personnel and Associate Grand Secretary; Zhou Huang was made Minister of Works.',
    'On jisi day, Cheng Jingyi became Wenyuan grand secretary; Ji Huang joined Personnel and the Grand Secretariat; Zhou Huang took Works.',
  ],
  s0317: [
    'On day xinwei, Zhili governor-general Yang Jingsu died; Yuan Shoutong succeeded him.',
    'On xinwei day, Yang Jingsu died and Yuan Shoutong took Zhili.',
  ],
  s0318: [
    'Chen Huizu was transferred to be Canal Transport governor-general east of the Yellow River; Rongzhu was made Henan governor.',
    'Chen Huizu became east-of-Huanghe canal commissioner; Rongzhu, Henan governor.',
  ],
  s0319: [
    'Forty-fifth year, spring, first month, new moon on day gengchen: because the August seventieth-birthday longevity celebration was at hand, an edict was issued granting favors by degree.',
    'In spring of the forty-fifth year, on the first-month new moon, Hongli proclaimed graded amnesties ahead of his August seventieth birthday.',
  ],
  s0320: [
    'On day xinsi, quota land tax was remitted for thirteen Henan prefectures and counties including Yifeng that had suffered disaster.',
    'On xinsi day, disaster taxes were forgiven in thirteen Henan districts including Yifeng.',
  ],
  s0321: [
    'On day xinmao, the Emperor toured Jiangnan and Zhejiang; this year\'s quota land tax was remitted by three-tenths for districts passed through in Zhili and Shandong.',
    'On xinmao day, the Emperor toured Jiang-Zhe and cut transit taxes thirty percent in Zhili and Shandong.',
  ],
  s0322: [
    'On day renchen, tax arrears were remitted for subordinates of four Zhili prefectures including Shunde.',
    'On renchen day, back taxes were forgiven in four Zhili prefectures including Shunde.',
  ],
  s0323: [
    'On day jihai, tax arrears and granary grain owed were remitted for twenty-eight Shandong prefectures and counties including Licheng.',
    'On jihai day, Licheng and twenty-seven other Shandong districts were forgiven arrears and granary debts.',
  ],
  s0324: [
    'On day jiyou, Korean King Yi Suan memorialized congratulations on the longevity celebration; a gracious edict replied.',
    'On jiyou day, Korea\'s king congratulated the longevity celebration and received a warm reply.',
  ],
  s0325: [
    'Seawall works at Zhejiang\'s Renhe and Haining were repaired.',
    'Renhe and Haining seawalls in Zhejiang were repaired.',
  ],
  s0326: [
    'Second month, day guichou: Shuchang was ordered together with Heshen and Kaning\'a to investigate the various charges in the Haining impeachment of Li Shiyao.',
    'On guichou in the second month, Shuchang, Heshen, and Kaning\'a were assigned to probe Li Shiyao\'s Haining case.',
  ],
  s0327: [
    'On day jiayin, this year\'s quota land tax was remitted by three-tenths for districts passed through in Jiangnan and Zhejiang.',
    'On jiayin day, Jiangnan and Zhejiang transit taxes were cut thirty percent.',
  ],
  s0328: [
    'Tax arrears before the forty-third year among subordinates of the Two Jiangs were remitted.',
    'Two Jiangs districts were forgiven taxes owed before year 43.',
  ],
  s0329: [
    'On day bingchen, Li Fenghan was transferred to Canal Transport governor-general east of the Yellow River; Chen Huizu to Jiangnan Canal Transport governor-general.',
    'On bingchen day, Li Fenghan took east-of-Huanghe canal duties and Chen Huizu, Jiangnan canal transport.',
  ],
  s0330: [
    'On day dingsi, this year\'s quota grain was remitted for Taiwan prefecture and its subordinates; disaster arrears of salt-furnace households in the Two Huai and unpaid Sichuan tribute silver were remitted.',
    'On dingsi day, Taiwan grain tax was forgiven and Two Huai and Sichuan tribute debts were cleared.',
  ],
  s0331: [
    'On day jiwei, the Emperor crossed the river and inspected the eastern-bank dikes at Qingkou.',
    'On jiwei day, the Emperor crossed the Yangzi and inspected Qingkou east-bank dikes.',
  ],
  s0332: [
    'On day jiazi, this year\'s quota land tax was remitted for metropolitan satellite prefectures and counties of Jiangnan and Zhejiang.',
    'On jiazi day, capital-suburb taxes were forgiven in Jiangnan and Zhejiang.',
  ],
  s0333: [
    'On day wuchen, the Emperor visited Jiaoshan.',
    'On wuchen day, the Emperor visited Jiaoshan.',
  ],
  s0334: [
    'On day renshen, the Emperor visited Suzhou prefecture.',
    'On renshen day, the Emperor visited Suzhou.',
  ],
  s0335: [
    'The breach at Yifeng was closed.',
    'The Yifeng river breach was sealed.',
  ],
  s0336: [
    'On day jimao, tax arrears were remitted for Zhejiang counties including Renhe.',
    'On jimao day, back taxes were forgiven in Renhe and other Zhejiang counties.',
  ],
  s0337: [
    'Third month, day xinsi: the Emperor visited Haining prefecture to watch the tide.',
    'On xinsi in the third month, the Emperor watched the tide at Haining.',
  ],
  s0338: [
    'On day renwu, the Emperor visited Jianshan.',
    'On renwu day, the Emperor visited Jianshan.',
  ],
  s0339: [
    'Suonuomu Celing was summoned to the capital; Kuilin was made Urumqi commandant.',
    'Suonuomu Celing was called to Beijing; Kuilin became Urumqi commandant.',
  ],
  s0340: [
    'On day guiwei, the Emperor visited Hangzhou prefecture.',
    'On guiwei day, the Emperor visited Hangzhou.',
  ],
  s0341: [
    'On day jiashen, the Emperor visited Qiutaogong to review the naval forces.',
    'On jiashen day, the Emperor reviewed the fleet at Qiutaogong.',
  ],
  s0342: [
    'Boqing\'e was made Minister of the Court of Colonial Affairs.',
    'Boqing\'e became colonial affairs minister.',
  ],
  s0343: [
    'On day renchen, Li Zhiying was transferred to Zhejiang governor; Li Hu to Guangdong governor; Liu Yong was made Hunan governor.',
    'On renchen day, Li Zhiying took Zhejiang, Li Hu Guangdong, and Liu Yong Hunan.',
  ],
  s0344: [
    'Because the metropolitan evaluation period had arrived, A Gui and others were rated for merit records; Left Censor-in-Chief Cui Yingjie and others retired at their original ranks.',
    'At evaluation time, A Gui and others received merit ratings; Cui Yingjie and other censors retired at rank.',
  ],
  s0345: [
    'On day guisi, Luo Yuanhan was made Left Censor-in-Chief.',
    'On guisi day, Luo Yuanhan became left censor-in-chief.',
  ],
  s0346: [
    'On day dingyou, Li Shiyao was stripped of office and arrested for interrogation.',
    'On dingyou day, Li Shiyao was dismissed and arrested.',
  ],
  s0347: [
    'Sun Shiyi was stripped of office and sent to serve at Yili.',
    'Sun Shiyi lost his post and was banished to Yili.',
  ],
  s0348: [
    'Fukang\'an was made Yunnan-Guizhou governor-general; Suonuomu Celing was made Shengjing general.',
    'Fukang\'an took Yunnan-Guizhou; Suonuomu Celing became Shengjing general.',
  ],
  s0349: [
    'On day xinchou, Yinglian was made Dongge Grand Secretary; Heshen was made Minister of Revenue.',
    'On xinchou day, Yinglian joined the Grand Secretariat and Heshen became revenue minister.',
  ],
  s0350: [
    'On day bingwu, the Emperor went to the tomb of the Ming founder to offer libations.',
    'On bingwu day, the Emperor offered wine at the Ming founding emperor\'s tomb.',
  ],
  s0351: [
    'Summer, fourth month, new moon on day jiyou: the Emperor crossed the river.',
    'On the fourth-month new moon of jiyou, the Emperor recrossed the Yangzi.',
  ],
  s0352: [
    'On day renzi, Wei Shu of Shouguang, Shandong, was executed for seditious writings in his books.',
    'On renzi day, Shouguang\'s Wei Shu was beheaded for heretical writings.',
  ],
  s0353: [
    'On day dingsi, the Emperor reached Wujiadun, inspected the Gaojiayan dikes, and crossed the river.',
    'On dingsi day, the Emperor inspected Gaojiayan dikes at Wujiadun and crossed the river.',
  ],
  s0354: [
    'Quota land tax levied was remitted by three-tenths for sixteen Shanxi prefectures and departments including Taiyuan and subprefectures including Guihua walled city; Datong, Shuoping, and subordinates including Horinger were wholly remitted.',
    'Shanxi taxes were cut thirty percent in sixteen districts; Datong, Shuoping, and Horinger were fully forgiven.',
  ],
  s0355: [
    'On day xinyou, Yang Kui was transferred to Shaanxi governor; Liu Bingtian acted as Yunnan governor; Yan Xishen was made Guizhou governor; Wu Tan was made Jiangsu governor.',
    'On xinyou day, Yang Kui took Shaanxi, Liu Bingtian acted in Yunnan, Yan Xishen Guizhou, and Wu Tan Jiangsu.',
  ],
  s0356: [
    'On day dingmao, Yang Kui was transferred to Henan governor; Yade to Shaanxi governor; Kaning\'a to Shanxi governor.',
    'On dingmao day, Yang Kui took Henan, Yade Shaanxi, and Kaning\'a Shanxi.',
  ],
  s0357: [
    'Fifth month, day jiashen: the Grand Secretariat and Nine Ministries changed Heshen\'s proposed sentence of imprisonment awaiting execution for Li Shiyao to immediate decapitation, instructing each governor-general and governor to state his view and memorialize a fixed recommendation.',
    'In the fifth month, ministers upgraded Li Shiyao from suspended death to beheading over Heshen\'s draft and ordered governors to report their views.',
  ],
  s0358: [
    'On day dinghai, the Emperor returned to the capital.',
    'On dinghai day, the Emperor returned to Beijing.',
  ],
  s0359: [
    'On day guisi, Wang Ruyang and one hundred fifty-five others were granted jinshi degrees with differences in rank.',
    'On guisi day, Wang Ruyang and 155 others received jinshi with graded ranks.',
  ],
  s0360: [
    'On day dingyou, Sun Shiyi\'s crime was pardoned.',
    'On dingyou day, Sun Shiyi was pardoned.',
  ],
  s0361: [
    'On day jihai, the Emperor went autumn hunting at Mulan.',
    'On jihai day, the Emperor hunted at Mulan.',
  ],
  s0362: [
    'On day yisi, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On yisi day, the Emperor stayed at the Summer Resort.',
  ],
  s0363: [
    'On day jiayin, this year\'s flood quota land tax was remitted for five Hubei prefectures and counties including Mianyang.',
    'On jiayin day, flood taxes were forgiven in five Hubei districts including Mianyang.',
  ],
  s0364: [
    'On day yimao, Grand Secretary Sanbao was summoned into the Grand Secretariat to handle affairs.',
    'On yimao day, Grand Secretary Sanbao entered the Grand Secretariat.',
  ],
  s0365: [
    'Fulehun was transferred to Fujian-Zhejiang governor-general; Shuchang to Huguang governor-general.',
    'Fulehun took Fujian-Zhejiang; Shuchang, Huguang.',
  ],
  s0366: [
    'On day dingmao, Heshen was made inner grandee and chief guard of the Plain White Banner.',
    'On dingmao day, Heshen became Plain White chief guard and inner grandee.',
  ],
  s0367: [
    'On day gengwu, the Guojiadu crossing on the Sui River in Suining, Jiangsu, broke.',
    'On gengwu day, the Guojiadu breach opened on Jiangsu\'s Sui River at Suining.',
  ],
  s0368: [
    'Autumn, seventh month, day dingchou: Sun Shiyi was recalled to serve as compiler in the Hanlin Academy.',
    'In the seventh month, Sun Shiyi was restored as Hanlin compiler.',
  ],
  s0369: [
    'On day dingyou, the Panchen Erdeni came from rear Tibet to audience; the Emperor received him at the Qinghuang Hall, granted a seat, and granted tea.',
    'On dingyou day, the Panchen arrived from Tibet; Hongli received him at Qinghuang Hall with seat and tea.',
  ],
  s0370: [
    'On day wuxu, the Yongding River broke at Liangxiang in Shuntian.',
    'On wuxu day, the Yongding River breached at Liangxiang.',
  ],
  s0371: [
    'On day gengzi, at the Garden of Ten Thousand Trees the Emperor gave a banquet to the Panchen Erdeni, princes, dukes, ministers, Mongol princes, beile, beizi, dukes, imperial sons-in-law, taiji, and others, and granted caps, robes, gold, and coins with differences.',
    'On gengzi day, at Wanshuyuan the court banqueted the Panchen and Mongol nobles and gave graded gifts.',
  ],
  s0372: [
    'On day xinchou, rivers broke at Caoxian in Shandong and Kaocheng in Henan.',
    'On xinchou day, rivers breached at Shandong\'s Caoxian and Henan\'s Kaocheng.',
  ],
  s0373: [
    'On day renyin, Li Ben was made Guizhou governor.',
    'On renyin day, Li Ben became Guizhou governor.',
  ],
  s0374: [
    'Eighth month, day wushen: flood victims in four Henan counties including Ningling were relieved.',
    'On wushen in the eighth month, flood relief went to four Henan counties including Ningling.',
  ],
  s0375: [
    'On day yimao, Grand Secretary Cheng Jingyi died.',
    'On yimao day, Grand Secretary Cheng Jingyi died.',
  ],
  s0376: [
    'On day dingsi, the Yongding River breach was closed.',
    'On dingsi day, the Yongding breach was sealed.',
  ],
  s0377: [
    'Hubei governor Zheng Dajin presented gold vessels as tribute; they were not accepted and he was sternly rebuked.',
    'Zheng Dajin of Hubei offered gold tribute; the court refused and rebuked him sharply.',
  ],
  s0378: [
    'On day jiwei, on the seventieth-birthday longevity festival the Emperor received congratulations at the Hall of Simple Sincerity from princes, dukes, ministers, and Mongol princes, beile, beizi, imperial sons-in-law, and taiji.',
    'On jiwei day, Hongli\'s seventieth birthday was celebrated at Danbojingcheng Hall by princes, officials, and Mongol nobles.',
  ],
  s0379: [
    'On day guiyou, Min E\'yuan was transferred to Jiangsu governor; Nong Qi to Anhui governor.',
    'On guiyou day, Min E\'yuan took Jiangsu and Nong Qi Anhui.',
  ],
  s0380: [
    'On day jiaxu, the Emperor went to the Eastern and Western Tombs; this year\'s quota land tax was remitted by three-tenths for districts passed through.',
    'On jiaxu day, the Emperor visited the tombs and cut transit taxes thirty percent.',
  ],
  s0381: [
    'Flood victims in seven Zhejiang counties including Zhuji were relieved.',
    'Flood relief was given in seven Zhejiang counties including Zhuji.',
  ],
  s0382: [
    'Ninth month: Ji Huang was made Wenyuan Pavilion Grand Secretary; Cai Xin was made Minister of Personnel and Associate Grand Secretary.',
    'In the ninth month, Ji Huang became Wenyuan grand secretary; Cai Xin joined Personnel and the Grand Secretariat.',
  ],
  s0383: [
    'Zhou Huang was transferred to Minister of War; Zhou Yuanli was made Minister of Works.',
    'Zhou Huang took War; Zhou Yuanli, Works.',
  ],
  s0384: [
    'On day renwu, the Emperor visited Zhaoxi, Xiao, Xiaodong, and Jing tombs and went to Empress Xiaoxian\'s tomb to offer libations.',
    'On renwu day, the Emperor paid at several tombs and offered wine at Empress Xiaoxian\'s mound.',
  ],
  s0385: [
    'On day xinmao, the Emperor visited Tai and Taidong tombs.',
    'On xinmao day, the Emperor visited Tai and Taidong tombs.',
  ],
  s0386: [
    'The Guojiadu breach at Suining was closed.',
    'The Suining Guojiadu breach was sealed.',
  ],
  s0387: [
    'On day yiwei, the Emperor returned to the capital.',
    'On yiwei day, the Emperor returned to Beijing.',
  ],
  s0388: [
    'On day yisi, spring flood victims in Jilin\'s Hunchun were relieved.',
    'On yisi day, Hunchun flood victims in Jilin received relief.',
  ],
  s0389: [
    'Winter, tenth month, day wushen: Li Shiyao was sentenced to decapitation with imprisonment awaiting execution.',
    'On wushen in the tenth month, Li Shiyao received the death sentence suspended by imprisonment.',
  ],
  s0390: [
    'Yade was transferred to Henan governor.',
    'Yade became Henan governor.',
  ],
  s0391: [
    'On day xinyou, this year\'s flood quota land tax was remitted for six Henan counties including Yifeng.',
    'On xinyou day, flood taxes were forgiven in six Henan counties including Yifeng.',
  ],
  s0392: [
    'On day renxu, this year\'s flood quota land tax was remitted for sixty-three Zhili prefectures and counties including Bazhou.',
    'On renxu day, flood taxes were forgiven in sixty-three Zhili districts including Bazhou.',
  ],
  s0393: [
    'This year\'s flood-and-drought quota land tax was remitted for eight Jiangsu prefectures, counties, and guards including Qinghe.',
    'Flood and drought taxes were forgiven in eight Jiangsu districts including Qinghe.',
  ],
  s0394: [
    'Quota land tax for the forty-fourth year\'s flood was remitted for thirty-five Gansu subprefectures, departments, and counties including Gaolan.',
    'Forty-fourth-year flood taxes were forgiven in thirty-five Gansu districts including Gaolan.',
  ],
  s0395: [
    'On day jiaxu, Boqing\'e was ordered to act as Left Censor-in-Chief; Heshen still concurrently acted as Minister of Colonial Affairs.',
    'On jiaxu day, Boqing\'e acted as left censor-in-chief and Heshen kept colonial affairs.',
  ],
  s0396: [
    'Eleventh month, day gengchen: Boqing\'e was made imperial commissioner to escort the Panchen Erdeni to the Muru Usu region.',
    'On gengchen in the eleventh month, Boqing\'e escorted the Panchen to Muru Usu as commissioner.',
  ],
  s0397: [
    'On day renwu, Qinggui was made general at Uliastai.',
    'On renwu day, Qinggui became Uliastai general.',
  ],
  s0398: [
    'On day guiwei, the Panchen Erdeni died in the capital.',
    'On guiwei day, the Panchen died in Beijing.',
  ],
  s0399: [
    'Twelfth month, day yimao: famine victims in eighteen Gansu subprefectures, departments, and counties including Gaolan were relieved.',
    'On yimao in the twelfth month, eighteen Gansu districts including Gaolan received famine relief.',
  ],
  s0400: [
    'On day gengshen, because a building of the Joint Four Translation Office collapsed and crushed Koreans to death, the Minister of Rites and others were referred to the boards for stern deliberation.',
    'On gengshen day, the ritual minister and others faced strict review after the Four Translation Office collapse killed Koreans.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b04.mjs <translation.json>'
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
