#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Suishu ch.006) */
import { readFileSync, writeFileSync } from 'fs';

const transPath = 'translations/current_translation_suishu.json';

const T = {
  s0301: {
    literal: 'Supreme Lord and Sun and Moon on the mound\'s second tier; Northern Dipper, Five Stars, Twelve Branches, River Han, and inner officials on the third tier; Twenty-eight Lodges and central officials on the fourth tier; outer officials within the inner enclosure; multitude of stars outside the inner enclosure.',
    idiomatic: 'Supreme Lord, Sun, and Moon occupied the mound\'s second tier; Northern Dipper, Five Stars, Twelve Branches, River Han, and inner officials the third; Twenty-eight Lodges and central officials the fourth; outer officials within the inner enclosure; the multitude of stars outside it.',
  },
  s0302: {
    literal: 'Victims: Supreme Lord and associate lords used two dark calves; Five Emperors and Sun and Moon each one direction-colored calf; Five Stars and below used nine sheep and nine pigs each.',
    idiomatic: 'Victims: Supreme Lord and associate lords received two dark calves; Five Emperors and Sun and Moon each one direction-colored calf; Five Stars and below, nine sheep and nine pigs each.',
  },
  s0303: {
    literal: 'A Square Mound was made fourteen li north of the palace city.',
    idiomatic: 'A Square Mound was erected fourteen li north of the palace city.',
  },
  s0304: {
    literal: 'The mound had two tiers; each tier five chi high; lower tier ten zhang square; upper tier five zhang square.',
    idiomatic: 'The mound had two tiers, each five chi high: the lower ten zhang square, the upper five zhang square.',
  },
  s0305: {
    literal: 'On the summer solstice, Queen Earth Numen was sacrificed to upon it, with the Founding Ancestor as associate.',
    idiomatic: 'On the summer solstice, Queen Earth Numen was sacrificed to upon it, with the Founding Ancestor as associate.',
  },
  s0306: {
    literal: 'Spirit of the Central Land, Ying Province, Ji Province, Rong Province, Shi Province, Zhu Province, Ying Province, Xian Province, Yang Province—Nine Provinces\' mountains, seas, rivers, forests, marshes, mounds, tombs, plains, and lowlands—all were associated sacrifices.',
    idiomatic: 'Spirit of the Central Land and the Nine Provinces\' mountains, seas, rivers, forests, marshes, mounds, tombs, plains, and lowlands—all received associated sacrifice.',
  },
  s0307: {
    literal: 'Queen Earth Numen and associate lords on the altar used two yellow calves.',
    idiomatic: 'Queen Earth Numen and associate lords on the altar received two yellow calves.',
  },
  s0308: {
    literal: 'Spirit of the Central Land and Nine Provinces spirit seats on the second tier between the eight sets of steps: Spirit of the Central Land southeast; Ying Province south; Ji and Rong Provinces southwest; Shi Province west; Zhu Province northwest; Ying Province north; Xian Province northeast; Yang Province east—each used one direction-colored calf.',
    idiomatic: 'Spirit of the Central Land and Nine Provinces occupied the second tier between eight sets of steps: Spirit of the Central Land southeast; Ying Province south; Ji and Rong southwest; Shi west; Zhu northwest; Ying north; Xian northeast; Yang east—each with one direction-colored calf.',
  },
  s0309: {
    literal: 'Nine Provinces\' mountains, seas, and below—each according to its direction between the eight sets of steps.',
    idiomatic: 'Nine Provinces\' mountains, seas, and below were placed according to direction between the eight sets of steps.',
  },
  s0310: {
    literal: 'Ji Province\'s mountains, forests, rivers, and marshes, mounds, tombs, and plains—south of the altar, slightly west—added nine sheep and nine pigs.',
    idiomatic: 'Ji Province\'s mountains, forests, rivers, marshes, mounds, tombs, and plains—south of the altar, slightly west—received an additional nine sheep and nine pigs.',
  },
  s0311: {
    literal: 'Southern Suburb altar south of the capital, one li west of the road outside the Taiyang Gate.',
    idiomatic: 'The Southern Suburb altar stood south of the capital, one li west of the road outside the Taiyang Gate.',
  },
  s0312: {
    literal: 'Ten li from the palace.',
    idiomatic: 'It stood ten li from the palace.',
  },
  s0313: {
    literal: 'Altar seven chi high, four zhang wide.',
    idiomatic: 'The altar was seven chi high and four zhang wide.',
  },
  s0314: {
    literal: 'On the first xin of the first spring month, the Responsive Emperor Chibenu was sacrificed to upon it, with Founding Ancestor Emperor Wuyuan as associate.',
    idiomatic: 'On the first xin day of the first spring month, the Responsive Emperor Chibenu was sacrificed to upon it, with Founding Ancestor Emperor Wuyuan as associate.',
  },
  s0315: {
    literal: 'The rite used four gui with base; victims used two red calves.',
    idiomatic: 'The rite used four gui jade tablets with base; victims were two red calves.',
  },
  s0316: {
    literal: 'Northern Suburb in the first winter month sacrificed to the Spirit of the Central Land, with Founding Ancestor Emperor Wuyuan as associate.',
    idiomatic: 'In the first winter month the Northern Suburb sacrificed to the Spirit of the Central Land, with Founding Ancestor Emperor Wuyuan as associate.',
  },
  s0317: {
    literal: 'Victims used two calves.',
    idiomatic: 'Two calves were used as victims.',
  },
  s0318: {
    literal: 'For all great sacrifices, fasting officials all assembled at the Secretariat at dawn on the appointed day to receive the oath of abstinence.',
    idiomatic: 'For all great sacrifices, fasting officials assembled at the Secretariat at dawn on the appointed day to receive the oath of abstinence.',
  },
  s0319: {
    literal: 'Initial fasting four days; concentrated fasting three days.',
    idiomatic: 'Initial fasting lasted four days; concentrated fasting, three.',
  },
  s0320: {
    literal: 'One day before the sacrifice, at the fifth watch after daybreak\'s water clock, arriving at the sacrifice site, bathing, putting on bright robes—all must not hear or see mourning garments or weeping.',
    idiomatic: 'One day before the sacrifice, at the fifth watch after daybreak, officials arrived at the site, bathed, and donned bright robes—none might encounter mourning garments or weeping.',
  },
  s0321: {
    literal: 'August Heaven Supreme Lord, Five Direction Supreme Lords, Sun and Moon, Queen Earth Numen, Spirit of the Central Land and altars of soil and grain, ancestral temple—these were great sacrifices; stars, Five Sacrifices, Four Outlooks—these were medium sacrifices; Director of the Center, Director of Fate, Wind Master, Rain Master and various stars and various mountains and rivers—these were small sacrifices.',
    idiomatic: 'August Heaven Supreme Lord, Five Direction Supreme Lords, Sun and Moon, Queen Earth Numen, Spirit of the Central Land, altars of soil and grain, and ancestral temple were great sacrifices; stars, Five Sacrifices, and Four Outlooks were medium sacrifices; Director of the Center, Director of Fate, Wind Master, Rain Master, various stars, and various mountains and rivers were small sacrifices.',
  },
  s0322: {
    literal: 'Great sacrifices reared victims for ninety days; medium sacrifices thirty days; small sacrifices ten days.',
    idiomatic: 'Great sacrifices reared victims for ninety days; medium sacrifices, thirty; small sacrifices, ten.',
  },
  s0323: {
    literal: 'When direction-colored victims were hard to prepare, pure-colored victims were permitted as substitutes.',
    idiomatic: 'When direction-colored victims were unavailable, pure-colored victims were permitted as substitutes.',
  },
  s0324: {
    literal: 'Victims for announcement and prayer were not reared.',
    idiomatic: 'Victims for announcement and prayer rites were not reared in advance.',
  },
  s0325: {
    literal: 'Sacrificial victims must not be beaten.',
    idiomatic: 'Sacrificial victims must not be beaten.',
  },
  s0326: {
    literal: 'If they died, they were buried.',
    idiomatic: 'If they died prematurely, they were buried.',
  },
  s0327: {
    literal: 'When the emperor first received the Zhou abdication, fearing the people were not yet content, he spoke much of portents and omens to glorify it.',
    idiomatic: 'When the emperor first received the Northern Zhou abdication, fearing the people were not yet reconciled, he proclaimed numerous portents and omens.',
  },
  s0328: {
    literal: 'Those who fabricated and presented them—countless.',
    idiomatic: 'Those who fabricated and presented them were beyond counting.',
  },
  s0329: {
    literal: 'In the first year of Renshou, winter solstice sacrifice at the Southern Suburb—August Heaven Supreme Lord and Five Direction Heavenly Emperors\' seats were both placed upon the altar, as in the feng and shan rites.',
    idiomatic: 'In Renshou 1, the winter solstice sacrifice at the Southern Suburb placed August Heaven Supreme Lord and the Five Direction Heavenly Emperors\' seats together upon the altar, as in the feng and shan rites.',
  },
  s0330: {
    literal: 'The placard read:',
    idiomatic: 'The placard read:',
  },
  s0331: {
    literal: ': In the first year of Renshou, year cycle zuoe, the succeeding Son of Heaven Chen Jian, dare solemnly announce to August Heaven Supreme Lord.',
    idiomatic: 'In Renshou 1, year cycle zuoe, the succeeding Son of Heaven Chen Jian solemnly announces to August Heaven Supreme Lord:',
  },
  s0332: {
    literal: 'The armillary sphere turns; the great light reaches the south.',
    idiomatic: 'The armillary sphere turns; the great light reaches its southern limit.',
  },
  s0333: {
    literal: 'Your subject received Heaven\'s gracious creation; the multitude of spirits bestowed blessings; overseeing and comforting all lands, nurturing the myriad people.',
    idiomatic: 'I have received Heaven\'s gracious creation; the multitude of spirits have bestowed blessings; I oversee and comfort all lands and nurture the myriad people.',
  },
  s0334: {
    literal: 'Reflecting on my emptiness and inadequacy, virtue and transformation not yet widespread—day and night anxious and fearful, not daring to be negligent.',
    idiomatic: 'Reflecting on my emptiness and inadequacy, with virtue and transformation not yet widespread—I am anxious day and night and dare not be negligent.',
  },
  s0335: {
    literal: 'Heaven and Earth\'s numina descended and bestowed auspicious omens, mirroring the realm, manifest to eyes and ears.',
    idiomatic: 'Heaven and Earth\'s numina have descended and bestowed auspicious omens, manifest throughout the realm to all eyes and ears.',
  },
  s0336: {
    literal: 'At first ascending the throne, receiving the tortoise chart; moving the capital and fixing the cauldron; sweet springs issued from the ground; in the year of pacifying Chen, dragons guided the fleet.',
    idiomatic: 'At first ascending the throne I received the tortoise chart; moved the capital and fixed the cauldron; sweet springs issued from the ground; in the year of pacifying Chen, dragons guided the fleet.',
  },
  s0337: {
    literal: 'Inspecting customs and touring the regions, performing rites at the Eastern Peak; the blind gained sight, the mute gained speech; again there was a lame man who suddenly could walk.',
    idiomatic: 'Inspecting customs and touring the regions, I performed rites at the Eastern Peak; the blind gained sight, the mute speech; a lame man suddenly could walk.',
  },
  s0338: {
    literal: 'From Kaihuang onward, the sun drew near the North Pole, traveling the upper path; the gnomon\'s shadow lengthened.',
    idiomatic: 'From Kaihuang onward the sun drew near the North Pole, traveling the upper path; the gnomon\'s shadow lengthened.',
  },
  s0339: {
    literal: 'Heaven opened the Great Peace; a beast appeared with one horn; the reign title changed to Renshou; poplar trees bore pine.',
    idiomatic: 'Heaven opened the Great Peace; a beast with one horn appeared; the reign title changed to Renshou; poplar trees bore pine branches.',
  },
  s0340: {
    literal: 'Stone fish displayed the sign of matching tally; jade tortoise showed the omen of eternal prosperity; mountain charts and stone portents appeared in succession—all bearing your subject\'s name, praising and recording the dynasty\'s fortune.',
    idiomatic: 'Stone fish displayed signs of matching tally; jade tortoise showed omens of eternal prosperity; mountain charts and stone portents appeared in succession—all bearing my name, praising and recording the dynasty\'s fortune.',
  },
  s0341: {
    literal: 'Classics and various weft texts, extending to jade tortoises—their characters\' meaning and principle successively corresponded.',
    idiomatic: 'Classics, various weft texts, and jade tortoise inscriptions—their characters\' meaning and principle successively corresponded.',
  },
  s0342: {
    literal: ': Within the palace city and in mountain valleys, stones transformed to jade—countless.',
    idiomatic: 'Within the palace city and in mountain valleys, stones transformed to jade beyond counting.',
  },
  s0343: {
    literal: 'One ridge in the peach district—all was glazed crystal; yellow silver issued from the numinous mountain; green jade grew on the auspicious peak.',
    idiomatic: 'One ridge in the peach district was entirely glazed crystal; yellow silver issued from the numinous mountain; green jade grew on the auspicious peak.',
  },
  s0344: {
    literal: 'Mount Duoyang resounded; three times proclaimed the state\'s rise; Mount Lianyun sounded; ten thousand years the state draws near.',
    idiomatic: 'Mount Duoyang resounded, three times proclaiming the state\'s rise; Mount Lianyun sounded, ten thousand years the state draws near.',
  },
  s0345: {
    literal: 'Wild geese descended from Heaven and remained in pools and marshes; numinous deer entered the park, repeatedly granted guidance.',
    idiomatic: 'Wild geese descended from Heaven and remained in pools and marshes; numinous deer entered the imperial park, repeatedly granted guidance.',
  },
  s0346: {
    literal: 'Zouyu appeared in substance; the roaming qilin in the wild; deer horns grew on poplar trees; dragon pool issued from the thorn valley.',
    idiomatic: 'Zouyu appeared in the flesh; the roaming qilin in the wild; deer horns grew on poplar trees; a dragon pool issued from the thorn valley.',
  },
  s0347: {
    literal: 'Auspicious clouds issued color; the longevity star hung radiance.',
    idiomatic: 'Auspicious clouds issued color; the longevity star hung its radiance.',
  },
  s0348: {
    literal: 'Palace halls and towers—all produced numinous fungus; mountains, marshes, rivers, and plains—many produced precious things.',
    idiomatic: 'Palace halls and towers all produced numinous fungus; mountains, marshes, rivers, and plains produced many precious things.',
  },
  s0349: {
    literal: 'Powerful fragrance scattered perfume; zero dew condensed sweetness.',
    idiomatic: 'Powerful fragrance scattered perfume; zero dew condensed sweetness.',
  },
  s0350: {
    literal: 'Mount Wushan in Dunhuang—black stones turned white; Mount Honglu—stone flowers shone from afar.',
    idiomatic: 'At Mount Wushan in Dunhuang, black stones turned white; at Mount Honglu, stone flowers shone from afar.',
  },
  s0351: {
    literal: 'Dark fox and dark leopard, white rabbit and white wolf, red sparrow and dark bird, wild silkworm and heavenly bean, fine grain with combined ears, precious trees with joined trunks.',
    idiomatic: 'Dark fox and dark leopard, white rabbit and white wolf, red sparrow and dark bird, wild silkworm and heavenly bean, fine grain with combined ears, precious trees with joined trunks.',
  },
  s0352: {
    literal: 'Numinous portents and auspicious signs, vast grace and glorious blessings—descending and bestowing without limit, impossible to record fully.',
    idiomatic: 'Numinous portents and auspicious signs, vast grace and glorious blessings—descending and bestowing without limit, impossible to record fully.',
  },
  s0353: {
    literal: 'All this is August Heaven Supreme Lord, descending and bestowing bright spirits, pitying the dark-born people, bringing quiet to the land within the seas.',
    idiomatic: 'All this is August Heaven Supreme Lord, descending and bestowing bright spirits, pitying the dark-born people, bringing quiet to the land within the seas.',
  },
  s0354: {
    literal: 'Therefore bestowing this fine celebration, making all secure and happy—how could your subject\'s slight sincerity be able to move above!',
    idiomatic: 'Therefore bestowing this fine celebration, making all secure and happy—how could my slight sincerity move Heaven above!',
  },
  s0355: {
    literal: 'With reverent heart offering thanks, respectfully presenting jade silks, sacrificial victims, pure offerings, sacrificial grain, and various items—burning sacrifice to August Heaven Supreme Lord.',
    idiomatic: 'With reverent heart I offer thanks, respectfully presenting jade silks, sacrificial victims, pure offerings, sacrificial grain, and various items—burning sacrifice to August Heaven Supreme Lord.',
  },
  s0356: {
    literal: 'The deceased father Founding Ancestor Emperor Wuyuan, paired as spirit and host.',
    idiomatic: 'The deceased Founding Ancestor Emperor Wuyuan is paired as spirit and host.',
  },
  s0357: {
    literal: 'In the first year of Daye, first spring sacrificed to the Responsive Emperor; first winter sacrificed to the Spirit of the Central Land—changed to use High Ancestor Emperor Wen as associate.',
    idiomatic: 'In Daye 1, the first spring month sacrificed to the Responsive Emperor; the first winter month to the Spirit of the Central Land—both changed to use High Ancestor Emperor Wen as associate.',
  },
  s0358: {
    literal: 'The rest all used old rites.',
    idiomatic: 'All other rites used the old regulations.',
  },
  s0359: {
    literal: 'In the tenth year, winter solstice sacrifice at the Round Mound—the emperor did not fast at the fasting lodge.',
    idiomatic: 'In the tenth year, at the winter solstice Round Mound sacrifice, the emperor did not fast at the fasting lodge.',
  },
  s0360: {
    literal: 'At dawn the next day, with full imperial escort, he arrived and immediately performed the rite.',
    idiomatic: 'At dawn the next day, with full imperial escort, he arrived and immediately performed the rite.',
  },
  s0361: {
    literal: 'That day a great wind blew; the emperor alone offered to the Supreme Lord; the Three Dukes separately offered to the Five Emperors.',
    idiomatic: 'That day a great wind blew; the emperor alone offered to the Supreme Lord; the Three Dukes separately offered to the Five Emperors.',
  },
  s0362: {
    literal: 'When the rite was complete, he galloped his horse swiftly and returned.',
    idiomatic: 'When the rite was finished, he galloped swiftly back.',
  },
  s0363: {
    literal: 'The Bright Hall was in the yang of the capital.',
    idiomatic: 'The Bright Hall stood in the capital\'s yang sector.',
  },
  s0364: {
    literal: 'At the beginning of Liang, following Song and Qi, its sacrificial methods still followed Qi regulations.',
    idiomatic: 'At the beginning of Liang, following Song and Qi precedent, its sacrificial methods still followed Qi regulations.',
  },
  s0365: {
    literal: 'Where the rites were obstructed, Emperor Wu again deliberated with scholars.',
    idiomatic: 'Where the rites were deficient, Emperor Wu deliberated again with scholars.',
  },
  s0366: {
    literal: 'Old Qi regulations: at suburban sacrifice, the emperor all wore the ceremonial robe.',
    idiomatic: 'Old Qi regulations: at suburban sacrifice, the emperor always wore the ceremonial robe.',
  },
  s0367: {
    literal: 'In the seventh year of Tianjian, the great fur robe was first made—yet the Bright Hall ritual regulations still said ceremonial robe.',
    idiomatic: 'In Tianjian 7, the great fur robe was first made—yet Bright Hall ritual regulations still prescribed the ceremonial robe.',
  },
  s0368: {
    literal: 'In the tenth year, Director of Ritual Affairs Zhu Yi held: "The Rites: great fur robe and cap—sacrifice to August Heaven Supreme Lord."',
    idiomatic: 'In the tenth year, Director of Ritual Affairs Zhu Yi argued: "The Rites prescribe the great fur robe and cap for sacrifice to August Heaven Supreme Lord."',
  },
  s0369: {
    literal: 'The Five Emperors likewise.',
    idiomatic: 'The Five Emperors likewise."',
  },
  s0370: {
    literal: 'Truly because celestial spirits are high and distant—in meaning one must be sincere and simple; now following the general sacrifice of the Five Emperors—in principle ornament is not permitted.',
    idiomatic: 'Since celestial spirits are high and distant, sincerity and simplicity are required; in the general sacrifice of the Five Emperors, ornament is inappropriate.',
  },
  s0371: {
    literal: '" Thereupon dress was changed to the great fur robe.',
    idiomatic: 'Dress was therefore changed to the great fur robe.',
  },
  s0372: {
    literal: 'Yi again held: "Qi regulations: first offering from zun and yi vessels—the Bright Hall values substance, should not have three offerings."',
    idiomatic: 'Yi further argued: "Qi regulations prescribed first offering from zun and yi vessels—the Bright Hall values substance and should not have three offerings."',
  },
  s0373: {
    literal: 'Also should not use elephant zun.',
    idiomatic: 'Elephant zun vessels should also not be used."',
  },
  s0374: {
    literal: 'The Rites say: "At the court audience use the great zun."',
    idiomatic: 'The Rites state: "At the court audience use the great zun."',
  },
  s0375: {
    literal: 'Zheng says: "Great zun—earthenware."',
    idiomatic: 'Zheng explains: "The great zun is earthenware."',
  },
  s0376: {
    literal: 'The Record also says: "Yu Shun\'s earthenware zun."',
    idiomatic: 'The Record also says: "Yu Shun used earthenware zun."',
  },
  s0377: {
    literal: 'These are all used in the temple—yet with simple substance; how much more in the Bright Hall—in ritual ornament is not permitted.',
    idiomatic: 'These are used even in the temple with simple substance; how much more in the Bright Hall, where ornament is inappropriate.',
  },
  s0378: {
    literal: 'Now requesting to change to earthenware zun—perhaps fitting the mean of substance and ornament.',
    idiomatic: 'We propose changing to earthenware zun—fitting the balance of substance and ornament.',
  },
  s0379: {
    literal: '" Also said: "The ancestral temple values ornament—therefore the multitude of dishes a hundred kinds; Heaven\'s meaning is exalted and distant—then simplicity is required."',
    idiomatic: 'He also said: "The ancestral temple values ornament—hence the multitude of dishes; Heaven\'s meaning is exalted and distant—simplicity is required."',
  },
  s0380: {
    literal: 'Now the ritual regulations\' offerings differ not from the temple—in principle examining the affair, like not yet acceptable.',
    idiomatic: 'Yet the ritual regulations\' offerings differ little from the temple—in principle this seems unacceptable.',
  },
  s0381: {
    literal: 'From now on Bright Hall meat dishes should follow the two suburbs.',
    idiomatic: 'Henceforth Bright Hall meat dishes should follow the two suburban rites.',
  },
  s0382: {
    literal: 'But the emperor\'s name fundamentally governs nurturing life; the year\'s achievement—in substance is truly prominent.',
    idiomatic: 'But the emperor\'s name fundamentally governs nurturing life; the year\'s achievement is truly prominent in substance.',
  },
  s0383: {
    literal: 'Not like August Heaven—meaning absolutely without image; though called the same as the suburb, again should be slightly different.',
    idiomatic: 'Unlike August Heaven, whose meaning transcends image—though called the same as the suburb, it should differ slightly.',
  },
  s0384: {
    literal: 'If water and soil products, vegetables and fruits—still should be offered; only use four fruits: pear, jujube, orange, chestnut; four pickled vegetables: ginger, reed, sunflower, leek; four grains: husked rice, millet, panicum, fine millet.',
    idiomatic: 'Water and soil products, vegetables and fruits should still be offered—but only four fruits: pear, jujube, orange, and chestnut; four pickled vegetables: ginger, reed, sunflower, and leek; four grains: husked rice, millet, panicum, and fine millet.',
  },
  s0385: {
    literal: 'From this outward, what the suburb lacks—request all be reduced and removed.',
    idiomatic: 'Beyond these, whatever the suburb lacks should be eliminated.',
  },
  s0386: {
    literal: '"',
    idiomatic: '(End of memorial.)',
  },
  s0387: {
    literal: 'At first, Erudite Ming Shanbin made ritual regulations: Bright Hall sacrifice to the Five Emperors—the rite proceeded first from the Red Emperor.',
    idiomatic: 'Initially, Erudite Ming Shanbin\'s ritual regulations prescribed that Bright Hall sacrifice to the Five Emperors begin with the Red Emperor.',
  },
  s0388: {
    literal: 'Yi again held: "The Bright Hall since it generally sacrifices to the Five Emperors—cannot have fixed precedence; ascending the eastern steps—it is appropriate to begin with the Green Emperor."',
    idiomatic: 'Yi argued: "Since the Bright Hall generally sacrifices to the Five Emperors, fixed precedence is inappropriate; ascending the eastern steps, one should begin with the Green Emperor."',
  },
  s0389: {
    literal: 'Request to change to begin from the Green Emperor.',
    idiomatic: 'We propose beginning with the Green Emperor instead.',
  },
  s0390: {
    literal: '" Also held: "Bright Hall basket-and-dou and other vessels—all are carved and ornamented."',
    idiomatic: 'He also noted: "Bright Hall basket-and-dou and other vessels are all carved and ornamented."',
  },
  s0391: {
    literal: 'Examining the suburb\'s valuing substance—changed to use pottery and gourd; the ancestral temple\'s valuing ornament—truly should use carved stands.',
    idiomatic: 'The suburb values substance and uses pottery and gourd; the ancestral temple values ornament and properly uses carved stands.',
  },
  s0392: {
    literal: 'Bright Hall\'s rite—since more ornamented than the suburb, then pottery and gourd is not permitted; compared to the temple as substance, then carved stands are not appropriate.',
    idiomatic: 'Bright Hall rites are more ornamented than the suburb—pottery and gourd is inappropriate; yet compared to the temple they are more substance—carved stands are also inappropriate.',
  },
  s0393: {
    literal: 'Weighing the two paths—must preserve the mean; request to change to pure lacquer.',
    idiomatic: 'Balancing the two, we propose pure lacquer vessels.',
  },
  s0394: {
    literal: '" Yi again: "Old regulations: Bright Hall sacrifice to the Five Emperors—first pour fragrant herb wine, libation on the ground to seek the spirits; and first offering clear wine, then second offering fine wine, final offering sweet wine."',
    idiomatic: 'Yi further noted: "Old regulations: Bright Hall sacrifice to the Five Emperors—first pour fragrant herb wine and libate on the ground to seek the spirits; then first offering clear wine, second fine wine, final sweet wine."',
  },
  s0395: {
    literal: 'When the rite was complete, the Grand Invocator took the meat from the stand before the emperor and presented it.',
    idiomatic: 'When the rite was complete, the Grand Invocator took meat from the stand before the emperor and presented it.',
  },
  s0396: {
    literal: 'Request to follow suburban regulations—only one offering of clear wine.',
    idiomatic: 'We propose following suburban regulations—only one offering of clear wine.',
  },
  s0397: {
    literal: 'And the Five Emperors are celestial spirits—cannot be sought on the ground; the two suburbs\' sacrifices both have no millet-meat rite.',
    idiomatic: 'The Five Emperors are celestial spirits—they cannot be sought on the ground; the two suburban rites include no millet-meat offering.',
  },
  s0398: {
    literal: 'All request to stop libation and the method of presenting the stand.',
    idiomatic: 'We propose abolishing libation and the method of presenting the stand.',
  },
  s0399: {
    literal: '" Also held: "Old Bright Hall all used the great victim."',
    idiomatic: 'He also argued: "The old Bright Hall always used the great victim."',
  },
  s0400: {
    literal: 'Examining the Record: "The suburb uses a special victim;"',
    idiomatic: 'The Record states: "The suburb uses a special victim;"',
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
