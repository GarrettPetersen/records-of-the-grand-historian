#!/usr/bin/env node
import fs from 'node:fs';

const CHAPTER_PATH = 'data/jinshu/061.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-jinshu.json';
const ITEM_ID = 'source-jinshu-061-wikisource-24a8fb78fdc0';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const rows = [
  {
    zh: '臣亡兄顗，昔蒙先帝顧眄之施，特垂表啟，以參戎佐，顯居上列，遂管朝政，並與群後共隆中興，仍典選曹，重蒙寵授，忝位師傅，得與陛下揖讓抗禮，恩結特隆。',
    literal: 'My deceased elder brother Yi formerly received the favor of the late emperor’s regard; he was specially recommended by memorial and petition to participate in military assistance, conspicuously occupied a high rank, then managed court government, joined with the other lords in exalting the restoration, and further administered the personnel office. He again received favored appointment, unworthily occupied the position of tutor, and was able to bow and yield with Your Majesty as an equal in ritual; the bond of favor was especially great.',
    idiomatic: 'My late elder brother Yi once received the late emperor’s special regard. He was recommended for military service, placed prominently among the highest ranks, took part in court government, joined the other lords in strengthening the restoration, and then administered personnel selection. Again favored by appointment, he unworthily served as tutor and was allowed to meet Your Majesty in rites of mutual courtesy. The bond of favor was exceptionally deep.',
  },
  {
    zh: '加以鄙族結婚帝室，義深任重，庶竭股肱，以報所受。',
    literal: 'Moreover, my humble clan formed a marriage connection with the imperial house; the obligation was deep and the responsibility heavy, and we hoped to exhaust arm and thigh in order to repay what we had received.',
    idiomatic: 'Moreover, our humble clan was joined in marriage to the imperial house. Our duty was deep and our responsibility heavy, and we hoped to spend every limb in repayment of what we had received.',
  },
  {
    zh: '凶逆所忌，惡直醜正。',
    literal: 'What the wicked rebels feared was uprightness; they hated the straight and detested the correct.',
    idiomatic: 'The wicked rebels feared uprightness, hating the straight and despising the correct.',
  },
  {
    zh: '身陷極禍，忠不忘君，守死善道，有隕無二。',
    literal: 'His body fell into extreme disaster, yet in loyalty he did not forget his ruler; keeping to the good Way until death, he could fall but would not be double-minded.',
    idiomatic: 'Though he fell into utter disaster, his loyalty never forgot his ruler. He held to the good Way until death; he could be destroyed, but he could not be divided.',
  },
  {
    zh: '顗之雲亡，誰不痛心，況臣同生，能不哀結！',
    literal: 'When Yi was said to have perished, who did not feel pain in the heart? How much more I, born of the same parents; how could grief not bind me!',
    idiomatic: 'When Yi perished, who was not heartsick? How much more I, his own brother; how could I not be knotted with grief!',
  },
  {
    zh: '王敦無君，由來實久，元惡之甚，古今無二。',
    literal: 'Wang Dun had no ruler in his heart; this had in fact been so for a long time. The extremity of his chief evil has no equal in antiquity or today.',
    idiomatic: 'Wang Dun had long acted as if he had no sovereign. As a chief villain, he has no equal in past or present.',
  },
  {
    zh: '幸賴陛下聖聰神武，故能摧破凶強，撥亂反正，以甯區宇。',
    literal: 'Fortunately, relying on Your Majesty’s sage intelligence and divine martial power, you were able to smash the fierce and strong, dispel disorder and return to correctness, and pacify the realm.',
    idiomatic: 'Fortunately, Your Majesty’s sage discernment and divine military power smashed the violent strongman, reversed disorder, restored right order, and pacified the realm.',
  },
  {
    zh: '前軍事之際，聖恩不遺，取顗息閔，得充近侍。',
    literal: 'Earlier, at the time of military affairs, sage grace did not abandon us: you took Yi’s son Min and allowed him to serve among the close attendants.',
    idiomatic: 'Earlier, during the military crisis, Your Majesty’s grace did not forget us: Yi’s son Min was taken into service as a close attendant.',
  },
  {
    zh: '臣時面啟，欲令閔還襲臣亡父侯爵。',
    literal: 'At that time I petitioned in person, wishing to have Min return to inherit the marquisate of my deceased father.',
    idiomatic: 'At the time I petitioned in person, asking that Min be allowed to return and inherit my late father’s marquisate.',
  },
  {
    zh: '時卞壼、庾亮並侍御坐，壼云：「事了當論顯贈。',
    literal: 'At the time Bian Kun and Yu Liang were both attending in the imperial presence; Kun said: “When the matter is over, conspicuous posthumous honors should be discussed.',
    idiomatic: 'Bian Kun and Yu Liang were then both in attendance before the throne, and Kun said: “When the matter is finished, we should discuss a conspicuous posthumous honor.',
  },
  {
    zh: '」時未淹久，言猶在耳。',
    literal: '” It has not yet been long since then, and the words are still in my ears.',
    idiomatic: '” Not much time has passed; those words are still in my ears.',
  },
  {
    zh: '至於譙王承、甘卓，已蒙清復，王澄久遠，猶在論議。',
    literal: 'As for Prince Cheng of Qiao and Gan Zhuo, they have already received clear restoration; Wang Cheng’s case was long ago and distant, yet is still under discussion.',
    idiomatic: 'Prince Cheng of Qiao and Gan Zhuo have already been cleared and restored. Even Wang Cheng’s older, more remote case is still being discussed.',
  },
  {
    zh: '況顗忠以衛主，身死王事，雖嵇紹之不違難，何以過之！',
    literal: 'How much more Yi, who in loyalty defended his ruler and died in the king’s affairs; even Ji Shao’s not avoiding danger, how could it surpass him!',
    idiomatic: 'How much more Yi, who loyally defended his ruler and died in royal service. Even Ji Shao’s refusal to flee danger could not surpass him.',
  },
  {
    zh: '至今不聞復封加贈褒顯之言。',
    literal: 'Yet to this day I have not heard words of restoring his fief, adding posthumous honors, praising him, and making him conspicuous.',
    idiomatic: 'Yet to this day I have heard no word of restoring his fief, adding posthumous honors, and making his merit known.',
  },
  {
    zh: '不知顗有餘責，獨負殊恩，為朝廷急於時務，不暇論及？',
    literal: 'I do not know whether Yi has some remaining blame and alone fails to receive special grace, or whether the court is pressed by current affairs and has had no leisure to discuss him.',
    idiomatic: 'I do not know whether some remaining fault is being charged to Yi alone, depriving him of special grace, or whether the court is simply too pressed by urgent business to take up the matter.',
  },
  {
    zh: '此臣所以痛心疾首，重用哀歎者也。',
    literal: 'This is why your servant pains his heart and aches his head, and again grieves and sighs.',
    idiomatic: 'This is why my heart aches, my head pains me, and I grieve and sigh all the more.',
  },
  {
    zh: '不勝辛酸，冒陳愚款。',
    literal: 'Unable to bear my bitterness and sorrow, I risk presenting my foolish sincerity.',
    idiomatic: 'Unable to bear the bitterness, I risk setting out my foolish but sincere plea.',
  },
];

