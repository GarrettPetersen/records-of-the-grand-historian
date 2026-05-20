#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'An order sent Vice Minister Wu Najian to Gubeikou to join Commissioner-in-Chief Wang Jintai in surveying flood damage, issued twenty thousand taels from the treasury for relief, and opened granaries for relief grain sales.',
    'Wu Najian and Wang Jintai were sent to Gubeikou to survey floods; twenty thousand taels and granary relief were provided.',
  ],
  s0302: [
    'Seventh month, autumn, new moon on day yisi: Li Shiyao memorialized that Moshi Lin, native official of Hexian Town, asked to instruct Burmese tribes to restore Siam; this was not permitted.',
    'On the seventh-month new moon of yisi, Li Shiyao reported a plea to rally Burma for Siam; the court refused.',
  ],
  s0303: [
    'On day bingwu, Zeng Hai was made Heilongjiang general; Wenfu was made Minister of the Court of Colonial Affairs.',
    'On bingwu day, Zeng Hai became Heilongjiang general and Wenfu colonial affairs minister.',
  ],
  s0304: [
    'He\'erjinge and Wu Najian were ordered to Gubeikou to arrange river works.',
    'He\'erjinge and Wu Najian were sent to Gubeikou for river works.',
  ],
  s0305: [
    'On day renzi, because Lesser Jinchuan had clashed with the Wokeshi native chieftain, Sichuan governor-general Aertai was ordered to summon the Lesser Jinchuan chieftain and admonish him.',
    'On renzi day, Aertai was told to summon the Lesser Jinchuan chief after a clash with Wokeshi.',
  ],
  s0306: [
    'On day guichou, the Emperor went in person to Prince He Hongzhou\'s residence to inquire after his illness.',
    'On guichou day, the Emperor visited the ailing Prince He Hongzhou.',
  ],
  s0307: [
    'On day dingsi, Prince He Hongzhou died.',
    'On dingsi day, Prince He Hongzhou died.',
  ],
  s0308: [
    'Grand Tutor and Grand Secretary Fu Heng died.',
    'Grand Secretary Fu Heng died.',
  ],
  s0309: [
    'On day wuwu, Wang Shifang, former educational instructor of Suichang County, Zhejiang, who had come to the capital at one hundred twelve to offer birthday felicitations, was granted the rank of Vice Director of the Imperial College and allowed to draw salary while at home.',
    'On wuwu day, the centenarian Wang Shifang received an Imperial College vice-director rank and home salary.',
  ],
  s0310: [
    'On day xinyou, Pei Zongxi was made Anhui governor.',
    'On xinyou day, Pei Zongxi became Anhui governor.',
  ],
  s0311: [
    'On day jiazi, two hundred thousand piculs of tribute grain were diverted to relieve flood victims in six counties including Wuqing.',
    'On jiazi day, two hundred thousand piculs of grain relieved floods in six counties including Wuqing.',
  ],
  s0312: [
    'Nomuzhin was made Yunnan governor.',
    'Nomuzhin became Yunnan governor.',
  ],
  s0313: [
    'Eighth month, day wuyin: because Vice General Agui had handled affairs in a perfunctory, opportunistic way, he was stripped of his posts as inner grandee, Minister of Rites, and Bordered Red Banner Han Chinese commander-in-chief, and retained only as inner grandee on reduced status to continue as vice general.',
    'On wuyin in the eighth month, Agui lost several ranks for shoddy work but stayed on as vice general.',
  ],
  s0314: [
    'On day jimao, Yonggui was made Minister of Rites; Guanbao was made Left Censor-in-Chief.',
    'On jimao day, Yonggui became Minister of Rites and Guanbao left censor-in-chief.',
  ],
  s0315: [
    'Aertai memorialized that Songzhusan had pleaded guilty and surrendered the Damuba stockade region and the Fan people he had seized.',
    'Aertai reported Songzhusan\'s submission, return of Damuba, and release of captives.',
  ],
  s0316: [
    'On day xinsi, Liu Tongxun was ordered concurrently to supervise the Board of Personnel.',
    'On xinsi day, Liu Tongxun was also put in charge of Personnel.',
  ],
  s0317: [
    'On day bingxu, the Longevity Festival: the Emperor went to the Empress Dowager\'s palace to perform rites.',
    'On bingxu day, the Emperor observed the Longevity Festival rites before the Empress Dowager.',
  ],
  s0318: [
    'At the Hall of Supreme Harmony, princes down to civil and military officials presented memorials of congratulation and performed celebration rites; by imperial order the banquet was stopped.',
    'Congratulatory rites were held at the Hall of Supreme Harmony, but the banquet was canceled.',
  ],
  s0319: [
    'Fengsheng\'e was ordered to serve at the Grand Council.',
    'Fengsheng\'e joined the Grand Council.',
  ],
  s0320: [
    'On day jichou, the Emperor, accompanying the Empress Dowager, went to Rehe.',
    'On jichou day, the court went to Rehe with the Empress Dowager.',
  ],
  s0321: [
    'On day yiwei, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On yiwei day, the court lodged at the Summer Mountain Resort.',
  ],
  s0322: [
    'On day jihai, the Emperor went to Mulan.',
    'On jihai day, the Emperor went to Mulan.',
  ],
  s0323: [
    'Ninth month, day bingwu: Aertai was made Wuying Hall Grand Secretary while remaining to handle Sichuan governor-general affairs.',
    'On bingwu in the ninth month, Aertai became Wuying Grand Secretary and kept Sichuan duties.',
  ],
  s0324: [
    'On day wuwu, the Emperor returned and halted at the Mountain Resort for Avoiding Summer Heat.',
    'On wuwu day, the Emperor returned to the Summer Mountain Resort.',
  ],
  s0325: [
    'On day jiazi, Gao Jin was ordered to act concurrently as Canal Transport governor-general.',
    'On jiazi day, Gao Jin also acted as canal transport commissioner.',
  ],
  s0326: [
    'Winter, tenth month, new moon on day guiyou: the Emperor, accompanying the Empress Dowager, returned from the tour.',
    'On the tenth-month new moon of guiyou, the court returned with the Empress Dowager.',
  ],
  s0327: [
    'On day xinsi, Cui Yingjie was summoned to the capital; Zhong Yin was ordered to act as Fujian-Zhejiang governor-general.',
    'On xinsi day, Cui Yingjie was called to Beijing and Zhong Yin acted in Fujian-Zhejiang.',
  ],
  s0328: [
    'On day renwu, Aertai was summoned to the capital; Defu acted as Sichuan governor-general, and Wudashan concurrently acted as Hunan governor.',
    'On renwu day, Aertai was recalled; Defu and Wudashan acted in Sichuan and Hunan.',
  ],
  s0329: [
    'Sazai was summoned to the capital; Lihu was ordered to act as Jiangsu governor.',
    'Sazai was called to Beijing and Lihu acted in Jiangsu.',
  ],
  s0330: [
    'On day jiawu, Agui and others memorialized that Burmese officials at Laoguandun had sent envoys with letters asking to halt this year\'s advance; this was granted.',
    'On jiawu day, Agui reported a Burmese plea to suspend operations this year; the court agreed.',
  ],
  s0331: [
    'On day dingyou, Grand Secretary Chen Hongmou begged retirement on account of age and illness; a warm edict urged him to remain.',
    'On dingyou day, Chen Hongmou sought retirement for illness and was warmly told to stay.',
  ],
  s0332: [
    'Twelfth month, day jiaxu: this year\'s registered grain tax for Xinjiang was remitted by three-tenths.',
    'On jiaxu in the twelfth month, Xinjiang\'s grain tax was cut by thirty percent.',
  ],
  s0333: [
    'On day bingzi, Cui Yingjie was made Canal Transport governor-general.',
    'On bingzi day, Cui Yingjie became canal transport commissioner.',
  ],
  s0334: [
    'On day bingxu, Agui and Zhang Bao were instructed secretly to plan an advance against Burmese bandits.',
    'On bingxu day, Agui and Zhang Bao were told to plan a Burma campaign in secret.',
  ],
  s0335: [
    'On day gengyin, Lihu was made Guizhou governor.',
    'On gengyin day, Lihu became Guizhou governor.',
  ],
  s0336: [
    'Thirty-sixth year, spring, first month, day jiachen: this year\'s registered grain for Taiwan prefecture and its subordinates in Fujian was remitted.',
    'In the thirty-sixth year, first month of jiachen, Taiwan\'s grain tax was forgiven.',
  ],
  s0337: [
    'On day yisi, one-tenth of this year\'s official rent was remitted for Guangdong prefectures and departments including Guangzhou and Shaozhou; three-tenths of official rent and school rent for seven Guilin prefectures and departments in Guangxi, and for Guilin and Pinglo prefectures and departments, were remitted.',
    'On yisi day, rent remissions were granted in Guangdong and Guangxi districts.',
  ],
  s0338: [
    'On day dingwei, this year\'s registered grain was remitted for four prefectures and departments including Ningyuan in Sichuan, for garrisons under Jianchang command, and for the Leibo and other subprefectures of Han and Fan people.',
    'On dingwei day, Sichuan grain taxes were remitted in Ningyuan and other districts.',
  ],
  s0339: [
    'On day jiwei, Defu was transferred to act as Yunnan-Guizhou governor-general; Aertai was ordered back to the Sichuan governor-general post.',
    'On jiwei day, Defu acted in Yunnan-Guizhou and Aertai returned to Sichuan.',
  ],
  s0340: [
    'Second month, day jiaxu: the Emperor, accompanying the Empress Dowager, toured east.',
    'On jiaxu in the second month, the court made an eastern tour with the Empress Dowager.',
  ],
  s0341: [
    'On day gengchen, inner grandee Batu Jiergale was ordered jointly with Jifu to try the mutual accusations of Uriankhai vice commander-in-chief Monizhabu and others.',
    'On gengchen day, Batu Jiergale and Jifu were assigned to judge Uriankhai officials\' suits.',
  ],
  s0342: [
    'On day xinsi, Grand Secretary Chen Hongmou begged retirement on account of illness; this was granted, and he was given the additional title Grand Tutor of the Heir Apparent.',
    'On xinsi day, Chen Hongmou retired for illness and received Grand Tutor of the Heir Apparent.',
  ],
  s0343: [
    'Grain loans owed by the people of fifteen Zhili prefectures and counties including Cangzhou were remitted, and this year\'s money and grain tax for Wuqing County was remitted by five-tenths.',
    'Zhili loan grain was forgiven in fifteen districts and Wuqing\'s tax was halved.',
  ],
  s0344: [
    'Vice Minister Qiu Yuexiu was ordered jointly with Yang Tingzhang and Zhou Yuanli to arrange Zhili river works.',
    'Qiu Yuexiu, Yang Tingzhang, and Zhou Yuanli were sent to manage Zhili rivers.',
  ],
  s0345: [
    'This year\'s registered tax was remitted by three-tenths for Zhili transit districts and by five-tenths for disaster districts in Shandong.',
    'Shandong transit taxes were cut thirty percent and disaster districts fifty percent.',
  ],
  s0346: [
    'This year\'s land-and-poll tax for two Shandong counties including Tai\'an was remitted.',
    'Tai\'an and one other Shandong county had land tax remitted.',
  ],
  s0347: [
    'On day gengyin, grain loans owed by the people under Jinan and other Shandong prefectures were remitted, as were back taxes for Dongping Prefecture and Dongping Garrison.',
    'On gengyin day, Jinan loan grain and Dongping arrears were forgiven.',
  ],
  s0348: [
    'Because Agui had requested a major campaign against Burma, he was sternly rebuked.',
    'Agui was rebuked for urging a large Burma expedition.',
  ],
  s0349: [
    'On day xinmao, wheat principal and silver owed by the people under six Jinan prefectures in Shandong were remitted.',
    'On xinmao day, wheat debts in six Jinan prefectures were forgiven.',
  ],
  s0350: [
    'Liu Lun was made Grand Secretary and concurrently supervised the Board of Works; Yu Minzhong assisted as Associate Grand Secretary.',
    'Liu Lun became grand secretary over Works; Yu Minzhong assisted.',
  ],
  s0351: [
    'Cheng Jingyi was transferred to Minister of Personnel; Fan Shishou to Minister of Punishments; Qiu Yuexiu to Minister of Works.',
    'Cheng Jingyi, Fan Shishou, and Qiu Yuexiu were shifted to Personnel, Punishments, and Works.',
  ],
  s0352: [
    'On day bingshen, the Emperor, accompanying the Empress Dowager, visited the Daiyue Temple and ascended Mount Tai.',
    'On bingshen day, the court visited Daiyue Temple and climbed Mount Tai.',
  ],
  s0353: [
    'On day yisi, the Emperor reached Qufu and visited the temple of Confucius.',
    'On yisi day, the Emperor visited Confucius\'s temple at Qufu.',
  ],
  s0354: [
    'On day bingwu, the Emperor performed the sacrifice to Confucius.',
    'On bingwu day, the Emperor offered sacrifice to Confucius.',
  ],
  s0355: [
    'On day dingwei, the Emperor visited the Kong family grove.',
    'On dingwei day, the Emperor visited the Kong grove.',
  ],
  s0356: [
    'Sacrifice was offered at the tomb of Shaohao and at the temple of the Primordial Sage Duke of Zhou.',
    'The court sacrificed at Shaohao\'s tomb and Duke of Zhou\'s temple.',
  ],
  s0357: [
    'Silver and coins were bestowed in graded amounts on the Duke of Yansheng Kong Zhaohuan and his clansmen.',
    'Kong Zhaohuan and his kin received graded gifts of silver and coins.',
  ],
  s0358: [
    'On day wushen, the Emperor, accompanying the Empress Dowager, returned from the tour.',
    'On wushen day, the court returned with the Empress Dowager.',
  ],
  s0359: [
    'On day yimao, graded commendations were granted to Grand Secretary Yin Jishan and others, Ministers Guanbao and others, governor-general Yang Tingzhang and others, and governors Zhong Yin and others.',
    'On yimao day, Yin Jishan, Guanbao, Yang Tingzhang, Zhong Yin, and others received graded rewards.',
  ],
  s0360: [
    'Cabinet Academician Lu Zongkai and others retired at their original rank.',
    'Lu Zongkai and other academicians retired in grade.',
  ],
  s0361: [
    'On day wuwu, Fuming\'an was made Fujian-Zhejiang governor-general; Zhou Yuanli was made Shandong governor.',
    'On wuwu day, Fuming\'an took Fujian-Zhejiang and Zhou Yuanli Shandong.',
  ],
  s0362: [
    'On day gengshen, because Gansu had suffered successive partial disasters in recent years, seed grain, ration grain, and granary stocks owed by the people throughout the province were remitted.',
    'On gengshen day, Gansu seed, ration, and granary debts were forgiven after repeated disasters.',
  ],
  s0363: [
    'On day jiazi, the Emperor reached Jiedi to inspect the dikes.',
    'On jiazi day, the Emperor inspected dikes at Jiedi.',
  ],
  s0364: [
    'On day yichou, Nasuntegusi was executed.',
    'On yichou day, Nasuntegusi was put to death.',
  ],
  s0365: [
    'On day jisi, because Agui had memorialized that a major Burma campaign was not appropriate this year, the matter was referred to the ministries for strict deliberation.',
    'On jisi day, Agui\'s plea against a Burma campaign this year was sent for strict review.',
  ],
  s0366: [
    'Fourth month, summer, new moon on day xinwei: Li Shiyao was made inner grandee.',
    'On the fourth-month new moon of xinwei, Li Shiyao became inner grandee.',
  ],
  s0367: [
    'On day jiaxu, Revenue Vice Minister Guilin was ordered to serve at the Grand Council.',
    'On jiaxu day, Guilin joined the Grand Council.',
  ],
  s0368: [
    'On day dingchou, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On dingchou day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0369: [
    'On day yiyou, because of drought the Board of Punishments was ordered to clear ordinary prisons and reduce punishments for exiles and below; Zhili was treated likewise.',
    'On yiyou day, drought led to prison reviews and sentence reductions in the capital and Zhili.',
  ],
  s0370: [
    'On day bingxu, the Emperor went to Black Dragon Pool to pray for rain.',
    'On bingxu day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0371: [
    'On day renchen, Grand Secretary Yin Jishan died.',
    'On renchen day, Yin Jishan died.',
  ],
  s0372: [
    'On day yiwei, Huang Xuan and one hundred sixty-one others were granted jinshi and other degrees with distinctions.',
    'On yiwei day, Huang Xuan and 161 others received jinshi and related degrees.',
  ],
  s0373: [
    'Fifth month, new moon on day xinchou: Wudashan was transferred to Shaanxi-Gansu governor-general; Wenshou acted in the post; Le\'erjin guarded Shaanxi as acting governor.',
    'On the fifth-month new moon of xinchou, Wudashan, Wenshou, and Le\'erjin were shifted in northwest posts.',
  ],
  s0374: [
    'Fuming\'an was transferred to Huguang governor-general; Yongde was made Hunan governor.',
    'Fuming\'an became Huguang governor-general and Yongde Hunan governor.',
  ],
  s0375: [
    'He Wei was made Henan governor and concurrently supervised river affairs; Zhong Yin was made Fujian-Zhejiang governor-general; Yu Wenyi was made Fujian governor.',
    'He Wei took Henan with river duties; Zhong Yin Fujian-Zhejiang; Yu Wenyi Fujian.',
  ],
  s0376: [
    'On day guimao, an order reduced punishments for those in autumn review whose sentences had been deferred three times.',
    'On guimao day, thrice-deferred autumn-review sentences were reduced.',
  ],
  s0377: [
    'On day jiachen, an edict ordered that when summary executions fell at a time for sparing punishments, execution was temporarily suspended; this was made a standing rule.',
    'On jiachen day, summary executions were to be paused during mercy seasons by standing rule.',
  ],
  s0378: [
    'On day yisi, Agui was stripped of office for timidity and reduced to soldier service.',
    'On yisi day, Agui lost rank for cowardice and served as a common soldier.',
  ],
  s0379: [
    'Wenfu was ordered to hurry to Yunnan to act as vice general.',
    'Wenfu was rushed to Yunnan as acting vice general.',
  ],
  s0380: [
    'On day renxu, Gao Jin was made Wenhua Hall Grand Secretary and concurrently Minister of Rites while remaining in the Jiangnan governor-general post.',
    'On renxu day, Gao Jin became Wenhua Grand Secretary over Rites and kept Jiangnan duties.',
  ],
  s0381: [
    'Aertai was summoned to serve in the Grand Secretariat; Defu was made Sichuan governor-general.',
    'Aertai entered the Grand Secretariat; Defu became Sichuan governor-general.',
  ],
  s0382: [
    'Sixth month, day xinwei: the Northern Grand Canal in Zhili burst its banks.',
    'In the sixth month, on xinwei, Zhili\'s Northern Grand Canal broke.',
  ],
  s0383: [
    'On day jiaxu, Nu San was made inner grandee of the Bordered Yellow Banner.',
    'On jiaxu day, Nu San became Bordered Yellow Banner inner grandee.',
  ],
  s0384: [
    'On day wuyin, Batu Jiergale was ordered to proceed to Ili to handle the submission of the Torghuts.',
    'On wuyin day, Batu Jiergale went to Ili for the Torghut submission.',
  ],
  s0385: [
    'On day jimao, an edict ordered that great taiji of the submitting Torghuts all come to the Mountain Resort for Avoiding Summer Heat for audience; imperial son-in-law Sebten Balzhur was ordered post-haste to welcome them.',
    'On jimao day, Torghut leaders were summoned to the Summer Resort and Sebten Balzhur sent to meet them.',
  ],
  s0386: [
    'On day renchen, retired Grand Secretary Chen Hongmou died.',
    'On renchen day, the retired Chen Hongmou died.',
  ],
  s0387: [
    'On day guisi, the Torghut tribes were ordered temporarily to camp at Boluobola.',
    'On guisi day, the Torghuts were lodged temporarily at Boluobola.',
  ],
  s0388: [
    'Because Jinchuan native clerk Suonuomu asked that the people of the Gexi Bushi native chieftain be rewarded, Aertai was ordered to weigh the occasion carefully and not show undue leniency.',
    'On Suonuomu\'s plea for Gexi Bushi rewards, Aertai was told to act firmly, not leniently.',
  ],
  s0389: [
    'Seventh month, autumn, day renyin: Aertai and others memorialized that Lesser Jinchuan native clerks were besieging Wokeshi; an order was issued to suppress them.',
    'On renyin in the seventh month, Aertai reported a Lesser Jinchuan siege of Wokeshi and suppression was ordered.',
  ],
  s0390: [
    'On day yisi, Vice Minister Guilin was ordered to take ten thousand taels of silver to Gubeikou to join Commissioner-in-Chief Wang Jintai in relieving flood victims.',
    'On yisi day, Guilin took ten thousand taels to Gubeikou with Wang Jintai for flood relief.',
  ],
  s0391: [
    'On day bingwu, the Yongding River burst its banks.',
    'On bingwu day, the Yongding River broke.',
  ],
  s0392: [
    'On day dingwei, Shuhede was ordered to act as Ili general.',
    'On dingwei day, Shuhede acted as Ili general.',
  ],
  s0393: [
    'On day wushen, the Emperor conducted the autumn hunt at Mulan.',
    'On wushen day, the Emperor hunted at Mulan.',
  ],
  s0394: [
    'Because Lesser Jinchuan again invaded the Mingzheng native chieftain, Aertai and others were instructed to advance in suppression.',
    'Lesser Jinchuan\'s renewed attack on Mingzheng led to orders for Aertai to suppress them.',
  ],
  s0395: [
    'On day dingsi, the Emperor, accompanying the Empress Dowager, set out on the return journey.',
    'On dingsi day, the court began returning with the Empress Dowager.',
  ],
  s0396: [
    'On day guihai, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On guihai day, the court lodged at the Summer Mountain Resort.',
  ],
  s0397: [
    'On day bingyin, on account of this tour to Mulan.',
    'On bingyin day, on account of the Mulan tour.',
  ],
  s0398: [
    'Military officials along the route had been negligent; Yang Tingzhang, Wang Jintai, and others were all referred to the ministries for strict deliberation.',
    'Negligent route officers including Yang Tingzhang and Wang Jintai were sent for strict review.',
  ],
  s0399: [
    'Eighth month, day jichou: Pacification Vice General of the Left Frontier and Khalkha Zhasak Heshuo Prince Chenggun Zhabu died; Chebudun Zhabu was made Pacification Vice General of the Left Frontier, and imperial son-in-law Lawang Duoerji succeeded as Zhasak Heshuo Prince.',
    'On jichou in the eighth month, Chenggun Zhabu died; Chebudun Zhabu and Lawang Duoerji received frontier and princely posts.',
  ],
  s0400: [
    'Defu was removed from service at the Grand Council.',
    'Defu left the Grand Council.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b04.mjs <translation.json>'
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
