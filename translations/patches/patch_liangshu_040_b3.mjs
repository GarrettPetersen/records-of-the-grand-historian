#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Mao held it inadmissible and submitted a memorial:',
    'Mao judged it impossible and memorialized:',
  ],
  s0202: [
    'Your servant finds that when Shun visited Dai, it was a tour of inspection; yet Zheng cites the Weft of the Classic of Filial Piety, Apocryphal Decisions: “He enfeoffed at Mount Tai, examined merit with a firewood offering, performed Shan at Mount Liangfu, and carved stone to record his title.”',
    'I find Shun’s visit to Dai was a royal tour of inspection; yet Zheng Xuan cites the apocryphal Hooking Life Decisions on the Classic of Filial Piety: “Enfeoffment at Mount Tai, merit reviewed with a firewood offering, Shan at Mount Liangfu, stone carved to record the title.”',
  ],
  s0203: [
    'These are tortuous readings of apocryphal weft-texts, not the settled sense of the orthodox classics.',
    'That is a forced reading from weft apocrypha, not the plain meaning of the canonical classics.',
  ],
  s0204: [
    'According to the Comprehensive Discussions in the White Tiger Hall, “Feng means to enlarge what is attached;',
    'The Comprehensive Discussions in the White Tiger Hall says, “Feng means to enlarge what is joined;',
  ],
  s0205: [
    'Shan means to hand on success.”',
    'Shan means to transmit achievement.”',
  ],
  s0206: [
    'If Shan is taken to mean ceding the throne, then Yu ought not to have passed the line from Qi to Jie through seventeen reigns, nor Tang from Wai Bing to Zhou through thirty-seven.',
    'If Shan meant abdication, Yu would not have passed the throne from Qi to Jie across seventeen reigns, nor Tang from Wai Bing to Zhou across thirty-seven.',
  ],
  s0207: [
    'Again the Record of Rites says: “The Three Sovereigns performed Shan with exuberant ease—meaning their overflowing virtue.',
    'The Record of Rites also says: “The Three Sovereigns’ Shan was exuberant ease”—that is, overflowing virtue.',
  ],
  s0208: [
    'The Five Emperors performed Shan with lofty uprightness—meaning they stood alone and rose by their own persons.',
    'The Five Emperors’ Shan was lofty uprightness”—they stood alone and rose by their own merit.',
  ],
  s0209: [
    'The Three Kings performed Shan at Mount Liangfu—meaning unbroken succession, father dying and son succeeding.”',
    'The Three Kings’ Shan was at Mount Liangfu”—unbroken succession, father dead and son following.”',
  ],
  s0210: [
    '” If “Shan with exuberant ease” is said to mean overflowing virtue, the ancient sense takes Fuxi, Shennong, and the Yellow Emperor as the Three Sovereigns.',
    '” If “exuberant ease” meant overflowing virtue, antiquity counted Fuxi, Shennong, and the Yellow Emperor as the Three Sovereigns.',
  ],
  s0211: [
    'Fuxi performed Feng at Mount Tai and Shan at such-and-such a place; the Yellow Emperor performed Feng at Mount Tai and Shan with lofty uprightness—neither performed Shan with exuberant ease, yet if one speaks of overflowing virtue, there is nothing to which it can attach.',
    'Fuxi enfeoffed at Mount Tai and performed Shan at such-and-such a hill; the Yellow Emperor enfeoffed at Mount Tai and Shan with lofty uprightness—neither used “exuberant ease,” so “overflowing virtue” has nowhere to lodge.',
  ],
  s0212: [
    'If the Five Emperors’ “Shan with lofty uprightness” means standing alone and rising by one’s own person, Zhuanxu performed Feng at Mount Tai and Shan at such-and-such a place; Emperor Ku, Yao, and Shun did the same—none performed Shan with lofty uprightness. If the Yellow Emperor is counted among the Five Emperors, Shaohao was the Yellow Emperor’s son, which again is not the sense of standing alone.',
    'If the Five Emperors’ “lofty uprightness” meant standing alone, Zhuanxu, Ku, Yao, and Shun all enfeoffed at Mount Tai and performed Shan at such-and-such hills—none with “lofty uprightness.” Count the Yellow Emperor among the Five and Shaohao was his son—hardly “standing alone.”',
  ],
  s0213: [
    'If the Three Kings’ Shan at Mount Liangfu means unbroken succession, father dead and son succeeding, Yu performed Feng at Mount Tai and Shan at such-and-such a place; King Cheng of Zhou performed Feng at Mount Tai and Shan at Mount Sheshou—as old books have it, differing from the Ritual Explanations; all are hearsay, having lost the original text.',
    'If the Three Kings’ Shan at Mount Liangfu meant unbroken father-to-son succession, Yu enfeoffed at Mount Tai and performed Shan elsewhere; Zhou King Cheng enfeoffed at Mount Tai and Shan at Mount Sheshou—so the old books say, unlike the Ritual Explanations: hearsay all, the originals lost.',
  ],
  s0214: [
    'Suppose all Three Kings performed Feng at Mount Tai and Shan at Mount Liangfu: then Feng at Mount Tai would carry the sense of handing on the world, while Shan at Mount Liangfu would carry the intent of yielding the throne—whether one wished to abdicate or to pass the throne to a son, the meanings contradict one another; reason cannot allow it.',
    'Suppose every Three King enfeoffed at Mount Tai and performed Shan at Mount Liangfu: Feng would mean handing on the realm, Shan at Liangfu would mean yielding the throne—abdicate or bequeath to a son, the senses clash; it cannot stand.',
  ],
  s0215: [
    'Again, the seventy-two rulers recorded by Guan Zhong—among these middle antiquity can yield only a little more than twenty lords: Fuxi, Shennong, Nüwa, Dating, Baihuang, Zhongyang, Lilu, Lilian, Hexu, Zunlu, Hundun, Haoying, Youchao, Zhuxiang, Getian, Yinkang, Wuhuai, the Yellow Emperor, Shaohao, Zhuanxu, Gaoxin, Yao, Shun, Yu, Tang, Wen, Wu—in the middle there was even Gonggong, who dominated the Nine Provinces as a hegemon, not an emperor’s number; how could there have been seventy-two rulers performing Feng and Shan?',
    'Guan Zhong’s seventy-two rulers, counted soberly, yield barely twenty-odd names—Fuxi through Wu, with Gonggong hegemon of the Nine Provinces in between, no emperor’s tally: whence seventy-two Feng-and-Shan kings?',
  ],
  s0216: [
    'Moreover, from before the Fire-Drillers down to the Zhou age there were not yet ruler and minister; hearts were plain and simple—one should not speak of gold paste and jade cases, ascending the central peak and carving stone.',
    'Before the Fire-Drillers through Zhou there was no ruler-and-minister order and hearts were plain—gold paste, jade cases, ascent of the central peak, and carved stone do not belong there.',
  ],
  s0217: [
    'The Fire-Drillers, Fuxi, and Shennong, the Three Sovereigns, governed by knotted cords; writing was not yet made—one should not speak of carving characters to announce completion.',
    'The Three Sovereigns—Fire-Drillers, Fuxi, Shennong—ruled by knotted cords before script existed; carved characters proclaiming completion are out of place.',
  ],
  s0218: [
    'Moreover, Wuhuai was the sixteenth ruler after Fuxi—how could he have performed Feng at Mount Tai and Shan at such-and-such a place before Fuxi?',
    'Wuhuai was Fuxi’s sixteenth successor—how could he enfeoff at Mount Tai and perform Shan before Fuxi?',
  ],
  s0219: [
    'Guan Zhong also said: “Only a ruler who has received the mandate may perform Feng and Shan.”',
    'Guan Zhong also said, “Only a mandate-bearing ruler may perform Feng and Shan.”',
  ],
  s0220: [
    '” King Cheng of Zhou was not a mandate-receiving ruler—how could he perform Feng at Mount Tai and Shan at Mount Sheshou?',
    '” King Cheng of Zhou did not receive the mandate—how could he enfeoff at Mount Tai and perform Shan at Mount Sheshou?',
  ],
  s0221: [
    'Shennong and the Flame Emperor were one lord, yet the text says Shennong performed Feng at Mount Tai and Shan at such-and-such a place, and the Flame Emperor performed Feng at Mount Tai and Shan at such-and-such a place—split into two men; the error is extreme!',
    'Shennong and the Flame Emperor were one sovereign, yet the record splits them into two who each enfeoffed at Mount Tai and performed Shan—an egregious fiction.',
  ],
  s0222: [
    'If they were sage rulers, Feng and Shan were unnecessary;',
    'Sage rulers had no need of Feng and Shan;',
  ],
  s0223: [
    'if they were ordinary rulers, they ought not to perform Feng and Shan.',
    'ordinary rulers ought not to attempt them.',
  ],
  s0224: [
    'Surely Duke Huan of Qi wished to carry out this affair; Guan Zhong knew it could not be done and therefore raised prodigies to bend his will.',
    'Duke Huan of Qi wished to do it; Guan Zhong knew it impossible and piled up marvels to turn him aside.',
  ],
  s0225: [
    'Qin Shihuang, ascending Mount Tai midway, was met by a sudden storm; he rested beneath a pine and enfeoffed it as one of the Five Great Officers, yet the rite was not completed.',
    'Qin Shihuang climbed halfway up Mount Tai when wind and rain burst upon him; he sheltered under a pine, enfeoffed it as a Great Officer of the fifth rank, and still the rite failed.',
  ],
  s0226: [
    'Emperor Wu of Han trusted the recipes of the masters of methods, broadly summoned Confucians, donned the leather cap and inserted the girdle-pin, shot the ox in the rite, and went up alone with Huo Shang; soon after, Zihou died suddenly and the emperor injured his foot.',
    'Han Wudi believed the recipe masters, summoned Confucians in leather caps and pinned sashes, shot the ox in the rite, and ascended with Huo Shang alone; soon Zihou died suddenly and the emperor hurt his foot.',
  ],
  s0227: [
    'Under Emperor Ming of Wei, Gao Tanglong was ordered to draft the ritual protocols; when Long died, the emperor sighed, “Heaven does not wish my affair to succeed—Master Gao has left me in death.”',
    'Wei Mingdi had Gao Tanglong draft the rites; when Long died the emperor sighed, “Heaven will not let me finish—Gao has left me.”',
  ],
  s0228: [
    '” In the Taishi era of Jin Wu the court wished to perform Feng and Shan; even in the Taikang deliberations it was still unsettled, and in the end the intent was not carried out.',
    '” Jin Wudi in Taishi meant to perform Feng and Shan; debate still ran at Taikang, and the rite never came off.',
  ],
  s0229: [
    'Sun Hao sent Acting Minister of Works Dong Chao and Acting Minister of Rites Zhou Chu to Yangxian to perform Feng and Shan at Mount Guoshan.',
    'Sun Hao sent Acting Minister of Works Dong Chao and Acting Minister of Rites Zhou Chu to Yangxian to enfeoff Mount Guoshan and perform Feng and Shan.',
  ],
  s0230: [
    'What merit had these court gentlemen of Wu?',
    'What merit had these gentlemen of Wu?',
  ],
  s0231: [
    'To ignore the ancient way and wish for Feng and Shan—in every case the ruler above craves a name and the ministers below flatter his intent.',
    'To spurn the ancient way and seek Feng and Shan is always the ruler’s hunger for fame above and the ministers’ flattery below.',
  ],
  s0232: [
    'Feng and Shan do not appear in the orthodox classics; only the Zuo Commentary says that “Yu assembled the feudal lords at Mount Tu, and those bearing jade and silk numbered ten thousand states”—and even that is not called Feng and Shan.',
    'Feng and Shan are not in the orthodox classics; only the Zuo Commentary has Yu assembling the lords at Mount Tu with ten thousand states bearing jade and silk—and even that is not called Feng and Shan.',
  ],
  s0233: [
    'Zheng Xuan had the manner of Shen and Zhai in sacrifice, yet could not trace the orthodox classics and trusted only the weft apocrypha and prognostic texts—here he erred.',
    'Zheng Xuan had Shen and Zhai’s sacrificial manner yet could not search the classics and trusted only weft apocrypha and prognostic books—there he went wrong.',
  ],
  s0234: [
    'The Rites say, “Because of Heaven, serve Heaven; because of Earth, serve Earth; because of famous mountains, ascend the central peak to Heaven; because of auspicious earth, enjoy the Emperor in the suburbs.”',
    'The Rites say: “Because of Heaven, serve Heaven; because of Earth, serve Earth; because of famous mountains, ascend the central peak toward Heaven; because of auspicious earth, enjoy the Emperor in the suburbs.”',
  ],
  s0235: [
    'Burning firewood at Dai—that is what “because of mountains” means.',
    'Burning firewood at Dai is precisely “because of mountains.”',
  ],
  s0236: [
    'Thus the Summary of the Rites says, “The Son of Heaven sacrifices to Heaven and Earth”—that is the sense.',
    'So the Summary of the Rites: “The Son of Heaven sacrifices to Heaven and Earth”—that is it.',
  ],
  s0237: [
    'Again there is one prayer for grain and one thanksgiving for grain; in the rites the prayer and thanksgiving to Earth are not displayed, yet by extension of the text they exist.',
    'There is also one prayer for grain and one thanksgiving for grain; the rites do not spell out prayer and thanksgiving to Earth, yet the text implies them.',
  ],
  s0238: [
    'The Record of Music says: “Great music is in harmony with Heaven; great rites are in rhythm with Earth;',
    'The Record of Music says, “Great music harmonizes with Heaven; great rites keep rhythm with Earth;',
  ],
  s0239: [
    'in harmony, the hundred things are not lost; in rhythm, Heaven is sacrificed to and Earth is sacrificed to.',
    'in harmony the hundred things are not lost; in rhythm Heaven is sacrificed to and Earth is sacrificed to.”',
  ],
  s0240: [
    '” That the hundred things are not lost means Heaven gives birth and Earth nourishes.',
    '” “The hundred things are not lost” means Heaven gives birth and Earth nourishes.',
  ],
  s0241: [
    'Thus one knows that Earth also has prayer and thanksgiving; in all there are three suburban sacrifices to Heaven and three sacrifices to Earth in a year.',
    'So Earth too has prayer and thanksgiving: three suburban sacrifices to Heaven and three to Earth in a year.',
  ],
  s0242: [
    'The Offices of Zhou have the round mound and the square marsh—taken together these are three affairs, suburban sacrifice to Heaven and Earth.',
    'The Offices of Zhou have the round mound and the square marsh—three rites in all, suburban sacrifices to Heaven and Earth.',
  ],
  s0243: [
    'Thus the Minister of the Lesser Ancestral Temple says, “Take omens for the Five Emperors in the four suburbs”—this is the suburban reception of the seasonal qi from the Monthly Ordinances.',
    'The Minister of the Lesser Ancestral Temple says, “Take omens for the Five Emperors in the four suburbs”—the seasonal suburban receptions of the Monthly Ordinances.',
  ],
  s0244: [
    'The Canon of Shun has, “In the second month of the year, make an eastern tour of inspection, arriving at Dai”—summer south, autumn west, winter north, one circuit in five years; if this were Feng and Shan, how regular the number!',
    'The Canon of Shun: “In the second month, tour east to Dai”—then south in summer, west in autumn, north in winter, one circuit in five years; if that were Feng and Shan, how neat the count!',
  ],
  s0245: [
    'These make nine suburban sacrifices, and all are orthodox in meaning.',
    'That makes nine suburban sacrifices, each orthodox in sense.',
  ],
  s0246: [
    'As for the great procession to the southern suburb, it is not a regular sacrifice.',
    'The great procession to the southern suburb is not a regular sacrifice.',
  ],
  s0247: [
    'The Minister of the Greater Ancestral Temple: “When the state has a great affair, then process to the Supreme God”; the Monthly Ordinances say, “In mid-spring the dark bird comes—sacrifice at the High Mound”—also not a regular sacrifice.',
    'The Greater Ancestral Temple Minister: “When the state has a great affair, process to the Supreme God”; the Monthly Ordinances: “Mid-spring, the dark bird comes—sacrifice at the High Mound”—also irregular.',
  ],
  s0248: [
    'Thus the Odes say, “Able in sacrifice, able in worship, that he may not be without sons.”',
    'The Odes say, “Able in sacrifice, able in worship, that he may not be without sons.”',
  ],
  s0249: [
    'There are also the Yu prayer and the rain prayer—again not regular sacrifices.',
    'The Yu prayer and the rain prayer are also irregular sacrifices.',
  ],
  s0250: [
    'The Rites say, “Yu—prayer in time of drought.”',
    'The Rites say, “Yu—prayer in drought.”',
  ],
  s0251: [
    'Thus, combining suburban sacrifices to Heaven and Earth there are three; special suburban sacrifices to Heaven alone are nine; irregular sacrifices are again three.',
    'Combined suburban sacrifices to Heaven and Earth number three; special suburban sacrifices to Heaven alone, nine; irregular sacrifices, three more.',
  ],
  s0252: [
    'The Classic of Filial Piety says: “In the Bright Hall, perform the ancestral sacrifice to King Wen to match the Supreme God.',
    'The Classic of Filial Piety says, “In the Bright Hall, perform the ancestral sacrifice to King Wen to match the Supreme God.”',
  ],
  s0253: [
    '” The Yu sacrifice and the Bright Hall sacrifice, though sacrifices to Heaven, are not in the suburbs; thus sacrifices to Heaven number sixteen, sacrifices to Earth three, while only the great Di sacrifice is not in this count.',
    '” The Yu and Bright Hall rites sacrifice to Heaven but not in the suburbs; Heaven sacrifices total sixteen, Earth sacrifices three, and only the great Di sacrifice lies outside this tally.',
  ],
  s0254: [
    'The Great Tradition says: “The king performs Di to the ancestor from whom his line sprang, matching him with that ancestor.”',
    'The Great Tradition says, “The king performs Di to the ancestor from whom his line sprang, matching him with that ancestor.”',
  ],
  s0255: [
    '” It differs from regular sacrifice; therefore it is said to be greater than the seasonal sacrifices.',
    '” It differs from regular sacrifice and is therefore called greater than the seasonal rites.',
  ],
  s0256: [
    'Your servant finds that the Appended Remarks say: “The Changes as a book is broad and great, complete in all respects.',
    'The Appended Remarks say, “The Changes as a book is broad and great, complete in every respect.',
  ],
  s0257: [
    'There is the Way of Heaven, the Way of Earth, and the Way of Man; joining the three powers and doubling them makes six.',
    'There is the Way of Heaven, the Way of Earth, and the Way of Man; joining the three powers and doubling them yields six.',
  ],
  s0258: [
    'The six are nothing else but the ways of the three powers.”',
    'The six are nothing but the ways of the three powers.”',
  ],
  s0259: [
    'The Commentary on the Qian Hexagram says: “Great indeed is the originating power of Qian! The myriad things owe their beginning to it, and it unifies Heaven.',
    'The Qian Commentary says, “Great indeed is the originating power of Qian! All things owe their beginning to it, and it unifies Heaven.',
  ],
  s0260: [
    'Clouds move and rain is bestowed; the kinds of things take form; the great brightness runs from beginning to end; the six positions are completed in season.”',
    'Clouds move, rain falls; things take shape; the great brightness runs start to finish; the six positions complete themselves in season.”',
  ],
  s0261: [
    'This corresponds to sacrifice once in six years; the Kun origin is the same.',
    'That answers to sacrifice once in six years; the Kun origin is the same.',
  ],
  s0262: [
    'The way of sincerity and reverence is fully provided in this.',
    'Sincerity and reverence are fully provided here.',
  ],
  s0263: [
    'As for Feng and Shan, your servant does not dare to hear of them.',
    'Of Feng and Shan, your servant dares not speak.',
  ],
  s0264: [
    'The High Ancestor praised and accepted it; he then developed Mao’s argument, spoke in the imperial voice to reply, and the petitioners thereby ceased.',
    'The High Ancestor praised and accepted it, developed Mao’s argument, answered in the imperial voice, and the petitioners stopped.',
  ],
  s0265: [
    'In the tenth year he was transferred to Director of the Household of the Heir Apparent.',
    'In year ten he became Director of the Household of the Heir Apparent.',
  ],
  s0266: [
    'The old rites of Song and Qi for suburban sacrifice to Heaven and enfeoffment of the Emperor all used the dragon robe; only in the seventh year of Tianjian did Mao first request the making of the great fur garment.',
    'Song and Qi used the dragon robe for suburban sacrifice to Heaven and for enfeoffing the Emperor; only in Tianjian year seven did Mao first ask that the great fur garment be made.',
  ],
  s0267: [
    'At this time, when the Bright Hall rite was held, the protocol still read “wear the dragon robe.”',
    'When the Bright Hall rite came due, the protocol still said, “Wear the dragon robe.”',
  ],
  s0268: [
    'Mao rebutted: “The Rites say, ‘Great fur garment and cap—sacrifice to the August Heaven above is also like this.’',
    'Mao objected: “The Rites say, ‘Great fur garment and cap—sacrifice to the August Heaven above is also like this.’',
  ],
  s0269: [
    'Truly because the spirits of Heaven are remote, one must honor sincerity and plainness.',
    'Heaven’s spirits are remote; one must honor sincerity and plainness.',
  ],
  s0270: [
    'Now a general sacrifice to the Five Emperors cannot allow ornament.”',
    'A general sacrifice to the Five Emperors cannot permit ornament.”',
  ],
  s0271: [
    '” The change to the great fur garment began from this.',
    '” The great fur garment began here.',
  ],
  s0272: [
    'An edict also questioned: “In seeking yin and yang, each should follow its kind; now the Yu sacrifice burns firewood—using fire to pray for water—your servant finds this doubtful.”',
    'An edict also asked: “Seeking yin and yang should follow each kind; the Yu sacrifice burns firewood—fire to pray for water—your servant doubts this.”',
  ],
  s0273: [
    '” Mao replied: “Burning firewood at the Yu sacrifice has no text in the classics; truly the former scholars never thought it through.',
    '” Mao answered: “Burning firewood at the Yu sacrifice has no classical text; the former scholars simply never thought it through.',
  ],
  s0274: [
    'Your servant finds that in King Xuan’s ode “Vast Heaven” it says: “Above and below, set out the offerings and bury the victims;',
    'The ode “Vast Heaven” in King Xuan’s reign says, “Above and below, set out offerings and bury victims;',
  ],
  s0275: [
    '” Mao’s commentary says: “Above, sacrifice to Heaven; below, sacrifice to Earth—set out the silks, bury the things.”',
    '” Mao’s commentary: “Above, sacrifice to Heaven; below, sacrifice to Earth—set out silks, bury victims.”',
  ],
  s0276: [
    'From this it follows that in drought one sacrifices to Heaven and Earth; both have texts of burial in the ground, and nowhere is burning firewood mentioned.',
    'So in drought one sacrifices to Heaven and Earth, with burial rites for both and no mention of burning firewood.',
  ],
  s0277: [
    'If sacrificing to the Five Emperors must burn firewood, then in the regular rites of the bright hall there is again no such affair.',
    'If the Five Emperors’ sacrifice must burn firewood, the regular Bright Hall rites have no such thing either.',
  ],
  s0278: [
    'Moreover the Rites also say, “Bury a young ox to sacrifice to the season”—the season’s achievement is the Five Emperors; this again is proof that firewood is not used.',
    'The Rites also say, “Bury a young ox to sacrifice to the season”—the season’s work is the Five Emperors’; again, no firewood.',
  ],
  s0279: [
    'Formerly the Yu altar stood in the due-south position of the yang, at odds with seeking the spirits;',
    'Formerly the Yu altar stood due south in the yang position, ill-suited to seeking spirits;',
  ],
  s0280: [
    'though it was already moved eastward, the rite of burning firewood was still not reformed.',
    'though moved eastward, the firewood rite was still unreformed.',
  ],
  s0281: [
    'Your servant requests that burning firewood be discontinued; oxen and the like should all follow the pit burial, to accord with King Xuan’s “Vast Heaven.”',
    'Your servant asks that firewood be discontinued and oxen and the rest buried in the pit, to match King Xuan’s “Vast Heaven.”',
  ],
  s0282: [
    '” Edicts accepted all of it.',
    '” Edicts accepted everything.',
  ],
  s0283: [
    'In ritual matters of every kind he corrected many errors.',
    'In ritual matters of every kind he corrected much.',
  ],
  s0284: [
    'Because of foot ailment he went out as Grand Administrator of Shiping; his administration won a name for competence.',
    'Foot ailment sent him out as Grand Administrator of Shiping, where his rule won a name for competence.',
  ],
  s0285: [
    'He was given the additional title of Regular Cavalier Attendant and transferred to Grand Administrator of Tianmen.',
    'He was given Regular Cavalier Attendant and became Grand Administrator of Tianmen.',
  ],
  s0286: [
    'In the third year of Zhongdatong the crown prince summoned the Confucians to compile the Record of the Meaning of the Everlasting Spring.',
    'In Zhongdatong year three the crown prince summoned Confucians to compile the Record of the Meaning of the Everlasting Spring.',
  ],
  s0287: [
    'In the fourth year he was appointed Attendant of the Heir Apparent.',
    'In year four he was appointed Attendant of the Heir Apparent.',
  ],
  s0288: [
    'In that year he died, aged sixty-nine.',
    'That year he died, aged sixty-nine.',
  ],
  s0289: [
    'He compiled A Record of Conduct in four scrolls and left a collected works in fifteen scrolls.',
    'He wrote A Record of Conduct in four scrolls and left collected works in fifteen scrolls.',
  ],
  s0290: [
    'Yao Cha, Minister of Personnel of Chen, said: Sima Jiong was broadly versed in Confucian learning; Dao Gai was quick and fine in literary meaning; Xian, Mao, and Zhilin were strong students, thorough and penetrating—all held posts heavy with the classics, answering at the ruler’s side; this was the charge of Yan and Zhu.',
    'Yao Cha, Chen’s Minister of Personnel, said: Sima Jiong mastered Confucian learning; Dao Gai was quick and fine in letters; Xian, Mao, and Zhilin studied hard and knew their fields through— all served amid the classics at the ruler’s elbow, the office of Yan and Zhu.',
  ],
  s0291: [
    'Yet Gai and Zhilin rose to conspicuous wealth and repeatedly gathered the blue and purple.',
    'Yet Gai and Zhilin rose to great wealth and repeatedly took the blue and purple.',
  ],
  s0292: [
    'Had they not met the times, how could they have reached such posts?',
    'Without the times on their side, how could they have reached such posts?',
  ],
  s0293: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0294: [
    'The full text has been collated against the Zhonghua Shuju edition of 《Book of Liang》, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of 《Book of Liang》, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_040_b3.mjs <translation.json>'
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
