#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
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
    literal: 'Again obeying last year\'s edict, all follow the Rites of Zhou in conduct.',
    idiomatic: 'Last year\'s edict: follow the Rites of Zhou.',
  },
  s0302: {
    literal: 'Now music must fix which spirits are sacrificed—unclear whether per ancient rites and the Zhenguan Rites, or per presently practiced rites?',
    idiomatic: 'Which spirits the music serves—ancient and Zhenguan, or current practice?',
  },
  s0303: {
    literal: '」At the time Gaozong and chief ministers alike could not decide; they wavered long without resolution.',
    idiomatic: 'Gaozong and ministers could not decide; the matter dragged on.',
  },
  s0304: {
    literal: 'Soon again an edict ordered the Department of State Affairs and scholars to debate in detail—still unsettled.',
    idiomatic: 'State Affairs and scholars debated—still unsettled.',
  },
  s0305: {
    literal: 'From then Bright Hall great offerings used both the Zhenguan and Xianqing Rites.',
    idiomatic: 'Bright Hall thereafter combined Zhenguan and Xianqing rites.',
  },
  s0306: {
    literal: 'When Empress Zetian held court, in the seventh month of the first year of Chuigong, the relevant offices debated solemn matching at Round Mound, Square Mound, Southern Suburban Altar, and Bright Hall.',
    idiomatic: 'Chuigong 1.7: offices debated solemn matching for Round Mound, Square Mound, suburbs, and Bright Hall.',
  },
  s0307: {
    literal: 'Imperial University Assistant Instructor Kong Xuanyi memorialized in debate:',
    idiomatic: 'Kong Xuanyi, Imperial University assistant, memorialized:',
  },
  s0308: {
    literal: 'Respectfully per the Classic of Filial Piety: "Of filial piety nothing is greater than honoring the father; of honoring the father nothing is greater than matching Heaven."',
    idiomatic: 'Filial Piety: "Nothing greater than honoring the father; of that, nothing greater than matching Heaven."',
  },
  s0309: {
    literal: '」The honored match most great is the Sovereign of Heaven.',
    idiomatic: 'The greatest honored match is the Sovereign of Heaven.',
  },
  s0310: {
    literal: 'Of things the greatest is none like Heaven; comparing the father to Heaven and matching with it—the greatest filial conduct passes not this, to make clear the utmost of honored matching.',
    idiomatic: 'Heaven is greatest; matching the father to Heaven is filial piety\'s summit.',
  },
  s0311: {
    literal: 'The Changes also says: "The former kings made music to exalt virtue; in the Yin season they presented to the Sovereign, with ancestor and father as consorts."',
    idiomatic: 'Changes: "Former kings made music; Yin season presented to the Sovereign with ancestors as consorts."',
  },
  s0312: {
    literal: '」Zheng Xuan annotates: "Sovereign means Heavenly Sovereign."',
    idiomatic: 'Zheng Xuan: "Sovereign means Heavenly Sovereign."',
  },
  s0313: {
    literal: '」Thus one knows sacrifice to the Sovereign of Heaven should jointly match ancestor and father.',
    idiomatic: 'Sovereign of Heaven sacrifice should match ancestors and father.',
  },
  s0314: {
    literal: 'We ask to match Taizong the Civil and Martial Sagely Emperor and Gaozong the Heavenly Sovereign Great Emperor with the Sovereign of Heaven at the Round Mound—accordant with the Classic of Filial Piety and the Changes.',
    idiomatic: 'Match Taizong and Gaozong to the Sovereign of Heaven at Round Mound—per Filial Piety and Changes.',
  },
  s0315: {
    literal: 'Spirit Yao Emperor first laid the royal foundation and responded to Heaven and followed the people—please match him to the Feelings Emperor at the Southern Suburban Altar, accordant with the Great Tradition.',
    idiomatic: 'Spirit Yao founded the house—match him to Feelings Emperor at Southern Suburban Altar per Great Tradition.',
  },
  s0316: {
    literal: 'Again the "Sacrifices" chapter says: "Take King Wen as zu and King Wu as zong."',
    idiomatic: 'Sacrifices: "King Wen as zu, King Wu as zong."',
  },
  s0317: {
    literal: 'Zu means "beginning";',
    idiomatic: 'Zu denotes the founding ancestor.',
  },
  s0318: {
    literal: 'zong means honoring.',
    idiomatic: 'Zong means honoring.',
  },
  s0319: {
    literal: 'Hence sacrifice is named for honoring the beginning—to make clear that within one sacrifice these two meanings exist.',
    idiomatic: 'Sacrifice names honoring the beginning—two meanings in one rite.',
  },
  s0320: {
    literal: 'Again the Classic of Filial Piety says: "Perform zong sacrifice to King Wen in the Bright Hall."',
    idiomatic: 'Filial Piety: "Perform zong sacrifice to King Wen in the Bright Hall."',
  },
  s0321: {
    literal: '」King Wen is called zu yet the text says zong—this also extends King Wu\'s meaning.',
    idiomatic: 'Wen is zu yet called zong—extending Wu\'s meaning.',
  },
  s0322: {
    literal: 'Therefore Bright Hall sacrifice matches with zu and kao.',
    idiomatic: 'Bright Hall matches zu and kao.',
  },
  s0323: {
    literal: 'We ask to match Taizong the Civil and Martial Sagely Emperor and Gaozong the Heavenly Sovereign Great Emperor in Bright Hall sacrifice—accordant with the Changes and "Sacrifices."',
    idiomatic: 'Match Taizong and Gaozong at Bright Hall—per Changes and Sacrifices.',
  },
  s0324: {
    literal: 'Right Tutor of the Heir Apparent Shen Boyi said:',
    idiomatic: 'Heir Apparent Right Tutor Shen Boyi said:',
  },
  s0325: {
    literal: 'Respectfully per the Rites: "Yu performed di to the Yellow Emperor and jiao to Kui; zu to Zhuanxu and zong to Yao."',
    idiomatic: 'Rites: "Yu di to Yellow Emperor, jiao to Kui; zu Zhuanxu, zong Yao."',
  },
  s0326: {
    literal: 'Xia performed di to the Yellow Emperor and jiao to Gun; zu to Zhuanxu and zong to Yu.',
    idiomatic: 'Xia: di Yellow Emperor, jiao Gun; zu Zhuanxu, zong Yu.',
  },
  s0327: {
    literal: 'Yin di to Kui and jiao to Ming; zu to Qi and zong to Tang.',
    idiomatic: 'Yin: di Kui, jiao Ming; zu Qi, zong Tang.',
  },
  s0328: {
    literal: 'Zhou di to Kui and jiao to Ji; zu to King Wen and zong to King Wu."',
    idiomatic: 'Zhou: di Kui, jiao Ji; zu King Wen, zong King Wu."',
  },
  s0329: {
    literal: '」Zheng Xuan annotates: "Di, jiao, zu, and zong mean sacrifice with consort food."',
    idiomatic: 'Zheng Xuan: "Di, jiao, zu, zong are sacrifice with consort food."',
  },
  s0330: {
    literal: 'Di means sacrificing to the Sovereign of Heaven at the Round Mound; jiao means sacrificing to the Sovereign at the Southern Suburban Altar; zu and zong mean sacrificing to the Five Emperors and Five Spirits in the Bright Hall."',
    idiomatic: 'Di at Round Mound; jiao at Southern Suburban Altar; zu and zong to Five Emperors and Five Spirits in Bright Hall."',
  },
  s0331: {
    literal: '」Searching the text of solemn matching, here it is most complete.',
    idiomatic: 'Solemn matching is most fully stated here.',
  },
  s0332: {
    literal: 'Yu and Xia set back Zhuanxu and jiao to Kui; Yin set aside Qi and jiao to Ming.',
    idiomatic: 'Yu and Xia demoted Zhuanxu for Kui; Yin set aside Qi for Ming.',
  },
  s0333: {
    literal: 'The taking and leaving are many.',
    idiomatic: 'Too many shifts in precedence.',
  },
  s0334: {
    literal: 'Before and after violate order.',
    idiomatic: 'Sequence is broken.',
  },
  s0335: {
    literal: 'The sequence of rites—none surpasses Zhou.',
    idiomatic: 'Zhou\'s ritual order is supreme.',
  },
  s0336: {
    literal: 'Di to Kui, jiao to Ji, without gap between the two kings;',
    idiomatic: 'Di Kui, jiao Ji—unbroken from the two prior dynasties;',
  },
  s0337: {
    literal: 'Bright Hall zong sacrifice first combined two consorts.',
    idiomatic: 'Bright Hall zong first paired two consorts.',
  },
  s0338: {
    literal: 'All took King Wen and King Wu, father and son distinct: Wen as father presided over the Five Emperors;',
    idiomatic: 'Wen as father presided over Five Emperors; Wu as son—',
  },
  s0339: {
    literal: 'Wu facing the father, below matched the Five Spirits.',
    idiomatic: 'Wu below matched Five Spirits.',
  },
  s0340: {
    literal: 'The Classic of Filial Piety says: "Honoring the father, nothing greater than matching Heaven—the Duke of Zhou was such a man."',
    idiomatic: 'Filial Piety: "Honoring the father, matching Heaven—the Duke of Zhou."',
  },
  s0341: {
    literal: 'In former days the Duke of Zhou performed zong sacrifice to King Wen in the Bright Hall to match the Sovereign."',
    idiomatic: 'The Duke of Zhou zong-sacrificed to King Wen in Bright Hall to match the Sovereign."',
  },
  s0342: {
    literal: 'It does not say honoring King Wu to match Heaven—thus though Wu was in the Bright Hall, in principle he did not equal consort sacrifice;',
    idiomatic: 'It never honors Wu to match Heaven—Wu in Bright Hall was not Heaven\'s equal consort;',
  },
  s0343: {
    literal: 'having called it zong sacrifice, the meaning rests solely in honoring.',
    idiomatic: 'Zong sacrifice means honoring alone.',
  },
  s0344: {
    literal: 'Though two sacrifices are the same, in the end there is one lord.',
    idiomatic: 'Two rites, one lord.',
  },
  s0345: {
    literal: 'Thus the Filial Piety Apocrypha says "Hou Ji is lord of Heaven and Earth; King Wen is zong of the Five Emperors."',
    idiomatic: 'Filial Piety Apocrypha: "Hou Ji lord of Heaven and Earth; King Wen zong of Five Emperors."',
  },
  s0346: {
    literal: 'If one spirit, two sacrifices were convenient, then five sacrifices and ten shrines—offerings frequent—the rites would fail in number.',
    idiomatic: 'One spirit, two altars would multiply offerings beyond measure.',
  },
  s0347: {
    literal: 'This is the Way that spirits admit no second lord; ritual honors the meaning of one consort.',
    idiomatic: 'Spirits have one lord; ritual honors single consort.',
  },
  s0348: {
    literal: 'Privately searching Zhenguan and Yonghui, both honored a single consort;',
    idiomatic: 'Zhenguan and Yonghui honored one consort each;',
  },
  s0349: {
    literal: 'after Xianqing they first created joint honoring.',
    idiomatic: 'after Xianqing came joint honoring.',
  },
  s0350: {
    literal: 'If one must follow antiquity in conduct, truly to follow Zhou is beautiful.',
    idiomatic: 'Following antiquity means following Zhou.',
  },
  s0351: {
    literal: 'Spirit Yao Emperor please match Round Mound and Square Mire; Taizong the Civil and Martial Sagely Emperor please match Southern and Northern Suburban Altars.',
    idiomatic: 'Spirit Yao: Round Mound and Square Mire; Taizong: southern and northern suburbs.',
  },
  s0352: {
    literal: 'Gaozong the Heavenly Sovereign Great Emperor\'s virtue surpassed the nine sovereigns, his achievement opened ten thousand realms, regulated rites and made music, reported feng and ascended zhong—all the realm shared repose, the whole sky shared blessing; privately we deem the greatest filial piety should collectively match the Five Heavens.',
    idiomatic: 'Gaozong surpassed the nine sovereigns—greatest filial piety should match all Five Heavens.',
  },
  s0353: {
    literal: 'Phoenix Pavilion Attendant Yuan Wanqing, Fan Lübing, and others debated:',
    idiomatic: 'Yuan Wanqing, Fan Lübing, Phoenix Pavilion attendants, debated:',
  },
  s0354: {
    literal: 'We respectfully consider Spirit Yao Emperor carved Heaven and structured the image, opened soil and laid foundation.',
    idiomatic: 'Spirit Yao carved Heaven and founded the realm.',
  },
  s0355: {
    literal: 'Taizong the Civil and Martial Sagely Emperor continued the succession and spread the origin, followed the pivot to the utmost.',
    idiomatic: 'Taizong continued the succession to the utmost pivot.',
  },
  s0356: {
    literal: 'Gaozong the Heavenly Sovereign Great Emperor enlarged the ancestors\' grand enterprise and broadened civil and martial magnificence.',
    idiomatic: 'Gaozong enlarged ancestral enterprise and civil-martial magnificence.',
  },
  s0357: {
    literal: 'Three sagely glories, a thousand years joining dawn.',
    idiomatic: 'Three sagely glories—millennium joining dawn.',
  },
  s0358: {
    literal: 'Divine achievement and sagely virtue exhaust registers yet are hard to name;',
    idiomatic: 'Sagely virtue exhausts registers—unnamable;',
  },
  s0359: {
    literal: 'grand triumphs and vast plans surpass past and present and cannot be compared.',
    idiomatic: 'triumphs surpass past and present.',
  },
  s0360: {
    literal: 'How merely to weigh against Yao and Shun by scruple or treat Yin and Zhou as chaff!',
    idiomatic: 'More than scruples against Yao and Shun—Yin and Zhou are chaff.',
  },
  s0361: {
    literal: 'Respectfully examining present rites, for the five shrines including the Sovereign of Heaven, all jointly match Spirit Yao and Taizong the Civil and Martial Emperor.',
    idiomatic: 'Present rites: five Sovereign of Heaven shrines jointly match Spirit Yao and Taizong.',
  },
  s0362: {
    literal: 'Now debaters cite the "Sacrifices," Changes, and Classic of Filial Piety—though near antiquarian words, they greatly miss the intent born of the heart.',
    idiomatic: 'Citing Sacrifices, Changes, and Filial Piety misses heartfelt intent.',
  },
  s0363: {
    literal: 'Yet the son\'s service to the father, the minister\'s service to the lord—filial piety completes the will, loyalty and compliance beautify.',
    idiomatic: 'Son serves father, minister serves lord—filial piety and loyalty align.',
  },
  s0364: {
    literal: 'Privately, joint-matching rite specially inherits the former sages\' intent, takes instruction from prior statutes, and declares feeling in great filial piety.',
    idiomatic: 'Joint matching inherits the sages and declares great filial feeling.',
  },
  s0365: {
    literal: 'The Odes says: "The Sovereign of Heaven has a completed mandate; the two sovereigns received it."',
    idiomatic: 'Odes: "Sovereign of Heaven\'s completed mandate—the two sovereigns received it."',
  },
  s0366: {
    literal: 'The Changes says: "In the Yin season present to the Sovereign, with ancestor and father as consorts."',
    idiomatic: 'Changes: "Yin season—present to Sovereign with ancestors as consorts."',
  },
  s0367: {
    literal: 'Reverently searching the purport, it originally fits this meaning.',
    idiomatic: 'The purport originally fits.',
  },
  s0368: {
    literal: 'If now one plucks distant texts and near violates established canon, clinging to the constant without change, guarding stagnation without passage—then the minister is demoted before the lord, hastily shifting suburban and mound positions; the inferior wrongs the superior, not following the heart of bow and sword.',
    idiomatic: 'Clinging to old texts demotes ministers over lords and wrongs the superior.',
  },
  s0369: {
    literal: 'How can this declare the empress dowager\'s grief and feeling, or follow the emperor\'s filial thought!',
    idiomatic: 'How does this serve the empress dowager\'s grief or the emperor\'s filial piety?',
  },
  s0370: {
    literal: 'Careful ending and pursuing the remote—truly not fitting.',
    idiomatic: 'Careful ending and distant pursuit—unfitting.',
  },
  s0371: {
    literal: 'Honoring the father to match Heaven—can it be thus?',
    idiomatic: 'Honoring the father to match Heaven—can it be so?',
  },
  s0372: {
    literal: 'We submit per present rites: Spirit Yao and Taizong the Civil and Martial Sagely Emperor already first match the five shrines—the principle is they should remain unchanged.',
    idiomatic: 'Spirit Yao and Taizong already match five shrines—unchanged.',
  },
  s0373: {
    literal: 'Gaozong the Heavenly Sovereign Great Emperor equals in honor the Bright Soul, equals in depth the Hidden Pivot—he unfolded the third generation\'s vast foundation and opened ten thousand generations\' grand enterprise.',
    idiomatic: 'Gaozong equals Bright Soul and Hidden Pivot—third-generation foundation, ten-thousand-generation enterprise.',
  },
  s0374: {
    literal: 'Layered statutes and repeated measures—in achievement and merit without difference;',
    idiomatic: 'Statutes layered without difference in merit;',
  },
  s0375: {
    literal: 'enjoying the Sovereign and suburban Heaven—how could sacrificial matching differ?',
    idiomatic: 'Enjoying the Sovereign at suburban Heaven—matching must not differ.',
  },
  s0376: {
    literal: 'We ask to have Gaozong the Heavenly Sovereign Great Emperor match across the five shrines in succession.',
    idiomatic: 'We ask Gaozong to match all five shrines in succession.',
  },
  s0377: {
    literal: 'The rescript followed Wanqing\'s debate.',
    idiomatic: 'The throne followed Wanqing.',
  },
  s0378: {
    literal: 'From then suburban and mound shrines all used three ancestors as consorts.',
    idiomatic: 'Thereafter suburbs and mounds used three ancestors.',
  },
  s0379: {
    literal: 'When Empress Zetian changed the dynasty, in the first year of Tiance, she added the title Golden Wheel Great Sagely Emperor, personally enjoyed the Southern Suburban Altar, and jointly sacrificed Heaven and Earth.',
    idiomatic: 'Tiance 1: Zetian took title Golden Wheel Great Sagely Emperor and jointly sacrificed Heaven and Earth at the southern suburb.',
  },
  s0380: {
    literal: 'The Wu clan\'s founding ancestor King Wen of Zhou was posthumously honored Founding Ancestor Wen Emperor; her late father the Lord of Ying was posthumously honored Supreme Filial Bright High Emperor—they too used two ancestors jointly as consorts, as in the Qianfeng rite.',
    idiomatic: 'King Wen and her father Ying Lord were posthumously honored and jointly matched, as at Qianfeng.',
  },
  s0381: {
    literal: 'Later in the Chang\'an era she again personally enjoyed the Southern Suburban Altar, jointly sacrificing Heaven and Earth and all suburban mounds, all with consorts.',
    idiomatic: 'In Chang\'an she again sacrificed at the southern suburb with all suburbs matched.',
  },
  s0382: {
    literal: 'When Zhongzong ascended, in the ninth month of the first year of Shenlong he personally sacrificed to the Sovereign of Heaven at the Bright Hall in the eastern capital, with Gaozong the Heavenly Sovereign Great as honored consort—the rites also followed Qianfeng precedent.',
    idiomatic: 'Shenlong 1.9: Zhongzong sacrificed to the Sovereign of Heaven at eastern-capital Bright Hall with Gaozong as consort—Qianfeng precedent.',
  },
  s0383: {
    literal: 'By the eleventh month of the third year of Jinglong he personally sacrificed at the Southern Suburban Altar; when first fixing the ritual protocol, Director of the Imperial University Zhu Qinming, to please the intent, said the empress should also jointly assist in sacrifice, and memorialized in debate: "Respectfully per the Rites of Zhou: Heavenly spirits are called si; earthly spirits are called ji; ancestral temple is called xiang."',
    idiomatic: 'Jinglong 3.11: fixing southern-suburb rites, Zhu Qinming said the empress should assist: "Rites of Zhou: spirits si, earth ji, temple xiang."',
  },
  s0384: {
    literal: 'Again the Inner Palace Attire: "In charge of the queen\'s six garments—for all sacrifices supply the consort\'s robes."',
    idiomatic: 'Inner Palace Attire: "Supply the queen\'s robes for all sacrifices."',
  },
  s0385: {
    literal: 'Again the "Sacrificial Unity" says: "Sacrifice requires husband and wife in person."',
    idiomatic: 'Sacrificial Unity: "Sacrifice requires husband and wife in person."',
  },
  s0386: {
    literal: 'Per these texts, the queen\'s joint assistance in the emperor\'s sacrifice to heavenly spirits and earthly spirits is clear.',
    idiomatic: 'These texts show the queen should assist in heaven and earth sacrifice.',
  },
  s0387: {
    literal: 'We ask separately to compile joint-assistance ritual protocol and submit together.',
    idiomatic: 'We ask a separate joint-assistance protocol.',
  },
  s0388: {
    literal: '」The emperor ordered chief ministers and ritual officers to debate the matter in detail.',
    idiomatic: 'The emperor ordered ministers and ritual officers to debate.',
  },
  s0389: {
    literal: 'Director of Rituals erudites Tang Shao and Jiang Qinxu proposed: "The queen\'s southern-suburb joint assistance is unfitting in ritual."',
    idiomatic: 'Tang Shao and Jiang Qinxu: queen\'s southern-suburb assistance is uncanonical.',
  },
  s0390: {
    literal: 'Yet what Qinming held is ancestral-temple ritual, not heaven-and-earth ritual.',
    idiomatic: 'Qinming cited temple rite, not heaven-and-earth rite.',
  },
  s0391: {
    literal: 'Examining Han, Wei, Jin, and Later Wei, Qi, Liang, Sui and other dynasties\' histories—founding kings and enlightened lords, suburban Heaven and sacrificing earth each generation had its rite, histories do not omit record—yet nowhere is queen joint assistance seen.',
    idiomatic: 'Histories from Han through Sui record suburban rites—never queen joint assistance.',
  },
  s0392: {
    literal: 'Again Spirit Yao, Taizong, and Gaozong at the Southern Suburban Altar sacrificed to Heaven—none had queen joint assistance.',
    idiomatic: 'Spirit Yao, Taizong, and Gaozong at southern suburb—no queen assistance.',
  },
  s0393: {
    literal: '」Minister of the Right Wei Juyuan also agreed with Qinming\'s debate; the emperor then made the empress secondary presenter, still supplementing ministers Li Qiao and others\' daughters as fast maidens to hold biǎn and dòu.',
    idiomatic: 'Wei Juyuan agreed; the emperor made the empress secondary presenter and appointed fast maidens for biǎn and dòu.',
  },
  s0394: {
    literal: 'At the time, the thirteenth day of the eleventh month was yichou—the winter solstice; yin-yang specialists Lu Ya, Hou Yi, and others memorialized asking to advance the winter solstice to the twelfth day jiazi as auspicious assembly.',
    idiomatic: 'Eleventh month 13, yichou—winter solstice; Lu Ya and Hou Yi asked to advance it to jiazi on the 12th.',
  },
  s0395: {
    literal: 'Right Censorate Attending Censor Tang Shao memorialized: "Ritual sacrifices at winter solstice to the Round Mound at the Southern Suburban Altar and at summer solstice to the Square Mire at the Northern Suburban Altar because the sun\'s course reaches the utmost of south and north."',
    idiomatic: 'Tang Shao: winter solstice Round Mound at southern suburb, summer solstice Square Mire at northern suburb—the sun at its south-north limits.',
  },
  s0396: {
    literal: 'When the sun is at the north pole the gnomon shadow follows half; when at the south pole the gnomon shadow circles the full circumference.',
    idiomatic: 'At north pole the shadow is half; at south pole it circles full.',
  },
  s0397: {
    literal: 'On that day the first yang line is born—the beginning of Heaven and Earth\'s interchange.',
    idiomatic: 'That day the first yang line is born—Heaven and Earth begin to interchange.',
  },
  s0398: {
    literal: 'Thus the Changes says: "Fù—does it not show the heart of Heaven and Earth!"',
    idiomatic: 'Changes: "Fù—does it not show Heaven and Earth\'s heart!"',
  },
  s0399: {
    literal: '」That is the winter-solstice hexagram image.',
    idiomatic: 'That is winter solstice\'s hexagram image.',
  },
  s0400: {
    literal: 'Within one year, nothing is more auspicious.',
    idiomatic: 'Within the year, nothing is more auspicious.',
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
