#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'After four years in the commandery he returned as Yellow Gate Gentleman, concurrently Infantry Colonel, soon made Palace Library Director.',
    'Four years in office, then back to court as yellow-gate gentleman and infantry colonel, soon keeper of the palace library.',
  ],
  s0102: [
    'In Yongyuan, Cui Huijing raised troops and besieged the capital; officials all sent calling cards—Yan claimed illness and did not go.',
    'In Yongyuan, Cui Huijing besieged the capital; every gentleman sent his card, but Yan pleaded sickness and stayed away.',
  ],
  s0103: [
    'When the affair was settled, the age admired his foresight.',
    'When the storm passed, the world praised his foresight.',
  ],
  s0104: [
    'Yan had been famed early for writing; in his late years his talent waned—the age said his talent was spent.',
    'He had risen on his pen, yet in old age his gift thinned; men said his talent was spent.',
  ],
  s0105: [
    'All his writings exceeded a hundred pieces; he compiled front and rear collections himself, together with the Ten Annals of Qi History, all circulating in the world.',
    'He left more than a hundred works, front and rear collections of his own, and the Ten Annals of Qi—all still in the world.',
  ],
  s0106: [
    'His son Qian inherited the fief; from Assistant to the Danyang Intendant he became magistrate of Changcheng; for a crime his noble rank was stripped.',
    'His son Qian took the title, rose from Danyang aide to magistrate of Changcheng, then lost the fief for a crime.',
  ],
  s0107: [
    'In the fourth year of Putong, Gaozu recalled Yan\'s merit and re-enfeoffed Qian as Marquis of Wuchang, fief as before.',
    'In Putong year 4 Gaozu remembered Yan\'s service and made Qian marquis of Wuchang again, with the old fief.',
  ],
  s0108: [
    'Ren Fang, styled Yansheng, was a native of Bochang in Le\'an, descendant of the Han Censor-in-Chief Ao.',
    'Ren Fang, styled Yansheng, came from Bochang in Le\'an—a line from Han\'s censor-in-chief Ao.',
  ],
  s0109: [
    'His father Yao was Qi Central Regular Grandee.',
    'His father Yao was Qi\'s central regular grandee.',
  ],
  s0110: [
    'Yao\'s wife Lady Pei once slept by day and dreamed of a colored banner-canopy with bells hung at four corners, falling from heaven; one bell dropped into Pei\'s bosom—her heart leapt—and thereafter she conceived and bore Fang.',
    'Yao\'s wife, Lady Pei, napped and dreamed of a colored canopy with bells at four corners falling from heaven; one bell struck her breast, her heart leapt, and soon she bore Fang.',
  ],
  s0111: [
    'His height was seven chi five cun.',
    'He stood seven chi five cun tall.',
  ],
  s0112: [
    'From childhood he loved learning and was early renowned.',
    'As a boy he loved books and was known early.',
  ],
  s0113: [
    'Song Danyang Intendant Liu Bing recruited him as chief clerk.',
    'Liu Bing, Song\'s Danyang intendant, took him as chief clerk.',
  ],
  s0114: [
    'Fang was then sixteen and offended Bing\'s son with his spirit.',
    'Fang was sixteen and crossed Bing\'s son with his pride.',
  ],
  s0115: [
    'After some time he became Court Attendant, was recommended as Yanzhou Outstanding Talent, appointed Grand Master of Ceremonies academician, promoted to Staff Officer on the Northern Campaign.',
    'In time he became court attendant, was named Yanzhou outstanding talent, made a ritual academician, then staff officer on the northern campaign.',
  ],
  s0116: [
    'Early Yongming, General of the Guards Wang Jian took Danyang as intendant and again recruited him as chief clerk.',
    'Early in Yongming, Wang Jian of the guards, as Danyang intendant, drew him back as chief clerk.',
  ],
  s0117: [
    'Jian deeply admired Fang and thought there was no equal in the age.',
    'Jian prized him deeply and said no man of the time matched him.',
  ],
  s0118: [
    'Promoted to Criminal Office Prison staff officer, entered as Attendant of the Palace Department in the Masters of Writing, then transferred to Staff Officer and Recorder to the Prince of Jingling of the Secretariat, left office for father\'s mourning.',
    'He rose to prison staff in the criminal office, then palace attendant in the secretariat, then recorder to the Prince of Jingling, and left for his father\'s mourning.',
  ],
  s0119: [
    'By nature most filial; in mourning he observed every rite.',
    'He was filial to the bone; in mourning he kept every rite.',
  ],
  s0120: [
    'When mourning ended, he again suffered mother\'s mourning; he often lodged beside the tomb—in the place of his weeping grass would not grow.',
    'When that mourning ended, his mother died; he kept a hut by the grave, and where he wept the grass would not grow.',
  ],
  s0121: [
    'When mourning ended, appointed Heir Apparent Infantry Colonel, in charge of Eastern Palace records.',
    'When mourning ended he was heir-apparent infantry colonel, keeper of the eastern palace papers.',
  ],
  s0122: [
    'Early, after Qi Emperor Ming had deposed the Emperor of Lin, he first became Attendant, Palace Library Director, General of Agile Cavalry with full staff equal to the Three Ministries, Yangzhou Inspector, Recorder of the Masters of Writing, enfeoffed as Duke of Xuancheng with five thousand additional troops, and had Fang draft the memorial.',
    'When Qi\'s Emperor Ming deposed the Emperor of Lin, he first took attendant, palace library director, agile-cavalry general with full staff, Yangzhou inspector, and recorder of the secretariat, was made duke of Xuancheng with five thousand more troops, and had Fang draft the memorial.',
  ],
  s0123: [
    'Its words say: "Your servant is by nature mediocre, shallow in mind and short in strength.',
    'It runs: "Your servant is a mediocrity, shallow in wit and short in strength.',
  ],
  s0124: [
    'Grand Ancestor Emperor Gao cherished the love due a nephew-son and granted the kindness shown within a household;',
    'Grand Ancestor Gao cherished a nephew as a son and gave the kindness of kin under one roof;',
  ],
  s0125: [
    'Ancestor Emperor Wu treated him as a commoner\'s equal and entrusted him with the bond of shared blood.',
    'Ancestor Emperor Wu treated him as an equal of the robe and bound him with shared blood.',
  ],
  s0126: [
    'When Emperor Wu fell gravely ill, I truly received his charge in words.',
    'When Emperor Wu lay dying, I truly received his charge in words.',
  ],
  s0127: [
    'Though I saw my own light, the near and mean blinded me—yet when a fool arrives once, he happens to know his measure—and I truly could not steel myself at the hour of the embroidered robe nor refuse at the jade throne\'s side; thus I bore the entrustment and led the command of the final charge.',
    'Though I saw my own light, the near blinded me—yet even a fool, once, may know his measure—and I could not harden myself at the hour of mourning dress nor turn away beside the jade throne; so I bore the trust and carried out the last command.',
  ],
  s0128: [
    'Though the successor prince abandoned the norm and was condemned to uphold virtue, the royal house was undone—the fault lies with ministers like me.',
    'Though the heir abandoned the norm and was judged for upholding virtue, the royal house was broken—and the fault is mine.',
  ],
  s0129: [
    'How so?',
    'How so?',
  ],
  s0130: [
    'Kinship was Eastern Mou\'s, the charge was Bolu\'s—he only harbored Zimeng\'s reply for state and altar, how could he save Changyi from the censure of contentious ministers?',
    'Kin was the Prince of Eastern Mou, the charge was Bolu\'s—he only kept Zimeng\'s answer for throne and altar; how could he spare Changyi the rebuke of contentious ministers?',
  ],
  s0131: [
    'The opinion of the four seas—how escape blame?',
    'The judgment of the four seas—how shall I escape blame?',
  ],
  s0132: [
    'The imperial tomb not yet dry, instructions and warnings still in the ear—the affair of house and state has come to this; if not my fault, who bears the blame!',
    'The imperial tomb is not yet dry, the charge still rings in the ear—house and state have come to this; if not my fault, whose is it?',
  ],
  s0133: [
    'How shall I reverently bow at the high inner chamber and devoutly serve the martial park?',
    'How shall I bow at the high inner chamber and serve the martial park with devotion?',
  ],
  s0134: [
    'A grieving heart loses its plan; I wait for dawn weeping blood.',
    'A grieving heart has lost its map; I wait for dawn in tears of blood.',
  ],
  s0135: [
    'How can I again seek glory atop family shame and feast in ease amid national peril?',
    'How can I again seek glory on family shame and feast while the state is in peril?',
  ],
  s0136: [
    'The founding merit of the General of Agile Cavalry, the exemplar of the divine land\'s model lords—the Masters of Writing is called steward of assemblies, the Secretariat truly governs the king\'s words.',
    'The founding merit of the agile-cavalry general, the model lord of the divine land—the secretariat is called steward of assemblies, the palace director truly holds the king\'s words.',
  ],
  s0137: [
    'Yet empty ornaments of favor, entrusting defense of insult—I know it does not satisfy; who of things would say it is fitting?',
    'Yet empty ornaments of favor, entrusting the ward of insult—I know it will not satisfy; who would call it fitting?',
  ],
  s0138: [
    'But life is lighter than a goose feather, duty heavier than mountains; alive or dead we return together, ruin and praise one strand.',
    'Yet life is lighter than a goose feather and duty heavier than mountains; alive or dead we go together, ruin and praise one thread.',
  ],
  s0139: [
    'To refuse one office does not lessen the body\'s burden; to add one post already stains the court\'s rule.',
    'To refuse one office does not lighten the body\'s load; to add one post already stains the court\'s rule.',
  ],
  s0140: [
    'I should then be of one body with the state and not make a show of yielding.',
    'I should then be one body with the state and not make a show of yielding.',
  ],
  s0141: [
    'As for merit equal to one rectification and reward like a thousand households, shining over the nearby suburbs, covering the whole realm—for the term of my life I dare not hear the command; yet I also beg you bend your lowered discernment and grant hearing at once.',
    'As for merit like one rectification and reward like a thousand households, shining over the nearby suburbs and holding the whole realm—for my life\'s term I dare not hear the command; yet I beg you bend your lowered gaze and grant it at once.',
  ],
  s0142: [
    'Juping\'s earnest plea must stand firm, Yongchang\'s cinnabar loyalty may be declared—then one knows the way of ruler and minister has ample surplus; if you say change is manifest, I dare keep what is hard to wrest away.',
    'Juping\'s earnest plea must stand, Yongchang\'s cinnabar heart may be declared—then one knows the way of ruler and minister still has room; if change is plain, I dare keep what is hard to take.',
  ],
  s0143: [
    'The emperor hated that his words rebuked him, was greatly angered—Fang from this for the whole Jianwu period never rose beyond colonel rank.',
    'The emperor hated the rebuke in his words and was furious; from this Fang through all Jianwu never rose above colonel.',
  ],
  s0144: [
    'Fang by nature excelled at composing prose, especially at wielding the brush; his talent never ceased—for that age kings and dukes\' memorials, none did not ask him.',
    'Fang excelled at prose, especially at the brush; his talent never ran dry—every king and duke of the age asked him for memorials.',
  ],
  s0145: [
    'Fang\'s drafts were finished at once, without a dot or stroke changed.',
    'Fang\'s drafts were done at once, without a dot changed.',
  ],
  s0146: [
    'Shen Yue, master of a generation\'s words, deeply esteemed him.',
    'Shen Yue, master of the age\'s words, prized him deeply.',
  ],
  s0147: [
    'When Emperor Ming died, promoted to Secretariat Gentleman.',
    'When Emperor Ming died he was made secretariat gentleman.',
  ],
  s0148: [
    'At Yongyuan\'s end, became Right Chief of Staff of the Secretariat.',
    'At Yongyuan\'s end he was right chief of staff of the secretariat.',
  ],
  s0149: [
    'When Gaozu took the capital, as the hegemon\'s office first opened, Fang was made Staff Officer and Recorder to the General of Agile Cavalry.',
    'When Gaozu took the capital and the hegemon\'s office opened, Fang was staff officer and recorder to the agile-cavalry general.',
  ],
  s0150: [
    'When Gaozu first met Fang at the Prince of Jingling\'s Western Residence, he said with ease: "When I rise to the three offices, I shall make you my recorder."',
    'When Gaozu first met Fang at the Prince of Jingling\'s western residence, he said lightly, "When I reach the three offices, you shall be my recorder."',
  ],
  s0151: [
    'Fang also joked to Gaozu: "If I rise to the three ministries, I shall make you my cavalry officer."',
    'Fang joked back, "If I reach the three ministries, you shall be my cavalry officer."',
  ],
  s0152: [
    'Meaning Gaozu was skilled at riding.',
    'He meant Gaozu rode well.',
  ],
  s0153: [
    'Now therefore he drew Fang in—matching the old words.',
    'Now he drew Fang in—keeping the old jest.',
  ],
  s0154: [
    'Fang submitted a letter saying: "I humbly receive that on this month\'s appointed day you solemnly accept the canonical charter—virtue manifest, merit high, light paired with the four seas; every class that lives has ground to shelter its body;',
    'Fang submitted a letter: "I humbly receive that on this appointed day you solemnly take the canonical charter—virtue bright, merit high, light over the four seas; every living kind has ground to shelter its body;',
  ],
  s0155: [
    'As for Fang, he received a gentleman\'s teaching for nearly twenty years—cough and spit were grace, a glance became ornament; the small man cherishing favor knows where to die.',
    'As for Fang, I have received a gentleman\'s teaching nearly twenty years—cough and spit were grace, a glance was ornament; the small man who cherishes favor knows where to die.',
  ],
  s0156: [
    'Once at a clear banquet there was a thread of words—its lift and carry shaped in friendly jest; who thought such fortune—those words unfailing.',
    'Once at a clear banquet there was a thread of words, shaped in friendly jest; who thought such fortune—that those words would hold.',
  ],
  s0157: [
    'Though feeling erred in foresight, traces fell among proud bait—bath and wash were ready yet no condolence, the great hall was built yet we rejoiced together.',
    'Though feeling erred in foresight, my tracks fell among proud bait—bath and wash stood ready yet no condolence came, the great hall was built yet we rejoiced together.',
  ],
  s0158: [
    'My lord\'s Way crowns the Two Principles, merit surpasses the deepest past—he will make Yi and Zhou hold the reins, Huan and Wen steady the wheels; divine work beyond record, transforming beings beyond name.',
    'My lord\'s Way crowns the two principles, merit passes the deepest past—you will make Yi and Zhou hold the reins, Huan and Wen steady the wheels; divine work beyond record, transforming beings beyond name.',
  ],
  s0159: [
    'As the office first rose, worthy men tossed their heads—only this fish\'s eye carelessly bumped the jade of pearls.',
    'As the office first rose, worthy men tossed their heads—only this fish\'s eye bumped the pearl jade by mistake.',
  ],
  s0160: [
    'Looking back at my own bank, I know how dust clings to the frontier—a meeting once in a thousand ages, a rebirth hard to answer.',
    'Looking back at my own bank, I know how dust stains the frontier—a meeting once in a thousand ages, a rebirth hard to repay.',
  ],
  s0161: [
    'Though I will overstep and die, I know it is not repayment."',
    'Though I overstep and die, I know it is not repayment."',
  ],
  s0162: [
    'When the Liang terrace was raised, the abdication documents were mostly Fang\'s work.',
    'When the Liang terrace rose, the abdication documents were mostly Fang\'s work.',
  ],
  s0163: [
    'When Gaozu ascended the throne, appointed Yellow Gate Gentleman, promoted to Personnel Section Director, soon in that office he also supervised the Compilation Office.',
    'When Gaozu took the throne he was yellow-gate gentleman, then personnel section director, soon in that post supervising the compilation office as well.',
  ],
  s0164: [
    'Tianjian year 2, went out as Administrator of Yixing.',
    'In Tianjian year 2 he went out as administrator of Yixing.',
  ],
  s0165: [
    'In office he was pure and austere—concubines and sons ate only wheat.',
    'In office he was pure and spare—concubines and sons ate only wheat.',
  ],
  s0166: [
    'His friend Dao Gai of Pengcheng—Gai\'s younger brother He—had roamed mountains and streams with Fang.',
    'His friend Dao Gai of Pengcheng—Gai\'s younger brother He—had roamed mountains and streams with him.',
  ],
  s0167: [
    'When replaced and boarding the boat, he had only five hu of rice.',
    'When he was replaced and boarded the boat, he had only five hu of rice.',
  ],
  s0168: [
    'On arrival he had no clothes; Suppressing Army General Shen Yue sent skirt and robe to meet him.',
    'On arrival he had no clothes; Shen Yue the suppressing-army general sent skirt and robe to meet him.',
  ],
  s0169: [
    'Again appointed Personnel Section Director, assisted in great selections—in the post he did not excel.',
    'He was again personnel section director, helping with great selections—in the post he did not excel.',
  ],
  s0170: [
    'Soon transferred to Censor-in-Chief, Palace Library Director, concurrently Front Army General.',
    'Soon he was censor-in-chief, palace library director, and front army general together.',
  ],
  s0171: [
    'Since Qi Yongyuan, the four sections of the secret library had tangled rolls—Fang collated them by hand, and thereby the catalog was fixed.',
    'Since Qi\'s Yongyuan the secret library\'s four sections were tangled—Fang collated them by hand, and the catalog was fixed.',
  ],
  s0172: [
    'Sixth year spring, went out as Pacify-the-North General, Administrator of Xin\'an.',
    'In the sixth year\'s spring he went out as pacify-the-north general and administrator of Xin\'an.',
  ],
  s0173: [
    'In the commandery he did not trouble about dress; simply trailing his staff, he walked the town on foot—people bringing suits and pleas, he judged on the road.',
    'In the commandery he did not trouble about dress; staff in hand, he walked the town on foot—whoever brought suit or plea, he judged on the road.',
  ],
  s0174: [
    'His governance was pure and spare; officials and people found it easy.',
    'His rule was pure and spare; officials and people found it easy.',
  ],
  s0175: [
    'After a full year in office, he died in the government house, age forty-nine.',
    'After a full year in office he died in the government house, at forty-nine.',
  ],
  s0176: [
    'The whole territory grieved; the people together built a shrine south of the city.',
    'The whole territory grieved; the people together built a shrine south of the city.',
  ],
  s0177: [
    'When Gaozu heard, that very day he held mourning and wept with extreme grief.',
    'When Gaozu heard, that very day he mourned and wept with extreme grief.',
  ],
  s0178: [
    'Posthumously enfeoffed as Grand Master of Ceremonies, posthumous title Jingzi.',
    'Posthumously he was made grand master of ceremonies, posthumous title Jingzi.',
  ],
  s0179: [
    'Fang loved to bind friendships and encourage scholar friends—those who gained his praise mostly rose in rank; thus the gentry and nobles all vied to befriend him; guests at his seat were always several tens.',
    'Fang loved friendship and lifted scholar friends—those who won his praise mostly rose; so gentry and nobles all vied to know him, and guests at his seat were always several tens.',
  ],
  s0180: [
    'Men of the age admired this and called him Lord Ren—meaning like the Three Lords of Han.',
    'Men of the age admired this and called him Lord Ren—as with the Three Lords of Han.',
  ],
  s0181: [
    'Yin Yun of Chen commandery wrote to Administrator of Jian\'an Dao Gai: "The wise man has passed; the compass fails.',
    'Yin Yun of Chen commandery wrote to Dao Gai, administrator of Jian\'an: "The wise man has passed; the compass fails.',
  ],
  s0182: [
    'To whom does the divine tortoise belong?',
    'To whom does the divine tortoise belong?',
  ],
  s0183: [
    'Who will carry the lodestone?"',
    'Who will carry the lodestone?"',
  ],
  s0184: [
    'Thus was he pushed by gentlemen friends.',
    'Thus gentlemen friends pushed him.',
  ],
  s0185: [
    'Fang did not manage livelihood—so much so that he had no dwelling.',
    'Fang did not manage livelihood—so much so that he had no house.',
  ],
  s0186: [
    'The world sometimes mocked him for much begging and borrowing, yet he at once gave it away to kin and friends.',
    'The world sometimes mocked him for much begging and borrowing, yet he at once gave it away to kin and friends.',
  ],
  s0187: [
    'Fang often sighed: "Those who know me know me by Uncle Ze; those who do not know me also know me by Uncle Ze."',
    'Fang often sighed, "Those who know me know me by Uncle Ze; those who do not know me also know me by Uncle Ze."',
  ],
  s0188: [
    'Fang\'s library holdings he had seen everywhere—though the house was poor, books gathered to more than ten thousand scrolls, mostly rare editions.',
    'Fang had seen every book in the land—though his house was poor, his library held more than ten thousand scrolls, mostly rare editions.',
  ],
  s0189: [
    'After Fang died, Gaozu had Academician He Zong together with Shen Yue collate his book catalog—what the office lacked, they took from Fang\'s house.',
    'After Fang died, Gaozu had Academician He Zong and Shen Yue collate his catalog—what the office lacked, they took from Fang\'s house.',
  ],
  s0190: [
    'Fang\'s compositions ran to several hundred thousand words and flourished in the world.',
    'Fang\'s writings ran to several hundred thousand words and flourished in the world.',
  ],
  s0191: [
    'Early on Fang stood among the gentry and drew up many; if someone favored him he thickened that person\'s fame.',
    'Early on Fang stood among the gentry and drew many up; if someone favored him, he thickened that person\'s fame.',
  ],
  s0192: [
    'When he died his sons were all young; few came to support the bereaved.',
    'When he died his sons were all young; few came to support the bereaved.',
  ],
  s0193: [
    'Liu Xiaobiao of Pingyuan wrote a discourse, saying:',
    'Liu Xiaobiao of Pingyuan wrote a discourse, saying:',
  ],
  s0194: [
    'The guest asked the host: "Was Zhu Gongshu\'s Discourse on Severing Friendship right?',
    'The guest asked the host, "Was Zhu Gongshu\'s Discourse on Severing Friendship right?',
  ],
  s0195: [
    'Or wrong?"',
    'Or wrong?"',
  ],
  s0196: [
    'The host said: "Guest, why this question?"',
    'The host said, "Guest, why this question?"',
  ],
  s0197: [
    'The guest said: "When the grass insect chirps, the mole cricket leaps; when the sculpted tiger roars, the clear wind rises.',
    'The guest said, "When the grass insect chirps, the mole cricket leaps; when the sculpted tiger roars, the clear wind rises.',
  ],
  s0198: [
    'Thus kin-muffled mutual response—mist wells, clouds steam;',
    'Thus kin-muffled things answer one another—mist wells, clouds steam;',
  ],
  s0199: [
    'crying calls crying summons—stars stream, lightning lashes.',
    'crying calls crying summons—stars stream, lightning lashes.',
  ],
  s0200: [
    'Therefore when Wang Yang ascended, Lord Gong rejoiced; when Han Sheng departed, Guozi grieved.',
    'Therefore when Wang Yang rose, Lord Gong rejoiced; when Han Sheng left, Guozi grieved.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_014_b2.mjs <translation.json>'
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
