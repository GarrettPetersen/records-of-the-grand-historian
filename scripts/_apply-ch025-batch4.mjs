#!/usr/bin/env node
/** Batch 4: s0301–s0397 (Jiutangshu ch.025, Rites 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/025.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 397;

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
    literal: 'Thereafter your subject examined the Basic Annals of the Divine Yao Emperor Gaozu and found that the Ancestor of Offerings was the zhao of the Ancestor of Eminence, and the Ancestor of Eminence was the mu of the Ancestor of Offerings—the positions of zhao and mu are as far apart as Heaven and earth.',
    idiomatic: 'Your subject found that the Ancestor of Offerings was zhao to the Ancestor of Eminence and the Ancestor of Eminence was mu to the Ancestor of Offerings—zhao and mu stand as far apart as heaven and earth.',
  },
  s0302: {
    literal: 'Now the temple chambers usurp proper order, yet it was not reported at once; still to temporize is an offense that brooks no pardon.',
    idiomatic: 'The shrine order is violated yet was not reported; to temporize is unpardonable.',
  },
  s0303: {
    literal: 'An edict still ordered Compiler Zhu Chou and Reviewer Wang Hao to examine with care; the reply stated: "In the second year of Zhide, an edict posthumously honored Gao Yao as Emperor Deming and the Martial Illustrious King of Liang as Emperor Xingsheng.',
    idiomatic: 'Zhu Chou and Wang Hao were ordered to review; the reply cited Zhide 2: Gao Yao was made Emperor Deming and the Liang Martial Illustrious King Emperor Xingsheng.',
  },
  s0304: {
    literal: 'In the tenth year, temples were established.',
    idiomatic: 'In the tenth year temples were set up.',
  },
  s0305: {
    literal: 'In the Yuanhe era, an edict followed the deliberation of 150 men led by Supervising Secretary Chen Jing and Right Vice Director Yao Nanzong, holding that di and xia are sequential sacrifices to the ancestors and that every state must honor its Grand Ancestor.',
    idiomatic: 'In Yuanhe the court followed Chen Jing, Yao Nanzong, and 150 others: di and xia are ordered ancestral rites; every state honors its Grand Ancestor.',
  },
  s0306: {
    literal: 'Now the state takes Emperor Jing as Grand Ancestor; above the Grand Ancestor, to extend di and xia, no position can be set.',
    idiomatic: 'The state takes Emperor Jing as Grand Ancestor; above him no place may be made in di and xia.',
  },
  s0307: {
    literal: 'We ask that according to the Deming and Xingsheng temples together forming four chambers, the Ancestors of Offerings and Eminence be enshrined and moved.',
    idiomatic: 'Let the Deming and Xingsheng shrines form four chambers and receive the relocated Offerings and Eminence ancestors.',
  },
  s0308: {
    literal: '" Your subject respectfully traced what Chou and others reported—that was the memorial of the time—and all placed Offerings above Eminence.',
    idiomatic: 'Chou’s report was the original memorial: Offerings was always above Eminence.',
  },
  s0309: {
    literal: 'Your subject notes that the great affairs of the state put the ancestral temple first; the rites of di and xia must not lose order.',
    idiomatic: 'State affairs begin with the ancestral temple; di and xia must keep their order.',
  },
  s0310: {
    literal: 'More than forty years have passed; it is hard to pursue the matter.',
    idiomatic: 'Forty years have passed—too late to trace easily.',
  },
  s0311: {
    literal: 'Your subject prays the sacred discernment may at once issue an edict and complete the rites of relocation and correction.',
    idiomatic: 'We beg an edict to correct the rites at once.',
  },
  s0312: {
    literal: '" That month, Zhou again memorialized: "Your subject has heard that on the thirteenth of this month an edict, on your subject’s report of the inverted placement of the two chambers of the Ancestors of Offerings and Eminence, ordered the ritual officers to assemble for deliberation and report.',
    idiomatic: 'That month Zhou again wrote: on the thirteenth an edict ordered ritual officers to debate his report that Offerings and Eminence were reversed.',
  },
  s0313: {
    literal: 'On the seventeenth of last month, because of the xia offering in the Grand Temple to the spirit tablets from Grand Ancestor Emperor Jing downward, according to the enshrinement of the Ancestors of Offerings and Eminence in the Deming temple, together as four chambers.',
    idiomatic: 'On the seventeenth last month, at the Grand Temple xia for tablets from Emperor Jing down, Offerings and Eminence were placed in the Deming shrine as four chambers.',
  },
  s0314: {
    literal: 'According to the original edict, each was to receive offerings in its own chamber.',
    idiomatic: 'By the original edict each tablet was served in its own chamber.',
  },
  s0315: {
    literal: 'It was clear that the Ancestor of Offerings should stand above the Ancestor of Eminence and that zhao and mu were correct.',
    idiomatic: 'Offerings should stand above Eminence—zhao and mu in proper order.',
  },
  s0316: {
    literal: 'At the time your subject personally saw the chamber of the Ancestor of Offerings placed inverted below that of the Ancestor of Eminence.',
    idiomatic: 'He saw Offerings’ chamber placed below Eminence’s.',
  },
  s0317: {
    literal: 'Afterward, comparing registers throughout, the discrepancy was real; your subject therefore dared to report.',
    idiomatic: 'Registers later confirmed the error; he reported it.',
  },
  s0318: {
    literal: 'Now, receiving the edict that ritual officers should assemble for deliberation and report.',
    idiomatic: 'Now the edict required ritual officers to debate and report.',
  },
  s0319: {
    literal: 'Your subject obtained seven men—Director of Offerings Li Gang, Grand Invocator Liu Zhongnian, Harmonizing Officer Zhuge Tian, Li Tong, Reviewer Wang Hao, Compiler Zhu Chou, and Erudite Min Qingzhi—who stated: "Respectfully according to the Basic Annals of the Divine Yao Emperor Gaozu and the imperial genealogy, and all ritual codes recorded in statutes from Wude, Zhenguan, Yonghui, and Kaiyuan onward, all say that the Ancestor of Offerings Emperor Xuan was Gaozu’s great-grandfather and the Ancestor of Eminence Emperor Guang was Gaozu’s great-great-grandfather; by great-grandfather and great-great-grandfather, the Ancestor of Offerings was father to the Ancestor of Eminence and the Ancestor of Eminence was son to the Ancestor of Offerings.',
    idiomatic: 'Seven officers—Li Gang, Liu Zhongnian, Zhuge Tian, Li Tong, Wang Hao, Zhu Chou, Min Qingzhi—cited annals and genealogy: Offerings Xuan was Gaozu’s great-grandfather, Eminence Guang his great-great-grandfather; Offerings was Eminence’s father.',
  },
  s0320: {
    literal: 'Thus Erudite Ren Zhou’s report of inverted sacrifice is not false.',
    idiomatic: 'Ren Zhou’s charge of inverted worship was true.',
  },
  s0321: {
    literal: 'Your subject prays that an edict be issued at once to complete the rites of relocation and correction."',
    idiomatic: 'They asked for an edict to correct the placement.',
  },
  s0322: {
    literal: 'The memorial concluded."',
    idiomatic: 'The memorial closed.',
  },
  s0323: {
    literal: 'The matter was then carried out.',
    idiomatic: 'It was done.',
  },
  s0324: {
    literal: 'When Xizong returned to the capital from Xingyuan, in the fourth month of summer they were to perform the di sacrifice; the responsible offices cited the old protocol: "Di at the Deming and Xingsheng temples, and the spirit tablets of the Ancestors of Eminence and Offerings enshrined in the Xingsheng and Deming temples, four chambers in all."',
    idiomatic: 'Xizong returned from Xingyuan; in summer’s fourth month, before the di rite, offices cited old practice: di at Deming and Xingsheng, with Offerings and Eminence in four chambers.',
  },
  s0325: {
    literal: 'In the chaos of Huang Chao, the temples had been burned; when the di was now to be held, they were ordered to deliberate the rites.',
    idiomatic: 'Huang Chao had burned the temples; rites for the coming di had to be reworked.',
  },
  s0326: {
    literal: 'Erudite Yin Yingsun argued: "Your subject holds that the four temples of Deming and the rest achieved no founding merit and were posthumous ennoblements only; moreover they are extremely remote in date from the present emperor and very distant in zhao-mu.',
    idiomatic: 'Yin Yingsun argued the four shrines lacked founding merit, were only posthumous honors, and were too remote in descent.',
  },
  s0327: {
    literal: 'One may follow the Jin precedent of Wei Hong, "when the house is destroyed, stop," and abolish them.',
    idiomatic: 'Follow Wei Hong’s Jin rule: when the building is gone, cease—and abolish them.',
  },
  s0328: {
    literal: '" An edict was sent down for joint deliberation in the Department of State Affairs; Vice Director of Rites Xue Zhaowei submitted a memorial stating:',
    idiomatic: 'The edict went to the Department of State Affairs; Xue Zhaowei of Rites memorialized:',
  },
  s0329: {
    literal: 'Receiving the edict, we respectfully follow the canonical rites and refer the matter to the responsible offices.',
    idiomatic: 'The court followed the canon and referred execution to the offices.',
  },
  s0330: {
    literal: 'In the first month, an edict held that in the offering of baskets and beans, vessels might not be complete; ritual officers and academicians were to deliberate in detail and memorialize.',
    idiomatic: 'First month: an edict said basket-and-bean offerings might be incomplete and ordered ritual scholars to report.',
  },
  s0331: {
    literal: 'Director of the Court of Imperial Sacrifices Wei Zou requested: "For offerings in the ancestral temple, let each chamber have twelve baskets and twelve beans added.',
    idiomatic: 'Wei Zou asked twelve more baskets and twelve more beans per ancestral chamber.',
  },
  s0332: {
    literal: 'Moreover the present wine cups for libation are wholly small, barely one he in measure, and very hard to hold; we ask that they be made somewhat larger.',
    idiomatic: 'Libation cups were tiny—barely one he—and hard to hold; he asked they be enlarged.',
  },
  s0333: {
    literal: 'Suburban and border offerings should follow this as well.',
    idiomatic: 'Suburban offerings should follow the same rule.',
  },
  s0334: {
    literal: 'We also hope the Department of State Affairs may gather all officials for detailed deliberation and seek a balanced mean.',
    idiomatic: 'He asked the Department of State Affairs to gather officials and find a middle course.',
  },
  s0335: {
    literal: '" Thereupon Vice Director of War Zhang Jun and Bureau Director Wei Shu and others submitted recommendations:',
    idiomatic: 'Zhang Jun and Wei Shu then offered recommendations:',
  },
  s0336: {
    literal: 'Vice Director of Rites Yang Zhongchang argued: "Respectfully according to the Rites: \'Sacrifice should not be troublesome—if troublesome it becomes irreverent;',
    idiomatic: 'Yang Zhongchang cited the Rites: sacrifice must not be burdensome or it becomes irreverent;',
  },
  s0337: {
    literal: 'nor should it be too simple—if too simple it becomes negligent.\'',
    idiomatic: 'nor too simple, or it becomes negligent.',
  },
  s0338: {
    literal: 'Zheng Xuan also said: \'While the living esteem coarse food, spirits are not so.',
    idiomatic: 'Zheng Xuan said the living eat coarsely but spirits do not.',
  },
  s0339: {
    literal: 'In the time of Shennong there were millet and panic grass but still no wine or ale.',
    idiomatic: 'In Shennong’s age there was grain but no wine.',
  },
  s0340: {
    literal: 'When later sages made ale and cheese, they still kept the dark liquor, seeking not to forget antiquity.\'',
    idiomatic: 'Later sages made ale yet kept dark liquor to remember antiquity.',
  },
  s0341: {
    literal: 'The Spring and Autumn Annals says: \'Water-cress and pondweed, water from puddles and roadside ditches, may be set before kings and dukes and offered to spirits.\'',
    idiomatic: 'The Annals say pondweed and ditch water may honor kings and spirits.',
  },
  s0342: {
    literal: 'It also says: \'Great broth unseasoned, millet food unpolished.\'',
    idiomatic: 'It also says great broth is unseasoned and millet left unpolished.',
  },
  s0343: {
    literal: 'This shows that rulers with a state who serve their ancestors and revere spirits in solemn offering do not take richness and heaviness as the standard but use frugality to show sincerity.',
    idiomatic: 'Rulers honor ancestors by frugality, not by rich food.',
  },
  s0344: {
    literal: 'Then goods from land and sea and fresh, fatty kinds, being contrary to ritual sentiment and to the law of offerings, if all were used in sacrifice, are not to be approved.',
    idiomatic: 'Sea and land delicacies violate ritual and should not all enter sacrifice.',
  },
  s0345: {
    literal: 'The Changes says: \'One wine vessel, two gui of grain, using an earthenware jar, presenting the offering through the window.\'',
    idiomatic: 'The Changes prescribe one wine vessel and two gui in an earthen jar.',
  },
  s0346: {
    literal: 'This shows sacrifice keeps to simplicity and lies not in multiplicity and luxury.',
    idiomatic: 'Sacrifice should be simple, not lavish.',
  },
  s0347: {
    literal: 'Therefore one vessel of wine and two gui of offering make the meaning of sacrifice clear.',
    idiomatic: 'One wine and two gui suffice for clear sacrifice.',
  },
  s0348: {
    literal: 'Moreover it is heard that righteousness produces ritual and ritual embodies government; to violate it is disorder—this is called uncanonical.',
    idiomatic: 'Righteousness begets ritual; ritual embodies government—violation is disorder.',
  },
  s0349: {
    literal: 'To offer rich and heavy flavors is to set coarse tastes on high; to add baskets and cups is to depart from antiquity.',
    idiomatic: 'Rich offerings vulgarize taste; added baskets and cups abandon antiquity.',
  },
  s0350: {
    literal: 'Rather than institute a new rule separately, is it not better to guard the old statutes carefully?"',
    idiomatic: 'Better keep the old statutes than invent new ones.',
  },
  s0351: {
    literal: 'At the time Crown Prince Guest Cui Mian, Bureau Director Yang Bocheng, Left Guard Army Cao Liu Zhi, and others all argued to follow the old rites and not change them.',
    idiomatic: 'Cui Mian, Yang Bocheng, Liu Zhi, and others all urged keeping the old rites.',
  },
  s0352: {
    literal: 'Thereupon the chief ministers presented the recommendations of Mian, Shu, and the rest for memorial.',
    idiomatic: 'The chief ministers submitted Mian’s and Shu’s views.',
  },
  s0353: {
    literal: 'Xuanzong said: "We inherit our ancestors\' accumulated virtue; as to offerings of grain in sacrifice, We truly wish them full and rich; the vessels for ritual should show loyal intent. What is not fragrant and pure or not in accord with regulation may not be used." Thereupon he again ordered the Court of Imperial Sacrifices to add flavors regularly.',
    idiomatic: 'Xuanzong said he wished offerings rich yet excluded what was impure or uncanonical, then ordered the Court of Sacrifices to add flavors.',
  },
  s0354: {
    literal: 'Wei Zou again memorialized: "We ask that six baskets and six beans be added to each chamber, and each season\'s different products, with seasonal fruit and delicacies offered together."',
    idiomatic: 'Wei Zou asked six more baskets and beans per chamber plus seasonal fruit.',
  },
  s0355: {
    literal: 'It was approved.',
    idiomatic: 'Approved.',
  },
  s0356: {
    literal: 'As to the libation cups, Xuanzong ordered the use of the yue sheng of one sheng, in accord with ancient meaning and moderate in amount.',
    idiomatic: 'Libation cups were set at one sheng by the yue measure—ancient and moderate.',
  },
  s0357: {
    literal: 'From then on this was regularly followed.',
    idiomatic: 'Thereafter this practice stood.',
  },
  s0358: {
    literal: 'Later Han Emperor Guangwu was buried at Yuanling; his son Emperor Ming never ceased to mourn him.',
    idiomatic: 'Guangwu of Later Han was buried at Yuanling; his son Ming long mourned him.',
  },
  s0359: {
    literal: 'In the second year of Zhongyuan he led the feudal princes, kings, and ministers in the first month to attend Yuanling, personally presenting the dressing cases and toilet boxes of the late Empress Yin with grief; the attendants at his side all wept aloud.',
    idiomatic: 'Zhongyuan 2: Ming led princes and ministers to Yuanling in the first month, weeping over Yin’s toilet goods while attendants sobbed.',
  },
  s0360: {
    literal: 'Liang Wudi’s father, Director of Danyang Shunzhi, was posthumously honored as Grand Ancestor Emperor Wen and was first buried at Dantu; he was also honored as Jianling.',
    idiomatic: 'Liang Wudi’s father Shunzhi, made Grand Ancestor Wen, lay at Dantu and Jianling.',
  },
  s0361: {
    literal: 'After Wudi took the throne, he also attended Jianling; purple clouds shaded the mound and only after a meal’s time did they disperse.',
    idiomatic: 'After his accession Wudi visited Jianling; purple clouds covered the mound briefly.',
  },
  s0362: {
    literal: 'The Liang ruler wore a single garment and a kerchief, set up a tent and bowed, gazed at the mound and wept streaming tears; where the tears fell, the grass changed color.',
    idiomatic: 'He wore plain dress, bowed at a tent, wept until the grass changed color where tears fell.',
  },
  s0363: {
    literal: 'Beside the mound was a dry spring that at the time flowed fragrant and clear.',
    idiomatic: 'A dry spring beside the tomb briefly flowed sweet and clear.',
  },
  s0364: {
    literal: 'He therefore told his attendants: "The stone tigers by the mound were made with the mound more than two hundred years ago; regretting their small size, they may be remade as steles, stone pillars, and qilin, and the middle gate of the two mounds made into three gates.',
    idiomatic: 'He ordered larger steles, pillars, and qilin and three gates for the spirit path—the old stone tigers were too small.',
  },
  s0365: {
    literal: 'The staff of the park and tombs were all promoted one rank.',
    idiomatic: 'Mausoleum staff were promoted one rank.',
  },
  s0366: {
    literal: '" Having paid respects at the various mounds, he wept and bowed in the full mourning leap.',
    idiomatic: 'He took leave of each tomb with weeping and the mourning leap.',
  },
  s0367: {
    literal: 'Northern Zhou Grand Ancestor Wen was buried at Chengling; his son Emperor Ming, on first accession, in the twelfth month of the first year, visited Chengling.',
    idiomatic: 'Zhou Grand Ancestor Wen lay at Chengling; Ming visited in the twelfth month of his first year.',
  },
  s0368: {
    literal: 'Gaozu Shenyao was buried at Xianling; on the day yisi of the first month, Taizong attended Xianling.',
    idiomatic: 'Gaozu lay at Xianling; Taizong visited on the first month’s yisi day.',
  },
  s0369: {
    literal: 'On the day before, the guard set yellow awnings and surrounded the tomb precinct; at daybreak the descendants of the seven temples, the feudal lords, the hundred officials, and tribal chieftains all stood in ranks inside the Sima Gate.',
    idiomatic: 'The day before, guards ringed the tomb; at dawn imperial kin, nobles, officials, and chieftains lined the Sima Gate.',
  },
  s0370: {
    literal: 'The emperor reached the small shelter, descended the carriage, put on shoes, wept at the gate tower facing west and bowed twice, and was overcome and could not rise.',
    idiomatic: 'The emperor wept twice west of the gate tower and could not rise.',
  },
  s0371: {
    literal: 'When the rites were done, he changed dress and entered the sleeping palace, personally held the food trays, and inspected the garments and goods of Gaozu and the late empress, crawling before the bed in grief.',
    idiomatic: 'He entered the sleeping palace, inspected Gaozu’s and the empress’s goods, and wept before the bed.',
  },
  s0372: {
    literal: 'Those attending at left and right all sighed and wept.',
    idiomatic: 'Attendants all wept.',
  },
  s0373: {
    literal: 'Earlier, on the night of jiachen, great rain and snow had fallen.',
    idiomatic: 'The night before jiachen brought heavy snow.',
  },
  s0374: {
    literal: 'When the emperor entered the tomb precinct, wailing and sobbing, the hundred ministers grieved; at that time the snow increased, a cold wind rose violently, and dark clouds issued from above the hill-tomb, soon spreading; heaven and earth were dim.',
    idiomatic: 'As he entered the precinct all wailed; snow thickened, wind rose, dark clouds spread from the mound.',
  },
  s0375: {
    literal: 'When the rites were finished and the emperor came out from the sleeping palace, he walked north past the Sima Gate, treading mud for more than two hundred paces; then the wind stilled, the snow stopped, the clouds dispersed, and the sky cleared.',
    idiomatic: 'After the rites he walked two hundred paces in mud north of the Sima Gate; then wind and snow ceased and the sky cleared.',
  },
  s0376: {
    literal: 'Onlookers privately said it was brought about by filial feeling.',
    idiomatic: 'Onlookers called it filial piety moving heaven.',
  },
  s0377: {
    literal: 'That day a partial amnesty was granted to Sanyuan County and the attendant guards and officers; for capital crimes and below, whether discovered or not, all were pardoned.',
    idiomatic: 'That day Sanyuan and the guard received partial amnesty through capital crimes.',
  },
  s0378: {
    literal: 'The people’s one-year land tax and corvée were remitted.',
    idiomatic: 'A year’s land tax was remitted.',
  },
  s0379: {
    literal: 'Those eighty and above, filial sons and compliant grandsons, righteous husbands and chaste wives, widowers, orphans, and solitaries, and those with grave illness received gifts in graded amounts.',
    idiomatic: 'The aged, the filial, the chaste, widows, orphans, and the gravely ill received graded gifts.',
  },
  s0380: {
    literal: 'The Central Guard lieutenant of the tomb district, fast-day guards, and all from the magistrate of Sanyuan downward each received promotion of one rank.',
    idiomatic: 'Tomb guards and officials through the magistrate of Sanyuan gained one rank.',
  },
  s0381: {
    literal: 'On dingwei, he returned from Xianling.',
    idiomatic: 'On dingwei he returned from Xianling.',
  },
  s0382: {
    literal: 'On jiyou, he attended court at the Hall of Supreme Ultimate.',
    idiomatic: 'On jiyou he held court at the Hall of Supreme Ultimate.',
  },
  s0383: {
    literal: 'On gengzi, he gathered the ministers and presented the music "Achievement Complete, Celebration of Good" and "Breaking the Battle Line."',
    idiomatic: 'On gengzi he had ministers hear Achievement Complete and Breaking the Battle Line.',
  },
  s0384: {
    literal: 'On the day bingchen of the eleventh month, Xuanzong personally visited Qiaoling.',
    idiomatic: 'Eleventh month bingchen: Xuanzong visited Qiaoling.',
  },
  s0385: {
    literal: 'Gazing at the mound, the emperor wept; those at his left and right were all moved to grief.',
    idiomatic: 'He wept at the mound; attendants grieved with him.',
  },
  s0386: {
    literal: 'Fengxian County was advanced to the status of a red county; its 103,000 households were assigned to supply the tomb, and troops of the three metropolitan prefectures to guard; a partial amnesty within the county for crimes below capital grade.',
    idiomatic: 'Fengxian became a red county; 103,000 households supplied the tomb; three prefectures guarded; the county was partially amnestied.',
  },
  s0387: {
    literal: 'On wuxu, he visited Dingling.',
    idiomatic: 'On wuxu he visited Dingling.',
  },
  s0388: {
    literal: 'On jihai, he visited Xianling.',
    idiomatic: 'On jihai he visited Xianling.',
  },
  s0389: {
    literal: 'On renyin, he visited Zhaoling.',
    idiomatic: 'On renyin he visited Zhaoling.',
  },
  s0390: {
    literal: 'On jisi, he visited Qianling.',
    idiomatic: 'On jisi he visited Qianling.',
  },
  s0391: {
    literal: 'On wushen, the imperial carriage returned to the palace.',
    idiomatic: 'On wushen the emperor returned to the palace.',
  },
  s0392: {
    literal: 'A great amnesty was proclaimed throughout the realm; displaced persons were all sent home; demoted officials were moved nearer; the people paid no more than half this year’s land tax.',
    idiomatic: 'He amnestied the realm, sent exiles home, moved demoted officials nearer, and halved the land tax.',
  },
  s0393: {
    literal: 'For each tomb, six neighboring townships were taken to supply the tomb precinct.',
    idiomatic: 'Six townships near each tomb supplied the mausoleum.',
  },
  s0394: {
    literal: 'When the emperor first reached Qiaoling, at daybreak sweet dew fell on the cypress trees; after dawn auspicious mist filled the sky.',
    idiomatic: 'At Qiaoling dawn brought dew on cypresses and auspicious mist after sunrise.',
  },
  s0395: {
    literal: 'When the emperor visited Zhaoling, the meritorious ministers buried with him all came to receive offerings; phoenix music rang clearly as if spirits were gathered.',
    idiomatic: 'At Zhaoling companion ministers received offerings; phoenix music rang as if spirits gathered.',
  },
  s0396: {
    literal: 'The civil and military officials in attendance all heard the sighs of the former sage and the treading dance of the meritorious ministers, and all took it as a response to utmost filial piety.',
    idiomatic: 'Attending officials heard sighs and dancing—they called it utmost filial piety.',
  },
  s0397: {
    literal: 'In the eighth month, an edict: "Henceforth, on the first day of the ninth month each year, garments shall be offered at the tomb palaces." In the thirteenth year, the five mausoleum offices of Xian, Zhao, Qian, Ding, and Qiao were changed to directorates; their directors became directorate chiefs, one rank above the former grade.',
    idiomatic: 'Eighth month: edicts for annual ninth-month garment offerings at the tombs; in year 13 five mausoleum offices became directorates with higher-ranked chiefs.',
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
if (data.metadata.chapter !== '025') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 025; standalone T ready (${Object.keys(T).length} entries).`
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
