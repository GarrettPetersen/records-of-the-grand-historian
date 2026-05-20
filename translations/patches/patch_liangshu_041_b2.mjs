#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Before his term of office had ended he died in the commandery, aged forty-one.',
    'He had not finished his tenure when he died in office, at the age of forty-one.',
  ],
  s0102: [
    'His posthumous title was Marquis Zi.',
    'After death he was given the posthumous title Marquis Zi.',
  ],
  s0103: [
    'Cheng was by nature spare and dignified, with unstudied grace.',
    'Cheng was naturally reserved and noble in bearing, with a style all his own.',
  ],
  s0104: [
    'At the time Zhu Yi of the Right Guard held power at court; whenever he was off duty, carriages and horses choked his gate.',
    'In those days Zhu Yi of the Right Guard dominated the government, and on every day he was free from court, horses and carriages packed his doorway.',
  ],
  s0105: [
    'There was a man of Wei commandery named Shen Ying who loved bold and lofty talk; he offended the powerful and would often point at Yi\'s gate and say, "This crowd presses in upon itself—all come for profit.',
    'A man of Wei commandery named Shen Ying loved startling words and high argument; he crossed those in power and would point at Yi\'s gate and say, "They crowd in here like spokes on a hub—every one of them comes for gain.',
  ],
  s0106: [
    'Those who can stay away are only the Greater and Lesser Wangs of Dongyang."',
    'The only ones who can keep away are the Greater and Lesser Wangs of Dongyang."',
  ],
  s0107: [
    '"The Lesser Dongyang" was Cheng\'s younger brother Zhi.',
    '"The Lesser Dongyang" meant Cheng\'s younger brother Zhi.',
  ],
  s0108: [
    'At the time only the Cheng brothers and Chu Xiang did not visit Yi\'s gate, and men of the day praised them for it.',
    'In that age only the Cheng brothers and Chu Xiang refused Yi\'s door, and their contemporaries honored them for it.',
  ],
  s0109: [
    'Chu Xiang, courtesy name Shiju, was a native of Yangdi in Henan.',
    'Chu Xiang, styled Shiju, came from Yangdi in Henan.',
  ],
  s0110: [
    'His great-grandfather Yuan was Qi Grand Preceptor, Duke Wenjian, who aided in establishing the Qi house.',
    'His great-grandfather Yuan had been Grand Preceptor of Qi and Duke Wenjian, a man who helped found the Qi dynasty.',
  ],
  s0111: [
    'His grandfather Qin was Minister of Ceremonies, posthumously Mu.',
    'His grandfather Qin was Minister of Ceremonies and bore the posthumous name Mu.',
  ],
  s0112: [
    'His father Xiang, styled Jingzheng.',
    'His father Xiang, styled Jingzheng.',
  ],
  s0113: [
    'When only a few years old his parents died in succession; Xiang mourned with such devastation that he seemed already a grown man, and kinsmen and neighbors marveled at him.',
    'While still a child he lost both parents in turn; Xiang grieved with a ruin so complete that he seemed already adult, and all who knew him were astonished.',
  ],
  s0114: [
    'When grown he was refined and possessed great capacity.',
    'As a man he was cultivated and measured, with breadth of character.',
  ],
  s0115: [
    'When the Founding Emperor took the throne, Xiang was selected as a national university student.',
    'When the Founding Emperor ascended, Xiang was chosen for the national university.',
  ],
  s0116: [
    'He began office as secretary gentleman and rose through crown prince groom and attendant in the Secretariat\'s Bureau of Audience.',
    'He entered service as a secretary gentleman, then advanced through crown prince groom and attendant in the secretariat\'s bureau of audience.',
  ],
  s0117: [
    'He went out as interior minister of Ancheng.',
    'He was sent out as interior minister of Ancheng.',
  ],
  s0118: [
    'On returning he was made crown prince groom and household aide, and in time advanced to recorder on the grand marshal\'s staff, yellow gate attendant, and chief steward to the Prince of Yu of Yuzhang.',
    'Recalled, he became crown prince groom and household aide, and in due course rose to recorder on the grand marshal\'s staff, yellow gate attendant, and chief steward to the Prince of Yu of Yuzhang.',
  ],
  s0119: [
    'Shortly he entered office as acting attendant.',
    'Before long he entered the palace as acting attendant.',
  ],
  s0120: [
    'Xiang\'s bearing was elegant and his brows and eyes finely drawn; whenever he took his place at court the assembly would turn to look at him.',
    'Xiang\'s carriage was poised and handsome, his brows and eyes delicately marked; whenever he stood in the court ranks the whole assembly would gaze at him.',
  ],
  s0121: [
    'In the fourth year of Datong he went out as chief steward to the Prince of Luling, general of distant appeasement.',
    'In the fourth year of Datong he was sent out as chief steward to the Prince of Luling, bearing the rank of general of distant appeasement.',
  ],
  s0122: [
    'In the third year he died in office.',
    'Three years later he died in his post.',
  ],
  s0123: [
    'His cousin on his mother\'s side Xie Ju wrote the tomb inscription, which in summary says: "Hongzhi pushed brilliance, Zisong shrank from measuring;',
    'His maternal cousin Xie Ju composed the tomb epitaph, which in brief runs: "Hongzhi advanced his splendor, Zisong blushed at his measure;',
  ],
  s0124: [
    'wine returned beneath the moon, wind cleared upon the zither."',
    'wine came home under the moon, wind grew clear upon the zither."',
  ],
  s0125: [
    'Critics held that the likeness was well caught.',
    'Critics agreed that the portrait hit the man.',
  ],
  s0126: [
    'At first Xiang was a national university student and took top rank.',
    'Xiang had begun as a student in the national university and placed at the head of his class.',
  ],
  s0127: [
    'He entered mourning for his father.',
    'He then went into mourning for his father.',
  ],
  s0128: [
    'When mourning ended he was appointed secretary gentleman and rose through crown prince groom and recorder to the Prince of Xuancheng.',
    'When mourning was over he was made secretary gentleman and advanced through crown prince groom and recorder to the Prince of Xuancheng.',
  ],
  s0129: [
    'In the fifth year of Zhongdatong the Founding Emperor feasted the ministers at the Park of Joyous Excursion and issued a separate edict that Xiang and Wang Xun compose twenty-rhyme poems, to be completed within three quarters of an hour.',
    'In the fifth year of Zhongdatong the Founding Emperor gave a feast for his ministers in the Park of Joyous Excursion and by special edict ordered Xiang and Wang Xun each to compose a twenty-rhyme poem within three quarters of an hour.',
  ],
  s0130: [
    'Xiang presented his while still seated; the Founding Emperor was struck with wonder and that same day made him literary adjutant to the Prince of Xuancheng, and soon afterward promoted him to companion.',
    'Xiang read his while still seated; the Founding Emperor marveled and that same day made him literary adjutant to the Prince of Xuancheng, and soon raised him to companion.',
  ],
  s0131: [
    'At that time a companion and literary adjutant to the Prince of Xuancheng ranked two grades above those of other princes—therefore Xiang was raised above them, and the talk of the day praised the appointment.',
    'In those days a companion and literary adjutant to the Prince of Xuancheng stood two grades higher than the same posts under other princes, so Xiang was promoted above the usual level, and public opinion applauded the choice.',
  ],
  s0132: [
    'He went out as administrator of Yixing.',
    'He was sent out as administrator of Yixing.',
  ],
  s0133: [
    'In office Xiang kept himself pure, cut redundant severity, and abolished wasteful expense, and the people lived in peace.',
    'As magistrate he kept his person clean, pared away harsh excess, and stripped off empty expenditure, and the people found rest.',
  ],
  s0134: [
    'West of the prefecture at the pavilion stood an ancient tree that for many years had been dead;',
    'West of the city at the district pavilion stood an ancient tree that had been dead for many years;',
  ],
  s0135: [
    'when Xiang reached the commandery it suddenly put forth branches and leaves again, and the people all took it as a sign stirred by good government.',
    'when Xiang arrived it suddenly put out branches and leaves again, and the people all believed good rule had moved heaven.',
  ],
  s0136: [
    'When his term was full, officials and commoners went to the capital to petition for his return, and an edict granted it.',
    'When his term ended, officials and commoners went to the capital to ask that he be kept on, and an edict allowed it.',
  ],
  s0137: [
    'Soon he was recalled as director in the Ministry of Personnel; when he left the commandery, old and young alike pursued him to the border, weeping and bowing farewell.',
    'Before long he was summoned as director in the ministry of personnel; as he left the commandery, young and old followed him to the border, weeping and bowing him out.',
  ],
  s0138: [
    'In the lower selection Xiang was fair and would not bend for favor or connection, and was styled equitable.',
    'In the lower appointments he was upright and would not shift his judgment for petitions or connections, and men called him even-handed.',
  ],
  s0139: [
    'Soon he was promoted to attendant; before long he became attendant at large and superintendent of the Feathered Forest, attending the eastern palace.',
    'Soon he was made attendant; shortly afterward he became attendant at large and superintendent of the feathered forest, serving the eastern palace.',
  ],
  s0140: [
    'He went out as administrator of Jinling; before his term was complete he was dismissed on public grounds.',
    'He went out as administrator of Jinling; before his term was finished he was removed on official grounds.',
  ],
  s0141: [
    'Before long he was again attendant at large, attending the eastern palace.',
    'Before long he was again attendant at large, attending the eastern palace.',
  ],
  s0142: [
    'In the second year of Taqing he was transferred to acting minister of personnel.',
    'In the second year of Taqing he was moved to acting minister of personnel.',
  ],
  s0143: [
    'That winter Hou Jing besieged the palace city; Xiang entered mourning for his mother inside the siege and died of grief at forty-four.',
    'That winter Hou Jing besieged the palace city; Xiang began mourning for his mother within the encirclement and died of grief at forty-four.',
  ],
  s0144: [
    'An edict posthumously granted his former office.',
    'An edict granted him posthumously his last office.',
  ],
  s0145: [
    'Xiang from youth was filial.',
    'From boyhood Xiang was deeply filial.',
  ],
  s0146: [
    'While serving as attendant his mother\'s illness grew critical and he asked Buddhist monks to pray for her.',
    'While he was attendant his mother fell gravely ill, and he asked Buddhist monks to pray for her recovery.',
  ],
  s0147: [
    'In the middle of the night he suddenly saw a strange light outside the door and heard snapping fingers in the air; by dawn the illness had passed.',
    'In the depth of night he suddenly saw an unearthly light outside the door and heard fingers snap in the air; by morning the sickness had lifted.',
  ],
  s0148: [
    'All held that this was brought about by Xiang\'s utmost sincerity.',
    'All agreed that this came of Xiang\'s perfect sincerity.',
  ],
  s0149: [
    'Xiao Jie, courtesy name Maojing, was a man of Lanling.',
    'Xiao Jie, styled Maojing, came from Lanling.',
  ],
  s0150: [
    'His grandfather Sihua was Song Grand Preceptor of Equipage and Vice Director of the Secretariat.',
    'His grandfather Sihua had been Song\'s grand preceptor of equipage and vice director of the secretariat.',
  ],
  s0151: [
    'His father Huixi was Qi Minister of the Left for the People.',
    'His father Huixi had been Qi\'s minister of the left for the people.',
  ],
  s0152: [
    'Jie in youth was quick and perceptive, possessed insight and breadth, read widely in the classics and histories, and was also skilled in literary composition.',
    'As a youth Jie was bright and far-seeing, with breadth of judgment; he ranged through the classics and histories and wrote with uncommon skill.',
  ],
  s0153: [
    'At the end of Yongyuan in Qi he was first appointed assistant editor in the Palace Library.',
    'At the close of Yongyuan in Qi he took his first post as assistant editor in the palace library.',
  ],
  s0154: [
    'In the sixth year of Tianjian he was made crown prince groom.',
    'In the sixth year of Tianjian he was made crown prince groom.',
  ],
  s0155: [
    'In the eighth year he was transferred to director of the ministry\'s bureau of metals.',
    'In the eighth year he was transferred to director of the ministry\'s bureau of metals.',
  ],
  s0156: [
    'In the twelfth year he became director of guest affairs.',
    'In the twelfth year he became director of guest affairs.',
  ],
  s0157: [
    'He went out as magistrate of Wu and won great renown for his achievements.',
    'He went out as magistrate of Wu and won a name for outstanding work.',
  ],
  s0158: [
    'The Prince of Xiangdong heard Jie\'s name and wished to enjoy his company, and memorialized to have him.',
    'The Prince of Xiangdong heard of Jie and wished his company, and memorialized to have him brought in.',
  ],
  s0159: [
    'In the third year of Putong he was finally made staff adviser to the Prince of Xiangdong.',
    'In the third year of Putong he was at last made staff adviser to the Prince of Xiangdong.',
  ],
  s0160: [
    'In the second year of Datong he was made supervising attendant of the yellow gate.',
    'In the second year of Datong he was made supervising attendant of the yellow gate.',
  ],
  s0161: [
    'In the second year of Datong the Prince of Wuling was made governor of Yangzhou and appointed Jie chief steward of his household; upright in office, he was praised at court.',
    'In the second year of Datong the Prince of Wuling became governor of Yangzhou and made Jie chief steward of his household; Jie kept his post clean and the court spoke well of him.',
  ],
  s0162: [
    'The Founding Emperor said to He Jingrong: "Xiao Jie is very poor—we could give him a commandery."',
    'The Founding Emperor said to He Jingrong, "Xiao Jie is very poor; we might set him over a commandery."',
  ],
  s0163: [
    'Jingrong did not answer; the Founding Emperor said: "Shixing commandery lately has lacked a good governor, and the people of the hills are somewhat unsettled—Jie may serve there."',
    'Jingrong made no reply; the Founding Emperor said, "Shixing commandery has lately lacked a capable governor, and the hill people are uneasy—Jie may go there."',
  ],
  s0164: [
    'Thereupon he went out as administrator of Shixing.',
    'So he was sent out as administrator of Shixing.',
  ],
  s0165: [
    'When Jie reached his post he proclaimed virtue and authority, and within the borders all was ordered.',
    'When Jie took up his post he proclaimed authority and virtue, and within the borders all was brought to order.',
  ],
  s0166: [
    'In the seventh year he was summoned as minister steward and soon given concurrent appointment as attendant at large.',
    'In the seventh year he was recalled as minister steward and soon given concurrent appointment as attendant at large.',
  ],
  s0167: [
    'When the post of attendant fell vacant the selection office nominated Wang Yun and three others; none pleased the throne, and the Founding Emperor said: "Our house has long lacked this office—Xiao Jie ought to fill it."',
    'When the post of attendant fell vacant the selection office put forward Wang Yun and three others; none suited the throne, and the Founding Emperor said, "Our house has long gone without this office—Xiao Jie should have it."',
  ],
  s0168: [
    'Jie was broadly learned with a powerful memory; in answering questions left and right he often corrected errors, and the Founding Emperor valued him highly.',
    'Jie was encyclopedic and quick of recall; at the emperor\'s side he often set matters right, and the Founding Emperor held him in high regard.',
  ],
  s0169: [
    'He was transferred to minister of the court for state offices; whenever great affairs of army or state arose, the emperor would first consult Jie.',
    'He was made minister of the court for state offices; whenever army or state faced a great decision, the emperor would first ask Jie.',
  ],
  s0170: [
    'The Founding Emperor said to Zhu Yi: "Material for the chief minister\'s seat."',
    'The Founding Emperor said to Zhu Yi, "Here is timber for the chief minister\'s chair."',
  ],
  s0171: [
    'In the second year of Zhongdatong he asked leave on grounds of illness; the Founding Emperor issued a gracious edict refusing permission.',
    'In the second year of Zhongdatong he asked to retire on grounds of illness; the Founding Emperor answered with a gracious edict that would not allow it.',
  ],
  s0172: [
    'He would not rise at last, so a palace messenger, Vice Director Wei Xiang, was sent to invest him as grand master for splendor.',
    'He still would not take up office, so the palace messenger and vice director Wei Xiang was sent to invest him as grand master for splendor.',
  ],
  s0173: [
    'In the Taqing period Hou Jing was defeated at Woyang and fled into Shouyang.',
    'In the Taqing troubles Hou Jing was beaten at Woyang and fled into Shouyang.',
  ],
  s0174: [
    'The Founding Emperor ordered Defense Chief Wei Mo to admit him; Jie heard of this and submitted a memorial remonstrating:',
    'The Founding Emperor ordered the defense chief Wei Mo to receive him; when Jie heard of it he submitted a memorial of remonstrance:',
  ],
  s0175: [
    'Your servant bears illness at home and has privately heard that Hou Jing, defeated at Woyang, came with a single horse to submit—yet Your Majesty, unmindful of the earlier disaster, again orders him received.',
    'Your servant lies ill at home, yet I have privately heard that Hou Jing, broken at Woyang, came with a single horse to surrender—and Your Majesty, unmindful of the earlier wound, again orders him taken in.',
  ],
  s0176: [
    'Your servant has heard that the nature of a vicious man does not change, and evil in the world is of one kind.',
    'I have heard that the nature of a wicked man never changes, and that evil under heaven is all of one kind.',
  ],
  s0177: [
    'Long ago Lü Bu killed Ding Yuan to serve Dong Zhuo, then in the end killed Dong and became a traitor;',
    'Long ago Lü Bu killed Ding Yuan to follow Dong Zhuo, then in the end killed Dong Zhuo and became a traitor in his turn;',
  ],
  s0178: [
    'Liu Lao rebelled against Wang Gong to join Jin, then turned against Jin and bred calamity.',
    'Liu Lao turned on Wang Gong to enter Jin\'s service, then betrayed Jin and raised rebellion.',
  ],
  s0179: [
    'Why?',
    'Why should this be?',
  ],
  s0180: [
    'The heart of a wolf\'s cub can never be tamed;',
    'The heart of a wolf\'s whelp can never be gentled;',
  ],
  s0181: [
    'the parable of raising a tiger must end in being devoured when it hungers.',
    'the old warning about feeding a tiger must end in being eaten when hunger comes.',
  ],
  s0182: [
    'Hou Jing is of the breed of beasts\' hearts, the kind that shrill on the arrow.',
    'Hou Jing belongs to the breed of beasts\' hearts, to the kind that whinny at the arrow.',
  ],
  s0183: [
    'With his fierce cunning he owed Gao Huan the favor of wings grown long, and his rank matched the Three Dukes while his charge lay over a frontier command;',
    'With his savage cunning he enjoyed Gao Huan\'s favor until his wings were full-grown; his rank matched the Three Dukes and his charge lay over a frontier command;',
  ],
  s0184: [
    'yet before Gao Huan\'s grave earth was dry he turned again to bite the hand that fed him.',
    'yet before the earth on Gao Huan\'s grave was dry he turned again to bite the hand that fed him.',
  ],
  s0185: [
    'When his rebellion lacked strength he fled for his life to the passes west;',
    'When his rebellion failed he fled for his life to the western passes;',
  ],
  s0186: [
    'Yuwen would not shelter him, so he threw himself upon us.',
    'Yuwen would not keep him, so he cast himself upon us.',
  ],
  s0187: [
    'Your Majesty earlier did not reject so small a stream precisely in order to use a barbarian who had surrendered to the Han to strike at the Xiongnu, hoping for the fruit of a single battle.',
    'Your Majesty earlier did not reject so small a stream precisely because you wished to use a surrendered barbarian of the Han to strike the Xiongnu, hoping for the fruit of a single battle.',
  ],
  s0188: [
    'Now he has lost his army and land and is merely a lone man on our border.',
    'Now he has lost his army and his land and is nothing but a lone man on our border.',
  ],
  s0189: [
    'Your Majesty cherishes this lone man and casts aside friendship with a state—your servant dares not approve.',
    'Your Majesty would cherish this lone man and cast aside friendship with a whole state—your servant dares not approve.',
  ],
  s0190: [
    'If the court still waits for his cock-crow at dawn, his effect at year\'s end, your servant ventures to think Hou Jing will never be the man of a year\'s close.',
    'If the court still waits for his cock-crow at dawn, his service at year\'s end, I venture to think Hou Jing will never be the man who brings a year to its close.',
  ],
  s0191: [
    'He cast off his homeland as one casts off a shoe, abandoned ruler and kin as one throws away chaff—how should he know to admire sagely virtue from afar and become a pure minister of the Huai and Jiang?',
    'He cast off his homeland as one casts off a shoe, abandoned ruler and kin as one throws away chaff—how should such a man know to admire sagely virtue from afar and become a loyal minister of the Huai and Jiang?',
  ],
  s0192: [
    'The facts are plain and admit no doubt.',
    'The record is plain and leaves no room for doubt.',
  ],
  s0193: [
    'If in one corner he is thus, how much more when every kind of conduct is told in full?',
    'If in one corner he is like this, how much more when every kind of deed is set forth in full?',
  ],
  s0194: [
    'Your servant is worn with age and sickness and ought not rashly to meddle in court governance.',
    'Your servant is worn with age and sickness and ought not rashly to meddle in the governance of the court.',
  ],
  s0195: [
    'Yet when Chu Shenba was dying he still had the loyalty that would defend Ying;',
    'Yet when Chu Shenba was dying he still had the loyalty that would defend Ying for his state;',
  ],
  s0196: [
    'when Weizi fish was at death\'s door he too had the integrity of remonstrating with his corpse.',
    'when the fish Weizi faced death he too had the integrity to remonstrate with his own corpse.',
  ],
  s0197: [
    'Your servant, unworthy, am an elder of the imperial clan; how could I forget the heart of Liu Xiang?',
    'Your servant, though unworthy, am an elder of the imperial clan; how could I forget the heart of Liu Xiang?',
  ],
  s0198: [
    'I bow and pray that Heaven\'s compassion may give some thought to words of peril and hardship.',
    'I bow and pray that Heaven\'s compassion may lend an ear to words of peril and hardship.',
  ],
  s0199: [
    'The Founding Emperor read the memorial and sighed but in the end did not adopt it.',
    'The Founding Emperor read the memorial, sighed, and in the end did not follow it.',
  ],
  s0200: [
    'By nature Jie was lofty and spare and made few intimates; only with his clansman Chen, his elder cousin\'s son Shisu, Qia, and his younger cousin\'s son Shu and others did he meet for wine and literary pleasure—men of the time compared them to the black-robed gatherings of the Xie clan.',
    'By nature Jie was lofty and reserved and kept few companions; only with his clansman Chen, his elder cousin\'s son Shisu, Qia, and his younger cousin\'s son Shu and others did he gather for wine and literary pleasure—men of the day compared them to the black-robed outings of the Xie clan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_041_b2.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
