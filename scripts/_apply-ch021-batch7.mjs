#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: 'When Ji grew up he was diligent in farming and planting; Yao heard of it and appointed him Agricultural Master; all under Heaven gained benefit—he had great merit; Shun enfeoffed him at Tai and styled him Hou Ji.',
    idiomatic: 'Hou Ji grew diligent in field and furrow; Yao heard and made him Agricultural Master. The realm profited—great was his merit. Shun enfeoffed him at Tai and named him Hou Ji.',
  },
  s0602: {
    literal: 'In the age of Tang, Yu, and Xia, each possessed eminent virtue.',
    idiomatic: 'In the age of Tang, Yu, and Xia, each bore eminent virtue.',
  },
  s0603: {
    literal: 'Thus the Odes says: "She trod the great god\'s footprint and was moved; she bore a child, and there was the house of Tai."',
    idiomatic: 'Thus the Odes: "She trod the great god\'s footprint and was moved; she bore a child—and there was the house of Tai."',
  },
  s0604: {
    literal: '" This is what is meant.',
    idiomatic: '" So it is meant.',
  },
  s0605: {
    literal: 'When Shun and Yu held all under Heaven, Ji and Qi were among them; weighing merit and comparing virtue, they were rather second rank.',
    idiomatic: 'Shun and Yu held the realm; Ji and Qi stood among them—by merit and virtue, rather second rank.',
  },
  s0606: {
    literal: 'When Shun invested them with office, Qi sowed the hundred grains and spread the Five Teachings.',
    idiomatic: 'Shun gave them office: Qi sowed the hundred grains and spread the Five Teachings.',
  },
  s0607: {
    literal: 'When Yu yielded merit, he leveled water and earth and settled the hundred offices.',
    idiomatic: 'When Yu yielded the merit, he leveled water and earth and took charge of the hundred offices.',
  },
  s0608: {
    literal: 'Thus the Discourses of the States says: "When the sage instituted sacrifice, if merit was bestowed upon the people then he sacrificed to them; if one died in diligent service then he sacrificed to them."',
    idiomatic: 'Thus the Discourses: "The sage made sacrifice—whoever bestowed merit on the people was sacrificed to; whoever died in diligent service was sacrificed to."',
  },
  s0609: {
    literal: '" Qi was Minister of Education and the people were harmonious; Ji labored over the hundred grains and died—both stood in the sacrificial canon of former ages; when their descendants held all under Heaven, could they fail to honor and take them as ancestors?',
    idiomatic: '" Qi as Minister of Education made the people harmonious; Ji labored over the hundred grains unto death—both stood in the sacrificial canon of former ages. When their line held the realm, could they fail to honor them as ancestors?',
  },
  s0610: {
    literal: 'The fifth objection says: Having followed Zheng\'s doctrine, minor virtue pairs with few—thus Hou Ji pairs with only one Thearch and still cannot fully pair with the Five Thearchs.',
    idiomatic: 'The fifth objection: Following Zheng\'s doctrine, minor virtue pairs with few—Hou Ji pairs with only one Thearch and cannot fully pair with the Five.',
  },
  s0611: {
    literal: 'Now to have the Jing Emperor pair solely with August Heaven—is that permissible in Zheng\'s meaning?',
    idiomatic: 'To pair the Jing Emperor solely with August Heaven—is that allowed in Zheng\'s doctrine?',
  },
  s0612: {
    literal: 'The sixth objection says: Those who object to me say: "The High God and the Five Thearchs are one."',
    idiomatic: 'The sixth objection: My opponents say, "The High God and the Five Thearchs are one."',
  },
  s0613: {
    literal: 'They cite the Offices of Spring: "In sacrificing to Heaven, marshal the High God; in sacrificing to Earth, marshal the Four Quarters."',
    idiomatic: 'They cite the Offices of Spring: "Sacrificing to Heaven, marshal the High God; sacrificing to Earth, marshal the Four Quarters."',
  },
  s0614: {
    literal: '"Marshal" means "the multitude"—thus the High God is the Five Thearchs.',
    idiomatic: '"Marshal" means multitude—therefore the High God is the Five Thearchs.',
  },
  s0615: {
    literal: 'I say: Not so.',
    idiomatic: 'I say: That is not so.',
  },
  s0616: {
    literal: 'Though "marshal" does mean multitude, that comes from the Erya; as a name for sacrifice, the Offices of Spring gloss it as "array," and the commentary has explicit text.',
    idiomatic: 'Though "marshal" means multitude in the Erya, as a sacrificial term the Offices of Spring glosses it "array"—the commentary is explicit.',
  },
  s0617: {
    literal: 'If as they say marshaling the High God becomes the Five Thearchs, then when the Ji clan marshaled at Mount Tai, could that mean the Four Guardians?',
    idiomatic: 'If marshaling the High God means the Five Thearchs, then when the Ji clan "marshaled" at Mount Tai—was that the Four Guardians?',
  },
  s0618: {
    literal: 'The seventh objection says: They claim to rely on Zheng\'s learning—yet the Jing Emperor\'s kinship is exhausted, temple tablets are merged in the collective shrine, and they still wish him to pair in sacrifice to Heaven and Earth, disordering ancestors and forbears.',
    idiomatic: 'The seventh objection: By Zheng\'s learning the Jing Emperor\'s kinship is exhausted and tablets merged—yet they would have him pair with Heaven and Earth, disordering the ancestral line.',
  },
  s0619: {
    literal: 'The founding ancestor is he who brought order in the primal chaos, whose substance is great and matches Heaven; therefore to rectify the primordial qi\'s vastness and the veneration of all things\' origin, on the day when yang qi first stirs at the summer solstice, both are sacrificed at the southern suburb.',
    idiomatic: 'The founding ancestor brought order from primal chaos—his substance vast as Heaven. To rectify primordial qi and honor the origin of all things, on the day yang first stirs at summer solstice, both are sacrificed at the southern suburb.',
  },
  s0620: {
    literal: 'The beginning of all things is Heaven.',
    idiomatic: 'All things begin with Heaven.',
  },
  s0621: {
    literal: 'The beginning of man is the ancestor.',
    idiomatic: 'Man begins with the ancestor.',
  },
  s0622: {
    literal: 'The beginning of the day is the solstice.',
    idiomatic: 'The day begins at the solstice.',
  },
  s0623: {
    literal: 'Sweeping the ground to sacrifice is simplicity.',
    idiomatic: 'To sweep the ground and sacrifice is simplicity.',
  },
  s0624: {
    literal: 'Using pottery and gourds for vessels is nature.',
    idiomatic: 'Pottery and gourds for vessels is nature.',
  },
  s0625: {
    literal: 'Using calves for victims is sincerity.',
    idiomatic: 'Calves for victims is sincerity.',
  },
  s0626: {
    literal: 'Establishing the altar at the southern suburb is taking the yang position.',
    idiomatic: 'The altar at the southern suburb takes the yang position.',
  },
  s0627: {
    literal: 'Most exalted, most simple—daring not to be the same as former ancestors: that is ritual.',
    idiomatic: 'Most exalted, most simple—daring not share rites with former ancestors: that is ritual.',
  },
  s0628: {
    literal: 'Thus the Comprehensive Discussions on the White Tiger says: "Sacrifice to Heaven once a year—why?"',
    idiomatic: 'Thus the Comprehensive Discussions: "Sacrifice to Heaven once a year—why?"',
  },
  s0629: {
    literal: '"Heaven is most exalted and most simple; in serving it one dares not be irreverent or excessive—therefore one sacrifices when the year\'s yang qi first reaches forth."',
    idiomatic: '"Heaven is most exalted and most simple; one dares not treat it lightly—therefore sacrifice when the year\'s yang qi first reaches forth."',
  },
  s0630: {
    literal: '" Now the state sacrifices four times a year—no excess could be greater.',
    idiomatic: '" Yet the state now sacrifices four times a year—no excess could be greater.',
  },
  s0631: {
    literal: 'Sacrifice to the High God and the Five Thearchs is thereby neglected—negligence is also extreme.',
    idiomatic: 'Sacrifice to the High God and the Five Thearchs is neglected—negligence is also extreme.',
  },
  s0632: {
    literal: 'Excess and negligence are both failures of ritual—not to be unknown.',
    idiomatic: 'Excess and negligence are both ritual failures—not to be ignored.',
  },
  s0633: {
    literal: 'Kinship has limits; ancestors have constants—the sage made ritual, and the gentleman does not alter it for emotion.',
    idiomatic: 'Kinship has limits; ancestors have constants—the sage made ritual; the gentleman does not alter it for feeling.',
  },
  s0634: {
    literal: 'The state has renewed glory through successive sages, with sacrifices numbering in the hundreds—how could it not know that the Jing Emperor was first enfeoffed in Tang?',
    idiomatic: 'The state has renewed glory through successive sages, sacrifices numbering in the hundreds—how could it not know the Jing Emperor was first enfeoffed in Tang?',
  },
  s0635: {
    literal: 'At that time thorough scholars weighed merit and measured virtue, honored Shenyao as fit to pair with that Heaven, and took Taizong as cult-ancestor to pair with the High God.',
    idiomatic: 'Then thorough scholars weighed merit and virtue: Shenyao was honored fit to pair with Heaven; Taizong was cult-ancestor to pair with the High God.',
  },
  s0636: {
    literal: 'The spirits have fixed lords—it has been so long.',
    idiomatic: 'The spirits have had fixed lords for a very long time.',
  },
  s0637: {
    literal: 'Now wishing to demote Shenyao to pair with the Pivot of Heaven, and elevate Taizong to pair with the High God—the Purple Palace\'s five essences are assistants to the High God; to put the son before the father—how is that ritual\'s intent!',
    idiomatic: 'Now to demote Shenyao to pair with the Pivot of Heaven and elevate Taizong to the High God—the five essences of the Purple Palace assist the High God; the son before the father—how is that ritual\'s intent!',
  },
  s0638: {
    literal: 'It is not only that the spirits are misplaced—ancestors too are out of order; how could one answer to the intent of August Heaven and the ancestors!',
    idiomatic: 'Not only are the spirits misplaced—ancestors are out of order. How answer to August Heaven and the ancestors!',
  },
  s0639: {
    literal: 'As for Shenyao\'s merit and Taizong\'s virtue, reaching August Heaven and the High God—in my view suburban and ancestral sacrifice cannot add to them.',
    idiomatic: 'Shenyao\'s merit and Taizong\'s virtue reach August Heaven and the High God—in my view suburban and ancestral rites cannot add to them.',
  },
  s0640: {
    literal: 'The eighth objection says: Wishing to make the Jing Emperor the founding ancestor—yet he is not the lord who made our realm and brought order in primal chaos—therefore he is not of the same merit and virtue as Xia\'s founding ancestor Yu, Shang\'s founding ancestor Qi, Zhou\'s founding ancestor Ji, Han\'s founding ancestor the High Emperor, Wei\'s founding ancestor the Martial Emperor, Jin\'s founding ancestor the August Emperor, or our state\'s founding ancestor the Shenyao Emperor; yet suddenly to raise him upon the round hill of ancestral cult as August Heaven\'s peer—did the round hill mean less than Lin Fang?',
    idiomatic: 'The eighth objection: To make the Jing Emperor founding ancestor—yet he did not forge our realm from primal chaos—he is not Yu, Qi, Ji, the High Emperor, Cao Cao, Sima Yi, or Shenyao in merit. Yet suddenly to raise him on the round hill as August Heaven\'s peer—was the round hill less than Lin Fang?',
  },
  s0641: {
    literal: 'The ninth objection says: What was said yesterday—that Wei Emperor Wen Pi took Emperor Wu Cao as founding ancestor, and Jin Emperor Wu Yan took Emperor Xuan Yi as founding ancestor.',
    idiomatic: 'The ninth objection: Yesterday\'s point—that Wei Wen took Wu Cao as founding ancestor, Jin Wu took Xuan Yi as founding ancestor.',
  },
  s0642: {
    literal: 'Mengde and Zhongda were both towering men.',
    idiomatic: 'Cao Cao and Sima Yi were both men of towering stature.',
  },
  s0643: {
    literal: 'They held the realm\'s strong armies, held Han and Wei\'s feeble lords in their grasp, monopolized power within the seas, commands ran like wind over grass, they wore imperial robes and displayed suspended bells—the Son of Heaven decided affairs in their private quarters, dukes and ministers lined up to bow at the roadside; in name they were subjects, in power they truly overawed their lord.',
    idiomatic: 'They held the realm\'s armies, clutched Han and Wei\'s feeble lords, monopolized the seas—commands ran like wind over grass; they wore imperial robes, displayed suspended bells; the Son of Heaven decided affairs in their private halls, ministers bowed in the road. In name subjects—in power they overawed their lord.',
  },
  s0644: {
    literal: 'Later rulers thereby achieved the imperial enterprise; former kings thereby received abdication—their descendants honor and take them as ancestors—is that not permissible?',
    idiomatic: 'Later rulers thereby became emperors; former kings abdicated to them—their descendants honor them as ancestors—is that not permissible?',
  },
  s0645: {
    literal: 'The tenth objection says: The Shang, Zhou, Wei, and Jin cited are already inapt—then it is clear the Jing Emperor is not a founding ancestor.',
    idiomatic: 'The tenth objection: Shang, Zhou, Wei, and Jin are already inapt—the Jing Emperor is clearly not a founding ancestor.',
  },
  s0646: {
    literal: 'Our Shenyao drew forth from among contending heroes, cleared away the Sui house, and rescued the living from flood and fire—then Xia Yu\'s merit is not worth multiplying;',
    idiomatic: 'Our Shenyao rose from contending heroes, cleared the Sui, rescued the living from flood and fire—Xia Yu\'s merit is not worth multiplying;',
  },
  s0647: {
    literal: 'he completed the imperial enterprise within a few years—then the Han founder\'s merit is not worth comparing.',
    idiomatic: 'he completed the imperial enterprise within a few years—the Han founder\'s merit is not worth comparing.',
  },
  s0648: {
    literal: 'Xia took Great Yu as founding ancestor, Han took the High Emperor as founding ancestor—then our Tang takes Shenyao as founding ancestor; following Xia and Han, what objection in ritual?',
    idiomatic: 'Xia took Yu, Han took the High Emperor—our Tang takes Shenyao; following Xia and Han, what ritual objection?',
  },
  s0649: {
    literal: 'Now wishing to alter August Heaven\'s ritual and change the Grand Ancestor\'s temple—of great affairs none is greater; yet there is no basis whatsoever—how shallow! No shame in the heart, no fear of Heaven?',
    idiomatic: 'Now to alter August Heaven\'s ritual and change the Grand Ancestor\'s temple—of great affairs none is greater; yet no basis whatsoever—how shallow! No shame in the heart, no fear of Heaven?',
  },
  s0650: {
    literal: 'Previously I received an edict ordering each office to fix its deliberation according to the ritual classics.',
    idiomatic: 'Previously I received an edict ordering each office to deliberate according to the ritual classics.',
  },
  s0651: {
    literal: 'I, Gan, unworthily hold a place in the court ranks; my office is named for remonstrance, known for forthrightness, accomplished in learning—I dare not fail to exhaust myself to aid the slightest measure.',
    idiomatic: 'I, Gan, unworthily hold court rank; my office is named for remonstrance, known for forthrightness and learning—I dare not fail to exhaust myself for the slightest measure.',
  },
  s0652: {
    literal: 'Yesterday, the fourteenth, I fully presented my deliberation to the chief ministers; the chief ministers ordered court officials to debate with me.',
    idiomatic: 'Yesterday, the fourteenth, I presented my deliberation to the chief ministers; they ordered court officials to debate with me.',
  },
  s0653: {
    literal: 'Those who objected to me—because my view stood alone—none failed to triumph in words and fly in debate, each competing to shatter my reasoning and clamp my mouth.',
    idiomatic: 'Those who objected—because my view stood alone—none failed to fly at debate, each competing to shatter my reasoning and clamp my mouth.',
  },
  s0654: {
    literal: 'They parsed hair\'s breadths and distinguished sameness and difference, ordered the congealed passages of the classics, pointed to the errors of the masters\' transmissions—every matter returned to its root; nothing encountered was blocked.',
    idiomatic: 'They parsed hair\'s breadths, distinguished sameness and difference, ordered congealed passages of the classics, pointed to errors in the masters\' transmissions—every matter returned to its root; nothing blocked them.',
  },
  s0655: {
    literal: 'Yet my words have a lineage—how could I be of the debaters\' sort!',
    idiomatic: 'Yet my words have a lineage—I am not of the debaters\' sort!',
  },
  s0656: {
    literal: 'Again Gui Chongjing, Xue Yi, and others cited Zheng\'s learning, wishing to overgrow the sacrificial canon; I made clear the debate, but they were lost and did not return.',
    idiomatic: 'Again Gui Chongjing, Xue Yi, and others cited Zheng\'s learning to overgrow the sacrificial canon; I made clear the debate, but they were lost and did not return.',
  },
  s0657: {
    literal: 'I thereupon composed ten interrogations and ten objections, citing the classics and histories—it is plainly knowable.',
    idiomatic: 'I composed ten interrogations and ten objections, citing classics and histories—it is plainly knowable.',
  },
  s0658: {
    literal: 'May suburban and di rites obtain their truth, solemn pairing not lose its order, the imperial numen send blessing, and all under Heaven receive the benefit.',
    idiomatic: 'May suburban and di rites find their truth, solemn pairing keep its order, the imperial numen send blessing, and the realm receive the benefit.',
  },
  s0659: {
    literal: 'What would I not face—would I not tread the cauldron and seething pot?',
    idiomatic: 'What would I not face—would I shrink from the cauldron and seething pot?',
  },
  s0660: {
    literal: 'I respectfully dare report this; prostrate, I am ever more fearful and overwhelmed.',
    idiomatic: 'I respectfully report this; prostrate, I am ever more fearful and overwhelmed.',
  },
  s0661: {
    literal: 'The deliberation was submitted; no response was given.',
    idiomatic: 'The memorial was submitted; the throne did not reply.',
  },
  s0662: {
    literal: 'By the second year, spring and summer brought drought.',
    idiomatic: 'In the second year drought came in spring and summer.',
  },
  s0663: {
    literal: 'Memorialists said: The Grand Ancestor Jing Emperor was posthumously enfeoffed in Tang; the High Ancestor was truly the ancestor who received the Mandate—the hundred spirits received their offices; it should follow the High Ancestor.',
    idiomatic: 'Memorialists said: The Grand Ancestor Jing Emperor was posthumously enfeoffed in Tang; the High Ancestor truly received the Mandate—the hundred spirits took office; rites should follow the High Ancestor.',
  },
  s0664: {
    literal: 'Now he cannot be paired in sacrifice to Heaven and Earth—therefore the spirits do not send blessing, and excess yang results.',
    idiomatic: 'Now he cannot pair with Heaven and Earth—therefore the spirits send no blessing, and excess yang results.',
  },
  s0665: {
    literal: 'Daizong was doubtful and ordered the hundred officials to convene in deliberation.',
    idiomatic: 'Daizong was doubtful and ordered the hundred officials to deliberate.',
  },
  s0666: {
    literal: 'Erudite of the Court of Imperial Sacrifices Du Ji presented a deliberation, saying:',
    idiomatic: 'Court of Imperial Sacrifices Erudite Du Ji presented a deliberation, saying:',
  },
  s0667: {
    literal: '"Ritual: the king di-sacrifices to the ancestor from whom his line issued forth, and pairs his ancestor with him."',
    idiomatic: '"Ritual says: the king di-sacrifices to the ancestor from whom his line issued forth and pairs that ancestor with him."',
  },
  s0668: {
    literal: 'Every lord who received the Mandate at first enfeoffment is the Grand Ancestor.',
    idiomatic: 'Whoever received the Mandate at first enfeoffment is the Grand Ancestor.',
  },
  s0669: {
    literal: 'For the six temples below the Grand Ancestor, when kinship is exhausted they are destroyed in turn.',
    idiomatic: 'Below the Grand Ancestor, six temples—when kinship is exhausted, they are destroyed in turn.',
  },
  s0670: {
    literal: 'But the Grand Ancestor\'s temple, though a hundred generations pass, is not moved.',
    idiomatic: 'But the Grand Ancestor\'s temple is not moved though a hundred generations pass.',
  },
  s0671: {
    literal: 'This is why the Five Thearchs and Three Kings honored ancestors and revered the cult-line.',
    idiomatic: 'Thus the Five Thearchs and Three Kings honored ancestors and revered the cult-line.',
  },
  s0672: {
    literal: 'Thus receiving the Mandate from the Spirit Ancestor was Yu, yet the Xia honored Zhuanxu and suburban-sacrificed to Gun.',
    idiomatic: 'Receiving the Mandate from the Spirit Ancestor was Yu—yet Xia honored Zhuanxu and suburban-sacrificed to Gun.',
  },
  s0673: {
    literal: 'Continuing Yu and deposing Xia was Tang, yet the Yin suburban-sacrificed to Ming and took Qi as cult-ancestor.',
    idiomatic: 'Continuing Yu and deposing Xia was Tang—yet Yin suburban-sacrificed to Ming and took Qi as cult-ancestor.',
  },
  s0674: {
    literal: 'Revolution made Zhou—King Wu—yet Zhou suburban-sacrificed to Ji and took King Wen as cult-ancestor.',
    idiomatic: 'The revolution that made Zhou was King Wu—yet Zhou suburban-sacrificed to Ji and took King Wen as cult-ancestor.',
  },
  s0675: {
    literal: 'Then it is clear that from antiquity the lord of first enfeoffment must pair with August Heaven the High God.',
    idiomatic: 'Then it is clear: from antiquity the lord of first enfeoffment pairs with August Heaven the High God.',
  },
  s0676: {
    literal: 'Only the Han house rose from Feng and Pei—Duke Feng and Grand Duke Tai had neither rank nor merit and could not serve as ancestors; therefore Han took the High Emperor as Grand Ancestor; his forebears were slight.',
    idiomatic: 'Only Han rose from Feng and Pei—Duke Feng and Grand Duke Tai had neither rank nor merit and could not be ancestors; Han took the High Emperor as Grand Ancestor; his forebears were slight.',
  },
  s0677: {
    literal: 'It is not sufficient to be a model for later ages.',
    idiomatic: 'That is not enough to serve as a model for later ages.',
  },
  s0678: {
    literal: 'I consider: the Grand Ancestor Jing Emperor, in the office of Pillar of State, aided Zhou and assisted Wei, first opened the royal enterprise, and was enfeoffed in Tang.',
    idiomatic: 'I consider: Grand Ancestor Jing Emperor, as Pillar of State, aided Zhou and assisted Wei, first opened the royal enterprise, and was enfeoffed in Tang.',
  },
  s0679: {
    literal: 'The High Ancestor followed upon this and took the title of holding all under Heaven—Heaven\'s command.',
    idiomatic: 'The High Ancestor followed and took the title of holding all under Heaven—Heaven\'s command.',
  },
  s0680: {
    literal: 'It is also like Qi\'s enfeoffment in Shang and Hou Ji\'s enfeoffment in Tai.',
    idiomatic: 'It is like Qi\'s enfeoffment in Shang and Hou Ji\'s in Tai.',
  },
  s0681: {
    literal: 'The positions of di, suburb, cult, and ancestor should be in the canon that does not move for a hundred generations.',
    idiomatic: 'The positions of di, suburb, cult, and ancestor belong in the canon that does not move for a hundred generations.',
  },
  s0682: {
    literal: 'Suburban sacrifice to the Grand Ancestor, cult-sacrifice to the High Ancestor—it is like Zhou taking King Wen as cult-ancestor and King Wu as cult-lord.',
    idiomatic: 'Suburban sacrifice to the Grand Ancestor, cult-sacrifice to the High Ancestor—as Zhou took King Wen as cult-ancestor and King Wu as cult-lord.',
  },
  s0683: {
    literal: 'Now if because the High Ancestor founded the enterprise one should elevate his cult, that is abandoning the fine canon of the Three Dynasties, honoring Han\'s late institution, demoting the Jing Emperor\'s great enterprise, and equaling Duke Feng and Grand Duke Tai\'s lack of sacrifice—reversing antiquity and violating the Way; what failure could be greater?',
    idiomatic: 'Now to elevate the High Ancestor\'s cult because he founded the enterprise is to abandon the Three Dynasties\' fine canon, honor Han\'s late institution, demote the Jing Emperor\'s great enterprise, and equal Duke Feng and Grand Duke Tai\'s lack of sacrifice—reversing antiquity; what failure could be greater?',
  },
  s0684: {
    literal: 'Posthumously honoring the Jing Emperor and temple-name Grand Ancestor—that is the rite by which the High Ancestor and Taizong showed lofty honor.',
    idiomatic: 'Posthumously honoring the Jing Emperor as Grand Ancestor—that is how the High Ancestor and Taizong showed lofty honor.',
  },
  s0685: {
    literal: 'If the position of pairing with Heaven is already different, then the title Grand Ancestor should be abolished, sacrifice not maintained, and the temple also destroyed.',
    idiomatic: 'If the position pairing with Heaven differs, the title Grand Ancestor should be abolished, sacrifice abandoned, the temple destroyed.',
  },
  s0686: {
    literal: 'The Way of honoring ancestors and repaying origin—has it fallen to earth!',
    idiomatic: 'The Way of honoring ancestors and repaying origin—will it fall to earth!',
  },
  s0687: {
    literal: 'Han statute: presuming to deliberate the ancestral temples was judged great irreverence.',
    idiomatic: 'Under Han law, presuming to debate the ancestral temples was great irreverence.',
  },
  s0688: {
    literal: 'Now the Wude and Zhenguan statutes are unaltered; the state is about to respectfully perform sacrifice and harmonize spirits and men—between di and suburb, perhaps it is not suitable.',
    idiomatic: 'Wude and Zhenguan statutes stand unaltered; the state is about to sacrifice and harmonize spirits and men—between di and suburb, perhaps it is not suitable.',
  },
  s0689: {
    literal: 'Your servant respectfully examines ritual texts and compares former institutions, and asks that the old canon remain.',
    idiomatic: 'Your servant examines ritual texts and former institutions and asks that the old canon remain.',
  },
  s0690: {
    literal: 'In the end they followed Gui Chongjing and others\' deliberation, taking the Grand Ancestor as paired in sacrifice to Heaven and Earth.',
    idiomatic: 'In the end they followed Gui Chongjing and others— the Grand Ancestor paired with Heaven and Earth.',
  },
  s0691: {
    literal: 'On the sixteenth day of the first month of the second year of Guangde, Rites Commissioner Du Hongjian memorialized: "Suburban and Grand Temple rites are great ceremonies; from now on for prayer texts, please follow Tang ritual and write in ink on boards."',
    idiomatic: 'Sixteenth day, first month, Guangde year 2: Rites Commissioner Du Hongjian memorialized: "Suburban and Grand Temple are great ceremonies; prayer texts hereafter should follow Tang ritual—ink on boards."',
  },
  s0692: {
    literal: 'Jade slips with golden characters—all are to be discontinued.',
    idiomatic: 'Jade slips with golden characters—all discontinued.',
  },
  s0693: {
    literal: '"If Your Majesty approves my memorial, I hope it may be compiled as a standing regulation."',
    idiomatic: '"If approved, I hope it may be compiled as standing regulation."',
  },
  s0694: {
    literal: 'An edict said: "Bamboo slips should be used."',
    idiomatic: 'The edict said: "Use bamboo slips."',
  },
  s0695: {
    literal: 'The edict concluded."',
    idiomatic: 'The edict closed.',
  },
  s0696: {
    literal: 'On the eleventh day of the eleventh month of the first year of Zhenyuan, Dezong personally sacrificed at the southern suburb.',
    idiomatic: 'Eleventh month, eleventh day, Zhenyuan year 1: Dezong personally sacrificed at the southern suburb.',
  },
  s0697: {
    literal: 'The relevant offices presented diagrams; an edict ordered them delivered to ritual officials for detailed deliberation.',
    idiomatic: 'The relevant offices presented diagrams; an edict ordered ritual officials to deliberate.',
  },
  s0698: {
    literal: 'Erudite Liu Mian memorialized, saying: "The Kaiyuan fixed ritual is engraved and shall not be altered."',
    idiomatic: 'Erudite Liu Mian memorialized: "The Kaiyuan fixed ritual is engraved and shall not be altered."',
  },
  s0699: {
    literal: '"The Tianbao revisions arose from expedient regulation—these are all the wild sayings of masters of the methods, not texts of the ritual canon; I ask that everything follow the Kaiyuan Rites."',
    idiomatic: '"Tianbao revisions arose from expedient regulation—wild sayings of masters of the methods, not ritual canon; let all follow the Kaiyuan Rites."',
  },
  s0700: {
    literal: '" It was approved.',
    idiomatic: '" Approved.',
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
