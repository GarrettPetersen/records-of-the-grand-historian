#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On gengshen day, Ji\'s general Hou Rui led troops along the mountains intending to advance and seize ground; Ren Yue and Xie Daren fought them and defeated them.',
    'On gengshen day, Ji\'s general Hou Rui led men along the ridges to push forward; Ren Yue and Xie Daren met them in battle and broke them.',
  ],
  s0102: [
    'Shortly afterward Lu Na was pacified; all armies advanced west together, and Emperor Yuan again wrote to Ji: "Great hardship, Great Wisdom!',
    'Soon Lu Na was subdued and every army marched west; Emperor Yuan wrote again to Ji: "How you must suffer, Great Wisdom!',
  ],
  s0103: [
    'Late-season oppressive heat, flowing gold and burning stone, gathered mosquitoes becoming thunder, foxes in abundance for a thousand li—with this jade body, hard labor in the battle lines.',
    'Late summer scorches until metal runs and stone glows; mosquitoes swarm like thunder and foxes haunt the hills for a thousand li—yet you wear this royal frame through the camps.',
  ],
  s0104: [
    'Turning my gaze west, what is my weariness?',
    'I look west and wonder—what toll has this taken on me?',
  ],
  s0105: [
    'Since the Xiongnu scoundrels overran the realm and the Jie barbarians rebelled and defected, I am a day older in years, and fate gave me the merit of pacifying disorder—bearing this willing elevation, the matter belongs to the one who should receive the jade disk.',
    'Since the northern scourge overran the land and the Jie turned traitor, I am the elder by a day and was given the work of quelling chaos—heaven\'s choice fell to me, and the jade scepter is mine to hold.',
  ],
  s0106: [
    'If you would send envoys, that is what I have long awaited.',
    'If you would send envoys, that is what I have waited for.',
  ],
  s0107: [
    'If you say otherwise, I lay down my brush here.',
    'If not, I set down my brush here and say no more.',
  ],
  s0108: [
    'Brotherly affection among brothers, shared form and common breath.',
    'Brothers should be friends—one body, one breath.',
  ],
  s0109: [
    'The elder brother fat, the younger thin—no more season of taking turns;',
    'One brother grows stout while the other wastes away—we shall never take turns again;',
  ],
  s0110: [
    'Yielding jujubes and pushing pears—forever ended days of joy.',
    'No more yielding jujubes or pushing pears—the days of shared delight are gone.',
  ],
  s0111: [
    'In Shanglin Park, quietly seated, hearing the mournful cries of four birds;',
    'In Shanglin I sit in stillness and hear four birds cry in mourning;',
  ],
  s0112: [
    'In the Xuan Chamber unrolling the scrolls, sighing at the Founder\'s long departure.',
    'In the Xuan Chamber I unroll the maps and grieve that our Founder\'s life has long fled.',
  ],
  s0113: [
    'The heart loves indeed—the letter cannot exhaust the words.',
    'My heart is full of love, yet ink cannot say it all.',
  ],
  s0114: [
    '" Great Wisdom was Ji\'s alternate style.',
    '" "Great Wisdom" was Ji\'s courtesy name.',
  ],
  s0115: [
    'Ji sent his appointed Minister of Revenue Le Fengye to Jiangling to discuss plans for reconciliation, intending to return to Shu according to the earlier terms.',
    'Ji sent his Minister of Revenue Le Fengye to Jiangling to negotiate peace and return to Shu on the old terms.',
  ],
  s0116: [
    'Emperor Yuan knew Ji would surely be defeated, and so refused and would not agree.',
    'Emperor Yuan knew Ji was doomed and refused outright.',
  ],
  s0117: [
    'On bingxu day, the people of Baxiing Fu Sheng, Xu Zichu, and others beheaded Ji\'s Xiakou garrison commander Gongsun Huang and surrendered to the allied armies.',
    'On bingxu day, Fu Sheng and Xu Zichu of Baxiing cut down Xiakou commander Gongsun Huang and surrendered to the host.',
  ],
  s0118: [
    'Wang Lin, Song Zao, Ren Yue, Xie Daren, and others then advanced against Hou Rui, captured his three forts, and more than ten cities on both banks then all surrendered.',
    'Wang Lin, Song Zao, Ren Yue, and Xie Daren pressed Hou Rui, took his three ramparts, and more than ten cities on both shores submitted at once.',
  ],
  s0119: [
    'General Fan Meng captured Ji and his third son Yuanman, and both were killed at Xiakou—aged forty-six.',
    'General Fan Meng seized Ji and his third son Yuanman and killed them both at Xiakou; Ji was forty-six.',
  ],
  s0120: [
    'The relevant offices memorialized requesting severance from the clan register; Emperor Yuan granted it and bestowed the surname Taotie.',
    'The court memorialized to strike him from the clan register; Emperor Yuan assented and gave the surname Taotie.',
  ],
  s0121: [
    'At first, when Ji was about to usurp the title, portents were not one alone.',
    'When Ji first planned to take the throne, omens multiplied.',
  ],
  s0122: [
    'The strangest: in the inner chamber of the Cypress Hall, nodes around pillar joints sprouted flowers—forty-six stems, luxuriant and lovely, shaped like lotus blossoms.',
    'Strangest of all, in the Cypress Hall\'s inner chamber the pillars put forth flowers at every joint—forty-six stems, soft and lovely as lotus blooms.',
  ],
  s0123: [
    'Those who understood said: "When Wang Dun\'s staff flowered, it was no good sign.',
    'Men versed in such things said, "When Wang Dun\'s staff bloomed, it foretold ruin.',
  ],
  s0124: [
    '" Ji\'s era name was Tianzheng, covertly matching Xiao Dong\'s; all said the character tian means "two men," and zheng means "one stop."',
    '" Ji\'s reign era was Tianzheng, echoing Xiao Dong\'s in secret; people read tian as "two men" and zheng as "one halt."',
  ],
  s0125: [
    'Dong and Ji each usurped titles for one year and were destroyed.',
    'Dong and Ji each reigned a single year before they perished.',
  ],
  s0126: [
    'Prince of Linhe Zhengde, styled Gonghe, was the third son of Prince Jinghui of Linchuan.',
    'Prince of Linhe Zhengde, styled Gonghe, was the third son of Prince Jinghui of Linchuan.',
  ],
  s0127: [
    'In youth he was coarse and dangerous, not bound by ritual propriety.',
    'As a youth he was rough and reckless and cared nothing for propriety.',
  ],
  s0128: [
    'At first, when Gaozu had no sons, he adopted him as a son.',
    'Early on, before Gaozu had a son of his own, he adopted Zhengde.',
  ],
  s0129: [
    'When Gaozu ascended the throne, Zhengde at once hoped for the heirship; later when the Zhaoming Heir Apparent was established, Zhengde was enfeoffed as Marquis of Xifeng with five hundred households.',
    'Once Gaozu took the throne, Zhengde coveted the heirship; when the Zhaoming Heir Apparent was named, Zhengde received only the marquisate of Xifeng—five hundred households.',
  ],
  s0130: [
    'From then he nursed resentment, constantly harboring rebellious intent, casting sidelong glances at the palace throne, hoping for calamity and change.',
    'Thereafter he brooded on slights, plotted treason, eyed the palace throne, and prayed for disaster.',
  ],
  s0131: [
    'In the sixth year of Putong, as Gentleman in Attendance at the Yellow Gate he became General of Light Chariots with a staff.',
    'In the sixth year of Putong he rose from Gentleman at the Yellow Gate to General of Light Chariots with a staff.',
  ],
  s0132: [
    'Shortly afterward he fled to Wei; the relevant offices memorialized to strip his titles and fiefs.',
    'Soon he fled to Wei; the court moved to strip his rank and fief.',
  ],
  s0133: [
    'In the seventh year he again fled back from Wei; Gaozu did not punish him.',
    'In the seventh year he slipped back from Wei; Gaozu let the matter pass.',
  ],
  s0134: [
    'His titles and fiefs were restored, and he was additionally made General Who Pacifies the Barbarians.',
    'His honors were restored and he was made General Who Pacifies the Barbarians.',
  ],
  s0135: [
    'In the fourth year of Zhongdatong he was Trustworthy Martial General and Administrator of Wu commandery.',
    'In the fourth year of Zhongdatong he served as Trustworthy Martial General and administrator of Wu commandery.',
  ],
  s0136: [
    'He was summoned as Attendant-in-Ordinary, General Who Pacifies the Army with staff, enfeoffed as Prince of Linhe commandery with two thousand households, and additionally made Left Guard General.',
    'He was recalled as Attendant-in-Ordinary and General Who Pacifies the Army, enfeoffed Prince of Linhe with two thousand households, and made Left Guard General besides.',
  ],
  s0137: [
    'Yet his ferocity and violence grew daily worse; he gathered fugitives and outlaws.',
    'His cruelty deepened by the day as he gathered fugitives and desperate men.',
  ],
  s0138: [
    'Hou Jing knew he had treacherous intent and secretly sent men to entice and persuade him, binding him with rich promises.',
    'Hou Jing sensed his treachery and secretly wooed him with lavish pledges.',
  ],
  s0139: [
    'He sent Zhengde a letter: "Today the Son of Heaven is aged, wicked ministers disorder the state, statutes err and edicts overturn—from Jing\'s view, defeat is counted in days.',
    'He wrote to Zhengde: "The Son of Heaven is old, corrupt ministers ruin the realm, law and order are upside down—in my reading, collapse comes within days.',
  ],
  s0140: [
    'Moreover the Great King by lineage should be heir, mid-course cast down in disgrace—the world\'s men of righteousness all secretly grieve; can Jing\'s dull loyalty fail to burn with indignation?',
    'You were born to the succession yet cast aside in shame—righteous men everywhere ache at it; can even my blunt loyalty stay cold?',
  ],
  s0141: [
    'Now the four seas tremble in fear and hearts turn to the Great King—can the Great King cling to private feeling and abandon these hundred millions!',
    'The realm trembles and hearts turn to you—will you choose private feeling over a hundred million lives?',
  ],
  s0142: [
    'Though Jing is no warrior, he truly means to rouse himself.',
    'I am no soldier, yet I mean to fight.',
  ],
  s0143: [
    'May the King grant this and match the people\'s need—discern this sincere pledge.',
    'Grant my plea, serve the people, and read this as honest intent.',
  ],
  s0144: [
    '" Zhengde read the letter and rejoiced greatly: "Hou Jing\'s intent secretly matches mine—Heaven approves.',
    '" Zhengde read it and exulted: "Hou Jing thinks as I do—Heaven is with us.',
  ],
  s0145: [
    '" He then agreed.',
    '" He agreed.',
  ],
  s0146: [
    'When Jing reached the Yangtze, Zhengde secretly dispatched empty boats, falsely claiming to gather reeds, to ferry Jing across.',
    'When Jing reached the river, Zhengde sent empty boats under the pretense of collecting reeds and ferried him across.',
  ],
  s0147: [
    'The court did not yet know his plot and still sent Zhengde to guard the Zhuque Bridge crossing.',
    'The court still knew nothing of the plot and sent Zhengde to hold the Zhuque crossing.',
  ],
  s0148: [
    'When Jing arrived, Zhengde led his army to advance with Jing; Jing set up Zhengde as Son of Heaven, changed the era to Zhengping year one, and made himself Chancellor.',
    'Jing came; Zhengde opened the gates and marched with him. Jing proclaimed Zhengde emperor, named the era Zhengping year one, and took the chancellorship himself.',
  ],
  s0149: [
    'When the capital fortress fell, the Taqing era name was restored and Zhengde was demoted to Grand Marshal.',
    'When the palace city fell, the Taqing era was restored and Zhengde was reduced to Grand Marshal.',
  ],
  s0150: [
    'Zhengde had resentful words; Jing heard and, fearing he might turn, forged an edict and killed him.',
    'Zhengde grumbled; Jing, fearing betrayal, forged an edict and had him killed.',
  ],
  s0151: [
    'Prince of Hedong Yu, styled Chongsun, was the Zhaoming Heir Apparent\'s second son.',
    'Prince of Hedong Yu, styled Chongsun, was the second son of the Zhaoming Heir Apparent.',
  ],
  s0152: [
    'In the second year of Putong he was enfeoffed as Duke of Zhijiang county.',
    'In the second year of Putong he was made Duke of Zhijiang county.',
  ],
  s0153: [
    'In the third year of Zhongdatong his fief was changed to Prince of Hedong commandery with two thousand households.',
    'In the third year of Zhongdatong he was re-enfeoffed Prince of Hedong commandery with two thousand households.',
  ],
  s0154: [
    'He was made General of Distant Peace and charged with the garrison affairs at Shitou.',
    'He was appointed General of Distant Peace and put in charge of the Shitou garrison.',
  ],
  s0155: [
    'He went out as Administrator of the two commanderies Langye and Pengcheng.',
    'He went out to govern Langye and Pengcheng commanderies.',
  ],
  s0156: [
    'Returning he was made Attendant-in-Ordinary, General of Light Chariots with staff.',
    'On return he became Attendant-in-Ordinary and General of Light Chariots with a staff.',
  ],
  s0157: [
    'He went out as General of the Southern Center and Inspector of Xiangzhou.',
    'He went out as General of the Southern Center and inspector of Xiangzhou.',
  ],
  s0158: [
    'Before long Hou Jing raided the capital; Yu led troops to rescue, reached Qingcao Lake; the fortress fell, an edict ordered withdrawal, and Yu returned to his Xiang post.',
    'Soon Hou Jing struck the capital; Yu marched to relieve it, reached Qingcao Lake, then heard the city had fallen, received orders to withdraw, and returned to his post in Xiang.',
  ],
  s0159: [
    'At the time Emperor Yuan\'s army was at Wucheng; the newly appointed Inspector of Yongzhou Zhang Zuan secretly reported to Emperor Yuan: "Hedong has raised troops and Yueyang is stockpiling grain—together they are unrestrained and will strike Jiangling.',
    'Emperor Yuan was then at Wucheng; the new inspector of Yongzhou, Zhang Zuan, secretly warned him: "Hedong has risen and Yueyang is hoarding grain—they plot mischief and mean to strike Jiangling.',
  ],
  s0160: [
    '" Emperor Yuan was greatly afraid; he returned by land routes, sent Adviser Zhou Hongzhi to Yu\'s headquarters to oversee his grain and troops.',
    '" Emperor Yuan was terrified; he slipped back by side roads and sent Adviser Zhou Hongzhi to Yu\'s camp to take command of grain and troops.',
  ],
  s0161: [
    'Yu said: "Each has his own army headquarters—why suddenly make one subordinate to another?"',
    'Yu said, "Each man has his own command—why suddenly place me under another?"',
  ],
  s0162: [
    '" Envoys went back and forth three times; Yu would not obey.',
    '" Three envoys came and went; Yu refused each time.',
  ],
  s0163: [
    'Emperor Yuan in great anger sent the Heir Fangdeng to campaign against him; instead Fangdeng was defeated and killed by Yu.',
    'Enraged, Emperor Yuan sent his heir Fangdeng against him; Yu defeated and killed him.',
  ],
  s0164: [
    'He again ordered Inspector of Xinzhou Bao Quan to attack Yu, and with a letter set forth fortune and disaster, promising he could turn to good.',
    'He then ordered Bao Quan, inspector of Xinzhou, to attack Yu, writing to show reward and ruin and offering a path to repentance.',
  ],
  s0165: [
    'Yu did not reply; he repaired and dredged the walls and moats, planning to resist and hold.',
    'Yu made no answer; he strengthened walls and moats and prepared to stand siege.',
  ],
  s0166: [
    'He said to Bao Quan: "A defeated general—where is the talk of bravery?',
    'He told Bao Quan, "A beaten general has no right to speak of courage.',
  ],
  s0167: [
    'If you wish to advance, advance—nothing more need be said.',
    'Advance if you will—say no more.',
  ],
  s0168: [
    '" Quan encamped at Shigu Temple; Yu led troops to strike him head-on, did not succeed and withdrew.',
    '" Quan camped at Shigu Temple; Yu led a counterattack, failed, and pulled back.',
  ],
  s0169: [
    'Quan advanced to Juzhou; Yu again attacked with all his elite troops and could not overcome him.',
    'Quan moved on Juzhou; Yu threw in every crack soldier and still could not break him.',
  ],
  s0170: [
    'When evening came the soldiers were worn and exhausted; Quan then sallied forth and routed them—three thousand heads cut, over ten thousand drowned.',
    'At dusk, with Yu\'s men spent, Quan counterstruck and shattered them—three thousand heads taken and more than ten thousand drowned.',
  ],
  s0171: [
    'Yu then burned the outer walls of Changsha, drove the residents inside the city, and Bao Quan crossed the army to besiege it.',
    'Yu burned Changsha\'s outer suburbs, herded the people within the walls, and Bao Quan brought his army across to invest the city.',
  ],
  s0172: [
    'Yu from youth was fierce and brave, possessed daring as well; he could comfort and lead soldiers and greatly won the troops\' hearts.',
    'Yu had been bold since boyhood, fearless and skilled at winning soldiers\' hearts.',
  ],
  s0173: [
    'Though besieged long, though inner and outer were cut off, defenses and holding remained firm.',
    'Besieged for months, cut off within and without, he still held firm.',
  ],
  s0174: [
    'Later Emperor Yuan again sent Commandant of the Army Wang Sengbian to replace Bao Quan in attacking Yu; Sengbian built earthen mounds overlooking the inner city, attacked bitterly day and night—arrows and stones like rain—more than half the officers and soldiers in the city were killed or wounded.',
    'Later Emperor Yuan sent Wang Sengbian, commandant of the army, to replace Bao Quan; Sengbian raised earthworks against the inner wall and assaulted day and night until arrows and stones fell like rain and more than half the garrison lay dead or wounded.',
  ],
  s0175: [
    'Yu in dire straits secretly fitted out sea boats, intending to break the siege and escape.',
    'Desperate, Yu secretly prepared sea boats to burst the siege and flee.',
  ],
  s0176: [
    'Just then his subordinate general Murong Hua led Sengbian into the city; Yu looked—his attendants had all scattered—he was seized, and said to his guards: "Do not kill me!',
    'Then his officer Murong Hua admitted Sengbian into the city; Yu\'s followers scattered and he was taken. He cried to his guards, "Do not kill me!',
  ],
  s0177: [
    'Let me see the Seventh Officer once and expose this slanderous villain—even death would hold no regret.',
    'Let me see the Seventh Officer once and denounce this slanderer—then I can die without regret.',
  ],
  s0178: [
    '" The officer in charge said: "By order it is not permitted.',
    '" The officer said, "My orders forbid it.',
  ],
  s0179: [
    '" He was then beheaded; the head was sent to the Jing post and Emperor Yuan returned the head for burial.',
    '" He was beheaded; the head was sent to the Jing garrison, and Emperor Yuan returned it for burial.',
  ],
  s0180: [
    'At first, when Yu was about to fall, he privately held up a mirror to his face and could not see his head;',
    'Before his fall, Yu once looked in a mirror and saw himself headless;',
  ],
  s0181: [
    'he also saw a tall man roofing a house, both hands on the ground peering into his study;',
    'he dreamed of a giant roofing a house, hands on the ground, staring into his hall;',
  ],
  s0182: [
    'he also saw a white dog large as a donkey leaving the city—whereabouts unknown.',
    'he also saw a white dog the size of a donkey leave the city and vanish.',
  ],
  s0183: [
    'Yu greatly hated these omens, and shortly the city fell.',
    'Yu loathed these signs; soon the city fell.',
  ],
  s0184: [
    'The historian writes: Xiao Zong and Xiao Zhengde both rebelled and raved in treason, bringing extinction on themselves—as they deserved.',
    'The historian writes: Xiao Zong and Xiao Zhengde were rebels and madmen who destroyed themselves—no more than they deserved.',
  ],
  s0185: [
    'In the Taqing calamity, Xiao Ji held the resources of Yong and Shu, yet did not hasten to the king\'s aid in crisis or fulfill a subject\'s and son\'s duty;',
    'In the Taqing disaster Xiao Ji held the wealth of Yong and Shu yet never rushed to the throne\'s rescue or kept a son\'s or subject\'s duty;',
  ],
  s0186: [
    'only after the bandit Jing was cut down did he at last raise troops—an army setting out without cause, completing his stain of disaster.',
    'only after Hou Jing was destroyed did he march—an army without just cause, sealing his own ruin.',
  ],
  s0187: [
    'Alas!',
    'Alas!',
  ],
  s0188: [
    'Bearing punishment like Guan and Cai—he brought it on himself.',
    'He suffered the fate of Guan and Cai—and had only himself to blame.',
  ],
  s0189: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0190: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_055_b2.mjs <translation.json>'
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
