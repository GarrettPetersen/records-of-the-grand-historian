#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'On gengzi an edict stripped Li Tongjie of his active offices and ranks and again made Zhang Maozong military commissioner of Yan, Hai, Yi, and Mi.',
    idiomatic: 'On gengzi Li Tongjie lost his ranks and Zhang Maozong returned to Yan-Hai-Yi-Mi.',
  },
  s0502: {
    literal: 'On xinchou Binning military commissioner Gao Chengjian died.',
    idiomatic: 'On xinchou Gao Chengjian died at Binning.',
  },
  s0503: {
    literal: 'On renyin Minister of Punishments Liu Gongchuo was made acting Left Vice Director and Binning military commissioner.',
    idiomatic: 'On renyin Liu Gongchuo took Binning.',
  },
  s0504: {
    literal: 'On wushen Remonstrance official Zhang Zhongfang was made Fujian observation commissioner.',
    idiomatic: 'On wushen Zhang Zhongfang took Fujian.',
  },
  s0505: {
    literal: 'On guichou former Fujian observation commissioner Dugu Lang died.',
    idiomatic: 'On guichou Dugu Lang died.',
  },
  s0506: {
    literal: 'Ninth month, gengshen new moon.',
    idiomatic: 'The ninth month opened on gengshen.',
  },
  s0507: {
    literal: 'On guihai Left Divine Army general and army supervisor He Wenzhe was made Yan-Fang-Dan-Yan military commissioner.',
    idiomatic: 'On guihai He Wenzhe took Yan-Fang-Dan-Yan.',
  },
  s0508: {
    literal: 'On jiaxu Left Divine Strategy army supervisor Li Yong was made Chanyu protector-general and Zhenwu-Linsheng military commissioner.',
    idiomatic: 'On jiaxu Li Yong took Zhenwu.',
  },
  s0509: {
    literal: 'On dingchou Zhexi observation commissioner Li Deyu and Zhedong observation commissioner Yuan Zhen were advanced to acting Minister of Rites.',
    idiomatic: 'On dingchou Li Deyu and Yuan Zhen received acting Rites ranks.',
  },
  s0510: {
    literal: 'On renwu Guiguan observation commissioner Liu Qichu died.',
    idiomatic: 'On renwu Liu Qichu died.',
  },
  s0511: {
    literal: 'On bingxu Remonstrance official Xiao Yu was made Guiguan observation commissioner.',
    idiomatic: 'On bingxu Xiao Yu took Guiguan.',
  },
  s0512: {
    literal: 'On guichou Yanzhou again established Laicheng county.',
    idiomatic: 'On guichou Laicheng county was restored to Yanzhou.',
  },
  s0513: {
    literal: 'Eleventh month, jiwei new moon.',
    idiomatic: 'The eleventh month opened on jiwei.',
  },
  s0514: {
    literal: 'On bingshen Hezhong\'s Xue Ping memorialized that a white tiger entered Lingfeng Abbey in Yuxiang county.',
    idiomatic: 'On bingshen Xue Ping reported a white tiger at Lingfeng Abbey.',
  },
  s0515: {
    literal: 'Tianping and Henghai military commissioner, acting Minister of Education, Grand Councillor Wu Tongyin died.',
    idiomatic: 'Grand Councillor Wu Tongyin died.',
  },
  s0516: {
    literal: 'On gengchen Baoyi military commissioner and Jin-Ci disposal commissioner Li Huan was made Henghai military commissioner.',
    idiomatic: 'On gengchen Li Huan took Henghai.',
  },
  s0517: {
    literal: 'On guisi Jin and Ci prefectures were again subordinate to Hezhong.',
    idiomatic: 'On guisi Jin and Ci returned to Hezhong.',
  },
  s0518: {
    literal: 'On guisi Left Vice Director Qian Hui was made Hua prefect.',
    idiomatic: 'On guisi Qian Hui became Hua prefect.',
  },
  s0519: {
    literal: 'On dingyou Right Gold Crow guard great general Wang Gongliang was made Tan prefect and Hunan observation commissioner.',
    idiomatic: 'On dingyou Wang Gongliang took Hunan.',
  },
  s0520: {
    literal: 'Dade 2, spring, first month, wuwu new moon.',
    idiomatic: 'Dade 2 opened on wuwu.',
  },
  s0521: {
    literal: 'On renshen Right Palace Companion Kong Zhe was made Jingzhao prefect.',
    idiomatic: 'On renshen Kong Zhe took Jingzhao.',
  },
  s0522: {
    literal: 'Second month, dinghai new moon: Vice Minister of War Wang Qi was made Shan-Guo observation commissioner, replacing Wei Hongjing;',
    idiomatic: 'On dinghai Wang Qi replaced Wei Hongjing at Shan-Guo;',
  },
  s0523: {
    literal: 'Hongjing was made Left Vice Director.',
    idiomatic: 'Wei Hongjing became left vice director.',
  },
  s0524: {
    literal: 'On yisi Vice Minister of Punishments Lu Yuanfu was made Vice Minister of War; Secretariat Director Bai Juyi was made Vice Minister of Punishments.',
    idiomatic: 'On yisi Lu Yuanfu took War and Bai Juyi Punishments.',
  },
  s0525: {
    literal: 'On gengxu an edict: the three fascicles of the Empress Wu-revised Zhao Ren Ben Ye that Li Jiang presented should be copied and distributed to villages in every prefecture and county.',
    idiomatic: 'On gengxu Li Jiang\'s revised Zhao Ren Ben Ye was ordered copied to every village.',
  },
  s0526: {
    literal: 'Third month, dingsi new moon: Revenue memorialized: "Near the brine pools in Fengyi county of Jingzhao, commoners take water and burn cypress charcoal to boil ash for salt, each load of ash yielding twelve jin one liang of salt — more lawless than brine-soil salt; please forbid it.',
    idiomatic: 'On dingsi Revenue asked to ban illicit ash-salt boiling near Fengyi brine pools:',
  },
  s0527: {
    literal: 'Henceforth violators are to be sentenced by salt reckoned from the ash, exactly like the two-pool salt statutes."',
    idiomatic: '"Violators shall be punished by ash-equivalent salt under the two-pool statutes."',
  },
  s0528: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0529: {
    literal: 'On xinsi the Emperor personally tested policy-examination candidates at Xuanzheng Hall.',
    idiomatic: 'On xinsi Wenzong tested policy candidates at Xuanzheng.',
  },
  s0530: {
    literal: 'Left Palace Companion Feng Su, Vice Director of Sacrifices Jia Su, and Bureau of Stores director Pang Yan were made policy-examination examiners.',
    idiomatic: 'Feng Su, Jia Su, and Pang Yan examined the policy candidates.',
  },
  s0531: {
    literal: 'Intercalary third month, bingxu new moon: a waterwheel model issued from the inner palace; Jingzhao was ordered to build waterwheels and distribute them to commoners along the Zheng-Bai canal to irrigate paddy fields.',
    idiomatic: 'On bingxu the court distributed canal waterwheels to Zheng-Bai farmers.',
  },
  s0532: {
    literal: 'Summer, fourth month, bingchen new moon.',
    idiomatic: 'The fourth month opened on bingchen.',
  },
  s0533: {
    literal: 'On renwu Yongguan pacification commissioner Wang Maoyuan was made Rongguan pacification commissioner.',
    idiomatic: 'On renwu Wang Maoyuan took Rongguan.',
  },
  s0534: {
    literal: 'Fifth month, yiyou new moon.',
    idiomatic: 'The fifth month opened on yiyou.',
  },
  s0535: {
    literal: 'On dingsi the Emperor ordered envoys to announce at Princess Hanyang\'s residence and other princesses\' mansions: "Henceforth on audience days you may not wear many hairpins and combs, nor short tight garments."',
    idiomatic: 'On dingsi princesses were ordered to dress plainly on audience days.',
  },
  s0536: {
    literal: 'On yiwei Vice Minister of Personnel Ding Gongzhu was made Minister of Rites.',
    idiomatic: 'On yiwei Ding Gongzhu took Rites.',
  },
  s0537: {
    literal: 'On gengzi an edict: "All circuit tribute to the inner treasury at the four seasons and birthday — gold-flower silver vessels and brocade trifles — is to be converted to ingot silver and silk bolts.',
    idiomatic: 'On gengzi Wenzong ordered circuit tribute silver and brocade converted to ingots and silk:',
  },
  s0538: {
    literal: 'Where gifts are still needed, wait five years before further orders."',
    idiomatic: '"Further palace gifts may wait five years."',
  },
  s0539: {
    literal: 'The Emperor was by nature respectful and frugal, detested extravagance, and wished the people to honor the root — hence this edict.',
    idiomatic: 'Wenzong\'s frugal nature prompted the edict.',
  },
  s0540: {
    literal: 'When the Emperor spoke with lecture academician Xu Kangzuo about taking python gall, live-disemboweling the belly, he was deeply moved with pity.',
    idiomatic: 'Live python disemboweling for gall moved Wenzong to pity.',
  },
  s0541: {
    literal: 'He then edicted Revenue: "The annual python-gall tribute of four liang — one from Guizhou, two from Hezhou, one from Quanzhou — should be reduced by three liang within the total; the three prefectures shall rotate yearly tribute of one liang each."',
    idiomatic: 'Python-gall tribute was cut to one liang yearly, rotated among three prefectures.',
  },
  s0542: {
    literal: 'The Emperor himself compiled ruler-minister deeds from the Documents, ordered painters to depict them at Taiye Pavilion, and viewed them morning and evening.',
    idiomatic: 'Wenzong painted Document parables at Taiye for daily study.',
  },
  s0543: {
    literal: 'Wang Tingcou sent troops to harass neighboring circuits, wishing to shake imperial forces aiding Li Tongjie; Zhaoyi\'s Liu Congjian asked to march against him.',
    idiomatic: 'Wang Tingcou raided neighbors to aid Li Tongjie; Liu Congjian sought to attack him.',
  },
  s0544: {
    literal: 'Sixth month, yimao new moon: Prince of Jin Pu died and was posthumously made Mourning-Heir crown prince.',
    idiomatic: 'On yimao Prince Pu died and became Mourning-Heir crown prince.',
  },
  s0545: {
    literal: 'Chen prefecture flooded and harmed the autumn crop.',
    idiomatic: 'Floods ruined Chen\'s autumn harvest.',
  },
  s0546: {
    literal: 'On guihai the Four Directions Lodge requested a seal bearing the text "Secretariat Four Directions Lodge."',
    idiomatic: 'On guihai the Four Directions Lodge received its seal.',
  },
  s0547: {
    literal: 'On xinyou Minister of Personnel Zheng Yin was made heir-apparent Junior Mentor.',
    idiomatic: 'On xinyou Zheng Yin became junior mentor.',
  },
  s0548: {
    literal: 'On xinsi Lingwu military commissioner Li Jincheng was made Binning military commissioner; Tiande army commissioner Li Wenyue was made Lingwu military commissioner.',
    idiomatic: 'On xinsi Li Jincheng and Li Wenyue exchanged Lingwu and Binning.',
  },
  s0549: {
    literal: 'On yiyou former Binning military commissioner Liu Gongchuo was made acting Left Vice Director and concurrent Minister of Punishments.',
    idiomatic: 'On yiyou Liu Gongchuo took Punishments and acting left vice director.',
  },
  s0550: {
    literal: 'On jiachen an edict ordered chief ministers to assemble regular officials of the Three Offices at fourth rank and above to debate whether Wang Tingcou could be attacked.',
    idiomatic: 'On jiachen the court debated attacking Wang Tingcou.',
  },
  s0551: {
    literal: 'That night a comet appeared west of Sheti south, two chi long.',
    idiomatic: 'A two-chi comet appeared west of Sheti that night.',
  },
  s0552: {
    literal: 'Eighth month, jiayin new moon.',
    idiomatic: 'The eighth month opened on jiayin.',
  },
  s0553: {
    literal: 'On dingsi Vice Minister of War Lu Yuanfu was made Hua prefect and Zhenguo army commissioner, replacing Qian Hui;',
    idiomatic: 'On dingsi Lu Yuanfu replaced Qian Hui at Hua;',
  },
  s0554: {
    literal: 'Hui was made Minister of Personnel and retired.',
    idiomatic: 'Qian Hui retired as personnel minister.',
  },
  s0555: {
    literal: 'On renxu seventeen capital-area counties including Fengyi flooded.',
    idiomatic: 'On renxu seventeen capital counties flooded.',
  },
  s0556: {
    literal: 'Ninth month, jiashen new moon.',
    idiomatic: 'The ninth month opened on jiashen.',
  },
  s0557: {
    literal: 'On dinghai Wang Zhixing captured Di prefecture.',
    idiomatic: 'On dinghai Wang Zhixing took Di prefecture.',
  },
  s0558: {
    literal: 'The newly appointed Henghai military commissioner Li Huan was made Xia military commissioner.',
    idiomatic: 'Li Huan was shifted from Henghai to Xia.',
  },
  s0559: {
    literal: 'On jiawu an edict stripped Wang Tingcou of active offices and ranks; neighboring circuits might attack at will.',
    idiomatic: 'On jiawu Wang Tingcou was stripped and neighbors authorized to attack.',
  },
  s0560: {
    literal: 'Former Xia military commissioner Fu Liangbi was made Henghai military commissioner.',
    idiomatic: 'Fu Liangbi took Henghai.',
  },
  s0561: {
    literal: 'On gengxu Annan army mutinied and expelled protector-general Han Yue.',
    idiomatic: 'On gengxu Annan troops expelled Han Yue.',
  },
  s0562: {
    literal: 'Winter, tenth month, guichou new moon.',
    idiomatic: 'The tenth month opened on guichou.',
  },
  s0563: {
    literal: 'On dingsi Yangzhou Hailing stud farm was abolished.',
    idiomatic: 'On dingsi Hailing stud farm closed.',
  },
  s0564: {
    literal: 'Minister of Revenue Cui Zhi was made Hua prefect and Zhenguo army commissioner.',
    idiomatic: 'Cui Zhi took Hua.',
  },
  s0565: {
    literal: 'On bingyin Lingnan military commissioner Hu Zheng died.',
    idiomatic: 'On bingyin Hu Zheng died.',
  },
  s0566: {
    literal: 'On xinwei Jiangxi observation commissioner Li Xian was made Lingnan military commissioner.',
    idiomatic: 'On xinwei Li Xian took Lingnan.',
  },
  s0567: {
    literal: 'On guiyou Right Vice Director and Grand Councillor Dou Yizhi was made acting Left Vice Director and Grand Councillor, Shannan East military commissioner and Linhan stud commissioner, replacing Li Fengji;',
    idiomatic: 'On guiyou Dou Yizhi replaced Li Fengji at Shannan East;',
  },
  s0568: {
    literal: 'Fengji was made Xuanwu military commissioner, replacing Linghu Chu;',
    idiomatic: 'Li Fengji took Xuanwu from Linghu Chu;',
  },
  s0569: {
    literal: 'Chu was made Minister of Revenue.',
    idiomatic: 'Linghu Chu took Revenue.',
  },
  s0570: {
    literal: 'Right Vice Director Shen Chuanshi was made Jiangxi observation commissioner.',
    idiomatic: 'Shen Chuanshi took Jiangxi.',
  },
  s0571: {
    literal: 'On jimao Henan prefect Wang Fan was made Right Vice Director; Left Palace Companion Feng Su was made Henan prefect.',
    idiomatic: 'On jimao Wang Fan and Feng Su exchanged Henan and the right vice directorate.',
  },
  s0572: {
    literal: 'Eleventh month, guimao new moon.',
    idiomatic: 'The eleventh month opened on guimao.',
  },
  s0573: {
    literal: 'On yiyou Right Gold Crow great general Li You was made Henghai military commissioner because the newly appointed Fu Liangbi died en route at Shan prefecture.',
    idiomatic: 'On yiyou Li You took Henghai after Fu Liangbi died on the road.',
  },
  s0574: {
    literal: 'On jiachen at the si hour Zhaode Temple in the inner palace caught fire east of Xuanzheng Hall; by wu-wei a north wind strengthened the blaze until evening it eased slightly.',
    idiomatic: 'On jiachen Zhaode Temple burned beside Xuanzheng until evening.',
  },
  s0575: {
    literal: 'Twelfth month, renzi new moon.',
    idiomatic: 'The twelfth month opened on renzi.',
  },
  s0576: {
    literal: 'On yichou Weibo field commander Qi Zhishao led twenty thousand troops in planned rebellion, intending to kill Shi Xianchéng and his sons.',
    idiomatic: 'On yichou Qi Zhishao rebelled against the Shi clan with twenty thousand men.',
  },
  s0577: {
    literal: 'On renshen Secretariat Vice Director and Grand Councillor Wei Chuhou died suddenly.',
    idiomatic: 'On renshen Wei Chuhou died suddenly.',
  },
  s0578: {
    literal: 'On wuyin an edict made Vice Minister of War, edict drafter, and Hanlin academician Lu Sui Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'On wuyin Lu Sui joined the Grand Council.',
  },
  s0579: {
    literal: 'Dade 3, spring, first month, renwu new moon.',
    idiomatic: 'Dade 3 opened on renwu.',
  },
  s0580: {
    literal: 'On bingxu Qi Zhishao led troops back to hold Yongji county; his followers scattered into various counties.',
    idiomatic: 'On bingxu Qi Zhishao held Yongji while his men scattered.',
  },
  s0581: {
    literal: 'Shi Xianchéng reported distress; an edict ordered Cangzhou field troops to rescue him.',
    idiomatic: 'Cangzhou troops were sent to Shi Xianchéng\'s aid.',
  },
  s0582: {
    literal: 'On dinghai Jingzhao prefect Kong Zhe died.',
    idiomatic: 'On dinghai Kong Zhe died.',
  },
  s0583: {
    literal: 'On gengyin retired Minister of Personnel Qian Hui died.',
    idiomatic: 'On gengyin Qian Hui died.',
  },
  s0584: {
    literal: 'On gengzi Li Ting defeated Qi Zhishao\'s troops; Zhishao fled north to Zhen prefecture.',
    idiomatic: 'On gengzi Li Ting routed Qi Zhishao toward Zhen.',
  },
  s0585: {
    literal: 'On jiachen Grand Master of Sacrifices Li Jiang was made acting Minister of Works, Xingyuan prefect, and Shannan West military commissioner.',
    idiomatic: 'On jiachen Li Jiang took Shannan West.',
  },
  s0586: {
    literal: 'Hua prefect and Tong Pass defense commissioner Cui Zhi died.',
    idiomatic: 'Cui Zhi died at Hua.',
  },
  s0587: {
    literal: 'On jiyou former Shannan West military commissioner Wang Ya was made Director of Sacrifices.',
    idiomatic: 'On jiyou Wang Ya took Sacrifices.',
  },
  s0588: {
    literal: 'Second month, xinhai new moon: Minister of War Cui Qun was made Jingnan military commissioner.',
    idiomatic: 'On xinhai Cui Qun took Jingnan.',
  },
  s0589: {
    literal: 'On jiayin Jingnan military commissioner Wang Qian died.',
    idiomatic: 'On jiayin Wang Qian died.',
  },
  s0590: {
    literal: 'Third month, xinsi new moon: Minister of Revenue Linghu Chu was made eastern-capital regent.',
    idiomatic: 'On xinsi Linghu Chu became Luoyang regent.',
  },
  s0591: {
    literal: 'On yiyou an edict: while arms have not ceased, Music Office daily musicians on duty should temporarily stop.',
    idiomatic: 'On yiyou palace musicians were suspended for the war.',
  },
  s0592: {
    literal: 'On renchen Yiding military commissioner Liu Gongji died.',
    idiomatic: 'On renchen Liu Gongji died.',
  },
  s0593: {
    literal: 'Former eastern-capital regent Cui Cong was made Minister of Revenue.',
    idiomatic: 'Cui Cong took Revenue.',
  },
  s0594: {
    literal: 'Summer, fourth month, gengwu: Wang Zhixing memorialized that his officer Shi Xiong stirred the army; requesting court punishment, Xiong was exiled to Ba prefecture.',
    idiomatic: 'In the fourth month Shi Xiong was exiled for stirring Wang Zhixing\'s troops.',
  },
  s0595: {
    literal: 'Fifth month, jimao new moon.',
    idiomatic: 'The fifth month opened on jimao.',
  },
  s0596: {
    literal: 'On jiashen Bo Ji beheaded Li Tongjie at Jiangling; Cang-Jing was pacified and Li You entered Cang prefecture.',
    idiomatic: 'On jiashen Bo Ji killed Li Tongjie and Li You entered Cang.',
  },
  s0597: {
    literal: 'On dinghai the Emperor mounted Xing\'an Tower and received Cangzhou\'s presentation.',
    idiomatic: 'On dinghai Wenzong received the Cangzhou captives at Xing\'an Tower.',
  },
  s0598: {
    literal: 'Li You sent Li Tongjie\'s mother, wife, and son Yuanda and others to court; an edict pardoned them and ordered settlement in Hunan.',
    idiomatic: 'Li Tongjie\'s family was pardoned and sent to Hunan.',
  },
  s0599: {
    literal: 'Cang-De pacification remonstrance official Bo Ji was demoted to Xunzhou registrar; pacification aide Palace Censor Shen Yazhi to Qianzhou Nankang sheriff — for entering Cangzhou on their own to seize Li Tongjie, angering the circuits, which memorialized against them.',
    idiomatic: 'Bo Ji and Shen Yazhi were punished for seizing Li Tongjie without orders.',
  },
  s0600: {
    literal: 'On bingshen Henghai military commissioner Li You died.',
    idiomatic: 'On bingshen Li You died.',
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
if (data.metadata.chapter !== '017') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 016; standalone T ready (${Object.keys(T).length} entries).`
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
