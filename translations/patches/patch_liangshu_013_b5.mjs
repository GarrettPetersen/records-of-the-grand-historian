#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'A light breeze stirs slightly, its fragrance reaching me.',
    'A light breeze stirs; its fragrance reaches me.',
  ],
  s0402: [
    'The wind rasps through garden trees; moonlight blankets pond bamboo in one sheet.',
    'Wind rustles in garden trees; moonlight blankets the pond bamboo.',
  ],
  s0403: [
    'Vines extend branches over eaves and cassia; yellow blooms break forth on courtyard chrysanthemums.',
    'Vines stretch along eaves-cassia; yellow blooms open on courtyard chrysanthemums.',
  ],
  s0404: [
    'Ice hangs from banks and rims the islets; snow winds round pines and clothes the wild.',
    'Ice hangs from banks and rims the islets; snow winds round pines and covers the wild.',
  ],
  s0405: [
    'Ducks mass in flight yet do not scatter; geese soar high, about to descend.',
    'Ducks mass in flight without scattering; geese wheel high, about to alight.',
  ],
  s0406: [
    'All the season\'s things are worth cherishing; though from outside, none are borrowed affectation.',
    'All the season offers is worth cherishing; though from outside, none is sham.',
  ],
  s0407: [
    'What the disposition holds and lingers over, the will too cannot cast away.',
    'What one\'s nature holds and lingers over, the will too cannot cast away.',
  ],
  s0408: [
    'My feelings grieve at age\'s decline; calamity and sorrow together overflow.',
    'I grieve that feeling fades with age; trouble and sorrow overflow together.',
  ],
  s0409: [
    'Sadly different chariots reach the same end; sighing that separate paths are lost alike.',
    'Sadly different roads reach one end; sighing that far-apart paths are lost alike.',
  ],
  s0410: [
    'At times I entrust feeling to fish and birds, returning to leisure in a thatched hut.',
    'At times I give my heart to fish and birds, returning to leisure in a thatched hut.',
  ],
  s0411: [
    'Beside me no Wu beauty; before me no Zhao zither.',
    'No Wu beauty at my side; no Zhao zither before me.',
  ],
  s0412: [
    'With this I shall end my days, here passing the hours.',
    'With this I shall end my days, here passing my hours.',
  ],
  s0413: [
    'Only that Heaven and Earth\'s favor goes unrequited, and no recorder of affairs sets it down;',
    'Only Heaven and Earth\'s favor goes unrequited, and no court historian records it;',
  ],
  s0414: [
    'I merely weigh in a great house, yet win no line from fine historians\' brushes.',
    'I merely rank among great houses, yet earn no line in fine histories.',
  ],
  s0415: [
    'Long I sigh—what more is there to say? Alas, my heart\'s shame is not one alone.',
    'Long I sigh—what more is there to say? Alas, shame in the heart is not one alone.',
  ],
  s0416: [
    'Soon he was given Special Advance, retaining Grand Master for Splendor, Attendant-in-Ordinary, and Junior Tutor.',
    'Soon he received Special Advance, keeping Grand Master for Splendor, Attendant-in-Ordinary, and Junior Tutor.',
  ],
  s0417: [
    'In the twelfth year he died in office at seventy-three.',
    'In year 12 he died in office at seventy-three.',
  ],
  s0418: [
    'An edict granted his former offices, funeral cash of fifty thousand, a hundred bolts of cloth, posthumous title Yin.',
    'An edict granted his former offices, fifty thousand cash in funeral gifts, a hundred bolts of cloth, posthumous title Yin.',
  ],
  s0419: [
    'Yue\'s left eye had double pupils; a purple mark on his waist—intelligence surpassing others.',
    'Yue\'s left eye had double pupils and a purple mark on his waist; his intelligence surpassed others.',
  ],
  s0420: [
    'He loved tombs and archives, gathered books to twenty thousand scrolls—none in the capital compared.',
    'He loved the classics, gathered books to twenty thousand scrolls—none in the capital compared.',
  ],
  s0421: [
    'In youth orphaned and poor, he begged among kin, got several hundred hu of rice, was insulted by clansmen, and overturned the rice and left.',
    'Orphaned and poor in youth, he begged among kin for several hundred hu of rice; clansmen insulted him, so he overturned the rice and left.',
  ],
  s0422: [
    'When exalted he held no grudge, and the story was used in district gazetteers.',
    'When he rose high he held no grudge; the tale was used in the district gazetteers.',
  ],
  s0423: [
    'Once attending a feast, a musician was a palace woman of Qi Emperor Wenhui.',
    'Once at a feast, a musician had been a palace woman of Qi Emperor Wenhui.',
  ],
  s0424: [
    'The Emperor asked whether she knew any guest at the table.',
    'The Emperor asked whether she knew any guest present.',
  ],
  s0425: [
    'She said, "I know only Master Shen of the Shen household.',
    'She said, "I know only Master Shen.',
  ],
  s0426: [
    '" Yue bowed at his seat and wept; the Emperor too was saddened and ended the wine.',
    '" Yue bowed at his seat and wept; the Emperor too was moved and stopped the feast.',
  ],
  s0427: [
    'Yue served three dynasties, mastered old statutes, was broadly learned and well informed—the age took him as its model.',
    'Yue served three dynasties, mastered old statutes, and was broadly learned—the age took him as its standard.',
  ],
  s0428: [
    'Xie Xuanyuan excelled at poetry, Ren Yansheng at literary composition—Yue had both yet could not surpass them.',
    'Xie Xuanyuan excelled in poetry and Ren Yansheng in prose—Yue had both yet could not surpass either.',
  ],
  s0429: [
    'Proud of great talent, blind to glory and profit, he rode the times and borrowed power—quite to the cost of pure talk.',
    'Proud of towering talent, blind to rank and gain, he rode the times and borrowed power—much to the harm of pure discourse.',
  ],
  s0430: [
    'Once he stood at the top, he somewhat broadened restraint and sufficiency.',
    'Once at the summit of office, he showed some regard for restraint.',
  ],
  s0431: [
    'Each promotion he earnestly asked to retire, yet in the end could not leave—commentators compared him to Shan Tao.',
    'At each promotion he earnestly asked to retire yet could never leave—men compared him to Shan Tao.',
  ],
  s0432: [
    'In power more than ten years, he never advanced anyone; on policy\'s gains or losses he only murmured assent.',
    'In power more than ten years he never advanced anyone; on policy he only murmured assent.',
  ],
  s0433: [
    'At first Gaozu bore resentment against Zhang Ji; when Ji died he spoke of it with Yue.',
    'At first Gaozu resented Zhang Ji; when Ji died he spoke of it with Yue.',
  ],
  s0434: [
    'Yue said, "The Left Vice Director of the Masters of Writing going out as a border inspector—past matters, what need to discuss again?',
    'Yue said, "A left vice director sent out as a border inspector—past matters, what need discuss them again?',
  ],
  s0435: [
    '" The Emperor, thinking families by marriage shielding one another, raged: "You speak thus—are you a loyal minister!',
    '" The Emperor, thinking it kin shielding kin, raged: "You speak thus—are you a loyal minister!',
  ],
  s0436: [
    '" He was borne back to the inner hall.',
    '" He was borne back to the inner hall.',
  ],
  s0437: [
    'Yue was afraid, did not notice Gaozu rise, and still sat as before.',
    'Yue was afraid; not noticing Gaozu had risen, he still sat as before.',
  ],
  s0438: [
    'When he returned, before reaching the couch he pitched forward empty in the air and fell by the door.',
    'Returning, before he reached the couch he pitched forward and fell by the door.',
  ],
  s0439: [
    'In illness he dreamed Emperor He of Qi cut his tongue with a sword.',
    'Sick, he dreamed Qi Emperor He cut his tongue with a sword.',
  ],
  s0440: [
    'He summoned a shaman to look; the shaman spoke as the dream.',
    'He summoned a shaman; the shaman spoke as in the dream.',
  ],
  s0441: [
    'He then called Daoists to present red writs to Heaven, saying the abdication affair had not issued from himself.',
    'He called Daoists to present red writs to Heaven, claiming the dynastic change had not come from him.',
  ],
  s0442: [
    'Gaozu sent Palace Physician Xu Zang to view Yue\'s illness; returning he reported it in full.',
    'Gaozu sent palace physician Xu Zang to examine Yue; returning, he reported everything.',
  ],
  s0443: [
    'Before this, Yue once attended a feast when Yuzhou presented chestnuts an inch and a half across; the Emperor marveled and asked, "How much is there to the matter of chestnuts?',
    'Earlier Yue had attended a feast when Yuzhou presented chestnuts an inch and a half across; the Emperor marveled and asked, "How much is there to say of chestnuts?',
  ],
  s0444: [
    '" He and Yue each wrote what they recalled—the Emperor had three things fewer.',
    '" He and Yue each wrote what they recalled—the Emperor fell three items short.',
  ],
  s0445: [
    'Going out he told someone, "This gentleman guards his pride—if he does not yield he would die of shame.',
    'Leaving, he told someone, "This man guards his pride—he would die of shame rather than yield.',
  ],
  s0446: [
    '" The Emperor, taking his words as insubordinate, wished to punish him; Xu Mian firmly remonstrated and he stopped.',
    '" The Emperor, finding the words insubordinate, meant to punish him; Xu Mian firmly remonstrated and he desisted.',
  ],
  s0447: [
    'When he heard of the red writ matter he was greatly angry; palace envoys rebuked him several times—Yue in fear then died.',
    'Hearing of the red writ, he was furious; palace envoys rebuked him repeatedly—Yue died in fear.',
  ],
  s0448: [
    'The offices gave posthumous title Wen; the Emperor said, "Holding feeling back without exhausting it is called Yin.',
    'The offices proposed posthumous title Wen; the Emperor said, "Holding feeling without exhausting it is called Yin.',
  ],
  s0449: [
    '" So it was changed to Yin.',
    '" So it was changed to Yin.',
  ],
  s0450: [
    'His writings: History of Jin in one hundred and ten scrolls, History of Song in one hundred scrolls, Annals of Qi in twenty scrolls, Annals of the High Ancestor in fourteen scrolls, Near Words in ten scrolls, Posthumous Examples in ten scrolls, Literary Records of Song in thirty scrolls, and collected works in one hundred scrolls—all circulated in the age.',
    'He wrote History of Jin in 110 scrolls, History of Song in 100, Annals of Qi in 20, Annals of the High Ancestor in 14, Near Words in 10, Posthumous Examples in 10, Literary Records of Song in 30, and collected works in 100—all circulated in his time.',
  ],
  s0451: [
    'He also compiled Rhymes in Four Tones, thinking poets of old for a thousand years had not understood, while he alone grasped the subtle intent in his breast—a work he called divine—Gaozu greatly disliked it.',
    'He also compiled Rhymes in Four Tones, holding that poets for a millennium had not understood tones while he alone had grasped their subtlety—a work he called divine—Gaozu disliked it greatly.',
  ],
  s0452: [
    'The Emperor asked Zhou She: "What are the four tones?',
    'The Emperor asked Zhou She, "What are the four tones?',
  ],
  s0453: [
    '" She said: "The Son of Heaven is sage and wise"—that is it; yet the Emperor in the end did not follow it.',
    '" She said, "The Son of Heaven is sage and wise"—that is it; yet the Emperor never adopted it.',
  ],
  s0454: [
    'His son Xuan; while Yue lived he had already served as Secretariat Gentleman, Administrator of Yongjia, Attendant of the Masters of Writing on the Prince\'s staff, and Right Chief Clerk of the Masters of Writing.',
    'His son Xuan; while Yue lived he had already been Secretariat Gentleman, Yongjia administrator, staff attendant of the Masters of Writing, and right chief clerk of the Masters of Writing.',
  ],
  s0455: [
    'When Yue\'s mourning ended he was made Crown Prince\'s Household Steward; again he left office for his mother\'s mourning and ate vegetables while fasting.',
    'When Yue\'s mourning ended he was made crown prince steward; again he left office for his mother\'s mourning and lived on vegetables while fasting.',
  ],
  s0456: [
    'When mourning ended he still abstained from polished grain.',
    'When mourning ended he still abstained from polished grain.',
  ],
  s0457: [
    'He was made Attendant-in-Ordinary of the Yellow Gate and Chief Clerk of the Central Pacification Army.',
    'He was made Attendant-in-Ordinary of the Yellow Gate and chief clerk of the Central Pacification Army.',
  ],
  s0458: [
    'He went out as General Who Draws the Distant and Administrator of Nankang; in the commandery he was known for pure governance.',
    'He went out as General Who Draws the Distant and administrator of Nankang; in office he was known for pure governance.',
  ],
  s0459: [
    'He died in office; posthumous title Respectful Marquis.',
    'He died in office; posthumous title Respectful Marquis.',
  ],
  s0460: [
    'His son Xuan succeeded.',
    'His son Xuan succeeded.',
  ],
  s0461: [
    'Chen Minister of Personnel Yao Cha said: In old times the virtue of wood was about to fade; a dim successor spread cruelty, and the trembling black-haired people hung their lives on the sundial\'s drip.',
    'Chen Minister of Personnel Yao Cha said: When the virtue of wood was fading, a dim heir spread cruelty, and the trembling people hung their lives on the sundial\'s drip.',
  ],
  s0462: [
    'Gaozu by righteousness rescued the collapsing flood, his will to settle the central lands; stratagems in the tent truly rested on men like Zhang Liang and Chen Ping.',
    'Gaozu by righteousness rescued the flood of collapse and willed to settle the realm; stratagems in the tent truly rested on men like Zhang Liang and Chen Ping.',
  ],
  s0463: [
    'As for Fan Yun and Shen Yue, they took part in founding and helped complete the imperial enterprise;',
    'As for Fan Yun and Shen Yue, they joined in founding and helped complete the imperial enterprise;',
  ],
  s0464: [
    'add Yun\'s keen alertness and clear sufficiency in aiding affairs and benefiting the age, and Yue\'s towering talent and broad learning, his name second only to Sima Qian and Dong Zhongshu—both belonged to a rising fortune; they were the heroic giants of a generation.',
    'Yun was keen and clear in aiding affairs; Yue had towering talent and broad learning, his name second only to Qian and Dong—both rode a rising fortune; they were a generation\'s giants.',
  ],
  s0465: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0466: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_013_b5.mjs <translation.json>'
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
