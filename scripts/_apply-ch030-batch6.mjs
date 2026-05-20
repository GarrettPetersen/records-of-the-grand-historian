#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'The state traces its origin to the Immortal Ancestor and inherits the sage forebear; repeated glory and accumulated splendor have already been granted boundless blessing; combined offerings ascend to the spirits—we think to expand the unchanging canon.',
    idiomatic: 'The dynasty descends from the Immortal Ancestor and inherits sage forebears; we seek to uphold the unchanging canon of ascent and offering.',
  },
  s0502: {
    literal: 'From now on, at every di and xia, set ranks in order before the Sage Ancestor at the Temple of Supreme Clarity, above to clarify the rite of ascent and matching, reverently conforming to the dark heavens, below to fulfill the sincerity of reverent sacrifice, not departing from the ultimate Way.',
    idiomatic: 'Henceforth at each di and xia arrange ranks before the Sage Ancestor at Supreme Clarity, clarifying ascent and matching above and full sincerity below.',
  },
  s0503: {
    literal: 'Recently, whenever di and xia occurred, seasonal offerings were suspended; though the affair suited expedience, the rite perhaps fell short of what must be complete.',
    idiomatic: 'Lately seasonal offerings stopped during di and xia—expedient but incomplete.',
  },
  s0504: {
    literal: 'Hereafter whenever di and xia occur, regular offerings shall use plain food; three burnings of incense replace the three presentations."',
    idiomatic: 'Hereafter during di and xia, regular offerings use plain food and three incense burnings replace three presentations."',
  },
  s0505: {
    literal: 'On the fourth day of the ninth month of the second Jianzhong year, Erudite of the Court of Imperial Sacrifices Chen Jing memorialized: "This tenth month, xia at the Grand Temple should jointly feast the relocated temple spirit tablets of the Ancestors of Offerings and Eminence.',
    idiomatic: 'Jianzhong 2, month 9, day 4: Erudite Chen Jing urged that the tenth-month Grand Temple xia include the Offerings and Eminence ancestors\' relocated tablets.',
  },
  s0506: {
    literal: 'The meaning of the Spring and Autumn Annals: tablets of destroyed temples are displayed before the Grand Ancestor; tablets of temples not yet destroyed all ascend for combined feasting at the Grand Ancestor.',
    idiomatic: 'Spring and Autumn: destroyed temples\' tablets are set before the Grand Ancestor; others ascend for combined feasting.',
  },
  s0507: {
    literal: 'The Grand Ancestor\'s position faces east from the west; descendants below are arranged zhao and mu opposite, south and north as distinction—originally there is no text of destroyed temples\' relocated tablets not receiving offerings.',
    idiomatic: 'The Grand Ancestor faces east; descendants are arranged in zhao-mu rows—no rule excludes relocated tablets of destroyed shrines.',
  },
  s0508: {
    literal: 'Examining this rite, from the Zhou house onward, yet our dynasty\'s sacrificial canon ought to differ from Zhou.',
    idiomatic: 'Zhou did thus, but Tang ritual should differ.',
  },
  s0509: {
    literal: 'Moreover Zhou took Hou Ji to match Heaven as the ancestor of the first enfeoffment, and only below him established temples.',
    idiomatic: 'Zhou matched Hou Ji to Heaven as first enfeoffment ancestor, then built lower temples.',
  },
  s0510: {
    literal: 'When temples were destroyed and tablets moved, all were after the Grand Ancestor.',
    idiomatic: 'Destroyed shrines and moved tablets all stood after the Grand Ancestor.',
  },
  s0511: {
    literal: 'At di and xia, none preceded the Grand Ancestor in the Grand Temple.',
    idiomatic: 'At di and xia nothing preceded the Grand Temple Grand Ancestor.',
  },
  s0512: {
    literal: 'Correcting the Grand Ancestor\'s east-facing position preserves his honor without doubt.',
    idiomatic: 'The Grand Ancestor\'s east-facing seat preserves unquestioned honor.',
  },
  s0513: {
    literal: 'Yet this tenth month\'s Grand Temple xia feast—your subject asks to take Wei and Jin old institutions as comparison and build separate temples.',
    idiomatic: 'For this tenth-month xia, Chen asks to follow Wei-Jin precedent and build separate temples.',
  },
  s0514: {
    literal: 'Eastern Jin took the four lords such as the Western Campaign General as separate temples; at di and xia they corrected the Grand Ancestor\'s position in the Grand Temple to assert his honor, while the separate temples sacrificed to the High Emperor, Grand Emperor, Western Campaign General, and the other four lords to express kinship.',
    idiomatic: 'Eastern Jin gave four forebears separate temples; at di and xia the Grand Ancestor kept honor in the Grand Temple while separate temples served the remote forebears.',
  },
  s0515: {
    literal: 'Your subject holds that if the state uses this principle, separate temples should be built for the Ancestors of Offerings and Eminence and they should receive di and xia;',
    idiomatic: 'Tang should build separate temples for Offerings and Eminence and sacrifice to them at di and xia;',
  },
  s0516: {
    literal: 'then the Grand Ancestor in the Grand Temple would occupy the east-facing position to preserve his full honor.',
    idiomatic: 'so the Grand Ancestor can face east in the Grand Temple.',
  },
  s0517: {
    literal: 'Your subject notes the two emperors Deming and Xingsheng formerly had temples; at di and xia regular feast rites were commonly used—now the separate-temple system should have enshrinement in the Xingsheng temple as fitting."',
    idiomatic: 'Deming and Xingsheng once had their own temples; separate shrines should enshrine the tablets in the Xingsheng temple."',
  },
  s0518: {
    literal: '" An edict sent the matter down to the Department of State Affairs for assembly deliberation by the hundred officials.',
    idiomatic: '" The edict ordered the Department of State Affairs to convene deliberation.',
  },
  s0519: {
    literal: 'Commissioner of Ritual Protocol, Junior Tutor to the Heir Apparent Yan Zhenqing, deliberated: "Some deliberators say the Ancestors of Offerings and Eminence, kin distant and temples moved, should not receive xia and ought permanently to be shut in the western side chambers.',
    idiomatic: 'Yan Zhenqing argued: some said Offerings and Eminence, being remote, should not join xia and should stay shut in the western side chambers;',
  },
  s0520: {
    literal: 'Others say the two ancestors should share xia, ranking zhao and mu with the Grand Ancestor while leaving the Grand Ancestor\'s east-facing position empty.',
    idiomatic: 'others that both should share xia with the Grand Ancestor in zhao-mu order while leaving his east seat empty;',
  },
  s0521: {
    literal: 'Others say if the two ancestors share xia, the Grand Ancestor\'s position can never be corrected; the two ancestors\' tablets should be moved and enshrined in the temple of Emperor Deming."',
    idiomatic: 'others that if they share xia the Grand Ancestor can never face east and both tablets should move to the Deming temple."',
  },
  s0522: {
    literal: 'Your subject holds all three deliberations are not acceptable.',
    idiomatic: 'Yan held all three views unacceptable.',
  },
  s0523: {
    literal: 'The ritual classics are damaged and lack clear authority; if scholars can compare categories and weigh among them, then it may be enacted—this broadly accords with rectitude.',
    idiomatic: 'The classics are incomplete; where scholars analogize and weigh categories, practice may proceed in accord with right principle.',
  },
  s0524: {
    literal: 'Your subject notes Grand Ancestor Emperor Jing, by merit of receiving the mandate at first enfeoffment, occupies the temple of a hundred generations without removal, matching Heaven in lofty offering—this is ultimate honor.',
    idiomatic: 'Grand Ancestor Emperor Jing, first enfeoffment and mandate, occupies the immovable shrine and matches Heaven—ultimate honor.',
  },
  s0525: {
    literal: 'At di and xia he temporarily takes the zhao-mu position, lowering himself to express filial piety and reverently serving the ancestors—by the rite of kin order, broadening the way of honoring forebears; this is truly the Grand Ancestor\'s bright intent of teeming blessing, and also how to transform the realm and lead all to filial piety.',
    idiomatic: 'At di and xia he temporarily takes a zhao-mu place, humbling himself to honor ancestors—his teeming intent and the empire\'s model of filial piety.',
  },
  s0526: {
    literal: 'We ask to follow Jin Cai Mo and others\' deliberation: on the day of the tenth-month xia offering, place the Ancestor of Offerings\' tablet in the east-facing position; from the Ancestor of Eminence and Grand Ancestor through all ancestors, follow the left-zhao right-mu array.',
    idiomatic: 'Follow Jin Cai Mo: at the October xia, Offerings faces east; Eminence, Grand Ancestor, and the rest follow left-zhao right-mu.',
  },
  s0527: {
    literal: 'This manifests the state\'s bright principle of honoring the root and esteeming order—sufficient as an unchanging statute for ten thousand generations.',
    idiomatic: 'This shows Tang\'s regard for root and order—a statute for all generations.',
  },
  s0528: {
    literal: 'Again, deliberators ask to place the two ancestors\' tablets in the temple of Emperor Deming and perform xia sacrifice.',
    idiomatic: 'Others proposed moving both tablets to the Deming temple for xia.',
  },
  s0529: {
    literal: 'Xia means "combined."',
    idiomatic: 'Xia means combined offering.',
  },
  s0530: {
    literal: 'Therefore the Gongyang Commentary says: "What is the great affair?',
    idiomatic: 'Gongyang asks: "What is the great affair?',
  },
  s0531: {
    literal: 'It is xia."',
    idiomatic: 'Xia."',
  },
  s0532: {
    literal: 'If xia sacrifice is not displayed in the Grand Temple but offered in the Deming temple, this is divided feasting—how can it be called combined feasting?',
    idiomatic: 'Xia not in the Grand Temple but in the Deming temple is divided feasting, not combined feasting.',
  },
  s0533: {
    literal: 'Name and substance cross; it deeply loses ritual intent and absolutely cannot be enacted."',
    idiomatic: 'Name and fact diverge—it violates ritual and must be rejected."',
  },
  s0534: {
    literal: 'On the twenty-eighth day of the eleventh month of the seventh Zhenyuan year, Director Pei Yu memorialized: "The rites of di and xia—in Yin and Zhou, because moved temples all came after the Grand Ancestor, combined feasting could be ordered and honor and baseness not err.',
    idiomatic: 'Zhenyuan 7, month 11, day 28: Director Pei Yu noted that in Yin and Zhou moved shrines followed the Grand Ancestor, so combined feasting kept order.',
  },
  s0535: {
    literal: 'When Han Gaozu received the mandate, there was no ancestor of first enfeoffment; he took Emperor Gao as Grand Ancestor.',
    idiomatic: 'Han Gaozu had no first-enfeoffment forebear and made Emperor Gao Grand Ancestor.',
  },
  s0536: {
    literal: 'The Supreme Emperor, Gaodi\'s father, had a temple for offerings—not in the zhao-mu combined-feasting array, because he was honored above the Grand Ancestor.',
    idiomatic: 'The Supreme Emperor, Gaodi\'s father, had his own temple and stood outside zhao-mu combined feasting as senior to the Grand Ancestor.',
  },
  s0537: {
    literal: 'Wei Wu founded the enterprise and Emperor Wen received the mandate; he too took Emperor Wu as Grand Ancestor.',
    idiomatic: 'Wei Wu founded the state; Emperor Wen took Emperor Wu as Grand Ancestor.',
  },
  s0538: {
    literal: 'The High Emperor, Grand Emperor, Recluse Lord, and others were all kin seniors—not in the zhao-mu combined-feasting array.',
    idiomatic: 'High Emperor, Grand Emperor, and Recluse Lord were kin seniors outside zhao-mu feasting.',
  },
  s0539: {
    literal: 'Jin Xuan founded the enterprise and Emperor Wu received the mandate; he too took Emperor Xuan as Grand Ancestor.',
    idiomatic: 'Jin Xuan founded the state; Emperor Wu took Emperor Xuan as Grand Ancestor.',
  },
  s0540: {
    literal: 'The Western Campaign General, Yingchuan, and the other four lords were also kin seniors—not in the zhao-mu combined-feasting array.',
    idiomatic: 'Western Campaign General, Yingchuan, and three other lords were kin seniors outside zhao-mu feasting.',
  },
  s0541: {
    literal: 'The state received Heaven\'s mandate; successive sages restored glory.',
    idiomatic: 'Our dynasty received Heaven\'s mandate through successive sages.',
  },
  s0542: {
    literal: 'Emperor Jing at first enfeoffment as Duke of Tang was truly the Grand Ancestor.',
    idiomatic: 'Emperor Jing, first enfeoffed as Duke of Tang, was truly Grand Ancestor.',
  },
  s0543: {
    literal: 'The generations in between were near; within the three zhao and three mu, so the imperial Grand Temple had only six chambers.',
    idiomatic: 'Generations were still near; the imperial temple had only six chambers within three zhao and three mu.',
  },
  s0544: {
    literal: 'The Lord of Hongnong and the two ancestors Xuan and Guang, honored above the Grand Ancestor, when kin was exhausted were moved—not in the zhao-mu count.',
    idiomatic: 'Hongnong Lord and ancestors Xuan and Guang, senior to the Grand Ancestor, moved when kin was exhausted—not in zhao-mu.',
  },
  s0545: {
    literal: 'Recorded in the ritual monograph—it may be enacted.',
    idiomatic: 'This is recorded in the ritual monograph and may be followed.',
  },
  s0546: {
    literal: 'In Kaiyuan, nine temples were added; the two ancestors Offerings and Eminence were both in zhao-mu, so Grand Ancestor Emperor Jing could not occupy the east-facing honor.',
    idiomatic: 'Kaiyuan added nine temples; Offerings and Eminence entered zhao-mu, so Emperor Jing could not face east.',
  },
  s0547: {
    literal: 'Now the two ancestors have been tithed; the nine chambers are in order only—how can the Grand Ancestor\'s position again not be corrected?',
    idiomatic: 'Now both ancestors are tithed and nine chambers are ordered—how can the Grand Ancestor\'s seat remain uncorrected?',
  },
  s0548: {
    literal: 'Your subject asks: the Grand Ancestor matches Heaven above and is immovable for a hundred generations, yet occupies zhao-mu; the Ancestors of Offerings and Eminence, kin exhausted and temples moved, occupy the east-facing position—examined against old facts, this is truly unsettling.',
    idiomatic: 'The Grand Ancestor matches Heaven and is immovable, yet sits in zhao-mu while remote Offerings and Eminence face east—this is unsettling.',
  },
  s0549: {
    literal: 'We ask that deliberation be sent down to the hundred officials for joint discussion.',
    idiomatic: 'He asked the hundred officials to deliberate jointly.',
  },
  s0550: {
    literal: '" The edict followed this.',
    idiomatic: '" Approved.',
  },
  s0551: {
    literal: 'On the twenty-third day of the first month of the eighth year, Left Assistant to the Heir Apparent Li Rong and six others deliberated:',
    idiomatic: 'Year 8, month 1, day 23: Left Assistant to the Heir Apparent Li Rong and six others deliberated:',
  },
  s0552: {
    literal: 'The "Royal Regulations": "The Son of Heaven has seven temples—three zhao, three mu, and with the Grand Ancestor, seven."',
    idiomatic: '"Royal Regulations": "The Son of Heaven has seven temples—three zhao, three mu, with the Grand Ancestor, seven."',
  },
  s0553: {
    literal: 'This is the Zhou system.',
    idiomatic: 'This is Zhou practice.',
  },
  s0554: {
    literal: 'The seven are the Grand Ancestor and the tithes of King Wen and King Wu, with four intimate temples.',
    idiomatic: 'Seven means the Grand Ancestor plus Wen and Wu tithes and four intimate temples.',
  },
  s0555: {
    literal: 'The Grand Ancestor is Hou Ji.',
    idiomatic: 'Grand Ancestor is Hou Ji.',
  },
  s0556: {
    literal: 'Yin had six temples—Qi and Tang with two zhao and two mu.',
    idiomatic: 'Yin had six: Qi and Tang plus two zhao and two mu.',
  },
  s0557: {
    literal: 'Xia had five temples, without a Grand Ancestor—Yu with two zhao and two mu only.',
    idiomatic: 'Xia had five without Grand Ancestor—Yu plus two zhao and two mu.',
  },
  s0558: {
    literal: 'Jin Erudite Sun Qin deliberated: "The king receiving the mandate\'s Grand Ancestor and feudal lords\' ancestors of first enfeoffment—for spirit tablets before them, according to the count above, passing five generations destroys the temple; di and xia no longer reach them.',
    idiomatic: 'Jin Erudite Sun Qin: tablets before the mandate Grand Ancestor or first-enfeoffment ancestor are destroyed after five generations and excluded from di and xia.',
  },
  s0559: {
    literal: 'Those reached by di and xia mean after the mandate Grand Ancestor, successively destroyed temples\' tablets ascending to storage in the two tithe shrines.',
    idiomatic: 'Di and xia reach only descendants after the mandate Grand Ancestor, stored in the two tithe shrines.',
  },
  s0560: {
    literal: 'Even for a hundred generations, di and xia reach them."',
    idiomatic: 'Even after a hundred generations di and xia still reach them."',
  },
  s0561: {
    literal: 'Your subject notes the Ancestors of Offerings and Eminence are tablets of kin exhausted before the Grand Ancestor.',
    idiomatic: 'Offerings and Eminence are kin-exhausted forebears before the Grand Ancestor.',
  },
  s0562: {
    literal: 'Compared with institutions from the Three Dynasties downward, di and xia do not reach them.',
    idiomatic: 'By Three Dynasties precedent they are outside di and xia.',
  },
  s0563: {
    literal: 'The tablet of the dynastic ancestor is among tablets of destroyed temples below the Grand Ancestor—this is what the Gongyang Commentary means by "tablets of destroyed temples displayed before the Grand Ancestor."',
    idiomatic: 'The dynastic ancestor\'s tablet is a destroyed-shrine tablet displayed before the Grand Ancestor per Gongyang.',
  },
  s0564: {
    literal: 'Respectfully according to Han Yongguang 4 edict, deliberating abolition of commandery and state temples and ancestors of exhausted kin—Chancellor Wei Xuancheng deliberated the Supreme and Filial Emperor temples, all kin exhausted and fit to destroy; the Supreme temple tablet should be buried in the park, the Filial Emperor tablet moved to the Grand Ancestor temple.',
    idiomatic: 'Han Yongguang 4: Wei Xuancheng urged destroying kin-exhausted shrines; the Supreme tablet was buried in the park and Filial Emperor\'s moved to the Grand Ancestor temple.',
  },
  s0565: {
    literal: 'Memorial approved.',
    idiomatic: 'Approved.',
  },
  s0566: {
    literal: 'The Supreme Emperor, like tablets before the Grand Ancestor, buried in the park—di and xia do not reach them; this compares to today\'s Ancestors of Offerings and Eminence.',
    idiomatic: 'The Supreme Emperor, like pre-Grand Ancestor tablets, was buried in the park and excluded from di and xia—like today\'s Offerings and Eminence.',
  },
  s0567: {
    literal: 'Filial Emperor moved to the Grand Ancestor temple, showing descendants below the Grand Ancestor share di and xia\'s reach—this compares to today\'s dynastic ancestor Emperor Yuan\'s tablet.',
    idiomatic: 'Filial Emperor moved to the Grand Ancestor temple and joined di and xia—like today\'s Emperor Yuan tablet.',
  },
  s0568: {
    literal: 'From Wei and Jin through Song, Qi, Chen, and Sui in succession, each founding ruler of the mandate established a temple and left the Grand Ancestor\'s position empty.',
    idiomatic: 'Wei through Sui founders each built temples and left the Grand Ancestor seat empty.',
  },
  s0569: {
    literal: 'From after the Grand Ancestor to the seventh-generation ruler, then the Grand Ancestor\'s east-facing position completed the seven temples.',
    idiomatic: 'Seven generations after the Grand Ancestor filled the east-facing seat and completed seven temples.',
  },
  s0570: {
    literal: 'Tablets before the Grand Ancestor—Ming of Wei moved the Recluse Lord\'s tablet to the park settlement; each year an aide was sent to offer sacrifice, because generations were still near.',
    idiomatic: 'Pre-Grand Ancestor tablets: Wei Ming moved the Recluse Lord to the park with seasonal offerings because generations were still near.',
  },
  s0571: {
    literal: 'When Ming of Eastern Jin died, the three ancestors including the Western Campaign General were moved into the western side chamber, named tithe, approximating remote temples.',
    idiomatic: 'When Eastern Jin Ming died, three forebears including the Western Campaign General entered the western side chamber as tithe, like remote shrines.',
  },
  s0572: {
    literal: 'When Emperor Kang died and Emperor Mu succeeded, then Jingzhao was moved into the western side chamber, likewise called tithe; as in the former rite, all were outside di and xia.',
    idiomatic: 'Under Kang and Mu, Jingzhao entered the western tithe chamber and, like the earlier case, was excluded from di and xia.',
  },
  s0573: {
    literal: 'Our dynasty at first feasted at four temples; Xuan and Guang together with the Grand Ancestor and Shizu tablets were enshrined in the temple.',
    idiomatic: 'Tang first had four temples; Xuan and Guang were enshrined with Grand Ancestor and Shizu.',
  },
  s0574: {
    literal: 'In the ninth Zhenguan year, when Gaozu was to be enshrined in the Grand Temple, Zhu Zishe asked to establish seven temples per the rite—the three zhao and three mu each with a tablet.',
    idiomatic: 'Zhenguan 9: enshrining Gaozu, Zhu Zishe asked for seven temples with separate zhao and mu tablets.',
  },
  s0575: {
    literal: 'The Grand Ancestor, following Jin-Song precedent, left the position empty, awaiting successive moves to place him in the east-facing seat.',
    idiomatic: 'The Grand Ancestor seat was left empty per Jin-Song precedent until succession filled the east-facing place.',
  },
  s0576: {
    literal: 'Thereupon Hongnong Lord and Gaozu were first enshrined as six chambers; the Grand Ancestor\'s position was left empty while di and xia were performed.',
    idiomatic: 'Hongnong Lord and Gaozu filled six chambers; the Grand Ancestor seat stayed empty during di and xia.',
  },
  s0577: {
    literal: 'By the twenty-third year, when Taizong was enshrined, the Hongnong Lord was stored in the western side chamber.',
    idiomatic: 'Year 23, when Taizong was enshrined, Hongnong Lord went to the western side chamber.',
  },
  s0578: {
    literal: 'In the first Weming year, when Gaozong was enshrined, Emperor Xuan was first moved to the western side chamber.',
    idiomatic: 'Weming 1, enshrining Gaozong, moved Emperor Xuan to the western side chamber.',
  },
  s0579: {
    literal: 'In the tenth Kaiyuan year, Xuanzong specially established nine temples; he posthumously honored Emperor Xuan as Ancestor of Offerings, restored to the main chamber, and Emperor Guang as Ancestor of Eminence to complete nine chambers.',
    idiomatic: 'Kaiyuan 10: Xuanzong made nine temples, renaming Xuan Offerings and Guang Eminence in the main chambers.',
  },
  s0580: {
    literal: 'Di and xia still left the Grand Ancestor\'s position empty.',
    idiomatic: 'Di and xia still left the Grand Ancestor seat empty.',
  },
  s0581: {
    literal: 'Prayer texts did not call the three ancestors "subject," clarifying that the full temple count alone was intended.',
    idiomatic: 'Prayers did not style the three ancestors as subjects—only the full temple count mattered.',
  },
  s0582: {
    literal: 'After recovery in the second Zhide year, new nine-temple tablets were made; the Hongnong Lord tablet was not made, clarifying that di and xia did not reach him.',
    idiomatic: 'After Zhide 2 recovery new tablets were made but not for Hongnong Lord—he was outside di and xia.',
  },
  s0583: {
    literal: 'In the second Baoying year, Xuanzong and Suzong were enshrined; Offerings and Eminence moved to the western side chamber; only then was the Grand Ancestor placed in the east-facing position, treating Offerings and Eminence as kin-exhausted tablets before the Grand Ancestor—per the rite, di and xia did not reach them—for eighteen years in all.',
    idiomatic: 'Baoying 2: Xuanzong and Suzong were enshrined; Offerings and Eminence went to the western side chamber; the Grand Ancestor finally faced east for eighteen years.',
  },
  s0584: {
    literal: 'By the tenth month of the second Jianzhong year, when the xia feast was to be held, Commissioner Yan Zhenqing memorialized that the Offerings and Eminence tablets should be brought out; for array order and the eastern seat of honor, he asked to fix it per Eastern Jin Cai Mo and others\' deliberation.',
    idiomatic: 'Jianzhong 2, month 10: Yan Zhenqing urged bringing out Offerings and Eminence and fixing placement per Eastern Jin Cai Mo.',
  },
  s0585: {
    literal: 'Thereupon the Ancestor of Offerings faced east, the Ancestor of Eminence in the zhao position facing south, the Grand Ancestor in the mu position facing north, and in sequence left-zhao right-mu for the array.',
    idiomatic: 'Offerings faced east, Eminence south in zhao, Grand Ancestor north in mu, with left-zhao right-mu thereafter.',
  },
  s0586: {
    literal: 'Yet though Cai Mo had this deliberation at the time, the affair in the end was not enacted—how can our Tang temple line be taken as standard?',
    idiomatic: 'Cai Mo\'s view was never enacted—Tang cannot take it as standard.',
  },
  s0587: {
    literal: 'Rong notes that chang, di, suburban, and altar rites allow no second supreme honor; burial, destruction, relocation, and storage have ritual grounds for decision.',
    idiomatic: 'Chang, di, suburban, and altar rites admit no second supreme; burial and relocation follow ritual breaks.',
  },
  s0588: {
    literal: 'Treating Offerings and Eminence as kin-exhausted tablets while the Grand Ancestor should already hold east-facing honor—to shift this in one morning is truly not precedent.',
    idiomatic: 'Offerings and Eminence are kin-exhausted; the Grand Ancestor should face east—one-morning reversal is not precedent.',
  },
  s0589: {
    literal: 'We hold the former court\'s precedent should be restored: Offerings and Eminence tablets stored in the western side chamber, analogous to the Canon of Sacrifices: "Remote temples become tithe; leaving tithe becomes altar; leaving altar becomes open ground; altars and open ground are sacrificed to when there is prayer, otherwise stopped."',
    idiomatic: 'Restore precedent: store Offerings and Eminence in the western side chamber like "remote temples become tithe" in the Canon of Sacrifices.',
  },
  s0590: {
    literal: 'The Grand Ancestor, having illustriously matched Heaven, should occupy the east-facing honor.',
    idiomatic: 'The Grand Ancestor, matching Heaven, should face east.',
  },
  s0591: {
    literal: 'Then above one may keep Zhenguan\'s opening institution, in the middle follow Kaiyuan\'s completed rule, below observe Baoying\'s strict form—accordant with canonical meaning, not losing old statutes.',
    idiomatic: 'Thus Zhenguan\'s opening rule, Kaiyuan\'s settled form, and Baoying\'s strict practice are all preserved.',
  },
  s0592: {
    literal: 'Supernumerary Secretary in the Ministry of Personnel Liu Mian and twelve others deliberated:',
    idiomatic: 'Liu Mian of the Ministry of Personnel and twelve others deliberated:',
  },
  s0593: {
    literal: 'The Son of Heaven\'s ruler who received the mandate and feudal lords\' ancestor of first enfeoffment are all called Grand Ancestor.',
    idiomatic: 'The mandate-receiving ruler and a lord\'s first-enfeoffment ancestor are both Grand Ancestor.',
  },
  s0594: {
    literal: 'Therefore even the Son of Heaven must have one honored—thus the Grand Ancestor is honored;',
    idiomatic: 'Even the Son of Heaven has one who is honored—therefore the Grand Ancestor;',
  },
  s0595: {
    literal: 'therefore even feudal lords must have forebears—also the Grand Ancestor is honored.',
    idiomatic: 'even lords have forebears—also honored as Grand Ancestor.',
  },
  s0596: {
    literal: 'Below the Grand Ancestor, when kin is exhausted, temples are destroyed.',
    idiomatic: 'Below the Grand Ancestor, kin exhaustion destroys temples.',
  },
  s0597: {
    literal: 'By the time Qin extinguished learning, Han did not reach the rites—neither arrayed zhao-mu nor established successive destruction.',
    idiomatic: 'After Qin ended learning, Han failed to array zhao-mu or successive destruction.',
  },
  s0598: {
    literal: 'Jin lost it; Song followed.',
    idiomatic: 'Jin lost it.',
  },
  s0599: {
    literal: 'Thus there was violation of the five-temple system and emptying of the Grand Ancestor\'s position.',
    idiomatic: 'Thus the five-temple rule was violated and the Grand Ancestor seat left empty.',
  },
  s0600: {
    literal: 'Not arraying zhao-mu is not how to show people there is order;',
    idiomatic: 'Failure to array zhao-mu does not show people there is order;',
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
