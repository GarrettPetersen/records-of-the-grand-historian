#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.028, Rites 4 / music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/028.json';
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
    literal: 'Music is the instrument whereby the utmost-ancient sages regulated emotion.',
    idiomatic: 'Music was the tool the earliest sages used to govern the passions.',
  },
  s0002: {
    literal: 'Humans have the nature of blood-and-breath and inborn knowing, and the sentiments of joy, anger, sorrow, and delight.',
    idiomatic: 'People are born with blood and breath, with innate understanding—and with joy, anger, grief, and pleasure.',
  },
  s0003: {
    literal: 'When emotion meets things it stirs within; when sound forms pattern it responds without.',
    idiomatic: 'Feeling answers to the world inside; shaped sound answers outside.',
  },
  s0004: {
    literal: 'The sage-kings then tuned it with pitch standards, patterned it with songs and hymns, washed it with bells and stones, and spread it with strings and pipes—only then could the spirit be cleansed and resentful thoughts dispelled.',
    idiomatic: 'The sage-kings set pitch to measure it, gave it words in praise, shook it through bronze and stone, breathed it through string and pipe—so the mind could be rinsed clean and brooding anger let go.',
  },
  s0005: {
    literal: 'Applied to the state, the court is ordered; applied to the realm, the spirits draw near; applied at guest banquets, lord and minister harmonize; applied on the battlefield, soldiers and people grow brave.',
    idiomatic: 'Set it on a kingdom and the court falls into rank; set it on the world and gods and ghosts attend; set it at a feast and ruler and subject find accord; set it in the ranks and commoners and troops take heart.',
  },
  s0006: {
    literal: 'In the eras of the Three Sovereigns and Five Emperors each generation had its officers; hence at Yu\'s court they raised the dance of shields and feathers, and among the Zhou they established the teaching of string and recitation.',
    idiomatic: 'Under the Three Sovereigns and Five Emperors every age kept its music officers—so Shun\'s court revived the shield-and-feather dance, and the Zhou made plucked strings and choral learning a pillar of rule.',
  },
  s0007: {
    literal: 'When the azure essence\'s Way was lost and Warring States dust flew upward, ritual and music issued from feudal lords and the Odes and Hymns sank into a decadent age.',
    idiomatic: 'Once the ancient order failed and the Warring States threw up their dust, rites and music belonged to whichever lord held power, and the Ya and Song odes were traded down into vulgar hands.',
  },
  s0008: {
    literal: 'The Qi zither and Yan zhu—neither was bright, pure sound;',
    idiomatic: 'Qi\'s se and Yan\'s zhu—nothing left of clear, disciplined tone;',
  },
  s0009: {
    literal: 'east clay-vessel and west zither, each inscribed the look of wanton excess.',
    idiomatic: 'eastern pot-drums and western lutes, each scoring out the shapes of lewd delight.',
  },
  s0010: {
    literal: 'So far did it go that the bo drum entered Han and Master Zhi laid his strings to rest.',
    idiomatic: 'It went so far that the war drum crossed into Han while Master Zhi let his strings fall silent.',
  },
  s0011: {
    literal: 'Yanling had the reproach of coming from Zheng; Confucius rose at hearing the Shao and sighed.',
    idiomatic: 'Yanling Zi was mocked for music that smelled of Zheng; Confucius stood up when he heard the Shao and could only sigh.',
  },
  s0012: {
    literal: 'When the First Emperor unified all, he looked down on the hundred kings.',
    idiomatic: 'When Qin Shihuang welded the realm into one, he treated every earlier king as beneath notice.',
  },
  s0013: {
    literal: 'Bells and drums filled the Qin palace—none but Zheng and Wei;',
    idiomatic: 'The Qin palace rang wall to wall with bells and drums—and every piece was Zheng or Wei;',
  },
  s0014: {
    literal: 'song and dance arrayed in the Han ancestral temple—none were Xian or Shao.',
    idiomatic: 'song and dance lined the Han imperial temple—and none of it was the Xian or the Shao.',
  },
  s0015: {
    literal: 'Yet the forms of the Ninefold and the Six Changes, the institutions of eight rows and four suspended sets—only their numbers remained; rarely did their inner spirit reach through.',
    idiomatic: 'The Ninefold rite and Six Changes survived as choreography; eight rows and four suspended choirs survived as numbers—but the feeling behind them scarcely arrived.',
  },
  s0016: {
    literal: 'What the Music Office transmitted was mere outward description.',
    idiomatic: 'All the Music Office handed on was outward shape.',
  },
  s0017: {
    literal: 'In the reigns of Emperor Wu and Emperor Xuan the Son of Heaven enlarged Confucian learning, gathered poems recited at night, examined fu submitted by followers; morning chants in the Orchid Hall, evening performances at the Bamboo Palace—then he ordered the pitch-harmonizing officers and first fashioned hymns to honor the spirits.',
    idiomatic: 'Under Han Wudi and Xuandi the throne championed the classics, collected night-recited verse and court poets\' fu, sang mornings in the Orchid Hall and played evenings at the Bamboo Palace—then charged the pitch officers to compose the first sacral hymns.',
  },
  s0018: {
    literal: 'When the Prince of Hejian loved antiquity and lost books filled his halls, he condensed the Poetry and Hymns to make musical chapters and took the Zhou Offices as model for dance sections.',
    idiomatic: 'Prince Xian of Hejian hoarded old texts until his court overflowed with them; he trimmed the Odes and Hymns into scores and shaped dance sections after the Zhou Offices.',
  },
  s0019: {
    literal: 'From then on the practice was handed down and each age changed the words; though pipe and chime tones flowed on, one feared they differed from the intent of Jing and Ying.',
    idiomatic: 'Thereafter each dynasty copied the form and swapped the words; pipes and stones still sounded, but the spirit of the Jing and Ying hymns was feared lost.',
  },
  s0020: {
    literal: 'Later men listened reclining to Sang and Pu, mixed in with Doli; Guzhu and Kongsang—no more the principle of circulating the tonic;',
    idiomatic: 'Later courts lolled to Sang of Pu and Doli mixed in; Guzhu and Kongsang pieces no longer obeyed circulating-tonic theory;',
  },
  s0021: {
    literal: 'grand teeth and planted feathers—only the ritual of displaying equipage remained.',
    idiomatic: 'tall tooth-boards and feather banners were all that was left—mere display of ritual gear.',
  },
  s0022: {
    literal: 'Many were the skilled hands; few were those who knew the tone.',
    idiomatic: 'Players multiplied; true listeners grew scarce.',
  },
  s0023: {
    literal: 'After the Yongjia era Xianyang and Luoyang became ruins; ritual collapsed and music shattered, and the canon was nearly gone.',
    idiomatic: 'After Yongjia the twin capitals turned to rubble; rites broke apart and music with them, and the written canon nearly vanished.',
  },
  s0024: {
    literal: 'South of the Yangtze they gathered the scattered remnants, and still had sounds of an ordered age.',
    idiomatic: 'The Jiangzuo states salvaged what scattered pieces they could and still kept something like music of a well-governed world.',
  },
  s0025: {
    literal: 'Yet Northern Wei and the house of Yuwen, dominating the northern deserts, did not transmit pure music in the land; each man practiced his old local style.',
    idiomatic: 'Northern Wei and Yuwen\'s line ruled the northern steppe; clear court music did not take root there—every household kept its own frontier habit.',
  },
  s0026: {
    literal: 'Though they obtained craftsmen of the two capitals, they also set up the four-chamber metal performance.',
    idiomatic: 'Even when they recruited artisans from Chang\'an and Luoyang, they still staged the four-sided metal ensemble.',
  },
  s0027: {
    literal: 'Far from being pleasures for the ear, they had only the name of making music.',
    idiomatic: 'Nothing in it pleased the ear; the title of court music was all that remained.',
  },
  s0028: {
    literal: 'Emperor Wen of Sui came from a scholar-official family and keenly revived ritual and music; at the start of his reign he decreed that Director of Court Music Niu Hong and Libationer Xin Yanzhi should augment and revise the elegant music.',
    idiomatic: 'Sui Wendi rose from a literati house and threw himself into restoring rites and music; on taking the throne he ordered Court Music Director Niu Hong and Libationer Xin Yanzhi to rebuild the elegant repertoire.',
  },
  s0029: {
    literal: 'Hong assembled performing officers and labored at the problem for years without success; yet for suburban and temple offerings to the spirits, only the single Yellow Bell mode was used.',
    idiomatic: 'Niu Hong gathered palace musicians and brooded over the task for years without finishing it; meanwhile suburban and temple rites made do with Yellow Bell alone.',
  },
  s0030: {
    literal: 'When Chen was pacified they first obtained the old craftsmen of the Jiangzuo and the four-suspended instruments; the Emperor ordered them performed at court and sighed, saying: "This is the correct sound of Huaxia; but for this act of mine, how would the world ever have heard it?',
    idiomatic: 'After Chen fell they finally gained Jiangzuo veterans and the four-suspended sets; Wendi had them played at court and exclaimed: "This is the true voice of the Central Lands—without my campaign, who alive would have heard it?',
  },
  s0031: {
    literal: 'The passage concluded." Then he tuned the five notes into the five Summers, two dances, ascent hymn, inner-chamber suite, and the rest—fourteen suites in all—for guest rites and sacrifices.',
    idiomatic: 'The passage concluded." He then cast the five tones into fourteen court suites—the five Summers, two dances, ascent hymn, inner-chamber music, and the rest—for guest rites and sacrifices.',
  },
  s0032: {
    literal: 'The Sui house first possessed elegant music and therefore established the Pure Shang Office to administer it.',
    idiomatic: 'Only then did the Sui possess a true elegant repertoire and found the Pure Shang Office to guard it.',
  },
  s0033: {
    literal: 'Thereafter Pitch-Harmonizing Gentleman Zu Xiaosun, following Jing Fang\'s old method, derived five notes and twelve pitches into sixty tones, then multiplied by six to make three hundred sixty tones, circulating the tonic in turn, and thereby fixed the temple music.',
    idiomatic: 'Soon Pitch Officer Zu Xiaosun, using Jing Fang\'s old arithmetic, stretched five tones and twelve pitches into sixty notes, then sixfold into three hundred sixty, cycling the tonic through the year—and so drafted temple music on paper.',
  },
  s0034: {
    literal: 'The Confucian scholars debated and objected; in the end it was not adopted.',
    idiomatic: 'Ru scholars quarreled over it until the scheme was shelved.',
  },
  s0035: {
    literal: 'Elegant sound in the Sui age was only the fourteen suites of pure music.',
    idiomatic: 'Under the Sui, court elegance meant those fourteen pure-music suites—nothing more.',
  },
  s0036: {
    literal: 'At the end of Sui great disorder came, yet the music remained intact.',
    idiomatic: 'Sui collapsed in chaos, but the scores and instruments survived.',
  },
  s0037: {
    literal: 'When Gaozu received the Mandate he promoted Zu Xiaosun to Bureau Director in the Ministry of Personnel, then transferred him to Vice Director of Court Music, and gradually drew him into close trust.',
    idiomatic: 'When Tang Gaozu took the throne he raised Zu Xiaosun to a post in the Ministry of Personnel, then made him Vice Director of Court Music and steadily leaned on him.',
  },
  s0038: {
    literal: 'Xiaosun thereby memorialized requesting the making of music.',
    idiomatic: 'Zu Xiaosun seized the moment and asked leave to compose new state music.',
  },
  s0039: {
    literal: 'At the time military and state affairs were many; there was no leisure to reform and create anew, and the Music Office still used the Sui house\'s old scores.',
    idiomatic: 'Armies and administration consumed the court; reform waited, and the Music Office still performed from Sui books.',
  },
  s0040: {
    literal: ', then first ordered Xiaosun to revise and fix the elegant music; by the sixth month it was presented.',
    idiomatic: 'In Wude 9 he finally charged Zu Xiaosun to overhaul the elegant repertoire; by the sixth month of Zhenguan 2 it was ready for the throne.',
  },
  s0041: {
    literal: 'Taizong said: "The making of ritual and music—surely the sages, encountering things, set up teaching and used it as restraint; whether rule rises or falls, can it really depend on this?',
    idiomatic: 'Taizong said: "Rites and music exist because sages read the world and taught through it—to brace conduct. Whether a reign flourishes or fails, can bells and hymns really be the cause?',
  },
  s0042: {
    literal: 'The passage concluded." Censor-in-Chief Du Yan replied: "The rise and fall of former ages truly lay in music.',
    idiomatic: 'The passage concluded." Censor-in-Chief Du Yan answered: "Former dynasties rose and fell through music—that much is plain.',
  },
  s0043: {
    literal: 'When Chen was about to perish they made Jade Tree in the Rear Court;',
    idiomatic: 'Chen on the brink composed Jade Tree in the Rear Court;',
  },
  s0044: {
    literal: 'when Qi was about to perish they made the Companion Song.',
    idiomatic: 'Qi on the brink composed the Companion Song.',
  },
  s0045: {
    literal: 'Travelers on the road who heard them all wept—what were called the tunes of a perishing state.',
    idiomatic: 'Wayfarers who heard them wept in the street—the so-called music of a dying kingdom.',
  },
  s0046: {
    literal: 'Viewed in this light, surely music is the cause.',
    idiomatic: 'Seen that way, music is the lever of fate.',
  },
  s0047: {
    literal: 'Taizong said: "It is not so: sound can move people—that is nature\'s way.',
    idiomatic: 'Taizong said: "No. Sound moves the heart—that is nature.',
  },
  s0048: {
    literal: 'Hence the joyful hear it and are pleased; the sorrowful hear it and are grieved; the sentiments of grief and joy lie in the human heart, not in the music.',
    idiomatic: 'The glad listener brightens; the grieving listener breaks—the feeling lives in the listener, not in the tune.',
  },
  s0049: {
    literal: 'A government about to perish—its people must be bitter; it is the bitter heart that responds, so on hearing they grieve. How could a plaintive tone in the music make the pleased become grieved?',
    idiomatic: 'A state about to fall breeds a bitter people; bitterness answers to the ear, and the tune sounds sad. What plaint in the score could force a happy man to weep?',
  },
  s0050: {
    literal: 'Now the tunes Jade Tree and Companion still survive in full; I shall play them for you, and I know you will not grieve.',
    idiomatic: 'Jade Tree and Companion still survive intact. I will play them for you—and you will not weep.',
  },
  s0051: {
    literal: 'The passage concluded." Right Vice Director of the Secretariat Wei Zheng advanced, saying: "The ancients said: \'Rites, rites—is it jade and silk they mean!',
    idiomatic: 'The passage concluded." Secretariat Vice Director Wei Zheng stepped forward: "The ancients said, \'Rites, rites—are we talking about jade and silk?',
  },
  s0052: {
    literal: 'Music, music—is it bells and drums they mean!',
    idiomatic: 'Music, music—are we talking about bells and drums?',
  },
  s0053: {
    literal: '\' Music lies in the harmony of people, not in pitch. The passage concluded." The Emperor approved.',
    idiomatic: '\' Music is the harmony among people, not the scale. The passage concluded." Taizong agreed.',
  },
  s0054: {
    literal: 'Taizong assented.',
    idiomatic: 'The emperor took his point.',
  },
  s0055: {
    literal: 'Xiaosun again memorialized: "The old music of Chen and Liang mixed Wu and Chu tones;',
    idiomatic: 'Zu Xiaosun memorialized again: "Chen and Liang scores still carry Wu and Chu color;',
  },
  s0056: {
    literal: 'the old music of Zhou and Qi largely involved barbarian frontier pieces.',
    idiomatic: 'Zhou and Qi scores lean on northern and frontier pieces.',
  },
  s0057: {
    literal: 'Thereupon he weighed north and south, examined against ancient sound, and made the Great Tang elegant music.',
    idiomatic: 'He weighed north against south, tested both against ancient pitch, and forged the Great Tang elegant repertoire.',
  },
  s0058: {
    literal: 'With the twelve pitches each following its month, he circulated the tonic in turn.',
    idiomatic: 'Twelve pitches aligned to the months; the tonic cycled through the year.',
  },
  s0059: {
    literal: 'According to the Record of Rites, \'Great music is of one harmony with Heaven and Earth\'; therefore he fashioned music of twelve harmonies, altogether thirty-one pieces and eighty-four modes.',
    idiomatic: 'The Record of Rites says great music shares heaven and earth\'s harmony—so he built twelve harmonic suites: thirty-one pieces, eighty-four modes.',
  },
  s0060: {
    literal: 'For the round-altar sacrifice to Heaven, Yellow Bell served as tonic; for the square-mound sacrifice to Earth, Forest Bell; for the ancestral temple, Great Cluster.',
    idiomatic: 'Round Mound rites took Yellow Bell as tonic; Square Mound rites Forest Bell; ancestral temples Great Cluster.',
  },
  s0061: {
    literal: 'For the five suburban altars, court congratulations, and feasts, then according to the month the appropriate pitch served as tonic.',
    idiomatic: 'For the five suburban altars, court audiences, and banquets, the month\'s pitch ruled the tonic.',
  },
  s0062: {
    literal: 'The passage concluded." At first Sui used only the single Yellow Bell tonic, striking only seven bells while the other five bells hung empty and were not struck.',
    idiomatic: 'The passage concluded." Earlier Sui had used Yellow Bell alone, striking seven bells while five hung mute on the rack.',
  },
  s0063: {
    literal: 'When Xiaosun established the method of circulating the tonic, all bells were struck in turn; none hung empty any longer.',
    idiomatic: 'Once Zu Xiaosun restored circulating-tonic practice, every bell on the rack sounded; none was left idle.',
  },
  s0064: {
    literal: 'For sacrifices to the celestial spirit they played the Yuhe suite; for earth spirits the Shunhe; for the ancestral temple the Yonghe.',
    idiomatic: 'Heaven rites used Yuhe; earth rites Shunhe; ancestral temples Yonghe.',
  },
  s0065: {
    literal: 'For heaven, earth, and ancestral temple ascent hymns, all played Suhe.',
    idiomatic: 'Ascent hymns at heaven, earth, and temple alike used Suhe.',
  },
  s0066: {
    literal: 'When the Emperor faced the hall they played Taihe.',
    idiomatic: 'When the emperor took the throne hall, Taihe sounded.',
  },
  s0067: {
    literal: 'When princes and dukes entered or left, Shuhe.',
    idiomatic: 'Princes and dukes entering or leaving heard Shuhe.',
  },
  s0068: {
    literal: 'When the Emperor raised food or drank wine, Xiuhe.',
    idiomatic: 'Imperial meals and toasts used Xiuhe.',
  },
  s0069: {
    literal: 'When the Emperor received court, Zhenghe.',
    idiomatic: 'Imperial audiences used Zhenghe.',
  },
  s0070: {
    literal: 'When the Crown Prince with full suspended bells entered or left, Chenghe.',
    idiomatic: 'The crown prince\'s full bell-set processions used Chenghe.',
  },
  s0071: {
    literal: 'On New Year\'s Day and the winter solstice, when the Emperor\'s ritual assembly ascent hymn was performed, Zhaohe.',
    idiomatic: 'New Year and winter-solstice state rites sang Zhaohe at the ascent hymn.',
  },
  s0072: {
    literal: 'When suburban and temple offering-trays entered, Yonghe.',
    idiomatic: 'When offering trays entered at suburban or temple rites, Yonghe.',
  },
  s0073: {
    literal: 'When the Emperor at sacrificial offerings poured wine, read the prayer text, drank the blessing cup, and received the sacrificial flesh, Shouhe.',
    idiomatic: 'Pouring the libation, reading the prayer, drinking the blessing cup, receiving the sacrificial meat—Shouhe accompanied each.',
  },
  s0074: {
    literal: 'For welcoming the qi at the five suburban altars, each played its sound according to the monthly pitch.',
    idiomatic: 'The five suburban qi-welcoming rites each took the month\'s pitch for its tone.',
  },
  s0075: {
    literal: 'Again for suburban and temple sacrifices they danced the Huakang and Kaian suites.',
    idiomatic: 'Suburban and temple sacrifices also danced Huakang and Kaian.',
  },
  s0076: {
    literal: 'The meaning of circulating the tonic in the Rites of Zhou had long been extinct; none of the age could know it—restoring antiquity in a single morning began here.',
    idiomatic: 'Zhou ritual\'s circulating tonic had been dead for ages; no one alive understood it until one morning brought it back—here was the start.',
  },
  s0077: {
    literal: 'After Xiaosun died, Pitch-Harmonizing Gentleman Zhang Wenshou again gathered the Three Rites and said that though Xiaosun had opened the path, as to music used at suburban and border sacrifices the matter was not yet complete.',
    idiomatic: 'After Zu Xiaosun\'s death, Pitch Officer Zhang Wenshou mined the Three Rites and argued that Xiaosun had only opened the work—suburban and border-sacrifice music still needed finishing.',
  },
  s0078: {
    literal: 'An edict ordered Wenshou and the Court Music officers in charge of ritual music jointly to revise further.',
    idiomatic: 'The throne ordered Zhang Wenshou and the Court Music ritual officers to revise the system together.',
  },
  s0079: {
    literal: 'Thereupon according to the Rites of Zhou, for sacrifice to August Heaven and God the round bell served as tonic, Yellow Bell as angle, Great Cluster as mode, Guxian as feather, and they danced the Yuhe suite.',
    idiomatic: 'Following the Zhou Offices: August Heaven took round bell as tonic, Yellow Bell as second, Great Cluster as third, Guxian as fifth, with the Yuhe dance.',
  },
  s0080: {
    literal: 'If enfeoffing Mount Tai, the same music was used.',
    idiomatic: 'Mount Tai enfeoffment used the same score.',
  },
  s0081: {
    literal: 'If earth spirits at the square mound, the sealed bell as tonic, Great Cluster as angle, Guxian as mode, Southern Lu as feather, dancing the Shunhe suite.',
    idiomatic: 'Earth at the Square Mound: sealed bell tonic, Great Cluster second, Guxian third, Southern Lu fifth, Shunhe dance.',
  },
  s0082: {
    literal: 'The Liangfu shan solemn rite employed this music as well.',
    idiomatic: 'Solemn rites at Liangfu shared the same score.',
  },
  s0083: {
    literal: 'For the collective ancestral temple rite, Yellow Bell as tonic, Great Lu as angle, Great Cluster as mode, Ying Bell as feather, dancing the Yonghe suite.',
    idiomatic: 'Collective ancestral rites: Yellow Bell tonic, Great Lu second, Great Cluster third, Ying Bell fifth, Yonghe dance.',
  },
  s0084: {
    literal: 'For the five suburban altars, sun, moon, stars, and the rite categorizing spirits with God, Yellow Bell as tonic, playing the Yuhe suite.',
    idiomatic: 'Five suburban altars, sun, moon, stars, and spirits classed with Heaven: Yellow Bell tonic, Yuhe suite.',
  },
  s0085: {
    literal: 'For the great La and great Report rites, the modes Yellow Bell, Great Cluster, Guxian, Flabby Guest, Yi Ze, and Wushe played the Yuhe, Shunhe, and Yonghe suites.',
    idiomatic: 'Great La and Great Report rites cycled Yellow Bell, Great Cluster, Guxian, Flabby Guest, Yi Ze, and Wushe through Yuhe, Shunhe, and Yonghe.',
  },
  s0086: {
    literal: 'For the Bright Hall and rain-prayer rites, Yellow Bell as tonic, playing the Yuhe suite.',
    idiomatic: 'Bright Hall and rain-prayer rites: Yellow Bell tonic, Yuhe suite.',
  },
  s0087: {
    literal: 'For the Central Land, altars of soil and grain, and plowing rites, Great Cluster should serve as tonic; for the Rain Master Guxian; for mountains and rivers Flabby Guest—and all played the Shunhe suite.',
    idiomatic: 'Central Land, soil-and-grain altars, and plowing rites took Great Cluster; Rain Master Guxian; mountains and rivers Flabby Guest—all with Shunhe.',
  },
  s0088: {
    literal: 'For feasting the late queen-mother, Yi Ze as tonic, dancing the Yonghe suite.',
    idiomatic: 'Feasts for the deceased empress dowager: Yi Ze tonic, Yonghe dance.',
  },
  s0089: {
    literal: 'At the great feast, the Guxian and Flabby Guest modes.',
    idiomatic: 'Grand banquets used Guxian and Flabby Guest modes.',
  },
  s0090: {
    literal: 'When the Emperor at suburban and temple rites raised food, the monthly pitch as tonic, all playing the Xiuhe suite.',
    idiomatic: 'Imperial ritual meals at suburban or temple rites took the month\'s pitch and played Xiuhe.',
  },
  s0091: {
    literal: 'When the Emperor entered or left at suburban and temple rites, the Taihe suite; when entering or leaving the throne hall, the Shuhe suite—all with Guxian as tonic.',
    idiomatic: 'Imperial processions at suburban temples used Taihe; throne-hall processions Shuhe—both with Guxian as tonic.',
  },
  s0092: {
    literal: 'When the Emperor performed the great archery rite, Guxian as tonic, playing the Zouyu suite.',
    idiomatic: 'Imperial great archery: Guxian tonic, Zouyu suite.',
  },
  s0093: {
    literal: 'The Crown Prince played the Lishou suite.',
    idiomatic: 'The crown prince\'s archery used Lishou.',
  },
  s0094: {
    literal: 'For the Crown Prince\'s full suspended set, Guxian as tonic, playing the Yonghe suite.',
    idiomatic: 'The crown prince\'s full bell procession: Guxian tonic, Yonghe suite.',
  },
  s0095: {
    literal: 'When Yellow Bell was played, Great Lu was sung;',
    idiomatic: 'Strike Yellow Bell, sing Great Lu;',
  },
  s0096: {
    literal: 'when Great Cluster was played, Ying Bell was sung;',
    idiomatic: 'strike Great Cluster, sing Ying Bell;',
  },
  s0097: {
    literal: 'when Guxian was played, Southern Lu was sung;',
    idiomatic: 'strike Guxian, sing Southern Lu;',
  },
  s0098: {
    literal: 'when Flabby Guest was played, Forest Bell was sung;',
    idiomatic: 'strike Flabby Guest, sing Forest Bell;',
  },
  s0099: {
    literal: 'when Yi Ze was played, Middle Lu was sung;',
    idiomatic: 'strike Yi Ze, sing Middle Lu;',
  },
  s0100: {
    literal: 'when Wushe was played, Pinched Bell was sung.',
    idiomatic: 'strike Wushe, sing Pinched Bell.',
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
if (data.metadata.chapter !== '028') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 028; standalone T ready (${Object.keys(T).length} entries).`
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
