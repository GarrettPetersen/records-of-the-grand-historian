#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'I feared the Hebei feudal lords would stick fast to him and there would be no way to wash him away.',
    idiomatic: 'I feared Hebei lords would cling to him and he could not be removed.',
  },
  s0102: {
    literal: 'Now the great circuits of the two Hebei regions all wish to punish him; if we do not destroy him while he is divided and alienated, this is failing to cut when cutting is due.',
    idiomatic: 'Both Hebei circuits want him dead; not striking while he is divided is missing the moment.',
  },
  s0103: {
    literal: 'Kong Wei said: "Jun\'s words are correct."',
    idiomatic: 'Kong Wei said, "Jun is right."',
  },
  s0104: {
    literal: 'Army Commander Yang Fugong said: "In the previous reign we braved frost and dew, driven into exile in the wilds; for seven or eight years we could not rest in peace. Though rebel ministers shook the outer realm, it was also because control was lost within.',
    idiomatic: 'Yang Fugong said, "The last reign braved exile seven or eight years—rebels outside, but control was lost within.',
  },
  s0105: {
    literal: 'Your Majesty has succeeded; the people\'s hearts rejoice in you—it is not fitting lightly to raise weapons and create trouble for the state.',
    idiomatic: 'Your Majesty has succeeded and hearts rejoice—do not lightly make war on the state.',
  },
  s0106: {
    literal: 'I hope a gracious edict may reply to Quanzhong, using gentle compliance in the wording.',
    idiomatic: 'Reply gently to Quanzhong.',
  },
  s0107: {
    literal: 'The emperor approved.',
    idiomatic: 'The emperor agreed.',
  },
  s0108: {
    literal: 'Quanzhong secretly sent Jun\'s kin to bribe Jun; Jun relied on Quanzhong\'s backing and argued without cease in memorials; the Son of Heaven reluctantly assented.',
    idiomatic: 'Quanzhong bribed Jun\'s kin; Jun pressed memorials with Quanzhong\'s backing until the emperor reluctantly assented.',
  },
  s0109: {
    literal: 'In the fifth month an edict appointed Special Advancement, Vice Director of the Chancellery, Minister of War, Associate Grand Councillor, University Fellow of the Jixian Hall, Supreme Pillar of State, Baron of Hejian with a fief of seven hundred households Zhang Jun as overall commander of the encircling armies on four sides of Taiyuan, with Jingzhao Intendant Sun Kui as deputy.',
    idiomatic: 'Fifth month: Zhang Jun was made overall commander against Taiyuan; Sun Kui was deputy.',
  },
  s0110: {
    literal: 'Hua military commissioner Han Jian was made chief adjutant for suppression of the northern encampment and commissioner for army supplies;',
    idiomatic: 'Han Jian of Hua was made northern chief adjutant and supply commissioner;',
  },
  s0111: {
    literal: 'Xuanwu military commissioner Zhu Quanzhong was made southeastern suppression commissioner against Taiyuan;',
    idiomatic: 'Zhu Quanzhong of Xuanwu was made southeastern commissioner;',
  },
  s0112: {
    literal: 'Chengde military commissioner Wang Rong was made eastern suppression commissioner against Taiyuan;',
    idiomatic: 'Wang Rong of Chengde was made eastern commissioner;',
  },
  s0113: {
    literal: 'You military commissioner Li Kuangwei was made northern suppression commissioner against Taiyuan, with Yun defense commissioner Helian Duo as deputy.',
    idiomatic: 'Li Kuangwei of You was northern commissioner; Helian Duo of Yun was deputy.',
  },
  s0114: {
    literal: 'On the day bingwu the Lu army mutinied and killed its commander Li Ke Gong.',
    idiomatic: 'On bingwu Lu troops mutinied and killed Li Ke Gong.',
  },
  s0115: {
    literal: 'Army supervisor Xue Hui had boxed Ke Gong\'s head and presented it to the court; Jun was just raising troops and the court offered congratulations.',
    idiomatic: 'Supervisor Xue Hui sent Ke Gong\'s head to court as Jun marched; the court celebrated.',
  },
  s0116: {
    literal: 'On the day renzi overall suppression commissioners Zhang Jun and Sun Kui led three thousand of the various elite Shence armies to the encampment; Zhaozong attended at Anxi Gate to see them off and charged them with oaths.',
    idiomatic: 'On renzi Jun and Sun Kui led three thousand Shence troops to camp; Zhaozong saw them off at Anxi Gate with oaths.',
  },
  s0117: {
    literal: 'On the day yimao Li Keyong\'s great general An Jian, acting Xing-Min commander, submitted a memorial asking to submit the three prefectures and sent a palace envoy to comfort him.',
    idiomatic: 'On yimao An Jian, acting Xing-Min commander, offered three prefectures; an envoy was sent to comfort him.',
  },
  s0118: {
    literal: 'An edict appointed De Prefecture governor, acting Cangzhou military commissioner Lu Yanwei as acting Right Vice Director of the Secretariat, concurrent Cangzhou prefect and Censor-in-Chief, and military commissioner of Yichang, observer of Cang and De, and commissioner for disposition.',
    idiomatic: 'Lu Yanwei of De was made acting Right Vice Director and Yichang commissioner.',
  },
  s0119: {
    literal: 'Yanwei in the beginning of Guangqi drove out his commander Yang Quanmei and sought a commission; the court appointed the imperial escort commander Cao Cheng as Cang-De commissioner—Cheng though never took office, and Yanwei\'s request was not granted.',
    idiomatic: 'Yanwei had ousted Yang Quanmei in Guangqi and sought a commission; Cao Cheng was named but never took office.',
  },
  s0120: {
    literal: 'Now Wang Rong and Luo Hongxin, because Zhang Jun was using troops, pleaded for Yanwei, and therefore this appointment was made.',
    idiomatic: 'Wang Rong and Luo Hongxin pleaded for Yanwei during Jun\'s campaign and won him the post.',
  },
  s0121: {
    literal: 'Jingzhao Intendant and deputy overall suppression commissioner Sun Kui was made acting Minister of War, concurrent Grand Governor of Lu Prefecture, deputy military commissioner of Zhaoyi knowing circuit affairs.',
    idiomatic: 'Sun Kui was made acting War Minister and Zhaoyi deputy commissioner.',
  },
  s0122: {
    literal: 'Zhang Jun assembled the armies at Jin Prefecture; Zhu Quanzhong selected three thousand Bian troops as Jun\'s guard corps.',
    idiomatic: 'Jun gathered armies at Jinzhou; Quanzhong gave him three thousand Bian guards.',
  },
  s0123: {
    literal: 'Autumn, seventh month, on the day yiyou the new moon, the imperial army encamped at Yindi; Taiyuan great general Kang Junli resisted with troops.',
    idiomatic: 'Seventh month yiyou new moon: imperial troops camped at Yindi; Kang Junli of Taiyuan resisted.',
  },
  s0124: {
    literal: 'Zhu Quanzhong sent the great general Ge Congzhou to lead a thousand horsemen into Lu Prefecture; Congzhou acted as temporary military commissioner.',
    idiomatic: 'Quanzhong sent Ge Congzhou with a thousand horse into Luzhou as acting commissioner.',
  },
  s0125: {
    literal: 'Zhu Quanzhong memorialized that troops had already been sent to hold Lu Prefecture and asked that military commissioner Sun Kui proceed to his post.',
    idiomatic: 'Quanzhong reported Luzhou held and asked Sun Kui to take the commission.',
  },
  s0126: {
    literal: 'At the time the palace envoy Han Guifan escorted Kui\'s commission, patent of appointment, and announcement to the encampment.',
    idiomatic: 'Palace envoy Han Guifan delivered Kui\'s commission to camp.',
  },
  s0127: {
    literal: 'On bingchen Kui raised his standard and led two thousand troops from Jin Prefecture to take up the Zhaoyi commission.',
    idiomatic: 'On bingchen Kui raised his standard and led two thousand from Jinzhou toward Zhaoyi.',
  },
  s0128: {
    literal: 'On wushen he reached the valley of Changzi County.',
    idiomatic: 'On wushen he entered Changzi valley.',
  },
  s0129: {
    literal: 'Taiyuan cavalry commander Li Cunxiao ambushed and seized Kui and Han Guifan with five hundred guard soldiers, sent them captive to Taiyuan, and the rest were all killed by Cunxiao.',
    idiomatic: 'Li Cunxiao ambushed Kui and Han Guifan with five hundred guards, sent them to Taiyuan, and killed the rest.',
  },
  s0130: {
    literal: 'Taiyuan commander Kang Junli led twenty thousand troops to attack Lu Prefecture.',
    idiomatic: 'Kang Junli of Taiyuan attacked Luzhou with twenty thousand.',
  },
  s0131: {
    literal: 'On the day jiashen Youzhou and Yunzhou barbarian and Han troops thirty thousand attacked Yanmen; Taiyuan commanders Li Cunxin and Xue Atan defeated them.',
    idiomatic: 'On jiashen thirty thousand from You and Yun attacked Yanmen; Cunxin and Atan of Taiyuan defeated them.',
  },
  s0132: {
    literal: 'Bian commander Ge Congzhou abandoned Shangdang; Kang Junli entered and held it; Keyong made Junli acting Ze-Lu military commissioner.',
    idiomatic: 'Congzhou abandoned Shangdang; Junli held it and Keyong made him acting Ze-Lu commissioner.',
  },
  s0133: {
    literal: 'On the first day of the eleventh month, guichou, Taiyuan commander Xing Prefecture governor Li Cunxiao, relying on the merit of capturing Sun Kui, expected to be made Zhaoyi commander and resented Keyong\'s appointing Kang Junli.',
    idiomatic: 'Eleventh month guichou new moon: Li Cunxiao of Xingzhou, proud of capturing Kui, wanted Zhaoyi and resented Junli\'s appointment.',
  },
  s0134: {
    literal: 'Cunxiao led encampment troops from Jin Prefecture back to Xing Prefecture, held the city, submitted a memorial to the court, and still sent letters to Zhang Jun and Wang Rong seeking aid.',
    idiomatic: 'Cunxiao returned to Xingzhou, held the city, submitted to court, and wrote Jun and Rong for aid.',
  },
  s0135: {
    literal: 'Keyong sent the great generals Li Cunxin and Xue Atan to resist the imperial army at Yindi; three battles, three victories; thereby the western circuits\' armies of Bin, Xia, Bin, and Qi crossed west of the river and returned.',
    idiomatic: 'Cunxin and Atan beat the imperial army three times at Yindi; Bin, Xia, Bin, and Qi troops crossed west and withdrew.',
  },
  s0136: {
    literal: 'Han Jian held the armies at Pingyang; Cunxin pursued; Jian\'s army was again defeated and Jian retreated to defend Jiang Prefecture.',
    idiomatic: 'Han Jian held Pingyang; Cunxin routed him and Jian fled to Jiangzhou.',
  },
  s0137: {
    literal: 'Zhang Jun had ten thousand Bian troops and imperial guard troops at Jin Prefecture; Cunxin attacked for three days; they deliberated, saying: "Zhang Jun is a chief minister—capturing him is no benefit; the Son of Heaven\'s guard troops must not be harmed.',
    idiomatic: 'Jun had ten thousand Bian and guard troops at Jinzhou; after three days\' attack they said, "Jun is a chief minister—no gain in taking him; do not harm the guard.',
  },
  s0138: {
    literal: 'If we take Pingyang, it is no advantage to us."',
    idiomatic: 'Taking Pingyang helps us nothing."',
  },
  s0139: {
    literal: 'They thereupon withdrew and encamped fifty li away.',
    idiomatic: 'They withdrew fifty li and camped.',
  },
  s0140: {
    literal: 'On the first day of the twelfth month, renwu, Zhang Jun and Han Jian abandoned Jin and Jiang and fled; Li Cunxin recovered Jin and Jiang and plundered greatly in the four commanderies of Hezhong.',
    idiomatic: 'Twelfth month renwu new moon: Jun and Jian fled; Cunxin took Jin and Jiang and ravaged Hezhong.',
  },
  s0141: {
    literal: 'On bingyin an edict made Special Advancement, Vice Director of the Chancellery, Grand Councillor, overall commander of the encircling armies on four sides of Taiyuan Zhang Jun acting Minister of War, concurrent E Prefecture governor and Censor-in-Chief, and observer of E and Yue.',
    idiomatic: 'On bingyin Jun was demoted to acting War Minister and E-Yue observer.',
  },
  s0142: {
    literal: 'Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, acting Minister of Works, Vice Director of the Chancellery, Associate Grand Councillor, Supreme Pillar of State, Duke of Lu with a fief of three thousand households, commissioner of salt and iron transport for all circuits Kong Wei was made acting Minister of Works, concurrent Governor of Jiangling, and military commissioner and observer of Jingnan with disposition.',
    idiomatic: 'Kong Wei was made acting Minister of Works and Jingnan commissioner at Jiangling.',
  },
  s0143: {
    literal: 'On gengwu the newly appointed E-Yue observer Zhang Jun was demoted and appointed prefect of Lian, the newly appointed Jingnan military commissioner Kong Wei was demoted and appointed prefect of Jun—both were ordered to proceed post-haste to their posts.',
    idiomatic: 'On gengwu Jun was sent to Lian and Kong Wei to Jun, both ordered post-haste.',
  },
  s0144: {
    literal: 'The Taiyuan army encamped at Jin Prefecture; Li Keyong sent the palace envoy Han Guifan back to court and thereby submitted a memorial pleading injustice, saying: "I was cut off from office and titles by the rebel minister Zhang Jun, who relied on Zhu Quanzhong to estrange meritorious ministers."',
    idiomatic: 'Keyong sent Han Guifan to court pleading injustice: "Zhang Jun and Zhu Quanzhong estranged me and stripped my titles."',
  },
  s0145: {
    literal: 'The court wished to let him release resentment and sent the matter for ministers to deliberate whether it was permissible.',
    idiomatic: 'The court sought reconciliation and asked ministers whether to restore him.',
  },
  s0146: {
    literal: 'Left Vice Director Wei Zhaodu and others argued:',
    idiomatic: 'Wei Zhaodu, Left Vice Director, and others argued:',
  },
  s0147: {
    literal: '"Rewarding merit and punishing fault is the former sage\'s constant plan;',
    idiomatic: '"Reward merit, punish fault—that is the sage\'s plan;',
  },
  s0148: {
    literal: 'bearing grime and hiding flaws is the hundred kings\' enduring instruction."',
    idiomatic: 'bearing flaws is the hundred kings\' teaching."',
  },
  s0149: {
    literal: 'Therefore when Lei was released Xi wrote the image of virtue, and when the net was opened Tang\'s transforming benevolence returned—using such gentle compliance preserves the constant model.',
    idiomatic: 'When Lei was freed Xi wrote virtue; when the net opened Tang\'s mercy returned—gentleness preserves the model.',
  },
  s0150: {
    literal: 'From the age of Xuanyuan down to the reigns of Wen and Wu, none failed to be broadly harmonious and generous, pouring forth favor like rain.',
    idiomatic: 'From Xuanyuan to Wen and Wu, rulers poured favor like rain.',
  },
  s0151: {
    literal: 'Moreover in the time when Dezong guarded the inheritance and Xianzong brought order, carriage tracks were one and mulberry and hemp stretched ten thousand li.',
    idiomatic: 'Under Dezong and Xianzong the realm was one track and ten thousand li of hemp.',
  },
  s0152: {
    literal: 'Beyond the Candle Dragon\'s wilds, all came by ladder and boat;',
    idiomatic: 'Far lands came by sea and road;',
  },
  s0153: {
    literal: 'in the Fire Rat\'s remotest borderlands, all returned to the true calendar."',
    idiomatic: 'the remotest borders returned to Tang\'s calendar."',
  },
  s0154: {
    literal: 'Yet Wang Chengzong still held troops in Zhen and Ji; the edict sent Fan Xichao to attack him—year after year without success, and in the end amnesty was granted.',
    idiomatic: 'Yet Chengzong held Zhen-Ji until amnesty ended years of failed attacks.',
  },
  s0155: {
    literal: 'And Zhu Tao with Youzhou\'s hosts joined Tian Yue, Li Na, and Wang Wujun in strength; Ma Sui and others campaigned without overcoming them, and soon they too were pardoned.',
    idiomatic: 'Zhu Tao, Tian Yue, Li Na, and Wang Wujun were pardoned after Ma Sui failed to crush them.',
  },
  s0156: {
    literal: 'With the accumulated sages\' plans and the great court\'s civilized discipline, it was not that they did not wish to drive the wind and sweep with lightning.',
    idiomatic: 'Sage policy and civilized discipline did not lack will to strike like wind and lightning.',
  },
  s0157: {
    literal: 'Yet they examined the meaning of the Spring and Autumn Annals and weighed the documents of Chu and Zheng—sometimes retreating and granting peace, sometimes submitting and again releasing—preserved in the old histories and recorded in the new books."',
    idiomatic: 'Yet they read Spring and Autumn and Chu-Zheng texts—sometimes peace, sometimes pardon—preserved in history."',
  },
  s0158: {
    literal: 'Li Keyong is a strong clan of the desert, noble scion of the Yin Mountains; at a breath wind and cloud rise, at a gesture grass and trees take form.',
    idiomatic: 'Keyong is a desert strong clan, Yin Mountain nobility—wind and cloud at a breath.',
  },
  s0159: {
    literal: 'He pointed to Heaven and his heart, vowing to present the head of the lost Zi;',
    idiomatic: 'He swore to Heaven to bring the rebel Zi\'s head;',
  },
  s0160: {
    literal: 'he lay by his bow and tasted blood, repeatedly visiting the protector-general\'s camp."',
    idiomatic: 'he lay by his bow and repeatedly came to the protector\'s camp."',
  },
  s0161: {
    literal: 'What is called courage that surpasses others—he himself did not come to us in extremity.',
    idiomatic: 'His courage surpassed others—yet he did not come to us only in ruin.',
  },
  s0162: {
    literal: 'In the reign of Your Majesty\'s late father Emperor Yizong, when Peng Gate was lost he personally drove crack troops and first established outstanding merit.',
    idiomatic: 'Under Yizong, when Peng Gate fell he led crack troops and won first merit.',
  },
  s0163: {
    literal: 'At the beginning of the late emperor\'s accession, when Zhugong was greatly disturbed, he again raised righteous troops and quelled the evil miasma.',
    idiomatic: 'At Xizong\'s accession he again raised troops and quelled Zhugong\'s turmoil.',
  },
  s0164: {
    literal: 'Afterward the great boar and long snake devoured the upper realm in succession; because of the chaos of the Zi reign it all stemmed from Chong\'er\'s covenant—preserving the great dynasty\'s ancestral temple and bequeathing restoration to the annals."',
    idiomatic: 'Later rebels devoured the realm; through Chong\'er\'s covenant he preserved the ancestral temple and restoration."',
  },
  s0165: {
    literal: 'In general when a sage king rules all under Heaven, merit may be written and achievement recorded; pardoning faults is not forgotten for ten generations, and remembering merit does not stop at one season.',
    idiomatic: 'Sage kings write merit and remember it beyond one season—pardon outlasts ten generations.',
  },
  s0166: {
    literal: 'Heaven is high and hears the low—please act on these words."',
    idiomatic: 'Heaven hears the low—please heed this."',
  },
  s0167: {
    literal: 'Moreover within the four seas creation is still fresh and suffering deep; of the nine tribute regions the net of rule is not yet ordered.',
    idiomatic: 'The realm still bleeds; the nine regions are not yet ordered.',
  },
  s0168: {
    literal: 'Yesterday Bin and Qi troops were suddenly raised and soon withdrew;',
    idiomatic: 'Bin and Qi troops were raised and soon withdrew;',
  },
  s0169: {
    literal: 'again Yan and Ji armies were levied and suddenly inner turmoil was heard."',
    idiomatic: 'Yan and Ji armies were levied and inner turmoil followed."',
  },
  s0170: {
    literal: 'It arose from failure in rations and closing of supply gates, causing them to cast aside weapons—this was contrary to the plan of borrowing chopsticks.',
    idiomatic: 'Rations failed and gates closed—troops cast aside arms, contrary to wise counsel.',
  },
  s0171: {
    literal: 'It was that lower plans were not mature, not that the sage strategy was wrong."',
    idiomatic: 'Plans below were immature, not the sage strategy."',
  },
  s0172: {
    literal: 'If Your Sagely Resolve were again set apart and Heaven\'s opportunity briefly appeared, record this sincere pledge, disperse those troops, empty the thought of remembering old grievances, and treat him with ceremony as at first.',
    idiomatic: 'If Your Majesty records his pledge, disperses troops, and treats him as before,',
  },
  s0173: {
    literal: 'what your subjects discuss is truly here."',
    idiomatic: 'that is what we urge."',
  },
  s0174: {
    literal: 'Moreover we have heard that in former times Han general Zhao Chongguo wished to exploit border weakness and send troops to strike; thereupon Wei Xiang submitted a memorial, setting forth benefit and harm, and said: \'Relying on the state\'s greatness and boasting of men\'s multitude, wishing to show might to the enemy is called arrogant troops.',
    idiomatic: 'We recall Zhao Chongguo wished to strike a weak border; Wei Xiang wrote that troops arrogant of the state\'s size are doomed—',
  },
  s0175: {
    literal: 'Arrogant troops are destroyed—this is not only human affairs but Heaven\'s way.\'"',
    idiomatic: 'arrogant troops perish by Heaven\'s way.\'"',
  },
  s0176: {
    literal: 'He also said: \'Your subject does not know what name this army bears.\'"',
    idiomatic: 'He said, \'I do not know this army\'s name.\'"',
  },
  s0177: {
    literal: 'Troops without a name do not succeed in the affair; Emperor Xuan accepted it and in the end halted the campaign.',
    idiomatic: 'Armies without righteous name fail; Xuan accepted and halted the campaign.',
  },
  s0178: {
    literal: 'We humbly consider that Your Majesty should mirror the difficulty of using troops in former antiquity and adopt the beauty of the successive sages in shifting to good; grace extending to the realm and trust reaching even pigs and fish—then your subjects cannot express their earnest wish.',
    idiomatic: 'Mirror antiquity\'s difficulty of war and the sages\' turn to mercy—then we are answered.',
  },
  s0179: {
    literal: 'Moreover now Bian and Wei are still hard pressed and You and Ding are in distress; even if levies were sent, how could affairs be gathered!',
    idiomatic: 'Bian and Wei are hard pressed; levies cannot gather armies now.',
  },
  s0180: {
    literal: 'Emptyly issuing orders only summons enemies; wishing to destroy men is not only to shame the state.',
    idiomatic: 'Empty orders summon enemies and shame the state.',
  },
  s0181: {
    literal: 'Moreover the crafty tribes raised troops in loyalty to the throne and offered the sincerity of devoted service, yet could not alone attack the barbarian horsemen—they hoped Han troops would share the strength.',
    idiomatic: 'Loyal tribes offered service yet could not fight alone—they needed Han strength.',
  },
  s0182: {
    literal: 'Now these several circuits rush orders without leisure; it is hard to bring relieving armies and we fear new trouble.',
    idiomatic: 'Circuits rush orders; relief is hard and new trouble feared.',
  },
  s0183: {
    literal: 'Advise them that as summer heat gradually comes it is not advantageous for military banners; distribute favors fully and send them back to their border tribes.',
    idiomatic: 'Tell them summer heat ill suits war; pay them and send them home.',
  },
  s0184: {
    literal: 'Chong Ying arrays the troops of five commanderies and tightens the passes more strictly;',
    idiomatic: 'Chong Ying holds five commanderies and tightens the passes;',
  },
  s0185: {
    literal: 'Wang Gong rouses the heroes of the two Hebei and makes drums and banners sterner."',
    idiomatic: 'Wang Gong stirs two Hebei and sharpens the host."',
  },
  s0186: {
    literal: 'Then reward his submitted memorial, pity his self-statement, record his former merit, and charge his later effectiveness.',
    idiomatic: 'Then reward his memorial, record old merit, and charge new service.',
  },
  s0187: {
    literal: 'Invoke the past canon of divine valor and restore the old fief of the Riyue."',
    idiomatic: 'Invoke divine valor\'s canon and restore old fiefs."',
  },
  s0188: {
    literal: 'Advise him that Wang Gong has already been expelled and he should no longer doubt the Jin emperor; all hundred ministers are truly earnest in this."',
    idiomatic: 'Tell him Wang Gong is gone and he need not doubt the throne—all ministers urge this."',
  },
  s0189: {
    literal: 'As for Keyong\'s personal offices and titles, all are asked to be returned, and he is still entered in the lineage register as before."',
    idiomatic: 'Restore Keyong\'s titles and register him as before."',
  },
  s0190: {
    literal: '"',
    idiomatic: 'End of the memorial quotation.',
  },
  s0191: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0192: {
    literal: 'Hanlin Academician-in-Chief and Vice Minister of War Cui Zhaowei was confirmed in office as Associate Grand Councillor; Censor-in-Chief Xu Yanruo was made Vice Minister of Revenue and Associate Grand Councillor.',
    idiomatic: 'Cui Zhaowei became Associate Grand Councillor; Xu Yanruo became Revenue vice minister and associate councillor.',
  },
  s0193: {
    literal: 'Right Vice Director of the Secretariat Wang Hui died; he was posthumously made Minister of Works with posthumous title Zhen.',
    idiomatic: 'Wang Hui, Right Vice Director, died; posthumous Minister of Works, title Zhen.',
  },
  s0194: {
    literal: 'In the second year of Dashun, in the second year of Dashun, spring, first month, on the day renzi the new moon, Li Keyong pressed the attack on Xing Prefecture.',
    idiomatic: 'Dashun 2, spring, first month renzi new moon: Keyong pressed Xingzhou.',
  },
  s0195: {
    literal: 'Li Cunxiao sought aid from Wang Rong; Rong sent troops to rescue him and encamped at Yaoshan.',
    idiomatic: 'Cunxiao called Wang Rong; Rong camped at Yaoshan.',
  },
  s0196: {
    literal: 'Keyong came from Taiyuan, defeated him, and advanced to besiege Xing Prefecture.',
    idiomatic: 'Keyong came from Taiyuan, routed him, and besieged Xingzhou.',
  },
  s0197: {
    literal: 'Minister of Works, Vice Director of the Chancellery, and Grand Councillor Du Rangneng was advanced to Grand Commandant, Commissioner of the Grand Pure Palace, University Fellow of the Hongwen Institute, Commissioner of the Extended Resources Store, and commissioner of salt and iron transport for all circuits.',
    idiomatic: 'Du Rangneng was advanced to Grand Commandant with Grand Pure Palace and salt transport.',
  },
  s0198: {
    literal: 'Vice Director of the Chancellery, Minister of Personnel, and Grand Councillor Liu Wang was made Vice Director of the Chancellery, supervised the national history, and judged Revenue; Vice Minister of Works and Grand Councillor Cui Zhaowei judged Revenue affairs.',
    idiomatic: 'Liu Wang took Chancellery vice director with history and Revenue; Cui Zhaowei judged Revenue.',
  },
  s0199: {
    literal: 'On the day xinsi Li Keyong was again made acting Grand Preceptor, Director of the Secretariat, Governor of Taiyuan, Northern Capital regent, and military commissioner and observer of Hedong with disposition.',
    idiomatic: 'On xinsi Keyong was restored Grand Preceptor, Secretariat Director, and Hedong commissioner.',
  },
  s0200: {
    literal: 'At the time Zhang Jun and Han Jian, after their armies were defeated, were pursued by Taiyuan commanders Li Cunxin and others; only now did they cross from Hanshan over Wang Wo and emerge at Heqing, reaching Heyang.',
    idiomatic: 'Jun and Han Jian, beaten and pursued by Cunxin, crossed Hanshan and Wang Wo to reach Heyang.',
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
