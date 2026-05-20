#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: 'On guichou an edict: "When remonstrance officials debate affairs and their views differ, joint petitions with signed names resemble coordinated accusation."',
    idiomatic: 'On guichou an edict barred remonstrators from joint-signed petitions except on major policy.',
  },
  s0402: {
    literal: '"Henceforth in all public debate each shall follow his own view and may not sign names together."',
    idiomatic: '"Each must state his own view; collective signatures were forbidden."',
  },
  s0403: {
    literal: '"When great policy is memorialized, joint signature is permitted."',
    idiomatic: '"Great-policy memorials could still be jointly signed."',
  },
  s0404: {
    literal: 'An edict also stripped posthumously from former Left Army Vice Commander Chou Shiliang his prior grants and mourning titles; his household property was confiscated.',
    idiomatic: 'The edict also posthumously stripped Chou Shiliang\'s ranks and confiscated his estate.',
  },
  s0405: {
    literal: 'After Shiliang\'s death eunuchs found thousands of weapons at his home — also because old crimes were exposed.',
    idiomatic: 'Eunuchs found thousands of weapons in his house after his death, reopening old crimes.',
  },
  s0406: {
    literal: 'An edict demoted again Silver-Green Grandee, Lizhou prefect, Pillar of State, Duke of Anping with two thousand households Cui Gong to Enzhou acting staff member — Gong, while overseeing salt and iron, owed the Song-Hua office ninety million strings.',
    idiomatic: 'Cui Gong was banished to Enzhou for a ninety-million-string salt debt from his monopoly tenure.',
  },
  s0407: {
    literal: 'The Emperor ordered Revenue, Salt and Iron, and Transport merged into one commissioner.',
    idiomatic: 'Revenue, salt, and transport were consolidated under one commissioner.',
  },
  s0408: {
    literal: 'Seventh month: Huainan military commissioner, acting Minister of Works Du Cong was made Right Vice Director, concurrent Secretariat Vice Director, Grand Councillor, still overseeing Revenue, and salt-and-transport commissioner.',
    idiomatic: 'In the seventh month Du Cong became right vice director and grand councillor with the salt monopoly.',
  },
  s0409: {
    literal: 'An edict: Silver-Green Grandee, Right Vice Director, concurrent Secretariat Vice Director, Grand Councillor, overseer of national history, Pillar of State, Duke of Zhao with two thousand households Li Shen was made acting Minister of Works, Grand Councillor, Yangzhou metropolitan governor, and Huainan deputy military commissioner in charge of the circuit.',
    idiomatic: 'Li Shen took Huainan and the council seal as acting minister of works.',
  },
  s0410: {
    literal: 'The Ministry of Personnel memorialized that central and local offices should cut one thousand one hundred fourteen posts.',
    idiomatic: 'Personnel proposed cutting more than eleven hundred posts empire-wide.',
  },
  s0411: {
    literal: 'Wang Yuankui memorialized that Xingzhou prefect Pei Wen and adjutant Gao Yuanwu surrendered the city.',
    idiomatic: 'Wang Yuankui reported Xingzhou had surrendered.',
  },
  s0412: {
    literal: 'Luozhou prefect Wang Zhao and Cizhou prefect An Yu surrendered their cities to He Hongjing.',
    idiomatic: 'Luozhou and Cizhou also surrendered to He Hongjing.',
  },
  s0413: {
    literal: 'The three eastern provinces were pacified.',
    idiomatic: 'The three Shandong prefectures were pacified.',
  },
  s0414: {
    literal: 'Lu prefecture generals Guo Yi, Zhang Gu, and Chen Yangting sent men to Wang Zai\'s army asking to kill Zhen to redeem themselves.',
    idiomatic: 'Lu generals offered to kill Zhen if Wang Zai would spare them.',
  },
  s0415: {
    literal: 'Wang Zai reported it; an edict ordered Shi Xiong to lead seven thousand troops into Lu; Yi beheaded Liu Zhen\'s head to welcome Xiong — Ze, Lu, and five other prefectures were pacified.',
    idiomatic: 'Shi Xiong entered Lu; Guo Yi sent Zhen\'s head and five prefectures fell.',
  },
  s0416: {
    literal: 'Eighth month, wuxu: Wang Zai forwarded Zhen\'s head with Guo Yi and one hundred fifty others; a victory bulletin was presented at the capital; the Emperor received captives at Anfu Gate; the hundred officials hailed him before the tower.',
    idiomatic: 'On wuxu Wang Zai\'s victory train reached Chang\'an; Wuzong received captives at Anfu Gate.',
  },
  s0417: {
    literal: 'Weibo military commissioner, acting Right Vice Director, Grand Councillor He Hongjing was advanced to Duke of Lujiang with two thousand households;',
    idiomatic: 'He Hongjing became Duke of Lujiang.',
  },
  s0418: {
    literal: 'Chengde military commissioner Wang Yuankui was made acting Minister of Works, concurrent Heir-apparent Junior Preceptor, Grand Councillor, advanced to Duke of Taiyuan with two thousand households.',
    idiomatic: 'Wang Yuankui became duke of Taiyuan and entered the council.',
  },
  s0419: {
    literal: 'Grand Councillor Li Deyu was made Grand Preceptor, advanced to Duke of Weiguo, household increased one thousand.',
    idiomatic: 'Li Deyu became grand preceptor and Duke of Weiguo.',
  },
  s0420: {
    literal: 'Vice Minister of War, Hanlin academician-in-chief Cui Xuan was made Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'Cui Xuan joined the Grand Council from the Hanlin.',
  },
  s0421: {
    literal: 'Hedong military commissioner Chen Yixing died.',
    idiomatic: 'Chen Yixing died at Hedong.',
  },
  s0422: {
    literal: 'Ninth month: Tiande army commander, Jin-He campaign commissioner Shi Xiong was made acting Minister of War, Hezhong metropolitan governor, concurrent Censor-in-Chief, and Hezhong-Jin-He-Ci-Li military commissioner.',
    idiomatic: 'Shi Xiong took Hezhong and the Jin-He command.',
  },
  s0423: {
    literal: 'Former Shannan East military commissioner Lu Jun was made acting Left Vice Director, Lu metropolitan governor, Zhaoyi military commissioner, and Ze-Lu-Xing-Luo observation commissioner.',
    idiomatic: 'Lu Jun received Zhaoyi and the Lu prefecture.',
  },
  s0424: {
    literal: 'Zhongwu military commissioner, Chen-Xu-Cai observation and disposition commissioner, Heyang campaign commissioner, Gold-Purple Grandee, acting Right Vice Director, concurrent Censor-in-Chief, Pillar of State, Duke of Taiyuan with two thousand households Wang Zai was made acting Minister of Works, Taiyuan metropolitan governor, northern capital regent, and Hedong military commissioner.',
    idiomatic: 'Wang Zai became Hedong regent and acting minister of works.',
  },
  s0425: {
    literal: 'An edict said: "The rebel Guo Yi and others — fox-and-rat demons nesting in hill burrows;',
    idiomatic: '"Rebels like Guo Yi," the edict began, "were vermin in their dens;',
  },
  s0426: {
    literal: 'cattle and sheep that grow fiercer with grass and water.',
    idiomatic: 'beasts that grew bold with pasture and stream."',
  },
  s0427: {
    literal: 'Long following traitors, all bore rebellious air.',
    idiomatic: 'They had long served traitors and breathed rebellion.',
  },
  s0428: {
    literal: 'Liu Congjian turned his back on virtue and righteousness, hid villains and treachery, piled defiant plots — all the schemes of intimate clerks.',
    idiomatic: 'Liu Congjian\'s defiance and hidden plots were the work of his inner circle.',
  },
  s0429: {
    literal: 'Liu Gongzhi, An Qingqing, and others each relied on terrain and repeatedly resisted the royal army, always with reckless words, never thinking to reform.',
    idiomatic: 'Liu Gongzhi and An Qingqing held the passes and refused to submit.',
  },
  s0430: {
    literal: 'Moreover Guo Yi and Wang Xie, hearing Xing and Luo had submitted, feared righteous troops would overturn their nest, sold the wicked child to save themselves, and held the strong city begging mercy.',
    idiomatic: 'Guo Yi and Wang Xie sold Zhen\'s heir and begged mercy when Xing and Luo fell.',
  },
  s0431: {
    literal: 'In old times Wu Bei went to the magistrate and still could not escape execution;',
    idiomatic: 'Wu Bei surrendered and still died;',
  },
  s0432: {
    literal: 'Yan Cen came out and submitted, yet his clan was also exterminated.',
    idiomatic: 'Yan Cen\'s clan was wiped out despite his surrender.',
  },
  s0433: {
    literal: 'To impose the great punishment leaves no room for shame.',
    idiomatic: 'Capital punishment was owed without remorse."',
  },
  s0434: {
    literal: 'Guo Yi, Liu Gongzhi, Wang Xie, An Qingqing, Li Daode, Li Zuoyao, Liu Zhen, Zhen\'s mother A Pei, Zhen\'s younger brothers Cao Jiu, Manlang, Junlang, sisters Fourth Daughter and Fifth Daughter, cousins Hongqing, Hanqing, Zhouqing, Luqing, Kuangyao, Zhang Gu\'s son Ya, Jiechou, Chen Yangting\'s younger brother Xuan, son Chounu, Zhang Yi\'s son Huanlang, Sanbao, retainers Zhen Ge, wonder-workers Guo Shen, Jiang Dang, Li Xun\'s elder brother Zhongjing, Wang Ya\'s grandnephew Yu, Han Yue\'s sons Maozhang and Maobao, Wang Fan\'s son Gui, and others were all executed at Solitary Willow.',
    idiomatic: 'Guo Yi, Liu Gongzhi, Wang Xie, the Zhen family, Zhang Gu, Chen Yangting, retainers, and accomplices were beheaded at Solitary Willow.',
  },
  s0435: {
    literal: 'An edict made the Heyang three-cities suppression commissioner into Mengzhou, detached Zezhou to it, with Huai, Meng, and Ze as a circuit named Heyang.',
    idiomatic: 'Heyang circuit was reorganized with Mengzhou and Zezhou.',
  },
  s0436: {
    literal: 'An edict made the imperial son E Prince with opening privileges, Xia prefect, and Shuofang military commissioner-in-chief.',
    idiomatic: 'Prince E was sent to Xia and Shuofang with full honors.',
  },
  s0437: {
    literal: 'At the time the Tangut rebelled; a prince was ordered to restrain them.',
    idiomatic: 'A Tangut revolt prompted a princely command on the frontier.',
  },
  s0438: {
    literal: 'Tenth month: the carriage visited E county.',
    idiomatic: 'In the tenth month the court visited E county.',
  },
  s0439: {
    literal: 'Eleventh month: visited Yunyang.',
    idiomatic: 'In the eleventh month it visited Yunyang.',
  },
  s0440: {
    literal: 'Twelfth month, edict: "The suburban sacrifice draws near; prisoners are many; cases concluded often overturn."',
    idiomatic: 'A twelfth-month edict ordered swift closure of prisoners before the suburban rites.',
  },
  s0441: {
    literal: 'All prisoners held in the two capitals and circuits whose cases were concluded or who had twice confessed after reversal were to be finally judged and reported first.',
    idiomatic: 'Closed cases and double-confessed prisoners were to be sentenced at once.',
  },
  s0442: {
    literal: 'At the time Left Vice Director Wang Qi had for years overseen the examinations; after each session ended and the list was posted, he again presented it to the chief ministers for approval.',
    idiomatic: 'Wang Qi still routed examination lists through the premiers for approval.',
  },
  s0443: {
    literal: 'Later, with few candidates, the chief ministers discussed at Yanying: "The chief examiner tests arts; he should not let the chief ministers decide pass or fail.',
    idiomatic: 'Premiers argued examiners, not councillors, should pass candidates.',
  },
  s0444: {
    literal: 'Recently examinations have been hard and few passed — this may not be the way to seek talent broadly."',
    idiomatic: '"Too few pass now — that is no way to find talent," they said.',
  },
  s0445: {
    literal: 'The Emperor said: "The examination hall does not grasp my intent.',
    idiomatic: 'Wuzong said the examiners missed his intent.',
  },
  s0446: {
    literal: 'If they do not pass my sons\' protégés, that is excessive; whether sons of ministers or poor scholars, take only real talent."',
    idiomatic: '"Pass real talent, not just ministerial sons — but do not shut out my men entirely."',
  },
  s0447: {
    literal: 'Li Deyu replied: "Zheng Su and Feng Ao have worthy sons who dare not sit the examination."',
    idiomatic: 'Li Deyu noted worthy sons of Zheng Su and Feng Ao feared to test.',
  },
  s0448: {
    literal: 'The Emperor said: "I lately heard the Yang Yuqing brothers banded with the powerful and blocked commoners\' paths.',
    idiomatic: 'Wuzong cited the Yang Yuqing clique\'s favoritism.',
  },
  s0449: {
    literal: 'Yesterday Yang Zhizhi, Zheng Pu, and the like were all struck from the list — only to curb them."',
    idiomatic: '"I struck Yang Zhizhi and Zheng Pu from the list to curb that excess."',
  },
  s0450: {
    literal: 'Deyu said: "Your servant has no examination degree and ought not speak ill of jinshi.',
    idiomatic: 'Deyu demurred: without a degree he should not judge jinshi.',
  },
  s0451: {
    literal: 'Yet your servant\'s grandfather in the Tianbao era, with no other skill for office, forced himself into the quota and passed in one attempt.',
    idiomatic: 'His grandfather had forced one Tianbao pass without other skill.',
  },
  s0452: {
    literal: 'Afterward he kept no Wenxuan in the household — he hated its ancestors\' love of ornament without rooted craft.',
    idiomatic: 'The family thereafter shunned the Wenxuan and its ornamental style.',
  },
  s0453: {
    literal: 'Yet court eminent officials must be sons of dukes and ministers.',
    idiomatic: '"Yet high office still belongs to ministerial sons," he said.',
  },
  s0454: {
    literal: 'Why?',
    idiomatic: '"Why?"',
  },
  s0455: {
    literal: 'From childhood they practice the examination curriculum, naturally know court affairs, terrace etiquette, and row standards — formed without teaching.',
    idiomatic: 'They grew up inside court ritual and examination drill.',
  },
  s0456: {
    literal: 'Poor scholars with outstanding talent, after passing, only then reach one grade and one rank — they cannot be practiced.',
    idiomatic: 'Poor scholars learn rank only after they pass.',
  },
  s0457: {
    literal: 'Thus when sons of families achieve fame, it cannot be lightly regarded."',
    idiomatic: '"So ministerial sons who pass cannot be lightly dismissed."',
  },
  s0458: {
    literal: 'Huichang 5, first month, jiyou new moon: an edict built the Terrace of Gazing for Immortals at the southern suburban altar.',
    idiomatic: 'On jiyou of Huichang 5\'s first month work began on the Gazing-for-Immortals terrace.',
  },
  s0459: {
    literal: 'At the time the Daoist Zhao Guizhen enjoyed special favor; remonstrance officials memorialized; discussion reached Yanying.',
    idiomatic: 'Remonstrators attacked Zhao Guizhen\'s favor at Yanying.',
  },
  s0460: {
    literal: 'The Emperor told the chief ministers: "When remonstrance officials discuss Zhao Guizhen, I want you to know my mind.',
    idiomatic: 'Wuzong told his premiers to understand his mind on Zhao Guizhen.',
  },
  s0461: {
    literal: 'In the palace I have nothing to do and have put away music — I only want this man to talk the Way."',
    idiomatic: '"I have banished music; I only want his conversation."',
  },
  s0462: {
    literal: 'Li Deyu replied: "Your servant dare not speak of former dynasties\' gains and losses — only because Guizhen in Jingzong\'s reign went in and out of the inner palaces, popular feeling does not wish Your Majesty to draw near him again."',
    idiomatic: 'Deyu warned that Guizhen had haunted Jingzong\'s inner quarters.',
  },
  s0463: {
    literal: 'The Emperor said: "I already knew this Daoist then, not knowing the name Guizhen — I only called him Master Zhao the Refiner.',
    idiomatic: '"I knew him as Master Zhao the Refiner in Jingzong\'s day," Wuzong said.',
  },
  s0464: {
    literal: 'In Jingzong\'s time he also had no great fault.',
    idiomatic: '"He did little harm then."',
  },
  s0465: {
    literal: 'When I speak with him, it washes vexation.',
    idiomatic: '"He eases my vexation."',
  },
  s0466: {
    literal: 'As for military and state affairs, only you and the secondary audience officials debate — why ask a Daoist?',
    idiomatic: '"State affairs are yours — why ask a Daoist?"',
  },
  s0467: {
    literal: 'Not only one Guizhen — a hundred Guizhens could not confuse me."',
    idiomatic: '"A hundred such men could not sway me."',
  },
  s0468: {
    literal: 'Guizhen, because he touched public debate, then presented the Luofu Daoist Deng Yuanqi, who had arts of long life; the Emperor sent a palace envoy to welcome him.',
    idiomatic: 'Guizhen offered Deng Yuanqi of Luofu; the court sent envoys to fetch him.',
  },
  s0469: {
    literal: 'Hence he bonded with Hengshan Daoist Liu Xuanjing and Guizhen, slandered Buddhism, and the request to demolish temples went forward.',
    idiomatic: 'With Liu Xuanjing he pressed anti-Buddhist temple closures.',
  },
  s0470: {
    literal: 'Chief ministers Li Deyu, Du Cong, Li Rangyi, Cui Xuan, Minister of Rites Sun Jian, and others led the hundred civil and military officials in offering the honorific Benevolent Sagely Martial Literary Heavenly Successful Spirit Virtue Bright Way Emperor.',
    idiomatic: 'Deyu, Du Cong, and the court offered the honorific Benevolent Sagely Martial Literary Heavenly Successful Spirit Virtue Bright Way Emperor.',
  },
  s0471: {
    literal: 'On xinhai the suburban rites were performed; when ritual ended, he took Cheng Tian Gate and proclaimed a great amnesty.',
    idiomatic: 'On xinhai the suburban rites ended with universal amnesty at Cheng Tian Gate.',
  },
  s0472: {
    literal: 'On gengshen the Yi\'an empress dowager died — Jingzong\'s mother.',
    idiomatic: 'On gengshen Jingzong\'s mother, the Yi\'an empress dowager, died.',
  },
  s0473: {
    literal: 'Her testament ordered the Emperor to hear government three days, small mourning on the thirteenth day, great mourning on the twenty-fifth, and release of mourning on the twenty-seventh.',
    idiomatic: 'Her will set a twenty-seven-day mourning schedule.',
  },
  s0474: {
    literal: 'Minister of War Gui Rong memorialized: "Affairs should hit the mean; ritual should follow change; the rites of spirit-tablet placement should have graded differences.',
    idiomatic: 'Gui Rong urged a shortened mourning schedule.',
  },
  s0475: {
    literal: 'I ask to reduce the mourning period, exchanging months for days — release mourning on the twelfth day.',
    idiomatic: 'He proposed twelve days instead of months.',
  },
  s0476: {
    literal: 'Inner and outer officials also please release mourning on that day.',
    idiomatic: 'Officials inside and out should mourn twelve days.',
  },
  s0477: {
    literal: 'Mausoleum regulations — please do not reduce.',
    idiomatic: 'Tomb observances should not be cut.',
  },
  s0478: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0479: {
    literal: 'Former Taiyuan military commissioner, acting Minister of Works Li Shi was made eastern capital regent in his present rank.',
    idiomatic: 'Li Shi became Luoyang regent.',
  },
  s0480: {
    literal: 'Second month, wuyin new moon: Venus covered the north side of the Pleiades.',
    idiomatic: 'On wuyin Venus veiled the Pleiades\' northern horn.',
  },
  s0481: {
    literal: 'Remonstrance official acting Minister of Rites examiner Chen Shang chose thirty-seven candidates to pass; public opinion held it was patronage; the Emperor ordered Hanlin academician Bai Minzhong to re-examine and struck Zhang Du, Li Yu, Xue Chen, Zhang Di, Cui Lin, Wang Chen, Liu Bochu, and seven others.',
    idiomatic: 'Bai Minzhong\'s re-exam struck seven of Chen Shang\'s thirty-seven passes as patronage.',
  },
  s0482: {
    literal: 'Third month: Cui Xuan left the council and went out as Shan-Guo observation commissioner.',
    idiomatic: 'Cui Xuan left the council for Shan-Guo.',
  },
  s0483: {
    literal: 'Censor-in-Chief, concurrent Vice Minister of War Li Hui was made Grand Councillor in his original posts.',
    idiomatic: 'Li Hui joined the council from the censorate.',
  },
  s0484: {
    literal: 'Summer, fourth month: the fourth imperial daughter was enfeoffed Princess of Yanqing; the fifth as Princess of Jingle.',
    idiomatic: 'Two princesses were enfeoffed in the fourth month.',
  },
  s0485: {
    literal: 'An edict ordered the Ministry of Rites to tally temples and monks and nuns empire-wide.',
    idiomatic: 'Rites was ordered to count every temple and cleric.',
  },
  s0486: {
    literal: 'In all, temples four thousand six hundred, hermitages forty thousand, monks and nuns two hundred sixty thousand five hundred.',
    idiomatic: 'The tally found 4,600 temples, 40,000 hermitages, and 260,500 clerics.',
  },
  s0487: {
    literal: 'Grand Councillor Du Cong left the council.',
    idiomatic: 'Du Cong left the council.',
  },
  s0488: {
    literal: 'Vice Minister of Revenue, acting Revenue overseer Cui Yuanshi was made Grand Councillor.',
    idiomatic: 'Cui Yuanshi joined the council from Revenue.',
  },
  s0489: {
    literal: 'Sixth month, bingzi, edict: "From Han and Wei onward, great court policy had to go to the dukes and ministers for detailed debate, broadly seeking the Way, to exhaust popular feeling.',
    idiomatic: 'A sixth-month edict revived Han-Wei consultation on law and ritual.',
  },
  s0490: {
    literal: 'Thus government had constants and people faced the Way.',
    idiomatic: '"So policy had roots and the people had a path."',
  },
  s0491: {
    literal: 'Hereafter when ritual and law are involved and popular feeling is doubtful, let the originating office report to the Secretariat Directorate and send ritual officials to deliberate.',
    idiomatic: 'Doubtful ritual cases must pass through the directorate and ritual officers.',
  },
  s0492: {
    literal: 'If criminal cases, first let the judge deliberate in detail, then report to Punishments for review.',
    idiomatic: 'Criminal cases must be judged before Punishments reviews them.',
  },
  s0493: {
    literal: 'If a bureau official or censor can refute or cite classics and historical precedents with precise argument, promote and reward him.',
    idiomatic: 'Able refuters among censors and bureau men were to be promoted.',
  },
  s0494: {
    literal: 'If words are ornamental and without canonical basis, do not report upward."',
    idiomatic: '"Ornamental argument without canon was not to reach the throne."',
  },
  s0495: {
    literal: 'The Divine Strategy army reported repair of the Terrace of Gazing for Immortals and five hundred thirty-nine corridor rooms completed.',
    idiomatic: 'The Divine Strategy army finished the Gazing-for-Immortals terrace and 539 rooms.',
  },
  s0496: {
    literal: 'Autumn, seventh month, gengzi: an edict merged and cut temples empire-wide.',
    idiomatic: 'On gengzi an edict ordered empire-wide temple mergers.',
  },
  s0497: {
    literal: 'The Secretariat memorialized: "According to regulations, on the state mourning day of upper prefectures officials burn incense at temples; each upper prefecture and major command should keep one temple with imperial portraits moved inside;',
    idiomatic: 'The Secretariat proposed keeping one portrait temple per upper prefecture.',
  },
  s0498: {
    literal: 'lower-prefecture temples are all abolished.',
    idiomatic: 'Lower prefectures were to lose all temples.',
  },
  s0499: {
    literal: 'In the two capitals\' upper and eastern wards ten temples are requested, ten monks each."',
    idiomatic: 'The two capitals might keep ten temples with ten monks each."',
  },
  s0500: {
    literal: 'Edict: "Upper prefectures should keep temples whose craftsmanship is exquisite; if ruined, they should also be destroyed.',
    idiomatic: 'Wuzong ordered fine upper-prefecture temples kept and ruined ones destroyed.',
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
