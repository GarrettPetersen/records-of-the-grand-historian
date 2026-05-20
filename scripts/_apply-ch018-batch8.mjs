#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
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
    literal: 'Fifth month: left and right street merit commissioners memorialized: "Per the fifth-day amnesty section this month, the upper capital\'s two wards keep four temples, eight more to be added outside.',
    idiomatic: 'Merit commissioners proposed restoring eight capital temples under the amnesty.',
  },
  s0702: {
    literal: 'Two keep original names Xingtang Temple and Baoshou Temple.',
    idiomatic: 'Xingtang and Baoshou kept their names.',
  },
  s0703: {
    literal: 'Six request old-name changes: Baoying to Zisheng, Qinglong to Huguo, Puti to Baotang, Qingchan to Anguo, Fayun Nunnery to Tang\'an, Chongjing Nunnery to Tangchang.',
    idiomatic: 'Six temples were renamed under the restoration plan.',
  },
  s0704: {
    literal: 'Right ward adds eight.',
    idiomatic: 'The right ward gained eight sites.',
  },
  s0705: {
    literal: 'Ximing Temple changed to Fushou Temple, Zhuangyan to Shengshou — former retained temples.',
    idiomatic: 'Ximing became Fushou and Zhuangyan Shengshou among retained temples.',
  },
  s0706: {
    literal: 'Two old names: Qianfu to Xingyuan, Huadu to Chongfu, Yongtai to Wanshou, Wenguo to Chongsheng, Jingxing to Longxing, Feng\'en to Xingfu.',
    idiomatic: 'Qianfu, Huadu, and others were renamed as listed.',
  },
  s0707: {
    literal: 'Closing quote." Edict assented.',
    idiomatic: 'Thus ended the memorial. The throne assented.',
  },
  s0708: {
    literal: 'Twelve Daoists including Liu Xuanjing were executed — because their doctrines deluded Wuzong and slandered Buddhism.',
    idiomatic: 'Liu Xuanjing and eleven other Daoists were executed for swaying Wuzong against Buddhism.',
  },
  s0709: {
    literal: 'This month\'s fifth-day amnesty section: Personnel\'s three selection boards choose candidates only by seniority — many lack real talent; observation commissioners and prefects may recommend men of strange talent and unusual governance for trial appointment.',
    idiomatic: 'The amnesty allowed prefects to recommend talent beyond seniority lists.',
  },
  s0710: {
    literal: 'Also when observation commissioners and prefects hand over office, if household registers they deliver increase by a thousand households, they receive exceptional promotion;',
    idiomatic: 'Prefects who added a thousand households on handover won fast promotion;',
  },
  s0711: {
    literal: 'if flight reaches seven hundred households, for three years after leaving they may not take office.',
    idiomatic: 'those who lost seven hundred were barred three years.',
  },
  s0712: {
    literal: 'Also exiles at Tiande and Zhenwu — measure loan of grain seed in the circuit so they farm as livelihood.',
    idiomatic: 'Frontier exiles were lent seed to farm.',
  },
  s0713: {
    literal: 'Jiannan East military commissioner, acting Minister of Rites Lu Shang was made Vice Minister of War and Grand Councillor.',
    idiomatic: 'Lu Shang joined the council from Jiannan East.',
  },
  s0714: {
    literal: 'Sixth month: Vice Minister of Revenue, circuit salt-and-iron commissioner Ma Zhi was made Grand Councillor in his original posts.',
    idiomatic: 'Ma Zhi joined the council in the sixth month.',
  },
  s0715: {
    literal: 'Seventh month: Minister of War Li Rangyi was made Jiannan East military commissioner.',
    idiomatic: 'Li Rangyi took Jiannan East in the seventh month.',
  },
  s0716: {
    literal: 'Tenth month, edict: "Grand Temple shared offerings should pair meritorious subjects.',
    idiomatic: 'An edict paired meritorious subjects in Xianzong\'s temple offerings.',
  },
  s0717: {
    literal: 'At Xianzong\'s temple, Pei Du, Du Huangchang, Li Su, Gao Chongwen, and others are to share offerings."',
    idiomatic: 'Pei Du, Du Huangchang, Li Su, and Gao Chongwen were named.',
  },
  s0718: {
    literal: 'Jingnan military commissioner Li Deyu was made eastern capital regent.',
    idiomatic: 'Li Deyu became Luoyang regent.',
  },
  s0719: {
    literal: 'Eleventh month: the responsible office offered at the Grand Temple; Muzong\'s chamber text said "imperial elder brother."',
    idiomatic: 'At the Grand Temple offering Muzong was styled "imperial elder brother."',
  },
  s0720: {
    literal: 'Grand Temple academician Min Qingzhi memorialized: "Ritual has honoring honor, not sequencing kinship.',
    idiomatic: 'Min Qingzhi protested the kinship wording.',
  },
  s0721: {
    literal: 'Prayer text saying younger brother is improper; please change to \'successor Emperor\'."',
    idiomatic: 'He asked that "younger brother" become "successor Emperor."',
  },
  s0722: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0723: {
    literal: 'Jingzhao prefecture memorialized: "Capital hundred offices\' salary fields\' grain measure — please follow Huichang 3 precedent, allow people forever to deliver to the capital themselves; nearby prefectures may not conceal."',
    idiomatic: 'Jingzhao asked salary-field grain delivered freely to the capital per Huichang 3.',
  },
  s0724: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0725: {
    literal: 'Jiangxi observation commissioner Zhou Chi was made Yicheng military commissioner and Zheng-Hua observation commissioner.',
    idiomatic: 'Zhou Chi took Yicheng and Zheng-Hua.',
  },
  s0726: {
    literal: 'Twelfth month: Minister of Punishments, acting Revenue overseer Cui Yuanshi memorialized: "Per the seventh month second-day edict, inferior silk bolts are all forbidden like copper — may not be woven.',
    idiomatic: 'Cui Yuanshi moved to ban inferior silk weaving.',
  },
  s0727: {
    literal: 'I wish to join Salt, Revenue, and Personnel in one memorial, first survey the left treasury, list inferior-bolt circuits, then order search and destroy narrow looms.',
    idiomatic: 'He proposed joint surveys and destruction of narrow looms.',
  },
  s0728: {
    literal: 'Already delivered inferior bolts — report the count."',
    idiomatic: 'Delivered inferior bolts were to be reported."',
  },
  s0729: {
    literal: 'The Emperor assented.',
    idiomatic: 'Xuanzong assented.',
  },
  s0730: {
    literal: 'Dazhong 1, first month, wuxu new moon: the palace parks commissioner memorialized: "When the Emperor fasts for the suburban rite, inner palace garden gates total ninety-four — all to be locked; keys forwarded inside.',
    idiomatic: 'On wuxu of Dazhong 1 palace gates were locked for the suburban fast.',
  },
  s0731: {
    literal: 'When the carriage returns, please receive them."',
    idiomatic: 'Keys would return when the emperor came back from the rite.',
  },
  s0732: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0733: {
    literal: 'On wushen the Emperor performed suburban rites; when ritual ended he took Vermilion Phoenix Gate and proclaimed great amnesty, changed the reign title; the edict said:',
    idiomatic: 'On wushen Dazhong began with suburban rites and amnesty at Vermilion Phoenix Gate.',
  },
  s0734: {
    literal: '"In antiquity palace officials went out to govern prefectures, chief ministers administered commanderies — thus to weight kinship\'s office and hurry the root of government.',
    idiomatic: '"Ancient officers governed in the provinces," the edict began.',
  },
  s0735: {
    literal: 'Since shallow custom long blew, this path slightly vanished; wrangling the clear path, one reached eminent rank.',
    idiomatic: '"Courtiers now reach rank without governing."',
  },
  s0736: {
    literal: 'The art of governing people was never mastered — wishing to exhaust the people\'s hardship and communicate empire-wide benefit and harm is impossible.',
    idiomatic: '"They never learn the people\'s hardship."',
  },
  s0737: {
    literal: 'At government\'s start, think to thicken Confucian wind; terrace nearness ministers should be prepared advisers — if they do not know people\'s toil, how bear Our search?',
    idiomatic: '"Near ministers must know popular toil."',
  },
  s0738: {
    literal: 'Hereafter remonstrance grandees, supervising secretaries, and Secretariat drafters who once were prefects or county magistrates, or while in office had corruption stains — chief ministers may not nominate them.',
    idiomatic: 'Corrupt former prefects were barred from high nomination.',
  },
  s0739: {
    literal: 'Magistrates\' kin — office should comfort and inscribe; three years\' examination performance is in the maxim.',
    idiomatic: '"Magistrates must serve full terms," the edict continued.',
  },
  s0740: {
    literal: 'In Zhenyuan the bright edict was repeatedly sent: a magistrate must pass five examinations before transfer.',
    idiomatic: 'Zhenyuan had required five reviews before transfer.',
  },
  s0741: {
    literal: 'Recently through inertia none obeyed; some circuits got three reviews, capital counties rarely reached two years — with such men governing, how make successful policy?',
    idiomatic: '"Prefects now move too soon to govern well."',
  },
  s0742: {
    literal: 'Road clerks and circuit officials have escort toil; village people have no rest hope.',
    idiomatic: '"People get no rest from revolving magistrates."',
  },
  s0743: {
    literal: 'From now must complete thirty-six months — forever the constant rule.',
    idiomatic: '"Thirty-six months shall be the fixed term."',
  },
  s0744: {
    literal: 'Closing quote of edict."',
    idiomatic: 'Thus ended the amnesty edict."',
  },
  s0745: {
    literal: 'Second month, dingmao, edict: "Xianzong\'s seventeenth son Ti enfeoffed Prince of Peng; eighteenth son Zhui Prince of Di;',
    idiomatic: 'On dingmao Xianzong\'s sons Ti and Zhui were enfeoffed.',
  },
  s0746: {
    literal: 'fifth son Ze Prince of Pu; sixth son Run Prince of E.',
    idiomatic: 'Ze and Run became princes of Pu and E.',
  },
  s0747: {
    literal: 'Closing quote." Edict to repair Baifu Hall.',
    idiomatic: 'Baifu Hall was ordered repaired.',
  },
  s0748: {
    literal: 'Acting Grand Preceptor, eastern capital regent Li Deyu was made Heir-apparent Junior Protector, eastern capital branch office;',
    idiomatic: 'Li Deyu was sidelined to junior protector at Luoyang.',
  },
  s0749: {
    literal: 'Supervising Secretary Zheng Ya was made Guizhou prefect, Censor-in-Chief, Guiguan defense and observation commissioner.',
    idiomatic: 'Zheng Ya was sent to Guiguan.',
  },
  s0750: {
    literal: 'Second month, dingyou: Vice Minister of Rites Wei Fu memorialized: "This year\'s thirty-three passed jinshi include Feng Yanqing, Cui Zhuo, and Zheng Yanxiu — all have literary craft and are praised in the time, yet because fathers and brothers hold heavy posts they were not allowed to pass."',
    idiomatic: 'Wei Fu withheld three gifted candidates whose kin held high office.',
  },
  s0751: {
    literal: 'Edict ordered Hanlin academician-in-chief, Vice Minister of Revenue Wei Cong to re-examine; edict: "Yanqing and others\' trial texts all meet standard — may pass and rank.',
    idiomatic: 'Wei Cong\'s re-exam restored Feng Yanqing and the other two.',
  },
  s0752: {
    literal: 'Responsible examination rests in utmost fairness; if patronage is involved, there is the court code.',
    idiomatic: '"Patronage has its own penalties," the edict said.',
  },
  s0753: {
    literal: 'Hereafter release lists by usual rule — no separate memorial."',
    idiomatic: '"Release lists by usual rule without special pleas."',
  },
  s0754: {
    literal: 'The Emperor elegantly loved Confucian scholars and attended to the examinations.',
    idiomatic: 'Xuanzong favored scholars and watched the examinations closely.',
  },
  s0755: {
    literal: 'Sometimes he secretly walked among the people, gathering popular debate to observe selection\'s gains and losses.',
    idiomatic: 'He sometimes walked incognito to hear opinion on the exams.',
  },
  s0756: {
    literal: 'Whenever mountain-pool curved feasts, academician poems responded in turn; when dukes and ministers went out to command, he also composed poems to bid farewell.',
    idiomatic: 'He joined poets at feast and sent off ministers with verse.',
  },
  s0757: {
    literal: 'Facing ministers he was solemn in bow; rarely light words.',
    idiomatic: 'He faced ministers with solemn bows and few light words.',
  },
  s0758: {
    literal: 'When great ministers presented memorials he burned incense and washed hands before reading.',
    idiomatic: 'He read memorials with incense and washed hands.',
  },
  s0759: {
    literal: 'At the time Dazhong\'s government was said to have Zhenguan\'s wind.',
    idiomatic: 'Contemporaries likened Dazhong government to Zhenguan.',
  },
  s0760: {
    literal: 'Again edict: "From now when jinshi lists are posted, Apricot Garden may feast as of old; responsible offices may not forbid."',
    idiomatic: 'Apricot Garden feasts after the list were restored.',
  },
  s0761: {
    literal: 'Closing quote." Wuzong loved tours — hence Qujiang Pavilion had forbidden people\'s feasts.',
    idiomatic: 'The ban had begun under tour-loving Wuzong.',
  },
  s0762: {
    literal: 'Intercalary third month, edict: "In Huichang\'s last years temples were merged and cut.',
    idiomatic: 'An intercalary-third-month edict began restoring temples.',
  },
  s0763: {
    literal: 'Though called alien teaching, it did not harm governance\'s source;',
    idiomatic: '"Alien teaching did not harm the state\'s root,"',
  },
  s0764: {
    literal: 'Huaxia people long practiced its path — the reform was excessive, the matter not yet broad.',
    idiomatic: '"but the cut was excessive and the policy too narrow."',
  },
  s0765: {
    literal: 'Spirit mountains and famous sites, empire-wide prefectures — Huichang 5 fourth-month abolished temples with old-name monks who can again repair — let them reside, offices may not forbid.',
    idiomatic: 'Famed temples with restoring monks were reopened.',
  },
  s0766: {
    literal: 'Closing quote of edict."',
    idiomatic: 'Thus ended the temple edict."',
  },
  s0767: {
    literal: 'Fourth month: Accumulated Celebration Empress Dowager Xiao died; posthumous title Zhenxian — Wenzong\'s mother.',
    idiomatic: 'Wenzong\'s mother, Empress Dowager Xiao, died as Zhenxian.',
  },
  s0768: {
    literal: 'Sixth month: Yicheng military commissioner Zhou Chi was made Vice Minister of War, acting Revenue overseer.',
    idiomatic: 'Zhou Chi took Revenue in the sixth month.',
  },
  s0769: {
    literal: 'Enfeoffed the Qarluq prince as Yingwu Chenming Qaghan; ordered Court of Imperial Entertainments Minister Li Ye into the steppe to invest him.',
    idiomatic: 'A Qarluq prince was invested qaghan by Li Ye.',
  },
  s0770: {
    literal: 'Gold-Purple Grandee, Heir-apparent Junior Protector retired eastern capital branch, Pillar of State, Duke of Qizhang with two thousand households Niu Sengru was made Heir-apparent Grand Preceptor; Silver-Green Grandee, acting Heir-apparent Guest of Honor, Pillar of State, Duke of Longxi with two thousand households Li Yanyou was made Heir-apparent Grand Protector.',
    idiomatic: 'Niu Sengru and Li Yanyou were honored at Luoyang as grand preceptor and protector.',
  },
  s0771: {
    literal: 'Both as before in branch office.',
    idiomatic: 'Both remained in eastern-branch posts.',
  },
  s0772: {
    literal: 'Left Remonstrance Grandee Yu Jianxiu was made Guo prefect; Regular Grandee, acting Ministry of Personnel merit director, edict drafter, Pillar of State Cui Yun was made Secretariat drafter; Palace Cadet, former Huzhou prefect, Baron of Pengyang with three hundred households Linghu Tao was made acting Personnel merit director and edict drafter.',
    idiomatic: 'Yu Jianxiu, Cui Yun, and Linghu Tao received capital posts.',
  },
  s0773: {
    literal: 'Autumn seventh month: Regular Grandee, Vice Minister of Revenue, edict drafter, Hanlin academician-in-chief, Pillar of State, granted purple-gold fish Wei Cong was made Grand Councillor in his present posts.',
    idiomatic: 'Wei Cong joined the council in the seventh month.',
  },
  s0774: {
    literal: 'Heir-apparent Junior Protector retired eastern capital branch Duke of Weiguo Li Deyu was sued by others, demoted to Chaozhou acting staff member same-rank regular.',
    idiomatic: 'Li Deyu was banished to Chaozhou after lawsuits.',
  },
  s0775: {
    literal: 'Eighth month: Minister of Works, Secretariat Vice Director, Grand Councillor Lu Shang went out as E-Yue observation commissioner.',
    idiomatic: 'Lu Shang left the council for E-Yue in the eighth month.',
  },
  s0776: {
    literal: 'The Divine Strategy army reported repair of Baifu Hall complete — named the hall Yonghe, tower Qinqin, seven hundred corridor rooms in all, to assemble princes\' sons and grandsons.',
    idiomatic: 'The Divine Strategy army finished Yonghe Hall for princely kin.',
  },
  s0777: {
    literal: 'Ninth month: former Yongning county sheriff Wu Runa came to the gate claiming injustice, saying: "My younger brother Xiang was Yangzhou Jiangdu county sheriff; military commissioner Li Shen falsely memorialized Xiang\'s corruption; chief minister Li Deyu bent favor to Shen and judged my brother Xiang to death."',
    idiomatic: 'Wu Runa accused Li Shen and Li Deyu of murdering his brother Wu Xiang.',
  },
  s0778: {
    literal: 'Closing quote." Edict sent down to the Censorate to investigate.',
    idiomatic: 'Thus ended his plea. The Censorate was ordered to investigate.',
  },
  s0779: {
    literal: 'Dazhong 2, first month, renxu: chief ministers led civil and military hundred officials offering honorific Sagely Reverent Literary Reflective Harmonious Martial Bright Filial Emperor; received the seal at Xuanzheng Hall, proclaimed virtuous sound.',
    idiomatic: 'On renxu of Dazhong 2 the court offered a new honorific at Xuanzheng Hall.',
  },
  s0780: {
    literal: 'The Divine Strategy army repaired the left Silver Terrace gate tower, rooms, and southern wall to Ruiwu Tower.',
    idiomatic: 'The Divine Strategy army repaired the Silver Terrace gate to Ruiwu Tower.',
  },
  s0781: {
    literal: 'Second month, edict: Jiannan West military commissioner, Glory Grandee, acting Minister of Personnel, Grand Councillor, Chengdu metropolitan governor, Pillar of State, Duke of Longxi with two thousand households Li Hui was demoted to Hunan observation commissioner; Guizhou prefect, Censor-in-Chief, Guiguan commissioner Zheng Ya demoted to Xun prefect; former Huainan observation judge Wei Chang demoted to Ji prefect staff; Lu Hun county magistrate Yuan Shou demoted to Shao prefect staff; Palace Censor Cai Jing demoted to Li acting staff member.',
    idiomatic: 'Li Hui, Zheng Ya, and allies in the Wu Xiang case were demoted in the second month.',
  },
  s0782: {
    literal: 'The Censorate memorialized:',
    idiomatic: 'The Censorate reported on the Wu Xiang case:',
  },
  s0783: {
    literal: 'According to the three offices\' investigation of Wu Xiang\'s case, we respectfully list each man\'s crimes: Yangzhou chief commandant Lu Xingli and Liu Qun on the fourteenth of the first month drank at A Yan\'s house with A Jiao; Qun himself wished to take A Yan as wife, falsely claiming the army supervisor\'s order that A Yan be presented and not marry, also arbitrarily set guards.',
    idiomatic: 'The Censorate detailed Lu Xingli and Liu Qun\'s seizure of a courtesan.',
  },
  s0784: {
    literal: 'A Jiao then secretly agreed with Jiangdu sheriff Wu Xiang to marry A Yan to Xiang.',
    idiomatic: 'A Jiao arranged her marriage to Wu Xiang.',
  },
  s0785: {
    literal: 'Liu Qun and escort military officer Li Kexion immediately blocked it; then ordered Jiangdu commoners to accuse Xiang of bribes; military commissioner Li Shen pursued Xiang to prison, calculated corruption, executed.',
    idiomatic: 'Liu Qun blocked the marriage and Li Shen executed Xiang for bribery.',
  },
  s0786: {
    literal: 'Full case memorialized.',
    idiomatic: 'The full case had been reported.',
  },
  s0787: {
    literal: 'The court doubted injustice and sent Censor Cui Yuanyao to Yangzhou to inquire; according to Xiang though there was taking, crime did not reach death.',
    idiomatic: 'Cui Yuanyao found the crime did not warrant death.',
  },
  s0788: {
    literal: 'Li Deyu clique-attached to Li Shen, then demoted Yuanyao to Lingnan, took Huainan original judge Wei Chang\'s documents, judged Xiang to death.',
    idiomatic: 'Deyu exiled Yuanyao and used Wei Chang\'s papers to kill Xiang.',
  },
  s0789: {
    literal: 'Now according to the three commissioners\' pursuit of Cui Yuanyao and Huainan original judges Wei Chang and connected persons\' confessions — Huainan chief commandant Liu Qun, original judge Wei Chang, clerk Sun Zhen lending at high interest relying on Huang Song, Jiangdu clerks Shen Yan and Chen Zai, military escort Fu Yi, left commandant Lu Xingli, Tianchang magistrate Zhang Hongsi, Qu Zhangzhu and Chen Hui, right wing patrol Li Xingfan, clerk Jin Hongju, men who delivered Wu Xiang\'s wife and daughter to Li prefecture for bribes Pan Zai, former Yang prefecture recorder Li Gongzuo, original judges Yuan Shou, Wu Gong, Weng Gong, retired eastern-branch Junior Protector Li Deyu, Jiannan West commissioner Li Hui, Guiguan commissioner Zheng Ya, and others — await imperial order.',
    idiomatic: 'A long list of officials in the Xiang case awaited judgment.',
  },
  s0790: {
    literal: 'That month, edict:',
    idiomatic: 'That month the throne ruled:',
  },
  s0791: {
    literal: 'Third month, jiyou: Vice Minister of War, acting Revenue overseer Zhou Chi was made Grand Councillor in original posts.',
    idiomatic: 'On jiyou Zhou Chi joined the council.',
  },
  s0792: {
    literal: 'Minister of Rites, salt-and-transport commissioner Ma Zhi was made Grand Councillor in original posts.',
    idiomatic: 'Ma Zhi also joined the council.',
  },
  s0793: {
    literal: 'The Japanese prince entered court presenting local products.',
    idiomatic: 'A Japanese prince presented tribute.',
  },
  s0794: {
    literal: 'The prince was skilled at chess; the Emperor ordered Attendant-Assembled Gu Shiyan to play him.',
    idiomatic: 'Gu Shiyan was ordered to play the prince at chess.',
  },
  s0795: {
    literal: 'Fifth month, jiwei: there was a solar eclipse.',
    idiomatic: 'On jiwei of the fifth month the sun was eclipsed.',
  },
  s0796: {
    literal: 'Sixth month, jichou: Grand Empress Dowager Guo died; posthumous title Yi\'an — Xianzong\'s consort, Muzong\'s mother.',
    idiomatic: 'On jichou Grand Empress Dowager Guo died as Yi\'an.',
  },
  s0797: {
    literal: 'Vice Minister of Revenue, concurrent Censor-in-Chief, acting Revenue overseer Cui Guicong memorialized: "All circuit field-office officials — after returning office capital, if there is concealment and arrears, collection must be full, may not seek release through favor —',
    idiomatic: 'Cui Guicong tightened collection of field-office arrears.',
  },
  s0798: {
    literal: 'hereafter any concealed theft and arrears — please handle like official corruption precedent.',
    idiomatic: '"Hidden arrears shall be punished like corruption," he said.',
  },
  s0799: {
    literal: 'Even if favor amnesty comes, not within exemption limit.',
    idiomatic: '"Even amnesties shall not wipe such debts."',
  },
  s0800: {
    literal: 'Closing quote." Assented.',
    idiomatic: 'Thus ended the memorial. The throne assented.',
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
