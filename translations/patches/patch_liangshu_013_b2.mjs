#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'His father Pu was Administrator of Huainan.',
    'His father Pu held Huainan as administrator.',
  ],
  s0102: [
    'Pu was executed at the end of Yuanjia; Yue as a child went into hiding and was spared by an amnesty.',
    'At Yuanjia\'s end Pu was put to death; young Yue hid in the shadows until an amnesty let him live.',
  ],
  s0103: [
    'Then he drifted homeless and poor, set his will on learning, day and night without tiring.',
    'He wandered rootless and penniless, fierce in his love of books, never resting from dawn to dark.',
  ],
  s0104: [
    'His mother feared overwork would bring illness and often had him cut lamp oil and put out the fire.',
    'His mother dreaded that zeal would break his health and kept sending orders to trim the wick and quench the lamp.',
  ],
  s0105: [
    'What he read by day he recited by night; he mastered the classics broadly and could compose prose.',
    'By day he read, by night he chanted it back until the canon lay open in his mind and his own writing came at will.',
  ],
  s0106: [
    'He began his career as Palace Attendant.',
    'He entered service as a palace attendant.',
  ],
  s0107: [
    'Cai Xingzong of Jiyang heard of his talent and favored him;',
    'Cai Xingzong of Jiyang heard his gift and took to him;',
  ],
  s0108: [
    'when Xingzong became Inspector of Yingzhou, he took him as Anxi Outside Army staff officer, also recorder.',
    'when Xingzong took Yingzhou he made him outside-army staff officer to Anxi and recorder as well.',
  ],
  s0109: [
    'Xingzong once told his sons: "Recorder Shen is a model of humanity—treat him well.',
    'Xingzong once told his sons, "Shen the recorder is a teacher among men—serve him well.',
  ],
  s0110: [
    '" When he went to Jingzhou, he became western campaign recorder, concurrent magistrate of Juesi.',
    'When he went to Jingzhou he became western campaign recorder and magistrate of Juesi in the same breath.',
  ],
  s0111: [
    'When Xingzong died, he became Jin\'an Wang\'s legal bureau staff officer, then outside army, both with recorder.',
    'After Xingzong\'s death he was legal staff to the Prince of Jin\'an, then outside army, always doubling as recorder.',
  ],
  s0112: [
    'He entered the capital as Masters of Writing revenue section attendant.',
    'He came to court as revenue attendant in the Masters of Writing.',
  ],
  s0113: [
    'Early in Qi he was campaign-against-barbarians recorder, concurrent Xiangyang magistrate—the prince he served was Crown Prince Wenhuì.',
    'At Qi\'s opening he was campaign recorder with Xiangyang on his belt—the prince was Crown Prince Wenhuì.',
  ],
  s0114: [
    'When the crown prince moved to the Eastern Palace, he was infantry colonel, in charge of records, on duty at Yongshou office, collating the four sections of books.',
    'The heir moved east; he became infantry colonel, keeper of papers, stationed at Yongshou, collating the four library divisions.',
  ],
  s0115: [
    'Many scholars were at the Eastern Palace; Yue was specially favored, entering straight through each time and not leaving until his shadow slanted long.',
    'The eastern palace teemed with talent, yet Yue alone was drawn close—he walked straight in and left only when the sun hung low.',
  ],
  s0116: [
    'At times princes and marquises coming to the palace could not get in—Yue always spoke up about it.',
    'Sometimes even kings and marquises were turned away at the gate, and Yue always pleaded their case.',
  ],
  s0117: [
    'The crown prince said: "I have been lazy to rise all my life, as you know; only when I talk with you do I forget sleep.',
    'The heir said, "You know how late I like to wake; only your talk makes me forget the bed.',
  ],
  s0118: [
    'If you want me up early, come in early every day.',
    'If you want me at dawn, come early every day.',
  ],
  s0119: [
    '" He was promoted to Eastern Palace Household Head, later combining that office with Compilation Gentleman, then Secretariat Gentleman, native-district impartial judge, Right Chief of Staff of the Minister of Works, and Yellow Gate Gentleman Companion.',
    'He rose to eastern-palace household head, then added compilation gentleman, secretariat gentleman, native impartial judge, right chief of staff to the minister of works, and yellow-gate companion.',
  ],
  s0120: [
    'The Prince of Jingling also gathered scholars; Yue with Xiao Chen of Lanling, Wang Rong of Langye, Xie Tiao of Chen commandery, Fan Yun of Nanxiang, Ren Fang of Le\'an, and others all associated—at the time they were called the attained men.',
    'The Prince of Jingling too kept a salon; Yue moved with Xiao Chen, Wang Rong, Xie Tiao, Fan Yun, Ren Fang, and the rest—men of the age called them the company worth having.',
  ],
  s0121: [
    'Soon he concurrently served as Left Assistant Minister of the Masters of Writing, then became Censor-in-Chief, then Chief Clerk of the Cavalry General.',
    'Soon he doubled as left assistant in the Masters of Writing, then censor-in-chief, then chief clerk to the cavalry general.',
  ],
  s0122: [
    'In Longchang year 1, he was appointed Department of Personnel Attendant, then went out as Pacify-the-North General and Administrator of Dongyang.',
    'In the first Longchang year he took the personnel post, then left as pacify-the-north general and administrator of Dongyang.',
  ],
  s0123: [
    'When Emperor Ming took the throne, his title advanced to Assist-the-State General; he was summoned as Masters of Armaments Minister, then became Chancellor of the Imperial Academy.',
    'Ming\'s accession brought him the title assist-the-state; he was called to armaments minister, then made chancellor of the imperial academy.',
  ],
  s0124: [
    'When Emperor Ming died, power fell to the chamberlain; Minister Xu Xiaosi had Yue draft the death edict.',
    'When Ming died the regent held the reins; Xu Xiaosi ordered Yue to fix the final edict.',
  ],
  s0125: [
    'He was promoted to Left Guard General, soon with added Unimpeded Transmission Regular Attendant.',
    'He became left guard general, soon with unimpeded transmission regular attendant added.',
  ],
  s0126: [
    'In Yongyuan year 2, citing his mother\'s age he petitioned to leave office; reassigned as Champion General and Left Chief of Staff of the Minister of Works, Campaign General and Administrator of Southern Qinghe.',
    'In Yongyuan year 2 he begged off for his mother\'s sake and was shifted to champion general, left chief of staff, campaign general, and administrator of Southern Qinghe.',
  ],
  s0127: [
    'Gaozu at the Western Residence was an old companion of Yue\'s; when Jiankang fell peaceful, Yue was made Grand Marshal staff officer, rank unchanged.',
    'Gaozu at the western residence knew Yue of old; when Jiankang settled he made him grand-marshal staff officer at the same rank.',
  ],
  s0128: [
    'Gaozu\'s merit was established, heaven and men aligned—Yue once probed the matter; Gaozu was silent.',
    'Merit was won and heaven and men agreed; Yue once tested the edge of the question and Gaozu answered with silence.',
  ],
  s0129: [
    'Another day he pressed: "Today differs from antiquity—you cannot expect all things by pure custom.',
    'On another day he pressed on: "This age is not the old days—you cannot bind every heart with rustic virtue alone.',
  ],
  s0130: [
    'Scholar-officials who cling to the rising dragon all hope for some small merit to secure fortune and rank.',
    'Every gentleman who rides the dragon\'s scales wants a scrap of merit to keep his house safe.',
  ],
  s0131: [
    'Now boys and herdboys all know Qi is finished—everyone says you are the man.',
    'Even children at pasture know Qi\'s mandate is spent and say in one voice that you are the man.',
  ],
  s0132: [
    'Astronomy and human affairs show signs of a change of fortune; since Yongyuan this has been especially clear.',
    'Heaven\'s signs and men\'s tongues mark the turn of fate—since Yongyuan the proof has glared.',
  ],
  s0133: [
    'A prophecy says "moving in water, become Son of Heaven"—that too stands plainly in the records.',
    'A prophecy runs, "walk midstream and become Son of Heaven"—and the chronicles set it plain.',
  ],
  s0134: [
    'Heaven\'s heart may not be defied, human hearts may not be lost—if the succession has arrived, even wishing humility, you cannot stop.',
    'Heaven\'s will will not be turned aside, nor men\'s hearts left hanging—when the count of ages has come, modesty cannot hold it back.',
  ],
  s0135: [
    '" Gaozu said: "I am still thinking.',
    'Gaozu said, "I am still thinking.',
  ],
  s0136: [
    'Yue replied: "When you first took arms at Fan and Mian you should have thought; now the royal work is done—what more to think?',
    'Yue answered, "When you first raised arms at Fan and Mian—that was the hour to think. The royal work stands—what is left to think?',
  ],
  s0137: [
    'When King Wu attacked Zhou and first entered, the people at once called him their lord—Wu did not resist the people\'s will and had nothing to deliberate.',
    'When King Wu struck Zhou and entered, the people cried "our lord" at once—Wu did not fight the tide and had no second thoughts.',
  ],
  s0138: [
    'Since you reached the capital the seasons of qi have shifted—compared with King Wu, your pace differs.',
    'From the day you reached the capital the qi of the age has turned—your pace is not King Wu\'s pace.',
  ],
  s0139: [
    'If you do not fix the great work early and hold heaven and men waiting, should one man raise a different banner your prestige suffers.',
    'Delay the great settlement and keep heaven and men on the rack—let one man stand apart and your awe is already cut.',
  ],
  s0140: [
    'And men are not metal or stone—times are hard to keep.',
    'Flesh is not bronze or stone, and the moment is hard to keep.',
  ],
  s0141: [
    'Can you leave a mere fief of the Jian\'an sort to your sons?',
    'Will you hand your sons only a Jian\'an marquisate?',
  ],
  s0142: [
    'If the Son of Heaven returns to the capital and dukes and ministers take their posts, lord and subject are fixed and hearts will not turn.',
    'Once the Son of Heaven is back and the great ministers sit in their ranks, lord and servant are set and no heart will wander.',
  ],
  s0143: [
    'The ruler clear above, ministers loyal below—who would join you again as a rebel?',
    'A bright lord above, loyal men below—who would rise with you as a rebel again?',
  ],
  s0144: [
    '" Gaozu agreed.',
    'Gaozu assented.',
  ],
  s0145: [
    'Yue left; Gaozu called Fan Yun and told him—Yun\'s answer matched Yue\'s gist.',
    'Yue withdrew; Gaozu summoned Fan Yun and told him—Yun\'s reply tracked Yue\'s meaning.',
  ],
  s0146: [
    'Gaozu said: "Wise men agree in secret like this—tomorrow bring Xiuwen again early.',
    'Gaozu said, "Wise men hide the same thought in the dark—bring Xiuwen early tomorrow.',
  ],
  s0147: [
    'Yun went out and told Yue; Yue said: "You must wait for me.',
    'Yun went out and spoke to Yue; Yue said, "You must wait for me.',
  ],
  s0148: [
    'Yun promised, but Yue entered first and Gaozu ordered him to draft the affair.',
    'Yun promised, yet Yue went in ahead; Gaozu told him to draft the business.',
  ],
  s0149: [
    'Yue produced from his bosom the edict and all appointments—Gaozu changed nothing.',
    'Yue drew from his breast the edict and every appointment; Gaozu altered not a line.',
  ],
  s0150: [
    'Soon Yun came from outside; he could not enter the hall door and paced outside Shouguang Pavilion, only crying "Tut tut!"',
    'Soon Yun arrived from outside, stopped at the hall gate, and paced Shouguang Pavilion crying, "Tsk, tsk!"',
  ],
  s0151: [
    'Yue came out; Yun asked how he had been used.',
    'Yue came out; Yun asked, "How were you placed?"',
  ],
  s0152: [
    'Yue lifted his hand leftward; Yun laughed: "Not against my hopes."',
    'Yue raised his hand toward the left; Yun laughed, "No betrayal of what I hoped."',
  ],
  s0153: [
    'Shortly Gaozu summoned Yun: "Living with Shen Xiuwen, I never felt he was extraordinary;',
    'Before long Gaozu called Yun and said, "I lived beside Shen Xiuwen and never felt a strangeness in him;',
  ],
  s0154: [
    'today his wit runs free—truly clear-sighted."',
    'today his talent runs in every direction—this is true discernment."',
  ],
  s0155: [
    'Yun said: "Your Grace now knows Yue—no different from Yue now knowing Your Grace."',
    'Yun said, "You know Yue now—as Yue already knew you."',
  ],
  s0156: [
    'Gaozu said: "I have raised arms three years; the meritorious generals have indeed labored—but those who finished the imperial work are you two."',
    'Gaozu said, "Three years since I took up arms—the captains have their merit, yet the throne was finished by you two alone."',
  ],
  s0157: [
    'When the Liang platform was raised, he was Scattered Cavalry Regular Attendant, Personnel Minister, concurrent Right Vice Minister.',
    'When the Liang terrace rose he was scattered-cavalry regular attendant, personnel minister, and right vice minister together.',
  ],
  s0158: [
    'Gaozu accepted the mandate—Masters of Writing Vice Minister, Marquis of Jianchang, thousand households, attendant as before.',
    'At Gaozu\'s accession he was vice minister of the Masters of Writing, marquis of Jianchang with a thousand households, attendant unchanged.',
  ],
  s0159: [
    'Yue\'s mother Lady Xie was enfeoffed as Grand Lady of Jianchang state.',
    'Yue\'s mother, Lady Xie, was made grand lady of Jianchang state.',
  ],
  s0160: [
    'On the day of receiving the patent, Vice Minister Fan Yun and more than twenty others all came to bow—court and country took it for glory.',
    'On the day the patent was received, Fan Yun the vice minister and twenty-odd others all came to bow—court and market called it glory.',
  ],
  s0161: [
    'Soon promoted to Left Vice Minister, attendant unchanged.',
    'Soon he was left vice minister, attendant as before.',
  ],
  s0162: [
    'Soon concurrent command of the guards, added Palace Attendant.',
    'Soon he commanded the guards in addition and gained palace attendant.',
  ],
  s0163: [
    'Tianjian year 2, mourning mother—the emperor came in person to console; considering Yue\'s age, excessive grief was unsuitable; sent a Secretariat staffer to stop visitors and regulate weeping.',
    'In Tianjian year 2 he mourned his mother; the emperor came out in person to condole, judged Yue too old for ruinous grief, and sent a secretariat aide to cut off guests and set bounds to the wailing.',
  ],
  s0164: [
    'He returned to office as Suppressing Army General and Intendant of Danyang with full staff.',
    'He left mourning as suppressing-army general and intendant of Danyang, with a full staff appointed.',
  ],
  s0165: [
    'When mourning ended: Palace Attendant, Right Grandee, Eastern Palace Tutor, Yangzhou chief impartial judge, oversight of eight Masters items, then Masters Minister—attendant, tutor, judge unchanged.',
    'When the mourning ended he was palace attendant, right grandee, eastern-palace tutor, Yangzhou chief impartial judge, charged with eight secretariat matters, then minister of the Masters of Writing—attendant, tutor, and judge unchanged.',
  ],
  s0166: [
    'Repeated memorials to decline; reassigned Left Vice Minister, concurrent Secretariat Director, Front General, with staff, attendant as before.',
    'He memorialized again and again to yield; they made him left vice minister with secretariat director, front general, staff, and attendant as before.',
  ],
  s0167: [
    'Soon Masters Minister, concurrent Junior Tutor of the Heir Apparent.',
    'Soon he was minister of the Masters of Writing and junior tutor to the heir together.',
  ],
  s0168: [
    'Year 9: Left Grandee, attendant and junior tutor as before, one set of martial pipes.',
    'In year 9 he became left grandee, attendant and junior tutor unchanged, with one set of martial pipes.',
  ],
  s0169: [
    'Long at the peak of government, he aimed at the tripod-post; observers said it fit—the emperor never used him; he sought to go out, was refused.',
    'He had long stood at the summit and coveted the highest seat; men said it was fitting, yet the emperor never gave it—he asked to go out and was not allowed.',
  ],
  s0170: [
    'He was close to Xu Mian and wrote to lay bare his heart: "In my weak years I was orphaned and alone, with no kin near; once I was about to fall to earth—through hardship and peril, trapped morning and evening, climbing rough steps in petty office not for myself, hoping for a small stipend to settle near home in the east.',
    'He was old friends with Xu Mian and wrote to open his heart: "In tender years I was orphaned, with no kin at hand; I nearly fell to the ground—years of want and danger, squeezed morning and night, climbing petty posts I did not want, only to win a small salary and live out my days near home in the east.',
  ],
  s0171: [
    'More than ten years passed before I was honored with Xiangyang county—public and private accounts I could not clear, and with my person as collateral I could not refuse human affairs.',
    'More than ten years passed before I barely held Xiangyang county; public and private ledgers I could not square, and my body was the pledge—I could not refuse the world\'s business.',
  ],
  s0172: [
    'At the end of Yongming I went out to guard Dongyang, my heart set on stopping;',
    'At Yongming\'s end I went out to Dongyang, my heart already on stopping;',
  ],
  s0173: [
    'but Jianwu opened a new fortune and the world glued itself tighter—one departure does not return, and the walking is not easy.',
    'then Jianwu opened a new reign and the world clung tighter—one step out does not come back, and the road is not easy.',
  ],
  s0174: [
    'When dim suspicion began and royal affairs had many doors, I plotted to withdraw, hoping it might succeed—I entrusted my mind to you to lay before Supervisor Xu, thinking the record is not forgotten.',
    'When the throne turned dim and many hands held the reins, I schemed to withdraw, hoping it might succeed—I asked you to carry my wish to Supervisor Xu, trusting you had not forgotten.',
  ],
  s0175: [
    'When the holy way rose up I wrongly met a fine season; old will and long intent became wrong again.',
    'When the holy way rose I stumbled into a bright season, and the will I nursed for years turned false again.',
  ],
  s0176: [
    'This year Kaiyuan—the ritual year arrives—the request to hang up the chariot is denied by grace.',
    'This Kaiyuan year the ritual clock says my turn—the plea to hang up the chariot is denied by grace.',
  ],
  s0177: [
    'Truly I cannot spread wind-policies or brighten court plans; I still wish to examine registers and seasonal debate.',
    'I truly cannot widen the wind of government or light the court\'s counsel; I still mean to comb the archives and weigh what men say.',
  ],
  s0178: [
    'But since the year opened illness and worry grew—perhaps because life has limits and labor exceeded measure—gathering this exhaustion to my age, I drive my steps and force the service.',
    'Yet since the year turned, sickness and dread have grown—perhaps life has a measure and labor passed it—this wasting gathers on my old bones, and I whip my steps to barely serve.',
  ],
  s0179: [
    'To outside eyes I still look whole, but form and strength do not coordinate; I must always bind myself tight to barely manage.',
    'From outside I still seem a whole man, yet body and force no longer answer each other; I must brace myself every hour to scrape through.',
  ],
  s0180: [
    'Undo my robes and lie down—limbs no longer answer each other.',
    'Strip off my robe and lie down—my limbs no longer heed one another.',
  ],
  s0181: [
    'Heat above, cold below, month by month worse—warmth brings trouble, cold brings relief, each bout weaker than the last, each crisis sharper than the one before.',
    'Heat above, cold below, worse with every moon—warmth vexes me, cold steadies me, each spell weaker than the last, each turn sharper than the one before.',
  ],
  s0182: [
    'For days and decades the belt must move a hole;',
    'In spans of days and decades the belt must shift a notch;',
  ],
  s0183: [
    'grasp the arm with the hand—each month a little less by half a fraction.',
    'close my hand on my arm—each month a little less by half a measure.',
  ],
  s0184: [
    'By this reckoning how can I last long?',
    'Count it so—how can I last?',
  ],
  s0185: [
    'If this does not stop, day piled on day, it will leave the sage lord unappeasable regret.',
    'If this does not end, day on day, it will leave our sage lord a regret that cannot be soothed.',
  ],
  s0186: [
    'I dare wish to memorialize and beg the rank of return in old age.',
    'I dare memorialize and beg the rank of withdrawal in old age.',
  ],
  s0187: [
    'If Heaven lends years and I return to fair health, what strength allows—that is the only plan I ponder."',
    'If Heaven grants years and I return to sound health, whatever strength remains—that alone is the plan I keep."',
  ],
  s0188: [
    'Mian spoke to Gaozu; asked for three-office ritual—refused, only added pipes.',
    'Mian spoke for him to Gaozu and asked the rites of the three offices—refused; only the pipes were added.',
  ],
  s0189: [
    'By nature Yue did not drink and had few desires; though honors piled up, his dwelling stayed spare.',
    'Yue did not drink by nature and wanted little; though rank piled on him, his house stayed plain.',
  ],
  s0190: [
    'He built a house on the eastern fields, gazing out over the suburban hills.',
    'He built a house in the eastern fields and looked out over the suburban slopes.',
  ],
  s0191: [
    'He once composed the "Fu of Suburban Living"; its words run:',
    'Once he wrote the "Fu of Suburban Living"; it begins:',
  ],
  s0192: [
    'Only the perfected man forgets self, firmly forgetting self and things together.',
    'The perfected man forgets himself and holds self and world in one forgetting.',
  ],
  s0193: [
    'From middling wisdom downward, all take nature as their field.',
    'Below middling wit, every creature takes its nature for its pasture.',
  ],
  s0194: [
    'Beasts run free because they have dens; birds nest first, then soar.',
    'Beasts stretch their legs because they have burrows; birds build the nest, then take the sky.',
  ],
  s0195: [
    'Chen\'s alleys ended poor yet his work flourished; Ying dwelt cramped yet his virtue shone.',
    'Chen lived in a dead-end lane yet his house rose; Ying kept a mean roof yet his virtue widened.',
  ],
  s0196: [
    'Qiao lodged his benevolence in the eastern lane; the phoenix hid its tracks in the western hall.',
    'Qiao planted benevolence in the eastern lane; the phoenix veiled its steps in the western hall.',
  ],
  s0197: [
    'My own will is narrow; I have no great plan for the age.',
    'My will is small; I own no grand design for the world.',
  ],
  s0198: [
    'I would fold my wings to the woods and sheath my scales in the water.',
    'I would fold my wings to the forest and hide my scales in the stream.',
  ],
  s0199: [
    'I have no love for painted beams, no craving for the broad road.',
    'I do not hunger for carved rafters, nor thirst for the king\'s highway.',
  ],
  s0200: [
    'I open the eastern suburbs\' wide silence and enter the wild tangle of reeds and rushes.',
    'I push into the eastern outskirts\' emptiness and walk the waste of reed and rush.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_013_b2.mjs <translation.json>'
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
