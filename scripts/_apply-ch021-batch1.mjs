#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal: 'The Record says: "Man is born in stillness—that is Heaven\'s nature;',
    idiomatic: 'The Record says: "At birth people are still—that is Heaven\'s nature;',
  },
  s0002: {
    literal: 'stirred by things he is moved, and that is the nature of desire.',
    idiomatic: 'moved by things, desire stirs in the nature.',
  },
  s0003: {
    literal: '" When desire knows no bound, calamity and disorder arise.',
    idiomatic: 'Unbounded desire breeds trouble and chaos.',
  },
  s0004: {
    literal: 'The sages, fearing its perverse excess, thereupon composed music to harmonize the nature and fashioned ritual to restrain the feelings, so that in bowing and rising there was seemliness and in coming and going one kept to the square.',
    idiomatic: 'Fearing excess, sages made music to tune the heart and ritual to check feeling, so deportment had form and conduct kept measure.',
  },
  s0005: {
    literal: 'Thus when the rite of the grand audience was established, the court was honored;',
    idiomatic: 'When the grand-audience rite stood, the court gained dignity;',
  },
  s0006: {
    literal: 'when the suburban and temple rites were established, human feeling was solemn;',
    idiomatic: 'suburban and temple rites made custom solemn;',
  },
  s0007: {
    literal: 'when the capping and wedding rites were established, elder and younger were ordered;',
    idiomatic: 'capping and wedding rites fixed seniority;',
  },
  s0008: {
    literal: 'when the mourning and sacrifice rites were established, filial piety and kindness were displayed;',
    idiomatic: 'mourning and sacrifice rites displayed filial kindness;',
  },
  s0009: {
    literal: 'when the hunt rites were established, the army was rallied;',
    idiomatic: 'hunt rites rallied the hosts;',
  },
  s0010: {
    literal: 'when the feast rites were established, ruler and minister were sincere.',
    idiomatic: 'feast rites bound lord and minister.',
  },
  s0011: {
    literal: 'Thus one knows that ritual is the jeweled balance of all categories and the measuring cord of human relations—who loses it is shamed, who gains it is honored; creation itself returns to it and one may not for an instant depart from it.',
    idiomatic: 'Ritual is the scale of all kinds and the rule of human bonds; to lose it is shame, to hold it honor—not a moment may pass without it.',
  },
  s0012: {
    literal: 'In the time of the Five Emperors, this was the root of governance.',
    idiomatic: 'Under the Five Emperors it was the root of rule.',
  },
  s0013: {
    literal: 'Worshiping the Emperor and offering to the Ancestor were auspicious ritual;',
    idiomatic: 'Worship of the Lord and Ancestor were auspicious rites;',
  },
  s0014: {
    literal: 'suppressing music and using earthenware were inauspicious ritual;',
    idiomatic: 'silencing music and pottery vessels were baleful rites;',
  },
  s0015: {
    literal: 'presenting jade tablets at the grand audience was guest ritual;',
    idiomatic: 'jade at the grand audience was guest ritual;',
  },
  s0016: {
    literal: 'punishing the Miao and executing Gun were military ritual;',
    idiomatic: 'punishing the Miao and executing Gun were military rites;',
  },
  s0017: {
    literal: 'conferring rank and bestowing marriage were felicitous ritual.',
    idiomatic: 'enfeoffment and marriage were celebratory rites.',
  },
  s0018: {
    literal: 'Hence it is said that to perfect the five rituals and five jades was the affair of Yao and Shun.',
    idiomatic: 'So perfecting the five rituals and five jades was Yao and Shun\'s work.',
  },
  s0019: {
    literal: 'The age was still pure and the forms and text were yet simple.',
    idiomatic: 'The age was plain and ceremonies still spare.',
  },
  s0020: {
    literal: 'When the Duke of Zhou assisted King Cheng, he fashioned the five rituals and six kinds of music, each with its proper officer, and the ceremonies became fully complete.',
    idiomatic: 'When the Duke of Zhou served Cheng, five rituals and six musics each had officers—the ceremonial fully formed.',
  },
  s0021: {
    literal: 'When You and Li lost the Way, King Ping moved east, the Zhou house gradually declined, and the feudal lords held the law in contempt.',
    idiomatic: 'From You and Li\'s failure through Ping\'s eastern move, Zhou waned and lords scorned the law.',
  },
  s0022: {
    literal: 'Men and women lost the norms of capping and marriage; the satire of "The Wild Deer" arose;',
    idiomatic: 'Loss of capping and wedding brought "The Wild Deer";',
  },
  s0023: {
    literal: 'ruler and minister abandoned the schedule of audiences; the reproach of Jimu was recorded.',
    idiomatic: 'broken audiences brought the shame of Jimu.',
  },
  s0024: {
    literal: 'Burials knew no limit between extravagance and thrift; armies practiced deceit without humanity.',
    idiomatic: 'Burials swung between waste and stinginess; armies grew crafty and cruel.',
  },
  s0025: {
    literal: 'Within several hundred years the rituals were greatly ruined.',
    idiomatic: 'In centuries the rites collapsed.',
  },
  s0026: {
    literal: 'Though when Confucius returned from Wei to Lu there was talk of fixing ritual, he merely raised the Duke of Zhou\'s old statutes and could not rescue Lu\'s chaotic government.',
    idiomatic: 'Confucius\'s return from Wei brought talk of fixing ritual, but raising Zhou\'s old forms could not save chaotic Lu.',
  },
  s0027: {
    literal: 'In Confucius\'s age the substance of teaching was already lost.',
    idiomatic: 'By Confucius\'s time the body of teaching was gone.',
  },
  s0028: {
    literal: 'Qin\'s burning left the transmitted texts nearly all destroyed.',
    idiomatic: 'Qin\'s fires nearly wiped the classics out.',
  },
  s0029: {
    literal: 'When Han arose, Shusun Tong drafted on the fly, studying only court ceremony.',
    idiomatic: 'Han\'s Shusun Tong sketched rites, learning only court ceremony.',
  },
  s0030: {
    literal: 'As for the texts of sacrificing to Heaven on the outskirts and Earth, the regulations pairing ancestors with the Ancestor, the full provision of stone clappers and sounding spheres, and the great designs of the Hillock of Jie and the Jade Water—such things were spoken of but there was no leisure to set one\'s mind to them.',
    idiomatic: 'Suburban sacrifice to Heaven and Earth, ancestral pairing, stone chimes and sounding spheres, fengshan at Jieqiu and Jade Water—men spoke of them but had no time to plan.',
  },
  s0031: {
    literal: 'When Emperor Wu honored Confucian learning, repeatedly sought out worthy men, the Prince of Hejian\'s mastery of ancient texts led to a great search of the classics, and with Zhou\'s old statutes he first obtained the five chapters of the Offices of Zhou and seventeen chapters of the Rites of the Scholar.',
    idiomatic: 'Wu honored Ru learning and sought worthies; Hejian\'s mastery unearthed the Offices of Zhou (five chapters) and the Scholar\'s Rites (seventeen).',
  },
  s0032: {
    literal: 'The prince also gathered the sayings of the various masters into a ritual book of one hundred forty chapters.',
    idiomatic: 'The prince also assembled masters\' sayings into one hundred forty chapters of ritual.',
  },
  s0033: {
    literal: 'Later Cang and the two Dais selected from them and got forty-nine chapters—this was the Quetai Collected Rituals, today\'s Book of Rites.',
    idiomatic: 'Later Cang and the two Dais cut it to forty-nine—the Quetai Collected Rituals, now the Book of Rites.',
  },
  s0034: {
    literal: 'Yet for several hundred years the old ceremonies were not seen; what the masters wrote only discussed the meaning.',
    idiomatic: 'For centuries old performance vanished; masters wrote meaning only.',
  },
  s0035: {
    literal: 'A hundred schools vented private theories; the five rituals had no fixed written form.',
    idiomatic: 'Schools indulged private opinion; the five rituals lacked fixed text.',
  },
  s0036: {
    literal: 'Therefore throughout the Western Han at Quetai there was no system.',
    idiomatic: 'Western Han had Quetai text but no enforced system.',
  },
  s0037: {
    literal: 'The suburban Lord was sacrificed to at Sweet Springs; the Queen of Earth at Fenyin.',
    idiomatic: 'Heaven at Sweet Springs, Earth at Fenyin.',
  },
  s0038: {
    literal: 'The ancestral temple had no fixed focus; music lacked metal and stone.',
    idiomatic: 'The temple had no fixed lord; music lacked bells and stones.',
  },
  s0039: {
    literal: 'Tours of inspection were not the canon of Kun and Hua; fengshan differed from pottery and gourd sound.',
    idiomatic: 'Inspection tours were not Kun-Hua canon; fengshan diverged from rustic simplicity.',
  },
  s0040: {
    literal: 'When Guangwu received the mandate, he first ordered ritual officials to draft ceremony and statute; the great statutes of the state were then roughly complete.',
    idiomatic: 'Guangwu ordered scholars to draft rites—the state\'s great canon was roughly set.',
  },
  s0041: {
    literal: 'At the end of Han turmoil fell upon them again.',
    idiomatic: 'Han\'s end plunged them back into ruin.',
  },
  s0042: {
    literal: 'Wei Hong, Ying Zhongyuan, Wang Zhongxuan, and others picked up what survived and trimmed it to headings only.',
    idiomatic: 'Wei Hong, Ying Zhongyuan, and Wang Zhongxuan salvaged fragments into bare outlines.',
  },
  s0043: {
    literal: 'The old statutes of the Eastern Capital—no one in the world could hear of them.',
    idiomatic: 'Eastern Capital\'s old rites were unheard in the world.',
  },
  s0044: {
    literal: 'From Jin through Liang orders and statutes followed one another.',
    idiomatic: 'Jin through Liang issued continuing regulations.',
  },
  s0045: {
    literal: 'Erudite scholars thought deep and far; scholars of the Jiang left could dimly behold them.',
    idiomatic: 'Great scholars wove long formulations; Jiangzuo students could glimpse them.',
  },
  s0046: {
    literal: 'When the Sui pacified Chen and unified the realm, Wen Di ordered the Director of Ritual Niu Hong to collect northern and southern ceremony into the Five Rituals in one hundred thirty chapters.',
    idiomatic: 'Sui\'s unification had Wen Di order Niu Hong to compile north-south ritual into one hundred thirty chapters.',
  },
  s0047: {
    literal: 'Yang Di at Guangling also gathered students and compiled the Jiangdu Collected Rituals.',
    idiomatic: 'Yang Di at Guangling gathered students for the Jiangdu Collected Rituals.',
  },
  s0048: {
    literal: 'Thus the systems of Zhou and Han survived only as a remnant breeze.',
    idiomatic: 'Zhou and Han institutions survived only as a faint tradition.',
  },
  s0049: {
    literal: 'When Shenyao received the abdication, he had no leisure to create; suburban altars and feasts all used Sui\'s old ceremonies.',
    idiomatic: 'Shenyao\'s succession used Sui rites for suburbs and banquets—no new work yet.',
  },
  s0050: {
    literal: 'When Taizong first took the throne he greatly revived culture and letters and ordered Chancellor Fang Xuanling, Secretariat Director Wei Zheng, and other ritual officials and academicians to revise the old rituals and fix the Auspicious Rituals in sixty-one chapters, Guest Ritual in four, Military Ritual in twenty, Felicitous Ritual in forty-two, Baleful Ritual in six, and National Mourning in five—a total of one hundred thirty-eight chapters in one hundred scrolls.',
    idiomatic: 'Taizong revived letters and had Fang Xuanling, Wei Zheng, and ritual scholars revise rites: Auspicious sixty-one, Guest four, Military twenty, Felicitous forty-two, Baleful six, National Mourning five—one hundred thirty-eight chapters in one hundred juan.',
  },
  s0051: {
    literal: 'Xuanling and others first deliberated with ritual officers, holding that in the Monthly Ordinances the seasonal sacrifice is only to the Heavenly Clan, meaning sun and moon and below.',
    idiomatic: 'Xuanling argued the Monthly Ordinances\' seasonal sacrifice reaches only the Heavenly Clan—sun, moon, and below.',
  },
  s0052: {
    literal: 'In recent times sacrificing to the Five Heavenly Emperors, Five Human Emperors, and Five Earth Spirits on the seasonal day were none of them classical antiquity; they are all now abolished.',
    idiomatic: 'Recent worship of Five Heavens, Five Humans, and Five Earths on the jiao day—all abolished as unclassical.',
  },
  s0053: {
    literal: 'Again by ritual what benefits the people is sacrificed to.',
    idiomatic: 'Ritual says: benefit the people, then sacrifice.',
  },
  s0054: {
    literal: 'The Spirit Land is what the state rests upon; the other eight provinces are not connected in meaning.',
    idiomatic: 'Spirit Land supports the realm; the eight regions are not analogous.',
  },
  s0055: {
    literal: 'In recent times all nine provinces were commonly sacrificed to; now the eight altar-seats of the eight provinces are removed, and only the Imperial Earth Spirit and Spirit Land are sacrificed to, to rectify the sacrificial canon.',
    idiomatic: 'Nine-province worship was cut to Earth Spirit and Spirit Land only.',
  },
  s0056: {
    literal: 'Again in Jianwu of Han at fengshan they used Yuanfeng precedents, sealing Mount Tai on a round terrace with stone gate towers on all four sides, each five zhang high.',
    idiomatic: 'Jianwu fengshan followed Yuanfeng: round terrace on Tai with four stone gates five zhang high.',
  },
  s0057: {
    literal: 'There was a square stone piled in layers, concealing a jade text.',
    idiomatic: 'Layered square stones hid a jade document.',
  },
  s0058: {
    literal: 'Ten stone caskets at the four sides—three east and west, two north and south.',
    idiomatic: 'Ten stone checks: three east and west, two north and south.',
  },
  s0059: {
    literal: 'Outside were stone seals nine chi high with stone caps on top.',
    idiomatic: 'Outer stone seals nine chi high, capped in stone.',
  },
  s0060: {
    literal: 'Eighteen stone distances were set around like steles, two bu from the altar, their stone bases sunk several chi into the earth.',
    idiomatic: 'Eighteen stone distances like steles two bu from the mound, bases sunk deep.',
  },
  s0061: {
    literal: 'Now investigating fengshan: it was fundamentally to report success to the Lord on High.',
    idiomatic: 'Fengshan was to report success to the Lord on High.',
  },
  s0062: {
    literal: 'The Way of Heaven esteems substance; hence straw mats and pottery vessels.',
    idiomatic: 'Heaven\'s Way favors simplicity—straw and pottery.',
  },
  s0063: {
    literal: 'This method is not in the classics and also violates the path of pure simplicity; it was decided to abolish it.',
    idiomatic: 'Not in canon, against simplicity—abolished.',
  },
  s0064: {
    literal: 'Recently it was considered that Liangfu is the yin of Liang; generations set the altar on the mountain top, contrary to dwelling in yin.',
    idiomatic: 'Liangfu is Liang\'s yin; mountain-top altars violated yin.',
  },
  s0065: {
    literal: 'Now the shan rite\'s altar position is fixed north of the mountain.',
    idiomatic: 'Shan altar placed north of the mountain.',
  },
  s0066: {
    literal: 'Also the crown prince entering study, the Director of Ritual going for imperial tombs, the Son of Heaven\'s great archery, heji, displaying the five weapons at the Grand Shrine, lecturing military matters in agricultural intervals, receiving the empress through the six rites, reading the seasons in the four meng months, the Son of Heaven\'s tomb visits, temple audiences, and nourishing the aged in the Piyong—rites omitted by Zhou and Sui; in all twenty-nine articles were added.',
    idiomatic: 'Twenty-nine rites Zhou and Sui lacked were added: heir\'s schooling, tomb rites, archery, heji, five arms at Grand Shrine, war lectures, empress\'s six rites, seasonal readings, tomb visits, audiences, aged at Piyong.',
  },
  s0067: {
    literal: 'The rest according to ancient ritual, seeking out other ages beside, choosing the good and following it.',
    idiomatic: 'Otherwise follow ancient rites, borrow best from other ages.',
  },
  s0068: {
    literal: 'Taizong praised it and issued it for implementation inside and outside.',
    idiomatic: 'Taizong approved and promulgated it.',
  },
  s0069: {
    literal: 'Early in Gaozong\'s reign critics said the Zhenguan Ritual\'s forms were not exhaustive; again ordered Grand Mentor Zhangsun Wuji, Chancellor Du Zhenglun, Li Yifu, Secretariat Vice Director Li Youyi, Yellow Gate Vice Liu Xiangdao, Xu Tushi, Chief Banquet Officer Xu Jingzong, Director of Ritual Wei Kun, Erudite Shi Daoxuan, Seal Director Kong Zhiyue, Ritual Erudite Xiao Chucai, Sun Zijue, He Ji, and others to compile anew into one hundred thirty scrolls.',
    idiomatic: 'Gaozong had Wuji, Li Yifu, Xu Jingzong, and others revise into one hundred thirty juan.',
  },
  s0070: {
    literal: 'In the third year of Xianqing it was submitted; augmenting and reducing old ritual and aligning with statutes and forms, Gaozong himself wrote the preface.',
    idiomatic: 'Xianqing 3 it was presented with Gaozong\'s preface.',
  },
  s0071: {
    literal: 'Xu Jingzong and Li Yifu then held power; their augmentations mostly pandered to will; after implementation scholars disputed that it did not equal Zhenguan.',
    idiomatic: 'Xu and Li\'s changes often flattered the throne; scholars judged it below Zhenguan.',
  },
  s0072: {
    literal: 'Third month, third year of Shangyuan, an edict ordered the Zhenguan-era ritual taken as fixed.',
    idiomatic: 'Shangyuan 3.3 returned to Zhenguan ritual.',
  },
  s0073: {
    literal: 'Second year of Yifeng, again an edict that Xianqing\'s new ritual often failed to follow antiquity and the five rituals were all to follow the Rites of Zhou.',
    idiomatic: 'Yifeng 2 ordered five rituals to follow Zhou ritual—Xianqing faulted for ignoring antiquity.',
  },
  s0074: {
    literal: 'From this the ritual office increasingly lacked a fixed standard; for each great affair they compared ancient and modern ritual texts and drafted provisionally.',
    idiomatic: 'Ritual officers had no fixed standard—major events improvised from old and new.',
  },
  s0075: {
    literal: 'Yet both Zhenguan and Xianqing Rituals continued in use without abolition.',
    idiomatic: 'Both Zhenguan and Xianqing rituals stayed in use.',
  },
  s0076: {
    literal: 'At the time Director of Ritual Pei Mingli and Vice Director Wei Wanshi in succession managed affairs; erudites He Ai, He Ji, Wei Shuxia, Pei Shouzhen, and others decided much.',
    idiomatic: 'Pei Mingli, Wei Wanshi, and erudites He Ai, He Ji, Wei Shuxia, and Pei Shouzhen decided much.',
  },
  s0077: {
    literal: 'In Wu Zetian\'s time, ritual officers being insufficiently clear, she specially ordered Erudite Zhu Qinming and Shuxia—whenever there was ceremony they were to join in fixing it.',
    idiomatic: 'Wu Zetian ordered Zhu Qinming and Shuxia to fix every ceremony.',
  },
  s0078: {
    literal: 'After Shuxia\'s death Erudite Tang Shao specialized in ritual, learned and skilled in old affairs; critics deemed him fit for the post.',
    idiomatic: 'Tang Shao took ritual after Shuxia—judged competent.',
  },
  s0079: {
    literal: 'Second year of Xiantian, Shao as Palace Attendant was executed for impropriety at martial exposition.',
    idiomatic: 'Xiantian 2 Shao was executed for a drill lapse.',
  },
  s0080: {
    literal: 'Later ritual officers Zhang Xing and Wang Xiu erred on New Year\'s ceremony and were ordered dismissed to study at home.',
    idiomatic: 'Zhang Xing and Wang Xiu lost New Year\'s rites and were sent home to study.',
  },
  s0081: {
    literal: 'An edict ordered Guozi Vice Director Wei Chao as Ritual Commissioner exclusively in charge of the five rituals.',
    idiomatic: 'Wei Chao was made Ritual Commissioner for the five rituals.',
  },
  s0082: {
    literal: 'Fourteenth year, Reminder Wang Yan memorialized to revise the Book of Rites, cutting old text and compiling present affairs.',
    idiomatic: 'Kaiyuan 14 Wang Yan asked to rewrite the Book of Rites from current practice.',
  },
  s0083: {
    literal: 'The edict was sent to the Academicians for detailed discussion.',
    idiomatic: 'Edict referred it to the Academy.',
  },
  s0084: {
    literal: 'Right Chancellor Zhang Yue memorialized: "The Book of Rites was compiled in Han and has become an unalterable canon for successive generations.',
    idiomatic: 'Zhang Yue said the Book of Rites is Han\'s unalterable canon.',
  },
  s0085: {
    literal: 'Now we are far from the sages and revision may be difficult.',
    idiomatic: 'Saints are distant—hard to change.',
  },
  s0086: {
    literal: 'Today\'s five ritual statutes of Zhenguan and Xianqing differ in places and may not be reconciled.',
    idiomatic: 'Zhenguan and Xianqing rites differ—may need reconciliation.',
  },
  s0087: {
    literal: 'I hope together with scholars to discuss antiquity and the present again and revise what is in use."',
    idiomatic: 'Hope to compare antiquity and present and revise what is used.',
  },
  s0088: {
    literal: 'The Imperial decision granted it.',
    idiomatic: 'The edict assented.',
  },
  s0089: {
    literal: 'At first ordered Academician Right Regular Xu Jian, Reminder Li Rui, Ritual Erudite Shi Jingben, and others to compile; year after year without completion.',
    idiomatic: 'Xu Jian, Li Rui, and Shi Jingben drafted for years unfinished.',
  },
  s0090: {
    literal: 'After Yue\'s death Xiao Song replaced him as Academy Chancellor and had Recorder Wang Zhongqiu complete one hundred fifty scrolls titled Great Tang Kaiyuan Ritual.',
    idiomatic: 'Xiao Song had Wang Zhongqiu finish one hundred fifty juan as Kaiyuan Ritual.',
  },
  s0091: {
    literal: 'Ninth month, twentieth year, issued for the offices to implement.',
    idiomatic: 'Kaiyuan 20.9 promulgated for use.',
  },
  s0092: {
    literal: 'August Lord, Five Directional Emperors, Imperial Earth Spirit, Spirit Land, and ancestral temple are great sacrifice; altars of soil and grain, sun moon stars, former dynasties\' emperors, peaks rivers seas, imperial soil altar, Silkworm Ancestor, libation for release are middle sacrifice; Director of Central, Director of Fate, Wind Earl, Rain Master, various stars, mountains forests rivers marshes are small sacrifice.',
    idiomatic: 'Great sacrifice: August Lord, Five Emperors, Earth, Spirit Land, temple; middle: soil and grain, sun moon and stars, former kings, peaks and rivers, etc.; small: various spirits.',
  },
  s0093: {
    literal: 'Great sacrifice—the office each year sets the day in advance and submits it.',
    idiomatic: 'Great sacrifices get annual dated submission.',
  },
  s0094: {
    literal: 'Small sacrifice—only a dispatch to the responsible office.',
    idiomatic: 'Small sacrifices get a memorandum only.',
  },
  s0095: {
    literal: 'If the Son of Heaven does not personally sacrifice, then the Three Excellencies perform the rite;',
    idiomatic: 'If the emperor does not attend, Three Excellencies perform;',
  },
  s0096: {
    literal: 'if the office is vacant, then active-duty officials of third rank and above act for the Three Excellencies.',
    idiomatic: 'Vacant posts: third-rank and above officers deputize.',
  },
  s0097: {
    literal: 'Great sacrifice: dispersal fast four days, full fast three days.',
    idiomatic: 'Great: four dispersal, three full fast.',
  },
  s0098: {
    literal: 'Middle sacrifice: dispersal fast three days, full fast two days.',
    idiomatic: 'Middle: three dispersal, two full.',
  },
  s0099: {
    literal: 'Small sacrifice: dispersal fast two days, full fast one day.',
    idiomatic: 'Small: two dispersal, one full.',
  },
  s0100: {
    literal: 'On dispersal-fast days one handles affairs by day as before, lodges at night in the home\'s main chamber, may not mourn or visit the sick, may not sign documents of punishment and execution, may not pass sentence on criminals, may not make music, may not attend unclean affairs.',
    idiomatic: 'Dispersal fast: daytime business as usual, sleep in main chamber; no mourning, sick visits, capital sentences, music, or polluting work.',
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
if (data.metadata.chapter !== '021') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 021; standalone T ready (${Object.keys(T).length} entries).`
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
