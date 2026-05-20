#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.023, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/023.json';
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
    literal: 'On wushen an edict made Censor-in-Chief Cui Yin Vice Minister of War and Associate Grand Councillor.',
    idiomatic: 'On wushen Cui Yin became War vice minister and associate councillor.',
  },
  s0302: {
    literal: 'That month Li Keyong advanced with Taiyuan\'s host to attack Youzhou.',
    idiomatic: 'That month Keyong marched on Youzhou.',
  },
  s0303: {
    literal: 'In the twelfth month You military commissioner Li Kuangchou broke the encirclement and fled.',
    idiomatic: 'Twelfth month: Kuangchou broke out and fled.',
  },
  s0304: {
    literal: 'Keyong took Youzhou and made Li Kuangwei\'s former commander Liu Rengong acting You military commissioner.',
    idiomatic: 'Keyong took Youzhou and made Liu Rengong acting commissioner.',
  },
  s0305: {
    literal: 'That month Li Kuangchou fled south toward the pass; at Jing Prefecture he was killed by Cangzhou military commissioner Lu Yanwei.',
    idiomatic: 'That month Kuangchou fled south and was killed by Lu Yanwei at Jingzhou.',
  },
  s0306: {
    literal: 'In the second year, spring, first month, on the day jiwei the new moon, Hezhong military commissioner, acting Grand Preceptor, Director of the Secretariat, Hezhong governor, Supreme Pillar of State, Prince of Langye Wang Chongying died; the three armies established Chongying\'s son marching chief Ke to know acting commissioner affairs.',
    idiomatic: 'Year 2, spring, jiwei new moon: Wang Chongying of Hezhong died; his son Ke became acting commissioner.',
  },
  s0307: {
    literal: 'On the first day of the second month, jichou, Chongying\'s son Shan military commissioner Gong and Jiang prefect Yao raised troops to attack Wang Ke, and also submitted memorials accusing Ke of falsely claiming the surname and not being Chongrong\'s son.',
    idiomatic: 'Second month jichou new moon: Gong and Yao attacked Ke and accused him of false lineage.',
  },
  s0308: {
    literal: 'Ke and Gong contended for command of Pu; the emperor sent palace envoys to comfort and instruct them.',
    idiomatic: 'Ke and Gong fought for Hezhong; envoys were sent to calm them.',
  },
  s0309: {
    literal: 'In the third month an edict made Vice Director of the Chancellery and Associate Grand Councillor Cui Yin acting Left Vice Director of the Secretariat, Associate Grand Councillor, Hezhong governor, and military commissioner of Hezhong with Jin-Jiang-Ci-Wei observation and disposition.',
    idiomatic: 'Third month: Cui Yin was made Hezhong commissioner to settle the feud.',
  },
  s0310: {
    literal: 'Zhedong military commissioner Dong Chang arrogated the title State of Luoping, styled his era Great Sage, used Wu prefect Jiang Kui as chief minister, and still falsely appointed officials.',
    idiomatic: 'Dong Chang of Zhedong declared Luoping, era Great Sage, with Jiang Kui as false chancellor.',
  },
  s0311: {
    literal: 'Zhenhai military commissioner Qian Liu asked to lead his army to campaign against him; the request was assented to.',
    idiomatic: 'Qian Liu asked to campaign against Dong Chang; the edict was assented to.',
  },
  s0312: {
    literal: 'Hanlin Academician-in-Chief, Vice Minister of War, and drafter of edicts Zhao Guangfeng was made Left Vice Director of the Secretariat, continuing in his former duty.',
    idiomatic: 'Zhao Guangfeng was made Left Vice Director and kept Hanlin duty.',
  },
  s0313: {
    literal: 'Taiyuan Li Keyong submitted a memorial saying Wang Chongrong had merit to the state and his son Ke should inherit; he asked that the commission be granted.',
    idiomatic: 'Keyong memorialized that Ke should inherit Chongrong\'s Hezhong commission.',
  },
  s0314: {
    literal: 'Binzhou Wang Xingyu, Fengxiang Li Maozhen, and Huazhou Han Jian each submitted memorials saying Ke was an adopted son unfit to succeed and asking that Ke be made Shan military commissioner and Gong Hezhong.',
    idiomatic: 'Xingyu, Maozhen, and Han Jian called Ke a usurper and asked to split Hezhong between Ke and Gong.',
  },
  s0315: {
    literal: 'The Son of Heaven, having earlier assented to Keyong\'s memorial, long withheld the edict.',
    idiomatic: 'Having favored Keyong\'s plea, the emperor stalled the edict.',
  },
  s0316: {
    literal: 'On the first day of the fifth month, dingsi, the new moon.',
    idiomatic: 'Fifth month opened on dingsi.',
  },
  s0317: {
    literal: 'On the day jiazi Li Maozhen, Wang Xingyu, Han Jian, and others each led several thousand picked armored troops to attend audience; the capital was greatly afraid and people all fled and hid; clerks could not stop them.',
    idiomatic: 'On jiazi Maozhen, Xingyu, and Han Jian entered the capital with thousands of picked troops; the city panicked.',
  },
  s0318: {
    literal: 'Zhaozong attended Anfu Gate to wait for them; when the three commanders arrived they bowed below the tower; Zhaozong faced the balustrade and instructed them himself, saying: "You are feudal lords and should preserve ministerial conduct; raising troops to enter court without memorial request—what is your intent?"',
    idiomatic: 'Zhaozong waited at Anfu Gate and asked the three commanders why they brought armies to court unbidden.',
  },
  s0319: {
    literal: 'Maozhen and Xingyu sweated until back and robe were soaked and could not reply; only Han Jian stated the reason for attending audience.',
    idiomatic: 'Maozhen and Xingyu could not answer; only Han Jian explained.',
  },
  s0320: {
    literal: 'The emperor summoned them all to ascend the tower, bestowed cups of wine, and feasted them in Tongwen Hall.',
    idiomatic: 'He brought them up, gave wine, and feasted them at Tongwen Hall.',
  },
  s0321: {
    literal: 'Maozhen and Xingyu spoke urgently that northern and southern offices opposed each other and deeply poisoned current government, asking to execute the most excessive.',
    idiomatic: 'They demanded execution of the worst northern and southern office rivals.',
  },
  s0322: {
    literal: 'Thereupon chief ministers Wei Zhaodu and Li Di were demoted, and soon killed at Duting Post; several inner officials were killed and they departed.',
    idiomatic: 'Wei Zhaodu and Li Di were demoted, killed at Duting, and several eunuchs died.',
  },
  s0323: {
    literal: 'Wang Xingyu left his younger brother Xingyue; Maozhen left his adopted son Yan Gui—each with two thousand troops as palace guard.',
    idiomatic: 'Xingyu left Xingyue and Maozhen left Yan Gui with two thousand guards each.',
  },
  s0324: {
    literal: 'At the time the three commanders together plotted to depose Zhaozong and install the Prince of Ji; hearing Taiyuan had raised troops they stopped, left troops as guards, and returned.',
    idiomatic: 'They had plotted to depose Zhaozong for the Prince of Ji but withdrew when Taiyuan marched, leaving guards.',
  },
  s0325: {
    literal: 'On the day renshen the demoted Jun census officer Kong Wei and the demoted Xiu census officer Zhang Jun were both made Junior Tutors to the Heir Apparent.',
    idiomatic: 'On renshen Kong Wei and Zhang Jun were made Junior Tutors.',
  },
  s0326: {
    literal: 'Hanlin Academician, Vice Minister of Revenue, and drafter of edicts Cui Yi was made Vice Minister of War, fulfilling duty.',
    idiomatic: 'Cui Yi was moved to War vice minister.',
  },
  s0327: {
    literal: 'On the first day of the sixth month, dinghai, Jingzhao Intendant and Heir Apparent Prince of Xue Zhirou was made concurrent Minister of Revenue, judged Revenue, and commissioner of salt and iron transport for all circuits.',
    idiomatic: 'Sixth month dinghai new moon: Prince of Xue Zhirou took Revenue and salt transport.',
  },
  s0328: {
    literal: 'On the day renchen Junior Tutor to the Heir Apparent Kong Wei was made Minister of Personnel; soon he was again Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, acting Minister of Works, Vice Director of the Chancellery, Associate Grand Councillor, University Fellow of the Hongwen Institute, Commissioner of the Grand Pure Palace and Extended Resources Store, Supreme Pillar of State, Duke of Lu with a fief of four thousand households and two hundred actual enfeoffment households, still styled "Meritorious Minister Who Upholds Crisis, Opens Fortune, and Preserves Order."',
    idiomatic: 'On renchen Kong Wei was restored from tutor to Works minister and Duke of Lu, styled Upholds Crisis and Opens Fortune.',
  },
  s0329: {
    literal: '" At the time Wei was at Hua Prefecture; soon because Taiyuan troops arrived he stopped.',
    idiomatic: 'Wei was at Hua when Taiyuan troops came and he halted.',
  },
  s0330: {
    literal: 'Junior Tutor to the Heir Apparent Zhang Jun was again Grand Master of Splendid Happiness, acting Minister of War, Supreme Pillar of State, Marquis of Hejian with a fief of two thousand households.',
    idiomatic: 'Zhang Jun was restored as acting War Minister and Marquis of Hejian.',
  },
  s0331: {
    literal: 'Jun was at Changshui and also did not reach the capital.',
    idiomatic: 'Jun at Changshui never reached the capital.',
  },
  s0332: {
    literal: 'Wang Bo was again made Vice Director of the Chancellery and Grand Councillor.',
    idiomatic: 'Wang Bo returned to council.',
  },
  s0333: {
    literal: 'On the first day of the seventh month, bingchen, Li Keyong raised his army, crossed the river, to punish Wang Xingyu, Li Maozhen, Han Jian, and others for raising troops and coming to the capital.',
    idiomatic: 'Seventh month bingchen new moon: Keyong crossed the river to punish the three commanders.',
  },
  s0334: {
    literal: 'On gengshen Tong military commissioner Wang Xingshi abandoned his commandery and entered the capital, telling the two army commandants Luo Quanhong and Liu Jingxuan: "The Shatuo are a hundred thousand strong!',
    idiomatic: 'On gengshen Wang Xingshi fled to court crying that a hundred thousand Shatuo were coming—',
  },
  s0335: {
    literal: 'Please escort the imperial carriage to Bin Prefecture, and there will also be walls to defend."',
    idiomatic: 'begging escort to Binzhou to hold walls."',
  },
  s0336: {
    literal: 'At the time Jingxuan leaned toward Fengxiang; on the night of guihai Yan Gui with Liu Jingxuan\'s son Jisheng, Tongzhou Wang Xingshi, set fires and plundered the eastern market, asking the emperor to go out on progress.',
    idiomatic: 'Jingxuan favored Fengxiang; that guihai night Yan Gui burned the eastern market and pressed for flight.',
  },
  s0337: {
    literal: 'Hearing chaos, the emperor ascended Chengtian Gate and sent the imperial princes to lead guard troops to defend.',
    idiomatic: 'Zhaozong mounted Chengtian Gate and sent princes with guards.',
  },
  s0338: {
    literal: 'Puri company head Li Yun led his army to guard the tower.',
    idiomatic: 'Li Yun of Puri guarded the tower.',
  },
  s0339: {
    literal: 'Yan Gui attacked Li Yun with Fengxiang troops; arrows reached the door panels of the imperial tower.',
    idiomatic: 'Yan Gui\'s Fengxiang arrows struck the tower doors.',
  },
  s0340: {
    literal: 'The emperor was afraid, descended the tower, and with imperial princes, princesses, and several hundred inner persons went in fortune to Li Yun\'s camp in Yongxing Ward.',
    idiomatic: 'Afraid, Zhaozong fled with princes and inner attendants to Li Yun\'s Yongxing camp.',
  },
  s0341: {
    literal: 'Imperial escort company head Li Junshi came afterward with troops; then together with Yun\'s two companies\' soldiers they guarded and went out through Qixia Gate, resting at Huayan Temple to wait for inner persons to follow.',
    idiomatic: 'Li Junshi joined Yun; they guarded the emperor out Qixia Gate to Huayan Temple.',
  },
  s0342: {
    literal: 'That evening they reached Shacheng town.',
    idiomatic: 'That evening they reached Shacheng.',
  },
  s0343: {
    literal: 'Gentry and commoners of the capital who followed in fortune numbered several hundred thousand; by the time they reached the southern mountains\' valley mouth, one in three died of heatstroke.',
    idiomatic: 'Hundreds of thousands followed; one in three died of heat at the mountain pass.',
  },
  s0344: {
    literal: 'At dusk they were plundered by bandits; the sound of wailing shook the valleys.',
    idiomatic: 'At dusk bandits plundered them; wailing filled the valleys.',
  },
  s0345: {
    literal: 'Acting Jingzhao Intendant Zhirou was temporarily ordered to know Secretariat affairs and commissioner for arranging the progress encampment.',
    idiomatic: 'Zhirou acted as Secretariat chief and arranged the flight camp.',
  },
  s0346: {
    literal: 'After two nights chief ministers Xu Yanruo, Wang Bo, and Cui Yin arrived; they then moved to the Buddhist monastery at Shimen town.',
    idiomatic: 'Two days later Xu Yanruo, Wang Bo, and Cui Yin came; the court moved to Shimen monastery.',
  },
  s0347: {
    literal: 'They still ordered knowing Palace Secretariat Liu Guangyu and Prince of Xue Zhirou to return to the capital to arrange matters, assembling guard troops to defend the palace.',
    idiomatic: 'Guangyu and Zhirou were sent back to organize palace guards.',
  },
  s0348: {
    literal: 'On bingyin Li Keyong sent guard officer Yan E to submit a memorial in haste asking after the emperor, memorializing that he encamped his army at Hezhong awaiting orders to advance toward Bin Prefecture.',
    idiomatic: 'On bingyin Keyong\'s Yan E asked after the emperor and camped at Hezhong awaiting orders to Bin.',
  },
  s0349: {
    literal: 'On dingmao the emperor sent inner official Zhang Chengye with an edict to Keyong\'s army, ordering him at once to supervise Taiyuan encampment troops and advance toward Xinping.',
    idiomatic: 'On dingmao Zhang Chengye ordered Keyong to supervise Taiyuan troops toward Xinping.',
  },
  s0350: {
    literal: 'He also sent inner official Xi Tingli with an edict to Jing Prefecture, ordering Zhang Jun to raise Jingyuan troops to join Keyong\'s army.',
    idiomatic: 'Xi Tingli was sent to Jing to raise Jingyuan troops for Keyong.',
  },
  s0351: {
    literal: 'The emperor was in the southern mountains more than half a month; Keyong was still at Hezhong and had not reached north of the Wei.',
    idiomatic: 'Half a month in the southern hills, Keyong still lingered at Hezhong.',
  },
  s0352: {
    literal: 'The emperor feared Fengxiang troops would seize and move him, and ordered the Prince of Yan to bring imperial dress, saddles, horses, jade vessels, and the like to Hezhong, proclaiming: "We take Jingxuan, Quanhong, Xingshi, and Jipeng as inside-and-outside traitors, who loosed weapons at the twin palaces; smoke and dust came suddenly and slaughter ran wild.',
    idiomatic: 'Fearing Fengxiang seizure, he sent the Prince of Yan to Keyong at Hezhong with regalia, saying traitors had stormed the twin palaces—',
  },
  s0353: {
    literal: 'We escaped by chance from the blade\'s edge and moved the carriage; what is called progress is only to the near suburbs.',
    idiomatic: 'he had fled barely alive on a near-suburbs progress.',
  },
  s0354: {
    literal: 'We know you command a mighty host, stationed at Pubei; edicts flew repeatedly and envoys were sent in succession.',
    idiomatic: 'He knew Keyong held Pubei and had sent repeated edicts—',
  },
  s0355: {
    literal: 'We expected you to take the altars as worry and lord and parent as thought—you must surely think to respond and quickly deliberate the campaign march.',
    idiomatic: 'expecting swift march for throne and kin.',
  },
  s0356: {
    literal: 'Who would have thought nearly two weeks would pass without a memorial arriving; worry is cutting and sleep and food have no leisure.',
    idiomatic: 'Yet two weeks passed without word; he could not eat or sleep.',
  },
  s0357: {
    literal: 'Is it that loyalty is not keen in your pained heart, or that on the road there may be obstruction?"',
    idiomatic: 'Was loyalty blocked on the road?"',
  },
  s0358: {
    literal: 'Now we specially send trusted kin, earnestly entrusting our meritorious minister, and therefore send the Prince of Yan Jiepi, the Prince of Dan Yun, and attendant official Wang Luyu and others to proclaim this."',
    idiomatic: 'He sent Princes Yan and Dan with Wang Luyu to entreat Keyong.',
  },
  s0359: {
    literal: 'You should at once marshal the tiger guards, go straight to Bin and Feng, sweep the demon lair flat, and rescue peril on the verge—that is what is hoped."',
    idiomatic: 'March on Bin and Feng, crush the rebels, and save the throne—that is our hope."',
  },
  s0360: {
    literal: 'On the first day of the eighth month, yiyou, the Prince of Yan reached Hezhong; Keyong had already sent vanguard troops to north of the Wei and also ordered Shi Yan to lead five hundred horse to the progress place to guard.',
    idiomatic: 'Eighth month yiyou new moon: the Prince of Yan reached Hezhong as Keyong\'s vanguard crossed the Wei.',
  },
  s0361: {
    literal: 'On jichou Keyong himself arrived at the Wei Bridge camp.',
    idiomatic: 'On jichou Keyong reached Wei Bridge.',
  },
  s0362: {
    literal: 'On guisi the Pear Garden performers killed several thousand Bin troops and captured their great commander Wang Lingtao to present.',
    idiomatic: 'On guisi Pear Garden men killed thousands of Bin troops and took Wang Lingtao.',
  },
  s0363: {
    literal: 'An edict also ordered Bin military commissioner Li Sixiao to lead his army on campaign.',
    idiomatic: 'Li Sixiao of Bin was ordered to campaign.',
  },
  s0364: {
    literal: 'On dingyou an edict made Hedong military commissioner, Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, acting Grand Preceptor, Director of the Secretariat, concurrent Governor of Taiyuan, Northern Capital regent, Supreme Pillar of State, Prince of Longxi Li Keyong overall suppression commissioner on four sides of Binning.',
    idiomatic: 'On dingyou Keyong was made overall suppression commissioner of Binning.',
  },
  s0365: {
    literal: 'Xia military commissioner Li Sixian was made northeastern suppression commissioner of Binning, Jingyuan military commissioner Zhang Jun was made western suppression commissioner of Binning, and Hezhong military commissioner Wang Ke was made encampment grain supply commissioner.',
    idiomatic: 'Li Sixian, Zhang Jun, and Wang Ke were made Binning sub-commissioners and supply chief.',
  },
  s0366: {
    literal: 'Li Maozhen heard and was afraid; he beheaded Yan Gui and the bald warrior, sent their heads to the progress place, and submitted a memorial asking punishment.',
    idiomatic: 'Maozhen, afraid, beheaded Yan Gui and sent heads to the emperor\'s camp pleading guilt.',
  },
  s0367: {
    literal: 'On xinchou an edict stripped Wang Xingyu of all personal offices and titles.',
    idiomatic: 'On xinchou Xingyu was stripped of all titles.',
  },
  s0368: {
    literal: 'Li Keyong was reassigned as overall commander of the encircling armies on four sides of Binning.',
    idiomatic: 'Keyong was made overall Binning commander.',
  },
  s0369: {
    literal: 'His great generals Gai Yu, Li Cunxin, Yan E, and aides Wang Rang, Li Xiji, and others all received edicts with gifts.',
    idiomatic: 'Gai Yu, Cunxin, Yan E, Wang Rang, and Li Xiji received reward edicts.',
  },
  s0370: {
    literal: 'Hezhong overseer Yuan Jizhen was also made overall military overseer and controller of the encircling armies on four sides of Binning.',
    idiomatic: 'Yuan Jizhen of Hezhong was made army overseer of the Binning campaign.',
  },
  s0371: {
    literal: 'On renyin Li Keyong sent his son Cunzhen to submit a memorial at the progress place, asking that the imperial carriage return to the palace.',
    idiomatic: 'On renyin Cunzhen asked the emperor to return to the palace.',
  },
  s0372: {
    literal: 'The reply edict said: "Yesterday the Prince of Yan returned, saying you worry for the age and embody the state, hold rites and offer loyalty—in meeting, every turn was full of propriety.',
    idiomatic: 'The reply said: "The Prince of Yan reports your loyalty and propriety—',
  },
  s0373: {
    literal: 'We know your inmost heart and recognize our grace and glory; quietly considering your heart to honor the lord, it truly matches the minister\'s part.',
    idiomatic: 'we know your heart honors the throne.',
  },
  s0374: {
    literal: 'We wish to return to the capital on the twelfth or fourteenth of this month, hoping to settle the myriad people, relying on your merit and virtue like the Long Wall—quickly extend the plan to cut down and settle, to comfort the black-headed people\'s hope."',
    idiomatic: 'We wish to return on the twelfth or fourteenth, relying on you like a Long Wall—strike quickly."',
  },
  s0375: {
    literal: 'On guimao he again ordered the Prince of Yan to transmit an edict ordering Keyong to send three thousand cavalry to garrison at Sanqiao to prepare for the return progress.',
    idiomatic: 'On guimao three thousand horse were ordered to Sanqiao for the return.',
  },
  s0376: {
    literal: 'On xinhai the imperial carriage returned to the palace.',
    idiomatic: 'On xinhai the emperor returned to the palace.',
  },
  s0377: {
    literal: 'On renzi Minister of Works, Vice Director of the Chancellery, Grand Councillor, supervisor of the national history, and commissioner of salt and iron transport for all circuits Cui Zhaowei ceased knowing government affairs and was made Junior Tutor to the Heir Apparent.',
    idiomatic: 'On renzi Cui Zhaowei left council and became Junior Tutor.',
  },
  s0378: {
    literal: 'Hezhong acting military commissioner Wang Ke was made acting Minister of Works, concurrent Hezhong governor and Censor-in-Chief, and military commissioner of Huguo with Hezhong-Jin-Jiang-Ci-Wei observation;',
    idiomatic: 'Wang Ke was made Huguo commissioner at Hezhong;',
  },
  s0379: {
    literal: 'You acting military commissioner Liu Rengong was made acting Minister of Works, concurrent Grand Governor of You Prefecture, and military commissioner of Lulong with charge over the Xi and Khitan;',
    idiomatic: 'Liu Rengong was made Lulong commissioner at You;',
  },
  s0380: {
    literal: 'the late Left Army Commander Yang Fugong was made Grand Preceptor of the Palace and Duke of Wei—all followed Keyong\'s memorial requests.',
    idiomatic: 'and the dead Yang Fugong was posthumously made Grand Preceptor and Duke of Wei—all at Keyong\'s request.',
  },
  s0381: {
    literal: 'On the first day of the ninth month, jiayin, the new moon.',
    idiomatic: 'Ninth month opened on jiayin.',
  },
  s0382: {
    literal: 'On bingchen an edict made Grand Master of Splendid Happiness, acting Left Vice Director of the Secretariat, Vice Director of the Chancellery, Associate Grand Councillor, supervisor of the national history, Supreme Pillar of State, Duke of Dongguan Xu Yanruo Minister of Works, Vice Director of the Chancellery, Associate Grand Councillor, commissioner for repair of the Grand Pure Palace and maintenance of the ancestral temple and other duties, University Fellow of the Hongwen Institute, Commissioner of the Extended Resources Store, and commissioner of salt and iron transport for all circuits.',
    idiomatic: 'On bingchen Xu Yanruo took Works, temple duties, and salt transport.',
  },
  s0383: {
    literal: 'Proper Counselor Vice Director of the Chancellery and Associate Grand Councillor Wang Bo was made Grand Master of Golden Purple Splendor, Minister of Revenue, Vice Director of the Chancellery, supervisor of the national history, and judge of Revenue;',
    idiomatic: 'Wang Bo took Golden Purple rank, Revenue, and history;',
  },
  s0384: {
    literal: 'Proper Counselor Vice Director of the Chancellery and Associate Grand Councillor Cui Yin was made Grand Master of Golden Purple Splendor, concurrent Minister of Revenue and Rites, University Fellow of the Jixian Hall, and judge of Revenue affairs.',
    idiomatic: 'Cui Yin took Golden Purple rank, Revenue and Rites, and Jixian;',
  },
  s0385: {
    literal: 'All were granted the title "Meritorious Minister Who Supports Crisis, Rights the State, and Brings Order."',
    idiomatic: 'all titled Supports Crisis and Rights the State.',
  },
  s0386: {
    literal: 'On guihai Minister of Works, Vice Director of the Chancellery, Grand Councillor, commissioner for repair of the Grand Pure Palace and maintenance of the ancestral temple and other duties, University Fellow of the Hongwen Institute, Commissioner of the Extended Resources Store, Supreme Pillar of State, Duke of Lu Kong Wei died; he was posthumously made Grand Commandant.',
    idiomatic: 'On guihai Kong Wei died; posthumous Grand Commandant.',
  },
  s0387: {
    literal: 'On the first day of the tenth month, jiashen, the imperial army broke the rebel Pear Garden camp, capturing and beheading tens of thousands; Xingyu thereupon held his walls and firmly defended himself.',
    idiomatic: 'Tenth month jiashen new moon: the imperial army broke the Pear Garden camp; tens of thousands fell; Xingyu held his walls.',
  },
  s0388: {
    literal: 'On dinghai, an edict pardoned prisoners in bonds; the text read: "Those who held lofty rank as pillar and stone, whose posts weighed as Grand Councilor, or were entrusted with military authority, or took part in secret councils.',
    idiomatic: 'On dinghai an amnesty edict freed bound prisoners; it read: "Those who stood as pillars of state, weighed as Grand Councilors, held military power, or sat in secret councils—',
  },
  s0389: {
    literal: 'Yet through successive slander they came at last to a name of disaster; thwarting my love of life—alas, forced to die.',
    idiomatic: 'yet through successive slander they met disaster; thwarting my love of life—alas, they were forced to die.',
  },
  s0390: {
    literal: 'From Dashun onward, all who suffered disgrace and divestiture for no crime shall have office and salary restored.',
    idiomatic: 'From Dashun on, all stripped of rank without crime shall have office and salary restored.',
  },
  s0391: {
    literal: 'Du Rangneng, Ximen Junsui, Li Zhoutong, and those below—all shall be cleared, with rank and titles returned.',
    idiomatic: 'Du Rangneng, Ximen Junsui, Li Zhoutong, and those below are cleared and their ranks restored.',
  },
  s0392: {
    literal: 'Wei Zhaodu once held the Secretariat and repeatedly advanced the chancellor\'s work; when Wang Xingyu sought the office of Director of the Department of State Affairs, he alone could suppress it—leading to his deep wrong; surely it was for this.',
    idiomatic: 'Wei Zhaodu once headed the Secretariat and repeatedly advanced policy; he alone blocked Wang Xingyu\'s bid for Director of the Department of State Affairs—and was ruined for it.',
  },
  s0393: {
    literal: 'Li Mo\'s writings were grand and ample, far above his peers; yet amid factional strife he was squeezed to death—in all who had understanding, who did not sigh?',
    idiomatic: 'Li Mo wrote with grand eloquence, far above his peers; yet faction drove him to his death, and all who knew it sighed.',
  },
  s0394: {
    literal: 'They should all be cleared and washed, with office and titles restored.',
    idiomatic: 'They are all to be cleared and their offices and titles restored.',
  },
  s0395: {
    literal: '" Another edict: Crown Prince Mentor Cui Zhaowei was demoted to Taizhou Registrar; Waterways Bureau Director and Drafting Officer Liu Chonglu was banished to Yazhou Registrar.',
    idiomatic: '" Another edict demoted Crown Prince Mentor Cui Zhaowei to Taizhou registrar and banished drafting officer Liu Chonglu to Yazhou registrar.',
  },
  s0396: {
    literal: 'Another edict to the Binzhou campaign commander-in-chief: "When Vice Commissioner Cui Yin of Binzhou breaks the rebels, let none escape the net."',
    idiomatic: 'Another edict to the Binzhou campaign commander: "When Vice Commissioner Cui Yin breaks the rebels, let none escape."',
  },
  s0397: {
    literal: 'Yin and Zhaowei were faction allies last year, joined with Xingyu, and wove the womb of disaster—the root lies in this villain.',
    idiomatic: 'Yin and Zhaowei were allies last year, joined Xingyu, and wove this disaster—the root is this villain.',
  },
  s0398: {
    literal: 'He was entrusted to the four-sided campaign staffs for their disposition.',
    idiomatic: 'He was entrusted to the four-sided campaign staffs.',
  },
  s0399: {
    literal: '" That month the four-sided campaign armies massed at Binzhou.',
    idiomatic: 'That month all four campaign armies massed at Binzhou.',
  },
  s0400: {
    literal: 'In the eleventh month, on guimao, the first day of the month.',
    idiomatic: 'Eleventh month, guimao—the new moon.',
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
if (data.metadata.chapter !== '023') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 023; standalone T ready (${Object.keys(T).length} entries).`
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
