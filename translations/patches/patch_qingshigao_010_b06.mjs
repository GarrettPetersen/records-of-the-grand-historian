#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Wang Huan, Chief Minister of the Court of Judicial Review, was ordered to Jiangnan to take overall charge of river works.',
    'Wang Huan was sent to Jiangnan to supervise river works.',
  ],
  s0502: [
    'The King of Ryukyu, Shang Jing, sent envoys with a memorial congratulating the enthronement and presenting tribute.',
    'Ryukyu congratulated the enthronement and presented tribute.',
  ],
  s0503: [
    'On day wuxu, the Dzungar taiji Galdan Tseren sent Khalyu and others with Vice Minister A Kedun and others to the capital to present a memorial.',
    'On wuxu day, Galdan Tseren sent envoys with A Kedun to present a memorial at court.',
  ],
  s0504: [
    'On day yisi, the Dzungar envoys Khalyu and others were received in audience; the Emperor instructed: "Your report that your pastoral lands will not cross the Altai—I greatly commend it.',
    'On yisi day, the Dzungar envoys were received and the Emperor commended their pledge not to pasture beyond the Altai.',
  ],
  s0505: [
    'Moving the Tuo\'erhe and Buyantu cardan posts inland cannot be permitted.',
    'Inward relocation of the Tuo\'erhe and Buyantu cardan posts was rejected.',
  ],
  s0506: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0507: [
    'Fourth year, spring, first month, day jiyou: the Emperor took his seat in the west warm pavilion of the Hall of Heavenly Purity, summoned ninety-nine princes, grand ministers, Hanlin academicians, censors, and governors, governors-general, and education commissioners present in the capital, granted them a banquet, and composed poetry in the Bo Liang form.',
    'In the fourth year\'s first month, on jiyou day, the Emperor banqueted ninety-nine officials at the Hall of Heavenly Purity and composed Bo Liang verse.',
  ],
  s0508: [
    'On day dingmao, land tax for five counties including Ningxia in Gansu stricken by earthquake was remitted.',
    'On dingmao day, earthquake tax relief was granted in Gansu.',
  ],
  s0509: [
    'On day renshen, Grand Secretary Ji Zengyun died.',
    'On renshen day, Grand Secretary Ji Zengyun died.',
  ],
  s0510: [
    'Zhao Guolin was made Grand Secretary; Ren Lanzhi was moved to Minister of Rites, and Chen Dehua made Minister of Revenue.',
    'Zhao Guolin became Grand Secretary; Ren Lanzhi and Chen Dehua received ministry posts.',
  ],
  s0511: [
    'Second month, day jimao: Zhang Qu was moved to Jiangsu governor, and Feng Guangyu made Hunan governor.',
    'In the second month, Zhang Qu and Feng Guangyu were appointed provincial governors.',
  ],
  s0512: [
    'On day bingxu, land tax on saltern lands in four prefectures and counties including Cangzhou in Zhili and four saltern fields including Xingguo stricken by flood was remitted.',
    'On bingxu day, saltern land tax was remitted for flood areas in Zhili.',
  ],
  s0513: [
    'Land tax for four subprefectures, prefectures, and counties including Langdai in Guizhou stricken by hail was remitted.',
    'Hail disaster tax relief was granted in Guizhou.',
  ],
  s0514: [
    'On day yiwei, land tax for Jingyuan in Gansu stricken by wind disaster was remitted.',
    'On yiwei day, Jingyuan received wind-disaster tax relief.',
  ],
  s0515: [
    'On day bingshen, Dzungar tribesmen including Mengke Temur came to submit.',
    'On bingshen day, Mengke Temur and other Dzungars submitted.',
  ],
  s0516: [
    'Land tax for Xianning and Zhen\'an in Shaanxi stricken by flood and for Liugou Guard in Gansu stricken by insects was remitted.',
    'Flood and insect disaster taxes were remitted in Shaanxi and Gansu.',
  ],
  s0517: [
    'On day wuxu, the salt levy in newly opened Miao territories of Yongshun and Yongshuo in Hunan was remitted.',
    'On wuxu day, salt levies were remitted in Hunan\'s new Miao districts.',
  ],
  s0518: [
    'Arrears in land tax for counties including Shangyu in Zhejiang were remitted.',
    'Arrears were forgiven in Zhejiang counties including Shangyu.',
  ],
  s0519: [
    'On day gengzi, Dzungar taiji Galdan Tseren requested the Altai Mountains as border; this was granted.',
    'On gengzi day, the Altai border requested by Galdan Tseren was approved.',
  ],
  s0520: [
    'Land tax for five counties and guards including Zhongxiang in Hubei stricken by drought was remitted.',
    'Drought tax relief was granted in Hubei.',
  ],
  s0521: [
    'Third month, new moon on dingwei; on day jiyou, Yartu was summoned to the capital and Alan Tai made Northern Route Assistant Commander.',
    'In the third month, Yartu was called to Beijing and Alan Tai became Northern Route assistant commander.',
  ],
  s0522: [
    'Arrears in land tax for four prefectures and counties including Suzhou in Anhui were remitted.',
    'Tax arrears were remitted in Anhui.',
  ],
  s0523: [
    'The Ministry of Personnel reported that the period for singled promotion had arrived; the Emperor ordered ministers, censors-in-chief, and vice ministers to recommend men like Lu Longqi and Peng Peng.',
    'The Emperor ordered high officials to recommend men of Lu Longqi and Peng Peng\'s caliber for singled promotion.',
  ],
  s0524: [
    'Land tax for Yingshan in Hubei for the previous year stricken by drought was remitted.',
    'Prior-year drought tax was remitted in Hubei Yingshan.',
  ],
  s0525: [
    'On day jiazi, the Rehe defense circuit was established, headquartered at Chengde Prefecture.',
    'On jiazi day, the Rehe defense circuit was set up at Chengde.',
  ],
  s0526: [
    'Neqin was ordered to assist as Grand Secretary.',
    'Neqin was assigned to assist the Grand Secretaries.',
  ],
  s0527: [
    'On day wuchen, because of drought disaster, land tax for the three provinces of Zhili, Jiangsu, and Anhui was specially remitted.',
    'On wuchen day, drought brought special tax remissions in Zhili, Jiangsu, and Anhui.',
  ],
  s0528: [
    'On day renshen, Wei Tingzhen was made Minister of Works.',
    'On renshen day, Wei Tingzhen became Minister of Works.',
  ],
  s0529: [
    'Relief was distributed to six counties including Wen\'an in Zhili stricken by flood.',
    'Flood relief was granted in Zhili.',
  ],
  s0530: [
    'Summer, fourth month, day dingmao: land tax for Shouzhou in Anhui for the previous year stricken by drought was remitted.',
    'In the fourth month, prior-year drought tax for Shouzhou was remitted.',
  ],
  s0531: [
    'On day wuyin, land tax for seven counties including Danyang in Jiangsu stricken by drought was remitted.',
    'On wuyin day, drought tax relief was granted in Jiangsu.',
  ],
  s0532: [
    'On day xinsi, Zhuang Yougong and three hundred twenty-eight others were granted jinshi and other degrees with distinctions.',
    'On xinsi day, Zhuang Yougong and 328 others received jinshi degrees.',
  ],
  s0533: [
    'On day renwu, arrears in land tax for Changlu for the previous year stricken by drought were remitted.',
    'On renwu day, Changlu drought arrears were forgiven.',
  ],
  s0534: [
    'On day bingxu, because of drought an order was issued calling for memorialized advice.',
    'On bingxu day, the drought prompted an appeal for memorialized advice.',
  ],
  s0535: [
    'The Ministry of Punishments was ordered to clear routine cases and reduce punishments below exile.',
    'The Ministry of Punishments was ordered to review routine prisons and reduce lesser sentences.',
  ],
  s0536: [
    'On day jiawu, land tax for three prefectures and counties including Zhongzhou in Sichuan stricken by drought was remitted.',
    'On jiawu day, Sichuan drought taxes were remitted.',
  ],
  s0537: [
    'On day yiwei, Chen Shiguai was made Censor-in-chief of the Left.',
    'On yiwei day, Chen Shiguai became Left Censor-in-chief.',
  ],
  s0538: [
    'On day guimao, the three khans of the Balipu department of Tibet—Kukum, Yanbu, and Yeling—presented tribute.',
    'On guimao day, three Tibetan khans of Balipu presented tribute.',
  ],
  s0539: [
    'Fifth month, day jiazi: King Yi Zhen of Korea thanked the grant of his state\'s biography in the histories and presented local products.',
    'In the fifth month, Korea\'s king thanked the dynasty for his state\'s historical biography and sent gifts.',
  ],
  s0540: [
    'On day wuchen, the stone embankment at Haining in Zhejiang was rebuilt.',
    'On wuchen day, Haining\'s stone seawall was rebuilt.',
  ],
  s0541: [
    'On day xinwei, retired Grand Secretary Ma Qi died.',
    'On xinwei day, retired Grand Secretary Ma Qi died.',
  ],
  s0542: [
    'On day guiyou, E\'ertai, Zhang Tingyu, and Fu Min were advanced to Grand Tutor; Xu Ben and Neqin to Junior Tutor of the Heir Apparent; Gan Rulai, Haiwang, E Shan, Yin Jichang, Xu Yuanmeng, Sun Jiagan, and Qing Fu to Junior Mentor of the Heir Apparent.',
    'On guiyou day, E\'ertai, Zhang Tingyu, Fu Min, Xu Ben, Neqin, and others received honorific tutor titles.',
  ],
  s0543: [
    'Sixth month, day gengchen: Shuo Se was moved to Shandong governor and Fang Xian to Sichuan governor.',
    'In the sixth month, Shuo Se and Fang Xian were reassigned as governors.',
  ],
  s0544: [
    'On day jiachen, land tax for Chijin Depot in Gansu for the previous year stricken by disaster was remitted.',
    'On jiachen day, prior-year disaster tax for Chijin was remitted.',
  ],
  s0545: [
    'Locusts in seven prefectures of Shandong including Jinan.',
    'Locusts struck seven Jinan-area prefectures in Shandong.',
  ],
  s0546: [
    'The Yellow River burst its banks at Cao County; relief was again distributed to disaster victims in six prefectures and counties stricken by water.',
    'Cao County\'s river breach brought renewed relief to six flooded prefectures and counties.',
  ],
  s0547: [
    'Hail disaster in six prefectures and counties including Qin\'an in Gansu.',
    'Hail struck six prefectures and counties in Gansu including Qin\'an.',
  ],
  s0548: [
    'Autumn, seventh month, day wushen: Imperial son-in-law Celeng memorialized that he had led troops to garrison E\'erhai Xilawusu in the west of the Ergune, and detached forces to garrison the Ergune River, Qiqierlik, E\'erdennizhao, Tamir, and near Wulia Sutai to guard against the Dzungars.',
    'In the seventh month, Celeng reported troop deployments along the Ergune and nearby posts to guard against Dzungars.',
  ],
  s0549: [
    'On day gengxu, because fifteen prefectures and counties including Qin\'an in Gansu were stricken by hail, an order was issued that whether disaster had already formed or not, this year\'s land tax was entirely to be remitted.',
    'On gengxu day, all current-year tax was remitted for fifteen Gansu hail-hit prefectures and counties.',
  ],
  s0550: [
    'On day xinyou, relief was distributed to forty-seven prefectures and counties including Xiangfu in Henan stricken by flood.',
    'On xinyou day, flood relief was granted across Henan.',
  ],
  s0551: [
    'On day renxu, relief was distributed to saltern households in counties and saltern fields including Haifeng in Shandong.',
    'On renxu day, Shandong saltern households received relief.',
  ],
  s0552: [
    'On day jiazi, relief was distributed with distinctions to thirteen prefectures, counties, and guards including Suining in Jiangsu for flood, hail, and other disasters, and to Fang County in Hubei for drought.',
    'On jiazi day, disaster relief was granted in Jiangsu and drought relief in Hubei Fang.',
  ],
  s0553: [
    'On day bingyin, Minister of Personnel Gan Rulai died.',
    'On bingyin day, Gan Rulai died.',
  ],
  s0554: [
    'Hao Yulin was made Minister of Personnel, Imperial clansman Depei made Fujian-Zhejiang governor-general, and Ban Di made Huguang governor-general.',
    'Hao Yulin, Depei, and Ban Di received high appointments.',
  ],
  s0555: [
    'On day jisi, relief was distributed to Suzhou in Anhui stricken by hail.',
    'On jisi day, hail relief was granted in Anhui Suzhou.',
  ],
  s0556: [
    'On day gengshen, An Lechang and other rebel subjects from Ma Lang in Annam came to submit.',
    'On gengshen day, Annam rebels including Yi Chang submitted.',
  ],
  s0557: [
    'Relief was distributed to two counties including Lijin in Shandong stricken by hail.',
    'Hail relief was granted in Shandong Lijin and another county.',
  ],
  s0558: [
    'On day renshen, relief was distributed to prefectures and counties including Kaizhou in Zhili and Haizhou in Jiangsu stricken by flood.',
    'On renshen day, flood relief was granted in Zhili and Jiangsu.',
  ],
  s0559: [
    'Locusts in prefectures and departments including Huai\'an in Jiangsu and Fengyang in Anhui.',
    'Locusts appeared in Jiangsu Huai\'an and Anhui Fengyang.',
  ],
  s0560: [
    'Eighth month, day bingzi: Censor Zhang Mei memorialized charging grand ministers with obstructing the avenue of memorialized speech.',
    'In the eighth month, Zhang Mei accused senior ministers of blocking memorialized criticism.',
  ],
  s0561: [
    'The Emperor rebuked this as infection by Fang Bao\'s bad habits and summoned Manchu and Han ministers who reported affairs to instruct them.',
    'The Emperor denounced Zhang Mei\'s charge as Fang Bao\'s influence and lectured reporting ministers.',
  ],
  s0562: [
    'On day xinsi, relief was distributed to prefectures and counties including Shangqiu in Henan stricken by flood.',
    'On xinsi day, Henan flood victims received relief.',
  ],
  s0563: [
    'On day renwu, Zhang Guangsi\'s achievements in managing the Miao frontier were recorded: he was granted third-rank Light Chariot Commandant, and Huang Tinggui and others received additional titles and grade increases with distinctions.',
    'On renwu day, Zhang Guangsi was rewarded for Miao frontier service and Huang Tinggui and others were honored.',
  ],
  s0564: [
    'On day wuzi, relief was distributed to sixty-six prefectures, counties, guards, and posts including Licheng in Shandong stricken by flood, and collection of new and old land tax was halted.',
    'On wuzi day, Shandong flood relief was granted and tax collection suspended in sixty-six jurisdictions.',
  ],
  s0565: [
    'On day gengyin, Jin Tan county tribute student Jiang Zhensheng presented a handwritten copy of the Thirteen Classics and was granted National University rectory supervisor rank.',
    'On gengyin day, Jiang Zhensheng was rewarded for presenting a manuscript of the Thirteen Classics.',
  ],
  s0566: [
    'Ninth month, new moon on yisi; Acting Guangxi Provincial Commander Tan Xingyi memorialized that because the Zheng clan of Annam monopolized power, Duke Shao of Qinghua Town and Li Zhuo raised troops in internal strife with the Zheng clan, and reported this.',
    'In the ninth month, Tan Xingyi reported civil war in Annam between the Zheng clan and rival forces.',
  ],
  s0567: [
    'On day bingwu, grain transport for Haizhou and Ganyu in Jiangsu stricken by flood was remitted.',
    'On bingwu day, transport grain was remitted for flooded Haizhou and Ganyu.',
  ],
  s0568: [
    'On day wushen, relief was distributed with distinctions to thirty-seven prefectures and counties including Xiangfu in Henan stricken by flood.',
    'On wushen day, differentiated flood relief went to thirty-seven Henan jurisdictions.',
  ],
  s0569: [
    'On day dingsi, the Emperor escorted the Empress Dowager to visit the tombs.',
    'On dingsi day, the Emperor accompanied the Empress Dowager to the tombs.',
  ],
  s0570: [
    'On day gengshen, the Emperor visited Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On gengshen day, the Emperor visited several imperial tombs.',
  ],
  s0571: [
    'Relief was distributed to counties including Linyi in Shandong stricken by flood.',
    'Flood relief was granted in Shandong Linyi and elsewhere.',
  ],
  s0572: [
    'On day guihai, relief was distributed to Zhangye Dongyue Fort stricken by flood.',
    'On guihai day, Zhangye\'s Dongyue Fort received flood relief.',
  ],
  s0573: [
    'Relief was distributed to four prefectures and counties including Dengzhou in Henan stricken by flood, and to three counties including Yuci in Shanxi stricken by drought.',
    'Flood and drought relief went to Henan and Shanxi.',
  ],
  s0574: [
    'Collection of grain transport for Jiangsu and Anhui was ordered halted.',
    'Transport grain collection was suspended in Jiangsu and Anhui.',
  ],
  s0575: [
    'The Emperor escorted the Empress Dowager back to the palace.',
    'The imperial party returned to the palace.',
  ],
  s0576: [
    'On day gengwu, because of illness the Emperor ordered Prince of Harmony Hong Zhou to perform the mid-winter seasonal sacrifice in his stead.',
    'On gengwu day, illness led the Emperor to delegate mid-winter sacrifices to Hong Zhou.',
  ],
  s0577: [
    'One-third of grain and fodder levies for fifteen prefectures and counties including Qin\'an in Gansu was remitted, and this year\'s land tax for prefectures and counties including Lingzhou and Nianbo stricken by flood and hail was remitted.',
    'Tax and fodder relief was granted across Gansu disaster areas.',
  ],
  s0578: [
    'Winter, tenth month, day dingchou: Dzungar Muslim Yisilamu Ding came to submit.',
    'In the tenth month, Yisilamu Ding of the Dzungars submitted.',
  ],
  s0579: [
    'On day gengchen, because Haizhou and three other prefectures and counties in Jiangsu were stricken by flood, arrears in land tax were remitted.',
    'On gengchen day, Jiangsu flood areas received arrears relief.',
  ],
  s0580: [
    'On day jiashen, on the anniversary of the Crown Prince Duanhui, the Emperor visited Tiancun to pour libations.',
    'On jiashen day, the Emperor marked Crown Prince Duanhui\'s anniversary at Tiancun.',
  ],
  s0581: [
    'On day yiyou, relief was distributed to sixty-six prefectures and counties in Shandong stricken by flood, and silver for roof repairs was granted.',
    'On yiyou day, Shandong flood victims received relief and repair funds.',
  ],
  s0582: [
    'On day dinghai, land tax for sixteen prefectures and counties including Xingping in Shaanxi stricken by hail was remitted.',
    'On dinghai day, hail tax was remitted in Shaanxi.',
  ],
  s0583: [
    'On day jichou, Prince Zhuang Yin Lu, Prince of Principle Hong Xi, and others were implicated in a matter; the Imperial Clan Court deliberated stripping titles and confinement.',
    'On jichou day, Yin Lu, Hong Xi, and others faced clan-court punishment.',
  ],
  s0584: [
    'The Emperor said: "Prince Zhuang is to be leniently excused.',
    'The Emperor pardoned Prince Zhuang.',
  ],
  s0585: [
    'Prince of Principle Hong Xi, Beile Hong Chang, and Beizi Hong Pu were all stripped of rank.',
    'Hong Xi, Hong Chang, and Hong Pu lost their titles.',
  ],
  s0586: [
    'Hong Sheng was permanently confined.',
    'Hong Sheng was placed in permanent confinement.',
  ],
  s0587: [
    'Hong Jiao\'s princely rank was fixed by special decree of Our late father; from leniency his princely title was retained but stipend was suspended.',
    'Hong Jiao kept his princely title but lost his stipend by imperial favor.',
  ],
  s0588: [
    '" On day bingshen, Ma Lantai was released.',
    'On bingshen day, Ma Lantai was freed.',
  ],
  s0589: [
    'On day jihai, the wife of the Eleuth zhasake prince of the first rank and Heshuo imperial son-in-law Abao, a Heshuo princess, presented the jade seal transmitted by Gush Khan; an edict ordered its return.',
    'On jihai day, a princess returned Gush Khan\'s jade seal to the court by imperial order.',
  ],
  s0590: [
    'On day renyin, Celeng, Assistant General on the Northern Pacification Left, was summoned to the capital.',
    'On renyin day, Celeng was recalled to Beijing.',
  ],
  s0591: [
    'Hong Yong was enfeoffed as Prince of the Commandery and inherited the Prince of Principle rank.',
    'Hong Yong became commandery prince and inherited the principality.',
  ],
  s0592: [
    'On day guimao, the Emperor visited the Southern Park for battue.',
    'On guimao day, the Emperor hunted at the Southern Park.',
  ],
  s0593: [
    'Eleventh month, day bingwu: the Emperor performed the grand review; he shot five arrows in succession and all hit the mark, and the princes and grand ministers involved were granted silver coins with distinctions.',
    'In the eleventh month, the Emperor\'s grand review hit five successive targets and officials were rewarded.',
  ],
  s0594: [
    'On day wushen, Hao Yulin was made acting Liangjiang governor-general.',
    'On wushen day, Hao Yulin became acting Liangjiang governor-general.',
  ],
  s0595: [
    'On day gengxu, Yin Huiyi was summoned to the capital and Yartu made Henan governor.',
    'On gengxu day, Yin Huiyi was recalled and Yartu became Henan governor.',
  ],
  s0596: [
    'Relief was distributed with distinctions to fifteen prefectures and counties including Andong in Jiangsu stricken by flood.',
    'Differentiated flood relief was granted in Jiangsu.',
  ],
  s0597: [
    'On day renshen, land tax for Ningxia in the following year was remitted.',
    'On renshen day, next year\'s Ningxia land tax was waived.',
  ],
  s0598: [
    'Twelfth month, new moon on guiyou: land tax for six prefectures and guards including Jinxiang in Shandong stricken by flood was remitted.',
    'In the twelfth month, Shandong flood tax was remitted.',
  ],
  s0599: [
    'On day bingzi, transport grain for prefectures and counties including Anji in Zhejiang was remitted, and land tax for Luoshan in Henan stricken by drought was remitted.',
    'On bingzi day, Zhejiang transport grain and Henan drought tax were remitted.',
  ],
  s0600: [
    'On day wuyin, Hong Xi was condemned for asking Antai whether the Dzungars could reach the capital and how the Emperor\'s lifespan stood; death by strangulation was proposed.',
    'On wuyin day, Hong Xi faced proposed execution for questioning Antai about Dzungar and imperial affairs.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b06.mjs <translation.json>'
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
