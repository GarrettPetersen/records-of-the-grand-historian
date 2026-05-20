#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day dingmao, Agui was ordered to join Chen Huizu, Fu Heng, and Li Zhiying in inspecting the sea dikes.',
    'On dingmao day, Agui, Chen Huizu, Fu Heng, and Li Zhiying were sent to inspect the sea dikes.',
  ],
  s0402: [
    'Forty-sixth year, spring, first month, day jimao: hereditary noble ranks were fixed for Khalkha Mongols, Qinghai Dorbod, Torghut, and Khoshut, and for Muslim-area princes, dukes, jasaq, and taiji.',
    'In spring of year 46, jimao, hereditary ranks were set for frontier Mongol and Muslim nobles.',
  ],
  s0403: [
    'On day bingshen, Korean King Yi Suan memorialized thanks for gifted silks and still sent tribute goods; a warm edict accepted them.',
    'On bingshen day, King Yi Suan of Korea thanked the court for silks, sent tribute, and was warmly told to accept.',
  ],
  s0404: [
    'On day guimao, Fu Heng and Li Zhiying were summoned to the capital.',
    'On guimao day, Fu Heng and Li Zhiying were recalled to Beijing.',
  ],
  s0405: [
    'Chen Huizu was made Fujian-Zhejiang governor-general, concurrently directing Zhejiang governor affairs and supervising dike works.',
    'Chen Huizu became Fujian-Zhejiang governor-general, took Zhejiang, and oversaw the dikes.',
  ],
  s0406: [
    'Li Fenghan was transferred to Jiangnan Canal director-general and Han Hong to Hedong Canal director-general.',
    'Li Fenghan took Jiangnan canal command and Han Hong Hedong canal command.',
  ],
  s0407: [
    'Second month, day bingchen: quota tax was remitted for Zhuji, Zhejiang, for flood damage.',
    'In the second month, bingchen, Zhuji lost flood quota tax.',
  ],
  s0408: [
    'On day guihai, Agui was ordered to inspect river works in Jiangnan and Henan.',
    'On guihai day, Agui was sent to inspect Jiangnan and Henan rivers.',
  ],
  s0409: [
    'On day yichou, the Emperor toured west to Wutai Mountain and remitted three-tenths of this year\'s quota tax in passed areas.',
    'On yichou day, the Emperor went to Wutai Mountain and cut three-tenths of quota tax along the route.',
  ],
  s0410: [
    'On day bingyin, arrears tax was remitted for seven prefectures and counties in Shuntian and Baoding.',
    'On bingyin day, Shuntian and Baoding forgave tax arrears in seven districts.',
  ],
  s0411: [
    'On day jisi, Yade was transferred to Shanxi governor.',
    'On jisi day, Yade became Shanxi governor.',
  ],
  s0412: [
    'On day gengwu, Fu Heng was made Henan governor.',
    'On gengwu day, Fu Heng became Henan governor.',
  ],
  s0413: [
    'Wang Sui was sentenced to strangulation.',
    'Wang Sui was sentenced to strangulation.',
  ],
  s0414: [
    'Third month, new moon on day jiaxu: the Emperor visited Zhengding prefecture to review troops.',
    'On the third-month new moon, jiaxu, the Emperor reviewed troops at Zhengding.',
  ],
  s0415: [
    'On day yihai, quota tax was remitted in differing amounts for flood damage in nine Bozhou-area counties of Anhui and three guards including Fengyang.',
    'On yihai day, Anhui and Fengyang-area flood taxes were forgiven in graded amounts.',
  ],
  s0416: [
    'On day bingzi, quota tax was remitted in differing amounts for flood damage in eight Jiangsu prefectures, counties, and guards including Qinghe.',
    'On bingzi day, eight Jiangsu districts including Qinghe lost graded flood quota tax.',
  ],
  s0417: [
    'On day wuyin, Qing Gui was summoned to the capital and Batu acted as Uliastai general.',
    'On wuyin day, Qing Gui was recalled and Batu acted at Uliastai.',
  ],
  s0418: [
    'On day xinsi, the Emperor halted at Wutai Mountain.',
    'On xinsi day, the court halted at Wutai Mountain.',
  ],
  s0419: [
    'On day jichou, quota tax was remitted in differing amounts for hail damage in fifteen Gansu prefectures and counties including Gaolan.',
    'On jichou day, fifteen Gansu districts including Gaolan lost graded hail quota tax.',
  ],
  s0420: [
    'On day jiawu, imperial clansman Songchun was made Suiyuan City general.',
    'On jiawu day, Songchun became Suiyuan City general.',
  ],
  s0421: [
    'On day gengzi, the Emperor returned to the capital.',
    'On gengzi day, the Emperor returned to Beijing.',
  ],
  s0422: [
    'On day renyin, Salar Muslim rebels led by Su Forty-three and others at Xunhua subprefecture, Gansu, rose and seized Hezhou; Xi\'an provincial military commander Ma Biao was ordered to join Le\'erjin in suppressing them.',
    'On renyin day, Su Forty-three\'s Salar rebels seized Hezhou and Ma Biao joined Le\'erjin to suppress them.',
  ],
  s0423: [
    'On day guimao, Muslim rebels attacked Lanzhou; Agui was ordered to Gansu to direct anti-rebel operations.',
    'On guimao day, rebels hit Lanzhou and Agui was sent to direct Gansu operations.',
  ],
  s0424: [
    'Summer, fourth month, new moon on day jiashen: Minister Heshen, imperial son-in-law Lawangduo\'erji, chief bodyguard minister Hailancha, and Brave Guards were ordered to Gansu to suppress rebels.',
    'On the fourth-month new moon, jiashen, Heshen, Lawangduo\'erji, Hailancha, and Brave Guards were sent to Gansu.',
  ],
  s0425: [
    'On day yisi, Anhui governor Nong Qi was ordered to Gansu for military supply; Li Shiyao\'s crimes were pardoned and he was granted third-rank hat insignia to go to Gansu.',
    'On yisi day, Nong Qi went to Gansu for supplies and Li Shiyao was pardoned with third-rank insignia.',
  ],
  s0426: [
    'On day jiyou, Gansu government troops recovered Hezhou and Renhe advanced to relieve the provincial capital.',
    'On jiyou day, Hezhou was recovered and Renhe advanced to relieve Lanzhou.',
  ],
  s0427: [
    'On day gengshen, retired Court of Appeals president Yin Jiaquan, for vainly asking his father\'s enshrinement in the Confucian temple and for seditious writings, was sentenced to strangulation.',
    'On gengshen day, Yin Jiaquan was sentenced to strangulation for temple enshrinement pleas and seditious books.',
  ],
  s0428: [
    'Quota tax was remitted for flood damage in fifty Zhili prefectures and counties including Bazhou.',
    'Flood quota tax was forgiven in fifty Zhili districts including Bazhou.',
  ],
  s0429: [
    'On day wuchen, Qian Qi and one hundred sixty-nine others received jinshi degrees and postings in differing grades.',
    'On wuchen day, Qian Qi and 169 others received jinshi ranks in graded postings.',
  ],
  s0430: [
    'On day gengwu, Le\'erjin was arrested; Li Shiyao was ordered to manage Shaanxi-Gansu governor-general affairs; before he arrived, Agui acted concurrently.',
    'On gengwu day, Le\'erjin was arrested; Li Shiyao was named to Shaanxi-Gansu and Agui acted until he came.',
  ],
  s0431: [
    'Heshen was recalled to the capital.',
    'Heshen was recalled to Beijing.',
  ],
  s0432: [
    'On day xinwei, quota tax was remitted for flood damage in twelve Anhui prefectures, counties, and guards including Shouzhou and five Henan counties including Yifeng.',
    'On xinwei day, flood quota tax was forgiven in twelve Anhui districts and five Henan counties including Yifeng.',
  ],
  s0433: [
    'Fifth month, day xinmao: Agui and others were instructed to eliminate the Muslim New Teaching sect.',
    'In the fifth month, xinmao, Agui was told to eliminate the Muslim New Teaching.',
  ],
  s0434: [
    'Intercalary fifth month, new moon on day guimao: Le\'erjin was sentenced to decapitation.',
    'On the intercalary fifth-month new moon, guimao, Le\'erjin was sentenced to decapitation.',
  ],
  s0435: [
    'On day jiyou, arrears tax was remitted for seven Jiangsu counties and guards including Funing.',
    'On jiyou day, Funing and six other Jiangsu districts lost tax arrears.',
  ],
  s0436: [
    'On day gengxu, the Emperor went to Mulan for the autumn battue.',
    'On gengxu day, the Emperor went to Mulan for the autumn hunt.',
  ],
  s0437: [
    'On day bingchen, the Emperor halted at the Mountain Resort.',
    'On bingchen day, the court halted at the Summer Resort.',
  ],
  s0438: [
    'Sixth month, day gengchen: the Yellow River breached at Weijiazhuang, Suining, Jiangsu.',
    'In the sixth month, gengchen, the Yellow River broke at Weijiazhuang in Suining.',
  ],
  s0439: [
    'On day jichou, because of years of fraudulent relief in Gansu, the Ministry of Punishments was ordered to interrogate Le\'erjin strictly and Wang Danwang was brought to the capital.',
    'On jichou day, Gansu relief fraud led to strict interrogation of Le\'erjin and Wang Danwang\'s arrest.',
  ],
  s0440: [
    'On day renchen, granary grain debts were remitted for twelve Shaanxi prefectures and departments including Xi\'an.',
    'On renchen day, twelve Shaanxi districts including Xi\'an lost granary grain debts.',
  ],
  s0441: [
    'On day guisi, Gansu Muslim rebels Su Forty-three and others were executed.',
    'On guisi day, Su Forty-three and other Gansu rebels were executed.',
  ],
  s0442: [
    'Autumn, seventh month, new moon on day renyin: sea overflow inundated Chongming, Taicang, and other Jiangsu prefectures and counties.',
    'On the seventh-month new moon, renyin, sea floods hit Chongming, Taicang, and other Jiangsu districts.',
  ],
  s0443: [
    'Gansu provincial treasurer Wang Tingzan was stripped of office and arrested for fraudulent relief and inflated expenditures.',
    'Wang Tingzan lost his Gansu treasurer post for relief fraud and inflated spending.',
  ],
  s0444: [
    'On day bingwu, Kuilin was made Uliastai general and Mingliang Urumqi military governor.',
    'On bingwu day, Kuilin became Uliastai general and Mingliang Urumqi governor.',
  ],
  s0445: [
    'On day jiyou, the Yellow River breached at Wanjin Tan in Henan and Qujialou at Yifeng.',
    'On jiyou day, the river broke at Wanjin Tan and Qujialou in Henan.',
  ],
  s0446: [
    'On day gengshen, Siam\'s leader Zheng Zhao sent envoys bearing memorial and tribute.',
    'On gengshen day, Zheng Zhao of Siam sent tribute envoys.',
  ],
  s0447: [
    'On day xinyou, Agui was ordered to inspect river works in Henan and Shandong.',
    'On xinyou day, Agui was sent to inspect Henan and Shandong rivers.',
  ],
  s0448: [
    'On day yichou, Prince Zhao Weng of Lan Xang presented tribute goods.',
    'On yichou day, Zhao Weng of Lan Xang presented tribute.',
  ],
  s0449: [
    'On day gengwu, Wang Danwang was beheaded; Le\'erjin was granted suicide; Wang Tingzan was sentenced to strangulation.',
    'On gengwu day, Wang Danwang was beheaded, Le\'erjin granted suicide, and Wang Tingzan sentenced to strangulation.',
  ],
  s0450: [
    'This year\'s quota tax was remitted for Chongming County, Jiangsu.',
    'Chongming County lost this year\'s quota tax.',
  ],
  s0451: [
    'Relief was given for floods in nine Jiangsu prefectures and counties including Chongming and Yifeng County in Henan.',
    'Floods in nine Jiangsu districts and Yifeng, Henan, received relief.',
  ],
  s0452: [
    'Eighth month, day jiaxu: relief was given for floods in four Gansu counties including Longxi.',
    'In the eighth month, jiaxu, four Gansu counties including Longxi received flood relief.',
  ],
  s0453: [
    'Half the levied quota was remitted for seven counties including Jinxian.',
    'Seven counties including Jinxian lost half their levied quota.',
  ],
  s0454: [
    'On day jimao, Yuan Shoutong and others, for an inaccurate grain-inspection inquiry, were referred to the ministries for strict deliberation.',
    'On jimao day, Yuan Shoutong and others faced strict ministry review for a false grain inquiry.',
  ],
  s0455: [
    'On day renwu, Fukang\'an was transferred to Sichuan governor-general; Fu Gang was made Yunnan-Guizhou governor-general; Yang Kui acted as Fujian governor.',
    'On renwu day, Fukang\'an took Sichuan, Fu Gang Yunnan-Guizhou, and Yang Kui acted in Fujian.',
  ],
  s0456: [
    'On day yiyou, relief was given for floods in four Hubei prefectures and counties including Qianjiang.',
    'On yiyou day, four Hubei districts including Qianjiang received flood relief.',
  ],
  s0457: [
    'On day bingxu, the Emperor went to Mulan for the hunt encampment.',
    'On bingxu day, the Emperor went to Mulan for the hunt.',
  ],
  s0458: [
    'The Weijiazhuang breach was closed.',
    'The Weijiazhuang breach was closed.',
  ],
  s0459: [
    'Ninth month, day wushen: Wang Tingzan was executed by strangulation.',
    'In the ninth month, wushen, Wang Tingzan was executed by strangulation.',
  ],
  s0460: [
    'On day dingmao, relief was given for floods in Jinxiang, Shandong.',
    'On dingmao day, Jinxiang, Shandong, received flood relief.',
  ],
  s0461: [
    'Winter, tenth month, day bingzi: relief was given for floods in Tongshan and other Jiangsu counties.',
    'In the tenth month, bingzi, Tongshan and other Jiangsu counties received flood relief.',
  ],
  s0462: [
    'On day dingchou, relief was given for floods in twenty-nine Shandong counties including Zouping, three guards including Jining, and three saltern areas including Yongfu.',
    'On dingchou day, floods in twenty-nine Shandong counties, three guards, and three salterns received relief.',
  ],
  s0463: [
    'On day yiyou, relief was given for floods in four Zhili prefectures and counties including Cangzhou and four saltern areas including Yanzhen.',
    'On yiyou day, Cangzhou and three other Zhili districts and four salterns received flood relief.',
  ],
  s0464: [
    'On day wuzi, relief was given for floods in thirteen Henan counties including Xiangfu.',
    'On wuzi day, thirteen Henan counties including Xiangfu received flood relief.',
  ],
  s0465: [
    'On day gengyin, relief was given for flood and drought in seventeen Hubei prefectures and counties including Jiangxia.',
    'On gengyin day, seventeen Hubei districts including Jiangxia received flood and drought relief.',
  ],
  s0466: [
    'On day guisi, relief was given for flood and drought in twenty-four Anhui prefectures, counties, and guards including Lingbi.',
    'On guisi day, twenty-four Anhui districts including Lingbi received flood and drought relief.',
  ],
  s0467: [
    'On day dingyou, citing censor Liu Tiancheng\'s memorial, the Emperor instructed: "The method of equalizing land would surely leave the poor not yet rich while the rich became poor first.',
    'On dingyou day, citing Liu Tiancheng, the Emperor said equalizing land would impoverish the rich before enriching the poor.',
  ],
  s0468: [
    'We ruler and ministers should only esteem frugality and plain living, know shame and fear, and let the four classes model themselves on this alone.',
    'He said ruler and ministers should practice frugality and shame so the four classes would follow.',
  ],
  s0469: [
    '" Tribute fur from Shaanxi was abolished.',
    'Shaanxi fur tribute was abolished.',
  ],
  s0470: [
    'Eleventh month, day gengzi: Minister of Works Zhou Yuanli retired on leave and Luo Yuanhan replaced him.',
    'In the eleventh month, gengzi, Zhou Yuanli retired and Luo Yuanhan replaced him at Works.',
  ],
  s0471: [
    'Liu Yong was made Left Censor-in-chief while still temporarily directing Hunan governor affairs.',
    'Liu Yong became Left Censor-in-chief while still acting Hunan governor.',
  ],
  s0472: [
    'On day bingwu, Li Shijie was made Hunan governor.',
    'On bingwu day, Li Shijie became Hunan governor.',
  ],
  s0473: [
    'On day wuchen, Zheng Dajin was made Zhili governor-general.',
    'On wuchen day, Zheng Dajin became Zhili governor-general.',
  ],
  s0474: [
    'Twelfth month, new moon on day jisi: Yao Cheng Lie was transferred to Hubei governor.',
    'On the twelfth-month new moon, jisi, Yao Cheng Lie became Hubei governor.',
  ],
  s0475: [
    'Zhu Chun was made Guangxi governor.',
    'Zhu Chun became Guangxi governor.',
  ],
  s0476: [
    'On day dingchou, Yade was made Guangdong governor and Tan Shangzhong Shanxi governor.',
    'On dingchou day, Yade took Guangdong and Tan Shangzhong Shanxi.',
  ],
  s0477: [
    'On day wuzi, grand secretaries deliberated and rejected Ji Huang\'s request to restore the old Yellow River course; the Emperor approved.',
    'On wuzi day, the court rejected Ji Huang\'s plan to restore the old Yellow River course and the Emperor agreed.',
  ],
  s0478: [
    'On day gengyin, Bi Yuan, impeached by censor Qian Feng, was demoted to third-rank hat insignia but kept in office.',
    'On gengyin day, Qian Feng\'s impeachment demoted Bi Yuan to third-rank insignia but left him in post.',
  ],
  s0479: [
    'On day xinmao, Nong Qi was transferred to Shanxi governor and Tan Shangzhong to Anhui governor.',
    'On xinmao day, Nong Qi took Shanxi and Tan Shangzhong Anhui.',
  ],
  s0480: [
    'Forty-seventh year, spring, first month, day gengzi: Chen Huizu and Min E\'yuan were demoted to third-rank hat insignia but kept in office.',
    'In spring of year 47, gengzi, Chen Huizu and Min E\'yuan were demoted to third-rank insignia but kept their posts.',
  ],
  s0481: [
    'On day yimao, the Wensu Pavilion was built at Mukden.',
    'On yimao day, Mukden\'s Wensu Pavilion was built.',
  ],
  s0482: [
    'On day bingyin, the Complete Library in Four Treasuries was finished.',
    'On bingyin day, the Complete Library in Four Treasuries was finished.',
  ],
  s0483: [
    'Second month, day jisi: the Emperor attended at the Wenyuan Pavilion and granted a banquet to the chief compilers of the Complete Library in Four Treasuries with rewards in differing grades.',
    'In the second month, jisi, the Emperor banqueted the Four Treasuries compilers at Wenyuan with graded rewards.',
  ],
  s0484: [
    'On day dinghai, Qianqing Gate guard Amida was ordered to offer sacrifice to the river god.',
    'On dinghai day, guard Amida was sent to sacrifice to the river god.',
  ],
  s0485: [
    'Third month, day gengzi: the Emperor visited Pan Mountain.',
    'In the third month, gengzi, the Emperor visited Pan Mountain.',
  ],
  s0486: [
    'On day renyin, the Emperor halted at Pan Mountain.',
    'On renyin day, the court halted at Pan Mountain.',
  ],
  s0487: [
    'On day guichou, Yade was transferred to Fujian governor and Shang\'an made Guangdong governor.',
    'On guichou day, Yade took Fujian and Shang\'an Guangdong.',
  ],
  s0488: [
    'On day jiayin, the Emperor returned to the capital.',
    'On jiayin day, the Emperor returned to Beijing.',
  ],
  s0489: [
    'On day yimao, accumulated Gansu tax arrears of two million four hundred fifty thousand piculs of grain and over three hundred thousand taels of silver were remitted.',
    'On yimao day, Gansu lost 2.45 million piculs and over 300,000 taels in accumulated arrears.',
  ],
  s0490: [
    'On day wuwu, quota tax was remitted for flood damage in twenty-eight Jiangsu prefectures, counties, and guards including Changshu.',
    'On wuwu day, twenty-eight Jiangsu districts including Changshu lost flood quota tax.',
  ],
  s0491: [
    'On day guihai, quota tax was remitted for flood damage in thirty-nine Zhili prefectures and counties including Tianjin.',
    'On guihai day, thirty-nine Zhili districts including Tianjin lost flood quota tax.',
  ],
  s0492: [
    'Summer, fourth month, day wuchen: Heshen, Liu Yong, and censor Qian Feng were ordered to investigate Shandong fiscal deficits.',
    'In the fourth month, wuchen, Heshen, Liu Yong, and Qian Feng were sent to investigate Shandong deficits.',
  ],
  s0493: [
    'On day wuyin, quota tax was remitted for flood damage in five Shandong counties including Shouguang.',
    'On wuyin day, five Shandong counties including Shouguang lost flood quota tax.',
  ],
  s0494: [
    'On day jimao, Shandong governor Guotai was stripped of office and arrested; Ming Xing replaced him.',
    'On jimao day, Guotai was arrested as Shandong governor and Ming Xing replaced him.',
  ],
  s0495: [
    'On day xinsi, the Emperor reviewed Firearms Battalion troops.',
    'On xinsi day, the Emperor reviewed Firearms Battalion troops.',
  ],
  s0496: [
    'On day jiashen, quota tax was remitted for flood damage in Yongji County, Shanxi.',
    'On jiashen day, Yongji County, Shanxi, lost flood quota tax.',
  ],
  s0497: [
    'On day dinghai, the Emperor reviewed Vanguard Camp troops.',
    'On dinghai day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0498: [
    'On day renchen, Associate Grand Secretary and Minister of Personnel Cai Xin asked leave and was permitted.',
    'On renchen day, Cai Xin asked leave as associate grand secretary and personnel minister and was allowed.',
  ],
  s0499: [
    'Liu Yong acted as Minister of Personnel.',
    'Liu Yong acted as Minister of Personnel.',
  ],
  s0500: [
    'On day jiawu, Luo Yuanhan was dismissed; Liu Yong was made Minister of Works, Wang Jie Left Censor-in-chief of the Censorate, and Qing Gui Shengjing general.',
    'On jiawu day, Luo Yuanhan was dismissed; Liu Yong took Works, Wang Jie the Censorate, and Qing Gui Shengjing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b05.mjs <translation.json>'
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
