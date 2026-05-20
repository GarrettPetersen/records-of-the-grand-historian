#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Second month, day wuchen: in Xinchang and Jiyang commanderies wild silkworms formed cocoons.',
    'In the second month, on wuchen day, wild silkworms in Xinchang and Jiyang commanderies spun cocoons.',
  ],
  s0402: [
    'Third month, day dingsi: partial amnesty for Yang and Xu provinces.',
    'In the third month, on dingsi day, Yang and Xu provinces received a partial amnesty.',
  ],
  s0403: [
    'The Western Tranquility Altar was built on Mount Zhong.',
    'The Western Tranquility Altar was raised on Mount Zhong.',
  ],
  s0404: [
    'Day gengshen: Goguryeo sent envoys presenting local products.',
    'On gengshen day, Goguryeo sent envoys bearing tribute.',
  ],
  s0405: [
    'Fourth month, day wuzi, an edict said: "Last year at Qushan we annihilated the enemy in great numbers; it would be fitting to build a victory mound to honor martial achievement;',
    'In the fourth month, on wuzi day, an edict declared: "Last year at Qushan we crushed the foe in vast numbers; a victory mound would befit such martial glory;',
  ],
  s0406: [
    'Yet punishing crime and comforting the people is the great path of emperors and kings; covering bones and burying corpses is the way of the humane heart.',
    'Yet to punish the guilty and comfort the people is the royal way, and to cover bones and bury the dead is the work of a humane heart.',
  ],
  s0407: [
    'Order Qing province below to gather and bury them all.',
    'Let Qing province be ordered to gather and inter them all.',
  ],
  s0408: [
    '" Baekje, Funan, and Linyi all sent envoys presenting local products.',
    '" Baekje, Funan, and Linyi all sent envoys bearing tribute.',
  ],
  s0409: [
    'Sixth month, day xinsi: Minister of Works Wang Mao was made concurrent Central Army General.',
    'In the sixth month, on xinsi day, Wang Mao, Minister of Works, was also made Central Army General.',
  ],
  s0410: [
    'Ninth month, day xinhai: Dangchang sent envoys presenting local products.',
    'In the ninth month, on xinhai day, Dangchang sent envoys bearing tribute.',
  ],
  s0411: [
    'Twelfth month, day jiwei: General Who Pacifies the West and Jingzhou Inspector Prince of Ancheng Xiu was made Central Guard General; Guard Army General Prince of Poyang Hui was made General Who Pacifies the West and Jingzhou Inspector.',
    'In the twelfth month, on jiwei day, Prince of Ancheng Xiu, General Who Pacifies the West and inspector of Jingzhou, became Central Guard General; and Prince of Poyang Hui, Guard Army General, became General Who Pacifies the West and inspector of Jingzhou.',
  ],
  s0412: [
    'Twelfth year, spring, first month, day xinmao: the imperial carriage personally sacrificed at the Southern Suburb; crimes below capital offense were pardoned.',
    'In the twelfth year, on xinmao day of the first month of spring, the Emperor sacrificed at the Southern Suburb in person and pardoned all crimes short of capital punishment.',
  ],
  s0413: [
    'Second month, day xinyou: concurrent Right Vice Director of the Masters of Writing Yuan Ang was made Right Vice Director of the Masters of Writing.',
    'In the second month, on xinyou day, Yuan Ang, who had been acting Right Vice Director of the Masters of Writing, was confirmed in that office.',
  ],
  s0414: [
    'Day bingyin, an edict said: "Covering bones and burying corpses—righteousness weighs heavy in the Zhou classics; providing coffins and boxes—practice is praised in Han policy.',
    'On bingyin day, an edict said: "To cover bones and bury the dead weighs heavy in the Zhou classics; to supply coffins and shrouds was praised in Han policy.',
  ],
  s0415: [
    'I, turning to the corner in constant concern, have often hastened to act; orders for gathering and burying have been issued again and again in compassion;',
    'I have brooded in the corner of the hall and often moved in haste; again and again I have sent orders to gather and bury the dead in compassion;',
  ],
  s0416: [
    'Yet districts and counties are far and deep, compliance not yet thorough; skeletons by the roadsides are everywhere—speaking of pity for the sunken and withered, it ever more burdens the wounded heart.',
    'Yet the districts and counties lie far apart, and obedience is still incomplete; bare bones lie by the roads in every quarter, and pity for the sunken and withered only deepens the wound in my heart.',
  ],
  s0417: [
    'Let this be made clear to near and far; each shall patrol their borders; if abandoned corpses lie unburied, or burial clothes unchanged, immediately gather and bury them, providing coffins according to need.',
    'Let this be proclaimed near and far: each shall patrol his borders, and wherever corpses lie abandoned or shrouds unchanged, they shall at once be gathered and buried and coffins provided as needed.',
  ],
  s0418: [
    'Thus the souls that weep at night may be comforted, and frost-touched bones find their return.',
    'Then the souls that weep in the night may be eased, and bones touched by frost may find their rest.',
  ],
  s0419: [
    '" Day xinsi: the Hall of Supreme Ultimate was newly built, changed to thirteen bays.',
    '" On xinsi day, the Hall of Supreme Ultimate was rebuilt with thirteen bays.',
  ],
  s0420: [
    'Third month, day guimao: Xiangzhou Inspector Wang Zhenguo was made Guard Army General.',
    'In the third month, on guimao day, Wang Zhenguo, inspector of Xiangzhou, became Guard Army General.',
  ],
  s0421: [
    'Intercalary month, day yichou: Special Advance and Central Army General Shen Yue died.',
    'In the intercalary month, on yichou day, Shen Yue, Special Advance and Central Army General, died.',
  ],
  s0422: [
    'Fourth month of summer: the capital region suffered great flood.',
    'In the fourth month of summer, the capital was struck by great flood.',
  ],
  s0423: [
    'Sixth month, day guisi: the Imperial Temple was newly built, its foundation raised nine chi.',
    'In the sixth month, on guisi day, the Imperial Temple was rebuilt and its foundation raised nine chi.',
  ],
  s0424: [
    'Day gengzi: the Hall of Supreme Ultimate was completed.',
    'On gengzi day, the Hall of Supreme Ultimate was finished.',
  ],
  s0425: [
    'Ninth month of autumn, day wuwu: General Who Garrisons the South, open office third-rank ceremonial parity, Jiangzhou Inspector Prince of Jian\'an Wei was made Pacification Army General, ceremonial parity as before;',
    'In the ninth month of autumn, on wuwu day, Prince of Jian\'an Wei, General Who Garrisons the South with open office and third-rank ceremonial parity and inspector of Jiangzhou, became Pacification Army General, his ceremonial parity unchanged;',
  ],
  s0426: [
    'Fast Cavalry General, open office equal-to-third-rank protocol, Yangzhou Inspector Prince of Linchuan Hong was made Minister of Works;',
    'Prince of Linchuan Hong, Fast Cavalry General with open office equal-to-third-rank protocol and inspector of Yangzhou, became Minister of Works;',
  ],
  s0427: [
    'Concurrent Central Army General Wang Mao was made Fast Cavalry General, open office equal-to-third-rank protocol, Jiangzhou Inspector.',
    'and Wang Mao, who also held the Central Army Generalship, became Fast Cavalry General with open office equal-to-third-rank protocol and inspector of Jiangzhou.',
  ],
  s0428: [
    'Tenth month of winter, day dinghai, an edict said: "The Bright Hall\'s terrain is low and damp, not matching the heart\'s intent.',
    'In the tenth month of winter, on dinghai day, an edict said: "The Bright Hall stands on ground too low and damp to satisfy our intent.',
  ],
  s0429: [
    'Outside, one may measure and build upon the terrace to express full sincerity and reverence."',
    'Let a terrace be measured and raised there outside, so that sincerity and reverence may be fully shown."',
  ],
  s0430: [
    'Thirteenth year, spring, first month, day renxu: Danyang Prefect Prince of Jin\'an Gang was made Jingzhou Inspector.',
    'In the thirteenth year, on renxu day of the first month of spring, Prince of Jin\'an Gang, prefect of Danyang, became inspector of Jingzhou.',
  ],
  s0431: [
    'Day guihai: General Who Pacifies the West and Jingzhou Inspector Prince of Poyang Hui was made General Who Garrisons the West and Yizhou Inspector.',
    'On guihai day, Prince of Poyang Hui, General Who Pacifies the West and inspector of Jingzhou, became General Who Garrisons the West and inspector of Yizhou.',
  ],
  s0432: [
    'Day bingyin: Aide Right General Prince of Ancheng Xiu was made General Who Pacifies the West and Yingzhou Inspector.',
    'On bingyin day, Prince of Ancheng Xiu, Aide Right General, became General Who Pacifies the West and inspector of Yingzhou.',
  ],
  s0433: [
    'Second month, day dinghai: the imperial carriage personally plowed the sacred field; all under Heaven was pardoned; filial and incorrupt and diligent farmers were granted one rank of nobility.',
    'In the second month, on dinghai day, the Emperor plowed the sacred field in person, pardoned the realm, and granted one rank of nobility to the filial, the incorrupt, and the diligent farmers.',
  ],
  s0434: [
    'The Old Man Star appeared.',
    'The Old Man Star was seen.',
  ],
  s0435: [
    'Third month, day xinhai: newly appointed Pacification Central General, open office third-rank ceremonial parity Prince of Jian\'an Wei was made Left Grand Master for Splendor.',
    'In the third month, on xinhai day, Prince of Jian\'an Wei, newly made Pacification Central General with open office and third-rank ceremonial parity, became Left Grand Master for Splendor.',
  ],
  s0436: [
    'Fourth month of summer, day xinmao: Linyi sent envoys presenting local products.',
    'In the fourth month of summer, on xinmao day, Linyi sent envoys bearing tribute.',
  ],
  s0437: [
    'Day renchen: Yingzhou Inspector Prince of Yuzhang Zong was made Pacification Right General.',
    'On renchen day, Prince of Yuzhang Zong, inspector of Yingzhou, became Pacification Right General.',
  ],
  s0438: [
    'Fifth month, day xinhai: Regular Attendant of Direct Transmission and Regular Palatial Cavalier Wei Rui was made Central Guard General.',
    'In the fifth month, on xinhai day, Wei Rui, Regular Attendant of Direct Transmission and Regular Palatial Cavalier, became Central Guard General.',
  ],
  s0439: [
    'Sixth month, day jihai: South Yanzhou Inspector Xiao Jing was made Commandant of the Army; Commandant of the Army Liu Qingyuan was made General Who Pacifies the North and Yongzhou Inspector.',
    'In the sixth month, on jihai day, Xiao Jing, inspector of South Yanzhou, became Commandant of the Army; and Liu Qingyuan, Commandant of the Army, became General Who Pacifies the North and inspector of Yongzhou.',
  ],
  s0440: [
    'Seventh month of autumn, day yihai: imperial sons Lun, Yi, and Ji were established as Prince of Shaoling commandery, Prince of Xiangdong commandery, and Prince of Wuling commandery respectively.',
    'In the seventh month of autumn, on yihai day, the imperial sons Lun, Yi, and Ji were enfeoffed as Prince of Shaoling, Prince of Xiangdong, and Prince of Wuling respectively.',
  ],
  s0441: [
    'Eighth month, day guimao: Funan and Khotan each sent envoys presenting local products.',
    'In the eighth month, on guimao day, Funan and Khotan each sent envoys bearing tribute.',
  ],
  s0442: [
    'That year the Fushan Dam was built.',
    'That year work began on the Fushan Dam.',
  ],
  s0443: [
    'Fourteenth year, spring, first month, day yisi new moon: the Crown Prince was capped; all under Heaven was pardoned; those who succeeded their fathers were granted one rank of nobility; gifts were distributed to princes and officials each according to rank; congratulatory rites near and far were halted.',
    'In the fourteenth year, on the yisi new moon of the first month of spring, the Crown Prince received his cap; the realm was pardoned; heirs who succeeded their fathers received one rank of nobility; princes and officials received graded gifts; and congratulatory rites from near and far were suspended.',
  ],
  s0444: [
    'Day bingwu: Pacification Left General and Masters of Writing Director Wang Ying was promoted in title to Central Army General.',
    'On bingwu day, Wang Ying, Pacification Left General and Director of the Masters of Writing, was advanced in title to Central Army General.',
  ],
  s0445: [
    'General Who Garrisons the West Prince of Shixing Dan was made Pacification Central General.',
    'Prince of Shixing Dan, General Who Garrisons the West, became Pacification Central General.',
  ],
  s0446: [
    'Day xinhai: the imperial carriage personally sacrificed at the Southern Suburb.',
    'On xinhai day, the Emperor sacrificed at the Southern Suburb in person.',
  ],
  s0447: [
    'An edict said: "I reverently perform bright sacrifice, clearly serve the exalted spirits, approach the bamboo palace and ascend the great altar, wear fur robes and cap and present the green jade disk; the fire sacrifice and mountain-prostration rites having been performed, sincerity and reverence fully displayed—we think how to respond to august Heaven, broadly spread virtue and teaching;',
    'An edict said: "I reverently perform the bright rites and clearly serve the exalted spirits, enter the bamboo palace and ascend the great altar, wear fur robe and cap and offer the green jade disk; with the fire sacrifice and mountain-prostration complete and sincerity fully shown, I consider how to answer august Heaven and spread virtue and teaching abroad;',
  ],
  s0448: [
    'Yet we fall short in governance, laws and policies are often obscure—truly we depend on the assembled talents to bring peace to the myriad tasks.',
    'Yet I fall short in the way of rule, and laws and policies remain obscure; I truly depend on the assembled talents to bring peace to the myriad tasks.',
  ],
  s0449: [
    'Let this be proclaimed near and far, broadly gather outstanding and unusual men.',
    'Let this be proclaimed near and far, and outstanding and unusual men be broadly gathered in.',
  ],
  s0450: [
    'If there are those clearly known in village and district, walking alone in state and neighborhood, retiring plump to hills and gardens, not seeking fame, storing talent awaiting the time—not yet recruited;',
    'If there are men clearly known in village and district, upright in state and neighborhood, who retire in fullness to hills and gardens, seek no fame, and store their talent awaiting the time, yet have not been recruited;',
  ],
  s0451: [
    'Or those of worthy and good character, upright conduct, filial piety, or diligent farming—all should immediately report upward, listing names in full.',
    'Or men of worthy and good character, upright conduct, filial piety, or diligent farming—all should at once be reported upward with full names.',
  ],
  s0452: [
    'They shall be elevated to the court ranks, tested in state and city, so that all offices have their tasks and the myriad people have nothing hidden.',
    'They shall be raised into court service and tested in state and city, so that every office has its task and nothing among the myriad people remains hidden.',
  ],
  s0453: [
    'Moreover, penalties light and heavy through the ages, laws adjusted to the times—previously nose-cutting and tattooing were used in place of capital punishment; still mindful that repentance could occur, their path was already blocked—all may be eliminated.',
    'Moreover, punishments have been light or heavy through the ages as law was adjusted to the times; nose-cutting and tattooing were once used in place of capital punishment, yet even repentance could no longer reach those so marked—all such penalties may now be abolished.',
  ],
  s0454: [
    '" Day bingyin: Prince of Ruyin Liu Yin died.',
    '" On bingyin day, Liu Yin, Prince of Ruyin, died.',
  ],
  s0455: [
    'Second month, day gengyin: Rouran sent envoys presenting local products.',
    'In the second month, on gengyin day, Rouran sent envoys bearing tribute.',
  ],
  s0456: [
    'Day wuxu: the Old Man Star appeared.',
    'On wuxu day, the Old Man Star was seen.',
  ],
  s0457: [
    'Day xinchou: Central Guard General Wei Rui was made General Who Pacifies the North and Yongzhou Inspector; newly appointed Pacification Central General Prince of Shixing Dan was made Jingzhou Inspector.',
    'On xinchou day, Wei Rui, Central Guard General, became General Who Pacifies the North and inspector of Yongzhou; and Prince of Shixing Dan, newly made Pacification Central General, became inspector of Jingzhou.',
  ],
  s0458: [
    'Fourth month of summer, day dingchou: Fast Cavalry General, open office equal-to-third-rank protocol, Jiangzhou Inspector Wang Mao died.',
    'In the fourth month of summer, on dingchou day, Wang Mao, Fast Cavalry General with open office equal-to-third-rank protocol and inspector of Jiangzhou, died.',
  ],
  s0459: [
    'Fifth month, day dingsi: Jingzhou Inspector Prince of Jin\'an Gang was made Jiangzhou Inspector.',
    'In the fifth month, on dingsi day, Prince of Jin\'an Gang, inspector of Jingzhou, became inspector of Jiangzhou.',
  ],
  s0460: [
    'Eighth month of autumn, day yiwei: the Old Man Star appeared.',
    'In the eighth month of autumn, on yiwei day, the Old Man Star was seen.',
  ],
  s0461: [
    'Ninth month, day guihai: Prince of Changsha Shen Ye was made Guard Army General.',
    'In the ninth month, on guihai day, Prince of Changsha Shen Ye became Guard Army General.',
  ],
  s0462: [
    'Langyaxiu sent envoys presenting local products.',
    'Langyaxiu sent envoys bearing tribute.',
  ],
  s0463: [
    'Fifteenth year, spring, first month, day jisi, an edict said: "Observing the times to establish teaching is what royal government puts first; combining and benefiting—truly the root task; shifting customs to achieve order—all proceeds from this.',
    'In the fifteenth year, on jisi day of the first month of spring, an edict said: "To read the times and set teaching is what royal government must put first; to combine and benefit the people is truly the root task; to shift the customs and bring order—all proceeds from this.',
  ],
  s0464: [
    'Recently reform orders have been issued with every matter, yet the essence of tightening and loosening has not reached proper balance; people\'s sufferings remain numerous, upright and fair officials still few—therefore we pause before the throne with constant concern, and at court facing tribute rise in sigh.',
    'Recently orders of reform have followed one upon another, yet the art of tightening and loosening has not reached its proper measure; the people\'s afflictions remain many and upright, fair officials are still few—therefore I pause before the throne in constant concern and sigh as I face tribute at court.',
  ],
  s0465: [
    'Let this be declared to the four directions: where policies inconvenience the people, list them in detail and report.',
    'Let this be declared to the four directions: wherever policy burdens the people, let the particulars be listed and reported.',
  ],
  s0466: [
    'Prefects and magistrates—if clean and admirable, or if exploiting and plundering like pests—report separately, and promotions and dismissals will follow.',
    'Prefects and magistrates, whether clean and worthy of praise or plundering like pests, shall be reported separately, and promotion or dismissal will follow.',
  ],
  s0467: [
    'Senior officials should encourage agriculture, personally inspect embankments and dikes—let there be no neglect that harms farming.',
    'Senior officials should encourage the fields and personally inspect embankments and dikes, so that no neglect harms the farming season.',
  ],
  s0468: [
    'Market and pass taxes may not be fair—periodically assess and reduce from the old scale."',
    'Market and pass taxes may not be fair—let them be reviewed from time to time and eased below the old scale."',
  ],
  s0469: [
    'Third month, day wuchen new moon: there was a solar eclipse.',
    'In the third month, on the wuchen new moon, there was a solar eclipse.',
  ],
  s0470: [
    'Fourth month of summer, day dingwei: Pacification Right General Prince of Yuzhang Zong was made concurrent Guard Army.',
    'In the fourth month of summer, on dingwei day, Prince of Yuzhang Zong, Pacification Right General, was also made Guard Army.',
  ],
  s0471: [
    'Goguryeo sent envoys presenting local products.',
    'Goguryeo sent envoys bearing tribute.',
  ],
  s0472: [
    'Fifth month, day guiwei: Minister of Works, Yangzhou Inspector Prince of Linchuan Hong was made Supervisor of the Masters of Writing; Fast Cavalry Grand General and inspector as before.',
    'In the fifth month, on guiwei day, Prince of Linchuan Hong, Minister of Works and inspector of Yangzhou, became Supervisor of the Masters of Writing; his titles as Fast Cavalry Grand General and inspector remained unchanged.',
  ],
  s0473: [
    'Sixth month, day bingshen: rebuilding of the small temple was completed.',
    'In the sixth month, on bingshen day, rebuilding of the small temple was completed.',
  ],
  s0474: [
    'Day gengzi: Masters of Writing Director Wang Ying was made Left Grand Master for Splendor, open office third-rank ceremonial parity; Right Vice Director Yuan Ang was made Left Vice Director of the Masters of Writing; Director of the Ministry of Personnel Wang Yan was made Right Vice Director of the Masters of Writing.',
    'On gengzi day, Wang Ying, Director of the Masters of Writing, became Left Grand Master for Splendor with open office and third-rank ceremonial parity; Yuan Ang, Right Vice Director, became Left Vice Director of the Masters of Writing; and Wang Yan, Director of the Ministry of Personnel, became Right Vice Director of the Masters of Writing.',
  ],
  s0475: [
    'Eighth month of autumn: the Old Man Star appeared.',
    'In the eighth month of autumn, the Old Man Star was seen.',
  ],
  s0476: [
    'Rouran and Henan sent envoys presenting local products.',
    'Rouran and Henan sent envoys bearing tribute.',
  ],
  s0477: [
    'Ninth month, day xinsi: Left Grand Master for Splendor, open office third-rank ceremonial parity Wang Ying died.',
    'In the ninth month, on xinsi day, Wang Ying, Left Grand Master for Splendor with open office and third-rank ceremonial parity, died.',
  ],
  s0478: [
    'Day renchen: all under Heaven was pardoned.',
    'On renchen day, the realm was pardoned.',
  ],
  s0479: [
    'Tenth month of winter, day wuwu: Danyang Prefect Prince of Changsha Shen Ye was made Xiangzhou Inspector.',
    'In the tenth month of winter, on wuwu day, Prince of Changsha Shen Ye, prefect of Danyang, became inspector of Xiangzhou.',
  ],
  s0480: [
    'Eleventh month, day dingmao: concurrent Guard Army Prince of Yuzhang Zong was made Pacification Front General.',
    'In the eleventh month, on dingmao day, Prince of Yuzhang Zong, who also held the Guard Army post, became Pacification Front General.',
  ],
  s0481: [
    'Jiaozhou Inspector Li Bi executed Jiaozhou rebel Ruan Zongxiao and sent his head to the capital.',
    'Li Bi, inspector of Jiaozhou, executed the rebel Ruan Zongxiao and sent his head to the capital.',
  ],
  s0482: [
    'Partial amnesty for Jiaozhou.',
    'Jiaozhou received a partial amnesty.',
  ],
  s0483: [
    'Day renwu: Yongzhou Inspector Wei Rui was made Guard Army General.',
    'On renwu day, Wei Rui, inspector of Yongzhou, became Guard Army General.',
  ],
  s0484: [
    'Sixteenth year, spring, first month, day xinwei: the imperial carriage personally sacrificed at the Southern Suburb; an edict said: "I sit at the throne pondering governance; the way of government is not yet clear; from early dawn I toil, and the seasons have quickly passed.',
    'In the sixteenth year, on xinwei day of the first month of spring, the Emperor sacrificed at the Southern Suburb in person; an edict said: "I sit at the throne and ponder how to govern, yet the way of rule is not yet clear; from earliest dawn I toil, and the seasons have already turned again.',
  ],
  s0485: [
    'Now Grand Brightness governs the qi, Goumang opens the season; ascending to the center to meet the yang, sacrificial reverence fully displayed—we strive to receive Heaven\'s blessing and spread this harmonious grace.',
    'Now Grand Brightness governs the qi and Goumang opens the season; ascending to the center to meet the yang, sacrificial reverence is fully shown; I strive to receive Heaven\'s blessing and spread this harmonious grace.',
  ],
  s0486: [
    'Extremely poor households—do not collect this year\'s three levies.',
    'For the poorest households, do not collect this year\'s three levies.',
  ],
  s0487: [
    'Those without land and livelihood—in each place assess and provide according to need.',
    'For those without land or livelihood, let each place assess their need and provide accordingly.',
  ],
  s0488: [
    'If the people have births, immediately according to regulation grant lenient exemption.',
    'If the people have newborn children, grant lenient exemption according to regulation.',
  ],
  s0489: [
    'Orphans, elderly, widowers, and widows unable to support themselves—all receive relief and comfort.',
    'Orphans, the aged, widowers, and widows who cannot support themselves shall all receive relief and comfort.',
  ],
  s0490: [
    'Proclaim to the four directions.',
    'Let this be proclaimed to the four directions.',
  ],
  s0491: [
    'All provinces, commanderies, and counties—handle lawsuits in timely fashion, do not allow wrongful delay, as if personally reviewing."',
    'In every province, commandery, and county, let lawsuits be handled in timely fashion and wrongful delay be avoided, as if I were reviewing them in person."',
  ],
  s0492: [
    'Second month, day gengxu: the Old Man Star appeared; day jiayin: Pacification Front General Prince of Yuzhang Zong was made South Xuzhou Inspector.',
    'In the second month, on gengxu day the Old Man Star was seen; on jiayin day, Prince of Yuzhang Zong, Pacification Front General, became inspector of South Xuzhou.',
  ],
  s0493: [
    'Third month, day bingzi: the Prince of Henan sent envoys presenting local products.',
    'In the third month, on bingzi day, the Prince of Henan sent envoys bearing tribute.',
  ],
  s0494: [
    'Fourth month of summer, day jiazi: sacrificial animals were first removed from the ancestral temple.',
    'In the fourth month of summer, on jiazi day, sacrificial animals were first removed from the ancestral temple.',
  ],
  s0495: [
    'One white sparrow was caught in Chaogou.',
    'A white sparrow was caught at Chaogou.',
  ],
  s0496: [
    'Sixth month, day wushen: Prince of Luling Ji was made Jiangzhou Inspector.',
    'In the sixth month, on wushen day, Prince of Luling Ji became inspector of Jiangzhou.',
  ],
  s0497: [
    'Seventh month, day dingchou: Yingzhou Inspector Prince of Ancheng Xiu was made General Who Garrisons the North and Yongzhou Inspector.',
    'In the seventh month, on dingchou day, Prince of Ancheng Xiu, inspector of Yingzhou, became General Who Garrisons the North and inspector of Yongzhou.',
  ],
  s0498: [
    'Eighth month, day xinchou: the Old Man Star appeared.',
    'In the eighth month, on xinchou day, the Old Man Star was seen.',
  ],
  s0499: [
    'Funan and Poli each sent envoys presenting local products.',
    'Funan and Poli each sent envoys bearing tribute.',
  ],
  s0500: [
    'Tenth month of winter: cured meat offerings were removed from the ancestral temple; vegetables and fruits were first used.',
    'In the tenth month of winter, cured meat offerings were removed from the ancestral temple and vegetables and fruits were used for the first time.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b5.mjs <translation.json>'
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
