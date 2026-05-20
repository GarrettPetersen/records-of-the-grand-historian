#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day wuyin, the Emperor escorted the Empress Dowager back to the capital.',
    'On wuyin day, the Emperor brought the Empress Dowager back to Beijing.',
  ],
  s0602: [
    'On day gengchen, Tuoyong, Minister of Personnel, retired from office; Guanbao was transferred to Minister of Personnel.',
    'On gengchen day, Tuoyong retired as personnel minister and Guanbao succeeded him.',
  ],
  s0603: [
    'Yinglian was made Minister of Punishments, still concurrently overseeing Households vice-minister affairs.',
    'Yinglian became minister of punishments while still handling household vice-minister duties.',
  ],
  s0604: [
    'Winter, tenth month, day yisi: Prince Shen of the First Rank died.',
    'In the tenth winter month, on yisi day, Prince Shen died.',
  ],
  s0605: [
    'On day jiyou, Chebudengzhabu was stripped of the post of Left Deputy General on Pacifying the Border but kept his princely rank; Hutuling\'a replaced him.',
    'On jiyou day, Chebudengzhabu lost the left deputy border command but kept his prince rank; Hutuling\'a replaced him.',
  ],
  s0606: [
    'Eleventh month, day dingmao: A Gui and others memorialized on the advance against Lesser Jinchuan, capturing Zilishan Ridge and other places and recovering the Wokesh official stockade.',
    'In the eleventh month, A Gui reported capturing Zilishan Ridge and recovering Wokesh in the Lesser Jinchuan campaign.',
  ],
  s0607: [
    'On day wuchen, Fulu was ordered to proceed to Xining on business.',
    'On wuchen day, Fulu was sent to Xining.',
  ],
  s0608: [
    'Wu Mitai was recalled to the capital.',
    'Wu Mitai was recalled to Beijing.',
  ],
  s0609: [
    'On day jisi, A Gui and others memorialized recovery of Meinuo; they were ordered to advance on Jinchuan.',
    'On jisi day, A Gui reported Meinuo recovered and was ordered to press the Jinchuan attack.',
  ],
  s0610: [
    'On day xinwei, Grand Councilor and Grand Secretary Liu Tongxun died; the Emperor went in person to grant funeral offerings and bestowed the posthumous rank of Grand Tutor.',
    'On xinwei day, Liu Tongxun died; the Emperor mourned in person and made him Grand Tutor posthumously.',
  ],
  s0611: [
    'On day renshen, Liang Guozhi was summoned to the capital to serve in the Grand Council.',
    'On renshen day, Liang Guozhi was called to the Grand Council in Beijing.',
  ],
  s0612: [
    'Bayansan was made Hunan governor.',
    'Bayansan became Hunan governor.',
  ],
  s0613: [
    'Bi Yuan was made Shaanxi governor.',
    'Bi Yuan became Shaanxi governor.',
  ],
  s0614: [
    'On day guiyou, Mingliang and others memorialized recovery of Sengezong and other blockhouse stockades.',
    'On guiyou day, Mingliang reported capturing Sengezong and other stockades.',
  ],
  s0615: [
    'Twelfth month, day guisi: Zhangbao was made Yunnan-Guizhou governor-general.',
    'In the twelfth month, Zhangbao became Yunnan-Guizhou governor-general.',
  ],
  s0616: [
    'On day xinchou, Li Shiyao was made Wuying Hall Grand Secretary, still supervising Guangdong-Guangxi governor-general affairs.',
    'On xinchou day, Li Shiyao became Wuying grand secretary while keeping the Guangdong-Guangxi post.',
  ],
  s0617: [
    'That year, Korea and Annam sent tribute.',
    'That year Korea and Annam presented tribute.',
  ],
  s0618: [
    'Thirty-ninth year, spring, first month, day bingzi: Yao Lide was made Hedong canal-route commissioner.',
    'In spring of the thirty-ninth year, Yao Lide became Hedong canal commissioner.',
  ],
  s0619: [
    'On day dingchou, A Gui and others captured Zanbalake and other mountain ridges.',
    'On dingchou day, A Gui took Zanbalake Ridge and others.',
  ],
  s0620: [
    'Second month, first day jiashen, new moon: Feng Sheng\'e and others were ordered to assist A Gui in attacking Lewuwei.',
    'At the second-month new moon, Feng Sheng\'e was ordered to help A Gui attack Lewuwei.',
  ],
  s0621: [
    'On day dinghai, Mingliang and others memorialized capture of Muxi and other mountain ridges.',
    'On dinghai day, Mingliang reported taking Muxi Ridge and others.',
  ],
  s0622: [
    'On day wuxu, Feng Sheng\'e and others captured Moermin Ridge.',
    'On wuxu day, Feng Sheng\'e took Moermin Ridge.',
  ],
  s0623: [
    'On day yisi, graded remissions of quota land tax were granted for the thirty-eighth-year flood disaster in ten Jiangsu prefectures, counties, and guards including Shanyang.',
    'On yisi day, graded flood tax relief reached ten Jiangsu districts including Shanyang.',
  ],
  s0624: [
    'On day dingwei, the Emperor went to the Eastern Tombs and also toured Pan Mountain.',
    'On dingwei day, the court visited the Eastern Tombs and Pan Mountain.',
  ],
  s0625: [
    'On day gengxu, he paid rites at Zhaoxi, Xiaoling, Xiaodongling, and Jingling, and offered wine at Empress Xiaoxian\'s tomb.',
    'On gengxu day, the Emperor visited the imperial tombs and offered wine at Empress Xiaoxian\'s grave.',
  ],
  s0626: [
    'He visited the grave of the late Grand Secretary Fu Heng and granted funeral offerings.',
    'The Emperor mourned at Fu Heng\'s tomb and sent offerings.',
  ],
  s0627: [
    'On day xinhai, the Emperor halted at Pan Mountain.',
    'On xinhai day, the court halted at Pan Mountain.',
  ],
  s0628: [
    'Third month, day gengshen: A Gui and others captured Luobowa Ridge; A Gui was advanced to Grand Guardian of the Heir Apparent; Hailancha was made inner grand minister; Esente was made grand minister without specific rank.',
    'In the third month, A Gui took Luobowa Ridge, became heir-apparent grand guardian, and Hailancha and Esente received high honors.',
  ],
  s0629: [
    'On day jiazi, the Emperor went to the Southern Park for the hunting enclosure.',
    'On jiazi day, the Emperor hunted at the Southern Park.',
  ],
  s0630: [
    'On day xinwei, A Gui and others captured Desidong Stockade.',
    'On xinwei day, A Gui took Desidong Stockade.',
  ],
  s0631: [
    'On day gengchen, Mingliang and others captured Kazapu and other places; the Emperor praised and rewarded them.',
    'On gengchen day, Mingliang captured Kazapu and others and received imperial praise.',
  ],
  s0632: [
    'Summer, fourth month, day yiyou: locusts in Shuntian, Daxing, and other prefectures and counties.',
    'In the fourth summer month, locusts struck Shuntian, Daxing, and nearby counties.',
  ],
  s0633: [
    'On day xinhai, because the capital and nearby home counties were drought-stricken, the Ministry of Punishments was ordered to clear routine prisons and reduce punishments for exile with forced labor and below; Zhili followed likewise.',
    'On xinhai day, drought led to prison review and sentence reductions in the capital and Zhili.',
  ],
  s0634: [
    'On day wuxu, because Censor Li Shufang impeached Fulung\'an\'s household staff for causing trouble, the Emperor praised him and granted a merit review.',
    'On wuxu day, Li Shufang was commended for impeaching Fulung\'an\'s servants.',
  ],
  s0635: [
    'Fifth month, first day guichou, new moon: the Ministry of Punishments was ordered to reduce autumn and palace assize sentences delayed once or twice.',
    'At the fifth-month new moon, delayed assize sentences were ordered reduced.',
  ],
  s0636: [
    'On day bingyin, Zhangbao resigned on account of illness; Tuside took charge as Yunnan-Guizhou governor-general.',
    'On bingyin day, Zhangbao resigned ill and Tuside acted as Yunnan-Guizhou governor-general.',
  ],
  s0637: [
    'On day wuchen, the Emperor, conducting the Empress Dowager, went on the autumn hunt to Mulan.',
    'On wuchen day, the court took the Empress Dowager on the Mulan autumn hunt.',
  ],
  s0638: [
    'On day jiaxu, the Emperor, conducting the Empress Dowager, halted at the Mountain Resort for Summer.',
    'On jiaxu day, the court halted with the Empress Dowager at the summer resort.',
  ],
  s0639: [
    'Sixth month, day guimao: A Gui and others memorialized capture of Mu\'erhuntu blockhouses.',
    'In the sixth month, A Gui reported taking Mu\'erhuntu blockhouses.',
  ],
  s0640: [
    'Autumn, seventh month, day jiayin: A Gui and others captured Sekunpu mountain blockhouses.',
    'In the seventh month, A Gui took Sekunpu mountain blockhouses.',
  ],
  s0641: [
    'On day jiwei, A Gui and others captured Lamulamu mountain and other blockhouses.',
    'On jiwei day, A Gui took Lamulamu and other mountain blockhouses.',
  ],
  s0642: [
    'On day renxu, A Gui and others captured Rizeyakou and other monastery blockhouses.',
    'On renxu day, A Gui took Rizeyakou monastery blockhouses and others.',
  ],
  s0643: [
    'On day yichou, locusts among the Oirat of Urumqi.',
    'On yichou day, locusts struck the Oirat at Urumqi.',
  ],
  s0644: [
    'On day gengwu, Mingliang and others captured Da\'ertu mountain ridge blockhouses.',
    'On gengwu day, Mingliang took Da\'ertu ridge blockhouses.',
  ],
  s0645: [
    'On day jiaxu, because Yu Minzhong had not memorialized on the eunuch Gao Yuncong\'s request regarding official business, the ministry was ordered to deliberate severely.',
    'On jiaxu day, Yu Minzhong was referred for severe review for concealing Gao Yuncong\'s request.',
  ],
  s0646: [
    'Asiha was made Left Censor-in-Chief.',
    'Asiha became Left Censor-in-Chief.',
  ],
  s0647: [
    'On day yihai, Asiha was ordered to serve in the Grand Council.',
    'On yihai day, Asiha entered the Grand Council.',
  ],
  s0648: [
    'The eunuch Gao Yuncong was executed.',
    'Gao Yuncong was executed.',
  ],
  s0649: [
    'On day xinsi, A Gui and others captured Geluwajue and other blockhouse stockades.',
    'On xinsi day, A Gui took Geluwajue stockades and others.',
  ],
  s0650: [
    'Eighth month, first day renwu, new moon: solar eclipse.',
    'At the eighth-month new moon on renwu there was a solar eclipse.',
  ],
  s0651: [
    'On day renchen, Fude and others captured Mudanggar, Yangquan, and other blockhouses.',
    'On renchen day, Fude took Mudanggar, Yangquan, and other blockhouses.',
  ],
  s0652: [
    'On day dingyou, the Emperor went on the Mulan hunt.',
    'On dingyou day, the Emperor hunted at Mulan.',
  ],
  s0653: [
    'On day guimao, Jinchuan chieftain Zhuowosijia submitted and presented the corpse of the rebel leader Senggesang.',
    'On guimao day, Zhuowosijia surrendered and sent Senggesang\'s corpse.',
  ],
  s0654: [
    'Ninth month, day yimao: in Shouzhang county, Shandong, the traitor Wang Lun and others plotted rebellion; Shandong governor Xu Ji was ordered to suppress and capture them.',
    'In the ninth month, Wang Lun plotted rebellion in Shouzhang and Xu Ji was ordered to suppress him.',
  ],
  s0655: [
    'On day dingsi, Grand Secretary Shuhede was ordered to proceed to Jiangnan with Gao Jin to block the breach.',
    'On dingsi day, Shuhede was sent to Jiangnan with Gao Jin to close the breach.',
  ],
  s0656: [
    'On day wuwu, the Emperor returned to halt at the Mountain Resort.',
    'On wuwu day, the Emperor returned to the summer resort.',
  ],
  s0657: [
    'Shuhede was ordered first to proceed to Shandong to suppress and capture Wang Lun.',
    'Shuhede was told to go first to Shandong against Wang Lun.',
  ],
  s0658: [
    'On day gengshen, Imperial Son-in-law Lawangdorji, Left Censor-in-Chief Asiha, bodyguards and secretaries, and troops of the Vanguard and Firearms Corps were ordered to proceed to Shandong to join in suppressing Wang Lun.',
    'On gengshen day, Lawangdorji, Asiha, and Vanguard and Firearms troops were sent to join the hunt for Wang Lun.',
  ],
  s0659: [
    'On day xinyou, Wang Lun besieged Linqing and encamped at Zha Pass.',
    'On xinyou day, Wang Lun besieged Linqing and held Zha Pass.',
  ],
  s0660: [
    'On day renxu, the Emperor escorted the Empress Dowager on her return journey.',
    'On renxu day, the Emperor escorted the Empress Dowager homeward.',
  ],
  s0661: [
    'On day guihai, because seven counties of Tianjin prefecture were drought-stricken, 100,000 shi of grain from Tongcang was ordered disbursed for relief.',
    'On guihai day, drought in seven Tianjin counties brought 100,000 shi of Tongcang grain for relief.',
  ],
  s0662: [
    'On day bingyin, the Emperor returned from the Mountain Resort.',
    'On bingyin day, the Emperor returned from the summer resort.',
  ],
  s0663: [
    'On day dingmao, Shandong Yanzhou garrison commander Weiyi and Dezou city garrison commandant Getuken were executed for retreating in battle.',
    'On dingmao day, Weiyi and Getuken were executed for fleeing in battle.',
  ],
  s0664: [
    'On day gengwu, because four Jiangsu counties including Shanyang suffered flood disaster, next year\'s quota tax was remitted.',
    'On gengwu day, next year\'s tax was remitted in four flooded Jiangsu counties including Shanyang.',
  ],
  s0665: [
    'On day renshen, the Emperor escorted the Empress Dowager back to Beijing.',
    'On renshen day, the court brought the Empress Dowager back to Beijing.',
  ],
  s0666: [
    'On day bingzi, the Linqing rebels in Shandong were pacified; Wang Lun burned himself to death.',
    'On bingzi day, Linqing rebels were crushed and Wang Lun burned himself.',
  ],
  s0667: [
    'Winter, tenth month, first day xinsi, new moon: Yang Jingsu was made Shandong governor.',
    'At the tenth-month new moon, Yang Jingsu became Shandong governor.',
  ],
  s0668: [
    'On day renchen, this year\'s outstanding quota tax for Linqing New City was remitted, and five-tenths of outstanding tax for the Old City.',
    'On renchen day, Linqing New City tax was waived and half the Old City arrears remitted.',
  ],
  s0669: [
    'On day bingwu, Xu Ji was made Henan governor.',
    'On bingwu day, Xu Ji became Henan governor.',
  ],
  s0670: [
    'Eleventh month, day guichou: Mingliang and others captured Ripang and other blockhouse stockades.',
    'In the eleventh month, Mingliang took Ripang stockades and others.',
  ],
  s0671: [
    'On day jiayin, Shuhede was made Imperial Front Grand Minister.',
    'On jiayin day, Shuhede became an imperial front grand minister.',
  ],
  s0672: [
    'A Gui and others captured Rierbadangga blockhouse stockades.',
    'A Gui took Rierbadangga stockades.',
  ],
  s0673: [
    'A Gui was made Imperial Front Grand Minister and Hailancha an Imperial Front guardsman.',
    'A Gui became an imperial front grand minister and Hailancha an imperial front guard.',
  ],
  s0674: [
    'On day bingchen, because one hundred forty Sichuan prefectures, departments, and counties including Chengdu transported army grain, prior years\' quota tax was remitted in varying degrees.',
    'On bingchen day, graded tax relief was granted to 140 Sichuan districts supplying the army.',
  ],
  s0675: [
    'On day wuchen, A Gui captured Geluguyakou and other blockhouse stockades.',
    'On wuchen day, A Gui took Geluguyakou stockades and others.',
  ],
  s0676: [
    'That year, Korea and Ryukyu sent tribute.',
    'That year Korea and Ryukyu presented tribute.',
  ],
  s0677: [
    'Fortieth year, spring, first month, day jiaxu: A Gui and others captured Kang\'ersa Ridge.',
    'In spring of the fortieth year, A Gui took Kang\'ersa Ridge.',
  ],
  s0678: [
    'Second month, day jimao: A Gui and others captured Jia\'erna and other blockhouse stockades.',
    'In the second month, A Gui took Jia\'erna stockades and others.',
  ],
  s0679: [
    'On day bingxu, A Gui captured Simosi blockhouse stockade.',
    'On bingxu day, A Gui took Simosi stockade.',
  ],
  s0680: [
    'On day guisi, Li Han was made Yunnan governor.',
    'On guisi day, Li Han became Yunnan governor.',
  ],
  s0681: [
    'Third month, day xinhai: the Emperor visited Pan Mountain.',
    'In the third month, the Emperor visited Pan Mountain.',
  ],
  s0682: [
    'On day jiayin, the Emperor halted at Pan Mountain.',
    'On jiayin day, the court halted at Pan Mountain.',
  ],
  s0683: [
    'Quota land tax for thirty-ninth-year flood and drought disaster in nineteen Jiangnan prefectures and counties including Jurong, and Huai\'an and Dahe guards, was remitted.',
    'Flood and drought tax was remitted in nineteen Jiangnan districts and two guards including Jurong.',
  ],
  s0684: [
    'On day renshen, prior-year drought quota tax was remitted for six Changlu districts including Cangzhou and six saltern fields including Yanzhen, and five Henan prefectures and counties including Xinyang.',
    'On renshen day, drought tax was remitted in Changlu, saltern, and Henan districts including Cangzhou and Xinyang.',
  ],
  s0685: [
    'Summer, fourth month, first day wuyin, new moon: thirty-ninth-year drought quota tax was remitted in fourteen Anhui prefectures and counties including Hefei and four guards including Luzhou.',
    'At the fourth-month new moon, drought tax was remitted in fourteen Anhui counties and four guards including Hefei.',
  ],
  s0686: [
    'On day bingxu, Sichuan army commissioner, lead palace guards grand minister, Prince of the First Rank, and Imperial Son-in-law Sebten Balzhur died in camp.',
    'On bingxu day, Prince and commissioner Sebten Balzhur died in the Sichuan camp.',
  ],
  s0687: [
    'On day jichou, Mingshan was ordered to proceed as Uliastai commissioner.',
    'On jichou day, Mingshan was sent as Uliastai commissioner.',
  ],
  s0688: [
    'On day renyin, one hundred fifty-eight metropolitan graduates including Wu Xilin were granted jinshi degrees and origin ranks with distinctions.',
    'On renyin day, Wu Xilin and 157 others received jinshi degrees with graded ranks.',
  ],
  s0689: [
    'On day guimao, A Gui and others captured Musigongyakou and other city blockhouses.',
    'On guimao day, A Gui took Musigongyakou city blockhouses and others.',
  ],
  s0690: [
    'Mingliang and others captured Jiasuo and Yixi.',
    'Mingliang took Jiasuo and Yixi.',
  ],
  s0691: [
    'On day yisi, Mingliang and others captured Da\'ertu and other blockhouse stockades.',
    'On yisi day, Mingliang took Da\'ertu stockades and others.',
  ],
  s0692: [
    'Mingliang and Fu Kang\'an were made inner grand ministers.',
    'Mingliang and Fu Kang\'an became inner grand ministers.',
  ],
  s0693: [
    'Fifth month, day jiyou: thirty-ninth-year drought quota tax was remitted in thirty-nine Zhili prefectures and counties including Bazhou and Baoding.',
    'In the fifth month, drought tax was remitted in thirty-nine Zhili districts including Bazhou.',
  ],
  s0694: [
    'On day jiayin, A Gui and others memorialized capture of Bamutong and other blockhouses.',
    'On jiayin day, A Gui reported taking Bamutong blockhouses and others.',
  ],
  s0695: [
    'On day dingsi, Mingliang memorialized capture of Ru Stockade, Jiasuo, and other blockhouses.',
    'On dingsi day, Mingliang reported taking Ru Stockade, Jiasuo, and others.',
  ],
  s0696: [
    'On day wuchen, A Gui and others memorialized capture of Ga\'erdan and other blockhouse stockades.',
    'On wuchen day, A Gui reported taking Ga\'erdan stockades and others.',
  ],
  s0697: [
    'On day renshen, the Emperor went to Mulan; the Empress Dowager halted at the Tangshan Traveling Palace.',
    'On renshen day, the Emperor hunted at Mulan while the Empress Dowager stayed at Tangshan.',
  ],
  s0698: [
    'Mingliang and others memorialized capture of Basheshi and other blockhouse stockades.',
    'Mingliang reported taking Basheshi stockades and others.',
  ],
  s0699: [
    'On day yihai, A Gui and others memorialized capture of Xunke\'erzong and other blockhouse stockades.',
    'On yihai day, A Gui reported taking Xunke\'erzong stockades and others.',
  ],
  s0700: [
    'Feng Sheng\'e, Pacification Deputy General on the Right of the Border and Duke of Guoyi, was advanced to Duke of Guoyi, Successor in Valor.',
    'Feng Sheng\'e, border deputy general and Duke of Guoyi, was raised to Duke of Guoyi, Successor in Valor.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b07.mjs <translation.json>'
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
