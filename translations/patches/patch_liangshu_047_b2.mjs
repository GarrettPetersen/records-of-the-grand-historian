#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Fadu knew Chong\'s resolve was fixed and could not be bent; he changed to gentle persuasion and said, "The emperor knows your honored father is guiltless and will soon release him.',
    'Fadu saw Chong\'s heart could not be broken; he softened and said, "The throne knows your father is innocent and will free him soon.',
  ],
  s0102: [
    'You look bright and noble—truly a fine youth. If you change your plea now, perhaps father and son may both be saved.',
    'You are bright and handsome, a model youth—turn back now and father and son may yet be spared.',
  ],
  s0103: [
    'Why in the flower of youth do you seek the cauldron and blade so bitterly?"',
    'Why at this tender age court the boiling cauldron?"',
  ],
  s0104: [
    'Chong replied, "Even fish fry and ants cherish their lives;',
    'Chong answered, "Even minnows and ants cling to life;',
  ],
  s0105: [
    'how much more a man—who would wish to be ground to dust?',
    'how much more a man—who would choose to be pulverized?',
  ],
  s0106: [
    'Yet my father hangs under grave accusation and must face the full penalty; I mean to throw away my life hoping to extend his."',
    'But my father faces capital charge; I offer my life to prolong his."',
  ],
  s0107: [
    'Now I close my eyes and stretch my neck for the great execution—feeling and will are spent; I have nothing more to say."',
    'I shut my eyes and await the blade—heart and words are spent; I will not answer again."',
  ],
  s0108: [
    'When Chong was first imprisoned the jailers, by law, loaded him with full shackles;',
    'When Chong entered prison the clerks, by statute, fitted him with every bond;',
  ],
  s0109: [
    'Fadu pitied him and ordered two bonds removed, allowing a lighter pair.',
    'Fadu took pity and had two removed, leaving only a lighter set.',
  ],
  s0110: [
    'Chong would not agree and said, "I ask to die for my father—a capital convict should only have bonds added; how may they be lessened?',
    'Chong refused: "I seek to die for my father—a man under death sentence should wear more, not less—',
  ],
  s0111: [
    'In the end he would not remove them."',
    'and he would not let them be taken off."',
  ],
  s0112: [
    'Fadu reported everything in full; Gaozu then pardoned his father.',
    'Fadu memorialized all of it; Gaozu then spared his father.',
  ],
  s0113: [
    'Dan\'yang magistrate Wang Zhi sought his case in the Court of Justice records and asked his township as well, intending at year\'s start to recommend him for the pure filial selection.',
    'Dan\'yang magistrate Wang Zhi looked up his file at the Court of Justice and asked his home place too, planning to nominate him for pure filial piety at the new year.',
  ],
  s0114: [
    'Chong said, "How strange, Magistrate Wang—how shallow you judge Chong!',
    'Chong said, "Strange, Magistrate Wang—how little you think of Chong!',
  ],
  s0115: [
    'When a father is shamed, a son dies—that is right and proper.',
    'When a father is disgraced, a son should die—that is the way.',
  ],
  s0116: [
    'If Chong had face to live, having done this act, it would be buying fame through one\'s father—how shameful!',
    'Had I any shame left after this, it would mean buying a name at my father\'s cost—how vile!',
  ],
  s0117: [
    'He refused and put a stop to it.',
    'He declined and would hear no more.',
  ],
  s0118: [
    'At seventeen he answered summons as chief clerk of his province.',
    'At seventeen he was summoned as the province\'s chief clerk.',
  ],
  s0119: [
    'He went out to supervise Wannian county; as acting magistrate for one cycle customs were greatly transformed.',
    'He supervised Wannian county; in one month as acting magistrate custom was greatly reformed.',
  ],
  s0120: [
    'From Yong he returned to Ying; Xiangzhou inspector Liu Yue again summoned him as chief clerk.',
    'From Yong he came back to Ying; Liu Yue, inspector of Xiangzhou, again made him chief clerk.',
  ],
  s0121: [
    'Later townsman Pei Jian, Dan\'yang assistant magistrate Zang Dun, and Yangzhou rectifier Zhang Ze jointly recommended Chong, finding his filial conduct pure and his mastery of the Changes and Laozi clear.',
    'Later Pei Jian of his town, Zang Dun of Dan\'yang, and Zhang Ze, Yangzhou rectifier, jointly praised Chong\'s pure filiality and clear grasp of the Changes and Laozi.',
  ],
  s0122: [
    'An edict ordered the Court of Imperial Sacrifices to proclaim and recommend him.',
    'An edict sent the matter to the Court of Imperial Sacrifices for public commendation.',
  ],
  s0123: [
    'Earlier, because his father fell into guilt, he developed a trembling illness; later he died when it flared.',
    'From his father\'s ordeal he had taken a trembling sickness; later he died when it broke out.',
  ],
  s0124: [
    'Zhen Tian, styled Yanyue, was a man of Wuji in Zhongshan; his clan had long lived in Jiangling.',
    'Zhen Tian, styled Yanyue, came from Wuji in Zhongshan; his family had dwelt in Jiangling for generations.',
  ],
  s0125: [
    'His grandfather Qinzhi had been magistrate of Changning.',
    'His grandfather Qinzhi was magistrate of Changning.',
  ],
  s0126: [
    'His father Biaozhi had been a provincial adjutant.',
    'His father Biaozhi was a provincial adjutant.',
  ],
  s0127: [
    'Tian lost his father at several years old, grief like an adult\'s.',
    'Tian lost his father as a small child, mourning like a grown man.',
  ],
  s0128: [
    'The family pitied his youth and fed him rice mixed with broth; Tian would not eat.',
    'Kin, pitying his age, mixed broth into his rice; Tian refused it.',
  ],
  s0129: [
    'At eight he asked his mother, grieving he had never known his father; he wept for days until suddenly he seemed to see one and spoke his features—it was his father; at the time this was deemed filial response.',
    'At eight he told his mother he hated never knowing his father, wept for days, then seemed to see someone and described his looks—it was his father; men called it filial portent.',
  ],
  s0130: [
    'Though the household was poor, in nurturing his mother he always obtained delicacies.',
    'Poor as they were, he always found fine food for his mother.',
  ],
  s0131: [
    'In mourning he hutted by the tomb; constantly birds of mixed black and yellow gathered on the hut tree—when Tian wept they cried, when he stopped they stopped.',
    'Mourning at the grave he built a hut; black-and-yellow birds always perched on its tree—when Tian wept they called, when he ceased they ceased.',
  ],
  s0132: [
    'A white sparrow also roosted on his hut.',
    'A white sparrow roosted on the hut as well.',
  ],
  s0133: [
    'The provincial commander, Prince of Shixing Xiao Dan, memorialized his conduct.',
    'Xiao Dan, Prince of Shixing and provincial commander, reported his conduct.',
  ],
  s0134: [
    'Edict said, "We empty ourselves to honor the worthy, longing day and night.',
    'The edict read, "We humble ourselves before the worthy and think of them waking and sleeping.',
  ],
  s0135: [
    'We charge the mountain peaks to search and lift all they can.',
    'We command the high officials to seek and raise them without fail.',
  ],
  s0136: [
    'Tian\'s filial conduct is truly rare, his fame filling the land—he ennobles custom and profits the realm greatly.',
    'Tian\'s filiality is extraordinary, his name known in every district—he steels the folk and brings great good.',
  ],
  s0137: [
    'The shepherds and guards have reported up; it is as if We read it ourselves.',
    'The governors have sent word; We receive it as if with Our own eyes.',
  ],
  s0138: [
    'He may be marked at his gate and lane and given rank."',
    'Let his gate and lane be honored and rank be granted."',
  ],
  s0139: [
    'Tian reached the post of acting staff officer on the Pacifying South campaign.',
    'Tian rose to acting staff officer on the Pacifying South staff.',
  ],
  s0140: [
    'Han Huaiming',
    'Han Huaiming',
  ],
  s0141: [
    'Han Huaiming was a man of Shangdang who resided as a guest in Jingzhou.',
    'Han Huaiming was from Shangdang and lived as a guest in Jingzhou.',
  ],
  s0142: [
    'At ten his mother suffered corpse-consumption malady; each attack nearly killed her.',
    'At ten his mother had corpse-consumption sickness; every bout nearly took her life.',
  ],
  s0143: [
    'Huaiming knelt and prayed under the stars; the cold was piercing—suddenly he smelled fragrance and a voice in the air said, "Your mother\'s illness will soon be cured for good—do not torment yourself.',
    'Huaiming knelt under the stars in bitter cold; suddenly fragrance came and a voice above said, "The boy\'s mother will soon be wholly well—do not torture yourself.',
  ],
  s0144: [
    'Before dawn his mother was wholly restored."',
    'Before daybreak his mother was completely healed."',
  ],
  s0145: [
    'The countryside marveled.',
    'Neighbors were astonished.',
  ],
  s0146: [
    'At fifteen he lost his father, nearly wasting away; he carried earth for the mound and accepted no gifts of help.',
    'At fifteen his father died; he nearly perished from grief, piled the grave himself, and took no aid offered.',
  ],
  s0147: [
    'When mourning ended he and townsman Guo Yu both studied under Liu Qiu of Nanyang.',
    'After mourning he and Guo Yu of his town studied with Liu Qiu of Nanyang.',
  ],
  s0148: [
    'Once Qiu suspended lecture for a day and wept alone.',
    'Once Qiu canceled class for a day and wept by himself.',
  ],
  s0149: [
    'Huaiming quietly asked why; Qiu\'s household answered, "It is his maternal grandfather\'s death-day.',
    'Huaiming asked the reason in private; the household said, "It is the day his mother\'s father died.',
  ],
  s0150: [
    'By then Qiu\'s mother was also dead."',
    'His own mother was already gone as well."',
  ],
  s0151: [
    'Huaiming heard and that day left study to return home and serve.',
    'Hearing this, Huaiming quit school the same day and went home to tend her.',
  ],
  s0152: [
    'Qiu sighed, "Master Han need have no regret like Yu Qiu\'s."',
    'Qiu sighed, "Han need not bear Yu Qiu\'s remorse."',
  ],
  s0153: [
    'Poor at home, he often hired out labor for sweet and tender foods, delighting under his mother\'s knees, never leaving her day or night.',
    'The house was poor; he toiled for dainties, merry at her knee, never leaving her side dawn to dusk.',
  ],
  s0154: [
    'His mother died at ninety-one of old age; Huaiming took neither food nor drink for ten days, wailing without cease.',
    'His mother died at ninety-one; Huaiming took no food or drink for ten days and wailed without stopping.',
  ],
  s0155: [
    'A pair of white doves nested on his mourning hut, feeding their young tamely like barn birds; only when mourning ended did they leave.',
    'Two white doves nested on his hut, rearing young as tame as poultry; they left only when mourning was done.',
  ],
  s0156: [
    'After mourning he ate vegetables all his life and never changed his garments.',
    'After mourning he ate only vegetables for life and never changed his clothes.',
  ],
  s0157: [
    'Early in Heavenly Surveillance the inspector, Prince of Shixing Xiao Dan, memorialized him.',
    'At the start of Heavenly Surveillance Xiao Dan, Prince of Shixing and inspector, reported him.',
  ],
  s0158: [
    'The province repeatedly summoned him but he would not accept; he died at home.',
    'The province called him many times; he would not go, and died at home.',
  ],
  s0159: [
    'Liu Tanjing',
    'Liu Tanjing',
  ],
  s0160: [
    'Liu Tanjing, styled Yuanguang, was a man of Lyu in Pengcheng.',
    'Liu Tanjing, styled Yuanguang, was from Lyu in Pengcheng.',
  ],
  s0161: [
    'His grandfather Yuanzhen had been Huainan governor and offended while in office;',
    'His grandfather Yuanzhen was governor of Huainan and committed an offense in the commandery;',
  ],
  s0162: [
    'his father Huijing went repeatedly to court officials begging pity, sincere to the utmost, and became known for filial piety.',
    'his father Huijing went again and again to court notables pleading mercy, utterly earnest, and won fame for filial piety.',
  ],
  s0163: [
    'Tanjing\'s steadfast conduct had his father\'s spirit.',
    'Tanjing\'s devoted ways matched his father\'s.',
  ],
  s0164: [
    'On first office he was left palace attendant of the Kingdom of Ancheng.',
    'He first served as left palace attendant in the Kingdom of Ancheng.',
  ],
  s0165: [
    'His father died in the prefecture; Tanjing rushed to mourning and for days ate and drank nothing, dying and reviving.',
    'His father died in office; Tanjing ran to the funeral and for days took no food or drink, fainting and waking.',
  ],
  s0166: [
    'Each time he wept he vomited blood.',
    'Every bout of weeping brought up blood.',
  ],
  s0167: [
    'When mourning ended he fell ill from wasting grief.',
    'After mourning he sickened from grief-wasting.',
  ],
  s0168: [
    'An edict came for gentry and commoners each to recommend four categories; his uncle Huifei recommended him for filial conduct and Gaozu made him Haining magistrate.',
    'When an edict bade each clan recommend four kinds of men, his uncle Huifei nominated him for filial conduct and Gaozu appointed him Haining magistrate.',
  ],
  s0169: [
    'Tanjing\'s elder brother had not yet held a county post, so he yielded; he was then made staff officer of the Pacifying West campaign.',
    'His elder brother had no county post yet, so Tanjing yielded the magistracy and was made staff officer on the Pacifying West staff.',
  ],
  s0170: [
    'After his father\'s death he served his mother with utmost purity, cooking porridge himself and entrusting it to none.',
    'After his father died he served his mother with deepest devotion, cooking gruel himself and trusting no one else.',
  ],
  s0171: [
    'When his mother fell ill he did not unfasten his belt.',
    'When she was ill he never loosened his belt.',
  ],
  s0172: [
    'When she died he nearly ten days took no food or drink.',
    'When she died he took no food or drink for nearly ten days.',
  ],
  s0173: [
    'His mother\'s coffin was temporarily interred at Medicine King Temple.',
    'His mother was provisionally buried at Medicine King Temple.',
  ],
  s0174: [
    'The weather was cold; Tanjing wore only thin cloth, hutted at the burial place, weeping day and night without pause—travelers were moved; before the year was out he died.',
    'It was bitter cold; Tanjing wore a single layer, hutted at the grave, weeping day and night—passersby wept; before the year ended he died.',
  ],
  s0175: [
    'He Jiong, styled Shiguang, was a man of Qian in Lujiang.',
    'He Jiong, styled Shiguang, was from Qian in Lujiang.',
  ],
  s0176: [
    'His father Zun was Grand Master of Palace Counsel.',
    'His father Zun was Grand Master of Palace Counsel.',
  ],
  s0177: [
    'At fifteen Jiong studied with his older cousin Yin; in one cycle he mastered all Five Classics\' chapter-and-verse.',
    'At fifteen he studied with his cousin Yin; in one year he knew every chapter of the Five Classics.',
  ],
  s0178: [
    'Fair and handsome, his cousins Qiu and Dian often praised him: "Shubao\'s spirit is clear, Hongzhi\'s skin is clear.',
    'Pale and handsome, his cousins Qiu and Dian would say, "Shubao\'s spirit was pure, Hongzhi\'s complexion pure.',
  ],
  s0179: [
    'Seeing this boy again, Wei and Du are before our eyes."',
    'Now this lad brings Wei and Du back before us."',
  ],
  s0180: [
    'Jiong often admired quiet withdrawal and took no joy in advancement.',
    'Jiong loved simplicity and disliked climbing office.',
  ],
  s0181: [
    'His uncle Chang Xu said, "Qiu and Dian have both ascended high—you need not do likewise.',
    'His uncle Chang Xu told him, "Qiu and Dian have both gone aloft—you need not follow.',
  ],
  s0182: [
    'Moreover the gentleman\'s going forth and staying have each their path."',
    'A gentleman\'s rise and retirement are each a proper way."',
  ],
  s0183: [
    'At nineteen he first took office as Yangzhou chief clerk.',
    'At nineteen he entered office as Yangzhou chief clerk.',
  ],
  s0184: [
    'Recommended as cultivated talent, he rose through prince\'s staff officer, and both Military and Treasury sections of the Masters of Writing.',
    'Made a cultivated talent, he rose to prince\'s staff officer and both Military and Treasury bureaus of the Masters of Writing.',
  ],
  s0185: [
    'Sent out as Yongkang magistrate, famed for harmony and order.',
    'He went out as Yongkang magistrate, praised for gentle rule.',
  ],
  s0186: [
    'Returned as recorder within the Prince of Nankang Renwei\'s domain, then impeachment censor.',
    'Back as recorder to Prince Renwei of Nankang, then impeachment censor.',
  ],
  s0187: [
    'His father was ill for ten days; Jiong did not unfasten his belt or comb or wash—within two nights his form was suddenly changed.',
    'His father was sick ten days; Jiong never loosened his belt or washed his hair—in two nights his face was altered.',
  ],
  s0188: [
    'When his father died he wailed without cease, his pillow fallen to the ground—his waist failed and legs swelled; he died at last of grief.',
    'When his father died he wailed endlessly, pillow cast aside, waist hollow and legs swollen—he died of grief.',
  ],
  s0189: [
    'Yu Shamí',
    'Yu Shamí',
  ],
  s0190: [
    'Yu Shamí was a man of Yingyin.',
    'Yu Shamí was from Yingyin.',
  ],
  s0191: [
    'He was sixth-generation descendant of Jin Minister of Works Bing.',
    'He was sixth in descent from Jin Minister of Works Bing.',
  ],
  s0192: [
    'His father Peiyu had been Pacifying the State chief aide and Changsha administrator; in Song\'s Shengming he was executed for Shen Youzhi\'s affair—Shamí had just been born.',
    'His father Peiyu was chief aide to the Pacifying-the-State general and Changsha administrator; in Song Shengming he was killed in Shen Youzhi\'s rebellion—Shamí was a newborn.',
  ],
  s0193: [
    'At five his birth mother had a colored garment made for him; he would not wear it.',
    'At five his birth mother made him bright clothes; he refused to put them on.',
  ],
  s0194: [
    'When she asked why, he wept and said, "Our house met cruel disaster—of what use is this?',
    'Asked the reason, he wept and said, "Our clan suffered bitter ruin—what is this for?',
  ],
  s0195: [
    'Grown, he wore plain cloth and ate vegetables all his life."',
    'Grown, he wore coarse cloth and ate vegetables for life."',
  ],
  s0196: [
    'He began as left palace attendant of the Kingdom of Linchuan and became acting field-accounts staff officer of the Central Army.',
    'He started as left palace attendant in the Kingdom of Linchuan, then field-accounts staff officer of the Central Army.',
  ],
  s0197: [
    'When his stepmother Lady Liu lay ill Shamí attended morning and evening, belt unfastened; if acupuncture was needed he tried it on himself first.',
    'When his stepmother Lady Liu was sick Shamí waited dawn and dusk, belt never loosened; if needles were used he tested them on himself first.',
  ],
  s0198: [
    'When she died he took no food or drink for days, through the whole mourning never removing his hemp, never leaving the hut, wailing day and night—neighbors could not bear to hear.',
    'When she died he fasted for days, never left his mourning garb or hut, wailing day and night till neighbors could not listen.',
  ],
  s0199: [
    'The tomb was at Xinlin; more than a hundred traveler pines sprang up on their own beside the mound.',
    'The grave was at Xinlin; over a hundred pines grew by themselves beside the tomb.',
  ],
  s0200: [
    'His clan elder, Minister President of Justice Yong, memorialized his case for the pure filial recommendation; Gaozu summoned and praised him and appointed him She magistrate.',
    'His kinsman Yu Yong, Minister President of Justice, reported him for pure filial piety; Gaozu received him, praised him, and made him magistrate of She.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_047_b2.mjs <translation.json>'
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
