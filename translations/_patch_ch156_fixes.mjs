#!/usr/bin/env node
/** Fix known misaligned sentences in zizhitongjian ch.156 (quote-boundary drift). */
import fs from 'node:fs';

const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };
const path = 'data/zizhitongjian/156.json';

const fixes = {
  s0188: {
    literal:
      'Otherwise, it will surely become a future calamity.',
    idiomatic:
      'Otherwise it will surely become a future calamity, the annals record.',
  },
  s0189: {
    literal: '"',
    idiomatic: '"',
  },
  s0193: {
    literal: 'Gui, seeing few horsemen, made no preparations.',
    idiomatic:
      'Shi Gui, seeing so few horsemen, made no preparations, the annals record.',
  },
  s0194: {
    literal:
      'Chong at once entered and seized the gate. Magistrate Li Xian of Gaoping in Longxi and his younger brother Yuanmu were in the city and acted as Chong\'s inside agents.',
    idiomatic:
      'Chong entered at once and held the gate. Li Xian, magistrate of Gaoping in Longxi, and his younger brother Yuanmu, who were inside the city, acted as Chong\'s allies within the walls.',
  },
  s0195: {
    literal:
      'Thereupon inside and outside raised a clamor; the ambush all rose, and they captured Gui and Ci\'an, Bohe, and the rest and returned to Pingliang.',
    idiomatic:
      'Thereupon inside and outside raised a clamor; the ambush all rose, and they took Gui and Ci\'an, Bohe, and the rest and returned to Pingliang.',
  },
  s0196: {
    literal: 'Tai memorialized that Chong should act as inspector of Yuanzhou.',
    idiomatic:
      'Yuwen Tai memorialized that Chong should administer Yuanzhou as acting inspector.',
  },
  s0198: {
    literal:
      'In the fourth month of summer, on the first day guichou, there was a solar eclipse.',
    idiomatic:
      'In the fourth month of summer, on the first day guichou, there was a solar eclipse, the annals record.',
  },
  s0099: {
    literal: 'Thereupon the north of the Mian was laid waste as barren mounds.',
    idiomatic:
      'Thereupon the north of the Mian was laid waste as barren mounds, the annals record.',
  },
  s0382: {
    literal:
      'If We can again see Luoyang and personally visit the tombs and temples, it is your merit.',
    idiomatic:
      'If We can again see Luoyang and personally visit the tombs and temples, the credit is yours, the annals record.',
  },
  s0383: {
    literal: '" The emperor and those at his side all wept.',
    idiomatic: '" The emperor and his attendants all shed tears.',
  },
  s0406: {
    literal:
      'To abandon this and withdraw—I fear every man will lose cohesion; one lost moment, and what regret will suffice!',
    idiomatic:
      'To turn back now—I fear everyone will fall apart; miss this chance and regret will come too late!',
  },
  s0407: {
    literal: '" Sheng could not adopt the advice and thereupon returned.',
    idiomatic: '" Heba Sheng did not heed this counsel and turned back.',
  },
  s0414: {
    literal: 'Gang said, "My lord ought to urge troops to the traveling court."',
    idiomatic:
      'Gang said, "My lord ought to muster troops and go to the traveling court."',
  },
  s0415: {
    literal: '" After a long while, no one else spoke.',
    idiomatic: '" For a long time no one else spoke.',
  },
  s0416: {
    literal:
      'Gang threw his blade to the ground and said, "If my lord wishes to be a loyal minister, please behead Daohe; if you wish to follow the rebel, you may kill me at once!"',
    idiomatic:
      'Gang threw his blade to the ground and said, "If my lord wishes to be a loyal minister, behead Daohe; if you mean to follow the rebel, kill me now!"',
  },
  s0417: {
    literal: 'If you wish to follow the rebel, you may kill me at once!',
    idiomatic: 'If you mean to follow the rebel, kill me now!',
  },
  s0418: {
    literal:
      '" Jingzhao came to his senses and at once led his host to Guanzhong.',
    idiomatic:
      '" Jingzhao took the point and at once led his forces to Guanzhong.',
  },
  s0422: {
    literal: '" The emperor also did not answer.',
    idiomatic: '" The emperor likewise made no reply.',
  },
  s0464: {
    literal:
      'The Princess of Pingyuan, Mingyue, was born of the same mother as Prince Bao Ju of Nanyang; she followed the emperor into Guanzhong. Chancellor Tai had the Yuan princes take Mingyue and kill her.',
    idiomatic:
      'The Princess of Pingyuan, Mingyue, was a full sister of Prince Bao Ju of Nanyang; she had followed the emperor into Guanzhong. Chancellor Yuwen Tai had the Yuan princes seize Mingyue and put her to death.',
  },
  s0465: {
    literal:
      'The emperor was displeased; sometimes he bent the bow, sometimes he struck the table—thereby he again had a rift with Tai.',
    idiomatic:
      'The emperor was displeased; sometimes he strung his bow, sometimes he pounded the table—and so he again fell out with Yuwen Tai.',
  },
  s0466: {
    literal: 'On guisi, the emperor drank wine, met poison, and died.',
    idiomatic:
      'On guisi the emperor drank wine, encountered poisoned wine, and perished.',
  },
  s0467: {
    literal:
      'Tai debated with the hundred officials whom to set up; many nominated Prince Zan of Guangping.',
    idiomatic:
      'Yuwen Tai debated with the hundred officials whom to enthrone; many nominated Prince Zan of Guangping.',
  },
  s0469: {
    literal:
      'Attendant-in-Ordinary Prince Shun of Puyang, in a side room weeping, told Tai, "Gao Huan drove off the former emperor and set up a young lord to monopolize power. Your Grace ought to do the opposite of what he did.',
    idiomatic:
      'Attendant-in-Ordinary Prince Shun of Puyang, weeping in a side room, told Yuwen Tai, "Gao Huan drove off the former emperor and set up a young ruler to monopolize power. Your Grace ought to do the opposite of what he did.',
  },
  s0470: {
    literal:
      'Guangping is young and immature—better to set up an elder lord and support him."',
    idiomatic:
      'Guangping is young and immature—it would be better to set up an elder lord and support him."',
  },
  s0471: {
    literal:
      '" Tai thereupon supported Grand Preceptor Prince Bao Ju of Nanyang and set him up.',
    idiomatic:
      '" Yuwen Tai thereupon supported Grand Preceptor Prince Bao Ju of Nanyang and enthroned him.',
  },
  s0473: {
    literal: 'They placed Emperor Xiaowu in coffin at Caotang Buddhist Temple.',
    idiomatic:
      'Emperor Xiaowu was laid in state at the Caotang Buddhist Temple.',
  },
  s0474: {
    literal:
      'Remonstrating and Consulting Grand Master Song Qiu wept until he vomited blood and for several days would take neither gruel nor grain; Tai, because he was a renowned scholar, did not punish him.',
    idiomatic:
      'Remonstrating and Consulting Grand Master Song Qiu wept until he vomited blood and for several days ate nothing; Yuwen Tai, because he was a famous scholar, did not punish him.',
  },
  s0484: {
    literal: 'Though Xiyang be lost, it is not worth regretting.',
    idiomatic: 'Even if Xiyang is lost, that is no great loss.',
  },
  s0493: {
    literal: '" The gatekeepers all dispersed.',
    idiomatic: '" At that the gatekeepers scattered.',
  },
};

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
let n = 0;
for (const block of data.content) {
  for (const s of block.sentences || []) {
    const fix = fixes[s.id];
    if (!fix) continue;
    s.translations = [{ ...META, literal: fix.literal, idiomatic: fix.idiomatic }];
    n++;
  }
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
fs.copyFileSync(path, 'public/data/zizhitongjian/156.json');
console.log('Patched', n, 'sentences in', path);