function sentenceUnit(row, idNumber) {
  return {
    id: `s${String(idNumber).padStart(4, '0')}`,
    zh: row.zh,
    translations: [
      {
        lang: 'en',
        literal: row.literal,
        idiomatic: row.idiomatic,
        translator: TRANSLATOR,
        model: MODEL,
        reviewed: true,
      },
    ],
  };
}

function walkSentences(chapter, fn) {
  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' || !Array.isArray(block.sentences)) continue;
    for (const sentence of block.sentences) fn(sentence);
  }
}

function renumberIds(chapter, shiftFrom, delta) {
  walkSentences(chapter, (sentence) => {
    const match = String(sentence.id || '').match(/^s(\d+)$/u);
    if (match && Number(match[1]) >= shiftFrom) {
      sentence.id = `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
    }
  });
}

function updateMeta(chapter) {
  let count = 0;
  walkSentences(chapter, () => {
    count += 1;
  });
  chapter.meta.sentenceCount = count;
  chapter.meta.translatedCount = count;
}

function shiftQueueLocations(queue, shiftFromId, shiftFromIndex, delta) {
  const items = Array.isArray(queue) ? queue : queue.items;
  const now = new Date().toISOString();
  for (const item of items) {
    if (item.book !== 'jinshu' || String(item.chapter).padStart(3, '0') !== '061') continue;
    if (item.id === ITEM_ID) {
      item.status = 'applied';
      item.decision = 'included';
      item.notes = 'Inserted the omitted Zhou Mo memorial after s0112 and added manual English translations for every restored sentence.';
      item.reviewer = 'manual-repair';
      item.reviewedAt = now;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'manual-source-omission-insert',
        inserted: rows.length,
        afterId: 's0112',
      };
      continue;
    }

    const range = item.localRange;
    if (!range) continue;
    if (Number.isInteger(range.startIndex) && range.startIndex >= shiftFromIndex) range.startIndex += delta;
    if (Number.isInteger(range.endIndex) && range.endIndex >= shiftFromIndex) range.endIndex += delta;
    if (Array.isArray(range.ids)) {
      range.ids = range.ids.map((id) => {
        const match = String(id).match(/^s(\d+)$/u);
        if (!match || Number(match[1]) < shiftFromId) return id;
        return `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
      });
    }
    if (Array.isArray(range.locations)) {
      for (const loc of range.locations) {
        const match = String(loc.id || '').match(/^s(\d+)$/u);
        if (match && Number(match[1]) >= shiftFromId) {
          loc.id = `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
        }
      }
    }
  }
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));
const anchorIndex = chapter.content.findIndex((block) =>
  block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0112'),
);
if (anchorIndex < 0) throw new Error('Could not find s0112 anchor.');
if (chapter.content.some((block) => block.sentences?.some((sentence) => sentence.zh === rows[0].zh))) {
  throw new Error('Second omission already appears to be inserted.');
}

renumberIds(chapter, 113, rows.length);
chapter.content.splice(anchorIndex + 1, 0, {
  type: 'paragraph',
  sentences: rows.map((row, index) => sentenceUnit(row, 113 + index)),
});
updateMeta(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
shiftQueueLocations(queue, 113, 110, rows.length);
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Inserted ${rows.length} omitted jinshu/061 sentences after s0112.`);
