#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day jisi, Ying Gui died.',
    'On jisi, Ying Gui died.',
  ],
  s0402: [
    'Garrison grain for Qiqihar, Heilongjiang, and Mo\'ergen was remitted, and previously loaned seed grain was also restored.',
    'Qiqihar, Heilongjiang, and Mo\'ergen garrison grain was forgiven and seed loans restored.',
  ],
  s0403: [
    'Month 11, yihai: Li Yangcai was executed.',
    'In month 11, on yihai, Li Yangcai was put to death.',
  ],
  s0404: [
    'On day jimao, the winter solstice; heaven was worshipped at the Circular Mound Altar.',
    'On jimao, winter solstice; heaven was sacrificed to at the Round Mound.',
  ],
  s0405: [
    'On day gengchen, court congratulations were suspended.',
    'On gengchen, the court suspended New Year congratulations.',
  ],
  s0406: [
    'On day renwu, Shen Baozhen died.',
    'On renwu, Shen Baozhen died.',
  ],
  s0407: [
    'On day jiashen, Liu Kunyi was made Governor-General of Liangjiang, also serving as Southern Ocean Minister.',
    'On jiashen, Liu Kunyi became Liangjiang governor-general and Southern Ocean minister.',
  ],
  s0408: [
    'On day gengyin, an edict rebuked Chonghou for concluding the Ili treaty with Russia and returning to the capital without leave; the treaty he negotiated was referred to the court for collective deliberation.',
    'On gengyin, the throne rebuked Chonghou for the Ili pact with Russia and his unauthorized return; ministers were to debate the treaty.',
  ],
  s0409: [
    'On day renchen, deed-tax silver was remitted in Shanxi counties heavily hit by disaster.',
    'On renchen, Shanxi disaster counties were freed of deed-tax silver.',
  ],
  s0410: [
    'Month 12, jiyou: an imperial rescript ordered the court\'s deliberation on the Russian treaty to be resubmitted; princes and grand ministers were to deliberate again, and Prince Chun was also to take part and report.',
    'Month 12, jiyou: by rescript the Russian treaty debate was sent back; princes and grand ministers, including Prince Chun, were to reconsider.',
  ],
  s0411: [
    'On day yimao, Chonghou was stripped of office and imprisoned.',
    'On yimao, Chonghou lost his post and was jailed.',
  ],
  s0412: [
    'On day xinyou, an edict ordered repair of community granaries and establishment of community schools.',
    'On xinyou, the throne ordered community granaries repaired and community schools founded.',
  ],
  s0413: [
    'On day jiwei, autumn grain tax was remitted in Yongji and other prefectures and counties.',
    'On jiwei, autumn tax was forgiven in Yongji and other counties.',
  ],
  s0414: [
    'On day bingyin, the combined seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On bingyin, the Grand Temple received the combined seasonal rites.',
  ],
  s0415: [
    'An edict ordered Zhang Zhidong, Groom of the Heir Apparent, to consult on the Russian treaty.',
    'Zhang Zhidong was told to consult on the Russian treaty.',
  ],
  s0416: [
    'On day wuchen, the Shandong Grand Canal was repaired.',
    'On wuchen, Shandong canal works were repaired.',
  ],
  s0417: [
    'That year Korea and Nepal presented tribute.',
    'That year Korea and Nepal paid tribute.',
  ],
  s0418: [
    'Year 6, gengchen; spring, month 1, jisi new moon: banquets were suspended.',
    'In year 6, spring month 1, jisi new moon: court banquets were halted.',
  ],
  s0419: [
    'On day xinwei, Zeng Jize was appointed envoy to Russia to renegotiate the treaty.',
    'On xinwei, Zeng Jize was made minister to Russia to revise the treaty.',
  ],
  s0420: [
    'On day jiaxu, an edict ordered investigation of phantom rolls and illicit labor service in military units.',
    'On jiaxu, troops were told to root out ghost rolls and illegal corvée.',
  ],
  s0421: [
    'On day yihai, Xilin Miao bandits were pacified.',
    'On yihai, Xilin Miao rebels were subdued.',
  ],
  s0422: [
    'On day bingzi, former Minister of Works Li Hongzao was again made a Grand Councilor.',
    'On bingzi, ex-Works Minister Li Hongzao returned to the Grand Council.',
  ],
  s0423: [
    'On day renwu, bandit disorder in Xundian; government troops suppressed it.',
    'On renwu, Xundian rebels were put down by government forces.',
  ],
  s0424: [
    'On day jichou, an edict called on court and country to recommend talent; frontier governors were to tighten border and coastal defense.',
    'On jichou, talent was sought empire-wide and frontier governors told to shore up borders and coasts.',
  ],
  s0425: [
    'Wu Dacheng, Hebei Circuit intendant, was ordered to assist Jilin military affairs; Tongzhengshi Liu Jintang was ordered to assist Xinjiang military affairs.',
    'Wu Dacheng was assigned to Jilin operations and Liu Jintang to Xinjiang operations.',
  ],
  s0426: [
    'On day xinmao, Chonghou\'s crime was fixed; death sentence was pronounced.',
    'On xinmao, Chonghou was sentenced to death.',
  ],
  s0427: [
    'On day guisi, the Board of Revenue memorialized ten provisions for raising military funds; an edict ordered all provinces to carry them out.',
    'On guisi, Revenue submitted ten funding measures and provinces were told to adopt them.',
  ],
  s0428: [
    'That month, land-tax silver on wasteland in Shanxi dependencies was remitted; summer tax on Renhe and other saltern wastelands was also remitted.',
    'That month, Shanxi wasteland tax and Renhe saltern summer tax were forgiven.',
  ],
  s0429: [
    'Month 2, yisi: Yuci tribute melons were permanently exempted.',
    'Month 2, yisi: Yuci melon tribute was abolished forever.',
  ],
  s0430: [
    'On day renxu, Gansu brigade commander Xiao Zhaoyuan, for embezzling army grain, was sentenced to death.',
    'On renxu, Xiao Zhaoyuan was condemned to death for stealing army grain in Gansu.',
  ],
  s0431: [
    'Month 3, jiaxu: relief was granted for Zhili flood victims.',
    'Month 3, jiaxu: Zhili flood victims were relieved.',
  ],
  s0432: [
    'On day yihai, Zuo Zongtang encamped at Hami; Jin Shun held Jinghe; Zhang Yao and Liu Jintang advanced separately toward Ili.',
    'On yihai, Zuo Zongtang moved to Hami, Jin Shun blocked Jinghe, and Zhang Yao and Liu Jintang pressed on Ili.',
  ],
  s0433: [
    'On day jimao, wasteland tax in Hongtong, Xinzhou, and their dependencies was remitted for three or four years.',
    'On jimao, Hongtong and Xinzhou wasteland tax was forgiven for three or four years.',
  ],
  s0434: [
    'Month 4, gengzi: heaven was worshipped at the Circular Mound Altar.',
    'Month 4, gengzi: heaven was sacrificed to at the Round Mound.',
  ],
  s0435: [
    'Garrison troops were re-established at eight Khalkha outposts in Kobdo, including Changjisitai and Honeimailahu.',
    'Eight Kobdo Khalkha outpost garrisons, including Changjisitai and Honeimailahu, were restored.',
  ],
  s0436: [
    'On day bingwu, Sansing established a factory to build steamships.',
    'On bingwu, Sansing set up a shipyard for steamers.',
  ],
  s0437: [
    'On day jiayin, Jiezhou tribal rebels including Hali rose in revolt and were executed.',
    'On jiayin, Jiezhou tribesmen led by Hali rebelled and were put to death.',
  ],
  s0438: [
    'On day renxu, Huang Siyong and 332 others were granted jinshi degrees with distinctions.',
    'On renxu, Huang Siyong and 332 others received jinshi ranks in graded order.',
  ],
  s0439: [
    'On day yichou, Li Changle was transferred to Zhili provincial commander, commanding four Wuyi battalions; Bao Chao was made Hunan provincial commander and summoned to the capital.',
    'On yichou, Li Changle took Zhili command with four Wuyi battalions; Bao Chao became Hunan commander and was called to court.',
  ],
  s0440: [
    'Month 5, bingzi: relief was granted for hail disaster in Luoyang and other counties.',
    'Month 5, bingzi: Luoyang and other hail-hit counties were relieved.',
  ],
  s0441: [
    'On day yiyou, Jiezhou tribal rebels including Gudanba were executed.',
    'On yiyou, Jiezhou tribesmen led by Gudanba were put to death.',
  ],
  s0442: [
    'On day bingxu, at Russian request, Chonghou\'s death sentence was commuted; he remained imprisoned.',
    'On bingxu, Russia\'s plea spared Chonghou execution; he stayed in jail.',
  ],
  s0443: [
    'Month 6, dingyou new moon: relief was granted for Fujian flood victims.',
    'Month 6, dingyou new moon: Fujian flood victims were relieved.',
  ],
  s0444: [
    'On day guimao, Li Hongzhang was given plenipotentiary powers as minister to negotiate a treaty with Brazil.',
    'On guimao, Li Hongzhang was empowered to treat with Brazil.',
  ],
  s0445: [
    'On day jiachen, excess grain collection and forced deductions were forbidden.',
    'On jiachen, grain levies above quota and squeeze tactics were banned.',
  ],
  s0446: [
    'On day bingchen, relief was granted for floods in Guangzhou and elsewhere.',
    'On bingchen, Guangzhou and other flood zones were relieved.',
  ],
  s0447: [
    'On day dingsi, deficient tax on wasteland in Jiaocheng and other counties was remitted.',
    'On dingsi, Jiaocheng and other counties were freed of wasteland shortfalls.',
  ],
  s0448: [
    'Zeng Guoquan was ordered to supervise Shanhaiguan defenses.',
    'Zeng Guoquan was put in charge of Shanhaiguan defense.',
  ],
  s0449: [
    'Month 7, renshen: Zuo Zongtang was summoned to the capital to oversee frontier affairs beyond the passes.',
    'Month 7, renshen: Zuo Zongtang was called to court to run frontier affairs.',
  ],
  s0450: [
    'On day guiyou, Chonghou was released from prison.',
    'On guiyou, Chonghou was freed from jail.',
  ],
  s0451: [
    'On day guiwei, relief was granted for wind disaster in Yangzhou.',
    'On guiwei, Yangzhou storm victims were relieved.',
  ],
  s0452: [
    'On day jiashen, former Zhejiang provincial commander Huang Shaochun was ordered to manage Zhejiang coastal defense.',
    'On jiashen, ex-Zhejiang commander Huang Shaochun took over Zhejiang coastal defense.',
  ],
  s0453: [
    'Month 8, jihai: the commercial treaty with Brazil was concluded.',
    'Month 8, jihai: the Brazil trade treaty was signed.',
  ],
  s0454: [
    'On day wushen, Liu Mingchuan was summoned to the capital.',
    'On wushen, Liu Mingchuan was called to court.',
  ],
  s0455: [
    'On day gengxu, telegraph lines were first installed on the Northern and Southern Ocean circuits.',
    'On gengxu, the North and South Seas circuits got their first telegraph wires.',
  ],
  s0456: [
    'On day renzi, locusts were hunted in Jiangsu.',
    'On renzi, Jiangsu launched locust eradication.',
  ],
  s0457: [
    'On day guihai, Korea reported exchanging envoys with Japan.',
    'On guihai, Korea informed the court of diplomatic exchanges with Japan.',
  ],
  s0458: [
    'Month 9, jisi: Zhejiang provincial commander Wu Changqing was ordered to assist Shandong defense and command coastal defense forces.',
    'Month 9, jisi: Wu Changqing was assigned to Shandong defense and given command of coastal troops.',
  ],
  s0459: [
    'On day gengwu, Yongji tribute persimmon frost was permanently remitted.',
    'On gengwu, Yongji persimmon-frost tribute was abolished forever.',
  ],
  s0460: [
    'On day xinwei, Korea was permitted to send craftsmen to Tianjin to learn manufacture of weapons.',
    'On xinwei, Korea was allowed to train artisans at Tianjin in arms making.',
  ],
  s0461: [
    'On day renshen, disaster relief was granted in Pucheng and other places.',
    'On renshen, Pucheng and other disaster areas were relieved.',
  ],
  s0462: [
    'On day renwu, Zeng Guoquan was granted sick leave; Qi Yuan was ordered to command all armies.',
    'On renwu, Zeng Guoquan took sick leave and Qi Yuan took over all forces.',
  ],
  s0463: [
    'On day guiwei, horse tribute from Liangzhou and Suzhou tribes was reduced.',
    'On guiwei, Liangzhou and Suzhou tribal horse tribute was cut.',
  ],
  s0464: [
    'On day jichou, disaster relief was granted in Ziyang and Qingxi.',
    'On jichou, Ziyang and Qingxi disaster victims were relieved.',
  ],
  s0465: [
    'On day gengyin, India presented musical instruments and a treatise on music composed there; a gold treasure star was bestowed in return.',
    'On gengyin, India sent instruments and a music treatise and received a gold treasure star.',
  ],
  s0466: [
    'On day guisi, tenant rents in the Lalin banner were remitted.',
    'On guisi, Lalin banner tenant rents were forgiven.',
  ],
  s0467: [
    'Winter, month 10, bingwu: the Chamdo Pakpal Hutuktu presented tribute; khata and large satin were bestowed.',
    'Winter month 10, bingwu: Chamdo\'s Pakpal Hutuktu paid tribute and received khata and satin.',
  ],
  s0468: [
    'On day jiyou, the Dongming River burst its banks.',
    'On jiyou, the Dongming River broke.',
  ],
  s0469: [
    'On day xinhai, former Minister of Personnel Mao Changxi was ordered to serve in the Zongli Yamen.',
    'On xinhai, ex-Personnel Minister Mao Changxi was assigned to the Zongli Yamen.',
  ],
  s0470: [
    'On day jiayin, flood relief was granted in Weichang, Hailongcheng, and Heze.',
    'On jiayin, Weichang, Hailongcheng, and Heze flood victims were relieved.',
  ],
  s0471: [
    'On day jiazi, an imperial rescript: Prince Chun was to manage Shenjiying affairs.',
    'On jiazi, by rescript Prince Chun took charge of the Shenjiying.',
  ],
  s0472: [
    'Month 11, yichou new moon: Lecturer Xu Jingcheng was appointed envoy to Japan.',
    'Month 11, yichou new moon: Xu Jingcheng was made minister to Japan.',
  ],
  s0473: [
    'On day jisi, Quanqing was made Grand Secretary of Tirenge; Ling Gui, Minister of Personnel, was made assistant grand secretary.',
    'On jisi, Quanqing became Tirenge grand secretary and Personnel Minister Ling Gui assistant grand secretary.',
  ],
  s0474: [
    'On day jiashen, the winter solstice; heaven was worshipped at the Circular Mound Altar.',
    'On jiashen, winter solstice; heaven was sacrificed to at the Round Mound.',
  ],
  s0475: [
    'On day bingxu, Jianghua Yao bandits were pacified.',
    'On bingxu, Jianghua Yao rebels were subdued.',
  ],
  s0476: [
    'On day guisi, overdue taxes in Yongping and its dependencies were remitted.',
    'On guisi, Yongping and affiliated districts were freed of back taxes.',
  ],
  s0477: [
    'Month 12, bingwu: Yang Changjun was ordered to jointly manage Xinjiang postwar affairs.',
    'Month 12, bingwu: Yang Changjun was assigned to Xinjiang recovery work.',
  ],
  s0478: [
    'On day bingchen, tax quotas for water damage in Wen\'an were remitted.',
    'On bingchen, Wen\'an flood-damaged tax quotas were forgiven.',
  ],
  s0479: [
    'On day gengshen, an imperial rescript: the Shenjiying was to select officers and men to go to Tianjin to learn manufacture of foreign firearms.',
    'On gengshen, by rescript Shenjiying troops were sent to Tianjin to learn Western gun making.',
  ],
  s0480: [
    'On day xinyou, the grain-transport canal was dredged.',
    'On xinyou, the Grand Canal transport channel was cleared.',
  ],
  s0481: [
    'That winter, prayers for snow were offered repeatedly.',
    'That winter, snow was prayed for again and again.',
  ],
  s0482: [
    'That year Korea and Nepal presented tribute.',
    'That year Korea and Nepal paid tribute.',
  ],
  s0483: [
    'Year 7, xinsi; spring, month 1, jiazi new moon: banquets were suspended.',
    'In year 7, spring month 1, jiazi new moon: court banquets were halted.',
  ],
  s0484: [
    'Shen Guifen died.',
    'Shen Guifen died.',
  ],
  s0485: [
    'On day guiyou, an edict ordered all provinces to recommend filial and upright scholars with care.',
    'On guiyou, provinces were told to choose filial and upright candidates carefully.',
  ],
  s0486: [
    'On day yihai, the Dalai Lama sent envoys presenting khata and incense; they were ordered to offer them at Huiling; khata and satin were bestowed in return.',
    'On yihai, the Dalai Lama sent khata and incense; the gifts were presented at Huiling and rewarded with khata and satin.',
  ],
  s0487: [
    'On day wuyin, six years\' overdue tax and grain quotas were remitted on Zhejiang saltern collapse and wasteland in Renhe and other fields, and on newly reclaimed wasteland in prefectures, counties, and garrisons.',
    'On wuyin, Zhejiang saltern wasteland, collapsed fields, and six years of new-reclamation arrears were forgiven.',
  ],
  s0488: [
    'On day xinmao, Vietnam requested government troops to help suppress lingering bandits; it was refused.',
    'On xinmao, Vietnam\'s plea for troops against old bandits was denied.',
  ],
  s0489: [
    'Six years\' overdue taxes in Haiyang were remitted.',
    'Haiyang back taxes for six years were forgiven.',
  ],
  s0490: [
    'On day renchen, Zuo Zongtang was made a Grand Councilor, directed the Board of War, and also served in the Zongli Yamen.',
    'On renchen, Zuo Zongtang joined the Grand Council, ran the War Board, and served in the Zongli Yamen.',
  ],
  s0491: [
    'Overdue levies on mercury works at Guizhu, Xingyi, Bazhai, and elsewhere were remitted.',
    'Arrears on Guizhu, Xingyi, Bazhai, and other cinnabar works were cleared.',
  ],
  s0492: [
    'Month 2, guisi new moon: Li Hongzhang was ordered to plan Shanhaiguan defense and command all forces.',
    'Month 2, guisi new moon: Li Hongzhang took charge of Shanhaiguan and all defending troops.',
  ],
  s0493: [
    'Zeng Guoquan was made Governor-General of Shaanxi-Gansu.',
    'Zeng Guoquan became Shaanxi-Gansu governor-general.',
  ],
  s0494: [
    'On day wuxu, Japanese envoy Togaki came to negotiate Ryukyu terms; no agreement was reached; coastal defenses were ordered on alert.',
    'On wuxu, Japan\'s Togaki failed on Ryukyu talks and the coast was put on guard.',
  ],
  s0495: [
    'On day jiyou, the Laolong stone embankment at Xiangyang was repaired.',
    'On jiyou, Xiangyang\'s Laolong stone dike was rebuilt.',
  ],
  s0496: [
    'On day xinhai, Jiyang dam works were repaired.',
    'On xinhai, Jiyang dam repairs were carried out.',
  ],
  s0497: [
    'On day jiayin, Tongzhengsi Counsellor Liu Xihong was stripped of office for falsely accusing Li Hongzhang.',
    'On jiayin, Liu Xihong lost his post for slandering Li Hongzhang.',
  ],
  s0498: [
    'Month 3, jiazi: rents on official fields in Jinzhou were remitted.',
    'Month 3, jiazi: Jinzhou official-field rents were forgiven.',
  ],
  s0499: [
    'On day dingmao, batteries at Jiaoshan Dutian Temple were rebuilt.',
    'On dingmao, Jiaoshan Dutian Temple forts were reconstructed.',
  ],
  s0500: [
    'On day jisi, Li Fengbao was concurrently appointed envoy to Italy and Austria; Li Shuchang was appointed envoy to Japan.',
    'On jisi, Li Fengbao was made minister to Italy and Austria as well, and Li Shuchang minister to Japan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b05.mjs <translation.json>'
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
