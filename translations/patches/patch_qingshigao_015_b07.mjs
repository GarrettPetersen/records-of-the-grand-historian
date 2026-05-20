#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On jiachen day, Guo Shixun was dismissed owing to illness; Zhu Gui was transferred to be Guangdong governor and Chen Yongfu Anhui governor.',
    'On jiachen day, Guo Shixun left office for illness; Zhu Gui took Guangdong and Chen Yongfu, Anhui.',
  ],
  s0602: [
    'On bingwu day, because eighty-three prefectures and counties including Baoding in Zhili suffered drought, one month\'s grain ration was ordered given as bounty.',
    'On bingwu day, drought in eighty-three Zhili districts including Baoding brought a one-month grain bounty.',
  ],
  s0603: [
    'Transit taxes on beans, wheat, and similar goods carried by Fengtian merchants through Zhili and Shandong passes were reduced.',
    'Bean and wheat tolls for Fengtian merchants through Zhili and Shandong were cut.',
  ],
  s0604: [
    'On xinhai day, the Emperor went to the Mountain Resort for Summer Retreat; land tax and grain levies on the route were remitted by varying amounts.',
    'On xinhai day, the Emperor visited the Summer Resort with graduated tax relief on the route.',
  ],
  s0605: [
    'Sixth month, new moon on day bingchen: because fifty-one prefectures and counties including Licheng and Shanzhuang in Shandong suffered drought, poor people were given one month\'s grain ration, and land tax on flood-scoured fields in Linqing prefecture, Shandong, was remitted.',
    'In the sixth month on the new moon, fifty-one drought-struck Shandong districts got a month\'s grain; Linqing flood fields were tax-exempt.',
  ],
  s0606: [
    'On dingsi day, the Emperor halted at the Mountain Resort for Summer Retreat.',
    'On dingsi day, the Emperor stayed at the Summer Resort.',
  ],
  s0607: [
    'On gengwu day, boundary obos were established on the borders with Badakhshan, Bhutan, Zomithang, Luomintang, and Nepal on the southwest outer frontiers of Tangut.',
    'On gengwu day, border obos were set with Badakhshan, Bhutan, Zomithang, Luomintang, and Nepal southwest of Tangut.',
  ],
  s0608: [
    'Autumn, seventh month, day wuzi: the Yongding River breached.',
    'In the seventh autumn month, the Yongding River broke.',
  ],
  s0609: [
    'On gengyin day, the Dan and Qin rivers in Henan breached.',
    'On gengyin day, the Dan and Qin rivers broke in Henan.',
  ],
  s0610: [
    'On xinmao day, flood disaster in places including Pingding in Shanxi was relieved.',
    'On xinmao day, flood relief reached Pingding and other Shanxi districts.',
  ],
  s0611: [
    'On jihai day, flood disaster in prefectures and counties including Linqing in Shandong was relieved.',
    'On jihai day, Shandong flood relief reached Linqing and nearby districts.',
  ],
  s0612: [
    'On xinchou day, flood disaster in places including Tianjin in Zhili was relieved.',
    'On xinchou day, flood relief reached Tianjin and other Zhili districts.',
  ],
  s0613: [
    'On guimao day, the river breached at Qujiazhuang in Fengbei subprefecture, Henan.',
    'On guimao day, the river broke at Qujiazhuang in Henan\'s Fengbei office.',
  ],
  s0614: [
    'On jiachen day, Shulin was stripped of office for shielding Salt Controller Baning\'a\'s collusion with merchants; Fugang was transferred to be governor-general of the Two Jiangs, with Suling\'a ordered to act.',
    'On jiachen day, Shulin fell for shielding Baning\'a\'s merchant ties; Fugang became Two Jiangs governor-general under Suling\'a.',
  ],
  s0615: [
    'Fukang\'an was transferred to be Yunnan-Guizhou governor-general.',
    'Fukang\'an became Yunnan-Guizhou governor-general.',
  ],
  s0616: [
    'Helin was made Sichuan governor-general, with Sun Shiyi to act.',
    'Helin took Sichuan; Sun Shiyi acted for him.',
  ],
  s0617: [
    'Songyun, commissioner in Tibet, was made Minister of Works.',
    'Tibet commissioner Songyun became works minister.',
  ],
  s0618: [
    'On yisi day, Feng Guangxiong was ordered to act as Yunnan-Guizhou governor-general.',
    'On yisi day, Feng Guangxiong acted as Yunnan-Guizhou governor-general.',
  ],
  s0619: [
    'Grand Secretary Ji Huang died; Sun Shiyi was summoned to serve in the Grand Council.',
    'Ji Huang died; Sun Shiyi entered the Grand Council.',
  ],
  s0620: [
    'On guichou day, the Mulan enclosure hunt for this year and next was suspended.',
    'On guichou day, Mulan hunts this year and next were called off.',
  ],
  s0621: [
    'Quota tax on flood-stricken fields was remitted for Zhili prefectures and subordinates including Baoding, Henan prefectures and subordinates including Weihui, five prefectures and counties in Shandong including Linqing, and three prefectures and counties in Shanxi including Daizhou.',
    'Flood land tax was forgiven in Baoding-area Zhili, Weihui-area Henan, five Shandong districts including Linqing, and three Shanxi districts including Daizhou.',
  ],
  s0622: [
    'Eighth month, day dingsi: because flood disaster in Tianjin and Hejian prefectures in Zhili was severe, deferred quota tax from the disaster was remitted.',
    'In the eighth month, on dingsi day, severe Zhili floods at Tianjin and Hejian brought remission of deferred disaster tax.',
  ],
  s0623: [
    'On wuwu day, the southern-work breach on the Yongding River was closed.',
    'On wuwu day, the Yongding River\'s southern breach closed.',
  ],
  s0624: [
    'On jisi day, because the sixtieth year of the Emperor\'s reign would arrive next year, grain tribute transport throughout the provinces was once universally remitted.',
    'On jisi day, with the sixtieth regnal year approaching, all provinces\' grain tribute was forgiven once.',
  ],
  s0625: [
    'On jiaxu day, the Emperor returned from the halt.',
    'On jiaxu day, the Emperor returned.',
  ],
  s0626: [
    'Funing was transferred to be Henan governor; Mu Helian was made Shandong governor, with Jiang Lan to act.',
    'Funing took Henan; Mu Helian took Shandong under Jiang Lan.',
  ],
  s0627: [
    'Fukang\'an memorialized that in Daning, Sichuan, sect rebel Xie Tianxiu and others propagated heterodox teachings, spreading into Shaanxi, Hubei, and Henan; strict capture and punishment were ordered.',
    'Fukang\'an reported Daning sect teachers spreading into Shaanxi, Hubei, and Henan; capture was ordered.',
  ],
  s0628: [
    'On dingchou day, accumulated tax arrears were remitted for twenty-three prefectures and counties in Zhili including Tongzhou.',
    'On dingchou day, back taxes were forgiven in twenty-three Zhili districts including Tongzhou.',
  ],
  s0629: [
    'On jiashen day, Bi Yuan was demoted to Shandong governor and fined five years\' salary supplement as former Huguang governor-general.',
    'On jiashen day, Bi Yuan was demoted to Shandong and fined five years of Huguang salary supplement.',
  ],
  s0630: [
    'Funing was made Huguang governor-general; Mu Helian remained Henan governor.',
    'Funing became Huguang governor-general; Mu Helian stayed in Henan.',
  ],
  s0631: [
    'Ninth month, day jichou: flood disaster in prefectures and counties including Mianyang in Hubei was relieved.',
    'In the ninth month, on jichou day, flood relief reached Mianyang and other Hubei districts.',
  ],
  s0632: [
    'On bingshen day, Xiulin was made Jilin general.',
    'On bingshen day, Xiulin became Jilin general.',
  ],
  s0633: [
    'On jihai day, flood disaster in Zhangzhou and Quanzhou prefectures in Fujian was relieved.',
    'On jihai day, flood relief reached Fujian\'s Zhang and Quan prefectures.',
  ],
  s0634: [
    'Rent on banner lands of the Imperial Household Department in Zunhua, Zhili, was reduced.',
    'Zunhua Imperial Household banner land rent was cut.',
  ],
  s0635: [
    'Funing was ordered to station at Xiangyang to supervise pursuit of heterodox-sect case criminals.',
    'Funing was posted to Xiangyang to pursue sect-case offenders.',
  ],
  s0636: [
    'On xinchou day, for collating the Stone Classics, Peng Yuanrui was given the additional title of Junior Mentor of the Heir Apparent.',
    'On xinchou day, Peng Yuanrui received Junior Mentor rank for Stone Classics work.',
  ],
  s0637: [
    'On guimao day, flood disaster in counties including Gao in Guangdong was relieved.',
    'On guimao day, flood relief reached Gao and other Guangdong counties.',
  ],
  s0638: [
    'Because sect rebel Duan Hanrong of Laifeng county, Hubei, had gathered a crowd to resist arrest, Bi Yuan was rebuked for negligence.',
    'Duan Hanrong\'s resistance in Laifeng brought a rebuke to Bi Yuan for slackness.',
  ],
  s0639: [
    'On wushen day, accumulated tax arrears from flood disaster in three cities including Qiqihar were remitted.',
    'On wushen day, flood back taxes were forgiven in Qiqihar and two other cities.',
  ],
  s0640: [
    'Tenth month of winter, day bingchen: accumulated tax arrears were remitted for nine counties including Ji in Henan and ten prefectures and counties in Shandong including Linqing.',
    'In the winter tenth month, on bingchen day, back taxes were forgiven in nine Henan counties including Ji and ten Shandong districts including Linqing.',
  ],
  s0641: [
    'On renxu day, Lebao memorialized capture of heterodox sect ringleader Liu Song.',
    'On renxu day, Lebao reported Liu Song, the sect chief, captured.',
  ],
  s0642: [
    'Anhui was ordered strictly to pursue his follower Liu Zhixie.',
    'Anhui was told to arrest his follower Liu Zhixie.',
  ],
  s0643: [
    'On guihai day, the Netherlands presented tribute.',
    'On guihai day, the Dutch sent tribute.',
  ],
  s0644: [
    'On yichou day, this year\'s quota tax from flood disaster in four subprefectures and counties under Zhangzhou prefecture, Fujian, was remitted.',
    'On yichou day, this year\'s flood tax was forgiven in four Zhangzhou-area Fujian districts.',
  ],
  s0645: [
    'On wuchen day, it was ordered that the seven passes of Kobdo Weihuo\'er and others be moved back to garrison on the former northern frontier; the remaining land was granted as pasture to the Khalkha prince Makusuerzhabu and others.',
    'On wuchen day, seven Kobdo passes returned to the old north line; surplus land went to Prince Makusuerzhabu and other Khalkhas for grazing.',
  ],
  s0646: [
    'On jimao day, Chen Yongfu was transferred to be Hubei governor and Huiling Anhui governor.',
    'On jimao day, Chen Yongfu took Hubei and Huiling took Anhui.',
  ],
  s0647: [
    'On xinsi day, Hengxiu\'s crime was pardoned.',
    'On xinsi day, Hengxiu was pardoned.',
  ],
  s0648: [
    'Eleventh month, day bingxu: because Liu Qingnai, magistrate of Fugou county, Henan, had been negligent in guarding against Liu Zhixie\'s secret flight, he was dismissed and arrested; Mu Helian was referred to the Board for severe deliberation.',
    'In the eleventh month, on bingxu day, Liu Qingnai was seized for letting Liu Zhixie escape and Mu Helian faced board discipline.',
  ],
  s0649: [
    'On renchen day, this year\'s grain tribute transport tax was remitted for prefectures and counties in Shandong including Linqing.',
    'On renchen day, this year\'s tribute grain tax was forgiven in Linqing-area Shandong.',
  ],
  s0650: [
    'On renyin day, Fugang was ordered to act as Minister of Punishments.',
    'On renyin day, Fugang acted as punishments minister.',
  ],
  s0651: [
    'On jiachen day, Mu Helian was stripped of office and sent to serve at Urumqi.',
    'On jiachen day, Mu Helian lost office and was sent to Urumqi.',
  ],
  s0652: [
    'Ajing\'a was made Henan governor.',
    'Ajing\'a became Henan governor.',
  ],
  s0653: [
    'Twelfth month, day bingchen: accumulated tax arrears through the years were universally remitted in all provinces.',
    'In the twelfth month, on bingchen day, all provinces\' multi-year back taxes were forgiven.',
  ],
  s0654: [
    'On bingzi day, Minister of Personnel Jin Jian died; Baoning replaced him.',
    'On bingzi day, Jin Jian died and Baoning took personnel.',
  ],
  s0655: [
    'Mingliang was made Ili general.',
    'Mingliang became Ili general.',
  ],
  s0656: [
    'On wuyin day, Shuliang was made Heilongjiang general.',
    'On wuyin day, Shuliang became Heilongjiang general.',
  ],
  s0657: [
    'Suiyuan general Tusang\'a was changed to Xi\'an general, with Yongkun replacing him.',
    'Tusang\'a moved from Suiyuan to Xi\'an; Yongkun took Suiyuan.',
  ],
  s0658: [
    'Sixtieth year, spring, first month, new moon on day jiashen: there was a solar eclipse; court congratulations were exempted.',
    'In the sixtieth year, on the spring new moon, an eclipse spared the court levee.',
  ],
  s0659: [
    'On yiyou day, poor people last year stricken by flood in twenty prefectures and counties in Zhili including Tianjin, fourteen counties in Henan including Ji, and ten prefectures and counties in Shandong including Linqing were given relief by varying amounts.',
    'On yiyou day, last year\'s flood poor in Tianjin-area Zhili, Ji-area Henan, and Linqing-area Shandong were relieved by degree.',
  ],
  s0660: [
    'On bingxu day, Suling\'a was summoned to the capital; Funing was transferred to be governor-general of the Two Jiangs; Bi Yuan again became Huguang governor-general and Yude Shandong governor.',
    'On bingxu day, Suling\'a was recalled; Funing took the Two Jiangs; Bi Yuan returned to Huguang and Yude to Shandong.',
  ],
  s0661: [
    'On wuzi day, Chen Yongfu was transferred to be Guizhou governor, Yingshan Hubei governor, with Bi Yuan additionally to act.',
    'On wuzi day, Chen Yongfu took Guizhou, Yingshan Hubei, and Bi Yuan acted.',
  ],
  s0662: [
    'On yiwei day, imperial son-in-law Fengshen Yinde was made Minister of the Imperial Household Department.',
    'On yiwei day, Fengshen Yinde joined the Imperial Household ministry.',
  ],
  s0663: [
    'On xinchou day, accumulated tax arrears in Shandong were remitted.',
    'On xinchou day, Shandong\'s multi-year back taxes were forgiven.',
  ],
  s0664: [
    'On gengxu day, accumulated tax arrears in Jiangsu were remitted.',
    'On gengxu day, Jiangsu\'s multi-year back taxes were forgiven.',
  ],
  s0665: [
    'Silver and grain due for deferred collection in Jiangxi were remitted.',
    'Jiangxi deferred silver and grain collection was forgiven.',
  ],
  s0666: [
    'Second month, new moon on day guichou: accumulated tax arrears in Guangdong were remitted.',
    'On the second-month new moon, Guangdong\'s multi-year back taxes were forgiven.',
  ],
  s0667: [
    'Chen Yongfu was stripped of office and arrested for errors in pursuing and seizing the important criminal Liu Zhixie.',
    'Chen Yongfu was dismissed and arrested over the Liu Zhixie chase.',
  ],
  s0668: [
    'Yao Fen was transferred to be Guizhou governor, with Cheng Lin made Guangxi governor.',
    'Yao Fen took Guizhou and Cheng Lin took Guangxi.',
  ],
  s0669: [
    'On bingchen day, accumulated tax arrears in Shaanxi were remitted.',
    'On bingchen day, Shaanxi\'s multi-year back taxes were forgiven.',
  ],
  s0670: [
    'Miao bandits including Shi Liudeng in Songtao subprefecture, Guizhou, and Shi Sanbao in Yongshui, Hunan, rose in rebellion.',
    'Shi Liudeng in Guizhou\'s Songtao and Shi Sanbao in Hunan\'s Yongshui led Miao uprisings.',
  ],
  s0671: [
    'On wuwu day, Hunan Miao bandits took Qianzhou subprefecture; Assistant Prefect Song Ruchun and others died.',
    'On wuwu day, Miao rebels seized Qianzhou and Song Ruchun fell.',
  ],
  s0672: [
    'Fukang\'an was ordered to go to suppress them; Bi Yuan was stationed at Changde to manage grain and funds.',
    'Fukang\'an was sent to fight them; Bi Yuan handled supplies at Changde.',
  ],
  s0673: [
    'On gengshen day, because memorials with edicts from Grand Secretary Agui and others did not please the Emperor, merit registration was suspended and Vice Minister Cheng Ce and others were referred to the boards for disciplinary action.',
    'On gengshen day, Agui\'s memorial language failed and Cheng Ce and others faced discipline while rewards were held.',
  ],
  s0674: [
    'Governor-general Fukang\'an and others were entered for merit review.',
    'Fukang\'an and other governors were listed for rewards.',
  ],
  s0675: [
    'On xinyou day, Guizhou Miao bandits besieged Brigadier Zhuolong\'a at Zhengda camp in Zhenyuan circuit.',
    'On xinyou day, Guizhou Miao rebels besieged Zhuolong\'a at Zhengda camp.',
  ],
  s0676: [
    'Accumulated tax arrears on banner lands in Guangning and Jinzhou, Fengtian, were remitted.',
    'Fengtian banner land back taxes at Guangning and Jinzhou were forgiven.',
  ],
  s0677: [
    'Accumulated tax arrears in forty-five prefectures and counties in Gansu including Gaolan were remitted.',
    'Gansu\'s forty-five districts including Gaolan had multi-year back taxes forgiven.',
  ],
  s0678: [
    'On bingyin day, Sichuan Governor-General Helin was ordered to proceed to Youyang prefecture against the Miao; Sun Shiyi remained in Sichuan to handle settlement accounts.',
    'On bingyin day, Helin went to Youyang against the Miao while Sun Shiyi stayed in Sichuan for accounts.',
  ],
  s0679: [
    'On dingmao day, accumulated tax arrears on civilian and saltern lands in Zhejiang were remitted.',
    'On dingmao day, Zhejiang\'s civilian and saltern back taxes were forgiven.',
  ],
  s0680: [
    'On jisi day, Miao bandits took Yaxi stockade in Yongshui subprefecture; Brigadier Ming\'antu and others died.',
    'On jisi day, Miao rebels took Yaxi in Yongshui and Ming\'antu fell.',
  ],
  s0681: [
    'On xinwei day, Yongshun Miao bandit Zhang Tingzhong and others rose in rebellion, harassing Baojing and Luxi.',
    'On xinwei day, Zhang Tingzhong\'s Yongshun Miao rebels raided Baojing and Luxi.',
  ],
  s0682: [
    'On bingzi day, accumulated tax arrears in Anhui were remitted.',
    'On bingzi day, Anhui\'s multi-year back taxes were forgiven.',
  ],
  s0683: [
    'On renwu day, Guizhou Miao bandits harassed Sinan and Yinjiang, penetrating into Xiushan, Sichuan.',
    'On renwu day, Guizhou Miao rebels raided Sinan and Yinjiang and entered Sichuan\'s Xiushan.',
  ],
  s0684: [
    'Fukang\'an went to Tongren to supervise suppression.',
    'Fukang\'an moved to Tongren to command.',
  ],
  s0685: [
    'Delengtai was ordered to lead Baturu bodyguards and others to the Guizhou army camp.',
    'Delengtai was sent with Baturu guards to the Guizhou front.',
  ],
  s0686: [
    'Intercalary second month, day yiyou: Fukang\'an memorialized relief of the siege at Zhengda camp.',
    'In the intercalary second month, on yiyou day, Fukang\'an reported Zhengda camp relieved.',
  ],
  s0687: [
    'On renchen day, Feng Guangxiong remained Guizhou governor; Yao Fen was transferred to be Yunnan governor.',
    'On renchen day, Feng Guangxiong stayed in Guizhou and Yao Fen took Yunnan.',
  ],
  s0688: [
    'Because of the Miao rebellion, quota tax was remitted in places including Songtao and Zhengda under Tongren prefecture, Guizhou.',
    'The Miao rising brought tax relief in Tongren-area Songtao and Zhengda.',
  ],
  s0689: [
    'On yiwei day, the Emperor went to the Eastern Tombs; land tax and grain levies on the route were remitted by three-tenths.',
    'On yiwei day, the Emperor visited the Eastern Tombs with a three-tenths tax cut on the route.',
  ],
  s0690: [
    'On wuxu day, the Emperor paid respects at Zhaoxiling, Xiaoling, Xiaodongling, and Jingling.',
    'On wuxu day, the Emperor worshipped at four imperial tombs.',
  ],
  s0691: [
    'On jihai day, Fukang\'an memorialized relief of the encirclement at Xiunao.',
    'On jihai day, Fukang\'an reported Xiunao relieved.',
  ],
  s0692: [
    'On yisi day, Fukang\'an memorialized capture of Shicheng and elimination of Miao bandits in cave strongholds.',
    'On yisi day, Fukang\'an reported Shicheng taken and cave Miao cleared.',
  ],
  s0693: [
    'On dingwei day, the Emperor paid respects at Tailing and Taidongling and honored Empress Xiaoxian\'s tomb.',
    'On dingwei day, the Emperor worshipped at Tai tombs and Empress Xiaoxian\'s tomb.',
  ],
  s0694: [
    'Accumulated arrears at the Two Huai salterns were remitted.',
    'Two Huai saltern debts were forgiven.',
  ],
  s0695: [
    'On wushen day, Fukang\'an memorialized relief of the siege at Songtao.',
    'On wushen day, Fukang\'an reported Songtao relieved.',
  ],
  s0696: [
    'Third month, day yimao: Helin memorialized securing the Xiushan rear route and was ordered to proceed to Songtao to join Fukang\'an in suppression.',
    'In the third month, on yimao day, Helin secured Xiushan\'s rear and was sent to Songtao with Fukang\'an.',
  ],
  s0697: [
    'Sun Shiyi was ordered to act as Sichuan governor-general.',
    'Sun Shiyi acted as Sichuan governor-general.',
  ],
  s0698: [
    'On jiwei day, Fukang\'an memorialized extermination of Miao bandits at Changchong and Kaluo and advance into Chu territory.',
    'On jiwei day, Fukang\'an cleared Changchong and Kaluo and entered Hunan.',
  ],
  s0699: [
    'Eleuthanbao was ordered hastily to proceed to Fukang\'an\'s army camp.',
    'Eleuthanbao was rushed to Fukang\'an\'s headquarters.',
  ],
  s0700: [
    'On jimao day, Fukang\'an memorialized relief of the siege at Yongshui in Hunan.',
    'On jimao day, Fukang\'an reported Yongshui in Hunan relieved.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b07.mjs <translation.json>'
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
