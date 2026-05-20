#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day guimao, Censor Suolu and others, for impeaching Jiang Bing of embellishment, were rebuked in an edict as deliberately disturbing government and stripped of office.',
    'On guimao day, Suolu and other censors were dismissed for a partisan attack on Jiang Bing.',
  ],
  s0602: [
    'On day bingwu, the Board of Civil Appointments memorialized that former Grand Secretary Zhang Tingyu had favored his students in cliques and had allied by marriage with Zhu Quan; he should be dismissed and punished.',
    'On bingwu day, the Board sought Zhang Tingyu\'s dismissal for factional favoritism and marriage ties to Zhu Quan.',
  ],
  s0603: [
    'The Emperor specially exempted him.',
    'The Emperor granted Zhang Tingyu a special pardon.',
  ],
  s0604: [
    'On day jiyou, the Emperor halted at Zhengding prefecture and reviewed troops.',
    'On jiyou day, the Emperor reviewed troops at Zhengding.',
  ],
  s0605: [
    'On day xinhai, Labudun was made Left Censor-in-Chief.',
    'On xinhai day, Labudun became Left Censor-in-Chief.',
  ],
  s0606: [
    'On day bingchen, three-tenths of quota land tax was remitted for places in Henan through which the court passed.',
    'On bingchen day, Henan transit districts received a thirty-percent tax remission.',
  ],
  s0607: [
    'On day dingsi, the Emperor halted at Zhangde prefecture and visited the Shrine of Loyalty.',
    'On dingsi day, the Emperor visited the Loyalty Shrine at Zhangde.',
  ],
  s0608: [
    'On day xinyou, the Emperor halted at Baiquan; he conducted the Empress Dowager to visit Bailu Garden.',
    'On xinyou day, the court stopped at Baiquan and the Empress Dowager visited Bailu Garden.',
  ],
  s0609: [
    'The Dzungar taiji Tsewang Dorji Namjazal was murdered by his tribesmen; his elder brother Lama Darja was installed.',
    'Dzungar taiji Tsewang Dorji Namjazal was killed and his brother Lama Darja enthroned.',
  ],
  s0610: [
    'On day guimao, quota land tax was again remitted five-tenths for drought-stricken places in Henan.',
    'On guimao day, drought-hit Henan received a further fifty-percent tax remission.',
  ],
  s0611: [
    'On day yichou, flood relief was distributed in nine counties including Min county in Fujian.',
    'On yichou day, Fujian flood relief reached nine counties including Min.',
  ],
  s0612: [
    'On day jisi, next year\'s quota land tax was remitted for counties including Xiangfu in Henan.',
    'On jisi day, next year\'s Henan taxes were remitted for Xiangfu and other counties.',
  ],
  s0613: [
    'Heyang in Yunnan was shaken by earthquake.',
    'An earthquake struck Heyang in Yunnan.',
  ],
  s0614: [
    'Winter, tenth month, day xinwei: the court visited Mount Song.',
    'In the tenth winter month, on xinwei day, the court visited Mount Song.',
  ],
  s0615: [
    'On day bingzi, the Emperor, conducting the Empress Dowager, halted at Kaifeng prefecture.',
    'On bingzi day, the Emperor and Empress Dowager halted at Kaifeng.',
  ],
  s0616: [
    'On day wuyin, the Emperor visited the ancient Chuitai terrace.',
    'On wuyin day, the Emperor visited ancient Chuitai.',
  ],
  s0617: [
    'E\'erong\'an was promoted to inner grand minister.',
    'E\'erong\'an was made an inner grand minister.',
  ],
  s0618: [
    'Flood relief was distributed for flood damage at Chun\'an in Zhejiang.',
    'Zhejiang\'s Chun\'an received flood relief.',
  ],
  s0619: [
    'On day jiashen, Aibida was transferred to Yunnan governor and Kaitai to Guizhou governor; Yang Xifu was made Hunan governor.',
    'On jiashen day, Aibida, Kaitai, and Yang Xifu received provincial governorships.',
  ],
  s0620: [
    'On day yiyou, quota land tax was remitted for nine prefectures and counties including Qinghe in Jiangsu on account of flood damage.',
    'On yiyou day, Jiangsu flood taxes were remitted in nine districts including Qinghe.',
  ],
  s0621: [
    'On day wuzi, quota land tax was remitted for three prefectures and counties including Yingzhou in Shanxi on account of flood damage.',
    'On wuzi day, Shanxi flood taxes were remitted at Yingzhou and elsewhere.',
  ],
  s0622: [
    'On day jiawu, quota land tax was remitted for forty-six guards, prefectures, and counties including Gu\'an in Zhili on account of flood, hail, and other disasters, and relief grain and funds were lent with distinctions.',
    'On jiawu day, Zhili disaster taxes were remitted and graded relief given in forty-six districts.',
  ],
  s0623: [
    'On day wuxu, flood relief was distributed for flood damage at Liyang and other prefectures and counties in Jiangsu.',
    'On wuxu day, Jiangsu flood relief reached Liyang and other counties.',
  ],
  s0624: [
    'Eleventh month, day xinchou: the Emperor, conducting the Empress Dowager and the empress, returned to the capital.',
    'In the eleventh month, on xinchou day, the court returned to Beijing with the Empress Dowager and empress.',
  ],
  s0625: [
    'On day jiyou, relief was distributed for hail and drought disasters at twenty-eight guards, prefectures, and counties including Pingliang in Gansu.',
    'On jiyou day, Gansu hail and drought relief reached twenty-eight districts including Pingliang.',
  ],
  s0626: [
    'On day renzi, drought-stricken quota land tax was remitted for counties including Lanshan in Shandong, and relief was also distributed.',
    'On renzi day, Shandong drought taxes were remitted at Lanshan and relief was given.',
  ],
  s0627: [
    'On day guichou, Zhur\'er Demte Namjazal plotted rebellion; the resident commander in Tibet Fu Qing and Left Censor-in-Chief Labudun lured and executed him.',
    'On guichou day, Fu Qing and Labudun killed the rebel Zhur\'er Demte Namjazal in Tibet.',
  ],
  s0628: [
    'His partisans Doniro Lobzang Tashi and others led the masses in revolt; Fu Qing and Labudun were killed.',
    'Doniro Lobzang Tashi and other rebels slew Fu Qing and Labudun.',
  ],
  s0629: [
    'On day jiayin, Celen and Yue Zhongqi were ordered to lead troops to Tibet; Yin Jishan was sent to Sichuan to manage grain and pay; Vice President Namjazal was ordered to station in Tibet with Bandi.',
    'On jiayin day, Celen and Yue Zhongqi marched to Tibet while Yin Jishan supplied Sichuan and Namjazal joined Bandi in Lhasa.',
  ],
  s0630: [
    'Jishan was summoned to the capital; Shuming was stationed at Qinghai, with Zhongfobao acting for him.',
    'Jishan was recalled; Shuming took Qinghai command under Zhongfobao\'s acting authority.',
  ],
  s0631: [
    'On day yimao, an edict proclaimed Zhur\'er Demte Namjazal\'s murder of his elder brother Chebudun and his other treasonous acts.',
    'On yimao day, an edict denounced Zhur\'er Demte Namjazal for killing Chebudun and treason.',
  ],
  s0632: [
    'Fu Qing and Labudun were posthumously enfeoffed as first-class earls; Fu Qing\'s son Mingren and Labudun\'s son Genden were enfeoffed as first-class viscounts with hereditary succession.',
    'Fu Qing and Labudun were made posthumous earls; their sons received hereditary viscountcies.',
  ],
  s0633: [
    'Vice President Zhao Hui was ordered to proceed to Tibet and, with Celen, handle subsequent affairs.',
    'Zhao Hui was sent to Tibet with Celen to settle aftermath.',
  ],
  s0634: [
    'On day bingchen, Shuhede was ordered to resume duty in the Grand Council.',
    'On bingchen day, Shuhede returned to Grand Council service.',
  ],
  s0635: [
    'Mu Helin was transferred to Left Censor-in-Chief, and Wu Ling\'an was made Minister of Rites.',
    'Mu Helin became Left Censor-in-Chief and Wu Ling\'an Minister of Rites.',
  ],
  s0636: [
    'Ya\'erhashan was summoned to the capital; Wang Shi was made Jiangsu governor.',
    'Ya\'erhashan was recalled and Wang Shi made Jiangsu governor.',
  ],
  s0637: [
    'On day dingsi, Celen was ordered to select Tibetan officials to assist Bandi in managing Kashag affairs.',
    'On dingsi day, Celen was to choose Tibetan officers to help Bandi run Kashag business.',
  ],
  s0638: [
    'On day yichou, Alihūn was made governor-general of Huguang; Asihan was transferred to Shanxi governor, Wei Zhezhi to Guangxi governor, and Dingchang to Anhui governor.',
    'On yichou day, Alihūn, Asihan, Wei Zhezhi, and Dingchang received new provincial posts.',
  ],
  s0639: [
    'On day wuchen, because Doniro Lobzang Tashi and others had been captured and the rebellion was settled, only Yue Zhongqi was to advance into Tibet; he was ordered to garrison Dajianlu.',
    'On wuchen day, with Tibet pacified, Yue Zhongqi alone was sent forward and ordered to hold Dajianlu.',
  ],
  s0640: [
    'Twelfth month, day gengwu, first of the month: relief was distributed for flood damage at six stations including Gaoli Fort in Mukden.',
    'On the twelfth month\'s gengwu new moon, Mukden flood relief reached six stations including Gaoli Fort.',
  ],
  s0641: [
    'On day renshen, Han grand ministers including Liang Shizheng were for the first time granted yin privilege to study in the boards by rotation.',
    'On renshen day, Liang Shizheng and other Han ministers first received yin study appointments in the boards.',
  ],
  s0642: [
    'On day wuyin, relief was distributed for flood damage at three saltern fields including Guandu in the two Huai circuits.',
    'On wuyin day, the two Huai salterns including Guandu received flood relief.',
  ],
  s0643: [
    'On day gengchen, Shuhede was ordered to survey Zhejiang sea dikes.',
    'On gengchen day, Shuhede was sent to inspect Zhejiang sea walls.',
  ],
  s0644: [
    'On day renwu, Uliassutai assistant commander Sabuhasha was stripped of office and Baode replaced him.',
    'On renwu day, Sabuhasha was dismissed from Uliassutai and Baode took his post.',
  ],
  s0645: [
    'On day wuzi, relief was distributed for flood damage at seven cities including Liaoyang in Mukden and six prefectures and counties including Chengde, and quota taxes were remitted and deferred with distinctions.',
    'On wuzi day, Mukden and Chengde flood victims received relief and graded tax remissions.',
  ],
  s0646: [
    'On day guisi, Tang Suizu, impeached, was dismissed; Yan Ruilong was made acting Hubei governor.',
    'On guisi day, Tang Suizu was removed and Yan Ruilong acted as Hubei governor.',
  ],
  s0647: [
    'Sixteenth year, spring, first month, day gengzi: because of the first southern tour, tax arrears from years 1 through 13 in Jiangsu and Anhui were remitted, this year\'s quota tax in Zhejiang was remitted, and for Zhili provinces convicts under deferred execution three times or more, sentences were reduced.',
    'In the sixteenth year\'s first month, the first southern tour brought tax remissions in the lower Yangtze and lighter punishments in Zhili.',
  ],
  s0648: [
    'Because on the previous year\'s tour to Song and Luoyang, Henan tax arrears before the fourteenth year were remitted.',
    'Henan arrears before year 14 were also remitted for the prior Song-Lu tour.',
  ],
  s0649: [
    'On day xinchou, relief was distributed for last year\'s flood damage at prefectures and counties including Suzhou in Anhui.',
    'On xinchou day, Anhui flood relief reached Suzhou and other districts.',
  ],
  s0650: [
    'On day guimao, because Jiangsu tax arrears had accumulated to more than 2,200,000, an edict ordered reform of abuses in collection and dunning.',
    'On guimao day, an edict attacked Jiangsu collection abuses after arrears passed 2,200,000 taels.',
  ],
  s0651: [
    'On day bingwu, Gansu tax arrears from years 1 through 10 were remitted.',
    'On bingwu day, Gansu arrears for years 1–10 were forgiven.',
  ],
  s0652: [
    'Yan Ruilong was made acting Hubei governor.',
    'Yan Ruilong continued as acting Hubei governor.',
  ],
  s0653: [
    'On day xinhai, the Emperor, conducting the Empress Dowager, set out on the southern tour.',
    'On xinhai day, the southern tour began with the Empress Dowager.',
  ],
  s0654: [
    'On day guichou, three-tenths of this year\'s quota land tax was remitted for places in Zhili and Shandong through which the court passed.',
    'On guichou day, Zhili and Shandong transit districts received a thirty-percent tax cut.',
  ],
  s0655: [
    'Henceforth every southern tour followed this practice.',
    'This remission became standard on later southern tours.',
  ],
  s0656: [
    'On day renxu, Doniro Lobzang Tashi and others were executed.',
    'On renxu day, Doniro Lobzang Tashi and fellow rebels were put to death.',
  ],
  s0657: [
    'On day guihai, drought relief was distributed at fifteen prefectures and counties including She county in Anhui.',
    'On guihai day, Anhui drought relief reached fifteen districts including She.',
  ],
  s0658: [
    'On day jiazi, tax arrears and stored grain were remitted for counties including Zouping in Shandong.',
    'On jiazi day, Shandong arrears and granary stocks were remitted at Zouping and elsewhere.',
  ],
  s0659: [
    'Second month, day xinwei: drought relief was distributed at seven prefectures and counties including Lanshan in Shandong.',
    'In the second month, Shandong drought relief reached seven districts including Lanshan.',
  ],
  s0660: [
    'On day guiyou, tax arrears of saltern households in the two Huai circuits were remitted.',
    'On guiyou day, two Huai saltern arrears were forgiven.',
  ],
  s0661: [
    'On day yihai, Khalkha Prince Dejin Zhab was made Khalkha deputy general, and Duke Gobuden Zhab assistant commander.',
    'On yihai day, Dejin Zhab and Gobuden Zhab received Khalkha frontier commands.',
  ],
  s0662: [
    'On day bingzi, the Emperor, conducting the Empress Dowager, crossed the river and inspected the Tianfei sluice.',
    'On bingzi day, the court crossed the river and inspected Tianfei sluice.',
  ],
  s0663: [
    'On day dingchou, the Gaojia embankment was inspected.',
    'On dingchou day, the Emperor inspected the Gaojia embankment.',
  ],
  s0664: [
    'On day xinsi, quota land tax was remitted with distinctions for seven prefectures and counties including Yi county in Shandong on account of flood damage.',
    'On xinsi day, graded flood tax remissions were granted in seven Shandong counties including Yi.',
  ],
  s0665: [
    'On day yiyou, the Emperor visited Jiaoshan.',
    'On yiyou day, the Emperor visited Jiaoshan.',
  ],
  s0666: [
    'On day bingxu, Dingchang was transferred to Guangxi governor.',
    'On bingxu day, Dingchang became Guangxi governor.',
  ],
  s0667: [
    'On day jichou, the Emperor halted at Suzhou and admonished the gentry and common people of the three Wu regions each to keep to their proper occupations and vigorously reject empty display.',
    'On jichou day at Suzhou, the Emperor urged the Jiangnan elite to shun luxury and return to honest work.',
  ],
  s0668: [
    'On day xinmao, Zhur\'er Demte Namjazal\'s treasonous crimes were proclaimed and punishment was carried out according to law.',
    'On xinmao day, the court published Zhur\'er Demte Namjazal\'s crimes and punished his house by law.',
  ],
  s0669: [
    'Yan Ruilong was stripped of office; Alihūn was ordered to serve concurrently as Hubei governor.',
    'Yan Ruilong was dismissed and Alihūn added Hubei governor to his duties.',
  ],
  s0670: [
    'On day renchen, old and new field rents were remitted for counties including Wujin in Jiangsu; tax arrears from years 1 through 8 were remitted for Xinghua county.',
    'On renchen day, Jiangsu rent and Xinghua arrears were forgiven.',
  ],
  s0671: [
    'On day guisi, Dzungar envoys Erqin and others were received in audience at the Suzhou traveling palace.',
    'On guisi day, Dzungar envoys Erqin were received at the Suzhou palace.',
  ],
  s0672: [
    'Third month, day wuxu, first of the month: the Emperor, conducting the Empress Dowager, visited Hangzhou prefecture.',
    'On the third month\'s wuxu new moon, the court reached Hangzhou with the Empress Dowager.',
  ],
  s0673: [
    'Grain was lent to banner people in Hulan, Heilongjiang, stricken by flood, and this year\'s quota tax on official estates was remitted.',
    'Heilongjiang flood victims received loans and official-estate taxes were remitted.',
  ],
  s0674: [
    'This year\'s transport grain tax was remitted for Chun\'an county in Zhejiang on account of flood damage.',
    'Zhejiang\'s Chun\'an received remission of this year\'s grain transport tax after floods.',
  ],
  s0675: [
    'On day jihai, Zhang Shizai was made Anhui governor.',
    'On jihai day, Zhang Shizai became Anhui governor.',
  ],
  s0676: [
    'On day gengzi, the Emperor visited Fuwen Academy and the Tide-Viewing Tower to review troops.',
    'On gengzi day, the Emperor visited Fuwen Academy and reviewed troops at the Tide-Viewing Tower.',
  ],
  s0677: [
    'On day jiachen, the Hangzhou Han Banner deputy commander post was abolished.',
    'On jiachen day, Hangzhou\'s Han Banner deputy command was cut.',
  ],
  s0678: [
    'On day yisi, the Emperor sacrificed at Yu\'s tomb.',
    'On yisi day, the Emperor offered sacrifice at Yu\'s tomb.',
  ],
  s0679: [
    'On day bingwu, the Emperor, conducting the Empress Dowager, returned and halted at Hangzhou prefecture.',
    'On bingwu day, the court returned to Hangzhou with the Empress Dowager.',
  ],
  s0680: [
    'On day dingwei, troops were reviewed.',
    'On dingwei day, troops were reviewed.',
  ],
  s0681: [
    'On day wushen, Gao Bin was ordered to continue managing the office of Director-General of Rivers while holding Grand Secretary rank.',
    'On wushen day, Gao Bin kept river-director duties with Grand Secretary rank.',
  ],
  s0682: [
    'On day gengxu, the gentry and common people of Zhejiang were admonished to value substance, honor yielding, and have their sons and younger brothers work the fields.',
    'On gengxu day, Zhejiang was urged to practice thrift and keep youths farming.',
  ],
  s0683: [
    'Bandi was ordered to hold the seal of the Resident Imperial Commissioner in Tibet.',
    'Bandi received charge of the Tibet resident commissioner\'s seal.',
  ],
  s0684: [
    'On day xinhai, Eastern Pavilion Grand Secretary Zhang Yunshui died.',
    'On xinhai day, Grand Secretary Zhang Yunshui died.',
  ],
  s0685: [
    'On day guichou, the Emperor, conducting the Empress Dowager, halted at Suzhou prefecture.',
    'On guichou day, the court halted at Suzhou with the Empress Dowager.',
  ],
  s0686: [
    'On day jiayin, flood relief was distributed at counties including Haikang in Guangdong.',
    'On jiayin day, Guangdong flood relief reached Haikang and other counties.',
  ],
  s0687: [
    'On day yimao, the court visited the shrine of Song minister Fan Zhongyan; the garden was bestowed the name Gaoyi, and descendants Fan Hongxing and others were rewarded with sable and coin.',
    'On yimao day, the Emperor honored Fan Zhongyan\'s shrine, named his garden Gaoyi, and rewarded his descendants.',
  ],
  s0688: [
    'On day xinyou, the Emperor, conducting the Empress Dowager, visited Jiangning prefecture.',
    'On xinyou day, the court reached Jiangning with the Empress Dowager.',
  ],
  s0689: [
    'On day renxu, the Emperor sacrificed at the tomb of Ming Taizu.',
    'On renxu day, the Emperor sacrificed at Ming Taizu\'s tomb.',
  ],
  s0690: [
    'On day yichou, Jishan was granted permission to take his own life.',
    'On yichou day, Jishan was ordered to commit suicide.',
  ],
  s0691: [
    'On day dingmao, Chen Shigeng was recalled as Grand Secretary of the Wenyuan Pavilion.',
    'On dingmao day, Chen Shigeng returned as Wenyuan Grand Secretary.',
  ],
  s0692: [
    'Quota land tax was remitted with distinctions for fifteen prefectures and counties including Jiangpu in Jiangsu on account of disaster.',
    'Disaster taxes were remitted with distinctions in fifteen Jiangsu districts including Jiangpu.',
  ],
  s0693: [
    'Summer, fourth month, day xinwei: Jilin general Zhuotai was transferred to Hangzhou general, with Yongxing replacing him.',
    'In the fourth month, Zhuotai became Hangzhou general and Yongxing took Jilin.',
  ],
  s0694: [
    'Quota land tax was remitted for nine guards, prefectures, and counties including Gaolan in Gansu on account of disasters in the thirteenth year.',
    'Gansu disaster taxes for year 13 were remitted in nine districts including Gaolan.',
  ],
  s0695: [
    'On day guiyou, the Emperor inspected Jiangjiaba.',
    'On guiyou day, the Emperor inspected Jiangjiaba.',
  ],
  s0696: [
    'Tax arrears before the ninth year were remitted for Pei county in Jiangnan.',
    'Pei county arrears before year 9 were forgiven.',
  ],
  s0697: [
    'Flood relief was distributed for flood damage at ten prefectures, counties, salterns, and guards including Yongjia in Zhejiang.',
    'Zhejiang flood relief reached ten districts including Yongjia.',
  ],
  s0698: [
    'Flood relief was distributed for the fifteenth-year flood at twelve prefectures and counties including Longchuan in Guangdong.',
    'Guangdong\'s year-15 flood brought relief to twelve districts including Longchuan.',
  ],
  s0699: [
    'On day bingzi, flood relief was distributed for the fifteenth-year flood at twenty-four prefectures, counties, and guards including Shanyang in Jiangsu.',
    'On bingzi day, Jiangsu year-15 flood relief reached twenty-four districts including Shanyang.',
  ],
  s0700: [
    'On day jimao, quota land tax was remitted with distinctions for twenty guards, prefectures, and counties including Didao in Gansu on account of flood, drought, hail, and frost disasters in the fourteenth year.',
    'On jimao day, graded remissions were granted for Gansu year-14 disasters in twenty districts including Didao.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b07.mjs <translation.json>'
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
