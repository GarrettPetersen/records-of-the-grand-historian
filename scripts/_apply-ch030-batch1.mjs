#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
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
    literal: 'Treatise Six, Rites Six.',
    idiomatic: 'Treatise 6: Rites 6.',
  },
  s0002: {
    literal: 'In the third month of the first year of Jianzhong, the Commissioner of Ritual memorialized: "The Eastern Capital Grand Temple lacks wooden spirit tablets; we request that they be made for enshrinement."',
    idiomatic: 'Third month, Jianzhong 1: the ritual commissioner reported that the Eastern Capital Grand Temple had no wooden tablets and asked that tablets be made for enshrinement.',
  },
  s0003: {
    literal: 'Initially, Empress Wu had established temples to Gaozu, Taizong, and Gaozong at the Eastern Capital.',
    idiomatic: 'At first Empress Wu had built three shrines at the eastern capital—for Gaozu, Taizong, and Gaozong.',
  },
  s0004: {
    literal: 'By the time of Zhongzong and afterward, the Grand Temples of both capitals received offerings in all four seasons.',
    idiomatic: 'From Zhongzong onward, both capitals\' ancestral halls were fed in every season.',
  },
  s0005: {
    literal: 'After the rebellion of Zhide, many wooden tablets were lost or missing and had not been enshrined.',
    idiomatic: 'After the Zhide turmoil, many tablets were lost and never re-enshrined.',
  },
  s0006: {
    literal: 'Debate erupted; the main positions were three: "First, the shrine must be kept, tablets installed for all lords, and seasonal offerings made."',
    idiomatic: 'Officials argued in three camps: first, keep the temple, install tablets for all lords, and offer seasonal sacrifices.',
  },
  s0007: {
    literal: '"Second, build the shrine and tablets but keep them without sacrifice; when the imperial carriage tours, feast there."',
    idiomatic: 'Second, build the hall and tablets but do not sacrifice—only feast when the imperial tour came east.',
  },
  s0008: {
    literal: '"Third, keep the shrine, bury the tablets; when the throne tours east, dress a fasting carriage and bring the capital\'s ancestral tablets along."',
    idiomatic: 'Third, keep the temple, bury the tablets, and when the throne toured east, dress a fasting carriage and bring the capital\'s tablets along.',
  },
  s0009: {
    literal: 'The debaters reached no decision and the matter lapsed.',
    idiomatic: 'Debate deadlocked and the matter lapsed.',
  },
  s0010: {
    literal: 'In the fourth month of the fifteenth year of Zhenyuan, Gui Chongjing, Bureau Director of Provisions, submitted a memorial: "The Eastern Capital Grand Temple ought not to hold wooden spirit tablets."',
    idiomatic: 'Zhenyuan 15, fourth month: Gui Chongjing of the Provisions Bureau memorialized that the eastern temple ought not hold wooden tablets.',
  },
  s0011: {
    literal: 'I respectfully cite the canonical rites.',
    idiomatic: 'He cited canonical ritual.',
  },
  s0012: {
    literal: 'The yu tablet uses mulberry; the lian tablet uses chestnut; when the chestnut tablet is remade, the mulberry tablet is buried.',
    idiomatic: 'A yu tablet uses mulberry; a lian tablet uses chestnut—remake the chestnut tablet and bury the mulberry.',
  },
  s0013: {
    literal: 'Thus a spirit has no two dwelling places, as heaven has no two suns and earth no two kings.',
    idiomatic: 'Thus no spirit has two abodes—no more than heaven two suns or earth two kings.',
  },
  s0014: {
    literal: 'Today\'s Eastern Capital Grand Temple was built by Empress Zetian to house the Wu clan\'s wooden tablets.',
    idiomatic: 'Today\'s eastern hall was built by Empress Wu to seat the Wu line\'s tablets.',
  },
  s0015: {
    literal: 'Zhongzong removed the tablets but kept the shrine, likely to prepare for tours or moving the seat of government.',
    idiomatic: 'Zhongzong cleared the tablets but kept the building, preparing a site for tours or capital moves.',
  },
  s0016: {
    literal: 'Moreover the Shang moved their seat many times—eight capitals before, five after, thirteen relocations in all—and did not erect separate spirit tablets in every city.',
    idiomatic: 'The Shang moved constantly—eight capitals before, five after, thirteen relocations—and did not raise a separate tablet in each place.',
  },
  s0017: {
    literal: 'Some debaters said: "The Eastern Capital tablets were once reverently served and honored—how can they be cast aside in a single day?"',
    idiomatic: 'Some said the eastern tablets had been reverently served—could they be cast aside in a day?',
  },
  s0018: {
    literal: '"At yu sacrifice the mulberry tablet is erected and reverently offered; at lian sacrifice the chestnut tablet is erected and the mulberry buried—was the mulberry never reverently offered, yet buried?"',
    idiomatic: 'At yu you erect and worship the mulberry tablet; at lian you raise chestnut and bury mulberry—had mulberry never been worshipped before burial?',
  },
  s0019: {
    literal: '"Moreover the missing tablets cannot be remade; remaking them out of season is uncanonical." The passage concluded.',
    idiomatic: 'Nor could lost tablets be replaced untimely—remaking off-season was uncanonical. The passage concluded."',
  },
  s0020: {
    literal: 'In the second month of the first year of Changqing, Li Bo, Outer-Assignment Vice Director of the Storehouse Bureau, memorialized: "The spirit tablets in Taiwei Palace should be returned for enshrinement in the Grand Temple."',
    idiomatic: 'Changqing 1, second month: Li Bo, eastern-capital Storehouse vice director, asked to reunite Taiwei Palace tablets with the Grand Temple.',
  },
  s0021: {
    literal: 'An edict referred the matter to Eastern Capital Regent Zheng Yin for deliberation and report.',
    idiomatic: 'The edict referred the matter to regent Zheng Yin at the eastern capital for deliberation and report.',
  },
  s0022: {
    literal: 'Yin memorialized: "Your servant has examined the rites of the Three Dynasties and traced Gaozu and Taizong\'s institutions—never was there a rite of founding two halls in tandem or feasting two sets of tablets together."',
    idiomatic: 'Yin reported: he had traced Three Dynasties ritual and Gaozu and Taizong\'s institutions—never two halls built in parallel or two tablet lines feasted together.',
  },
  s0023: {
    literal: 'During the Tian-shou reign the sacrificial code was reformed.',
    idiomatic: 'At Tian-shou the sacrificial code shifted.',
  },
  s0024: {
    literal: 'When Zhongzong first restored former things he had no time to scrutinize the canon and founded an ancestral shrine at Luoyang.',
    idiomatic: 'Zhongzong, restoring the old order in haste, never examined the classics and raised a lineage temple at Luoyang.',
  },
  s0025: {
    literal: 'That followed the protocol of moving the capital, not the ceremony of founding the realm.',
    idiomatic: 'It matched removal of seat, not founding of state.',
  },
  s0026: {
    literal: 'Once the court returned west to the Upper Capital, inertia left the practice standing.',
    idiomatic: 'After returning west to the principal capital, inertia left it standing.',
  },
  s0027: {
    literal: 'Dezong succeeded and restored fallen rites; the nine shrines of the Eastern Capital ceased to receive sacrificial announcement.',
    idiomatic: 'Under Dezong, fallen observance was repaired and the eastern nine halls ceased to receive sacrificial announcement.',
  },
  s0028: {
    literal: 'According to the Book of Rites, when Zengzi asked, Confucius answered: "Heaven has no two suns, earth no two kings—in seasonal, great, suburban, and soil rites, honor has no second apex."',
    idiomatic: 'The Book of Rites records Confucius telling Zengzi: heaven has no two suns, earth no two kings—in seasonal, great, suburban, and soil rites, honor has no second apex.',
  },
  s0029: {
    literal: 'Thus he showed that two sets of spirit tablets violated ritual.',
    idiomatic: 'Thus two tablet-halls were uncanonical.',
  },
  s0030: {
    literal: 'Your Majesty has received the great succession of a thousand years, raising the bright glory of successive sages, taking the constitution of former kings as model and statute for generations to come.',
    idiomatic: 'Your Majesty holds a thousand-year succession, lifts the bright glory of successive sages, takes former kings as model, and sets law for those who follow.',
  },
  s0031: {
    literal: 'Ancestral-hall rites are of utmost dignity and weight—defying the classics in careless sacrifice the age calls impiety.',
    idiomatic: 'Ancestral rites are weightiest of all—defying the canon in sacrifice the age calls impiety.',
  },
  s0032: {
    literal: 'I beg that you choose the excellent canon of the Three Dynasties, keep Gaozu and Taizong\'s fundamental law, reflect on the Shenlong expedient, follow Jianzhong\'s corrective rite, and restore antiquity by the classics—befitting such sagacity.',
    idiomatic: 'Choose the Three Dynasties\' best canon, keep Gaozu and Taizong\'s law, read Shenlong\'s expedient and Jianzhong\'s correction, restore antiquity by the classics—befitting such sagacity.',
  },
  s0033: {
    literal: 'I submit that the Taiwei Palace tablets of Emperor Guang for three generations and Emperor Ruizong the Sagely Literary Filial Martial, weighed against the classics, ought not be affixed for sacrifice.',
    idiomatic: 'The Taiwei tablets of Emperor Guang (three generations) and Ruizong the Sagely Literary Filial Martial, weighed against the classics, should not be affixed for sacrifice.',
  },
  s0034: {
    literal: 'As for rites of moving and setting tablets, since the Three Dynasties the classics give no explicit text.',
    idiomatic: 'Rites for moving and setting tablets have no explicit classic text since the Three Dynasties.',
  },
  s0035: {
    literal: 'I beg that the Secretariat-Chancellery with dukes, ministers, and ritual officers verify and fix the matter in detail.',
    idiomatic: 'He begged the Secretariat-Chancellery, dukes, and ritual officers to verify and fix the matter.',
  },
  s0036: {
    literal: 'An edict referred it to the responsible offices. The passage concluded.',
    idiomatic: 'The edict assigned it to the proper bureaus. The passage concluded."',
  },
  s0037: {
    literal: 'Supervisor of Sacrifices Wang Yanwei and others submitted a deliberation, saying:',
    idiomatic: 'Ritual director Wang Yanwei and colleagues deliberated:',
  },
  s0038: {
    literal: 'According to founding precedent, there was no rite of building ancestral shrines in both capitals and conducting sacrifice in parallel.',
    idiomatic: 'Founding precedent knew no parallel shrines in both capitals or parallel feast lines.',
  },
  s0039: {
    literal: 'Searching the Documents of Zhou, Announcement to Shao, and Announcement concerning Luo, there are texts of sacrifice and announcement at the Feng and Luo shrines—the Zhou in both seats built lineage temples and, when they arrived, announced sacrifice.',
    idiomatic: 'The Zhou Documents, Announcement to Shao, and Luo Announcement record sacrifice at Feng and Luo—the Zhou built lineage temples in both seats and announced feast when they arrived.',
  },
  s0040: {
    literal: 'Thus both capitals sacrificed to fathers and grandfathers; ritual observance rose in both.',
    idiomatic: 'Both capitals sacrificed to fathers and grandfathers; ritual rose in both.',
  },
  s0041: {
    literal: 'From Shenlong restoration and Zhongzong\'s succession, shrines were built together and feasts ran in parallel.',
    idiomatic: 'From Shenlong restoration and Zhongzong\'s succession, shrines were built together and feasts ran in parallel',
  },
  s0042: {
    literal: 'At the end of Tianbao both capitals fell; spirit tablets were lost.',
    idiomatic: 'At the end of Tianbao both capitals fell.',
  },
  s0043: {
    literal: 'Once Suzong restored former goods, he only built shrines and made tablets in the Upper Capital.',
    idiomatic: 'Suzong restored what was lost but built shrines and tablets only in the Upper Capital.',
  },
  s0044: {
    literal: 'The eastern tablets were recovered among the people only in the Dali era and lodged in Taiwei Palace, never again affixed for sacrifice.',
    idiomatic: 'Eastern tablets surfaced among the people only in Dali, lodged in Taiwei Palace, never again affixed for sacrifice.',
  },
  s0045: {
    literal: 'We examine the classics and commentaries: the king\'s rule—whenever dwellings are built, ancestral shrines come first; a shrine must have tablets, tablets must be in the shrine.',
    idiomatic: 'Classics say: when a king builds dwellings, ancestral shrines come first; a shrine must have tablets, tablets must dwell in the shrine.',
  },
  s0046: {
    literal: 'Thus to raise shrines in both seats follows the ancient way; tablets must dwell in shrine—truly per the ritual canon.',
    idiomatic: 'Shrines in both seats follow the ancient way; tablets in shrine follow the ritual canon.',
  },
  s0047: {
    literal: 'We now compare in detail: reason requires elevating them for enshrinement.',
    idiomatic: 'On full comparison, reason requires elevating them for enshrinement.',
  },
  s0048: {
    literal: 'Emperor Guang was a posthumous ennoblement; Gaozong, Zhongzong, and Ruizong are diao-shrine lords—their tablets should be stored in the Grand Temple\'s first western side chamber.',
    idiomatic: 'Emperor Guang was posthumously ennobled; Gaozong, Zhongzong, and Ruizong are diao-shrine lords—their tablets belong in the Grand Temple\'s first western side chamber.',
  },
  s0049: {
    literal: 'Emperor Jing was the founder enfeoffed, never displaced—his tablet should be stored in the Grand Temple\'s first western main chamber.',
    idiomatic: 'Emperor Jing was the founder enfeoffed, never displaced—his tablet belongs in the first western main chamber.',
  },
  s0050: {
    literal: 'Gaozu, Taizong, Xuanzong, Suzong, and Daizong were close-shrine ancestors who founded the enterprise with merit.',
    idiomatic: 'Gaozu, Taizong, Xuanzong, Suzong, and Daizong were close-shrine ancestors who founded the enterprise with merit',
  },
  s0051: {
    literal: 'Per the Jiangdu Collected Rites: "The principal shrine\'s tablets are stored within the Grand Chamber."',
    idiomatic: 'The Jiangdu Collected Rites: principal shrine tablets are stored in the Grand Chamber.',
  },
  s0052: {
    literal: 'The Book of Rites: "When a ruler\'s shrine tablets have cause, they are gathered and stored in the ancestral shrine."',
    idiomatic: 'The Book of Rites: when a ruler\'s shrine tablets have cause, gather and store them in the ancestral shrine.',
  },
  s0053: {
    literal: 'We note: below Dezong no tablets were made; above Daizong later tablets perished first—if returned to original chambers, some seats would lack tablets.',
    idiomatic: 'Below Dezong no tablets were made; above Daizong later tablets perished—return to original chambers and some seats stand empty.',
  },
  s0054: {
    literal: 'The facts can be cited, yet the principle may not be settled.',
    idiomatic: 'Facts can be cited; principle may not yet be settled.',
  },
  s0055: {
    literal: 'Now tablets from Gaozu downward should all be stored in the shrine of the Great Ancestor, per old precedent without sacrifice.',
    idiomatic: 'Tablets from Gaozu downward should all be stored in the Great Ancestor\'s shrine, per old precedent without sacrifice.',
  },
  s0056: {
    literal: 'If Your Majesty tours the eastern regions and visits Luoyang, except diao lords, tablets should return to original chambers.',
    idiomatic: 'If Your Majesty tours east and visits Luoyang, except diao lords, tablets should return to their chambers.',
  },
  s0057: {
    literal: 'Other missing tablets must be specially made, and affixed sacrifice—seasonal, di, xia—as ritual requires.',
    idiomatic: 'Other missing tablets must be specially made; affixed sacrifice—seasonal, di, xia—as ritual requires.',
  },
  s0058: {
    literal: 'We further note state precedent for posthumous kings: above the Great Ancestor are separate shrines to Deming, Xingsheng, and Yizu.',
    idiomatic: 'State precedent for posthumous kings places separate shrines above the Great Ancestor—to Deming, Xingsheng, and Yizu.',
  },
  s0059: {
    literal: 'The present Emperor Guang\'s tablet is Yizu.',
    idiomatic: 'Emperor Guang\'s tablet is Yizu.',
  },
  s0060: {
    literal: 'Because the eastern capital previously lacked those shrines, Emperor Guang\'s tablet is now provisionally affixed in the Grand Temple side chamber, above Emperor Yuan.',
    idiomatic: 'The eastern capital lacked those shrines; Emperor Guang\'s tablet is provisionally affixed in the Grand Temple side chamber, above Emperor Yuan.',
  },
  s0061: {
    literal: 'If the throne is at the eastern capital, build separate shrines as in the Upper Capital, make tablets for Deming, Xingsheng, and Xianzu, and enshrine with full rite.',
    idiomatic: 'If the throne is at the eastern capital, build separate shrines as in the Upper Capital, make tablets for Deming, Xingsheng, and Xianzu, and enshrine with full rite',
  },
  s0062: {
    literal: 'Also from the Grand Temple side chamber escort Emperor Guang\'s tablet to the fourth chamber of the separate shrine, di and xia as ritual.',
    idiomatic: 'Also escort Emperor Guang\'s tablet from the side chamber to the fourth chamber of the separate shrine, di and xia as ritual.',
  },
  s0063: {
    literal: 'Someone asked: "The rites say make the chestnut tablet and bury the mulberry tablet."',
    idiomatic: 'Someone asked: the rites say make the chestnut tablet and bury the mulberry tablet.',
  },
  s0064: {
    literal: 'Han and Wei both debated burying mulberry; in Dali they buried Filial Emperor Xiaojing\'s tablet—now affix without burying, how so? The passage concluded.',
    idiomatic: 'Han and Wei debated burying mulberry; in Dali they buried Filial Emperor Xiaojing\'s tablet—now affix without burying, how so? The passage concluded."',
  },
  s0065: {
    literal: 'Answer: "Tablets embody the spirit—by principle nothing to bury; Han-Wei burial storage was not truly fitting."',
    idiomatic: 'Answer: tablets embody the spirit—by principle nothing to bury; Han-Wei burial storage was not truly fitting.',
  },
  s0066: {
    literal: '"Filial Xiaojing was not orthodox lineage; his shrine was abandoned while his tablet alone survived—burying it followed abandoned reason." The passage concluded.',
    idiomatic: 'Filial Xiaojing was not orthodox lineage; his shrine was abandoned while his tablet alone survived—burying it followed abandoned reason. The passage concluded."',
  },
  s0067: {
    literal: 'Again asked: "In antiquity on tour one carried the displacement tablet; now eastern tablets are also affixed in the shrine."',
    idiomatic: 'Again asked: in antiquity on tour one carried the displacement tablet; now eastern tablets are also affixed in the shrine.',
  },
  s0068: {
    literal: 'Answer: "In antiquity armies marched with displacement tablets; without them, tablets commanded—except displacement ancestors\' tablets, no canon text for removing tablets from shrine."',
    idiomatic: 'Answer: in antiquity armies marched with displacement tablets; without them, tablets commanded—except displacement ancestors\' tablets, no canon text for removing tablets from shrine.',
  },
  s0069: {
    literal: '"Any settlement with ancestral shrines and former lords\' tablets is called a capital—thus both capitals\' shrines should each have tablets." The passage concluded.',
    idiomatic: 'Any settlement with ancestral shrines and former lords\' tablets is a capital—both capitals\' shrines should each have tablets. The passage concluded."',
  },
  s0070: {
    literal: 'Asked again: "In antiquity making tablets required yu and lian; if tablets must return for enshrinement, chambers cannot stand empty—one must replace lost tablets and create those due for enshrinement."',
    idiomatic: 'Asked again: in antiquity making tablets required yu and lian; if tablets must return for enshrinement, chambers cannot stand empty—replace lost tablets and create those due for enshrinement.',
  },
  s0071: {
    literal: 'The ritual classics say nothing—what then? The passage concluded.',
    idiomatic: 'The ritual classics say nothing—what then? The passage concluded."',
  },
  s0072: {
    literal: 'Answer: "Yu and lian tablet-making is ritual\'s proper way."',
    idiomatic: 'Answer: yu and lian tablet-making is ritual\'s proper way.',
  },
  s0073: {
    literal: 'Off-season tablet-making is expedient for the moment.',
    idiomatic: 'Off-season tablet-making is expedient for the moment',
  },
  s0074: {
    literal: 'A king meets the age with law, shapes affairs to need—if the constant is absent, consider variation.',
    idiomatic: 'A king meets the age with law, shapes affairs to need—if the constant is absent, consider variation',
  },
  s0075: {
    literal: 'If the throne tours east while the shrine still lacks tablets, follow Suzong\'s Guangde 2 precedent of making tablets at the Upper Capital—specially make missing tablets and enshrine.',
    idiomatic: 'If the throne tours east while the shrine still lacks tablets, follow Suzong\'s Guangde 2 precedent—specially make missing tablets and enshrine.',
  },
  s0076: {
    literal: '"For tablets cannot be wanting, ritual esteems fitting expedient—the Spring and Autumn principle is to vary and thereby rectify." The passage concluded.',
    idiomatic: 'Tablets cannot be wanting, so ritual esteems fitting expedient—the Spring and Autumn principle is to vary and thereby rectify. The passage concluded."',
  },
  s0077: {
    literal: 'We reflect: ancestors\' tablets, where spirits dwell, lodged in Taiwei not entering the lineage shrine—restoring root by the classics befits sagacity.',
    idiomatic: 'Ancestors\' tablets, where spirits dwell, lodged in Taiwei not entering the lineage shrine—restoring root by the classics befits sagacity.',
  },
  s0078: {
    literal: 'Thereupon the Secretariat was ordered to convene deliberation; expectant officials\' views largely agreed with Yanwei.',
    idiomatic: 'The Secretariat was ordered to convene; expectant officials largely agreed with Yanwei.',
  },
  s0079: {
    literal: 'Directors and vice-directors each held their view: some said "tablets should be stored in Taiwei Palace";',
    idiomatic: 'Directors and vice-directors each held their view: some said tablets should be stored in Taiwei Palace;',
  },
  s0080: {
    literal: 'some said "bury them together";',
    idiomatic: 'some said bury them together;',
  },
  s0081: {
    literal: 'some said "missing tablets should be made";',
    idiomatic: 'some said missing tablets should be made;',
  },
  s0082: {
    literal: 'some said "when the carriage tours east, carry Upper Capital tablets east."',
    idiomatic: 'some said when the carriage tours east, carry Upper Capital tablets east.',
  },
  s0083: {
    literal: 'All spoke from opinion, not grounded in canonical evidence.',
    idiomatic: 'All spoke from opinion, not grounded in canonical evidence',
  },
  s0084: {
    literal: 'In the end confused debate brought no decision and nothing was carried out.',
    idiomatic: 'Confused debate brought no decision; nothing was carried out.',
  },
  s0085: {
    literal: 'Huichang 5, eighth month: Secretariat-Chancellery reported that the Eastern Capital Grand Temple\'s nine chambers held twenty-six spirit tablets; after An Lushan\'s rebellion the temple became barracks and tablets were cast into streets—the offices secretly gathered them and they now rest in a new small building inside Taiwei Palace.',
    idiomatic: 'Huichang 5, eighth month: the Secretariat reported the Eastern Capital Grand Temple\'s nine chambers held twenty-six tablets; after An Lushan\'s rebellion the temple became barracks and tablets were cast into streets—the offices secretly gathered them; they now rest in a new small building inside Taiwei Palace.',
  },
  s0086: {
    literal: 'The Grand Temple buildings remain and can be restored.',
    idiomatic: 'The temple buildings still stood and could be restored.',
  },
  s0087: {
    literal: 'In the Dahe era ritual directors held the eastern capital should not hold tablets—when the throne toured east, carry tablets along.',
    idiomatic: 'In Dahe, ritual directors held the eastern capital should not hold tablets—when the throne toured east, carry tablets along.',
  },
  s0088: {
    literal: 'To this day inertia has left restoration undone.',
    idiomatic: 'Inertia has left restoration undone to this day.',
  },
  s0089: {
    literal: 'We ask that the Secretariat gather dukes, ritual officers, and academicians for detailed deliberation.',
    idiomatic: 'They asked the Secretariat to gather dukes, ritual officers, and academicians for detailed deliberation.',
  },
  s0090: {
    literal: 'If they are not to be set up anew, there must be a place to store them.',
    idiomatic: 'If tablets were not to be reinstalled, a proper storehouse was needed.',
  },
  s0091: {
    literal: 'If they should be installed, we ask to rebuild using timber from dismantled great temples.',
    idiomatic: 'If they should be installed, rebuild using timber from dismantled great temples.',
  },
  s0092: {
    literal: 'Since a member of the imperial clan holds the post of eastern-resident commissioner, it is requested he be appointed Commissioner for Rebuilding the Eastern Capital Grand Temple to oversee repairs.',
    idiomatic: 'Because a prince held the eastern residency, he should be named commissioner to rebuild the Grand Temple and supervise repairs.',
  },
  s0093: {
    literal: 'Approved as ordered. The passage concluded.',
    idiomatic: 'Approved as ordered. The passage concluded."',
  },
  s0094: {
    literal: 'Sixth year, third month: ritual director Zheng Lu and others reported that twenty tablets in Taiwei Palace at the eastern capital had been analyzed by the Ritual Office and reported on the twenty-ninth day of the second month last year.',
    idiomatic: 'Year 6, third month: ritual director Zheng Lu reported twenty Taiwei Palace tablets; the Ritual Office had analyzed and reported them on the twenty-ninth of the second month last year.',
  },
  s0095: {
    literal: 'We received this month\'s seventh-day edict: "This rite is weightiest; precedent must be followed—ritual and academic officers should deliberate together and report."',
    idiomatic: 'They received this month\'s seventh-day edict: this rite is weightiest; precedent must be followed—ritual and academic officers should deliberate together and report.',
  },
  s0096: {
    literal: 'We have deliberated with academicians and submit analysis: the twelve tablets before—Xianzu Emperor Xuan, Empress Xuanzhuang, Yizu Emperor Guang, Empress Guangyi, Empress Wende, Emperor Gaozong the Heavenly Sovereign Great, Empress Wu Zetian, Emperor Zhongzong the Great Sage Great Filial, Empress Hespi, Empress Zhaocheng, Emperor Xiaojing, Empress Di\'ai—whose kin is exhausted and rotation destroyed, should move to line shrines and affix at Xingsheng Shrine.',
    idiomatic: 'Deliberating with academicians, they submitted analysis: twelve tablets—Xianzu Emperor Xuan, Empress Xuanzhuang, Yizu Emperor Guang, Empress Guangyi, Empress Wende, Gaozong the Heavenly Sovereign Great, Empress Wu Zetian, Zhongzong the Great Sage Great Filial, Empress Hespi, Empress Zhaocheng, Emperor Xiaojing, Empress Di\'ai—whose kin is exhausted, should move to line shrines and affix at Xingsheng Shrine.',
  },
  s0097: {
    literal: 'In years of di-xia, they receive one sacrifice.',
    idiomatic: 'In di-xia years they receive one sacrifice.',
  },
  s0098: {
    literal: 'The eastern capital has no Xingsheng Shrine for enshrinement—we beg provisional storage in the Grand Temple side chamber.',
    idiomatic: 'The eastern capital has no Xingsheng Shrine—we beg provisional storage in the Grand Temple side chamber.',
  },
  s0099: {
    literal: 'Fourteen tablets bear no inscription; without inscription text, invocation and announcement cannot proceed.',
    idiomatic: 'Fourteen tablets bear no inscription; without inscription, invocation and announcement cannot proceed.',
  },
  s0100: {
    literal: 'Deliberating with ritual officers, we beg that on the day of removal announcement they be buried only in vacant ground within the old Taiwei Palace. The passage concluded.',
    idiomatic: 'Deliberating with ritual officers, they begged that on removal day the tablets be buried in vacant ground within the old Taiwei Palace. The passage concluded."',
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
if (data.metadata.chapter !== '030') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 030; standalone T ready (${Object.keys(T).length} entries).`
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
