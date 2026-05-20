#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.023, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/023.json';
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
    literal: 'On the first day of the fourth month, bingyin.',
    idiomatic: 'On bingyin, the first day of the fourth month.',
  },
  s0802: {
    literal: 'On guisi, the emperor sent the Jin State Lady Kezheng to transmit an edict to Quanzhong, saying the inner palace’s lying-in was unsettled and entry to the Luoyang palace should wait until the tenth month.',
    idiomatic: 'On guisi the emperor sent Lady Kezheng of Jin with an edict: the empress was not yet safely delivered; the court should enter Luoyang palace only in the tenth month.',
  },
  s0803: {
    literal: 'Quanzhong thought the sovereign delayed awaiting trouble and was greatly angry, telling staff officer Kou Yanqing: “Go quickly to Shaanzhou; the day you arrive, hurry the Son of Heaven onward!',
    idiomatic: 'Quanzhong decided the emperor was stalling for a chance to rebel. Furious, he told Kou Yanqing: “Get to Shaanzhou at once. The day you arrive, drive the Son of Heaven forward!”',
  },
  s0804: {
    literal: 'closing quotation mark',
    idiomatic: '(end of command)',
  },
  s0805: {
    literal: 'On the first day of the intercalary fourth month, yiwei.',
    idiomatic: 'On yiwei, the first day of the intercalary fourth month.',
  },
  s0806: {
    literal: 'On dingyou, the imperial carriage departed Shaan Prefecture.',
    idiomatic: 'On dingyou the court left Shaanzhou.',
  },
  s0807: {
    literal: 'On renyin, it halted at the Gushui traveling palace.',
    idiomatic: 'On renyin it stopped at the Gushui traveling palace.',
  },
  s0808: {
    literal: 'At that time the Six Armies soldiers Yin had recruited, after Yin’s death, scattered and were gone; those who followed east were only several dozen princes and junior yellow-gate eunuchs, ball-players and inner-garden boys substituting for attendants—over two hundred in all.',
    idiomatic: 'The Six Armies troops Cui Yin had raised had melted away after his death. What still followed the emperor east were a few dozen princes, junior eunuchs, ball-players, and inner-garden boys standing in for attendants—barely two hundred souls.',
  },
  s0809: {
    literal: 'Quanzhong at Shaan still feared they might stir trouble and wished to remove them all, using Bian troops as guards.',
    idiomatic: 'Quanzhong, still at Shaan, feared this remnant might turn on him and meant to purge them and replace them with Bian guards.',
  },
  s0810: {
    literal: 'At the Gushui halt, Quanzhong had medical officer Xu Zhaoyuan report that the inner garden and others plotted mutiny; he then convened them under tents and, after food and drink, buried them in a pit, then announced a plot of treason.',
    idiomatic: 'At Gushui he had the physician Xu Zhaoyuan accuse the inner-garden staff of conspiracy, summoned them to a feast in the tents, and buried them alive in a pit afterward, then announced a treason plot.',
  },
  s0811: {
    literal: 'Henceforth all attendants before and behind and on duty were Bian men.',
    idiomatic: 'From then on every attendant around the emperor was a Bian soldier.',
  },
  s0812: {
    literal: 'On jiachen, the imperial carriage entered by the Hui’an Gate; Zhu Quanzhong, Zhang Quanyi, and Grand Councillors Pei Shu and Dugu Sun went before as guides.',
    idiomatic: 'On jiachen the procession entered through Hui’an Gate with Quanzhong, Zhang Quanyi, and councillors Pei Shu and Dugu Sun leading the way.',
  },
  s0813: {
    literal: 'That day great wind and rain of dust; a pace’s distance could not distinguish objects; at dusk it slightly ceased.',
    idiomatic: 'That day a sandstorm blotted out the world at arm’s length; only at dusk did it ease.',
  },
  s0814: {
    literal: 'On yisi, the sovereign took the Guangzheng Gate, proclaimed a great amnesty, and an edict said:',
    idiomatic: 'On yisi he appeared at Guangzheng Gate and proclaimed a general amnesty. The edict read:',
  },
  s0815: {
    literal: '"Turning regard to the central domain, we open the road for marquises and earls to attend court;',
    idiomatic: '"We turn to the central lands and open the road for the feudal lords to attend court;',
  },
  s0816: {
    literal: 'our fate meets the hundred-six calamity cycle, fitting ancient and modern practice of averting and avoiding harm.',
    idiomatic: 'fate meets the hundred-six cycle of disaster, in keeping with ancient and modern rites of avoidance.',
  },
  s0817: {
    literal: 'Moreover, setting the tripod at the old capital—our house\'s twin seats—with Mount Xuan to its left and Jia and Ru before it.',
    idiomatic: 'Moreover, at the old capital where the tripod was set—our house\'s twin seats—Mount Xuan lies to the left and Jia and Ru lie before it.',
  },
  s0818: {
    literal: 'When King Ping of Zhou moved east, the Ji surname was prolonged anew;',
    idiomatic: 'When King Ping of Zhou moved east, the house of Ji was prolonged anew;',
  },
  s0819: {
    literal: 'when Emperor Guangwu of Han fixed his enterprise, the Liu clan flourished the more.',
    idiomatic: 'when Emperor Guangwu of Han secured his rule, the house of Liu flourished all the more.',
  },
  s0820: {
    literal: 'Founding and repairing a new capital, praying Heaven for an enduring mandate—all through adverse fortune to reopen a bright age.',
    idiomatic: 'Founding and repairing a new capital and praying Heaven for lasting mandate—all through ill fortune to reopen a bright age.',
  },
  s0821: {
    literal: 'Some fled west among the Rong and Di; some perished utterly at the hands of demonic rebels.',
    idiomatic: 'Some fled west among the Rong and Di; some were utterly destroyed by demonic rebels.',
  },
  s0822: {
    literal: 'We have met misfortune in the house; our virtue spread unclear—in more than ten years We have thrice suffered forced removal.',
    idiomatic: 'We have met misfortune in the house and spread virtue unclearly; in more than ten years We have thrice been driven from the throne.',
  },
  s0823: {
    literal: 'It also happened that disaster clung to Qin and Yong and rebellion rose in Bin and Qi.',
    idiomatic: 'Disaster also clung to Qin and Yong, and rebellion rose in Bin and Qi.',
  },
  s0824: {
    literal: 'At first We went in person to Shimen to escape the guards\' disorder;',
    idiomatic: 'At first We went in person to Shimen to escape disorder among the guards;',
  },
  s0825: {
    literal: 'again We traveled to Mount Hua, still alarmed by raids on the capital region.',
    idiomatic: 'again We went to Mount Hua, still shaken by raids on the capital region.',
  },
  s0826: {
    literal: 'in peril arrows reached the imperial carriage; under coercion fire spread through palace temples.',
    idiomatic: 'in peril arrows reached the imperial carriage; under coercion fire spread through the palace temples.',
  },
  s0827: {
    literal: 'until at last villains linked with palace eunuchs and knit with traitors, causing Liu Jishu to imprison Us in the lower palace and Han Quanhui to seize Us in the right capital.',
    idiomatic: 'until villains linked with palace eunuchs and traitors, Liu Jishu imprisoning Us in the lower palace and Han Quanhui seizing Us in the western capital.',
  },
  s0828: {
    literal: 'None but troops besieging the inner halls, flame spanning the ninefold palace—all scheming to borrow arms for their persons, only imitating pointing at a deer to awe the multitude.',
    idiomatic: 'Troops besieged the inner halls and flame filled the ninefold palace—all borrowing arms to save themselves, only imitating the deer-and-horse ruse to awe the crowd.',
  },
  s0829: {
    literal: 'They forged proclamation of Heaven\'s statutes, despised outer fiefs, issued edicts at will, and made the loyal suffer punishment.',
    idiomatic: 'They forged Heaven\'s statutes, despised outer fiefs, issued edicts at will, and punished the loyal.',
  },
  s0830: {
    literal: 'Though governors of the four quarters jointly aided restoration, military law was blocked by impassable roads and gratitude to the court was cut off across distance.',
    idiomatic: 'Though governors of the four quarters aided restoration together, military law was blocked on broken roads and gratitude to the court could not reach across the distance.',
  },
  s0831: {
    literal: 'Deputy Marshal, Prince of Liang Quanzhong, holding concurrent command of the nearby capital region, mustering troops of four circuits, went far to Qiyang and personally welcomed the imperial carriage.',
    idiomatic: 'Deputy Marshal Prince of Liang Quanzhong, commanding the nearby capital and four circuits\' armies, went far to Qiyang and personally welcomed the imperial carriage.',
  },
  s0832: {
    literal: 'Through a hundred bitter battles he exterminated all villain chiefs; three years camped in the wild, at last he brought back the imperial carriage.',
    idiomatic: 'Through a hundred bitter battles he wiped out the villain chiefs; three years in field camps, and at last he brought back the imperial carriage.',
  },
  s0833: {
    literal: 'Xian and Hao were renewed in palaces and halls; Rang and Gui were cut off like eunuch minions—just then exalting the merit of second creation to align with the fortune of restoration.',
    idiomatic: 'Xian and Hao saw palaces and halls renewed; Rang and Gui were cut down like eunuch minions—exalting the merit of second creation to match the fortune of restoration.',
  },
  s0834: {
    literal: 'Again Bin and Qi joined in enmity; Ba-Shu linked in war—above they failed the state\'s grace, below they ruined good relations with neighbors.',
    idiomatic: 'Again Bin and Qi made war; Ba and Shu joined arms—above they failed the state\'s grace, below they ruined neighborly peace.',
  },
  s0835: {
    literal: 'Burning palaces\' fierce fire spread heat further to kin and neighbors;',
    idiomatic: 'Fires that burned the palaces spread heat to kin and neighbors;',
  },
  s0836: {
    literal: 'the emperor turned back the villains\' blades, yet invasion again reached the forbidden park.',
    idiomatic: 'the court turned back the villains\' blades, yet invasion again reached the forbidden park.',
  },
  s0837: {
    literal: 'Moreover Taiyi\'s wandering seat and the Six Palaces gathered together; the punishing star Mars long clung to the Eastern Well; celestial signs offered disaster to the Qin quarter—no terrain surpasses Luoyang.',
    idiomatic: 'Moreover Taiyi\'s seat and the Six Palaces gathered; Mars the punishing star long clung to the Eastern Well; heaven showed disaster for the Qin quarter—no terrain surpasses Luoyang.',
  },
  s0838: {
    literal: 'Then one or two loyal ministers, reaching to like-minded men in the four quarters, exhausted heart for the royal house and together swore a fine plan.',
    idiomatic: 'Then one or two loyal ministers and men of like mind in the four quarters exhausted themselves for the royal house and swore a fine plan together.',
  },
  s0839: {
    literal: 'Wei garrisoned Dingyan, crossed the great river, and all arrived;',
    idiomatic: 'Wei garrisoned Dingyan and crossed the great river until all had arrived;',
  },
  s0840: {
    literal: 'Chen, Xu, Lu, and Cai brought massive axles together.',
    idiomatic: 'Chen, Xu, Lu, and Cai brought massive wagon trains together.',
  },
  s0841: {
    literal: 'They cut through brambles to set up the court anew and drew from ashes to transform splendor.',
    idiomatic: 'They cut through brambles to raise the court anew and drew splendor from the ashes.',
  },
  s0842: {
    literal: 'Ancestral temple to the left of the suburbs, Altar of Soil and Grain to the right—solemn and lofty in dignity;',
    idiomatic: 'The suburban ancestral temple to the left and the Altar of Soil and Grain to the right—solemn in dignity;',
  },
  s0843: {
    literal: 'broad halls before and doubled corridors behind—richly elegant and deep.',
    idiomatic: 'grand halls in front and doubled corridors behind—rich, elegant, and deep.',
  },
  s0844: {
    literal: 'Dukes and ministers jointly deliberated; tortoise and milfoil agreed.',
    idiomatic: 'Dukes and ministers deliberated together; tortoise and milfoil agreed.',
  },
  s0845: {
    literal: 'In this jiazi year, at the first auspicious day of midsummer, fully equipped the law carriage left Shaan and ranked the hundred officials into the Luoyang suburbs—beholding such abundance, much comfort and joy.',
    idiomatic: 'In this jiazi year, at midsummer\'s first auspicious day, the law carriage fully equipped left Shaan and the hundred officials entered the Luoyang suburbs—seeing such abundance brought much comfort.',
  },
  s0846: {
    literal: 'Offering guilt at the Imperial Temple, worry and fear stirred the breast;',
    idiomatic: 'At the Imperial Temple We offered guilt; worry and fear stirred the breast;',
  },
  s0847: {
    literal: 'ascending the Duanyang Gate, compassion and feeling arose.',
    idiomatic: 'at the Duanyang Gate compassion and feeling welled up.',
  },
  s0848: {
    literal: 'For one man\'s scant blessing brought the myriad people no peace; laborers worn hard, the loyal utterly spent—we could build the enterprise of moving again, hoping to extend the eight-hundred-year foundation.',
    idiomatic: 'One man\'s scant blessing left the myriad people unquiet; laborers worn out, the loyal spent—we could build the work of moving again and hope to extend the eight-hundred-year foundation.',
  },
  s0849: {
    literal: 'Fitting to spread overflowing mercy, await this celebration of harmonious flourishing, wash flaws and scour stains—all alike made new.',
    idiomatic: 'Fitting to spread overflowing mercy, await this celebration of flourishing peace, wash flaws and scour stains—all alike made new.',
  },
  s0850: {
    literal: 'A general amnesty for All Under Heaven; change Tianfu year 4 to Tianyou year 1—Alas!',
    idiomatic: 'Let there be a general amnesty for All Under Heaven; change Tianfu year 4 to Tianyou year 1—Alas!',
  },
  s0851: {
    literal: 'Extend pardon at the Vermilion Bird Gate and forthwith settle the inner quarters.',
    idiomatic: 'Pardon at the Vermilion Bird Gate and forthwith settle the inner quarters.',
  },
  s0852: {
    literal: 'Though the nine temples\' mats and vessels are already shut in the new chamber;',
    idiomatic: 'Though the nine temples\' offerings are already shut in the new chamber;',
  },
  s0853: {
    literal: 'yet the imperial tombs\' pines and cypresses are far separated from the old capital.',
    idiomatic: 'yet the imperial tombs\' pines and cypresses stand far from the old capital.',
  },
  s0854: {
    literal: 'We will strive for order and peace—hard to express bound affection.',
    idiomatic: 'We will strive for order and peace—hard to express our bound affection.',
  },
  s0855: {
    literal: 'Civil and military hundred ministers, executive officials with posts—you who followed Us a thousand li—upright your single heart and take up government.',
    idiomatic: 'Civil and military ministers and executive officials who followed Us a thousand li—upright your hearts and take up government.',
  },
  s0856: {
    literal: 'Grace extends to the past; merit is required anew; at the founding of the state we must certainly impose penalties on negligent officials."',
    idiomatic: 'Grace extends to the past and merit is required anew; at the founding of the state we must impose penalties on negligent officials."',
  },
  s0857: {
    literal: 'On wushen, an edict: hereafter except retain the Xuanhui two courts, small horse stable, Fengde shrine, imperial kitchen, guest reception, gate office, flying dragon, and manor nine commissions; the rest are all stopped.',
    idiomatic: 'On wushen an edict abolished every inner office except the Xuanhui courts, horse stable, Fengde shrine, imperial kitchen, guest reception, gate office, flying dragon bureau, and manor commission.',
  },
  s0858: {
    literal: 'Inner-garden and ice-well affairs are entrusted to the Henan governor; inner ladies are still not to transmit edicts.',
    idiomatic: 'Inner-garden and ice-well duties went to the Henan governor; inner ladies were barred from relaying edicts.',
  },
  s0859: {
    literal: 'Medical officer Yan Youzhi and National University doctor Ouyang Te were killed, on grounds of star omens.',
    idiomatic: 'The physician Yan Youzhi and National University lecturer Ouyang Te were executed for alleged star omens.',
  },
  s0860: {
    literal: 'Grand Councillor Pei Shu also took Right Vice Director, salt-and-iron transport commissioner, and supervisor of national history; Households Minister and Vice Director Dugu Sun controlled the budget; Central Vice Director Liu Can controlled household affairs.',
    idiomatic: 'Pei Shu added Right Vice Director, salt-and-iron transport, and historiography; Dugu Sun took the budget; Liu Can took household affairs.',
  },
  s0861: {
    literal: 'On the first day of the fifth month, yichou.',
    idiomatic: 'On yichou, the first day of the fifth month.',
  },
  s0862: {
    literal: 'On bingyin, an edict made Heyang military governor Zhang Hanyu co–Grand Councillor.',
    idiomatic: 'On bingyin Zhang Hanyu, military governor of Heyang, was made co–Grand Councillor.',
  },
  s0863: {
    literal: 'A banquet for the hundred officials was held in Chongxun Hall; the sovereign praised Quanzhong’s achievements and said that the day before ascending the tower the office had lost the amnesty text and only the marshal’s headquarters recovered a copy to implement—nearly a disaster; the Secretariat could not be without fault.',
    idiomatic: 'At Chongxun Hall the emperor lauded Quanzhong’s deeds, then noted that the amnesty scroll had vanished the day before the tower ceremony and only a copy from headquarters saved the day—almost a catastrophe—and the Secretariat was not blameless.',
  },
  s0864: {
    literal: 'Pei Shu and others rose to await punishment.',
    idiomatic: 'Pei Shu and the others rose to await punishment.',
  },
  s0865: {
    literal: 'Mid-feast, the emperor changed clothes and summoned Quanzhong to a private banquet in the pavilion; Quanzhong earnestly declined.',
    idiomatic: 'Mid-banquet the emperor withdrew to summon Quanzhong to a private pavilion feast; Quanzhong pleaded off.',
  },
  s0866: {
    literal: 'The emperor said: “I wished, because Quanzhong’s achievements are lofty, to fast and receive him intimately, to show reliance.',
    idiomatic: 'The emperor said, “Your service is so great I meant to fast and receive you privately—to show how I lean on you.',
  },
  s0867: {
    literal: 'Since Quanzhong does not wish to come, then let Jing Xiang come; I will speak with him.',
    idiomatic: 'If you will not come, send Jing Xiang; I will speak with him.”',
  },
  s0868: {
    literal: '” Quanzhong had Jing Xiang withdraw privately and memorialized: “Jing Xiang also came out drunk.',
    idiomatic: 'Quanzhong had Jing Xiang slip away and reported, “Jing Xiang left drunk as well.”',
  },
  s0869: {
    literal: '” On jisi, Quanzhong took leave for Daliang; a banquet was held in Chongxun Hall; that day rain was heavy.',
    idiomatic: 'On jisi Quanzhong left for Daliang after another Chongxun banquet in pouring rain.',
  },
  s0870: {
    literal: 'On yiyou, Hanlin academician, Left Remonstrator, and drafter of edicts Shen Qiyuan kept his original office, because he had submitted illness.',
    idiomatic: 'On yiyou Shen Qiyuan, Hanlin academician and Left Remonstrator, kept his post after pleading illness.',
  },
  s0871: {
    literal: 'On dinghai, an edict: Henan metropolitan counties had first reduced one assistant magistrate; they may follow Jingzhao’s precedent and restore one county assistant magistrate.',
    idiomatic: 'On dinghai an edict restored one assistant magistrate per county in the Henan capital districts, matching Jingzhao’s practice.',
  },
  s0872: {
    literal: 'On guisi, the Secretariat memorialized: per this year’s fourth-month eleventh-day amnesty, Shaanzhou superior prefecture is changed to Xingtang Prefecture; its superior prefect becomes governor, left and right aides become junior governors, registrar becomes recorder, Shaan county becomes secondary red, the rest secondary metropolitan.',
    idiomatic: 'On guisi the Secretariat proposed renaming Shaan superior prefecture Xingtang, its chief magistrate “governor,” his deputies “junior governors,” and adjusting county ranks per the April amnesty.',
  },
  s0873: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0874: {
    literal: 'On the first day of the sixth month, jiawu; Yang Chongben of Bin raided within the passes; Quanzhong sent Zhu Youyu to encamp at Bairen Village.',
    idiomatic: 'On jiawu, sixth month’s first day, Yang Chongben raided Guanzhong; Quanzhong sent Zhu Youyu to camp at Bairen Village.',
  },
  s0875: {
    literal: 'On bingshen, Tongyi Grand Master, Secretariat drafter, bearer of purple-gold fish Yang Zhu may serve as Hanlin academician.',
    idiomatic: 'On bingshen Yang Zhu was approved as Hanlin academician.',
  },
  s0876: {
    literal: 'On gengzi, the Srivijaya envoy Bohe Su may be General Who Pacifies the Distance.',
    idiomatic: 'On gengzi the Srivijayan envoy Bohe Su was made General Who Pacifies the Distance.',
  },
  s0877: {
    literal: 'On dingwei, an edict: Jinzi-guanglu Grand Master, Junior Tutor of the Heir Lu Shao may retire as Junior Mentor of the Heir.',
    idiomatic: 'On dingwei Lu Shao, Junior Tutor of the Heir, was permitted to retire as Junior Mentor.',
  },
  s0878: {
    literal: 'Yinguanglu Grand Master, Junior Preceptor of the Heir, Baron of Tianshui with 300 households Zhao Chong may be acting Right Vice Director.',
    idiomatic: 'Zhao Chong, Junior Preceptor of the Heir, was made acting Right Vice Director.',
  },
  s0879: {
    literal: 'On jiayin, Jingzhao junior governor Zheng Taoguang was made Vice Minister of Rites; former attendant censor Wei Yue Right Division aide; former presented scholars Yao Hao and Zhao Qi, Liu Mingji, and Dou Zhuan may be regular secretaries of the Secretariat—all on Liu Can’s memorial.',
    idiomatic: 'On jiayin Zheng Taoguang became Vice Minister of Rites; Wei Yue, Yao Hao, Zhao Qi, Liu Mingji, and Dou Zhuan received Secretariat posts at Liu Can’s request.',
  },
  s0880: {
    literal: 'Jingnan Xiangzhou Loyalty Army military governor, Kaifu, acting Grand Preceptor, Central Director, Jiangling governor, Xiangzhou prefect, Pillar, King of Chu with 6,000 households Zhao Kuangning should receive full investiture rites.',
    idiomatic: 'Zhao Kuangning, King of Chu and military governor at Xiangyang, was ordered invested with full rites.',
  },
  s0881: {
    literal: 'On the first day of the seventh month, guihai; Quanzhong led troops to campaign against Bin and Feng.',
    idiomatic: 'On guihai, seventh month’s first day, Quanzhong marched against Bin and Feng.',
  },
  s0882: {
    literal: 'On jiazi, from Bian to Luoyang, banquet at the Wensi ball ground.',
    idiomatic: 'On jiazi he came from Bian to Luoyang and feasted at the Wensi ball court.',
  },
  s0883: {
    literal: 'When Quanzhong entered, some hundred officials sat in the corridor; Quanzhong was angry and flogged usher He Ning.',
    idiomatic: 'Quanzhong found officials lounging in the corridor and had the usher He Ning beaten.',
  },
  s0884: {
    literal: 'On bingyin, an edict demoted acting Censor-in-Chief Han Yi to Bianzhou aide and attendant censor Gui Ai to Dengzhou registrar, for the hundred officials’ arrogance toward Quanzhong.',
    idiomatic: 'On bingyin Han Yi and Gui Ai were demoted for slighting Quanzhong at court.',
  },
  s0885: {
    literal: 'On jiaxu, an edict made Zhongdaifu, Secretariat drafter, Pillar Du Yanlin Grand Master and acting Censor-in-Chief.',
    idiomatic: 'On jiaxu Du Yanlin was promoted to Grand Master and acting Censor-in-Chief.',
  },
  s0886: {
    literal: 'On dingchou, an edict: Personnel Director Xiao Qi to Personnel Director; Households Director Xu Wan to War Director; Merit Vice Director Zhang Maoshu to Rites Director; investigating censor Xi Yinxiang to Right Remonstrator.',
    idiomatic: 'On dingchou a slate of bureau promotions moved Xiao Qi, Xu Wan, Zhang Maoshu, and Xi Yinxiang up the ladder.',
  },
  s0887: {
    literal: 'On jimao, an edict: Wuchang military governor Du Hong, Kaifu, acting Grand Preceptor, Central Director, Western Peace King with 3,000 households, added 1,000 households and 200 actual fiefs.',
    idiomatic: 'On jimao Du Hong, King of Western Peace at Wuchang, received an added thousand households and two hundred fiefs.',
  },
  s0888: {
    literal: 'On gengyin, the Secretariat memorialized: “The western capital once had the Lingyan Pavilion picturing meritorious ministers; now with the move to Luoyang, it is fitting to discuss rebuilding.',
    idiomatic: 'On gengyin the Secretariat urged rebuilding Luoyang’s Lingyan Pavilion of meritorious portraits, as in the old western capital.',
  },
  s0889: {
    literal: 'Deputy Marshal Prince of Liang’s merit crowns the age; request a separate pavilion beside Lingyan to display extraordinary merit.',
    idiomatic: 'They asked a second pavilion beside Lingyan for the Prince of Liang, whose merit outshone all others.',
  },
  s0890: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s0891: {
    literal: 'On the first day of the eighth month, renchen.',
    idiomatic: 'On renchen, the first day of the eighth month.',
  },
  s0892: {
    literal: 'On renyin night, Zhu Quanzhong ordered Left Dragon Martial commander Zhu Yougong, Right Dragon Martial commander Shi Shuzong, and Privy Councilor Jiang Xuanhui to assassinate Zhaozong in the Jiao Hall.',
    idiomatic: 'On renyin night Zhu Quanzhong had Zhu Yougong, Shi Shuzong, and Jiang Xuanhui murder Emperor Zhaozong in the Jiao Hall.',
  },
  s0893: {
    literal: 'Since the emperor moved to Luoyang, Li Keyong, Li Maozhen, Wang Jian of Xichuan, and Zhao Kuangning of Xiangyang knew Quanzhong’s usurpation plan and allied in arms under the banner of restoration.',
    idiomatic: 'After the move to Luoyang, Li Keyong, Li Maozhen, Wang Jian in the west, and Zhao Kuangning at Xiangyang—all seeing Quanzhong’s coup—joined arms claiming restoration.',
  },
  s0894: {
    literal: 'But the emperor was outstanding; Quanzhong was campaigning west and feared trouble arising within, so he killed the emperor to cut off hope.',
    idiomatic: 'Zhaozong was too formidable; Quanzhong, campaigning west, feared a palace revolt and killed him to kill hope.',
  },
  s0895: {
    literal: 'Since leaving Chang’an the emperor daily feared the unforeseen; with the empress and inner persons he only drowned worry in drink.',
    idiomatic: 'From Chang’an onward he lived in dread; he, the empress, and the palace women drank away their fear.',
  },
  s0896: {
    literal: 'That month on renyin, Quanzhong ordered judge Li Zhen from Hezhong to Luoyang to plot with Yougong and others.',
    idiomatic: 'That renyin, Quanzhong sent Li Zhen from Hezhong to Luoyang to plot with Yougong and the rest.',
  },
  s0897: {
    literal: 'At the second watch that night, Jiang Xuanhui chose Dragon Martial officer Shi Tai and a hundred men to knock at the inner gate, saying urgent memorials from the army required audience.',
    idiomatic: 'At the second watch Jiang Xuanhui led a hundred Dragon Martial officers to the inner gate claiming urgent army memorials.',
  },
  s0898: {
    literal: 'The inner gate opened; Xuanhui left ten soldiers at each gate; reaching the Jiao Hall court, Lady Zhenyi of Hedong opened the gate and said to Xuanhui: “Urgent memorials should not come with soldiers.',
    idiomatic: 'They entered; Xuanhui left ten men per gate. At the Jiao courtyard Lady Zhenyi opened the door and said, “Soldiers do not belong on urgent memorials.”',
  },
  s0899: {
    literal: '” Shi Tai seized Zhenyi and killed her, rushing to the hall steps.',
    idiomatic: 'Shi Tai seized her, killed her, and ran for the hall.',
  },
  s0900: {
    literal: 'Xuanhui said: “Where is the Supreme One?',
    idiomatic: 'Jiang Xuanhui shouted, “Where is His Majesty?”',
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
