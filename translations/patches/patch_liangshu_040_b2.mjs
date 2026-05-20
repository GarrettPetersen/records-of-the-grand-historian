#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He had his fill of the canonical tomes and plumbed the subtle principles of reason.',
    'He drank deep from the classics and refined his grasp of principle.',
  ],
  s0102: [
    'Once seen, never forgotten; one pass of the eye and it was fixed in memory.',
    'What he saw once he did not forget; a single glance was enough to lodge it in mind.',
  ],
  s0103: [
    'If you sought Jia Kui, it was as though you had asked Bo Shi himself.',
    'To consult him was like seeking out Jia Kui or putting a question to Bo Shi.',
  ],
  s0104: [
    'He stood out like a head from the husk; learning excellent, then he entered office.',
    'He broke from the sheath of the crowd; his learning was first-rate, and then he served.',
  ],
  s0105: [
    'He aided in deliberating cases, then took up the orchid of the academy.',
    'He assisted at the Court of Judicial Review, then held the scholar’s orchid at the National University.',
  ],
  s0106: [
    'He stirred the waters of the Phoenix Pool and led the flock at the Grand Academy.',
    'He roiled the Phoenix Pool’s waters and guided the herd at the Imperial University.',
  ],
  s0107: [
    'Within he took part in the forbidden precincts; without he assisted the border princes.',
    'Inside the palace he advised; beyond it he served the great fiefs.',
  ],
  s0108: [
    'The slanting light has run its course; that western floater has fallen;',
    'The oblique rays have spent their road; yonder sun on the western float has set;',
  ],
  s0109: [
    'All rivers reach the sea, yet still chase the eastern flow.',
    'A hundred streams find the sea, then turn again toward the eastern current.',
  ],
  s0110: [
    'Restlessly the soul returns; adrift like an empty boat.',
    'The returning soul flutters without rest; he drifts like an empty boat on the flood.',
  ],
  s0111: [
    'The white horse turns toward the suburbs; the red banners leave Gong behind.',
    'The white horse faces the outskirts; the crimson pennants turn their backs on Gong.',
  ],
  s0112: [
    'Wild dust rises and settles; mountain clouds grow light and heavy.',
    'Dust on the plain lifts and subsides; clouds on the hills thicken and thin.',
  ],
  s0113: [
    'Lü covers the grave of books; Yang returns to the dark mound.',
    'Like Lü, he buries learning in the tomb; like Yang, he goes home to the hidden barrow.',
  ],
  s0114: [
    'Take heed in your going; the road ends at the earthen ridge.',
    'Guard your steps on the way; the path runs out at the heaped earth.',
  ],
  s0115: [
    'Tender creepers have only begun to spread; thick trunks day by day arch overhead.',
    'Weak vines are just now put forth; clustered boughs daily bow and close.',
  ],
  s0116: [
    'The year follows willow catkins in spring; in the cold, birds draw in their down.',
    'Spring comes with willow down; in the chill, birds tuck their feathers close.',
  ],
  s0117: [
    'The long sky stays dark; only the yin-spring wells up alone.',
    'The wide heavens remain dim; in the underworld spring alone still surges.',
  ],
  s0118: [
    'Place him beside that old grave; fragrance flows on in succession.”',
    'Lay him by that ancient mound; let fragrance pass from hand to hand.”',
  ],
  s0119: [
    'Xian had three sons: You, Ren, and Zhen.',
    'Xian had three sons—You, Ren, and Zhen.',
  ],
  s0120: [
    'Zhen early won renown.',
    'Zhen was famed from early on.',
  ],
  s0121: [
    'Liu Zhi’li, courtesy name Sizhen, was a native of Nieyang in Nanyang.',
    'Liu Zhi’li, styled Sizhen, came from Nieyang in Nanyang.',
  ],
  s0122: [
    'His father Qiu was Erudite of the National University in Qi and was posthumously titled Master Wenfan.',
    'His father Qiu had been Qi’s Erudite of the National University and was honored after death as Master Wenfan.',
  ],
  s0123: [
    'At eight Zhi’li could compose prose; at fifteen he was presented as a cultivated talent for policy response—Shen Yue and Ren Fang, meeting him, were struck by him.',
    'At eight he could write essays; at fifteen he was recommended as a cultivated talent for court examination—Shen Yue and Ren Fang marveled when they met him.',
  ],
  s0124: [
    'He first entered office as Supporter of the Army for Pacifying the North.',
    'He began service as Supporter of the Army for Pacifying the North.',
  ],
  s0125: [
    'Minister of Personnel Wang Zhan once called on Ren Fang and found Zhi’li present; Fang said to Zhan, “This is Liu Zhi’li of Nanyang—his learning is outstanding though he has not yet taken office; the clear mirror of the court ought to lift him up.',
    'Wang Zhan, Minister of Personnel, once visited Ren Fang and found Zhi’li there; Fang told him, “This is Liu Zhi’li of Nanyang—learned and still without a post; the court’s mirror should single him out.',
  ],
  s0126: [
    '” Zhan at once recruited him as Erudite of the National University.',
    '” Zhan immediately summoned him as Erudite of the National University.',
  ],
  s0127: [
    'At that time Zhang Ji had just been appointed Vice Director of the Department of State Affairs and asked Fang to draft his letter of refusal; Fang had Zhi’li write it in his place, and with brush in hand he finished on the spot.',
    'Zhang Ji had just become Vice Director of the Department of State Affairs and asked Fang to draft a memorial declining the post; Fang had Zhi’li write it, and he finished at once.',
  ],
  s0128: [
    'Fang said, “The south of Jing holds fine spirit—truly there is uncommon talent here; in later office he will surely surpass me.',
    'Fang said, “The Jing south breeds bright minds—here is real talent; in time he will outrank me.',
  ],
  s0129: [
    '” Censor-in-Chief Yue Ai was Zhi’li’s maternal uncle; the indictments of the Inspectorate were all drafted by Zhi’li.',
    '” Yue Ai, Censor-in-Chief, was his uncle on his mother’s side; every memorial of impeachment from the Inspectorate was Zhi’li’s hand.',
  ],
  s0130: [
    'He was transferred to Aide on the Pacifying-the-South campaign staff, Gentleman in the Ministry of Rites for Establishing Offices, Magistrate of Yanling, and Administrator of Jingzhou.',
    'He rose through aide on the Pacifying-the-South staff, Gentleman for Establishing Offices, magistrate of Yanling, and administrator of Jingzhou.',
  ],
  s0131: [
    'When the heir apparent governed Jingzhou, Zhi’li was moved to Recorder of the Prince’s Household for Propagating Favor.',
    'When the future emperor held Jingzhou, he became Recorder of the Prince’s Household for Propagating Favor.',
  ],
  s0132: [
    'Zhi’li was deeply learned and keen in judgment, and ranged widely through the canon.',
    'Zhi’li studied with fierce devotion and clear discernment, and read broadly in every book.',
  ],
  s0133: [
    'At the time Liu Xian and Wei Ling both had powerful memories; whenever Zhi’li debated with them, none could get the better of him.',
    'Liu Xian and Wei Ling were both famed for recall; in every disputation with Zhi’li, neither could prevail.',
  ],
  s0134: [
    'On return he was made Regular Attendant with Unimpeded Access and concurrently Palace Secretariat Attendant for General Affairs.',
    'Recalled, he became Regular Attendant with unimpeded access and also a palace secretariat attendant for general affairs.',
  ],
  s0135: [
    'He was promoted to Regular Attendant, Right Vice Director of the Department of State Affairs, and Chief Evaluator of Jingzhou.',
    'He was made Regular Attendant, Right Vice Director of the Department of State Affairs, and chief evaluator of Jingzhou.',
  ],
  s0136: [
    'In succession he was promoted to Secretariat Gentleman, Minister of Ceremonies, and again concurrently Palace Secretariat Attendant.',
    'He rose in turn to Secretariat gentleman, Minister of Ceremonies, and again palace secretariat attendant.',
  ],
  s0137: [
    'He went out as Chief Clerk to the Prince of Pacifying-the-West in Poyang and Governor of Nan Commandery; the Founding Emperor said to him, “Your mother is advanced in years and in virtue alike—therefore I send you home in splendor to fulfill every duty of honor and nurture.',
    'He left the capital as chief clerk to the Pacifying-the-West Prince of Poyang and governor of Nan Commandery; the Founding Emperor told him, “Your mother is high in years and in virtue—so I send you home in glory to perform every rite of filial nurture.',
  ],
  s0138: [
    '” Later he was transferred as Chief Clerk to the Prince of Western Central in Xiangdong, keeping his governorship as before.',
    '” Later he became chief clerk to the Western Central Prince of Xiangdong, retaining the governorship.',
  ],
  s0139: [
    'Earlier, while Zhi’li was on the staff in Jingzhou, he had lodged in the Nan Commandery yamen; suddenly he dreamed that the former governor Yuan Can said to him, “You will later be the one-armed governor and will dwell in this very place.',
    'Once, on Jingzhou staff, he lodged in the Nan Commandery offices and dreamed the former governor Yuan Can said, “You will one day be the broken-armed governor and live here.',
  ],
  s0140: [
    '” Zhi’li later did injure his arm and indeed came to govern that commandery.',
    '” He later lost the use of an arm and in fact took that post.',
  ],
  s0141: [
    'When his mother died he observed mourning; when mourning ended he was summoned as Director of the Palace Library, with concurrent rank as Commandant of Footsoldiers.',
    'At his mother’s death he mourned; when the mourning was done he was called back as Director of the Palace Library and Commandant of Footsoldiers.',
  ],
  s0142: [
    'He went out as Acting Governor of Yingzhou; Zhi’li was unwilling to leave the capital and firmly declined—whereupon the Founding Emperor wrote in his own hand: “We have heard that when wife and children are provided for, filial devotion toward parents declines;',
    'He was sent out as acting governor of Yingzhou; Zhi’li did not wish to go and refused firmly—the Founding Emperor wrote by his own hand, “We hear that when wife and children are complete, love for parents wanes;',
  ],
  s0143: [
    'when rank and salary are complete, loyalty toward one’s lord declines.',
    'when rank and stipend are complete, loyalty to one’s lord wanes.',
  ],
  s0144: [
    'You are already full within—by rights you have forgotten the duty of serving the public.',
    'You are already full within—and so, it seems, you have set aside the duty of public service.',
  ],
  s0145: [
    '” Thereupon the authorities memorialized and he was dismissed.',
    '” The authorities memorialized against him and he was removed.',
  ],
  s0146: [
    'After a long while he served as Minister of the Palace Treasuries, Minister Director of Justice, and Minister of Ceremonies.',
    'Long afterward he became Minister of the Palace Treasuries, Minister Director of Justice, and Minister of Ceremonies.',
  ],
  s0147: [
    'Zhi’li loved antiquity and delighted in the strange; in Jingzhou he gathered several tens or hundreds of ancient vessels.',
    'Zhi’li loved the old and cherished the rare; in Jingzhou he collected scores of antique vessels.',
  ],
  s0148: [
    'There was one vessel like a bowl, able to hold a hu, with inlaid gold characters—no one of the day could read them.',
    'One piece resembled a bowl, held a hu in volume, and bore gold-inlaid script no contemporary could decipher.',
  ],
  s0149: [
    'He also presented four ancient vessels to the Eastern Palace.',
    'He also offered four antiquities to the crown prince’s palace.',
  ],
  s0150: [
    'The first kind: two bronze owl-shaped goblets with openwork, silver inlay on both ears, and an inscription reading “Made in the second year of Jianping.”',
    'The first: two openwork bronze owl goblets with silver-inlaid ears, inscribed “Made in the second year of Jianping.”',
  ],
  s0151: [
    'The second kind: two ancient urns with gold and silver inlay, bearing seal-script inscriptions reading “Made in the year Lord Rongcheng of Qin went south to Chu.”',
    'The second: two antique urns with gold and silver inlay and seal script reading “Made in the year the Lord of Rongcheng of Qin went south to Chu.”',
  ],
  s0152: [
    'The third kind: one foreign bathing ewer, inscribed “In the second year of Yuanfeng, presented by the state of Kucha.”',
    'The third: one foreign bathing ewer, inscribed “Second year of Yuanfeng, presented by Kucha.”',
  ],
  s0153: [
    'The fourth kind: one bathing basin in ancient style, inscribed “Made in the second year of Chuping.”',
    'The fourth: one antique bathing basin, inscribed “Made in the second year of Chuping.”',
  ],
  s0154: [
    'At that time the Prince of Poyang, heir to the title, obtained the authentic manuscript of the Book of Han that Ban Gu submitted; he presented it to the Eastern Palace, and the crown prince ordered Zhi’li, together with Zhang Zuan, Dao Gai, and Lu Xiang, to collate the differences.',
    'The heir to Poyang had obtained Ban Gu’s authentic submission of the Book of Han and sent it to the crown prince, who ordered Zhi’li, Zhang Zuan, Dao Gai, and Lu Xiang to compare variants.',
  ],
  s0155: [
    'Zhi’li set out ten points of difference in full; in outline he said: “According to the ancient Book of Han, it reads, ‘On the twenty-first day of the fifth month of the sixteenth year of Yongping, the twenty-first day jiwei, Gentleman Ban Gu submitted’;',
    'Zhi’li listed ten discrepancies in full; in summary: “The ancient Book of Han reads, ‘On jiwei, the twenty-first day of the fifth month of Yongping year sixteen, Gentleman Ban Gu submitted’;',
  ],
  s0156: [
    'whereas the present text lacks the characters for year, month, and day of submission.',
    'but the present text has no characters for the year, month, and day of submission.',
  ],
  s0157: [
    'Again, the ancient Treatise on the Author is titled the Middle Treatise;',
    'Again, the ancient Author’s Treatise is called the Middle Treatise;',
  ],
  s0158: [
    'the present text calls it the Treatise on the Author.',
    'the present text calls it simply the Treatise on the Author.',
  ],
  s0159: [
    'Again, the present Treatise on the Author records the conduct of Ban Biao;',
    'Again, the present Treatise on the Author gives Ban Biao’s career;',
  ],
  s0160: [
    'whereas the ancient text says, ‘Biao was born to Ban Zhi; he has his own biography.’',
    'but the ancient text says, ‘Zhi begot Biao, who has his own biography.’',
  ],
  s0161: [
    'Again, in the present text the Annals, Tables, Monographs, and Biographies are not arranged in one sequence, whereas in the ancient text they are arranged together, thirty-eight scrolls in all.',
    'Again, the present text does not place Annals, Tables, Treatises, and Biographies in one sequence; the ancient text does, thirty-eight scrolls in all.',
  ],
  s0162: [
    'Again, in the present text the Biography of the Empresses and Consorts comes after the Western Regions;',
    'Again, the present text places the Biography of the Empresses after the Western Regions;',
  ],
  s0163: [
    'in the ancient text the Biography of the Empresses follows directly after the Annals.',
    'in the ancient text it follows directly after the Annals.',
  ],
  s0164: [
    'Again, in the present text the Five Sons of Gaozu, the Three Kings of Wen, the Thirteen Kings of Jing, the Five Sons of Wu, and the Six Kings of Xuan and Yuan are scattered among the other biographies in order;',
    'Again, the present text scatters the Five Sons of Gaozu, the Three Kings of Wen, the Thirteen Kings of Jing, the Five Sons of Wu, and the Six Kings of Xuan and Yuan among the other ranks of biography;',
  ],
  s0165: [
    'in the ancient text all the kings come directly after the Empresses, before the Biographies of Chen Sheng and Xiang Yu.',
    'in the ancient text all the kings follow the Empresses, before Chen Sheng and Xiang Yu.',
  ],
  s0166: [
    'Again, the present Summaries for Han Xin, Peng Yue, Ying Bu, Lu Wan, and Wu Rui read, “Xin was once a starving menial, Bu a branded convict, Yue a dog-thief, Rui a man of rivers and lakes—clouds rose and dragons soared, and they became marquises and kings”;',
    'Again, the present summary for Han Xin, Peng Yue, Ying Bu, Lu Wan, and Wu Rui reads, “Xin was a starving menial, Bu a branded convict, Yue a dog-thief, Rui of the rivers and lakes—clouds rose, dragons soared, and they became kings and marquises”;',
  ],
  s0167: [
    'the ancient Summaries read, “The Marquis of Huaiyin stood bold with sword in hand; Peng and Ying were the state’s heroes; cloud and dragon lifted them, and they became kings and marquises.”',
    'the ancient summary reads, “The Marquis of Huaiyin was bold with sword in hand; Peng and Ying were the realm’s champions; cloud and dragon raised them to kings and marquises.”',
  ],
  s0168: [
    'Again, the ancient text’s thirty-seventh scroll gives pronunciation and glosses to aid the lexicon, whereas the present text lacks this scroll.”',
    'Again, the ancient thirty-seventh scroll gives readings and glosses to aid the lexicon; the present text has no such scroll.”',
  ],
  s0169: [
    'Zhi’li loved to compose prose and often wrote in ancient style; with Pei Ziye of Hedong and Liu Xian of Pei he constantly discussed books and thereby became close friends.',
    'Zhi’li loved composition and favored archaic forms; with Pei Ziye of Hedong and Liu Xian of Pei he debated texts until they became intimate friends.',
  ],
  s0170: [
    'At that time the Changes, Documents, Record of Rites, and Mao Odes all had exegeses composed by the Founding Emperor; only the Zuo Commentary to the Spring and Autumn remained without one.',
    'The Changes, Documents, Record of Rites, and Mao Odes all had imperial commentaries; only the Zuo Commentary still lacked one.',
  ],
  s0171: [
    'Zhi’li thereupon composed ten categories of The Great Meaning of the Spring and Autumn, ten categories of the Zuo Tradition, and ten categories of Agreements and Differences among the Three Commentaries—thirty topics in all—and submitted them.',
    'He then wrote ten topics on the Great Meaning of the Spring and Autumn, ten on the Zuo Tradition, and ten on agreements and differences among the three commentaries—thirty in all—and presented them.',
  ],
  s0172: [
    'The Founding Emperor was greatly pleased and answered in an edict: “We have reviewed your Spring and Autumn exegesis: events compared and books weighed, the wording subtle and the aim far-reaching.',
    'The Founding Emperor was delighted and replied by edict: “We have read your Spring and Autumn exegesis—events set side by side, books weighed, language fine and purpose far-reaching.',
  ],
  s0173: [
    'The annalistic teaching speaks broadly and the meaning is intricate; Qiu Ming transmitted the wind of Zhu and Si, Gongsun bore the learning of the western river—the explanations of Duo and Jiao do not reach it, the discourse of Xiqiu has nothing to take.',
    'Annalistic teaching is wide in utterance and rich in meaning; Qiu Ming carried the breath of Zhu and Si, Gongsun drew the learning of the western river—Duo and Jiao cannot catch up, Xiqiu’s sayings have nothing worth taking.',
  ],
  s0174: [
    'Following in the steps of Humu, Dong Zhongshu flourished; along the line of the Guliang, Gongsun Qian was most steadfast.',
    'After Humu, Dong Zhongshu rose; along the Guliang line, Gongsun Qian was most firm.',
  ],
  s0175: [
    'Zhang Cang transmitted the Zuo Tradition; Jia Yi inherited Xun Qing—the sources parted like wheel-ruts, the bearings diverged, detail and summary tangled together, and so it has been since old.',
    'Zhang Cang handed on the Zuo Tradition; Jia Yi took up Xun Qing—the springs forked, the bearings differed, detail and summary in disarray, as it has long been.',
  ],
  s0176: [
    'In my weak years I once studied and savored it, but once cast aside it has now drawn near five twelve-year cycles.',
    'In my youth I once studied and tasted it, but once set aside it has now neared five twelve-year cycles.',
  ],
  s0177: [
    'Moreover the late-winter sun is brief and business rarely leaves leisure; at midnight I seek my robe and have no time to search and gather.',
    'Moreover late winter shortens the day and affairs leave little leisure; at midnight I reach for my robe and have no time to hunt and collate.',
  ],
  s0178: [
    'I must wait for summer light, try a fresh review and inquiry—if the old can be recovered by warming, I shall repay your question in another way.”',
    'Wait till summer light, then I shall try review and inquiry—if the old learning can be found by warming, I shall answer your question another way.”',
  ],
  s0179: [
    'In the second year of Taqing, when Hou Jing rebelled, Zhi’li fled homeward to escape the turmoil; before he arrived he died at Xiakou, aged seventy-two.',
    'In Taqing year two, as Hou Jing’s rebellion spread, Zhi’li fled home but died at Xiakou before he arrived, at seventy-two.',
  ],
  s0180: [
    'His collected writings before and after, fifty scrolls, circulated in the world.',
    'His collected works, fifty scrolls in all, circulated abroad.',
  ],
  s0181: [
    'Zhiheng, courtesy name Jiahui, was Zhi’li’s younger brother.',
    'Zhiheng, styled Jiahui, was Zhi’li’s younger brother.',
  ],
  s0182: [
    'In youth he had a fine reputation.',
    'He was famed from youth.',
  ],
  s0183: [
    'He was presented as a cultivated talent, appointed Erudite of the National University, and in time was promoted to concurrent Palace Secretariat Attendant for General Affairs, Commandant of Footsoldiers, and Minister of the Imperial Granaries.',
    'Presented as a cultivated talent, he became Erudite of the National University, then palace secretariat attendant, Commandant of Footsoldiers, and Minister of the Imperial Granaries.',
  ],
  s0184: [
    'He also replaced his elder brother Zhi’li as Chief Clerk to the Prince of Pacifying-the-West in Xiangdong and Governor of Nan Commandery.',
    'He also succeeded his brother as chief clerk to the Pacifying-the-West Prince of Xiangdong and governor of Nan Commandery.',
  ],
  s0185: [
    'In the commandery his achievements were outstanding.',
    'In office his record was exceptional.',
  ],
  s0186: [
    'After several years he died in post, aged fifty.',
    'Within a few years he died in office, at fifty.',
  ],
  s0187: [
    'The people of Jing still cherish them and cannot bear to speak their given names, calling them instead “the Greater Nan Commandery” and “the Lesser Nan Commandery.”',
    'The people of Jing still honor them and will not speak their personal names, calling them only “the Greater Nan Commandery” and “the Lesser Nan Commandery.”',
  ],
  s0188: [
    'Xu Mao, courtesy name Zhaozhe, was a native of Xincheng in Gaoyang, ninth-generation descendant of Xu Yun, General Who Pacifies the North of Wei.',
    'Xu Mao, styled Zhaozhe, came from Xincheng in Gaoyang, ninth in descent from Xu Yun, Wei’s General Who Pacifies the North.',
  ],
  s0189: [
    'His grandfather Gui was Attendant in the Secretariat of Song, Gentleman of the Palace Library, and Governor of Guiyang.',
    'His grandfather Gui had been Song’s secretariat attendant, palace library gentleman, and governor of Guiyang.',
  ],
  s0190: [
    'His father Yonghui was Household Steward to the Heir Apparent of Qi and Supernumerary Attendant of the Suite.',
    'His father Yonghui was Qi’s household steward to the heir apparent and supernumerary attendant of the suite.',
  ],
  s0191: [
    'Mao lost his father early and was filial to the utmost; while observing mourning for his father he exceeded the rites in his grief.',
    'Mao was orphaned young and filial to the bone; in mourning for his father he went beyond the prescribed rites.',
  ],
  s0192: [
    'He set his will on study and was praised by his district.',
    'He devoted himself to learning and was praised throughout his district.',
  ],
  s0193: [
    'At fourteen he entered the National University and studied the Mao Odes; mornings he received the master’s teaching, evenings he lectured in return, and those seated below him to listen often numbered in the tens or hundreds—thereby he composed Parallels of Style and Meaning in fifteen scrolls, which flourished in the world.',
    'At fourteen he entered the National University to study the Mao Odes; by day he heard the master, by night he lectured in turn, with scores of listeners below—and so he wrote Parallels of Style and Meaning in fifteen scrolls, widely read in his day.',
  ],
  s0194: [
    'He was especially versed in precedent and was called a master of ritual regulations.',
    'He knew precedent especially well and was styled a master of ritual protocol.',
  ],
  s0195: [
    'He first entered office as Aide on the campaign staff of the Prince of Yuzhang in the Rear Army, was transferred to the Law Bureau, was presented as a cultivated talent, and was promoted to Recorder in the Secretariat of the General of Agile Cavalry with Equal Protocol.',
    'He began as aide on the Rear Army staff of the Prince of Yuzhang, moved to the law bureau, was presented as a cultivated talent, and rose to recorder in the secretariat of the General of Agile Cavalry with Equal Protocol.',
  ],
  s0196: [
    'When the heir apparent Wen Hui heard of him he summoned him to lecture at Chongming Hall and appointed him Commandant of Footsoldiers to the Heir Apparent.',
    'Crown Prince Wen Hui summoned him to lecture at Chongming Hall and made him Commandant of Footsoldiers to the Heir Apparent.',
  ],
  s0197: [
    'In the Yongyuan era he was transferred to Regular Attendant and concurrently Erudite of the National University.',
    'Under Yongyuan he became Regular Attendant and also Erudite of the National University.',
  ],
  s0198: [
    'He was of one mind and close friendship with Sima Jiong; Vice Director Jiang Shi greatly esteemed him and called him “the casket of classics and histories.”',
    'He was intimate with Sima Jiong; Vice Director Jiang Shi prized him and called him “the casket of canon and history.”',
  ],
  s0199: [
    'At the opening of Tianjian, Minister of Personnel Fan Yun recommended Mao to assist in compiling the Five Rites; he was appointed Advisor to the Prince of Pacifying-the-West in Poyang, with concurrent service as Gentleman of the Palace Library, awaiting edicts at the Wende Secretariat.',
    'When Tianjian opened, Fan Yun, Minister of Personnel, recommended Mao to help shape the Five Rites; he became advisor to the Pacifying-the-West Prince of Poyang, also palace library gentleman, awaiting edicts at the Wende Secretariat.',
  ],
  s0200: [
    'At that time some petitioned to enfeoff Mount Kuaiji and perform the Feng and Shan rites on Mount Guoshan; the Founding Emperor by nature loved ritual, and so he gathered Confucian scholars to draft the rites of enfeoffment and Feng and Shan, intending to carry them out.',
    'Some then petitioned to enfeoff Mount Kuaiji and perform Feng and Shan on Mount Guoshan; the Founding Emperor, a lover of ritual, gathered Confucian scholars to draft the ceremonies and meant to perform them.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_040_b2.mjs <translation.json>'
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
