#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Eighth month, day xinwei: Cheng De captured Duoluoka, Longgang, and other places.',
    'In the eighth month, on xinwei day, Cheng De took Duoluoka, Longgang, and other posts.',
  ],
  s0502: [
    'Sun Shiyi was ordered to remain in front Tibet to supervise grain transport.',
    'Sun Shiyi was posted to front Tibet to oversee grain supply.',
  ],
  s0503: [
    'On day guiyou, Fukang\'an was made Grand Secretary of the Hall of Martial Glory; Sun Shiyi, Grand Secretary of the Hall of Literary Depth.',
    'On guiyou day, Fukang\'an joined the Martial Glory grand secretariat and Sun Shiyi the Literary Depth.',
  ],
  s0504: [
    'Jin Jian and Liu Yong were transferred to be Ministers of Personnel; Helin to Works; Ji Yun to Rites; Dou Guangnai to Censor-in-chief of the Left.',
    'Jin Jian and Liu Yong took personnel; Helin works; Ji Yun rites; Dou Guangnai the left censorate.',
  ],
  s0505: [
    'On day gengchen, Boxing was made commissioner at Urga.',
    'On gengchen day, Boxing became Urga commissioner.',
  ],
  s0506: [
    'On day bingxu, Fukang\'an memorialized the capture of Gelela and Duibumu forts; A Mantai and Mo\'ergenbao died in battle.',
    'On bingxu day, Fukang\'an reported Gelela and Duibumu forts taken; A Mantai and Mo\'ergenbao fell in battle.',
  ],
  s0507: [
    'Cheng De and others captured the Lidi and Dashan rebel forts.',
    'Cheng De and others took the Lidi and Dashan rebel forts.',
  ],
  s0508: [
    'On day wuzi, Fukang\'an reported that Gurkha chief Ratnabhadra and others begged to surrender.',
    'On wuzi day, Fukang\'an reported Gurkha chief Ratnabhadra and others seeking surrender.',
  ],
  s0509: [
    'The Emperor, seeing their repentance and plea to surrender, permitted it and ordered withdrawal of the army.',
    'The Emperor accepted their repentance and ordered the troops withdrawn.',
  ],
  s0510: [
    'On day bingshen, drought relief was given for six Shaanxi prefectures and counties including Xianning.',
    'On bingshen day, drought relief reached six Shaanxi districts including Xianning.',
  ],
  s0511: [
    'Ninth month, day dingyou: the Emperor returned to the capital.',
    'In the ninth month, on dingyou day, the Emperor returned to Beijing.',
  ],
  s0512: [
    'On day jihai, merits in the Gurkha campaign were assessed; Fukang\'an was granted First-class Chariot Commandant; Hai Lancha was advanced from second- to first-rank duke; Sun Shiyi and others received differentiated rewards.',
    'On jihai day, Gurkha merits were rewarded: Fukang\'an received First-class Chariot Commandant; Hai Lancha rose to first-rank duke; Sun Shiyi and others were promoted by degree.',
  ],
  s0513: [
    'On day bingwu, the Emperor ordered Fukang\'an, Sun Shiyi, and others to consult on postwar arrangements for Tibet.',
    'On bingwu day, Fukang\'an, Sun Shiyi, and others were told to settle Tibet\'s aftermath.',
  ],
  s0514: [
    'Imperial bodyguards including Huilun were ordered to carry the golden urn to Tibet, store reincarnation names, and have the Dalai Lama and others draw lots before the assembly.',
    'Huilun and other guards took the golden urn to Tibet so the Dalai Lama and others could draw the reincarnation name in public.',
  ],
  s0515: [
    'On day renzi, Gurkha princes\' titles were restored and tribute fixed at once every five years.',
    'On renzi day, Gurkha titles were restored and tribute set for every five years.',
  ],
  s0516: [
    'Winter, tenth month, day wuchen: Gurkha tribute envoys had audience.',
    'In the tenth winter month, on wuchen day, Gurkha tribute envoys were received.',
  ],
  s0517: [
    'On day jisi, disaster victims were relieved in sixteen Henan counties including Anyang; old and new quota taxes were remitted or deferred by degree.',
    'On jisi day, sixteen Henan counties including Anyang were relieved and taxes remitted or deferred by degree.',
  ],
  s0518: [
    'On day jimao, Ji Huang and Agui were removed as Hanlin Academy chancellors; Heshen and Peng Yuanrui replaced them.',
    'On jimao day, Ji Huang and Agui left the Hanlin chancellorship; Heshen and Peng Yuanrui succeeded them.',
  ],
  s0519: [
    'On day renwu, drought relief was given for five Zhili prefectures and counties including Hejian and Renqiu; quota taxes were also remitted for stricken banner people in thirteen Shuntian-area units.',
    'On renwu day, five Zhili districts including Hejian and Renqiu were drought-relieved and banner taxes remitted in thirteen Shuntian-area units.',
  ],
  s0520: [
    'On day yiyou, Guo Shihui reported that Britain was sending envoys asking to enter tribute via Tianjin; permission was granted.',
    'On yiyou day, Guo Shihui reported a British mission via Tianjin and permission was granted.',
  ],
  s0521: [
    'On day dinghai, E Hui was stripped of office for concealing Gurkha thanks and tribute memorials and was handed to Fukang\'an and others for strict interrogation.',
    'On dinghai day, E Hui lost office for hiding Gurkha tribute papers and was sent to Fukang\'an for interrogation.',
  ],
  s0522: [
    'Drought relief was given for fourteen Shaanxi prefectures and counties including Xianyang.',
    'Fourteen Shaanxi districts including Xianyang received drought relief.',
  ],
  s0523: [
    'On day guisi, Tusang\'a was transferred to be Suiyuan city general.',
    'On guisi day, Tusang\'a became Suiyuan city general.',
  ],
  s0524: [
    'Eleventh month, day bingwu: drought relief was given for twenty Shandong prefectures and counties including Dezhou.',
    'In the eleventh month, on bingwu day, twenty Shandong districts including Dezhou were drought-relieved.',
  ],
  s0525: [
    'Twelfth month, day gengwu: regulations were fixed for training Tangut banner troops.',
    'In the twelfth month, on gengwu day, Tangut banner training rules were set.',
  ],
  s0526: [
    'Silver was cast into coin inscribed "Qianlong Treasure."',
    'Silver was cast into coins reading "Qianlong Treasure."',
  ],
  s0527: [
    'On day jiaxu, quota salt-field taxes were remitted for five Changlu yards including Xingguo and seven counties including Cangzhou.',
    'On jiaxu day, salt-field taxes were remitted at five Changlu yards including Xingguo and seven counties including Cangzhou.',
  ],
  s0528: [
    'On day bingzi, Chang Lin was made Zhejiang governor; Jiang Zhaokui, Shanxi governor.',
    'On bingzi day, Chang Lin took Zhejiang and Jiang Zhaokui Shanxi.',
  ],
  s0529: [
    'Because Ili Muslim farmland suffered snow disaster, quota grain was remitted for the year.',
    'Ili Muslim fields hit by snow were forgiven the year\'s quota grain.',
  ],
  s0530: [
    'On day guiwei, drought relief was given for twenty-five Henan counties including Anyang.',
    'On guiwei day, twenty-five Henan counties including Anyang were drought-relieved.',
  ],
  s0531: [
    'On day xinmao, E Hui and others were ordered permanently cangued in Tibet.',
    'On xinmao day, E Hui and others were ordered cangued forever in Tibet.',
  ],
  s0532: [
    'Fifty-eighth year, spring, first month, day bingshen: drought relief was given for five Henan counties including Lin and three Shaanxi prefectures and counties including Xianning.',
    'In spring of the fifty-eighth year, on bingshen day, drought relief reached five Henan counties including Lin and three Shaanxi units including Xianning.',
  ],
  s0533: [
    'On day jihai, drought relief was given for twenty-one Zhili prefectures and counties including Baoding.',
    'On jihai day, twenty-one Zhili districts including Baoding were drought-relieved.',
  ],
  s0534: [
    'On day gengzi, the Hangzhou weaving office was placed under the salt administration to oversee weaving concurrently; the salt intendant became transport commissioner; north and south customs were placed under the governor.',
    'On gengzi day, Hangzhou weaving was merged into salt control, the salt intendant became transport commissioner, and both customs went to the governor.',
  ],
  s0535: [
    'Quande was made salt commissioner of the Two Zhes.',
    'Quande became Two-Zhe salt commissioner.',
  ],
  s0536: [
    'Hengxiu returned as Jilin general.',
    'Hengxiu resumed as Jilin general.',
  ],
  s0537: [
    'On day yisi, an edict instructed Annam\'s King Nguyen Quang Binh to befriend neighbors, guard borders carefully, and silks were bestowed.',
    'On yisi day, Nguyen Quang Binh of Annam was told to keep peace on the borders and received silks.',
  ],
  s0538: [
    'On day bingchen, King Nguyen Quang Binh of Annam died; heir Nguyen Quang Toan succeeded.',
    'On bingchen day, Nguyen Quang Binh died and heir Nguyen Quang Toan succeeded in Annam.',
  ],
  s0539: [
    'On day yihai, last year\'s drought quota taxes were remitted for twenty-five Henan counties including Anyang.',
    'On yihai day, last year\'s drought taxes were remitted in twenty-five Henan counties including Anyang.',
  ],
  s0540: [
    'On day renwu, the Kashgar aqim beg was made Kashgar assistant commissioner.',
    'On renwu day, the Kashgar aqim beg became Kashgar assistant commissioner.',
  ],
  s0541: [
    'Third month, day dingyou: the Emperor visited Mount Pan.',
    'In the third month, on dingyou day, the Emperor went to Mount Pan.',
  ],
  s0542: [
    'On day gengzi, the Emperor halted at Mount Pan.',
    'On gengzi day, the Emperor stayed at Mount Pan.',
  ],
  s0543: [
    'On day jiachen, Minister of Rites Chang Qing died; Deming replaced him.',
    'On jiachen day, Rites Minister Chang Qing died and Deming succeeded him.',
  ],
  s0544: [
    'On day wushen, an edict ordered a golden urn installed at Yonghe Temple; Lifanyuan chiefs and seal-holding jasak lamas were instructed jointly to draw the Mongol-born reincarnation.',
    'On wushen day, a golden urn was ordered at Yonghe Temple and Lifanyuan and jasak lamas were told to draw the Mongol reincarnation together.',
  ],
  s0545: [
    'On day dingwei, the Emperor returned from the tour.',
    'On dingwei day, the Emperor returned from the tour.',
  ],
  s0546: [
    'On day yimao, Feng Guangxiong was transferred to be Yunnan governor; Yingshan was made Guizhou governor.',
    'On yimao day, Feng Guangxiong took Yunnan and Yingshan Guizhou.',
  ],
  s0547: [
    'On day wuwu, Grand Minister of the Imperial Guard Hai Lancha died.',
    'On wuwu day, Grand Minister Hai Lancha died.',
  ],
  s0548: [
    'Summer, fourth month, day renshen: Songyun was made chief steward of the Imperial Household and served above the imperial bodyguards.',
    'In the fourth summer month, on renshen day, Songyun became Imperial Household chief steward with rank above the guards.',
  ],
  s0549: [
    'On day xinsi, a general order directed that golden urns be installed at the Jokhang in front Tibet and at Yonghe Temple; joint drawing was to report the reincarnation and end the custom of princely sons privately claiming reincarnation.',
    'On xinsi day, golden urns were ordered at Lhasa\'s Jokhang and Yonghe Temple to end princes\' private reincarnation claims.',
  ],
  s0550: [
    'On day yiyou, concurrent titles were deleted for grand secretaries with ministry rank, Hanlin chancellors with vice rites rank, and Shuntian vice magistrates with education intendant rank.',
    'On yiyou day, several concurrent ministerial and educational titles were abolished.',
  ],
  s0551: [
    'On day dinghai, Pan Shi\'en and eighty-one others received jinshi degrees by varying ranks.',
    'On dinghai day, Pan Shi\'en and eighty-one others received jinshi ranks by degree.',
  ],
  s0552: [
    'On day wuzi, special provincial examinations were ordered for autumn of the fifty-ninth year and metropolitan examinations for spring of the sixtieth year.',
    'On wuzi day, special provincial and metropolitan exam schedules were set for years fifty-nine and sixty.',
  ],
  s0553: [
    'On day gengyin, Gurkha returned Tibet\'s Demarjong territory.',
    'On gengyin day, Gurkha returned Demarjong in Tibet.',
  ],
  s0554: [
    'Lajie and Sadang outside Tibet\'s passes were given to Gurkha.',
    'Lajie and Sadang beyond Tibet\'s passes went to Gurkha.',
  ],
  s0555: [
    'Fifth month, day yiwei: Guangxi surveillance commissioner Cheng Lin was sent to Annam\'s Thang Long for mourning and investiture rites.',
    'In the fifth month, on yiwei day, Cheng Lin went to Thang Long for Annamese mourning and investiture.',
  ],
  s0556: [
    'On day dingwei, the Emperor went to the Mountain Resort for Avoiding Summer Heat.',
    'On dingwei day, the Emperor went to the Summer Resort.',
  ],
  s0557: [
    'On day jiyou, because Mingxing had not memorialized dispatching Muslims to Khokand and elsewhere to handle foreign affairs, the Kashgar commissioner was dismissed and Yongbao was transferred to replace him.',
    'On jiyou day, Mingxing was punished for failing to report Muslim missions to Khokand and Yongbao replaced him at Kashgar.',
  ],
  s0558: [
    'Wu Mi\'uwusun was made Tarbagatai commissioner; Gunchukejab, Kobdo commissioner.',
    'Wu Mi\'uwusun took Tarbagatai and Gunchukejab Kobdo.',
  ],
  s0559: [
    'Techeng\'e was made Uliastai commissioner.',
    'Techeng\'e became Uliastai commissioner.',
  ],
  s0560: [
    'On day xinyou, Fukang\'an was advanced to a first-class Duke of Loyal Valor and Courageous Merit.',
    'On xinyou day, Fukang\'an was made a first-class Duke of Loyal Valor and Courageous Merit.',
  ],
  s0561: [
    'On day guichou, the Emperor halted at the Summer Resort.',
    'On guichou day, the Emperor stayed at the Summer Resort.',
  ],
  s0562: [
    'Sixth month, day jimao: earthquake relief was given for Taining in Sichuan.',
    'In the sixth month, on jimao day, Taining in Sichuan was earthquake-relieved.',
  ],
  s0563: [
    'On day yiyou, Britain\'s tribute ship reached Tianjin.',
    'On yiyou day, the British tribute ship reached Tianjin.',
  ],
  s0564: [
    'On day wuzi, they went ashore at Tongzhou.',
    'On wuzi day, the mission landed at Tongzhou.',
  ],
  s0565: [
    'A banquet was ordered at Tianjin.',
    'A banquet was ordered in Tianjin.',
  ],
  s0566: [
    'Autumn, seventh month, day guisi: Helin was ordered to audit Tibetan merchants\' comings and goings.',
    'In the seventh month, on guisi day, Helin was told to audit Tibetan trade traffic.',
  ],
  s0567: [
    'On day renyin, British envoys were lodged at Hongya Garden; Jin Jian and Yiling\'a arranged tribute items separately at Yuanmingyuan.',
    'On renyin day, the British envoys stayed at Hongya Garden while Jin Jian and Yiling\'a set out tribute at Yuanmingyuan.',
  ],
  s0568: [
    'On day jiyou, because of drought the Ministry of Punishments was ordered to clear common prisons and reduce crimes below exile.',
    'On jiyou day, drought led the punishments ministry to clear common jails and reduce lesser sentences.',
  ],
  s0569: [
    'On day gengwu, the Emperor held court in the great tent of the Garden of Ten Thousand Trees; Britain\'s chief envoy Macartney, deputy envoy Staunton, and others had audience.',
    'On gengwu day, Macartney, Staunton, and other British envoys were received in the Ten Thousand Trees Garden tent.',
  ],
  s0570: [
    'On day xinwei, Fukang\'an was transferred to Sichuan governor-general; Huiling acted temporarily; Chang Lin to Two Guangs governor-general; Ji Qing to Zhejiang governor; Huiling to Shandong governor.',
    'On xinwei day, Fukang\'an took Sichuan, Huiling acted, Chang Lin took the Two Guangs, Ji Qing Zhejiang, and Huiling Shandong.',
  ],
  s0571: [
    'On day renwu, tide-disaster quota salt-field taxes were remitted at two Changlu yards including Guantai.',
    'On renwu day, tide-hit salt taxes were remitted at two Changlu yards including Guantai.',
  ],
  s0572: [
    'On day bingxu, the Emperor returned to the capital.',
    'On bingxu day, the Emperor returned to Beijing.',
  ],
  s0573: [
    'On day wuzi, Qing Gui was made Minister of War.',
    'On wuzi day, Qing Gui became war minister.',
  ],
  s0574: [
    'On day gengyin, British envoys were instructed to proceed by inland waterways to Macao in Guangdong and take ship home.',
    'On gengyin day, the British envoys were sent by inland water to Macao to sail home.',
  ],
  s0575: [
    'Ninth month, day dingyou: Chang Lin was made Junior Tutor to the Heir Apparent.',
    'In the ninth month, on dingyou day, Chang Lin became Junior Tutor to the Heir Apparent.',
  ],
  s0576: [
    'Songyun was ordered to escort the British envoys to Dinghai in Zhejiang.',
    'Songyun was told to escort the British envoys to Dinghai, Zhejiang.',
  ],
  s0577: [
    'On day jiachen, Funing was transferred to Shandong governor; Huiling to Hubei governor.',
    'On jiachen day, Funing took Shandong and Huiling Hubei.',
  ],
  s0578: [
    'On day bingwu, because of flood in three Anhui prefectures and counties including Wuwei, grain rations were bestowed by degree.',
    'On bingwu day, flood-hit Anhui districts including Wuwei received graded grain rations.',
  ],
  s0579: [
    'Winter, tenth month, day guihai: King Nguyen Quang Toan of Annam memorialized thanks; of two shares of tribute one was accepted.',
    'In the tenth winter month, on guihai day, Nguyen Quang Toan sent thanks and one of two tribute shares was accepted.',
  ],
  s0580: [
    'On day wuzi, because Chang Lin reported that the British envoys said they would again submit memorials and tribute forwarded through the governor-general, an edict stated: "This follows precedent and has no other intent; the king may rest easy—future memorial tribute is not bound to fixed intervals.',
    'On wuzi day, after Chang Lin relayed Britain\'s offer of further tribute, the throne said it followed precedent and future visits were not on a fixed schedule.',
  ],
  s0581: [
    '"',
    'Future tribute need not follow fixed intervals.',
  ],
  s0582: [
    'Eleventh month, day jiawu: Hob\'ning was ordered to Tibet to assist Helin in affairs.',
    'In the eleventh month, on jiawu day, Hob\'ning was sent to Tibet to help Helin.',
  ],
  s0583: [
    'On day wuwu, because the previous year\'s provincial reports showed a population of somewhat more than 307,460,000—fifteen times that of the forty-ninth year of Kangxi—an edict stated: "Those who produce are few and those who consume are many; want will surely grow more pressing.',
    'On wuwu day, with reported population over 307 million, fifteen times Kangxi 49, the throne warned that producers were few and consumers many.',
  ],
  s0584: [
    'Governors-general, governors, and all charged with nurturing the people must exhort and guide so that all form a habit of frugality, labor diligently at farming, cherish material goods and fully use the land\'s bounty, and together share the blessings of peace.',
    'Officials were told to promote thrift, farming, and careful use of resources so all might share peace.',
  ],
  s0585: [
    '" On day jiwei, because elephants presented by Annam and other states had become too numerous, governors-general of Yunnan-Guizhou and the Two Guangs were ordered by edict to refuse elephant tribute.',
    'On jiwei day, Yunnan-Guizhou and Liangguang were told to refuse further elephant tribute from Annam and others.',
  ],
  s0586: [
    'Twelfth month, day guiwei: Wulana had audience; Ji Qing was ordered to act as Fujian-Zhejiang governor-general.',
    'In the twelfth month, on guiwei day, Wulana was received and Ji Qing acted as Fujian-Zhejiang governor-general.',
  ],
  s0587: [
    'Fifty-ninth year, spring, first month, day gengyin: three-tenths of tax arrears were remitted in Zhili, Shandong, and Henan.',
    'In spring of the fifty-ninth year, on gengyin day, three-tenths of arrears were remitted in Zhili, Shandong, and Henan.',
  ],
  s0588: [
    'On day gengxu, Guan Qianzhen was dismissed because of illness; Shu Lin was ordered to act as Grand Canal transport governor-general.',
    'On gengxu day, ill Guan Qianzhen was dismissed and Shu Lin acted as canal transport governor-general.',
  ],
  s0589: [
    'On day yimao, Hengxiu was stripped of office for embezzlement; Baolin was transferred to Jilin general; Songyun acted in the post.',
    'On yimao day, Hengxiu lost office for embezzlement, Baolin took Jilin, and Songyun acted.',
  ],
  s0590: [
    'On day wuwu, Annamese adherent Le Duy Chi was settled in Jiangnan.',
    'On wuwu day, Le Duy Chi of Annam was resettled in Jiangnan.',
  ],
  s0591: [
    'Second month, day gengshen: because New Year\'s Day and the Lantern Festival next year would coincide with solar and lunar eclipses, an edict called for self-examination and no celebratory observances.',
    'In the second month, on gengshen day, eclipses on New Year and Lantern Festival led the court to forgo celebrations and urge self-examination.',
  ],
  s0592: [
    'On day guihai, Gurkha sent envoys with memorial and tribute.',
    'On guihai day, Gurkha sent memorial and tribute envoys.',
  ],
  s0593: [
    'On day dinghai, Guangdong naval war junks were increased.',
    'On dinghai day, more Guangdong naval war junks were built.',
  ],
  s0594: [
    'Third month, day jichou: Hengxiu was sentenced to strangulation.',
    'In the third month, on jichou day, Hengxiu was sentenced to strangulation.',
  ],
  s0595: [
    'On day gengzi, the Emperor toured Tianjin; three-tenths of quota taxes were remitted on the route and in Tianjin districts; Tianjin arrears were remitted; four-tenths of arrears were remitted in thirteen districts including Daxing.',
    'On gengzi day, the Tianjin tour brought three-tenths tax cuts on the route, Tianjin arrears forgiven, and four-tenths remitted in thirteen districts including Daxing.',
  ],
  s0596: [
    'On day renzi, the Emperor halted at Tianjin prefecture.',
    'On renzi day, the Emperor stayed at Tianjin prefecture.',
  ],
  s0597: [
    'Summer, fourth month, day renxu: regular drought prayer; the Eighth Prince, Prince Yi of the Commandery Yongxuan, was ordered to perform the rites.',
    'In the fourth summer month, on renxu day, Prince Yi Yongxuan performed the regular drought rites.',
  ],
  s0598: [
    'On day guihai, the Emperor returned to the capital.',
    'On guihai day, the Emperor returned to Beijing.',
  ],
  s0599: [
    'On day dingchou, the Emperor prayed for rain at Black Dragon Pool.',
    'On dingchou day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0600: [
    'Fifth month, day bingshen: rain fell in the capital.',
    'In the fifth month, on bingshen day, rain fell in the capital.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b06.mjs <translation.json>'
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
