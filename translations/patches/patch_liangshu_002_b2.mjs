#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Xie Tiao was summoned as Left Supernumerary Grand Master and Bearer of the Staff with the Same Three Dignities as the Three Lords; He Yin was made Right Supernumerary Grand Master.',
    'Xie Tiao was appointed Left Supernumerary Grand Master with full ministerial honors; He Yin became Right Supernumerary Grand Master.',
  ],
  s0102: [
    'South Donghai was changed to Lanling commandery.',
    'South Donghai commandery was renamed Lanling.',
  ],
  s0103: [
    'Land registration was applied to all refugee commanderies and counties of South Xuzhou.',
    'The court fixed land tenure for every refugee district in South Xuzhou.',
  ],
  s0104: [
    'On day guiyou, an edict said: "The customs of Shang have only just shifted, yet the old ways still burn bright; that what lies below does not reach those above has been so from of old.',
    'On guiyou day an edict declared, "Shang ways have barely changed, but old habits still run hot; the grievances of the low never reach the high—and that has been true for ages.',
  ],
  s0105: [
    'To ascend the central peak and drive the chariot—how much more should one feel awe and reverence.',
    'To climb the sacred height and hold the reins should fill one with dread and humility.',
  ],
  s0106: [
    'At the Palace Coach Office, beside the suggestion post and the accusation stone, one letter receptacle may be placed at each.',
    'Place a letter box beside the suggestion post and another beside the accusation stone at the Palace Coach Office.',
  ],
  s0107: [
    'If those who eat flesh remain silent, and in the mountain recesses there are those who wish to speak freely, let them deposit their words in the suggestion post receptacle.',
    'If men at court stay mute while voices in the hills wish to speak, let them put their words in the suggestion box.',
  ],
  s0108: [
    'If one follows me from the Jiang and Han, with merit that can be reckoned, yet rhinoceros and buffalo are wasted and dragon and serpent still hang in suspension;',
    'If you marched with me from the Jiang and Han, your deeds worth recording, yet fine talent goes unused while great men still wait in the wings;',
  ],
  s0109: [
    'or if one\'s talent is lofty and refined, yet blocked and pressed with no outlet, bearing the arts of Fu Yue and Lü Shang, carrying the sighs of Qu Yuan and Jia Yi—with reason plain yet trapped, suffering confinement like goods in a chest;',
    'or if your gifts are bright but you are shut out, holding the skill of Fu and Lü yet sighing like Qu and Jia—your case clear as day, yet you languish unseen in a box;',
  ],
  s0110: [
    'When great affairs encroach on the small and noble gates trample the lowly, the four classes are already exhausted, yet the ninefold palace cannot be reached.',
    'When power crushes the weak and great houses ride over the humble, the people are spent and no cry reaches the throne.',
  ],
  s0111: [
    'If one wishes to plead one\'s case, one may also deposit it in the accusation stone receptacle."',
    'If you wish to state your grievance, put it in the accusation box as well."',
  ],
  s0112: [
    'On day jiaxu, an edict cut off congratulatory rites from near and far.',
    'On jiaxu day the court forbade congratulatory offerings from every quarter.',
  ],
  s0113: [
    'Another edict said: "In the ritual halls and literary pavilions one should follow the old statutes; nobles and commoners, once in place, each have their ranks; bowing and prostration should make the king\'s measure clear—solemn and grand, all eyes upon them.',
    'Another edict read, "Court ritual and the halls of learning must follow ancient rule. Rank high or low, each man in his place should bow and rise to show the king\'s order—stately, orderly, worthy of every eye.',
  ],
  s0114: [
    'Recently, because of many troubles, governing ties have slackened; offices are not gained through accumulation, and honor comes through favor.',
    'Lately endless turmoil has loosened the bonds of rule. Posts no longer come from long service; rank arrives by luck alone.',
  ],
  s0115: [
    'The Six Armies occupy fourth-rank posts; purple and green robes handle white-ledger labor.',
    'Soldiers of the Six Armies hold fourth-rank offices; men in purple and green do the work of clerks.',
  ],
  s0116: [
    'They shake out robes in court ranks, make long bows to ministers and chancellors, hurry steps through broad gates, and drive alongside assistant directors and bureau chiefs.',
    'They strut in the morning ranks, bow casually to ministers, stride through broad gates, and ride neck and neck with junior secretaries.',
  ],
  s0117: [
    'Thus hat and shoes are reversed, and jade and pottery cannot be distinguished.',
    'Hat and shoe are turned upside down; jade regalia and common pottery look the same.',
  ],
  s0118: [
    'Silent reflection brings remorse; I think to reverse these flowing abuses.',
    'When I sit in silence, shame fills me. I mean to turn back this tide of decay.',
  ],
  s0119: [
    'Moreover those who sport with the law and slacken in office, at every turn become derelict—punishing by ordinary statutes still does not reform them.',
    'Officials who treat the law as a toy and neglect their duties grow slack at every step. Ordinary penalties no longer change them.',
  ],
  s0120: [
    'Flogging to display authority—in antiquity it substituted for cutting off feet; the whip and cudgel have statutes, which perhaps may be followed.',
    'The rod and lash once stood for royal awe—in old times they replaced cutting off the feet. Whipping has its rule; perhaps we should use it again.',
  ],
  s0121: [
    'Let the outer court examine and discuss together calmly, striving to exhaust the principle."',
    'Let the outer court debate this openly and settle what is right."',
  ],
  s0122: [
    'On day guiwei, an edict: "Chancellor of State office clerks may, according to seniority and merit, be assessed for appointment to the Secretariat;',
    'On guiwei day an edict said, "Clerks of the Chancellor of State may, by seniority and service, be considered for Secretariat posts;',
  ],
  s0123: [
    'if the quota of posts is already filled, the remainder of those assessed, as well as the Rapid Cavalry office, may all be granted full appointment."',
    'if the posts are full, the rest—and those of the Rapid Cavalry office as well—may receive full rank all the same."',
  ],
  s0124: [
    'In the intercalary month, on day dingyou, Acting Prince of Dangchang Liang Miyong was made General Who Pacifies the West, Inspector of He and Liang two provinces, and formally enfeoffed Prince of Dangchang.',
    'In the leap month, on dingyou day, Acting Prince of Dangchang Liang Miyong became General Who Pacifies the West and inspector of He and Liang, and was formally enfeoffed Prince of Dangchang.',
  ],
  s0125: [
    'On day renyin, General of Chariots and Cavalry Xiahou Xiang was made Right Supernumerary Grand Master.',
    'On renyin day General of Chariots and Cavalry Xiahou Xiang was appointed Right Supernumerary Grand Master.',
  ],
  s0126: [
    'An edict said: "Accomplishing tasks and spreading custom, making inner and outer solemn and strict—this truly comes from dividing offices and apportioning duties, mutually restraining and checking one another.',
    'An edict declared, "Great work and upright custom, discipline within and without—these come from clear offices, divided duties, and men who check one another.',
  ],
  s0127: [
    'But recently all adhere to fixed forms; only when loss is seen is it reported; much lax violation is tolerated, and none will bear blame—the penal net slackens daily and gradually becomes custom. Now those of the right rank may report on hearsay, following the old system of Yuanxi."',
    'Lately everyone clings to routine. Wrongdoing is reported only after harm is done. Neglect is indulged and no one accepts blame. The law grows slack day by day until slackness itself is custom. From now on the chief ministers may report what they hear, as in the Yuanxi era."',
  ],
  s0128: [
    'In the fifth month, on the night of day yihai, thieves entered the Southern and Northern Side Gates, burned Shenhu Gate and Zongzhang View, and killed Commandant of the Guards Zhang Hongce.',
    'In the fifth month, on the night of yihai day, robbers broke into the Southern and Northern Side Gates, set fire to Shenhu Gate and Zongzhang View, and killed Commandant of the Guards Zhang Hongce.',
  ],
  s0129: [
    'On day wuzi, Jiangzhou Inspector Chen Bozhi raised troops in rebellion; Staff Officer of the Army Wang Mao was made General Who Pacifies the South and Jiangzhou Inspector to lead the host against him.',
    'On wuzi day Jiangzhou inspector Chen Bozhi rebelled with an army. Staff Officer of the Army Wang Mao was made General Who Pacifies the South and Jiangzhou inspector and sent to crush him.',
  ],
  s0130: [
    'In the sixth month, on day gengxu, Acting North Qinzhou Inspector Yang Shaoixian was made North Qinzhou Inspector and Prince of Wudu.',
    'In the sixth month, on gengxu day, Acting North Qinzhou inspector Yang Shaoixian became North Qinzhou inspector and Prince of Wudu.',
  ],
  s0131: [
    'That month, Chen Bozhi fled to Wei; Jiangzhou was pacified.',
    'That month Chen Bozhi fled to Wei and Jiangzhou was pacified.',
  ],
  s0132: [
    'Former Yizhou Inspector Liu Jilian held Chengdu in rebellion.',
    'Former Yizhou inspector Liu Jilian seized Chengdu and rebelled.',
  ],
  s0133: [
    'In the eighth month, on day wuxu, the Three Offices of Jiankang were established.',
    'In the eighth month, on wuxu day, the Three Offices of Jiankang were created.',
  ],
  s0134: [
    'On day yisi, General Who Pacifies the North and West Liangzhou Inspector Xiang Shupeng was promoted to General Who Pacifies the West and enfeoffed Prince of Dengzhi.',
    'On yisi day General Who Pacifies the North and West Liangzhou inspector Xiang Shupeng was promoted to General Who Pacifies the West and enfeoffed Prince of Dengzhi.',
  ],
  s0135: [
    'On day dingwei, an edict ordered Secretariat Supervisor Wang Ying and eight others to jointly compile laws and ordinances.',
    'On dingwei day the court ordered Secretariat supervisor Wang Ying and eight others to draft laws and ordinances together.',
  ],
  s0136: [
    'That month, an edict ordered Ministry of State Affairs bureau chiefs to report business as before.',
    'That month an edict restored the old practice of Ministry bureau chiefs presenting business directly.',
  ],
  s0137: [
    'Linyi and Gandhari each sent envoys presenting tribute goods.',
    'Linyi and Gandhari each sent envoys with local tribute.',
  ],
  s0138: [
    'In the eleventh month of winter, on day jiwei, the Lesser Temple was established.',
    'In the eleventh month of winter, on jiwei day, the Lesser Temple was established.',
  ],
  s0139: [
    'On day jiazi, the Emperor\'s son Tong was established as Crown Prince.',
    'On jiazi day the emperor\'s son Tong was made crown prince.',
  ],
  s0140: [
    'In the twelfth month, on day bingshen, National University Chancellor Zhang Ji was made General Who Protects the Army.',
    'In the twelfth month, on bingshen day, National University chancellor Zhang Ji was made General Who Protects the Army.',
  ],
  s0141: [
    'On day xinhai, General Who Protects the Army Zhang Ji was dismissed.',
    'On xinhai day General Who Protects the Army Zhang Ji was removed from office.',
  ],
  s0142: [
    'That year there was great drought; rice at five thousand per peck, and many people starved to death.',
    'That year drought struck hard. A peck of rice cost five thousand cash, and many starved.',
  ],
  s0143: [
    'In spring of the second year, on the first day of the first month, day jiayin, an edict said: "Three inquiries and five hearings are recorded in the sage classics; pitying and weighing cases weighs in former commands. Thus to make clear careful use of punishments and deeply guard against wrongful suspicion—in achieving order, none do not proceed from this.',
    'In spring of year 2, on the new moon of the first month, jiayin day, an edict said, "Three inquiries and five hearings belong to the sage canon. Mercy in judgment was prized by our forebears. Care in punishment and fear of wrongful conviction—the path to good rule runs through both.',
  ],
  s0144: [
    'From my time in the fief I personally examined and recorded, seeking the principle and obtaining the truth, great and small all exhaustively addressed.',
    'When I held my fief I heard cases myself, seeking truth in every matter, large or small, until nothing was left untried.',
  ],
  s0145: [
    'At the age\'s end the net slackened, this governance was again lacking—prisons choked, and appeals had nowhere to go.',
    'In the late age the net slackened and this practice fell away. Prisons clogged, and the wronged had no one to hear them.',
  ],
  s0146: [
    'I have inherited the timely destiny and face the myriad masses; though I dwell in fasting in the Xuan Chamber and attend to judgments,',
    'Heaven\'s charge is mine and the realm looks to me. Though I fast in the Xuan Chamber and weigh every case,',
  ],
  s0147: [
    'yet the nine pasturelands are far and wild—I cannot personally oversee.',
    'the nine provinces stretch far into the wilds, and I cannot see them with my own eyes.',
  ],
  s0148: [
    'I deeply fear that those harboring injustice coming to judgment is not only in one place.',
    'I fear the wronged are judged unfairly not in one place alone, but everywhere.',
  ],
  s0149: [
    'Command may be sent to all provinces: once a month personally conduct hearings, broadly inquire and choose the good, striving for certainty.',
    'Let every province be ordered to hold hearings once a month, to inquire widely, choose what is sound, and seek the truth.',
  ],
  s0150: [
    'On day yimao, Vice Director of the Masters of Writing Shen Yue was made Left Vice Director of the Masters of Writing;',
    'On yimao day Vice Director of the Masters of Writing Shen Yue became Left Vice Director;',
  ],
  s0151: [
    'Minister of Personnel Fan Yun was made Right Vice Director of the Masters of Writing;',
    'Minister of Personnel Fan Yun became Right Vice Director;',
  ],
  s0152: [
    'Former General Prince of Poyang Hui was made South Xuzhou Inspector;',
    'Former general Prince of Poyang Hui was made South Xuzhou inspector;',
  ],
  s0153: [
    'Director of the Masters of Writing Wang Liang was made Left Supernumerary Grand Master;',
    'Director of the Masters of Writing Wang Liang was made Left Supernumerary Grand Master;',
  ],
  s0154: [
    'Right Guard General Liu Qingyuan was made Commander of the Army Central.',
    'Right Guard General Liu Qingyuan was made Central Army Commander.',
  ],
  s0155: [
    'On day bingchen, Director of the Masters of Writing and newly appointed Left Supernumerary Grand Master Wang Liang was dismissed.',
    'On bingchen day Director of the Masters of Writing Wang Liang, newly made Left Supernumerary Grand Master, was dismissed.',
  ],
  s0156: [
    'In summer, in the fourth month, on day guimao, Review and Determination Bureau Chief Cai Fadu presented the Liang Code in twenty juan, Ordinances in thirty juan, and Administrative Precedents in forty juan.',
    'In summer, fourth month, on guimao day, Review Bureau chief Cai Fadu submitted the Liang Code in twenty scrolls, Ordinances in thirty, and Administrative Precedents in forty.',
  ],
  s0157: [
    'In the fifth month, on day dingsi, Right Vice Director of the Masters of Writing Fan Yun died.',
    'In the fifth month, on dingsi day, Right Vice Director Fan Yun died.',
  ],
  s0158: [
    'On day yichou, Yizhou Inspector Deng Yuanqi captured Chengdu; a partial amnesty was granted for Yizhou.',
    'On yichou day Yizhou inspector Deng Yuanqi took Chengdu, and Yizhou received a partial amnesty.',
  ],
  s0159: [
    'On day renshen, tribute from all commanderies and counties to the Two Palaces was cut off.',
    'On renshen day the court ended tribute from every commandery and county to the Two Palaces.',
  ],
  s0160: [
    'Only the provinces and Kuaiji—since their duty is as mountain-lord governors—may recommend local products; if not local produce, they may not offer tribute.',
    'Only the provinces and Kuaiji, whose officers serve as territorial lords, may present what the land yields. If it is not a local product, it may not be sent as tribute.',
  ],
  s0161: [
    'In the sixth month, on day dinghai, an edict said that because Dongyang, Xin\'an, and Feng\'an three counties suffered flood damage to residents\' property, envoys were sent to survey and reduce levies.',
    'In the sixth month, on dinghai day, an edict said floods in Dongyang, Xin\'an, and Feng\'an had ruined homes and fields. Envoys were sent to survey the damage and cut taxes.',
  ],
  s0162: [
    'That summer there was much pestilence.',
    'That summer plague spread widely.',
  ],
  s0163: [
    'The newly dismissed Left Supernumerary Grand Master Xie Tiao was made Minister of Works and Director of the Masters of Writing.',
    'The newly dismissed Left Supernumerary Grand Master Xie Tiao was made Minister of Works and Director of the Masters of Writing.',
  ],
  s0164: [
    'On day jiawu, Secretariat Supervisor Wang Ying was made Right Vice Director of the Masters of Writing.',
    'On jiawu day Secretariat supervisor Wang Ying became Right Vice Director.',
  ],
  s0165: [
    'In autumn, in the seventh month, Funan, Kucha, and Central India each sent envoys presenting tribute goods.',
    'In autumn, seventh month, Funan, Kucha, and Central India each sent envoys with tribute.',
  ],
  s0166: [
    'In the tenth month of winter, Wei raided Si province.',
    'In the tenth month of winter Wei invaded Si province.',
  ],
  s0167: [
    'In the eleventh month, on day yimao, there was thunder, lightning, and great rain; it was the last day of the month.',
    'In the eleventh month, on yimao day, thunder, lightning, and heavy rain fell on the month\'s last day.',
  ],
  s0168: [
    'That night there was thunder again.',
    'That night thunder sounded again.',
  ],
  s0169: [
    'On day yihai, Left Vice Director of the Masters of Writing Shen Yue left office on account of his mother\'s mourning.',
    'On yihai day Left Vice Director Shen Yue left office to mourn his mother.',
  ],
  s0170: [
    'In spring of the third year, on day wushen of the first month, Rear General, Yangzhou Inspector Prince of Linchuan Hong was promoted to General of the Center Army.',
    'In spring of year 3, on wushen day in the first month, Rear General and Yangzhou inspector Prince of Linchuan Hong was promoted to General of the Center Army.',
  ],
  s0171: [
    'On day guichou, Right Vice Director of the Masters of Writing Wang Ying was made Left Vice Director of the Masters of Writing; Crown Prince Tutor Liu Tan was made Right Vice Director of the Masters of Writing; former Left Vice Director of the Masters of Writing Shen Yue was made General Who Pacifies the Army.',
    'On guichou day Right Vice Director Wang Ying became Left Vice Director; Crown Prince tutor Liu Tan became Right Vice Director; and former Left Vice Director Shen Yue was made General Who Pacifies the Army.',
  ],
  s0172: [
    'In the second month, Wei captured Liang province.',
    'In the second month Wei took Liang province.',
  ],
  s0173: [
    'In the third month, frost fell and killed the grass.',
    'In the third month frost fell and killed the grass.',
  ],
  s0174: [
    'In the fifth month, on day dingsi, King of Funan Jiao Chen Ru Jian Ye Ba Mo was made General Who Pacifies the South.',
    'In the fifth month, on dingsi day, King of Funan Jiao Chen Ru Jian Ye Ba Mo was made General Who Pacifies the South.',
  ],
  s0175: [
    'In the sixth month, on day bingzi, an edict said: "Ancient wise kings governing the age, every year chose the campaign season and personally made inspection tours—customs, government, and punishments—none were not reached.',
    'In the sixth month, on bingzi day, an edict said, "Wise kings of old, ruling the world, each year chose the season for travel and went in person to inspect the land. Custom, government, and punishment—nothing escaped their sight.',
  ],
  s0176: [
    'At the age\'s end customs withered; this rite has long been abandoned.',
    'In later ages custom faded, and this rite has long lain empty.',
  ],
  s0177: [
    'Though I wish to go far and forget fatigue, personally reaching the hidden corners—living in the present while acting the ancient is not easy to follow; therefore day after day I hesitate, my feelings like doubly caressing.',
    'I would travel far, forget weariness, and reach the remotest corners myself—but to live in the present while acting like the ancients is hard. Day after day I hesitate, longing to go out and comfort the people twice over.',
  ],
  s0178: [
    'Throughout the nine regions, near and far, among the people—some routes blocked by rivers, some poor, weak, aged, or ill—holding injustice and embracing reason with no way to plead—thus the lone woman of Donghai brought disaster on the state, and the solitary soul of the western lands climbed a tower to plead.',
    'Across the nine regions, near and far, some people are cut off by rivers, some are poor, weak, old, or sick. They hold injustice in their hearts and have no way to speak. A lone woman in Donghai once brought ruin on her state; a solitary soul in the west climbed a tower to cry for justice.',
  ],
  s0179: [
    'Thinking of this in my heart, I sigh at midnight.',
    'When I think of this, I sigh in the deep of night.',
  ],
  s0180: [
    'Commissions may be divided to send envoys to tour the provinces and departments.',
    'Let envoys be dispatched to tour the provinces and departments.',
  ],
  s0181: [
    'Those with deep injustice and great harm, depressed with no recourse—permit them to come to the envoys and according to origin state their case.',
    'Those who suffer grave wrongs with no one to hear them may come to the envoys and state their case as it arose.',
  ],
  s0182: [
    'Perhaps thereby the thought of pitying and hiding may shine over the four quarters, and hearing from afar may equal viewing in person.',
    'Then mercy may reach the four quarters, and what is heard from afar may be judged as if seen by the throne itself."',
  ],
  s0183: [
    'On day guiwei, a general amnesty was granted for all under Heaven.',
    'On guiwei day the court proclaimed a general amnesty.',
  ],
  s0184: [
    'In autumn, in the seventh month, on day dingwei, Supernumerary Grand Master Xiahou Xiang was made General of Chariots and Cavalry and Xiangzhou Inspector; Xiangzhou Inspector Yang Gongze was made General Who Guards the Army Central.',
    'In autumn, seventh month, on dingwei day, Supernumerary Grand Master Xiahou Xiang became General of Chariots and Cavalry and Xiangzhou inspector; Xiangzhou inspector Yang Gongze became Central Army Guard General.',
  ],
  s0185: [
    'On day jiazi, the Emperor\'s son Zong was established as Prince of Yuzhang commandery.',
    'On jiazi day the emperor\'s son Zong was made Prince of Yuzhang.',
  ],
  s0186: [
    'In the eighth month, Wei captured Si province; an edict ordered South Yiyang to be established as Si province.',
    'In the eighth month Wei took Si province. The court ordered South Yiyang to serve as the new Si province.',
  ],
  s0187: [
    'In the ninth month, on day renzi, Heir of the Prince of Henan Fu Lianchou was made General Who Pacifies the West, Inspector of West Qin and He two provinces, and Prince of Henan.',
    'In the ninth month, on renzi day, Heir of the Prince of Henan Fu Lianchou became General Who Pacifies the West, inspector of West Qin and He, and Prince of Henan.',
  ],
  s0188: [
    'North India sent envoys presenting tribute goods.',
    'North India sent envoys with tribute.',
  ],
  s0189: [
    'In the eleventh month of winter, on day jiazi, an edict said: "Establishing teaching according to the times—pure and crude differ in governance; punishments change with the age—light and heavy differ in custom.',
    'In the eleventh month of winter, on jiazi day, an edict said, "Teaching must follow the times. Pure ages and coarse ages govern differently. Punishment changes with the age; what is heavy in one era is light in another.',
  ],
  s0190: [
    'Formerly, when Shang customs had not shifted, the people had long been scattered; entangled in nets and fallen into punishments, day and night they pursued one another.',
    'Once, before custom had changed, the people had long been scattered. Caught in nets of law, they fell into punishment and chased one another day and night.',
  ],
  s0191: [
    'If all were punished by the full law, those in red prison garments would fill the roads;',
    'If every offense were punished to the letter, men in red prison dress would choke the roads;',
  ],
  s0192: [
    'if all were granted broad mercy, it would be hard to use as a state—therefore those guilty were permitted to ransom, to preserve the lives of the masses.',
    'yet if mercy were granted to all, the state could not stand. So the guilty were allowed to ransom their lives and the common people were spared.',
  ],
  s0193: [
    'Now near and far know prohibition; prisons gradually empty—following this forward, perhaps punishments may be set aside.',
    'Now far and near know the law, and the prisons grow empty. If we continue on this path, perhaps punishments may one day fall still.',
  ],
  s0194: [
    'The gold-standard punishment statute should be suspended and ceased.',
    'The statute of punishments measured in gold should now be lifted and stilled.',
  ],
  s0195: [
    'The ransom-for-crime statute may be abolished."',
    'The law allowing ransom for crime may be abolished."',
  ],
  s0196: [
    'That year there was much pestilence.',
    'That year plague ran through the land.',
  ],
  s0197: [
    'In spring of the fourth year, on the first day of the first month, day guimao, an edict said: "For the regular selection of the nine streams, if under thirty years of age and not passing one classic, one may not leave coarse cloth and enter office.',
    'In spring of year 4, on the new moon of the first month, guimao day, an edict said, "In the regular selection of officials, no man under thirty who has not mastered one classic may leave coarse cloth and take office.',
  ],
  s0198: [
    'If talent matches Gan or Yan, do not limit by age."',
    'If talent equals Gan or Yan, do not bind it by age.',
  ],
  s0199: [
    'Five Classics Erudites were established, one for each.',
    'One Erudite was appointed for each of the Five Classics.',
  ],
  s0200: [
    'General Who Pacifies the North, Yongzhou Inspector Prince of Jian\'an Wei was made South Xuzhou Inspector; South Xuzhou Inspector Prince of Poyang Hui was made Yingzhou Inspector; Commander of the Army Central Liu Qingyuan was made Yongzhou Inspector.',
    'General Who Pacifies the North and Yongzhou inspector Prince of Jian\'an Wei became South Xuzhou inspector; South Xuzhou inspector Prince of Poyang Hui became Yingzhou inspector; and Central Army Commander Liu Qingyuan became Yongzhou inspector.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b2.mjs <translation.json>'
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
