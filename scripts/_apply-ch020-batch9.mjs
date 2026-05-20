#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 900;

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
  s0801: {
    literal: 'Zhao Kuangning thereupon led troops to attack Jingzhou and seized it.',
    idiomatic: 'Zhao Kuangning then marched on Jingzhou, took it, and held the city.',
  },
  s0802: {
    literal: 'On xinsi, Zhu Youlun, the Bianzhou escort commander, fell from his horse while playing cuju and died; Quanzhong in rage killed several fellow players and officers.',
    idiomatic: 'On xinsi, Zhu Youlun, Bianzhou’s commander of the imperial escort, fell from his horse playing cuju and died. Quanzhong flew into a rage and executed several of the players and their officers.',
  },
  s0803: {
    literal: 'On the first day of the eleventh month, dingyou, Wang Shifan surrendered Qingzhou to Yang Shihou; Quanzhong again ordered Shifan to know Qingzhou affairs.',
    idiomatic: 'On dingyou, the first day of the eleventh month, Wang Shifan surrendered Qingzhou to Yang Shihou. Quanzhong restored him to govern Qingzhou.',
  },
  s0804: {
    literal: 'Bingzhou and Fengxiang soldiers pressed the capital region.',
    idiomatic: 'Troops from Bing and Fengxiang closed in on the capital.',
  },
  s0805: {
    literal: 'Bian armies encamped at Hezhong.',
    idiomatic: 'Zhu’s Bian armies camped at Hezhong.',
  },
  s0806: {
    literal: 'Qingzhou staff officer Liu Ye with Yanzhou surrendered to Ge Congzhou, reporting Shifan’s command.',
    idiomatic: 'Liu Ye, a Qingzhou staff officer, surrendered Yanzhou to Ge Congzhou on Wang Shifan’s orders.',
  },
  s0807: {
    literal: 'Quanzhong was pleased and appointed him chief adjutant of the marshal’s headquarters, acting military governor of Bin Prefecture.',
    idiomatic: 'Quanzhong rewarded him with the post of chief adjutant at headquarters and acting military governor of Bin.',
  },
  s0808: {
    literal: 'On the first day of the twelfth month, dingmao.',
    idiomatic: 'On dingmao, the first day of the twelfth month.',
  },
  s0809: {
    literal: 'On xinsi, an edict appointed Minister of Rites Dugu Sun as Vice Minister of War and co–Grand Councillor.',
    idiomatic: 'On xinsi, Dugu Sun, Minister of Rites, was made Vice Minister of War and co–Grand Councillor.',
  },
  s0810: {
    literal: 'On bingshen, an edict demoted Cui Yin, Grand Mentor, Palace Minister of the Supreme Ultimate, Grand Academician of the Hongwen Hall, commissioner of the Extended Treasury, controller of the Six Armies and Twelve Guards, transport commissioner for salt and iron, controller of the budget, Pillar of the State, Duke of Wei with 4,500 households, to Crown Prince Mentor; Zheng Yuangui, Minister of Justice and acting Jingzhao governor and deputy controller of the Six Armies, to Xunzhou registrar.',
    idiomatic: 'On bingshen, Cui Yin—Grand Mentor, Palace Minister, Hongwen Grand Academician, Extended Treasury commissioner, controller of the Six Armies and Twelve Guards, salt-and-iron transport commissioner, budget controller, Pillar of the State, Duke of Wei—was demoted to Crown Prince Mentor. Zheng Yuangui, Minister of Justice and acting Jingzhao governor, was demoted to registrar of Xun.',
  },
  s0811: {
    literal: 'That day, Zhu Youliang, Bianzhou escort commander, killed Yin and Yuangui, Imperial City commissioner Wang Jianxun, Flying Dragon commissioner Chen Ban, Gate commissioner Wang Jianxi, Guest Reception commissioner Wang Jianyi, and former Left Vice Director Zhang Jun, Duke of Hejian.',
    idiomatic: 'That same day Zhu Youliang, the Bianzhou escort commander, murdered Yin, Yuangui, the Imperial City commissioner Wang Jianxun, Flying Dragon commissioner Chen Ban, Gate commissioner Wang Jianxi, Guest Reception commissioner Wang Jianyi, and the former Left Vice Director Zhang Jun, Duke of Hejian.',
  },
  s0812: {
    literal: 'Quanzhong was about to force the imperial carriage to Luoyang and feared Yin and Jun would set up a rival court.',
    idiomatic: 'Quanzhong meant to drag the court to Luoyang and feared Yin and Jun might rally opposition.',
  },
  s0813: {
    literal: 'On the first day of spring in Tianyou year 1, dingyou, Hanlin academician and Left Reminder Liu Can was made Right Remonstrator, co–Grand Councillor, and granted the purple-gold fish bag.',
    idiomatic: 'On dingyou, New Year’s Day of Tianyou 1, Hanlin academician Liu Can was promoted to Right Remonstrator and co–Grand Councillor and given the purple-gold fish bag.',
  },
  s0814: {
    literal: 'On jihai, an edict made Minister of War Cui Yuan Central Vice Director, co–Grand Councillor, and Academician of the Jixian Hall.',
    idiomatic: 'On jihai, Cui Yuan, Minister of War, was named Central Vice Director, co–Grand Councillor, and Jixian Academician.',
  },
  s0815: {
    literal: 'On jiyou, Quanzhong led troops to encamp at Hezhong and sent staff officer Kou Yanqing to present a memorial requesting the court move to Luoyang.',
    idiomatic: 'On jiyou, Quanzhong marched to Hezhong and sent Kou Yanqing with a memorial begging the emperor to relocate to Luoyang.',
  },
  s0816: {
    literal: 'Quanzhong ordered Chang’an residents moved by household register, dismantled houses for timber, floated them down the Wei and Yellow rivers; linked roofs wailed for more than a month without cease.',
    idiomatic: 'Quanzhong forced Chang’an’s people to relocate by registry, stripped their houses for lumber, and rafted the timbers down the Wei and Yellow rivers. For more than a month the river was a chain of weeping roofs.',
  },
  s0817: {
    literal: 'Qin people cursed on the road: “State traitor Cui Yin summoned Zhu Wen to overturn the altars of state, bringing us to this—Heaven!',
    idiomatic: 'Along the roads the people of Qin cursed: “The traitor Cui Yin called in Zhu Wen to wreck the realm and ruin us—O Heaven!”',
  },
  s0818: {
    literal: 'Heaven!',
    idiomatic: 'O Heaven!”',
  },
  s0819: {
    literal: '” On dingsi, the imperial carriage departed the capital.',
    idiomatic: 'On dingsi the imperial procession left Chang’an.',
  },
  s0820: {
    literal: 'On guihai, it halted at Shaan Prefecture; Quanzhong met and bowed on the road.',
    idiomatic: 'On guihai it reached Shaanzhou, where Quanzhong met the emperor on the road and performed obeisance.',
  },
  s0821: {
    literal: 'On the first day of the second month, bingyin.',
    idiomatic: 'On bingyin, the first day of the second month.',
  },
  s0822: {
    literal: 'On yihai, Quanzhong took leave for Luoyang to supervise construction in person.',
    idiomatic: 'On yihai Quanzhong went to Luoyang to oversee the building work himself.',
  },
  s0823: {
    literal: 'On the first day of the fourth month, bingyin.',
    idiomatic: 'On bingyin, the first day of the fourth month.',
  },
  s0824: {
    literal: 'On guisi, the emperor sent the Jin State Lady Kezheng to transmit an edict to Quanzhong, saying the inner palace’s lying-in was unsettled and entry to the Luoyang palace should wait until the tenth month.',
    idiomatic: 'On guisi the emperor sent Lady Kezheng of Jin with an edict: the empress was not yet safely delivered; the court should enter Luoyang palace only in the tenth month.',
  },
  s0825: {
    literal: 'Quanzhong thought the sovereign delayed awaiting trouble and was greatly angry, telling staff officer Kou Yanqing: “Go quickly to Shaanzhou; the day you arrive, hurry the Son of Heaven onward!',
    idiomatic: 'Quanzhong decided the emperor was stalling for a chance to rebel. Furious, he told Kou Yanqing: “Get to Shaanzhou at once. The day you arrive, drive the Son of Heaven forward!”',
  },
  s0826: {
    literal: 'closing quotation mark',
    idiomatic: '(end of command)',
  },
  s0827: {
    literal: 'On the first day of the intercalary fourth month, yiwei.',
    idiomatic: 'On yiwei, the first day of the intercalary fourth month.',
  },
  s0828: {
    literal: 'On dingyou, the imperial carriage departed Shaan Prefecture.',
    idiomatic: 'On dingyou the court left Shaanzhou.',
  },
  s0829: {
    literal: 'On renyin, it halted at the Gushui traveling palace.',
    idiomatic: 'On renyin it stopped at the Gushui traveling palace.',
  },
  s0830: {
    literal: 'At that time the Six Armies soldiers Yin had recruited, after Yin’s death, scattered and were gone; those who followed east were only several dozen princes and junior yellow-gate eunuchs, ball-players and inner-garden boys substituting for attendants—over two hundred in all.',
    idiomatic: 'The Six Armies troops Cui Yin had raised had melted away after his death. What still followed the emperor east were a few dozen princes, junior eunuchs, ball-players, and inner-garden boys standing in for attendants—barely two hundred souls.',
  },
  s0831: {
    literal: 'Quanzhong at Shaan still feared they might stir trouble and wished to remove them all, using Bian troops as guards.',
    idiomatic: 'Quanzhong, still at Shaan, feared this remnant might turn on him and meant to purge them and replace them with Bian guards.',
  },
  s0832: {
    literal: 'At the Gushui halt, Quanzhong had medical officer Xu Zhaoyuan report that the inner garden and others plotted mutiny; he then convened them under tents and, after food and drink, buried them in a pit, then announced a plot of treason.',
    idiomatic: 'At Gushui he had the physician Xu Zhaoyuan accuse the inner-garden staff of conspiracy, summoned them to a feast in the tents, and buried them alive in a pit afterward, then announced a treason plot.',
  },
  s0833: {
    literal: 'Henceforth all attendants before and behind and on duty were Bian men.',
    idiomatic: 'From then on every attendant around the emperor was a Bian soldier.',
  },
  s0834: {
    literal: 'On jiachen, the imperial carriage entered by the Hui’an Gate; Zhu Quanzhong, Zhang Quanyi, and Grand Councillors Pei Shu and Dugu Sun went before as guides.',
    idiomatic: 'On jiachen the procession entered through Hui’an Gate with Quanzhong, Zhang Quanyi, and councillors Pei Shu and Dugu Sun leading the way.',
  },
  s0835: {
    literal: 'That day great wind and rain of dust; a pace’s distance could not distinguish objects; at dusk it slightly ceased.',
    idiomatic: 'That day a sandstorm blotted out the world at arm’s length; only at dusk did it ease.',
  },
  s0836: {
    literal: 'The sovereign visited the Imperial Ancestral Temple; when rites were done he returned to the palace, took the main hall to announce rewards to attendant officials and guards, and received the carriage escort.',
    idiomatic: 'The emperor worshipped at the ancestral temple, returned to the palace, took the main hall to reward the escort, and accepted their homage.',
  },
  s0837: {
    literal: 'On yisi, the sovereign took the Guangzheng Gate, proclaimed a great amnesty, and an edict said:',
    idiomatic: 'On yisi he appeared at Guangzheng Gate and proclaimed a general amnesty. The edict read:',
  },
  s0838: {
    literal: 'On wushen, an edict: hereafter except retain the Xuanhui two courts, small horse stable, Fengde shrine, imperial kitchen, guest reception, gate office, flying dragon, and manor nine commissions; the rest are all stopped.',
    idiomatic: 'On wushen an edict abolished every inner office except the Xuanhui courts, horse stable, Fengde shrine, imperial kitchen, guest reception, gate office, flying dragon bureau, and manor commission.',
  },
  s0839: {
    literal: 'Inner-garden and ice-well affairs are entrusted to the Henan governor; inner ladies are still not to transmit edicts.',
    idiomatic: 'Inner-garden and ice-well duties went to the Henan governor; inner ladies were barred from relaying edicts.',
  },
  s0840: {
    literal: 'Medical officer Yan Youzhi and National University doctor Ouyang Te were killed, on grounds of star omens.',
    idiomatic: 'The physician Yan Youzhi and National University lecturer Ouyang Te were executed for alleged star omens.',
  },
  s0841: {
    literal: 'Grand Councillor Pei Shu also took Right Vice Director, salt-and-iron transport commissioner, and supervisor of national history; Households Minister and Vice Director Dugu Sun controlled the budget; Central Vice Director Liu Can controlled household affairs.',
    idiomatic: 'Pei Shu added Right Vice Director, salt-and-iron transport, and historiography; Dugu Sun took the budget; Liu Can took household affairs.',
  },
  s0842: {
    literal: 'On the first day of the fifth month, yichou.',
    idiomatic: 'On yichou, the first day of the fifth month.',
  },
  s0843: {
    literal: 'On bingyin, an edict made Heyang military governor Zhang Hanyu co–Grand Councillor.',
    idiomatic: 'On bingyin Zhang Hanyu, military governor of Heyang, was made co–Grand Councillor.',
  },
  s0844: {
    literal: 'A banquet for the hundred officials was held in Chongxun Hall; the sovereign praised Quanzhong’s achievements and said that the day before ascending the tower the office had lost the amnesty text and only the marshal’s headquarters recovered a copy to implement—nearly a disaster; the Secretariat could not be without fault.',
    idiomatic: 'At Chongxun Hall the emperor lauded Quanzhong’s deeds, then noted that the amnesty scroll had vanished the day before the tower ceremony and only a copy from headquarters saved the day—almost a catastrophe—and the Secretariat was not blameless.',
  },
  s0845: {
    literal: 'Pei Shu and others rose to await punishment.',
    idiomatic: 'Pei Shu and the others rose to await punishment.',
  },
  s0846: {
    literal: 'Mid-feast, the emperor changed clothes and summoned Quanzhong to a private banquet in the pavilion; Quanzhong earnestly declined.',
    idiomatic: 'Mid-banquet the emperor withdrew to summon Quanzhong to a private pavilion feast; Quanzhong pleaded off.',
  },
  s0847: {
    literal: 'The emperor said: “I wished, because Quanzhong’s achievements are lofty, to fast and receive him intimately, to show reliance.',
    idiomatic: 'The emperor said, “Your service is so great I meant to fast and receive you privately—to show how I lean on you.',
  },
  s0848: {
    literal: 'Since Quanzhong does not wish to come, then let Jing Xiang come; I will speak with him.',
    idiomatic: 'If you will not come, send Jing Xiang; I will speak with him.”',
  },
  s0849: {
    literal: '” Quanzhong had Jing Xiang withdraw privately and memorialized: “Jing Xiang also came out drunk.',
    idiomatic: 'Quanzhong had Jing Xiang slip away and reported, “Jing Xiang left drunk as well.”',
  },
  s0850: {
    literal: '” On jisi, Quanzhong took leave for Daliang; a banquet was held in Chongxun Hall; that day rain was heavy.',
    idiomatic: 'On jisi Quanzhong left for Daliang after another Chongxun banquet in pouring rain.',
  },
  s0851: {
    literal: 'On yiyou, Hanlin academician, Left Remonstrator, and drafter of edicts Shen Qiyuan kept his original office, because he had submitted illness.',
    idiomatic: 'On yiyou Shen Qiyuan, Hanlin academician and Left Remonstrator, kept his post after pleading illness.',
  },
  s0852: {
    literal: 'On dinghai, an edict: Henan metropolitan counties had first reduced one assistant magistrate; they may follow Jingzhao’s precedent and restore one county assistant magistrate.',
    idiomatic: 'On dinghai an edict restored one assistant magistrate per county in the Henan capital districts, matching Jingzhao’s practice.',
  },
  s0853: {
    literal: 'On guisi, the Secretariat memorialized: per this year’s fourth-month eleventh-day amnesty, Shaanzhou superior prefecture is changed to Xingtang Prefecture; its superior prefect becomes governor, left and right aides become junior governors, registrar becomes recorder, Shaan county becomes secondary red, the rest secondary metropolitan.',
    idiomatic: 'On guisi the Secretariat proposed renaming Shaan superior prefecture Xingtang, its chief magistrate “governor,” his deputies “junior governors,” and adjusting county ranks per the April amnesty.',
  },
  s0854: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0855: {
    literal: 'On the first day of the sixth month, jiawu; Yang Chongben of Bin raided within the passes; Quanzhong sent Zhu Youyu to encamp at Bairen Village.',
    idiomatic: 'On jiawu, sixth month’s first day, Yang Chongben raided Guanzhong; Quanzhong sent Zhu Youyu to camp at Bairen Village.',
  },
  s0856: {
    literal: 'On bingshen, Tongyi Grand Master, Secretariat drafter, bearer of purple-gold fish Yang Zhu may serve as Hanlin academician.',
    idiomatic: 'On bingshen Yang Zhu was approved as Hanlin academician.',
  },
  s0857: {
    literal: 'On gengzi, the Srivijaya envoy Bohe Su may be General Who Pacifies the Distance.',
    idiomatic: 'On gengzi the Srivijayan envoy Bohe Su was made General Who Pacifies the Distance.',
  },
  s0858: {
    literal: 'On dingwei, an edict: Jinzi-guanglu Grand Master, Junior Tutor of the Heir Lu Shao may retire as Junior Mentor of the Heir.',
    idiomatic: 'On dingwei Lu Shao, Junior Tutor of the Heir, was permitted to retire as Junior Mentor.',
  },
  s0859: {
    literal: 'Yinguanglu Grand Master, Junior Preceptor of the Heir, Baron of Tianshui with 300 households Zhao Chong may be acting Right Vice Director.',
    idiomatic: 'Zhao Chong, Junior Preceptor of the Heir, was made acting Right Vice Director.',
  },
  s0860: {
    literal: 'On jiayin, Jingzhao junior governor Zheng Taoguang was made Vice Minister of Rites; former attendant censor Wei Yue Right Division aide; former presented scholars Yao Hao and Zhao Qi, Liu Mingji, and Dou Zhuan may be regular secretaries of the Secretariat—all on Liu Can’s memorial.',
    idiomatic: 'On jiayin Zheng Taoguang became Vice Minister of Rites; Wei Yue, Yao Hao, Zhao Qi, Liu Mingji, and Dou Zhuan received Secretariat posts at Liu Can’s request.',
  },
  s0861: {
    literal: 'Jingnan Xiangzhou Loyalty Army military governor, Kaifu, acting Grand Preceptor, Central Director, Jiangling governor, Xiangzhou prefect, Pillar, King of Chu with 6,000 households Zhao Kuangning should receive full investiture rites.',
    idiomatic: 'Zhao Kuangning, King of Chu and military governor at Xiangyang, was ordered invested with full rites.',
  },
  s0862: {
    literal: 'On the first day of the seventh month, guihai; Quanzhong led troops to campaign against Bin and Feng.',
    idiomatic: 'On guihai, seventh month’s first day, Quanzhong marched against Bin and Feng.',
  },
  s0863: {
    literal: 'On jiazi, from Bian to Luoyang, banquet at the Wensi ball ground.',
    idiomatic: 'On jiazi he came from Bian to Luoyang and feasted at the Wensi ball court.',
  },
  s0864: {
    literal: 'When Quanzhong entered, some hundred officials sat in the corridor; Quanzhong was angry and flogged usher He Ning.',
    idiomatic: 'Quanzhong found officials lounging in the corridor and had the usher He Ning beaten.',
  },
  s0865: {
    literal: 'On bingyin, an edict demoted acting Censor-in-Chief Han Yi to Bianzhou aide and attendant censor Gui Ai to Dengzhou registrar, for the hundred officials’ arrogance toward Quanzhong.',
    idiomatic: 'On bingyin Han Yi and Gui Ai were demoted for slighting Quanzhong at court.',
  },
  s0866: {
    literal: 'On jiaxu, an edict made Zhongdaifu, Secretariat drafter, Pillar Du Yanlin Grand Master and acting Censor-in-Chief.',
    idiomatic: 'On jiaxu Du Yanlin was promoted to Grand Master and acting Censor-in-Chief.',
  },
  s0867: {
    literal: 'On dingchou, an edict: Personnel Director Xiao Qi to Personnel Director; Households Director Xu Wan to War Director; Merit Vice Director Zhang Maoshu to Rites Director; investigating censor Xi Yinxiang to Right Remonstrator.',
    idiomatic: 'On dingchou a slate of bureau promotions moved Xiao Qi, Xu Wan, Zhang Maoshu, and Xi Yinxiang up the ladder.',
  },
  s0868: {
    literal: 'On jimao, an edict: Wuchang military governor Du Hong, Kaifu, acting Grand Preceptor, Central Director, Western Peace King with 3,000 households, added 1,000 households and 200 actual fiefs.',
    idiomatic: 'On jimao Du Hong, King of Western Peace at Wuchang, received an added thousand households and two hundred fiefs.',
  },
  s0869: {
    literal: 'On gengyin, the Secretariat memorialized: “The western capital once had the Lingyan Pavilion picturing meritorious ministers; now with the move to Luoyang, it is fitting to discuss rebuilding.',
    idiomatic: 'On gengyin the Secretariat urged rebuilding Luoyang’s Lingyan Pavilion of meritorious portraits, as in the old western capital.',
  },
  s0870: {
    literal: 'Deputy Marshal Prince of Liang’s merit crowns the age; request a separate pavilion beside Lingyan to display extraordinary merit.',
    idiomatic: 'They asked a second pavilion beside Lingyan for the Prince of Liang, whose merit outshone all others.',
  },
  s0871: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s0872: {
    literal: 'On the first day of the eighth month, renchen.',
    idiomatic: 'On renchen, the first day of the eighth month.',
  },
  s0873: {
    literal: 'On renyin night, Zhu Quanzhong ordered Left Dragon Martial commander Zhu Yougong, Right Dragon Martial commander Shi Shuzong, and Privy Councilor Jiang Xuanhui to assassinate Zhaozong in the Jiao Hall.',
    idiomatic: 'On renyin night Zhu Quanzhong had Zhu Yougong, Shi Shuzong, and Jiang Xuanhui murder Emperor Zhaozong in the Jiao Hall.',
  },
  s0874: {
    literal: 'Since the emperor moved to Luoyang, Li Keyong, Li Maozhen, Wang Jian of Xichuan, and Zhao Kuangning of Xiangyang knew Quanzhong’s usurpation plan and allied in arms under the banner of restoration.',
    idiomatic: 'After the move to Luoyang, Li Keyong, Li Maozhen, Wang Jian in the west, and Zhao Kuangning at Xiangyang—all seeing Quanzhong’s coup—joined arms claiming restoration.',
  },
  s0875: {
    literal: 'But the emperor was outstanding; Quanzhong was campaigning west and feared trouble arising within, so he killed the emperor to cut off hope.',
    idiomatic: 'Zhaozong was too formidable; Quanzhong, campaigning west, feared a palace revolt and killed him to kill hope.',
  },
  s0876: {
    literal: 'Since leaving Chang’an the emperor daily feared the unforeseen; with the empress and inner persons he only drowned worry in drink.',
    idiomatic: 'From Chang’an onward he lived in dread; he, the empress, and the palace women drank away their fear.',
  },
  s0877: {
    literal: 'That month on renyin, Quanzhong ordered judge Li Zhen from Hezhong to Luoyang to plot with Yougong and others.',
    idiomatic: 'That renyin, Quanzhong sent Li Zhen from Hezhong to Luoyang to plot with Yougong and the rest.',
  },
  s0878: {
    literal: 'At the second watch that night, Jiang Xuanhui chose Dragon Martial officer Shi Tai and a hundred men to knock at the inner gate, saying urgent memorials from the army required audience.',
    idiomatic: 'At the second watch Jiang Xuanhui led a hundred Dragon Martial officers to the inner gate claiming urgent army memorials.',
  },
  s0879: {
    literal: 'The inner gate opened; Xuanhui left ten soldiers at each gate; reaching the Jiao Hall court, Lady Zhenyi of Hedong opened the gate and said to Xuanhui: “Urgent memorials should not come with soldiers.',
    idiomatic: 'They entered; Xuanhui left ten men per gate. At the Jiao courtyard Lady Zhenyi opened the door and said, “Soldiers do not belong on urgent memorials.”',
  },
  s0880: {
    literal: '” Shi Tai seized Zhenyi and killed her, rushing to the hall steps.',
    idiomatic: 'Shi Tai seized her, killed her, and ran for the hall.',
  },
  s0881: {
    literal: 'Xuanhui said: “Where is the Supreme One?',
    idiomatic: 'Jiang Xuanhui shouted, “Where is His Majesty?”',
  },
  s0882: {
    literal: '” Zhaoyi Li Jianrong leaned from the balustrade and said to Xuanhui: “Commissioner, do not harm the Son of Heaven; better kill us.',
    idiomatic: 'Zhaoyi Li Jianrong leaned from the rail: “Commissioner, spare the Son of Heaven—kill us instead.”',
  },
  s0883: {
    literal: '” The emperor, drunk, hearing this, rose hastily.',
    idiomatic: 'Drunk, the emperor heard and lurched up.',
  },
  s0884: {
    literal: 'Shi Tai with sword entered the Jiao Hall; the emperor in single garment ran pillar to pillar; Tai pursued and assassinated him.',
    idiomatic: 'Shi Tai strode in with a sword. The emperor, in his night clothes, dodged pillar to pillar until Tai ran him down and killed him.',
  },
  s0885: {
    literal: 'Jianrong shielded the emperor with her body and was also killed by Tai.',
    idiomatic: 'Jianrong threw herself over him and died with him.',
  },
  s0886: {
    literal: 'They again seized Empress He and were about to kill her.',
    idiomatic: 'They seized Empress He next.',
  },
  s0887: {
    literal: 'The empress begged Xuanhui; Xuanhui said Quanzhong had ordered only the emperor killed and released the empress and left.',
    idiomatic: 'She begged Jiang Xuanhui, who said Quanzhong had ordered only the emperor’s death and let her go.',
  },
  s0888: {
    literal: 'The emperor died at thirty-eight; the hundred officials posthumous title Sagely Solemn, Cultured in Filial Piety; temple name Zhaozong.',
    idiomatic: 'He was thirty-eight. The court gave him the posthumous title Sagely Solemn, Cultured in Filial Piety and the temple name Zhaozong.',
  },
  s0889: {
    literal: 'On the twentieth day of the second month of year 2, buried at He Mausoleum.',
    idiomatic: 'On the twentieth of the second month, year 2, he was buried at He Mausoleum.',
  },
  s0890: {
    literal: 'The Lamented Emperor’s taboo is Zhu, ninth son of Zhaozong; mother the Accumulated Goodness Empress Dowager He.',
    idiomatic: 'The Lamented Emperor, taboo Zhu, was Zhaozong’s ninth son; his mother was Empress Dowager He of Accumulated Goodness.',
  },
  s0891: {
    literal: 'On the third day of the ninth month, born in the inner palace.',
    idiomatic: 'He was born in the inner palace on the third day of the ninth month.',
  },
  s0892: {
    literal: 'In the second month, enfeoffed Prince of Hui, name Zuo.',
    idiomatic: 'In the second month he was enfeoffed Prince of Hui under the name Zuo.',
  },
  s0893: {
    literal: 'In the second month, appointed Kaifu and commander-in-chief of all circuits’ armies.',
    idiomatic: 'That same month he was made Kaifu and commander-in-chief of all armies.',
  },
  s0894: {
    literal: 'On the twelfth day of the eighth month, Tianyou year 1, Zhaozong met assassination.',
    idiomatic: 'On the twelfth of the eighth month, Tianyou 1, Zhaozong was murdered.',
  },
  s0895: {
    literal: 'The next day, Jiang Xuanhui forged and proclaimed the testamentary edict, saying: “Our state transformed Sui into Tang and possessed All Under Heaven; for three hundred years we have seen arms repeatedly rise, relying on meritorious worthies in concert to settle the altars again.',
    idiomatic: 'Next day Jiang Xuanhui forged a death edict: “Our house turned Sui into Tang and held the realm three hundred years; again and again war came, yet worthy men restored the throne.',
  },
  s0896: {
    literal: 'Who would have thought within the palace quarters sudden calamity—Zhaoyi Li Jianrong and Lady Zhenyi of Hedong secretly harbored treason and wildly plotted, wounding the ruler deep, already at death’s door.',
    idiomatic: 'Who imagined palace women would strike—Zhaoyi Li Jianrong and Lady Zhenyi plotting treason, wounding the sovereign past saving?”',
  },
  s0897: {
    literal: 'The myriad affairs cannot long be vacant; the four seas cannot lack a lord; where the sacred tripod goes, succession is required.',
    idiomatic: 'The myriad affairs cannot stand empty; the realm cannot lack a ruler; the sacred vessel must pass on.',
  },
  s0898: {
    literal: 'Prince of Hui Zuo in youth showed precocious intelligence, grown truly upright and good, outstanding among others, my cherished choice—surely able to uphold the great instruction and settle the million people.',
    idiomatic: 'Prince of Hui Zuo is young but keen, grown upright and rare—the heir I trust to keep the great charter and calm the people.”',
  },
  s0899: {
    literal: 'He should be established Crown Prince, still rename Zhu, and oversee state affairs.',
    idiomatic: 'Let him be Crown Prince, renamed Zhu, to oversee state affairs.',
  },
  s0900: {
    literal: 'Alas!',
    idiomatic: 'Alas!”',
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
