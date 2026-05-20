#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "On jiaxu an edict: \"Chengde military commissioner Wang Chengzong, since washing away flaws, has been repeatedly rewarded and promoted, placed in the duty of the frontier screen, treated as a loyal and upright man.\"",
    idiomatic: "An edict against Wang Chengzong began:",
  },
  s0302: {
    literal: "We said he would cherish the grace of ruler and father and strive to fulfill a minister's integrity.",
    idiomatic: "\"We treated him as a loyal vassal.\"",
  },
  s0303: {
    literal: "Yet he constantly thought to abandon his charge and indulged an unrighteous heart — arrogant, fierce, contrary to norm, insulting and lawless without fear.",
    idiomatic: "\"Instead he turned arrogant and lawless.\"",
  },
  s0304: {
    literal: "Because his forebears once stood in loyal merit, each time we thought to contain and pardon, hoping to hear repentance and reform.",
    idiomatic: "\"His ancestors' merit bought him repeated pardon.\"",
  },
  s0305: {
    literal: "He never knew that secret plots and rebellious conduct, long continued, grow ever clearer;",
    idiomatic: "\"His plots only grew clearer.\"",
  },
  s0306: {
    literal: "vicious conduct and the engine of disaster, full, overturns itself.",
    idiomatic: "\"His wickedness finally overflowed.\"",
  },
  s0307: {
    literal: "He dared lightly and wildly to point and revile, rashly submitting memorials, secretly sending traitors, inwardly bearing blades, murdering the chief minister and poisoning and wounding the censor-in-chief, indulging his fierce cruelty without regard.",
    idiomatic: "\"He murdered Wu Yuanheng and wounded Pei Du without restraint.\"",
  },
  s0308: {
    literal: "Pursuing the matter to the end, his crimes are clear; reading the full indictment, we are truly appalled.",
    idiomatic: "\"His guilt is now plain and appalling.\"",
  },
  s0309: {
    literal: "His court tribute is to be cut off; his circuits' Boye and Leshou two counties, originally belonging to Fanyang, are to be returned to Liu Zong's jurisdiction.\"",
    idiomatic: "Tribute was cut and two counties returned to Liu Zong.",
  },
  s0310: {
    literal: "Commandant of Escorts Wang Chengsi, Crown Prince Companion Wang Chengdi, Danwang Mansion staff officer Wang Chengrong, and others are all to be settled in distant prefectures.\"",
    idiomatic: "Chengzong's kin were exiled to distant posts. Thus ended the edict.",
  },
  s0311: {
    literal: "Earlier Chengzong had submitted a memorial blaming Wu Yuanheng; it was kept within and not answered.",
    idiomatic: "Chengzong's earlier blame of Wu Yuanheng had been suppressed.",
  },
  s0312: {
    literal: "He again wildly pointed and reviled; the Emperor had his memorial shown to the hundred officials — all the ministers requested punishment.",
    idiomatic: "His new insults were shown to ministers, who demanded punishment.",
  },
  s0313: {
    literal: "On bingxu Jingyuan military commissioner Li Hui died; Master of Works Wang Qian was made Jing prefect and Four Garrisons Northern March Jingyuan military commissioner.",
    idiomatic: "On bingxu Li Hui died; Wang Qian took Jingyuan.",
  },
  s0314: {
    literal: "On yiwei Pei Wu, Jingzhao intendant, was made Minister of Agriculture — for slackness in capturing assassins.",
    idiomatic: "On yiwei Pei Wu was demoted to Agriculture for failing to catch assassins.",
  },
  s0315: {
    literal: "Eighth month, jihai new moon — the sun was eclipsed.",
    idiomatic: "The eighth month opened with a solar eclipse.",
  },
  s0316: {
    literal: "On bingyin Kaling sent envoys presenting monk robes, five-colored parrots, bhramara birds, and exotic incense and precious objects.",
    idiomatic: "On bingyin Kaling sent exotic birds and treasures.",
  },
  s0317: {
    literal: "On dingwei Ziqing military commissioner Li Shidao secretly plotted with Songshan monk Yuanjing to rebel; several hundred braves lay in ambush at Luoyang's eastern memorial court — when the eastern capital lacked troops they meant to seize the moment, burn the palaces, and plunder wildly.",
    idiomatic: "Li Shidao plotted with monk Yuanjing to burn Luoyang when troops were away.",
  },
  s0318: {
    literal: "Junior officers Chang Jin and Li Zaixing reported the plot; guardian Lü Yuanying then sent troops to surround them; the rebels broke out and fled into Songshan; mountain huts captured them all.",
    idiomatic: "Lü Yuanying crushed the plot after Chang Jin and Li Zaixing informed.",
  },
  s0319: {
    literal: "On interrogation the ringleader was monk Yuanjing.",
    idiomatic: "Yuanjing was named the mastermind.",
  },
  s0320: {
    literal: "At execution the monk sighed: \"You have ruined my affair — you could not let Luoyang bleed!",
    idiomatic: "At the block Yuanjing cried that his plot had failed to make Luoyang bleed.",
  },
  s0321: {
    literal: "\"",
    idiomatic: "Thus ended his words.",
  },
  s0322: {
    literal: "Ninth month, guiyou — Xuanwu military commissioner Han Hong was made overall commander of the Huaixi campaign armies.",
    idiomatic: "In the ninth month Han Hong commanded the Huaixi front.",
  },
  s0323: {
    literal: "On dingyou Crown Prince Guest Han Gao was made Minister of War.",
    idiomatic: "On dingyou Han Gao became Minister of War.",
  },
  s0324: {
    literal: "Winter, tenth month, gengzi — Shannan East was first divided into two circuits; Vice Minister of Revenue Li Xun was made Xiang prefect and Xiang-Fu-Ying-Jun-Fang military commissioner;",
    idiomatic: "In the tenth month Shannan East split; Li Xun took the western half.",
  },
  s0325: {
    literal: "Right Forest general Gao Xiayu was made Tang prefect and Tang-Sui-Deng military commissioner.",
    idiomatic: "Gao Xiayu took Tang-Sui-Deng.",
  },
  s0326: {
    literal: "Minister of Justice Quan Deyu memorialized requesting use of the newly revised thirty-scroll Statutes and Ordinances; it was approved.",
    idiomatic: "Quan Deyu's revised Statutes in thirty scrolls were adopted.",
  },
  s0327: {
    literal: "On renzi Crown Prince Guest Yu Di was made Minister of Revenue.",
    idiomatic: "On renzi Yu Di returned as Minister of Revenue.",
  },
  s0328: {
    literal: "Eleventh month, wuchen — an edict released 550,000 bolts of palace silk and damask for the army.",
    idiomatic: "In the eleventh month 550,000 bolts were issued to the armies.",
  },
  s0329: {
    literal: "On yihai Yan Shou, Shannan East military commissioner, was made Crown Prince Junior Tutor.",
    idiomatic: "On yihai Yan Shou became crown prince tutor.",
  },
  s0330: {
    literal: "On wuyin bandits burned Xianling's mausoleum hall.",
    idiomatic: "On wuyin rebels burned Xianling.",
  },
  s0331: {
    literal: "An edict dispatched two thousand Zhenwu troops to join Yiwu in attacking Wang Chengzong.",
    idiomatic: "Zhenwu and Yiwu were ordered against Chengzong.",
  },
  s0332: {
    literal: "Twelfth month, renyin night — Venus transgressed Saturn.",
    idiomatic: "On a winter night Venus crossed Saturn.",
  },
  s0333: {
    literal: "On jiachen Li Yuan defeated nine thousand of Li Shidao's troops and beheaded two thousand.",
    idiomatic: "On jiachen Li Yuan slew two thousand of Li Shidao's men.",
  },
  s0334: {
    literal: "On renzi Eastern Capital guardian Lü Yuanying requested permission to recruit Sanhe youths to guard the palace city.",
    idiomatic: "On renzi Lü Yuanying sought local Sanhe youths to guard Luoyang.",
  },
  s0335: {
    literal: "On jiayin Yuezhou restored Shanyin county.",
    idiomatic: "On jiayin Shanyin county was restored.",
  },
  s0336: {
    literal: "On gengshen new south-pointing chariots and mile-drums were made.",
    idiomatic: "On gengshen new south-pointing chariots and mile-drums were built.",
  },
  s0337: {
    literal: "Seventy-two palace women were placed in capital temples and monasteries; those with families were sent home.",
    idiomatic: "Seventy-two palace women were released to temples or kin.",
  },
  s0338: {
    literal: "On yichou Hedong military commissioner Wang E died.",
    idiomatic: "On yichou Wang E died.",
  },
  s0339: {
    literal: "That year Bo Hai, Silla, Xi, Khitan, Mohe, Nanzhao, and Zangke all sent envoys with tribute.",
    idiomatic: "Seven frontier states sent tribute that year.",
  },
  s0340: {
    literal: "Yuanhe 11 — In spring of Yuanhe 11, first month, dingmao new moon; because troops were long encamped in the field, court congratulations were not received.",
    idiomatic: "Yuanhe 11 opened without New Year audience because armies were in the field.",
  },
  s0341: {
    literal: "On jisi Vice Director of the Secretariat and Grand Councillor Zhang Hongjing was made acting Minister of Personnel, concurrent Taiyuan intendant, Northern Capital guardian, and Hedong military commissioner.",
    idiomatic: "On jisi Zhang Hongjing took Taiyuan and Hedong.",
  },
  s0342: {
    literal: "On wuyin an edict to the ministers said: \"War has now lasted long; advantage and harm are half and half.\"",
    idiomatic: "On wuyin the emperor asked ministers to debate the war.",
  },
  s0343: {
    literal: "The fit of attack and defense, the essentials of punishment and pardon — each should submit a considered memorial.\"",
    idiomatic: "\"Submit plans for attack, defense, and amnesty.\"",
  },
  s0344: {
    literal: "On gengchen Hanlin academicians Qian Hui and Xiao Fu each kept his original office — for memorializing to stop the war.",
    idiomatic: "On gengchen Qian Hui and Xiao Fu kept their posts after urging peace.",
  },
  s0345: {
    literal: "On guiwei Wang Chengzong's living offices were stripped; his inherited fief was granted to Wu Jun's son, Golden Guard general Shiping.",
    idiomatic: "On guiwei Chengzong was stripped and his fief given to Wu Jun's son.",
  },
  s0346: {
    literal: "Hedong and Hebei circuits' garrisons were ordered to add troops and advance in attack.",
    idiomatic: "Hedong and Hebei were ordered to reinforce the offensive.",
  },
  s0347: {
    literal: "On jiashen bandits cut down forty-seven halberds at Jianling's gate.",
    idiomatic: "On jiashen forty-seven halberds were stolen from Jianling.",
  },
  s0348: {
    literal: "On jiazi Li Guangyan memorialized defeating the rebels.",
    idiomatic: "On jiazi Li Guangyan reported victory.",
  },
  s0349: {
    literal: "Second month, guimao — the Tibetan king died.",
    idiomatic: "In the second month the Tibetan king died.",
  },
  s0350: {
    literal: "Li Fengji, Secretariat drafting commissioner with acting charge of Rites examinations and scarlet fish tally, was made Vice Director of the Secretariat and Grand Councillor and granted the gold-purple fish tally.",
    idiomatic: "Li Fengji joined the Grand Council.",
  },
  s0351: {
    literal: "Forty thousand bolts from the inner treasury were granted to You and Wei troops.",
    idiomatic: "Forty thousand bolts rewarded the Hebei armies.",
  },
  s0352: {
    literal: "On jiayin Li Jiang, Hua prefect, was made Minister of War.",
    idiomatic: "On jiayin Li Jiang became Minister of War.",
  },
  s0353: {
    literal: "On bingchen the moon occulted the Heart.",
    idiomatic: "On bingchen the moon eclipsed the Heart.",
  },
  s0354: {
    literal: "On wuwu Nanzhao chieftain Long Mengsheng died.",
    idiomatic: "On wuwu the Nanzhao ruler died.",
  },
  s0355: {
    literal: "Third month, gengwu — the Empress Dowager died in the Xianning Hall of Xingqing Palace.",
    idiomatic: "In the third month the empress dowager died at Xingqing.",
  },
  s0356: {
    literal: "That day the ministers began mourning at the Two Principles Hall of the Western Palace; chief minister Pei Du was made ritual commissioner; Minister of War Han Gao was made Daming Palace guardian; a mourning lodge was set at the Secretariat.",
    idiomatic: "Court mourning began with Pei Du directing rites and Han Gao guarding Daming.",
  },
  s0357: {
    literal: "On xinwei an edict: public business of all offices should provisionally follow Secretariat and Chancellery disposition.",
    idiomatic: "On xinwei routine business was routed through the Secretariat.",
  },
  s0358: {
    literal: "On guiyou courtiers were dispatched to announce mourning throughout the realm.",
    idiomatic: "On guiyou mourning envoys were sent empire-wide.",
  },
  s0359: {
    literal: "On jiaxu the Emperor received the ministers outside the Zichen Gate colonnade.",
    idiomatic: "On jiaxu the emperor met ministers outside Zichen.",
  },
  s0360: {
    literal: "On jimao chief minister Li Fengji was made commissioner for the Grand Empress Dowager's mausoleum.",
    idiomatic: "On jimao Li Fengji directed the dowager's burial.",
  },
  s0361: {
    literal: "Fifty thousand bolts of palace silk and damask were released for the mausoleum.",
    idiomatic: "Fifty thousand bolts were allotted to the burial.",
  },
  s0362: {
    literal: "On jichou the moon drew near Saturn.",
    idiomatic: "On jichou the moon neared Saturn.",
  },
  s0363: {
    literal: "Summer, fourth month, renyin — Xichuan military commissioner Li Yijian sent envoys to announce mourning to Nanzhao.",
    idiomatic: "In the fourth month Li Yijian notified Nanzhao of the mourning.",
  },
  s0364: {
    literal: "After the mourning, border commands announced to the four barbarians — old statute.",
    idiomatic: "Border posts notifying foreign states after mourning was old law.",
  },
  s0365: {
    literal: "On gengxu Vice Minister of Revenue overseeing fiscal affairs Yang Yuling was demoted to Chen prefect — for shortfall in army supply.",
    idiomatic: "On gengxu Yang Yuling was demoted for supply failures.",
  },
  s0366: {
    literal: "On dingsi because Xu and Su suffered famine, 80,000 shi of grain were distributed.",
    idiomatic: "On dingsi Xu and Su received 80,000 shi of famine relief.",
  },
  s0367: {
    literal: "Fifth month, dingmao night — the lodges Chen and Sui conjoined at the Well.",
    idiomatic: "On a fifth-month night Chen and Sui met at the Well.",
  },
  s0368: {
    literal: "Youzhou army mutinied and drove out prefect Luo Yi.",
    idiomatic: "Youzhou mutinied and expelled Luo Yi.",
  },
  s0369: {
    literal: "On renshen Li Guangyan defeated the rebels at Lingyun Stockade.",
    idiomatic: "On renshen Li Guangyan took Lingyun Stockade.",
  },
  s0370: {
    literal: "Sixth month, jiachen — Gao Xiayu was defeated at Iron City and withdrew to guard Xinxing Stockade; that day popular feeling was shaken with fear; at imperial audience the chief ministers largely requested stopping the war.",
    idiomatic: "In the sixth month Gao Xiayu's defeat at Iron City revived calls to end the war.",
  },
  s0371: {
    literal: "The Emperor said: \"Victory and defeat are the constant situation of soldiers — one general's loss must not frustrate the settled plan.\"",
    idiomatic: "The emperor refused to abandon the campaign after one defeat.",
  },
  s0372: {
    literal: "Now discuss only military strategy; court routine affairs — decide what may or may not be done.\"",
    idiomatic: "\"Debate strategy only, not retreat.\"",
  },
  s0373: {
    literal: "That night the moon occulted the star behind the Heart.",
    idiomatic: "That night the moon eclipsed a Heart companion star.",
  },
  s0374: {
    literal: "On gengxu Tian Hongzheng's army attacked Wang Chengzong and halted at Nangong.",
    idiomatic: "On gengxu Tian Hongzheng camped at Nangong against Chengzong.",
  },
  s0375: {
    literal: "On xinyou the ministers submitted the Grand Empress Dowager's posthumous title Zhuangxian.",
    idiomatic: "On xinyou the dowager received the posthumous name Zhuangxian.",
  },
  s0376: {
    literal: "Autumn, seventh month, dingchou — Sui-Tang military commissioner Gao Xiayu was demoted to Gui prefect.",
    idiomatic: "In the seventh month Gao Xiayu was demoted after Iron City.",
  },
  s0377: {
    literal: "Henan intendant Zheng Quan was made Xiang prefect and Shannan East military commissioner;",
    idiomatic: "Zheng Quan took Shannan East;",
  },
  s0378: {
    literal: "Jingnan military commissioner Yuan Zi was made Tang prefect, Zhangyi army military commissioner, and Shen-Guang-Tang-Cai-Sui-Deng observation commissioner, with authority to govern from Tang;",
    idiomatic: "Yuan Zi took Tang and the Zhangyi front;",
  },
  s0379: {
    literal: "Hua prefect Pei Wu was made Jiangling intendant and Jingnan military commissioner.",
    idiomatic: "Pei Wu took Jingnan.",
  },
  s0380: {
    literal: "Sui prefect Yang Min was made Tang prefect and acting campaign director of military affairs.",
    idiomatic: "Yang Min was named Tang commander.",
  },
  s0381: {
    literal: "Because Zi was a scholar, Min was again made to lead the troops.",
    idiomatic: "A soldier was paired with the scholar Yuan Zi.",
  },
  s0382: {
    literal: "On renwu Xuanwu army memorialized defeating the rebels.",
    idiomatic: "On renwu Xuanwu reported victory.",
  },
  s0383: {
    literal: "Eighth month, renyin — chief minister Wei Guanzhi was made Vice Minister of Personnel and ceased concurrent governance.",
    idiomatic: "In the eighth month Wei Guanzhi left the council for Personnel.",
  },
  s0384: {
    literal: "Guanzhi, with war in Huai and Hebei, was wearied supplying the armies and requested easing Chengzong while concentrating on Yuanji — he disputed before the throne with Pei Du for this reason.",
    idiomatic: "He had argued to spare Chengzong and focus on Yuanji, clashing with Pei Du.",
  },
  s0385: {
    literal: "On wushen Rong prefecture memorialized that a typhoon and seawater destroyed the prefectural city.",
    idiomatic: "On wushen a typhoon wrecked Rongzhou.",
  },
  s0386: {
    literal: "On jiashen Empress Zhuangxian was enshrined at Fengling.",
    idiomatic: "On jiashen Zhuangxian was enshrined at Fengling.",
  },
  s0387: {
    literal: "Ninth month, dingmao — Raozhou memorialized that in the fifth month at Fuliang and Leping two counties violent rain and flooding destroyed 4,700 households; 170 drowned.",
    idiomatic: "In the ninth month Raozhou reported floods that drowned 170.",
  },
  s0388: {
    literal: "On bingzi newly appointed Vice Minister of Personnel Wei Guanzhi was again demoted to Hunan observation commissioner.",
    idiomatic: "On bingzi Wei Guanzhi was sent to Hunan.",
  },
  s0389: {
    literal: "On xinwei Vice Minister of Personnel Wei Yi was demoted to Shan prefect; Bureau of Justice director Li Zheng to Jin prefect; Fiscal Affairs director Xue Gonggan to Fang prefect; Bureau of Revenue director Li Xuan to Zhong prefect; Bureau of Merit director Wei Chuhou to Kai prefect; Bureau of Rites Vice Director Cui Shao to Guo prefect — all framed by Remonstrance Officer Zhang Su, who said they were Guanzhi's faction.",
    idiomatic: "On xinwei Zhang Su exiled a bloc of Wei Guanzhi's allies to remote prefects.",
  },
  s0390: {
    literal: "On yiyou the Cai front memorialized capturing Lingyun Stockade.",
    idiomatic: "On yiyou the Cai front reported Lingyun Stockade taken.",
  },
  s0391: {
    literal: "Winter, tenth month, dingsi — Minister of Justice Quan Deyu was made acting Minister of Personnel, concurrent Xingyuan intendant, and Shannan West military commissioner.",
    idiomatic: "In the tenth month Quan Deyu took Shannan West.",
  },
  s0392: {
    literal: "On bingyin Youzhou Liu Zong was promoted Grand Councillor; Yingzhou Li Shidao was promoted acting Minister of Works.",
    idiomatic: "On bingyin Liu Zong joined the council and Li Shidao was promoted.",
  },
  s0393: {
    literal: "When Shidao heard Lingyun Stockade had fallen he grew afraid and falsely offered sincere submission — hence this order.",
    idiomatic: "Li Shidao feigned loyalty after Lingyun fell.",
  },
  s0394: {
    literal: "On gengwu Minister of Agriculture Wang Sui was made Xuan prefect and Xuan-She-Chi observation commissioner; Jingzhao intendant Yao Song was made Run prefect and Zhexi observation commissioner.",
    idiomatic: "On gengwu Wang Sui and Yao Song, fiscal specialists, took rich circuits.",
  },
  s0395: {
    literal: "Because Sui and Song had long served in accounting offices and could gather wealth, and the court relied on them for army supply, these appointments were made.",
    idiomatic: "They were chosen to fund the war through revenue posts.",
  },
  s0396: {
    literal: "On renshen an edict: memorializing officials of all circuits, unless urgent, may not use relay horses.",
    idiomatic: "On renshen non-urgent memorials were barred from express relay.",
  },
  s0397: {
    literal: "On dingchou 500,000 strings were released from the inner treasury for the army.",
    idiomatic: "On dingchou half a million strings went to the armies.",
  },
  s0398: {
    literal: "On wuyin night the moon transgressed Sui.",
    idiomatic: "On a wuyin night the moon crossed Sui.",
  },
  s0399: {
    literal: "On xinsi Palace Inner Regular Attendant Liang Shou was made supervisor of the Huaixi campaign armies.",
    idiomatic: "On xinsi Liang Shou supervised the Huaixi armies.",
  },
  s0400: {
    literal: "Blank commission patents for five hundred posts and gold and silk were still given him.",
    idiomatic: "He was given five hundred blank commissions and treasure besides.",
  }
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
if (data.metadata.chapter !== '015') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 015; standalone T ready (${Object.keys(T).length} entries).`
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
