#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'In the fourth month of summer, day yimao, the imperial carriage returned from Lanling.',
    'On yimao day in the fourth month of summer, the emperor returned from Lanling.',
  ],
  s0502: [
    'An edict granted widowers, widows, orphans, and solitaries in deepest poverty graded relief and support.',
    'An edict ordered graded relief for widowers, widows, orphans, and the destitute alone.',
  ],
  s0503: [
    'In the fifth month, day dingyou, Director of the Masters of Writing He Jingrong was dismissed.',
    'On dingyou day in the fifth month, He Jingrong was removed as Director of the Masters of Writing.',
  ],
  s0504: [
    'In the ninth month of autumn, day jichou, an edict said: "Near and far this year, rain and dew have been well timed, the harvest is in, and we hope for granaries full to the brim—let the people take ease and joy in this.',
    'On jichou day in the ninth month of autumn an edict said, "Near and far, rain has come in season, the harvest is home, and we look for full granaries—let the people rest in this good fortune.',
  ],
  s0505: [
    'All crimes under Heaven, heavy or light, whether discovered or not, whether sought but not yet captured—all are pardoned.',
    'Every crime under Heaven, light or heavy, discovered or not, sought but not yet taken—all are pardoned.',
  ],
  s0506: [
    'Embezzlement, seizure, or dissipation of government goods, regardless of amount, is also fully remitted.',
    'Embezzlement or waste of government property, in any amount, is likewise forgiven.',
  ],
  s0507: [
    'Where fields lie fallow, drought or flood prevented harvest, no records exist from the time, taxes should be pursued, or harvest failed official standards—all are suspended.',
    'Fallow fields, drought and flood losses, missing records, back taxes, and failed harvests by official measure—all collections stop.',
  ],
  s0508: [
    'All cases of ranked officials\' arrears in provinces and inspectorates are fully pardoned.',
    'Arrears owed by ranked officials in every province and inspectorate are fully forgiven.',
  ],
  s0509: [
    'Those who left land and home to follow food in famine may all return to their trades, with taxes remitted five years."',
    'Those who fled hunger and abandoned their land may all return to their trades, with five years\' tax remission."',
  ],
  s0510: [
    'In the twelfth month of winter, heavy snow fell—three feet on level ground.',
    'In the twelfth month of winter snow piled three feet deep on level ground.',
  ],
  s0511: [
    'In the eleventh year, spring, third month, day gengchen, an edict said: "Ancient emperors and kings, when royal virtue had not yet faded, could dwell at ease in their inner halls and govern in silence from the cliff gallery.',
    'On gengchen day in the third month of the eleventh year an edict said, "In olden days, when royal virtue still ran deep, rulers could sit quietly in their inner halls and govern in silence from the cliff gallery.',
  ],
  s0512: [
    'Since the Great Way sank, a torrent of decay has flowed on; striving and rivalry grow daily, and false sentiment grows ever more rife.',
    'Since the Great Way fell, decay has rushed on; rivalry grows by the day, and false feeling ever more prevails.',
  ],
  s0513: [
    'I have taken the throne with the screen at my back, and nearly half a century has passed.',
    'I have ruled with the screen at my back, and nearly half a century has gone by.',
  ],
  s0514: [
    'Before the night watch is divided I am already at work on government;',
    'Before the night watch ends I am already at work on affairs of state;',
  ],
  s0515: [
    'when the sun sinks west I have not yet taken a meal.',
    'when the sun sinks west I have not yet eaten.',
  ],
  s0516: [
    'Even in retreat I dress in plain cloth and eat no more than wild greens.',
    'Even at rest I wear plain cloth and taste nothing finer than wild greens.',
  ],
  s0517: [
    'I do not prize the chariots of ten thousand for wealth, nor the four seas for riches;',
    'I do not count the chariots of ten thousand as wealth, nor the four seas as riches;',
  ],
  s0518: [
    'I wish only that the hundred millions live in peace and the people below be secure.',
    'I wish only that the hundred millions know peace and the people below live in order.',
  ],
  s0519: [
    'Though I think thrice before acting, a hundred concerns still miss the mark.',
    'Though I think thrice before I act, a hundred plans still go wrong.',
  ],
  s0520: [
    'All distant and near appointments, inner and outer regulations, garrisons, courier posts, lodges, smelters, market wharves, bridge tolls, ferry taxes, tax-exempt estates, old and new magistrates, patrol troops and border garrisons—where anything burdens the people, the Masters of Writing and each province and commandery shall list them at once; whatever is reported shall be removed to ease the people\'s grief."',
    'Every distant post and inner rule, every garrison, relay station, lodge, smelter, market wharf, bridge toll, ferry tax, tax-exempt estate, old or new magistrate, patrol troop, and border garrison—where anything harms the people, the Masters of Writing and each province and commandery shall report it at once, and what is named shall be cut away to ease the people\'s pain."',
  ],
  s0521: [
    'In the fourth month of summer, Wei sent envoys on a friendly mission.',
    'In the fourth month of summer Wei sent envoys on a friendly visit.',
  ],
  s0522: [
    'In the tenth month of winter, day jiwei, an edict said: "From Yao and Shun, commutation of punishment was permitted; in middle antiquity, by ancient practice, the guilty could buy off punishment with goods. Subordinate officials therefore were not without fraud—hence an order one day forbade it again.',
    'On jiwei day in the tenth month of winter an edict said, "From Yao and Shun onward, bodily punishment could be redeemed; in middle antiquity the guilty paid goods to buy off penalty, and officials were not without fraud—so an order one day forbade it again.',
  ],
  s0523: [
    'Rivers are hard to dam, and the human heart is ever precarious—this goes against the Buddhist teaching of compassion and harms the foreign faith\'s virtue of cherishing life.',
    'Rivers are hard to block, and the human heart is ever fragile—this offends the inner teaching of compassion and wounds the outer faith\'s virtue of cherishing life.',
  ],
  s0524: [
    'The Book of Documents says: "Better to miss the irregular than to punish the innocent.',
    'The Book of Documents says, "Better to err than to punish the innocent,',
  ],
  s0525: [
    '" Commutation of bodily punishment may be opened again; all may redeem by payment."',
    '" Commutation may be opened again; all may redeem by payment."',
  ],
  s0526: [
    'In Zhongdatong year 1, spring, first month, day dingwei, at Jianling pass in Qu\'e county a stone qilin moved; a great serpent fought in the pass, and one was wounded and fled.',
    'On dingwei day in the first month of spring in Zhongdatong 1, at Jianling pass in Qu\'e county a stone qilin stirred; a great serpent fought in the pass, one was wounded, and fled.',
  ],
  s0527: [
    'On day guichou, Jiaozhou Inspector Yang Piao took Jiaozhi\'s Jianing city; Li Ben fled into a Liao cave; Jiaozhou was pacified.',
    'On guichou day Jiaozhou inspector Yang Piao took Jianing city in Jiaozhi; Li Ben fled into a Liao cave, and Jiaozhou was pacified.',
  ],
  s0528: [
    'On day yisi in the third month, a general amnesty: for magistrates who embezzled, seized, or dispersed government goods, or military grain and armor—all normally excluded from amnesty—if before the first month of the eleventh year, full grace; after that month, pardon with added penalties;',
    'On yisi day in the third month a general amnesty was proclaimed: embezzlement, seizure, or dispersal of government goods or military grain and armor—matters normally excluded—before the first month of the eleventh year received full grace; after that month, pardon with added penalties;',
  ],
  s0529: [
    'those who fled, rebelled, or drifted for reasons or hunger after losing land may return to their trades, with five years\' tax remission and corvée suspended;',
    'those who fled, rebelled, or drifted in hunger after losing land might return to their trades, with five years\' tax remission and corvée suspended;',
  ],
  s0530: [
    'those held in custody shall each return to their home commandery; old estates if still there are fully restored.',
    'those held in custody were sent home to their commanderies; old estates, where they remained, were fully restored.',
  ],
  s0531: [
    'On day gengxu, the imperial procession went to Tongtai Temple for a great assembly, lodged at the temple precinct, and lectured on the Gold-letter Three Wisdoms Sutra.',
    'On gengxu day the imperial procession went to Tongtai Temple for a great assembly, lodged in the temple precinct, and lectured on the Gold-letter Three Wisdoms Sutra.',
  ],
  s0532: [
    'In the fourth month of summer, day bingxu, at Tongtai Temple the lecture closed and a dharma assembly was held.',
    'On bingxu day in the fourth month of summer the lecture at Tongtai Temple closed and a dharma assembly was held.',
  ],
  s0533: [
    'A general amnesty was proclaimed and the era name changed.',
    'A general amnesty was proclaimed and the era name changed.',
  ],
  s0534: [
    'Filial sons, obedient brothers, strong farmers, and eldest sons received one rank of nobility; palace guards civil and military received graded gifts.',
    'Filial sons, obedient brothers, strong farmers, and eldest sons received one rank of nobility; court guards civil and military received graded gifts.',
  ],
  s0535: [
    'That night, Tongtai Temple burned.',
    'That night Tongtai Temple burned.',
  ],
  s0536: [
    'In the sixth month, day xinsi, a sound filled the heavens like wind and rain colliding.',
    'On xinsi day in the sixth month a sound filled the sky like wind and rain striking together.',
  ],
  s0537: [
    'In the seventh month of autumn, day xinyou, Prince of Wuchang Xu was made Eastern Yangzhou Inspector.',
    'On xinyou day in the seventh month of autumn Prince of Wuchang Xu was made Eastern Yangzhou inspector.',
  ],
  s0538: [
    'On day jiazi, an edict said: "Beasts know their mothers but not their fathers; worthless sons surpass beasts in this—they do not know either parent.',
    'On jiazi day an edict said, "Beasts know their mothers but not their fathers; worthless sons are worse—they know neither parent.',
  ],
  s0539: [
    'Many violate royal law, and old people suffer for it.',
    'Many break royal law, and the aged suffer for it.',
  ],
  s0540: [
    'Imprisoning the aged is deeply pitiable.',
    'To imprison the aged is deeply pitiable.',
  ],
  s0541: [
    'From now, when one commits crime, parents and grandparents shall not be punished.',
    'From now on, when one commits a crime, parents and grandparents shall not be punished.',
  ],
  s0542: [
    'Only great treason is excluded from this grace."',
    'Only great treason is excluded from this grace."',
  ],
  s0543: [
    'On day bingyin, an edict said: "Morning four and evening three—all the monkeys were pleased; name and substance did not change, yet joy and anger were the tools.',
    'On bingyin day an edict said, "Morning four and evening three—all the monkeys were pleased; name and substance did not change, yet joy and anger were the tools.',
  ],
  s0544: [
    'Recently I hear much use of short-hundred coins outside—when the count is short, goods seem dear; when full, goods seem cheap. Goods do not truly rise or fall; the mind is inverted.',
    'Lately I hear much use of short-hundred coins outside—when the count falls short, goods seem dear; when full, goods seem cheap. Goods do not truly rise or fall; the mind is turned upside down.',
  ],
  s0545: [
    'In distant places it grows worse daily.',
    'In distant places it grows worse by the day.',
  ],
  s0546: [
    'This is not merely different policy in the state but different custom in households—only disordering royal rule and harming the people\'s wealth.',
    'This is not merely different policy in the state but different custom in every household—only disordering royal rule and wasting the people\'s wealth.',
  ],
  s0547: [
    'From now full-hundred coins shall be used throughout.',
    'From now on full-hundred coins shall be used throughout.',
  ],
  s0548: [
    'One hundred days after this order—if there are still violators, men shall serve corvée transport, women pledged labor, both three years."',
    'One hundred days after this order, if there are still violators, men shall serve transport corvée and women pledged labor, both for three years."',
  ],
  s0549: [
    'In the eighth month, day dingchou, Prince of Wuchang Xu, Eastern Yangzhou Inspector, died.',
    'On dingchou day in the eighth month Prince of Wuchang Xu, Eastern Yangzhou inspector, died.',
  ],
  s0550: [
    'Eastern Army General and South Xuzhou Inspector Prince of Linchuan Zhengyi was made Eastern Yangzhou Inspector under his existing title; Danyang Intendant Prince of Shaoling Lun was made General Who Pacifies the East and South Xuzhou Inspector.',
    'Eastern Army General and South Xuzhou inspector Prince of Linchuan Zhengyi became Eastern Yangzhou inspector under his existing title; Danyang intendant Prince of Shaoling Lun became General Who Pacifies the East and South Xuzhou inspector.',
  ],
  s0551: [
    'On day jiawu, Kapisa sent envoys presenting local products.',
    'On jiawu day Kapisa sent envoys with local tribute.',
  ],
  s0552: [
    'In the tenth month of winter, day guiyou, Prince of Ruyin Liu Zhe died.',
    'On guiyou day in the tenth month of winter Prince of Ruyin Liu Zhe died.',
  ],
  s0553: [
    'On day yihai, former Eastern Yangzhou Inspector Prince of Yueyang Cha was made Yongzhou Inspector.',
    'On yihai day former Eastern Yangzhou inspector Prince of Yueyang Cha was made Yongzhou inspector.',
  ],
  s0554: [
    'In Taqing year 1, first month, day renyin, Rapid Cavalry Grand General with open office and third-rank ceremonial parity, Jingzhou Inspector Prince of Luling Xu died;',
    'On renyin day in the first month of Taqing 1, Rapid Cavalry Grand General Prince of Luling Xu, with open office and third-rank ceremonial parity and inspector of Jingzhou, died;',
  ],
  s0555: [
    'General Who Pacifies the South and Jiangzhou Inspector Prince of Xiangdong Yi was made General Who Pacifies the West and Jingzhou Inspector.',
    'General Who Pacifies the South and Jiangzhou inspector Prince of Xiangdong Yi became General Who Pacifies the West and Jingzhou inspector.',
  ],
  s0556: [
    'On day xinyou, the imperial carriage personally sacrificed at the Southern Suburb; an edict said: "Heaven\'s course spreads wide; its sheltering virtue is vast;',
    'On xinyou day the emperor sacrificed at the Southern Suburb in person; an edict said, "Heaven\'s course spreads wide; its sheltering virtue is vast;',
  ],
  s0557: [
    'the Way of Heaven transforms and the virtue that nurtures beginnings is complete.',
    'the Way of Heaven transforms and the virtue that nurtures beginnings is complete.',
  ],
  s0558: [
    'I have bathed in the fasting palace, reverently served August Heaven, performed the kindling sacrifice, raised the flame to the Great One—the great rite is done. Joy mingles with gratitude; I wish to share this blessing with the hundred millions.',
    'I have bathed in the fasting palace, reverently served August Heaven, performed the kindling sacrifice, and raised the flame to the Great One—the great rite is done. Joy mingles with gratitude, and I wish to share this blessing with the hundred millions.',
  ],
  s0559: [
    'A general amnesty for the empire; the extremely poor need not pay this year\'s land tax and dues;',
    'A general amnesty for the empire; the extremely poor need not pay this year\'s land tax and dues;',
  ],
  s0560: [
    'those barred by pure-critique censure are all released;',
    'those barred by pure-critique censure are all released;',
  ],
  s0561: [
    'wanted fugitives, those who falsify registers or hide age and men—one hundred days of grace, each may surrender without question of past crimes;',
    'wanted fugitives, those who falsify registers or hide age and men—one hundred days of grace, each may surrender without question of past crimes;',
  ],
  s0562: [
    'those who drifted elsewhere may return to homes and trades, with five years\' remission;',
    'those who drifted elsewhere may return to homes and trades, with five years\' remission;',
  ],
  s0563: [
    'filial sons, obedient brothers, and strong farmers receive one noble rank;',
    'filial sons, obedient brothers, and strong farmers receive one noble rank;',
  ],
  s0564: [
    'those serving in office receive two years\' labor reward.',
    'those serving in office receive two years\' labor reward.',
  ],
  s0565: [
    'Let this be sent near and far; gather worthies—a man of virtue in his district, of the Way in his township, or of solitary integrity who seeks no fame—report all to the throne for timely summons."',
    'Let this be sent near and far; gather worthies—men of virtue in their districts, of the Way in their townships, or of solitary integrity who seek no fame—report all to the throne for timely summons."',
  ],
  s0566: [
    'On day jiazi, the imperial carriage personally sacrificed at the Bright Hall.',
    'On jiazi day the emperor sacrificed at the Bright Hall in person.',
  ],
  s0567: [
    'In the second month, day jimao, a white rainbow pierced the sun.',
    'On jimao day in the second month a white rainbow pierced the sun.',
  ],
  s0568: [
    'On day gengchen, Wei Minister over the Masses Hou Jing asked to submit thirteen provinces—Yu, Guang, Ying, Luo, Yang, Western Yang, Eastern Jing, Northern Jing, Xiang, Eastern Yu, Southern Yan, Western Yan, and Qi.',
    'On gengchen day Wei Minister over the Masses Hou Jing asked to submit thirteen provinces—Yu, Guang, Ying, Luo, Yang, Western Yang, Eastern Jing, Northern Jing, Xiang, Eastern Yu, Southern Yan, Western Yan, and Qi.',
  ],
  s0569: [
    'On day renwu, Jing was made Grand General, enfeoffed Prince of Henan, and granted acting Grand Chancery authority after the precedent of Deng Yu.',
    'On renwu day Hou Jing was made Grand General, enfeoffed Prince of Henan, and granted acting Grand Chancery authority after the precedent of Deng Yu.',
  ],
  s0570: [
    'On day dinghai, the imperial carriage personally plowed the sacred field.',
    'On dinghai day the emperor plowed the sacred field in person.',
  ],
  s0571: [
    'In the third month, day gengzi, Gaozu went to Tongtai Temple, held an unrestricted great assembly, and offered his body in renunciation; ministers and nobles contributed one hundred million in coin to ransom him.',
    'On gengzi day in the third month Gaozu went to Tongtai Temple, held an unrestricted great assembly, and offered his body in renunciation; ministers and nobles contributed one hundred million in coin to ransom him.',
  ],
  s0572: [
    'On day jiachen, Si Province Inspector Yang Yaren, Yan Province Inspector Huan He, and Ren Province Inspector Zhan Haizhen were dispatched to reinforce Northern Yu.',
    'On jiachen day Si province inspector Yang Yaren, Yan province inspector Huan He, and Ren province inspector Zhan Haizhen were dispatched to reinforce Northern Yu.',
  ],
  s0573: [
    'In the fourth month of summer, day dinghai, the imperial carriage returned to the palace; a general amnesty was proclaimed, the era name changed, filial sons, strong farmers, and eldest sons received one rank of nobility, and court officials and guards received gifts.',
    'On dinghai day in the fourth month of summer the emperor returned to the palace; a general amnesty was proclaimed, the era changed, filial sons, strong farmers, and eldest sons received one rank of nobility, and court officials and guards received gifts.',
  ],
  s0574: [
    'In the fifth month, day dingyou, the imperial carriage visited Deyang Hall, feasted the officials, and set out string and bamboo music.',
    'On dingyou day in the fifth month the emperor visited Deyang Hall, feasted the officials, and set out string and bamboo music.',
  ],
  s0575: [
    'In the sixth month, day wuchen, former Yongzhou Inspector Prince of Poyang Fan was made Northern Expedition General overseeing all northern campaigns on the Han.',
    'On wuchen day in the sixth month former Yongzhou inspector Prince of Poyang Fan was made Northern Expedition General overseeing all northern campaigns on the Han.',
  ],
  s0576: [
    'In the seventh month of autumn, day gengshen, Yang Yaren entered Xuanchi city.',
    'On gengshen day in the seventh month of autumn Yang Yaren entered Xuanchi city.',
  ],
  s0577: [
    'On day jiazi, an edict said: "The two Yu provinces have been split long;',
    'On jiazi day an edict said, "The two Yu provinces have long been split;',
  ],
  s0578: [
    'now Runan and Yingchuan are secured—by former precedent Xuanchi shall be Yu, Shouchun Southern Yu; Hefei renamed He Province, Northern Guangling Huai Province, Xiangcheng Yin Province, and He Province Southern He Province."',
    'now Runan and Yingchuan are secured—by former precedent Xuanchi shall be Yu, Shouchun Southern Yu; Hefei renamed He province, Northern Guangling Huai province, Xiangcheng Yin province, and He province Southern He province."',
  ],
  s0579: [
    'In the eighth month, day yichou, the royal army marched north; South Yu Inspector Xiao Yuanming was made supreme commander.',
    'On yichou day in the eighth month the royal army marched north, and South Yu inspector Xiao Yuanming was made supreme commander.',
  ],
  s0580: [
    'An edict said: "Runan is newly recovered, Song and Ying cleared—seeing the people sent away, my thoughts are troubled in sleep and wakefulness. Broad mercy should be spread and a new beginning granted.',
    'An edict said, "Runan is newly recovered, Song and Ying cleared—seeing the people sent away, my thoughts are troubled waking and sleeping. Broad mercy should be spread and a new beginning granted.',
  ],
  s0581: [
    'All people in newly attached border provinces who owed guilt and fled north—all amnesty, past offenses not asked.',
    'All people in newly attached border provinces who owed guilt and fled north receive full amnesty, past offenses not asked.',
  ],
  s0582: [
    'None may take private grudges to settle scores.',
    'None may take private grudges to settle scores.',
  ],
  s0583: [
    'Violators shall be strictly investigated."',
    'Violators shall be strictly investigated."',
  ],
  s0584: [
    'On day wuzi, Grand General Hou Jing was made acting director of the Grand Chancery Masters of Writing.',
    'On wuzi day Grand General Hou Jing was made acting director of the Grand Chancery Masters of Writing.',
  ],
  s0585: [
    'In the ninth month, day guimao, the Imperial Pleasure Garden was completed.',
    'On guimao day in the ninth month the Imperial Pleasure Garden was completed.',
  ],
  s0586: [
    'On day gengxu, the imperial carriage visited the garden.',
    'On gengxu day the emperor visited the garden.',
  ],
  s0587: [
    'In the eleventh month of winter, Wei sent Grand General Murong Shaozong and others to Hanshan.',
    'In the eleventh month of winter Wei sent Grand General Murong Shaozong and others to Hanshan.',
  ],
  s0588: [
    'On day bingwu, a great battle was fought—Yuanming was defeated; Northern Yan Inspector Hu Guisun and others all fell to Wei.',
    'On bingwu day a great battle was fought—Yuanming was defeated, and Northern Yan inspector Hu Guisun and others all fell to Wei.',
  ],
  s0589: [
    'Shaozong advanced to besiege Tong Province.',
    'Shaozong advanced to besiege Tong province.',
  ],
  s0590: [
    'In the twelfth month, day wuchen, Crown Prince Attendant Yuan Zhen was sent north as envoy to the Wei ruler.',
    'On wuchen day in the twelfth month Crown Prince attendant Yuan Zhen was sent north as envoy to the Wei ruler.',
  ],
  s0591: [
    'On day xinsi, former Northern Expedition General Prince of Poyang Fan was made Pacification North General and South Yu Inspector.',
    'On xinsi day former Northern Expedition General Prince of Poyang Fan was made Pacification North General and South Yu inspector.',
  ],
  s0592: [
    'In year 2, spring, first month, day wuxu, an edict ordered those in office to each recommend men they knew.',
    'On wuxu day in the first month of spring in year 2 an edict ordered those in office to each recommend men they knew.',
  ],
  s0593: [
    'On day jihai, Wei took Woyang.',
    'On jihai day Wei took Woyang.',
  ],
  s0594: [
    'On day xinchou, Vice Director of the Masters of Writing Xie Ju was made Director; Acting Minister of Personnel Wang Ke was made Vice Director.',
    'On xinchou day Vice Director Xie Ju became Director of the Masters of Writing, and acting Minister of Personnel Wang Ke became Vice Director.',
  ],
  s0595: [
    'On day jiachen, Yu Inspector Yang Yaren and Yin Inspector Yang Sida both abandoned their cities and fled; Wei advanced and occupied them.',
    'On jiachen day Yu inspector Yang Yaren and Yin inspector Yang Sida both abandoned their cities and fled; Wei advanced and occupied them.',
  ],
  s0596: [
    'On day yimao, Grand General Hou Jing was made Governor of Southern Yu; Pacification North General Prince of Poyang Fan, South Yu Inspector, was made He Province Inspector.',
    'On yimao day Grand General Hou Jing was made governor of Southern Yu, and Pacification North General Prince of Poyang Fan, South Yu inspector, was made He province inspector.',
  ],
  s0597: [
    'In the third month, day jiachen, Eastern Pacification General King Gao Yan of Goguryeo died; his son was made Pacification East General, King of Goguryeo, and Duke of Lelang.',
    'On jiachen day in the third month Eastern Pacification General King Gao Yan of Goguryeo died; his son was made Pacification East General, king of Goguryeo, and Duke of Lelang.',
  ],
  s0598: [
    'On day jiwei, General Who Pacifies the East and South Xuzhou Inspector Prince of Shaoling Lun was made Pacification South General, Xiangzhou Inspector with third-rank ceremonial parity; Central Guard General with open office and third-rank ceremonial parity Xiao Yuanzao was made Eastern Expedition General and South Xuzhou Inspector.',
    'On jiwei day General Who Pacifies the East and South Xuzhou inspector Prince of Shaoling Lun became Pacification South General and Xiangzhou inspector with third-rank ceremonial parity; Central Guard General Xiao Yuanzao, with open office and third-rank ceremonial parity, became Eastern Expedition General and South Xuzhou inspector.',
  ],
  s0599: [
    'That day, Qu Liao cave executed Li Ben and sent his head to the capital.',
    'That day Qu Liao cave executed Li Ben and sent his head to the capital.',
  ],
  s0600: [
    'In the fourth month of summer, day bingzi, an edict ordered court and provinces each to recommend upright men fit to govern the people, all to be escorted to the capital with ceremony.',
    'On bingzi day in the fourth month of summer an edict ordered court and provinces each to recommend upright men fit to govern the people, all to be escorted to the capital with ceremony.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b6.mjs <translation.json>'
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
