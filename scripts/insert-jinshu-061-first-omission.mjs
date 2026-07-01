#!/usr/bin/env node
import fs from 'node:fs';

const CHAPTER_PATH = 'data/jinshu/061.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-jinshu.json';
const ITEM_ID = 'source-jinshu-061-wikisource-179c7d54a713';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const rows = [
  {
    zh: '臣聞明君思隆其道，故賢智之士樂在其朝；',
    literal: 'Your servant has heard that when an enlightened ruler thinks to exalt his Way, worthy and wise men therefore delight in being at his court;',
    idiomatic: 'I have heard that when an enlightened ruler seeks to exalt his Way, worthy and wise men are glad to serve at his court;',
  },
  {
    zh: '忠臣將明其節，故量時而後仕。',
    literal: 'when loyal ministers mean to make clear their integrity, they therefore measure the times and only afterward take office.',
    idiomatic: 'when loyal ministers mean to make their integrity clear, they weigh the times before taking office.',
  },
  {
    zh: '樂在其朝，故無過任之譏；',
    literal: 'Because they delight in being at his court, there is no criticism that they have been appointed beyond measure;',
    idiomatic: 'Because they are glad to serve at his court, no one faults their appointment as excessive;',
  },
  {
    zh: '將明其節，故無過寵之謗。',
    literal: 'because they mean to make clear their integrity, there is no slander that favor has gone too far.',
    idiomatic: 'because they seek to make their integrity clear, no one slanders their favor as undue.',
  },
  {
    zh: '是以君臣並隆，功格天地。',
    literal: 'For this reason ruler and ministers are both exalted, and their achievement reaches Heaven and Earth.',
    idiomatic: 'Thus ruler and ministers rise together, and their achievement reaches Heaven and Earth.',
  },
  {
    zh: '近代以來，德廢道衰，君懷術以禦臣，臣挾利以事君，君臣交利而禍亂相尋，故得失之跡難可詳言。',
    literal: 'Since recent ages, virtue has been abandoned and the Way has declined; rulers harbor techniques to control ministers, and ministers hold profit in serving rulers; ruler and minister exchange advantage, and calamity and disorder follow one another, so the traces of gain and loss are difficult to describe in detail.',
    idiomatic: 'In recent ages virtue has been discarded and the Way has declined. Rulers use techniques to control ministers, ministers serve rulers for advantage, and as ruler and minister trade in profit, disaster follows disorder. The record of success and failure is therefore hard to recount fully.',
  },
  {
    zh: '臣請較而明之。',
    literal: 'Your servant asks to compare them and make the matter clear.',
    idiomatic: 'I ask leave to set out the comparison clearly.',
  },
  {
    zh: '夫傅說之相高宗，申召之輔宣王，管仲之佐齊桓，衰范之翼晉文，或宗師其道，垂拱受成，委以權重，終至匡主，未有憂其逼己，還為國蠹者也。',
    literal: 'Now when Fu Yue served as minister to Gaozong, Shen and Shao assisted King Xuan, Guan Zhong aided Duke Huan of Qi, and Sui and Fan supported Duke Wen of Jin, in some cases the ruler honored their Way as teacher and model, folded his hands and received completed success, and entrusted them with weighty authority, until they corrected and supported their lords; there was never one who feared that they would press upon himself and instead become worms in the state.',
    idiomatic: 'When Fu Yue served Gaozong, Shen and Shao assisted King Xuan, Guan Zhong aided Duke Huan of Qi, and Sui and Fan supported Duke Wen of Jin, their rulers honored their Way, entrusted them with great authority, and sat back while success was brought to completion. These ministers ultimately upheld their lords; none was feared as a threat who would become a parasite on the state.',
  },
  {
    zh: '始田氏擅齊，王莽篡漢，皆藉封土之強，假累世之寵，因暗弱之主，資母后之權，樹比周之黨，階絕滅之勢，然後乃能行其私謀，以成篡奪之禍耳。',
    literal: 'When the Tian clan first usurped Qi and Wang Mang usurped Han, both relied on the strength of enfeoffed territory, borrowed favor accumulated over generations, took advantage of benighted and weak rulers, drew on the authority of empress dowagers, planted factions of collusion, and climbed the momentum of extinction and destruction; only afterward could they carry out their private schemes and complete the disaster of usurpation.',
    idiomatic: 'When the Tian clan seized Qi and Wang Mang usurped Han, they relied on powerful fiefs, generations of favor, weak and benighted rulers, the authority of empress dowagers, collusive factions, and a momentum of collapse. Only then could they carry out private schemes and bring usurpation to pass.',
  },
  {
    zh: '豈遇立功之主，為天人所相，而能運其奸計，以濟其不軌者哉！',
    literal: 'How could they, encountering a lord who had established merit and was aided by Heaven and men, have been able to move their treacherous schemes and accomplish their lawless designs!',
    idiomatic: 'Had they faced a ruler of proven achievement, aided by Heaven and men, how could their treacherous schemes ever have succeeded!',
  },
  {
    zh: '光武以王族奮于閭閻，因時之望，收攬英奇，遂續漢業，以美中興之功。',
    literal: 'Guangwu, as a member of the royal clan, rose from the lanes and hamlets; relying on the hopes of the time, he gathered heroes and extraordinary men, thereby continued the Han enterprise, and beautified the achievement of restoration.',
    idiomatic: 'Guangwu rose from common streets as a member of the imperial clan; answering the hopes of the age, he gathered outstanding men, restored the Han enterprise, and made glorious the work of renewal.',
  },
  {
    zh: '及天下既定，頗廢黜功臣者，何哉？',
    literal: 'When the realm had already been settled, why was it that he rather dismissed and reduced meritorious ministers?',
    idiomatic: 'Why, once the realm was settled, did he dismiss or demote so many men of merit?',
  },
  {
    zh: '武力之士不達國體，以立一時之功，不可久假以權勢，其興廢之事，亦可見矣。',
    literal: 'Men of military force do not understand the body of the state; because they establish merit for a single time, they cannot long be lent authority and power; the matter of their rise and dismissal can also be seen from this.',
    idiomatic: 'Men of force do not understand the larger structure of the state. Their merit is made in a single moment, and authority cannot be lent to them for long; this explains their rise and removal.',
  },
  {
    zh: '近者三國鼎峙，並以雄略之才，命世之能，皆委賴俊哲，終成功業，貽之後嗣，未有愆失遺方來之恨者也。',
    literal: 'Recently, when the Three Kingdoms stood like the legs of a tripod, all, with talents of heroic strategy and abilities destined for the age, entrusted and relied on outstanding and wise men, finally completed their achievements, and left them to their descendants; none had errors and failures that left regret for those to come.',
    idiomatic: 'More recently, when the Three Kingdoms stood against one another, each ruler possessed heroic strategy and age-shaping ability, yet all entrusted themselves to outstanding advisers, completed their undertakings, and left them to descendants without failures that later generations regretted.',
  },
  {
    zh: '今王導、王廣等，方之前賢，猶有所後。',
    literal: 'Now Wang Dao, Wang Guang, and the others, compared with former worthies, still fall somewhat behind.',
    idiomatic: 'Wang Dao, Wang Guang, and the others may still fall short when compared with the worthies of old.',
  },
  {
    zh: '至於忠素竭誠，義以輔上，共隆洪基，翼成大業，亦昔之亮也。',
    literal: 'But as for exhausting loyal sincerity, assisting the sovereign with righteousness, together exalting the great foundation, and helping complete the great enterprise, they too are of the brightness of former times.',
    idiomatic: 'Yet in loyal sincerity, righteous service to the throne, strengthening the great foundation, and helping complete the dynasty’s enterprise, they too shine like men of former times.',
  },
  {
    zh: '雖陛下乘奕世之德，有天人之會，割據江東，奄有南極，龍飛海顒，興復舊物，此亦群才之明，豈獨陛下之力也。',
    literal: 'Although Your Majesty rides the virtue accumulated over generations, had the convergence of Heaven and men, occupied Jiangdong, possessed the southern extremity, rose like a dragon by the sea in Yong, and restored the old possession, this too was the brilliance of many talents; how could it be only Your Majesty’s strength?',
    idiomatic: 'Your Majesty inherited generations of virtue, met with the support of Heaven and men, held Jiangdong and the far south, rose like a dragon by the sea, and restored the old inheritance. Yet this too came from the brilliance of many talents; how could it have been Your Majesty’s strength alone?',
  },
  {
    zh: '今王業雖建，羯寇未梟，天下蕩蕩，不賓者眾，公私匱竭，倉庾未充，梓宮沈淪，妃後不反，正委賢任能推轂之日也。',
    literal: 'Now although the royal enterprise has been established, the Jie bandits have not yet been destroyed; the realm is vast and unsettled, and many do not submit; public and private resources are exhausted, granaries are not yet full, the spirit coffin is sunk and lost, and the consorts and empress have not returned. This is precisely the day to entrust worthies, employ the capable, and push forward the carriage.',
    idiomatic: 'Although the royal enterprise is now established, the Jie enemy has not been destroyed. The realm is unsettled, many do not submit, public and private stores are exhausted, the granaries are not full, the late emperor’s coffin remains lost, and the consorts and empress have not returned. This is exactly the time to entrust worthies, employ the capable, and push the work forward.',
  },
  {
    zh: '功業垂就，晉祚方隆，而一旦聽孤臣之言，惑疑似之說，乃更以危為安，以疏易親，放逐舊德，以佞伍賢，遠虧既往之明，顧傷伊管之交，傾巍巍之望，喪如山之功，將令賢智杜心，義士喪志，近招當時之患，遠遺來世之笑。',
    literal: 'When achievement is about to be completed and the Jin fortune is just flourishing, if in a single morning you listen to the words of isolated ministers, are deluded by doubtful and similar claims, instead take danger for safety, exchange the distant for the intimate, banish old virtue, put flatterers in company with worthies, then afar you will damage the brightness of what has gone before, looking back you will injure the fellowship of Yi Yin and Guan Zhong, topple towering hopes, and lose mountain-like achievements, causing the worthy and wise to close their hearts and righteous men to lose their resolve; near at hand you will invite the troubles of the present time, and far off leave laughter for ages to come.',
    idiomatic: 'When success is nearly complete and Jin’s fortune is beginning to flourish, to listen suddenly to isolated ministers and be misled by doubtful accusations would be to mistake danger for safety, trade the close for the distant, exile men of old virtue, and rank flatterers with the worthy. It would dim the wisdom already shown, damage bonds like those of Yi Yin and Guan Zhong, topple towering hopes, and lose achievements as heavy as mountains. Worthy men would close their hearts, righteous men would lose resolve, present troubles would be invited, and later ages would laugh.',
  },
  {
    zh: '夫安危在號令，存亡在寄任，以古推今，豈可不寒心而哀歎哉！',
    literal: 'Security and danger lie in commands and orders; survival and ruin lie in entrusting appointments. Inferring the present from antiquity, how could one not feel chilled in the heart and sigh with grief!',
    idiomatic: 'Security and danger depend on commands; survival and ruin depend on those entrusted with office. Judging the present from the past, how could one not be chilled at heart and sigh in grief?',
  },
  {
    zh: '臣兄弟受遇，無彼此之嫌，而臣干犯時諱，觸忤龍鱗者何？',
    literal: 'My brothers and I have received treatment, and there is no suspicion of this side or that; why then does your servant violate the taboos of the time and offend the dragon’s scales?',
    idiomatic: 'My brothers and I have all received favor, and there is no question of factional bias. Why, then, do I risk violating the taboos of the time and touching the dragon’s scales?',
  },
  {
    zh: '誠念社稷之憂，欲報之于陛下也。',
    literal: 'Truly I think of the anxieties of the altars of soil and grain and wish to repay them to Your Majesty.',
    idiomatic: 'It is truly because I am thinking of the state’s peril and wish to repay Your Majesty.',
  },
  {
    zh: '古之明王，思聞其過，悟逆旅之言，以明成敗之由，故採納愚言，以考虛實，上為宗廟無窮之計，下收億兆元元之命。',
    literal: 'The enlightened kings of antiquity wished to hear of their faults and awakened to words from travelers on the road, in order to clarify the causes of success and failure; therefore they adopted foolish words to examine false and true, above making an endless plan for the ancestral temple, and below gathering in the lives of the countless common people.',
    idiomatic: 'The enlightened kings of antiquity wanted to hear their faults and could awaken even from the words of a traveler, so as to understand the causes of success and failure. They accepted humble counsel to test truth and falsehood, above making an enduring plan for the ancestral temple and below preserving the lives of the countless people.',
  },
  {
    zh: '臣不勝憂憤，竭愚以聞。',
    literal: 'Your servant cannot bear his worry and indignation, and exhausts his foolishness to make this heard.',
    idiomatic: 'Unable to contain my anxiety and indignation, I exhaust my poor understanding and submit this for Your Majesty to hear.',
  },
];

