#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Aibida was ordered Canal Governor-General; Liu Tongxun acted in the post.',
    'Aibida became canal commissioner; Liu Tongxun acted.',
  ],
  s0102: [
    'He Nian was transferred to Shandong governor; Yin Jishan was appointed Liangjiang governor-general and concurrently charged with canal affairs.',
    'He Nian took Shandong; Yin Jishan became Liangjiang governor-general with canals.',
  ],
  s0103: [
    'On day guiyou, Manfu was made Barkul garrison commander.',
    'On guiyou day, Manfu became Barkul commander.',
  ],
  s0104: [
    'On day bingzi, Zhaohui reported the rebellion of Khoja Jihan in the Muslim west and dispatched Amin Dao and others to advance.',
    'On bingzi day, Zhaohui reported Khoja Jihan\'s revolt and sent Amin Dao forward.',
  ],
  s0105: [
    'On day wuyin, the Khalkha taiji Bayar rebelled and raided Hong Huo\'erbai and Zhahaqin; Ningxia general Heqi was ordered to suppress him.',
    'On wuyin day, taiji Bayar raided the frontier; General Heqi of Ningxia was told to attack.',
  ],
  s0106: [
    'On day jimao, relief was given for this year\'s flood and hail in eight Zhili prefectures, counties, and guards including Yanqing.',
    'On jimao day, eight Zhili districts including Yanqing received flood and hail relief.',
  ],
  s0107: [
    'On day yiyou, retired Grand Secretary Fu Min died.',
    'On yiyou day, retired Grand Secretary Fu Min died.',
  ],
  s0108: [
    'Eleventh month, day dingwei: relief was given for flood and hail in twenty-six Gansu prefectures, departments, and counties including Gaolan.',
    'In the eleventh month, on dingwei day, twenty-six Gansu districts including Gaolan were relieved.',
  ],
  s0109: [
    'On day xinhai, Chen Hongmou was transferred to Shaanxi governor; Tulebing\'a to Hunan governor.',
    'On xinhai day, Chen Hongmou took Shaanxi and Tulebing\'a Hunan.',
  ],
  s0110: [
    'On day jiayin, the order to continue arresting and questioning Celeng and Yubao was renewed.',
    'On jiayin day, Celeng and Yubao were again to be seized and tried.',
  ],
  s0111: [
    'Zhala Feng\'a was demoted from duke rank.',
    'Zhala Feng\'a was reduced from duke.',
  ],
  s0112: [
    'Daledang\'a was made Dingxi general, Zhaohui Right Deputy General for Pacifying the Frontier, and Yonggui campaign commissioner.',
    'Daledang\'a became Dingxi general; Zhaohui western deputy commander; Yonggui commissioner.',
  ],
  s0113: [
    'On day gengshen, Kazakh Sira Bama and the Muslim Manggalik led forces to attack General Heqi at Pizhan.',
    'On gengshen day, Sira Bama and Manggalik assaulted Heqi at Pizhan.',
  ],
  s0114: [
    'Heqi fought fiercely and died; he was ordered mourned with posthumous honors like Fu Qing and Labudun.',
    'Heqi died in battle; obsequies were granted on Fu Qing and Labudun\'s precedent.',
  ],
  s0115: [
    'On day jiwei, Huang Tinggui memorialized that thirty thousand horses had been prepared and troops increased at Hami and elsewhere.',
    'On jiwei day, Huang Tinggui reported thirty thousand horses ready and reinforcements at Hami.',
  ],
  s0116: [
    'The Emperor praised his clear decisiveness and willingness to shoulder responsibility.',
    'Hongli praised his bold, responsible planning.',
  ],
  s0117: [
    'Huang Tinggui was rewarded with a double-eyed peacock feather and a hereditary Commandant of Cavalry post.',
    'Huang Tinggui received double peacock feathers and a hereditary commandantcy.',
  ],
  s0118: [
    'On day renxu, Wang Anguo was excused on grounds of illness.',
    'On renxu day, Wang Anguo left office ill.',
  ],
  s0119: [
    'Wang Youdun was ordered acting Minister of Personnel; Zhao Hong\'en acting Minister of Works; He Guozong acting Left Censor-in-Chief.',
    'Wang Youdun acted at Personnel; Zhao Hong\'en at Works; He Guozong at the censorate.',
  ],
  s0120: [
    'Twelfth month, new moon on day jiazi: Celeng and Yubao, being escorted to the capital, were killed en route by Eleuths.',
    'On the twelfth-month new moon, Celeng and Yubao were slain by Eleuths while under escort to Beijing.',
  ],
  s0121: [
    'On day gengwu, relief was given for flood in Shanxi counties including Fenyang.',
    'On gengwu day, Fenyang and other Shanxi flood counties were relieved.',
  ],
  s0122: [
    'On day xinwei, an edict added the title Fushu Anzhong Lama to the Jebtsundampa Khutuktu.',
    'On xinwei day, the Jebtsundampa received the added title Fushu Anzhong Lama.',
  ],
  s0123: [
    'On day renshen, Lu Chao was made Hubei governor.',
    'On renshen day, Lu Chao became Hubei governor.',
  ],
  s0124: [
    'Relief was given for flood in twenty-one Shandong prefectures, counties, and guards including Jinxiang.',
    'Twenty-one Shandong districts including Jinxiang received flood relief.',
  ],
  s0125: [
    'On day jiaxu, half of this year\'s quota taxes on civilian colonies and stud farms was remitted for flood in four Shaanxi counties including Zhouzhi.',
    'On jiaxu day, four Shaanxi flood counties lost half their colony and stud-farm taxes.',
  ],
  s0126: [
    'On day wuyin, Qinggunjab was captured at Hangga Jianggas; Chengun Zhabu was granted the yellow belt; one son was enfeoffed as heir; Namuzhale was made a first-class baron.',
    'On wuyin day, Qinggunjab was taken; Chengun Zhabu got the yellow belt; Namuzhale became a first-class baron.',
  ],
  s0127: [
    'On day jimao, Hutuling\'a and others were summoned to the capital.',
    'On jimao day, Hutuling\'a and others were recalled to Beijing.',
  ],
  s0128: [
    'For capturing Qinggunjab, Prince Chemuchuk Zhabu was advanced to junwang rank; Prince Wangbu Dorji and others were granted double-eyed peacock feathers.',
    'Chemuchuk Zhabu was raised to junwang and Wangbu Dorji received double peacock feathers for taking Qinggunjab.',
  ],
  s0129: [
    'On day bingxu, Daledang\'a was relieved of his concurrent Grand Council post; Erimida replaced him.',
    'On bingxu day, Daledang\'a left the Grand Council and Erimida took his seat.',
  ],
  s0130: [
    'Twenty-second year, spring, first month, day jiawu: because of the southern tour, accumulated arrears were remitted in Jiangsu, Anhui, and Zhejiang.',
    'In the twenty-second year\'s first month, on jiawu day, Jiangsu, Anhui, and Zhejiang arrears were forgiven for the southern tour.',
  ],
  s0131: [
    'Chengun Zhabu was made Pacification General on the Frontier and ordered to advance from Barkul in suppression; Chebudeng Zhab acted as Northern Route Left Deputy General; Shuhede, Fude, and Eshi were campaign commissioners; Sebten Balzhur, Argun, Mingrui, and others were lead officers.',
    'Chengun Zhabu became frontier pacification general from Barkul; Chebudeng Zhab, Shuhede, Fude, and Eshi took command posts; Sebten, Argun, and Mingrui led columns.',
  ],
  s0132: [
    'On day yiwei, relief was given for flood in nineteen Jiangsu prefectures and counties including Qinghe.',
    'On yiwei day, nineteen Jiangsu flood districts including Qinghe were relieved.',
  ],
  s0133: [
    'On day wuxu, Song Chun was made Jingzhou general.',
    'On wuxu day, Song Chun became Jingzhou general.',
  ],
  s0134: [
    'Manggu Lai was made campaign commissioner and sent to the Northern Route army camp.',
    'Manggu Lai became commissioner on the northern front.',
  ],
  s0135: [
    'On day jihai, Hadaha was made campaign commissioner and stationed at Kobdo.',
    'On jihai day, Hadaha became commissioner at Kobdo.',
  ],
  s0136: [
    'On day gengzi, Haning\'a and Yonggui were made campaign commissioners.',
    'On gengzi day, Haning\'a and Yonggui became commissioners.',
  ],
  s0137: [
    'On day guimao, the Emperor, escorting the Empress Dowager, set out on the southern tour.',
    'On guimao day, Hongli and the Empress Dowager began the southern tour.',
  ],
  s0138: [
    'On day jiachen, Wang Youdun was appointed Minister of Personnel; He Guozong was transferred to Minister of Rites; Qin Huitian to Minister of Works; Zhao Hong\'en returned to Left Vice Censor-in-Chief; Bai Zhongshan to Jiangnan Canal Governor-General; Zhang Shizai to Hedong Canal Governor-General; Yang Xifu to Grain Transport Governor-General; and Aibida was appointed Jiangsu governor.',
    'On jiachen day, Wang Youdun, He Guozong, Qin Huitian, Zhao Hong\'en, Bai Zhongshan, Zhang Shizai, Yang Xifu, and Aibida received new posts.',
  ],
  s0139: [
    'On day bingwu, arrears were remitted in three Zhili prefectures and counties including Jinghai.',
    'On bingwu day, three Zhili districts including Jinghai lost arrears.',
  ],
  s0140: [
    'On day dingwei, thirty percent of this year\'s grain taxes along the route in Zhili and Shandong were remitted, and fifty percent in disaster areas.',
    'On dingwei day, route taxes in Zhili and Shandong were cut thirty percent, fifty in disaster counties.',
  ],
  s0141: [
    'On day renzi, relief was given for flood in five Shandong prefectures, counties, and guards including Jining.',
    'On renzi day, five Shandong districts including Jining received flood relief.',
  ],
  s0142: [
    'On day guichou, Asiha was made Northern Route campaign commissioner.',
    'On guichou day, Asiha became northern commissioner.',
  ],
  s0143: [
    'On day jiwei, Ji Huang was made Jiangnan deputy canal director.',
    'On jiwei day, Ji Huang became Jiangnan deputy canal director.',
  ],
  s0144: [
    'Agui was ordered to remain at Uliyasutai on business.',
    'Agui stayed at Uliyasutai on assignment.',
  ],
  s0145: [
    'On day renxu, Galdan Dorji, Dashizhuling, and others rebelled.',
    'On renxu day, Galdan Dorji and Dashizhuling rebelled.',
  ],
  s0146: [
    'Second month, new moon on day guihai: thirty percent of this year\'s grain taxes along the Jiangsu and Zhejiang route were remitted, and fifty percent in disaster areas.',
    'On the second-month new moon, Jiangsu and Zhejiang route taxes were cut thirty percent, fifty in disaster areas.',
  ],
  s0147: [
    'On day jiazi, disaster victims were relieved in fourteen Jiangsu prefectures, counties, and guards including Qinghe and in four Anhui prefectures, counties, and guards including Suzhou.',
    'On jiazi day, flood victims in Jiangsu and Anhui received relief.',
  ],
  s0148: [
    'On day bingyin, Zhaohui\'s entire force reached Urumqi; he was enfeoffed as a first-class baron with hereditary succession.',
    'On bingyin day, Zhaohui reached Urumqi and received a hereditary first-class baronage.',
  ],
  s0149: [
    'On day dingmao, the Emperor, escorting the Empress Dowager, crossed the river to Tianfei Lock and inspected the timber pilings.',
    'On dingmao day, Hongli and the Empress Dowager crossed to Tianfei Lock to inspect river pilings.',
  ],
  s0150: [
    'Jiangnan grain-transport arrears before Qianlong 10 were remitted.',
    'Pre-Qianlong-10 Jiangnan transport arrears were forgiven.',
  ],
  s0151: [
    'Unpaid conversion silver owed by Liang-Huai salt producers from Qianlong 17 through 19 was remitted.',
    'Liang-Huai salt producers\' Qianlong 17–19 conversion arrears were cancelled.',
  ],
  s0152: [
    'On day yihai, the Emperor, escorting the Empress Dowager, crossed the river.',
    'On yihai day, Hongli and the Empress Dowager crossed the river.',
  ],
  s0153: [
    'On day guiwei, the court visited the Gaoyi Garden of the Song minister Fan Zhongyan.',
    'On guiwei day, the court visited Fan Zhongyan\'s Gaoyi Garden.',
  ],
  s0154: [
    'On day jiashen, the Emperor, escorting the Empress Dowager, arrived at Suzhou prefecture.',
    'On jiashen day, Hongli and the Empress Dowager reached Suzhou.',
  ],
  s0155: [
    'On day yiyou, the Emperor, escorting the Empress Dowager, inspected the weaving workshops.',
    'On yiyou day, Hongli and the Empress Dowager inspected Suzhou weaving shops.',
  ],
  s0156: [
    'Fusen was transferred to Minister of Personnel; Namuzhale to Minister of Works.',
    'Fusen became Personnel minister; Namuzhale Works minister.',
  ],
  s0157: [
    'Argun was demoted to vice minister; Zhaohui was made Minister of Revenue and inner-court guard grand minister; Shuhede Minister of War.',
    'Argun was demoted; Zhaohui took Revenue and inner guard rank; Shuhede War.',
  ],
  s0158: [
    'Chengun Zhabu and Zhaohui were ordered to pursue Eleuth rebels on separate routes.',
    'Chengun Zhabu and Zhaohui were to hunt Eleuth rebels by separate columns.',
  ],
  s0159: [
    'On day bingxu, the Emperor reviewed troops at the rear drill ground of Jiaxing prefecture.',
    'On bingxu day, Hongli reviewed troops at Jiaxing.',
  ],
  s0160: [
    'On day dinghai, the Emperor reviewed troops at Shimen garrison.',
    'On dinghai day, Hongli reviewed troops at Shimen.',
  ],
  s0161: [
    'On day jichou, the Emperor, escorting the Empress Dowager, arrived at Hangzhou prefecture.',
    'On jichou day, Hongli and the Empress Dowager reached Hangzhou.',
  ],
  s0162: [
    'On day gengyin, the Emperor reviewed troops.',
    'On gengyin day, Hongli reviewed troops.',
  ],
  s0163: [
    'On day xinmao, commoners\' arrears were remitted in three Shandong prefectures and counties including Qihe, in two Shanxi counties including Fenyang, and quota taxes were remitted for flood in twelve Jiangsu prefectures and counties including Qinghe.',
    'On xinmao day, arrears and flood taxes were forgiven in Shandong, Shanxi, and Jiangsu districts.',
  ],
  s0164: [
    'Third month, day dingyou: Galdan Dorji seized Yili; Chengun Zhabu was ordered to suppress him.',
    'In the third month, on dingyou day, Galdan Dorji took Yili and Chengun Zhabu was sent against him.',
  ],
  s0165: [
    'On day gengzi, the Emperor, escorting the Empress Dowager, halted at Suzhou prefecture.',
    'On gengzi day, Hongli and the Empress Dowager stopped at Suzhou.',
  ],
  s0166: [
    'On day jiyou, the Emperor, escorting the Empress Dowager, arrived at Jiangning prefecture.',
    'On jiyou day, Hongli and the Empress Dowager reached Jiangning.',
  ],
  s0167: [
    'This year\'s quota taxes were remitted for the suburban counties of Nanjing and Suzhou in Jiangsu and Hangzhou in Zhejiang.',
    'Suburban Nanjing, Suzhou, and Hangzhou lost this year\'s quota tax.',
  ],
  s0168: [
    'On day gengxu, the Emperor performed rites at the tomb of Ming Taizu.',
    'On gengxu day, Hongli worshipped at Ming Taizu\'s tomb.',
  ],
  s0169: [
    'The Khalkha taiji Chebudeng Dorji rebelled; Hadaha captured him.',
    'Taiji Chebudeng Dorji rebelled and was taken by Hadaha.',
  ],
  s0170: [
    'An order was issued to execute all adult males and distribute the women as rewards to the Khalkhas.',
    'All rebel men were to be killed; women were given to the Khalkhas.',
  ],
  s0171: [
    'On day xinhai, Hadaha was made Minister of War.',
    'On xinhai day, Hadaha became War minister.',
  ],
  s0172: [
    'On day guichou, the Emperor, escorting the Empress Dowager, crossed the river.',
    'On guichou day, Hongli and the Empress Dowager crossed the river.',
  ],
  s0173: [
    'On day jiayin, former Grand Secretary Shi Yizhi was summoned to the Grand Council; Huang Tinggui remained Grand Secretary and concurrently Shaanxi-Gansu governor-general.',
    'On jiayin day, Shi Yizhi rejoined the council; Huang Tinggui kept grand secretary and Shaan-Gan duties.',
  ],
  s0174: [
    'On day bingchen, last year\'s quota taxes were remitted for flood and hail in Shaanxi prefectures, departments, and counties including Tongguan.',
    'On bingchen day, Shaanxi flood and hail counties including Tongguan were tax-exempt.',
  ],
  s0175: [
    'Liu Tongxun was summoned to the traveling court.',
    'Liu Tongxun was called to the imperial procession.',
  ],
  s0176: [
    'On day jiwei, the Emperor, escorting the Empress Dowager, crossed the river.',
    'On jiwei day, Hongli and the Empress Dowager crossed the river.',
  ],
  s0177: [
    'Summer, fourth month, new moon on day renxu: Zhili governor-general Fang Guancheng impeached inspector Zhang Ruoying for improperly punishing an inner-palace eunuch monk.',
    'On the fourth-month new moon, Fang Guancheng impeached Zhang Ruoying for chastising an eunuch monk.',
  ],
  s0178: [
    'The Emperor rebuked this as lacking broad view, yet also edicted that eunuchs who caused trouble outside might be punished by others.',
    'Hongli called the impeachment narrow-minded but allowed outsiders to punish meddlesome eunuchs.',
  ],
  s0179: [
    'On day yichou, land quota taxes were remitted in three Jiangsu prefectures and departments including Huai\'an.',
    'On yichou day, three Huai districts lost land quota tax.',
  ],
  s0180: [
    'Liu Tongxun was ordered to supervise Xuzhou stone works; Vice Minister Meng Lin the works below Liutang; deputy canal director Ji Huang the Zhaoguan rolling-dam branch river—all jointly with governors, governor-generals, and the canal commissioner.',
    'Liu Tongxun, Meng Lin, and Ji Huang were assigned river repairs with provincial and canal chiefs.',
  ],
  s0181: [
    'Chengun Zhabu, Zhaohui, and Shuhede were summoned to the capital; Yarhashan was made campaign commissioner holding the western deputy general\'s seal; Argun was ordered to remain at Barkul on business.',
    'Chengun Zhabu, Zhaohui, and Shuhede were recalled; Yarhashan took the western seal; Argun stayed at Barkul.',
  ],
  s0182: [
    'On day bingyin, the Emperor reached Sunjiaji to inspect dike works.',
    'On bingyin day, Hongli inspected dikes at Sunjiaji.',
  ],
  s0183: [
    'Tang Kalu captured Chebudeng Dorji; Pulupu\'s tribesmen were distributed as rewards to the Uriankhai.',
    'Tang Kalu took Chebudeng Dorji; Pulupu\'s people were given to the Uriankhai.',
  ],
  s0184: [
    'On day dingmao, the Emperor crossed the river and inspected works at Jingshan Bridge and Hanzhuang Lock.',
    'On dingmao day, Hongli crossed the river and inspected Jingshan Bridge and Hanzhuang Lock.',
  ],
  s0185: [
    'On day wuchen, quota taxes were remitted for hail and flood in year 21 in Zhili prefectures, counties, and guards including Yanqing.',
    'On wuchen day, Zhili year-21 hail and flood taxes were forgiven.',
  ],
  s0186: [
    'On day wuwu, the grain quota for five villages under Haifeng county including Lijing was reduced, and arrears from years 11 through 20 were remitted.',
    'On wuwu day, Haifeng village quotas were cut and eleven-to-twenty arrears forgiven.',
  ],
  s0187: [
    'Song\'ari was made Suiyuan garrison general.',
    'Song\'ari became Suiyuan commander.',
  ],
  s0188: [
    'Pulupu was captured.',
    'Pulupu was taken.',
  ],
  s0189: [
    'On day xinwei, the Emperor performed the sacrifice to Confucius at Qufu.',
    'On xinwei day, Hongli sacrificed to Confucius at Qufu.',
  ],
  s0190: [
    'The Emperor, escorting the Empress Dowager, halted at Lingyan.',
    'Hongli and the Empress Dowager stopped at Lingyan.',
  ],
  s0191: [
    'Shi Yizhi was ordered to remain Wenyuan Hall Grand Secretary and concurrently Minister of Personnel.',
    'Shi Yizhi kept Wenyuan grand secretary rank and Personnel as well.',
  ],
  s0192: [
    'On day yihai, Song\'ari was transferred to Liangzhou general; Baode to Suiyuan garrison general.',
    'On yihai day, Song\'ari went to Liangzhou and Baode to Suiyuan.',
  ],
  s0193: [
    'On day wuyin, arrears were remitted in five Shandong prefectures and counties including Jining.',
    'On wuyin day, five Shandong districts including Jining lost arrears.',
  ],
  s0194: [
    'On day jimao, Jiang Bing was transferred to Henan governor; Asiha to Hunan governor.',
    'On jimao day, Jiang Bing took Henan and Asiha Hunan.',
  ],
  s0195: [
    'On day gengchen, arrears were remitted in four Henan counties including Xiayi.',
    'On gengchen day, four Henan counties including Xiayi lost arrears.',
  ],
  s0196: [
    'On day xinsi, because the Xiayi licentiate Duan Changxu had hidden a forged placard of Wu Sangui, Fang Guancheng was ordered to Henan to join Tulebing\'a in a rigorous trial.',
    'On xinsi day, Duan Changxu\'s hoard of a Wu Sangui forgery sent Fang Guancheng to Henan with Tulebing\'a for strict trial.',
  ],
  s0197: [
    'On day yiyou, He Guozong was dismissed.',
    'On yiyou day, He Guozong lost office.',
  ],
  s0198: [
    'On day dinghai, the Emperor returned to the capital.',
    'On dinghai day, Hongli returned to Beijing.',
  ],
  s0199: [
    'Qin Huitian was ordered acting Minister of Rites.',
    'Qin Huitian acted at Rites.',
  ],
  s0200: [
    'On day wuzi, because former provincial treasurer Peng Jiaping had hoarded unofficial histories of the late Ming, he was stripped of office and arrested for interrogation.',
    'On wuzi day, ex-treasurer Peng Jiaping was dismissed and jailed for hoarding late-Ming unofficial histories.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b02.mjs <translation.json>'
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
