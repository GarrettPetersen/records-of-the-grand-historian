#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: ['Music, Part One', 'Music 1'],
  s0002: [
    'Sound originates in the Grand Beginning and arises from the human heart; as things are encountered it stirs the feelings, and spreads through form and breath.',
    'Sound has its root in the primordial beginning and is born in the human heart; stirred by what one encounters, it moves through body and breath.',
  ],
  s0003: [
    'Once form and breath are manifest, they harmonize with pitch pipes and tones; when gong and shang achieve harmony, this is called music.',
    'When physical expression takes shape, it aligns with the pitch standards; gong and shang harmonize, and this is called music.',
  ],
  s0004: [
    'Music (yue) means joy (le).',
    'Music is joy.',
  ],
  s0005: [
    'The sage, because the people rejoice in his virtue, sets it right with the six pitch pipes, adorns it with the five tones, chants it in the nine songs, and dances it in the eight rows.',
    'Because the people delight in the sage\'s virtue, he regulates it with the six pitch pipes, ornaments it with the five tones, sings it in the nine songs, and dances it in the eight rows of performers.',
  ],
  s0006: [
    'Truly it is the crown and sash of an age of peace, the source and root of royal transformation.',
    'It is truly the crowning ornament of a flourishing age and the wellspring of civilizing rule.',
  ],
  s0007: [
    'The Record says: "Stirred by things, one moves, and so sound takes form.',
    'The Record says: "Moved by things, the heart responds, and sound takes shape.',
  ],
  s0008: [
    '" Man is the disseminated breath of the two principles, where nature and feeling arise; if one indulges its flow and sinks into it, going on without return, therefore the Five Emperors made music, the Three Kings established ritual, marked out human relations, and cut down excess and dissipation.',
    'Man is the breath of yin and yang made flesh, the seat of nature and emotion; left to run unchecked, feeling pours forth without return. That is why the Five Emperors created music and the Three Kings fashioned ritual—to set human relations in order and curb licentious excess.',
  ],
  s0009: [
    'In its use it moves Heaven and Earth, touches spirits and ghosts, reaches ancestors, and harmonizes the states.',
    'Used rightly, it moves Heaven and Earth, stirs spirits and ghosts, draws near the ancestors, and brings the realm into harmony.',
  ],
  s0010: [
    'It plants the winds and completes transformation, mirrors virtue and displays merit, opens the feelings of the myriad things, and communicates the will of all under Heaven.',
    'It plants moral influence and completes transformation, mirrors virtue and displays achievement, awakens the feelings of all living things, and gives voice to the will of the empire.',
  ],
  s0011: [
    'As for ascent and descent, there are rules; in gong and shang, models are handed down.',
    'Ascent and descent follow fixed rules; gong and shang provide the standard for all modes.',
  ],
  s0012: [
    'If ritual exceeds its measure, high and low are at odds; if music loses its order, near and far fall into confusion.',
    'When ritual oversteps its proper form, rank and station are thrown into disorder; when music loses its sequence, intimacy and distance are confused.',
  ],
  s0013: [
    'Ritual fixes the outward image; music settles the inner heart—outward reverence, inward harmony, joining feeling and adorning appearance, like yin and yang completing transformation, like sun and moon giving light.',
    'Ritual defines the outward form; music calms the inner heart. Outward reverence and inward harmony join feeling to appearance, as yin and yang complete transformation and sun and moon give light.',
  ],
  s0014: [
    'The Record says: "A grandee, without special cause, does not remove his suspended bells; a gentleman, without special cause, does not put away his zithers.',
    'The Record says: "A grandee does not remove his suspended bells without good cause; a gentleman does not put away his zither and lute without good cause.',
  ],
  s0015: [
    '" The sage creates music to guide and welcome harmonious qi, to drive off evil feeling and raise up good intent.',
    'The sage creates music to welcome harmonious qi, drive away corrupt emotion, and awaken virtuous intent.',
  ],
  s0016: [
    'Emperor Yi had the sound of reed pipes; Fuxi had the song of nets and snares; Getian had eight airs; Shennong had five strings—the deed and the achievement go together; the antiquity of it is already high.',
    'Emperor Yi had reed-pipe music; Fuxi had the song of the hunting net; Getian had eight songs; Shennong had the five-string lute—each deed matched its music, and the tradition reaches far back.',
  ],
  s0017: [
    'Yellow Emperor\'s music was called "Xian Pool"; Emperor Ku\'s was "Six Splendors"; Emperor Zhuanxu\'s was "Five Stalks"; Emperor Yao\'s was "Great Pattern"; Emperor Shun\'s was "Xiao Shao"; Yu\'s was "Great Xia"; Tang of Yin\'s was "Hu"; King Wu\'s was "Wu"; the Duke of Zhou\'s was "Shao."',
    'The Yellow Emperor\'s music was called Xian Pool; Emperor Ku\'s, Six Splendors; Emperor Zhuanxu\'s, Five Stalks; Emperor Yao\'s, Great Pattern; Emperor Shun\'s, Xiao Shao; Yu\'s, Great Xia; Tang of Yin\'s, Hu; King Wu\'s, Wu; and the Duke of Zhou\'s, Shao.',
  ],
  s0018: [
    'They taught by wind and fu, enlarged by filial piety and brotherhood; great ritual shares its measure with Heaven and Earth, great music shares its harmony with Heaven and Earth—ritual\'s meaning is the wind\'s current, music\'s feeling is the moistening balm.',
    'They taught through the Odes and rhapsodies, spreading filial piety and brotherly duty; great ritual keeps pace with Heaven and Earth, great music harmonizes with Heaven and Earth—ritual carries moral purpose, music nourishes the heart.',
  ],
  s0019: [
    'The Tradition says: "If there is to be a true king, benevolence comes only after several generations.',
    'The Tradition says: "When a true king appears, benevolent rule takes generations to ripen.',
  ],
  s0020: [
    '" The transformations of Cheng and Kang reached ascendant peace, and punishments were laid aside unused.',
    'The reigns of Kings Cheng and Kang brought an age of peace so complete that punishments fell into disuse.',
  ],
  s0021: [
    'In antiquity when the Son of Heaven heard affairs of state, the ministers and grandees presented odes.',
    'In antiquity the Son of Heaven listened to governance while ministers and grandees presented poems.',
  ],
  s0022: [
    'The people of Qin had their own compositions; this Way was rarely heard.',
    'The Qin had their own music, but this tradition was rarely heard thereafter.',
  ],
  s0023: [
    'In the time of Emperor Gaozu of Han, Shusun Tong thereupon fixed the ritual sections for use in sacrifices to the ancestral temple.',
    'Under Han Gaozu, Shusun Tong fixed the ritual sections for ancestral temple sacrifice.',
  ],
  s0024: [
    'Lady Tangshan could perform Chu songs, and also created music for the inner chambers.',
    'Lady Tangshan, skilled in Chu songs, also composed chamber music.',
  ],
  s0025: [
    'Emperor Wu trimmed the resonance of pitch and tone, fixed the sacrifices at the suburban altars, and mixed in many popular ballads—not wholly orthodox odes.',
    'Emperor Wu refined pitch and tone, established suburban sacrifices, and incorporated many folk songs—not entirely orthodox court odes.',
  ],
  s0026: [
    'In the time of Emperor Ming of Han, music had four grades: first, Great Imperial Music, used at suburban rites, ancestral temples, and imperial tombs.',
    'Under Han Mingdi, music fell into four categories: first, Great Imperial Music, used at suburban sacrifices, ancestral temples, and imperial tombs.',
  ],
  s0027: [
    'This is what the Changes calls "the former kings made music to honor virtue, and in the Yin season offered to the Lord on High, matching the ancestors."',
    'This is what the Book of Changes means by "the former kings made music to honor virtue, and in the Yin season offered to the Lord on High, pairing him with the ancestors."',
  ],
  s0028: [
    'Second, Ya and Song music, used at the Bright Hall feasts and archery rites.',
    'Second, Ya and Song music, used at Bright Hall banquets and archery ceremonies.',
  ],
  s0029: [
    'This is what the Classic of Filial Piety calls "to shift the winds and change custom, nothing is better than music."',
    'This is what the Classic of Filial Piety means by "nothing transforms custom better than music."',
  ],
  s0030: [
    'Third, Yellow Gate Impromptu Music, used when the Son of Heaven feasted his ministers.',
    'Third, Yellow Gate Impromptu Music, performed when the Son of Heaven feasted his ministers.',
  ],
  s0031: [
    'This is what the Odes call "beat the drums for us, dance for us in ranks."',
    'This is what the Odes mean by "beat the drums for us, dance for us in ranks."',
  ],
  s0032: [
    'The fourth is Short Flute and Naoge Music, used in the army.',
    'Fourth, Short Flute and Naoge Music, used in military campaigns.',
  ],
  s0033: [
    'In the time of the Yellow Emperor, Qibo created it to establish martial glory, display virtue, stir the enemy, and encourage the troops—what the Offices of Zhou calls "when the royal army wins a great victory, victory songs are ordered."',
    'Created by Qibo in the Yellow Emperor\'s time, it proclaimed martial glory, displayed virtue, intimidated the enemy, and roused the troops—what the Rites of Zhou calls "when the royal army wins a great victory, victory songs are commanded."',
  ],
  s0034: [
    'They also gathered odes and hymns from the hundred offices to serve as ascent songs; on the auspicious day of the tenth month, the steam sacrifice was first performed.',
    'They also collected odes and hymns from officials of every rank for ascent songs, and on the auspicious tenth month performed the steam sacrifice.',
  ],
  s0035: [
    'In the turmoil of Dong Zhuo, orthodox music was wholly scattered.',
    'During Dong Zhuo\'s rebellion, orthodox music was completely lost.',
  ],
  s0036: [
    'Du Kui, director of Han\'s elegant music, understood musical affairs; of the eight sounds and seven beginnings, none escaped his mastery.',
    'Du Kui of Han\'s elegant music bureau understood every aspect of music—the eight sounds and seven pitch origins were all within his grasp.',
  ],
  s0037: [
    'When Cao Wu pacified Jing Province he obtained Kui and had him edit and fix the elegant pitch pipes.',
    'When Cao Cao pacified Jing Province he obtained Du Kui and had him revise the orthodox pitch standards.',
  ],
  s0038: [
    'Wei had ancient music of former ages—beginning with Kui.',
    'Wei\'s ancient music of former dynasties began with Du Kui.',
  ],
  s0039: [
    'From this down to Jin they followed one another; in the Yongjia invasion everything was lost to the Hu and Jie.',
    'From then until Jin the tradition was handed down, but the Yongjia invasion swept it all away among the northern tribes.',
  ],
  s0040: [
    'Thereupon musicians fled south; Emperor Mu gathered bells and chime-stones; when Fu Jian was defeated in the north, Emperor Xiaowu recovered the ascent songs.',
    'Musicians fled south; Emperor Mu of Jin gathered bells and stones; when Fu Jian was defeated in the north, Emperor Xiaowu recovered the ascent songs.',
  ],
  s0041: [
    'Jin lost its discipline; Wei was about to rise to hegemony—Daowu took Zhongshan, Taiwu pacified Tongwan; sometimes they obtained court bell-sets, sometimes they collected ancient music; at the time urgent affairs pressed, and elegant instruments were set aside.',
    'As Jin fell into disorder and Wei rose toward dominance, Daowu conquered Zhongshan and Taiwu pacified Tongwan—sometimes capturing court bell-sets, sometimes gathering ancient music—but urgent statecraft left elegant instruments neglected.',
  ],
  s0042: [
    'Emperor Xiaowen of Wei often composed songs and poems to encourage those in office; ballads spread among the people and were arranged to pitch and mode.',
    'Emperor Xiaowen of Wei composed songs and poems to encourage his officials; popular ballads spread and were set to pitch and mode.',
  ],
  s0043: [
    'Great ministers ranged through Han and Wei, gathered from Song and Qi; after success they rejoiced, and each age had its own compositions.',
    'Great ministers drew on Han and Wei traditions and collected from Song and Qi; after each triumph they composed celebratory music, and every age produced its own works.',
  ],
  s0044: [
    'None failed to display their own temple dances and create their own suburban hymns, proclaiming merit and virtue, shining glory on the age—yet in shifting the winds and changing custom, decline set in by degrees.',
    'Each dynasty staged its own temple dances and composed its own suburban hymns, proclaiming merit and virtue in the light of the age—yet in transforming custom, decline crept in by degrees.',
  ],
  s0045: [
    'Emperor Wu of Liang was originally a scholar, broadly versed in earlier records; before he even left his carriage, his mind was already set on elegance and refinement, and he thereupon ordered all to state what they knew.',
    'Emperor Wu of Liang began as a scholar steeped in earlier learning; even before taking the throne his heart was set on restoring refined music, and he ordered everyone to submit their views.',
  ],
  s0046: [
    'The Emperor also himself corrected past errors and shaped a standard for the age.',
    'The Emperor himself corrected past errors and established standards for his age.',
  ],
  s0047: [
    'Grand Ancestor of Zhou rose in Guanlong, personally settled the frontier tribes; his ministers requested music of achieved merit, following Zhou antiquity, ordering pipes according to the three materials and wielding text according to the six canons.',
    'Zhou\'s Grand Ancestor rose in Guanlong and personally pacified the frontier tribes; his ministers requested victory music following Zhou antiquity, ordering pipes by the three materials and composing texts by the six classics.',
  ],
  s0048: [
    'Yet the sound of "Xia Wu"—could that be the song of the Ji people? The ascent songs harmonized with Xianbei tones; feeling stirred within—this too is what the human heart cannot restrain.',
    'Yet the melody of Xia Wu—was that truly a Ji song? The ascent songs harmonized with Xianbei tones; feeling stirred within—the human heart cannot always be restrained.',
  ],
  s0049: [
    'Formerly when Confucius returned to Lu, the Airs and Elegances were set right—what is called having the art but not the time.',
    'When Confucius returned to Lu, the Airs and Elegances were set right—yet he had the art without the opportune moment.',
  ],
  s0050: [
    'When Gaozu received the mandate anew, the eight provinces were united; the music masters all came from barbarian peoples, and the hymns welcoming the spirits still carried frontier melodies.',
    'When Gaozu of Sui received the mandate, the eight provinces were united—but the music masters were mostly of barbarian origin, and hymns welcoming the spirits still bore frontier melodies.',
  ],
  s0051: [
    'When Yan and He urgently petitioned, they touched somewhat on elegant tones, yet in continuing to long for Shao music, they moved ever farther from it.',
    'When Yan and He urgently petitioned, they touched on orthodox tones—but those who yearned for Shao music were ever farther from attaining it.',
  ],
  s0052: [
    'As for the principle of the Two Souths, the eight winds raising their measure, sequence passing through on every side, licentious and corrupt music cast aside, palace and pitch modes flowing in song, soaring and leading the dance—expanding the Way of humaneness and righteousness, settling the truth of life and nature, gentlemen growing deeper, common men without regret—if not the excellence of great music, who could share in this!',
    'When the Two Souths govern rightly, the eight winds raise their proper measure, order passes freely in every direction, licentious music is cast aside, palace modes flow in song, dancers rise and wheel in flight—expanding humaneness and righteousness, securing the truth of life, deepening the gentleman and leaving no regret among common men—if this is not the glory of great music, what is?',
  ],
  s0053: [
    'Therefore when Shun sang the "Southern Winds," Emperor Yu flourished; when Zhou sang the northern frontier, King Yin perished.',
    'When Shun sang the Southern Winds, the Yu dynasty flourished; when Zhou sang frontier melodies of the north, the Yin dynasty fell.',
  ],
  s0054: [
    'When great music is not disordered, royal governance stands within it.',
    'When great music keeps its order, royal governance rests secure.',
  ],
  s0055: [
    'Therefore I record what does not simply follow in succession, to preserve it in this treatise.',
    'I therefore record what does not merely repeat inherited forms, preserving it in this treatise.',
  ],
  s0056: [
    'In the Offices of Zhou, the Grand Music Master had 1,339 persons.',
    'The Grand Music Master of the Offices of Zhou numbered 1,339 persons.',
  ],
  s0057: [
    'Han\'s suburban temples and martial music: 380 persons.',
    'Han\'s suburban temples and martial music employed 380 persons.',
  ],
  s0058: [
    'Emperor Yang indulged extravagance and dabbled much in licentious tunes; Censor-in-Chief Pei Yun, gauging the Emperor\'s taste, memorialized to gather musicians\' sons and daughters from Zhou, Qi, Liang, and Chen, and all skilled in fine tones among the people—more than 300 in all—and assign them to the Grand Music Office.',
    'Emperor Yang indulged extravagance and favored licentious tunes; Censor-in-Chief Pei Yun, reading the Emperor\'s taste, memorialized to gather musicians\' children from Zhou, Qi, Liang, and Chen and all skilled performers among the people—more than 300 in all—and assign them to the Grand Music Office.',
  ],
  s0059: [
    'Actors and singers intermixed—all came and gathered.',
    'Actors and singers mingled together, and all converged there.',
  ],
  s0060: [
    'The mournful pipes\' new sounds and the licentious strings\' clever playing all came from below Ye city—the old tunes of Northern Qi, it is said.',
    'The new sounds of mournful pipes and the clever playing of licentious strings all came from below Ye city—the old tunes of Northern Qi, it is said.',
  ],
  s0061: [
    'At the beginning of the Liang house, music followed Qi\'s old tradition.',
    'At the founding of Liang, music followed the old Qi tradition.',
  ],
  s0062: [
    'The Emperor wished to expand ancient music; in the first year of Tianjian he issued an edict asking the hundred officials: "The Way of sound and music connects with governance; therefore it shifts the winds and changes custom, clarifying noble and base.',
    'The Emperor sought to restore ancient music; in Tianjian year 1 he issued an edict asking the officials: "The Way of music connects with governance—it shifts custom, clarifies rank, and distinguishes noble from base.',
  ],
  s0063: [
    'Yet the names of Shao and Hu are transmitted empty; the reality of Xian and Ying has no resting place; from Wei and Jin onward, decline grew ever worse.',
    'Yet the names of Shao and Hu survive only as empty titles; the substance of Xian and Ying has no firm foundation; from Wei and Jin onward decline grew ever worse.',
  ],
  s0064: [
    'Thus elegant and popular music were confused, bells and stones went astray; Heaven and man lacked the nine transformations, court feasts lost the four suspended sets.',
    'Elegant and popular music were confused, bells and stones misaligned; Heaven and man lacked the nine ritual transformations, and court banquets lost the four suspended bell-sets.',
  ],
  s0065: [
    'I rise at dawn to hold court, thinking to seek the root of this, yet old affairs are not preserved and I have not been able to set it right; waking and sleeping I have this concern, and sigh for it.',
    'I rise at dawn to hold court, seeking the root of this problem, yet old records are lost and I cannot set matters right—this weighs on me waking and sleeping.',
  ],
  s0066: [
    'You, with your learning clear and penetrating, may state what you see.',
    'You whose learning is clear and penetrating—state what you know.',
  ],
  s0067: [
    '" Thereupon Attendant Cavalier and Vice Minister of the Masters of Writing Shen Yue memorialized in reply: "I venture to think that in the Qin age learning was extinguished and the Music Classic was lost.',
    'Attendant Cavalier and Vice Minister Shen Yue replied: "In the Qin, learning was destroyed and the Music Classic lost.',
  ],
  s0068: [
    'Down to the time of Emperor Wu of Han, the King of Hejian and Mao Sheng and others together gathered passages on music from the Offices of Zhou and various masters to compose the Record of Music.',
    'By Emperor Wu of Han\'s time, the King of Hejian and Mao Sheng gathered passages on music from the Offices of Zhou and various masters to compose the Record of Music.',
  ],
  s0069: [
    'Wang Ding, assistant director of the palace, transmitted it to Changshan Wang Yu.',
    'Wang Ding, assistant director of the palace, transmitted it to Changshan Wang Yu.',
  ],
  s0070: [
    'Liu Xiang collated books and obtained twenty-three chapters of the Record of Music, differing from Yu\'s version.',
    'Liu Xiang collated books and found twenty-three chapters of the Record of Music, differing from Yu\'s version.',
  ],
  s0071: [
    'In Xiang\'s Separate Record there were four chapters of Music Odes and Songs, seven chapters of Master Zhao\'s Elegant Zither, eight chapters of Master Shi\'s Elegant Zither, and 106 chapters of Master Long\'s Elegant Zither.',
    'In Xiang\'s Separate Record were four chapters of Music Odes and Songs, seven of Master Zhao\'s Elegant Zither, eight of Master Shi\'s Elegant Zither, and 106 of Master Long\'s Elegant Zither.',
  ],
  s0072: [
    'Only these.',
    'Only these survived.',
  ],
  s0073: [
    'The Jin Central Canon Catalogue has no music books further; what the Separate Record listed has already perished and been lost.',
    'The Jin Central Canon Catalogue lists no further music books; what the Separate Record recorded is already lost.',
  ],
  s0074: [
    'Considering that at the beginning of Han the canonical statutes were extinguished, the various Ru gathered stray texts from ditches and walls; any fragmentary surviving passage related to ritual affairs was arranged as ritual—all not the words of sages.',
    'At the beginning of Han the canonical statutes were lost; scholars gathered stray fragments from ditches and walls—any scrap related to ritual was arranged as ritual, though none were the words of sages.',
  ],
  s0075: [
    'Monthly Ordinance was taken from Master Lü\'s Spring and Autumn; Doctrine of the Mean, Record of Conduct, Record of Mourning, and Black Robe were taken from Master Zisi; Record of Music was taken from Gongsun Ni; Record of the Bow is a jumbled remnant—not a canonical book of proper scope.',
    'Monthly Ordinance came from Master Lü\'s Spring and Autumn; Doctrine of the Mean, Record of Conduct, Record of Mourning, and Black Robe from Master Zisi; Record of Music from Gongsun Ni; Record of the Bow is a jumbled remnant—not a canonical text of proper scope.',
  ],
  s0076: [
    'Ritual is urgent for personal conduct and governing the state, so former scholars had no choice but to patch and join to supply what practice required.',
    'Ritual is urgent for personal conduct and statecraft, so earlier scholars had no choice but to patch and supplement what practice required.',
  ],
  s0077: [
    'Music books treat great affairs but are slow in use; unless one meets a reverent and enlightened lord, a founding ruler, one does not see them discussed in detail.',
    'Music treats great affairs but is slow to put into practice; unless one meets a reverent and enlightened sovereign, it is rarely discussed in detail.',
  ],
  s0078: [
    'Since the Han house, lords were not reverent and enlightened, and music was not an urgent matter for ministers—therefore few spoke of it.',
    'Since Han, rulers were seldom reverent and enlightened, and music was no urgent concern for ministers—so few spoke of it.',
  ],
  s0079: [
    'Your Majesty, with utmost sage virtue, corresponds to the token of music\'s elevation—you should truly make music to honor virtue and in the Yin season offer to the Lord on High.',
    'Your Majesty, with utmost sage virtue, bears the token of music\'s elevation—you should make music to honor virtue and in the Yin season offer to the Lord on High.',
  ],
  s0080: [
    'Yet music books are lost and gone; searching records, there is nowhere to turn.',
    'Yet the music books are lost; searching the records, there is nowhere to turn.',
  ],
  s0081: [
    'You should select various students and assign them to search the classics, histories, and hundred schools—every matter of music, great or small, should be separately compiled and recorded.',
    'Select students and assign them to search the classics, histories, and hundred schools—every matter of music, great or small, should be compiled and recorded separately.',
  ],
  s0082: [
    'Then commission one veteran scholar to compose a music book, to raise up a thousand-year broken text and fix the music of the great beam.',
    'Then commission one veteran scholar to compose a music book, reviving a thousand-year lost text and establishing the music of the great beam.',
  ],
  s0083: [
    'Let Five Splendors feel shame, let Six Stalks rise in embarrassment."',
    'Let Five Splendors feel shame and Six Stalks blush with embarrassment."',
  ],
  s0084: [
    'At that time seventy-eight houses responded on music; most drew on citations and expanded their words broadly—all said music should be changed, but none said how to change music.',
    'Seventy-eight scholars responded on music; most cited sources at length—all said music should be reformed, but none said how to reform it.',
  ],
  s0085: [
    'The Emperor, being himself skilled in bells and pitch, knew old affairs in detail, and thereupon fixed ritual and music himself.',
    'The Emperor, himself skilled in bells and pitch and knowing old affairs in detail, thereupon fixed ritual and music on his own authority.',
  ],
  s0086: [
    'He also established four instruments and named them "Tong."',
    'He also created four instruments and named them Tong.',
  ],
  s0087: [
    'The Tong\'s sounding chamber was nine inches wide; its sounding board nine feet long; the bridge one inch and two fen high.',
    'The Tong\'s sounding chamber was nine inches wide, its sounding board nine feet long, and the bridge one inch and two fen high.',
  ],
  s0088: [
    'On each Tong three strings were mounted.',
    'Each Tong carried three strings.',
  ],
  s0089: [
    'First, the Dark Splendor Tong: the Yingzhong string used 142 threads, length four feet seven inches and a strong fraction;',
    'First, the Dark Splendor Tong: the Yingzhong string used 142 threads, length four feet seven inches and a strong fraction;',
  ],
  s0090: [
    'the Huangzhong string used 270 threads, length nine feet;',
    'the Huangzhong string used 270 threads, length nine feet;',
  ],
  s0091: [
    'the Dalü string used 252 threads, length eight feet four inches and a weak fraction.',
    'the Dalü string used 252 threads, length eight feet four inches and a weak fraction.',
  ],
  s0092: [
    'Second, the Green Yang Tong: the Taicu string used 240 threads, length eight feet;',
    'Second, the Green Yang Tong: the Taicu string used 240 threads, length eight feet;',
  ],
  s0093: [
    'the Jiazhong string used 224 threads, length seven feet five inches weak;',
    'the Jiazhong string used 224 threads, length seven feet five inches weak;',
  ],
  s0094: [
    'the Guxian string used 214 threads, length seven feet one inch and one fen strong.',
    'the Guxian string used 214 threads, length seven feet one inch and one fen strong.',
  ],
  s0095: [
    'Third, the Vermilion Brightness Tong: the Zhonglü string used 199 threads, length six feet six inches and six fen weak;',
    'Third, the Vermilion Brightness Tong: the Zhonglü string used 199 threads, length six feet six inches and six fen weak;',
  ],
  s0096: [
    'the Ruibin string used 189 threads, length six feet three inches and two fen strong;',
    'the Ruibin string used 189 threads, length six feet three inches and two fen strong;',
  ],
  s0097: [
    'the Linzhong string used 180 threads, length six feet.',
    'the Linzhong string used 180 threads, length six feet.',
  ],
  s0098: [
    'Fourth, the White Storehouse Tong: the Yize string used 168 threads, length five feet six inches and two fen weak;',
    'Fourth, the White Storehouse Tong: the Yize string used 168 threads, length five feet six inches and two fen weak;',
  ],
  s0099: [
    'the Nanlü string used 160 threads, length five feet three inches and two fen very strong;',
    'the Nanlü string used 160 threads, length five feet three inches and two fen very strong;',
  ],
  s0100: [
    'the Wushe string used 149 threads, length four feet nine inches and nine fen strong.',
    'the Wushe string used 149 threads, length four feet nine inches and nine fen strong.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-013-batch1.mjs <translation.json>');
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
