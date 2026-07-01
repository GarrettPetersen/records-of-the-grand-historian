#!/usr/bin/env node
import fs from 'node:fs';

const CHAPTER_PATH = 'data/jinshu/061.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-jinshu.json';
const ITEM_ID = 'source-jinshu-061-wikisource-d5633526d535';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const rows = [
  {
    zh: '「天步艱險，禍難殷流，劉元海造逆于汾陰，石世龍階亂于三魏，薦食畿甸，覆喪鄴都，結壘近郊，仍震兗豫，害三刺史，殺二都督，郡守官長，堙沒數十，百姓流離，肝腦塗地。',
    literal: '“The course of Heaven is difficult and perilous, and calamity flows abundantly: Liu Yuanhai has made rebellion at Fenyin, Shi Shilong has climbed into disorder in the Three Wei, they have repeatedly devoured the royal domain, overturned and destroyed Ye, built ramparts near the suburbs, further shaken Yan and Yu, harmed three inspectors, killed two commanders, and commandery governors and officials by the dozens have been buried and lost; the common people are scattered, their livers and brains smeared on the ground.',
    idiomatic: '“The course of Heaven is perilous, and disaster spreads in full flood. Liu Yuanhai has rebelled at Fenyin; Shi Shilong has raised disorder in the Three Wei. They have repeatedly consumed the royal domain, destroyed Ye, built camps near the suburbs, shaken Yan and Yu, killed three inspectors and two commanders, and wiped out scores of commandery and county officials. The people are displaced, their bodies strewn in slaughter.',
  },
  {
    zh: '晞以虛薄，負荷國重，是以弭節海隅，援枹曹衛。',
    literal: 'I, Xi, with emptiness and slightness, bear the state’s weight; therefore I have halted my carriage by the sea’s corner and grasped the drumstick to defend Cao and Wei.',
    idiomatic: 'I, Xi, though hollow and meager, bear a heavy charge for the state; for this reason I have halted on the seacoast and taken up the drumstick to defend Cao and Wei.',
  },
  {
    zh: '猥被中詔，委以關東，督統諸軍，欽承詔命。',
    literal: 'Undeservedly receiving an inner edict, I was entrusted with the lands east of the passes, to command and direct all armies; I reverently accepted the imperial command.',
    idiomatic: 'By undeserved imperial edict I was entrusted with the lands east of the passes and ordered to command the armies; I reverently accepted the command.',
  },
  {
    zh: '克今月二日，當西經濟黎陽，即日得榮陽太守丁嶷白事，李惲、陳午等救懷諸軍與羯大戰，皆見破散。',
    literal: 'On the second day of this month, as I was to pass westward across at Liyang, that same day I received a report from Ding Yi, Administrator of Rongyang, saying that the armies of Li Yun, Chen Wu, and others who went to rescue Huai fought a great battle with the Jie and were all defeated and scattered.',
    idiomatic: 'On the second day of this month, as I was about to cross westward at Liyang, I received a report from Ding Yi, administrator of Rongyang: the armies under Li Yun, Chen Wu, and others that had gone to relieve Huai fought a major battle with the Jie and were all broken and scattered.',
  },
  {
    zh: '懷城已陷，河內太守裴整為賊所執。',
    literal: 'Huai city has already fallen, and Pei Zheng, Administrator of Henei, has been seized by the bandits.',
    idiomatic: 'Huai has already fallen, and Pei Zheng, administrator of Henei, has been captured by the rebels.',
  },
  {
    zh: '宿衛闕乏，天子蒙難，宗廟之危，甚於累卵。',
    literal: 'The palace guards are deficient and lacking, the Son of Heaven suffers disaster, and the danger to the ancestral temple is worse than piled eggs.',
    idiomatic: 'The palace guard is depleted, the Son of Heaven is in peril, and the ancestral temple is in danger more fragile than stacked eggs.',
  },
  {
    zh: '承問之日，憂歎累息。',
    literal: 'On the day I received the news, I worried and sighed again and again.',
    idiomatic: 'From the day I received the news, I have sighed in anxious grief again and again.',
  },
  {
    zh: '晞以為先王選建明德，庸以服章，所以籓固王室，無俾城壞。',
    literal: 'I, Xi, believe that the former kings selected and established men of bright virtue and used them with emblems of rank in order to fence and secure the royal house and not let the city walls collapse.',
    idiomatic: 'I believe the former kings selected men of manifest virtue and honored them with rank so they might fence and secure the royal house and keep its walls from falling.',
  },
  {
    zh: '是以舟楫不固，齊桓責楚；',
    literal: 'Therefore, when boats and oars were not made secure, Duke Huan of Qi reproached Chu;',
    idiomatic: 'Thus, when boats and oars were not supplied securely, Duke Huan of Qi held Chu to account;',
  },
  {
    zh: '襄王逼狄，晉文致討。',
    literal: 'when King Xiang was pressed by the Di, Duke Wen of Jin brought punishment.',
    idiomatic: 'and when King Xiang was pressed by the Di, Duke Wen of Jin came to punish them.',
  },
  {
    zh: '夫翼獎皇家，宣力本朝，雖陷湯火，大義所甘。',
    literal: 'To assist and encourage the imperial house and exert strength for the present court—even if one falls into boiling water and fire, great righteousness finds it sweet.',
    idiomatic: 'To uphold the imperial house and spend one’s strength for this court is a great duty; even boiling water and fire should be accepted gladly.',
  },
  {
    zh: '加諸方牧，俱受榮寵，義同畢力，以報國恩。',
    literal: 'Moreover, all regional governors have received glory and favor; in righteousness they should together exhaust their strength to repay the state’s grace.',
    idiomatic: 'All regional governors have received honor and favor; by duty they should spend their strength together to repay the state’s grace.',
  },
  {
    zh: '晞雖不武，首啟戎行，秣馬裹糧，以俟方鎮。',
    literal: 'Although I, Xi, am not martial, I first opened the military march, fed the horses and wrapped provisions, to await the regional commands.',
    idiomatic: 'Though I am no warrior, I have been first to open the campaign, feeding horses and packing provisions while awaiting the regional commands.',
  },
  {
    zh: '凡我同盟，宜同赴救。',
    literal: 'All who share our covenant should together go to the rescue.',
    idiomatic: 'All who are bound in our common cause should go together to the rescue.',
  },
  {
    zh: '顯立名節，在此行矣。」',
    literal: 'The chance to manifest and establish name and integrity lies in this campaign.”',
    idiomatic: 'This campaign is where name and integrity will be made manifest.”',
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
      item.notes = 'Inserted the omitted Gou Xi circular after s0252 with manual English translations; restored the logically required closing quote at the end of the circular.';
      item.reviewer = 'manual-repair';
      item.reviewedAt = now;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'manual-source-omission-insert',
        inserted: rows.length,
        afterId: 's0252',
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
  block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0252'),
);
if (anchorIndex < 0) throw new Error('Could not find s0252 anchor.');
if (chapter.content.some((block) => block.sentences?.some((sentence) => sentence.zh === rows[0].zh))) {
  throw new Error('Third omission already appears to be inserted.');
}

renumberIds(chapter, 253, rows.length);
chapter.content.splice(anchorIndex + 1, 0, {
  type: 'paragraph',
  sentences: rows.map((row, index) => sentenceUnit(row, 253 + index)),
});
updateMeta(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
shiftQueueLocations(queue, 253, 249, rows.length);
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Inserted ${rows.length} omitted jinshu/061 sentences after s0252.`);
