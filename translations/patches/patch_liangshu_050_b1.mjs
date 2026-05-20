#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Liu Jun, Liu Zhao, Xie Jiqing, Liu Xie, Wang Ji, He Sichen, Liu Yao, Xie Zheng, Zang Yan, Fu Ting, Yu Zhongrong, Lu Yungong, Ren Xiaogong, Yan Xie',
    'Liu Jun · Liu Zhao · Xie Jiqing · Liu Xie · Wang Ji · He Sichen · Liu Yao · Xie Zheng · Zang Yan · Fu Ting · Yu Zhongrong · Lu Yungong · Ren Xiaogong · Yan Xie',
  ],
  s0002: [
    'Liu Jun, courtesy name Xiaobiao, was a man of Pingyuan in Pingyuan commandery.',
    'Liu Jun, styled Xiaobiao, came from Pingyuan in Pingyuan commandery.',
  ],
  s0003: [
    'His father Ting was Song Administrator of Shixing.',
    'His father Ting was Song administrator of Shixing.',
  ],
  s0004: [
    'When Jun was one month old his mother took him back to their home district.',
    'At one month Jun\'s mother carried him home to the district.',
  ],
  s0005: [
    'At the start of Song\'s Taishi era Qing province fell to Wei; Jun was eight and was carried off to Zhongshan, where the wealthy Liu Shi of Zhongshan pitied him, ransomed him with silk, and taught him letters.',
    'Early in Song Taishi Qingzhou fell to Wei; eight-year-old Jun was seized to Zhongshan, ransomed by the rich Liu Shi, and taught to read.',
  ],
  s0006: [
    'When the northerners heard he had kin in the south they moved him again to Sanggan.',
    'Hearing he had southern kin, the Wei moved him again to Sanggan.',
  ],
  s0007: [
    'Jun loved learning; his family was poor and he lodged under others\' eaves, setting his own lessons, often burning hemp torches from dusk to dawn; when he dozed he singed his hair, and waking read on all night without sleep—such was his zeal.',
    'Poor and lodging in a lean-to, he studied by hemp torch till dawn, singeing his hair when he dozed, then reading on sleepless—such was his zeal.',
  ],
  s0008: [
    'In Qi Yongming he returned from Sanggan, felt his reading was not broad enough, and sought rare books; hearing any in the capital he would go beg to borrow—Cui Weizu of Qinghe called him a "book lecher."',
    'Under Qi Yongming he came back from Sanggan, sought rare books, and borrowed whatever the capital held—Cui Weizu of Qinghe dubbed him a book lecher.',
  ],
  s0009: [
    'When Prince Ziliang of Jingling widely recruited scholars Jun asked through someone to be a princely retainer; Minister of Personnel Xu Xiaosi blocked it and he was offered Southern Sea prince attendant—he declined.',
    'Prince Ziliang of Jingling recruited widely; Jun sought a post but Xu Xiaosi blocked it; offered Southern Sea attendant, he refused.',
  ],
  s0010: [
    'Under Mingdi Xiao Yaoxin was Inspector of Yuzhou; Jun served as prison officer of the princedom and was treated very generously.',
    'Under Mingdi he was prison officer for Xiao Yaoxin, inspector of Yuzhou, and was honored lavishly.',
  ],
  s0011: [
    'Yaoxin soon died; for a long time Jun received no appointment.',
    'Yaoxin soon died; long afterward he still had no post.',
  ],
  s0012: [
    'At the start of Tianjian he was summoned to the Western Office and with the scholar He Zong collated the secret archives.',
    'Early Tianjian he entered the Western Office and with He Zong collated secret books.',
  ],
  s0013: [
    'Jun\'s elder brother Xiaoqing was then Inspector of Qingzhou; Jun asked leave to visit him, was charged with privately carrying forbidden goods, impeached, and dismissed.',
    'His brother Xiaoqing was Qingzhou inspector; Jun visited on leave, was charged with smuggling forbidden goods, and lost office.',
  ],
  s0014: [
    'Prince Xiu of Ancheng loved Jun\'s learning; when moved to Jingzhou he made him household registrar, supplied books, and had him copy topics into a work called Garden of Categories.',
    'Prince Xiu of Ancheng prized his learning, made him registrar at Jingzhou, supplied books, and had him compile the Garden of Categories.',
  ],
  s0015: [
    'Before it was finished he left again on illness, traveled to Purple Rock Mountain in Dongyang, and built a dwelling there.',
    'Ill again before it was done, he withdrew to Purple Rock in Dongyang and built a house.',
  ],
  s0016: [
    'He wrote Mountain Dwelling Record, a very fine piece.',
    'He wrote Mountain Dwelling Record, a work of great beauty.',
  ],
  s0017: [
    'Gaozu recruited men of letters; those of high talent were often brought in and promoted out of turn.',
    'Gaozu summoned literary talent and often promoted the gifted out of turn.',
  ],
  s0018: [
    'Jun acted from native bent and could not drift with the crowd; Gaozu rather disliked this and so did not employ him.',
    'Frank and unable to float with the crowd, he was disliked by Gaozu and never used.',
  ],
  s0019: [
    'He then wrote Discourse on Destiny to lodge his feelings, saying:',
    'He then wrote Discourse on Destiny to voice his mind, saying:',
  ],
  s0020: [
    'Our lord once spoke with famous worthies of Guan Lu and sighed that such rare talent had not reached high office.',
    'The emperor once discussed Guan Lu with eminent men and lamented that genius had not won rank.',
  ],
  s0021: [
    'Someone below the Red Steps heard this talk, returned, and told me.',
    'Someone on the red steps who heard it told me on returning.',
  ],
  s0022: [
    'I say that whether a gentleman meets obstruction or success is nothing but fate.',
    'I hold that a scholar\'s rise or fall is all fate.',
  ],
  s0023: [
    'Therefore I respectfully set forth Heaven\'s intent and state the outline thus:',
    'So I respectfully follow Heaven\'s meaning and sketch the argument:',
  ],
  s0024: [
    'Your servant observes that Guan Lu\'s heaven-given brilliance was outstanding, jade-scepter excellence singular—a true hero within the seas, no mere day-reader or prayer-officiant.',
    'Guan Lu was brilliantly gifted and peerless—a true hero of the realm, no common diviner.',
  ],
  s0025: [
    'Yet his office stopped at Vice Director of the Palace Storehouse and he died at forty-eight—how meager Heaven\'s reward!',
    'Yet he only reached vice director of the palace storehouse and died at forty-eight—how scant Heaven\'s reward!',
  ],
  s0026: [
    'Thus high talent without noble office and gluttons in great posts have been lamented since antiquity—why only Gongming?',
    'High talent without rank and gluttons in high place have long been lamented—not Guan Lu alone.',
  ],
  s0027: [
    'Hence the way of nature and life, the reckoning of rise and fall, early death and blockage are tangled—none knows their distinction.',
    'Life, rise and fall, early death and blockage tangle together—no one sorts them out.',
  ],
  s0028: [
    'Wang Chong obscured the source; Sima Qian clarified the confusion.',
    'Wang Chong hid the root; Sima Qian opened the puzzle.',
  ],
  s0029: [
    'As for cap-and-window poverty, they insist there is a heaven-set term;',
    'The poor in cap and window insist heaven sets a term;',
  ],
  s0030: [
    'tripod-noble, high-gated families say only human summons.',
    'while tripod nobles in high gates say only men summon fortune.',
  ],
  s0031: [
    'Clamor and wrangling—heterodoxies rise together.',
    'Noise and quarrel—many heterodoxies arise at once.',
  ],
  s0032: [
    'Xiao Yuanlun discussed the root but did not unfold the flow; Zi Xuan spoke the flow but did not detail the root.',
    'Xiao Yuanlun treated the root but not the flow; Zi Xuan the flow but not the root.',
  ],
  s0033: [
    'I once tried to say: The Way begets the myriad things—this is called the Way;',
    'I once said: the Way begets all things—that is the Way;',
  ],
  s0034: [
    'living yet without a master, this is called the natural.',
    'life without a master is the natural.',
  ],
  s0035: [
    'The natural: things see that it is so, not why it is so;',
    'Natural means things see it is so, not why;',
  ],
  s0036: [
    'all alike attain, not knowing how they attain.',
    'all alike gain, not knowing how they gain.',
  ],
  s0037: [
    'It stirs and molds yet claims no merit; the myriad kinds blend into form yet not by its force;',
    'It stirs and molds without merit; myriad kinds form without its force;',
  ],
  s0038: [
    'in living it has no mind to nurture; in dying no will to slaughter;',
    'in life no mind to nurture; in death no will to slaughter;',
  ],
  s0039: [
    'plunging into deep springs is not its anger, ascending the azure height not its pleasure.',
    'plunging into abyss is not anger, rising to heaven not pleasure.',
  ],
  s0040: [
    'Vast, great—the myriad treasures transform by it;',
    'Vast and great—myriad treasures transform by it;',
  ],
  s0041: [
    'firm, pure—one act and no change.',
    'firm and pure—one act, unchanging.',
  ],
  s0042: [
    'Transforming yet unchanging—this is called fate.',
    'Transforming yet unchanging—that is fate.',
  ],
  s0043: [
    'Fate: what is mandated from Heaven.',
    'Fate is what Heaven mandates.',
  ],
  s0044: [
    'Fixed in dark omens, in the end unaltered.',
    'Fixed in dark omens, finally unaltered.',
  ],
  s0045: [
    'Ghosts and spirits cannot foretell, sages cannot plot;',
    'Ghosts cannot foretell, sages cannot plot;',
  ],
  s0046: [
    'strength to topple mountains cannot resist it, sincerity to overturn the sun cannot move it;',
    'strength to topple mountains cannot resist; sincerity to overturn the sun cannot move it;',
  ],
  s0047: [
    'the short cannot be stretched in a hair\'s breadth of shade, the long cannot be hurried by the drip of clepsydra;',
    'the short cannot be stretched in a moment, the long hurried by a water-clock drip;',
  ],
  s0048: [
    'utmost virtue cannot overstep it, highest wisdom cannot escape it.',
    'utmost virtue cannot overstep it, highest wisdom cannot escape it.',
  ],
  s0049: [
    'Hence in Yao\'s age floods piled to the hills;',
    'In Yao\'s age floods piled to the hills;',
  ],
  s0050: [
    'in Tang\'s time metal scorched and stones flowed.',
    'in Tang\'s time metal scorched and stones ran like water.',
  ],
  s0051: [
    'Duke Wen of Jin tugged his tail; Confucius ran out of grain;',
    'Duke Wen tugged his tail; Confucius ran out of grain;',
  ],
  s0052: [
    'Yan Hui\'s orchids withered; Ran Geng sang of plantain;',
    'Yan Hui\'s orchids withered; Ran Geng sang of plantain;',
  ],
  s0053: [
    'Bo Yi and Shu Qi died for a fair lady\'s words; Zengzi was trapped by Zang Cang\'s suit.',
    'Bo Yi and Shu Qi died for a lady\'s words; Zengzi was trapped by Zang Cang\'s suit.',
  ],
  s0054: [
    'Even sages were thus—how much more the mediocre!',
    'Even sages were thus—how much more ordinary men!',
  ],
  s0055: [
    'Down to Wu Zixu floating corpse on the river, Qu Yuan sinking bones in Xiang shallows;',
    'Wu Zixu floated on the river, Qu Yuan sank in Xiang shallows;',
  ],
  s0056: [
    'Jia Yi lost heart at Changsha, Feng Tang white-haired in the palace guard office;',
    'Jia Yi lost heart at Changsha, Feng Tang white-haired in the guard office;',
  ],
  s0057: [
    'Jun Shan\'s wild goose flight, wings clipped in high clouds;',
    'Jun Shan\'s flight, wings clipped in high clouds;',
  ],
  s0058: [
    'Jing Tong\'s phoenix rise, swift pinions broken in the wind cave: was this insufficient talent or flawed conduct?',
    'Jing Tong\'s rise, pinions broken in the wind cave—lack of talent or flawed conduct?',
  ],
  s0059: [
    'In recent times Liu Huan of Pei and his younger brother Lin were both outstanding men of the age.',
    'Recently Liu Huan of Pei and his brother Lin were both outstanding men of the age.',
  ],
  s0060: [
    'Huan was Confucius of the west, versed in the Six Classics, gentle in teaching, devoted to Confucian conduct.',
    'Huan was the west\'s Confucius, versed in the Six Classics, gentle in teaching, devoted to the rites.',
  ],
  s0061: [
    'Lin\'s will was fierce as autumn frost, heart firm as Kun jade, towering high, unstained by dust.',
    'Lin\'s will was autumn frost, heart Kun jade, towering, unstained by dust.',
  ],
  s0062: [
    'Both nurtured virtue behind a humble gate and spread fame through heaven and earth.',
    'Both nurtured virtue behind a humble gate and spread fame through heaven and earth.',
  ],
  s0063: [
    'Yet office barely reached vice director and rank never attained halberd-bearer; they died in succession and the ancestral sacrifices went unfed.',
    'Yet office barely reached vice director and rank never halberd-bearer; they died in turn and sacrifices went unfed.',
  ],
  s0064: [
    'By these two worthies to speak of antiquity: jade quality and gold aspect, splendid talent—all were cast out in their day, talents hidden unused, waiting with grass and trees to wither, dying with deer.',
    'By these two: jade quality and gold aspect, splendid talent—all cast out in their day, talents unused, withering with grass and trees, dying with deer.',
  ],
  s0065: [
    'Grease smeared the plain, bones filled the valleys—those sunk and unheard, can they be counted!',
    'Grease on the plain, bones in the valleys—those sunk unheard, beyond counting!',
  ],
  s0066: [
    'Thus prime minister and clerk, Rong and Peng with the child who dies young, Yi Dun and Qian Lou, Yang Wen and Dun Xia—all from the natural, not by wit or ability.',
    'Prime minister and clerk, long life and early death, rich and poor—all from nature, not wit.',
  ],
  s0067: [
    'Hence "life and death have fate, wealth and honor are from Heaven"—this is what is meant.',
    'Hence "life and death have fate, wealth and honor from Heaven"—that is the sense.',
  ],
  s0068: [
    'Yet the body of fate circulates; change is not one—some wail first and laugh after, some auspicious at first and ill at end, some come unbidden, some succeed through others.',
    'Yet fate circulates; change is not one—wail then laugh, auspicious then ill, come unbidden, succeed through others.',
  ],
  s0069: [
    'Crossed and tangled, cycling hidden and manifest.',
    'Crossed and tangled, cycling hidden and manifest.',
  ],
  s0070: [
    'It cannot be verified by one principle nor tested on one path.',
    'It cannot be verified by one principle nor tested on one path.',
  ],
  s0071: [
    'Yet its way is secret and fine, lonely and dim—no form to see, no sound to hear.',
    'Its way is secret and fine, lonely and dim—no form to see, no sound to hear.',
  ],
  s0072: [
    'It must ride things to show spirit and rely on men to form images—like the celestial king\'s cap-tassels, leaving the hundred officers each their charge.',
    'It rides things to show spirit and relies on men for images—like the king\'s cap, leaving officers their charge.',
  ],
  s0073: [
    'Yet the deluded, seeing Tang and Wu\'s dragon leap, say pacifying chaos lay in divine merit;',
    'The deluded see Tang and Wu\'s dragon leap and say pacifying chaos was divine merit;',
  ],
  s0074: [
    'hearing Confucius and Mozi\'s birth, say keen brilliance monopolized rare fame;',
    'hear Confucius and Mozi born and say brilliance monopolized fame;',
  ],
  s0075: [
    'seeing Peng and Han\'s leopard change, say fierce valor won noble rank;',
    'see Peng and Han\'s leopard change and say fierceness won rank;',
  ],
  s0076: [
    'seeing Zhang and Huan\'s red cords, say mastering the classics picked purple and blue.',
    'see Zhang and Huan\'s red cords and say classics won purple rank.',
  ],
  s0077: [
    'How would they know the powerful mover hurries it along?',
    'How would they know a powerful mover hurries it along?',
  ],
  s0078: [
    'Thus to speak against fate there are six obscurations.',
    'Thus speaking against fate has six obscurations.',
  ],
  s0079: [
    'I ask leave to set forth the outline:',
    'I ask leave to set forth the outline:',
  ],
  s0080: [
    'Fine skin and greasy texture, gaping mouth and bulging cheeks—these are bodily differences;',
    'Fine skin, gaping mouth—these are bodily differences;',
  ],
  s0081: [
    'morning glory ends at dusk, tortoise and crane a thousand years—these are differences of years;',
    'morning glory ends at dusk, tortoise and crane a thousand years—differences of years;',
  ],
  s0082: [
    'hearing words like echo, wit dim as beans and wheat—these are differences of spirit.',
    'hearing like echo, wit dim as beans—these are differences of spirit.',
  ],
  s0083: [
    'So we know the three are fixed by creation, yet the realm of glory and shame they say comes from man alone.',
    'The three are fixed by creation, yet glory and shame they say come from man alone.',
  ],
  s0084: [
    'This is knowing two times five yet not ten—the first obscuration.',
    'This is knowing two fives but not ten—the first obscuration.',
  ],
  s0085: [
    'Dragon horn and sun brow—the emperor\'s form;',
    'Dragon horn and sun brow—the emperor\'s form;',
  ],
  s0086: [
    'river eyes and tortoise pattern—the form of duke and marquis.',
    'river eyes and tortoise pattern—duke and marquis form.',
  ],
  s0087: [
    'stroking the mirror one knows coming execution; pressing the seal-knob shows the record of appointment.',
    'stroking the mirror one knows execution coming; pressing the seal-knob shows appointment.',
  ],
  s0088: [
    'star rainbow and pivot lightning manifest tokens of sage virtue;',
    'star rainbow and pivot lightning show sage virtue;',
  ],
  s0089: [
    'night weeping and cloud gathering are omens dense with a rising king.',
    'night weeping and cloud gathering are omens of a rising king.',
  ],
  s0090: [
    'All omens issue in an earlier term and pour forth in later generations.',
    'All omens issue in an earlier term and pour forth in later generations.',
  ],
  s0091: [
    'If one says driving tiger and leopard, wielding a foot-long sword, entering Purple Subtlety, ascending the imperial Way—',
    'If one says driving tiger and leopard, wielding a sword, entering Purple Subtlety, ascending the imperial Way—',
  ],
  s0092: [
    'then one has not reached the feelings of the dark abyss nor measured the numbers of the divine—the second obscuration.',
    'then one has not reached the dark abyss nor measured divine numbers—the second obscuration.',
  ],
  s0093: [
    'The village of Kongsang became a mighty river;',
    'The village of Kongsang became a mighty river;',
  ],
  s0094: [
    'the capital of Liyang turned to fish and turtles.',
    'the capital of Liyang turned to fish and turtles.',
  ],
  s0095: [
    'Chu troops slaughtered Han soldiers; the Sui River choked on their corpses;',
    'Chu troops slaughtered Han soldiers; the Sui choked on corpses;',
  ],
  s0096: [
    'Qin men buried Zhao soldiers; the boiling sound was like thunder.',
    'Qin buried Zhao soldiers; the boiling sound was thunder.',
  ],
  s0097: [
    'Fire blazed on Kun peak; gravel and fine jade burned together;',
    'Fire on Kun peak; gravel and fine jade burned together;',
  ],
  s0098: [
    'hard frost fell at night; wormwood and orchid perished together.',
    'hard frost at night; wormwood and orchid perished together.',
  ],
  s0099: [
    'Though You and Xia were talented, Yi and Yan nearly sages—how could they resist?',
    'Though You and Xia were talented, Yi and Yan nearly sages—how resist?',
  ],
  s0100: [
    'The third obscuration.',
    'The third obscuration.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b1.mjs <translation.json>'
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
