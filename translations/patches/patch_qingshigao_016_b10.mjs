#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'Eleventh month, day xinwei: Jing\'an was made Minister of the Court of Colonial Affairs while also serving as Banner general of the Han Army.',
    'In the eleventh month, on xinwei day, Jing\'an became Colonial Affairs minister and Han Army banner general.',
  ],
  s0902: [
    'Twelfth month, day renzi: Tiebao was made Minister of Rites; Pan Shien Minister of Works.',
    'In the twelfth month, on renzi day, Tiebao took Rites and Pan Shien took Works.',
  ],
  s0903: [
    'On day jiayin, Xingzhao was made Jiangning general.',
    'On jiayin day, Xingzhao became Jiangning general.',
  ],
  s0904: [
    'That year, disaster tax, arrears tax, and banner rent were remitted in twenty-seven prefectures and counties of Zhili, Fengtian, Henan, Anhui, and other provinces; Taiwan Gamelan flood-damaged field tax was also remitted.',
    'That year, disaster and arrears taxes were forgiven in twenty-seven counties of Zhili, Fengtian, Henan, and Anhui, and Gamelan flood fields in Taiwan.',
  ],
  s0905: [
    'Korea and Siam sent tribute.',
    'Korea and Siam paid tribute.',
  ],
  s0906: [
    'Eighteenth year, spring, first month, day yihai: Grand Councilor Songyun was removed to serve as Grand Minister in attendance; Lebao was made Grand Councilor.',
    'In Jiaqing 18, on first-month yihai, Songyun left the Grand Council for attendance duty and Lebao joined it.',
  ],
  s0907: [
    'Second month, day gengzi: the Emperor held the Classics lecture.',
    'In the second month, on gengzi day, the Emperor lectured on the Classics.',
  ],
  s0908: [
    'Third month, day dingchou: the Emperor went to the Southern Park for the hunting encampment.',
    'In the third month, on dingchou day, the Emperor hunted at the Southern Park.',
  ],
  s0909: [
    'On day bingxu, the Emperor visited the Western Tombs.',
    'On bingxu day, the Emperor visited the Western Tombs.',
  ],
  s0910: [
    'On day bingshen, the Emperor returned to the capital.',
    'On bingshen day, the Emperor returned to Beijing.',
  ],
  s0911: [
    'Summer, fourth month, day jihai: Mingliang was made Mongol banner general.',
    'In the fourth month, on jihai day, Mingliang became Mongol banner general.',
  ],
  s0912: [
    'On day jiayin, the Emperor prayed for rain.',
    'On jiayin day, the Emperor prayed for rain.',
  ],
  s0913: [
    'On day guihai, Fujun was made Heilongjiang general.',
    'On guihai day, Fujun became Heilongjiang general.',
  ],
  s0914: [
    'Fifth month, day gengchen: the Emperor prayed for rain.',
    'In the fifth month, on gengchen day, the Emperor prayed for rain.',
  ],
  s0915: [
    'On day renchen, rain fell.',
    'On renchen day, it rained.',
  ],
  s0916: [
    'Sixth month, day yimao: licentiate book donor Bao Tingbo was granted juren status.',
    'In the sixth month, on yimao day, Bao Tingbo received juren for donating books.',
  ],
  s0917: [
    'On day gengshen, Songyun was made Ili general.',
    'On gengshen day, Songyun became Ili general.',
  ],
  s0918: [
    'Autumn, seventh month, day jiaxu: laws against trafficking opium were strictly enforced, and consumers were also punished.',
    'In the seventh month, on jiaxu day, opium trafficking was banned and users punished.',
  ],
  s0919: [
    'On day dingchou, Censor Feng Dazhong memorialized that civil and military officials at court and in the provinces were dilatory and slack in business, and asked that they be audited by imperial order; the Emperor approved.',
    'On dingchou day, Feng Dazhong urged auditing slack officials and the Emperor agreed.',
  ],
  s0920: [
    'On day renwu, the Emperor went on progress to Mulan.',
    'On renwu day, the Emperor went to Mulan.',
  ],
  s0921: [
    'Eighth month, day gengxu: the Emperor conducted the hunting encampment.',
    'In the eighth month, on gengxu day, the Emperor hunted.',
  ],
  s0922: [
    'Ninth month, day jiazi: because of continuous rain, the encampment hunt was reduced.',
    'On jiazi day, rain shortened the Mulan hunt.',
  ],
  s0923: [
    'On day guiyou, the Emperor returned from progress.',
    'On guiyou day, the Emperor returned from Mulan.',
  ],
  s0924: [
    'On day yihai, the river overflowed at Suizhou in Henan.',
    'On yihai day, the Suizhou river burst its banks in Henan.',
  ],
  s0925: [
    'In Huaxian, Henan, Eight Trigrams sect bandit Li Wencheng gathered followers to plot rebellion; Magistrate Qiang Kejie arrested and imprisoned them.',
    'At Huaxian, Li Wencheng\'s Eight Trigrams plot was uncovered and Magistrate Qiang Kejie jailed the ringleaders.',
  ],
  s0926: [
    'His partisans Feng Keshan and Niu Liangchen seized the county seat and Kejie died.',
    'Feng Keshan and Niu Liangchen took the city and killed Kejie.',
  ],
  s0927: [
    'Bandit factions in Changyuan, Zhili, and Caoxian, Shandong, all rose in response.',
    'Rebels in Changyuan, Zhili, and Caoxian, Shandong, joined the uprising.',
  ],
  s0928: [
    'The Emperor ordered Gao Qi and Tongxing to block them, and Wen Chenghui, wearing the seal of Imperial Commissioner, to suppress them.',
    'Gao Qi and Tongxing were sent to hold the rebels while Wen Chenghui was commissioned to suppress them.',
  ],
  s0929: [
    'Yang Yuchun was summoned to command troops north.',
    'Yang Yuchun was called north with an army.',
  ],
  s0930: [
    'Bandit partisan Xu Angui seized Changyuan and killed Magistrate Zhao Lun.',
    'Xu Angui took Changyuan and killed Magistrate Zhao Lun.',
  ],
  s0931: [
    'Jinxiang Magistrate Wu Jie arrested the bandits Cui Shijun and others.',
    'Wu Jie of Jinxiang captured Cui Shijun and other rebels.',
  ],
  s0932: [
    'On day wuyin, the Emperor halted at Mount Senji.',
    'On wuyin day, the Emperor stopped at Mount Senji.',
  ],
  s0933: [
    'That day, several dozen villains led by Chen Shuang suddenly entered the Forbidden City and were about to force the inner palace; the second imperial son shot one dead with a musket.',
    'That day, Chen Shuang and dozens stormed the Forbidden City; the second imperial son shot one dead.',
  ],
  s0934: [
    'One bandit climbed the wall of the Moon Splendor Gate and waved a banner to direct them; the second imperial son shot him down with another shot, and Prince Mianzhi killed another.',
    'A rebel on the Moon Splendor Gate wall was shot down by the second son; Prince Mianzhi killed another.',
  ],
  s0935: [
    'Wang Dachen led Brave and Sharp and Firearms camp troops inside and captured and executed them all.',
    'Wang Dachen\'s troops entered and killed or captured all the intruders.',
  ],
  s0936: [
    'On day jimao, an edict enfeoffed the second imperial son as Prince Zhi and granted Mianzhi the rank of prince of the second degree.',
    'On jimao day, the second son became Prince Zhi and Mianzhi received a prince\'s rank.',
  ],
  s0937: [
    'Merit in capturing the bandits was discussed and rewards were granted by rank.',
    'Capture merits were graded and rewarded.',
  ],
  s0938: [
    'Ji Lun was stripped of office; Yinghe was made metropolitan commandant of the Gendarmerie.',
    'Ji Lun was dismissed and Yinghe became metropolitan gendarmerie commandant.',
  ],
  s0939: [
    'On day gengchen, an edict said: "We have received the great succession and dare not be idle, nor dare do things that oppress the people.',
    'On gengchen day, an edict declared: "Having received the throne, We dare not be idle or oppress the people.',
  ],
  s0940: [
    'After the Sichuan-Huguang sect bandits were pacified, We looked to share lasting peace with Our people; yet on the fifteenth of last ninth month there was this extraordinary event within the palace.',
    'After the Sichuan-Huguang rebels were crushed, We hoped for peace; yet on the fifteenth of last ninth month the palace was struck by an unheard-of assault.',
  ],
  s0941: [
    'What Han, Tang, Song, and Ming never knew—We are truly ashamed.',
    'Nothing like it had occurred since Han, Tang, Song, and Ming, and We are ashamed.',
  ],
  s0942: [
    'Yet though the change came in a morning, the calamity had long been gathering.',
    'Though sudden, the disaster had deep roots.',
  ],
  s0943: [
    'Today\'s great evil lies solely in routine delay and slackness.',
    'The grave evil of the age is procrastination and neglect.',
  ],
  s0944: [
    'Though We have admonished again and again until tongues are worn and brushes worn out, it is still not enough to move Our ministers to listen; We can only turn inward and examine Ourselves.',
    'Repeated admonitions have failed to stir the ministers; We can only examine Ourselves.',
  ],
  s0945: [
    'You ministers are by nature loyal and good; exert your utmost strength, correct Our faults, and set right the people\'s will—do not as before hold empty posts and add to Our errors.',
    'Ministers are loyal at heart: correct Our faults and the people\'s will, and do not hold empty posts that deepen Our guilt.',
  ],
  s0946: [
    'Let this be proclaimed throughout."',
    'Let all know this."',
  ],
  s0947: [
    'Nayancheng was ordered Imperial Commissioner to suppress bandits in Henan.',
    'Nayancheng was sent as Imperial Commissioner to suppress Henan rebels.',
  ],
  s0948: [
    'Regional commander Yang Yuchun, vice banner general Fusengde, and regional commander Yang Fang were ordered to bring troops in joint suppression.',
    'Yang Yuchun, Fusengde, and Yang Fang were ordered to join the campaign.',
  ],
  s0949: [
    'On day xinsi, chief rebel Lin Qing was captured.',
    'On xinsi day, Lin Qing was taken.',
  ],
  s0950: [
    'On day renwu, the Emperor returned to the capital.',
    'On renwu day, the Emperor returned to Beijing.',
  ],
  s0951: [
    'On day guimao, Songyun and Cao Zhenyong were made Grand Secretaries; Tuojin and Bai Ling Associate Grand Secretaries; Tiebao and Zhang Xu Ministers of Personnel.',
    'On guimao day, Songyun and Cao Zhenyong entered the Grand Secretariat; Tuojin and Bai Ling as associates; Tiebao and Zhang Xu took Personnel.',
  ],
  s0952: [
    'On day bingxu, chief rebel Lin Qing and collaborating eunuch Liu Jinheng and others were executed.',
    'On bingxu day, Lin Qing, Liu Jinheng, and other collaborators were executed.',
  ],
  s0953: [
    'Winter, tenth month, day bingshen: Zu Zhiwang was removed; Han Fang was made Minister of Punishments.',
    'In the tenth month, on bingshen day, Zu Zhiwang was dismissed and Han Fang took Punishments.',
  ],
  s0954: [
    'On day guimao, Shandong salt transport commissioner Liu Qing greatly defeated bandits at Hujiaji; guardsman Su Erzhen recovered Dingtao and Caoxian.',
    'On guimao day, Liu Qing routed rebels at Hujiaji and Su Erzhen retook Dingtao and Caoxian.',
  ],
  s0955: [
    'Censor Zhang Pengzhan memorialized that common people dared not report heterodox bandits because local officials, fearing disciplinary action, would not accept reports or would instead punish accusers with false charges.',
    'Zhang Pengzhan said locals feared reporting sect bandits because officials punished accusers instead.',
  ],
  s0956: [
    'The Emperor approved.',
    'The Emperor agreed.',
  ],
  s0957: [
    'On day jiyou, Nayancheng memorialized that troops were being assembled on all routes before advancing to suppress.',
    'On jiyou day, Nayancheng reported gathering troops before attacking.',
  ],
  s0958: [
    'The Emperor sternly rebuked him.',
    'The Emperor rebuked him sharply.',
  ],
  s0959: [
    'On day jiayin, Tuojin was ordered to supervise Henan military affairs; Guifang entered the Grand Council.',
    'On jiayin day, Tuojin supervised Henan and Guifang joined the Grand Council.',
  ],
  s0960: [
    'On day dingsi, hereditary offices were granted to guardsman Nalun and others who died resisting bandits in the Forbidden City.',
    'On dingsi day, hereditary ranks were granted to Nalun and others killed defending the palace.',
  ],
  s0961: [
    'On day jiwei, Lu Kang and Yurui failed to detect subordinates\' rebellion and were sent to confinement at Mukden.',
    'On jiwei day, Lu Kang and Yurui were confined at Mukden for failing to detect subordinates\' treason.',
  ],
  s0962: [
    'On day xinyou, censors of Han Army and Zhili banner registration were demoted.',
    'On xinyou day, Han Army and Zhili banner censors were demoted.',
  ],
  s0963: [
    'On day renxu, Mingliang was made Minister of War.',
    'On renxu day, Mingliang became Minister of War.',
  ],
  s0964: [
    'Eleventh month, new moon on day jiazi: Nayancheng memorialized that the bandit nest at Daokou was taken and Huacheng besieged.',
    'On the eleventh-month new moon, jiazi, Nayancheng reported taking Daokou and besieging Huacheng.',
  ],
  s0965: [
    'On day bingyin, public-penalty statutes were ordered revised and reduced.',
    'On bingyin day, public-penalty statutes were ordered cut back.',
  ],
  s0966: [
    'On day renshen, collaborating metropolitan garrison commander Cao Lun was executed.',
    'On renshen day, collaborator Cao Lun was executed.',
  ],
  s0967: [
    'On day wuzi, Nayancheng memorialized that Yang Fang and others took the bandit stronghold at Mount Sizhai and killed chief culprit Li Wencheng.',
    'On wuzi day, Nayancheng reported Yang Fang took Sizhai and killed Li Wencheng.',
  ],
  s0968: [
    'Twelfth month, day bingshen: Songyun and Chang Ling were ordered to plan Xinjiang expenses.',
    'In the twelfth month, on bingshen day, Songyun and Chang Ling were told to plan Xinjiang funding.',
  ],
  s0969: [
    'On day bingwu, Nayancheng memorialized that Huacheng was taken; bandit chiefs Song Yuancheng and others were executed, and Niu Liangchen and others captured alive.',
    'On bingwu day, Nayancheng reported Huacheng fell; Song Yuancheng was executed and Niu Liangchen captured.',
  ],
  s0970: [
    'Nayancheng was granted third-rank baron; Yang Yuchun and others were rewarded in descending order.',
    'Nayancheng received a third-rank baronage and Yang Yuchun and others were rewarded.',
  ],
  s0971: [
    'Tuojin was ordered to remain and handle Changyuan bandits.',
    'Tuojin was left to deal with Changyuan rebels.',
  ],
  s0972: [
    'That year, disaster tax was remitted in twenty-six prefectures and counties of Zhili, Henan, Hunan, and other provinces.',
    'That year, disaster tax was forgiven in twenty-six counties of Zhili, Henan, and Hunan.',
  ],
  s0973: [
    'Abandoned-field tax was remitted in Jiangsu, Henan, and Hunan.',
    'Abandoned-field tax was forgiven in Jiangsu, Henan, and Hunan.',
  ],
  s0974: [
    'Korea, Ryukyu, Vietnam, and Siam sent tribute.',
    'Korea, Ryukyu, Vietnam, and Siam paid tribute.',
  ],
  s0975: [
    'Nineteenth year, spring, first month, day renwu: Wu Jun was made Hedong river-course governor-general.',
    'In Jiaqing 19, on first-month renwu, Wu Jun became Hedong river-course governor-general.',
  ],
  s0976: [
    'Second month, day jiawu: the Emperor held the Classics lecture.',
    'In the second month, on jiawu day, the Emperor lectured on the Classics.',
  ],
  s0977: [
    'On day yiwei, Jinchang was made Mukden general.',
    'On yiwei day, Jinchang became Mukden general.',
  ],
  s0978: [
    'On day renyin, Sichuan General Saichong\'a, for suppressing Shaanxi bandit Miao Xiaoyi and others, was granted third-rank baron; Chang Ling light chariot commandant; Yang Yuchun promoted to first-rank baron.',
    'On renyin day, Saichong\'a received a third-rank baronage for Shaanxi bandits; Chang Ling kept light-chariot rank; Yang Yuchun rose to first-rank baron.',
  ],
  s0979: [
    'On day renzi, Fujun was made Jilin general; Te Yishunbao Heilongjiang general.',
    'On renzi day, Fujun took Jilin and Te Yishunbao took Heilongjiang.',
  ],
  s0980: [
    'On day bingchen, Tiebao was removed; Yinghe was made Minister of Personnel; Yishao Han Army banner general.',
    'On bingchen day, Tiebao was dismissed; Yinghe took Personnel and Yishao the Han Army banner.',
  ],
  s0981: [
    'Dai Junyuan was made Left Censor-in-Chief.',
    'Dai Junyuan became left censor-in-chief.',
  ],
  s0982: [
    'Intercalary second month, day jiazi: Hening was made Minister of Rites.',
    'In the intercalary second month, on jiazi day, Hening became Minister of Rites.',
  ],
  s0983: [
    'On day jichou, hereditary offices were granted to Huaxian Magistrate Qiang Kejie, Instructor Lu Bingjun, Subprefectural Inspector Liu Bin, and others who died in service.',
    'On jichou day, hereditary ranks were granted to Qiang Kejie, Lu Bingjun, Liu Bin, and other officials killed in duty.',
  ],
  s0984: [
    'Fourth month, day yihai: the Emperor reviewed Brave and Sharp camp troops.',
    'In the fourth month, on yihai day, the Emperor reviewed Brave and Sharp troops.',
  ],
  s0985: [
    'Prince Yu Feng of the Prince Yu line failed to detect that his dependent Zhu Xian had joined the sect and, though the plot was discovered, did not memorialize; his title was stripped.',
    'Prince Yu Feng lost his title for concealing Zhu Xian\'s sect membership and failing to report the plot.',
  ],
  s0986: [
    'His younger brother Yu Xing inherited the enfeoffment.',
    'His brother Yu Xing inherited the princedom.',
  ],
  s0987: [
    'Xingzhao was made Han Army banner general.',
    'Xingzhao became Han Army banner general.',
  ],
  s0988: [
    'On day renwu, Grain Transport governor-general Guifang died.',
    'On renwu day, Guifang, grain transport governor-general, died.',
  ],
  s0989: [
    'On day bingxu, Long Ruyan and two hundred twenty-six others received jinshi degrees with differentiated ranks.',
    'On bingxu day, Long Ruyan and 226 others received jinshi degrees.',
  ],
  s0990: [
    'Fifth month, day guihai: Hening was made Rehe commandant.',
    'In the fifth month, on guihai day, Hening became Rehe commandant.',
  ],
  s0991: [
    'Sixth month, new moon on day gengshen: there was a solar eclipse.',
    'On the sixth-month new moon, gengshen, there was an eclipse.',
  ],
  s0992: [
    'On day gengchen, Liu Huangzhi was made Minister of Revenue; Chu Pengling Minister of War, acting Jiangsu governor.',
    'On gengchen day, Liu Huangzhi took Revenue, Chu Pengling War while acting as Jiangsu governor.',
  ],
  s0993: [
    'He acted as Jiangsu governor.',
    'Chu Pengling acted as Jiangsu governor.',
  ],
  s0994: [
    'Eighth month, day jiazi: the Emperor held the Classics lecture.',
    'In the eighth month, on jiazi day, the Emperor lectured on the Classics.',
  ],
  s0995: [
    'On day xinwei, Grand Secretary and Duke of Weiqin Lebao again begged to retire; this was granted, and he was ordered to receive a duke\'s stipend.',
    'On xinwei day, Lebao was allowed to retire on a duke\'s stipend.',
  ],
  s0996: [
    'Tuojin was made Grand Secretary; Mingliang Associate Grand Secretary.',
    'Tuojin entered the Grand Secretariat and Mingliang became associate.',
  ],
  s0997: [
    'On day wuyin, the Emperor visited the tombs.',
    'On wuyin day, the Emperor visited the tombs.',
  ],
  s0998: [
    'On day jiashen, the Emperor returned to the capital.',
    'On jiashen day, the Emperor returned to Beijing.',
  ],
  s0999: [
    'Ninth month, day yiwei: Jing\'an was made Minister of Revenue.',
    'In the ninth month, on yiwei day, Jing\'an became Minister of Revenue.',
  ],
  s1000: [
    'Winter, tenth month, day yichou: Qing Pu was made Left Censor-in-Chief.',
    'In the tenth month, on yichou day, Qing Pu became left censor-in-chief.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b10.mjs <translation.json>'
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
