#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Suishu ch.006) */
import { readFileSync, writeFileSync } from 'fs';

const transPath = 'translations/current_translation_suishu.json';

const T = {
  s0101: {
    literal: 'Now to use once and then bury—wasteful and contrary to the canon.',
    idiomatic: 'To bury vessels after a single use would be wasteful and contrary to canonical practice.',
  },
  s0102: {
    literal: 'The Emperor said: "The offering mats are light objects; pottery and gourd are humble vessels—if returned to the storehouse, they might again become defiled."',
    idiomatic: 'The emperor said: "Offering mats are light goods and pottery humble vessels—if returned to store they might become defiled again."',
  },
  s0103: {
    literal: 'Only when worn out should they be buried—this refers to the seasonal sacrificial vessels.',
    idiomatic: 'They should be buried only when worn out—this applies to the seasonal sacrificial vessels alone."',
  },
  s0104: {
    literal: '" From this they followed the relevant offices\' deliberation and burned and buried them.',
    idiomatic: 'Thereafter they followed the relevant offices\' proposal and burned and buried the vessels.',
  },
  s0105: {
    literal: 'In the fourth year, Tongzhi said: "The Rites of Zhou say \'Heaven is called spirit; Earth is called numen.\'"',
    idiomatic: 'In the fourth year, Tongzhi said: "The Rites of Zhou state, \'Heaven is called spirit; Earth is called numen.\'"',
  },
  s0106: {
    literal: 'Today Heaven is not called spirit, Earth is not called numen; the Heaven banner inscription should read "Seat of August Heaven," the Earth banner "Seat of Queen Earth."',
    idiomatic: 'Today Heaven is not styled spirit nor Earth numen; the Heaven banner should read "Seat of August Heaven," the Earth banner "Seat of Queen Earth."',
  },
  s0107: {
    literal: 'Also the Southern Suburb and Bright Hall use agarwood incense—taking the substance of Heaven, what yang should use.',
    idiomatic: 'The Southern Suburb and Bright Hall also use agarwood incense—appropriate to Heaven\'s nature and the yang principle.',
  },
  s0108: {
    literal: 'The Northern Suburb uses superior blended incense—since Earth is close to man, mixed fragrance is appropriate.',
    idiomatic: 'The Northern Suburb uses superior blended incense—since Earth is kin to humanity, a mixed fragrance is fitting.',
  },
  s0109: {
    literal: '" The Emperor followed all of this.',
    idiomatic: 'The emperor accepted all of these proposals.',
  },
  s0110: {
    literal: 'In the fifth year, Ming Shanbin stated: "Examining the imperial decree: Zhou used the eleventh month to sacrifice to Heaven, the fifth month to sacrifice to Earth."',
    idiomatic: 'In the fifth year, Ming Shanbin stated: "Examining the imperial decree: Zhou sacrificed to Heaven in the eleventh month and to Earth in the fifth."',
  },
  s0111: {
    literal: 'Yin used the twelfth month to sacrifice to Heaven, the sixth month to sacrifice to Earth.',
    idiomatic: 'Yin sacrificed to Heaven in the twelfth month and to Earth in the sixth.',
  },
  s0112: {
    literal: 'Xia used the first month to sacrifice to Heaven, the seventh month to sacrifice to Earth.',
    idiomatic: 'Xia sacrificed to Heaven in the first month and to Earth in the seventh.',
  },
  s0113: {
    literal: 'In recent generations, the Northern and Southern suburbs both used the Xia first month.',
    idiomatic: 'In recent generations both suburban rites used the Xia first month.',
  },
  s0114: {
    literal: '" An edict ordered further detailed deliberation.',
    idiomatic: 'An edict ordered further detailed deliberation.',
  },
  s0115: {
    literal: 'Shanbin held that both ceremonies are equally exalted; the three courts\' celebration of the year\'s beginning—using this day for both suburbs is acceptable.',
    idiomatic: 'Shanbin held that both ceremonies are equally exalted; since the three courts celebrate the year\'s beginning on this day, performing both suburban rites then is acceptable.',
  },
  s0116: {
    literal: 'Also requesting to welcome the Five Emperors at the suburb—all with the Founding Ancestor as associate in the feast.',
    idiomatic: 'He also proposed welcoming the Five Emperors at the suburb, all with the Founding Ancestor as associate in the feast.',
  },
  s0117: {
    literal: 'When receiving blessings at the suburb and temple, only the emperor performs the double bow—the upper spirits bestow grace; ministers and subjects dare not share it.',
    idiomatic: 'When receiving blessings at the suburban and temple rites, only the emperor performs the double bow—the upper spirits bestow grace, and ministers dare not share in it.',
  },
  s0118: {
    literal: '" An edict approved all according to deliberation.',
    idiomatic: 'An edict approved all according to deliberation.',
  },
  s0119: {
    literal: 'In the sixth year, debaters held that the Northern Suburb had seats for sacred mountains, guardian peaks, seas, and rivers—and also seats for the Four Outlooks—suspecting this was redundant.',
    idiomatic: 'In the sixth year, debaters noted that the Northern Suburb had seats for sacred mountains, guardian peaks, seas, and rivers—and also seats for the Four Outlooks—deeming this redundant.',
  },
  s0120: {
    literal: 'Director of Ritual Affairs Zhu Yi deliberated: "Outlook is a name for what is not approached directly—how can it be confined to stars and seas, bound to mountains and rivers?"',
    idiomatic: 'Director of Ritual Affairs Zhu Yi argued: "An outlook sacrifice addresses what cannot be approached directly—how can it be confined to stars and seas, bound to mountains and rivers?"',
  },
  s0121: {
    literal: '" Ming Shanbin said: "The Canon of Shun says \'outlook toward mountains and rivers.\'"',
    idiomatic: 'Ming Shanbin said: "The Canon of Shun records \'outlook toward mountains and rivers.\'"',
  },
  s0122: {
    literal: 'The Spring and Autumn Annals say "The Jiang, Han, Ju, and Zhang—Chu\'s outlooks."',
    idiomatic: 'The Spring and Autumn Annals state: "The Jiang, Han, Ju, and Zhang are Chu\'s outlooks."',
  },
  s0123: {
    literal: 'Yet today the Northern Suburb sets up sacred mountains, seas, and rivers, and also establishes the Four Outlooks—I venture to say this is excessive and should be reduced.',
    idiomatic: 'Yet today the Northern Suburb sets up sacred mountains, seas, and rivers and also the Four Outlooks—I submit this is excessive and should be reduced.',
  },
  s0124: {
    literal: '" Xu Mian said: "Sacred mountains and rivers are the lords of mountains and rivers."',
    idiomatic: 'Xu Mian said: "Sacred mountains and rivers are the lords of all mountains and rivers."',
  },
  s0125: {
    literal: 'As for the meaning of outlook sacrifice—it is not limited to sacred mountains and rivers.',
    idiomatic: 'As for the meaning of outlook sacrifice—it is not limited to sacred mountains and rivers alone.',
  },
  s0126: {
    literal: 'If the Four Outlooks are reduced—in principle this is wrong.',
    idiomatic: 'To eliminate the Four Outlooks would be ritually improper.',
  },
  s0127: {
    literal: 'Deliberation long could not be decided.',
    idiomatic: 'Deliberation continued without resolution.',
  },
  s0128: {
    literal: 'In the sixteenth year, when the Northern Suburb ceremony was performed, the Emperor again sent down the deliberation.',
    idiomatic: 'In the sixteenth year, when the Northern Suburb rite was performed, the emperor reopened the deliberation.',
  },
  s0129: {
    literal: 'Thereupon the Eight Ministers memorialized to reduce the Four Outlooks, Song River, Zhe River, Five Lakes, and other seats.',
    idiomatic: 'The Eight Ministers then memorialized to eliminate the Four Outlooks, Song River, Zhe River, Five Lakes, and other seats.',
  },
  s0130: {
    literal: 'Mount Zhong and Mount Baishi—since they were in the local territory—were both retained as before.',
    idiomatic: 'Mount Zhong and Mount Baishi, being within the local territory, were both retained.',
  },
  s0131: {
    literal: 'In the seventh year, the Emperor held that one offering is substance, three offerings are ornament—in the Way of serving Heaven, principle should not be so; an edict ordered detailed deliberation.',
    idiomatic: 'In the seventh year, the emperor held that one offering represents substance and three represent ornament—in serving Heaven this is improper; he ordered detailed deliberation.',
  },
  s0132: {
    literal: 'Erudite Lu Wei, Ming Shanbin, and Director of Ritual Affairs Sima Jiong held: "The ancestral temple\'s three offerings combine the meaning of minister and subject; the upper Heaven\'s rite centers on the emperor and king—according to principle and extending meaning, one offering is acceptable."',
    idiomatic: 'Erudite Lu Wei, Ming Shanbin, and Director of Ritual Affairs Sima Jiong argued: "The ancestral temple\'s three offerings include ministers and subjects; the rite to upper Heaven centers on the emperor—on principle, one offering suffices."',
  },
  s0133: {
    literal: 'From this, sacrifices to Heaven and Earth were all one offering—beginning to eliminate the Grand Commandant as second offerer and the Director of Imperial Sacrifices as final offerer.',
    idiomatic: 'Henceforth sacrifices to Heaven and Earth used a single offering—the Grand Commandant as second offerer and the Director of Imperial Sacrifices as final offerer were eliminated.',
  },
  s0134: {
    literal: 'Also Assistant Director of the Grand Master of Ceremonies Wang Sengchong stated: "The Five Sacrifices\' positions are at the Northern Suburb—the Round Mound should not duplicate them."',
    idiomatic: 'Assistant Director Wang Sengchong stated: "The Five Sacrifices belong at the Northern Suburb—the Round Mound should not duplicate them."',
  },
  s0135: {
    literal: '" The Emperor said: "The qi of the Five Phases—Heaven and Earth both have them—therefore both should be followed."',
    idiomatic: 'The emperor said: "The qi of the Five Phases exist in both Heaven and Earth—both altars should include them."',
  },
  s0136: {
    literal: 'Sengchong again said: "Wind Lord and Rain Master are the stars Ji and Bi."',
    idiomatic: 'Sengchong added: "Wind Lord and Rain Master are the stars Ji and Bi."',
  },
  s0137: {
    literal: 'Yet today the Southern Suburb sacrifices to the two stars Ji and Bi, and again sacrifices to Wind Master and Rain Master—I fear this departs from the sacrificial canon.',
    idiomatic: 'Yet the Southern Suburb sacrifices to Ji and Bi and also to Wind Master and Rain Master—I fear this departs from canonical practice.',
  },
  s0138: {
    literal: '" The Emperor said: "Ji and Bi are naturally names of the Twenty-eight Lodges; Wind Master and Rain Master are naturally subordinates beneath Ji and Bi stars."',
    idiomatic: 'The emperor replied: "Ji and Bi are names within the Twenty-eight Lodges; Wind Master and Rain Master are subordinates of those stars."',
  },
  s0139: {
    literal: 'Two sacrifices are not objectionable.',
    idiomatic: 'Two separate sacrifices are not improper.',
  },
  s0140: {
    literal: '"',
    idiomatic: '(End of edict.)',
  },
  s0141: {
    literal: 'In the eleventh year, the Grand Invocator submitted: the Northern Suburb had only one sea; and the two suburbs in succession used seven-tray stands for victims, plain tables to bear jade.',
    idiomatic: 'In the eleventh year, the Grand Invocator submitted: the Northern Suburb had only one sea altar; both suburban rites used seven-tray stands for victims and plain tables to bear jade.',
  },
  s0142: {
    literal: 'Also regulations were made for the seats of the multitude of spirits below the Northern and Southern suburb altars—all using white thatch; an edict ordered detailed deliberation.',
    idiomatic: 'Regulations were also made for spirit seats below the suburban altars—all using white thatch; the emperor ordered detailed deliberation.',
  },
  s0143: {
    literal: 'The Eight Ministers memorialized: "The Rites say \'observe the things under Heaven—none can be called worthy of its virtue\'—from this one knows that using seven-tray stands for suburban sacrifice is improper in principle."',
    idiomatic: 'The Eight Ministers memorialized: "The Rites say \'observe all things under Heaven—none can be called worthy of Heaven\'s virtue\'—hence seven-tray stands are improper for suburban sacrifice."',
  },
  s0144: {
    literal: 'Also using white thatch as mats—the Rites give no source for this.',
    idiomatic: 'Using white thatch as mats likewise lacks canonical precedent.',
  },
  s0145: {
    literal: 'The seat of the August Heaven Supreme Lord already uses stands— from this one knows the suburb has the meaning of stands.',
    idiomatic: 'Since the August Heaven Supreme Lord\'s seat already uses stands, the suburban rite properly employs stands.',
  },
  s0146: {
    literal: '" Thereupon plain stands were adopted, and the Northern Suburb was given Four Seas seats.',
    idiomatic: 'Plain stands were adopted, and the Northern Suburb was given Four Seas seats.',
  },
  s0147: {
    literal: 'Below the Five Emperors, all used rush mats and straw offering mats, and all used plain stands.',
    idiomatic: 'Below the Five Emperors, all used rush mats and straw offering mats with plain stands.',
  },
  s0148: {
    literal: 'Also the Emperor said: "The Rites \'sacrifice to the moon in a pit\'— truly because the moon is yin in meaning."',
    idiomatic: 'The emperor also said: "The Rites prescribe sacrificing to the moon in a pit—because the moon embodies yin."',
  },
  s0149: {
    literal: 'Now the Five Emperors are celestial spirits—yet they are placed in pits.',
    idiomatic: 'Yet the Five Emperors are celestial spirits—yet they are placed in pits.',
  },
  s0150: {
    literal: 'Also the Rites say \'sacrifice to the sun on an altar, sacrifice to the moon in a pit\'—both are separate sacrifices, unrelated to the suburb—therefore each follows yin and yang, establishing altar and pit.',
    idiomatic: 'The Rites also say \'sacrifice to the sun on an altar, the moon in a pit\'—these are separate rites, unrelated to the suburb—each follows yin and yang in establishing altar and pit.',
  },
  s0151: {
    literal: 'The site at the Southern Suburb takes the yang meaning; dwelling at the Northern Suburb takes the yin meaning.',
    idiomatic: 'The Southern Suburb site follows the yang principle; the Northern Suburb, the yin.',
  },
  s0152: {
    literal: 'Since it is said to take yang, the meaning differs from yin.',
    idiomatic: 'Since the rite takes the yang position, its meaning differs from yin.',
  },
  s0153: {
    literal: 'Stars, moon, and sacrifice—in principle should not be in pits.',
    idiomatic: 'Stars, the moon, and associated sacrifices should not occupy pits.',
  },
  s0154: {
    literal: '" The Eight Ministers memorialized: "The meaning of the Five Emperors should not be in pits."',
    idiomatic: 'The Eight Ministers replied: "The Five Emperors should not occupy pit-seats."',
  },
  s0155: {
    literal: 'Truly because the Qi dynasty\'s Round Mound was small and steep, at the edge there was no place to settle the spirits.',
    idiomatic: 'This was because the Qi Round Mound was small and steep, with no room at the edge to settle the spirits.',
  },
  s0156: {
    literal: 'Now the mound\'s form is already large—it is easy to take settling places.',
    idiomatic: 'Now the mound is larger and can accommodate them properly.',
  },
  s0157: {
    literal: 'Request that the Five Emperors\' seats all be on the altar; the outer enclosure\'s Twenty-eight Lodges and Rain Master and other seats—all cease being pits.',
    idiomatic: 'We propose placing all Five Emperors\' seats on the altar; the outer enclosure\'s Twenty-eight Lodges, Rain Master, and others should no longer use pits.',
  },
  s0158: {
    literal: '" From this the Northern and Southern suburbs both had no pit positions.',
    idiomatic: 'Henceforth neither suburban altar used pit-seats.',
  },
  s0159: {
    literal: 'In the seventeenth year, the Emperor held that Weiyang and Po Bao are both Heavenly Emperors—on the altar they are exalted, below they are humble.',
    idiomatic: 'In the seventeenth year, the emperor held that Weiyang and Po Bao are both Heavenly Emperors—exalted on the altar yet humble below.',
  },
  s0160: {
    literal: 'Also the Celestial Emperor sacrificed to at the Southern Suburb—the Five Emperors separately had Bright Hall sacrifice—no need to duplicate setup.',
    idiomatic: 'The Celestial Emperor sacrificed to at the Southern Suburb; the Five Emperors had separate Bright Hall rites—no need to duplicate them.',
  },
  s0161: {
    literal: 'Also the suburban sacrifice to the Twenty-eight Lodges but without the Twelve Branches—in principle this was deficient.',
    idiomatic: 'The suburban sacrifice included the Twenty-eight Lodges but omitted the Twelve Branches—a ritual deficiency.',
  },
  s0162: {
    literal: 'Thereupon the Southern Suburb first removed Five Emperors sacrifice, added Twelve Branches seats, and with the Twenty-eight Lodges each in its direction made altars.',
    idiomatic: 'The Southern Suburb then eliminated Five Emperors sacrifice, added Twelve Branches seats, and with the Twenty-eight Lodges established altars in their respective directions.',
  },
  s0163: {
    literal: 'Chen regulations also used alternate years.',
    idiomatic: 'Chen regulations also used alternate years.',
  },
  s0164: {
    literal: 'On the first xin of the first month, one special bull was used; Heaven and Earth were sacrificed to at the Northern and Southern suburbs.',
    idiomatic: 'On the first xin day of the first month, a single bull was offered; Heaven and Earth were sacrificed to at the Northern and Southern suburbs.',
  },
  s0165: {
    literal: 'In the first year of Yongding, Emperor Wu received the abdication, restored the Southern Suburb—a round altar two zhang two chi five cun high, upper width ten zhang; firewood burning to announce to Heaven.',
    idiomatic: 'In Yongding 1, Emperor Wu accepted the abdication and restored the Southern Suburb—a round altar two zhang two chi five cun high and ten zhang across at the top, with firewood burning to announce to Heaven.',
  },
  s0166: {
    literal: 'The next year on the first xin of the first month, the Southern Suburb ceremony was performed—with the deceased father Virtue Emperor as associate; the Twelve Branches seats were removed and Five Emperors positions added; the rest followed Liang precedent.',
    idiomatic: 'The following first xin day of the first month, the Southern Suburb rite was performed with the deceased Virtue Emperor as associate; Twelve Branches seats were removed and Five Emperors added; the rest followed Liang precedent.',
  },
  s0167: {
    literal: 'The Northern Suburb altar was one zhang five chi high, eight zhang wide—with the deceased mother Empress Zhao as associate; associated sacrifices also followed Liang precedent.',
    idiomatic: 'The Northern Suburb altar stood one zhang five chi high and eight zhang wide, with the deceased Empress Zhao as associate; associated sacrifices followed Liang precedent.',
  },
  s0168: {
    literal: 'In Emperor Wen\'s Tianjia era, the Southern Suburb changed to use the High Ancestor as associate; the Northern Suburb used the Virtue Emperor to associate with Heaven.',
    idiomatic: 'Under Emperor Wen in the Tianjia era, the Southern Suburb used the High Ancestor as associate; the Northern Suburb paired the Virtue Emperor with Heaven.',
  },
  s0169: {
    literal: 'Grand Master of Ceremonies, Director of the Grand Secretariat, Acting Director of the Grand Master of Ceremonies Xu Heng memorialized: "Formerly Emperor Wu of Liang said: \'Heaven\'s number is five; Earth\'s number is five—the qi of the Five Phases, Heaven and Earth both have them.\'"',
    idiomatic: 'Grand Master Xu Heng memorialized: "Formerly Emperor Wu of Liang said: \'Heaven\'s number is five; Earth\'s number is five—the qi of the Five Phases exist in both Heaven and Earth.\'"',
  },
  s0170: {
    literal: 'Therefore within the Northern and Southern suburbs, the Five Sacrifices are both sacrificed to.',
    idiomatic: 'Therefore both suburban altars included the Five Sacrifices.',
  },
  s0171: {
    literal: 'Your subject examines the Rites of Zhou: \'with blood sacrifice to the altars of soil and grain and the Five Sacrifices.\'"',
    idiomatic: 'I examine the Rites of Zhou: \'with blood sacrifice to the altars of soil and grain and the Five Sacrifices.\'"',
  },
  s0172: {
    literal: 'Zheng Xuan says: \'Yin sacrifice begins with blood—honoring the qi\'s fragrance.\'"',
    idiomatic: 'Zheng Xuan explains: \'Yin sacrifice begins with blood—honoring the fragrance of qi.\'"',
  },
  s0173: {
    literal: 'Five Sacrifices are the spirits of the Five Officials.',
    idiomatic: 'The Five Sacrifices are the spirits of the Five Officials.',
  },
  s0174: {
    literal: 'The Five Spirits govern the Five Phases, subordinate to Earth—therefore together with burial, immersion, and substitute victims they are yin sacrifices.',
    idiomatic: 'The Five Spirits govern the Five Phases and are subordinate to Earth—together with burial, immersion, and substitute victims they constitute yin sacrifices.',
  },
  s0175: {
    literal: 'Since they are not firewood burning, they have no relation to yang sacrifice.',
    idiomatic: 'Since they do not involve firewood burning, they have no connection to yang sacrifice.',
  },
  s0176: {
    literal: 'Therefore He Xiu says: \'Zhou\'s five ranks of nobility—modeling Earth\'s having the Five Phases.\'"',
    idiomatic: 'He Xiu therefore says: \'Zhou\'s five ranks of nobility model Earth\'s Five Phases.\'"',
  },
  s0177: {
    literal: 'The Five Spirits\' positions are at the Northern Suburb—the Round Mound should not duplicate setup.',
    idiomatic: 'The Five Spirits belong at the Northern Suburb—the Round Mound should not duplicate them.',
  },
  s0178: {
    literal: '" The decree said: "Approved."',
    idiomatic: 'The decree read: "Approved."',
  },
  s0179: {
    literal: 'Heng again memorialized: "Emperor Wu of Liang\'s deliberation: Ji and Bi are naturally names of the Twenty-eight Lodges; Wind Master and Rain Master are naturally subordinates beneath Ji and Bi—not the stars themselves."',
    idiomatic: 'Heng memorialized again: "Emperor Wu of Liang held that Ji and Bi are names within the Twenty-eight Lodges; Wind Master and Rain Master are subordinates beneath them—not the stars themselves."',
  },
  s0180: {
    literal: 'Therefore at the suburban rain-prayer places—all are rain sacrifices.',
    idiomatic: 'Therefore at suburban rain-prayer sites—all are rain sacrifices.',
  },
  s0181: {
    literal: 'Your subject examines the Rites of Zhou Grand Master of Ceremonies\' duties: \'burning sacrifice to the Director of the Center, Director of Fate, Wind Master, Rain Master.\'"',
    idiomatic: 'I examine the Rites of Zhou: the Grand Master of Ceremonies \'burns sacrifice to the Director of the Center, Director of Fate, Wind Master, and Rain Master.\'"',
  },
  s0182: {
    literal: 'Zheng Zhong says: \'Wind Master is Ji;',
    idiomatic: 'Zheng Zhong explains: \'Wind Master is Ji;',
  },
  s0183: {
    literal: 'Rain Master is Bi.\'"',
    idiomatic: 'Rain Master is Bi.\'"',
  },
  s0184: {
    literal: 'The Odes say: \'The moon passes Bi—bringing great rain.\'"',
    idiomatic: 'The Odes say: \'The moon passes Bi—bringing torrential rain.\'"',
  },
  s0185: {
    literal: 'Like this, then Wind Lord and Rain Master are the stars Ji and Bi.',
    idiomatic: 'On this basis, Wind Lord and Rain Master are the stars Ji and Bi.',
  },
  s0186: {
    literal: 'Yet today the Southern Suburb sacrifices to the two stars Ji and Bi, and again sacrifices to Wind Lord and Rain Master—I fear this departs from the sacrificial canon.',
    idiomatic: 'Yet the Southern Suburb sacrifices to Ji and Bi and also to Wind Lord and Rain Master—I fear this departs from canonical practice.',
  },
  s0187: {
    literal: '" The decree said: "If the suburb sets up star positions, remove them as appropriate."',
    idiomatic: 'The decree read: "If the suburban altar sets up star positions, remove them accordingly."',
  },
  s0188: {
    literal: 'Heng again memorialized: "The Liang ritual regulations say: \'One offering is substance; three offerings are ornament."',
    idiomatic: 'Heng memorialized again: "The Liang ritual regulations state: \'One offering is substance; three offerings are ornament.\'"',
  },
  s0189: {
    literal: 'The affair of serving Heaven—therefore not three offerings.\'"',
    idiomatic: 'The rite of serving Heaven—therefore not three offerings.\'"',
  },
  s0190: {
    literal: 'Your subject examines the Rites of Zhou Director of Vessels\' statement—three offerings applied to the ancestral temple; yet Zheng\'s commentary: \'one offering applied to the multitude of small sacrifices.\'"',
    idiomatic: 'I examine the Rites of Zhou Director of Vessels: three offerings apply to the ancestral temple; Zheng\'s commentary adds, \'one offering applies to minor sacrifices.\'"',
  },
  s0191: {
    literal: 'Now using the small sacrifice\'s rite for the Heavenly Spirit Supreme Lord—Emperor Wu of Liang\'s meaning here is incoherent.',
    idiomatic: 'To apply the minor sacrifice rite to the Heavenly Spirit Supreme Lord—Emperor Wu of Liang\'s reasoning here is incoherent.',
  },
  s0192: {
    literal: 'Also vessel and stand objects depend on substance and ornament; bowing and offering rites center on reverent respect.',
    idiomatic: 'Vessels and stands depend on substance and ornament; bowing and offering center on reverent respect.',
  },
  s0193: {
    literal: 'Now requesting that all suburban and mound sacrifices follow the ancestral temple—three offerings is acceptable.',
    idiomatic: 'We propose that all suburban and mound sacrifices follow the ancestral temple model—three offerings is appropriate.',
  },
  s0194: {
    literal: '" The decree said: "Follow deliberation."',
    idiomatic: 'The decree read: "Follow deliberation."',
  },
  s0195: {
    literal: '"',
    idiomatic: '(End of memorial.)',
  },
  s0196: {
    literal: 'In Emperor Fei\'s Guangda era, Empress Zhao was again paired at the Northern Suburb.',
    idiomatic: 'Under Emperor Fei in the Guangda era, Empress Zhao was again paired at the Northern Suburb.',
  },
  s0197: {
    literal: 'When Emperor Xuan succeeded to the throne, because the Northern and Southern suburbs were low and small, further deliberation was held to enlarge them.',
    idiomatic: 'When Emperor Xuan succeeded, finding the suburban altars too low and small, he ordered deliberation to enlarge them.',
  },
  s0198: {
    literal: 'Long without decision.',
    idiomatic: 'Deliberation continued without resolution.',
  },
  s0199: {
    literal: 'In the eleventh year of Taijian, Director of the Sacrificial Department Wang Yuangui deliberated:',
    idiomatic: 'In Taijian 11, Director of the Sacrificial Department Wang Yuangui submitted:',
  },
  s0200: {
    literal: ': Examining the Former Han Yellow Chart, the Supreme Lord altar diameter five zhang, height nine chi;',
    idiomatic: 'Examining the Former Han Yellow Chart: the Supreme Lord altar was five zhang in diameter and nine chi high;',
  },
};

const data = JSON.parse(readFileSync(transPath, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', transPath);
