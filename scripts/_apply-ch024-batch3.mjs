#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: 'They brought in Daoist priests and Buddhist monks of learning to debate mixed with the Erudites; after a long time it ceased.',
    idiomatic: 'Learned Daoists and monks were set to debate the Erudites until the practice was dropped.',
  },
  s0202: {
    literal: 'In the third month, day dingchou, of Zhenguan 14, Taizong visited the Directorate of Studies and personally observed the libation ceremony.',
    idiomatic: 'Zhenguan 14, third month dingchou: Taizong visited the Directorate and watched the libation rites.',
  },
  s0203: {
    literal: 'Libation-offering Director Kong Yingda lectured on the Classic of Filial Piety; Taizong asked Yingda: "Among the Master\'s disciples, Zeng and Min were both styled greatly filial—why now is only Zeng expounded and not Min? Why?"',
    idiomatic: 'Director Kong Yingda lectured on the Filial Classic; Taizong asked why only Zeng, not Min, was taught though both were called greatly filial.',
  },
  s0204: {
    literal: '" He replied: "Zeng was filial and whole; only Zeng could reach fulfillment."',
    idiomatic: 'Yingda said Zeng\'s filial piety was complete and he alone had fully attained it.',
  },
  s0205: {
    literal: '" The imperial pronouncement rebutted: "We have heard in the Family Sayings: Zeng Xi had Zeng Shen hoe melons and he mistakenly cut the root; Xi was angry, took a great staff to strike his back, and his hand fell to the ground; he ceased breathing and then revived."',
    idiomatic: 'The emperor cited the Family Sayings: Zeng Xi beat Zeng Shen for cutting a melon root until the son collapsed and revived.',
  },
  s0206: {
    literal: 'Confucius heard it and told the disciples: "When Shen comes, do not admit him."',
    idiomatic: 'Confucius told his disciples not to let Shen in.',
  },
  s0207: {
    literal: '\' Later Zengzi requested audience; Confucius said: \'In Shun\'s serving his parents, when they sent him he was always at their side;',
    idiomatic: 'When Shen sought him, Confucius said Shun stayed at his parents\' side when sent for;',
  },
  s0208: {
    literal: 'when they wished to kill him he could not be reached."',
    idiomatic: 'when they wished to kill him he was not there to be killed.',
  },
  s0209: {
    literal: 'A small staff he would accept; a great staff he would flee."',
    idiomatic: 'he took a light beating but fled a heavy one.',
  },
  s0210: {
    literal: 'Now Shen before his father offered his body to await violent rage and trapped his father in unrighteousness—no filial impiety is greater."',
    idiomatic: 'Shen, by submitting to his father\'s rage, had implicated him in wrong—the worst filial impiety.',
  },
  s0211: {
    literal: 'From this speaking, who is superior to Min Ziqian?',
    idiomatic: 'Who, then, was the better son—Shen or Min Ziqian?',
  },
  s0212: {
    literal: '" Yingda could not reply."',
    idiomatic: 'Yingda had no answer.',
  },
  s0213: {
    literal: 'Taizong also told the attendant ministers: "The various Ru each produce divergent ideas—all are not the sages\' basic purport in discussing filial piety."',
    idiomatic: 'Taizong told his ministers that scholarly disputes missed the sages\' true teaching on filial piety.',
  },
  s0214: {
    literal: 'Filial piety is doing well by parents, disciplining the family and punishing the state, being loyal to one\'s lord, brave in battle array, trustworthy to friends, making a name and displaying kin—this is called filial piety.',
    idiomatic: 'Filial piety means serving parents, ordering home and state, loyalty, battlefield courage, trust among friends, and bringing honor to one\'s kin.',
  },
  s0215: {
    literal: 'It is fully in the classics, yet those who discourse mostly depart from the text and go far outside the matter; using this as teaching is toilsome and not law—what is called the Way of filial piety!',
    idiomatic: 'All this is in the classics, yet commentators stray from the text; such teaching is laborious and lawless—not filial piety at all.',
  },
  s0216: {
    literal: '" In the twenty-first year an edict said: "Zuo Qiuming, Bu Zixia, Gongsun Gao, Guliang Chi, Fu Sheng, Gaotang Sheng, Dai Sheng, Mao Chang, Kong Anguo, Liu Xiang, Zheng Zhong, Du Zichun, Ma Rong, Lu Zhi, Zheng Xuan, Fu Qian, He Xiu, Wang Su, Wang Bi, Du Yu, Fan Ning, and Jia Kui—twenty-two seats in all—in spring and autumn at the two mid-season months perform the libation ceremony."',
    idiomatic: 'Year 21: twenty-two canonical scholars were enshrined for spring and autumn libation rites at the two mid-season months.',
  },
  s0217: {
    literal: '" At first the Ru officials themselves served as sacrifice masters, directly stating the Erudite\'s name and announcing to the Former Sage."',
    idiomatic: 'Initially Ru officials led the rite, naming the Erudite who announced to the Former Sage.',
  },
  s0218: {
    literal: 'Prefectural and county libation ceremonies also had the Erudite as master.',
    idiomatic: 'County and prefectural libations likewise used Erudites as masters of ceremony.',
  },
  s0219: {
    literal: 'Jingzong and others again memorialized:',
    idiomatic: 'Jingzong and others memorialized again:',
  },
  s0220: {
    literal: 'According to the "Wen Wang Shizi" chapter of the Book of Rites: In all schools, in spring the director releases the libation to his former teacher."',
    idiomatic: 'They cited the Rites: each school\'s spring director performs libation to his former teacher.',
  },
  s0221: {
    literal: '" Zheng\'s commentary says: "Director means the directors of the Odes, Documents, Rites, and Music."',
    idiomatic: 'Zheng Zhu explained "director" as the Odes, Documents, Rites, and Music officers.',
  },
  s0222: {
    literal: '" That refers to the four seasons\' schools; when about to study the Way, therefore Ru officials perform libation each to his teacher."',
    idiomatic: 'Seasonal schools libated to each instructor before studying his subject.',
  },
  s0223: {
    literal: 'It is not the form practiced at the national academy, so it does not reach the Former Sage.',
    idiomatic: 'That was not the national academy rite and did not involve the Former Sage.',
  },
  s0224: {
    literal: 'As for the spring and autumn days when music is combined, then the Son of Heaven inspects the school, orders the relevant offices to manage rank, and thereupon sacrifices in aggregate to the Former Sage and Former Teacher.',
    idiomatic: 'At the spring and autumn combined-music days the emperor inspected the school and sacrificed together to the Former Sage and Teacher.',
  },
  s0225: {
    literal: 'Qin and Han libation ceremonies have no text that can be checked.',
    idiomatic: 'Qin and Han libation practice leaves no checkable record.',
  },
  s0226: {
    literal: 'As for Cao of Wei, he had the Director of Ritual perform the affair.',
    idiomatic: 'Cao Cao had the Director of Ritual conduct it.',
  },
  s0227: {
    literal: 'From Jin and Song downward there were times of personal performance, yet academy officers presiding over sacrifice entirely lacked canonical substance.',
    idiomatic: 'After Jin and Song emperors sometimes attended, but academy officers leading sacrifice had no real precedent.',
  },
  s0228: {
    literal: 'Moreover it is called the national academy; music uses suspended bells; libation vessels and august regalia are all provided by the offices—in the hands of subordinates, by principle they should not monopolize it.',
    idiomatic: 'The national academy used full court music and regalia—subordinates should not monopolize the rite.',
  },
  s0229: {
    literal: 'Besides, for even minor spirits envoys are still sent to perform rites; libation being classed as middle sacrifice, by principle one must receive command.',
    idiomatic: 'Even minor spirits received imperial envoys; middle-grade libation required imperial commission.',
  },
  s0230: {
    literal: 'Now we request that for national-academy libation the Director of the Directorate of Studies be first offering, the prayer saying "The emperor respectfully dispatches," and still order the Vice Director as second offering and the Directorate Erudite as final offering.',
    idiomatic: 'They asked the Directorate Director to make the first offering with prayer "The emperor respectfully dispatches," the Vice Director second, and the Erudite third.',
  },
  s0231: {
    literal: 'For prefectural schools the prefect is first offering, the senior aide second offering, and the Erudite final offering.',
    idiomatic: 'Prefectural schools: prefect first, senior aide second, Erudite third.',
  },
  s0232: {
    literal: 'For county schools the magistrate is first offering, the assistant second offering; since the Erudite has no rank, we request the chief clerk and the district captain jointly as final offering.',
    idiomatic: 'County schools: magistrate first, assistant second; the clerk and district captain jointly third, the Erudite having no rank.',
  },
  s0233: {
    literal: 'If there are vacancies, all are to be filled in order by substitution.',
    idiomatic: 'Vacancies were to be filled by the next officer in order.',
  },
  s0234: {
    literal: 'For prefectural and county libation, since we request each prefect and magistrate personally to offer as chief sacrificer, we hope to follow community-altar sacrifice in likewise granting bright garments.',
    idiomatic: 'Local libations with prefects and magistrates presiding should grant bright garments as at community-altar rites.',
  },
  s0235: {
    literal: 'Revise and attach to the ritual code as an eternal rule.',
    idiomatic: 'The changes were to be codified permanently.',
  },
  s0236: {
    literal: 'In the seventh month of Xianqing 2 of Gaozong, Minister of Rites Xu Jingzong and others deliberated: "According to the code, the Duke of Zhou is Former Sage and Confucius is Former Teacher."',
    idiomatic: 'Xianqing 2, month 7: Xu Jingzong ruled that the Duke of Zhou was Former Sage and Confucius Former Teacher.',
  },
  s0237: {
    literal: 'Also the Book of Rites says: "When first establishing a school, release libation to the Former Sage."',
    idiomatic: 'The Rites required libation to the Former Sage when a school was founded.',
  },
  s0238: {
    literal: 'Zheng Xuan\'s commentary says: \'Such as the Duke of Zhou and Confucius.\'',
    idiomatic: 'Zheng Xuan glossed this as the Duke of Zhou and Confucius.',
  },
  s0239: {
    literal: '" Moreover the Duke of Zhou ascended the throne and his merit matched emperors and kings; we request he be associated with King Wu."',
    idiomatic: 'The Duke of Zhou had equaled emperors; they asked to pair him with King Wu.',
  },
  s0240: {
    literal: 'Take Confucius as Former Sage."',
    idiomatic: 'Confucius alone was to be Former Sage.',
  },
  s0241: {
    literal: '" In the second year the schools of Documents, Mathematics, and Law were abolished.',
    idiomatic: 'Year 2: the Documents, Mathematics, and Law schools were abolished.',
  },
  s0242: {
    literal: 'In the first month of Longshuo 2, at the eastern capital were established one each of Directorate vice-director, registrar, and recorder; four-gate assistant instructors and Erudites; three hundred four-gate students; and two hundred four-gate distinguished scholars.',
    idiomatic: 'Longshuo 2: the eastern capital Directorate gained new officers, four-gate faculty, three hundred students, and two hundred distinguished scholars.',
  },
  s0243: {
    literal: 'In the second month the schools of Law and of Documents and Mathematics were restored.',
    idiomatic: 'Second month: Law, Documents, and Mathematics schools were restored.',
  },
  s0244: {
    literal: 'In the third year Documents was subordinated to the Orchid Terrace, Mathematics to the Secretariat Archive Bureau, and Law to the Detailed Punishments Office.',
    idiomatic: 'Year 3: Documents went to the Orchid Terrace, Mathematics to the Archive, Law to Detailed Punishments.',
  },
  s0245: {
    literal: 'In the first month of Qianfeng 1, Gaozong returning from the eastern feng sacrifice halted at Zou county, sacrificed to the Venerable Father, and enfeoffed him as Grand Preceptor.',
    idiomatic: 'Qianfeng 1: returning from the feng, Gaozong sacrificed to Confucius at Zou and made him Grand Preceptor.',
  },
  s0246: {
    literal: 'In the second month of Zongzhang 1 the crown prince Hong visited the national academy, performed libation, and enfeoffed Yan Hui as Junior Tutor to the Heir Apparent and Zeng Shen as Junior Protector to the Heir Apparent.',
    idiomatic: 'Zongzhang 1: Crown Prince Hong libated at the academy and enfeoffed Yan Hui and Zeng Shen as heir tutors.',
  },
  s0247: {
    literal: 'In the fifth month of Yifeng 3 an edict said: "From now onward the Classic of the Way and Its Power is also a supreme classic; candidates for tribute and selection must all be versed in it."',
    idiomatic: 'Yifeng 3: the Daodejing became a supreme classic required of examination candidates.',
  },
  s0248: {
    literal: 'The remaining classics and the Analects may follow the usual forms."',
    idiomatic: 'Other classics and the Analects followed the usual rules.',
  },
  s0249: {
    literal: 'In the third year of Empress Zetian\'s Tianshou era the Duke of Zhou was posthumously enfeoffed as King of Commending Virtue and Confucius as Duke of Elevating the Way.',
    idiomatic: 'Tianshou 3: the Duke of Zhou became King of Commending Virtue; Confucius became Duke of Elevating the Way.',
  },
  s0250: {
    literal: 'In Changshou 2 of Zetian she personally composed two scrolls of "Tracks for Ministers," ordering candidates for tribute and selection to take it as their study, and stopped the Laozi.',
    idiomatic: 'Changshou 2: Zetian\'s Tracks for Ministers replaced the Laozi in the curriculum.',
  },
  s0251: {
    literal: 'In Shenlong 1 Tracks for Ministers was stopped and study of the Laozi resumed.',
    idiomatic: 'Shenlong 1: Tracks for Ministers was dropped and the Laozi restored.',
  },
  s0252: {
    literal: 'With a hundred households of Zou and Lu enfeoffing the Duke of Elevating the Way, posthumous title Wén Xuān.',
    idiomatic: 'A hundred households in Zou and Lu supported the duke, posthumously titled Wén Xuān.',
  },
  s0253: {
    literal: 'On the eighth month, day dingsi, of Jingyun 2 of Ruizong the crown prince performed libation at the Imperial Academy.',
    idiomatic: 'Jingyun 2, eighth month dingsi: the crown prince libated at the Imperial Academy.',
  },
  s0254: {
    literal: 'In the first month of Taiji 1 an edict said: "The temple of the Venerable Father Confucius—order the native prefecture to repair it and take thirty nearby households to supply sweeping."',
    idiomatic: 'Taiji 1: Confucius\'s temple was to be repaired and thirty households assigned to maintain it.',
  },
  s0255: {
    literal: '"',
    idiomatic: 'The edict closed.',
  },
  s0256: {
    literal: 'In the tenth month, day wuyin, of Kaiyuan 7 the crown prince went to the national academy and performed the cap-and-armor ceremony by age.',
    idiomatic: 'Kaiyuan 7, tenth month: the crown prince performed the age-order cap ceremony at the academy.',
  },
  s0257: {
    literal: 'In Kaiyuan 11, for spring and autumn libation at the two seasons, prefectures should follow the old use of ox and sheep victims; subordinate counties used only wine and dried meat.',
    idiomatic: 'Kaiyuan 11: prefectures kept full victims for libation; counties used only wine and dried meat.',
  },
  s0258: {
    literal: 'In the first month of the nineteenth year, for spring and autumn community-altar and libation at the two seasons, all prefectures and counties under Heaven stopped ox and sheep victims and used only wine and dried meat as an eternal rule; in the third month of the twenty-fourth year tribute selection was first moved, dispatching Vice Minister of Rites Yao Yi to request that jinshi candidates be examined on pasted passages from the Zuo Commentary and Book of Rites, passing five to graduate.',
    idiomatic: 'Kaiyuan 19: local libations and community rites were limited to wine and dried meat; in year 24 jinshi began posting on the Zuo Commentary and Rites, five passes to graduate.',
  },
  s0259: {
    literal: 'In the third month of the twenty-fifth year an edict said: "For mingjing from now on, paste ten and pass five or more;"',
    idiomatic: 'Year 25: mingjing candidates had to pass five of ten pasted classics.',
  },
  s0260: {
    literal: 'oral questioning on great principles ten items, take six passed or more;"',
    idiomatic: 'and six of ten oral questions on great principles.',
  },
  s0261: {
    literal: 'still answer three current-affairs policy questions, taking those with rough coherence as graduates."',
    idiomatic: 'plus three policy essays of rough coherence.',
  },
  s0262: {
    literal: 'Jinshi stopped pasting minor classics and should follow the mingjing precedent in examining major classics, paste ten and pass four, then examine miscellaneous writings and policy; when finished, seal the examined miscellaneous writings and policy and send to the Secretariat and Chancellery for detailed review."',
    idiomatic: 'Jinshi dropped minor classics, posted on major ones four of ten, then essays and policy for Secretariat review.',
  },
  s0263: {
    literal: '" In the first month of the twenty-sixth year an edict said: "When prefectural tribute presentations are concluded, order them led to the Directorate of Studies to visit the Former Teacher; academy officers open lectures for them, question doubtful meanings, and the relevant offices set out food."',
    idiomatic: 'Year 26: after local tribute selections, candidates visited the Former Teacher at the Directorate for lectures and feasting.',
  },
  s0264: {
    literal: 'Students of the Hongwen and Chongwen institutes and those within the Directorate who had passed selection were also permitted to participate."',
    idiomatic: 'Hongwen, Chongwen, and qualifying Directorate students could join.',
  },
  s0265: {
    literal: '" That day sacrifice to the Former Sage and below was like the libation ceremony.',
    idiomatic: 'That day they sacrificed to the Former Sage as at libation.',
  },
  s0266: {
    literal: 'Eastern-palace fifth rank and below and assembly envoys came to the Directorate to observe the rites; it then became a constant form, performed every year down to the present.',
    idiomatic: 'Palace and assembly envoys watched; the practice became annual.',
  },
  s0267: {
    literal: 'At the beginning, in Kaiyuan 8, Directorate Vice Director Li Yuanjin memorialized: "In the Former Sage the Venerable Father Confucius\'s temple, the Former Teacher Yanzi has an associated seat; now his image stands in attendance—associated enjoyment should sit."',
    idiomatic: 'Kaiyuan 8: Li Yuanjin asked seated images for Yan Hui and seated association for the Ten Wise Ones.',
  },
  s0268: {
    literal: 'The Ten Wise disciples, though again having images arrayed in the temple hall, did not participate in enjoyment of sacrifice."',
    idiomatic: 'The Ten Wise had images but no sacrificial share.',
  },
  s0269: {
    literal: 'We respectfully check the cult code: He Xiu, Fan Ning, and the other twenty-two worthies still partake of follow-sacrifice; we hope at spring and autumn libation to array enjoyment above the twenty-two worthies."',
    idiomatic: 'Twenty-two later scholars still had follow-sacrifice; the Ten Wise should rank above them.',
  },
  s0270: {
    literal: 'The seventy disciples—we request following the old capital Directorate hall in picturing them on the walls and also establishing eulogies, that perhaps we may encourage Ru wind and glorify the sage\'s majesty."',
    idiomatic: 'The seventy disciples should be painted on the walls with eulogies to encourage learning.',
  },
  s0271: {
    literal: 'Zeng Shen and others have a Way and learning that can be honored; they alone received the classic from the Master—we hope to follow the twenty-two worthies in advance of enjoyment."',
    idiomatic: 'Zeng Shen and others who studied directly under the Master should join the twenty-two in sacrifice.',
  },
  s0272: {
    literal: '" An edict changed Yan Sheng and the other Ten Wise to seated images, all participating in follow-sacrifice."',
    idiomatic: 'An edict seated the Ten Wise and gave them follow-sacrifice.',
  },
  s0273: {
    literal: 'Zeng Shen\'s great filial piety and virtue crowned his row; specially a sculpted image was made, seated next after the Ten Wise."',
    idiomatic: 'Zeng Shen was given a special seated image after the Ten Wise for his filial piety.',
  },
  s0274: {
    literal: 'The seventy disciples and twenty-two worthies were painted on the temple walls.',
    idiomatic: 'Seventy disciples and twenty-two scholars were painted on the walls.',
  },
  s0275: {
    literal: 'Because Yanzi is Second Sage, the emperor personally composed his eulogy and had it written on stone.',
    idiomatic: 'The emperor inscribed Yan Hui\'s eulogy in stone as Second Sage.',
  },
  s0276: {
    literal: 'From Min Sun downward, he ordered the current court literati to divide and compose eulogies.',
    idiomatic: 'Court writers composed eulogies for the other disciples.',
  },
  s0277: {
    literal: 'In the eighth month of the twenty-seventh year an edict was again issued:',
    idiomatic: 'Year 27, eighth month: a new edict declared:',
  },
  s0278: {
    literal: 'To expand our royal transformation lies in Ru learning.',
    idiomatic: 'Royal transformation depended on Confucian learning.',
  },
  s0279: {
    literal: 'Who can unfold this Way and enlighten the teeming folk—since living men have been, there has been none like the Master.',
    idiomatic: 'No teacher had equaled the Master in enlightening mankind.',
  },
  s0280: {
    literal: 'What is called self-so from Heaven, about to be sage and many in ability, virtue matching Heaven and Earth, body raising sun and moon.',
    idiomatic: 'Heaven-born, multitalented, his virtue matched cosmos and sun and moon.',
  },
  s0281: {
    literal: 'Therefore he could establish the great root of all under Heaven and complete the great warp of all under Heaven, beautify government and teaching, shift customs, lord and minister each as lord and minister, father and son each as father and son—people to this day receive his gift.',
    idiomatic: 'He set the foundations of order, civilized government, and right relations—mankind still lives by his gift.',
  },
  s0282: {
    literal: 'Is it not abundant!',
    idiomatic: 'How abundant his legacy!',
  },
  s0283: {
    literal: 'Ah!',
    idiomatic: 'Alas!',
  },
  s0284: {
    literal: 'The King of Chu did not enfeoff him; the Duke of Lu did not employ him—making the great sage rank only as a companion minister, lingering as a traveler—it can be known.',
    idiomatic: 'Unenfeoffed by Chu and unused by Lu, the sage had been only a companion minister and wanderer.',
  },
  s0285: {
    literal: 'Years and sacrifices gradually distant, his luminous spirit ever more manifest—though each age had praise, it was not yet lofty veneration, not matching the reality—what will people say?',
    idiomatic: 'His fame had grown, yet honors still fell short of his stature.',
  },
  s0286: {
    literal: 'We with slight virtue reverently received the precious mandate, thinking to unfold civilization and broadly cover Huaxia.',
    idiomatic: 'The emperor claimed modest merit yet sought to spread civilization across China.',
  },
  s0287: {
    literal: 'The times then differed from past and present; feeling each time weighed on teachers and models.',
    idiomatic: 'Times had changed, but respect for teachers deepened.',
  },
  s0288: {
    literal: 'Having already practiced his teaching, we should display his virtue.',
    idiomatic: 'His teaching was practiced; his virtue must be displayed.',
  },
  s0289: {
    literal: 'Thereupon we extend the great rites and bear forth the emblematic plan.',
    idiomatic: 'Grand rites would proclaim his merit.',
  },
  s0290: {
    literal: 'The Master already being called Former Sage may be posthumously enfeoffed as King Wén Xuān.',
    idiomatic: 'Confucius was posthumously enfeoffed as King Wén Xuān.',
  },
  s0291: {
    literal: 'It is fitting to order the Three Excellencies to hold credentials and confer the patent; for all connected with the patent and sacrifice the relevant offices should quickly choose the day and also draft ritual notes and submit.',
    idiomatic: 'The Three Excellencies were to confer the patent; offices were to fix dates and ritual protocols.',
  },
  s0292: {
    literal: 'At the Wén Xuān tomb and the old residence establish a temple, measure and add persons for sweeping, to display sincere reverence.',
    idiomatic: 'Temples at his tomb and birthplace were staffed for sweeping and reverence.',
  },
  s0293: {
    literal: 'His later heirs may be enfeoffed as Duke Wén Xuān.',
    idiomatic: 'His descendants could hold the title Duke Wén Xuān.',
  },
  s0294: {
    literal: 'As for distinguishing correct position and fixing place, it is set forth in the ritual classics—if one does not obtain the place, how show the model?',
    idiomatic: 'Rites required correct placement to set a model.',
  },
  s0295: {
    literal: 'Formerly because the Duke of Zhou faced south and the Master sat west, now the positions already having difference, how can sitting be as of old? We should repair the fallen canon and eternally make it a form.',
    idiomatic: 'The Master should face south like a king, not sit west as before the Duke of Zhou.',
  },
  s0296: {
    literal: 'From now onward at the Directorate of Studies in the two capitals the Master all faces south and sits; the Ten Wise and others attend east and west in rows.',
    idiomatic: 'In both capitals Confucius was seated facing south with the Ten Wise flanking him.',
  },
  s0297: {
    literal: 'All prefectures under Heaven also follow this.',
    idiomatic: 'All prefectures followed suit.',
  },
  s0298: {
    literal: 'Moreover among three thousand disciples those called the Ten Wise embraced the crowd\'s beauties and truly surpassed peers.',
    idiomatic: 'The Ten Wise among three thousand disciples surpassed their peers.',
  },
  s0299: {
    literal: 'Expanding the dark sage\'s wind and rule, opening human relations\' ears and eyes—all should be praised and enfeoffed to favor the worthy and bright.',
    idiomatic: 'They should be honored to spread the sage\'s teaching and enlighten human relations.',
  },
  s0300: {
    literal: 'Yanzi Yuan already being called Second Sage must have his rank made superior; he may be enfeoffed as Duke of Yan.',
    idiomatic: 'Yan Hui as Second Sage was enfeoffed as Duke of Yan.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
