#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 10, Biographies 4',
    'Book of Liang, Volume Ten, Biographies, Fourth',
  ],
  s0002: [
    'Xiao Yingda; Xia Hou Xiang; Cai Daogong; Yang Gongze; Deng Yuanqi',
    'Xiao Yingda; Xia Hou Xiang; Cai Daogong; Yang Gongze; Deng Yuanqi',
  ],
  s0003: [
    'Xiao Yingda was a native of Lanling in Lanling commandery, the fifth son of Qi\'s Grandee of the Imperial Secretariat Chi Fu.',
    'Xiao Yingda came from Lanling in Lanling commandery, the fifth son of Qi Grandee of the Imperial Secretariat Chi Fu.',
  ],
  s0004: [
    'In youth he loved boldness and thrived on bravado; he first entered office as Champion General.',
    'As a youth he loved daring and thrived on bravado; he began his career as Champion General.',
  ],
  s0005: [
    'His elder brother Yingzhou in late Qi\'s Jianwu era administered Jing province affairs; Yingda also served as aide to the minister of war of the Western Zhonglang General, both at the western headquarters.',
    'His elder brother Yingzhou, in late Qi\'s Jianwu era, ran Jing province; Yingda too was aide to the Western Zhonglang General\'s minister of war, both in the western command.',
  ],
  s0006: [
    'In Qi\'s troubled final years they were quite ill at ease.',
    'In Qi\'s closing troubles they felt deeply uneasy.',
  ],
  s0007: [
    'Then Emperor Donghun dispatched Supporting-the-State General Liu Shanyang as Administrator of Brazil; passing Jingzhou, he secretly instructed Yingzhou to seize Yong province.',
    'Emperor Donghun then sent Supporting-the-State General Liu Shanyang to Brazil as administrator; on the road through Jingzhou he secretly ordered Yingzhou to strike Yong province.',
  ],
  s0008: [
    'By then Gaozu had already made his preparations.',
    'By then Gaozu had already prepared.',
  ],
  s0009: [
    'He therefore sent Yingzhou\'s kinsman Wang Tianhu with a letter to sow doubt.',
    'So he sent Yingzhou\'s kinsman Wang Tianhu with a letter meant to unsettle him.',
  ],
  s0010: [
    'When Shanyang arrived, he truly dared not enter the city.',
    'When Shanyang arrived, he in fact dared not enter the city.',
  ],
  s0011: [
    'Yingzhou, with no plan at hand, at night sent the man of Qiantang Zhu Jingsi to summon Western Zhonglang headquarters adjutant Xi Wenkai and advisory officer Liu Chen to close the study and fix a decision.',
    'At a loss, Yingzhou by night sent Zhu Jingsi of Qiantang to call Xi Wenkai, the headquarters adjutant of the Western Zhonglang General, and advisory officer Liu Chen to shut the study and settle on a course.',
  ],
  s0012: [
    'Xi Wenkai said: "The Lord of Yong province has been raising men and horses for no single day; Jiangling has always feared men of Xiangyang, and their numbers are not a match—we cannot take them and be sure of control; even if controlled, when the year turns cold they will again not be tolerated by the court.',
    'Xi Wenkai said: "The Yongzhou lord has been gathering troops and horses for ages; Jiangling has always feared Xiangyang men, and their numbers cannot match—seize them and you cannot hold them; hold them, and when winter comes the court will not abide it again.',
  ],
  s0013: [
    'If we now kill Shanyang and rise with Yong province, set up the Son of Heaven to command the feudal lords, then hegemony will be achieved.',
    'Kill Shanyang now, rise with Yongzhou, set up the Son of Heaven to command the lords, and hegemony is won.',
  ],
  s0014: [
    'Shanyang holds back in doubt and does not advance—this is that he does not trust us.',
    'Shanyang hesitates and will not advance—that means he does not trust us.',
  ],
  s0015: [
    'If we now cut off Tianhu\'s head and present it, his suspicions can be dispelled.',
    'Cut off Tianhu\'s head and send it now, and his doubts can be cleared.',
  ],
  s0016: [
    'When he arrives we plot against him—nothing will fail.',
    'When he comes, strike—nothing will fail.',
  ],
  s0017: [
    '" Chen also urged it.',
    '" Chen urged the same.',
  ],
  s0018: [
    'Yingda said: "Good."',
    'Yingda said: "Good."',
  ],
  s0019: [
    'When dawn came, Yingzhou told Tianhu: "You are acquainted with the Supporting-the-State Liu; today I cannot but borrow your head."',
    'At daybreak Yingzhou told Tianhu: "You know the Supporting-the-State Liu; today I must borrow your head."',
  ],
  s0020: [
    'He then beheaded Tianhu and displayed him to Shanyang.',
    'He beheaded Tianhu and showed the head to Shanyang.',
  ],
  s0021: [
    'Shanyang was greatly pleased; lightly he led several hundred infantry and cavalry to the province.',
    'Shanyang rejoiced; with only a few hundred foot and horse he came to the provincial seat.',
  ],
  s0022: [
    'Wenkai drew up troops waiting at the gate; Shanyang\'s carriage crossed the gate limit and the gates closed; they seized and beheaded him, sent the head to Gaozu.',
    'Wenkai had troops wait at the gate; Shanyang\'s carriage passed the gate-bar and the gates shut; they seized and killed him and sent his head to Gaozu.',
  ],
  s0023: [
    'And with the plan to enthrone the Prince of Nankang they came to report; Gaozu assented.',
    'They also reported the plan to enthrone the Prince of Nankang; Gaozu agreed.',
  ],
  s0024: [
    'When Emperor He took the throne, Yingzhou was made Acting-with-credentials, Palace Attendant, Director of the Imperial Secretariat, concurrently Director of the Imperial Secretariat for Official Affairs, Superintendent of military affairs remaining and departing, General Who Tranquilizes the Army, Governor of Jingzhou, remaining to guard the Western court.',
    'When Emperor He ascended, Yingzhou became Acting-with-credentials, Palace Attendant, Director of the Imperial Secretariat, Director for Official Affairs, superintendent of armies staying and going, General Who Tranquilizes the Army, and governor of Jingzhou, left to guard the western court.',
  ],
  s0025: [
    'Yingda was made Champion General.',
    'Yingda was made Champion General.',
  ],
  s0026: [
    'When Yang Gongze and the rest led troops with Gaozu, Gaozu besieged Ying city; Yingda joined the army at Hankou and with Wang Mao, Cao Jingzong, and the rest attacked Ying city and took it.',
    'When Yang Gongze and others marched with Gaozu, Gaozu besieged Ying; Yingda met the host at Hankou and with Wang Mao and Cao Jingzong attacked Ying and captured it.',
  ],
  s0027: [
    'He followed Gaozu in pacifying Jiang province.',
    'He followed Gaozu in pacifying Jiang province.',
  ],
  s0028: [
    'Gaozu advanced into Jiang province and sent him with Cao Jingzong to lead horse and foot first toward Jiangning, defeated Emperor Donghun\'s general Li Jushi, and again took the eastern city.',
    'Gaozu entered Jiang province and sent him with Cao Jingzong ahead with cavalry and infantry toward Jiangning; they broke Emperor Donghun\'s general Li Jushi and took the eastern city.',
  ],
  s0029: [
    'At the start, when the righteous army rose, Baodong Administrator Xiao Huixun\'s son Gui and Brazil Administrator Lu Xiulie would not follow; they raised troops and invaded Jing province, defeated Supporting-the-State General Ren Yangzhi at Xiakou, broke Grand General Liu Xiaoqing at Shangming, and Yingzhou sent troops to resist them;',
    'When the righteous army first rose, Xiao Gui, son of Baodong administrator Xiao Huixun, and Brazil administrator Lu Xiulie refused obedience; they invaded Jing province, defeated Supporting-the-State General Ren Yangzhi at Xiakou and Grand General Liu Xiaoqing at Shangming, and Yingzhou sent armies against them;',
  ],
  s0030: [
    'but Gaozu had already pacified Jiang and Ying and was plotting Jiankang.',
    'but Gaozu had already taken Jiang and Ying and turned toward Jiankang.',
  ],
  s0031: [
    'Yingzhou, holding the highest command, could not check Gui and the rest; grieving and ashamed, he fell ill and died within days.',
    'Yingzhou, as supreme commander, could not contain Gui and the others; sick with shame and grief, he died after several days\' illness.',
  ],
  s0032: [
    'The province kept it secret and had someone whose hand resembled his forge orders as if from him.',
    'The province concealed it and had a man with a similar hand write orders in his name.',
  ],
  s0033: [
    'When Gui and the rest heard Jiankang would soon be pacified, the host feared and scattered; only then did they hold mourning, and Emperor He posthumously made Yingzhou Chancellor.',
    'When Gui and the others heard Jiankang was about to fall, their forces broke in fear; only then was mourning declared, and Emperor He posthumously made Yingzhou chancellor.',
  ],
  s0034: [
    'At the start of the righteous army Yingda\'s younger brother Yingfu fled the capital; the man of Luling Xun Jingzhi secretly guided him south; reaching Luling, Jingzhi and kinsman Ling You raised troops and mustered several hundred men, encamped at Yaoshan Lake in Xichang.',
    'Early in the righteous rising Yingda\'s brother Yingfu escaped the capital; Xun Jingzhi of Luling secretly led him south; at Luling, Jingzhi and kinsman Ling You raised troops—several hundred men at Yaoshan Lake in Xichang.',
  ],
  s0035: [
    'When Yingda heard, he gave Yingfu acting credentials as superintendent of the military affairs of the five commanderies Luling, Yuzhang, Linchuan, Nankang, and Ancheng, Champion General, and Interior Administrator of Luling.',
    'Yingda heard and gave Yingfu acting credentials as superintendent of Luling, Yuzhang, Linchuan, Nankang, and Ancheng, Champion General, and interior administrator of Luling.',
  ],
  s0036: [
    'Yingfu led Ling You and the rest forward to hold Xichang; Emperor Donghun dispatched Pacified West Administrator Liu Xizu from the southern river into the lake to resist him.',
    'Yingfu advanced with Ling You to hold Xichang; Emperor Donghun sent Pacified West administrator Liu Xizu from the southern river into the lake against him.',
  ],
  s0037: [
    'Yingfu could not hold; he led his troops through Jian\'an back toward Changsha, Xizu pursued, and Yingfu crossed ridges and barely escaped.',
    'Yingfu could not stand; he led his men through Jian\'an toward Changsha while Xizu pursued; Yingfu crossed mountains and ridges and barely survived.',
  ],
  s0038: [
    'On the road they ran out of food; later he died from eating too much.',
    'On the road they starved; later he died from eating too much at once.',
  ],
  s0039: [
    'When Jiankang was pacified, Gaozu made Yingda Front Army General and Governor of Danyang.',
    'When Jiankang fell, Gaozu made Yingda Front Army General and governor of Danyang.',
  ],
  s0040: [
    'When the emperor received the mandate, an edict said: "To mark merit is to esteem virtue, alike in every age; to follow the distant and cherish the departed is all the more bound to the affair.',
    'When the emperor took the throne, an edict said: "To honor merit is to esteem virtue, the same in every age; to reach back and cherish the dead binds one all the more to the task.',
  ],
  s0041: [
    'Former Qi Palace Attendant, Chancellor, and Director of the Imperial Secretariat Yingzhou—his bearing lofty and far, his capacity deep and broad, his pure designs and grand achievements, his reputation and gaze turned to him.',
    'Former Qi palace attendant, chancellor, and Director of the Imperial Secretariat Yingzhou—bearing lofty and distant, capacity deep and broad, pure designs and great deeds, fame and expectation alike upon him.',
  ],
  s0042: [
    'He joined the righteous beginning, laid the foundation of the royal trace, shared hardship in tumult and peace, and carried his heart\'s affairs in the record.',
    'He joined the righteous start, laid the royal foundation, shared hardship through turmoil and peace, and bore his heart on the record.',
  ],
  s0043: [
    'We have received Heaven, changed the realm, and lit the dwelling of the four quarters; gazing at Mount Tai and viewing the River, forever we speak in lamentation.',
    'We have received Heaven, changed the realm, and settled the four quarters; gazing at Mount Tai and viewing the River, we lament without end.',
  ],
  s0044: [
    'He may be enfeoffed Duke of Baxi commandery, fief of three thousand households, his former office unchanged."',
    'Let him be enfeoffed Duke of Baxi commandery with a fief of three thousand households, his former rank unchanged."',
  ],
  s0045: [
    'Yingfu was posthumously made Right Guard General.',
    'Yingfu was posthumously made Right Guard General.',
  ],
  s0046: [
    'Yingda was added as Secular Attendant; he was dismissed for official business.',
    'Yingda was added as Secular Attendant; he was removed for official business.',
  ],
  s0047: [
    'When merits were broadly debated and rewarded, Yingda was enfeoffed Marquis of Wuchang county, fief fifteen hundred households.',
    'At the great merit review Yingda was enfeoffed Marquis of Wuchang county with a fief of fifteen hundred households.',
  ],
  s0048: [
    'Soon he was Palace Attendant, changed to Marquis of Zuotang, fief unchanged.',
    'Soon he was palace attendant, re-enfeoffed as Marquis of Zuotang with the same fief.',
  ],
  s0049: [
    'He was promoted General Who Punishes the Barbarians, Left Guard of the Heir Apparent.',
    'He was promoted to General Who Punishes the Barbarians and Left Guard of the Heir Apparent.',
  ],
  s0050: [
    'Censor-in-Chief Ren Fang memorialized, saying:',
    'Censor-in-Chief Ren Fang submitted a memorial, saying:',
  ],
  s0051: [
    'Your servant has heard that in poverty one observes what one takes; in extremity what one will not do.',
    'Your servant has heard that poverty shows what one will take; extremity shows what one will not do.',
  ],
  s0052: [
    'Among men in plain cloth, conduct firm in humble dwelling can yet stir greed and sharpen custom, giving heart to thin men;',
    'Among commoners, conduct steadfast in a poor house can still stir greed and sharpen custom and give heart to petty men;',
  ],
  s0053: [
    'how much more houses that chop ice, contending for the profit of chickens and pigs;',
    'how much more in houses that break ice, contending for pig-and-chicken profit;',
  ],
  s0054: [
    'men in embroidered robes accepting a merchant\'s garment.',
    'men in embroidered robes taking a merchant\'s gift.',
  ],
  s0055: [
    'We hear that General Who Punishes the Barbarians your servant Yingda memorialized begging fish-army tax; I took and summoned household supervisor Peng Nandang of Yingda\'s residence to the bureau for questioning.',
    'We hear that General Who Punishes the Barbarians, your servant Yingda, petitioned for fish-office tax; I summoned Yingda\'s household supervisor Peng Nandang to the bureau for inquiry.',
  ],
  s0056: [
    'He set forth: \'The live-fish office tax was originally memorialized by Deng Sengyan, term ending this year on the fourteenth day of the fifth month.',
    'He reported: \'The live-fish office tax was first petitioned by Deng Sengyan, its term ending this year on the fourteenth day of the fifth month.',
  ],
  s0057: [
    'The master Yingda, deeming it not newly established, still memorialized to succeed Sengyan and at once received decree permitting levy; with the clerk-law they reckoned one year\'s receipts at five hundred thousand.\' As the listed account, it matches the report heard; Yingda is master.',
    'Master Yingda, holding it no new levy, still petitioned to succeed Sengyan and at once received permission to register the tax; by clerk-law one year\'s take was five hundred thousand.\' As set forth, it matches what was heard; Yingda is the principal.',
  ],
  s0058: [
    'Your servant respectfully reviews: General Who Punishes the Barbarians, Left Guard of the Heir Apparent, Marquis of Zuotang county, your servant Yingda—fills a minister\'s seat, heard in law-enforcement, private petitions repeatedly presented, utmost publicness lonely.',
    'Your servant respectfully finds: General Who Punishes the Barbarians, Left Guard of the Heir Apparent, Marquis of Zuotang, your servant Yingda—holds a minister\'s place, privy to enforcement of law, yet private suits crowd in while public duty stands empty.',
  ],
  s0059: [
    'Ambition in the butcher\'s stall, unlike seeking in Bao\'s market;',
    'Ambition in the butcher\'s stall, not like seeking in Bao\'s market;',
  ],
  s0060: [
    'fish-meal funds, not awaiting secretly existing numbers.',
    'fish-ration revenue, not waiting on hidden tallies.',
  ],
  s0061: [
    'Then again he presented this document twice, pursued that eleven—if style is thus, the measure is here!',
    'Yet again he filed this text twice, chasing that eleven—if the manner is such, the cord is here!',
  ],
  s0062: [
    'Your Majesty magnanimously cherishes meritorious good, each time bending law;',
    'Your Majesty, in mercy for the meritorious, often bends the law;',
  ],
  s0063: [
    'your servant holding office enforcing law, dares not not straighten the cord.',
    'your servant, holding office and enforcing law, dares not fail to draw the line straight.',
  ],
  s0064: [
    'Your servants collectively deliberate: request by the present matter to dismiss Yingda from his offices held, return the marquis to his residence.',
    'We jointly recommend: by the facts before us, remove Yingda from his posts and send the marquis home.',
  ],
  s0065: [
    'There was an edict pardoning him.',
    'An edict pardoned him.',
  ],
  s0066: [
    'He was transferred Secular Attendant, Left Guard General.',
    'He was made Secular Attendant and Left Guard General.',
  ],
  s0067: [
    'Soon again Palace Attendant, Commandant of the Court for the Imperial Clan.',
    'Soon he was again palace attendant and Commandant of the Court for the Imperial Clan.',
  ],
  s0068: [
    'He went out as Trustworthy-and-Awesome General, Interior Administrator of Yuzhang, added salary at the rank of two thousand shi.',
    'He went out as Trustworthy-and-Awesome General and interior administrator of Yuzhang, with added salary at two thousand shi.',
  ],
  s0069: [
    'His governance was fierce and harsh; the commandery people feared him.',
    'He governed with fierce severity; the people of the commandery feared him.',
  ],
  s0070: [
    'He was promoted Bearer of the Staff of Authority, Superintendent of the military affairs of Jiang province, Governor of Jiang province, general as before.',
    'He was promoted Bearer of the Staff, superintendent of Jiang province military affairs, and governor of Jiang province, with his generalship unchanged.',
  ],
  s0071: [
    'Before long he was summoned as Regular Attendant at the Court, Right Valiant Cavalry General.',
    'Before long he was summoned as Regular Attendant at the Court and Right Valiant Cavalry General.',
  ],
  s0072: [
    'Having attained easy leisure, he especially indulged in sound and color, drank wine past measure, and by this somewhat harmed his life.',
    'Once at ease in high rank, he gave himself especially to music and women, drank beyond measure, and by this injured his health.',
  ],
  s0073: [
    'In the ninth year he was moved to Trustworthy-and-Awesome General, Right Guard General.',
    'In the ninth year he was made Trustworthy-and-Awesome General and Right Guard General.',
  ],
  s0074: [
    'That year he died, age thirty-four.',
    'That year he died, aged thirty-four.',
  ],
  s0075: [
    'The imperial carriage came to mourn; given Eastern Garden secret objects, one set court robes, one suit clothing, money twenty myriad, cloth two hundred bolts.',
    'The emperor came in person to mourn; he was given Eastern Garden funeral goods, one set of court robes, one suit of clothes, two hundred thousand cash, and two hundred bolts of cloth.',
  ],
  s0076: [
    'Posthumously he was made Palace Attendant, Central Guard General, one set of martial music.',
    'He was posthumously made palace attendant and Central Guard General, with one set of martial music.',
  ],
  s0077: [
    'Posthumous title Kang.',
    'Posthumous title: Kang.',
  ],
  s0078: [
    'Son Min succeeded.',
    'His son Min inherited.',
  ],
  s0079: [
    'Yingzhou\'s son Mi inherited Duke of Baxi, reached Attendant of the Central Court, died young.',
    'Yingzhou\'s son Mi inherited the Duke of Baxi, rose to Attendant of the Central Court, and died young.',
  ],
  s0080: [
    'Xia Hou Xiang, styled Shuye, was a native of Qiao commandery.',
    'Xia Hou Xiang, styled Shuye, came from Qiao commandery.',
  ],
  s0081: [
    'At sixteen he met his father\'s death; in mourning he was grief-stricken and wasted.',
    'At sixteen he lost his father; in mourning he was broken with grief.',
  ],
  s0082: [
    'Three years he dwelt at the tomb; once a three-legged sparrow flew to perch on his hut door—all marveled.',
    'For three years he lived at the tomb; once a three-legged sparrow flew to his hut door—all thought it strange.',
  ],
  s0083: [
    'When mourning ended, Governor Yin Yan summoned him to fill chief clerk.',
    'When mourning ended, Governor Yin Yan called him to serve as chief clerk.',
  ],
  s0084: [
    'Early in Song\'s Taishi, Yan raised Yuzhou in revolt; Emperor Ming sent Supporting-the-State General Liu Le to attack; attack and defense continued months; men\'s hearts were fearful and they would ask aid from Wei.',
    'Early in Song\'s Taishi, Yan rebelled in Yuzhou; Emperor Ming sent Supporting-the-State General Liu Le to suppress him; siege and defense dragged on for months, hearts were afraid, and they would seek help from Wei.',
  ],
  s0085: [
    'Xiang told Yan: "Today\'s undertaking, originally is to effect loyal fidelity;',
    'Xiang said to Yan: "This rising was meant from the first to prove loyal duty;',
  ],
  s0086: [
    'if the altars have support, then return the body to the court—how can one bow the body north to an alien land.',
    'if the altars have a master, let us return to the court—how bow north to an alien realm?',
  ],
  s0087: [
    'Moreover today\'s Wei troops are close at Huai bank; one army has not measured going or staying, we fear there is alien plotting.',
    'Moreover Wei\'s troops are now on the Huai; one army has not yet shown its intent, and we fear treachery.',
  ],
  s0088: [
    'If now we send an envoy to return allegiance, they will surely thickly comfort and receive—not only exempt from crime.',
    'If we send envoys to submit now, they will surely receive us generously—not only pardon.',
  ],
  s0089: [
    'If you say it is not so, your servant begs to serve as one envoy."',
    'If you doubt it, your servant begs to go as envoy."',
  ],
  s0090: [
    'Yan assented.',
    'Yan agreed.',
  ],
  s0091: [
    'Xiang saw Le and said: "General, your strict encirclement, precipitous ramparts, arrows and blades like frost; within the city fools are truly like trapped beasts; gentry and common fear execution, all wish to turn to Wei.',
    'Xiang saw Le and said: "General, your tight siege and steep walls, arrows and blades like frost—the fools in the city are trapped beasts; gentry and commoners fear death and all wish to turn to Wei.',
  ],
  s0092: [
    'Your servant therefore crossed the wall to return virtue, dares spread the belly\'s heart.',
    'Your servant crossed the wall to yield—this is my inmost heart laid bare.',
  ],
  s0093: [
    'I wish the General would extend vast liberal grace, let fall generous favor, lift siege and withdraw camp—then all will lead one another and come.',
    'I beg the General to grant vast mercy and generous favor, lift the siege and withdraw—then all will come out together.',
  ],
  s0094: [
    '" Le assented.',
    '" Le agreed.',
  ],
  s0095: [
    'Xiang said: "Examining this, it shall be as you say; yet Xiang begs to return with orders.',
    'Xiang said: "If it is truly so, it shall be as you say; but your servant begs leave to report back.',
  ],
  s0096: [
    '" Le sent him to the wall foot; Xiang called to the people within, spoke Le\'s words; that same day Yan and the multitude all came out; the whole province was preserved.',
    '" Le sent him to the foot of the wall; Xiang called to those within and told them Le\'s words; that same day Yan and all the host came out, and the whole province was saved.',
  ],
  s0097: [
    'Le became governor, again supplemented chief clerk.',
    'Le became governor and again made him chief clerk.',
  ],
  s0098: [
    'Before long he was magistrate of Xingji, administration had unusual achievement; Governor Duan Furong circulated within the border, making a model for subordinate prefectures.',
    'Before long he was magistrate of Xingji, with outstanding administration; Governor Duan Furong circulated his record within the jurisdiction as a model for subordinate prefectures.',
  ],
  s0099: [
    'He was transferred Senior Recorder, then promoted Vice Director.',
    'He was transferred to Senior Recorder, then promoted Vice Director.',
  ],
  s0100: [
    'He was transferred Senior Recorder, then promoted Vice Director.',
    'He was made Senior Recorder, then promoted Vice Director.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_010_b1.mjs <translation.json>'
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