function sentenceUnit(row) {
  return {
    id: '',
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
  for (const item of items) {
    if (item.book !== 'jinshu' || String(item.chapter).padStart(3, '0') !== '061') continue;
    if (item.id === ITEM_ID) {
      item.status = 'applied';
      item.decision = 'included';
      item.notes = 'Inserted the omitted Zhou Song memorial after s0077 and added manual English translations for every restored sentence.';
      item.reviewer = 'manual-repair';
      item.reviewedAt = new Date().toISOString();
      item.appliedAt = item.reviewedAt;
      item.appliedSummary = {
        mode: 'manual-source-omission-insert',
        inserted: rows.length,
        afterId: 's0077',
      };
      continue;
    }

    for (const rangeKey of ['localRange']) {
      const range = item[rangeKey];
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
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));
const anchorIndex = chapter.content.findIndex((block) =>
  block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0077'),
);
if (anchorIndex < 0) throw new Error('Could not find s0077 anchor.');
if (chapter.content.some((block) => block.sentences?.some((sentence) => sentence.zh === rows[0].zh))) {
  throw new Error('First omission already appears to be inserted.');
}

renumberIds(chapter, 78, rows.length);
chapter.content.splice(anchorIndex + 1, 0, {
  type: 'paragraph',
  sentences: rows.map((row, index) => ({
    ...sentenceUnit(row),
    id: `s${String(78 + index).padStart(4, '0')}`,
  })),
});
updateMeta(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
shiftQueueLocations(queue, 78, 76, rows.length);
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Inserted ${rows.length} omitted jinshu/061 sentences after s0077.`);
