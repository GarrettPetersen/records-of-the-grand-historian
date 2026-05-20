#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
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
    literal: 'Your servant further examines the Record of Rites, "Monthly Ordinances": each month the Son of Heaven dwells in Azure Yang, Bright Hall, Total Splendor, and Dark Hall—that is the affair of monthly gaosu.',
    idiomatic: 'Your servant further notes the Record of Rites, "Monthly Ordinances": each month the Son of Heaven dwells in Azure Yang, Bright Hall, Total Splendor, and Dark Hall—the monthly gaosu rite.',
  },
  s0602: {
    literal: 'Former scholars\' old doctrine: in conducting affairs the Son of Heaven enters the Bright Hall eighteen times in a year—the great sacrifice without divination, one entry;',
    idiomatic: 'Former scholars held that in a year the Son of Heaven entered the Bright Hall eighteen times: the great sacrifice without divination, once;',
  },
  s0603: {
    literal: 'monthly gaosu, twelve entries;',
    idiomatic: 'monthly gaosu, twelve times;',
  },
  s0604: {
    literal: 'the four seasons welcoming the qi, four entries;',
    idiomatic: 'welcoming the qi of the four seasons, four times;',
  },
  s0605: {
    literal: 'in years of the imperial tour of inspection, one entry.',
    idiomatic: 'in years of the imperial tour, once.',
  },
  s0606: {
    literal: 'Now the ritual officials establish the doctrine that the king enters only once at the year\'s head—already differing from former scholars; your servant dare not agree.',
    idiomatic: 'Today the ritualists hold that the king enters only at the year\'s head—at odds with the old masters. Your servant cannot agree.',
  },
  s0607: {
    literal: 'Zheng Xuan says: "Whenever hearing the new moon, announce to its Thearch.',
    idiomatic: 'Zheng Xuan says: "Whenever the court hears the new moon, it announces to that season\'s Thearch.',
  },
  s0608: {
    literal: '" Your servant foolishly holds that on the gaosu day it is one of the Five Directional High Gods.',
    idiomatic: '" Your servant holds that on gaosu day it is one of the Five Directional High Gods.',
  },
  s0609: {
    literal: 'In spring then Spiritual Power Uplifted; in summer Blazing Fury; in autumn White Summoner Repelled; in winter Radiant Light Eras; in the season\'s last month then Pivot Token—all with the founding ancestor as consort.',
    idiomatic: 'Spring: Spiritual Power Uplifted; summer: Blazing Fury; autumn: White Summoner Repelled; winter: Radiant Light Eras; the season\'s last month: Pivot Token—each with the founding ancestor as consort.',
  },
  s0610: {
    literal: 'Human Thearchs and spirits, listed in the sacrificial canon, are also offered sacrifice in their months.',
    idiomatic: 'The human Thearchs and spirits in the sacrificial canon receive offerings in their proper months.',
  },
  s0611: {
    literal: 'Lu from Duke Wen onward did not view the new moon; Zigong saw its rite abandoned and wished to remove the sheep; Confucius held that while the sheep remained the rite could still be known, but with the sheep gone the rite was utterly abandoned—thus he said: "You love the sheep; I love the rite.',
    idiomatic: 'From Duke Wen of Lu the state ceased viewing the new moon. Zigong saw the rite fall into ruin and wanted to abolish the sacrificial sheep. Confucius said that while the sheep remained one could still recognize the rite; without the sheep the rite was lost. Hence: "You love your sheep; I love the rite.',
  },
  s0612: {
    literal: 'The quotation concluded."',
    idiomatic: 'The Analects quote ended.',
  },
  s0613: {
    literal: 'Han, inheriting Qin\'s destruction of learning, began all affairs from scratch; Bright Hall and Imperial Academy—their institutions were wanting.',
    idiomatic: 'Han rose after Qin burned the schools; every institution was new. Bright Hall and Imperial Academy were never properly built.',
  },
  s0614: {
    literal: 'Emperor Wu\'s feng and shan first built a Bright Hall at Mount Tai; since it was not established in the capital, there were no gaosu affairs.',
    idiomatic: 'Emperor Wu\'s feng and shan raised a Bright Hall on Mount Tai—but not in the capital, so there was no gaosu.',
  },
  s0615: {
    literal: 'By Emperor Ping\'s Yuanshi era Wang Mang assisted government and nearly restored antiquity—then built Bright Hall and Imperial Academy.',
    idiomatic: 'Under Emperor Ping, in the Yuanshi era, Wang Mang governed and sought to restore antiquity; he built Bright Hall and Imperial Academy.',
  },
  s0616: {
    literal: 'The emperor performed the collective autumn sacrifice at the Bright Hall; feudal kings, marquises, and over nine hundred imperial clansmen assisted at sacrifice\'s end—all received household augmentation, enfeoffment of rank, gold and silk, promotion in rank, and appointment as officials, each in graded measure.',
    idiomatic: 'The emperor performed the collective autumn rite at the Bright Hall. More than nine hundred feudal kings, marquises, and clansmen assisted; when the rite ended each was rewarded—households enlarged, ranks granted, gold and silk bestowed, promotions and appointments, all by degree.',
  },
  s0617: {
    literal: 'At Han\'s end turmoil reigned, yet the rite was still transmitted.',
    idiomatic: 'Han ended in chaos, yet the rite still passed down.',
  },
  s0618: {
    literal: 'Down to Later Han the sacrificial canon still endured.',
    idiomatic: 'Under Later Han the sacrificial canon remained.',
  },
  s0619: {
    literal: 'In Mingdi\'s Yongping year 2, suburban sacrifice to the Five Thearchs at the Bright Hall with Guangwu as consort—each offering one calf, music as at the southern suburb.',
    idiomatic: 'Yongping year 2 of Mingdi: the Five Thearchs were sacrificed at the Bright Hall in the suburbs, with Guangwu as consort—one calf each, music as at the southern altar.',
  },
  s0620: {
    literal: 'Dong Zhuo\'s westward move extinguished records; the gaosu rite fell here.',
    idiomatic: 'Dong Zhuo\'s flight westward drowned the archives; the gaosu rite collapsed here.',
  },
  s0621: {
    literal: 'By Jin\'s end "its horses were born in the suburbs"—ritual, music, caps and robes swept utterly away.',
    idiomatic: 'By Jin\'s end—"horses born in the suburbs"—ritual, music, caps and robes were swept away entirely.',
  },
  s0622: {
    literal: 'Emperor Yuan crossing the river was called a sorry scramble; ritual and music institutions southward migrated mostly sparse; canonical tunes were mutilated with no old statutes revived; what army and state needed was decided as affairs arose.',
    idiomatic: 'Emperor Yuan fled south in disarray; ritual and music crossed the river only in fragments. Canonical melodies were broken; old statutes did not return. What army and state required was improvised as events demanded.',
  },
  s0623: {
    literal: 'With the Bright Hall lacking, how discuss gaosu?',
    idiomatic: 'Without a Bright Hall, who could speak of gaosu?',
  },
  s0624: {
    literal: 'Song\'s He Chengtian compiled texts into Discourses on Rites—though arranged, the affairs were wanting.',
    idiomatic: 'In Song, He Chengtian compiled texts into Discourses on Rites—well ordered, but the substance was missing.',
  },
  s0625: {
    literal: 'Liang\'s Cui Lingen wrote Notes on the Meaning of the Three Rites with no differing text.',
    idiomatic: 'In Liang, Cui Lingen\'s Notes on the Meaning of the Three Rites added nothing new.',
  },
  s0626: {
    literal: 'Zhenguan Rites, Xianqing Rites, and sacrificial ordinances not speaking of gaosu—likely because successive ages did not transmit it, the text was wanting; each had its reasons and cannot serve as basis.',
    idiomatic: 'Zhenguan Rites, Xianqing Rites, and the sacrificial code omit gaosu because no age transmitted it—the text was lost. Each omission has its cause; none can serve as proof.',
  },
  s0627: {
    literal: 'Now ritual officials cite it as clear proof—in your servant\'s heart there is real doubt.',
    idiomatic: 'The ritualists now cite these as clear proof. Your servant is not persuaded.',
  },
  s0628: {
    literal: 'Your Majesty newly built the Bright Hall and follows the classics—yet the gaosu rite still lacks in the old interval; reverently examining antiquity, it ought to be repaired.',
    idiomatic: 'Your Majesty has raised the Bright Hall and follows the ancients—yet gaosu still stands incomplete. To honor antiquity, the gap should be mended.',
  },
  s0629: {
    literal: 'If each month hearing government at the Bright Hall, the affair is also numerous; viewing the new moon in the first month of each season—fear it cannot be abandoned.',
    idiomatic: 'Monthly audiences at the Bright Hall would be burdensome—but viewing the new moon in each season\'s first month must not be abandoned.',
  },
  s0630: {
    literal: 'The emperor again ordered the Director of Sacrifices broadly to assemble scholars, taking Fang Qing\'s and Ren Xu\'s memorials to debate right and wrong.',
    idiomatic: 'The emperor again ordered the Director of Sacrifices to gather scholars and weigh Fang Qing\'s and Ren Xu\'s memorials.',
  },
  s0631: {
    literal: 'At the time great scholars Chengjun Erudite Wu Yangwu and Imperial University Erudite Guo Shanyun said: "We respectfully peruse the Rites of Zhou, Record of Rites, and Three Commentaries—all have the Son of Heaven\'s gaosu rite.',
    idiomatic: 'The Chengjun erudite Wu Yangwu and Imperial University erudite Guo Shanyun said: "We have examined the Rites of Zhou, the Record of Rites, and the Three Commentaries—all attest the Son of Heaven\'s gaosu rite.',
  },
  s0632: {
    literal: 'The Son of Heaven issued gaosu to the feudal lords; Qin\'s government burned the Odes and Documents—thereby the gaosu rite was abandoned.',
    idiomatic: 'The Son of Heaven proclaimed gaosu to the feudal lords. Qin burned the Odes and Documents—and gaosu perished.',
  },
  s0633: {
    literal: 'Now the Bright Hall is newly built, Total Splendor newly erected, continuing the severed tracks of a hundred kings, planting a great measure for ten thousand generations—above to solemnly consort with ancestors and forbears, below to respectfully grant the human seasons, causing people to know ritual and music, the Way fitting central harmony, disasters not arising, calamity and rebellion not occurring.',
    idiomatic: 'The Bright Hall rises anew, Total Splendor freshly founded—reviving the broken line of a hundred kings, planting a measure for ten thousand generations. Above, ancestors are solemnly matched; below, the seasons are reverently granted. Let the people know ritual and music; let the Way hold the center—then disasters will not arise and rebellion will not stir.',
  },
  s0634: {
    literal: 'Now if we follow precedent in issuing the new moon each month and execute monthly, ritual values timeliness and affairs require reform.',
    idiomatic: 'To issue the calendar every month by rote is not timely. Ritual follows the season; affairs must be adapted.',
  },
  s0635: {
    literal: 'We hope to follow Wang Fangqing\'s proposal: use the first-month days of the four seasons and the last month of summer at the Bright Hall to restore the gaosu rite and issue it to all under Heaven.',
    idiomatic: 'We ask to follow Wang Fangqing: on the first days of the four seasons and in the last month of summer, restore gaosu at the Bright Hall and proclaim it to the realm.',
  },
  s0636: {
    literal: 'For Thearchs and spirits too, request following Fangqing in using Zheng Xuan\'s meaning—announce to the five-season Thearchs atop the Bright Hall.',
    idiomatic: 'For Thearchs and spirits as well, follow Fangqing and Zheng Xuan: announce to the five-season Thearchs upon the Bright Hall.',
  },
  s0637: {
    literal: 'Then the way of solemn consort reaches the spirits;',
    idiomatic: 'Then the way of solemn matching reaches the spirits;',
  },
  s0638: {
    literal: 'utmost filial virtue radiates over the four seas.',
    idiomatic: 'utmost filial virtue shines across the four seas.',
  },
  s0639: {
    literal: 'The regulation assented.',
    idiomatic: 'The throne assented.',
  },
  s0640: {
    literal: 'In Chang\'an year 4 a regulation was first made: "On the first day at the Bright Hall receive bei (received text), cease reading seasonal ordinances.',
    idiomatic: 'In the fourth year of Chang\'an a rule was set: on New Year\'s Day the Bright Hall received the new moon; reading the seasonal ordinances ceased.',
  },
  s0641: {
    literal: 'Zhongzong succeeded; ninth month Shenlong year 1, personally enjoyed the Bright Hall, combined sacrifice to Heaven and Earth with Gaozong as consort.',
    idiomatic: 'Zhongzong took the throne. In the ninth month of Shenlong year 1 he personally sacrificed at the Bright Hall, joining Heaven and Earth with Gaozong as consort.',
  },
  s0642: {
    literal: 'When rites concluded, partial amnesty in the capital.',
    idiomatic: 'When the rite ended, the capital received a partial amnesty.',
  },
  s0643: {
    literal: 'Next year the carriage entered the capital; in autumn\'s last month great sacrifice, again performed at the Round Mound—through Ruizong\'s age.',
    idiomatic: 'The next year the court returned to the capital. The autumn great sacrifice was again held at the Round Mound—so it remained through Ruizong\'s reign.',
  },
  s0644: {
    literal: 'Kaiyuan year 2, eighth month, Crown Prince Guest-friend Xue Qianguang presented Inscriptions on the Nine Cauldrons.',
    idiomatic: 'Kaiyuan year 2, eighth month: the crown prince\'s guest-friend Xue Qianguang presented Inscriptions on the Nine Cauldrons.',
  },
  s0645: {
    literal: 'The Cauldron Inscription for Caizhou, personally composed by the Heavenly Empress, says: "Xi and Nong first emerged; Xuan and Hao accepted the mandate.',
    idiomatic: 'The Caizhou cauldron inscription, composed by the Heavenly Empress, reads: "Xi and Nong came first; Xuan and Hao took up the mandate.',
  },
  s0646: {
    literal: 'Tang and Yu succeeded in turn; Cheng Tang and Yu seized the moment.',
    idiomatic: 'Tang and Yu followed in turn; Cheng Tang and Yu rode the hour.',
  },
  s0647: {
    literal: 'Heaven and earth shone with dwelling; within the realm, harmony flourished.',
    idiomatic: 'Heaven and earth were luminous; the realm knew peace.',
  },
  s0648: {
    literal: 'Heaven above sent down the mirror; then was Great Prosperity raised.',
    idiomatic: 'Heaven sent down its sign—and Great Prosperity was founded.',
  },
  s0649: {
    literal: '" Director of the Purple Forbidden Yao Chong memorialized: "When the sage begins his fortune, auspicious omens must appear.',
    idiomatic: '" Yao Chong, director of the Purple Forbidden, memorialized: "When a sage opens his fortune, auspicious signs must show.',
  },
  s0650: {
    literal: 'We request it be proclaimed to the Historiography.',
    idiomatic: 'We ask that this be sent to the Historiography.',
  },
  s0651: {
    literal: '" Assented.',
    idiomatic: 'The emperor assented.',
  },
  s0652: {
    literal: 'Fifth year, first month, favored the eastern capital, about to perform the great sacrifice rite.',
    idiomatic: 'In the fifth year, first month, the emperor went to the eastern capital to perform the great sacrifice.',
  },
  s0653: {
    literal: 'Director of Sacrifices Associate Wang Renzhong, Erudites Feng Zong and Chen Zhenjie, etc. debated that the Bright Hall the Wu clan built violated the canon, memorializing:',
    idiomatic: 'Director of Sacrifices associate Wang Renzhong and erudites Feng Zong and Chen Zhenjie argued that the Wu clan\'s Bright Hall violated the canon. Their memorial said:',
  },
  s0654: {
    literal: 'The building of the Bright Hall—its origin is far!',
    idiomatic: 'The Bright Hall\'s origin lies deep in antiquity!',
  },
  s0655: {
    literal: 'From Heaven\'s hanging images the sage took his model.',
    idiomatic: 'Heaven hung forth its signs; the sage took them as his model.',
  },
  s0656: {
    literal: 'Artemisia pillars and thatch eaves in plan, round above and square below in form—examining the great numbers, not exceeding the interval of three and seven; fixing it at the center of the square, it must occupy the land of bing and si—is this not obtaining the place where the Heart of the Room deploys government, facing the Supreme Palace of the High God?',
    idiomatic: 'Artemisia pillars, thatch eaves—round above, square below. By great number it does not exceed three-sevenths; fixed at the square\'s center it must sit in bing-si—is this not the Heart of the Room where policy is proclaimed, the Supreme Palace of the High God?',
  },
  s0657: {
    literal: 'Thus looking up to the leaf and bowing to the follower, rectifying names and fixing positions, human and spirit not mixed, each keeping its order—then auspicious responses sound forth and great harmony is preserved.',
    idiomatic: 'Heaven above, earth below—names rectified, positions fixed. Human and spirit do not mingle; each keeps its order. Then auspicious omens answer and great harmony holds.',
  },
  s0658: {
    literal: 'Formerly Han inherited Qin; the classics\' Way ceased; seeking what was drowned and lost, detailed investigation was hard to clarify.',
    idiomatic: 'Han inherited Qin; the classics\' Way went dark. What was drowned could barely be recovered; the details could not be made clear.',
  },
  s0659: {
    literal: 'Early in Emperor Wu\'s reign they debated building a Bright Hall south of Chang\'an city; they met Empress Dowager Dou\'s dislike of Ruist learning—the affair was abandoned midway.',
    idiomatic: 'Early in Emperor Wu\'s reign they debated a Bright Hall south of Chang\'an. Empress Dowager Dou despised Ruist learning—the work stopped midway.',
  },
  s0660: {
    literal: 'In Emperor Cheng\'s age they again wished to build south of the city; debating its institution, none could decide.',
    idiomatic: 'Under Emperor Cheng they wished again to build south of the city. On the design none could agree.',
  },
  s0661: {
    literal: 'By Emperor Ping\'s Yuanshi year 4 they first created it at the southern suburb to extend solemn consort.',
    idiomatic: 'Only in Yuanshi year 4 of Emperor Ping was it first built at the southern suburb, for solemn matching.',
  },
  s0662: {
    literal: 'Guangwu, Zhongyuan year 1, built it south of the capital walls.',
    idiomatic: 'Guangwu, Zhongyuan year 1: it stood south of the capital walls.',
  },
  s0663: {
    literal: 'From Wei and Jin down to the Liang court, though regulations differed, the place occupied always took bing-si—this is the Way a hundred kings do not change.',
    idiomatic: 'From Wei and Jin through Liang, forms differed—but the site always lay in bing-si. That is the Way no king changes.',
  },
  s0664: {
    literal: 'High Ancestor the Heavenly August Emperor succeeded the age of peace, honored plain and simple winds; the four barbarians came as guests; the nine regions all were governed.',
    idiomatic: 'High Ancestor the Heavenly August Emperor inherited an age of peace and honored simplicity. The four quarters came as guests; the nine regions were governed.',
  },
  s0665: {
    literal: 'Yonghui year 3, an edict ordered ritual officials and scholars to debate Bright Hall institutions; the Ruists disputed, each holding a different extreme; long unable to decide—thereupon it stopped. Why?',
    idiomatic: 'Yonghui year 3: ritualists and scholars were ordered to debate the Bright Hall. The Ruists quarreled; each clung to his view; no decision came—and the work halted. Why?',
  },
  s0666: {
    literal: 'It was not that funds were insufficient or strength inadequate.',
    idiomatic: 'Not for lack of money or strength.',
  },
  s0667: {
    literal: 'It was because Zhou and Confucius were already distant, the ritual classics already tangled; affairs not taking antiquity as teacher perhaps offended Heaven\'s heart; hard to use as measure; the spirits did not sincerely bless.',
    idiomatic: 'Zhou and Confucius were far; the ritual classics were tangled. What did not follow antiquity might offend Heaven; what could not serve as standard lacked the spirits\' blessing.',
  },
  s0668: {
    literal: 'The Heavenly Empress Dowager held the inner court\'s government, borrowed the Terrace Pavilion\'s authority, stood in the imperial house\'s mid-collapse, trod He and Xi\'s expedient institutions.',
    idiomatic: 'The Heavenly Empress Dowager ruled the inner court, drew on the Terrace Pavilion\'s power, stood in the house\'s collapse, and walked He and Xi\'s path of expedience.',
  },
  s0669: {
    literal: 'She held that the Qianyuan great hall and Chengqing lesser chambers occupied the place of upright yang and noon—the very palace where the sage listened and judged.',
    idiomatic: 'She held that the Qianyuan great hall and Chengqing chambers sat where yang stood upright at noon—the very hall of the sage\'s judgment.',
  },
  s0670: {
    literal: 'Manifesting compliance at the correct gate, storing essence in the Encampment chamber—from morning sacrifice she had never yet faced the court.',
    idiomatic: 'She marked compliance at the correct gate and stored essence in the Encampment—yet from morning rites she never held court there.',
  },
  s0671: {
    literal: 'Then she raised workers and laborers and ordered them to pull it down and overturn it.',
    idiomatic: 'She raised laborers and had it pulled down.',
  },
  s0672: {
    literal: 'After it was destroyed thunder sounded faintly; the multitude heard it—some took it as an image of spiritual powers moved.',
    idiomatic: 'After the destruction thunder murmured; the crowd heard it—some said the spirits had been stirred.',
  },
  s0673: {
    literal: 'Thereupon she increased timber and earth\'s splendor, relied on the treasury\'s abundance—south street and north gate, building the Heavenly Pivot and Great Instrument forms;',
    idiomatic: 'Then she piled timber and earth into splendor, drawing on full treasuries—south street, north gate, the Heavenly Pivot and Great Instrument;',
  },
  s0674: {
    literal: 'on the Qianyuan ruins she raised the work of stacked pavilions and layered towers.',
    idiomatic: 'on Qianyuan\'s ruins, towers upon towers.',
  },
  s0675: {
    literal: 'Smoke and flame veiled the sun; beams and pillars ranked with clouds; men cried out in toil; Heaven truly sent warning.',
    idiomatic: 'Smoke veiled the sun; beams pierced the clouds. Men groaned under the labor; Heaven sent its warning.',
  },
  s0676: {
    literal: 'Hardly were the embers warm when repair was hastily added.',
    idiomatic: 'The ashes were barely cool when rebuilding began.',
  },
  s0677: {
    literal: 'Moreover the land differed from bing-si, not answering the spirits\' heart; the trace did not match the mandate—yet solemn consort was extended.',
    idiomatic: 'Worse: the site was not bing-si—it did not answer the spirits. The footprint did not match the mandate—yet solemn matching was performed.',
  },
  s0678: {
    literal: 'The affair was obscure to the constant canon; the spirits did not brightly descend.',
    idiomatic: 'The rite strayed from the canon; the spirits did not descend.',
  },
  s0679: {
    literal: 'This is the first thing that cannot be.',
    idiomatic: 'That is the first impossibility.',
  },
  s0680: {
    literal: 'Again, Bright Hall\'s institution: wood is not carved, earth is not patterned.',
    idiomatic: 'Again: Bright Hall wood is not carved, earth is not patterned.',
  },
  s0681: {
    literal: 'Now the form and style are improper, violating the classics and tangling ritual—where carving reaches, extravagance is exhausted to the utmost.',
    idiomatic: 'Today the form is wrong, the classics violated, ritual tangled—carving pushed to the furthest excess.',
  },
  s0682: {
    literal: 'This is the second thing that cannot be.',
    idiomatic: 'That is the second impossibility.',
  },
  s0683: {
    literal: 'Lofty, bright, open and high—the affair relies on reverent respect; closely neighboring the palace quarters—how pray to Heaven?',
    idiomatic: 'Bright Hall must be lofty, open, and pure—fit for reverence. Pressed against the palace quarters—how does one pray to Heaven?',
  },
  s0684: {
    literal: 'Human and spirit mixed and disturbed—cannot release the vessels.',
    idiomatic: 'Human and spirit mingle; the vessels cannot be set forth properly.',
  },
  s0685: {
    literal: 'This is the third thing that cannot be.',
    idiomatic: 'That is the third impossibility.',
  },
  s0686: {
    literal: 'Moreover the two capitals are the upper capitals; the ten thousand directions take them as model—yet the Son of Heaven lacks the position of facing yang, hearing government in the convenient hall\'s interior; the offices responsible ought to worry—how can they remain silent?',
    idiomatic: 'The two capitals are models for the realm—yet the Son of Heaven lacks the seat facing the sun and holds court in a side hall. Those charged with duty cannot keep silent.',
  },
  s0687: {
    literal: 'One must carefully examine calendrical plans, choose what is troublesome to reduce; what is inconvenient measure the affair and revise; what can be followed adapt as fit; cut that Bright Hall title, restore the Qianyuan name—then the throne will not be partial and people will know the old.',
    idiomatic: 'Examine the calendar, choose what may be simplified; revise what fails; keep what serves. Strip the name Bright Hall, restore Qianyuan—then the throne is not skewed and the people recognize what was.',
  },
  s0688: {
    literal: 'An edict ordered the relevant offices to debate in detail and memorialize.',
    idiomatic: 'An edict ordered the offices to debate and report.',
  },
  s0689: {
    literal: 'Minister of Justice Wang Zhiyin and others memorialized—all held that where this hall was placed truly violated the canon; many requested alteration and cutting, following the old in building Qianyuan Hall.',
    idiomatic: 'Minister of Justice Wang Zhiyin and others agreed the hall\'s placement violated the canon. Most asked that it be cut back and Qianyuan Hall rebuilt as of old.',
  },
  s0690: {
    literal: 'Then an edict was issued: "Those of old who grasped the imperial net and held the great image—when did they not above examine Heaven\'s Way and below comply with man\'s pole, or change and extend according to the time, or decrease and increase to accomplish the task?',
    idiomatic: 'An edict followed: "Those who held the imperial net and grasped the great image—when did they not look up to Heaven\'s Way and down to man\'s pole, change with the times, and trim or add to finish the work?',
  },
  s0691: {
    literal: 'Moreover the Crossroads Chamber\'s creation measured the hall by mats; using it to sacrifice to spirits is to glorify filial sacrifice; using it to deploy government is called viewing the new moon—the former kings\' means to thicken human relations and move Heaven and Earth.',
    idiomatic: 'The Crossroads Chamber was measured in mats: for spirits it glorified sacrifice; for government it was called viewing the new moon—the former kings\' way of thickening human ties and moving Heaven and Earth.',
  },
  s0692: {
    literal: 'Lesser yang has its position; the High God then rejoices—this is spirits valued in not being profaned, ritual enriched in utmost respect.',
    idiomatic: 'Lesser yang has its station; the High God delights—spirits are not profaned; ritual reaches utmost respect.',
  },
  s0693: {
    literal: 'Now\'s Bright Hall leans neighbor to the palace quarters—this solemn sacrifice differs from solemn respect; if not the constitution and statutes, what will regulate things?',
    idiomatic: 'Today\'s Bright Hall leans on the palace—this solemn rite is not solemnly performed. Without the statutes, what will the realm follow?',
  },
  s0694: {
    literal: 'Hence ritual officials, erudites, and grandees broadly joined the many deliberations, reverently like the former ancients—it is fit to preserve the dew-chamber form and abolish the Imperial Academy title.',
    idiomatic: 'Ritualists, erudites, and grandees deliberated and, reverencing antiquity, held that the dew-chamber form should remain and the Imperial Academy title be dropped.',
  },
  s0695: {
    literal: 'It may be changed to Qianyuan Hall; whenever facing the court it should follow main-hall ritual.',
    idiomatic: 'Let it be renamed Qianyuan Hall; audiences shall follow main-hall ritual.',
  },
  s0696: {
    literal: '" From this when the carriage was at the eastern capital, it regularly on New Year\'s Day and winter solstice received court congratulations at Qianyuan Hall.',
    idiomatic: '" Henceforth at the eastern capital, New Year\'s Day and the winter solstice brought court congratulations at Qianyuan Hall.',
  },
  s0697: {
    literal: 'The autumn last-month great sacrifice still was performed at the Round Mound as of old.',
    idiomatic: 'The autumn great sacrifice was still held at the Round Mound.',
  },
  s0698: {
    literal: 'Year 10, again titled Qianyuan Hall as Bright Hall, but did not perform the sacrifice rite.',
    idiomatic: 'In year 10 Qianyuan Hall was titled Bright Hall again—but no sacrifice was performed.',
  },
  s0699: {
    literal: 'Year 25, the carriage at the western capital, edicted Master of Works Kang Yuesu to go to the eastern capital and destroy it.',
    idiomatic: 'Year 25: the court was at the western capital and ordered the master of works Kang Yuesu to destroy the eastern structure.',
  },
  s0700: {
    literal: 'Yuesu, because demolition taxed the people, memorialized requesting for the time being only to dismantle the upper story, lower than the old institution by ninety-five chi.',
    idiomatic: 'Kang Yuesu, seeing that demolition burdened the people, asked to remove only the upper story—ninety-five chi below the old height.',
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
if (data.metadata.chapter !== '022') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 022; standalone T ready (${Object.keys(T).length} entries).`
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
