#!/usr/bin/env node
import fs from 'node:fs';

const CHAPTER_PATH = 'data/jinshu/061.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-jinshu.json';
const ITEM_ID = 'source-jinshu-061-wikisource-8cbde32cb68e';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const rows = [
  {
    zh: '殿中校尉李初至，奉被手詔，肝心若裂。',
    literal: 'Palace Commandant Li has just arrived, and I have received and read the handwritten edict; my liver and heart feel as if split apart.',
    idiomatic: 'Palace Commandant Li has just arrived with Your Majesty’s handwritten edict. Reading it, I felt my heart and liver split apart.',
  },
  {
    zh: '東海王越得以宗臣遂執朝政，委任邪佞，寵樹奸黨，至使前長史潘滔、從事中郎畢邈、主簿郭象等操弄天權，刑賞由己。',
    literal: 'The Prince of Donghai, Yue, as a kinsman-minister, was able thereafter to grasp court government; he entrusted affairs to the wicked and flattering, favored and planted treacherous factions, and went so far as to have former Chief Clerk Pan Tao, Staff Supervisor Bi Miao, Registrar Guo Xiang, and others manipulate Heaven’s authority, with punishments and rewards coming from themselves.',
    idiomatic: 'Sima Yue, Prince of Donghai, used his position as a kinsman-minister to seize court government. He entrusted affairs to villains and flatterers, fostered treacherous cliques, and let Pan Tao, Bi Miao, Guo Xiang, and others manipulate imperial authority, dispensing punishments and rewards as they pleased.',
  },
  {
    zh: '尚書何綏、中書令繆播、太僕繆胤、黃門侍郎應紹，皆是聖詔親所抽拔，而滔等妄構，陷以重戮。',
    literal: 'Master of Writing He Sui, Palace Secretariat Director Miao Bo, Grand Coachman Miao Yin, and Yellow Gate Attendant Ying Shao were all personally selected and promoted by the sage edict, yet Tao and the others falsely framed them and trapped them in severe execution.',
    idiomatic: 'He Sui, Miao Bo, Miao Yin, and Ying Shao had all been personally selected and promoted by Your Majesty, yet Pan Tao and the others fabricated charges and had them condemned to heavy punishment.',
  },
  {
    zh: '帶甲臨宮，誅討後弟，翦除宿衛，私樹國人。',
    literal: 'They brought armored men to the palace, executed and attacked the empress’s younger brother, cut away the palace guards, and privately planted men of their own state.',
    idiomatic: 'They brought armored troops to the palace, killed the empress’s brother, removed the palace guard, and installed their own men.',
  },
  {
    zh: '崇獎魏植，招誘逋亡，覆喪州郡。',
    literal: 'They exalted and rewarded Wei Zhi, summoned and enticed fugitives, and overturned and destroyed provinces and commanderies.',
    idiomatic: 'They exalted Wei Zhi, enticed fugitives to their side, and brought ruin on provinces and commanderies.',
  },
  {
    zh: '王途圮隔，方貢乖絕，宗廟闕蒸嘗之饗，聖上有約食之匱。',
    literal: 'The royal road is collapsed and cut off; regional tribute is severed; the ancestral temple lacks the seasonal offerings; the sage sovereign suffers the want of restricted meals.',
    idiomatic: 'The royal roads are broken, regional tribute is cut off, the ancestral temple lacks its seasonal offerings, and Your Majesty is reduced to scant meals.',
  },
  {
    zh: '鎮東將軍周馥、豫州刺史馮嵩、前北中郎將裴憲，並以天朝空曠，權臣專制，事難之興，慮在旦夕，各率士馬，奉迎皇輿，思隆王室，以盡臣禮。',
    literal: 'General Who Guards the East Zhou Fu, Inspector of Yu Province Feng Song, and former Northern General of the Gentlemen Pei Xian all, because the heavenly court was empty and broad, powerful ministers monopolized control, and the rise of difficult affairs was feared at any dawn or evening, each led soldiers and horses to welcome the imperial carriage, thinking to exalt the royal house and fulfill the rites of ministers.',
    idiomatic: 'Zhou Fu, Feng Song, and Pei Xian saw the court emptied, powerful ministers monopolizing authority, and crisis liable to break out at any moment. Each led troops to welcome the imperial carriage, intending to strengthen the royal house and fulfill a minister’s duty.',
  },
  {
    zh: '而滔、邈等劫越出關，矯立行台，逼徙公卿，擅為詔令，縱兵寇抄，茹食居人，交屍塞路，暴骨盈野。',
    literal: 'But Tao, Miao, and the others forced Yue out through the passes, falsely established a field headquarters, compelled the ministers and nobles to move, arbitrarily made edicts and orders, released troops to raid and plunder, devoured the resident people, left crossing corpses blocking the roads, and exposed bones filling the fields.',
    idiomatic: 'But Pan Tao, Bi Miao, and their faction forced Yue through the passes, set up a false field administration, drove ministers and nobles to move, issued edicts on their own authority, and unleashed soldiers to raid and plunder. Corpses choked the roads and exposed bones filled the fields.',
  },
  {
    zh: '遂令方鎮失職，城邑蕭條，淮豫之萌，陷離塗炭。',
    literal: 'Thus they caused regional commands to lose their functions, cities and towns to become desolate, and the people of Huai and Yu to fall into mire and ashes.',
    idiomatic: 'They caused regional commands to fail in their duties, cities and towns to fall desolate, and the people of Huai and Yu to sink into misery.',
  },
  {
    zh: '臣雖憤懣，守局東顒，自奉明詔，三軍奮厲，卷甲長驅，次於倉垣。',
    literal: 'Although your servant was indignant, I kept to my station east at Yong; since receiving the clear edict, the three armies have roused themselves fiercely, rolled up armor, driven far, and halted at Cangyuan.',
    idiomatic: 'Though indignant, I held my assigned post in the east. Since receiving the clear edict, the armies have been roused, packed their armor, marched hard, and encamped at Cangyuan.',
  },
  {
    zh: '即日承司空、博陵公浚書，稱殿中中郎劉權齎詔，敕浚與臣共克大舉。',
    literal: 'That same day I received a letter from Sikong and Duke of Boling Jun, saying that Palace Gentleman Liu Quan had brought an edict ordering Jun and your servant together to accomplish the great undertaking.',
    idiomatic: 'That same day I received a letter from Jun, Sikong and Duke of Boling, saying that Palace Gentleman Liu Quan had brought an edict ordering Jun and me to carry out the great undertaking together.',
  },
  {
    zh: '輒遣前鋒征虜將軍王贊徑至項城，使越稽首歸政，斬送滔等。',
    literal: 'I thereupon sent Vanguard General Who Campaigns Against Caitiffs Wang Zan straight to Xiangcheng, to make Yue bow his head and return government, and to behead and send Tao and the others.',
    idiomatic: 'I have therefore sent Wang Zan, Vanguard General Who Campaigns Against Caitiffs, straight to Xiangcheng to make Yue bow and return authority, and to behead Pan Tao and the others and send them in.',
  },
  {
    zh: '伏願陛下寬宥宗臣，聽越還國。',
    literal: 'I prostrate myself and wish that Your Majesty broadly pardon the kinsman-minister and allow Yue to return to his state.',
    idiomatic: 'I humbly ask Your Majesty to pardon this kinsman-minister and allow Yue to return to his principality.',
  },
  {
    zh: '其餘逼迫，宜蒙曠蕩。',
    literal: 'The others who were coerced should receive broad and sweeping amnesty.',
    idiomatic: 'The others who acted under coercion should receive broad amnesty.',
  },
  {
    zh: '輒寫詔宣示征鎮，顯明義舉。',
    literal: 'I have copied the edict and proclaimed it to the campaign and garrison commands, making clear the righteous undertaking.',
    idiomatic: 'I have copied the edict and circulated it among the campaign and garrison commands, making the righteous undertaking clear.',
  },
  {
    zh: '遣揚烈將軍閻弘步騎五千，鎮衛宗廟。',
    literal: 'I have sent General Who Displays Ferocity Yan Hong with five thousand infantry and cavalry to guard and defend the ancestral temple.',
    idiomatic: 'I have sent Yan Hong, General Who Displays Ferocity, with five thousand infantry and cavalry to guard the ancestral temple.',
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
      item.notes = 'Inserted the omitted Gou Xi memorial after s0274 and added manual English translations for every restored sentence.';
      item.reviewer = 'manual-repair';
      item.reviewedAt = now;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'manual-source-omission-insert',
        inserted: rows.length,
        afterId: 's0274',
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
  block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0274'),
);
if (anchorIndex < 0) throw new Error('Could not find s0274 anchor.');
if (chapter.content.some((block) => block.sentences?.some((sentence) => sentence.zh === rows[0].zh))) {
  throw new Error('Fourth omission already appears to be inserted.');
}

renumberIds(chapter, 275, rows.length);
chapter.content.splice(anchorIndex + 1, 0, {
  type: 'paragraph',
  sentences: rows.map((row, index) => sentenceUnit(row, 275 + index)),
});
updateMeta(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
shiftQueueLocations(queue, 275, 271, rows.length);
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Inserted ${rows.length} omitted jinshu/061 sentences after s0274.`);
