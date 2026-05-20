#!/usr/bin/env node
/** Batch 15: s1401–s1495 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1401;
const END = 1495;

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
  s1401: {
    literal: 'On bingyin, the active offices and ranks of Xichuan Commissioner Wang Jian were stripped.',
    idiomatic: 'On bingyin Wang Jian of Xichuan was stripped of rank.',
  },
  s1402: {
    literal: 'On wuchen, Li Keyong with Youzhou forces jointly attacked Luzhou; Quanzhong\'s defender Ding Hui surrendered Ze and Lu to Taiyuan; Keyong made his son Jiazhao acting commissioner.',
    idiomatic: 'On wuchen Li Keyong attacked Luzhou; Ding Hui surrendered Ze and Lu; Jiazhao became acting commissioner.',
  },
  s1403: {
    literal: 'On jiaxu, Quanzhong burned the Changlu camp and turned the army—because Luzhou had fallen.',
    idiomatic: 'On jiaxu Quanzhong burned Changlu and withdrew after Luzhou fell.',
  },
  s1404: {
    literal: 'On yihai, Acting Governor of Xingde Prefecture Sun Mi was exiled to Aizhou—soon ordered to death; he was Sun Cheng\'s younger brother.',
    idiomatic: 'On yihai Sun Mi, Sun Cheng\'s brother, was exiled to Aizhou and killed.',
  },
  s1405: {
    literal: 'In spring, first month, wuyin, first day of Tianyou year four.',
    idiomatic: 'Spring, wuyin, first day of Tianyou 4.',
  },
  s1406: {
    literal: 'On renyin, Quanzhong came from Changlu to Daliang; the Son of Heaven sent Censor-in-Chief Xue Yiju with an edict to console him.',
    idiomatic: 'On renyin Quanzhong reached Daliang; Xue Yiju was sent to console him.',
  },
  s1407: {
    literal: 'After Quanzhong murdered Zhaozong, Qi, Shu, and Taiyuan tied him down in continuous warfare and the Guanxi region daily shrank.',
    idiomatic: 'After Zhaozong\'s murder, Qi, Shu, and Taiyuan kept Quanzhong tied down and Guanxi shrank daily.',
  },
  s1408: {
    literal: 'Fortunately Luo Shaowei killed the牙 army and fully gained the six Weibo prefectures.',
    idiomatic: 'Luo Shaowei\'s slaughter of the牙 army gave Quanzhong all six Weibo prefectures.',
  },
  s1409: {
    literal: 'About to carry out usurpation, wishing to overawe Hebei, he again raised armies against You and Cang, hoping the father and son Ren Gong would beg alliance and bind Wang Rong and Shaowei to him.',
    idiomatic: 'He marched on You and Cang to intimidate Hebei and bind Ren Gong, Wang Rong, and Shaowei before usurping.',
  },
  s1410: {
    literal: 'From autumn through winter the attack on Cang achieved nothing; hearing Ding Hui had lost his position, he burned camp and hurried back.',
    idiomatic: 'The Cang campaign failed; when Ding Hui fell he burned camp and rushed back.',
  },
  s1411: {
    literal: 'Passing through Wei Prefecture, Luo Shaowei knew he had lost power and feared troops would strike him; he deeply praised the usurpation plot, pledging that when Wang received the Mandate he would exhaust the six prefectures\' military levies to aid the great rite—Quanzhong was deeply moved.',
    idiomatic: 'At Wei, Shaowei, fearing attack, backed the usurpation and pledged six prefectures\' levies for the enthronement—Quanzhong was moved.',
  },
  s1412: {
    literal: 'Reaching Daliang, when Xue Yiju came, he met Quanzhong with subject ritual.',
    idiomatic: 'At Daliang Xue Yiju met Quanzhong with subject ritual.',
  },
  s1413: {
    literal: 'Yiju in private secretly stated the abdication plot; Quanzhong was pleased in heart and virtue.',
    idiomatic: 'Yiju privately proposed abdication; Quanzhong was pleased.',
  },
  s1414: {
    literal: 'Yiju returned and reported: "The commander-in-chief has intent to receive succession; Your Majesty deeply embodies the times and may lay down this heavy burden."',
    idiomatic: 'Yiju reported the commander-in-chief would accept succession and the emperor should lay down his burden.',
  },
  s1415: {
    literal: '" The emperor said: "This has long been my mind."',
    idiomatic: 'The emperor said that was his long-held wish.',
  },
  s1416: {
    literal: '" An edict was then sent down that the commander-in-chief should perform the succession rite in the second month; Quanzhong falsely declined.',
    idiomatic: 'An edict set abdication for the second month; Quanzhong pretended to decline.',
  },
  s1417: {
    literal: 'On renzi of the second month, an edict ordered civil and military officials to assemble at the commander\'s office on the seventh of this month.',
    idiomatic: 'On renzi officials were ordered to the commander\'s office on the seventh.',
  },
  s1418: {
    literal: 'On guichou, chancellors and officials took leave; Quanzhong used unfinished mourning as pretext.',
    idiomatic: 'On guichou ministers took leave; Quanzhong cited unfinished mourning.',
  },
  s1419: {
    literal: 'On the first day of the third month, wuyin, Quanzhong ordered General Li Si\'an to lead thirty thousand troops with Weibo forces to raid You Prefecture.',
    idiomatic: 'On wuyin Li Si\'an led thirty thousand with Weibo troops against You.',
  },
  s1420: {
    literal: 'Si\'an halted before the suburbs; when Ren Gong\'s son Shouguang led troops to rescue, Si\'an returned.',
    idiomatic: 'Si\'an halted at the walls; when Shouguang relieved the city, he withdrew.',
  },
  s1421: {
    literal: 'On gengyin, an edict sent Xue Yiju again to Daliang to convey the intent of passing the throne.',
    idiomatic: 'On gengyin Xue Yiju was sent again with the abdication message.',
  },
  s1422: {
    literal: 'On jiachen, an edict stated: "Edict to chancellors, civil and military officials of the hundred offices, frontier commissioners and prefects—hear Our words clearly.',
    idiomatic: 'On jiachen an edict addressed all officials and frontier lords.',
  },
  s1423: {
    literal: 'The honor of the great treasure and the weight of the sacred vessel—if virtue does not fill the cosmos and merit does not succor the black-haired people, if the weight of accepting the succession at Chonghua and the achievement of guiding rivers like Wenming are not shown, how may one rule the myriad states and shine on the eight extremities?',
    idiomatic: 'The throne requires virtue filling heaven and merit saving the people, like the sage emperors of old.',
  },
  s1424: {
    literal: 'Commander Prince of Liang has a dragon countenance and jade pattern of wondrous script; with heroic plans and keen martial arts he settled the realm within the seas; with deep favor and profound benevolence he comforted the flowering land.',
    idiomatic: 'The Prince of Liang had a regal bearing and settled the realm with martial prowess and deep benevolence.',
  },
  s1425: {
    literal: 'Divine merit and utmost virtue shine after and before; silk and oil rarely record such great achievement—songs of praise clearly return to utmost transformation.',
    idiomatic: 'His merit outshone history and songs of praise hailed his rule.',
  },
  s1426: {
    literal: 'Twenty years of achievement and the esteem of hundreds of millions—near, no differing words; far, no differing hopes.',
    idiomatic: 'Twenty years of achievement won the people\'s unanimous acclaim.',
  },
  s1427: {
    literal: 'We consider the Prince\'s sage virtue, light covering the eight directions; it is fitting to follow the dark heavens and receive this precious mandate.',
    idiomatic: 'His virtue covered the realm; he should receive the Mandate.',
  },
  s1428: {
    literal: 'Moreover heavenly signs and auspicious omens were promiscuously declared bright; the flourishing age of Yu and Xia appeared in charts and registers.',
    idiomatic: 'Heavenly omens and prophecies favored him like Yu and Xia.',
  },
  s1429: {
    literal: 'The myriad affairs cannot long be vacant; the Mandate of Heaven cannot long be defied; spirits and gods harmonize in heart and return to the virtuous.',
    idiomatic: 'The throne could not stay empty; spirits favored the virtuous.',
  },
  s1430: {
    literal: 'We respectfully yield all under Heaven to the sage lord, retiring to the old fief to prepare the threefold guest honor.',
    idiomatic: 'The emperor yielded the realm and retired as a guest of the new dynasty.',
  },
  s1431: {
    literal: 'Now edict Chancellor Zhang Wenwei, Yang She, and others to lead civil and military officials, prepare the imperial carriage to welcome the Liang court, exerting reverent respect to honor the bright lord.',
    idiomatic: 'Zhang Wenwei, Yang She, and others were to welcome the Liang court with full ceremony.',
  },
  s1432: {
    literal: 'The young one lays down this heavy burden, forever a guest of Yu, attaining service in the new court—joy and peace together at the utmost."',
    idiomatic: 'The emperor would be a guest like Shun—joy in the new court.',
  },
  s1433: {
    literal: 'Central and outer ranks should embody Our mind."',
    idiomatic: 'All ranks should heed the emperor\'s intent.',
  },
  s1434: {
    literal: 'On yiyou, Vice Director Zhang Wenwei was made investiture commissioner; Minister of Rites Su Xun was deputy.',
    idiomatic: 'On yiyou Zhang Wenwei led investiture; Su Xun was deputy.',
  },
  s1435: {
    literal: 'Vice Director Yang She was commissioner for the transmission of the national treasure; Hanlin Academician Zhang Ce was deputy.',
    idiomatic: 'Yang She carried the imperial seal; Zhang Ce was deputy.',
  },
  s1436: {
    literal: 'Censor-in-Chief Xue Yiju was commissioner for the golden treasure; Left Vice Director Zhao Guangfeng was deputy.',
    idiomatic: 'Xue Yiju guarded the golden treasure; Zhao Guangfeng was deputy.',
  },
  s1437: {
    literal: 'On jiawu, Wenwei led civil and military officials to Daliang.',
    idiomatic: 'On jiawu Wenwei led officials to Daliang.',
  },
  s1438: {
    literal: 'On jiazi, the rites were performed.',
    idiomatic: 'On jiazi the abdication rites were performed.',
  },
  s1439: {
    literal: 'The investiture document states:',
    idiomatic: 'The investiture read:',
  },
  s1440: {
    literal: '"The emperor said: Alas for you, Commander-in-Chief of Armies and Horses of All under Heaven, Chancellor overseeing all affairs, Prince of Liang—We each observe books of high antiquity and take Yao and Shun as beginning, because the canon of yielding extends to infinity.',
    idiomatic: '"The emperor addressed the Prince of Liang: antiquity shows Yao and Shun began by yielding the throne.',
  },
  s1441: {
    literal: 'Therefore mounting Tai and yielding at Liangfu—of seventy-two lords who could be spoken of in brief—so one knows all under Heaven is utmost fairness and not possessed by one surname alone.',
    idiomatic: 'Seventy-two rulers who sacrificed show the realm belongs to virtue, not one clan.',
  },
  s1442: {
    literal: 'Since antiquity bright kings and sage emperors have burned thought and labored spirit, fearful as if falling into a moat, sitting awaiting dawn—none who held it were not wary, none who left it were not at ease.',
    idiomatic: 'Sage rulers toiled in office and found ease only in retirement.',
  },
  s1443: {
    literal: 'Moreover Xuanyuan was not unenlightened and Yao was not unsage—yet they wished to roam at Guye and rest in the Great Court."',
    idiomatic: 'Even Xuanyuan and Yao sought rest from rule.',
  },
  s1444: {
    literal: 'How much more when the sequence nears its end and the allotted span long departed—to belong to the solitary young and rule the myriad directions!',
    idiomatic: 'How much less could a youth hold the throne when fate had ended!',
  },
  s1445: {
    literal: 'Moreover since the pampered ancestors, favorites disturbed the court; disaster arose by steps and government gradually lost form.',
    idiomatic: 'Since mid-Tang, favorites ruined government step by step.',
  },
  s1446: {
    literal: 'Heaven\'s net split wide, the sea waters flowed crosswise—four reigns here, the living without shelter.',
    idiomatic: 'Heaven\'s net tore, seas flooded—four reigns without shelter for the people.',
  },
  s1447: {
    literal: 'Reaching the time of ruin, who could bring peace?',
    idiomatic: 'In ruin, who could restore peace?',
  },
  s1448: {
    literal: 'Reaching Us, young in years, We succeeded this declining thread.',
    idiomatic: 'The emperor inherited a failing line in youth.',
  },
  s1449: {
    literal: 'How could such tender dimness guard the great foundation?',
    idiomatic: 'A child could not guard the foundation.',
  },
  s1450: {
    literal: 'Only the Prince\'s sage brightness is in the person, embodying the supreme wise.',
    idiomatic: 'Only the Prince embodied supreme wisdom.',
  },
  s1451: {
    literal: 'He raised divine martial prowess and quelled the central lands; great achievement for twenty years, light fixed in the records.',
    idiomatic: 'Twenty years of martial achievement are recorded in history.',
  },
  s1452: {
    literal: 'North beyond Yin Mountain, south beyond malarial seas, east to Jieshi, west to flowing sand—all living kinds none not pleased to attach.',
    idiomatic: 'From Yin Mountain to the seas, east to west, all peoples submitted.',
  },
  s1453: {
    literal: 'How much more Our own dimness, peril yet obtaining preservation!"',
    idiomatic: 'The emperor owed his survival to the Prince.',
  },
  s1454: {
    literal: 'Now above We observe heavenly signs, below human desire—this is the earth virtue\'s ultimate end and metal\'s portent responding in season.',
    idiomatic: 'Heaven and the people showed earth\'s cycle ending and metal rising.',
  },
  s1455: {
    literal: 'Moreover within ten years the comet thrice appeared; renewing and removing the old has clear signs; songs of praise return to sagely virtue."',
    idiomatic: 'Three comets in ten years showed renewal; praise settled on the Prince.',
  },
  s1456: {
    literal: 'Now We send Bearer of the Staff, Grand Master of the Silver Seal and Blue Robe, Defender Vice Director Zhang Wenwei and others, bearing the imperial seal and cord, respectfully yielding the throne."',
    idiomatic: 'Zhang Wenwei and others bore the seal to yield the throne.',
  },
  s1457: {
    literal: 'Alas!',
    idiomatic: 'Ah!',
  },
  s1458: {
    literal: 'Heaven\'s calendar is upon your person; faithfully hold the center; Heaven\'s emolument ends forever.',
    idiomatic: 'Heaven\'s mandate is yours; hold the center; may fortune endure.',
  },
  s1459: {
    literal: 'Prince, respectfully display the great rites, enjoy these myriad states, solemnly receive Heaven\'s mandate."',
    idiomatic: 'Receive the mandate, perform the great rites, and rule the myriad states.',
  },
  s1460: {
    literal: '"',
    idiomatic: 'The investiture concluded.',
  },
  s1461: {
    literal: 'Quanzhong founded his state and made the emperor Prince of Jiyin, moving him to Cao Prefecture to the former prefect\'s residence of Shi Shuzong.',
    idiomatic: 'Quanzhong made him Prince of Jiyin and moved him to Cao, to Shi Shuzong\'s old residence.',
  },
  s1462: {
    literal: 'At that time Taiyuan, Youzhou, Fengxiang, and Xichuan still used the Tianyou reign era.',
    idiomatic: 'Taiyuan, You, Fengxiang, and Shu still kept the Tianyou era.',
  },
  s1463: {
    literal: 'On the twenty-first day of the second month the emperor was killed by Quanzhong; he was seventeen; posthumous title Emperor Ai; buried by princely rites at Dingtao in Jiyin.',
    idiomatic: 'On the twenty-first of the second month Quanzhong killed the seventeen-year-old emperor Ai; he was buried at Dingtao with princely rites.',
  },
  s1464: {
    literal: 'At the beginning of the restoration, suburban rites were prepared and the divination changed, then stopped because of national mourning.',
    idiomatic: 'Early restoration had prepared suburban rites, then halted for mourning.',
  },
  s1465: {
    literal: 'In Mingzong\'s time a park was established at the old tomb; the responsible office requested posthumous title Illustrious, Proclaiming, Bright, Fiery, Filial Emperor, temple name "Jingzong."',
    idiomatic: 'Mingzong later sought temple name Jingzong and a fuller posthumous title.',
  },
  s1466: {
    literal: 'The Secretariat re-memorialized that the young emperor\'s conduct did not fit calling him "zong"; the posthumous title alone was kept.',
    idiomatic: 'The Secretariat said a child emperor should not be called zong—only the posthumous title remained.',
  },
  s1467: {
    literal: 'Those who know ritual also held the Xuan and Jing parts of the posthumous title improper; now only the original posthumous title is recorded in the annals."',
    idiomatic: 'Ritualists too found parts of the title improper; only the original title is recorded here.',
  },
  s1468: {
    literal: '[Commentary] The historian says: How lamentable!',
    idiomatic: '[Commentary] The historian writes: How lamentable!',
  },
  s1469: {
    literal: 'When the earth\'s fortune was about to perish, the five constants were nearly exhausted and a hundred prodigies appeared; the realm was carved up and the imperial design dissolved.',
    idiomatic: 'As Tang\'s earth fortune failed, constants collapsed, omens multiplied, and the realm split apart.',
  },
  s1470: {
    literal: 'Emperor Zhaozong\'s heroic plans flared up and his will was indignant at decline; he sought extraordinary talents on every side, wishing to rescue a drowning fate.',
    idiomatic: 'Zhaozong sought heroes everywhere to save a drowning dynasty.',
  },
  s1471: {
    literal: 'Yet the age\'s path was mostly perverse and loyalty and righteousness together perished; he exhausted noble rank to await worthies and spent treasures to entrust his inner heart.',
    idiomatic: 'Yet loyalty died; he heaped rank and treasure on those he trusted.',
  },
  s1472: {
    literal: 'Earnest as treating a nation\'s scholar, yet rarely finding one who would entrust orphans; when fodder was plentiful dogs and pigs grew fierce; when meat was full tigers and wolves grew more brutal.',
    idiomatic: 'He treated men as national scholars but found no true guardians; fed, his wolves turned fiercer.',
  },
  s1473: {
    literal: 'The Five Marquises and Nine Earls were all men who asked about the cauldrons;',
    idiomatic: 'Marquises and earls all coveted the throne;',
  },
  s1474: {
    literal: 'the Four Peaks and Ten Links all harbored traces of lacking a ruler.',
    idiomatic: 'great lords all acted without a sovereign.',
  },
  s1475: {
    literal: 'Though screen ministers wrung wrists and hall aides grieved at heart, they bore empty grief of a ruined house—how could they rescue the calamity of a lost state?',
    idiomatic: 'Ministers grieved but could not save the state.',
  },
  s1476: {
    literal: 'When he went west to Fufeng and the eastern capital migrated, it was like lodging pearls at a robber\'s door and storing water on Wei\'s tail—gone and not returning; what more can be said!',
    idiomatic: 'West to Fufeng and eastward migration were like giving pearls to robbers—there was no return.',
  },
  s1477: {
    literal: 'As for rivers exhausted and mountains collapsed, ancient and modern sigh together;',
    idiomatic: 'Rivers dry and mountains fall—ancient and modern alike sigh;',
  },
  s1478: {
    literal: 'tigers contending and dragons battling, rise and fall without constancy.',
    idiomatic: 'tiger-and-dragon struggle shifts dynasties without end.',
  },
  s1479: {
    literal: 'Even the unkind who open boxes have a way in seizing gold.',
    idiomatic: 'Even thieves seize power by some logic.',
  },
  s1480: {
    literal: 'Cao Cao requested punishment at Jiaohu—because he was pressed by hidden plot;',
    idiomatic: 'Cao Cao sought punishment at Jiaohu under conspiracy\'s pressure;',
  },
  s1481: {
    literal: 'Sima Zhao refused orders at Lingyun—embarrassed at being attacked.',
    idiomatic: 'Sima Zhao defied orders at Lingyun when cornered.',
  },
  s1482: {
    literal: 'Truly knowing ugly traces, one may thereby have words—but what Quanzhong carried out stopped at cruelty.',
    idiomatic: 'Earlier usurpers had excuses; Quanzhong was simply cruel.',
  },
  s1483: {
    literal: 'Moreover from moving from Qi to Luo the Son of Heaven stood alone; the Six Armies was wholly expelled by Qin men; on four sides all were ringed by Bian troops.',
    idiomatic: 'After the move to Luoyang the emperor stood alone, Qin troops held the Six Armies, and Bian soldiers surrounded him.',
  },
  s1484: {
    literal: 'The imperial regalia was like lodged; the slightest matter bred doubt; welcoming the imperial carriage did not reach one morning before blades were heard on the road.',
    idiomatic: 'The throne was nominal; doubt was constant; murder came before the emperor could be escorted.',
  },
  s1485: {
    literal: 'He established a successor on the south face and killed the empress dowager in the inner quarters; yellow gates and forbidden guards were all destroyed; the imperial clan and officials in caps and robes perished together.',
    idiomatic: 'A puppet successor was set up, the empress dowager killed, guards and clan slaughtered.',
  },
  s1486: {
    literal: 'Again he stole the bell and covered his ears, marrying calamity to others.',
    idiomatic: 'He stole the bell and blamed others for his crimes.',
  },
  s1487: {
    literal: 'Why did the nine-six number reach its end and Heaven and man\'s way exhaust together—seeing this disorder, to speak of it wounds the heart.',
    idiomatic: 'Fate and the way of heaven ended together—the sight wounds the heart.',
  },
  s1488: {
    literal: 'In Emperor Ai\'s time, government came from a vicious clan.',
    idiomatic: 'Under Emperor Ai, vicious clans held power.',
  },
  s1489: {
    literal: 'Though yielding edicts resembled Shanyang;',
    idiomatic: 'Abdication edicts resembled Emperor Xian of Han;',
  },
  s1490: {
    literal: 'yet the power of coercion and pressure exceeded Hou Jing.',
    idiomatic: 'but coercion exceeded even Hou Jing.',
  },
  s1491: {
    literal: 'Human conduct daily thinned and hidden retribution was hard to seek—yet to end thus, how could life be prolonged!',
    idiomatic: 'Morality collapsed; ending so, how could the emperor live long?',
  },
  s1492: {
    literal: 'Praise says: Yao and Shun received the Mandate; yielding announced the end.',
    idiomatic: 'Praise: Yao and Shun took the Mandate by yielding.',
  },
  s1493: {
    literal: 'Taking by rebellion yet guarding by compliance—the humane way was already exhausted.',
    idiomatic: 'Seizing by force and ruling by pretense exhausted the humane way.',
  },
  s1494: {
    literal: 'Violence then short fortune; righteousness then prolonged greatness.',
    idiomatic: 'Violence brings short reigns; righteousness long ones.',
  },
  s1495: {
    literal: 'The calamity of the guest of Yu was not limited to one clan.',
    idiomatic: 'The guest-of-Yu calamity was not unique to one house.',
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
if (data.metadata.chapter !== '020') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 020; standalone T ready (${Object.keys(T).length} entries).`
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
