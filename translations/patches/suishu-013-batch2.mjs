#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Thereupon using the Tong to sound, turning to push the monthly qi, all without error or deviation, and in return attaining the mean.',
    'Using the Tong to produce sound and calculating the monthly qi, all matched without deviation and achieved perfect harmony.',
  ],
  s0102: [
    'They also made twelve flutes: Huangzhong flute, length three feet eight inches; Dalü flute, three feet six inches; Taicu flute, three feet four inches; Jiazhong flute, three feet two inches; Guxian flute, three feet one inch; Zhonglü flute, two feet nine inches; Ruibin flute, two feet eight inches; Linzhong flute, two feet seven inches; Yize flute, two feet six inches; Nanlü flute, two feet five inches; Wushe flute, two feet four inches; Yingzhong flute, two feet three inches.',
    'They also made twelve flutes: Huangzhong at three feet eight inches, Dalü at three feet six inches, Taicu at three feet four inches, Jiazhong at three feet two inches, Guxian at three feet one inch, Zhonglü at two feet nine inches, Ruibin at two feet eight inches, Linzhong at two feet seven inches, Yize at two feet six inches, Nanlü at two feet five inches, Wushe at two feet four inches, and Yingzhong at two feet three inches.',
  ],
  s0103: [
    'Using the flute to write out the Tong\'s sound, comparing ancient bell pitch pipes with Zhou-dynasty ancient bells—all without discrepancy.',
    'Flutes were used to verify the Tong\'s pitch against ancient bell standards and Zhou bells—all matched perfectly.',
  ],
  s0104: [
    'Thereupon arrayed with the eight sounds and applied with the seven tones, none failed to harmonize.',
    'Arrayed with the eight sounds and the seven tones, everything harmonized.',
  ],
  s0105: [
    'At that time Palace Gentleman of the Northern Army Sima He Tong memorialized: "According to the Rites of Zhou, when the king enters or exits, Xian Xia is played; when the impersonator of the dead enters or exits, Si Xia is played; when the sacrificial victim enters or exits, Zhao Xia is played.',
    'At that time Palace Gentleman He Tong memorialized: "The Rites of Zhou prescribe Xian Xia when the king enters or exits, Si Xia for the impersonator of the dead, and Zhao Xia for the sacrificial victim.',
  ],
  s0106: [
    'Now in the Music Office\'s Xia music, only Wang Xia was changed to Huang Xia—probably because since Qin and Han they styled themselves huang (august).',
    'Today\'s Music Office Xia pieces changed only Wang Xia to Huang Xia—likely because Qin and Han rulers styled themselves "august" (huang).',
  ],
  s0107: [
    'Yet Qi followed Song\'s ritual regulations: welcoming the spirits they played Zhao Xia; when the emperor entered or exited they played Yong Zhi; when the victim entered or exited they changed to music leading the victim.',
    'Yet Qi followed Song\'s ritual code: Zhao Xia welcomed the spirits, Yong Zhi accompanied the emperor\'s entry and exit, and separate music led the sacrificial victim.',
  ],
  s0108: [
    'The error in this could not be greater.',
    'The error could hardly be greater.',
  ],
  s0109: [
    'I request that the Ritual Bureau be ordered to correct it.',
    'I request that the Ritual Bureau correct this.',
  ],
  s0110: [
    '" Zhou She argued that "The Rites says \'when the king enters, Wang Xia is played\'—great sacrifices and court assemblies use the same music.',
    'Zhou She argued: "The Rites says \'when the king enters, Wang Xia is played\'—great sacrifices and court assemblies use the same music.',
  ],
  s0111: [
    'Yet under Han regulations, when the emperor was in the temple Yong Zhi music was played; on days of court assembly there was a separate Huang Xia.',
    'Under Han regulations, Yong Zhi was played when the emperor was in the temple, but a separate Huang Xia on court assembly days.',
  ],
  s0112: [
    'The two musics differ—in ritual this is wrong; Yong Zhi should be removed and Huang Xia restored.',
    'Two different pieces for one rite violates ritual propriety; Yong Zhi should be abolished and Huang Xia restored.',
  ],
  s0111: [
    'Yet under Han regulations, when the emperor was in the temple Yong Zhi music was played; on days of court assembly there was a separate Huang Xia.',
    'Under Han regulations, Yong Zhi was played when the emperor was in the temple, but a separate Huang Xia on court assembly days.',
  ],
  s0112: [
    'The two musics differ—in ritual this is wrong; Yong Zhi should be removed and Huang Xia restored.',
    'Two different pieces for one rite violates ritual propriety; Yong Zhi should be abolished and Huang Xia restored.',
  ],
  s0113: [
    'Also the Rites says "when the impersonator enters or exits, Si Xia is played; when the guest enters the great gate, Si Xia is played"—thus it is set only for human and spirit; it cannot be confused with music welcoming the victim.',
    'The Rites also says Si Xia is played when the impersonator or guest enters the great gate—it belongs to human and spirit, and cannot be confused with music for welcoming the victim.',
  ],
  s0114: [
    'Song at its end lost ritual and suddenly damaged old rules; when the spirit entered the temple gate they thereupon played Zhao Xia—thus using music for sacrificial victims to receive the spirits of ancestors.',
    'Late Song lost ritual propriety: when the spirit entered the temple gate they played Zhao Xia—using victim music to receive the ancestors\' spirits.',
  ],
  s0115: [
    'These are all deep flaws of former ages—matters that should be changed in the present.',
    'These are deep flaws of earlier dynasties that the present age should correct.',
  ],
  s0116: [
    '" At the time discussion also held that the Rites of Zhou says: "If music undergoes six transformations, the spirits of Heaven all descend.',
    'Discussion also cited the Rites of Zhou: "When music undergoes six transformations, the spirits of Heaven descend.',
  ],
  s0117: [
    '" Spirits dwell in upper mystery; going and returning are dim and fleeting—when they descend they come of themselves; to welcome them there is nowhere to go.',
    'Spirits dwell in upper mystery, coming and going in dim obscurity—they descend of their own accord, and there is nowhere to go to welcome them.',
  ],
  s0118: [
    'One may change "welcome" to "descend," while sending off follows the former form.',
    'Welcome should be changed to descend, while the sending-off rite follows the former form.',
  ],
  s0119: [
    'Also the Rites of Zhou says "if music undergoes eight transformations, then the earth spirits all emerge and can be received in ritual"—for earth, welcoming the spirit should follow the old way.',
    'The Rites of Zhou also says that with eight musical transformations earth spirits emerge and can be received in ritual—for earth spirits, welcoming should follow the old way.',
  ],
  s0120: [
    'All were followed.',
    'All proposals were adopted.',
  ],
  s0121: [
    'Also for music set at the Bright Hall, broadly it did not differ from the southern suburban altar, only the altar hall had a different name and there was no position for approaching the burning.',
    'Music at the Bright Hall broadly matched the southern suburban rite, differing only in the altar\'s name and lacking a position for approaching the burning.',
  ],
  s0122: [
    'At the Bright Hall they sang to all Five Emperors; the rest followed the suburban form.',
    'At the Bright Hall hymns addressed all Five Emperors; the rest followed the suburban form.',
  ],
  s0123: [
    'At the beginning of Song and Qi times, sacrificing to Heaven and Earth and offering to the ancestral temple followed Han in sacrificing to Grand Unity and Earth, all using the full court bell-set.',
    'Early Song and Qi, sacrificing to Heaven and Earth and the ancestral temple, followed Han\'s sacrifice to Grand Unity and Earth with full court bell-sets.',
  ],
  s0124: [
    'Also Grand Master of Ceremonies Ren Fang, citing Wang Su\'s argument, said: "The Offices of Zhou says \'with the six pitch pipes, five tones, eight sounds, and six dances, great music is combined to reach spirits and ghosts, harmonize the states, harmonize the myriad peoples, settle guests, and delight distant peoples.',
    'Grand Master Ren Fang, citing Wang Su, said: "The Offices of Zhou combines the six pitch pipes, five tones, eight sounds, and six dances in great music to reach spirits, harmonize the states, settle guests, and delight distant peoples.',
  ],
  s0125: [
    '" This is called the six unities—all performed at one time.',
    'This is called the six unities—all performed together.',
  ],
  s0126: [
    'Now the six dynastic dances are separately used—this does not satisfy the human heart.',
    'Using the six dynastic dances separately does not satisfy proper sentiment.',
  ],
  s0127: [
    '" Thereupon following Su\'s argument, at sacrifices, suburbs, and temples the six dynastic dances were fully provided.',
    'Following Su\'s argument, suburban and temple sacrifices included all six dynastic dances.',
  ],
  s0128: [
    'Down to this the Emperor said: "The Offices of Zhou divides music for feasting sacrifice; the Book of Yu only sounds two suspended sets—searching antiquity, there is no argument for court bell-sets.',
    'The Emperor said: "The Offices of Zhou divides music for feasting sacrifice; the Book of Yu mentions only two suspended sets—antiquity offers no argument for full court bell-sets.',
  ],
  s0129: [
    'Why?',
    'Why?',
  ],
  s0130: [
    'Rites for serving men are elaborate; rites for serving spirits are simple.',
    'Rites for serving men are elaborate; rites for serving spirits are simple.',
  ],
  s0131: [
    'The Son of Heaven wears the highest robe, yet utmost reverence is without ornament; viewing all things under Heaven, nothing can match his virtue—therefore the few is honored.',
    'The Son of Heaven wears the highest robe, yet utmost reverence avoids ornament; nothing under Heaven matches his virtue—therefore less is more honorable.',
  ],
  s0132: [
    'Great combined music means making the six pitch pipes harmonize with the five tones, and the eight sounds harmonize in measure with the myriad dances—that is all.',
    'Great combined music means harmonizing the six pitch pipes with five tones and the eight sounds with the myriad dances—that is all.',
  ],
  s0133: [
    'How could it mean that reaching spirits and ghosts uses only the six dynastic dances?',
    'How could reaching spirits require only the six dynastic dances?',
  ],
  s0134: [
    'Immediately after it says \'music is divided and ordered, for sacrifice and for feasting.',
    'Immediately after it says \'music is divided and ordered for sacrifice and feasting.',
  ],
  s0135: [
    '" This is clearly evident—Su lost the point.',
    'This is clearly evident—Wang Su missed the point.',
  ],
  s0136: [
    'Searching records and canons, at first there is no text of the six dynastic dances performed throughout suburban, Yin, and ancestral temple rites.',
    'Searching records, there is no text requiring all six dynastic dances at suburban, Yin, and ancestral temple rites.',
  ],
  s0137: [
    'Only the Record of the Bright Hall says: \'At the great temple the Duke of Zhou was honored; with vermilion shafts and jade battle-axes, wearing the cap and dancing Great Wu; with leather cap and white lower garment, baring the arm and dancing Great Xia.',
    'Only the Record of the Bright Hall says: at the great temple the Duke of Zhou was honored—with vermilion shafts and jade axes they danced Great Wu; with leather cap and white garment they danced Great Xia.',
  ],
  s0138: [
    'Barbarian music of the Yi was admitted to the great temple—meaning to extend Lu\'s fame throughout the realm.',
    'Barbarian music was admitted to the great temple—meaning to extend Lu\'s fame throughout the realm.',
  ],
  s0139: [
    '" Sacrifice honors reverence; do not let music be numerous and ritual profaned.',
    'Sacrifice honors reverence; music must not be so numerous that ritual is profaned.',
  ],
  s0140: [
    'Therefore when the Ji clan held sacrifice until dark and followed it with candles, the officers leaned and sprawled.',
    'When the Ji clan held sacrifice until dark and followed with candles, the officers leaned and sprawled.',
  ],
  s0141: [
    'Their lack of reverence was very great.',
    'Their lack of reverence was extreme.',
  ],
  s0142: [
    'On another day at sacrifice, Zilu was present; it began at dawn and ended at morning court.',
    'At another sacrifice Zilu was present; it began at dawn and ended at morning court.',
  ],
  s0143: [
    'Confucius heard of it and said: "Who says You does not understand ritual?',
    'Confucius heard and said: "Who says You does not understand ritual?',
  ],
  s0144: [
    '" If one follows Su\'s argument, at the suburb there are both welcome and send-off music and ascent songs, each praising merit and virtue;',
    'If one follows Su\'s argument, the suburb has welcome and send-off music plus ascent songs praising merit and virtue;',
  ],
  s0145: [
    'all six dynastic dances follow entry and exit—one must wait for the music to end.',
    'all six dynastic dances accompany every entry and exit—one must wait for the music to finish.',
  ],
  s0146: [
    'This then departs from Zhongni\'s praise of ending at morning court.',
    'This departs from Confucius\'s praise of ending at morning court.',
  ],
  s0147: [
    '" Thereupon they did not provide court bell-sets, did not perform all six dynastic dances throughout, but provided only what each occasion required.',
    'Thereupon court bell-sets were not provided, the six dynastic dances were not performed throughout, and only what each occasion required was used.',
  ],
  s0148: [
    'When setting suspended sets, they were neither palace nor pavilion, neither half nor special—only what utmost reverence required should be used.',
    'When suspended sets were used, they were neither full palace nor pavilion sets, neither half nor special—only what utmost reverence required.',
  ],
  s0149: [
    'At the ancestral temple welcome and send-off music was omitted, because it is the sealed dwelling of spirits.',
    'The ancestral temple omitted welcome and send-off music, because it is the sealed dwelling of spirits.',
  ],
  s0150: [
    'In Qi\'s Yongming era, dancers wore caps and headbands with writing brushes inserted; the Emperor said: "Brush and tablet are for recording affairs and receiving words—dance does not receive words; why insert brushes?',
    'In Qi\'s Yongming era dancers wore caps with writing brushes; the Emperor said: "Brushes and tablets record affairs and receive words—dance receives no words; why insert brushes?',
  ],
  s0151: [
    'How could one wear court robes on the body yet have banquet slippers on the feet?',
    'How could one wear court robes yet have banquet slippers on the feet?',
  ],
  s0152: [
    '" Thereupon the brushes were removed.',
    'The brushes were removed.',
  ],
  s0153: [
    'Also in Jin and Song and Qi, suspended bells and chime-stones were broadly similar—all sixteen frames.',
    'In Jin, Song, and Qi, suspended bells and chime-stones were broadly similar—sixteen frames in all.',
  ],
  s0154: [
    'Palace of Huangzhong: north, facing north; arranged chime-stones starting west, east of them arranged bells, east of them a horizontal bell larger than the bo—unknown in which age made—east of it the bo bell.',
    'Huangzhong palace: north, facing north; chime-stones starting west, bells east of them, then a horizontal bell larger than the bo—of unknown age—then the bo bell.',
  ],
  s0155: [
    'Palace of Taicu: east, facing west, starting north.',
    'Taicu palace: east, facing west, starting from the north.',
  ],
  s0156: [
    'Palace of Ruibin: south, facing north, starting east.',
    'Ruibin palace: south, facing north, starting from the east.',
  ],
  s0157: [
    'Palace of Guxian: west, facing east, starting south.',
    'Guxian palace: west, facing east, starting from the south.',
  ],
  s0158: [
    'The order in each was as in the north face.',
    'The arrangement in each followed the north-facing pattern.',
  ],
  s0159: [
    'Establishing mounted drums at the four corners, within the suspension on all four sides, each had a wooden clapper and hand drum.',
    'Mounted drums stood at the four corners; within the suspension on all four sides were wooden clappers and hand drums.',
  ],
  s0160: [
    'The Emperor said: "Those writing Jin and Song history all say that in the fourth year of Taiyuan and Yuanjia, bells and stones in the four wings were fully complete.',
    'The Emperor said: "Jin and Song histories say that in Taiyuan and Yuanjia year 4, bells and stones in all four wings were complete.',
  ],
  s0161: [
    'Now checking the Music Office, there are only four sets: Huangzhong, Guxian, Ruibin, and Taicu.',
    'Checking the Music Office, only four sets remain: Huangzhong, Guxian, Ruibin, and Taicu.',
  ],
  s0162: [
    'The six pitch pipes are not complete—what is meant by four wings?',
    'The six pitch pipes are incomplete—what does four wings mean?',
  ],
  s0163: [
    'Where is the meaning in the text of complete music?',
    'Where is the meaning of complete music in this?',
  ],
  s0164: [
    '" Thereupon the horizontal bell was removed and twelve bo bells were set, each according to its earthly branch position, responding to its pitch pipe.',
    'The horizontal bell was removed and twelve bo bells were set, each at its earthly branch position responding to its pitch pipe.',
  ],
  s0165: [
    'For each bo bell, arranged bells and chime-stones were each set on one frame—36 frames in all.',
    'Each bo bell had arranged bells and chime-stones on one frame each—36 frames in total.',
  ],
  s0166: [
    'Mounted drums were planted at the four corners.',
    'Mounted drums were placed at the four corners.',
  ],
  s0167: [
    'Prepared for use at the New Year\'s Day great assembly.',
    'These were prepared for the New Year\'s Day great assembly.',
  ],
  s0168: [
    'They then fixed music for suburban Yin, ancestral temple, and the three court audiences—the martial dance as Great Zhuang Dance, taking the Changes\' saying "the great is strong," upright and great and the feelings of Heaven and Earth can be seen.',
    'They fixed music for suburban Yin, ancestral temple, and three court audiences—the martial dance as Great Zhuang Dance, from the Changes: "the great is strong"—upright and great, the feelings of Heaven and Earth visible.',
  ],
  s0169: [
    'The civil dance as Great Guan Dance, taking the Changes\' saying "great contemplation above," contemplating Heaven\'s spirit Way and the four seasons without error.',
    'The civil dance as Great Guan Dance, from the Changes: "great contemplation above"—contemplating Heaven\'s Way so the four seasons never err.',
  ],
  s0170: [
    'State music takes "Ya" as its title, taking the Preface to the Odes: "Speaking of affairs under Heaven, giving form to winds of the four directions—this is called Ya.',
    'State music takes Ya as its title, from the Odes Preface: "Speaking of affairs under Heaven, giving form to the winds of the four directions—this is called Ya.',
  ],
  s0171: [
    'Ya means upright.',
    'Ya means upright.',
  ],
  s0172: [
    '" Stopping at twelve—then the number of Heaven.',
    'Stopping at twelve—that is Heaven\'s number.',
  ],
  s0173: [
    'They removed the music of ascending steps and added Ya for removing the feast.',
    'They removed the music for ascending steps and added Ya music for clearing the feast.',
  ],
  s0174: [
    'When officials entered and exited, the Song Yuanhui year 3 Ritual Regulations played Suwei Music; Qi and early Liang were the same.',
    'When officials entered and exited, Song\'s Yuanhui year 3 Ritual Regulations played Suwei Music; Qi and early Liang did the same.',
  ],
  s0175: [
    'At this time it was changed to Jun Ya, taking the Record of Rites: "The Minister of Education selects outstanding scholars of the district and promotes them to the academy—they are called jun scholars."',
    'It was changed to Jun Ya, from the Record of Rites: "The Minister of Education selects outstanding district scholars and promotes them to the academy—they are called jun scholars."',
  ],
  s0176: [
    '" Used alike at the two suburbs, Grand Temple, Bright Hall, and three court audiences.',
    'Used alike at both suburbs, Grand Temple, Bright Hall, and three court audiences.',
  ],
  s0177: [
    'When the emperor entered and exited, the Song Xiaojian year 2 autumn Daily Records played Yong Zhi; Qi and early Liang were the same.',
    'When the emperor entered and exited, Song\'s Xiaojian year 2 Daily Records played Yong Zhi; Qi and early Liang did the same.',
  ],
  s0178: [
    'At this time it was changed to Huang Ya, taking the Odes "August is the Lord on High, overseeing below with splendor."',
    'It was changed to Huang Ya, from the Odes: "August is the Lord on High, overseeing below with splendor."',
  ],
  s0179: [
    'Used alike at the two suburbs and Grand Temple.',
    'Used at both suburbs and the Grand Temple.',
  ],
  s0180: [
    'When the crown prince entered and exited, Yin Ya was played, taking the Odes "the gentleman ten thousand years, forever grant you heirs."',
    'When the crown prince entered and exited, Yin Ya was played, from the Odes: "the gentleman ten thousand years, forever grant you heirs."',
  ],
  s0181: [
    'When kings and dukes entered and exited, Yin Ya was played, taking the Documents and Offices of Zhou "the two dukes spread transformation, reverently illumining Heaven and Earth."',
    'When kings and dukes entered and exited, Yin Ya was played, from the Documents and Offices of Zhou: "the two dukes spread transformation, reverently illumining Heaven and Earth."',
  ],
  s0182: [
    'At the longevity wine, Jie Ya was played, taking the Odes "the gentleman ten thousand years, grant you great blessing."',
    'At the longevity wine, Jie Ya was played, from the Odes: "the gentleman ten thousand years, grant you great blessing."',
  ],
  s0183: [
    'At the food presentation, Xu Ya was played, taking the Changes "clouds rise to Heaven—Xu; the gentleman thereby drinks and feasts with joy."',
    'At the food presentation, Xu Ya was played, from the Changes: "clouds rise to Heaven—Xu; the gentleman drinks and feasts with joy."',
  ],
  s0184: [
    'At clearing the dishes, Yong Ya was played, taking the Record of Rites "at the great feast when guests depart, Yong is played to clear."',
    'At clearing the dishes, Yong Ya was played, from the Record of Rites: "at the great feast when guests depart, Yong clears the dishes."',
  ],
  s0185: [
    '" All used at the three court audiences.',
    'All used at the three court audiences.',
  ],
  s0186: [
    'When victims entered and exited, the Song Yuanhui year 2 Ritual Regulations played Yin Sheng; Qi and early Liang were the same.',
    'When victims entered and exited, Song\'s Yuanhui year 2 Ritual Regulations played Yin Sheng; Qi and early Liang did the same.',
  ],
  s0187: [
    'At this time it was changed to Di Ya, taking the Record of Rites "the emperor\'s ox must be kept in the pen three months."',
    'It was changed to Di Ya, from the Record of Rites: "the emperor\'s ox must be kept in the pen three months."',
  ],
  s0188: [
    'At presenting hair and blood, the Song Yuanhui year 3 Ritual Regulations played Jia Jian; Qi and early Liang were the same.',
    'At presenting hair and blood, Song\'s Yuanhui year 3 Ritual Regulations played Jia Jian; Qi and early Liang did the same.',
  ],
  s0189: [
    'At this time it was changed to Quan Ya, taking the Zuo Tradition "victims fat and well-fleshed."',
    'It was changed to Quan Ya, from the Zuo Tradition: "victims fat and well-fleshed."',
  ],
  s0190: [
    'Northern suburb, Bright Hall, and Grand Temple all used the same.',
    'Northern suburb, Bright Hall, and Grand Temple all used the same pieces.',
  ],
  s0191: [
    'At sending down spirits and welcome and send-off, the Song Yuanhui year 3 Ritual Regulations played Zhao Xia; Qi and early Liang were the same.',
    'At sending down spirits and welcome and send-off, Song\'s Yuanhui year 3 Ritual Regulations played Zhao Xia; Qi and early Liang did the same.',
  ],
  s0192: [
    'At this time it was changed to Cheng Ya, taking the Documents "utmost sincerity moves the spirits."',
    'It was changed to Cheng Ya, from the Documents: "utmost sincerity moves the spirits."',
  ],
  s0193: [
    'When the emperor drank the blessing wine, the Song Yuanhui year 3 Ritual Regulations played Jia Zuo; through Qi unchanged; in early Liang changed to Yong Zuo.',
    'When the emperor drank the blessing wine, Song\'s Yuanhui year 3 Ritual Regulations played Jia Zuo; Qi kept it; early Liang changed it to Yong Zuo.',
  ],
  s0194: [
    'At this time it was changed to Xian Ya, taking the Record of Rites Sacrificial Regulated "the impersonator drinks five; the ruler washes the jade goblet and presents to the minister."',
    'It was changed to Xian Ya, from the Record of Rites Sacrificial Regulated: "the impersonator drinks five; the ruler washes the jade goblet and presents to the minister."',
  ],
  s0195: [
    'Today\'s blessing wine also carries the meaning of ancient presentation.',
    'Today\'s blessing wine also preserves the meaning of ancient presentation.',
  ],
  s0196: [
    'Northern suburb, Bright Hall, and Grand Temple used the same.',
    'Northern suburb, Bright Hall, and Grand Temple used the same piece.',
  ],
  s0197: [
    'At the burning position, the Song Yuanhui year 3 Ritual Regulations played Zhao Yuan; Qi and Liang unchanged.',
    'At the burning position, Song\'s Yuanhui year 3 Ritual Regulations played Zhao Yuan; Qi and Liang kept it.',
  ],
  s0198: [
    'At the burial position, Qi\'s Yongming year 6 Ritual Regulations played Li You.',
    'At the burial position, Qi\'s Yongming year 6 Ritual Regulations played Li You.',
  ],
  s0199: [
    'At this time both burning and burial played Yin Ya, taking the Rites of Zhou Grand Minister of Rites "with Yin sacrifice one sacrifices to August Heaven the Lord on High."',
    'Both burning and burial now played Yin Ya, from the Rites of Zhou: "with Yin sacrifice one sacrifices to August Heaven the Lord on High."',
  ],
  s0200: [
    'Their texts were all composed by Shen Yue.',
    'Their lyrics were all composed by Shen Yue.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-013-batch2.mjs <translation.json>');
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
