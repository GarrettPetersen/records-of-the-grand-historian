#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Dao Hang, Qiu Chi, Liu Bao, Yuan Jun, Yu Yuling, younger brother Jianwu, Liu Zhao, He Xun, Zhong Rong, Zhou Xingsi, Wu Jun',
    'Dao Hang · Qiu Chi · Liu Bao · Yuan Jun · Yu Yuling · Jianwu (brother) · Liu Zhao · He Xun · Zhong Rong · Zhou Xingsi · Wu Jun',
  ],
  s0002: [
    'In the past Sima Qian and Ban Gu in their histories both made a "Biography of Sima Xiangru"; Xiangru did not take part in great affairs of the Han court—they took him because his writings were especially outstanding.',
    'Long ago Sima Qian and Ban Gu each wrote a Sima Xiangru biography though Xiangru never shaped Han statecraft—they chose him for supreme literary fame.',
  ],
  s0003: [
    'Gu also wrote the "Biographies of Jia, Zou, Mei, and Lu," likewise taking them because they could write and be transmitted.',
    'Gu also wrote the Jia–Zou–Mei–Lu group biography, again honoring men who wrote well enough to endure.',
  ],
  s0004: [
    'Fan Ye\'s Book of the Later Han has a "Garden of Letters," and those it records are already treated at great length.',
    'Fan Ye\'s Later Han includes a Garden of Letters with very full notices already.',
  ],
  s0005: [
    'Yet to weave the state through rites and music and to link past and present in telling good and evil—nothing but writing will serve.',
    'Yet binding statecraft to rites and music and threading ages to judge good and evil demands writing alone.',
  ],
  s0006: [
    'Hence rulers over all under Heaven have none who did not esteem and delight in its meaning; gentry learning all prized and honored its Way—from antiquity to the present it has not been changed.',
    'So every sovereign has cherished its doctrine; every scholar-official has honored its path—unchanged through time.',
  ],
  s0007: [
    'Gaozu was wise and brilliant in literary thought, his light dwelling over the realm; he sought Confucian elegance on every side and issued edicts to gather unusual men—the splendor of letters gathered all together.',
    'Gaozu, clear-minded and literary, lit the realm, sought Confucians everywhere, and summoned odd talents until letters blazed in one place.',
  ],
  s0008: [
    'On each tour he would order the ministers to compose poems; those whose writing was good received gold and silk, and those who came to the court with fu and eulogies were sometimes granted audience.',
    'Wherever he traveled he made ministers write poems; the best won gold and silk, and some who brought fu and hymns to court were received in audience.',
  ],
  s0009: [
    'Among those in office were Shen Yue, Jiang Yan, and Ren Fang—all famed for literary color, unsurpassed in their day.',
    'At court Shen Yue, Jiang Yan, and Ren Fang led in literary brilliance, unmatched then.',
  ],
  s0010: [
    'As for Pengcheng Dao Hang, Wuxing Qiu Chi, Donghai Wang Sengru, Wu commandery Zhang Shuai, and the like—some entered duty at Wende, some passed feasts at Shouguang—all were choices of the next generation.',
    'Pengcheng\'s Dao Hang, Wuxing\'s Qiu Chi, Donghai\'s Wang Sengru, Wu\'s Zhang Shuai, and others served at Wende or Shouguang feasts—rising stars all.',
  ],
  s0011: [
    'Yue, Yan, Fang, and Sengru are treated separately under deeds of merit.',
    'Yue, Yan, Fang, and Sengru appear elsewhere for their achievements.',
  ],
  s0012: [
    'Now I join Dao Hang and other men of letters and learning down to men of the Taiping era in this "Biography of Men of Letters."',
    'Here I collect Dao Hang and fellow writers and scholars through the Taiping period in this Biography of Men of Letters.',
  ],
  s0013: [
    'Dao Hang, courtesy name Maoxie, was a man of Wuyuan in Pengcheng.',
    'Dao Hang, styled Maoxie, came from Wuyuan in Pengcheng.',
  ],
  s0014: [
    'His great-grandfather Yanzhi was a Song general.',
    'His great-grandfather Yanzhi served Song as a general.',
  ],
  s0015: [
    'His father Hui was Qi Minister of the Five Arms.',
    'His father Hui was Qi minister of the five arms.',
  ],
  s0016: [
    'Hang was clever as a child; at five, when Hui copied ancient poems on a screen, Hang asked to be taught, read them once, and could chant them by heart with nothing lost.',
    'At five Hang heard his father copy poems on a screen, asked to learn them, read once, and recited every line from memory.',
  ],
  s0017: [
    'When grown he studied diligently, was skilled at writing, and excelled in seal and clerical scripts.',
    'Grown, he studied hard, wrote well, and mastered seal and clerical script.',
  ],
  s0018: [
    'His bearing was handsome and his deportment pleasing.',
    'He had fine presence and pleasing manners.',
  ],
  s0019: [
    'In the Jianwu era of Qi he first took office as Army Adjutant in the Rear Guard.',
    'Under Qi Jianwu he began as Rear Guard army adjutant.',
  ],
  s0020: [
    'At the start of Tianjian he was promoted to chief clerk of the Expeditionary Force.',
    'Early Tianjian he became chief clerk of the expeditionary force.',
  ],
  s0021: [
    'When Gaozu first held the realm he gathered the worthy and greatly loved Hang\'s talent.',
    'Gaozu, newly ruling, sought talent and prized Hang highly.',
  ],
  s0022: [
    'When the Eastern Palace was established he was made Crown Prince\'s Libationer.',
    'When the crown prince was named he became the prince\'s libationer.',
  ],
  s0023: [
    'At that time the Wende Hall housed a Scholars\' Office, summoning men of high talent and great learning to await edicts there and collate the classics and histories; Hang was ordered to hold a pass for entry.',
    'Wende Hall then held a scholars\' office of eminent readers collating the classics; Hang received palace access.',
  ],
  s0024: [
    'Once Gaozu feasted at Huaguang Hall and ordered the ministers to compose poems, singling out Hang alone for two hundred characters to be finished in three quarters of an hour.',
    'At a Huaguang feast Gaozu ordered poems but gave Hang alone two hundred characters and three quarters of an hour.',
  ],
  s0025: [
    'Hang composed while seated and presented it; the text was very fine.',
    'He wrote seated, presented it, and the piece was excellent.',
  ],
  s0026: [
    'Soon he was libationer managing Eastern Palace records and drafting superior policy papers in the Secretariat.',
    'Soon he managed Eastern Palace records and drafted superior memorials for the Secretariat.',
  ],
  s0027: [
    'In the third year an edict made incumbent Secretariat gentlemen who were pure and able or of lofty talent into vice directors; Hang was made Vice Director of the Palace Bureau.',
    'Year three made able Secretariat gentlemen into vice directors; Hang became vice director of the palace bureau.',
  ],
  s0028: [
    'Hang\'s cousins Gai and Qia both had literary fame and at the time alternated in the palace bureau—an honor of the age.',
    'His cousins Gai and Qia, both famed writers, alternated in that bureau—a contemporary glory.',
  ],
  s0029: [
    'In the fourth year he was promoted to Crown Prince Household Attendant.',
    'Year four he rose to crown prince household attendant.',
  ],
  s0030: [
    'Hang did not boast himself nor discuss others\' faults; Ren Fang of Le\'an and Fan Yun of Nanxiang were both his close friends.',
    'He never boasted or gossiped about others; Ren Fang and Fan Yun were close friends.',
  ],
  s0031: [
    'That year he was made Assistant Magistrate of Danyang but, ill, could not handle duties and was moved to Consulting Colonel of the Northern Army.',
    'That year he became Danyang assistant magistrate, fell ill, and shifted to northern army consulting colonel.',
  ],
  s0032: [
    'In the fifth year he died in office at age thirty.',
    'Fifth year he died in office at thirty.',
  ],
  s0033: [
    'Gaozu deeply mourned him and ordered two ten-thousands in cash and thirty bolts of cloth.',
    'Gaozu mourned him and granted twenty thousand cash and thirty bolts of cloth.',
  ],
  s0034: [
    'His collected poems and fu number over a hundred.',
    'He left more than a hundred poems and fu.',
  ],
  s0035: [
    'Qiu Chi, courtesy name Xifan, was a man of Wucheng in Wuxing.',
    'Qiu Chi, styled Xifan, was from Wucheng in Wuxing.',
  ],
  s0036: [
    'His father Lingju had literary fame and served Qi to Grand Master of Palace Counsel.',
    'His father Lingju, a noted writer, reached Qi Grand Master of Palace Counsel.',
  ],
  s0037: [
    'At eight Chi could compose; Lingju often said his bone and breath were like mine.',
    'At eight Chi wrote prose; Lingju said his spirit matched his own.',
  ],
  s0038: [
    'Gentleman of the Yellow Gate Xie Chaozong and recluse He Dian both saw him and were struck.',
    'Xie Chaozong and He Dian both marveled at him young.',
  ],
  s0039: [
    'When grown he was summoned as staff aide, nominated as Outstanding Talent, and appointed Erudite of the Imperial University.',
    'Grown, he was a staff aide, nominated outstanding talent, and made imperial university erudite.',
  ],
  s0040: [
    'He was promoted to Army Aide in the Grand Marshal\'s service and left office on his father\'s death.',
    'He rose to grand marshal army aide, then left for mourning.',
  ],
  s0041: [
    'When mourning ended he was made Army Aide of the Western Army.',
    'After mourning he became western army aide.',
  ],
  s0042: [
    'He was repeatedly promoted to Palace Gentleman and left on his mother\'s death.',
    'He rose to palace gentleman, then left for his mother\'s mourning.',
  ],
  s0043: [
    'When mourning ended he again became Palace Gentleman and was promoted to Army Registrar.',
    'After mourning he returned as palace gentleman, then army registrar.',
  ],
  s0044: [
    'When Gaozu pacified the capital he opened the lord\'s office and made Chi Rapid Cavalry chief clerk, treating him with great courtesy.',
    'When Gaozu took the capital he made Chi rapid cavalry chief clerk and honored him.',
  ],
  s0045: [
    'At that time the memorials urging the King of Liang to advance and for special rites were all Chi\'s writing.',
    'Memorials urging Liang Wang to advance and for special rites were Chi\'s work.',
  ],
  s0046: [
    'When Gaozu took the throne Chi was made Secretariat Gentleman, soon promoted to Vice Director of the Secretariat, headed the Wuxing district chief, and awaited edicts at Wende Hall.',
    'At enthronement Chi became secretariat gentleman, then vice director, Wuxing chief, and Wende attendant.',
  ],
  s0047: [
    'When Gaozu wrote Linked Pearls he ordered dozens of ministers to continue them; Chi\'s text was finest.',
    'Gaozu\'s Linked Pearls drew dozens of continuations; Chi\'s was best.',
  ],
  s0048: [
    'In the third year of Tianjian he went out as Administrator of Yongjia; in the commandery he did not perform well and was impeached by the authorities, but Gaozu loved his talent and shelved the memorial.',
    'Tianjian year three he governed Yongjia poorly and was impeached; Gaozu shelved it for love of his gift.',
  ],
  s0049: [
    'In the fourth year General of the Center Linchuan Wang Hong marched north; Chi was consulting colonel and chief secretary.',
    'Year four Prince Linchuan marched north; Chi was consulting colonel and chief secretary.',
  ],
  s0050: [
    'Chen Bozhi was then in the north opposing Wei with his army; Chi wrote to persuade him, and Bozhi surrendered.',
    'Chen Bozhi held the north against Wei; Chi\'s letter persuaded him to surrender.',
  ],
  s0051: [
    'On return he was made Secretariat Gentleman and promoted to Secretariat Attendant.',
    'Returning he became secretariat gentleman, then secretariat attendant.',
  ],
  s0052: [
    'In the seventh year he died in office at age forty-five.',
    'Seventh year he died in office at forty-five.',
  ],
  s0053: [
    'His poems and fu circulated in the world.',
    'His poems and fu circulated widely.',
  ],
  s0054: [
    'Liu Bao, courtesy name Xiaochang, was a man of Pengcheng.',
    'Liu Bao, styled Xiaochang, was from Pengcheng.',
  ],
  s0055: [
    'His grandfather Xun was Song Minister of Works.',
    'Grandfather Xun had been Song Minister of Works.',
  ],
  s0056: [
    'His father Xuan was Qi Crown Prince Household Vice-Supervisor.',
    'His father Xuan was Qi crown prince vice-supervisor.',
  ],
  s0057: [
    'Bao\'s father died when he was four; at six or seven he wept whenever he saw his uncles.',
    'His father died when he was four; at six or seven he wept at sight of his uncles.',
  ],
  s0058: [
    'His uncles Juan and Hui and others were then all eminent; his mother thought he feared them and was angry.',
    'His uncles Juan, Hui, and others were eminent; his mother thought fear made him weep and scolded him.',
  ],
  s0059: [
    'Bao replied: "Orphaned early, I never knew them; hearing that my uncles greatly resemble one another, my heart simply wants to grieve—there is no other intent.',
    'Bao answered: "Orphaned young I never knew them; told my uncles are much alike, I grieve from the heart only—no other motive.',
  ],
  s0060: [
    '"; and he sobbed; his mother too was deeply stricken.',
    '"; he sobbed, and his mother wept bitterly too.',
  ],
  s0061: [
    'Earlier Bao\'s parents and two elder brothers had died in succession and were all given temporary burial.',
    'Parents and two elder brothers had died in turn and lain in temporary graves.',
  ],
  s0062: [
    'At sixteen Bao moved the graves and arranged reburial without help from his uncles; soon all was done—Hui often sighed in admiration.',
    'At sixteen he moved and reburied them without uncles\' aid; Hui marveled when all was finished.',
  ],
  s0063: [
    'In youth he loved learning and could write.',
    'Young he loved learning and wrote well.',
  ],
  s0064: [
    'He first took office as Army Aide in the Secretariat but did not accept.',
    'He was offered secretariat army aide but declined.',
  ],
  s0065: [
    'At the start of Tianjian, as younger brother of the Linchuan princess, he went from chief clerk of the expeditionary force to merit officer of the prince\'s center army, then rose through posts in the treasury, Danyang, crown prince tutor, palace bureau, and southern Xuzhou staff, and was dismissed for public business.',
    'Early Tianjian, as the Linchuan princess\'s brother, he rose from expeditionary clerk through treasury, Danyang, tutor, palace, and Xuzhou posts until dismissed on public grounds.',
  ],
  s0066: [
    'After long service he was Crown Prince Libationer, kept records, and lectured at Shouguang Hall.',
    'Later he was crown prince libationer, kept records, and lectured at Shouguang.',
  ],
  s0067: [
    'From Gaozu\'s accession he drew later literary men; Bao with his cousin Xiaochuo, cousin Ru, fellow townsman Dao Gai, Gai\'s brother Qia, cousin Hang, Lu Chun of Wu, and Zhang Shuai were all known for ornament and often at feasts—though promotions differed, rewards did not.',
    'Since Gaozu\'s accession Bao, Xiaochuo, Ru, Dao Gai, Qia, Hang, Lu Chun, and Zhang Shuai shone at court feasts; ranks differed but gifts did not.',
  ],
  s0068: [
    'In the tenth year of Tianjian he died at age thirty.',
    'Tianjian year ten he died at thirty.',
  ],
  s0069: [
    'At the end he called his friend Liu Zhilin of Nanyang to entrust funeral matters, insisting on thrift.',
    'Dying he asked Liu Zhilin to bury him thriftily.',
  ],
  s0070: [
    'In office Bao had a name for ability; his nature was gentle yet straight—with friends he rebuked their faults to their faces but praised their virtues in private, hiding nothing; gentlemen lamented this.',
    'Able in office, gentle yet frank, he criticized friends openly and praised them privately; all mourned that honesty.',
  ],
  s0071: [
    'Yuan Jun, courtesy name Xiaogao, was from Yangxia in Chen commandery, eighth-generation descendant of Wei Palace Attendant Huan.',
    'Yuan Jun, styled Xiaogao, of Chen Yangxia, eighth generation from Wei\'s Yuan Huan.',
  ],
  s0072: [
    'Jun was orphaned early, devoted in will and fond of learning; the family was poor and had no books—whenever he borrowed he copied everything, setting himself fifty sheets a day and not resting if the count fell short.',
    'Orphaned early, poor, bookless, he copied every loan at fifty sheets a day and would not rest short of quota.',
  ],
  s0073: [
    'He was slow of speech and skilled in literary phrasing.',
    'Slow-spoken, he excelled in literary phrasing.',
  ],
  s0074: [
    'When the righteous army took the capital, Prince of Poyang Hui marched east to Pogang; Jun followed the prince managing records.',
    'When the army took the capital Jun followed Prince Poyang Hui east and kept his records.',
  ],
  s0075: [
    'At the start of Tianjian the Poyang state was founded and Jun was made Vice Director, following the prince to garrison Jingkou.',
    'Early Tianjian he became Poyang vice director and followed the prince to Jingkou.',
  ],
  s0076: [
    'When the prince moved to Yingzhou he also served as Army Registrar.',
    'When the prince went to Yingzhou he was army registrar too.',
  ],
  s0077: [
    'Gaozu loved ci and fu; at that time those presenting writing at the Southern Gate were unbroken, and the ornate were sometimes rewarded and promoted.',
    'Gaozu loved fu; writers thronged the southern gate and the ornate sometimes won office.',
  ],
  s0078: [
    'In the sixth year Jun modeled Yang Xiong\'s "Admonition on Offices" and submitted it.',
    'Year six he modeled Yang Xiong\'s Admonition on Offices and submitted it.',
  ],
  s0079: [
    'Gaozu was pleased and gave silk.',
    'Gaozu praised him and gave silk.',
  ],
  s0080: [
    'He was made Supernumerary Secretariat Gentleman, served in the Wende scholars\' office, and copied the Records of the Historian and Book of Han, twenty scrolls each.',
    'He became supernumerary secretariat gentleman, served Wende scholars, and copied Records and Han, twenty scrolls each.',
  ],
  s0081: [
    'He was also ordered with Lu Chun each to compose a New Palace Inscription; most of the text is not recorded.',
    'Ordered with Lu Chun to write New Palace inscriptions—most text omitted here.',
  ],
  s0082: [
    'Yu Yuling, courtesy name Zijie, was younger brother of Secretariat Regular Attendant Qianlou.',
    'Yu Yuling, styled Zijie, was younger brother of Regular Attendant Qianlou.',
  ],
  s0083: [
    'At seven he could discourse on dark learning.',
    'At seven he could expound dark learning.',
  ],
  s0084: [
    'When grown he was clear, alert, broadly learned, and full of talent.',
    'Grown, he was clear, alert, learned, and inventive.',
  ],
  s0085: [
    'When Qi Prince of Sui Zilong was in Jingzhou he summoned him as chief clerk and had him collate books with Xie Tiao and Zong Que.',
    'Qi Prince Sui in Jingzhou made him chief clerk to collate books with Xie Tiao and Zong Que.',
  ],
  s0086: [
    'When Zilong returned to the capital he was again made chief clerk for the farewell party.',
    'When Zilong returned he again led the farewell staff.',
  ],
  s0087: [
    'Zilong was soon killed by Mingdi; staff feared and fled—only Yuling and Que stayed to manage the funeral.',
    'Mingdi soon killed Zilong; staff fled—only Yuling and Que arranged the funeral.',
  ],
  s0088: [
    'Prince of Shian Yaoguang was General Who Pacifies the Army and made him Army Aide and chief secretary.',
    'Prince Shian Yaoguang made him army aide and chief secretary.',
  ],
  s0089: [
    'At the end of Yongyuan he was made Magistrate of Sui\'an in Dongyang and was praised by people and officials.',
    'Late Yongyuan he governed Sui\'an in Dongyang and won praise from people and officials.',
  ],
  s0090: [
    'At the start of Tianjian he was prison reviewer in Jiankang, then promoted to Gentleman of the Ministry of Works and awaited edicts at Wende.',
    'Early Tianjian he reviewed Jiankang prison, then became works gentleman and Wende attendant.',
  ],
  s0091: [
    'He went out as Xiangzhou vice governor, then Rapid Cavalry registrar and Secretariat courier.',
    'He was Xiangzhou vice governor, then rapid cavalry registrar and secretariat courier.',
  ],
  s0092: [
    'Soon he headed the southern district chief, was made Crown Prince Libationer, and kept his courier post.',
    'Soon he headed the southern chief, became crown prince libationer, and kept courier duty.',
  ],
  s0093: [
    'By old practice Eastern Palace posts were all pure selections; the libationer held documents and was especially pure.',
    'Eastern Palace posts were pure picks; the libationer\'s documents were purest of all.',
  ],
  s0094: [
    'In recent times appointees were taken from great clans with talent and fame; Yuling and Zhou She were both chosen for the post, and Gaozu said: "Office is made noble by the man—why limit it to great clans?',
    'Lately only great clans with fame were chosen; Yuling and Zhou She were picked, and Gaozu said: "Men ennoble office—why bind it to clan?',
  ],
  s0095: [
    '"; contemporaries praised this.',
    '"; the age praised it.',
  ],
  s0096: [
    'Soon he was promoted to Secretariat Gentleman and changed to head the Jingzhou chief.',
    'Soon he was secretariat gentleman and Jingzhou chief.',
  ],
  s0097: [
    'He was repeatedly promoted to Secretariat Vice Director; courier and chief posts were unchanged.',
    'He rose to secretariat vice director while keeping courier and chief posts.',
  ],
  s0098: [
    'He went out as Chief of Staff to Prince Jin\'an of Xuanyi and Administrator of Guangling, acting for the prefecture, and was dismissed on public business.',
    'He was Jin\'an prince chief of staff and Guangling governor, acting prefecture, then dismissed.',
  ],
  s0099: [
    'He was reappointed Palace Attendant, soon made Minister of Ceremonies, and again headed Jingzhou.',
    'Reappointed palace attendant, soon minister of ceremonies and again Jingzhou chief.',
  ],
  s0100: [
    'He died in office at age forty-eight.',
    'He died in office at forty-eight.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_049_b1.mjs <translation.json>'
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
