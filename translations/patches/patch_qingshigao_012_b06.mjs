#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Farming colonies were established in villages from Urumqi to Luokelun.',
    'Colonies were set up along the Urumqi–Luokelun route.',
  ],
  s0502: [
    'Quota land tax for seventeen prefectures, counties, and guards including Huaining in Anhui stricken by flood and insect disaster the previous year was remitted.',
    'Prior-year flood and insect tax was remitted in seventeen Anhui districts including Huaining.',
  ],
  s0503: [
    'On day renzi, Abdulla was made Akchmu beg of Ush, Ashemte Akchmu beg of Khotan, Gadaimute Akchmu beg of Kashgar, and Edui Akchmu beg of Yarkand.',
    'On renzi day, four western cities received new Akchmu begs: Abdulla at Ush, Ashemte at Khotan, Gadaimute at Kashgar, and Edui at Yarkand.',
  ],
  s0504: [
    'On day jiayin, A Gui\'s seal of office was issued; he was stationed at Yili to handle affairs, with Chang Liang and others assisting jointly.',
    'On jiayin day, A Gui received his seal and took charge at Yili with Chang Liang and others.',
  ],
  s0505: [
    'On day dingsi, quota land tax for ten prefectures, counties, guards, and posts including Renhe in Zhejiang and nine salt-fields including Shuangsui stricken by flood and insect disaster the previous year was remitted.',
    'On dingsi day, prior-year flood and insect tax was remitted in ten Zhejiang districts and nine salt-fields.',
  ],
  s0506: [
    'On day xinyou, relief was given for flood disaster the previous year in fifty-five prefectures, counties, and guards including Shangyuan in Jiangsu.',
    'On xinyou day, Jiangsu flood relief reached fifty-five districts including Shangyuan.',
  ],
  s0507: [
    'On day jiazi, the Emperor went in person to the mourning hall of the Hosoi Hewan Princess and bestowed funeral offerings.',
    'On jiazi day, the Emperor mourned at the Hosoi Hewan Princess\'s hall and sent offerings.',
  ],
  s0508: [
    'On day bingyin, the Emperor visited the residence of the sixth prince, Yong Huang.',
    'On bingyin day, the Emperor called at Prince Yong Huang\'s mansion.',
  ],
  s0509: [
    'On day wuchen, Xinzhu was ordered to proceed to Yarkand to handle affairs.',
    'On wuchen day, Xinzhu was sent to Yarkand.',
  ],
  s0510: [
    'On day jisi, the Pure Noble Consort was advanced to Imperial Noble Consort.',
    'On jisi day, the Pure Noble Consort became Imperial Noble Consort.',
  ],
  s0511: [
    'Batujiergale was made an inner minister.',
    'Batujiergale received appointment as inner minister.',
  ],
  s0512: [
    'On day gengwu, quota land tax for sixteen prefectures and counties including Haifeng in Shandong and three salt-fields including Yongfu stricken by tidal disaster the previous year was remitted.',
    'On gengwu day, prior-year tidal-disaster tax was remitted in sixteen Shandong counties and three salt-fields.',
  ],
  s0513: [
    'Summer, fourth month, day wuzi: because locust nymphs appeared in counties including Lanshan in Shandong, Zhili and Henan were ordered to guard against them.',
    'In the fourth month, locusts in Shandong prompted preventive orders in Zhili and Henan.',
  ],
  s0514: [
    'On day jihai, inner minister Saral died.',
    'On jihai day, inner minister Saral died.',
  ],
  s0515: [
    'Fifth month, day jiachen, new moon: there was a solar eclipse; an edict ordered sincere self-examination and reform.',
    'At the fifth-month new moon on jiachen, an eclipse edict called for self-reform.',
  ],
  s0516: [
    'On day bingwu, it was announced that the Shaanxi-Gansu governor-general\'s jurisdiction would extend only to Urumqi, and Yang Yingju was ordered to return to the interior.',
    'On bingwu day, the northwest command was narrowed to Urumqi and Yang Yingju was recalled inland.',
  ],
  s0517: [
    'On day renzi, an edict said: "When people from the interior go to plant in the forty-eight Mongol banners, forbidding it would harm the people.',
    'On renzi day, an edict argued that banning interior settlers from farming in the forty-eight Mongol banners would only hurt the people.',
  ],
  s0518: [
    'Now colonization at Urumqi and elsewhere is flourishing; guests go there and form settlements, opening wasteland and gaining much livelihood—greatly aiding the state\'s fundamental policy of shepherding the people.',
    'It praised thriving Xinjiang colonies and migrant villages that opened wasteland in line with the state\'s pastoral policy.',
  ],
  s0519: [
    'The ignorant again suspect it burdens the people.',
    'The edict dismissed fears that colonization overburdened the people.',
  ],
  s0520: [
    'This is specially proclaimed for instruction.',
    'The clarification was issued expressly.',
  ],
  s0521: [
    'On day guichou, one hundred sixty-four metropolitan graduates including Bi Yuan were granted jinshi degrees and origin ranks with distinctions.',
    'On guichou day, Bi Yuan and 163 others received jinshi degrees with graded ranks.',
  ],
  s0522: [
    'On day dingsi, quota land tax for seventeen prefectures, counties, and guards including Huaining in Anhui stricken by flood and insect damage the previous year was remitted.',
    'On dingsi day, prior-year flood and insect tax was remitted again in seventeen Anhui districts.',
  ],
  s0523: [
    'On day yichou, the Shaanxi Yujia circuit was abolished; the Yan-Sui circuit was renamed the Yan-Yu-Sui circuit and moved to station at Yulin prefecture, with Bozhou placed under the grain transport circuit.',
    'On yichou day, northwest circuits were reorganized: Yujia was abolished and Yan-Yu-Sui moved to Yulin.',
  ],
  s0524: [
    'On day jisi, Abulbambit of the Kazakhs sent envoys to audience; an imperial letter was bestowed, and requests to graze at Yili and to dwell at places including Barkul were declined.',
    'On jisi day, a Kazakh envoy was received, but grazing and settlement requests at Yili and Barkul were refused.',
  ],
  s0525: [
    'The Barkul Baturu who had earlier raided Urianghai submitted in guilt, returned what had been taken, and was still rewarded with gifts.',
    'A repentant Barkul raider restored his loot and still received imperial gifts.',
  ],
  s0526: [
    'Sixth month, day yihai: the surtax levied in Gansu for the current and coming years was remitted.',
    'In the sixth month, Gansu surtax for this year and next was waived.',
  ],
  s0527: [
    'On day dingyou, Aligun was recalled to the capital.',
    'On dingyou day, Aligun was recalled to Beijing.',
  ],
  s0528: [
    'Haiming was ordered to proceed to Kashgar to handle affairs.',
    'Haiming was sent to Kashgar.',
  ],
  s0529: [
    'Autumn, seventh month, day guimao, new moon: locust-catching was ordered in Rehe.',
    'At the seventh-month new moon, Rehe was ordered to catch locusts.',
  ],
  s0530: [
    'On day jiachen, locusts appeared in departments including Ningyuan in Shanxi and in prefectures and counties including Guangchang in Zhili.',
    'On jiachen day, locusts struck Shanxi and Zhili districts including Ningyuan and Guangchang.',
  ],
  s0531: [
    'On day jiayin, the Hui of villages including Beshiklem rebelled; Aligun suppressed and pacified them.',
    'On jiayin day, Aligun crushed a Hui rebellion in the Beshiklem villages.',
  ],
  s0532: [
    'Asiha was made Jiangxi governor.',
    'Asiha became Jiangxi governor.',
  ],
  s0533: [
    'On day yimao, relief was given for flood disaster in prefectures and counties including Gaoyou in Jiangsu.',
    'On yimao day, Jiangsu flood relief reached districts including Gaoyou.',
  ],
  s0534: [
    'On day wuchen, Yang Ning was made military commander at Kashgar.',
    'On wuchen day, Yang Ning became Kashgar commander.',
  ],
  s0535: [
    'On day jisi, because Russia had stationed troops on four routes—Hening Ridge, the Khatun River, the Irtysh, and Altan Nor—and proclaimed boundary demarcation, A Gui, Chebudengzhabu, and others were instructed to drive them out with troops the following year.',
    'On jisi day, Russian border troops prompted orders for A Gui and others to expel them next year.',
  ],
  s0536: [
    'Eighth month, day bingxu: Antai, Dingchang, and Yongde, ministers stationed at Urumqi, were made general coordinators and listed by name in memorials to the throne.',
    'In the eighth month, Urumqi ministers Antai, Dingchang, and Yongde became chief coordinators with direct memorial rights.',
  ],
  s0537: [
    'Their minister-bodyguards and the like were all, like brigade ministers, each charged with one matter and were to report through Antai and the others for transmission.',
    'Subordinate ministers handled single portfolios and reported through the coordinators.',
  ],
  s0538: [
    'On day jichou, the Emperor, accompanying the Empress Dowager, went on the autumn hunt at Mulan.',
    'On jichou day, the court opened the autumn hunt at Mulan with the Empress Dowager.',
  ],
  s0539: [
    'On day renchen, A Gui was put in overall charge of Yili affairs and appointed commander-in-chief.',
    'On renchen day, A Gui became Yili commander-in-chief with overall authority.',
  ],
  s0540: [
    'On day bingshen, the Emperor, accompanying the Empress Dowager, halted at the Mountain Resort for Avoiding Summer Heat.',
    'On bingshen day, the court stayed at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0541: [
    'On day wuxu, the Emperor, accompanying the Empress Dowager, went to Mulan for the hunt enclosure.',
    'On wuxu day, the Empress Dowager accompanied the Emperor to the Mulan hunt.',
  ],
  s0542: [
    'On day jihai, a Jiangning provincial treasurer was added, stationed at Jiangning prefecture, with jurisdiction over six prefectures: Jiang, Huai, Yang, Xu, Tong, and Hai.',
    'On jihai day, a Jiangning treasurer was created for six Huai-Yang prefectures.',
  ],
  s0543: [
    'The Suzhou provincial treasurer was to govern five prefectures—Su, Song, Chang, Zhen, and Tai—and the Anhui treasurer returned to station at Anqing.',
    'Suzhou took five prefectures; the Anhui treasurer returned to Anqing.',
  ],
  s0544: [
    'Tuo Yong was ordered to fill the Jiangning provincial treasurer post.',
    'Tuo Yong was appointed Jiangning treasurer.',
  ],
  s0545: [
    'Yu Minzhong, Vice Minister of Revenue, was ordered to serve in the Grand Council.',
    'Yu Minzhong joined the Grand Council while retaining his ministry post.',
  ],
  s0546: [
    'Ninth month, day yimao: Zhasak Wangqinjab of the Khalkha Tsetsen Khan, for being unable to restrain his subjects, was stripped of zhasak rank and demoted from beile to defender duke of the state.',
    'In the ninth month, a Khalkha zhasak was demoted for failing to control his people.',
  ],
  s0547: [
    'On day bingchen, Henglu was presented at audience; Shuming acted as Suiyuan City general.',
    'On bingchen day, Henglu had audience while Shuming acted at Suiyuan.',
  ],
  s0548: [
    'On day dingsi, Bade, vice commander at Sansing, because ginseng diggers caused trouble and he could not capture and punish them but instead issued tally-slips, was rebuked by the Emperor as cowardly and ordered executed according to law.',
    'On dingsi day, Bade was executed for cowardice after ginseng riots at Sansing.',
  ],
  s0549: [
    'On day gengshen, Delige was ordered to station at Pizhan to handle affairs.',
    'On gengshen day, Delige was sent to Pizhan.',
  ],
  s0550: [
    'On day guihai, Dutletkelie, envoy of Kazakh Khan Abuzhay, came to audience.',
    'On guihai day, a Kazakh khan\'s envoy had audience.',
  ],
  s0551: [
    'Winter, tenth month, day renshen, new moon: the Emperor, accompanying the Empress Dowager, returned to halt at the Mountain Resort for Avoiding Summer Heat.',
    'At the tenth-month new moon, the court returned to the Summer Resort with the Empress Dowager.',
  ],
  s0552: [
    'On day yihai, because Suzhou provincial treasurer Su Chong\'a had tortured clerks and falsely memorialized embezzlement of more than seven hundred thousand, Liu Tongxun and others investigated and found it all false; he was dismissed and banished to Yili.',
    'On yihai day, Su Chong\'a was exiled to Yili after a false embezzlement case collapsed.',
  ],
  s0553: [
    'On day wuyin, Henglu was made Jilin general and Rusong Suiyuan City general.',
    'On wuyin day, Henglu went to Jilin and Rusong to Suiyuan.',
  ],
  s0554: [
    'On day yiyou, relief was given for flood disaster in the current year in thirteen prefectures, counties, and guards including Suzhou in Anhui.',
    'On yiyou day, Anhui flood relief reached thirteen districts including Suzhou.',
  ],
  s0555: [
    'On day xinmao, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On xinmao day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0556: [
    'Aligun was made chief attendant inner minister.',
    'Aligun became chief attendant inner minister.',
  ],
  s0557: [
    'On day guisi, quota land tax for seven prefectures and counties including Xuanhua in Zhili stricken by flood and hail in the current year was remitted.',
    'On guisi day, Zhili flood and hail tax was remitted in seven districts including Xuanhua.',
  ],
  s0558: [
    'On day jihai, relief was given for drought disaster in twelve prefectures, counties, and guards including Changning in Hunan.',
    'On jihai day, Hunan drought relief reached twelve districts including Changning.',
  ],
  s0559: [
    'Eleventh month, day guimao: quota land tax for twenty-five prefectures, counties, and guards including Shanyang in Jiangsu stricken by flood in the current year was remitted in graded amounts.',
    'In the eleventh month, graded flood tax relief was granted in twenty-five Jiangsu districts including Shanyang.',
  ],
  s0560: [
    'On day dingwei, quota land tax for two salt-fields including Yongli and tidal-washed saltern land in Haifeng county, Shandong, was abolished.',
    'On dingwei day, Shandong abolished tax on ruined salterns at Yongli and Haifeng.',
  ],
  s0561: [
    'On day gengshen, relief was given for flood disaster in the current year in twenty-seven departments, prefectures, counties, and guards including Taozhou in Gansu.',
    'On gengshen day, Gansu flood relief reached twenty-seven districts including Taozhou.',
  ],
  s0562: [
    'On day bingyin, Chang Jun acted as Jiangxi governor.',
    'On bingyin day, Chang Jun acted Jiangxi governor.',
  ],
  s0563: [
    'On day gengwu, reclamation of wasteland on the Jiuquan border was permitted and canals were opened to irrigate fields.',
    'On gengwu day, Jiuquan border wasteland was opened to irrigation.',
  ],
  s0564: [
    'Twelfth month, day bingxu: Song Ali, general at Xi\'an, for accepting gifts from subordinates, was stripped of office and sentenced to strangulation.',
    'In the twelfth month, Xi\'an general Song Ali was condemned to death for taking bribes.',
  ],
  s0565: [
    'The Gansu governor-general was again renamed Shaanxi-Gansu governor-general.',
    'The northwest post was restored to Shaanxi-Gansu governor-general.',
  ],
  s0566: [
    'Because ministers were stationed at Yili, Yarkand, and other places, there was no need to add circuit intendants; affairs were placed under the governor-general\'s jurisdiction.',
    'Western garrison ministers made new circuit posts unnecessary; the governor-general took charge.',
  ],
  s0567: [
    'The Sichuan governor-general ceased concurrent charge of Shaanxi.',
    'Sichuan no longer concurrently governed Shaanxi.',
  ],
  s0568: [
    'Hu Baoyu was transferred to Jiangxi governor, Wu Dashan to Henan governor, and Mingde to Gansu governor.',
    'Hu Baoyu, Wu Dashan, and Mingde received new governorships in Jiangxi, Henan, and Gansu.',
  ],
  s0569: [
    'On day dinghai, Grand Secretary Jiang Pu asked to retire on grounds of illness; a warm edict urged him to remain.',
    'On dinghai day, Jiang Pu\'s retirement plea was gently refused.',
  ],
  s0570: [
    'On day renchen, the Emperor went to Yingtai, bestowed food on begs from Yarkand and other cities who had come to audience, including Sali, and at the Chonghua Palace bestowed tea and fruit.',
    'On renchen day, the Emperor entertained Yarkand begs at Yingtai and Chonghua Palace.',
  ],
  s0571: [
    'On day renchen, Asiha was sentenced to strangulation.',
    'On the same renchen day, Asiha was condemned to death.',
  ],
  s0572: [
    'On day bingshen, Demin was transferred to Jingzhou general.',
    'On bingshen day, Demin became Jingzhou general.',
  ],
  s0573: [
    'Yonggui was made Left Censor-in-chief and ordered to proceed to Kashgar to handle affairs, replacing Shuhede on his return to the capital.',
    'Yonggui became Left Censor and went to Kashgar as Shuhede returned.',
  ],
  s0574: [
    'That year, Korea and Nanzhan presented tribute.',
    'Korea and Nanzhan sent tribute that year.',
  ],
  s0575: [
    'Twenty-sixth year, spring, first month, day renyin: the Hall of Purple Glazed Light was completed; portraits of meritorious ministers, civil and military officials, and Mongol princes and nobles were bestowed, and a banquet was given.',
    'In spring of year 26, the Ziguang Pavilion was finished and meritorious officials were feasted.',
  ],
  s0576: [
    'Relief was given for flood disaster in seven prefectures and counties including Lingling in Hunan and six prefectures and counties including Qinghe in Jiangsu.',
    'Flood relief went to seven Hunan and six Jiangsu districts.',
  ],
  s0577: [
    'On day bingwu, because Ai Bida and Liu Zao had submitted identical evaluations of subordinates for two years, the ministry was ordered to deliberate severely.',
    'On bingwu day, Ai Bida and Liu Zao faced severe review for duplicate personnel reports.',
  ],
  s0578: [
    'Ma Longtu, Zhejiang military commander, for misappropriating public funds, was removed from office and prosecuted.',
    'Zhejiang commander Ma Longtu was dismissed and tried for embezzlement.',
  ],
  s0579: [
    'On day jiayin, Yin Jishan had audience at court; Gao Jin acted as Liangjiang governor-general.',
    'On jiayin day, Yin Jishan had audience while Gao Jin acted at Liangjiang.',
  ],
  s0580: [
    'Haiming was transferred to proceed to Aksu to handle affairs.',
    'Haiming was sent to Aksu.',
  ],
  s0581: [
    'Shuhede was ordered to proceed to Kashgar to handle affairs, and Yonggui to Yarkand.',
    'Shuhede went to Kashgar and Yonggui to Yarkand.',
  ],
  s0582: [
    'On day guihai, Fu Sen acted as Left Censor-in-chief.',
    'On guihai day, Fu Sen acted Left Censor.',
  ],
  s0583: [
    'On day guiyou, the Emperor went in person to Grand Secretary Jiang Pu\'s residence to inquire after his illness.',
    'On guiyou day, the Emperor visited the sick Jiang Pu.',
  ],
  s0584: [
    'E Bao, for shielding the Luchuan county magistrate in a case of condoning bandits, was ordered to the ministry for severe deliberation.',
    'E Bao faced severe review for protecting a magistrate who tolerated bandits.',
  ],
  s0585: [
    'Tuo Yong was made Guangxi governor, and Yongtai acted as Hunan governor.',
    'Tuo Yong went to Guangxi; Yongtai acted in Hunan.',
  ],
  s0586: [
    'On day gengchen, the Emperor, accompanying the Empress Dowager, toured west to Mount Wutai.',
    'On gengchen day, the court began the Wutai pilgrimage with the Empress Dowager.',
  ],
  s0587: [
    'On day renwu, three-tenths of quota land tax in prefectures and counties along the route was remitted.',
    'On renwu day, thirty percent of route taxes was waived.',
  ],
  s0588: [
    'On day jiashen, the Emperor, accompanying the Empress Dowager, paid respects at Tailing.',
    'On jiashen day, the court visited Tailing with the Empress Dowager.',
  ],
  s0589: [
    'On day yiyou, King Li Weiyi of Annan died; his nephew Li Wei was enfeoffed king of Annan.',
    'On yiyou day, Annan\'s king died and his nephew succeeded.',
  ],
  s0590: [
    'On day dinghai, arrears of quota land tax from the eighth to eighteenth years of Qianlong in eight prefectures and counties including Xuanhua and Wanchuan in Zhili were remitted.',
    'On dinghai day, Zhili back taxes from Qianlong 8–18 were forgiven in eight districts.',
  ],
  s0591: [
    'On day guisi, the Emperor, accompanying the Empress Dowager, halted at Tailu Temple.',
    'On guisi day, the pilgrimage halted at Tailu Temple.',
  ],
  s0592: [
    'On day jihai, quota land tax for three prefectures and counties including Jining in Shandong stricken by flood the previous year was remitted.',
    'On jihai day, prior-year flood tax was remitted in three Shandong districts including Jining.',
  ],
  s0593: [
    'Pea seed was loaned to farmers in three counties including Yuanquan in Gansu for trial planting.',
    'Gansu farmers in three counties received pea seed loans for trial crops.',
  ],
  s0594: [
    'Third month, day gengzi: Ermerbi of the Khirgiz Shibochak, coming from Andijan to submit, sent envoys to audience.',
    'In the third month, a Khirgiz defector from Andijan sent envoys to court.',
  ],
  s0595: [
    'On day yisi, the Emperor went to Zhengding prefecture to review troops.',
    'On yisi day, the Emperor reviewed troops at Zhengding.',
  ],
  s0596: [
    'On day wushen, Bai Zhongshan, director-general of the Jiangnan waterways, died; Gao Jin replaced him.',
    'On wushen day, waterways chief Bai Zhongshan died and Gao Jin succeeded him.',
  ],
  s0597: [
    'Tuo Yong was transferred to Anhui governor, and Xiong Xuepeng to Guangxi governor.',
    'Tuo Yong went to Anhui; Xiong Xuepeng to Guangxi.',
  ],
  s0598: [
    'On day jiyou, a resident minister to handle affairs was established at Kashgar; Yiletubu was ordered to assist Yonggui jointly.',
    'On jiyou day, Kashgar gained a resident minister with Yiletubu assisting Yonggui.',
  ],
  s0599: [
    'On day gengxu, relief was given for flood disaster in thirteen prefectures, counties, and guards including Suzhou in Anhui.',
    'On gengxu day, Anhui flood relief reached thirteen districts including Suzhou.',
  ],
  s0600: [
    'On day renzi, the Emperor went to Pingyang Marsh for the hunt enclosure.',
    'On renzi day, the Emperor hunted at Pingyang Marsh.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b06.mjs <translation.json>'
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
