#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the twenty-first year, yihai, spring, first month, new moon on day guiyou: court banquets were suspended.',
    'Guangxu year 21, spring, month 1, new moon guiyou: levee banquets were halted.',
  ],
  s0002: [
    'On day yihai, Japanese troops invaded Weihai.',
    'On yihai day Japanese forces attacked Weihai.',
  ],
  s0003: [
    'On day dingchou, our navy fought the Japanese at the southern shore and was defeated.',
    'On dingchou day the fleet fought Japan off the southern shore and lost.',
  ],
  s0004: [
    'On day jimao, Wu Dacheng first went beyond the passes to inspect the armies.',
    'On jimao day Wu Dacheng first marched out to take command.',
  ],
  s0005: [
    'On day xinsi, Weihai fell and Garrison Commander Dai Zongqian died.',
    'On xinsi day Weihai fell and Dai Zongqian was killed.',
  ],
  s0006: [
    'Nie Shicheng was reassigned to command troops entering the passes.',
    'Nie Shicheng was ordered to lead the army back through the passes.',
  ],
  s0007: [
    'On day dinghai, an edict rebuked Li Hongzhang.',
    'On dinghai day Li Hongzhang was rebuked by edict.',
  ],
  s0008: [
    'On day gengyin, Liugong Island fell, the navy was extinguished, and Ding Ruchang and Brigadier General Liu Buchan died.',
    'On gengyin day Liugong Island fell, the fleet was destroyed, and Ding Ruchang and Liu Buchan died.',
  ],
  s0009: [
    'Zhang Zhidong and Song Song were instructed to defend the coastal, Gan, and Qing River land-and-water key points and to protect Qing and Huai transport routes.',
    'Zhang Zhidong and Song Song were told to hold the coast, Gan, and Qing River lines and keep Qing-Huai grain moving.',
  ],
  s0010: [
    'On day xinmao, Li Hongzhang was appointed plenipotentiary minister of the first rank and sent to Japan.',
    'On xinmao day Li Hongzhang became chief plenipotentiary to Japan.',
  ],
  s0011: [
    'On day renchen, foreign envoys were received at Wenhua Hall.',
    'On renchen day envoys were received at Wenhua Hall.',
  ],
  s0012: [
    'Tao Mo said that dependent households in Kashgar, Yarkand, Khotan, and other places were bought as slaves by the British India Department and should be redeemed by the public authorities; it was approved.',
    'Tao Mo reported Kashgar, Yarkand, and Khotan subjects sold into British Indian slavery and asked state redemption; the court agreed.',
  ],
  s0013: [
    'On day bingchen, Ye Zhichao and Gong Zhao□xing were both sentenced to death.',
    'On bingchen day Ye Zhichao and Gong Zhao□xing were condemned to death.',
  ],
  s0014: [
    'On day jihai, Japan took Wendeng and Ninghai and pressed Yantai.',
    'On jihai day Japan seized Wendeng and Ninghai and threatened Yantai.',
  ],
  s0015: [
    'Song Qing and others fought the Japanese at Taiping Mountain, were defeated, and fled.',
    'Song Qing and others lost to Japan at Taiping Mountain and retreated.',
  ],
  s0016: [
    'Second month, day yisi: Song Qing and Wu Dacheng defeated the Japanese at Liangjiashan; Regimental Commander Liu Yungui and Garrison Commander Zhao Yunqi died in battle.',
    'In month 2, yisi, Song Qing and Wu Dacheng beat Japan at Liangjiashan; Liu Yungui and Zhao Yunqi were killed.',
  ],
  s0017: [
    'Famine victims in Jinzhou and Ningyuan were relieved.',
    'Jinzhou and Ningyuan disaster victims were fed.',
  ],
  s0018: [
    'On day dingwei, Nie Shicheng was ordered to command all defense forces at the Tianjin and Bohai mouths.',
    'On dingwei day Nie Shicheng took the Tianjin-Bohai coastal defenses.',
  ],
  s0019: [
    'On day yiyou, Japanese troops pressed Liaoyang; Chang Shun and Tang Renlian repulsed them.',
    'On yiyou day Japan pressed Liaoyang and Chang Shun and Tang Renlian drove them back.',
  ],
  s0020: [
    'On day gengxu, Japanese troops took Niuzhuang; Wu Dacheng retreated, and the Japanese then raided Yingkou.',
    'On gengxu day Japan took Niuzhuang, Wu Dacheng fled, and Japan struck Yingkou.',
  ],
  s0021: [
    'On day guichou, Ma Yugui defeated the Japanese at Tianzhuangtai.',
    'On guichou day Ma Yugui beat Japan at Tianzhuangtai.',
  ],
  s0022: [
    'On day jiayin, they fought again and were defeated.',
    'On jiayin day they fought again and lost.',
  ],
  s0023: [
    'On day bingchen, Japanese troops took Tianzhuangtai.',
    'On bingchen day Japan seized Tianzhuangtai.',
  ],
  s0024: [
    'Wu Dacheng fled to Jinzhou and Song Qing retreated to Shuangtai.',
    'Wu Dacheng ran to Jinzhou and Song Qing fell back to Shuangtai.',
  ],
  s0025: [
    'On day dingsi, because Wu Dacheng\'s army had been shaken in defeat, he was severely rebuked.',
    'On dingsi day Wu Dacheng was sharply rebuked for his routed army.',
  ],
  s0026: [
    'On day wuwu, Prince Gong and others memorialized to abolish the Naval Office.',
    'On wuwu day Prince Gong and others asked to abolish the Naval Office.',
  ],
  s0027: [
    'Tax levies were remitted for Shangyuan, Jiangning, and other places and for Huai\'an and other guards.',
    'Taxes were forgiven for Shangyuan, Jiangning, and Huai\'an guards.',
  ],
  s0028: [
    'Zhili flood victims were relieved.',
    'Zhili flood victims were fed.',
  ],
  s0029: [
    'On day gengshen, Shenji Camp troops were stationed at Xifengkou.',
    'On gengshen day Shenji Camp soldiers garrisoned Xifengkou.',
  ],
  s0030: [
    'On day guihai, Wu Dacheng was relieved of military duties to assist at the capital; Hunan and Hubei armies were placed under Wei Guangtao.',
    'On guihai day Wu Dacheng left the front for Beijing and Wei Guangtao took the Hunan-Hubei forces.',
  ],
  s0031: [
    'On day yichou, one hundred thousand taels from the treasury were allocated to add relief for disaster victims in Jizhou and other places.',
    'On yichou day 100,000 taels were added for Jizhou flood relief.',
  ],
  s0032: [
    'On day wuchen, Magistrate Xu Qingzhang gathered militia to hold Liaoyang firmly; Yulu was ordered to supply provisions and arms.',
    'On wuchen day Xu Qingzhang\'s militia held Liaoyang and Yulu was told to send food and arms.',
  ],
  s0033: [
    'On day jisi, flood victims in Yutian, Luanzhou, and Leting were relieved.',
    'On jisi day Yutian, Luanzhou, and Leting flood victims were fed.',
  ],
  s0034: [
    'Japanese assassins shot Li Hongzhang and wounded his cheek.',
    'Japanese gunmen wounded Li Hongzhang\'s cheek.',
  ],
  s0035: [
    'On day gengwu, Japanese troops invaded Penghu.',
    'On gengwu day Japan attacked Penghu.',
  ],
  s0036: [
    'Third month, new moon on day renshen: Wu Dacheng was ordered to return to his post as Hunan governor.',
    'In month 3, renshen new moon, Wu Dacheng went back to Hunan as governor.',
  ],
  s0037: [
    'On day guiyou, the river broke at Gaojia Paperworks in Jiyang.',
    'On guiyou day the Gaojia Paperworks levee burst at Jiyang.',
  ],
  s0038: [
    'On day yihai, Japanese troops took Penghu.',
    'On yihai day Japan seized Penghu.',
  ],
  s0039: [
    'On day wuzi, General Jiang Xiyi was stripped of office and arrested for trial.',
    'On wuzi day Jiang Xiyi was dismissed and arrested.',
  ],
  s0040: [
    'On day guisi, Guo Baochang was ordered to assist Liu Kunyi in defense affairs.',
    'On guisi day Guo Baochang was sent to help Liu Kunyi on defense.',
  ],
  s0041: [
    'On day jihai, Li Hongzhang met in conference at Shimonoseki with Japan\'s plenipotentiaries Ito Hirobumi and Mutsu Munemitsu.',
    'On jihai day Li Hongzhang opened Shimonoseki talks with Ito and Mutsu.',
  ],
  s0042: [
    'The treaty was concluded: Korea was made an independent state; southern Liaodong, Taiwan, and the Penghu islands were ceded; war indemnity of two hundred million was paid; treaty ports were added; Japanese merchants were allowed to engage in crafts and manufacture; and troops were temporarily stationed at Weihai.',
    'Peace fixed Korea\'s independence, ceded Liaodong south, Taiwan, and Penghu, set a 200-million indemnity, new ports, Japanese factory rights, and a temporary Weihai garrison.',
  ],
  s0043: [
    'Summer, fourth month, day wushen: capital granary rice was allocated for fair-price sale in Shuntian.',
    'In summer month 4, wushen, Beijing granary rice was set aside for Shuntian fair-price sale.',
  ],
  s0044: [
    'On day jiyou, the Tianjin sea overflowed; Wang Wenshao asked to be dismissed and was not permitted.',
    'On jiyou day Tianjin\'s sea flood brought Wang Wenshao\'s resignation request, which was refused.',
  ],
  s0045: [
    'An edict said: 「Extraordinary disasters and omens—We ruler and ministers must only cultivate ourselves in vigilance and diligence to avert Heaven\'s calamities.',
    'The throne said: 「Rare disasters and omens mean ruler and ministers must repent in vigilance to calm Heaven.',
  ],
  s0046: [
    '」In Gansu the Sala Muslims rebelled, took Xunhua□, and Lei Zhengwan suppressed them.',
    '」Gansu\'s Sala rebels seized Xunhua□ and Lei Zhengwan crushed them.',
  ],
  s0047: [
    'On day gengxu, Circuit Intendants Lian Fang and Wu Tingfang were sent to Yantai to exchange the treaty with Japan.',
    'On gengxu day Lian Fang and Wu Tingfang went to Yantai to exchange ratifications with Japan.',
  ],
  s0048: [
    'On day yimao, an edict said: 「Now that the treaty has been decided, court officials have submitted memorials in succession saying territory cannot be ceded, indemnity cannot be paid, and the treaty should still be voided and war resumed.',
    'On yimao day the throne said: 「With peace set, officials keep memorializing that land must not be lost, money must not be paid, and the treaty should be torn up for war.',
  ],
  s0049: [
    'Their words indeed spring from loyal indignation, yet they do not grasp the court\'s bitter circumstances.',
    'That voice is loyal rage, but it does not see the court\'s bitter straits.',
  ],
  s0050: [
    'Since the war began in haste, not one battle was won.',
    'From the hasty opening of hostilities, not one battle was won.',
  ],
  s0051: [
    'Recently the situation has grown more urgent: in the north they could press Liaodong and Shenyang; in the south they could threaten the capital region.',
    'Lately danger tightened: the north could take Liaodong and Shenyang, the south could strike the capital approaches.',
  ],
  s0052: [
    'Shenyang is the weighty ground of the imperial tombs; the capital is where the altars of state stand.',
    'Shenyang holds the imperial tombs; Beijing holds the altars of state.',
  ],
  s0053: [
    'Moreover the empress dowager has been nourished in ease for more than twenty years—if her traveling guards were alarmed, how could We bear to ask Ourselves?',
    'Moreover the empress dowager has been at ease for twenty years—if her escort were shaken, how could We face Ourselves?',
  ],
  s0054: [
    'Added to this, Heaven shows warning and the sea surges into disaster—war and defense are harder still to handle.',
    'Heaven too has warned, and the sea has risen in disaster—war and defense are harder to manage.',
  ],
  s0055: [
    'Peace and war, weighing both harms together, only then did We turn and fix Our resolve.',
    'Weighing peace and war together, We turned only then and fixed Our mind.',
  ],
  s0056: [
    'The myriad difficulties—the memorialists did not detail them, yet all officials and people under Heaven should jointly understand.',
    'Countless hardships the memorialists never spelled out—yet all under Heaven should understand together.',
  ],
  s0057: [
    'Now that the approved treaty is ratified, We specially proclaim the reasons for handling matters before and after.',
    'Now that the ratified treaty stands, We proclaim how matters were handled before and after.',
  ],
  s0058: [
    'We ruler and ministers must only look to unite in bitter resolve and eliminate accumulated abuses.',
    'Ruler and ministers must stand firm in bitter unity and cut deep-rooted abuses.',
  ],
  s0059: [
    '」On day wuwu, Grand Councillors and all officials were instructed that the peace settlement was complete and that they should not again submit debate.',
    '」On wuwu day the Grand Council and officials were told peace was done and debate must stop.',
  ],
  s0060: [
    'One hundred thousand piculs of Shandong transport grain were retained to relieve Ninghe and other districts.',
    '100,000 piculs of Shandong transport grain were held for Ninghe relief.',
  ],
  s0061: [
    'Yulu was ordered to continue relief supplies for Ning, Jin, and other jurisdictions.',
    'Yulu was told to keep feeding Ning, Jin, and the other afflicted districts.',
  ],
  s0062: [
    'On day jiwei, former Susong county magistrate Sun Baotian was rewarded with fifth-rank Qing Office rank.',
    'On jiwei day ex-magistrate Sun Baotian received fifth-rank Qing Office rank.',
  ],
  s0063: [
    'On day xinyou, after the Dalai Lama completed his ordination, scarfs, prayer beads, and other gifts were bestowed.',
    'On xinyou day, after the Dalai Lama\'s ordination, the court gave scarfs and prayer beads.',
  ],
  s0064: [
    'On day guihai, thirty thousand piculs of Hubei transport grain were allocated for relief in Ning, Jin, and other jurisdictions.',
    'On guihai day 30,000 piculs of Hubei transport grain went to Ning and Jin relief.',
  ],
  s0065: [
    'On day yichou, fair-price grain sale was conducted in the capital.',
    'On yichou day Beijing sold grain at fair price.',
  ],
  s0066: [
    'Li Jingfang was appointed plenipotentiary commissioner for Taiwan handover.',
    'Li Jingfang became plenipotentiary for turning over Taiwan.',
  ],
  s0067: [
    'On day bingyin, Luo Chengzhang and two hundred eighty-two others were granted jinshi and other degrees with distinctions.',
    'On bingyin day Luo Chengzhang and 282 others received jinshi ranks in graded order.',
  ],
  s0068: [
    'On day dingmao, Tang Jingsong was summoned to the capital.',
    'On dingmao day Tang Jingsong was called to Beijing.',
  ],
  s0069: [
    'Fifth month, new moon on day xinwei: flood victims in Linzhang and other counties were relieved.',
    'In month 5, xinwei new moon, Linzhang and other flooded counties were fed.',
  ],
  s0070: [
    'On day gengchen, Jiang Xiyi was sentenced to death.',
    'On gengchen day Jiang Xiyi was executed.',
  ],
  s0071: [
    'On day yiyou, the Russian envoy Keshini and the French envoy Gerard were received at Wenhua Hall.',
    'On yiyou day Russia\'s Keshini and France\'s Gerard were received at Wenhua Hall.',
  ],
  s0072: [
    'On day renchen, Japan returned southern Liaodong to Us.',
    'On renchen day Japan gave back southern Liaodong.',
  ],
  s0073: [
    'On day dingyou, land tax was remitted for Xinhua in Hunan and for Ami, Baoshan, and Kunming in Yunnan, which had suffered disaster the previous year.',
    'On dingyou day last year\'s disaster taxes were forgiven for Hunan\'s Xinhua and Yunnan\'s Ami, Baoshan, and Kunming.',
  ],
  s0074: [
    'Flood and hail victims in Changwu and other counties were relieved.',
    'Changwu and other flood and hail counties were fed.',
  ],
  s0075: [
    'On day gengzi, Tang Jingsong retired.',
    'On gengzi day Tang Jingsong left office.',
  ],
  s0076: [
    'Intercalary fifth month, new moon on day xinmao: twenty thousand taels from the Shandong treasury were allocated to aid relief in Fengtian.',
    'In intercalary month 5, xinmao new moon, 20,000 Shandong taels went to Fengtian relief.',
  ],
  s0077: [
    'On day renyin, more than ten thousand grain-transport boatmen delayed on the Jiangsu and Zhejiang routes were consoled.',
    'On renyin day 10,000-odd Jiangsu-Zhejiang transport boatmen held up on the route were paid off.',
  ],
  s0078: [
    'On day jiachen, Grand Secretary Fu Kun retired.',
    'On jiachen day Grand Secretary Fu Kun left office.',
  ],
  s0079: [
    'On day yisi, Zhili Military Governor Nie Shicheng was ordered to command the Huai Army garrisoned at Tianjin and the Bohai mouths; Jiangxi Provincial Administration Commissioner Wei Guangtao was to command the Zhe Army garrisoned at Shanhaiguan; Sichuan Military Governor Song Qing was to command the Yi Army garrisoned at Jinzhou—all under the Beiyang minister\'s direction.',
    'On yisi day Nie Shicheng took Huai forces at Tianjin-Bohai, Wei Guangtao Zhe forces at Shanhaiguan, and Song Qing Yi forces at Jinzhou, all under Beiyang command.',
  ],
  s0080: [
    'On day guichou, Wu Dacheng was dismissed.',
    'On guichou day Wu Dacheng was removed.',
  ],
  s0081: [
    'On day wuwu, Huizhou-Chaozhou-Jieyang Circuit Intendant Yu Geng was given fourth-rank Beijing Office rank and appointed minister to Japan.',
    'On wuwu day Yu Geng became fourth-rank Beijing officer and envoy to Japan.',
  ],
  s0082: [
    'On day dingmao, an edict said: 「Recently Chinese and foreign officials have submitted plans on current affairs—such as building railways, minting paper currency, making machines, opening mines, converting southern tribute grain transport, reducing troop quotas, creating postal service, training the land army, reorganizing the navy, and founding schools—most take raising revenue and drilling troops as urgent tasks and cherishing merchants and benefiting crafts as the root; all should be undertaken in timely fashion.',
    'On dingmao day the throne said: 「Officials at home and abroad now press reforms—railways, paper money, machinery, mines, ending southern grain transport, cutting troops, post offices, land drill, sea reorganization, schools—with revenue and armies urgent and commerce the root; all should start at once.',
  ],
  s0083: [
    'As for rectifying likin, strictly auditing customs duties, inspecting abandoned fields, and eliminating redundant posts—all greatly benefit state revenue and the people\'s livelihood.',
    'Likin reform, customs audit, waste-land survey, and redundant-post cuts all help revenue and livelihood.',
  ],
  s0084: [
    'Each provincial governor should devise measures suited to local conditions and report.',
    'Each governor should shape local plans and report up.',
  ],
  s0085: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0086: [
    'Sixth month, day jiaxu: Sun Yuweng was relieved on grounds of illness.',
    'In month 6, jiaxu, Sun Yuweng quit for illness.',
  ],
  s0087: [
    'On day dingchou, famine victims in Rehe were relieved.',
    'On dingchou day Rehe famine victims were fed.',
  ],
  s0088: [
    'On day yiyou, Grand Councillor Xu Yongyi was dismissed.',
    'On yiyou day Grand Councillor Xu Yongyi was removed.',
  ],
  s0089: [
    'Lin Shu was made Grand Secretary of the Wuying Hall; Kun Gang, as Minister of Rites, was made Associate Grand Secretary.',
    'Lin Shu became Wuying Grand Secretary and Rites Minister Kun Gang associate grand secretary.',
  ],
  s0090: [
    'Qian Yingpu was appointed Grand Councillor; Weng Tonghe and Li Hongzao were both made concurrent commissioners of the Zongli Yamen.',
    'Qian Yingpu joined the Grand Council; Weng Tonghe and Li Hongzao also served at the Zongli Yamen.',
  ],
  s0091: [
    'On day wuzi, flood victims in Zhongxiang and other places were relieved.',
    'On wuzi day Zhongxiang and other flood districts were fed.',
  ],
  s0092: [
    'Autumn, seventh month, day jiachen: the Qin River broke its banks.',
    'In autumn month 7, jiachen, the Qin River burst.',
  ],
  s0093: [
    'On day yisi, the Yingze River broke its banks.',
    'On yisi day the Yingze River burst.',
  ],
  s0094: [
    'On day dingwei, an edict ordered Li Hongzhang to enter the Grand Council for service.',
    'On dingwei day Li Hongzhang was called into the Grand Council.',
  ],
  s0095: [
    'Wang Wenshao was appointed Zhili governor-general and concurrent Beiyang minister.',
    'Wang Wenshao became Zhili governor-general and Beiyang minister.',
  ],
  s0096: [
    'On day wushen, flood and hail victims in Shangzhou, Qingjian, and other places were relieved.',
    'On wushen day Shangzhou, Qingjian, and other flood and hail counties were fed.',
  ],
  s0097: [
    'On day jiyou, the Song Neo-Confucian Lü Dalin was granted secondary sacrifice in the Confucian temple.',
    'On jiyou day Lü Dalin was added to the Confucian temple.',
  ],
  s0098: [
    'The rivers broke at Shouzhang and Qidong.',
    'The Shouzhang and Qidong levees burst.',
  ],
  s0099: [
    'Feng Sheng\'a was banished to the military garrison.',
    'Feng Sheng\'a was sent to frontier garrison duty.',
  ],
  s0100: [
    'On day wuwu, flood victims in Zhen\'an and other counties were relieved.',
    'On wuwu day Zhen\'an and other flooded counties were fed.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b01.mjs <translation.json>'
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
