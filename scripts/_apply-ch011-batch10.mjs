#!/usr/bin/env node
/** Batch 10: s0901–s0985 (Jiutangshu ch.011, Daizong — Dali 13–14 — death, posthumous title, historian appraisal and eulogy) */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 901;
const END = 985;

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
  s0901: {
    literal:
      'On jiachen, Huzhou prefect Yan Zhenqing was made minister of punishments.',
    idiomatic:
      'On jiachen, Yan Zhenqing became minister of punishments.',
  },
  s0902: {
    literal:
      'On yisi, because of long rain the regular court officials were amnestied; censors were forbidden to mark absences.',
    idiomatic:
      'On yisi, long rain brought amnesty for regular officials and barred censors from marking absences.',
  },
  s0903: {
    literal:
      'Ninth month, yimao: Yuan Zai was permitted burial as a commoner.',
    idiomatic:
      'On yimao, Yuan Zai was allowed a commoner\'s funeral.',
  },
  s0904: {
    literal:
      'On xinyou, Jingyuan deputy commissioner Duan Xiushi was made Four Garrisons-Northern Court field commissioner and Jingyuan-Zheng-Ying military commissioner.',
    idiomatic:
      'On xinyou, Duan Xiushi took the Four Garrisons and Jingyuan-Zheng-Ying commands.',
  },
  s0905: {
    literal:
      'On gengwu, Tibet raided Fangzhou and drove off Tangut sheep and horses.',
    idiomatic:
      'On gengwu Tibet raided Fang and carried off Tangut herds.',
  },
  s0906: {
    literal:
      'That autumn Song, Bo, Chen, and Hua flooded.',
    idiomatic:
      'That autumn floods struck Song, Bo, Chen, and Hua.',
  },
  s0907: {
    literal:
      'Winter, tenth month, dinghai: Vice Minister of Revenue and fiscal commissioner Han Huang reported auspicious salt at the two Jie county ponds; a shrine was established, titled the Baoying Spirit-Blessing Pond.',
    idiomatic:
      'On dinghai, Han Huang reported miracle salt at Jie and founded the Baoying Spirit-Blessing shrine.',
  },
  s0908: {
    literal:
      'Night of renyin, the moon occulted Mao and also entered the Supreme Palace Enclosure.',
    idiomatic:
      'On the night of renyin the moon occulted Mao and entered the Supreme Palace.',
  },
  s0909: {
    literal:
      'On yisi, Hua guard officer Liu Qia was made Song prefect.',
    idiomatic:
      'On yisi, Liu Qia of Hua became Song prefect.',
  },
  s0910: {
    literal:
      'Capital metropolitan prefect Li Gan reported thirty-one thousand mu of flood-damaged fields.',
    idiomatic:
      'Li Gan reported thirty-one thousand mu of fields ruined by flood.',
  },
  s0911: {
    literal:
      'Fiscal commissioner Han Huang memorialized the damage was not great.',
    idiomatic:
      'Han Huang said the damage was slight.',
  },
  s0912: {
    literal:
      'Concurrent Weinan magistrate Liu Zao curried favor with Huang and likewise said fields in his district were undamaged.',
    idiomatic:
      'Weinan magistrate Liu Zao, flattering Huang, denied any local damage.',
  },
  s0913: {
    literal:
      'Censor Zhao Ji inspected Weinan fields and also followed Huang in saying undamaged.',
    idiomatic:
      'Censor Zhao Ji inspected Weinan and also denied damage.',
  },
  s0914: {
    literal:
      'The emperor said: "Flood and drought should be equal—Weinan alone should not be exempt.',
    idiomatic:
      'The emperor said: "Flood and drought ought to fall on all alike—Weinan cannot stand alone.',
  },
  s0915: {
    literal:
      '" Censor Zhu Ao was again ordered to inspect; Weinan damaged fields three thousand mu.',
    idiomatic:
      'Zhu Ao found three thousand mu ruined in Weinan."',
  },
  s0916: {
    literal:
      'The emperor sighed and said: "A magistrate\'s duty is to cherish the people; even if undamaged he should claim damage—if damaged and unreported, where is compassionate care!',
    idiomatic:
      'He sighed: "A magistrate should shield the people—even without damage he should report some; to hide real loss is cruelty.',
  },
  s0917: {
    literal:
      'Liu Zao and Zhao Ji were both demoted."',
    idiomatic:
      'He demoted Liu Zao and Zhao Ji."',
  },
  s0918: {
    literal:
      'Eleventh month, guichou: Venus stood at the Weeping star.',
    idiomatic:
      'On guichou Venus stood at the Weeping star.',
  },
  s0919: {
    literal:
      'Night of yimao, the moon entered the Feathered Forest.',
    idiomatic:
      'On the night of yimao the moon entered the Feathered Forest.',
  },
  s0920: {
    literal:
      'On guiyou, right regular cavalry attendant Xiao Xin was made minister of works.',
    idiomatic:
      'On guiyou, Xiao Xin became minister of works.',
  },
  s0921: {
    literal:
      'Minister of Punishments Yan Zhenqing presented his work Rhyme Sea Mirror Source in 360 juan.',
    idiomatic:
      'Yan Zhenqing presented his 360-juan Rhyme Sea Mirror Source.',
  },
  s0922: {
    literal:
      'Twelfth month, dinghai: western Sichuan Cui Ning memorialized defeating one hundred thousand Tibet west of the mountains, eight thousand heads, nine hundred captives.',
    idiomatic:
      'On dinghai, Cui Ning reported crushing one hundred thousand Tibetans west of the mountains.',
  },
  s0923: {
    literal:
      'On jihai, logging and hunting at all immortal grottoes and numinous sites in the realm were forbidden.',
    idiomatic:
      'On jihai the court banned logging and hunting at sacred sites empire-wide.',
  },
  s0924: {
    literal:
      'On gengzi, Youzhou commissioner Zhu Ci was made concurrent Longyou deputy commander and acting commissioner of Hexi and Ze-Lu field armies.',
    idiomatic:
      'On gengzi, Zhu Ci also took Longyou and field command over Hexi and Ze-Lu.',
  },
  s0925: {
    literal:
      'The capital metropolitan prefect asked to repair the Six-Gate weir; approved.',
    idiomatic:
      'The capital prefect won approval to repair the Six-Gate weir.',
  },
  s0926: {
    literal:
      'Dali 13, spring, first month, wushen new moon.',
    idiomatic:
      'Dali 13 opened on the wushen new moon of the first spring month.',
  },
  s0927: {
    literal:
      'On xinyou, more than eighty mills on the White Canal were destroyed to restore irrigation to farmland.',
    idiomatic:
      'On xinyou, eighty White Canal mills were torn down to free water for fields.',
  },
  s0928: {
    literal:
      'On renxu, Minister of Punishments and Duke of Lu Yan Zhenqing thrice memorialized begging retirement; not permitted.',
    idiomatic:
      'On renxu, Yan Zhenqing thrice asked to retire and was refused.',
  },
  s0929: {
    literal:
      'Ziqing commissioner Li Zhengji asked to be entered in the imperial genealogy; approved.',
    idiomatic:
      'Li Zhengji was allowed to enter the imperial clan register.',
  },
  s0930: {
    literal:
      'On wuchen, Uyghurs raided Taiyuan; Bao Fang fought them; our army was unfavorable.',
    idiomatic:
      'On wuchen, Uyghurs raided Taiyuan and Bao Fang was beaten.',
  },
  s0931: {
    literal:
      'Zhu Ci\'s enfeoffment was changed to Prince of Suining commandery.',
    idiomatic:
      'Zhu Ci was retitled Prince of Suining.',
  },
  s0932: {
    literal:
      'Second month, gengchen: Dai prefect Zhang Guangcheng struck Uyghurs at Yangwu Valley and broke them; the northerners were then calm.',
    idiomatic:
      'On gengchen, Zhang Guangcheng routed the Uyghurs at Yangwu Valley.',
  },
  s0933: {
    literal:
      'On jihai, Tibet raided Lingwu.',
    idiomatic:
      'On jihai Tibet raided Lingwu.',
  },
  s0934: {
    literal:
      'On jiachen, at the ministry of imperial stud\'s Buddha hall a small hollow gilt guardian\'s right arm suddenly dripped black fluid; paper caught it—the color was like blood.',
    idiomatic:
      'On jiachen, black fluid like blood dripped from a gilt guardian\'s arm in the stud\'s Buddha hall.',
  },
  s0935: {
    literal:
      'Third month, jiaxu: Heyang soldiers robbed Uyghur baggage, fought them, and plundered freely for a long time before order returned.',
    idiomatic:
      'On jiaxu, Heyang troops looted Uyghur baggage, fought them, and rioted for days.',
  },
  s0936: {
    literal:
      'Fourth month, dinghai: Zhexi acting observation commissioner Li Daochang was made Suzhou prefect, concurrent acting censor-in-chief, and Zhexi all-training observation commissioner.',
    idiomatic:
      'On dinghai, Li Daochang became Suzhou prefect and Zhexi commissioner.',
  },
  s0937: {
    literal:
      'On jichou, former Zhexi commissioner Li Han was made censor-in-chief.',
    idiomatic:
      'On jichou, Li Han became censor-in-chief.',
  },
  s0938: {
    literal:
      'On jiachen, Tibet raided Lingzhou; Shuofang acting commissioner Chang Qianguang defeated them.',
    idiomatic:
      'On jiachen, Tibet raided Ling and Chang Qianguang drove them off.',
  },
  s0939: {
    literal:
      'Fifth month, wuwu: eunuch Liu Qingtan was granted the name Zhongyi.',
    idiomatic:
      'On wuwu, the eunuch Liu Qingtan received the name Zhongyi.',
  },
  s0940: {
    literal:
      'Sixth month, wuxu: Longyou commissioner Zhu Ci at officer Zhao Gui\'s house obtained a cat and rat nursing together without harm; caged and presented.',
    idiomatic:
      'On wuxu, Zhu Ci presented a cat and rat nursing together from Zhao Gui\'s house.',
  },
  s0941: {
    literal:
      'Autumn, seventh month, renzi: drafting secretary Cui Youfu was put in charge of personnel selection.',
    idiomatic:
      'On renzi, Cui Youfu took charge of appointments.',
  },
  s0942: {
    literal:
      'On guichou, Jiannan commissioner Cui Ning was made acting grand master; eastern Sichuan Li Shuming was made acting minister of works.',
    idiomatic:
      'On guichou, Cui Ning became acting grand master and Li Shuming acting minister of works.',
  },
  s0943: {
    literal:
      'On xinwei, Tibet raided Yan and Qing.',
    idiomatic:
      'On xinwei Tibet raided Yan and Qing.',
  },
  s0944: {
    literal:
      'Eighth month, jiaxu new moon: Chengde commissioner Li Baochen submitted a memorial asking to restore his original surname Zhang; approved.',
    idiomatic:
      'On the jiaxu new moon, Li Baochen was allowed to resume the surname Zhang.',
  },
  s0945: {
    literal:
      'Winter, tenth month, dingyou: Empress Zhenyi was buried at Zhuang tomb.',
    idiomatic:
      'On dingyou, Empress Zhenyi was buried at Zhuangling.',
  },
  s0946: {
    literal:
      'Eleventh month, dingmao: on the winter solstice the offices sacrificed to the Supreme Lord of Heaven at the southern suburb; the emperor did not hold court for this reason.',
    idiomatic:
      'On dingmao, the southern suburb rites for the solstice kept the emperor from court.',
  },
  s0947: {
    literal:
      'Twelfth month, bingxu: Minister of Personnel Liu Yan was made left vice director, fiscal commissioner as before.',
    idiomatic:
      'On bingxu, Liu Yan became left vice director while keeping the fiscal portfolio.',
  },
  s0948: {
    literal:
      'Drafting attendant Du Ya was made Hongzhou prefect, concurrent acting censor-in-chief, and Jiangxi observation commissioner.',
    idiomatic:
      'Du Ya became Hongzhou prefect and Jiangxi commissioner.',
  },
  s0949: {
    literal:
      'Jiangxi observation commissioner Lu Sigong was made minister of war.',
    idiomatic:
      'Lu Sigong of Jiangxi became minister of war.',
  },
  s0950: {
    literal:
      'That year at Huangqin mountain in Chenzhou the mountain collapsed and several hundred were crushed to death.',
    idiomatic:
      'That year a Chenzhou landslide killed hundreds on Huangqin mountain.',
  },
  s0951: {
    literal:
      'Dali 14, spring, first month, renyin new moon.',
    idiomatic:
      'Dali 14 opened on the renyin new moon of the first spring month.',
  },
  s0952: {
    literal:
      'On renxu, Chuzhou prefect Li Bi was made Li prefect.',
    idiomatic:
      'On renxu, Li Bi was transferred from Chu to Li.',
  },
  s0953: {
    literal:
      'Second month, guiwei: Weibo seven-prefecture commissioner, grand master, acting left vice director, fellow grand councilor, and Wei chief administrator Tian Chengsi died.',
    idiomatic:
      'On guiwei, Tian Chengsi of Weibo, fellow grand councilor, died.',
  },
  s0954: {
    literal:
      'On jiashen, Weibo central army military commissioner and left aide Tian Yue was made concurrent acting censor-in-chief and acting Weibo commissioner.',
    idiomatic:
      'On jiashen, Tian Yue became acting Weibo commissioner.',
  },
  s0955: {
    literal:
      'Third month, dingwei: Bian-Song commissioner Li Zhongchen was driven out by his officer and clansman Li Xilie; Zhongchen fled in distress to court.',
    idiomatic:
      'On dingwei, Li Xilie expelled Li Zhongchen from Bian-Song; Zhongchen fled to court.',
  },
  s0956: {
    literal:
      'Because Zhongchen had merit for the state, he was made acting grand master and fellow grand councilor.',
    idiomatic:
      'The court made the disgraced Zhongchen grand councilor for past service.',
  },
  s0957: {
    literal:
      'On gengxu, Henan metropolitan prefect Yan Yun became capital metropolitan prefect; Hezhong junior metropolitan prefect and acting administrator Zhao Huibo became Henan metropolitan prefect.',
    idiomatic:
      'On gengxu, Yan Yun became capital prefect and Zhao Huibo took Henan.',
  },
  s0958: {
    literal:
      'On xinyou, former Rongguan pacification commissioner and Rong prefect Wang Hong was made Hezhong junior metropolitan prefect and acting administrator.',
    idiomatic:
      'On xinyou, Wang Hong became acting Hezhong administrator.',
  },
  s0959: {
    literal:
      'Summer, fourth month, guiwei: Chengde commissioner Zhang Baochen again asked to take the surname Li; approved.',
    idiomatic:
      'On guiwei, Zhang Baochen was again allowed the surname Li.',
  },
  s0960: {
    literal:
      'Fifth month, guimao: the emperor was unwell; until xinhai he did not hold court.',
    idiomatic:
      'From guimao through xinhai of the fifth month illness kept him from court.',
  },
  s0961: {
    literal:
      'Northern capital guardian Bao Fang because the Northern Court returned to allegiance.',
    idiomatic:
      'Bao Fang of Taiyuan welcomed the Northern Court\'s return to allegiance.',
  },
  s0962: {
    literal:
      'On xinyou, an edict had the crown prince oversee the realm.',
    idiomatic:
      'On xinyou the crown prince was ordered to oversee the realm.',
  },
  s0963: {
    literal:
      'That evening the emperor died in the inner hall of Zichen.',
    idiomatic:
      'That night he died in the Zichen inner hall.',
  },
  s0964: {
    literal:
      'The testamentary edict had the crown prince succeed before the coffin.',
    idiomatic:
      'His will ordered the crown prince to succeed before the bier.',
  },
  s0965: {
    literal:
      'On renxu the spirit coffin was moved to Taiji Hall and mourning was proclaimed.',
    idiomatic:
      'On renxu the coffin was placed in Taiji Hall and mourning began.',
  },
  s0966: {
    literal:
      'Eighth month, gengshen: the hundred officials submitted the honorific title Sagacious Culture Filial Martial Emperor; temple name Daizong.',
    idiomatic:
      'On gengshen the court gave him the posthumous title Sagacious Culture Filial Martial and temple name Daizong.',
  },
  s0967: {
    literal:
      'Tenth month, jiyou: burial at Yuan tomb.',
    idiomatic:
      'On jiyou of the tenth month he was buried at Yuanling.',
  },
  s0968: {
    literal:
      'Twelfth month, dingyou: enshrined in the imperial temple.',
    idiomatic:
      'On dingyou his tablet entered the ancestral temple.',
  },
  s0969: {
    literal:
      '【Historian\'s appraisal】The historian says: Alas, when the way of governance fails, it is like a river breaking its golden dike or fire blazing on Kunwu mountain—even if divine Yu rode the four conveyances and Dark Lord poured the eight seas, he could not dam the flood or smother the flames. Why?',
    idiomatic:
      '【Historian\'s appraisal】The historian writes: When governance fails, it is like a breached dike or a mountain fire—even Yu himself could not hold back the flood once the breach widens. Why?',
  },
  s0970: {
    literal:
      'Truly because once the situation is ruined it cannot be swiftly rescued.',
    idiomatic:
      'Because once the breach opens, rescue comes too late.',
  },
  s0971: {
    literal:
      'Consider Kaiyuan\'s governance: it held the six directions in check and made the hundred barbarians gallop;',
    idiomatic:
      'Under Kaiyuan the throne mastered the realm and drove the hundred tribes;',
  },
  s0972: {
    literal:
      'when the Tianbao disorder came, the Son of Heaven could not hold the two capitals and the feudatories could not secure the nine pastures.',
    idiomatic:
      'under Tianbao the emperor lost both capitals and the provinces could not keep order.',
  },
  s0973: {
    literal:
      'Thus one knows that whoever holds the realm cannot neglect the way of governance!',
    idiomatic:
      'Whoever holds the realm cannot neglect how it is ruled.',
  },
  s0974: {
    literal:
      'When Minghuang lost the reins, An Lushan twice seized the Yellow River lands;',
    idiomatic:
      'When Xuanzong lost control, An Lushan twice took the heartland;',
  },
  s0975: {
    literal:
      'when Dali lost the reins, Pugu Huai\'en guided the dog barbarians as native scouts.',
    idiomatic:
      'under Dali, Pugu Huai\'en led the Uyghurs against the throne.',
  },
  s0976: {
    literal:
      'From the three rebels\' alliance the nine provinces boiled; soldiers greased the wilds and the people were spent on transport; households mourned each other and life was unbearable—yet Ziyi wept over levies and Yuan Zai grieved over fleeing barbarians.',
    idiomatic:
      'Rebellion scorched the provinces; armies and transport drained the people—yet Guo Ziyi wept over taxes and Yuan Zai over Tibetan raids.',
  },
  s0977: {
    literal:
      'Yet Emperor Daizong, young amid disorder, old in the camps, knew human deceit and the hardship of harvests; within were Li and Guo\'s loyalty, without the fortune of border trade with the western barbarians.',
    idiomatic:
      'Daizong, raised in war, knew deceit and famine; he had Li and Guo within and border trade without.',
  },
  s0978: {
    literal:
      'Thus the vicious chiefs sent heads and rebels changed heart; Guanfu was pacified and the steppe barbarians gradually calmed.',
    idiomatic:
      'Rebel heads came in and the frontiers quieted.',
  },
  s0979: {
    literal:
      'As for bearing Fuguo\'s evil, debating Yuan Zhen\'s crime, removing Chao\'en\'s power without cruel punishment and making them blame themselves—this too was the intent of law that weighs merit.',
    idiomatic:
      'He endured Fuguo, judged Yuan Zhen, and stripped Chao\'en without torture—mercy within justice.',
  },
  s0980: {
    literal:
      'He blamed himself to mourn Pugu, ceased music to grieve Tian Shenggong, punished Jin and Zai\'s treachery, valued Gai and Wan\'s scholarship, cultivated himself to answer star omens and bowed his person to acknowledge calamities—ancient sage rulers did not reach this.',
    idiomatic:
      'He mourned Huai\'en, honored Shenggong, purged Zai, elevated Gai and Wan, and humbled himself before omens—sage kings did no more.',
  },
  s0981: {
    literal:
      'Yet Li Lingyao still made trouble and Tian Chengsi betrayed grace; when generals marched, armies were worn and taxes exhausted—perhaps the yang ninth had not yet turned fair; how could it be only the ruler\'s fault!',
    idiomatic:
      'Yet Lingyao and Chengsi still rebelled and campaigns still drained the realm—the age was not yet fair; not every fault was the emperor\'s alone.',
  },
  s0982: {
    literal:
      '【Eulogy】Bandits still blocked the roads; the many barbarians vied to invade.',
    idiomatic:
      '【Eulogy】Bandits blocked the roads; barbarians pressed on every side.',
  },
  s0983: {
    literal:
      'Fierce warriors tasted gall; loyal ministers ached in heart.',
    idiomatic:
      'Warriors braced themselves; loyal ministers grieved.',
  },
  s0984: {
    literal:
      'Sweeping away foul vapors, spreading virtuous pronouncements.',
    idiomatic:
      'He swept away ruin and spread mercy in edicts.',
  },
  s0985: {
    literal:
      'Extending great blessing and receiving blessing—how deep the emperor\'s concern!',
    idiomatic:
      'He sought blessing for the realm—how deep his care!',
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
if (data.metadata.chapter !== '011') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 011; standalone T ready (${Object.keys(T).length} entries).`
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
