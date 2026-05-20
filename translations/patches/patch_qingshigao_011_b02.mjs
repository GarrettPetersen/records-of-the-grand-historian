#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day renshen, the Emperor reviewed troops and granted silver and silks in varying amounts.',
    'On renshen day the Emperor inspected the troops and gave graded rewards of silver and coin.',
  ],
  s0102: [
    'On day jiaxu, because Zhang Guangsi had uncovered and seized the rebel criminals the Wei clan\'s lady and Liu Qi and others, rewards of rank were granted.',
    'On jiaxu day Zhang Guangsi was rewarded for uncovering rebels including Lady Wei and Liu Qi.',
  ],
  s0103: [
    'It was fixed to add the military intendant title to the Shanxi Guihua and Suiyuan circuit and to inspect the Jingyuan garrison.',
    'The Shanxi Guisui circuit was given a military intendant\'s title to supervise the Jingyuan garrison.',
  ],
  s0104: [
    'On day wuyin, the Emperor escorted the Empress Dowager back to the capital.',
    'On wuyin day the Emperor brought the Empress Dowager back to Beijing.',
  ],
  s0105: [
    'Kaitai was transferred to Jiangxi governor; Chen Hongmou to Hubei governor.',
    'Kaitai became Jiangxi governor and Chen Hongmou Hubei governor.',
  ],
  s0106: [
    'On day gengchen, Zhang Tingyu was excused from leading presentation audiences, and he was also instructed that he need not come to court early and must not force himself to enter the Inner Palaces.',
    'On gengchen day Zhang Tingyu was relieved of leading memorial audiences and told not to strain himself with early attendance.',
  ],
  s0107: [
    'On day renwu, Wang Youdun was ordered to serve at the Grand Council.',
    'On renwu day Wang Youdun joined Grand Council duty.',
  ],
  s0108: [
    'On day guimao, Censor Wan Nianmao, for impeaching Academicians Chen Bangyan and others of fawning on Fu Heng on false grounds, was stripped of office.',
    'On guimao day Censor Wan Nianmao was dismissed for falsely accusing Chen Bangyan and others of currying favor with Fu Heng.',
  ],
  s0109: [
    'On day wuzi, quota taxes were remitted for twenty-three prefectures and counties of Anhui including Shouzhou that had suffered flood.',
    'On wuzi day quota tax was forgiven for twenty-three flood-stricken Anhui counties including Shouzhou.',
  ],
  s0110: [
    'On day xinmao, more than 2.2 million taels of silver and piculs of grain were allocated for relief of disaster victims in Jiangsu\'s Huai, Yang, Xu, and Hai districts and subordinates.',
    'On xinmao day over 2.2 million taels and piculs were set aside for flood victims in northern Jiangsu.',
  ],
  s0111: [
    'Eleventh month, day guisi: the order to screen censors and supervising secretaries was withdrawn.',
    'In the eleventh month, on guisi day, the order to vet censors was dropped.',
  ],
  s0112: [
    'Censor Li Zhaoyu was referred to the ministry for deliberation and punishment.',
    'Censor Li Zhaoyu was sent down for disciplinary action.',
  ],
  s0113: [
    'On day yiwei, because Henan education intendant Wang Shirui had shown favoritism in examinations, he was stripped of office.',
    'On yiwei day Henan examiner Wang Shirui lost his post for exam favoritism.',
  ],
  s0114: [
    'Quota taxes were remitted for twenty-four prefectures, counties, and garrisons of Jiangsu including Shanyang that had suffered flood, and canal grain levies were forgiven or deferred in varying degrees.',
    'Jiangsu flood counties including Shanyang were exempted from quota tax, with canal grain remitted or deferred as suited each case.',
  ],
  s0115: [
    'On day yisi, land taxes on washed-away fields in two counties of Fengtian including Jin were remitted.',
    'On yisi day land tax was cancelled for two Fengtian counties whose fields had been washed out.',
  ],
  s0116: [
    'On day jiyou, funeral funds were granted to the late Grand Secretariat academician Zhang Ruai, and Zhang Tingyu was instructed to moderate his grief and care for himself.',
    'On jiyou day funds were granted for the late Zhang Ruai\'s funeral, and Zhang Tingyu was urged to restrain his mourning.',
  ],
  s0117: [
    'On day xinhai, Li Zhicui was sent to the front to redeem himself through service.',
    'On xinhai day Li Zhicui was dispatched to army duty at the front.',
  ],
  s0118: [
    'On day wuwu, Qing Fu reported that the Greater Jinchuan chieftain Sarob Dpon was harassing Lesser Jinchuan, and that if he did not submit to the partition judgment, only Tibetan forces could be used to achieve success.',
    'On wuwu day Qing Fu reported Sarob Dpon of Greater Jinchuan raiding Lesser Jinchuan and said that if he refused partition, only tribal levies could finish the job.',
  ],
  s0119: [
    'The Emperor approved this.',
    'The Emperor agreed.',
  ],
  s0120: [
    'Twelfth month, day guihai: Bandi was summoned to the capital; Tao Zhengzhong was ordered acting Shanxi governor.',
    'In the twelfth month, on guihai day, Bandi was recalled to Beijing and Tao Zhengzhong acted at Shanxi.',
  ],
  s0121: [
    'On day jiazi, flood victims in seven prefectures, counties, and garrisons of Hubei including Qianjiang were relieved.',
    'On jiazi day flood relief was sent to seven Hubei districts including Qianjiang.',
  ],
  s0122: [
    'On day yichou, because Fu Qing reported that lamas attending the Dalai Lama had restrained the regent lama who was suppressing the prince of the commandery Polhané, an edict in the Emperor\'s own hand was sent to console and release him, and he was also instructed to work in concert with the Dalai Lama to secure the region.',
    'On yichou day, after Fu Qing reported lamas from the Dalai Lama\'s entourage restraining Polhané\'s regent, Hongli sent a personal edict to reassure him and urged cooperation with the Dalai Lama to keep Tibet quiet.',
  ],
  s0123: [
    'On day wuchen, Hubao was made garrison commander at Hami.',
    'On wuchen day Hubao became garrison commander at Hami.',
  ],
  s0124: [
    'On day jiaxu, quota taxes for insect damage in Zhili\'s Jinghai were remitted, and relief was also given.',
    'On jiaxu day Jinghai\'s insect-damaged quota tax was forgiven and relief was ordered.',
  ],
  s0125: [
    'On day dingchou, because Zhang Tingyu was aged, his son the metropolitan graduate Zhang Ruocheng was ordered to serve in the Southern Studios so that he might assist him.',
    'On dingchou day Zhang Ruocheng joined the Southern Studios to assist his aged father Zhang Tingyu.',
  ],
  s0126: [
    'On day wuyin, drought victims in Gansu prefectures and counties including Anding were relieved.',
    'On wuyin day drought relief was sent to Anding and other Gansu counties.',
  ],
  s0127: [
    'Quota taxes were remitted for eight prefectures and counties of Shandong including Jinxiang that had suffered flood.',
    'Eight Shandong flood counties including Jinxiang were exempted from quota tax.',
  ],
  s0128: [
    'On day gengchen, land taxes on flood-washed fields in Guangxi\'s Yongfu were remitted.',
    'On gengchen day Yongfu\'s washed-out fields were exempted from land tax.',
  ],
  s0129: [
    'On day guimao, the Dzungar taiji Tsewang Dorji Namjal sent envoys including Mamud to audience; they were received at the Hall of Supreme Harmony.',
    'On guimao day Dzungar taiji Tsewang Dorji Namjal\'s envoys including Mamud were received at Taihe Studio.',
  ],
  s0130: [
    'On day jichou, disaster in the Sonid and Abag banners was relieved.',
    'On jichou day relief was sent to the Sonid and Abag banners.',
  ],
  s0131: [
    'Chen Dashou reported that the Sulu state had sent a frontier official bearing thanks-and-grace memorials in both Tibetan and Chinese script, which did not accord with precedent; they were declined, yet the frontier official was still generously rewarded and sent home.',
    'Chen Dashou reported Sulu\'s envoy brought thanks memorials in Tibetan and Chinese that broke precedent; they were refused but the envoy was generously rewarded and sent home.',
  ],
  s0132: [
    'The Emperor praised this as proper conduct.',
    'Hongli praised the handling as proper.',
  ],
  s0133: [
    'Twelfth year, spring, first month, day renchen: Yubao was ordered to manage Dzungar envoys\' affairs on proceeding to Tibet.',
    'In Qianlong 12, first month, on renchen day, Yubao was put in charge of Dzungar envoys bound for Tibet.',
  ],
  s0134: [
    'On day jiawu, three-tenths of the grain tax in kind levied in six prefectures and eight departments of Shanxi including Taiyuan and at Guihua City was remitted; the two prefectures of Datong and Shuoping were wholly forgiven.',
    'On jiawu day Shanxi grain taxes were cut by thirty percent in six prefectures and eight departments; Datong and Shuoping were wholly exempted.',
  ],
  s0135: [
    'On day yiwei, Mamud was given a banquet at the Fengze Garden.',
    'On yiwei day Mamud was feasted at Fengze Garden.',
  ],
  s0136: [
    'On day wuxu, old arrears of the people and salt producers in three prefectures and counties of Jiangsu including Haizhou and six salt fields including Banpu were remitted.',
    'On wuxu day old arrears were forgiven for Haizhou and other Jiangsu districts and six salt fields.',
  ],
  s0137: [
    'On day dingwei, famine in thirteen prefectures and counties of Shandong including Shouguang was relieved.',
    'On dingwei day famine relief was sent to Shouguang and twelve other Shandong counties.',
  ],
  s0138: [
    'On day yimao, an imperial letter was granted to the Dzungar taiji Tsewang Dorji Namjal, permitting the Tibet-bound monks he had sent to winter at Khajir Debtir and to trade.',
    'On yimao day the Dzungar taiji was allowed to let his Tibet-bound monks winter at Khajir Debtir and trade.',
  ],
  s0139: [
    'Second month, first day of the month on day xinyou: rent grain due from Jilin for the previous year\'s drought was remitted.',
    'On the second-month new moon, xinyou day, Jilin\'s drought-year rent grain was forgiven.',
  ],
  s0140: [
    'On day renshen, the Emperor visited the Zhaoxi, Xiaoling, Xiaodongling, and Jingling mausoleums.',
    'On renshen day the Emperor paid rites at the Zhaoxi, Xiaoling, Xiaodongling, and Jing tombs.',
  ],
  s0141: [
    'Ji Shan reported that the Greater Jinchuan chieftain had encroached on the Gurbushi chief\'s domain and by deception seized the Lesser Jinchuan chieftain Tsewang\'s seal.',
    'Ji Shan reported Greater Jinchuan had seized Gurbushi territory and tricked away Lesser Jinchuan chief Tsewang\'s seal.',
  ],
  s0142: [
    'An edict admonished them to strengthen defense and not act rashly.',
    'They were ordered to shore up defenses and not move rashly.',
  ],
  s0143: [
    'On day jiaxu, the Emperor visited Mount Pan.',
    'On jiaxu day the Emperor went to Mount Pan.',
  ],
  s0144: [
    'On day gengchen, famine in Shandong\'s Lanshan was relieved.',
    'On gengchen day famine relief was sent to Lanshan in Shandong.',
  ],
  s0145: [
    'On day renwu, land taxes on washed-away garrison fields in Henan\'s Meng county were remitted.',
    'On renwu day Meng county\'s washed-out garrison land was exempted from tax.',
  ],
  s0146: [
    'On day guimao, the Emperor returned to the capital.',
    'On guimao day the Emperor returned to Beijing.',
  ],
  s0147: [
    'On day wuzi, the former Minister of the Imperial Household Ding Zaobao, having reached one hundred years of age, was granted an imperial inscription plaque, court robes, and silks.',
    'On wuzi day the centenarian former Household Minister Ding Zaobao received an imperial plaque, court dress, and silks.',
  ],
  s0148: [
    'Quota taxes were remitted for Zaoyang in Hubei for the previous year\'s flood.',
    'Zaoyang\'s flood-year quota tax was forgiven.',
  ],
  s0149: [
    'Third month: quota taxes were remitted for two counties of Shanxi including Yangqu for the previous year\'s flood.',
    'In the third month Yangqu and one other Shanxi county were exempted from last year\'s flood quota tax.',
  ],
  s0150: [
    'On day xinchou, Qing Fu was summoned to serve in the Grand Secretariat; Zhang Guangsi was transferred to Sichuan-Shaanxi governor-general.',
    'On xinchou day Qing Fu entered the Grand Secretariat and Zhang Guangsi became Sichuan-Shaanxi governor-general.',
  ],
  s0151: [
    'The Yunnan-Guizhou governor-generalship was re-established; Zhang Yunsui was appointed.',
    'The Yunnan-Guizhou governor-general post was restored under Zhang Yunsui.',
  ],
  s0152: [
    'Tuerbinga was made Yunnan governor; Sun Shaowu Guizhou governor.',
    'Tuerbinga became Yunnan governor and Sun Shaowu Guizhou governor.',
  ],
  s0153: [
    'Flood victims in Henan were relieved.',
    'Henan flood victims received relief.',
  ],
  s0154: [
    'Because the Greater Jinchuan chieftain had plundered the Gurbushi, Mingzheng, and other chiefs and disturbed garrison districts, Qing Fu was ordered to remain in Sichuan to consult with Zhang Guangsi on advancing suppression, and Zhang Guangsi was also charged to pacify the Golok, Ququwu, Derge, and Batang tribes.',
    'With Greater Jinchuan raiding neighboring chiefs and garrisons, Qing Fu stayed in Sichuan to plan the campaign with Zhang Guangsi, who was also told to pacify Golok, Ququwu, Derge, and Batang.',
  ],
  s0155: [
    'Quota taxes were remitted for four prefectures and subordinates of Jiangsu including Huai\'an for the previous year\'s flood.',
    'Huai\'an and three other Jiangsu prefectures were exempted from last year\'s flood quota tax.',
  ],
  s0156: [
    'Grand Secretary Cha Lang\'a asked to retire; permission was granted.',
    'Cha Lang\'a retired with approval.',
  ],
  s0157: [
    'On day yisi, the Tibetan prince of the commandery Polhané died; Dondrup Namjal was invested as prince of the commandery in succession.',
    'On yisi day Polhané died and Dondrup Namjal succeeded as prince of the commandery.',
  ],
  s0158: [
    'On day bingwu, Gao Bin was made Grand Secretary of the Hall of Literary Profundity; Laibao Minister of Personnel.',
    'On bingwu day Gao Bin joined the Grand Secretariat and Laibao became Minister of Personnel.',
  ],
  s0159: [
    'Haiwang was transferred to Minister of Rites; Fu Heng to Minister of Revenue.',
    'Haiwang took Rites and Fu Heng Revenue.',
  ],
  s0160: [
    'Suobai was ordered garrisoned in Tibet to manage affairs jointly with Fu Qing.',
    'Suobai was posted to Tibet to work with Fu Qing.',
  ],
  s0161: [
    'Quota taxes were remitted for twenty-three prefectures, counties, and garrisons of Anhui including Shouzhou for the previous year\'s flood.',
    'Twenty-three Anhui districts including Shouzhou were exempted from last year\'s flood quota tax.',
  ],
  s0162: [
    'On day dingwei, Vice Commander-in-chief Luo Shan was ordered, retaining his former rank, to manage the Altai relay stations and to consult on the Shangdu Dabusun Nor horse pastures.',
    'On dingwei day Luo Shan, keeping his former rank, took charge of Altai relay stations and the Dabusun Nor pastures.',
  ],
  s0163: [
    'On day jiyou, Zhang Guangsi was ordered to advance and suppress the Greater Jinchuan chieftain Sarob Dpon.',
    'On jiyou day Zhang Guangsi was ordered to attack Sarob Dpon of Greater Jinchuan.',
  ],
  s0164: [
    'Western Route army camp participating minister Bao De\'s term expired; Nalantai replaced him.',
    'Bao De finished his term as Western Route participating minister; Nalantai replaced him.',
  ],
  s0165: [
    'On day gengxu, quota taxes were remitted for fourteen prefectures, counties, and garrisons of Zhili including Jizhou for the previous year\'s flood.',
    'On gengxu day fourteen Zhili districts including Jizhou were exempted from last year\'s flood quota tax.',
  ],
  s0166: [
    'On day wuchen, Gao Bin was ordered to proceed to Jiangnan to join Zhou Xuejian in surveying river works and in clearing accumulated abuses in grain and funds.',
    'On wuchen day Gao Bin went south to join Zhou Xuejian on river surveys and to clean up grain abuses.',
  ],
  s0167: [
    'On day jisi, Nasutu was made acting Zhili canal governor-general.',
    'On jisi day Nasutu became acting Zhili canal governor-general.',
  ],
  s0168: [
    'On day renwu, the imperial commissioner\'s seal of office was given to Neqin, who was ordered to proceed to Shanxi to join Aibida in trying the cases of mob violence in two counties including Anyi.',
    'On renwu day Neqin received an imperial commission to join Aibida in trying mob cases in Anyi and another Shanxi county.',
  ],
  s0169: [
    'On day jiashen, Yalitu was summoned back to the capital.',
    'On jiashen day Yalitu was recalled to Beijing.',
  ],
  s0170: [
    'Fifth month, day xinmao: Zhuntai was summoned to the capital; Celeng was ordered concurrently to manage Guangdong governor affairs.',
    'In the fifth month, on xinmao day, Zhuntai was recalled and Celeng acted at Guangdong.',
  ],
  s0171: [
    'On day bingshen, famine in two counties of Shandong including Anqiu was relieved.',
    'On bingshen day famine relief was sent to Anqiu and one other Shandong county.',
  ],
  s0172: [
    'On day jiachen, sacrifice was offered to Earth at the Square Mound; because of drought the full guard of honor was withheld.',
    'On jiachen day Earth was sacrificed at the Square Mound with a reduced guard because of drought.',
  ],
  s0173: [
    'On day yisi, the Board of Punishments was ordered to clear accumulated cases and reduce punishments below exile.',
    'On yisi day the Ministry of Justice was told to clear backlog cases and commute punishments below exile.',
  ],
  s0174: [
    'On day jiyou, the Emperor went to Black Dragon Pool to pray for rain.',
    'On jiyou day the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0175: [
    'On day xinhai, Aibida was dismissed; Zhuntai was transferred to Shanxi governor.',
    'On xinhai day Aibida left office and Zhuntai became Shanxi governor.',
  ],
  s0176: [
    'On day renzi, because cases in Fujian, Shandong, Jiangnan, Guangdong, and Shanxi had repeatedly arisen of the people coercing officials, an edict said: "When obstinate commoners gather in mobs and violate the penal code, we cannot but take the fault upon ourselves.',
    'On renzi day, with mob cases against officials recurring in five provinces, Hongli said in an edict that when obstinate crowds broke the law, he must blame himself.',
  ],
  s0177: [
    'Let each governor and governor-general earnestly instruct and transform them, so that foolish people may know to revere officials and obey teaching and orders.',
    'Governors were to teach the people to fear officials and obey the law.',
  ],
  s0178: [
    '"" (closing quotation mark in the source.)',
    'The edict closed there.',
  ],
  s0179: [
    'Sixth month, first day of the month on day gengshen: an edict announced that in the coming spring the Empress Dowager would be escorted on an eastern tour to offer sacrifice at Confucius\'s grove in person, and each yamen was ordered to prepare matters in advance.',
    'On the sixth-month new moon, gengshen day, Hongli announced an eastern tour next spring with the Empress Dowager to sacrifice at Qufu and told offices to prepare.',
  ],
  s0180: [
    'On day xinwei, the Guizhou governor was ordered to control military affairs throughout the province.',
    'On xinwei day the Guizhou governor was given command over provincial military affairs.',
  ],
  s0181: [
    'Huo Bei was stripped of office for failing to investigate and impeach prefectural and county deficits, and was sent to serve at a relay station.',
    'Huo Bei lost his post for not reporting county deficits and was sent to relay-station duty.',
  ],
  s0182: [
    'On day renshen, famine in seven prefectures and counties of Shandong including Yidu was relieved.',
    'On renshen day famine relief was sent to Yidu and six other Shandong counties.',
  ],
  s0183: [
    'On day bingzi, the Lesser Jinchuan chieftain Tsewang led his people in surrender and also restored the three stockades of Wo Ri.',
    'On bingzi day Lesser Jinchuan chief Tsewang surrendered with his people and returned the three Wo Ri stockades.',
  ],
  s0184: [
    'Government troops advancing to suppress Greater Jinchuan attacked the stockades of Maoniu and Masang and took them.',
    'Imperial forces attacking Greater Jinchuan captured the Maoniu and Masang stockades.',
  ],
  s0185: [
    'Qing Fu was summoned back to the capital.',
    'Qing Fu was recalled to Beijing.',
  ],
  s0186: [
    'Autumn, seventh month, first day of the month on day jichou: hail and flood victims in twenty prefectures, counties, and garrisons of Shandong including Licheng were comforted and relieved.',
    'On the seventh-month new moon, jichou day, hail and flood victims in Licheng and nineteen other Shandong districts were relieved.',
  ],
  s0187: [
    'Gao Bin and others were ordered to dredge rivers in Jiangsu including the Liutang.',
    'Gao Bin and others were told to dredge Jiangsu rivers including Liutang.',
  ],
  s0188: [
    'On day bingshen, Nayantai was ordered to relieve drought in six banners including Sonid.',
    'On bingshen day Nayantai was sent to relieve drought in the Sonid and five other banners.',
  ],
  s0189: [
    'Liu Yuyi\'s concurrent management of the Board of Revenue was halted; Neqin replaced him.',
    'Liu Yuyi ceased acting at Revenue; Neqin took over.',
  ],
  s0190: [
    'On day bingwu, victims of flood, drought, and hail in seventy-five prefectures and counties of Shuntian including Gu\'an were relieved.',
    'On bingwu day relief was sent to seventy-five disaster-stricken districts of Shuntian including Gu\'an.',
  ],
  s0191: [
    'On day wushen, the Emperor escorted the Empress Dowager to the Mountain Resort for Summer.',
    'On wushen day the Emperor took the Empress Dowager to the Summer Mountain Resort.',
  ],
  s0192: [
    'On day guichou, Zhang Guangsi advanced his headquarters to Meinuo stockade in Lesser Jinchuan, attacked by several routes, and accepted the surrender of Lesser Jinchuan.',
    'On guichou day Zhang Guangsi moved to Meinuo in Lesser Jinchuan, attacked on several fronts, and accepted Lesser Jinchuan\'s surrender.',
  ],
  s0193: [
    'On day yimao, the Emperor escorted the Empress Dowager to lodge at the Mountain Resort for Summer.',
    'On yimao day the court took up residence at the Summer Mountain Resort.',
  ],
  s0194: [
    'On day wuwu, drought-stricken salt producers in three Changlu fields including Yongli were relieved.',
    'On wuwu day drought relief was sent to Yongli and two other Changlu salt fields.',
  ],
  s0195: [
    'Eighth month, day xinyou: the Emperor escorted the Empress Dowager on the mulan hunt.',
    'In the eighth month, on xinyou day, the Emperor took the Empress Dowager to the mulan hunt.',
  ],
  s0196: [
    'On day bingyin, salt producers in two counties including Changlu and Haifeng were relieved.',
    'On bingyin day relief was sent to salt producers in Changlu and Haifeng.',
  ],
  s0197: [
    'On day wuchen, the Emperor hunted at Wenduerhua.',
    'On wuchen day the Emperor hunted at Wenduerhua.',
  ],
  s0198: [
    'A banquet was granted to Mongol princes, dukes, and taijis.',
    'Mongol princes, dukes, and taijis were feasted.',
  ],
  s0199: [
    'On day xinwei, grain was purchased at Rehe\'s Bagou and other places to relieve drought in the six Sonid banners.',
    'On xinwei day grain bought at Bagou and elsewhere was used to relieve drought in the six Sonid banners.',
  ],
  s0200: [
    'On day guiyou, victims of tidal disaster in Jiangsu\'s Su and Song districts and subordinates were relieved.',
    'On guiyou day tidal-disaster victims in Suzhou and Songjiang districts received relief.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b02.mjs <translation.json>'
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
