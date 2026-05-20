#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}


const T = {
  s0301: {
    literal: 'The ensemble used bronze drum, jie-drum, Maoyuan drum, dutan drum, bili, transverse flute, phoenix-head konghou, pipa, bronze cymbals, and conch.',
    idiomatic: 'Instruments: bronze drum, jie-, Maoyuan, and dutan drums, bili, transverse flute, phoenix-head konghou, pipa, cymbals, and conch.',
  },
  s0302: {
    literal: 'Maoyuan drum and dutan drum are now extinct.',
    idiomatic: 'Maoyuan and dutan drums are lost.',
  },
  s0303: {
    literal: '"Pyu Music": in the Zhenyuan era its king came presenting native music—twelve tunes in all—with thirty-five music workers attending court.',
    idiomatic: 'Pyu Music: in Zhenyuan its king sent twelve native pieces and thirty-five musicians to court.',
  },
  s0304: {
    literal: 'The tune texts all expound Buddhist sutra treatises.',
    idiomatic: 'The lyrics all paraphrase Buddhist scriptures.',
  },
  s0305: {
    literal: 'These three states are music of the Southern Man.',
    idiomatic: 'All three belong to the music of the Southern Man.',
  },
  s0306: {
    literal: '"Gaochang Music": two dancers wore white jackets with brocade sleeves, red leather boots, red leather belts, and red forehead bands.',
    idiomatic: 'Gaochang Music: two dancers in white jackets with brocade sleeves, red boots, red belts, and red forehead bands.',
  },
  s0307: {
    literal: 'The ensemble used one dalai drum, one waist-drum, one jilou drum, one jie-drum, two xiao, two transverse flutes, two bili, two pipa, two five-string pipa, one bronze horn, and one konghou.',
    idiomatic: 'Instruments: dalai and waist-drums, jilou and jie-drums, two xiao, two transverse flutes, two bili, two pipa, two five-string pipa, bronze horn, and konghou.',
  },
  s0308: {
    literal: 'Konghou is now extinct.',
    idiomatic: 'The konghou is lost.',
  },
  s0309: {
    literal: '"Kucha Music": workers wore black silk-cloth headwraps, scarlet silk robes, brocade sleeves, and scarlet cloth trousers.',
    idiomatic: 'Kucha Music: black silk headwraps, scarlet silk robes with brocade sleeves and scarlet trousers.',
  },
  s0310: {
    literal: 'Four dancers wore red forehead bands, scarlet jackets, white trouser leggings, and black leather boots.',
    idiomatic: 'Four dancers with red forehead bands, scarlet jackets, white leggings, and black boots.',
  },
  s0311: {
    literal: 'The ensemble used one vertical konghou, one pipa, one five-string pipa, one sheng, one transverse flute, one xiao, one bili, one Maoyuan drum, one dutan drum, one dalai drum, one waist-drum, one jie-drum, one jilou drum, one bronze cymbals, and one conch.',
    idiomatic: 'Instruments: vertical konghou, pipa, five-string pipa, sheng, transverse flute, xiao, bili, Maoyuan and dutan drums, dalai and waist-drums, jie- and jilou-drums, cymbals, and conch.',
  },
  s0312: {
    literal: 'Maoyuan drum is now extinct.',
    idiomatic: 'The Maoyuan drum is lost.',
  },
  s0313: {
    literal: '"Shule Music": workers wore black silk headwraps, white silk trousers, brocade collar bands; two dancers wore white jackets, brocade sleeves, red leather boots, and red leather belts.',
    idiomatic: 'Shule Music: black headwraps, white silk trousers, brocade collars; dancers in white jackets with brocade sleeves, red boots and belts.',
  },
  s0314: {
    literal: 'The ensemble used vertical konghou, pipa, five-string pipa, transverse flute, xiao, bili, dalai drum, waist-drum, jie-drum, and jilou drum.',
    idiomatic: 'Instruments: vertical konghou, pipa, five-string pipa, transverse flute, xiao, bili, dalai, waist-, jie-, and jilou-drums.',
  },
  s0315: {
    literal: '"Kang Music": workers wore black silk headwraps and scarlet silk robes with brocade collars.',
    idiomatic: 'Kang (Sogdian) Music: black headwraps and scarlet robes with brocade collars.',
  },
  s0316: {
    literal: 'Two dancers wore scarlet jackets, brocade collar and sleeves, green damask full-seat trousers, red leather boots, and white trouser leggings.',
    idiomatic: 'Two dancers in scarlet jackets with brocade collar and sleeves, green damask trousers, red boots, and white leggings.',
  },
  s0317: {
    literal: 'The dance whirls fast as wind; common speech calls it Hu Spin.',
    idiomatic: 'The dance spins like wind—popularly called the Sogdian whirl.',
  },
  s0318: {
    literal: 'The ensemble used two flutes, one main drum, one answering drum, and one bronze cymbals.',
    idiomatic: 'Instruments: two flutes, main and answering drums, and cymbals.',
  },
  s0319: {
    literal: '"An Music": workers wore black silk headwraps, brocade collar bands, and purple sleeve-trousers.',
    idiomatic: 'An Music: black headwraps, brocade collars, purple sleeve-trousers.',
  },
  s0320: {
    literal: 'Two dancers wore purple jackets, white trouser leggings, and red leather boots.',
    idiomatic: 'Two dancers in purple jackets, white leggings, and red boots.',
  },
  s0321: {
    literal: 'The ensemble used pipa, five-string pipa, vertical konghou, xiao, transverse flute, bili, main drum, answering drum, bronze cymbals, and konghou.',
    idiomatic: 'Instruments: pipa, five-string pipa, vertical konghou, xiao, transverse flute, bili, main and answering drums, cymbals, and konghou.',
  },
  s0322: {
    literal: 'Five-string pipa is now extinct.',
    idiomatic: 'The five-string pipa is lost.',
  },
  s0323: {
    literal: 'These five states are music of the Western Rong.',
    idiomatic: 'These five belong to Western Rong music.',
  },
  s0324: {
    literal: 'Southern Man and Northern Di custom all cut the hair along the hairline; today dancers all use cord around the head, turning the hair ends back and binding them within the cord below.',
    idiomatic: 'Southern and northern barbarians traditionally cropped the hairline; dancers now wrap the head in cord and tuck the ends beneath it.',
  },
  s0325: {
    literal: 'There is also new sound from Hexi called Hu yinsheng; with "Kucha Music" and "Miscellaneous Music" it is all prized in the age—other music all yields somewhat before it.',
    idiomatic: 'A new Hexi style called Hu yinsheng ranks with Kucha and Miscellaneous Music as the fashion, eclipsing older repertoires.',
  },
  s0326: {
    literal: '"Northern Di Music": what can be known is the three states Xianbei, Tuyuhun, and Buluoqi—all mounted music.',
    idiomatic: 'Northern Di music known today comes from Xianbei, Tuyuhun, and Buluoqi—all cavalry pieces.',
  },
  s0327: {
    literal: 'Drum-and-blow originally is military sound, performed on horseback; hence from Han onward "Northern Di Music" altogether belongs to the Drum-and-Blow Office.',
    idiomatic: 'Drum-and-blow began as army music played on horseback; since Han, Northern Di music has belonged to the Drum-and-Blow Office.',
  },
  s0328: {
    literal: 'Later Wei\'s Music Bureau first had northern songs—that is what the History of Wei calls "True Man Replacement Songs."',
    idiomatic: 'Later Wei\'s bureau first kept northern songs—the Wei History\'s "True Man Replacement Songs."',
  },
  s0329: {
    literal: 'At the capital of Dai, palace women of the inner quarters were ordered morning and evening to sing them.',
    idiomatic: 'At the Dai capital, inner-palace women sang them morning and night.',
  },
  s0330: {
    literal: 'In Zhou and Sui times they were mixed in performance with "Western Liang Music."',
    idiomatic: 'Under Zhou and Sui they were performed together with Western Liang music.',
  },
  s0331: {
    literal: 'What survives now is fifty-three chapters; titles that can be understood are six pieces;',
    idiomatic: 'Fifty-three pieces survive; six titles are intelligible:',
  },
  s0332: {
    literal: '"Murong Khan," "Tuyuhun," "Buluoqi," "Julu Princess," "White Pure King," and "Crown Prince Qiyu."',
    idiomatic: 'namely "Murong Khan," "Tuyuhun," "Buluoqi," "Julu Princess," "White Pure King," and "Crown Prince Qiyu."',
  },
  s0333: {
    literal: 'Those not understood mostly contain the word khan.',
    idiomatic: 'Obscure titles mostly contain khan.',
  },
  s0334: {
    literal: 'According to present great horn, this is what Later Wei called "Boluo hui"; its tune also has many khan words.',
    idiomatic: 'Today\'s great horn is Later Wei\'s "Boluo hui," likewise full of khan phrases.',
  },
  s0335: {
    literal: 'Northern barbarian custom calls the lord khan.',
    idiomatic: 'Northern peoples call their ruler khan.',
  },
  s0336: {
    literal: 'Tuyuhun is again a separate branch of Murong—knowing this song is Xianbei song of the Yan–Wei period.',
    idiomatic: 'Tuyuhun was a Murong offshoot—so these are Yan–Wei Xianbei songs.',
  },
  s0337: {
    literal: 'Song words are barbarian sound—ultimately unintelligible.',
    idiomatic: 'The lyrics are in barbarian speech and cannot be parsed.',
  },
  s0338: {
    literal: 'Liang had the "Julu Princess" lyric—seemingly a song of Yao Chang\'s time; its words are Chinese sound, unlike northern songs.',
    idiomatic: 'Liang preserved a Chinese-language "Julu Princess" lyric—likely from Yao Chang\'s day, unlike the northern pieces.',
  },
  s0339: {
    literal: 'Liang Music Bureau drum-and-blow also had "Great White Pure Crown Prince," "Little White Pure Crown Prince," "Qiyu," and other tunes.',
    idiomatic: 'Liang\'s bureau also listed "Great White Pure Crown Prince," "Little White Pure Crown Prince," "Qiyu," and similar drum pieces.',
  },
  s0340: {
    literal: 'Sui drum-and-blow had the "White Pure Crown Prince" tune; compared with northern songs, the sounds are all different.',
    idiomatic: 'Sui had its own "White Pure Crown Prince"; the melody differs from the northern version.',
  },
  s0341: {
    literal: 'At the beginning of Kaiyuan, on inquiry of song-master Zhangsun Yuanzhong, he said from Gaozu onward the craft was transmitted in the family.',
    idiomatic: 'Early Kaiyuan: vocalist Zhangsun Yuanzhong said his family had transmitted the art since Gaozu.',
  },
  s0342: {
    literal: 'Yuanzhong\'s grandfather received the craft from General Hou, named Guichang, a man of Bingzhou, who also practiced northern songs through generations.',
    idiomatic: 'His grandfather learned from General Hou Guichang of Bingzhou, another hereditary northern singer.',
  },
  s0343: {
    literal: 'In Zhenguan there was an edict ordering Guichang to teach the Music Bureau his sounds.',
    idiomatic: 'Zhenguan edicts had Guichang teach the bureau his repertoire.',
  },
  s0344: {
    literal: 'Yuanzhong\'s household transmitted thus through generations.',
    idiomatic: 'Yuanzhong\'s line handed it down the same way.',
  },
  s0345: {
    literal: 'Even translators cannot fully know the words—probably years distant, the true form lost.',
    idiomatic: 'Even interpreters cannot make out the words—the original has long been lost.',
  },
  s0346: {
    literal: 'Silk and tong wood: only qin pieces have Hu-jia sound and great horn, managed by the Golden Crow guard.',
    idiomatic: 'Among strings, only qin pieces include Hu-jia and great-horn tunes under the Golden Crow guard.',
  },
  s0347: {
    literal: '"Miscellaneous Music" exists in every age; it is not the sound of the department troupes—jesters, song, dance, and mixed performance.',
    idiomatic: '"Miscellaneous Music" spans every dynasty—non-bureau entertainment of actors, song, dance, and mixed acts.',
  },
  s0348: {
    literal: 'When Han Son of Heaven faced the hall and set music, a sheli beast came from the west, playing before the hall; spurting water it formed paired fish, leaping and sucking water, making mist that veiled the sun, transforming into a yellow dragon eight zhang long, emerging from the water to sport, dazzling in sunlight.',
    idiomatic: 'At Han court audiences a sheli beast from the west played before the throne, spouting water into twin fish that leapt and sprayed mist across the sun, then became an eight-zhang yellow dragon sporting in the light.',
  },
  s0349: {
    literal: 'Ropes tied two pillars several zhang apart; two singing girls danced opposite on the rope, shoulders touching yet not leaning.',
    idiomatic: 'Ropes spanned pillars yards apart; two women danced the rope face to face, shoulder to shoulder without falling.',
  },
  s0350: {
    literal: 'Such miscellaneous transformations are altogether called hundred entertainments.',
    idiomatic: 'Such variety acts were called the hundred entertainments.',
  },
  s0351: {
    literal: 'Left-bank still had "Gaoqi Purple Deer," "Walking Crab Eating," "Qi King Rolling Garments," "Rope Mouse," "Xia Yu Shouldering Tripod," "Minister Xiang Nursing," "Spirit Turtle Clapping Play Bearing Spirit Peak," "Osmanthus Tree White Snow," and "Drawing Earth into River" skills.',
    idiomatic: 'Jiangzuo still knew acts like Purple Deer of Gaoqi, Walking Crab, Qi King Rolling Cloth, Rope Mouse, Xia Yu with the tripod, Minister Xiang nursing, the turtle act bearing Spirit Peak, Osmanthus White Snow, and Drawing a River on the Ground.',
  },
  s0352: {
    literal: 'Emperor Cheng of Jin, Attendant Gentleman Gu Zhen memorialized: "Music of a decadent age sets exotic displays, running backward and linked inversion."',
    idiomatic: 'Jin Emperor Cheng\'s attendant Gu Zhen wrote: "Decadent shows invert nature with exotic stunts and upside-down tricks."',
  },
  s0353: {
    literal: '"The four seas attend the imperial court, yet enough to tread heaven and head to tread earth—reversing heaven-and-earth\'s order, injuring the great human relations."',
    idiomatic: '"All under heaven attends court, yet performers tread the sky with their feet and the earth with their heads—reversing cosmic order and violating human relations."',
  },
  s0354: {
    literal: '" He thereupon ordered the Court of Imperial Sacrifices to abolish them all.',
    idiomatic: '" He ordered the Court of Imperial Sacrifices to abolish them all.',
  },
  s0355: {
    literal: 'Afterward "Gaoqi Purple Deer" was restored.',
    idiomatic: 'Later "Gaoqi Purple Deer" was revived.',
  },
  s0356: {
    literal: 'Later Wei and Northern Qi also had "Fish Dragon Warding Evil," "Deer Horse Immortal Carriage," "Swallowing Blade Spitting Fire," "Stripping Cart Stripping Donkey," and "Planting Melon Pulling Well" plays.',
    idiomatic: 'Later Wei and Northern Qi also staged Fish-Dragon Warding Evil, Deer-Horse Immortal Carriage, blade swallowing, cart and donkey stripping, and melon-planting well-drawing acts.',
  },
  s0357: {
    literal: 'Emperor Xuan of Zhou summoned Qi music and gathered it in Guanzhong.',
    idiomatic: 'Northern Zhou Xuan Di brought Qi performers into Guanzhong.',
  },
  s0358: {
    literal: 'At the beginning of Kaihuang they were dispersed and dismissed.',
    idiomatic: 'Early Kaihuang dispersed them.',
  },
  s0359: {
    literal: 'When the Tujue qaghan came to audience at Luoyang palace, Emperor Yang held a great union of music, fully mastering Han, Jin, Zhou, and Qi techniques.',
    idiomatic: 'When a Türk qaghan visited Luoyang, Yangdi staged a grand music festival mastering Han through Qi repertoires.',
  },
  s0360: {
    literal: 'The Hu people were greatly startled.',
    idiomatic: 'The Hu guests were astonished.',
  },
  s0361: {
    literal: 'The emperor ordered the Music Office to practice them, often at the new year letting the masses view within Duan Gate.',
    idiomatic: 'He had the Music Office drill the acts and each New Year opened Duan Gate for public viewing.',
  },
  s0362: {
    literal: 'Generally "Miscellaneous Music" mixed plays are mostly illusion arts; illusion arts all come from the Western Regions—Tianzhu especially.',
    idiomatic: 'Miscellaneous acts are largely illusion tricks from the Western Regions, especially India.',
  },
  s0363: {
    literal: 'Emperor Wu of Han opened the Western Regions and first had skilled illusionists come to China.',
    idiomatic: 'Han Wudi\'s western campaigns first brought master illusionists to China.',
  },
  s0364: {
    literal: 'In Emperor An\'s time Tianzhu presented skills—able to sever hands and feet themselves and cut open the belly; from then every age had them.',
    idiomatic: 'Under Emperor An India sent performers who cut off limbs and opened their bellies—such acts recurred thereafter.',
  },
  s0365: {
    literal: 'Our Gaozong hated that they startled custom and ordered western border passes not to let them enter China.',
    idiomatic: 'Gaozong disliked their shock to morals and barred western passes to them.',
  },
  s0366: {
    literal: 'Fu Jian once obtained western-region inverted-dance performers.',
    idiomatic: 'Fu Jian once acquired western upside-down dancers.',
  },
  s0367: {
    literal: 'In Ruizong\'s time a Brahmin presented music; dancers walked inverted, yet danced with feet on extremely sharp knife points, planted upside down on the ground, lowering the eyes to the blades and passing them across the face, again planted under the back while a bili player stood on the belly—at the tune\'s end still unharmed.',
    idiomatic: 'Under Ruizong a Brahmin troupe danced upside-down on razor knife points, blades along the face and back, a bili player standing on the belly—finishing unhurt.',
  },
  s0368: {
    literal: 'Again prostrate they extended the hands; two men trod them, wrapping the body around the hands, turning a hundred times without end.',
    idiomatic: 'They also lay flat with arms outstretched while two men stepped on their hands and spun around them endlessly.',
  },
  s0369: {
    literal: 'Han times had pole-climbing skill and also plate dance.',
    idiomatic: 'Han had pole-climbing and plate dancing.',
  },
  s0370: {
    literal: 'Jin age added cups to it, calling it "Cup-Plate Dance."',
    idiomatic: 'Jin added cups, naming it the Cup-Plate Dance.',
  },
  s0371: {
    literal: 'A Music Bureau poem says, "Lovely sleeves surmount seven plates"—meaning the dance used seven plates.',
    idiomatic: 'A yuefu line runs, "Fair sleeves span seven plates"—seven plates in the dance.',
  },
  s0372: {
    literal: 'Liang called it "Plate-Dance Skill."',
    idiomatic: 'Liang called it the Plate-Dance act.',
  },
  s0373: {
    literal: 'Liang had "Long-Stilt Skill," "Throwing-Inversion Skill," "Sword-Leap Skill," and "Sword-Swallowing Skill"—all exist today.',
    idiomatic: 'Liang knew stilt walking, tumbling, sword leaping, and sword swallowing—all still performed.',
  },
  s0374: {
    literal: 'There was also "Wheel-Dance Skill"—probably today\'s wheel acts.',
    idiomatic: 'There was also wheel dancing—today\'s cart-wheel acts.',
  },
  s0375: {
    literal: '"Passing Three Gorges Skill"—probably today\'s kind of "Passing Flying Ladder."',
    idiomatic: '"Passing Three Gorges" resembles today\'s flying-ladder stunt.',
  },
  s0376: {
    literal: '"Gaoqi Skill"—probably today\'s rope play.',
    idiomatic: '"Gaoqi" is today\'s rope dancing.',
  },
  s0377: {
    literal: 'Liang had "Monkey Banner Skill"; today there is "Pole-Climbing" and also "Monkey Pole-Climbing"—which is correct is unclear.',
    idiomatic: 'Liang had Monkey-on-Banner acts; today\'s pole-climbing and monkey pole acts may stem from either—uncertain which.',
  },
  s0378: {
    literal: 'There were also "Playing Bowl Pearl Skill" and "Cinnabar Pearl Skill."',
    idiomatic: 'Also bowl-pearl juggling and cinnabar-pearl acts.',
  },
  s0379: {
    literal: 'Song-and-dance plays include "Great Mask," "Botou," "Taoyao Niang," and "Kuileizi" and other plays.',
    idiomatic: 'Dramatic pieces include Great Mask, Botou, Taoyao Niang, and puppet Kuileizi plays.',
  },
  s0380: {
    literal: 'Xuanzong, because they were not orthodox sound, placed the Instruction Workshop within the forbidden quarter to house them.',
    idiomatic: 'Xuanzong, deeming them non-court music, housed them in the inner-city Instruction Workshop.',
  },
  s0381: {
    literal: '"Brahmin Music" is listed with the four barbarians alike.',
    idiomatic: 'Brahmin Music ranks with the four foreign repertoires.',
  },
  s0382: {
    literal: '"Brahmin Music" uses two lacquered bili and one Qi drum.',
    idiomatic: 'Brahmin Music uses two lacquered bili and one Qi drum.',
  },
  s0383: {
    literal: '"Miscellaneous Music" uses one transverse flute, one clapper, and three waist-drums.',
    idiomatic: 'Miscellaneous Music uses one transverse flute, one clapper, and three waist-drums.',
  },
  s0384: {
    literal: 'Other mixed plays change form in many ways—all not worth naming.',
    idiomatic: 'Other variety acts shift form endlessly and need not be catalogued.',
  },
  s0385: {
    literal: '"Great Mask" comes from Northern Qi.',
    idiomatic: 'Great Mask originated in Northern Qi.',
  },
  s0386: {
    literal: 'Northern Qi\'s Prince Lanling, Chang Gong, was talented in war yet beautiful of face and often wore a false mask to face the enemy.',
    idiomatic: 'Northern Qi\'s Prince Lanling Chang Gong was valiant but handsome and often wore a mask in battle.',
  },
  s0387: {
    literal: 'Once striking Zhou troops below Jinyong city, his courage topped the three armies; Qi people admired it and made this dance to imitate his directing and thrusting bearing, calling it "Prince Lanling Enters the Array."',
    idiomatic: 'After routing Zhou forces at Jinyong, Qi created a dance mimicking his command and spear work—"Prince Lanling Enters the Array."',
  },
  s0388: {
    literal: '"Botou" comes from the Western Regions.',
    idiomatic: 'Botou came from the Western Regions.',
  },
  s0389: {
    literal: 'A Hu man was bitten by a fierce beast; his son sought the beast and killed it, making this dance to image it.',
    idiomatic: 'A Hu man was killed by a beast; his son slew the beast and staged this dance in reenactment.',
  },
  s0390: {
    literal: '"Taoyao Niang" arose at the end of Sui.',
    idiomatic: 'Taoyao Niang arose in late Sui.',
  },
  s0391: {
    literal: 'At the end of Sui in Henei there was a man ugly of face and fond of wine who often styled himself Attendant; drunk returning he always beat his wife.',
    idiomatic: 'Late Sui Henei had an ugly, drunken man who called himself Attendant and beat his wife when he came home drunk.',
  },
  s0392: {
    literal: 'His wife was beautiful and skilled at song, making plaintive bitter words.',
    idiomatic: 'His wife was beautiful and sang bitter laments.',
  },
  s0393: {
    literal: 'North of the Yellow River performed his tune and clothed it in strings and pipes, thereby depicting his wife\'s appearance.',
    idiomatic: 'Hebei set the tune to strings and pipes and painted her likeness in the performance.',
  },
  s0394: {
    literal: 'The wife grieved and pleaded; each time she swayed her body—hence the name "Taoyao Niang."',
    idiomatic: 'She pleaded in song, swaying as she danced—hence Taoyao ("Swaying") Niang.',
  },
  s0395: {
    literal: 'Recent actors have considerably altered its form—not the old intent.',
    idiomatic: 'Modern actors have changed the form far from the original.',
  },
  s0396: {
    literal: '"Kuileizi," also called "Kui leizi," makes puppets to play, skilled at song and dance.',
    idiomatic: 'Kuileizi (puppet) plays, also called Kui leizi, use figures adept at song and dance.',
  },
  s0397: {
    literal: 'Originally funeral-house music.',
    idiomatic: 'They began as funeral entertainment.',
  },
  s0398: {
    literal: 'At the end of Han it was first used at festive gatherings.',
    idiomatic: 'Late Han first used them at banquets.',
  },
  s0399: {
    literal: 'Later Ruler Gao Wei of Qi especially loved it.',
    idiomatic: 'Northern Qi\'s Gao Wei adored them.',
  },
  s0400: {
    literal: 'Koguryo also has them.',
    idiomatic: 'Koguryo has them as well.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '029') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 029; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
