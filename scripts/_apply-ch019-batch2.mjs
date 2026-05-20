#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.019, Yizong / Vol. 18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'Hearing that stream caves relied entirely on Lingbei tea and medicine, all circuits should let merchants trade freely and not forbid passage.',
    idiomatic: '"Let merchants carry Lingbei tea and medicine freely to stream caves."',
  },
  s0102: {
    literal: 'Lianzhou\'s pearl pools should profit the people jointly.',
    idiomatic: '"Lianzhou pearls should profit the people."',
  },
  s0103: {
    literal: 'Recently this circuit forbade them and cut off trade.',
    idiomatic: '"Local bans have cut off trade."',
  },
  s0104: {
    literal: 'Let this prefecture allow commoners to gather without restraint.',
    idiomatic: '"Let commoners gather pearls without restraint."',
  },
  s0105: {
    literal: 'Among Xuzhou Silver Blade guards some had earlier fled; repeated edicts forbade pursuit.',
    idiomatic: '"Do not pursue fugitive Silver Blade guards."',
  },
  s0106: {
    literal: 'On the eighteenth of the fourth month this year the grass-bandit ringleaders already suffered extreme law; the rest fled—everywhere cease pursuit.',
    idiomatic: '"Grass-bandit leaders are dead; cease pursuing the rest." Thus ended the edict.',
  },
  s0107: {
    literal: 'That month the eastern capital and Xu, Ru, Xu, and Si prefectures suffered great flood and crop damage.',
    idiomatic: 'That month floods ruined crops in the eastern capital and Xu, Ru, Xu, and Si.',
  },
  s0108: {
    literal: 'Earlier, near the end of Dazhong, Annan protector Li Zhuo was greedy and cruel, oppressing Liao tribesmen; the tribes brought Linyi barbarians to attack Annan prefecture.',
    idiomatic: 'Li Zhuo\'s greed in Annan had provoked Liao tribes to bring Linyi against the protectorate.',
  },
  s0109: {
    literal: 'In the third year troops were massively levied for relief; the realm was in turmoil.',
    idiomatic: 'Year three\'s mass levies unsettled the realm.',
  },
  s0110: {
    literal: 'That winter the barbarians finally took Jiaozhou; all armies sent to Annan were withdrawn to hold Lingnan east and west.',
    idiomatic: 'That winter Jiaozhou fell and Annan armies retreated to hold Lingnan east and west.',
  },
  s0111: {
    literal: 'In the eleventh month Chang\'an county aide and Collation academician Linghu Hao was made Left Reminder.',
    idiomatic: 'Linghu Hao became left remonstrance in the eleventh month.',
  },
  s0112: {
    literal: 'When the order issued, Left Reminder Liu Tui and Attendant Zhang Yun memorialized that when Hao\'s father Tao held power he widely took bribes, accepted Li Zhuo\'s bribe for Annan, and caused the barbarian raid—Hao should not sit in remonstrance.',
    idiomatic: 'Liu Tui and Zhang Yun attacked Linghu Hao as the son of the corrupt Tao who had sold Annan to Li Zhuo.',
  },
  s0113: {
    literal: 'Tao was then in Huainan and memorialized in protest; Yun was demoted Xingyuan vice prefect, Tui Huayin magistrate, Hao made Chief of the Heir Apparent\'s Household.',
    idiomatic: 'Tao protested from Huainan; Yun, Tui, and Hao were shuffled in punishment.',
  },
  s0114: {
    literal: 'Secretariat drafting officer Wang Duo was made acting director of the Rites examination; Vice Minister of War and revenue commissioner Cao Que became Grand Councillor; Secretariat Vice Director and Grand Councillor Bi Dan was made Acting Minister of Personnel, Hezhong prefect, and Jin-Jiang-Ci-Li commissioner.',
    idiomatic: 'Wang Duo examined candidates; Cao Que joined the council; Bi Dan went to Hezhong.',
  },
  s0115: {
    literal: 'Youzhou\'s Zhang Yunshen was advanced to Acting Grand Tutor.',
    idiomatic: 'Zhang Yunshen gained acting grand tutor.',
  },
  s0116: {
    literal: 'Vice Minister of War Gao Cong became Grand Councillor with his former title; Households Vice Minister Pei Yin judged his ministry\'s affairs.',
    idiomatic: 'Gao Cong joined the council; Pei Yin judged household affairs.',
  },
  s0117: {
    literal: 'Xian-tong 5, year Xian-tong 5 duplicated in the source—spring, first month, wuwu new moon: because of military use the New Year audience was canceled.',
    idiomatic: 'Xian-tong 5 canceled the New Year audience for war.',
  },
  s0118: {
    literal: 'Remonstrance Grandee Pei Tan memorialized that with levies everywhere and treasury empty, temples should not be overbuilt to strain state strength.',
    idiomatic: 'Pei Tan warned against temple-building while levies emptied the treasury.',
  },
  s0119: {
    literal: 'A gracious edict answered him.',
    idiomatic: 'The throne answered with a gracious edict.',
  },
  s0120: {
    literal: 'In the second month Minister of War Niu Cong was made Acting Minister of War, concurrent Chengdu prefect, and Jiannan West deputy commissioner knowing circuit affairs.',
    idiomatic: 'Niu Cong took Chengdu and Jiannan West in the second month.',
  },
  s0121: {
    literal: 'Xuzhou observation and defense commissioner.',
    idiomatic: 'Xuzhou gained an observation and defense commissioner.',
  },
  s0122: {
    literal: 'Secretariat Vice Director, Minister of War, and Grand Councillor Du Shenquan was made Runzhou prefect and Zhexi observation commissioner.',
    idiomatic: 'Du Shenquan went to Runzhou and Zhexi.',
  },
  s0123: {
    literal: 'In the third month Vice Director of War Gao Shi, Vice Director Yu Huai examined the Personnel ministry; they judged the candidates.',
    idiomatic: 'Gao Shi and Yu Huai examined personnel candidates in the third month.',
  },
  s0124: {
    literal: 'In the fourth month Right Vice Director and Grand Councillor Xiahou Zi gained five hundred households\' noble rank.',
    idiomatic: 'Xiahou Zi gained five hundred households\' noble rank in the fourth month.',
  },
  s0125: {
    literal: 'Secretariat drafting officer Wang Duo was made Vice Minister of Rites; Jinzhou prefect Meng Qiu was made Acting Minister of Works and concurrent Xuzhou prefect.',
    idiomatic: 'Wang Duo became vice minister of rites; Meng Qiu took Xuzhou.',
  },
  s0126: {
    literal: 'Southern barbarians raided Yong circuit; Qinzhou defense commissioner Gao Pian led five thousand forbidden troops to Yong and joined all-circuit forces to resist.',
    idiomatic: 'Gao Pian led five thousand forbidden troops to Yong against southern raiders.',
  },
  s0127: {
    literal: 'On dingyou of the fifth month an order:',
    idiomatic: 'On dingyou a fifth-month edict opened:',
  },
  s0128: {
    literal: '"We in our feebleness have received the great structure of Gaozu and Taizong these six years.',
    idiomatic: '"Six years on the throne we have shunned hunts, lust, careless punishments, and flatterers—',
  },
  s0129: {
    literal: 'We have not made roaming our pleasure, not indulged sound and color, not abused punishments, not been deluded by the wicked.',
    idiomatic: '"—and labored day and night so the realm might be at peace.',
  },
  s0130: {
    literal: 'Day and night in awe we toil with worry and diligence, hoping the eight regions may be secure and the myriad people at ease.',
    idiomatic: '"Yet only the southern barbarians defy us—',
  },
  s0131: {
    literal: 'Yet only the southern barbarians, treacherous and unruly, invaded Jiaozhi, stormed Langning, and even Yun prefecture felt their raids.',
    idiomatic: '"—invading Jiaozhi, Langning, and Yun, burdening soldiers and people.',
  },
  s0132: {
    literal: 'They wear out our soldiers and raise our arms; the people are disturbed and transport strained—each thought pains us with grief.',
    idiomatic: '"Each thought of their suffering pains us—',
  },
  s0133: {
    literal: 'Looking to the living who bear this sorrow, we should spread heaven\'s grace so benevolence reaches all things.',
    idiomatic: '"—so heaven\'s grace must ease the burden.',
  },
  s0134: {
    literal: 'We hear Hunan and Guizhou are the Ling route\'s choke points; all circuits\' troops and transport pass through—post stations and supply strain the people further; they deserve special favor.',
    idiomatic: '"Hunan and Guizhou on the Ling route deserve special funds—',
  },
  s0135: {
    literal: 'Tan and Gui circuits each receive thirty thousand strings to aid army funds and also to fund post-station interest capital.',
    idiomatic: '"—thirty thousand strings each for Tan and Gui.',
  },
  s0136: {
    literal: 'Jiangling, Jiangxi, and Ezhou circuits compared with Tan and Gui have lighter corvée; Let each circuit\'s observation commissioner weigh urgency and set capital per this precedent.',
    idiomatic: '"Let Jiangling, Jiangxi, and Ezhou set post capital by local burden."',
  },
  s0137: {
    literal: 'Within Li and Yun west of Yongzhou, because of the barbarian raid there were mutual killings; let this circuit gather and bury the dead and set libations as appropriate.',
    idiomatic: '"Bury and mourn the dead west of Yong."',
  },
  s0138: {
    literal: 'Xuzhou\'s customs are fierce and its soldiers strong; because control was misapplied disturbances recurred.',
    idiomatic: '"Xuzhou\'s fierce soldiers need fair rule—',
  },
  s0139: {
    literal: 'Recently the commission was restored over four prefectures; labor and rest are balanced and hearts are at ease.',
    idiomatic: '"—restored command has calmed four prefectures.',
  },
  s0140: {
    literal: 'But we hear that when the commission was abolished some guilty men fled; though edicts repeatedly forgave all, they may still fear and hide in mountains, ultimately to err.',
    idiomatic: '"—yet fugitives may still hide; recruit them for Yong\'s defense—',
  },
  s0141: {
    literal: 'The frontier is not yet calm and talent is urgently needed; let the Xu-Si regimental commissioner select three thousand guards for Yong garrison.',
    idiomatic: '"—three thousand Xu-Si troops for Yong until peace returns."',
  },
  s0142: {
    literal: 'When Lingnan affairs are settled they may rotate home.',
    idiomatic: '"Rotate them home when Lingnan is calm."',
  },
  s0143: {
    literal: 'Still order that every five hundred recruited, a military officer escorts them; grain and rewards follow precedent.',
    idiomatic: '"Escort every five hundred with grain per precedent."',
  },
  s0144: {
    literal: 'Huainan and the two Zhe circuits\' sea transport suffered raiders blocking ships; merchants lost livelihoods and officials indulged them—harm was deep.',
    idiomatic: '"Sea transport losses and official indulgence harmed Huainan and the two Zhe circuits—',
  },
  s0145: {
    literal: 'Some dumped cargo at the waterfront with no guard and much was lost; complaints filled the roads.',
    idiomatic: '"—unwatched cargo was lost along the roads.',
  },
  s0146: {
    literal: 'Let the three circuits report rice moved to salt patrol yards and hire merchant ships to share the voyage.',
    idiomatic: '"—report grain to salt patrol and hire merchant hulls together."',
  },
  s0147: {
    literal: 'When the loaded rice is sufficient, do not further seize or falsely claim storage.',
    idiomatic: '"Do not seize beyond the loaded quota."',
  },
  s0148: {
    literal: 'Small boats at the river mouth are the commission\'s own—do not take merchant boats again.',
    idiomatic: '"Commission boats at the mouth suffice—do not seize merchant craft."',
  },
  s0149: {
    literal: 'If officials abuse power, severe punishment is certain.',
    idiomatic: '"Official abuse will meet severe punishment."',
  },
  s0150: {
    literal: 'Alas!',
    idiomatic: 'The edict closed with lament.',
  },
  s0151: {
    literal: 'When the myriad regions are not secure, can we forget self-reproach?',
    idiomatic: '"When the realm is unsafe we must reproach ourselves—',
  },
  s0152: {
    literal: 'When the people are insufficient, how dare we slacken self-blame?',
    idiomatic: '"—and when the people suffer we must blame ourselves."',
  },
  s0153: {
    literal: 'Thus we extend compassionate care and show diligent concern.',
    idiomatic: '"—thus we extend compassionate care and show diligent toil." Thus ended the edict.',
  },
  s0154: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the fifth-month grace edict.',
  },
  s0155: {
    literal: 'On renchen an order made Secretariat Vice Director and Grand Councillor Yang Shou Secretariat Vice Director and concurrent Minister of Punishments; Secretariat Vice Director and Grand Councillor Cao Que also Minister of Works; Vice Minister of War and Grand Councillor Gao Cong Secretariat Vice Director and in government—the rest unchanged.',
    idiomatic: 'On renchen Yang Shou, Cao Que, and Gao Cong were shuffled among secretariat posts.',
  },
  s0156: {
    literal: 'Autumn, seventh month, renzi: Extended Treasury commissioner Xiahou Zi memorialized: Salt-and-iron and Households had long owed the Extended Treasury more than 3.69 million strings and bolts before Xian-tong 4.',
    idiomatic: 'In renzi Xiahou Zi reported millions owed the Extended Treasury from Households and salt-and-iron.',
  },
  s0157: {
    literal: 'Households each year should deliver 264,180 strings and bolts; from Dazhong 12 through Xian-tong 4 September, aside from payments delivered, 1,505,714 remained owed.',
    idiomatic: 'Households yearly owed 264,180; over 1.5 million remained after partial pay-in.',
  },
  s0158: {
    literal: 'Households yearly owed 264,180; from Dazhong 12 through Xian-tong 4 September, aside from payments, 1.505 million remained owed.',
    idiomatic: 'Households still owed over 1.5 million after partial payments.',
  },
  s0159: {
    literal: 'Because Households\' debt was great we memorialized to cut fifteen cash per eighty-cash discount coin from each circuit\'s salt yards for the commissioner.',
    idiomatic: 'He had asked fifteen cash per discount coin from salt yards.',
  },
  s0160: {
    literal: 'Though the edict ran, delivery was slow.',
    idiomatic: 'Delivery lagged despite the edict.',
  },
  s0161: {
    literal: 'Now Households\' document says aside from discount coin and silk there are miscellaneous goods inconvenient for Extended Treasury collection; beg this year\'s quota paid at once.',
    idiomatic: 'Households now wanted this year\'s quota in coin and silk at once.',
  },
  s0162: {
    literal: 'Prior debt should wait until resources allow gradual payment.',
    idiomatic: 'Older debt could wait for gradual payment.',
  },
  s0163: {
    literal: 'The fifteen-cash cut remains with this office.',
    idiomatic: 'The fifteen-cash cut would stay with his office.',
  },
  s0164: {
    literal: 'Also for years Lingnan campaigns drew heavily on Households funds.',
    idiomatic: 'Lingnan war had long drained Households.',
  },
  s0165: {
    literal: 'This office does not insist on old debt; per Households\' plan this year\'s quota must be full; next year restore the old twice-yearly deadlines.',
    idiomatic: 'He would not press old debt if this year\'s quota was met.',
  },
  s0166: {
    literal: 'Prior arrears let Households set its own repayment schedule.',
    idiomatic: 'Households could schedule older arrears.',
  },
  s0167: {
    literal: 'The edict approved.',
    idiomatic: 'The throne assented.',
  },
  s0168: {
    literal: 'In the tenth month on bingchen Secretariat drafting officer Li Wei was made acting director of the Rites examination.',
    idiomatic: 'Li Wei oversaw the examination in the tenth month.',
  },
  s0169: {
    literal: 'On yiyou Datong defense commissioner Lu Jianfang was made Acting Minister of Works, Cangzhou prefect, Censor-in-Chief, and Yichang military and Cang-Ji-De observation commissioner.',
    idiomatic: 'Lu Jianfang took Cangzhou and Yichang on yiyou.',
  },
  s0170: {
    literal: 'On yiwei Vice Minister of War Xiao Zhi became Grand Councillor with his former title.',
    idiomatic: 'Xiao Zhi joined the council on yiwei.',
  },
  s0171: {
    literal: 'Xian-tong 6, year Xian-tong 6 duplicated in the source—first month, guimao new moon.',
    idiomatic: 'Xian-tong 6 opened on guimao.',
  },
  s0172: {
    literal: 'On dinghai an order made Hedong military commissioner, Acting Minister of Punishments Kong Wenyu Yanzhou prefect, Tianping military and Yan-Cao-Di observation commissioner.',
    idiomatic: 'Kong Wenyu left Hedong for Yanzhou and Tianping on dinghai.',
  },
  s0173: {
    literal: 'In the second month an order made Censor-in-Chief Xu Shang Vice Minister of War and Grand Councillor.',
    idiomatic: 'Xu Shang joined the council in the second month.',
  },
  s0174: {
    literal: 'Gao Cong left government.',
    idiomatic: 'Gao Cong left the council.',
  },
  s0175: {
    literal: 'Minister of Personnel Cui Shenyou, Vice Minister Zheng Congdang, Vice Minister Wang Duo, Vice Director of War Cui Jin, and Zhang Yanyuan examined macro-words candidates;',
    idiomatic: 'Cui Shenyou, Zheng Congdang, Wang Duo, Cui Jin, and Zhang Yanyuan examined macro-words candidates;',
  },
  s0176: {
    literal: 'Vice Director of Revenue Zhang Yisi and Vice Minister of Justice Dong Yun examined outstanding candidates.',
    idiomatic: 'Zhang Yisi and Dong Yun examined outstanding candidates.',
  },
  s0177: {
    literal: 'Drafting officer Yang Yan was made Vice Minister of Works, soon summoned as Hanlin academician.',
    idiomatic: 'Yang Yan became vice minister of works and entered the Hanlin.',
  },
  s0178: {
    literal: 'In the fourth month Jiannan West military commissioner Niu Cong memorialized completion of new cities An and Yue and the border fort at Ezhou.',
    idiomatic: 'Niu Cong reported new border forts in the fourth month.',
  },
  s0179: {
    literal: 'At the time Nanzhao barbarians invaded Yao and Yun; Chen Xu general Yan Fu garrisoned the two new Yun cities.',
    idiomatic: 'Nanzhao raided Yao and Yun while Yan Fu held the new Yun forts.',
  },
  s0180: {
    literal: 'That autumn the Six Surname barbarians attacked Ezhou and were defeated by Fu and withdrew.',
    idiomatic: 'Six Surname tribes attacked Ezhou and were beaten back that autumn.',
  },
  s0181: {
    literal: 'Vice Minister of War and Grand Councillor Xu Shang and Xiao Zhi became Secretariat Vice Directors in government.',
    idiomatic: 'Xu Shang and Xiao Zhi became secretariat vice directors.',
  },
  s0182: {
    literal: 'In the fifth month Left Assistant Yang Zhiwen was made Henan prefect; Divine Strategy great general Ma Ju was made Qinzhou defense and pacification commissioner; Right Golden Crow great general Li Yan-yuan was made Xia prefect and Shuofang commissioner.',
    idiomatic: 'Yang Zhiwen took Henan; Ma Ju took Qin; Li Yan-yuan took Xia and Shuofang.',
  },
  s0183: {
    literal: 'Annan protector Gao Pian memorialized a great defeat of Linyi barbarians at Yong.',
    idiomatic: 'Gao Pian reported crushing Linyi at Yong.',
  },
  s0184: {
    literal: 'In the seventh month Right Guard great general Xue Guan was made Acting Minister of Works, Xuzhou prefect, and Xu-Si regimental observation and defense commissioner.',
    idiomatic: 'Xue Guan took Xuzhou in the seventh month.',
  },
  s0185: {
    literal: 'In the ninth month Secretariat drafting officer Zhao Qi was made acting director of the Rites examination;',
    idiomatic: 'Zhao Qi oversaw the examination in the ninth month;',
  },
  s0186: {
    literal: 'Vice Minister of Personnel Xiao Fang was made Acting Minister of Rites, Hua prefect, Censor-in-Chief, and Yicheng military and Zheng-Hua observation commissioner.',
    idiomatic: 'Xiao Fang took Hua and Yicheng.',
  },
  s0187: {
    literal: 'In the twelfth month Grand Empress Dowager Zheng died with posthumous title Xiaoming.',
    idiomatic: 'Grand Empress Dowager Zheng died as Xiaoming in the twelfth month.',
  },
  s0188: {
    literal: 'That autumn Gao Pian advanced from Haimen, broke the barbarian army, and recovered Annan prefecture.',
    idiomatic: 'That autumn Gao Pian recovered Annan from Haimen.',
  },
  s0189: {
    literal: 'Since Li Zhuo\'s misrule Jiaozhi had been lost ten years; barbarians raided north into Yong and Rong and people could not live—now the old territory was restored.',
    idiomatic: 'Ten years after Li Zhuo, Annan was restored and the border breathed again.',
  },
  s0190: {
    literal: 'Xian-tong 7, year Xian-tong 7 duplicated in the source—spring, first month, wuyin new moon: because of the Grand Empress Dowager\'s mourning the New Year audience was canceled.',
    idiomatic: 'Xian-tong 7 canceled New Year for the grand empress dowager\'s mourning.',
  },
  s0191: {
    literal: 'In the third month Chengde military commissioner Wang Shao-yi died; he was posthumously made Grand Tutor.',
    idiomatic: 'Wang Shao-yi of Chengde died and was posthumously made grand tutor in the third month.',
  },
  s0192: {
    literal: 'He was Shao-ding\'s younger brother, both sons of Princess Shou\'an.',
    idiomatic: 'He was Shao-ding\'s brother and Princess Shou\'an\'s son.',
  },
  s0193: {
    literal: 'The three armies made Shao-ding\'s son Jingchong provisional commander.',
    idiomatic: 'The armies backed Jingchong as provisional commander.',
  },
  s0194: {
    literal: 'Youzhou\'s Zhang Yunshen was advanced to concurrent Grand Protector and Grand Councillor and enfeoffed Duke of Yan.',
    idiomatic: 'Zhang Yunshen became grand protector, councillor, and Duke of Yan.',
  },
  s0195: {
    literal: 'Vice Minister of Personnel Zheng Congdang was made Acting Minister of Rites, concurrent Taiyuan prefect, northern capital defender, Censor-in-Chief, and Hedong observation commissioner.',
    idiomatic: 'Zheng Congdang took Taiyuan and Hedong.',
  },
  s0196: {
    literal: 'In the fourth month Princess Shou\'an memorialized requesting audience; an edict: "Zhi-xing\'s memorial that because Jingchong lacks an edict of grace you wish to come to court is understood.',
    idiomatic: 'Princess Shou\'an begged audience; the edict noted Jingchong awaited grace—',
  },
  s0197: {
    literal: 'Jingchong is known for filial piety and has righteous conduct; he bears the three armies\' love and the thousand-li frontier\'s charge.',
    idiomatic: '"—Jingchong is filial and loved by the armies—',
  },
  s0198: {
    literal: 'He continues the old fief and has excellent plans; the court rewards ability and will act in turn.',
    idiomatic: '"—he holds the old fief with sound plans; the court will reward merit in due course.',
  },
  s0199: {
    literal: 'Because Empress Dowager Xiaoming\'s park tomb nears completion, affairs pause; after enshrinement your sincere request will be granted.',
    idiomatic: '"—wait until Xiaoming\'s enshrinement, then your request will be granted."',
  },
  s0200: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict to Princess Shou\'an.',
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
