#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.019, Yizong / Xizong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'On the ninth month, bingchen day, an edict made Right Remonstrance Grandee, Acting Secretariat Vice Director, concurrent Minister of Punishments, Grand Councillor, Academician of the Hall of Assembled Worthies, Upper Pillar of State, Marquis of Pengcheng with a thousand-household fief and purple-gold fish bag Liu Zhan Acting Minister of Punishments and Grand Councillor, concurrent Jiangling prefect, Jingnan military commissioner and related posts.',
    idiomatic: 'In the ninth month, on bingchen, Liu Zhan—grand councillor and secretariat vice director—was demoted to acting punishments minister and Jingnan commander at Jiangling.',
  },
  s0502: {
    literal: 'Hanlin academician, Vice Minister of Revenue, drafting edicts, Upper Pillar of State with purple-gold fish bag Zheng Tian was made Wuzhou prefect;',
    idiomatic: 'Hanlin academician Zheng Tian was banished to Wuzhou;',
  },
  s0503: {
    literal: 'Right Remonstrance Grandee, Censor-in-Chief, Upper Pillar of State with purple-gold fish bag Sun Huang was made Tingzhou prefect;',
    idiomatic: 'Censor-in-Chief Sun Huang to Tingzhou;',
  },
  s0504: {
    literal: 'Candidate for Office, Right Remonstrance Official, Pillar of State with purple-gold fish bag Gao Xiang was made Gaozhou prefect;',
    idiomatic: 'Remonstrance official Gao Xiang to Gaozhou;',
  },
  s0505: {
    literal: 'Palace Gentleman for Attendance, Bureau of Review director, drafting edicts, Pillar of State with purple-gold fish bag Yang Zhizhi was made Qiongzhou vice prefect;',
    idiomatic: 'Yang Zhizhi to Qiongzhou as vice prefect;',
  },
  s0506: {
    literal: 'Candidate for Office, Acting Director of Rites, Wei Shan was made Chunzhou vice prefect;',
    idiomatic: 'Wei Shan to Chunzhou;',
  },
  s0507: {
    literal: 'Court Gentleman for Consultation, Acting Vice Director of War, judging Revenue and Expenditure cases, Pillar of State Zhang Yan was made Bozhou registrar;',
    idiomatic: 'Zhang Yan to Bozhou as registrar;',
  },
  s0508: {
    literal: 'Court Gentleman for Consultation, Acting Vice Director of Punishments, Pillar of State Cui Yanrong was made Leizhou registrar;',
    idiomatic: 'Cui Yanrong to Leizhou;',
  },
  s0509: {
    literal: 'All were punished for closeness to Liu Zhan and driven out by Wei Baohang.',
    idiomatic: 'All were punished as Liu Zhan\'s allies, expelled by Wei Baohang.',
  },
  s0510: {
    literal: 'Capital Intendant Wen Zhang was demoted to Zhenzhou vice prefect; the night the edict issued, Zhang took poison and died.',
    idiomatic: 'Capital Intendant Wen Zhang took poison the night his banishment to Zhenzhou was announced.',
  },
  s0511: {
    literal: 'Liu Zhan was again demoted to Kangzhou prefect.',
    idiomatic: 'Liu Zhan was driven further—to Kangzhou.',
  },
  s0512: {
    literal: 'Tenth month: Supervising Secretary Xue Neng was made Capital Intendant; Secretariat Drafting Officer Gao Shi was made acting examiner for the Rites recruitment.',
    idiomatic: 'In the tenth month Xue Neng became capital intendant and Gao Shi ran the civil-service examinations.',
  },
  s0513: {
    literal: 'Eleventh month, jiwei new moon.',
    idiomatic: 'The eleventh month opened on jiwei.',
  },
  s0514: {
    literal: 'On xinhai an edict made Minister of Rites Wang Duo Grand Councillor in his original office.',
    idiomatic: 'On xinhai Wang Duo joined the Grand Council as minister of rites.',
  },
  s0515: {
    literal: 'On dingmao an order: "Xuzhou lies in the Pei plain; its army is naturally fierce—a true stronghold of the realm, fitting the pattern of enfeoffed might.',
    idiomatic: 'On dingmao an edict declared: "Xuzhou lies on the Pei plain; its garrison is fierce—the realm\'s stronghold, fit for a feudal command—',
  },
  s0516: {
    literal: 'Its mountains and rivers have always been distinct, its customs very prosperous; how could we wish to demote and humble it and blunt its flourishing?',
    idiomatic: '"—and its land is prosperous; we will not demote it and blunt its strength.',
  },
  s0517: {
    literal: 'Only because in recent years disaster ripened into trouble, or at times into disorder, was guilt invited by their own acts—not calamity sent by Heaven.',
    idiomatic: '"Recent troubles were the mutineers\' own doing, not Heaven\'s curse.',
  },
  s0518: {
    literal: 'Guilin\'s mutinous soldiers repeatedly plotted rebellion; the people were scorched for a full year from first to last.',
    idiomatic: '"Guilin\'s rebels tormented the people for a year.',
  },
  s0519: {
    literal: 'They killed and wounded the common folk and defiled the loyal—unspeakable—until we cut them down; therefore its command title was lowered and it was placed under a neighboring circuit.',
    idiomatic: '"After slaughtering loyal subjects we lowered its command and placed it under another circuit.',
  },
  s0520: {
    literal: 'Recently, since great armies came, famine years followed in succession; soldiers and commoners alike deeply shame their past error and wish to restore the old regulations and again hope for a military commission.',
    idiomatic: '"Now soldiers and townsfolk repent and beg their old commission back.',
  },
  s0521: {
    literal: 'We constantly think deeply and long for a little peace; we specially show generous favor and restore its army designation.',
    idiomatic: '"We restore Xuzhou\'s army designation in mercy.',
  },
  s0522: {
    literal: 'It is fitting to grant one hundred thousand bolts of silk from the Imperial Treasury store to aid their feasting and rewards—surely abundance will be complete.',
    idiomatic: '"Grant one hundred thousand bolts of treasury silk for feasting and rewards."',
  },
  s0523: {
    literal: 'Its Xuzhou Metropolitan Training Commissioner is changed to Ganhua Army military commissioner and Xu-Su-Hao-Si observation and disposition commissioner and related posts.',
    idiomatic: 'Xuzhou became the Ganhua Army with Xu-Su-Hao-Si under its observation.',
  },
  s0524: {
    literal: '" Vice Minister of Personnel Zheng Congdang was made Acting Minister of Revenue, concurrent Bianzhou prefect and censor-in-chief, Xuanyi Army military commissioner, replacing Li Wei;',
    idiomatic: 'Zheng Congdang replaced Li Wei at Xuanyi; ',
  },
  s0525: {
    literal: 'Wei was made Acting Minister of Personnel, Yangzhou metropolitan prefect, concurrent Huainan defense vice commissioner and acting military commissioner.',
    idiomatic: 'Li Wei moved to Huainan.',
  },
  s0526: {
    literal: 'Xiantong 12, first month, wushen: Grand Councillor Lu Yan led the civil and military officials in offering the honorific Sage of Sagely Culture, Martial Brilliance, Bright Virtue, Supreme Benevolence, Great Sagacity, and Broad Filial Piety; the Emperor attended Hanyuan Hall.',
    idiomatic: 'In Xiantong 12\'s first month Lu Yan led officials in offering Yizong a grand honorific at Hanyuan Hall.',
  },
  s0527: {
    literal: 'When the enfeoffment rites ended, a great amnesty.',
    idiomatic: 'The enfeoffment ended with universal amnesty.',
  },
  s0528: {
    literal: 'On xinyou the Princess of Weiguo was buried at Shaoling plateau.',
    idiomatic: 'On xinyou the Princess of Weiguo was buried at Shaoling.',
  },
  s0529: {
    literal: 'Earlier an edict had ordered the hundred officials to compose dirges; Wei Baohang was still to draft the spirit-way stele, Capital Intendant Xue Neng to be outer custodian, Attendant Yang Fujing inner custodian—the ceremony very grand; the Emperor and Consort Guo Shufei attended at Yanxing Gate to weep and send her off.',
    idiomatic: 'Officials had composed dirges; Wei Baohang drafted the spirit stele while the Emperor and Consort Guo wept at Yanxing Gate.',
  },
  s0530: {
    literal: 'Youzhou military commissioner Zhang Yunshen was ill and requested his son Jianhui as defense vice commissioner with acting command of troops; the edict assented.',
    idiomatic: 'Ill, Zhang Yunshen named his son Jianhui acting Youzhou commander; the court assented.',
  },
  s0531: {
    literal: 'Third month: Minister of Personnel Xiao Ye and Vice Minister Gui Renhui and Li Dang were examiners;',
    idiomatic: 'In the third month Xiao Ye, Gui Renhui, and Li Dang examined candidates;',
  },
  s0532: {
    literal: 'Director of Seals Zheng Shaoye and Vice Director of War Lu Xun and others examined the macrocosmic examination candidates.',
    idiomatic: 'Zheng Shaoye and Lu Xun examined the macrocosmic candidates.',
  },
  s0533: {
    literal: 'Fourth month: Left Vice Director, Secretariat Vice Director, Grand Councillor Lu Yan was made Acting Minister of Works, concurrent Chengdu prefect, Jiannan West circuit military commissioner and related posts.',
    idiomatic: 'In the fourth month Lu Yan left the capital for Jiannan West.',
  },
  s0534: {
    literal: 'Fifth month, gengshen: an order: "Careful handling of criminal prisons is a great maxim of the Changes.',
    idiomatic: 'In the fifth month an edict on prisons cited the Changes:',
  },
  s0535: {
    literal: 'The Analects says: if you grasp the facts of the case, pity and do not rejoice.',
    idiomatic: '"The Analects: grasp the facts, then pity—do not rejoice."',
  },
  s0536: {
    literal: 'Yet prison clerks are harsh, bent on twisting the text; guarding officials are perfunctory, rarely hearing cases in person.',
    idiomatic: '"Clerks twist texts; magistrates rarely hear cases."',
  },
  s0537: {
    literal: 'Thus those in shackles overflow the jail;',
    idiomatic: '"Shackled prisoners overflow the jails;"',
  },
  s0538: {
    literal: 'those in pursuit are tied to documents.',
    idiomatic: '"pursuers are tied to paperwork."',
  },
  s0539: {
    literal: 'It truly injures harmonious qi and thereby brings pestilential vapors.',
    idiomatic: '"This injures harmony and breeds pestilence."',
  },
  s0540: {
    literal: 'Moreover the season is scorching heat; transformation should first be lush growth—we pardon crimes together to accord with generation.',
    idiomatic: '"In scorching summer, pardon crimes to accord with growth."',
  },
  s0541: {
    literal: 'All prisoners under detention empire-wide, except the ten abominations, disobedience, deliberate homicide, compounding poison, armed robbery, and opening graves, should all be reviewed and released.',
    idiomatic: '"Release all but capital crimes empire-wide."',
  },
  s0542: {
    literal: 'If they trusted clerks and many were detained on fabricated grounds, when investigation finds it, the circuit observation commissioner, judge, and prefectural officials must be punished to warn negligence.',
    idiomatic: '"Punish officials who fabricate detentions."',
  },
  s0543: {
    literal: 'Within ten days after arrival, quickly review, analyze, and memorialize.',
    idiomatic: '"Report reviews within ten days." Thus ended the edict.',
  },
  s0544: {
    literal: 'The Emperor visited Anguo Temple and bestowed agarwood high seats on lecturing monks.',
    idiomatic: 'The Emperor visited Anguo Temple and gifted lecturing monks agarwood seats.',
  },
  s0545: {
    literal: 'Seventh month, xinchou: Secretariat and Chancellery memorialized: "Per the sixth-month twelfth-day edict reforming memorials on office and uniform requests from circuits and capital agencies.',
    idiomatic: 'In the seventh month the Secretariat reported on reforms to memorials on appointments and uniforms:',
  },
  s0546: {
    literal: 'For circuit memorials on prefectural and county offices—recorders, magistrates, recorders, aides—or those in office with public affairs failing and neglecting management needing replacement, and former incumbents with real merit and current vacancies, each may recommend those known.',
    idiomatic: '"Circuits may recommend two replacements or merit candidates per memorial;"',
  },
  s0547: {
    literal: 'Each circuit memorial may still not exceed two persons.',
    idiomatic: '"not more than two per memorial;"',
  },
  s0548: {
    literal: 'Hedong, Lu prefecture, Binning, Jingyuan, Lingwu, Salt-Xia, Zhenwu, Tiande, Bin-Fang, Cang-De, Yi-Ding, Three Rivers observation and defense commissioners and the five southern circuits—each year besides magistrates and recorders may nominate three registrars, vice prefects of middle and lower prefectures, judges, and assistant magistrates.',
    idiomatic: '"frontier and southern circuits may nominate three lesser officers yearly;"',
  },
  s0549: {
    literal: 'Fuzhou is not within the limit for memorializing county officials.',
    idiomatic: '"Fuzhou is excepted;"',
  },
  s0550: {
    literal: 'For Qianzhong\'s memorialized prefectural and county officials and generals commanding inner officials, handle per the old precedent.',
    idiomatic: '"Qianzhong follows old rules."',
  },
  s0551: {
    literal: 'For capital agencies and circuit officials with concurrent posts memorialized—not timely replacement, examination term unfulfilled—return to original rank.',
    idiomatic: '"Concurrent capital posts revert to original rank if terms unfulfilled;"',
  },
  s0552: {
    literal: 'For military commissioners and metropolitan training and defense commissioners\' subordinate officers memorializing promotion examination posts and surveillance posts—each military affair yearly may nominate five, metropolitan training and defense three, fixed; no further memorials beyond.',
    idiomatic: '"military commissioners nominate five officers yearly, training commissioners three;"',
  },
  s0553: {
    literal: 'From Censor-in-Chief down, per the edict articles, military merit is required before appointment.',
    idiomatic: '"censor posts require verified military merit;"',
  },
  s0554: {
    literal: 'Hereafter if battle merit is clearly established, memorialize with facts; if inspection finds no falsehood, special disposition; beyond that no further memorials.',
    idiomatic: '"battle merit may be memorialized separately;"',
  },
  s0555: {
    literal: 'You, Zhen, and Wei three circuits for now follow the former precedent.',
    idiomatic: '"You, Zhen, and Wei follow former rules." The throne assented.',
  },
  s0556: {
    literal: 'Edict assented.',
    idiomatic: 'The throne assented.',
  },
  s0557: {
    literal: 'Twelfth month: Acting Minister of Revenue, Bianzhou prefect, censor-in-chief, Xuanyi Army military commissioner Zheng Congdang was made Guangzhou prefect, Lingnan East circuit observation and disposition commissioner and related posts.',
    idiomatic: 'In the twelfth month Zheng Congdang went to Lingnan East.',
  },
  s0558: {
    literal: 'Xiantong 13, first month, renyin new moon.',
    idiomatic: 'Xiantong 13 opened on renyin.',
  },
  s0559: {
    literal: 'On jiaxu an edict made Vice Minister of War, judging Revenue and Expenditure Liu Ye Grand Councillor in his original office.',
    idiomatic: 'On jiaxu Liu Ye joined the Grand Council.',
  },
  s0560: {
    literal: 'Youzhou Lulong and related armies military commissioner, Acting Minister of Works, Grand Councillor, Youzhou metropolitan prefect, Upper Pillar of State, Duke of Yan with three-thousand-household fief Zhang Yunshen died; posthumously made Grand Preceptor, posthumous name Loyal and Fierce.',
    idiomatic: 'Zhang Yunshen died; posthumous Grand Preceptor, styled Loyal and Fierce.',
  },
  s0561: {
    literal: 'Yunshen governed Youzhou twenty-three years.',
    idiomatic: 'He had governed Youzhou twenty-three years.',
  },
  s0562: {
    literal: 'Second month: Youzhou牙將 Zhang Gongsu seized acting commander Zhang Jianhui\'s military and civil affairs and declared himself acting commander.',
    idiomatic: 'In the second month Zhang Gongsu ousted Zhang Jianhui at Youzhou.',
  },
  s0563: {
    literal: 'On dingsi an edict made Right Vice Director, Secretariat Vice Director, Grand Councillor Yu Cong Acting Minister of Works, Xiangzhou prefect, Shannan East circuit observation and disposition commissioner and related posts;',
    idiomatic: 'On dingsi Yu Cong went to Shannan East;',
  },
  s0564: {
    literal: 'Censor-in-Chief Zhao Yin was made Vice Minister of Revenue, Grand Councillor in original office.',
    idiomatic: 'Zhao Yin joined the Grand Council as vice minister of revenue.',
  },
  s0565: {
    literal: 'Third month: Minister of Personnel Xiao Ye and Vice Minister Dugu Yun were examiners; Director of Posts Zhao Meng and Vice Director of Chariots Li Chao examined macrocosmic candidates.',
    idiomatic: 'In the third month Xiao Ye and Dugu Yun examined candidates.',
  },
  s0566: {
    literal: 'On examination day Xiao Ye was replaced; Right Assistant Kong Wenyu was made acting judge.',
    idiomatic: 'Kong Wenyu substituted for Xiao Ye on examination day.',
  },
  s0567: {
    literal: 'Fifth month, gengwu new moon.',
    idiomatic: 'The fifth month opened on gengwu.',
  },
  s0568: {
    literal: 'On xinwei an edict demoted Acting Left Vice Director, Acting Left Divine Forest Army commander, censor-in-chief Zhang Zhifang to Kangzhou vice prefect on equal standing, because his subordinates were bandits.',
    idiomatic: 'On xinwei Zhang Zhifang was banished to Kangzhou—his troops had turned bandit.',
  },
  s0569: {
    literal: 'On yihai Imperial University Vice Director Wei Yinyu at the Gate presented a memorial discussing the secret affairs of Consort Shufei\'s younger brother Guo Jingshu.',
    idiomatic: 'On yihai Wei Yinyu memorialized against Consort Shufei\'s brother Guo Jingshu.',
  },
  s0570: {
    literal: 'The Emperor was greatly angered and that day ordered the Capital Intendant to execute Yinyu and confiscate his household.',
    idiomatic: 'The Emperor had Wei Yinyu executed that day and his property confiscated.',
  },
  s0571: {
    literal: 'Yinyu\'s wife Lady Cui, musicians Zheng Yuke and Wang Yanke, maidservants Weiniang, Hongzi, and nine others were assigned to the Inner Court.',
    idiomatic: 'His wife, musicians, and maidservants were sent to the Inner Court.',
  },
  s0572: {
    literal: 'Gate Commissioner Tian Xianqian was stripped of purple and assigned to Qiaoling; Gate Clerk Yan Jingzhi was beaten fifteen and assigned to the Southern Yamen—for receiving Yinyu\'s document.',
    idiomatic: 'Gate officials who handled his memorial were punished.',
  },
  s0573: {
    literal: 'Supervising Secretary Du Yixiu was demoted to Duanzhou vice prefect.',
    idiomatic: 'Du Yixiu was banished to Duanzhou.',
  },
  s0574: {
    literal: 'Secretariat Drafting Officer Cui Hang was made Xunzhou registrar—Yinyu\'s wife\'s brother;',
    idiomatic: 'Cui Hang, Yinyu\'s brother-in-law, went to Xunzhou;',
  },
  s0575: {
    literal: 'Vice Director of the Imperial Stud Cui Yuan was made Yingzhou registrar—Yinyu\'s father-in-law;',
    idiomatic: 'Cui Yuan, his father-in-law, to Yingzhou;',
  },
  s0576: {
    literal: 'former Heyin Yard official Wei Junqing was made Aizhou Chongping defender—Yinyu\'s uncle.',
    idiomatic: 'Wei Junqing, his uncle, to Aizhou.',
  },
  s0577: {
    literal: 'Former Senior Rectifier of the Court of Judicial Review Wan Sili was made Imperial University Vice Director; former Xingyuan Vice Prefect Feng Peng was made Puzhou prefect; former Senior Rectifier Yang Rong was made Changzhou prefect.',
    idiomatic: 'Wan Sili, Feng Peng, and Yang Rong received new posts.',
  },
  s0578: {
    literal: 'On bingzi an edict: Acting Minister of Works, Acting Left Vice Director, concurrent Xiangzhou prefect, censor-in-chief, Shannan West circuit observation commissioner Yu Cong may be Right Remonstrance Grandee, Acting Instructor of the Prince of Pu, Eastern Capital branch office.',
    idiomatic: 'On bingzi Yu Cong was stripped to Pu Wang instructor at the Eastern Capital.',
  },
  s0579: {
    literal: 'On xinsi an edict: Left Assistant Li Dang was demoted to Daozhou prefect; Vice Minister of Personnel Wang Pei to Zhangzhou prefect; Left Regular Attendant Li Yu to Hezhou prefect; former Secretariat Drafting Officer Feng Yanqing to Chaozhou registrar; Hanlin Academician-in-Chief, Vice Minister of War, drafting edicts Zhang Ti to Fengzhou vice prefect; Right Remonstrance Official Yang Dian to Hezhou registrar; Minister of Works Yan Qi to Chenzhou prefect; Supervising Secretary Li Kuang to Qizhou prefect; Supervising Secretary Zhang Duo to Tengzhou prefect; Left Golden Guard General, Left Street Commissioner Li Jingshen to Danzhou registrar; former Qingzhou prefect, Pinglu military commissioner Yu Juan was made Liang Wang household chief, Eastern Capital branch; ',
    idiomatic: 'On xinsi a purge banished Li Dang, Wang Pei, Li Yu, Feng Yanqing, Zhang Ti, Yang Dian, Yan Qi, Li Kuang, Zhang Duo, Li Jingshen, and Yu Juan;',
  },
  s0580: {
    literal: 'former Hunan observation commissioner Yu Gui was made Yuanzhou prefect.',
    idiomatic: 'Yu Gui went to Yuanzhou.',
  },
  s0581: {
    literal: 'Juan and Gui were Yu Cong\'s elder brothers.',
    idiomatic: 'Juan and Gui were Yu Cong\'s brothers.',
  },
  s0582: {
    literal: 'Yu Ai and Yu Ji were also banished.',
    idiomatic: 'Yu Ai and Yu Ji were exiled as well.',
  },
  s0583: {
    literal: 'From Li Dang down, all were Yu Cong\'s kin and party, driven out by Wei Baohang.',
    idiomatic: 'From Li Dang down—all Yu Cong\'s kin—were driven out by Wei Baohang.',
  },
  s0584: {
    literal: 'Tiande defense commissioner, Acting Left Regular Attendant Duan Wenchu was made Yunzhou prefect, Datong Army defense commissioner.',
    idiomatic: 'Duan Wenchu became Datong defender at Yunzhou.',
  },
  s0585: {
    literal: 'Sixth month: Yicheng Army military commissioner, Acting Minister of Works Du Tao memorialized: the Yingzhou monks, Daoists, and commoners of his command jointly requested to retain prefect Zong Hui; the edict said: "Hui is clear and capable in governing people, with his own monthly term; we rely on his pacification and do not yet discuss replacement.',
    idiomatic: 'In the sixth month Du Tao reported Yingzhou\'s plea to keep Zong Hui; the throne refused replacement.',
  },
  s0586: {
    literal: '" Sixth month: Secretariat and Chancellery memorialized: "This month on the seventeenth, at Yanying Hall we received the holy intent to warn all prefectures empire-wide: where there are fugitive households, their tax levies and corvée assignments must not be apportioned onto present households.',
    idiomatic: 'The Secretariat warned prefectures not to apportion fugitives\' taxes onto surviving households:',
  },
  s0587: {
    literal: 'We consider that circuit prefectures, after war or after disaster, with households fled and fields abandoned—Heaven not spreading blessing, the people much in hardship.',
    idiomatic: '"After war and disaster, fields lie abandoned and people suffer;"',
  },
  s0588: {
    literal: 'Villages are repeatedly harried by levies; treasuries thereby exhausted, so that longstanding budget categories mostly hang empty on the registers.',
    idiomatic: '"levies exhaust villages while registers show empty quotas;"',
  },
  s0589: {
    literal: 'Slow collection then lacks for supply; pressing deadlines then presses the poor.',
    idiomatic: '"slow collection starves the state, haste crushes the poor;"',
  },
  s0590: {
    literal: 'Thinking of the withered and weary, our toil is anxious diligence—without a clear edict, who would know the sage\'s thought?',
    idiomatic: '"only a clear edict shows the Emperor\'s care."',
  },
  s0591: {
    literal: 'For fugitive household taxes and miscellaneous corvée, there must be undertaker households before service as before.',
    idiomatic: '"fugitive taxes require undertaker households;"',
  },
  s0592: {
    literal: 'If missing tax quotas are apportioned onto present households, it becomes running debt and doubly traps the people.',
    idiomatic: '"apportioning onto survivors creates debt and double misery;"',
  },
  s0593: {
    literal: 'Or the rich have fields spanning paths while the poor lack even a cone\'s footing—wishing equality truly lies in fairness.',
    idiomatic: '"fairness cannot let the crafty shift burdens between rich and poor;"',
  },
  s0594: {
    literal: 'If the cunning may rise and fall at will, hoping for repair—is it not hard!',
    idiomatic: '"if the crafty control apportionment, repair is impossible."',
  },
  s0595: {
    literal: 'It all depends on chief officials\' full sincerity to make the weary gradually thrive.',
    idiomatic: '"Only sincere magistrates can revive the weary."',
  },
  s0596: {
    literal: 'We have discussed: let all circuit prefectures follow this article—fugitive household taxes and miscellaneous corvée must not be further apportioned onto surviving households.',
    idiomatic: '"Let no circuit apportion fugitive taxes onto survivors;"',
  },
  s0597: {
    literal: 'Strive to recruit and soothe by many means; in this abundant harvest, regain renewal.',
    idiomatic: '"recruit refugees and soothe them in this harvest year;"',
  },
  s0598: {
    literal: 'If peace is achieved, promotion follows of itself; if the edict is not followed, the statutes will be invoked.',
    idiomatic: '"promote those who obey; punish those who do not." The throne assented.',
  },
  s0599: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0600: {
    literal: 'Seventh month: former Yichang Army military commissioner Lu Jianfang was made Director of the Imperial Stud.',
    idiomatic: 'In the seventh month Lu Jianfang became director of the imperial stud.',
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
