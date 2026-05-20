#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day yimao, quota land tax was remitted for Xuanhua and two other counties in Zhili on account of hail disaster the previous year.',
    'On yimao day, prior-year hail tax was remitted in two Zhili counties including Xuanhua.',
  ],
  s0602: [
    'On day dingmao, A Gui was appointed an inner grand minister.',
    'On dingmao day, A Gui became an inner grand minister.',
  ],
  s0603: [
    'The Jianwei General at Suiyuan City was retitled General of Suiyuan City.',
    'The Suiyuan City Jianwei General was renamed General of Suiyuan City.',
  ],
  s0604: [
    'On day jisi, the king of Lan Xang, Sumalasa, and the Queen Regent sent envoys congratulating the Empress Dowager on her birthday and the Emperor on his longevity, presenting local products.',
    'On jisi day, Lan Xang sent birthday tribute for the Empress Dowager and Emperor.',
  ],
  s0605: [
    'Summer, fourth month, day gengwu: the Emperor visited the Prince of Zhuang and Grand Secretary Jiang Pu to inquire after their illnesses.',
    'In the fourth summer month, on gengwu day, the Emperor called on the Prince of Zhuang and Jiang Pu.',
  ],
  s0606: [
    'On day xinwei, Zhuang Yougong impeached Brigadier An Tingzhao for tolerating misconduct after earlier recommending him; an edict praised Zhuang.',
    'On xinwei day, Zhuang Yougong was commended for impeaching An Tingzhao.',
  ],
  s0607: [
    'On day jimao, Grand Secretary Jiang Pu died.',
    'On jimao day, Grand Secretary Jiang Pu died.',
  ],
  s0608: [
    'Jing\'eli and Asiha were ordered to take charge at Urumqi and Dasang\'a at Aksu, replacing An Tai, Dingchang, and Nashitong returning to the capital.',
    'Jing\'eli and Asiha went to Urumqi and Aksu; An Tai, Dingchang, and Nashitong returned to Beijing.',
  ],
  s0609: [
    'On day wuzi, graded remissions of quota land tax were granted for twelve prefectures and counties including Changning in Hunan on account of last year\'s drought.',
    'On wuzi day, graded drought tax relief reached twelve Hunan districts including Changning.',
  ],
  s0610: [
    'On day gengyin, the Emperor reviewed troops of the Vanguard Corps.',
    'On gengyin day, the Emperor reviewed Vanguard Corps troops.',
  ],
  s0611: [
    'On day renchen, Li Shiyao was made Minister of Revenue; Su Chang was transferred to Guangdong-Guangxi governor-general; Aibida to Huguang governor-general.',
    'On renchen day, Li Shiyao, Su Chang, and Aibida received high appointments.',
  ],
  s0612: [
    'Wu Dahan was made Yunnan-Guizhou governor-general and Chang Jun Henan governor.',
    'Wu Dahan became Yunnan-Guizhou governor-general; Chang Jun became Henan governor.',
  ],
  s0613: [
    'On day guisi, Liu Zao was ordered to act as Yunnan-Guizhou governor-general.',
    'On guisi day, Liu Zao was ordered to act as Yunnan-Guizhou governor-general.',
  ],
  s0614: [
    'On day jiawu, Wang Jie and 217 others were granted metropolitan graduate degrees with distinctions of rank.',
    'On jiawu day, Wang Jie and 217 others received metropolitan degrees.',
  ],
  s0615: [
    'Fifth month, day dingwei: Liu Tongxun was made Eastern Pavilion Grand Secretary and concurrently supervised the Board of Rites; Liang Shizheng became Minister of Personnel and Associate Grand Secretary; Liu Lun Minister of War; Jin Deying Left Censor-in-Chief.',
    'In the fifth month, Liu Tongxun, Liang Shizheng, Liu Lun, and Jin Deying received major posts.',
  ],
  s0616: [
    'On day wuwu, Dingchang was made Fujian governor with Yang Tingzhang acting for him.',
    'On wuwu day, Dingchang became Fujian governor with Yang Tingzhang acting.',
  ],
  s0617: [
    'Sixth month, day guiwei: relief was given for earthquake disaster in Xinxing and another prefecture in Yunnan.',
    'In the sixth month, earthquake relief reached two Yunnan districts including Xinxing.',
  ],
  s0618: [
    'On day renchen, quota land tax was remitted for collapsed fields in eighteen prefectures, counties, and guards including Jurong in Jiangsu.',
    'On renchen day, collapsed-field tax was remitted in eighteen Jiangsu districts including Jurong.',
  ],
  s0619: [
    'Autumn, seventh month, day xinchou: Associate Grand Secretary E\'ermida died; Zhaohui was ordered to serve as Associate Grand Secretary.',
    'In the seventh month, E\'ermida died and Zhaohui was ordered to replace him.',
  ],
  s0620: [
    'Su Hede was transferred to Minister of Punishments with Zhaohui acting.',
    'Su Hede became Minister of Punishments with Zhaohui acting.',
  ],
  s0621: [
    'A Gui was made Minister of Works with Aligun acting.',
    'A Gui became Minister of Works with Aligun acting.',
  ],
  s0622: [
    'On day guichou, the Emperor set out on the autumn hunt at Mulan.',
    'On guichou day, the Emperor began the autumn hunt at Mulan.',
  ],
  s0623: [
    'Prince Cheng Yunmi was ordered to escort the Empress Dowager.',
    'Prince Cheng Yunmi was ordered to escort the Empress Dowager.',
  ],
  s0624: [
    'On day renxu, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On renxu day, the Emperor halted at the Summer Mountain Resort.',
  ],
  s0625: [
    'Because the Empress Dowager toured Mulan, civil and military officials along the route in Zhili had been negligent and evasive; the ministry was ordered to review them severely.',
    'Zhili route officials were severely reviewed for neglect during the Empress Dowager\'s Mulan tour.',
  ],
  s0626: [
    'On day bingyin, rivers overflowed in Xiangfu and other prefectures and counties in Henan.',
    'On bingyin day, rivers overflowed in Xiangfu and other Henan districts.',
  ],
  s0627: [
    'Eighth month, day dingchou: flood relief was distributed in thirteen prefectures, counties, and guards including Hanchuan in Hubei.',
    'In the eighth month, flood relief reached thirteen Hubei districts including Hanchuan.',
  ],
  s0628: [
    'On day wuyin, Tang Pin was made Hubei governor, Hu Baojun Henan governor, and Chang Jun Jiangxi governor.',
    'On wuyin day, Tang Pin, Hu Baojun, and Chang Jun became provincial governors.',
  ],
  s0629: [
    'On day gengchen, Gao Jin was ordered to Henan to assist on river works.',
    'On gengchen day, Gao Jin was sent to assist Henan river works.',
  ],
  s0630: [
    'On day xinmao, the Emperor, conducting the Empress Dowager, went to Mulan.',
    'On xinmao day, the Emperor accompanied the Empress Dowager to Mulan.',
  ],
  s0631: [
    'On day renchen, Mengke, nephew of the begs of the Chagar and Sarbaghash tribes, and Yamuguerqi were received in audience.',
    'On renchen day, Mengke and Yamuguerqi were received in audience.',
  ],
  s0632: [
    'Ninth month, day dingyou: this year\'s executions after autumn assizes were suspended.',
    'In the ninth month, autumn assize executions were suspended.',
  ],
  s0633: [
    'On day xinchou, Mingrui was ordered to take charge at Ili, replacing A Gui returning to the capital.',
    'On xinchou day, Mingrui went to Ili and A Gui returned to Beijing.',
  ],
  s0634: [
    'On day guimao, twenty Yellow River breaches at Cao county in Shandong and various canal breaches were all closed.',
    'On guimao day, Yellow River and canal breaches in Shandong were all closed.',
  ],
  s0635: [
    'On day bingwu, flood relief was distributed in Wuling and other prefectures and counties in Hunan.',
    'On bingwu day, flood relief reached Hunan districts including Wuling.',
  ],
  s0636: [
    'On day wushen, the Dan and Qin rivers of Huaiqing prefecture in Henan overflowed into the city, drowning more than 1,300 people; disaster victims were relieved.',
    'On wushen day, Henan river floods drowned over 1,300 people; victims were relieved.',
  ],
  s0637: [
    'On day renzi, flood relief was distributed in Mianyang and ten other prefectures, counties, and guards in Hubei.',
    'On renzi day, flood relief reached eleven Hubei districts including Mianyang.',
  ],
  s0638: [
    'On day yimao, Dou Guangnai was referred for severe punishment for clamoring and reviling at the joint sentencing ceremony.',
    'On yimao day, Dou Guangnai was severely punished for disorder at sentencing.',
  ],
  s0639: [
    'On day jiwei, Sucheng was ordered to take charge at Uqturpan, replacing Yongqing returning to the capital.',
    'On jiwei day, Sucheng went to Uqturpan and Yongqing returned to Beijing.',
  ],
  s0640: [
    'Zhalafeng\'a was made Grand Councilor at Uliastai; Yalang\'a was sent to Kobdo, replacing Zhalong\'a and Fulu returning to the capital.',
    'Zhalafeng\'a went to Uliastai and Yalang\'a to Kobdo; Zhalong\'a and Fulu returned to Beijing.',
  ],
  s0641: [
    'On day gengshen, Fu Jing was ordered to take charge in Tibet, replacing Jifu returning to the capital.',
    'On gengshen day, Fu Jing went to Tibet and Jifu returned to Beijing.',
  ],
  s0642: [
    'On day yichou, flood relief was distributed in forty-five Shandong prefectures and counties along the Ji River and fifty-four Henan prefectures and counties including Xiangfu for this year\'s floods.',
    'On yichou day, flood relief reached forty-five Shandong and fifty-four Henan districts.',
  ],
  s0643: [
    'Winter, tenth month, day wuchen: quota land tax was cancelled for water-damaged fields in thirty-two departments, prefectures, and counties including Gaolan in Gansu, and transport-grain levies were remitted in five counties including Shandan.',
    'In the tenth month, Gansu water-damage tax and Shandan transport levies were remitted.',
  ],
  s0644: [
    'On day xinwei, the Emperor, conducting the Empress Dowager, returned to the capital.',
    'On xinwei day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0645: [
    'On day renchen, Qiu Yuexiu was summoned back to the capital.',
    'On renchen day, Qiu Yuexiu was summoned back to Beijing.',
  ],
  s0646: [
    'Flood relief was distributed in Tongshan and other counties in Jiangsu.',
    'Jiangsu flood relief reached Tongshan and other counties.',
  ],
  s0647: [
    'Zhou Renji memorialized on trial sericulture in Renhuai and elsewhere, urging other districts to follow; the Emperor commended it.',
    'Zhou Renji was commended for urging trial sericulture in Renhuai and elsewhere.',
  ],
  s0648: [
    'Eleventh month, first day yimao: flood relief was distributed in sixty-nine Zhili prefectures and counties including Gu\'an for this year\'s floods.',
    'On the eleventh month\'s first day, flood relief reached sixty-nine Zhili districts including Gu\'an.',
  ],
  s0649: [
    'On day dingyou, Yinglian was made Director-General of the Imperial Household Department.',
    'On dingyou day, Yinglian became Director-General of the Imperial Household Department.',
  ],
  s0650: [
    'On day jihai, the Yangqiao breach in Henan was closed.',
    'On jihai day, the Yangqiao breach in Henan was closed.',
  ],
  s0651: [
    'On day xinchou, Songchun was transferred to commandant of Chahar and Shu Ming made General of Suiyuan City.',
    'On xinchou day, Songchun and Shu Ming received frontier commands.',
  ],
  s0652: [
    'On day guimao, surtax silver levied with the grain tax was remitted for thirty-eight Shanxi prefectures and counties including Yangqu and fourteen departments of Datong grain administration for the twenty-fourth year\'s flood.',
    'On guimao day, twenty-fourth-year flood surtax was remitted in fifty-two Shanxi districts.',
  ],
  s0653: [
    'On day dingwei, graded remissions of canal grain and related dues were granted for forty-three Henan prefectures and counties including Xiangfu.',
    'On dingwei day, graded canal-tax relief reached forty-three Henan districts including Xiangfu.',
  ],
  s0654: [
    'On day xinhai, flooded fields were reduced for assessment in twenty-one Jiangsu prefectures, counties, and guards including Shanyang, and quota levies on civilian colonies, school lands, lake flats, and marsh pastures were cancelled.',
    'On xinhai day, Jiangsu flooded fields and colony levies were adjusted.',
  ],
  s0655: [
    'On day guichou, Minister of Rites Wuling\'an was stripped of office for misreading the memorial at court.',
    'On guichou day, Wuling\'an was dismissed for misreading the memorial.',
  ],
  s0656: [
    'On day jiayin, the Emperor, conducting the Empress Dowager, attended her at Cining Palace and added the honorific title "Reverent, Celebratory, Kind, Proclaiming, Healthy, Favorable, Harmonious, Abundant, Pure, Auspicious, Respectful, and Gracious Empress Dowager"; the next day an edict granted general grace with distinctions.',
    'On jiayin day, the Empress Dowager received a new honorific at Cining Palace; general grace followed.',
  ],
  s0657: [
    'Yonggui was made Minister of Rites with Aligun acting.',
    'Yonggui became Minister of Rites with Aligun acting.',
  ],
  s0658: [
    'On day bingchen, the Emperor, conducting the Empress Dowager at Cining Palace, led princes and ministers in congratulations.',
    'On bingchen day, the court congratulated the Empress Dowager at Cining Palace.',
  ],
  s0659: [
    'A linked-verse ode for the Holy Mother\'s seventieth birthday was presented; by the Empress Dowager\'s order further offerings were stopped.',
    'A birthday linked verse was presented, but further offerings were stopped by imperial order.',
  ],
  s0660: [
    'Le\'ersen was made Left Censor-in-Chief.',
    'Le\'ersen became Left Censor-in-Chief.',
  ],
  s0661: [
    'Twelfth month, day dingmao: because Jiangchuan and another prefecture in Yunnan suffered earthquake disaster, double relief was ordered and this year\'s quota tax was remitted.',
    'In the twelfth month, double earthquake relief and tax remission were granted in two Yunnan districts.',
  ],
  s0662: [
    'On day xinwei, quota land tax was remitted for six Jiangsu prefectures and counties including Nanhui for the twenty-third year\'s flood and drought.',
    'On xinwei day, twenty-third-year disaster tax was remitted in six Jiangsu districts including Nanhui.',
  ],
  s0663: [
    'On day jiaxu, flood relief was distributed in thirteen Shanxi prefectures and counties including Wenshui.',
    'On jiaxu day, flood relief reached thirteen Shanxi districts including Wenshui.',
  ],
  s0664: [
    'On day jiashen, flood relief was distributed in two counties and guards including Hanchuan in Hubei.',
    'On jiashen day, flood relief reached two Hubei districts including Hanchuan.',
  ],
  s0665: [
    'Twenty-seventh year, spring, first month, day bingshen: because the Empress Dowager toured Jiangsu and Zhejiang, an edict remitted arrears in Jiangsu, Anhui, and Zhejiang.',
    'In spring of year 27, tax arrears were remitted in Jiangsu, Anhui, and Zhejiang for the southern tour.',
  ],
  s0666: [
    'Relief was given with distinctions to disaster victims in Xiangfu and other Henan prefectures and counties.',
    'Graded relief reached disaster victims in Xiangfu and other Henan districts.',
  ],
  s0667: [
    'On day dingyou, state grain was lent to the Mongol banner of Khorchin Minzhu\'er Dorji.',
    'On dingyou day, state grain was lent to the Khorchin banner.',
  ],
  s0668: [
    'On day bingwu, the Emperor, conducting the Empress Dowager on a southern tour, set out from the capital; thirty percent of this year\'s taxes were remitted along the route in Zhili and Shandong, and fifty percent where disaster had struck the previous year.',
    'On bingwu day, the southern tour began with graded tax remissions along the route.',
  ],
  s0669: [
    'On day wushen, Left Censor-in-Chief Jin Deying died; Dong Bangda replaced him.',
    'On wushen day, Jin Deying died and Dong Bangda replaced him.',
  ],
  s0670: [
    'Flood relief was distributed in twenty-eight Zhili prefectures and counties including Wen\'an for the previous year\'s flood.',
    'Prior-year flood relief reached twenty-eight Zhili districts including Wen\'an.',
  ],
  s0671: [
    'On day jiayin, graded flood relief was given in Cao and Qihe counties in Shandong.',
    'On jiayin day, graded flood relief reached Cao and Qihe in Shandong.',
  ],
  s0672: [
    'Duorji was summoned to the capital and Rongbao was ordered to take charge at Xining.',
    'Duorji was recalled to Beijing and Rongbao was sent to Xining.',
  ],
  s0673: [
    'On day dingsi, General of Suiyuan City Shu Ming died; Yunzhu was transferred to replace him.',
    'On dingsi day, Shu Ming died and Yunzhu replaced him at Suiyuan.',
  ],
  s0674: [
    'On day wuwu, grain-tax arrears were remitted for fifteen Shandong prefectures, counties, and guards including Huimin.',
    'On wuwu day, grain-tax arrears were remitted in fifteen Shandong districts including Huimin.',
  ],
  s0675: [
    'On day jiwei, Zhou Renji was dismissed for stubbornly opening the Nanming River in Henan, wasting farmland and burdening the people.',
    'On jiwei day, Zhou Renji was dismissed for opening the Nanming River against advice.',
  ],
  s0676: [
    'Qiao Guanglie was appointed Guizhou governor.',
    'Qiao Guanglie became Guizhou governor.',
  ],
  s0677: [
    'On day guihai, a survey of the Russian border was ordered.',
    'On guihai day, the Russian border was ordered surveyed.',
  ],
  s0678: [
    'Second month, day jisi: flood relief was distributed in eleven Jiangsu prefectures and counties including Gaoyou and five Anhui prefectures and counties including Taihe.',
    'In the second month, flood relief reached eleven Jiangsu and five Anhui districts.',
  ],
  s0679: [
    'On day gengwu, Yin Jishan was made an imperial chamberlain.',
    'On gengwu day, Yin Jishan became an imperial chamberlain.',
  ],
  s0680: [
    'On day renshen, the Emperor, conducting the Empress Dowager, crossed the river and inspected the eastern dam at Qingkou and the Huiji Lock.',
    'On renshen day, the court inspected Qingkou and the Huiji Lock.',
  ],
  s0681: [
    'Aligun was made an imperial chamberlain and Gao Jin an inner grand minister.',
    'Aligun became an imperial chamberlain and Gao Jin an inner grand minister.',
  ],
  s0682: [
    'On day bingzi, Korea presented tribute.',
    'On bingzi day, Korea sent tribute.',
  ],
  s0683: [
    'On day dingchou, Kazakh envoys including Tsebek were received in audience at the traveling palace and granted robes with distinctions.',
    'On dingchou day, Kazakh envoys were received and granted robes.',
  ],
  s0684: [
    'On day gengchen, the Emperor, conducting the Empress Dowager, crossed the Yangzi and reviewed troops at Jingkou.',
    'On gengchen day, the court crossed the Yangzi and reviewed troops at Jingkou.',
  ],
  s0685: [
    'On day xinsi, the Emperor visited Jiaoshan.',
    'On xinsi day, the Emperor visited Jiaoshan.',
  ],
  s0686: [
    'On day yiyou, the Emperor, conducting the Empress Dowager, visited Suzhou prefecture.',
    'On yiyou day, the court visited Suzhou.',
  ],
  s0687: [
    'On day bingxu, quota land tax was remitted for forty-three Henan prefectures and counties including Xiangfu for last year\'s flood.',
    'On bingxu day, prior-year flood tax was remitted in forty-three Henan districts including Xiangfu.',
  ],
  s0688: [
    'On day wuzi, the Emperor visited the Confucian temple.',
    'On wuzi day, the Emperor visited the Confucian temple.',
  ],
  s0689: [
    'Third month, first day jiawu: the Emperor, conducting the Empress Dowager, visited Hangzhou prefecture.',
    'On the third month\'s first day, the court visited Hangzhou.',
  ],
  s0690: [
    'On day yiwei, the Emperor visited Haining to inspect the seawall.',
    'On yiwei day, the Emperor inspected the Haining seawall.',
  ],
  s0691: [
    'On day dingyou, flood relief was distributed in nine Hubei prefectures, counties, and guards including Qianjiang.',
    'On dingyou day, flood relief reached nine Hubei districts including Qianjiang.',
  ],
  s0692: [
    'On day wuxu, the Emperor reviewed troops.',
    'On wuxu day, the Emperor reviewed troops.',
  ],
  s0693: [
    'On day gengzi, unfinished land-tax, garrison grain, and canal dues in Jiangsu and Zhejiang were remitted, as were salt-field levies in water districts.',
    'On gengzi day, Jiangsu and Zhejiang taxes and salt levies were remitted.',
  ],
  s0694: [
    'On day xinchou, flood relief was given for last year\'s flood in five Shandong prefectures and counties including Qihe.',
    'On xinchou day, prior-year flood relief reached five Shandong districts including Qihe.',
  ],
  s0695: [
    'On day renyin, the Emperor visited the Tide-Watching Tower.',
    'On renyin day, the Emperor visited the Tide-Watching Tower.',
  ],
  s0696: [
    'Two Zhejiang tribute students summoned for examination, Shen Chu and another, were granted provincial graduate rank; together with two metropolitan graduates, Sun Shiyi and another, all four were appointed Secretariat draftsmen.',
    'Shen Chu and three others were appointed Secretariat draftsmen.',
  ],
  s0697: [
    'On day guimao, the Emperor, conducting the Empress Dowager, visited the imperial weaving workshops.',
    'On guimao day, the court visited the imperial weaving workshops.',
  ],
  s0698: [
    'On day bingwu, the court returned from the tour.',
    'On bingwu day, the court returned from the tour.',
  ],
  s0699: [
    'On day dingwei, Qian Chenqun was given the titular rank of Minister of Punishments.',
    'On dingwei day, Qian Chenqun received the Minister of Punishments titular rank.',
  ],
  s0700: [
    'On day jiayin, the Emperor, conducting the Empress Dowager, crossed the river.',
    'On jiayin day, the Emperor accompanied the Empress Dowager across the river.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b07.mjs <translation.json>'
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
