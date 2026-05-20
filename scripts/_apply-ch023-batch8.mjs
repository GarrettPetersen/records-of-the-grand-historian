#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.023, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/023.json';
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
    literal: 'On renzi, Inner Commander Han Quanhui and Fengxiang Escort Commander Li Jihui led the imperial carriage out to Fengxiang.',
    idiomatic: 'On renzi Han Quanhui and Li Jihui led the carriage to Fengxiang.',
  },
  s0702: {
    literal: 'That day Bian troops took Tongzhou and seized Prefect Sima Ye; Huazhou Commissioner Han Jian sent Judge Li Juchuan to submit.',
    idiomatic: 'That day Bian took Tongzhou; Han Jian submitted.',
  },
  s0703: {
    literal: 'On jiayin, Bian troops encamped at Lingkou.',
    idiomatic: 'On jiayin Bian troops encamped at Lingkou.',
  },
  s0704: {
    literal: 'On yimao, learning the emperor had departed, Quanzhong turned to attack Huazhou.',
    idiomatic: 'On yimao Quanzhong turned to attack Huazhou.',
  },
  s0705: {
    literal: 'The great army encamped at Chishui; Quanzhong\'s personal troops encamped at West Creek.',
    idiomatic: 'The army encamped at Chishui; Quanzhong at West Creek.',
  },
  s0706: {
    literal: 'Han Jian came out to surrender; he was appointed Zhongwu Commissioner with Chenzhou as seat.',
    idiomatic: 'Han Jian surrendered and was made Zhongwu commissioner at Chenzhou.',
  },
  s0707: {
    literal: 'On dingsi, Grand Councilor Cui Yin sent Vice Minister of Revenue Wang Pu to Chishui camp to urge Quanzhong with troops to welcome the carriage.',
    idiomatic: 'On dingsi Yin sent Wang Pu to urge Quanzhong welcome the carriage.',
  },
  s0708: {
    literal: 'On wuwu, Quanzhong hastened from Chishui toward Chang\'an; Yin led civil and military officials and Grand Preceptor Lu Zhiyou and below to welcome Quanzhong at Potou.',
    idiomatic: 'On wuwu Quanzhong hastened to Chang\'an; Yin welcomed him at Potou.',
  },
  s0709: {
    literal: 'On gengshen, Bian troops hastened toward Fengxiang.',
    idiomatic: 'On gengshen Bian troops hastened toward Fengxiang.',
  },
  s0710: {
    literal: 'On wuchen, they reached below Qi.',
    idiomatic: 'On wuchen they reached below Qi.',
  },
  s0711: {
    literal: 'Quanzhong sent Judges Li Ze and Pei Zhu into the city to memorialize: "At Hezhong I received Yin\'s letter with a secret edict ordering me to welcome the carriage with troops—I dared not welcome on my own."',
    idiomatic: 'Quanzhong said he dared not welcome the carriage on a secret edict alone.',
  },
  s0712: {
    literal: 'Zhaozong was angry at Yin\'s forged order and repeatedly edicted Quanzhong to return troops to his command.',
    idiomatic: 'Zhaozong was angry at the forged order and told Quanzhong return troops.',
  },
  s0713: {
    literal: 'On xinwei, Quanzhong led troops from Fengxiang, withdrew, and attacked Binzhou.',
    idiomatic: 'On xinwei Quanzhong left Fengxiang and attacked Binzhou.',
  },
  s0714: {
    literal: 'On jiaxu, an edict: Pacifier Merit Holder Cui Yin was demoted to Court Gentleman for Consultation, Guardian Minister of Works.',
    idiomatic: 'On jiaxu Cui Yin was demoted to consultation gentleman.',
  },
  s0715: {
    literal: 'On yihai, Binzhou Commissioner Li Jihui surrendered the city; Quanzhong left his family at Hezhong and took Jihui with the army.',
    idiomatic: 'On yihai Li Jihui surrendered; Quanzhong took him with the army.',
  },
  s0716: {
    literal: 'Bian troops encamped at Sanyuan.',
    idiomatic: 'Bian encamped at Sanyuan.',
  },
  s0717: {
    literal: 'On jimao, Cui Yin came from Chang\'an to Sanyuan camp and plotted with Quanzhong to attack Fengxiang.',
    idiomatic: 'On jimao Yin came to Sanyuan and plotted attack Fengxiang.',
  },
  s0718: {
    literal: 'In the second year of Tianfu, spring, the first month, on wushen, the first day, the imperial carriage was at Fengxiang.',
    idiomatic: 'Tianfu 2, spring, wushen new moon: the carriage was at Fengxiang.',
  },
  s0719: {
    literal: 'Quanzhong was at Sanyuan; Li Keyong sent Grand General Zhou Dewei to attack Ci, Wei, and Jin.',
    idiomatic: 'Quanzhong was at Sanyuan; Keyong sent Zhou Dewei against Ci, Wei, and Jin.',
  },
  s0720: {
    literal: 'Quanzhong returned to Hezhong and ordered Zhu Youning with fifty thousand to camp at Jiangzhou; he greatly defeated Taiyuan troops northwest of Pu County; Youning pressed pursuit, took Fenzhou, and besieged Taiyuan.',
    idiomatic: 'Quanzhong sent Youning, who defeated Taiyuan and besieged Taiyuan.',
  },
  s0721: {
    literal: 'The Son of Heaven sent Remonstrance Official Zhang Yi to Jinzhou to instruct Quanzhong to make peace with Taiyuan.',
    idiomatic: 'The emperor sent Zhang Yi to urge peace with Taiyuan.',
  },
  s0722: {
    literal: 'As Youning again fought to disadvantage he returned to Guanxi.',
    idiomatic: 'Youning fought to disadvantage and returned to Guanxi.',
  },
  s0723: {
    literal: 'On the fourth month, dingchou, Zhu Youning massed the great army at Xingping.',
    idiomatic: 'Fourth month, dingchou: Youning massed at Xingping.',
  },
  s0724: {
    literal: 'In the fifth month, Qi troops fought and were greatly defeated south of Wugong at Hang Valley.',
    idiomatic: 'Fifth month: Qi troops were defeated at Hang Valley.',
  },
  s0725: {
    literal: 'Hearing the victory Quanzhong himself led fifty thousand Bian troops west.',
    idiomatic: 'Hearing victory Quanzhong led fifty thousand west.',
  },
  s0726: {
    literal: 'In the sixth month he advanced camp to Guo County.',
    idiomatic: 'Sixth month: he camped at Guo County.',
  },
  s0727: {
    literal: 'On dinghai he advanced to besiege Fengxiang and sent a judge into the city to welcome the carriage.',
    idiomatic: 'On dinghai he besieged Fengxiang and sent a judge welcome the carriage.',
  },
  s0728: {
    literal: 'In the ninth month Qi troops fought and were again defeated.',
    idiomatic: 'Ninth month: Qi troops were again defeated.',
  },
  s0729: {
    literal: 'In the eleventh month, Yanzhou Commissioner Li Zhouyi led troops to save Fengxiang.',
    idiomatic: 'Eleventh month: Li Zhouyi led troops to save Fengxiang.',
  },
  s0730: {
    literal: 'On the twelfth month, guiyou, Bian general Kong Xun seized Yanzhou by surprise, took Zhouyi\'s wife and children; Zhouyi then came down with his soldiers.',
    idiomatic: 'Twelfth month, guiyou: Kong Xun seized Yanzhou; Zhouyi surrendered.',
  },
  s0731: {
    literal: 'Thereby Bin, Ning, Yan, and Fang all fell to Bian troops.',
    idiomatic: 'Bin, Ning, Yan, and Fang fell to Bian.',
  },
  s0732: {
    literal: 'Maozhen was afraid and plotted to kill the inner officials to resolve the crisis.',
    idiomatic: 'Maozhen feared and plotted kill inner officials.',
  },
  s0733: {
    literal: 'In the third year of Tianfu, spring, the first month, on guimao, the first day, the imperial carriage was at Fengxiang.',
    idiomatic: 'Tianfu 3, spring, guimao new moon: the carriage was at Fengxiang.',
  },
  s0734: {
    literal: 'On jiachen, the Son of Heaven sent inner envoys to Quanzhong\'s army; Maozhen also sent General Guo Qiqi to convey the wish to return to the capital.',
    idiomatic: 'On jiachen envoys went to Quanzhong; Maozhen sent Guo Qiqi.',
  },
  s0735: {
    literal: 'On bingwu, Qingzhou guard Liu Zan took Quanzhong\'s Yanzhou; another guard Zhang Hou entered memorial; that day he also struck at Hua, killing Prefect Lou Jingsi.',
    idiomatic: 'On bingwu Liu Zan took Yanzhou; Zhang Hou memorialized; Lou Jingsi was killed at Hua.',
  },
  s0736: {
    literal: 'The emperor again sent Vice Minister of Revenue Han Wo and Lady Zhao of Zhao to proclaim to Quanzhong\'s army.',
    idiomatic: 'The emperor sent Han Wo and Lady Zhao to proclaim to Quanzhong\'s army.',
  },
  s0737: {
    literal: 'On xinhai, Quanzhong sent Judge Li Zhen to memorialize; the emperor ordered Academician Yao Ji to proclaim ordering Quanzhong summon Cui Yin to lead civil and military officials to welcome the carriage.',
    idiomatic: 'On xinhai Li Zhen memorialized; the emperor ordered Yin summoned welcome the carriage.',
  },
  s0738: {
    literal: 'On guichou, the emperor ordered Minister of Rites Su Xun to proclaim, grant Quanzhong a jade belt, and order Quanzhong manage Jiang Xuanhui attending the emperor.',
    idiomatic: 'On guichou Su Xun granted Quanzhong a jade belt and ordered manage Jiang Xuanhui.',
  },
  s0739: {
    literal: 'On dingsi, Jiang Xuanhui with inner envoys escorted the heads of Inner Commander Han Quanhui, Zhang Hongyan, and twenty below, announcing to the four commands\' troops the date of return.',
    idiomatic: 'On dingsi twenty eunuch heads were escorted, announcing return.',
  },
  s0740: {
    literal: 'On wuwu, inner envoys galloped to Hua to pursue Cui Yin; Yin pleaded illness and did not come.',
    idiomatic: 'On wuwu envoys pursued Yin at Hua; he pleaded illness.',
  },
  s0741: {
    literal: 'On jiazi at si hour the imperial carriage left Fengxiang and visited Quanzhong\'s army.',
    idiomatic: 'On jiazi at si hour the carriage left Fengxiang for Quanzhong\'s army.',
  },
  s0742: {
    literal: 'Quanzhong in plain robes awaited punishment, weeping beyond control; the emperor personally unfastened the jade belt and gave it.',
    idiomatic: 'Quanzhong in plain robes wept; the emperor gave back the jade belt.',
  },
  s0743: {
    literal: 'On yichou the court halted at Fufeng and ordered Zhu Youlun to command troops as guard.',
    idiomatic: 'On yichou at Fufeng Zhu Youlun guarded.',
  },
  s0744: {
    literal: 'On bingyin the court halted at Wugong.',
    idiomatic: 'On bingyin they halted at Wugong.',
  },
  s0745: {
    literal: 'On dingmao the court halted at Xingping; Grand Councilor Cui Yin led the hundred officials to welcome.',
    idiomatic: 'On dingmao at Xingping Yin led officials to welcome.',
  },
  s0746: {
    literal: 'That day a descending edict made Yin Guardian Minister of Works, Vice Director, Grand Councilor, restoring Grand Pure Palace, Hongwen, Extended Treasury, Salt and Iron Transport, and Revenue Control, Duke of Wei fief unchanged.',
    idiomatic: 'That day Yin was restored grand councilor and duke of Wei.',
  },
  s0747: {
    literal: 'On wuchen the court halted at Xianyang.',
    idiomatic: 'On wuchen they halted at Xianyang.',
  },
  s0748: {
    literal: 'On jisi the court entered the capital.',
    idiomatic: 'On jisi they entered Chang\'an.',
  },
  s0749: {
    literal: 'The Son of Heaven in plain robes wept at the ancestral temple, changed to coronation robes, and visited the Nine Temples.',
    idiomatic: 'The emperor wept at the temple, changed robes, and visited the Nine Temples.',
  },
  s0750: {
    literal: 'When rites ended he faced Changle Gate, amnestied, and the hundred officials congratulated.',
    idiomatic: 'He amnestied at Changle Gate; officials congratulated.',
  },
  s0751: {
    literal: 'Quanzhong was posted to the Left Army.',
    idiomatic: 'Quanzhong took the Left Army post.',
  },
  s0752: {
    literal: 'On xinwei he feasted Quanzhong in the inner hall; inner consorts\' sons performed music.',
    idiomatic: 'On xinwei he feasted Quanzhong in the inner hall.',
  },
  s0753: {
    literal: 'That day an edict: seven hundred inner officials from Di Wu and below were all ordered to die in the Inner Service Bureau; circuit supervisors and lesser agents were to execute and memorialize—following Quanzhong and Yin\'s memorial.',
    idiomatic: 'That day seven hundred eunuchs were ordered die—per Quanzhong and Yin.',
  },
  s0754: {
    literal: 'The emperor mourned them and himself composed funeral text.',
    idiomatic: 'The emperor mourned and composed funeral text.',
  },
  s0755: {
    literal: 'In the second month, on renshen, the first day.',
    idiomatic: 'Second month, renshen new moon.',
  },
  s0756: {
    literal: 'On jiaxu, an edict granted Quanzhong the title "Turn Heaven Renew Create Exhaust Loyal Upright Merit Holder."',
    idiomatic: 'On jiaxu Quanzhong received Turn Heaven Renew Create merit title.',
  },
  s0757: {
    literal: 'On jimao, an edict made Prince of Hui Zuo Commander-in-Chief of All Circuits\' Military Affairs.',
    idiomatic: 'On jimao Prince of Hui Zuo was made commander-in-chief.',
  },
  s0758: {
    literal: 'Another edict made Merit Holder Zhu Quanzhong Guardian Minister of Works, concurrent Palace Attendant, Controller of Six Armies and Twelve Guards.',
    idiomatic: 'Another edict made Quanzhong guardian minister of works and controller of six armies.',
  },
  s0759: {
    literal: 'Minister of Personnel and Grand Councilor Pei Shu was made Acting Right Vice Director, Grand Councilor, concurrent Guangzhou Prefect, could keep Grand Guardian and Director of the Secretariat, Vice Commander-in-Chief, fief increased three thousand households.',
    idiomatic: 'Pei Shu was made vice commander-in-chief and Guangzhou prefect.',
  },
  s0760: {
    literal: 'Grand Councilor Cui Yin was made Qinghai Commissioner and Lingnan East Commissioner.',
    idiomatic: 'Cui Yin was made Qinghai commissioner.',
  },
  s0761: {
    literal: 'On jiaxu, an edict demoted Vice Director Lu Yi to Lecturer for Prince of Yi, detached service.',
    idiomatic: 'On jiaxu Lu Yi was demoted to Prince of Yi lecturer.',
  },
  s0762: {
    literal: 'On jichou the emperor feasted Quanzhong at Shouchun Hall.',
    idiomatic: 'On jichou he feasted Quanzhong at Shouchun Hall.',
  },
  s0763: {
    literal: 'He again ordered Quanzhong write Maozhen for Princess Pingyuan.',
    idiomatic: 'He ordered Quanzhong write Maozhen for Princess Pingyuan.',
  },
  s0764: {
    literal: 'Tongzhou Commissioner Zhao Yi and Shanzhou Commissioner Zhu Youqian came to audience.',
    idiomatic: 'Zhao Yi and Zhu Youqian came to audience.',
  },
  s0765: {
    literal: 'An edict made Zhu Youyu Hua Prefect and Commissioner of Ganhua Army.',
    idiomatic: 'An edict made Zhu Youyu Ganhua commissioner.',
  },
  s0766: {
    literal: 'On yiwei, a ball game was held at Baoning Hall; Quanzhong won the lead token, ordered inner consorts\' sons bring wine, and face-to-face granted the vice commander-in-chief\'s commission.',
    idiomatic: 'On yiwei at Baoning Hall Quanzhong won the lead token and granted Pei Shu\'s commission.',
  },
  s0767: {
    literal: 'Newly appointed Guangzhou Commissioner Pei Shu was made Vice Director, Minister of Personnel, Grand Councilor, Commissioner for Editing the National History;',
    idiomatic: 'Pei Shu was made vice director and grand councilor;',
  },
  s0768: {
    literal: 'Vice Minister of Revenue Wang Pu was made Grand Councilor.',
    idiomatic: 'Wang Pu was made grand councilor.',
  },
  s0769: {
    literal: 'On wuxu, Quanzhong returned to Daliang; the emperor feasted him in the inner hall and set wine at Yanxi Gate.',
    idiomatic: 'On wuxu Quanzhong returned to Daliang; the emperor feasted him at Yanxi Gate.',
  },
  s0770: {
    literal: 'That day Quanzhong and the four commands\' judges all attended; the emperor faced the hall weeping farewell and ordered inner envoys gallop to send five composed "Willow Branch" lyrics as gift.',
    idiomatic: 'That day judges attended; the emperor wept farewell and sent five "Willow Branch" lyrics.',
  },
  s0771: {
    literal: 'On xinchou Princess Pingyuan reached the capital.',
    idiomatic: 'On xinchou Princess Pingyuan arrived.',
  },
  s0772: {
    literal: 'In the third month, on renyin, the first day, Quanzhong led four commands\' troops against Wang Shifan.',
    idiomatic: 'Third month, renyin new moon: Quanzhong led four commands against Wang Shifan.',
  },
  s0773: {
    literal: 'Before this, generals Zhu Youning and Yang Shihou\'s vanguard reached Linzi and Qing; Shifan begged Huainan aid; Yang Xingmi sent Wang Jingren with ten thousand men.',
    idiomatic: 'Before this Youning and Yang Shihou reached Linzi; Shifan begged Huainan aid.',
  },
  s0774: {
    literal: 'On the fourth month, xinwei, the first day, Sichuan Wang Jian attacked Qin and Long, seizing Maozhen\'s weakness, and sent Judge Wei Zhuang to present tribute and seek good relations with Quanzhong.',
    idiomatic: 'Fourth month, xinwei new moon: Wang Jian attacked Qin and Long and sent Wei Zhuang to Quanzhong.',
  },
  s0775: {
    literal: 'In the fifth month, an edict: Fengxiang Longyou Four Commands Northern Court Campaign, Zhangyi Commissioner Li Maozhen could be Acting Grand Preceptor, Guardian Director of the Secretariat.',
    idiomatic: 'Fifth month: Maozhen was made acting grand preceptor—he had feared Quanzhong\'s grand guardian rank.',
  },
  s0776: {
    literal: 'At first Maozhen had bullied the royal house; the court indulged him and added Director of the Department of State Affairs; now Quanzhong held Grand Guardian and Maozhen feared and begged leave the directorate.',
    idiomatic: 'Maozhen had bullied the court; now he begged leave the directorate.',
  },
  s0777: {
    literal: 'Cui Yin memorialized: "The Six Armies and Twelve Guards exist in name only with no soldiers.',
    idiomatic: 'Yin wrote: "Six Armies and Twelve Guards are names without soldiers.',
  },
  s0778: {
    literal: 'Capital guard also relies on personal troops.',
    idiomatic: 'Capital guard relies on personal troops.',
  },
  s0779: {
    literal: 'I beg each army recruit one thousand one hundred men, altogether six thousand six hundred."',
    idiomatic: 'He begged six thousand six hundred recruits."',
  },
  s0780: {
    literal: 'The edict was assented to.',
    idiomatic: 'The throne assented.',
  },
  s0781: {
    literal: 'Six Armies and Guards vice commissioners and Jingzhao Magistrate Zheng Yuangui set standards to recruit in the market.',
    idiomatic: 'Zheng Yuangui recruited in the market.',
  },
  s0782: {
    literal: 'An edict made Yingzhou Prefect Zhu Yougong Acting Minister of Works, concurrent Xuzhou Prefect, Commissioner of Wuning Army—following Quanzhong\'s memorial.',
    idiomatic: 'Zhu Yougong was made Wuning commissioner—per Quanzhong.',
  },
  s0783: {
    literal: 'In the sixth month, Qing and Huainan armies fought Bian at Linzi; Bian troops were greatly defeated; Zhu Youning died in battle; his head was sent to Huainan.',
    idiomatic: 'Sixth month: at Linzi Bian was defeated; Zhu Youning died; his head went to Huainan.',
  },
  s0784: {
    literal: 'In the ninth month, Bian general Yang Shihou greatly defeated Qing troops at Linqu.',
    idiomatic: 'Ninth month: Yang Shihou defeated Qing at Linqu.',
  },
  s0785: {
    literal: 'Jingnan Commissioner Cheng Run led a fleet to aid Ezhou; Li Lang\'s Lei Yanxi seized the opening and took Jiangling.',
    idiomatic: 'Cheng Run sailed to aid Ezhou; Lei Yanxi took Jiangling.',
  },
  s0786: {
    literal: 'Run\'s soldiers heard and fled back; Run in rage threw himself into the water and died.',
    idiomatic: 'Run\'s troops fled; Run drowned himself.',
  },
  s0787: {
    literal: 'Zhao Kuangning then led troops to raid Jingzhou and held it.',
    idiomatic: 'Zhao Kuangning raided Jingzhou and seized it.',
  },
  s0788: {
    literal: 'On xinsi, Bian Escort Commander Zhu Youlun fell from his horse playing polo and died; Quanzhong in rage killed several polo officers.',
    idiomatic: 'On xinsi Zhu Youlun died in a polo fall; Quanzhong killed several officers in rage.',
  },
  s0789: {
    literal: 'On dingyou, the first day of the eleventh month, Wang Shifan surrendered Qingzhou to Yang Shihou; Quanzhong again ordered Shifan to know Qing affairs.',
    idiomatic: 'Eleventh month, dingyou new moon: Wang Shifan surrendered Qingzhou; Quanzhong restored him to Qing.',
  },
  s0790: {
    literal: 'Bin and Fengxiang troops pressed the capital region.',
    idiomatic: 'Bin and Fengxiang troops pressed the capital.',
  },
  s0791: {
    literal: 'Bian troops encamped at Hezhong.',
    idiomatic: 'The Bian army camped at Hezhong.',
  },
  s0792: {
    literal: 'Qingzhou guard Liu Zan surrendered Yanzhou to Ge Congzhou, reporting Shifan\'s order.',
    idiomatic: 'Liu Zan surrendered Yanzhou to Ge Congzhou on Shifan\'s order.',
  },
  s0793: {
    literal: 'Quanzhong was pleased and appointed him Marshal\'s Headquarters Chief Escort, acting Yanzhou Acting Commissioner.',
    idiomatic: 'Quanzhong appointed Liu Zan chief escort and acting Yan commissioner.',
  },
  s0794: {
    literal: 'In the twelfth month, on dingmao, the first day.',
    idiomatic: 'Twelfth month, dingmao new moon.',
  },
  s0795: {
    literal: 'On xinsi, an edict made Minister of Rites Dugu Sun Vice Minister of War and Grand Councilor.',
    idiomatic: 'On xinsi Dugu Sun was made vice minister of war and grand councilor.',
  },
  s0796: {
    literal: 'On bingshen, an edict demoted Guardian Minister of Works Cui Yin to Crown Prince Guest and demoted Guardian Minister of Justice and concurrent Jingzhao Magistrate and Six Armies Vice Commissioner Zheng Yuangui to Silapu of Xunzhou.',
    idiomatic: 'On bingshen Cui Yin was demoted to crown prince guest and Zheng Yuangui to Xunzhou silapu.',
  },
  s0797: {
    literal: 'That day, Bian Escort Commander Zhu Youliang killed Yin and Yuangui, Imperial City Commissioner Wang Jianxun, Flying Dragon Commissioner Chen Ban, Gate Commissioner Wang Jianxi, Guest Bureau Commissioner Wang Jianyi, and former Left Vice Director Zhang Jun, Duke of Hejian.',
    idiomatic: 'That day Zhu Youliang killed Yin, Yuangui, several Wang commissioners, and Zhang Jun.',
  },
  s0798: {
    literal: 'Quanzhong was about to force the imperial carriage to Luoyang and feared Yin and Jun would set up a rival.',
    idiomatic: 'Quanzhong meant to move the court to Luoyang and feared Yin and Jun would oppose him.',
  },
  s0799: {
    literal: 'In the second month, on bingyin, the first day.',
    idiomatic: 'Second month, bingyin new moon.',
  },
  s0800: {
    literal: 'On yihai, Quanzhong took leave to go to Luoyang and personally supervised the work.',
    idiomatic: 'On yihai Quanzhong took leave for Luoyang and personally supervised construction.',
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
if (data.metadata.chapter !== '023') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 023; standalone T ready (${Object.keys(T).length} entries).`
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
