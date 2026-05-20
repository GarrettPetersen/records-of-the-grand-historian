#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day wushen, disaster relief was granted to victims of last year\'s calamity in twenty-nine prefectures, counties, and sub-prefectures in Gansu including Gaolan.',
    'On wushen day, twenty-nine Gansu districts including Gaolan received disaster relief.',
  ],
  s0202: [
    'Registered tax quotas for last year were remitted for sixteen Anhui prefectures and counties including Hefei and five garrisons including Luzhou.',
    'Last year\'s taxes were remitted in sixteen Anhui districts and five garrisons.',
  ],
  s0203: [
    'Summer, fourth month, day jiwei: Wen Fu was made Fujian governor.',
    'In the fourth month, Wen Fu became Fujian governor.',
  ],
  s0204: [
    'On day renshen, Fu Heng advanced troops to Laoguantun and A Gui to Mengmi.',
    'On renshen day, Fu Heng marched on Laoguantun and A Gui on Mengmi.',
  ],
  s0205: [
    'On day dingchou, Chen Chuzhe and one hundred fifty-one others were granted jinshi with rank and origin in varying grades.',
    'On dingchou day, one hundred fifty-one new jinshi including Chen Chuzhe received graded ranks.',
  ],
  s0206: [
    'Fifth month, day jichou: one Jiangning deputy lieutenant-general was abolished.',
    'In the fifth month, one Jiangning deputy lieutenant-general post was cut.',
  ],
  s0207: [
    'Sixth month, day bingchen: Asheha was made Yunnan-Guizhou governor-general and Kaning\'a Henan governor.',
    'In the sixth month, Asheha took Yunnan-Guizhou and Kaning\'a took Henan.',
  ],
  s0208: [
    'On day dingsi, Fu Heng memorialized that the Menggong native official had submitted.',
    'On dingsi day, Fu Heng reported Menggong\'s submission.',
  ],
  s0209: [
    'On day wuyin, the Huangmei river dike in Hubei burst; Governor-General Wu Dashan of Huguang and Hubei Governor Kuiyi were ordered to inspect it.',
    'On wuyin day, the Huangmei dike broke and Wu Dashan and Kuiyi were sent to survey it.',
  ],
  s0210: [
    'Autumn, seventh month, day dinghai: Mingde was appointed acting Yunnan-Guizhou governor-general, moving headquarters to Tengyue to oversee military affairs.',
    'In the seventh month, Mingde acted as Yunnan-Guizhou governor-general at Tengyue for the campaign.',
  ],
  s0211: [
    'On day xinmao, one commandant-colonel was established at Bayandai City, Ili.',
    'On xinmao day, one Ili Bayandai commandant-colonel was appointed.',
  ],
  s0212: [
    'Fu Heng memorialized that the Mengmi native official had submitted.',
    'Fu Heng reported Mengmi\'s submission.',
  ],
  s0213: [
    'On day jiawu, Li Shiyao memorialized that Siam remained occupied by Kampeng.',
    'On jiawu day, Li Shiyao reported Siam still held by Kampeng.',
  ],
  s0214: [
    'On day dingyou, Minister of Rites Dong Bangda died.',
    'On dingyou day, Dong Bangda, minister of rites, died.',
  ],
  s0215: [
    'On day jihai, Lu Zongkai was transferred to Minister of Rites and Cai Xin to Minister of War.',
    'On jihai day, Lu Zongkai took Rites and Cai Xin took War.',
  ],
  s0216: [
    'Wu Shaoshi was made Minister of Punishments, Haiming Jiangxi governor, and Liang Guozhi Hubei governor.',
    'Wu Shaoshi took Punishments; Haiming and Liang Guozhi took Jiangxi and Hubei.',
  ],
  s0217: [
    'On day jiyou, Li Shiyao issued a dispatch ordering Mo Shilin to join Siamese native officials in attacking Kampeng.',
    'On jiyou day, Li Shiyao ordered Mo Shilin to join Siamese chiefs against Kampeng.',
  ],
  s0218: [
    'Eighth month, day yichou: the Emperor went to the Mulan hunting grounds.',
    'In the eighth month, the Emperor went to Mulan for the hunt.',
  ],
  s0219: [
    'On day jisi, because Cai Chen hanged himself in prison, Fujian Provincial Surveillance Commissioner Sun Xiaoyu was stripped of office and sent to the military penal colony.',
    'On jisi day, Sun Xiaoyu lost his post over Cai Chen\'s prison suicide and was sent to the penal colony.',
  ],
  s0220: [
    'Ninth month, day bingxu: A Gui\'s advance reached Manmu.',
    'In the ninth month, A Gui reached Manmu.',
  ],
  s0221: [
    'On day jichou, the Emperor returned to lodge at the Mountain Resort.',
    'On jichou day, the Emperor returned to the Mountain Resort.',
  ],
  s0222: [
    'On day yiwei, the Emperor, escorting the Empress Dowager, returned from the tour.',
    'On yiwei day, the Emperor and Empress Dowager returned from tour.',
  ],
  s0223: [
    'On day jihai, A Gui and Iletu were ordered to welcome Fu Heng from Manmu for a united army.',
    'On jihai day, A Gui and Iletu were told to meet Fu Heng from Manmu.',
  ],
  s0224: [
    'On day renyin, Liu Tongxun was ordered to join in surveying the Shandong Grand Canal.',
    'On renyin day, Liu Tongxun was sent to survey the Shandong canal.',
  ],
  s0225: [
    'On day guimao, Fu Heng memorialized that Menggong native official Hunjue led his people in surrender.',
    'On guimao day, Fu Heng reported Hunjue of Menggong surrendering with his following.',
  ],
  s0226: [
    'The Emperor praised him.',
    'The Emperor commended him.',
  ],
  s0227: [
    'He was specially awarded a three-eyed peacock feather.',
    'He received a special three-eyed peacock plume.',
  ],
  s0228: [
    'On day wushen, Fu Heng\'s advance reached Mengyang.',
    'On wushen day, Fu Heng reached Mengyang.',
  ],
  s0229: [
    'A Gui memorialized that Hakhan had been taken and the river crossed.',
    'A Gui reported taking Hakhan and crossing the river.',
  ],
  s0230: [
    'A Gui was ordered to hold Xinjie and suppress the bandits.',
    'A Gui was told to hold Xinjie and fight the rebels.',
  ],
  s0231: [
    'Winter, tenth month, day yimao: Zhang Bao was appointed acting Yunnan-Guizhou governor-general and Mingde acting Yunnan governor.',
    'In the tenth month, Zhang Bao and Mingde acted as Yunnan-Guizhou governor-general and Yunnan governor.',
  ],
  s0232: [
    'Yongde was transferred to Jiangsu governor.',
    'Yongde became Jiangsu governor.',
  ],
  s0233: [
    'Xiong Xuepeng was restored and appointed acting Zhejiang governor.',
    'Xiong Xuepeng was restored to act as Zhejiang governor.',
  ],
  s0234: [
    'Zenghai was appointed acting Ili general.',
    'Zenghai acted as Ili general.',
  ],
  s0235: [
    'On day dingsi, Fu Heng memorialized that Mengyang had been taken.',
    'On dingsi day, Fu Heng reported taking Mengyang.',
  ],
  s0236: [
    'On day guihai, Liang Guozhi was concurrently appointed acting Huguang governor-general.',
    'On guihai day, Liang Guozhi also acted as Huguang governor-general.',
  ],
  s0237: [
    'On day jiazi, because A Gui could not take Laoguantun, his vice-generalship was removed and he was made military adviser.',
    'On jiazi day, A Gui lost the vice-generalship for failing at Laoguantun and became military adviser.',
  ],
  s0238: [
    'Iletu was ordered to be vice-general.',
    'Iletu was made vice-general.',
  ],
  s0239: [
    'Kaning\'a was transferred to Guizhou governor and Funihan to Henan governor.',
    'Kaning\'a took Guizhou and Funihan took Henan.',
  ],
  s0240: [
    'Hu Wenbo was made Anhui governor.',
    'Hu Wenbo became Anhui governor.',
  ],
  s0241: [
    'On day yichou, Fu Heng memorialized that the advance had reached Xinjie.',
    'On yichou day, Fu Heng reported reaching Xinjie.',
  ],
  s0242: [
    'Zhang Bao was ordered to station at Laoguantun.',
    'Zhang Bao was stationed at Laoguantun.',
  ],
  s0243: [
    'On day renshen, Yonggui was transferred to Minister of Rites, Tuoyong to Minister of Personnel, and Iletu to Minister of War, with Tuoyong acting concurrently.',
    'On renshen day, Yonggui, Tuoyong, and Iletu took Rites, Personnel, and War, with Tuoyong acting in both.',
  ],
  s0244: [
    'Wu Shaoshi was transferred to Minister of Rites.',
    'Wu Shaoshi took Rites.',
  ],
  s0245: [
    'Qiu Yixiu was made Minister of Punishments.',
    'Qiu Yixiu became minister of punishments.',
  ],
  s0246: [
    'Eleventh month, day yiyou: Vice-General and Minister of Revenue Ali Gun died in camp.',
    'In the eleventh month, Ali Gun, vice-general and minister of revenue, died in the field.',
  ],
  s0247: [
    'A Gui was ordered to continue serving above the vice-general rank; Yinletu was made vice-general; Wusantai and Changqing were made military advisers.',
    'A Gui kept above vice-general rank; Yinletu became vice-general and Wusantai and Changqing became advisers.',
  ],
  s0248: [
    'Guan Bao was transferred to Minister of Revenue.',
    'Guan Bao took Revenue.',
  ],
  s0249: [
    'Su\'erna was made Minister of Punishments and Tuo\'enduo acting Censor-in-Chief of the Left.',
    'Su\'erna took Punishments and Tuo\'enduo acted as left censor-in-chief.',
  ],
  s0250: [
    'On day wuzi, Fu Heng and others assaulted Laoguantun.',
    'On wuzi day, Fu Heng\'s force attacked Laoguantun.',
  ],
  s0251: [
    'On day guisi, Huang Dengxian was made Grand Canal transport governor-general.',
    'On guisi day, Huang Dengxian became transport governor-general.',
  ],
  s0252: [
    'On day bingshen, because of malarial miasma in Burma the government army had lost more than half; withdrawal was ordered to camp at Yeniuba, Grand Secretary Fu Heng recalled, and A Gui left to settle aftermath.',
    'On bingshen day, Burma\'s pestilence halved the army; troops withdrew to Yeniuba, Fu Heng was recalled, and A Gui stayed to clean up.',
  ],
  s0253: [
    'On day jihai, Guanbao was restored and appointed acting Censor-in-Chief of the Left.',
    'On jihai day, Guanbao was restored to act as left censor-in-chief.',
  ],
  s0254: [
    'On day dingwei, Fu Heng and others attacked Laoguantun without success.',
    'On dingwei day, Fu Heng failed to take Laoguantun.',
  ],
  s0255: [
    'The local official came to camp with a letter from Burmese chief Meng Bo Boye seeking surrender.',
    'A local chief brought Meng Bo\'s surrender letter to camp.',
  ],
  s0256: [
    'The Emperor ordered withdrawal.',
    'The Emperor ordered the army to withdraw.',
  ],
  s0257: [
    'Twelfth month, day xinhai: next year\'s grain taxes were remitted by five-tenths for localities handling military supplies in Yunnan and three prefectures including Yongchang.',
    'In the twelfth month, Yunnan supply districts and Yongchang prefectures had taxes cut by half.',
  ],
  s0258: [
    'For prefectures and counties through which troops passed in Zhili, Henan, Hubei, Hunan, Guizhou, and other provinces, three-tenths were also remitted.',
    'Transit districts in several provinces also had three-tenths remitted.',
  ],
  s0259: [
    'Gong Zhaolin was transferred to Hunan governor, Debao to Guangdong governor, and Chen Huizu to Guangxi governor.',
    'Gong Zhaolin, Debao, and Chen Huizu took Hunan, Guangdong, and Guangxi.',
  ],
  s0260: [
    'On day yimao, Fu Heng and others memorialized that Burmese chief Meng Bo had declared himself a subject and offered tribute.',
    'On yimao day, Fu Heng reported Meng Bo submitting and offering tribute.',
  ],
  s0261: [
    'An edict said instructions would be issued when he came to the capital.',
    'The throne said an edict would follow when he reached Beijing.',
  ],
  s0262: [
    'On day jisi, because the next year the Emperor would escort the Empress Dowager to the Eastern Tombs and tour Tianjin, three-tenths of Qianlong 35 grain taxes were remitted for transit districts and Tianjin prefecture.',
    'On jisi day, tax remission was granted for the coming eastern tombs and Tianjin tour.',
  ],
  s0263: [
    'A Gui was made Minister of Rites.',
    'A Gui became minister of rites.',
  ],
  s0264: [
    'Thirty-fifth year, spring, first month, new moon on day jimao: because the Emperor would reach sixty and next year the Empress Dowager\'s eightieth birthday, an edict remitted once all registered land and poll taxes in every province.',
    'In spring of Qianlong 35, an edict remitted all provincial land and poll taxes for the imperial and dowager birthdays.',
  ],
  s0265: [
    'On day xinmao, Zenghai was made Minister of the Court of Colonial Affairs.',
    'On xinmao day, Zenghai became minister of colonial affairs.',
  ],
  s0266: [
    'On day dingwei, Lavangdorji, heir of Khalkha Hosho Prince Chenggunjab, was invested as imperial son-in-law of gurun rank.',
    'On dingwei day, Lavangdorji, Khalkha prince\'s heir, became imperial son-in-law.',
  ],
  s0267: [
    'Second month, day yichou: the Emperor, escorting the Empress Dowager, visited the Eastern Tombs.',
    'In the second month, the Emperor and Empress Dowager visited the Eastern Tombs.',
  ],
  s0268: [
    'On day gengwu, the Emperor, escorting the Empress Dowager, returned from the tour and lodged at Panshan.',
    'On gengwu day, the imperial party returned and stopped at Panshan.',
  ],
  s0269: [
    'On day renshen, because Burmese chief Meng Bo\'s tribute memorial had not arrived, Zhang Bao was instructed to prepare and border trade was strictly forbidden.',
    'On renshen day, Meng Bo\'s tribute delay led to warnings to Zhang Bao and a trade ban.',
  ],
  s0270: [
    'Third month, day jimao: the Emperor, escorting the Empress Dowager, returned to the capital.',
    'In the third month, the imperial party returned to Beijing.',
  ],
  s0271: [
    'Wu Shaoshi was restored as a director in the Ministry of Punishments.',
    'Wu Shaoshi was restored to a punishments bureau directorship.',
  ],
  s0272: [
    'On day xinsi, Gong Zhaolin was transferred to Guizhou governor and Wu Dashan, as Huguang governor-general, concurrently administered Hunan.',
    'On xinsi day, Gong Zhaolin took Guizhou and Wu Dashan also acted in Hunan.',
  ],
  s0273: [
    'On day renwu, the Emperor, escorting the Empress Dowager, visited the Tai Mausoleum and toured Tianjin.',
    'On renwu day, the imperial party visited the Tai tomb and Tianjin.',
  ],
  s0274: [
    'On day bingxu, the Emperor paid visit to the Tai Mausoleum.',
    'On bingxu day, the Emperor visited the Tai tomb.',
  ],
  s0275: [
    'On day jichou, accumulated land-tax silver and usual and disaster grain loans owed from Qianlong 31-33 were remitted for counties the court passed through and Tianjin prefecture; for Zhili, accumulated land-tax silver and commuted silver from 31-33 were also remitted.',
    'On jichou day, large tax and grain arrears were forgiven for transit districts, Tianjin, and Zhili.',
  ],
  s0276: [
    'Punishments below military exile in Zhili were reduced.',
    'Zhili sentences below military exile were lessened.',
  ],
  s0277: [
    'Silver and grain deferred for disaster in Zhili from Qianlong 31-33 were remitted.',
    'Zhili disaster-deferred taxes from 31-33 were forgiven.',
  ],
  s0278: [
    'On day jiawu, the Emperor, escorting the Empress Dowager, lodged at Tianjin prefecture.',
    'On jiawu day, the imperial party lodged at Tianjin.',
  ],
  s0279: [
    'On day bingshen, the Emperor reviewed garrison troops.',
    'On bingshen day, the Emperor reviewed the garrison.',
  ],
  s0280: [
    'Grand Secretary and campaign commander Fu Heng returned to the capital; he and Fulung\'an were both ordered to resume as directors-general of the Imperial Household Department.',
    'Fu Heng returned to Beijing and resumed Household Department duty with Fulung\'an.',
  ],
  s0281: [
    'On day wuxu, Yongde was transferred to Henan governor and Sazai appointed acting Jiangsu governor.',
    'On wuxu day, Yongde took Henan and Sazai acted in Jiangsu.',
  ],
  s0282: [
    'On day guimao, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On guimao day, the imperial party returned to Beijing.',
  ],
  s0283: [
    'On day jiyou, because the Burmese chief demanded the Hsenwi native official Xian Wengtuan and others, an edict rebuked Ha Guoxing for glossing over concessions; he was summoned to the capital and Changqing replaced him as Yunnan brigade commander.',
    'On jiyou day, Ha Guoxing was rebuked and recalled for mishandling Burma; Changqing replaced him in Yunnan.',
  ],
  s0284: [
    'On day jiwei, Fu Liang was summoned to the capital and Fuchun was made Jilin general.',
    'On jiwei day, Fu Liang was recalled and Fuchun became Jilin general.',
  ],
  s0285: [
    'On day bingyin, locusts struck Tianjin; Yang Tingzhang was ordered to supervise eradication.',
    'On bingyin day, Tianjin locusts brought Yang Tingzhang to supervise extermination.',
  ],
  s0286: [
    'On day gengwu, the Emperor went to Black Dragon Pool to pray for rain.',
    'On gengwu day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0287: [
    'That month, registered taxes were remitted for eight Zhejiang prefectures and counties including Renhe, the Hangyan and Jiahu garrisons, and Dingyuan in Shaanxi for flood and hail damage in the thirty-fourth year.',
    'That month, tax remission reached Zhejiang, garrisons, and Shaanxi for flood and hail.',
  ],
  s0288: [
    'Fifth month, new moon on day dingchou: solar eclipse.',
    'In the fifth month there was a solar eclipse.',
  ],
  s0289: [
    'On day renwu, because the eighth imperial son entered the city without permission, Academy of the Imperial Sons attendants Guanbao and Tang Xianjia were stripped of office and admonished.',
    'On renwu day, Guanbao and Tang Xianjia lost their posts over the eighth son entering the city without leave.',
  ],
  s0290: [
    'On day yiwei, for rain prayer the Ministry of Punishments was ordered to clear ordinary prisons and reduce punishments below military exile.',
    'On yiwei day, rain prayers brought prison review and lighter sentences.',
  ],
  s0291: [
    'Intercalary fifth month, new moon on day bingwu: Qiu Yixiu was sent to Jizhou and Baodi areas to catch locusts.',
    'In the intercalary fifth month, Qiu Yixiu was sent to Jizhou and Baodi against locusts.',
  ],
  s0292: [
    'On day wushen, Beijing had heavy rain.',
    'On wushen day, Beijing had heavy rain.',
  ],
  s0293: [
    'On day jiwei, Wen Fu was made Vice Minister of Personnel and ordered to serve in the Grand Council.',
    'On jiwei day, Wen Fu became personnel vice minister and joined the Grand Council.',
  ],
  s0294: [
    'On day jiazi, Qiu Yixiu was dismissed for ineffective locust eradication; Cheng Jingyi was transferred to Minister of Punishments.',
    'On jiazi day, Qiu Yixiu was removed for poor locust work and Cheng Jingyi took Punishments.',
  ],
  s0295: [
    'Fan Shishou was made Minister of Works and Zhang Ruowen Censor-in-Chief of the Left.',
    'Fan Shishou took Works and Zhang Ruowen became left censor-in-chief.',
  ],
  s0296: [
    'Sixth month, day jiashen: A Gui and others were instructed to transfer Hailancha and Ha Guoxing to advance troops.',
    'In the sixth month, A Gui was told to send Hailancha and Ha Guoxing forward.',
  ],
  s0297: [
    'On day bingxu, locusts appeared in Yongcheng in Henan, Dangshan in Jiangsu, Suzhou in Anhui, and other prefectures and counties.',
    'On bingxu day, locusts struck Yongcheng, Dangshan, Suzhou, and other districts.',
  ],
  s0298: [
    'On day dinghai, Guan Bao was transferred to Minister of Punishments and Su\'erna to Minister of Revenue.',
    'On dinghai day, Guan Bao took Punishments and Su\'erna took Revenue.',
  ],
  s0299: [
    'On day renchen, Fengsheng\'e was ordered to act as Minister of War.',
    'On renchen day, Fengsheng\'e acted as minister of war.',
  ],
  s0300: [
    'On day jiawu, Miao chieftains including Xiang\'ai of Guzhou in Guizhou were executed.',
    'On jiawu day, Guizhou Miao leaders including Xiang\'ai were put to death.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b03.mjs <translation.json>'
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
