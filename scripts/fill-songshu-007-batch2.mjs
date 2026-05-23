#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0101: {
    literal: 'Prince of Jian\'an Xiuren was made General of the Guard.',
    idiomatic: 'Prince of Jian\'an Xiuren was appointed General of the Guard.',
  },
  s0102: {
    literal: 'On the day jimao, Administrator of Dongyang Wang Zao was imprisoned and died.',
    idiomatic: 'On jimao Administrator of Dongyang Wang Zao was thrown into prison and died there.',
  },
  s0103: {
    literal: 'The palace woman Worthy Consort Xie was made Lady, with Tiger Guards bearing halberds, imperial carriage and dragon banners, going out and in with imperial escort; she was in fact Princess of Xincai.',
    idiomatic: 'The palace woman Worthy Consort Xie was made a Lady, granted Tiger Guards with halberds, an imperial carriage and dragon banners, and escort when going out and in—she was in fact Princess of Xincai.',
  },
  s0104: {
    literal: 'On the day yiyou, General Who Pacifies the West and Inspector of Yu Prince of Shanyang Xiuyou was made General Who Pacifies the Army and given an office equal in ceremonial honor to the Three Dukes.',
    idiomatic: 'On yiyou General Who Pacifies the West and Inspector of Yu Prince of Shanyang Xiuyou was promoted to General Who Pacifies the Army with an office equal in ceremonial honor to the Three Dukes.',
  },
  s0105: {
    literal: '[14] In all editions "General Who Pacifies the West" reads "General Who Pacifies the North"; corrected per Xiuyou\'s biography and the ninth-month xinhai entry.',
    idiomatic: '[14] All editions had "General Who Pacifies the North" where the text should read General Who Pacifies the West; the correction follows Prince of Shanyang Xiuyou\'s biography and the ninth-month xinhai entry.',
  },
  s0106: {
    literal: 'In the eleventh month, on the day renchen, General Who Pacifies the North He Mai was imprisoned and died.',
    idiomatic: 'In the eleventh month, on renchen, General Who Pacifies the North He Mai was imprisoned and died.',
  },
  s0107: {
    literal: 'The newly appointed Grand Marshal Shen Qingzhi died.',
    idiomatic: 'Shen Qingzhi, who had just been appointed Grand Marshal, died.',
  },
  s0108: {
    literal: 'On the day renyin, Lady Lu was established as empress, with music in all four side-halls.',
    idiomatic: 'On renyin Lady Lu was installed as empress, with music performed in all four side-halls.',
  },
  s0109: {
    literal: 'Yang and Southern Xu provinces were granted amnesty.',
    idiomatic: 'An amnesty was granted to Yang and Southern Xu provinces.',
  },
  s0110: {
    literal: 'General of the Guard Prince of Jian\'an Xiuren was given the additional titles of Special Grand Master and Left Honored Grandee.',
    idiomatic: 'General of the Guard Prince of Jian\'an Xiuren was made Special Grand Master and Left Honored Grandee.',
  },
  s0111: {
    literal: 'Colonel of the Palace Guard Prince of Guiyang Xiufan was transferred to another post.',
    idiomatic: 'Colonel of the Palace Guard Prince of Guiyang Xiufan was reassigned.',
  },
  s0112: {
    literal: 'On the day dingwei, a prince was born—it was the son of Director of the Palace Treasury Liu Sheng.',
    idiomatic: 'On dingwei a prince was born, said to be the son of Director of the Palace Treasury Liu Sheng.',
  },
  s0113: {
    literal: '[15] A general amnesty was proclaimed throughout the realm.',
    idiomatic: '[15] A general amnesty was proclaimed.',
  },
  s0114: {
    literal: 'Corruption, licentiousness, and theft were all remitted.',
    idiomatic: 'Offenses of corruption, licentiousness, and theft were all pardoned.',
  },
  s0115: {
    literal: 'Those who became heirs for their fathers were granted one rank in nobility.',
    idiomatic: 'Those who had become heirs to their fathers were granted one noble rank.',
  },
  s0116: {
    literal: 'On the day renzi, Special Grand Master, Left Honored Grandee, and General of the Guard Prince of Jian\'an Xiuren was made Grand Marshal Who Pacifies the Cavalry with an office equal in ceremonial honor to the Three Dukes.',
    idiomatic: 'On renzi Special Grand Master, Left Honored Grandee, and General of the Guard Prince of Jian\'an Xiuren was appointed Grand Marshal Who Pacifies the Cavalry with an office equal in ceremonial honor to the Three Dukes.',
  },
  s0117: {
    literal: 'On the day wuwu, Prince of Nanping Jingyou, Prince of Luling Jingxian, and Marquis of Annan Jingyuan were all ordered to die.',
    idiomatic: 'On wuwu Prince of Nanping Jingyou, Prince of Luling Jingxian, and Marquis of Annan Jingyuan were all ordered to take their own lives.',
  },
  s0118: {
    literal: 'At this time the emperor\'s ferocity and perversity grew daily; executions followed one upon another, and within and without the hundred offices none could keep his head.',
    idiomatic: 'By then the emperor\'s cruelty and perversity grew worse by the day. Executions came one after another, and throughout the court no officeholder could be sure of keeping his head.',
  },
  s0119: {
    literal: 'Earlier a false report had said: "A Son of Heaven will arise in Xiang.',
    idiomatic: 'Earlier a rumor had spread: "A Son of Heaven will arise in Xiang."',
  },
  s0120: {
    literal: '" The emperor intended to tour Jing and Xiang provinces in the south to suppress it.',
    idiomatic: 'The emperor planned a southern tour of Jing and Xiang provinces to counter the omen.',
  },
  s0121: {
    literal: 'He first wished to execute all his uncles, and only then set out on the journey.',
    idiomatic: 'He meant first to kill all his uncles and only then depart on the tour.',
  },
  s0122: {
    literal: 'Taizong secretly joined with his attendants Ruan Tianfu, Wang Daolong, and Li Dao\'er to bind eleven men among the emperor\'s close attendants, including Shou Jizhi and Jiang Chanzhi, in a plot to depose the emperor together.',
    idiomatic: 'Taizong secretly allied with his attendants Ruan Tianfu, Wang Daolong, and Li Dao\'er to win over eleven of the emperor\'s close attendants, including Shou Jizhi and Jiang Chanzhi, in a joint plot to depose him.',
  },
  s0123: {
    literal: 'At midnight on the day wuwu, the emperor was at Bamboo Grove Hall in Hualin Garden shooting at ghosts.',
    idiomatic: 'At midnight on wuwu the emperor was in Bamboo Grove Hall at Hualin Garden, shooting at ghosts.',
  },
  s0124: {
    literal: 'At the time the shamans said: "This hall has ghosts.',
    idiomatic: 'Shamans had said, "This hall is haunted."',
  },
  s0125: {
    literal: '" Therefore the emperor shot at them himself.',
    idiomatic: 'So the emperor went to shoot at them himself.',
  },
  s0126: {
    literal: 'Shou Jizhi entered straight in with a knife concealed on his person; Jiang Chanzhi was his second.',
    idiomatic: 'Shou Jizhi entered directly with a knife hidden on his person, with Jiang Chanzhi as his second.',
  },
  s0127: {
    literal: 'The emperor tried to flee; Jizhi pursued him and killed him.',
    idiomatic: 'The emperor tried to run; Jizhi pursued him and struck him down.',
  },
  s0128: {
    literal: 'He was seventeen years old.',
    idiomatic: 'He was seventeen.',
  },
  s0129: {
    literal: 'The Grand Empress Dowager issued an order saying:',
    idiomatic: 'The Grand Empress Dowager issued an edict, saying:',
  },
  s0130: {
    literal: 'Minister of Works, General of the Guard, and the Eight Excellencies: though Ziye is called the legitimate eldest son, from youth he received a vicious nature; unkind and unfilial, this has been evident since he was a child.',
    idiomatic: 'To the Minister of Works, General of the Guard, and the Eight Excellencies: though Ziye is called the legitimate eldest son, from childhood he has shown a vicious nature—unkind and unfilial, evident since he was a boy.',
  },
  s0131: {
    literal: 'When Emperor Xiaowu left the world, the succession fell to him in its season.',
    idiomatic: 'When Emperor Xiaowu died, the throne passed to him in due season.',
  },
  s0132: {
    literal: 'From the time the imperial coffin lay in mourning, his face was calm and pleased; heaven\'s punishment doubled his separation, and his wanton joy grew ever greater.',
    idiomatic: 'From the moment the imperial coffin lay in state his face was calm and pleased; though heaven had doubled his bereavement, his wanton joy only grew.',
  },
  s0133: {
    literal: 'Forced by inner and outer constraints to hold back, his cruelty was not yet exposed; but his savage brutality could not be checked, and in a single day he unleashed disaster, wantonly slaughtering the chief ministers and destroying the assisting ministers.',
    idiomatic: 'Pressed by constraints within and without, he still hid his cruelty for a time; but his savage brutality could not be restrained, and in one day he unleashed catastrophe—murdering the chief ministers and destroying his chief advisers.',
  },
  s0134: {
    literal: 'Ziluan and his brothers were dearly loved by the late emperor; nursing old grievances, he wrongly subjected them to cruel slaughter.',
    idiomatic: 'Ziluan and his brothers had been dearly loved by the late emperor; nursing old resentments, the emperor wrongly put them to cruel death.',
  },
  s0135: {
    literal: 'Chang, a close kinsman, made a defense; yet he was attacked and punished without cause.',
    idiomatic: 'Chang, a close kinsman, had stood on his defense, yet was attacked and punished without cause.',
  },
  s0136: {
    literal: 'Princess of Xincai was torn from her husband\'s clan, shut away in the deep palace, and falsely reported to have died.',
    idiomatic: 'Princess of Xincai was torn from her husband\'s family, shut in the inner palace, and falsely announced to have died.',
  },
  s0137: {
    literal: 'The mourning for the late emperor had barely ended when funeral rites were abruptly cast aside; drunken through the long night, the myriad affairs of state were abandoned.',
    idiomatic: 'Hardly had mourning for the late emperor begun when funeral rites were cast aside; drunk through the long night, he let the affairs of state fall away.',
  },
  s0138: {
    literal: 'Court worthies and old merit-holders he cast off like discarded earth.',
    idiomatic: 'Court worthies and old merit-holders he discarded like thrown-away soil.',
  },
  s0139: {
    literal: 'Pipes and strings never ceased; delicacies filled every meal.',
    idiomatic: 'Music never ceased; every meal was heaped with delicacies.',
  },
  s0140: {
    literal: 'He cursed and insulted his ancestors, taking it as sport.',
    idiomatic: 'He cursed and insulted his ancestors for amusement.',
  },
  s0141: {
    literal: 'His travels knew no stop; his lewdness and excess had no limit.',
    idiomatic: 'His wanderings knew no end; his lewdness and excess had no bounds.',
  },
  s0142: {
    literal: 'He feasted freely in the imperial parks and tombs and plotted to excavate them.',
    idiomatic: 'He feasted in the imperial parks and tombs and plotted to dig them up.',
  },
  s0143: {
    literal: 'He executed and cut down the innocent and seized women by force.',
    idiomatic: 'He killed the innocent and seized women by force.',
  },
  s0144: {
    literal: 'He set up false attendants, and no one knew whose child they were.',
    idiomatic: 'He installed false attendants whose parentage no one could tell.',
  },
  s0145: {
    literal: 'In appointing consorts and establishing an empress, the celebrations exceeded the constant statutes.',
    idiomatic: 'In appointing consorts and raising an empress, the celebrations exceeded all precedent.',
  },
  s0146: {
    literal: 'Toward kinsmen of the imperial clan he behaved as toward maidservants, beating and dragging them with no regard for rank.',
    idiomatic: 'Toward imperial kinsmen he acted as toward maidservants, beating and dragging them without regard for rank.',
  },
  s0147: {
    literal: 'The house of Nanping alone received his cruelty in special measure.',
    idiomatic: 'The house of Nanping alone bore the full brunt of his cruelty.',
  },
  s0148: {
    literal: 'He turned against heaven and extinguished principle; his open violence had ten thousand forms.',
    idiomatic: 'He turned against heaven and extinguished moral principle; his open violence took ten thousand forms.',
  },
  s0149: {
    literal: 'Harsh punishments and cruel ordinances knew no end or limit; Xia Jie and Yin Xin would not suffice for comparison.',
    idiomatic: 'Harsh punishments and cruel ordinances knew no limit; not even Xia Jie and King Zhou of Shang would suffice for comparison.',
  },
  s0150: {
    literal: 'The whole court was fearful; no man could preserve his life; the common people were in panic, with nowhere to set hand or foot.',
    idiomatic: 'The whole court trembled and no man could be sure of his life; the people were in panic, with nowhere to set hand or foot.',
  },
  s0151: {
    literal: 'His conduct was filthy as a beast\'s; his offenses filled the three thousand categories.',
    idiomatic: 'His conduct was filthier than a beast\'s; his offenses filled every category of crime.',
  },
  s0152: {
    literal: 'The enterprise of the High Ancestor was about to perish; the sacrifices of the seven temples were nearly cut off.',
    idiomatic: 'The founding emperor\'s enterprise was nearly extinguished; the sacrifices of the seven temples were almost cut off.',
  },
  s0153: {
    literal: 'I am old and my illness deep; each day I foresee calamity and poison; worry burns through every moment, and my breath and life will not long remain.',
    idiomatic: 'I am old and gravely ill; each day I foresee disaster; worry consumes every moment, and my life will not long endure.',
  },
  s0154: {
    literal: 'Since the opening of the age, such a thing has never been heard.',
    idiomatic: 'Since the beginning of the age, nothing like this has ever been heard.',
  },
  s0155: {
    literal: 'Near and far yearn to rise up; nine houses in ten.',
    idiomatic: 'Near and far the people yearn to rise up—nine households in ten.',
  },
  s0156: {
    literal: 'General of the Guard Prince of Xiangdong Yu derives his person from the Great Ancestor; heaven endowed him with heroic sagacity; Emperor Wen cherished him, and his favor surpassed all the other princes.',
    idiomatic: 'General of the Guard Prince of Xiangdong Yu descends from the Great Ancestor; heaven endowed him with heroic sagacity, and Emperor Wen cherished him above all other princes.',
  },
  s0157: {
    literal: 'I early recognized his divine keenness and treated him with special courtesy beyond the ordinary.',
    idiomatic: 'I recognized his keen intelligence early and treated him with courtesy beyond the ordinary.',
  },
  s0158: {
    literal: 'He secretly carried out a great design; men of righteousness flung aside their sleeves; once the tyrant had fallen, his head hung from the white flag; the altars of state were renewed, the ancestral temple made secure forever; men and spirits turned their hearts to him, and the great mandate was justly gathered.',
    idiomatic: 'He secretly carried out a great design; men of righteousness answered the call; once the tyrant had fallen, his head hung from the white flag; the altars were renewed and the ancestral temple secured; men and spirits turned to him, and the great mandate was justly his.',
  },
  s0159: {
    literal: 'Moreover his merit and virtue are high and far; the great enterprise returns to him; he should follow Han and Jin and succeed to the imperial apex.',
    idiomatic: 'His merit and virtue are lofty; the great enterprise belongs to him; he should follow the precedents of Han and Jin and ascend the imperial throne.',
  },
  s0160: {
    literal: 'Those in charge should examine the old statutes and carry them out in timely fashion.',
    idiomatic: 'Let those in charge examine the old statutes and carry them out in timely fashion.',
  },
  s0161: {
    literal: 'I, the not-yet-dead, in my remaining years have unhappily encountered this hundredfold calamity; forever recalling the circumstances, though I live it is as if I had perished.',
    idiomatic: 'I, who am not yet dead, in my remaining years have met this hundredfold calamity; whenever I recall what has happened, though I still live I am as one already dead.',
  },
  s0162: {
    literal: 'What is to be done!',
    idiomatic: 'What can be done!',
  },
  s0163: {
    literal: 'What can be done now!',
    idiomatic: 'What is left to be done!',
  },
  s0164: {
    literal: 'The Deposed Emperor was buried west of the southern suburban altar in Moling county, Danyang.',
    idiomatic: 'They buried the Deposed Emperor west of the southern suburban altar in Moling county, Danyang.',
  },
  s0165: {
    literal: 'The emperor from youth was narrow and quick-tempered; in the Eastern Palace he was often rebuked by Shizu.',
    idiomatic: 'From childhood the emperor was narrow and quick-tempered; in the Eastern Palace Shizu often rebuked him.',
  },
  s0166: {
    literal: 'When Shizu toured the west, Ziye submitted reports on attending to his health and daily routine; his writing was careless, and the emperor questioned and reproached him.',
    idiomatic: 'When Shizu toured the west, Ziye sent memorials on attending to his health and routine; his handwriting was careless, and the emperor questioned and reproached him.',
  },
  s0167: {
    literal: 'Ziye submitted a memorial apologizing; the emperor again replied: "Your writing does not improve—this is one matter alone.',
    idiomatic: 'Ziye submitted a memorial of apology; the emperor replied again: "Your writing never improves—that is one thing alone.',
  },
  s0168: {
    literal: 'I hear you have always been idle and lax, and your perversity grows worse day by day—why are you so obstinately stubborn!"',
    idiomatic: 'I hear you have always been idle and lax, and your perversity grows worse by the day—why must you be so stubbornly set in your ways!"',
  },
  s0169: {
    literal: '" When he first ascended the throne and received the seal and ribbon, he showed no grieving countenance.',
    idiomatic: 'When he first ascended the throne and received the seal and ribbon, his face showed no grief.',
  },
  s0170: {
    literal: 'At first he still found the great ministers and Dai Faxing difficult to deal with; once Faxing had been killed, none of the great ministers was not shaken with fear.',
    idiomatic: 'At first he still found the great ministers and Dai Faxing hard to manage; once Faxing was killed, every great minister trembled with fear.',
  },
  s0171: {
    literal: 'Then he also executed the host of nobles.',
    idiomatic: 'Then he executed the whole company of nobles as well.',
  },
  s0172: {
    literal: 'From Yuan Kai downward, all were beaten and dragged about.',
    idiomatic: 'From Yuan Kai on down, every one of them was beaten and dragged about.',
  },
  s0173: {
    literal: 'Within and without there was peril; the palace offices were in uproar.',
    idiomatic: 'Within and without the court was in peril; the palace offices were in uproar.',
  },
  s0174: {
    literal: 'When the Empress Dowager first fell gravely ill, she sent to summon the emperor.',
    idiomatic: 'When the Empress Dowager first fell gravely ill, she sent for the emperor.',
  },
  s0175: {
    literal: 'The emperor said: "Sickrooms have many ghosts—it is fearful; how could I go there?"',
    idiomatic: 'The emperor said, "Sickrooms are full of ghosts—it is frightening; how could I go there?"',
  },
  s0176: {
    literal: 'The Empress Dowager grew angry and told her attendants: "Bring a knife and cut open my belly—how could I have borne such a precious little darling!"',
    idiomatic: 'The Empress Dowager flew into a rage and told her attendants, "Bring a knife and cut open my belly—how could I have given birth to such a precious darling!"',
  },
  s0177: {
    literal: '" Several days after the Empress Dowager died, the emperor dreamed that the Empress Dowager said to him: "You are unfilial and unkind; you never had the appearance of a ruler.',
    idiomatic: 'Several days after the Empress Dowager died, the emperor dreamed that she said to him, "You are unfilial and unkind; you never had the look of a Son of Heaven.',
  },
  s0178: {
    literal: 'Zishang is so foolish and perverse that he too is not within the span of fortune\'s favor.',
    idiomatic: 'Zishang is so foolish and perverse that even he lies outside the span of fortune\'s favor.',
  },
  s0179: {
    literal: 'Emperor Xiaowu was dangerous and cruel and extinguished the Way; resentment bound men and spirits; though he had many sons, none had heaven\'s mandate.',
    idiomatic: 'Emperor Xiaowu was dangerous, cruel, and extinguished the Way; his deeds bound resentment among men and spirits; though he had many sons, none possessed heaven\'s mandate.',
  },
  s0180: {
    literal: 'The great fortune returns to the sons of Emperor Wen."',
    idiomatic: 'The great fortune belongs to the sons of Emperor Wen."',
  },
  s0181: {
    literal: '" Afterward Prince of Xiangdong Yu succeeded to the throne—and he was indeed a son of Emperor Wen.',
    idiomatic: 'Afterward Prince of Xiangdong Yu succeeded to the throne—and he was indeed a son of Emperor Wen.',
  },
  s0182: {
    literal: 'Therefore the emperor gathered his uncles in the capital, fearing they would become a threat if left outside.',
    idiomatic: 'For this reason the emperor gathered his uncles in the capital, fearing trouble if they remained outside.',
  },
  s0183: {
    literal: 'Princess of Shanyin was licentious beyond measure and said to the emperor: "Your subject and Your Majesty, though male and female differ, both owe our bodies to the late emperor.',
    idiomatic: 'Princess of Shanyin was licentious beyond all bounds and said to the emperor, "Your Majesty and I, though man and woman differ, both owe our bodies to the late emperor.',
  },
  s0184: {
    literal: 'Your Majesty has ten thousand women in the six palaces, while I have only one husband by marriage.',
    idiomatic: 'Your Majesty has ten thousand women in the six palaces, while I have only one husband.',
  },
  s0185: {
    literal: 'The affair is so unequal—how can it have come to this!"',
    idiomatic: 'The disparity is so great—how can it have come to this!"',
  },
  s0186: {
    literal: '" The emperor then set up thirty male favorites at her left and right;',
    idiomatic: 'The emperor then provided her with thirty male favorites at her left and right;',
  },
  s0187: {
    literal: 'her rank was advanced to Princess of Kuaiji commandery with precedence equal to a prince of a commandery, with a bath-and-music fief of two thousand households, [16] one set of martial music granted, and twenty ceremonial swords added.',
    idiomatic: 'she was advanced to Princess of Kuaiji commandery with rank equal to a commandery prince, granted a bath-and-music fief of two thousand households, [16] given one set of martial music, and twenty ceremonial swords besides.',
  },
  s0188: {
    literal: 'Whenever the emperor went out, she commonly shared the imperial carriage with the court ministers.',
    idiomatic: 'Whenever the emperor went out, she commonly rode in the same carriage as the court ministers.',
  },
  s0189: {
    literal: 'The princess, finding Lang of the Ministry of Personnel Chu Yuan handsome, asked the emperor that he serve her; the emperor consented.',
    idiomatic: 'The princess, finding Lang of the Ministry of Personnel Chu Yuan handsome, asked the emperor to let him attend her; the emperor agreed.',
  },
  s0190: {
    literal: 'Yuan attended the princess for ten days, was fully subjected to coercion, swore he would rather die than yield, and so was released.',
    idiomatic: 'Yuan attended her for ten days, was pressed in every way, swore he would die rather than yield, and was at last released.',
  },
  s0191: {
    literal: 'The eunuch Hua Yuan\'er, whom the emperor favored, reached the post of Regular Attendant of Scattered Cavalry and was made a general with a commandery attached.',
    idiomatic: 'The eunuch Hua Yuan\'er, whom the emperor favored, rose to Regular Attendant of Scattered Cavalry and was made a general with a commandery attached.',
  },
  s0192: {
    literal: 'The emperor from youth loved reading [17] and knew many ancient matters; he himself composed Shizu\'s dirge and miscellaneous pieces, which often had literary color.',
    idiomatic: 'From youth the emperor loved reading [17] and knew many stories of antiquity; he himself composed Shizu\'s dirge and other pieces, which often showed literary polish.',
  },
  s0193: {
    literal: 'Because Emperor Wu of Wei had the offices of Director Who Opens Tombs and Colonel Who Seizes Gold, he established these two offices.',
    idiomatic: 'Because Cao Cao had created the offices of Director Who Opens Tombs and Colonel Who Seizes Gold, he established these two posts.',
  },
  s0194: {
    literal: 'Prince of Jian\'an Xiuren and Prince of Shanyang Xiuyou were put in charge of them.',
    idiomatic: 'Prince of Jian\'an Xiuren and Prince of Shanyang Xiuyou were placed in charge of them.',
  },
  s0195: {
    literal: '[18] His remaining deeds are set forth separately in the various biographies.',
    idiomatic: '[18] His other deeds are recorded separately in the various biographies.',
  },
  s0196: {
    literal: 'The historian says: The deeds of the Deposed Emperor are set forth in this chapter.',
    idiomatic: 'The historian comments: The Deposed Emperor\'s deeds are already plain in this chapter.',
  },
  s0197: {
    literal: 'As for King Wu numbering the offenses of King Zhou of Shang, he could not bind up one part in ten thousand;',
    idiomatic: 'When King Wu counted the offenses of King Zhou of Shang, he could not capture one ten-thousandth of them;',
  },
  s0198: {
    literal: 'when Huo Guang wrote the faults of Marquis of Haihun, he did not suffice to raise one hair\'s breadth of them.',
    idiomatic: 'when Huo Guang recorded the faults of the Marquis of Haihun, he did not suffice to note one hair\'s breadth of them.',
  },
  s0199: {
    literal: 'Suppose a ruler of middling talent had one of these—it would be enough to overthrow the altars and ruin the clan, defile the palace and flood the temple; how much more when all these evils were gathered in a single person\'s body!',
    idiomatic: 'Had a ruler of middling talent shown even one such trait, it would have been enough to overthrow the altars, ruin the clan, and defile palace and temple—how much more when every such evil was gathered in one man\'s person!',
  },
  s0200: {
    literal: 'That he escaped destruction was also a piece of good fortune.',
    idiomatic: 'That the dynasty escaped destruction at his hands was itself a kind of fortune.',
  },
};

let n = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    n++;
  }
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Filled ${n} sentences`);
