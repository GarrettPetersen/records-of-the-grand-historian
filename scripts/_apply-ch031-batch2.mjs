#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.031, Rites 7 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/031.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'Where ritual and the Code and Commentaries have mutual involvement, we also request correction according to this.',
    idiomatic: 'Where ritual and the Code and Commentaries touched the same points, they asked those amended too.',
  },
  s0102: {
    literal: 'Siye is not the case of a legitimate mother\'s remarriage — it is not fitting to remove from office.',
    idiomatic: 'Siye\'s case was not a legitimate mother\'s remarriage — he should not leave office.',
  },
  s0103: {
    literal: 'The decree followed.',
    idiomatic: 'The court assented.',
  },
  s0104: {
    literal: 'Heaven honored, Earth humble — Heaven one, Earth two; the positions of yin and yang are divided, and the way of husband and wife is paired.',
    idiomatic: 'Heaven stands honored, Earth humble — one and two, yin and yang take their places, and husband and wife are paired.',
  },
  s0105: {
    literal: 'As for the majesty of death and mourning, the grades of exaltation and reduction — the ritual classic\'s five-garment system, trimmed and cut garments differ; three years\' mourning for father and mother, noble and base without barrier — to repay the kindness of carrying and cherishing, to requite boundless favor.',
    idiomatic: 'Death and mourning have their majesty and their grades of rise and fall — five garments in the classic, trimmed sackcloth and cut sackcloth not alike, three years for father and mother without rank — repaying the kindness of the womb, requiting boundless debt.',
  },
  s0106: {
    literal: 'Examined in high antiquity, mourning periods had no number; reaching the middle age, only then were years fixed.',
    idiomatic: 'In deepest antiquity mourning had no fixed term; only in the middle ages did years appear.',
  },
  s0107: {
    literal: 'The Ritual says: "The Five Emperors differed in season — they did not continue one another\'s music;',
    idiomatic: 'The Ritual says: "The Five Emperors differed in season — music did not pass unchanged;',
  },
  s0108: {
    literal: 'the Three Kings differed in generation — they did not inherit one another\'s ritual." The passage concluded.',
    idiomatic: 'the Three Kings differed in age — ritual did not pass unchanged. The passage concluded."',
  },
  s0109: {
    literal: 'The White Tiger Treatise says: "Substance and pattern change twice; correct beginning returns thrice." The passage concluded.',
    idiomatic: 'The White Tiger Treatise says: "Substance and pattern turn twice; the calendar\'s start returns threefold." The passage concluded."',
  },
  s0110: {
    literal: 'From after the Duke of Zhou made ritual, since Confucius the father edited the classics — then were distinguished the ceremonies of honored reduction, to mark the nodes of mourning regulation.',
    idiomatic: 'After the Duke of Zhou made ritual and Confucius edited the classics, honored reduction was singled out to mark the nodes of mourning law.',
  },
  s0111: {
    literal: 'Heavy and light follow custom; weigh and pour according to the time.',
    idiomatic: 'Weight and lightness followed custom; the code was poured to fit the age.',
  },
  s0112: {
    literal: 'Hence one knows ritual does not descend from Heaven, does not emerge from Earth — it rests in human messages, only the timely mean.',
    idiomatic: 'Ritual does not fall from sky or rise from soil — it lives in human feeling and seeks the mean of the time.',
  },
  s0113: {
    literal: 'Among the states of Spring and Autumn, Lu knew ritual best — being the Duke of Zhou\'s descendant, Confucius\'s homeland.',
    idiomatic: 'Among Spring and Autumn states Lu knew ritual best — the Duke of Zhou\'s line, Confucius\'s homeland.',
  },
  s0114: {
    literal: 'Han Qi of Jin came on a mission and said, "Zhou ritual is all in Lu."',
    idiomatic: 'Han Qi of Jin came visiting and said, "All Zhou ritual is in Lu."',
  },
  s0115: {
    literal: 'Zhongsun of Qi came to covenant and said, "Lu still holds Zhou ritual."',
    idiomatic: 'Zhongsun of Qi came to covenant and said, "Lu still holds to Zhou ritual."',
  },
  s0116: {
    literal: 'Yet there were still Zi-zhang asking about Gaozong\'s three years in the mourning hut; Zisi not permitting his son to mourn an expelled mother; Zi-you holding that half-brothers of the same mother wear greater accomplishment; Zi-xia holding they should join the trimmed-sackcloth system.',
    idiomatic: 'Yet Zi-zhang had asked about Gaozong\'s three years in the mourning hut; Zisi forbade his son mourning an expelled mother; Zi-you set half-brothers of one mother at greater accomplishment; Zi-xia argued for trimmed sackcloth.',
  },
  s0117: {
    literal: 'These were all of the four categories\' number, men of the Ten Wise — high steps in Confucius\'s gate, personally receiving sage teaching — yet meeting mourning affairs they still doubted thus, which makes clear that from antiquity until now, rise and fall are not one.',
    idiomatic: 'They were of the four categories, the Ten Wise — high in Confucius\'s gate, taught by the sage — yet on mourning they still doubted: from antiquity, rise and fall were never one.',
  },
  s0118: {
    literal: 'On the three-year system, debaters were clamorous.',
    idiomatic: 'On the three-year rule, debaters swarmed.',
  },
  s0119: {
    literal: 'Zheng Xuan held it twenty-seven months; Wang Su held twenty-five months.',
    idiomatic: 'Zheng Xuan counted twenty-seven months; Wang Su twenty-five.',
  },
  s0120: {
    literal: 'Again, mourning for reburial — Zheng says wear finest hemp three months; Wang says remove when burial ends.',
    idiomatic: 'On reburial: Zheng required finest hemp three months; Wang removed mourning when burial ended.',
  },
  s0121: {
    literal: 'Again, when the stepmother leaves the household — Zheng says all wear mourning; Wang says only if she reared you is mourning worn.',
    idiomatic: 'On a stepmother\'s remarriage: Zheng required mourning for all; Wang only if she had reared you.',
  },
  s0122: {
    literal: 'Again, the ungarmented infant death — Zheng says if the child lived one month, mourn one day;',
    idiomatic: 'On infants who died too young for garments: Zheng set one day of mourning if the child lived one month;',
  },
  s0123: {
    literal: 'Wang says use the month of easy garments for the one day of weeping.',
    idiomatic: 'Wang traded the month of garment change for the day of weeping.',
  },
  s0124: {
    literal: 'Zheng and Wang, ancestors of the classic tradition, each differ and agree; Xun Zhuan gathered antiquity seeking what was lost — each reduced or increased the other.',
    idiomatic: 'Zheng and Wang, pillars of the tradition, agreed and differed; Xun Zhuan gathered antiquity and trimmed each against the other.',
  },
  s0125: {
    literal: 'Only then did one know that departing the sage gradually far, fragments and gaps grow more.',
    idiomatic: 'Distance from the sage only widened the gaps.',
  },
  s0126: {
    literal: 'Thus it is said: the house that assembles ritual is named the house of gathered litigation — how could there be fixity!',
    idiomatic: 'Hence the saying: the house that "assembles ritual" is the house of gathered lawsuits — nothing was ever fixed.',
  },
  s0127: {
    literal: 'Yet "when the father is alive, three years for the mother" has been practiced for more than four reign-periods, coming from the era of the Great Emperor Gaozong, not from the court of Empress Zetian.',
    idiomatic: 'Yet "father alive, three years for the mother" had run more than four reigns — born in Gaozong\'s day, not Wu Zetian\'s court.',
  },
  s0128: {
    literal: 'When the Great Emperor ascended the throne, on the day the inner palace submitted the memorial — deliberation of the past could be carried out; entered into the administrative code, worn long already.',
    idiomatic: 'When Gaozong took the throne the inner palace had already submitted the memorial; it entered the code and had been worn long.',
  },
  s0129: {
    literal: 'What a former king approved, sparse and made law;',
    idiomatic: 'What a former king approved became sparse commentary and law;',
  },
  s0130: {
    literal: 'what a later king approved, written and made ordinance.',
    idiomatic: 'what a later king approved became written ordinance.',
  },
  s0131: {
    literal: 'Why must one oppose the former emperor\'s intent, obstruct the son\'s feeling, wound pure filial heart, turn the back on virtue and righteousness\'s root?',
    idiomatic: 'Why oppose a former emperor\'s intent, block a son\'s feeling, wound pure filial heart, turn from virtue\'s root?',
  },
  s0132: {
    literal: 'What harm to sage transformation? What disorder to constant human relations — yet wishing mourning of one cycle, equal to father\'s younger brother\'s wife, equal to father\'s sisters?',
    idiomatic: 'What harm to sage rule? What disorder to human relations — yet you would wear one cycle, equal to a father\'s younger brother\'s wife, equal to father\'s sisters?',
  },
  s0133: {
    literal: 'The three years\' mourning is like a white colt crossing a crack — the noble person mourning kin has lifelong sorrow; how much more two cycles!',
    idiomatic: 'Three years pass like a white colt through a crack — the noble mourner grieves for life; how much more two full cycles!',
  },
  s0134: {
    literal: 'Ritual is the body; it is the tread — it shows the footprint.',
    idiomatic: 'Ritual is the body and the tread — it shows the footprint.',
  },
  s0135: {
    literal: 'Filial piety is cherishing; it is nurturing — by it the heart is sustained.',
    idiomatic: 'Filial piety is cherishing and nurturing — the heart is sustained through it.',
  },
  s0136: {
    literal: 'Small men are not ashamed of lacking benevolence, do not fear lacking righteousness.',
    idiomatic: 'Small men are not ashamed to lack benevolence, do not fear to lack righteousness.',
  },
  s0137: {
    literal: 'Having a system for garments makes fools aspire;',
    idiomatic: 'Garments with fixed grades let fools aspire upward;',
  },
  s0138: {
    literal: 'clothing them in sackcloth makes the sight crush with pain.',
    idiomatic: 'dressing them in sackcloth makes the sight crush the heart.',
  },
  s0139: {
    literal: 'By this to guard people, people still have dying in the morning and forgetting by evening;',
    idiomatic: 'With this to guard them, some still die at dawn and forget by dusk;',
  },
  s0140: {
    literal: 'by this to regulate people, people still have removing garments and following auspicious affairs.',
    idiomatic: 'with this to bind them, some still shed garments and chase good fortune.',
  },
  s0141: {
    literal: 'Now we gradually return to ancient simplicity — filial righteousness must be thickly cultivated; restrain the worthy and draw the foolish — principle relies on quieting in sorrow; eating rice and wearing brocade — what the ear cannot bear to hear.',
    idiomatic: 'The age turns back toward simplicity — filial righteousness must be thickened; restrain the worthy, draw the foolish — principle rests in quieting grief; eating rice and wearing brocade is what the ear cannot bear.',
  },
  s0142: {
    literal: 'If for the various affairs of court audience one followed Zhou ritual entirely, then when men of old saw the ruler, dukes, ministers, and grandees presented lambs, geese, jade disks and bi — why not follow now?',
    idiomatic: 'If court audience followed Zhou ritual entirely, ancient ministers had presented lambs, geese, disks and bi — why not now?',
  },
  s0143: {
    literal: 'When Zhou used punishments — tattooing, nose-cutting, castration, amputation — why not practice now?',
    idiomatic: 'Zhou punished with tattoo, nose-cutting, castration, amputation — why not now?',
  },
  s0144: {
    literal: 'Zhou had marquis, inner, baron, and guard — court audiences had number — why not practice now?',
    idiomatic: 'Zhou had marquis, inner, baron, guard — audiences were numbered — why not now?',
  },
  s0145: {
    literal: 'Zhou: not at fifty one does not serve; at seventy one does not enter court — why not follow now?',
    idiomatic: 'Zhou: not serving before fifty; not entering court at seventy — why not now?',
  },
  s0146: {
    literal: 'Zhou had well, hamlet, mound, and outer settlement to establish levies — why not practice now?',
    idiomatic: 'Zhou taxed by well, hamlet, mound, and outer settlement — why not now?',
  },
  s0147: {
    literal: 'Zhou had three elders and five ranks — father dies, son succeeds — why not practice now?',
    idiomatic: 'Zhou had three elders and five ranks — father dies, son succeeds — why not now?',
  },
  s0148: {
    literal: 'Zhou had cap, crown, robe, and fur — chariot riding to battle — why not practice now?',
    idiomatic: 'Zhou capped and robed and rode chariots to war — why not now?',
  },
  s0149: {
    literal: 'Zhou divided land and five elders, glue-and-order to nurture the aged — why not practice now?',
    idiomatic: 'Zhou divided land, kept five elders, schools to nurture the aged — why not now?',
  },
  s0150: {
    literal: 'Cases like these cannot be exhaustively stated.',
    idiomatic: 'Examples like these cannot be counted.',
  },
  s0151: {
    literal: 'Why alone on the matter of filial thought love one year\'s mourning for one\'s mother?',
    idiomatic: 'Why alone on filial thought cut a mother\'s mourning to one year?',
  },
  s0152: {
    literal: 'What can wound the heart, what can make one wail!',
    idiomatic: 'What can wound the heart — what can make one wail!',
  },
  s0153: {
    literal: 'The Ode says: "Alas, alas, parents — bearing me was toil and labor."',
    idiomatic: 'The Ode says: "Alas, alas, my parents — to bear me was labor and toil."',
  },
  s0154: {
    literal: 'The Ritual says: "The father\'s loving the son — he loves the worthy and lowers the incapable;',
    idiomatic: 'The Ritual says: "A father loves his son by loving the worthy and setting aside the incapable;',
  },
  s0155: {
    literal: 'the mother\'s loving the son — if worthy then she loves, if incapable then she pities." The passage concluded.',
    idiomatic: 'a mother loves her son — if worthy she loves, if incapable she pities. The passage concluded."',
  },
  s0156: {
    literal: 'Ruan Jizong was a Jin-era heroic talent, a high man beyond the world — he held the mother heavier than the father.',
    idiomatic: 'Ruan Jizong was Jin\'s heroic talent, a man above the world — he held the mother heavier than the father.',
  },
  s0157: {
    literal: 'Judging by trimmed-sackcloth bolt measure, coarse and fine already reduced — how bear that the node of mourning be reduced to one cycle?',
    idiomatic: 'Trimmed sackcloth already graded coarse and fine by bolt — how bear reducing the mourning node to one cycle?',
  },
  s0158: {
    literal: 'Are men of later ages all ashamed before antiquity?',
    idiomatic: 'Are later men all ashamed before the ancients?',
  },
  s0159: {
    literal: 'Following antiquity is not necessarily right; following today is not necessarily wrong.',
    idiomatic: 'Following antiquity is not necessarily right; following today not necessarily wrong.',
  },
  s0160: {
    literal: 'Again, shared-hearth finest hemp — the ritual classic clarifies the principle.',
    idiomatic: 'Again, shared-hearth finest hemp — the classic states the principle clearly.',
  },
  s0161: {
    literal: 'Sister-in-law and younger uncle kept far apart — the same as passers-by on the road.',
    idiomatic: 'Sister-in-law and younger uncle were held far apart — as strangers on the road.',
  },
  s0162: {
    literal: 'Drawing forward and advancing — touching categories and extending.',
    idiomatic: 'Draw near and advance — touch a category and extend it.',
  },
  s0163: {
    literal: 'Foster sons all wear hemp and ramie, yet the father\'s younger brother does not wear finest hemp — pushing distant feeling has surplus, thick kinship righteousness is not enough.',
    idiomatic: 'Foster sons wore hemp and ramie, yet a father\'s younger brother wore no finest hemp — distance was overstated, thick kinship understated.',
  },
  s0164: {
    literal: 'Again, the mother\'s brothers — feeling cuts to Wei-yang; Zhai Fan sued the injustice done his mother\'s brother; the Ning clan dwelt in the nephew\'s phase — my going forth, righteousness is also deep.',
    idiomatic: 'A mother\'s brothers cut feeling to the Wei-yang ode; Zhai Fan sued injustice for his mother\'s brother; the Ning clan kept the nephew\'s seat — in my own going forth, the debt is also deep.',
  },
  s0165: {
    literal: 'Not the same as the mother\'s sister\'s honored rank — thus reduced to lesser accomplishment; by the various ancient rituals, popular feeling is offended.',
    idiomatic: 'Not the same honored rank as a mother\'s sister — thus reduced to lesser accomplishment; by ancient ritual, popular feeling was offended.',
  },
  s0166: {
    literal: 'Now demoting the mother\'s brother and honoring the mother\'s sister — this is making today base and antiquity glorious.',
    idiomatic: 'Now demoting the mother\'s brother and honoring the mother\'s sister — that makes today base and antiquity glorious.',
  },
  s0167: {
    literal: 'These are all Taizong\'s regulations — practiced a hundred years already; rashly to cut and restore truly has doubt in use.',
    idiomatic: 'These were all Taizong\'s regulations — practiced a hundred years; rashly cutting and restoring was doubtful in practice.',
  },
  s0168: {
    literal: 'Thereupon debate was unsettled.',
    idiomatic: 'Debate deadlocked.',
  },
  s0169: {
    literal: 'Lübing again submitted a memorial, saying: "The Ritual: when the father is alive, for the mother eleven months then practice; thirteenth month auspicious; fifteenth month end-of-mourning; heart mourning three years.',
    idiomatic: 'Lübing wrote again, citing the Ritual: while the father lived, for the mother eleven months to practice, thirteenth month auspicious rites, fifteenth month end-of-mourning, and three years\' heart mourning.',
  },
  s0170: {
    literal: 'In the Shangyuan era Empress Wu Zetian submitted a memorial requesting mourning the same as when the father is dead — also not yet carried out.',
    idiomatic: 'In Shangyuan Wu had asked for mourning equal to a father\'s death, but it had not yet taken effect.',
  },
  s0171: {
    literal: 'By the Chuigong era it was first entered into the administrative code; after the change of dynasty the custom then spread in practice.',
    idiomatic: 'Only in Chuigong was it written into the code; after the dynastic shift the custom spread.',
  },
  s0172: {
    literal: 'Your servant, in the fifth year of Kaiyuan, repeatedly requested return to the old rule.',
    idiomatic: 'Your servant, in Kaiyuan 5, repeatedly asked to restore the old rule.',
  },
  s0173: {
    literal: 'The gracious edict also entrusted mourning for sisters-in-law, younger uncles, and mother\'s brothers and sisters to the relevant offices for detailed deliberation.',
    idiomatic: 'The throne also sent mourning for sisters-in-law, younger uncles, and maternal kin to the relevant offices for review.',
  },
  s0174: {
    literal: 'The offices\' deliberations mixed agreement and difference.',
    idiomatic: 'The offices split.',
  },
  s0175: {
    literal: 'The relevant office alone held to the text on trimmed and cut garments, and also said it accorded with canonical ritual.',
    idiomatic: 'One office clung to the trimmed-sackcloth articles and called that canonical.',
  },
  s0176: {
    literal: 'I observe that the newly revised code still follows the Chuigong error, so that when grandparents are alive and a grandson\'s wife dies, in the lower apartments a second full cycle is also observed — most meaningless.',
    idiomatic: 'The new code still followed Chuigong\'s error: with grandparents alive and a grandson\'s wife dead, lower apartments sometimes observed a second full cycle — absurd.',
  },
  s0177: {
    literal: 'According to the Changes, Family hexagram: "It profits the woman\'s constancy; the woman holds correct position within, the man holds correct position without.',
    idiomatic: 'The Changes, Family hexagram, says: constancy profits the woman; she holds correct position within, the man without.',
  },
  s0178: {
    literal: 'Man and woman correct — this is the great principle of Heaven and Earth.',
    idiomatic: 'Correct man and woman embody Heaven and Earth\'s great principle.',
  },
  s0179: {
    literal: 'The family has a stern lord — this means father and mother.',
    idiomatic: 'A household has a stern lord: father and mother.',
  },
  s0180: {
    literal: 'Father as father, son as son, elder brother as elder brother, younger brother as younger brother, husband as husband, wife as wife — the family way is correct and the realm is correct.',
    idiomatic: 'Father father, son son, elder brother elder brother, younger brother younger brother, husband husband, wife wife — right the family and the realm follows.',
  },
  s0181: {
    literal: 'The Ritual: "A woman in the chamber takes the father as Heaven;',
    idiomatic: 'The Ritual says: in the chamber a woman takes her father as Heaven;',
  },
  s0182: {
    literal: 'after marriage, she takes the husband as Heaven."',
    idiomatic: 'after marriage she takes her husband as Heaven."',
  },
  s0183: {
    literal: 'Again: "At home she follows the father; after marriage she follows the husband; when the husband dies she follows the son."',
    idiomatic: 'Again: at home she follows the father, in marriage the husband, in widowhood the son."',
  },
  s0184: {
    literal: 'Fundamentally there is no law of self-willed defiance of elders.',
    idiomatic: 'There is no charter for defying elders on one\'s own.',
  },
  s0185: {
    literal: 'The Mourning Dress Four Principles says: "Heaven has no two suns, earth no two kings, the state no two lords, the family no two elders — one principle governs.',
    idiomatic: 'The Mourning Dress Four Principles says: Heaven has no two suns, earth no two kings, a state no two lords, a family no two elders — one principle rules all.',
  },
  s0186: {
    literal: 'Therefore when the father is alive mourning for the mother is one cycle — to avoid two elders." The passage concluded.',
    idiomatic: 'Hence while the father lives, mourning for the mother is one cycle — to avoid two elders in one house. The passage concluded."',
  },
  s0187: {
    literal: 'I bow and consider that Your Majesty rightly holds family and state and filially governs the realm, yet does not decide in the imperial heart and correct this ritual in detail — do not follow vulgar custom and indulge children\'s feelings.',
    idiomatic: 'Your Majesty rightly orders family and state by filial rule, yet has not settled this rite in the imperial heart — do not follow custom and indulge a child\'s feeling alone.',
  },
  s0188: {
    literal: 'Your servant fears that later ages will again have women who usurp their husbands\' government." The passage concluded.',
    idiomatic: 'Your servant fears later ages will again see wives seize their husbands\' authority. The passage concluded."',
  },
  s0189: {
    literal: 'The memorial was submitted and not answered.',
    idiomatic: 'No answer came.',
  },
  s0190: {
    literal: 'Lübing again submitted a memorial:',
    idiomatic: 'Lübing wrote again.',
  },
  s0191: {
    literal: 'Your subject has heard that the way of husband and wife is the beginning of human relations.',
    idiomatic: 'The way of husband and wife, he wrote, is where human relations begin.',
  },
  s0192: {
    literal: 'Honored and humble take law from Heaven and Earth; movement and rest accord with yin and yang — yin and yang harmonize and Heaven and Earth generate; husband and wife are correct and human relations take their pattern.',
    idiomatic: 'High and low take law from Heaven and Earth; movement and rest match yin and yang — yin and yang harmonize and the world is born; husband and wife are right and human relations fall into order.',
  },
  s0193: {
    literal: 'From regulating the family to punishing the state — the hen does not crow at dawn; the four virtues\' ritual is not transgressed; the three followings\' principle stands there.',
    idiomatic: 'From family discipline to state punishment — the hen does not crow at dawn; the four virtues are not breached; the three followings stand firm.',
  },
  s0194: {
    literal: 'The Mourning Dress Four Principles says: "Heaven has no two suns, earth no two kings, the state no two lords, the family no two elders — one principle governs.',
    idiomatic: 'The Mourning Dress Four Principles says: Heaven has no two suns, earth no two kings, a state no two lords, a family no two elders — one principle rules all.',
  },
  s0195: {
    literal: 'Therefore when the father is alive mourning for the mother is one cycle — to show there are not two elders." The passage concluded.',
    idiomatic: 'Hence while the father lives, mourning for the mother is one cycle — to show there are not two elders in one house. The passage concluded."',
  },
  s0196: {
    literal: 'According to old observance, when the father is alive mourning for the mother is one cycle until removal of the spirit tablet, two cycles heart mourning.',
    idiomatic: 'Old observance fixed one cycle until tablet removal for a mother while the father lived, and two cycles of heart mourning.',
  },
  s0197: {
    literal: 'That the father must wait three years before marrying again — this penetrates the son\'s intent.',
    idiomatic: 'That a father waited three years before remarrying penetrated the son\'s intent.',
  },
  s0198: {
    literal: 'How could the former sage be without feeling toward those who bore him — he firmly had intent toward family and state.',
    idiomatic: 'The former sage was not without feeling for those who bore him — he firmly held family and state in view.',
  },
  s0199: {
    literal: 'Tracing it: in the inaugural year of Shangyuan, Zetian already secretly held government, about to plot usurpation, beforehand exalting her kin.',
    idiomatic: 'Trace it to Shangyuan\'s first year: Wu already held power in secret, plotting usurpation, exalting her kin beforehand.',
  },
  s0200: {
    literal: 'Tracing it to the root: in the inaugural year of Shangyuan, Zetian already secretly held government, about to plot usurpation, beforehand exalting her kin.',
    idiomatic: 'At the root: Shangyuan\'s first year found Wu already ruling in secret, plotting usurpation, exalting her line beforehand.',
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
if (data.metadata.chapter !== '031') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 031; standalone T ready (${Object.keys(T).length} entries).`
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
