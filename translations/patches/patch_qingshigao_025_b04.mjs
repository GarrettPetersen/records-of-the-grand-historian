#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'On day guichou, the Ministry of Civil Affairs submitted regulations for self-government elections in prefectures, departments, and counties.',
    'On guichou day Civil Affairs sent up fu-ting-zhou-xian self-government election rules.',
  ],
  s0302: [
    'On day guihai, former Fujian governor Zhang Zhaodong was restored to his original office.',
    'On guihai day Zhang Zhaodong regained his former Fujian governor post.',
  ],
  s0303: [
    'Twenty border guard posts were established along the Aihui frontier in Heilongjiang, from the Ergun River to the Xun River mouth.',
    'Twenty Aihui border guard posts were set from the Ergun to the Xun estuary.',
  ],
  s0304: [
    'On day yichou, a Superintendent of Salt Administration was created, with Zaize as incumbent; governors-general and governors of salt-producing provinces were made co-superintendents, and governors-general and governors of salt-distribution provinces all received concurrent titles.',
    'On yichou day a salt superintendent was created under Zaize; producing provinces\' governors co-supervised and distributing provinces\' governors took concurrent titles.',
  ],
  s0305: [
    'On day bingyin, Lu Runxiang was made Grand Secretary of the Tiren Hall, and Dai Hongci Associate Grand Secretary as minister.',
    'On bingyin day Lu Runxiang became Tiren Hall grand secretary and Dai Hongci associate grand secretary.',
  ],
  s0306: [
    'On day xinwei, Prince Yulang was made commander of the Metropolitan Garrison.',
    'On xinwei day Prince Yulang took the Metropolitan Garrison.',
  ],
  s0307: [
    'On day guiyou, the Censorate submitted mutual-election rules.',
    'On guiyou day the Censorate sent up mutual-election rules.',
  ],
  s0308: [
    'On day yihai, the Board of Education submitted regulations on dress for women\'s schools.',
    'On yihai day Education sent up women\'s-school dress regulations.',
  ],
  s0309: [
    'The late candidate subprefect and Zhili department magistrate Hua Hengfang, a master of abstruse learning, was ordered entered in the histories, together with his late brother, former department assistant magistrate Shifang, and the late second-rank enfeoffed Xu Shou.',
    'Hua Hengfang, Shifang, and Xu Shou—masters of abstruse learning—were ordered entered in the histories.',
  ],
  s0310: [
    'Twelfth month, day jimao: an edict sought blunt counsel.',
    'In month 12, jimao, the throne called for blunt counsel.',
  ],
  s0311: [
    'On day xinsi, Antu and Fusong counties were added in Fengtian.',
    'On xinsi day Fengtian gained Antu and Fusong counties.',
  ],
  s0312: [
    'On day renwu, students who had studied abroad—Zhan Tianyou and others—were granted jinshi in engineering, letters, and law, and juren in engineering and natural science.',
    'On renwu day Zhan Tianyou and other returned students received engineering, letters, and law jinshi and science juren.',
  ],
  s0313: [
    'On day guiwei, this year\'s grain taxes were remitted for eighty-nine prefectures, departments, counties, and garrisons with salt fields in Qingcheng, Shandong, and elsewhere.',
    'On guiwei day grain tax was remitted for eighty-nine Shandong counties and salt-field districts.',
  ],
  s0314: [
    'On day yiyou, the spirit tablet of the Jing Emperor Dezong was enshrined in the Hall of Ancestors.',
    'On yiyou day Emperor Dezong\'s tablet was enshrined in the Ancestral Hall.',
  ],
  s0315: [
    'A woman of Henan\'s Zhecheng county, née Zhang of the Liu household, who bore three sons in one pregnancy, and a woman of Tongxu county, née Tian of the Li household, were rewarded with grain and cloth.',
    'Zhecheng\'s Zhang Liu and Tongxu\'s Tian Li—each bearing triplets—received grain and cloth.',
  ],
  s0316: [
    'Disaster victims in thirteen departments and counties including Foshan, Guangdong, were relieved.',
    'Thirteen Guangdong departments and counties including Foshan received disaster relief.',
  ],
  s0317: [
    'On day bingxu, the superintendent of the Imperial Medical Academy was fixed at fourth rank.',
    'On bingxu day the Medical Academy superintendent became fourth rank.',
  ],
  s0318: [
    'On day wuzi, descendants of meritorious officials who had suppressed the Miao, Nian, and Muslim rebels in the Xianfeng and Tongzhi reigns were entered on the register and given offices in varying degrees.',
    'On wuzi day descendants of Xianfeng-Tongzhi pacification merit received graded offices.',
  ],
  s0319: [
    'Rent on banner household land occupied by Hunchun garrison barracks was remitted.',
    'Hunchun barracks\' occupation rent on banner land was remitted.',
  ],
  s0320: [
    'On day gengyin, Zhao Erfeng memorialized that the Dege native chieftain in Sichuan, Duogeshengji, had submitted his territory; direct administration was established and the native-office hereditary company commander was rewarded.',
    'On gengyin day Zhao Erfeng reported Sichuan Dege\'s Duogeshengji submitting territory for direct rule and rewarded the hereditary company commander.',
  ],
  s0321: [
    'On day renchen, Prince Qing Yikuang was relieved of managing the Army Nobles\' Academy; Prince Zairun replaced him.',
    'On renchen day Yikuang left the Army Nobles\' Academy and Zairun replaced him.',
  ],
  s0322: [
    'On day guisi, Longhua county was added in Rehe.',
    'On guisi day Rehe gained Longhua county.',
  ],
  s0323: [
    'On day yiwei, the Constitutional Research Bureau submitted anti-opium regulations, which were promulgated.',
    'On yiwei day the Constitutional Research Bureau\'s anti-opium rules were promulgated.',
  ],
  s0324: [
    'The late former Hunan governor Chen Baozhen was restored to his original office.',
    'Former Hunan governor Chen Baozhen was posthumously restored.',
  ],
  s0325: [
    'On day bingshen, the Constitutional Research Bureau submitted articles prohibiting the buying and selling of persons.',
    'On bingshen day the Constitutional Research Bureau sent up anti-trafficking articles.',
  ],
  s0326: [
    'On day wuxu, the Ministry of Justice submitted regulations on disciplining judges.',
    'On wuxu day Justice sent up judge-discipline regulations.',
  ],
  s0327: [
    'On day jihai, the Constitutional Research Bureau submitted regulations for local self-government elections in the capital.',
    'On jihai day the Constitutional Research Bureau sent up capital local-election rules.',
  ],
  s0328: [
    'On day gengzi, the left and right vice-superintendents of the Imperial Medical Academy were raised to fifth rank.',
    'On gengzi day the Medical Academy\'s vice-superintendents rose to fifth rank.',
  ],
  s0329: [
    'On day renyin, the Constitutional Research Bureau submitted regulations on local self-government in prefectures, departments, and counties, together with regulations on electing members of prefectural, departmental, and county councils.',
    'On renyin day the Constitutional Research Bureau sent up local self-government and council-election rules.',
  ],
  s0330: [
    'On day guimao, the Constitutional Research Bureau submitted a court organization law, together with provisional regulations on judicial examination and appointment, judicial district division, and cases under the jurisdiction of primary and local trial courts.',
    'On guimao day the Constitutional Research Bureau sent up court organization and provisional judicial rules.',
  ],
  s0331: [
    'Xuantong year 2, gengxu, spring, first month, new moon on day bingwu: court congratulations were not received.',
    'Xuantong 2, spring 1, bingwu new moon: levee congratulations were not held.',
  ],
  s0332: [
    'On day jiyou, the new army at Guangzhou mutinied and was suppressed by the training troops.',
    'On jiyou day Guangzhou\'s new army mutinied and training troops put it down.',
  ],
  s0333: [
    'On day xinhai, an edict said that because popular sentiment was unsettled and political associations numerous, with infiltration into the camps and incitement by agitators, the General Staff, the Army Ministry, and the northern and southern coastal ministers and all old and new armies were ordered to inspect strictly; soldiers were especially to obey superior officers\' commands, and mass meetings and public speeches were also strictly forbidden.',
    'On xinhai day the throne, citing unrest and secret-society infiltration of the army, ordered strict inspection and banned soldiers\' mass meetings and speeches.',
  ],
  s0334: [
    'Datong county in Jilin was moved to the south bank of the Songhua and renamed Fangzheng county.',
    'Jilin\'s Datong was moved south of the Songhua and renamed Fangzheng.',
  ],
  s0335: [
    'On day yimao, Wang Zhankui and other Guangdong revolutionaries were executed.',
    'On yimao day Guangdong revolutionaries including Wang Zhankui were executed.',
  ],
  s0336: [
    'On day dingsi, the Dalai Lama, fearing Sichuan troops\' arrival, fled.',
    'On dingsi day the Dalai Lama fled, fearing Sichuan troops.',
  ],
  s0337: [
    'Lian Yu and others were instructed still to dispatch officials to escort him back to Tibet.',
    'Lian Yu was told still to send escorts to bring him back to Tibet.',
  ],
  s0338: [
    'On day xinyou, an edict stripped the Dalai Lama Awang Luobuzang Tubandan Jiacuo Jizhai Wang Quque Le Langjie of his title.',
    'On xinyou day the Dalai Lama\'s title was stripped.',
  ],
  s0339: [
    'The Salt Administration submitted trial regulations for the salt superintendent.',
    'The Salt Administration sent up trial salt-superintendent regulations.',
  ],
  s0340: [
    'On day guihai, Associate Grand Secretary Dai Hongci died; he was posthumously given the rank of Junior Guardian of the Heir Apparent and silver for the funeral.',
    'On guihai day Dai Hongci died and received posthumous Junior Guardian rank and funeral silver.',
  ],
  s0341: [
    'Lu Haihuan and others submitted regulations for the Chinese Red Cross Society; Sheng Xuanhuai was made president.',
    'Lu Haihuan sent up Chinese Red Cross rules and Sheng Xuanhuai became president.',
  ],
  s0342: [
    'Supervising censor Jiang Chunlin, for memorializing that Prince Qing Yikuang had harmed the state, was dismissed back to his original post.',
    'Censor Jiang Chunlin, who attacked Yikuang for harming the state, was sent back to his yamen.',
  ],
  s0343: [
    'Postal Minister Xu Shichang was made Associate Grand Secretary; Grand Secretariat academician Wu Yusheng was ordered to study under the Grand Council.',
    'Xu Shichang became associate grand secretary and Wu Yusheng studied under the Grand Council.',
  ],
  s0344: [
    'On day jiazi, Prince Zaitao, who managed the General Staff, requested to inspect the armies of Japan, the United States, Britain, France, Germany, Italy, Austria, and Russia.',
    'On jiazi day General Staff Prince Zaitao asked to inspect armies in eight countries.',
  ],
  s0345: [
    'On day xinwei, Britain held an international congress on penal reform; the Ministry of Justice memorialized sending Chief Procurator Xu Qian to attend.',
    'On xinwei day Britain held a penal-reform congress and Justice sent Procurator Xu Qian.',
  ],
  s0346: [
    'On day jiaxu, an edict: 「In preparing constitutional government, old prejudices should be dissolved and all differences erased.',
    'On jiaxu day the throne said: 「Preparing constitutional rule means dissolving prejudice and erasing difference.',
  ],
  s0347: [
    'Henceforth all Manchu and Han civil and military officials presenting memorials shall uniformly style themselves chen, to show uniformity and embody great harmony.',
    'Henceforth all Manchu and Han officials shall address themselves uniformly as chen, for one standard and great harmony.',
  ],
  s0348: [
    '」Second month, first day of cycle yihai: Lian Yu requested that the new Kaletan Poolba Luobuzangdanba act as agent for former Tibet affairs.',
    '」Month 2, yihai new moon: Lian Yu asked the new Kaletan Poolba Luobuzangdanba to act for former Tibet.',
  ],
  s0349: [
    'On day bingzi, foreign merchants were forbidden to purchase and transport rice from Hunan.',
    'On bingzi day foreign merchants were banned from buying Hunan rice.',
  ],
  s0350: [
    'On day xinsi, Tie Liang was relieved for illness; Yin Chang was made Minister of the Army, and Liang Dunyi co-superintendent of the Tax Bureau.',
    'On xinsi day Tie Liang left for illness; Yin Chang became army minister and Liang Dunyi tax co-superintendent.',
  ],
  s0351: [
    'Arrears from the first year of Xuantong for desolate salt pans at four fields in Zhejiang—Renhe, Haisha, Baolang, and Luli—and two fields in Jiangsu—Hengpu and Pudong—were remitted.',
    'Xuantong 1 arrears for desolate Zhejiang and Jiangsu salt pans were remitted.',
  ],
  s0352: [
    'On day renwu, old arrears in four prefectures and counties including Yulin, Shaanxi, and grain, fodder, and straw in the Yulin prefectural granary were remitted.',
    'On renwu day Yulin and three other Shaanxi counties\' arrears and granary dues were remitted.',
  ],
  s0353: [
    'On day yiyou, Grand Secretariat reader Liang Cheng was made envoy to Germany.',
    'On yiyou day Liang Cheng became envoy to Germany.',
  ],
  s0354: [
    'On day dinghai, the Ministry of Civil Affairs submitted revised press regulations for review and memorial by the Constitutional Research Bureau.',
    'On dinghai day Civil Affairs sent revised press law to the Constitutional Research Bureau.',
  ],
  s0355: [
    'On day jichou, thirty thousand taels from the treasury were again issued to relieve disaster in Anhui.',
    'On jichou day another thirty thousand taels went to Anhui disaster relief.',
  ],
  s0356: [
    'On day renchen, Xuantong first-year arrears in Wuchang department and Huadian county, Jilin, were remitted.',
    'On renchen day Jilin Wuchang and Huadian\'s Xuantong 1 tax arrears were remitted.',
  ],
  s0357: [
    'On day jiawu, Lian Yu memorialized that Lhasa monks and laity and Gongbo Tibetan troops had submitted and been naturalized.',
    'On jiawu day Lian Yu reported Lhasa clergy and laity and Gongbo Tibetans submitting.',
  ],
  s0358: [
    'On day bingshen, Ge Baohua died; Rong Qing was transferred to Minister of Rites, and Tang Jingchong was made Minister of Education.',
    'On bingshen day Ge Baohua died; Rong Qing became rites minister and Tang Jingchong education minister.',
  ],
  s0359: [
    'On day jihai, preferential posthumous treatment was granted to the late Hubei provincial commander Xia Yuxiu.',
    'On jihai day late Hubei commander Xia Yuxiu received preferential posthumous treatment.',
  ],
  s0360: [
    'On day guimao, the Constitutional Research Bureau submitted an administrative outline.',
    'On guimao day the Constitutional Research Bureau sent up an administrative outline.',
  ],
  s0361: [
    'The Superintendent of Naval Affairs memorialized on the titles and duties of each department.',
    'Naval affairs superintendent memorialized department titles and duties.',
  ],
  s0362: [
    'Third month, new moon on day yisi: Wang Shizhen was relieved for illness; Lei Zhenchun was ordered to act as Jiangbei commander.',
    'Month 3, yisi new moon: Wang Shizhen left for illness and Lei Zhenchun acted as Jiangbei commander.',
  ],
  s0363: [
    'On day jiyou, heterodox bandits in Weining, Yunnan, raided Zhaocheng; government troops exterminated them and the bandit chief Li Laomo was executed.',
    'On jiyou day Yunnan Weining heterodox bandits raided Zhaocheng; troops killed them and chief Li Laomo was executed.',
  ],
  s0364: [
    'On day xinhai, famine victims in Hunan stirred up trouble; an edict ordered the ringleaders seized and the coerced dispersed.',
    'On xinhai day Hunan famine victims rioted; the throne ordered ringleaders seized and followers dispersed.',
  ],
  s0365: [
    'On day renzi, Hunan governor Cen Chunmian was dismissed; Yang Wendian was ordered to act in his place.',
    'On renzi day Cen Chunmian left Hunan and Yang Wendian acted as governor.',
  ],
  s0366: [
    'Yang Shiqi was dispatched to Nanyang as chief examiner of the industrial exposition.',
    'Yang Shiqi went to Nanyang as chief industrial-exposition examiner.',
  ],
  s0367: [
    'On day dingsi, rain was prayed for.',
    'On dingsi day the court prayed for rain.',
  ],
  s0368: [
    'On day gengshen, it rained.',
    'On gengshen day rain fell.',
  ],
  s0369: [
    'The late naval commander Ding Ruchang was posthumously restored to his original office.',
    'Late naval commander Ding Ruchang was posthumously restored.',
  ],
  s0370: [
    'The old system of autumn review and reassessment was abolished.',
    'Autumn review and reassessment were abolished.',
  ],
  s0371: [
    'Governors-general and governors along the Yangtze were instructed to sell grain at fair price.',
    'Yangtze governors-general were told to sell grain at fair price.',
  ],
  s0372: [
    'Henan governor Wu Chongxi was dismissed; Bao Fen replaced him.',
    'Wu Chongxi left Henan and Bao Fen replaced him.',
  ],
  s0373: [
    'Cheng Dequan was transferred to Jiangsu governor.',
    'Cheng Dequan became Jiangsu governor.',
  ],
  s0374: [
    'On day renxu, a shrine was ordered built at Wuhu county, Anhui, to the late Grand Master of Sacrifices Yuan Chong, whose kindness survived him.',
    'On renxu day a Wuhu shrine was ordered for late Yuan Chong, beloved in death.',
  ],
  s0375: [
    'On day guihai, the Fengtian governor was abolished.',
    'On guihai day the Fengtian governorship was abolished.',
  ],
  s0376: [
    'Guangfu was made Ili general.',
    'Guangfu became Ili general.',
  ],
  s0377: [
    'On day jiazi, revolutionaries Wang Mingji, Huang Fusheng, and Luo Shixun plotted to bomb the Prince Regent with explosives; the plot was discovered and they were arrested and imprisoned by the Ministry of Justice.',
    'On jiazi day Wang Mingji, Huang Fusheng, and Luo Shixun plotted to bomb the Prince Regent, were caught, and jailed by Justice.',
  ],
  s0378: [
    'On day gengwu, Pan, wife of Kong Lingbao of Qufu, Shandong, who died following her husband, was honored and entered in the histories.',
    'On gengwu day Kong Lingbao\'s widow Pan of Qufu, who died with her husband, was honored for the histories.',
  ],
  s0379: [
    'Fourth month, new moon on day jiaxu: an edict fixed the Advisory Council to open on the first day of the ninth month of this year; eighty-eight members—imperially selected princes, dukes, hereditary nobles, imperial clansmen, officials of all boards, and eminent scholars—were to be summoned in advance.',
    'Month 4, jiaxu new moon: the Advisory Council would open ninth month 1; eighty-eight imperially chosen members were summoned early.',
  ],
  s0380: [
    'On day bingzi, the Fujian grain-intendant circuit was abolished and police and industrial promotion circuits were added.',
    'On bingzi day Fujian lost its grain intendant and gained police and industrial circuits.',
  ],
  s0381: [
    'On day dingchou, Prince Zaitao was made special envoy to Britain for mourning rites.',
    'On dingchou day Prince Zaitao became special envoy to Britain for mourning.',
  ],
  s0382: [
    'On day wuyin, returned students including Wu Kuangshi were granted jinshi in engineering and juren in law in varying degrees.',
    'On wuyin day returned students including Wu Kuangshi received engineering jinshi and law juren.',
  ],
  s0383: [
    'On day gengchen, the Constitutional Research Bureau\'s revising-law ministers presented the current penal code, which was ordered promulgated.',
    'On gengchen day the Constitutional Research Bureau\'s current penal code was ordered promulgated.',
  ],
  s0384: [
    'An edict said: 「This penal code is preparatory to adopting a new code.',
    'The throne said: 「This code prepares adoption of new law.',
  ],
  s0385: [
    'Criminal offices at court and in the provinces should study it earnestly and judge cases according to law.',
    'Court and provincial criminal offices must study it and judge by law.',
  ],
  s0386: [
    'They must not act arbitrarily and thereby cause wrongful leniency or severity.',
    'They must not act arbitrarily and warp justice.',
  ],
  s0387: [
    '」On day guiwei, an edict: 「In each province the police and industrial promotion circuits were added to guard public order and revive practical enterprise.',
    '」On guiwei day the throne said: 「Provincial police and industrial circuits were meant to guard order and revive enterprise.',
  ],
  s0388: [
    'Governors-general and governors should carefully examine those already appointed; if they cannot perform or are unsuited to the post, they should memorialize for another appointment and must not show favor or deference.',
    'Governors must examine appointees; if unfit they must memorialize replacements without favor.',
  ],
  s0389: [
    '」On day yiyou, Lian Yu requested one commissioner each at Qushui, Halawusu, Jiangda, Shannan, Shuobanduo, and the Thirty-nine Clans in Tibet, and that Tibetan gun and coin factories be shut.',
    '」On yiyou day Lian Yu asked commissioners for six Tibetan districts and closure of Tibetan gun and coin factories.',
  ],
  s0390: [
    'Former envoy to Italy Qian Xun presented a translation and commentary on peace-treaty articles.',
    'Former Italy envoy Qian Xun presented translated peace-treaty articles.',
  ],
  s0391: [
    'On day dinghai, because salt smugglers and secret-society bandits in Jiangbei appeared and vanished unpredictably, Lei Zhenchun was instructed to suppress and pacify them.',
    'On dinghai day Jiangbei salt smugglers and secret societies were ordered suppressed by Lei Zhenchun.',
  ],
  s0392: [
    'On day jichou, the Revenue Board submitted currency exchange regulations.',
    'On jichou day Revenue sent up currency exchange rules.',
  ],
  s0393: [
    'An edict: 「The national currency unit is named yuan.',
    'The throne said: 「The national currency unit is called yuan.',
  ],
  s0394: [
    'For the present silver is taken as the standard; one yuan is the main coin, weighing seven mace two candareens on the kuping scale.',
    'For now silver is standard; one main yuan weighs seven mace two candareens kuping.',
  ],
  s0395: [
    'Half-yuan, quarter-yuan, and one-dime silver subsidiary coins, and five-cent nickel and two-cent, one-cent, five-mil, and one-mil copper subsidiary coins, are added.',
    'Half-, quarter-, and one-dime silver and nickel and copper subsidiary coins were added.',
  ],
  s0396: [
    'Yuan, dime, cent, and mil each advance by tens; this is fixed as the regulation.',
    'Yuan, dime, cent, and mil advance by tens as fixed regulation.',
  ],
  s0397: [
    '」Lian Fang was made Jingzhou general.',
    '」Lian Fang became Jingzhou general.',
  ],
  s0398: [
    'On day gengyin, it was fixed that ten persons paying the largest taxes in continued selection would be councilors.',
    'On gengyin day ten top continued-tax payers were fixed as councilors.',
  ],
  s0399: [
    'On day xinmao, Postal Vice Minister Wang Daxie was made envoy to Japan.',
    'On xinmao day Wang Daxie became envoy to Japan.',
  ],
  s0400: [
    'On day guisi, Liang Dunyi was relieved for illness; Zou Jialai was ordered to act as Minister of Foreign Affairs and co-superintendent.',
    'On guisi day Liang Dunyi left for illness and Zou Jialai acted as foreign minister and co-superintendent.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b04.mjs <translation.json>'
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
