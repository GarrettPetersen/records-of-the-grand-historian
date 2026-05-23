#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';

const T = {
  s0401: {
    literal:
      '" Yuan Can, Chu Yuan, Liu Qin, Cai Xingzong, and Shen Youzhi were together entrusted with the regency.',
    idiomatic:
      'Yuan Can, Chu Yuan, Liu Qin, Cai Xingzong, and Shen Youzhi were all named to the regency council.',
  },
  s0402: {
    literal: 'That day the Emperor died in Jingfu Hall, aged thirty-four.',
    idiomatic: 'That same day the Emperor died in Jingfu Hall, at the age of thirty-four.',
  },
  s0403: {
    literal:
      'In the fifth month, on wuyin, he was buried at Gaoning Mausoleum on Mofu Hill in Linyi county.',
    idiomatic:
      'On wuyin in the fifth month he was buried at Gaoning Mausoleum on Mofu Hill in Linyi county.',
  },
  s0404: {
    literal: 'The Emperor from youth was gentle and agreeable, with a dignified and refined bearing.',
    idiomatic: 'From childhood he was gentle and gracious, his bearing dignified and refined.',
  },
  s0405: {
    literal: 'He lost his birth mother early and was raised within the Empress Dowager\'s palace.',
    idiomatic: 'He lost his birth mother young and was raised in the empress dowager\'s palace.',
  },
  s0406: {
    literal:
      'In the Daming era his younger brothers were often suspected, but he alone was treated with affection and regularly attended Empress Dowager Lu in her medicine and care.',
    idiomatic:
      'During the Daming reign his brothers were often suspected, yet he alone remained close to the throne, regularly attending Empress Dowager Lu at her sickbed.',
  },
  s0407: {
    literal:
      'He loved reading and cherished literary principle; while in his princedom he compiled a register of writings from the Eastern Jin onward, and also continued Wei Guan\'s commentary on the Analects in two juan, which circulated in the world.',
    idiomatic:
      'He loved books and literary craft; as a prince he compiled a bibliography of writings since the Eastern Jin, continued Wei Guan\'s two-juan commentary on the Analects, and saw both works circulate.',
  },
  s0408: {
    literal:
      'When he ascended the great throne, the four quarters rebelled; he treated men with broad kindness. For army commanders whose fathers, brothers, or sons had joined the rebellion together, he still entrusted them with palace guards, and his commissions did not shift easily; therefore the masses served him and none failed to exert their strength.',
    idiomatic:
      'Once on the throne he faced rebellion on every side, yet treated men with generous forbearance. Commanders whose kin had risen against him still received palace-guard appointments; his trust did not waver, and they fought for him with all their strength.',
  },
  s0409: {
    literal:
      'When the realm was pacified, rebels were for the most part spared; those with ability were all employed, as if they were old ministers.',
    idiomatic:
      'After the realm was pacified most rebels were spared; the capable were taken into service as though they had always been his ministers.',
  },
  s0410: {
    literal:
      'Men of talent and learning were often brought forward, attending on his literary records and answering at his side.',
    idiomatic:
      'Scholars and men of letters were often advanced to wait on his papers and answer at his side.',
  },
  s0411: {
    literal:
      'At Hanfang Hall in Hualin Park he lectured on the Changes; [35] he often listened in person.',
    idiomatic:
      'He lectured on the Changes at Hanfang Hall in Hualin Park; [35] he often attended in person.',
  },
  s0412: {
    literal:
      'In his later years he favored spirits and ghosts and had many taboos; in speech and documents, words of disaster, defeat, mourning, and suspicious phrases to be avoided numbered in the hundreds and thousands of categories, and violation was always punished with death.',
    idiomatic:
      'In his last years he grew obsessed with omens and taboos: hundreds of categories of ill-omened words—disaster, defeat, mourning, and the like—were banned from speech and documents, and any breach brought execution.',
  },
  s0413: {
    literal:
      'He changed the character gua to "horse-beside-melon," [36] because the character gua also resembles the character for "calamity."',
    idiomatic:
      'He split the character gua into ma bian gua ("horse beside melon"), [36] because gua resembles the character for calamity.',
  },
  s0414: {
    literal:
      'He lent the Southern Park to Zhang Yong, saying, "Grant it for three hundred years; when the term ends, report again."',
    idiomatic:
      'He lent the Southern Park to Zhang Yong with the words, "Let it be three hundred years; when the term ends, petition again."',
  },
  s0415: {
    literal: 'Matters of this sort were all like this.',
    idiomatic: 'His conduct was full of such instances.',
  },
  s0416: {
    literal:
      'The Xuanyang Gate the common people called the White Gate; the Emperor regarded the name White Gate as inauspicious and greatly tabooed it.',
    idiomatic:
      'The Xuanyang Gate was popularly called the White Gate; the Emperor found the name inauspicious and fiercely forbade it.',
  },
  s0417: {
    literal:
      'Right Assistant in the Masters of Writing Jiang Mi once blundered into the taboo; the Emperor changed color and said, "White your family gate!',
    idiomatic:
      'Right Assistant in the Masters of Writing Jiang Mi once tripped over the taboo; the Emperor flushed and said, "May your own gate be white!',
  },
  s0418: {
    literal: '" Mi knocked his head in apology and was long in coming to release.',
    idiomatic: 'Jiang Mi kowtowed in terror and was not forgiven for a long while.',
  },
  s0419: {
    literal:
      'When the Empress Dowager\'s corpse rested on a lacquered couch it was first moved out of the Eastern Palace; the Emperor once visited the palace, saw it, and was furious beyond measure; he dismissed the Palace Attendant, and several tens in the bureaus were punished for it.',
    idiomatic:
      'When the empress dowager\'s body was laid on a lacquered couch and moved out of the Eastern Palace ahead of the rites, the Emperor visited the palace, flew into a rage, dismissed the Palace Attendant, and punished dozens of staff in the bureaus.',
  },
  s0420: {
    literal: '[37] Within and without, all constantly feared giving offense; no one could feel secure.',
    idiomatic: '[37] Court and capital lived in fear of giving offense; no one felt safe.',
  },
  s0421: {
    literal:
      'Taboos within the palace were especially severe: to move a bed or repair a wall, one first had to sacrifice to the Earth God and have literati compose prayer-texts and blessing-documents, as at a great offering.',
    idiomatic:
      'Palace taboos were harshest of all: moving a bed or repairing a wall required sacrifice to the Earth God and literati-drafted prayers, as for a major state offering.',
  },
  s0422: {
    literal:
      'Between the Taishi and Taiyu eras he became more cruel and fond of killing; those at his side who missed his intent and offended his mood were often hacked, gouged, or cut apart.',
    idiomatic:
      'From the Taishi into the Taiyu years he turned crueler and bloodier; attendants who missed his mood were often hacked apart or dismembered.',
  },
  s0423: {
    literal:
      'At the time the court was campaigning on the Huai and Si, armies never rested, ruin had piled up for long years, and the treasury was empty.',
    idiomatic:
      'Campaigns on the Huai and Si never ceased; years of devastation had emptied the treasury.',
  },
  s0424: {
    literal: 'Civil and military officials alike were rationed their salaries by the day;',
    idiomatic: 'Civil and military officials alike received salaries by the day;',
  },
  s0425: {
    literal: '[38] yet the Emperor was extravagant beyond measure and pursued carved luxury.',
    idiomatic: '[38] while the Emperor spent without limit and demanded ever more ornament.',
  },
  s0426: {
    literal:
      'For every object he ordered made, there had to be thirty sets for the chief imperial use, and thirty each for the secondary and tertiary grades; a single item required ninety copies, and the realm was in uproar—the people could not bear the burden.',
    idiomatic:
      'Every new object had to be made in thirty sets for the chief imperial use and thirty each for secondary and tertiary grades—ninety copies of a single thing—and the realm groaned under a burden it could not bear.',
  },
  s0427: {
    literal: 'His remaining deeds are set out in the other chapters.',
    idiomatic: 'His other deeds are recorded in the chapters that follow.',
  },
  s0428: {
    literal:
      '[39] Favoring slanderers close at hand, he pruned the imperial branches, and the house of Song from this point declined.',
    idiomatic:
      '[39] He heeded jealous counselors at his side, cut down the imperial clansmen, and the Liu-Song house began its decline from that hour.',
  },
  s0429: {
    literal:
      'The historiographer says: The sage establishes law and leaves institutions behind; therefore he must invoke the former kings, for it is through surviving instruction and lingering custom that one can bequeath guidance to later generations.',
    idiomatic:
      'The historiographer writes: The sage sets law and leaves institutions behind, and therefore always invokes the former kings—surviving instruction and lingering custom are what a dynasty bequeaths to those who come after.',
  },
  s0430: {
    literal:
      'The Founder, bearing the imperial screen and facing south, truly had the bearing of a lord of men; his principles for ordering the state were broad, yet his way of exalting the family was insufficient.',
    idiomatic:
      'Emperor Wen, facing south with the imperial screen at his back, truly had a ruler\'s bearing; his vision for governing the realm was broad, but his care for the imperial house was not enough.',
  },
  s0431: {
    literal:
      'Prince Zhao of Pengcheng did not look to antiquity and by nature lacked outstanding endowment; [40] he saw only the righteousness between brothers and did not understand the rites between ruler and minister, hoping to carry this family sentiment into the way of the state. The lord was suspicious yet he still offended; favor was thin yet he did not awaken—leading from a slight act of reprimand to the great calamity of destroying kin.',
    idiomatic:
      'Prince Zhao of Pengcheng did not study antiquity and lacked talent that stood apart; [40] he knew only brotherly duty, not the rites between sovereign and minister, and tried to govern a realm with the logic of a household. His lord grew suspicious yet he pressed on; favor thinned yet he never understood—until a word of rebuke opened the way to the catastrophe of kin slaughter.',
  },
  s0432: {
    literal: 'He opened the breach and planted the rift, and bequeathed it to those who came after.',
    idiomatic: 'He opened the crack and planted the feud, and left both to posterity.',
  },
  s0433: {
    literal:
      'Though the weight of heaven\'s kin differs in principle from ordinary kinship, for men of middling virtue and below, feeling follows favor.',
    idiomatic:
      'Heaven\'s kinship weighs differently from ordinary ties, yet for any man of middling feeling and below, affection answers to grace received.',
  },
  s0434: {
    literal:
      'As for exchanging clothes to go out, sharing hardship in eating, compared with dwelling in separate palaces and separate gates, form distant and affairs divided—there ought to be a descent.',
    idiomatic:
      'To exchange clothes and go abroad together, to share bitter fare—set that against separate palaces and separate gates, kinship thinned to form and affairs cut off—and the distance ought to be plain.',
  },
  s0435: {
    literal:
      'Emperor Taizong, exploiting the ease of rifts in feeling, relied on precedent already in practice, pruned the great branches, and did not wait for forethought.',
    idiomatic:
      'Emperor Ming seized on those family fractures, invoked precedents already in use, and lopped the great branches of the clan without pausing to reckon the cost.',
  },
  s0436: {
    literal:
      'Thereafter the root had no shelter, the young lord stood alone, the regalia shifted because power was weak, and the mandate changed as joyous acclaim turned elsewhere.',
    idiomatic:
      'Soon the trunk stood unprotected, a child emperor stood alone, the throne shifted as power thinned, and the mandate changed hands with the next wave of acclamation.',
  },
  s0437: {
    literal:
      'This is surely like frost underfoot growing step by step until solid ice arrives of itself—the source lies far back.',
    idiomatic:
      'This is the old lesson of frost underfoot and solid ice gathering by degrees—the ruin was long in coming.',
  },
  s0438: {
    literal: 'Collation notes',
    idiomatic: 'Collation notes',
  },
  s0439: {
    literal:
      'Inspector of Southern Xu Prince Ziren of Yongjia was made General of the Central Army: in all editions the character "south" is omitted; supplemented according to the biography of Prince Ziren of Yongjia.',
    idiomatic:
      'Prince Ziren of Yongjia as Inspector of Southern Xu made General of the Central Army: all editions drop nan (south); restored from his biography.',
  },
  s0440: {
    literal: 'On guiyou: in all editions this reads "renwu"; emended according to the Jiankang Shilu.',
    idiomatic: 'Guiyou day: all editions read renwu; corrected per Jiankang Shilu.',
  },
  s0441: {
    literal:
      'According to this month\'s gengshen new moon, the thirteenth day is renshen and the sixteenth day is yihai.',
    idiomatic:
      'That month began on gengshen; the thirteenth day was renshen and the sixteenth yihai.',
  },
  s0442: {
    literal:
      'This edict in the Song Shu annals falls after the thirteenth day, renshen, and before the sixteenth day, yihai; thus renwu is wrong and guiyou is correct.',
    idiomatic:
      'In this annals the edict falls after renshen on the thirteenth and before yihai on the sixteenth, so renwu is wrong and guiyou correct.',
  },
  s0443: {
    literal:
      '"Report in full by article": in all editions "xiang" appears as "xu"; emended according to Yuan Gui 213.',
    idiomatic:
      '"Report in full by article": all editions read xu for xiang; corrected per Yuan Gui, juan 213.',
  },
  s0444: {
    literal:
      'Assistant State General Liu Qin as vanguard campaigning west: in all editions "west campaign" appears as "south campaign"; emended according to the Nan Shi.',
    idiomatic:
      'Liu Qin as vanguard on the western campaign: all editions read "southern campaign"; corrected per Nan Shi.',
  },
  s0445: {
    literal: 'According to this, at the time Liu Qin was attacking Shouyang and it should read "west campaign."',
    idiomatic: 'Liu Qin was then attacking Shouyang; "western campaign" is correct.',
  },
  s0446: {
    literal:
      'General Who Comforts the Army Yin Xiaozu attacked Zhuyi and died; Assistant State General Shen Youzhi replaced him as vanguard of the southern campaign: below "General Who Comforts the Army" thirteen characters are missing; supplemented according to the Nan Shi.',
    idiomatic:
      'Yin Xiaozu, General Who Comforts the Army, died attacking Zhuyi; Shen Youzhi replaced him as southern vanguard: all editions omit thirteen characters after "General Who Comforts the Army"; restored from Nan Shi.',
  },
  s0447: {
    literal: 'At the time Yin Xiaozu was General Who Comforts the Army.',
    idiomatic: 'At the time Yin Xiaozu held the post of General Who Comforts the Army.',
  },
  s0448: {
    literal: 'The events are compared in the biographies of Shen Youzhi and Yin Xiaozu.',
    idiomatic: 'See the biographies of Shen Youzhi and Yin Xiaozu.',
  },
  s0449: {
    literal:
      'Burial of Empress Dowager Chongxian at Xiuning Mausoleum: in all editions "xiu" is corrupted to "you"; emended according to the Nan Shi and the Comprehensive Mirror.',
    idiomatic:
      'Burial of Empress Dowager Chongxian at Xiuning Mausoleum: all editions corrupt xiu as you; corrected per Nan Shi and Zizhi Tongjian.',
  },
  s0450: {
    literal:
      'The Comprehensive Mirror, Hu Sanxing\'s note, says: "Xiuning Mausoleum lies southeast of Xiaoling."',
    idiomatic:
      'Hu Sanxing notes in the Zizhi Tongjian: "Xiuning Mausoleum lies southeast of Xiaoling."',
  },
  s0451: {
    literal:
      'Heir of Prince Xiuren of Jian\'an Boroong was made Inspector of Yu: in the biography of Prince Xiuren of Jian\'an it reads "Southern Yu."',
    idiomatic:
      'Boroong, heir of Prince Xiuren of Jian\'an, as Inspector of Yu: his father\'s biography reads Southern Yu.',
  },
  s0452: {
    literal:
      'Administrator of Wu commandery Gu Kuizhi was made Inspector of Xiang: in all editions "kui" appears as "yi"; emended according to the biography of Kuizhi.',
    idiomatic:
      'Gu Kuizhi, Administrator of Wu, as Inspector of Xiang: all editions read yi for kui; corrected per Kuizhi\'s biography.',
  },
  s0453: {
    literal:
      'Partial amnesty for Yang and Southern Xu: in all editions the character "south" is omitted; supplemented according to the Jiankang Shilu.',
    idiomatic:
      'Partial amnesty for Yang and Southern Xu: all editions omit nan (south); restored per Jiankang Shilu.',
  },
  s0454: {
    literal: 'Presenting tribute at the audience for submission: in Yuan Gui 198 "present" appears as "come."',
    idiomatic: 'Tribute presented at the audience: Yuan Gui, juan 198, reads "come" for "present."',
  },
  s0455: {
    literal:
      '"Holding the reins and inquiring into government": in all editions "hold" appears as "arrow"; emended according to Yuan Gui 212.',
    idiomatic:
      '"Holding the reins of power": all editions read "arrow" for "hold"; corrected per Yuan Gui, juan 212.',
  },
  s0456: {
    literal:
      'Assistant State General Liu Lingyi was made Inspector of Liang and Southern Qin: in all editions "Liu Lingyi" appears as "Liu Lingdao."',
    idiomatic:
      'Liu Lingyi as Inspector of Liang and Southern Qin: all editions read Liu Lingdao; should be Liu Lingyi.',
  },
  s0457: {
    literal:
      'Zhang Senkai\'s Collation Notes says: "It should read \'Liu Lingyi\'; the biography of Deng Wan can verify it.',
    idiomatic:
      'Zhang Senkai\'s Collation Notes: "Should read Liu Lingyi, as the biography of Deng Wan proves.',
  },
  s0458: {
    literal: 'In the fourth year below it also reads \'Liu Lingyi.\'"',
    idiomatic: 'The fourth year below also has Liu Lingyi."',
  },
  s0459: {
    literal: '" According to Zhang\'s argument, it is so; now corrected.',
    idiomatic: 'Zhang is correct; the text is emended accordingly.',
  },
  s0460: {
    literal:
      'Colonel of the Rapid Cavalry Yuan Hong was made Inspector of Yi: in all editions "Yuan Hong" appears as "Yuan Lang."',
    idiomatic:
      'Yuan Hong as Inspector of Yi: all editions read Yuan Lang for Yuan Hong.',
  },
  s0461: {
    literal:
      'Zhang Senkai\'s Collation Notes says: "Yuan Lang, in the third year of Daming, had already been killed by Prince Dan of Jingling, as seen in the biography of Yuan Hu.',
    idiomatic:
      'Zhang Senkai notes: "Yuan Lang was killed in Daming year 3 by Prince Dan of Jingling (see the biography of Yuan Hu).',
  },
  s0462: {
    literal: 'This is an error for Yuan Hong."',
    idiomatic: 'This should be Yuan Hong."',
  },
  s0463: {
    literal: '" According to Zhang\'s argument, it is so; now corrected.',
    idiomatic: 'Zhang is right; corrected here.',
  },
  s0464: {
    literal:
      'Censor-in-Chief Yang Xi was made Inspector of Guang: in all editions "Yang Xi" appears as "Yang Nan"; according to the biography of Yang Xuanbao, his nephew Xi at this time left the post of Censor-in-Chief to become Inspector of Guang.',
    idiomatic:
      'Yang Xi as Inspector of Guang: all editions read Yang Nan; Yang Xuanbao\'s biography shows his nephew Xi leaving the censorate for Guang at this time.',
  },
  s0465: {
    literal: 'The character "nan" is wrong; now corrected.',
    idiomatic: 'Nan is wrong; emended.',
  },
  s0466: {
    literal:
      'Zhenqi\'s son Chaoyue was made Inspector of Northern Ji: Sun Fen\'s Song Shu Studies says, "In the biography of Liu Qin, Chaoyue is Inspector of Northern Yu, not Northern Ji."',
    idiomatic:
      'Chaoyue, son of Zhenqi, as Inspector of Northern Ji: Sun Fen notes Liu Qin\'s biography makes him Inspector of Northern Yu, not Northern Ji.',
  },
  s0467: {
    literal:
      'Right Honored Grandee, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuamo died: the Sanzhao, Beijian, Mao, and Dian editions read "Right Honored Grandee"; the Bureau edition and Wang Xuamo\'s biography read "Left Honored Grandee."',
    idiomatic:
      'Wang Xuamo\'s death: Sanzhao, Beijian, Mao, and Dian editions read Right Honored Grandee; the Bureau edition and his biography read Left Honored Grandee.',
  },
  s0468: {
    literal: 'In the third month, on jiwei, below there is wuchen.',
    idiomatic: 'Third month, jiwei day: below this entry stands wuchen.',
  },
  s0469: {
    literal: 'According to this month\'s bingzi new moon, there are no jiwei or wuchen.',
    idiomatic: 'That month opened on bingzi; neither jiwei nor wuchen occurs.',
  },
  s0470: {
    literal: 'The twentieth day is yiwei and the twenty-third day is wuxu.',
    idiomatic: 'The twentieth day is yiwei and the twenty-third wuxu.',
  },
  s0471: {
    literal: 'Jiwei may be a corruption of yiwei; wuchen may be a corruption of wuxu.',
    idiomatic: 'Jiwei is probably yiwei miscopied; wuchen probably wuxu miscopied.',
  },
  s0472: {
    literal:
      'Army Chief Administrator Liu Lingyi was made Inspector of Liang and Southern Qin: Sun Fen\'s Song Shu Studies says, "One character is missing above \'army.\'"',
    idiomatic:
      'Liu Lingyi as Inspector of Liang and Southern Qin: Sun Fen notes one character missing before "army."',
  },
  s0473: {
    literal:
      'Administrator of Southern Qiao Sun Fengbo was made Inspector of Jiao: in all editions "Southern Qiao" appears as "Qiao South"; corrected according to the Treatise on Provinces and Commanderies.',
    idiomatic:
      'Sun Fengbo of Southern Qiao as Inspector of Jiao: all editions reverse the commandery name; corrected per the geography treatise.',
  },
  s0474: {
    literal:
      'Killed Inspector Yang Xi: in all editions "Yang Xi" is corrupted to "Yang Nan"; corrected according to the Nan Shi, Jiankang Shilu, Comprehensive Mirror, and the attached biography of Xi in the biography of Yang Xuanbao in this book.',
    idiomatic:
      'Killed Inspector Yang Xi: all editions corrupt Xi as Nan; corrected per Nan Shi, Jiankang Shilu, Zizhi Tongjian, and Xi\'s entry under Yang Xuanbao in this book.',
  },
  s0475: {
    literal:
      'Again reduced the salary-fields of commanderies and counties by half: in all editions and the Comprehensive Mirror this reads "field-tax."',
    idiomatic:
      'Salary-fields of commanderies and counties again halved: all editions and the Tongjian read "land tax."',
  },
  s0476: {
    literal:
      'According to this, a universal halving of land-tax throughout the realm is certainly not what a despotic emperor would permit; it should be reducing the salary-fields of commandery and county officials by half.',
    idiomatic:
      'A general halving of land tax empire-wide is not what even a tyrant would decree; the passage must mean halving officials\' salary-fields.',
  },
  s0477: {
    literal: 'The Jiankang Shilu reads "salary-fields"; it is correct.',
    idiomatic: 'Jiankang Shilu has salary-fields (tian lu); that reading is correct.',
  },
  s0478: {
    literal: 'Now emended accordingly.',
    idiomatic: 'Emended accordingly.',
  },
  s0479: {
    literal:
      'On bingshen Prince Yi of Donghai was re-enfeoffed as Prince of Lujiang: in all editions the two characters "bingshen" are omitted; supplemented according to the Nan Shi and Jiankang Shilu.',
    idiomatic:
      'Prince Yi of Donghai re-enfeoffed as Prince of Lujiang on bingshen: all editions omit the date; restored per Nan Shi and Jiankang Shilu.',
  },
  s0480: {
    literal:
      'In the fifth month, on yisi: in all editions this reads "yiwei"; according to this month\'s yisi new moon, there is no yiwei.',
    idiomatic:
      'Fifth month, yisi day: all editions read yiwei; that month opened on yisi, so yiwei cannot occur.',
  },
  s0481: {
    literal: 'Below there is the nineteenth day, guihai.',
    idiomatic: 'The nineteenth day below is guihai.',
  },
  s0482: {
    literal: 'This yiwei should be the error for yisi; now corrected.',
    idiomatic: 'Yiwei is a miscopy of yisi; corrected.',
  },
  s0483: {
    literal:
      'Chancellor of Nankang Liu Bo was made Inspector of Jiao: Zhang Senkai\'s Collation Notes says, "In the biography of Liu Qin there is a younger brother Jiao, who in the Taishi era was General Who Pacifies the North and Inspector of Jiao and died of illness on the road.',
    idiomatic:
      'Liu Bo of Nankang as Inspector of Jiao: Zhang Senkai notes Liu Qin\'s biography has a younger brother Jiao, made Inspector of Jiao in the Taishi era and dead of illness en route.',
  },
  s0484: {
    literal: 'Bo and Jiao are graphically near; they must be one man."',
    idiomatic: 'Bo and Jiao are near in form; they must be the same man."',
  },
  s0485: {
    literal:
      'Assistant State General Shen Wenjing was made Inspector of Eastern Qing: in the biography of Shen Wenxiu and the Comprehensive Mirror this reads "Shen Wenjing."',
    idiomatic:
      'Shen Wenjing as Inspector of Eastern Qing: Shen Wenxiu\'s biography and the Tongjian read Shen Wenjing (jing 靜 for jing 靖).',
  },
  s0486: {
    literal:
      'Soon seizing control and imposing statutory punishment: in all editions "seize" appears as "create."',
    idiomatic:
      'Soon seizing power and imposing statutory penalties: all editions read "create" for "seize."',
  },
  s0487: {
    literal: 'Sun Fen\'s Song Shu Studies says: "It should read seizing control; the character create is wrong.',
    idiomatic: 'Sun Fen: "Should read seizing control (jiezhi); create (chuang) is wrong.',
  },
  s0488: {
    literal: '" According to Sun\'s argument, it is so; now corrected.',
    idiomatic: 'Sun is correct; emended.',
  },
  s0489: {
    literal:
      'Xuanyao, son of Prince Xiuyou of Jinping, was established as Prince of Nanping: in all editions the character "establish" is omitted; supplemented according to the Nan Shi and Jiankang Shilu.',
    idiomatic:
      'Xuanyao, son of Prince Xiuyou of Jinping, enfeoffed as Prince of Nanping: all editions omit "establish"; restored per Nan Shi and Jiankang Shilu.',
  },
  s0490: {
    literal:
      'Resting affairs and balancing the scales: in all editions "rest" appears as "from"; corrected according to Yuan Gui 213 and 645.',
    idiomatic:
      '"Resting affairs and balancing the scales": all editions read "from" for "rest"; corrected per Yuan Gui, juan 213 and 645.',
  },
  s0491: {
    literal:
      'Assistant State General Meng Ciyang was made Inspector of Yan: in all editions the character "ci" is omitted; supplemented according to the biographies of Ruan Dianfu and Yin Yan.',
    idiomatic:
      'Meng Ciyang as Inspector of Yan: all editions omit ci from his name; restored per Ruan Dianfu\'s and Yin Yan\'s biographies.',
  },
  s0492: {
    literal:
      'Grand General Who Pacifies the North and Inspector of Southern Xu Prince Xiubian of Guiyang was made Supervisor of the Masters of Writing, General of the Central Army, and Inspector of Yang: in all editions "General of the Central Army" appears as "Central General"; supplemented according to the biography of Prince Xiubian of Guiyang.',
    idiomatic:
      'Prince Xiubian of Guiyang, Grand General Who Pacifies the North and Inspector of Southern Xu, made Supervisor of the Masters of Writing, General of the Central Army, and Inspector of Yang: all editions read Central General for General of the Central Army; restored per his biography.',
  },
  s0493: {
    literal:
      'Assistant State General Boroong, heir of Prince Xiuren of Jian\'an, was made Inspector of Guang: in all editions the character "bo" is omitted.',
    idiomatic:
      'Boroong, heir of Prince Xiuren of Jian\'an, as Inspector of Guang: all editions omit bo from his name.',
  },
  s0494: {
    literal: 'Supplemented according to the biography of Prince Xiuren of Shian.',
    idiomatic: 'Restored from the biography of Prince Xiuren of Shian.',
  },
  s0495: {
    literal:
      'Newly appointed Director of the Ministry of Personnel Chu Yuan was made Right Vice Director of the Masters of Writing: in all editions and the Comprehensive Mirror this reads "Left Vice Director"; now emended according to the biography of Chu Yuan in the Qi Shu, Nan Shi, and Jiankang Shilu.',
    idiomatic:
      'Chu Yuan, newly appointed Director of the Ministry of Personnel, as Right Vice Director of the Masters of Writing: all editions and the Tongjian read Left Vice Director; corrected per Chu Yuan\'s biography in Southern Qi Shu, Nan Shi, and Jiankang Shilu.',
  },
  s0496: {
    literal: 'Now emended accordingly.',
    idiomatic: 'Emended accordingly.',
  },
  s0497: {
    literal:
      'In winter, the eleventh month, on wuwu: in all editions "eleventh month" appears as "tenth month."',
    idiomatic:
      'Winter, eleventh month, wuwu day: all editions read tenth month for eleventh.',
  },
  s0498: {
    literal: 'Emended according to the Jiankang Shilu.',
    idiomatic: 'Corrected per Jiankang Shilu.',
  },
  s0499: {
    literal: 'According to this, in the tenth month on bingxu new moon there is no wuwu.',
    idiomatic: 'Tenth month opened on bingxu; wuwu does not occur there.',
  },
  s0500: {
    literal:
      'In the eleventh month on yimao new moon, the fourth day is wuwu.',
    idiomatic:
      'Eleventh month opened on yimao; the fourth day is wuwu.',
  },
};

if (!fs.existsSync(path)) {
  console.error(
    `Missing ${path}. Extract batch 5 first, e.g. make start-translation BOOK=songshu CHAPTER=008`,
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const ids = Object.keys(T);
const present = new Set(data.sentences.map((s) => s.id));
const missing = ids.filter((id) => !present.has(id));
if (missing.length) {
  console.error(
    `Missing sentence IDs in ${path}: ${missing.join(', ')}. Extract batch 5 before running this script.`,
  );
  process.exit(1);
}

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Filled', ids.length, 'sentences (s0401–s0500)');
