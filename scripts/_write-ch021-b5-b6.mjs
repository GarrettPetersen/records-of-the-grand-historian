#!/usr/bin/env node
import { writeFileSync } from 'fs';

const batch5 = {
  s0401: {
    literal:
      "Jiazi is only the head of the six decad cycles; within one year it is regularly met in alternate months, is not a great assembly, and the gnomon's revolution is not complete—only by totaling the days of the six jia does it aid the four seasons to complete the year.",
    idiomatic:
      "Jiazi is only the head of the six decad cycles; within a year it appears in alternate months, is no great assembly, and the sundial's cycle is incomplete—only by totaling the six jia days does it help the four seasons make a year.",
  },
  s0402: {
    literal:
      "Now wishing to avoid the full cycle to take jiazi is turning one's back on great auspice to seek small auspice.",
    idiomatic:
      "To avoid the full cycle and seize jiazi is to forsake great auspice for a lesser one.",
  },
  s0403: {
    literal:
      "\" The Grand Astrologer Fu Xiaozhong memorialized: \"Per the Classic of Clepsydra Graduations, south land and north land on the same day are checked one fen; if one uses the twelfth day, one fen is short.",
    idiomatic:
      "\" Grand Astrologer Fu Xiaozhong memorialized: \"Per the Classic of Clepsydra Graduations, south and north lands are checked one fen on the same day; using the twelfth day falls one fen short.",
  },
  s0404: {
    literal: "If the south pole is not reached, it cannot count as the solstice.",
    idiomatic: "Without reaching the south pole, it cannot count as the solstice.",
  },
  s0405: {
    literal:
      "\" The emperor said: \"As the folk proverb says, 'The winter solstice is longer than the year'—this too cannot be changed.",
    idiomatic:
      "\" The emperor said: \"As the proverb runs, 'The winter solstice is longer than the year'—that too cannot be changed.",
  },
  s0406: {
    literal: "\" In the end they followed Shao's proposal and on the thirteenth day, yichou, sacrificed at the round mound.",
    idiomatic: "\" They finally followed Shao's proposal and sacrificed at the round mound on the thirteenth day, yichou.",
  },
  s0407: {
    literal:
      "In the first month of the first year of Taiji under Ruizong, when they were first to perform the southern suburb rites, the responsible offices established the proposal to sacrifice only to August Heaven High God and not set a seat for August Earth Spirit.",
    idiomatic:
      "In Ruizong's Taiji year 1, first month, as the southern suburb rites were first planned, the offices proposed sacrificing only to August Heaven High God without a seat for August Earth Spirit.",
  },
  s0408: {
    literal: "Remonstrance Counselor Jia Zeng submitted a memorial, saying:",
    idiomatic: "Remonstrance Counselor Jia Zeng submitted a memorial:",
  },
  s0409: {
    literal: "Your humble servant has examined the canonical rites in detail and holds that Heaven and Earth should be sacrificed together.",
    idiomatic: "Your servant has examined the canonical rites and holds that Heaven and Earth ought to be sacrificed together.",
  },
  s0410: {
    literal:
      "Respectfully per the Record of Rites on Sacrifice: \"Youyu di at the di to Huangdi and at the jiao to Ku; Xia hou di at the di to Huangdi and at the jiao to Gun.\"",
    idiomatic:
      "Per the Record of Rites on Sacrifice: \"Youyu performed di to Huangdi and jiao to Ku; Xia performed di to Huangdi and jiao to Gun.\"",
  },
  s0411: {
    literal: "\" The tradition says: a great sacrifice is called di.",
    idiomatic: "\" Tradition says a great sacrifice is called di.",
  },
  s0412: {
    literal: "Thus both the suburb and the temple have di sacrifices.",
    idiomatic: "Thus suburb and temple alike have di sacrifices.",
  },
  s0413: {
    literal:
      "At di in the temple, the lords of the ancestors are all united in the Grand Ancestor's temple;",
    idiomatic:
      "Di at the temple unites the ancestral lords in the Grand Ancestor's temple;",
  },
  s0414: {
    literal:
      "at di at the suburb, Earth Spirits and the host of wang are all united at the round mound, with the founding ancestor as consort.",
    idiomatic:
      "di at the suburb unites Earth Spirits and the host of wang at the round mound, with the founding ancestor as consort.",
  },
  s0415: {
    literal: "all are great sacrifices with special intent, differing from ordinary sacrifices.",
    idiomatic: "all are solemn great sacrifices, distinct from ordinary rites.",
  },
  s0416: {
    literal: "The Great Tradition of Rites says: \"One who is not king does not perform di.\"",
    idiomatic: "The Great Tradition says: \"One who is not king does not perform di.\"",
  },
  s0417: {
    literal: "Thus one knows that when a king receives the Mandate he must perform the di rite.",
    idiomatic: "Thus when a king receives the Mandate he must perform di.",
  },
  s0418: {
    literal:
      "The Book of Yu says: \"On the first day of the first month, Shun arrived at the Literary Ancestor; he then classified sacrifice to High God, presented to the Six Ancestors, wang at mountains and rivers, and pervaded the host of spirits.\"",
    idiomatic:
      "The Book of Yu says: \"On the first day of the first month Shun arrived at the Literary Ancestor; he classified sacrifice to High God, presented to the Six Ancestors, wang at mountains and rivers, and reached the host of spirits.\"",
  },
  s0419: {
    literal: "\" This is performing the di rite upon receiving the Mandate.",
    idiomatic: "\" This is performing di upon receiving the Mandate.",
  },
  s0420: {
    literal: "When it says \"arrived at the Literary Ancestor,\" the rest of the temples' offerings can be known.",
    idiomatic: "Saying \"arrived at the Literary Ancestor\" shows what the other temple offerings were.",
  },
  s0421: {
    literal: "When it says \"classified to High God,\" the union of Earth Spirits can be known.",
    idiomatic: "Saying \"classified to High God\" shows Earth Spirits were included.",
  },
  s0422: {
    literal:
      "Moreover sacrifices to mountains and rivers all belong to Earth; if the host of wang are still pervaded, how much more Earth Spirits!",
    idiomatic:
      "Sacrifices to mountains and rivers belong to Earth; if the host of wang are still fully included, how much more Earth Spirits!",
  },
  s0423: {
    literal:
      "The Offices of Zhou: \"With the six lü, six lü, five tones, eight sounds, and six dances, greatly harmonize music to reach the spirits, harmonize the states, and harmonize the myriad people.\"",
    idiomatic:
      "The Offices of Zhou: \"With six lü, six lü, five tones, eight sounds, and six dances, greatly harmonize music to reach the spirits, harmonize the states, and harmonize the people.\"",
  },
  s0424: {
    literal:
      "\" Moreover, \"Of all six musics, six transformations bring forth images, things, and the Heavenly Spirit\"—this is the music of di at the suburb uniting Heavenly Spirit, Earth Spirits, and human ghosts in sacrifice.",
    idiomatic:
      "\" Moreover, \"Of the six musics, six transformations bring forth images, things, and the Heavenly Spirit\"—the music of di at the suburb, uniting Heaven, Earth, and the human dead in one sacrifice.",
  },
  s0425: {
    literal:
      "Han round-mound rites in Old Matters of the Three Metropolises: August Heaven High God's seat faced due south; Queen Earth's seat-plot also faced south but slightly east.",
    idiomatic:
      "Han round-mound rites per Old Matters of the Three Metropolises: August Heaven High God faced south; Queen Earth's plot also faced south, slightly east.",
  },
  s0426: {
    literal:
      "The Eastern Pavilion Han Record also says: \"When Guangwu took the throne he built an altar on the sunny slope at Hao, sacrificing to announce to Heaven and Earth, adopting Yuan Shi precedents.\"",
    idiomatic:
      "The Eastern Pavilion Han Record says: \"When Guangwu took the throne he built an altar on Hao's sunny slope to announce sacrifice to Heaven and Earth, following Yuan Shi precedent.\"",
  },
  s0427: {
    literal:
      "In the second year, first month, south of Luoyang he modeled Hao as a round altar; Heaven and Earth seats were upon it, all facing south and west above.",
    idiomatic:
      "In year 2, first month, south of Luoyang he built a round altar modeled on Hao; Heaven and Earth seats stood upon it, all facing south with west above.",
  },
  s0428: {
    literal:
      "\" Examining the two Han eras, they had their own Queen Earth and northern suburb sacrifices, yet here Earth seats were already set at the round mound—clearly the rite of di sacrifice.",
    idiomatic:
      "\" Though the two Han had separate Queen Earth and northern suburb rites, Earth seats were already at the round mound—clearly a di rite.",
  },
  s0429: {
    literal:
      "The Spring and Autumn Explanations also say: \"A king in one year has seven sacrifices; Heaven and Earth eat together at the four meng, separate at equinox and solstice.\"",
    idiomatic:
      "The Spring and Autumn Explanations say: \"A king has seven sacrifices a year; Heaven and Earth feast together at the four meng, separately at equinox and solstice.\"",
  },
  s0430: {
    literal: "\" This again shows Heaven and Earth themselves often share sacrifice.",
    idiomatic: "\" This again shows Heaven and Earth commonly shared sacrifice.",
  },
  s0431: {
    literal:
      "Wang Su said: \"Confucius said to locate the round mound at the southern suburb—the southern suburb is the round mound, the round mound is the southern suburb.\"",
    idiomatic:
      "Wang Su said: \"Confucius said to locate the round mound at the southern suburb—southern suburb is round mound, round mound is southern suburb.\"",
  },
  s0432: {
    literal: "\" He also said: \"Sacrifice Heaven and Earth with consorts.\"",
    idiomatic: "\" He also said Heaven and Earth are sacrificed with consorts.\"",
  },
  s0433: {
    literal: "\" This too is clear proof of combined suburb sacrifice.",
    idiomatic: "\" This too clearly proves combined suburb sacrifice.",
  },
  s0434: {
    literal:
      "Only Zheng Xuan did not discuss di as combined sacrifice but divided August Heaven High God into two spirits, relying solely on weft texts—matters not seen in the classics.",
    idiomatic:
      "Only Zheng Xuan denied di as combined sacrifice, split August Heaven High God into two spirits, and relied on weft texts—not on the classics.",
  },
  s0435: {
    literal:
      "Moreover his comment on the Great Tradition's \"not cycling, not di\" says: \"At the head of the correct year, sacrifice the essence of the Felt Emperor, with one's ancestor as consort.\"",
    idiomatic:
      "His gloss on \"not cycling, not di\" says: \"At the correct year's head, sacrifice the Felt Emperor's essence with one's ancestor as consort.\"",
  },
  s0436: {
    literal:
      "\" Commenting on the Grand Music Master of the Offices of Zhou on the round mound, he cites the Great Tradition's di as the winter-solstice sacrifice.",
    idiomatic:
      "Commenting on the round mound in the Grand Music Master chapter, he cites the Great Tradition's di as the winter-solstice rite.",
  },
  s0437: {
    literal: "Mutually contradicting in succession, it is not sufficient to rely on.",
    idiomatic: "These contradict one another and cannot be relied on.",
  },
  s0438: {
    literal:
      "Bowing low: Your Majesty has received the tally and dwells in honor, continuing culture upon the calendar; since personally attending the imperial pole you have not yourself performed suburb sacrifice.",
    idiomatic:
      "Your Majesty has received the Mandate and sits in honor, continuing culture on the calendar; since taking the throne you have not performed suburb sacrifice in person.",
  },
  s0439: {
    literal:
      "Today's southern suburb is exactly the di rite; it is right to sacrifice Heaven and Earth together, extend rank to the hundred spirits, answer the tally of receiving the Mandate, and display the way of reverent respect.",
    idiomatic:
      "Today's southern suburb is properly di; Heaven and Earth should be sacrificed together, the hundred spirits ranked, the Mandate answered, and reverence displayed.",
  },
  s0440: {
    literal:
      "How can one not exalt the full rite, treat it like an ordinary suburb, leave Earth Spirits without a seat, and not follow di offering!",
    idiomatic:
      "How can the full rite not be exalted, Earth Spirits left without seats, and di offering withheld like an ordinary suburb!",
  },
  s0441: {
    literal:
      "Now I request fully setting August Earth Spirit and attendant sacrifice seats—then the rite can examine antiquity and the meaning fits human feeling.",
    idiomatic:
      "I request seats for August Earth Spirit and attendants—then the rite matches antiquity and accords with feeling.",
  },
  s0442: {
    literal:
      "Yet suburb and mound sacrifice is a great affair of state; if feeling is lost, the refined offering will be wanting.",
    idiomatic:
      "Yet suburb and mound sacrifice is a state great affair; if feeling is wrong, the refined offering fails.",
  },
  s0443: {
    literal:
      "Your servant's art does not penetrate the classics, his learning shames the broadly ancient—only because he once erred in ritual office and now disgraces the remonstrance bureau, whose charge is upright discussion, does he dare state loyal counsel.",
    idiomatic:
      "Your servant's learning does not penetrate the classics and shames the ancients—having once erred in ritual office and now holding remonstrance, he dares offer loyal counsel.",
  },
  s0444: {
    literal: "If anything may be adopted, let it be decided by sagely deliberation alone.",
    idiomatic: "If anything here may be adopted, let sagely deliberation decide.",
  },
  s0445: {
    literal: "An order directed the chief ministers to summon ritual officers to discuss in detail whether it was feasible.",
    idiomatic: "An order directed the chief ministers to summon ritual officers to discuss feasibility.",
  },
  s0446: {
    literal:
      "Ritual officers—the National University Rector Chu Wuliang, Vice-Rector Guo Shanyun, and others—all requested following Zeng's memorial.",
    idiomatic:
      "Ritual officers—National University Rector Chu Wuliang, Vice-Rector Guo Shanyun, and others—all asked to follow Zeng's memorial.",
  },
  s0447: {
    literal:
      "At that time they were again about to perform the northern suburb in person, and in the end Zeng's memorial was shelved.",
    idiomatic:
      "They were again about to perform the northern suburb in person, and Zeng's memorial was shelved.",
  },
  s0448: {
    literal:
      "When Xuanzong took the throne, in the eleventh month of Kaiyuan 11 he personally performed the round mound.",
    idiomatic:
      "When Xuanzong took the throne, in Kaiyuan 11, eleventh month, he personally performed the round mound.",
  },
  s0449: {
    literal:
      "At that time Chief Councilor Zhang Yue was ritual commissioner and Vice Director of the Court of Imperial Sacrifices Wei Tao deputy; Yue proposed using Founding Emperor Shenyao as consort sacrifice and began abolishing the rite of three ancestors as joint consorts.",
    idiomatic:
      "Chief Councilor Zhang Yue was ritual commissioner and Court of Imperial Sacrifices Vice Director Wei Tao deputy; Yue proposed Founding Emperor Shenyao as consort and abolished three-ancestor joint consortship.",
  },
  s0450: {
    literal: "By the twentieth year Xiao Song was chief councilor and revised and compiled new rites.",
    idiomatic: "By year 20 Xiao Song was chief councilor and compiled new rites.",
  },
  s0451: {
    literal: "Sacrifices to Heaven in one year were four; sacrifices to Earth, two.",
    idiomatic: "Heaven was sacrificed four times a year; Earth, twice.",
  },
  s0452: {
    literal:
      "At the winter solstice August Heaven High God was sacrificed at the round mound, with Founding Emperor Shenyao as consort; inner officials were increased to 159 seats, outer officials reduced to 104.",
    idiomatic:
      "At the winter solstice August Heaven High God was sacrificed at the round mound with Founding Emperor Shenyao as consort; inner officials rose to 159 seats, outer to 104.",
  },
  s0453: {
    literal:
      "For August Heaven High God and the two consort seats, each seat used twelve bian and dou, one each of gui, fu, jia, and zuo.",
    idiomatic:
      "For High God and the two consort seats, each used twelve bian and dou and one each of gui, fu, jia, and zuo.",
  },
  s0454: {
    literal:
      "For High God: great zun, zhuo zun, xi zun, elephant zun, and hu zun two each; mountain lei six.",
    idiomatic:
      "For High God: two each of great, zhuo, xi, elephant, and hu zun; six mountain lei.",
  },
  s0455: {
    literal:
      "For the consort seat no great zun or hu zun were set; four mountain lei were reduced; the rest matched High God.",
    idiomatic:
      "The consort seat omitted great and hu zun, reduced mountain lei by four; the rest matched High God.",
  },
  s0456: {
    literal:
      "Five Directional Emperor seats had ten bian and dou each, one each of gui, fu, jia, and zuo, and two great zun.",
    idiomatic:
      "Five Directional Emperor seats had ten bian and dou, one each of gui, fu, jia, and zuo, and two great zun.",
  },
  s0457: {
    literal: "Great Bright and Night Bright had eight bian and dou each; the rest matched the Five Directional Emperors.",
    idiomatic: "Great Bright and Night Bright used eight bian and dou each; all else matched the Five Directional Emperors.",
  },
  s0458: {
    literal: "Each inner official seat had two bian and dou, one gui and one zuo.",
    idiomatic: "Each inner-official seat had two bian and dou, one gui and one zuo.",
  },
  s0459: {
    literal: "Above inner officials, zun were set between the twelve steps.",
    idiomatic: "Above inner officials, zun were set among the twelve steps.",
  },
  s0460: {
    literal:
      "Between each inner-official aisle two zhuo zun; middle officials two xi zun; outer officials two zhuo zun; host of stars two hu zun.",
    idiomatic:
      "Each inner aisle had two zhuo zun; middle officials two xi zun; outer officials two zhuo zun; host of stars two hu zun.",
  },
  s0461: {
    literal:
      "On the upper xin day of the first month, prayer for grain: August Heaven High God was sacrificed at the round mound with the Founder as consort; Five Directional Emperors attended.",
    idiomatic:
      "On the first month's upper xin, for grain prayer High God was sacrificed at the round mound with the Founder as consort; Five Directional Emperors attended.",
  },
  s0462: {
    literal: "For High God and consort, bian and dou matched the winter-solstice count.",
    idiomatic: "High God and consort used the same bian and dou as at the winter solstice.",
  },
  s0463: {
    literal:
      "Five Directional Emperors: one each of great, zhuo, xi zun and mountain lei; bian, dou, and the rest also matched winter solstice.",
    idiomatic:
      "Five Directional Emperors: one each of great, zhuo, xi zun and mountain lei; bian, dou, and the rest matched winter solstice.",
  },
  s0464: {
    literal:
      "In the first month of summer, rain prayer to High God Above Heaven at the round mound, with Taizong as consort; Five Directional Emperors and Taihao and the five emperors, Gou Mang and the five officials attended.",
    idiomatic:
      "In early summer, rain prayer to High God Above Heaven at the round mound with Taizong as consort; Five Directional Emperors, Taihao and the five emperors, Gou Mang and the five officials attended.",
  },
  s0465: {
    literal:
      "For High God, consort, and Five Directional Emperors: eight bian and dou each, one each of gui, fu, jia, and zuo.",
    idiomatic:
      "High God, consort, and Five Directional Emperors: eight bian and dou, one each of gui, fu, jia, and zuo.",
  },
  s0466: {
    literal: "Each of the five officials' seats had two bian and dou, one gui, one fu, and one zuo.",
    idiomatic: "Each five-official seat had two bian and dou, one gui, one fu, and one zuo.",
  },
  s0467: {
    literal:
      "In late autumn, great offering at the Bright Hall: August Heaven High God was sacrificed with Ruizong as consort; Five Directional Emperors, Five Human Emperors, and five officials attended.",
    idiomatic:
      "In late autumn, great offering at the Bright Hall: High God with Ruizong as consort; Five Directional Emperors, Five Human Emperors, and five officials attended.",
  },
  s0468: {
    literal: "The count of bian and dou matched the rain-sacrifice rite.",
    idiomatic: "Bian and dou matched the rain-sacrifice rite.",
  },
  s0469: {
    literal:
      "At the summer solstice August Earth Spirit was honored at the square mound with the Founder as consort; attendant sacrifice from Spirit State downward numbered 68 seats, as in the Zhenguan rite.",
    idiomatic:
      "At the summer solstice Earth Spirit was honored at the square mound with the Founder as consort; 68 attendant seats from Spirit State down, as in Zhenguan.",
  },
  s0470: {
    literal: "Earth Spirit and consort: bian and dou as at the round mound.",
    idiomatic: "Earth Spirit and consort used the round-mound bian and dou count.",
  },
  s0471: {
    literal: "Spirit State: four bian and dou each, one each of gui, fu, jia, and zuo.",
    idiomatic: "Spirit State: four bian and dou, one each of gui, fu, jia, and zuo.",
  },
  s0472: {
    literal:
      "Five Marchmounts, four garrisons, four seas, four streams, five directions, mountains, forests, rivers, and marshes—37 seats—each had two bian and dou, one gui and one fu.",
    idiomatic:
      "Five marchmounts, four garrisons, four seas, four streams, five directions, mountains, forests, rivers, and marshes—37 seats—each had two bian and dou, one gui and one fu.",
  },
  s0473: {
    literal:
      "Five Directional Emperors, hills, mounds, embankments, plains, and lowlands—30 seats—one each of bian, dou, gui, fu, jia, and zuo.",
    idiomatic:
      "Five Directional Emperors, hills, mounds, dykes, plains, and lowlands—30 seats—one each of bian, dou, gui, fu, jia, and zuo.",
  },
  s0474: {
    literal:
      "At the start of winter Spirit State was sacrificed at the northern suburb, with Taizong as consort.",
    idiomatic:
      "At winter's start Spirit State was sacrificed at the northern suburb with Taizong as consort.",
  },
  s0475: {
    literal: "The two seats had twelve bian and dou each, one each of gui, fu, jia, and zuo.",
    idiomatic: "The two seats had twelve bian and dou, one each of gui, fu, jia, and zuo.",
  },
  s0476: {
    literal: "From winter-solstice round mound downward, the rest matched the Zhenguan rite.",
    idiomatic: "From winter-solstice round mound down, the rest matched Zhenguan.",
  },
  s0477: {
    literal:
      "At that time Attendant of the Palace Secretariat Wang Zhongqiu, who also directed compilation, further proposed:",
    idiomatic:
      "Attendant Wang Zhongqiu, who directed compilation, further proposed:",
  },
  s0478: {
    literal:
      "Per the Zhenguan Rites, on the first month's upper xin the Felt Emperor was sacrificed at the southern suburb; per the Xianqing Rites, August Heaven High God was sacrificed at the round mound for grain prayer.",
    idiomatic:
      "The Zhenguan Rites sacrifice the Felt Emperor at the southern suburb on the first month's upper xin; the Xianqing Rites sacrifice High God at the round mound for grain prayer.",
  },
  s0479: {
    literal: "The Zuo Tradition says: \"Suburb sacrifice, then plowing.\"",
    idiomatic: "The Zuo Tradition: suburb sacrifice, then plowing.",
  },
  s0480: {
    literal: "The Odes say: \"Yi Xi—spring and summer grain prayer to High God.\"",
    idiomatic: "The Odes: \"Yi Xi—spring and summer grain prayer to High God.\"",
  },
  s0481: {
    literal: "The Record of Rites also says: \"On upper xin, grain prayer to High God.\"",
    idiomatic: "The Record of Rites: on upper xin, grain prayer to High God.",
  },
  s0482: {
    literal:
      "Thus the text of grain prayer is transmitted through the dynasties, and the title High God properly belongs to August Heaven.",
    idiomatic:
      "Grain-prayer texts run through the dynasties, and the title High God properly belongs to August Heaven.",
  },
  s0483: {
    literal:
      "Yet Zheng Xuan said: \"Heaven's Five Emperors in turn receive kingship; when a king rises he must feel one of them; according to which he felt, sacrifice and honor it separately.\"",
    idiomatic:
      "Yet Zheng Xuan said: \"Heaven's Five Emperors receive kingship in turn; a rising king feels one of them and sacrifices that one separately.\"",
  },
  s0484: {
    literal:
      "Therefore in the first month of summer sacrifice is made to the emperor one was born from at the southern suburb, with one's ancestor as consort.",
    idiomatic:
      "So in summer's first month one sacrifices at the southern suburb to the emperor one was born from, with one's ancestor as consort.",
  },
  s0485: {
    literal:
      "Thus Zhou sacrificed to Lingwei Yang with Hou Ji as consort, thereby grain prayer.",
    idiomatic:
      "Zhou sacrificed to Lingwei Yang with Hou Ji as consort, calling it grain prayer.",
  },
  s0486: {
    literal: "\" According to the intent of sacrificing the Felt Emperor he described, it was originally not grain prayer.",
    idiomatic: "\" Sacrificing the Felt Emperor as he described was never grain prayer.",
  },
  s0487: {
    literal: "What former scholars said is probably hard to rely on.",
    idiomatic: "Former scholars' views are hard to rely on.",
  },
  s0488: {
    literal: "Now for the grain-prayer rite, I request following the rites in repair.",
    idiomatic: "I ask that grain prayer follow the canonical rites.",
  },
  s0489: {
    literal: "Moreover sacrifice to the Felt Emperor has long been practiced.",
    idiomatic: "Sacrifice to the Felt Emperor has long been practiced.",
  },
  s0490: {
    literal: "The Record says: \"Where there is an established practice, none may abolish it.\"",
    idiomatic: "The Record says: \"Where a practice exists, it may not be abolished.\"",
  },
  s0491: {
    literal: "\" I request at the grain-prayer altar to sacrifice pervasively to the Five Directional Emperors.",
    idiomatic: "\" I ask that the grain-prayer altar also sacrifice to all Five Directional Emperors.",
  },
  s0492: {
    literal: "The Five Emperors are the essences of the Five Phases.",
    idiomatic: "The Five Emperors embody the essences of the Five Phases.",
  },
  s0493: {
    literal: "The Five Phases are the patron of the nine grains.",
    idiomatic: "The Five Phases are patron of the nine grains.",
  },
  s0494: {
    literal: "Now I request both rites practiced together, all six spirits fully sacrificed.",
    idiomatic: "I ask both rites run together so all six spirits are sacrificed.",
  },
  s0495: {
    literal:
      "Moreover per the Zhenguan Rites, in early summer rain sacrifice the Five Directional High Gods, Five Human Emperors, and five officials at the southern suburb; per the Xianqing Rites, rain sacrifice to August Heaven High God at the round mound.",
    idiomatic:
      "The Zhenguan Rites rain-sacrifice Five Directional High Gods, Five Human Emperors, and five officials at the southern suburb in early summer; the Xianqing Rites sacrifice High God at the round mound.",
  },
  s0496: {
    literal: "Moreover rain sacrifice to High God is broadly to pray sweet rain for the hundred grains.",
    idiomatic: "Rain sacrifice to High God prays sweet rain for the crops.",
  },
  s0497: {
    literal:
      "Thus the Monthly Ordinances say: \"Order the officers to great rain prayer to the Emperor, using splendid music, to pray for full grain.\"",
    idiomatic:
      "The Monthly Ordinances say: \"Order officers to great rain prayer to the Emperor with splendid music, to pray for full grain.\"",
  },
  s0498: {
    literal:
      "\" Zheng Xuan said: \"Rain prayer to High God is Heaven's other title, properly August Heaven; sacrifice at the round mound honors Heaven's position.\"",
    idiomatic:
      "\" Zheng Xuan said: \"Rain prayer to High God uses Heaven's other title—August Heaven; the round mound honors Heaven's position.\"",
  },
  s0499: {
    literal:
      "\" Yet rain sacrifice to the Five Emperors has also been long practiced; I also request both rites together to complete the meaning of great rain prayer to the Emperor.",
    idiomatic:
      "\" Rain sacrifice to the Five Emperors is also ancient; I ask both rites together to complete great rain prayer to the Emperor.",
  },
  s0500: {
    literal:
      "Moreover the Zhenguan Rites in late autumn sacrifice the Five Directional Emperors and five officials at the Bright Hall; the Xianqing Rites honor August Heaven High God at the Bright Hall.",
    idiomatic:
      "The Zhenguan Rites sacrifice Five Directional Emperors and five officials at the Bright Hall in late autumn; the Xianqing Rites honor High God there.",
  },
};

