#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.011, Daizong — Dali 9–11 — Yang You, Tian Chengsi, Li Lingyao rebellion) */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
    literal:
      'On yichou, Jiangxi observation commissioner Lu Sigong was made Guangzhou prefect and Lingnan military commissioner, enfeoffed Duke of Yi.',
    idiomatic:
      'On yichou, Lu Sigong became Guangzhou prefect, Lingnan commissioner, and Duke of Yi.',
  },
  s0702: {
    literal:
      'Zhedong observation commissioner and Yuezhou prefect Chen Shaoyou was made chief administrator of Yangzhou grand protectorate and Huainan military commissioner.',
    idiomatic:
      'Chen Shaoyou of Zhedong became Yangzhou chief administrator and Huainan commissioner.',
  },
  s0703: {
    literal:
      'On wuchen, Guo Ziyi memorialized crushing one hundred thousand Tibet; the hundred officials congratulated.',
    idiomatic:
      'On wuchen, Guo Ziyi reported defeating one hundred thousand Tibetans and the court rejoiced.',
  },
  s0704: {
    literal:
      'Night of jimao, the moon entered the Feathered Forest.',
    idiomatic:
      'On the night of jimao the moon entered the Feathered Forest.',
  },
  s0705: {
    literal:
      'On guisi, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On guisi the moon entered the Supreme Palace Enclosure.',
  },
  s0706: {
    literal:
      'Eleventh month, renyin new moon.',
    idiomatic:
      'The eleventh month opened on renyin.',
  },
  s0707: {
    literal:
      'On gengxu, Bian-Song military commissioner Tian Shenggong came to court.',
    idiomatic:
      'On gengxu, Tian Shenggong of Bian-Song came to audience.',
  },
  s0708: {
    literal:
      'On xinyou, Huai-xi military commissioner Li Zhongchen came to court.',
    idiomatic:
      'On xinyou, Li Zhongchen of Huai-xi came to audience.',
  },
  s0709: {
    literal:
      'Twelfth month, guiyou, the moon entered the Feathered Forest.',
    idiomatic:
      'On guiyou of the twelfth month the moon entered the Feathered Forest.',
  },
  s0710: {
    literal:
      'That winter there was no snow.',
    idiomatic:
      'That winter brought no snow.',
  },
  s0711: {
    literal:
      'That year was a great harvest.',
    idiomatic:
      'That year the harvest was abundant.',
  },
  s0712: {
    literal:
      'Dali 9, first month, gengzi new moon.',
    idiomatic:
      'Dali 9 opened on the gengzi new moon of the first month.',
  },
  s0713: {
    literal:
      'On renyin, Bian-Song commissioner, grand tutor of the heir, acting right vice director, concurrent censor-in-chief, and Bianzhou prefect Tian Shenggong died.',
    idiomatic:
      'On renyin, Tian Shenggong of Bian-Song, grand tutor and acting right vice director, died.',
  },
  s0714: {
    literal:
      'Feng and Lang barrier commissioner and Feng prefect Yang You sailed downriver without authority as far as Ezhou.',
    idiomatic:
      'Yang You of Feng and Lang sailed down the river without orders as far as Ezhou.',
  },
  s0715: {
    literal:
      'An edict allowed him to go to Ruzhou; he went up the Han, and Fu, Ying, Xiang, and other prefectures all shut their walls against him.',
    idiomatic:
      'The court let him proceed to Ruzhou, but as he went up the Han, Fu, Ying, Xiang, and others closed their gates.',
  },
  s0716: {
    literal:
      'Second month, jichou: Tian Shenggong\'s younger brother Shenyu was made acting Bian-Song commissioner.',
    idiomatic:
      'On jichou, Shenyu was made acting Bian-Song commissioner.',
  },
  s0717: {
    literal:
      'On guisi, Guo Ziyi came from Bing; Li Baoyu came from Fengxiang.',
    idiomatic:
      'On guisi, Guo Ziyi arrived from Bing and Li Baoyu from Fengxiang.',
  },
  s0718: {
    literal:
      'Third month, bingwu: fishing and hunting within the capital bounds was forbidden from the first month through the last day of the fifth month, permanently.',
    idiomatic:
      'On bingwu, capital fishing and hunting were banned from the first through the fifth month, forever after.',
  },
  s0719: {
    literal:
      'On wuzi, Feng prefect Yang You was made Tao prefect.',
    idiomatic:
      'On wuzi, Yang You was transferred from Feng to Tao.',
  },
  s0720: {
    literal:
      'Summer, fourth month, dingchou, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On dingchou of the fourth month the moon entered the Supreme Palace.',
  },
  s0721: {
    literal:
      'On jimao, Guiguan observation commissioner Li Gan was made capital metropolitan prefect and concurrent censor-in-chief.',
    idiomatic:
      'On jimao, Li Gan became capital metropolitan prefect with the censorate.',
  },
  s0722: {
    literal:
      'On jiashen, drafting secretary Chang Gai led eighteen officials of the two departments to the gate to petition discussion; an edict allowed three to speak their minds fully.',
    idiomatic:
      'On jiashen, Chang Gai and eighteen officials petitioned at the gate; three were allowed to speak freely.',
  },
  s0723: {
    literal:
      'On yiyou, an edict ordered Guo Ziyi and others to review troops against Tibet.',
    idiomatic:
      'On yiyou the court ordered Guo Ziyi and others to muster armies against Tibet.',
  },
  s0724: {
    literal:
      'On renchen, an edict amnestied prisoners down to great treason without regard to severity—all were released.',
    idiomatic:
      'On renchen a sweeping amnesty freed even those guilty of great treason.',
  },
  s0725: {
    literal:
      'On yimi, Princess Huayang died; the emperor grieved and for days did not hold court; chief ministers remonstrated in memorials.',
    idiomatic:
      'On yimi, Princess Huayang died; the emperor mourned for days without court until ministers protested.',
  },
  s0726: {
    literal:
      'Fifth month, gengxu: Si prefecture was abolished.',
    idiomatic:
      'On gengxu of the fifth month, Si prefecture was abolished.',
  },
  s0727: {
    literal:
      'On gengshen, an edict ordered the fiscal commissioner to disburse seven hundred thousand strings and the transport commissioner five hundred thousand for government purchase of grain—the year was abundant and grain cheap.',
    idiomatic:
      'On gengshen the court spent 1.2 million strings buying grain in a year of plenty.',
  },
  s0728: {
    literal:
      'On yichou, edict:',
    idiomatic:
      'On yichou an edict declared:',
  },
  s0729: {
    literal:
      'Jingyuan military commissioner Ma Lin came to court.',
    idiomatic:
      'Ma Lin of Jingyuan came to audience.',
  },
  s0730: {
    literal:
      'On bingyin, Ma Lin was made left vice director and director of the Department of State Affairs.',
    idiomatic:
      'On bingyin, Ma Lin became left vice director and head of the Department of State Affairs.',
  },
  s0731: {
    literal:
      'Lin prompted his officers to submit petitions seeking the chancellorship—hence this appointment.',
    idiomatic:
      'His soldiers petitioned for him to become chancellor, which explains the promotion.',
  },
  s0732: {
    literal:
      'Youzhou commissioner Zhu Ci sent his younger brother Tao with a memorial asking to enter court in person and also to lead five thousand cavalry for autumn defense.',
    idiomatic:
      'Zhu Ci sent Zhu Tao to ask leave to come to court in person with five thousand horsemen for autumn defense.',
  },
  s0733: {
    literal:
      'Approved; an edict ordered offices to build a residence awaiting him.',
    idiomatic:
      'The court agreed and ordered a mansion prepared for him.',
  },
  s0734: {
    literal:
      'Sixth month, jimao: the moon occulted the Southern Dipper.',
    idiomatic:
      'On jimao of the sixth month the moon occulted the Southern Dipper.',
  },
  s0735: {
    literal:
      'On gengchen, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On gengchen the moon entered the Supreme Palace Enclosure.',
  },
  s0736: {
    literal:
      'Autumn, seventh month, jiachen: the moon occulted Fang and also entered the Feathered Forest.',
    idiomatic:
      'On jiachen the moon occulted Fang and entered the Feathered Forest.',
  },
  s0737: {
    literal:
      'Long drought; capital metropolitan prefect Li Gan prayed at many shrines without rain.',
    idiomatic:
      'After a long drought, Li Gan prayed at many shrines without result.',
  },
  s0738: {
    literal:
      'He also asked to pray at the temple of Confucius; the emperor said, "Confucius prayed long ago.',
    idiomatic:
      'He asked to pray at Confucius\' temple; the emperor said, "Confucius prayed long ago.',
  },
  s0739: {
    literal:
      '"',
    idiomatic:
      'Let him pray there himself."',
  },
  s0740: {
    literal:
      'Eighth month, xinwei: Guo prefect Song Hui was made Tong prefect and commissioner of Changchun Palace estates.',
    idiomatic:
      'On xinwei, Song Hui of Guo became Tong prefect and Changchun Palace estate commissioner.',
  },
  s0741: {
    literal:
      'On wuyin, Shaan grand protectorate chief administrator Huangfu Wen was made Yuezhou prefect and Zhedong observation commissioner.',
    idiomatic:
      'On wuyin, Huangfu Wen became Yue prefect and Zhedong commissioner.',
  },
  s0742: {
    literal:
      'On xinmao, the moon occulted the Chariot.',
    idiomatic:
      'On xinmao the moon occulted the Chariot.',
  },
  s0743: {
    literal:
      'Ninth month, gengzi: Youzhou commissioner Zhu Ci came to court.',
    idiomatic:
      'On gengzi, Zhu Ci of Youzhou came to audience.',
  },
  s0744: {
    literal:
      'On yisi, Weibei commissioner and Fang prefect Zang Xirang died.',
    idiomatic:
      'On yisi, Zang Xirang of Weibei and Fang died.',
  },
  s0745: {
    literal:
      'That autumn there was heavy rain.',
    idiomatic:
      'That autumn brought heavy rains.',
  },
  s0746: {
    literal:
      'Winter, tenth month, renshen: Prince of Faith Wang Huang died.',
    idiomatic:
      'On renshen, Prince of Faith Wang Huang died.',
  },
  s0747: {
    literal:
      'On yihai, Prince of Liang Wang Xuan died.',
    idiomatic:
      'On yihai, Prince of Liang Wang Xuan, Prince of Liang, died.',
  },
  s0748: {
    literal:
      'Former Xu prefect Ji Guangchen was made right regular cavalry attendant.',
    idiomatic:
      'Ji Guangchen, former Xu prefect, became right regular cavalry attendant.',
  },
  s0749: {
    literal:
      'Eleventh month, wuxu: heavy snow.',
    idiomatic:
      'On wuxu of the eleventh month heavy snow fell.',
  },
  s0750: {
    literal:
      'On level ground a full foot.',
    idiomatic:
      'A foot piled on level ground.',
  },
  s0751: {
    literal:
      'On gengzi, Shangzhou prefect Li Guoqing was made Shaan grand protectorate chief administrator and Shaan observation commissioner.',
    idiomatic:
      'On gengzi, Li Guoqing became Shaan chief administrator and observation commissioner.',
  },
  s0752: {
    literal:
      'Twelfth month, gengyin: drafting secretaries Yang Yan and Wei Zhao were made vice ministers of personnel; Chang Gai was made vice minister of rites.',
    idiomatic:
      'On gengyin, Yang Yan and Wei Zhao became vice ministers of personnel and Chang Gai vice minister of rites.',
  },
  s0753: {
    literal:
      'On renchen, capital prisoners were amnestied: death reduced to exile, exile and below released.',
    idiomatic:
      'On renchen the capital amnesty cut death to exile and freed lesser sentences.',
  },
  s0754: {
    literal:
      'Dali 10, spring, first month, yimi new moon.',
    idiomatic:
      'Dali 10 opened on the yimi new moon of the first spring month.',
  },
  s0755: {
    literal:
      'On jiyou, Zhaoyi guard officer Pei Zhiqing expelled his commander Xue Zong; Zong fled to Mozhou and submitted a memorial awaiting punishment.',
    idiomatic:
      'On jiyou, Pei Zhiqing of Zhaoyi drove out Xue Zong, who fled to Mo and begged punishment.',
  },
  s0756: {
    literal:
      'Zhiqing led the troops to Tian Chengsi.',
    idiomatic:
      'Zhiqing took the army to Tian Chengsi.',
  },
  s0757: {
    literal:
      'On renyin, Prince of Longevity Wang Mei died.',
    idiomatic:
      'On renyin, Prince of Longevity Wang Mei passed away.',
  },
  s0758: {
    literal:
      'On yimi, Zhu Ci submitted a memorial begging to remain in the capital and campaign west against Tibet, asking his younger brother Tao to act as Youzhou commissioner; approved.',
    idiomatic:
      'On yimi, Zhu Ci asked to stay in the capital against Tibet and leave Tao as acting Youzhou commissioner; the court agreed.',
  },
  s0759: {
    literal:
      'Zhaoyi officers Xue Ze, Xiong, and Jian were made prefects of Xiang, Wei, and Mo—all clansmen of Song.',
    idiomatic:
      'Xue Ze, Xiong, and Jian of Zhaoyi kin were made prefects of Xiang, Wei, and Mo.',
  },
  s0760: {
    literal:
      'On wushen, envoys were sent to reassure Tian Chengsi to keep to his borders; Chengsi did not obey the edict.',
    idiomatic:
      'On wushen envoys urged Tian Chengsi to keep the peace; he refused.',
  },
  s0761: {
    literal:
      'On renzi, Chong prefecture reverted to Guo.',
    idiomatic:
      'On renzi, Chongzhou became Guo again.',
  },
  s0762: {
    literal:
      'On guichou.',
    idiomatic:
      'The same day, on guichou,',
  },
  s0763: {
    literal:
      'Tian Chengsi seized Mozhou and also broke Wei prefecture.',
    idiomatic:
      'Tian Chengsi stole Mozhou and overran Wei.',
  },
  s0764: {
    literal:
      'Second month, yichou: rebels murdered Wei prefect Xue Xiong.',
    idiomatic:
      'On yichou, rebels killed Wei prefect Xue Xiong.',
  },
  s0765: {
    literal:
      'On bingyin, the Chen, Jin, Xi, Jiang, and Xi commissioners were abolished and again subordinated to Qianzhong.',
    idiomatic:
      'On bingyin, five southwestern commissioners were abolished and returned to Qianzhong.',
  },
  s0766: {
    literal:
      'On xinwei, by decree the fourth son Shu was enfeoffed Prince of Mu and made Lingnan commissioner for revenue, estates, princely mansion, defense, observation, and disposition.',
    idiomatic:
      'On xinwei, the fourth son Shu was made Prince of Mu and Lingnan commissioner with full powers.',
  },
  s0767: {
    literal:
      'The fifth son Yu was to be enfeoffed Prince of Chen and made Weibei-Bin-Fang commissioner.',
    idiomatic:
      'The fifth son Yu was named Prince of Chen and Weibei-Bin-Fang commissioner.',
  },
  s0768: {
    literal:
      'The sixth son Lian was enfeoffed Prince of En.',
    idiomatic:
      'The sixth son Lian was made Prince of En.',
  },
  s0769: {
    literal:
      'The seventh son, Prince of Han Wang Hui, was to be made Bian-Song commissioner.',
    idiomatic:
      'The seventh son Hui was named Prince of Han and Bian-Song commissioner.',
  },
  s0770: {
    literal:
      'The eighth son Sui was to be enfeoffed Prince of Bin.',
    idiomatic:
      'The eighth son Sui was to become Prince of Bin.',
  },
  s0771: {
    literal:
      'The thirteenth son Zao was enfeoffed Prince of Xin and made Zhaoyi military commissioner.',
    idiomatic:
      'The thirteenth son Zao became Prince of Xin and Zhaoyi commissioner.',
  },
  s0772: {
    literal:
      'The fourteenth son Xian was enfeoffed Prince of Shao.',
    idiomatic:
      'The fourteenth son Xian was made Prince of Shao.',
  },
  s0773: {
    literal:
      'The fifteenth son Yun was enfeoffed Prince of Jia.',
    idiomatic:
      'The fifteenth son Yun was made Prince of Jia.',
  },
  s0774: {
    literal:
      'The sixteenth son Yu was enfeoffed Prince of Duan.',
    idiomatic:
      'The sixteenth son Yu was made Prince of Duan.',
  },
  s0775: {
    literal:
      'The seventeenth son Yu was enfeoffed Prince of Xun.',
    idiomatic:
      'The seventeenth son Yu was made Prince of Xun.',
  },
  s0776: {
    literal:
      'The eighteenth son Tong was enfeoffed Prince of Gong.',
    idiomatic:
      'The eighteenth son Tong was made Prince of Gong.',
  },
  s0777: {
    literal:
      'The nineteenth son Da was enfeoffed Prince of Yuan.',
    idiomatic:
      'The nineteenth son Da was made Prince of Yuan.',
  },
  s0778: {
    literal:
      'The twentieth son Yi was enfeoffed Prince of Ya.',
    idiomatic:
      'The twentieth son Yi was made Prince of Ya.',
  },
  s0779: {
    literal:
      'All could hold ceremonial rank equal to the Three Excellencies without leaving the palace.',
    idiomatic:
      'All received ceremonial rank equal to chief ministers but did not leave the palace.',
  },
  s0780: {
    literal:
      'On bingzi, Huazhou prefect Li Chengzhao was made Xiangzhou prefect.',
    idiomatic:
      'On bingzi, Li Chengzhao became Xiangzhou prefect.',
  },
  s0781: {
    literal:
      'Acting Zhaoyi military commissioner.',
    idiomatic:
      'He also acted as Zhaoyi military commissioner.',
  },
  s0782: {
    literal:
      'At the time Tian Chengsi had seized all four prefectures under Xiang and Wei and appointed his own magistrates.',
    idiomatic:
      'Tian Chengsi had already seized Xiang and Wei\'s four prefectures and installed his own officials.',
  },
  s0783: {
    literal:
      'That day the Heyang army mutinied, expelled garrison commissioner Chang Xiuming, and forced guard officer Wang Weigong as commissioner; soldiers plundered for days; Xiuming fled to the eastern capital.',
    idiomatic:
      'That day Heyang mutinied, drove out Chang Xiuming, made Wang Weigong commissioner, and looted for days before Xiuming fled to Luoyang.',
  },
  s0784: {
    literal:
      'On jiashen, Pinglu-Ziqing commissioner, sea-transport commissioner for Silla and Bohai, acting minister of works, and Qing prefect Li Zhengji was made acting left vice director;',
    idiomatic:
      'On jiashen, Li Zhengji of Pinglu became acting left vice director;',
  },
  s0785: {
    literal:
      'former Longyou deputy commissioner and Long prefect Ma Sui was made Shangzhou prefect and defense commissioner of that prefecture.',
    idiomatic:
      'Ma Sui of Longyou became Shangzhou prefect and its defense commissioner.',
  },
  s0786: {
    literal:
      'Third month, jiawu: the Shaan army mutinied, expelled observation commissioner Li Guoqing, and plundered freely.',
    idiomatic:
      'On jiawu, Shaan troops expelled Li Guoqing and looted the city.',
  },
  s0787: {
    literal:
      'Guoqing with humble words bowed to all officers and barely escaped harm; order returned in one night.',
    idiomatic:
      'Guoqing bowed to every officer and escaped; by nightfall order returned.',
  },
  s0788: {
    literal:
      'On yisi, Xue E and Chang Xiuming reached the gate in white awaiting punishment.',
    idiomatic:
      'On yisi, Xue E and Chang Xiuming came to court in white to await judgment.',
  },
  s0789: {
    literal:
      'On dingwei, left regular cavalry attendant Meng Hao was made Huazhou prefect and Tong Pass defense commissioner.',
    idiomatic:
      'On dingwei, Meng Hao became Huazhou prefect and Tong Pass defender.',
  },
  s0790: {
    literal:
      'On gengxu, Mars entered the Ramparts.',
    idiomatic:
      'On gengxu Mars entered the Ramparts.',
  },
  s0791: {
    literal:
      'Fourth month: the ministry of ceremonies reported that dou and steelyard weights used in prefectures should be issued in bronze by the ministry for local manufacture—approved.',
    idiomatic:
      'In the fourth month the ministry ordered bronze weights issued to prefectures as models—approved.',
  },
  s0792: {
    literal:
      'On yichou, decree: Weibo commissioner, ceremonial chief minister, grand master, acting left vice director, fellow grand councilor, Wei chief administrator, pillar of state, and Prince of Yanmen Tian Chengsi is demoted to Yongzhou prefect.',
    idiomatic:
      'On yichou Tian Chengsi of Weibo was demoted to Yongzhou prefect.',
  },
  s0793: {
    literal:
      'Edicts also ordered Hedong, Zhen-Ji, Youzhou, Ziqing, Huai-xi, Hua-Mei, Bian-Song, Ze-Lu, and Heyang circuits to march and attack.',
    idiomatic:
      'Nine circuits were ordered to march against him.',
  },
  s0794: {
    literal:
      'On jiashen, great hail and violent wind broke trees, blew off roof tiles and ridge beasts; two in ten people were killed by thunder; seven capital counties lost crops.',
    idiomatic:
      'On jiashen hail and a gale wrecked roofs and killed one in five in seven counties around the capital.',
  },
  s0795: {
    literal:
      'Fifth month, yimi: Tian Chengsi\'s officer Huo Rongguo surrendered Cizhou.',
    idiomatic:
      'On yimi, Huo Rongguo surrendered Cizhou to the court.',
  },
  s0796: {
    literal:
      'On guimao, Chang prefecture was established in Jiannan.',
    idiomatic:
      'On guimao, Changzhou was created in Jiannan.',
  },
  s0797: {
    literal:
      'Examinations at the two capitals were abolished; all were gathered at the upper capital; the child prodigy category was suspended.',
    idiomatic:
      'Both capitals\' examinations were ended; all candidates went to Chang\'an; the child prodigy category was dropped.',
  },
  s0798: {
    literal:
      'Sixth month, xinwei: Tian Chengsi sent his partisan Pei Zhiqing to besiege Jizhou and was defeated by Li Baochen.',
    idiomatic:
      'On xinwei, Chengsi\'s agent Pei Zhiqing besieged Ji and was routed by Li Baochen.',
  },
  s0799: {
    literal:
      'Autumn, seventh month, jiwei.',
    idiomatic:
      'On jiwei of the seventh month,',
  },
  s0800: {
    literal:
      'Minister of Revenue Chang Cui died.',
    idiomatic:
      'Chang Cui, minister of revenue, died.',
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
