#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Now, because the four quarters are without dust and the seasons are harmonious and the year abundant, we have again been able to bow before the old tombs, display boundless grief, feast the old men of former days, and give voice to remembrance of the distant past.',
    'Now, with the realm at peace and the harvest full, we can again worship at the ancestral graves, pour out unbounded mourning, feast the elders, and voice our longing for the dead.',
  ],
  s0502: [
    'Thus righteousness joins with the home mulberry and affection exceeds that for the ford at Pei; speaking forever in deep feeling, our gratitude and consolation are truly profound.',
    'Our duty to home and our love for the old ford run deep; stirred beyond measure, we feel gratitude and solace alike.',
  ],
  s0503: [
    'It is fitting to proclaim benevolence broadly and spread it over the realm.',
    'Benevolence should be proclaimed and kindness spread across the land.',
  ],
  s0504: [
    'A general amnesty is proclaimed for the empire.',
    'Let there be a general amnesty for the empire.',
  ],
  s0505: [
    'Half this year\u2019s rent and cloth of Dantu county for migrant households of old is restored.',
    'Dantu\u2019s migrant households receive a half remission of this year\u2019s rent and cloth.',
  ],
  s0506: [
    'In the counties the imperial procession passes through, half the land tax is remitted.',
    'Every county along the route receives a half remission of land tax.',
  ],
  s0507: [
    'Magistrates at the two-thousand-shi rank who have diligently borne royal affairs should receive rewards.',
    'District magistrates who have labored faithfully in royal service deserve a share of favor.',
  ],
  s0508: [
    'Households of those who fell in the three battles for the city and in great battles, and households of the aged, sick, and solitary weak, are all to receive relief and support.',
    'Families of men lost in the three city battles and in great engagements, and households of the aged, ill, and helpless, are to be sustained.',
  ],
  s0509: [
    'Envoys are sent to tour among the people and ask what they suffer.',
    'Envoys will tour the people and inquire into their hardships.',
  ],
  s0510: [
    'Orphans, the aged living alone, widowers and widows, and those afflicted with the six infirmities who cannot support themselves are each granted five hu of grain."',
    'Each orphan, solitary elder, widower or widow, or person disabled by the six infirmities who cannot live without aid receives five hu of grain."',
  ],
  s0511: [
    'Envoys were sent to sacrifice at the tomb of former Jin Minister of Works, the Loyal and Solemn Lord He Wuji.',
    'Envoys were dispatched to offer sacrifice at the grave of Jin\u2019s loyal minister of works, Lord He Wuji.',
  ],
  s0512: [
    'On yichou, the three commanderies of Northern and Southern Pei and Xiapi were restored to favor.',
    'On yichou, Northern Pei, Southern Pei, and Xiapi were granted tax relief.',
  ],
  s0513: [
    'Another edict said: "From of old Jingkou has shown auspicious signs and in recent times has borne the imperial mandate; girdling river and mountain, within and without the splendid heartland, roads run four ways, and the profit of Huai and sea is fully gathered—its cities lofty and bright, its customs pure and single; embracing all strategic advantage, it is truly a famous capital."',
    'A further edict declared: "Jingkou has been blessed since antiquity and marked for empire in our own age—river and hills girdle it, roads meet from four sides, Huai and sea yield their profit, its towns are bright and its people unified; in holding all strategic strength it is truly a great capital."',
  ],
  s0514: [
    'Therefore it could illumine the numinous heart and bring the imperial enterprise to flourishing completion.',
    'Hence it could quicken the imperial spirit and crown the founding with success.',
  ],
  s0515: [
    'In recent years provincial governors have been rotated and soldiers and civilians scattered; market lanes and houses do not reach those of former days.',
    'Lately, as governors have come and gone, troops and people have drifted away and the streets no longer match former bustle.',
  ],
  s0516: [
    'The old home of the imperial foundation, its territory doubly weighty, should be made prosperous and its stature exalted.',
    'The dynasty\u2019s ancestral seat, doubly honored in rank, should be made rich and its prestige restored.',
  ],
  s0517: [
    'Several thousand households willing to move from other provinces may be recruited, given fields and houses, and granted remissions."',
    'Let several thousand households from other provinces who wish to relocate be enrolled, given land and dwellings, and granted tax exemptions."',
  ],
  s0518: [
    'In the fifth month, on bingyin, an edict said: "We were born in this city."',
    'On bingyin of the fifth month an edict declared: "We were born in this city."',
  ],
  s0519: [
    'When Lu Xun ran riot, harm flowed through this region.',
    'When Lu Xun\u2019s rebellion swept the land, this region suffered its ravages.',
  ],
  s0520: [
    'The late Emperor, because the mulberry-and-chestnut homeland was truly one in weal and woe with us, and because in tender youth we shared hardship together, bound in deep affection through peril and ease alike, the traces of old things still remain before our eyes.',
    'The late Emperor held our native place as one body with the throne; in our youth we shared its hardships, and old scenes still live in memory.',
  ],
  s0521: [
    'The years do not stay; more than three decades have passed; the men of that time, old and new, have fallen away with fate.',
    'Time does not wait; thirty years have fled, and the elders of that day have mostly gone to their rest.',
  ],
  s0522: [
    'Looking back on what is past, our grief is doubly deep.',
    'Looking back, our grief is twice as deep.',
  ],
  s0523: [
    'Let a search be made for civil and military gentlemen of that time, commoners and officials, who still survive, and their names be fully reported."',
    'Seek out any civil or military men of that era, gentle or simple, who still live, and report their names in full."',
  ],
  s0524: [
    'Where the person is dead but sons and grandsons remain, generously assess and bestow rewards."',
    'Where the man himself is gone but descendants survive, grant rewards after generous review."',
  ],
  s0525: [
    'The imperial carriage set out by water route from Dantu; on renwu it reached the capital.',
    'The emperor sailed from Dantu and on renwu reached the capital.',
  ],
  s0526: [
    'On bingxu, the state of Pohuang; on renchen, the state of Bada—both sent envoys presenting tribute goods.',
    'On bingxu Pohuang and on renchen Bada each sent envoys with tribute.',
  ],
  s0527: [
    'In the seventh month of autumn, on xinwei, Jiangzhou Inspector Prince of Luling Shao was made Southern Xuzhou Inspector; Prince of Guangling Dan was made Yongzhou Inspector.',
    'On xinwei in the seventh autumn month, Prince of Luling Shao became Southern Xuzhou inspector and Prince of Guangling Dan Yongzhou inspector.',
  ],
  s0528: [
    'On jiyou of the eighth month, General Who Protects the Army Prince of Jianping Hong was made Jiangzhou Inspector.',
    'On jiyou of the eighth month, Prince of Jianping Hong, general who protects the army, became Jiangzhou inspector.',
  ],
  s0529: [
    'On guichou, Prince of Nanfeng Lang was made Xiangzhou Inspector.',
    'On guichou, Prince of Nanfeng Lang was appointed Xiangzhou inspector.',
  ],
  s0530: [
    'In the tenth month of winter, Prince of Guangling Dan was given the new enfeoffment Prince of Suixiang.',
    'In the tenth winter month Prince of Guangling Dan was re-enfeoffed as Prince of Suixiang.',
  ],
  s0531: [
    'On jiachen, General of the Central Army and Yangzhou Inspector Prince of Shixing Jun was made General Who Campaigns in the North, Opening Office with ceremonial equal to the Three Excellencies, and Inspector of Southern Xu and Yan provinces; Southern Xuzhou Inspector Prince of Luling Shao was made Yangzhou Inspector.',
    'On jiachen, Prince of Shixing Jun became northern campaigning general with opening office equal to the Three Excellencies and inspector of Southern Xu and Yan; Prince of Luling Shao became Yangzhou inspector.',
  ],
  s0532: [
    'In the first month of spring of year 27, on xinwei, provisional commandery and county posts in Jiao and Ning provinces were regulated; salaries were to follow metropolitan appointment.',
    'On xinwei in the twenty-seventh year\u2019s first spring month, acting prefectures and counties in Jiao and Ning were regularized and salaries aligned with capital standards.',
  ],
  s0533: [
    'On xinmao, the state of Baekje sent envoys presenting tribute goods.',
    'On xinmao, Baekje sent envoys with tribute.',
  ],
  s0534: [
    'In the second month, on xinchou, General of the Right and Yuzhou Inspector Prince of Nanping Shuo was given the title Pacifying-West General.',
    'On xinchou in the second month, Prince of Nanping Shuo, right general and Yuzhou inspector, was made pacifying-west general.',
  ],
  s0535: [
    '[35] On xinhai, the Northern Wei raided the commanderies of Runan; Zheng Kun, prefect of Chen and Nandun, and Guo Daoyin, prefect of Ruyang and Yingchuan, abandoned their posts and fled.',
    '[35] On xinhai the Northern Wei struck Runan; Zheng Kun of Chen and Nandun and Guo Daoyin of Ruyang and Yingchuan deserted their posts and fled.',
  ],
  s0536: [
    'The Northern Wei attacked Xuanhu city; Chen Xian, acting for Runan commandery, resisted them.',
    'The Northern Wei besieged Xuanhu; Chen Xian, acting Runan administrator, held the city.',
  ],
  s0537: [
    'Because of the military emergency, the salaries of the hundred offices were reduced by one-third.',
    'With war upon the realm, every official salary was cut by a third.',
  ],
  s0538: [
    'In the third month, on yichou, Huainan Prefect Zhuge Chan requested that salaries be reduced like those of the inner hundred offices; thereupon the provinces and commanderies, and all assistant and commandant ranks, were all reduced alike.',
    'On yichou in the third month, Huainan prefect Zhuge Chan asked that local salaries match the capital cut; province, commandery, assistant, and commandant pay were all reduced together.',
  ],
  s0539: [
    'On wuyin, the Imperial Academy was abolished.',
    'On wuyin the Imperial Academy was closed.',
  ],
  s0540: [
    'On yiyou, the newly appointed Minister of Personnel Xiao Sihua was made General Who Protects the Army.',
    'On yiyou, newly appointed minister of personnel Xiao Sihua became general who protects the army.',
  ],
  s0541: [
    'In the fourth month of summer, on renzi, General Who Pacifies the North and Inspector of Xu and Yan provinces Prince of Wuling Jun was reduced in rank to General Who Stabilizes the Army.',
    'On renzi in the fourth summer month, Prince of Wuling Jun was demoted from northern pacifying general and Xu-Yan inspector to stabilizing-army general.',
  ],
  s0542: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0543: [
    'In the sixth month, on dingyou, Palace Attendant Xiao Bin was made Inspector of Qing and Ji provinces.',
    'On dingyou of the sixth month, palace attendant Xiao Bin became inspector of Qing and Ji.',
  ],
  s0544: [
    'In the seventh month of autumn, on gengwu, Pacifying-North General Wang Xuamo was sent on a northern campaign.',
    'On gengwu in the seventh autumn month, pacifying-north general Wang Xuamo was dispatched on the northern expedition.',
  ],
  s0545: [
    'Grand Commandant Prince of Jiangxia Yigong went out and encamped at Pengcheng, commanding all the armies in chief.',
    'Grand Commandant Prince of Jiangxia Yigong marched to Pengcheng to take supreme command of the armies.',
  ],
  s0546: [
    'On yihai, the Northern Wei garrison at Qiaolao abandoned the city and fled.',
    'On yihai the Northern Wei garrison at Qiaolao abandoned the fortress and withdrew.',
  ],
  s0547: [
    'In the intercalary month of winter, on guihai, Xuamo attacked Huatai but did not take it; he was defeated by the barbarians and retreated to Qiaolao.',
    'On guihai of the winter intercalary month, Wang Xuamo assaulted Huatai, failed, was beaten by the enemy, and fell back to Qiaolao.',
  ],
  s0548: [
    'On xinwei, Yongzhou Inspector Prince of Sui Dan sent troops to attack Hongnong city and took it.',
    'On xinwei, Prince of Sui Dan, Yongzhou inspector, sent forces against Hongnong and captured it.',
  ],
  s0549: [
    'On bingxu, they again took Tong Pass city.',
    'On bingxu his troops also took Tong Pass.',
  ],
  s0550: [
    'In the eleventh month, on wuzi, Zou Mountain was lost to the Northern Wei; Cui Xieli, prefect of Lu and Yangping, was captured.',
    'On wuzi of the eleventh month, Zou Mountain fell; Cui Xieli, prefect of Lu and Yangping, was taken prisoner.',
  ],
  s0551: [
    'On jiawu, the army sent by Prince of Sui Dan again attacked Shan city and took it.',
    'On jiawu, Dan\u2019s detached force again stormed Shan city and took it.',
  ],
  s0552: [
    'On guimao, General of the Left Army Liu Kangzu was defeated and killed in battle at Shouyang at the Wuwei garrison.',
    'On guimao, left army general Liu Kangzu was defeated and slain at the Wuwei post near Shouyang.',
  ],
  s0553: [
    'On dingwei, a general amnesty was proclaimed for the empire.',
    'On dingwei a general amnesty was declared.',
  ],
  s0554: [
    'On wuwu of the twelfth month, martial law was imposed within and without.',
    'On wuwu of the twelfth month the court imposed martial law inside and out.',
  ],
  s0555: [
    'On yichou, Attendant of the Retinue Hu Chongzhi, General of the Crown Prince\u2019s Strong Crossbows Zang Chengzhi, and General Who Establishes Might Mao Xizuo were defeated by the barbarians at Xuyi and all were killed.',
    'On yichou, Hu Chongzhi, Zang Chengzhi, and Mao Xizuo were routed by the enemy at Xuyi and all slain.',
  ],
  s0556: [
    'On gengwu, the barbarian pretender ruler led a great host to Guabu.',
    'On gengwu the Northern Wei emperor advanced with a great army to Guabu.',
  ],
  s0557: [
    'On renwu, martial precaution was imposed within and without.',
    'On renwu the court ordered precautionary martial law throughout the realm.',
  ],
  s0558: [
    'On bingxu, new year\u2019s day of the first month of spring in year 28, because the enemy pressed close, the court audience was not held.',
    'On bingxu, new year\u2019s day of year 28, the new-year audience was cancelled because the enemy was near.',
  ],
  s0559: [
    'On dinghai, the Northern Wei withdrew from Guabu.',
    'On dinghai the Northern Wei army retreated from Guabu.',
  ],
  s0560: [
    'On dingyou, they besieged Xuyi city.',
    'On dingyou they laid siege to Xuyi.',
  ],
  s0561: [
    'That month, Pacifying-North General Wang Xuamo retreated from Qiaolao to Lixia.',
    'That month Wang Xuamo withdrew from Qiaolao to Lixia.',
  ],
  s0562: [
    'In the second month, on bingchen, the Northern Wei fled in disorder from Xuyi.',
    'On bingchen of the second month the Northern Wei broke camp and fled from Xuyi.',
  ],
  s0563: [
    'On guiyou, an edict said: "The Xianyun are fiercely rampant, touching several provinces; thinking of it with care, we grieve waking and sleeping."',
    'On guiyou an edict declared: "The northern foe rages across many provinces; we mourn them waking and sleeping."',
  ],
  s0564: [
    'The vicious Jie, wounded and broken, have fled far in flight; the people they maimed should now be restored in season.',
    'The enemy, battered and spent, has fled into the distance; the maimed people must be healed in good time.',
  ],
  s0565: [
    'In all commanderies and counties that suffered bandit raids, order them to return and resume their occupations; cover the exposed dead and bury the bones; relieve and support the hungry and displaced.',
    'Every raided commandery and county is to bring people back to their trades, bury the dead, and feed the refugees.',
  ],
  s0566: [
    'Eastern fieldwork is just beginning; strive to the utmost in encouragement and supervision.',
    'Spring planting has begun; press every effort in encouragement and oversight.',
  ],
  s0567: [
    'The terms for loans and grants should be generously favorable.',
    'Grain loans and relief are to be granted on generous terms.',
  ],
  s0568: [
    'Those who have drifted to lodge along the Yangzi and Huai are all permitted to register where they are and are granted remissions of tax and corvée."',
    'Refugees along the Yangzi and Huai may register locally and receive tax and corvée remissions."',
  ],
  s0569: [
    'On jiaxu, Grand Commandant and Concurrent Minister over the Masses Prince of Jiangxia Yigong was reduced to General of Fast Cavalry, Opening Office with ceremonial equal to the Three Excellencies.',
    'On jiaxu, Prince of Jiangxia Yigong was demoted from grand commandant and minister over the masses to fast-cavalry general with opening office equal to the Three Excellencies.',
  ],
  s0570: [
    'On xinsi, General Who Stabilizes the Army and Inspector of Xu and Yan provinces Prince of Wuling Jun was reduced in rank to Northern Center Commander.',
    'On xinsi, Prince of Wuling Jun was demoted from stabilizing-army general and Xu-Yan inspector to northern center commander.',
  ],
  s0571: [
    'On renwu, the imperial carriage visited Guabu; that day martial precaution was lifted.',
    'On renwu the emperor went to Guabu and martial precaution was lifted the same day.',
  ],
  s0572: [
    'On yiyou of the third month, the imperial carriage returned to the palace.',
    'On yiyou of the third month the emperor returned to the palace.',
  ],
  s0573: [
    'On renchen, General Who Campaigns in the North Prince of Shixing Jun relinquished Southern Xuzhou.',
    'On renchen, Prince of Shixing Jun gave up Southern Xuzhou.',
  ],
  s0574: [
    'On gengzi, Assisting-State General Zang Zhi was made Yongzhou Inspector.',
    'On gengzi, assisting-state general Zang Zhi became Yongzhou inspector.',
  ],
  s0575: [
    'On wushen, Xuzhou Inspector Prince of Wuling Jun was made Southern Xuzhou Inspector.',
    'On wushen, Prince of Wuling Jun moved from Xuzhou to Southern Xuzhou.',
  ],
  s0576: [
    'On jiayin, General Who Protects the Army Xiao Sihua was made General Who Pacifies the Army and Inspector of Xu and Yan provinces.',
    'On jiayin, Xiao Sihua became pacifying-army general and inspector of Xu and Yan.',
  ],
  s0577: [
    'In the fourth month of summer, on guiyou, the state of Bada sent envoys presenting tribute goods.',
    'On guiyou in the fourth summer month, Bada sent envoys with tribute.',
  ],
  s0578: [
    'The Northern Wei pretender Pacifying-South General Lu Shuang and Secretariat Gentleman Lu Xiu submitted in allegiance.',
    'Northern Wei pacifying-south general Lu Shuang and secretariat gentleman Lu Xiu defected to the Song.',
  ],
  s0579: [
    'On wuyin, Lu Shuang was made Sizhou Inspector.',
    'On wuyin, Lu Shuang was appointed Sizhou inspector.',
  ],
  s0580: [
    'On yiyou of the fifth month, the outlaw Sima Shunze styled himself King of Qi and seized Liangzou city.',
    'On yiyou of the fifth month, fugitive Sima Shunze declared himself king of Qi and held Liangzou.',
  ],
  s0581: [
    'On dingsi, the state of Pohuang; on wuxu, the King of Henan—all sent envoys presenting tribute goods.',
    'On dingsi Pohuang and on wuxu the king of Henan each sent envoys with tribute.',
  ],
  s0582: [
    '[37] On jisi, General of Fast Cavalry Prince of Jiangxia Yigong was given the concurrent post of Southern Xuzhou Inspector.',
    '[37] On jisi, Prince of Jiangxia Yigong, fast-cavalry general, also became Southern Xuzhou inspector.',
  ],
  s0583: [
    'On renzi, Left Vice Director of the Masters of Writing He Shangzhi was made Director of the Masters of Writing; Crown Prince Household Steward Xu Zhanzhi was made Vice Director of the Masters of Writing and General Who Protects the Army.',
    'On renzi, He Shangzhi became director of the Masters of Writing, and Xu Zhanzhi vice director and general who protects the army.',
  ],
  s0584: [
    'On renyin, Rear General Prince of Sui Dan was made General Who Pacifies the South and Guangzhou Inspector.',
    'On renyin, Prince of Sui Dan became southern pacifying general and Guangzhou inspector.',
  ],
  s0585: [
    'On renxu of the sixth month, Northern Center Commander Prince of Wuling Jun was made Jiangzhou Inspector; Pacifying-Wu General and Qin Commandery Prefect Liu Xingzu was made Inspector of Qing and Ji provinces.',
    'On renxu of the sixth month, Prince of Wuling Jun became Jiangzhou inspector, and Liu Xingzu of Qin commandery inspector of Qing and Ji.',
  ],
  s0586: [
    'On jiachen of the seventh month of autumn, Pacifying-East General the Wa King Yuji was promoted to Pacifying-East Grand General.',
    'On jiachen in the seventh autumn month, the Wa king Yuji was promoted from pacifying-east general to pacifying-east grand general.',
  ],
  s0587: [
    'On guihai of the eighth month, Liangzou was pacified and Sima Shunze was beheaded.',
    'On guihai of the eighth month Liangzou was taken and Sima Shunze executed.',
  ],
  s0588: [
    'In the tenth month of winter, on guihai, the state of Goguryeo sent envoys presenting tribute goods.',
    'On guihai in the tenth winter month, Goguryeo sent envoys with tribute.',
  ],
  s0589: [
    'In the eleventh month, on renyin, a partial amnesty was proclaimed for the six provinces of the two Yan, Xu, Yu, Qing, and Ji.',
    'On renyin of the eleventh month a partial amnesty was granted to the two Yan, Xu, Yu, Qing, and Ji.',
  ],
  s0590: [
    'That winter, migrants from Pengcheng were resettled at Guabu, and migrants from west of the Huai at Gushu—together about ten thousand households.',
    'That winter Pengcheng refugees were moved to Guabu and Huai-west refugees to Gushu—roughly ten thousand families in all.',
  ],
  s0591: [
    'In the first month of spring of year 29, on jiawu, an edict said: "The six provinces that suffered raids still have not established their livelihoods, [38] and again meet with flood disaster; hunger and distress come in succession."',
    'On jiawu in the twenty-ninth year\u2019s first spring month an edict declared: "Six raided provinces have not yet rebuilt their livelihoods, [38] and now floods have struck again; hunger follows hunger."',
  ],
  s0592: [
    'Orders are to be sent quickly to the military districts to grant relief generously by assessment.',
    'Send urgent orders to the frontier commands to relieve the people generously.',
  ],
  s0593: [
    'Now agricultural work is rising; strive to the utmost in the land\u2019s benefit.',
    'Spring work is underway; exploit every advantage of the soil.',
  ],
  s0594: [
    'Where field seed is needed, supply it as appropriate."',
    'Where seed is lacking, issue it as local conditions require."',
  ],
  s0595: [
    'In the second month, on gengshen, the Northern Wei ruler Tuoba Tao died.',
    'On gengshen in the second month the Northern Wei emperor Tuoba Tao died.',
  ],
  s0596: [
    'On wuwu, [39] the twelfth imperial son Xiuren was established as Prince of Jian\u2019an.',
    'On wuwu, [39] the twelfth prince Xiuren was enfeoffed as Prince of Jian\u2019an.',
  ],
  s0597: [
    'In the fourth month of summer, on wuwu, the state of Heluodan sent envoys presenting tribute goods.',
    'On wuwu in the fourth summer month, Heluodan sent envoys with tribute.',
  ],
  s0598: [
    'Fast-Cavalry Staff Officer Zhang Yong was made Jizhou Inspector.',
    'Zhang Yong, staff officer to the fast-cavalry general, became Jizhou inspector.',
  ],
  s0599: [
    'On jiawu of the fifth month, Xiang Province was abolished and merged into Jing Province.',
    'On jiawu of the fifth month Xiangzhou was abolished and absorbed into Jingzhou.',
  ],
  s0600: [
    'On bingchen, an edict said: "When wickedness is full the man perishes; the barbarian foe has ever been thus numbered; the cruel captive, utterly vicious, is manifest from of old."',
    'On bingchen an edict declared: "Evil ripened brings ruin; the northern foe has always been so; their savage ruler, steeped in cruelty, has shown it since antiquity."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b6.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