const batch6 = {
  s0501: {
    literal:
      "Per the Classic of Filial Piety: \"At the suburb sacrifice to Hou Ji to consort with Heaven; at the ancestral temple sacrifice to King Wen at the Bright Hall to consort with High God.\"",
    idiomatic:
      "The Classic of Filial Piety says: \"Suburb sacrifice to Hou Ji consorts with Heaven; Bright Hall sacrifice to King Wen consorts with High God.\"",
  },
  s0502: {
    literal:
      "Former scholars held that Heaven is the spirit of the Felt Emperor, namely the Five Emperors of the Supreme Palace—all examples of asterisms.",
    idiomatic:
      "Former scholars held Heaven is the Felt Emperor's spirit—the Supreme Palace Five Emperors—all stellar examples.",
  },
  s0503: {
    literal:
      "Moreover the title High God all belongs to August Heaven; what Zheng Xuan cited all said Five Emperors.",
    idiomatic:
      "High God's title belongs to August Heaven; Zheng Xuan's citations all speak of Five Emperors.",
  },
  s0504: {
    literal:
      "The Rites of Zhou say: \"When the king is about to lodge with High God, spread felt mats and set the august lodging.\"",
    idiomatic:
      "The Rites of Zhou say: \"When the king lodges with High God, spread felt mats and set the august lodging.\"",
  },
  s0505: {
    literal: "Sacrifice to the Five Emperors—spread great and small awnings.",
    idiomatic: "Sacrificing the Five Emperors—spread great and small awnings.",
  },
  s0506: {
    literal:
      "From this speaking, High God and the Five Emperors have their own gradations—how can they be mixed into one!",
    idiomatic:
      "Thus High God and the Five Emperors have distinct ranks—how can they be mixed into one!",
  },
  s0507: {
    literal: "The Classic of Filial Piety says: \"Honoring the father, nothing is greater than consorting with Heaven.\"",
    idiomatic: "The Classic of Filial Piety says: \"Honoring the father, nothing exceeds consorting with Heaven.\"",
  },
  s0508: {
    literal:
      "Its following text immediately says: \"Ancestral sacrifice to King Wen at the Bright Hall to consort with High God.\"",
    idiomatic:
      "The next line says: \"Ancestral sacrifice to King Wen at the Bright Hall to consort with High God.\"",
  },
  s0509: {
    literal:
      "Zheng Xuan commented: \"High God is Heaven's other name; spirits have no second lord, therefore the places differ.\"",
    idiomatic:
      "Zheng Xuan commented: \"High God is Heaven's other name; spirits have no second lord, so the places differ.\"",
  },
  s0510: {
    literal: "Kong Anguo said: \"Di is also Heaven.\"",
    idiomatic: "Kong Anguo: \"Di is also Heaven.\"",
  },
  s0511: {
    literal: "\"",
    idiomatic: "\" (close of quotation).",
  },
  s0512: {
    literal: "Thus refined offering to High God fits the classic meaning.",
    idiomatic: "Refined offering to High God fits the classics.",
  },
  s0513: {
    literal:
      "Yet sacrifice to all five directions has long been practiced; where there is an established practice, it is hard to abolish at once.",
    idiomatic:
      "Sacrifice to all five directions is also ancient; established practice is hard to abolish at once.",
  },
  s0514: {
    literal:
      "I also request both rites practiced together to complete the Monthly Ordinances' meaning of great offering to the Emperor.",
    idiomatic:
      "I also ask both rites together to complete the Monthly Ordinances' great offering to the Emperor.",
  },
  s0515: {
    literal:
      "Before the fifth month of Tianbao 10, suburb sacrifices to Heaven and Earth used Founding Emperor Shenyao as consort seat; therefore before sacrificing at suburb and temple they announced at Founding Emperor Shenyao's chamber.",
    idiomatic:
      "Before Tianbao 10, fifth month, suburb sacrifices used Founding Emperor Shenyao as consort; before suburb and temple sacrifice they announced at his chamber.",
  },
  s0516: {
    literal:
      "In Baoying 1, Du Hongjian as Director of the Court of Imperial Sacrifices and ritual commissioner, with Registrar Xue Qi, Gui Chongjing, and others discussed: \"Shenyao as recipient of the Mandate is not the first enfeoffed lord and cannot be Grand Ancestor to consort with Heaven and Earth.\"",
    idiomatic:
      "In Baoying 1, ritual commissioner Du Hongjian with Registrar Xue Qi and Gui Chongjing argued: \"Shenyao received the Mandate but was not the first enfeoffed lord and cannot be Grand Ancestor consort with Heaven and Earth.\"",
  },
  s0517: {
    literal:
      "Grand Ancestor Emperor Jing first received enfeoffment in Tang—he is Yin's Qi, Zhou's Hou Ji.",
    idiomatic:
      "Grand Ancestor Emperor Jing first received Tang—he is Yin's Qi, Zhou's Hou Ji.",
  },
  s0518: {
    literal:
      "I request using Grand Ancestor Emperor Jing at suburb sacrifice to consort with Heaven and Earth; at temple announcement the libation too should be Grand Ancestor Emperor Jing's.",
    idiomatic:
      "I ask Grand Ancestor Emperor Jing consort at suburb sacrifice to Heaven and Earth and at temple announcement.",
  },
  s0519: {
    literal:
      "Remonstrance Counselor Li Gan argued that Grand Ancestor Emperor Jing was not the Mandate-receiving lord and did not fit consorting with Heaven and Earth.",
    idiomatic:
      "Remonstrance Counselor Li Gan argued Emperor Jing did not receive the Mandate and should not consort with Heaven and Earth.",
  },
  s0520: {
    literal: "In the fifth month of year 2, Gan submitted a discussion memorial in ten interrogations and ten refutations, saying:",
    idiomatic: "In year 2, fifth month, Gan submitted ten interrogations and ten refutations:",
  },
  s0521: {
    literal:
      "Collector of Texts and Runzhou Registrar Gui Chongjing's discussion and ritual commissioner Registrar Xue Qi of the Waterways Bureau said: di means winter-solstice sacrifice to Heaven at the round mound; Zhou people used remote ancestor Emperor Ku as consort—now they wish the Jing Emperor as founding ancestor to consort with August Heaven at the round mound.",
    idiomatic:
      "Gui Chongjing and ritual commissioner Xue Qi said di is winter-solstice Heaven sacrifice at the round mound; Zhou used remote ancestor Ku as consort—now they want Emperor Jing as founding ancestor to consort with August Heaven.",
  },
  s0522: {
    literal:
      "Your servant Gan interrogates: \"The Discourses of the States says: \"Youyu and Xia both di Huangdi; Shang di Shun; Zhou di Ku.\"\"",
    idiomatic:
      "Gan interrogates: \"The Discourses of the States says Youyu and Xia both di Huangdi, Shang di Shun, Zhou di Ku.\"",
  },
  s0523: {
    literal: "None speaks of sacrificing August Heaven at the round mound—one.",
    idiomatic: "None mentions sacrificing August Heaven at the round mound—first point.",
  },
  s0524: {
    literal: "The Odes, Shang Hymns, say: \"Chang Fa—a great di.\"",
    idiomatic: "The Shang Hymns say: \"Chang Fa—a great di.\"",
  },
  s0525: {
    literal: "It also does not speak of August Heaven at the round mound—two.",
    idiomatic: "It too says nothing of August Heaven at the round mound—second.",
  },
  s0526: {
    literal: "The Odes, Zhou Hymns, say: \"Yong—di to the Grand Ancestor.\"",
    idiomatic: "The Zhou Hymns say: \"Yong—di to the Grand Ancestor.\"",
  },
  s0527: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—three.",
    idiomatic: "It too says nothing of August Heaven at the round mound—third.",
  },
  s0528: {
    literal:
      "Record of Rites, Sacrifice Law: \"Youyu and Xia both di Huangdi; Yin and Zhou both di Ku.\"",
    idiomatic:
      "The Sacrifice Law says: \"Youyu and Xia di Huangdi; Yin and Zhou di Ku.\"",
  },
  s0529: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—four.",
    idiomatic: "It too says nothing of August Heaven at the round mound—fourth.",
  },
  s0530: {
    literal: "Record of Rites, Great Tradition: \"One who is not king does not perform di.\"",
    idiomatic: "The Great Tradition: \"One who is not king does not perform di.\"",
  },
  s0531: {
    literal:
      "A king di to the ancestor from whom his line issued, with that ancestor as consort.",
    idiomatic:
      "A king performs di to the ancestor from whom his line issued, with that ancestor as consort.",
  },
  s0532: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—five.",
    idiomatic: "It too says nothing of August Heaven at the round mound—fifth.",
  },
  s0533: {
    literal: "Erya, Explaining Heaven: \"Di—a great sacrifice.\"",
    idiomatic: "Erya, Explaining Heaven: di is a great sacrifice.",
  },
  s0534: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—six.",
    idiomatic: "It too says nothing of August Heaven at the round mound—sixth.",
  },
  s0535: {
    literal:
      "Family Sayings: \"All four dynasties' kings' suburban sacrifices all used consort with Heaven.\"",
    idiomatic:
      "Family Sayings: \"All four dynasties' suburban sacrifices consorted with Heaven.\"",
  },
  s0536: {
    literal: "What they call di are all five-year great sacrifices.",
    idiomatic: "What they call di are five-year great sacrifices.",
  },
  s0537: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—seven.",
    idiomatic: "It too says nothing of August Heaven at the round mound—seventh.",
  },
  s0538: {
    literal: "Lu Zhi said: \"Di—a name of sacrifice.\"",
    idiomatic: "Lu Zhi said: \"Di is a sacrifice name.\"",
  },
  s0539: {
    literal: "Di means 'to clarify'; serving the honored with clear understanding, therefore called di.",
    idiomatic: "Di means 'to clarify'; serving the honored clearly, hence di.",
  },
  s0540: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—eight.",
    idiomatic: "It too says nothing of August Heaven at the round mound—eighth.",
  },
  s0541: {
    literal: "Wang Su said: \"Di refers to the time of the five-year great sacrifice.\"",
    idiomatic: "Wang Su said: \"Di refers to the five-year great sacrifice.\"",
  },
  s0542: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—nine.",
    idiomatic: "It too says nothing of August Heaven at the round mound—ninth.",
  },
  s0543: {
    literal: "Guo Pu said: \"Di—the five-year great sacrifice.\"",
    idiomatic: "Guo Pu said: \"Di is the five-year great sacrifice.\"",
  },
  s0544: {
    literal: "It also does not speak of sacrificing August Heaven at the round mound—ten.",
    idiomatic: "It too says nothing of August Heaven at the round mound—tenth.",
  },
  s0545: {
    literal:
      "Your servant holds that di is the five-year great sacrifice of the ancestral temple; in the Odes, Rites, classics, and traditions the meaning is brilliantly clear.",
    idiomatic:
      "Gan holds di is the ancestral temple's five-year great sacrifice; Odes, Rites, classics, and traditions make this clear.",
  },
  s0546: {
    literal: "Now I briefly offer ten interrogations to clarify it.",
    idiomatic: "I briefly offer ten interrogations to clarify it.",
  },
  s0547: {
    literal:
      "Your servant sees only in Record of Rites Sacrifice Law and Great Tradition and Shang Hymns Chang Fa three places Zheng Xuan's comment—sometimes saying sacrifice to August Heaven, sometimes sacrifice to Lingwei Yang.",
    idiomatic:
      "I find only three Zheng Xuan glosses—in Sacrifice Law, Great Tradition, and Chang Fa—sometimes August Heaven, sometimes Lingwei Yang.",
  },
  s0548: {
    literal:
      "Your servant has examined the canon in detail; nowhere else is di sacrifice to August Heaven at the round mound or suburb Heaven sacrifice.",
    idiomatic:
      "I have examined the canon; nowhere else is di August Heaven at the round mound or suburb Heaven sacrifice.",
  },
  s0549: {
    literal:
      "If di is truly the greatest sacrifice, then when Confucius taught the Classic of Filial Piety as law for ten thousand generations and hundred kings, praising the Duke of Zhou's great filial piety, why did he not say di sacrifice to Emperor Ku at the round mound to consort with Heaven, but instead said \"suburb sacrifice to Hou Ji to consort with Heaven?\"",
    idiomatic:
      "If di is the greatest sacrifice, why did Confucius, teaching the Classic of Filial Piety as eternal law and praising the Duke of Zhou's filial piety, not say di to Ku at the round mound to consort with Heaven, but \"suburb sacrifice to Hou Ji to consort with Heaven?\"",
  },
  s0550: {
    literal:
      "Thus the Five Classics all lack that doctrine—the sage therefore did not speak it.",
    idiomatic:
      "The Five Classics lack that doctrine—the sage did not speak it.",
  },
  s0551: {
    literal: "To lightly discuss the great canon is also how rash!",
    idiomatic: "To lightly dispute the great canon is rash indeed.",
  },
  s0552: {
    literal: "Fearing they still do not understand, I now further make ten refutations.",
    idiomatic: "Fearing they still misunderstand, I add ten refutations.",
  },
  s0553: {
    literal: "The first refutation: Zhou Hymns: \"Yong—di sacrifice to the Grand Ancestor.\"",
    idiomatic: "First refutation: Zhou Hymns: \"Yong—di to the Grand Ancestor.\"",
  },
  s0554: {
    literal: "Zheng Xuan's commentary says: \"Di—great sacrifice. Grand Ancestor—King Wen.\"",
    idiomatic: "Zheng Xuan's commentary: \"Di—great sacrifice. Grand Ancestor—King Wen.\"",
  },
  s0555: {
    literal: "Grand Ancestor—King Wen.",
    idiomatic: "Grand Ancestor is King Wen.",
  },
  s0556: {
    literal: "Shang Hymns say: \"Chang Fa—a great di.\"",
    idiomatic: "Shang Hymns: \"Chang Fa—a great di.\"",
  },
  s0557: {
    literal: "Xuan again comments: \"Great di—sacrifice to Heaven.\"",
    idiomatic: "Xuan again: \"Great di—sacrifice to Heaven.\"",
  },
  s0558: {
    literal:
      "The Shang and Zhou hymns' texts explain each other—sometimes saying di to Grand Ancestor, sometimes great di—both are the five-year great sacrifice of the ancestral temple; examining the canon in detail, there is no other difference.",
    idiomatic:
      "Shang and Zhou hymns explain each other—di to Grand Ancestor or great di—both are the temple's five-year great sacrifice; the canon shows no other sense.",
  },
  s0559: {
    literal:
      "Sometimes di to Grand Ancestor, sometimes great di—all are the five-year great sacrifice of the ancestral temple; examining the canon in detail, there is no other difference.",
    idiomatic:
      "Whether di to Grand Ancestor or great di, both are the temple's five-year great sacrifice—the canon admits no other reading.",
  },
  s0560: {
    literal: "Only in Zheng Xuan's commentary on Chang Fa does he call it suburb sacrifice to Heaven.",
    idiomatic: "Only in Zheng Xuan's Chang Fa commentary does he call it suburb Heaven sacrifice.",
  },
  s0561: {
    literal:
      "Examining Xuan's intent in detail: because this Shang hymn's di, like the Great Tradition's saying great sacrifice, like the Spring and Autumn's \"great affair in the Grand Temple,\" like Erya's \"di—great sacrifice\"—though it says great sacrifice, it is also ancestral-temple sacrifice; can one readily call it sacrifice to Heaven?",
    idiomatic:
      "Xuan's intent: because Chang Fa's di, like \"great sacrifice\" in the Great Tradition, \"great affair in the Grand Temple\" in Spring and Autumn, and Erya's \"di—great sacrifice,\" is temple sacrifice despite \"great\"—can one call it Heaven sacrifice?",
  },
  s0562: {
    literal:
      "If as he says great di means suburb sacrifice to Heaven, then calling di means ancestral-temple sacrifice.",
    idiomatic:
      "If great di means suburb Heaven sacrifice, then di means temple sacrifice—by his own logic.",
  },
  s0563: {
    literal:
      "Moreover Sacrifice Law lists You, Xia, Shang, and Zhou di to Huangdi and Ku; Great Tradition \"not king, not di\"—above di there is no great character; why does Xuan again call it Heaven sacrifice?",
    idiomatic:
      "Sacrifice Law lists You, Xia, Shang, and Zhou di to Huangdi and Ku; \"not king, not di\" has no \"great\" above di—why does Xuan again call it Heaven sacrifice?",
  },
  s0564: {
    literal:
      "Moreover Chang Fa's text does not sing Ku and the birth-feeling emperor; thus one knows Chang Fa's di is not di to Ku and suburb Heaven sacrifice—clear.",
    idiomatic:
      "Chang Fa does not sing Ku or the birth-feeling emperor—so its di is not di to Ku or suburb Heaven sacrifice.",
  },
  s0565: {
    literal:
      "Yin and Zhou's great sacrifices to the Five Emperors—in all classics, histories, and great Confucian scholars' writings from antiquity, ordered in detail, all lack taking di as Heaven sacrifice.",
    idiomatic:
      "Yin and Zhou great sacrifices to the Five Emperors—in all classics, histories, and great scholars from antiquity—none take di as Heaven sacrifice.",
  },
  s0566: {
    literal:
      "Why abandon Zhou and Confucius' law-words and alone take Zheng Kangcheng's small comment, wishing to violate the classics and slander the sages, confusing and overturning the sacrifice canon—how erroneous!",
    idiomatic:
      "Why abandon Zhou and Confucius for Zheng Kangcheng's minor gloss, violate the classics, slander the sages, and overturn the sacrifice canon—how wrong!",
  },
  s0567: {
    literal:
      "The second refutation: the Great Tradition says \"Rites: not king, not di; a king di to the ancestor from whom his line issued, with that ancestor as consort, and feudal lords to their Grand Ancestor\"—this explains when one is king one should di.",
    idiomatic:
      "Second refutation: the Great Tradition's \"not king, not di; a king di to the ancestor from whom his line issued, with that ancestor as consort; feudal lords to their Grand Ancestor\" explains when a king should di.",
  },
  s0568: {
    literal:
      "Regarding Sacrifice Law—You, Xia, Yin, and Zhou di to Huangdi and Ku—\"not king, not di; one should di to the ancestor from whom one's line issued\" means You and Xia issued from Huangdi, Yin and Zhou from Emperor Ku, sacrificing with the near ancestor as consort.",
    idiomatic:
      "Sacrifice Law's You, Xia, Yin, and Zhou di to Huangdi and Ku: \"not king, not di\" means di to the line's issuing ancestor—You and Xia from Huangdi, Yin and Zhou from Ku, with the near ancestor as consort.",
  },
  s0569: {
    literal:
      "The issuing ancestor, having no temple of his own, came from outside; therefore like Heaven-Earth spirits, sacrifice with the ancestor as consort.",
    idiomatic:
      "The issuing ancestor, without his own temple, came from outside—like Heaven and Earth spirits, sacrifice with the ancestor as consort.",
  },
  s0570: {
    literal: "The doctrine of \"issuing\" is not only through the father; it applies to the mother as well.",
    idiomatic: "\"Issuing\" applies through the mother as well as the father.",
  },
  s0571: {
    literal: "The Zuo Tradition: Zichan said: \"Chen is our Zhou's issuing.\"",
    idiomatic: "Zuo Tradition: Zichan said: \"Chen is our Zhou's issuing.\"",
  },
  s0572: {
    literal: "Can this be called issuing from the Supreme Palace Five Emperors?",
    idiomatic: "Can this mean issuing from the Supreme Palace Five Emperors?",
  },
  s0573: {
    literal:
      "Thus \"not king, not di; a king di to the ancestor from whom his line issued, with that ancestor as consort\"—this is the meaning.",
    idiomatic:
      "Thus \"not king, not di; a king di to the ancestor from whom his line issued, with that ancestor as consort\" means this.",
  },
  s0574: {
    literal:
      "For feudal lords' di it is reduced below kings—they cannot sacrifice to the issuing ancestor, reaching only the Grand Ancestor.",
    idiomatic:
      "Feudal lords' di ranks below kings—they cannot sacrifice to the issuing ancestor, only the Grand Ancestor.",
  },
  s0575: {
    literal: "Thus \"feudal lords to their Grand Ancestor\"—this is the meaning.",
    idiomatic: "Thus \"feudal lords to their Grand Ancestor\" means this.",
  },
  s0576: {
    literal:
      "Zheng Xuan confused and divided di into three: commenting Sacrifice Law \"di means sacrifice to August Heaven at the round mound\"—one.",
    idiomatic:
      "Zheng Xuan split di into three: Sacrifice Law \"di means August Heaven at the round mound\"—first.",
  },
  s0577: {
    literal:
      "Commenting Great Tradition \"suburb sacrifice to Heaven with Hou Ji consorting with Lingwei Yang\"; commenting Shang Hymns again \"suburb sacrifice to Heaven\"—two.",
    idiomatic:
      "Great Tradition \"suburb Heaven with Hou Ji consorting Lingwei Yang\"; Shang Hymns again \"suburb Heaven\"—second.",
  },
  s0578: {
    literal:
      "Commenting Zhou Hymns \"di—great sacrifice, greater than the four seasons' sacrifices but lesser than cha; Grand Ancestor means King Wen\"—three.",
    idiomatic:
      "Zhou Hymns \"di—great sacrifice, greater than seasonal sacrifices but lesser than cha; Grand Ancestor is King Wen\"—third.",
  },
  s0579: {
    literal:
      "Di is one sacrifice; Xuan analyzed it into three, inverted and confused—all from his breast, never from canon; how can it be relied on?",
    idiomatic:
      "Di is one sacrifice; Xuan made three, inverted and confused—all invention, no canon—unreliable.",
  },
  s0580: {
    literal:
      "The third refutation: before You, Xia, Yin, and Zhou, di to the ancestor from whom the line issued—the meaning is brilliantly clear.",
    idiomatic:
      "Third refutation: before You, Xia, Yin, and Zhou, di to the issuing ancestor is clear.",
  },
  s0581: {
    literal:
      "From Han, Wei, and Jin onward for more than a thousand years the rite was wanting.",
    idiomatic:
      "From Han, Wei, and Jin onward for a thousand years the rite lapsed.",
  },
  s0582: {
    literal:
      "Moreover what Zheng Xuan said is uncanonical; former scholars discarded it and never practiced it.",
    idiomatic:
      "Zheng Xuan's words are uncanonical; former scholars discarded them and never used them.",
  },
  s0583: {
    literal:
      "I hold that confused meanings and discarded comments cannot rectify the great canon.",
    idiomatic:
      "Confused glosses and discarded comments cannot rectify the great canon.",
  },
  s0584: {
    literal:
      "The fourth refutation: what is called the Three Rites practiced in the age all is Zheng Xuan's learning—I request relying on Zheng's learning to clarify.",
    idiomatic:
      "Fourth refutation: the Three Rites in use are all Zheng Xuan's school—I ask to test by Zheng's own teaching.",
  },
  s0585: {
    literal:
      "Though it says relying on Zheng's learning, now wishing the Jing Emperor as founding ancestor's temple to consort with Heaven again departs from Zheng's meaning.",
    idiomatic:
      "Though citing Zheng, making Emperor Jing founding ancestor to consort with Heaven departs from Zheng's meaning.",
  },
  s0586: {
    literal: "How so?",
    idiomatic: "Why?",
  },
  s0587: {
    literal: "Royal Regulations say: \"The Son of Heaven has seven temples.\"",
    idiomatic: "Royal Regulations: \"The Son of Heaven has seven temples.\"",
  },
  s0588: {
    literal: "Xuan said: \"This is Zhou rite.\"",
    idiomatic: "Xuan: this is Zhou rite.",
  },
  s0589: {
    literal:
      "Seven temples: Grand Ancestor and the shrines of Wen and Wu with four intimate temples.",
    idiomatic:
      "Seven temples: Grand Ancestor, Wen and Wu shrines, and four intimate temples.",
  },
  s0590: {
    literal:
      "Yin had six temples—Qi and Tang with two zhao and two mu.",
    idiomatic:
      "Yin had six—Qi and Tang with two zhao and two mu.",
  },
  s0591: {
    literal:
      "Per Zheng's learning, Xia did not take Gun, Zhuanxu, Changyi, and the like as founding ancestors—clearly knowable.",
    idiomatic:
      "Per Zheng, Xia did not take Gun, Zhuanxu, or Changyi as founding ancestors—this is clear.",
  },
  s0592: {
    literal:
      "Yet wishing to cite Hou Ji and Qi as examples—the meaning again differs.",
    idiomatic:
      "Yet citing Hou Ji and Qi as examples—the meaning differs.",
  },
  s0593: {
    literal:
      "Tracing from remote antiquity to the present, none take a subject-minister as founding ancestor—only Yin with Qi, Zhou with Ji.",
    idiomatic:
      "From remote antiquity to the present none take a subject as founding ancestor—only Yin with Qi, Zhou with Ji.",
  },
  s0594: {
    literal:
      "Hou Ji and Qi were both sons of the Son of Heaven's primary consort, born from feeling the spirit.",
    idiomatic:
      "Hou Ji and Qi were sons of the primary consort, born from feeling the spirit.",
  },
  s0595: {
    literal:
      "Formerly Emperor Ku's secondary consort Jiandi, a woman of the Youreng clan, swallowed the dark bird's egg and thereby bore Qi.",
    idiomatic:
      "Emperor Ku's secondary consort Jiandi of Youreng swallowed the dark bird's egg and bore Qi.",
  },
  s0596: {
    literal: "When Qi grew he assisted Yu in controlling water and had great merit.",
    idiomatic: "Qi grew up assisting Yu in flood control with great merit.",
  },
  s0597: {
    literal:
      "Shun then ordered Qi as Minister of the Masses; when the hundred clans were harmonious, he was enfeoffed at Shang.",
    idiomatic:
      "Shun made Qi Minister of the Masses; when the clans were harmonious, Qi was enfeoffed at Shang.",
  },
  s0598: {
    literal:
      "Thus the Odes say: \"Heaven ordered the dark bird; it descended and bore Shang; it dwelt in the vast Yin soil.\"",
    idiomatic:
      "The Odes say: \"Heaven ordered the dark bird; it descended and bore Shang; it dwelt in vast Yin soil.\"",
  },
  s0599: {
    literal: "This is the meaning.",
    idiomatic: "That is the sense.",
  },
  s0600: {
    literal:
      "Hou Ji: his mother was a woman of the Youtai clan named Jiang Yuan, consort of Emperor Ku; going into the wild she trod a great footprint, was moved and became pregnant, and bore Ji.",
    idiomatic:
      "Hou Ji's mother was Youtai clanswoman Jiang Yuan, consort of Emperor Ku; in the wild she trod a great footprint, conceived, and bore Ji.",
  },
};

function validate(obj, start, end) {
  for (let n = start; n <= end; n++) {
    const id = `s${String(n).padStart(4, '0')}`;
    const e = obj[id];
    if (!e?.literal?.trim() || !e?.idiomatic?.trim()) throw new Error(`Missing ${id}`);
    if (e.literal === e.idiomatic) throw new Error(`${id}: literal === idiomatic`);
  }
}

validate(batch5, 401, 500);
validate(batch6, 501, 600);

writeFileSync('translations/_ch021-batch5.json', JSON.stringify(batch5, null, 2) + '\n');
writeFileSync('translations/_ch021-batch6.json', JSON.stringify(batch6, null, 2) + '\n');
console.log('Wrote batch5:', Object.keys(batch5).length, 'batch6:', Object.keys(batch6).length);
