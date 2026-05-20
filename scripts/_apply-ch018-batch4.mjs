#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.018, Wenzong 2 / Wuzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
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
    literal: 'Ninth month, an order:',
    idiomatic: 'In the ninth month an order declared war on Liu Zhen:',
  },
  s0302: {
    literal: '"To settle the realm is to bring custom to great unity;',
    idiomatic: '"To settle the realm unifies custom;',
  },
  s0303: {
    literal: 'to pacify the living is to align law on one measure."',
    idiomatic: '"to pacify the living aligns law on one measure."',
  },
  s0304: {
    literal: 'Though Jin\'s Luan and Zhao families had old merit;',
    idiomatic: '"Though Jin\'s Luan and Zhao had old merit,',
  },
  s0305: {
    literal: 'Han\'s Han and Ying, bodies as assistants to mandate—',
    idiomatic: 'Han\'s Han Xin and Ying Bu aided the mandate—',
  },
  s0306: {
    literal: 'as for disturbing discipline, none were not displayed and killed; forbidding violence and removing the cruel is ancient and modern great righteousness.',
    idiomatic: 'rebels who disturbed discipline were executed—ancient righteousness."',
  },
  s0307: {
    literal: 'Therefore Zhaoyi commissioner Liu Wu formerly dwelt on the eastern sea, once ranked among claws and teeth.',
    idiomatic: '"Liu Wu once served the throne from the eastern sea."',
  },
  s0308: {
    literal: 'When Shidao obstructed troops the royal army questioned guilt; three faces opened nets, one territory lost heart—seizing this crisis he could return to allegiance.',
    idiomatic: '"When Shidao rebelled Wu turned to allegiance."',
  },
  s0309: {
    literal: 'Xianzong praised his sincere pledge and gave southern Yan;',
    idiomatic: '"Xianzong gave him Zhaoyi."',
  },
  s0310: {
    literal: 'Muzong treated him as trusted belly and heart, entrusted upper Dang.',
    idiomatic: '"Muzong entrusted upper Dang to him."',
  },
  s0311: {
    literal: 'He recruited dead warriors, firmly guarding one region—by his last years he already lacked a minister\'s integrity.',
    idiomatic: '"He grew overmighty until his minister\'s integrity failed."',
  },
  s0312: {
    literal: 'Liu Congjian bore perverse qi from birth, from youth practiced chaotic wind.',
    idiomatic: '"Congjian was perverse from youth."',
  },
  s0313: {
    literal: 'By overbearing capital he monopolized his fief;',
    idiomatic: '"He monopolized his fief by arrogance;"',
  },
  s0314: {
    literal: 'by discipline\'s power he seized military tallies.',
    idiomatic: '"and seized military tallies by force."',
  },
  s0315: {
    literal: 'Briefly he showed holding jade scepter ritual—finally no request for upper investiture.',
    idiomatic: '"He played loyal without seeking investiture."',
  },
  s0316: {
    literal: 'Gap-horse as metaphor—Wei Bao for a time worked to cut the river;',
    idiomatic: '"Like a gap horse or Wei Bao at the river,',
  },
  s0317: {
    literal: 'well-frog dwelling alone—Sun Shu was heard to trust peril.',
    idiomatic: 'or a well frog like Sun Shu trusting his peril."',
  },
  s0318: {
    literal: 'He lured and received household mandates, recklessly made demon words, deceived the court within, secretly plotted left-hand ways.',
    idiomatic: '"He deceived the court with omens and left-hand plots."',
  },
  s0319: {
    literal: 'Bordering Rong commanders repeatedly memorialized secret plots—pitying infants he cherished—how could deep fish be observed?',
    idiomatic: '"Border commanders reported his plots though the court indulged him."',
  },
  s0320: {
    literal: 'When his illness deepened he never mourned; still stationed his dying soul, wantonly walked perverse intent, none could wrest him up—he himself set a crafty boy.',
    idiomatic: '"Dying, he left power to the crafty boy Zhen."',
  },
  s0321: {
    literal: 'Palace envoys gave medicine—none saw his court dress;',
    idiomatic: '"Envoys could not enter his gates;"',
  },
  s0322: {
    literal: 'near ministers bore orders—not entering the rampart gate.',
    idiomatic: '"and near ministers were barred."',
  },
  s0323: {
    literal: 'Rebellion was very clear; men and spirits together abandoned him.',
    idiomatic: '"His rebellion was plain to men and spirits."',
  },
  s0324: {
    literal: 'His posthumous offices and prior granted offices and titles and Liu Zhen\'s personal offices and titles should all be stripped."',
    idiomatic: '"Strip all titles of Congjian and Zhen."',
  },
  s0325: {
    literal: 'Chengde commissioner Wang Yuankui and Weibo commissioner He Hongjing—some kin-linked to the royal house, some weighty in frontier pillars—all earnestly stated one-minded sincerity, wishing to raise the nine punishments\' mandate.',
    idiomatic: '"Wang Yuankui and He Hongjing begged to campaign."',
  },
  s0326: {
    literal: 'Wu Han took office, received edict yet at first made no preparation;',
    idiomatic: '"Like Wu Han receiving orders without delay,',
  },
  s0327: {
    literal: 'Bu Shi\'s plain loyalty showed righteousness before battle."',
    idiomatic: 'or Bu Shi showing loyalty before battle."',
  },
  s0328: {
    literal: 'Moreover Chengde army once with owl cavalry arrayed across, first broke Zhu Tao.',
    idiomatic: '"Chengde once broke Zhu Tao;"',
  },
  s0329: {
    literal: 'Battle spirit just fierce, again turned Luyang\'s sun;',
    idiomatic: '"its spirit turned Luyang\'s sun;"',
  },
  s0330: {
    literal: 'drums unceasing, three circuits around Bu Zhu mountain.',
    idiomatic: '"its drums circled Bu Zhu mountain thrice."',
  },
  s0331: {
    literal: 'Weibo army lately with great banners crossed the river, finally destroyed Shidao.',
    idiomatic: '"Weibo destroyed Shidao across the river."',
  },
  s0332: {
    literal: 'Raised twelve prefectures\' flags and drums to array surrendering men;',
    idiomatic: '"It raised twelve prefectures\' banners for surrender;"',
  },
  s0333: {
    literal: 'cut sixty years\' harsh steps—all returned to imperial transformation.',
    idiomatic: '"and ended sixty years of rebellion."',
  },
  s0334: {
    literal: 'Soldiers transmit surplus courage, armies have heroic names—surely they can follow Xiao He\'s direction and accomplish Zhuge Liang\'s heart in campaigning."',
    idiomatic: '"Their courage can follow great captains of old."',
  },
  s0335: {
    literal: 'Consult you two commanders, my entrusted care—Yuankui may keep his post as northern Ze-Lu campaign commissioner; Hongjing eastern Ze-Lu campaign commissioner."',
    idiomatic: '"Yuankui leads north, Hongjing east against Zhen."',
  },
  s0336: {
    literal: 'Formerly the former emperors were in frontier posts; Heaven first opened sagely fortune.',
    idiomatic: '"Our ancestors in Ze-Lu bore omens of sage rule;"',
  },
  s0337: {
    literal: 'Portents clear, painted brilliance flashed at Si Pavilion;',
    idiomatic: '"portents shone at Si Pavilion;"',
  },
  s0338: {
    literal: 'imperial chariot toured, metal and stone carved at Dai Lodge.',
    idiomatic: '"imperial tours carved Dai Lodge."',
  },
  s0339: {
    literal: 'Truly called a fiefable folk, long a benevolent longevity village.',
    idiomatic: '"Ze-Lu was long a loyal land."',
  },
  s0340: {
    literal: 'Since bandits came, quite showing sincere loyalty—surely not the same evil; all permitted to renew.',
    idiomatic: '"Its people showed loyalty amid trouble and may renew."',
  },
  s0341: {
    literal: 'Zhaoyi old soldiers and common people—if they keep the first heart, all pardon without question.',
    idiomatic: '"Old soldiers who keep faith are pardoned."',
  },
  s0342: {
    literal: 'If they abandon rebellion and show obedience, surrendering prefectural troops and masses—richly enfeoff.',
    idiomatic: '"Surrendering troops will be richly rewarded."',
  },
  s0343: {
    literal: 'If they capture and deliver Liu Zhen—separately grant land to repay merit.',
    idiomatic: '"Capturing Zhen wins separate fiefs."',
  },
  s0344: {
    literal: 'Formerly following Liu Wu\'s Yanzhou old officers\' descendants—already having righteous hearts—should think to repent.',
    idiomatic: '"Yanzhou old officers should repent and turn."',
  },
  s0345: {
    literal: 'If they can move Liu Zhen to bind himself and return to court—he will surely be treated as at first, especially washed clean.',
    idiomatic: '"Those who move Zhen to surrender will be washed clean."',
  },
  s0346: {
    literal: 'Your old officers also will all be rewarded."',
    idiomatic: '"Their officers will also be rewarded."',
  },
  s0347: {
    literal: 'Still entrust Yixing, Liu Mian, and Wang Maoyuan each to advance troops with united strength to attack."',
    idiomatic: '"Yixing, Liu Mian, and Wang Maoyuan will join the attack."',
  },
  s0348: {
    literal: 'All commands advancing—none may burn huts, dig graves, seize and hold common people as captives.',
    idiomatic: '"Armies must not burn, dig graves, or seize civilians."',
  },
  s0349: {
    literal: 'Mulberry hemp and field seedlings—each permits the original household as master.',
    idiomatic: '"Fields return to their owners."',
  },
  s0350: {
    literal: 'Guilt stops at the chief villain; strive to save the living."',
    idiomatic: '"Punish only Zhen; spare the people."',
  },
  s0351: {
    literal: 'Alas!',
    idiomatic: 'The edict sighed: Alas!',
  },
  s0352: {
    literal: 'Frontier great ministers submitted blunt memorials without;',
    idiomatic: '"Frontier ministers remonstrated without;"',
  },
  s0353: {
    literal: 'eminent old men spoke clearly in court.',
    idiomatic: '"court elders spoke clearly."',
  },
  s0354: {
    literal: 'They warned me with ancestral law—one clan may not be privately favored;',
    idiomatic: '"They warned me: ancestral law forbids favoring one clan;"',
  },
  s0355: {
    literal: 'the handle of punishment and reward is to correct ten thousand states.',
    idiomatic: '"punishment and reward correct the realm."',
  },
  s0356: {
    literal: 'Armor and troops should be arrayed on the wild plain."',
    idiomatic: '"Use arms on the plain."',
  },
  s0357: {
    literal: 'Though I by grace would not listen, yet ministers by righteousness firmly contended—inquiry from collective counsel, surely not obtained willingly.',
    idiomatic: '"Though I wished mercy, ministers by righteousness demanded war."',
  },
  s0358: {
    literal: 'Proclaim inner and outer, clarifying my heart."',
    idiomatic: '"Let all know my reluctant heart." Thus ended the edict.',
  },
  s0359: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0360: {
    literal: 'Still made Xu-Si commissioner Li Yanzhuo Ze-Lu southwestern campaign commissioner.',
    idiomatic: 'Li Yanzhuo became southwestern campaign commissioner.',
  },
  s0361: {
    literal: 'Heyang commissioner Wang Maoyuan encamped his army at Wanshan.',
    idiomatic: 'Wang Maoyuan encamped at Wanshan.',
  },
  s0362: {
    literal: 'After Yanzhuo\'s order more than a month passed without marching—the court suspected his caution—then made Tiande Shi Xiong Yanzhuo\'s vice.',
    idiomatic: 'Li Yanzhuo\'s delay made Shi Xiong his vice.',
  },
  s0363: {
    literal: 'Liu Zhen\'s barracks general Li Pi surrendered and was used as Xinzhou prefect.',
    idiomatic: 'Li Pi surrendered and became Xinzhou prefect.',
  },
  s0364: {
    literal: 'Chen-Xu commissioner Wang Zai was made Ze-Lu southern campaign commissioner.',
    idiomatic: 'Wang Zai led the southern campaign.',
  },
  s0365: {
    literal: 'Heyang commissioner Wang Maoyuan died; posthumously made Minister of Education.',
    idiomatic: 'Wang Maoyuan died and was posthumously honored.',
  },
  s0366: {
    literal: 'Wang Zai replaced Maoyuan commanding Wanshan troops.',
    idiomatic: 'Wang Zai took the Wanshan army.',
  },
  s0367: {
    literal: 'Tenth month: supervising Veritable Records councillor Li Shen and War Bureau director and History Office compiler Zheng Ya submitted the revised forty volumes of Xianzong\'s Veritable Records, distributed with differences.',
    idiomatic: 'Li Shen and Zheng Ya presented forty revised volumes of Xianzong\'s records.',
  },
  s0368: {
    literal: 'Jin-Jiang campaign vice commissioner Shi Xiong memorialized capturing five rebel stockades.',
    idiomatic: 'Shi Xiong reported five stockades taken.',
  },
  s0369: {
    literal: 'Hedong commissioner Liu Mian was made Acting Minister of Works, concurrent Huazhou prefect and Censor-in-Chief, full Yicheng military commissioner and Zheng-Hua-Pu observation commissioner.',
    idiomatic: 'Liu Mian took Yicheng.',
  },
  s0370: {
    literal: 'Jingnan commissioner Acting Right Vice Director Li Shi was made Acting Minister of Works and Grand Councillor, concurrent Taiyuan prefect, northern capital regent, full Hedong observation commissioner.',
    idiomatic: 'Li Shi took Hedong and the council.',
  },
  s0371: {
    literal: 'November: an order: "Inner and outer officials are excessively numerous—measure and reduce to benefit army and people.',
    idiomatic: 'An order demanded Personnel report staff cuts:',
  },
  s0372: {
    literal: 'Let Personnel memorialize the combined reduction count and report."',
    idiomatic: '"Let Personnel report combined reductions." Thus ended the edict.',
  },
  s0373: {
    literal: 'Twelfth month: Wang Zai memorialized capturing Tianjing Pass.',
    idiomatic: 'Wang Zai took Tianjing Pass.',
  },
  s0374: {
    literal: 'Yushe campaign commander Wang Feng memorialized few troops, begging reinforcements; an edict sent Taiyuan two thousand men.',
    idiomatic: 'Wang Feng received two thousand Taiyuan reinforcements.',
  },
  s0375: {
    literal: 'Earlier when Liu Mian broke the Uighur he left three thousand men garrisoning Hengshui; now Li Shi because Taiyuan had no troops drew fifteen hundred Hengshui garrison for Wang Feng.',
    idiomatic: 'Li Shi stripped Hengshui garrison for Wang Feng.',
  },
  s0376: {
    literal: 'That month on the twenty-eighth Hengshui troops reached Taiyuan requesting to march with generous pay.',
    idiomatic: 'On the twenty-eighth Hengshui troops at Taiyuan demanded generous pay.',
  },
  s0377: {
    literal: 'Old precedent each army two bolts silk; at the time after Liu Mian\'s handover the army treasury had no silk.',
    idiomatic: 'Each army expected two bolts silk, but the treasury was empty.',
  },
  s0378: {
    literal: 'Li Shi used his own silk to supplement.',
    idiomatic: 'Li Shi supplied his own silk.',
  },
  s0379: {
    literal: 'Only then one bolt per man, then hurried on the road.',
    idiomatic: 'Each man got one bolt and was hurried out.',
  },
  s0380: {
    literal: 'Soldiers because the year would end wished to wait past New Year—the term was urgent, army mood displeased.',
    idiomatic: 'Soldiers wanted to pass New Year; the rush angered them.',
  },
  s0381: {
    literal: 'Command head Yang Bian seized soldiers\' spreading resentment and incited rebellion.',
    idiomatic: 'Yang Bian incited mutiny from their anger.',
  },
  s0382: {
    literal: 'Huichang 4, spring, first month, yiyou new moon—year Huichang 4 duplicated—because Ze-Lu used troops, the New Year audience was canceled.',
    idiomatic: 'Huichang 4 canceled the New Year audience for the Ze-Lu war.',
  },
  s0383: {
    literal: 'That day Yang Bian expelled Taiyuan commissioner Li Shi.',
    idiomatic: 'That day Yang Bian expelled Li Shi from Taiyuan.',
  },
  s0384: {
    literal: 'An order: "Fast-month meat cutting comes from Buddhism; our state\'s founding still nears Liang and Sui—ministers and great officials sometimes follow this abuse.',
    idiomatic: 'An order limited Buddhist slaughter bans:',
  },
  s0385: {
    literal: 'Butchers gain thick profit; inspectors secretly receive requests.',
    idiomatic: '"Butchers and inspectors profited from the ban."',
  },
  s0386: {
    literal: 'The first month is when the myriad things first grow—should cut three days.',
    idiomatic: '"Cut three days in the first month;"',
  },
  s0387: {
    literal: 'The former emperors\' memorial days cut one day.',
    idiomatic: '"one day on imperial memorial days;"',
  },
  s0388: {
    literal: 'Still per Kaiyuan 22 order, the three yuan days each cut three days; other months not forbidden."',
    idiomatic: '"three days on each yuan day; other months free." Thus ended the edict.',
  },
  s0389: {
    literal: 'On renzi Hedong army supervisor Lü Yizhong recovered Taiyuan, captured Yang Bian alive, executed all mutinous soldiers; the hundred officials congratulated.',
    idiomatic: 'On renzi Lü Yizhong retook Taiyuan and executed the mutineers.',
  },
  s0390: {
    literal: 'Second month, jiayin new moon.',
    idiomatic: 'The second month opened on jiayin.',
  },
  s0391: {
    literal: 'On dingsi an order: Hezhong Jin-Jiang-Ci-Li observation commissioner Acting Left Cavalier Hezhong prefect Cui Yuanshi was made Acting Minister of Rites, concurrent Taiyuan prefect, northern capital regent, full Hedong observation commissioner.',
    idiomatic: 'On dingsi Cui Yuanshi replaced Li Shi at Hedong.',
  },
  s0392: {
    literal: 'On wuwu night Venus transgressed the Station Star.',
    idiomatic: 'That wuwu night Venus crossed the Station Star.',
  },
  s0393: {
    literal: 'On xinyou Taiyuan sent Yang Bian and fifty-four fellow evildoers to be presented; executed at Gouji Ridge.',
    idiomatic: 'On xinyou Yang Bian and fifty-four rebels were executed at Gouji Ridge.',
  },
  s0394: {
    literal: 'Third month: Jin-Jiang vice campaign Shi Xiong was made Ze-Lu western campaign commissioner; Fenzhou prefect Li Pi vice.',
    idiomatic: 'Shi Xiong and Li Pi led the western campaign.',
  },
  s0395: {
    literal: 'Daoist Zhao Guizhen was made Left-Right Street Gate professor master.',
    idiomatic: 'Zhao Guizhen became street-gate professor master.',
  },
  s0396: {
    literal: 'At the time the Emperor\'s intent studied immortals, taking Guizhen as teacher.',
    idiomatic: 'Wuzong studied immortality under Zhao Guizhen.',
  },
  s0397: {
    literal: 'Guizhen riding favor each audience slandered Buddhism, saying it was not China\'s teaching, harrying and wasting the living—all should be removed; the Emperor quite believed.',
    idiomatic: 'Guizhen urged destroying Buddhism as foreign and wasteful; Wuzong believed him.',
  },
  s0398: {
    literal: 'Fourth month: Wang Zai advanced attacking Ze prefecture.',
    idiomatic: 'Wang Zai besieged Ze prefecture.',
  },
  s0399: {
    literal: 'Fifth month: Minister of Agriculture Xue Yuan Shang was made Jingzhao prefect.',
    idiomatic: 'Xue Yuan Shang became Jingzhao prefect.',
  },
  s0400: {
    literal: 'Sixth month: Gold-Purple Grand Master, Right Vice Director, Secretariat Vice Director, Grand Councillor overseeing finances Cui Gong was demoted Lizhou prefect.',
    idiomatic: 'In the sixth month Cui Gong was banished to Lizhou.',
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
