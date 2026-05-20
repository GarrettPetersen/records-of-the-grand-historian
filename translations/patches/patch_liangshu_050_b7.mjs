#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'His grandfather Huizhi was Song Censor-in-Chief.',
    'His grandfather Huizhi served Song as censor-in-chief.',
  ],
  s0602: [
    'His father Yi was recorder for the Prince of Shaoling of Qi.',
    'His father Yi was Qi recorder for the Prince of Shaoling.',
  ],
  s0603: [
    'Zhongrong was orphaned young and was raised by his uncle Yong.',
    'Orphaned young, Zhongrong was raised by his uncle Yong.',
  ],
  s0604: [
    'When grown he shut out worldly affairs, studied with single devotion, and day and night never set his books aside.',
    'Grown, he shut out the world, studied devotedly, and never put his books down day or night.',
  ],
  s0605: [
    'He first served as acting Army Adjutant in the Anxi Command.',
    'He began as acting army adjutant in the Anxi command.',
  ],
  s0606: [
    'Yong was already eminent; Minister of Personnel Xu Mian proposed Yong\'s son Yan Ying for palace staff, and Yong wept and said: "My elder brother\'s son is young and orphaned; his talent is passable—I beg that what Yan Ying would receive be turned to him instead.',
    'Yong was already eminent; Xu Mian as minister of personnel proposed Yong\'s son Yan Ying for palace staff; Yong wept: "My brother\'s orphaned son has passable talent—please give Yan Ying\'s post to him instead.',
  ],
  s0607: [
    '" Mian agreed, and Zhongrong was transferred to Crown Prince Attendant.',
    '" Mian agreed and made Zhongrong crown prince attendant.',
  ],
  s0608: [
    'He was moved to secretary to the Prince of Ancheng.',
    'He became secretary to the Prince of Ancheng.',
  ],
  s0609: [
    'At the time Liu Xiaobiao of Pingyuan was also on the princely staff; both were honored by the prince for their forceful learning.',
    'Liu Xiaobiao of Pingyuan was also on the staff; both were honored for forceful learning.',
  ],
  s0610: [
    'He was moved to merit-clerk of Jin\'an.',
    'He became Jin\'an merit-clerk.',
  ],
  s0611: [
    'He served in turn as magistrate of Yongkang, Qiantang, and Wukang; in governing the counties he showed no special achievement and was often impeached.',
    'He served as magistrate of Yongkang, Qiantang, and Wukang with no notable achievement and was often impeached.',
  ],
  s0612: [
    'After long service he was made the Prince of Ancheng\'s senior recorder; when he was to leave with the princely establishment the crown prince, out of old favor, specially held a farewell feast and bestowed a poem: "Master Sun climbed the Yang Road; Master Wu went to Chaoge county.',
    'After long service he became the Prince of Ancheng\'s senior recorder; leaving with the prince, the crown prince held a farewell feast and gave a poem: "Master Sun climbed the Yang Road; Master Wu went to Chaoge county.',
  ],
  s0613: [
    'Not like raising cups in Fan Forest, setting wine before Hua Palace."',
    'Not like raising wine in Fan Forest before Hua Palace."',
  ],
  s0614: [
    'Men of the time took it as an honor.',
    'Contemporaries counted it an honor.',
  ],
  s0615: [
    'He was moved to consulting adjutant to the Anxi Prince of Wuling.',
    'He became consulting adjutant to the Anxi Prince of Wuling.',
  ],
  s0616: [
    'He was made Left Vice Director of the Secretariat and dismissed for improper impeachment.',
    'Made left vice director of the secretariat, he was dismissed for improper impeachment.',
  ],
  s0617: [
    'Zhongrong was broadly learned and had early fame; he was quite willful and fond of wine, loved startling words and lofty talk—scholar friends thought less of him for it.',
    'Zhongrong was learned and famed early but willful and fond of wine, loved bold talk, and friends thought less of him.',
  ],
  s0618: [
    'Only with Wang Ji and Xie Jiqing was he truly close; they too were unrestrained, followed one another in wild drinking, and no longer kept restraint.',
    'Only Wang Ji and Xie Jiqing were close; all three were unrestrained, drank wildly together, and abandoned propriety.',
  ],
  s0619: [
    'After long time he was again consulting adjutant and went out as magistrate of Yi.',
    'Later he was again consulting adjutant and went out as magistrate of Yi.',
  ],
  s0620: [
    'When the Taiping turmoil came he was traveling in Kuaiji, fell ill, and died at age seventy-four.',
    'In the Taiping turmoil he was traveling in Kuaiji, fell ill, and died at seventy-four.',
  ],
  s0621: [
    'Zhongrong abridged Masters texts in thirty juan, collected geography books in twenty juan, Biographies of Exemplary Women in three juan, and a literary collection in twenty juan—all circulated.',
    'He abridged masters in thirty juan, geography in twenty, Exemplary Women in three, and a collection in twenty—all circulated.',
  ],
  s0622: [
    'Lu Yungong, styled Zilong, was a man of Wu commandery.',
    'Lu Yungong, styled Zilong, came from Wu commandery.',
  ],
  s0623: [
    'His grandfather Xian was provincial aide.',
    'His grandfather Xian was a provincial aide.',
  ],
  s0624: [
    'His father Wan was chief clerk of Ningyuan.',
    'His father Wan was Ningyuan chief clerk.',
  ],
  s0625: [
    'At five Yungong could recite the Analects and Mao Odes; at nine he read the Book of Han and could mostly remember it.',
    'At five he recited the Analects and Mao Odes; at nine he read the Book of Han and remembered most of it.',
  ],
  s0626: [
    'His father\'s cousin Tong and Liu Xian of Peiguo tested him on ten points; Yungong answered without fail and Xian marveled.',
    'His cousin Tong and Liu Xian of Peiguo tested him on ten points; he missed none and Xian marveled.',
  ],
  s0627: [
    'When grown he loved learning and had talent.',
    'Grown, he loved learning and had talent.',
  ],
  s0628: [
    'The province nominated him Presented Scholar.',
    'The province nominated him presented scholar.',
  ],
  s0629: [
    'He rose through posts as acting staff officer to the Xuanhui Prince of Wuling and the Pingxi Prince of Xiangdong.',
    'He rose as acting staff officer to the Xuanhui Prince of Wuling and the Pingxi Prince of Xiangdong.',
  ],
  s0630: [
    'Yungong had earlier composed "Memorial Stele for the Grand Duke Temple"; Zhang Zuan, ending his term as Wuxing governor, passed by, read it, and sighed: "Today\'s Cai Yong.',
    'Yungong had written the Grand Duke Temple stele; Zhang Zuan, leaving Wuxing, read it and sighed: "Today\'s Cai Yong.',
  ],
  s0631: [
    '" Zuan reached the capital in charge of selection, spoke of him to Gaozu, and Yungong was summoned as acting Director of Ritual in the Secretariat; soon confirmed, he entered duty at Shouguang Hall and with his title oversaw the Historiographer.',
    '" Zuan reached the capital, spoke to Gaozu, and Yungong was summoned as acting ritual director, soon confirmed, entered Shouguang duty, and oversaw the historiographer.',
  ],
  s0632: [
    'Soon he was made Historiographer, rose to Secretariat Gentleman, and held historiography as well.',
    'Soon made historiographer, he rose to secretariat gentleman and kept historiography.',
  ],
  s0633: [
    'Yungong was skilled at weiqi; once at night attending the imperial seat his warrior cap touched a candle flame and Gaozu laughed and said: "The lamp burns your marten.',
    'Yungong was skilled at weiqi; once at night on imperial duty his cap touched a candle and Gaozu laughed: "The lamp burns your marten.',
  ],
  s0634: [
    '" Gaozu was about to use Yungong as Palace Attendant—that is why he joked thus.',
    '" Gaozu was about to make him palace attendant—that is why he joked.',
  ],
  s0635: [
    'Then the new bream-boat on Tianyuan Pool was broad and short; on leisure days Gaozu would float it, inviting only Liu Zhiliao as Grand Chamberlain, Dao Gai as Chancellor of the National University, and Zhu Yi as Right Guard—and Yungong, still young in years and rank, also took part.',
    'Then the new bream-boat on Tianyuan Pool was broad and short; on leisure days Gaozu floated it with only Liu Zhiliao, Dao Gai, and Zhu Yi—and Yungong, still young, also came.',
  ],
  s0636: [
    'Such was his favor.',
    'Such was his favor.',
  ],
  s0637: [
    'In the first year of Taqing he died at age thirty-seven.',
    'In Taqing year one he died at thirty-seven.',
  ],
  s0638: [
    'Gaozu mourned him and wrote in his own hand: "Palace Attendant and Gentleman of the Yellow Gate, in charge of historiography Lu Yungong—bearing refined and keen, a rising talent of the age.',
    'Gaozu mourned him and wrote: "Palace attendant and historiography chief Lu Yungong—refined and keen, a rising talent.',
  ],
  s0639: [
    'Suddenly gone—truly grievous.',
    'Suddenly gone—deeply grievous.',
  ],
  s0640: [
    'Let mourning be held on an appointed day; grant funeral money fifty thousand and forty bolts of cloth."',
    'Hold mourning on an appointed day; grant fifty thousand cash and forty bolts of cloth."',
  ],
  s0641: [
    'Zhang Zuan was then in Xiangzhou and wrote to Yungong\'s uncle Xiang and elder brother Yanzi: "The capital messenger has come; I learn that your worthy nephew and worthy younger brother the Yellow Gate Gentleman has perished—not only your house has lost a treasure; men of insight share the grief; pain and regret will not cease.',
    'Zhang Zuan in Xiangzhou wrote Yungong\'s uncle Xiang and brother Yanzi: "The capital messenger came; your worthy nephew and brother the Yellow Gate Gentleman has died—not only your house loses a treasure; the knowing grieve with you; pain will not cease.',
  ],
  s0642: [
    'Your worthy nephew and younger brother showed spirit early; even in tender years what he saw needed scarcely be asked again.',
    'Your nephew and brother showed spirit early; in youth what he saw needed scarcely be asked again.',
  ],
  s0643: [
    'Holding oranges and embracing apple trees came from inborn feeling;',
    'Holding oranges and embracing trees came from inborn feeling;',
  ],
  s0644: [
    'sitting upright amid firewood was not from outward praise.',
    'sitting upright amid firewood was not from outward praise.',
  ],
  s0645: [
    'Gather learning and one chopstick can stand;',
    'Gather learning and one chopstick can stand;',
  ],
  s0646: [
    'question to clarify and the teacher in the heart alone awakens.',
    'question to clarify and the heart alone awakens.',
  ],
  s0647: [
    'Just past tender years his letters and arts were thorough; among many scholars he was the outstanding stream of poetry.',
    'Just past tender years his letters and arts were thorough; among scholars he was poetry\'s outstanding stream.',
  ],
  s0648: [
    'When we met we passed shoulder to shoulder; courtesy set aside bowing and parting; our hearts matched and we forgot the years between us.',
    'We met passing shoulder to shoulder; courtesy set aside formal bows; our hearts matched and we forgot the years between us.',
  ],
  s0649: [
    'Morning outings and evening feasts lasted a full year;',
    'Morning outings and evening feasts lasted a full year;',
  ],
  s0650: [
    'delighting in antiquity and unfolding texts from dawn to dusk.',
    'delighting in antiquity and unfolding texts from dawn to dusk.',
  ],
  s0651: [
    'Friends of a lifetime have mostly fallen away; what the old man remembers counts how many?',
    'Friends of a lifetime have mostly fallen away; what the old man remembers—how many?',
  ],
  s0652: [
    'As for this life, could there be many more? Joy of heart and pleasure of affairs were entrusted to one man alone.',
    'As for this life, could there be many more? Heart\'s joy was entrusted to one man alone.',
  ],
  s0653: [
    'When you moved to Xiao and Xiang you moored at Luoyang\'s bend; at the moment of parting affection showed all the more.',
    'When you moved to Xiao and Xiang you moored at Luoyang\'s bend; at parting affection deepened.',
  ],
  s0654: [
    'One evening we stopped at the imperial suburb and lingered two nights; hand in hand we lingered, unwilling to split the road.',
    'One evening we stopped at the imperial suburb and lingered two nights; hand in hand we lingered, unwilling to part.',
  ],
  s0655: [
    'Years on service, illness pressing in exile—thought dulled and long cut off from the world.',
    'Years on service, illness in exile—thought dulled and long cut off from the world.',
  ],
  s0656: [
    'Dictated at the mouth, I had no skill at it;',
    'Dictated at the mouth, I had no skill;',
  ],
  s0657: [
    'the brush moved like flight—how much the more ashamed.',
    'the brush moved like flight—all the more ashamed.',
  ],
  s0658: [
    'Old friends of the capital have all scattered like clouds and rain; only this life kept letters many times over.',
    'Old friends of the capital have scattered like clouds and rain; only this life kept letters many times.',
  ],
  s0659: [
    'Beyond form and trace, distance did not divide feeling;',
    'Beyond form and trace, distance did not divide feeling;',
  ],
  s0660: [
    'within the breast\'s plain cloth, how could wind and frost change constancy?',
    'within the plain breast, how could wind and frost change constancy?',
  ],
  s0661: [
    'Half a decade as a traveler, heart set on returning home, day by day looking east, again deepening old affection.',
    'Half a decade traveling, heart set on returning home, day by day looking east, again deepening old affection.',
  ],
  s0662: [
    'How can this parting be forever a different world!',
    'How can this parting be forever a different world!',
  ],
  s0663: [
    'At the first wave of the sleeve, who can be sure of himself? I only fear decline and that there will be no former day again.',
    'At the first wave of the sleeve, who can be sure? I only fear decline and no former day again.',
  ],
  s0664: [
    'I did not expect flowering years, spring just come, to hide the substance—grief at burying jade touches every affair with feeling.',
    'I did not expect flowering years in spring to hide the substance—grief at burying jade touches every affair.',
  ],
  s0665: [
    'I think of the affection of those who brought him forward—hearts were always deep; brotherly feeling to the utmost, and also a deep family treasure.',
    'I think of those who brought him forward—affection always deep; brotherly feeling utmost, and also a deep family treasure.',
  ],
  s0666: [
    'Suddenly this bereavement—what can be said!',
    'Suddenly this bereavement—what can be said!',
  ],
  s0667: [
    'Writing at parting adds grief; the words are out of order."',
    'Writing at parting adds grief; the words are out of order."',
  ],
  s0668: [
    'Yungong\'s cousin Caizi also had literary fame, served as Director of the Palace Secretariat, Friend of Prince Xuancheng, Crown Prince Household Vice-Governor, and Minister of Justice, and died before Yungong.',
    'Cousin Caizi also had literary fame, reached director of the palace secretariat, friend of Prince Xuancheng, crown prince vice-governor, and minister of justice, and died before Yungong.',
  ],
  s0669: [
    'Caizi\'s and Yungong\'s collected works both circulated.',
    'Caizi\'s and Yungong\'s collections both circulated.',
  ],
  s0670: [
    'Ren Xiaogong, styled Xiaogong, was a man of Linhuai in Linhuai.',
    'Ren Xiaogong, styled Xiaogong, came from Linhuai in Linhuai.',
  ],
  s0671: [
    'His great-grandfather Nongfu was Song Governor of Southern Yuzhou.',
    'His great-grandfather Nongfu was Song governor of Southern Yuzhou.',
  ],
  s0672: [
    'Xiaogong was orphaned young and was known for filial service to his mother.',
    'Orphaned young, Xiaogong was known for filial service to his mother.',
  ],
  s0673: [
    'He studied energetically; the family was poor and had no books, so he often traveled hard paths to borrow from others.',
    'He studied hard; the family was poor and bookless, so he often traveled hard paths to borrow.',
  ],
  s0674: [
    'Each book he read once he could chant back with almost nothing lost.',
    'Each book read once he could chant back with almost nothing lost.',
  ],
  s0675: [
    'His maternal grandfather Qiu Ta had old ties with Gaozu; Gaozu heard of his talent and summoned him to the Western Secretariat to compile history.',
    'Maternal grandfather Qiu Ta had old ties with Gaozu; hearing of his talent, Gaozu summoned him to the Western Secretariat to compile history.',
  ],
  s0676: [
    'He began as Court Gentleman, advanced to Shouguang duty as Vice Director of Literary Affairs, and soon also Secretariat Communications Attendant.',
    'He began as court gentleman, advanced to Shouguang as vice director of literary affairs, and soon also secretariat communications attendant.',
  ],
  s0677: [
    'He was ordered to compose the inscription under the stupa at Jianling Temple and to draft the preface to Gaozu\'s collected works—both sumptuous; from then he alone managed official brushwork.',
    'Ordered to write the Jianling stupa inscription and Gaozu\'s collected-works preface—both sumptuous—he alone managed official brushwork thereafter.',
  ],
  s0678: [
    'Xiaogong wrote swiftly; given an edict he finished on the spot as if without effort; every memorial Gaozu praised and repeatedly gave gold and silk.',
    'Xiaogong wrote swiftly; given an edict he finished on the spot; every memorial Gaozu praised and gave gold and silk.',
  ],
  s0679: [
    'In youth he had studied sutra treatises under Master Yun of Xiao Temple and understood Buddhist doctrine; by then he ate vegetables, kept precepts, and believed deeply.',
    'In youth he studied sutras under Master Yun of Xiao Temple; by then he ate vegetables, kept precepts, and believed deeply.',
  ],
  s0680: [
    'Yet he rather boasted himself, looked down on others for talent, and often neglected his contemporaries—the age thought less of him for it.',
    'Yet he boasted himself, looked down on others, and often neglected contemporaries—the age thought less of him.',
  ],
  s0681: [
    'In the second year of Taqing, Hou Jing pressed the capital; Xiaogong petitioned to raise troops under Xiao Zhengde and encamped on the south bank.',
    'In Taqing year two Hou Jing pressed the capital; Xiaogong raised troops under Xiao Zhengde on the south bank.',
  ],
  s0682: [
    'When the rebels came Zhengde led his host to join them; Xiaogong returned to the terrace but the gate was closed, fled into the Eastern Palace, and was killed when the city fell.',
    'When rebels came Zhengde joined them; Xiaogong returned to the terrace but the gate was closed, fled to the Eastern Palace, and was killed when the city fell.',
  ],
  s0683: [
    'His collected works circulated.',
    'His collected works circulated.',
  ],
  s0684: [
    'Xie was orphaned young and raised by his mother\'s clan.',
    'Orphaned young, Xie was raised by his mother\'s clan.',
  ],
  s0685: [
    'In youth he was praised for bearing and measure.',
    'In youth he was praised for bearing and measure.',
  ],
  s0686: [
    'He read widely and was skilled in cursive and clerical script.',
    'He read widely and was skilled in cursive and clerical script.',
  ],
  s0687: [
    'On first appointment he was Gentleman of the Prince of Xiangdong\'s state and also staff recorder.',
    'On first appointment he was gentleman of the Prince of Xiangdong\'s state and also staff recorder.',
  ],
  s0688: [
    'When Shizu went out to govern Jingzhou he became chief recorder.',
    'When Shizu governed Jingzhou he became chief recorder.',
  ],
  s0689: [
    'Gu Xie of Wu commandery was also at the princely residence; same name as Xie and near in talent—the headquarters called them "the two Xies."',
    'Gu Xie of Wu was also at the princely residence; same name and near in talent—they were called "the two Xies."',
  ],
  s0690: [
    'His uncle by marriage Xie Yan of Chen commandery died; Xie, having rearing grace, observed mourning like a nephew to an uncle, and critics respected it.',
    'Uncle by marriage Xie Yan of Chen died; Xie, having rearing grace, mourned like a nephew to an uncle, and critics respected it.',
  ],
  s0691: [
    'Moved too by the family\'s moral misfortune, he sought no prominence, always declining summons, remaining only at the princely house.',
    'Moved by the family\'s moral misfortune, he sought no prominence, always declining summons, remaining only at the princely house.',
  ],
  s0692: [
    'In the fifth year of Datong he died at age forty-two.',
    'In Datong year five he died at forty-two.',
  ],
  s0693: [
    'Shizu deeply mourned him and composed "Poem of Remembering the Past" to grieve.',
    'Shizu deeply mourned him and wrote "Poem of Remembering the Past" to grieve.',
  ],
  s0694: [
    'One stanza says: "Hongdu has much elegant breadth; trust indeed holds guest substance.',
    'One stanza says: "Hongdu has much elegant breadth; trust indeed holds guest substance.',
  ],
  s0695: [
    'The wild goose has not yet risen high; fine talent is submerged in low rank."',
    'The wild goose has not yet risen high; fine talent is submerged in low rank."',
  ],
  s0696: [
    'Xie\'s Five Treatises on Jin Immortals and two juan of solar-lunar portents were lost in fire.',
    'His Five Treatises on Jin Immortals and two juan of solar-lunar portents were lost in fire.',
  ],
  s0697: [
    'He had two sons: Zhiyi and Zhitui, both early known.',
    'He had two sons, Zhiyi and Zhitui, both early known.',
  ],
  s0698: [
    'Zhitui during Chengsheng rose to Regular Gentleman and Secretariat Attendant.',
    'Zhitui during Chengsheng rose to regular gentleman and secretariat attendant.',
  ],
  s0699: [
    'Yao Cha of Chen, Minister of Personnel, said: Emperor Wen of Wei said ancient men of letters rarely kept reputation and integrity intact.',
    'Yao Cha of Chen, minister of personnel, said: Emperor Wen of Wei said ancient men of letters rarely kept reputation and integrity intact.',
  ],
  s0700: [
    'Why?',
    'Why?',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b7.mjs <translation.json>'
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
