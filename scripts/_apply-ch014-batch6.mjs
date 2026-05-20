#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
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
    literal: "Qun had first been promoted by Li Jifu; once holding the censorate he turned against Jifu — Jifu exposed his secret matters, hence the demotion.",
    idiomatic: "Dou Qun had been Jifu's protégé until he turned censor against him and was exiled.",
  },
  s0502: {
    literal: "On dingmao the revenue commissioner fixed subordinate case officers at four posts.",
    idiomatic: "On dingmao revenue subordinate posts were fixed at four.",
  },
  s0503: {
    literal: "Eleventh month, jiawu: Heng-Hai commissioner Cheng Zhigong came to court.",
    idiomatic: "Eleventh month, jiawu: Cheng Zhigong of Heng-Hai came to court.",
  },
  s0504: {
    literal: "Twelfth month, gengxu: Linyuan county was made acting Yuan prefecture; garrison commander Hao Yu was named prefect.",
    idiomatic: "Twelfth month, gengxu: Linyuan became acting Yuanzhou with Hao Yu as prefect.",
  },
  s0505: {
    literal: "From the time Yu garrisoned Linyuan, the Western Rong did not dare violate the passes.",
    idiomatic: "Under Hao Yu the western barbarians did not raid the passes.",
  },
  s0506: {
    literal: "On jiazi Nanzhao's Yimouxun died.",
    idiomatic: "On jiazi the Nanzhao king Yimouxun died.",
  },
  s0507: {
    literal: "On xinwei Remonstrating Censor Duan Pingzhong was sent to Nanzhao to mourn and sacrifice, and still to install his son Piaoxin Jumengge as Nanzhao king.",
    idiomatic: "On xinwei Duan Pingzhong mourned in Nanzhao and enthroned Yimouxun's son.",
  },
  s0508: {
    literal: "That year Huainan, Jiangnan, Jiangxi, Hunan, and Shannan East circuits suffered drought.",
    idiomatic: "That year drought struck the southeast circuits.",
  },
  s0509: {
    literal: "Summer, fourth month, bingzi new moon.",
    idiomatic: "In summer the fourth month opened on bingzi.",
  },
  s0510: {
    literal: "On wuyin Directorate of Education Director Feng Kang died.",
    idiomatic: "On wuyin Feng Kang died.",
  },
  s0511: {
    literal: "On renwu Pei Jun presented one thousand five hundred liang of silver vessels — for violating an edict they were sent to the Left Treasury.",
    idiomatic: "On renwu Pei Jun's silver gift was confiscated for breaching an edict.",
  },
  s0512: {
    literal: "On jiashen the heir apparent was ordered to reside in the Shaoyang quarter.",
    idiomatic: "On jiashen the crown prince moved to Shaoyang quarter.",
  },
  s0513: {
    literal: "Zhang Yingnu of Wugong composed \"Wave-Return Lyrics\" to delude the masses and was beaten to death.",
    idiomatic: "Zhang Yingnu of Wugong was executed for seductive \"Wave-Return\" songs.",
  },
  s0514: {
    literal: "On bingshen Fuzhou mountain man Zhang Hong rode an ox wearing cap and shoes and presented a book at Guangshun Gate — the book was unworthy of acceptance and he was dismissed.",
    idiomatic: "On bingshen a Fuzhou eccentric presented a worthless book at Guangshun Gate and was sent away.",
  },
  s0515: {
    literal: "On gengzi an edict: the late Grand Preceptor, Prince of Xiping Li Sheng should be entered in the attached clan register.",
    idiomatic: "On gengzi Li Sheng was ordered entered in the imperial clan register.",
  },
  s0516: {
    literal: "Acting Court of Imperial Sacrifices Director Li Yuansu was made Revenue Minister and acting revenue commissioner; Shang prefect Yuan Yifang was made Fujian observer.",
    idiomatic: "Li Yuansu took revenue; Yuan Yifang took Fujian.",
  },
  s0517: {
    literal: "On jiachen War Vice Minister Quan Deyu was made Court of Imperial Sacrifices Director, still granted gold-purple.",
    idiomatic: "On jiachen Quan Deyu became Court of Sacrifices director with gold-purple.",
  },
  s0518: {
    literal: "Censor-in-Chief Gao Ying was made War Minister; Penal Department bureau director and attendant censor knowing miscellaneous Li Yijian was made Vice Censor-in-Chief.",
    idiomatic: "Gao Ying became War Minister; Li Yijian became Vice Censor-in-Chief.",
  },
  s0519: {
    literal: "Fifth month, bingwu new moon.",
    idiomatic: "The fifth month opened on bingwu.",
  },
  s0520: {
    literal: "On xinyou Penal Minister Zheng Yuan died.",
    idiomatic: "On xinyou Zheng Yuan died.",
  },
  s0521: {
    literal: "On dingmao Salt and Iron commissioner and War Minister Li Xun died.",
    idiomatic: "On dingmao Li Xun died.",
  },
  s0522: {
    literal: "Sixth month, yihai new moon.",
    idiomatic: "The sixth month opened on yihai.",
  },
  s0523: {
    literal: "On dingchou Hedong commissioner Li Yong was made Penal Minister and overall salt-iron transport commissioner;",
    idiomatic: "On dingchou Li Yong took salt-iron transport;",
  },
  s0524: {
    literal: "Ling-Salt commissioner Fan Xichao was made Taiyuan Intendant, Northern Capital regent, and Hedong commissioner;",
    idiomatic: "Fan Xichao went to Hedong;",
  },
  s0525: {
    literal: "Right Guard senior general Wang Yi was made Ling metropolitan senior administrator and Ling-Salt commissioner.",
    idiomatic: "Wang Yi took Ling-Salt.",
  },
  s0526: {
    literal: "On xinchou north of the Five Ranges silver mines were opened to private mining; coin was forbidden south of the ranges.",
    idiomatic: "On xinchou private mining was allowed north of the Five Ranges; coin could not cross south.",
  },
  s0527: {
    literal: "Autumn, seventh month, yisi new moon: the Emperor composed in his own hand fourteen chapters of \"Former Ages' Monarch and Minister Deeds,\" written on six folding screens.",
    idiomatic: "Seventh month, yisi new moon: the Emperor wrote fourteen moral chapters on six screens.",
  },
  s0528: {
    literal: "That month the book screens were shown to the chancellors; Li Fan and others memorialized thanks.",
    idiomatic: "That month the chancellors were shown the screens and thanked him.",
  },
  s0529: {
    literal: "On dingwei Weinan sudden flood destroyed more than two hundred dwellings and drowned six hundred people — the prefectural office was ordered to relieve and supply.",
    idiomatic: "On dingwei a Weinan flash flood killed six hundred; relief was ordered.",
  },
  s0530: {
    literal: "On yimao Right Feathered Forest commander-in-chief Gao Gu died.",
    idiomatic: "On yimao Gao Gu died.",
  },
  s0531: {
    literal: "On renxu Vice Censor-in-Chief Li Yijian impeached Capital Intendant Yang Ping for embezzlement when Jiangxi observer — Ping was demoted to Linhe district captain.",
    idiomatic: "On renxu Li Yijian toppled Yang Ping for Jiangxi graft.",
  },
  s0532: {
    literal: "On wuchen Right Secretariat Vice Director Xu Mengong was made Capital Intendant and granted gold-purple.",
    idiomatic: "On wuchen Xu Mengong became Capital Intendant with gold-purple.",
  },
  s0533: {
    literal: "Eighth month, jiaxu new moon.",
    idiomatic: "The eighth month opened on jiaxu.",
  },
  s0534: {
    literal: "On guiwei Yanzhou's Yutai county seat was moved to Huangtai market.",
    idiomatic: "On guiwei Yutai county was moved to Huangtai market.",
  },
  s0535: {
    literal: "On bingshen Annan protector Zhang Zhou memorialized breaking the Huan kingdom, more than thirty thousand men, capturing war elephants, weapons, and fifty-nine princes.",
    idiomatic: "On bingshen Zhang Zhou reported crushing Huan with thirty thousand captives.",
  },
  s0536: {
    literal: "On guimao posthumous Grand Preceptor Pei Mian should share sacrifice in Emperor Daizong's temple; posthumous Grand Preceptor Li Sheng and posthumous Grand Preceptor Duan Xiushi should share sacrifice in Emperor Dezong's temple.",
    idiomatic: "On guimao Pei Mian, Li Sheng, and Duan Xiushi were ordered into imperial temples.",
  },
  s0537: {
    literal: "Ninth month, jiachen new moon.",
    idiomatic: "The ninth month opened on jiachen.",
  },
  s0538: {
    literal: "On gengxu Chengde army overall military commander and Zhen prefecture Right Senior Administrator Wang Chengzong was recalled to acting Works Minister and made Chengde commissioner;",
    idiomatic: "On gengxu Wang Chengzong was recalled to Chengde command;",
  },
  s0539: {
    literal: "Dezhou prefect Xue Changchao was made acting Left Regular Attendant, Baoxin army commissioner, and De-Qi observer.",
    idiomatic: "Xue Changchao was made Baoxin commissioner over De and Qi.",
  },
  s0540: {
    literal: "Changchao was Xue Song's son, married into the Wang clan, and at the time was Dezhou prefect.",
    idiomatic: "Changchao was Xue Song's son-in-law of Wang and held Dezhou.",
  },
  s0541: {
    literal: "The court, because Chengzong was hard to control, carved out two prefectures as a command and gave it to Changchao.",
    idiomatic: "The court split De and Qi from Chengde for Changchao to tame Chengzong.",
  },
  s0542: {
    literal: "The edict had barely been issued when Chengzong with troops seized Changchao and returned him to Zhen prefecture.",
    idiomatic: "The edict had barely left when Chengzong seized Changchao back to Zhenzhou.",
  },
  s0543: {
    literal: "On dingmao Bin-Ning commissioner, acting Minister of Works, Grand Councilor Gao Chongwen died.",
    idiomatic: "On dingmao Gao Chongwen of Bin-Ning died.",
  },
  s0544: {
    literal: "Winter, tenth month, guiyou new moon: Right Feathered Forest commander Yan Juyuan was made Bin prefect and Bin-Ning-Qing commissioner; Junior Palace Director Cui Ying was made Tong prefect, that prefecture's defense commissioner, and Changchun Palace commissioner; guiwei, edict: \"Chengde commissioner Wang Chengzong, while in mourning garb, secretly watched the military post.",
    idiomatic: "Tenth month, guiyou: Yan Juyuan took Bin-Ning; on guiwei an edict denounced Wang Chengzong's mourning treachery.",
  },
  s0545: {
    literal: "Yet inwardly and outwardly the ritual of serving the ruler holds that rebellion must be punished;",
    idiomatic: "Court ritual demanded punishment for rebellion;",
  },
  s0546: {
    literal: "the ritual of dividing territory holds that usurpation brings execution.",
    idiomatic: "usurpation of fiefs likewise meant execution.",
  },
  s0547: {
    literal: "The Emperor recalled his ancestors' once flourishing merit, granted private favor, yet checked public opinion.",
    idiomatic: "The throne weighed ancestral merit against public law.",
  },
  s0548: {
    literal: "Envoys came one after another to instruct; the wicked youth bowed to declare sincerity, wishing to yield two prefectures and promise no second affair.",
    idiomatic: "Envoys had urged him; he had bowed and promised two prefectures.",
  },
  s0549: {
    literal: "The Emperor also accepted his later effect, using it to bend and preserve him, granting command within the old borders and ranking him among the meritorious.",
    idiomatic: "The Emperor had hoped to preserve him with an old-border commission.",
  },
  s0550: {
    literal: "Moreover De and Qi were never Chengde's to administer; Changchao was moreover Chengzong's close kin — to soothe a near neighbor was truly thick grace; outwardly two commands, inwardly one house.",
    idiomatic: "De and Qi were not Chengde's; giving kin Changchao nearby seemed generous — yet one house ruled both.",
  },
  s0551: {
    literal: "Yet Chengzong feigned respect while cherishing treachery, his face and conduct long steeped in evil — he deceived Pei Wu after gaining the post and imprisoned Changchao in the midst of the appointment.",
    idiomatic: "He feigned respect, tricked Pei Wu, and seized Changchao mid-appointment.",
  },
  s0552: {
    literal: "Moreover his memorial language was insolent beyond measure — what righteous men sigh at, what Heaven and Earth cannot contain.",
    idiomatic: "His memorials grew insolent beyond what heaven could bear.",
  },
  s0553: {
    literal: "Reverently executing Heaven's punishment displays the court's law; Chengzong's personal offices and titles are all to be stripped.",
    idiomatic: "Heaven's punishment was proclaimed; all Chengzong's ranks were stripped.",
  },
  s0554: {
    literal: "Shence Left Army Commandant Tutu Chengcui was made Zhenzhou campaign commander and disposition commissioner; Dragon Martial general Zhao Wandi was made Shence vanguard general; inner attendants Song Weicheng, Cao Jinyu, Ma Chaojiang, and others were made campaign hostel grain commissioners.",
    idiomatic: "Eunuch Tutu Chengcui led the Zhen campaign with Zhao Wandi as vanguard.",
  },
  s0555: {
    literal: "Capital Intendant Xu Mengong with remonstrating officials argued face to face that great punitive expeditions must not use inner attendants as commanders; Remonstrance Aide Du Gu's words were especially cutting.",
    idiomatic: "Xu Mengong and remonstrators protested eunuch generals on a great campaign.",
  },
  s0556: {
    literal: "The edict only changed disposition to consolation, yet still kept the campaign name.",
    idiomatic: "The title was softened to \"consolation\" but \"campaign\" remained.",
  },
  s0557: {
    literal: "On jichou an edict: as the army advances, Wang Wujun's and Wang Shizhen's tombs — soldiers may not gather firewood; Shi Ping and Shi Ze each keep their original offices, and Shi Ze is still to inherit Wujun's enfeoffment.",
    idiomatic: "On jichou the army was forbidden to desecrate Wang clan tombs; loyal Wang kin were spared.",
  },
  s0558: {
    literal: "On gengyin Prince of Deng Ning was enfeoffed crown prince.",
    idiomatic: "On gengyin Prince Deng Ning became crown prince.",
  },
  s0559: {
    literal: "On guisi because of the investiture, a general amnesty for bound prisoners — capital crimes reduced to exile, exile and below each reduced one grade.",
    idiomatic: "On guisi investiture brought amnesty lowering capital crimes to exile.",
  },
  s0560: {
    literal: "Civil and military regular attendees and outer prefecture and circuit chiefs' sons succeeding fathers were granted two merit turns.",
    idiomatic: "Regular attendees and heirs of frontier chiefs gained two merit turns.",
  },
  s0561: {
    literal: "Works Vice Minister Gui Deng and Drafting Editor Lü Yuanying were made crown prince and princes' lecturers.",
    idiomatic: "Gui Deng and Lü Yuanying became lecturers to the heir and princes.",
  },
  s0562: {
    literal: "On jihai Tutu Chengcui's army departed the capital; the Emperor came to Tonghua Gate to console and send them off.",
    idiomatic: "On jihai the Emperor saw Chengcui's army off at Tonghua Gate.",
  },
  s0563: {
    literal: "Eleventh month, guimao new moon: Zhexi Su, Run, and Chang prefectures suffered drought and dearth — two ten thousand shi of relief grain.",
    idiomatic: "Eleventh month: Su, Run, and Chang received twenty thousand shi of famine grain.",
  },
  s0564: {
    literal: "On jiazi Henan Intendant Du Jian died.",
    idiomatic: "On jiazi Du Jian died.",
  },
  s0565: {
    literal: "On jisi Zhangyi commissioner, acting Minister of Works, Grand Councilor Wu Shaocheng died.",
    idiomatic: "On jisi Wu Shaocheng of Zhangyi died.",
  },
  s0566: {
    literal: "Twelfth month, renshen new moon: Revenue Vice Minister Zhang Hongjing was made Shaanfu senior administrator, Shaan-Guo observer and land-and-water transport commissioner, granted gold-purple.",
    idiomatic: "Twelfth month: Zhang Hongjing took Shaan-Guo transport.",
  },
  s0567: {
    literal: "Shaan-Guo observer Fang Shi was made Henan Intendant.",
    idiomatic: "Fang Shi became Henan Intendant.",
  },
  s0568: {
    literal: "Vice Censor-in-Chief Li Yijian memorialized: \"Prefectures and circuits beyond the two-tax quota levies — request salt-iron, transport, revenue, and inspection offices to investigate and report to the Censorate for impeachment.\"",
    idiomatic: "Li Yijian asked inspectors to report illegal levies beyond the two-tax quota.",
  },
  s0569: {
    literal: "Approved.",
    idiomatic: "The edict was approved.",
  },
  s0570: {
    literal: "Fifth year, spring, first month, renyin new moon; on jisi Zhexi observer Han Gao, for beating Anji magistrate Sun Xie to death with the staff, violating canonical law, was fined one month's salary.",
    idiomatic: "Year 5, first month: Han Gao was fined a month for beating a magistrate to death.",
  },
  s0571: {
    literal: "Second month, xinwei new moon.",
    idiomatic: "The second month opened on xinwei.",
  },
  s0572: {
    literal: "On wuzi the Rites Court memorialized: Eastern Palace hall and pavilion names and palace officers' personal names matching the heir's name should be changed; superior terrace official ranks and royal enfeoffments and fiefs without precedent must not be changed at will — approved.",
    idiomatic: "On wuzi taboo names in the Eastern Palace were ordered changed.",
  },
  s0573: {
    literal: "Eastern Terrace investigating censor Yuan Zhen at the Censorate detained Henan Intendant Fang Shi, on his own authority ordering cessation of duties — demoted to Jiangling prefecture army adjutant.",
    idiomatic: "Yuan Zhen detained Fang Shi and was demoted to Jiangling adjutant.",
  },
  s0574: {
    literal: "Third month, xinchou new moon: Chancellor Du You banqueted with colleagues at Fanchuan villa; the Emperor sent inner attendants with wine and viands.",
    idiomatic: "Third month: Du You's Fanchuan banquet received imperial wine from the throne.",
  },
  s0575: {
    literal: "On yisi Vice Censor-in-Chief Li Yijian was made Revenue Vice Minister and acting revenue commissioner; War Vice Minister Wang Bo was made Vice Censor-in-Chief.",
    idiomatic: "On yisi Li Yijian took revenue; Wang Bo took the censorate.",
  },
  s0576: {
    literal: "On guisi Crown Prince Guest Zheng Yin was made acting Rites Minister, Guangzhou prefect, and Lingnan commissioner.",
    idiomatic: "On guisi Zheng Yin went to Lingnan.",
  },
  s0577: {
    literal: "On jiwei an edict made Prince of Sui You Zhangyi commissioner; Shen prefect Wu Shaoyang was made Shen-Guang-Cai commissioner acting commissioner.",
    idiomatic: "On jiwei Prince You took Zhangyi; Wu Shaoyang succeeded Wu Shaocheng.",
  },
  s0578: {
    literal: "On jiazi a great wind broke trees.",
    idiomatic: "On jiazi a gale broke trees.",
  },
  s0579: {
    literal: "On dingmao Chancellor Yu Di requested following Du You's precedent of three court audiences per month — approved.",
    idiomatic: "On dingmao Yu Di won thrice-monthly audiences like Du You.",
  },
  s0580: {
    literal: "Summer, fourth month, gengwu new moon.",
    idiomatic: "In summer the fourth month opened on gengwu.",
  },
  s0581: {
    literal: "On guiyou Revenue Minister Li Yuansu died.",
    idiomatic: "On guiyou Li Yuansu died.",
  },
  s0582: {
    literal: "On jiashen Zhenzhou campaign commander Tutu Chengcui seized Zhaoyi commissioner Lu Congshi and sent Congshi to the capital under guard.",
    idiomatic: "On jiashen Chengcui seized Lu Congshi of Zhaoyi and sent him captive.",
  },
  s0583: {
    literal: "On dinghai Hedong Fan Xichao memorialized defeating bandits at Mudao Ravine.",
    idiomatic: "On dinghai Fan Xichao reported victory at Mudao Ravine.",
  },
  s0584: {
    literal: "Fuzhou restored Houguan and Changle counties; Jianzhou established Jiangle county.",
    idiomatic: "Fuzhou and Jianzhou regained or gained counties.",
  },
  s0585: {
    literal: "On renshen Zhaoyi overall military commander and Lu prefecture Left Senior Administrator Wu Chongyin was made Huai prefect and Heyang Three Cities Huai commissioner; Heyang commissioner Meng Yuanyang was made Lu senior administrator, Zhaoyi commissioner, and Ze-Lu-Ci-Xing-Mo observer.",
    idiomatic: "On renshen Wu Chongyin and Meng Yuanyang swapped Heyang and Zhaoyi.",
  },
  s0586: {
    literal: "On wuxu former Zhaoyi commissioner Lu Congshi was demoted to Huan prefecture vice marshal.",
    idiomatic: "On wuxu Lu Congshi was demoted to Huanzhou.",
  },
  s0587: {
    literal: "Fifth month, gengzi new moon.",
    idiomatic: "The fifth month opened on gengzi.",
  },
  s0588: {
    literal: "On yisi three thousand Zhaoyi troops mutinied at night and fled to Weizhou.",
    idiomatic: "On yisi three thousand Zhaoyi troops deserted to Weizhou.",
  },
  s0589: {
    literal: "Right Shence army commander Duan You died.",
    idiomatic: "Right Shence commander Duan You died.",
  },
  s0590: {
    literal: "On gengshen a Tibetan envoy, Lun Sinure, came to court with tribute and returned the coffins of Zheng Shuju and Lu Bi.",
    idiomatic: "On gengshen Tibet returned Zheng Shuju and Lu Bi's coffins with tribute.",
  },
  s0591: {
    literal: "Sixth month, gengwu new moon.",
    idiomatic: "The sixth month opened on gengwu.",
  },
  s0592: {
    literal: "On wuyin Acting Court of the Imperial Treasury Director Li Shaohe was made Hong prefect and Jiangxi observer.",
    idiomatic: "On wuyin Li Shaohe took Jiangxi.",
  },
  s0593: {
    literal: "Xi, Uighur, and Shiwei raided Zhenwu.",
    idiomatic: "Xi, Uighurs, and Shiwei raided Zhenwu.",
  },
  s0594: {
    literal: "On guisi precedent for enfeoffment food grants: commissioners who were also chancellors received one hundred enfeoffment households' food per meal, eight hundred bolts yearly; if silk, an additional six hundred liang of cotton;",
    idiomatic: "On guisi enfeoffment food rules were fixed: chancellor-commissioners received eight hundred bolts yearly per hundred households;",
  },
  s0595: {
    literal: "commissioners not also chancellors, four hundred bolts per hundred households;",
    idiomatic: "plain commissioners four hundred bolts;",
  },
  s0596: {
    literal: "army commanders and guards great generals, three hundred fifty bolts per hundred households.",
    idiomatic: "army and guard generals three hundred fifty bolts.",
  },
  s0597: {
    literal: "Autumn, seventh month, jihai new moon.",
    idiomatic: "Seventh month, jihai new moon.",
  },
  s0598: {
    literal: "On gengzi Chengzong sent judge Cui Sui to submit a self-accusation memorial, requesting to deliver regular levies and accept court appointment of officials.",
    idiomatic: "On gengzi Chengzong confessed by memorial and offered taxes and court appointments.",
  },
  s0599: {
    literal: "On dingwei an edict washed clean Wang Chengzong, restored his offices and titles, treating him as before.",
    idiomatic: "On dingwei Chengzong was pardoned and restored.",
  },
  s0600: {
    literal: "Campaign troops of all circuits together were granted goods of two hundred eighty thousand four hundred thirty bolts.",
    idiomatic: "Campaign troops received two hundred eighty thousand bolts of goods.",
  },
};const source = loadSentencesFromData();
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
