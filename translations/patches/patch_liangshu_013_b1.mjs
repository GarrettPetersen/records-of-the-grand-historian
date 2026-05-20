#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 13, Biographies 7',
    'Book of Liang, Volume 13, Biographies 7',
  ],
  s0002: [
    'Fan Yun; Shen Yue',
    'Fan Yun; Shen Yue',
  ],
  s0003: [
    'Fan Yun, styled Yanlong, was a native of Wuyin in Nanxiang, sixth-generation descendant of Jin\'s Pacifier of the North General Wang.',
    'Fan Yun, styled Yanlong, came from Wuyin in Nanxiang—a sixth-generation descendant of Jin\'s Pacifier of the North, Wang.',
  ],
  s0004: [
    'At eight he met Song\'s Inspector of Yuzhou Yin Yan on the road; Yan was struck by him and had him sit; Yun\'s bearing and replies were as if no one else were there.',
    'At eight he met Yin Yan, Song\'s Yuzhou inspector, on the road; Yan was amazed and asked him to sit; Yun answered with easy grace, as though the crowd were empty.',
  ],
  s0005: [
    'Yan had him compose a poem; he took up the brush and finished at once—the company marveled.',
    'Yan asked him to write a poem; he took brush and finished on the spot, and all who sat there sighed in wonder.',
  ],
  s0006: [
    'He once studied with his kinsman Yuan Zhao and did not slacken day or night.',
    'He studied under his kinsman Yuan Zhao, laboring day and night without rest.',
  ],
  s0007: [
    'Zhao stroked his back and said, "Your spirit is bright and clear, and you study without cease—you have the makings of a chief minister.',
    'Zhao stroked his back and said, "Your spirit shines, and you study without rest—you are minister material.',
  ],
  s0008: [
    '" In youth he was quick-witted and discerning, skilled at literary composition and at letters; whatever he wrote came out at once, never with a fixed draft—men often suspected he had prepared the piece overnight.',
    '" As a boy he was sharp and far-seeing, good at prose and at correspondence; his pen never paused for a draft, and contemporaries often thought he must have written the piece the night before.',
  ],
  s0009: [
    'His father Kang was a staff officer in the Ying headquarters; Yun followed his father to the post, when Wu-xing\'s Shen Yue and Xinye\'s Yu Gao, who served with Kang in the same office, saw him and befriended him.',
    'His father Kang served on the Ying staff; Yun went with him, and Shen Yue of Wu-xing and Yu Gao of Xinye, who shared Kang\'s office, met him and became his friends.',
  ],
  s0010: [
    'He first entered office as Western Bureau secretary in Yingzhou, then was transferred to acting legal-affairs staff officer.',
    'He began as Yingzhou western bureau secretary, then became acting legal-affairs staff officer.',
  ],
  s0011: [
    'Before long Shen Youzhi raised troops and besieged Ying city; Kang was then the headquarters chief clerk and entered the city to hold it fast, leaving his household outside.',
    'Soon Shen Youzhi rebelled and besieged Ying; Kang, as headquarters chief clerk, went into the city to defend it and left his family outside the walls.',
  ],
  s0012: [
    'Yun was taken by the besiegers; Youzhi summoned him to speak, his voice and face fierce, yet Yun\'s countenance did not change as he slowly made his case.',
    'Yun was seized by Youzhi\'s soldiers; Youzhi called him in, harsh in voice and face, but Yun\'s expression never shifted as he pleaded his case at leisure.',
  ],
  s0013: [
    'Youzhi then laughed and said, "You are surely a promising boy. For now, go to the barracks.',
    'Youzhi laughed and said, "You are surely a boy who will amount to something. Go back to quarters for now.',
  ],
  s0014: [
    '" The next morning he summoned him again and ordered him to carry a letter into the city.',
    '" Next day he called him again and sent him into the city with a message.',
  ],
  s0015: [
    'Some inside the city wished to execute him; Yun said, "My aged mother and young brother hang on Shen\'s mercy; if I disobey his order, disaster will reach my kin—today I go to the blade, and my heart is as mustard greens."',
    'Men in the city wanted to kill him; Yun said, "Mother and brother depend on the Shen clan; defy him and kin will suffer—let me die today, and I am content."',
  ],
  s0016: [
    'Chief clerk Liu Shilong had long been friendly with Yun and secured his release.',
    'Chief clerk Liu Shilong, who had always been close to Yun, had him spared.',
  ],
  s0017: [
    'Early in Qi\'s Jianyuan era the Prince of Jingling, Zi Liang, was prefect of Kuaiji; Yun first followed the prince, who did not yet know him.',
    'At the start of Qi\'s Jianyuan reign the Prince of Jingling, Zi Liang, held Kuaiji; Yun joined his suite before the prince had noticed him.',
  ],
  s0018: [
    'Once, touring Mount Qinwang, the prince sent men to read an inscription on stone; none could make it out, but Yun alone recited it; the prince was pleased, and from then on Yun stood first in favor throughout the princely household.',
    'On a visit to Mount Qinwang the prince had the carved stone read; no one could decipher it until Yun recited it whole; the prince delighted in him, and thereafter Yun led the court of the prince\'s house.',
  ],
  s0019: [
    'When the prince became metropolitan governor, Yun was summoned as chief clerk and drawn into deep trust.',
    'When the prince became metropolitan governor he made Yun chief clerk and trusted him deeply.',
  ],
  s0020: [
    'Once, on an audience with Qi Emperor Gao, someone presented a white crow; the emperor asked what omen this was.',
    'On one audience with Qi Emperor Gao a white crow was offered; the emperor asked what sign it portended.',
  ],
  s0021: [
    'Yun, lowest in rank, answered last: "I have heard that when a king honors his ancestral temples, the white crow comes.',
    'Yun, last in rank because he stood low, answered: "I have heard that when a true king reveres his ancestral shrines, the white crow appears.',
  ],
  s0022: [
    '" The temple rites had just been completed.',
    '" The court had only just finished paying temple homage.',
  ],
  s0023: [
    'The emperor said, "You speak rightly.',
    'The emperor said, "Your words are right.',
  ],
  s0024: [
    'Can the logic of resonance reach so far!',
    'Can responsive principle run so deep!',
  ],
  s0025: [
    '" He was transferred to supplemental staff officer for criminal matters under the Prince of Northern Campaign\'s southern commandery, retaining his chief-clerk post; he was promoted to palace bureau director within the secretariat.',
    '" He became supplemental criminal-affairs officer to the southern commandery prince of the northern campaign, still chief clerk, then rose to secretariat palace bureau director.',
  ],
  s0026: [
    'When Zi Liang became Minister of Education, Yun was again made record-keeper staff officer, then given regular attendant of the scattered cavalry and charge as grand coordinator of the province.',
    'When Zi Liang became minister of education Yun was record-keeper on his staff, then regular scattered-cavalry attendant and head of the provincial grand coordinator\'s office.',
  ],
  s0027: [
    'He went out as interior magistrate of Lingling; in office he kept himself clean, cut redundant rules, and abolished pleasure spending—the people were at peace.',
    'He went out as Lingling interior magistrate, lived plainly, stripped away petty regulations and travel costs, and the district rested easy under him.',
  ],
  s0028: [
    'Emperor Ming recalled him to the capital; when he arrived he was made regular attendant of the scattered cavalry.',
    'Emperor Ming called him back to court; on arrival he was made regular scattered-cavalry attendant.',
  ],
  s0029: [
    'He went out again as interior magistrate of Shixing.',
    'He went out again as Shixing interior magistrate.',
  ],
  s0030: [
    'The commandery held many powerful clans; when a magistrate of two thousand bushels displeased them, they plotted to kill him—or, failing that, to drive him out.',
    'The prefecture teemed with great houses; when a two-thousand-bushel magistrate failed them, they plotted murder, or else expulsion.',
  ],
  s0031: [
    'On the frontier barbarians and Liao peoples abounded, and bandits were especially numerous; earlier magistrates had all gone armed.',
    'The border swarmed with tribal peoples and thieves; every prior magistrate had marched with weapons.',
  ],
  s0032: [
    'When Yun entered his post he ruled by kindness and trust, abolished watch-posts, and merchants slept in the open—the commandery called him a spirit.',
    'Yun entered and ruled with grace, lifted the guard posts, and traders camped in the open road; the district hailed him as divine.',
  ],
  s0033: [
    'He was soon promoted acting commissioner, General Who Establishes Martial Glory, Colonel Pacifying the Yue, and inspector of Guangzhou.',
    'Soon he held acting credentials, was General Who Establishes Martial Glory, colonel pacifying the Yue, and Guangzhou inspector.',
  ],
  s0034: [
    'Earlier Yun had been close to Vice Director of the Masters of Writing Jiang You; You\'s cousin on his mother\'s side, Xu Yi, was magistrate of Qujiang, and Jiang deeply entrusted him to Yun.',
    'Yun had been friendly with vice director Jiang You; You\'s maternal cousin Xu Yi was Qujiang magistrate, and Jiang pressed Yun to watch over him.',
  ],
  s0035: [
    'A certain Tan Yan, a powerful man of the county, was flogged by Yi; Yan took it as shame and went to the capital to accuse Yun; Yun was recalled and imprisoned, then freed when an amnesty was declared.',
    'Tan Yan, a county magnate, was beaten by Yi; shamed, he went to the capital to denounce Yun, who was recalled, jailed, and released by general pardon.',
  ],
  s0036: [
    'In the second year of Yongyuan he was made erudite of the National University.',
    'In Yongyuan year two he was made national university erudite.',
  ],
  s0037: [
    'Earlier Yun had met Gaozu at the residence of Qi\'s Prince of Jingling, Zi Liang, and had also been a neighbor; Gaozu prized him deeply.',
    'Long before, Yun had met Gaozu at Prince of Jingling Zi Liang\'s mansion and had lived near him; Gaozu held him in high regard.',
  ],
  s0038: [
    'When the righteous army reached the capital, Yun was inside the walls.',
    'When the righteous army came to the capital Yun was still within the city.',
  ],
  s0039: [
    'After Dong Hun was killed, Attendant Within Zhang Ji had Yun carry orders out of the city; Gaozu kept him and made him counsel in the command tent, then Yellow Gate Attendant—he and Shen Yue worked as one heart to support the throne.',
    'Dong Hun fell; Zhang Ji sent Yun out of the city with orders; Gaozu detained him for his war council, made him yellow gate attendant, and he and Shen Yue joined in loyal support.',
  ],
  s0040: [
    'Soon he was promoted to staff officer of the Grand Marshal\'s advisory section with charge of registry affairs.',
    'Soon he was grand marshal advisory staff officer in charge of registry.',
  ],
  s0041: [
    'When the Liang regime was established he was made attendant within.',
    'When the Liang court was set up he became attendant within.',
  ],
  s0042: [
    'At the time Gaozu took Dong Hun\'s former consort, which somewhat hindered state affairs; Yun spoke of it more than once, but his words were not adopted.',
    'Gaozu had taken Dong Hun\'s former consort, and it tangled government; Yun spoke against it repeatedly, without success.',
  ],
  s0043: [
    'Later, entering the sleeping quarters with Wang Mao, Yun remonstrated again: "Of old, when Han\'s founding ancestor dwelt east of the mountains, he was greedy for goods and fond of women; when he entered the passes and pacified Qin, he seized no wealth and kept no woman—Fan Zeng took that as proof his ambition was great.',
    'Later he went into the inner quarters with Wang Mao and urged again: "Han\'s founding ancestor, east of the mountains, loved gold and women; once he entered the passes and settled Qin he touched no treasure and kept no woman—Fan Zeng read that as greatness of purpose.',
  ],
  s0044: [
    'Now, Illustrious Lord, you have only just settled the realm; all within the seas look to your reputation—how can you tread the path of a dissolute age and let a woman\'s charm weigh you down?"',
    'Now you have only just won the realm; the world watches your bearing—why repeat the tracks of a ruined court and let a woman\'s grace become your burden?"',
  ],
  s0045: [
    'Wang Mao rose and bowed: "Fan Yun speaks rightly; you must keep the realm in mind and should not hold back for sentiment."',
    'Wang Mao stood and bowed: "Fan Yun is right; the lord must think of the realm and must not cling to private feeling."',
  ],
  s0046: [
    'Gaozu was silent.',
    'Gaozu said nothing.',
  ],
  s0047: [
    'Yun at once memorialized to have the former consort given to Mao as a reward; Gaozu admired his intent and agreed.',
    'Yun promptly memorialized to grant the former consort to Mao; Gaozu praised his purpose and assented.',
  ],
  s0048: [
    'The next day he bestowed on Yun and Mao a hundred thousand cash each.',
    'Next day he gave Yun and Mao each a hundred thousand in cash.',
  ],
  s0049: [
    'In the first year of Tianjian, Gaozu received the abdication; at the southern suburb he offered the fire sacrifice, with Yun as attendant within riding in the secondary carriage.',
    'In Tianjian year one Gaozu took the throne; at the southern suburb fire rite Yun rode as attendant within in the secondary carriage.',
  ],
  s0050: [
    'When the rites ended Gaozu ascended the imperial carriage and said to Yun, "For me today is what they call driving six horses with rotten rope."',
    'When the ceremony ended Gaozu mounted the imperial carriage and told Yun, "Today I am like a man driving six horses on rotted reins."',
  ],
  s0051: [
    'Yun replied, "I also hope Your Majesty will be more cautious day by day."',
    'Yun answered, "I only wish Your Majesty would grow more careful with each passing day."',
  ],
  s0052: [
    'Gaozu was pleased.',
    'Gaozu approved his words.',
  ],
  s0053: [
    'That day he was made regular attendant of the scattered cavalry and Minister of Personnel;',
    'That day he became regular scattered-cavalry attendant and minister of personnel;',
  ],
  s0054: [
    'for his merit in founding the state he was enfeoffed as Marquis of Xiaocheng with a fief of one thousand households.',
    'for founding merit he was made marquis of Xiaocheng with one thousand households.',
  ],
  s0055: [
    'Yun, raised for old friendship beyond his station in founding the state, gave his utmost in loyal service and did whatever he could.',
    'Lifted by old favor above his peers in the founding enterprise, Yun served with full loyalty and never held back.',
  ],
  s0056: [
    'Gaozu also gave him his full trust; what he memorialized was mostly approved.',
    'Gaozu in turn trusted him completely; most of what he submitted was granted.',
  ],
  s0057: [
    'Once at a banquet Gaozu said to the Prince of Linchuan, Hong, and the Prince of Poyang, Hui: "In youth Fan, our Minister of Personnel, and I were close; we extended the courtesies of the four seas;',
    'At one feast Gaozu told Princes Hong of Linchuan and Hui of Poyang: "Minister Fan and I were intimate in youth—we honored one another as the realm demands;',
  ],
  s0058: [
    'now that I am master of the realm this ceremony is changed—you should call Fan elder brother in my place."',
    'now I am sovereign and that rite is gone—you should call Fan elder brother for me."',
  ],
  s0059: [
    'The two princes left their seats to bow; they returned with Yun in the same carriage to the Ministry of Personnel offices below court—men of the time counted it glory.',
    'Both princes rose, bowed, and rode back with Yun to the personnel ministry—contemporaries called it honor.',
  ],
  s0060: [
    'That year the Eastern Palace was established; Yun retained his office and also became crown prince senior mentor; soon he was Vice Director of the Masters of Writing, still holding Personnel.',
    'That year the heir apparent was installed; Yun kept his post and became crown prince senior mentor, then vice director of the masters of writing while still heading personnel.',
  ],
  s0061: [
    'Before long, for violating an edict in making appointments, he was removed from Personnel but remained vice director.',
    'Soon, for appointing men against imperial order, he lost personnel but kept the vice directorship.',
  ],
  s0062: [
    'Yun was warm by nature and treated his widowed sister-in-law with full ritual; household matters he always consulted her on before acting.',
    'By nature he was dutiful and affectionate; he observed every courtesy toward his widowed sister-in-law and never acted at home until he had asked her.',
  ],
  s0063: [
    'He loved restraint and the unusual and devoted himself to others\' urgent needs.',
    'He cherished integrity and the extraordinary and threw himself into others\' crises.',
  ],
  s0064: [
    'In youth he had been close to the leading army chief clerk Wang Kai; when Kai died in the official residence, poor and without a dwelling, Yun brought the coffin home himself.',
    'As a young man he was close to leading-army chief clerk Wang Kai; Kai died in his government quarters, destitute, without a house, and Yun brought the bier home.',
  ],
  s0065: [
    'He personally arranged the encoffining.',
    'He oversaw the burial rites himself.',
  ],
  s0066: [
    'Toward the Prince of Jingling, Zi Liang, his courtesy was very deep; whenever Yun offered advice on gain and loss he never flattered.',
    'He owed the Prince of Jingling, Zi Liang, deep courtesy; every memorial of profit and loss he sent was free of flattery.',
  ],
  s0067: [
    'Zi Liang once memorialized to Qi Emperor Wu on Yun\'s service as magistrate.',
    'Zi Liang once wrote Qi Emperor Wu recommending Yun for a prefecture.',
  ],
  s0068: [
    'The emperor said, "A mediocrity—I hear he and the prince constantly show off to each other; we need not press the law; let us spare him by sending him far away."',
    'The emperor said, "A commonplace fellow—I hear he and the prince forever play to the gallery; no need to pursue the law—send him far off and be done."',
  ],
  s0069: [
    'Zi Liang said, "That is not so.',
    'Zi Liang said, "Not so.',
  ],
  s0070: [
    'Yun always counsels and admonishes; his remonstrance letters all survive—please have them brought for memorial."',
    'Yun always advises and remonstrates; the letters remain—let them be submitted."',
  ],
  s0071: [
    'When they arrived there were more than a hundred sheets, every word sharp and direct.',
    'They came to more than a hundred pages, each line blunt and true.',
  ],
  s0072: [
    'The emperor sighed and said to Zi Liang, "I did not expect Yun could be like this.',
    'The emperor sighed and told Zi Liang, "I never thought Yun could be such a man.',
  ],
  s0073: [
    'He should assist you—why send him out to guard a commandery?"',
    'Let him aid you at court—why make him go defend a district?"',
  ],
  s0074: [
    'Qi\'s Wenhuai Crown Prince once went to the eastern fields to watch the harvest and said to the guests, "Cutting this too is quite a sight."',
    'Qi\'s Wenhuai crown prince once went to the eastern estate to watch reaping and told the guests, "This cutting is worth seeing too."',
  ],
  s0075: [
    'All murmured agreement.',
    'Everyone murmured assent.',
  ],
  s0076: [
    'Yun alone said, "The three seasons\' labor is truly long toil.',
    'Yun alone said, "The work of the three seasons is real, lasting labor.',
  ],
  s0077: [
    'I beg Your Highness to know the hardship of sowing and reaping and not indulge a single morning\'s ease."',
    'I beg Your Highness to know how hard grain is won, and not chase one morning\'s pleasure."',
  ],
  s0078: [
    'After they left, Attendant Within Xiao Mian, who had not known him before, took his hand at the carriage and said, "I did not expect to hear loyal speech again today."',
    'Afterward attendant within Xiao Mian, a stranger to him before, grasped his hand at the carriage and said, "I never thought to hear honest counsel again today."',
  ],
  s0079: [
    'When he held the selection office, his posts were weighty; documents piled on his desk and guests filled his gate, yet Yun answered as if flowing water, never blocked; official papers he opened and judged like a spirit—men of the time all admired his clarity.',
    'In charge of appointments his posts were heavy; papers overflowed his desk and guests crowded his door, yet he answered without delay; he sifted official documents with uncanny speed, and all who saw it marveled at his brilliance.',
  ],
  s0080: [
    'By nature he was rather sharp and lacked gravitas; when he approved or disapproved he showed it at once—scholars sometimes thought less of him for it.',
    'He was quick-tempered and light on ceremony; right and wrong showed on his face in the moment, and some gentlemen held that against him.',
  ],
  s0081: [
    'At first, when Yun held a commandery he was famed for integrity; once he rose to high rank he rather freely accepted gifts;',
    'As magistrate he had been famed for clean hands; in high office he accepted presents more freely;',
  ],
  s0082: [
    'yet his house held no stores, and he gave everything away to kin and friends.',
    'yet he kept nothing in the house and scattered it all among kin and friends.',
  ],
  s0083: [
    'In the second year he died, aged fifty-three.',
    'In year two he died at fifty-three.',
  ],
  s0084: [
    'Gaozu wept for him and that same day went in person to his mourning hall.',
    'Gaozu wept and went himself that very day to the mourning hall.',
  ],
  s0085: [
    'An edict said, "To pursue the distant and raise lament is feeling men hold deep;',
    'The edict read, "To honor the departed and mourn is what feeling demands;',
  ],
  s0086: [
    'how much more when reputation still stands and the matter touches the court\'s trust!"',
    'how much more when renown still lives and the throne leaned on the man!"',
  ],
  s0087: [
    'The late Regular Attendant of the Scattered Cavalry, Vice Director of the Masters of Writing, Marquis of Xiaocheng Yun—his capacity and bearing were upright, his thought ranged far; from his first resolve his conduct was heard of.',
    'The late regular scattered-cavalry attendant, vice director of the masters of writing, Marquis of Xiaocheng Yun—upright in talent and bearing, far-reaching in mind; from his first vow his walk was known.',
  ],
  s0088: [
    'Removing his scarf to enter service, his clean record still showed.',
    'He doffed the scholar\'s scarf for office, and his clear record endured.',
  ],
  s0089: [
    'Harmonizing affairs at court, the gaze of all was granted him.',
    'He balanced court affairs, and every eye trusted him.',
  ],
  s0090: [
    'In close support his righteousness was plain to my heart; though his toil did not wear the traces of the carriage-team, we were old companions in counsel.',
    'He wove close support; his loyalty was plain to me—though his labor did not show in the traces of the chariot shaft, we were long friends in counsel.',
  ],
  s0091: [
    'He was about to run the long road and forever aid common government;',
    'He was to run the long course and forever aid the realm;',
  ],
  s0092: [
    'suddenly death came, and grief wounds my breast.',
    'suddenly he fell, and grief cuts my breast.',
  ],
  s0093: [
    'Rank and rites should be added to complete the grand precedent.',
    'Let rank and rites be raised to fulfill the great canon.',
  ],
  s0094: [
    'He may be posthumously made Attendant Within and Defender General, with Vice Director and Marquis as before.',
    'Posthumously make him attendant within and defender general, vice director and marquis unchanged.',
  ],
  s0095: [
    'Grant also one suite of drums and pipes."',
    'Grant one suite of drums and pipes as well."',
  ],
  s0096: [
    'The ritual officers requested the posthumous name Xuan; an edict bestowed the name Wen.',
    'The ritualists proposed posthumous name Xuan; an edict gave Wen.',
  ],
  s0097: [
    'He left a collected works in thirty scrolls.',
    'His collected works ran to thirty scrolls.',
  ],
  s0098: [
    'His son Xiaocai inherited the title and rose to crown prince household aide.',
    'His son Xiaocai succeeded and reached crown prince household aide.',
  ],
  s0099: [
    'Shen Yue, styled Xiucai, was a native of Wukang in Wu-xing.',
    'Shen Yue, styled Xiucai, came from Wukang in Wu-xing.',
  ],
  s0100: [
    'His grandfather Linzi was Song\'s General Who Subdues the Barbarians.',
    'His grandfather Linzi had been Song\'s general who subdues the barbarians.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_013_b1.mjs <translation.json>'
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
