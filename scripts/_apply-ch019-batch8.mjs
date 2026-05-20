#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.019, Yizong / Xizong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 800;

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
  s0701: {
    literal: 'Xiantong 14, seventh month: Yizong grew critically ill.',
    idiomatic: 'In Xiantong 14\'s seventh month Yizong grew critically ill.',
  },
  s0702: {
    literal: 'On the eighteenth day of that month an edict said: "We guard the great vessel\'s weight and dwell above the myriad people, daily cautious as if treading thin ice.',
    idiomatic: 'On the eighteenth an edict named the heir:',
  },
  s0703: {
    literal: 'Dawn and dusk toil in thought, waking and sleeping think of governance—yet the Way is still shallow and guiding the age not yet trusted.',
    idiomatic: '"We toil at governance yet the Way remains shallow—',
  },
  s0704: {
    literal: 'Nourishment was contrary and cold and heat became illness; truly there was worry over neglected government and no leisure for ease of spirit.',
    idiomatic: '"—illness leaves government neglected.',
  },
  s0705: {
    literal: 'The ailment has not slightly healed but daily grows worse; myriad affairs in general need a master.',
    idiomatic: 'Affairs need a master—',
  },
  s0706: {
    literal: 'Considering old regulations and consulting ministers, we think to expand the great enterprise and establish the imperial heir.',
    idiomatic: '—so we establish the imperial heir.',
  },
  s0707: {
    literal: 'The fifth son Prince of Pu Yan, renamed Xuan, respectful, mild, warm, and gentle, broad and thick, daily renewing fine virtue, Heaven bestowed heroic bearing—words all hit the mark, movements always follow ritual.',
    idiomatic: 'Fifth son Prince of Pu Yan, renamed Xuan, is respectful, wise, and fit for ritual—',
  },
  s0708: {
    literal: 'Let him honor the state\'s root and surely accord with people\'s hearts; he should be established crown prince with acting charge of military and state affairs.',
    idiomatic: '—crown prince with acting charge of military and state affairs.',
  },
  s0709: {
    literal: 'To you civil and military ministers and trusted inner ministers—reverently protect our heir and complete our will; each exhaust your heart to settle the people.',
    idiomatic: 'Ministers, protect the heir and settle the people.',
  },
  s0710: {
    literal: 'Proclaim inner and outer and know our intent.',
    idiomatic: 'Proclaim this to all.',
  },
  s0711: {
    literal: 'That day Yizong died.',
    idiomatic: 'That same day Yizong died.',
  },
  s0712: {
    literal: 'On the twentieth day he took the imperial throne before the coffin; years twelve.',
    idiomatic: 'On the twentieth Xizong took the throne before the coffin at twelve.',
  },
  s0713: {
    literal: 'Left Army Commandant Liu Xingshen and Right Army Commandant Han Wenyue held power at court and were both enfeoffed dukes.',
    idiomatic: 'Liu Xingshen and Han Wenyue ruled court as enfeoffed dukes.',
  },
  s0714: {
    literal: 'Eighth month: the Emperor released mourning.',
    idiomatic: 'In the eighth month the Emperor ended mourning.',
  },
  s0715: {
    literal: 'The sage mother Lady Wang was enfeoffed Empress Dowager.',
    idiomatic: 'Lady Wang became Empress Dowager.',
  },
  s0716: {
    literal: 'Henan great flood—from the seventh month rain did not stop until after mourning release it cleared.',
    idiomatic: 'Henan flooded from the seventh month until mourning ended.',
  },
  s0717: {
    literal: 'Ninth month: Acting Minister of Works, Secretariat Vice Director, Grand Councillor Wei Baohang was demoted to Hezhou prefect.',
    idiomatic: 'In the ninth month Wei Baohang was banished to Hezhou.',
  },
  s0718: {
    literal: 'Yuezhou prefect Yu Cong was made Crown Prince Junior Tutor; those banished with Cong were all returned.',
    idiomatic: 'Yu Cong returned; those banished with him were restored.',
  },
  s0719: {
    literal: 'Xunzhou registrar Cui Hang was restored Secretariat Drafting Officer; former Vice Minister of Revenue, drafting edicts, Hanlin Academician-in-Chief Zheng Tian was made Left Regular Attendant; former Vice Minister of War, drafting edicts, Hanlin Academician Zhang Ti was made Crown Prince Guest; former Remonstrance Official Gao Xiang was restored Remonstrance Official; former Xuanyi observation commissioner Yang Yan was restored Supervising Secretary.',
    idiomatic: 'Cui Hang, Zheng Tian, Zhang Ti, Gao Xiang, and Yang Yan were restored.',
  },
  s0720: {
    literal: 'Tenth month: Left Vice Director, Secretariat Vice Director, Grand Councillor Liu Ye was made Acting Left Vice Director, Grand Councillor, concurrent Yangzhou metropolitan prefect, Huainan defense vice commissioner and acting military commissioner.',
    idiomatic: 'In the tenth month Liu Ye went to Huainan.',
  },
  s0721: {
    literal: 'Eleventh month: Grandee for the Imperial Clan, Acting Crown Prince Junior Tutor, Imperial Son-in-Law Commandant Yu Cong was made Acting Left Vice Director, concurrent Xiangzhou prefect and censor-in-chief, Shannan East circuit observation commissioner and related posts.',
    idiomatic: 'In the eleventh month Yu Cong returned to Shannan East.',
  },
  s0722: {
    literal: 'Twelfth month: thunder.',
    idiomatic: 'Thunder in the twelfth month.',
  },
  s0723: {
    literal: 'Yicheng Army military commissioner, Acting Minister of Punishments Du Tao was advanced to Minister of War.',
    idiomatic: 'Du Tao became minister of war.',
  },
  s0724: {
    literal: 'Qianfu 1, first month, xinyou new moon.',
    idiomatic: 'Qianfu 1 opened on xinyou.',
  },
  s0725: {
    literal: 'On yichou Left Vice Director, Secretariat Vice Director, Grand Councillor Xiao Fang also held Right Vice Director.',
    idiomatic: 'On yichou Xiao Fang held both vice directorates.',
  },
  s0726: {
    literal: 'Secretariat Vice Director, Minister of Personnel, Grand Councillor Wang Duo was made Acting Minister of Personnel, Grand Councillor, concurrent Bianzhou prefect, Xuanyi Army military commissioner, Song-Bo observation commissioner and related posts.',
    idiomatic: 'Wang Duo took Xuanyi at Bianzhou.',
  },
  s0727: {
    literal: 'Second month: Yizong was buried at Jianling.',
    idiomatic: 'In the second month Yizong was buried at Jianling.',
  },
  s0728: {
    literal: 'Third month: Hedong military commissioner, Acting Right Vice Director Cui Yanzhao was made Vice Minister of War, salt and iron transport commissioner for all circuits and related posts.',
    idiomatic: 'In the third month Cui Yanzhao took salt and iron transport.',
  },
  s0729: {
    literal: 'Silver-Green Grandee, Capital Intendant, Upper Pillar of State, Duke of Qishan with three-thousand-household fief Dou Huan was made Acting Minister of Revenue, Taiyuan prefect, Northern Capital regent, censor-in-chief, Hedong circuit observation and disposition commissioner and related posts.',
    idiomatic: 'Dou Huan replaced Cui Yanzhao at Hedong.',
  },
  s0730: {
    literal: 'Secretariat Vice Director, Minister of Punishments, Grand Councillor Zhao Yin was made Acting Minister of Personnel, Runzhou prefect, Zhexi metropolitan training and observation commissioner and related posts.',
    idiomatic: 'Zhao Yin went to Zhexi.',
  },
  s0731: {
    literal: 'Fourth month: Cui Yanzhao, original office, Grand Councillor, retaining commissioner as before.',
    idiomatic: 'In the fourth month Cui Yanzhao joined the Grand Council while keeping transport.',
  },
  s0732: {
    literal: 'Former Huainan military commissioner Li Wei was made Minister of Personnel.',
    idiomatic: 'Li Wei became minister of personnel.',
  },
  s0733: {
    literal: 'Tianping Army military commissioner, Acting Right Vice Director, concurrent Yanzhou prefect Gao Pian was made Acting Minister of Works, concurrent Chengdu prefect, Jiannan West circuit defense vice commissioner and acting military commissioner.',
    idiomatic: 'Gao Pian went to Jiannan West.',
  },
  s0734: {
    literal: 'Right Regular Attendant Wei He was made Vice Minister of Personnel.',
    idiomatic: 'Wei He became vice minister of personnel.',
  },
  s0735: {
    literal: 'Former Tongzhou prefect Cui Pu was made Right Regular Attendant.',
    idiomatic: 'Cui Pu became right regular attendant.',
  },
  s0736: {
    literal: 'Right Leading Army General Hun Xi was made Acting Minister of Personnel, Left Thousand-Ox General.',
    idiomatic: 'Hun Xi received personnel and guard posts.',
  },
  s0737: {
    literal: 'Attending Censor Lu Yinzheng was made Director of Seals, judging Revenue cases.',
    idiomatic: 'Lu Yinzheng judged revenue cases.',
  },
  s0738: {
    literal: 'Fifth month: Vice Minister of Personnel Zheng Tian was made Vice Minister of War, Grand Councillor; Vice Minister of Revenue, drafting edicts, Hanlin Academician with purple-gold fish bag Lu Zhi, original office, Grand Councillor.',
    idiomatic: 'In the fifth month Zheng Tian and Lu Zhi joined the Grand Council.',
  },
  s0739: {
    literal: 'Crown Prince Right Subordinate Li Yun was made Director of the Imperial Stud; Attending Censor Pei Wo was made Diarist.',
    idiomatic: 'Li Yun and Pei Wo received new posts.',
  },
  s0740: {
    literal: 'Lingnan East circuit military commissioner, Acting Minister of Punishments Zheng Congdang was made Minister of Punishments; Vice Minister of Personnel Wei He was made Acting Minister of Rites, Guangzhou prefect, Lingnan East military commissioner.',
    idiomatic: 'Zheng Congdang and Wei He exchanged Lingnan and punishments posts.',
  },
  s0741: {
    literal: 'Seventh month: Vice Minister of Rites Pei Zan was made Acting Left Regular Attendant, Tanzhou prefect, censor-in-chief, Hunan observation commissioner;',
    idiomatic: 'In the seventh month Pei Zan took Hunan;',
  },
  s0742: {
    literal: 'late Hunan observation commissioner Li Yu was posthumously made Minister of Rites.',
    idiomatic: 'Li Yu was posthumously made minister of rites.',
  },
  s0743: {
    literal: 'Tenth month: Secretariat Drafting Officer Cui Hang was made Secretariat Vice Director; Right Remonstrance Official Cui Yin was made Supervising Secretary.',
    idiomatic: 'In the tenth month Cui Hang and Cui Yin were promoted.',
  },
  s0744: {
    literal: 'Eleventh month, bingxu new moon.',
    idiomatic: 'The eleventh month opened on bingxu.',
  },
  s0745: {
    literal: 'On gengyin the Emperor performed rites at the ancestral temple; when rites ended he attended Danfeng Gate, great amnesty, era changed to Qianfu.',
    idiomatic: 'On gengyin ancestral rites ended with amnesty and the Qianfu era.',
  },
  s0746: {
    literal: 'Grand Councillor Xiao Fang also held Minister of Works, Hongwen Hall academician, Grand Preceptor of the Supreme Ultimate Palace; Vice Minister of War Cui Yanzhao was made Secretariat Vice Director; Vice Minister of War Zheng Tian was made Academician of the Hall of Assembled Worthies.',
    idiomatic: 'Xiao Fang, Cui Yanzhao, and Zheng Tian received new honors.',
  },
  s0747: {
    literal: 'An edict: "We consider the Shatuo fierce and brave, repeatedly accumulating battle merit; the six prefectures\' Fan and Hun bathe in royal transformation.',
    idiomatic: 'An edict on the Shatuo said:',
  },
  s0748: {
    literal: 'Thinking that from suspicion and division they mutually harmed—and Ke Zhang avenges, his intent not yet ended.',
    idiomatic: '"They fight from suspicion while Ke Zhang still seeks revenge—',
  },
  s0749: {
    literal: 'Covered by our ruling virtue, we pity our nurturing heart and thus choose the able to pacify them.',
    idiomatic: '"—so we send an able man to pacify them.',
  },
  s0750: {
    literal: 'Your forebear once governed the northern gate, treated Guochang with heroic talent, and placed Guochang in a place of salvation.',
    idiomatic: 'Li Jun\'s father once saved Guochang at Taiyuan—',
  },
  s0751: {
    literal: 'Relying on generations of old ties and cherishing duty to the soil.',
    idiomatic: '—relying on old ties and duty to the soil.',
  },
  s0752: {
    literal: 'Therefore we entrust you with the frontier and delegate military affairs—you must gather royal affairs and not fall from family renown.',
    idiomatic: 'Entrust the frontier and do not shame your house.',
  },
  s0753: {
    literal: 'Earlier Jun\'s father Ye governed Taiyuan and could settle the northern tribes.',
    idiomatic: 'Jun\'s father had once settled the northern tribes.',
  },
  s0754: {
    literal: 'At that time Li Guochang father and son held Datong and Zhenwu; Tujue, Qibi, and Youzhou armies attacked without success—therefore Jun was lent Lingwu\'s banner to lead troops to summon and instruct.',
    idiomatic: 'With Guochang entrenched, Li Jun was sent to Lingwu to summon them.',
  },
  s0755: {
    literal: 'Chang\'an magistrate Li Bi was made Remonstrance Official; Vice Director of Personnel Xu Yanruo was made Chang\'an magistrate.',
    idiomatic: 'Li Bi and Xu Yanruo exchanged Chang\'an posts.',
  },
  s0756: {
    literal: 'Director of War Lu Shan was made Chuzhou prefect.',
    idiomatic: 'Lu Shan became Chuzhou prefect.',
  },
  s0757: {
    literal: 'Twelfth month: Tangut and Uyghur raided the border.',
    idiomatic: 'In the twelfth month Tangut and Uyghur raided the border.',
  },
  s0758: {
    literal: 'Left Department Director Cui Yuan was made Director of War; Jiangzhou prefect Li Keren was made Right Department Director.',
    idiomatic: 'Cui Yuan and Li Keren received department posts.',
  },
  s0759: {
    literal: 'Acting Minister of Works Niu Wei was made Minister of Rites; Crown Prince Guest Yu Yong was made Minister of Works.',
    idiomatic: 'Niu Wei and Yu Yong exchanged rites and works posts.',
  },
  s0760: {
    literal: 'That winter Nanzhao barbarians raided Shu; an edict ordered Hexi, Hedong, Shannan West, and Dongchuan to mobilize troops for relief.',
    idiomatic: 'That winter Nanzhao raided Shu; circuits mobilized relief.',
  },
  s0761: {
    literal: 'Jiannan West military commissioner Gao Pian memorialized: "Per the edict drafting troops from Changwu, Binzhou, Hedong and other circuits for the Jiannan campaign.',
    idiomatic: 'Gao Pian objected to drafting northern troops:',
  },
  s0762: {
    literal: 'We consider that western Shu new and old armies arriving are already many; moreover the southern barbarian small foes can surely be braced.',
    idiomatic: '"Shu already has ample troops; the barbarians are small foes—',
  },
  s0763: {
    literal: 'Now roads are rugged, stations exhausted; adding army encampments at once brings displacement—what is called hoping one place is whole while a hundred places break.',
    idiomatic: '"—northern drafts exhaust stations and displace people—',
  },
  s0764: {
    literal: 'Moreover troops are not in numbers but in harmony; the Left and Right Divine Strategy Changwu garrison, Binzhou, Hedong drafted armored horsemen are not few, and preparing army grain costs especially much.',
    idiomatic: '"—and harmony, not numbers, wins wars; the cost is immense.',
  },
  s0765: {
    literal: 'Moreover the three circuits\' commissioners all choke the Qiang frontier; the border is not yet calm—we hope they are not drafted.',
    idiomatic: '"The northern frontier is unsettled—do not draft them.',
  },
  s0766: {
    literal: 'If already on the road, all please receive an edict ordering return.',
    idiomatic: 'Recall any troops already marching.',
  },
  s0767: {
    literal: 'The edict replied: "If the southern barbarians still rely on aggression, troops must indeed be doubled to resist;',
    idiomatic: 'The court replied: double troops if the barbarians still attack;',
  },
  s0768: {
    literal: 'if they have fled, then must combine strength to pursue and capture.',
    idiomatic: 'pursue if they flee.',
  },
  s0769: {
    literal: 'We rely on northern armies to help pacify southern bandits; the three places\' soldiers should be distributed and driven by Gao Pian when he reaches Shu.',
    idiomatic: 'Northern troops would serve under Gao Pian in Shu—',
  },
  s0770: {
    literal: 'Strive for abundant preparation; do not disorder the orderly army.',
    idiomatic: '—prepare abundantly without disordering the army.',
  },
  s0771: {
    literal: 'The Hedong twelve hundred men—order Dou Huan not to draft them.',
    idiomatic: 'Dou Huan was ordered not to draft Hedong\'s twelve hundred.',
  },
  s0772: {
    literal: 'At that time Pian had already repelled the barbarians; Changwu soldiers still reached Shu and returned—critics regretted the labor and cost while rewards for coming and going were vainly claimed.',
    idiomatic: 'Pian had already repelled the barbarians; Changwu troops marched to Shu in vain—critics deplored the waste.',
  },
  s0773: {
    literal: 'Right Army Commandant Han Wenyue begged retirement for illness; it was granted.',
    idiomatic: 'Han Wenyue retired ill.',
  },
  s0774: {
    literal: 'Qianfu 2, first month, yiyou new moon.',
    idiomatic: 'Qianfu 2 opened on yiyou.',
  },
  s0775: {
    literal: 'On jichou Grand Councillor Cui Yanzhao led civil and military officials in offering a honorific; the Emperor attended the main hall to receive the enfeoffment.',
    idiomatic: 'On jichou Cui Yanzhao led officials in offering a honorific.',
  },
  s0776: {
    literal: 'Acting Inner Pivot Director Tian Lingze was made Right Army Commandant.',
    idiomatic: 'Tian Lingze became right army commandant.',
  },
  s0777: {
    literal: 'Southern barbarian Piao Xin sent envoys begging alliance; it was granted.',
    idiomatic: 'Nanzhao envoys begged alliance; the court granted it.',
  },
  s0778: {
    literal: 'Fengzhou prefect Guo Hongye was made Left Golden Guard General.',
    idiomatic: 'Guo Hongye became left golden guard general.',
  },
  s0779: {
    literal: 'Storehouse Department Director Wei Xiu was made Sizhou prefect; Capital Punishments Vice Director Li Pin was made Jianzhou prefect.',
    idiomatic: 'Wei Xiu and Li Pin received prefectures.',
  },
  s0780: {
    literal: 'Second month: Vice Minister of War, salt and iron transport commissioner Wang Ning was made Secretariat Director—for the crime of filling clerk posts.',
    idiomatic: 'In the second month Wang Ning was demoted to secretariat director for illicit clerk appointments.',
  },
  s0781: {
    literal: 'Vice Minister of Personnel Pei Tan was made Vice Minister of War, salt and iron transport commissioner for all circuits.',
    idiomatic: 'Pei Tan took salt and iron transport.',
  },
  s0782: {
    literal: 'Hanlin Academician Cui Dan was made Secretariat Drafting Officer;',
    idiomatic: 'Cui Dan and Xu Rensi were promoted;',
  },
  s0783: {
    literal: 'Hanlin Academician Xu Rensi was made Director of Seals, academician as before.',
    idiomatic: 'Xu Rensi became director of seals while remaining academician.',
  },
  s0784: {
    literal: 'Rongguan pacification commissioner Gao Qin was made Acting Minister of Revenue; Director of the Imperial Granary Li Yun was made Director of the Imperial Clan; Huzhou prefect Zhang Bo was made Luzhou prefect; Storehouse Department Vice Director Yang Kan was made Vice Director of Personnel.',
    idiomatic: 'Gao Qin, Li Yun, Zhang Bo, and Yang Kan received posts.',
  },
  s0785: {
    literal: 'Third month: Right Supplementation Official Zheng Qin was made Diarist; Revenue and Expenditure investigating officer Niu Hui was made Right Supplementation Official.',
    idiomatic: 'In the third month Zheng Qin and Niu Hui were promoted.',
  },
  s0786: {
    literal: 'Director of Revenue Cui Yanrong was made Chang\'an magistrate; Capital Punishments Director Yang Zhituì was made Director of Revenue.',
    idiomatic: 'Cui Yanrong and Yang Zhituì exchanged revenue posts.',
  },
  s0787: {
    literal: 'Left Department Vice Director Tang Jiao was made Director of Punishments; Punishments Vice Director Bi Shaoyan was made Left Department Vice Director; Attending Censor Zheng Xu was made Punishments Vice Director.',
    idiomatic: 'Tang Jiao, Bi Shaoyan, and Zheng Xu received punishments posts.',
  },
  s0788: {
    literal: 'Fourth month: sea bandit Wang Ye attacked and plundered Zhexi prefectures and counties.',
    idiomatic: 'In the fourth month Wang Ye raided Zhexi.',
  },
  s0789: {
    literal: 'Palace Diarist Li Zhu was made Vice Director of Rites.',
    idiomatic: 'Li Zhu became vice director of rites.',
  },
  s0790: {
    literal: 'Crown Prince Guest Zhang Ti was made Vice Minister of Personnel.',
    idiomatic: 'Zhang Ti became vice minister of personnel.',
  },
  s0791: {
    literal: 'Former Huainan military commissioner Li Wei was made Director of the Court of the Imperial Clan; Chengde Army military commissioner Wang Jingchong was advanced to Palace Equal in Honor with the Three Excellencies.',
    idiomatic: 'Li Wei took the imperial clan directorate; Wang Jingchong received supreme honor.',
  },
  s0792: {
    literal: 'Secretariat Director Xiao Xian was made Director of the Imperial University.',
    idiomatic: 'Xiao Xian became university director.',
  },
  s0793: {
    literal: 'Ruzhou prefect Cui Yanhong was made Crown Prince Guest, branch office.',
    idiomatic: 'Cui Yanhong became crown prince guest at branch office.',
  },
  s0794: {
    literal: 'Newly appointed Vice Minister of Personnel Zhang Ti was made Capital Intendant.',
    idiomatic: 'Zhang Ti became capital intendant.',
  },
  s0795: {
    literal: 'Dongchuan inspection military commissioner Wu Xinglu may be Silver-Purple Grandee, Acting Minister of War, concurrent Zizhou prefect, censor-in-chief, Jiannan East circuit military commissioner and related posts.',
    idiomatic: 'Wu Xinglu became Jiannan East commander.',
  },
  s0796: {
    literal: 'Jiannan East military commissioner, Acting Minister of Revenue Cui Chong was made Henan prefect;',
    idiomatic: 'Cui Chong became Henan prefect;',
  },
  s0797: {
    literal: 'Henan prefect Li Hui was made Acting Left Regular Attendant, concurrent Fuzhou prefect, Fujian metropolitan training and observation commissioner.',
    idiomatic: 'Li Hui went to Fujian.',
  },
  s0798: {
    literal: 'Fengxiang Longxi military commissioner, Acting Minister of Works, Grand Councillor, Upper Pillar of State, Duke of Liang with three-thousand-household fief Linghu Tao was advanced to Duke of Zhao.',
    idiomatic: 'Linghu Tao was advanced to Duke of Zhao.',
  },
  s0799: {
    literal: 'Fifth month: Puzhou bandit leader Wang Xianzhi gathered at Changyuan county—his crowd three thousand, plundering villages, advancing to take Puzhou, capturing ten thousand strong youths.',
    idiomatic: 'In the fifth month Wang Xianzhi gathered three thousand at Changyuan and seized Puzhou.',
  },
  s0800: {
    literal: 'Yanzhou military commissioner Li Zhong led troops to strike them and was defeated by the bandits.',
    idiomatic: 'Li Zhong attacked and was defeated.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
