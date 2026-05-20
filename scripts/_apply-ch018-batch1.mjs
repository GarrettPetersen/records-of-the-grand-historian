#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.018, Wenzong 2 / Wuzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
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
    literal: 'Emperor Wuzong, posthumous title Zhidao Zhaosu Xiaoxiao, taboo name Yan, was Muzong\'s fifth son; his mother was Empress Xuanyi, née Wei.',
    idiomatic: 'Wuzong—taboo Yan—was Muzong\'s fifth son, born of Empress Xuanyi Wei.',
  },
  s0002: {
    literal: 'On the twelfth day of the sixth month he was born in the Eastern Palace.',
    idiomatic: 'He was born in the Eastern Palace on the twelfth of the sixth month.',
  },
  s0003: {
    literal: 'In the third month he was enfeoffed as Prince of Ying; his original name was Zhan.',
    idiomatic: 'In the third month he became Prince of Ying, born Zhan.',
  },
  s0004: {
    literal: 'In the Kaicheng era he was made Acting Grand Preceptor, Acting Minister of Personnel, and per the officials\' precedent received monthly salary allotments.',
    idiomatic: 'Under Kaicheng he held acting grand preceptor and personnel posts with monthly stipends.',
  },
  s0005: {
    literal: 'Earlier, Wenzong regretted that Crown Prince Zhuangke had died by improper means; he therefore made Jingzong\'s son Prince of Chen, Chengmei, crown prince. In the tenth month of winter the edict was proclaimed, but investiture rites were not yet performed.',
    idiomatic: 'Wenzong, repenting Zhuangke\'s death, named Chen Wang Chengmei heir in winter without full rites.',
  },
  s0006: {
    literal: 'On the second day of the first month of Kaicheng 5—year 5 duplicated in the source—Wenzong fell suddenly ill. Chief ministers Li Jue and Director of Palace Secrets Liu Hongyi received secret orders to have the crown prince supervise the state.',
    idiomatic: 'On Kaicheng 5\'s first-month second day Wenzong fell gravely ill; Li Jue and Liu Hongyi set the crown prince to regency.',
  },
  s0007: {
    literal: 'The two armies\' commandants Qiu Shiliang and Yu Hongzhi forged an edict to welcome the Prince of Ying from the Sixteen Mansions, saying: "Since I first fell ill with rash, it has worsened without recovery; I fear I cannot personally oversee the myriad affairs or daily order the multitude of policies.',
    idiomatic: 'Qiu Shiliang and Yu Hongzhi forged an edict fetching Prince of Ying Zhan: "Since my illness worsens I cannot rule in person—',
  },
  s0008: {
    literal: 'In accord with counsels and instructions, consulting the great ministers, I establish a close worthy to share the sacred vessel.',
    idiomatic: '—so by counsel of ministers I set a kinsman to share the throne."',
  },
  s0009: {
    literal: 'My younger brother Prince of Ying Zhan, formerly in his princely residence, often studied with me under the same tutors; his conduct always matched ritual measure, his nature endowed with generous kindness.',
    idiomatic: '"My brother Zhan studied with me, measured in ritual, generous by nature."',
  },
  s0010: {
    literal: 'Let him uphold the flourishing design—he will surely harmonize with human desire.',
    idiomatic: '"He will uphold the realm and win the people\'s assent."',
  },
  s0011: {
    literal: 'He may be established as Younger Brother Heir; for military and state affairs let him provisionally manage them.',
    idiomatic: '"Make him Younger Brother Heir to manage state and army affairs."',
  },
  s0012: {
    literal: 'All hundred officials and ministers, inner and outer subjects, should exhaust your hearts to help fulfill my intent.',
    idiomatic: '"Let all officials exhaust themselves to fulfill my will."',
  },
  s0013: {
    literal: 'Prince of Chen Chengmei was first established as crown prince; because his years were still tender and he had not yet advanced under tutors, and recent days were grave, there was no leisure for investiture—return to his crimson residence in accord with supreme fairness; he may again be enfeoffed Prince of Chen.',
    idiomatic: '"Chen Wang Chengmei, too young for rites, returns to prince rank for fairness."',
  },
  s0014: {
    literal: '" That night Shiliang led soldiers at the Sixteen Mansions to welcome the Younger Brother Heir to Shaoyang Court; the hundred officials paid homage at the Eastern Palace\'s Suxian Hall.',
    idiomatic: 'That night Qiu Shiliang installed the Younger Brother Heir at Shaoyang; officials bowed at Suxian Hall.',
  },
  s0015: {
    literal: 'On the third day Qiu Shiliang arrested and killed Xianzhao Court deputy Yuchi Zhang and slaughtered his household.',
    idiomatic: 'On the third day Qiu Shiliang killed Yuchi Zhang of Xianzhao Court and exterminated his clan.',
  },
  s0016: {
    literal: 'On the fourth day Wenzong died; the testamentary edict was proclaimed: the Younger Brother Heir should take the throne before the coffin; Chief Minister Yang Sifu was to act as chief mourner.',
    idiomatic: 'On the fourth Wenzong died; the testament named the Younger Brother Heir and Yang Sifu chief mourner.',
  },
  s0017: {
    literal: 'On the fourteenth day he received investiture in the main hall; he was twenty-seven.',
    idiomatic: 'On the fourteenth he was enthroned in the main hall at twenty-seven.',
  },
  s0018: {
    literal: 'Prince of Chen Chengmei and Prince of An Rong died at their residences.',
    idiomatic: 'Chen Wang Chengmei and An Wang Rong died in their mansions.',
  },
  s0019: {
    literal: 'Earlier, Consort Yang Xian had favor with Wenzong, while Zhuangke Crown Prince\'s mother the princess consort, losing favor, harbored resentment and was slandered by Consort Yang; the princess consort died and the crown prince was deposed.',
    idiomatic: 'Consort Yang had turned Wenzong against Zhuangke\'s mother; the consort died and the heir fell.',
  },
  s0020: {
    literal: 'By the late Kaicheng years the Emperor was often ill and without heirs; the worthy consort asked that Prince of An Rong succeed; the Emperor consulted Chief Minister Li Jue, who opposed it, and Chen Wang was established.',
    idiomatic: 'Late in Kaicheng, childless, Wenzong favored An Wang until Li Jue blocked it for Chen Wang.',
  },
  s0021: {
    literal: 'At this time Qiu Shiliang enthroned Wuzong and wished to claim the merit; he therefore exposed Prince of An\'s old affairs, so the two princes and the worthy consort all died.',
    idiomatic: 'Qiu Shiliang, enthroning Wuzong, exposed An Wang\'s past and killed both princes and Consort Yang.',
  },
  s0022: {
    literal: 'Second month: an order posthumously ennobled Muzong\'s consort Wei as Empress Dowager Xuanyi—the Emperor\'s mother.',
    idiomatic: 'In the second month Muzong\'s consort Wei became posthumous Empress Dowager Xuanyi.',
  },
  s0023: {
    literal: 'The Emperor attended the main hall and issued a grace edict: Acting Grand Preceptor and Right Army Commandant Qiu Shiliang was enfeoffed Duke of Chu; Left Army Commandant Yu Hongzhi Duke of Han; Minister of Rites Cui Ye and Minister of Revenue overseeing finances Cui Gong all kept their posts and became Grand Councillors.',
    idiomatic: 'From the main hall Wuzong enfeoffed Qiu Shiliang Duke of Chu, Yu Hongzhi Duke of Han, and made Cui Ye and Cui Gong councillors.',
  },
  s0024: {
    literal: 'An order: the fifteenth day of the second month, the Descent Day of the Primordial Lord, should be the Descent-of-Sage Festival with one day of leave.',
    idiomatic: 'The second month\'s fifteenth became the Descent-of-Sage holiday with one day off.',
  },
  s0025: {
    literal: 'Third month: an edict made palace women Liu and Wang consorts.',
    idiomatic: 'In the third month palace women Liu and Wang were made consorts.',
  },
  s0026: {
    literal: 'An order: on new and full moon days entering the hall to face penal officials—when inconvenient that day, stop.',
    idiomatic: 'New- and full-moon audiences with penal officials were suspended when inconvenient.',
  },
  s0027: {
    literal: 'Fifth month: the Secretariat memorialized: the twelfth day of the sixth month is the day the Emperor was born; request that day as the Qingyang Festival.',
    idiomatic: 'In the fifth month the Secretariat asked the sixth month\'s twelfth as Qingyang Festival.',
  },
  s0028: {
    literal: 'Empress Dowager Xuanyi was enshrined in the Ancestral Temple.',
    idiomatic: 'Empress Dowager Xuanyi entered the ancestral temple.',
  },
  s0029: {
    literal: 'Earlier, Wuzong wished to open Muzong\'s tomb for joint burial; the Secretariat memorialized: "The park tomb is already settled; the spirit way values stillness.',
    idiomatic: 'Wuzong wished to open Muzong\'s tomb for joint burial; the Secretariat objected:',
  },
  s0030: {
    literal: 'Guang Mausoleum has stood more than twenty years; Fu Mausoleum was recently repaired and honored.',
    idiomatic: '"Guang Mausoleum has stood twenty years; Fu Mausoleum was just restored."',
  },
  s0031: {
    literal: 'We consider that filial thought alone suffices to show solemn service.',
    idiomatic: '"Filial duty already shows solemn care."',
  },
  s0032: {
    literal: 'If we now again undertake joint burial, we must open two tombs; we fear the sage spirit would be unsettled and it would not accord with the prior intent.',
    idiomatic: '"Reopening both tombs might disturb the spirits and breach prior intent."',
  },
  s0033: {
    literal: 'Also yin-yang taboos give some doubt.',
    idiomatic: '"Yin-yang taboos also counsel caution."',
  },
  s0034: {
    literal: 'Not moving Fu Mausoleum truly accords with canonical rites.',
    idiomatic: '"Leaving Fu Mausoleum untouched accords with rites."',
  },
  s0035: {
    literal: '" It stopped there.',
    idiomatic: 'Thus ended the memorial; the plan was abandoned.',
  },
  s0036: {
    literal: 'On the old mound they added construction and named it Fu Mausoleum.',
    idiomatic: 'They enlarged the old mound and named it Fu Mausoleum.',
  },
  s0037: {
    literal: 'They also memorialized: "Per this year\'s second-month eighth-day amnesty text, retained officials of capital offices should have hand labor and miscellaneous allotments from their home offices deducted and given to acting officials.',
    idiomatic: 'They also asked that retained capital officials share hand labor pay with acting substitutes per the amnesty.',
  },
  s0038: {
    literal: 'We have examined in detail: regular officials\' salary funds in the circuits are extremely few while miscellaneous hand labor is great; now regular officials are retained and also manage public affairs, yet salary is less than miscellaneous pay—the matter below is not balanced.',
    idiomatic: '"Regular salaries are thin while hand-pay is heavy—retained officers cannot balance both."',
  },
  s0039: {
    literal: 'We have discussed: for regular officials\' salary and miscellaneous funds, we request two hundred cash per string be cut and given to acting officials; the rest as before.',
    idiomatic: '"Let two hundred cash per string of salary go to acting officers; the rest unchanged."',
  },
  s0040: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0041: {
    literal: 'Autumn, seventh month: Acting Minister of Rites and Huazhou prefect Chen Yixing was restored as Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'In the seventh month Chen Yixing returned as secretariat councillor.',
  },
  s0042: {
    literal: 'On the seventeenth day of the eighth month Emperor Wenzong was buried at Zhang Mausoleum.',
    idiomatic: 'On the eighth month\'s seventeenth Wenzong was buried at Zhang Mausoleum.',
  },
  s0043: {
    literal: 'Director of Palace Secrets Liu Hongyi and Xue Jiling led the forbidden armies escorting the spirit carriage to the tomb; the two had long been favored by Wenzong; Qiu Shiliang hated them and was ill at ease; because they held troops they wished to turn swords and execute Shiliang and Hongzhi.',
    idiomatic: 'Liu Hongyi and Xue Jiling, Wenzong\'s favorites escorting the bier, plotted to kill Qiu Shiliang.',
  },
  s0044: {
    literal: 'Procession master Minister of War Wang Qi and tomb commissioner Cui Ling detected the plot and first instructed the procession troops.',
    idiomatic: 'Wang Qi and Cui Ling uncovered the plot and warned the escort troops.',
  },
  s0045: {
    literal: 'That day Hongyi and Jiling were executed.',
    idiomatic: 'That day Liu Hongyi and Xue Jiling were executed.',
  },
  s0046: {
    literal: 'Secretariat Vice Director and Grand Councillor Yang Sifu was made Acting Minister of Personnel and Tanzhou prefect, Hunan defense commissioner;',
    idiomatic: 'Yang Sifu was banished to Hunan as acting personnel minister;',
  },
  s0047: {
    literal: 'Secretariat Vice Director and Grand Councillor Li Jue Acting Minister of War and Guizhou prefect, Gui circuit defense commissioner;',
    idiomatic: 'Li Jue to Guizhou as acting war minister;',
  },
  s0048: {
    literal: 'Censor-in-Chief Pei Yizhi made Hangzhou prefect—all for the Hongyi and Jiling faction.',
    idiomatic: 'Pei Yizhi to Hangzhou—all punished as Hongyi\'s party.',
  },
  s0049: {
    literal: 'Yiding army mutinied and expelled military commissioner Chen Junshang.',
    idiomatic: 'The Yiding army expelled Chen Junshang.',
  },
  s0050: {
    literal: 'Junshang gathered several hundred stalwarts, re-entered the city, and executed all mutinous soldiers; the garrison city was again secure.',
    idiomatic: 'Junshang rallied hundreds, retook the city, and slaughtered the mutineers.',
  },
  s0051: {
    literal: 'September: Huainan military commissioner Acting Minister of the Left Li Deyu was made Minister of Personnel and Grand Councillor, soon also Secretariat Vice Director;',
    idiomatic: 'In the ninth month Li Deyu left Huainan for the Grand Council and soon the secretariat;',
  },
  s0052: {
    literal: 'Xuanwu military commissioner Acting Minister of Personnel and Bianzhou prefect Li Shen replaced Deyu in Huainan.',
    idiomatic: 'Li Shen replaced him at Huainan.',
  },
  s0053: {
    literal: 'While in his princely residence the Emperor had greatly favored Daoist cultivation; that autumn he summoned eighty-one Daoists including Zhao Guizhen into the inner palace and in the Three Halls established a Golden Register ritual arena.',
    idiomatic: 'That autumn Wuzong summoned eighty-one Daoists including Zhao Guizhen for Golden Register rites in the Three Halls.',
  },
  s0054: {
    literal: 'The Emperor visited the Three Halls and at the Nine Heavens altar personally received the ritual registers.',
    idiomatic: 'He received ritual registers at the Nine Heavens altar.',
  },
  s0055: {
    literal: 'Right Reminder Wang Zhe memorialized that at the founding of the royal enterprise one should not believe excessively; the memorial was not heeded.',
    idiomatic: 'Wang Zhe warned against excessive faith in Daoism; the court ignored him.',
  },
  s0056: {
    literal: 'November: the Salt and Transport commissioner memorialized that south of the Yangzi and Huai tea tax should be restored; it was approved.',
    idiomatic: 'In the eleventh month the tea tax south of the Yangzi and Huai was restored.',
  },
  s0057: {
    literal: 'Weibo military commissioner He Jintao died; the three armies made his son Chongba provisional commander.',
    idiomatic: 'He Jintao died; the Weibo armies backed his son Chongba.',
  },
  s0058: {
    literal: 'Huichang 1, first month, renyin new moon—year Huichang 1 duplicated in the source.',
    idiomatic: 'Huichang 1 opened on renyin.',
  },
  s0059: {
    literal: 'On gengxu he performed suburban and ancestral rites; when the rites ended he ascended Danfeng Tower, proclaimed a great amnesty, and changed the era name.',
    idiomatic: 'On gengxu suburban rites ended with universal amnesty and the new era from Danfeng Tower.',
  },
  s0060: {
    literal: 'Second month, renyin: Huainan military commissioner Acting Minister of Personnel Li Shen was made Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'In the second month Li Shen joined the Grand Council.',
  },
  s0061: {
    literal: 'The Secretariat memorialized: "The Six Boards of the Southern Palace each have duties and should answer for their offices without dragging affairs.',
    idiomatic: 'The Secretariat urged the Six Boards to stop passing army petitions to idle clerks:',
  },
  s0062: {
    literal: 'Recently Revenue and Expenditure were mostly army petitions; this ministry\'s clerks sat idle with hands bound.',
    idiomatic: '"Revenue and Expenditure had become a mailbox for army requests while clerks sat idle."',
  },
  s0063: {
    literal: 'Hereafter let only this line divide cases; the Secretariat and Chancellery should select men of public talent and capacity to transfer appointments."',
    idiomatic: '"Let each board judge its own docket with councillors picking capable men." Thus ended the memorial.',
  },
  s0064: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0065: {
    literal: 'The imperial carriage visited Kunming Pool.',
    idiomatic: 'The Emperor visited Kunming Pool.',
  },
  s0066: {
    literal: 'A merit stele was granted Qiu Shiliang; an order had Right Vice Director Li Cheng compose the text.',
    idiomatic: 'Qiu Shiliang received a merit stele composed by Li Cheng.',
  },
  s0067: {
    literal: 'Third month: Hunan observation commissioner Yang Sifu was demoted Chaozhou vice prefect; Gui observation commissioner Li Jue Duanzhou vice prefect; Hangzhou prefect Pei Yizhi Huanzhou registrar.',
    idiomatic: 'In the third month Yang Sifu, Li Jue, and Pei Yizhi were driven deeper into exile.',
  },
  s0068: {
    literal: 'Chief minister Li Deyu was advanced to Minister of Works.',
    idiomatic: 'Li Deyu became Minister of Works.',
  },
  s0069: {
    literal: 'Third month, renshen: Grand councillors Li Deyu, Chen Yixing, Cui Gong, Li Shen, and others memorialized: "Emperor Xianzong had the merit of restoring the central revival; request a temple that would never be moved for a hundred generations."',
    idiomatic: 'On renshen the councillors asked an eternal temple for Xianzong.',
  },
  s0070: {
    literal: 'The Emperor said: "The discussion is entirely apt."',
    idiomatic: '"Entirely apt," said the Emperor.',
  },
  s0071: {
    literal: '" Discussion continued, but in the end it was not carried out.',
    idiomatic: 'Debate continued, but the proposal failed.',
  },
  s0072: {
    literal: 'The late Chief Councillor and Duke of Jin Pei Du was posthumously made Grand Preceptor.',
    idiomatic: 'Pei Du was posthumously made Grand Preceptor.',
  },
  s0073: {
    literal: 'Shannan East circuit locusts harmed the crops.',
    idiomatic: 'Locusts ravaged Shannan East.',
  },
  s0074: {
    literal: 'The Spirit Talisman Responsive Sage Cloister was built at Dragon Head Pool.',
    idiomatic: 'Dragon Head Pool gained the Spirit Talisman Responsive Sage Cloister.',
  },
  s0075: {
    literal: 'Fourth month, xinchou: an order: "The old Veritable Records of Xianzong are incomplete; historians should revise and submit within."',
    idiomatic: 'On xinchou Xianzong\'s Veritable Records were ordered revised.',
  },
  s0076: {
    literal: 'The old text may not be annotated as void; wait until the new compilation is finished and submit together."',
    idiomatic: '"Submit the new text with the old, unmarked void."',
  },
  s0077: {
    literal: 'At the time Li Deyu had first asked that Xianzong\'s temple not be moved; debaters blocked it; he again feared they might record his father\'s faults, so he again asked to rewrite the Veritable Records—the court and country disapproved.',
    idiomatic: 'Li Deyu, blocked on Xianzong\'s temple, sought to rewrite the records to shield his father—drawing public scorn.',
  },
  s0078: {
    literal: 'Fifth month, xinwei: the Secretariat memorialized: "Per the Six Offices Canon, Sui established seven Remonstrance officials at Vice Fourth Rank upper.',
    idiomatic: 'In the fifth month the Secretariat asked to restore remonstrance ranks per the Six Offices Canon:',
  },
  s0079: {
    literal: 'In Dali 2 the Secretariat Vice Director was raised to Regular Third Rank; the two departments then lacked Fourth Rank posts.',
    idiomatic: '"Since Dali 2 vice directors rose to third rank, both departments lack fourth-rank posts."',
  },
  s0080: {
    literal: 'The way of establishing offices is somewhat incomplete.',
    idiomatic: '"Office structure remains incomplete."',
  },
  s0081: {
    literal: 'The Odes say, "The king\'s duties have gaps—Zhong Shanfu mends them."',
    idiomatic: '"As the Odes say, royal gaps need ministers to mend them."',
  },
  s0082: {
    literal: 'Zhou and Han great ministers wished to enter the forbidden inner gates to remedy faults and gather remonstrance.',
    idiomatic: '"Zhou and Han ministers entered the inner gates to remonstrate."',
  },
  s0083: {
    literal: 'Zhang Heng as Vice Director often dwelt within the curtains and remonstrated at ease.',
    idiomatic: '"Zhang Heng remonstrated from within the curtains."',
  },
  s0084: {
    literal: 'These are all great ministers\' tasks; therefore their rank is lofty and their burden heavy—then respect their words and walk their way.',
    idiomatic: '"Great ministers need lofty rank to make their words weighty."',
  },
  s0085: {
    literal: 'Moreover the place of blunt speech should have seasoned men; if rank is not honored, it is hard to use elders of virtue.',
    idiomatic: '"Blunt remonstrance requires honored elders."',
  },
  s0086: {
    literal: 'The Remonstrance officials should follow Sui\'s old system, be raised to Vice Fourth Rank, divided left and right, to fill the two departments\' Fourth Rank gap.',
    idiomatic: '"Restore remonstrance to vice fourth rank, left and right."',
  },
  s0087: {
    literal: 'Hereafter rotate with directors and vice directors in and out to weight the selection.',
    idiomatic: '"Rotate remonstrance with director posts to weight selection."',
  },
  s0088: {
    literal: 'Also the Censor Vice Director is second to the Chief Censor; because the Chief Censor\'s rank is lofty the post is not always filled—the Vice Director is head of the Censorate.',
    idiomatic: '"The censor vice director should match other second-in-command fourth ranks."',
  },
  s0089: {
    literal: 'Now directorates, vice directors, vice ministers, vice supervisors, academicians, and vice magistrates are all seconds in their offices, all Fourth Rank.',
    idiomatic: '"Temple and directorate seconds are fourth rank."',
  },
  s0090: {
    literal: 'The Vice Director\'s title is weighty yet its seen rank is not honored; we request it be raised to Vice Fourth Rank."',
    idiomatic: '"Raise the censor vice director to vice fourth rank." Thus ended the memorial.',
  },
  s0091: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0092: {
    literal: 'Sixth month: bald vultures gathered in the forbidden park.',
    idiomatic: 'Bald vultures gathered in the imperial park.',
  },
  s0093: {
    literal: 'On gengzi night at the fifth watch more than fifty small meteors crisscrossed and scattered.',
    idiomatic: 'On gengzi night fifty small meteors crisscrossed the sky.',
  },
  s0094: {
    literal: 'An order made Weibo army provisional commander He Chongba Acting Minister of Works and Wezhou grand protector, full Tianxiong military commissioner, and still granted the name Chongshun.',
    idiomatic: 'He Chongba became Tianxiong commander and was renamed Chongshun.',
  },
  s0095: {
    literal: 'The Secretariat requested that per Yao Shuan\'s precedent grand councillors monthly compile a record of current policy and send it to the History Office; it was approved.',
    idiomatic: 'Grand councillors were ordered to send monthly policy records to the History Office.',
  },
  s0096: {
    literal: 'Hengshan Daoist Liu Xuanjing was made Silver-Gleam Grand Master, Chongxuan Hall academician, granted the style Lord of Broad Completion, and ordered with Zhao Guizhen to perform ritual registers in the inner palace.',
    idiomatic: 'Liu Xuanjing joined Zhao Guizhen performing registers in the palace.',
  },
  s0097: {
    literal: 'Left Remonstrance Liu Yanmo memorialized sharply in remonstrance; Yanmo was demoted Henan prefecture registrar.',
    idiomatic: 'Liu Yanmo\'s sharp remonstrance earned a Henan registrar post.',
  },
  s0098: {
    literal: 'An order: "Formerly when inner and outer persons memorialized on affairs with impeachments, they asked to retain at court.',
    idiomatic: 'An order ended "retain at court" petitions:',
  },
  s0099: {
    literal: 'Hereafter all shall say "Please deliver to the Censorate" and may not say "Retain at court without release."',
    idiomatic: '"Say deliver to the Censorate, not retain at court."',
  },
  s0100: {
    literal: 'If the matter concerns military and state affairs and reason requires secrecy, it is not within this limit.',
    idiomatic: '"State secrets remain excepted."',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
